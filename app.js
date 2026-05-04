const ctx = new (window.AudioContext || window.webkitAudioContext)();

const surface = document.getElementById('play-surface');
const dot = document.getElementById('gesture-dot');
const readout = document.getElementById('parameter-readout');

let osc, gain, filter;
let currentLesson = 'osc';

const lessons = {
  osc: {
    title: "Oscillator Shapes",
    desc: "Move left/right to change pitch. Up/down to morph tone.",
    challenge: "Make something that sounds like a bass, then a siren."
  },
  filter: {
    title: "Filter Sweep",
    desc: "Move up/down to open and close the filter.",
    challenge: "Turn a static tone into a build-up."
  },
  env: {
    title: "Envelope Sculptor",
    desc: "Tap different positions to shape amplitude over time.",
    challenge: "Make it feel percussive, then smooth."
  }
};

function startAudio() {
  if (!osc) {
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
  }
}

function updateFromGesture(x, y) {
  if (!osc) return;

  const freq = 100 + x * 800;
  osc.frequency.value = freq;

  if (currentLesson === 'filter') {
    filter.frequency.value = 200 + y * 2000;
    readout.innerText = `Cutoff: ${Math.round(filter.frequency.value)} Hz`;
  } else if (currentLesson === 'env') {
    gain.gain.value = y;
    readout.innerText = `Amplitude: ${y.toFixed(2)}`;
  } else {
    osc.type = ['sine','square','sawtooth','triangle'][Math.floor(y * 4)];
    readout.innerText = `${osc.type} @ ${Math.round(freq)} Hz`;
  }
}

surface.addEventListener('pointerdown', e => {
  startAudio();
  handleMove(e);
});

surface.addEventListener('pointermove', handleMove);

function handleMove(e) {
  const rect = surface.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  dot.style.left = `${x * 100}%`;
  dot.style.top = `${y * 100}%`;

  updateFromGesture(x, y);
}

// Lesson switching

document.querySelectorAll('.lesson-tab').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.lesson-tab').forEach(b => b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');

    currentLesson = btn.dataset.lesson;
    document.getElementById('lesson-title').innerText = lessons[currentLesson].title;
    document.getElementById('lesson-description').innerText = lessons[currentLesson].desc;
    document.getElementById('lesson-challenge').innerText = lessons[currentLesson].challenge;
    document.getElementById('status-title').innerText = lessons[currentLesson].title;
  };
});

// init

document.getElementById('lesson-title').innerText = lessons.osc.title;
document.getElementById('lesson-description').innerText = lessons.osc.desc;
document.getElementById('lesson-challenge').innerText = lessons.osc.challenge;
