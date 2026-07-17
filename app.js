// --- State Management ---
let logs = [];
let decos = [];
let soundEnabled = true;
let currentTheme = 'midnight';

// --- Bingo State ---
let currentMode = 'stack'; // 'stack' or 'bingo'
let bingoSlots = [];
let isBingoRewardClaimed = false;

const defaultBingoGames = [
  { name: '스플렌더', difficulty: 3, genre: '전략', img: 'images/스플렌더_seo.webp', completed: false },
  { name: '루미큐브', difficulty: 2, genre: '가벼움', img: 'images/루미큐브_seo.webp', completed: false },
  { name: '카르카손', difficulty: 2, genre: '가벼움', img: 'images/카르카손_seo.webp', completed: false },
  { name: '카탄', difficulty: 3, genre: '전략', img: 'images/카탄_seo.webp', completed: false },
  { name: '할리갈리', difficulty: 1, genre: '가벼움', img: 'images/할리갈리_seo.webp', completed: false },
  { name: '다빈치코드', difficulty: 2, genre: '가벼움', img: 'images/다빈치코드_seo.webp', completed: false },
  { name: '젝스님트', difficulty: 2, genre: '가벼움', img: 'images/젝스님트_seo.webp', completed: false },
  { name: '아발론', difficulty: 4, genre: '파티/심리', img: 'images/아발론_seo.webp', completed: false },
  { name: '딕싯', difficulty: 2, genre: '파티/심리', img: 'images/딕싯_seo.webp', completed: false },
  { name: '스컬', difficulty: 2, genre: '파티/심리', img: 'images/스컬_seo.webp', completed: false },
  { name: '아그리콜라', difficulty: 4, genre: '전략', img: 'images/아그리콜라.webp', completed: false },
  { name: '러브레터', difficulty: 2, genre: '가벼움', img: 'images/러브레터_seo.webp', completed: false },
  { name: '뱅', difficulty: 3, genre: '파티/심리', img: 'images/뱅_seo.webp', completed: false },
  { name: '우노', difficulty: 1, genre: '가벼움', img: 'images/우노_seo.webp', completed: false },
  { name: '아키올로지', difficulty: 2, genre: '가벼움', img: 'images/아키올로지_seo.jpg', completed: false },
  { name: '꼬치의달인', difficulty: 2, genre: '가벼움', img: 'images/꼬치의달인_seo.webp', completed: false }
];

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
  { id: 'c1', name: '꼬마 미플', emoji: '🧸', condText: '누적 1cm 달성', story: '아직은 보드판 위를 뒹굴뒹굴 구르는 것을 좋아하는 아기 미플입니다. 언젠가 거대한 보드게임 상자 탑을 정복하는 꿈을 꾸고 있습니다.', unlockFn: (height, count) => height >= 1 },
  { id: 'c2', name: '아기 주사위', emoji: '🎲', condText: '누적 3cm 달성', story: '숫자 6이 나오도록 매일 밤 머리를 박고 굴러다니는 초보 주사위입니다. 1이 나오면 시무룩해져 구석으로 굴러갑니다.', unlockFn: (height, count) => height >= 3 },
  { id: 'c3', name: '카드 슬리버', emoji: '✉️', condText: '누적 5cm 달성', story: '프로텍터 씌우기의 절대 강자. 소중한 보드게임 카드에 미세한 지문이나 먼지가 묻는 것을 절대 용서하지 않는 꼼꼼한 친구입니다.', unlockFn: (height, count) => height >= 5 },
  { id: 'c4', name: '보드 빌더', emoji: '🧱', condText: '누적 8cm 달성', story: '상자 탑의 균형을 연구하는 공학 미플입니다. 수평계와 각도기를 들고 다니며 어떻게 하면 더 안전하게 높이 쌓을 수 있을지 항상 연산 중입니다.', unlockFn: (height, count) => height >= 8 },
  { id: 'c5', name: '컴포 수집가', emoji: '💎', condText: '누적 12cm 달성', story: '나무 큐브나 플라스틱 피규어 컴포넌트 하나만 없어져도 온 방안을 뒤집어엎고 우는 욕심쟁이 요정입니다.', unlockFn: (height, count) => height >= 12 },
  { id: 'c6', name: '룰북 정독이', emoji: '📖', condText: '누적 16cm 달성', story: '게임을 시작하기 전에 두꺼운 한글/영문 룰북을 첫 장부터 끝 장까지 정독해야 직성이 풀립니다. 에러플 발견 시 조용히 돋보기를 치켜세웁니다.', unlockFn: (height, count) => height >= 16 },
  { id: 'c7', name: '하우스 룰러', emoji: '✏️', condText: '누적 20cm 달성', story: '기존의 게임 규칙이 마음에 안 들면 바로 자기만의 밸런스 패치 하우스 룰을 적용해버리는 창조적인 보드게이머입니다.', unlockFn: (height, count) => height >= 20 },
  { id: 'c8', name: '마플 시커', emoji: '🔍', condText: '누적 25cm 달성', story: 'BGG(보드게임긱) 순위 1위부터 100위까지의 게임 평점을 매일 분석하는 데이터 분석가 미플입니다.', unlockFn: (height, count) => height >= 25 },
  { id: 'c9', name: '미플 익스퍼트', emoji: '👑', condText: '누적 30cm 달성', story: '수많은 플레이를 거치며 전략과 블러핑의 경지에 다다른 정예 미플. 머리에 쓴 황금 왕관은 승리의 상징입니다.', unlockFn: (height, count) => height >= 30 },
  { id: 'c10', name: '타이머 마스터', emoji: '⏱️', condText: '누적 35cm 달성', story: '장고(장시간 고민)를 극도로 싫어하는 스피드광 미플. 남들의 차례가 10초를 넘어가면 모래시계를 거세게 흔들어 댑니다.', unlockFn: (height, count) => height >= 35 },
  { id: 'c11', name: '슬기로운 메이트', emoji: '🤝', condText: '누적 40cm 달성', story: '협력 게임을 할 때 조율과 협상을 도맡아 승리로 이끄는 평화주의자입니다. 다만 트롤 플레이어를 만나면 눈빛이 변합니다.', unlockFn: (height, count) => height >= 40 },
  { id: 'c12', name: '블러핑 요괴', emoji: '🎭', condText: '누적 45cm 달성', story: '마피아나 레지스탕스 아발론에서 악의 세력을 맡을 때 포커페이스를 무섭게 유지하는 거짓말의 천재 요정입니다.', unlockFn: (height, count) => height >= 45 },
  { id: 'c13', name: '선플레이어 미플', emoji: '🥇', condText: '누적 50cm 달성', story: '언제나 1등으로 차례를 시작하는 것에 목숨을 건 미플. 게임 시작 전 선을 정하는 미니 게임에서도 절대 양보란 없습니다.', unlockFn: (height, count) => height >= 50 },
  { id: 'c14', name: '꼬치 셰프 미플', emoji: '🍢', condText: '누적 55cm 달성', story: '꼬치의 달인 게임에 특화되어 재료를 빛의 속도로 꿰는 파티게임형 주방장 미플입니다.', unlockFn: (height, count) => height >= 55 },
  { id: 'c15', name: '할리갈리 종지기', emoji: '🔔', condText: '누적 60cm 달성', story: '과일 5개만 보이면 무서운 반사신경으로 종을 쳐 종을 박살 내기로 소문난 악명 높은 미플입니다.', unlockFn: (height, count) => height >= 60 },
  { id: 'c16', name: '점수 계산기', emoji: '🧮', condText: '누적 65cm 달성', story: '엔진빌딩 게임의 최종 점수 계산 단계에서 엄청난 계산 속도를 자랑하는 회계 담당 스마트 미플입니다.', unlockFn: (height, count) => height >= 65 },
  { id: 'c17', name: '박스 테이퍼', emoji: '🩹', condText: '누적 70cm 달성', story: '오래되어 찢어진 게임 상자 모서리를 투명 테이프로 정성스레 치료해주는 보드게임 병원의 간호사 미플입니다.', unlockFn: (height, count) => height >= 70 },
  { id: 'c18', name: '오거나이저 수호신', emoji: '📦', condText: '누적 75cm 달성', story: '종이 트레이 대신 아크릴과 목재 오거나이저를 사랑하는 정돈의 수호신 미플. 정리가 안 된 상자를 보면 스트레스를 받습니다.', unlockFn: (height, count) => height >= 75 },
  { id: 'c19', name: '테마 몰입러', emoji: '🧛', condText: '누적 80cm 달성', story: '보드게임의 스토리에 과몰입하여 목소리를 변조하거나 소품을 챙겨오는 정통 연기파 미플입니다.', unlockFn: (height, count) => height >= 80 },
  { id: 'c20', name: '긱 스토어 지키미', emoji: '🏪', condText: '누적 90cm 달성', story: '해외 직구로만 구할 수 있는 한정판 프로모션 카드나 메탈 코인을 상자 속에 수집해두는 상인 미플입니다.', unlockFn: (height, count) => height >= 90 },
  { id: 'c21', name: '보드게임 지신', emoji: '🧙‍♂️', condText: '누적 100cm 달성', story: '플레이 횟수가 수백 회에 달하며 보드판 위의 흐름을 훤히 꿰뚫고 있는 보드게임계의 현자 신선입니다.', unlockFn: (height, count) => height >= 100 },
  { id: 'c22', name: '주사위 신선', emoji: '🍀', condText: '누적 110cm 달성', story: '주사위를 던지기만 하면 원하는 숫자가 무조건 나오는 확률 조작 의혹의 소유자. 럭키 가이 미플입니다.', unlockFn: (height, count) => height >= 110 },
  { id: 'c23', name: '포슬리스 발굴단', emoji: '🦖', condText: '누적 120cm 달성', story: '보드판 아래 숨겨진 숨은 룰이나 꿀팁을 고고학자처럼 발굴해 내는 분석형 탐험가 미플입니다.', unlockFn: (height, count) => height >= 120 },
  { id: 'c24', name: '코인 리치 미플', emoji: '🪙', condText: '누적 130cm 달성', story: '가짜 종이 돈은 싫다! 짤랑거리는 묵직한 메탈 코인을 수집하며 게임 중에도 돈을 자랑하는 부자 미플입니다.', unlockFn: (height, count) => height >= 130 },
  { id: 'c25', name: '매트 깔개 요정', emoji: '🟩', condText: '누적 140cm 달성', story: '테이블 위에 고급 전용 게임 매트를 깔아 쾌적한 손맛을 선물해 주는 보드카페 단골 요정입니다.', unlockFn: (height, count) => height >= 140 },
  { id: 'c26', name: '한밤의 늑대 미플', emoji: '🐺', condText: '누적 150cm 달성', story: '한밤의 늑대인간 테마에서 태어났습니다. 밤만 되면 눈이 붉게 빛나며 마피아 게임을 은밀히 리드해 나갑니다.', unlockFn: (height, count) => height >= 150 },
  { id: 'c27', name: '성층권 도달러', emoji: '🚀', condText: '누적 160cm 달성', story: '높이 쌓아 올린 상자 탑의 정상에 우주선을 쏘아 올리고 성층권을 돌파해 달나라 보드게임장으로 가려는 미플입니다.', unlockFn: (height, count) => height >= 160 },
  { id: 'c28', name: '아그리 농부 미플', emoji: '👨‍🌾', condText: '누적 170cm 달성', story: '아그리콜라 밭에서 갓 수확한 싱싱한 야채와 가축들을 끌고 다니며 탑 주변을 평화롭게 일구는 농부 요정입니다.', unlockFn: (height, count) => height >= 170 },
  { id: 'c29', name: '골든 메카 미플', emoji: '🤖', condText: '누적 185cm 달성', story: '미래형 합금 재질로 만들어져 절대 쓰러지지 않는 단단한 메카 미플. 빙고 정복 후 탑에 소환되어 웅장함을 더합니다.', unlockFn: (height, count) => height >= 185 },
  { id: 'c30', name: '우주 보드 신선', emoji: '🪐', condText: '누적 200cm 달성', story: '우주의 모든 보드게임 규칙과 비하인드 룰북을 달달 외운 해탈의 보드 마스터 신선 미플. 최종 마스터 해금의 상징입니다.', unlockFn: (height, count) => height >= 200 }
];

