// --- State Management ---
let logs = [];
let decos = [];
let soundEnabled = true;

const PRESET_COLORS = [
  '#ff7675', // 파스텔 레드
  '#fdcb6e', // 파스텔 오렌지
  '#00cec9', // 파스텔 티안
  '#0984e3', // 파스텔 블루
  '#6c5ce7', // 파스텔 퍼플
  '#e84393', // 파스텔 핑크
  '#2ecc71', // 민트 그린
  '#e74c3c', // 크림슨
  '#34495e', // 머드 네이비
  '#d35400', // 오렌지 브라운
  '#8e44ad', // 딥 퍼플
  '#16a085'  // 딥 그린
];

const CHARACTERS = [
  { id: 'c1', name: '꼬마 미플', emoji: '🧸', condText: '기록 1회 달성', unlockFn: (count) => count >= 1 },
  { id: 'c2', name: '아기 주사위', emoji: '🎲', condText: '기록 3회 달성', unlockFn: (count) => count >= 3 },
  { id: 'c3', name: '보드 빌더', emoji: '🧱', condText: '기록 5회 달성', unlockFn: (count) => count >= 5 },
  { id: 'c4', name: '룰북 정독이', emoji: '📖', condText: '기록 8회 달성', unlockFn: (count) => count >= 8 },
  { id: 'c5', name: '미플 익스퍼트', emoji: '👑', condText: '기록 12회 달성', unlockFn: (count) => count >= 12 },
  { id: 'c6', name: '보드게임 지신', emoji: '🧙‍♂️', condText: '기록 20회 달성', unlockFn: (count) => count >= 20 }
];

