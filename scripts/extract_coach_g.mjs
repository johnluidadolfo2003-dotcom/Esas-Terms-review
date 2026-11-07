import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractAll() {
  const buf = new Uint8Array(fs.readFileSync('public/assets/aistudio/COACH_G_1000_TERMS_54292455.pdf'));
  const doc = await pdfjs.getDocument({ data: buf, standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/' }).promise;

  const sets = [];
  // 10 sets, each spanning 3 pages: [1,2,3], [4,5,6], ..., [28,29,30]
  for (let s = 1; s <= 10; s++) {
    const pageNums = [(s - 1) * 3 + 1, (s - 1) * 3 + 2, (s - 1) * 3 + 3];
    sets.push({ setNum: s, pageNums });
  }

  for (const set of sets) {
    console.log(`Processing Set ${set.setNum} (pages ${set.pageNums.join(',')})...`);
    for (const p of set.pageNums) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      const ops = await page.getOperatorList();
      
      const highlights = [];
      for (let i = 0; i < ops.fnArray.length; i++) {
        if (ops.fnArray[i] === pdfjs.OPS.constructPath && ops.argsArray[i][0] !== 28) {
          highlights.push(ops.argsArray[i][2]);
        }
      }
      console.log(`  Page ${p}: ${tc.items.length} items, ${highlights.length} highlight paths`);
    }
  }
}

extractAll().catch(console.error);
