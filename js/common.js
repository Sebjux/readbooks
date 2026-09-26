/* ================================================================
   COMMON DATA MODEL & UTILITIES
   ================================================================ */
const LEVEL_COLORS = { A1:'#34D399', A2:'#4CF5E0', B1:'#7CACF8', B2:'#9B7BFF', C1:'#F472B6', C2:'#FB7185' };

const GENRE_ICONS = {
  scifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c2.5 2 4 5.5 4 9 0 2-1 4-1 4h-6s-1-2-1-4c0-3.5 1.5-7 4-9z"/><circle cx="12" cy="9" r="1.4"/><path d="M9 15l-2.5 4M15 15l2.5 4M10 19h4"/></svg>',
  business: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
  classic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-6 0-13 3-15 11-1 3 1 5 4 4 8-2 11-9 11-15z"/><path d="M9 15L4 20"/></svg>',
  daily: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h13v8H9l-4 3.5V13H3z"/><path d="M21 9v6.5h-3V19l-3.5-3.5H11"/></svg>'
};

let BOOKS = [];
let STORY = {};
const bookContentCache = {};

async function loadAllBooks() {
  try {
    const res = await fetch('books/catalog.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    BOOKS = await res.json();
  } catch (err) {
    console.error('Failed to load books/catalog.json:', err);
    BOOKS = [];
  }
}

async function fetchBookContent(bookId, level) {
  const selectedLevel = (level || 'B1').toUpperCase();
  const cacheKey = `${bookId}-${selectedLevel}`;
  if (bookContentCache[cacheKey]) {
    return bookContentCache[cacheKey];
  }
  try {
    const res = await fetch(`books/content/${encodeURIComponent(bookId)}-${selectedLevel.toLowerCase()}.json`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const content = await res.json();
    bookContentCache[cacheKey] = content;
    return content;
  } catch (err) {
    console.error(`Failed to load book content for ${bookId} level ${selectedLevel}:`, err);
    return null;
  }
}

function getBookPages(book, variant) {
  if (book && book.story && book.story[variant]) {
    return book.story[variant];
  }
  if (book && book.story) {
    const firstAvailable = Object.keys(book.story)[0];
    if (firstAvailable && book.story[firstAvailable]) return book.story[firstAvailable];
  }
  return STORY[variant] || STORY['C1'] || [];
}

function getSortedBooks(list) {
  return list.slice().sort((a, b) => {
    const da = new Date(a.dateAdded || '1970-01-01').getTime();
    const db = new Date(b.dateAdded || '1970-01-01').getTime();
    return db - da;
  });
}

function formatDateAdded(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

const HERO_BOOK_ID = 'scifi-3';

/* ================================================================
   LANGUAGE PICKER
   ================================================================ */
const LANGUAGES = [
  { code:'sk', flag:'🇸🇰', name:'Slovenčina',      continent:'Europe' },
  { code:'cs', flag:'🇨🇿', name:'Čeština',         continent:'Europe' },
  { code:'de', flag:'🇩🇪', name:'Deutsch',         continent:'Europe' },
  { code:'fr', flag:'🇫🇷', name:'Français',        continent:'Europe' },
  { code:'es', flag:'🇪🇸', name:'Español',         continent:'Europe' },
  { code:'it', flag:'🇮🇹', name:'Italiano',        continent:'Europe' },
  { code:'pl', flag:'🇵🇱', name:'Polski',          continent:'Europe' },
  { code:'ru', flag:'🇷🇺', name:'Русский',         continent:'Europe' },
  { code:'uk', flag:'🇺🇦', name:'Українська',      continent:'Europe' },
  { code:'el', flag:'🇬🇷', name:'Ελληνικά',        continent:'Europe' },
  { code:'ro', flag:'🇷🇴', name:'Română',          continent:'Europe' },
  { code:'nl', flag:'🇳🇱', name:'Nederlands',      continent:'Europe' },
  { code:'sv', flag:'🇸🇪', name:'Svenska',         continent:'Europe' },
  { code:'tr', flag:'🇹🇷', name:'Türkçe',          continent:'Europe' },
  { code:'pt', flag:'🇵🇹', name:'Português',       continent:'Americas' },
  { code:'zh', flag:'🇨🇳', name:'中文',            continent:'Asia' },
  { code:'ja', flag:'🇯🇵', name:'日本語',          continent:'Asia' },
  { code:'ko', flag:'🇰🇷', name:'한국어',          continent:'Asia' },
  { code:'hi', flag:'🇮🇳', name:'हिन्दी',          continent:'Asia' },
  { code:'ar', flag:'🇸🇦', name:'العربية',         continent:'Asia' },
  { code:'th', flag:'🇹🇭', name:'ไทย',             continent:'Asia' },
  { code:'vi', flag:'🇻🇳', name:'Tiếng Việt',      continent:'Asia' },
  { code:'id', flag:'🇮🇩', name:'Bahasa Indonesia',continent:'Asia' },
  { code:'he', flag:'🇮🇱', name:'עברית',           continent:'Asia' }
];
const FULLY_TRANSLATED_LANGS = ['sk','cs','de','fr','es','it','pl','ru','zh','ja'];

function loadLang(){
  try{ return localStorage.getItem('lumen_lang_v1') || 'sk'; }catch(e){ return 'sk'; }
}
function saveLang(code){
  try{ localStorage.setItem('lumen_lang_v1', code); }catch(e){ /* ignore */ }
}
let currentLang = loadLang();

function renderLangMenu(){
  const langMenuEl = document.getElementById('langMenu');
  if (!langMenuEl) return;
  const continents = ['Europe','Americas','Asia'];
  const labels = { Europe:'Europe', Americas:'Americas', Asia:'Asia' };
  let html = '';
  continents.forEach((cont) => {
    const langs = LANGUAGES.filter((l) => l.continent === cont);
    if (!langs.length) return;
    html += '<p class="lang-group-label">' + labels[cont] + '</p><div class="lang-grid">';
    langs.forEach((l) => {
      const hasDict = FULLY_TRANSLATED_LANGS.indexOf(l.code) !== -1;
      html += '<button class="lang-option' + (l.code === currentLang ? ' active' : '') + (hasDict ? '' : ' no-dict') + '" data-lang="' + l.code + '" title="' + escapeHtml(l.name) + (hasDict ? '' : ' — coming soon') + '">' +
        '<span class="flag">' + l.flag + '</span><span class="name">' + escapeHtml(l.name) + '</span>' +
      '</button>';
    });
    html += '</div>';
  });
  langMenuEl.innerHTML = html;
}

function openLangMenu(){
  const langMenuEl = document.getElementById('langMenu');
  if (!langMenuEl) return;
  renderLangMenu();
  langMenuEl.hidden = false;
  requestAnimationFrame(() => langMenuEl.classList.add('open'));
}
function closeLangMenu(){
  const langMenuEl = document.getElementById('langMenu');
  if (!langMenuEl) return;
  langMenuEl.classList.remove('open');
  setTimeout(() => { langMenuEl.hidden = true; }, 170);
}

const SEARCH_PLACEHOLDERS = {
  sk: 'Hľadať názvy alebo autorov…',
  cs: 'Hledat názvy nebo autory…',
  de: 'Titel oder Autoren suchen…',
  fr: 'Rechercher des titres ou des auteurs…',
  es: 'Buscar títulos o autores…',
  it: 'Cerca titoli o autori…',
  pl: 'Szukaj tytułów lub autorów…',
  ru: 'Поиск названий или авторов…',
  uk: 'Шукати назви або авторів…',
  en: 'Search titles or authors…'
};

function updateSearchPlaceholder() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const lang = currentLang || 'en';
  input.placeholder = SEARCH_PLACEHOLDERS[lang] || SEARCH_PLACEHOLDERS['en'];
}

function initLangTrigger(){
  currentLang = loadLang();
  const langTriggerEl = document.getElementById('langTrigger');
  const langMenuEl = document.getElementById('langMenu');
  const langTriggerFlagEl = document.getElementById('langTriggerFlag');
  if (!langTriggerEl) return;

  const picked = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  if (langTriggerFlagEl) langTriggerFlagEl.textContent = picked.flag;
  updateSearchPlaceholder();

  if (langTriggerEl.dataset.initialized) return;
  langTriggerEl.dataset.initialized = "true";

  langTriggerEl.addEventListener('click', (e) => {
    e.stopPropagation();
    if (langMenuEl.classList.contains('open')) closeLangMenu(); else openLangMenu();
  });
  langMenuEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-option');
    if (!btn) return;
    currentLang = btn.dataset.lang;
    saveLang(currentLang);
    const picked = LANGUAGES.find((l) => l.code === currentLang);
    if (picked && langTriggerFlagEl) langTriggerFlagEl.textContent = picked.flag;
    updateSearchPlaceholder();
    closeLangMenu();
    renderVocabDrawer();
    const popoverEl = document.getElementById('wordPopover');
    if (activeWordEl && popoverEl && popoverEl.classList.contains('visible')){
      popoverEl.innerHTML = renderPopoverContent(popoverEl.dataset.word, activeWordEl.textContent);
      fetchWordData(activeWordEl.textContent.trim(), currentLang);
    }
  });
  document.addEventListener('click', (e) => {
    const langPicker = document.getElementById('langPicker');
    if (langPicker && !langPicker.contains(e.target)) closeLangMenu();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLangTrigger);
} else {
  initLangTrigger();
}

const PHRASE_LIST = [
  'three years', 'for the first time', 'piece by piece', 'within the hour',
  'in one hour', 'cold window', 'cold viewport', 'beyond the ice moons',
  'past the icy moons', 'past the cold moons'
];

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}
function formatTime(mins){
  const h = Math.floor(mins/60), m = mins%60;
  if (h === 0) return m + 'm';
  if (m === 0) return h + 'h';
  return h + 'h ' + m + 'm';
}
function tokenizeWord(segment){
  const match = segment.match(/^([A-Za-z']+)([^A-Za-z']*)$/);
  if (match){
    const wordPart = match[1];
    const punctPart = match[2];
    const key = wordPart.toLowerCase();
    return '<span class="w" data-w="' + key + '">' + escapeHtml(wordPart) + '</span>' + escapeHtml(punctPart);
  }
  return escapeHtml(segment);
}
const SORTED_PHRASES = PHRASE_LIST.slice().sort((a, b) => b.length - a.length);
function tokenize(text){
  const PSTART = '\uE000', PEND = '\uE001';
  let marked = text;
  SORTED_PHRASES.forEach((phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\b' + escaped + '\\b', 'gi');
    marked = marked.replace(re, (m) => PSTART + m + PEND);
  });

  let html = '', i = 0;
  while (i < marked.length){
    if (marked[i] === PSTART){
      const end = marked.indexOf(PEND, i);
      const phraseText = marked.slice(i + 1, end);
      const key = phraseText.toLowerCase();
      html += '<span class="w phrase" data-w="' + key + '">' + escapeHtml(phraseText) + '</span>';
      i = end + 1;
    } else {
      let next = marked.indexOf(PSTART, i);
      if (next === -1) next = marked.length;
      html += marked.slice(i, next).replace(/[A-Za-z']+|[^A-Za-z']+/g, tokenizeWord);
      i = next;
    }
  }
  return html;
}
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