// --- 20종 이상의 풍부한 기본 보드게임 도감 백과사전 DB (국내 정식 한글판 고화질 패키지 일러스트로 긴급 수동 매핑) ---
const ENCYCLOPEDIA_DB = {
  '스플렌더': { 
    bggId: '148228', 
    name: '스플렌더 (Splendor)', 
    desc: '보석 칩을 모아 광산을 개발하고 카드 점수를 모아 귀족들의 방문을 유도하는 최고의 셋컬렉션 입문 게임', 
    img: 'https://divedice.net/images/product/info/202111/49dfa6d8d6411516e87bc5e595b128dc.jpg', // 정식 코보게 한글판 스플렌더 이미지
    color: '#6c5ce7', 
    difficulty: 'medium' 
  },
  '루미큐브': { 
    bggId: '811', 
    name: '루미큐브 (Rummikub)', 
    desc: '숫자 타일들을 연속된 수 또는 같은 숫자의 다른 색 조합으로 맞춰 자신의 타일을 가장 먼저 터는 두뇌 보드게임', 
    img: 'https://divedice.net/images/product/info/202111/476e336d39dfb3b64c05e1ab8db5b24c.jpg', // 정식 루미큐브 클래식 한글판 박스 이미지
    color: '#0984e3', 
    difficulty: 'easy' 
  },
  '카르카손': { 
    bggId: '822', 
    name: '카르카손 (Carcassonne)', 
    desc: '타일을 한 장씩 뽑아 성, 길, 초원을 건설하고 내 미플을 놓아 영토를 넓히는 최고의 영향력 타일 배치 게임', 
    img: 'https://divedice.net/images/product/info/202112/035882672534a6dfcc8cb4ffcfbc99aa.jpg', // 한글판 카르카손 패키지
    color: '#2ecc71', 
    difficulty: 'easy' 
  },
  '카탄': { 
    bggId: '13', 
    name: '카탄의 개척자 (Catan)', 
    desc: '자원을 생산하고 다른 개척자들과의 활발한 거래 및 도로, 마을 확장을 통해 10점을 먼저 획득하는 협상 전략 게임', 
    img: 'https://divedice.net/images/product/info/202111/500c2830ad54ab17cb4c0559f0f9c2d1.jpg', // 정식 한글판 카탄 박스 이미지
    color: '#ff7675', 
    difficulty: 'medium' 
  },
  '할리갈리': { 
    bggId: '598', 
    name: '할리갈리 (Halli Galli)', 
    desc: '과일의 합이 정확히 5개가 되는 순간 누구보다 빠르게 종을 쳐서 카드를 쓸어 담는 순발력 과일 게임', 
    img: 'https://divedice.net/images/product/info/202111/b3c66f5c88e9999a4e044c3c3a9d985a.jpg', // 빨간 딸기 한글판 할리갈리 이미지
    color: '#e74c3c', 
    difficulty: 'easy' 
  },
  '다빈치코드': { 
    bggId: '8946', 
    name: '다빈치코드 (Da Vinci Code)', 
    desc: '상대방의 흑백 타일 번호를 하나씩 밝혀내고 나의 비밀 숫자 조합은 끝까지 감추는 숫자 추리 게임', 
    img: 'https://divedice.net/images/product/info/202111/49c890798517c0128e04e27f1c1f2f6f.jpg', // 한글판 다빈치코드 이미지
    color: '#34495e', 
    difficulty: 'easy' 
  },
  '젝스님트': { 
    bggId: '118', 
    name: '젝스님트 (6 Nimmst!)', 
    desc: '카드를 비공개로 내고 오름차순으로 배치하다가, 6번째 카드를 놓는 불운의 플레이어가 벌점 카드를 먹는 파티 눈치 카드게임', 
    img: 'https://divedice.net/images/product/info/202111/49a29a0c799a4832ebcf07cf7c3b4832.jpg', // 한글판 젝스님트 이미지
    color: '#e84393', 
    difficulty: 'easy' 
  },
  '아발론': { 
    bggId: '128839', 
    name: '레지스탕스 아발론 (Avalon)', 
    desc: '선과 악의 진영으로 나뉘어 서로의 정체를 속이고 미션을 성공시키거나 저지하는 최고의 마피아 블러핑 게임', 
    img: 'https://divedice.net/images/product/info/202112/03e843af7b8aa9ba4c010a3b8e44adcf.jpg', // 한글판 아발론 이미지
    color: '#16a085', 
    difficulty: 'heavy' 
  },
  '딕싯': { 
    bggId: '39856', 
    name: '딕싯 (Dixit)', 
    desc: '추상적인 일러스트 카드를 보고 다채로운 힌트를 제시하여 출제자의 카드를 맞추는 감성 스토리텔링 게임', 
    img: 'https://divedice.net/images/product/info/202111/4ea28b43f7bb09401ab4d47c7d4768ab.jpg', // 한글판 딕싯 이미지
    color: '#8e44ad', 
    difficulty: 'easy' 
  },
  '스컬': { 
    bggId: '131057', 
    name: '스컬 (Skull)', 
    desc: '꽃과 해골이 그려진 디스크를 내고, 해골을 밟지 않으면서 자기가 선언한 장수만큼 뒤집는 고도의 심리 블러핑 포커 게임', 
    img: 'https://divedice.net/images/product/info/202111/49b9960587044591e1b8c38df3d1f3f3.jpg', // 한글판 스컬 박스 이미지
    color: '#fdcb6e', 
    difficulty: 'easy' 
  },
  '아그리콜라': { 
    bggId: '31260', 
    name: '아그리콜라 (Agricola)', 
    desc: '17세기 농부가 되어 밭을 일구고 가축을 키우며 내 가족들을 굶기지 않고 농장을 건설하는 명작 일꾼배치 게임', 
    img: 'https://divedice.net/images/product/info/202111/450c093738664cf6d1dfef3d1fd3854a.jpg', // 한글판 아그리콜라 이미지
    color: '#d35400', 
    difficulty: 'heavy' 
  },
  '러브레터': { 
    bggId: '129622', 
    name: '러브레터 (Love Letter)', 
    desc: '단 16장의 카드만을 사용하여 공주에게 비밀 편지를 무사히 배달하고 다른 라이벌을 탈락시키는 전략 카드게임', 
    img: 'https://divedice.net/images/product/info/202111/509248961158a54f6934749c95d8d8d3.jpg', // 한글판 러브레터 이미지
    color: '#d63031', 
    difficulty: 'easy' 
  },
  '뱅': { 
    bggId: '3955', 
    name: '뱅! (Bang!)', 
    desc: '보안관, 부관, 무법자, 배신자라는 각자의 비밀 역할을 맡아 서부 총잡이가 되어 쏘고 피하는 정통 서부극 카드게임', 
    img: 'https://divedice.net/images/product/info/202111/533134242443d4fd215305ada6d6f6f6.jpg', // 한글판 뱅 이미지
    color: '#e67e22', 
    difficulty: 'medium' 
  },
  '우노': { 
    bggId: '2223', 
    name: '우노 (UNO)', 
    desc: '손에 든 카드와 같은 색상이나 숫자를 내어 패를 털어내고, 마지막 1장이 남았을 때 우노를 외치는 고전 카드게임', 
    img: 'https://divedice.net/images/product/info/202112/026111195974a226a27ae6085a60b24c.jpg', // 한글판 우노 이미지
    color: '#27ae60', 
    difficulty: 'easy' 
  },
  '아키올로지': { 
    bggId: '131301', 
    name: '아키올로지 (Archeology)', 
    desc: '사막 유적지를 발굴하여 보물 세트를 모아 상인에게 비싸게 팔아넘기며 모래폭풍과 도둑을 피하는 카드 컬렉션 게임', 
    img: 'https://divedice.net/images/product/info/202111/539650116574a8efe43e27503f39c116.jpg', // 한글판 아키올로지 이미지
    color: '#f39c12', 
    difficulty: 'easy' 
  }
};

// --- Web Audio API 효과음 신디사이저 ---
let audioCtx = null;
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playDropSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.45);

    stackContainer.classList.add('shake');
    setTimeout(() => stackContainer.classList.remove('shake'), 200);
  } catch (e) {}
}

function playCardSpawnSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1800, audioCtx.currentTime + 0.35);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    whiteNoise.start();
  } catch (e) {}
}

function playCardFlipSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440 + (i * 220), now + (i * 0.05));
      
      gainNode.gain.setValueAtTime(0.15, now + (i * 0.05));
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.05) + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now + (i * 0.05));
      osc.stop(now + (i * 0.05) + 0.35);
    }
  } catch (e) {}
}

// --- DOM Elements ---
const stackContainer = document.getElementById('stackContainer');
const decoLayer = document.getElementById('decoLayer');
const emptyPlaceholder = document.getElementById('emptyPlaceholder');
const totalHeightEl = document.getElementById('totalHeight');

const statPlaysEl = document.getElementById('statPlays');
const statTimeEl = document.getElementById('statTime');
const statGradeEl = document.getElementById('statGrade');

const winRateValEl = document.getElementById('winRateVal');
const winCountEl = document.getElementById('winCount');
const loseCountEl = document.getElementById('loseCount');
const bestMateArea = document.getElementById('bestMateArea');

const characterList = document.getElementById('characterList');
const logFeed = document.getElementById('logFeed');
const gameInfoGrid = document.getElementById('gameInfoGrid');

const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeAddModalBtn = document.getElementById('closeAddModalBtn');
const addModal = document.getElementById('addModal');
const recordForm = document.getElementById('recordForm');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const editingLogIdInput = document.getElementById('editingLogId');

const gameTitleInput = document.getElementById('gameTitle');
const bggSearchBtn = document.getElementById('bggSearchBtn');
const searchResultsDropdown = document.getElementById('searchResultsDropdown');
const selectedGamePreview = document.getElementById('selectedGamePreview');
const previewImg = document.getElementById('previewImg');
const previewTitle = document.getElementById('previewTitle');
const previewDesc = document.getElementById('previewDesc');
const gameThumbnailInput = document.getElementById('gameThumbnail');
const gameDescriptionInput = document.getElementById('gameDescription');

const colorPickerGrid = document.getElementById('colorPickerGrid');
const selectedColorInput = document.getElementById('selectedColor');

const starRatingContainer = document.getElementById('starRatingContainer');
const gameRatingInput = document.getElementById('gameRating');

const sortBySelect = document.getElementById('sortBy');

const soundToggleBtn = document.getElementById('soundToggleBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const feedFilterControls = document.getElementById('feedFilterControls');

const cardDrawOverlay = document.getElementById('cardDrawOverlay');
const flipCard = document.getElementById('flipCard');
const cardFrontView = document.getElementById('cardFrontView');
const closeCardBtn = document.getElementById('closeCardBtn');
const captureBtn = document.getElementById('captureBtn');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  loadData();
  renderColorPicker();
  setupStarRating();
  setupEventListeners();
  render();
});

// --- Data Operations ---
function loadData() {
  const saved = localStorage.getItem('dadok_dadok_board_logs');
  if (saved) {
    try {
      logs = JSON.parse(saved);
    } catch (e) {
      logs = [];
    }
  }

  const savedDecos = localStorage.getItem('dadok_dadok_board_decos');
  if (savedDecos) {
    try {
      decos = JSON.parse(savedDecos);
    } catch (e) {
      decos = [];
    }
  }

  const savedSound = localStorage.getItem('dadok_dadok_board_sound');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
  }
}

function saveData() {
  localStorage.setItem('dadok_dadok_board_logs', JSON.stringify(logs));
  localStorage.setItem('dadok_dadok_board_decos', JSON.stringify(decos));
  localStorage.setItem('dadok_dadok_board_sound', soundEnabled.toString());
}

