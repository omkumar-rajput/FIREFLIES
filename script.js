/* ============================================================
   PERSONALIZE HERE
   ============================================================ */
const YOUR_NAME = "Omkumar";

/* ============================================================
   PARTICLE ENGINE — swaps behavior per theme
   ============================================================ */
const canvas = document.getElementById('ambient');
const ctx = canvas.getContext('2d');
let w, h, particles = [], fireworks = [];
let currentTheme = 'ember';
let rafId = null;

const THEME_CONFIG = {
  ember:     { mode:'dot',   color:'232,179,76', count:[26,46], dir:'up',   speed:[0.05,0.3] },
  balloons:  { mode:'emoji', glyphs:['🎈'],        count:[8,12],  dir:'up',   speed:[0.15,0.35], size:[22,32] },
  planes:    { mode:'emoji', glyphs:['✈️'],        count:[4,6],   dir:'side', speed:[0.4,0.8],  size:[18,26] },
  hourglass: { mode:'dot',   color:'232,179,76',   count:[16,22], dir:'down', speed:[0.4,0.9] },
  rain:      { mode:'emoji', glyphs:['💧'],        count:[16,24], dir:'down', speed:[1.2,2.2],  size:[12,18] },
  hearts:    { mode:'emoji', glyphs:['💗','💕','💖'], count:[14,20], dir:'drift', speed:[0.15,0.3], size:[16,26] },
  stars:     { mode:'emoji', glyphs:['✨','⭐'],   count:[18,26], dir:'twinkle', speed:[0,0], size:[12,20] },
  fireflies: { mode:'dot',   color:'168,224,140',  count:[20,30], dir:'drift', speed:[0.08,0.2] },
  petals:    { mode:'emoji', glyphs:['🌸'],        count:[12,18], dir:'down', speed:[0.3,0.6],  size:[16,24] },
  candle:    { mode:'dot',   color:'232,179,76',   count:[18,28], dir:'up',   speed:[0.06,0.2] },
  bloom:     { mode:'emoji', glyphs:['✨','🌿'],   count:[10,16], dir:'drift', speed:[0.1,0.25], size:[12,18] },
  fireworks: { mode:'burst' }
};

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function seedParticles(theme){
  const cfg = THEME_CONFIG[theme];
  particles = [];
  if (!cfg || cfg.mode === 'burst') return;
  const n = Math.round(cfg.count[0] + Math.random() * (cfg.count[1] - cfg.count[0]));
  for (let i = 0; i < n; i++){
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: cfg.size ? (cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0])) : (Math.random() * 1.6 + 0.6),
      speed: cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0]),
      seed: Math.random() * 1000,
      glyph: cfg.glyphs ? cfg.glyphs[Math.floor(Math.random() * cfg.glyphs.length)] : null,
      alpha: Math.random() * 0.5 + 0.3
    });
  }
}

function drawDot(p, color){
  const r = (p.size || 3) * 4;
  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
  grad.addColorStop(0, `rgba(${color},${p.alpha})`);
  grad.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawEmoji(p){
  ctx.globalAlpha = p.alpha;
  ctx.font = `${p.size}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.glyph, p.x, p.y);
  ctx.globalAlpha = 1;
}

function tickParticles(){
  ctx.clearRect(0, 0, w, h);
  const cfg = THEME_CONFIG[currentTheme];

  if (cfg && cfg.mode === 'burst'){
    tickFireworks();
  } else if (cfg) {
    particles.forEach(p => {
      if (cfg.dir === 'up')    { p.y -= p.speed; if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; } }
      if (cfg.dir === 'down')  { p.y += p.speed; if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; } }
      if (cfg.dir === 'side')  { p.x += p.speed; p.y += Math.sin((performance.now()/1000) + p.seed) * 0.15; if (p.x > w + 40) { p.x = -40; p.y = Math.random() * h * 0.6; } }
      if (cfg.dir === 'drift') { p.y -= p.speed; p.x += Math.sin((performance.now()/900) + p.seed) * 0.4; if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; } }
      if (cfg.dir === 'twinkle'){ p.alpha = 0.35 + 0.55 * Math.abs(Math.sin((performance.now()/700) + p.seed)); }

      if (cfg.mode === 'dot') drawDot(p, cfg.color);
      if (cfg.mode === 'emoji') drawEmoji(p);
    });
  }
  rafId = requestAnimationFrame(tickParticles);
}

function spawnFirework(){
  const x = w * (0.2 + Math.random() * 0.6);
  const y = h * (0.15 + Math.random() * 0.35);
  const glyphs = ['💖','💗','✨','💛'];
  const count = 10;
  for (let i = 0; i < count; i++){
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.2 + Math.random() * 1.4;
    fireworks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      size: 14 + Math.random() * 10
    });
  }
}

let lastBurst = 0;
function tickFireworks(){
  const now = performance.now();
  if (now - lastBurst > 850){ spawnFirework(); lastBurst = now; }
  fireworks = fireworks.filter(p => p.life > 0);
  fireworks.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.01; p.life -= 0.012;
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.font = `${p.size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.glyph, p.x, p.y);
    ctx.globalAlpha = 1;
  });
}