function coverInnerHTML(book){
  return '' +
    '<div class="cover-pattern pattern-' + book.genre + '"></div>' +
    '<div class="cover-icon">' + (GENRE_ICONS[book.genre] || '') + '</div>' +
    '<div class="cover-text">' +
      '<p class="cover-title">' + escapeHtml(book.title) + '</p>' +
      '<p class="cover-author">' + escapeHtml(book.author) + '</p>' +
    '</div>';
}
function paintCover(el, book){
  el.style.setProperty('--c1', book.c1);
  el.style.setProperty('--c2', book.c2);
  el.innerHTML = coverInnerHTML(book);
}

/* ================================================================
   READING STATUS & PROGRESS (localStorage)
   ================================================================ */
function loadReadingStatusMap(){
  try{
    const raw = localStorage.getItem('readingStatus');
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}

function saveReadingStatusMap(map){
  try{
    localStorage.setItem('readingStatus', JSON.stringify(map));
  }catch(e){ /* storage unavailable */ }
}

function getBookStatus(bookId){
  const map = loadReadingStatusMap();
  return map[bookId] || 'unread';
}

function setBookStatus(bookId, status){
  const map = loadReadingStatusMap();
  map[bookId] = status;
  saveReadingStatusMap(map);
}

function loadReadingProgress(){
  try{
    const raw = localStorage.getItem('readingProgress');
    return raw ? JSON.parse(raw) : { books: {} };
  }catch(e){
    return { books: {} };
  }
}

function saveReadingProgress(data){
  try{
    localStorage.setItem('readingProgress', JSON.stringify(data));
  }catch(e){ /* storage unavailable */ }
}

function updateBookProgress(bookId, pageIndex, totalPages, level){
  if (!bookId) return;
  const data = loadReadingProgress();
  if (!data.books) data.books = {};

  const progressKey = level ? `${bookId}:${level}` : bookId;
  const total = totalPages || 1;
  const isEnd = (pageIndex >= total - 1);
  const progress = Math.min(100, Math.max(0, Math.round(((pageIndex + 1) / total) * 100)));
  const completed = isEnd || (progress === 100);

  const entry = {
    bookId: bookId,
    level: level || 'B1',
    progress: progress,
    lastRead: new Date().toISOString(),
    completed: completed,
    lastPosition: pageIndex
  };

  data.books[progressKey] = entry;
  data.books[bookId] = entry;

  saveReadingProgress(data);

  const currentStatus = getBookStatus(bookId);
  if (completed) {
    if (currentStatus !== 'read') {
      setBookStatus(bookId, 'read');
      refreshAllBookDisplays();
    }
  } else if (currentStatus === 'unread') {
    setBookStatus(bookId, 'in-progress');
    refreshAllBookDisplays();
  }
}

function getMostRecentBookData(){
  const data = loadReadingProgress();
  if (!data.books) return null;
  let mostRecentBookId = null;
  let maxTime = 0;

  for (const [id, info] of Object.entries(data.books)){
    if (info && info.lastRead){
      const t = new Date(info.lastRead).getTime();
      if (!isNaN(t) && t > maxTime){
        maxTime = t;
        mostRecentBookId = id;
      }
    }
  }

  if (!mostRecentBookId) return null;
  const bookMeta = BOOKS.find((b) => b.id === mostRecentBookId);
  if (!bookMeta) return null;

  return {
    book: bookMeta,
    progressData: data.books[mostRecentBookId]
  };
}

/* ================================================================
   BOOK CARD CREATION
   ================================================================ */
function createBookCardEl(book, overrideLevel){
  const displayLevel = overrideLevel || book.level || 'B1';
  const card = document.createElement('article');
  card.className = 'book-card';
  card.tabIndex = 0;
  card.setAttribute('role','button');
  card.setAttribute('aria-label', 'Open ' + book.title + ' by ' + book.author);

  const cover = document.createElement('div');
  cover.className = 'book-cover';
  paintCover(cover, book);

  const metaRow = document.createElement('div');
  metaRow.className = 'book-meta-row';
  metaRow.innerHTML =
    '<span class="level-chip" style="--lvl-color:' + LEVEL_COLORS[displayLevel] + '">' +
      '<span class="level-dot"></span>' + displayLevel +
    '</span>' +
    '<span class="meta-time">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>' +
      formatTime(book.minutes) +
    '</span>';

  const dateRow = document.createElement('div');
  dateRow.className = 'book-date-row';
  dateRow.style.fontSize = '.72rem';
  dateRow.style.color = 'var(--text-tertiary)';
  dateRow.style.padding = '0 2px';
  dateRow.textContent = 'Added ' + formatDateAdded(book.dateAdded);

  const statusRow = document.createElement('div');
  statusRow.className = 'book-status-row';
  statusRow.style.display = 'flex';
  statusRow.style.alignItems = 'center';
  statusRow.style.padding = '0 2px';
  statusRow.style.marginTop = '2px';

  const currentStatus = getBookStatus(book.id);
  const statusSelect = document.createElement('select');
  statusSelect.className = 'status-select';
  statusSelect.style.fontSize = '.74rem';
  statusSelect.style.padding = '3px 8px';
  statusSelect.style.borderRadius = '99px';
  statusSelect.style.border = '1px solid var(--glass-border)';
  statusSelect.style.background = 'var(--glass-fill-soft)';
  statusSelect.style.color = currentStatus === 'read' ? 'var(--neon-cyan)' : (currentStatus === 'in-progress' ? 'var(--neon-amber)' : 'var(--text-tertiary)');
  statusSelect.style.cursor = 'pointer';

  const options = [
    { value: 'unread', label: 'Unread' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'read', label: 'Read' }
  ];

  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    o.style.background = '#12141F';
    o.style.color = '#F5F7FA';
    if (opt.value === currentStatus) o.selected = true;
    statusSelect.appendChild(o);
  });

  statusSelect.addEventListener('click', (e) => e.stopPropagation());
  statusSelect.addEventListener('change', (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    setBookStatus(book.id, newStatus);
    refreshAllBookDisplays();
  });

  statusRow.appendChild(statusSelect);

  const LEVEL_SEGMENTS = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  const filledCount = LEVEL_SEGMENTS[displayLevel] || 1;

  const meter = document.createElement('div');
  meter.className = 'vocab-meter';
  meter.setAttribute('aria-label', 'Difficulty ' + filledCount + ' of 6');
  let segs = '';
  for (let i = 0; i < 6; i++){ segs += '<i class="' + (i < filledCount ? 'on' : '') + '"></i>'; }
  meter.innerHTML = segs;

  card.appendChild(cover);
  card.appendChild(metaRow);
  card.appendChild(dateRow);
  card.appendChild(statusRow);
  card.appendChild(meter);

  const open = (e) => {
    if (e.target.closest('.status-select')) return;
    openBook(book, cover, undefined, displayLevel);
  };
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.target.closest('.status-select')) return;
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(e); }
  });
  return card;
}

