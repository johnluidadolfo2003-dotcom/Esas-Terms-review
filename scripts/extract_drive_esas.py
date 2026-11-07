#!/usr/bin/env python3
"""Extract multiple-choice ESAS questions and highlighted answers from Drive PDFs.

The source directory and manifest are transient inputs. The generated JSON keeps
provenance, page, source question number, choices, answer evidence, and OCR text.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import pdfplumber
from PIL import Image
import numpy as np
from scipy import ndimage


CHOICE_RE = re.compile(r"(?<![A-Za-z0-9])([A-E])\s*[.\)\-:]\s*")
QUESTION_RE = re.compile(r"(?m)^\s*(\d{1,3})\s*[.\):,\-]{1,3}\s*")


def clean(text: str) -> str:
    text = text.replace("\u00ad", "").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    return text.strip(" \n\t|-")


def norm(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def parse_blocks(text: str) -> list[dict[str, Any]]:
    matches = list(QUESTION_RE.finditer(text))
    out: list[dict[str, Any]] = []
    for idx, match in enumerate(matches):
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        body = text[match.end():end].strip()
        choice_matches = list(CHOICE_RE.finditer(body))
        if len(choice_matches) < 2:
            continue
        stem = clean(body[:choice_matches[0].start()])
        choices = []
        for ci, cm in enumerate(choice_matches):
            cend = choice_matches[ci + 1].start() if ci + 1 < len(choice_matches) else len(body)
            value = clean(body[cm.end():cend])
            if value:
                choices.append({"id": cm.group(1), "text": value})
        ids = [c["id"] for c in choices]
        # OCR sometimes repeats labels; retain only the first contiguous A-D/E set.
        dedup: list[dict[str, str]] = []
        for choice in choices:
            if choice["id"] not in {c["id"] for c in dedup}:
                dedup.append(choice)
        if stem and len(dedup) >= 2:
            out.append({
                "questionNumber": int(match.group(1)),
                "question": stem,
                "choices": dedup,
                "rawSnippet": clean(match.group(0) + body),
            })
    return out


def highlighted_fragments(page: pdfplumber.page.Page) -> list[str]:
    curves = [c for c in page.curves if c.get("fill") and isinstance(c.get("non_stroking_color"), tuple)]
    if not curves:
        return []
    marked = []
    for ch in page.chars:
        cx = (ch["x0"] + ch["x1"]) / 2
        cy = (ch["top"] + ch["bottom"]) / 2
        if any(c["x0"] <= cx <= c["x1"] and c["top"] <= cy <= c["bottom"] for c in curves):
            marked.append(ch)
    groups: list[list[dict[str, Any]]] = []
    for ch in sorted(marked, key=lambda c: (c["top"], c["x0"])):
        group = next((g for g in groups if abs(g[0]["top"] - ch["top"]) < 2), None)
        if group is None:
            groups.append([ch])
        else:
            group.append(ch)
    return [clean("".join(c["text"] for c in sorted(g, key=lambda c: c["x0"]))) for g in groups]


def assign_highlight(question: dict[str, Any], fragments: list[str]) -> tuple[str | None, str | None]:
    best: tuple[float, str, str] | None = None
    for choice in question["choices"]:
        ct = norm(f'{choice["id"]} {choice["text"]}')
        for fragment in fragments:
            ft = norm(fragment)
            if not ft or not ct:
                continue
            cwords, fwords = set(ct.split()), set(ft.split())
            overlap = len(cwords & fwords) / max(1, len(cwords | fwords))
            if ct in ft or ft in ct:
                overlap = max(overlap, 0.95)
            if re.match(rf"^{choice['id'].lower()}\b", ft):
                overlap += 0.2
            if best is None or overlap > best[0]:
                best = (overlap, choice["id"], fragment)
    if best and best[0] >= 0.58:
        return best[1], best[2]
    return None, None


def extract_vector(pdf_path: Path) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    with pdfplumber.open(pdf_path) as pdf:
        carry = ""
        for page_number, page in enumerate(pdf.pages, 1):
            text = page.extract_text(x_tolerance=2, y_tolerance=3) or ""
            fragments = highlighted_fragments(page)
            blocks = parse_blocks(carry + "\n" + text)
            carry = ""
            for question in blocks:
                answer, evidence = assign_highlight(question, fragments)
                question.update({
                    "sourcePage": page_number,
                    "correctChoiceId": answer,
                    "answerEvidence": "vector-highlight" if answer else None,
                    "highlightText": evidence,
                })
                out.append(question)
    return out


def is_highlight_pixel(r: int, g: int, b: int) -> bool:
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 120 or mx - mn < 28:
        return False
    # Green/cyan/orange highlighters used by the source sets.
    green_cyan = g >= r * 0.92 and g >= b * 0.95 and g > 135
    orange = r > 190 and 70 < g < 210 and b < 150
    return green_cyan or orange


def raster_highlight_fragments(pdf_path: Path, page_number: int, work: Path) -> list[str]:
    prefix = work / "page"
    subprocess.run([
        "pdftoppm", "-f", str(page_number), "-singlefile", "-png", "-r", "140",
        str(pdf_path), str(prefix),
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    image_path = prefix.with_suffix(".png")
    image = Image.open(image_path).convert("RGB")
    rgb = np.asarray(image)
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    colorful = (mx > 120) & ((mx.astype(np.int16) - mn.astype(np.int16)) > 28)
    green_cyan = (g.astype(float) >= r * .92) & (g.astype(float) >= b * .95) & (g > 135)
    orange = (r > 190) & (g > 70) & (g < 210) & (b < 150)
    mask = colorful & (green_cyan | orange)
    # Join the colored area around black glyph holes into one answer-line region.
    mask = ndimage.binary_closing(mask, structure=np.ones((3, 11), dtype=bool), iterations=2)
    mask = ndimage.binary_dilation(mask, structure=np.ones((3, 5), dtype=bool), iterations=1)
    labels, count = ndimage.label(mask)
    objects = ndimage.find_objects(labels)
    fragments: list[str] = []
    for label_id, slices in enumerate(objects, 1):
        if slices is None:
            continue
        ys, xs = slices
        x0, x1, y0, y1 = xs.start, xs.stop, ys.start, ys.stop
        width, height = x1 - x0, y1 - y0
        area = int((labels[slices] == label_id).sum())
        if width < 24 or height < 5 or height > 90 or area < 80:
            continue
        pad_x, pad_y = 8, 5
        crop = image.crop((max(0, x0-pad_x), max(0, y0-pad_y), min(image.width, x1+pad_x), min(image.height, y1+pad_y)))
        crop_path = work / f"crop-{page_number}-{label_id}.png"
        crop.save(crop_path)
        run = subprocess.run([
            "tesseract", str(crop_path), "stdout", "--psm", "7"
        ], check=False, text=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        value = clean(run.stdout)
        if value:
            fragments.append(value)
    return fragments


def extract_ocr(pdf_path: Path, text_path: Path) -> list[dict[str, Any]]:
    page_texts = text_path.read_text(encoding="utf-8", errors="ignore").split("\f")
    out: list[dict[str, Any]] = []
    with tempfile.TemporaryDirectory(prefix="esas-highlight-") as tmp:
        work = Path(tmp)
        for page_number, page_text in enumerate(page_texts, 1):
            blocks = parse_blocks(page_text)
            if not blocks:
                continue
            try:
                fragments = raster_highlight_fragments(pdf_path, page_number, work)
            except Exception:
                fragments = []
            for question in blocks:
                answer, evidence = assign_highlight(question, fragments)
                question.update({
                    "sourcePage": page_number,
                    "correctChoiceId": answer,
                    "answerEvidence": "raster-highlight" if answer else None,
                    "highlightText": evidence,
                })
                out.append(question)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--text-dir", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--ids", nargs="*")
    parser.add_argument("--raster", action="store_true")
    parser.add_argument("--prefer-ocr", action="store_true")
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text())
    wanted = set(args.ids or [])
    results = []
    for source in manifest:
        if wanted and source["id"] not in wanted:
            continue
        pdf_path = Path(source["localPath"])
        plain = args.text_dir / f'{source["id"]}.txt'
        ocr = args.text_dir / f'{source["id"]}.ocr.txt'
        use_vector = (not args.prefer_ocr) and plain.exists() and plain.stat().st_size > 1000 and source["id"] != "1AXQ-PYsjUQNQJxyhVL_xedKrMYAe_F-8"
        if use_vector:
            questions = extract_vector(pdf_path)
            mode = "vector"
        elif args.raster and ocr.exists():
            questions = extract_ocr(pdf_path, ocr)
            mode = "ocr"
        else:
            questions = []
            mode = "unprocessed"
        for q in questions:
            q.update({
                "sourceFileId": source["id"],
                "sourceFileName": source["title"],
                "sourcePath": source["path"],
                "extractionMode": mode,
            })
        results.extend(questions)
        print(f'{source["title"]}: {len(questions)} questions, {sum(bool(q["correctChoiceId"]) for q in questions)} answers')
    args.output.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"TOTAL: {len(results)} questions, {sum(bool(q['correctChoiceId']) for q in results)} answers")


if __name__ == "__main__":
    main()
