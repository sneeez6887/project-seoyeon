/* ═══════════════════════════════════════════════════════════════
   main.js — Operation: Cosmic Celebration
   Intro → Stage 0‑4 → Ending
═══════════════════════════════════════════════════════════════ */

'use strict';

// ────────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────────
const CORRECT_CODE = '0503';

const ASSETS = {
  BGM_INTRO: 'assets/intro.mp3',
  BGM_S01:   'assets/Stage_0&1.mp3',
  BGM_S2:    'assets/Stage_2.mp3',
  BGM_S3:    'assets/Stage_3.mp3',
  BGM_S4:    'assets/Stage_4.mp3',
  BGM_OUTRO: 'assets/outro.mp3',
  BG_INTRO:  'assets/intro.png',
  BG_S0:     'assets/stage0.png',
  BG_S0B:    'assets/stage0_bright.png',
  BG_MAP:    'assets/main_map.png',
  BG_S2:     'assets/stage2.png',
  BG_S3:     'assets/stage3.png',
  BG_S4:     'assets/stage4.png',
  BG_OUTRO:  'assets/outro.png',
};

const BGM_TRACKS = {
  intro:    ASSETS.BGM_INTRO,
  stage01:  ASSETS.BGM_S01,
  particle: ASSETS.BGM_S2,
  camera:   ASSETS.BGM_S3,
  stage4:   ASSETS.BGM_S4,
  outro:    ASSETS.BGM_OUTRO,
};

const MAP_IMAGE_SIZE = { w: 3072, h: 1536 };
const MAP_ZONE_POINTS = {
  zoneS2: { x: 865, y: 312 },
  zoneS3: { x: 2460, y: 234 },
  zoneS4: { x: 2046, y: 1126 },
};

const DIALOGUES = {
  s0: '친구! 깨어났다! 기쁘다!\n나 로키. 우리 우주선 사고 났다.\n아스트로파지가 빛을 먹고 있다.\n\'우리의 연구 데이터\'가 빛과 함께 사라지고 있다.\n나 슬프다. 우리 협동해야 한다!',
  s1: '시스템 복구 필요!\n친구, 너의 존재가 시작된 숫자를 입력해라.\n그것이 함선의 열쇠다!',
  s2: '이곳의 아스트로파지는 소리에 반응했다.\n소리를 내라 친구!\n우리 화음 맞추면 신호 강해진다.\n나 기다린다!',
  s3: '저기 봐라! 나쁜 아스트로파지, 회로 가렸다!\n밀어라! 흩어버려라!\n뒤에 데이터가 숨어 있다.\n아주 따뜻한 메모리다!',
  s4: '마지막이다!\n이 행성의 아스트로파지는\n친구의 특정 손모양에 반응했었다.\n지구인의 에너지는 \'심장\'에서 나온다고 들었다.\n그 모양을 만들어라!\n마지막이다. 나 믿는다, 친구!',
  ending: '성공!\n우주 전체가 이제 너의 날을 안다.\n나 로키, 친구 덕분에 행복하다.\n이제 지구로 돌아가라.\n그곳에 너를 기다리는 \'빛\'이 있다.\n안녕, 친구!',
};

// ────────────────────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────────────────────
const state = {
  currentStage: 'intro',
  audioCtx: null,           // Web Audio API (for Rocky beep SFX only)
  typewriterTimer: null,
  typewriterDone: false,
  stageCleared: { 1: false, 2: false, 3: false, 4: false },
};

// ────────────────────────────────────────────────────────────────
// DOM REFS
// ────────────────────────────────────────────────────────────────
const dom = {
  bgLayer:        document.getElementById('bg-layer'),
  whiteout:       document.getElementById('whiteout-overlay'),
  audioStart:     document.getElementById('screen-audio-start'),
  audioStartText: document.getElementById('audio-start-text'),
  audioStartHint: document.getElementById('audio-start-hint'),
  btnStart:       document.getElementById('btn-start'),

  // Stage 0
  rockyText:      document.getElementById('rocky-text'),
  cursorBlink:    document.getElementById('cursor-blink'),
  terminalFooter: document.getElementById('terminal-footer'),
  clickOverlay:   document.getElementById('stage0-click-overlay'),

  // Stage 1
  rockyTextS1:    document.getElementById('rocky-text-s1'),
  cursorBlinkS1:  document.getElementById('cursor-blink-s1'),
  pwTerminal:     document.getElementById('password-terminal'),
  pwInput:        document.getElementById('pw-input'),
  pwError:        document.getElementById('pw-error'),
  pwSuccess:      document.getElementById('pw-success'),
  noiseLines:     document.getElementById('noise-lines'),

  // Map
  zoneS2: document.getElementById('zone-s2'),
  zoneS3: document.getElementById('zone-s3'),
  zoneS4: document.getElementById('zone-s4'),
};

// ────────────────────────────────────────────────────────────────
// SCREEN / BACKGROUND HELPERS
// ────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const t = document.getElementById(id);
  if (t) t.classList.add('active');
}

function setBg(url) {
  dom.bgLayer.style.backgroundImage = `url('${url}')`;
}