/* ================================================================
   FLIP + 3D OPEN/CLOSE TRANSITION
   ================================================================ */
let isAnimating = false;
let currentBook = null;
let currentOriginCover = null;

function computeFinalRect(){
  const vw = window.innerWidth, vh = window.innerHeight;
  const w = Math.min(340, vw * 0.62);
  const h = w * 1.5;
  return { x: (vw - w) / 2, y: Math.max(24, (vh - h) / 2), w: w, h: h };
}

async function openBook(book, originCoverEl, startPosition, targetLevel){
  if (isAnimating) return;
  isAnimating = true;
  currentBook = book;
  currentOriginCover = originCoverEl;

  const levelToLoad = targetLevel || (typeof activeLevel !== 'undefined' && activeLevel !== 'all' ? activeLevel : book.level) || 'B1';

  const fullContent = await fetchBookContent(book.id, levelToLoad);
  if (fullContent && fullContent.story) {
    currentBook.story = fullContent.story;
  } else if (!currentBook.story) {
    console.error('Book content unavailable for:', book.id, levelToLoad);
    alert('Ospravedlňujeme sa, obsah knihy sa nepodarilo načítať.');
    isAnimating = false;
    return;
  }

  let targetPos = startPosition;
  if (typeof targetPos !== 'number'){
    const data = loadReadingProgress();
    const progressKey = `${book.id}:${levelToLoad.toUpperCase()}`;
    if (data.books && data.books[progressKey] && typeof data.books[progressKey].lastPosition === 'number'){
      targetPos = data.books[progressKey].lastPosition;
    } else if (data.books && data.books[book.id] && typeof data.books[book.id].lastPosition === 'number'){
      targetPos = data.books[book.id].lastPosition;
    } else {
      targetPos = 0;
    }
  }

  if (book && book.id) {
    const status = getBookStatus(book.id);
    if (status === 'unread') {
      setBookStatus(book.id, 'in-progress');
      refreshAllBookDisplays();
    }
  }

  const flyingBookEl = document.getElementById('flyingBook');
  const flyingCoverEl = document.getElementById('flyingCover');
  const readerView = document.getElementById('readerView');
  const libraryMain = document.getElementById('libraryMain');
  const discoverMain = document.getElementById('discoverMain');

  const first = originCoverEl ? originCoverEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 80, height: 120 };
  const final = computeFinalRect();

  flyingBookEl.style.left = final.x + 'px';
  flyingBookEl.style.top = final.y + 'px';
  flyingBookEl.style.width = final.w + 'px';
  flyingBookEl.style.height = final.h + 'px';
  flyingBookEl.hidden = false;
  paintCover(flyingCoverEl, book);

  const dx = first.left - final.x, dy = first.top - final.y;
  const sx = first.width / final.w, sy = first.height / final.h;

  flyingBookEl.style.transition = 'none';
  flyingBookEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
  flyingCoverEl.style.transition = 'none';
  flyingCoverEl.style.transform = 'rotateY(0deg)';

  if (originCoverEl) originCoverEl.style.visibility = 'hidden';
  if (libraryMain) libraryMain.classList.add('dimmed');
  if (discoverMain) discoverMain.classList.add('dimmed');
  document.body.style.overflow = 'hidden';

  void flyingBookEl.offsetWidth;

  flyingBookEl.style.transition = 'transform 620ms var(--ease-out-expo)';
  requestAnimationFrame(() => { flyingBookEl.style.transform = 'translate(0px,0px) scale(1,1)'; });
  await wait(640);

  flyingCoverEl.style.transition = 'transform 700ms var(--ease-open)';
  requestAnimationFrame(() => { flyingCoverEl.style.transform = 'rotateY(-108deg)'; });
  await wait(560);

  prepareReader(book, targetPos);
  readerView.hidden = false;
  requestAnimationFrame(() => { readerView.classList.add('entered'); });
  await wait(280);

  flyingBookEl.hidden = true;
  isAnimating = false;
}

