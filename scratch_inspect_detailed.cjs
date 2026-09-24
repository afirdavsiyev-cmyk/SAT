const fs = require('fs');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.mjs');

async function inspect(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjs.getDocument({ data }).promise;
  let text = '';
  let imgCount = 0;
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    text += tc.items.map(x => x.str).join(' ') + '\n';
    const ops = await page.getOperatorList();
    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] === pdfjs.OPS.paintImageXObject || ops.fnArray[j] === pdfjs.OPS.paintInlineImageXObject) {
        imgCount++;
      }
    }
  }
  return {
    pages: doc.numPages,
    textLen: text.length,
    imgCount,
    sample: text.replace(/\s+/g, ' ').slice(0, 200)
  };
}

async function main() {
  const files = [
    'topic_geometry_trig_01_lines_and_angles.pdf',
    'topic_geometry_trig_02_lines_angles_triangles.pdf',
    'topic_geometry_trig_03_sat-solids.pdf',
    'topic_geometry_trig_04_triangles-output.pdf',
    'topic_advanced_math_04_sat_math_advanced_questions.pdf',
    'topic_advanced_math_05_sat_quadratics-2025__official_latest_questions.pdf',
    'topic_advanced_math_06_sat_quadratics-2025_latest_questions.pdf',
    'topic_advanced_math_11_sat-new-functions-test.pdf',
    'topic_advanced_math_13_sat-turbo-prep-advanced-test_3.pdf',
    'topic_problem_solving_01_probability.pdf',
    'topic_problem_solving_02_problem-solving-percents-ratio-proportion.pdf',
    'topic_problem_solving_06_sat_math_context_problems.pdf',
    'topic_problem_solving_07_sat_statistics_important.pdf'
  ];

  for (const f of files) {
    try {
      const info = await inspect('questions_to_add/topic_based/' + f);
      console.log(`${f}: pages=${info.pages}, textLen=${info.textLen}, images=${info.imgCount}`);
      console.log(`   Sample: ${info.sample}`);
    } catch (e) {
      console.log(`${f}: ERROR ${e.message}`);
    }
  }
}
main();
