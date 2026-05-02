'use strict';

const STATES = [
  'BOOT_SHEET',
  'SYSTEM_BOOT',
  'PROLOGUE_RETURN_ARCHIVE',
  'PROLOGUE_EMERGENCY_WAKE',
  'PROLOGUE_MEMORY_CHECK',
  'PROLOGUE_SHIP_CONTEXT',
  'PROLOGUE_SHIP_STATUS_CHECK',
  'PHASE_1_POWER',
  'PHASE_2_COORDINATE',
  'PHASE_3_CONTAMINATION',
  'PHASE_4_SIGNAL',
  'PHASE_5_REPORT',
  'PHASE_6_CELEBRATION',
  'ENDING_LETTER',
];

const ASSETS = {
  image: {
    BOOT_SHEET: 'assets/images/intro.png',
    SYSTEM_BOOT: 'assets/images/background.png',
    PROLOGUE_RETURN_ARCHIVE: 'assets/images/background.png',
    PROLOGUE_EMERGENCY_WAKE: 'assets/images/stage0.png',
    PROLOGUE_MEMORY_CHECK: 'assets/images/stage0.png',
    PROLOGUE_SHIP_CONTEXT: 'assets/images/stage0.png',
    PROLOGUE_SHIP_STATUS_CHECK: 'assets/images/stage0.png',
    PHASE_1_POWER: 'assets/images/stage0.png',
    PHASE_1_POWER_RESTORED: 'assets/images/stage0_bright.png',
    PHASE_2_COORDINATE: 'assets/images/main_map.png',
    PHASE_3_CONTAMINATION: 'assets/images/stage2.png',
    PHASE_4_SIGNAL: 'assets/images/stage3.png',
    PHASE_5_REPORT: 'assets/images/stage4.png',
    PHASE_6_CELEBRATION: 'assets/images/outro.png',
    ENDING_LETTER: 'assets/images/outro.png',
    CAKE: 'assets/images/cake.png',
    CAKE_BLEWOUT: 'assets/images/cake_blewout.png',
  },
  audio: {
    BOOT_SHEET: 'assets/audio/cognitive_test.mp3',
    SYSTEM_BOOT: 'assets/audio/intro.mp3',
    PROLOGUE_RETURN_ARCHIVE: 'assets/audio/intro.mp3',
    PROLOGUE_EMERGENCY_WAKE: 'assets/audio/emergency_loop.mp3',
    PROLOGUE_MEMORY_CHECK: 'assets/audio/cognitive_test.mp3',
    PROLOGUE_SHIP_CONTEXT: 'assets/audio/emergency_loop.mp3',
    PROLOGUE_SHIP_STATUS_CHECK: 'assets/audio/emergency_loop.mp3',
    PHASE_1_POWER: 'assets/audio/stage1_power.mp3',
    PHASE_2_COORDINATE: 'assets/audio/stage2_coordinate.mp3',
    PHASE_3_CONTAMINATION: 'assets/audio/stage3_memory.mp3',
    PHASE_4_SIGNAL: 'assets/audio/stage3_memory.mp3',
    PHASE_4_SIGNAL_REVEAL: 'assets/audio/stage4_signal.mp3',
    PHASE_5_REPORT: 'assets/audio/stage5_report.mp3',
    PHASE_6_CELEBRATION: 'assets/audio/outro.mp3',
    ENDING_LETTER: 'assets/audio/credits_loop.mp3',
    reveal: 'assets/audio/reveal.mp3',
  },
};

const BIRTHDAY_SONG_FADE_MS = 1100;
const CUE_TIME_SCALE = 1.45;
const MIN_CUE_HOLD_MS = 1200;
const BGM_CROSSFADE_MS = 1800;
const SFX_VOLUME_BOOST = 3.4;

const STORY = {
  SYSTEM_BOOT: {
    status: 'SYSTEM BOOT',
    warning: 'COGNITION RESTORED',
    route: 'ARCHIVE / LOCKED',
    title: 'SYSTEM BOOT',
  },
  PROLOGUE_RETURN_ARCHIVE: {
    status: 'RETURN ARCHIVE',
    warning: 'ARCHIVE RESTORE',
    route: 'EARTH / STABLE',
    title: 'MISSION ARCHIVE',
    action: '각성 로그 확인',
  },
  PROLOGUE_EMERGENCY_WAKE: {
    status: 'EMERGENCY WAKE',
    warning: 'UNSCHEDULED WAKE',
    route: 'EARTH / UNKNOWN',
    title: 'EMERGENCY WAKE PROTOCOL',
  },
  PROLOGUE_MEMORY_CHECK: {
    status: 'MEMORY CHECK',
    warning: 'MEMORY CONTINUITY UNSTABLE',
    route: 'EARTH / UNKNOWN',
    title: 'COGNITIVE RECOVERY',
  },
  PROLOGUE_SHIP_CONTEXT: {
    status: 'SITUATION BRIEFING',
    warning: 'SYSTEM BREACH DETECTED',
    route: 'ERID -> EARTH',
    title: 'CURRENT SITUATION RESTORE',
  },
  PROLOGUE_SHIP_STATUS_CHECK: {
    status: 'SHIP STATUS CHECK',
    warning: 'SYSTEM INSTABILITY',
    route: 'EARTH / INTERRUPTED',
    title: 'STATUS DIAGNOSTIC',
    action: '전력실로 이동',
  },
  PHASE_1_POWER: {
    status: 'PHASE 1 / POWER RECOVERY',
    warning: 'POWER LOW',
    route: 'EARTH / UNSTABLE',
    title: 'MISSION 01:\nRestore emergency power.\nActivate three power cores in sequence.',
    logs: [
      'CORE_A: LIFE SUPPORT',
      'CORE_B: NAVIGATION',
      'CORE_C: UNKNOWN MODULE',
      '',
      'Required sequence: A -> B -> C',
      '',
      'RECOVERY TARGET:',
      'Ship visibility and navigation boot power.',
    ],
    rocky: [
      '전력 코어 세 개 켜야 한다.',
      '생명 유지 장치.',
      '항법 장치.',
      '그리고... 매우 평범한 세 번째 장치.',
      '',
      '그 장치는 보지 마라.',
      '아니, 봐도 된다.',
      '하지만 깊게 생각하지 마라.',
    ].join('\n'),
    successLog: [
      'POWER RESTORED.',
      'LIFE_SUPPORT: ONLINE',
      'NAVIGATION: ONLINE',
      'MODULE_03: PARTY_LIGHT_ARRAY ONLINE',
      '',
      'PROBLEM:',
      'Return coordinate data is damaged.',
      'NEXT OBJECTIVE:',
      'Recover coordinate.',
    ],
    successRocky: [
      '번역 오류다.',
      '',
      'PARTY는 생존 관련 과학 용어다.',
      '인간 생일 생존에 필요하다.',
      '',
      '아니다.',
      '방금 말 잊어라.',
      '',
      '항법 장치 켜졌다.',
      '하지만 귀환 좌표 손상됐다.',
    ].join('\n'),
  },
  PHASE_2_COORDINATE: {
    status: 'PHASE 2 / COORDINATE RECOVERY',
    warning: 'DATE COORDINATE REQUIRED',
    route: 'EARTH / DAMAGED',
    title: 'MISSION 02:\nRecover damaged return coordinate.\nInput personal date coordinate.',
    logs: [
      'EARTH RETURN COORDINATE DAMAGED.',
      'PERSONAL DATE COORDINATE REQUIRED.',
      '',
      'Hint:',
      'The day you first arrived on Earth.',
      '',
      'RECOVERY TARGET:',
      'Birthday coordinate hidden inside route data.',
    ],
    rocky: [
      '지구로 돌아가려면 네 좌표 필요하다.',
      '인간은 이상하게도 자신이 태어난 날을 중요한 좌표로 쓴다.',
      '',
      '네가 지구에 처음 도착한 날짜.',
      '입력해라.',
    ].join('\n'),
    answer: '0503',
    successLog: [
      '0503 ACCEPTED.',
      'BIRTHDAY COORDINATE RESTORED.',
      '',
      'RETURN ROUTE UPDATED:',
      'DESTINATION: EARTH',
      'SECONDARY DESTINATION: BIRTHDAY',
      '',
      'PROBLEM:',
      'Route calculation failed.',
      'CAUSE:',
      'Memory circuit covered by red contamination.',
      'NEXT OBJECTIVE:',
      'Clean contaminated memory circuit.',
    ],
    successRocky: [
      '맞다.',
      '5월 3일.',
      '',
      '내가 왜 이 날짜를 알고 있냐고?',
      '과학적 이유다.',
      '',
      '매우 과학적이다.',
      '묻지 마라.',
      '',
      '좌표 복구됐다.',
      '그런데 항로 계산 실패했다.',
      '메모리 회로에 붉은 것 있다.',
    ].join('\n'),
  },
  PHASE_3_CONTAMINATION: {
    status: 'PHASE 3 / CONTAMINATION',
    warning: 'ASTROPHAGE BLOOM',
    route: 'EARTH / PARTIAL',
    title: 'MISSION 03:\nRemove astrophage contamination.\nManual cleaning required.',
    logs: [
      'RED CONTAMINATION DETECTED.',
      'MEMORY CIRCUIT VISIBILITY: BLOCKED',
      'Manual cleaning threshold: 65%',
      '',
      'RECOVERY TARGET:',
      'Hidden memory fragment below contamination.',
    ],
    rocky: [
      '붉은 것 닦아라.',
      '아스트로파지일 가능성 있다.',
      '',
      '또는...',
      '아니다. 아스트로파지 맞다.',
      '아마도.',
    ].join('\n'),
    fragment: 'HIDDEN MEMORY FRAGMENT FOUND:\n\n"네가 웃는 장면은,\n이 함선의 어떤 별빛보다 오래 남았다."',
    successRocky: [
      '이상하다.',
      '회로 밑에서 감정 문장 나왔다.',
      '',
      '인간 함선은 원래 이런가?',
      '',
      '나는 회로 찾으려 했다.',
      '편지 조각 찾은 것 아니다.',
      '아마 아니다.',
      '',
      '복구된 메모리에 음성 파일 첨부되어 있다.',
      '다음은 신호 복구다.',
    ].join('\n'),
  },
  PHASE_4_SIGNAL: {
    status: 'PHASE 4 / SIGNAL RECOVERY',
    warning: 'PRIVATE CHANNEL FOUND',
    route: 'EARTH / IMPROVING',
    title: 'MISSION 04:\nRecover unknown audio signal.\nSynchronize communication channel.',
    logs: [
      'NOISY AUDIO CHANNEL DETECTED.',
      'ATTACHED FILE: ENCRYPTED AUDIO',
      'Two recovery routes available.',
      '',
      'MIC ROUTE: send a loud signal.',
      'QUIET ROUTE: hold synchronization manually.',
      '',
      'RECOVERY TARGET:',
      'Voice signal attached to memory fragment.',
    ],
    rocky: [
      '알 수 없는 신호 있다.',
      '복구해야 한다.',
      '',
      '하지만 열면 안 되는 신호일 수도 있다.',
      '개인 채널일 수도 있다.',
      '에리디언 사생활 중요하다.',
      '',
      '특히 인간 생일 노래 연습 파일은',
      '절대 열면 안 된다.',
    ].join('\n'),
    successLog: [
      'SIGNAL DETECTED.',
      'SOURCE: ROCKY_PRIVATE_CHANNEL',
      'FILE NAME: HUMAN_BIRTHDAY_SONG_ATTEMPT_17.wav',
      '',
      'PLAYBACK SAMPLE:',
      'Happy... Birth... day...',
      'Seo... Yeon...',
      '',
      'PROBLEM:',
      'Birthday song found in private channel.',
      'INCIDENT AUTHENTICITY: SUSPICIOUS',
      'NEXT OBJECTIVE:',
      'Recover accident cause logs.',
    ],
    successRocky: [
      '열지 마라.',
      '아직 완성 아니다.',
      '',
      '아.',
      '이미 열었다.',
      '',
      '인간 노래 어렵다.',
      'Happy... Birth... day...',
      'Seo... Yeon...',
      '',
      '이건 개인 채널이다.',
      '과학적 개인 채널.',
      '',
      '이제 사고 원인 로그 복구하자.',
      '매우 사고 같다.',
    ].join('\n'),
  },
  PHASE_5_REPORT: {
    status: 'PHASE 5 / ACCIDENT REPORT',
    warning: 'TRUE CAUSE HIDDEN',
    route: 'EARTH / STABLE?',
    title: 'MISSION 05:\nRestore accident report.\nFind true cause of system failure.',
    logs: [
      'BROKEN LOG FILES FOUND.',
      'Open files in sequence.',
      'Integrity lock enabled.',
      '',
      'RECOVERY TARGET:',
      'Truth hidden inside accident logs.',
    ],
    rocky: '사고 원인 분석한다.\n아마 진짜 사고다.\n아마도.\n아주 평범한 사고다.',
    files: [
      ['LOG_01_WAKE_PROTOCOL', 'WAKE PROTOCOL TRIGGERED.\nCREW MEMBER SEOYEON SUCCESSFULLY AWAKENED.'],
      ['LOG_02_POWER_FAILURE', 'POWER FAILURE SIMULATED.\nPARTY_LIGHT_ARRAY SUCCESSFULLY HIDDEN.'],
      ['LOG_03_SIGNAL_ANOMALY', 'SIGNAL ANOMALY GENERATED.\nBIRTHDAY_SONG_ATTEMPT_17 STORED.'],
      ['LOG_04_SURPRISE_PLAN', 'ACCIDENT REPORT RESTORED.\n\nRESULT:\nNO CRITICAL ACCIDENT DETECTED.\n\nTRUE CAUSE:\nROCKY_SURPRISE_PROTOCOL\n\nOBJECTIVE:\nCREATE MEMORABLE HUMAN BIRTHDAY EXPERIENCE.\n\nNEXT OBJECTIVE:\nDisable emergency mode and activate celebration mode.'],
    ],
    revealRocky: [
      '...',
      '',
      '친구.',
      '설명 가능하다.',
      '',
      '나는 인간 생일 공부했다.',
      '',
      '생일은 기쁜 날.',
      '서프라이즈는 예상 못 해야 함.',
      '위기는 오래 기억됨.',
      '',
      '그래서 세 개 합쳤다.',
      '',
      '기쁜 날.',
      '예상 못 함.',
      '위기.',
      '',
      '지금 보니...',
      '조금 이상한 계획이다.',
      '',
      '하지만 축하하고 싶었다.',
    ].join('\n'),
  },
  PHASE_6_CELEBRATION: {
    status: 'PHASE 6 / COSMIC CELEBRATION',
    warning: 'SURPRISE MODE ON',
    route: 'EARTH / STABLE',
    title: 'MISSION COMPLETE:\nEmergency mode disabled.\nBirthday celebration ready.',
    logs: [
      'EMERGENCY MODE: OFF',
      'SURPRISE MODE: ON',
      'RETURN ROUTE: STABLE',
      'BIRTHDAY CELEBRATION: READY',
      '',
      'FINAL RECOVERY TARGET:',
      'Complete celebration energy.',
    ],
    rocky: [
      '너는 오늘 구조 대상 아니다.',
      '오늘은 축하받아야 하는 사람이다.',
      '',
      '마지막 축하 에너지 필요하다.',
      '인간은 손하트를 쓴다고 들었다.',
      '시각 센서 실패하면 별 두 개로 대체한다.',
      '',
      '로키 계획이다.',
      '이번엔 덜 위험하다.',
    ].join('\n'),
  },
  ENDING_LETTER: {
    status: 'ENDING / FINAL MESSAGE',
    warning: 'HEART SIGNAL CONFIRMED',
    route: 'EARTH / SLOW RETURN',
    title: 'RECOVERED MEMORY FRAGMENTS:\n01. 0503\n02. 네가 웃는 장면\n03. 로키의 축하 신호\n04. 숨겨진 마음\n\nFINAL MESSAGE READY.',
    rocky: [
      '편지 끝났다.',
      '나도 한 문장 더 말한다.',
      '',
      '이제 지구로 돌아간다.',
      '하지만 오늘은 천천히 가도 된다.',
    ].join('\n'),
  },
};