async function closeBook(){
  if (isAnimating || !currentBook) return;
  isAnimating = true;
  const book = currentBook;
  const originEl = currentOriginCover;

  stopReadAloud();
  const readerView = document.getElementById('readerView');
  const flyingBookEl = document.getElementById('flyingBook');
  const flyingCoverEl = document.getElementById('flyingCover');
  const libraryMain = document.getElementById('libraryMain');
  const discoverMain = document.getElementById('discoverMain');

  readerView.classList.remove('entered');
  await wait(260);
  readerView.hidden = true;
  hidePopover();
  closeDrawer();

  let first = null;
  if (originEl && document.body.contains(originEl)) first = originEl.getBoundingClientRect();
  if (!first || (first.width === 0 && first.height === 0)){
    first = { left: window.innerWidth / 2 - 20, top: window.innerHeight - 10, width: 40, height: 60 };
  }
  const final = computeFinalRect();

  flyingBookEl.style.left = final.x + 'px';
  flyingBookEl.style.top = final.y + 'px';
  flyingBookEl.style.width = final.w + 'px';
  flyingBookEl.style.height = final.h + 'px';
  flyingBookEl.hidden = false;
  paintCover(flyingCoverEl, book);

  flyingBookEl.style.transition = 'none';
  flyingBookEl.style.transform = 'translate(0px,0px) scale(1,1)';
  flyingCoverEl.style.transition = 'none';
  flyingCoverEl.style.transform = 'rotateY(-108deg)';
  void flyingBookEl.offsetWidth;

  flyingCoverEl.style.transition = 'transform 560ms var(--ease-open)';
  requestAnimationFrame(() => { flyingCoverEl.style.transform = 'rotateY(0deg)'; });
  await wait(520);

  const dx = first.left - final.x, dy = first.top - final.y;
  const sx = first.width / final.w, sy = first.height / final.h;
  flyingBookEl.style.transition = 'transform 560ms var(--ease-out-expo)';
  requestAnimationFrame(() => { flyingBookEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')'; });
  await wait(560);

  flyingBookEl.hidden = true;
  if (originEl) originEl.style.visibility = '';
  if (libraryMain) libraryMain.classList.remove('dimmed');
  if (discoverMain) discoverMain.classList.remove('dimmed');
  document.body.style.overflow = '';
  currentBook = null;
  currentOriginCover = null;
  isAnimating = false;

  refreshAllBookDisplays();
}

/* ================================================================
   READER CORE
   ================================================================ */
function nearestVariant(level){
  if (level === 'A1') return 'A1';
  if (level === 'A2') return 'A2';
  if (level === 'B1') return 'B1';
  if (level === 'B2') return 'B2';
  if (level === 'C2') return 'C2';
  return 'C1';
}
let currentVariant = 'B1';
let currentPageIndex = 0;
let isPageAnimating = false;

function prepareReader(book, startPosition, level){
  const selectedLevel = level || (typeof activeLevel !== 'undefined' && activeLevel !== 'all' ? activeLevel : book.level) || 'B1';
  document.getElementById('readerTitle').textContent = book.title;
  document.getElementById('readerSub').textContent = book.author + ' · ' + selectedLevel.toUpperCase();
  currentVariant = nearestVariant(selectedLevel);
  const pages = getBookPages(currentBook || book, currentVariant);
  const totalPages = pages ? pages.length : 1;
  const initialPos = (typeof startPosition === 'number' && startPosition >= 0 && startPosition < totalPages) ? startPosition : 0;
  currentPageIndex = initialPos;
  renderPage(currentPageIndex);
  renderVocabDrawer();
  updateVocabCount();

  if (book && book.id){
    updateBookProgress(book.id, currentPageIndex, totalPages, currentVariant);
  }
}

function renderSheets(){
  const pages = getBookPages(currentBook, currentVariant);
  const wrapper = document.getElementById('sheetsWrapper');
  wrapper.innerHTML = '';
  const sheetCount = Math.ceil(pages.length / 2);
  for (let i = 0; i < sheetCount; i++){
    const frontIdx = i * 2, backIdx = i * 2 + 1;
    const sheet = document.createElement('div');
    sheet.className = 'paper-sheet';
    sheet.id = 'sheet-' + i;

    const front = document.createElement('div');
    front.className = 'page-face page-front';
    front.innerHTML = '<div class="page-content">' + pages[frontIdx].map((p) => '<p>' + tokenize(p) + '</p>').join('') + '</div>';

    const back = document.createElement('div');
    back.className = 'page-face page-back';
    back.innerHTML = backIdx < pages.length
      ? '<div class="page-content">' + pages[backIdx].map((p) => '<p>' + tokenize(p) + '</p>').join('') + '</div>'
      : '<div class="page-content page-end">The End</div>';

    sheet.appendChild(front);
    sheet.appendChild(back);
    wrapper.appendChild(sheet);
  }
}

function updateSheetZIndexes(){
  const pages = getBookPages(currentBook, currentVariant);
  const sheetCount = Math.ceil(pages.length / 2);
  const activeSheet = Math.floor(currentPageIndex / 2);
  for (let i = 0; i < sheetCount; i++){
    const sheet = document.getElementById('sheet-' + i);
    if (!sheet) continue;
    const isFlipped = i < activeSheet || (i === activeSheet && currentPageIndex % 2 === 1);
    sheet.classList.toggle('flipped', isFlipped);
    sheet.style.zIndex = i < activeSheet ? (i + 1) : (sheetCount - i);
  }
}