// --- 20종 이상의 풍부한 기본 보드게임 도감 백과사전 DB (로컬 저장된 초경량 고화질 한글판 패키지 이미지로 매핑) ---
const ENCYCLOPEDIA_DB = {
  "스플렌더": {
    "bggId": "148228",
    "name": "스플렌더 (Splendor)",
    "desc": "보석 칩을 모아 광산을 개발하고 카드 점수를 모아 귀족들의 방문을 유도하는 최고의 셋컬렉션 입문 게임",
    "img": "images/스플렌더_seo.webp",
    "players": "2-4",
    "color": "#6c5ce7",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "루미큐브": {
    "bggId": "811",
    "name": "루미큐브 (Rummikub)",
    "desc": "숫자 타일들을 연속된 수 또는 같은 숫자의 다른 색 조합으로 맞춰 자신의 타일을 가장 먼저 터는 두뇌 보드게임",
    "img": "images/루미큐브_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "카르카손": {
    "bggId": "822",
    "name": "카르카손 (Carcassonne)",
    "desc": "타일을 한 장씩 뽑아 성, 길, 초원을 건설하고 내 미플을 놓아 영토를 넓히는 최고의 영향력 타일 배치 게임",
    "img": "images/카르카손_seo.webp",
    "players": "2-5",
    "color": "#2ecc71",
    "difficulty": "easy",
    "genre": "casual"
  },
  "카탄": {
    "bggId": "13",
    "name": "카탄의 개척자 (Catan)",
    "desc": "자원을 생산하고 다른 개척자들과의 활발한 거래 및 도로, 마을 확장을 통해 10점을 먼저 획득하는 협상 전략 게임",
    "img": "images/카탄_seo.webp",
    "players": "3-4",
    "color": "#ff7675",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "할리갈리": {
    "bggId": "598",
    "name": "할리갈리 (Halli Galli)",
    "desc": "과일의 합이 정확히 5개가 되는 순간 누구보다 빠르게 종을 쳐서 카드를 쓸어 담는 순발력 과일 게임",
    "img": "images/할리갈리_seo.webp",
    "players": "2-6",
    "color": "#e74c3c",
    "difficulty": "easy",
    "genre": "casual"
  },
  "다빈치코드": {
    "bggId": "8946",
    "name": "다빈치코드 (Da Vinci Code)",
    "desc": "상대방의 흑백 타일 번호를 하나씩 밝혀내고 나의 비밀 숫자 조합은 끝까지 감추는 숫자 추리 게임",
    "img": "images/다빈치코드_seo.webp",
    "players": "2-4",
    "color": "#34495e",
    "difficulty": "easy",
    "genre": "casual"
  },
  "젝스님트": {
    "bggId": "118",
    "name": "젝스님트 (6 Nimmst!)",
    "desc": "카드를 비공개로 내고 오름차순으로 배치하다가, 6번째 카드를 놓는 불운의 플레이어가 벌점 카드를 먹는 파티 눈치 카드게임",
    "img": "images/젝스님트_seo.webp",
    "players": "2-10",
    "color": "#e84393",
    "difficulty": "easy",
    "genre": "casual"
  },
  "아발론": {
    "bggId": "128839",
    "name": "레지스탕스 아발론 (Avalon)",
    "desc": "선과 악의 진영으로 나뉘어 서로의 정체를 속이고 미션을 성공시키거나 저지하는 최고의 마피아 블러핑 게임",
    "img": "images/아발론_seo.webp",
    "players": "5-10",
    "color": "#16a085",
    "difficulty": "heavy",
    "genre": "party"
  },
  "딕싯": {
    "bggId": "39856",
    "name": "딕싯 (Dixit)",
    "desc": "추상적인 일러스트 카드를 보고 다채로운 힌트를 제시하여 출제자의 카드를 맞추는 감성 스토리텔링 게임",
    "img": "images/딕싯_seo.webp",
    "players": "3-6",
    "color": "#8e44ad",
    "difficulty": "easy",
    "genre": "party"
  },
  "스컬": {
    "bggId": "131057",
    "name": "스컬 (Skull)",
    "desc": "꽃과 해골이 그려진 디스크를 내고, 해골을 밟지 않으면서 자기가 선언한 장수만큼 뒤집는 고도의 심리 블러핑 포커 게임",
    "img": "images/스컬_seo.webp",
    "players": "3-6",
    "color": "#fdcb6e",
    "difficulty": "easy",
    "genre": "party"
  },
  "아그리콜라": {
    "bggId": "",
    "name": "아그리콜라",
    "desc": "아그리콜라 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/아그리콜라_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "러브레터": {
    "bggId": "129622",
    "name": "러브레터 (Love Letter)",
    "desc": "단 16장의 카드만을 사용하여 공주에게 비밀 편지를 무사히 배달하고 다른 라이벌을 탈락시키는 전략 카드게임",
    "img": "images/러브레터_seo.webp",
    "players": "2-4",
    "color": "#d63031",
    "difficulty": "easy",
    "genre": "casual"
  },
  "뱅": {
    "bggId": "3955",
    "name": "뱅! (Bang!)",
    "desc": "보안관, 부관, 무법자, 배신자라는 각자의 비밀 역할을 맡아 서부 총잡이가 되어 쏘고 피하는 정통 서부극 카드게임",
    "img": "images/뱅_seo.webp",
    "players": "4-7",
    "color": "#e67e22",
    "difficulty": "medium",
    "genre": "party"
  },
  "우노": {
    "bggId": "2223",
    "name": "우노 (UNO)",
    "desc": "손에 든 카드와 같은 색상이나 숫자를 내어 패를 털어내고, 마지막 1장이 남았을 때 우노를 외치는 고전 카드게임",
    "img": "images/우노_seo.webp",
    "players": "2-10",
    "color": "#27ae60",
    "difficulty": "easy",
    "genre": "casual"
  },
  "아키올로지": {
    "bggId": "131301",
    "name": "아키올로지 (Archeology)",
    "desc": "사막 유적지를 발굴하여 보물 세트를 모아 상인에게 비싸게 팔아넘기며 모래폭풍과 도둑을 피하는 카드 컬렉션 게임",
    "img": "images/아키올로지_seo.jpg",
    "players": "2-4",
    "color": "#f39c12",
    "difficulty": "easy",
    "genre": "casual"
  },
  "꼬치의달인": {
    "bggId": "317985",
    "name": "꼬치의달인 (Kebab Chef)",
    "desc": "재료를 골라 꼬치를 완성하고 손님에게 서빙하는 최고의 요리사가 되어보는 순발력 카드게임",
    "img": "images/꼬치의달인_seo.webp",
    "players": "2-5",
    "color": "#ff7675",
    "difficulty": "easy",
    "genre": "casual"
  },
  "달무티": {
    "bggId": "",
    "name": "달무티 (Dalmunti)",
    "desc": "귀여운 테마의 카드 게임으로, 계급 변동에 따른 치열한 눈치 싸움을 즐겨보세요!",
    "img": "images/달무티_seo.webp",
    "players": "4-8",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "노터치크라켄": {
    "bggId": "",
    "name": "노터치크라켄 (No Touch Kraken)",
    "desc": "크라켄을 건드리지 않고 해저 보물을 회수하는 파티용 정체 은닉 게임",
    "img": "images/노터치크라켄_seo.webp",
    "players": "4-6",
    "color": "#00cec9",
    "difficulty": "easy",
    "genre": "party"
  },
  "스위스사는스미스씨": {
    "bggId": "",
    "name": "스위스사는스미스씨 (Mr. Smith in Switzerland)",
    "desc": "스위스에 사는 스미스 씨가 되어 다양한 에피소드를 해결하는 스토리텔링 카드게임",
    "img": "images/스위스사는스미스씨_seo.webp",
    "players": "3-8",
    "color": "#2ecc71",
    "difficulty": "easy",
    "genre": "casual"
  },
  "핸즈업": {
    "bggId": "",
    "name": "핸즈업 (Hands Up)",
    "desc": "손을 빠르게 움직여 주어진 동작을 가장 먼저 완성하는 순발력 파티게임",
    "img": "images/핸즈업_seo.webp",
    "players": "2-8",
    "color": "#e74c3c",
    "difficulty": "easy",
    "genre": "casual"
  },
  "한밤의늑대인간": {
    "bggId": "",
    "name": "한밤의늑대인간 (Werewolf at Midnight)",
    "desc": "밤이 되면 늑대인간으로 변하는 마을 사람들 사이에서 정체를 숨기고 살아남는 심리 추리 게임",
    "img": "images/한밤의늑대인간_seo.webp",
    "players": "3-10",
    "color": "#34495e",
    "difficulty": "easy",
    "genre": "party"
  },
  "프레즌트": {
    "bggId": "",
    "name": "프레즌트 (Present)",
    "desc": "선물 상자를 서로 돌리며 누가 가장 멋진 선물을 받을지 내기하는 파티 게임",
    "img": "images/프레즌트_seo.webp",
    "players": "2-6",
    "color": "#e84393",
    "difficulty": "easy",
    "genre": "casual"
  },
  "포실리스": {
    "bggId": "",
    "name": "포실리스 (Fossilis)",
    "desc": "고고학자가 되어 화석을 발굴하고 박물관에 전시하는 테마의 카드 게임",
    "img": "images/포실리스_seo.webp",
    "players": "2-5",
    "color": "#d35400",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "펭귄파티": {
    "bggId": "",
    "name": "펭귄파티 (Penguin Party)",
    "desc": "귀여운 펭귄들이 펼치는 얼음 위 파티! 가장 많은 물고기를 모으는 가족 보드게임",
    "img": "images/펭귄파티_seo.webp",
    "players": "2-4",
    "color": "#16a085",
    "difficulty": "easy",
    "genre": "casual"
  },
  "페이퍼사파리": {
    "bggId": "",
    "name": "페이퍼사파리 (Paper Safari)",
    "desc": "접힌 종이를 펼쳐 동물을 완성하고 다양한 동물을 수집하는 어린이 보드게임",
    "img": "images/페이퍼사파리_seo.webp",
    "players": "2-4",
    "color": "#27ae60",
    "difficulty": "easy",
    "genre": "casual"
  },
  "타코캣고트치즈피자": {
    "bggId": "372332",
    "name": "타코캣고트치즈피자 (Taco Cat Goat Cheese Pizza)",
    "desc": "카드를 돌며 외치다가 같은 그림이 나오면 손으로 팍! 쳐야 하는 초고속 순발력 파티게임",
    "img": "images/타코캣고트치즈피자_seo.webp",
    "players": "2-8",
    "color": "#ff7675",
    "difficulty": "easy",
    "genre": "casual"
  },
  "쿼리도": {
    "bggId": "6249",
    "name": "쿼리도 (Quoridor)",
    "desc": "내 말을 먼저 반대편 끝까지 보내는 전략 미로 게임. 벽을 세워 상대를 막고 길을 개척하라",
    "img": "images/쿼리도_seo.webp",
    "players": "2-4",
    "color": "#6c5ce7",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "캘리코": {
    "bggId": "355433",
    "name": "캘리코 (Calico)",
    "desc": "패치워크 퀼트를 디자인하여 귀여운 고양이들을 유치하는 퍼즐 전략 게임",
    "img": "images/캘리코_seo.webp",
    "players": "1-4",
    "color": "#fdcb6e",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "캔트스탑": {
    "bggId": "41",
    "name": "캔트스탑 (Can't Stop)",
    "desc": "주사위를 굴려 숫자를 완성하는데 그만둘지 계속할지 선택의 연속! 짜릿한 푸시유어럭 게임",
    "img": "images/캔트스탑_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "카리바": {
    "bggId": "",
    "name": "카리바 (Kariba)",
    "desc": "아프리카 사바나에서 동물 카드를 내며 더 강한 동물로 약한 동물을 덮는 간단한 카드게임",
    "img": "images/카리바_seo.webp",
    "players": "2-4",
    "color": "#e67e22",
    "difficulty": "easy",
    "genre": "casual"
  },
  "치킨차차": {
    "bggId": "",
    "name": "치킨차차 (Chicken Cha Cha)",
    "desc": "치킨이 되어 알을 낳고 병아리를 키우는 유쾌한 기억력 게임",
    "img": "images/치킨차차_seo.webp",
    "players": "2-4",
    "color": "#f39c12",
    "difficulty": "easy",
    "genre": "casual"
  },
  "익스플로딩키튼": {
    "bggId": "172291",
    "name": "익스플로딩키튼 (Exploding Kittens)",
    "desc": "폭발하는 고양이를 피하고 다양한 액션 카드로 상대를 공격하는 최후의 1인이 되는 러시안룰렛 카드게임",
    "img": "images/익스플로딩키튼_seo.webp",
    "players": "2-5",
    "color": "#e84393",
    "difficulty": "easy",
    "genre": "casual"
  },
  "우봉고": {
    "bggId": "29246",
    "name": "우봉고 (Ubongo)",
    "desc": "퍼즐 조각을 제한 시간 안에 맞춰 보석을 획득하는 두뇌 퍼즐 게임",
    "img": "images/우봉고_seo.webp",
    "players": "1-4",
    "color": "#00cec9",
    "difficulty": "medium",
    "genre": "casual"
  },
  "시타델": {
    "bggId": "478",
    "name": "시타델 (Citadels)",
    "desc": "왕국을 건설하며 다양한 캐릭터를 선택해 상대보다 먼저 8개 구역을 완성하는 전략 카드게임",
    "img": "images/시타델_seo.webp",
    "players": "2-7",
    "color": "#8e44ad",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "슬리핑퀸즈": {
    "bggId": "153999",
    "name": "슬리핑퀸즈 (Sleeping Queens)",
    "desc": "잠자는 여왕들을 깨워 왕국을 재건하는 동화 같은 테마의 어린이 카드게임",
    "img": "images/슬리핑퀸즈_seo.webp",
    "players": "2-5",
    "color": "#6c5ce7",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스파이폴": {
    "bggId": "131922",
    "name": "스파이폴 (Spyfall)",
    "desc": "스파이를 찾아내거나 스파이로써 정체를 숨기는 심리 블러핑 질문 게임",
    "img": "images/스파이폴_seo.webp",
    "players": "3-8",
    "color": "#2ecc71",
    "difficulty": "easy",
    "genre": "party"
  },
  "스틱스택": {
    "bggId": "",
    "name": "스틱스택 (Stick Stack)",
    "desc": "막대기를 하나씩 빼서 쌓으며 균형을 유지하는 손기술 소근육 발달 게임",
    "img": "images/스틱스택_seo.webp",
    "players": "2-4",
    "color": "#ff7675",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스컬킹": {
    "bggId": "",
    "name": "스컬킹 (Skull King)",
    "desc": "트릭을 예측하고 해적왕 스컬킹을 조심하며 승부를 거는 해적 테마 트릭테이킹 게임",
    "img": "images/스컬킹_seo.webp",
    "players": "2-8",
    "color": "#e74c3c",
    "difficulty": "medium",
    "genre": "casual"
  },
  "로보77": {
    "bggId": "",
    "name": "로보77 (Robo 77)",
    "desc": "숫자 카드를 전략적으로 사용해 합이 정확히 77이 되지 않도록 조절하는 숫자 카드게임",
    "img": "images/로보77_seo.webp",
    "players": "2-5",
    "color": "#34495e",
    "difficulty": "easy",
    "genre": "casual"
  },
  "도블": {
    "bggId": "391163",
    "name": "도블 (Dobble)",
    "desc": "두 카드 사이에 항상 하나의 같은 그림을 가장 먼저 찾아내는 초스피드 관찰력 게임",
    "img": "images/도블_seo.webp",
    "players": "2-8",
    "color": "#27ae60",
    "difficulty": "easy",
    "genre": "casual"
  },
  "마네": {
    "bggId": "",
    "name": "마네 (Manee)",
    "desc": "경매와 교환을 통해 원하는 동물 카드를 모으는 한국형 보드게임",
    "img": "images/마네_seo.webp",
    "players": "2-5",
    "color": "#16a085",
    "difficulty": "easy",
    "genre": "casual"
  },
  "보난자": {
    "bggId": "425",
    "name": "보난자 (Bohnanza)",
    "desc": "콩 농장을 운영하며 콩을 심고 수확해 가장 많은 수익을 올리는 트레이딩 카드게임의 명작",
    "img": "images/보난자_seo.webp",
    "players": "2-7",
    "color": "#d35400",
    "difficulty": "medium",
    "genre": "casual"
  },
  "더마인드": {
    "bggId": "244992",
    "name": "더마인드 (The Mind)",
    "desc": "대화 없이 오직 타이밍만으로 카드를 오름차순으로 내는 신개념 협력 카드게임",
    "img": "images/더마인드_seo.webp",
    "players": "2-4",
    "color": "#fdcb6e",
    "difficulty": "easy",
    "genre": "casual"
  },
  "5초 준다": {
    "bggId": "",
    "name": "5초 준다",
    "desc": "5초 준다 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/5초 준다_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "AI 스페이스 퍼즐": {
    "bggId": "",
    "name": "AI 스페이스 퍼즐",
    "desc": "AI 스페이스 퍼즐 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/AI 스페이스 퍼즐_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "CONTACT 콘택트": {
    "bggId": "",
    "name": "CONTACT 콘택트",
    "desc": "CONTACT 콘택트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/CONTACT 콘택트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "DUO mini 듀오 미니": {
    "bggId": "",
    "name": "DUO mini 듀오 미니",
    "desc": "DUO mini 듀오 미니 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/DUO mini 듀오 미니_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "EUROPE 10일간의유럽여행": {
    "bggId": "",
    "name": "EUROPE 10일간의유럽여행",
    "desc": "EUROPE 10일간의유럽여행 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/EUROPE 10일간의유럽여행_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "kamisado 달빛아래에서 수를": {
    "bggId": "",
    "name": "kamisado 달빛아래에서 수를",
    "desc": "kamisado 달빛아래에서 수를 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/kamisado 달빛아래에서 수를_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "USA 10일간의미국여행": {
    "bggId": "",
    "name": "USA 10일간의미국여행",
    "desc": "USA 10일간의미국여행 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/USA 10일간의미국여행_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "간장공장 공장장": {
    "bggId": "",
    "name": "간장공장 공장장",
    "desc": "간장공장 공장장 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/간장공장 공장장_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "간큐브 GAN16 마그레브 맥스 UV": {
    "bggId": "",
    "name": "간큐브 GAN16 마그레브 맥스 UV",
    "desc": "간큐브 GAN16 마그레브 맥스 UV 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/간큐브 GAN16 마그레브 맥스 UV_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "간큐브 GAN56_M": {
    "bggId": "",
    "name": "간큐브 GAN56_M",
    "desc": "간큐브 GAN56_M 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/간큐브 GAN56_M_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "개정판 블랙스토리즈": {
    "bggId": "",
    "name": "개정판 블랙스토리즈",
    "desc": "개정판 블랙스토리즈 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/개정판 블랙스토리즈_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "party"
  },
  "구룡투": {
    "bggId": "",
    "name": "구룡투",
    "desc": "구룡투 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/구룡투_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "궁신": {
    "bggId": "",
    "name": "궁신",
    "desc": "궁신 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/궁신_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "그라울최후의밤": {
    "bggId": "",
    "name": "그라울최후의밤",
    "desc": "그라울최후의밤 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/그라울최후의밤_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "그래비트랙스 코어 스타터": {
    "bggId": "",
    "name": "그래비트랙스 코어 스타터",
    "desc": "그래비트랙스 코어 스타터 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/그래비트랙스 코어 스타터_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "글룸헤이븐 사자의 턱": {
    "bggId": "",
    "name": "글룸헤이븐 사자의 턱",
    "desc": "글룸헤이븐 사자의 턱 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/글룸헤이븐 사자의 턱_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "기묘한 이야기": {
    "bggId": "",
    "name": "기묘한 이야기",
    "desc": "기묘한 이야기 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/기묘한 이야기_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "기차섬": {
    "bggId": "",
    "name": "기차섬",
    "desc": "기차섬 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/기차섬_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "나르 바이킹 시대": {
    "bggId": "",
    "name": "나르 바이킹 시대",
    "desc": "나르 바이킹 시대 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/나르 바이킹 시대_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "날아라 고블린": {
    "bggId": "",
    "name": "날아라 고블린",
    "desc": "날아라 고블린 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/날아라 고블린_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "너 좀 빠른데": {
    "bggId": "",
    "name": "너 좀 빠른데",
    "desc": "너 좀 빠른데 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/너 좀 빠른데_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "너도나도파티": {
    "bggId": "",
    "name": "너도나도파티",
    "desc": "너도나도파티 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/너도나도파티_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "노 땡스 딜럭스": {
    "bggId": "",
    "name": "노 땡스 딜럭스",
    "desc": "노 땡스 딜럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/노 땡스 딜럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "노머시": {
    "bggId": "",
    "name": "노머시",
    "desc": "노머시 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/노머시_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "놉놉 테이블": {
    "bggId": "",
    "name": "놉놉 테이블",
    "desc": "놉놉 테이블 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/놉놉 테이블_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "누가 치즈를 훔쳤을까": {
    "bggId": "",
    "name": "누가 치즈를 훔쳤을까",
    "desc": "누가 치즈를 훔쳤을까 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/누가 치즈를 훔쳤을까_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "다 죽었DAY": {
    "bggId": "",
    "name": "다 죽었DAY",
    "desc": "다 죽었DAY 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/다 죽었DAY_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "다크호스": {
    "bggId": "",
    "name": "다크호스",
    "desc": "다크호스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/다크호스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "당나귀 다리": {
    "bggId": "",
    "name": "당나귀 다리",
    "desc": "당나귀 다리 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/당나귀 다리_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "더게임 퀵앤이지": {
    "bggId": "",
    "name": "더게임 퀵앤이지",
    "desc": "더게임 퀵앤이지 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/더게임 퀵앤이지_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "더게임": {
    "bggId": "",
    "name": "더게임",
    "desc": "더게임 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/더게임_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "도미니언": {
    "bggId": "",
    "name": "도미니언",
    "desc": "도미니언 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/도미니언_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "도토리산": {
    "bggId": "",
    "name": "도토리산",
    "desc": "도토리산 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/도토리산_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "독수리눈치싸움": {
    "bggId": "",
    "name": "독수리눈치싸움",
    "desc": "독수리눈치싸움 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/독수리눈치싸움_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "듄 임페리움 확장_ 불멸": {
    "bggId": "",
    "name": "듄 임페리움 확장_ 불멸",
    "desc": "듄 임페리움 확장_ 불멸 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/듄 임페리움 확장_ 불멸_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "듄 임페리움 확장_ 익스의 부상": {
    "bggId": "",
    "name": "듄 임페리움 확장_ 익스의 부상",
    "desc": "듄 임페리움 확장_ 익스의 부상 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/듄 임페리움 확장_ 익스의 부상_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "드래곤우드": {
    "bggId": "",
    "name": "드래곤우드",
    "desc": "드래곤우드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/드래곤우드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "드렉사우 딜럭스": {
    "bggId": "",
    "name": "드렉사우 딜럭스",
    "desc": "드렉사우 딜럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/드렉사우 딜럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "디셉션": {
    "bggId": "",
    "name": "디셉션",
    "desc": "디셉션 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/디셉션_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "party"
  },
  "디지트": {
    "bggId": "",
    "name": "디지트",
    "desc": "디지트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/디지트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "라마랜드": {
    "bggId": "",
    "name": "라마랜드",
    "desc": "라마랜드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/라마랜드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "럭키넘버스 본판": {
    "bggId": "",
    "name": "럭키넘버스 본판",
    "desc": "럭키넘버스 본판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/럭키넘버스 본판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "레벨10 카드로 즐기는 RPG": {
    "bggId": "",
    "name": "레벨10 카드로 즐기는 RPG",
    "desc": "레벨10 카드로 즐기는 RPG 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/레벨10 카드로 즐기는 RPG_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "렉시오 오리지널": {
    "bggId": "",
    "name": "렉시오 오리지널",
    "desc": "렉시오 오리지널 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/렉시오 오리지널_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "롤카메라": {
    "bggId": "",
    "name": "롤카메라",
    "desc": "롤카메라 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/롤카메라_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "롱샷 본판": {
    "bggId": "",
    "name": "롱샷 본판",
    "desc": "롱샷 본판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/롱샷 본판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "루티어 딜럭스": {
    "bggId": "",
    "name": "루티어 딜럭스",
    "desc": "루티어 딜럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/루티어 딜럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "리빙포레스트 본판": {
    "bggId": "",
    "name": "리빙포레스트 본판",
    "desc": "리빙포레스트 본판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/리빙포레스트 본판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "마법사와 움직이는 탑": {
    "bggId": "",
    "name": "마법사와 움직이는 탑",
    "desc": "마법사와 움직이는 탑 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/마법사와 움직이는 탑_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "마작 딜럭스": {
    "bggId": "",
    "name": "마작 딜럭스",
    "desc": "마작 딜럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/마작 딜럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "매직만달라": {
    "bggId": "",
    "name": "매직만달라",
    "desc": "매직만달라 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/매직만달라_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "머핀타임": {
    "bggId": "",
    "name": "머핀타임",
    "desc": "머핀타임 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/머핀타임_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "멍야옹비스킷 미니": {
    "bggId": "",
    "name": "멍야옹비스킷 미니",
    "desc": "멍야옹비스킷 미니 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/멍야옹비스킷 미니_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "메르카두 드 리스보아": {
    "bggId": "",
    "name": "메르카두 드 리스보아",
    "desc": "메르카두 드 리스보아 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/메르카두 드 리스보아 _seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "메모아르": {
    "bggId": "",
    "name": "메모아르",
    "desc": "메모아르 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/메모아르_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "메이플밸리 본판": {
    "bggId": "",
    "name": "메이플밸리 본판",
    "desc": "메이플밸리 본판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/메이플밸리 본판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "명탐정 멍멍홈즈": {
    "bggId": "",
    "name": "명탐정 멍멍홈즈",
    "desc": "명탐정 멍멍홈즈 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/명탐정 멍멍홈즈_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "모두의 마블": {
    "bggId": "",
    "name": "모두의 마블",
    "desc": "모두의 마블 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/모두의 마블_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "모자익스": {
    "bggId": "",
    "name": "모자익스",
    "desc": "모자익스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/모자익스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "몽키블록": {
    "bggId": "",
    "name": "몽키블록",
    "desc": "몽키블록 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/몽키블록_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "미니빌": {
    "bggId": "",
    "name": "미니빌",
    "desc": "미니빌 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/미니빌_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "반디도": {
    "bggId": "",
    "name": "반디도",
    "desc": "반디도 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/반디도_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "반지의 제왕_ 가운데땅에서의 대결": {
    "bggId": "",
    "name": "반지의 제왕_ 가운데땅에서의 대결",
    "desc": "반지의 제왕_ 가운데땅에서의 대결 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/반지의 제왕_ 가운데땅에서의 대결_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "방방 날아라 돼지": {
    "bggId": "",
    "name": "방방 날아라 돼지",
    "desc": "방방 날아라 돼지 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/방방 날아라 돼지_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "방방곡곡 세계유랑": {
    "bggId": "",
    "name": "방방곡곡 세계유랑",
    "desc": "방방곡곡 세계유랑 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/방방곡곡 세계유랑_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "배드 컴퍼니": {
    "bggId": "",
    "name": "배드 컴퍼니",
    "desc": "배드 컴퍼니 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/배드 컴퍼니_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "뱀파이어 퀸": {
    "bggId": "",
    "name": "뱀파이어 퀸",
    "desc": "뱀파이어 퀸 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/뱀파이어 퀸_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "버거와썹": {
    "bggId": "",
    "name": "버거와썹",
    "desc": "버거와썹 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/버거와썹_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "버건디의 성": {
    "bggId": "",
    "name": "버건디의 성",
    "desc": "버건디의 성 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/버건디의 성_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "버펄로체스 엘보드": {
    "bggId": "",
    "name": "버펄로체스 엘보드",
    "desc": "버펄로체스 엘보드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/버펄로체스 엘보드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "베티보터 보우트 썸 버터": {
    "bggId": "",
    "name": "베티보터 보우트 썸 버터",
    "desc": "베티보터 보우트 썸 버터 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/베티보터 보우트 썸 버터_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "봇 팩토리": {
    "bggId": "",
    "name": "봇 팩토리",
    "desc": "봇 팩토리 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/봇 팩토리_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "부루마블": {
    "bggId": "",
    "name": "부루마블",
    "desc": "부루마블 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/부루마블_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "부메랑호주": {
    "bggId": "",
    "name": "부메랑호주",
    "desc": "부메랑호주 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/부메랑호주_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "북쪽숲을 위하여": {
    "bggId": "",
    "name": "북쪽숲을 위하여",
    "desc": "북쪽숲을 위하여 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/북쪽숲을 위하여_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "붐 버스터즈": {
    "bggId": "",
    "name": "붐 버스터즈",
    "desc": "붐 버스터즈 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/붐 버스터즈_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "블로커스": {
    "bggId": "",
    "name": "블로커스",
    "desc": "블로커스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/블로커스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "블루 샌드 씨사이드": {
    "bggId": "",
    "name": "블루 샌드 씨사이드",
    "desc": "블루 샌드 씨사이드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/블루 샌드 씨사이드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "빨리빨리": {
    "bggId": "",
    "name": "빨리빨리",
    "desc": "빨리빨리 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/빨리빨리_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "사가니": {
    "bggId": "",
    "name": "사가니",
    "desc": "사가니 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/사가니_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "색감과 직감": {
    "bggId": "",
    "name": "색감과 직감",
    "desc": "색감과 직감 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/색감과 직감_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "섀도우레이더스": {
    "bggId": "",
    "name": "섀도우레이더스",
    "desc": "섀도우레이더스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/섀도우레이더스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "서스펙트 게임_ 클로즈드 서클 미스터리": {
    "bggId": "",
    "name": "서스펙트 게임_ 클로즈드 서클 미스터리",
    "desc": "서스펙트 게임_ 클로즈드 서클 미스터리 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/서스펙트 게임_ 클로즈드 서클 미스터리_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "서킷 메이즈": {
    "bggId": "",
    "name": "서킷 메이즈",
    "desc": "서킷 메이즈 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/서킷 메이즈_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "family"
  },
  "셀레스티아 빅박스": {
    "bggId": "",
    "name": "셀레스티아 빅박스",
    "desc": "셀레스티아 빅박스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/셀레스티아 빅박스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "손님이 오기전에": {
    "bggId": "",
    "name": "손님이 오기전에",
    "desc": "손님이 오기전에 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/손님이 오기전에_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "손바닥 던전": {
    "bggId": "",
    "name": "손바닥 던전",
    "desc": "손바닥 던전 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/손바닥 던전_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "쉐이크쉐이크 타워": {
    "bggId": "",
    "name": "쉐이크쉐이크 타워",
    "desc": "쉐이크쉐이크 타워 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/쉐이크쉐이크 타워_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스카우트": {
    "bggId": "",
    "name": "스카우트",
    "desc": "스카우트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스카우트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스쿱스": {
    "bggId": "",
    "name": "스쿱스",
    "desc": "스쿱스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스쿱스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스탁파일": {
    "bggId": "",
    "name": "스탁파일",
    "desc": "스탁파일 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스탁파일_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "스트라테고": {
    "bggId": "",
    "name": "스트라테고",
    "desc": "스트라테고 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스트라테고_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "스티키 카멜레온": {
    "bggId": "",
    "name": "스티키 카멜레온",
    "desc": "스티키 카멜레온 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스티키 카멜레온_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "스파이시": {
    "bggId": "",
    "name": "스파이시",
    "desc": "스파이시 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/스파이시_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "슬레이 더 스파이어": {
    "bggId": "",
    "name": "슬레이 더 스파이어",
    "desc": "슬레이 더 스파이어 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/슬레이 더 스파이어_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "시바견하우스": {
    "bggId": "",
    "name": "시바견하우스",
    "desc": "시바견하우스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/시바견하우스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "시티 체이스_ 경찰 vs 도둑": {
    "bggId": "",
    "name": "시티 체이스_ 경찰 vs 도둑",
    "desc": "시티 체이스_ 경찰 vs 도둑 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/시티 체이스_ 경찰 vs 도둑_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "실리카우": {
    "bggId": "",
    "name": "실리카우",
    "desc": "실리카우 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/실리카우_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "아그리콜라 확장_ 동네 라이벌 덱": {
    "bggId": "",
    "name": "아그리콜라 확장_ 동네 라이벌 덱",
    "desc": "아그리콜라 확장_ 동네 라이벌 덱 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/아그리콜라 확장_ 동네 라이벌 덱_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "아니오리다": {
    "bggId": "",
    "name": "아니오리다",
    "desc": "아니오리다 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/아니오리다_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "아크노바": {
    "bggId": "",
    "name": "아크노바",
    "desc": "아크노바 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/아크노바_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "아티초크": {
    "bggId": "",
    "name": "아티초크",
    "desc": "아티초크 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/아티초크_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "알았다오": {
    "bggId": "",
    "name": "알았다오",
    "desc": "알았다오 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/알았다오_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "야단법석 달리기": {
    "bggId": "",
    "name": "야단법석 달리기",
    "desc": "야단법석 달리기 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/야단법석 달리기_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "어콰이어": {
    "bggId": "",
    "name": "어콰이어",
    "desc": "어콰이어 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/어콰이어_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "family"
  },
  "업앤다운": {
    "bggId": "",
    "name": "업앤다운",
    "desc": "업앤다운 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/업앤다운_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오 미우바우": {
    "bggId": "",
    "name": "오 미우바우",
    "desc": "오 미우바우 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오 미우바우_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오리지널마피아": {
    "bggId": "",
    "name": "오리지널마피아",
    "desc": "오리지널마피아 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오리지널마피아_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "오션스": {
    "bggId": "",
    "name": "오션스",
    "desc": "오션스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오션스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "오잉크 가짜예술가 뉴욕에 가다": {
    "bggId": "",
    "name": "오잉크 가짜예술가 뉴욕에 가다",
    "desc": "오잉크 가짜예술가 뉴욕에 가다 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 가짜예술가 뉴욕에 가다_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "오잉크 나인타일패닉": {
    "bggId": "",
    "name": "오잉크 나인타일패닉",
    "desc": "오잉크 나인타일패닉 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 나인타일패닉_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 덤불속": {
    "bggId": "",
    "name": "오잉크 덤불속",
    "desc": "오잉크 덤불속 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 덤불속_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 도코종": {
    "bggId": "",
    "name": "오잉크 도코종",
    "desc": "오잉크 도코종 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 도코종_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 두리안": {
    "bggId": "",
    "name": "오잉크 두리안",
    "desc": "오잉크 두리안 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 두리안_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 마스크맨": {
    "bggId": "",
    "name": "오잉크 마스크맨",
    "desc": "오잉크 마스크맨 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 마스크맨_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "오잉크 범고래 고래": {
    "bggId": "",
    "name": "오잉크 범고래 고래",
    "desc": "오잉크 범고래 고래 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 범고래 고래_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 스카우트": {
    "bggId": "",
    "name": "오잉크 스카우트",
    "desc": "오잉크 스카우트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 스카우트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 인사이더 블랙": {
    "bggId": "",
    "name": "오잉크 인사이더 블랙",
    "desc": "오잉크 인사이더 블랙 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 인사이더 블랙_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 주문이 너무 많아 카페": {
    "bggId": "",
    "name": "오잉크 주문이 너무 많아 카페",
    "desc": "오잉크 주문이 너무 많아 카페 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 주문이 너무 많아 카페_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "오잉크 해저탐험 DEEP SEA": {
    "bggId": "",
    "name": "오잉크 해저탐험 DEEP SEA",
    "desc": "오잉크 해저탐험 DEEP SEA 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/오잉크 해저탐험 DEEP SEA_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "요기": {
    "bggId": "",
    "name": "요기",
    "desc": "요기 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/요기_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "용의 동굴": {
    "bggId": "",
    "name": "용의 동굴",
    "desc": "용의 동굴 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/용의 동굴_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "우리 중에 범인이_!": {
    "bggId": "",
    "name": "우리 중에 범인이_!",
    "desc": "우리 중에 범인이_! 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/우리 중에 범인이_!_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "우리집 돼지저금통을 훔쳤다": {
    "bggId": "",
    "name": "우리집 돼지저금통을 훔쳤다",
    "desc": "우리집 돼지저금통을 훔쳤다 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/우리집 돼지저금통을 훔쳤다_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "울프 스트리트": {
    "bggId": "",
    "name": "울프 스트리트",
    "desc": "울프 스트리트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/울프 스트리트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "월드 오브 워크래프트_ 리치왕의 분노": {
    "bggId": "",
    "name": "월드 오브 워크래프트_ 리치왕의 분노",
    "desc": "월드 오브 워크래프트_ 리치왕의 분노 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/월드 오브 워크래프트_ 리치왕의 분노_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "월링 위치크래프트": {
    "bggId": "",
    "name": "월링 위치크래프트",
    "desc": "월링 위치크래프트 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/월링 위치크래프트_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "윌유메리미": {
    "bggId": "",
    "name": "윌유메리미",
    "desc": "윌유메리미 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/윌유메리미_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "윙스팬": {
    "bggId": "",
    "name": "윙스팬",
    "desc": "윙스팬 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/윙스팬_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "육식동물짓이야": {
    "bggId": "",
    "name": "육식동물짓이야",
    "desc": "육식동물짓이야 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/육식동물짓이야_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "자니펭귄": {
    "bggId": "",
    "name": "자니펭귄",
    "desc": "자니펭귄 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/자니펭귄_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "자메이카 본판": {
    "bggId": "",
    "name": "자메이카 본판",
    "desc": "자메이카 본판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/자메이카 본판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "재치와눈치": {
    "bggId": "",
    "name": "재치와눈치",
    "desc": "재치와눈치 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/재치와눈치_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "좀비 파에야": {
    "bggId": "",
    "name": "좀비 파에야",
    "desc": "좀비 파에야 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/좀비 파에야_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "좀비키튼": {
    "bggId": "",
    "name": "좀비키튼",
    "desc": "좀비키튼 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/좀비키튼_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "주플": {
    "bggId": "",
    "name": "주플",
    "desc": "주플 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/주플_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "차가운 그녀가 눈을 뜨기 전에 _ 차그녀": {
    "bggId": "",
    "name": "차가운 그녀가 눈을 뜨기 전에 _ 차그녀",
    "desc": "차가운 그녀가 눈을 뜨기 전에 _ 차그녀 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/차가운 그녀가 눈을 뜨기 전에 _ 차그녀_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "찹찹다이스": {
    "bggId": "",
    "name": "찹찹다이스",
    "desc": "찹찹다이스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/찹찹다이스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "첸토": {
    "bggId": "",
    "name": "첸토",
    "desc": "첸토 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/첸토_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "치킨치킨": {
    "bggId": "",
    "name": "치킨치킨",
    "desc": "치킨치킨 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/치킨치킨_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "카멜레온 라이어게임": {
    "bggId": "",
    "name": "카멜레온 라이어게임",
    "desc": "카멜레온 라이어게임 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/카멜레온 라이어게임_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "카멜업 판": {
    "bggId": "",
    "name": "카멜업 판",
    "desc": "카멜업 판 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/카멜업 판_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "카타미노": {
    "bggId": "",
    "name": "카타미노",
    "desc": "카타미노 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/카타미노_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "카훗": {
    "bggId": "",
    "name": "카훗",
    "desc": "카훗 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/카훗_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "캐스캐디아": {
    "bggId": "",
    "name": "캐스캐디아",
    "desc": "캐스캐디아 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/캐스캐디아_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "캔디매치": {
    "bggId": "",
    "name": "캔디매치",
    "desc": "캔디매치 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/캔디매치_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "커피 러시 겨울": {
    "bggId": "",
    "name": "커피 러시 겨울",
    "desc": "커피 러시 겨울 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/커피 러시 겨울_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "커피 러시": {
    "bggId": "",
    "name": "커피 러시",
    "desc": "커피 러시 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/커피 러시_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "코끼리 균형잡기": {
    "bggId": "",
    "name": "코끼리 균형잡기",
    "desc": "코끼리 균형잡기 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/코끼리 균형잡기_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "코덱스": {
    "bggId": "",
    "name": "코덱스",
    "desc": "코덱스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/코덱스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "쿵쿵쿵 코끼리 해적단": {
    "bggId": "",
    "name": "쿵쿵쿵 코끼리 해적단",
    "desc": "쿵쿵쿵 코끼리 해적단 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/쿵쿵쿵 코끼리 해적단_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "큐윅스": {
    "bggId": "",
    "name": "큐윅스",
    "desc": "큐윅스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/큐윅스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "크라클오라클": {
    "bggId": "",
    "name": "크라클오라클",
    "desc": "크라클오라클 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/크라클오라클_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "크로키놀": {
    "bggId": "",
    "name": "크로키놀",
    "desc": "크로키놀 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/크로키놀_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "타임즈업 파티": {
    "bggId": "",
    "name": "타임즈업 파티",
    "desc": "타임즈업 파티 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/타임즈업 파티_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "타코 피카츄 파이리 꼬부기 이상해씨": {
    "bggId": "",
    "name": "타코 피카츄 파이리 꼬부기 이상해씨",
    "desc": "타코 피카츄 파이리 꼬부기 이상해씨 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/타코 피카츄 파이리 꼬부기 이상해씨_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "타코백": {
    "bggId": "",
    "name": "타코백",
    "desc": "타코백 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/타코백_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "탑텐TV": {
    "bggId": "",
    "name": "탑텐TV",
    "desc": "탑텐TV 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/탑텐TV_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "테라포밍 마스 확장_ 헬라스 엘리시움": {
    "bggId": "",
    "name": "테라포밍 마스 확장_ 헬라스 엘리시움",
    "desc": "테라포밍 마스 확장_ 헬라스 엘리시움 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/테라포밍 마스 확장_ 헬라스 엘리시움_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "테라포밍마스": {
    "bggId": "",
    "name": "테라포밍마스",
    "desc": "테라포밍마스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/테라포밍마스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "heavy",
    "genre": "strategy"
  },
  "텐텐텐": {
    "bggId": "",
    "name": "텐텐텐",
    "desc": "텐텐텐 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/텐텐텐_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "텔레스트레이션": {
    "bggId": "",
    "name": "텔레스트레이션",
    "desc": "텔레스트레이션 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/텔레스트레이션_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "투칸": {
    "bggId": "",
    "name": "투칸",
    "desc": "투칸 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/투칸_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "티츄": {
    "bggId": "",
    "name": "티츄",
    "desc": "티츄 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/티츄_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "티켓 투 라이드": {
    "bggId": "",
    "name": "티켓 투 라이드",
    "desc": "티켓 투 라이드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/티켓 투 라이드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "패럿다임": {
    "bggId": "",
    "name": "패럿다임",
    "desc": "패럿다임 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/패럿다임_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "패치워크": {
    "bggId": "",
    "name": "패치워크",
    "desc": "패치워크 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/패치워크_seo.webp",
    "players": "2-4",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "팬데믹 레거시 시즌0": {
    "bggId": "",
    "name": "팬데믹 레거시 시즌0",
    "desc": "팬데믹 레거시 시즌0 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/팬데믹 레거시 시즌0_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "팬데믹": {
    "bggId": "",
    "name": "팬데믹",
    "desc": "팬데믹 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/팬데믹_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "팬텀잉크": {
    "bggId": "",
    "name": "팬텀잉크",
    "desc": "팬텀잉크 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/팬텀잉크_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "펜스테르담": {
    "bggId": "",
    "name": "펜스테르담",
    "desc": "펜스테르담 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/펜스테르담_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "펠리시티 자루 속 고양이": {
    "bggId": "",
    "name": "펠리시티 자루 속 고양이",
    "desc": "펠리시티 자루 속 고양이 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/펠리시티 자루 속 고양이_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "펭귄팡팡": {
    "bggId": "",
    "name": "펭귄팡팡",
    "desc": "펭귄팡팡 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/펭귄팡팡_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "포인트샐러드": {
    "bggId": "",
    "name": "포인트샐러드",
    "desc": "포인트샐러드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/포인트샐러드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "포켓디텍티브 1탄": {
    "bggId": "",
    "name": "포켓디텍티브 1탄",
    "desc": "포켓디텍티브 1탄 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/포켓디텍티브 1탄_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "포켓디텍티브 2탄": {
    "bggId": "",
    "name": "포켓디텍티브 2탄",
    "desc": "포켓디텍티브 2탄 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/포켓디텍티브 2탄_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "포켓디텍티브 3탄": {
    "bggId": "",
    "name": "포켓디텍티브 3탄",
    "desc": "포켓디텍티브 3탄 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/포켓디텍티브 3탄_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "party"
  },
  "포켓팜": {
    "bggId": "",
    "name": "포켓팜",
    "desc": "포켓팜 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/포켓팜_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "푸시피시": {
    "bggId": "",
    "name": "푸시피시",
    "desc": "푸시피시 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/푸시피시_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "푸에르토리코 1897": {
    "bggId": "",
    "name": "푸에르토리코 1897",
    "desc": "푸에르토리코 1897 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/푸에르토리코 1897_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "푸에블로": {
    "bggId": "",
    "name": "푸에블로",
    "desc": "푸에블로 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/푸에블로_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "푼토 점에 살고 점에 웃는 점을 위한 게임": {
    "bggId": "",
    "name": "푼토 점에 살고 점에 웃는 점을 위한 게임",
    "desc": "푼토 점에 살고 점에 웃는 점을 위한 게임 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/푼토 점에 살고 점에 웃는 점을 위한 게임_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "풍기": {
    "bggId": "",
    "name": "풍기",
    "desc": "풍기 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/풍기_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "프린세스의 반란 디럭스": {
    "bggId": "",
    "name": "프린세스의 반란 디럭스",
    "desc": "프린세스의 반란 디럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/프린세스의 반란 디럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "피드더크라켄 디럭스": {
    "bggId": "",
    "name": "피드더크라켄 디럭스",
    "desc": "피드더크라켄 디럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/피드더크라켄 디럭스 _seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "피에스타": {
    "bggId": "",
    "name": "피에스타",
    "desc": "피에스타 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/피에스타_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "하모니즈": {
    "bggId": "",
    "name": "하모니즈",
    "desc": "하모니즈 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/하모니즈_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "한밤의 뱀파이어": {
    "bggId": "",
    "name": "한밤의 뱀파이어",
    "desc": "한밤의 뱀파이어 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/한밤의 뱀파이어_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "한밤의수수께끼": {
    "bggId": "",
    "name": "한밤의수수께끼",
    "desc": "한밤의수수께끼 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/한밤의수수께끼_seo.webp",
    "players": "5-10",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "핫스트릭": {
    "bggId": "",
    "name": "핫스트릭",
    "desc": "핫스트릭 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/핫스트릭_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "행성 X를 찾아서": {
    "bggId": "",
    "name": "행성 X를 찾아서",
    "desc": "행성 X를 찾아서 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/행성 X를 찾아서_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "허니버즈 디럭스": {
    "bggId": "",
    "name": "허니버즈 디럭스",
    "desc": "허니버즈 디럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/허니버즈 디럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "헥서스 디럭스": {
    "bggId": "",
    "name": "헥서스 디럭스",
    "desc": "헥서스 디럭스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/헥서스 디럭스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "family"
  },
  "헥스피드": {
    "bggId": "",
    "name": "헥스피드",
    "desc": "헥스피드 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/헥스피드_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "후지플러시": {
    "bggId": "",
    "name": "후지플러시",
    "desc": "후지플러시 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/후지플러시_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
  },
  "히든리더스": {
    "bggId": "",
    "name": "히든리더스",
    "desc": "히든리더스 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/히든리더스_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "medium",
    "genre": "strategy"
  },
  "힛스터 K-POP": {
    "bggId": "",
    "name": "힛스터 K-POP",
    "desc": "힛스터 K-POP 보드게임입니다. 함께 모여 즐겨보세요!",
    "img": "images/힛스터 K-POP_seo.webp",
    "players": "2-5",
    "color": "#0984e3",
    "difficulty": "easy",
    "genre": "casual"
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

function playClickSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch (e) {}
}

function playPopSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.2);
  } catch (e) {}
}

function playWinSound() {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gainNode.gain.setValueAtTime(0.25, now + i * 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.35);
    });
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
const themeToggleBtn = document.getElementById('themeToggleBtn');
const helpToggleBtn = document.getElementById('helpToggleBtn');
const helpModal = document.getElementById('helpModal');
const closeHelpModalBtn = document.getElementById('closeHelpModalBtn');
const confirmHelpBtn = document.getElementById('confirmHelpBtn');
const helpTabButtons = document.querySelectorAll('.help-tab-btn');
const helpPanels = document.querySelectorAll('.help-panel');

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const feedFilterControls = document.getElementById('feedFilterControls');

// --- Play Tools DOM References ---
const toolsPanel = document.getElementById('toolsPanel');
const subTabRoulette = document.getElementById('subTabRoulette');
const subTabDice = document.getElementById('subTabDice');
const subTabLadder = document.getElementById('subTabLadder');
const subTabRecommend = document.getElementById('subTabRecommend');
const subTabTimer = document.getElementById('subTabTimer');
const subTabScoreboard = document.getElementById('subTabScoreboard');

const toolSectionRoulette = document.getElementById('toolSectionRoulette');
const toolSectionDice = document.getElementById('toolSectionDice');
const toolSectionLadder = document.getElementById('toolSectionLadder');
const toolSectionRecommend = document.getElementById('toolSectionRecommend');
const toolSectionTimer = document.getElementById('toolSectionTimer');
const toolSectionScoreboard = document.getElementById('toolSectionScoreboard');

const roulettePlayers = document.getElementById('roulettePlayers');
const rouletteWheel = document.getElementById('rouletteWheel');
const spinRouletteBtn = document.getElementById('spinRouletteBtn');
const rouletteResult = document.getElementById('rouletteResult');

const diceObject = document.getElementById('diceObject');
const rollDiceBtn = document.getElementById('rollDiceBtn');
const diceResultText = document.getElementById('diceResultText');

const ladderNum = document.getElementById('ladderNum');
const ladderPreset = document.getElementById('ladderPreset');
const ladderInputsArea = document.getElementById('ladderInputsArea');
const ladderCanvas = document.getElementById('ladderCanvas');
const ladderResultText = document.getElementById('ladderResultText');
const resetLadderBtn = document.getElementById('resetLadderBtn');
const generateLadderBtn = document.getElementById('generateLadderBtn');
const viewLadderResultBtn = document.getElementById('viewLadderResultBtn');

// New Tools DOM References (populated in initPlayTools after DOMContentLoaded)
let recommendPlayers = null;
let recommendTime = null;
let recommendDiff = null;
let btnGetRecommend = null;
let recommendResultCard = null;
let recommendGameImg = null;
let recommendGameTitle = null;
let recommendGameDesc = null;

let timerProgressRing = null;
let timerDisplay = null;
let btnResetTimer = null;
let btnStartPauseTimer = null;
let timerPlayIcon = null;

let btnScoreAddPlayer = null;
let btnScoreAddRound = null;
let scoreTableBody = null;
let btnScoreReset = null;
let btnScoreSaveLog = null;

const achievementsGrid = document.getElementById('achievementsGrid');

const cardDrawOverlay = document.getElementById('cardDrawOverlay');
const flipCard = document.getElementById('flipCard');
const cardFrontView = document.getElementById('cardFrontView');
const closeCardBtn = document.getElementById('closeCardBtn');
const captureBtn = document.getElementById('captureBtn');

const diffFilterEl = document.getElementById('diffFilter');
const playerFilterEl = document.getElementById('playerFilter');
const genreFilterEl = document.getElementById('genreFilter');
const rankGrid = document.getElementById('rankGrid');

let activeDiffFilter = 'all';
let activePlayerFilter = 'all';
let activeGenreFilter = 'all';

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderColorPicker();
  setupStarRating();
  setupEventListeners();
  
  const appContainer = document.querySelector('.app-container');
  if (appContainer) {
    appContainer.classList.add('tab-home');
  }

  const splashScreen = document.getElementById('splashScreen');
  if (splashScreen) {
    const dismissSplash = () => {
      splashScreen.classList.add('fade-out');
      if (soundEnabled) {
         try { playClickSound(); } catch(err) {}
      }
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 600);
    };
    splashScreen.addEventListener('click', dismissSplash);
  }

  initPlayTools();
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

  const savedBingo = localStorage.getItem('dadok_dadok_board_bingo_slots');
  if (savedBingo) {
    try {
      bingoSlots = JSON.parse(savedBingo);
    } catch (e) {
      bingoSlots = [...defaultBingoGames];
    }
  } else {
    bingoSlots = [...defaultBingoGames];
  }

  const savedRewardClaimed = localStorage.getItem('dadok_dadok_board_bingo_reward');
  if (savedRewardClaimed !== null) {
    isBingoRewardClaimed = savedRewardClaimed === 'true';
  }

  const savedTheme = localStorage.getItem('board_village_theme');
  if (savedTheme !== null) {
    currentTheme = savedTheme;
  }
  applyTheme(currentTheme);
}

function saveData() {
  localStorage.setItem('dadok_dadok_board_logs', JSON.stringify(logs));
  localStorage.setItem('dadok_dadok_board_decos', JSON.stringify(decos));
  localStorage.setItem('dadok_dadok_board_sound', soundEnabled.toString());
  localStorage.setItem('dadok_dadok_board_bingo_slots', JSON.stringify(bingoSlots));
  localStorage.setItem('dadok_dadok_board_bingo_reward', isBingoRewardClaimed.toString());
  localStorage.setItem('board_village_theme', currentTheme);
}

function applyTheme(theme) {
  document.body.className = '';
  if (theme === 'wood') {
    document.body.classList.add('theme-wood');
  } else {
    document.body.classList.add('theme-midnight');
  }
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
  renderRankingTab();
  renderAchievements();
  renderCharacters();
  updateSoundButtonUI();
  if (typeof renderBingoBoard === 'function') {
    renderBingoBoard();
  }
  
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

    const thumbSrc = log.gameThumbnail || getEncyclopediaImage(log.gameTitle);
    const thumbHtml = thumbSrc ? `<img src="${thumbSrc}" style="width: 24px; height: 24px; border-radius: 4px; object-fit: cover; margin-right: 8px;">` : '🎲 ';

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

    // 모바일 터치 드래그 및 더블 탭 삭제 지원
    meeple.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = stackContainer.getBoundingClientRect();
      
      const now = Date.now();
      const lastTap = meeple.dataset.lastTap || 0;
      if (now - lastTap < 300) {
        decos = decos.filter(d => d.id !== deco.id);
        render();
        return;
      }
      meeple.dataset.lastTap = now;

      const moveHandler = (moveEvent) => {
        const curTouch = moveEvent.touches[0];
        let leftPercent = ((curTouch.clientX - rect.left) / rect.width) * 100;
        let topPercent = ((curTouch.clientY - rect.top) / rect.height) * 100;
        
        leftPercent = Math.max(0, Math.min(90, leftPercent));
        topPercent = Math.max(0, Math.min(90, topPercent));

        meeple.style.left = `${leftPercent}%`;
        meeple.style.top = `${topPercent}%`;
        
        deco.x = leftPercent;
        deco.y = topPercent;
      };

      const endHandler = () => {
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', endHandler);
        saveData();
      };

      document.addEventListener('touchmove', moveHandler, { passive: false });
      document.addEventListener('touchend', endHandler);
    }, { passive: false });

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

    const ctSrc = log.gameThumbnail || getEncyclopediaImage(log.gameTitle);
    const cardThumb = ctSrc ? `<img src="${ctSrc}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;">` : '';

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
  const allDbKeys = Object.keys(ENCYCLOPEDIA_DB);
  const totalDbGamesCount = allDbKeys.length;
  let unlockedDbGamesCount = 0;

  allDbKeys.forEach(key => {
    const info = ENCYCLOPEDIA_DB[key];
    const matchLog = logs.find(log => {
      const lowerInput = log.gameTitle.toLowerCase();
      const lowerKey = key.toLowerCase();
      const lowerName = info.name.toLowerCase();
      return lowerInput.includes(lowerKey) || lowerKey.includes(lowerInput) || lowerInput.includes(lowerName) || lowerName.includes(lowerInput);
    });
    if (matchLog) unlockedDbGamesCount++;
  });

  const progressPercent = totalDbGamesCount > 0 ? Math.round((unlockedDbGamesCount / totalDbGamesCount) * 100) : 0;
  const progTextEl = document.getElementById('encyclopediaProgressText');
  const progBarEl = document.getElementById('encyclopediaProgressBar');
  if (progTextEl && progBarEl) {
    progTextEl.innerText = `${unlockedDbGamesCount} / ${totalDbGamesCount}개 플레이 (${progressPercent}%)`;
    progBarEl.style.width = `${progressPercent}%`;
  }

  gameInfoGrid.innerHTML = '';

  let filtered = Object.entries(ENCYCLOPEDIA_DB).filter(([key, info]) => {
    if (activeDiffFilter !== 'all' && info.difficulty !== activeDiffFilter) return false;
    if (activeGenreFilter !== 'all' && info.genre !== activeGenreFilter) return false;
    if (activePlayerFilter !== 'all') {
      const parts = info.players.split('-');
      const minP = parseInt(parts[0]);
      const maxP = parseInt(parts[1] || parts[0]);
      if (activePlayerFilter === 'solo' && minP !== 1) return false;
      if (activePlayerFilter === '2p' && !(minP <= 2 && maxP <= 2)) return false;
      if (activePlayerFilter === '3-4' && !(maxP >= 3 && maxP <= 4)) return false;
      if (activePlayerFilter === '5+' && maxP < 5) return false;
    }
    return true;
  });

  filtered.forEach(([key, info]) => {
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
      const stats = calculateGameWinRate(key);
      const winRateBadge = stats.total > 0 ? `<div class="winrate-badge-pill ${stats.rate >= 60 ? 'win-high' : ''}">🏆 ${stats.rate}%</div>` : '';
      const recordText = `${stats.total}전 ${stats.wins}승 ${stats.draws}무 ${stats.losses}패`;

      card.innerHTML = `
        <div class="info-card-header">
          ${winRateBadge}
          <img src="${info.img}" class="info-card-blur-bg" alt="blur">
          <img src="${info.img}" class="info-card-img" alt="${info.name}">
        </div>
        <div class="info-card-body">
          <h3 class="info-card-title">${info.name}</h3>
          <div class="info-card-stat-row">
            <span>🎮 <strong>${recordText}</strong></span>
            <span>⚖️ 난이도 <strong>${diffLabel}</strong></span>
          </div>
          <p class="info-card-desc">${info.desc}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        openCardFlipView({ ...matchLog, gameThumbnail: matchLog.gameThumbnail || info.img });
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
          <p class="info-card-desc" style="color:transparent; text-shadow:0 0 8px rgba(0,0,0,0.5);">비공개 설명 블러 처리</p>
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

// 랭킹/통계 탭 렌더링
// Global Helper to resolve game images
const getGameImage = (title) => {
  const dbImg = getEncyclopediaImage(title);
  if (dbImg) return dbImg;
  const matchingLog = logs.find(l => l.gameTitle === title && l.gameThumbnail);
  return matchingLog ? matchingLog.gameThumbnail : 'images/루미큐브_seo.webp';
};

function renderRankingTab() {
  rankGrid.innerHTML = '';

  if (logs.length === 0) {
    rankGrid.innerHTML = '<div class="rank-empty"><i data-lucide="bar-chart-3"></i><p>기록을 남기면 랭킹이 표시됩니다.</p></div>';
    return;
  }

  // --- 게임 플레이 순위 ---
  const gameCountMap = {};
  const gameRatingMap = {};
  const gameDiffMap = {};
  logs.forEach(log => {
    const title = log.gameTitle;
    gameCountMap[title] = (gameCountMap[title] || 0) + 1;
    if (!gameRatingMap[title]) gameRatingMap[title] = [];
    gameRatingMap[title].push(log.rating || 0);
    gameDiffMap[title] = log.boxThickness || 'easy';
  });

  const topPlayed = Object.entries(gameCountMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topRated = Object.entries(gameRatingMap)
    .map(([title, ratings]) => [title, ratings.reduce((a, b) => a + b, 0) / ratings.length])
    .sort((a, b) => b[1] - a[1]).slice(0, 5);

  const maxCount = topPlayed.length > 0 ? topPlayed[0][1] : 1;

  // --- 동반자 랭킹 ---
  const companionMap = {};
  logs.forEach(log => {
    if (log.companions) {
      log.companions.split(',').map(s => s.trim()).filter(s => s).forEach(name => {
        companionMap[name] = (companionMap[name] || 0) + 1;
      });
    }
  });
  const topCompanions = Object.entries(companionMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxComp = topCompanions.length > 0 ? topCompanions[0][1] : 1;

  // --- 난이도 분포 ---
  const diffCount = { easy: 0, medium: 0, heavy: 0 };
  logs.forEach(log => {
    const d = log.boxThickness || 'easy';
    if (diffCount[d] !== undefined) diffCount[d]++;
  });
  const totalLogs = logs.length;
  const maxDiff = Math.max(diffCount.easy, diffCount.medium, diffCount.heavy, 1);

  // --- 승률 통계 ---
  const wins = logs.filter(l => l.result === 'win').length;
  const losses = logs.filter(l => l.result === 'lose').length;
  const draws = logs.filter(l => l.result === 'draw').length;
  const winRate = totalLogs > 0 ? Math.round((wins / totalLogs) * 100) : 0;

  // --- 월별 플레이 ---
  const monthMap = {};
  logs.forEach(log => {
    const month = log.playDate.substring(0, 7);
    monthMap[month] = (monthMap[month] || 0) + 1;
  });
  const monthEntries = Object.entries(monthMap).sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
  const maxMonth = monthEntries.length > 0 ? Math.max(...monthEntries.map(e => e[1])) : 1;

  rankGrid.innerHTML = `
    <div class="rank-section">
      <h3 class="rank-section-title"><i data-lucide="trophy"></i> 게임 플레이 순위</h3>
      <div class="rank-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${topPlayed.map(([title, count], i) => {
          const imgUrl = getGameImage(title);
          return `
            <div class="rank-row" style="display: flex; align-items: center; gap: 10px;">
              <span class="rank-badge rank-${i + 1}">${i + 1}</span>
              <img src="${imgUrl}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1.5px solid var(--border-color);" alt="${title}">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                <span class="rank-name" style="font-weight: 700; font-size: 0.9rem;">${title}</span>
                <div class="rank-bar-wrap" style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; width: 100%;">
                  <div class="rank-bar" style="width:${(count / maxCount) * 100}%; height: 100%; background: linear-gradient(90deg, var(--primary-light), var(--primary-color)); border-radius: 4px; transition: width 0.6s ease;"></div>
                </div>
              </div>
              <span class="rank-value" style="font-weight: 800; font-size: 0.9rem; min-width: 42px; text-align: right;">${count}회</span>
            </div>
          `;
        }).join('') || '<div class="rank-row rank-empty-row">기록이 없습니다</div>'}
      </div>
    </div>

    <div class="rank-section">
      <h3 class="rank-section-title"><i data-lucide="star"></i> 평점 순위</h3>
      <div class="rank-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${topRated.map(([title, avg], i) => {
          const imgUrl = getGameImage(title);
          return `
            <div class="rank-row" style="display: flex; align-items: center; gap: 10px;">
              <span class="rank-badge rank-${i + 1}">${i + 1}</span>
              <img src="${imgUrl}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1.5px solid var(--border-color);" alt="${title}">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                <span class="rank-name" style="font-weight: 700; font-size: 0.9rem;">${title}</span>
                <div class="rank-bar-wrap" style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; width: 100%;">
                  <div class="rank-bar" style="width:${(avg / 5) * 100}%; height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); border-radius: 4px; transition: width 0.6s ease;"></div>
                </div>
              </div>
              <span class="rank-value" style="font-weight: 800; font-size: 0.9rem; min-width: 42px; text-align: right; color: #d97706;">★ ${avg.toFixed(1)}</span>
            </div>
          `;
        }).join('') || '<div class="rank-row rank-empty-row">기록이 없습니다</div>'}
      </div>
    </div>

    <div class="rank-section">
      <h3 class="rank-section-title"><i data-lucide="users"></i> 동반자 랭킹</h3>
      <div class="rank-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${topCompanions.map(([name, count], i) => `
          <div class="rank-row" style="display: flex; align-items: center; gap: 10px;">
            <span class="rank-badge rank-${i + 1}">${i + 1}</span>
            <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--border-color); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; border: 1px solid var(--border-color); color: var(--text-main);">👤</div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <span class="rank-name" style="font-weight: 700; font-size: 0.9rem;">${name}</span>
              <div class="rank-bar-wrap" style="height: 8px; background: rgba(0,0,0,0.05); border-radius: 4px; overflow: hidden; width: 100%;">
                <div class="rank-bar" style="width:${(count / maxComp) * 100}%; height: 100%; background: linear-gradient(90deg, #10b981, #059669); border-radius: 4px; transition: width 0.6s ease;"></div>
              </div>
            </div>
            <span class="rank-value" style="font-weight: 800; font-size: 0.9rem; min-width: 42px; text-align: right;">${count}회</span>
          </div>
        `).join('') || '<div class="rank-row rank-empty-row">등록된 동반자가 없습니다</div>'}
      </div>
    </div>

    <div class="rank-section">
      <h3 class="rank-section-title"><i data-lucide="pie-chart"></i> 난이도 분포</h3>
      <div class="diff-dist">
        <div class="diff-row">
          <span class="diff-label">가벼움</span>
          <div class="rank-bar-wrap"><div class="rank-bar rank-bar-easy" style="width:${(diffCount.easy / maxDiff) * 100}%"></div></div>
          <span class="diff-count">${diffCount.easy}회</span>
        </div>
        <div class="diff-row">
          <span class="diff-label">보통</span>
          <div class="rank-bar-wrap"><div class="rank-bar rank-bar-medium" style="width:${(diffCount.medium / maxDiff) * 100}%"></div></div>
          <span class="diff-count">${diffCount.medium}회</span>
        </div>
        <div class="diff-row">
          <span class="diff-label">묵직함</span>
          <div class="rank-bar-wrap"><div class="rank-bar rank-bar-heavy" style="width:${(diffCount.heavy / maxDiff) * 100}%"></div></div>
          <span class="diff-count">${diffCount.heavy}회</span>
        </div>
      </div>
    </div>

    <div class="rank-section">
      <h3 class="rank-section-title"><i data-lucide="activity"></i> 승률 &amp; 통계</h3>
      <div class="winrate-big">
        <div class="winrate-ring">${winRate}%</div>
        <div class="winrate-labels">
          <span>승리 <strong>${wins}회</strong></span>
          <span>패배 <strong>${losses}회</strong></span>
          <span>무승부 <strong>${draws}회</strong></span>
        </div>
      </div>
    </div>

    <div class="rank-section rank-section-wide">
      <h3 class="rank-section-title"><i data-lucide="calendar"></i> 월별 플레이</h3>
      <div class="month-chart">
        ${monthEntries.map(([month, count]) => `
          <div class="month-col">
            <span class="month-bar" style="height:${(count / maxMonth) * 100}%"></span>
            <span class="month-label">${month.replace('-', '.')}</span>
            <span class="month-count">${count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 도감 DB에서 게임 이미지 찾기
function getEncyclopediaImage(gameTitle) {
  const entry = Object.entries(ENCYCLOPEDIA_DB).find(([key, info]) => {
    const t = gameTitle.toLowerCase();
    const k = key.toLowerCase();
    const n = info.name.toLowerCase();
    return t.includes(k) || k.includes(t) || t.includes(n) || n.includes(t);
  });
  return entry ? entry[1].img : null;
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

  const thumbUrl = log.gameThumbnail || getEncyclopediaImage(log.gameTitle) || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=150&q=80';

  const stats = calculateGameWinRate(log.gameTitle);
  let statsRowHtml = '';
  if (stats.total > 0) {
    statsRowHtml = `<div class="card-front-winrate-row" style="font-size: 0.78rem; font-weight: 600; color: var(--primary-color); background: rgba(108, 92, 231, 0.05); padding: 4px 8px; border-radius: 6px; margin-bottom: 2px;">
      🏆 게임 전적: ${stats.wins}승 ${stats.losses}패 ${stats.draws}무 (승률 ${stats.rate}%)
    </div>`;
  }

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
      
      ${statsRowHtml}
      
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

// 특정 게임 타이틀 별 승률 및 전적 계산
function calculateGameWinRate(gameTitle) {
  const matchingLogs = logs.filter(log => {
    const lTitle = log.gameTitle.toLowerCase();
    const target = gameTitle.toLowerCase();
    return lTitle.includes(target) || target.includes(lTitle);
  });

  const total = matchingLogs.length;
  if (total === 0) return { total: 0, wins: 0, losses: 0, draws: 0, rate: 0 };

  const wins = matchingLogs.filter(log => log.result === 'win').length;
  const losses = matchingLogs.filter(log => log.result === 'lose').length;
  const draws = matchingLogs.filter(log => log.result === 'draw').length;
  const matchesForRate = total - draws; // 무승부/기타는 승률 분모에서 제외하거나 전체 비율 계산

  const rate = matchesForRate > 0 ? Math.round((wins / matchesForRate) * 100) : 0;
  return { total, wins, losses, draws, rate };
}

// 캐릭터 도감
function renderCharacters() {
  characterList.innerHTML = '';
  
  // 현재 상자 탑의 높이
  let currentHeight = 0;
  logs.forEach(log => {
    currentHeight += calculateThickness(log.boxThickness, log.playTime);
  });

  const unlockedCount = CHARACTERS.filter(char => char.unlockFn(currentHeight, logs.length)).length;
  
  // 왼쪽 사이드바 하단 도감 요약 미플들 렌더링 (해금된 것만 상자 탑 소환용 뱃지로 노출)
  CHARACTERS.forEach((char) => {
    const isUnlocked = char.unlockFn(currentHeight, logs.length);
    if (isUnlocked) {
      const badge = document.createElement('div');
      badge.className = 'character-badge unlocked';
      badge.innerHTML = `
        <div class="character-avatar">${char.emoji}</div>
        <span class="character-name">${char.name}</span>
        <span class="character-cond" style="color: var(--primary-color);">더블클릭 소환</span>
      `;
      
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
      characterList.appendChild(badge);
    }
  });

  if (characterList.children.length === 0) {
    characterList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; font-size: 0.8rem; color: var(--text-muted); padding: 1rem 0;">
        탑을 쌓아올리면 새로운 캐릭터가 이곳에 활성화됩니다! (cm 단위)
      </div>
    `;
  }
}

// 30종 전체 캐릭터 스토리 도감 모달 렌더링
let selectedCharForStory = null;
function renderCharacterBookModal() {
  const grid = document.getElementById('charBookGrid');
  grid.innerHTML = '';

  let currentHeight = 0;
  logs.forEach(log => {
    currentHeight += calculateThickness(log.boxThickness, log.playTime);
  });

  let unlockedCount = 0;

  CHARACTERS.forEach(char => {
    const isUnlocked = char.unlockFn(currentHeight, logs.length);
    if (isUnlocked) unlockedCount++;

    const card = document.createElement('div');
    card.className = `char-book-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    
    card.innerHTML = `
      <div class="card-emoji">${isUnlocked ? char.emoji : '🔒'}</div>
      <span class="card-name">${char.name}</span>
      <span class="card-cond-label">${char.condText}</span>
    `;

    if (isUnlocked) {
      card.addEventListener('click', () => {
        openCharacterStoryDetail(char);
      });
    } else {
      card.addEventListener('click', () => {
        alert(`🔒 이 캐릭터는 아직 잠겨 있습니다.\n해금 조건: ${char.condText}\n(현재 누적 높이: ${currentHeight.toFixed(1)}cm)`);
      });
    }

    grid.appendChild(card);
  });

  document.getElementById('unlockedCharsCount').innerText = unlockedCount;
  document.getElementById('unlockedCharsProgressBar').style.width = `${(unlockedCount / 30) * 100}%`;
}

function openCharacterStoryDetail(char) {
  selectedCharForStory = char;
  document.getElementById('charStoryAvatar').innerText = char.emoji;
  document.getElementById('charStoryName').innerText = char.name;
  document.getElementById('charStoryCond').innerText = char.condText;
  document.getElementById('charStoryDesc').innerText = char.story || "해당 캐릭터의 숨겨진 상세 스토리가 준비 중입니다.";

  document.getElementById('charStoryModal').style.display = 'flex';
}

// Sound Button UI Toggle
function updateSoundButtonUI() {
  if (!soundToggleBtn) return;
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

  let results = [];
  const queryLower = query.toLowerCase();
  Object.keys(ENCYCLOPEDIA_DB).forEach(key => {
    const dbItem = ENCYCLOPEDIA_DB[key];
    if (key.toLowerCase().includes(queryLower) || dbItem.name.toLowerCase().includes(queryLower)) {
      results.push({
        id: 'offline_' + key,
        name: dbItem.name,
        description: dbItem.desc,
        thumbnail: dbItem.img,
        color: dbItem.color
      });
    }
  });

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
    
    const bigImg = xmlDoc.getElementsByTagName("image")[0] ? xmlDoc.getElementsByTagName("image")[0].textContent : '';
    const thumbnail = xmlDoc.getElementsByTagName("thumbnail")[0] ? xmlDoc.getElementsByTagName("thumbnail")[0].textContent : '';
    const finalImg = bigImg || thumbnail || 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=300&q=80';

    let description = xmlDoc.getElementsByTagName("description")[0] ? xmlDoc.getElementsByTagName("description")[0].textContent : '';
    description = description.replace(/&amp;/g, '&').replace(/&quot;/g, '"').substring(0, 150) + "...";
    
    const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];

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
    const liveStars = starRatingContainer.querySelectorAll('.star-icon');
    liveStars.forEach(star => {
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
      link.download = `보드빌리지-탑-${new Date().toISOString().substring(2,10)}.jpg`;
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

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      saveData();
      updateSoundButtonUI();
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        if (panel.id === `${targetTab}Panel`) {
          panel.classList.add('active');
          panel.style.display = 'flex';
        } else {
          panel.classList.remove('active');
          panel.style.display = 'none';
        }
      });

      if (targetTab === 'info' || targetTab === 'rank' || targetTab === 'bingo') {
        feedFilterControls.style.display = 'none';
      } else {
        feedFilterControls.style.display = 'block';
      }

      if (targetTab === 'bingo') {
        renderBingoBoard();
      }
      if (targetTab === 'rank') {
        renderRankingTab();
        renderAchievements();
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

  // --- 캐릭터 도감 관련 이벤트 리스너 추가 ---
  const openCharacterBookBtn = document.getElementById('openCharacterBookBtn');
  const characterBookModal = document.getElementById('characterBookModal');
  const closeCharacterBookModalBtn = document.getElementById('closeCharacterBookModalBtn');

  const charStoryModal = document.getElementById('charStoryModal');
  const closeCharStoryBtn = document.getElementById('closeCharStoryBtn');
  const summonMeepleBtn = document.getElementById('summonMeepleBtn');

  openCharacterBookBtn.addEventListener('click', () => {
    renderCharacterBookModal();
    characterBookModal.style.display = 'flex';
    characterBookModal.classList.add('active');
  });

  closeCharacterBookModalBtn.addEventListener('click', () => {
    characterBookModal.style.display = 'none';
    characterBookModal.classList.remove('active');
  });

  closeCharStoryBtn.addEventListener('click', () => {
    charStoryModal.style.display = 'none';
  });

  summonMeepleBtn.addEventListener('click', () => {
    if (selectedCharForStory) {
      const newDeco = {
        id: Date.now().toString(),
        emoji: selectedCharForStory.emoji,
        x: Math.floor(Math.random() * 80),
        y: Math.floor(Math.random() * 80)
      };
      decos.push(newDeco);
      charStoryModal.style.display = 'none';
      characterBookModal.style.display = 'none';
      characterBookModal.classList.remove('active');
      render();
      alert(`상자 탑에 ${selectedCharForStory.name}(이)가 소환되었습니다!`);
    }
  });

  // 바깥 배경 클릭 시 모달 닫기
  characterBookModal.addEventListener('click', (e) => {
    if (e.target === characterBookModal) {
      characterBookModal.style.display = 'none';
      characterBookModal.classList.remove('active');
    }
  });

  charStoryModal.addEventListener('click', (e) => {
    if (e.target === charStoryModal) {
      charStoryModal.style.display = 'none';
    }
  });

  sortBySelect.addEventListener('change', () => {
    renderLogFeed();
  });

  diffFilterEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    diffFilterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeDiffFilter = btn.dataset.diff;
    renderGameInfoTab();
  });

  playerFilterEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    playerFilterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePlayerFilter = btn.dataset.players;
    renderGameInfoTab();
  });

  genreFilterEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    genreFilterEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeGenreFilter = btn.dataset.genre;
    renderGameInfoTab();
  });

  // Mode toggles removed since Bingo is in main tabs

  const closeBingoSlotModalBtn = document.getElementById('closeBingoSlotModalBtn');
  const saveBingoSlotBtn = document.getElementById('saveBingoSlotBtn');
  const watchAdForSlotBtn = document.getElementById('watchAdForSlotBtn');

  closeBingoSlotModalBtn.addEventListener('click', () => {
    document.getElementById('bingoSlotModal').style.display = 'none';
  });

  saveBingoSlotBtn.addEventListener('click', () => {
    const index = Number(document.getElementById('targetSlotIndex').value);
    const gameName = document.getElementById('bingoGameSelect').value;
    const gameData = ENCYCLOPEDIA_DB[gameName];

    if (gameData) {
      let stars = 2;
      if (gameData.difficulty === 'easy') stars = 1;
      else if (gameData.difficulty === 'medium') stars = 3;
      else if (gameData.difficulty === 'heavy') stars = 4;

      bingoSlots[index] = {
        name: gameName,
        difficulty: stars,
        genre: gameData.difficulty === 'heavy' ? '전략' : '가벼움',
        img: gameData.img,
        completed: logs.some(log => log.gameTitle && log.gameTitle.includes(gameName))
      };
      
      saveData();
      renderBingoBoard();
    }
    document.getElementById('bingoSlotModal').style.display = 'none';
  });

  watchAdForSlotBtn.addEventListener('click', () => {
    document.getElementById('bingoSlotModal').style.display = 'none';
    
    const adModal = document.getElementById('adModal');
    const adProgressBar = document.getElementById('adProgressBar');
    const adTimer = document.getElementById('adTimer');
    
    adModal.style.display = 'flex';
    adProgressBar.style.width = '0%';
    adProgressBar.style.transition = 'none';
    
    let secondsLeft = 5;
    adTimer.innerText = `${secondsLeft}초 후 광고 시청이 완료됩니다...`;
    
    const timerInterval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        adTimer.innerText = `${secondsLeft}초 후 광고 시청이 완료됩니다...`;
      } else {
        clearInterval(timerInterval);
        adModal.style.display = 'none';
        
        // Mark slot as completed!
        const index = Number(document.getElementById('targetSlotIndex').value);
        if (bingoSlots[index]) {
          bingoSlots[index].completed = true;
          playDropSound();
          saveData();
          renderBingoBoard();
          alert('광고 시청 완료! 미션 칸이 채워졌습니다. 🎲');
        }
      }
    }, 1000);
    
    // Animate progress bar
    setTimeout(() => {
      adProgressBar.style.transition = 'width 5s linear';
      adProgressBar.style.width = '100%';
    }, 50);
  });

  const claimRewardBtn = document.getElementById('claimRewardBtn');
  claimRewardBtn.addEventListener('click', () => {
    if (!isBingoRewardClaimed) {
      isBingoRewardClaimed = true;
      saveData();
      triggerConfetti();
      playDropSound();
      render(); // Rerenders the characters list again, unlocking the Gold robot!
      renderBingoBoard();
      alert('축하합니다! 월간 빙고 미션 달성 보상으로 "골든 메카 미플 🤖" 캐릭터가 도감에 해금되었습니다! 왼쪽 하단 도감에서 확인하세요! 🥳');
    }
  });

  const shuffleBingoBtn = document.getElementById('shuffleBingoBtn');
  if (shuffleBingoBtn) {
    shuffleBingoBtn.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      const allEntries = Object.entries(ENCYCLOPEDIA_DB);
      const shuffled = [...allEntries].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 16);

      const diffMap = { easy: 1, medium: 3, heavy: 5 };
      const genreMap = { easy: '가벼움', medium: '전략', heavy: '전략' };

      bingoSlots = selected.map(([key, game]) => ({
        name: key,
        difficulty: diffMap[game.difficulty] || 2,
        genre: genreMap[game.difficulty] || '가벼움',
        img: game.img,
        completed: false
      }));
      isBingoRewardClaimed = false;
      saveData();
      renderBingoBoard();
      if (soundEnabled) playCardFlipSound();
    });
  }

  const captureBingoBtn = document.getElementById('captureBingoBtn');
  captureBingoBtn.addEventListener('click', () => {
    captureBingoBtn.disabled = true;
    captureBingoBtn.innerHTML = '<i data-lucide="loader"></i> 이미지 생성 중...';
    if (window.lucide) window.lucide.createIcons();

    const currentMonth = new Date().getMonth() + 1;
    html2canvas(document.getElementById('bingoBoardWrapper'), {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#fdf6e2',
      scale: 1.5
    })
    .then((canvas) => {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const link = document.createElement('a');
      link.download = `보드게임빙고-${currentMonth}월미션.jpg`;
      link.href = dataUrl;
      link.click();
      
      captureBingoBtn.disabled = false;
      captureBingoBtn.innerHTML = '<i data-lucide="camera"></i> 빙고 이미지 저장';
      if (window.lucide) window.lucide.createIcons();
    })
    .catch((error) => {
      console.error('html2canvas error!', error);
      captureBingoBtn.disabled = false;
      captureBingoBtn.innerHTML = '<i data-lucide="camera"></i> 빙고 이미지 저장';
      if (window.lucide) window.lucide.createIcons();
      alert('이미지 저장 중 오류가 발생했습니다.');
    });
  });

  // --- 모바일 하단 탭 전환 이벤트 리스너 추가 ---
  const mobileNavItems = document.querySelectorAll('.mobile-nav-bar .nav-item');
  const appContainerEl = document.querySelector('.app-container');

  mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-mobile-tab');
      
      // 하단 탭 활성화 상태 변경
      mobileNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // app-container 클래스 제어로 화면 레이아웃 토글
      appContainerEl.className = 'app-container';
      appContainerEl.classList.add(`tab-${target}`);
      
      // 만약 로그/도감/랭킹/빙고/도구 탭을 선택한 경우 대응하는 패널 제어
      if (target !== 'home') {
        const mappedTab = target === 'logs' ? 'logs' : target === 'info' ? 'info' : target === 'rank' ? 'rank' : target === 'bingo' ? 'bingo' : 'tools';
        const desktopTabBtn = document.querySelector(`.tab-btn[data-tab="${mappedTab}"]`);
        if (desktopTabBtn) {
          desktopTabBtn.click();
        } else {
          // 데스크톱 탭 버튼이 없는 경우(도구 탭 등) 모든 패널을 숨기고 해당 패널만 강제 표시
          tabPanels.forEach(p => p.style.display = 'none');
          if (toolsPanel) toolsPanel.style.display = 'flex';
        }
      }
    });
  });
}