// --- Render Core ---
function render(isNewAddition = false) {
  saveData();
  renderStats();
  renderAdvancedStats();
  renderStack();
  renderDecoLayer();
  renderLogFeed();
  renderGameInfoTab();
  renderCharacters();
  updateSoundButtonUI();
  
  if (isNewAddition) {
    setTimeout(playDropSound, 300);
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 대시보드 통계
function renderStats() {
  const count = logs.length;
  const totalTime = logs.reduce((acc, log) => acc + Number(log.playTime || 0), 0);
  
  statPlaysEl.innerText = `${count}회`;
  statTimeEl.innerText = `${totalTime}분`;

  let grade = '비기너 미플';
  if (count >= 20) grade = '보드게임 지신 🧙‍♂️';
  else if (count >= 12) grade = '미플 익스퍼트 👑';
  else if (count >= 8) grade = '룰북 정독이 📖';
  else if (count >= 5) grade = '보드 빌더 🧱';
  else if (count >= 3) grade = '아기 주사위 🎲';
  else if (count >= 1) grade = '꼬마 미플 🧸';
  
  statGradeEl.innerText = grade;
}

// 고급 분석 통계
function renderAdvancedStats() {
  const total = logs.length;
  if (total === 0) {
    winRateValEl.innerText = '0%';
    winCountEl.innerText = '0회';
    loseCountEl.innerText = '0회';
    bestMateArea.innerHTML = '<div class="mate-empty">아직 기록이 없습니다.</div>';
    return;
  }

  const wins = logs.filter(log => log.result === 'win').length;
  const winRate = Math.round((wins / total) * 100);
  winRateValEl.innerText = `${winRate}%`;
  winCountEl.innerText = `${wins}회`;
  loseCountEl.innerText = `${total - wins}회`;

  const companionsMap = {};
  logs.forEach(log => {
    if (log.companions) {
      const list = log.companions.split(',').map(s => s.trim()).filter(s => s.length > 0);
      list.forEach(name => {
        companionsMap[name] = (companionsMap[name] || 0) + 1;
      });
    }
  });

  const sortedCompanions = Object.entries(companionsMap).sort((a, b) => b[1] - a[1]);

  if (sortedCompanions.length === 0) {
    bestMateArea.innerHTML = '<div class="mate-empty">등록된 동반자가 없습니다.</div>';
  } else {
    bestMateArea.innerHTML = sortedCompanions.slice(0, 2).map(([name, count]) => `
      <div class="mate-row">
        <span class="mate-name">👤 ${name}</span>
        <span class="mate-count">함께 ${count}회 플레이</span>
      </div>
    `).join('');
  }
}

// 상자 두께 계산 및 상자 탑 렌더링
function calculateThickness(difficulty, playTime) {
  let weight = 1.0;
  if (difficulty === 'easy') weight = 0.5;
  else if (difficulty === 'heavy') weight = 1.5;

  const calculated = weight * (Number(playTime) * 0.05) + 1.5;
  return Math.max(1.8, Math.min(12, calculated));
}

function renderStack() {
  const boxes = stackContainer.querySelectorAll('.game-box-item');
  boxes.forEach(box => box.remove());

  if (logs.length === 0) {
    emptyPlaceholder.style.display = 'flex';
    totalHeightEl.innerText = '0cm';
    return;
  }

  emptyPlaceholder.style.display = 'none';

  let currentHeight = 0;
  const sortedForStack = [...logs].sort((a, b) => new Date(a.playDate) - new Date(b.playDate));

  sortedForStack.forEach((log) => {
    const thicknessCm = calculateThickness(log.boxThickness, log.playTime);
    currentHeight += thicknessCm;

    const boxEl = document.createElement('div');
    boxEl.className = 'game-box-item';
    boxEl.style.backgroundColor = log.color || '#ff7675';
    boxEl.style.height = `${(thicknessCm * 10) + 12}px`;
    boxEl.title = `${log.gameTitle} (${thicknessCm.toFixed(1)}cm)`;

    const thumbHtml = log.gameThumbnail ? `<img src="${log.gameThumbnail}" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; margin-right: 8px;">` : '🎲 ';

    boxEl.innerHTML = `
      <span class="game-box-text" style="display:flex; align-items:center;">
        ${thumbHtml} ${log.gameTitle}
      </span>
      <span class="game-box-height-badge">${thicknessCm.toFixed(1)}cm</span>
    `;

    boxEl.addEventListener('click', () => {
      openCardFlipView(log);
    });

    stackContainer.appendChild(boxEl);
  });

  totalHeightEl.innerText = `${currentHeight.toFixed(1)}cm`;
}

// 데코레이션 레이어 렌더링
function renderDecoLayer() {
  decoLayer.innerHTML = '';
  decos.forEach((deco) => {
    const meeple = document.createElement('div');
    meeple.className = 'deco-meeple';
    meeple.innerText = deco.emoji;
    meeple.style.left = `${deco.x}%`;
    meeple.style.top = `${deco.y}%`;
    meeple.title = '드래그하여 이동 / 더블클릭하여 제거';
    
    meeple.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      decos = decos.filter(d => d.id !== deco.id);
      render();
    });

    meeple.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const rect = stackContainer.getBoundingClientRect();
      
      const moveHandler = (moveEvent) => {
        let leftPercent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        let topPercent = ((moveEvent.clientY - rect.top) / rect.height) * 100;
        
        leftPercent = Math.max(0, Math.min(90, leftPercent));
        topPercent = Math.max(0, Math.min(90, topPercent));

        meeple.style.left = `${leftPercent}%`;
        meeple.style.top = `${topPercent}%`;
        
        deco.x = leftPercent;
        deco.y = topPercent;
      };

      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
        saveData();
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
    });

    decoLayer.appendChild(meeple);
  });
}

