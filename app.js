// --- State Management ---
let logs = [];
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

// --- DOM Elements ---
const stackContainer = document.getElementById('stackContainer');
const emptyPlaceholder = document.getElementById('emptyPlaceholder');
const totalHeightEl = document.getElementById('totalHeight');

const statPlaysEl = document.getElementById('statPlays');
const statTimeEl = document.getElementById('statTime');
const statGradeEl = document.getElementById('statGrade');

const characterList = document.getElementById('characterList');
const logFeed = document.getElementById('logFeed');

const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeAddModalBtn = document.getElementById('closeAddModalBtn');
const addModal = document.getElementById('addModal');
const recordForm = document.getElementById('recordForm');
const cancelBtn = document.getElementById('cancelBtn');

const colorPickerGrid = document.getElementById('colorPickerGrid');
const selectedColorInput = document.getElementById('selectedColor');

const starRatingContainer = document.getElementById('starRatingContainer');
const gameRatingInput = document.getElementById('gameRating');

const sortBySelect = document.getElementById('sortBy');

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
  const saved = localStorage.getItem('bustle_board_logs');
  if (saved) {
    try {
      logs = JSON.parse(saved);
    } catch (e) {
      logs = [];
    }
  }
}

function saveData() {
  localStorage.setItem('bustle_board_logs', JSON.stringify(logs));
}