// --- Bingo Helper Functions ---
function renderBingoBoard() {
  const currentMonth = new Date().getMonth() + 1;
  document.getElementById('bingoTitle').innerText = `${currentMonth}월 보드게임 빙고!`;

  const bingoGrid = document.getElementById('bingoGrid');
  bingoGrid.innerHTML = '';

  bingoSlots.forEach((slot) => {
    const hasBeenPlayed = logs.some(log => log.gameTitle && log.gameTitle.includes(slot.name));
    if (hasBeenPlayed) {
      slot.completed = true;
    }
  });

  bingoSlots.forEach((slot, index) => {
    const cell = document.createElement('div');
    cell.className = `bingo-cell ${slot.completed ? 'completed' : ''}`;
    cell.dataset.index = index;

    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += i < slot.difficulty ? '★' : '☆';
    }

    cell.innerHTML = `
      <div class="bingo-cell-img-wrapper">
        ${slot.img ? `<img src="${slot.img}" alt="${slot.name}" class="bingo-cell-img">` : `<div class="bingo-cell-placeholder-icon"><i data-lucide="image"></i></div>`}
      </div>
      <div class="bingo-cell-info">
        <span class="bingo-cell-title">${slot.name}</span>
        <span class="bingo-cell-stars">${starsHtml}</span>
        <span class="bingo-cell-genre">${slot.genre}</span>
      </div>
      <div class="bingo-cell-check"></div>
      <div class="meeple-stamp">🧸</div>
    `;

    cell.addEventListener('click', (e) => {
      if (e.target.closest('.bingo-cell-check')) {
        slot.completed = !slot.completed;
        playPopSound();
        saveData();
        renderBingoBoard();
        return;
      }
      openBingoSlotModal(index);
    });

    bingoGrid.appendChild(cell);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }

  checkBingoLines();
}