const FINAL_LETTER = [
  '안녕~~~',
  '이번에도 게임이라서 조금은 진부할 수 있겠지만..',
  '디지털로 줄 수 있는 게 마땅치 않아서 한 번 준비해 보았다!',
  '',
  '원래는 너가 갈 때부터 ‘이때쯤이면 한국을 그리워하겠지’라고 생각해서',
  '선물로 한국의 소리와 이미지들(ex. 놀이터에서 뛰노는 아이들)을 담아주려고 했는데',
  '너무 잘 적응해서 그런 거 같진 않더라고 허허',
  '물론 다행인 일이지만 말이야~',
  '',
  '근데 때마침 너가 프로젝트 헤일메리를 보고',
  '우주에 관심이 생겼다고 해서 한 번 이렇게 컨셉 잡아봤어',
  '근데 또 요즘 우주 얘길 잘 안 해서…',
  '맘에 들랑가 모르겠네',
  '',
  '손에 집을 수 있는 선물은 한국 오면 줄 거고',
  '올해도 플리를 만들어보았단다~',
  '이번에도 어쩔 수 없이 내가 듣는 음악으로.. 했어..',
  '사랑이란 게 각자의 우주가 만나 융합하는 과정이니 허허',
  '취향은 아니더라도 한 번 들어봐줘',
  '',
  '음악도 우주 컨셉이야~',
  '나름의 서사와 음악 흐름으로 트랙리스트를 구성했고',
  '내가 듣는 우주를, 그리고 우주를 사랑으로 담아본다면',
  '이런 앨범이 나오지 않을까 하면서 만들어봤어.',
  '',
  '내가 영어 해석을 잘못해서',
  '전달하고자 하는 서사가 제대로 전달 안 될까 걱정이긴 하지만…',
  '한 번 내용을 유추해보길!',
  '',
  '작년엔 22년간 넓어진 너의 우주가 나의 우주가 맞닿아서',
  '여지껏 해온 팽창과는 다른 속력과 방향으로 팽창을 하고 있는데,',
  '너도 나도 만족하는 팽창인 거 같아서 정말 기뻐',
  '',
  '앞으로도 새롭게 다양한 모습으로 너와 나의 우주에',
  '기쁨과 행복을, 슬픔이 있더라도 넓은 우주 안의 우리의 일부이겠거니 하며',
  '끌어안아 우리의 솔직한 모습으로 항성을, 은하를 채워',
  '우리만의 우주를 만들어나가자, 사랑해❤️',
  '',
  '다시 한 번 생일 축하해용',
].join('\n');

const dom = {
  app: document.getElementById('app'),
  audioStartScreen: document.getElementById('audio-start-screen'),
  audioStartInner: document.querySelector('.audio-start-inner'),
  audioStartText: document.getElementById('audio-start-text'),
  audioStartHint: document.getElementById('audio-start-hint'),
  bootScreen: document.getElementById('boot-screen'),
  missionScreen: document.getElementById('mission-screen'),
  bootBtn: document.getElementById('boot-btn'),
  bgLayer: document.getElementById('bg-layer'),
  flashLayer: document.getElementById('flash-layer'),
  particleCanvas: document.getElementById('particle-canvas'),
  bgm: document.getElementById('bgm'),
  stateLabel: document.getElementById('state-label'),
  warningLabel: document.getElementById('warning-label'),
  routeLabel: document.getElementById('route-label'),
  missionTitle: document.getElementById('mission-title'),
  systemLog: document.getElementById('system-log'),
  zone: document.getElementById('interaction-zone'),
  evidenceDock: document.getElementById('evidence-dock'),
  rockyPanel: document.querySelector('.rocky-dialogue'),
  rockyText: document.getElementById('rocky-text'),
  actionRow: document.querySelector('.action-row'),
  primaryAction: document.getElementById('primary-action'),
  rockyHelp: document.getElementById('rocky-help'),
};

const game = {
  state: 'BOOT',
  audioCtx: null,
  sfxBus: null,
  typeToken: 0,
  actionTimer: 0,
  nudgeTimer: 0,
  nudgeToken: 0,
  attempts: 0,
  powerIndex: 0,
  powerCleared: false,
  logsOpened: 0,
  reportBusy: false,
  skipHandler: null,
  fxMode: 'stars',
  particles: [],
  micStream: null,
  micFrame: 0,
  cameraStream: null,
  cameraFrame: 0,
  handHeartPoints: [],
  handHeartCenter: null,
  handHeartReadyAt: 0,
  handHeartStableFrames: 0,
  signalCleared: false,
  signalSyncStarted: false,
  signalHoldTimer: 0,
  birthdaySongStopTimer: 0,
  birthdaySongNodes: [],
  birthdaySongMaster: null,
  birthdaySongActive: false,
  birthdaySongEndTime: 0,
  bgmChannels: [],
  activeBgmIndex: 0,
  bgmFadeToken: 0,
  currentMusicSrc: '',
  imageCache: new Map(),
  bgToken: 0,
  contaminationCleared: false,
  celebrationEnergyComplete: false,
  reportRevealed: false,
  simulatedEvidenceRecovered: false,
  contaminationTouched: false,
  evidence: [],
};

const EVIDENCE = [
  { id: 'party', label: 'PARTY', kind: 'party' },
  { id: 'date', label: '0503', kind: 'date' },
  { id: 'memory', label: 'MEMORY', kind: 'memory' },
  { id: 'song', label: 'SONG', kind: 'song' },
  { id: 'simulated', label: 'SIMULATED', kind: 'simulated' },
  { id: 'surprise', label: 'SURPRISE', kind: 'surprise' },
];

const MEMORY_CHECKS = [
  {
    id: 'identity',
    system: 'MEMORY CHECK 01\nIDENTITY CONFIRMATION\n\n당신의 이름은 무엇입니까?',
    options: ['서연', '알 수 없음', '로키'],
    answer: '서연',
    success: 'IDENTITY RESTORED\nCREW MEMBER: SEOYEON',
    rockyEvent: 'identity',
  },
  {
    id: 'route',
    system: 'MEMORY CHECK 02\nROUTE CONFIRMATION\n\n현재 항로의 목적지는 어디입니까?',
    options: ['지구', '타우 세티', '모른다'],
    answer: '지구',
    success: 'DESTINATION RESTORED\nEARTH',
    followup: 'DEPARTURE POINT: ERID\nRETURN JOURNEY TO EARTH: ACTIVE',
    rockyEvent: 'route',
  },
  {
    id: 'vessel',
    system: 'MEMORY CHECK 03\nVESSEL ORIGIN\n\n현재 탑승 중인 함선의 기원은?',
    options: ['지구 우주선', '에리디언 우주선', '지구와 에리디언의 합작 우주선'],
    answer: '지구와 에리디언의 합작 우주선',
    success: 'VESSEL ORIGIN RESTORED\n\nJOINT EARTH–ERIDIAN DESIGN',
    followup: 'HUMAN HABITAT MODULE: ACTIVE\nERIDIAN NAVIGATION CORE: ACTIVE\nHYBRID LIFE SUPPORT: ACTIVE',
    rockyEvent: 'vessel',
  },
];

const ROCKY_SCRIPT = {
  PROLOGUE_EMERGENCY_WAKE: {
    enter: [
      '친구.\n깨어났다.',
      '좋다.\n매우 좋다.',
      '아니.\n상황은 안 좋다.\n깨어난 것은 좋다.',
      '기억은 어떤가.\n온전한가.',
      '동면 뒤 인간 기억은\n가끔 흩어진다.',
    ],
  },
  PROLOGUE_MEMORY_CHECK: {
    fail: ['아니다.\n기억이 아직 흔들린다.', '괜찮다.\n다시 해보자.'],
    identity: ['맞다.\n서연.', '좋은 이름이다.\n내 발음은 아직 어렵다.', '하지만 좋아한다.'],
    route: ['맞다.\n지구.', '에리드를 떠났다.\n이제 지구로 간다.', '너의 행성.\n물이 많고 소리가 많다.', '인간도 많다.'],
    vessel: ['맞다.\n함께 만든 함선이다.', '지구인의 계산.\n에리디언의 금속.', '서연의 귀환을 위한 길.', '그래서 조금 이상하게 생겼다.\n좋은 이상함이다.'],
    result: ['대부분 돌아왔다.\n좋다.', '하지만 개인 날짜 데이터가 잠겼다.\n이상하다.', '아주 중요한 날짜일 수 있다.\n아닐 수도 있다.', '아마 중요하다.'],
  },
  PROLOGUE_SHIP_CONTEXT: {
    alliance: ['맞다.\n에리드 생활 끝났다.', '연구도 끝났다.\n이제 고향으로 간다.', '나도 같이 간다.\n동맹 일 때문이다.', '그리고 친구라서다.\n이건 부가 이유다.'],
    breach: ['누군가 시스템을 건드렸다.', '내 동면이 먼저 깨졌다.\n기분 나빴다.', '그래서 너를 깨웠다.\n미안하다. 필요했다.'],
    next: ['기억은 조금 돌아왔다.\n이제 함선을 보자.', '전력과 항법과 메모리.\n전부 다시 맞춰야 한다.'],
  },
  PROLOGUE_SHIP_STATUS_CHECK: {
    lifeSupport: ['숨은 쉴 수 있다.\n좋다.', '계속 숨 쉬어라.'],
    power: ['전력이 없다.\n그래서 어둡다.', '매우 논리적이다.'],
    navigation: ['항법 장치가 길을 잃었다.', '길 찾는 장치가 길을 잃었다.\n나쁜 농담 같다.'],
    unknown: ['그건...\n중요하지 않다.', '아직은.'],
    objective: ['먼저 빛을 되찾자.\n빛이 있어야 고친다.', '그리고...\n다른 것도 켜진다.', '아주 평범한 다른 것.'],
  },
  PHASE_1_POWER: {
    enter: ['전력 코어 세 개 있다.\n순서대로 켜라.', 'A. B. C.\n인간 알파벳은 편리하다.'],
    mission: ['생명 유지.\n항법.\n그리고 평범한 세 번째 장치.'],
    firstSuccess: ['좋다.\n첫 코어 살아났다.'],
    fail: ['순서 조금 다르다.\n괜찮다.\n나도 방금 긴장했다.'],
    idle: ['A 다음 B다.\n그 다음... 평범한 C다.', '세 번째 장치는 보통 장치다.\n너무 보지 마라.'],
    hideParty: ['나는 그냥 여기 서 있었다.\n우연이다.'],
    evidence: ['오.\n그 단어.', '번역 오류다.\n인간어 파티 아니다.\n거의 아니다.'],
    questionParty: ['아니다.\n파티 아니다.', '에리디언 과학 용어다.\n생존 관련이다.', '방금 말은 잊어라.\n특히 생존이라는 말.'],
    missionSuccess: ['전력 복구됐다.\n함선이 덜 무섭다.'],
    nextProblem: ['오.\n항법 장치가 불평한다.', '방금 켰는데 바로 불평한다.\n인간 기계답다.'],
    beforeNext: ['좌표가 손상됐다.\n지구로 가려면 좌표 필요하다.', '개인 좌표도.\n순수 과학이다.'],
  },
  PHASE_2_COORDINATE: {
    enter: ['항법 좌표가 망가졌다.\n개인 날짜 좌표 필요하다.'],
    mission: ['네가 지구에 처음 도착한 날.\n그 좌표를 입력해라.'],
    firstSuccess: ['숫자 들어왔다.\n시스템이 집중한다.'],
    fail: ['좌표 불일치.\n괜찮다.\n생일은 도망가지 않는다.'],
    idle: ['월 두 자리.\n일 두 자리.\n인간 날짜 규칙 이상하다.', '힌트가 너무 친절한가?\n나는 모른다.'],
    evidence: ['0503.\n중요한 좌표다.', '누군가 아주 소중히 저장했다.\n누구인지는 보안 문제다.'],
    questionDate: ['아니다.\n내가 안다기보다...', '친구 정보는 중요하다.\n안전 때문이다.', '절대 축하 때문 아니다.\n말 순서 이상했다.'],
    missionSuccess: ['생일 좌표 복구됐다.\n항로가 조금 따뜻해졌다.'],
    nextProblem: ['계산이 또 실패했다.\n메모리 회로가 붉다.', '붉은 건 보통 좋지 않다.\n케이크면 좋지만 아니다.'],
    beforeNext: ['오염을 닦자.\n회로가 아래 있을 것이다.\n아마 회로다.'],
  },
  PHASE_3_CONTAMINATION: {
    enter: ['메모리 회로가 가려졌다.\n붉은 것 닦아라.'],
    mission: ['천천히 문질러라.\n우주선은 간지럼 안 탄다.'],
    firstSuccess: ['좋다.\n붉은 것이 사라진다.'],
    fail: ['조금 더 닦아라.\n기억은 먼지 밑에 있다.'],
    idle: ['손 움직임 필요하다.\n인간 손은 유능하다.', '붉은 층이 고집 세다.\n나도 조금 그렇다.'],
    evidence: ['이건 회로가 아니다.\n마음이다.', '이 문장은 내가 쓴 것 아니다.\n아마도 아니다.'],
    missionSuccess: ['메모리 조각 복구됐다.\n함선이 조용해졌다.'],
    nextProblem: ['조각에 음성 파일 붙어 있다.\n개인 채널 같다.', '개인 채널은 열면 안 된다.\n그래서 조금만 열자.'],
    beforeNext: ['신호 복구하자.\n아무것도 수상하지 않다.'],
  },
  PHASE_4_SIGNAL: {
    enter: ['알 수 없는 신호 있다.\n복구해야 한다.'],
    mission: ['소리로 깨워도 된다.\n조용히 잡아도 된다.'],
    firstSuccess: ['신호가 잡힌다.\n아주 조금 불길하다.'],
    fail: ['통신 채널이 부끄러워한다.\n로키 방식으로 하자.'],
    idle: ['신호는 기다리면 도망간다.\n버튼을 잡아라.', '마이크가 싫으면 조용한 방법 있다.\n나도 조용함 좋아한다.'],
    evidence: ['ROCKY_PRIVATE_CHANNEL.\n아.'],
    lockSong: ['안 된다.\n아직 17번째 시도다.\n18번째가 더 좋다.'],
    missionSuccess: ['듣지 않았다고 말해라.\n아직 완성 아니다.'],
    questionSong: ['아니다.\n맞다.\n아니다.', '대답 어렵다.\n노래도 어렵다.'],
    nextProblem: ['개인 채널에서 생일 노래 나왔다.\n사고가 조금 수상해졌다.', '로그를 보자.\n아주 평범한 로그일 것이다.'],
    beforeNext: ['사고 원인 분석한다.\n나 긴장 안 했다.'],
  },
  PHASE_5_REPORT: {
    enter: ['사고 로그 복구한다.\n아주 평범한 사고다.\n아마도.'],
    mission: ['순서대로 열어라.\n순서는 과학이다.'],
    firstSuccess: ['첫 로그 복구됐다.\n좋다. 아직 안전하다.'],
    fail: ['순서가 중요하다.\n나도 계획 순서 망쳤다.'],
    idle: ['로그는 천천히 열어도 된다.\n하지만 너무 천천히는 위험하다.', '마지막 로그는 보통 재미없다.\n정말이다.'],
    hideSimulated: ['여기까지만 보자.\n나머지는 노이즈다.', '노이즈는 인간 뇌에 좋지 않다.\n아마도.'],
    simulatedFound: ['...', '시뮬레이션은...\n가짜보다 과학적 단어다.'],
    questionSimulated: ['아니다.\n가짜라는 말은 강하다.', '시뮬레이션은 과학이다.\n축하도... 아니다.', '마지막 장면이 약해진다.\n그 말도 잊어라.'],
    beforeFinal: ['...'],
    surpriseFound: ['오.\n전부 보였다.', '이제 숨기기 어렵다.\n사실 원래도 어려웠다.'],
    confession: [
      '맞다.\n내 계획이다.',
      '좋은 계획이었다.\n내 계산에서는.',
      '지금 보니 조금 무서운 계획이었다.',
      '하지만 축하하고 싶었다.',
    ],
    missionSuccess: ['비상은 끝났다.\n축하 모드 켜도 된다.'],
    beforeNext: ['이제 위험한 부분 끝났다.\n아마도 진짜로.'],
  },
  PHASE_6_CELEBRATION: {
    enter: ['비상 모드 꺼졌다.\n좋다. 매우 좋다.'],
    mission: ['마지막 축하 에너지 필요하다.\n손하트 또는 별 두 개.'],
    fail: ['시각 센서가 인간 손을 이해하지 못한다.\n별로 대체한다.'],
    idle: ['별 두 개를 만나게 해라.\n별도 친구 필요하다.', '축하 에너지가 거의 찼다.\n과학적으로 따뜻하다.'],
    firstSuccess: ['좋다.\n하트 신호가 생긴다.'],
    missionSuccess: ['너는 오늘 구조 대상 아니다.\n오늘은 축하받아야 하는 사람이다.', '생일 축하한다.\n매우 많이.'],
    nextProblem: ['마지막 메시지가 준비됐다.\n이건 내가 안 숨긴다.'],
    beforeNext: ['편지를 열기 전에\n인간 의식 하나 남았다.', '불을 끄면 된다.\n위험하지 않은 불이다.'],
  },
  ENDING_LETTER: {
    enter: ['기억 조각이 모였다.\n이제 마음을 읽는다.'],
    mission: ['편지는 최종 신호다.\n중간에 끊지 않는다.'],
    firstSuccess: ['좋다.\n문장이 도착한다.'],
    evidence: ['숨겨진 마음 확인됨.\n매우 중요한 데이터다.'],
    fail: ['천천히 읽어라.\n시간은 오늘 느리게 가도 된다.'],
    idle: ['편지는 긴 신호다.\n천천히 받아라.'],
    missionSuccess: ['편지 끝났다.\n나도 한 문장 더 말한다.', '이제 지구로 돌아간다.\n하지만 오늘은 천천히 가도 된다.'],
    nextProblem: ['다음 문제 없다.\n좋다. 매우 좋다.'],
    beforeNext: ['다시 보고 싶으면 저장된 우주를 다시 연다.'],
  },
};

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function syncViewportHeight() {
  document.documentElement.style.setProperty('--viewport-h', `${window.innerHeight}px`);
}

