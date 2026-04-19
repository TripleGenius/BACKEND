const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./olen.json', 'utf8'));
const MODULE_ID = process.argv[2];

if (!MODULE_ID) {
  console.error('Usage: node seed-olen.js <moduleId>');
  process.exit(1);
}

const docs = [];
const keys = Object.keys(data).map(Number).sort((a, b) => a - b);

for (let i = 0; i < keys.length; i += 2) {
  const qKey = keys[i];
  const aKey = keys[i + 1];
  if (aKey === undefined) break;

  docs.push({
    question: data[String(qKey)],
    answer: data[String(aKey)],
    order: Math.ceil(qKey / 2),
    moduleId: { $oid: MODULE_ID },
  });
}

fs.writeFileSync('./olen-seed.json', JSON.stringify(docs, null, 2));
console.log(`Written ${docs.length} documents to olen-seed.json`);
