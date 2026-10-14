// Ambient Background Sound Engine for Study & Focus
// Procedural acoustic synthesis inspired by iOS Background Sounds (Stream, Rain, Roof Rain)
// Engineered with multi-stage steep low-pass filtering, acoustic bubble physics (Minnaert resonance),
// and windowed micro-wavelets to ensure zero harsh high frequencies, static clicks, or shrill noise.

export type AmbientSoundPresetId =
  | 'stream'
  | 'rain'
  | 'roof_rain'
  | 'wave'
  | 'deep_focus'
  | 'forest_breeze';

export interface AmbientSoundPreset {
  id: AmbientSoundPresetId;
  name: string;
  category: 'Natural Water' | 'Focus & Brainwave' | 'Atmosphere';
  description: string;
  tag: string;
}

export const AMBIENT_PRESETS: AmbientSoundPreset[] = [
  {
    id: 'stream',
    name: 'Mountain Stream',
    category: 'Natural Water',
    description: 'Natural bubbling brook flowing over smooth river rocks, warm liquid without hiss',
    tag: 'Flowing Brook',
  },
  {
    id: 'rain',
    name: 'Gentle Rain',
    category: 'Natural Water',
    description: 'Soft steady rainfall on lush ground with warm, soothing acoustic droplets',
    tag: 'Steady Rain',
  },
  {
    id: 'roof_rain',
    name: 'Roof Rain',
    category: 'Natural Water',
    description: 'Cozy muffled rain pattering softly on the roof heard from inside the room',
    tag: 'Cozy Room & Roof',
  },
  {
    id: 'wave',
    name: 'Ocean Waves',
    category: 'Natural Water',
    description: 'Rhythmic deep ocean swells rolling ashore with smooth rolling surf',
    tag: 'Ocean Swell',
  },
  {
    id: 'deep_focus',
    name: 'Deep Focus',
    category: 'Focus & Brainwave',
    description: 'Warm velvet brown noise blended with a subtle 10Hz Alpha brainwave pulse',
    tag: '10Hz Alpha / Study',
  },
  {
    id: 'forest_breeze',
    name: 'Forest Breeze',
    category: 'Atmosphere',
    description: 'Soft whispering wind wandering through woodland canopy and leaves',
    tag: 'Gentle Wind',
  },
];