function ensureAudio() {
  if (!game.audioCtx) {
    game.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return game.audioCtx;
}

function resumeAudioContext() {
  try {
    const ctx = ensureAudio();
    if (ctx.state === 'suspended') ctx.resume().catch(() => { });
    return ctx;
  } catch (error) {
    console.warn('Audio resume failed', error);
    return null;
  }
}

function getSfxDestination(ctx = ensureAudio()) {
  if (!game.sfxBus || game.sfxBus.ctx !== ctx) {
    const input = ctx.createGain();
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.setValueAtTime(-18, ctx.currentTime);
    limiter.knee.setValueAtTime(5, ctx.currentTime);
    limiter.ratio.setValueAtTime(10, ctx.currentTime);
    limiter.attack.setValueAtTime(0.003, ctx.currentTime);
    limiter.release.setValueAtTime(0.09, ctx.currentTime);
    input.connect(limiter);
    limiter.connect(ctx.destination);
    game.sfxBus = { ctx, input, limiter };
  }
  return game.sfxBus.input;
}

function isBirthdaySongPlaying() {
  return Boolean(
    game.birthdaySongActive
    && game.audioCtx
    && game.audioCtx.currentTime < game.birthdaySongEndTime
  );
}

function playRockyBeep(char) {
  if (isBirthdaySongPlaying()) return;
  if (' \n\t.,!?…。'.includes(char)) return;
  try {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 400 + Math.random() * 400;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(getSfxDestination(ctx));
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (error) {
    console.warn('Rocky beep failed', error);
  }
}

function scheduleSfxTone(freq, delay = 0, duration = 0.055, type = 'square', volume = 0.024, options = {}) {
  try {
    if (isBirthdaySongPlaying() && !options.allowDuringBirthdaySong) return;
    const ctx = resumeAudioContext();
    if (!ctx) return;
    const start = ctx.currentTime + Math.max(0.01, delay);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume * SFX_VOLUME_BOOST, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(getSfxDestination(ctx));
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch (error) {
    console.warn('SFX tone failed', error);
  }
}

function uiClickBeep() {
  scheduleSfxTone(760, 0, 0.04, 'square', 0.022);
  scheduleSfxTone(1120, 0.045, 0.04, 'square', 0.018);
}

function errorBlip() {
  scheduleSfxTone(220, 0, 0.08, 'square', 0.034);
  scheduleSfxTone(146, 0.08, 0.1, 'square', 0.028);
}

function successArp() {
  [523, 659, 784, 1046].forEach((freq, index) => {
    scheduleSfxTone(freq, index * 0.055, 0.075, 'square', 0.027);
  });
}

function evidenceChime() {
  [880, 1175, 1760].forEach((freq, index) => {
    scheduleSfxTone(freq, index * 0.075, 0.13, 'triangle', 0.028);
  });
}

function glitchBurst() {
  for (let i = 0; i < 7; i += 1) {
    scheduleSfxTone(180 + Math.random() * 980, i * 0.018, 0.04, i % 2 ? 'sawtooth' : 'square', 0.024);
  }
}

function heartBurst() {
  [392, 523, 659, 784, 1046, 1318].forEach((freq, index) => {
    scheduleSfxTone(freq, index * 0.05, 0.18, index < 2 ? 'triangle' : 'sine', 0.032);
  });
}

function setUiMode(mode) {
  document.body.dataset.uiMode = mode;
}

async function typeRocky(text, speed = 34) {
  const token = ++game.typeToken;
  window.clearTimeout(game.nudgeTimer);
  game.nudgeTimer = 0;
  document.body.classList.remove('evidence-mode');
  setUiMode('dialogue');
  dom.rockyPanel.classList.remove('rocky-nudge');
  dom.rockyPanel.classList.remove('rocky-empty');
  dom.rockyText.textContent = '';
  for (const char of Array.from(text)) {
    if (token !== game.typeToken) return false;
    dom.rockyText.textContent += char;
    dom.rockyText.scrollTop = dom.rockyText.scrollHeight;
    playRockyBeep(char);
    await wait(char === '\n' ? speed * 5 : speed);
  }
  return true;
}

function getRockyLines(event, state = game.state) {
  const entry = ROCKY_SCRIPT[state]?.[event];
  if (!entry) return [];
  return Array.isArray(entry) ? entry : [entry];
}

function rockyReadPause(line) {
  const visibleLength = Array.from(line.replace(/\s+/g, '')).length;
  return Math.min(2400, Math.max(950, visibleLength * 72));
}

async function sayRocky(event, state = game.state) {
  const lines = getRockyLines(event, state);
  for (const line of lines) {
    const completed = await typeRocky(line);
    if (!completed) return false;
    await wait(rockyReadPause(line));
  }
  return true;
}

function showRockyNudge(event, state = game.state) {
  if (document.body.dataset.uiMode !== 'interaction') return;
  const lines = getRockyLines(event, state);
  if (!lines.length) return;
  const line = lines[Math.floor(Math.random() * lines.length)];
  const token = ++game.nudgeToken;
  dom.rockyPanel.classList.remove('rocky-empty');
  dom.rockyPanel.classList.add('rocky-nudge');
  dom.rockyText.textContent = line;
  window.clearTimeout(game.nudgeTimer);
  game.nudgeTimer = window.setTimeout(() => {
    if (token === game.nudgeToken && document.body.dataset.uiMode === 'interaction') {
      clearRocky();
    }
  }, 3600);
}

function setBackground(state) {
  const url = ASSETS.image[state];
  const token = ++game.bgToken;
  document.body.dataset.state = state;
  dom.bgLayer.style.opacity = '1';
  dom.bgLayer.style.filter = state === 'BOOT' || state === 'BOOT_SHEET' || state === 'SYSTEM_BOOT'
    ? 'none'
    : state === 'PHASE_6_CELEBRATION' || state === 'ENDING_LETTER'
      ? 'saturate(1.12) brightness(1.04)'
      : 'saturate(1.02) brightness(0.95)';
  if (!url) {
    dom.bgLayer.style.backgroundImage = '';
    return;
  }
  const cssUrl = `url("${url}")`;
  if (!dom.bgLayer.style.backgroundImage) {
    dom.bgLayer.style.backgroundImage = cssUrl;
  }
  preloadImage(url).then(() => {
    if (token === game.bgToken) {
      dom.bgLayer.style.backgroundImage = cssUrl;
    }
  });
}

function preloadImage(src) {
  const full = new URL(src, window.location.href).href;
  if (game.imageCache.has(full)) return game.imageCache.get(full);
  const promise = new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (image.decode) {
        image.decode().catch(() => null).then(resolve);
      } else {
        resolve();
      }
    };
    image.onerror = () => {
      console.warn('Image preload failed', src);
      resolve();
    };
    image.src = full;
  });
  game.imageCache.set(full, promise);
  return promise;
}

function preloadImages() {
  const uniqueSources = Array.from(new Set(Object.values(ASSETS.image).filter(Boolean)));
  uniqueSources.forEach(src => preloadImage(src));
}

function getMusicVolume(state) {
  return state === 'PROLOGUE_EMERGENCY_WAKE'
    || state === 'PROLOGUE_MEMORY_CHECK'
    || state === 'PROLOGUE_SHIP_CONTEXT'
    || state === 'PROLOGUE_SHIP_STATUS_CHECK'
    ? 0.44
    : 0.54;
}

function getBgmChannels() {
  if (!game.bgmChannels.length) {
    const secondary = new Audio();
    secondary.preload = 'auto';
    game.bgmChannels = [dom.bgm, secondary];
  }
  return game.bgmChannels;
}

function fadeAudioPair(fromAudio, toAudio, targetVolume, duration = BGM_CROSSFADE_MS) {
  const token = ++game.bgmFadeToken;
  const start = performance.now();
  const fromStart = fromAudio ? fromAudio.volume : 0;
  const toStart = fromAudio ? 0 : toAudio.volume;
  const tick = now => {
    if (token !== game.bgmFadeToken) return;
    const t = Math.min(1, (now - start) / duration);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    if (fromAudio) fromAudio.volume = Math.max(0, fromStart * (1 - eased));
    toAudio.volume = toStart + (targetVolume - toStart) * eased;
    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }
    if (fromAudio) {
      fromAudio.pause();
      fromAudio.currentTime = 0;
      fromAudio.volume = 0;
    }
    toAudio.volume = targetVolume;
  };
  requestAnimationFrame(tick);
}

function crossfadeMusic(src, options = {}) {
  if (!src) return;
  const full = new URL(src, window.location.href).href;
  const channels = getBgmChannels();
  const active = channels[game.activeBgmIndex];
  const targetVolume = options.volume ?? 0.86;
  if (game.currentMusicSrc === full && active && !active.paused) {
    active.loop = options.loop ?? true;
    fadeAudioPair(null, active, targetVolume, Math.max(500, BGM_CROSSFADE_MS / 2));
    return;
  }
  const nextIndex = game.activeBgmIndex === 0 ? 1 : 0;
  const next = channels[nextIndex];
  next.pause();
  next.src = src;
  next.loop = options.loop ?? true;
  next.currentTime = 0;
  next.volume = 0;
  next.play()
    .then(() => {
      fadeAudioPair(active, next, targetVolume, options.duration ?? BGM_CROSSFADE_MS);
      game.activeBgmIndex = nextIndex;
      game.currentMusicSrc = full;
    })
    .catch(error => {
      console.warn('Music crossfade failed', error);
    });
}