// 플레이 로그 피드 렌더링
function renderLogFeed() {
  logFeed.innerHTML = '';
  
  if (logs.length === 0) {
    logFeed.innerHTML = `
      <div class="empty-feed-placeholder" style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <p>기록된 플레이 로그가 없습니다.</p>
      </div>
    `;
    return;
  }

  const sortVal = sortBySelect.value;
  let sortedLogs = [...logs];

  if (sortVal === 'recent') {
    sortedLogs.sort((a, b) => new Date(b.playDate) - new Date(a.playDate));
  } else if (sortVal === 'oldest') {
    sortedLogs.sort((a, b) => new Date(a.playDate) - new Date(b.playDate));
  } else if (sortVal === 'rating') {
    sortedLogs.sort((a, b) => b.rating - a.rating);
  }

  sortedLogs.forEach((log) => {
    const card = document.createElement('div');
    card.className = 'log-card';
    
    let badgeClass = 'badge-none';
    let badgeText = '단순 기록';
    if (log.result === 'win') { badgeClass = 'badge-win'; badgeText = '승리 🎉'; }
    else if (log.result === 'lose') { badgeClass = 'badge-lose'; badgeText = '패배 😢'; }
    else if (log.result === 'draw') { badgeClass = 'badge-draw'; badgeText = '무승부 🤝'; }

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += `<i data-lucide="star" style="${i < log.rating ? '' : 'fill: none; color: #dfe6e9;'}"></i>`;
    }

    const cardThumb = log.gameThumbnail ? `<img src="${log.gameThumbnail}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">` : '';

    card.innerHTML = `
      <div class="log-color-indicator" style="background-color: ${log.color || '#ff7675'};"></div>
      <div class="log-card-left" style="cursor:pointer;">
        ${cardThumb}
        <div class="log-meta-info">
          <span class="log-game-title">${log.gameTitle}</span>
          <div class="log-details-row">
            <span class="log-detail-item"><i data-lucide="clock"></i> ${log.playTime}분</span>
            <span class="log-detail-item"><i data-lucide="users"></i> ${log.playerCount}명</span>
            ${log.companions ? `<span class="log-detail-item"><i data-lucide="user-plus"></i> ${log.companions}</span>` : ''}
          </div>
          ${log.review ? `<p class="log-review">${log.review}</p>` : ''}
        </div>
      </div>
      <div class="log-card-right">
        <span class="log-date">${log.playDate}</span>
        <div class="log-badge-row">
          <span class="result-badge ${badgeClass}">${badgeText}</span>
          <div class="log-stars">${starsHtml}</div>
          <div class="action-buttons">
            <button class="edit-log-btn" data-id="${log.id}" title="기록 수정">
              <i data-lucide="pencil"></i>
            </button>
            <button class="delete-log-btn" data-id="${log.id}" title="기록 지우기">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.log-card-left').addEventListener('click', () => {
      openCardFlipView(log);
    });

    card.querySelector('.edit-log-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openEditModal(log);
    });

    card.querySelector('.delete-log-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`'${log.gameTitle}' 기록을 탑에서 제거할까요?`)) {
        deleteLog(log.id);
      }
    });

    logFeed.appendChild(card);
  });
}

// 고정 도감 데이터와 플레이 로그 매핑하여 해금/잠금 상태 판정 후 도감 그리기
function renderGameInfoTab() {
  gameInfoGrid.innerHTML = '';

  Object.entries(ENCYCLOPEDIA_DB).forEach(([key, info]) => {
    const matchLog = logs.find(log => {
      const lowerInput = log.gameTitle.toLowerCase();
      const lowerKey = key.toLowerCase();
      const lowerName = info.name.toLowerCase();
      
      return lowerInput.includes(lowerKey) || lowerKey.includes(lowerInput) || lowerInput.includes(lowerName) || lowerName.includes(lowerInput);
    });

    const isUnlocked = !!matchLog;

    const card = document.createElement('div');
    card.className = `info-card ${isUnlocked ? '' : 'locked'}`;

    let diffLabel = '쉬움';
    if (info.difficulty === 'medium') diffLabel = '보통';
    else if (info.difficulty === 'heavy') diffLabel = '묵직함';

    if (isUnlocked) {
      const playCount = logs.filter(log => log.gameTitle.toLowerCase().includes(key.toLowerCase())).length;

      card.innerHTML = `
        <div class="info-card-header">
          <img src="${info.img}" class="info-card-blur-bg" alt="blur">
          <img src="${info.img}" class="info-card-img" alt="${info.name}">
        </div>
        <div class="info-card-body">
          <h3 class="info-card-title">${info.name}</h3>
          <div class="info-card-stat-row">
            <span>🎮 내 기록 <strong>${playCount}회</strong></span>
            <span>⚖️ 난이도 <strong>${diffLabel}</strong></span>
          </div>
          <p class="info-card-desc">${info.desc}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        openCardFlipView(matchLog);
      });

    } else {
      card.innerHTML = `
        <div class="info-card-header">
          <img src="${info.img}" class="info-card-blur-bg" alt="blur">
          <img src="${info.img}" class="info-card-img" alt="${info.name}">
        </div>
        <div class="info-card-body">
          <h3 class="info-card-title">${info.name}</h3>
          <div class="info-card-stat-row">
            <span>⚖️ 난이도 <strong>${diffLabel}</strong></span>
          </div>
          <p class="info-card-desc" style="color:transparent; text-shadow:0 0 8px rgba(0,0,0,0.5);">비공개 설명 블러 처리 블러 처리</p>
        </div>
        <div class="info-card-lock-overlay">
          <i data-lucide="lock"></i>
          <span>기록 시 도감 해금</span>
        </div>
      `;
    }

    gameInfoGrid.appendChild(card);
  });
}

