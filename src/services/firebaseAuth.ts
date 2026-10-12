import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
const driveProvider = new GoogleAuthProvider();
driveProvider.addScope('https://www.googleapis.com/auth/drive.readonly');
driveProvider.setCustomParameters({ prompt: 'select_account' });
const KEY = 'drive_reviewer_access_token_v2';
let token: string | null = null;
let expiresAt = 0;
let tokenUid: string | null = null;
try {
  const stored = JSON.parse(sessionStorage.getItem(KEY) || 'null');
  if (stored?.expiresAt > Date.now()) ({ token, expiresAt, uid: tokenUid } = stored);
} catch { /* Browser storage can be unavailable. */ }
export const setAccessToken = (next: string | null) => {
  if (next !== token) expiresAt = next ? Date.now() + 50 * 60 * 1000 : 0;
  token = next;
  tokenUid = next ? auth.currentUser?.uid || null : null;
  try {
    if (next) sessionStorage.setItem(KEY, JSON.stringify({ token, expiresAt, uid: tokenUid }));
    else sessionStorage.removeItem(KEY);
  } catch { /* In-memory token remains usable. */ }
};
export const getAccessToken = async (): Promise<string | null> => {
  if (expiresAt <= Date.now() || tokenUid !== auth.currentUser?.uid) setAccessToken(null);
  return token;
};
export const initAuth = (success?: (user: User, token: string | null) => void, failure?: () => void) =>
  onAuthStateChanged(auth, async (user) => {
    if (user) success?.(user, await getAccessToken());
    else { setAccessToken(null); failure?.(); }
  });
export const googleSignIn = async (requestDriveAccess = false): Promise<{ user: User; accessToken: string | null }> => {
  const result = await signInWithPopup(auth, requestDriveAccess ? driveProvider : provider);
  // Basic Google OAuth tokens do not have Drive permission.
  if (requestDriveAccess) setAccessToken(GoogleAuthProvider.credentialFromResult(result)?.accessToken || null);
  return { user: result.user, accessToken: await getAccessToken() };
};
export const connectGoogleDrive = async (): Promise<string | null> => (await googleSignIn(true)).accessToken;
export const logout = async () => { await signOut(auth); setAccessToken(null); };
