import { QuestionDisputeReport, DisputeStatus } from '../types/admin';

export const DB_NAME = 'scoreup_datastore';
export const DB_VERSION = 1;
export const DISPUTE_STORE = 'dispute_reports';
export const DISPUTES_FALLBACK_KEY = 'scoreup_dispute_reports';

/**
 * Checks if IndexedDB is available in the current environment.
 */
function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window && !!window.indexedDB;
}

/**
 * Open or initialize the ScoreUp IndexedDB datastore.
 */
function openDatastore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBSupported()) {
      return reject(new Error('IndexedDB is not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DISPUTE_STORE)) {
        const store = db.createObjectStore(DISPUTE_STORE, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('questionId', 'questionId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
      if (!db.objectStoreNames.contains('custom_practice_tests')) {
        const testStore = db.createObjectStore('custom_practice_tests', { keyPath: 'id' });
        testStore.createIndex('createdAt', 'createdAt', { unique: false });
        testStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB.'));
  });
}

/**
 * Fallback helpers using localStorage
 */
function getFallbackDisputes(): QuestionDisputeReport[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(DISPUTES_FALLBACK_KEY);
    return raw ? (JSON.parse(raw) as QuestionDisputeReport[]) : [];
  } catch (err) {
    console.warn('Failed to read disputes from localStorage fallback:', err);
    return [];
  }
}

function saveFallbackDisputes(reports: QuestionDisputeReport[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(DISPUTES_FALLBACK_KEY, JSON.stringify(reports));
    }
  } catch (err) {
    console.warn('Failed to save disputes to localStorage fallback:', err);
  }
}

function notifyDisputesUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('scoreup_disputes_updated'));
  }
}

/**
 * Log a new question dispute report.
 */
export async function logDispute(
  input: Omit<QuestionDisputeReport, 'id' | 'createdAt' | 'status'> &
    Partial<Pick<QuestionDisputeReport, 'id' | 'createdAt' | 'status'>>
): Promise<QuestionDisputeReport> {
  const report: QuestionDisputeReport = {
    ...input,
    id: input.id || `disp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: input.createdAt || Date.now(),
    status: input.status || 'pending',
  };

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([DISPUTE_STORE], 'readwrite');
        const store = tx.objectStore(DISPUTE_STORE);
        const req = store.put(report);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Failed to write dispute to IndexedDB'));
      });
    } catch (err) {
      console.warn('IndexedDB write failed, utilizing localStorage fallback:', err);
    }
  }

  // Keep localStorage in sync as backup / primary fallback
  const fallbackList = getFallbackDisputes().filter((d) => d.id !== report.id);
  fallbackList.unshift(report);
  saveFallbackDisputes(fallbackList);

  notifyDisputesUpdated();
  return report;
}

/**
 * Retrieve all dispute reports with optional filters.
 */
export async function getDisputes(filter?: {
  status?: DisputeStatus;
  questionId?: string;
}): Promise<QuestionDisputeReport[]> {
  let reports: QuestionDisputeReport[] = [];

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      reports = await new Promise<QuestionDisputeReport[]>((resolve, reject) => {
        const tx = db.transaction([DISPUTE_STORE], 'readonly');
        const store = tx.objectStore(DISPUTE_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve((req.result as QuestionDisputeReport[]) || []);
        req.onerror = () => reject(req.error || new Error('Failed to read disputes from IndexedDB'));
      });
    } catch (err) {
      console.warn('IndexedDB read failed, reading from localStorage fallback:', err);
    }
  }

  // If IndexedDB returned empty or unsupported, read from fallback
  if (reports.length === 0) {
    reports = getFallbackDisputes();
  }

  // Filter
  if (filter?.status) {
    reports = reports.filter((d) => d.status === filter.status);
  }
  if (filter?.questionId) {
    reports = reports.filter((d) => d.questionId === filter.questionId);
  }

  // Sort descending by createdAt (newest first)
  return reports.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/**
 * Retrieve a single dispute by ID.
 */
export async function getDisputeById(id: string): Promise<QuestionDisputeReport | null> {
  if (!id) return null;

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      const result = await new Promise<QuestionDisputeReport | null>((resolve, reject) => {
        const tx = db.transaction([DISPUTE_STORE], 'readonly');
        const store = tx.objectStore(DISPUTE_STORE);
        const req = store.get(id);
        req.onsuccess = () => resolve((req.result as QuestionDisputeReport) || null);
        req.onerror = () => reject(req.error || new Error('Failed to query dispute from IndexedDB'));
      });

      if (result) return result;
    } catch (err) {
      console.warn('IndexedDB query failed, querying fallback localStorage:', err);
    }
  }

  const fallback = getFallbackDisputes();
  return fallback.find((d) => d.id === id) || null;
}

/**
 * Update the status of a dispute report.
 */
export async function updateDisputeStatus(
  id: string,
  status: DisputeStatus,
  adminNotes?: string
): Promise<QuestionDisputeReport | null> {
  const existing = await getDisputeById(id);
  if (!existing) return null;

  const updated: QuestionDisputeReport = {
    ...existing,
    status,
    adminNotes: adminNotes !== undefined ? adminNotes : existing.adminNotes,
    resolvedAt: status === 'resolved' || status === 'rejected' ? Date.now() : undefined,
  };

  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([DISPUTE_STORE], 'readwrite');
        const store = tx.objectStore(DISPUTE_STORE);
        const req = store.put(updated);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error || new Error('Failed to update dispute in IndexedDB'));
      });
    } catch (err) {
      console.warn('IndexedDB update failed, using localStorage fallback:', err);
    }
  }

  const fallback = getFallbackDisputes().map((d) => (d.id === id ? updated : d));
  saveFallbackDisputes(fallback);

  notifyDisputesUpdated();
  return updated;
}

/**
 * Delete a dispute report.
 */
export async function deleteDispute(id: string): Promise<boolean> {
  if (!id) return false;

  let deleted = false;
  if (isIndexedDBSupported()) {
    try {
      const db = await openDatastore();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([DISPUTE_STORE], 'readwrite');
        const store = tx.objectStore(DISPUTE_STORE);
        const req = store.delete(id);
        req.onsuccess = () => {
          deleted = true;
          resolve();
        };
        req.onerror = () => reject(req.error || new Error('Failed to delete from IndexedDB'));
      });
    } catch (err) {
      console.warn('IndexedDB delete failed, falling back to localStorage:', err);
    }
  }

  const fallback = getFallbackDisputes();
  const next = fallback.filter((d) => d.id !== id);
  if (next.length !== fallback.length) {
    deleted = true;
  }
  saveFallbackDisputes(next);

  if (deleted) {
    notifyDisputesUpdated();
  }
  return deleted;
}

/**
 * Count how many disputes are currently pending review.
 */
export async function getPendingDisputesCount(): Promise<number> {
  const pending = await getDisputes({ status: 'pending' });
  return pending.length;
}