function setTheme(theme){
  currentTheme = theme || 'ember';
  document.body.className = 'theme-' + currentTheme;
  seedParticles(currentTheme);
}

setTheme('ember');
tickParticles();

/* ============================================================
   MINI ANIMATED SCENES — small SVG/CSS illustrations per theme
   ============================================================ */
function sceneHTML(theme){
  switch(theme){

    case 'balloons': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <ellipse cx="100" cy="112" rx="16" ry="8" fill="rgba(0,0,0,0.15)"/>
        <circle cx="100" cy="96" r="9" fill="#f0c98a"/>
        <path d="M92 104 Q100 118 108 104" stroke="#f0c98a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <line x1="100" y1="55" x2="100" y2="90" stroke="#cbb98a" stroke-width="1.4" class="sc-balloon-string"/>
        <ellipse cx="100" cy="36" rx="20" ry="26" fill="#eda9b4" class="sc-balloon"/>
        <path d="M100 62 L96 68 L104 68 Z" fill="#eda9b4"/>
      </svg>`;

    case 'planes': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <circle cx="40" cy="95" r="9" fill="#f0c98a"/>
        <path d="M32 103 Q40 116 48 103" stroke="#f0c98a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="34" y="80" width="12" height="18" rx="4" fill="#eda9b4"/>
        <g class="sc-plane" style="transform-origin:100px 50px;">
          <path d="M85 50 L130 40 L100 58 L110 66 L92 62 Z" fill="#f5f1e6" opacity="0.92"/>
        </g>
      </svg>`;

    case 'hourglass': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <g class="sc-hourglass-body" style="transform-origin:100px 55px;">
          <path d="M75 20 H125 L100 55 Z" fill="#e8b34c" opacity="0.85"/>
          <path d="M75 90 H125 L100 55 Z" fill="#e8b34c" opacity="0.5"/>
          <rect x="72" y="16" width="56" height="6" rx="2" fill="#cbb98a"/>
          <rect x="72" y="88" width="56" height="6" rx="2" fill="#cbb98a"/>
        </g>
        <circle class="sc-grain" cx="100" cy="55" r="2.4" fill="#fff6d8" style="animation-delay:0s"/>
        <circle class="sc-grain" cx="98" cy="55" r="2" fill="#fff6d8" style="animation-delay:0.4s"/>
        <circle class="sc-grain" cx="102" cy="55" r="2" fill="#fff6d8" style="animation-delay:0.8s"/>
      </svg>`;

    case 'rain': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <circle class="sc-drop" cx="60" cy="20" r="2.4" fill="#9fbde0" style="animation-delay:0s"/>
        <circle class="sc-drop" cx="140" cy="20" r="2.2" fill="#9fbde0" style="animation-delay:0.5s"/>
        <circle class="sc-drop" cx="100" cy="10" r="2" fill="#9fbde0" style="animation-delay:0.9s"/>
        <circle class="sc-drop" cx="30" cy="15" r="2" fill="#9fbde0" style="animation-delay:1.2s"/>
        <g class="sc-umbrella">
          <path d="M60 55 Q100 20 140 55 Q120 45 100 50 Q80 45 60 55 Z" fill="#eda9b4"/>
          <line x1="100" y1="50" x2="100" y2="100" stroke="#cbb98a" stroke-width="2.4"/>
          <path d="M100 100 Q108 108 100 112" stroke="#cbb98a" stroke-width="2.4" fill="none"/>
        </g>
        <circle cx="80" cy="112" r="8" fill="#f0c98a"/>
        <circle cx="118" cy="112" r="8" fill="#f0c98a"/>
      </svg>`;

    case 'hearts': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <g class="sc-heart" style="animation-delay:0s;transform-origin:60px 60px;"><path d="M60 75 C40 55 45 35 60 40 C75 35 80 55 60 75 Z" fill="#eda9b4"/></g>
        <g class="sc-heart" style="animation-delay:0.4s;transform-origin:140px 45px;"><path d="M140 58 C126 44 130 30 140 33 C150 30 154 44 140 58 Z" fill="#e8b34c" opacity="0.9"/></g>
        <g class="sc-heart" style="animation-delay:0.8s;transform-origin:100px 90px;"><path d="M100 102 C88 90 91 78 100 81 C109 78 112 90 100 102 Z" fill="#f5f1e6" opacity="0.85"/></g>
        <g class="sc-heart" style="animation-delay:1.1s;transform-origin:30px 95px;"><path d="M30 105 C21 96 23 87 30 89 C37 87 39 96 30 105 Z" fill="#eda9b4" opacity="0.8"/></g>
      </svg>`;

    case 'stars': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <circle cx="55" cy="95" r="9" fill="#f0c98a"/>
        <path d="M47 103 Q55 116 63 103" stroke="#f0c98a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <line x1="55" y1="80" x2="80" y2="45" stroke="#f0c98a" stroke-width="3" stroke-linecap="round"/>
        <g class="sc-star" style="animation-delay:0s;"><path d="M118 30 l3 8 l8 1 l-6 6 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -6 l8 -1 Z" fill="#e8b34c"/></g>
        <g class="sc-star" style="animation-delay:0.5s;"><path d="M150 60 l2 5 l5 1 l-4 4 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -4 l5 -1 Z" fill="#f5f1e6"/></g>
        <g class="sc-star" style="animation-delay:0.9s;"><path d="M90 20 l2 5 l5 1 l-4 4 l1 5 l-4 -3 l-4 3 l1 -5 l-4 -4 l5 -1 Z" fill="#eda9b4"/></g>
      </svg>`;

    case 'fireflies': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <circle cx="100" cy="100" r="10" fill="#f0c98a"/>
        <path d="M92 108 Q100 122 108 108" stroke="#f0c98a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M78 55 Q78 90 100 92 Q122 90 122 55 Z" fill="none" stroke="#a8e08c" stroke-width="2" opacity="0.6"/>
        <circle class="sc-firefly" cx="90" cy="70" r="3" fill="#e8f5a3" style="animation-delay:0s; filter:drop-shadow(0 0 4px #e8f5a3);"/>
        <circle class="sc-firefly" cx="108" cy="65" r="2.4" fill="#e8f5a3" style="animation-delay:0.5s; filter:drop-shadow(0 0 4px #e8f5a3);"/>
        <circle class="sc-firefly" cx="100" cy="80" r="2.8" fill="#e8f5a3" style="animation-delay:1s; filter:drop-shadow(0 0 4px #e8f5a3);"/>
      </svg>`;

    case 'petals': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%" id="petal-svg">
        <line x1="100" y1="75" x2="100" y2="115" stroke="#7fae6f" stroke-width="3"/>
        <circle cx="100" cy="60" r="9" fill="#e8b34c"/>
        <ellipse class="sc-petal" data-i="0" cx="100" cy="35" rx="9" ry="18" fill="#eda9b4" style="--fx:14px;--fy:-30px;"/>
        <ellipse class="sc-petal" data-i="1" cx="122" cy="48" rx="9" ry="18" fill="#eda9b4" transform="rotate(72 122 48)" style="--fx:34px;--fy:-6px;"/>
        <ellipse class="sc-petal" data-i="2" cx="114" cy="75" rx="9" ry="18" fill="#eda9b4" transform="rotate(144 114 75)" style="--fx:26px;--fy:26px;"/>
        <ellipse class="sc-petal" data-i="3" cx="86" cy="75" rx="9" ry="18" fill="#eda9b4" transform="rotate(216 86 75)" style="--fx:-26px;--fy:26px;"/>
        <ellipse class="sc-petal" data-i="4" cx="78" cy="48" rx="9" ry="18" fill="#eda9b4" transform="rotate(288 78 48)" style="--fx:-34px;--fy:-6px;"/>
      </svg>`;

    case 'candle': return `
      <div class="candle-wrap"><div class="candle-body"></div><div class="flame"></div></div>`;

    case 'bloom': return `
      <svg viewBox="0 0 200 130" width="100%" height="100%">
        <rect class="sc-bloom-stem" id="bloom-stem" x="98" y="90" width="4" height="0" fill="#7fae6f"/>
        <g class="sc-bloom-flower" id="bloom-flower" style="transform: translate(100px,90px) scale(0.2);">
          <circle cx="0" cy="0" r="8" fill="#e8b34c"/>
          <ellipse cx="0" cy="-16" rx="7" ry="14" fill="#eda9b4"/>
          <ellipse cx="14" cy="-6" rx="7" ry="14" fill="#eda9b4" transform="rotate(72 14 -6)"/>
          <ellipse cx="9" cy="12" rx="7" ry="14" fill="#eda9b4" transform="rotate(144 9 12)"/>
          <ellipse cx="-9" cy="12" rx="7" ry="14" fill="#eda9b4" transform="rotate(216 -9 12)"/>
          <ellipse cx="-14" cy="-6" rx="7" ry="14" fill="#eda9b4" transform="rotate(288 -14 -6)"/>
        </g>
      </svg>`;

    case 'fireworks': return `
      <svg viewBox="0 0 200 150" width="100%" height="100%">
        <circle cx="100" cy="128" r="10" fill="#f0c98a"/>
        <path d="M92 136 Q100 150 108 136" stroke="#f0c98a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="94" y="110" width="12" height="20" rx="4" fill="#eda9b4"/>
        <g class="sc-rose">
          <line x1="100" y1="70" x2="100" y2="108" stroke="#7fae6f" stroke-width="3"/>
          <ellipse cx="100" cy="52" rx="14" ry="20" fill="#e05d6f"/>
          <ellipse cx="100" cy="46" rx="9" ry="13" fill="#c94456"/>
        </g>
      </svg>`;

    default: return '';
  }
}

