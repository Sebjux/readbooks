const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../books/content');
const catalogPath = path.join(__dirname, '../books/catalog.json');

if (!fs.existsSync(contentDir)) {
  console.error('Error: books/content directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
const catalogMap = {};

files.forEach(file => {
  try {
    const fullPath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!catalogMap[data.id]) {
      const meta = { ...data };
      delete meta.story;
      catalogMap[data.id] = meta;
    }
  } catch (err) {
    console.warn(`Warning: Could not parse ${file}:`, err.message);
  }
});

const catalog = Object.values(catalogMap);

// Sort by dateAdded descending
catalog.sort((a, b) => {
  const da = new Date(a.dateAdded || '1970-01-01').getTime();
  const db = new Date(b.dateAdded || '1970-01-01').getTime();
  return db - da;
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log(`Success! ${catalog.length} books compiled into books/catalog.json`);