function whiteOut(durMs = 600, holdMs = 300) {
  return new Promise(resolve => {
    dom.whiteout.style.transition = `opacity ${durMs}ms ease`;
    dom.whiteout.style.opacity = '1';
    dom.whiteout.classList.add('active');
    setTimeout(() => {
      resolve();
      setTimeout(() => {
        dom.whiteout.style.opacity = '0';
        dom.whiteout.classList.remove('active');
      }, holdMs);
    }, durMs);
  });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// ────────────────────────────────────────────────────────────────
// BGM ENGINE  —  Single <audio> element (guaranteed user-gesture play)
// ────────────────────────────────────────────────────────────────
const bgmEl = document.getElementById('bgm-audio');
let _bgmFadeTimer = null;
let _bgmToken = 0;
let _bgmTrackKey = null;

function normalizeAssetUrl(url) {
  return new URL(url, window.location.href).href;
}

function playBgmTrack(trackKey, fadeMs = 1200) {
  const url = BGM_TRACKS[trackKey];
  if (!url) {
    console.warn('Unknown BGM track:', trackKey);
    return Promise.resolve();
  }
  return crossfadeBgm(url, fadeMs, trackKey);
}

function crossfadeBgm(url, fadeMs = 1200, trackKey = url) {
  if (_bgmFadeTimer) { clearInterval(_bgmFadeTimer); _bgmFadeTimer = null; }
  const token = ++_bgmToken;
  const targetSrc = normalizeAssetUrl(url);

  return new Promise(resolve => {
    const STEPS = 20;
    const finish = () => { if (token === _bgmToken) resolve(); };

    const requestPlay = () => {
      const p = bgmEl.play();
      if (p) {
        p.catch(e => {
          if (token === _bgmToken) console.warn('BGM play failed:', e);
        });
      }
    };

    const switchAndFadeIn = () => {
      if (token !== _bgmToken) return;
      if (bgmEl.src !== targetSrc) bgmEl.src = targetSrc;
      _bgmTrackKey = trackKey;
      bgmEl.loop = true;
      bgmEl.volume = fadeMs <= 0 ? 1 : 0;
      requestPlay();
      if (fadeMs <= 0) {
        finish();
        return;
      }
      let j = 0;
      const dtIn = Math.max(fadeMs / 2, 300) / STEPS;
      const timer = setInterval(() => {
        if (token !== _bgmToken) {
          clearInterval(timer);
          return;
        }
        j++;
        bgmEl.volume = Math.min(1, j / STEPS);
        if (j >= STEPS) {
          clearInterval(timer);
          if (_bgmFadeTimer === timer) _bgmFadeTimer = null;
          bgmEl.volume = 1;
          finish();
        }
      }, dtIn);
      _bgmFadeTimer = timer;
    };

    if (_bgmTrackKey === trackKey && bgmEl.src === targetSrc) {
      bgmEl.loop = true;
      requestPlay();
      if (bgmEl.volume < 1 && fadeMs > 0) {
        let j = 0;
        const startVol = bgmEl.volume;
        const dtIn = Math.max(fadeMs / 2, 300) / STEPS;
        const timer = setInterval(() => {
          if (token !== _bgmToken) {
            clearInterval(timer);
            return;
          }
          j++;
          bgmEl.volume = Math.min(1, startVol + (1 - startVol) * (j / STEPS));
          if (j >= STEPS) {
            clearInterval(timer);
            if (_bgmFadeTimer === timer) _bgmFadeTimer = null;
            bgmEl.volume = 1;
            finish();
          }
        }, dtIn);
        _bgmFadeTimer = timer;
      } else {
        bgmEl.volume = 1;
        finish();
      }
    } else if (!bgmEl.src || bgmEl.paused || fadeMs <= 0) {
      switchAndFadeIn();
    } else {
      // Fade out current track then switch
      const startVol = bgmEl.volume || 1;
      const dtOut = Math.max(fadeMs / 2, 200) / STEPS;
      let i = 0;
      const timer = setInterval(() => {
        if (token !== _bgmToken) {
          clearInterval(timer);
          return;
        }
        i++;
        bgmEl.volume = Math.max(0, startVol * (1 - i / STEPS));
        if (i >= STEPS) {
          clearInterval(timer);
          if (_bgmFadeTimer === timer) _bgmFadeTimer = null;
          switchAndFadeIn();
        }
      }, dtOut);
      _bgmFadeTimer = timer;
    }
  });
}

// ────────────────────────────────────────────────────────────────
// WEB AUDIO — Rocky SFX only
// ────────────────────────────────────────────────────────────────
function ensureAudioCtx() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return state.audioCtx;
}

function playRockyBeep() {
  try {
    const ctx = ensureAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 400 + Math.random() * 400;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch(e) {}
}

// ────────────────────────────────────────────────────────────────
// TYPEWRITER
// ────────────────────────────────────────────────────────────────
function typeText(el, text, cursor = null, speedMs = 45) {
  return new Promise(resolve => {
    el.textContent = '';
    state.typewriterDone = false;
    if (cursor) cursor.style.display = 'none';
    let i = 0;
    function tick() {
      if (i >= text.length) {
        state.typewriterDone = true;
        if (cursor) cursor.style.display = 'inline';
        resolve();
        return;
      }
      const ch = text[i++];
      el.textContent += ch;
      if (!' \t\n。！？.,!?'.includes(ch)) playRockyBeep();
      const delay = '。！？.,!?\n'.includes(ch) ? speedMs * 8 : speedMs;
      state.typewriterTimer = setTimeout(tick, delay);
    }
    tick();
  });
}

// ────────────────────────────────────────────────────────────────
// NOISE LINES (Stage 1)
// ────────────────────────────────────────────────────────────────
function buildNoiseLines(container, count = 8) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.className = 'noise-line';
    line.style.animationDelay = `${(i / count) * 3}s`;
    container.appendChild(line);
  }
}

// ────────────────────────────────────────────────────────────────
// SLOT UNLOCK
// ────────────────────────────────────────────────────────────────
function unlockSlot(n) {
  const el = document.getElementById(`slot-${n}`);
  if (el) el.classList.remove('locked');
}

// ────────────────────────────────────────────────────────────────
// REWARD POPUP
// ────────────────────────────────────────────────────────────────
function showRewardPopup(mainText, subText, color = 'var(--neon-yellow)') {
  return new Promise(resolve => {
    const el = document.createElement('div');
    el.className = 'reward-popup';
    el.innerHTML = `
      <div class="reward-main" style="color:${color}">${mainText}</div>
      <div class="reward-sub">${subText}</div>
    `;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -50%) scale(1.08)';
      setTimeout(() => { document.body.removeChild(el); resolve(); }, 520);
    }, 2200);
  });
}