/* ============================================================
   STEP DATA
   ============================================================ */
const steps = [
  {
    type: 'intro',
    theme: 'ember',
    eyebrow: 'before anything else',
    question: 'Can I have two minutes of your time? The same two minutes I didn\u2019t give you today.',
    button: 'Yes'
  },
  {
    type: 'qa', theme: 'balloons', eyebrow: '01',
    question: 'Do you remember what today was?',
    button: 'I remember',
    answer: 'It was my birthday. But somehow it felt like it belonged to you more than me \u2014 because no one waited for it, planned for it, and lit up over it the way you did.'
  },
  {
    type: 'qa', theme: 'planes', eyebrow: '02',
    question: 'Do you remember what we\u2019d planned?',
    button: 'I do',
    answer: 'We had something set for today. Something that was supposed to be ours. And the moment it fell apart, I got so caught up in the falling apart that I forgot the person still standing in it with me.'
  },
  {
    type: 'qa', theme: 'hourglass', eyebrow: '03',
    question: 'Do you know how long you waited?',
    button: 'Tell me',
    answer: 'A whole day. Morning to night, hoping for two lines of text that never came. I know that now, fully. I didn\u2019t feel it enough in the moment to do something about it, and that\u2019s on me.'
  },
  {
    type: 'qa', theme: 'rain', eyebrow: '04',
    question: 'Do you know why I went quiet?',
    button: 'Why',
    answer: 'There were reasons. But a reason isn\u2019t the same as a good one. I won\u2019t hide behind mine \u2014 I let a hard day become an excuse to disappear on the one person who never deserved my silence.'
  },
  {
    type: 'qa', theme: 'hearts', eyebrow: '05',
    question: 'Do you know who was the most excited for my birthday?',
    button: 'Who',
    answer: 'You were. More excited than I was. You held on to this day like it mattered more than your own, and I still let it pass you by without a single word.'
  },
  {
    type: 'qa', theme: 'stars', eyebrow: '06',
    question: 'Do you know what that silence did?',
    button: 'What',
    answer: 'It took a day that was supposed to feel like love, and made it feel like being forgotten instead. That\u2019s not who I want to be to you \u2014 not for one day, not ever.'
  },
  {
    type: 'qa', theme: 'fireflies', eyebrow: '07',
    question: 'Do you know what I keep thinking about?',
    button: 'What is it',
    answer: 'You, checking your phone. You, telling yourself I was probably just busy. You, still hoping, hours in, that I\u2019d remember you. I keep thinking about how long hope can hold on before it starts to hurt.'
  },
  {
    type: 'qa', theme: 'petals', eyebrow: '08',
    question: 'Do you know what I can\u2019t undo?',
    button: 'What can\u2019t you undo',
    answer: 'The hours. One by one, they slipped past without a word from me \u2014 I can\u2019t give those back to you, and I won\u2019t pretend a screen full of words can. What I can do is make sure they never repeat.'
  },
  {
    type: 'qa', theme: 'candle', eyebrow: '09',
    question: 'Do you know what I\u2019m not going to do here?',
    button: 'What',
    answer: 'Say one small, easy word and expect it to close this out. You mean more than an easy way for me to feel better. You deserve the long way \u2014 the real one.'
  },
  {
    type: 'checklist', theme: 'bloom', eyebrow: '10',
    title: 'So here is what I\u2019m choosing instead \u2014 not words for today, but a way of showing up from now on:',
    items: [
      'When something falls apart, I\u2019ll tell you \u2014 not disappear into it.',
      'On the days that are supposed to be about me, I\u2019ll check on you first.',
      'Two minutes will never again feel like too much to give you.',
      'Your waiting will never be invisible to me again.',
      'I\u2019ll show up on the ordinary days, not just the easy ones.'
    ],
    button: 'Keep reading'
  },
  {
    type: 'letter', theme: 'candle',
    eyebrow: 'the last thing',
    paragraphs: [
      'You didn\u2019t just remember my birthday. You made it feel like one. That\u2019s a rare thing \u2014 someone who is more excited for your happiness than their own \u2014 and I let it go unanswered for an entire day.',
      'I don\u2019t want you to carry today as proof that your care goes unnoticed. It doesn\u2019t. I noticed everything \u2014 late, but completely. The plans you were looking forward to, the message you kept expecting, the quiet you sat in because of me.',
      'I don\u2019t get to undo the hours. But I get every day after this one, and I\u2019m not going to waste them the way I wasted today.',
      'Thank you for being the one who was more excited about my birthday than I was. I want to spend the rest of them making sure you never have to wait like that again.'
    ],
    button: 'One more thing'
  },
  {
    type: 'final', theme: 'fireworks',
    title: 'Two minutes, right now, are yours.',
    note: 'And tomorrow\u2019s two minutes. And the day after that.',
    button: 'Replay this'
  }
];

