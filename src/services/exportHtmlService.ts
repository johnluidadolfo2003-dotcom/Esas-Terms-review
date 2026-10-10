import { FlashcardQuestion, SubjectCategory } from './questionParser';

/**
 * Generates and downloads a self-contained, standalone single-file HTML reviewer
 * that can be opened in any web browser on desktop, tablet, or phone without internet or server hosting.
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
  <title>Engineering Terms Flashcard Reviewer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #09090b;
      color: #fafafa;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      padding: 16px;
    }
    header {
      max-width: 720px;
      width: 100%;
      margin: 0 auto 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid #27272a;
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    h1 { font-size: 1.1rem; font-weight: 700; color: #f4f4f5; }
    .badge {
      font-size: 0.75rem;
      background-color: #18181b;
      border: 1px solid #3f3f46;
      padding: 4px 8px;
      border-radius: 6px;
      color: #a1a1aa;
    }
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }
    select, button {
      background-color: #18181b;
      color: #e4e4e7;
      border: 1px solid #3f3f46;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 0.82rem;
      cursor: pointer;
    }
    button:hover, select:hover { background-color: #27272a; }
    button.primary { background-color: #059669; border-color: #10b981; color: #fff; font-weight: 600; }
    button.primary:hover { background-color: #047857; }
    
    main {
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .progress-bar-wrap {
      width: 100%;
      height: 6px;
      background-color: #27272a;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background-color: #10b981;
      transition: width 0.2s ease;
    }
    .card {
      background-color: #121215;
      border: 1px solid #27272a;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .card-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #a1a1aa;
    }
    .card-subject {
      color: #34d399;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .question-text {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.5;
      color: #f4f4f5;
    }
    .choices-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .choice-btn {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      text-align: left;
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid #27272a;
      background-color: #18181b;
      color: #d4d4d8;
      font-size: 0.9rem;
      transition: all 0.15s ease;
    }
    .choice-btn:hover { border-color: #52525b; background-color: #202024; }
    .choice-id {
      font-weight: 700;
      color: #a1a1aa;
      min-width: 20px;
    }
    .choice-btn.correct {
      background-color: #064e3b;
      border-color: #10b981;
      color: #ecfdf5;
    }
    .choice-btn.wrong {
      background-color: #7f1d1d;
      border-color: #ef4444;
      color: #fef2f2;
    }
    .explanation-box {
      margin-top: 8px;
      padding: 12px 14px;
      background-color: #18181b;
      border-left: 3px solid #10b981;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #a1a1aa;
      line-height: 1.5;
    }
    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .stats-footer {
      max-width: 720px;
      width: 100%;
      margin: 16px auto 0;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #71717a;
      border-top: 1px solid #27272a;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <header>
    <div class="top-bar">
      <h1>Drive Terms Flashcard Reviewer</h1>
      <span class="badge" id="statsBadge">Score: 0 / 0</span>
    </div>
    <div class="filters">
      <select id="subjectSelect">
        <option value="All">All Subjects</option>
        <option value="Economics">Economics</option>
        <option value="Mechanics 1">Mechanics 1</option>
        <option value="Mechanics 2">Mechanics 2</option>
        <option value="EE Laws">EE Laws</option>
        <option value="Project Management">Project Management</option>
        <option value="Communication">Communication</option>
      </select>
      <button id="shuffleBtn" type="button">Shuffle</button>
      <button id="resetBtn" type="button">Reset</button>
    </div>
  </header>

  <main>
    <div class="progress-bar-wrap">
      <div class="progress-bar-fill" id="progressBar"></div>
    </div>

    <div class="card">
      <div class="card-meta">
        <span class="card-subject" id="subjectLabel">SUBJECT</span>
        <span id="counterLabel">Question 1 of 1</span>
      </div>

      <div class="question-text" id="questionText">Loading questions...</div>

      <div class="choices-list" id="choicesContainer"></div>

      <div class="explanation-box" id="explanationBox" style="display:none;"></div>
    </div>

    <div class="controls">
      <button id="prevBtn" type="button">&larr; Previous</button>
      <div style="font-size:0.8rem; color:#a1a1aa;" id="statusIndicator">Select an option</div>
      <button id="nextBtn" class="primary" type="button">Next &rarr;</button>
    </div>
  </main>

  <div class="stats-footer">
    <span>Standalone Offline Reviewer (Single-File HTML)</span>
    <span id="totalQuestionsCount">0 questions</span>
  </div>

  <script>
    const allQuestions = ${safeJson};
    let activeQuestions = [...allQuestions];
    let currentIndex = 0;
    let answers = {}; // questionId -> selectedChoiceId
    let score = 0;

    const subjectSelect = document.getElementById('subjectSelect');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const subjectLabel = document.getElementById('subjectLabel');
    const counterLabel = document.getElementById('counterLabel');
    const questionText = document.getElementById('questionText');
    const choicesContainer = document.getElementById('choicesContainer');
    const explanationBox = document.getElementById('explanationBox');
    const progressBar = document.getElementById('progressBar');
    const statsBadge = document.getElementById('statsBadge');
    const statusIndicator = document.getElementById('statusIndicator');
    const totalQuestionsCount = document.getElementById('totalQuestionsCount');

    function applyFilter() {
      const selected = subjectSelect.value;
      if (selected === 'All') {
        activeQuestions = [...allQuestions];
      } else {
        activeQuestions = allQuestions.filter(q => q.subject === selected);
      }
      currentIndex = 0;
      renderCard();
    }

    function renderCard() {
      if (!activeQuestions.length) {
        questionText.textContent = "No questions found for this subject filter.";
        choicesContainer.innerHTML = "";
        explanationBox.style.display = "none";
        return;
      }

      const q = activeQuestions[currentIndex];
      subjectLabel.textContent = q.subject || 'Engineering Reviewer';
      counterLabel.textContent = "Question " + (currentIndex + 1) + " of " + activeQuestions.length;
      totalQuestionsCount.textContent = activeQuestions.length + " questions available";
      questionText.textContent = q.question;
      
      const pct = Math.round(((currentIndex + 1) / activeQuestions.length) * 100);
      progressBar.style.width = pct + "%";

      const answeredChoice = answers[q.id];
      choicesContainer.innerHTML = "";
      explanationBox.style.display = "none";

      q.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice-btn';
        
        const idSpan = document.createElement('span');
        idSpan.className = 'choice-id';
        idSpan.textContent = c.id + ".";
        
        const textSpan = document.createElement('span');
        textSpan.textContent = c.text;

        btn.appendChild(idSpan);
        btn.appendChild(textSpan);

        if (answeredChoice) {
          if (c.id === q.correctChoiceId) {
            btn.classList.add('correct');
          } else if (c.id === answeredChoice) {
            btn.classList.add('wrong');
          }
        } else {
          btn.addEventListener('click', () => {
            selectChoice(q, c.id);
          });
        }

        choicesContainer.appendChild(btn);
      });

      if (answeredChoice) {
        explanationBox.style.display = "block";
        const isCorrect = answeredChoice === q.correctChoiceId;
        explanationBox.innerHTML = (isCorrect ? "<strong>Correct!</strong> " : "<strong>Incorrect.</strong> Correct answer is <strong>" + q.correctChoiceId + "</strong>. ") + (q.explanation || "");
        statusIndicator.textContent = isCorrect ? "Answered correctly" : "Review explanation";
      } else {
        statusIndicator.textContent = "Select an option";
      }

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === activeQuestions.length - 1;

      updateScore();
    }

    function selectChoice(q, choiceId) {
      if (answers[q.id]) return;
      answers[q.id] = choiceId;
      renderCard();
    }

    function updateScore() {
      let correctCount = 0;
      let totalAnswered = 0;
      activeQuestions.forEach(q => {
        if (answers[q.id]) {
          totalAnswered++;
          if (answers[q.id] === q.correctChoiceId) {
            correctCount++;
          }
        }
      });
      statsBadge.textContent = "Score: " + correctCount + " / " + totalAnswered;
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCard();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < activeQuestions.length - 1) {
        currentIndex++;
        renderCard();
      }
    });

    shuffleBtn.addEventListener('click', () => {
      for (let i = activeQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [activeQuestions[i], activeQuestions[j]] = [activeQuestions[j], activeQuestions[i]];
      }
      currentIndex = 0;
      renderCard();
    });

    resetBtn.addEventListener('click', () => {
      answers = {};
      currentIndex = 0;
      renderCard();
    });

    subjectSelect.addEventListener('change', applyFilter);

    renderCard();
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
