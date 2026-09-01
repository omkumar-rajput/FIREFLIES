/* ============================================================
   PERSONALIZE HERE
   ============================================================ */
const YOUR_NAME = "Omkumar"; // <-- change this to your name, e.g. "Rahul"

/* ============================================================
   AMBIENT BACKGROUND — slow drifting embers of light
   ============================================================ */
(function ambient(){
  const canvas = document.getElementById('ambient');
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeParticles(){
    const count = window.innerWidth < 600 ? 26 : 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      speedY: Math.random() * 0.25 + 0.05,
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.5 + 0.15,
      flicker: Math.random() * 0.02 + 0.005
    }));
  }
  function tick(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.alpha += (Math.random() - 0.5) * p.flicker;
      p.alpha = Math.max(0.08, Math.min(0.7, p.alpha));
      p.y -= p.speedY;
      p.x += p.drift;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `rgba(232,179,76,${p.alpha})`);
      grad.addColorStop(1, 'rgba(232,179,76,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  makeParticles();
  tick();
})();

/* ============================================================
   THE JOURNEY — edit any text below freely, it's just data
   ============================================================ */
const steps = [
  {
    type: 'intro',
    eyebrow: 'before anything else',
    question: 'Can I have two minutes of your time? The same two minutes I didn\u2019t give you today.',
    button: 'Yes'
  },
  {
    type: 'qa',
    eyebrow: '01',
    question: 'Do you remember what today was?',
    button: 'I remember',
    answer: 'It was my birthday. But somehow it felt like it belonged to you more than me \u2014 because no one waited for it, planned for it, and lit up over it the way you did.'
  },
  {
    type: 'qa',
    eyebrow: '02',
    question: 'Do you remember what we\u2019d planned?',
    button: 'I do',
    answer: 'We had something set for today. Something that was supposed to be ours. And the moment it fell apart, I got so caught up in the falling apart that I forgot the person still standing in it with me.'
  },
  {
    type: 'qa',
    eyebrow: '03',
    question: 'Do you know how long you waited?',
    button: 'Tell me',
    answer: 'A whole day. Morning to night, hoping for two lines of text that never came. I know that now, fully. I didn\u2019t feel it enough in the moment to do something about it, and that\u2019s on me.'
  },
  {
    type: 'qa',
    eyebrow: '04',
    question: 'Do you know why I went quiet?',
    button: 'Why',
    answer: 'There were reasons. But a reason isn\u2019t the same as a good one. I won\u2019t hide behind mine \u2014 I let a hard day become an excuse to disappear on the one person who never deserved my silence.'
  },
  {
    type: 'qa',
    eyebrow: '05',
    question: 'Do you know who was the most excited for my birthday?',
    button: 'Who',
    answer: 'You were. More excited than I was. You held on to this day like it mattered more than your own, and I still let it pass you by without a single word.'
  },
  {
    type: 'qa',
    eyebrow: '06',
    question: 'Do you know what that silence did?',
    button: 'What',
    answer: 'It took a day that was supposed to feel like love, and made it feel like being forgotten instead. That\u2019s not who I want to be to you \u2014 not for one day, not ever.'
  },
  {
    type: 'qa',
    eyebrow: '07',
    question: 'Do you know what I keep thinking about?',
    button: 'What is it',
    answer: 'You, checking your phone. You, telling yourself I was probably just busy. You, still hoping, hours in, that I\u2019d remember you. I keep thinking about how long hope can hold on before it starts to hurt.'
  },
  {
    type: 'qa',
    eyebrow: '08',
    question: 'Do you know what I can\u2019t undo?',
    button: 'What can\u2019t you undo',
    answer: 'The hours. I can\u2019t give those back to you, and I won\u2019t pretend a screen full of words can. What I can do is make sure they never repeat.'
  },
  {
    type: 'qa',
    eyebrow: '09',
    question: 'Do you know what I\u2019m not going to do here?',
    button: 'What',
    answer: 'Say one small word and expect it to close this out. You mean more than an easy way for me to feel better. You deserve the long way \u2014 the real one.'
  },
  {
    type: 'checklist',
    eyebrow: '10',
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
    type: 'letter',
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
    type: 'final',
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
  steps.forEach((_, i) => {
    const d = document.createElement('span');
    dotsWrap.appendChild(d);
  });
}

function updateDots(){
  [...dotsWrap.children].forEach((d, i) => {
    d.classList.toggle('done', i < current);
    d.classList.toggle('current', i === current);
  });
}

function render(){
  updateDots();
  const s = steps[current];
  const card = document.createElement('div');
  card.className = 'card';

  if (s.type === 'intro') {
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.question}</h1>
      <button id="next-btn">${s.button}</button>
    `;
  }

  if (s.type === 'qa') {
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.question}</h1>
      <button id="reveal-btn">${s.button}</button>
      <p class="answer" id="answer-text">${s.answer}</p>
      <div id="next-holder"></div>
    `;
  }

  if (s.type === 'checklist') {
    const itemsHtml = s.items.map(it => `<li>${it}</li>`).join('');
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <h1 class="question">${s.title}</h1>
      <ul class="checklist" id="checklist">${itemsHtml}</ul>
      <div id="next-holder"></div>
    `;
  }

  if (s.type === 'letter') {
    const pHtml = s.paragraphs.map(p => `<p>${p}</p>`).join('');
    card.innerHTML = `
      <div class="eyebrow">${s.eyebrow}</div>
      <div class="letter">${pHtml}<span class="signature">\u2014 ${YOUR_NAME}</span></div>
      <button id="next-btn">${s.button}</button>
    `;
  }

  if (s.type === 'final') {
    card.innerHTML = `
      <div class="candle-wrap">
        <div class="candle-body"></div>
        <div class="flame"></div>
      </div>
      <h1 class="final-title">${s.title}</h1>
      <p class="closing-note">${s.note}</p>
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
  if (replayBtn) replayBtn.addEventListener('click', () => { current = 0; render(); window.scrollTo({top:0}); });

  if (s.type === 'qa') {
    const revealBtn = document.getElementById('reveal-btn');
    const answerEl = document.getElementById('answer-text');
    const holder = document.getElementById('next-holder');
    revealBtn.addEventListener('click', () => {
      answerEl.classList.add('show');
      revealBtn.style.display = 'none';
      const btn = document.createElement('button');
      btn.textContent = 'Continue';
      btn.style.marginTop = '6px';
      btn.addEventListener('click', goNext);
      holder.appendChild(btn);
    }, { once: true });
  }

  if (s.type === 'checklist') {
    const items = [...document.querySelectorAll('#checklist li')];
    const holder = document.getElementById('next-holder');
    items.forEach((li, i) => {
      setTimeout(() => li.classList.add('show'), 350 * (i + 1));
    });
    setTimeout(() => {
      const btn = document.createElement('button');
      btn.textContent = 'Keep reading';
      btn.addEventListener('click', goNext);
      holder.appendChild(btn);
    }, 350 * (items.length + 1));
  }
}

buildDots();
render();