let current = 0;
const stage = document.getElementById('stage');
const dotsWrap = document.getElementById('dots');

function buildDots(){
  dotsWrap.innerHTML = '';
  steps.forEach(() => dotsWrap.appendChild(document.createElement('span')));
}
function updateDots(){
  [...dotsWrap.children].forEach((d, i) => {
    d.classList.toggle('done', i < current);
    d.classList.toggle('current', i === current);
  });
}

function makeDodgy(btn, zone){
  function reposition(e){
    if (e.cancelable) e.preventDefault();
    const zr = zone.getBoundingClientRect();
    const bw = btn.offsetWidth || 90, bh = btn.offsetHeight || 42;
    const maxX = Math.max(zr.width - bw, 0);
    const maxY = Math.max(zr.height - bh, 0);
    btn.style.left = (Math.random() * maxX) + 'px';
    btn.style.top = (Math.random() * maxY) + 'px';
    btn.style.transform = 'none';
  }
  btn.addEventListener('touchstart', reposition, { passive: false });
  btn.addEventListener('mouseenter', reposition);
  btn.addEventListener('click', reposition);
}

function playPetalPluck(){
  const petals = [...document.querySelectorAll('.sc-petal')];
  petals.forEach((p, i) => {
    setTimeout(() => p.classList.add('plucked'), 700 + i * 850);
  });
}

