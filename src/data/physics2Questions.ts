import { FlashcardQuestion, shuffleQuestionChoices } from '../services/questionParser';
import { RAW_P2_PART1 } from './physics2RawPart1';
import { RAW_P2_PART2 } from './physics2RawPart2';

const ORIGINAL_45_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'p2-1',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 1,
    question: 'Which of the following phenomenon cannot take place with sound waves?',
    choices: [
      { id: 'A', text: 'polarization' },
      { id: 'B', text: 'diffraction' },
      { id: 'C', text: 'reflection' },
      { id: 'D', text: 'Interference' }
    ],
    correctChoiceId: 'A',
    explanation: 'Polarization requires transverse waves. Sound waves in fluids are longitudinal, so sound cannot be polarized.'
  },
  {
    id: 'p2-2',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 2,
    question: 'A light scattered perpendicular to an incident beam is partly?',
    choices: [
      { id: 'A', text: 'polarized' },
      { id: 'B', text: 'monochromatic' },
      { id: 'C', text: 'coherent' },
      { id: 'D', text: 'Diffracted' }
    ],
    correctChoiceId: 'A',
    explanation: 'Light scattered at 90 degrees relative to the original unpolarized beam is linearly polarized.'
  },
  {
    id: 'p2-3',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 3,
    question: 'How tall does a wall mirror have to be in order for you to see all of yourself in the mirror? Imagine you stand a distance "d" from the mirror and your height is "h" and "L" is length of mirror required.',
    choices: [
      { id: 'A', text: 'L = 1/2h' },
      { id: 'B', text: 'L = 1/3h' },
      { id: 'C', text: 'L = 1/5 h' },
      { id: 'D', text: 'L = 1/4 h' }
    ],
    correctChoiceId: 'A',
    explanation: 'By the law of reflection, a plane mirror must be at least half your height (h/2) to view your full height.'
  },
  {
    id: 'p2-4',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 4,
    question: 'Which of the following statement/s about sound is/are true? I. All sounds are produced by the vibration of bodies. II. Sound cannot travel through a vacuum. III. Sound can be transmitted through some material.',
    choices: [
      { id: 'A', text: 'I, II and III' },
      { id: 'B', text: 'I and III' },
      { id: 'C', text: 'II and III' },
      { id: 'D', text: 'I and II' }
    ],
    correctChoiceId: 'A',
    explanation: 'All three statements are fundamental physical properties of mechanical sound waves.'
  },
  {
    id: 'p2-5',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 5,
    question: 'As a person moves closer to a plane mirror, the size of the image formed by the mirror',
    choices: [
      { id: 'A', text: 'Remains the same' },
      { id: 'B', text: 'gets smaller' },
      { id: 'C', text: 'Get larger' },
      { id: 'D', text: 'increases, then decreases' }
    ],
    correctChoiceId: 'A',
    explanation: 'Images in plane mirrors always have a magnification of +1, regardless of distance.'
  },
  {
    id: 'p2-6',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 6,
    question: 'Which characteristics of a wave changes as the wave travels across a boundary between two different media?',
    choices: [
      { id: 'A', text: 'speed' },
      { id: 'B', text: 'Frequency' },
      { id: 'C', text: 'period' },
      { id: 'D', text: 'phase' }
    ],
    correctChoiceId: 'A',
    explanation: 'Wave speed changes depending on medium density and elastic properties while frequency remains constant.'
  },
  {
    id: 'p2-7',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 7,
    question: 'The ratio of the velocity of light in vacuum to its velocity of another material is',
    choices: [
      { id: 'A', text: 'Refractive Index' },
      { id: 'B', text: 'Poisson’s Ratio' },
      { id: 'C', text: 'Module ratio of Elasticity' },
      { id: 'D', text: 'Specific Index' }
    ],
    correctChoiceId: 'A',
    explanation: 'Index of refraction n = c / v.'
  },
  {
    id: 'p2-8',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 8,
    question: 'A gamma ray is composed of',
    choices: [
      { id: 'A', text: 'high energy electromagnetic radiation' },
      { id: 'B', text: 'high energy protons' },
      { id: 'C', text: 'high energy neutrons' },
      { id: 'D', text: 'high energy electrons' }
    ],
    correctChoiceId: 'A',
    explanation: 'Gamma rays are high-frequency, high-energy electromagnetic photons emitted from atomic nuclei.'
  },
  {
    id: 'p2-9',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 9,
    question: 'In a transverse wave, the individual particles of the medium',
    choices: [
      { id: 'A', text: 'Move perpendicularly to the direction of the wave’s travel' },
      { id: 'B', text: 'Move in circles' },
      { id: 'C', text: 'Move in ellipse' },
      { id: 'D', text: 'Move parallel to the direction of the wave’s travel' }
    ],
    correctChoiceId: 'A',
    explanation: 'Transverse waves oscillate perpendicular to the direction of wave propagation.'
  },
  {
    id: 'p2-10',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 10,
    question: 'Which light contains wavelength of all or nearly all colors?',
    choices: [
      { id: 'A', text: 'White light' },
      { id: 'B', text: 'Laser' },
      { id: 'C', text: 'X-rays' },
      { id: 'D', text: 'Gamma rays' }
    ],
    correctChoiceId: 'A',
    explanation: 'White light is polychromatic, containing wavelengths spanning the full visible spectrum.'
  },
  {
    id: 'p2-11',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 11,
    question: 'Which band of light wavelength are too short to be seen by the human eye?',
    choices: [
      { id: 'A', text: 'ultra violet' },
      { id: 'B', text: 'infrared' },
      { id: 'C', text: 'x-ray' },
      { id: 'D', text: 'visible' }
    ],
    correctChoiceId: 'A',
    explanation: 'Ultraviolet wavelengths (< 400 nm) are shorter than visible light.'
  },
  {
    id: 'p2-12',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 12,
    question: 'What color has the shortest wavelength of visible light listed?',
    choices: [
      { id: 'A', text: 'blue' },
      { id: 'B', text: 'red' },
      { id: 'C', text: 'yellow' },
      { id: 'D', text: 'green' }
    ],
    correctChoiceId: 'A',
    explanation: 'Blue light has shorter wavelengths (~450 nm) compared to green, yellow, and red.'
  },
  {
    id: 'p2-13',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 13,
    question: 'If a disturbance is parallel to the direction of travel of a wave, the wave is classified as',
    choices: [
      { id: 'A', text: 'longitudinal' },
      { id: 'B', text: 'electromagnetic' },
      { id: 'C', text: 'transverse' },
      { id: 'D', text: 'torsional' }
    ],
    correctChoiceId: 'A',
    explanation: 'Longitudinal waves oscillate parallel to propagation direction.'
  },
  {
    id: 'p2-14',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 14,
    question: 'The pitch of a note is dependent upon',
    choices: [
      { id: 'A', text: 'frequency' },
      { id: 'B', text: 'wavelength of sound' },
      { id: 'C', text: 'velocity of sound' },
      { id: 'D', text: 'amplitude' }
    ],
    correctChoiceId: 'A',
    explanation: 'Pitch is the human brain perception of sound wave frequency.'
  },
  {
    id: 'p2-15',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 15,
    question: 'Bending of waves around obstacles or through slits is called',
    choices: [
      { id: 'A', text: 'diffraction' },
      { id: 'B', text: 'reflection' },
      { id: 'C', text: 'refraction' },
      { id: 'D', text: 'dispersion' }
    ],
    correctChoiceId: 'A',
    explanation: 'Diffraction is the bending and spreading of waves around obstacles.'
  },
  {
    id: 'p2-16',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 16,
    question: 'Light rays are diverted back into the original medium when hitting a surface in',
    choices: [
      { id: 'A', text: 'reflection' },
      { id: 'B', text: 'refraction' },
      { id: 'C', text: 'diffraction' },
      { id: 'D', text: 'dispersion' }
    ],
    correctChoiceId: 'A',
    explanation: 'Reflection is the bouncing back of waves upon striking a barrier.'
  },
  {
    id: 'p2-17',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 17,
    question: 'Bending of light as a wave crosses a boundary between two transparent media is',
    choices: [
      { id: 'A', text: 'refraction' },
      { id: 'B', text: 'reflection' },
      { id: 'C', text: 'dispersion' },
      { id: 'D', text: 'diffraction' }
    ],
    correctChoiceId: 'A',
    explanation: 'Refraction occurs when light changes speed upon entering a new medium.'
  },
  {
    id: 'p2-18',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 18,
    question: 'Splitting up of white light waves into component colors is',
    choices: [
      { id: 'A', text: 'dispersion' },
      { id: 'B', text: 'refraction' },
      { id: 'C', text: 'reflection' },
      { id: 'D', text: 'diffraction' }
    ],
    correctChoiceId: 'A',
    explanation: 'Dispersion separates composite light wavelengths due to wavelength-dependent refraction.'
  },
  {
    id: 'p2-19',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 19,
    question: 'A wave that requires a material medium to propagate is called a',
    choices: [
      { id: 'A', text: 'mechanical wave' },
      { id: 'B', text: 'periodic wave' },
      { id: 'C', text: 'electromagnetic wave' },
      { id: 'D', text: 'reverberation effect' }
    ],
    correctChoiceId: 'A',
    explanation: 'Mechanical waves need matter (solids, liquids, or gases) to travel.'
  },
  {
    id: 'p2-20',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 20,
    question: 'A wave with continually oscillating, regular motion is a',
    choices: [
      { id: 'A', text: 'periodic wave' },
      { id: 'B', text: 'mechanical wave' },
      { id: 'C', text: 'electromagnetic wave' },
      { id: 'D', text: 'reverberation effect' }
    ],
    correctChoiceId: 'A',
    explanation: 'Periodic waves repeat at regular time intervals.'
  },
  {
    id: 'p2-21',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 21,
    question: 'Waves that do not require a material medium to propagate are',
    choices: [
      { id: 'A', text: 'electromagnetic wave' },
      { id: 'B', text: 'mechanical wave' },
      { id: 'C', text: 'periodic wave' },
      { id: 'D', text: 'reverberation effect' }
    ],
    correctChoiceId: 'A',
    explanation: 'EM waves propagate through a vacuum via oscillating electric and magnetic fields.'
  },
  {
    id: 'p2-22',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 22,
    question: 'Echoes producing a prolonged sound in an enclosure is known as',
    choices: [
      { id: 'A', text: 'reverberation effect' },
      { id: 'B', text: 'mechanical wave' },
      { id: 'C', text: 'periodic wave' },
      { id: 'D', text: 'electromagnetic wave' }
    ],
    correctChoiceId: 'A',
    explanation: 'Reverberation is the persistence of sound due to multiple reflections.'
  },
  {
    id: 'p2-23',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 23,
    question: 'Apparent frequency shift when a source of sound or a listener or both are in relative motion is',
    choices: [
      { id: 'A', text: 'doppler effect' },
      { id: 'B', text: 'reverberation effect' },
      { id: 'C', text: 'huygens principle' },
      { id: 'D', text: 'quantum theory' }
    ],
    correctChoiceId: 'A',
    explanation: 'Doppler effect accounts for observed frequency shifts due to relative motion.'
  },
  {
    id: 'p2-24',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 24,
    question: 'The physical theory that treats matter and energy in discrete units or quanta is',
    choices: [
      { id: 'A', text: 'quantum theory' },
      { id: 'B', text: 'polarization theory' },
      { id: 'C', text: 'refractive index' },
      { id: 'D', text: 'modulus ratio of elasticity' }
    ],
    correctChoiceId: 'A',
    explanation: 'Quantum theory explains atomic energy levels and photon behavior.'
  },
  {
    id: 'p2-25',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 25,
    question: 'The law relating polarization angle through reflection to refractive index is',
    choices: [
      { id: 'A', text: 'brewster law' },
      { id: 'B', text: 'polarization theory' },
      { id: 'C', text: 'refractive index' },
      { id: 'D', text: 'modulus ratio of elasticity' }
    ],
    correctChoiceId: 'A',
    explanation: 'Brewster law: tan(theta_p) = n2 / n1.'
  },
  {
    id: 'p2-26',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 26,
    question: 'Filtering or restricting light wave oscillations to a single plane is',
    choices: [
      { id: 'A', text: 'polarization' },
      { id: 'B', text: 'quantum theory' },
      { id: 'C', text: 'refractive index' },
      { id: 'D', text: 'brewster law' }
    ],
    correctChoiceId: 'A',
    explanation: 'Polarization isolates transverse electric field oscillations along one plane.'
  },
  {
    id: 'p2-27',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 27,
    question: 'The ratio of the velocity of light in a vacuum to the velocity of light in a medium is',
    choices: [
      { id: 'A', text: 'refractive index' },
      { id: 'B', text: 'modulus ratio of elasticity' },
      { id: 'C', text: 'polarization theory' },
      { id: 'D', text: 'brewster law' }
    ],
    correctChoiceId: 'A',
    explanation: 'Refractive index n = c/v.'
  },
  {
    id: 'p2-28',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 28,
    question: 'Frequency that a human ear can hear (audio frequency range)',
    choices: [
      { id: 'A', text: '20Hz to 20kHz' },
      { id: 'B', text: '20kHz to 50kHz' },
      { id: 'C', text: '2kHz to 5kHz' },
      { id: 'D', text: '50kHz to 60kHz' }
    ],
    correctChoiceId: 'A',
    explanation: 'The nominal human audible range is 20 Hz to 20,000 Hz.'
  },
  {
    id: 'p2-29',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 29,
    question: 'Which color light has the highest frequency?',
    choices: [
      { id: 'A', text: 'violet' },
      { id: 'B', text: 'red' },
      { id: 'C', text: 'yellow' },
      { id: 'D', text: 'green' }
    ],
    correctChoiceId: 'A',
    explanation: 'Violet light has the shortest wavelength and highest frequency (~7.5 x 10^14 Hz) in visible light.'
  },
  {
    id: 'p2-30',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 30,
    question: 'By which one of the following can a real image be produced? can it be produced by a:',
    choices: [
      { id: 'A', text: 'concave mirror' },
      { id: 'B', text: 'plane mirror' },
      { id: 'C', text: 'diverging lens' },
      { id: 'D', text: 'convex mirror' }
    ],
    correctChoiceId: 'A',
    explanation: 'Concave mirrors form real images when objects are placed outside the focal point.'
  },
  {
    id: 'p2-31',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 31,
    question: 'Which of the following waves is not a transverse wave?',
    choices: [
      { id: 'A', text: 'a sound wave' },
      { id: 'B', text: 'none of these' },
      { id: 'C', text: 'a wave traveling on a string' },
      { id: 'D', text: 'an electromagnetic wave' }
    ],
    correctChoiceId: 'A',
    explanation: 'Sound waves are longitudinal waves, not transverse.'
  },
  {
    id: 'p2-32',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 32,
    question: 'Which material type usually has a higher index of refraction?',
    choices: [
      { id: 'A', text: 'denser materials' },
      { id: 'B', text: 'heavier materials' },
      { id: 'C', text: 'less-dense materials' },
      { id: 'D', text: 'lighter materials' }
    ],
    correctChoiceId: 'A',
    explanation: 'Optically denser materials slow down light more, yielding a higher index of refraction.'
  },
  {
    id: 'p2-33',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 33,
    question: 'Whenever a body capable of oscillating is acted on by a periodic series of impulse having frequency equal to 1 of the natural frequency oscillating of the body, the body is set into vibration with a relatively large amplitude. This phenomenon refers to',
    choices: [
      { id: 'A', text: 'resonance' },
      { id: 'B', text: "Doppler's effect" },
      { id: 'C', text: 'interference' },
      { id: 'D', text: 'vibration' }
    ],
    correctChoiceId: 'A',
    explanation: 'Resonance occurs when driving frequency matches natural frequency, driving large amplitude oscillations.'
  },
  {
    id: 'p2-34',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 34,
    question: 'Which device could be used to determine whether a substance is radioactive?',
    choices: [
      { id: 'A', text: 'a Geiger counter' },
      { id: 'B', text: 'a linear accelerator' },
      { id: 'C', text: 'a Van de Graaff generator' },
      { id: 'D', text: 'a cyclotron' }
    ],
    correctChoiceId: 'A',
    explanation: 'A Geiger counter detects ionizing radiation emitted by radioactive substances.'
  },
  {
    id: 'p2-35',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 35,
    question: 'An Angstrom unit, commonly used for atomic and sub atomic distances is',
    choices: [
      { id: 'A', text: '10^-10m' },
      { id: 'B', text: '10^10m' },
      { id: 'C', text: '10^-6m' },
      { id: 'D', text: 'The distance light travel' }
    ],
    correctChoiceId: 'A',
    explanation: '1 Angstrom (Å) = 10^-10 meters.'
  },
  {
    id: 'p2-36',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 36,
    question: 'A photon is',
    choices: [
      { id: 'A', text: 'a particle of electromagnetic radiation' },
      { id: 'B', text: 'a neutral proton' },
      { id: 'C', text: 'a neutral electron' },
      { id: 'D', text: 'a charge neutron' }
    ],
    correctChoiceId: 'A',
    explanation: 'A photon is a discrete quantum packet of electromagnetic energy.'
  },
  {
    id: 'p2-37',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 37,
    question: 'It is a particle which has no charge.',
    choices: [
      { id: 'A', text: 'neutron' },
      { id: 'B', text: 'proton' },
      { id: 'C', text: 'quarks' },
      { id: 'D', text: 'electron' }
    ],
    correctChoiceId: 'A',
    explanation: 'Neutrons are subatomic particles with zero net electrical charge.'
  },
  {
    id: 'p2-38',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 38,
    question: 'You want to put up a mirror at a blind corner in a building. Which of the following will give you the largest field of view? Is it a:',
    choices: [
      { id: 'A', text: 'convex mirror' },
      { id: 'B', text: 'concave mirror' },
      { id: 'C', text: 'cylindrical mirror' },
      { id: 'D', text: 'plane mirror' }
    ],
    correctChoiceId: 'A',
    explanation: 'Convex mirrors curve outward to provide a wider field of view for blind corners.'
  },
  {
    id: 'p2-39',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 39,
    question: 'An x-ray is',
    choices: [
      { id: 'A', text: 'electromagnetic radiation' },
      { id: 'B', text: 'a ray of electron' },
      { id: 'C', text: 'a ray of helium nuclei' },
      { id: 'D', text: 'it is not known what it is, hence the name "x" rays' }
    ],
    correctChoiceId: 'A',
    explanation: 'X-rays are high-energy electromagnetic waves.'
  },
  {
    id: 'p2-40',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 40,
    question: 'An electron volt is',
    choices: [
      { id: 'A', text: 'a unit of energy equal to the energy possessed by an electron accelerating through a potential one volt' },
      { id: 'B', text: 'a voltage unit commonly used when measuring the voltage of the electron' },
      { id: 'C', text: 'the unit of electrical charge of one electron' },
      { id: 'D', text: 'none of the above' }
    ],
    correctChoiceId: 'A',
    explanation: '1 eV = 1.602 x 10^-19 Joules.'
  },
  {
    id: 'p2-41',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 41,
    question: 'The particle inside the nucleus is called',
    choices: [
      { id: 'A', text: 'nucleons' },
      { id: 'B', text: 'Nucleic' },
      { id: 'C', text: 'nuclons' },
      { id: 'D', text: 'nuclei' }
    ],
    correctChoiceId: 'A',
    explanation: 'Protons and neutrons bound inside an atomic nucleus are collectively termed nucleons.'
  },
  {
    id: 'p2-42',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 42,
    question: 'What is the heaviest subatomic particle?',
    choices: [
      { id: 'A', text: 'Neutron' },
      { id: 'B', text: 'Electron' },
      { id: 'C', text: 'Proton' },
      { id: 'D', text: 'Atom' }
    ],
    correctChoiceId: 'A',
    explanation: 'The neutron (1.6749 x 10^-27 kg) is slightly heavier than the proton (1.6726 x 10^-27 kg).'
  },
  {
    id: 'p2-43',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 43,
    question: 'The Pauli exclusion Principle state that',
    choices: [
      { id: 'A', text: 'No two atoms can occupy the same orbital unless their spins are different' },
      { id: 'B', text: 'Any atoms with free s orbital can from bonds' },
      { id: 'C', text: 'Two atoms can occupy the same orbital unless their spins are different' },
      { id: 'D', text: 'Atoms of the same configuration do not change' }
    ],
    correctChoiceId: 'A',
    explanation: 'No two identical fermions (such as electrons in an atom) can occupy the same quantum state simultaneously.'
  },
  {
    id: 'p2-44',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 44,
    question: 'What is the principle behind fiber optics?',
    choices: [
      { id: 'A', text: 'Total internal reflection' },
      { id: 'B', text: 'Refraction' },
      { id: 'C', text: 'Diffraction' },
      { id: 'D', text: 'Dispersion' }
    ],
    correctChoiceId: 'A',
    explanation: 'Optical fibers rely on total internal reflection to trap and guide light pulses down the core.'
  },
  {
    id: 'p2-45',
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Reviewer (45 Questions)',
    questionNumber: 45,
    question: 'Which doesn’t have electric charge?',
    choices: [
      { id: 'A', text: 'neutron' },
      { id: 'B', text: 'Proton' },
      { id: 'C', text: 'electron' },
      { id: 'D', text: 'molecule' }
    ],
    correctChoiceId: 'A',
    explanation: 'Neutrons have zero net electric charge.'
  }
];

