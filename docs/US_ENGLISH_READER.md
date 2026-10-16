# US English reader

Auto Read and Auto Read & Answer continue using device Web Speech synthesis. The old forced 0.70/0.58 pitch, hidden speed multiplier, UK-voice priority, and unidentified/female automatic fallbacks are removed.

Automatic mode selects only recognized US English male voices exposed by the browser. Natural/neural/premium/enhanced variants rank ahead of basic variants. The reader uses native pitch 1 and the exact selected speed. A voice dropdown, preview, selected-voice status, and saved preference replace the Baritone/Deep Bass buttons. Unknown-gender US voices can be explicitly previewed and selected; they are not automatically labeled male. Web Speech has no standard gender or audio-quality field, so names are recognized conservatively; no additional voices are downloaded or purchased by the app.

If the requested voice is missing, playback stops with guidance rather than silently choosing another accent or speaker. Device speech settings may offer US English male voices, but installed/downloaded voices are not necessarily exposed to every browser. Naturalness cannot be guaranteed across devices. A consistent hosted neural narrator would require a separately configured speech service; this update does not claim to provide one.

Voice loading waits briefly for the browser list and listens without replacing other voiceschanged handlers. Cancellation invalidates pending reads and stale callbacks so Pause, voice preview, question changes, or switching voice cannot advance an old auto-reading sequence. Stored voice preference also works for the current session when browser storage is blocked.

Speech cleanup no longer misreads P2 as pesos, substitutes theta for a literal q, or removes the friction subscript before expanding it.

Validation: `npm run test:speech` covers locale/voice ranking, refusal of unidentified automatic male voices, explicit selection and missing saved voices, native pitch and speed, delayed voice loading, cancellation, callback deduplication, subscriptions, and text normalization. Run `npm run lint`, `npm run build`, `npm run test:questions`, and `npm run test:server` for regressions. These checks use a simulated speech engine; final voice timbre and pronunciation still need listening on the target phone/browser using Test Voice.

References:
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
- https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoiceidentifieralex
