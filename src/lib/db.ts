
"use client";

const DB_NAME = 'ModelHubDB';
const DB_VERSION = 1;
const STORE_NAME = 'models';

class ModelDB {
  private db: IDBDatabase | null = null;

  public async init(): Promise<void> {
    if (this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(new Error('Failed to open IndexedDB.'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    const transaction = this.db.transaction(STORE_NAME, mode);
    return transaction.objectStore(STORE_NAME);
  }

  public async addModel(id: string, data: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.put({ id, data });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getModel(id: string): Promise<Blob | undefined> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');
      const request = store.get(id);
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : undefined);
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async getDownloadedModelIds(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readonly');
      const request = store.getAllKeys();
      request.onsuccess = () => {
        resolve(request.result as string[]);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const modelDB = new ModelDB();
