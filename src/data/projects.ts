import { MiniProjectDef } from '../types/course';

export const MINI_PROJECTS: MiniProjectDef[] = [
  {
    id: 1,
    title: 'Smart 4-Way Traffic Light Controller with Emergency Override',
    category: 'Industrial Automation',
    targetCO: 'CO3',
    complexity: 'Intermediate',
    abstract:
      'A hardware-based synchronous traffic controller using a state machine controller. Automatically sequences through Red, Amber, and Green phases for four orthogonal approaches, with an active-high manual emergency priority switch that forces immediate green on the emergency route and red on all others.',
    specifications: [
      'Four directional phases: North-South Green (30s), North-South Amber (5s), East-West Green (30s), East-West Amber (5s).',
      'Emergency vehicle interrupt input immediately overrides the sequential cycle.',
      'Constructed using standard synchronous counter (74163) or 7474 D flip-flops with combinational decode logic.',
      'LED cluster outputs (Red, Yellow, Green for each road).',
    ],
    requiredICs: ['IC 74163 (Sync Counter)', 'IC 7408 (AND)', 'IC 7432 (OR)', 'IC 7404 (NOT)', 'IC 555 Timer (1 Hz clock)'],
    schematicConcept: '555 astable timer feeds clock to 74163; count outputs drive multiplexers and decoder gates to illuminate directional LEDs.',
    testingSteps: [
      'Verify 1 Hz clock output from 555 timer with oscilloscope or LED probe.',
      'Check sequence timing: Green -> Amber -> Red on lane 1 while lane 2 remains Red.',
      'Assert Emergency switch: confirm immediate transition to emergency green within 1 clock cycle.',
      'Release Emergency switch: confirm clean resumption without erratic states.',
    ],
    rubric: [
      { criterion: 'State Diagram & Circuit Design', weight: 30, description: 'Correct Mealy/Moore formulation and minimal logic optimization.' },
      { criterion: 'Hardware Breadboard Implementation', weight: 40, description: 'Neat, color-coded wiring with decoupling capacitors and reliable operation.' },
      { criterion: 'Viva & Demonstration', weight: 30, description: 'Clear explanation of state sequencing and emergency latching mechanism.' },
    ],
  },
  {
    id: 2,
    title: 'Digital Electronic Combination Lock with Anti-Tamper Alarm',
    category: 'Security',
    targetCO: 'CO3 & CO6',
    complexity: 'Intermediate',
    abstract:
      'A 4-digit sequential passcode security lock. The user must press keypad buttons in the precise sequence (e.g., 4-7-2-9). Any incorrect digit press resets the state machine to start and increments an error counter. Three consecutive wrong attempts lock the keypad and trigger a 90dB siren alarm.',
    specifications: [
      'Fixed or user-settable 4-digit sequential password.',
      'Debounced tactile pushbuttons to prevent false clock triggers.',
      'Attempt counter using 7490 decade counter; locks system after 3 failed attempts.',
      'Solenoid door strike relay output and alarm buzzer.',
    ],
    requiredICs: ['IC 7474 (Dual D Flip-Flops)', 'IC 7490 (Decade Counter)', 'IC 7400 (NAND)', 'IC 7404 (NOT)', '2N2222 Transistor', '5V Relay'],
    schematicConcept: 'Cascaded D flip-flops clocked sequentially by valid key presses; wrong keys tie to master asynchronous clear bus.',
    testingSteps: [
      'Enter correct passcode: verify relay energizes for 5 seconds.',
      'Enter incorrect 3rd digit: verify immediate reset back to State 0.',
      'Enter 3 successive wrong sequences: confirm tamper alarm latches ON.',
    ],
    rubric: [
      { criterion: 'FSM Design & Glitch Immunity', weight: 35, description: 'Keypad switch debouncing and state isolation.' },
      { criterion: 'Tamper Protection Logic', weight: 35, description: 'Error counter and lock-out latching robustness.' },
      { criterion: 'Documentation & Oral Presentation', weight: 30, description: 'Schematics, truth tables, and test cases.' },
    ],
  },
  {
    id: 3,
    title: 'Automated Coin-Operated Beverage Vending Machine Controller',
    category: 'Industrial Automation',
    targetCO: 'CO3',
    complexity: 'Advanced',
    abstract:
      'Realizes the classic Algorithmic State Machine (ASM) flowchart for a commercial beverage dispenser. Accepts ₹5 and ₹10 simulated coin inputs to dispense a ₹15 beverage. Provides exact change if ₹20 is deposited and prevents coin jamming through input latching.',
    specifications: [
      'Coin detection inputs: C5 (₹5 coin) and C10 (₹10 coin).',
      'Dispense outputs: VEND_DRINK (pulse) and RETURN_CHANGE_5 (₹5 refund pulse).',
      'System states: S0 (₹0), S1 (₹5), S2 (₹10), S3 (₹15 Dispense), S4 (₹20 Dispense + Change).',
      '7-segment display shows current accumulated balance.',
    ],
    requiredICs: ['IC 7476 (Dual JK Flip-Flops)', 'IC 7408 (AND)', 'IC 7432 (OR)', 'IC 7447 (BCD to 7-Segment)', 'IC 7404 (NOT)'],
    schematicConcept: 'ASM block realization using one-flip-flop-per-state or multiplexer-based state transition controller.',
    testingSteps: [
      'Insert three ₹5 coins: verify drink dispenses with no change.',
      'Insert two ₹10 coins: verify drink dispenses AND ₹5 change LED flashes.',
      'Insert one ₹5 followed by one ₹10: verify exact ₹15 dispense.',
    ],
    rubric: [
      { criterion: 'ASM Chart Completeness', weight: 35, description: 'Proper state, decision, and conditional output boxes.' },
      { criterion: 'Hardware Execution & Change Logic', weight: 35, description: 'Reliable balance tracking and coin refund signaling.' },
      { criterion: 'Report & Viva Performance', weight: 30, description: 'State table derivations and K-map optimizations.' },
    ],
  },
  {
    id: 4,
    title: 'Bidirectional People Counter for Conference Halls (Capacity Monitor)',
    category: 'Measurement',
    targetCO: 'CO1',
    complexity: 'Beginner',
    abstract:
      'An optical doorway counter utilizing two IR obstacle sensors positioned in tandem. By evaluating the phase relationship (which sensor trips first), the circuit detects whether an attendee is entering or exiting, incrementing or decrementing an electronic 2-digit LED display and sounding an alarm when maximum capacity is exceeded.',
    specifications: [
      'Dual optical sensor trip inputs (Sensor A and Sensor B separated by 10 cm).',
      'Quadrature direction decoder: A-then-B = Enter (UP); B-then-A = Exit (DOWN).',
      '2-digit BCD Up/Down counter (00 to 99) using dual 74192 counters and 7447 display decoders.',
      'Comparator circuit (7485) triggers Red OVER_CAPACITY alarm LED when count reaches preset limit (e.g., 50).',
    ],
    requiredICs: ['IC 74192 (Sync BCD Up/Down Counter)', 'IC 7447 (7-Segment Decoder)', 'IC 7485 (4-bit Magnitude Comparator)', 'IC 7474 (D FF)'],
    schematicConcept: 'Direction logic drives Count-Up and Count-Down pins of 74192; 7485 compares current count to hardwired limit switches.',
    testingSteps: [
      'Wave hand A -> B: verify display increments by 1.',
      'Wave hand B -> A: verify display decrements by 1.',
      'Increment past limit: verify alarm buzzer and LED activate.',
    ],
    rubric: [
      { criterion: 'Direction Sensing Robustness', weight: 40, description: 'Noise rejection and prevention of double-counting on partial trips.' },
      { criterion: 'Display & Comparator Wiring', weight: 30, description: 'Neat bus routing to dual 7-segment displays and 7485.' },
      { criterion: 'Viva Voce', weight: 30, description: 'Differentiating synchronous vs asynchronous up/down counter operation.' },
    ],
  },
  {
    id: 5,
    title: '4-Bit Arithmetic Logic Unit (ALU) with Overflow & Zero Flags',
    category: 'Digital Computing',
    targetCO: 'CO4',
    complexity: 'Intermediate',
    abstract:
      'Implements a modular 4-bit Arithmetic Logic Unit capable of performing 8 fundamental operations: Addition, Subtraction, Increment, Decrement, Bitwise AND, Bitwise OR, Bitwise XOR, and Logical NOT. Features dedicated condition code flags: Zero (Z), Carry (C), Negative (N), and Overflow (V).',
    specifications: [
      '3-bit function select input (S2, S1, S0) to choose from 8 operations.',
      'Two 4-bit operands (A[3:0] and B[3:0]) set by DIP switches.',
      'Arithmetic core based on 7483 4-bit adder with controllable XOR 2\'s complement inversion.',
      'Logic core multiplexed with arithmetic outputs using dual 74157 multiplexers.',
    ],
    requiredICs: ['IC 7483 (4-bit Full Adder)', 'IC 74157 (Quad 2:1 Mux)', 'IC 7486 (XOR)', 'IC 7408 (AND)', 'IC 7432 (OR)', 'IC 7404 (NOT)'],
    schematicConcept: 'Arithmetic section and logic section run in parallel; output multiplexer steered by function select inputs.',
    testingSteps: [
      'Test arithmetic operations: 5 + 3 = 8, 9 - 4 = 5.',
      'Test negative result: 3 - 7 = -4 (verify two\'s complement output and Negative flag).',
      'Test logic operations: 1010 AND 1100 = 1000, 1010 XOR 1100 = 0110.',
    ],
    rubric: [
      { criterion: 'ALU Architecture & Efficiency', weight: 35, description: 'Gate-level optimization and shared hardware usage.' },
      { criterion: 'Condition Flag Accuracy', weight: 35, description: 'Correct Zero, Carry, and 2\'s complement Overflow generation.' },
      { criterion: 'Demonstration & Viva', weight: 30, description: 'Understanding 2\'s complement math and ALU instruction decoding.' },
    ],
  },
  {
    id: 6,
    title: 'Pseudo-Random Binary Sequence (PRBS) Generator for Data Encryption',
    category: 'Security',
    targetCO: 'CO1',
    complexity: 'Intermediate',
    abstract:
      'A Linear Feedback Shift Register (LFSR) based hardware stream cipher key generator. Utilizes a maximal-length polynomial feedback network to generate an unrepeating pseudo-random sequence of 2^n - 1 bits, useful for spread spectrum communication and data encryption.',
    specifications: [
      '4-bit or 8-bit LFSR using 74194 shift register or 7474 D flip-flops.',
      'Characteristic polynomial: x^4 + x^3 + 1 (outputs from stage 4 and stage 3 XORed and fed back to input).',
      'Generates 15-bit maximal length repeating sequence.',
      'Zero-state prevention circuit to avoid deadlock when all bits are 0.',
    ],
    requiredICs: ['IC 74194 (Universal Shift Register)', 'IC 7486 (XOR Gate)', 'IC 7402 (NOR Gate for zero-detector)', 'IC 555 Timer'],
    schematicConcept: 'Taps from QA and QD fed through XOR gate into Serial-Right input; NOR gate seeds 1 if state is 0000.',
    testingSteps: [
      'Connect clock at 2 Hz; record output bit sequence.',
      'Verify sequence length = 15 bits before repetition.',
      'Simulate all-zero initial state: confirm circuit automatically recovers.',
    ],
    rubric: [
      { criterion: 'Mathematical Rigor & Polynomial Realization', weight: 35, description: 'Correct maximal length feedback tap placement.' },
      { criterion: 'Circuit Assembly & Glitch Avoidance', weight: 35, description: 'Stable clocking and self-starting zero-detector.' },
      { criterion: 'Viva Presentation', weight: 30, description: 'Applications of LFSRs in cryptography and BIST testing.' },
    ],
  },
  {
    id: 7,
    title: 'Reaction Time Tester Game with Millisecond Digital Display',
    category: 'Gaming & Entertainment',
    targetCO: 'CO1',
    complexity: 'Intermediate',
    abstract:
      'An engaging digital electronic reaction game. A random delay circuit triggers an indicator LED. The player must press a stop button as swiftly as possible upon seeing the light. A high-frequency counter (1 kHz) measures the elapsed reaction time in milliseconds on 3-digit displays.',
    specifications: [
      'Random start delay generator (1 to 5 seconds) using pseudo-random gating.',
      '1 kHz timebase oscillator providing 1ms resolution.',
      'Three cascaded BCD decade counters (7490) feeding 7-segment drivers (7447).',
      'False-start penalty detection: pressing button before LED illuminates locks display with error code.',
    ],
    requiredICs: ['IC 7490 (Decade Counter x3)', 'IC 7447 (Display Driver x3)', 'IC 7474 (D FF)', 'IC 7408 (AND)', 'IC 555 (x2)'],
    schematicConcept: 'First 555 generates variable start delay; second 555 generates 1kHz clock; 7474 gates counter until player button is pressed.',
    testingSteps: [
      'Initiate test: observe random delay before GO indicator lights.',
      'Press stop button immediately: verify display freezes with reaction time (typically 200-350 ms).',
      'Test cheat/anticipation: press button prematurely, confirm "ERR" status.',
    ],
    rubric: [
      { criterion: 'Clock Stability & Calibration', weight: 35, description: 'Precise 1kHz timebase calibration.' },
      { criterion: 'Game Logic & False Start Lock', weight: 35, description: 'Foolproof gating and latching mechanisms.' },
      { criterion: 'Presentation & Aesthetics', weight: 30, description: 'Clean display layout and interactive appeal.' },
    ],
  },
  {
    id: 8,
    title: 'Digital Frequency Meter with 1-Second Timebase Gating',
    category: 'Measurement',
    targetCO: 'CO1',
    complexity: 'Advanced',
    abstract:
      'A laboratory-grade digital frequency counter capable of measuring unknown TTL periodic square waves from 1 Hz to 99 kHz. Utilizes a quartz crystal oscillator / 555 calibrated 1.000 second gating window to accumulate incoming pulses into BCD counters.',
    specifications: [
      'Accurate 1.000-second gating window generated by frequency division from a master oscillator.',
      'Input signal conditioning Schmitt trigger (7414) to square up noisy input signals.',
      'Synchronous latch (7475 / 74373) preserves reading while next count accumulates.',
      'Overflow indicator LED for frequencies exceeding display capacity.',
    ],
    requiredICs: ['IC 7490 (Decade Counters)', 'IC 7447 (Display Drivers)', 'IC 7414 (Schmitt Inverter)', 'IC 7408 (AND Gate)', 'IC 7475 (Quad Latch)'],
    schematicConcept: 'AND gate acts as input gate: Input frequency passes to counter ONLY during 1s HIGH period of timebase clock.',
    testingSteps: [
      'Input 100 Hz test signal from function generator: verify display reads exactly 100.',
      'Input 1.5 kHz test signal: verify display reads 1500.',
      'Test signal amplitude sensitivity from 2V to 5V.',
    ],
    rubric: [
      { criterion: 'Measurement Accuracy & Gating Design', weight: 40, description: 'Precision of 1-second pulse generator and Schmitt trigger.' },
      { criterion: 'Display Refresh & Latch Control', weight: 35, description: 'Flicker-free display updates using transfer latch.' },
      { criterion: 'Technical Defense & Viva', weight: 25, description: 'Error sources in digital frequency measurement.' },
    ],
  },
];
