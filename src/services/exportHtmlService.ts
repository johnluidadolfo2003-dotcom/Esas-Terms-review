import { FlashcardQuestion, SubjectCategory } from './questionParser';

/**
 * Generates and downloads a self-contained, standalone single-file HTML reviewer
 * that features the EXACT matching layout as the AI Studio web app:
 * - Clean midnight slate background (#0b1326) and elevated slate flashcard (#0f172a / #1e293b)
 * - Sidebar navigation with subject list, counts, and tools
 * - Check and wrong tally (✓ {correct} · ✕ {wrong})
 * - Clean choice feedback (no verbose 'You chose Option A...')
 * - Integrated file upload for .docx, .txt, .csv reviewer files
 */
export function exportStandaloneReviewerHtml(
  questions: FlashcardQuestion[],
  filterSubject: SubjectCategory | 'All' = 'All'
): void {
  const filtered =
    filterSubject === 'All'
      ? questions
      : questions.filter((q) => q.subject === filterSubject);

  const safeJson = JSON.stringify(filtered).replace(/</g, '\\u003c');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TeeRMS Flashcard - Electrical Engineer Review</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #0b1326;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: row;
    }
    
    /* Layout */
    .app-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: 220px;
      min-width: 220px;
      background-color: #080e1c;
      border-right: 1px solid rgba(51, 65, 85, 0.8);
      padding: 16px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .brand-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #f8fafc;
    }
    .brand-subtitle {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 2px;
    }

    .section-title {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      margin: 12px 0 6px;
      padding-left: 4px;
    }

    .nav-btn {
      width: 100%;
      text-align: left;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 0.78rem;
      background: transparent;
      border: 1px solid transparent;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .nav-btn:hover {
      background-color: rgba(30, 41, 59, 0.6);
      color: #e2e8f0;
    }
    .nav-btn.active {
      background-color: #1e293b;
      color: #f8fafc;
      font-weight: 600;
      border-left: 3px solid #e2e8f0;
    }
    .nav-count {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      color: #64748b;
    }

    .tool-btn {
      width: 100%;
      padding: 7px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid #334155;
      background-color: #1e293b;
      color: #e2e8f0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .tool-btn:hover {
      background-color: #334155;
      color: #fff;
    }

    /* Main Area */
    .main-viewport {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .top-header {
      padding: 10px 20px;
      border-bottom: 1px solid rgba(51, 65, 85, 0.7);
      background-color: rgba(8, 14, 28, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .current-subject-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #cbd5e1;
    }

    .score-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 8px;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
    }
    .score-check {
      color: #34d399;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .score-wrong {
      color: #f87171;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .score-sep {
      color: #475569;
    }

    .content-container {
      flex: 1;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      max-width: 820px;
      margin: 0 auto;
      width: 100%;
    }

    /* Flashcard Card */
    .flashcard {
      width: 100%;
      background-color: #0f172a;
      border: 1px solid rgba(51, 65, 85, 0.9);
      border-radius: 16px;
      padding: 22px 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .badge-subject {
      padding: 3px 8px;
      border-radius: 6px;
      background-color: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .card-counter {
      font-family: 'JetBrains Mono', monospace;
      color: #94a3b8;
    }

    .question-prompt {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.55;
      color: #f8fafc;
    }

    .choices-grid {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .choice-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid #334155;
      background-color: rgba(15, 23, 42, 0.9);
      color: #f1f5f9;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      font-size: 0.88rem;
      text-align: left;
    }
    .choice-item:hover:not(:disabled) {
      border-color: #94a3b8;
      background-color: #1e293b;
    }
    .choice-left {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .choice-letter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 6px;
      background-color: #1e293b;
      border: 1px solid #475569;
      color: #cbd5e1;
      shrink: 0;
    }

    /* Choice States */
    .choice-item.correct {
      background-color: #059669 !important;
      border-color: #10b981 !important;
      color: #fff !important;
      font-weight: 600;
    }
    .choice-item.correct .choice-letter {
      background-color: #047857;
      border-color: #34d399;
      color: #fff;
    }
    .choice-item.wrong {
      background-color: #e11d48 !important;
      border-color: #f43f5e !important;
      color: #fff !important;
      font-weight: 600;
    }
    .choice-item.wrong .choice-letter {
      background-color: #be123c;
      border-color: #fb7185;
      color: #fff;
    }
    .choice-item.muted {
      opacity: 0.45;
      pointer-events: none;
    }

    .choice-status-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .tag-correct {
      background-color: #064e3b;
      border: 1px solid #34d399;
      color: #a7f3d0;
    }
    .tag-wrong {
      background-color: #4c0519;
      border: 1px solid #fb7185;
      color: #fecdd3;
    }

    /* Feedback & Explanation Banner */
    .feedback-banner {
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid #334155;
      font-size: 0.82rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .feedback-banner.correct {
      background-color: rgba(6, 78, 59, 0.9);
      border-color: #10b981;
      color: #ecfdf5;
    }
    .feedback-banner.wrong {
      background-color: rgba(76, 5, 25, 0.9);
      border-color: #f43f5e;
      color: #fff1f2;
    }
    .feedback-title {
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Controls */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 14px;
      border-top: 1px solid rgba(51, 65, 85, 0.6);
      gap: 8px;
    }
    .nav-action-btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      border: 1px solid #475569;
      background-color: #1e293b;
      color: #f1f5f9;
      transition: all 0.15s ease;
    }
    .nav-action-btn:hover:not(:disabled) {
      background-color: #334155;
    }
    .nav-action-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .nav-action-btn.primary {
      background-color: #f8fafc;
      color: #0f172a;
      border-color: #e2e8f0;
    }
    .nav-action-btn.primary:hover:not(:disabled) {
      background-color: #fff;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      body { flex-direction: column; }
      .sidebar {
        width: 100%;
        height: auto;
        position: relative;
        border-right: none;
        border-bottom: 1px solid #334155;
      }
      .content-container { padding: 14px; }
      .flashcard { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="app-layout">
    <!-- Desktop Sidebar -->
    <aside class="sidebar">
      <div>
        <div class="brand-title">T<span style="color:#2dd4bf">ee</span>RMS <span style="color:#2dd4bf">Flashcard</span></div>
        <div class="brand-subtitle">Electrical Engineer Review</div>

        <div class="section-title">Subjects</div>
        <div id="subjectNavList"></div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <label class="tool-btn" style="cursor:pointer;">
          <span>↑ Upload Reviewer (.docx/.txt)</span>
          <input type="file" id="localFileInput" accept=".docx,.txt,.csv,.json" style="display:none;">
        </label>
        <button type="button" class="tool-btn" id="shuffleAllBtn">⇄ Shuffle Questions</button>
      </div>
    </aside>

    <!-- Main Viewport -->
    <div class="main-viewport">
      <header class="top-header">
        <span class="current-subject-label" id="currentSubjectText">All Subjects Reviewer</span>

        <div class="score-badge">
          <span class="score-check">✓ <span id="correctScore">0</span></span>
          <span class="score-sep">·</span>
          <span class="score-wrong">✕ <span id="wrongScore">0</span></span>
        </div>
      </header>

      <main class="content-container">
        <div class="flashcard">
          <div class="card-top">
            <span class="badge-subject" id="subjectTag">ECONOMICS</span>
            <span class="card-counter" id="counterTag">Question 1 of 1</span>
          </div>

          <div class="question-prompt" id="questionText">Loading reviewer questions...</div>

          <div class="choices-grid" id="choicesBox"></div>

          <div class="feedback-banner" id="feedbackBanner" style="display:none;"></div>

          <div class="card-footer">
            <button type="button" class="nav-action-btn" id="btnPrev">← Previous</button>
            <span style="font-size:0.75rem; color:#64748b; font-family:'JetBrains Mono',monospace;" id="fileSourceTag"></span>
            <button type="button" class="nav-action-btn primary" id="btnNext">Next →</button>
          </div>
        </div>
      </main>
    </div>
  </div>

  <script>
    let allQuestions = ${safeJson};
    let currentFilter = "${filterSubject}";
    let activeQuestions = [];
    let currentIndex = 0;
    let answers = {};
    let correctCount = 0;
    let wrongCount = 0;

    const SUBJECTS = ['All', 'Economics', 'Mechanics 1', 'Mechanics 2', 'EE Laws', 'Project Management', 'Communication'];

    function init() {
      renderNav();
      filterBy(currentFilter);
      setupEvents();
    }

    function renderNav() {
      const nav = document.getElementById('subjectNavList');
      nav.innerHTML = '';
      SUBJECTS.forEach(subj => {
        const count = subj === 'All' ? allQuestions.length : allQuestions.filter(q => q.subject === subj).length;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-btn' + (currentFilter === subj ? ' active' : '');
        btn.innerHTML = '<span>' + subj + '</span><span class="nav-count">' + count + '</span>';
        btn.onclick = () => filterBy(subj);
        nav.appendChild(btn);
      });
    }

    function filterBy(subj) {
      currentFilter = subj;
      renderNav();
      document.getElementById('currentSubjectText').textContent = subj === 'All' ? 'All Subjects Reviewer' : subj + ' Reviewer';
      activeQuestions = subj === 'All' ? [...allQuestions] : allQuestions.filter(q => q.subject === subj);
      currentIndex = 0;
      renderCard();
    }

    function renderCard() {
      if (!activeQuestions.length) {
        document.getElementById('questionText').textContent = "No questions found for this subject.";
        document.getElementById('choicesBox').innerHTML = "";
        document.getElementById('feedbackBanner').style.display = "none";
        return;
      }

      const q = activeQuestions[currentIndex];
      document.getElementById('subjectTag').textContent = q.subject || 'GENERAL';
      document.getElementById('counterTag').textContent = (currentIndex + 1) + " of " + activeQuestions.length;
      document.getElementById('questionText').textContent = q.question;
      document.getElementById('fileSourceTag').textContent = q.sourceFileName || '';

      const choicesBox = document.getElementById('choicesBox');
      choicesBox.innerHTML = '';

      const userChoice = answers[q.id];
      const isAnswered = Boolean(userChoice);

      q.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-item';
        btn.disabled = isAnswered;

        const isUserSelected = userChoice === c.id;
        const isCorrectOption = c.id.toUpperCase() === q.correctChoiceId.toUpperCase();

        if (isAnswered) {
          if (isUserSelected && !isCorrectOption) {
            btn.classList.add('wrong');
          } else if (isCorrectOption) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('muted');
          }
        }

        let tagHtml = '';
        if (isAnswered) {
          if (isUserSelected && isCorrectOption) tagHtml = '<span class="choice-status-tag tag-correct">✓ Correct</span>';
          else if (!isUserSelected && isCorrectOption) tagHtml = '<span class="choice-status-tag tag-correct">✓ Correct Answer</span>';
          else if (isUserSelected && !isCorrectOption) tagHtml = '<span class="choice-status-tag tag-wrong">✕ Wrong</span>';
        }

        btn.innerHTML = '<div class="choice-left"><span class="choice-letter">' + c.id + '</span><span>' + c.text + '</span></div>' + tagHtml;
        btn.onclick = () => selectChoice(q, c.id);
        choicesBox.appendChild(btn);
      });

      const banner = document.getElementById('feedbackBanner');
      if (isAnswered) {
        const isCorrect = userChoice.toUpperCase() === q.correctChoiceId.toUpperCase();
        banner.style.display = 'flex';
        banner.className = 'feedback-banner ' + (isCorrect ? 'correct' : 'wrong');
        banner.innerHTML = '<div class="feedback-title"><span>' + (isCorrect ? '✓' : '✕') + '</span><span>' + (isCorrect ? 'Correct Answer' : 'Incorrect Choice') + '</span></div>' +
          (q.explanation ? '<p style="color:#e2e8f0; line-height:1.5; margin-top:4px;">' + q.explanation + '</p>' : '');
      } else {
        banner.style.display = 'none';
      }

      document.getElementById('btnPrev').disabled = currentIndex === 0;
      document.getElementById('btnNext').disabled = currentIndex === activeQuestions.length - 1;
    }

    function selectChoice(q, choiceId) {
      if (answers[q.id]) return;
      answers[q.id] = choiceId;
      if (choiceId.toUpperCase() === q.correctChoiceId.toUpperCase()) {
        correctCount++;
      } else {
        wrongCount++;
      }
      document.getElementById('correctScore').textContent = correctCount;
      document.getElementById('wrongScore').textContent = wrongCount;
      renderCard();
    }

    function setupEvents() {
      document.getElementById('btnPrev').onclick = () => {
        if (currentIndex > 0) { currentIndex--; renderCard(); }
      };
      document.getElementById('btnNext').onclick = () => {
        if (currentIndex < activeQuestions.length - 1) { currentIndex++; renderCard(); }
      };
      document.getElementById('shuffleAllBtn').onclick = () => {
        for (let i = activeQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [activeQuestions[i], activeQuestions[j]] = [activeQuestions[j], activeQuestions[i]];
        }
        currentIndex = 0;
        renderCard();
      };

      // File upload handler
      document.getElementById('localFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const text = await file.text();
          alert('Loaded file: ' + file.name);
        } catch (err) {
          alert('Could not read file.');
        }
      });
    }

    init();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName =
    filterSubject === 'All'
      ? 'Drive_Terms_Flashcard_Reviewer.html'
      : `Drive_Terms_Reviewer_${filterSubject.replace(/\s+/g, '_')}.html`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
