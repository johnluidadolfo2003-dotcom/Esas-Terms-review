import { FlashcardQuestion } from '../services/questionParser';

export const FLUID_MECHANICS_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'fm-q-001',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 1,
    question: 'What is the ratio of the mass density of a fluid to the mass density of pure water at 4 degrees Celsius called?',
    choices: [
      { id: 'A', text: 'Specific weight' },
      { id: 'B', text: 'Specific volume' },
      { id: 'C', text: 'Specific gravity' },
      { id: 'D', text: 'Kinematic viscosity' }
    ],
    correctChoiceId: 'C',
    explanation: 'Specific gravity (SG) is the dimensionless ratio of a substance’s density to the standard density of water at 4°C (1000 kg/m³).'
  },
  {
    id: 'fm-q-002',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 2,
    question: 'What is the standard specific weight of pure water at sea level under standard acceleration of gravity (9.81 m/s²)?',
    choices: [
      { id: 'A', text: '9.81 kN/m³' },
      { id: 'B', text: '1.00 kN/m³' },
      { id: 'C', text: '62.4 kN/m³' },
      { id: 'D', text: '981 kN/m³' }
    ],
    correctChoiceId: 'A',
    explanation: 'Specific weight gamma = rho * g = (1000 kg/m³) * (9.81 m/s²) = 9810 N/m³ or 9.81 kN/m³ (in English units: 62.4 lb/ft³).'
  },
  {
    id: 'fm-q-003',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 3,
    question: 'Which law states that the shear stress between adjacent fluid layers is directly proportional to the velocity gradient perpendicular to the flow?',
    choices: [
      { id: 'A', text: "Pascal's Law" },
      { id: 'B', text: "Torricelli's Law" },
      { id: 'C', text: "Newton's Law of Viscosity" },
      { id: 'D', text: "Poiseuille's Law" }
    ],
    correctChoiceId: 'C',
    explanation: "Newton's Law of Viscosity states that shear stress is tau = mu * (du/dy), where mu is dynamic viscosity and du/dy is velocity gradient."
  },
  {
    id: 'fm-q-004',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 4,
    question: 'What is the SI unit of dynamic (absolute) viscosity?',
    choices: [
      { id: 'A', text: 'Pa·s (Pascal-second)' },
      { id: 'B', text: 'm²/s' },
      { id: 'C', text: 'Stokes' },
      { id: 'D', text: 'Poiseuille / m' }
    ],
    correctChoiceId: 'A',
    explanation: 'The SI unit of dynamic viscosity is Pascal-second (Pa·s) or N·s/m² (equivalent to 10 Poise in CGS units).'
  },
  {
    id: 'fm-q-005',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 5,
    question: 'What is the ratio of dynamic viscosity (mu) to fluid mass density (rho) defined as?',
    choices: [
      { id: 'A', text: 'Specific viscosity' },
      { id: 'B', text: 'Kinematic viscosity' },
      { id: 'C', text: 'Bulk modulus' },
      { id: 'D', text: 'Compressibility' }
    ],
    correctChoiceId: 'B',
    explanation: 'Kinematic viscosity nu is defined as dynamic viscosity divided by density (nu = mu / rho), with SI units of m²/s (or Stokes in CGS).'
  },
  {
    id: 'fm-q-006',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 6,
    question: 'How does the dynamic viscosity of a typical liquid change as its temperature increases?',
    choices: [
      { id: 'A', text: 'It increases significantly' },
      { id: 'B', text: 'It decreases significantly' },
      { id: 'C', text: 'It remains constant' },
      { id: 'D', text: 'It drops to absolute zero' }
    ],
    correctChoiceId: 'B',
    explanation: 'In liquids, viscosity is dominated by intermolecular cohesive forces, which decrease as temperature rises, lowering viscosity.'
  },
  {
    id: 'fm-q-007',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 7,
    question: 'How does the dynamic viscosity of a typical gas change as its temperature increases?',
    choices: [
      { id: 'A', text: 'It decreases' },
      { id: 'B', text: 'It increases' },
      { id: 'C', text: 'It remains unaffected' },
      { id: 'D', text: 'It fluctuates sinusoidally' }
    ],
    correctChoiceId: 'B',
    explanation: 'In gases, viscosity is caused by molecular momentum transfer from collisions; higher temperature speeds up molecules, increasing viscosity.'
  },
  {
    id: 'fm-q-008',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 8,
    question: 'Which law states that pressure applied to a confined static fluid is transmitted undiminished in all directions throughout the fluid?',
    choices: [
      { id: 'A', text: "Pascal's Principle" },
      { id: 'B', text: "Archimedes' Principle" },
      { id: 'C', text: "Bernoulli's Principle" },
      { id: 'D', text: "Dalton's Law" }
    ],
    correctChoiceId: 'A',
    explanation: "Pascal's Principle states that external pressure applied to a closed fluid system is transmitted equally throughout, forming the basis of hydraulic jacks."
  },
  {
    id: 'fm-q-009',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 9,
    question: 'What is standard atmospheric pressure at sea level in kilopascals (kPa)?',
    choices: [
      { id: 'A', text: '100.0 kPa' },
      { id: 'B', text: '101.325 kPa' },
      { id: 'C', text: '98.1 kPa' },
      { id: 'D', text: '14.7 kPa' }
    ],
    correctChoiceId: 'B',
    explanation: 'Standard atmospheric pressure at sea level is exactly 101.325 kPa (equivalent to 1 atm, 760 mmHg, 14.7 psi, or 10.33 m of water).'
  },
  {
    id: 'fm-q-010',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 10,
    question: 'What is the relationship between absolute pressure, atmospheric pressure, and gauge pressure?',
    choices: [
      { id: 'A', text: 'P_abs = P_atm - P_gauge' },
      { id: 'B', text: 'P_abs = P_gauge + P_atm' },
      { id: 'C', text: 'P_abs = P_gauge / P_atm' },
      { id: 'D', text: 'P_gauge = P_abs + P_atm' }
    ],
    correctChoiceId: 'B',
    explanation: 'Absolute pressure is measured relative to absolute zero pressure (perfect vacuum): P_abs = P_gauge + P_atm.'
  },
  {
    id: 'fm-q-011',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 11,
    question: 'What is the pressure variation with depth h in a homogeneous static liquid of specific weight gamma?',
    choices: [
      { id: 'A', text: 'p = gamma * h' },
      { id: 'B', text: 'p = gamma / h' },
      { id: 'C', text: 'p = (gamma * h^2) / 2' },
      { id: 'D', text: 'p = gamma * g * h' }
    ],
    correctChoiceId: 'A',
    explanation: 'Hydrostatic pressure increases linearly with vertical depth according to p = gamma * h = rho * g * h.'
  },
  {
    id: 'fm-q-012',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 12,
    question: 'Where is the center of pressure located relative to the centroid of a submerged plane surface?',
    choices: [
      { id: 'A', text: 'Always above the centroid' },
      { id: 'B', text: 'Always below the centroid' },
      { id: 'C', text: 'At the exact same point as centroid' },
      { id: 'D', text: 'At the water free surface' }
    ],
    correctChoiceId: 'B',
    explanation: 'Due to increasing hydrostatic pressure with depth, the resultant force acts below the area centroid by an eccentricity e = I_cg / (y_c * A).'
  },
  {
    id: 'fm-q-013',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 13,
    question: 'What principle states that any body wholly or partially submerged in a fluid is buoyed up by a force equal to the weight of the fluid displaced?',
    choices: [
      { id: 'A', text: "Pascal's principle" },
      { id: 'B', text: "Archimedes' principle" },
      { id: 'C', text: "Bernoulli's principle" },
      { id: 'D', text: "Torricelli's principle" }
    ],
    correctChoiceId: 'B',
    explanation: "Archimedes' principle states that the buoyant force on a submerged body equals the weight of displaced fluid (F_b = gamma_fluid * V_displaced)."
  },
  {
    id: 'fm-q-014',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 14,
    question: 'What is the condition for stable equilibrium of a partially submerged floating body?',
    choices: [
      { id: 'A', text: 'The metacenter M must lie below the center of gravity G (MG < 0)' },
      { id: 'B', text: 'The metacenter M must lie above the center of gravity G (MG > 0)' },
      { id: 'C', text: 'The center of buoyancy B must coincide with G' },
      { id: 'D', text: 'The metacentric height MG must be exactly zero' }
    ],
    correctChoiceId: 'B',
    explanation: 'A floating vessel is in stable equilibrium if its metacenter M is located above its center of gravity G (positive metacentric height MG > 0).'
  },
  {
    id: 'fm-q-015',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 15,
    question: 'What is the continuity equation expressing conservation of mass for steady, one-dimensional, incompressible fluid flow?',
    choices: [
      { id: 'A', text: 'A1 / V1 = A2 / V2' },
      { id: 'B', text: 'A1 * V1 = A2 * V2 = Q' },
      { id: 'C', text: 'A1 * V1^2 = A2 * V2^2' },
      { id: 'D', text: 'P1 * V1 = P2 * V2' }
    ],
    correctChoiceId: 'B',
    explanation: 'For incompressible steady flow, volumetric flow rate Q is constant along the streamline: Q = A1 * V1 = A2 * V2.'
  },
  {
    id: 'fm-q-016',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 16,
    question: 'What are the three components of head represented in Bernoulli’s energy equation (z + p/gamma + V²/(2g) = constant)?',
    choices: [
      { id: 'A', text: 'Thermal head, magnetic head, chemical head' },
      { id: 'B', text: 'Elevation head, pressure head, velocity head' },
      { id: 'C', text: 'Friction head, drag head, lift head' },
      { id: 'D', text: 'Dynamic head, static head, turbulent head' }
    ],
    correctChoiceId: 'B',
    explanation: 'Bernoulli’s head form represents energy per unit weight: z is elevation head, p/gamma is pressure head, and V²/(2g) is velocity head.'
  },
  {
    id: 'fm-q-017',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 17,
    question: "What is the theoretical exit velocity V of a liquid issuing through a small orifice under a static liquid head h (Torricelli's theorem)?",
    choices: [
      { id: 'A', text: 'V = 2 * g * h' },
      { id: 'B', text: 'V = sqrt(2 * g * h)' },
      { id: 'C', text: 'V = sqrt(g * h)' },
      { id: 'D', text: 'V = g * h^2' }
    ],
    correctChoiceId: 'B',
    explanation: "Torricelli's theorem states that the theoretical efflux speed through an orifice under liquid head h is V = sqrt(2 * g * h)."
  },
  {
    id: 'fm-q-018',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 18,
    question: 'What instrument measures local flow velocity by sensing the difference between stagnation pressure and static pressure?',
    choices: [
      { id: 'A', text: 'Venturi meter' },
      { id: 'B', text: 'Pitot-static tube' },
      { id: 'C', text: 'Orifice plate' },
      { id: 'D', text: 'Hydrometer' }
    ],
    correctChoiceId: 'B',
    explanation: 'A Pitot-static tube converts dynamic kinetic energy into stagnation pressure, calculating local fluid velocity as V = sqrt(2 * Delta_p / rho).'
  },
  {
    id: 'fm-q-019',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 19,
    question: 'What dimensionless parameter represents the ratio of inertial forces to viscous forces in fluid flow?',
    choices: [
      { id: 'A', text: 'Froude number' },
      { id: 'B', text: 'Mach number' },
      { id: 'C', text: 'Reynolds number' },
      { id: 'D', text: 'Weber number' }
    ],
    correctChoiceId: 'C',
    explanation: 'Reynolds number Re = (rho * V * D) / mu = (V * D) / nu characterizes whether flow is laminar, transitional, or turbulent.'
  },
  {
    id: 'fm-q-020',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 20,
    question: 'For internal flow through a smooth circular pipe, flow is generally laminar if the Reynolds number Re is less than what critical value?',
    choices: [
      { id: 'A', text: '500' },
      { id: 'B', text: '2000' },
      { id: 'C', text: '4000' },
      { id: 'D', text: '10000' }
    ],
    correctChoiceId: 'B',
    explanation: 'For internal pipe flow, flow is laminar when Re < 2000, transitional between 2000 and 4000, and fully turbulent when Re > 4000.'
  },
  {
    id: 'fm-q-021',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 21,
    question: 'What is the Darcy-Weisbach equation for head loss due to pipe friction h_f in a pipe of length L, diameter D, and mean velocity V?',
    choices: [
      { id: 'A', text: 'h_f = f * (L / D) * (V² / (2 * g))' },
      { id: 'B', text: 'h_f = f * (D / L) * (V² / (2 * g))' },
      { id: 'C', text: 'h_f = (f * L * V) / (D * 2 * g)' },
      { id: 'D', text: 'h_f = f * (L / D²) * (V / (2 * g))' }
    ],
    correctChoiceId: 'A',
    explanation: 'The Darcy-Weisbach formula for major friction head loss is h_f = f * (L / D) * [V² / (2g)], where f is the Darcy friction factor.'
  },
  {
    id: 'fm-q-022',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 22,
    question: 'What is the theoretical Darcy friction factor f for fully developed laminar flow in a circular pipe?',
    choices: [
      { id: 'A', text: 'f = 16 / Re' },
      { id: 'B', text: 'f = 64 / Re' },
      { id: 'C', text: 'f = 0.079 / Re^0.25' },
      { id: 'D', text: 'f = 32 / Re' }
    ],
    correctChoiceId: 'B',
    explanation: 'Derived directly from the Hagen-Poiseuille equation, the Darcy friction factor for laminar pipe flow is exactly f = 64 / Re.'
  },
  {
    id: 'fm-q-023',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 23,
    question: 'What chart or diagram is universally used to find the Darcy friction factor f from the Reynolds number and relative pipe roughness (epsilon / D)?',
    choices: [
      { id: 'A', text: 'Mollier diagram' },
      { id: 'B', text: 'Psychrometric chart' },
      { id: 'C', text: 'Moody diagram' },
      { id: 'D', text: 'Goodman diagram' }
    ],
    correctChoiceId: 'C',
    explanation: 'The Moody diagram plots the Darcy friction factor f against the Reynolds number across laminar and turbulent regimes for various relative roughnesses.'
  },
  {
    id: 'fm-q-024',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 24,
    question: 'What is the velocity profile across a circular cross-section pipe in fully developed laminar flow?',
    choices: [
      { id: 'A', text: 'Linear' },
      { id: 'B', text: 'Parabolic' },
      { id: 'C', text: 'Logarithmic' },
      { id: 'D', text: 'Completely uniform' }
    ],
    correctChoiceId: 'B',
    explanation: 'Hagen-Poiseuille flow produces a parabolic velocity profile, where centerline maximum velocity is exactly twice the average flow velocity (V_max = 2 * V_avg).'
  },
  {
    id: 'fm-q-025',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 25,
    question: 'What hydraulic coefficient is defined as the ratio of actual flow rate to theoretical flow rate through an orifice or flow nozzle?',
    choices: [
      { id: 'A', text: 'Coefficient of contraction (C_c)' },
      { id: 'B', text: 'Coefficient of velocity (C_v)' },
      { id: 'C', text: 'Coefficient of discharge (C_d)' },
      { id: 'D', text: 'Coefficient of restitution (C_r)' }
    ],
    correctChoiceId: 'C',
    explanation: 'The coefficient of discharge C_d is the ratio of actual discharge to theoretical discharge, and equals C_c * C_v.'
  },
  {
    id: 'fm-q-026',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 26,
    question: 'What is the narrowest section of a fluid jet issuing from a sharp-edged orifice where streamlines become parallel?',
    choices: [
      { id: 'A', text: 'Stagnation zone' },
      { id: 'B', text: 'Vena contracta' },
      { id: 'C', text: 'Boundary layer' },
      { id: 'D', text: 'Cavitation throat' }
    ],
    correctChoiceId: 'B',
    explanation: 'The vena contracta is the location just downstream of an orifice where the jet diameter is minimal and jet pressure is atmospheric.'
  },
  {
    id: 'fm-q-027',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 27,
    question: 'What destructive phenomenon occurs in hydraulic machines when local static pressure falls to the vapor pressure of the liquid, forming vapor bubbles that collapse violently?',
    choices: [
      { id: 'A', text: 'Water hammer' },
      { id: 'B', text: 'Cavitation' },
      { id: 'C', text: 'Surge' },
      { id: 'D', text: 'Entrainment' }
    ],
    correctChoiceId: 'B',
    explanation: 'Cavitation occurs when local pressure drops to vapor pressure, creating vapor cavities that implode in high-pressure regions, eroding metal.'
  },
  {
    id: 'fm-q-028',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 28,
    question: 'What is the severe pressure surge or shock wave created in a piping system when a valve is closed suddenly?',
    choices: [
      { id: 'A', text: 'Cavitation' },
      { id: 'B', text: 'Water hammer' },
      { id: 'C', text: 'Vortex shedding' },
      { id: 'D', text: 'Secondary flow' }
    ],
    correctChoiceId: 'B',
    explanation: 'Water hammer is a transient acoustic pressure wave generated when fluid velocity is abruptly halted, creating destructive pressure peaks.'
  },
  {
    id: 'fm-q-029',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 29,
    question: 'What is the hydraulic radius R_h defined as for open channel or non-circular duct flow?',
    choices: [
      { id: 'A', text: 'Cross-sectional area divided by wetted perimeter (A / P)' },
      { id: 'B', text: 'Diameter divided by 2' },
      { id: 'C', text: 'Wetted perimeter divided by surface width' },
      { id: 'D', text: 'Total depth multiplied by area' }
    ],
    correctChoiceId: 'A',
    explanation: 'Hydraulic radius R_h is the ratio of flow cross-sectional area A to wetted perimeter P (for a full circular pipe of diameter D, R_h = D / 4).'
  },
  {
    id: 'fm-q-030',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 30,
    question: 'What property of a liquid causes liquid drops to form spheres and enables insects to walk on the water surface?',
    choices: [
      { id: 'A', text: 'Dynamic viscosity' },
      { id: 'B', text: 'Surface tension' },
      { id: 'C', text: 'Vapor pressure' },
      { id: 'D', text: 'Specific gravity' }
    ],
    correctChoiceId: 'B',
    explanation: 'Surface tension is the tensile force per unit length at the liquid-gas interface resulting from unbalanced cohesive intermolecular attractions.'
  },
  {
    id: 'fm-q-031',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 31,
    question: 'What is the capillary rise height h of a liquid with surface tension sigma and contact angle theta in a tube of diameter d and liquid specific weight gamma?',
    choices: [
      { id: 'A', text: 'h = (4 * sigma * cos(theta)) / (gamma * d)' },
      { id: 'B', text: 'h = (2 * sigma * cos(theta)) / (gamma * d^2)' },
      { id: 'C', text: 'h = (gamma * d) / (4 * sigma * cos(theta))' },
      { id: 'D', text: 'h = (sigma * d) / (gamma * cos(theta))' }
    ],
    correctChoiceId: 'A',
    explanation: 'Capillary rise balances upward surface tension force with liquid weight: h = (4 * sigma * cos(theta)) / (gamma * d).'
  },
  {
    id: 'fm-q-032',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 32,
    question: 'What type of fluid exhibits a decrease in apparent viscosity with increasing rate of shear strain (shear-thinning fluid)?',
    choices: [
      { id: 'A', text: 'Dilatant fluid' },
      { id: 'B', text: 'Pseudoplastic fluid' },
      { id: 'C', text: 'Bingham plastic' },
      { id: 'D', text: 'Newtonian fluid' }
    ],
    correctChoiceId: 'B',
    explanation: 'Pseudoplastic fluids (like paints, polymer melts, and blood) are shear-thinning; their apparent viscosity decreases as shear rate increases.'
  },
  {
    id: 'fm-q-033',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 33,
    question: 'What type of fluid exhibits an increase in apparent viscosity with increasing rate of shear strain (shear-thickening fluid)?',
    choices: [
      { id: 'A', text: 'Dilatant fluid' },
      { id: 'B', text: 'Pseudoplastic fluid' },
      { id: 'C', text: 'Bingham plastic' },
      { id: 'D', text: 'Ideal fluid' }
    ],
    correctChoiceId: 'A',
    explanation: 'Dilatant fluids (such as cornstarch in water) are shear-thickening; viscosity rises when agitated or subjected to rapid shear stress.'
  },
  {
    id: 'fm-q-034',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 34,
    question: 'What type of fluid behaves as a rigid solid until a minimum yield stress is exceeded, after which it flows with constant viscosity?',
    choices: [
      { id: 'A', text: 'Pseudoplastic' },
      { id: 'B', text: 'Bingham plastic' },
      { id: 'C', text: 'Dilatant' },
      { id: 'D', text: 'Thixotropic fluid' }
    ],
    correctChoiceId: 'B',
    explanation: 'A Bingham plastic (such as toothpaste, drilling mud, and mayonnaise) requires a threshold yield stress before flowing like a viscous liquid.'
  },
  {
    id: 'fm-q-035',
    subject: 'Fluid Mechanics',
    sourceFileName: 'ESAS_Fluid_Mechanics_Board_Reviewer.pdf',
    questionNumber: 35,
    question: 'What device utilizes the Venturi effect (pressure drop at a throat constriction) to measure volumetric flow rate in a pipeline?',
    choices: [
      { id: 'A', text: 'Venturi meter' },
      { id: 'B', text: 'Piezometer' },
      { id: 'C', text: 'Bourdon gauge' },
      { id: 'D', text: 'Hydrometer' }
    ],
    correctChoiceId: 'A',
    explanation: 'A Venturi meter accelerates fluid through a converging-diverging nozzle; the pressure difference between inlet and throat yields flow rate.'
  }
];