function checkBingoLines() {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
  ];

  let completedLines = 0;
  const cells = document.querySelectorAll('.bingo-cell');
  
  cells.forEach(c => c.classList.remove('bingo-highlight'));

  lines.forEach((line) => {
    const isLineComplete = line.every(index => bingoSlots[index] && bingoSlots[index].completed);
    if (isLineComplete) {
      completedLines++;
      line.forEach(index => {
        if (cells[index]) {
          cells[index].classList.add('bingo-highlight');
        }
      });
    }
  });

  const completedCount = bingoSlots.filter(s => s.completed).length;
  const percent = Math.round((completedCount / 16) * 100);

  document.getElementById('bingoCompletedLines').innerText = `${completedLines}줄`;
  document.getElementById('bingoProgressPercent').innerText = `${percent}%`;

  const claimRewardBtn = document.getElementById('claimRewardBtn');
  if (completedCount === 16 && !isBingoRewardClaimed) {
    claimRewardBtn.removeAttribute('disabled');
    claimRewardBtn.style.cursor = 'pointer';
    claimRewardBtn.style.opacity = '1';
    claimRewardBtn.classList.add('active');
  } else {
    claimRewardBtn.setAttribute('disabled', 'true');
    claimRewardBtn.classList.remove('active');
    claimRewardBtn.style.cursor = 'not-allowed';
    claimRewardBtn.style.opacity = '0.6';
    if (isBingoRewardClaimed) {
      claimRewardBtn.innerHTML = '<i data-lucide="check"></i> 보상 수령 완료';
    } else {
      claimRewardBtn.innerHTML = '<i data-lucide="gift"></i> 미션 완료 보상 받기';
    }
  }
}

