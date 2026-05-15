import blueKey01Url from '@/assets/sounds/keyboard/blue-01.wav?url';
import blueKey02Url from '@/assets/sounds/keyboard/blue-02.wav?url';
import blueKey03Url from '@/assets/sounds/keyboard/blue-03.wav?url';
import blueKey04Url from '@/assets/sounds/keyboard/blue-04.wav?url';

/**
 * CodeStep audio system.
 *
 * The product sound direction is a sustainable training groove:
 * mechanical key samples carry the rhythm, while synthetic sounds are reserved
 * for sparse UI, negative, and reward feedback.
 */

export type SoundType =
  | 'click'
  | 'combo-increment'
  | 'combo-reset'
  | 'combo-milestone'
  | 'new-best'
  | 'perfect'
  | 'success'
  | 'error'
  | 'run-code'
  | 'typing'
  | 'complete';

type SoundCategory = 'input' | 'negative' | 'reward' | 'ui';

interface SynthSoundConfig {
  category: SoundCategory;
  priority: number;
  notes: number[];
  duration: number;
  type: OscillatorType;
  gain: number;
  fadeIn?: number;
  fadeOut?: number;
  noteGap?: number;
  filter?: {
    type: BiquadFilterType;
    frequency: number;
    q?: number;
  };
}

interface PendingReward {
  soundType: SoundType;
  config: SynthSoundConfig;
}

const KEYBOARD_SAMPLE_URLS = [
  blueKey01Url,
  blueKey02Url,
  blueKey03Url,
  blueKey04Url,
];

const CATEGORY_GAIN: Record<SoundCategory, number> = {
  input: 0.45,
  ui: 0.35,
  negative: 0.5,
  reward: 0.65,
};

const REWARD_COOLDOWN_MS = 120;