// ────────────────────────────────────────────────────────────────
// MAP ZONE MANAGEMENT
// ────────────────────────────────────────────────────────────────
function updateMapZones() {
  positionMapZones();
  if (state.stageCleared[1]) dom.zoneS2.classList.remove('locked');
  if (state.stageCleared[2]) dom.zoneS3.classList.remove('locked');
  if (state.stageCleared[3]) dom.zoneS4.classList.remove('locked');
}

function positionMapZones() {
  const scale = Math.max(
    window.innerWidth / MAP_IMAGE_SIZE.w,
    window.innerHeight / MAP_IMAGE_SIZE.h
  );
  const renderedW = MAP_IMAGE_SIZE.w * scale;
  const renderedH = MAP_IMAGE_SIZE.h * scale;
  const offsetX = (window.innerWidth - renderedW) / 2;
  const offsetY = (window.innerHeight - renderedH) / 2;

  Object.entries(MAP_ZONE_POINTS).forEach(([key, point]) => {
    const el = dom[key];
    if (!el) return;
    el.style.left = `${offsetX + point.x * scale}px`;
    el.style.top = `${offsetY + point.y * scale}px`;
  });
}

let mapZonesSetup = false;
function setupMapZones() {
  updateMapZones();
  if (mapZonesSetup) return;
  mapZonesSetup = true;

  dom.zoneS2.addEventListener('click', () => {
    if (state.stageCleared[1] && !state.stageCleared[2]) startStage2();
  });
  dom.zoneS3.addEventListener('click', () => {
    if (state.stageCleared[2] && !state.stageCleared[3]) startStage3();
  });
  dom.zoneS4.addEventListener('click', () => {
    if (state.stageCleared[3] && !state.stageCleared[4]) startStage4();
  });
}

// ════════════════════════════════════════════════════════════════
// INTRO → STAGE 0 → STAGE 1
// ════════════════════════════════════════════════════════════════

async function initIntro() {
  state.currentStage = 'intro';
  setBg(ASSETS.BG_INTRO);
  showScreen('screen-intro');
  playBgmTrack('intro', 0);
}

async function initAudioStart() {
  state.currentStage = 'audio-start';
  dom.bgLayer.style.backgroundImage = '';
  showScreen('screen-audio-start');

  const text = '2 더하기 2는 무엇입니까?';
  dom.audioStartText.textContent = '';
  dom.audioStartHint.style.display = 'none';

  for (let i = 0; i < text.length; i++) {
    dom.audioStartText.textContent += text[i];
    await wait(text[i] === ' ' ? 90 : 115);
  }
  dom.audioStartHint.style.display = '';
}

async function enterIntroFromAudioStart() {
  if (state.currentStage !== 'audio-start') return;
  try { ensureAudioCtx().resume(); } catch(e) {}
  await playBgmTrack('intro', 0);
  await initIntro();
}

async function startStage0() {
  state.currentStage = 'stage0';
  setBg(ASSETS.BG_S0);
  showScreen('screen-stage0');
  playBgmTrack('stage01', 1200);

  dom.terminalFooter.style.display = 'none';
  dom.clickOverlay.style.display = 'none';
  dom.cursorBlink.style.display = 'none';

  await typeText(dom.rockyText, DIALOGUES.s0, dom.cursorBlink);

  dom.terminalFooter.style.display = '';
  dom.clickOverlay.style.display = '';
  dom.clickOverlay.addEventListener('click', goToStage1, { once: true });
}

async function goToStage1() {
  state.currentStage = 'stage1';
  showScreen('screen-stage1');
  dom.cursorBlinkS1.style.display = 'none';
  await typeText(dom.rockyTextS1, DIALOGUES.s1, dom.cursorBlinkS1);

  buildNoiseLines(dom.noiseLines, 8);
  dom.pwTerminal.style.display = '';
  dom.pwTerminal.style.opacity = '0';
  dom.pwTerminal.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    dom.pwTerminal.style.opacity = '1';
  }));
  dom.pwInput.focus();
}

async function checkPassword() {
  const val = dom.pwInput.value.trim();
  if (val !== CORRECT_CODE) {
    dom.pwError.style.display = '';
    dom.pwInput.value = '';
    let sh = 0;
    const iv = setInterval(() => {
      dom.pwTerminal.style.transform =
        `translate(-50%, -50%) translateX(${sh % 2 === 0 ? -7 : 7}px)`;
      if (++sh > 7) { clearInterval(iv); dom.pwTerminal.style.transform = 'translate(-50%, -50%)'; }
    }, 45);
    setTimeout(() => { dom.pwError.style.display = 'none'; }, 1800);
    dom.pwInput.focus();
    return;
  }

  dom.pwError.style.display = 'none';
  dom.pwSuccess.style.display = '';
  dom.pwInput.disabled = true;

  await wait(600);
  setBg(ASSETS.BG_S0B);

  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;z-index:800;background:rgba(255,255,210,0.4);pointer-events:none;transition:opacity 0.9s ease;opacity:1;';
  document.body.appendChild(flash);
  setTimeout(() => { flash.style.opacity = '0'; }, 80);
  setTimeout(() => { document.body.removeChild(flash); }, 1000);

  await wait(2000);
  await whiteOut(700, 400);
  setBg(ASSETS.BG_MAP);
  showScreen('screen-mainmap');
  state.currentStage = 'mainmap';
  state.stageCleared[1] = true;
  unlockSlot(1);
  setupMapZones();
}

// ════════════════════════════════════════════════════════════════
// STAGE 2 — MIC + WAVEFORM
// ════════════════════════════════════════════════════════════════
let s2AnimFrame = null;
let s2MicStream = null;

async function startStage2() {
  state.currentStage = 'stage2';
  setBg(ASSETS.BG_S2);
  showScreen('screen-stage2');

  // Start Stage 2 BGM when entering the mission
  playBgmTrack('particle', 1200);

  const el = document.getElementById('rocky-text-s2');
  const cu = document.getElementById('cursor-blink-s2');
  await typeText(el, DIALOGUES.s2, cu);

  document.getElementById('stage2-hud').style.display = '';
  await startMicCapture();
}

async function startMicCapture() {
  try {
    s2MicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch(e) {
    console.warn('Mic denied — auto-clearing stage 2 in 6s');
    setTimeout(() => { if (state.currentStage === 'stage2') clearStage2(); }, 6000);
    return;
  }

  const ctx = ensureAudioCtx();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(s2MicStream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  src.connect(analyser);

  const bufLen   = analyser.frequencyBinCount;
  const timeData = new Float32Array(bufLen);
  const freqData = new Uint8Array(bufLen);

  const canvas = document.getElementById('waveform-canvas');
  const c = canvas.getContext('2d');
  let holdTime = 0, lastTs = null, done = false;
  const THRESH = -35;

  function frame(ts) {
    if (state.currentStage !== 'stage2' || done) return;
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    analyser.getFloatTimeDomainData(timeData);
    analyser.getByteFrequencyData(freqData);

    let sum = 0;
    for (let i = 0; i < bufLen; i++) sum += timeData[i] * timeData[i];
    const db = 20 * Math.log10(Math.sqrt(sum / bufLen) || 1e-6);

    if (db > THRESH) holdTime += dt;
    else holdTime = Math.max(0, holdTime - dt * 0.35);

    const pct = Math.min(holdTime / 3, 1);
    const fill  = document.getElementById('resonance-fill');
    const label = document.getElementById('resonance-pct');
    if (fill)  fill.style.width = `${pct * 100}%`;
    if (label) label.textContent = `${Math.round(pct * 100)}%`;

    if (pct >= 1 && !done) { done = true; clearStage2(); return; }

    c.clearRect(0, 0, canvas.width, canvas.height);
    const cy = canvas.height / 2;
    const intensity = Math.max(0, Math.min(1, (db - THRESH + 25) / 35));

    c.strokeStyle = 'rgba(0,245,255,0.1)';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, cy); c.lineTo(canvas.width, cy); c.stroke();

    const col = intensity > 0.4 ? `rgba(57,255,20,${0.6 + intensity * 0.4})` : `rgba(0,245,255,${0.5 + intensity * 0.4})`;
    c.strokeStyle = col;
    c.lineWidth = 2.5;
    c.shadowColor = col;
    c.shadowBlur = intensity > 0.4 ? 18 : 6;
    c.beginPath();
    const sw = canvas.width / bufLen;
    for (let i = 0; i < bufLen; i++) {
      const y = cy + timeData[i] * cy * 0.75;
      i === 0 ? c.moveTo(0, y) : c.lineTo(i * sw, y);
    }
    c.stroke();
    c.shadowBlur = 0;

    const barCount = 52;
    const barW = canvas.width / barCount;
    const maxH = canvas.height * 0.18;
    for (let i = 0; i < barCount; i++) {
      const idx = Math.floor((i / barCount) * bufLen);
      const h   = (freqData[idx] / 255) * maxH * (1 + intensity * 0.6);
      c.fillStyle = `rgba(0,245,255,${0.2 + intensity * 0.55})`;
      c.fillRect(i * barW + 1, canvas.height - h, barW - 2, h);
    }

    s2AnimFrame = requestAnimationFrame(frame);
  }

  s2AnimFrame = requestAnimationFrame(frame);
}

async function clearStage2() {
  if (s2AnimFrame) { cancelAnimationFrame(s2AnimFrame); s2AnimFrame = null; }
  if (s2MicStream) { s2MicStream.getTracks().forEach(t => t.stop()); s2MicStream = null; }

  await showRewardPopup('✦ HAPPY ✦', 'HARMONY FRAGMENT RESTORED', 'var(--neon-cyan)');
  // BGM_S2 already playing — no crossfade needed here
  state.stageCleared[2] = true;
  unlockSlot(2);

  await wait(400);
  await whiteOut(700, 300);
  setBg(ASSETS.BG_MAP);
  showScreen('screen-mainmap');
  state.currentStage = 'mainmap';
  updateMapZones();
}

// ════════════════════════════════════════════════════════════════
// STAGE 3 — RED PARTICLE PUSH SYSTEM
// ════════════════════════════════════════════════════════════════
let s3Cleared     = false;
let s3AnimFrame   = null;
let s3Particles   = [];
let s3TotalCount  = 0;
let s3MouseX      = -9999;
let s3MouseY      = -9999;

async function startStage3() {
  state.currentStage = 'stage3';
  s3Cleared = false;
  s3MouseX = -9999;
  s3MouseY = -9999;
  setBg(ASSETS.BG_S3);
  showScreen('screen-stage3');

  // Start Stage 3 BGM when entering the mission
  playBgmTrack('particle', 1200);

  // Enable scratch canvas pointer-events only while stage3 is active
  const canvas = document.getElementById('scratch-canvas');
  canvas.style.pointerEvents = 'all';
  canvas.style.cursor = 'none';

  initS3Particles(canvas);

  const el = document.getElementById('rocky-text-s3');
  const cu = document.getElementById('cursor-blink-s3');
  await typeText(el, DIALOGUES.s3, cu);
  document.getElementById('scratch-hud').style.display = '';
}

function initS3Particles(canvas) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width  = W;
  canvas.height = H;

  s3Particles = [];
  // Grid layout for full-screen coverage: ~720 particles
  const COLS = 27, ROWS = 19;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const jx = (Math.random() - 0.5) * (W / COLS) * 0.6;
      const jy = (Math.random() - 0.5) * (H / ROWS) * 0.6;
      const color = redParticleColor();
      s3Particles.push({
        x:  (c + 0.5) / COLS * W + jx,
        y:  (r + 0.5) / ROWS * H + jy,
        vx: 0, vy: 0,
        r:  randomRange(2, 4.6),
        cr: color.r,
        cg: color.g,
        cb: color.b,
        alive: true,
      });
    }
  }
  s3TotalCount = s3Particles.length;

  // Attach events at document level so ALL areas of screen respond,
  // regardless of z-index stacking (canvas, Rocky panel, etc.)
  document.addEventListener('pointermove', s3OnPointerMove, true);
  document.addEventListener('mousemove',  s3OnMouseMove,  true);
  document.addEventListener('touchmove',  s3OnTouchMove,  { passive: false, capture: true });
  document.addEventListener('touchstart', s3OnTouchStart, { passive: false, capture: true });

  // Start animation loop
  if (s3AnimFrame) cancelAnimationFrame(s3AnimFrame);
  s3AnimFrame = requestAnimationFrame(s3Loop);
}