// 3D 카드 뽑기 효과로 모달 열기
function openCardFlipView(log) {
  flipCard.classList.remove('flipped');
  closeCardBtn.style.display = 'none';

  let diffLabel = '가벼움 (카드/파티)';
  if (log.boxThickness === 'medium') diffLabel = '보통 (일반패밀리)';
  else if (log.boxThickness === 'heavy') diffLabel = '묵직함 (하드유로)';

  let badgeClass = 'badge-none';
  let badgeText = '단순 기록';
  if (log.result === 'win') { badgeClass = 'badge-win'; badgeText = '승리 🎉'; }
  else if (log.result === 'lose') { badgeClass = 'badge-lose'; badgeText = '패배 😢'; }
  else if (log.result === 'draw') { badgeClass = 'badge-draw'; badgeText = '무승부 🤝'; }

  let starsHtml = '';
  for (let i = 0; i < 5; i++) {
    starsHtml += `<i data-lucide="star" style="${i < log.rating ? '' : 'fill: none; color: #dfe6e9;'}"></i>`;
  }

  const thumbUrl = log.gameThumbnail || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=150&q=80';

  // 앞면 콘텐츠 조립
  cardFrontView.innerHTML = `
    <div class="card-header-glow" style="background: linear-gradient(135deg, ${log.color || '#1e1b4b'} 0%, #0f172a 100%);">
      <div class="card-badge-tag">${badgeText}</div>
      <img src="${thumbUrl}" class="card-front-thumb" alt="${log.gameTitle}">
    </div>
    <div class="card-front-body">
      <h3 class="card-front-title">${log.gameTitle}</h3>
      <div class="card-front-stars">${starsHtml}</div>
      
      <div class="card-front-stats">
        <span>⏱️ <strong>${log.playTime}분</strong></span>
        <span>👥 <strong>${log.playerCount}명</strong></span>
        <span>⚖️ <strong>${diffLabel}</strong></span>
      </div>
      
      <p class="card-front-desc">
        ${log.gameDescription || '게임 정보 설명이 없습니다.'}
      </p>
      
      ${log.review ? `<p class="log-review" style="margin-top:auto;"><strong>메모:</strong> ${log.review}</p>` : ''}
    </div>
    <div class="card-front-footer">
      플레이 날짜: ${log.playDate}
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }

  cardDrawOverlay.classList.add('active');
  playCardSpawnSound();
}

// 캐릭터 도감
function renderCharacters() {
  characterList.innerHTML = '';
  const playCount = logs.length;

  CHARACTERS.forEach((char) => {
    const isUnlocked = char.unlockFn(playCount);
    const badge = document.createElement('div');
    badge.className = `character-badge ${isUnlocked ? 'unlocked' : ''}`;
    
    badge.innerHTML = `
      <div class="character-avatar">${isUnlocked ? char.emoji : '🔒'}</div>
      <span class="character-name">${char.name}</span>
      <span class="character-cond">${char.condText}</span>
    `;

    if (isUnlocked) {
      badge.addEventListener('dblclick', () => {
        const newDeco = {
          id: Date.now().toString(),
          emoji: char.emoji,
          x: Math.floor(Math.random() * 80),
          y: Math.floor(Math.random() * 80)
        };
        decos.push(newDeco);
        render();
      });
    }

    characterList.appendChild(badge);
  });
}

// Sound Button UI Toggle
function updateSoundButtonUI() {
  if (soundEnabled) {
    soundToggleBtn.classList.remove('muted');
    soundToggleBtn.innerHTML = '<i data-lucide="volume-2"></i>';
  } else {
    soundToggleBtn.classList.add('muted');
    soundToggleBtn.innerHTML = '<i data-lucide="volume-x"></i>';
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// BGG API Search Logic
async function searchBoardGame(query) {
  if (!query) return;
  searchResultsDropdown.innerHTML = '<div style="padding:10px; font-size:0.85rem; color:var(--text-muted);">검색 중...</div>';
  searchResultsDropdown.classList.add('active');

  const offlineMatchKey = Object.keys(ENCYCLOPEDIA_DB).find(key => query.includes(key) || key.includes(query));
  
  let results = [];
  if (offlineMatchKey) {
    const dbItem = ENCYCLOPEDIA_DB[offlineMatchKey];
    results.push({
      id: 'offline_' + offlineMatchKey,
      name: dbItem.name,
      description: dbItem.desc,
      thumbnail: dbItem.img,
      color: dbItem.color
    });
  }

  try {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=${encodeURIComponent(query)}`);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");

    for (let i = 0; i < Math.min(5, items.length); i++) {
      const id = items[i].getAttribute("id");
      const name = items[i].getElementsByTagName("name")[0].getAttribute("value");
      const year = items[i].getElementsByTagName("yearpublished")[0] ? ` (${items[i].getElementsByTagName("yearpublished")[0].getAttribute("value")})` : '';
      
      results.push({
        id: id,
        name: name + year,
        isBgg: true
      });
    }
  } catch (err) {
    console.warn("BGG API Search Error:", err);
  }

  if (results.length === 0) {
    searchResultsDropdown.innerHTML = '<div style="padding:10px; font-size:0.85rem; color:var(--text-muted);">검색 결과가 없습니다.</div>';
    return;
  }

  searchResultsDropdown.innerHTML = '';
  results.forEach(res => {
    const itemEl = document.createElement('div');
    itemEl.className = 'search-result-item';
    itemEl.innerText = res.name;
    
    itemEl.addEventListener('click', async () => {
      searchResultsDropdown.classList.remove('active');
      gameTitleInput.value = res.name;

      if (res.isBgg) {
        await fetchBggDetails(res.id, res.name);
      } else {
        displaySelectedGame(res.name, res.thumbnail, res.description, res.color);
      }
    });
    searchResultsDropdown.appendChild(itemEl);
  });
}