const SYNTH_SOUNDS: Record<Exclude<SoundType, 'typing'>, SynthSoundConfig> = {
  click: {
    category: 'ui',
    priority: 1,
    notes: [720],
    duration: 0.07,
    type: 'triangle',
    gain: 0.28,
    fadeIn: 0.004,
    fadeOut: 0.045,
  },
  'combo-increment': {
    category: 'reward',
    priority: 1,
    notes: [620],
    duration: 0.08,
    type: 'sine',
    gain: 0.18,
    fadeIn: 0.004,
    fadeOut: 0.05,
  },
  'combo-reset': {
    category: 'negative',
    priority: 1,
    notes: [155],
    duration: 0.085,
    type: 'triangle',
    gain: 0.42,
    fadeIn: 0.003,
    fadeOut: 0.065,
    filter: { type: 'lowpass', frequency: 700, q: 0.4 },
  },
  'combo-milestone': {
    category: 'reward',
    priority: 3,
    notes: [740, 980],
    duration: 0.22,
    noteGap: 0.055,
    type: 'sine',
    gain: 0.38,
    fadeIn: 0.006,
    fadeOut: 0.08,
  },
  'new-best': {
    category: 'reward',
    priority: 5,
    notes: [880, 1175, 1568],
    duration: 0.36,
    noteGap: 0.06,
    type: 'triangle',
    gain: 0.44,
    fadeIn: 0.006,
    fadeOut: 0.12,
  },
  perfect: {
    category: 'reward',
    priority: 4,
    notes: [1047, 1319, 1760],
    duration: 0.4,
    noteGap: 0.07,
    type: 'triangle',
    gain: 0.4,
    fadeIn: 0.006,
    fadeOut: 0.13,
  },
  success: {
    category: 'reward',
    priority: 2,
    notes: [830, 1109],
    duration: 0.24,
    noteGap: 0.06,
    type: 'sine',
    gain: 0.3,
    fadeIn: 0.006,
    fadeOut: 0.08,
  },
  error: {
    category: 'negative',
    priority: 2,
    notes: [125],
    duration: 0.115,
    type: 'triangle',
    gain: 0.45,
    fadeIn: 0.003,
    fadeOut: 0.09,
    filter: { type: 'lowpass', frequency: 540, q: 0.5 },
  },
  'run-code': {
    category: 'ui',
    priority: 1,
    notes: [460],
    duration: 0.12,
    type: 'triangle',
    gain: 0.26,
    fadeIn: 0.01,
    fadeOut: 0.07,
  },
  complete: {
    category: 'reward',
    priority: 6,
    notes: [659, 880, 1175, 1568],
    duration: 0.45,
    noteGap: 0.07,
    type: 'triangle',
    gain: 0.42,
    fadeIn: 0.01,
    fadeOut: 0.14,
  },
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.5;
  private initialized = false;
  private samplesReady = false;
  private samplesFailed = false;
  private keyboardBuffers: AudioBuffer[] = [];
  private keyboardSamplesPromise: Promise<void> | null = null;
  private pendingReward: PendingReward | null = null;
  private rewardTimer: ReturnType<typeof setTimeout> | null = null;
  private storageKey = 'codestep-sound-enabled';

  private loadPreference(): boolean {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === null) return true;
      return saved === 'true';
    } catch {
      return true;
    }
  }

  private savePreference(enabled: boolean): void {
    try {
      localStorage.setItem(this.storageKey, String(enabled));
    } catch {
      // ignore storage failures
    }
  }

  init(): void {
    if (!this.initialized) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.enabled = this.loadPreference();
        this.initialized = true;
        this.loadKeyboardSamples();
      } catch (err) {
        console.warn('[SoundManager] Failed to initialize:', err);
        this.enabled = false;
      }
    }

    this.ensureContextRunning();
  }

  play(soundType: SoundType): void {
    if (!this.enabled || !this.initialized || !this.audioContext) return;

    this.ensureContextRunning();

    try {
      if (soundType === 'typing') {
        this.playKeyboardTyping();
        return;
      }

      const config = SYNTH_SOUNDS[soundType];
      if (!config) return;

      if (config.category === 'reward') {
        this.queueReward(soundType, config);
        return;
      }

      this.playSynth(config);
    } catch (err) {
      console.warn(`[SoundManager] Failed to play sound ${soundType}:`, err);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.savePreference(enabled);
    if (!enabled) {
      this.clearPendingReward();
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      initialized: this.initialized,
      samplesReady: this.samplesReady,
      samplesFailed: this.samplesFailed,
    };
  }

  private ensureContextRunning(): void {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume().catch(() => {
        // The next user gesture will try again.
      });
    }
  }

  private loadKeyboardSamples(): void {
    if (!this.audioContext || this.keyboardSamplesPromise) return;

    this.keyboardSamplesPromise = Promise.all(
      KEYBOARD_SAMPLE_URLS.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to load keyboard sample: ${url}`);
        }
        const data = await response.arrayBuffer();
        return this.audioContext!.decodeAudioData(data);
      }),
    )
      .then((buffers) => {
        this.keyboardBuffers = buffers;
        this.samplesReady = buffers.length > 0;
        this.samplesFailed = false;
      })
      .catch((err) => {
        console.warn('[SoundManager] Keyboard samples unavailable; using fallback click.', err);
        this.keyboardBuffers = [];
        this.samplesReady = false;
        this.samplesFailed = true;
      });
  }

  private playKeyboardTyping(): void {
    if (!this.audioContext) return;

    if (!this.samplesReady || this.keyboardBuffers.length === 0) {
      this.playFallbackKeyboardClick();
      return;
    }

    const buffer = this.keyboardBuffers[Math.floor(Math.random() * this.keyboardBuffers.length)];
    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const now = this.audioContext.currentTime;

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(0.96 + Math.random() * 0.08, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(85, now);

    gain.gain.setValueAtTime(
      CATEGORY_GAIN.input * this.volume * (0.9 + Math.random() * 0.18),
      now,
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    source.start(now);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  private playFallbackKeyboardClick(): void {
    this.playSynth({
      category: 'input',
      priority: 0,
      notes: [2600],
      duration: 0.045,
      type: 'triangle',
      gain: 0.22,
      fadeIn: 0.002,
      fadeOut: 0.035,
      filter: { type: 'highpass', frequency: 900, q: 0.7 },
    });
  }

  private queueReward(soundType: SoundType, config: SynthSoundConfig): void {
    if (!this.pendingReward || config.priority >= this.pendingReward.config.priority) {
      this.pendingReward = { soundType, config };
    }

    if (this.rewardTimer) return;

    this.rewardTimer = setTimeout(() => {
      const reward = this.pendingReward;
      this.clearPendingReward();
      if (reward && this.enabled) {
        this.playSynth(reward.config);
      }
    }, REWARD_COOLDOWN_MS);
  }

  private clearPendingReward(): void {
    if (this.rewardTimer) {
      clearTimeout(this.rewardTimer);
      this.rewardTimer = null;
    }
    this.pendingReward = null;
  }

  private playSynth(config: SynthSoundConfig): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const noteGap = config.noteGap ?? 0;
    const noteDuration = Math.max(
      0.035,
      (config.duration - noteGap * Math.max(0, config.notes.length - 1)) / config.notes.length,
    );

    config.notes.forEach((frequency, index) => {
      const startAt = now + index * noteGap;
      const stopAt = startAt + noteDuration;
      const oscillator = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      const outputNode = this.createFilter(config);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(frequency, startAt);

      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(
        config.gain * CATEGORY_GAIN[config.category] * this.volume,
        startAt + (config.fadeIn ?? 0.005),
      );
      gain.gain.exponentialRampToValueAtTime(0.001, stopAt + (config.fadeOut ?? 0.06));

      oscillator.connect(gain);
      gain.connect(outputNode);
      outputNode.connect(this.audioContext!.destination);

      oscillator.start(startAt);
      oscillator.stop(stopAt + (config.fadeOut ?? 0.06));

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
        outputNode.disconnect();
      };
    });
  }

  private createFilter(config: SynthSoundConfig): AudioNode {
    if (!this.audioContext || !config.filter) {
      return this.audioContext!.createGain();
    }

    const filter = this.audioContext.createBiquadFilter();
    filter.type = config.filter.type;
    filter.frequency.setValueAtTime(config.filter.frequency, this.audioContext.currentTime);
    if (config.filter.q !== undefined) {
      filter.Q.setValueAtTime(config.filter.q, this.audioContext.currentTime);
    }
    return filter;
  }
}

export const soundManager = new SoundManager();

export function playSound(soundType: SoundType): void {
  soundManager.play(soundType);
}

export function initSound(): void {
  soundManager.init();
}

export function setSoundEnabled(enabled: boolean): void {
  soundManager.setEnabled(enabled);
}

export function setSoundVolume(volume: number): void {
  soundManager.setVolume(volume);
}

export function getSoundStatus() {
  return soundManager.getStatus();
}
