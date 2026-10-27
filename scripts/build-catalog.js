const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../books/content');
const catalogPath = path.join(__dirname, '../books/catalog.json');

const defaultBookLevels = {
  "biz-11": "A1", "biz-12": "C2", "biz-13": "C1",
  "classic-11": "B2", "classic-12": "B2", "classic-13": "C1", "classic-14": "B1", "classic-15": "C2", "classic-16": "B1", "classic-17": "A2", "classic-18": "B2", "classic-19": "B1", "classic-20": "B1",
  "daily-11": "B2", "daily-12": "C1", "daily-13": "C2", "daily-14": "B1", "daily-15": "B1", "daily-16": "B2", "daily-17": "A2", "daily-18": "B1", "daily-20": "B2",
  "healthy-1": "B1", "scifi-10": "C2", "scifi-11": "B2", "scifi-12": "B1", "scifi-13": "B2", "scifi-14": "C1", "scifi-15": "C2", "scifi-16": "B1", "scifi-17": "B1", "scifi-18": "B2", "scifi-19": "A2", "scifi-20": "B2"
};

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
const catalogMap = {};

files.forEach(file => {
  try {
    const fullPath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const targetLvl = defaultBookLevels[data.id] || data.level || 'B1';

    // Select the file that matches the default level for catalog metadata
    if (data.level === targetLvl || !catalogMap[data.id]) {
      const meta = { ...data };
      delete meta.story;
      meta.level = targetLvl;
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
console.log(`Success! ${catalog.length} unique books compiled into books/catalog.json`);
