import { initializeApp, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyD3O7ZxHXOyRP_zxxls86LbJ_gSIwhnHX8',
  authDomain: 'next-blog-89727.firebaseapp.com',
  projectId: 'next-blog-89727',
  storageBucket: 'next-blog-89727.appspot.com',
  messagingSenderId: '593609165307',
  appId: '1:593609165307:web:d8bf3b28953fa5922a235e',
}

function createFirebaseApp(config) {
  try {
    return getApp()
  } catch {
    return initializeApp(config)
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig)

// Auth
export const auth = getAuth(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider()

// Firestore exports
export const firestore = getFirestore(firebaseApp)

// Storage exports
export const storage = getStorage(firebaseApp)
export const STATE_CHANGED = 'state_changed'


/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username) {

  const q = query(
    collection(firestore, 'users'), 
    where('username', '==', username),
    limit(1)
  )
  const userDoc = ( await getDocs(q) ).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * 
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}