import { FlashcardQuestion } from '../services/questionParser';

export const THERMODYNAMICS_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'thermo-q-001',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 1,
    question: 'Which law of thermodynamics states that if two bodies are each in thermal equilibrium with a third body, they are in thermal equilibrium with each other?',
    choices: [
      { id: 'A', text: 'Zeroth Law' },
      { id: 'B', text: 'First Law' },
      { id: 'C', text: 'Second Law' },
      { id: 'D', text: 'Third Law' }
    ],
    correctChoiceId: 'A',
    explanation: 'The Zeroth Law of Thermodynamics establishes the physical concept of temperature and serves as the operating basis for all thermometers.'
  },
  {
    id: 'thermo-q-002',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 2,
    question: 'Which law of thermodynamics is an expression of the principle of conservation of energy for thermodynamic systems (Delta_U = Q - W)?',
    choices: [
      { id: 'A', text: 'Zeroth Law' },
      { id: 'B', text: 'First Law' },
      { id: 'C', text: 'Second Law' },
      { id: 'D', text: 'Third Law' }
    ],
    correctChoiceId: 'B',
    explanation: 'The First Law of Thermodynamics affirms that energy can neither be created nor destroyed, only transformed: Delta_U = Q - W.'
  },
  {
    id: 'thermo-q-003',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 3,
    question: 'What type of thermodynamic property is independent of the mass or size of the system (such as temperature, pressure, and density)?',
    choices: [
      { id: 'A', text: 'Extensive property' },
      { id: 'B', text: 'Intensive property' },
      { id: 'C', text: 'Dynamic property' },
      { id: 'D', text: 'Stochastic property' }
    ],
    correctChoiceId: 'B',
    explanation: 'Intensive properties do not depend on system mass or volume (e.g., temperature, pressure, specific volume, and density).'
  },
  {
    id: 'thermo-q-004',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 4,
    question: 'What type of thermodynamic property depends directly on the total mass or extent of the system (such as total mass, volume, and internal energy)?',
    choices: [
      { id: 'A', text: 'Intensive property' },
      { id: 'B', text: 'Extensive property' },
      { id: 'C', text: 'Specific property' },
      { id: 'D', text: 'Point property' }
    ],
    correctChoiceId: 'B',
    explanation: 'Extensive properties are proportional to the amount of matter present in the system (e.g., total volume, total mass, total enthalpy).'
  },
  {
    id: 'thermo-q-005',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 5,
    question: 'What is a thermodynamic system called that does not exchange either matter or energy (heat or work) with its surroundings?',
    choices: [
      { id: 'A', text: 'Open system' },
      { id: 'B', text: 'Closed system' },
      { id: 'C', text: 'Isolated system' },
      { id: 'D', text: 'Adiabatic system' }
    ],
    correctChoiceId: 'C',
    explanation: 'An isolated system exchanges neither mass nor energy with its environment across its boundaries (e.g., a perfectly insulated rigid container).'
  },
  {
    id: 'thermo-q-006',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 6,
    question: 'What is a thermodynamic system that permits energy transfer (heat and work) across its boundary but allows no mass transfer called?',
    choices: [
      { id: 'A', text: 'Closed system (control mass)' },
      { id: 'B', text: 'Open system (control volume)' },
      { id: 'C', text: 'Isolated system' },
      { id: 'D', text: 'Transient system' }
    ],
    correctChoiceId: 'A',
    explanation: 'A closed system contains a fixed quantity of mass; energy in the forms of heat and work can cross its boundary, but mass cannot.'
  },
  {
    id: 'thermo-q-007',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 7,
    question: 'What is enthalpy H defined as in thermodynamics?',
    choices: [
      { id: 'A', text: 'H = U - P * V' },
      { id: 'B', text: 'H = U + P * V' },
      { id: 'C', text: 'H = T * S - U' },
      { id: 'D', text: 'H = P * V / T' }
    ],
    correctChoiceId: 'B',
    explanation: 'Enthalpy is a composite thermodynamic property defined as the sum of internal energy U and flow work P*V (H = U + P*V).'
  },
  {
    id: 'thermo-q-008',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 8,
    question: 'What is the universal gas constant R_bar in SI units?',
    choices: [
      { id: 'A', text: '0.287 kJ/kg·K' },
      { id: 'B', text: '8.314 kJ/kmol·K' },
      { id: 'C', text: '1.986 Btu/lbm·R' },
      { id: 'D', text: '53.34 ft·lbf/lbm·R' }
    ],
    correctChoiceId: 'B',
    explanation: 'The universal gas constant is R_bar = 8.314 kJ/(kmol·K) or 8.314 J/(mol·K), applicable to all ideal gases regardless of molar mass.'
  },
  {
    id: 'thermo-q-009',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 9,
    question: 'What is the individual gas constant R for air with an average molecular weight of 28.97 kg/kmol?',
    choices: [
      { id: 'A', text: '0.287 kJ/kg·K' },
      { id: 'B', text: '1.005 kJ/kg·K' },
      { id: 'C', text: '0.718 kJ/kg·K' },
      { id: 'D', text: '1.400 kJ/kg·K' }
    ],
    correctChoiceId: 'A',
    explanation: 'For air, R = R_bar / M = 8.314 / 28.97 = 0.287 kJ/(kg·K) (or 287 J/(kg·K)), a foundational constant in gas power calculations.'
  },
  {
    id: 'thermo-q-010',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 10,
    question: 'What relationship (Mayer’s relation) links constant-pressure specific heat C_p, constant-volume specific heat C_v, and gas constant R for an ideal gas?',
    choices: [
      { id: 'A', text: 'C_p + C_v = R' },
      { id: 'B', text: 'C_p - C_v = R' },
      { id: 'C', text: 'C_p / C_v = R' },
      { id: 'D', text: 'C_v - C_p = R' }
    ],
    correctChoiceId: 'B',
    explanation: 'Mayer’s equation for an ideal gas states C_p - C_v = R, and the specific heat ratio is k = C_p / C_v (k = 1.4 for air at room temperature).'
  },
  {
    id: 'thermo-q-011',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 11,
    question: 'What is a thermodynamic process that takes place at constant volume called?',
    choices: [
      { id: 'A', text: 'Isobaric process' },
      { id: 'B', text: 'Isochoric (isometric) process' },
      { id: 'C', text: 'Isothermal process' },
      { id: 'D', text: 'Isentropic process' }
    ],
    correctChoiceId: 'B',
    explanation: 'An isochoric (or isometric) process occurs at constant volume (dV = 0), so boundary work is zero (W = 0) and Q = Delta_U = m * C_v * Delta_T.'
  },
  {
    id: 'thermo-q-012',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 12,
    question: 'What is the boundary work done by an ideal gas during a constant-pressure (isobaric) expansion from V1 to V2?',
    choices: [
      { id: 'A', text: 'W = 0' },
      { id: 'B', text: 'W = P * (V2 - V1)' },
      { id: 'C', text: 'W = P * ln(V2 / V1)' },
      { id: 'D', text: 'W = (P2 * V2 - P1 * V1) / (1 - k)' }
    ],
    correctChoiceId: 'B',
    explanation: 'In an isobaric process, pressure P is constant, so boundary work integral is W = integral(P dV) = P * (V2 - V1) = m * R * (T2 - T1).'
  },
  {
    id: 'thermo-q-013',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 13,
    question: 'In an isothermal process for an ideal gas, what is the change in internal energy Delta_U?',
    choices: [
      { id: 'A', text: 'Delta_U = m * C_p * Delta_T' },
      { id: 'B', text: 'Zero (Delta_U = 0)' },
      { id: 'C', text: 'Equal to boundary work W' },
      { id: 'D', text: 'Delta_U = P * Delta_V' }
    ],
    correctChoiceId: 'B',
    explanation: "According to Joule's law, internal energy of an ideal gas depends solely on temperature: since T is constant, Delta_U = 0 and Q = W."
  },
  {
    id: 'thermo-q-014',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 14,
    question: 'What is a thermodynamic process in which there is no heat transfer into or out of the system (Q = 0)?',
    choices: [
      { id: 'A', text: 'Isothermal' },
      { id: 'B', text: 'Adiabatic' },
      { id: 'C', text: 'Isochoric' },
      { id: 'D', text: 'Polytropic with n = 0' }
    ],
    correctChoiceId: 'B',
    explanation: 'An adiabatic process is one where the system boundary is thermally insulated or the process occurs so rapidly that heat transfer Q = 0.'
  },
  {
    id: 'thermo-q-015',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 15,
    question: 'What is a reversible adiabatic process also called?',
    choices: [
      { id: 'A', text: 'Isenthalpic process' },
      { id: 'B', text: 'Isentropic process' },
      { id: 'C', text: 'Isometric process' },
      { id: 'D', text: 'Isothermal process' }
    ],
    correctChoiceId: 'B',
    explanation: 'Since dS = dQ_rev / T and dQ_rev = 0, a reversible adiabatic process maintains constant entropy (S1 = S2) and is called isentropic.'
  },
  {
    id: 'thermo-q-016',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 16,
    question: 'What is the pressure-volume relation for an ideal gas undergoing a reversible adiabatic (isentropic) process?',
    choices: [
      { id: 'A', text: 'P * V = constant' },
      { id: 'B', text: 'P * V^k = constant' },
      { id: 'C', text: 'P / V = constant' },
      { id: 'D', text: 'P * T = constant' }
    ],
    correctChoiceId: 'B',
    explanation: 'For an isentropic ideal gas process, P * V^k = constant, where k = C_p / C_v is the adiabatic index or specific heat ratio.'
  },
  {
    id: 'thermo-q-017',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 17,
    question: 'Which statement of the Second Law of Thermodynamics states that it is impossible for any device operating on a thermodynamic cycle to receive heat from a single reservoir and produce a net amount of work?',
    choices: [
      { id: 'A', text: 'Kelvin-Planck statement' },
      { id: 'B', text: 'Clausius statement' },
      { id: 'C', text: 'Nernst statement' },
      { id: 'D', text: 'Caratheodory statement' }
    ],
    correctChoiceId: 'A',
    explanation: 'The Kelvin-Planck statement asserts that no heat engine can have a thermal efficiency of 100%; some heat Q_L must be rejected to a low-temperature sink.'
  },
  {
    id: 'thermo-q-018',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 18,
    question: 'Which statement of the Second Law of Thermodynamics asserts that it is impossible to construct a cyclic device that transfers heat from a colder body to a hotter body without requiring external work input?',
    choices: [
      { id: 'A', text: 'Kelvin-Planck statement' },
      { id: 'B', text: 'Clausius statement' },
      { id: 'C', text: 'Avogadro statement' },
      { id: 'D', text: 'Carnot statement' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Clausius statement dictates that heat cannot spontaneously flow from a colder medium to a warmer medium without net work input (as in refrigerators).'
  },
  {
    id: 'thermo-q-019',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 19,
    question: 'What is the maximum theoretical thermal efficiency of any heat engine operating between absolute temperature reservoirs T_H (hot) and T_L (cold)?',
    choices: [
      { id: 'A', text: 'eta = 1 - (T_H / T_L)' },
      { id: 'B', text: 'eta = 1 - (T_L / T_H)' },
      { id: 'C', text: 'eta = (T_H - T_L) / T_L' },
      { id: 'D', text: 'eta = T_L / T_H' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Carnot efficiency is the upper limit for all heat engines: eta_Carnot = 1 - (T_L / T_H) = (T_H - T_L) / T_H, with temperatures in Kelvin.'
  },
  {
    id: 'thermo-q-020',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 20,
    question: 'What four reversible processes comprise the idealized Carnot cycle?',
    choices: [
      { id: 'A', text: 'Two isochoric and two isobaric processes' },
      { id: 'B', text: 'Two isothermal and two isentropic (reversible adiabatic) processes' },
      { id: 'C', text: 'Two isobaric and two isentropic processes' },
      { id: 'D', text: 'Two isothermal and two isometric processes' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Carnot cycle consists of: 1) reversible isothermal expansion, 2) isentropic expansion, 3) reversible isothermal compression, and 4) isentropic compression.'
  },
  {
    id: 'thermo-q-021',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 21,
    question: 'What thermodynamic property is a quantitative measure of microscopic molecular randomness, disorder, and process irreversibility in a system?',
    choices: [
      { id: 'A', text: 'Internal energy' },
      { id: 'B', text: 'Enthalpy' },
      { id: 'C', text: 'Entropy' },
      { id: 'D', text: 'Exergy' }
    ],
    correctChoiceId: 'C',
    explanation: 'Entropy S is defined differentially as dS = (dQ_rev / T), quantifying system degradation, irreversibility, and microscopic disorder.'
  },
  {
    id: 'thermo-q-022',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 22,
    question: 'According to the Third Law of Thermodynamics, what is the entropy of a pure crystalline substance at absolute zero temperature (0 Kelvin)?',
    choices: [
      { id: 'A', text: 'Infinite' },
      { id: 'B', text: 'Exactly zero' },
      { id: 'C', text: '1.0 kJ/kg·K' },
      { id: 'D', text: 'Negative 273.15 J/K' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Third Law states that the entropy of a perfectly crystalline substance is identically zero at absolute zero temperature (0 K or -273.15°C).'
  },
  {
    id: 'thermo-q-023',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 23,
    question: 'What is the relationship between the Coefficient of Performance of a heat pump (COP_HP) and that of a refrigerator (COP_R) operating between the same two temperatures?',
    choices: [
      { id: 'A', text: 'COP_HP = COP_R - 1' },
      { id: 'B', text: 'COP_HP = COP_R + 1' },
      { id: 'C', text: 'COP_HP = 1 / COP_R' },
      { id: 'D', text: 'COP_HP = COP_R' }
    ],
    correctChoiceId: 'B',
    explanation: 'Because Q_H = Q_L + W_net, COP_HP = Q_H / W_net = (Q_L + W_net) / W_net = COP_R + 1, so heat pump COP always exceeds refrigerator COP by 1.'
  },
  {
    id: 'thermo-q-024',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 24,
    question: 'What ideal thermodynamic cycle serves as the standard analysis model for four-stroke spark-ignition (petrol/gasoline) internal combustion engines?',
    choices: [
      { id: 'A', text: 'Diesel cycle' },
      { id: 'B', text: 'Otto cycle' },
      { id: 'C', text: 'Rankine cycle' },
      { id: 'D', text: 'Brayton cycle' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Otto cycle is the ideal air-standard cycle for spark-ignition engines, featuring constant-volume (isochoric) heat addition and heat rejection.'
  },
  {
    id: 'thermo-q-025',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 25,
    question: 'What is the thermal efficiency of an air-standard Otto cycle with compression ratio r and specific heat ratio k?',
    choices: [
      { id: 'A', text: 'eta = 1 - (1 / r^(k - 1))' },
      { id: 'B', text: 'eta = 1 - r^(k - 1)' },
      { id: 'C', text: 'eta = 1 - (1 / r^k)' },
      { id: 'D', text: 'eta = 1 - (r / k)' }
    ],
    correctChoiceId: 'A',
    explanation: 'Otto cycle efficiency is given by eta = 1 - [1 / (r^(k-1))], showing that higher compression ratio r increases thermal efficiency.'
  },
  {
    id: 'thermo-q-026',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 26,
    question: 'How does heat addition occur in an idealized Diesel cycle?',
    choices: [
      { id: 'A', text: 'At constant volume' },
      { id: 'B', text: 'At constant pressure' },
      { id: 'C', text: 'At constant temperature' },
      { id: 'D', text: 'At constant entropy' }
    ],
    correctChoiceId: 'B',
    explanation: 'In the ideal Diesel cycle, fuel is injected and burns during expansion such that heat addition occurs at constant pressure (isobaric).'
  },
  {
    id: 'thermo-q-027',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 27,
    question: 'What ideal cycle is the basis for gas turbine power plants and jet aircraft propulsion engines?',
    choices: [
      { id: 'A', text: 'Rankine cycle' },
      { id: 'B', text: 'Brayton cycle (Joule cycle)' },
      { id: 'C', text: 'Stirling cycle' },
      { id: 'D', text: 'Ericsson cycle' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Brayton cycle models gas turbines and jet engines, consisting of isentropic compression, isobaric combustion, isentropic expansion, and isobaric exhaust.'
  },
  {
    id: 'thermo-q-028',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 28,
    question: 'What ideal thermodynamic vapor power cycle is the basis for modern thermal power plants using steam turbines?',
    choices: [
      { id: 'A', text: 'Brayton cycle' },
      { id: 'B', text: 'Rankine cycle' },
      { id: 'C', text: 'Otto cycle' },
      { id: 'D', text: 'Atkinson cycle' }
    ],
    correctChoiceId: 'B',
    explanation: 'The Rankine cycle is the idealized vapor cycle for steam electrical generating stations, comprising a pump, boiler, turbine, and condenser.'
  },
  {
    id: 'thermo-q-029',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 29,
    question: 'What is the state of a substance at which the saturated liquid and saturated vapor states become completely identical and indistinguishable?',
    choices: [
      { id: 'A', text: 'Triple point' },
      { id: 'B', text: 'Critical point' },
      { id: 'C', text: 'Boiling point' },
      { id: 'D', text: 'Sublimation point' }
    ],
    correctChoiceId: 'B',
    explanation: 'At the critical point (for water: 374°C, 22.06 MPa), the enthalpy of vaporization becomes zero and distinct liquid-vapor meniscus disappears.'
  },
  {
    id: 'thermo-q-030',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 30,
    question: 'What is the unique state of pressure and temperature where solid, liquid, and vapor phases coexist in thermodynamic equilibrium?',
    choices: [
      { id: 'A', text: 'Critical point' },
      { id: 'B', text: 'Triple point' },
      { id: 'C', text: 'Sublimation line' },
      { id: 'D', text: 'Eutectic point' }
    ],
    correctChoiceId: 'B',
    explanation: 'The triple point of water occurs at exactly 0.01°C (273.16 K) and 0.6117 kPa, where ice, liquid water, and steam coexist stably.'
  },
  {
    id: 'thermo-q-031',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 31,
    question: 'What is dryness fraction (steam quality x) defined as in a two-phase liquid-vapor mixture?',
    choices: [
      { id: 'A', text: 'Ratio of mass of saturated vapor to total mass of the mixture (m_v / m_total)' },
      { id: 'B', text: 'Ratio of mass of liquid to mass of vapor' },
      { id: 'C', text: 'Ratio of vapor volume to liquid volume' },
      { id: 'D', text: 'Percentage of water evaporated per second' }
    ],
    correctChoiceId: 'A',
    explanation: 'Quality x = m_vapor / (m_liquid + m_vapor), ranging from 0 for saturated liquid to 1 for saturated dry vapor.'
  },
  {
    id: 'thermo-q-032',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 32,
    question: 'In an adiabatic steady-flow throttling valve or porous plug process with negligible kinetic and potential energy changes, what property remains constant?',
    choices: [
      { id: 'A', text: 'Temperature (isothermal)' },
      { id: 'B', text: 'Entropy (isentropic)' },
      { id: 'C', text: 'Enthalpy (isenthalpic, h1 = h2)' },
      { id: 'D', text: 'Pressure (isobaric)' }
    ],
    correctChoiceId: 'C',
    explanation: 'A throttling expansion through a restriction is an isenthalpic process (h1 = h2), causing significant pressure drop with no shaft work.'
  },
  {
    id: 'thermo-q-033',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 33,
    question: 'What is the rate of heat conduction through a plane wall of area A and thickness L with thermal conductivity k under temperature difference Delta_T (Fourier’s Law)?',
    choices: [
      { id: 'A', text: 'Q_dot = (k * A * Delta_T) / L' },
      { id: 'B', text: 'Q_dot = (k * L * Delta_T) / A' },
      { id: 'C', text: 'Q_dot = k * A * L * Delta_T' },
      { id: 'D', text: 'Q_dot = (A * Delta_T) / (k * L)' }
    ],
    correctChoiceId: 'A',
    explanation: "Fourier's Law of heat conduction states that heat transfer rate is Q_dot = (k * A * Delta_T) / L, where k is thermal conductivity."
  },
  {
    id: 'thermo-q-034',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 34,
    question: 'What law governs the rate of convective heat transfer between a solid surface at temperature T_s and a surrounding moving fluid at T_infinity?',
    choices: [
      { id: 'A', text: "Fourier's Law" },
      { id: 'B', text: "Newton's Law of Cooling" },
      { id: 'C', text: "Stefan-Boltzmann Law" },
      { id: 'D', text: "Planck's Law" }
    ],
    correctChoiceId: 'B',
    explanation: "Newton's Law of Cooling states Q_dot = h * A * (T_s - T_infinity), where h is the convection heat transfer coefficient."
  },
  {
    id: 'thermo-q-035',
    subject: 'Thermodynamics',
    sourceFileName: 'ESAS_Thermodynamics_Board_Reviewer.pdf',
    questionNumber: 35,
    question: 'What law states that the total emissive power of a blackbody is directly proportional to the fourth power of its absolute thermodynamic temperature (E_b = sigma * T⁴)?',
    choices: [
      { id: 'A', text: "Wien's Displacement Law" },
      { id: 'B', text: "Stefan-Boltzmann Law" },
      { id: 'C', text: "Kirchhoff's Law" },
      { id: 'D', text: "Lambert's Cosine Law" }
    ],
    correctChoiceId: 'B',
    explanation: 'The Stefan-Boltzmann Law states that thermal radiation emitted by a blackbody is E_b = sigma * T⁴, where sigma = 5.67 x 10⁻⁸ W/(m²·K⁴).'
  }
];