// --- Render Core ---
function render() {
  saveData();
  renderStats();
  renderStack();
  renderLogFeed();
  renderCharacters();
  // Lucide 아이콘을 동적으로 다시 로드할 때 필요
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 1. Stats 대시보드 반영
function renderStats() {
  const count = logs.length;
  const totalTime = logs.reduce((acc, log) => acc + Number(log.playTime || 0), 0);
  
  statPlaysEl.innerText = `${count}회`;
  statTimeEl.innerText = `${totalTime}분`;

  // 등급 계산
  let grade = '비기너 미플';
  if (count >= 20) grade = '보드게임 지신 🧙‍♂️';
  else if (count >= 12) grade = '미플 익스퍼트 👑';
  else if (count >= 8) grade = '룰북 정독이 📖';
  else if (count >= 5) grade = '보드 빌더 🧱';
  else if (count >= 3) grade = '아기 주사위 🎲';
  else if (count >= 1) grade = '꼬마 미플 🧸';
  
  statGradeEl.innerText = grade;
}

// 2. 상자 탑 렌더링
function renderStack() {
  // 스택 컨테이너 내부의 game-box-item들 지우기
  const boxes = stackContainer.querySelectorAll('.game-box-item');
  boxes.forEach(box => box.remove());

  if (logs.length === 0) {
    emptyPlaceholder.style.display = 'flex';
    totalHeightEl.innerText = '0cm';
    return;
  }

  emptyPlaceholder.style.display = 'none';

  let currentHeight = 0;
  
  // 오래된 것부터 최신 순으로 스택에 쌓음 (스택은 아래서부터 위로 렌더링)
  const sortedForStack = [...logs].sort((a, b) => new Date(a.playDate) - new Date(b.playDate));

  sortedForStack.forEach((log) => {
    const thicknessCm = Number(log.boxThickness || 25) / 10; // 25 -> 2.5cm
    currentHeight += thicknessCm;

    const boxEl = document.createElement('div');
    boxEl.className = 'game-box-item';
    boxEl.style.backgroundColor = log.color || '#ff7675';
    // 두께 비례 높이 할당 (px)
    boxEl.style.height = `${Number(log.boxThickness) + 15}px`; 
    boxEl.title = `${log.gameTitle} (${thicknessCm}cm)`;

    boxEl.innerHTML = `
      <span class="game-box-text">${log.gameTitle}</span>
      <span class="game-box-height-badge">${thicknessCm.toFixed(1)}cm</span>
    `;

    // 상자 클릭 시 디테일 팝업 알림 (또는 기록 카드로 부드럽게 스크롤)
    boxEl.addEventListener('click', () => {
      alert(`[${log.gameTitle}]\n플레이 날짜: ${log.playDate}\n시간: ${log.playTime}분\n평점: ${'⭐'.repeat(log.rating)}\n메모: ${log.review || '기록 없음'}`);
    });

    stackContainer.appendChild(boxEl);
  });

  totalHeightEl.innerText = `${currentHeight.toFixed(1)}cm`;
}

// 3. 로그 목록 피드 렌더링
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
    
    // 결과 뱃지 클래스 맵
    let badgeClass = 'badge-none';
    let badgeText = '단순 기록';
    if (log.result === 'win') { badgeClass = 'badge-win'; badgeText = '승리 🎉'; }
    else if (log.result === 'lose') { badgeClass = 'badge-lose'; badgeText = '패배 😢'; }
    else if (log.result === 'draw') { badgeClass = 'badge-draw'; badgeText = '무승부 🤝'; }

    // 별점 렌더링
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += `<i data-lucide="star" style="${i < log.rating ? '' : 'fill: none; color: #dfe6e9;'}"></i>`;
    }

    card.innerHTML = `
      <div class="log-color-indicator" style="background-color: ${log.color || '#ff7675'};"></div>
      <div class="log-card-left">
        <div class="log-meta-info">
          <span class="log-game-title">${log.gameTitle}</span>
          <div class="log-details-row">
            <span class="log-detail-item"><i data-lucide="clock"></i> ${log.playTime}분</span>
            <span class="log-detail-item"><i data-lucide="users"></i> ${log.playerCount}명</span>
          </div>
          ${log.review ? `<p class="log-review">${log.review}</p>` : ''}
        </div>
      </div>
      <div class="log-card-right">
        <span class="log-date">${log.playDate}</span>
        <div class="log-badge-row">
          <span class="result-badge ${badgeClass}">${badgeText}</span>
          <div class="log-stars">${starsHtml}</div>
          <button class="delete-log-btn" data-id="${log.id}" title="기록 지우기">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;

    // 삭제 버튼 이벤트 바인딩
    const deleteBtn = card.querySelector('.delete-log-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`'${log.gameTitle}' 기록을 탑에서 제거할까요?`)) {
        deleteLog(log.id);
      }
    });

    logFeed.appendChild(card);
  });
}

// 4. 해금 캐릭터 프렌즈 도감 렌더링
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
    characterList.appendChild(badge);
  });
}

// --- Interaction Logic ---
function deleteLog(id) {
  logs = logs.filter(log => log.id !== id);
  render();
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
    star.addEventListener('click', () => {
      const val = Number(star.getAttribute('data-value'));
      gameRatingInput.value = val;
      highlightStars(val);
    });

    star.addEventListener('mouseover', () => {
      const val = Number(star.getAttribute('data-value'));
      stars.forEach(s => {
        if (Number(s.getAttribute('data-value')) <= val) {
          s.classList.add('hover');
        } else {
          s.classList.remove('hover');
        }
      });
    });

    star.addEventListener('mouseout', () => {
      stars.forEach(s => s.classList.remove('hover'));
    });
  });

  // 초기 평점 별점 설정
  highlightStars(Number(gameRatingInput.value));
}

function setupEventListeners() {
  // 모달 제어
  openAddModalBtn.addEventListener('click', () => {
    // 폼 및 오늘 날짜 디폴트 설정
    recordForm.reset();
    document.getElementById('playDate').value = new Date().toISOString().substring(0, 10);
    gameRatingInput.value = 5;
    setupStarRating();
    renderColorPicker();
    selectedColorInput.value = PRESET_COLORS[0];
    
    addModal.classList.add('active');
  });

  const closeModal = () => {
    addModal.classList.remove('active');
  };

  closeAddModalBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // 모달 바깥 배경 클릭시 닫기
  addModal.addEventListener('click', (e) => {
    if (e.target === addModal) {
      closeModal();
    }
  });

  // 기록 제출
  recordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const gameTitle = document.getElementById('gameTitle').value.trim();
    const playDate = document.getElementById('playDate').value;
    const playTime = document.getElementById('playTime').value;
    const playerCount = document.getElementById('playerCount').value;
    const result = document.getElementById('gameResult').value;
    const boxThickness = document.querySelector('input[name="boxThickness"]:checked').value;
    const color = selectedColorInput.value;
    const rating = Number(gameRatingInput.value);
    const review = document.getElementById('gameReview').value.trim();

    const newLog = {
      id: Date.now().toString(),
      gameTitle,
      playDate,
      playTime,
      playerCount,
      result,
      boxThickness,
      color,
      rating,
      review
    };

    logs.push(newLog);
    render();
    closeModal();
  });

  // 필터 정렬 체인지
  sortBySelect.addEventListener('change', () => {
    renderLogFeed();
  });
}
