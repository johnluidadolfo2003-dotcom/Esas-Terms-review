import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 1. Standard provider for universal access - works for ALL Google accounts
// (Personal @gmail.com, Google Workspace, School/University @edu accounts)
const standardProvider = new GoogleAuthProvider();
standardProvider.setCustomParameters({
  prompt: 'select_account',
});

// 2. Provider with Google Drive scope for file access
const driveProvider = new GoogleAuthProvider();
driveProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
driveProvider.setCustomParameters({
  prompt: 'select_account',
});

const DRIVE_TOKEN_STORAGE_KEY = 'drive_reviewer_access_token_v1';

let isSigningIn = false;
let cachedAccessToken: string | null = (typeof window !== 'undefined'
  ? sessionStorage.getItem(DRIVE_TOKEN_STORAGE_KEY)
  : null);

/**
 * Initializes auth listener. Always preserves authenticated state across page refreshes.
 * Any Google account remains logged in even if Google Drive token is expired or absent.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (!cachedAccessToken && typeof window !== 'undefined') {
        cachedAccessToken = sessionStorage.getItem(DRIVE_TOKEN_STORAGE_KEY);
      }
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(DRIVE_TOKEN_STORAGE_KEY);
      }
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

/**
 * Signs in with ANY Google Account.
 * First attempts to obtain Drive token if available, but gracefully falls back to
 * standard Google Sign-In so NO Google account is ever blocked by sensitive scope checks.
 */
export const googleSignIn = async (
  requestDriveAccess = false
): Promise<{ user: User; accessToken: string | null }> => {
  try {
    isSigningIn = true;

    if (requestDriveAccess) {
      try {
        const result = await signInWithPopup(auth, driveProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken || null;
        if (token) {
          cachedAccessToken = token;
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(DRIVE_TOKEN_STORAGE_KEY, token);
          }
        }
        return { user: result.user, accessToken: token };
      } catch (driveErr: unknown) {
        console.warn('Drive scope request not granted, falling back to standard sign-in:', driveErr);
        // Fall back to standard sign in so user is not blocked
      }
    }

    // Standard Google Sign-In: 100% accessible to all Google accounts worldwide
    const result = await signInWithPopup(auth, standardProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || cachedAccessToken || null;
    if (token) {
      cachedAccessToken = token;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(DRIVE_TOKEN_STORAGE_KEY, token);
      }
    }
    return { user: result.user, accessToken: token };
  } catch (error: unknown) {
    console.error('Google Sign In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Requests Google Drive permissions for an already signed-in user or new user.
 */
export const connectGoogleDrive = async (): Promise<string | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, driveProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    if (token) {
      cachedAccessToken = token;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(DRIVE_TOKEN_STORAGE_KEY, token);
      }
      return token;
    }
    return null;
  } catch (err) {
    console.warn('Could not connect Google Drive scope:', err);
    throw err;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken && typeof window !== 'undefined') {
    cachedAccessToken = sessionStorage.getItem(DRIVE_TOKEN_STORAGE_KEY);
  }
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem(DRIVE_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(DRIVE_TOKEN_STORAGE_KEY);
    }
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(DRIVE_TOKEN_STORAGE_KEY);
  }
};
