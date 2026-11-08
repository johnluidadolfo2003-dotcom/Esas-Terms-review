# Deploying to Render with Gemini AI

Follow these instructions to deploy the Engineering Reviewer on [Render](https://render.com) with full Gemini AI features.

---

## 1. Deploy as a Web Service (Not a Static Site)

Because the app uses Gemini server-side proxy routes (`/api/gemini/explain`, `/api/gemini/ask`, `/api/speech`), it must run as a **Node.js Web Service**.

### Option A: Automatic Blueprint (Recommended)
1. In Render, click **New +** > **Blueprint**.
2. Connect your GitHub repository.
3. Render reads `render.yaml` automatically and configures:
   - **Environment**: Node
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm start`
4. In the Environment Variables screen, paste your **GEMINI_API_KEY**.
5. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render, click **New +** > **Web Service**.
2. Select your repository.
3. Configure settings:
   - **Name**: `esas-terms-reviewer` (or your choice)
   - **Language / Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Starter)

---

## 2. Set the Gemini API Key

1. Go to your Web Service in the Render Dashboard.
2. Select **Environment** from the left navigation.
3. Click **Add Environment Variable**:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your API key from [Google AI Studio](https://aistudio.google.com/apikey)
4. Click **Save Changes**.
5. Render will automatically redeploy and initialize Gemini.

*Note: The server also detects `GOOGLE_API_KEY`, `GOOGLE_GENAI_API_KEY`, or `API_KEY` if you previously named it differently.*

---

## 3. How to Lock Your Web App Link (Password Protection)

You can lock your deployment with a secret passcode so only authorized people can open and use the web app:

1. Open your **Render Dashboard** and select your Web Service.
2. Click **Environment** in the left sidebar.
3. Click **Add Environment Variable**:
   - **Key**: `APP_PASSWORD`
   - **Value**: Your chosen secret passcode (e.g. `ECE2026Pass!`)
4. *(Optional)* If you also want to require a specific username:
   - **Key**: `APP_USERNAME`
   - **Value**: `admin` (or any username you choose)
   *(If `APP_USERNAME` is left blank, visitors can type any username or leave it blank and just enter the password).*
5. Click **Save Changes**.
6. Render will automatically redeploy (typically takes ~1-2 minutes).

### How it looks to visitors:
- When someone visits your `.onrender.com` link, the browser prompts them to enter the credentials.
- If they do not enter the correct password, they will see a locked screen: `🔒 Access Protected: A valid passcode is required to view questions and use this system.`
- Render's automated health check (`/healthz`) continues to pass normally so your deployment remains healthy.

### How to unlock:
To make the link publicly accessible again in the future, simply delete or clear the `APP_PASSWORD` variable in the Render **Environment** tab and click **Save Changes**.

---

## 4. Troubleshooting

- **"Web Service Needed" or 404 on `/api/gemini/config`**:
  You deployed as a "Static Site" instead of a "Web Service". Delete or pause the Static Site and create a **Web Service** using `npm start`.
- **"Key Needed on Render" (503)**:
  `GEMINI_API_KEY` is not set or has invalid placeholder text. Add it in **Environment** settings.
- **Quota Reached (429)**:
  Free tier Google AI Studio keys have per-minute rate limits. Wait a few moments before requesting another deep dive analysis.

