import { FlashcardQuestion, shuffleQuestionChoices } from '../services/questionParser';

const RAW_COMPUTER_QUESTIONS: FlashcardQuestion[] = [
  {
    id: 'comp-1',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 1,
    question: 'Which of the following is not acceptable as an integer variable name in FORTRAN?',
    choices: [{ id: 'A', text: 'INSERTS' }, { id: 'B', text: 'IRISH' }, { id: 'C', text: 'KOST' }, { id: 'D', text: 'K1234' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-2',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 2,
    question: 'What is a set of instructions that resides on a storage device, such as hard drive, and can be loaded into memory and executed called?',
    choices: [{ id: 'A', text: 'Stored program' }, { id: 'B', text: 'Device program' }, { id: 'C', text: 'Operating program' }, { id: 'D', text: 'Memory-resident program' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-3',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 3,
    question: 'Which of the following does not threaten the normal security or operation of a computer?',
    choices: [{ id: 'A', text: 'Firewall' }, { id: 'B', text: 'Hacking' }, { id: 'C', text: 'Trojan horse' }, { id: 'D', text: 'Worm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-4',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 4,
    question: 'What does FTTH mean?',
    choices: [{ id: 'A', text: 'Fiber to the Home' }, { id: 'B', text: 'Fiber to the House' }, { id: 'C', text: 'Flexible to the House' }, { id: 'D', text: 'Flexible to the Home' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-5',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 5,
    question: 'Which of the following is a volatile memory?',
    choices: [{ id: 'A', text: 'RAM' }, { id: 'B', text: 'ROM' }, { id: 'C', text: 'PROM' }, { id: 'D', text: 'EPROM' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-6',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 6,
    question: 'What is the term to describe the moving of software from another computer to your own computer?',
    choices: [{ id: 'A', text: 'Downloading' }, { id: 'B', text: 'Uploading' }, { id: 'C', text: 'Accessing' }, { id: 'D', text: 'Surfing' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-7',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 7,
    question: 'Which is the longest key on the keyboard board?',
    choices: [{ id: 'A', text: 'Space bar' }, { id: 'B', text: 'Enter key' }, { id: 'C', text: 'Function key' }, { id: 'D', text: 'Shift Key' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-8',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 8,
    question: 'What refers to the computer’s use of hard disk storage to simulate RAM?',
    choices: [{ id: 'A', text: 'Virtual memory' }, { id: 'B', text: 'Volatile memory' }, { id: 'C', text: 'ROM' }, { id: 'D', text: 'Data storage' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-9',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 9,
    question: 'A modem is connected to',
    choices: [{ id: 'A', text: 'A telephone line' }, { id: 'B', text: 'a keyboard' }, { id: 'C', text: 'a printer' }, { id: 'D', text: 'a monitor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-10',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 10,
    question: 'Which language is used to create macros in MS Excel?',
    choices: [{ id: 'A', text: 'Visual Basic' }, { id: 'B', text: 'C++' }, { id: 'C', text: 'Java' }, { id: 'D', text: 'Python' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-11',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 11,
    question: 'Which one is the portion of an instruction cycle where the instruction is sent from memory to the instruction register?',
    choices: [{ id: 'A', text: 'FETCH' }, { id: 'B', text: 'LOAD' }, { id: 'C', text: 'SIMULATE' }, { id: 'D', text: 'EXECUTE' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-12',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 12,
    question: 'What does BASIC stand for?',
    choices: [
      { id: 'A', text: 'Beginner’s All-purpose Symbolic Instruction Code' },
      { id: 'B', text: 'Beginner’s All-purpose System Instruction Code' },
      { id: 'C', text: 'Basic All-purpose Symbolic Instruction Code' },
      { id: 'D', text: 'Basic All-Purpose System Instruction Code' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-13',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 13,
    question: 'In a flowchart, what is the symbol used in decision making?',
    choices: [{ id: 'A', text: 'diamond' }, { id: 'B', text: 'square' }, { id: 'C', text: 'Oval' }, { id: 'D', text: 'rectangle' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-14',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 14,
    question: 'A byte is composed of how many bits?',
    choices: [{ id: 'A', text: '8' }, { id: 'B', text: '2' }, { id: 'C', text: '4' }, { id: 'D', text: '6' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-15',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 15,
    question: 'Which function key is used to check spellings?',
    choices: [{ id: 'A', text: 'F7' }, { id: 'B', text: 'F11' }, { id: 'C', text: 'F2' }, { id: 'D', text: 'F5' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-16',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 16,
    question: 'Which of the following classes of mass memory devices uses a laser beam to write and read onto a specified coated disk?',
    choices: [{ id: 'A', text: 'Optical disk memory' }, { id: 'B', text: 'Non-volatile memory' }, { id: 'C', text: 'RAM' }, { id: 'D', text: 'ROM' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-17',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 17,
    question: 'Which of the following are NOT examples of nonvolatile memory in the computer system?',
    choices: [{ id: 'A', text: 'RAMs' }, { id: 'B', text: 'Optical disk' }, { id: 'C', text: 'hard drives' }, { id: 'D', text: 'Flash drives' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-18',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 18,
    question: 'Who was known as one of the fathers of the internet?',
    choices: [{ id: 'A', text: 'Vint Cerf' }, { id: 'B', text: 'Dennis Ritchie' }, { id: 'C', text: 'Martin Cooper' }, { id: 'D', text: 'Charles Babbage' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-19',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 19,
    question: 'The way of stealing valuable information using a form of internet fraud that uses a replica of a trusted site is called_',
    choices: [{ id: 'A', text: 'Phishing' }, { id: 'B', text: 'Fraud' }, { id: 'C', text: 'surfing' }, { id: 'D', text: 'Spam' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-20',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 20,
    question: 'Which device among following is used for sending digital data over a phone line?',
    choices: [{ id: 'A', text: 'Modem' }, { id: 'B', text: 'USB' }, { id: 'C', text: 'Scanner' }, { id: 'D', text: 'Printer' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-21',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 21,
    question: 'Which method is used to connect a remote computer via telephone network?',
    choices: [{ id: 'A', text: 'Dialup' }, { id: 'B', text: 'Diagnostic' }, { id: 'C', text: 'Logic circuit' }, { id: 'D', text: 'Device' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-22',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 22,
    question: 'What does USB stand for?',
    choices: [{ id: 'A', text: 'Universal Serial Bus' }, { id: 'B', text: 'Universal Series Bus' }, { id: 'C', text: 'Universal Serial Base' }, { id: 'D', text: 'Universal Series Base' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-23',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 23,
    question: 'Which device of computer operation dispenses with the use of keyboard for pointing?',
    choices: [{ id: 'A', text: 'Mouse' }, { id: 'B', text: 'Touch' }, { id: 'C', text: 'Joystick' }, { id: 'D', text: 'Light pen' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-24',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 24,
    question: 'The alternate banking Delivery Channels include:',
    choices: [{ id: 'A', text: 'SMS banking' }, { id: 'B', text: 'E-banking' }, { id: 'C', text: 'mobile banking' }, { id: 'D', text: 'ATM' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-25',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 25,
    question: 'The basic unit of a worksheet into which you enter data in Excel is called a',
    choices: [{ id: 'A', text: 'cell' }, { id: 'B', text: 'box' }, { id: 'C', text: 'range' }, { id: 'D', text: 'Tab' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-26',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 26,
    question: 'MS-DOS is a type of?',
    choices: [{ id: 'A', text: 'operating system' }, { id: 'B', text: 'application software' }, { id: 'C', text: 'system architecture' }, { id: 'D', text: 'hardware' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-27',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 27,
    question: 'A KB (kilobyte in binary standard) is how many bytes?',
    choices: [{ id: 'A', text: '1024' }, { id: 'B', text: '1012' }, { id: 'C', text: '1048' }, { id: 'D', text: '1000' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-28',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 28,
    question: 'The brain of any computer system is',
    choices: [{ id: 'A', text: 'CPU' }, { id: 'B', text: 'Control unit' }, { id: 'C', text: 'ALU' }, { id: 'D', text: 'Memory' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-29',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 29,
    question: 'A storage system for small amounts of data is',
    choices: [{ id: 'A', text: 'Magnetic card' }, { id: 'B', text: 'Magnetic tape' }, { id: 'C', text: 'Punched card' }, { id: 'D', text: 'Optical mark reader' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-30',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 30,
    question: 'Which is the most common markup language used in web designing?',
    choices: [{ id: 'A', text: 'HTML' }, { id: 'B', text: 'C++' }, { id: 'C', text: 'PHP' }, { id: 'D', text: 'Fortran' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-31',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 31,
    question: 'BCD stands for',
    choices: [{ id: 'A', text: 'Binary Coded Decimal' }, { id: 'B', text: 'Bit Coded Decimal' }, { id: 'C', text: 'Binary Coded Digit' }, { id: 'D', text: 'Bit Coded Digit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-32',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 32,
    question: 'The process of improving web page visibility on search engine results is',
    choices: [{ id: 'A', text: 'Search Engine Optimization' }, { id: 'B', text: 'Search Engine Hacking' }, { id: 'C', text: 'Google Fooling' }, { id: 'D', text: 'Rank Enhancement' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-33',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 33,
    question: 'Process of posting latitude and longitude metadata to pictures and images',
    choices: [{ id: 'A', text: 'Geotagging' }, { id: 'B', text: 'Flagging' }, { id: 'C', text: 'Posting' }, { id: 'D', text: 'Podcasting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-34',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 34,
    question: 'What does HTTP stand for?',
    choices: [
      { id: 'A', text: 'Hypertext Transfer Protocol' },
      { id: 'B', text: 'Hypertext Time Protocol' },
      { id: 'C', text: 'Hypertext Transmission Process' },
      { id: 'D', text: 'Hypertime Text Protocol' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-35',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 35,
    question: 'Which is not a standard web development programming language?',
    choices: [{ id: 'A', text: 'FORTRAN' }, { id: 'B', text: 'HTML' }, { id: 'C', text: 'JavaScript' }, { id: 'D', text: 'XML' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-36',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 36,
    question: 'Which is an RDBMS database system rather than a programming language?',
    choices: [{ id: 'A', text: 'Oracle' }, { id: 'B', text: 'Visual Basic' }, { id: 'C', text: 'C++' }, { id: 'D', text: 'Java' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-37',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 37,
    question: 'After installing a new modem and router to a computer, what is the order of turning on?',
    choices: [{ id: 'A', text: 'modem, router, computer' }, { id: 'B', text: 'computer, modem, router' }, { id: 'C', text: 'modem, computer, router' }, { id: 'D', text: 'Router, modem, computer' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-38',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 38,
    question: 'A method identifying the location of a given data record by mapping key values.',
    choices: [{ id: 'A', text: 'Hashing' }, { id: 'B', text: 'Tracking' }, { id: 'C', text: 'Linker' }, { id: 'D', text: 'Signature' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-39',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 39,
    question: 'What is the shortcut key to reach the end of the document in MS Word?',
    choices: [{ id: 'A', text: 'Ctrl + End' }, { id: 'B', text: 'Shift + End' }, { id: 'C', text: 'Home' }, { id: 'D', text: 'End' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-40',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 40,
    question: 'BIOS stands for',
    choices: [{ id: 'A', text: 'Basic Input Output System' }, { id: 'B', text: 'Base Input Output System' }, { id: 'C', text: 'Basic Input Output Society' }, { id: 'D', text: 'Base Input Output Society' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-41',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 41,
    question: 'Fastest internet connection technology for home users nowadays',
    choices: [{ id: 'A', text: 'FTTH (Fiber to the Home)' }, { id: 'B', text: 'Broadband wireless' }, { id: 'C', text: 'DSL' }, { id: 'D', text: 'Dial-Up' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-42',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 42,
    question: 'Which of the following computer language is widely used for artificial intelligence?',
    choices: [{ id: 'A', text: 'PROLOG' }, { id: 'B', text: 'COBOL' }, { id: 'C', text: 'FORTRAN' }, { id: 'D', text: 'PASCAL' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-43',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 43,
    question: 'Which of the following is spreadsheet software?',
    choices: [{ id: 'A', text: 'Microsoft Excel' }, { id: 'B', text: 'PowerPoint' }, { id: 'C', text: 'Microsoft Word' }, { id: 'D', text: 'Notepad' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-44',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 44,
    question: 'A computer _______ is a self-replicating computer program that spreads across network nodes.',
    choices: [{ id: 'A', text: 'Worm' }, { id: 'B', text: 'Spyware' }, { id: 'C', text: 'Malware' }, { id: 'D', text: 'Trojan' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-45',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 45,
    question: 'What is the other term for storing data in memory?',
    choices: [{ id: 'A', text: 'writing' }, { id: 'B', text: 'Reading' }, { id: 'C', text: 'loading' }, { id: 'D', text: 'memorizing' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-46',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 46,
    question: 'What is the most common input device?',
    choices: [{ id: 'A', text: 'keyboard' }, { id: 'B', text: 'monitor' }, { id: 'C', text: 'LCD' }, { id: 'D', text: 'Speaker' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-47',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 47,
    question: 'The process of detecting, locating and correcting logic errors in a program.',
    choices: [{ id: 'A', text: 'debugging' }, { id: 'B', text: 'compiling' }, { id: 'C', text: 'reading' }, { id: 'D', text: 'detecting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-48',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 48,
    question: 'Absolute reference in a spreadsheet is used by inserting a ________ sign before the column and row.',
    choices: [{ id: 'A', text: 'dollar ($)' }, { id: 'B', text: 'semi-colon (;)' }, { id: 'C', text: 'hyphen (-)' }, { id: 'D', text: 'Period (.)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-49',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 49,
    question: 'What are the system programs used to translate directly an assembly language to machine language called?',
    choices: [{ id: 'A', text: 'Assembler' }, { id: 'B', text: 'Compiler' }, { id: 'C', text: 'Debugger' }, { id: 'D', text: 'Interpreter' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-50',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 50,
    question: 'MS-WORD is a type of?',
    choices: [{ id: 'A', text: 'application software' }, { id: 'B', text: 'system architecture' }, { id: 'C', text: 'System software' }, { id: 'D', text: 'operating system' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-51',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 51,
    question: 'What is CD-ROM?',
    choices: [
      { id: 'A', text: 'Compact Disk Read Only Memory' },
      { id: 'B', text: 'Compact Date Read Only Memory' },
      { id: 'C', text: 'Compatible Disk Read Only Memory' },
      { id: 'D', text: 'Compatible Date Read Only Memory' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-52',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 52,
    question: 'Which of the following is an instruction that causes data to be brought from memory into an accumulator register?',
    choices: [{ id: 'A', text: 'LOAD' }, { id: 'B', text: 'LOOP' }, { id: 'C', text: 'FETCH' }, { id: 'D', text: 'JUMP' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-53',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 53,
    question: 'The abbreviation for binary digit',
    choices: [{ id: 'A', text: 'bit' }, { id: 'B', text: 'byte' }, { id: 'C', text: 'bid' }, { id: 'D', text: 'bin' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-54',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 54,
    question: 'Which of the following is not a functional process step of a computer hardware pipeline?',
    choices: [{ id: 'A', text: 'Human Understanding' }, { id: 'B', text: 'processing' }, { id: 'C', text: 'controlling' }, { id: 'D', text: 'inputting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-55',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 55,
    question: 'ASCII means',
    choices: [
      { id: 'A', text: 'American Standard Code for Information Interchange' },
      { id: 'B', text: 'American Standard Code for Information Input' },
      { id: 'C', text: 'American Standard Code for Input Information' },
      { id: 'D', text: 'American Standard Capacity for Information Input' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-56',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 56,
    question: 'WWW stands for',
    choices: [{ id: 'A', text: 'World Wide Web' }, { id: 'B', text: 'World Wide Wrestling' }, { id: 'C', text: 'World Wide Workers' }, { id: 'D', text: 'World Wide War' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-57',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 57,
    question: 'ALU stands for',
    choices: [
      { id: 'A', text: 'Arithmetic Logic Unit' },
      { id: 'B', text: 'Arithmetic Logical Unit' },
      { id: 'C', text: 'Arithmetic Logic Users' },
      { id: 'D', text: 'Arithmetic Logical User' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-58',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 58,
    question: 'Which gate is formed by inverting the output of the AND gate?',
    choices: [{ id: 'A', text: 'NAND gate' }, { id: 'B', text: 'OR gate' }, { id: 'C', text: 'NOR gate' }, { id: 'D', text: 'XOR gate' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-59',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 59,
    question: 'What is the smallest unit of information handled by a computer?',
    choices: [{ id: 'A', text: 'Bit' }, { id: 'B', text: 'Byte' }, { id: 'C', text: 'Cell' }, { id: 'D', text: 'Character' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-60',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 60,
    question: 'Which is a spreadsheet package rather than a programming language?',
    choices: [{ id: 'A', text: 'LOTUS 1-2-3' }, { id: 'B', text: 'PASCAL' }, { id: 'C', text: 'COBOL' }, { id: 'D', text: 'FORTRAN' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-61',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 61,
    question: 'What does UPS stand for?',
    choices: [
      { id: 'A', text: 'Uninterruptible Power Supply' },
      { id: 'B', text: 'United Power Supply' },
      { id: 'C', text: 'Uninterruptible Portable Supply' },
      { id: 'D', text: 'Uninterrupting Power Supply' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-62',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 62,
    question: 'The Central Processing Unit of a computer is a combination of',
    choices: [
      { id: 'A', text: 'Arithmetic logic and control unit' },
      { id: 'B', text: 'Control and input unit' },
      { id: 'C', text: 'Arithmetic logic and input unit' },
      { id: 'D', text: 'Control and storage unit' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-63',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 63,
    question: 'A technician has installed a new video card and the computer will now only boot into VGA mode. Which of the following may be the cause of the problem?',
    choices: [
      { id: 'A', text: 'The incorrect drivers are installed' },
      { id: 'B', text: 'There is an operating system incompatibility' },
      { id: 'C', text: 'The external monitor is not compatible' },
      { id: 'D', text: 'The new card is not DVI compatible' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-64',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 64,
    question: 'When installing the heatsink back into a computer after replacing a failed processor, which of the following must be done during installation?',
    choices: [
      { id: 'A', text: 'Thermal compound must be applied between the processor and the heatsink' },
      { id: 'B', text: 'Thermal compound must be installed between the processor and the system board' },
      { id: 'C', text: 'An isopropyl alcohol pad must be placed between the processor and heatsink' },
      { id: 'D', text: 'An isopropyl alcohol pad must be placed between processor and system board' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-65',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 65,
    question: 'Which of the following computer programs is NOT considered open-source software?',
    choices: [{ id: 'A', text: 'Microsoft Office' }, { id: 'B', text: 'Linux' }, { id: 'C', text: 'OpenOffice.org' }, { id: 'D', text: 'Firefox' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-66',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 66,
    question: 'A printed circuit board that has slots to connect cards into, including CPU and memory, is called',
    choices: [{ id: 'A', text: 'Motherboard' }, { id: 'B', text: 'Server' }, { id: 'C', text: 'Mainframe' }, { id: 'D', text: 'IDE port' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-67',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 67,
    question: 'Which of the following is the basic symbol used at beginning or termination in a logic diagram or flowchart?',
    choices: [{ id: 'A', text: 'Oval symbol' }, { id: 'B', text: 'Rectangular box' }, { id: 'C', text: 'Diamond box' }, { id: 'D', text: 'Square box' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-68',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 68,
    question: 'What form of software stored in ROM can also be called firmware?',
    choices: [{ id: 'A', text: 'System BIOS' }, { id: 'B', text: 'random memory' }, { id: 'C', text: 'cache memory' }, { id: 'D', text: 'Operating system' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-69',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 69,
    question: 'In printing your document in the computer, what is the default page orientation mode?',
    choices: [{ id: 'A', text: 'Portrait' }, { id: 'B', text: 'Page view' }, { id: 'C', text: 'Landscape' }, { id: 'D', text: 'Page set-up' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-70',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 70,
    question: 'What is the standardized communication technique for expressing instructions to a computer?',
    choices: [{ id: 'A', text: 'Programming language' }, { id: 'B', text: 'Algorithm' }, { id: 'C', text: 'Logic' }, { id: 'D', text: 'Flow chart' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-71',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 71,
    question: 'Which of the following are used in designing and documenting complex processes or programs that help to visualize what is going on?',
    choices: [{ id: 'A', text: 'Flowcharts' }, { id: 'B', text: 'Networks' }, { id: 'C', text: 'Charts' }, { id: 'D', text: 'Diagrams' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-72',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 72,
    question: 'A megabyte is exactly ______ bytes (2^20).',
    choices: [{ id: 'A', text: '1,048,576' }, { id: 'B', text: '1,000,000' }, { id: 'C', text: '1,084,567' }, { id: 'D', text: '999,999' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-73',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 73,
    question: 'Which of the following is a correct FORTRAN IF statement?',
    choices: [{ id: 'A', text: 'IF (I.GE.5) GO TO 7' }, { id: 'B', text: 'IF (I,GE,5)' }, { id: 'C', text: 'IF (I.GE.5)' }, { id: 'D', text: 'IF (I,GE,5) GO TO 7' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-74',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 74,
    question: 'Encryption provides all the following features of information system security EXCEPT',
    choices: [{ id: 'A', text: 'Privacy / Absolute Physical Security' }, { id: 'B', text: 'Confidentiality' }, { id: 'C', text: 'Integrity' }, { id: 'D', text: 'Authenticity' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-75',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 75,
    question: 'What is the web version generation associated with interactive social platforms like Facebook and Wikipedia?',
    choices: [{ id: 'A', text: 'Web 2.0' }, { id: 'B', text: 'Web 3.0' }, { id: 'C', text: 'Web 0.40' }, { id: 'D', text: 'Web 1.0' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-76',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 76,
    question: 'Really Simple Syndication (RSS) allows you to do the following except,',
    choices: [{ id: 'A', text: 'edit web server code' }, { id: 'B', text: 'publish blog feeds' }, { id: 'C', text: 'receive current feeds' }, { id: 'D', text: 'send current feeds' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-77',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 77,
    question: 'In excel, which tool shall you use to step-by-step make a column chart?',
    choices: [{ id: 'A', text: 'Chart Wizard / Insert Chart' }, { id: 'B', text: 'bar chart tool' }, { id: 'C', text: 'pi graph' }, { id: 'D', text: 'excel chart' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-78',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 78,
    question: 'It is a form of episodic audio broadcasting on the internet',
    choices: [{ id: 'A', text: 'podcasting' }, { id: 'B', text: 'newscasting' }, { id: 'C', text: 'netcasting' }, { id: 'D', text: 'webcasting' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-79',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 79,
    question: 'Which of the following address format is used to locate a particular webpage on the web?',
    choices: [{ id: 'A', text: 'URL' }, { id: 'B', text: 'IP address' }, { id: 'C', text: 'google' }, { id: 'D', text: 'domain' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-80',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 80,
    question: 'VIRUS in computer terminology stands for',
    choices: [
      { id: 'A', text: 'Vital Information Resources Under Siege' },
      { id: 'B', text: 'Very Important Resource Under Siege' },
      { id: 'C', text: 'Vulnerable Information Reserved Under State' },
      { id: 'D', text: 'Vital Information Reserved Under Siege' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-81',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 81,
    question: 'Which of the following is represented by JPEG?',
    choices: [
      { id: 'A', text: 'Joint Photographic Experts Group' },
      { id: 'B', text: 'Joint Photographic Experts Grade' },
      { id: 'C', text: 'Joint Photography Experts Grade' },
      { id: 'D', text: 'Joint Picture Experts Group' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-82',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 82,
    question: 'A circle in the flowchart symbols represents which one of the following?',
    choices: [{ id: 'A', text: 'Connector' }, { id: 'B', text: 'Decision' }, { id: 'C', text: 'Data' }, { id: 'D', text: 'Terminator' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-83',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 83,
    question: 'A nibble is composed of how many bits?',
    choices: [{ id: 'A', text: '4' }, { id: 'B', text: '8' }, { id: 'C', text: '6' }, { id: 'D', text: '7' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-84',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 84,
    question: 'Which of the following is represented by CMOS?',
    choices: [
      { id: 'A', text: 'Complementary Metal Oxide Semiconductor' },
      { id: 'B', text: 'Complimentary Mutual Oxide Semiconductor' },
      { id: 'C', text: 'Common Oriented Business Logic' },
      { id: 'D', text: 'Complementary Mental Oxide Semiconductor' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-85',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 85,
    question: 'A rectangular shape symbol in a flowchart represents',
    choices: [{ id: 'A', text: 'process' }, { id: 'B', text: 'decision' }, { id: 'C', text: 'merge' }, { id: 'D', text: 'preparation' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-86',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 86,
    question: 'PDF means',
    choices: [{ id: 'A', text: 'portable document format' }, { id: 'B', text: 'portable document file' }, { id: 'C', text: 'protocol document format' }, { id: 'D', text: 'protocol document file' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-87',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 87,
    question: 'DSL means',
    choices: [{ id: 'A', text: 'digital subscriber line' }, { id: 'B', text: 'digital subscription line' }, { id: 'C', text: 'digital standard line' }, { id: 'D', text: 'digital service line' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-88',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 88,
    question: 'URL means,',
    choices: [{ id: 'A', text: 'uniform resource locator' }, { id: 'B', text: 'universal resource locator' }, { id: 'C', text: 'uniform resource location' }, { id: 'D', text: 'universal resource location' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-89',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 89,
    question: 'What is the term for a situation that occurs when a program constantly swaps pages in virtual memory?',
    choices: [{ id: 'A', text: 'thrashing' }, { id: 'B', text: 'handshaking' }, { id: 'C', text: 'paging' }, { id: 'D', text: 'scanning' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-90',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 90,
    question: 'What do you call a translated program in machine language output by a compiler?',
    choices: [{ id: 'A', text: 'an object program' }, { id: 'B', text: 'a machine program' }, { id: 'C', text: 'a user’s program' }, { id: 'D', text: 'source program' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-91',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 91,
    question: 'A file structure used by operating systems to store physical file locations on disk is',
    choices: [{ id: 'A', text: 'file allocation table (FAT)' }, { id: 'B', text: 'file format' }, { id: 'C', text: 'file information table' }, { id: 'D', text: 'field' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-92',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 92,
    question: 'A digital electronic circuit operating on discrete signals is known as',
    choices: [{ id: 'A', text: 'logic circuit' }, { id: 'B', text: 'electronic circuit' }, { id: 'C', text: 'sequential circuit' }, { id: 'D', text: 'arithmetic circuit' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-93',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 93,
    question: 'Which device puts data on the data bus during a memory write operation?',
    choices: [{ id: 'A', text: 'CPU' }, { id: 'B', text: 'Keyboard' }, { id: 'C', text: 'Accumulator' }, { id: 'D', text: 'ALU' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-94',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 94,
    question: 'What do you call viruses specifically designed to corrupt or disable antivirus software?',
    choices: [{ id: 'A', text: 'retrovirus' }, { id: 'B', text: 'anti-virus' }, { id: 'C', text: 'anti-virus eradicator' }, { id: 'D', text: 'worm' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-95',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 95,
    question: 'What is the term for a computer professional who plans an entire computer system and software architecture?',
    choices: [{ id: 'A', text: 'system analyst' }, { id: 'B', text: 'programmer' }, { id: 'C', text: 'software developer' }, { id: 'D', text: 'network admin' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-96',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 96,
    question: 'What do you call a communication network that covers a wide geographical area such as a state or a country?',
    choices: [{ id: 'A', text: 'wide area network (WAN)' }, { id: 'B', text: 'metropolitan area network (MAN)' }, { id: 'C', text: 'multi-level network' }, { id: 'D', text: 'local area network (LAN)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-97',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 97,
    question: 'What type of communication system uses light rather than electricity to communicate through glass strands?',
    choices: [{ id: 'A', text: 'fiber optic communication' }, { id: 'B', text: 'data communication' }, { id: 'C', text: 'optical communication' }, { id: 'D', text: 'microwave communication' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-98',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 98,
    question: 'FLAG in submarine cable communication means,',
    choices: [
      { id: 'A', text: 'Fiber Optic Link Around the Globe' },
      { id: 'B', text: 'Four Link Around the Globe' },
      { id: 'C', text: 'Fiber Link Around the Globe' },
      { id: 'D', text: 'Four Mode Link Around the Globe' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-99',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 99,
    question: 'FTP means,',
    choices: [{ id: 'A', text: 'file transfer protocol' }, { id: 'B', text: 'file transfer port' }, { id: 'C', text: 'file transmission port' }, { id: 'D', text: 'file termination protocol' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-100',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 100,
    question: 'What refers to the debugging method in which the program is executed one instruction at a time and register contents can be examined?',
    choices: [{ id: 'A', text: 'trace / single stepping' }, { id: 'B', text: 'stacking' }, { id: 'C', text: 'text editing' }, { id: 'D', text: 'syntax analysing' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-101',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 101,
    question: 'What is that part of a computer instruction that defines what type of operation the computer is to execute?',
    choices: [{ id: 'A', text: 'op code' }, { id: 'B', text: 'machine language' }, { id: 'C', text: 'mnemonic' }, { id: 'D', text: 'assembly language' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-102',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 102,
    question: 'What is the term for a computer or software program that requests information from another server computer?',
    choices: [{ id: 'A', text: 'client' }, { id: 'B', text: 'host' }, { id: 'C', text: 'workstation' }, { id: 'D', text: 'master' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-103',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 103,
    question: 'What refers to the time with which a disc drive can locate requested data on media?',
    choices: [{ id: 'A', text: 'access time' }, { id: 'B', text: 'data rate time' }, { id: 'C', text: 'transfer time' }, { id: 'D', text: 'enter time' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-104',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 104,
    question: 'What is high speed memory used to store a small amount of data temporarily so it can be retrieved quickly?',
    choices: [{ id: 'A', text: 'cache memory' }, { id: 'B', text: 'scratchpad memory' }, { id: 'C', text: 'video memory' }, { id: 'D', text: 'volatile memory' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-105',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 105,
    question: 'What is the most common type of digital IC package?',
    choices: [{ id: 'A', text: 'DIP (Dual In-line Package)' }, { id: 'B', text: 'Metal type' }, { id: 'C', text: 'MOS' }, { id: 'D', text: 'TTL' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-106',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 106,
    question: 'What term is used to describe retrieval of data from a memory device?',
    choices: [{ id: 'A', text: 'reading' }, { id: 'B', text: 'accessing' }, { id: 'C', text: 'unloading' }, { id: 'D', text: 'downloading' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-107',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 107,
    question: 'What refers to the manner in which alphanumeric data and control characters are represented by sequences of bits?',
    choices: [{ id: 'A', text: 'coding' }, { id: 'B', text: 'transforming' }, { id: 'C', text: 'controlling' }, { id: 'D', text: 'processing' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-108',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 108,
    question: 'Which device amplifies or regenerates a signal and passes it on in a network?',
    choices: [{ id: 'A', text: 'repeater' }, { id: 'B', text: 'amplifier' }, { id: 'C', text: 'trap' }, { id: 'D', text: 'modulator' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-109',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 109,
    question: 'What do you call a communication network covering a geographical area the size of a city or suburban area?',
    choices: [{ id: 'A', text: 'metropolitan area network (MAN)' }, { id: 'B', text: 'wide area network (WAN)' }, { id: 'C', text: 'multi-level network' }, { id: 'D', text: 'local area network (LAN)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-110',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 110,
    question: 'A handheld computer smaller and more portable than a notebook, sometimes called a palmtop computer.',
    choices: [{ id: 'A', text: 'personal digital assistant (PDA)' }, { id: 'B', text: 'minicomputer' }, { id: 'C', text: 'micro PC' }, { id: 'D', text: 'microcomputer' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-111',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 111,
    question: 'What refers to a technique where multiple users share computer time in small interleaved slices?',
    choices: [{ id: 'A', text: 'time sharing' }, { id: 'B', text: 'handshaking' }, { id: 'C', text: 'batch processing' }, { id: 'D', text: 'multitasking' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-112',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 112,
    question: 'A computer virus that infects the macros attached to documents and spreadsheets is called,',
    choices: [{ id: 'A', text: 'macro virus' }, { id: 'B', text: 'file virus' }, { id: 'C', text: 'document virus' }, { id: 'D', text: 'spreadsheet virus' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-113',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 113,
    question: 'Which of the following devices merges multiple input signals into a single output channel?',
    choices: [{ id: 'A', text: 'multiplexer' }, { id: 'B', text: 'demodulator' }, { id: 'C', text: 'demultiplexer' }, { id: 'D', text: 'oscillator' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-114',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 114,
    question: 'What do you call a collection of related data fields representing one entity?',
    choices: [{ id: 'A', text: 'record' }, { id: 'B', text: 'document' }, { id: 'C', text: 'database' }, { id: 'D', text: 'file' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-115',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 115,
    question: 'What is another term for operating system (OS)?',
    choices: [{ id: 'A', text: 'system control program' }, { id: 'B', text: 'all of these' }, { id: 'C', text: 'start up program' }, { id: 'D', text: 'computer program' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-116',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 116,
    question: 'A reference model that allows two or more computers to communicate over a network with standardized layers',
    choices: [{ id: 'A', text: 'OSI' }, { id: 'B', text: 'LAN' }, { id: 'C', text: 'TCP/IP' }, { id: 'D', text: 'WAN' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-117',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 117,
    question: 'MATLAB stands for?',
    choices: [{ id: 'A', text: 'matrix laboratory' }, { id: 'B', text: 'math library' }, { id: 'C', text: 'metric library' }, { id: 'D', text: 'matrix library' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-118',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 118,
    question: 'Which command is used to clear a MATLAB command window?',
    choices: [{ id: 'A', text: 'clc' }, { id: 'B', text: 'clear' }, { id: 'C', text: 'close all' }, { id: 'D', text: 'clear all' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-119',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 119,
    question: 'To determine whether an input string is a reserved MATLAB keyword, the command is?',
    choices: [{ id: 'A', text: 'iskeyword' }, { id: 'B', text: 'keyword' }, { id: 'C', text: 'inputword' }, { id: 'D', text: 'isvarname' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-120',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 120,
    question: 'Command used to display the value of variable x in MATLAB.',
    choices: [{ id: 'A', text: 'disp(x)' }, { id: 'B', text: 'displayx' }, { id: 'C', text: 'disp x' }, { id: 'D', text: 'vardisp(‘x’)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-121',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 121,
    question: 'Command used to save command window text log to a file in MATLAB.',
    choices: [{ id: 'A', text: 'diary' }, { id: 'B', text: 'todiary' }, { id: 'C', text: 'texttofile' }, { id: 'D', text: 'saveas' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-122',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 122,
    question: 'To interrupt or stop the execution of a running MATLAB command, press:',
    choices: [{ id: 'A', text: 'ctrl+c' }, { id: 'B', text: 'ctrl+s' }, { id: 'C', text: 'ctrl+b' }, { id: 'D', text: 'ctrl+enter' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-123',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 123,
    question: 'Which is an invalid variable name in MATLAB?',
    choices: [{ id: 'A', text: '6x' }, { id: 'B', text: 'z' }, { id: 'C', text: 'x6' }, { id: 'D', text: 'last' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-124',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 124,
    question: 'If one operand is a scalar and the other is not, MATLAB applies the scalar to every element of the other operand. This property is known as ______________',
    choices: [{ id: 'A', text: 'scalar expansion' }, { id: 'B', text: 'vector expansion' }, { id: 'C', text: 'dimension declaration' }, { id: 'D', text: 'operand divergence' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-125',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 125,
    question: 'Matrix operations follow the rules of linear algebra.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-126',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 126,
    question: 'Valid range for signed 8-bit integer (int8) class is -128 to 127.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-127',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 127,
    question: 'What is the difference between syms \'x\' and sym \'x\' in MATLAB?',
    choices: [
      { id: 'A', text: 'syms creates symbolic variables in the workspace while sym creates a symbolic expression' },
      { id: 'B', text: 'syms \'x\' makes the symbol short lasting while sym \'x\' makes the declaration long lasting' },
      { id: 'C', text: 'there is no difference, they are the same functions' },
      { id: 'D', text: 'they are equivalent' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-128',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 128,
    question: 'What happens if we don’t assign a variable to an expression which evaluates to a numerical value in MATLAB?',
    choices: [
      { id: 'A', text: 'The evaluated values are assigned to variable \'ans\' automatically' },
      { id: 'B', text: 'Depends on the numerical value' },
      { id: 'C', text: 'MATLAB shows error' },
      { id: 'D', text: 'Nothing happens' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-129',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 129,
    question: 'Name the functions used for multiplication and division (deconvolution) of two polynomials in MATLAB.',
    choices: [{ id: 'A', text: 'conv() and deconv()' }, { id: 'B', text: 'mult() and div()' }, { id: 'C', text: 'conv() and div()' }, { id: 'D', text: 'mult and div' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-130',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 130,
    question: 'The function to evaluate the value of a polynomial for a constant value of the independent variable in MATLAB is ______',
    choices: [{ id: 'A', text: 'polyval(c,a)' }, { id: 'B', text: 'poly(p,a)' }, { id: 'C', text: 'polyder(p)' }, { id: 'D', text: 'polyint(p)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-131',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 131,
    question: 'What is the limitation of the whos function in MATLAB compared to inspecting workspace variables directly?',
    choices: [
      { id: 'A', text: 'It does not show the full contents/values of the variable' },
      { id: 'B', text: 'It does not show the size of the variable' },
      { id: 'C', text: 'It does not show the class of the variable' },
      { id: 'D', text: 'It does not show the name of the variable' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-132',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 132,
    question: 'What interactive GUI component displays the current variables listed by whos?',
    choices: [{ id: 'A', text: 'Workspace window' }, { id: 'B', text: 'Command window' }, { id: 'C', text: 'Current folder window' }, { id: 'D', text: 'Help window' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-133',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 133,
    question: 'What does the Workspace window show?',
    choices: [
      { id: 'A', text: 'Attributes and values of variables created in the command window/scripts' },
      { id: 'B', text: 'Attributes of variables from command window only' },
      { id: 'C', text: 'Attributes of variables, functions from command window' },
      { id: 'D', text: 'Attributes of variables, script files from command window' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-134',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 134,
    question: 'If a character string is given to a command expecting numeric arguments, MATLAB may convert it via ASCII or raise an error.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-135',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 135,
    question: 'Which function is used to find the magnitude (absolute value) of a complex number in MATLAB?',
    choices: [{ id: 'A', text: 'abs()' }, { id: 'B', text: 'sqrt()' }, { id: 'C', text: 'cart2pol()' }, { id: 'D', text: 'MATLAB does not support complex arguments' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-136',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 136,
    question: 'Which is an escape sequence constant in formatted text output?',
    choices: [{ id: 'A', text: '\\b' }, { id: 'B', text: 'nargout' }, { id: 'C', text: 'Esc' }, { id: 'D', text: '/n' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-137',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 137,
    question: 'By default, numerical MATLAB computations use',
    choices: [{ id: 'A', text: 'Double Precision' }, { id: 'B', text: 'Linear accuracy' }, { id: 'C', text: 'Multi-level precision' }, { id: 'D', text: 'Single Precision' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-138',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 138,
    question: 'In MATLAB cos(90) expects radians, so cos(90) is NOT equal to 0 or 1. Thus statement "cos(90) is equal to 1" is:',
    choices: [{ id: 'A', text: 'false' }, { id: 'B', text: 'true' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-139',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 139,
    question: 'The solve[] or solve() command in Symbolic Math Toolbox can do which of the following?',
    choices: [{ id: 'A', text: 'Produce a symbolic solution' }, { id: 'B', text: 'Produces exact roots' }, { id: 'C', text: 'Produces complex roots' }, { id: 'D', text: 'Produce the exact solution' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-140',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 140,
    question: 'What happens if dsolve does not return any symbolic closed-form solution?',
    choices: [
      { id: 'A', text: 'The equation has to be solved numerically using numerical solvers' },
      { id: 'B', text: 'The equations have no solution' },
      { id: 'C', text: 'The equations have a trivial solution' },
      { id: 'D', text: 'The equations have infinite no. of solutions' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-141',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 141,
    question: 'If solve does not return any solution, what does it imply?',
    choices: [
      { id: 'A', text: 'The equation may be solvable but function \'solve\' cannot produce an explicit solution' },
      { id: 'B', text: 'There is no function \'solve\'' },
      { id: 'C', text: 'The equation has no definite solution' },
      { id: 'D', text: 'The equation has a solution for a specific interval' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-142',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 142,
    question: 'Vectors depend upon square or curly brackets for multi-element definition while scalars don’t require brackets.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-143',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 143,
    question: 'What is the advantage of MATLAB over other computing software regarding matrix computations?',
    choices: [
      { id: 'A', text: 'Matrix operations and dynamic allocations are built-in natively' },
      { id: 'B', text: 'Matrix operations are easily computed' },
      { id: 'C', text: 'No advantage' },
      { id: 'D', text: 'Real time pre-defined memory allocation' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-144',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 144,
    question: 'What matrix power operator computes A^n in MATLAB?',
    choices: [{ id: 'A', text: 'A^n or mpower(A,n)' }, { id: 'B', text: 'ntimes(A,n)' }, { id: 'C', text: 'mtimes(n,A)' }, { id: 'D', text: 'mtimes(A^n)' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-145',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 145,
    question: 'Which operator set is used for element-wise left and right division respectively in MATLAB?',
    choices: [{ id: 'A', text: '.\\ and ./' }, { id: 'B', text: './ and .\\' }, { id: 'C', text: 'Left division is not available' }, { id: 'D', text: '/ and \\' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-146',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 146,
    question: 'What is the difference between [] and {} in MATLAB?',
    choices: [
      { id: 'A', text: '[] creates numeric/char arrays while {} creates cell arrays' },
      { id: 'B', text: 'No difference' },
      { id: 'C', text: '[] is row vector and {} is column vector' },
      { id: 'D', text: '[] is cell array and {} is linear array' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-147',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 147,
    question: 'What is the effect of running: clear all',
    choices: [{ id: 'A', text: 'Clears all variables, functions, and MEX links from workspace' }, { id: 'B', text: 'Clears the command window' }, { id: 'C', text: 'Clears the figures' }, { id: 'D', text: 'Clears history' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-148',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 148,
    question: 'All vectors are 2D or 1D matrices in MATLAB.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-149',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 149,
    question: 'What is the output of: ismatrix([]) in MATLAB?',
    choices: [{ id: 'A', text: 'logical 1 (true)' }, { id: 'B', text: 'logical 0 (false)' }, { id: 'C', text: 'Error' }, { id: 'D', text: '-1' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-150',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 150,
    question: 'What is the output of: isvector([]) in MATLAB?',
    choices: [{ id: 'A', text: '0 (false)' }, { id: 'B', text: '1 (true)' }, { id: 'C', text: 'Syntactical error' }, { id: 'D', text: 'Logical error' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-151',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 151,
    question: 'If dimensions of x and y don’t match in plot(x,y), MATLAB throws an error. Thus statement "plot command will not give an error" is:',
    choices: [{ id: 'A', text: 'false' }, { id: 'B', text: 'true' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-152',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 152,
    question: 'What determines the name of a primary function in a function M-file?',
    choices: [{ id: 'A', text: 'Name of M-file' }, { id: 'B', text: 'Name of Script File' }, { id: 'C', text: 'Name of Help file' }, { id: 'D', text: 'Name of Private-File' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-153',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 153,
    question: 'Predominantly, what are two main categories of programming errors in MATLAB?',
    choices: [{ id: 'A', text: 'Syntax and runtime / logic errors' }, { id: 'B', text: 'Syntax and algorithmic' }, { id: 'C', text: 'Logic and runtime' }, { id: 'D', text: 'Hardware errors' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-154',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 154,
    question: 'What are persistent variables in MATLAB functions?',
    choices: [
      { id: 'A', text: 'Variables which retain values across repeated calls to the function' },
      { id: 'B', text: 'Variables which help in calling a function' },
      { id: 'C', text: 'Variables which deal with graphics' },
      { id: 'D', text: 'Variables global to all M-files' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-155',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 155,
    question: 'Variables MUST have the exact same parameter names when passed into function arguments.',
    choices: [{ id: 'A', text: 'false' }, { id: 'B', text: 'true' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-156',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 156,
    question: 'Which command can be used for single step execution in MATLAB debugging mode?',
    choices: [{ id: 'A', text: 'dbstep' }, { id: 'B', text: 'dbstepin' }, { id: 'C', text: 'dbstatus' }, { id: 'D', text: 'dbcont' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-157',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 157,
    question: 'How do we access a global variable inside a function scope in MATLAB?',
    choices: [
      { id: 'A', text: 'Declare the variable using global keyword' },
      { id: 'B', text: 'Simply seek the variable without declaring' },
      { id: 'C', text: 'Make a copy of the global variables' },
      { id: 'D', text: 'Declare the variable as local' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-158',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 158,
    question: 'How does MATLAB pass arguments to functions internally for efficiency?',
    choices: [
      { id: 'A', text: 'By call by value (copy-on-write)' },
      { id: 'B', text: 'Only by call by reference' },
      { id: 'C', text: 'By call by address' },
      { id: 'D', text: 'By pointer dereference' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-159',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 159,
    question: 'Which line is treated as the H1 help line in a MATLAB M-file?',
    choices: [
      { id: 'A', text: 'First comment line following the function declaration line' },
      { id: 'B', text: 'All lines before function definition' },
      { id: 'C', text: 'Comment line preceding function definition' },
      { id: 'D', text: 'The end line' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-160',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 160,
    question: 'What are the functions to plot a continuous line graph and a discrete sequence plot in MATLAB?',
    choices: [{ id: 'A', text: 'plot() & stem()' }, { id: 'B', text: 'cont() & disc()' }, { id: 'C', text: 'plot() & disc()' }, { id: 'D', text: 'cont() & stem()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-161',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 161,
    question: 'If we plot matrix arguments in plot(Y), how are the columns treated?',
    choices: [
      { id: 'A', text: 'Column-wise series plotted against row index' },
      { id: 'B', text: 'Row wise inter-relation' },
      { id: 'C', text: 'Diagonally inter-relation' },
      { id: 'D', text: 'Incomprehensible' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-162',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 162,
    question: 'To place a text label interactively on a plot using mouse clicks, the command used is _________',
    choices: [{ id: 'A', text: 'gtext' }, { id: 'B', text: 'text' }, { id: 'C', text: 'title()' }, { id: 'D', text: 'atext' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-163',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 163,
    question: 'In bar(x,y), vector x should generally be:',
    choices: [
      { id: 'A', text: 'Monotonically increasing or decreasing' },
      { id: 'B', text: 'Incomprehensible' },
      { id: 'C', text: 'Unordered random values' },
      { id: 'D', text: 'Linear zero array' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-164',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 164,
    question: 'If we set bar width > 1 like bar(x,y,1.2), the bars will:',
    choices: [{ id: 'A', text: 'Overlap each other' }, { id: 'B', text: 'Disappear' }, { id: 'C', text: 'Be uniform without touching' }, { id: 'D', text: 'Be damped' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-165',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 165,
    question: 'To exhibit discrete comparative data across categories, which diagrams are suitable?',
    choices: [{ id: 'A', text: 'Bar chart / Bar diagram' }, { id: 'B', text: 'Pie-bar' }, { id: 'C', text: 'Line plot' }, { id: 'D', text: 'Ratio-chart' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-166',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 166,
    question: 'Pie charts display proportional categorical parts of a whole dataset.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-167',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 167,
    question: 'What plot type would you use to show comparisons of quarterly metrics across industries?',
    choices: [{ id: 'A', text: 'Bar plot / Grouped bar chart' }, { id: 'B', text: 'Bode plot' }, { id: 'C', text: 'Frequency plot' }, { id: 'D', text: 'Histogram plot' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-168',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 168,
    question: 'To display distributions of continuous data, one uses _________',
    choices: [{ id: 'A', text: 'Histogram' }, { id: 'B', text: 'Pie plot' }, { id: 'C', text: 'Line plot' }, { id: 'D', text: 'Stem plot' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-169',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 169,
    question: 'To display angular distribution of directional data, one uses',
    choices: [{ id: 'A', text: 'Rose plot / Angle histogram' }, { id: 'B', text: 'Bar graph' }, { id: 'C', text: 'Standard histogram' }, { id: 'D', text: 'Scatter plot' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-170',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 170,
    question: 'A 3D spatial curve can be represented in MATLAB using function ____',
    choices: [{ id: 'A', text: 'plot3' }, { id: 'B', text: 'stem()' }, { id: 'C', text: 'display' }, { id: 'D', text: 'legend' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-171',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 171,
    question: 'To add a legend identifying different data series in a plot, we use the _________ function.',
    choices: [{ id: 'A', text: 'legend' }, { id: 'B', text: 'display' }, { id: 'C', text: 'gtext()' }, { id: 'D', text: 'mtext' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-172',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 172,
    question: 'Does the plot function accept multiple x-y pair arguments to plot several lines simultaneously?',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'sometimes' }, { id: 'D', text: 'only if functions are in time domain' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-173',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 173,
    question: 'What happens if we execute "hold on" and don’t execute "hold off"?',
    choices: [
      { id: 'A', text: 'MATLAB keeps superimposing future plots in the same axes window' },
      { id: 'B', text: 'Error is generated' },
      { id: 'C', text: 'Plot function won’t work' },
      { id: 'D', text: 'Nothing happens' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-174',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 174,
    question: 'Can a histogram represent distributions of multiple data groups?',
    choices: [{ id: 'A', text: 'True' }, { id: 'B', text: 'false' }, { id: 'C', text: 'cannot be determined' }, { id: 'D', text: 'There is no such thing as Histogram' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-175',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 175,
    question: 'The function to plot 2D or 3D vector fields with velocity/direction arrows is ___________',
    choices: [{ id: 'A', text: 'quiver()' }, { id: 'B', text: 'pie3' }, { id: 'C', text: 'ezplot()' }, { id: 'D', text: 'contour()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-176',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 176,
    question: 'How to group subplots with a master panel title in MATLAB GUI/figures?',
    choices: [{ id: 'A', text: 'Use uipanel() or sgtitle()' }, { id: 'B', text: 'Use a helper function' }, { id: 'C', text: 'Use title function' }, { id: 'D', text: 'Use legend function' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-177',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 177,
    question: 'Can we create multiple 3D plots in MATLAB figure windows?',
    choices: [{ id: 'A', text: 'Yes' }, { id: 'B', text: 'No' }, { id: 'C', text: 'Maybe' }, { id: 'D', text: 'Cannot be determined' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-178',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 178,
    question: 'In modern MATLAB syntax, hold on and hold all perform the same holding action.',
    choices: [{ id: 'A', text: 'true / no difference' }, { id: 'B', text: 'hold all holds every plot while hold on holds a specific plot' }, { id: 'C', text: 'hold all does not exist' }, { id: 'D', text: 'hold on is syntactically incorrect' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-179',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 179,
    question: 'What is the purpose of line() vs plot()? line() adds low-level graphics primitives directly to axes.',
    choices: [{ id: 'A', text: 'line() is a low-level graphics object creator' }, { id: 'B', text: 'Saves complexity' }, { id: 'C', text: 'Refrains from hold function' }, { id: 'D', text: 'There is no separate purpose' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-180',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 180,
    question: 'To add single-line comments in MATLAB code, use _________',
    choices: [{ id: 'A', text: '%' }, { id: 'B', text: '//' }, { id: 'C', text: '%/' }, { id: 'D', text: '/%' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-181',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 181,
    question: 'To display script code lines in the command window as they execute, use ____________',
    choices: [{ id: 'A', text: 'echo on' }, { id: 'B', text: 'comment on' }, { id: 'C', text: 'show %' }, { id: 'D', text: 'cannot be displayed' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-182',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 182,
    question: 'Where do we need to store a custom M-file function so MATLAB can locate it from any directory?',
    choices: [{ id: 'A', text: 'A folder included in the MATLAB search path' }, { id: 'B', text: 'Anywhere' }, { id: 'C', text: 'Root bin directory' }, { id: 'D', text: 'Desktop only' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-183',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 183,
    question: 'What is the difference between \'help\' and \'lookfor\' in MATLAB?',
    choices: [
      { id: 'A', text: 'help shows syntax for a known topic, lookfor searches H1 lines for keywords' },
      { id: 'B', text: 'Help returns all toolboxes while lookfor returns one' },
      { id: 'C', text: 'No difference' },
      { id: 'D', text: 'Syntactical difference' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-184',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 184,
    question: 'The command to close all figure windows in MATLAB is __________',
    choices: [{ id: 'A', text: 'close all' }, { id: 'B', text: 'close graphs' }, { id: 'C', text: 'delete graphs' }, { id: 'D', text: 'end all' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-185',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 185,
    question: 'What detail is NOT tracked by default in the MATLAB Workspace panel?',
    choices: [{ id: 'A', text: 'Exact creation timestamp of variable' }, { id: 'B', text: 'Size of variable' }, { id: 'C', text: 'Class of variable' }, { id: 'D', text: 'Bytes used' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-186',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 186,
    question: 'MATLAB allows visual block-diagram modeling of dynamical systems using ___________',
    choices: [{ id: 'A', text: 'Simulink' }, { id: 'B', text: 'Control System Toolbox' }, { id: 'C', text: 'ezplot' }, { id: 'D', text: 'GUI Builder' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-187',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 187,
    question: 'What are MEX files in MATLAB?',
    choices: [
      { id: 'A', text: 'Compiled C/C++ or Fortran routines dynamically linked to MATLAB' },
      { id: 'B', text: 'Same as MAT files' },
      { id: 'C', text: 'No such thing as MEX files' },
      { id: 'D', text: 'Helps to analyze commands in MATLAB' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-188',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 188,
    question: 'How would you open the MATLAB script Editor from the command line?',
    choices: [{ id: 'A', text: 'Type edit in MATLAB and press Enter' }, { id: 'B', text: 'Type debug and press Enter' }, { id: 'C', text: 'Type M-file and press Enter' }, { id: 'D', text: 'Type script and press Enter' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-189',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 189,
    question: 'What is the file extension of MATLAB code M-files?',
    choices: [{ id: 'A', text: '.m' }, { id: 'B', text: '.mat' }, { id: 'C', text: '.script' }, { id: 'D', text: '.exe' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-190',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 190,
    question: 'What is the basic difference between M-files and MAT-files?',
    choices: [
      { id: 'A', text: 'MAT files are binary data files while M-files are plain text code files' },
      { id: 'B', text: 'M files are binary data files while MAT-files are text files' },
      { id: 'C', text: 'There is no MAT files' },
      { id: 'D', text: 'There is no difference' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-191',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 191,
    question: 'What does the "echo on" command do?',
    choices: [
      { id: 'A', text: 'It displays statements in M-files as they execute' },
      { id: 'B', text: 'It produces an audio echo' },
      { id: 'C', text: 'It shows comments only' },
      { id: 'D', text: 'It logs MAT files' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-192',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 192,
    question: 'How do you create a function M-file in MATLAB?',
    choices: [
      { id: 'A', text: 'Begin the M-file with a function definition header line' },
      { id: 'B', text: 'Begin script file with variable assignment' },
      { id: 'C', text: 'There is no function file' },
      { id: 'D', text: 'An M-file is always a function file' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-193',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 193,
    question: 'What is the default step increment value in a for-loop (e.g. for i = 1:10)?',
    choices: [{ id: 'A', text: '1' }, { id: 'B', text: '0' }, { id: 'C', text: '2' }, { id: 'D', text: '-1' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-194',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 194,
    question: 'A for-loop in MATLAB can iterate over vector or matrix index values.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-195',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 195,
    question: 'Compound logical condition expressions can be used in a while loop in MATLAB.',
    choices: [{ id: 'A', text: 'true' }, { id: 'B', text: 'false' }, { id: 'C', text: 'neither' }, { id: 'D', text: 'either' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-196',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 196,
    question: 'How would you plot multiple curves on a single set of axes in MATLAB?',
    choices: [{ id: 'A', text: 'Using the hold on command or multi-argument plot()' }, { id: 'B', text: 'Using mplot' }, { id: 'C', text: 'Using mstem' }, { id: 'D', text: 'Cannot be done' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-197',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 197,
    question: 'Why can’t you inspect raw source code directly from a binary MEX compiled file?',
    choices: [
      { id: 'A', text: 'MEX files are compiled binary machine code' },
      { id: 'B', text: 'The program should contain echo' },
      { id: 'C', text: 'The program should contain showprog' },
      { id: 'D', text: 'The program should contain diary' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-198',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 198,
    question: 'In MATLAB graphics, subplot(1,1,1) resets the figure layout to a single default axes.',
    choices: [{ id: 'A', text: 'axes' }, { id: 'B', text: 'subplot()' }, { id: 'C', text: 'plot' }, { id: 'D', text: 'It is not possible' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-199',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 199,
    question: 'The command used to load saved MAT-file variables into the workspace is _______',
    choices: [{ id: 'A', text: 'load' }, { id: 'B', text: 'show' }, { id: 'C', text: 'disp()' }, { id: 'D', text: 'it is not possible' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-200',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 200,
    question: 'The format for 5-digit scientific representation with exponent in MATLAB is __________',
    choices: [{ id: 'A', text: 'short e' }, { id: 'B', text: 'short g' }, { id: 'C', text: 'short exp' }, { id: 'D', text: 'long e' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-201',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 201,
    question: 'Which sprintf format specifier automatically selects compact notation without trailing zeros?',
    choices: [{ id: 'A', text: '%g' }, { id: 'B', text: '%f' }, { id: 'C', text: '%o' }, { id: 'D', text: '%nz' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-202',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 202,
    question: 'The function to plot a 2D graph with log10 scale on both x and y axes is __________',
    choices: [{ id: 'A', text: 'loglog' }, { id: 'B', text: 'log' }, { id: 'C', text: 'semilogx' }, { id: 'D', text: 'semilogy' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-203',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 203,
    question: 'How will one reset workspace variables at the beginning of an M-file script?',
    choices: [{ id: 'A', text: 'Use the clear all or clear command at the beginning' }, { id: 'B', text: 'Use close all' }, { id: 'C', text: 'Use clc' }, { id: 'D', text: 'Cannot be done' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-204',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 204,
    question: 'How do you resume script execution from MATLAB keyboard/debugging pause?',
    choices: [{ id: 'A', text: 'Use the dbcont or return command' }, { id: 'B', text: 'Use keyboard' }, { id: 'C', text: 'Use dbquit' }, { id: 'D', text: 'Use dbclear' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-205',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 205,
    question: 'How does an exponential relationship y = a*e^(bx) appear on a semilog-y plot (logarithmic y axis)?',
    choices: [{ id: 'A', text: 'A straight line' }, { id: 'B', text: 'A parabola' }, { id: 'C', text: 'A sinusoid' }, { id: 'D', text: 'A circle' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-206',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 206,
    question: '___________ is the file I/O function used to close an open file handle in MATLAB.',
    choices: [{ id: 'A', text: 'fclose' }, { id: 'B', text: 'fopen' }, { id: 'C', text: 'gclose' }, { id: 'D', text: 'clc' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-207',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 207,
    question: 'What is the foundational data structure of numerical storage in MATLAB?',
    choices: [{ id: 'A', text: 'Stored as multidimensional arrays/matrices' }, { id: 'B', text: 'Stored as scalar pointer' }, { id: 'C', text: 'Stored as linked list' }, { id: 'D', text: 'Depends on nature' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-208',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 208,
    question: 'What is the default starting index of array elements in MATLAB?',
    choices: [{ id: 'A', text: '1' }, { id: 'B', text: '0' }, { id: 'C', text: '-1' }, { id: 'D', text: 'User-defined' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-209',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 209,
    question: 'In MATLAB, integer types are converted to double precision floating-point before mixed operations unless specialized.',
    choices: [{ id: 'A', text: 'Double precision' }, { id: 'B', text: 'Floating' }, { id: 'C', text: 'Unsigned' }, { id: 'D', text: 'Single' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-210',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 210,
    question: 'What is the default unit for trigonometric function arguments in MATLAB (e.g. sin(x))?',
    choices: [{ id: 'A', text: 'Radians' }, { id: 'B', text: 'Degrees' }, { id: 'C', text: 'Gradians' }, { id: 'D', text: 'Revolutions' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-211',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 211,
    question: 'To display numbers in currency format with 2 fixed decimal digits, the format command is ______',
    choices: [{ id: 'A', text: 'format bank' }, { id: 'B', text: 'format long e' }, { id: 'C', text: 'format short' }, { id: 'D', text: 'format hex' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-212',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 212,
    question: 'How do we change the display format of numerical outputs in the Command Window?',
    choices: [{ id: 'A', text: 'Use the format command' }, { id: 'B', text: 'Use the class command' }, { id: 'C', text: 'Automatic' }, { id: 'D', text: 'Not possible' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-213',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 213,
    question: 'Text strings in MATLAB are stored as character arrays (char class) or string objects.',
    choices: [{ id: 'A', text: 'Character array' }, { id: 'B', text: 'String' }, { id: 'C', text: 'Stack' }, { id: 'D', text: 'Pointer' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-214',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 214,
    question: 'Which command displays function script statements as they execute?',
    choices: [{ id: 'A', text: 'echo on' }, { id: 'B', text: 'cannot be seen' }, { id: 'C', text: 'help' }, { id: 'D', text: 'lookfor' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-215',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 215,
    question: 'Which command is used to find the phase angle (argument) of a complex number in radians?',
    choices: [{ id: 'A', text: 'angle() or atan2()' }, { id: 'B', text: 'args()' }, { id: 'C', text: 'abs()' }, { id: 'D', text: 'mag()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-216',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 216,
    question: 'By default, what class is assigned to numeric complex numbers in MATLAB?',
    choices: [{ id: 'A', text: 'double' }, { id: 'B', text: 'symbolic' }, { id: 'C', text: 'character' }, { id: 'D', text: 'array' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-217',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 217,
    question: 'What is the command used to extract the real part of a complex number in MATLAB?',
    choices: [{ id: 'A', text: 'real()' }, { id: 'B', text: 'cannot be checked' }, { id: 'C', text: 'abs()' }, { id: 'D', text: 'realc()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-218',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 218,
    question: 'Which function calculates magnitude |z| for complex numbers?',
    choices: [{ id: 'A', text: 'abs()' }, { id: 'B', text: 'atan()' }, { id: 'C', text: 'realc()' }, { id: 'D', text: 'imagc()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-219',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 219,
    question: 'The output of eig(A) without sorted indices returns eigenvalues in unsorted order by default.',
    choices: [{ id: 'A', text: 'Unsorted' }, { id: 'B', text: 'Sorted' }, { id: 'C', text: 'Ascending' }, { id: 'D', text: 'Descending' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-220',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 220,
    question: 'When analyzing system linearity, we verify superposition (additivity and homogeneity).',
    choices: [{ id: 'A', text: 'Superposition & Homogeneity' }, { id: 'B', text: 'Consistency' }, { id: 'C', text: 'Invertibility' }, { id: 'D', text: 'Monotonicity' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-221',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 221,
    question: 'In MATLAB, how can we test linearity of transfer functions numerically?',
    choices: [
      { id: 'A', text: 'Compare response waveforms after superposition' },
      { id: 'B', text: 'Compare rank of matrices' },
      { id: 'C', text: 'Use Rouche’s Theorem' },
      { id: 'D', text: 'Intuition' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-222',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 222,
    question: 'How can we check in MATLAB if an electrical circuit model is linear or nonlinear?',
    choices: [{ id: 'A', text: 'Superposition simulation via Simulink' }, { id: 'B', text: 'Check homogeneity only' }, { id: 'C', text: 'Check consistency' }, { id: 'D', text: 'Nodal inspection' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-223',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 223,
    question: 'How can we find the solution of a nonhomogeneous linear system using determinant ratios?',
    choices: [{ id: 'A', text: 'Cramer’s rule' }, { id: 'B', text: 'Gauss’s law' }, { id: 'C', text: 'Cannot be done' }, { id: 'D', text: 'Rouche’s theorem' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-224',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 224,
    question: 'To apply superposition in linear circuits, dependent/independent source responses are summed with other independent sources deactivated.',
    choices: [{ id: 'A', text: 'Deactivate other independent sources' }, { id: 'B', text: 'No passive elements' }, { id: 'C', text: 'Unilateral elements' }, { id: 'D', text: 'Nothing' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-225',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 225,
    question: 'To check the matrix rank of a matrix in MATLAB, use ___________',
    choices: [{ id: 'A', text: 'rank()' }, { id: 'B', text: 'not required' }, { id: 'C', text: 'rankm()' }, { id: 'D', text: 'rankmatr()' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-226',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 226,
    question: 'Which calculus rule does symbolic diff(u*v) apply for products?',
    choices: [{ id: 'A', text: 'Product rule (u-v rule)' }, { id: 'B', text: 'Chain rule only' }, { id: 'C', text: 'No rule' }, { id: 'D', text: 'Not possible' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-227',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 227,
    question: 'In computing, what is a tape drive?',
    choices: [{ id: 'A', text: 'A sequential data storage device' }, { id: 'B', text: 'An OCR device' }, { id: 'C', text: 'a pointing device' }, { id: 'D', text: 'a multimedia device' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-228',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 228,
    question: 'The component that delivers electrical power to internal computer hardware is',
    choices: [{ id: 'A', text: 'power supply (PSU)' }, { id: 'B', text: 'power cord' }, { id: 'C', text: 'UPS' }, { id: 'D', text: 'power button' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-229',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 229,
    question: 'A portion of code contains assembly instructions "LR", "ST", and "3L". Most likely these are',
    choices: [{ id: 'A', text: 'assembly language' }, { id: 'B', text: 'object code' }, { id: 'C', text: 'interpreted code' }, { id: 'D', text: 'machine language' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-230',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 230,
    question: 'A hardware signal that temporarily halts the CPU execution of the current instruction stream is called a(n)',
    choices: [{ id: 'A', text: 'interrupt' }, { id: 'B', text: 'disconnect' }, { id: 'C', text: 'break-off' }, { id: 'D', text: 'suspension' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-231',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 231,
    question: 'Which of the following is NOT acceptable as a FORTRAN assignment statement?',
    choices: [{ id: 'A', text: 'A*B = C*D' }, { id: 'B', text: 'A = B' }, { id: 'C', text: 'A = B + C' }, { id: 'D', text: 'AB = C*D' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-232',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 232,
    question: 'Before a program can execute, it must be loaded into primary memory. What does this "memory" refer to?',
    choices: [{ id: 'A', text: 'RAM' }, { id: 'B', text: 'cache memory' }, { id: 'C', text: 'EPROM' }, { id: 'D', text: 'ROM' }],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-233',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 233,
    question: 'CPU means',
    choices: [
      { id: 'A', text: 'Central Processing Unit' },
      { id: 'B', text: 'Common Processing Unit' },
      { id: 'C', text: 'Canadian Processing Unit' },
      { id: 'D', text: 'Continuing Project Unit' }
    ],
    correctChoiceId: 'A'
  },
  {
    id: 'comp-234',
    subject: 'Computer',
    sourceFileName: 'Computer Reviewer (234 Questions)',
    questionNumber: 234,
    question: 'Which of the following is represented by COBOL?',
    choices: [
      { id: 'A', text: 'Common Business Oriented Language' },
      { id: 'B', text: 'Common Oriented Business Language' },
      { id: 'C', text: 'Common Business Orientation Language' },
      { id: 'D', text: 'Common Business Language' }
    ],
    correctChoiceId: 'A'
  }
];

export const COMPUTER_QUESTIONS: FlashcardQuestion[] = RAW_COMPUTER_QUESTIONS.map((q, idx) => {
  const seed = (q.questionNumber || idx + 1) * 37 + 151;
  return shuffleQuestionChoices(q, true, seed);
});
