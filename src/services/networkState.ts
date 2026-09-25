// Real Connectivity State Machine & Network Manager for EcoVision AI
// Manages: ONLINE | LOCAL_AI | OFFLINE | SYNCING | ERROR

export type NetworkStatusType = 'ONLINE' | 'LOCAL_AI' | 'OFFLINE' | 'SYNCING' | 'ERROR';

export interface NetworkStateInfo {
  status: NetworkStatusType;
  isOnline: boolean;
  isLocalAiAvailable: boolean;
  isSyncing: boolean;
  lastChecked: string;
}

type Listener = (state: NetworkStateInfo) => void;

class NetworkStateEngine {
  private status: NetworkStatusType = 'ONLINE';
  private isOnline: boolean = navigator.onLine;
  private isLocalAiAvailable: boolean = false;
  private isSyncing: boolean = false;
  private listeners: Set<Listener> = new Set();
  private pingInterval: any = null;
  private isProbing: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener('online', () => this.probeConnectivity());
    window.addEventListener('offline', () => this.setOfflineState());

    // Initial probe on app startup (non-blocking)
    setTimeout(() => this.probeConnectivity(), 100);

    // Periodic lightweight background probe every 30 seconds
    this.pingInterval = setInterval(() => {
      this.probeConnectivity();
    }, 30000);
  }

  public async probeConnectivity(): Promise<NetworkStateInfo> {
    if (this.isProbing) return this.getState();
    this.isProbing = true;

    try {
      // 1. Check browser navigator hint first
      if (!navigator.onLine) {
        this.isOnline = false;
      } else {
        // 2. Perform real external internet probe to distinguish true Internet vs Local preview/cache
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        try {
          // Probe lightweight external endpoint
          const res = await fetch('https://cloudflare.com/cdn-cgi/trace?ping=' + Date.now(), {
            method: 'GET',
            mode: 'no-cors',
            cache: 'no-store',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          this.isOnline = true;
        } catch {
          // External probe failed -> Internet is unavailable
          this.isOnline = false;
        }
      }

      // 3. Probe Ollama Local AI Server (http://localhost:11434/api/tags)
      const ollamaController = new AbortController();
      const ollamaTimeout = setTimeout(() => ollamaController.abort(), 1500);

      try {
        const ollamaRes = await fetch('http://localhost:11434/api/tags', {
          method: 'GET',
          signal: ollamaController.signal
        });
        clearTimeout(ollamaTimeout);
        this.isLocalAiAvailable = ollamaRes.ok;
      } catch {
        this.isLocalAiAvailable = false;
      }

      // 4. Update status based on strict state machine hierarchy
      if (this.isSyncing) {
        this.status = 'SYNCING';
      } else if (this.isOnline) {
        this.status = 'ONLINE';
      } else if (this.isLocalAiAvailable) {
        this.status = 'LOCAL_AI';
      } else {
        this.status = 'OFFLINE';
      }
    } catch (err) {
      console.warn('[NetworkManager] Probe error:', err);
      if (!this.isOnline && !this.isLocalAiAvailable) {
        this.status = 'OFFLINE';
      }
    } finally {
      this.isProbing = false;
      this.notify();
    }

    return this.getState();
  }

  private setOfflineState() {
    this.isOnline = false;
    if (this.isSyncing) {
      this.status = 'SYNCING';
    } else if (this.isLocalAiAvailable) {
      this.status = 'LOCAL_AI';
    } else {
      this.status = 'OFFLINE';
    }
    this.notify();
  }

  public setLocalAiAvailable(available: boolean) {
    this.isLocalAiAvailable = available;
    if (!this.isSyncing) {
      if (this.isOnline) {
        this.status = 'ONLINE';
      } else if (available) {
        this.status = 'LOCAL_AI';
      } else {
        this.status = 'OFFLINE';
      }
    }
    this.notify();
  }

  public setSyncing(syncing: boolean) {
    this.isSyncing = syncing;
    if (syncing) {
      this.status = 'SYNCING';
    } else {
      if (this.isOnline) {
        this.status = 'ONLINE';
      } else if (this.isLocalAiAvailable) {
        this.status = 'LOCAL_AI';
      } else {
        this.status = 'OFFLINE';
      }
    }
    this.notify();
  }

  public setError() {
    this.status = 'ERROR';
    this.notify();
  }

  public getState(): NetworkStateInfo {
    return {
      status: this.status,
      isOnline: this.isOnline,
      isLocalAiAvailable: this.isLocalAiAvailable,
      isSyncing: this.isSyncing,
      lastChecked: new Date().toISOString()
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const networkStateEngine = new NetworkStateEngine();