function openBingoSlotModal(slotIndex) {
  const modal = document.getElementById('bingoSlotModal');
  document.getElementById('targetSlotIndex').value = slotIndex;

  const select = document.getElementById('bingoGameSelect');
  select.innerHTML = '';

  Object.keys(ENCYCLOPEDIA_DB).forEach((key) => {
    const game = ENCYCLOPEDIA_DB[key];
    const option = document.createElement('option');
    option.value = key;
    option.innerText = game.name;
    if (bingoSlots[slotIndex] && bingoSlots[slotIndex].name === key) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  modal.style.display = 'flex';
}

function triggerConfetti() {
  const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
    
    const duration = Math.random() * 2 + 1.5;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = Math.random() * 1.5 + 's';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, (duration + 2) * 1000);
  }
}

// --- Play Tools Logic ---

let selectedDiceType = 6;
let isRouletteSpinning = false;
let isDiceRolling = false;
let roulettePlayerCount = 4;

const ROULE_COLORS = [
  { hex: '#ff7675', name: '빨강' },
  { hex: '#fdcb6e', name: '노랑' },
  { hex: '#00cec9', name: '청록' },
  { hex: '#6c5ce7', name: '보라' },
  { hex: '#e84393', name: '분홍' },
  { hex: '#0984e3', name: '파랑' },
  { hex: '#2ecc71', name: '초록' },
  { hex: '#f1c40f', name: '금색' },
  { hex: '#e67e22', name: '주황' },
  { hex: '#16a085', name: '다크민트' }
];