function playBgm(state) {
  const src = ASSETS.audio[state];
  if (!src) return;
  crossfadeMusic(src, { loop: true, volume: getMusicVolume(state) });
}

function flash() {
  dom.flashLayer.style.opacity = '0.72';
  window.setTimeout(() => {
    dom.flashLayer.style.opacity = '0';
  }, 120);
}

function clearTimersAndMedia() {
  window.clearTimeout(game.actionTimer);
  window.clearTimeout(game.nudgeTimer);
  window.clearInterval(game.signalHoldTimer);
  game.actionTimer = 0;
  game.nudgeTimer = 0;
  game.signalHoldTimer = 0;
  if (game.micFrame) cancelAnimationFrame(game.micFrame);
  game.micFrame = 0;
  if (game.micStream) {
    game.micStream.getTracks().forEach(track => track.stop());
    game.micStream = null;
  }
  if (game.cameraFrame) cancelAnimationFrame(game.cameraFrame);
  game.cameraFrame = 0;
  if (game.cameraStream) {
    game.cameraStream.getTracks().forEach(track => track.stop());
    game.cameraStream = null;
  }
}

function showAction(label, handler, options = {}) {
  if (options.rockyDock) {
    if (dom.primaryAction.parentElement !== dom.rockyPanel) {
      dom.rockyPanel.appendChild(dom.primaryAction);
    }
    dom.primaryAction.classList.add('rocky-docked-action');
    dom.actionRow.classList.add('action-row-empty');
  } else if (dom.primaryAction.parentElement !== dom.actionRow) {
    dom.actionRow.prepend(dom.primaryAction);
    dom.primaryAction.classList.remove('rocky-docked-action');
  }
  if (!options.keepRocky) clearRocky();
  setUiMode('interaction');
  if (!options.rockyDock) dom.actionRow.classList.remove('action-row-empty');
  dom.primaryAction.textContent = label;
  dom.primaryAction.classList.remove('hidden');
  dom.primaryAction.onclick = handler;
}

function hideAction() {
  dom.primaryAction.classList.add('hidden');
  dom.primaryAction.onclick = null;
  dom.actionRow.classList.add('action-row-empty');
}

function setMissionTitle(text = '') {
  dom.missionTitle.textContent = text;
  dom.missionTitle.classList.toggle('hidden', !text);
}

function setSystemLog(lines = '') {
  dom.systemLog.textContent = Array.isArray(lines) ? lines.join('\n') : lines;
  dom.systemLog.classList.toggle('hidden', !dom.systemLog.textContent);
}

function clearRocky() {
  game.typeToken += 1;
  game.nudgeToken += 1;
  dom.rockyText.textContent = '';
  dom.rockyPanel.classList.remove('rocky-nudge');
  dom.rockyPanel.classList.add('rocky-empty');
}

async function showCenterCue(text, holdMs = 1200, variant = '') {
  clearRocky();
  setUiMode('cue');
  hideAction();
  dom.rockyHelp.classList.add('hidden');
  const cue = document.createElement('div');
  cue.className = `center-cue ${variant}`.trim();
  cue.innerHTML = text;
  dom.zone.replaceChildren(cue);
  await wait(Math.max(MIN_CUE_HOLD_MS, Math.round(holdMs * CUE_TIME_SCALE)));
  if (dom.zone.firstElementChild === cue) {
    dom.zone.innerHTML = '';
  }
}

function renderEvidenceDock() {
  dom.evidenceDock.innerHTML = EVIDENCE.map(item => {
    const acquired = game.evidence.includes(item.id);
    return `<div class="evidence-chip ${acquired ? 'acquired' : ''}">${acquired ? item.label : '???'}</div>`;
  }).join('');
}

async function acquireEvidence(id) {
  const item = EVIDENCE.find(entry => entry.id === id);
  if (!item) return;
  if (!game.evidence.includes(id)) game.evidence.push(id);
  evidenceChime();
  document.body.classList.add('evidence-mode');
  setUiMode('evidence');
  try {
    spawnSpark(window.innerWidth / 2, window.innerHeight * 0.34, 20);
    await showCenterCue(`EVIDENCE ${String(game.evidence.length).padStart(2, '0')} ACQUIRED\n<span class="keyword keyword-${item.kind}">${item.label}</span>`, 1800, 'warm');
    renderEvidenceDock();
    await wait(350);
  } finally {
    document.body.classList.remove('evidence-mode');
    setUiMode('idle');
  }
}

function askRockyChoice(options) {
  return new Promise(resolve => {
    clearRocky();
    setUiMode('interaction');
    const grid = document.createElement('div');
    grid.className = 'choice-grid';
    options.forEach(option => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn primary';
      btn.textContent = option.label;
      btn.addEventListener('click', async () => {
        grid.querySelectorAll('button').forEach(choice => {
          choice.disabled = true;
        });
        dom.zone.innerHTML = '';
        if (option.rockyEvent) {
          await sayRocky(option.rockyEvent);
          clearRocky();
          setUiMode('interaction');
          resolve(option.value);
          return;
        }
        if (option.rocky) await typeRocky(option.rocky);
        clearRocky();
        setUiMode('interaction');
        resolve(option.value);
      });
      grid.appendChild(btn);
    });
    dom.zone.innerHTML = '';
    dom.zone.appendChild(grid);
  });
}

function holdToConfirm(label, rockyLine = '') {
  return new Promise(resolve => {
    clearRocky();
    setUiMode('interaction');
    const panel = document.createElement('div');
    panel.className = 'hold-panel center-cue danger';
    panel.innerHTML = `
      <div>${label}</div>
      ${rockyLine ? '<div class="hold-rocky"></div>' : ''}
      <button class="pixel-btn primary hold-btn">3초간 누르기</button>
      <div class="hold-track"><span></span></div>
    `;
    dom.zone.innerHTML = '';
    dom.zone.appendChild(panel);
    const btn = panel.querySelector('button');
    const fill = panel.querySelector('span');
    const rockyWarning = panel.querySelector('.hold-rocky');
    let progress = 0;
    let timer = 0;
    let warningShown = false;
    let resolved = false;
    btn.onpointerdown = () => {
      if (rockyWarning && !warningShown) {
        warningShown = true;
        rockyWarning.textContent = `ROCKY: ${rockyLine.replace(/\n/g, ' ')}`;
      }
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        progress = Math.min(100, progress + 2);
        fill.style.width = `${progress}%`;
        if (progress >= 100 && !resolved) {
          resolved = true;
          window.clearInterval(timer);
          resolve();
        }
      }, 60);
    };
    const stop = () => {
      if (resolved) return;
      window.clearInterval(timer);
      progress = Math.max(0, progress - 8);
      fill.style.width = `${progress}%`;
    };
    btn.onpointerup = stop;
    btn.onpointerleave = stop;
  });
}

function armRockyHelp(delayMs, handler, idleEvent = 'idle') {
  if (dom.rockyHelp.parentElement !== dom.zone) {
    dom.zone.appendChild(dom.rockyHelp);
  }
  dom.rockyHelp.classList.add('inline-help');
  dom.rockyHelp.classList.add('hidden');
  game.skipHandler = handler;
  window.clearTimeout(game.actionTimer);
  window.clearTimeout(game.nudgeTimer);
  if (delayMs >= 8000) {
    game.nudgeTimer = window.setTimeout(() => {
      showRockyNudge(idleEvent);
    }, 8000);
  }
  game.actionTimer = window.setTimeout(() => {
    dom.rockyHelp.classList.remove('hidden');
  }, delayMs);
}

async function useRockyHelp() {
  if (!game.skipHandler) return;
  dom.rockyHelp.classList.add('hidden');
  await typeRocky('좋다. 내가 한다.\n사실 이 부분은 원래 내가 하려고 했다.\n네가 너무 잘해서 기다리고 있었다.');
  await wait(550);
  game.skipHandler();
}

function renderBase(state) {
  const story = STORY[state];
  document.body.classList.remove('evidence-mode');
  setUiMode('idle');
  game.state = state;
  dom.app.dataset.state = state;
  setBackground(state);
  playBgm(state);
  dom.stateLabel.textContent = story.status;
  dom.warningLabel.textContent = story.warning;
  dom.routeLabel.textContent = story.route;
  setMissionTitle('');
  setSystemLog('');
  clearRocky();
  dom.zone.innerHTML = '';
  hideAction();
  dom.rockyHelp.classList.add('hidden');
  game.skipHandler = null;
  game.contaminationTouched = false;
}

async function transitionTo(state) {
  clearTimersAndMedia();
  flash();
  renderBase(state);
  switch (state) {
    case 'SYSTEM_BOOT':
      await systemBoot();
      break;
    case 'PROLOGUE_RETURN_ARCHIVE':
      await prologueReturnArchive();
      break;
    case 'PROLOGUE_EMERGENCY_WAKE':
      await prologueEmergencyWake();
      break;
    case 'PROLOGUE_MEMORY_CHECK':
      await prologueMemoryCheck();
      break;
    case 'PROLOGUE_SHIP_CONTEXT':
      await prologueShipContext();
      break;
    case 'PROLOGUE_SHIP_STATUS_CHECK':
      await prologueShipStatusCheck();
      break;
    case 'PHASE_1_POWER':
      await phase1();
      break;
    case 'PHASE_2_COORDINATE':
      await phase2();
      break;
    case 'PHASE_3_CONTAMINATION':
      await phase3();
      break;
    case 'PHASE_4_SIGNAL':
      await phase4();
      break;
    case 'PHASE_5_REPORT':
      await phase5();
      break;
    case 'PHASE_6_CELEBRATION':
      await phase6();
      break;
    case 'ENDING_LETTER':
      await endingLetter();
      break;
    default:
      break;
  }
}

async function showSystemCue(text, holdMs = 1050, variant = 'cold') {
  await showCenterCue(`SYSTEM:\n${text}`, holdMs, variant);
}

async function systemBoot() {
  await showCenterCue('SYSTEM BOOT', 900, 'cold');
  await wait(500);
  transitionTo('PROLOGUE_RETURN_ARCHIVE');
}

async function prologueReturnArchive() {
  setMissionTitle('MISSION ARCHIVE');
  await showSystemCue('MISSION ARCHIVE RESTORED', 950, 'cold');
  await showSystemCue('PROJECT HAIL MARY:\nRETURN SEQUENCE', 1050, 'cold');
  await showSystemCue('DESTINATION:\nEARTH', 950, 'cold');
  await showSystemCue('CREW STATUS:\nCRYOSLEEP', 950, 'cold');
  flash();
  await wait(450);
  await showSystemCue('<span class="keyword keyword-simulated">WARNING</span>\nUNSCHEDULED WAKE EVENT DETECTED', 1800, 'danger');
  await wait(1100);
  transitionTo('PROLOGUE_EMERGENCY_WAKE');
}

async function prologueEmergencyWake() {
  setMissionTitle('');
  await showSystemCue('EMERGENCY WAKE PROTOCOL\nACTIVATED', 1100, 'danger');
  await showSystemCue('MEMORY CONTINUITY:\n<span class="keyword keyword-simulated">UNSTABLE</span>', 1300, 'danger');
  await showSystemCue('COGNITIVE RECOVERY TEST\nREQUIRED', 1200, 'cold');
  await wait(1200);
  await sayRocky('enter');
  await showCenterCue('MEMORY CHECK\nREADY', 900, 'cold');
  showAction('기억 검사 시작', () => transitionTo('PROLOGUE_MEMORY_CHECK'));
}

async function prologueMemoryCheck() {
  setMissionTitle('COGNITIVE RECOVERY TEST');
  for (const check of MEMORY_CHECKS) {
    await runMemoryCheck(check);
  }
  await showSystemCue('COGNITIVE RECOVERY:\nPARTIAL', 1200, 'warm');
  await showSystemCue('IDENTITY: RESTORED\nDESTINATION: RESTORED\nVESSEL ORIGIN: RESTORED\n<span class="keyword keyword-date">PERSONAL DATE DATA: LOCKED</span>', 2200, 'warm');
  await wait(1200);
  await sayRocky('result');
  await wait(700);
  transitionTo('PROLOGUE_SHIP_CONTEXT');
}

async function prologueShipContext() {
  setMissionTitle('CURRENT SITUATION');
  await showSystemCue('CURRENT SITUATION:\nRESTORED', 1050, 'cold');
  await showSystemCue('SEOYEON:\nRETURNING FROM ERID', 1300, 'cold');
  await showSystemCue('ERID LIFE AND RESEARCH:\nCOMPLETE', 1300, 'cold');
  await showSystemCue('DESTINATION:\nEARTH / HOME', 1200, 'cold');
  await showSystemCue('ROCKY PASSENGER STATUS:\nALLIANCE DEVELOPMENT SUPPORT', 1700, 'warm');
  await wait(900);
  await sayRocky('alliance');
  await showSystemCue('TRANSIT ANOMALY:\nSYSTEM BREACH DETECTED', 1500, 'danger');
  await showSystemCue('ROCKY CRYOSLEEP:\nINTERRUPTED', 1400, 'danger');
  await showSystemCue('RECOVERY PLAN:\nWAKE SEOYEON\nRESTORE SHIP SYSTEMS', 1800, 'cold');
  await wait(900);
  await sayRocky('breach');
  await showSystemCue('SHIP STATUS CHECK\nREQUIRED', 1100, 'cold');
  await sayRocky('next');
  showAction('함선 상태 확인', () => transitionTo('PROLOGUE_SHIP_STATUS_CHECK'));
}

async function runMemoryCheck(check) {
  let restored = false;
  while (!restored) {
    await showSystemCue(check.system, 1200, 'cold');
    const selected = await askMemoryChoice(check);
    if (selected !== check.answer) {
      errorBlip();
      await sayRocky('fail');
      continue;
    }
    successArp();
    await showSystemCue(check.success, 1300, check.id === 'vessel' ? 'warm' : 'cold');
    if (check.followup) {
      await wait(800);
      await showSystemCue(check.followup, 1700, 'cold');
    }
    await wait(900);
    await sayRocky(check.rockyEvent);
    await wait(900);
    restored = true;
  }
}

function askMemoryChoice(check) {
  return new Promise(resolve => {
    clearRocky();
    setUiMode('interaction');
    const grid = document.createElement('div');
    grid.className = 'choice-grid memory-choice-grid';
    check.options.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn primary';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        dom.zone.innerHTML = '';
        resolve(label);
      }, { once: true });
      grid.appendChild(btn);
    });
    dom.zone.replaceChildren(grid);
  });
}

async function prologueShipStatusCheck() {
  await showCenterCue('SHIP STATUS\nMANUAL CHECK', 900, 'cold');
  showAction('함선 상태 확인', runShipStatusCheck);
}

