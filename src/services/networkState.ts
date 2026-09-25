export type NetworkStatusType = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'LOCAL_AI' | 'ERROR';

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

  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener('online', () => this.checkConnectivity());
    window.addEventListener('offline', () => this.setOffline());

    // Initial check
    this.checkConnectivity();

    // Periodic ping every 30 seconds
    this.pingInterval = setInterval(() => {
      this.checkConnectivity();
    }, 30000);
  }

  public async checkConnectivity(): Promise<NetworkStateInfo> {
    if (!navigator.onLine) {
      this.setOffline();
      return this.getState();
    }

    try {
      // Lightweight fetch check to verify actual internet connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch('/manifest.json?ping=' + Date.now(), { 
        method: 'HEAD', 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isOnline = true;
        if (this.status !== 'SYNCING') {
          this.status = this.isLocalAiAvailable ? 'LOCAL_AI' : 'ONLINE';
        }
      } else {
        this.setOffline();
      }
    } catch {
      this.setOffline();
    }

    this.notify();
    return this.getState();
  }

  private setOffline() {
    this.isOnline = false;
    if (this.status !== 'SYNCING') {
      this.status = this.isLocalAiAvailable ? 'LOCAL_AI' : 'OFFLINE';
    }
    this.notify();
  }

  public setLocalAiAvailable(available: boolean) {
    this.isLocalAiAvailable = available;
    if (!this.isOnline && available) {
      this.status = 'LOCAL_AI';
    } else if (this.isOnline && available && this.status === 'LOCAL_AI') {
      this.status = 'ONLINE';
    }
    this.notify();
  }

  public setSyncing(syncing: boolean) {
    this.isSyncing = syncing;
    if (syncing) {
      this.status = 'SYNCING';
    } else {
      this.status = this.isOnline ? (this.isLocalAiAvailable ? 'LOCAL_AI' : 'ONLINE') : (this.isLocalAiAvailable ? 'LOCAL_AI' : 'OFFLINE');
    }
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
