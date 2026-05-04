const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const controlsDiv = document.getElementById('controls');
const lessonSelect = document.getElementById('lessonSelect');
let state = {};

function loadLesson(name) {
  controlsDiv.innerHTML = '';
  if (name === 'osc') {
    state = { type: 'sawtooth', freq: 220 };
    addSelect('Waveform', ['sine','square','sawtooth','triangle'], v => state.type = v);
    addSlider('Pitch', 100, 800, state.freq, v => state.freq = v);
  }
  if (name === 'filter') {
    state = { cutoff: 800, resonance: 1 };
    addSlider('Cutoff', 100, 2000, state.cutoff, v => state.cutoff = v);
    addSlider('Resonance', 0.1, 10, state.resonance, v => state.resonance = v);
  }
  if (name === 'env') {
    state = { attack:0.1, decay:0.2, sustain:0.5, release:0.5 };
    addSlider('Attack',0.01,1,state.attack,v=>state.attack=v);
    addSlider('Decay',0.01,1,state.decay,v=>state.decay=v);
    addSlider('Sustain',0,1,state.sustain,v=>state.sustain=v);
    addSlider('Release',0.01,2,state.release,v=>state.release=v);
  }
}

function addSlider(label,min,max,val,onChange){
  const input=document.createElement('input');
  input.type='range'; input.min=min; input.max=max; input.step=0.01; input.value=val;
  input.oninput=e=>onChange(parseFloat(e.target.value));
  controlsDiv.append(label,input);
}

function addSelect(label,options,onChange){
  const sel=document.createElement('select');
  options.forEach(o=>{
    const opt=document.createElement('option'); opt.value=o; opt.text=o; sel.append(opt);
  });
  sel.onchange=e=>onChange(e.target.value);
  controlsDiv.append(label,sel);
}

document.getElementById('play').onclick = () => {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  let node = osc;

  if (lessonSelect.value === 'filter') {
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = state.cutoff;
    filter.Q.value = state.resonance;
    osc.connect(filter);
    node = filter;
  }

  node.connect(gain).connect(audioCtx.destination);

  osc.type = state.type || 'sawtooth';
  osc.frequency.value = state.freq || 220;

  const now = audioCtx.currentTime;
  if (lessonSelect.value === 'env') {
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + state.attack);
    gain.gain.linearRampToValueAtTime(state.sustain, now + state.attack + state.decay);
    gain.gain.setValueAtTime(state.sustain, now + 1);
    gain.gain.linearRampToValueAtTime(0, now + 1 + state.release);
  } else {
    gain.gain.value = 0.5;
  }

  osc.start();
  osc.stop(now + 2);
};

lessonSelect.onchange = e => loadLesson(e.target.value);
loadLesson('osc');