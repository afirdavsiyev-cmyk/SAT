const fs = require('fs');
const content = fs.readFileSync('src/data/topicQuestionsData.ts', 'utf8');
const regex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"filename":\s*"([^"]+)"/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(`${count}. [${match[1]}] ${match[2]} -> ${match[3]}`);
}
console.log('Total topic entries in topicQuestionsData.ts:', count);
