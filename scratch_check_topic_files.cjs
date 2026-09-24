const fs = require('fs');
const manifest = fs.readFileSync('questions_to_add/MIGRATION_MANIFEST.md', 'utf8');

const lines = manifest.split('\n');
const topicFiles = [];
let inSec2 = false;
for (const line of lines) {
  if (line.includes('## 2. Topic-Based Problem Sets')) inSec2 = true;
  if (line.includes('## 3. Other')) inSec2 = false;
  if (inSec2 && line.startsWith('|') && line.includes('`topic_')) {
    const parts = line.split('|').map(s => s.trim());
    topicFiles.push({
      num: parts[1],
      stdName: parts[2].replace(/`/g, ''),
      domain: parts[3],
      topic: parts[4],
      origName: parts[5].replace(/`/g, ''),
      size: parts[6]
    });
  }
}

const alg = require('./src/data/questions/algebra.json');
const adv = require('./src/data/questions/advanced-math.json');
const geo = require('./src/data/questions/geometry-trig.json');
const ps = require('./src/data/questions/problem-solving.json');
const allQ = [...alg, ...adv, ...geo, ...ps];
const existingSources = new Set(allQ.map(q => q.source));

console.log('Total topic files in manifest: ' + topicFiles.length);
topicFiles.forEach(tf => {
  const matches = [...existingSources].filter(s => {
    if (!s) return false;
    const sLow = s.toLowerCase();
    const origLow = tf.origName.toLowerCase().replace('.pdf', '');
    return sLow.includes(origLow) || origLow.includes(sLow);
  });
  console.log(tf.num + '. [' + (matches.length > 0 ? 'ADDED (' + matches.join(',') + ')' : 'PENDING') + '] ' + tf.stdName + ' | ' + tf.domain + ' | ' + tf.origName);
});