async function runShipStatusCheck() {
  hideAction();
  await showSystemCue('LIFE SUPPORT:\nLOW POWER MODE', 1150, 'cold');
  await sayRocky('lifeSupport');
  await showSystemCue('MAIN POWER:\nOFFLINE', 1200, 'danger');
  await sayRocky('power');
  await showSystemCue('NAVIGATION:\nDISCONNECTED', 1200, 'danger');
  await sayRocky('navigation');
  await showSystemCue('UNKNOWN MODULE:\n<span class="keyword keyword-date">ACTIVE</span>', 1800, 'warm');
  await wait(2000);
  await sayRocky('unknown');
  await showSystemCue('PRIMARY OBJECTIVE\nRESTORE MAIN POWER', 1500, 'cold');
  await wait(1000);
  await sayRocky('objective');
  showAction(STORY.PROLOGUE_SHIP_STATUS_CHECK.action, () => transitionTo('PHASE_1_POWER'));
}

async function phase1() {
  game.powerIndex = 0;
  game.powerCleared = false;
  await sayRocky('enter');
  setMissionTitle('MISSION 01\n전력을 복구하라');
  setSystemLog('POWER CORE SEQUENCE REQUIRED');
  await sayRocky('mission');
  const grid = document.createElement('div');
  grid.className = 'core-grid';
  [
    ['Core A', 'Life Support', '생명 유지 장치'],
    ['Core B', 'Navigation', '항법 장치'],
    ['Core C', 'Unknown Module', '정체 불명 장치'],
  ].forEach((core, index) => {
    const btn = document.createElement('button');
    btn.className = 'core-card';
    btn.innerHTML = `<b>${core[0]}<br>${core[1]}</b><span>${core[2]}</span>`;
    btn.addEventListener('click', () => handleCore(btn, index));
    grid.appendChild(btn);
  });
  dom.zone.appendChild(grid);
  setUiMode('interaction');
  armRockyHelp(15000, clearPower);
}

async function handleCore(btn, index) {
  if (game.powerCleared || btn.disabled || btn.classList.contains('active')) return;
  if (index !== game.powerIndex) {
    errorBlip();
    dom.systemLog.textContent = 'SEQUENCE MISMATCH.\n\n순서 조금 다르다.\n괜찮다.\n인간도 자주 실수한다.\n나도 방금 했다.';
    showRockyNudge('fail');
    dom.zone.firstElementChild.classList.add('shake');
    window.setTimeout(() => dom.zone.firstElementChild.classList.remove('shake'), 320);
    return;
  }
  if (game.powerIndex === 0) showRockyNudge('firstSuccess');
  btn.classList.add('active');
  btn.disabled = true;
  game.powerIndex += 1;
  if (game.powerIndex === 3) {
    game.powerCleared = true;
    dom.zone.querySelectorAll('.core-card').forEach(core => {
      core.disabled = true;
    });
    await clearPower();
  }
}

async function clearPower() {
  if (game.state !== 'PHASE_1_POWER' || game.powerCleared && !dom.zone.querySelector('.core-grid')) return;
  game.powerCleared = true;
  successArp();
  window.clearTimeout(game.actionTimer);
  dom.rockyHelp.classList.add('hidden');
  dom.zone.innerHTML = '';
  setMissionTitle('');
  setSystemLog('');
  spawnEmber(80);
  spawnSpark(window.innerWidth / 2, window.innerHeight * 0.38, 34);
  flash();
  setBackground('PHASE_1_POWER_RESTORED');
  await showCenterCue('POWER RESTORED', 900, 'cold');
  await wait(500);
  await showCenterCue('MODULE_03:\n█████_LIGHT_ARRAY ONLINE', 900, 'cold');
  await revealPartyBlocker();
  await showCenterCue('MODULE_03:\n<span class="keyword keyword-party">PARTY</span>_LIGHT_ARRAY ONLINE', 1200, 'warm');
  await acquireEvidence('party');
  await wait(1200);
  await sayRocky('evidence');
  await askRockyChoice([
    {
      label: 'PARTY가 뭐야?',
      rockyEvent: 'questionParty',
      value: 'ask',
    },
    { label: '그냥 넘어간다', value: 'continue' },
  ]);
  await showCenterCue('NAVIGATION ERROR', 900, 'danger');
  await wait(1000);
  await sayRocky('nextProblem');
  await showCenterCue('RETURN COORDINATE\nDAMAGED', 1000, 'danger');
  await wait(900);
  await sayRocky('beforeNext');
  showAction('항로 확인하기', () => transitionTo('PHASE_2_COORDINATE'));
}

function revealPartyBlocker() {
  return new Promise(resolve => {
    setUiMode('interaction');
    const blocker = document.createElement('div');
    blocker.className = 'center-cue cold rocky-blocker';
    blocker.innerHTML = `
      <div>MODULE_03: <span class="covered-word">█████</span>_LIGHT_ARRAY ONLINE</div>
      <img class="pixel-art" src="assets/images/rocky.gif" alt="Rocky blocking the log" />
      <button class="pixel-btn secondary">로키를 치워서 로그 확인</button>
    `;
    dom.zone.replaceChildren(blocker);
    let opened = false;
    const open = async () => {
      if (opened) return;
      opened = true;
      blocker.classList.add('moved');
      await sayRocky('hideParty');
      resolve();
    };
    blocker.querySelector('button').addEventListener('click', open);
    blocker.querySelector('img').addEventListener('click', open);
    blocker.addEventListener('pointerup', event => {
      if (!event.target.closest('button')) open();
    });
  });
}

async function phase2() {
  game.attempts = 0;
  await showCenterCue('NAVIGATION ERROR', 700, 'danger');
  await showCenterCue('PERSONAL DATE REQUIRED', 900, 'cold');
  await sayRocky('enter');
  await sayRocky('mission');
  setMissionTitle('MISSION 02\n0503 좌표를 복구하라');
  setSystemLog('Hint: The day you first arrived on Earth.');
  const panel = document.createElement('div');
  panel.className = 'coordinate-panel';
  panel.innerHTML = `
    <div>PERSONAL DATE COORDINATE</div>
    <input id="coordinate-input" class="coordinate-input" inputmode="numeric" maxlength="4" placeholder="____" autocomplete="off" />
    <div id="coordinate-hint" class="hint-line"></div>
    <button class="pixel-btn primary coordinate-submit">좌표 입력</button>
  `;
  dom.zone.appendChild(panel);
  const input = panel.querySelector('input');
  const hint = panel.querySelector('#coordinate-hint');
  const submit = panel.querySelector('.coordinate-submit');
  input.focus();
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') checkCoordinate(input, hint);
  });
  submit.addEventListener('click', () => checkCoordinate(input, hint));
  setUiMode('interaction');
  armRockyHelp(20000, clearCoordinate);
}

async function checkCoordinate(input, hint) {
  if (input.value === STORY.PHASE_2_COORDINATE.answer) {
    clearCoordinate();
    return;
  }
  errorBlip();
  game.attempts += 1;
  showRockyNudge(game.attempts === 1 ? 'fail' : 'idle');
  hint.textContent = game.attempts >= 3
    ? 'Hint: Month = 05 / Day = 03'
    : '좌표 불일치. 하지만 괜찮다. 생일은 도망가지 않는다.';
  input.value = '';
  dom.zone.firstElementChild.classList.add('shake');
  window.setTimeout(() => dom.zone.firstElementChild.classList.remove('shake'), 320);
  if (game.attempts >= 3) dom.rockyHelp.classList.remove('hidden');
}

async function clearCoordinate() {
  successArp();
  window.clearTimeout(game.actionTimer);
  dom.rockyHelp.classList.add('hidden');
  dom.zone.innerHTML = '';
  setMissionTitle('');
  setSystemLog('');
  spawnSpark(window.innerWidth / 2, window.innerHeight * 0.38, 36);
  await showCenterCue('<span class="keyword keyword-date">0503</span> ACCEPTED', 1000, 'warm');
  await acquireEvidence('date');
  await wait(1000);
  await showCenterCue('BIRTHDAY COORDINATE\nRESTORED', 1100, 'warm');
  await wait(900);
  await sayRocky('evidence');
  await askRockyChoice([
    {
      label: '내 생일을 왜 알고 있어?',
      rockyEvent: 'questionDate',
      value: 'ask',
    },
    { label: '좌표 복구를 계속한다', value: 'continue' },
  ]);
  await showCenterCue('ROUTE CALCULATION FAILED', 800, 'danger');
  await wait(900);
  await sayRocky('nextProblem');
  await sayRocky('beforeNext');
  showAction('선체 오염 확인하기', () => transitionTo('PHASE_3_CONTAMINATION'));
}

async function phase3() {
  game.contaminationCleared = false;
  game.contaminationTouched = false;
  await showCenterCue('MEMORY CIRCUIT\nCONTAMINATED', 900, 'danger');
  await sayRocky('enter');
  await sayRocky('mission');
  setMissionTitle('MISSION 03\n오염을 제거하라');
  setSystemLog('Manual cleaning required.');
  const wrap = document.createElement('div');
  wrap.className = 'scratch-wrap';
  wrap.innerHTML = `
    <div class="scratch-message">${STORY.PHASE_3_CONTAMINATION.fragment}</div>
    <canvas id="scratch-canvas"></canvas>
  `;
  const meter = document.createElement('div');
  meter.className = 'scratch-meter';
  meter.innerHTML = '<span></span>';
  const box = document.createElement('div');
  box.append(wrap, meter);
  dom.zone.appendChild(box);
  setUiMode('interaction');
  initScratch(wrap.querySelector('canvas'), meter.querySelector('span'));
  armRockyHelp(20000, clearContamination);
}

function initScratch(canvas, fill) {
  const ctx = canvas.getContext('2d');
  const mask = document.createElement('canvas');
  mask.width = 180;
  mask.height = 110;
  const maskCtx = mask.getContext('2d', { willReadFrequently: true });
  let lastProgressCheck = 0;
  let lastPct = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#a01424';
    ctx.fillRect(0, 0, rect.width, rect.height);

    maskCtx.globalCompositeOperation = 'source-over';
    maskCtx.fillStyle = '#a01424';
    maskCtx.fillRect(0, 0, mask.width, mask.height);

    for (let i = 0; i < 120; i++) {
      ctx.fillStyle = `rgba(255, ${40 + Math.random() * 70}, ${40 + Math.random() * 50}, 0.55)`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 8 + Math.random() * 22, 8 + Math.random() * 22);
    }
  };
  resize();
  let drawing = false;
  const scratch = event => {
    if (game.contaminationCleared) return;
    const rect = canvas.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    maskCtx.globalCompositeOperation = 'destination-out';
    maskCtx.beginPath();
    maskCtx.arc((x / rect.width) * mask.width, (y / rect.height) * mask.height, 12, 0, Math.PI * 2);
    maskCtx.fill();

    const now = performance.now();
    const shouldCheck = now - lastProgressCheck > 120 || !drawing;
    const pct = shouldCheck ? getScratchPercent(mask) : lastPct;
    if (shouldCheck) {
      lastProgressCheck = now;
      lastPct = pct;
    }
    fill.style.width = `${pct}%`;
    if (pct >= 65) clearContamination();
  };
  canvas.addEventListener('pointerdown', event => {
    drawing = true;
    if (!game.contaminationTouched) {
      game.contaminationTouched = true;
      showRockyNudge('firstSuccess');
    }
    canvas.setPointerCapture(event.pointerId);
    scratch(event);
  });
  canvas.addEventListener('pointermove', event => {
    if (drawing) scratch(event);
  });
  canvas.addEventListener('pointerup', () => {
    drawing = false;
  });
}

function getScratchPercent(canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 20) transparent += 1;
  }
  return Math.round((transparent / (data.length / 4)) * 100);
}

async function clearContamination() {
  if (game.state !== 'PHASE_3_CONTAMINATION' || game.contaminationCleared) return;
  game.contaminationCleared = true;
  successArp();
  window.clearTimeout(game.actionTimer);
  dom.rockyHelp.classList.add('hidden');
  const scratchCanvas = document.getElementById('scratch-canvas');
  if (scratchCanvas) scratchCanvas.style.pointerEvents = 'none';
  spawnSpark(window.innerWidth / 2, window.innerHeight * 0.38, 28);
  clearRocky();
  setUiMode('cue');
  dom.zone.innerHTML = `<div class="center-cue warm">네가 웃는 장면은,\n이 함선의 어떤 별빛보다 오래 남았다.</div>`;
  setMissionTitle('');
  setSystemLog('');
  await wait(3000);
  await acquireEvidence('memory');
  await sayRocky('evidence');
  await sayRocky('missionSuccess');
  await showCenterCue('ATTACHED SIGNAL\nDETECTED', 900, 'cold');
  await sayRocky('nextProblem');
  await sayRocky('beforeNext');
  showAction('외부 신호 확인하기', () => transitionTo('PHASE_4_SIGNAL'));
}

async function phase4() {
  game.signalCleared = false;
  game.signalSyncStarted = false;
  game.signalHoldTimer = 0;
  await showCenterCue('UNKNOWN SIGNAL\nDETECTED', 900, 'cold');
  await sayRocky('enter');
  await sayRocky('mission');
  setMissionTitle('MISSION 04\n신호를 동기화하라');
  setSystemLog('');
  const panel = document.createElement('div');
  panel.className = 'signal-panel';
  panel.innerHTML = `
    <div class="signal-wave"></div>
    <div class="route-grid">
      <button id="mic-route" class="route-card"><b>마이크로 신호 보내기</b><span>볼륨이 감지되면 통신 채널을 복구한다.</span></button>
      <button id="quiet-route" class="route-card"><b>조용히 신호 동기화하기</b><span>버튼을 3초간 누르면 로키 방식으로 복구한다.</span></button>
    </div>
    <div class="signal-meter"><span></span></div>
    <button id="hold-sync" class="pixel-btn primary hold-btn hidden">동기화 유지</button>
    <div id="signal-hint" class="hint-line"></div>
  `;
  dom.zone.appendChild(panel);
  setUiMode('interaction');
  panel.querySelector('#mic-route').addEventListener('click', () => startMicSignal(panel));
  panel.querySelector('#quiet-route').addEventListener('click', () => startHoldSignal(panel));
  armRockyHelp(10000, clearSignal);
}

