import { networkStateEngine } from "@/services/networkState";
import { getPendingRecords, saveRecord, deleteRecord } from "@/lib/db";
import { identifyPlant as cloudIdentifyPlant } from "@/lib/ai";

class SyncEngine {
  private isSyncing: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    window.addEventListener('online', () => {
      console.log("[SyncEngine] Network restored -> Triggering background sync");
      this.syncPendingData();
    });
  }

  public async syncPendingData(): Promise<void> {
    if (this.isSyncing) return;
    
    const state = networkStateEngine.getState();
    if (!state.isOnline) return;

    this.isSyncing = true;
    networkStateEngine.setSyncing(true);

    try {
      console.log("[SyncEngine] Starting background sync process...");

      // 1. Process Offline Queued Scans
      const pendingScans = await getPendingRecords<any>("offline_scans");
      for (const scan of pendingScans) {
        if (scan.imageData && scan.status === 'Waiting for AI analysis') {
          console.log(`[SyncEngine] Processing offline scan ID ${scan.id}...`);
          try {
            const res = await cloudIdentifyPlant(scan.imageData);
            if (res.success && res.data) {
              // Save processed scan to plant_scans
              await saveRecord("plant_scans", {
                ...res.data,
                id: scan.id,
                imageData: scan.imageData,
                syncStatus: 'synced'
              });
              // Remove from queue
              await deleteRecord("offline_scans", scan.id);
              console.log(`[SyncEngine] Scan ID ${scan.id} synced successfully!`);
            }
          } catch (scanErr) {
            console.error(`[SyncEngine] Error syncing scan ID ${scan.id}:`, scanErr);
          }
        }
      }

      // 2. Process Pending Plant Check-ins & Digital Twin Records
      const pendingCheckIns = await getPendingRecords<any>("check_ins");
      for (const checkIn of pendingCheckIns) {
        await saveRecord("check_ins", {
          ...checkIn,
          syncStatus: 'synced'
        });
      }

      console.log("[SyncEngine] Background sync completed successfully.");
    } catch (err) {
      console.error("[SyncEngine] Sync failed:", err);
    } finally {
      this.isSyncing = false;
      networkStateEngine.setSyncing(false);
    }
  }
}

export const syncEngine = new SyncEngine();
