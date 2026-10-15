import { FlashcardQuestion } from '../services/questionParser';

export const PHYSICS_1_QUESTIONS: FlashcardQuestion[] = [
  {
    id: "phys1-1",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 1,
    question: "In mechanics, what refers to the body of stationary rigid body?",
    choices: [
      { id: "A", text: "Statics" },
      { id: "B", text: "Kinematics" },
      { id: "C", text: "Kinetics" },
      { id: "D", text: "Dynamics" }
    ],
    correctChoiceId: "A",
    explanation: "Statics is the branch of mechanics that deals with bodies at rest or in equilibrium."
  },
  {
    id: "phys1-2",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 2,
    question: "When a force causes a change in mechanical energy when it moves around a closed path, it is said to be:",
    choices: [
      { id: "A", text: "Natural" },
      { id: "B", text: "Conservative" },
      { id: "C", text: "Virtual" },
      { id: "D", text: "Non-conservative" }
    ],
    correctChoiceId: "D",
    explanation: "A non-conservative force does net work on an object moving around a closed loop, changing total mechanical energy."
  },
  {
    id: "phys1-3",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 3,
    question: "If the coefficient of restitution is zero, the impact is:",
    choices: [
      { id: "A", text: "Partially elastic" },
      { id: "B", text: "Perfectly elastic" },
      { id: "C", text: "Perfectly inelastic" },
      { id: "D", text: "Partially inelastic" }
    ],
    correctChoiceId: "C",
    explanation: "A coefficient of restitution (e = 0) indicates a perfectly inelastic collision where maximum kinetic energy is lost."
  },
  {
    id: "phys1-4",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 4,
    question: "What are the three types of equilibrium?",
    choices: [
      { id: "A", text: "Kinematic, kinetic, static" },
      { id: "B", text: "Neutral, stable, and unstable" },
      { id: "C", text: "Static, kinetic, and stable" },
      { id: "D", text: "Static, dynamic, and kinetic" }
    ],
    correctChoiceId: "B",
    explanation: "Equilibrium states are classified as stable, unstable, or neutral depending on how the body behaves after displacement."
  },
  {
    id: "phys1-5",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 5,
    question: "In analysis of friction, the angle between the normal force and the resultant force _____ the angle of friction.",
    choices: [
      { id: "A", text: "Is less than" },
      { id: "B", text: "Is equal to" },
      { id: "C", text: "May be greater or less than" },
      { id: "D", text: "Is greater than" }
    ],
    correctChoiceId: "A",
    explanation: "Before motion occurs (static state), the angle between normal and resultant force is less than or equal to the angle of friction."
  },
  {
    id: "phys1-6",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 6,
    question: "What refers to a pair of equal, opposite and parallel forces?",
    choices: [
      { id: "A", text: "All of the other choices" },
      { id: "B", text: "Torque" },
      { id: "C", text: "Moment" },
      { id: "D", text: "Couple" }
    ],
    correctChoiceId: "D",
    explanation: "A couple consists of two parallel forces that are equal in magnitude, opposite in direction, and do not share a line of action."
  },
  {
    id: "phys1-7",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 7,
    question: "The principles of kinetics of particles are derived from which law?",
    choices: [
      { id: "A", text: "D'Alembert's principle" },
      { id: "B", text: "Newton's first law" },
      { id: "C", text: "Newton's second law" },
      { id: "D", text: "Newton's third law" }
    ],
    correctChoiceId: "C",
    explanation: "Newton's second law (F = ma) forms the foundational basis for kinetics."
  },
  {
    id: "phys1-8",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 8,
    question: "What refers to the branch of engineering mechanics which refers to the study of rigid body in motion without reference to the forces that cause the motion?",
    choices: [
      { id: "A", text: "Statics" },
      { id: "B", text: "Kinematics" },
      { id: "C", text: "Kinetics" },
      { id: "D", text: "Dynamics" }
    ],
    correctChoiceId: "B",
    explanation: "Kinematics describes motion geometrically (displacement, velocity, acceleration) without considering the forces causing it."
  },
  {
    id: "phys1-9",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 9,
    question: "Assuming the same mass and the same radius, which of the following has the greatest moment of inertia?",
    choices: [
      { id: "A", text: "A hollow cylinder" },
      { id: "B", text: "A solid sphere" },
      { id: "C", text: "A hollow sphere" },
      { id: "D", text: "A cardioid shape sphere" }
    ],
    correctChoiceId: "A",
    explanation: "In a hollow cylinder, all of its mass is concentrated at the outer radius R (I = mR²), giving it the largest moment of inertia."
  },
  {
    id: "phys1-10",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 10,
    question: "To completely specify the dynamic state of a body, the number of coordinates required is the number of:",
    choices: [
      { id: "A", text: "Degrees of freedom" },
      { id: "B", text: "Degrees of movability" },
      { id: "C", text: "Spatial determinants" },
      { id: "D", text: "Spatial coordinates" }
    ],
    correctChoiceId: "D",
    explanation: "Spatial coordinates define the precise position and orientation of a body in space."
  },
  {
    id: "phys1-11",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 11,
    question: "What velocity is normally referred to as the derivative of position vector with respect to time?",
    choices: [
      { id: "A", text: "Average velocity" },
      { id: "B", text: "Decreasing velocity" },
      { id: "C", text: "Instantaneous velocity" },
      { id: "D", text: "Increasing velocity" }
    ],
    correctChoiceId: "C",
    explanation: "Instantaneous velocity v(t) = dr/dt is defined as the time derivative of the position vector."
  },
  {
    id: "phys1-12",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 12,
    question: "A frictional force is ____ the area of contact.",
    choices: [
      { id: "A", text: "Dependent of" },
      { id: "B", text: "Independent of" },
      { id: "C", text: "Inversely proportional to" },
      { id: "D", text: "Directly proportional to" }
    ],
    correctChoiceId: "B",
    explanation: "Dry friction (Coulomb's Law) depends on the normal force and coefficient of friction, and is independent of contact surface area."
  },
  {
    id: "phys1-13",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 13,
    question: "A uniform circular motion can be considered as a combination of:",
    choices: [
      { id: "A", text: "Two simple harmonic motions" },
      { id: "B", text: "Rectilinear translation and curvilinear translation" },
      { id: "C", text: "Linear velocity and impulse" },
      { id: "D", text: "Simple harmonic motion and momentum" }
    ],
    correctChoiceId: "A",
    explanation: "Uniform circular motion in 2D is the vector sum of two perpendicular simple harmonic motions of equal frequency and phase difference π/2."
  },
  {
    id: "phys1-14",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 14,
    question: "What refers to a negligible body when compared to the distance involved regarding its motion?",
    choices: [
      { id: "A", text: "Element" },
      { id: "B", text: "Atomic substance" },
      { id: "C", text: "Quarks" },
      { id: "D", text: "Particle" }
    ],
    correctChoiceId: "D",
    explanation: "In mechanics, a particle is an idealized body whose size and dimensions are negligible relative to the scale of its motion."
  },
  {
    id: "phys1-15",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 15,
    question: "Which of the following set of quantities describes motion and uses the principle of work and energy?",
    choices: [
      { id: "A", text: "Force, mass, velocity, time" },
      { id: "B", text: "Force, weight, distance, time" },
      { id: "C", text: "Force, mass, distance, velocity" },
      { id: "D", text: "Force, mass, acceleration" }
    ],
    correctChoiceId: "C",
    explanation: "The work-energy principle relates work (Force × distance) to kinetic energy (½ mass × velocity²)."
  },
  {
    id: "phys1-16",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 16,
    question: "What equilibrium state exists when a body remains in its displaced state after being moved from its original equilibrium position?",
    choices: [
      { id: "A", text: "Dynamic" },
      { id: "B", text: "Neutral" },
      { id: "C", text: "Stable" },
      { id: "D", text: "Unstable" }
    ],
    correctChoiceId: "B",
    explanation: "In neutral equilibrium, a body stays in whatever new position it is moved to without restoring or disturbing forces."
  },
  {
    id: "phys1-17",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 17,
    question: "A spring whose force constant is k is cut in half. Each of the new springs has a force constant of:",
    choices: [
      { id: "A", text: "2k" },
      { id: "B", text: "4k" },
      { id: "C", text: "k" },
      { id: "D", text: "k/2" }
    ],
    correctChoiceId: "A",
    explanation: "Cutting a spring in half doubles its stiffness (force constant), making it 2k."
  },
  {
    id: "phys1-18",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 18,
    question: "An object that has momentum must also have:",
    choices: [
      { id: "A", text: "Impulse" },
      { id: "B", text: "Potential energy" },
      { id: "C", text: "Acceleration" },
      { id: "D", text: "Kinetic energy" }
    ],
    correctChoiceId: "D",
    explanation: "Any object with momentum (p = mv) has velocity and mass, which means it also possesses kinetic energy (KE = p²/2m)."
  },
  {
    id: "phys1-19",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 19,
    question: "Newton's first law is often referred to as which of the following?",
    choices: [
      { id: "A", text: "F = ma" },
      { id: "B", text: "The law of momentum" },
      { id: "C", text: "The law of inertia" },
      { id: "D", text: "The law of straight-line motion" }
    ],
    correctChoiceId: "C",
    explanation: "Newton's First Law states that bodies maintain their state of rest or uniform motion unless acted upon, known as the Law of Inertia."
  },
  {
    id: "phys1-20",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 20,
    question: "The units of joules can be converted to which of the following?",
    choices: [
      { id: "A", text: "Pa-m2" },
      { id: "B", text: "Pa-m3" },
      { id: "C", text: "N-kg" },
      { id: "D", text: "Pa/m2" }
    ],
    correctChoiceId: "B",
    explanation: "Pascal (N/m²) × m³ = N·m = Joules."
  },
  {
    id: "phys1-21",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 21,
    question: "Momentum is closely related to:",
    choices: [
      { id: "A", text: "Impulse" },
      { id: "B", text: "Power" },
      { id: "C", text: "Kinetic energy" },
      { id: "D", text: "Potential energy" }
    ],
    correctChoiceId: "A",
    explanation: "The Impulse-Momentum Theorem states that Impulse equals the change in momentum (J = Δp)."
  },
  {
    id: "phys1-22",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 22,
    question: "Which of the following is NOT a unit of work?",
    choices: [
      { id: "A", text: "Erg" },
      { id: "B", text: "N-m" },
      { id: "C", text: "Kg-sq. m/sq. sec" },
      { id: "D", text: "Dyne" }
    ],
    correctChoiceId: "D",
    explanation: "Dyne is a unit of force (CGS system), whereas N-m, Erg, and kg·m²/s² are units of work/energy."
  },
  {
    id: "phys1-23",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 23,
    question: "Formula of kinetic energy:",
    choices: [
      { id: "A", text: "2mv2" },
      { id: "B", text: "mgh" },
      { id: "C", text: "mv^2/2" },
      { id: "D", text: "v2/2m" }
    ],
    correctChoiceId: "C",
    explanation: "Kinetic energy is defined as KE = ½ mv² (or mv²/2)."
  },
  {
    id: "phys1-24",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 24,
    question: "If two objects have the same momentum, but different masses, which of these is possible?",
    choices: [
      { id: "A", text: "They each have the same velocity" },
      { id: "B", text: "The one with less mass has more kinetic energy" },
      { id: "C", text: "The same work is done to each to accelerate it from rest" },
      { id: "D", text: "The one with more mass requires more impulse to bring it to that momentum from rest" }
    ],
    correctChoiceId: "B",
    explanation: "Since KE = p²/(2m), for equal momentum p, smaller mass m yields higher kinetic energy."
  },
  {
    id: "phys1-25",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 25,
    question: "An empty glass was initially placed with a cube of ice. Water was filled into a glass such that the ice is at the tip of the glass. What will happen after the ice melts?",
    choices: [
      { id: "A", text: "Nothing spilled" },
      { id: "B", text: "Cannot determine since no density of the ice and water are given" },
      { id: "C", text: "Some spilled" },
      { id: "D", text: "Some spilled on the side of the glass" }
    ],
    correctChoiceId: "A",
    explanation: "By Archimedes' principle, floating ice displaces its own mass in liquid water, so the total water level stays exactly the same when melted."
  },
  {
    id: "phys1-26",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 26,
    question: "Concurrent forces are those forces whose lines of action:",
    choices: [
      { id: "A", text: "None of these" },
      { id: "B", text: "Meet on the same plane" },
      { id: "C", text: "Lie on the same line" },
      { id: "D", text: "Meet at one point" }
    ],
    correctChoiceId: "D",
    explanation: "Concurrent forces intersect at a single common point."
  },
  {
    id: "phys1-27",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 27,
    question: "Study of motion with reference to the force which causes the motion is:",
    choices: [
      { id: "A", text: "Dynamics" },
      { id: "B", text: "Statics" },
      { id: "C", text: "Kinetics" },
      { id: "D", text: "Kinematics" }
    ],
    correctChoiceId: "C",
    explanation: "Kinetics deals with forces causing the motion of bodies."
  },
  {
    id: "phys1-28",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 28,
    question: "The vector which represents the sum of a group of force vectors is called the:",
    choices: [
      { id: "A", text: "Magnitude" },
      { id: "B", text: "Resultant" },
      { id: "C", text: "Force polygon" },
      { id: "D", text: "Sum" }
    ],
    correctChoiceId: "B",
    explanation: "The resultant force is the single vector that produces the same effect as all given system forces combined."
  },
  {
    id: "phys1-29",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 29,
    question: "A branch of physical science which deals with state of rest or motion of bodies under the action of forces:",
    choices: [
      { id: "A", text: "Mechanics" },
      { id: "B", text: "Kinetics" },
      { id: "C", text: "Kinematics" },
      { id: "D", text: "Statics" }
    ],
    correctChoiceId: "A",
    explanation: "Engineering Mechanics is the physical science analyzing bodies at rest or in motion under force action."
  },
  {
    id: "phys1-30",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 30,
    question: "Conservation of _____ is used in collision, explosion and the like.",
    choices: [
      { id: "A", text: "Energy" },
      { id: "B", text: "Heat" },
      { id: "C", text: "Mass" },
      { id: "D", text: "Momentum" }
    ],
    correctChoiceId: "D",
    explanation: "Linear momentum is conserved in isolated system collisions and explosions."
  },
  {
    id: "phys1-31",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 31,
    question: "Which of the following is closely related to d'Alembert's theorem?",
    choices: [
      { id: "A", text: "Newton's third law of motion" },
      { id: "B", text: "Bernoulli's theorem" },
      { id: "C", text: "Newton's second law of motion" },
      { id: "D", text: "Newton's first law of motion" }
    ],
    correctChoiceId: "C",
    explanation: "D'Alembert's principle transforms a dynamic problem into a static equivalent problem using inertia forces (-ma) from Newton's 2nd Law."
  },
  {
    id: "phys1-32",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 32,
    question: "One Newton is equivalent to:",
    choices: [
      { id: "A", text: "10^8 dyne" },
      { id: "B", text: "10^5 dyne" },
      { id: "C", text: "10^7 dyne" },
      { id: "D", text: "10^9 dyne" }
    ],
    correctChoiceId: "B",
    explanation: "1 N = 10⁵ dynes (since 1 N = 1 kg·m/s² = 1000 g × 100 cm/s² = 10⁵ dynes)."
  },
  {
    id: "phys1-33",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 33,
    question: "You are standing on a bathroom scale in an elevator. In which of these situations must the scale read the same as when the elevator is at rest?",
    choices: [
      { id: "A", text: "Moving up at constant speed" },
      { id: "B", text: "Moving up with increasing speed" },
      { id: "C", text: "Moving down with increasing speed" },
      { id: "D", text: "In free fall (after the elevator cable has snapped)" }
    ],
    correctChoiceId: "A",
    explanation: "At constant speed, acceleration a = 0, so scale reading N = mg (same as at rest)."
  },
  {
    id: "phys1-34",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 34,
    question: "An object moving in a circle at a constant speed has an acceleration that is:",
    choices: [
      { id: "A", text: "Away from the center of the circle" },
      { id: "B", text: "Zero" },
      { id: "C", text: "In the direction of motion" },
      { id: "D", text: "Toward the center of the circle" }
    ],
    correctChoiceId: "D",
    explanation: "Centripetal acceleration is directed radially inward toward the center of the circle."
  },
  {
    id: "phys1-35",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 35,
    question: "A particle is moving with its acceleration parallel to velocity. What is the path of the particle?",
    choices: [
      { id: "A", text: "Circle" },
      { id: "B", text: "Parabolic" },
      { id: "C", text: "Linear" },
      { id: "D", text: "Never" }
    ],
    correctChoiceId: "C",
    explanation: "When acceleration is parallel to velocity, only speed changes and direction remains straight (linear motion)."
  },
  {
    id: "phys1-36",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 36,
    question: "When an object exerts a force on another object, the second object exerts on the first a force of the same magnitude but in the opposite direction. This law is known as:",
    choices: [
      { id: "A", text: "Newton's First Law of Motion" },
      { id: "B", text: "Newton's Third Law of Motion" },
      { id: "C", text: "None of these" },
      { id: "D", text: "Newton's Second Law of Motion" }
    ],
    correctChoiceId: "B",
    explanation: "Newton's 3rd Law of Motion dictates equal and opposite action-reaction force pairs."
  },
  {
    id: "phys1-37",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 37,
    question: "Two balls are thrown from the roof of a building with the same initial speed. One is thrown horizontally while the other is thrown at an angle of 20 degrees above the horizontal. Which hits the ground with the greatest speed? Ignore air resistance.",
    choices: [
      { id: "A", text: "They hit the ground with the same speed" },
      { id: "B", text: "The answer cannot be determined with the given information" },
      { id: "C", text: "The one thrown horizontally" },
      { id: "D", text: "The one thrown at 20 degrees" }
    ],
    correctChoiceId: "A",
    explanation: "By energy conservation (mgh + ½ mv₀² = ½ mv_final²), both hit with the exact same final speed regardless of initial launch angle."
  },
  {
    id: "phys1-38",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 38,
    question: "The moment produced by two equal and opposite and collinear forces is known as a:",
    choices: [
      { id: "A", text: "Couple" },
      { id: "B", text: "Equilibrant" },
      { id: "C", text: "Resultant" },
      { id: "D", text: "Torque" }
    ],
    correctChoiceId: "D",
    explanation: "Torque or rotational moment is produced by force about a moment center."
  },
  {
    id: "phys1-39",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 39,
    question: "At what point is the applied force minimal in opening a hinged door?",
    choices: [
      { id: "A", text: "At the center" },
      { id: "B", text: "Near the hinge" },
      { id: "C", text: "Farthest from the hinge" },
      { id: "D", text: "Anywhere" }
    ],
    correctChoiceId: "C",
    explanation: "Torque τ = r × F. Maximizing distance r farthest from the hinge minimizes the force required to open the door."
  },
  {
    id: "phys1-40",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 40,
    question: "When a force is called a normal force, it is:",
    choices: [
      { id: "A", text: "A force that is perpendicular to the surface of the earth at any given location" },
      { id: "B", text: "A contact force perpendicular to the contact surfaces between two solid objects." },
      { id: "C", text: "The usual force expected given the arrangement of a system" },
      { id: "D", text: "A force that is always vertical" }
    ],
    correctChoiceId: "B",
    explanation: "Normal force refers to the perpendicular contact force exerted by a surface on an object."
  },
  {
    id: "phys1-41",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 41,
    question: "A ball is thrown straight up into the air. Ignore air resistance. While the ball is in the air its acceleration:",
    choices: [
      { id: "A", text: "Remains constant" },
      { id: "B", text: "Decreases" },
      { id: "C", text: "Increases" },
      { id: "D", text: "Is zero" }
    ],
    correctChoiceId: "A",
    explanation: "In free fall, the gravitational acceleration g (9.81 m/s² downward) remains constant at all times."
  },
  {
    id: "phys1-42",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 42,
    question: "A couple produces:",
    choices: [
      { id: "A", text: "Translatory motion" },
      { id: "B", text: "None of these" },
      { id: "C", text: "Combined translatory and rotational motion" },
      { id: "D", text: "Rotational motion" }
    ],
    correctChoiceId: "D",
    explanation: "A couple creates a net moment with zero net force, causing pure rotation without translation."
  },
  {
    id: "phys1-43",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 43,
    question: "The rate of doing work is known as:",
    choices: [
      { id: "A", text: "Potential energy" },
      { id: "B", text: "None of these" },
      { id: "C", text: "Power" },
      { id: "D", text: "Kinetic energy" }
    ],
    correctChoiceId: "C",
    explanation: "Power is defined as work done per unit time (P = W/t)."
  },
  {
    id: "phys1-44",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 44,
    question: "The condition of equilibrium or motion of a rigid body remains unchanged if a force acting at a given point of the rigid body is replaced by a force of same magnitude and direction, but acting at a different point provided that the two forces have the same line of action. This statement is known as:",
    choices: [
      { id: "A", text: "Parallelogram Law" },
      { id: "B", text: "Principle of Transmissibility" },
      { id: "C", text: "Pappus Propositions" },
      { id: "D", text: "Varignon's Theorem" }
    ],
    correctChoiceId: "B",
    explanation: "The Principle of Transmissibility states a force can be applied anywhere along its line of action without changing rigid body equilibrium."
  },
  {
    id: "phys1-45",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 45,
    question: "A glass of ice water is filled to the brim with water, the ice cubes stick up above the water surface. After the ice melts, which is true?",
    choices: [
      { id: "A", text: "The water level is at the top of the glass but no water has spilled." },
      { id: "B", text: "Some water has spilled over the sides of the glass." },
      { id: "C", text: "Impossible to say without knowing the initial densities of the water and the ice." },
      { id: "D", text: "The water level is below the top of the glass." }
    ],
    correctChoiceId: "A",
    explanation: "Melting floating ice produces liquid water equal to the displaced volume, leaving liquid level unchanged."
  },
  {
    id: "phys1-46",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 46,
    question: "The relationship between the extension of a spring and the force required to produce the extension is:",
    choices: [
      { id: "A", text: "F = mv^2/g" },
      { id: "B", text: "F = ma" },
      { id: "C", text: "F = wN" },
      { id: "D", text: "F = kx" }
    ],
    correctChoiceId: "D",
    explanation: "Hooke's Law states force F is directly proportional to displacement x (F = kx)."
  },
  {
    id: "phys1-47",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 47,
    question: "A boy throws a ball with the air resistance neglected. What will happen to the acceleration?",
    choices: [
      { id: "A", text: "Increase" },
      { id: "B", text: "Constant" },
      { id: "C", text: "Decrease" },
      { id: "D", text: "Decrease and increase" }
    ],
    correctChoiceId: "B",
    explanation: "Gravity provides a constant downward acceleration of 9.81 m/s² throughout projectile motion."
  },
  {
    id: "phys1-48",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 48,
    question: "Work or energy can be a function of all the following except:",
    choices: [
      { id: "A", text: "Power and time" },
      { id: "B", text: "Force and distance" },
      { id: "C", text: "Force and time" },
      { id: "D", text: "Torque and angular rotation" }
    ],
    correctChoiceId: "C",
    explanation: "Force × time yields impulse, not work or energy."
  },
  {
    id: "phys1-49",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 49,
    question: "The mass moment of inertia of a cylinder about its central axis perpendicular to a circular cross section is:",
    choices: [
      { id: "A", text: "Directly proportional to its length" },
      { id: "B", text: "Independent of its length" },
      { id: "C", text: "Directly proportional to its radius" },
      { id: "D", text: "Independent of its radius" }
    ],
    correctChoiceId: "A",
    explanation: "For a cylinder, I = ½ mR² = ½ (π R⁴ ρ L), making moment of inertia directly proportional to its length L."
  },
  {
    id: "phys1-50",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 50,
    question: "What prefix is equivalent to 10 raised to the power 21?",
    choices: [
      { id: "A", text: "Yocto" },
      { id: "B", text: "Yotta" },
      { id: "C", text: "Zepto" },
      { id: "D", text: "Zetta" }
    ],
    correctChoiceId: "D",
    explanation: "Zetta (Z) corresponds to 10²¹."
  },
  {
    id: "phys1-51",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 51,
    question: "The path of a projectile is:",
    choices: [
      { id: "A", text: "Hyperbola" },
      { id: "B", text: "Parabola" },
      { id: "C", text: "Ellipse" },
      { id: "D", text: "Part of a circle" }
    ],
    correctChoiceId: "B",
    explanation: "Under constant gravitational acceleration without air resistance, projectile trajectories are parabolic."
  },
  {
    id: "phys1-52",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 52,
    question: "Which is a scalar quantity?",
    choices: [
      { id: "A", text: "Force" },
      { id: "B", text: "Displacement" },
      { id: "C", text: "Energy" },
      { id: "D", text: "Velocity" }
    ],
    correctChoiceId: "C",
    explanation: "Energy has magnitude only and is a scalar quantity."
  },
  {
    id: "phys1-53",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 53,
    question: "A Newton is the force:",
    choices: [
      { id: "A", text: "That gives a 1 kg body an acceleration of 1 m/s2" },
      { id: "B", text: "Of gravity on a 1 kg body" },
      { id: "C", text: "Of gravity on a 1 g body" },
      { id: "D", text: "That gives a 1 g body an acceleration of 1 cm/s2" }
    ],
    correctChoiceId: "A",
    explanation: "By definition, 1 Newton = 1 kg · 1 m/s²."
  },
  {
    id: "phys1-54",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 54,
    question: "Velocity is defined as:",
    choices: [
      { id: "A", text: "A speeding up or slowing down" },
      { id: "B", text: "Position divided by time" },
      { id: "C", text: "Rate of change of acceleration with time" },
      { id: "D", text: "Rate of change of position with time" }
    ],
    correctChoiceId: "D",
    explanation: "Velocity is the vector rate of change of position with respect to time."
  },
  {
    id: "phys1-55",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 55,
    question: "Which one of the following statements is correct for an object released from rest?",
    choices: [
      { id: "A", text: "The object falls 9.8 m during the first second of time" },
      { id: "B", text: "During each second the object falls 9.8 m" },
      { id: "C", text: "The average velocity during the first second of time is 4.9 m/s" },
      { id: "D", text: "The acceleration changes by 9.8 m/s2 every second" }
    ],
    correctChoiceId: "C",
    explanation: "Average velocity v_avg = (0 + 9.8)/2 = 4.9 m/s during the first second."
  },
  {
    id: "phys1-56",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 56,
    question: "Of the following situations, which one is impossible?",
    choices: [
      { id: "A", text: "A body having zero velocity and non-zero acceleration" },
      { id: "B", text: "A body having constant velocity and variable acceleration" },
      { id: "C", text: "A body having velocity east and acceleration west" },
      { id: "D", text: "A body having velocity east and acceleration east" }
    ],
    correctChoiceId: "B",
    explanation: "If velocity is constant, acceleration must be zero."
  },
  {
    id: "phys1-57",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 57,
    question: "The SI standard of length is based on:",
    choices: [
      { id: "A", text: "The speed of light" },
      { id: "B", text: "The distance from the north pole to the equator along a meridian passing through Paris" },
      { id: "C", text: "Wavelength of light emitted by Hg198" },
      { id: "D", text: "A precision meter stick in Paris" }
    ],
    correctChoiceId: "A",
    explanation: "1 meter is defined as the distance light travels in vacuum in 1/299,792,458 seconds."
  },
  {
    id: "phys1-58",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 58,
    question: "The term 'mass' refers to the same physical concept as:",
    choices: [
      { id: "A", text: "Weight" },
      { id: "B", text: "Force" },
      { id: "C", text: "Acceleration" },
      { id: "D", text: "Inertia" }
    ],
    correctChoiceId: "D",
    explanation: "Mass is a quantitative measure of inertia."
  },
  {
    id: "phys1-59",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 59,
    question: "A golf ball is struck by a golf club and falls on a green three meters above the tee. The potential energy of the Earth-ball system is greatest:",
    choices: [
      { id: "A", text: "Just after the ball lands on the green" },
      { id: "B", text: "Just before the ball is struck" },
      { id: "C", text: "When the ball reaches the highest point in its flight" },
      { id: "D", text: "Just after the ball is struck" }
    ],
    correctChoiceId: "C",
    explanation: "Gravitational potential energy PE = mgh is maximized at maximum height h."
  },
  {
    id: "phys1-60",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 60,
    question: "The first derivative of kinetic energy with respect to time is:",
    choices: [
      { id: "A", text: "Force" },
      { id: "B", text: "Power" },
      { id: "C", text: "Momentum" },
      { id: "D", text: "Work" }
    ],
    correctChoiceId: "B",
    explanation: "d(KE)/dt = dW/dt = Power."
  },
  {
    id: "phys1-61",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 61,
    question: "A net torque applied to a rigid object always tends to produce:",
    choices: [
      { id: "A", text: "Angular acceleration" },
      { id: "B", text: "Rotational inertia" },
      { id: "C", text: "Linear acceleration" },
      { id: "D", text: "Rotational equilibrium" }
    ],
    correctChoiceId: "A",
    explanation: "Rotational Newton's 2nd Law: τ_net = I α."
  },
  {
    id: "phys1-62",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 62,
    question: "The rotational inertia of a wheel about its axle does not depend upon its:",
    choices: [
      { id: "A", text: "Distribution of mass" },
      { id: "B", text: "Diameter" },
      { id: "C", text: "Mass" },
      { id: "D", text: "Speed of rotation" }
    ],
    correctChoiceId: "D",
    explanation: "Moment of inertia depends solely on geometry and mass distribution, not rotational speed."
  },
  {
    id: "phys1-63",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 63,
    question: "An object moves around a circle. If the radius is doubled keeping the speed the same then the magnitude of the centripetal force must be:",
    choices: [
      { id: "A", text: "Twice as great" },
      { id: "B", text: "Four times as great" },
      { id: "C", text: "Half as great" },
      { id: "D", text: "One-fourth as great" }
    ],
    correctChoiceId: "C",
    explanation: "Centripetal force Fc = mv²/r. Doubling r reduces Fc to ½."
  },
  {
    id: "phys1-64",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 64,
    question: "It is sometimes called the scalar product.",
    choices: [
      { id: "A", text: "Unit scalar product" },
      { id: "B", text: "Dot product" },
      { id: "C", text: "Vector product" },
      { id: "D", text: "Cross product" }
    ],
    correctChoiceId: "B",
    explanation: "The dot product of two vectors produces a scalar value."
  },
  {
    id: "phys1-65",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 65,
    question: "Which of the following groups does NOT contain a scalar quantity?",
    choices: [
      { id: "A", text: "Displacement, acceleration, force" },
      { id: "B", text: "Velocity, force, power" },
      { id: "C", text: "Energy, work, distance" },
      { id: "D", text: "Acceleration, speed, work" }
    ],
    correctChoiceId: "A",
    explanation: "Displacement, acceleration, and force are all vector quantities."
  },
  {
    id: "phys1-66",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 66,
    question: "Which of the following is the definition of a joule?",
    choices: [
      { id: "A", text: "A unit of power" },
      { id: "B", text: "A kg·m/s2" },
      { id: "C", text: "A rate of change of energy" },
      { id: "D", text: "A N·m" }
    ],
    correctChoiceId: "D",
    explanation: "1 Joule = 1 Newton-meter (N·m)."
  },
  {
    id: "phys1-67",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 67,
    question: "A watt is:",
    choices: [
      { id: "A", text: "kg· m/s3" },
      { id: "B", text: "kg· m/s" },
      { id: "C", text: "kg· m2/s3" },
      { id: "D", text: "kg· m2/s" }
    ],
    correctChoiceId: "C",
    explanation: "1 Watt = 1 Joule/second = 1 (kg·m²/s²)/s = kg·m²/s³."
  },
  {
    id: "phys1-68",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 68,
    question: "An elevator is pulled by cable at a constant speed. The tension in the cable is equal to:",
    choices: [
      { id: "A", text: "Twice the weight" },
      { id: "B", text: "The weight" },
      { id: "C", text: "Half the weight" },
      { id: "D", text: "Thrice the weight" }
    ],
    correctChoiceId: "B",
    explanation: "At constant speed, acceleration is zero, so Tension T = weight W."
  },
  {
    id: "phys1-69",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 69,
    question: "When velocity of an object is tripled, another quantity which is tripled at the same time is the object's:",
    choices: [
      { id: "A", text: "Kinetic energy" },
      { id: "B", text: "Potential energy" },
      { id: "C", text: "Displacement" },
      { id: "D", text: "Momentum" }
    ],
    correctChoiceId: "D",
    explanation: "Momentum p = mv is directly proportional to velocity."
  },
  {
    id: "phys1-70",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 70,
    question: "Which of the following is NOT an SI unit of measure?",
    choices: [
      { id: "A", text: "Erg" },
      { id: "B", text: "Watt" },
      { id: "C", text: "Newton" },
      { id: "D", text: "Joule" }
    ],
    correctChoiceId: "A",
    explanation: "Erg is a CGS unit of energy, not SI."
  },
  {
    id: "phys1-71",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 71,
    question: "If the resultant force acting on a body of constant mass is zero, the body's acceleration is:",
    choices: [
      { id: "A", text: "Decreasing" },
      { id: "B", text: "Increasing" },
      { id: "C", text: "Negative" },
      { id: "D", text: "Always zero" }
    ],
    correctChoiceId: "D",
    explanation: "According to Newton's 1st and 2nd Laws (F = ma), if net force is zero, acceleration is zero."
  },
  {
    id: "phys1-72",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 72,
    question: "It is anything that occupies space and has mass.",
    choices: [
      { id: "A", text: "Atom" },
      { id: "B", text: "Water" },
      { id: "C", text: "Matter" },
      { id: "D", text: "Meter" }
    ],
    correctChoiceId: "C",
    explanation: "Matter is defined as anything having mass and volume."
  },
  {
    id: "phys1-73",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 73,
    question: "What is the SI unit of mass?",
    choices: [
      { id: "A", text: "Slug" },
      { id: "B", text: "Kilogram" },
      { id: "C", text: "Pound" },
      { id: "D", text: "Newton" }
    ],
    correctChoiceId: "B",
    explanation: "The kilogram (kg) is the base SI unit of mass."
  },
  {
    id: "phys1-74",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 74,
    question: "In any collision, which of the following is conserved?",
    choices: [
      { id: "A", text: "Kinetic energy" },
      { id: "B", text: "Velocity" },
      { id: "C", text: "Potential energy" },
      { id: "D", text: "Momentum" }
    ],
    correctChoiceId: "D",
    explanation: "Total momentum is conserved in all collisions."
  },
  {
    id: "phys1-75",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 75,
    question: "What is the study of rigid body in motion under the action of forces?",
    choices: [
      { id: "A", text: "Kinetics" },
      { id: "B", text: "Dynamics" },
      { id: "C", text: "Kinematics" },
      { id: "D", text: "Statics" }
    ],
    correctChoiceId: "A",
    explanation: "Kinetics analyzes bodies in motion in relation to the forces acting on them."
  },
  {
    id: "phys1-76",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 76,
    question: "The only base unit in SI with prefix kilo is:",
    choices: [
      { id: "A", text: "Kilometer" },
      { id: "B", text: "Kilojoule" },
      { id: "C", text: "Kilogram" },
      { id: "D", text: "Kilopascal" }
    ],
    correctChoiceId: "C",
    explanation: "The kilogram is unique as the only SI base unit containing a prefix."
  },
  {
    id: "phys1-77",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 77,
    question: "Which of the following is NOT a correct unit for work?",
    choices: [
      { id: "A", text: "ft·lb" },
      { id: "B", text: "Newton·meter" },
      { id: "C", text: "Watt" },
      { id: "D", text: "Erg" }
    ],
    correctChoiceId: "C",
    explanation: "Watt is a unit of power (work per unit time), not work itself."
  },
  {
    id: "phys1-78",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 78,
    question: "A watt per hour is a unit of:",
    choices: [
      { id: "A", text: "Power" },
      { id: "B", text: "Energy" },
      { id: "C", text: "Force" },
      { id: "D", text: "None of these" }
    ],
    correctChoiceId: "D",
    explanation: "Watt per hour (W/h) measures rate of change of power, which is not standard energy or power."
  },
  {
    id: "phys1-79",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 79,
    question: "A good example of kinetic energy is provided by:",
    choices: [
      { id: "A", text: "The raised weights of a grandfather's clock" },
      { id: "B", text: "A gallon of gasoline" },
      { id: "C", text: "A wound clock spring" },
      { id: "D", text: "A tornado" }
    ],
    correctChoiceId: "D",
    explanation: "A tornado consists of massive moving air particles possessing kinetic energy."
  },
  {
    id: "phys1-80",
    subject: "Physics 1",
    sourceFileName: "Physics 1 Reviewer Bank",
    questionNumber: 80,
    question: "Matter which has a fixed volume but no definite shape:",
    choices: [
      { id: "A", text: "Gas" },
      { id: "B", text: "Liquid" },
      { id: "C", text: "Solid" },
      { id: "D", text: "All of these" }
    ],
    correctChoiceId: "B",
    explanation: "Liquids have a definite volume but conform to the shape of their container."
  }
];