// Ladder Game State
let ladderData = {
  numCols: 3,
  colsX: [],
  rungs: [], // { y, col }
  players: [],
  results: [],
  pathsTraced: [],
  pathsAnimation: null,
  isViewingAll: false
};

function initPlayTools() {
  const toolsPanel = document.getElementById('toolsPanel');
  if (!toolsPanel) return;

  // Populate global let references now that DOM is ready
  btnGetRecommend = document.getElementById('btnGetRecommend');
  recommendPlayers = document.getElementById('recommendPlayers');
  recommendTime = document.getElementById('recommendTime');
  recommendDiff = document.getElementById('recommendDiff');
  recommendResultCard = document.getElementById('recommendResultCard');
  recommendGameImg = document.getElementById('recommendGameImg');
  recommendGameTitle = document.getElementById('recommendGameTitle');
  recommendGameDesc = document.getElementById('recommendGameDesc');

  timerProgressRing = document.getElementById('timerProgressRing');
  timerDisplay = document.getElementById('timerDisplay');
  btnResetTimer = document.getElementById('btnResetTimer');
  btnStartPauseTimer = document.getElementById('btnStartPauseTimer');
  timerPlayIcon = document.getElementById('timerPlayIcon');

  btnScoreAddPlayer = document.getElementById('btnScoreAddPlayer');
  btnScoreAddRound = document.getElementById('btnScoreAddRound');
  scoreTableBody = document.getElementById('scoreTableBody');
  btnScoreReset = document.getElementById('btnScoreReset');
  btnScoreSaveLog = document.getElementById('btnScoreSaveLog');

  const helpModal = document.getElementById('helpModal');
  const closeHelpModalBtn = document.getElementById('closeHelpModalBtn');
  const confirmHelpBtn = document.getElementById('confirmHelpBtn');
  const helpTabButtons = document.querySelectorAll('.help-tab-btn');
  const helpPanels = document.querySelectorAll('.help-panel');

  // Sub Tab switching
  const subTabs = [
    document.getElementById('subTabRoulette'),
    document.getElementById('subTabDice'),
    document.getElementById('subTabLadder'),
    document.getElementById('subTabRecommend'),
    document.getElementById('subTabTimer'),
    document.getElementById('subTabScoreboard')
  ].filter(Boolean);

  const sections = [
    document.getElementById('toolSectionRoulette'),
    document.getElementById('toolSectionDice'),
    document.getElementById('toolSectionLadder'),
    document.getElementById('toolSectionRecommend'),
    document.getElementById('toolSectionTimer'),
    document.getElementById('toolSectionScoreboard')
  ].filter(Boolean);

  subTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      subTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      sections.forEach((sec, idx) => {
        if (idx === index) {
          if (sec) sec.style.display = 'flex';
        } else {
          if (sec) sec.style.display = 'none';
        }
      });
      
      // Special init for ladder canvas resize
      if (index === 2) {
        setTimeout(initLadderCanvas, 100);
      }
    });
  });

  // 1. Roulette Setup
  const btnDecPlayers = document.getElementById('btnDecPlayers');
  const btnIncPlayers = document.getElementById('btnIncPlayers');
  const roulettePlayerCountDisplay = document.getElementById('roulettePlayerCountDisplay');

  if (btnDecPlayers && btnIncPlayers && roulettePlayerCountDisplay) {
    btnDecPlayers.addEventListener('click', () => {
      if (roulettePlayerCount > 2) {
        roulettePlayerCount--;
        roulettePlayerCountDisplay.innerText = `${roulettePlayerCount} 명`;
        updateRouletteWheel();
      }
    });
    btnIncPlayers.addEventListener('click', () => {
      if (roulettePlayerCount < 10) {
        roulettePlayerCount++;
        roulettePlayerCountDisplay.innerText = `${roulettePlayerCount} 명`;
        updateRouletteWheel();
      }
    });
  }

  updateRouletteWheel();

  if (spinRouletteBtn) {
    spinRouletteBtn.addEventListener('click', () => {
      if (isRouletteSpinning) return;
      
      isRouletteSpinning = true;
      spinRouletteBtn.disabled = true;
      rouletteResult.innerText = '선 플레이어 정하는 중...';
      if (soundEnabled) playCardFlipSound();

      const count = roulettePlayerCount;
      const anglePerPlayer = 360 / count;
      
      const winnerIndex = Math.floor(Math.random() * count);
      const spins = 5;
      const targetAngle = spins * 360 - (winnerIndex + 0.5) * anglePerPlayer;
      
      rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.15, 0.85, 0.15, 1)';
      rouletteWheel.style.transform = `rotate(${targetAngle}deg)`;

      setTimeout(() => {
        isRouletteSpinning = false;
        spinRouletteBtn.disabled = false;
        const winColor = ROULE_COLORS[winnerIndex % ROULE_COLORS.length];
        rouletteResult.innerHTML = `선 플레이어: <span style="display:inline-flex;align-items:center;gap:6px;font-size:1.4rem;font-weight:800;">🎉 <span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:${winColor.hex};border:2px solid rgba(0,0,0,0.15);"></span> ${winColor.name} 팀 🎉</span>`;
        if (soundEnabled) triggerConfetti();
      }, 4000);
    });
  }

  // 2. Dice Setup
  const diceTypeBtns = document.querySelectorAll('[data-dice-type]');
  diceTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diceTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDiceType = parseInt(btn.getAttribute('data-dice-type'));
      diceObject.innerText = selectedDiceType;
      diceResultText.innerText = `D${selectedDiceType} 주사위가 선택되었습니다.`;
    });
  });

  const rollDice = () => {
    if (isDiceRolling) return;
    isDiceRolling = true;
    rollDiceBtn.disabled = true;
    
    let count = 0;
    const interval = setInterval(() => {
      const tempVal = Math.floor(Math.random() * selectedDiceType) + 1;
      diceObject.innerText = tempVal;
      diceObject.style.transform = `rotate(${Math.random() * 30 - 15}deg) scale(0.95)`;
      if (soundEnabled && count % 2 === 0) playClickSound();
      count++;
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      const finalVal = Math.floor(Math.random() * selectedDiceType) + 1;
      diceObject.innerText = finalVal;
      diceObject.style.transform = 'rotate(0deg) scale(1.1)';
      diceResultText.innerHTML = `결과: <span style="color:#0984e3; font-size:1.3rem;">🎲 ${finalVal}</span>`;
      isDiceRolling = false;
      rollDiceBtn.disabled = false;
    }, 700);
  };

  if (rollDiceBtn) rollDiceBtn.addEventListener('click', rollDice);
  if (diceObject) diceObject.addEventListener('click', rollDice);

  // 3. Ladder Setup
  if (ladderNum) {
    ladderNum.addEventListener('change', buildLadderInputs);
    ladderPreset.addEventListener('change', buildLadderInputs);
  }
  buildLadderInputs();

  if (generateLadderBtn) generateLadderBtn.addEventListener('click', generateLadder);
  if (resetLadderBtn) resetLadderBtn.addEventListener('click', () => {
    generateLadder();
  });
  if (viewLadderResultBtn) viewLadderResultBtn.addEventListener('click', viewLadderResults);

  if (ladderCanvas) {
    ladderCanvas.addEventListener('click', handleLadderCanvasClick);
  }

  // 4. Tools Settings Setup
  const toolsThemeBtn = document.getElementById('toolsThemeBtn');
  const toolsHelpBtn = document.getElementById('toolsHelpBtn');
  const toolsSoundBtn = document.getElementById('toolsSoundBtn');
  const toolsSoundIcon = document.getElementById('toolsSoundIcon');

  if (toolsThemeBtn) {
    toolsThemeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'midnight' ? 'wood' : 'midnight';
      saveData();
      applyTheme(currentTheme);
    });
  }

  if (toolsHelpBtn) {
    toolsHelpBtn.addEventListener('click', () => {
      if (helpModal) helpModal.classList.add('active');
    });
  }

  const updateToolsSoundUI = () => {
    if (toolsSoundIcon) {
      if (soundEnabled) {
        toolsSoundIcon.setAttribute('data-lucide', 'volume-2');
        toolsSoundIcon.parentNode.style.color = '';
      } else {
        toolsSoundIcon.setAttribute('data-lucide', 'volume-x');
        toolsSoundIcon.parentNode.style.color = '#ef4444';
      }
      if (window.lucide) window.lucide.createIcons();
    }
  };

  if (toolsSoundBtn) {
    toolsSoundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      saveData();
      updateToolsSoundUI();
    });
  }
  updateToolsSoundUI();

  // --- 6. Game Recommender Setup ---
  const parsePlayers = (str) => {
    const m = str.match(/(\d+)\s*-\s*(\d+)/);
    if (m) return { minP: parseInt(m[1]), maxP: parseInt(m[2]) };
    const s = str.match(/(\d+)\s*\+?/);
    if (s) return { minP: parseInt(s[1]), maxP: 99 };
    return { minP: 1, maxP: 99 };
  };

  const diffWeight = { easy: 1.5, medium: 2.5, heavy: 3.5 };

  if (btnGetRecommend) {
    btnGetRecommend.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      const playersVal = parseInt(recommendPlayers.value);
      const timeVal = recommendTime.value;
      const diffVal = recommendDiff.value;

      const allGames = Object.values(ENCYCLOPEDIA_DB);

      let candidates = allGames.filter(game => {
        const { minP, maxP } = parsePlayers(game.players);
        if (playersVal < minP || playersVal > maxP) return false;

        if (timeVal !== 'all') {
          const maxTime = parseInt(timeVal);
          let estTime = 30;
          if (game.name.includes('카탄')) estTime = 75;
          else if (game.name.includes('스플렌더')) estTime = 40;
          else if (game.name.includes('루미큐브')) estTime = 35;
          else if (game.name.includes('할리갈리')) estTime = 15;
          else if (game.name.includes('젠가')) estTime = 10;
          else if (game.name.includes('티켓 투 라이드')) estTime = 50;
          else if (game.name.includes('카르카손')) estTime = 40;
          else if (game.name.includes('딕싯')) estTime = 30;
          else if (game.name.includes('우노')) estTime = 20;
          if (estTime > maxTime) return false;
        }

        if (diffVal !== 'all') {
          const w = diffWeight[game.difficulty] || 2.0;
          if (diffVal === 'easy' && w > 2.0) return false;
          if (diffVal === 'medium' && (w <= 2.0 || w > 3.0)) return false;
          if (diffVal === 'heavy' && w <= 3.0) return false;
        }

        return true;
      });

      if (candidates.length === 0) {
        candidates = allGames;
      }

      const selectedGame = candidates[Math.floor(Math.random() * candidates.length)];
      const { minP, maxP } = parsePlayers(selectedGame.players);
      
      recommendGameTitle.innerText = selectedGame.name;
      recommendGameImg.src = getGameImage(selectedGame.name);
      
      const diffLabels = { easy: '가벼움 (쉬움)', medium: '보통 (미디엄)', heavy: '묵직함 (하드)' };
      const diffLabel = diffLabels[selectedGame.difficulty] || '보통 (미디엄)';
      const w = diffWeight[selectedGame.difficulty] || 2.0;
      
      recommendGameDesc.innerHTML = `
        <strong>난이도</strong>: ${diffLabel} (${w})<br>
        <strong>인원</strong>: ${minP}~${maxP}명<br>
        <span style="display:inline-block; margin-top:5px; color:var(--text-muted); font-size:0.75rem;">💡 오늘 이 보드게임 상자를 탑에 차곡차곡 올려 보세요!</span>
      `;
      recommendResultCard.style.display = 'flex';
      
      if (soundEnabled) triggerConfetti();
    });
  }

  // --- 7. Turn Timer Setup ---
  let timerInterval = null;
  let timerTotalSeconds = 60;
  let timerRemainingSeconds = 60;
  let isTimerRunning = false;

  const updateTimerDisplay = () => {
    const mins = Math.floor(timerRemainingSeconds / 60);
    const secs = timerRemainingSeconds % 60;
    timerDisplay.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (timerProgressRing) {
      const totalDash = 263.89; // 2 * Math.PI * 42
      const offset = totalDash * (1 - timerRemainingSeconds / timerTotalSeconds);
      timerProgressRing.style.strokeDashoffset = offset;
    }
  };

  const startPauseTimer = () => {
    if (soundEnabled) playClickSound();
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerPlayIcon.setAttribute('data-lucide', 'play');
      if (window.lucide) window.lucide.createIcons();
    } else {
      isTimerRunning = true;
      timerPlayIcon.setAttribute('data-lucide', 'pause');
      if (window.lucide) window.lucide.createIcons();

      timerInterval = setInterval(() => {
        timerRemainingSeconds--;
        updateTimerDisplay();

        if (timerRemainingSeconds <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          timerPlayIcon.setAttribute('data-lucide', 'play');
          if (window.lucide) window.lucide.createIcons();
          
          timerDisplay.style.color = '#ef4444';
          timerDisplay.style.transform = 'scale(1.2)';
          if (soundEnabled) {
            playWinSound();
          }
          setTimeout(() => {
            timerDisplay.style.color = '';
            timerDisplay.style.transform = '';
          }, 1500);

          timerRemainingSeconds = timerTotalSeconds;
          updateTimerDisplay();
        } else if (timerRemainingSeconds <= 5) {
          if (soundEnabled) playClickSound();
        }
      }, 1000);
    }
  };

  const resetTimer = () => {
    if (soundEnabled) playClickSound();
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerRemainingSeconds = timerTotalSeconds;
    timerPlayIcon.setAttribute('data-lucide', 'play');
    if (window.lucide) window.lucide.createIcons();
    updateTimerDisplay();
  };

  if (btnStartPauseTimer) {
    btnStartPauseTimer.addEventListener('click', startPauseTimer);
  }
  if (btnResetTimer) {
    btnResetTimer.addEventListener('click', resetTimer);
  }

  const presetBtns = document.querySelectorAll('[data-time-preset]');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const val = parseInt(btn.getAttribute('data-time-preset'));
      timerTotalSeconds = val;
      timerRemainingSeconds = val;
      resetTimer();
    });
  });

  // --- 8. Scoreboard Setup ---
  let scoreboardPlayers = [
    { name: "참여자1", scores: [0] },
    { name: "참여자2", scores: [0] }
  ];

  const renderScoreboard = () => {
    if (!scoreTableBody) return;
    scoreTableBody.innerHTML = '';

    const roundCount = scoreboardPlayers[0].scores.length;

    const headerRow = document.querySelector('#scoreTable thead tr');
    if (headerRow) {
      headerRow.innerHTML = `<th style="padding: 6px 4px; font-weight: 700;">이름</th>`;
      for (let r = 0; r < roundCount; r++) {
        headerRow.innerHTML += `<th style="padding: 6px 4px; font-weight: 700; width: 50px;">R${r+1}</th>`;
      }
      headerRow.innerHTML += `<th style="padding: 6px 4px; font-weight: 700; width: 60px; color: var(--primary-color);">합계</th>`;
      headerRow.innerHTML += `<th style="padding: 6px 4px; font-weight: 700; width: 30px;">삭제</th>`;
    }

    scoreboardPlayers.forEach((player, pIdx) => {
      const tr = document.createElement('tr');
      
      let td = document.createElement('td');
      td.style.padding = '4px';
      td.innerHTML = `<input type="text" value="${player.name}" data-player-idx="${pIdx}" class="score-player-name-input">`;
      tr.appendChild(td);

      let total = 0;
      for (let r = 0; r < roundCount; r++) {
        const val = player.scores[r] || 0;
        total += val;
        td = document.createElement('td');
        td.style.padding = '4px';
        td.innerHTML = `<input type="number" value="${val}" data-player-idx="${pIdx}" data-round-idx="${r}" class="score-value-input">`;
        tr.appendChild(td);
      }

      td = document.createElement('td');
      td.style.padding = '6px 4px';
      td.style.fontWeight = 'bold';
      td.style.color = 'var(--primary-color)';
      td.innerText = total;
      tr.appendChild(td);

      td = document.createElement('td');
      td.style.padding = '4px';
      td.innerHTML = `<button type="button" class="btn-delete-row" data-player-idx="${pIdx}" style="background:none; border:none; color:#ef4444; cursor:pointer; display:flex; align-items:center; justify-content:center; width:100%;"><i data-lucide="trash-2" style="width: 14px; height: 14px;"></i></button>`;
      tr.appendChild(td);

      scoreTableBody.appendChild(tr);
    });

    if (window.lucide) window.lucide.createIcons();

    document.querySelectorAll('.score-player-name-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const pIdx = parseInt(e.target.getAttribute('data-player-idx'));
        scoreboardPlayers[pIdx].name = e.target.value;
      });
    });

    document.querySelectorAll('.score-value-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const pIdx = parseInt(e.target.getAttribute('data-player-idx'));
        const rIdx = parseInt(e.target.getAttribute('data-round-idx'));
        scoreboardPlayers[pIdx].scores[rIdx] = parseInt(e.target.value) || 0;
        renderScoreboard();
      });
    });

    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (soundEnabled) playClickSound();
        const pIdx = parseInt(btn.closest('button').getAttribute('data-player-idx'));
        if (scoreboardPlayers.length <= 1) return;
        scoreboardPlayers.splice(pIdx, 1);
        renderScoreboard();
      });
    });
  };

  if (btnScoreAddPlayer) {
    btnScoreAddPlayer.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      const roundCount = scoreboardPlayers[0].scores.length;
      const newScores = Array(roundCount).fill(0);
      scoreboardPlayers.push({ name: `참여자${scoreboardPlayers.length + 1}`, scores: newScores });
      renderScoreboard();
    });
  }

  if (btnScoreAddRound) {
    btnScoreAddRound.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      scoreboardPlayers.forEach(p => {
        p.scores.push(0);
      });
      renderScoreboard();
    });
  }

  if (btnScoreReset) {
    btnScoreReset.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      scoreboardPlayers = [
        { name: "참여자1", scores: [0] },
        { name: "참여자2", scores: [0] }
      ];
      renderScoreboard();
    });
  }

  if (btnScoreSaveLog) {
    btnScoreSaveLog.addEventListener('click', () => {
      if (soundEnabled) playClickSound();
      let highestScore = -Infinity;
      let winnerName = "";
      let companions = [];

      scoreboardPlayers.forEach(p => {
        const total = p.scores.reduce((a, b) => a + b, 0);
        if (total > highestScore) {
          highestScore = total;
          winnerName = p.name;
        }
        companions.push(p.name);
      });

      modalTitle.innerText = "🎲 새 보드게임 플레이 기록";
      submitBtn.innerText = "상자 탑에 올리기";
      editingLogIdInput.value = "";
      selectedGamePreview.style.display = 'none';

      recordForm.reset();
      document.getElementById('playDate').value = new Date().toISOString().substring(0, 10);
      
      document.getElementById('playCompanion').value = companions.filter(c => c !== winnerName).join(', ');
      
      const resultSelect = document.getElementById('playResult');
      if (resultSelect) {
        resultSelect.value = "win";
      }

      addModal.classList.add('active');
    });
  }

  renderScoreboard();

  // 5. Help Guide Modal Close & Sub-tab Setup
  if (closeHelpModalBtn) {
    closeHelpModalBtn.addEventListener('click', () => {
      if (helpModal) helpModal.classList.remove('active');
    });
  }
  if (confirmHelpBtn) {
    confirmHelpBtn.addEventListener('click', () => {
      if (helpModal) helpModal.classList.remove('active');
    });
  }

  helpTabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      helpTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      helpPanels.forEach((p, idx) => {
        if (idx === index) {
          p.style.display = 'flex';
          p.classList.add('active');
        } else {
          p.style.display = 'none';
          p.classList.remove('active');
        }
      });
    });
  });
}

