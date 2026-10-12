# ESAS Terms Review

A React reviewer served by a Node/Express web service, with authenticated Firebase cloud question banks. The built-in bank contains 986 unique questions across six subjects. Answer keys are preserved; their academic/legal accuracy has not been independently audited.

## Deploy to Render (Web Service)

1. Merge this change into your GitHub default branch.
2. In Render choose **New > Blueprint**, connect this repository, and select `render.yaml`. This creates a **Web Service**, not a Static Site.
3. In your existing Firebase project (`gen-lang-client-0867911637`), enable Google Authentication and create the **default Cloud Firestore database** in production mode. Install the `firestore.rules` rules for server-only bank access. Do not overwrite unrelated collection rules if your Firebase project has other apps.
4. Firebase Console > Project settings > Service accounts > Generate new private key. In Render set `FIREBASE_SERVICE_ACCOUNT_JSON` to the entire JSON object. Keep this server secret out of GitHub and frontend variables. The account must have Firestore access for the same project used by `firebase-applet-config.json`.
5. Firebase Console > Authentication > Settings > Authorized domains: add your Render hostname (for example `esas-terms-reviewer.onrender.com`) and any custom domain.
6. Deploy. Check `/healthz` returns `{"status":"ok","cloudStorage":true}`. Sign in on two devices, import a small bank, wait for **Questions saved to your account**, and verify the other device loads it after refresh.

For an existing Render service set **Build Command** to `npm ci --legacy-peer-deps && npm run lint && npm test && npm run build`, **Start Command** to `npm start`, **Health Check Path** to `/healthz`, and **Node Version** to `22.14.0`. Connect the branch containing this change. `PORT` is supplied by Render.

The blueprint uses Render's free web-service plan. Free services can sleep when idle. Firestore, rather than Render's temporary filesystem, holds user banks across restarts and redeploys. Firebase/Render quotas and billing remain controlled by your accounts. No hosting service is created by committing these files.

Without server credentials, built-in review and browser imports work, while cloud APIs return a clear configuration error. `/healthz` reports configuration presence, not successful Firestore connectivity. Google sign-in alone does not grant Google Drive access; use **Connect Drive** separately. Enable Google Drive API and configure OAuth consent/test users for Drive import. Expired Drive access requires reconnecting.

## Local development

Use Node 22.14 or newer:

```sh
npm ci --legacy-peer-deps
cp .env.example .env
npm run dev:server
```

In a second terminal run `npm run dev`. Vite proxies `/api` to port 3001. Production: `npm run build` then `PORT=3000 npm start`.

## Saving and synchronization

Guest banks stay in this browser. Signed-in banks are isolated per account and automatically load/save through `/api/questions`. Existing guest imports remain available when signed out; export and import a JSON backup while signed in to migrate them. Saving can fail if browser storage is full, Firebase is misconfigured, or you are offline; export backups for important content.

The API verifies Firebase ID tokens, validates question IDs/choices/answers, compresses banks for Firestore, and uses transaction versions to reject conflicting writes. After editing from two devices at once, a conflict preserves the local browser copy and asks for a reload. Export local edits before reloading; importing that backup reconciles them by ID. Other devices see changes on refresh. There is no source-file overwrite API and no public bank-write endpoint.

Questions without an explicit answer key are skipped during parsing rather than assigned a guessed answer. Built-in explanations and keys still require subject-matter review. Quiz choice layouts are fixed at quiz creation so score calculation uses the displayed answer letters.

## Checks

`npm run lint`, `npm test`, and `npm run build`. Tests cover bank validation, duplicate removal, shuffled choice mappings, quiz cycle coverage, and missing answer keys. Live Firebase sign-in/sync and Render deployment require the account configuration above.
