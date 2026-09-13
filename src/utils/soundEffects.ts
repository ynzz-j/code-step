import key01Url from '@/assets/sounds/codestep-v1/key-01.ogg?url';
import key02Url from '@/assets/sounds/codestep-v1/key-02.ogg?url';
import key03Url from '@/assets/sounds/codestep-v1/key-03.ogg?url';
import key04Url from '@/assets/sounds/codestep-v1/key-04.ogg?url';
import key05Url from '@/assets/sounds/codestep-v1/key-05.ogg?url';
import key06Url from '@/assets/sounds/codestep-v1/key-06.ogg?url';
import key07Url from '@/assets/sounds/codestep-v1/key-07.ogg?url';
import key08Url from '@/assets/sounds/codestep-v1/key-08.ogg?url';
import spaceUrl from '@/assets/sounds/codestep-v1/space.ogg?url';
import enterUrl from '@/assets/sounds/codestep-v1/enter.ogg?url';
import backspaceUrl from '@/assets/sounds/codestep-v1/backspace.ogg?url';
import errorUrl from '@/assets/sounds/codestep-v1/error.ogg?url';
import combo10Url from '@/assets/sounds/codestep-v1/combo-10.ogg?url';
import combo20Url from '@/assets/sounds/codestep-v1/combo-20.ogg?url';
import combo30Url from '@/assets/sounds/codestep-v1/combo-30.ogg?url';
import perfectUrl from '@/assets/sounds/codestep-v1/perfect.ogg?url';
import newBestUrl from '@/assets/sounds/codestep-v1/new-best.ogg?url';
import completeUrl from '@/assets/sounds/codestep-v1/complete.ogg?url';
import motifUrl from '@/assets/sounds/codestep-v1/motif.ogg?url';

/**
 * CodeStep audio system — CodeStep Sound Pack v1（深夜蓝 + 琥珀）。
 *
 * 触发规则来自音效包 manifest：
 * - 正确输入只播键声（8 变体随机轮换，不做额外变调）；Space/Enter/Backspace 只播对应大键音。
 * - 错误提示间隔 ≥ 90ms；奖励音按 New Best > Complete > Perfect > Combo30 > Combo20 > Combo10
 *   取最高一项，奖励间隔 ≥ 300ms；键声照常播放。
 * - 每个采样使用包内标定的电平（音量 = 文件电平 × 主音量，不叠加分类系数）。
 * - 无采样覆盖的少量 UI/兜底音（click / combo-reset / success）仍走程序合成。
 */

export type SoundType =
  | 'click'
  | 'combo-reset'
  | 'combo-10'
  | 'combo-20'
  | 'combo-30'
  | 'new-best'
  | 'perfect'
  | 'success'
  | 'error'
  | 'complete'
  | 'motif'
  | 'typing';

type TypingVariant = 'key' | 'space' | 'enter' | 'backspace';

type SampleName =
  | 'key-01' | 'key-02' | 'key-03' | 'key-04'
  | 'key-05' | 'key-06' | 'key-07' | 'key-08'
  | 'space' | 'enter' | 'backspace' | 'error'
  | 'combo-10' | 'combo-20' | 'combo-30'
  | 'perfect' | 'new-best' | 'complete' | 'motif';

/** 包内标定电平（manifest 建议音量） */
const SAMPLE_CONFIG: Record<SampleName, { url: string; volume: number }> = {
  'key-01': { url: key01Url, volume: 0.45 },
  'key-02': { url: key02Url, volume: 0.45 },
  'key-03': { url: key03Url, volume: 0.45 },
  'key-04': { url: key04Url, volume: 0.45 },
  'key-05': { url: key05Url, volume: 0.45 },
  'key-06': { url: key06Url, volume: 0.45 },
  'key-07': { url: key07Url, volume: 0.45 },
  'key-08': { url: key08Url, volume: 0.45 },
  space: { url: spaceUrl, volume: 0.42 },
  enter: { url: enterUrl, volume: 0.45 },
  backspace: { url: backspaceUrl, volume: 0.35 },
  error: { url: errorUrl, volume: 0.35 },
  'combo-10': { url: combo10Url, volume: 0.4 },
  'combo-20': { url: combo20Url, volume: 0.43 },
  'combo-30': { url: combo30Url, volume: 0.45 },
  perfect: { url: perfectUrl, volume: 0.48 },
  'new-best': { url: newBestUrl, volume: 0.55 },
  complete: { url: completeUrl, volume: 0.5 },
  motif: { url: motifUrl, volume: 0.48 },
};

const KEY_SAMPLE_NAMES: SampleName[] = ['key-01', 'key-02', 'key-03', 'key-04', 'key-05', 'key-06', 'key-07', 'key-08'];

/** 奖励优先级：数值越高越优先（manifest：New Best > Complete > Perfect > Combo30 > Combo20 > Combo10） */
export const REWARD_PRIORITY: Partial<Record<SoundType, number>> = {
  'combo-10': 3,
  'combo-20': 4,
  'combo-30': 5,
  perfect: 6,
  complete: 7,
  'new-best': 8,
};

const REWARD_COOLDOWN_MS = 300;
const ERROR_COOLDOWN_MS = 90;

