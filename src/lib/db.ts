// IndexedDB Database Manager for EcoVision Offline Storage

export type SyncStatus = 'synced' | 'pending' | 'failed';

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
  version?: number;
  [key: string]: any;
}

export interface OfflineScanRecord extends BaseRecord {
  imageData: string;
  status: 'Waiting for AI analysis' | 'Analyzing' | 'Completed' | 'Failed';
  result?: any;
}

export interface CheckInRecord extends BaseRecord {
  plantId: string;
  plantName: string;
  notes?: string;
  watered?: boolean;
  fertilized?: boolean;
  pruned?: boolean;
  healthStatus?: 'healthy' | 'warning' | 'critical';
}

export interface PlantRecord extends BaseRecord {
  commonName: string;
  scientificName: string;
  nickname: string;
  species?: string;
  family?: string;
  image: string;
  thumbnail?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  healthScore: number; // 0 to 100
  status: 'Healthy' | 'Needs Attention' | 'Diseased' | 'Recovering';
  lastScanAt?: string;
  lastCheckInAt?: string;
  wateringFrequencyDays?: number;
  lastWateredAt?: string;
  lightRequirement?: string;
  soilType?: string;
  isArchived?: boolean;
}

export interface PlantSnapshot extends BaseRecord {
  plantId: string;
  image: string;
  scanResult?: any;
  confidence?: number;
  disease?: string;
  healthScore?: number;
  observations?: string;
}

export interface PlantActivity extends BaseRecord {
  plantId: string;
  type: 'scan' | 'water' | 'fertilize' | 'prune' | 'checkin' | 'note' | 'disease' | 'treatment';
  title: string;
  description?: string;
  metadata?: any;
}

export interface SensorRecord extends BaseRecord {
  temperature: number;
  humidity: number;
  moisture: number;
  lightLux?: number;
  recordedAt: string;
}

export interface LearningRecord extends BaseRecord {
  plantId: string;
  mode: 'beginner' | 'student' | 'advanced' | 'research';
  sectionsViewed: string[];
  quizAttempts: Array<{
    score: number;
    total: number;
    timestamp: string;
  }>;
  progress: number; // 0-100
  completedAt?: string;
}

export interface CareRecord extends BaseRecord {
  plantId: string;
  actionType: 'water' | 'fertilize' | 'prune' | 'repot' | 'clean' | 'mist';
  notes?: string;
  performedAt: string;
}

export interface TreatmentRecord extends BaseRecord {
  plantId: string;
  diseaseName: string;
  treatmentType: 'chemical' | 'natural' | 'cultural';
  activeIngredient?: string;
  dosage?: string;
  applicationNotes?: string;
  status: 'active' | 'completed' | 'resolved';
}

const DB_NAME = 'EcoVisionDB';
const DB_VERSION = 2;

const STORES = [
  'plants',
  'plant_scans',
  'plant_knowledge',
  'health_records',
  'check_ins',
  'sensor_history',
  'chat_history',
  'pending_actions',
  'offline_scans',
  'learning_records',
  'snapshots',
  'care_records',
  'treatment_records',
  'sync_metadata'
];

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        STORES.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('syncStatus', 'syncStatus', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  return dbPromise;
}

export async function saveRecord<T extends Partial<BaseRecord>>(
  storeName: string,
  record: T
): Promise<T & BaseRecord> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  const fullRecord: BaseRecord = {
    id: record.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: record.createdAt || now,
    updatedAt: now,
    syncStatus: record.syncStatus || 'pending',
    version: record.version || 1,
    ...record
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(fullRecord);
    
    req.onsuccess = () => resolve(fullRecord as T & BaseRecord);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllRecords<T = BaseRecord>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function getRecordById<T = BaseRecord>(storeName: string, id: string): Promise<T | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(id);

    req.onsuccess = () => resolve((req.result as T) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingRecords<T = BaseRecord>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index('syncStatus');
    const req = index.getAll('pending');

    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteRecord(storeName: string, id: string): Promise<boolean> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(false);
  });
}
