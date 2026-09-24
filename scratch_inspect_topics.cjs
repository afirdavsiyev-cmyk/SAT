const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.mjs');

async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument({ data }).promise;
  console.log(`\n=== File: ${filePath} (Pages: ${doc.numPages}) ===`);
  let fullText = '';
  for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(' ');
    console.log(`--- Page ${i} (preview) ---`);
    console.log(strings.slice(0, 300));
    fullText += strings + '\n';
  }
  return { numPages: doc.numPages, length: fullText.length };
}

async function run() {
  const candidates = [
    'questions_to_add/topic_based/topic_advanced_math_07_sat-functions.pdf',
    'questions_to_add/topic_based/topic_advanced_math_02_mock-functions.pdf',
    'questions_to_add/topic_based/topic_advanced_math_11_sat-new-functions-test.pdf',
    'questions_to_add/topic_based/topic_advanced_math_13_sat-turbo-prep-advanced-test_3.pdf',
    'questions_to_add/topic_based/topic_advanced_math_04_sat_math_advanced_questions.pdf',
    'questions_to_add/topic_based/topic_geometry_trig_01_lines_and_angles.pdf',
    'questions_to_add/topic_based/topic_geometry_trig_02_lines_angles_triangles.pdf',
    'questions_to_add/topic_based/topic_problem_solving_01_probability.pdf',
    'questions_to_add/topic_based/topic_problem_solving_06_sat_math_context_problems.pdf',
    'questions_to_add/topic_based/topic_problem_solving_07_sat_statistics_important.pdf'
  ];

  for (const c of candidates) {
    try {
      await extractPdfText(c);
    } catch (e) {
      console.error(`Error reading ${c}:`, e.message);
    }
  }
}

run();