async function startMicSignal(panel) {
  if (game.signalSyncStarted || game.signalCleared) return;
  game.signalSyncStarted = true;
  panel.querySelectorAll('.route-card').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('active');
  });
  const fill = panel.querySelector('.signal-meter span');
  const hint = panel.querySelector('#signal-hint');
  try {
    game.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    errorBlip();
    hint.textContent = '통신 채널이 부끄러워한다. 괜찮다. 로키 방식으로 동기화한다.';
    showRockyNudge('fail');
    game.signalSyncStarted = false;
    panel.querySelectorAll('.route-card').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('active');
    });
    startHoldSignal(panel);
    return;
  }
  const ctx = ensureAudio();
  await ctx.resume();
  const source = ctx.createMediaStreamSource(game.micStream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  let charge = 0;
  const loop = () => {
    analyser.getByteFrequencyData(data);
    const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
    charge = avg > 28 ? Math.min(100, charge + 2.2) : Math.max(0, charge - 0.45);
    fill.style.width = `${charge}%`;
    if (charge >= 100) {
      clearSignal();
      return;
    }
    game.micFrame = requestAnimationFrame(loop);
  };
  loop();
}

function startHoldSignal(panel) {
  if (game.signalSyncStarted || game.signalCleared) return;
  game.signalSyncStarted = true;
  panel.querySelectorAll('.route-card').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('active');
  });
  const holdBtn = panel.querySelector('#hold-sync');
  const fill = panel.querySelector('.signal-meter span');
  holdBtn.classList.remove('hidden');
  let progress = 0;
  let timer = 0;
  const tick = () => {
    if (game.signalCleared) {
      window.clearInterval(game.signalHoldTimer);
      return;
    }
    progress = Math.min(100, progress + 2);
    fill.style.width = `${progress}%`;
    if (progress >= 100) {
      window.clearInterval(game.signalHoldTimer);
      game.signalHoldTimer = 0;
      clearSignal();
    }
  };
  const start = () => {
    window.clearInterval(timer);
    window.clearInterval(game.signalHoldTimer);
    timer = window.setInterval(tick, 60);
    game.signalHoldTimer = timer;
  };
  const stop = () => {
    window.clearInterval(timer);
    if (game.signalHoldTimer === timer) game.signalHoldTimer = 0;
    progress = Math.max(0, progress - 10);
    fill.style.width = `${progress}%`;
  };
  holdBtn.onpointerdown = start;
  holdBtn.onpointerup = stop;
  holdBtn.onpointerleave = stop;
}

async function clearSignal() {
  if (game.state !== 'PHASE_4_SIGNAL' || game.signalCleared) return;
  game.signalCleared = true;
  successArp();
  clearTimersAndMedia();
  dom.rockyHelp.classList.add('hidden');
  dom.zone.innerHTML = '';
  setMissionTitle('');
  setSystemLog('');
  await showCenterCue('ROCKY_PRIVATE_CHANNEL', 900, 'cold');
  await wait(900);
  crossfadeMusic(ASSETS.audio.PHASE_4_SIGNAL_REVEAL, { loop: true, volume: 0.34, duration: 1500 });
  await showCenterCue('HUMAN_BIRTHDAY_SONG_ATTEMPT_17.wav', 1500, 'warm');
  await wait(1500);
  await sayRocky('evidence');
  await showCenterCue('ACCESS DENIED BY ROCKY', 900, 'danger');
  await holdToConfirm('파일 열기', getRockyLines('lockSong').join('\n'));
  await acquireEvidence('song');
  await wait(1000);
  await wait(800);
  const songDuration = playBirthdaySongClip();
  spawnSignalWave(window.innerWidth / 2, window.innerHeight * 0.36);
  spawnSpark(window.innerWidth / 2, window.innerHeight * 0.36, 24);
  await wait(songDuration + 350);
  await sayRocky('missionSuccess');
  await askRockyChoice([
    {
      label: '이거 네가 부른 거야?',
      rockyEvent: 'questionSong',
      value: 'ask',
    },
    { label: '다음 로그를 연다', value: 'continue' },
  ]);
  await showCenterCue('INCIDENT AUTHENTICITY\nSUSPICIOUS', 900, 'danger');
  await sayRocky('nextProblem');
  await sayRocky('beforeNext');
  showAction('사고 원인 분석하기', () => transitionTo('PHASE_5_REPORT'));
}

function stopBirthdaySongClip(fadeMs = BIRTHDAY_SONG_FADE_MS) {
  window.clearTimeout(game.birthdaySongStopTimer);
  game.birthdaySongStopTimer = 0;
  game.birthdaySongActive = false;
  game.birthdaySongEndTime = 0;
  const nodes = [...game.birthdaySongNodes];
  const master = game.birthdaySongMaster;
  if (master && game.audioCtx) {
    const now = game.audioCtx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value || 0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.08, fadeMs / 1000));
  }
  window.setTimeout(() => {
    nodes.forEach(node => {
      try {
        node.stop();
      } catch (error) {
        // Already stopped.
      }
    });
    game.birthdaySongNodes = game.birthdaySongNodes.filter(node => !nodes.includes(node));
    if (game.birthdaySongMaster === master) {
      try {
        master?.disconnect();
      } catch (error) {
        // Already disconnected.
      }
      game.birthdaySongMaster = null;
    }
  }, Math.max(90, fadeMs));
}

function playBirthdaySongClip() {
  return playSynthBirthdaySong();
}

function playSynthBirthdaySong() {
  try {
    stopBirthdaySongClip(140);
    const ctx = resumeAudioContext();
    if (!ctx) return 0;
    const master = ctx.createGain();
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, ctx.currentTime);
    compressor.knee.setValueAtTime(10, ctx.currentTime);
    compressor.ratio.setValueAtTime(7, ctx.currentTime);
    compressor.attack.setValueAtTime(0.004, ctx.currentTime);
    compressor.release.setValueAtTime(0.18, ctx.currentTime);
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.78, ctx.currentTime + 0.16);
    master.connect(compressor);
    compressor.connect(ctx.destination);
    game.birthdaySongMaster = master;
    const beat = 0.34;
    let cursor = ctx.currentTime + 0.08;
    const notes = [
      [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523.25, 1], [493.88, 2],
      [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587.33, 1], [523.25, 2],
      [392, 0.75], [392, 0.25], [783.99, 1], [659.25, 1], [523.25, 1], [493.88, 1], [440, 1.8],
      [698.46, 0.75], [698.46, 0.25], [659.25, 1], [523.25, 1], [587.33, 1], [523.25, 2.2],
    ];
    notes.forEach(([freq, beats], index) => {
      const duration = beats * beat * 0.96;
      scheduleBirthdayTone(ctx, freq, cursor, duration, index);
      cursor += beats * beat;
    });
    const endTime = cursor + 0.5;
    game.birthdaySongActive = true;
    game.birthdaySongEndTime = endTime;
    game.birthdaySongStopTimer = window.setTimeout(() => {
      if (game.birthdaySongMaster === master) {
        game.birthdaySongActive = false;
        game.birthdaySongEndTime = 0;
        try {
          master.disconnect();
          compressor.disconnect();
        } catch (disconnectError) {
          // Already disconnected.
        }
        game.birthdaySongMaster = null;
      }
    }, Math.max(0, (endTime - ctx.currentTime) * 1000));
    return Math.max(0, (endTime - ctx.currentTime) * 1000);
  } catch (error) {
    console.warn('Fallback birthday song failed', error);
    return 0;
  }
}

function scheduleBirthdayTone(ctx, freq, start, duration, index) {
  const jitter = (Math.random() - 0.5) * 10;
  const destination = game.birthdaySongMaster || ctx.destination;
  ['square', 'triangle'].forEach((type, layer) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq + jitter + (layer ? 7 : 0), start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(layer ? 0.034 : 0.095, start + 0.016);
      gain.gain.setValueAtTime(layer ? 0.034 : 0.095, Math.max(start + 0.017, start + duration - 0.055));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + 0.025);
      osc.connect(gain);
      gain.connect(destination);
      osc.start(start);
      osc.stop(start + duration + 0.06);
      osc.addEventListener('ended', () => {
        game.birthdaySongNodes = game.birthdaySongNodes.filter(node => node !== osc);
      });
      game.birthdaySongNodes.push(osc);
    } catch (error) {
      console.warn('Birthday tone failed', error);
    }
  });
  if (index === 0 || index === 6 || index === 12 || index === 19) {
    scheduleSfxTone(1320, Math.max(0, start - ctx.currentTime), 0.045, 'square', 0.018, { allowDuringBirthdaySong: true });
  }
}

async function phase5() {
  game.logsOpened = 0;
  game.reportRevealed = false;
  game.reportBusy = false;
  game.simulatedEvidenceRecovered = false;
  await showCenterCue('ACCIDENT LOGS\nDAMAGED', 900, 'danger');
  await sayRocky('enter');
  await sayRocky('mission');
  setMissionTitle('MISSION 05\n사고 로그를 복구하라');
  setSystemLog('Open broken logs in sequence.');
  renderReportGrid();
  setUiMode('interaction');
  armRockyHelp(15000, autoOpenNextReport);
}

function renderReportGrid() {
  const grid = document.createElement('div');
  grid.className = 'log-grid';
  STORY.PHASE_5_REPORT.files.forEach(([name], index) => {
    const btn = document.createElement('button');
    const restored = index < game.logsOpened;
    btn.className = `log-card ${restored ? 'active' : ''}`.trim();
    btn.disabled = restored || game.reportBusy;
    btn.innerHTML = `<b>${name}</b><span>${restored ? 'RESTORED' : `LOCKED / ORDER ${String(index + 1).padStart(2, '0')}`}</span>`;
    btn.addEventListener('click', () => openReportLog(btn, index));
    grid.appendChild(btn);
  });
  dom.zone.replaceChildren(grid);
}

async function openReportLog(btn, index) {
  if (game.reportBusy || game.reportRevealed || btn.disabled || btn.classList.contains('active')) return;
  if (index !== game.logsOpened) {
    errorBlip();
    dom.systemLog.textContent = 'LOG INTEGRITY ERROR.\n순서대로 열어야 한다.\n로키도 순서 중요하다고 배웠다.';
    showRockyNudge('fail');
    return;
  }
  window.clearTimeout(game.actionTimer);
  window.clearTimeout(game.nudgeTimer);
  dom.rockyHelp.classList.add('hidden');
  game.reportBusy = true;
  dom.zone.querySelectorAll('.log-card').forEach(card => {
    card.disabled = true;
  });
  const [name, body] = STORY.PHASE_5_REPORT.files[index];
  try {
    if (index === 1 && !game.simulatedEvidenceRecovered) {
      await showCenterCue('ACCIDENT REPORT\nRESTORED', 800, 'cold');
      await wait(500);
      spawnGlitch(window.innerWidth / 2, window.innerHeight * 0.34, 42);
      await showCenterCue('POWER FAILURE\n█████████', 1000, 'danger');
      await wait(900);
      await sayRocky('hideSimulated');
      await showCenterCue('ROCKY DELETE ATTEMPT\nDETECTED', 900, 'danger');
      await holdToConfirm('로그 붙잡기');
      game.simulatedEvidenceRecovered = true;
      spawnGlitch(window.innerWidth / 2, window.innerHeight * 0.34, 55);
      await showCenterCue('POWER FAILURE\n<span class="keyword keyword-simulated">SIMULATED</span>', 1200, 'danger');
      await wait(2000);
      await acquireEvidence('simulated');
      await wait(1000);
      await sayRocky('simulatedFound');
      await askRockyChoice([
        {
          label: '사고가 가짜였어?',
          rockyEvent: 'questionSimulated',
          value: 'ask',
        },
        { label: '마지막 로그를 연다', value: 'continue' },
      ]);
      clearRocky();
    }
    btn.classList.add('active');
    btn.querySelector('span').textContent = 'RESTORED';
    dom.systemLog.textContent = `${name}\n\n${body}`;
    successArp();
    if (index === 0) showRockyNudge('firstSuccess');
    game.logsOpened += 1;
    if (game.logsOpened === STORY.PHASE_5_REPORT.files.length) {
      revealSurprise();
      return;
    }
  } finally {
    if (!game.reportRevealed) {
      game.reportBusy = false;
      renderReportGrid();
      setUiMode('interaction');
      armRockyHelp(15000, autoOpenNextReport);
    }
  }
}

function autoOpenNextReport() {
  if (game.state !== 'PHASE_5_REPORT' || game.reportBusy || game.reportRevealed) return;
  const next = dom.zone.querySelectorAll('.log-card')[game.logsOpened];
  if (next) openReportLog(next, game.logsOpened);
}

async function revealSurprise() {
  if (game.state !== 'PHASE_5_REPORT' || game.reportRevealed || game.reportBusy && game.logsOpened < STORY.PHASE_5_REPORT.files.length) return;
  game.reportRevealed = true;
  window.clearTimeout(game.actionTimer);
  dom.rockyHelp.classList.add('hidden');
  dom.zone.innerHTML = '';
  setMissionTitle('');
  setSystemLog('');
  crossfadeMusic(ASSETS.audio.reveal, { loop: false, volume: 0.48, duration: 1300 });
  await showCenterCue('ACCIDENT REPORT\nRESTORED', 900, 'cold');
  await wait(700);
  await showCenterCue('NO CRITICAL ACCIDENT\nDETECTED', 1200, 'cold');
  await wait(700);
  spawnGlitch(window.innerWidth / 2, window.innerHeight * 0.34, 60);
  await showCenterCue('TRUE CAUSE:\n█████_████████_PROTOCOL', 900, 'danger');
  spawnGlitch(window.innerWidth / 2, window.innerHeight * 0.34, 75);
  await showCenterCue('TRUE CAUSE:\nROCKY_<span class="keyword keyword-surprise">SURPRISE</span>_PROTOCOL', 2000, 'warm');
  await wait(2000);
  await acquireEvidence('surprise');
  await wait(1000);
  await showEvidenceSummary();
  await wait(1000);
  document.getElementById('noise-layer').style.opacity = '0.18';
  await sayRocky('confession');
  await sayRocky('missionSuccess');
  await wait(2000);
  renderChoices();
}

async function showEvidenceSummary() {
  const labels = ['PARTY', '0503', 'MEMORY', 'SONG', 'SIMULATED', 'SURPRISE'];
  for (const label of labels) {
    await showCenterCue(label, 450, 'warm');
  }
  await showCenterCue('RESULT:\nROCKY_SURPRISE_PROTOCOL', 1300, 'warm');
}