function s3OnMouseMove(e) {
  s3MouseX = e.clientX;
  s3MouseY = e.clientY;
}
function s3OnPointerMove(e) {
  s3MouseX = e.clientX;
  s3MouseY = e.clientY;
}
function s3OnTouchMove(e) {
  e.preventDefault();
  s3MouseX = e.touches[0].clientX;
  s3MouseY = e.touches[0].clientY;
}
function s3OnTouchStart(e) {
  e.preventDefault();
  s3MouseX = e.touches[0].clientX;
  s3MouseY = e.touches[0].clientY;
}

const PUSH_RADIUS   = 130;  // pixels around cursor
const PUSH_STRENGTH = 380;  // push acceleration

function s3Loop(ts) {
  if (state.currentStage !== 'stage3' || s3Cleared) return;

  const canvas = document.getElementById('scratch-canvas');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Clear with slight trail for motion blur feel
  ctx.clearRect(0, 0, W, H);

  let alive = 0;

  // ── Glow pass (all outer glows first, then cores) ──
  ctx.save();

  // Pass 1: outer glow (large, low opacity)
  for (const p of s3Particles) {
    if (!p.alive) continue;

    // Apply push force from cursor
    const dx = p.x - s3MouseX;
    const dy = p.y - s3MouseY;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < PUSH_RADIUS * PUSH_RADIUS && dist2 > 0.01) {
      const dist = Math.sqrt(dist2);
      const force = (1 - dist / PUSH_RADIUS) * PUSH_STRENGTH;
      p.vx += (dx / dist) * force * 0.016;  // ≈ 60fps Δt
      p.vy += (dy / dist) * force * 0.016;
    }

    // Damping
    p.vx *= 0.93;
    p.vy *= 0.93;

    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Mark off-screen
    if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) {
      p.alive = false;
      continue;
    }

    alive++;
  }

  // Draw outer glow (batch by setting globalAlpha once)
  ctx.globalAlpha = 0.28;
  for (const p of s3Particles) {
    if (!p.alive) continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${p.cr}, ${p.cg}, ${p.cb})`;
    ctx.fill();
  }

  // Draw mid glow
  ctx.globalAlpha = 0.5;
  for (const p of s3Particles) {
    if (!p.alive) continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 1.45, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${Math.min(255, p.cr + 24)}, ${Math.min(255, p.cg + 18)}, ${Math.min(255, p.cb + 20)})`;
    ctx.fill();
  }

  // Draw bright core
  ctx.globalAlpha = 0.95;
  for (const p of s3Particles) {
    if (!p.alive) continue;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 0.58, 0, Math.PI * 2);
    ctx.fillStyle = '#fffaf7';
    ctx.fill();
  }

  // Draw cursor indicator (cyan ring where cursor is)
  if (s3MouseX > 0 && s3MouseY > 0) {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(s3MouseX, s3MouseY, PUSH_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(s3MouseX, s3MouseY, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5ff';
    ctx.fill();
  }

  ctx.restore();

  // Update progress HUD
  const pushedPct = Math.round((1 - alive / s3TotalCount) * 100);
  const pctEl = document.getElementById('scratch-pct');
  if (pctEl) pctEl.textContent = pushedPct;

  // Envelope opacity grows as particles clear
  const envWrap = document.getElementById('s3-envelope-wrap');
  if (envWrap) envWrap.style.opacity = String(Math.min(1, pushedPct / 40));

  // Clear condition: 70% pushed off screen
  if (alive / s3TotalCount <= 0.30 && !s3Cleared) {
    s3Cleared = true;
    clearStage3(canvas);
    return;
  }

  s3AnimFrame = requestAnimationFrame(s3Loop);
}

async function clearStage3(canvas) {
  // Disable pointer-events & reset cursor
  canvas.style.pointerEvents = 'none';
  canvas.style.cursor = '';

  // Remove document-level event listeners
  document.removeEventListener('pointermove', s3OnPointerMove, true);
  document.removeEventListener('mousemove',  s3OnMouseMove, true);
  document.removeEventListener('touchmove',  s3OnTouchMove, true);
  document.removeEventListener('touchstart', s3OnTouchStart, true);

  // Scatter remaining particles off screen quickly
  s3Particles.forEach(p => {
    if (!p.alive) return;
    const angle = Math.atan2(p.y - window.innerHeight / 2, p.x - window.innerWidth / 2);
    p.vx += Math.cos(angle) * 30;
    p.vy += Math.sin(angle) * 30;
  });
  await wait(600);

  // Clear canvas
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  await showRewardPopup('♡ WARMTH ♡', 'WARMTH FRAGMENT RESTORED', 'var(--neon-yellow)');
  playBgmTrack('particle', 1500);
  state.stageCleared[3] = true;
  unlockSlot(3);

  await wait(400);
  await whiteOut(700, 300);
  setBg(ASSETS.BG_MAP);
  showScreen('screen-mainmap');
  state.currentStage = 'mainmap';
  updateMapZones();
}

// ════════════════════════════════════════════════════════════════
// STAGE 4 — HAND TRACKING (ml5.handPose + particles)
// ════════════════════════════════════════════════════════════════
let s4Cleared      = false;
let s4AnimFrame    = null;
let s4HandResults  = [];
let s4HeartHold    = 0;
let s4WebcamStream = null;
let s4HandPose     = null;
let s4Particles    = [];
let s4LastTs       = null;

async function startStage4() {
  state.currentStage = 'stage4';
  s4Cleared = false; s4HeartHold = 0; s4HandResults = [];
  setBg(ASSETS.BG_S4);
  showScreen('screen-stage4');
  playBgmTrack('camera', 1200);
  prepareEndingTargets();

  const el = document.getElementById('rocky-text-s4');
  const cu = document.getElementById('cursor-blink-s4');
  await typeText(el, DIALOGUES.s4, cu);
  document.getElementById('heart-gauge').style.display = '';

  await setupWebcam();
  initS4Particles();
  s4LastTs = null;
  s4AnimFrame = requestAnimationFrame(s4Loop);
}

async function setupWebcam() {
  const video = document.getElementById('webcam-video');
  try {
    s4WebcamStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = s4WebcamStream;
    await new Promise(res => video.addEventListener('loadedmetadata', res, { once: true }));

    if (typeof ml5 !== 'undefined') {
      s4HandPose = ml5.handPose({ flipped: true });
      s4HandPose.detectStart(video, results => { s4HandResults = results || []; });
    }
  } catch(e) {
    console.warn('Webcam unavailable:', e);
    const gauge = document.getElementById('heart-gauge');
    if (gauge) {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn';
      btn.style.cssText = 'margin-top:0.8rem;font-size:0.4rem;padding:0.4rem 0.8rem;';
      btn.textContent = '[ 카메라 없이 진행 ]';
      btn.addEventListener('click', () => { if (!s4Cleared) { s4Cleared = true; doS4Clear(); } });
      gauge.appendChild(btn);
    }
  }
}

function initS4Particles() {
  s4Particles = [];
  const W = window.innerWidth, H = window.innerHeight;
  for (let i = 0; i < 130; i++) {
    const color = redParticleColor();
    s4Particles.push({
      x: Math.random() * W,   y: Math.random() * H,
      vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3,
      size: randomRange(1.3, 4.2),
      r: color.r,
      g: color.g,
      b: color.b,
      alpha: 0.55 + Math.random() * 0.45,
    });
  }
}

function heartTargets(count, cx, cy, scale) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i / count) * Math.PI * 2;
    return {
      x: cx + scale * 16 * Math.pow(Math.sin(t), 3),
      y: cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)),
    };
  });
}

