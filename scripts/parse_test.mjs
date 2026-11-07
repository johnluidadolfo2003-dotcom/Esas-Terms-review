import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function main() {
  const buf = new Uint8Array(fs.readFileSync('public/assets/aistudio/COACH_G_1000_TERMS_54292455.pdf'));
  const doc = await pdfjs.getDocument({ data: buf, standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/' }).promise;

  const page = await doc.getPage(1);
  const tc = await page.getTextContent();
  const leftItems = tc.items.filter(it => it.transform[4] < 295 && it.str.trim());

  // Sort by Y descending, then X ascending
  leftItems.sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5];
    if (Math.abs(yDiff) > 3) return yDiff;
    return a.transform[4] - b.transform[4];
  });

  const lines = [];
  let currentLine = [];
  let currentY = null;

  for (const it of leftItems) {
    if (currentY === null || Math.abs(currentY - it.transform[5]) <= 3) {
      currentLine.push(it);
      currentY = it.transform[5];
    } else {
      lines.push(currentLine);
      currentLine = [it];
      currentY = it.transform[5];
    }
  }
  if (currentLine.length) lines.push(currentLine);

  for (let i = 0; i < Math.min(35, lines.length); i++) {
    const lineStr = lines[i].map(x => x.str).join(' ');
    console.log(`L${i} (y=${lines[i][0].transform[5].toFixed(1)}): ${lineStr}`);
  }
}

main().catch(console.error);