function renderChoices() {
  const choices = [
    ['괜찮아, 로키', '다행이다.\n나 심장 없다.\n하지만 지금 있으면 빠르게 뛰었을 것이다.'],
    ['진짜 놀랐어', '성공인가?\n아니면 실패인가?\n인간 감정 어렵다.\n그래도 기억에는 남았다.'],
    ['계속 축하해줘', '좋다.\n이 부분은 많이 연습했다.\n아마도.'],
  ];
  const grid = document.createElement('div');
  grid.className = 'choice-grid';
  choices.forEach(([label, response]) => {
    const btn = document.createElement('button');
    btn.className = 'pixel-btn primary';
    btn.textContent = label;
    btn.addEventListener('click', async () => {
      dom.zone.innerHTML = '';
      await typeRocky(response);
      transitionTo('PHASE_6_CELEBRATION');
    });
    grid.appendChild(btn);
  });
  dom.zone.innerHTML = '';
  dom.zone.appendChild(grid);
  setUiMode('interaction');
}

async function phase6() {
  game.celebrationEnergyComplete = false;
  hideAction();
  dom.zone.innerHTML = '';
  setMissionTitle('');
  setSystemLog('');
  document.getElementById('noise-layer').style.opacity = '0.18';
  await wait(700);
  await showCenterCue('SURPRISE MODE\nON', 1200, 'warm');
  heartBurst();
  document.getElementById('noise-layer').style.opacity = '0.42';
  game.fxMode = 'celebrate';
  spawnStarBurst(window.innerWidth / 2, window.innerHeight * 0.36, 140);
  spawnDust(80);
  await sayRocky('enter');
  await sayRocky('mission');
  await wait(700);
  renderCelebrationEnergyChoice();
  armRockyHelp(8000, showStarDrag);
}

function renderCelebrationEnergyChoice() {
  hideAction();
  const grid = document.createElement('div');
  grid.className = 'choice-grid';
  [
    ['카메라로 손하트 만들기', startCameraHeart],
    ['화면에서 별 두 개를 모아 하트 만들기', showStarDrag],
  ].forEach(([label, handler]) => {
    const btn = document.createElement('button');
    btn.className = 'pixel-btn primary';
    btn.textContent = label;
    btn.addEventListener('click', handler);
    grid.appendChild(btn);
  });
  dom.zone.innerHTML = '';
  dom.zone.appendChild(grid);
  setUiMode('interaction');
}

async function startCameraHeart() {
  clearTimersAndMedia();
  hideAction();
  setMissionTitle('HEART SIGNAL\n카메라 손하트');
  setSystemLog('CAMERA SENSOR ACTIVE\nHEART PARTICLES: TRACKING');
  clearRocky();
  dom.zone.innerHTML = `
    <div class="camera-heart-panel">
      <div class="camera-heart-stage">
        <video class="camera-heart-video" autoplay muted playsinline></video>
        <canvas class="camera-heart-canvas"></canvas>
      </div>
      <div class="camera-heart-copy">
        <b>HAND HEART SENSOR</b>
        <span>손을 화면 중앙에 두면 하트 입자가 손 모양을 따라 정렬된다.</span>
      </div>
      <div class="camera-heart-actions">
        <button class="pixel-btn primary" data-camera-confirm disabled>하트 신호 확정</button>
        <button class="pixel-btn secondary" data-camera-fallback>별 두 개로 대체</button>
      </div>
    </div>
  `;
  setUiMode('interaction');
  const panel = dom.zone.querySelector('.camera-heart-panel');
  const video = panel.querySelector('video');
  const canvas = panel.querySelector('canvas');
  const copy = panel.querySelector('.camera-heart-copy span');
  const confirm = panel.querySelector('[data-camera-confirm]');
  const fallback = panel.querySelector('[data-camera-fallback]');
  confirm.addEventListener('click', completeCelebrationEnergy);
  fallback.addEventListener('click', async () => {
    await sayRocky('fail');
    showStarDrag();
  });
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera unavailable');
    game.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 960 },
        height: { ideal: 540 },
      },
      audio: false,
    });
    video.srcObject = game.cameraStream;
    await video.play();
    copy.textContent = '카메라 연결됨. 손을 움직이면 하트 입자가 따라간다.';
    game.handHeartPoints = makeHandHeartParticles(52);
    game.handHeartCenter = null;
    game.handHeartStableFrames = 0;
    game.handHeartReadyAt = performance.now() + 2600;
    runCameraHeartOverlay(video, canvas, confirm, copy);
  } catch (error) {
    copy.textContent = '카메라가 인간 손을 이해하지 못한다. 별 두 개로 대체한다.';
    await wait(900);
    await sayRocky('fail');
    showStarDrag();
  }
}

function makeHandHeartParticles(count) {
  return Array.from({ length: count }, (_, index) => {
    const t = (Math.PI * 2 * index) / count;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return {
      x: 0,
      y: 0,
      tx: hx * 5,
      ty: hy * 5,
      size: randomRange(7, 12),
      phase: randomRange(0, Math.PI * 2),
      color: Math.random() > 0.45 ? '#ffd6e8' : '#fff7d6',
    };
  });
}

function runCameraHeartOverlay(video, canvas, confirm, copy) {
  const ctx = canvas.getContext('2d');
  const sample = document.createElement('canvas');
  sample.width = 128;
  sample.height = 72;
  const sampleCtx = sample.getContext('2d', { willReadFrequently: true });
  let previous = null;
  let smoothHand = null;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const loop = () => {
    if (!document.body.contains(canvas) || !game.cameraStream) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    let hand = null;
    if (video.readyState >= 2) {
      sampleCtx.drawImage(video, 0, 0, sample.width, sample.height);
      const frame = sampleCtx.getImageData(0, 0, sample.width, sample.height).data;
      hand = detectHandOnlyRegion(frame, previous, sample.width, sample.height);
      previous = new Uint8ClampedArray(frame);
    }
    if (hand) {
      const mapped = mapHandRegionToCanvas(hand, rect);
      smoothHand = smoothHand
        ? smoothHandRegion(smoothHand, mapped)
        : mapped;
      game.handHeartStableFrames += 1;
    } else {
      game.handHeartStableFrames = Math.max(0, game.handHeartStableFrames - 2);
    }
    drawHandHeartOverlay(ctx, rect, smoothHand, game.handHeartStableFrames > 10);
    if (performance.now() > game.handHeartReadyAt && game.handHeartStableFrames > 28) {
      confirm.disabled = false;
      copy.textContent = '손 신호 안정. 손하트가 보이면 신호를 확정해라.';
    } else if (smoothHand) {
      confirm.disabled = true;
      copy.textContent = '손 후보만 추적 중. 얼굴 영역은 잠금 처리했다.';
    } else {
      confirm.disabled = true;
      copy.textContent = '얼굴 영역은 무시한다. 손을 화면 중앙 아래쪽에 보여줘라.';
    }
    game.cameraFrame = requestAnimationFrame(loop);
  };
  loop();
}

function detectHandOnlyRegion(frame, previous, width, height) {
  if (!previous) return null;
  let total = 0;
  let sx = 0;
  let sy = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  const samples = [];
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const nx = x / width;
      const ny = y / height;
      const faceZone = nx > 0.18 && nx < 0.82 && ny > 0.04 && ny < 0.68;
      const allowedHandZone = ny > 0.62 || ((nx < 0.28 || nx > 0.72) && ny > 0.24);
      if (faceZone || !allowedHandZone) continue;
      const i = (y * width + x) * 4;
      const r = frame[i];
      const g = frame[i + 1];
      const b = frame[i + 2];
      const skin = r > 72 && g > 42 && b > 26 && r > b * 1.12 && r > g * 0.82 && Math.max(r, g, b) - Math.min(r, g, b) > 18;
      const motion = Math.abs(r - previous[i]) + Math.abs(g - previous[i + 1]) + Math.abs(b - previous[i + 2]);
      const handCandidate = skin && motion > 26;
      if (!handCandidate) continue;
      const weight = 1 + Math.min(5, motion / 28);
      total += weight;
      sx += x * weight;
      sy += y * weight;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      if (samples.length < 90 && (x + y) % 6 === 0) samples.push({ x: nx, y: ny });
    }
  }
  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const boxAreaRatio = (boxW * boxH) / (width * height);
  if (total < 44 || boxW < 7 || boxH < 7 || boxAreaRatio > 0.22) return null;
  return {
    x: sx / total / width,
    y: sy / total / height,
    minX: minX / width,
    minY: minY / height,
    maxX: maxX / width,
    maxY: maxY / height,
    samples,
  };
}

function mapHandRegionToCanvas(hand, rect) {
  return {
    x: rect.width * (1 - hand.x),
    y: rect.height * hand.y,
    minX: rect.width * (1 - hand.maxX),
    maxX: rect.width * (1 - hand.minX),
    minY: rect.height * hand.minY,
    maxY: rect.height * hand.maxY,
    samples: hand.samples.map(point => ({
      x: rect.width * (1 - point.x),
      y: rect.height * point.y,
    })),
  };
}

function smoothHandRegion(previous, next) {
  const mix = 0.22;
  return {
    x: previous.x + (next.x - previous.x) * mix,
    y: previous.y + (next.y - previous.y) * mix,
    minX: previous.minX + (next.minX - previous.minX) * mix,
    maxX: previous.maxX + (next.maxX - previous.maxX) * mix,
    minY: previous.minY + (next.minY - previous.minY) * mix,
    maxY: previous.maxY + (next.maxY - previous.maxY) * mix,
    samples: next.samples,
  };
}

function drawHandHeartOverlay(ctx, rect, hand, forming) {
  const points = game.handHeartPoints.length ? game.handHeartPoints : makeHandHeartParticles(46);
  game.handHeartPoints = points;
  const scale = Math.min(rect.width, rect.height) / 360;
  const now = performance.now();
  const fallbackCenter = { x: rect.width * 0.5, y: rect.height * 0.58 };
  const center = hand ? { x: hand.x, y: hand.y } : fallbackCenter;
  ctx.save();
  ctx.lineWidth = 2;
  if (hand) {
    ctx.strokeStyle = 'rgba(92, 236, 255, 0.82)';
    ctx.strokeRect(hand.minX, hand.minY, hand.maxX - hand.minX, hand.maxY - hand.minY);
    ctx.beginPath();
    hand.samples.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = 'rgba(255, 225, 106, 0.72)';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 214, 232, 0.68)';
    for (let i = 0; i < hand.samples.length; i += 12) {
      const point = hand.samples[i];
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = 'rgba(255, 211, 106, 0.36)';
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(center.x - 110 * scale, center.y - 92 * scale, 220 * scale, 184 * scale);
    ctx.setLineDash([]);
  }
  ctx.beginPath();
  points.forEach((point, index) => {
    if (!point.x && !point.y) {
      point.x = randomRange(rect.width * 0.18, rect.width * 0.82);
      point.y = randomRange(rect.height * 0.18, rect.height * 0.82);
    }
    const driftX = rect.width * (0.5 + Math.cos(now / 1200 + point.phase) * 0.26);
    const driftY = rect.height * (0.5 + Math.sin(now / 1500 + point.phase) * 0.24);
    const targetX = forming ? center.x + point.tx * scale : driftX;
    const targetY = forming ? center.y + point.ty * scale : driftY;
    point.x += (targetX - point.x) * (forming ? 0.12 : 0.018);
    point.y += (targetY - point.y) * (forming ? 0.12 : 0.018);
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 214, 232, 0.5)';
  ctx.stroke();
  points.forEach(point => {
    ctx.fillStyle = point.color;
    ctx.globalAlpha = 0.72 + Math.sin(now / 220 + point.phase) * 0.18;
    drawHeart(ctx, point.x, point.y, point.size * scale);
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(92, 236, 255, 0.82)';
  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10 + now / 1400;
    const x = center.x + Math.cos(angle) * 145 * scale;
    const y = center.y + Math.sin(angle) * 102 * scale;
    ctx.fillRect(x - 2, y - 2, 4, 4);
  }
  ctx.restore();
}

function showStarDrag() {
  const drag = buildStarDrag();
  dom.zone.innerHTML = '';
  dom.zone.appendChild(drag);
  setUiMode('interaction');
}

function buildStarDrag() {
  const stage = document.createElement('div');
  stage.className = 'drag-stage';
  const a = document.createElement('div');
  const b = document.createElement('div');
  a.className = 'drag-star';
  b.className = 'drag-star';
  a.textContent = '*';
  b.textContent = '*';
  a.style.left = '18%';
  a.style.top = '45%';
  b.style.left = '72%';
  b.style.top = '45%';
  stage.append(a, b);
  makeDraggable(a, stage, checkStars);
  makeDraggable(b, stage, checkStars);
  function checkStars() {
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const d = Math.hypot(ar.left - br.left, ar.top - br.top);
    if (d < 70) {
      completeCelebrationEnergy();
    }
  }
  return stage;
}

function completeCelebrationEnergy() {
  if (game.celebrationEnergyComplete) return;
  game.celebrationEnergyComplete = true;
  spawnHeartFormation(window.innerWidth / 2, window.innerHeight * 0.36);
  dom.systemLog.textContent = [
    'EMERGENCY MODE: OFF',
    'SURPRISE MODE: ON',
    'RETURN ROUTE: STABLE',
    'BIRTHDAY CELEBRATION: READY',
    '',
    'HEART SIGNAL: CONFIRMED',
  ].join('\n');
  clearRocky();
  setUiMode('cue');
  dom.zone.innerHTML = `
    <div class="celebration-title">
      <span>HAPPY BIRTHDAY,<br>SEOYEON</span>
      <small>RETURN ROUTE TO EARTH: STABLE<br>HEART SIGNAL: CONFIRMED</small>
    </div>
  `;
  window.setTimeout(() => {
    sayRocky('missionSuccess')
      .then(() => sayRocky('nextProblem'))
      .then(() => sayRocky('beforeNext'))
      .then(startCakeCeremony);
  }, 2000);
}

function startCakeCeremony() {
  clearTimersAndMedia();
  hideAction();
  setMissionTitle('FINAL RITUAL\n촛불을 꺼라');
  setSystemLog('CAKE SIGNAL READY\nMIC INPUT OPTIONAL');
  clearRocky();
  renderCakePanel(false, '마이크에 바람을 불어 촛불을 꺼라.');
  setUiMode('interaction');
}

function renderCakePanel(blownOut = false, hint = '') {
  dom.zone.innerHTML = `
    <div class="cake-panel ${blownOut ? 'cake-panel-complete' : ''}">
      <div class="cake-frame">
        <img class="cake-image pixel-art" src="${blownOut ? ASSETS.image.CAKE_BLEWOUT : ASSETS.image.CAKE}" alt="${blownOut ? '촛불이 꺼진 케이크' : '촛불이 켜진 케이크'}">
      </div>
      <div class="cake-copy">
        <b>${blownOut ? 'CANDLE SIGNAL CONFIRMED' : 'CANDLE BLOW TEST'}</b>
        <span>${hint}</span>
      </div>
      <div class="cake-meter"><span></span></div>
      <div class="cake-actions">
        <button class="pixel-btn primary" data-cake-mic ${blownOut ? 'disabled' : ''}>마이크로 촛불 불기</button>
        <button class="pixel-btn secondary" data-cake-skip ${blownOut ? 'disabled' : ''}>로키에게 맡기기</button>
      </div>
    </div>
  `;
  if (blownOut) return;
  dom.zone.querySelector('[data-cake-mic]').addEventListener('click', startCakeMic);
  dom.zone.querySelector('[data-cake-skip]').addEventListener('click', () => blowOutCake('로키가 불었다.\n조금 세게 불었다.'));
}

async function startCakeMic() {
  const panel = dom.zone.querySelector('.cake-panel');
  if (!panel || panel.dataset.listening === 'true') return;
  panel.dataset.listening = 'true';
  const hint = panel.querySelector('.cake-copy span');
  const fill = panel.querySelector('.cake-meter span');
  const buttons = panel.querySelectorAll('button');
  buttons.forEach(button => {
    button.disabled = true;
  });
  hint.textContent = '바람 신호를 기다리는 중...';
  try {
    const ctx = resumeAudioContext();
    if (!ctx || !navigator.mediaDevices?.getUserMedia) throw new Error('Microphone unavailable');
    game.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    const source = ctx.createMediaStreamSource(game.micStream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.fftSize);
    let peak = 0;
    const startedAt = performance.now();
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const value of data) {
        const centered = (value - 128) / 128;
        sum += centered * centered;
      }
      const rms = Math.sqrt(sum / data.length);
      peak = Math.max(peak * 0.92, rms);
      fill.style.width = `${Math.min(100, peak * 520)}%`;
      if (peak > 0.105) {
        blowOutCake('촛불 꺼졌다.\n소원 신호도 저장됐다.');
        return;
      }
      if (performance.now() - startedAt > 9000) {
        hint.textContent = '바람 신호 약하다. 로키 방식도 가능하다.';
        buttons.forEach(button => {
          button.disabled = false;
        });
        panel.dataset.listening = 'false';
        return;
      }
      game.micFrame = requestAnimationFrame(loop);
    };
    loop();
  } catch (error) {
    hint.textContent = '마이크가 부끄러워한다. 로키 방식으로 대체 가능하다.';
    buttons.forEach(button => {
      button.disabled = false;
    });
    panel.dataset.listening = 'false';
  }
}