// BGG 검색 시에도 고화질 <image> 노드를 파싱하여 흐릿하지 않은 원본 일러스트 사용
async function fetchBggDetails(bggId, gameName) {
  try {
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // thumbnail 대신 고화질 image 주소 추출
    const bigImg = xmlDoc.getElementsByTagName("image")[0] ? xmlDoc.getElementsByTagName("image")[0].textContent : '';
    const thumbnail = xmlDoc.getElementsByTagName("thumbnail")[0] ? xmlDoc.getElementsByTagName("thumbnail")[0].textContent : '';
    const finalImg = bigImg || thumbnail || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=80';

    let description = xmlDoc.getElementsByTagName("description")[0] ? xmlDoc.getElementsByTagName("description")[0].textContent : '';
    description = description.replace(/&amp;/g, '&').replace(/&quot;/g, '"').substring(0, 150) + "...";
    
    const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    // 만약 사용자가 도감에 있는 대표 게임을 한글/영문 검색하여 등록한다면, BGG 이미지 대신 오피셜 코보게 한글판 박스아트로 자동 치환하는 센스 구현!
    const offlineMatchKey = Object.keys(ENCYCLOPEDIA_DB).find(key => gameName.includes(key) || key.includes(gameName));
    const targetImg = offlineMatchKey ? ENCYCLOPEDIA_DB[offlineMatchKey].img : finalImg;

    displaySelectedGame(gameName, targetImg, description, randomColor);
  } catch (err) {
    console.error("BGG Detail fetch error:", err);
  }
}

function displaySelectedGame(name, imgUrl, desc, color) {
  previewTitle.innerText = name;
  previewDesc.innerText = desc || '상세 설명 없음';
  previewImg.src = imgUrl || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=150&q=80';
  
  gameThumbnailInput.value = imgUrl;
  gameDescriptionInput.value = desc;
  
  selectedGamePreview.style.display = 'flex';
  
  if (color) {
    selectedColorInput.value = color;
    document.querySelectorAll('.color-chip').forEach(chip => {
      if (rgbToHex(chip.style.backgroundColor) === color.toLowerCase() || chip.style.backgroundColor === color) {
        chip.classList.add('selected');
      } else {
        chip.classList.remove('selected');
      }
    });
  }
}

function rgbToHex(rgb) {
  if (rgb.startsWith('#')) return rgb;
  const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!parts) return rgb;
  delete(parts[0]);
  for (let i = 1; i <= 3; ++i) {
    parts[i] = parseInt(parts[i], 10).toString(16);
    if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  return '#' + parts.join('');
}

// Interaction Logic
function deleteLog(id) {
  logs = logs.filter(log => log.id !== id);
  render();
}

function openEditModal(log) {
  modalTitle.innerText = "✏️ 보드게임 플레이 기록 수정";
  submitBtn.innerText = "기록 수정 완료";
  editingLogIdInput.value = log.id;

  gameTitleInput.value = log.gameTitle;
  document.getElementById('playDate').value = log.playDate;
  document.getElementById('playTime').value = log.playTime;
  document.getElementById('playerCount').value = log.playerCount;
  document.getElementById('gameResult').value = log.result;
  document.getElementById('companions').value = log.companions || '';
  document.getElementById('gameReview').value = log.review || '';
  gameRatingInput.value = log.rating;
  
  document.querySelectorAll('input[name="boxThickness"]').forEach(radio => {
    if (radio.value === log.boxThickness) {
      radio.checked = true;
    }
  });

  if (log.gameThumbnail) {
    displaySelectedGame(log.gameTitle, log.gameThumbnail, log.gameDescription, log.color);
  } else {
    selectedGamePreview.style.display = 'none';
  }

  setupStarRating();
  addModal.classList.add('active');
}

function renderColorPicker() {
  colorPickerGrid.innerHTML = '';
  PRESET_COLORS.forEach((color, idx) => {
    const chip = document.createElement('div');
    chip.className = `color-chip ${idx === 0 ? 'selected' : ''}`;
    chip.style.backgroundColor = color;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      selectedColorInput.value = color;
    });
    colorPickerGrid.appendChild(chip);
  });
}

