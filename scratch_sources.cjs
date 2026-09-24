const fs = require('fs');

const alg = require('./src/data/questions/algebra.json');
const adv = require('./src/data/questions/advanced-math.json');
const geo = require('./src/data/questions/geometry-trig.json');
const ps = require('./src/data/questions/problem-solving.json');
const allQ = [...alg, ...adv, ...geo, ...ps];

const sources = {};
allQ.forEach(q => {
  if (q.source) {
    sources[q.source] = (sources[q.source] || 0) + 1;
  }
});
console.log('All custom/topic sources currently in all questions:');
Object.entries(sources).forEach(([s, c]) => {
  if (!s.match(/(March|May|June|August|October|November|December)\s+(US\s+|Int\s+)?202[3-5]/)) {
    console.log(' - ' + s + ' (' + c + ' questions)');
  }
});