function getCurrentFaceEl(){
  const sheetIdx = Math.floor(currentPageIndex / 2);
  const isBack = currentPageIndex % 2 === 1;
  const sheet = document.getElementById('sheet-' + sheetIdx);
  if (!sheet) return null;
  return sheet.querySelector(isBack ? '.page-back .page-content' : '.page-front .page-content');
}

function applyWordStatusClasses(){
  const known = loadKnown();
  const learning = loadVocab().map((v) => v.word);
  document.querySelectorAll('#sheetsWrapper .w').forEach((el) => {
    const key = el.dataset.w;
    el.classList.toggle('known', known.includes(key));
    el.classList.toggle('learning', learning.includes(key));
  });
}

function updateReaderChrome(idx){
  const pages = getBookPages(currentBook, currentVariant);
  document.getElementById('progressFill').style.width = (((idx + 1) / pages.length) * 100) + '%';
  document.getElementById('pageIndicator').textContent = (idx + 1) + ' / ' + pages.length;
  document.getElementById('prevPageBtn').disabled = idx === 0;
  document.getElementById('nextPageBtn').disabled = idx === pages.length - 1;
}

function renderPage(idx){
  currentPageIndex = idx;
  renderSheets();
  updateSheetZIndexes();
  applyWordStatusClasses();
  updateReaderChrome(idx);
}

async function goToPage(delta, opts){
  opts = opts || {};
  const pages = getBookPages(currentBook, currentVariant);
  const next = currentPageIndex + delta;
  if (next < 0 || next >= pages.length || isPageAnimating) return;
  isPageAnimating = true;
  hidePopover();
  if (!opts.keepReading) stopReadAloud();
  currentPageIndex = next;
  updateSheetZIndexes();
  updateReaderChrome(next);

  if (currentBook && currentBook.id){
    updateBookProgress(currentBook.id, currentPageIndex, pages.length, currentVariant);
  }

  await wait(460);
  applyWordStatusClasses();
  isPageAnimating = false;
}

function updateVariantPillsUI(){
  document.querySelectorAll('.variant-pill').forEach((p) => {
    p.classList.toggle('active', p.dataset.variant === currentVariant);
  });
}
async function setVariant(variant){
  if (variant === currentVariant || isPageAnimating) return;
  stopReadAloud();
  currentVariant = variant;
  updateVariantPillsUI();
  const stage = document.getElementById('bookStage');
  stage.classList.add('shimmer');
  await wait(650);
  stage.classList.remove('shimmer');
  const pages = getBookPages(currentBook, currentVariant);
  const clampedIndex = Math.min(currentPageIndex, pages.length - 1);
  renderPage(clampedIndex);
  if (currentBook && currentBook.id){
    updateBookProgress(currentBook.id, clampedIndex, pages.length);
  }
}

/* ================================================================
   WORD POPOVER & EXTERNAL API INTEGRATION
   ================================================================ */
let activeWordEl = null;
let currentAudioUrl = null;
const wordCache = {};

async function fetchWordData(textToProcess, targetLang) {
    const lang = targetLang || currentLang || 'sk';
    const cacheKey = `${lang}:${textToProcess.trim().toLowerCase()}`;
    const ipaElem = document.getElementById('pop-ipa');
    const transElem = document.getElementById('pop-translation');
    const popoverEl = document.getElementById('wordPopover');

    if (wordCache[cacheKey]) {
        const cached = wordCache[cacheKey];
        if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) {
          ipaElem.innerText = cached.ipa;
          transElem.innerText = cached.translation;
        }
        currentAudioUrl = cached.audioUrl;
        return cached;
    }

    if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) {
      ipaElem.innerText = "| ... |";
      transElem.innerText = "Načítavam preklad...";
    }
    currentAudioUrl = null;

    const isPhrase = textToProcess.trim().includes(' ');

    const cacheObj = {
        ipa: '| ... |',
        translation: 'Preklad nedostupný',
        audioUrl: null
    };

    let translationPromise = Promise.resolve();

    if (lang === 'en') {
      const selfTrans = textToProcess.toLowerCase();
      if (transElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) {
        transElem.innerText = selfTrans;
      }
      cacheObj.translation = selfTrans;
    } else {
      translationPromise = fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToProcess)}&langpair=en|${lang}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.responseData && data.responseData.translatedText) {
            const rawTrans = data.responseData.translatedText;
            if (rawTrans.toUpperCase().includes("MYMEMORY WARNING")) {
              const warnMsg = "Preklad zatiaľ nedostupný (limit API)";
              if (transElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) transElem.innerText = warnMsg;
              cacheObj.translation = warnMsg;
            } else {
              const transText = rawTrans.toLowerCase();
              if (transElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) transElem.innerText = transText;
              cacheObj.translation = transText;
            }
          } else {
            if (transElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) transElem.innerText = "Preklad nedostupný";
          }
        })
        .catch(err => {
          if (transElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) transElem.innerText = "Preklad nedostupný";
        });
    }

    let dictionaryPromise = Promise.resolve();

    if (!isPhrase) {
      const cleanWord = textToProcess.trim().toLowerCase();
      dictionaryPromise = fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0]) {
            const phonetic = data[0].phonetic ||
              (data[0].phonetics && data[0].phonetics.find(p => p.text)?.text) || '';

            const ipaText = phonetic ? `| ${phonetic} |` : '| - |';
            if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) ipaElem.innerText = ipaText;
            cacheObj.ipa = ipaText;

            const audioObj = data[0].phonetics && data[0].phonetics.find(
              p => p.audio && p.audio.length > 0
            );

            if (audioObj) {
              currentAudioUrl = audioObj.audio;
              cacheObj.audioUrl = audioObj.audio;
            }
          } else {
            if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) ipaElem.innerText = '| - |';
            cacheObj.ipa = '| - |';
          }
        })
        .catch(err => {
          if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) ipaElem.innerText = '| - |';
          cacheObj.ipa = '| - |';
        });
    } else {
      const ipaText = '| fráza |';
      if (ipaElem && popoverEl && popoverEl.dataset.word === textToProcess.toLowerCase()) ipaElem.innerText = ipaText;
      cacheObj.ipa = ipaText;
    }

    await Promise.all([translationPromise, dictionaryPromise]);
    wordCache[cacheKey] = cacheObj;
    return cacheObj;
}

