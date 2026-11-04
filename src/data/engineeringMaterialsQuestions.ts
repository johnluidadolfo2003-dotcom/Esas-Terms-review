import type { FlashcardQuestion } from '../services/questionParser';

// Reviewed imports from the user-supplied quiz and Materials discussion.
// Every source occurrence and correction is mapped in docs/engineering-materials-import.json.
export const ENGINEERING_MATERIALS_QUESTIONS: FlashcardQuestion[] = [
  {
    "id": "engineering-materials-quiz-001",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 1,
    "question": "What is a material made by combining two or more distinct constituent materials to obtain a useful combination of properties?",
    "choices": [
      {
        "id": "A",
        "text": "Compound"
      },
      {
        "id": "B",
        "text": "Mixture"
      },
      {
        "id": "C",
        "text": "Matrix"
      },
      {
        "id": "D",
        "text": "Composite"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "A composite combines distinct constituents while retaining a matrix/reinforcement or comparable multiphase structure.",
    "rawSnippet": "What is a material made by combining two or more distinct constituent materials to obtain a useful combination of properties?\nA. Compound\nB. Mixture\nC. Matrix\nD. Composite\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-002",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 2,
    "question": "What is a reference sheet for the elements that can be used to form engineering materials?",
    "choices": [
      {
        "id": "A",
        "text": "Building blocks of Materials"
      },
      {
        "id": "B",
        "text": "Structure of Materials"
      },
      {
        "id": "C",
        "text": "Periodic Table"
      },
      {
        "id": "D",
        "text": "Truth Table"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "The periodic table organizes elements by atomic number and recurring chemical properties.",
    "rawSnippet": "What is a reference sheet for the elements that can be used to form engineering materials?\nA. Building blocks of Materials\nB. Structure of Materials\nC. Periodic Table\nD. Truth Table\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-003",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 3,
    "question": "What physical property of a material that refers to the point at which a material liquefies on heating or solidifies on cooling?",
    "choices": [
      {
        "id": "A",
        "text": "Specific heat"
      },
      {
        "id": "B",
        "text": "Melting point"
      },
      {
        "id": "C",
        "text": "Curie point"
      },
      {
        "id": "D",
        "text": "Refractive index"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Melting changes a solid to a liquid at a given pressure.",
    "rawSnippet": "What physical property of a material that refers to the point at which a material liquefies on heating or solidifies on cooling?\nA. Specific heat\nB. Melting point\nC. Curie point\nD. Refractive index\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-004",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 4,
    "question": "At what temperature does a ferromagnetic material lose spontaneous ferromagnetic order and become paramagnetic?",
    "choices": [
      {
        "id": "A",
        "text": "Curie point"
      },
      {
        "id": "B",
        "text": "Melting point"
      },
      {
        "id": "C",
        "text": "Thermal conductivity"
      },
      {
        "id": "D",
        "text": "Thermal expansion"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Above the Curie point the material can still respond weakly to an applied magnetic field.",
    "rawSnippet": "At what temperature does a ferromagnetic material lose spontaneous ferromagnetic order and become paramagnetic?\nA. Curie point\nB. Melting point\nC. Thermal conductivity\nD. Thermal expansion\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-005",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 5,
    "question": "What physical property of a material refers to the amount of weight gain (%) experienced in a polymer after immersion in water for a specified length of time under a controlled environment?",
    "choices": [
      {
        "id": "A",
        "text": "Thermal conductivity"
      },
      {
        "id": "B",
        "text": "Dielectric strength"
      },
      {
        "id": "C",
        "text": "Electric resistivity"
      },
      {
        "id": "D",
        "text": "Water absorption"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Water absorption is measured as mass gain under specified conditioning and immersion conditions.",
    "rawSnippet": "What physical property of a material refers to the amount of weight gain (%) experienced in a polymer after immersion in water for a specified length of time under a controlled environment?\nA. Thermal conductivity\nB. Dielectric strength\nC. Electric resistivity\nD. Water absorption\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-006",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 6,
    "question": "Which property relates steady heat flux to the temperature gradient in a homogeneous material?",
    "choices": [
      {
        "id": "A",
        "text": "Water absorption"
      },
      {
        "id": "B",
        "text": "Thermal expansion"
      },
      {
        "id": "C",
        "text": "Thermal conductivity"
      },
      {
        "id": "D",
        "text": "Heat distortion temperature"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Thermal conductivity is the proportionality coefficient in Fourier’s law.",
    "rawSnippet": "Which property relates steady heat flux to the temperature gradient in a homogeneous material?\nA. Water absorption\nB. Thermal expansion\nC. Thermal conductivity\nD. Heat distortion temperature\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-007",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 7,
    "question": "Which property is the maximum electric field an insulating material can withstand before electrical breakdown?",
    "choices": [
      {
        "id": "A",
        "text": "Conductivity"
      },
      {
        "id": "B",
        "text": "Dielectric strength"
      },
      {
        "id": "C",
        "text": "Electrical resistivity"
      },
      {
        "id": "D",
        "text": "Thermal expansion"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Dielectric strength is electric field (e.g., V/m), not voltage alone.",
    "rawSnippet": "Which property is the maximum electric field an insulating material can withstand before electrical breakdown?\nA. Conductivity\nB. Dielectric strength\nC. Electrical resistivity\nD. Thermal expansion\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-008",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 8,
    "question": "Which property is the heat required to raise the temperature of a unit mass of a substance by one kelvin?",
    "choices": [
      {
        "id": "A",
        "text": "Specific heat"
      },
      {
        "id": "B",
        "text": "Heat of fusion"
      },
      {
        "id": "C",
        "text": "Latent heat"
      },
      {
        "id": "D",
        "text": "Heat of fission"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Use specific heat capacity, not a dimensionless comparison with water.",
    "rawSnippet": "Which property is the heat required to raise the temperature of a unit mass of a substance by one kelvin?\nA. Specific heat\nB. Heat of fusion\nC. Latent heat\nD. Heat of fission\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-009",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 9,
    "question": "What physical property of a material refers to the temperature at which a polymer under a specified load shows a specified amount of deflection?",
    "choices": [
      {
        "id": "A",
        "text": "Thermal conductivity"
      },
      {
        "id": "B",
        "text": "Curie temperature"
      },
      {
        "id": "C",
        "text": "Specific heat"
      },
      {
        "id": "D",
        "text": "Heat distortion temperature"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Heat distortion temperature is determined at a specified deflection and load.",
    "rawSnippet": "What physical property of a material refers to the temperature at which a polymer under a specified load shows a specified amount of deflection?\nA. Thermal conductivity\nB. Curie temperature\nC. Specific heat\nD. Heat distortion temperature\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-010",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 10,
    "question": "What is the stress that causes fracture after a specified time under constant load and temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Hardness"
      },
      {
        "id": "B",
        "text": "Creep strength"
      },
      {
        "id": "C",
        "text": "Stress-rupture strength"
      },
      {
        "id": "D",
        "text": "Compressive yield strength"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Stress-rupture strength requires a specified time and temperature; corrected “rapture”.",
    "rawSnippet": "What is the stress that causes fracture after a specified time under constant load and temperature?\nA. Hardness\nB. Creep strength\nC. Stress-rupture strength\nD. Compressive yield strength\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-011",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 11,
    "question": "What mechanical property of a material refers to the resistance to plastic deformation?",
    "choices": [
      {
        "id": "A",
        "text": "Ductility"
      },
      {
        "id": "B",
        "text": "Hardness"
      },
      {
        "id": "C",
        "text": "Rigidity"
      },
      {
        "id": "D",
        "text": "Plasticity"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Hardness is resistance to localized plastic deformation, such as indentation.",
    "rawSnippet": "What mechanical property of a material refers to the resistance to plastic deformation?\nA. Ductility\nB. Hardness\nC. Rigidity\nD. Plasticity\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-012",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 12,
    "question": "What is the stress amplitude corresponding to failure at a specified number of cycles in a fatigue test?",
    "choices": [
      {
        "id": "A",
        "text": "Fatigue strength"
      },
      {
        "id": "B",
        "text": "Elastic limit"
      },
      {
        "id": "C",
        "text": "Creep strain"
      },
      {
        "id": "D",
        "text": "Modulus of elasticity"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Fatigue strength at a specified cycle count is not necessarily an endurance limit.",
    "rawSnippet": "What is the stress amplitude corresponding to failure at a specified number of cycles in a fatigue test?\nA. Fatigue strength\nB. Elastic limit\nC. Creep strain\nD. Modulus of elasticity\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-013",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 13,
    "question": "What dimensional property of a material refers to the deviation from edge straightness?",
    "choices": [
      {
        "id": "A",
        "text": "Waviness"
      },
      {
        "id": "B",
        "text": "Lay"
      },
      {
        "id": "C",
        "text": "Out of flat"
      },
      {
        "id": "D",
        "text": "Camber"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Camber describes deviation from edge straightness.",
    "rawSnippet": "What dimensional property of a material refers to the deviation from edge straightness?\nA. Waviness\nB. Lay\nC. Out of flat\nD. Camber\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-014",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 14,
    "question": "What dimensional property of a material refers to a wavelike variation from a perfect surface, generally much wider in spacing and higher in amplitude than surface roughness?",
    "choices": [
      {
        "id": "A",
        "text": "Out of flat"
      },
      {
        "id": "B",
        "text": "Lay"
      },
      {
        "id": "C",
        "text": "Waviness"
      },
      {
        "id": "D",
        "text": "surface finish"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Waviness has broader spacing than surface roughness.",
    "rawSnippet": "What dimensional property of a material refers to a wavelike variation from a perfect surface, generally much wider in spacing and higher in amplitude than surface roughness?\nA. Out of flat\nB. Lay\nC. Waviness\nD. surface finish\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-015",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 15,
    "question": "What polymerization process forms a polymer from two or more different monomer types?",
    "choices": [
      {
        "id": "A",
        "text": "Cross-linking"
      },
      {
        "id": "B",
        "text": "Copolymerization"
      },
      {
        "id": "C",
        "text": "Blending"
      },
      {
        "id": "D",
        "text": "Alloying"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Corrected “monuments” to monomers.",
    "rawSnippet": "What polymerization process forms a polymer from two or more different monomer types?\nA. Cross-linking\nB. Copolymerization\nC. Blending\nD. Alloying\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-016",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 16,
    "question": "What is a process of forming continuous shapes by forcing a molten polymer through a metal die?",
    "choices": [
      {
        "id": "A",
        "text": "Extrusion"
      },
      {
        "id": "B",
        "text": "Calendaring"
      },
      {
        "id": "C",
        "text": "Thermoforming"
      },
      {
        "id": "D",
        "text": "Lithography"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Extrusion produces a continuous cross-section through a die.",
    "rawSnippet": "What is a process of forming continuous shapes by forcing a molten polymer through a metal die?\nA. Extrusion\nB. Calendaring\nC. Thermoforming\nD. Lithography\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-017",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 17,
    "question": "What chemical property of a material which refers to its ability to resist deterioration by chemical or electrochemical reactions with environment?",
    "choices": [
      {
        "id": "A",
        "text": "Conductivity"
      },
      {
        "id": "B",
        "text": "Electrical resistance"
      },
      {
        "id": "C",
        "text": "Stereo specificity"
      },
      {
        "id": "D",
        "text": "Corrosion resistance"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Corrosion resistance limits environmental chemical or electrochemical deterioration.",
    "rawSnippet": "What chemical property of a material which refers to its ability to resist deterioration by chemical or electrochemical reactions with environment?\nA. Conductivity\nB. Electrical resistance\nC. Stereo specificity\nD. Corrosion resistance\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-018",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 18,
    "question": "What property characterizes energy absorbed per unit volume during fracture under impact loading?",
    "choices": [
      {
        "id": "A",
        "text": "Creep strength"
      },
      {
        "id": "B",
        "text": "Stress rupture strength"
      },
      {
        "id": "C",
        "text": "Impact strength"
      },
      {
        "id": "D",
        "text": "Endurance limit"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Added impact loading to distinguish impact strength from general toughness.",
    "rawSnippet": "What property characterizes energy absorbed per unit volume during fracture under impact loading?\nA. Creep strength\nB. Stress rupture strength\nC. Impact strength\nD. Endurance limit\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-019",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 19,
    "question": "What mechanical property of a material which is a time-dependent permanent strain under stress?",
    "choices": [
      {
        "id": "A",
        "text": "Elasticity"
      },
      {
        "id": "B",
        "text": "Creep"
      },
      {
        "id": "C",
        "text": "Rupture"
      },
      {
        "id": "D",
        "text": "Elongation"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Creep is permanent strain that develops over time under sustained stress.",
    "rawSnippet": "What mechanical property of a material which is a time-dependent permanent strain under stress?\nA. Elasticity\nB. Creep\nC. Rupture\nD. Elongation\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-020",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 20,
    "question": "What refers to the stress at which a material exhibits a specified deviation from proportionality of stress and strain?",
    "choices": [
      {
        "id": "A",
        "text": "Yield strength"
      },
      {
        "id": "B",
        "text": "Flexural strength"
      },
      {
        "id": "C",
        "text": "Tensile strength"
      },
      {
        "id": "D",
        "text": "shear strength"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Yield strength is commonly defined by a specified offset or deviation from linear behavior.",
    "rawSnippet": "What refers to the stress at which a material exhibits a specified deviation from proportionality of stress and strain?\nA. Yield strength\nB. Flexural strength\nC. Tensile strength\nD. shear strength\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-021",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 21,
    "question": "What is the greatest stress up to which stress remains directly proportional to strain?",
    "choices": [
      {
        "id": "A",
        "text": "yield point"
      },
      {
        "id": "B",
        "text": "elastic limit"
      },
      {
        "id": "C",
        "text": "Elongation"
      },
      {
        "id": "D",
        "text": "proportional limit"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "The proportional limit marks the end of the linear stress-strain range.",
    "rawSnippet": "What is the greatest stress up to which stress remains directly proportional to strain?\nA. yield point\nB. elastic limit\nC. Elongation\nD. proportional limit\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-022",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 22,
    "question": "For a material exhibiting a fatigue limit, what stress amplitude can theoretically be sustained for infinitely many cycles?",
    "choices": [
      {
        "id": "A",
        "text": "Endurance state"
      },
      {
        "id": "B",
        "text": "Endurance test"
      },
      {
        "id": "C",
        "text": "Endurance limit"
      },
      {
        "id": "D",
        "text": "endurance strength"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Not every material has an endurance limit.",
    "rawSnippet": "For a material exhibiting a fatigue limit, what stress amplitude can theoretically be sustained for infinitely many cycles?\nA. Endurance state\nB. Endurance test\nC. Endurance limit\nD. endurance strength\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-023",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 23,
    "question": "Which of the following is a natural magnet?",
    "choices": [
      {
        "id": "A",
        "text": "Magnesia"
      },
      {
        "id": "B",
        "text": "Lodestone"
      },
      {
        "id": "C",
        "text": "Soft iron"
      },
      {
        "id": "D",
        "text": "Steel"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Lodestone is naturally magnetized magnetite.",
    "rawSnippet": "Which of the following is a natural magnet?\nA. Magnesia\nB. Lodestone\nC. Soft iron\nD. Steel\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-024",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 24,
    "question": "What is the resistance of a material to plastic deformation?",
    "choices": [
      {
        "id": "A",
        "text": "Hardness"
      },
      {
        "id": "B",
        "text": "Stiffness"
      },
      {
        "id": "C",
        "text": "Creepage"
      },
      {
        "id": "D",
        "text": "Rigidity"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Hardness concerns localized plastic deformation, while stiffness concerns elastic deformation.",
    "rawSnippet": "What is the resistance of a material to plastic deformation?\nA. Hardness\nB. Stiffness\nC. Creepage\nD. Rigidity\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-025",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 25,
    "question": "Which materials have magnetic permeability slightly less than that of free space?",
    "choices": [
      {
        "id": "A",
        "text": "Paramagnetic materials"
      },
      {
        "id": "B",
        "text": "Non-magnetic materials"
      },
      {
        "id": "C",
        "text": "Ferromagnetic materials"
      },
      {
        "id": "D",
        "text": "Diamagnetic materials"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which materials have magnetic permeability slightly less than that of free space?\nA. Paramagnetic materials\nB. Non-magnetic materials\nC. Ferromagnetic materials\nD. Diamagnetic materials\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-026",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 26,
    "question": "Which materials have magnetic permeability slightly greater than that of free space?",
    "choices": [
      {
        "id": "A",
        "text": "Ferromagnetic materials"
      },
      {
        "id": "B",
        "text": "Diamagnetic materials"
      },
      {
        "id": "C",
        "text": "Paramagnetic materials"
      },
      {
        "id": "D",
        "text": "Non-magnetic materials"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which materials have magnetic permeability slightly greater than that of free space?\nA. Ferromagnetic materials\nB. Diamagnetic materials\nC. Paramagnetic materials\nD. Non-magnetic materials\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-027",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 27,
    "question": "Which of the materials have very high permeabilities?",
    "choices": [
      {
        "id": "A",
        "text": "Non-magnetic materials"
      },
      {
        "id": "B",
        "text": "Ferromagnetic materials"
      },
      {
        "id": "C",
        "text": "Diamagnetic materials"
      },
      {
        "id": "D",
        "text": "Paramagnetic materials"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Ferromagnetic materials can have very high permeability and spontaneous magnetic order.",
    "rawSnippet": "Which of the materials have very high permeabilities?\nA. Non-magnetic materials\nB. Ferromagnetic materials\nC. Diamagnetic materials\nD. Paramagnetic materials\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-028",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 28,
    "question": "What is the defined by ASTM as a material that contains as an essential ingredient an organic substance of large molecular weight, is solid in its finished state, and some stage in its manufactured or in its processing into finished articles, can be shaped by flow?",
    "choices": [
      {
        "id": "A",
        "text": "Plastic"
      },
      {
        "id": "B",
        "text": "Ceramic"
      },
      {
        "id": "C",
        "text": "Metal"
      },
      {
        "id": "D",
        "text": "Metalloid"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Plastics are polymer-based materials capable of being shaped during processing.",
    "rawSnippet": "What is the defined by ASTM as a material that contains as an essential ingredient an organic substance of large molecular weight, is solid in its finished state, and some stage in its manufactured or in its processing into finished articles, can be shaped by flow?\nA. Plastic\nB. Ceramic\nC. Metal\nD. Metalloid\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-029",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 29,
    "question": "What term describes chemical bonds joining adjacent polymer chains into a network?",
    "choices": [
      {
        "id": "A",
        "text": "Covalent bond"
      },
      {
        "id": "B",
        "text": "Metallic bond"
      },
      {
        "id": "C",
        "text": "Van der Waals bond"
      },
      {
        "id": "D",
        "text": "Cross linking"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Cross-linking is the interchain network arrangement; the links themselves are covalent bonds.",
    "rawSnippet": "What term describes chemical bonds joining adjacent polymer chains into a network?\nA. Covalent bond\nB. Metallic bond\nC. Van der Waals bond\nD. Cross linking\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-030",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 30,
    "question": "What is a polymer made from two or more different monomer types called?",
    "choices": [
      {
        "id": "A",
        "text": "elastomer"
      },
      {
        "id": "B",
        "text": "mers"
      },
      {
        "id": "C",
        "text": "copolymer or interpolymer"
      },
      {
        "id": "D",
        "text": "monomer"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Copolymers need not have an alternating sequence.",
    "rawSnippet": "What is a polymer made from two or more different monomer types called?\nA. elastomer\nB. mers\nC. copolymer or interpolymer\nD. monomer\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-031",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 31,
    "question": "What term is used to describe a polymer that has rubberlike properties?",
    "choices": [
      {
        "id": "A",
        "text": "Polychloroprene"
      },
      {
        "id": "B",
        "text": "Elastomer"
      },
      {
        "id": "C",
        "text": "Vulcanizer"
      },
      {
        "id": "D",
        "text": "Elasticmer"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Elastomers undergo large, substantially recoverable deformation.",
    "rawSnippet": "What term is used to describe a polymer that has rubberlike properties?\nA. Polychloroprene\nB. Elastomer\nC. Vulcanizer\nD. Elasticmer\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-032",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 32,
    "question": "Which class of iron-based alloys contains up to about 2.1 wt.% carbon and includes low-, medium-, and high-carbon grades?",
    "choices": [
      {
        "id": "A",
        "text": "Steel"
      },
      {
        "id": "B",
        "text": "Wrought Iron"
      },
      {
        "id": "C",
        "text": "Cast Iron"
      },
      {
        "id": "D",
        "text": "Tendons"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Steel is an iron-based alloy whose carbon content is below the cast-iron range.",
    "rawSnippet": "Which class of iron-based alloys contains up to about 2.1 wt.% carbon and includes low-, medium-, and high-carbon grades?\nA. Steel\nB. Wrought Iron\nC. Cast Iron\nD. Tendons\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-033",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 33,
    "question": "What type of steel has carbon as its principal hardening agent?",
    "choices": [
      {
        "id": "A",
        "text": "Alloy steel"
      },
      {
        "id": "B",
        "text": "Stainless steel"
      },
      {
        "id": "C",
        "text": "Galvanized steel"
      },
      {
        "id": "D",
        "text": "Carbon steel"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Carbon is the principal hardening constituent of plain-carbon steels.",
    "rawSnippet": "What type of steel has carbon as its principal hardening agent?\nA. Alloy steel\nB. Stainless steel\nC. Galvanized steel\nD. Carbon steel\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-034",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 34,
    "question": "What type of plain-carbon steel contains approximately 0.76 wt.% carbon and becomes fully pearlitic on sufficiently slow cooling?",
    "choices": [
      {
        "id": "A",
        "text": "Stainless steel"
      },
      {
        "id": "B",
        "text": "Austenite"
      },
      {
        "id": "C",
        "text": "Eutectoid"
      },
      {
        "id": "D",
        "text": "Hyper-eutectoid"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Eutectoid carbon content is approximately 0.76%; full pearlite requires suitable cooling.",
    "rawSnippet": "What type of plain-carbon steel contains approximately 0.76 wt.% carbon and becomes fully pearlitic on sufficiently slow cooling?\nA. Stainless steel\nB. Austenite\nC. Eutectoid\nD. Hyper-eutectoid\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-035",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 35,
    "question": "What type of steel is commonly used for axles and gears requiring moderate to high strength?",
    "choices": [
      {
        "id": "A",
        "text": "High-carbon steel"
      },
      {
        "id": "B",
        "text": "Medium-carbon steel"
      },
      {
        "id": "C",
        "text": "Low-carbon steel"
      },
      {
        "id": "D",
        "text": "Very high-carbon"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What type of steel is commonly used for axles and gears requiring moderate to high strength?\nA. High-carbon steel\nB. Medium-carbon steel\nC. Low-carbon steel\nD. Very high-carbon\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-036",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 36,
    "question": "Galvanized steel are steel products coated with _______",
    "choices": [
      {
        "id": "A",
        "text": "Zinc"
      },
      {
        "id": "B",
        "text": "Nickel"
      },
      {
        "id": "C",
        "text": "Carbon"
      },
      {
        "id": "D",
        "text": "Sulfur"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Galvanizing coats steel with zinc, which can provide sacrificial protection.",
    "rawSnippet": "Galvanized steel are steel products coated with _______\nA. Zinc\nB. Nickel\nC. Carbon\nD. Sulfur\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-037",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 37,
    "question": "The use of acids to remove oxides and scale on hot-worked steels is known as___",
    "choices": [
      {
        "id": "A",
        "text": "Machining"
      },
      {
        "id": "B",
        "text": "Galvanizing"
      },
      {
        "id": "C",
        "text": "Tempering"
      },
      {
        "id": "D",
        "text": "Pickling"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Pickling removes oxide scale using an acid solution.",
    "rawSnippet": "The use of acids to remove oxides and scale on hot-worked steels is known as___\nA. Machining\nB. Galvanizing\nC. Tempering\nD. Pickling\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-038",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 38,
    "question": "Which is a principal benefit of adding molybdenum to suitable alloy steels?",
    "choices": [
      {
        "id": "A",
        "text": "Elimination of all heat treatment"
      },
      {
        "id": "B",
        "text": "Conversion of steel into a nonmetal"
      },
      {
        "id": "C",
        "text": "Improved high-temperature strength and hardenability"
      },
      {
        "id": "D",
        "text": "Removal of all carbon"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Replaced vague, overlapping options with one defensible alloying effect.",
    "rawSnippet": "Which is a principal benefit of adding molybdenum to suitable alloy steels?\nA. Elimination of all heat treatment\nB. Conversion of steel into a nonmetal\nC. Improved high-temperature strength and hardenability\nD. Removal of all carbon\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-039",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 39,
    "question": "What is uncoated tin-mill steel called?",
    "choices": [
      {
        "id": "A",
        "text": "Chromium-plated sheet"
      },
      {
        "id": "B",
        "text": "Blackplate"
      },
      {
        "id": "C",
        "text": "Tinplate"
      },
      {
        "id": "D",
        "text": "Galvanized sheet"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is uncoated tin-mill steel called?\nA. Chromium-plated sheet\nB. Blackplate\nC. Tinplate\nD. Galvanized sheet\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-040",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 40,
    "question": "Which nickel-chromium alloy is used in electrical resistance heating elements?",
    "choices": [
      {
        "id": "A",
        "text": "Nichrome"
      },
      {
        "id": "B",
        "text": "Hastelloy"
      },
      {
        "id": "C",
        "text": "Alnico"
      },
      {
        "id": "D",
        "text": "Aluminum bronze"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Nichrome is a Ni-Cr resistance alloy; not every Ni-Cr alloy has the same properties.",
    "rawSnippet": "Which nickel-chromium alloy is used in electrical resistance heating elements?\nA. Nichrome\nB. Hastelloy\nC. Alnico\nD. Aluminum bronze\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-041",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 41,
    "question": "What are additives used to remove dissolved oxygen from molten metal called?",
    "choices": [
      {
        "id": "A",
        "text": "Carburizers"
      },
      {
        "id": "B",
        "text": "Plasticizers"
      },
      {
        "id": "C",
        "text": "Reinforcing fibers"
      },
      {
        "id": "D",
        "text": "Deoxidizers"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "The source cast-iron stem had no matching option; reconstructed the deoxidizer concept from its keyed answer.",
    "rawSnippet": "What are additives used to remove dissolved oxygen from molten metal called?\nA. Carburizers\nB. Plasticizers\nC. Reinforcing fibers\nD. Deoxidizers\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-042",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 42,
    "question": "Which cast iron contains graphite flakes and is valued for damping and machinability?",
    "choices": [
      {
        "id": "A",
        "text": "White iron"
      },
      {
        "id": "B",
        "text": "Alloy iron"
      },
      {
        "id": "C",
        "text": "Gray iron"
      },
      {
        "id": "D",
        "text": "Malleable iron"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "The original high-carbon-silicon description did not uniquely identify gray iron.",
    "rawSnippet": "Which cast iron contains graphite flakes and is valued for damping and machinability?\nA. White iron\nB. Alloy iron\nC. Gray iron\nD. Malleable iron\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-043",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 43,
    "question": "Which of the following cast irons is heat-treated for ductility?",
    "choices": [
      {
        "id": "A",
        "text": "Gray iron"
      },
      {
        "id": "B",
        "text": "Malleable iron"
      },
      {
        "id": "C",
        "text": "White iron"
      },
      {
        "id": "D",
        "text": "Ductile iron"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Malleable iron is produced by suitable heat treatment of white cast iron.",
    "rawSnippet": "Which of the following cast irons is heat-treated for ductility?\nA. Gray iron\nB. Malleable iron\nC. White iron\nD. Ductile iron\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-044",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 44,
    "question": "Which cast iron is hard and wear resistant?",
    "choices": [
      {
        "id": "A",
        "text": "White iron"
      },
      {
        "id": "B",
        "text": "Malleable iron"
      },
      {
        "id": "C",
        "text": "Gray iron"
      },
      {
        "id": "D",
        "text": "Ductile iron"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "White cast iron has substantial carbide content and is hard and wear resistant.",
    "rawSnippet": "Which cast iron is hard and wear resistant?\nA. White iron\nB. Malleable iron\nC. Gray iron\nD. Ductile iron\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-045",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 45,
    "question": "What is considered as the general purpose oldest type and widely used cast iron?",
    "choices": [
      {
        "id": "A",
        "text": "Ductile iron"
      },
      {
        "id": "B",
        "text": "Alloy iron"
      },
      {
        "id": "C",
        "text": "Malleable iron"
      },
      {
        "id": "D",
        "text": "Gray iron"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Gray iron is a common casting material with flake graphite.",
    "rawSnippet": "What is considered as the general purpose oldest type and widely used cast iron?\nA. Ductile iron\nB. Alloy iron\nC. Malleable iron\nD. Gray iron\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-046",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 46,
    "question": "Iron is said to be abundant in nature. About how many percent of the earth’s crust is iron?",
    "choices": [
      {
        "id": "A",
        "text": "8%"
      },
      {
        "id": "B",
        "text": "10%"
      },
      {
        "id": "C",
        "text": "5%"
      },
      {
        "id": "D",
        "text": "20%"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Iron makes up roughly 5% by mass of Earth’s crust.",
    "rawSnippet": "Iron is said to be abundant in nature. About how many percent of the earth’s crust is iron?\nA. 8%\nB. 10%\nC. 5%\nD. 20%\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-047",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 47,
    "question": "What is the advantage of quench hardening?",
    "choices": [
      {
        "id": "A",
        "text": "Wear characteristics"
      },
      {
        "id": "B",
        "text": "All of the choices"
      },
      {
        "id": "C",
        "text": "Improved strength"
      },
      {
        "id": "D",
        "text": "Hardness"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Quenching a suitable austenitized steel can increase hardness, strength and wear resistance.",
    "rawSnippet": "What is the advantage of quench hardening?\nA. Wear characteristics\nB. All of the choices\nC. Improved strength\nD. Hardness\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-048",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 48,
    "question": "Which listed thermochemical treatment hardens a steel surface by nitrogen diffusion and normally requires no subsequent hardening quench?",
    "choices": [
      {
        "id": "A",
        "text": "Nitriding"
      },
      {
        "id": "B",
        "text": "Carburizing with quenching"
      },
      {
        "id": "C",
        "text": "Flame hardening"
      },
      {
        "id": "D",
        "text": "Induction hardening"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which listed thermochemical treatment hardens a steel surface by nitrogen diffusion and normally requires no subsequent hardening quench?\nA. Nitriding\nB. Carburizing with quenching\nC. Flame hardening\nD. Induction hardening\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-049",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 49,
    "question": "What field of study encompasses the procurement and production of metals?",
    "choices": [
      {
        "id": "A",
        "text": "Geology"
      },
      {
        "id": "B",
        "text": "Material Science"
      },
      {
        "id": "C",
        "text": "Metalgraphy"
      },
      {
        "id": "D",
        "text": "Metallurgy"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Metallurgy includes extraction, production, processing and properties of metals.",
    "rawSnippet": "What field of study encompasses the procurement and production of metals?\nA. Geology\nB. Material Science\nC. Metalgraphy\nD. Metallurgy\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-050",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 50,
    "question": "What is the unwanted rock or earthy material associated with an ore called?",
    "choices": [
      {
        "id": "A",
        "text": "Hematite"
      },
      {
        "id": "B",
        "text": "Magnetite"
      },
      {
        "id": "C",
        "text": "Gangue"
      },
      {
        "id": "D",
        "text": "Ore"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is the unwanted rock or earthy material associated with an ore called?\nA. Hematite\nB. Magnetite\nC. Gangue\nD. Ore\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-051",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 51,
    "question": "What solid carbon-rich fuel and reductant is produced by heating coal in the near absence of air?",
    "choices": [
      {
        "id": "A",
        "text": "Tuyere"
      },
      {
        "id": "B",
        "text": "Coke"
      },
      {
        "id": "C",
        "text": "Diamond"
      },
      {
        "id": "D",
        "text": "Hematite"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Coke is produced by carbonization, not ordinary complete combustion.",
    "rawSnippet": "What solid carbon-rich fuel and reductant is produced by heating coal in the near absence of air?\nA. Tuyere\nB. Coke\nC. Diamond\nD. Hematite\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-052",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 52,
    "question": "Which element is alloyed with copper to produce brass?",
    "choices": [
      {
        "id": "A",
        "text": "Zinc"
      },
      {
        "id": "B",
        "text": "Nickel"
      },
      {
        "id": "C",
        "text": "Aluminum"
      },
      {
        "id": "D",
        "text": "Brass"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which element is alloyed with copper to produce brass?\nA. Zinc\nB. Nickel\nC. Aluminum\nD. Brass\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-053",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 53,
    "question": "Which case-hardening process increases the carbon content near the surface of steel?",
    "choices": [
      {
        "id": "A",
        "text": "Annealing"
      },
      {
        "id": "B",
        "text": "Normalizing"
      },
      {
        "id": "C",
        "text": "Martempering"
      },
      {
        "id": "D",
        "text": "Carburizing"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which case-hardening process increases the carbon content near the surface of steel?\nA. Annealing\nB. Normalizing\nC. Martempering\nD. Carburizing\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-054",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 54,
    "question": "What is the process of heating a hardened steel to any temperature below the lower critical temperature, followed by any desired rate of cooling?",
    "choices": [
      {
        "id": "A",
        "text": "Spheroidizing"
      },
      {
        "id": "B",
        "text": "Carburizing"
      },
      {
        "id": "C",
        "text": "Tempering"
      },
      {
        "id": "D",
        "text": "Normalizing"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Tempering reheats hardened steel below its lower critical temperature.",
    "rawSnippet": "What is the process of heating a hardened steel to any temperature below the lower critical temperature, followed by any desired rate of cooling?\nA. Spheroidizing\nB. Carburizing\nC. Tempering\nD. Normalizing\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-055",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 55,
    "question": "What is a solid-state reaction in which one solid phase transforms into two different solid phases at a specified composition and temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Sublimation"
      },
      {
        "id": "B",
        "text": "Eutectoid reaction"
      },
      {
        "id": "C",
        "text": "Eutectic solidification"
      },
      {
        "id": "D",
        "text": "Melting"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "A eutectoid is a solid-state reaction, not simply any mechanical mixture.",
    "rawSnippet": "What is a solid-state reaction in which one solid phase transforms into two different solid phases at a specified composition and temperature?\nA. Sublimation\nB. Eutectoid reaction\nC. Eutectic solidification\nD. Melting\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-056",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 56,
    "question": "Which common steel impurity promotes cold shortness and embrittlement when excessive?",
    "choices": [
      {
        "id": "A",
        "text": "Phosphorus"
      },
      {
        "id": "B",
        "text": "Silicon"
      },
      {
        "id": "C",
        "text": "Manganese"
      },
      {
        "id": "D",
        "text": "Sulfur"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "“Most undesirable” is not universal; excessive phosphorus promotes embrittlement.",
    "rawSnippet": "Which common steel impurity promotes cold shortness and embrittlement when excessive?\nA. Phosphorus\nB. Silicon\nC. Manganese\nD. Sulfur\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-057",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 57,
    "question": "Which case-hardening treatment diffuses nitrogen into steel at roughly 500–550 °C to form hard nitrides?",
    "choices": [
      {
        "id": "A",
        "text": "Annealing"
      },
      {
        "id": "B",
        "text": "Normalizing"
      },
      {
        "id": "C",
        "text": "Carburizing"
      },
      {
        "id": "D",
        "text": "Nitriding"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Specified nitrogen and a representative range instead of an ambiguous airtight-box description.",
    "rawSnippet": "Which case-hardening treatment diffuses nitrogen into steel at roughly 500–550 °C to form hard nitrides?\nA. Annealing\nB. Normalizing\nC. Carburizing\nD. Nitriding\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-058",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 58,
    "question": "What is the ratio of the maximum load in a tension test to the original cross-sectional area of the test bar?",
    "choices": [
      {
        "id": "A",
        "text": "Shear strength"
      },
      {
        "id": "B",
        "text": "Flexural Strength"
      },
      {
        "id": "C",
        "text": "Tensile strength"
      },
      {
        "id": "D",
        "text": "Yield strength"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Ultimate tensile strength equals maximum tensile load divided by original area.",
    "rawSnippet": "What is the ratio of the maximum load in a tension test to the original cross-sectional area of the test bar?\nA. Shear strength\nB. Flexural Strength\nC. Tensile strength\nD. Yield strength\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-059",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 59,
    "question": "What is the ratio of normal stress to normal strain in the linear elastic range?",
    "choices": [
      {
        "id": "A",
        "text": "Refractive index"
      },
      {
        "id": "B",
        "text": "Modulus of elasticity"
      },
      {
        "id": "C",
        "text": "Percent elongation"
      },
      {
        "id": "D",
        "text": "Poisson’s ratio"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is the ratio of normal stress to normal strain in the linear elastic range?\nA. Refractive index\nB. Modulus of elasticity\nC. Percent elongation\nD. Poisson’s ratio\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-060",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 60,
    "question": "Which modulus measures resistance to elastic deformation in a uniaxial tensile test?",
    "choices": [
      {
        "id": "A",
        "text": "Modulus of elasticity"
      },
      {
        "id": "B",
        "text": "Stiffness"
      },
      {
        "id": "C",
        "text": "Hardness"
      },
      {
        "id": "D",
        "text": "Strength"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Young’s modulus measures uniaxial stiffness; modulus of rigidity specifically means shear modulus.",
    "rawSnippet": "Which modulus measures resistance to elastic deformation in a uniaxial tensile test?\nA. Modulus of elasticity\nB. Stiffness\nC. Hardness\nD. Strength\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-061",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 61,
    "question": "What is the percentage increase in gauge length after a tensile specimen fractures, relative to its original gauge length?",
    "choices": [
      {
        "id": "A",
        "text": "creep"
      },
      {
        "id": "B",
        "text": "elasticity"
      },
      {
        "id": "C",
        "text": "elongation"
      },
      {
        "id": "D",
        "text": "percent elongation"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Percent elongation is a percentage, not the unnormalized increase in length.",
    "rawSnippet": "What is the percentage increase in gauge length after a tensile specimen fractures, relative to its original gauge length?\nA. creep\nB. elasticity\nC. elongation\nD. percent elongation\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-062",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 62,
    "question": "What impurity in steel can cause “red shortness”, which means the steel becomes unworkable at high temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Manganese"
      },
      {
        "id": "B",
        "text": "Phosphorus"
      },
      {
        "id": "C",
        "text": "Sulfur"
      },
      {
        "id": "D",
        "text": "Silicon"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Sulfur can form low-melting constituents that promote hot shortness; manganese helps bind sulfur.",
    "rawSnippet": "What impurity in steel can cause “red shortness”, which means the steel becomes unworkable at high temperature?\nA. Manganese\nB. Phosphorus\nC. Sulfur\nD. Silicon\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-063",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 63,
    "question": "Which surface-hardening process uses an oxy-fuel flame followed by rapid cooling?",
    "choices": [
      {
        "id": "A",
        "text": "Nitriding"
      },
      {
        "id": "B",
        "text": "Flame hardening"
      },
      {
        "id": "C",
        "text": "Induction hardening"
      },
      {
        "id": "D",
        "text": "Cyaniding"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Specified flame heating so induction hardening is not also a correct answer.",
    "rawSnippet": "Which surface-hardening process uses an oxy-fuel flame followed by rapid cooling?\nA. Nitriding\nB. Flame hardening\nC. Induction hardening\nD. Cyaniding\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-064",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 64,
    "question": "What is the common reinforcement for polymer composites?",
    "choices": [
      {
        "id": "A",
        "text": "Glass fiber"
      },
      {
        "id": "B",
        "text": "Boron"
      },
      {
        "id": "C",
        "text": "Ceramic"
      },
      {
        "id": "D",
        "text": "Graphite"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Glass fibers are common reinforcement in polymer composites.",
    "rawSnippet": "What is the common reinforcement for polymer composites?\nA. Glass fiber\nB. Boron\nC. Ceramic\nD. Graphite\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-065",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 65,
    "question": "What localized corrosion is characterized by small surface cavities?",
    "choices": [
      {
        "id": "A",
        "text": "Cavitation"
      },
      {
        "id": "B",
        "text": "Erosion"
      },
      {
        "id": "C",
        "text": "Cracking"
      },
      {
        "id": "D",
        "text": "Pitting"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What localized corrosion is characterized by small surface cavities?\nA. Cavitation\nB. Erosion\nC. Cracking\nD. Pitting\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-066",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 66,
    "question": "What is the specific name for selective removal of zinc from brass?",
    "choices": [
      {
        "id": "A",
        "text": "Stabilization"
      },
      {
        "id": "B",
        "text": "Dealloying"
      },
      {
        "id": "C",
        "text": "Dezincification"
      },
      {
        "id": "D",
        "text": "Graphitization"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Dezincification is a particular form of dealloying.",
    "rawSnippet": "What is the specific name for selective removal of zinc from brass?\nA. Stabilization\nB. Dealloying\nC. Dezincification\nD. Graphitization\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-067",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 67,
    "question": "What is corrosion-induced separation of a material into flakes or layers?",
    "choices": [
      {
        "id": "A",
        "text": "Fretting"
      },
      {
        "id": "B",
        "text": "Exfoliation"
      },
      {
        "id": "C",
        "text": "Corrosion fatigue"
      },
      {
        "id": "D",
        "text": "Uniform corrosion"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is corrosion-induced separation of a material into flakes or layers?\nA. Fretting\nB. Exfoliation\nC. Corrosion fatigue\nD. Uniform corrosion\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-068",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 68,
    "question": "Which set includes the iron base, chromium, nickel and carbon found in common austenitic stainless steels?",
    "choices": [
      {
        "id": "A",
        "text": "Iron, chromium, carbon and nickel"
      },
      {
        "id": "B",
        "text": "Iron, chromium, zinc and nickel"
      },
      {
        "id": "C",
        "text": "Iron, chromium, carbon and zinc"
      },
      {
        "id": "D",
        "text": "Iron, chromium, carbon and copper"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Carbon is a minor constituent, not necessarily a major alloying addition.",
    "rawSnippet": "Which set includes the iron base, chromium, nickel and carbon found in common austenitic stainless steels?\nA. Iron, chromium, carbon and nickel\nB. Iron, chromium, zinc and nickel\nC. Iron, chromium, carbon and zinc\nD. Iron, chromium, carbon and copper\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-069",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 69,
    "question": "What manufacturing process produces a shape by solidifying molten material in a mold?",
    "choices": [
      {
        "id": "A",
        "text": "Forging"
      },
      {
        "id": "B",
        "text": "Rolling"
      },
      {
        "id": "C",
        "text": "Extrusion"
      },
      {
        "id": "D",
        "text": "Casting"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Removed overlapping “molding” and “all” alternatives.",
    "rawSnippet": "What manufacturing process produces a shape by solidifying molten material in a mold?\nA. Forging\nB. Rolling\nC. Extrusion\nD. Casting\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-070",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 70,
    "question": "Which cast iron contains nodular or spheroidal graphite?",
    "choices": [
      {
        "id": "A",
        "text": "Gray iron"
      },
      {
        "id": "B",
        "text": "White iron"
      },
      {
        "id": "C",
        "text": "Ductile iron"
      },
      {
        "id": "D",
        "text": "Wrought iron"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which cast iron contains nodular or spheroidal graphite?\nA. Gray iron\nB. White iron\nC. Ductile iron\nD. Wrought iron\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-071",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 71,
    "question": "What was the former expanded name of ASTM, now known as ASTM International?",
    "choices": [
      {
        "id": "A",
        "text": "Association of Steel Testing and Materials"
      },
      {
        "id": "B",
        "text": "American Society for Testing and Materials"
      },
      {
        "id": "C",
        "text": "Asian Society for Testing and Materials"
      },
      {
        "id": "D",
        "text": "Allied Society for Testing and Materials"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "The historical expansion is American Society for Testing and Materials.",
    "rawSnippet": "What was the former expanded name of ASTM, now known as ASTM International?\nA. Association of Steel Testing and Materials\nB. American Society for Testing and Materials\nC. Asian Society for Testing and Materials\nD. Allied Society for Testing and Materials\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-072",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 72,
    "question": "The wear-resistance of this material is attributed to its ability to _______, that is, the hardness is increased greatly when the steel is cold worked.",
    "choices": [
      {
        "id": "A",
        "text": "strain harden"
      },
      {
        "id": "B",
        "text": "cold harden"
      },
      {
        "id": "C",
        "text": "stress harden"
      },
      {
        "id": "D",
        "text": "cool-temperature"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Strain hardening raises resistance to further plastic flow through dislocation interactions.",
    "rawSnippet": "The wear-resistance of this material is attributed to its ability to _______, that is, the hardness is increased greatly when the steel is cold worked.\nA. strain harden\nB. cold harden\nC. stress harden\nD. cool-temperature\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-073",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 73,
    "question": "What is the general term for hardening a steel surface by changing its chemical composition while retaining a tougher core?",
    "choices": [
      {
        "id": "A",
        "text": "Full annealing"
      },
      {
        "id": "B",
        "text": "Normalizing"
      },
      {
        "id": "C",
        "text": "Stress-relief annealing"
      },
      {
        "id": "D",
        "text": "Case hardening"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Distinguished case hardening from the broader term surface hardening.",
    "rawSnippet": "What is the general term for hardening a steel surface by changing its chemical composition while retaining a tougher core?\nA. Full annealing\nB. Normalizing\nC. Stress-relief annealing\nD. Case hardening\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-074",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 74,
    "question": "What refers to the ability of steel to be hardened through to its center in large section?",
    "choices": [
      {
        "id": "A",
        "text": "Rigidity"
      },
      {
        "id": "B",
        "text": "Malleability"
      },
      {
        "id": "C",
        "text": "Hardenability"
      },
      {
        "id": "D",
        "text": "Spheroidability"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Hardenability describes the depth or extent of hardening obtainable, not simply surface hardness.",
    "rawSnippet": "What refers to the ability of steel to be hardened through to its center in large section?\nA. Rigidity\nB. Malleability\nC. Hardenability\nD. Spheroidability\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-075",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 75,
    "question": "In a eutectoid-steel TTT diagram, which product forms by diffusional transformation in the upper temperature region above the bainite range?",
    "choices": [
      {
        "id": "A",
        "text": "Martensite"
      },
      {
        "id": "B",
        "text": "Pearlite"
      },
      {
        "id": "C",
        "text": "Bainite"
      },
      {
        "id": "D",
        "text": "Austenite"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Specified the upper transformation region; “down to the knee” alone is ambiguous.",
    "rawSnippet": "In a eutectoid-steel TTT diagram, which product forms by diffusional transformation in the upper temperature region above the bainite range?\nA. Martensite\nB. Pearlite\nC. Bainite\nD. Austenite\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-076",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 76,
    "question": "Which BCC allotrope of pure iron is stable below approximately 912 °C?",
    "choices": [
      {
        "id": "A",
        "text": "Alpha iron"
      },
      {
        "id": "B",
        "text": "Beta iron"
      },
      {
        "id": "C",
        "text": "Gamma iron"
      },
      {
        "id": "D",
        "text": "Delta iron"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "The Curie transition does not change alpha iron’s BCC crystal structure.",
    "rawSnippet": "Which BCC allotrope of pure iron is stable below approximately 912 °C?\nA. Alpha iron\nB. Beta iron\nC. Gamma iron\nD. Delta iron\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-077",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 77,
    "question": "What is the chief ore of tin?",
    "choices": [
      {
        "id": "A",
        "text": "Bauxite"
      },
      {
        "id": "B",
        "text": "Ilmenite"
      },
      {
        "id": "C",
        "text": "Galena"
      },
      {
        "id": "D",
        "text": "Cassiterite"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Cassiterite is SnO2, an important tin ore.",
    "rawSnippet": "What is the chief ore of tin?\nA. Bauxite\nB. Ilmenite\nC. Galena\nD. Cassiterite\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-078",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 78,
    "question": "What is the chief ore of zinc?",
    "choices": [
      {
        "id": "A",
        "text": "Cassiterite"
      },
      {
        "id": "B",
        "text": "Bauxite"
      },
      {
        "id": "C",
        "text": "Sphalerite"
      },
      {
        "id": "D",
        "text": "Ilmenite"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Sphalerite is primarily ZnS, an important zinc ore.",
    "rawSnippet": "What is the chief ore of zinc?\nA. Cassiterite\nB. Bauxite\nC. Sphalerite\nD. Ilmenite\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-079",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 79,
    "question": "Which titanium ore has the formula FeTiO3?",
    "choices": [
      {
        "id": "A",
        "text": "Sphalerite"
      },
      {
        "id": "B",
        "text": "Ilmenite"
      },
      {
        "id": "C",
        "text": "Bauxite"
      },
      {
        "id": "D",
        "text": "Cassiterite"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Corrected ilmenite spelling; rutile is also an important titanium ore.",
    "rawSnippet": "Which titanium ore has the formula FeTiO3?\nA. Sphalerite\nB. Ilmenite\nC. Bauxite\nD. Cassiterite\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-080",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 80,
    "question": "Which major aluminum ore contains aluminum hydroxide minerals such as gibbsite, boehmite and diaspore?",
    "choices": [
      {
        "id": "A",
        "text": "Bauxite"
      },
      {
        "id": "B",
        "text": "Rutile"
      },
      {
        "id": "C",
        "text": "Galena"
      },
      {
        "id": "D",
        "text": "Sphalerite"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Bauxite can contain several aluminum hydroxide minerals.",
    "rawSnippet": "Which major aluminum ore contains aluminum hydroxide minerals such as gibbsite, boehmite and diaspore?\nA. Bauxite\nB. Rutile\nC. Galena\nD. Sphalerite\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-081",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 81,
    "question": "The term “brass” is very commonly used to designate any alloy primarily of:",
    "choices": [
      {
        "id": "A",
        "text": "aluminum and iron"
      },
      {
        "id": "B",
        "text": "copper and aluminum"
      },
      {
        "id": "C",
        "text": "zinc and nickel"
      },
      {
        "id": "D",
        "text": "copper and zinc"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Brass is a copper-zinc alloy.",
    "rawSnippet": "The term “brass” is very commonly used to designate any alloy primarily of:\nA. aluminum and iron\nB. copper and aluminum\nC. zinc and nickel\nD. copper and zinc\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-082",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 82,
    "question": "What is the most abundant metallic element in Earth’s crust?",
    "choices": [
      {
        "id": "A",
        "text": "Iron"
      },
      {
        "id": "B",
        "text": "Copper"
      },
      {
        "id": "C",
        "text": "Aluminum"
      },
      {
        "id": "D",
        "text": "Steel"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is the most abundant metallic element in Earth’s crust?\nA. Iron\nB. Copper\nC. Aluminum\nD. Steel\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-083",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 83,
    "question": "Which treatment reheats hardened steel below its lower critical temperature to reduce brittleness and develop tempered martensite?",
    "choices": [
      {
        "id": "A",
        "text": "Spheroidizing"
      },
      {
        "id": "B",
        "text": "Tempering"
      },
      {
        "id": "C",
        "text": "Normalizing"
      },
      {
        "id": "D",
        "text": "Annealing"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Tempering produces tempered martensite with carbide precipitation, not ordinary lamellar pearlite.",
    "rawSnippet": "Which treatment reheats hardened steel below its lower critical temperature to reduce brittleness and develop tempered martensite?\nA. Spheroidizing\nB. Tempering\nC. Normalizing\nD. Annealing\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-084",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 84,
    "question": "What traditional workshop term is also used for tempering hardened steel?",
    "choices": [
      {
        "id": "A",
        "text": "Drawing the temper"
      },
      {
        "id": "B",
        "text": "Recrystallization"
      },
      {
        "id": "C",
        "text": "Full annealing"
      },
      {
        "id": "D",
        "text": "Carburizing"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What traditional workshop term is also used for tempering hardened steel?\nA. Drawing the temper\nB. Recrystallization\nC. Full annealing\nD. Carburizing\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-085",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 85,
    "question": "All are steel surface hardening processes except one. Which one?",
    "choices": [
      {
        "id": "A",
        "text": "Annealing"
      },
      {
        "id": "B",
        "text": "Carburizing"
      },
      {
        "id": "C",
        "text": "Flame hardening"
      },
      {
        "id": "D",
        "text": "Nitriding"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Corrected the key to annealing. Nitriding, carburizing and flame hardening are surface-hardening treatments.",
    "rawSnippet": "All are steel surface hardening processes except one. Which one?\nA. Annealing\nB. Carburizing\nC. Flame hardening\nD. Nitriding\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-086",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 86,
    "question": "Which named copper alloy primarily combines copper and tin, without the name specifying a phosphorus addition?",
    "choices": [
      {
        "id": "A",
        "text": "yellow brass"
      },
      {
        "id": "B",
        "text": "Beryllium copper"
      },
      {
        "id": "C",
        "text": "Tin Bronze"
      },
      {
        "id": "D",
        "text": "Phosphor bronze"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Replaced the unsupported generator-collector application with an unambiguous alloy-composition distinction.",
    "rawSnippet": "Which named copper alloy primarily combines copper and tin, without the name specifying a phosphorus addition?\nA. yellow brass\nB. Beryllium copper\nC. Tin Bronze\nD. Phosphor bronze\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-087",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 87,
    "question": "Which listed term specifically denotes a flow-shaped polymer material commonly used as electrical insulation?",
    "choices": [
      {
        "id": "A",
        "text": "Aluminum"
      },
      {
        "id": "B",
        "text": "Plastic"
      },
      {
        "id": "C",
        "text": "Copper"
      },
      {
        "id": "D",
        "text": "Steel"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Removed overlapping “polymer/plastic” and unsupported superlative “most widely used”.",
    "rawSnippet": "Which listed term specifically denotes a flow-shaped polymer material commonly used as electrical insulation?\nA. Aluminum\nB. Plastic\nC. Copper\nD. Steel\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-088",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 88,
    "question": "Which cellulosic sheet material is used as electrical insulation, for example in oil-impregnated systems?",
    "choices": [
      {
        "id": "A",
        "text": "Paper"
      },
      {
        "id": "B",
        "text": "Copper foil"
      },
      {
        "id": "C",
        "text": "Aluminum foil"
      },
      {
        "id": "D",
        "text": "Steel sheet"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "The original options contained several valid insulators; specified paper insulation.",
    "rawSnippet": "Which cellulosic sheet material is used as electrical insulation, for example in oil-impregnated systems?\nA. Paper\nB. Copper foil\nC. Aluminum foil\nD. Steel sheet\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-089",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 89,
    "question": "Which listed soft magnetic material is used for DC electromagnet cores and relays?",
    "choices": [
      {
        "id": "A",
        "text": "Copper"
      },
      {
        "id": "B",
        "text": "Brass"
      },
      {
        "id": "C",
        "text": "Aluminum"
      },
      {
        "id": "D",
        "text": "Soft iron"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Specified soft iron and DC; removed the overlapping generic steel alternative.",
    "rawSnippet": "Which listed soft magnetic material is used for DC electromagnet cores and relays?\nA. Copper\nB. Brass\nC. Aluminum\nD. Soft iron\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-090",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 90,
    "question": "Which of the following is known as “electrical steel”?",
    "choices": [
      {
        "id": "A",
        "text": "Carbon steel"
      },
      {
        "id": "B",
        "text": "Cast Steel"
      },
      {
        "id": "C",
        "text": "Silicon steel"
      },
      {
        "id": "D",
        "text": "Stainless steel"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Electrical steel is commonly silicon-alloyed steel designed for magnetic applications.",
    "rawSnippet": "Which of the following is known as “electrical steel”?\nA. Carbon steel\nB. Cast Steel\nC. Silicon steel\nD. Stainless steel\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-091",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 91,
    "question": "What element is added to copper to increase its strength and fatigue properties?",
    "choices": [
      {
        "id": "A",
        "text": "Aluminum"
      },
      {
        "id": "B",
        "text": "Beryllium"
      },
      {
        "id": "C",
        "text": "Zinc"
      },
      {
        "id": "D",
        "text": "Silicon"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Beryllium enables high strength and fatigue resistance in suitable precipitation-hardened copper alloys.",
    "rawSnippet": "What element is added to copper to increase its strength and fatigue properties?\nA. Aluminum\nB. Beryllium\nC. Zinc\nD. Silicon\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-092",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 92,
    "question": "Which element is added to some copper alloys primarily to improve machinability?",
    "choices": [
      {
        "id": "A",
        "text": "Lead"
      },
      {
        "id": "B",
        "text": "Silicon"
      },
      {
        "id": "C",
        "text": "Aluminum"
      },
      {
        "id": "D",
        "text": "Zinc"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Lead improves machinability; it does not make copper extremely hard.",
    "rawSnippet": "Which element is added to some copper alloys primarily to improve machinability?\nA. Lead\nB. Silicon\nC. Aluminum\nD. Zinc\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-093",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 93,
    "question": "In traditional tin bronze, which is the principal alloying addition to the copper base?",
    "choices": [
      {
        "id": "A",
        "text": "Lead"
      },
      {
        "id": "B",
        "text": "Aluminum"
      },
      {
        "id": "C",
        "text": "Zinc"
      },
      {
        "id": "D",
        "text": "Tin"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Copper is the major component; tin is an alloying addition.",
    "rawSnippet": "In traditional tin bronze, which is the principal alloying addition to the copper base?\nA. Lead\nB. Aluminum\nC. Zinc\nD. Tin\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-095",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 95,
    "question": "The property of metals that allows them to be drawn into thin wires beyond their elastic limit without being ruptured is called",
    "choices": [
      {
        "id": "A",
        "text": "hardness"
      },
      {
        "id": "B",
        "text": "ductility"
      },
      {
        "id": "C",
        "text": "malleability"
      },
      {
        "id": "D",
        "text": "elasticity"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Corrected malleability to ductility: wire drawing involves tensile plastic deformation.",
    "rawSnippet": "The property of metals that allows them to be drawn into thin wires beyond their elastic limit without being ruptured is called\nA. hardness\nB. ductility\nC. malleability\nD. elasticity\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-096",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 96,
    "question": "Interaction between the surface of two closely adjacent bodies which causes them to cling together is known as",
    "choices": [
      {
        "id": "A",
        "text": "Cohesion"
      },
      {
        "id": "B",
        "text": "Adhesion"
      },
      {
        "id": "C",
        "text": "Viscosity"
      },
      {
        "id": "D",
        "text": "Friction"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Adhesion acts between unlike contacting surfaces; cohesion acts within a material.",
    "rawSnippet": "Interaction between the surface of two closely adjacent bodies which causes them to cling together is known as\nA. Cohesion\nB. Adhesion\nC. Viscosity\nD. Friction\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-097",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 97,
    "question": "What electrical quantity equals current divided by voltage for a conductor?",
    "choices": [
      {
        "id": "A",
        "text": "Conductance"
      },
      {
        "id": "B",
        "text": "Resistance"
      },
      {
        "id": "C",
        "text": "Permeance"
      },
      {
        "id": "D",
        "text": "Impedence"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Conductance is I/V in siemens; material conductivity is a different quantity.",
    "rawSnippet": "What electrical quantity equals current divided by voltage for a conductor?\nA. Conductance\nB. Resistance\nC. Permeance\nD. Impedence\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-098",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 98,
    "question": "Which property measures a fluid’s resistance to shear deformation?",
    "choices": [
      {
        "id": "A",
        "text": "Density"
      },
      {
        "id": "B",
        "text": "Surface tension"
      },
      {
        "id": "C",
        "text": "Compressibility"
      },
      {
        "id": "D",
        "text": "Viscosity"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Replaced obscure synonyms with distinct distractors.",
    "rawSnippet": "Which property measures a fluid’s resistance to shear deformation?\nA. Density\nB. Surface tension\nC. Compressibility\nD. Viscosity\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-099",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 99,
    "question": "The tendency of a body to return to its original size or shape after having been deformed is called",
    "choices": [
      {
        "id": "A",
        "text": "Anelastivity"
      },
      {
        "id": "B",
        "text": "Elastance"
      },
      {
        "id": "C",
        "text": "Elasticity"
      },
      {
        "id": "D",
        "text": "Elastivity"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Elastic strain is recovered when the load is removed.",
    "rawSnippet": "The tendency of a body to return to its original size or shape after having been deformed is called\nA. Anelastivity\nB. Elastance\nC. Elasticity\nD. Elastivity\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-100",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 100,
    "question": "The emission of light by a material because of its high temperature is known as",
    "choices": [
      {
        "id": "A",
        "text": "Phosphorescence"
      },
      {
        "id": "B",
        "text": "Incandescence"
      },
      {
        "id": "C",
        "text": "Luminescence"
      },
      {
        "id": "D",
        "text": "Scintillation"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Incandescence is thermal emission of visible light from a hot body.",
    "rawSnippet": "The emission of light by a material because of its high temperature is known as\nA. Phosphorescence\nB. Incandescence\nC. Luminescence\nD. Scintillation\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-101",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 101,
    "question": "The property by virtue of which a body resists any attempt to change its state of rest or motion is called",
    "choices": [
      {
        "id": "A",
        "text": "Inertia"
      },
      {
        "id": "B",
        "text": "Torpidity"
      },
      {
        "id": "C",
        "text": "Passivity"
      },
      {
        "id": "D",
        "text": "Inactivity"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Inertia is resistance to a change in a body’s motion.",
    "rawSnippet": "The property by virtue of which a body resists any attempt to change its state of rest or motion is called\nA. Inertia\nB. Torpidity\nC. Passivity\nD. Inactivity\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-102",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 102,
    "question": "If the properties of a body are the same in all directions, it is called",
    "choices": [
      {
        "id": "A",
        "text": "Isogonic"
      },
      {
        "id": "B",
        "text": "Isotopic"
      },
      {
        "id": "C",
        "text": "Isodynamic"
      },
      {
        "id": "D",
        "text": "Isotropic"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Isotropic properties do not depend on direction.",
    "rawSnippet": "If the properties of a body are the same in all directions, it is called\nA. Isogonic\nB. Isotopic\nC. Isodynamic\nD. Isotropic\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-103",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 103,
    "question": "What is the stress at which a specified amount of plastic deformation begins?",
    "choices": [
      {
        "id": "A",
        "text": "Bulk modulus"
      },
      {
        "id": "B",
        "text": "Ultimate compressive strength"
      },
      {
        "id": "C",
        "text": "Yield stress"
      },
      {
        "id": "D",
        "text": "Shear modulus"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "The original fracture-pressure stem did not define yield stress and duplicated yield-strength options.",
    "rawSnippet": "What is the stress at which a specified amount of plastic deformation begins?\nA. Bulk modulus\nB. Ultimate compressive strength\nC. Yield stress\nD. Shear modulus\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-104",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 104,
    "question": "The dimensionless parameter describing deformation",
    "choices": [
      {
        "id": "A",
        "text": "Work"
      },
      {
        "id": "B",
        "text": "Strain"
      },
      {
        "id": "C",
        "text": "Stress"
      },
      {
        "id": "D",
        "text": "Energy"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Strain is a dimensionless measure of deformation.",
    "rawSnippet": "The dimensionless parameter describing deformation\nA. Work\nB. Strain\nC. Stress\nD. Energy\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-105",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 105,
    "question": "Which law states that stress is proportional to strain within the proportional range?",
    "choices": [
      {
        "id": "A",
        "text": "Hooke’s Law"
      },
      {
        "id": "B",
        "text": "Mean Speed Theorem"
      },
      {
        "id": "C",
        "text": "Poisson Ratio"
      },
      {
        "id": "D",
        "text": "Charles’ Theorem"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which law states that stress is proportional to strain within the proportional range?\nA. Hooke’s Law\nB. Mean Speed Theorem\nC. Poisson Ratio\nD. Charles’ Theorem\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-106",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 106,
    "question": "What is the absolute value of the ratio of the transverse strain to the corresponding axial strain in a body subjected to uniaxial stress?",
    "choices": [
      {
        "id": "A",
        "text": "Euler’s Ratio"
      },
      {
        "id": "B",
        "text": "Refractive index"
      },
      {
        "id": "C",
        "text": "Dielectric index"
      },
      {
        "id": "D",
        "text": "Poisson’s Ratio"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "For ordinary tensile specimens, Poisson’s ratio is the negative transverse-to-axial strain ratio.",
    "rawSnippet": "What is the absolute value of the ratio of the transverse strain to the corresponding axial strain in a body subjected to uniaxial stress?\nA. Euler’s Ratio\nB. Refractive index\nC. Dielectric index\nD. Poisson’s Ratio\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-107",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 107,
    "question": "What refers to the heat needed to change the temperature of the substances without changing its phases?",
    "choices": [
      {
        "id": "A",
        "text": "entropy"
      },
      {
        "id": "B",
        "text": "Latent heat"
      },
      {
        "id": "C",
        "text": "Sensible heat"
      },
      {
        "id": "D",
        "text": "Specific heat"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Sensible heat changes temperature without a phase change.",
    "rawSnippet": "What refers to the heat needed to change the temperature of the substances without changing its phases?\nA. entropy\nB. Latent heat\nC. Sensible heat\nD. Specific heat\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-108",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 108,
    "question": "What property of an element is determined by the number of protons in its nucleus?",
    "choices": [
      {
        "id": "A",
        "text": "Atomic weight"
      },
      {
        "id": "B",
        "text": "Atomic number"
      },
      {
        "id": "C",
        "text": "Isotopes"
      },
      {
        "id": "D",
        "text": "Atomic Mass unit"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Atomic number equals the number of protons.",
    "rawSnippet": "What property of an element is determined by the number of protons in its nucleus?\nA. Atomic weight\nB. Atomic number\nC. Isotopes\nD. Atomic Mass unit\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-109",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 109,
    "question": "What refers to a metal combined with one or more other elements?",
    "choices": [
      {
        "id": "A",
        "text": "Alloy"
      },
      {
        "id": "B",
        "text": "Molecule"
      },
      {
        "id": "C",
        "text": "Mixture"
      },
      {
        "id": "D",
        "text": "Compound"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "An alloy combines a metallic base with one or more other elements.",
    "rawSnippet": "What refers to a metal combined with one or more other elements?\nA. Alloy\nB. Molecule\nC. Mixture\nD. Compound\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-110",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 110,
    "question": "Emission of radiations from a substance during illumination by radiations of higher frequency is called",
    "choices": [
      {
        "id": "A",
        "text": "radioluminescence"
      },
      {
        "id": "B",
        "text": "incandescence"
      },
      {
        "id": "C",
        "text": "illuminance"
      },
      {
        "id": "D",
        "text": "fluorescence"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Fluorescence is light emission during excitation, generally at lower photon energy than the absorbed light.",
    "rawSnippet": "Emission of radiations from a substance during illumination by radiations of higher frequency is called\nA. radioluminescence\nB. incandescence\nC. illuminance\nD. fluorescence\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-112",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 112,
    "question": "What is the phenomenon of zero DC electrical resistance below a material-dependent critical temperature?",
    "choices": [
      {
        "id": "A",
        "text": "supercooling"
      },
      {
        "id": "B",
        "text": "superfluidity"
      },
      {
        "id": "C",
        "text": "superconductivity"
      },
      {
        "id": "D",
        "text": "supercharging"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is the phenomenon of zero DC electrical resistance below a material-dependent critical temperature?\nA. supercooling\nB. superfluidity\nC. superconductivity\nD. supercharging\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-113",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 113,
    "question": "The progressive decrease of a property as a result of repeated stress is called",
    "choices": [
      {
        "id": "A",
        "text": "elastic deformation"
      },
      {
        "id": "B",
        "text": "fatigue"
      },
      {
        "id": "C",
        "text": "debility"
      },
      {
        "id": "D",
        "text": "rigidity"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Fatigue damage accumulates under repeated or fluctuating stress.",
    "rawSnippet": "The progressive decrease of a property as a result of repeated stress is called\nA. elastic deformation\nB. fatigue\nC. debility\nD. rigidity\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-114",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 114,
    "question": "Which listed element is nearly insoluble in solid copper?",
    "choices": [
      {
        "id": "A",
        "text": "Lead"
      },
      {
        "id": "B",
        "text": "Zinc"
      },
      {
        "id": "C",
        "text": "Nickel"
      },
      {
        "id": "D",
        "text": "Aluminum"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Removed brass (an alloy) and neon (a gas) as misleading alternatives.",
    "rawSnippet": "Which listed element is nearly insoluble in solid copper?\nA. Lead\nB. Zinc\nC. Nickel\nD. Aluminum\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-115",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 115,
    "question": "Which property of weathering steels can be improved by small additions of copper?",
    "choices": [
      {
        "id": "A",
        "text": "Electrical insulation"
      },
      {
        "id": "B",
        "text": "Optical transparency"
      },
      {
        "id": "C",
        "text": "Rubber elasticity"
      },
      {
        "id": "D",
        "text": "Atmospheric corrosion resistance"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which property of weathering steels can be improved by small additions of copper?\nA. Electrical insulation\nB. Optical transparency\nC. Rubber elasticity\nD. Atmospheric corrosion resistance\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-116",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 116,
    "question": "Which listed element has the lowest normal boiling point at one atmosphere?",
    "choices": [
      {
        "id": "A",
        "text": "nitrogen"
      },
      {
        "id": "B",
        "text": "hydrogen"
      },
      {
        "id": "C",
        "text": "helium"
      },
      {
        "id": "D",
        "text": "Oxygen"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which listed element has the lowest normal boiling point at one atmosphere?\nA. nitrogen\nB. hydrogen\nC. helium\nD. Oxygen\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-117",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 117,
    "question": "Which element has atomic number 21, between calcium (20) and titanium (22)?",
    "choices": [
      {
        "id": "A",
        "text": "Silicon"
      },
      {
        "id": "B",
        "text": "Scandium"
      },
      {
        "id": "C",
        "text": "Molybdenum"
      },
      {
        "id": "D",
        "text": "Potassium"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which element has atomic number 21, between calcium (20) and titanium (22)?\nA. Silicon\nB. Scandium\nC. Molybdenum\nD. Potassium\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-118",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 118,
    "question": "Which process is used in the Wohlwill method to refine gold to high purity?",
    "choices": [
      {
        "id": "A",
        "text": "Electrolysis"
      },
      {
        "id": "B",
        "text": "Bessemerization"
      },
      {
        "id": "C",
        "text": "Oxidation"
      },
      {
        "id": "D",
        "text": "Distillation"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Specified a named process instead of asserting an absolute “best method”.",
    "rawSnippet": "Which process is used in the Wohlwill method to refine gold to high purity?\nA. Electrolysis\nB. Bessemerization\nC. Oxidation\nD. Distillation\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-119",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 119,
    "question": "Up to which limit is stress directly proportional to strain under Hooke’s law?",
    "choices": [
      {
        "id": "A",
        "text": "Plastic limit"
      },
      {
        "id": "B",
        "text": "Buckling limit"
      },
      {
        "id": "C",
        "text": "Ultimate strength"
      },
      {
        "id": "D",
        "text": "Proportional limit"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Corrected elastic limit to proportional limit; elastic behavior need not always be linear.",
    "rawSnippet": "Up to which limit is stress directly proportional to strain under Hooke’s law?\nA. Plastic limit\nB. Buckling limit\nC. Ultimate strength\nD. Proportional limit\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-120",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 120,
    "question": "The ore from which iron is obtained is",
    "choices": [
      {
        "id": "A",
        "text": "Sphalerite"
      },
      {
        "id": "B",
        "text": "bauxite"
      },
      {
        "id": "C",
        "text": "taconite"
      },
      {
        "id": "D",
        "text": "chalcocite"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Taconite is a low-grade iron-bearing rock processed as an iron resource.",
    "rawSnippet": "The ore from which iron is obtained is\nA. Sphalerite\nB. bauxite\nC. taconite\nD. chalcocite\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-121",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 121,
    "question": "Aluminum can be added to the steel to produce",
    "choices": [
      {
        "id": "A",
        "text": "first steel"
      },
      {
        "id": "B",
        "text": "killed steel"
      },
      {
        "id": "C",
        "text": "dead steel"
      },
      {
        "id": "D",
        "text": "live steel"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Aluminum is a strong deoxidizer used in producing killed steel.",
    "rawSnippet": "Aluminum can be added to the steel to produce\nA. first steel\nB. killed steel\nC. dead steel\nD. live steel\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-122",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 122,
    "question": "Which listed metal is normally brittle rather than ductile at room temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Bismuth"
      },
      {
        "id": "B",
        "text": "Aluminum"
      },
      {
        "id": "C",
        "text": "Copper"
      },
      {
        "id": "D",
        "text": "Mild steel"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Lead is ductile. Replaced the incorrect keyed option with brittle bismuth.",
    "rawSnippet": "Which listed metal is normally brittle rather than ductile at room temperature?\nA. Bismuth\nB. Aluminum\nC. Copper\nD. Mild steel\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-123",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 123,
    "question": "The most abundant element in the universe is",
    "choices": [
      {
        "id": "A",
        "text": "O"
      },
      {
        "id": "B",
        "text": "He"
      },
      {
        "id": "C",
        "text": "C"
      },
      {
        "id": "D",
        "text": "H"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Hydrogen is the most abundant element in the universe.",
    "rawSnippet": "The most abundant element in the universe is\nA. O\nB. He\nC. C\nD. H\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-124",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 124,
    "question": "At room temperature, which listed material in its graphite form has the highest electrical resistivity?",
    "choices": [
      {
        "id": "A",
        "text": "Steel"
      },
      {
        "id": "B",
        "text": "Aluminum"
      },
      {
        "id": "C",
        "text": "Carbon"
      },
      {
        "id": "D",
        "text": "Silver"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Specified graphite; the electrical properties of carbon depend on its allotrope.",
    "rawSnippet": "At room temperature, which listed material in its graphite form has the highest electrical resistivity?\nA. Steel\nB. Aluminum\nC. Carbon\nD. Silver\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-125",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 125,
    "question": "What is time-dependent plastic deformation under sustained stress, especially at high temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Twinning"
      },
      {
        "id": "B",
        "text": "Creep"
      },
      {
        "id": "C",
        "text": "Elastic recovery"
      },
      {
        "id": "D",
        "text": "Melting"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is time-dependent plastic deformation under sustained stress, especially at high temperature?\nA. Twinning\nB. Creep\nC. Elastic recovery\nD. Melting\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-126",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 126,
    "question": "Which element is present in all organic compounds?",
    "choices": [
      {
        "id": "A",
        "text": "carbon"
      },
      {
        "id": "B",
        "text": "nitrogen"
      },
      {
        "id": "C",
        "text": "phosphorous"
      },
      {
        "id": "D",
        "text": "Oxygen"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Carbon is the defining element of organic compounds.",
    "rawSnippet": "Which element is present in all organic compounds?\nA. carbon\nB. nitrogen\nC. phosphorous\nD. Oxygen\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-127",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 127,
    "question": "What is melting under increased pressure followed by refreezing when the pressure is reduced, as can occur in ice?",
    "choices": [
      {
        "id": "A",
        "text": "Sublimation"
      },
      {
        "id": "B",
        "text": "Condensation"
      },
      {
        "id": "C",
        "text": "Deposition"
      },
      {
        "id": "D",
        "text": "Regelation"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "What is melting under increased pressure followed by refreezing when the pressure is reduced, as can occur in ice?\nA. Sublimation\nB. Condensation\nC. Deposition\nD. Regelation\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-128",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 128,
    "question": "In Galvanized iron, a lining on iron is provided with",
    "choices": [
      {
        "id": "A",
        "text": "Al"
      },
      {
        "id": "B",
        "text": "Sn"
      },
      {
        "id": "C",
        "text": "Zn"
      },
      {
        "id": "D",
        "text": "Cu"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Galvanized iron or steel is coated with zinc.",
    "rawSnippet": "In Galvanized iron, a lining on iron is provided with\nA. Al\nB. Sn\nC. Zn\nD. Cu\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-129",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 129,
    "question": "What are elements that have properties intermediate between metals and non-metals?",
    "choices": [
      {
        "id": "A",
        "text": "Solids"
      },
      {
        "id": "B",
        "text": "Metalloids"
      },
      {
        "id": "C",
        "text": "Liquids"
      },
      {
        "id": "D",
        "text": "Gases"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Metalloids show a combination of metallic and nonmetallic behavior.",
    "rawSnippet": "What are elements that have properties intermediate between metals and non-metals?\nA. Solids\nB. Metalloids\nC. Liquids\nD. Gases\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-130",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 130,
    "question": "The ability of the surface of material to reflect light is called",
    "choices": [
      {
        "id": "A",
        "text": "lustre"
      },
      {
        "id": "B",
        "text": "ductility"
      },
      {
        "id": "C",
        "text": "Creep"
      },
      {
        "id": "D",
        "text": "malleability"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Luster describes reflected light from a surface.",
    "rawSnippet": "The ability of the surface of material to reflect light is called\nA. lustre\nB. ductility\nC. Creep\nD. malleability\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-131",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 131,
    "question": "What is the manual mixing and working of clay with water to prepare it for brick molding called?",
    "choices": [
      {
        "id": "A",
        "text": "moulding"
      },
      {
        "id": "B",
        "text": "pugging"
      },
      {
        "id": "C",
        "text": "drying"
      },
      {
        "id": "D",
        "text": "kneading"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Specified manual kneading; pugging refers to machine mixing in a pugmill.",
    "rawSnippet": "What is the manual mixing and working of clay with water to prepare it for brick molding called?\nA. moulding\nB. pugging\nC. drying\nD. kneading\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-132",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 132,
    "question": "Which pure metal has the highest electrical conductivity near room temperature?",
    "choices": [
      {
        "id": "A",
        "text": "aluminum"
      },
      {
        "id": "B",
        "text": "Gold"
      },
      {
        "id": "C",
        "text": "silver"
      },
      {
        "id": "D",
        "text": "copper"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which pure metal has the highest electrical conductivity near room temperature?\nA. aluminum\nB. Gold\nC. silver\nD. copper\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-133",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 133,
    "question": "Which statement about deformation twinning is correct?",
    "choices": [
      {
        "id": "A",
        "text": "It cannot occur under impact loading."
      },
      {
        "id": "B",
        "text": "It is common in hexagonal close-packed metals."
      },
      {
        "id": "C",
        "text": "It never changes crystal orientation."
      },
      {
        "id": "D",
        "text": "It is a liquid-state transformation."
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which statement about deformation twinning is correct?\nA. It cannot occur under impact loading.\nB. It is common in hexagonal close-packed metals.\nC. It never changes crystal orientation.\nD. It is a liquid-state transformation.\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-134",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 134,
    "question": "What refers to ions that are NOT involved in the overall reactions?",
    "choices": [
      {
        "id": "A",
        "text": "Spectator ions"
      },
      {
        "id": "B",
        "text": "Extra ion"
      },
      {
        "id": "C",
        "text": "Special ions"
      },
      {
        "id": "D",
        "text": "Guest ions"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Spectator ions do not participate in the net ionic reaction.",
    "rawSnippet": "What refers to ions that are NOT involved in the overall reactions?\nA. Spectator ions\nB. Extra ion\nC. Special ions\nD. Guest ions\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-135",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 135,
    "question": "Using E = 64 GPa for borosilicate glass, 69 GPa for aluminum, 110 GPa for copper and 200 GPa for steel, which has the lowest Young’s modulus?",
    "choices": [
      {
        "id": "A",
        "text": "Aluminum"
      },
      {
        "id": "B",
        "text": "Copper"
      },
      {
        "id": "C",
        "text": "Steel"
      },
      {
        "id": "D",
        "text": "Glass"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Glass and aluminum moduli can overlap; provided explicit values for a unique comparison.",
    "rawSnippet": "Using E = 64 GPa for borosilicate glass, 69 GPa for aluminum, 110 GPa for copper and 200 GPa for steel, which has the lowest Young’s modulus?\nA. Aluminum\nB. Copper\nC. Steel\nD. Glass\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-136",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 136,
    "question": "Materials in this group are composed of one or more metallic elements such as iron, aluminum, copper, titanium, gold, and nickel. What is this group called?",
    "choices": [
      {
        "id": "A",
        "text": "Solids"
      },
      {
        "id": "B",
        "text": "Crystals"
      },
      {
        "id": "C",
        "text": "Metals"
      },
      {
        "id": "D",
        "text": "Metalloid"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Metals contain metallic elements and exhibit metallic bonding.",
    "rawSnippet": "Materials in this group are composed of one or more metallic elements such as iron, aluminum, copper, titanium, gold, and nickel. What is this group called?\nA. Solids\nB. Crystals\nC. Metals\nD. Metalloid\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-137",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 137,
    "question": "What are bodies that emit their own light called?",
    "choices": [
      {
        "id": "A",
        "text": "Opaque"
      },
      {
        "id": "B",
        "text": "Luminous"
      },
      {
        "id": "C",
        "text": "Photovoltaic"
      },
      {
        "id": "D",
        "text": "Illuminated"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Corrected “luminated” to luminous.",
    "rawSnippet": "What are bodies that emit their own light called?\nA. Opaque\nB. Luminous\nC. Photovoltaic\nD. Illuminated\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-138",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 138,
    "question": "In the periodic table of elements, which ONE of the following is light metal?",
    "choices": [
      {
        "id": "A",
        "text": "Potassium"
      },
      {
        "id": "B",
        "text": "Mercury"
      },
      {
        "id": "C",
        "text": "Silver"
      },
      {
        "id": "D",
        "text": "Gold"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Potassium is a low-density alkali metal.",
    "rawSnippet": "In the periodic table of elements, which ONE of the following is light metal?\nA. Potassium\nB. Mercury\nC. Silver\nD. Gold\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-139",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 139,
    "question": "Through which states of matter can heat be transferred by conduction?",
    "choices": [
      {
        "id": "A",
        "text": "Solids only"
      },
      {
        "id": "B",
        "text": "Liquids only"
      },
      {
        "id": "C",
        "text": "Gases only"
      },
      {
        "id": "D",
        "text": "Solids, liquids and gases"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Through which states of matter can heat be transferred by conduction?\nA. Solids only\nB. Liquids only\nC. Gases only\nD. Solids, liquids and gases\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-140",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 140,
    "question": "Which element’s name derives from the Greek word for “strange”?",
    "choices": [
      {
        "id": "A",
        "text": "Argon"
      },
      {
        "id": "B",
        "text": "Nitrogen"
      },
      {
        "id": "C",
        "text": "Xenon"
      },
      {
        "id": "D",
        "text": "Neon"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Clarified wording and corrected the source.",
    "rawSnippet": "Which element’s name derives from the Greek word for “strange”?\nA. Argon\nB. Nitrogen\nC. Xenon\nD. Neon\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-141",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 141,
    "question": "The hardest form of carbon is",
    "choices": [
      {
        "id": "A",
        "text": "Coke"
      },
      {
        "id": "B",
        "text": "Diamond"
      },
      {
        "id": "C",
        "text": "Charcoal"
      },
      {
        "id": "D",
        "text": "Graphite"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Corrected the truncated answer “iamond”.",
    "rawSnippet": "The hardest form of carbon is\nA. Coke\nB. Diamond\nC. Charcoal\nD. Graphite\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-142",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 142,
    "question": "The deformation of a bar per unit length in the direction of force is known as",
    "choices": [
      {
        "id": "A",
        "text": "Linear strain"
      },
      {
        "id": "B",
        "text": "lateral strain"
      },
      {
        "id": "C",
        "text": "shear strain"
      },
      {
        "id": "D",
        "text": "volumetric strain"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Axial or linear strain is change in length divided by original length.",
    "rawSnippet": "The deformation of a bar per unit length in the direction of force is known as\nA. Linear strain\nB. lateral strain\nC. shear strain\nD. volumetric strain\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-143",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 143,
    "question": "Which listed element is widely used as a deoxidizer and solid-solution-strengthening addition in steel?",
    "choices": [
      {
        "id": "A",
        "text": "Sodium"
      },
      {
        "id": "B",
        "text": "Silver"
      },
      {
        "id": "C",
        "text": "Boron"
      },
      {
        "id": "D",
        "text": "Silicon"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Replaced an unqualified hardness ranking with the established role of silicon.",
    "rawSnippet": "Which listed element is widely used as a deoxidizer and solid-solution-strengthening addition in steel?\nA. Sodium\nB. Silver\nC. Boron\nD. Silicon\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-144",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 144,
    "question": "The simplest and most common grades of steel belong to the group of",
    "choices": [
      {
        "id": "A",
        "text": "neon steels"
      },
      {
        "id": "B",
        "text": "Boron steels"
      },
      {
        "id": "C",
        "text": "Carbon steels"
      },
      {
        "id": "D",
        "text": "krypton steels"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Plain-carbon steels are a broad, commonly used group of steels.",
    "rawSnippet": "The simplest and most common grades of steel belong to the group of\nA. neon steels\nB. Boron steels\nC. Carbon steels\nD. krypton steels\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-145",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 145,
    "question": "What is the process of putting back the lost electrons to convert ion back to a metal?",
    "choices": [
      {
        "id": "A",
        "text": "Corrosion"
      },
      {
        "id": "B",
        "text": "Reduction"
      },
      {
        "id": "C",
        "text": "Ionization"
      },
      {
        "id": "D",
        "text": "Oxidation"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Reduction is gain of electrons.",
    "rawSnippet": "What is the process of putting back the lost electrons to convert ion back to a metal?\nA. Corrosion\nB. Reduction\nC. Ionization\nD. Oxidation\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-146",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 146,
    "question": "How many valence electrons do silicon and germanium each have in their neutral ground-state atoms?",
    "choices": [
      {
        "id": "A",
        "text": "4"
      },
      {
        "id": "B",
        "text": "3"
      },
      {
        "id": "C",
        "text": "5"
      },
      {
        "id": "D",
        "text": "Unity"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Metalloids as a whole do not all have valence four.",
    "rawSnippet": "How many valence electrons do silicon and germanium each have in their neutral ground-state atoms?\nA. 4\nB. 3\nC. 5\nD. Unity\nAnswer: A"
  },
  {
    "id": "engineering-materials-quiz-147",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 147,
    "question": "What is the color of copper(II) oxide, CuO?",
    "choices": [
      {
        "id": "A",
        "text": "Brown"
      },
      {
        "id": "B",
        "text": "Light gray"
      },
      {
        "id": "C",
        "text": "Light orange"
      },
      {
        "id": "D",
        "text": "Black"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "CuO is black; copper exposed to air can show brown oxides or a later green patina, so exposure alone is not a unique color condition.",
    "rawSnippet": "What is the color of copper(II) oxide, CuO?\nA. Brown\nB. Light gray\nC. Light orange\nD. Black\nAnswer: D"
  },
  {
    "id": "engineering-materials-quiz-148",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 148,
    "question": "The most malleable metal is",
    "choices": [
      {
        "id": "A",
        "text": "Silver"
      },
      {
        "id": "B",
        "text": "Iron"
      },
      {
        "id": "C",
        "text": "Gold"
      },
      {
        "id": "D",
        "text": "Platinum"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Gold can be beaten into extremely thin sheets and is highly malleable.",
    "rawSnippet": "The most malleable metal is\nA. Silver\nB. Iron\nC. Gold\nD. Platinum\nAnswer: C"
  },
  {
    "id": "engineering-materials-quiz-149",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 149,
    "question": "Which metal gives the Copper Age (Chalcolithic) its name?",
    "choices": [
      {
        "id": "A",
        "text": "Iron"
      },
      {
        "id": "B",
        "text": "Copper"
      },
      {
        "id": "C",
        "text": "Gold"
      },
      {
        "id": "D",
        "text": "Bronze"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Avoided the uncertain claim that one metal was universally the first used by humans.",
    "rawSnippet": "Which metal gives the Copper Age (Chalcolithic) its name?\nA. Iron\nB. Copper\nC. Gold\nD. Bronze\nAnswer: B"
  },
  {
    "id": "engineering-materials-quiz-150",
    "subject": "Engineering Materials",
    "sourceFileName": "ESAS - Engineering Materials.quiz",
    "sourceFileId": "engineering-materials-upload-quiz-20261104",
    "questionNumber": 150,
    "question": "What is another term for modulus of elasticity?",
    "choices": [
      {
        "id": "A",
        "text": "Young’s modulus"
      },
      {
        "id": "B",
        "text": "Bulk modulus"
      },
      {
        "id": "C",
        "text": "Shear strain"
      },
      {
        "id": "D",
        "text": "constant of elongation"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Young’s modulus is also called the modulus of elasticity in uniaxial loading.",
    "rawSnippet": "What is another term for modulus of elasticity?\nA. Young’s modulus\nB. Bulk modulus\nC. Shear strain\nD. constant of elongation\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-001",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 1,
    "question": "Which statement about cold working is false?",
    "choices": [
      {
        "id": "A",
        "text": "Cold working plastically deforms a metal below its recrystallization temperature."
      },
      {
        "id": "B",
        "text": "Annealing can remove many cold-work defects."
      },
      {
        "id": "C",
        "text": "Annealing can reduce metal hardness."
      },
      {
        "id": "D",
        "text": "The percentage of cold work cannot be determined from a change in area or thickness."
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Percentage cold work can be calculated from the reduction in cross-sectional area or thickness under appropriate assumptions.",
    "rawSnippet": "Which statement about cold working is false?\nA. Cold working plastically deforms a metal below its recrystallization temperature.\nB. Annealing can remove many cold-work defects.\nC. Annealing can reduce metal hardness.\nD. The percentage of cold work cannot be determined from a change in area or thickness.\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-002",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 2,
    "question": "Why can a vinyl automobile interior crack after prolonged exposure to sunlight?",
    "choices": [
      {
        "id": "A",
        "text": "Photo-oxidation from light and oxygen"
      },
      {
        "id": "B",
        "text": "All three listed factors"
      },
      {
        "id": "C",
        "text": "Loss of plasticizers"
      },
      {
        "id": "D",
        "text": "Repeated thermal expansion and contraction"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Plasticizer loss, thermal cycling and photo-oxidative aging can all contribute.",
    "rawSnippet": "Why can a vinyl automobile interior crack after prolonged exposure to sunlight?\nA. Photo-oxidation from light and oxygen\nB. All three listed factors\nC. Loss of plasticizers\nD. Repeated thermal expansion and contraction\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-003",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 3,
    "question": "Which statement about cold-work strain hardening is false?",
    "choices": [
      {
        "id": "A",
        "text": "It decreases the yield strength of a strain-hardening metal."
      },
      {
        "id": "B",
        "text": "It can increase hardness and strength."
      },
      {
        "id": "C",
        "text": "It generally reduces ductility."
      },
      {
        "id": "D",
        "text": "It increases dislocation density and stored strain energy."
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Cold work generally raises yield strength through strain hardening.",
    "rawSnippet": "Which statement about cold-work strain hardening is false?\nA. It decreases the yield strength of a strain-hardening metal.\nB. It can increase hardness and strength.\nC. It generally reduces ductility.\nD. It increases dislocation density and stored strain energy.\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-004",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 4,
    "question": "Which statement about hot working is false?",
    "choices": [
      {
        "id": "A",
        "text": "It involves deformation with recovery or recrystallization."
      },
      {
        "id": "B",
        "text": "It can reduce porosity in a suitable workpiece."
      },
      {
        "id": "C",
        "text": "Controlled hot working can refine grain structure."
      },
      {
        "id": "D",
        "text": "It normally produces large retained strain hardening comparable to cold working."
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Recovery and recrystallization during hot working limit retained strain hardening.",
    "rawSnippet": "Which statement about hot working is false?\nA. It involves deformation with recovery or recrystallization.\nB. It can reduce porosity in a suitable workpiece.\nC. Controlled hot working can refine grain structure.\nD. It normally produces large retained strain hardening comparable to cold working.\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-005",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 5,
    "question": "What is the increase in resistance to further plastic deformation as dislocations accumulate during deformation called?",
    "choices": [
      {
        "id": "A",
        "text": "Crowding"
      },
      {
        "id": "B",
        "text": "Strain hardening"
      },
      {
        "id": "C",
        "text": "Twinning"
      },
      {
        "id": "D",
        "text": "Cooling"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Dislocation interactions make subsequent slip more difficult.",
    "rawSnippet": "What is the increase in resistance to further plastic deformation as dislocations accumulate during deformation called?\nA. Crowding\nB. Strain hardening\nC. Twinning\nD. Cooling\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-007",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 7,
    "question": "Which property of suitable steels can copper additions improve?",
    "choices": [
      {
        "id": "A",
        "text": "Atmospheric corrosion resistance"
      },
      {
        "id": "B",
        "text": "Electrical insulation"
      },
      {
        "id": "C",
        "text": "Hardness only"
      },
      {
        "id": "D",
        "text": "Oxidation rate"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Copper can improve the atmospheric corrosion performance of weathering steels.",
    "rawSnippet": "Which property of suitable steels can copper additions improve?\nA. Atmospheric corrosion resistance\nB. Electrical insulation\nC. Hardness only\nD. Oxidation rate\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-008",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 8,
    "question": "Which statement correctly describes high-strength low-alloy steels?",
    "choices": [
      {
        "id": "A",
        "text": "They cannot be heat treated or thermomechanically processed."
      },
      {
        "id": "B",
        "text": "Small alloy additions and controlled processing can raise strength above ordinary low-carbon steels."
      },
      {
        "id": "C",
        "text": "They are always weaker than ordinary low-carbon steel."
      },
      {
        "id": "D",
        "text": "They contain no alloying elements."
      }
    ],
    "correctChoiceId": "B",
    "explanation": "HSLA steels use alloying and processing to obtain higher strength and useful toughness.",
    "rawSnippet": "Which statement correctly describes high-strength low-alloy steels?\nA. They cannot be heat treated or thermomechanically processed.\nB. Small alloy additions and controlled processing can raise strength above ordinary low-carbon steels.\nC. They are always weaker than ordinary low-carbon steel.\nD. They contain no alloying elements.\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-009",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 9,
    "question": "Which changes are characteristic of cold working?",
    "choices": [
      {
        "id": "A",
        "text": "Elongated grains, increased dislocation density and increased stored strain energy"
      },
      {
        "id": "B",
        "text": "Elongated grains, decreased dislocation density and decreased stored energy"
      },
      {
        "id": "C",
        "text": "Elongated grains, decreased dislocation density and increased stored energy"
      },
      {
        "id": "D",
        "text": "Shortened grains, decreased dislocation density and decreased stored energy"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Cold deformation elongates grains and increases defect density and stored strain energy.",
    "rawSnippet": "Which changes are characteristic of cold working?\nA. Elongated grains, increased dislocation density and increased stored strain energy\nB. Elongated grains, decreased dislocation density and decreased stored energy\nC. Elongated grains, decreased dislocation density and increased stored energy\nD. Shortened grains, decreased dislocation density and decreased stored energy\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-010",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 10,
    "question": "What field concerns the extraction, production and processing of metals?",
    "choices": [
      {
        "id": "A",
        "text": "Geology"
      },
      {
        "id": "B",
        "text": "Optics"
      },
      {
        "id": "C",
        "text": "Meteorology"
      },
      {
        "id": "D",
        "text": "Metallurgy"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Metallurgy studies and processes metals.",
    "rawSnippet": "What field concerns the extraction, production and processing of metals?\nA. Geology\nB. Optics\nC. Meteorology\nD. Metallurgy\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-011",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 11,
    "question": "Which listed metal has low density?",
    "choices": [
      {
        "id": "A",
        "text": "Potassium"
      },
      {
        "id": "B",
        "text": "Silver"
      },
      {
        "id": "C",
        "text": "Gold"
      },
      {
        "id": "D",
        "text": "Mercury"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Potassium has much lower density than the other listed metals.",
    "rawSnippet": "Which listed metal has low density?\nA. Potassium\nB. Silver\nC. Gold\nD. Mercury\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-012",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 12,
    "question": "Which listed metal is widely used for lightweight engineering structures?",
    "choices": [
      {
        "id": "A",
        "text": "Steel"
      },
      {
        "id": "B",
        "text": "Aluminum"
      },
      {
        "id": "C",
        "text": "Silver"
      },
      {
        "id": "D",
        "text": "Copper"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Aluminum has low density and is widely used in lightweight structures.",
    "rawSnippet": "Which listed metal is widely used for lightweight engineering structures?\nA. Steel\nB. Aluminum\nC. Silver\nD. Copper\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-013",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 13,
    "question": "Brass primarily consists of which elements?",
    "choices": [
      {
        "id": "A",
        "text": "Aluminum and iron"
      },
      {
        "id": "B",
        "text": "Zinc and nickel"
      },
      {
        "id": "C",
        "text": "Copper and aluminum"
      },
      {
        "id": "D",
        "text": "Copper and zinc"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Brass is a copper-zinc alloy.",
    "rawSnippet": "Brass primarily consists of which elements?\nA. Aluminum and iron\nB. Zinc and nickel\nC. Copper and aluminum\nD. Copper and zinc\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-014",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 14,
    "question": "What carbon-rich fuel and reducing agent is produced by heating coal in the near absence of air?",
    "choices": [
      {
        "id": "A",
        "text": "Coke"
      },
      {
        "id": "B",
        "text": "Diamond"
      },
      {
        "id": "C",
        "text": "Hematite"
      },
      {
        "id": "D",
        "text": "Tuyere"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Coke is produced by coal carbonization.",
    "rawSnippet": "What carbon-rich fuel and reducing agent is produced by heating coal in the near absence of air?\nA. Coke\nB. Diamond\nC. Hematite\nD. Tuyere\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-016",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 16,
    "question": "What water property describes its capacity to neutralize added acid?",
    "choices": [
      {
        "id": "A",
        "text": "Turbidity"
      },
      {
        "id": "B",
        "text": "Solubility"
      },
      {
        "id": "C",
        "text": "Alkalinity"
      },
      {
        "id": "D",
        "text": "Acidity"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Alkalinity is acid-neutralizing capacity, not the total amount of negative ions.",
    "rawSnippet": "What water property describes its capacity to neutralize added acid?\nA. Turbidity\nB. Solubility\nC. Alkalinity\nD. Acidity\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-017",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 17,
    "question": "Which case-hardening process increases carbon content near the surface of steel?",
    "choices": [
      {
        "id": "A",
        "text": "Martempering"
      },
      {
        "id": "B",
        "text": "Carburizing"
      },
      {
        "id": "C",
        "text": "Annealing"
      },
      {
        "id": "D",
        "text": "Normalizing"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Carburizing diffuses carbon into the surface.",
    "rawSnippet": "Which case-hardening process increases carbon content near the surface of steel?\nA. Martempering\nB. Carburizing\nC. Annealing\nD. Normalizing\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-018",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 18,
    "question": "What treatment reheats hardened steel below the lower critical temperature to reduce brittleness?",
    "choices": [
      {
        "id": "A",
        "text": "Normalizing"
      },
      {
        "id": "B",
        "text": "Spheroidizing"
      },
      {
        "id": "C",
        "text": "Carburizing"
      },
      {
        "id": "D",
        "text": "Tempering"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Tempering modifies quenched martensite and reduces brittleness.",
    "rawSnippet": "What treatment reheats hardened steel below the lower critical temperature to reduce brittleness?\nA. Normalizing\nB. Spheroidizing\nC. Carburizing\nD. Tempering\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-019",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 19,
    "question": "What harmful effect can iron-sulfide-rich constituents have in steel during hot working?",
    "choices": [
      {
        "id": "A",
        "text": "Guaranteed higher toughness"
      },
      {
        "id": "B",
        "text": "Complete immunity to oxidation"
      },
      {
        "id": "C",
        "text": "Hot shortness and brittleness"
      },
      {
        "id": "D",
        "text": "Improved atmospheric corrosion resistance"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Low-melting sulfur-rich constituents can promote hot-working cracks.",
    "rawSnippet": "What harmful effect can iron-sulfide-rich constituents have in steel during hot working?\nA. Guaranteed higher toughness\nB. Complete immunity to oxidation\nC. Hot shortness and brittleness\nD. Improved atmospheric corrosion resistance\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-020",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 20,
    "question": "Which treatment diffuses nitrogen into steel to harden its surface without a subsequent hardening quench?",
    "choices": [
      {
        "id": "A",
        "text": "Tempering"
      },
      {
        "id": "B",
        "text": "Normalizing"
      },
      {
        "id": "C",
        "text": "Carburizing"
      },
      {
        "id": "D",
        "text": "Nitriding"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Nitriding forms hard nitrides at the surface.",
    "rawSnippet": "Which treatment diffuses nitrogen into steel to harden its surface without a subsequent hardening quench?\nA. Tempering\nB. Normalizing\nC. Carburizing\nD. Nitriding\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-021",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 21,
    "question": "What is the percentage mass gain of a polymer after specified water immersion called?",
    "choices": [
      {
        "id": "A",
        "text": "Thermal conductivity"
      },
      {
        "id": "B",
        "text": "Dielectric strength"
      },
      {
        "id": "C",
        "text": "Electrical resistivity"
      },
      {
        "id": "D",
        "text": "Water absorption"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Water absorption is measured under specified conditioning, time and temperature.",
    "rawSnippet": "What is the percentage mass gain of a polymer after specified water immersion called?\nA. Thermal conductivity\nB. Dielectric strength\nC. Electrical resistivity\nD. Water absorption\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-022",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 22,
    "question": "Which listed class generally contains the best heat conductors?",
    "choices": [
      {
        "id": "A",
        "text": "Gases"
      },
      {
        "id": "B",
        "text": "Liquids"
      },
      {
        "id": "C",
        "text": "Woods"
      },
      {
        "id": "D",
        "text": "Metals"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Free electrons give many metals high thermal conductivity.",
    "rawSnippet": "Which listed class generally contains the best heat conductors?\nA. Gases\nB. Liquids\nC. Woods\nD. Metals\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-023",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 23,
    "question": "Which mechanisms and behaviors can occur during high-temperature creep? I. Dislocation climb assisted by diffusion. II. Time-dependent deformation below the short-time yield stress. III. Grain-boundary sliding.",
    "choices": [
      {
        "id": "A",
        "text": "II only"
      },
      {
        "id": "B",
        "text": "I and III only"
      },
      {
        "id": "C",
        "text": "I, II and III"
      },
      {
        "id": "D",
        "text": "I only"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Diffusion, dislocation climb and grain-boundary sliding can contribute to creep; creep can occur below short-time yield stress.",
    "rawSnippet": "Which mechanisms and behaviors can occur during high-temperature creep? I. Dislocation climb assisted by diffusion. II. Time-dependent deformation below the short-time yield stress. III. Grain-boundary sliding.\nA. II only\nB. I and III only\nC. I, II and III\nD. I only\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-024",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 24,
    "question": "Which listed substance reacts vigorously with water in its elemental form?",
    "choices": [
      {
        "id": "A",
        "text": "Carbon dioxide"
      },
      {
        "id": "B",
        "text": "Hydrochloric acid"
      },
      {
        "id": "C",
        "text": "Sodium"
      },
      {
        "id": "D",
        "text": "Helium"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Elemental sodium is a reactive alkali metal.",
    "rawSnippet": "Which listed substance reacts vigorously with water in its elemental form?\nA. Carbon dioxide\nB. Hydrochloric acid\nC. Sodium\nD. Helium\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-025",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 25,
    "question": "At which temperature does a ferromagnet become paramagnetic?",
    "choices": [
      {
        "id": "A",
        "text": "Curie point"
      },
      {
        "id": "B",
        "text": "Melting point"
      },
      {
        "id": "C",
        "text": "Thermal conductivity"
      },
      {
        "id": "D",
        "text": "Thermal expansion"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "The Curie point marks loss of spontaneous ferromagnetic order.",
    "rawSnippet": "At which temperature does a ferromagnet become paramagnetic?\nA. Curie point\nB. Melting point\nC. Thermal conductivity\nD. Thermal expansion\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-026",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 26,
    "question": "What is the temperature of the solid-liquid phase transition at a specified pressure called?",
    "choices": [
      {
        "id": "A",
        "text": "Melting point"
      },
      {
        "id": "B",
        "text": "Curie point"
      },
      {
        "id": "C",
        "text": "Refractive index"
      },
      {
        "id": "D",
        "text": "Specific heat"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "A pure substance melts or freezes at its equilibrium melting temperature for a given pressure.",
    "rawSnippet": "What is the temperature of the solid-liquid phase transition at a specified pressure called?\nA. Melting point\nB. Curie point\nC. Refractive index\nD. Specific heat\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-027",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 27,
    "question": "What is slow time-dependent deformation under sustained stress, especially at elevated temperature?",
    "choices": [
      {
        "id": "A",
        "text": "Twinning only"
      },
      {
        "id": "B",
        "text": "Creep"
      },
      {
        "id": "C",
        "text": "Elastic recovery"
      },
      {
        "id": "D",
        "text": "Slip only"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Creep is time-dependent strain under sustained stress.",
    "rawSnippet": "What is slow time-dependent deformation under sustained stress, especially at elevated temperature?\nA. Twinning only\nB. Creep\nC. Elastic recovery\nD. Slip only\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-028",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 28,
    "question": "Which listed element has very low solid solubility in copper?",
    "choices": [
      {
        "id": "A",
        "text": "Nickel"
      },
      {
        "id": "B",
        "text": "Aluminum"
      },
      {
        "id": "C",
        "text": "Zinc"
      },
      {
        "id": "D",
        "text": "Lead"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Lead is almost insoluble in solid copper and can form a separate phase.",
    "rawSnippet": "Which listed element has very low solid solubility in copper?\nA. Nickel\nB. Aluminum\nC. Zinc\nD. Lead\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-029",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 29,
    "question": "What property describes the ability to be drawn into wire?",
    "choices": [
      {
        "id": "A",
        "text": "Ductility"
      },
      {
        "id": "B",
        "text": "Tensile strength"
      },
      {
        "id": "C",
        "text": "Fatigue limit"
      },
      {
        "id": "D",
        "text": "Impact strength"
      }
    ],
    "correctChoiceId": "A",
    "explanation": "Ductility is the ability to sustain tensile plastic deformation.",
    "rawSnippet": "What property describes the ability to be drawn into wire?\nA. Ductility\nB. Tensile strength\nC. Fatigue limit\nD. Impact strength\nAnswer: A"
  },
  {
    "id": "engineering-materials-discussion-030",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 30,
    "question": "Which impurity can cause red shortness in steel?",
    "choices": [
      {
        "id": "A",
        "text": "Silicon"
      },
      {
        "id": "B",
        "text": "Manganese"
      },
      {
        "id": "C",
        "text": "Phosphorus"
      },
      {
        "id": "D",
        "text": "Sulfur"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Sulfur-rich low-melting constituents can cause hot shortness.",
    "rawSnippet": "Which impurity can cause red shortness in steel?\nA. Silicon\nB. Manganese\nC. Phosphorus\nD. Sulfur\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-031",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 31,
    "question": "What is selective removal of zinc from brass called?",
    "choices": [
      {
        "id": "A",
        "text": "Graphitization"
      },
      {
        "id": "B",
        "text": "Stabilization"
      },
      {
        "id": "C",
        "text": "Carburization"
      },
      {
        "id": "D",
        "text": "Dezincification"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Dezincification is a form of selective corrosion.",
    "rawSnippet": "What is selective removal of zinc from brass called?\nA. Graphitization\nB. Stabilization\nC. Carburization\nD. Dezincification\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-032",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 32,
    "question": "Galvanized steel is coated with which metal?",
    "choices": [
      {
        "id": "A",
        "text": "Tin"
      },
      {
        "id": "B",
        "text": "Zinc"
      },
      {
        "id": "C",
        "text": "Aluminum"
      },
      {
        "id": "D",
        "text": "Magnesium"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Zinc provides a barrier and sacrificial corrosion protection.",
    "rawSnippet": "Galvanized steel is coated with which metal?\nA. Tin\nB. Zinc\nC. Aluminum\nD. Magnesium\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-033",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 33,
    "question": "What is thermal decomposition of an ore or mineral with removal of volatile products, without the oxidation conditions of roasting, called?",
    "choices": [
      {
        "id": "A",
        "text": "Smelting"
      },
      {
        "id": "B",
        "text": "Leaching"
      },
      {
        "id": "C",
        "text": "Calcination"
      },
      {
        "id": "D",
        "text": "Roasting"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Calcination involves heating to drive decomposition or remove volatile constituents.",
    "rawSnippet": "What is thermal decomposition of an ore or mineral with removal of volatile products, without the oxidation conditions of roasting, called?\nA. Smelting\nB. Leaching\nC. Calcination\nD. Roasting\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-035",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 35,
    "question": "Which listed energy source is a liquid fossil fuel?",
    "choices": [
      {
        "id": "A",
        "text": "Coal"
      },
      {
        "id": "B",
        "text": "Oil"
      },
      {
        "id": "C",
        "text": "Natural gas"
      },
      {
        "id": "D",
        "text": "Uranium"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Petroleum or oil is a liquid fossil fuel.",
    "rawSnippet": "Which listed energy source is a liquid fossil fuel?\nA. Coal\nB. Oil\nC. Natural gas\nD. Uranium\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-036",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 36,
    "question": "What is the heat needed to raise the temperature of a unit mass by one kelvin called?",
    "choices": [
      {
        "id": "A",
        "text": "Latent heat"
      },
      {
        "id": "B",
        "text": "Heat of fusion"
      },
      {
        "id": "C",
        "text": "Heat of fission"
      },
      {
        "id": "D",
        "text": "Specific heat capacity"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Specific heat capacity is measured in energy per mass per temperature change.",
    "rawSnippet": "What is the heat needed to raise the temperature of a unit mass by one kelvin called?\nA. Latent heat\nB. Heat of fusion\nC. Heat of fission\nD. Specific heat capacity\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-037",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 37,
    "question": "In the AISI tool-steel classification, what does the prefix P designate?",
    "choices": [
      {
        "id": "A",
        "text": "Special-purpose steel"
      },
      {
        "id": "B",
        "text": "High-carbon steel"
      },
      {
        "id": "C",
        "text": "Concentrated steel"
      },
      {
        "id": "D",
        "text": "Mold steel"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "The P group designates mold steels.",
    "rawSnippet": "In the AISI tool-steel classification, what does the prefix P designate?\nA. Special-purpose steel\nB. High-carbon steel\nC. Concentrated steel\nD. Mold steel\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-038",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 38,
    "question": "What is heating a mineral to decompose it and release volatile products, without the oxidation conditions of roasting, called?",
    "choices": [
      {
        "id": "A",
        "text": "Smelting"
      },
      {
        "id": "B",
        "text": "Leaching"
      },
      {
        "id": "C",
        "text": "Calcination"
      },
      {
        "id": "D",
        "text": "Roasting"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Calcination can drive off water or carbon dioxide from minerals.",
    "rawSnippet": "What is heating a mineral to decompose it and release volatile products, without the oxidation conditions of roasting, called?\nA. Smelting\nB. Leaching\nC. Calcination\nD. Roasting\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-039",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 39,
    "question": "Which property describes resistance to localized plastic deformation?",
    "choices": [
      {
        "id": "A",
        "text": "Rigidity"
      },
      {
        "id": "B",
        "text": "Plasticity"
      },
      {
        "id": "C",
        "text": "Ductility"
      },
      {
        "id": "D",
        "text": "Hardness"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Hardness is resistance to localized plastic deformation such as indentation.",
    "rawSnippet": "Which property describes resistance to localized plastic deformation?\nA. Rigidity\nB. Plasticity\nC. Ductility\nD. Hardness\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-041",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 41,
    "question": "Which cast iron is particularly hard and wear resistant because of its carbide-rich structure?",
    "choices": [
      {
        "id": "A",
        "text": "Ductile iron"
      },
      {
        "id": "B",
        "text": "White iron"
      },
      {
        "id": "C",
        "text": "Malleable iron"
      },
      {
        "id": "D",
        "text": "Gray iron"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "White cast iron has a hard, carbide-rich structure.",
    "rawSnippet": "Which cast iron is particularly hard and wear resistant because of its carbide-rich structure?\nA. Ductile iron\nB. White iron\nC. Malleable iron\nD. Gray iron\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-042",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 42,
    "question": "Which cast iron contains both graphite and cementite, intermediate between gray and white iron?",
    "choices": [
      {
        "id": "A",
        "text": "Malleable iron"
      },
      {
        "id": "B",
        "text": "Mottled iron"
      },
      {
        "id": "C",
        "text": "Ductile iron"
      },
      {
        "id": "D",
        "text": "White iron"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Mottled iron contains both graphitic and carbide-rich regions.",
    "rawSnippet": "Which cast iron contains both graphite and cementite, intermediate between gray and white iron?\nA. Malleable iron\nB. Mottled iron\nC. Ductile iron\nD. White iron\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-043",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 43,
    "question": "Which fibrous silicate mineral group was historically used for fire resistance?",
    "choices": [
      {
        "id": "A",
        "text": "Copper"
      },
      {
        "id": "B",
        "text": "Graphite"
      },
      {
        "id": "C",
        "text": "Silicon"
      },
      {
        "id": "D",
        "text": "Asbestos"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Asbestos denotes fibrous silicate minerals.",
    "rawSnippet": "Which fibrous silicate mineral group was historically used for fire resistance?\nA. Copper\nB. Graphite\nC. Silicon\nD. Asbestos\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-044",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 44,
    "question": "Which element is the principal hardening constituent of plain-carbon steel?",
    "choices": [
      {
        "id": "A",
        "text": "Silicon"
      },
      {
        "id": "B",
        "text": "Tungsten"
      },
      {
        "id": "C",
        "text": "Manganese"
      },
      {
        "id": "D",
        "text": "Carbon"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Carbon strongly influences the phases and achievable hardness of plain-carbon steel.",
    "rawSnippet": "Which element is the principal hardening constituent of plain-carbon steel?\nA. Silicon\nB. Tungsten\nC. Manganese\nD. Carbon\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-045",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 45,
    "question": "What is unwanted rock associated with iron ore called?",
    "choices": [
      {
        "id": "A",
        "text": "Magnetite"
      },
      {
        "id": "B",
        "text": "Gangue"
      },
      {
        "id": "C",
        "text": "Concentrate"
      },
      {
        "id": "D",
        "text": "Hematite"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Gangue is the unwanted mineral or rock fraction associated with an ore.",
    "rawSnippet": "What is unwanted rock associated with iron ore called?\nA. Magnetite\nB. Gangue\nC. Concentrate\nD. Hematite\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-046",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 46,
    "question": "What is the principal benefit of a small effective boron addition to suitable steel?",
    "choices": [
      {
        "id": "A",
        "text": "Guaranteed electrical insulation"
      },
      {
        "id": "B",
        "text": "Elimination of all carbon"
      },
      {
        "id": "C",
        "text": "Deoxidation only"
      },
      {
        "id": "D",
        "text": "Increased hardenability"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Small effective boron additions can greatly increase steel hardenability.",
    "rawSnippet": "What is the principal benefit of a small effective boron addition to suitable steel?\nA. Guaranteed electrical insulation\nB. Elimination of all carbon\nC. Deoxidation only\nD. Increased hardenability\nAnswer: D"
  },
  {
    "id": "engineering-materials-discussion-048",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 48,
    "question": "What process treats ore with a solution that selectively dissolves a desired component?",
    "choices": [
      {
        "id": "A",
        "text": "Smelting"
      },
      {
        "id": "B",
        "text": "Calcination"
      },
      {
        "id": "C",
        "text": "Leaching"
      },
      {
        "id": "D",
        "text": "Roasting"
      }
    ],
    "correctChoiceId": "C",
    "explanation": "Leaching uses selective dissolution in a liquid reagent.",
    "rawSnippet": "What process treats ore with a solution that selectively dissolves a desired component?\nA. Smelting\nB. Calcination\nC. Leaching\nD. Roasting\nAnswer: C"
  },
  {
    "id": "engineering-materials-discussion-049",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 49,
    "question": "Which listed neutral atom has the largest atomic radius?",
    "choices": [
      {
        "id": "A",
        "text": "Lithium"
      },
      {
        "id": "B",
        "text": "Sodium"
      },
      {
        "id": "C",
        "text": "Beryllium"
      },
      {
        "id": "D",
        "text": "Magnesium"
      }
    ],
    "correctChoiceId": "B",
    "explanation": "Atomic radius generally increases down a group and decreases across a period; sodium is largest in this set.",
    "rawSnippet": "Which listed neutral atom has the largest atomic radius?\nA. Lithium\nB. Sodium\nC. Beryllium\nD. Magnesium\nAnswer: B"
  },
  {
    "id": "engineering-materials-discussion-050",
    "subject": "Engineering Materials",
    "sourceFileName": "ONLINE_FINAL_ESAS-3_FLUID MECHANICS, STRENGTH OF MATERIALS, ENGINEERING MATERIALS_DISCUSSION.pdf",
    "sourceFileId": "engineering-materials-upload-discussion-20261104",
    "questionNumber": 50,
    "question": "Which listed metal is protected by an adherent oxide film?",
    "choices": [
      {
        "id": "A",
        "text": "Silver"
      },
      {
        "id": "B",
        "text": "Gold"
      },
      {
        "id": "C",
        "text": "Iron"
      },
      {
        "id": "D",
        "text": "Aluminum"
      }
    ],
    "correctChoiceId": "D",
    "explanation": "Aluminum develops a thin protective oxide layer that limits further attack.",
    "rawSnippet": "Which listed metal is protected by an adherent oxide film?\nA. Silver\nB. Gold\nC. Iron\nD. Aluminum\nAnswer: D"
  }
];
