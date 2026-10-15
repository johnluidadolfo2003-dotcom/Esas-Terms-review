import { FlashcardQuestion, shuffleQuestionChoices } from '../services/questionParser';

const RAW_PEC_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'pec-1',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 1,
    question: 'Flat conductor cable (FCC) system shall NOT be used in the locations enumerated below EXCEPT one. Which one is this?',
    choices: [{ id: 'A', text: 'Damp locations' }, { id: 'B', text: 'Locations where subject to corrosive vapors' }, { id: 'C', text: 'Outdoors' }, { id: 'D', text: 'Residential buildings' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-2',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 2,
    question: 'A run conduit between outlets, between fittings, between outlet and fitting shall not contain more than the equivalent of ______ quarterbends.',
    choices: [{ id: 'A', text: '4' }, { id: 'B', text: '2' }, { id: 'C', text: '3' }, { id: 'D', text: '5' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-3',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 3,
    question: 'This is a single conductor or multi-conductor assembly provided with or without an overall covering, primarily used for service.',
    choices: [{ id: 'A', text: 'Service Entrance Cable' }, { id: 'B', text: 'Clad Cable' }, { id: 'C', text: 'Flat Conductor Cable' }, { id: 'D', text: 'Tray Cable' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-4',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 4,
    question: 'Flexible cords used in locations where there is a lot flying lint or fibers shall comply with the following EXCEPT one. Which one is this?',
    choices: [
      { id: 'A', text: 'It shall be of type approved for extra hard usage' },
      { id: 'B', text: 'It shall be approved for use in locations which are vapor filled' },
      { id: 'C', text: 'It shall contain in addition to the conductors, a grounding conductor' },
      { id: 'D', text: 'It shall be provided with suitable seal to prevent the entrance of dust' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-5',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 5,
    question: 'A point at which the load of a given area is assumed to be concentrated.',
    choices: [{ id: 'A', text: 'Load Center' }, { id: 'B', text: 'Switchboard' }, { id: 'C', text: 'Outlet' }, { id: 'D', text: 'Panel Board' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-6',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 6,
    question: 'The multiplying factor for determining the maximum branch circuit rating for non-time delay fuse protection of motor branch circuit is',
    choices: [{ id: 'A', text: '300 %' }, { id: 'B', text: '150 %' }, { id: 'C', text: '175 %' }, { id: 'D', text: '250 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-7',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 7,
    question: 'For banks, the general lighting load shall be computed at ______ per square meter of the floor area.',
    choices: [{ id: 'A', text: '28 VA' }, { id: 'B', text: '20 VA' }, { id: 'C', text: '24 VA' }, { id: 'D', text: '30 VA' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-8',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 8,
    question: 'In dwelling units, the computed lighting and small appliance load portion above 120,000 volt-amperes shall be computed at what demand factor?',
    choices: [{ id: 'A', text: '25 %' }, { id: 'B', text: '20 %' }, { id: 'C', text: '45 %' }, { id: 'D', text: '35 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-9',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 9,
    question: 'Which of the following statements is NOT one of the primary objectives of the Philippine Electrical Code?',
    choices: [
      { id: 'A', text: 'None of these (all listed are objectives)' },
      { id: 'B', text: 'To establish electrical work standards' },
      { id: 'C', text: 'To ensure safety in using electricity' },
      { id: 'D', text: 'To establish basic material qualities' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-10',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 10,
    question: 'Unit assemblies of trough section and fittings forming a rigid structural system used to securely fasten or support cables and raceways are called:',
    choices: [{ id: 'A', text: 'Cable Trays' }, { id: 'B', text: 'Wireways' }, { id: 'C', text: 'Busways' }, { id: 'D', text: 'Non-Metallic Extensions' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-11',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 11,
    question: 'Which of the following is not a required standard content of a formal electrical working plan drawing?',
    choices: [{ id: 'A', text: 'Schedule of maintenance' }, { id: 'B', text: 'Location of plan' }, { id: 'C', text: 'Legend and general notes' }, { id: 'D', text: 'Specifications' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-12',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 12,
    question: 'When installing cables or raceways parallel to framing members like studs or joists, nearest outside surface of cable/raceway shall NOT be less than what distance from edge?',
    choices: [{ id: 'A', text: '50 mm' }, { id: 'B', text: '10 mm' }, { id: 'C', text: '20 mm' }, { id: 'D', text: '30 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-13',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 13,
    question: 'Which of the following is NOT a standard ampere rating of a fuse or circuit breaker?',
    choices: [{ id: 'A', text: '55 A' }, { id: 'B', text: '45 A' }, { id: 'C', text: '60 A' }, { id: 'D', text: '125 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-14',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 14,
    question: 'The minimum size of copper wire used in general building interior wiring is 2.0 mm^2 (former #14 AWG). Its conductor diameter is approx:',
    choices: [{ id: 'A', text: '1.6 mm' }, { id: 'B', text: '2.0 mm' }, { id: 'C', text: '2.6 mm' }, { id: 'D', text: '3.2 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-15',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 15,
    question: 'Each transformer up to 600 V nominal shall be protected by an individual overcurrent device on the primary side at not more than what percentage of rated primary current?',
    choices: [{ id: 'A', text: '125 %' }, { id: 'B', text: '100 %' }, { id: 'C', text: '110 %' }, { id: 'D', text: '140 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-16',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 16,
    question: 'For grounding electrode to which mobile equipment system neutral impedance is connected, it shall be isolated from ground by at least what distance from other grounding electrodes?',
    choices: [{ id: 'A', text: '6000 mm' }, { id: 'B', text: '3000 mm' }, { id: 'C', text: '4000 mm' }, { id: 'D', text: '5000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-17',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 17,
    question: 'Most building wires used in residential house wiring are insulated by',
    choices: [{ id: 'A', text: 'Thermoplastic (PVC)' }, { id: 'B', text: 'Asbestos' }, { id: 'C', text: 'Cotton' }, { id: 'D', text: 'Varnished cambric' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-18',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 18,
    question: 'Which of the raceway methods is NOT allowed to be used in Class I hazardous locations?',
    choices: [{ id: 'A', text: 'Rigid non-metallic conduit (PVC)' }, { id: 'B', text: 'Rigid metal conduit' }, { id: 'C', text: 'Liquid-tight flexible metal conduit' }, { id: 'D', text: 'None of these' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-19',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 19,
    question: 'Locations which are hazardous because of the presence of easily ignitable fibers or flyings are categorized as:',
    choices: [{ id: 'A', text: 'Class III' }, { id: 'B', text: 'Class I' }, { id: 'C', text: 'Class II' }, { id: 'D', text: 'Class IV' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-20',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 20,
    question: 'The branch circuit conductors that supply one or more units of data processing systems shall have an ampacity NOT less than what percent of connected load?',
    choices: [{ id: 'A', text: '125 %' }, { id: 'B', text: '100 %' }, { id: 'C', text: '150 %' }, { id: 'D', text: '200 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-21',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 21,
    question: 'Explosion hazards exist due to presence of the following materials EXCEPT one. Which one is this?',
    choices: [{ id: 'A', text: 'Carbon dioxide gas' }, { id: 'B', text: 'Combustible dust' }, { id: 'C', text: 'Flammable vapors' }, { id: 'D', text: 'Flammable liquids' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-22',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 22,
    question: 'Some principal factors affecting operating temperature of a cable include ambient temp, load current, thermal resistance. Which is NOT a primary thermal factor?',
    choices: [{ id: 'A', text: 'Ventilation' }, { id: 'B', text: 'Ambient temperature' }, { id: 'C', text: 'Load current' }, { id: 'D', text: 'System operating voltage' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-23',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 23,
    question: 'What is the maximum operating temperature rating of THHN insulation in dry locations?',
    choices: [{ id: 'A', text: '90°C' }, { id: 'B', text: '60°C' }, { id: 'C', text: '75°C' }, { id: 'D', text: '85°C' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-24',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 24,
    question: 'No motor circuit in any watercraft shall have conductors less than what size?',
    choices: [{ id: 'A', text: '2.00 mm^2' }, { id: 'B', text: '1.25 mm^2' }, { id: 'C', text: '3.50 mm^2' }, { id: 'D', text: '5.50 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-25',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 25,
    question: 'Liquid-filled transformers installed in vaults shall comply with safety rules EXCEPT:',
    choices: [
      { id: 'A', text: 'There shall be a robust door between vault and non-hazardous location' },
      { id: 'B', text: 'Ample ventilation shall be provided' },
      { id: 'C', text: 'Vent openings shall lead outside the building' },
      { id: 'D', text: 'All vent ducts shall be sufficient area for pressure relief' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-26',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 26,
    question: 'Surface non-metallic raceways MAY be used in which location?',
    choices: [{ id: 'A', text: 'In dry locations' }, { id: 'B', text: 'Where concealed' }, { id: 'C', text: 'Where subject to severe physical damage' }, { id: 'D', text: 'In hoistways' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-27',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 27,
    question: 'Which location does NOT permit the installation of PVC rigid nonmetallic conduit?',
    choices: [{ id: 'A', text: 'Class I Hazardous locations (unless specifically listed)' }, { id: 'B', text: 'Corrosive locations' }, { id: 'C', text: 'Wet locations' }, { id: 'D', text: 'In concealed locations' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-28',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 28,
    question: 'A short length of a conductor used to make a connection between terminals or around a break in a circuit.',
    choices: [{ id: 'A', text: 'Jumper' }, { id: 'B', text: 'Guy' }, { id: 'C', text: 'Tie wire' }, { id: 'D', text: 'Bonding conductor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-29',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 29,
    question: 'A storage battery supplying emergency lighting and power shall maintain no less than 87.5% of full voltage at total load for a minimum period of:',
    choices: [{ id: 'A', text: '1.5 hours (90 minutes)' }, { id: 'B', text: '1.0 hour' }, { id: 'C', text: '2.0 hours' }, { id: 'D', text: '2.5 hours' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-30',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 30,
    question: 'The minimum size of a copper equipment grounding conductor for a 40-ampere overcurrent protected circuit is:',
    choices: [{ id: 'A', text: '5.5 mm^2' }, { id: 'B', text: '14 mm^2' }, { id: 'C', text: '8.0 mm^2' }, { id: 'D', text: '22 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-31',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 31,
    question: 'The minimum length of free conductor to be left at each outlet box for splices and device connections is:',
    choices: [{ id: 'A', text: '150 mm' }, { id: 'B', text: '80 mm' }, { id: 'C', text: '100 mm' }, { id: 'D', text: '120 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-32',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 32,
    question: 'In concealed knob and tube wiring, the minimum clearance maintained between open conductors is:',
    choices: [{ id: 'A', text: '76 mm' }, { id: 'B', text: '45 mm' }, { id: 'C', text: '50 mm' }, { id: 'D', text: '66 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-33',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 33,
    question: 'Supports for armored cable (Type AC) should be provided at intervals not exceeding:',
    choices: [{ id: 'A', text: '1300 mm' }, { id: 'B', text: '1000 mm' }, { id: 'C', text: '1500 mm' }, { id: 'D', text: '1400 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-34',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 34,
    question: 'In rigid metal conduit wiring, the minimum trade size of conduit permitted is:',
    choices: [{ id: 'A', text: '15 mm (1/2 in.)' }, { id: 'B', text: '20 mm' }, { id: 'C', text: '25 mm' }, { id: 'D', text: '32 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-35',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 35,
    question: 'The lowest standard ampere rating of a service disconnect or main circuit breaker switch listed is:',
    choices: [{ id: 'A', text: '30 A' }, { id: 'B', text: '20 A' }, { id: 'C', text: '60 A' }, { id: 'D', text: '15 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-36',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 36,
    question: 'For a two-wire FCC cable system with grounding, the grounding conductor shall be _________ conductor.',
    choices: [{ id: 'A', text: 'the rightmost' }, { id: 'B', text: 'the middle' }, { id: 'C', text: 'the leftmost' }, { id: 'D', text: 'any' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-37',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 37,
    question: 'Conductors in concealed knob and tube wiring passing through wood members shall be protected by insulating tubes extending NOT less than _____ beyond wood.',
    choices: [{ id: 'A', text: '76 mm' }, { id: 'B', text: '80 mm' }, { id: 'C', text: '70 mm' }, { id: 'D', text: '64 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-38',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 38,
    question: 'Before an ammeter is disconnected from an energized current transformer (CT) circuit, what safety procedure must be done first?',
    choices: [
      { id: 'A', text: 'Secondary winding should be short-circuited' },
      { id: 'B', text: 'Primary winding should be shorted' },
      { id: 'C', text: 'Secondary winding should be opened' },
      { id: 'D', text: 'Primary winding should be opened' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-39',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 39,
    question: 'Power conductors on utility poles located below communication conductors shall maintain a vertical spacing distance of at least:',
    choices: [{ id: 'A', text: '600 mm' }, { id: 'B', text: '760 mm' }, { id: 'C', text: '800 mm' }, { id: 'D', text: '540 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-40',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 40,
    question: 'Whose signatures are required on the official application form for an electrical permit?',
    choices: [
      { id: 'A', text: 'All of these' },
      { id: 'B', text: 'Owner or authorized representative' },
      { id: 'C', text: 'PEE who signed and sealed the plans' },
      { id: 'D', text: 'Licensed electrical practitioner in-charge' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-41',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 41,
    question: 'In power resistor installations, a thermal barrier is required if clearance between resistors and combustible material is less than:',
    choices: [{ id: 'A', text: '300 mm' }, { id: 'B', text: '150 mm' }, { id: 'C', text: '200 mm' }, { id: 'D', text: '250 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-42',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 42,
    question: 'Conductor splices and taps shall be made only in _____ approved enclosures.',
    choices: [{ id: 'A', text: 'junction boxes / splice boxes' }, { id: 'B', text: 'cut-out boxes' }, { id: 'C', text: 'pull boxes' }, { id: 'D', text: 'panelboards' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-43',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 43,
    question: 'In estimating branch circuit loads, what VA rating is assigned for each general receptacle outlet?',
    choices: [{ id: 'A', text: '180 volt-ampere' }, { id: 'B', text: '160 volt-ampere' }, { id: 'C', text: '120 volt-ampere' }, { id: 'D', text: '150 volt-ampere' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-44',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 44,
    question: 'Nails used as fastening means inside enclosures shall not pass through interior unless located within what distance from back/ends?',
    choices: [{ id: 'A', text: '6.4 mm' }, { id: 'B', text: '8.0 mm' }, { id: 'C', text: '6.0 mm' }, { id: 'D', text: '7.5 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-45',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 45,
    question: 'What is the minimum insulation resistance required for a building\'s electrical wiring using 2.0 mm^2 or 3.5 mm^2 conductors?',
    choices: [{ id: 'A', text: '500,000 ohms (0.5 MΩ)' }, { id: 'B', text: '250,000 ohms' }, { id: 'C', text: '1,000,000 ohms' }, { id: 'D', text: '750,000 ohms' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-46',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 46,
    question: 'For underground feeder and branch circuits, what type of cable shall be used?',
    choices: [{ id: 'A', text: 'Type UF' }, { id: 'B', text: 'Type MI' }, { id: 'C', text: 'Type USE' }, { id: 'D', text: 'Type XHH' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-47',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 47,
    question: 'Wirings allowed to be installed outside buildings include the following EXCEPT:',
    choices: [{ id: 'A', text: 'Flat conductor cable' }, { id: 'B', text: 'Type MC cable' }, { id: 'C', text: 'Rigid metal conduit' }, { id: 'D', text: 'Open wires on insulators' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-48',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 48,
    question: 'Where live parts are exposed on the front of switchboards or MCCs, working space in front shall NOT be less than:',
    choices: [{ id: 'A', text: '1,000 mm' }, { id: 'B', text: '2,000 mm' }, { id: 'C', text: '500 mm' }, { id: 'D', text: '1,500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-49',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 49,
    question: 'The inner central core strand of ACSR conductor is made of',
    choices: [{ id: 'A', text: 'steel' }, { id: 'B', text: 'brass' }, { id: 'C', text: 'copper' }, { id: 'D', text: 'lead' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-50',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 50,
    question: 'General lighting branch circuits shall be protected by overcurrent devices rated not more than:',
    choices: [{ id: 'A', text: '20 A' }, { id: 'B', text: '40 A' }, { id: 'C', text: '50 A' }, { id: 'D', text: '30 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-51',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 51,
    question: 'The grounding electrode for communication systems may be connected to accessible locations EXCEPT:',
    choices: [
      { id: 'A', text: 'Buried interior PVC pipe' },
      { id: 'B', text: 'Metal water piping system' },
      { id: 'C', text: 'Grounding electrode conductor' },
      { id: 'D', text: 'Building structure grounding' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-52',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 52,
    question: 'A conductor consisting of a group of wires twisted together is called:',
    choices: [{ id: 'A', text: 'Stranded wire' }, { id: 'B', text: 'Solid wire' }, { id: 'C', text: 'Loomex wire' }, { id: 'D', text: 'Duplex wire' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-53',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 53,
    question: 'For a motor controller to be considered "in sight from" the controlled motor, distance shall NOT exceed:',
    choices: [{ id: 'A', text: '15 meters' }, { id: 'B', text: '25 meters' }, { id: 'C', text: '10 meters' }, { id: 'D', text: '20 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-54',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 54,
    question: 'In rigid metal wiring, conduits shall be supported at least every:',
    choices: [{ id: 'A', text: '3,000 mm' }, { id: 'B', text: '3,500 mm' }, { id: 'C', text: '2,500 mm' }, { id: 'D', text: '2,000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-55',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 55,
    question: 'Where conduits enter a switchboard at the bottom, minimum spacing between bottom enclosure and uninsulated busbars is:',
    choices: [{ id: 'A', text: '255 mm' }, { id: 'B', text: '200 mm' }, { id: 'C', text: '300 mm' }, { id: 'D', text: '155 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-56',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 56,
    question: 'Vertical clearance of service drop conductors above roofs shall NOT be less than:',
    choices: [{ id: 'A', text: '2,500 mm' }, { id: 'B', text: '3,000 mm' }, { id: 'C', text: '2,750 mm' }, { id: 'D', text: '2,000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-57',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 57,
    question: 'An exposed wiring support system using a messenger wire to support insulated conductors is:',
    choices: [{ id: 'A', text: 'Messenger supported wiring' }, { id: 'B', text: 'Messenger cable wiring' }, { id: 'C', text: 'Concealed knob and tube' }, { id: 'D', text: 'Metal clad wiring' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-58',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 58,
    question: 'A circuit breaker that utilizes dry, high-pressure compressed air to extinguish the arc is called:',
    choices: [{ id: 'A', text: 'Air blast type Circuit Breaker' }, { id: 'B', text: 'Air Circuit Breaker' }, { id: 'C', text: 'Gas type Circuit Breaker' }, { id: 'D', text: 'Vacuum Circuit Breaker' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-59',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 59,
    question: 'The term given to an insulated stranded wire flexible assembly used for portable appliances is:',
    choices: [{ id: 'A', text: 'cord' }, { id: 'B', text: 'cable' }, { id: 'C', text: 'busbar' }, { id: 'D', text: 'wireway' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-60',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 60,
    question: 'The Philippine Electrical Code Part 1 does NOT cover wiring or equipment installed within:',
    choices: [{ id: 'A', text: 'Airplanes' }, { id: 'B', text: 'Watercrafts' }, { id: 'C', text: 'Mobile homes' }, { id: 'D', text: 'Trailers' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-61',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 61,
    question: 'A protective device for limiting surge voltages by discharging or bypassing surge current is:',
    choices: [{ id: 'A', text: 'Surge Arrester' }, { id: 'B', text: 'Circuit Breaker' }, { id: 'C', text: 'Lightning rod' }, { id: 'D', text: 'Thermocouple' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-62',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 62,
    question: 'Communication conductors shall have a vertical clearance of NOT less than _____ from all points of roofs above which they pass.',
    choices: [{ id: 'A', text: '2,400 mm' }, { id: 'B', text: '2,200 mm' }, { id: 'C', text: '2,000 mm' }, { id: 'D', text: '2,500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-63',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 63,
    question: 'A branch circuit that supplies a number of outlets for lighting and appliances is called:',
    choices: [{ id: 'A', text: 'General purpose branch circuit' }, { id: 'B', text: 'Multi-purpose branch circuit' }, { id: 'C', text: 'Special branch circuit' }, { id: 'D', text: 'Individual branch circuit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-64',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 64,
    question: 'Non-metallic outlet boxes not over _____ cu. cm shall be permitted only on non-metallic wiring methods.',
    choices: [{ id: 'A', text: '1,640' }, { id: 'B', text: '1,725' }, { id: 'C', text: '1,520' }, { id: 'D', text: '1,700' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-65',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 65,
    question: 'According to material makeup, conduits may be classified as:',
    choices: [{ id: 'A', text: 'all of these' }, { id: 'B', text: 'flexible metal' }, { id: 'C', text: 'rigid non-metal' }, { id: 'D', text: 'rigid metal' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-66',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 66,
    question: 'Hazardous locations where flammable gases or vapors are present in air in ignitable quantities are:',
    choices: [{ id: 'A', text: 'Class I' }, { id: 'B', text: 'Class II' }, { id: 'C', text: 'Class III' }, { id: 'D', text: 'Class IV' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-67',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 67,
    question: 'What is the maximum total allowable voltage drop from distribution panel to farthest load?',
    choices: [{ id: 'A', text: '5 %' }, { id: 'B', text: '10 %' }, { id: 'C', text: '3 %' }, { id: 'D', text: '2 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-68',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 68,
    question: 'Overcurrent in transformers causes thermal and magnetic degradation EXCEPT:',
    choices: [{ id: 'A', text: 'breaker effectiveness' }, { id: 'B', text: 'mechanical stress' }, { id: 'C', text: 'life insulation reduction' }, { id: 'D', text: 'rise in temperature' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-69',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 69,
    question: 'Bonding jumpers connecting communication grounding conductors to building grounding electrode shall NOT be smaller than:',
    choices: [{ id: 'A', text: '14 mm^2' }, { id: 'B', text: '5.5 mm^2' }, { id: 'C', text: '8.0 mm^2' }, { id: 'D', text: '3.5 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-70',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 70,
    question: 'In hospitals, general unit lighting load required per unit floor area is:',
    choices: [{ id: 'A', text: '16 VA/m^2' }, { id: 'B', text: '24 VA/m^2' }, { id: 'C', text: '12 VA/m^2' }, { id: 'D', text: '28 VA/m^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-71',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 71,
    question: 'In engineering drawings, title block margin strip width is standardized at:',
    choices: [{ id: 'A', text: '40 mm' }, { id: 'B', text: '45 mm' }, { id: 'C', text: '35 mm' }, { id: 'D', text: '30 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-72',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 72,
    question: 'Intermittent duty operation in which load condition is regularly recurrent is:',
    choices: [{ id: 'A', text: 'Periodic duty' }, { id: 'B', text: 'Short time duty' }, { id: 'C', text: 'Varying duty' }, { id: 'D', text: 'Continuous duty' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-73',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 73,
    question: 'Rod electrodes of steel or iron shall be at least ______ in diameter.',
    choices: [{ id: 'A', text: '16 mm (5/8 in.)' }, { id: 'B', text: '10 mm' }, { id: 'C', text: '12 mm' }, { id: 'D', text: '14 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-74',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 74,
    question: 'The minimum size of copper conductor permitted for general lighting branch circuits is:',
    choices: [{ id: 'A', text: '2.0 mm^2' }, { id: 'B', text: '1.5 mm^2' }, { id: 'C', text: '1.25 mm^2' }, { id: 'D', text: '1.75 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-75',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 75,
    question: 'The minimum vertical clearance of service drops above sidewalk pedestrian walkways is:',
    choices: [{ id: 'A', text: '3100 mm (10 ft)' }, { id: 'B', text: '12 ft' }, { id: 'C', text: '8 ft' }, { id: 'D', text: '14 ft' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-76',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 76,
    question: 'The outer jacket covering of type NM non-metallic sheathed cable shall be:',
    choices: [
      { id: 'A', text: 'flame retardant and moisture resistant' },
      { id: 'B', text: 'flame retardant and fungus resistant' },
      { id: 'C', text: 'flame retardant and corrosion resistant' },
      { id: 'D', text: 'none of these' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-77',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 77,
    question: 'An assembly of two insulating pieces with grooves holding conductors at fixed spacing is a:',
    choices: [{ id: 'A', text: 'Cleat' }, { id: 'B', text: 'Gutter' }, { id: 'C', text: 'Split knob' }, { id: 'D', text: 'Spool insulator' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-78',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 78,
    question: 'Type TC (tray cable) shall be permitted to be used in locations EXCEPT:',
    choices: [
      { id: 'A', text: 'where exposed to direct rays of sun unless marked sunlight resistant' },
      { id: 'B', text: 'in raceways' },
      { id: 'C', text: 'in cable trays in classified locations' },
      { id: 'D', text: 'for power and signal circuits' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-79',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 79,
    question: 'Single-phase supply conductors feeding a phase converter shall have an ampacity NOT less than what percent of full load current?',
    choices: [{ id: 'A', text: '216 %' }, { id: 'B', text: '350 %' }, { id: 'C', text: '240 %' }, { id: 'D', text: '173 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-80',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 80,
    question: 'The smallest trade size for rigid non-metallic conduit (PVC) is:',
    choices: [{ id: 'A', text: '20 mm' }, { id: 'B', text: '25 mm' }, { id: 'C', text: '12 mm' }, { id: 'D', text: '15 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-81',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 81,
    question: 'The branch circuit rating shall NOT be less than what percent of the non-continuous load?',
    choices: [{ id: 'A', text: '100 %' }, { id: 'B', text: '80 %' }, { id: 'C', text: '115 %' }, { id: 'D', text: '125 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-82',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 82,
    question: 'Continuous load on an overcurrent device in a panelboard shall NOT exceed what percent of its rating?',
    choices: [{ id: 'A', text: '80 %' }, { id: 'B', text: '90 %' }, { id: 'C', text: '100 %' }, { id: 'D', text: '125 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-83',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 83,
    question: 'Non-metallic raceways ARE permitted to be installed in:',
    choices: [{ id: 'A', text: 'Dry locations' }, { id: 'B', text: 'Where voltage > 300V without listing' }, { id: 'C', text: 'Hazardous locations unless permitted' }, { id: 'D', text: 'Severe physical damage area' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-84',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 84,
    question: 'What is the lowest acceptable dielectric strength of transformer oil permitted by standard PEC test?',
    choices: [{ id: 'A', text: '25,000 volts' }, { id: 'B', text: '22,000 volts' }, { id: 'C', text: '20,000 volts' }, { id: 'D', text: '17,500 volts' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-85',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 85,
    question: 'In any watercraft, receptacle outlets operating at _____ volts or more shall have a grounding pole.',
    choices: [{ id: 'A', text: '50 V' }, { id: 'B', text: '60 V' }, { id: 'C', text: '100 V' }, { id: 'D', text: '120 V' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-86',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 86,
    question: 'Wireways shall be supported at intervals NOT to exceed:',
    choices: [{ id: 'A', text: '1,500 mm' }, { id: 'B', text: '1,200 mm' }, { id: 'C', text: '2,000 mm' }, { id: 'D', text: '1,800 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-87',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 87,
    question: 'The maximum setting of equipment ground-fault protection on service disconnects rated 1000A or more is:',
    choices: [{ id: 'A', text: '1,200 amperes' }, { id: 'B', text: '1,800 amperes' }, { id: 'C', text: '1,500 amperes' }, { id: 'D', text: '1,400 amperes' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-88',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 88,
    question: 'The PEC Part 1 is intended as a mandatory safety code rather than an instruction manual for untrained persons. Statement "PEC is an instruction manual for unqualified persons" is:',
    choices: [{ id: 'A', text: 'FALSE' }, { id: 'B', text: 'TRUE' }, { id: 'C', text: 'Both I or II' }, { id: 'D', text: 'Either I or II' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-89',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 89,
    question: 'Which of the following is CORRECT regarding overcurrent device sizing for continuous and non-continuous loads?',
    choices: [
      { id: 'A', text: '125% of continuous load plus 100% of non-continuous load' },
      { id: 'B', text: '125% of non-continuous load plus 80% of continuous load' },
      { id: 'C', text: '125% of continuous load plus 80% of continuous load' },
      { id: 'D', text: '125% of non-continuous load plus 100% of continuous load' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-90',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 90,
    question: 'Electrical equipment metallic enclosures must be grounded to reduce dangerous touch voltages during ground faults. I. TRUE II. FALSE',
    choices: [{ id: 'A', text: 'I only (TRUE)' }, { id: 'B', text: 'II only' }, { id: 'C', text: 'both I and II' }, { id: 'D', text: 'Either I and II' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-91',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 91,
    question: 'What is the MAXIMUM height above finished floor for wall receptacle outlets in dwelling units?',
    choices: [{ id: 'A', text: '1800 mm' }, { id: 'B', text: '1500 mm' }, { id: 'C', text: '2800 mm' }, { id: 'D', text: '2500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-92',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 92,
    question: 'Where receptacles are connected to a 30-A branch circuit, maximum cord and plug connected load shall NOT exceed:',
    choices: [{ id: 'A', text: '24 A' }, { id: 'B', text: '26 A' }, { id: 'C', text: '30 A' }, { id: 'D', text: '34 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-93',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 93,
    question: 'In straight pulls, pull box length shall NOT be less than how many times the trade diameter of the largest raceway?',
    choices: [{ id: 'A', text: '8 times' }, { id: 'B', text: '10 times' }, { id: 'C', text: '6 times' }, { id: 'D', text: '4 times' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-94',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 94,
    question: 'The PEC Part 1 2017 Edition was based on the US National Electrical Code (NEC) year:',
    choices: [{ id: 'A', text: '2017' }, { id: 'B', text: '2011' }, { id: 'C', text: '2008' }, { id: 'D', text: '2014' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-95',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 95,
    question: 'Which of the following insulation outer colors identifies the grounded neutral conductor of a branch circuit?',
    choices: [{ id: 'A', text: 'White or Gray' }, { id: 'B', text: 'Black' }, { id: 'C', text: 'Green' }, { id: 'D', text: 'Yellow' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-96',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 96,
    question: '“The conductive body of the earth” best defines which of the following terms?',
    choices: [{ id: 'A', text: 'Ground' }, { id: 'B', text: 'Grounded conductor' }, { id: 'C', text: 'Bonding' }, { id: 'D', text: 'Ground electrode' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-97',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 97,
    question: 'In building wiring, grounded circuit conductors must NEVER be:',
    choices: [{ id: 'A', text: 'fused or switched independently' }, { id: 'B', text: 'Insulated' }, { id: 'C', text: 'Identified' }, { id: 'D', text: 'placed in a circuit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-98',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 98,
    question: 'Which of the following is a disadvantage of operating an ungrounded electrical distribution system?',
    choices: [
      { id: 'A', text: 'Transient overvoltages and destructive arcing ground faults are hard to detect' },
      { id: 'B', text: 'Power system overvoltages are not controlled' },
      { id: 'C', text: 'Destructive arcing burndowns can occur on second fault' },
      { id: 'D', text: 'All of I, II, and III' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-99',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 99,
    question: 'Equipment which produces, modifies, regulates, or controls electric energy supply is:',
    choices: [{ id: 'A', text: 'Electric supply equipment' }, { id: 'B', text: 'Transformer' }, { id: 'C', text: 'Substation' }, { id: 'D', text: 'Generator set' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-100',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 100,
    question: 'Motors must be labeled with nameplate ratings and manufacturer data. This requirement is categorized as:',
    choices: [{ id: 'A', text: 'Manufacturing rule' }, { id: 'B', text: 'Construction rule' }, { id: 'C', text: 'wiring design rule' }, { id: 'D', text: 'installation rule' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-101',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 101,
    question: 'Sizing conductors based on ampacity calculations is a:',
    choices: [{ id: 'A', text: 'wiring design rule' }, { id: 'B', text: 'installation rule' }, { id: 'C', text: 'Manufacturing rule' }, { id: 'D', text: 'construction rule' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-102',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 102,
    question: 'A vehicle carwash bay area is classified as a:',
    choices: [{ id: 'A', text: 'Wet location' }, { id: 'B', text: 'Dry location' }, { id: 'C', text: 'Damp location' }, { id: 'D', text: 'Moist location' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-103',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 103,
    question: 'Installations underground or in concrete slabs in direct contact with earth are classified as:',
    choices: [{ id: 'A', text: 'Wet location' }, { id: 'B', text: 'Dry location' }, { id: 'C', text: 'Damp location' }, { id: 'D', text: 'Moist location' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-104',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 104,
    question: 'A system or circuit conductor that is intentionally grounded is a:',
    choices: [{ id: 'A', text: 'Grounded conductor' }, { id: 'B', text: 'Grounding equipment' }, { id: 'C', text: 'Grounding conductor' }, { id: 'D', text: 'Grounding electrode conductor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-105',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 105,
    question: 'A conducting connection between an electrical circuit and earth or conducting body serving in place of earth is a:',
    choices: [{ id: 'A', text: 'Ground' }, { id: 'B', text: 'Short' }, { id: 'C', text: 'Fault' }, { id: 'D', text: 'Grounded' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-106',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 106,
    question: 'A conductor used to connect equipment or grounded circuit of a wiring system to a grounding electrode is:',
    choices: [{ id: 'A', text: 'Grounding conductor' }, { id: 'B', text: 'Grounding Electrode conductor' }, { id: 'C', text: 'Grounded Conductor' }, { id: 'D', text: 'Grounding Equipment' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-107',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 107,
    question: 'Which of the following is NOT one of the 4 main classifications of PEC rules (Wiring Design, Installation, Manufacturing, Construction)?',
    choices: [{ id: 'A', text: 'Construction Rule (where applicable)' }, { id: 'B', text: 'Wiring rule' }, { id: 'C', text: 'Installation Rule' }, { id: 'D', text: 'Manufacturing Rule' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-108',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 108,
    question: 'Conductor connecting grounding electrode to equipment grounding conductor or grounded conductor at service is:',
    choices: [{ id: 'A', text: 'Grounding Electrode Conductor' }, { id: 'B', text: 'Grounded Conductor' }, { id: 'C', text: 'Equipment Grounding Conductor' }, { id: 'D', text: 'Grounding Conductor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-109',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 109,
    question: 'A device intended for personal protection that de-energizes a circuit when current to ground exceeds a set threshold is:',
    choices: [{ id: 'A', text: 'Ground-Fault Circuit Interrupter (GFCI)' }, { id: 'B', text: 'Ground-Fault Protection of Equipment' }, { id: 'C', text: 'Grounding conductor' }, { id: 'D', text: 'Circuit Breaker' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-110',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 110,
    question: 'Locations partially protected under marquees, roofed open porches, or cold storage rooms subject to moisture are:',
    choices: [{ id: 'A', text: 'Damp locations' }, { id: 'B', text: 'Moist locations' }, { id: 'C', text: 'Wet locations' }, { id: 'D', text: 'Dry locations' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-111',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 111,
    question: 'A location not normally subject to dampness or wetness is classified as a:',
    choices: [{ id: 'A', text: 'Dry location' }, { id: 'B', text: 'Damp location' }, { id: 'C', text: 'Moist location' }, { id: 'D', text: 'Wet location' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-112',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 112,
    question: 'Sizing fuses at 125% of continuous load current is an application of:',
    choices: [{ id: 'A', text: 'Wiring design rule' }, { id: 'B', text: 'Manufacturing design' }, { id: 'C', text: 'Construction design' }, { id: 'D', text: 'Installation design' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-113',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 113,
    question: 'Requiring motor enclosures to be dust-tight for hazardous locations is a:',
    choices: [{ id: 'A', text: 'Manufacturing design rule' }, { id: 'B', text: 'wiring design' }, { id: 'C', text: 'construction design' }, { id: 'D', text: 'Installation design' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-114',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 114,
    question: 'An equipment grounding conductor shall be identified by which color?',
    choices: [{ id: 'A', text: 'Green or green with yellow stripes' }, { id: 'B', text: 'Black' }, { id: 'C', text: 'White' }, { id: 'D', text: 'Gray' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-115',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 115,
    question: 'Energy-consuming equipment including motors, heaters, lights, and appliances utilizing electric energy is:',
    choices: [{ id: 'A', text: 'Utilization equipment' }, { id: 'B', text: 'Processing plant' }, { id: 'C', text: 'Transformer' }, { id: 'D', text: 'Industrial Plant' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-116',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 116,
    question: 'An assembly of switching, interrupting, controlling, and metering equipment in an enclosure is:',
    choices: [{ id: 'A', text: 'Switchgear / Switchboard' }, { id: 'B', text: 'Panelboard' }, { id: 'C', text: 'Enclosure' }, { id: 'D', text: 'Raceway' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-117',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 117,
    question: 'What is the primary purpose of the Philippine Electrical Code?',
    choices: [
      { id: 'A', text: 'Practical safeguarding of persons and property from hazards arising from electricity' },
      { id: 'B', text: 'To serve as manual guide for design' },
      { id: 'C', text: 'To serve as guide for untrained personnel' },
      { id: 'D', text: 'To conserve electrical energy' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-118',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 118,
    question: 'Minimum vertical clearance of service drop conductors over residential driveways (voltage not exceeding 300V to ground) is:',
    choices: [{ id: 'A', text: '3700 mm (12 ft)' }, { id: 'B', text: '4600 mm' }, { id: 'C', text: '5500 mm' }, { id: 'D', text: '3100 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-119',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 119,
    question: 'When circuit breakers are installed in enclosed assemblies for continuous loading, they are usually derated to:',
    choices: [{ id: 'A', text: '80 percent' }, { id: 'B', text: '70 percent' }, { id: 'C', text: '60 percent' }, { id: 'D', text: '50 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-120',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 120,
    question: 'Before starting electrical installation, alteration, or extension work, what official permit is legally required?',
    choices: [{ id: 'A', text: 'Electrical Permit' }, { id: 'B', text: 'Mayor’s permit' }, { id: 'C', text: 'Building permit' }, { id: 'D', text: 'Working permit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-121',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 121,
    question: 'For school buildings, general unit lighting load specified per square meter is:',
    choices: [{ id: 'A', text: '24 VA/m^2' }, { id: 'B', text: '28 VA/m^2' }, { id: 'C', text: '16 VA/m^2' }, { id: 'D', text: '8 VA/m^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-122',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 122,
    question: 'For office buildings, general unit lighting load specified per square meter is:',
    choices: [{ id: 'A', text: '28 VA/m^2' }, { id: 'B', text: '24 VA/m^2' }, { id: 'C', text: '16 VA/m^2' }, { id: 'D', text: '8 VA/m^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-123',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 123,
    question: 'An enclosed channel designed expressly for holding wires, cables, or busbars is a:',
    choices: [{ id: 'A', text: 'Raceway' }, { id: 'B', text: 'Cable Tray' }, { id: 'C', text: 'Tube' }, { id: 'D', text: 'Duct' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-124',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 124,
    question: 'The continuous load current on a branch circuit overcurrent device must not exceed what percentage of rating?',
    choices: [{ id: 'A', text: '80 percent' }, { id: 'B', text: '90 percent' }, { id: 'C', text: '60 percent' }, { id: 'D', text: '70 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-125',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 125,
    question: 'A continuous load is defined as a load where maximum current is expected to continue for:',
    choices: [{ id: 'A', text: '3 hours or more' }, { id: 'B', text: '4 hours or more' }, { id: 'C', text: '5 hours or more' }, { id: 'D', text: '6 hours or more' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-126',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 126,
    question: 'In a single-phase AC system, the white conductor that carries normal return current is:',
    choices: [{ id: 'A', text: 'Neutral / Grounded conductor' }, { id: 'B', text: 'grounding conductor' }, { id: 'C', text: 'grounding electrode' }, { id: 'D', text: 'hot phase' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-127',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 127,
    question: 'In a 4-wire delta system, the high-leg (208V to neutral) phase wire is identified by what color?',
    choices: [{ id: 'A', text: 'Orange' }, { id: 'B', text: 'Brown' }, { id: 'C', text: 'Red' }, { id: 'D', text: 'Black' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-128',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 128,
    question: 'The circuit conductors between final overcurrent device and utilization outlet(s) are:',
    choices: [{ id: 'A', text: 'Branch Circuit' }, { id: 'B', text: 'Service' }, { id: 'C', text: 'Feeder' }, { id: 'D', text: 'Service lateral' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-129',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 129,
    question: 'What is the maximum operating temperature rating of TW insulated conductor?',
    choices: [{ id: 'A', text: '60 °C' }, { id: 'B', text: '75 °C' }, { id: 'C', text: '90 °C' }, { id: 'D', text: '100 °C' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-130',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 130,
    question: 'On electrical plans, concealed wiring run is represented by a:',
    choices: [{ id: 'A', text: 'Solid line' }, { id: 'B', text: 'Dashed line' }, { id: 'C', text: 'Dotted line' }, { id: 'D', text: 'Chain line' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-131',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 131,
    question: 'Flexible steel wire tape used to pull conductors through conduit runs is called:',
    choices: [{ id: 'A', text: 'Fish tape' }, { id: 'B', text: 'Wire tongs' }, { id: 'C', text: 'Puller' }, { id: 'D', text: 'Straps' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-132',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 132,
    question: 'An automatic or nonautomatic device for transferring load conductor connections from one power source to another:',
    choices: [{ id: 'A', text: 'Transfer Switch' }, { id: 'B', text: 'Bypass Isolation Switch' }, { id: 'C', text: 'General Use Switch' }, { id: 'D', text: 'Isolating Switch' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-133',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 133,
    question: 'For lightning protection purposes, a high-rise building is a structure with height exceeding:',
    choices: [{ id: 'A', text: '23 meters' }, { id: 'B', text: '50 meters' }, { id: 'C', text: '20 meters' }, { id: 'D', text: '15 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-134',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 134,
    question: 'In feeder calculations, air conditioning equipment load is taken at what demand percentage?',
    choices: [{ id: 'A', text: '100 percent' }, { id: 'B', text: '125 percent' }, { id: 'C', text: '150 percent' }, { id: 'D', text: '80 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-135',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 135,
    question: 'Which wire insulation type is suitable for underground service entrance conductors?',
    choices: [{ id: 'A', text: 'Type USE' }, { id: 'B', text: 'Type THHN' }, { id: 'C', text: 'Type TW' }, { id: 'D', text: 'Type MI' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-136',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 136,
    question: 'Overcurrent conditions in electrical circuits are caused by overload or short circuit/ground fault EXCEPT:',
    choices: [{ id: 'A', text: 'Open Circuit' }, { id: 'B', text: 'Overload' }, { id: 'C', text: 'Ground Fault' }, { id: 'D', text: 'Short Circuit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-137',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 137,
    question: 'Which of the following is NOT a fundamental rule category in the PEC?',
    choices: [{ id: 'A', text: 'Construction Rule' }, { id: 'B', text: 'Wiring rule' }, { id: 'C', text: 'Installation Rule' }, { id: 'D', text: 'Manufacturing Rule' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-138',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 138,
    question: 'An emergency device that automatically switches power to generator within seconds after outage is:',
    choices: [{ id: 'A', text: 'Automatic Transfer Switch (ATS)' }, { id: 'B', text: 'Double throw manual switch' }, { id: 'C', text: 'UPS bypass' }, { id: 'D', text: 'Safety switch' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-139',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 139,
    question: 'Equipment suitable for a specific purpose, function, or environment in Code requirements is described as:',
    choices: [{ id: 'A', text: 'Identified' }, { id: 'B', text: 'Listed' }, { id: 'C', text: 'Labeled' }, { id: 'D', text: 'Approved' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-140',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 140,
    question: 'Type MC metal clad cable insulation shall have a maximum operating temperature rating of not less than:',
    choices: [{ id: 'A', text: '90 °C' }, { id: 'B', text: '60 °C' }, { id: 'C', text: '75 °C' }, { id: 'D', text: '80 °C' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-141',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 141,
    question: 'In dwelling units, unit general lighting load is computed at:',
    choices: [{ id: 'A', text: '24 VA/m^2' }, { id: 'B', text: '16 VA/m^2' }, { id: 'C', text: '8 VA/m^2' }, { id: 'D', text: '28 VA/m^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-142',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 142,
    question: 'Which flexible conduit is NOT permitted in wet or hazardous locations?',
    choices: [{ id: 'A', text: 'FMC (Flexible Metallic Conduit)' }, { id: 'B', text: 'RMC' }, { id: 'C', text: 'IMC' }, { id: 'D', text: 'RNMC' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-143',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 143,
    question: 'In PEC calculations, nominal AC supply voltages are treated as effective RMS values.',
    choices: [{ id: 'A', text: 'effective (RMS)' }, { id: 'B', text: 'average' }, { id: 'C', text: 'minimum' }, { id: 'D', text: 'maximum' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-144',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 144,
    question: 'GFCI protection is required for outdoor/garage/basement receptacles in dwelling units.',
    choices: [{ id: 'A', text: 'I, II and III (Basement, Attached Garage, Detached Garage)' }, { id: 'B', text: 'I only' }, { id: 'C', text: 'I and II' }, { id: 'D', text: 'II and III' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-145',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 145,
    question: 'In a dwelling kitchen, minimum number of 20A small appliance branch circuits required is:',
    choices: [{ id: 'A', text: '2 circuits' }, { id: 'B', text: '1 circuit' }, { id: 'C', text: '3 circuits' }, { id: 'D', text: '6 circuits' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-146',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 146,
    question: 'Permanent joining of metal parts to form an electrically conductive path assuring continuity is:',
    choices: [{ id: 'A', text: 'Bonding' }, { id: 'B', text: 'counterpoise' }, { id: 'C', text: 'air terminal' }, { id: 'D', text: 'interlink' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-147',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 147,
    question: 'In dwelling units, hallways of length 3000 mm (10 ft) or more require at least one receptacle outlet.',
    choices: [{ id: 'A', text: '3000 mm' }, { id: 'B', text: '1500 mm' }, { id: 'C', text: '1800 mm' }, { id: 'D', text: '1000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-148',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 148,
    question: 'Receptacle outlets above kitchen countertops shall be installed not more than _____ mm above countertop.',
    choices: [{ id: 'A', text: '500 mm' }, { id: 'B', text: '600 mm' }, { id: 'C', text: '250 mm' }, { id: 'D', text: '300 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-149',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 149,
    question: 'Overload protection for motor compressor shall be set at not more than what percent of rated load current?',
    choices: [{ id: 'A', text: '140 %' }, { id: 'B', text: '175 %' }, { id: 'C', text: '125 %' }, { id: 'D', text: '130 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-150',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 150,
    question: 'Grounding electrodes permitted by Code include water pipe, building frame, and concrete-encased rod, EXCEPT:',
    choices: [
      { id: 'A', text: 'Metal underground gas piping system' },
      { id: 'B', text: 'Underground metal water pipe' },
      { id: 'C', text: 'Concrete encased electrode' },
      { id: 'D', text: 'Metal frame of building electrode' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-151',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 151,
    question: 'Adjustment factor for 4 to 6 current-carrying conductors in a single raceway is:',
    choices: [{ id: 'A', text: '80%' }, { id: 'B', text: '24%' }, { id: 'C', text: '50%' }, { id: 'D', text: '60%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-152',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 152,
    question: 'Grounded neutral conductors larger than 14 mm^2 may be identified at terminations by white/gray marking or 3 white stripes.',
    choices: [{ id: 'A', text: 'White, Gray, or 3 white stripes' }, { id: 'B', text: 'Yellow' }, { id: 'C', text: 'Green' }, { id: 'D', text: 'Red' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-153',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 153,
    question: 'Which of the following electrode materials is NOT permitted for grounding electrodes?',
    choices: [{ id: 'A', text: 'Aluminum electrode' }, { id: 'B', text: 'Underground metal water pipe' }, { id: 'C', text: 'Concrete encased rebar' }, { id: 'D', text: 'Structural steel frame' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-154',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 154,
    question: 'Minimum length and size of bare copper conductor embedded in concrete encased electrode is:',
    choices: [{ id: 'A', text: '6,000 mm ; 22 mm^2' }, { id: 'B', text: '6,000 mm ; 30 mm^2' }, { id: 'C', text: '5,000 mm ; 22 mm^2' }, { id: 'D', text: '5,000 mm ; 30 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-155',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 155,
    question: 'Factors considered when selecting fuses include ampacity, voltage rating, interrupting capacity, EXCEPT:',
    choices: [{ id: 'A', text: 'contact resistance' }, { id: 'B', text: 'interrupting rating' }, { id: 'C', text: 'ampere rating' }, { id: 'D', text: 'voltage rating' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-156',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 156,
    question: 'Conductors in open wiring on insulators shall be rigidly supported within _____ from a tap or splice.',
    choices: [{ id: 'A', text: '150 mm' }, { id: 'B', text: '200 mm' }, { id: 'C', text: '100 mm' }, { id: 'D', text: '250 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-157',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 157,
    question: 'Connections between conductive metal objects in a lightning protection system to accomplish continuity is:',
    choices: [{ id: 'A', text: 'Bonding' }, { id: 'B', text: 'Interlink' }, { id: 'C', text: 'Connectors' }, { id: 'D', text: 'Counterpoise' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-158',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 158,
    question: 'The grounding electrode conductor may be made of:',
    choices: [{ id: 'A', text: 'Copper, aluminum, or copper-clad aluminum' }, { id: 'B', text: 'Aluminum only' }, { id: 'C', text: 'Copper-clad aluminum only' }, { id: 'D', text: 'Copper only' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-159',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 159,
    question: 'A rapid surge of unidirectional voltage or current is an:',
    choices: [{ id: 'A', text: 'Impulse' }, { id: 'B', text: 'Flashover' }, { id: 'C', text: 'Corona' }, { id: 'D', text: 'Skin effect' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-160',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 160,
    question: 'The electrical plan for a simple residential house includes floor plans, schedules, and legend EXCEPT:',
    choices: [{ id: 'A', text: 'High-voltage Substation Plan' }, { id: 'B', text: 'Location Plan' }, { id: 'C', text: 'Floor plan showing service entrance' }, { id: 'D', text: 'Lighting layout plan' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-161',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 161,
    question: 'The minimum rating of a laundry branch circuit in dwelling units is:',
    choices: [{ id: 'A', text: '20 A' }, { id: 'B', text: '15 A' }, { id: 'C', text: '30 A' }, { id: 'D', text: '25 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-162',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 162,
    question: 'The usual primary function of a disconnect switch in high voltage circuits is to:',
    choices: [
      { id: 'A', text: 'Isolate de-energized equipment from energized buses for safety maintenance' },
      { id: 'B', text: 'Open or close the circuit under full load' },
      { id: 'C', text: 'Open the circuit in event of overload' },
      { id: 'D', text: 'Maintain continuity of service' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-163',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 163,
    question: 'An assembly of flexible cord with attachment plug on one end and cord connector on the other is an:',
    choices: [{ id: 'A', text: 'Extension cord' }, { id: 'B', text: 'Fixture cord' }, { id: 'C', text: 'Appliance cord' }, { id: 'D', text: 'None of these' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-164',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 164,
    question: 'What is the maximum number of current-carrying conductors permitted in a raceway without derating fill factor rules?',
    choices: [{ id: 'A', text: '3 conductors' }, { id: 'B', text: '25 conductors' }, { id: 'C', text: '40 conductors' }, { id: 'D', text: '50 conductors' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-165',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 165,
    question: 'Which of the following location statements regarding overcurrent devices is NOT correct?',
    choices: [
      { id: 'A', text: 'Overcurrent devices may be located inside clothes closets' },
      { id: 'B', text: 'Overcurrent devices shall be readily accessible' },
      { id: 'C', text: 'Overcurrent devices shall be protected from physical damage' },
      { id: 'D', text: 'Each occupant shall have ready access to overcurrent devices' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-166',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 166,
    question: 'The disconnecting means for motor circuits rated 600V or less shall have an ampere rating of at least what percent of full load current?',
    choices: [{ id: 'A', text: '115 percent' }, { id: 'B', text: '125 percent' }, { id: 'C', text: '110 percent' }, { id: 'D', text: '130 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-167',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 167,
    question: 'A generic name for an artificial source of light is:',
    choices: [{ id: 'A', text: 'Lamp / Luminaire' }, { id: 'B', text: 'Moon' }, { id: 'C', text: 'Sun' }, { id: 'D', text: 'Electricity' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-168',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 168,
    question: 'A manual hand tool used for bending conduit is a:',
    choices: [{ id: 'A', text: 'Hickey / Conduit bender' }, { id: 'B', text: 'Bender' }, { id: 'C', text: 'Pliers' }, { id: 'D', text: 'Pipe wrench' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-169',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 169,
    question: 'In standard metric wire sizes manufactured in the Philippines, what standard size comes next larger than 8.0 mm^2?',
    choices: [{ id: 'A', text: '14 mm^2' }, { id: 'B', text: '12 mm^2' }, { id: 'C', text: '10 mm^2' }, { id: 'D', text: '9 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-170',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 170,
    question: 'Branch circuits under raised floors in computer rooms shall be wired using approved raceways/cables like EMT, IMC, or Type AC.',
    choices: [{ id: 'A', text: 'All of these (EMT, IMC, AC Cable)' }, { id: 'B', text: 'EMT' }, { id: 'C', text: 'IMC' }, { id: 'D', text: 'AC Cable' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-171',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 171,
    question: 'As a general rule, floating structures shall be supplied by _____ set(s) of feeder conductors from service equipment.',
    choices: [{ id: 'A', text: 'One set' }, { id: 'B', text: 'Two sets' }, { id: 'C', text: 'Three sets' }, { id: 'D', text: 'Four sets' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-172',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 172,
    question: 'Which of the following electric copper conductor sizes has the highest current carrying ampacity?',
    choices: [{ id: 'A', text: '50 mm^2' }, { id: 'B', text: '30 mm^2' }, { id: 'C', text: '5.5 mm^2' }, { id: 'D', text: '8.0 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-173',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 173,
    question: 'Emergency storage batteries shall maintain voltage under load without falling below what percent of normal value?',
    choices: [{ id: 'A', text: '87.5%' }, { id: 'B', text: '84.2%' }, { id: 'C', text: '93.7%' }, { id: 'D', text: '95.3%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-174',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 174,
    question: 'The largest standard electrical trade size for electrical metallic tubing (EMT) is:',
    choices: [{ id: 'A', text: '100 mm (4 in.)' }, { id: 'B', text: '125 mm' }, { id: 'C', text: '75 mm' }, { id: 'D', text: '150 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-175',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 175,
    question: 'Physical protection for open lamps by elevation requires positioning at least _____ meters above working floor.',
    choices: [{ id: 'A', text: '2.1 meters (approx 2 m)' }, { id: 'B', text: '1 meter' }, { id: 'C', text: '2.5 meters' }, { id: 'D', text: '3 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-176',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 176,
    question: 'To provide for small appliance load in dwelling units, each 20-ampere branch circuit shall be computed at:',
    choices: [{ id: 'A', text: '1500 VA' }, { id: 'B', text: '2400 VA' }, { id: 'C', text: '3000 VA' }, { id: 'D', text: '3600 VA' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-177',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 177,
    question: 'All circuit conductors between service disconnect and branch circuit overcurrent device are:',
    choices: [{ id: 'A', text: 'Feeder' }, { id: 'B', text: 'Motor Controller' }, { id: 'C', text: 'Overcurrent Protector' }, { id: 'D', text: 'Disconnecting Switch' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-178',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 178,
    question: 'What is the temperature rating of THW insulated copper conductor in wet locations?',
    choices: [{ id: 'A', text: '75 °C' }, { id: 'B', text: '60 °C' }, { id: 'C', text: '85 °C' }, { id: 'D', text: '90 °C' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-179',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 179,
    question: 'In damp or wet locations, boxes and fittings shall be placed or insulated to prevent:',
    choices: [{ id: 'A', text: 'Water/moisture from entering enclosure' }, { id: 'B', text: 'Dust from entering' }, { id: 'C', text: 'Wiring exposure' }, { id: 'D', text: 'Grounding' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-180',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 180,
    question: 'Concealed knob and tube wiring conductors shall be supported on knobs at intervals not exceeding:',
    choices: [{ id: 'A', text: '1300 mm' }, { id: 'B', text: '1500 mm' }, { id: 'C', text: '2000 mm' }, { id: 'D', text: '2500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-181',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 181,
    question: 'Equipment is defined as "in sight from" another equipment if visible and at a distance of:',
    choices: [{ id: 'A', text: 'Not more than 15 meters' }, { id: 'B', text: 'Not less than 15 meters' }, { id: 'C', text: 'Not more than 20 meters' }, { id: 'D', text: 'Not less than 20 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-182',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 182,
    question: 'A motor nameplate must be marked with manufacturer, rated voltage, full load current, horsepower, and frequency.',
    choices: [{ id: 'A', text: 'All of the above' }, { id: 'B', text: 'Maker\'s name' }, { id: 'C', text: 'Rated volts and amperes' }, { id: 'D', text: 'Rated frequency' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-183',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 183,
    question: 'Hazardous locations where combustible dust is present in ignitable quantities are classified as:',
    choices: [{ id: 'A', text: 'Class II' }, { id: 'B', text: 'Class I' }, { id: 'C', text: 'Class III' }, { id: 'D', text: 'Class VI' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-184',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 184,
    question: 'Branch circuit conductors supplying a single continuous duty motor shall have an ampacity of not less than:',
    choices: [{ id: 'A', text: '125 % of full load current' }, { id: 'B', text: '115 %' }, { id: 'C', text: '100 %' }, { id: 'D', text: '130 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-185',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 185,
    question: 'Any switch or device used to start and stop a motor is a:',
    choices: [{ id: 'A', text: 'Motor Controller' }, { id: 'B', text: 'Relay' }, { id: 'C', text: 'Rheostat' }, { id: 'D', text: 'Circuit Breaker' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-186',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 186,
    question: 'A gas manufacturing plant where flammable gases are handled continuously is categorized as:',
    choices: [{ id: 'A', text: 'Class I, Division 1' }, { id: 'B', text: 'Class I, Division 2' }, { id: 'C', text: 'Class II, Division 1' }, { id: 'D', text: 'Class II, Division 2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-187',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 187,
    question: 'To cut rigid metal conduit on the jobsite, an electrician should:',
    choices: [
      { id: 'A', text: 'Use a hacksaw/pipe cutter and ream the cut ends' },
      { id: 'B', text: 'Use a cold chisel' },
      { id: 'C', text: 'Snap the conduit across knee' },
      { id: 'D', text: 'Order pre-cut lengths only' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-188',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 188,
    question: 'A factory assembly of parallel conductors formed integrally in a web for surface raceways is:',
    choices: [{ id: 'A', text: 'Type FC (Flat Cable Assemblies)' }, { id: 'B', text: 'Type MI' }, { id: 'C', text: 'Type TC' }, { id: 'D', text: 'Type UF' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-189',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 189,
    question: 'Snap switches shall not be grouped or ganged in single box unless voltage between adjacent switches does NOT exceed:',
    choices: [{ id: 'A', text: '300 V' }, { id: 'B', text: '250 V' }, { id: 'C', text: '150 V' }, { id: 'D', text: '100 V' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-190',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 190,
    question: 'Wiring located above heated radiant ceiling panels shall be spaced not less than _____ above ceiling.',
    choices: [{ id: 'A', text: '50 mm' }, { id: 'B', text: '100 mm' }, { id: 'C', text: '75 mm' }, { id: 'D', text: '40 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-191',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 191,
    question: 'Rectangular sheet metal enclosures equipped with removable covers providing access to conductors inside are:',
    choices: [{ id: 'A', text: 'Wireways / Auxiliary gutters' }, { id: 'B', text: 'Busways' }, { id: 'C', text: 'Metal clad cable' }, { id: 'D', text: 'Conduits' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-192',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 192,
    question: 'Each unit length of electric heating cable shall have permanent legible marking within ____ of terminal end.',
    choices: [{ id: 'A', text: '75 mm' }, { id: 'B', text: '70 mm' }, { id: 'C', text: '80 mm' }, { id: 'D', text: '85 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-193',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 193,
    question: 'Metal faceplates shall be ferrous metal not less than _____ or non-ferrous metal not less than _____ in thickness.',
    choices: [{ id: 'A', text: '0.76 mm, 1.0 mm' }, { id: 'B', text: '0.76 mm, 1.2 mm' }, { id: 'C', text: '0.64 mm, 1.0 mm' }, { id: 'D', text: '0.64 mm, 1.2 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-194',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 194,
    question: 'Surface incandescent fixtures in clothes closets require minimum clearance between fixture and storage space of:',
    choices: [{ id: 'A', text: '300 mm' }, { id: 'B', text: '250 mm' }, { id: 'C', text: '200 mm' }, { id: 'D', text: '150 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-195',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 195,
    question: 'Thermal insulation shall NOT be installed within _____ of recessed fixture enclosure unless type IC.',
    choices: [{ id: 'A', text: '38 mm (1.5 in.)' }, { id: 'B', text: '35 mm' }, { id: 'C', text: '40 mm' }, { id: 'D', text: '42 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-196',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 196,
    question: 'Surrounded by a case, housing, or barrier preventing accidental contact with live parts is:',
    choices: [{ id: 'A', text: 'enclosed' }, { id: 'B', text: 'isolated' }, { id: 'C', text: 'guarded' }, { id: 'D', text: 'concealed' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-197',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 197,
    question: '_____ means equipment is NOT readily accessible unless special means for access (like ladders, locks) are used.',
    choices: [{ id: 'A', text: 'Isolated' }, { id: 'B', text: 'Guarded' }, { id: 'C', text: 'Elevated' }, { id: 'D', text: 'Concealed' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-198',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 198,
    question: 'Operation at alternate intervals of load/no-load or load/rest is classified as _____ duty.',
    choices: [{ id: 'A', text: 'intermittent' }, { id: 'B', text: 'short time' }, { id: 'C', text: 'periodic' }, { id: 'D', text: 'varying' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-199',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 199,
    question: 'An outlet constructed so that water will not enter the enclosure under specified test conditions is:',
    choices: [{ id: 'A', text: 'watertight' }, { id: 'B', text: 'waterproof' }, { id: 'C', text: 'rainproof' }, { id: 'D', text: 'weatherproof' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-200',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 200,
    question: 'The _____ is the current in amperes a conductor can carry continuously under use without exceeding temperature rating.',
    choices: [{ id: 'A', text: 'ampacity' }, { id: 'B', text: 'load' }, { id: 'C', text: 'demand' }, { id: 'D', text: 'connected load' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-201',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 201,
    question: 'Constructed or protected so that exposure to weather will not interfere with successful operation is:',
    choices: [{ id: 'A', text: 'weatherproof' }, { id: 'B', text: 'weather-tight' }, { id: 'C', text: 'weather-resistant' }, { id: 'D', text: 'weather-sealed' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-202',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 202,
    question: 'An accessible wiring method is one',
    choices: [
      { id: 'A', text: 'not permanently closed in by building structure' },
      { id: 'B', text: 'admitting close approach' },
      { id: 'C', text: 'not guarded by locked doors' },
      { id: 'D', text: 'reached without ladder' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-203',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 203,
    question: '_____ duty is operation where load and time intervals vary widely.',
    choices: [{ id: 'A', text: 'Varying' }, { id: 'B', text: 'Continuous' }, { id: 'C', text: 'Periodic' }, { id: 'D', text: 'Intermittent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-204',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 204,
    question: 'An isolating switch is one intended for:',
    choices: [
      { id: 'A', text: 'isolating an electrical circuit from its power source for maintenance' },
      { id: 'B', text: 'padlocking only' },
      { id: 'C', text: 'transformer isolation' },
      { id: 'D', text: 'heavy motor overloads' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-205',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 205,
    question: 'A device actuated by operation of another associated device to govern succeeding operations is an:',
    choices: [{ id: 'A', text: 'interlock' }, { id: 'B', text: 'relay' }, { id: 'C', text: 'controller' }, { id: 'D', text: 'governor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-206',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 206,
    question: 'A device intended to provide protection against arcing faults by de-energizing the circuit is an:',
    choices: [{ id: 'A', text: 'arc-fault circuit interrupter (AFCI)' }, { id: 'B', text: 'arc fault circuit breaker' }, { id: 'C', text: 'arc fault arrester' }, { id: 'D', text: 'arc fault de-energizer' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-207',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 207,
    question: 'For electric ranges rated 8.75 kW or higher, minimum branch circuit rating shall be:',
    choices: [{ id: 'A', text: '40 amperes' }, { id: 'B', text: '30 amperes' }, { id: 'C', text: '50 amperes' }, { id: 'D', text: '60 amperes' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-208',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 208,
    question: 'A single cord-and-plug connected appliance not fastened in place shall NOT exceed what percent of branch circuit rating?',
    choices: [{ id: 'A', text: '80 percent' }, { id: 'B', text: '125 percent' }, { id: 'C', text: '110 percent' }, { id: 'D', text: '100 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-209',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 209,
    question: 'Total rating of fastened-in-place appliances on a multi-outlet branch circuit shall NOT exceed what percent of rating?',
    choices: [{ id: 'A', text: '50 percent' }, { id: 'B', text: '75 percent' }, { id: 'C', text: '80 percent' }, { id: 'D', text: '100 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-210',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 210,
    question: 'Branch circuits larger than _____ amperes shall supply only non-lighting load outlets.',
    choices: [{ id: 'A', text: '50 amperes' }, { id: 'B', text: '30 amperes' }, { id: 'C', text: '40 amperes' }, { id: 'D', text: '60 amperes' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-211',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 211,
    question: 'Appliance receptacle outlets for specific appliances like laundry shall be installed within _____ mm of location.',
    choices: [{ id: 'A', text: '1800 mm' }, { id: 'B', text: '1000 mm' }, { id: 'C', text: '1500 mm' }, { id: 'D', text: '2000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-212',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 212,
    question: 'In kitchens and dining areas of dwelling units, a receptacle outlet shall be installed at each wall space wider than _____ mm.',
    choices: [{ id: 'A', text: '300 mm' }, { id: 'B', text: '80 mm' }, { id: 'C', text: '250 mm' }, { id: 'D', text: '350 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-213',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 213,
    question: 'At least one receptacle outlet shall be installed directly above a show window for each _____ linear meters of show window.',
    choices: [{ id: 'A', text: '3 meters' }, { id: 'B', text: '1 meter' }, { id: 'C', text: '2 meters' }, { id: 'D', text: '4 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-214',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 214,
    question: 'For hallways of _____ mm or more in length, at least one receptacle outlet is required.',
    choices: [{ id: 'A', text: '3000 mm' }, { id: 'B', text: '3200 mm' }, { id: 'C', text: '3300 mm' }, { id: 'D', text: '3500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-215',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 215,
    question: 'Unit lighting load per square meter in volt-amperes is 24 VA/m^2 for schools, stores, dwellings EXCEPT:',
    choices: [{ id: 'A', text: 'hospitals (16 VA/m^2)' }, { id: 'B', text: 'dwelling units' }, { id: 'C', text: 'schools' }, { id: 'D', text: 'stores' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-216',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 216,
    question: 'For over 600 volts nominal, open individual overhead conductors shall not be smaller than _____ mm2 copper or _____ mm2 aluminum.',
    choices: [{ id: 'A', text: '14 mm2, 22 mm2' }, { id: 'B', text: '8, 14' }, { id: 'C', text: '14, 30' }, { id: 'D', text: '22, 30' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-217',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 217,
    question: 'Open conductors on poles shall have separation of not less than _____ mm where not placed on racks.',
    choices: [{ id: 'A', text: '300 mm' }, { id: 'B', text: '250 mm' }, { id: 'C', text: '200 mm' }, { id: 'D', text: '150 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-218',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 218,
    question: 'Open conductors shall be separated from open conductors of other circuits by not less than:',
    choices: [{ id: 'A', text: '100 mm' }, { id: 'B', text: '200 mm' }, { id: 'C', text: '150 mm' }, { id: 'D', text: '80 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-219',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 219,
    question: 'Conductors supported on poles shall provide horizontal climbing space not less than _____ mm for power conductors below communication lines.',
    choices: [{ id: 'A', text: '760 mm' }, { id: 'B', text: '730 mm' }, { id: 'C', text: '780 mm' }, { id: 'D', text: '800 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-220',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 220,
    question: 'Overhead service conductors shall have a vertical clearance of not less than _____ mm from flat roof surfaces.',
    choices: [{ id: 'A', text: '2500 mm' }, { id: 'B', text: '1800 mm' }, { id: 'C', text: '2000 mm' }, { id: 'D', text: '3000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-221',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 221,
    question: 'Roof vertical clearance shall be maintained for a distance of not less than _____ mm in all directions from roof edge.',
    choices: [{ id: 'A', text: '1000 mm' }, { id: 'B', text: '800 mm' }, { id: 'C', text: '500 mm' }, { id: 'D', text: '900 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-222',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 222,
    question: 'The maximum total combined voltage drop recommended for feeders plus branch circuits is:',
    choices: [{ id: 'A', text: '5 percent' }, { id: 'B', text: '3.5 percent' }, { id: 'C', text: '2.5 percent' }, { id: 'D', text: '6 percent' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-223',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 223,
    question: 'The service disconnecting means for each set of service conductors shall consist of not more than _____ hand switches/breakers.',
    choices: [{ id: 'A', text: '6 switches/breakers' }, { id: 'B', text: '8 switches' }, { id: 'C', text: '10 switches' }, { id: 'D', text: '12 switches' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-224',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 224,
    question: 'Service-entrance copper conductors shall have sufficient ampacity and shall not be smaller than:',
    choices: [{ id: 'A', text: '8.0 mm2' }, { id: 'B', text: '5.5 mm2' }, { id: 'C', text: '22 mm2' }, { id: 'D', text: '14 mm2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-225',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 225,
    question: 'Service conductors must have a clearance from operable windows, doors, and fire escapes of not less than:',
    choices: [{ id: 'A', text: '900 mm' }, { id: 'B', text: '800 mm' }, { id: 'C', text: '1100 mm' }, { id: 'D', text: '1000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-226',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 226,
    question: 'For service drop conductors <=600V, vertical clearance over flat roofs is:',
    choices: [{ id: 'A', text: '2500 mm' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '3000 mm' }, { id: 'D', text: '2200 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-227',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 227,
    question: 'Where voltage <=300V and roof slope is >=1:3 (4 in 12), roof clearance may be reduced to:',
    choices: [{ id: 'A', text: '1000 mm' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '2200 mm' }, { id: 'D', text: '1500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-228',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 228,
    question: 'Service drop conductors <=600V passing over residential property/yards shall have vertical clearance of:',
    choices: [{ id: 'A', text: '3100 mm' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '2500 mm' }, { id: 'D', text: '3300 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-229',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 229,
    question: 'Service drop conductors <=600V over public streets, driveways, and commercial parking areas subject to truck traffic shall be:',
    choices: [{ id: 'A', text: '5500 mm (18 ft)' }, { id: 'B', text: '4600 mm' }, { id: 'C', text: '5000 mm' }, { id: 'D', text: '5300 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-230',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 230,
    question: 'A pole, column, or structure supporting overhead service conductors on roof or ground is a:',
    choices: [{ id: 'A', text: 'Service Mast' }, { id: 'B', text: 'overhead line' }, { id: 'C', text: 'cleat' }, { id: 'D', text: 'extension pole' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-231',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 231,
    question: 'The maximum trip setting for ground-fault protection on service disconnects is:',
    choices: [{ id: 'A', text: '1200 amperes' }, { id: 'B', text: '800 amperes' }, { id: 'C', text: '1000 amperes' }, { id: 'D', text: '2000 amperes' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-232',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 232,
    question: 'Overcurrent protection is provided to _____ the circuit before dangerous temperatures occur.',
    choices: [{ id: 'A', text: 'open / interrupt' }, { id: 'B', text: 'close' }, { id: 'C', text: 'short' }, { id: 'D', text: 'blow' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-233',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 233,
    question: 'The maximum fault current an overcurrent device can safely clear without rupture is its:',
    choices: [{ id: 'A', text: 'interrupting rating (AIC)' }, { id: 'B', text: 'operating rating' }, { id: 'C', text: 'ampacity rating' }, { id: 'D', text: 'temperature rating' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-234',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 234,
    question: 'The largest standard cartridge fuse rating manufactured is:',
    choices: [{ id: 'A', text: '6000 amps' }, { id: 'B', text: '1200 amps' }, { id: 'C', text: '1000 amps' }, { id: 'D', text: '600 amps' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-235',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 235,
    question: 'The maximum number of overcurrent devices (poles) permitted in a lighting panelboard cabinet is:',
    choices: [{ id: 'A', text: '42 or 48 poles (PEC standard)' }, { id: 'B', text: '24' }, { id: 'C', text: '36' }, { id: 'D', text: '50' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-236',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 236,
    question: 'Properly localizing a fault condition to restrict power outages only to the affected branch is:',
    choices: [{ id: 'A', text: 'Selective Coordination' }, { id: 'B', text: 'Monitoring' }, { id: 'C', text: 'Sensing' }, { id: 'D', text: 'Fault device' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-237',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 237,
    question: 'Maximum overcurrent protection for an autotransformer input current < 9A is:',
    choices: [{ id: 'A', text: '167%' }, { id: 'B', text: '150%' }, { id: 'C', text: '300%' }, { id: 'D', text: '200%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-238',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 238,
    question: 'Where overcurrent device rating is over _____ amperes, conductor ampacity must equal or exceed OCPD rating.',
    choices: [{ id: 'A', text: '800 amperes' }, { id: 'B', text: '150' }, { id: 'C', text: '300' }, { id: 'D', text: '500' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-239',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 239,
    question: 'GFCI protection is required for underwater swimming pool luminaires operating at over:',
    choices: [{ id: 'A', text: '15 volts' }, { id: 'B', text: '12 volts' }, { id: 'C', text: '25 volts' }, { id: 'D', text: '30 volts' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-240',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 240,
    question: 'Grounding pipe or conduit electrodes shall not be smaller than what trade size?',
    choices: [{ id: 'A', text: '20 mm (3/4 in.)' }, { id: 'B', text: '10 mm' }, { id: 'C', text: '8 mm' }, { id: 'D', text: '16 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-241',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 241,
    question: 'Rod and pipe grounding electrodes shall be driven to a depth of at least:',
    choices: [{ id: 'A', text: '2400 mm (8 ft)' }, { id: 'B', text: '1800 mm' }, { id: 'C', text: '2000 mm' }, { id: 'D', text: '2200 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-242',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 242,
    question: 'Each plate grounding electrode shall expose not less than what surface area to soil?',
    choices: [{ id: 'A', text: '1/5 sq. meter (0.2 m^2)' }, { id: 'B', text: '1/4 sq. m' }, { id: 'C', text: '1/3 sq. m' }, { id: 'D', text: '1/2 sq. m' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-243',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 243,
    question: 'An equipment grounding conductor may be identified by:',
    choices: [
      { id: 'A', text: 'being bare, continuous green, or green with yellow stripes' },
      { id: 'B', text: 'one continuous green color only' },
      { id: 'C', text: 'continuous green with yellow stripes only' },
      { id: 'D', text: 'being bare only' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-244',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 244,
    question: 'A/an _____ shall be used to connect grounding terminal of receptacle to grounded metal box.',
    choices: [{ id: 'A', text: 'equipment bonding jumper' }, { id: 'B', text: 'feeder conductor' }, { id: 'C', text: 'branch circuit' }, { id: 'D', text: 'bonding jumper main' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-245',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 245,
    question: 'Which of the following shall be provided where necessary to ensure electrical continuity?',
    choices: [{ id: 'A', text: 'Bonding' }, { id: 'B', text: 'Grounding' }, { id: 'C', text: 'Jumpers' }, { id: 'D', text: 'connectors' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-246',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 246,
    question: 'Metal enclosures containing grounding electrode conductors shall be:',
    choices: [{ id: 'A', text: 'electrically continuous and bonded at both ends' }, { id: 'B', text: 'not permitted' }, { id: 'C', text: 'rigid conduit only' }, { id: 'D', text: 'unbonded' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-247',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 247,
    question: 'A device capable of intercepting lightning discharges in preference to vulnerable building structures is an:',
    choices: [{ id: 'A', text: 'air terminal / lightning rod' }, { id: 'B', text: 'ground rod' }, { id: 'C', text: 'surge arrester' }, { id: 'D', text: 'ground terminal' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-248',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 248,
    question: 'A loop conductor encircling a structure and interconnecting all lightning protection ground terminals is a:',
    choices: [{ id: 'A', text: 'counterpoise / ground loop' }, { id: 'B', text: 'bonding' }, { id: 'C', text: 'ground terminals' }, { id: 'D', text: 'ground fittings' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-249',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 249,
    question: 'Average distance between down conductors in a lightning protection system shall not exceed:',
    choices: [{ id: 'A', text: '30 meters' }, { id: 'B', text: '15 meters' }, { id: 'C', text: '20 meters' }, { id: 'D', text: '25 meters' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-250',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 250,
    question: 'Protection of flammable liquid storage tanks against lightning may be achieved by:',
    choices: [{ id: 'A', text: 'Any of these (air terminals, overhead ground wires, masts)' }, { id: 'B', text: 'air terminals' }, { id: 'C', text: 'overhead ground wires' }, { id: 'D', text: 'masts' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-251',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 251,
    question: 'When do you use a tap tool in electrical/machining work?',
    choices: [{ id: 'A', text: 'cutting internal screw threads' }, { id: 'B', text: 'connecting wires' }, { id: 'C', text: 'reaming raceways' }, { id: 'D', text: 'cutting external threads' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-252',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 252,
    question: 'The ampacity of conductors in armored cable embedded in thermal insulation shall be based on what temperature column?',
    choices: [{ id: 'A', text: '60 °C' }, { id: 'B', text: '75 °C' }, { id: 'C', text: '85 °C' }, { id: 'D', text: '90 °C' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-253',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 253,
    question: 'Type MC metal clad cable shall be supported and secured at intervals not exceeding:',
    choices: [{ id: 'A', text: '1800 mm' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '2200 mm' }, { id: 'D', text: '2500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-254',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 254,
    question: 'Type MI mineral insulated cable shall be supported at intervals not exceeding:',
    choices: [{ id: 'A', text: '1800 mm' }, { id: 'B', text: '1500 mm' }, { id: 'C', text: '2000 mm' }, { id: 'D', text: '2200 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-255',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 255,
    question: 'Type NM or NMC non-metallic sheathed cable supports shall be secured at intervals not exceeding:',
    choices: [{ id: 'A', text: '1300 mm (4.5 ft)' }, { id: 'B', text: '1500 mm' }, { id: 'C', text: '1000 mm' }, { id: 'D', text: '800 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-256',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 256,
    question: 'Intermediate metal conduit (IMC) shall be supported at least every:',
    choices: [{ id: 'A', text: '3000 mm (10 ft)' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '2400 mm' }, { id: 'D', text: '2700 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-257',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 257,
    question: 'Conduits smaller than _____ mm trade size shall NOT be used for general wiring.',
    choices: [{ id: 'A', text: '15 mm (1/2 in.)' }, { id: 'B', text: '20 mm' }, { id: 'C', text: '25 mm' }, { id: 'D', text: '32 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-258',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 258,
    question: 'Rigid metal conduit shall be firmly fastened within _____ of each outlet box or termination.',
    choices: [{ id: 'A', text: '900 mm (3 ft)' }, { id: 'B', text: '700 mm' }, { id: 'C', text: '500 mm' }, { id: 'D', text: '1000 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-259',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 259,
    question: 'Flexible metal conduit (FMC) shall be secured at intervals not exceeding:',
    choices: [{ id: 'A', text: '1300 mm (4.5 ft)' }, { id: 'B', text: '1200 mm' }, { id: 'C', text: '1400 mm' }, { id: 'D', text: '1500 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-260',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 260,
    question: 'Each length of HDPE conduit shall be clearly marked at least every _____ mm.',
    choices: [{ id: 'A', text: '3000 mm' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '2400 mm' }, { id: 'D', text: '2800 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-261',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 261,
    question: 'What fraction of capacitor full load current is used as minimum ampacity for capacitor circuit conductors?',
    choices: [{ id: 'A', text: '1/3 (135% factor / 33.3%)' }, { id: 'B', text: '1/2' }, { id: 'C', text: '1/4' }, { id: 'D', text: '1/5' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-262',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 262,
    question: 'Which of the following statements is NOT true regarding grounding electrode conductors?',
    choices: [
      { id: 'A', text: 'Splices or joints are freely allowed anywhere' },
      { id: 'B', text: 'It shall be insulated, covered or bare' },
      { id: 'C', text: 'It shall be solid or stranded' },
      { id: 'D', text: 'It must be continuous without unapproved splices' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-263',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 263,
    question: 'For dwelling units, demand factor for the first 3,000 VA of general lighting load is:',
    choices: [{ id: 'A', text: '100%' }, { id: 'B', text: '85%' }, { id: 'C', text: '115%' }, { id: 'D', text: '90%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-264',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 264,
    question: 'The overcurrent device for arc welders with transformers shall NOT exceed what percent of primary current?',
    choices: [{ id: 'A', text: '200%' }, { id: 'B', text: '125%' }, { id: 'C', text: '150%' }, { id: 'D', text: '100%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-265',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 265,
    question: 'What is the standard nominal single-phase secondary supply voltage in the Philippines for residential homes?',
    choices: [{ id: 'A', text: '230 volts AC' }, { id: 'B', text: '240 volts AC' }, { id: 'C', text: '220 volts AC' }, { id: 'D', text: '115 volts AC' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-266',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 266,
    question: 'The branch-circuit short-circuit protection for a hermetic motor compressor shall not exceed what percent of rated load current?',
    choices: [{ id: 'A', text: '175%' }, { id: 'B', text: '125%' }, { id: 'C', text: '140%' }, { id: 'D', text: '150%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-277',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 267,
    question: 'Liquidtight flexible non-metallic conduit shall NOT be used in individual lengths longer than:',
    choices: [{ id: 'A', text: '1800 mm (6 ft)' }, { id: 'B', text: '2000 mm' }, { id: 'C', text: '1500 mm' }, { id: 'D', text: '1200 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-268',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 268,
    question: 'Conductors extending from the service point to the service disconnecting means are:',
    choices: [{ id: 'A', text: 'service conductors' }, { id: 'B', text: 'riser' }, { id: 'C', text: 'secondary conductors' }, { id: 'D', text: 'primary conductors' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-269',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 269,
    question: 'For church auditoriums, general unit lighting load specified per square meter is:',
    choices: [{ id: 'A', text: '8 VA/m^2' }, { id: 'B', text: '12 VA/m^2' }, { id: 'C', text: '2 VA/m^2' }, { id: 'D', text: '4 VA/m^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-270',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 270,
    question: 'For a hermetic motor compressor, allowable rating for branch disconnecting means is what percent of rated load current?',
    choices: [{ id: 'A', text: '115 %' }, { id: 'B', text: '120 %' }, { id: 'C', text: '85 %' }, { id: 'D', text: '90 %' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-271',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 271,
    question: 'The maximum total allowable voltage drop from main service panel to the farthest outlet is:',
    choices: [{ id: 'A', text: '5%' }, { id: 'B', text: '15%' }, { id: 'C', text: '20%' }, { id: 'D', text: '10%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-272',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 272,
    question: 'Maximum number of overcurrent devices permitted in a single lighting and appliance branch circuit panelboard cabinet is:',
    choices: [{ id: 'A', text: '48 poles' }, { id: 'B', text: '24' }, { id: 'C', text: '16' }, { id: 'D', text: '32' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-273',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 273,
    question: 'The neutral conductor from transformer neutral point to impedance grounding device shall be:',
    choices: [{ id: 'A', text: 'fully insulated' }, { id: 'B', text: 'partly insulated' }, { id: 'C', text: 'coated' }, { id: 'D', text: 'bare' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-274',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 274,
    question: 'The minimum copper size for overhead service drop conductors is:',
    choices: [{ id: 'A', text: '8.0 mm^2' }, { id: 'B', text: '14 mm^2' }, { id: 'C', text: '5.5 mm^2' }, { id: 'D', text: '3.5 mm^2' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-275',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 275,
    question: 'For each 2-wire laundry branch circuit in a dwelling, a feeder load of NOT less than _____ shall be included.',
    choices: [{ id: 'A', text: '1,500 VA' }, { id: 'B', text: '1,200 VA' }, { id: 'C', text: '1,800 VA' }, { id: 'D', text: '2,000 VA' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-276',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 276,
    question: 'Branch circuit conductors for resistance heating and motor units must be rated at what percent of total load?',
    choices: [{ id: 'A', text: '125% of total load' }, { id: 'B', text: '100% of total load' }, { id: 'C', text: '115% of total load' }, { id: 'D', text: '150% of total load' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-277_2',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 277,
    question: 'A protective device connecting conductors to ground to discharge surge currents from lightning is a:',
    choices: [{ id: 'A', text: 'surge arrester' }, { id: 'B', text: 'grounding electrode' }, { id: 'C', text: 'isolator' }, { id: 'D', text: 'earthing switch' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-278',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 278,
    question: 'Rigid non-metallic conduit (PVC) shall be securely supported within ____ of each box or termination.',
    choices: [{ id: 'A', text: '900 mm' }, { id: 'B', text: '1200 mm' }, { id: 'C', text: '1500 mm' }, { id: 'D', text: '1800 mm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-279',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 279,
    question: 'For service installations consisting of not more than two 2-wire branch circuits, the main disconnect rating shall be NOT less than:',
    choices: [{ id: 'A', text: '30 A' }, { id: 'B', text: '50 A' }, { id: 'C', text: '20 A' }, { id: 'D', text: '40 A' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-280',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 280,
    question: 'An overcurrent protective device with a circuit-opening fusible link heated and severed by overcurrent is a:',
    choices: [{ id: 'A', text: 'Fuse' }, { id: 'B', text: 'Thermocouple' }, { id: 'C', text: 'Magnetic contactor' }, { id: 'D', text: 'Overload relay' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-281',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 281,
    question: 'A single grounding rod, pipe, or plate electrode shall have a resistance to ground of _____ or less.',
    choices: [{ id: 'A', text: '25 ohms' }, { id: 'B', text: '30 ohms' }, { id: 'C', text: '20 ohms' }, { id: 'D', text: '15 ohms' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-282',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (283 Questions)',
    questionNumber: 282,
    question: 'A heavy duty lampholder shall have a rating no less than:',
    choices: [{ id: 'A', text: '660 watts' }, { id: 'B', text: '450 watts' }, { id: 'C', text: '500 watts' }, { id: 'D', text: '600 watts' }],
    correctChoiceId: 'A'
  },
  {
    id: 'pec-283',
    subject: 'PEC',
    sourceFileName: 'PEC Reviewer (325 Questions)',
    questionNumber: 283,
    question: 'What type of electrical building conductor has trade name "moisture resistant thermoplastic"?',
    choices: [{ id: 'A', text: 'Type TW' }, { id: 'B', text: 'Type THW' }, { id: 'C', text: 'Type THHN' }, { id: 'D', text: 'Type UF' }],
    correctChoiceId: 'A'
  },
  {
    id: "pec-284",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 284,
    question: "What is the maximum number of conductor in a raceway that does not need to be derated?",
    choices: [
      { id: "A", text: "3" },
      { id: "B", text: "2" },
      { id: "C", text: "4" },
      { id: "D", text: "5" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-285",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 285,
    question: "Which of the following is NOT a factor in calculating the feeder conductor size?",
    choices: [
      { id: "A", text: "branch circuit protection" },
      { id: "B", text: "ambient temperature" },
      { id: "C", text: "voltage drop" },
      { id: "D", text: "demand factor" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-286",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 286,
    question: "An attachment plug and receptacle shall be permitted to serve as the disconnecting means for single phase room airconditioner rated 250 V or less, if the manual controls of the room air conditioner is readily accessible and located within distance from the floor in mm",
    choices: [
      { id: "A", text: "1800" },
      { id: "B", text: "1500" },
      { id: "C", text: "2500" },
      { id: "D", text: "2200" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-287",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 287,
    question: "Flexible metal conduits must not be used in",
    choices: [
      { id: "A", text: "all of these" },
      { id: "B", text: "wet locations" },
      { id: "C", text: "hoistways" },
      { id: "D", text: "storage battery rooms" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-288",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 288,
    question: "The minimum number of branch circuits shall be determined from the",
    choices: [
      { id: "A", text: "total computed load and the rating of the circuits used" },
      { id: "B", text: "size or rating of the circuits by the PEC" },
      { id: "C", text: "minimum number required by the PEC" },
      { id: "D", text: "total computed load and the size of disconnected needed" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-289",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 289,
    question: "If the terminal of the equipment grounding conductor is not visible, the conductor entrance hole shall be marked with the word",
    choices: [
      { id: "A", text: "green" },
      { id: "B", text: "white" },
      { id: "C", text: "gray" },
      { id: "D", text: "black" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-290",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 290,
    question: "No over-current device shall be connected in series with any conductor that is",
    choices: [
      { id: "A", text: "intentionally grounded" },
      { id: "B", text: "stranded" },
      { id: "C", text: "closed" },
      { id: "D", text: "current carrying" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-291",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 291,
    question: "Service entrance cables shall be supported at intervals NOT exceeding",
    choices: [
      { id: "A", text: "760 mm" },
      { id: "B", text: "900 mm" },
      { id: "C", text: "800 mm" },
      { id: "D", text: "1000 mm" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-292",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 292,
    question: "Groundings allows __ opposition path of current of flow.",
    choices: [
      { id: "A", text: "Low" },
      { id: "B", text: "Effective" },
      { id: "C", text: "high" },
      { id: "D", text: "medium" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-293",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 293,
    question: "Individual arrester grounding conductors shall be no smaller than __ copper.",
    choices: [
      { id: "A", text: "14 mm^2" },
      { id: "B", text: "8.0 mm^2" },
      { id: "C", text: "5.5 mm^2" },
      { id: "D", text: "none of these" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-294",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 294,
    question: "A switch intended for use in general distribution and branch circuits. It is rated in amperes, and it is capable of interrupting its rated current at its rated voltage, is a __________ switch.",
    choices: [
      { id: "A", text: "General use" },
      { id: "B", text: "Bypass isolation" },
      { id: "C", text: "Isolating" },
      { id: "D", text: "Transfer" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-295",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 295,
    question: "__________ is a pliable raceway. I. EMT II. ENT III. PVC",
    choices: [
      { id: "A", text: "ll only" },
      { id: "B", text: "l only" },
      { id: "C", text: "l and lll only" },
      { id: "D", text: "l, ll and lll" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-296",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 296,
    question: "Flexible cords and cables shall be protected by __________ where passing through holes in covers, outlet boxes, or similar enclosures. I. Fittings II. Bushings III. Tie wraps",
    choices: [
      { id: "A", text: "l and ll only" },
      { id: "B", text: "l only" },
      { id: "C", text: "ll only" },
      { id: "D", text: "ll and lll only" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-297",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 297,
    question: "Raceways or cable trays containing electric conductors shall not contain __________. I. Pipe for steam II. Tube for air III. Pipe for water",
    choices: [
      { id: "A", text: "l, ll and lll" },
      { id: "B", text: "l only" },
      { id: "C", text: "ll only" },
      { id: "D", text: "lll only" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-298",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 298,
    question: "Electrical continuity is required by the electrical code for metallic conduit _____.",
    choices: [
      { id: "A", text: "To ensure equipment grounding" },
      { id: "B", text: "To reduce static electricity" },
      { id: "C", text: "To reduce inductive heat" },
      { id: "D", text: "To trace electrical wiring" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-299",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 299,
    question: "The grounded conductor would connect to the ______ of a lampholder",
    choices: [
      { id: "A", text: "Screw shell" },
      { id: "B", text: "Filament" },
      { id: "C", text: "Base contact" },
      { id: "D", text: "Lead in wire" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-300",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 300,
    question: "The service conductors between the terminal of the service equipment and a point usually outside the building, clear of the building walls, where joined by tap or splice to the service drop is called the ______",
    choices: [
      { id: "A", text: "Service-entrance conductors" },
      { id: "B", text: "Service drop" },
      { id: "C", text: "Service equipment" },
      { id: "D", text: "none of these" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-301",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 301,
    question: "A chain wrench can be used ______. I. With one hand after the chain is around the conduit. II. In confined places and close to walls. III. For all sizes of conduit.",
    choices: [
      { id: "A", text: "I, II, and III" },
      { id: "B", text: "I and II only" },
      { id: "C", text: "I and III only" },
      { id: "D", text: "II and III only" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-302",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 302,
    question: "A one-quarter bend in a raceway is equivalent to an angle of ____ degrees.",
    choices: [
      { id: "A", text: "90" },
      { id: "B", text: "45" },
      { id: "C", text: "25" },
      { id: "D", text: "180" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-303",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 303,
    question: "A fuse on a 20 amp branch circuit has blown. The fuse is replaced with a 20 amp fuse and the fuse blows when the switch is turned on. The electrician should _____.",
    choices: [
      { id: "A", text: "Check the circuit for a problem" },
      { id: "B", text: "Check the ground rod connection first" },
      { id: "C", text: "Change to a circuit breaker" },
      { id: "D", text: "Install a 30 amp fuse" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-304",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 304,
    question: "A conduit body is _____.",
    choices: [
      { id: "A", text: "A “LB” or “T”, or similar fitting" },
      { id: "B", text: "A cast fitting such as an FD or FS box" },
      { id: "C", text: "A standard 10 foot length of conduit" },
      { id: "D", text: "A sealtight enclosure" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-305",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 305,
    question: "Raceways shall be provided with ____ to compensate for thermal expansion and contraction",
    choices: [
      { id: "A", text: "Expansion joints" },
      { id: "B", text: "Accordion joints" },
      { id: "C", text: "Thermal fittings" },
      { id: "D", text: "Control-expansion" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-306",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 306,
    question: "The most important reason for using a conduit-type fitting in preference to making a bend in a one inch conduit is to _____",
    choices: [
      { id: "A", text: "Make wire pulling easier" },
      { id: "B", text: "Avoid the possible flattening of the conduit when making the bend" },
      { id: "C", text: "Cut down the amount of conduit needed" },
      { id: "D", text: "Make a neater job" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-307",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 307,
    question: "Where conductors carrying alternating current are installed in metal enclosures or metal raceways, they shall be so arranged as to avoid heating the surrounding metal by induction to accomplish this ______ shall be grouped together. I. All phase conductors II. Where used, the neutral III. All equipment grounding conductors",
    choices: [
      { id: "A", text: "I, II, and III" },
      { id: "B", text: "I only" },
      { id: "C", text: "I and II only" },
      { id: "D", text: "I and III only" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-308",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 308,
    question: "A wrench you would not use to connect rigid metal conduit is a ____ wrench",
    choices: [
      { id: "A", text: "Box end" },
      { id: "B", text: "Chain" },
      { id: "C", text: "Strap" },
      { id: "D", text: "Stillson" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-309",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 309,
    question: "When re-routing conduit, it may be necessary to increase the wire size, if the distance is greater, in order to __________.",
    choices: [
      { id: "A", text: "Compensate for voltage drop" },
      { id: "B", text: "Account for current drop" },
      { id: "C", text: "Allow for possible resistance drop" },
      { id: "D", text: "Account for ampacity drop" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-310",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 310,
    question: "Galvanized conduit is made of _________",
    choices: [
      { id: "A", text: "Iron" },
      { id: "B", text: "Zinc" },
      { id: "C", text: "Nickle" },
      { id: "D", text: "Lead" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-311",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 311,
    question: "When cutting a metal conduit with a hacksaw, the pressure applied to the hacksaw should be on",
    choices: [
      { id: "A", text: "The forward stroke only" },
      { id: "B", text: "None of these" },
      { id: "C", text: "The return stroke only" },
      { id: "D", text: "Both the forward and return stroke equally" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-312",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 312,
    question: "A rigid conduit connecting to an outlet box should have a",
    choices: [
      { id: "A", text: "Locknut on the outside and a bushing on the inside" },
      { id: "B", text: "Bushing and locknut on the outside" },
      { id: "C", text: "Bushing on the outside and a locknut on the inside" },
      { id: "D", text: "Locknut and bushing on the inside" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-313",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 313,
    question: "To fasten a raceway to a solid concrete ceiling, you would use ___________.",
    choices: [
      { id: "A", text: "Expansion bolts" },
      { id: "B", text: "Toggle bolts" },
      { id: "C", text: "Wooden plugs" },
      { id: "D", text: "Rawl plugs" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-314",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 314,
    question: "The identified grounded conductor of a lighting circuit is always connected to the screw of a light socket to _____.",
    choices: [
      { id: "A", text: "Reduce the possibility of accidental shock" },
      { id: "B", text: "Ground the light fixture" },
      { id: "C", text: "Improve the efficiency of the lamp" },
      { id: "D", text: "Provide the easiest place to contact the wire" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-315",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 315,
    question: "The Code rule for maximum 90 degree bends in a conduit between two boxes is four, the most likely reason for the total 360 degree limitation is __",
    choices: [
      { id: "A", text: "It makes pulling the conductors through the conduit too difficult" },
      { id: "B", text: "It is unsafe" },
      { id: "C", text: "You can damage the galvanized coating on the conduit" },
      { id: "D", text: "Too many bends require extra wire to be pulled" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-316",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 316,
    question: "The best thing to cut PVC conduit within a tight area is __",
    choices: [
      { id: "A", text: "A nylon string" },
      { id: "B", text: "A short hacksaw" },
      { id: "C", text: "A knife" },
      { id: "D", text: "A pipe cutter" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-317",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 317,
    question: "When installing raceway systems, it is essential that they be __",
    choices: [
      { id: "A", text: "Rigidly supported as required" },
      { id: "B", text: "Exposed" },
      { id: "C", text: "Concealed in walls" },
      { id: "D", text: "Readily Accessible" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-318",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 318,
    question: "The ungrounded conductor can be identified by the color ___",
    choices: [
      { id: "A", text: "Pink flamingo" },
      { id: "B", text: "White or gray" },
      { id: "C", text: "Green or bare" },
      { id: "D", text: "None of these" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-319",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 319,
    question: "Copper-clad aluminum conductors have an ampacity ______",
    choices: [
      { id: "A", text: "Equal to aluminum" },
      { id: "B", text: "Lower than copper but higher than aluminum" },
      { id: "C", text: "Equal to copper" },
      { id: "D", text: "Rating of their own" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-320",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 320,
    question: "The advantage of cutting a metal rigid conduit with a hacksaw rather than a pipe cutter is ___",
    choices: [
      { id: "A", text: "Less reaming is required" },
      { id: "B", text: "You do not need a vice" },
      { id: "C", text: "Less energy required in cutting" },
      { id: "D", text: "Threading oil is not required" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-321",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 321,
    question: "A current limiting overcurrent protective device which will _____ the current flowing in the faulted circuit.",
    choices: [
      { id: "A", text: "Reduce" },
      { id: "B", text: "Increase" },
      { id: "C", text: "Maintain" },
      { id: "D", text: "None of these" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-322",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 322,
    question: "Because aluminum is not a magnetic metal, there will be _____ present when aluminum conductors are grouped in a raceway",
    choices: [
      { id: "A", text: "No heating due to hysteresis" },
      { id: "B", text: "No heat due to voltage" },
      { id: "C", text: "No induced current" },
      { id: "D", text: "None of these" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-323",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 323,
    question: "Conduit should be installed as to prevent the confliction of water in it between outlets. The conduit should not have a ___",
    choices: [
      { id: "A", text: "Low point between successive outlets" },
      { id: "B", text: "Low point at an outlet" },
      { id: "C", text: "High point at an outlet" },
      { id: "D", text: "High point between successive outlets" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-324",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 324,
    question: "Receptacles in residential wiring are regularly connected in ___",
    choices: [
      { id: "A", text: "Parallel" },
      { id: "B", text: "Perpendicular" },
      { id: "C", text: "Series" },
      { id: "D", text: "Diagonal" }
    ],
    correctChoiceId: "A"
  },
  {
    id: "pec-325",
    subject: "PEC",
    sourceFileName: "PEC Reviewer (325 Questions)",
    questionNumber: 325,
    question: "The connection between the grounded circuit conductor and the equipment grounding conductor at the service is called ____ bonding jumper",
    choices: [
      { id: "A", text: "Main" },
      { id: "B", text: "Circuit" },
      { id: "C", text: "Equipment" },
      { id: "D", text: "Appliance" }
    ],
    correctChoiceId: "A"
  }
];

export const PEC_QUESTIONS: FlashcardQuestion[] = RAW_PEC_QUESTIONS.map((q, idx) => {
  const seed = (q.questionNumber || idx + 1) * 59 + 179;
  return shuffleQuestionChoices(q, true, seed);
});