function growBloom(step){
  const stem = document.getElementById('bloom-stem');
  const flower = document.getElementById('bloom-flower');
  const total = step.items.length;
  step.items.forEach((_, i) => {
    setTimeout(() => {
      if (stem) stem.setAttribute('height', Math.min(70, (i + 1) * (70 / total)));
      if (stem) stem.setAttribute('y', 90 - Math.min(70, (i + 1) * (70 / total)));
      if (flower) {
        const scale = 0.2 + (i + 1) * (0.8 / total);
        flower.style.transform = `translate(100px, ${90 - Math.min(70, (i + 1) * (70 / total))}px) scale(${scale})`;
      }
    }, 350 * (i + 1));
  });
}

function render(){
  updateDots();
  const s = steps[current];
  setTheme(s.theme);

  const card = document.createElement('div');
  card.className = 'card';

  if (s.type === 'intro') {
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.question}</h1>
      <button id="next-btn" class="correct-btn">${s.button}</button>
    `;
  }

  if (s.type === 'qa') {
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.question}</h1>
      <div class="scene">${sceneHTML(s.theme)}</div>
      <div class="decoy-zone"><button class="decoy-btn">Not really</button></div>
      <button id="reveal-btn" class="correct-btn">${s.button}</button>
      <p class="answer" id="answer-text">${s.answer}</p>
      <div id="next-holder"></div>
    `;
  }

  if (s.type === 'checklist') {
    const itemsHtml = s.items.map(it => `<li>${it}</li>`).join('');
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.title}</h1>
      <div class="scene">${sceneHTML(s.theme)}</div>
      <ul class="checklist" id="checklist">${itemsHtml}</ul>
      <div id="next-holder"></div>
    `;
  }

  if (s.type === 'letter') {
    const pHtml = s.paragraphs.map(p => `<p>${p}</p>`).join('');
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <div class="scene">${sceneHTML(s.theme)}</div>
      <div class="letter">${pHtml}<span class="signature">\u2014 ${YOUR_NAME}</span></div>
      <button id="next-btn" class="correct-btn">${s.button}</button>
    `;
  }

  if (s.type === 'final') {
    card.innerHTML = `
      <div class="scene" style="height:150px;">${sceneHTML(s.theme)}</div>
      <h1 class="final-title">${s.title}</h1>
      <p class="closing-note">${s.note}</p>
      <span class="signature">\u2014 ${YOUR_NAME}</span>
      <br/>
      <button class="ghost replay" id="replay-btn">${s.button}</button>
    `;
  }

  stage.innerHTML = '';
  stage.appendChild(card);
  attachHandlers(s);
}