function setupStarRating() {
  const stars = starRatingContainer.querySelectorAll('.star-icon');
  
  function highlightStars(val) {
    stars.forEach(star => {
      const starVal = Number(star.getAttribute('data-value'));
      if (starVal <= val) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  stars.forEach(star => {
    const newStar = star.cloneNode(true);
    star.parentNode.replaceChild(newStar, star);

    newStar.addEventListener('click', () => {
      const val = Number(newStar.getAttribute('data-value'));
      gameRatingInput.value = val;
      highlightStars(val);
    });

    newStar.addEventListener('mouseover', () => {
      const val = Number(newStar.getAttribute('data-value'));
      starRatingContainer.querySelectorAll('.star-icon').forEach(s => {
        if (Number(s.getAttribute('data-value')) <= val) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });

    newStar.addEventListener('mouseout', () => {
      starRatingContainer.querySelectorAll('.star-icon').forEach(s => s.classList.remove('hover'));
    });
  });

  highlightStars(Number(gameRatingInput.value));
}

function setupEventListeners() {
  flipCard.addEventListener('click', () => {
    if (!flipCard.classList.contains('flipped')) {
      flipCard.classList.add('flipped');
      playCardFlipSound();
      setTimeout(() => {
        closeCardBtn.style.display = 'block';
      }, 600);
    }
  });

  closeCardBtn.addEventListener('click', () => {
    cardDrawOverlay.classList.remove('active');
  });

  captureBtn.addEventListener('click', () => {
    captureBtn.disabled = true;
    captureBtn.innerHTML = '<i data-lucide="loader"></i> 이미지 생성 중...';
    if (window.lucide) window.lucide.createIcons();

    html2canvas(stackContainer, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0f172a',
      scale: 1
    })
    .then((canvas) => {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      const link = document.createElement('a');
      link.download = `다독다독보드-탑-${new Date().toISOString().substring(2,10)}.jpg`;
      link.href = dataUrl;
      link.click();
      
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<i data-lucide="camera"></i> 탑 이미지 저장 (경량)';
      if (window.lucide) window.lucide.createIcons();
    })
    .catch((error) => {
      console.error('html2canvas error!', error);
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<i data-lucide="camera"></i> 탑 이미지 저장 (경량)';
      if (window.lucide) window.lucide.createIcons();
      alert('이미지 저장 중 오류가 발생했습니다. 브라우저 설정을 확인해주세요.');
    });
  });

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    saveData();
    updateSoundButtonUI();
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        if (panel.id === `${targetTab}Panel`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      if (targetTab === 'info') {
        feedFilterControls.style.display = 'none';
      } else {
        feedFilterControls.style.display = 'block';
      }
    });
  });

  openAddModalBtn.addEventListener('click', () => {
    modalTitle.innerText = "🎲 새 보드게임 플레이 기록";
    submitBtn.innerText = "상자 탑에 올리기";
    editingLogIdInput.value = "";
    selectedGamePreview.style.display = 'none';

    recordForm.reset();
    document.getElementById('playDate').value = new Date().toISOString().substring(0, 10);
    gameRatingInput.value = 5;
    setupStarRating();
    renderColorPicker();
    selectedColorInput.value = PRESET_COLORS[0];
    
    addModal.classList.add('active');
  });

  bggSearchBtn.addEventListener('click', () => {
    searchBoardGame(gameTitleInput.value.trim());
  });

  gameTitleInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchBoardGame(gameTitleInput.value.trim());
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResultsDropdown.classList.remove('active');
    }
  });

  const closeModal = () => {
    addModal.classList.remove('active');
  };

  closeAddModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
      closeModal();
    }
  });

  recordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gameTitle = gameTitleInput.value.trim();
    const playDate = document.getElementById('playDate').value;
    const playTime = document.getElementById('playTime').value;
    const playerCount = document.getElementById('playerCount').value;
    const result = document.getElementById('gameResult').value;
    const companions = document.getElementById('companions').value.trim();
    const boxThickness = document.querySelector('input[name="boxThickness"]:checked').value;
    const color = selectedColorInput.value;
    const rating = Number(gameRatingInput.value);
    const review = document.getElementById('gameReview').value.trim();
    
    const gameThumbnail = gameThumbnailInput.value;
    const gameDescription = gameDescriptionInput.value;

    const editingId = editingLogIdInput.value;
    let isNewAddition = false;
    let targetLogObj = null;

    if (editingId) {
      const idx = logs.findIndex(log => log.id === editingId);
      if (idx !== -1) {
        logs[idx] = {
          ...logs[idx],
          gameTitle,
          playDate,
          playTime,
          playerCount,
          result,
          companions,
          boxThickness,
          color,
          rating,
          review,
          gameThumbnail,
          gameDescription
        };
        targetLogObj = logs[idx];
      }
    } else {
      isNewAddition = true;
      const newLog = {
        id: Date.now().toString(),
        gameTitle,
        playDate,
        playTime,
        playerCount,
        result,
        companions,
        boxThickness,
        color,
        rating,
        review,
        gameThumbnail,
        gameDescription
      };
      logs.push(newLog);
      targetLogObj = newLog;
    }

    render(isNewAddition);
    closeModal();

    if (isNewAddition && targetLogObj) {
      setTimeout(() => {
        openCardFlipView(targetLogObj);
      }, 500);
    }
  });

  sortBySelect.addEventListener('change', () => {
    renderLogFeed();
  });
}