interface SynthSoundConfig {
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

/** 无采样覆盖的少量 UI/兜底音，仍走程序合成 */
const SYNTH_SOUNDS: Partial<Record<SoundType, SynthSoundConfig>> = {
  click: {
    notes: [720],
    duration: 0.07,
    type: 'triangle',
    gain: 0.28,
    fadeIn: 0.004,
    fadeOut: 0.045,
  },
  'combo-reset': {
    notes: [155],
    duration: 0.085,
    type: 'triangle',
    gain: 0.42,
    fadeIn: 0.003,
    fadeOut: 0.065,
    filter: { type: 'lowpass', frequency: 700, q: 0.4 },
  },
  success: {
    notes: [830, 1109],
    duration: 0.24,
    noteGap: 0.06,
    type: 'sine',
    gain: 0.3,
    fadeIn: 0.006,
    fadeOut: 0.08,
  },
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.5;
  private initialized = false;
  private samplesReady = false;
  private samplesFailed = false;
  private sampleBuffers: Partial<Record<SampleName, AudioBuffer>> = {};
  private samplesPromise: Promise<void> | null = null;
  private pendingReward: { priority: number; play: () => void } | null = null;
  private rewardTimer: ReturnType<typeof setTimeout> | null = null;
  private lastErrorAt = 0;
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
        this.loadSamples();
      } catch (err) {
        console.warn('[SoundManager] Failed to initialize:', err);
        this.enabled = false;
      }
    }

    this.ensureContextRunning();
  }

  play(soundType: SoundType, options?: { variant?: TypingVariant }): void {
    if (!this.enabled || !this.initialized || !this.audioContext) return;

    this.ensureContextRunning();

    try {
      if (soundType === 'typing') {
        this.playTyping(options?.variant ?? 'key');
        return;
      }

      if (soundType === 'error') {
        this.playError();
        return;
      }

      const priority = REWARD_PRIORITY[soundType];
      if (priority !== undefined) {
        this.queueReward(priority, () => this.playSample(soundType as SampleName));
        return;
      }

      const config = SYNTH_SOUNDS[soundType];
      if (!config) return;
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

  private loadSamples(): void {
    if (!this.audioContext || this.samplesPromise) return;

    const names = Object.keys(SAMPLE_CONFIG) as SampleName[];
    this.samplesPromise = Promise.all(
      names.map(async (name) => {
        const response = await fetch(SAMPLE_CONFIG[name].url);
        if (!response.ok) {
          throw new Error(`Failed to load sample: ${name}`);
        }
        const data = await response.arrayBuffer();
        const buffer = await this.audioContext!.decodeAudioData(data);
        this.sampleBuffers[name] = buffer;
      }),
    )
      .then(() => {
        this.samplesReady = true;
        this.samplesFailed = false;
      })
      .catch((err) => {
        console.warn('[SoundManager] Sound pack samples unavailable.', err);
        this.samplesReady = false;
        this.samplesFailed = true;
      });
  }

  private playSample(name: SampleName, gainScale = 1): void {
    if (!this.audioContext) return;
    const buffer = this.sampleBuffers[name];
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    const gain = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    source.buffer = buffer;
    gain.gain.setValueAtTime(SAMPLE_CONFIG[name].volume * this.volume * gainScale, now);

    source.connect(gain);
    gain.connect(this.audioContext.destination);

    source.start(now);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
    };
  }

  private playTyping(variant: TypingVariant): void {
    switch (variant) {
      case 'space':
        this.playSample('space');
        break;
      case 'enter':
        this.playSample('enter');
        break;
      case 'backspace':
        this.playSample('backspace');
        break;
      default: {
        const name = KEY_SAMPLE_NAMES[Math.floor(Math.random() * KEY_SAMPLE_NAMES.length)];
        this.playSample(name);
      }
    }
  }

  private playError(): void {
    const now = performance.now();
    if (now - this.lastErrorAt < ERROR_COOLDOWN_MS) return;
    this.lastErrorAt = now;
    this.playSample('error');
  }

  private queueReward(priority: number, play: () => void): void {
    if (!this.pendingReward || priority >= this.pendingReward.priority) {
      this.pendingReward = { priority, play };
    }

    if (this.rewardTimer) return;

    this.rewardTimer = setTimeout(() => {
      const reward = this.pendingReward;
      this.clearPendingReward();
      if (reward && this.enabled) {
        reward.play();
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
    const outputGain = this.audioContext.createGain();
    outputGain.gain.value = this.volume;
    outputGain.connect(this.audioContext.destination);

    config.notes.forEach((frequency, index) => {
      const startAt = now + index * noteGap;
      const stopAt = startAt + noteDuration;
      const oscillator = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(frequency, startAt);

      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(config.gain, startAt + (config.fadeIn ?? 0.005));
      gain.gain.exponentialRampToValueAtTime(0.001, stopAt + (config.fadeOut ?? 0.06));

      oscillator.connect(gain);
      gain.connect(outputGain);

      oscillator.start(startAt);
      oscillator.stop(stopAt + (config.fadeOut ?? 0.06));

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    });
  }
}

export const soundManager = new SoundManager();

export function playSound(soundType: SoundType, options?: { variant?: TypingVariant }): void {
  soundManager.play(soundType, options);
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
