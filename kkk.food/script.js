// List of 10 iconic Vietnamese dishes (images from Unsplash for demo)
const dishes = [
  { id: 'pho', name: 'Phở', region: '北部/南部で地域差あり', description: '澄んだスープと米の平麺（フォー）、主に牛肉または鶏肉を使うスープ料理。朝食や夕食に人気です。' },
  { id: 'banh-mi', name: 'Bánh mì', region: '全国', description: 'バインミーはカリッとしたバゲットにパテや肉、香草、なます、ソースなどを挟んだベトナム式サンドイッチです。' },
  { id: 'bun-cha', name: 'Bún chả', region: 'ハノイ', description: '米麺（ブン）と甘酸っぱいタレのついた焼き肉（チャー）を合わせたハノイ名物。生野菜と一緒に食べます。' },
  { id: 'bun-bo-hue', name: 'Bún bò Huế', region: 'フエ', description: '辛めのスープが特徴のフエの名物料理。スライスした牛肉や豚のすね肉が入ります。' },
  { id: 'com-tam', name: 'Cơm tấm', region: '南部', description: '割れ米（コムタム）を使ったご飯。焼きスペアリブ、目玉焼き、なますなどと一緒に供される南部の定番料理です。' },
  { id: 'goi-cuon', name: 'Gỏi cuốn', region: '全国', description: '生春巻き。エビや肉、野菜、ビーフンをライスペーパーで巻き、ヌクマムやピーナッツソースで食べます。' },
  { id: 'ca-kho-to', name: 'Cá kho tộ', region: '南部', description: '土鍋で甘辛く煮込む魚料理。キャラメル色の濃いタレがご飯に合います。' },
  { id: 'banh-xeo', name: 'Bánh xèo', region: '南部', description: '薄い米粉のクレープを揚げたような料理。エビ、肉、もやしを包んで、生野菜とタレで食べます。' },
  { id: 'hu-tieu', name: 'Hủ tiếu', region: '南部', description: '澄んだ優しい味のスープに米麺や卵麺を合わせる料理。トッピングはエビや肉、イカなど多様です。' },
  { id: 'che', name: 'Chè', region: '全国', description: '甘いデザート／飲み物。豆、ココナッツミルク、果物、ゼリーなどを合わせたスイーツです。' }
];

const container = document.getElementById('dishes');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const searchInput = document.getElementById('search');
const shuffleBtn = document.getElementById('shuffle-btn');
const randomBtn = document.getElementById('random-btn');

function createCard(d) {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="no-image">画像なし</div>
    <div class="card-body">
      <h3>${d.name}</h3>
      <p>${d.region}</p>
      <button class="btn" data-id="${d.id}">詳細を見る</button>
    </div>
  `;
  return card;
}

function openModal(d) {
  modalBody.innerHTML = `
    <h3>${d.name}</h3>
    <p><strong>地域:</strong> ${d.region}</p>
    <p>${d.description}</p>
  `;
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  modalBody.innerHTML = '';
}

// Render cards
function renderList(list) {
  container.innerHTML = '';
  list.forEach(d => container.appendChild(createCard(d)));
}

// Initial render
renderList(dishes);

// Search/filter
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) { renderList(dishes); return; }
  const filtered = dishes.filter(d => (d.name + ' ' + d.region + ' ' + d.description).toLowerCase().includes(q));
  renderList(filtered);
});

// Shuffle function
function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

shuffleBtn.addEventListener('click', () => renderList(shuffle(dishes)));

// Show a random dish in modal
randomBtn.addEventListener('click', () => {
  const pick = dishes[Math.floor(Math.random() * dishes.length)];
  openModal(pick);
});

// Delegate click for detail buttons
container.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  const d = dishes.find(x => x.id === id);
  if (d) openModal(d);
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Close with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
