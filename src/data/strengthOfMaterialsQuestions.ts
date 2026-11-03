import { FlashcardQuestion } from '../services/questionParser';

export const STRENGTH_OF_MATERIALS_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'som-q-001',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 1,
    question: 'What is defined as the internal resistance per unit area offered by a material to an externally applied load?',
    choices: [
      { id: 'A', text: 'Strain' },
      { id: 'B', text: 'Stress' },
      { id: 'C', text: 'Modulus of elasticity' },
      { id: 'D', text: 'Resilience' }
    ],
    correctChoiceId: 'B',
    explanation: 'Stress is defined as the internal resisting force per unit cross-sectional area offered by a material against external loads (expressed in Pascals or N/m²).'
  },
  {
    id: 'som-q-002',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 2,
    question: 'Which law states that within the elastic limit of a material, stress is directly proportional to strain?',
    choices: [
      { id: 'A', text: "Pascal's Law" },
      { id: 'B', text: "Hooke's Law" },
      { id: 'C', text: "Poisson's Law" },
      { id: 'D', text: "Young's Rule" }
    ],
    correctChoiceId: 'B',
    explanation: "Hooke's Law states that within the proportional limit of elasticity, normal stress is directly proportional to normal strain (sigma = E * epsilon)."
  },
  {
    id: 'som-q-003',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 3,
    question: "What is the ratio of lateral strain to longitudinal (axial) strain in an elastic body under uniaxial tension called?",
    choices: [
      { id: 'A', text: "Young's modulus" },
      { id: 'B', text: "Modulus of rigidity" },
      { id: 'C', text: "Poisson's ratio" },
      { id: 'D', text: 'Bulk modulus' }
    ],
    correctChoiceId: 'C',
    explanation: "Poisson's ratio is defined as the absolute ratio of lateral (transverse) strain to axial (longitudinal) strain when an axial force is applied."
  },
  {
    id: 'som-q-004',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 4,
    question: 'What is the point on the stress-strain curve beyond which the material deforms plastically and will not return to its original length upon unloading?',
    choices: [
      { id: 'A', text: 'Proportional limit' },
      { id: 'B', text: 'Elastic limit' },
      { id: 'C', text: 'Ultimate strength' },
      { id: 'D', text: 'Rupture point' }
    ],
    correctChoiceId: 'B',
    explanation: 'The elastic limit is the maximum stress that a material can withstand without undergoing permanent plastic deformation upon release of the applied load.'
  },
  {
    id: 'som-q-005',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 5,
    question: 'What is the capacity of a material to absorb energy when deformed elastically and release that energy upon unloading called?',
    choices: [
      { id: 'A', text: 'Toughness' },
      { id: 'B', text: 'Resilience' },
      { id: 'C', text: 'Hardness' },
      { id: 'D', text: 'Ductility' }
    ],
    correctChoiceId: 'B',
    explanation: 'Resilience is the ability of a material to absorb energy within its elastic range, measured up to the elastic limit on the stress-strain curve.'
  },
  {
    id: 'som-q-006',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 6,
    question: 'What property of a material represents the total amount of energy absorbed per unit volume up to the point of fracture?',
    choices: [
      { id: 'A', text: 'Proof stress' },
      { id: 'B', text: 'Modulus of resilience' },
      { id: 'C', text: 'Toughness' },
      { id: 'D', text: 'Malleability' }
    ],
    correctChoiceId: 'C',
    explanation: 'Toughness is represented by the total area under the entire stress-strain curve up to rupture, indicating resistance to fracture under impact.'
  },
  {
    id: 'som-q-007',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 7,
    question: 'What is the formula for the axial deformation (elongation) of a homogeneous prismatic bar of length L, cross-sectional area A, under axial load P?',
    choices: [
      { id: 'A', text: 'delta = P * A / (L * E)' },
      { id: 'B', text: 'delta = P * L / (A * E)' },
      { id: 'C', text: 'delta = P * E / (A * L)' },
      { id: 'D', text: 'delta = A * E / (P * L)' }
    ],
    correctChoiceId: 'B',
    explanation: 'Axial elongation is given by delta = (P * L) / (A * E), derived from Hooke’s law relating stress (P/A) and strain (delta/L).'
  },
  {
    id: 'som-q-008',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 8,
    question: 'In a thin-walled cylindrical pressure vessel of internal diameter D and wall thickness t subjected to internal fluid pressure p, what is the tangential (hoop) stress?',
    choices: [
      { id: 'A', text: 'sigma = p * D / (4 * t)' },
      { id: 'B', text: 'sigma = p * D / (2 * t)' },
      { id: 'C', text: 'sigma = 2 * p * D / t' },
      { id: 'D', text: 'sigma = p * D / t' }
    ],
    correctChoiceId: 'B',
    explanation: 'The tangential (hoop) stress in a thin-walled cylinder is sigma_t = (p * D) / (2 * t), which is exactly twice the longitudinal stress.'
  },
  {
    id: 'som-q-009',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 9,
    question: 'In a thin-walled cylindrical pressure vessel, what is the longitudinal (axial) stress produced by internal pressure p?',
    choices: [
      { id: 'A', text: 'sigma = p * D / (4 * t)' },
      { id: 'B', text: 'sigma = p * D / (2 * t)' },
      { id: 'C', text: 'sigma = p * D / t' },
      { id: 'D', text: 'sigma = 2 * p * D / (3 * t)' }
    ],
    correctChoiceId: 'A',
    explanation: 'Longitudinal stress in a thin cylindrical shell is sigma_L = (p * D) / (4 * t), which is half the magnitude of the tangential (hoop) stress.'
  },
  {
    id: 'som-q-010',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 10,
    question: 'What is the membrane tensile stress in a thin spherical pressure vessel of diameter D and thickness t containing internal pressure p?',
    choices: [
      { id: 'A', text: 'sigma = p * D / (2 * t)' },
      { id: 'B', text: 'sigma = p * D / (4 * t)' },
      { id: 'C', text: 'sigma = p * D / (8 * t)' },
      { id: 'D', text: 'sigma = p * D / t' }
    ],
    correctChoiceId: 'B',
    explanation: 'Due to spherical symmetry, the normal stress is equal in all tangential directions and given by sigma = (p * D) / (4 * t).'
  },
  {
    id: 'som-q-011',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 11,
    question: 'What is the thermal deformation delta_T of an unrestrained rod of initial length L with coefficient of linear thermal expansion alpha undergoing a temperature change Delta_T?',
    choices: [
      { id: 'A', text: 'delta_T = alpha * L * Delta_T' },
      { id: 'B', text: 'delta_T = alpha * Delta_T / L' },
      { id: 'C', text: 'delta_T = L * Delta_T / alpha' },
      { id: 'D', text: 'delta_T = alpha * E * Delta_T' }
    ],
    correctChoiceId: 'A',
    explanation: 'Unrestrained linear thermal expansion is directly proportional to length and temperature change: delta_T = alpha * L * Delta_T.'
  },
  {
    id: 'som-q-012',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 12,
    question: 'If a uniform bar is completely prevented from expanding by rigid walls at both ends and heated by Delta_T, what is the resulting thermal stress?',
    choices: [
      { id: 'A', text: 'Zero' },
      { id: 'B', text: 'sigma = alpha * E * Delta_T (compressive)' },
      { id: 'C', text: 'sigma = alpha * Delta_T / E (tensile)' },
      { id: 'D', text: 'sigma = E * Delta_T / alpha' }
    ],
    correctChoiceId: 'B',
    explanation: 'Preventing thermal expansion induces an equivalent compressive strain epsilon = alpha * Delta_T, causing compressive thermal stress sigma = alpha * E * Delta_T.'
  },
  {
    id: 'som-q-013',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 13,
    question: 'What is the polar moment of inertia J for a solid circular cross-section shaft of diameter d?',
    choices: [
      { id: 'A', text: 'J = (pi * d^4) / 64' },
      { id: 'B', text: 'J = (pi * d^4) / 32' },
      { id: 'C', text: 'J = (pi * d^3) / 16' },
      { id: 'D', text: 'J = (pi * d^4) / 12' }
    ],
    correctChoiceId: 'B',
    explanation: 'The polar moment of inertia for a solid circular shaft is J = (pi * d^4) / 32, representing torsional stiffness around its longitudinal axis.'
  },
  {
    id: 'som-q-014',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 14,
    question: 'In the torsion formula tau = (T * r) / J, where does the maximum shearing stress occur in a solid circular shaft under pure torsion?',
    choices: [
      { id: 'A', text: 'At the central axis (r = 0)' },
      { id: 'B', text: 'At the outer surface (r = d/2)' },
      { id: 'C', text: 'At mid-radius (r = d/4)' },
      { id: 'D', text: 'Uniformly across the whole section' }
    ],
    correctChoiceId: 'B',
    explanation: 'Torsional shearing stress varies linearly with radial distance from zero at the center to maximum at the outer surface (tau_max = T * c / J).'
  },
  {
    id: 'som-q-015',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 15,
    question: 'What is the angle of twist theta (in radians) of a circular shaft of length L and polar moment of inertia J subjected to torque T and shear modulus G?',
    choices: [
      { id: 'A', text: 'theta = (T * L) / (J * G)' },
      { id: 'B', text: 'theta = (T * J) / (L * G)' },
      { id: 'C', text: 'theta = (J * G) / (T * L)' },
      { id: 'D', text: 'theta = (T * G) / (J * L)' }
    ],
    correctChoiceId: 'A',
    explanation: 'The angle of twist in a circular shaft is theta = (T * L) / (J * G), which is the torsional analog of axial elongation (P * L / A * E).'
  },
  {
    id: 'som-q-016',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 16,
    question: 'In a beam subjected to pure bending, what is the locus of points where the longitudinal normal stress is zero?',
    choices: [
      { id: 'A', text: 'Extreme tension fiber' },
      { id: 'B', text: 'Neutral axis' },
      { id: 'C', text: 'Shear center' },
      { id: 'D', text: 'Centroidal base' }
    ],
    correctChoiceId: 'B',
    explanation: 'The neutral axis passes through the centroid of the cross-section where bending fibers experience zero normal strain and zero normal bending stress.'
  },
  {
    id: 'som-q-017',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 17,
    question: 'What is the flexure formula relating bending moment M, distance from neutral axis y, and moment of inertia I to bending stress sigma?',
    choices: [
      { id: 'A', text: 'sigma = (M * I) / y' },
      { id: 'B', text: 'sigma = (M * y) / I' },
      { id: 'C', text: 'sigma = (y * I) / M' },
      { id: 'D', text: 'sigma = M / (y * I)' }
    ],
    correctChoiceId: 'B',
    explanation: 'The flexure formula is sigma = (M * y) / I, showing that bending stress increases linearly with distance y from the neutral axis.'
  },
  {
    id: 'som-q-018',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 18,
    question: 'What is the section modulus S of a rectangular beam cross-section of width b and depth h with respect to the horizontal centroidal axis?',
    choices: [
      { id: 'A', text: 'S = (b * h^2) / 6' },
      { id: 'B', text: 'S = (b * h^3) / 12' },
      { id: 'C', text: 'S = (b^2 * h) / 6' },
      { id: 'D', text: 'S = (b * h) / 6' }
    ],
    correctChoiceId: 'A',
    explanation: 'Section modulus S is I / c = (b * h^3 / 12) / (h / 2) = (b * h^2) / 6, representing the beam’s geometric resistance to bending.'
  },
  {
    id: 'som-q-019',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 19,
    question: 'In a rectangular beam of cross-sectional area A subjected to vertical shear force V, what is the maximum transverse shearing stress at the neutral axis?',
    choices: [
      { id: 'A', text: 'tau_max = V / A' },
      { id: 'B', text: 'tau_max = (3 * V) / (2 * A)' },
      { id: 'C', text: 'tau_max = (4 * V) / (3 * A)' },
      { id: 'D', text: 'tau_max = (2 * V) / A' }
    ],
    correctChoiceId: 'B',
    explanation: 'For a rectangular beam, transverse shearing stress distribution is parabolic with a maximum at the neutral axis equal to 1.5 * (V / A).'
  },
  {
    id: 'som-q-020',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 20,
    question: 'For a solid circular cross-section beam of area A under vertical shear V, what is the maximum transverse shear stress at the neutral axis?',
    choices: [
      { id: 'A', text: 'tau_max = (3 * V) / (2 * A)' },
      { id: 'B', text: 'tau_max = (4 * V) / (3 * A)' },
      { id: 'C', text: 'tau_max = (2 * V) / A' },
      { id: 'D', text: 'tau_max = V / A' }
    ],
    correctChoiceId: 'B',
    explanation: 'For a solid circular beam, the maximum shearing stress occurs at the neutral axis and equals (4/3) * (V / A) or 1.33 times average shear stress.'
  },
  {
    id: 'som-q-021',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 21,
    question: 'What is the maximum deflection at the free end of a cantilever beam of length L and flexural rigidity EI carrying a concentrated load P at its free tip?',
    choices: [
      { id: 'A', text: 'delta = (P * L^3) / (3 * E * I)' },
      { id: 'B', text: 'delta = (P * L^3) / (48 * E * I)' },
      { id: 'C', text: 'delta = (P * L^4) / (8 * E * I)' },
      { id: 'D', text: 'delta = (P * L^2) / (2 * E * I)' }
    ],
    correctChoiceId: 'A',
    explanation: 'The tip deflection of a cantilever beam with an end point load P is delta_max = (P * L^3) / (3 * E * I).'
  },
  {
    id: 'som-q-022',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 22,
    question: 'What is the maximum deflection at midspan of a simply supported beam of span L with flexural rigidity EI subjected to a concentrated center load P?',
    choices: [
      { id: 'A', text: 'delta = (P * L^3) / (3 * E * I)' },
      { id: 'B', text: 'delta = (P * L^3) / (48 * E * I)' },
      { id: 'C', text: 'delta = (5 * P * L^3) / (384 * E * I)' },
      { id: 'D', text: 'delta = (P * L^3) / (24 * E * I)' }
    ],
    correctChoiceId: 'B',
    explanation: 'The midspan deflection of a simply supported beam with a central point load P is delta_max = (P * L^3) / (48 * E * I).'
  },
  {
    id: 'som-q-023',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 23,
    question: 'What graphical method is widely used in structural mechanics to determine principal stresses, maximum in-plane shear stress, and stresses on inclined planes?',
    choices: [
      { id: 'A', text: "Euler's parabola" },
      { id: 'B', text: "Mohr's circle" },
      { id: 'C', text: "Goodman diagram" },
      { id: 'D', text: "Wöhler S-N curve" }
    ],
    correctChoiceId: 'B',
    explanation: "Mohr's circle provides a graphical transformation of two-dimensional state of plane stress to find principal stresses and maximum shear stresses."
  },
  {
    id: 'som-q-024',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 24,
    question: 'On planes where the principal normal stresses occur, what is the magnitude of the shearing stress?',
    choices: [
      { id: 'A', text: 'Maximum' },
      { id: 'B', text: 'Zero' },
      { id: 'C', text: 'Equal to normal stress' },
      { id: 'D', text: 'Half of principal stress' }
    ],
    correctChoiceId: 'B',
    explanation: 'By definition, principal planes are mutually perpendicular planes of zero shearing stress where normal stresses reach extreme values.'
  },
  {
    id: 'som-q-025',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 25,
    question: "What is Euler's critical buckling load P_cr for an ideal, slender pin-ended column of length L, modulus E, and minimum moment of inertia I?",
    choices: [
      { id: 'A', text: 'P_cr = (pi^2 * E * I) / L^2' },
      { id: 'B', text: 'P_cr = (4 * pi^2 * E * I) / L^2' },
      { id: 'C', text: 'P_cr = (pi * E * I) / (2 * L^2)' },
      { id: 'D', text: 'P_cr = (pi^2 * E * I) / (4 * L^2)' }
    ],
    correctChoiceId: 'A',
    explanation: "Euler's buckling formula for a pinned-pinned column is P_cr = (pi^2 * E * I) / L^2, governing elastic column stability."
  },
  {
    id: 'som-q-026',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 26,
    question: 'What is the theoretical effective length factor K for a column with one end fixed and the other end completely free (flagpole / cantilever column)?',
    choices: [
      { id: 'A', text: 'K = 0.5' },
      { id: 'B', text: 'K = 0.7' },
      { id: 'C', text: 'K = 1.0' },
      { id: 'D', text: 'K = 2.0' }
    ],
    correctChoiceId: 'D',
    explanation: 'A fixed-free cantilever column has an effective buckling length L_e = 2.0 * L, yielding a critical load of P_cr = (pi^2 * E * I) / (4 * L^2).'
  },
  {
    id: 'som-q-027',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 27,
    question: 'What is the theoretical effective length factor K for an ideal column with both ends fixed against rotation and translation?',
    choices: [
      { id: 'A', text: 'K = 0.5' },
      { id: 'B', text: 'K = 0.7' },
      { id: 'C', text: 'K = 1.0' },
      { id: 'D', text: 'K = 2.0' }
    ],
    correctChoiceId: 'A',
    explanation: 'A column with both ends fixed has an effective length L_e = 0.5 * L, quadrupling its critical buckling capacity compared to pinned ends.'
  },
  {
    id: 'som-q-028',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 28,
    question: 'What is the slenderness ratio of a compression member defined as?',
    choices: [
      { id: 'A', text: 'Ratio of cross-sectional area to length' },
      { id: 'B', text: 'Ratio of effective length to least radius of gyration (L_e / r)' },
      { id: 'C', text: 'Ratio of total load to yield strength' },
      { id: 'D', text: 'Ratio of depth to thickness' }
    ],
    correctChoiceId: 'B',
    explanation: 'Slenderness ratio is defined as (L_e / r), where L_e is the effective column length and r is the minimum radius of gyration (sqrt(I/A)).'
  },
  {
    id: 'som-q-029',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 29,
    question: 'What relationship connects Young’s modulus E, shear modulus G, and Poisson’s ratio nu for an isotropic linear-elastic material?',
    choices: [
      { id: 'A', text: 'G = E / [2 * (1 + nu)]' },
      { id: 'B', text: 'E = G / [2 * (1 + nu)]' },
      { id: 'C', text: 'G = E * (1 + nu)' },
      { id: 'D', text: 'E = 2 * G * (1 - nu)' }
    ],
    correctChoiceId: 'A',
    explanation: 'The fundamental elasticity relation between shear modulus G and Young’s modulus E is G = E / [2 * (1 + nu)].'
  },
  {
    id: 'som-q-030',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 30,
    question: 'What is the ratio of ultimate failure stress to allowable working stress called in engineering design?',
    choices: [
      { id: 'A', text: 'Stress concentration factor' },
      { id: 'B', text: 'Factor of safety' },
      { id: 'C', text: 'Yield ratio' },
      { id: 'D', text: 'Modulus of rupture' }
    ],
    correctChoiceId: 'B',
    explanation: 'Factor of safety is the ratio of structural capacity (ultimate or yield strength) to the actual allowable working stress to prevent failure.'
  },
  {
    id: 'som-q-031',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 31,
    question: 'What type of stress is produced in a bolt or rivet when connected plates are pulled in opposite directions along their contact plane?',
    choices: [
      { id: 'A', text: 'Bearing stress' },
      { id: 'B', text: 'Direct shear stress' },
      { id: 'C', text: 'Torsional stress' },
      { id: 'D', text: 'Hoop stress' }
    ],
    correctChoiceId: 'B',
    explanation: 'Direct or transverse shear stress is developed across the cross-section of a fastener parallel to the applied shearing plane (tau = P / A).'
  },
  {
    id: 'som-q-032',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 32,
    question: 'What type of compressive contact pressure is developed between the cylindrical shank of a bolt and the inner curved surface of a plate hole?',
    choices: [
      { id: 'A', text: 'Bearing stress' },
      { id: 'B', text: 'Torsional stress' },
      { id: 'C', text: 'Tensile stress' },
      { id: 'D', text: 'Flexural stress' }
    ],
    correctChoiceId: 'A',
    explanation: 'Bearing stress is contact pressure calculated as the load divided by the projected contact area (sigma_b = P / (d * t)).'
  },
  {
    id: 'som-q-033',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 33,
    question: 'What phenomenon causes localized high stresses around holes, notches, sharp keyways, and sudden changes in cross-section?',
    choices: [
      { id: 'A', text: 'Creep' },
      { id: 'B', text: 'Stress concentration' },
      { id: 'C', text: 'Strain hardening' },
      { id: 'D', text: 'Thermal fatigue' }
    ],
    correctChoiceId: 'B',
    explanation: 'Stress concentration occurs at geometric discontinuities, amplifying localized peak stress by the stress concentration factor K_t.'
  },
  {
    id: 'som-q-034',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 34,
    question: 'What is progressive permanent deformation of a material under a sustained constant load over an extended period at high temperatures called?',
    choices: [
      { id: 'A', text: 'Creep' },
      { id: 'B', text: 'Fatigue' },
      { id: 'C', text: 'Relaxation' },
      { id: 'D', text: 'Elastic hysteresis' }
    ],
    correctChoiceId: 'A',
    explanation: 'Creep is time-dependent slow plastic deformation of materials subjected to continuous mechanical stress, especially at elevated homologous temperatures.'
  },
  {
    id: 'som-q-035',
    subject: 'Strength of Materials',
    sourceFileName: 'ESAS_Strength_of_Materials_Board_Reviewer.pdf',
    questionNumber: 35,
    question: 'What is the progressive structural damage and failure of a material subjected to cyclic or fluctuating dynamic loading below yield strength called?',
    choices: [
      { id: 'A', text: 'Corrosion' },
      { id: 'B', text: 'Fatigue' },
      { id: 'C', text: 'Buckling' },
      { id: 'D', text: 'Plastic flow' }
    ],
    correctChoiceId: 'B',
    explanation: 'Fatigue failure occurs under repeated or cyclic dynamic loading, causing microscopic crack initiation and progressive propagation until sudden rupture.'
  }
];
