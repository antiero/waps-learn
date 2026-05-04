export class AudioEngine {
  constructor() {
    this.context = null;
    this.analyser = null;
    this.masterGain = null;
    this.osc = null;
    this.filter = null;
    this.envGain = null;
    this.mode = 'oscillator';
  }

  async init() {
    if (this.context) return;
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.context.destination);
  }

  async resume() {
    await this.init();
    if (this.context.state !== 'running') await this.context.resume();
  }

  setMode(mode) {
    this.stop();
    this.mode = mode;
  }

  startContinuous(x, y) {
    if (!this.context) return;
    this.stop();
    this.osc = this.context.createOscillator();
    this.envGain = this.context.createGain();

    if (this.mode === 'filter') {
      this.filter = this.context.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.osc.type = 'sawtooth';
      this.updateFilter(x, y);
      this.osc.connect(this.filter);
      this.filter.connect(this.envGain);
    } else {
      this.updateOscillator(x, y);
      this.osc.connect(this.envGain);
    }

    this.envGain.gain.value = 0.85;
    this.envGain.connect(this.masterGain);
    this.osc.start();
  }

  updateContinuous(x, y) {
    if (!this.osc || !this.context) return;
    if (this.mode === 'filter') {
      this.updateFilter(x, y);
    } else {
      this.updateOscillator(x, y);
    }
  }

  updateOscillator(x, y) {
    const frequency = 100 + x * 900;
    const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
    const idx = Math.min(3, Math.max(0, Math.floor(y * waveforms.length)));
    this.osc.frequency.setTargetAtTime(frequency, this.context.currentTime, 0.02);
    this.osc.type = waveforms[idx];
  }

  updateFilter(x, y) {
    const q = 0.1 + x * 24;
    const cutoff = 120 + (1 - y) * 6000;
    this.filter.Q.setTargetAtTime(q, this.context.currentTime, 0.02);
    this.filter.frequency.setTargetAtTime(cutoff, this.context.currentTime, 0.02);
  }

  triggerEnvelope() {
    if (!this.context) return;
    this.stop();
    const now = this.context.currentTime;
    this.osc = this.context.createOscillator();
    this.envGain = this.context.createGain();
    this.osc.type = 'triangle';
    this.osc.frequency.value = 330;

    const attack = 0.06;
    const decay = 0.2;
    const sustain = 0.45;
    const release = 0.35;

    this.envGain.gain.cancelScheduledValues(now);
    this.envGain.gain.setValueAtTime(0, now);
    this.envGain.gain.linearRampToValueAtTime(1, now + attack);
    this.envGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
    this.envGain.gain.linearRampToValueAtTime(0, now + attack + decay + release);

    this.osc.connect(this.envGain);
    this.envGain.connect(this.masterGain);
    this.osc.start(now);
    this.osc.stop(now + attack + decay + release + 0.05);
    this.osc.onended = () => this.stop();
  }

  stop() {
    if (this.osc) {
      try { this.osc.stop(); } catch {}
      this.osc.disconnect();
      this.osc = null;
    }
    if (this.filter) {
      this.filter.disconnect();
      this.filter = null;
    }
    if (this.envGain) {
      this.envGain.disconnect();
      this.envGain = null;
    }
  }
}

export const audioEngine = new AudioEngine();
