import { FlashcardQuestion } from '../services/questionParser';

export const PROJECT_MANAGEMENT_2_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'pm2-q-200',
    subject: 'Project Management 2.0',
    sourceFileName: 'Engineering_Management_Reviewer.pdf',
    questionNumber: 200,
    question: 'A more aggressive means of promoting the sales of a product or service.',
    choices: [
      { id: 'A', text: 'Advertising' },
      { id: 'B', text: 'Publicity' },
      { id: 'C', text: 'Sales promotion' },
      { id: 'D', text: 'Personal selling' }
    ],
    correctChoiceId: 'C',
    explanation: 'In engineering management and marketing, sales promotion is defined as a more aggressive means of promoting the sales of a product or service, utilizing short-term direct incentives, trade allowances, discounts, and premiums to stimulate immediate buyer demand.'
  }
];
