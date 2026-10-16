# US English reader

Auto Read and Auto Read & Answer use device Web Speech synthesis at native pitch 1 and the exact selected speed. The forced bass pitch and UK-voice priority are removed. The voice dropdown, preview, and saved preference remain available.

Automatic selection prefers recognized US English male voices, with natural/neural/premium/enhanced variants first. If no recognized male exists, it uses another available US voice and explicitly says that male gender is not confirmed. A missing saved voice falls back with a notice. If the browser's voice list is empty or has no US voice, the reader leaves voice selection to the engine with lang=en-US rather than refusing to speak. That fallback cannot guarantee a US male voice; the UI says so. The browser API has no standard gender field, so unknown voices are never relabeled male.

Play and Test Voice call speechSynthesis.speak synchronously from their tap handlers. There is no asynchronous voice-list wait before speaking. This preserves the direct user interaction for engines that restrict audio startup. The initial auto-reading attempt may still be blocked by browser audio policy; Play is always visible so the user can start or restart explicitly. Browser error codes produce specific guidance for blocked audio, audio output, missing voices/engine, or network problems. A startup watchdog releases a dropped request and offers a retry instead of leaving the UI indefinitely reading. A paused engine is resumed before speaking.

Cancellation invalidates speech callbacks so Pause, preview, voice changes, and question changes cannot advance an old sequence. Voice-list changes update the choices without restarting a canceled read. Independent voiceschanged listeners do not overwrite other listeners. Preference works for the current session even when persistent storage is blocked.

Actual timbre, pronunciation, and audible output still require listening on the target phone/browser. The app cannot detect device volume, muted site settings, Bluetooth routing, or guarantee that a browser exposes an installed male voice. A consistent hosted neural narrator would need a separately configured speech service; this code does not claim to provision one.

Validation: npm run test:speech covers 13 regression cases: US male ranking, conservative gender identification, fallback for unavailable saved/male voices, synchronous startup, exact pitch/speed, duplicate callbacks, cancellation, empty and late lists, paused engines, browser error reasons, startup timeout, successful startup cleanup, subscriptions, and text normalization. npm run lint and npm run build check integration. These tests simulate speech and do not establish real-device audio quality.

References:
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisErrorEvent/error
- https://groups.google.com/a/chromium.org/g/blink-dev/c/WsnBm53M4Pc/m/f6c7DBBIBwAJ
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
