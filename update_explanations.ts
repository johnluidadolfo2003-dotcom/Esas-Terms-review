import fs from 'fs';
import path from 'path';

import { DRIVE_COPIED_QUESTIONS } from './src/data/driveQuestions';

console.log(`Total questions in dataset: ${DRIVE_COPIED_QUESTIONS.length}`);

function generateRichExplanation(q: any): string {
  const subject = q.subject || 'General Engineering';
  const qText = q.question || '';
  const choices = q.choices || [];
  const correctId = q.correctChoiceId || 'A';
  const correctChoiceObj = choices.find((c: any) => c.id === correctId);
  const correctText = correctChoiceObj ? correctChoiceObj.text : '';
  const existingExp = (q.explanation || '').trim();

  // Determine if existing explanation is redundant or trivial
  const isTrivial =
    !existingExp ||
    existingExp.toLowerCase().includes('the correct answer is') ||
    existingExp.toLowerCase().startsWith('correct answer:') ||
    existingExp.trim().toLowerCase() === qText.trim().toLowerCase() ||
    existingExp.split(' ').length < 5;

  if (!isTrivial) {
    return existingExp;
  }

  const qLower = qText.toLowerCase();

  // EE LAWS & RA 7920 & RA 9136 & EPIRA
  if (
    subject === 'EE Laws' ||
    qLower.includes('7920') ||
    qLower.includes('board') ||
    qLower.includes('bee') ||
    qLower.includes('prbee') ||
    qLower.includes('prc') ||
    qLower.includes('pec') ||
    qLower.includes('9136') ||
    qLower.includes('epira')
  ) {
    if (qLower.includes('florentino') || qLower.includes('chairman') || qLower.includes('board of electrical')) {
      return `Engr. Rafael F. Florentino served as the Chairman of the Professional Regulatory Board of Electrical Engineering (PRBEE) during the promulgation of the Implementing Rules and Regulations (IRR) and Code of Ethics of R.A. 7920 in 1995.`;
    }
    if (qLower.includes('delinquent') || qLower.includes('fee') || qLower.includes('consecutive')) {
      return `Under Art. III Sec. 27 of R.A. 7920, electrical practitioners (PEE, REE, RME) delinquent in annual registration fees for 5 consecutive years are suspended from practice until reinstatement requirements are satisfied.`;
    }
    if (qLower.includes('admission') || qLower.includes('days prior')) {
      return `PRC examination guidelines require notices of admission to be issued at least 10 days before the first examination day to allow candidates sufficient verification and preparation time.`;
    }
    if (qLower.includes('quasi-legislative') || qLower.includes('quasi legislative')) {
      return `Quasi-legislative power grants administrative agencies like the PRBEE the authority to formulate, issue, and enforce rule-making policies and implementing rules under their governing statute.`;
    }
    if (qLower.includes('quasi-judicial') || qLower.includes('quasi judicial')) {
      return `Quasi-judicial authority enables the Board to conduct investigative proceedings, hold hearings, inspect electrical installations, and adjudicate cases concerning professional malpractice.`;
    }
    if (qLower.includes('house bill') || qLower.includes('11063')) {
      return `R.A. 7920 was enacted through the consolidation of House Bill No. 11063 and Senate Bill No. 1766, officially signed into law by President Fidel V. Ramos on February 24, 1995.`;
    }
    if (qLower.includes('9136') || qLower.includes('epira')) {
      return `R.A. 9136 (EPIRA of 2001) unbundled the electric power sector into Generation, Transmission, Distribution, and Supply to foster competitive electricity markets and regulatory oversight via the ERC.`;
    }
    if (qLower.includes('reciprocity') || qLower.includes('foreign')) {
      return `Foreign reciprocity (Sec. 38, R.A. 7920) allows foreign electrical engineers to practice in the Philippines only if their home country grants equal privileges to Filipino electrical engineers.`;
    }
    if (qLower.includes('cpd') || qLower.includes('continuing professional')) {
      return `The Continuing Professional Development (CPD) Council for Electrical Engineering is chaired by a PRBEE Board Member alongside representatives from accredited professional organizations (IIEE) and academia.`;
    }
    if (qLower.includes('rme') || qLower.includes('kva') || qLower.includes('master electrician')) {
      return `Under R.A. 7920 Sec. 33, a Registered Master Electrician (RME) is authorized to handle electrical installations up to 500 kVA capacity and voltage up to 600 Volts.`;
    }
    if (qLower.includes('yellow alert') || qLower.includes('red alert') || qLower.includes('grid')) {
      return `Under Grid Code operational guidelines, a Yellow Alert signals that operating reserves are less than the largest online generating unit, whereas a Red Alert indicates imminent generation deficiency.`;
    }
    return `In Philippine electrical law practice, ${correctText} represents the binding statutory provision under R.A. 7920, R.A. 9136, and PRBEE board resolutions designed to enforce safety and professional standards.`;
  }

  // ECONOMICS
  if (
    subject === 'Economics' ||
    qLower.includes('cost') ||
    qLower.includes('interest') ||
    qLower.includes('annuity') ||
    qLower.includes('depreciation') ||
    qLower.includes('capital')
  ) {
    if (qLower.includes('annuity') || qLower.includes('payment')) {
      return `In engineering economics, an ordinary annuity has payments at the end of each compounding period, while an annuity due has payments occurring at the beginning of each period.`;
    }
    if (qLower.includes('sunk')) {
      return `A sunk cost is an unrecoverable past expenditure. In economic decision analysis, sunk costs are excluded because future choices cannot alter past cash flows.`;
    }
    if (qLower.includes('depreciation') || qLower.includes('straight line') || qLower.includes('sinking fund')) {
      return `Depreciation methods allocate the asset's initial cost minus salvage value over its useful life. The straight-line method yields equal annual depreciation charges.`;
    }
    if (qLower.includes('interest') || qLower.includes('rate') || qLower.includes('effective')) {
      return `Effective interest rate calculates the exact annual return accounting for intra-year compounding frequencies, unlike nominal annual interest rates.`;
    }
    if (qLower.includes('break-even') || qLower.includes('breakeven')) {
      return `At the break-even point, total revenue exactly equals total costs (fixed costs + variable costs), resulting in zero net profit or loss.`;
    }
    return `In engineering economic analysis, ${correctText} is utilized to quantify cash flow equivalence, assess capital recovery, and compare alternative project investments.`;
  }

  // MECHANICS 1 & 2
  if (
    subject === 'Mechanics 1' ||
    subject === 'Mechanics 2' ||
    qLower.includes('force') ||
    qLower.includes('friction') ||
    qLower.includes('velocity') ||
    qLower.includes('acceleration') ||
    qLower.includes('sled') ||
    qLower.includes('inclined')
  ) {
    if (qLower.includes('sled') || qLower.includes('friction') || qLower.includes('inclined') || qLower.includes('hill')) {
      return `For an object of mass m sliding on an inclined slope θ, normal force is N = mg cos θ. Thus, kinetic friction force equals f = μN = μ mg cos θ acting opposite to the movement.`;
    }
    if (qLower.includes('acceleration') || qLower.includes('motion') || qLower.includes('newton')) {
      return `Newton's second law dictates that net external force equals mass times acceleration (F = ma), forming the core governing equation for rectilinear and curvilinear dynamics.`;
    }
    if (qLower.includes('moment of inertia') || qLower.includes('centroid')) {
      return `The centroid defines the geometric center of an area, while the moment of inertia (second moment of area) measures resistance to bending and torsional deformation.`;
    }
    return `In classical mechanics, ${correctText} applies Newtonian vector principles (statical equilibrium ∑F=0 or dynamic acceleration F=ma) to analyze structural and physical forces.`;
  }

  // COMMUNICATION
  if (
    subject === 'Communication' ||
    qLower.includes('modulation') ||
    qLower.includes('frequency') ||
    qLower.includes('antenna') ||
    qLower.includes('fiber') ||
    qLower.includes('noise') ||
    qLower.includes('signal')
  ) {
    if (qLower.includes('fiber') || qLower.includes('light') || qLower.includes('refraction')) {
      return `Optical communication transmits light signals through core glass cladding via total internal reflection, achieving high bandwidth with minimal attenuation over long distances.`;
    }
    if (qLower.includes('modulation') || qLower.includes('am') || qLower.includes('fm') || qLower.includes('qam')) {
      return `Modulation encodes information onto a high-frequency carrier wave (varying amplitude, frequency, or phase) to enable efficient transmission over physical channels.`;
    }
    return `In telecommunication systems, ${correctText} is fundamental to maintaining signal integrity, optimizing channel bandwidth, and reducing electromagnetic noise transmission.`;
  }

  // PROJECT MANAGEMENT
  if (subject === 'Project Management' || qLower.includes('project') || qLower.includes('pert') || qLower.includes('cpm')) {
    return `In project management, ${correctText} serves as a critical control metric for task dependencies, critical path scheduling, resource leveling, and risk management.`;
  }

  // GENERAL
  return `${correctText} represents the established technical standard and theoretical foundation applicable to this engineering principles domain.`;
}

// Generate updated dataset
let updatedCount = 0;
const updatedQuestions = DRIVE_COPIED_QUESTIONS.map((q) => {
  const newExp = generateRichExplanation(q);
  if (newExp !== q.explanation) {
    updatedCount++;
  }
  return {
    ...q,
    explanation: newExp,
  };
});

console.log(`Updated explanations for ${updatedCount} questions out of ${DRIVE_COPIED_QUESTIONS.length}.`);

const filePath = path.join(process.cwd(), 'src/data/driveQuestions.ts');
const fileHeader = `import { FlashcardQuestion } from "../services/questionParser";\n\nexport const DRIVE_COPIED_QUESTIONS: FlashcardQuestion[] = `;
const formattedJson = JSON.stringify(updatedQuestions, null, 2);
const newContent = `${fileHeader}${formattedJson};\n`;

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Successfully written updated driveQuestions.ts!');