const STORAGE_KEYS = {
  PRESET: 'esas_ambient_preset_v1',
  VOLUME: 'esas_ambient_volume_v1',
  ENABLED: 'esas_ambient_enabled_v1',
};

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentSourceNodes: {
    sources: AudioNode[];
    gain: GainNode;
    cleanup?: () => void;
  } | null = null;

  private isPlaying: boolean = false;
  private currentPresetId: AmbientSoundPresetId = 'stream';
  private volume: number = 0.45;
  private listeners: Set<(isPlaying: boolean, preset: AmbientSoundPresetId, volume: number) => void> =
    new Set();

  constructor() {
    // Restore persistent settings
    try {
      const savedPreset = localStorage.getItem(STORAGE_KEYS.PRESET) as AmbientSoundPresetId | null;
      if (savedPreset && AMBIENT_PRESETS.some((p) => p.id === savedPreset)) {
        this.currentPresetId = savedPreset;
      }
      const savedVol = localStorage.getItem(STORAGE_KEYS.VOLUME);
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          this.volume = v;
        }
      }
    } catch {}
  }

  public subscribe(
    fn: (isPlaying: boolean, preset: AmbientSoundPresetId, volume: number) => void
  ): () => void {
    this.listeners.add(fn);
    fn(this.isPlaying, this.currentPresetId, this.volume);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying, this.currentPresetId, this.volume));
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentPresetId: this.currentPresetId,
      volume: this.volume,
    };
  }

  private initContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.masterGain && this.audioCtx) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
    return this.audioCtx;
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.volume = clamped;
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, String(clamped));
    } catch {}

    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(clamped, this.audioCtx.currentTime, 0.05);
    }
    this.notify();
  }

  public async setPreset(presetId: AmbientSoundPresetId) {
    if (!AMBIENT_PRESETS.some((p) => p.id === presetId)) return;
    this.currentPresetId = presetId;
    try {
      localStorage.setItem(STORAGE_KEYS.PRESET, presetId);
    } catch {}

    if (this.isPlaying) {
      await this.crossfadeToPreset(presetId);
    }
    this.notify();
  }

  public async start(): Promise<void> {
    const ctx = this.initContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (this.currentSourceNodes) {
      this.stopCurrentNodes(0.1);
    }

    this.isPlaying = true;
    try {
      localStorage.setItem(STORAGE_KEYS.ENABLED, 'true');
    } catch {}

    this.buildPresetGraph(this.currentPresetId);
    this.notify();
  }

  public stop(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    try {
      localStorage.setItem(STORAGE_KEYS.ENABLED, 'false');
    } catch {}

    this.stopCurrentNodes(0.25);
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  private stopCurrentNodes(fadeDuration: number = 0.2) {
    if (!this.currentSourceNodes || !this.audioCtx) return;
    const { sources, gain, cleanup } = this.currentSourceNodes;
    this.currentSourceNodes = null;

    try {
      const now = this.audioCtx.currentTime;
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);

      setTimeout(() => {
        try {
          cleanup?.();
          sources.forEach((s) => {
            if ('stop' in s && typeof (s as any).stop === 'function') {
              try {
                (s as any).stop();
              } catch {}
            }
            s.disconnect();
          });
          gain.disconnect();
        } catch {}
      }, fadeDuration * 1000 + 50);
    } catch {}
  }

  private async crossfadeToPreset(presetId: AmbientSoundPresetId) {
    if (!this.audioCtx || !this.masterGain) return;
    this.stopCurrentNodes(0.3);
    setTimeout(() => {
      if (this.isPlaying && this.currentPresetId === presetId) {
        this.buildPresetGraph(presetId);
      }
    }, 250);
  }

  // Synthesis Builders
  private buildPresetGraph(presetId: AmbientSoundPresetId) {
    if (!this.audioCtx || !this.masterGain) return;
    const ctx = this.audioCtx;

    const presetGain = ctx.createGain();
    presetGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    presetGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 0.35);
    presetGain.connect(this.masterGain);

    const activeSources: AudioNode[] = [];
    let cleanupFn: (() => void) | undefined;

    switch (presetId) {
      case 'stream':
        cleanupFn = this.synthesizeStream(ctx, presetGain, activeSources);
        break;
      case 'rain':
        cleanupFn = this.synthesizeRain(ctx, presetGain, activeSources);
        break;
      case 'roof_rain':
        cleanupFn = this.synthesizeRoofRain(ctx, presetGain, activeSources);
        break;
      case 'wave':
        cleanupFn = this.synthesizeWaves(ctx, presetGain, activeSources);
        break;
      case 'deep_focus':
        cleanupFn = this.synthesizeDeepFocus(ctx, presetGain, activeSources);
        break;
      case 'forest_breeze':
        cleanupFn = this.synthesizeForestBreeze(ctx, presetGain, activeSources);
        break;
    }

    this.currentSourceNodes = {
      sources: activeSources,
      gain: presetGain,
      cleanup: cleanupFn,
    };
  }

  // =========================================================================
  // 1. MOUNTAIN STREAM (Faithful replica of iPhone "Stream")
  // Warm liquid bubbling brook with natural Minnaert resonances.
  // Steep 24dB/octave high-cut eliminates all hiss and sibilance.
  // =========================================================================
  private synthesizeStream(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    // Generate specialized stream buffer with physical water bubbles & liquid flow
    const duration = 8.0;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const streamBuffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = streamBuffer.getChannelData(ch);

      // Low-frequency fluid churning foundation (pink + brownian integration)
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let brown = 0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;

        brown = (brown + 0.035 * white) / 1.035;

        // Blend 65% brown noise + 35% pink noise for liquid depth
        data[i] = brown * 1.5 + pink * 0.45;
      }

      // Add Minnaert liquid water bubbles (frequencies 240Hz - 520Hz, smooth rounded envelope)
      // Real brook water bubbles are warm hollow gurgles, never high frequency chirps.
      const numBubbles = Math.floor(70 + Math.random() * 25);
      for (let b = 0; b < numBubbles; b++) {
        const centerFreq = 250 + Math.random() * 260; // 250 - 510 Hz
        const bubbleDurSec = 0.035 + Math.random() * 0.035; // 35ms - 70ms
        const bubbleFrames = Math.floor(sampleRate * bubbleDurSec);
        const startFrame = Math.floor(Math.random() * (frameCount - bubbleFrames - 100));
        const amp = (0.04 + Math.random() * 0.055) * (ch === 0 ? 0.9 : 1.1);

        for (let j = 0; j < bubbleFrames; j++) {
          const t = j / sampleRate;
          // Upward pitch glide typical of underwater bubble release
          const freq = centerFreq * (1 + 0.15 * (j / bubbleFrames));
          // Hann attack (3ms) to avoid click, exponential decay for bubble ringdown
          const attackSamples = Math.min(sampleRate * 0.004, bubbleFrames * 0.2);
          const envAttack = j < attackSamples ? 0.5 * (1 - Math.cos((Math.PI * j) / attackSamples)) : 1.0;
          const envDecay = Math.exp(-t / 0.018);
          const sample = Math.sin(2 * Math.PI * freq * t) * amp * envAttack * envDecay;
          data[startFrame + j] += sample;
        }
      }

      // Smooth loop crossfade (0.3s)
      const fadeCount = Math.floor(sampleRate * 0.3);
      for (let i = 0; i < fadeCount; i++) {
        const t = i / fadeCount;
        data[i] = data[i] * t + data[frameCount - fadeCount + i] * (1 - t);
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = streamBuffer;
    noiseSource.loop = true;

    // Filter 1: Primary water body bandpass (warm flow resonance)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(380, ctx.currentTime);
    bodyFilter.Q.setValueAtTime(1.4, ctx.currentTime);

    // LFO to slowly swirl the river water resonance
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.14, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(75, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bodyFilter.frequency);

    // Filter 2: Gentle liquid swirl bandpass (560Hz)
    const swirlFilter = ctx.createBiquadFilter();
    swirlFilter.type = 'bandpass';
    swirlFilter.frequency.setValueAtTime(580, ctx.currentTime);
    swirlFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    const swirlLfo = ctx.createOscillator();
    swirlLfo.frequency.setValueAtTime(0.21, ctx.currentTime);
    const swirlLfoGain = ctx.createGain();
    swirlLfoGain.gain.setValueAtTime(95, ctx.currentTime);
    swirlLfo.connect(swirlLfoGain);
    swirlLfoGain.connect(swirlFilter.frequency);

    // Filter 3 & 4: Cascaded Lowpass (24dB/octave slope) strictly cutting frequencies above 1300Hz
    // This completely eliminates high frequency white noise and hiss
    const lowpass1 = ctx.createBiquadFilter();
    lowpass1.type = 'lowpass';
    lowpass1.frequency.setValueAtTime(1100, ctx.currentTime);
    lowpass1.Q.setValueAtTime(0.7, ctx.currentTime);

    const lowpass2 = ctx.createBiquadFilter();
    lowpass2.type = 'lowpass';
    lowpass2.frequency.setValueAtTime(1450, ctx.currentTime);
    lowpass2.Q.setValueAtTime(0.7, ctx.currentTime);

    const streamMixGain = ctx.createGain();
    streamMixGain.gain.setValueAtTime(1.25, ctx.currentTime);

    noiseSource.connect(bodyFilter);
    noiseSource.connect(swirlFilter);
    bodyFilter.connect(lowpass1);
    swirlFilter.connect(lowpass1);
    lowpass1.connect(lowpass2);
    lowpass2.connect(streamMixGain);
    streamMixGain.connect(destination);

    noiseSource.start();
    lfo.start();
    swirlLfo.start();

    sources.push(noiseSource, lfo, swirlLfo, bodyFilter, swirlFilter, lowpass1, lowpass2, streamMixGain);

    return () => {};
  }

  // =========================================================================
  // 2. GENTLE RAIN (Faithful replica of iPhone "Rain")
  // Soft, velvety steady rainfall. Zero digital clicks or static crackle.
  // Windowed micro-wavelets for soft droplet impacts, with steep high-shelf rolloff.
  // =========================================================================
  private synthesizeRain(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    const duration = 8.0;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const rainBuffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = rainBuffer.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      let brown = 0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
        b6 = white * 0.115926;

        brown = (brown + 0.02 * white) / 1.02;

        // Rich gentle rainbed (75% pink, 25% brown)
        data[i] = pink * 0.85 + brown * 0.35;
      }

      // Add gentle, soft acoustic rain droplets (Hann-windowed wavelets between 550Hz - 1100Hz)
      // Never single-sample spikes! Soft wavelets sound like rain falling on earth and leaves.
      const dropletCount = Math.floor(180 + Math.random() * 60);
      for (let d = 0; d < dropletCount; d++) {
        const dropFreq = 580 + Math.random() * 520; // 580 - 1100 Hz
        const dropDur = 0.008 + Math.random() * 0.008; // 8ms - 16ms
        const dropFrames = Math.floor(sampleRate * dropDur);
        const startFrame = Math.floor(Math.random() * (frameCount - dropFrames - 100));
        const dropAmp = 0.025 + Math.random() * 0.035;

        for (let j = 0; j < dropFrames; j++) {
          const t = j / sampleRate;
          // Smooth Hann window prevents any high frequency clicks
          const window = 0.5 * (1 - Math.cos((2 * Math.PI * j) / dropFrames));
          const sample = Math.sin(2 * Math.PI * dropFreq * t) * dropAmp * window;
          data[startFrame + j] += sample;
        }
      }

      // Smooth loop crossfade
      const fadeCount = Math.floor(sampleRate * 0.25);
      for (let i = 0; i < fadeCount; i++) {
        const t = i / fadeCount;
        data[i] = data[i] * t + data[frameCount - fadeCount + i] * (1 - t);
      }
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = rainBuffer;
    rainSource.loop = true;

    // Body warmth boost (around 420 Hz) for deep comforting rainfall
    const warmthFilter = ctx.createBiquadFilter();
    warmthFilter.type = 'peaking';
    warmthFilter.frequency.setValueAtTime(420, ctx.currentTime);
    warmthFilter.gain.setValueAtTime(3.0, ctx.currentTime);
    warmthFilter.Q.setValueAtTime(1.2, ctx.currentTime);

    // High Shelf attenuation: -10 dB above 2200 Hz to eliminate all harshness and ear fatigue
    const highShelf = ctx.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.setValueAtTime(2200, ctx.currentTime);
    highShelf.gain.setValueAtTime(-10.0, ctx.currentTime);

    // Cascaded Lowpass filter at 2200 Hz
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(2200, ctx.currentTime);
    lowpass.Q.setValueAtTime(0.7, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.95, ctx.currentTime);

    rainSource.connect(warmthFilter);
    warmthFilter.connect(highShelf);
    highShelf.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(destination);

    rainSource.start();
    sources.push(rainSource, warmthFilter, highShelf, lowpass, rainGain);

    return () => {};
  }

  // =========================================================================
  // 3. ROOF RAIN / ROOM RAIN (Cozy rain on roof heard from inside)
  // Deep acoustic low-pass filtering by ceiling & roof structure.
  // Warm, damped acoustic resonances (170Hz - 340Hz) for rhythmic raindrops pattering overhead.
  // Absolute zero high frequencies or harsh metallic ringing.
  // =========================================================================
  private synthesizeRoofRain(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    const duration = 8.0;
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * duration);
    const roofBuffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = roofBuffer.getChannelData(ch);
      let brown = 0;

      // Inside a room, the rainstorm outside is heard as a warm, muffled low roar (< 400Hz)
      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        brown = (brown + 0.015 * white) / 1.015;
        data[i] = brown * 1.4;
      }

      // Add cozy roof raindrop impacts:
      // Rain striking wood/tin roof heard from inside vibrates with damped low-mid room resonance.
      // Mode frequencies: 170Hz, 220Hz, 280Hz, 340Hz.
      const numTaps = Math.floor(130 + Math.random() * 40);
      for (let tIdx = 0; tIdx < numTaps; tIdx++) {
        const modes = [170, 220, 275, 330];
        const tapFreq = modes[Math.floor(Math.random() * modes.length)] + (Math.random() * 30 - 15);
        const tapDur = 0.035 + Math.random() * 0.025; // 35ms - 60ms
        const tapFrames = Math.floor(sampleRate * tapDur);
        const startFrame = Math.floor(Math.random() * (frameCount - tapFrames - 100));
        const tapAmp = 0.04 + Math.random() * 0.055;

        for (let j = 0; j < tapFrames; j++) {
          const t = j / sampleRate;
          // 2.5ms rounded attack, followed by exponential decay of the roof panel vibration
          const attackFrames = Math.floor(sampleRate * 0.0025);
          const envAtt = j < attackFrames ? 0.5 * (1 - Math.cos((Math.PI * j) / attackFrames)) : 1.0;
          const envDec = Math.exp(-t / 0.016);
          const sample = Math.sin(2 * Math.PI * tapFreq * t) * tapAmp * envAtt * envDec;
          data[startFrame + j] += sample;
        }
      }

      // Smooth loop crossfade
      const fadeCount = Math.floor(sampleRate * 0.25);
      for (let i = 0; i < fadeCount; i++) {
        const t = i / fadeCount;
        data[i] = data[i] * t + data[frameCount - fadeCount + i] * (1 - t);
      }
    }

    const roofSource = ctx.createBufferSource();
    roofSource.buffer = roofBuffer;
    roofSource.loop = true;

    // Cavity resonance filter: hollow room warmth (240 Hz)
    const cavityFilter = ctx.createBiquadFilter();
    cavityFilter.type = 'peaking';
    cavityFilter.frequency.setValueAtTime(240, ctx.currentTime);
    cavityFilter.gain.setValueAtTime(5.0, ctx.currentTime);
    cavityFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Cascaded Lowpass filter 1: 750 Hz (attenuates outdoor rain spray)
    const lowpass1 = ctx.createBiquadFilter();
    lowpass1.type = 'lowpass';
    lowpass1.frequency.setValueAtTime(750, ctx.currentTime);
    lowpass1.Q.setValueAtTime(0.7, ctx.currentTime);

    // Cascaded Lowpass filter 2: 1050 Hz (steep 24dB/octave rolloff - zero high frequencies!)
    const lowpass2 = ctx.createBiquadFilter();
    lowpass2.type = 'lowpass';
    lowpass2.frequency.setValueAtTime(1050, ctx.currentTime);
    lowpass2.Q.setValueAtTime(0.7, ctx.currentTime);

    const roofGain = ctx.createGain();
    roofGain.gain.setValueAtTime(1.2, ctx.currentTime);

    roofSource.connect(cavityFilter);
    cavityFilter.connect(lowpass1);
    lowpass1.connect(lowpass2);
    lowpass2.connect(roofGain);
    roofGain.connect(destination);

    roofSource.start();
    sources.push(roofSource, cavityFilter, lowpass1, lowpass2, roofGain);

    return () => {};
  }

  // =========================================================================
  // 4. OCEAN WAVES
  // Deep rhythmic ocean swell with soft, warm rolling surf.
  // =========================================================================
  private synthesizeWaves(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    const brownBuffer = this.generateBrownNoiseBuffer(ctx, 10.0);
    const pinkBuffer = this.generatePinkNoiseBuffer(ctx, 10.0);

    const deepSource = ctx.createBufferSource();
    deepSource.buffer = brownBuffer;
    deepSource.loop = true;

    const foamSource = ctx.createBufferSource();
    foamSource.buffer = pinkBuffer;
    foamSource.loop = true;

    // Deep swell filter: warm ocean undertone
    const deepFilter = ctx.createBiquadFilter();
    deepFilter.type = 'lowpass';
    deepFilter.frequency.setValueAtTime(220, ctx.currentTime);

    // Foam filter: soft water wash, cut off above 1100 Hz to prevent hiss
    const foamFilter = ctx.createBiquadFilter();
    foamFilter.type = 'bandpass';
    foamFilter.frequency.setValueAtTime(650, ctx.currentTime);
    foamFilter.Q.setValueAtTime(1.0, ctx.currentTime);

    const foamLowpass = ctx.createBiquadFilter();
    foamLowpass.type = 'lowpass';
    foamLowpass.frequency.setValueAtTime(1200, ctx.currentTime);

    // Rhythmic 8.5s wave swell envelope
    const waveLfo = ctx.createOscillator();
    waveLfo.type = 'sine';
    waveLfo.frequency.setValueAtTime(1 / 8.5, ctx.currentTime);

    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0.5, ctx.currentTime);

    const waveModGain = ctx.createGain();
    waveModGain.gain.setValueAtTime(0.42, ctx.currentTime);
    waveLfo.connect(waveModGain);
    waveModGain.connect(swellGain.gain);

    const deepGain = ctx.createGain();
    deepGain.gain.setValueAtTime(1.3, ctx.currentTime);

    const foamGain = ctx.createGain();
    foamGain.gain.setValueAtTime(0.45, ctx.currentTime);

    deepSource.connect(deepFilter);
    deepFilter.connect(deepGain);
    deepGain.connect(swellGain);

    foamSource.connect(foamFilter);
    foamFilter.connect(foamLowpass);
    foamLowpass.connect(foamGain);
    foamGain.connect(swellGain);

    swellGain.connect(destination);

    deepSource.start();
    foamSource.start();
    waveLfo.start();

    sources.push(deepSource, foamSource, waveLfo, deepFilter, foamFilter, foamLowpass, swellGain);

    return () => {};
  }

  // =========================================================================
  // 5. DEEP FOCUS (Velvet brown noise + 10Hz Alpha brainwave entrainment)
  // =========================================================================
  private synthesizeDeepFocus(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    const brownBuffer = this.generateBrownNoiseBuffer(ctx, 8.0);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = brownBuffer;
    noiseSource.loop = true;

    // Lowpass filter to ensure deep soothing warmth with zero ear fatigue
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.85, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(destination);

    // Subtle 10Hz Alpha Binaural Tone (Left: 216Hz, Right: 226Hz => 10Hz differential)
    const oscLeft = ctx.createOscillator();
    const oscRight = ctx.createOscillator();
    const panLeft = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panRight = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(216, ctx.currentTime);

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(226, ctx.currentTime);

    const alphaToneGain = ctx.createGain();
    alphaToneGain.gain.setValueAtTime(0.038, ctx.currentTime);

    if (panLeft && panRight) {
      panLeft.pan.setValueAtTime(-0.85, ctx.currentTime);
      panRight.pan.setValueAtTime(0.85, ctx.currentTime);
      oscLeft.connect(panLeft);
      panLeft.connect(alphaToneGain);
      oscRight.connect(panRight);
      panRight.connect(alphaToneGain);
    } else {
      oscLeft.connect(alphaToneGain);
      oscRight.connect(alphaToneGain);
    }

    alphaToneGain.connect(destination);

    noiseSource.start();
    oscLeft.start();
    oscRight.start();

    sources.push(noiseSource, oscLeft, oscRight, filter, noiseGain, alphaToneGain);

    return () => {};
  }

  // =========================================================================
  // 6. FOREST BREEZE (Whispering wind through tree canopy)
  // =========================================================================
  private synthesizeForestBreeze(ctx: AudioContext, destination: GainNode, sources: AudioNode[]) {
    const pinkBuffer = this.generatePinkNoiseBuffer(ctx, 8.0);
    const windSource = ctx.createBufferSource();
    windSource.buffer = pinkBuffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(360, ctx.currentTime);
    windFilter.Q.setValueAtTime(1.4, ctx.currentTime);

    const windLowpass = ctx.createBiquadFilter();
    windLowpass.type = 'lowpass';
    windLowpass.frequency.setValueAtTime(800, ctx.currentTime);

    // Gentle wind gust LFO (period ~11 seconds)
    const windLfo = ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.09, ctx.currentTime);
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(120, ctx.currentTime);
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.75, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windLowpass);
    windLowpass.connect(windGain);
    windGain.connect(destination);

    windSource.start();
    windLfo.start();

    sources.push(windSource, windLfo, windFilter, windLowpass, windGain);

    return () => {};
  }

  // Helper: Seamless Pink Noise Buffer Generator
  private generatePinkNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
        b6 = white * 0.115926;
      }

      // Loop smoothing
      const fadeCount = Math.floor(sampleRate * 0.2);
      for (let i = 0; i < fadeCount; i++) {
        const t = i / fadeCount;
        data[i] = data[i] * t + data[frameCount - fadeCount + i] * (1 - t);
      }
    }

    return buffer;
  }

  // Helper: Seamless Brown Noise Buffer Generator
  private generateBrownNoiseBuffer(ctx: AudioContext, durationSeconds: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const frameCount = Math.floor(sampleRate * durationSeconds);
    const buffer = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;

      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 1.8;
      }

      // Loop smoothing
      const fadeCount = Math.floor(sampleRate * 0.25);
      for (let i = 0; i < fadeCount; i++) {
        const t = i / fadeCount;
        data[i] = data[i] * t + data[frameCount - fadeCount + i] * (1 - t);
      }
    }

    return buffer;
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
