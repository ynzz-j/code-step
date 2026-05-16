export interface ObsStatsPayload {
  wpm: number;
  accuracy: number;
  combo: number;
  lesson?: string;
  tagline?: string;
}

const DEFAULT_WS_URL = 'ws://127.0.0.1:17321/codestep-stats';
const WS_URL_STORAGE_KEY = 'codestep-obs-stats-ws-url';
const RECONNECT_DELAY_MS = 2000;

class ObsStatsPublisher {
  private ws: WebSocket | null = null;
  private lastPayload: ObsStatsPayload | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private nextConnectAt = 0;

  publish(payload: ObsStatsPayload) {
    if (typeof window === 'undefined') return;

    this.lastPayload = this.normalizePayload(payload);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this.lastPayload));
      return;
    }

    this.connect();
  }

  private connect() {
    if (typeof window === 'undefined') return;
    if (this.ws?.readyState === WebSocket.CONNECTING || this.ws?.readyState === WebSocket.OPEN) return;

    const now = Date.now();
    if (now < this.nextConnectAt) {
      this.scheduleReconnect();
      return;
    }

    this.nextConnectAt = now + RECONNECT_DELAY_MS;

    try {
      this.ws = new WebSocket(this.getWsUrl());
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.addEventListener('open', () => {
      if (this.lastPayload) {
        this.ws?.send(JSON.stringify(this.lastPayload));
      }
    });

    this.ws.addEventListener('close', () => {
      this.ws = null;
      this.scheduleReconnect();
    });

    this.ws.addEventListener('error', () => {
      this.ws?.close();
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || !this.lastPayload) return;

    const delayMs = Math.max(0, this.nextConnectAt - Date.now());
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delayMs);
  }

  private getWsUrl() {
    return window.localStorage.getItem(WS_URL_STORAGE_KEY) || DEFAULT_WS_URL;
  }

  private normalizePayload(payload: ObsStatsPayload): ObsStatsPayload {
    return {
      wpm: this.toNonNegativeInteger(payload.wpm),
      accuracy: Math.min(100, this.toNonNegativeInteger(payload.accuracy)),
      combo: this.toNonNegativeInteger(payload.combo),
      lesson: payload.lesson,
      tagline: payload.tagline,
    };
  }

  private toNonNegativeInteger(value: number) {
    return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
  }
}

const obsStatsPublisher = new ObsStatsPublisher();

export function publishObsStats(payload: ObsStatsPayload) {
  obsStatsPublisher.publish(payload);
}
