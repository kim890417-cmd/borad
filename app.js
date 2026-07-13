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

const OFFLINE_GAME_DB = {
  '스플렌더': { name: '스플렌더 (Splendor)', desc: '보석 칩을 모아 광산을 개발하고 귀족들의 방문을 이끌어내는 대표적인 셋컬렉션 게임', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=150&q=80', color: '#6c5ce7' },
  '루미큐브': { name: '루미큐브 (Rummikub)', desc: '숫자 타일들을 규칙에 따라 조합하여 자신의 타일을 가장 먼저 모두 털어내는 두뇌 회전 게임', img: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=150&q=80', color: '#0984e3' },
  '카르카손': { name: '카르카손 (Carcassonne)', desc: '타일을 놓아 중세의 성, 길, 수도원을 완성하고 미플을 배치해 점수를 획득하는 명작 타일 배치 게임', img: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=150&q=80', color: '#2ecc71' },
  '카탄': { name: '카탄의 개척자 (Catan)', desc: '자원을 주사위로 획득하고 다른 플레이어와 거래하여 자신만의 영토와 길을 넓혀 나가는 협상 전략 게임', img: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&w=150&q=80', color: '#ff7675' },
  '할리갈리': { name: '할리갈리 (Halli Galli)', desc: '같은 과일 카드가 5개가 보이면 누구보다 빠르게 종을 쳐서 카드를 모으는 순발력 파티게임', img: 'https://images.unsplash.com/photo-1629812456605-4a044aa38fbc?auto=format&fit=crop&w=150&q=80', color: '#e74c3c' },
  '다빈치코드': { name: '다빈치코드 (Da Vinci Code)', desc: '상대방의 비밀 숫자 코드를 추리하고, 자신의 코드를 끝까지 숨겨내는 숫자 추리 게임', img: 'https://images.unsplash.com/photo-1611890798517-0127e27a1725?auto=format&fit=crop&w=150&q=80', color: '#34495e' }
};

// --- Web Audio API를 활용한 무설치 효과음 신디사이저 ---
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
  } catch (e) {
    console.warn("Audio play failed:", e);
  }
}

// 가챠 카드 팩 나타날 때 소리 (쉬이익)
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

// 카드가 촤라락 뒤집힐 때의 찬란한 효과음 (샤라랑 칭)
function playCardFlipSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    
    // 주파수가 상승하는 벨소리
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

// 카드 가챠 관련 DOM
const cardDrawOverlay = document.getElementById('cardDrawOverlay');
const flipCard = document.getElementById('flipCard');
const cardFrontView = document.getElementById('cardFrontView');
const closeCardBtn = document.getElementById('closeCardBtn');

// 캡처 단추
const captureBtn = document.getElementById('captureBtn');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
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

    // 메인 본문 영역 클릭 시 카드 상세 드로우 열기
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

// 보드게임 소개 탭 렌더링
function renderGameInfoTab() {
  gameInfoGrid.innerHTML = '';

  const uniqueGames = {};
  logs.forEach(log => {
    if (!uniqueGames[log.gameTitle]) {
      uniqueGames[log.gameTitle] = {
        title: log.gameTitle,
        thumbnail: log.gameThumbnail || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=150&q=80',
        desc: log.gameDescription || '설명 기록 없음',
        plays: 0,
        totalTime: 0,
        difficulty: log.boxThickness,
        // 오리지널 데이터 매핑 보관용
        originalLog: log 
      };
    }
    uniqueGames[log.gameTitle].plays += 1;
    uniqueGames[log.gameTitle].totalTime += Number(log.playTime || 0);
  });

  const gameList = Object.values(uniqueGames);

  if (gameList.length === 0) {
    gameInfoGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p>기록된 보드게임 정보가 없습니다.<br>플레이 로그에 보드게임을 등록하면 백과사전이 자동으로 완성됩니다!</p>
      </div>
    `;
    return;
  }

  gameList.forEach(game => {
    const card = document.createElement('div');
    card.className = 'info-card';

    let diffLabel = '쉬움';
    if (game.difficulty === 'medium') diffLabel = '보통';
    else if (game.difficulty === 'heavy') diffLabel = '묵직함';

    card.innerHTML = `
      <div class="info-card-header">
        <img src="${game.thumbnail}" class="info-card-blur-bg" alt="blur">
        <img src="${game.thumbnail}" class="info-card-img" alt="${game.title}">
      </div>
      <div class="info-card-body">
        <h3 class="info-card-title">${game.title}</h3>
        <div class="info-card-stat-row">
          <span>🎮 플레이 <strong>${game.plays}회</strong></span>
          <span>⏱️ 총 <strong>${game.totalTime}분</strong></span>
          <span>⚖️ 난이도 <strong>${diffLabel}</strong></span>
        </div>
        <p class="info-card-desc">${game.desc}</p>
      </div>
    `;

    // 카드 누르면 해당 보드게임 3D 드로우 효과로 세부 카드 펼쳐보기
    card.addEventListener('click', () => {
      openCardFlipView(game.originalLog);
    });

    gameInfoGrid.appendChild(card);
  });
}

// 3D 카드 뽑기 효과로 모달 열기
function openCardFlipView(log) {
  // 뒤집기 상태 초기화
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

  // Lucide 아이콘 로드
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

  const offlineMatch = Object.keys(OFFLINE_GAME_DB).find(key => query.includes(key) || key.includes(query));
  
  let results = [];
  if (offlineMatch) {
    const dbItem = OFFLINE_GAME_DB[offlineMatch];
    results.push({
      id: 'offline_' + offlineMatch,
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

async function fetchBggDetails(bggId, gameName) {
  try {
    const res = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const thumbnail = xmlDoc.getElementsByTagName("thumbnail")[0] ? xmlDoc.getElementsByTagName("thumbnail")[0].textContent : '';
    let description = xmlDoc.getElementsByTagName("description")[0] ? xmlDoc.getElementsByTagName("description")[0].textContent : '';
    
    description = description.replace(/&amp;/g, '&').replace(/&quot;/g, '"').substring(0, 150) + "...";
    const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

    displaySelectedGame(gameName, thumbnail, description, randomColor);
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
  // 3D 카드 클릭 시 뒤집기 이벤트
  flipCard.addEventListener('click', () => {
    if (!flipCard.classList.contains('flipped')) {
      flipCard.classList.add('flipped');
      playCardFlipSound();
      
      // 샤라랑 소리 끝난 후 보관 버튼 표시
      setTimeout(() => {
        closeCardBtn.style.display = 'block';
      }, 600);
    }
  });

  closeCardBtn.addEventListener('click', () => {
    cardDrawOverlay.classList.remove('active');
  });

  // 스택 캡처 기능 (dom-to-image 사용하여 모바일 용량 압축 캡처)
  captureBtn.addEventListener('click', () => {
    captureBtn.disabled = true;
    captureBtn.innerHTML = '<i data-lucide="loader"></i> 이미지 생성 중...';
    if (window.lucide) window.lucide.createIcons();

    // 캡처 최적화 옵션
    domtoimage.toJpeg(stackContainer, {
      quality: 0.75, // 75% 퀄리티 압축
      bgcolor: '#0f172a'
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `다독다독보드-탑-${new Date().toISOString().substring(2,10)}.jpg`;
      link.href = dataUrl;
      link.click();
      
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<i data-lucide="camera"></i> 탑 이미지 저장 (경량)';
      if (window.lucide) window.lucide.createIcons();
    })
    .catch((error) => {
      console.error('oops, something went wrong!', error);
      captureBtn.disabled = false;
      captureBtn.innerHTML = '<i data-lucide="camera"></i> 탑 이미지 저장 (경량)';
      if (window.lucide) window.lucide.createIcons();
      alert('이미지 저장에 실패했습니다. 브라우저 보안 설정을 확인해주세요.');
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

    // 새 기록 추가 시 카드 개봉 오버레이 오픈 연출 발동!
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