// --- 9. Achievements & Badges Engine ---
function renderAchievements() {
  if (!achievementsGrid) return;
  achievementsGrid.innerHTML = '';

  const totalLogs = logs.length;
  
  // 1. 루미 마스터: 루미큐브 5회 이상 플레이
  const rummyCount = logs.filter(l => l.gameTitle && l.gameTitle.includes('루미큐브')).length;
  const badgeRummy = {
    emoji: "🧩",
    title: "루미 마스터",
    desc: "루미큐브 5회 이상 플레이 완료",
    current: rummyCount,
    target: 5,
    unlocked: rummyCount >= 5
  };

  // 2. 인싸 보드게이머: 동반자 5명 이상 등록
  const uniqueCompanions = new Set();
  logs.forEach(l => {
    if (l.companion) {
      l.companion.split(',').forEach(c => {
        const name = c.trim();
        if (name) uniqueCompanions.add(name);
      });
    }
  });
  const companionCount = uniqueCompanions.size;
  const badgeCompanion = {
    emoji: "👥",
    title: "인싸 보드게이머",
    desc: "등록된 고유 동반자 5명 이상",
    current: companionCount,
    target: 5,
    unlocked: companionCount >= 5
  };

  // 3. 올빼미 게이머: 밤 10시 이후 기록 존재 또는 8회 이상 플레이
  const owlPlay = logs.some(l => l.notes && (l.notes.includes('밤') || l.notes.includes('새벽') || l.notes.includes('야간'))) || totalLogs >= 8;
  const badgeOwl = {
    emoji: "🦉",
    title: "올빼미 게이머",
    desc: "밤 10시 이후 플레이 기록 (or 8개 로그 기록)",
    current: owlPlay ? 1 : 0,
    target: 1,
    unlocked: owlPlay
  };

  // 4. 다독다독 수집가: 도감 게임 5종 이상 해금
  const uniqueGames = new Set(logs.map(l => l.gameTitle).filter(Boolean));
  const uniqueGamesCount = uniqueGames.size;
  const badgeCollector = {
    emoji: "📚",
    title: "다독다독 수집가",
    desc: "도감 게임 5종 이상 플레이 완료",
    current: uniqueGamesCount,
    target: 5,
    unlocked: uniqueGamesCount >= 5
  };

  // 5. 스피드스타: 플레이 시간 30분 이하 기록
  const speedPlay = logs.some(l => l.playTime && l.playTime <= 30);
  const badgeSpeed = {
    emoji: "⚡",
    title: "스피드스타",
    desc: "플레이 타임 30분 이하 게임 완수",
    current: speedPlay ? 1 : 0,
    target: 1,
    unlocked: speedPlay
  };

  // 6. 골든 메카: 월간 빙고 완료 보상 받기 성공
  const goldenMecha = isBingoRewardClaimed;
  const badgeGolden = {
    emoji: "🤖",
    title: "골든 메카",
    desc: "월간 빙고 미션 최종 완료 보상 해금",
    current: goldenMecha ? 1 : 0,
    target: 1,
    unlocked: goldenMecha
  };

  const badgeList = [badgeRummy, badgeCompanion, badgeOwl, badgeCollector, badgeSpeed, badgeGolden];

  badgeList.forEach(badge => {
    const card = document.createElement('div');
    card.className = `achievement-card ${badge.unlocked ? 'unlocked' : 'locked'}`;

    const percent = Math.min(100, (badge.current / badge.target) * 100);

    card.innerHTML = `
      <div class="achievement-icon">${badge.emoji}</div>
      <div class="achievement-info">
        <div class="achievement-title">${badge.title}</div>
        <div class="achievement-desc">${badge.desc}</div>
        <div style="font-size:0.65rem; color:var(--text-muted); margin-top:2px;">
          진행도: ${badge.current} / ${badge.target} (${Math.round(percent)}%)
        </div>
        <div class="achievement-progress-bar-wrap">
          <div class="achievement-progress-bar" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;

    achievementsGrid.appendChild(card);
  });
}

function updateRouletteWheel() {
  if (!rouletteWheel) return;
  const count = roulettePlayerCount;
  const anglePerPlayer = 360 / count;
  let conicParts = [];
  
  for (let i = 0; i < count; i++) {
    const color = ROULE_COLORS[i % ROULE_COLORS.length].hex;
    conicParts.push(`${color} ${i * anglePerPlayer}deg ${(i + 1) * anglePerPlayer}deg`);
  }
  
  rouletteWheel.style.transition = 'none';
  rouletteWheel.style.transform = 'rotate(0deg)';
  rouletteWheel.style.background = `conic-gradient(${conicParts.join(', ')})`;
}

function buildLadderInputs() {
  const count = parseInt(ladderNum.value);
  const preset = ladderPreset.value;
  ladderInputsArea.innerHTML = '';

  const colors = ['#ff7675', '#fdcb6e', '#00cec9', '#6c5ce7', '#e84393', '#2ecc71'];

  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';

    const colorDot = document.createElement('span');
    colorDot.style.width = '8px';
    colorDot.style.height = '8px';
    colorDot.style.borderRadius = '50%';
    colorDot.style.backgroundColor = colors[i % colors.length];
    colorDot.style.flexShrink = '0';

    const pInput = document.createElement('input');
    pInput.type = 'text';
    pInput.placeholder = `참여자 ${i + 1}`;
    pInput.value = `참여자 ${i + 1}`;
    pInput.className = 'ladder-player-input';
    pInput.style.flex = '1';
    pInput.style.minWidth = '0';
    pInput.style.padding = '0.35rem 0.5rem';
    pInput.style.fontSize = '0.8rem';
    pInput.style.borderRadius = '6px';
    pInput.style.border = '1px solid var(--border-color)';
    pInput.style.background = 'var(--card-bg)';
    pInput.style.color = 'var(--text-main)';

    const rInput = document.createElement('input');
    rInput.type = 'text';
    rInput.placeholder = `결과 ${i + 1}`;
    rInput.className = 'ladder-result-input';
    rInput.style.flex = '1';
    rInput.style.minWidth = '0';
    rInput.style.padding = '0.35rem 0.5rem';
    rInput.style.fontSize = '0.8rem';
    rInput.style.borderRadius = '6px';
    rInput.style.border = '1px solid var(--border-color)';
    rInput.style.background = 'var(--card-bg)';
    rInput.style.color = 'var(--text-main)';

    if (preset === 'auto') {
      const winnerIdx = Math.floor(Math.random() * count);
      rInput.value = i === winnerIdx ? '★당첨!' : '꽝';
    } else {
      rInput.value = `결과 ${i + 1}`;
    }

    row.appendChild(colorDot);
    row.appendChild(pInput);
    row.appendChild(rInput);
    ladderInputsArea.appendChild(row);
  }
  
  setTimeout(initLadderCanvas, 50);
}

function initLadderCanvas() {
  if (!ladderCanvas) return;
  const rect = ladderCanvas.parentNode.getBoundingClientRect();
  ladderCanvas.width = rect.width;
  ladderCanvas.height = rect.height;
  
  const ctx = ladderCanvas.getContext('2d');
  ctx.clearRect(0, 0, ladderCanvas.width, ladderCanvas.height);
  
  ctx.strokeStyle = '#d7c0ae';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4, 4]);
  
  const count = parseInt(ladderNum.value);
  const padding = 40;
  const colWidth = (ladderCanvas.width - 2 * padding) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    const x = padding + i * colWidth;
    ctx.beginPath();
    ctx.moveTo(x, 25);
    ctx.lineTo(x, ladderCanvas.height - 25);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function generateLadder() {
  const count = parseInt(ladderNum.value);
  const pInputs = document.querySelectorAll('.ladder-player-input');
  const rInputs = document.querySelectorAll('.ladder-result-input');
  
  ladderData.players = Array.from(pInputs).map(inp => inp.value.trim() || '이름');
  ladderData.results = Array.from(rInputs).map(inp => inp.value.trim() || '꽝');
  ladderData.numCols = count;
  ladderData.pathsTraced = [];
  ladderData.rungs = [];
  
  const startY = 35;
  const endY = ladderCanvas.height - 35;
  const levelHeight = (endY - startY) / 7;
  
  for (let lvl = 1; lvl <= 6; lvl++) {
    const y = startY + lvl * levelHeight + (Math.random() * 12 - 6);
    
    for (let c = 0; c < count - 1; c++) {
      if (Math.random() < 0.6) {
        const leftExist = ladderData.rungs.some(r => Math.abs(r.y - y) < 8 && r.col === c - 1);
        if (!leftExist) {
          ladderData.rungs.push({ y, col: c });
        }
      }
    }
  }

  drawLadder();
  ladderResultText.innerText = '사다리 준비 완료! 위에 이름을 클릭해서 결과를 확인해 보세요.';
  if (soundEnabled) playClickSound();
}

function drawLadder() {
  const ctx = ladderCanvas.getContext('2d');
  ctx.clearRect(0, 0, ladderCanvas.width, ladderCanvas.height);
  
  const count = ladderData.numCols;
  const padding = 40;
  const colWidth = (ladderCanvas.width - 2 * padding) / (count - 1);
  
  ladderData.colsX = [];
  for (let i = 0; i < count; i++) {
    ladderData.colsX.push(padding + i * colWidth);
  }

  ctx.font = 'bold 0.8rem Outfit, Noto Sans KR';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const rectWidth = Math.min(60, colWidth * 0.9);
  for (let i = 0; i < count; i++) {
    const x = ladderData.colsX[i];
    
    ctx.fillStyle = '#795548';
    ctx.fillRect(x - rectWidth / 2, ladderCanvas.height - 24, rectWidth, 20);
    
    ctx.fillStyle = '#ffffff';
    let label = ladderData.results[i];
    const maxChars = Math.max(2, Math.floor(rectWidth / 10));
    if (label.length > maxChars) {
      label = label.substring(0, maxChars - 1) + '..';
    }
    ctx.fillText(label, x, ladderCanvas.height - 14);
  }

  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 4;
  for (let i = 0; i < count; i++) {
    const x = ladderData.colsX[i];
    ctx.beginPath();
    ctx.moveTo(x, 25);
    ctx.lineTo(x, ladderCanvas.height - 25);
    ctx.stroke();
  }

  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 3.5;
  ladderData.rungs.forEach(rung => {
    const x1 = ladderData.colsX[rung.col];
    const x2 = ladderData.colsX[rung.col + 1];
    ctx.beginPath();
    ctx.moveTo(x1, rung.y);
    ctx.lineTo(x2, rung.y);
    ctx.stroke();
  });

  for (let i = 0; i < count; i++) {
    const x = ladderData.colsX[i];
    
    ctx.fillStyle = '#8b5a2b';
    ctx.beginPath();
    ctx.arc(x, 15, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 0.75rem Outfit';
    ctx.fillText(String.fromCharCode(65 + i), x, 15);
  }

  ladderData.pathsTraced.forEach(path => {
    drawTracedPath(path.startCol, path.color);
  });
}

function drawTracedPath(startCol, color) {
  const ctx = ladderCanvas.getContext('2d');
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const pathPoints = calculatePathPoints(startCol);
  ctx.beginPath();
  ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
  for (let i = 1; i < pathPoints.length; i++) {
    ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
  }
  ctx.stroke();
}

function calculatePathPoints(startCol) {
  const points = [];
  let col = startCol;
  let currentY = 25;
  
  points.push({ x: ladderData.colsX[col], y: currentY });

  const sortedRungs = [...ladderData.rungs].sort((a, b) => a.y - b.y);

  while (currentY < ladderCanvas.height - 25) {
    const nextRung = sortedRungs.find(r => r.y > currentY && (r.col === col || r.col === col - 1));
    
    if (nextRung) {
      points.push({ x: ladderData.colsX[col], y: nextRung.y });
      
      const targetCol = nextRung.col === col ? col + 1 : col - 1;
      points.push({ x: ladderData.colsX[targetCol], y: nextRung.y });
      
      col = targetCol;
      currentY = nextRung.y;
    } else {
      points.push({ x: ladderData.colsX[col], y: ladderCanvas.height - 25 });
      currentY = ladderCanvas.height - 25;
    }
  }
  
  return points;
}

function handleLadderCanvasClick(e) {
  if (ladderData.colsX.length === 0) return;
  
  const rect = ladderCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  for (let i = 0; i < ladderData.numCols; i++) {
    const colX = ladderData.colsX[i];
    const dist = Math.sqrt((x - colX) ** 2 + (y - 15) ** 2);
    
    if (dist < 18) {
      traceLadderPath(i);
      break;
    }
  }
}

function traceLadderPath(startCol, onComplete) {
  if (ladderData.pathsTraced.some(p => p.startCol === startCol)) {
    if (onComplete) onComplete();
    return;
  }

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
  const traceColor = colors[startCol % colors.length];
  
  const pathPoints = calculatePathPoints(startCol);
  let ptIdx = 0;
  const ctx = ladderCanvas.getContext('2d');
  
  if (soundEnabled) playClickSound();

  const animatePath = () => {
    if (ptIdx >= pathPoints.length - 1) {
      const finalCol = ladderData.colsX.indexOf(pathPoints[pathPoints.length - 1].x);
      const result = ladderData.results[finalCol];
      const player = ladderData.players[startCol];
      
      ladderData.pathsTraced.push({ startCol, finalCol, color: traceColor });
      
      ladderResultText.innerHTML = `<span style="color:${traceColor}; font-weight:bold;">${player}</span> 님의 결과는 <span style="font-size:1.15rem; color:#b25d22; font-weight:800;">★${result}</span> 입니다!`;
      if (soundEnabled) playCardFlipSound();
      
      drawLadder();
      if (onComplete) setTimeout(onComplete, 300);
      return;
    }

    const startPt = pathPoints[ptIdx];
    const endPt = pathPoints[ptIdx + 1];
    
    ctx.strokeStyle = traceColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);
    ctx.lineTo(endPt.x, endPt.y);
    ctx.stroke();

    ptIdx++;
    setTimeout(animatePath, 150);
  };

  animatePath();
}

function viewLadderResults() {
  if (ladderData.players.length === 0) {
    ladderResultText.innerText = '먼저 사다리를 만들어 주세요!';
    if (soundEnabled) playClickSound();
    return;
  }
  if (soundEnabled) playClickSound();

  ladderData.pathsTraced = [];
  drawLadder();
  ladderResultText.innerText = '결과를 공개 중입니다...';

  const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

  let currentCol = 0;
  const traceNext = () => {
    if (currentCol >= ladderData.players.length) {
      let summary = '<div style="display:flex;flex-direction:column;gap:4px;font-size:0.9rem;text-align:center;">';
      ladderData.players.forEach((player, idx) => {
        const c = colors[idx % colors.length];
        const pathInfo = ladderData.pathsTraced.find(p => p.startCol === idx);
        const finalIdx = pathInfo ? pathInfo.finalCol : idx;
        const result = ladderData.results[finalIdx];
        summary += `<div><span style="color:${c};font-weight:bold;">${player}</span> → <span style="font-weight:800;color:#b25d22;">★${result}</span></div>`;
      });
      summary += '</div>';
      ladderResultText.innerHTML = summary;
      if (soundEnabled) triggerConfetti();
      return;
    }
    traceLadderPath(currentCol, traceNext);
    currentCol++;
  };

  traceNext();
}
