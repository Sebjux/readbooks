const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../books/content');
const catalogPath = path.join(__dirname, '../books/catalog.json');

const defaultBookLevels = {
  "scifi-8": "B2", "scifi-7": "C2", "scifi-6": "A1", "scifi-5": "C1",
  "scifi-4": "B1", "scifi-3": "B2", "scifi-2": "C1", "scifi-1": "B2",
  "biz-7": "C2", "biz-6": "A1", "biz-5": "B1", "biz-4": "B2",
  "biz-3": "A2", "biz-2": "B1", "biz-1": "B2",
  "classic-8": "C2", "classic-7": "A1", "classic-6": "C1", "classic-5": "B1",
  "classic-4": "B2", "classic-3": "B1", "classic-2": "C1", "classic-1": "C1",
  "daily-7": "C2", "daily-6": "A1", "daily-5": "A2", "daily-4": "B1",
  "daily-3": "B1", "daily-2": "A2", "daily-1": "A2",
  "healthy-1": "B1", "epic-novel-1": "C1"
};

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));
const catalogMap = {};

files.forEach(file => {
  try {
    const fullPath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const targetLvl = defaultBookLevels[data.id] || 'B1';

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
