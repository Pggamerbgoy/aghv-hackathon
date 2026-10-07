import admin from 'firebase-admin';

let isFirebaseInitialized = false;

// In-Memory store fallback if Firebase credentials are not yet supplied during local development
class InMemoryStore {
  private collections: Map<string, Map<string, any>> = new Map();

  collection(name: string) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new Map());
    }
    const col = this.collections.get(name)!;

    return {
      doc: (id: string) => ({
        get: async () => ({
          id,
          exists: col.has(id),
          data: () => col.get(id),
        }),
        set: async (data: any) => {
          col.set(id, { ...data, id });
          return { id };
        },
        update: async (data: any) => {
          const existing = col.get(id) || {};
          col.set(id, { ...existing, ...data, id });
          return { id };
        },
      }),
      add: async (data: any) => {
        const id = 'doc_' + Math.random().toString(36).substring(2, 11);
        col.set(id, { ...data, id });
        return { id, get: async () => ({ id, exists: true, data: () => col.get(id) }) };
      },
      get: async () => ({
        docs: Array.from(col.entries()).map(([id, data]) => ({
          id,
          exists: true,
          data: () => data,
        })),
      }),
    };
  }
}

const memoryDb = new InMemoryStore();

const hasValidCredentials = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (hasValidCredentials) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin initialized with live cloud project');
    }
  } catch (error) {
    console.warn('⚠️ Firebase Admin init failed, falling back to in-memory store:', error);
  }
} else {
  console.log('ℹ️ Running Firestore in local in-memory fallback mode (Credentials not configured)');
}

export const db: any = isFirebaseInitialized ? admin.firestore() : memoryDb;
export const auth: any = isFirebaseInitialized ? admin.auth() : {
  verifyIdToken: async (token: string) => {
    // Dev mock token decoding for offline testing
    return {
      uid: 'dev-user-123',
      email: 'builder@buildverse.test',
    };
  },
};
export const isLiveFirebase = isFirebaseInitialized;