const POPOVER_LABELS = {
  sk: { play: 'Prehrať', known: 'Viem', learning: 'Učiť sa', loading: 'Načítavam preklad...' },
  cs: { play: 'Přehrát', known: 'Znám', learning: 'Učit se', loading: 'Načítám překlad...' },
  de: { play: 'Abspielen', known: 'Ich weiß', learning: 'Lernen', loading: 'Übersetzung wird geladen...' },
  fr: { play: 'Jouer', known: 'Je sais', learning: 'Apprendre', loading: 'Chargement de la traduction...' },
  es: { play: 'Reproducir', known: 'Lo sé', learning: 'Aprender', loading: 'Cargando traducción...' },
  it: { play: 'Riproduci', known: 'Lo so', learning: 'Imparare', loading: 'Caricamento traduzione...' },
  pl: { play: 'Odtwórz', known: 'Znam', learning: 'Ucz się', loading: 'Ładowanie tłumaczenia...' },
  ru: { play: 'Воспроизвести', known: 'Знаю', learning: 'Учить', loading: 'Загрузка перевода...' },
  uk: { play: 'Відтворити', known: 'Знаю', learning: 'Вчити', loading: 'Завантаження перекладу...' },
  en: { play: 'Play', known: 'I know', learning: 'Learn', loading: 'Loading translation...' }
};

function getPopoverLabels(lang) {
  return POPOVER_LABELS[lang] || POPOVER_LABELS['sk'] || { play: 'Play', known: 'Viem', learning: 'Učiť sa', loading: 'Načítavam preklad...' };
}

function renderPopoverContent(key, displayWord){
  const isKnown = loadKnown().includes(key);
  const isLearning = loadVocab().some((v) => v.word === key);
  const labels = getPopoverLabels(currentLang || 'sk');
  return '' +
    '<div class="wp-head">' +
      '<span class="wp-word">' + escapeHtml(displayWord) + '</span>' +
      '<button class="wp-close" data-action="close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>' +
    '</div>' +
    '<p class="wp-ipa" id="pop-ipa">| ... |</p>' +
    '<p class="wp-translation" id="pop-translation">' + escapeHtml(labels.loading) + '</p>' +
    '<div class="wp-speak-row">' +
      '<button class="wp-btn" data-action="speak" style="width:100%">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M17 8a5 5 0 0 1 0 8"/></svg>' +
        escapeHtml(labels.play) +
      '</button>' +
    '</div>' +
    '<div class="wp-status-row">' +
      '<button class="wp-btn ' + (isKnown ? 'is-known' : '') + '" data-action="known">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
        escapeHtml(labels.known) +
      '</button>' +
      '<button class="wp-btn ' + (isLearning ? 'is-learning' : '') + '" data-action="learning">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
        escapeHtml(labels.learning) +
      '</button>' +
    '</div>';
}

function showPopover(wordEl){
  const popoverEl = document.getElementById('wordPopover');
  if (!popoverEl) return;
  const key = wordEl.dataset.w;
  activeWordEl = wordEl;
  document.querySelectorAll('.w.active-word').forEach((w) => w.classList.remove('active-word'));
  wordEl.classList.add('active-word');
  popoverEl.dataset.word = key;
  popoverEl.innerHTML = renderPopoverContent(key, wordEl.textContent);
  popoverEl.classList.add('visible');

  fetchWordData(wordEl.textContent.trim());

  const r = wordEl.getBoundingClientRect();
  const pRect = popoverEl.getBoundingClientRect();
  let left = r.left + r.width / 2 - pRect.width / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - pRect.width - 12));
  let top = r.top - pRect.height - 14;
  let placement = 'top';
  if (top < 70){ top = r.bottom + 14; placement = 'bottom'; }
  popoverEl.style.left = left + 'px';
  popoverEl.style.top = top + 'px';
  popoverEl.dataset.placement = placement;
  popoverEl.style.setProperty('--arrow-x', (r.left + r.width / 2 - left) + 'px');
}

function hidePopover(){
  const popoverEl = document.getElementById('wordPopover');
  if (popoverEl) popoverEl.classList.remove('visible');
  if (activeWordEl) activeWordEl.classList.remove('active-word');
  activeWordEl = null;
}

function pickEnglishVoice(){
  try{
    const voices = window.speechSynthesis.getVoices();
    return voices.find((v) => v.lang && v.lang.toLowerCase().indexOf('en') === 0) || null;
  }catch(e){ return null; }
}
function speak(word){
  try{
    stopReadAloud();
    if (currentAudioUrl) {
      const audio = new Audio(currentAudioUrl);
      audio.play().catch(err => {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(word);
          u.lang = 'en-US';
          u.rate = 0.9;
          const v = pickEnglishVoice();
          if (v) u.voice = v;
          window.speechSynthesis.speak(u);
        }
      });
      return;
    }
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.9;
    const v = pickEnglishVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }catch(e){ /* ignore */ }
}

/* ================================================================
   READ-ALOUD WITH SENTENCE HIGHLIGHTING
   ================================================================ */
let isReading = false;
let readSentences = [];
let readSentenceIndex = 0;
let readTimers = [];

function setPlayingUI(playing){
  isReading = playing;
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const playBtn = document.getElementById('playBtn');
  if (playIcon) playIcon.style.display = playing ? 'none' : '';
  if (pauseIcon) pauseIcon.style.display = playing ? '' : 'none';
  if (playBtn) playBtn.classList.toggle('is-playing', playing);
}
function clearReadingHighlight(){
  document.querySelectorAll('.w.reading-now').forEach((w) => w.classList.remove('reading-now'));
}
function clearReadTimers(){
  readTimers.forEach((t) => clearTimeout(t));
  readTimers = [];
}

function splitIntoSentenceUnits(faceEl){
  const wordEls = faceEl ? Array.from(faceEl.querySelectorAll('.w')) : [];
  const sentences = [];
  let current = { text: '', words: [] };

  wordEls.forEach((el) => {
    const wordText = el.textContent.trim();
    let trailingPunct = '';

    if (el.nextSibling && el.nextSibling.nodeType === Node.TEXT_NODE) {
      const sibText = el.nextSibling.textContent;
      const pMatch = sibText.match(/^[.!?]+/);
      if (pMatch) {
        trailingPunct = pMatch[0];
      }
    }

    const fullToken = wordText + trailingPunct;
    current.text += (current.text ? ' ' : '') + fullToken;
    current.words.push(el);

    if (/[.!?]$/.test(fullToken)) {
      const cleanWord = wordText.toLowerCase().replace(/[^a-z]/g, '');
      const isShortAbbrev = (cleanWord.length <= 2) || ['mr','mrs','ms','dr','prof','sr','jr','capt','col','st','vs','etc','inc','ltd'].includes(cleanWord);
      if (!isShortAbbrev) {
        sentences.push(current);
        current = { text: '', words: [] };
      }
    }
  });

  if (current.words.length) sentences.push(current);
  return sentences;
}

function startReadAloud(){
  if (!('speechSynthesis' in window)) return;
  hidePopover();
  window.speechSynthesis.cancel();
  const faceEl = getCurrentFaceEl();
  readSentences = splitIntoSentenceUnits(faceEl);
  readSentenceIndex = 0;
  setPlayingUI(true);
  speakNextSentence();
}

