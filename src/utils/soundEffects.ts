/**
 * CodeStep 音效系统
 * 使用 Web Audio API 生成音效，无需外部音频文件
 */

// 音效类型
export type SoundType =
  | 'click' // 按钮点击
  | 'combo-increment' // 连击增加
  | 'combo-reset' // 连击中断
  | 'combo-milestone' // 连击里程碑（5/10/20/30）
  | 'new-best' // 新纪录
  | 'success' // 步骤通过
  | 'error' // 错误
  | 'run-code' // 运行代码
  | 'typing' // 打字声音
  | 'complete'; // 课程完成

// 音效配置
interface SoundConfig {
  frequency: number; // 频率 (Hz)
  duration: number; // 时长 (秒)
  type: OscillatorType; // 波形类型
  gain: number; // 音量 (0-1)
  fadeIn?: number; // 淡入时长
  fadeOut?: number; // 淡出时长
}

// 音效配置映射
const SOUND_PRESETS: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 0.1,
    type: 'sine',
    gain: 0.3,
    fadeIn: 0.01,
    fadeOut: 0.05,
  },
  'combo-increment': {
    frequency: 600,
    duration: 0.15,
    type: 'sine',
    gain: 0.4,
    fadeIn: 0.01,
    fadeOut: 0.1,
  },
  'combo-reset': {
    frequency: 300,
    duration: 0.3,
    type: 'sawtooth',
    gain: 0.3,
    fadeIn: 0.01,
    fadeOut: 0.2,
  },
  'combo-milestone': {
    frequency: 1200,
    duration: 0.4,
    type: 'sine',
    gain: 0.5,
    fadeIn: 0.05,
    fadeOut: 0.2,
  },
  'new-best': {
    frequency: 1500,
    duration: 0.5,
    type: 'sine',
    gain: 0.6,
    fadeIn: 0.1,
    fadeOut: 0.3,
  },
  success: {
    frequency: 1000,
    duration: 0.3,
    type: 'sine',
    gain: 0.5,
    fadeIn: 0.05,
    fadeOut: 0.15,
  },
  error: {
    frequency: 200,
    duration: 0.4,
    type: 'sawtooth',
    gain: 0.4,
    fadeIn: 0.01,
    fadeOut: 0.3,
  },
  'run-code': {
    frequency: 500,
    duration: 0.2,
    type: 'triangle',
    gain: 0.3,
    fadeIn: 0.02,
    fadeOut: 0.1,
  },
  typing: {
    frequency: 1000 + Math.random() * 500, // 随机频率模拟打字机
    duration: 0.05,
    type: 'sine',
    gain: 0.15,
    fadeIn: 0.01,
    fadeOut: 0.02,
  },
  complete: {
    frequency: 800,
    duration: 0.8,
    type: 'sine',
    gain: 0.6,
    fadeIn: 0.1,
    fadeOut: 0.4,
  },
};

// 音效管理器类
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;
  private initialized: boolean = false;
  private storageKey = 'codestep-sound-enabled';

  // 从 localStorage 读取用户音效偏好
  private loadPreference(): boolean {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved === null) return true; // 默认开启
      return saved === 'true';
    } catch {
      return true;
    }
  }

  // 保存用户音效偏好到 localStorage
  private savePreference(enabled: boolean): void {
    try {
      localStorage.setItem(this.storageKey, String(enabled));
    } catch { /* ignore */ }
  }

  // 初始化 AudioContext（需要用户交互后调用）
  init(): void {
    if (this.initialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.enabled = this.loadPreference();
      this.initialized = true;
      console.log('[SoundManager] Initialized, enabled:', this.enabled);
    } catch (err) {
      console.warn('[SoundManager] Failed to initialize:', err);
      this.enabled = false;
    }
  }

  // 播放音效
  play(soundType: SoundType): void {
    if (!this.enabled || !this.initialized || !this.audioContext) return;

    try {
      const config = SOUND_PRESETS[soundType];
      if (!config) {
        console.warn(`[SoundManager] Unknown sound type: ${soundType}`);
        return;
      }

      // 创建振荡器
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // 配置振荡器
      oscillator.type = config.type;

      // typing 音效每次播放时随机频率，模拟打字机质感
      const frequency = soundType === 'typing'
        ? 800 + Math.random() * 800
        : config.frequency;
      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );

      // 配置音量
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        config.gain * this.volume,
        this.audioContext.currentTime + (config.fadeIn || 0.01)
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + config.duration
      );

      // 连接节点
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // 播放
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + config.duration);

      // 清理
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (err) {
      console.warn(`[SoundManager] Failed to play sound ${soundType}:`, err);
    }
  }

  // 启用/禁用音效
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.savePreference(enabled);
    console.log(`[SoundManager] ${enabled ? 'Enabled' : 'Disabled'}`);
  }

  // 设置音量
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`[SoundManager] Volume set to: ${this.volume}`);
  }

  // 获取状态
  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      initialized: this.initialized,
    };
  }
}

// 导出单例
export const soundManager = new SoundManager();

// 便捷函数
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