// The 44 valid answered questions from the original Physics 2 reviewer (omitting #10 which had no answer in source)
const ORIGINAL_44_QUESTIONS = ORIGINAL_45_QUESTIONS.filter((q) => q.id !== 'p2-10');

// The 411 uploaded expanded reviewer questions
const RAW_411_TUPLES = [...RAW_P2_PART1, ...RAW_P2_PART2.slice(0, 51)];

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
const EXPANDED_411_QUESTIONS: FlashcardQuestion[] = RAW_411_TUPLES.map(([q, choicesList], idx) => {
  return {
    id: `p2-exp-${idx + 1}`,
    subject: 'Physics 2',
    sourceFileName: 'Physics 2 Comprehensive Bank (411 Questions)',
    questionNumber: idx + 45,
    question: q,
    choices: choicesList.map((chText, cIdx) => ({
      id: letters[cIdx] || `C${cIdx}`,
      text: chText,
    })),
    correctChoiceId: 'A',
  };
});

// Deterministic choice shuffling across A, B, C, D so the correct answer is not always A
export const PHYSICS_2_QUESTIONS: FlashcardQuestion[] = [
  ...ORIGINAL_44_QUESTIONS.map((q, idx) => shuffleQuestionChoices(q, true, (idx + 1) * 31 + 17)),
  ...EXPANDED_411_QUESTIONS.map((q, idx) => shuffleQuestionChoices(q, true, (idx + 1) * 47 + 103))
];

