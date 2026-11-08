import fs from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

// Load verified answer keys from current coachG1000Questions.ts
const currentTs = fs.readFileSync('src/data/coachG1000Questions.ts', 'utf8');
const startIdx = currentTs.indexOf('= [') + 2;
const endIdx = currentTs.lastIndexOf(']');
const currentQs = JSON.parse(currentTs.slice(startIdx, endIdx + 1));
const answerKeyMap = new Map();
currentQs.forEach(q => answerKeyMap.set(q.id, q.correctChoiceId));
console.log(`Loaded ${answerKeyMap.size} verified answer keys.`);

async function main() {
  const buf = new Uint8Array(fs.readFileSync('public/assets/aistudio/COACH_G_1000_TERMS_54292455.pdf'));
  const doc = await pdfjs.getDocument({ data: buf, standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/' }).promise;

  function extractColLines(items) {
    items.sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5];
      if (Math.abs(yDiff) > 3) return yDiff;
      return a.transform[4] - b.transform[4];
    });
    const lines = [];
    let curLine = '';
    let lastX = 0, lastW = 0, lastY = null;
    for (const it of items) {
      const x = it.transform[4];
      const y = it.transform[5];
      const w = it.width;
      if (lastY !== null && Math.abs(lastY - y) > 3) {
        if (curLine.trim()) lines.push(curLine.trim());
        curLine = it.str;
        lastX = x; lastW = w; lastY = y;
      } else {
        const gap = x - (lastX + lastW);
        if (it.str === ' ') {
          curLine += ' ';
        } else if (gap > 2.0 && !curLine.endsWith(' ')) {
          curLine += ' ' + it.str;
        } else {
          curLine += it.str;
        }
        lastX = x; lastW = w; lastY = y;
      }
    }
    if (curLine.trim()) lines.push(curLine.trim());
    return lines;
  }

  function parseChoices(rawLines) {
    const text = rawLines.join(' ');
    const choiceRegex = /(?:^|\s)([A-D])\s*[.:]\s*/g;
    let matches = Array.from(text.matchAll(choiceRegex));
    
    if (matches.length < 4) {
      const altRegex = /(?:^|\s)([A-D])\s*(?:[.:]|(?=[A-Za-z0-9]))\s*/g;
      matches = Array.from(text.matchAll(altRegex));
    }
    
    const ids = matches.map(m => m[1]);
    const aIdx = ids.indexOf('A');
    const bIdx = ids.indexOf('B');
    const cIdx = ids.indexOf('C');
    const dIdx = ids.indexOf('D');
    
    if (aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) {
      return null;
    }
    
    const keyMatches = [matches[aIdx], matches[bIdx], matches[cIdx], matches[dIdx]].sort((x, y) => x.index - y.index);
    const stem = text.slice(0, keyMatches[0].index).trim();
    const choices = {};
    for (let i = 0; i < keyMatches.length; i++) {
      const id = keyMatches[i][1];
      const start = keyMatches[i].index + keyMatches[i][0].length;
      const end = (i + 1 < keyMatches.length) ? keyMatches[i + 1].index : text.length;
      choices[id] = text.slice(start, end).trim();
    }
    return { stem, choices };
  }

  // Load known manual patches for items with non-standard formatting (e.g. choice A missing period or complex formulas)
  const manualPatches = {
    '1-6': {
      stem: 'When a fluid flow through a pipe of cross sectional are A with a velocity v, the discharge is',
      choices: [
        { id: 'A', text: 'Av^2' },
        { id: 'B', text: 'Av' },
        { id: 'C', text: 'A^2V' },
        { id: 'D', text: 'A^2/2v' },
      ],
      correctChoiceId: 'B',
    },
    '1-31': {
      stem: 'Which is not used in programming applications?',
      choices: [
        { id: 'A', text: 'C' },
        { id: 'B', text: 'Java' },
        { id: 'C', text: 'Oracle' },
        { id: 'D', text: 'Visual Basic' },
      ],
      correctChoiceId: 'C',
    },
    '1-33': {
      stem: 'When a body is subjected to three mutually perpendicular stresses, of equal intensity, the ratio of direct stress to the corresponding volumetric strain is known as',
      choices: [
        { id: 'A', text: "Young's modulus" },
        { id: 'B', text: 'Modulus of Rigidity' },
        { id: 'C', text: 'Bulk Modulus' },
        { id: 'D', text: "Poisson's ratio" },
      ],
      correctChoiceId: 'C',
    },
    '1-34': {
      stem: 'What is the formula for a straight line depreciation rate?',
      choices: [
        { id: 'A', text: '% net salvage value / estimated service life' },
        { id: 'B', text: '100% net salvage value / estimated service life' },
        { id: 'C', text: 'average net salvage value / estimated service life' },
        { id: 'D', text: '(100% - % net salvage value) / estimated service life' },
      ],
      correctChoiceId: 'D',
    },
    '1-43': {
      stem: 'A diagram drawn to help visualize and simplify problem having diverse receipts and disbursements.',
      choices: [
        { id: 'A', text: 'Budget' },
        { id: 'B', text: 'investment' },
        { id: 'C', text: 'year-end-convention' },
        { id: 'D', text: 'Cash-flow' },
      ],
      correctChoiceId: 'D',
    },
    '1-47': {
      stem: 'The relationship between the extension of a spring and the force required to produces the extension is',
      choices: [
        { id: 'A', text: 'F=ma' },
        { id: 'B', text: 'F=μN' },
        { id: 'C', text: 'F = mv^2 / a' },
        { id: 'D', text: 'F= kx' },
      ],
      correctChoiceId: 'D',
    },
    '1-52': {
      stem: 'Which of the following is added to the drinking water distribution system for disinfection?',
      choices: [
        { id: 'A', text: 'Soda ash' },
        { id: 'B', text: 'Chlorine' },
        { id: 'C', text: 'Lime' },
        { id: 'D', text: 'Iodine' },
      ],
      correctChoiceId: 'B',
    },
    '1-69': {
      stem: 'What mechanical property of material refers to the nominal stress at fracture in a certain test at constant load and constant temperature?',
      choices: [
        { id: 'A', text: 'Creep strength' },
        { id: 'B', text: 'hardness' },
        { id: 'C', text: 'stress rupture strength' },
        { id: 'D', text: 'compressive yield strength' },
      ],
      correctChoiceId: 'C',
    },
    '1-85': {
      stem: 'Which of the following in the instrument used to measure the frequency?',
      choices: [
        { id: 'A', text: 'tachometer' },
        { id: 'B', text: 'frequency meter' },
        { id: 'C', text: 'speedometer' },
        { id: 'D', text: 'pitot tube' },
      ],
      correctChoiceId: 'B',
    },
    '1-90': {
      stem: 'Circuit breaker is a device designed to operate a circuit by nonautomatic means and to disconnect the circuit automatically on a predetermined overcurrent without damage to itself when properly applied within the rating.',
      choices: [
        { id: 'A', text: 'operate, disconnect' },
        { id: 'B', text: 'disconnect, operate' },
        { id: 'C', text: 'close, open' },
        { id: 'D', text: 'open, close' },
      ],
      correctChoiceId: 'A',
    },
    '2-7': {
      stem: 'RA 7832 concerns on',
      choices: [
        { id: 'A', text: 'pilferage of electricity, theft of transmission materials and capping of system loss' },
        { id: 'B', text: 'pilferage of electricity, theft of transmission materials and rationalizing of system loss' },
        { id: 'C', text: 'pilferage of electricity energy' },
        { id: 'D', text: 'pilferage of electricity and electrical materials' },
      ],
      correctChoiceId: 'B',
    },
    '2-29': {
      stem: 'When engineers enters management, what is most likely problem he finds the difficult to acquire?',
      choices: [
        { id: 'A', text: 'Learning to trust others' },
        { id: 'B', text: 'Learning how to work through others' },
        { id: 'C', text: 'Learning how to take satisfaction in the work of others' },
        { id: 'D', text: 'All of the above' },
      ],
      correctChoiceId: 'D',
    },
    '2-42': {
      stem: 'Which of the following computer language is used for artificial Intelligence?',
      choices: [
        { id: 'A', text: 'FORTRAN' },
        { id: 'B', text: 'PROLOG' },
        { id: 'C', text: 'C' },
        { id: 'D', text: 'COBOL' },
      ],
      correctChoiceId: 'B',
    },
    '2-50': {
      stem: 'For school buildings, the general lighting load is __ VA per square meters.',
      choices: [
        { id: 'A', text: '24' },
        { id: 'B', text: '20' },
        { id: 'C', text: '16' },
        { id: 'D', text: '8' },
      ],
      correctChoiceId: 'A',
    },
    '2-58': {
      stem: 'The material with the highest best conductivities are the',
      choices: [
        { id: 'A', text: 'gases' },
        { id: 'B', text: 'liquids' },
        { id: 'C', text: 'woods' },
        { id: 'D', text: 'metals' },
      ],
      correctChoiceId: 'D',
    },
    '2-63': {
      stem: 'Which of the following insulation color identify the grounded conductor of a branch circuit?',
      choices: [
        { id: 'A', text: 'Black' },
        { id: 'B', text: 'Green' },
        { id: 'C', text: 'Yellow' },
        { id: 'D', text: 'White' },
      ],
      correctChoiceId: 'D',
    },
    '2-75': {
      stem: 'Which language is used to create macros in MS Excel?',
      choices: [
        { id: 'A', text: 'Visual basic' },
        { id: 'B', text: 'C' },
        { id: 'C', text: 'Visual C++' },
        { id: 'D', text: 'Java' },
      ],
      correctChoiceId: 'A',
    },
    '2-84': {
      stem: 'Cavitation is the result of',
      choices: [
        { id: 'A', text: 'Static pressure in a fluid becoming less than fluid vapor pressure' },
        { id: 'B', text: 'Exposure of concrete to salt water' },
        { id: 'C', text: 'Heat treatment of a low carbon steel' },
        { id: 'D', text: 'Improper welding technique' },
      ],
      correctChoiceId: 'A',
    },
    '2-97': {
      stem: 'Atoms or lons which have the same electronic configuration?',
      choices: [
        { id: 'A', text: 'Iso-lonic' },
        { id: 'B', text: 'Isometric' },
        { id: 'C', text: 'Isotope' },
        { id: 'D', text: 'isoelectronic' },
      ],
      correctChoiceId: 'D',
    },
    '2-98': {
      stem: "Kelvin-Planck's law deals with",
      choices: [
        { id: 'A', text: 'Conservation of work' },
        { id: 'B', text: 'conservation of work into heat' },
        { id: 'C', text: 'Conservation of heat' },
        { id: 'D', text: 'conservation of heat into work' },
      ],
      correctChoiceId: 'D',
    },
    '2-100': {
      stem: "The residential value of a company's assets after all outside liabilities (shareholders excluded) have been allowed for",
      choices: [
        { id: 'A', text: 'Dividend' },
        { id: 'B', text: 'Equity' },
        { id: 'C', text: 'Return' },
        { id: 'D', text: 'Par value' },
      ],
      correctChoiceId: 'B',
    },
    '3-45': {
      stem: 'When a body is subjected to three mutually perpendicular stresses, of equal intensity, the ratio of direct stress to the corresponding volumetric strain is known as',
      choices: [
        { id: 'A', text: "Young's modulus" },
        { id: 'B', text: 'Modulus of Rigidity' },
        { id: 'C', text: 'Bulk Modulus' },
        { id: 'D', text: "Poisson's ratio" },
      ],
      correctChoiceId: 'C',
    },
    '3-79': {
      stem: 'Which of the following is not a control volume?',
      choices: [
        { id: 'A', text: 'Insulated tank' },
        { id: 'B', text: 'car radiator' },
        { id: 'C', text: 'compressor' },
        { id: 'D', text: 'turbine' },
      ],
      correctChoiceId: 'A',
    },
    '3-84': {
      stem: 'To determine the chemical formula of a compound, we need to know all of the following except the',
      choices: [
        { id: 'A', text: 'density of the compound' },
        { id: 'B', text: 'elements that compose the compound' },
        { id: 'C', text: 'atomic weights of the element in the compound' },
        { id: 'D', text: 'percentage composition of the compound' },
      ],
      correctChoiceId: 'A',
    },
    '3-85': {
      stem: 'The radius of gyration of a circular section of diameter d is',
      choices: [
        { id: 'A', text: 'd/16' },
        { id: 'B', text: 'd/4' },
        { id: 'C', text: 'd' },
        { id: 'D', text: 'd/2' },
      ],
      correctChoiceId: 'B',
    },
    '3-88': {
      stem: 'What is the first coordination number of a face centered cubic structure?',
      choices: [
        { id: 'A', text: '2' },
        { id: 'B', text: '4' },
        { id: 'C', text: '8' },
        { id: 'D', text: '12' },
      ],
      correctChoiceId: 'D',
    },
    '3-89': {
      stem: 'In the design of waterways, the "hydraulic jump" is sometimes used for',
      choices: [
        { id: 'A', text: 'energy dissipation' },
        { id: 'B', text: 'elimination of turbulence' },
        { id: 'C', text: 'prevention of sedimentation' },
        { id: 'D', text: 'measurement of flow' },
      ],
      correctChoiceId: 'A',
    },
    '4-3': {
      stem: 'A language originally designed for telescope process control',
      choices: [
        { id: 'A', text: 'COBOL' },
        { id: 'B', text: 'FORTH' },
        { id: 'C', text: 'ADA' },
        { id: 'D', text: 'RPG' },
      ],
      correctChoiceId: 'B',
    },
    '4-11': {
      stem: 'A crystal of solute is added to a solution, and the crystal remains undissolved. The solution is best classified as',
      choices: [
        { id: 'A', text: 'dilute' },
        { id: 'B', text: 'unsaturated' },
        { id: 'C', text: 'saturated' },
        { id: 'D', text: 'supersaturated' },
      ],
      correctChoiceId: 'C',
    },
    '4-20': {
      stem: 'Which of the following refrigerant in highly toxic and flammable?',
      choices: [
        { id: 'A', text: 'NH3' },
        { id: 'B', text: 'CO2' },
        { id: 'C', text: 'CO3' },
        { id: 'D', text: 'R-12' },
      ],
      correctChoiceId: 'A',
    },
    '4-38': {
      stem: 'The zone of the atmosphere in which weather occurs is known as the',
      choices: [
        { id: 'A', text: 'Ionosphere' },
        { id: 'B', text: 'mesosphere' },
        { id: 'C', text: 'troposphere' },
        { id: 'D', text: 'stratosphere' },
      ],
      correctChoiceId: 'C',
    },
    '4-50': {
      stem: 'Which is most common language used in web designing?',
      choices: [
        { id: 'A', text: 'C' },
        { id: 'B', text: 'C++' },
        { id: 'C', text: 'PHP' },
        { id: 'D', text: 'HTML' },
      ],
      correctChoiceId: 'D',
    },
    '4-51': {
      stem: 'Device used to pull wire through the conduit.',
      choices: [
        { id: 'A', text: 'Straps' },
        { id: 'B', text: 'Fish tape' },
        { id: 'C', text: 'Wire tongs' },
        { id: 'D', text: 'Puller' },
      ],
      correctChoiceId: 'B',
    },
    '4-61': {
      stem: 'Which group of keys in the keyboard will be needed to go to the bottom of a document?',
      choices: [
        { id: 'A', text: 'alt + end' },
        { id: 'B', text: 'ctrl + end' },
        { id: 'C', text: 'ctrl + home' },
        { id: 'D', text: 'alt + home' },
      ],
      correctChoiceId: 'B',
    },
    '4-77': {
      stem: 'What do you call the treating of an ore with aqueous reagent to dissolve component selectively',
      choices: [
        { id: 'A', text: 'calcinations' },
        { id: 'B', text: 'leaching' },
        { id: 'C', text: 'roasting' },
        { id: 'D', text: 'smelting' },
      ],
      correctChoiceId: 'B',
    },
    '4-81': {
      stem: 'Which of the following is NOT an intensive property?',
      choices: [
        { id: 'A', text: 'velocity' },
        { id: 'B', text: 'volume' },
        { id: 'C', text: 'pressure' },
        { id: 'D', text: 'temperature' },
      ],
      correctChoiceId: 'B',
    },
    '4-99': {
      stem: 'How is the material usage variance defined?',
      choices: [
        { id: 'A', text: '(quantity purchased x actual price) - (quantity purchased x standard price)' },
        { id: 'B', text: '(quantity issued - standard quantity) (standard price)' },
        { id: 'C', text: '(actual price - standard price) (quantity used)' },
        { id: 'D', text: '(quantity purchased - quantity used) (actual price)' },
      ],
      correctChoiceId: 'B',
    },
    '5-2': {
      stem: 'The area of the shear diagram of a beam between any two points on the beam is equal to the',
      choices: [
        { id: 'A', text: 'Change in shear between the two points' },
        { id: 'B', text: 'Average moment between the two points' },
        { id: 'C', text: 'Total shear beyond the two points' },
        { id: 'D', text: 'Change in moment between the two points' },
      ],
      correctChoiceId: 'D',
    },
    '5-3': {
      stem: 'A general form covering an assembly or assemblies of devices for the switching controlling metering of electric power.',
      choices: [
        { id: 'A', text: 'Enclosure' },
        { id: 'B', text: 'Switchgear' },
        { id: 'C', text: 'Switchboard' },
        { id: 'D', text: 'Panelboard' },
      ],
      correctChoiceId: 'B',
    },
    '5-9': {
      stem: 'For office buildings, a general lightning load of __ VA/m2 shall be used.',
      choices: [
        { id: 'A', text: '12' },
        { id: 'B', text: '16' },
        { id: 'C', text: '24' },
        { id: 'D', text: '28' },
      ],
      correctChoiceId: 'D',
    },
    '5-12': {
      stem: "What best defines 'annuity'?",
      choices: [
        { id: 'A', text: 'A series of equal payments occurring at equal periods of time' },
        { id: 'B', text: 'First payment does not begin until some later date.' },
        { id: 'C', text: 'Value of the stock as stated on the stock certificate.' },
        { id: 'D', text: 'Difference between the present value and the worth of money at some time in the future' },
      ],
      correctChoiceId: 'A',
    },
    '5-22': {
      stem: 'It is a method of analyzing coal which Includes moisture, ash, volatile matter and fixed carbon contents',
      choices: [
        { id: 'A', text: 'Proximate analysis' },
        { id: 'B', text: 'Ultimate analysis' },
        { id: 'C', text: 'Orsat analysis' },
        { id: 'D', text: 'Stoichiometry' },
      ],
      correctChoiceId: 'A',
    },
    '5-29': {
      stem: 'Identify the FALSE statement.',
      choices: [
        { id: 'A', text: 'The primary objective of PERT is to determine the probability of meeting specified deadlines.' },
        { id: 'B', text: "PERT identifies the activities that are most likely to 'bottleneck' and the activities that are most likely to stay on schedule." },
        { id: 'C', text: 'PERT evaluates the sensitivity to changes in the program.' },
        { id: 'D', text: 'To apply PERT, one should develop a network representation of the project plan.' },
      ],
      correctChoiceId: 'C',
    },
    '5-34': {
      stem: 'When installing the heatsink back into a computer after replacing a failed processor, which of the following must be done during installation?',
      choices: [
        { id: 'A', text: 'Thermal compound must be installed between the processor and the heatsink' },
        { id: 'B', text: 'Thermal compound must be installed between the processor and the system board.' },
        { id: 'C', text: 'An Isopropyl alcohol pad must be placed between the processor and the heatsink' },
        { id: 'D', text: 'An isopropyl alcohol pad must be placed between the processor and the system board' },
      ],
      correctChoiceId: 'A',
    },
    '5-40': {
      stem: 'Based on Section 18 of the R. A. 7920, the minimum age requirement for qualification of applicants for Registered Master Electricians Examination is at least __ years of age.',
      choices: [
        { id: 'A', text: 'Eighteen' },
        { id: 'B', text: 'Nineteen years of age' },
        { id: 'C', text: 'Twenty one years of age' },
        { id: 'D', text: 'Twenty years of age' },
      ],
      correctChoiceId: 'A',
    },
    '5-61': {
      stem: 'Which is also called stranger gas?',
      choices: [
        { id: 'A', text: 'Xenon' },
        { id: 'B', text: 'Neon' },
        { id: 'C', text: 'Argon' },
        { id: 'D', text: 'Nitrous oxide' },
      ],
      correctChoiceId: 'A',
    },
    '5-73': {
      stem: 'What physical property of material that refers to the point at which a material liquefies on heating or solidifies on cooling?',
      choices: [
        { id: 'A', text: 'Curie point' },
        { id: 'B', text: 'Specific heat' },
        { id: 'C', text: 'Melting point' },
        { id: 'D', text: 'Refractive Index' },
      ],
      correctChoiceId: 'D',
    },
    '5-87': {
      stem: 'The change in enthalpy occur at constant',
      choices: [
        { id: 'A', text: 'pressure' },
        { id: 'B', text: 'volume' },
        { id: 'C', text: 'temperature' },
        { id: 'D', text: 'entropy' },
      ],
      correctChoiceId: 'A',
    },
    '6-39': {
      stem: 'The deflection of beam is',
      choices: [
        { id: 'A', text: 'directly proportional to the modulus of elasticity and moment of inertia' },
        { id: 'B', text: 'Inversely proportional to the modulus of elasticity and moment of inertia' },
        { id: 'C', text: 'inversely proportional to the modulus of elasticity and moment of truth' },
        { id: 'D', text: 'inversely proportional to the weight and length' },
      ],
      correctChoiceId: 'B',
    },
    '6-58': {
      stem: 'What is the form of the moment diagram of a beam supported at both ends without external load?',
      choices: [
        { id: 'A', text: 'Triangle' },
        { id: 'B', text: 'Linear' },
        { id: 'C', text: 'Circular' },
        { id: 'D', text: 'Parabola' },
      ],
      correctChoiceId: 'B',
    },
    '6-68': {
      stem: 'The most abundant element in the universe is',
      choices: [
        { id: 'A', text: 'He' },
        { id: 'B', text: 'C' },
        { id: 'C', text: 'H' },
        { id: 'D', text: 'O' },
      ],
      correctChoiceId: 'C',
    },
    '6-85': {
      stem: 'ALU stands for',
      choices: [
        { id: 'A', text: 'Arithmetic Logic Unit' },
        { id: 'B', text: 'Arithmetic Logic Users' },
        { id: 'C', text: 'Arithmetic Logical Unit' },
        { id: 'D', text: 'Arithmetic logical User' },
      ],
      correctChoiceId: 'A',
    },
    '6-91': {
      stem: 'Which of the following would most likely required steel containing 0.6% carbon that has been spheroidized, cold drawn and slightly tempered?',
      choices: [
        { id: 'A', text: 'a bridge' },
        { id: 'B', text: 'a water pipe' },
        { id: 'C', text: 'a cutting tool' },
        { id: 'D', text: 'a ball bearing' },
      ],
      correctChoiceId: 'C',
    },
    '6-94': {
      stem: 'It can be used to indicate small pressure difference',
      choices: [
        { id: 'A', text: 'manometer' },
        { id: 'B', text: 'barometer' },
        { id: 'C', text: 'piezometer' },
        { id: 'D', text: 'dynamometer' },
      ],
      correctChoiceId: 'A',
    },
    '7-5': {
      stem: 'The three moment equation may be used to analyze',
      choices: [
        { id: 'A', text: 'beam loaded at the third point' },
        { id: 'B', text: 'a three element composite beam' },
        { id: 'C', text: 'continuous beam' },
        { id: 'D', text: 'a step tapered column' },
      ],
      correctChoiceId: 'C',
    },
    '7-17': {
      stem: 'the process of mixing clay, water and other ingredients to make brick is known as',
      choices: [
        { id: 'A', text: 'kneading' },
        { id: 'B', text: 'molding' },
        { id: 'C', text: 'pugging' },
        { id: 'D', text: 'drying' },
      ],
      correctChoiceId: 'A',
    },
    '7-21': {
      stem: 'What is the most common reinforcement for polymer composites?',
      choices: [
        { id: 'A', text: 'Boron' },
        { id: 'B', text: 'Ceramic' },
        { id: 'C', text: 'Graphite' },
        { id: 'D', text: 'Glass fiber' },
      ],
      correctChoiceId: 'D',
    },
    '7-23': {
      stem: 'What is CD ROM?',
      choices: [
        { id: 'A', text: 'Compact Disk Read Only Memory' },
        { id: 'B', text: 'Compact Date Read Only Memory' },
        { id: 'C', text: 'Compatible Disk Read Only Memory' },
        { id: 'D', text: 'Compatible Date Read Only Memory' },
      ],
      correctChoiceId: 'A',
    },
    '7-47': {
      stem: 'Most wires used in residential house wiring are usually insulated by which of the following?',
      choices: [
        { id: 'A', text: 'Asbestos' },
        { id: 'B', text: 'Cotton' },
        { id: 'C', text: 'Thermoplastic' },
        { id: 'D', text: 'Varnished cambric' },
      ],
      correctChoiceId: 'C',
    },
    '7-52': {
      stem: 'Which of the following is a volatile memory?',
      choices: [
        { id: 'A', text: 'RAM' },
        { id: 'B', text: 'ROM' },
        { id: 'C', text: 'PROM' },
        { id: 'D', text: 'EPROM' },
      ],
      correctChoiceId: 'A',
    },
    '7-59': {
      stem: 'Materials in this group are composed of one or more metallic elements such as iron, aluminum, copper, titanium, gold, and nickel. What is this group called?',
      choices: [
        { id: 'A', text: 'Metals' },
        { id: 'B', text: 'Metalloid' },
        { id: 'C', text: 'Solids' },
        { id: 'D', text: 'Crystals' },
      ],
      correctChoiceId: 'A',
    },
    '7-63': {
      stem: 'What is the MINIMUM size in mm required for stainless steel rod as grounding electrode?',
      choices: [
        { id: 'A', text: '12' },
        { id: 'B', text: '16' },
        { id: 'C', text: '12.5' },
        { id: 'D', text: '10' },
      ],
      correctChoiceId: 'B',
    },
    '7-65': {
      stem: 'A __ is a device that merges several low speed transmission into high speed transmission.',
      choices: [
        { id: 'A', text: 'server' },
        { id: 'B', text: 'voltage regulator' },
        { id: 'C', text: 'multiplexer' },
        { id: 'D', text: 'mainframe' },
      ],
      correctChoiceId: 'C',
    },
    '7-72': {
      stem: 'Which of the following engines is normally the least efficient?',
      choices: [
        { id: 'A', text: 'gasoline engine' },
        { id: 'B', text: 'diesel engine' },
        { id: 'C', text: 'gas turbine' },
        { id: 'D', text: 'Carnot engine' },
      ],
      correctChoiceId: 'A',
    },
    '7-76': {
      stem: 'What does PRBEE stands for?',
      choices: [
        { id: 'A', text: 'Philippine Regulating Board of Electrical Engineering' },
        { id: 'B', text: 'Professional Regulatory Board of electrical Engineering' },
        { id: 'C', text: 'Philippine Regulatory Board of Electrical Engineering' },
        { id: 'D', text: 'Professional Regulating Board of Electrical Engineering' },
      ],
      correctChoiceId: 'B',
    },
    '7-98': {
      stem: 'ASCII means',
      choices: [
        { id: 'A', text: 'American Standard Code for Information input' },
        { id: 'B', text: 'American Standard Code for Input Information' },
        { id: 'C', text: 'American Standard Capacity for Information Input' },
        { id: 'D', text: 'American Standard Code for Information Interchange' },
      ],
      correctChoiceId: 'D',
    },
    '8-4': {
      stem: 'Hard water is water which contains soluble salts of which of the following:',
      choices: [
        { id: 'A', text: 'calcium' },
        { id: 'B', text: 'sodium' },
        { id: 'C', text: 'sulfur' },
        { id: 'D', text: 'chlorine' },
      ],
      correctChoiceId: 'A',
    },
    '8-10': {
      stem: 'What is the measure of the average speed with which accounts receivable are collected?',
      choices: [
        { id: 'A', text: 'Current ratio' },
        { id: 'B', text: 'Quick ratio' },
        { id: 'C', text: 'Acid test ratio' },
        { id: 'D', text: 'Receivable turnover' },
      ],
      correctChoiceId: 'D',
    },
    '8-12': {
      stem: 'What is the minimum height of the track of a roller coaster such that it can go around a loop without falling off or going off the track?',
      choices: [
        { id: 'A', text: 'h = 1/2 r' },
        { id: 'B', text: 'h = 5/2 r' },
        { id: 'C', text: 'h = r' },
        { id: 'D', text: 'h = 2 r' },
      ],
      correctChoiceId: 'B',
    },
    '8-16': {
      stem: 'In computing, what is a tape drive?',
      choices: [
        { id: 'A', text: 'A data storage device' },
        { id: 'B', text: 'An OCR device' },
        { id: 'C', text: 'a pointing device' },
        { id: 'D', text: 'a multimedia device' },
      ],
      correctChoiceId: 'A',
    },
    '8-24': {
      stem: 'BCD is',
      choices: [
        { id: 'A', text: 'Binary Coded Decimal' },
        { id: 'B', text: 'Bit Coded Decimal' },
        { id: 'C', text: 'Binary Coded Digit' },
        { id: 'D', text: 'Bit Coded Digit' },
      ],
      correctChoiceId: 'A',
    },
    '8-49': {
      stem: 'What do you call a communication network covering a geographical area the size of a city or suburban?',
      choices: [
        { id: 'A', text: 'local area network (LAN)' },
        { id: 'B', text: 'metropolitan area network (MAN)' },
        { id: 'C', text: 'wide area network (WAN)' },
        { id: 'D', text: 'multi-level network' },
      ],
      correctChoiceId: 'B',
    },
    '8-56': {
      stem: 'Heat is absorbed by the refrigerant in a refrigerator when it',
      choices: [
        { id: 'A', text: 'melts' },
        { id: 'B', text: 'vaporizes' },
        { id: 'C', text: 'condenses' },
        { id: 'D', text: 'is compressed' },
      ],
      correctChoiceId: 'B',
    },
    '8-62': {
      stem: 'What is the term for a computer or software that request information from another computer to server?',
      choices: [
        { id: 'A', text: 'host' },
        { id: 'B', text: 'workstation' },
        { id: 'C', text: 'client' },
        { id: 'D', text: 'All of these' },
      ],
      correctChoiceId: 'C',
    },
    '8-82': {
      stem: 'The Central Processing Unit of computer is a combination of',
      choices: [
        { id: 'A', text: 'arithmetic logic and Input unit' },
        { id: 'B', text: 'control and storage' },
        { id: 'C', text: 'arithmetic logic and control unit' },
        { id: 'D', text: 'control and Input unit' },
      ],
      correctChoiceId: 'C',
    },
    '9-1': {
      stem: 'Who is the ERC Chairperson?',
      choices: [
        { id: 'A', text: 'Atty. Monalisa C. Dimalanta' },
        { id: 'B', text: 'Atty. Alexis Lumbatan' },
        { id: 'C', text: 'Atty. Catherine Maceda' },
        { id: 'D', text: 'Atty. Marko Fuentes' },
      ],
      correctChoiceId: 'A',
    },
    '9-9': {
      stem: 'The motor compressor shall be protected by a separate overload relay to trip at not more than __ percent of the motor compressor load current',
      choices: [
        { id: 'A', text: '115' },
        { id: 'B', text: '125' },
        { id: 'C', text: '130' },
        { id: 'D', text: '140' },
      ],
      correctChoiceId: 'B',
    },
    '9-12': {
      stem: 'Which of the following shall be provided where necessary to electrical continuity?',
      choices: [
        { id: 'A', text: 'grounding' },
        { id: 'B', text: 'bonding' },
        { id: 'C', text: 'jumpers' },
        { id: 'D', text: 'shunts' },
      ],
      correctChoiceId: 'B',
    },
    '9-22': {
      stem: 'What does the prefix tera refers to?',
      choices: [
        { id: 'A', text: '10^12' },
        { id: 'B', text: '10^5' },
        { id: 'C', text: '10^-12' },
        { id: 'D', text: '10' },
      ],
      correctChoiceId: 'A',
    },
    '9-38': {
      stem: 'The element that provides the electrical power to the components in the computer box is',
      choices: [
        { id: 'A', text: 'power button' },
        { id: 'B', text: 'power cord' },
        { id: 'C', text: 'power supply' },
        { id: 'D', text: 'ups' },
      ],
      correctChoiceId: 'C',
    },
    '9-45': {
      stem: 'In organic chemistry, which compound families are associated with the following bonds? 1. C-C 2. C=C 3. C≡C',
      choices: [
        { id: 'A', text: '1: alkane, 2: alkene, 3: alkyne' },
        { id: 'B', text: '1: alkene, 2: alkyne, 3: alkane' },
        { id: 'C', text: '1: alkyne, 2: alkane, 3: alkene' },
        { id: 'D', text: '1: alkane, 2: alkyne, 3: alkene' },
      ],
      correctChoiceId: 'A',
    },
    '9-58': {
      stem: 'DSL means,',
      choices: [
        { id: 'A', text: 'digital subscriber line' },
        { id: 'B', text: 'digital subscription link' },
        { id: 'C', text: 'digital subscription line' },
        { id: 'D', text: 'digital subscriber link' },
      ],
      correctChoiceId: 'A',
    },
    '9-65': {
      stem: '__ are compound of carbon in hydrogen containing only carbon-carbon single bonds.',
      choices: [
        { id: 'A', text: 'alkynes' },
        { id: 'B', text: 'alkenes' },
        { id: 'C', text: 'alkanes' },
        { id: 'D', text: 'alkali' },
      ],
      correctChoiceId: 'C',
    },
    '9-96': {
      stem: 'A measure of how it emits radiant energy in comparison with a black body at the same temperature',
      choices: [
        { id: 'A', text: 'absorptivity' },
        { id: 'B', text: 'reflectivity' },
        { id: 'C', text: 'emissivity' },
        { id: 'D', text: 'conductivity' },
      ],
      correctChoiceId: 'C',
    },
    '9-98': {
      stem: 'What is the measure of the quantity of an element or a compound',
      choices: [
        { id: 'A', text: 'mass' },
        { id: 'B', text: 'mole' },
        { id: 'C', text: 'volume' },
        { id: 'D', text: 'weight' },
      ],
      correctChoiceId: 'B',
    },
    '10-7': {
      stem: 'Which of the following group of elements all form crystal of diamond lattice',
      choices: [
        { id: 'A', text: 'carbon, silicon, germanium' },
        { id: 'B', text: 'carbon, boron, aluminum' },
        { id: 'C', text: 'carbon, cobalt, nickel' },
        { id: 'D', text: 'lithium, sodium, potassium' },
      ],
      correctChoiceId: 'A',
    },
    '10-12': {
      stem: 'The ratio of the lateral strain to the linear strains is',
      choices: [
        { id: 'A', text: 'modulus of elasticity' },
        { id: 'B', text: 'modulus of rigidity' },
        { id: 'C', text: 'bulk modulus' },
        { id: 'D', text: "Poisson's ratio" },
      ],
      correctChoiceId: 'D',
    },
    '10-16': {
      stem: 'Which of the following conductors is not applicable on wet locations?',
      choices: [
        { id: 'A', text: 'Type THHN' },
        { id: 'B', text: 'Type THW' },
        { id: 'C', text: 'Type RHW' },
        { id: 'D', text: 'Type THWN' },
      ],
      correctChoiceId: 'A',
    },
    '10-17': {
      stem: 'Which characteristics of a wave changes as the wave travels across a boundary between two different media?',
      choices: [
        { id: 'A', text: 'Frequency' },
        { id: 'B', text: 'period' },
        { id: 'C', text: 'phase' },
        { id: 'D', text: 'speed' },
      ],
      correctChoiceId: 'D',
    },
    '10-25': {
      stem: 'Common cause of failure of termination cable.',
      choices: [
        { id: 'A', text: 'splicing' },
        { id: 'B', text: 'clearance' },
        { id: 'C', text: 'pencilling of insulation' },
        { id: 'D', text: 'none of these' },
      ],
      correctChoiceId: 'C',
    },
    '10-26': {
      stem: 'A process where a physical mixture of carbide and powdered metal is heated in order to solidify the powder into a single piece.',
      choices: [
        { id: 'A', text: 'Vitrification' },
        { id: 'B', text: 'bonding' },
        { id: 'C', text: 'alloying' },
        { id: 'D', text: 'sintering' },
      ],
      correctChoiceId: 'D',
    },
    '10-28': {
      stem: 'What is the form of the moment diagram of a beam supported at both ends and carrying a uniform distributed load?',
      choices: [
        { id: 'A', text: 'triangle' },
        { id: 'B', text: 'hyperbola' },
        { id: 'C', text: 'parabola' },
        { id: 'D', text: 'rectangle' },
      ],
      correctChoiceId: 'C',
    },
    '10-33': {
      stem: 'Adiabatic process is?',
      choices: [
        { id: 'A', text: 'no heat transfer' },
        { id: 'B', text: 'reversible' },
        { id: 'C', text: 'irreversible' },
        { id: 'D', text: 'constant pressure' },
      ],
      correctChoiceId: 'A',
    },
    '10-39': {
      stem: 'Which of the following is NOT a vector quantity?',
      choices: [
        { id: 'A', text: 'displacement' },
        { id: 'B', text: 'acceleration' },
        { id: 'C', text: 'speed' },
        { id: 'D', text: 'momentum' },
      ],
      correctChoiceId: 'C',
    },
    '10-45': {
      stem: 'An open system first law should be utilized for all of the following except,',
      choices: [
        { id: 'A', text: 'a nozzle' },
        { id: 'B', text: 'a piston cylinder device' },
        { id: 'C', text: 'a turbine' },
        { id: 'D', text: 'a compressor' },
      ],
      correctChoiceId: 'B',
    },
    '10-60': {
      stem: "Charles's law relates to",
      choices: [
        { id: 'A', text: 'constant volume' },
        { id: 'B', text: 'constant temperature' },
        { id: 'C', text: 'constant pressure' },
        { id: 'D', text: 'constant entropy' },
      ],
      correctChoiceId: 'C',
    },
    '10-69': {
      stem: 'In any collision, which of the following is conserved?',
      choices: [
        { id: 'A', text: 'Kinetic energy' },
        { id: 'B', text: 'velocity' },
        { id: 'C', text: 'momentum' },
        { id: 'D', text: 'potential energy' },
      ],
      correctChoiceId: 'C',
    },
    '10-72': {
      stem: "Is an act of sending e-mails or creating web pages that are designed to collect an individual's online bank, credit card or other login information?",
      choices: [
        { id: 'A', text: 'Malware' },
        { id: 'B', text: 'Hacking' },
        { id: 'C', text: 'Cracking' },
        { id: 'D', text: 'Phishing' },
      ],
      correctChoiceId: 'D',
    },
    '10-97': {
      stem: 'The equation which states that the total energy in the steady flow of a frictionless and incompressible fluid is constant',
      choices: [
        { id: 'A', text: 'continuity equation' },
        { id: 'B', text: 'Reynolds equation' },
        { id: 'C', text: "Bernoulli's equation" },
        { id: 'D', text: 'general energy equation' },
      ],
      correctChoiceId: 'C',
    },
    '10-100': {
      stem: 'The usual function of a disconnect switches in high voltage circuits is to',
      choices: [
        { id: 'A', text: 'open the circuit in the event of an overload' },
        { id: 'B', text: 'maintain continuity of service' },
        { id: 'C', text: 'Isolate from energized buses, equipment which are not in service' },
        { id: 'D', text: 'open or close the circuit under load' },
      ],
      correctChoiceId: 'C',
    },
  };

  // Text un-breaking & cleaning function
  function postClean(str) {
    if (!str) return str;
    let s = str;

    // Connect spaced hyphens
    s = s.replace(/([a-zA-Z0-9]+)\s+-\s+([a-zA-Z0-9]+)/g, '$1-$2');

    // Fix spaced 2-letter English words
    s = s.replace(/\b([iI])\s+s\b/g, (m, g1) => g1 + 's');
    s = s.replace(/\b([iI])\s+n\b/g, (m, g1) => g1 + 'n');
    s = s.replace(/\b([iI])\s+t\b/g, (m, g1) => g1 + 't');
    s = s.replace(/\b([iI])\s+f\b/g, (m, g1) => g1 + 'f');
    s = s.replace(/\b([aA])\s+n\b/g, (m, g1) => g1 + 'n');
    s = s.replace(/\b([oO])\s+n\b/g, (m, g1) => g1 + 'n');
    s = s.replace(/\b([oO])\s+r\b/g, (m, g1) => g1 + 'r');
    s = s.replace(/\b([tT])\s+o\b/g, (m, g1) => g1 + 'o');
    s = s.replace(/\b([bB])\s+e\b/g, (m, g1) => g1 + 'e');
    s = s.replace(/\b([aA])\s+t\b/g, (m, g1) => g1 + 't');
    s = s.replace(/\b([bB])\s+y\b/g, (m, g1) => g1 + 'y');
    s = s.replace(/\b([aA])\s+s\b/g, (m, g1) => g1 + 's');
    s = s.replace(/\b([dD])\s+o\b/g, (m, g1) => g1 + 'o');
    s = s.replace(/\b([sS])\s+o\b/g, (m, g1) => g1 + 'o');
    s = s.replace(/\b([uU])\s+p\b/g, (m, g1) => g1 + 'p');
    s = s.replace(/\b([nN])\s+o\b/g, (m, g1) => g1 + 'o');

    // Known OCR typos & broken words
    const directWords = [
      [/\bequ\s*i\s*valent\b/gi, 'equivalent'],
      [/\bpro\s*cess\s*ing\b/gi, 'processing'],
      [/\bP\s+rocessing\b/g, 'Processing'],
      [/\bC\s+ircui\s*t\b/g, 'Circuit'],
      [/\bE\s+lectrical\b/g, 'Electrical'],
      [/\bE\s+lectrodes\b/g, 'Electrodes'],
      [/\bE\s+lectrolyte\b/g, 'Electrolyte'],
      [/\brati\s+o\b/gi, 'ratio'],
      [/\bmem\s+o\s+ry\b/gi, 'memory'],
      [/\bqui\s*k\s*l\s*y\b/gi, 'quickly'],
      [/\bi\s*n\s*i\s*tial\b/gi, 'initial'],
      [/\bi\s*n\s*i\s*tially\b/gi, 'initially'],
      [/\bMi\s*x\s*ture\b/gi, 'Mixture'],
      [/\ban\s+y\b/gi, 'any'],
      [/\bcharacter\s*i\s*zes\b/gi, 'characterizes'],
      [/\bmater\s*i\s*al\b/gi, 'material'],
      [/\bmater\s*i\s*als\b/gi, 'materials'],
      [/\bab\s*i\s*lity\b/gi, 'ability'],
      [/\bRig\s*i\s*dity\b/gi, 'Rigidity'],
      [/\boccup\s*i\s*ed\b/gi, 'occupied'],
      [/\bWhi\s*h\b/g, 'Which'],
      [/\bflu\s*i\s*d\b/gi, 'fluid'],
      [/\bvelo\s*ci\s*ties\b/gi, 'velocities'],
      [/\bvelo\s*ci\s*ty\b/gi, 'velocity'],
      [/\bde\s*ci\s*sion\b/gi, 'decision'],
      [/\bo\s*xi\s*dized\b/gi, 'oxidized'],
      [/\bhydrox\s*i\s*de\b/gi, 'hydroxide'],
      [/\bhydr\s*o\s*xyl\b/gi, 'hydroxyl'],
      [/\bi\s*onize\b/gi, 'ionize'],
      [/\bneutralizati\s*on\b/gi, 'neutralization'],
      [/\bd\s*i\s*atomic\b/gi, 'diatomic'],
      [/\bo\s*xygen\b/gi, 'oxygen'],
      [/\bcy\s*cl\s*e\b/gi, 'cycle'],
      [/\bs\s*upported\b/gi, 'supported'],
      [/\bcondu\s*i\s*t\b/gi, 'conduit'],
      [/\bcondu\s*i\s*ts\b/gi, 'conduits'],
      [/\bcu\s*r\s*rent\b/gi, 'current'],
      [/\baud\s*i\s*o\b/gi, 'audio'],
      [/\bvo\s*i\s*ds\b/gi, 'voids'],
      [/\bs\s*am\s*e\b/gi, 'same'],
      [/\bth\s*e\b/gi, 'the'],
      [/\bth\s*at\b/gi, 'that'],
      [/\bth\s*is\b/gi, 'this'],
      [/\bwh\s*at\b/gi, 'what'],
      [/\bwh\s*en\b/gi, 'when'],
      [/\bwh\s*ere\b/gi, 'where'],
      [/\bwh\s*ich\b/gi, 'which'],
      [/\bwh\s*o\b/gi, 'who'],
      [/\bwi\s*th\b/gi, 'with'],
      [/\bfr\s*om\b/gi, 'from'],
      [/\bha\s*ve\b/gi, 'have'],
      [/\bmo\s*re\b/gi, 'more'],
      [/\bso\s*me\b/gi, 'some'],
      [/\bti\s*me\b/gi, 'time'],
      [/\bna\s*me\b/gi, 'name'],
      [/\bli\s*ne\b/gi, 'line'],
      [/\bra\s*te\b/gi, 'rate'],
      [/\bma\s*de\b/gi, 'made'],
      [/\bsi\s*ze\b/gi, 'size'],
      [/\bty\s*pe\b/gi, 'type'],
      [/\bba\s*se\b/gi, 'base'],
      [/\bca\s*se\b/gi, 'case'],
      [/\bco\s*de\b/gi, 'code'],
      [/\bno\s*de\b/gi, 'node'],
      [/\bmo\s*de\b/gi, 'mode'],
      [/\bzo\s*ne\b/gi, 'zone'],
      [/\bro\s*le\b/gi, 'role'],
      [/\bpo\s*le\b/gi, 'pole'],
      [/\bho\s*le\b/gi, 'hole'],
      [/\bwo\s*rk\b/gi, 'work'],
      [/\bfo\s*rm\b/gi, 'form'],
      [/\bte\s*rm\b/gi, 'term'],
      [/\bpa\s*rt\b/gi, 'part'],
      [/\bun\s*it\b/gi, 'unit'],
      [/\bci\s*ty\b/gi, 'city'],
      [/\bdu\s*ty\b/gi, 'duty'],
      [/\bfrequen\s*tl\s*y\b/gi, 'frequently'],
      [/\bdissi\s*p\s*tion\b/gi, 'dissipation'],
      [/\bperz\s*incification\b/gi, 'dezincification'],
      [/\bcurren\s*t\b/gi, 'current'],
      [/\bconstan\s*t\b/gi, 'constant'],
      [/\belemen\s*t\b/gi, 'element'],
      [/\bexperimen\s*t\b/gi, 'experiment'],
      [/\btreatmen\s*t\b/gi, 'treatment'],
      [/\bdepartmen\s*t\b/gi, 'department'],
      [/\bstatemen\s*t\b/gi, 'statement'],
      [/\bcomponen\s*t\b/gi, 'component'],
      [/\brequiremen\s*t\b/gi, 'requirement'],
      [/\bdocumen\s*t\b/gi, 'document'],
      [/\bsegmen\s*t\b/gi, 'segment'],
      [/\bpaymen\s*t\b/gi, 'payment'],
      [/\bjudgmen\s*t\b/gi, 'judgment'],
      [/\bmeasurmen\s*t\b/gi, 'measurement'],
      [/\bdevelopmen\s*t\b/gi, 'development'],
      [/\benvironmen\s*t\b/gi, 'environment'],
      [/\bcircui\s*t\b/gi, 'circuit'],
      [/\bcondui\s*t\b/gi, 'conduit'],
      [/\bproduc\s*t\b/gi, 'product'],
      [/\beffec\s*t\b/gi, 'effect'],
      [/\bprojec\s*t\b/gi, 'project'],
      [/\bselec\s*t\b/gi, 'select'],
      [/\bdirec\s*t\b/gi, 'direct'],
      [/\bwhi\s*ch\b/gi, 'which'],
      [/\bvol\s*tage\b/gi, 'voltage'],
      [/\bresis\s*tance\b/gi, 'resistance'],
      [/\bcapaci\s*tance\b/gi, 'capacitance'],
      [/\binduc\s*tance\b/gi, 'inductance'],
      [/\btrans\s*former\b/gi, 'transformer'],
      [/\bconduc\s*tor\b/gi, 'conductor'],
      [/\binsula\s*tor\b/gi, 'insulator'],
      [/\bcircula\s*r\b/gi, 'circular'],
      [/\bparabo\s*la\b/gi, 'parabola'],
      [/\bdosed\s+system\b/gi, 'closed system'],
      [/\bdosed\s+room\b/gi, 'closed room'],
      [/\bdosed\s+pack\b/gi, 'closed pack'],
      [/\bdose\s+the\s+circuit\b/gi, 'close the circuit'],
      [/\bCamot\b/g, 'Carnot'],
      [/\bcorapter\b/gi, 'computer'],
      [/\bdick\s+on\s+Print\b/gi, 'click on Print'],
      [/\bformic\s+add\b/gi, 'formic acid'],
      [/\bfist\s+low\s+of\s+motion\b/gi, 'first law of motion'],
      [/\bCurie\s+pint\b/gi, 'Curie point'],
      [/\bhent\s+energy\b/gi, 'heat energy'],
      [/\ba\s+low\s+which\s+states\b/gi, 'a law which states'],
      [/\bOrly\s+Memory\b/gi, 'Only Memory'],
    ];

    for (const [p, r] of directWords) {
      s = s.replace(p, r);
    }

    // Clean multiple spaces and stray spaces before punctuation
    s = s.replace(/\s{2,}/g, ' ').replace(/\s+([,\.!\?:;\)])/g, '$1').trim();
    return s;
  }

  const finalQuestions = [];

  for (let s = 1; s <= 10; s++) {
    const pageNums = [(s - 1) * 3 + 1, (s - 1) * 3 + 2, (s - 1) * 3 + 3];
    const setLines = [];
    for (const p of pageNums) {
      const page = await doc.getPage(p);
      const tc = await page.getTextContent();
      setLines.push(...extractColLines(tc.items.filter(it => it.transform[4] < 290 && it.str.length > 0)));
      setLines.push(...extractColLines(tc.items.filter(it => it.transform[4] >= 290 && it.str.length > 0)));
    }

    const cleanedLines = setLines.filter(l => 
      !l.startsWith('ESAS 1000 TERMS EXAM') &&
      !/^SET\s+\d+$/i.test(l) &&
      !l.includes('CoachG, for Engr2025 ONLY')
    );

    const qBlocks = [];
    let curBlock = null;

    for (let i = 0; i < cleanedLines.length; i++) {
      let line = cleanedLines[i];
      if (s === 7 && line.startsWith('S.')) line = '5.' + line.slice(2);
      if (s === 3 && line.startsWith('8a.')) line = '88.' + line.slice(3);
      if (s === 3 && line.startsWith('69.') && cleanedLines.some(x => x.includes('hydraulic jump') && x === line)) line = '89.' + line.slice(3);
      if (s === 10 && line.startsWith('72 is an act')) line = '72. is an act' + line.slice(12);

      const qNumMatch = line.match(/^(\d{1,3})\s*\.\s*(.*)$/);
      if (qNumMatch && parseInt(qNumMatch[1], 10) >= 1 && parseInt(qNumMatch[1], 10) <= 100) {
        if (curBlock) qBlocks.push(curBlock);
        curBlock = { qNum: parseInt(qNumMatch[1], 10), rawLines: [qNumMatch[2]] };
      } else if (curBlock) {
        curBlock.rawLines.push(line);
      }
    }
    if (curBlock) qBlocks.push(curBlock);

    const blockMap = new Map();
    for (const b of qBlocks) {
      if (!blockMap.has(b.qNum)) {
        blockMap.set(b.qNum, b);
      }
    }

    for (let q = 1; q <= 100; q++) {
      const key = `${s}-${q}`;
      const id = `coachg-s${s}-q${q}`;
      const globalQNum = (s - 1) * 100 + q;
      const verifiedAnswer = answerKeyMap.get(id) || 'A';

      const patch = manualPatches[key];
      if (patch) {
        finalQuestions.push({
          id,
          subject: 'COACH G 1000 TERMS',
          sourceFileName: 'ESAS 1000 TERMS EXAM.pdf',
          questionNumber: globalQNum,
          question: postClean(patch.stem),
          choices: patch.choices.map(c => ({ id: c.id, text: postClean(c.text) })),
          correctChoiceId: patch.correctChoiceId,
        });
        continue;
      }

      const block = blockMap.get(q);
      if (!block) {
        throw new Error(`Missing block in Set ${s} Q ${q}`);
      }

      const parsed = parseChoices(block.rawLines);
      if (!parsed || !parsed.choices.A || !parsed.choices.B || !parsed.choices.C || !parsed.choices.D) {
        throw new Error(`Failed to parse choices for ${key}: ${block.rawLines.join(' ')}`);
      }

      finalQuestions.push({
        id,
        subject: 'COACH G 1000 TERMS',
        sourceFileName: 'ESAS 1000 TERMS EXAM.pdf',
        questionNumber: globalQNum,
        question: postClean(parsed.stem),
        choices: [
          { id: 'A', text: postClean(parsed.choices.A) },
          { id: 'B', text: postClean(parsed.choices.B) },
          { id: 'C', text: postClean(parsed.choices.C) },
          { id: 'D', text: postClean(parsed.choices.D) },
        ],
        correctChoiceId: verifiedAnswer,
      });
    }
  }

  console.log(`Successfully assembled all ${finalQuestions.length} questions from clean PDF text.`);

  // Validation
  for (let i = 0; i < finalQuestions.length; i++) {
    const q = finalQuestions[i];
    if (q.questionNumber !== i + 1) throw new Error(`Wrong questionNumber at ${i}`);
    if (q.choices.length !== 4) throw new Error(`Wrong choices length at ${i}`);
    if (!['A', 'B', 'C', 'D'].includes(q.correctChoiceId)) throw new Error(`Wrong correctChoiceId at ${i}`);
    for (const c of q.choices) {
      if (!c.text.trim()) throw new Error(`Empty choice ${c.id} at ${q.id}`);
    }
  }

  const fileHeader = `import { FlashcardQuestion } from '../services/questionParser';\n\nexport const COACH_G_1000_QUESTIONS: FlashcardQuestion[] = `;
  const tsContent = fileHeader + JSON.stringify(finalQuestions, null, 2) + ';\n';
  fs.writeFileSync('src/data/coachG1000Questions.ts', tsContent);
  console.log(`Successfully written src/data/coachG1000Questions.ts (${(tsContent.length / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