function blowOutCake(message) {
  clearTimersAndMedia();
  heartBurst();
  spawnSpark(window.innerWidth / 2, window.innerHeight * 0.36, 38);
  renderCakePanel(true, message);
  setUiMode('interaction');
  window.setTimeout(() => {
    askProjectSeoyeonSuccess();
  }, 900);
}

async function askProjectSeoyeonSuccess() {
  await typeRocky("나 '프로젝트 서연' 성공한 건가?");
  showAction('성공했어', () => transitionTo('ENDING_LETTER'), { keepRocky: true, rockyDock: true });
}

function makeDraggable(el, bounds, afterMove) {
  let dragging = false;
  const move = event => {
    if (!dragging) return;
    const rect = bounds.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width - 54, event.clientX - rect.left - 27));
    const y = Math.max(0, Math.min(rect.height - 54, event.clientY - rect.top - 27));
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    afterMove();
  };
  el.addEventListener('pointerdown', event => {
    dragging = true;
    el.setPointerCapture(event.pointerId);
  });
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', () => {
    dragging = false;
  });
}

async function endingLetter() {
  game.fxMode = 'ending';
  spawnDust(70);
  spawnStarBurst(window.innerWidth / 2, window.innerHeight * 0.34, 80);
  const panel = document.createElement('div');
  panel.className = 'letter-panel';
  panel.innerHTML = `
    <h2>FINAL MESSAGE</h2>
    <p>${FINAL_LETTER}</p>
    <section class="gift-card" aria-label="선물 QR 코드">
      <div class="gift-copy">
        <b>GIFT SIGNAL</b>
        <small>스캔해서 선물 열기</small>
      </div>
      <img class="gift-qr pixel-art" src="assets/images/QR.png" alt="선물 QR 코드">
    </section>
  `;
  dom.zone.appendChild(panel);
  setUiMode('interaction');
  hideAction();
  await wait(800);
  await sayRocky('enter');
  await sayRocky('missionSuccess');
  showAction('다시 보기', () => window.location.reload(), { keepRocky: true, rockyDock: true });
}

function resizeFx() {
  syncViewportHeight();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  dom.particleCanvas.width = Math.floor(window.innerWidth * dpr);
  dom.particleCanvas.height = Math.floor(window.innerHeight * dpr);
  dom.particleCanvas.style.width = `${window.innerWidth}px`;
  dom.particleCanvas.style.height = `${window.innerHeight}px`;
  const ctx = dom.particleCanvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function particleScale() {
  let scale = 1;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) scale *= 0.3;
  if (window.matchMedia('(max-width: 760px)').matches) scale *= 0.58;
  return scale;
}

function scaledCount(count) {
  return Math.max(1, Math.round(count * particleScale()));
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function pushParticle(config) {
  const maxParticles = 320;
  const particle = {
    x: config.x,
    y: config.y,
    vx: config.vx || 0,
    vy: config.vy || 0,
    size: config.size || 2,
    color: config.color || '#ffffff',
    alpha: config.alpha ?? 1,
    life: config.life || 60,
    maxLife: config.maxLife || config.life || 60,
    type: config.type || 'dust',
    targetX: config.targetX,
    targetY: config.targetY,
    phase: config.phase || 'free',
    update() {
      this.life -= 1;
      const progress = 1 - this.life / this.maxLife;
      if (this.type === 'heart' && this.phase === 'form' && this.targetX !== undefined) {
        this.vx += (this.targetX - this.x) * 0.018;
        this.vy += (this.targetY - this.y) * 0.018;
        if (progress > 0.62) {
          this.phase = 'scatter';
          this.vx += randomRange(-1.6, 1.6);
          this.vy += randomRange(-1.8, 0.8);
        }
      }
      if (this.type === 'ember') this.vy -= 0.012;
      if (this.type === 'glitch') this.vx += randomRange(-0.22, 0.22);
      this.x += this.vx;
      this.y += this.vy;
      this.alpha = Math.max(0, this.life / this.maxLife);
    },
    draw(ctx) {
      const rockyTop = window.innerHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rocky-reserve')) + 16;
      if (this.y > rockyTop && this.type !== 'dust') return;
      ctx.save();
      ctx.globalAlpha = this.alpha * (config.alpha ?? 1);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.shadowBlur = this.type === 'dust' ? 0 : 10;
      ctx.shadowColor = this.color;
      if (this.type === 'glitch') {
        ctx.fillRect(this.x, this.y, this.size * randomRange(1.2, 2.8), this.size);
      } else if (this.type === 'signal') {
        const radius = this.size + (this.maxLife - this.life) * 2.8;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0.15 * Math.PI, 1.75 * Math.PI);
        ctx.stroke();
      } else if (this.type === 'star' || this.type === 'spark') {
        drawStar(ctx, this.x, this.y, this.size);
      } else if (this.type === 'heart') {
        drawHeart(ctx, this.x, this.y, this.size);
      } else {
        ctx.fillRect(this.x, this.y, this.size, this.size);
      }
      ctx.restore();
    },
  };
  game.particles.push(particle);
  if (game.particles.length > maxParticles) {
    game.particles.splice(0, game.particles.length - maxParticles);
  }
}

function spawnDust(count = 40) {
  for (let i = 0; i < scaledCount(count); i++) {
    pushParticle({
      type: 'dust',
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.72,
      vx: randomRange(-0.18, 0.18),
      vy: randomRange(-0.08, 0.12),
      size: randomRange(1, 2.6),
      color: Math.random() > 0.48 ? 'rgba(180, 220, 255, 0.72)' : 'rgba(180, 190, 205, 0.62)',
      alpha: randomRange(0.26, 0.6),
      life: randomRange(150, 280),
    });
  }
}

function spawnEmber(count = 50, origin = { x: window.innerWidth / 2, y: window.innerHeight * 0.68 }) {
  for (let i = 0; i < scaledCount(count); i++) {
    pushParticle({
      type: 'ember',
      x: origin.x + randomRange(-window.innerWidth * 0.38, window.innerWidth * 0.38),
      y: origin.y + randomRange(0, 42),
      vx: randomRange(-0.45, 0.45),
      vy: randomRange(-2.2, -0.8),
      size: randomRange(2, 4.5),
      color: Math.random() > 0.5 ? '#ffb347' : '#ffd36a',
      alpha: randomRange(0.45, 0.85),
      life: randomRange(55, 105),
    });
  }
}

function spawnSpark(x, y, count = 30) {
  for (let i = 0; i < scaledCount(count); i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomRange(1.8, 5.8);
    pushParticle({
      type: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randomRange(2, 4.2),
      color: Math.random() > 0.45 ? '#fff7d6' : '#ffd36a',
      alpha: 0.9,
      life: randomRange(28, 54),
    });
  }
}

function spawnGlitch(x, y, count = 32) {
  glitchBurst();
  const palette = ['#5cecff', '#ff3f5f', '#ffffff'];
  for (let i = 0; i < scaledCount(count); i++) {
    pushParticle({
      type: 'glitch',
      x: x + randomRange(-170, 170),
      y: y + randomRange(-52, 52),
      vx: randomRange(-5, 5),
      vy: randomRange(-0.8, 0.8),
      size: randomRange(3, 8),
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: 0.95,
      life: randomRange(14, 30),
    });
  }
}

function spawnSignalWave(x, y) {
  for (let i = 0; i < scaledCount(5); i++) {
    pushParticle({
      type: 'signal',
      x,
      y,
      size: 18 + i * 22,
      color: i % 2 ? '#b88cff' : '#5cecff',
      alpha: 0.52,
      life: 42 + i * 8,
    });
  }
}

function spawnStarBurst(x, y, count = 70) {
  for (let i = 0; i < scaledCount(count); i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomRange(0.6, 3.2);
    const colors = ['#fff7d6', '#ffd36a', '#ffd6e9'];
    pushParticle({
      type: 'star',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randomRange(1.6, 4.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: randomRange(0.55, 0.95),
      life: randomRange(90, 180),
    });
  }
}

function spawnHeartFormation(centerX, centerY) {
  heartBurst();
  const count = scaledCount(120);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pushParticle({
      type: 'heart',
      phase: 'form',
      x: centerX + randomRange(-260, 260),
      y: centerY + randomRange(-150, 150),
      targetX: centerX + hx * 9,
      targetY: centerY + hy * 9,
      vx: randomRange(-0.6, 0.6),
      vy: randomRange(-0.6, 0.6),
      size: randomRange(2.2, 4.5),
      color: Math.random() > 0.55 ? '#ff7ab6' : '#ffd6e9',
      alpha: 0.9,
      life: randomRange(150, 210),
    });
  }
  spawnSpark(centerX, centerY, 34);
}

function animateFx() {
  const ctx = dom.particleCanvas.getContext('2d');
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  game.particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });
  game.particles = game.particles.filter(p => p.life > 0);
  requestAnimationFrame(animateFx);
}

function drawStar(ctx, x, y, size) {
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  ctx.fillRect(x - size * 1.3, y, size * 2.6, 1);
  ctx.fillRect(x, y - size * 1.3, 1, size * 2.6);
}

function drawHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.bezierCurveTo(x - size * 2, y - size * 0.4, x - size, y - size * 1.7, x, y - size * 0.7);
  ctx.bezierCurveTo(x + size, y - size * 1.7, x + size * 2, y - size * 0.4, x, y + size);
  ctx.fill();
}

async function boot() {
  dom.bootBtn.disabled = true;
  try {
    await ensureAudio().resume();
  } catch (error) {
    console.warn('Audio unlock failed', error);
  }
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(error => {
      console.warn('Fullscreen unavailable', error);
    });
  }
  dom.bootScreen.classList.add('hidden');
  dom.missionScreen.classList.remove('hidden');
  transitionTo('SYSTEM_BOOT').catch(error => {
    console.error('Boot transition failed', error);
    dom.bootBtn.disabled = false;
  });
}

async function initAudioStart() {
  setBackground('BOOT_SHEET');
  dom.audioStartInner.innerHTML = `
    <div class="audio-test-label">COGNITIVE RECOVERY TEST 00</div>
    <div id="audio-start-text" class="audio-start-text"></div>
    <div class="boot-answer-row">
      <input class="boot-answer-input" inputmode="numeric" maxlength="1" aria-label="2 더하기 2 답 입력" />
    </div>
    <div id="audio-start-hint" class="audio-start-hint hidden">BASIC ARITHMETIC: RESTORED</div>
  `;
  dom.audioStartText = document.getElementById('audio-start-text');
  dom.audioStartHint = document.getElementById('audio-start-hint');
  const answerInput = dom.audioStartInner.querySelector('.boot-answer-input');
  let bootSheetSolved = false;
  const text = '2 더하기 2는 무엇입니까?';
  for (const char of Array.from(text)) {
    dom.audioStartText.textContent += char;
    await wait(char === ' ' ? 90 : 115);
  }
  const restore = () => {
    if (bootSheetSolved) return;
    bootSheetSolved = true;
    answerInput.disabled = true;
    enterBootScreen();
  };
  answerInput.addEventListener('input', () => {
    answerInput.value = answerInput.value.replace(/\D/g, '').slice(0, 1);
    if (answerInput.value === '4') restore();
  });
  answerInput.focus();
}

async function enterBootScreen() {
  try {
    await ensureAudio().resume();
  } catch (error) {
    console.warn('Audio unlock failed', error);
  }
  setBackground('SYSTEM_BOOT');
  crossfadeMusic(ASSETS.audio.SYSTEM_BOOT, { loop: true, volume: 0.5, duration: 1400 });
  dom.audioStartHint.classList.remove('hidden');
  await wait(900);
  dom.audioStartScreen.classList.add('hidden');
  dom.bootScreen.classList.remove('hidden');
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button && !button.disabled) uiClickBeep();
}, { capture: true });
document.addEventListener('pointerdown', resumeAudioContext, { capture: true });

dom.bootBtn.addEventListener('click', boot);
dom.rockyHelp.addEventListener('click', useRockyHelp);
window.addEventListener('resize', resizeFx);
document.addEventListener('fullscreenchange', () => {
  window.requestAnimationFrame(resizeFx);
});

preloadImages();
setBackground('BOOT_SHEET');
syncViewportHeight();
resizeFx();
spawnDust(60);
renderEvidenceDock();
animateFx();
initAudioStart();
