import { FlashcardQuestion, shuffleQuestionChoices } from '../services/questionParser';

const RAW_CHEMISTRY_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'chem-1',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 1,
    question: 'The first period contains how many elements?',
    choices: [{ id: 'A', text: '2' }, { id: 'B', text: '4' }, { id: 'C', text: '6' }, { id: 'D', text: '8' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-2',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 2,
    question: 'The particle inside the nucleus is called',
    choices: [{ id: 'A', text: 'nucleons' }, { id: 'B', text: 'Nucleic' }, { id: 'C', text: 'nuclons' }, { id: 'D', text: 'nuclei' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-3',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 3,
    question: 'In a mixed gas such as air, the rms speed of different molecules are _____.',
    choices: [
      { id: 'A', text: 'Inversely proportional to square root of molecular mass' },
      { id: 'B', text: 'Proportional to molecular mass' },
      { id: 'C', text: 'Independent of molecular mass' },
      { id: 'D', text: 'Proportional to square root of molecular mass' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-4',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 4,
    question: 'Which of the following reason/s why reactions generally proceed faster at higher temperature? I. The molecules collide more frequently. II. The activation energy is less.',
    choices: [{ id: 'A', text: 'Both I and II' }, { id: 'B', text: 'I only' }, { id: 'C', text: 'Either I or II' }, { id: 'D', text: 'II only' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-5',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 5,
    question: 'Give the formula for magnesium carbonate',
    choices: [{ id: 'A', text: 'MgCO3' }, { id: 'B', text: 'MgO3' }, { id: 'C', text: 'Mg(CO3)2' }, { id: 'D', text: 'Mg2CO3' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-6',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 6,
    question: 'What are the van der Waals forces?',
    choices: [
      { id: 'A', text: 'Weak secondary bonds between atoms or molecules' },
      { id: 'B', text: 'Primary bonds between atoms' },
      { id: 'C', text: 'Forces not present in liquids' },
      { id: 'D', text: 'Forces between electrons and protons' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-7',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 7,
    question: 'What is the heaviest subatomic particle?',
    choices: [{ id: 'A', text: 'Neutron' }, { id: 'B', text: 'Electron' }, { id: 'C', text: 'Proton' }, { id: 'D', text: 'Atom' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-8',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 8,
    question: 'What is the gas present in the atmosphere which filters out of the sun’s ultraviolet light and provides an effective shield against radiation damage to living things?',
    choices: [{ id: 'A', text: 'Ozone' }, { id: 'B', text: 'Helium' }, { id: 'C', text: 'Methane' }, { id: 'D', text: 'Oxygen' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-9',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 9,
    question: 'Which of the following is an alkaline earth metal?',
    choices: [{ id: 'A', text: 'Ba' }, { id: 'B', text: 'Ti' }, { id: 'C', text: 'Li' }, { id: 'D', text: 'Na' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-10',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 10,
    question: 'The ozone layer exists primarily in what section of the atmosphere?',
    choices: [{ id: 'A', text: 'Stratosphere' }, { id: 'B', text: 'Troposphere' }, { id: 'C', text: 'Mesosphere' }, { id: 'D', text: 'Ionosphere' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-11',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 11,
    question: 'The Pauli exclusion Principle state that',
    choices: [
      { id: 'A', text: 'No two atoms can occupy the same orbital unless their spins are different' },
      { id: 'B', text: 'Any atoms with free s orbital can form bonds' },
      { id: 'C', text: 'Two atoms can occupy the same orbital unless their spins are different' },
      { id: 'D', text: 'Atoms of the same configuration do not change' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-12',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 12,
    question: 'What is the only gas in Group VIA in the periodic table?',
    choices: [{ id: 'A', text: 'Oxygen' }, { id: 'B', text: 'Argon' }, { id: 'C', text: 'Krypton' }, { id: 'D', text: 'Helium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-13',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 13,
    question: 'What acid is added to carbonated drinks to produce a tart taste?',
    choices: [{ id: 'A', text: 'Phosphoric acid' }, { id: 'B', text: 'Citric acid' }, { id: 'C', text: 'Sulfuric acid' }, { id: 'D', text: 'Nitric acid' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-14',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 14,
    question: 'What is the strong bond between hydrogen atoms known as?',
    choices: [{ id: 'A', text: 'the covalent bond' }, { id: 'B', text: 'The ionic bond' }, { id: 'C', text: 'The metallic bond' }, { id: 'D', text: 'ionic and metallic bonds' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-15',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 15,
    question: 'When gases expand and mix with other gases to fill available space, it is called',
    choices: [{ id: 'A', text: 'diffusion' }, { id: 'B', text: 'Vaporization' }, { id: 'C', text: 'evaporation' }, { id: 'D', text: 'solidification' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-16',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 16,
    question: 'A substance that, when added to a solution, makes changing the pH of the solution more difficult.',
    choices: [{ id: 'A', text: 'buffer' }, { id: 'B', text: 'catalyst' }, { id: 'C', text: 'Solute' }, { id: 'D', text: 'Solvent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-17',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 17,
    question: 'The chemical shorthand name for molybdenum is',
    choices: [{ id: 'A', text: 'Mo' }, { id: 'B', text: 'Mb' }, { id: 'C', text: 'Md' }, { id: 'D', text: 'Mn' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-18',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 18,
    question: 'The group VIII elements, called the noble or rare gases, have the following property.',
    choices: [{ id: 'A', text: 'They do not react with other elements' }, { id: 'B', text: 'They are rare' }, { id: 'C', text: 'they are lighter than air' }, { id: 'D', text: 'all of these' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-19',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 19,
    question: 'Which group of the periodic table is known as the alkali metals?',
    choices: [{ id: 'A', text: 'Group 1' }, { id: 'B', text: 'Group 2' }, { id: 'C', text: 'Group 3' }, { id: 'D', text: 'Group 4' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-20',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 20,
    question: 'The chemical name for baking soda is',
    choices: [{ id: 'A', text: 'Sodium bicarbonate' }, { id: 'B', text: 'Sodium sulphate' }, { id: 'C', text: 'Sodium chloride' }, { id: 'D', text: 'Sodium carbonate' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-21',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 21,
    question: 'Which doesn’t have electric charge?',
    choices: [{ id: 'A', text: 'neutron' }, { id: 'B', text: 'Proton' }, { id: 'C', text: 'electron' }, { id: 'D', text: 'molecule' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-22',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 22,
    question: 'Carbon dioxide “snow” from a fire extinguisher puts out a fire because it',
    choices: [
      { id: 'A', text: 'Displaces the supply of oxygen' },
      { id: 'B', text: 'Lowers the kindling temperature of the material' },
      { id: 'C', text: 'Raises the kindling temperature of the material' },
      { id: 'D', text: 'Cools the material below its kindling temperature' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-23',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 23,
    question: 'Formula for calcium chloride.',
    choices: [{ id: 'A', text: 'CaCl2' }, { id: 'B', text: 'Ca2Cl' }, { id: 'C', text: 'CaCl' }, { id: 'D', text: 'CaCl3' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-24',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 24,
    question: 'What is the chemical formula of Sulfuric acid?',
    choices: [{ id: 'A', text: 'H2SO4' }, { id: 'B', text: 'HSO4' }, { id: 'C', text: 'H3SO2' }, { id: 'D', text: 'HSO2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-25',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 25,
    question: 'What is the physical appearance of sodium chloride?',
    choices: [{ id: 'A', text: 'White crystal' }, { id: 'B', text: 'Silver metal' }, { id: 'C', text: 'Yellowish Gas' }, { id: 'D', text: 'White metal' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-26',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 26,
    question: 'The second period contains how many elements?',
    choices: [{ id: 'A', text: '8' }, { id: 'B', text: '2' }, { id: 'C', text: '4' }, { id: 'D', text: '6' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-27',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 27,
    question: 'Which of the following elements are stored in oil to prevent explosions?',
    choices: [{ id: 'A', text: 'Lithium' }, { id: 'B', text: 'actinium' }, { id: 'C', text: 'ytterbium' }, { id: 'D', text: 'Strontium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-28',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 28,
    question: 'Which element melts in your hand like chocolate bar?',
    choices: [{ id: 'A', text: 'cesium' }, { id: 'B', text: 'Krypton' }, { id: 'C', text: 'tantalum' }, { id: 'D', text: 'strontium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-29',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 29,
    question: 'In molecules of the same composition, what are the variations of atomic arrangements known as?',
    choices: [{ id: 'A', text: 'isomers' }, { id: 'B', text: 'Polymers' }, { id: 'C', text: 'monomers' }, { id: 'D', text: 'crystal systems' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-30',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 30,
    question: 'Vinegar is solution of H2O and what acid?',
    choices: [{ id: 'A', text: 'acetic acid' }, { id: 'B', text: 'Sulfuric acid' }, { id: 'C', text: 'phosphoric acid' }, { id: 'D', text: 'nitric acid' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-31',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 31,
    question: 'The mole is a basic unit of measurement in chemistry. Which of the following is not equal to or the same as one mole of the substance indicated?',
    choices: [
      { id: 'A', text: '16 g of oxygen molecules' },
      { id: 'B', text: '22.4 liters of nitrogen gas at STP' },
      { id: 'C', text: '6.02x10^23 oxygen molecules' },
      { id: 'D', text: '1 g of hydrogen atoms' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-32',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 32,
    question: 'Which of the following refrigerant is highly toxic and flammable?',
    choices: [{ id: 'A', text: 'NH3' }, { id: 'B', text: 'O2' }, { id: 'C', text: 'O3' }, { id: 'D', text: 'R-12' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-33',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 33,
    question: 'Which of the following is added to the drinking water distribution system for disinfection?',
    choices: [{ id: 'A', text: 'Chlorine' }, { id: 'B', text: 'Soda ash' }, { id: 'C', text: 'Lime' }, { id: 'D', text: 'Iodine' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-34',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 34,
    question: 'What refers to chemically combined elements with definite proportions of the component elements?',
    choices: [{ id: 'A', text: 'Compound' }, { id: 'B', text: 'Mixture' }, { id: 'C', text: 'Molecule' }, { id: 'D', text: 'Alloy' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-35',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 35,
    question: 'What are considered as the “building blocks” for engineering materials?',
    choices: [{ id: 'A', text: 'Atoms' }, { id: 'B', text: 'Elements' }, { id: 'C', text: 'Matters' }, { id: 'D', text: 'Compounds' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-36',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 36,
    question: 'Galvanized steel is steel product coated with ________',
    choices: [{ id: 'A', text: 'Zinc' }, { id: 'B', text: 'Carbon' }, { id: 'C', text: 'Sulfur' }, { id: 'D', text: 'Nickel' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-37',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 37,
    question: 'Which of these elements has the highest atomic number?',
    choices: [{ id: 'A', text: 'Plutonium' }, { id: 'B', text: 'Titanium' }, { id: 'C', text: 'Uranium' }, { id: 'D', text: 'Radium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-38',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 38,
    question: 'The color of zinc is:',
    choices: [{ id: 'A', text: 'bluish white' }, { id: 'B', text: 'greyish white' }, { id: 'C', text: 'greenish white' }, { id: 'D', text: 'yellowish white' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-39',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 39,
    question: 'Which of the following refers to the diffusion of a solvent into a stronger solution in attempt to equalize the two concentration?',
    choices: [{ id: 'A', text: 'osmosis' }, { id: 'B', text: 'purification' }, { id: 'C', text: 'electrolysis' }, { id: 'D', text: 'hydrolysis' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-40',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 40,
    question: 'In electrochemistry, oxidation is loss of',
    choices: [{ id: 'A', text: 'electron' }, { id: 'B', text: 'proton' }, { id: 'C', text: 'ion' }, { id: 'D', text: 'liabilities' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-41',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 41,
    question: 'It is defined as a measure of the amount of negative ions in the water',
    choices: [{ id: 'A', text: 'Alkalinity' }, { id: 'B', text: 'Turbidity' }, { id: 'C', text: 'Acidity' }, { id: 'D', text: 'Solubility' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-42',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 42,
    question: 'What is the term used to describe hydrocarbons containing single covalent bonds between carbon atoms.',
    choices: [{ id: 'A', text: 'alkanes' }, { id: 'B', text: 'alkenes' }, { id: 'C', text: 'alkynes' }, { id: 'D', text: 'allotrope' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-43',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 43,
    question: 'What do you call the treating of an ore with aqueous reagent to dissolve component selectively',
    choices: [{ id: 'A', text: 'leaching' }, { id: 'B', text: 'calcinations' }, { id: 'C', text: 'roasting' }, { id: 'D', text: 'smelting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-44',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 44,
    question: 'Which one of the following elements has the largest atomic radius?',
    choices: [{ id: 'A', text: 'sodium' }, { id: 'B', text: 'lithium' }, { id: 'C', text: 'beryllium' }, { id: 'D', text: 'magnesium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-45',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 45,
    question: 'Which of the following is a member of the Halogen family?',
    choices: [{ id: 'A', text: 'fluorine' }, { id: 'B', text: 'sodium' }, { id: 'C', text: 'phosphorus' }, { id: 'D', text: 'hydrogen' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-46',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 46,
    question: 'Relation between volume and temperature at constant pressure',
    choices: [{ id: 'A', text: 'Charles’s law' }, { id: 'B', text: 'Boyle’s law' }, { id: 'C', text: 'Henry’s law' }, { id: 'D', text: 'Gay Lussac’s law' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-47',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 47,
    question: 'Silicate mineral having the characteristic properties of fibrous structure and fire resistance',
    choices: [{ id: 'A', text: 'asbestos' }, { id: 'B', text: 'graphite' }, { id: 'C', text: 'silicon' }, { id: 'D', text: 'ceramic' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-48',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 48,
    question: 'During chemical reactions, bonds between atoms are broken and new bonds are usually formed. What do you call the starting substance?',
    choices: [{ id: 'A', text: 'reactants' }, { id: 'B', text: 'catalyst' }, { id: 'C', text: 'product' }, { id: 'D', text: 'ingredients' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-49',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 49,
    question: 'Compared to gases and liquids, solids are less',
    choices: [{ id: 'A', text: 'reactive' }, { id: 'B', text: 'weight' }, { id: 'C', text: 'heat' }, { id: 'D', text: 'color' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-50',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 50,
    question: 'What is the substance that cannot be decomposed into simpler substance during ordinary chemical reaction',
    choices: [{ id: 'A', text: 'element' }, { id: 'B', text: 'atom' }, { id: 'C', text: 'molecule' }, { id: 'D', text: 'compound' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-51',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 51,
    question: 'All isotopes of the same element have',
    choices: [
      { id: 'A', text: 'equal no. of protons' },
      { id: 'B', text: 'equal no. of protons and neutrons' },
      { id: 'C', text: 'equal no. of neutrons' },
      { id: 'D', text: 'the same atomic mass' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-52',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 52,
    question: 'The mass of a neutron is approximately how many times greater than the mass of an electron',
    choices: [{ id: 'A', text: '1839' }, { id: 'B', text: '1855' }, { id: 'C', text: '1811' }, { id: 'D', text: '1890' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-53',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 53,
    question: 'In the periodic table of elements which one of the following elements doesn\'t belong to group IIA',
    choices: [{ id: 'A', text: 'sodium' }, { id: 'B', text: 'calcium' }, { id: 'C', text: 'radium' }, { id: 'D', text: 'magnesium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-54',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 54,
    question: 'What do you call the horizontal arrangement of elements of increasing atomic number in the periodic table',
    choices: [{ id: 'A', text: 'period' }, { id: 'B', text: 'ions' }, { id: 'C', text: 'valence' }, { id: 'D', text: 'not in the choices' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-55',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 55,
    question: 'Which group does the element (hydrogen) belong',
    choices: [{ id: 'A', text: 'non metal' }, { id: 'B', text: 'light metal' }, { id: 'C', text: 'transition metal' }, { id: 'D', text: 'noble gases' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-56',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 56,
    question: 'Which of the following metallic element had a meaning "heavy stone"?',
    choices: [{ id: 'A', text: 'tungsten' }, { id: 'B', text: 'cobalt' }, { id: 'C', text: 'iron' }, { id: 'D', text: 'titanium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-57',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 57,
    question: 'Which are electrostatic forces that exist between ions',
    choices: [{ id: 'A', text: 'ionic bond' }, { id: 'B', text: 'chemical bond' }, { id: 'C', text: 'atomic bond' }, { id: 'D', text: 'covalent bond' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-58',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 58,
    question: 'What type of bond result in the form of sharing electrons between two atoms',
    choices: [{ id: 'A', text: 'covalent bond' }, { id: 'B', text: 'ionic bond' }, { id: 'C', text: 'metallic bond' }, { id: 'D', text: 'atomic bond' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-59',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 59,
    question: 'The sodium ion in sodium chloride, NaCl, have what charge',
    choices: [{ id: 'A', text: '+1' }, { id: 'B', text: '+2' }, { id: 'C', text: '-1' }, { id: 'D', text: '-2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-60',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 60,
    question: 'Give the formula of aluminum nitride',
    choices: [{ id: 'A', text: 'AlN' }, { id: 'B', text: 'Al2N2' }, { id: 'C', text: 'AlN2' }, { id: 'D', text: 'Al2N' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-61',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 61,
    question: 'A substance that loses electron during oxidation reduction process',
    choices: [{ id: 'A', text: 'reducing agent' }, { id: 'B', text: 'solvent' }, { id: 'C', text: 'catalyst' }, { id: 'D', text: 'oxidizing agent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-62',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 62,
    question: 'Substance formed when sulfur burns in air',
    choices: [{ id: 'A', text: 'sulfur dioxide' }, { id: 'B', text: 'sulfur trioxide' }, { id: 'C', text: 'sulfur tetraoxide' }, { id: 'D', text: 'sulfide' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-63',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 63,
    question: 'A substance which changes the speed of a chemical reaction without itself being changed is called',
    choices: [{ id: 'A', text: 'catalyst' }, { id: 'B', text: 'product' }, { id: 'C', text: 'additive' }, { id: 'D', text: 'reactant' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-64',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 64,
    question: 'The process of decomposing a substance by means of electric current',
    choices: [{ id: 'A', text: 'electrolysis' }, { id: 'B', text: 'electrochemistry' }, { id: 'C', text: 'thermochemistry' }, { id: 'D', text: 'electrification' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-65',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 65,
    question: 'The type of solution containing maximum solute that its solvent can hold at a given temperature and pressure',
    choices: [{ id: 'A', text: 'saturated' }, { id: 'B', text: 'dilute' }, { id: 'C', text: 'supersaturated' }, { id: 'D', text: 'unsaturated' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-66',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 66,
    question: 'The process of gaining an electron due to decrease in oxidation state',
    choices: [{ id: 'A', text: 'reduction' }, { id: 'B', text: 'oxidation' }, { id: 'C', text: 'nitration' }, { id: 'D', text: 'hydrogenation' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-67',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 67,
    question: 'A solution that contains a small amount of solute in proportion to the solvent',
    choices: [{ id: 'A', text: 'dilute' }, { id: 'B', text: 'supersaturated' }, { id: 'C', text: 'unsaturated' }, { id: 'D', text: 'saturated' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-68',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 68,
    question: 'The property of a solution that depends on the number of solute particles present not on the nature of the particles',
    choices: [{ id: 'A', text: 'colligative' }, { id: 'B', text: 'vapor pressure' }, { id: 'C', text: 'boiling point' }, { id: 'D', text: 'osmotic pressure' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-69',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 69,
    question: 'A uniform mixture consisting of solute and solvent',
    choices: [{ id: 'A', text: 'solution' }, { id: 'B', text: 'mixture' }, { id: 'C', text: 'compound' }, { id: 'D', text: 'colloids' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-70',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 70,
    question: 'It is a mixture of a solid and a liquid in which particles settle out upon standing',
    choices: [{ id: 'A', text: 'suspensions' }, { id: 'B', text: 'solution' }, { id: 'C', text: 'emulsion' }, { id: 'D', text: 'colloids' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-71',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 71,
    question: 'It states the actual number of each type of atom in a molecule',
    choices: [{ id: 'A', text: 'molecular formula' }, { id: 'B', text: 'atomic formula' }, { id: 'C', text: 'empirical formula' }, { id: 'D', text: 'structural formula' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-72',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 72,
    question: 'It indicates the simplest whole number ratio of atoms in a molecule',
    choices: [{ id: 'A', text: 'empirical formula' }, { id: 'B', text: 'molecular formula' }, { id: 'C', text: 'atomic formula' }, { id: 'D', text: 'formula one' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-73',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 73,
    question: 'It is called laughing gas',
    choices: [{ id: 'A', text: 'nitrous oxide' }, { id: 'B', text: 'ethane' }, { id: 'C', text: 'cyanic acid' }, { id: 'D', text: 'methane' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-74',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 74,
    question: 'It is the sum number of protons and neutrons',
    choices: [{ id: 'A', text: 'mass number' }, { id: 'B', text: 'atomic number' }, { id: 'C', text: 'atomic radius' }, { id: 'D', text: 'electron number' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-75',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 75,
    question: 'It is the atomic weight of a substance in grams',
    choices: [{ id: 'A', text: 'mole' }, { id: 'B', text: 'isotopes' }, { id: 'C', text: 'atoms' }, { id: 'D', text: 'compilation' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-76',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 76,
    question: 'Avogadro’s number is equivalent to',
    choices: [{ id: 'A', text: '6.023x10^23' }, { id: 'B', text: '6.023' }, { id: 'C', text: '0.082057' }, { id: 'D', text: '0.73' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-77',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 77,
    question: 'This substance is a good conductor of heat and electric current',
    choices: [{ id: 'A', text: 'metals' }, { id: 'B', text: 'non-metals' }, { id: 'C', text: 'metalloid' }, { id: 'D', text: 'inert gases' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-78',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 78,
    question: 'Sum of the atomic weights of all atoms present in the formula unit',
    choices: [{ id: 'A', text: 'molecular weight' }, { id: 'B', text: 'empirical weight' }, { id: 'C', text: 'nuclear weight' }, { id: 'D', text: 'atomic weight' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-79',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 79,
    question: 'The ratio of the number of moles per liter of a solution',
    choices: [{ id: 'A', text: 'molarity' }, { id: 'B', text: 'molality' }, { id: 'C', text: 'normality' }, { id: 'D', text: 'mole fraction' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-80',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 80,
    question: 'The ratio of the number of moles per kilogram of solvent',
    choices: [{ id: 'A', text: 'molality' }, { id: 'B', text: 'molarity' }, { id: 'C', text: 'normality' }, { id: 'D', text: 'mole fraction' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-81',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 81,
    question: 'The dissolving medium in a solution',
    choices: [{ id: 'A', text: 'solvent' }, { id: 'B', text: 'acids' }, { id: 'C', text: 'solute' }, { id: 'D', text: 'water' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-82',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 82,
    question: 'Matter which has a fixed volume but no definite shape',
    choices: [{ id: 'A', text: 'liquid' }, { id: 'B', text: 'gas' }, { id: 'C', text: 'solid' }, { id: 'D', text: 'all of these' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-83',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 83,
    question: 'Form of matter which cannot be separated into two or more other forms of matter except by means of chemical process',
    choices: [{ id: 'A', text: 'pure substance' }, { id: 'B', text: 'solution' }, { id: 'C', text: 'mixture' }, { id: 'D', text: 'none of these' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-84',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 84,
    question: 'What is a reference sheet for the elements that can be used to form engineering materials?',
    choices: [{ id: 'A', text: 'Periodic Table' }, { id: 'B', text: 'Truth Table' }, { id: 'C', text: 'Building blocks of Materials' }, { id: 'D', text: 'Structure of Materials' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-85',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 85,
    question: 'What is a polymer production process that involves forming a polymer chain containing two different monomers?',
    choices: [{ id: 'A', text: 'copolymerization' }, { id: 'B', text: 'Blending' }, { id: 'C', text: 'Alloying' }, { id: 'D', text: 'cross-linking' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-86',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 86,
    question: 'What chemical property of a material refers to its ability to resist deterioration by chemical or electrochemical reactions with environment?',
    choices: [{ id: 'A', text: 'corrosion resistance' }, { id: 'B', text: 'conductivity' }, { id: 'C', text: 'Electrical resistance' }, { id: 'D', text: 'Stereo specificity' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-87',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 87,
    question: 'Some polymeric materials such as epoxies are formed by strong primary chemical bonds called ___',
    choices: [{ id: 'A', text: 'cross linking' }, { id: 'B', text: 'covalent bond' }, { id: 'C', text: 'Metallic bond' }, { id: 'D', text: 'Van der Waals bond' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-88',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 88,
    question: 'A large molecule with two alternating mers is called as _',
    choices: [{ id: 'A', text: 'copolymer or interpolymer' }, { id: 'B', text: 'monomer' }, { id: 'C', text: 'elastomer' }, { id: 'D', text: 'mers' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-89',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 89,
    question: 'Iron is said to be abundant in nature. About how many percent of the earth’s crust is iron?',
    choices: [{ id: 'A', text: '5%' }, { id: 'B', text: '20%' }, { id: 'C', text: '8%' }, { id: 'D', text: '10%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-90',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 90,
    question: 'What do you call earth and stone mixed with the iron oxides?',
    choices: [{ id: 'A', text: 'Gangue' }, { id: 'B', text: 'Ore' }, { id: 'C', text: 'Hematite' }, { id: 'D', text: 'Magnetite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-91',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 91,
    question: 'What is a coal that has been previously burned in an oxygen-poor environment?',
    choices: [{ id: 'A', text: 'coke' }, { id: 'B', text: 'Diamond' }, { id: 'C', text: 'Hematite' }, { id: 'D', text: 'Tuyere' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-92',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 92,
    question: 'What is defined as a local corrosion damage characterized by surface cavities?',
    choices: [{ id: 'A', text: 'Pitting' }, { id: 'B', text: 'cavitation' }, { id: 'C', text: 'Erosion' }, { id: 'D', text: 'cracking' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-93',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 93,
    question: 'What refers to the removal of zinc from brasses?',
    choices: [{ id: 'A', text: 'Dezincification' }, { id: 'B', text: 'Graphitization' }, { id: 'C', text: 'Stabilization' }, { id: 'D', text: 'Dealloying' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-94',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 94,
    question: 'What is the scaling off of a surface in flakes or layers as the result of corrosion?',
    choices: [{ id: 'A', text: 'Exfoliation' }, { id: 'B', text: 'corrosion fatigue' }, { id: 'C', text: 'Scraping' }, { id: 'D', text: 'Fretting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-95',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 95,
    question: 'What is the chief ore of tin?',
    choices: [{ id: 'A', text: 'cassiterite' }, { id: 'B', text: 'Bauxite' }, { id: 'C', text: 'Ilmenite' }, { id: 'D', text: 'Galena' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-96',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 96,
    question: 'What is the chief ore of zinc?',
    choices: [{ id: 'A', text: 'Sphalerite' }, { id: 'B', text: 'Ilmenite' }, { id: 'C', text: 'cassiterite' }, { id: 'D', text: 'Bauxite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-97',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 97,
    question: 'What is the chief ore of titanium?',
    choices: [{ id: 'A', text: 'Ilmenite' }, { id: 'B', text: 'Bauxite' }, { id: 'C', text: 'cassiterite' }, { id: 'D', text: 'Sphalerite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-98',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 98,
    question: 'What is the mixture of gibbsite and diaspore, of which aluminum is derived?',
    choices: [{ id: 'A', text: 'Bauxite' }, { id: 'B', text: 'Rutile' }, { id: 'C', text: 'Galena' }, { id: 'D', text: 'Sphalerite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-99',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 99,
    question: 'What is the most abundant metal in nature?',
    choices: [{ id: 'A', text: 'Aluminum' }, { id: 'B', text: 'Steel' }, { id: 'C', text: 'Iron' }, { id: 'D', text: 'copper' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-100',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 100,
    question: 'What property of an element is determined by the number of protons in its nucleus?',
    choices: [{ id: 'A', text: 'Atomic number' }, { id: 'B', text: 'Isotopes' }, { id: 'C', text: 'Atomic Mass unit' }, { id: 'D', text: 'Atomic weight' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-101',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 101,
    question: 'What refers to a metal combined with one or more other elements?',
    choices: [{ id: 'A', text: 'Alloy' }, { id: 'B', text: 'Molecule' }, { id: 'C', text: 'Mixture' }, { id: 'D', text: 'Compound' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-102',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 102,
    question: 'The element that was discovered between calcium and titanium is ___',
    choices: [{ id: 'A', text: 'Scandium' }, { id: 'B', text: 'Molybdenum' }, { id: 'C', text: 'Potassium' }, { id: 'D', text: 'Silicon' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-103',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 103,
    question: 'The best method used to refine gold metal is',
    choices: [{ id: 'A', text: 'Electrolysis' }, { id: 'B', text: 'Bessemerization' }, { id: 'C', text: 'Oxidation' }, { id: 'D', text: 'Distillation' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-104',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 104,
    question: 'The ore from which iron is obtained is',
    choices: [{ id: 'A', text: 'taconite' }, { id: 'B', text: 'chalcocite' }, { id: 'C', text: 'Sphalerite' }, { id: 'D', text: 'bauxite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-105',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 105,
    question: 'The most abundant element in the universe is',
    choices: [{ id: 'A', text: 'H (Hydrogen)' }, { id: 'B', text: 'O (Oxygen)' }, { id: 'C', text: 'He (Helium)' }, { id: 'D', text: 'N (Nitrogen)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-106',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 106,
    question: 'Which element is present in all organic compounds?',
    choices: [{ id: 'A', text: 'carbon' }, { id: 'B', text: 'nitrogen' }, { id: 'C', text: 'phosphorous' }, { id: 'D', text: 'Oxygen' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-107',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 107,
    question: 'What are elements that have properties intermediate between metals and non-metals?',
    choices: [{ id: 'A', text: 'Metalloids' }, { id: 'B', text: 'Liquids' }, { id: 'C', text: 'Gases' }, { id: 'D', text: 'Solids' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-108',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 108,
    question: 'Which element is the best conductor of electricity?',
    choices: [{ id: 'A', text: 'silver' }, { id: 'B', text: 'copper' }, { id: 'C', text: 'aluminum' }, { id: 'D', text: 'Gold' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-109',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 109,
    question: 'What refers to ions that are NOT involved in the overall reaction?',
    choices: [{ id: 'A', text: 'Spectator ions' }, { id: 'B', text: 'Extra ion' }, { id: 'C', text: 'Special ions' }, { id: 'D', text: 'Guest ions' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-110',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 110,
    question: 'In the periodic table of elements, which ONE of the following is light metal?',
    choices: [{ id: 'A', text: 'Potassium' }, { id: 'B', text: 'Mercury' }, { id: 'C', text: 'Silver' }, { id: 'D', text: 'Gold' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-111',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 111,
    question: 'Which is also called stranger gas?',
    choices: [{ id: 'A', text: 'Xenon' }, { id: 'B', text: 'Neon' }, { id: 'C', text: 'Argon' }, { id: 'D', text: 'Nitrous oxide' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-112',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 112,
    question: 'The hardest form of carbon is',
    choices: [{ id: 'A', text: 'diamond' }, { id: 'B', text: 'charcoal' }, { id: 'C', text: 'graphite' }, { id: 'D', text: 'coke' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-113',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 113,
    question: 'What is the process of putting back the lost electrons to convert ion back to a metal?',
    choices: [{ id: 'A', text: 'Reduction' }, { id: 'B', text: 'Ionization' }, { id: 'C', text: 'Oxidation' }, { id: 'D', text: 'corrosion' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-114',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 114,
    question: 'Metalloids have a valence of __',
    choices: [{ id: 'A', text: '4' }, { id: 'B', text: '3' }, { id: 'C', text: '5' }, { id: 'D', text: 'Unity' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-115',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 115,
    question: 'Copper when exposed to ordinary atmosphere becomes oxidized turning it into what color?',
    choices: [{ id: 'A', text: 'Black' }, { id: 'B', text: 'Brown' }, { id: 'C', text: 'Light gray' }, { id: 'D', text: 'Light orange' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-116',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 116,
    question: 'Hard water is water which contains soluble salts of which of the following;',
    choices: [{ id: 'A', text: 'calcium' }, { id: 'B', text: 'sodium' }, { id: 'C', text: 'sulfur' }, { id: 'D', text: 'chlorine' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-117',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 117,
    question: 'The number of molecules in 22.4 liters ( under standard conditions ) of a substance in its gaseous state is called,',
    choices: [{ id: 'A', text: 'Avogadro\'s number' }, { id: 'B', text: 'Dulong\'s number' }, { id: 'C', text: 'Petit\'s number' }, { id: 'D', text: 'Graham\'s number' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-118',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 118,
    question: 'What is the actual shape of the methane CH4 molecule?',
    choices: [{ id: 'A', text: 'Tetrahedral' }, { id: 'B', text: 'linear' }, { id: 'C', text: 'square planar' }, { id: 'D', text: 'pyramid' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-119',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 119,
    question: 'Oxygen comprises what percent in mass in the earth\'s crust?',
    choices: [{ id: 'A', text: '49.5' }, { id: 'B', text: '48.5' }, { id: 'C', text: '47.5' }, { id: 'D', text: '50.0' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-120',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 120,
    question: 'What refers to a chemical formula that shows how atoms are bonded to one another in a molecule?',
    choices: [{ id: 'A', text: 'Structural formula' }, { id: 'B', text: 'Standard formula' }, { id: 'C', text: 'Bonding formula' }, { id: 'D', text: 'Molecular formula' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-121',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 121,
    question: 'What refers to the passage of molecules of a gas from one container to another through a tiny opening between the containers?',
    choices: [{ id: 'A', text: 'Effusion' }, { id: 'B', text: 'Fission' }, { id: 'C', text: 'Fusion' }, { id: 'D', text: 'Diffusion' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-122',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 122,
    question: 'What refers to the minimum amount of energy required to initiate a chemical reaction?',
    choices: [{ id: 'A', text: 'Activation energy' }, { id: 'B', text: 'Reaction energy' }, { id: 'C', text: 'Initial energy' }, { id: 'D', text: 'Atomic energy' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-123',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 123,
    question: 'A photon is',
    choices: [{ id: 'A', text: 'a particle of electromagnetic radiation' }, { id: 'B', text: 'a neutral proton' }, { id: 'C', text: 'a neutral electron' }, { id: 'D', text: 'a charged neutron' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-124',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 124,
    question: 'Reactions generally proceed faster at higher temperature because of which of the following',
    choices: [
      { id: 'A', text: 'the molecules collide more frequently' },
      { id: 'B', text: 'the activation energy is less' },
      { id: 'C', text: 'the bonds are easier to break' },
      { id: 'D', text: 'the molecules are less energetic' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-125',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 125,
    question: 'In organic chemistry, which compound families are associated with the following bonds? 1. C-C  2. C=C  3. C≡C',
    choices: [
      { id: 'A', text: '1: alkane, 2: alkene, 3: alkyne' },
      { id: 'B', text: '1: alkene, 2: alkyne, 3: alkane' },
      { id: 'C', text: '1: alkyne, 2: alkane, 3: alkene' },
      { id: 'D', text: '1: alkane, 2: alkyne, 3: alkene' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-126',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 126,
    question: 'The radical ion (NO2-) is called',
    choices: [{ id: 'A', text: 'nitrite' }, { id: 'B', text: 'nitrate' }, { id: 'C', text: 'nitride' }, { id: 'D', text: 'binitrite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-127',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 127,
    question: 'It is anything that occupies space and has mass.',
    choices: [{ id: 'A', text: 'matter' }, { id: 'B', text: 'water' }, { id: 'C', text: 'meter' }, { id: 'D', text: 'atom' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-128',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 128,
    question: 'A chemical reaction accompanied by light and heat',
    choices: [{ id: 'A', text: 'combustion' }, { id: 'B', text: 'fusion' }, { id: 'C', text: 'fission' }, { id: 'D', text: 'radiation' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-129',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 129,
    question: 'It is a mixture of two or more non-volatile liquids in which separation takes place very slowly.',
    choices: [{ id: 'A', text: 'emulsion' }, { id: 'B', text: 'Suspension' }, { id: 'C', text: 'solution' }, { id: 'D', text: 'colloids' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-130',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 130,
    question: 'Formula for magnesium Nitrite',
    choices: [{ id: 'A', text: 'Mg(NO2)2' }, { id: 'B', text: 'MgNO2' }, { id: 'C', text: 'Mg2(NO2)' }, { id: 'D', text: 'Mg2(NO2)2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-131',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 131,
    question: 'Metals are conductive because;',
    choices: [
      { id: 'A', text: 'the electrons are loosely bound to the nuclei and therefore mobile' },
      { id: 'B', text: 'they are on the left side of the periodic table' },
      { id: 'C', text: 'they have a characteristic metallic luster' },
      { id: 'D', text: 'they have extra electrons as exhibited by normally positive valence states' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-132',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 132,
    question: 'The chemical formula of potassium sulfate salt formed from neutralization is',
    choices: [{ id: 'A', text: 'K2SO4' }, { id: 'B', text: 'NaO' }, { id: 'C', text: 'P2SO4' }, { id: 'D', text: 'KSO4' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-133',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 133,
    question: 'Which of the following statements about the halogens is incorrect',
    choices: [
      { id: 'A', text: 'they will react with water to form very strong base' },
      { id: 'B', text: 'they all exhibit a valence of -1' },
      { id: 'C', text: 'they are good oxidizing agents' },
      { id: 'D', text: 'they form diatomic molecules' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-134',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 134,
    question: 'At equal volume, the same temperature and pressure conditions, the gases contains the same number of molecules',
    choices: [{ id: 'A', text: 'Avogadro\'s law' }, { id: 'B', text: 'Boyle\'s law' }, { id: 'C', text: 'Charles law' }, { id: 'D', text: 'Dalton\'s law' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-135',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 135,
    question: 'Which element must be introduced to remove copper from copper sulphate, CuSO4?',
    choices: [{ id: 'A', text: 'Fe' }, { id: 'B', text: 'Na' }, { id: 'C', text: 'Hg' }, { id: 'D', text: 'Ag' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-136',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 136,
    question: 'Coal heating value depends largely on which of the following',
    choices: [{ id: 'A', text: 'fixed carbon & ash content' }, { id: 'B', text: 'sulfur content' }, { id: 'C', text: 'size of particles' }, { id: 'D', text: 'moisture content' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-137',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 137,
    question: 'Which of the following type of coal rank the highest',
    choices: [{ id: 'A', text: 'anthracite' }, { id: 'B', text: 'bituminous' }, { id: 'C', text: 'coke' }, { id: 'D', text: 'lignite' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-138',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 138,
    question: 'The pressure exerted in a vessel by a mixture of gases is equal to the sum of the pressure that each separate gas would exert if it alone occupied the volume of the vessel.',
    choices: [{ id: 'A', text: 'Dalton\'s Law' }, { id: 'B', text: 'Avogadro\'s Law' }, { id: 'C', text: 'Boyle\'s Law' }, { id: 'D', text: 'Charles\'s Law' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-139',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 139,
    question: 'What do you call the change of phase directly from vapor to solid without passing through the liquid state?',
    choices: [{ id: 'A', text: 'deposition' }, { id: 'B', text: 'sublimation' }, { id: 'C', text: 'condensation' }, { id: 'D', text: 'vaporization' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-140',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 140,
    question: 'It is a method of analyzing coal which includes moisture, ash, volatile matter and fixed carbon contents',
    choices: [{ id: 'A', text: 'Proximate analysis' }, { id: 'B', text: 'Ultimate analysis' }, { id: 'C', text: 'Orsat analysis' }, { id: 'D', text: 'Stoichiometry' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-141',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 141,
    question: 'It is a more comprehensive coal analysis of various elements present in a coal sample such as carbon, hydrogen, oxygen, nitrogen and sulfur.',
    choices: [{ id: 'A', text: 'Ultimate analysis' }, { id: 'B', text: 'Orsat analysis' }, { id: 'C', text: 'Stoichiometry' }, { id: 'D', text: 'Proximate analysis' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-142',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 142,
    question: 'An anode is,',
    choices: [
      { id: 'A', text: 'an electrode at which oxidation occurs' },
      { id: 'B', text: 'an electrode at which reduction occurs' },
      { id: 'C', text: 'a pentode with a ground plate' },
      { id: 'D', text: 'the end point of direct network' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-143',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 143,
    question: 'What is the most abundant type of atom in living things by count?',
    choices: [{ id: 'A', text: 'hydrogen' }, { id: 'B', text: 'oxygen' }, { id: 'C', text: 'sodium' }, { id: 'D', text: 'carbon' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-144',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 144,
    question: 'Which of the following statements is FALSE for an ideal gas?',
    choices: [
      { id: 'A', text: 'The molecules behave as solid spheres of finite radius' },
      { id: 'B', text: 'pV = nR*T' },
      { id: 'C', text: 'Collisions between gas molecules are perfectly elastic and result in no decrease in kinetic energy' },
      { id: 'D', text: 'No attractive forces exist between the molecules.' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-145',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 145,
    question: 'What are valence electrons?',
    choices: [
      { id: 'A', text: 'the outer-shell electrons' },
      { id: 'B', text: 'electrons with positive charge' },
      { id: 'C', text: 'the electrons of complete quantum shells' },
      { id: 'D', text: 'the K-quantum shell electrons' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-146',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 146,
    question: 'Two major types of chemical bonds are observed in chemical bonding: ionic and covalent. Which of the following has a bond that is the least ionic in character?',
    choices: [{ id: 'A', text: 'H2' }, { id: 'B', text: 'H2O' }, { id: 'C', text: 'NaCl' }, { id: 'D', text: 'CH4' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-147',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 147,
    question: 'Which of the following elements and compounds is highly reactive in its pure elemental form?',
    choices: [{ id: 'A', text: 'sodium (Na)' }, { id: 'B', text: 'helium (He)' }, { id: 'C', text: 'carbon dioxide (CO2)' }, { id: 'D', text: 'hydrochloric acid (HCl)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-148',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 148,
    question: '"The solubility of a gas in liquid is directly proportional to the partial pressure of the gas above the solution." This is known as',
    choices: [{ id: 'A', text: 'Henry\'s law' }, { id: 'B', text: 'Dalton\'s law' }, { id: 'C', text: 'Hund\'s law' }, { id: 'D', text: 'Pascal\'s law' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-149',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 149,
    question: 'Which of the following would you expect to have a highest melting point?',
    choices: [{ id: 'A', text: 'sodium chloride' }, { id: 'B', text: 'mercury' }, { id: 'C', text: 'potassium' }, { id: 'D', text: 'ice' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-150',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 150,
    question: 'What is added to hydrogen chloride gas to form hydrochloric acid?',
    choices: [{ id: 'A', text: 'Water' }, { id: 'B', text: 'Carbon' }, { id: 'C', text: 'Oxygen' }, { id: 'D', text: 'Sulfur' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-151',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 151,
    question: 'What crystalline carbon is soft, black, slippery solid that possess metallic luster and conducts electricity?',
    choices: [{ id: 'A', text: 'Graphite' }, { id: 'B', text: 'Diamond' }, { id: 'C', text: 'coke' }, { id: 'D', text: 'charcoal' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-152',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 152,
    question: 'What type of carbon is used in the manufacture of car tires?',
    choices: [{ id: 'A', text: 'Carbon black' }, { id: 'B', text: 'Charcoal' }, { id: 'C', text: 'Coke' }, { id: 'D', text: 'Diamond' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-153',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 153,
    question: 'What element is known as the lightest metal?',
    choices: [{ id: 'A', text: 'Lithium' }, { id: 'B', text: 'Aluminum' }, { id: 'C', text: 'Manganese' }, { id: 'D', text: 'Magnesium' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-154',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 154,
    question: 'What law of nature underpins the concept of a balanced chemical equation?',
    choices: [{ id: 'A', text: 'Law of conservation of mass' }, { id: 'B', text: 'Gay-Lussac law' }, { id: 'C', text: 'Faraday’s law' }, { id: 'D', text: 'Second law of thermodynamics' }],
    correctChoiceId: 'A'
  },
  {
    id: 'chem-155',
    subject: 'Chemistry',
    sourceFileName: 'Chemistry Reviewer (155 Questions)',
    questionNumber: 155,
    question: 'Atoms or ions which have the same electronic configuration?',
    choices: [{ id: 'A', text: 'isoelectronic' }, { id: 'B', text: 'Iso-ionic' }, { id: 'C', text: 'isometric' }, { id: 'D', text: 'isotope' }],
    correctChoiceId: 'A'
  }
];

export const CHEMISTRY_QUESTIONS: FlashcardQuestion[] = RAW_CHEMISTRY_QUESTIONS.map((q, idx) => {
  const seed = (q.questionNumber || idx + 1) * 43 + 199;
  return shuffleQuestionChoices(q, true, seed);
});