function goNext(){
  if (current < steps.length - 1) {
    current++;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function attachHandlers(s){
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) replayBtn.addEventListener('click', () => { current = 0; render(); window.scrollTo({ top: 0 }); });

  if (s.type === 'qa') {
    const revealBtn = document.getElementById('reveal-btn');
    const decoyBtn = document.querySelector('.decoy-btn');
    const decoyZone = document.querySelector('.decoy-zone');
    const answerEl = document.getElementById('answer-text');
    const holder = document.getElementById('next-holder');

    if (decoyBtn && decoyZone) makeDodgy(decoyBtn, decoyZone);

    revealBtn.addEventListener('click', () => {
      answerEl.classList.add('show');
      revealBtn.style.display = 'none';
      if (decoyZone) decoyZone.style.display = 'none';
      const btn = document.createElement('button');
      btn.className = 'correct-btn';
      btn.textContent = 'Continue';
      btn.style.marginTop = '6px';
      btn.addEventListener('click', goNext);
      holder.appendChild(btn);
    }, { once: true });

    if (s.theme === 'petals') playPetalPluck();
  }

  if (s.type === 'checklist') {
    const items = [...document.querySelectorAll('#checklist li')];
    const holder = document.getElementById('next-holder');
    items.forEach((li, i) => setTimeout(() => li.classList.add('show'), 350 * (i + 1)));
    growBloom(s);
    setTimeout(() => {
      const btn = document.createElement('button');
      btn.className = 'correct-btn';
      btn.textContent = 'Keep reading';
      btn.addEventListener('click', goNext);
      holder.appendChild(btn);
    }, 350 * (items.length + 1));
  }
}

buildDots();
render();
