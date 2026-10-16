# Gemini narrator

All device speech synthesis, voice-name guessing, voice pickers, and pitch/depth controls are removed. Both reading modes and Test Voice now use one actual Gemini-generated narrator: **Puck**, requested with clear American English pronunciation, a calm conversational delivery, and natural pauses. Gemini Apps has several selectable voices; this is not a claim to reproduce an unidentified default voice exactly.

## Required deployment setup

1. In the Render web service, open Environment and add **GEMINI_API_KEY** using a Google AI Studio API key for a project with access/quota for **gemini-3.8-flash-tts**.
2. Deploy the updated main branch. Existing Render services may require manually adding the variable; the Blueprint declares it with sync:false so a real secret must be supplied.
3. Open Auto Read, tap **Test Voice**, then **Play**. Media volume and output routing must allow sound.

For local development, put the key in .env, then run npm run dev. Both Vite development and the production Express server expose the same speech endpoints. Do not put the key in a VITE_ variable, client code, source control, or chat. The key stays on the server. Only quiz text is sent to Google's speech API when reading; Google API quota/billing for the configured project applies. With no key, the app shows a specific setup message and never substitutes an old device voice.

## Implementation

POST /api/speech sends a literal transcript using Google's documented Interactions REST API. Delivery instructions live in speech_metadata.style, outside the transcript; the voice is fixed in generation_config.speech_config. store:false opts out of stored Interaction state. Complete WAV audio is validated and returned to the browser. No manual PCM wrapper is added to the current model's WAV output.

The browser resumes a Web Audio context directly from Play/Test Voice before awaiting network work, decodes and plays the generated WAV, and displays Preparing Gemini audio while waiting. Pause, question changes, and previews abort pending requests and stop audio; stale completions cannot select an answer or advance. Text is split into bounded chunks and completion occurs only after the entire phrase. The speed buttons request a delivery pace from Gemini rather than pitch-shifting the recording; generated pacing is approximate.

Server requests are limited in size, concurrency, and per-client rate; cross-origin browser calls are rejected. Duplicate in-flight text/pace requests are coalesced, and bounded in-memory caches reduce repeat generation. Caches expire and disappear on restart. Client cancellation stops playback/download; an already running shared server generation may complete into the cache. Do not assume cancellation reverses provider usage already incurred.

Public endpoints do not expose provider errors or keys. Missing configuration, quota, busy service, invalid audio, network errors, and blocked audio have actionable messages. A hosted API requires connectivity; offline device voices are intentionally removed.

## Validation

npm run test:speech checks the official request structure and literal text, fixed narrator and delivery metadata, WAV parsing, missing configuration, secret handling, caching, pace, invalid/cross-origin requests, quota errors, mobile audio unlock ordering, native-pitch playback, cancellation during fetch/playback, long-text completion, preview, and text normalization. Provider responses and audio devices are simulated: no key is present in the workspace, so no real Gemini generation/listening test is claimed.

npm run test:server checks production routing and setup errors as well as the existing saved-question behavior. npm run lint, npm run build, and npm run test:questions check integration and question-bank preservation. A real listening test on the deployed phone still requires the server key and a successful Gemini response.

Official references checked on 16 October 2026:
- https://ai.google.dev/gemini-api/docs/speech-generation
- https://ai.google.dev/gemini-api/docs/interactions-overview
- https://support.google.com/gemini/answer/15277943