function s4Loop(ts) {
  if (state.currentStage !== 'stage4' || s4Cleared) return;
  if (!s4LastTs) s4LastTs = ts;
  const dt = Math.min((ts - s4LastTs) / 1000, 0.1);
  s4LastTs = ts;

  const pCanvas = document.getElementById('particle-s4-canvas');
  const hCanvas = document.getElementById('handpose-canvas');
  if (!pCanvas || !hCanvas) return;

  const W = window.innerWidth, H = window.innerHeight;
  if (pCanvas.width !== W || pCanvas.height !== H) {
    pCanvas.width = W; pCanvas.height = H;
  }
  if (hCanvas.width !== W || hCanvas.height !== H) {
    hCanvas.width = W; hCanvas.height = H;
  }

  const pc = pCanvas.getContext('2d');
  const hc = hCanvas.getContext('2d');
  pc.clearRect(0, 0, W, H);
  hc.clearRect(0, 0, W, H);

  const heartScore = calcHeartScore(s4HandResults);
  if (heartScore > 0.5) s4HeartHold += dt;
  else s4HeartHold = Math.max(0, s4HeartHold - dt * 0.4);

  const holdPct = Math.min(s4HeartHold / 2.5, 1);
  const gFill = document.getElementById('heart-gauge-fill');
  const gPct  = document.getElementById('heart-gauge-pct');
  if (gFill) gFill.style.width = `${holdPct * 100}%`;
  if (gPct)  gPct.textContent  = `${Math.round(holdPct * 100)}%`;

  if (holdPct >= 1 && !s4Cleared) { s4Cleared = true; doS4Clear(); return; }

  const converging = heartScore > 0.5;
  const cx = W / 2, cy = H * 0.4;
  const htargets = heartTargets(s4Particles.length, cx, cy, 11);

  s4Particles.forEach((p, i) => {
    if (converging) {
      const { x: tx, y: ty } = htargets[i];
      p.vx += (tx - p.x) * 0.07;
      p.vy += (ty - p.y) * 0.07;
      p.vx *= 0.82; p.vy *= 0.82;
    } else {
      p.vx += (Math.random() - 0.5) * 0.55;
      p.vy += (Math.random() - 0.5) * 0.55;
      p.vx = Math.max(-4, Math.min(4, p.vx));
      p.vy = Math.max(-4, Math.min(4, p.vy));
    }
    p.x += p.vx; p.y += p.vy;
    if (p.x < -20) p.x = W + 20;
    if (p.x > W + 20) p.x = -20;
    if (p.y < -20) p.y = H + 20;
    if (p.y > H + 20) p.y = -20;

    const size = p.size * (converging ? 1.25 : 1);
    pc.beginPath();
    pc.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
    pc.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha * 0.28})`;
    pc.shadowColor = `rgb(${p.r},${p.g},${p.b})`;
    pc.shadowBlur = converging ? 16 : 6;
    pc.fill();
    pc.shadowBlur = 0;

    pc.beginPath();
    pc.arc(p.x, p.y, size * 0.72, 0, Math.PI * 2);
    pc.fillStyle = `rgba(255,250,247,${p.alpha * 0.95})`;
    pc.fill();
    pc.shadowBlur = 0;
  });

  drawHandSkeleton(hc, s4HandResults);
  s4AnimFrame = requestAnimationFrame(s4Loop);
}

function calcHeartScore(hands) {
  if (!hands || hands.length < 2) return 0;
  const tips = hands.map(h => h.keypoints && h.keypoints[8]).filter(Boolean);
  if (tips.length < 2) return 0;
  const dist = Math.hypot(tips[0].x - tips[1].x, tips[0].y - tips[1].y);
  return Math.max(0, Math.min(1, 1 - (dist - 55) / 130));
}

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
];

function drawHandSkeleton(ctx, hands) {
  if (!hands || hands.length === 0) return;
  hands.forEach(hand => {
    const kp = hand.keypoints;
    if (!kp) return;
    ctx.strokeStyle = 'rgba(0,245,255,0.55)';
    ctx.lineWidth = 2;
    HAND_CONNECTIONS.forEach(([a, b]) => {
      if (kp[a] && kp[b]) {
        ctx.beginPath();
        ctx.moveTo(kp[a].x, kp[a].y);
        ctx.lineTo(kp[b].x, kp[b].y);
        ctx.stroke();
      }
    });
    kp.forEach((pt, i) => {
      if (!pt) return;
      const tip = [4, 8, 12, 16, 20].includes(i);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, tip ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = tip ? 'rgba(255,45,110,0.9)' : 'rgba(57,255,20,0.8)';
      ctx.fill();
    });
  });
}

async function doS4Clear() {
  if (s4AnimFrame) { cancelAnimationFrame(s4AnimFrame); s4AnimFrame = null; }
  if (s4WebcamStream) { s4WebcamStream.getTracks().forEach(t => t.stop()); s4WebcamStream = null; }
  try { if (s4HandPose) s4HandPose.detectStop(); } catch(e) {}
  s4HandPose = null;
  prepareEndingTargets();

  await wait(800);
  await showRewardPopup('💗 HEART 💗', 'HEART FRAGMENT RESTORED', 'var(--neon-pink)');
  playBgmTrack('camera', 1500);
  state.stageCleared[4] = true;
  unlockSlot(4);

  await wait(3000);
  startEnding();
}

// ════════════════════════════════════════════════════════════════
// ENDING — FIREWORKS + ROCKY + STAR WARS SCROLL
// ════════════════════════════════════════════════════════════════
let endingP5 = null;
let endingTargetsCache = null;
let endingTargetsCacheSize = null;
let endingTargetsPreparing = false;

async function startEnding() {
  state.currentStage = 'ending';
  await whiteOut(700, 400);
  setBg(ASSETS.BG_OUTRO);
  showScreen('screen-ending');
  playBgmTrack('outro', 2000);

  launchFireworksSketch();

  await wait(5000);

  const panel = document.getElementById('rocky-panel-ending');
  panel.style.display = '';
  const el = document.getElementById('rocky-text-ending');
  const cu = document.getElementById('cursor-blink-ending');
  await typeText(el, DIALOGUES.ending, cu);

  await wait(2500);
  panel.style.display = 'none';

  const wrap = document.getElementById('star-wars-wrap');
  wrap.style.display = '';
  const persp = wrap.querySelector('.star-wars-perspective');
  persp.style.animation = 'none';
  persp.offsetHeight;
  persp.style.animation = '';
}

function launchFireworksSketch() {
  const container = document.getElementById('fireworks-container');
  container.innerHTML = '';

  if (endingP5 && typeof endingP5.stop === 'function') endingP5.stop();

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
  container.appendChild(canvas);

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
  if (!gl) {
    console.warn('WebGL unavailable; ending particles skipped.');
    endingP5 = null;
    return;
  }

  const program = createParticleProgram(gl);
  const aPosition = gl.getAttribLocation(program, 'a_position');
  const aColor = gl.getAttribLocation(program, 'a_color');
  const aSize = gl.getAttribLocation(program, 'a_size');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');

  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();
  const sizeBuffer = gl.createBuffer();

  let positions, velocities, targets, colors, sizes, count;
  let phase = 'fireworks';
  let phaseTimer = 0;
  let lastTs = 0;
  let raf = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    initParticles(w, h);
  }

  function initParticles(w, h) {
    const targetList = getEndingTargets(w, h);
    count = Math.min(targetList.length, 1700);
    positions = new Float32Array(count * 2);
    velocities = new Float32Array(count * 2);
    targets = new Float32Array(count * 2);
    colors = new Float32Array(count * 3);
    sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const centerX = randomRange(w * 0.18, w * 0.82);
      const centerY = randomRange(h * 0.12, h * 0.52);
      const angle = Math.random() * Math.PI * 2;
      const speed = randomRange(7, 20);
      const color = redParticleColor();
      const p2 = i * 2;
      const p3 = i * 3;

      positions[p2] = centerX;
      positions[p2 + 1] = centerY;
      velocities[p2] = Math.cos(angle) * speed;
      velocities[p2 + 1] = Math.sin(angle) * speed - randomRange(2, 8);
      targets[p2] = targetList[i].x;
      targets[p2 + 1] = targetList[i].y;
      colors[p3] = color.r / 255;
      colors[p3 + 1] = color.g / 255;
      colors[p3 + 2] = color.b / 255;
      sizes[i] = randomRange(3, 7);
    }

    phase = 'fireworks';
    phaseTimer = 0;
    lastTs = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 16.667, 2);
    phaseTimer += ts - lastTs;
    lastTs = ts;
    if (phaseTimer > 4800 && phase === 'fireworks') phase = 'converge';

    for (let i = 0; i < count; i++) {
      const idx = i * 2;
      if (phase === 'fireworks') {
        velocities[idx] *= Math.pow(0.965, dt);
        velocities[idx + 1] = velocities[idx + 1] * Math.pow(0.965, dt) + 0.16 * dt;
      } else {
        const dx = targets[idx] - positions[idx];
        const dy = targets[idx + 1] - positions[idx + 1];
        velocities[idx] = (velocities[idx] + dx * 0.09 * dt) * Math.pow(0.8, dt);
        velocities[idx + 1] = (velocities[idx + 1] + dy * 0.09 * dt) * Math.pow(0.8, dt);
        if (Math.abs(dx) < 1.2 && Math.abs(dy) < 1.2) {
          positions[idx] = targets[idx];
          positions[idx + 1] = targets[idx + 1];
          velocities[idx] = 0;
          velocities[idx + 1] = 0;
        }
      }
      positions[idx] += velocities[idx] * dt;
      positions[idx + 1] += velocities[idx + 1] * dt;
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uResolution, window.innerWidth, window.innerHeight);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, positions);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.enableVertexAttribArray(aSize);
    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, count);
    raf = requestAnimationFrame(frame);
  }

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(frame);

  endingP5 = {
    stop() {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}

function prepareEndingTargets() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (hasEndingTargetCache(w, h) || endingTargetsPreparing) return;

  endingTargetsPreparing = true;
  const build = () => {
    if (hasEndingTargetCache(w, h)) {
      endingTargetsPreparing = false;
      return;
    }
    endingTargetsCache = sampleBirthdayTargets(w, h);
    endingTargetsCacheSize = { w, h };
    endingTargetsPreparing = false;
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(build, { timeout: 1600 });
  } else {
    window.setTimeout(build, 0);
  }
}

function getEndingTargets(w, h) {
  if (!hasEndingTargetCache(w, h)) {
    endingTargetsCache = sampleBirthdayTargets(w, h);
    endingTargetsCacheSize = { w, h };
    endingTargetsPreparing = false;
  }
  return endingTargetsCache;
}

function hasEndingTargetCache(w, h) {
  return endingTargetsCache
    && endingTargetsCacheSize
    && endingTargetsCacheSize.w === w
    && endingTargetsCacheSize.h === h;
}

function sampleBirthdayTargets(W, H) {
  const lineSize = Math.max(30, Math.min(W * 0.052, 68));
  const y1 = H * 0.38;
  const y2 = H * 0.52;
  const targets = sampleTextPixels([
    { text: 'Happy Birthday!', x: W / 2, y: y1, size: lineSize },
    { text: 'SeoYeon', x: W / 2 - lineSize * 0.75, y: y2, size: lineSize },
  ], W, H);

  const heartCx = W / 2 + lineSize * 2.35;
  const heartCy = y2 + lineSize * 0.05;
  const heartScale = lineSize * 0.34;
  for (let yy = -1.25; yy <= 1.35; yy += 0.12) {
    for (let xx = -1.35; xx <= 1.35; xx += 0.12) {
      const v = Math.pow(xx * xx + yy * yy - 1, 3) - xx * xx * Math.pow(yy, 3);
      if (v <= 0) {
        targets.push({
          x: heartCx + xx * heartScale + randomRange(-1.4, 1.4),
          y: heartCy - yy * heartScale + randomRange(-1.4, 1.4),
        });
      }
    }
  }

  return shuffleTargets(targets);
}

function sampleTextPixels(text, W, H) {
  const g = document.createElement('canvas');
  g.width = W;
  g.height = H;
  const ctx = g.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = Array.isArray(text)
    ? text
    : text.split('\n').map((line, i, arr) => ({
        text: line,
        x: W / 2,
        y: H * 0.42 + (i - (arr.length - 1) / 2) * Math.max(28, Math.min(W * 0.052, 66)) * 1.7,
        size: Math.max(28, Math.min(W * 0.052, 66)),
      }));

  lines.forEach(line => {
    ctx.font = `700 ${line.size}px Arial, sans-serif`;
    ctx.fillText(line.text, line.x, line.y);
  });

  const pix = ctx.getImageData(0, 0, W, H).data;
  const targets = [];
  const step = 4;
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (pix[((y * W + x) * 4)] > 100) targets.push({ x, y });
    }
  }

  return shuffleTargets(targets);
}

function shuffleTargets(targets) {
  for (let i = targets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }
  return targets;
}

function redParticleColor() {
  const palette = [
    { r: 219, g: 70,  b: 95  }, // #DB465F
    { r: 195, g: 39,  b: 65  }, // #C32741
    { r: 219, g: 70,  b: 95  }, // #DB465F
    { r: 228, g: 117, b: 135 }, // #E47587
  ];
  const base = palette[Math.floor(Math.random() * palette.length)];
  const jitter = () => Math.floor(randomRange(-5, 6));
  return {
    r: Math.max(0, Math.min(255, base.r + jitter())),
    g: Math.max(0, Math.min(255, base.g + jitter())),
    b: Math.max(0, Math.min(255, base.b + jitter())),
  };
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function createParticleProgram(gl) {
  const vertexSrc = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    attribute float a_size;
    uniform vec2 u_resolution;
    varying vec3 v_color;
    void main() {
      vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
      gl_Position = vec4(clip * vec2(1.0, -1.0), 0.0, 1.0);
      gl_PointSize = a_size;
      v_color = a_color;
    }
  `;
  const fragmentSrc = `
    precision mediump float;
    varying vec3 v_color;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      float glow = smoothstep(0.5, 0.0, d);
      float core = smoothstep(0.2, 0.0, d);
      vec3 coreColor = vec3(1.0, 0.98, 0.97);
      vec3 color = mix(v_color * 0.72, coreColor, core);
      gl_FragColor = vec4(color, glow * 0.9);
    }
  `;
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Particle shader link failed');
  }
  return program;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Particle shader compile failed');
  }
  return shader;
}

// ════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ════════════════════════════════════════════════════════════════

dom.btnStart.addEventListener('click', async () => {
  // Unlock Web Audio for Rocky beeps
  try { ensureAudioCtx().resume(); } catch(e) {}

  // Play intro BGM immediately inside the user gesture context.
  playBgmTrack('intro', 0);

  // Fullscreen (non-blocking)
  try { document.documentElement.requestFullscreen(); } catch(e) {}

  await wait(1500);
  await startStage0();
});

dom.pwInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); checkPassword(); }
});
dom.pwInput.addEventListener('input', () => {
  dom.pwInput.value = dom.pwInput.value.replace(/\D/g, '').slice(0, 4);
  dom.pwError.style.display = 'none';
});

// ════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  initAudioStart();
  dom.audioStart.addEventListener('click', enterIntroFromAudioStart);
});

window.addEventListener('resize', () => {
  if (state.currentStage === 'mainmap') positionMapZones();
});