function speakNextSentence(){
  if (!isReading) return;
  if (readSentenceIndex >= readSentences.length){
    clearReadingHighlight();
    const pages = getBookPages(currentBook, currentVariant);
    if (currentPageIndex < pages.length - 1){
      goToPage(1, { keepReading: true }).then(() => {
        if (!isReading) return;
        readSentences = splitIntoSentenceUnits(getCurrentFaceEl());
        readSentenceIndex = 0;
        speakNextSentence();
      });
    } else {
      stopReadAloud();
    }
    return;
  }

  clearReadTimers();
  const unit = readSentences[readSentenceIndex];
  const u = new SpeechSynthesisUtterance(unit.text);
  u.lang = 'en-US';
  u.rate = 0.95;
  const v = pickEnglishVoice();
  if (v) u.voice = v;

  u.onstart = () => {
    if (!isReading) return;
    clearReadingHighlight();
    unit.words.forEach((el) => el.classList.add('reading-now'));
    if (unit.words[0]) {
      unit.words[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };
  u.onend = () => {
    if (!isReading) return;
    clearReadingHighlight();
    const pauseMs = 350;
    const pauseTimer = setTimeout(() => {
      if (!isReading) return;
      readSentenceIndex++;
      speakNextSentence();
    }, pauseMs);
    readTimers.push(pauseTimer);
  };
  u.onerror = () => { stopReadAloud(); };

  window.speechSynthesis.speak(u);
}

function stopReadAloud(){
  clearReadTimers();
  try{ if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }catch(e){ /* ignore */ }
  clearReadingHighlight();
  setPlayingUI(false);
}

/* ================================================================
   VOCABULARY (localStorage)
   ================================================================ */
function loadVocab(){
  try{
    const raw = localStorage.getItem('lumen_vocab_v1');
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveVocabList(list){
  try{ localStorage.setItem('lumen_vocab_v1', JSON.stringify(list)); }catch(e){ /* storage unavailable */ }
}
function loadKnown(){
  try{
    const raw = localStorage.getItem('lumen_known_v1');
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveKnownList(list){
  try{ localStorage.setItem('lumen_known_v1', JSON.stringify(list)); }catch(e){ /* storage unavailable */ }
}

function setWordStatus(word, sk, status){
  let known = loadKnown();
  let vocab = loadVocab();
  const wasKnown = known.includes(word);
  const wasLearning = vocab.some((v) => v.word === word);

  known = known.filter((k) => k !== word);
  vocab = vocab.filter((v) => v.word !== word);

  let result = status;
  if (status === 'known' && wasKnown) result = null;
  if (status === 'learning' && wasLearning) result = null;

  if (result === 'known') known.push(word);
  if (result === 'learning') vocab.push({ word: word, sk: sk, ts: Date.now() });

  saveKnownList(known);
  saveVocabList(vocab);
  renderVocabDrawer();
  updateVocabCount();
  return result;
}

function renderVocabDrawer(){
  const list = loadVocab();
  const el = document.getElementById('vocabList');
  if (!el) return;
  if (!list.length){
    el.innerHTML = '<li class="vocab-empty">Tap a word while reading and choose &ldquo;U&#269;i&#357; sa&rdquo; to add it here.</li>';
    return;
  }

  const lang = currentLang || 'sk';

  el.innerHTML = list.slice().reverse().map((v) => {
    const cacheKey = `${lang}:${v.word.trim().toLowerCase()}`;
    const cachedTrans = wordCache[cacheKey] ? wordCache[cacheKey].translation : (lang === 'sk' ? v.sk : '...');
    return (
      '<li class="vocab-item" data-word="' + escapeHtml(v.word) + '">' +
        '<div><p class="vw">' + escapeHtml(v.word) + '</p><p class="vt" data-vt-word="' + escapeHtml(v.word) + '">' + escapeHtml(cachedTrans) + '</p></div>' +
        '<button class="vocab-remove" data-word="' + escapeHtml(v.word) + '" aria-label="Remove ' + escapeHtml(v.word) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</li>'
    );
  }).join('');

  list.forEach(v => {
    const cacheKey = `${lang}:${v.word.trim().toLowerCase()}`;
    if (!wordCache[cacheKey]) {
      fetchWordData(v.word, lang).then(data => {
        const vtElem = el.querySelector(`.vt[data-vt-word="${CSS.escape(v.word)}"]`);
        if (vtElem && data && data.translation) {
          vtElem.textContent = data.translation;
        }
      });
    }
  });
}

function updateVocabCount(){
  const n = loadVocab().length;
  const navVocabCount = document.getElementById('navVocabCount');
  const drawerBadge = document.getElementById('drawerBadge');
  const heroVocabStat = document.getElementById('heroVocabStat');
  if (navVocabCount) navVocabCount.textContent = n;
  if (drawerBadge) drawerBadge.textContent = n;
  if (heroVocabStat) heroVocabStat.textContent = n;
}

function openDrawer(){
  const vocabDrawer = document.getElementById('vocabDrawer');
  if (vocabDrawer) {
    vocabDrawer.classList.add('open');
    renderVocabDrawer();
  }
}
function closeDrawer(){
  const vocabDrawer = document.getElementById('vocabDrawer');
  if (vocabDrawer) vocabDrawer.classList.remove('open');
}

/* ================================================================
   FLASHCARDS PRACTICE
   ================================================================ */
let fcList = [];
let fcIndex = 0;

function startFlashcardPractice() {
  const vocab = loadVocab();
  if (!vocab.length) {
    alert('Uložte si najprv slovíčka kliknutím na "Učiť sa" počas čítania.');
    return;
  }
  fcList = vocab.slice().sort(() => Math.random() - 0.5);
  fcIndex = 0;
  showFlashcard(fcIndex);
  const modal = document.getElementById('flashcardModal');
  if (modal) modal.removeAttribute('hidden');
}

function showFlashcard(index) {
  if (!fcList.length || index < 0 || index >= fcList.length) return;
  const item = fcList[index];
  const card = document.getElementById('fcCard');
  if (card) card.classList.remove('flipped');

  const fcCounter = document.getElementById('fcCounter');
  const fcWord = document.getElementById('fcWord');
  const fcTranslation = document.getElementById('fcTranslation');

  if (fcCounter) fcCounter.textContent = `${index + 1} / ${fcList.length}`;
  if (fcWord) fcWord.textContent = item.word;

  const lang = currentLang || 'sk';
  const cacheKey = `${lang}:${item.word.trim().toLowerCase()}`;
  const cached = wordCache[cacheKey];

  if (cached && cached.translation) {
    if (fcTranslation) fcTranslation.textContent = cached.translation;
  } else {
    if (fcTranslation) fcTranslation.textContent = item.sk || 'Načítavam...';
    fetchWordData(item.word, lang).then(data => {
      if (fcTranslation && data && data.translation) {
        fcTranslation.textContent = data.translation;
      }
    });
  }
}

function nextFlashcard() {
  if (!fcList.length) return;
  fcIndex = (fcIndex + 1) % fcList.length;
  showFlashcard(fcIndex);
}

function closeFlashcardPractice() {
  const modal = document.getElementById('flashcardModal');
  if (modal) modal.setAttribute('hidden', '');
}

function initCommonListeners() {
  /* Touch Swipe Gestures for Mobile Page Turning */
  const bookStageEl = document.getElementById('bookStage');
  if (bookStageEl) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    bookStageEl.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    bookStageEl.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 60 && deltaTime < 600) {
        if (e.target.closest('.w') || e.target.closest('#wordPopover') || e.target.closest('.vocab-drawer')) return;
        if (deltaX < 0) {
          stopReadAloud();
          goToPage(1);
        } else {
          stopReadAloud();
          goToPage(-1);
        }
      }
    }, { passive: true });
  }
  const startFlashcardsBtn = document.getElementById('startFlashcardsBtn');
  if (startFlashcardsBtn) {
    startFlashcardsBtn.addEventListener('click', startFlashcardPractice);
  }

  const fcCard = document.getElementById('fcCard');
  if (fcCard) {
    fcCard.addEventListener('click', () => {
      fcCard.classList.toggle('flipped');
    });
  }

  const fcNextBtn = document.getElementById('fcNextBtn');
  if (fcNextBtn) {
    fcNextBtn.addEventListener('click', nextFlashcard);
  }

  const fcCloseBtn = document.getElementById('fcCloseBtn');
  if (fcCloseBtn) {
    fcCloseBtn.addEventListener('click', closeFlashcardPractice);
  }

  const fcAudioBtn = document.getElementById('fcAudioBtn');
  if (fcAudioBtn) {
    fcAudioBtn.addEventListener('click', () => {
      if (fcList[fcIndex]) {
        speak(fcList[fcIndex].word);
      }
    });
  }
  const popoverEl = document.getElementById('wordPopover');
  if (popoverEl) {
    popoverEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const key = popoverEl.dataset.word;
      if (action === 'close') hidePopover();
      if (action === 'speak') speak(key);
      if (action === 'known' || action === 'learning'){
        const currentTranslation = document.getElementById('pop-translation')?.innerText || '—';
        const newStatus = setWordStatus(key, currentTranslation, action);
        document.querySelectorAll('.w').forEach((w) => {
          if (w.dataset.w === key){
            w.classList.toggle('known', newStatus === 'known');
            w.classList.toggle('learning', newStatus === 'learning');
          }
        });
        if (activeWordEl) {
          popoverEl.innerHTML = renderPopoverContent(key, activeWordEl.textContent);
          fetchWordData(activeWordEl.textContent.trim());
        }
      }
    });
  }

  const pageContainer = document.getElementById('sheetsWrapper');
  if (pageContainer) {
    let hoverTimer = null;
    pageContainer.addEventListener('click', (e) => {
      const w = e.target.closest('.w');
      if (w) showPopover(w); else hidePopover();
    });
    if (window.matchMedia('(hover: hover)').matches){
      pageContainer.addEventListener('mouseover', (e) => {
        const w = e.target.closest('.w');
        if (!w) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => showPopover(w), 380);
      });
      pageContainer.addEventListener('mouseout', () => clearTimeout(hoverTimer));
    }
  }

  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isReading){ stopReadAloud(); } else { startReadAloud(); }
    });
  }

  const prevPageBtn = document.getElementById('prevPageBtn');
  if (prevPageBtn) prevPageBtn.addEventListener('click', () => { stopReadAloud(); goToPage(-1); });

  const nextPageBtn = document.getElementById('nextPageBtn');
  if (nextPageBtn) nextPageBtn.addEventListener('click', () => { stopReadAloud(); goToPage(1); });

  const readerBackBtn = document.getElementById('readerBackBtn');
  if (readerBackBtn) readerBackBtn.addEventListener('click', closeBook);

  const drawerToggleBtn = document.getElementById('drawerToggleBtn');
  if (drawerToggleBtn) {
    drawerToggleBtn.addEventListener('click', () => {
      const vocabDrawer = document.getElementById('vocabDrawer');
      if (vocabDrawer && vocabDrawer.classList.contains('open')) closeDrawer(); else openDrawer();
    });
  }

  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  const navVocabBtn = document.getElementById('navVocabBtn');
  if (navVocabBtn) {
    navVocabBtn.addEventListener('click', async () => {
      const readerView = document.getElementById('readerView');
      if (readerView && readerView.hidden){
        const recentData = getMostRecentBookData();
        const book = recentData ? recentData.book : (BOOKS.find((b) => b.id === HERO_BOOK_ID) || BOOKS[0]);
        const pos = recentData && recentData.progressData ? recentData.progressData.lastPosition : 0;
        await openBook(book, document.getElementById('heroCover'), pos);
      }
      openDrawer();
    });
  }

  const vocabList = document.getElementById('vocabList');
  if (vocabList) {
    vocabList.addEventListener('click', (e) => {
      const btn = e.target.closest('.vocab-remove');
      if (!btn) return;
      const word = btn.dataset.word;
      const list = loadVocab().filter((v) => v.word !== word);
      saveVocabList(list);
      renderVocabDrawer();
      updateVocabCount();
      document.querySelectorAll('.w').forEach((w) => { if (w.dataset.w === word) w.classList.remove('learning'); });
    });
  }


  let fontScale = 1;
  try{
    const savedScale = parseFloat(localStorage.getItem('lumen_font_scale'));
    if (!isNaN(savedScale)) fontScale = savedScale;
  }catch(e){ /* ignore */ }
  const bookStage = document.getElementById('bookStage');
  if (bookStage) bookStage.style.setProperty('--font-scale', String(fontScale));

  const fontUpBtn = document.getElementById('fontUpBtn');
  if (fontUpBtn) {
    fontUpBtn.addEventListener('click', () => {
      fontScale = Math.min(1.35, Math.round((fontScale + 0.08) * 100) / 100);
      if (bookStage) bookStage.style.setProperty('--font-scale', String(fontScale));
      try{ localStorage.setItem('lumen_font_scale', String(fontScale)); }catch(e){ /* ignore */ }
    });
  }

  const fontDownBtn = document.getElementById('fontDownBtn');
  if (fontDownBtn) {
    fontDownBtn.addEventListener('click', () => {
      fontScale = Math.max(0.85, Math.round((fontScale - 0.08) * 100) / 100);
      if (bookStage) bookStage.style.setProperty('--font-scale', String(fontScale));
      try{ localStorage.setItem('lumen_font_scale', String(fontScale)); }catch(e){ /* ignore */ }
    });
  }

  initLangTrigger();
}
