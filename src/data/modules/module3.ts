import { TheoryModuleDef } from '../../types/course';

export const MODULE_3: TheoryModuleDef = {
  id: 3,
  code: 'MOD-3',
  title: 'Finite State Machines & Programmable Logic',
  hours: 8,
  weightageMarks: 25,
  coTarget: 'CO3 & CO4',
  textbookRef: 'M. Morris Mano, "Digital Design", Chapters 8 & 9; Stephen Brown, "Fundamentals of Digital Logic", Chapter 8',
  description:
    'Covers synchronous sequential machine synthesis: Mealy versus Moore models, state table reduction using implication charts/partitioning, state assignment strategies (binary, Gray, one-hot), Algorithmic State Machine (ASM) charts for digital hardware control units, and programmable logic architectures (PROM, PLA, PAL, CPLDs, and FPGAs).',
  sections: [
    {
      subtopicId: 'm3-fsm-models',
      title: 'Mealy & Moore Machines: Analysis & Synthesis',
      hours: 3,
      summary:
        'Formal definitions of Mealy (outputs depend on present state AND present inputs) and Moore (outputs depend SOLELY on present state). Step-by-step synthesis methodology: State Diagram -> State Table -> State Reduction (Implication Table & Equivalence Partitioning) -> State Assignment (Binary, Gray, One-Hot) -> Next-State & Output Logic -> Flip-Flop Implementation. Detailed study of Sequence Detectors (overlapping vs non-overlapping sequences).',
      keyFormulasAndConcepts: [
        'Mealy Output: Z(t) = λ(S(t), X(t)) — can react immediately within clock cycle, prone to glitches.',
        'Moore Output: Z(t) = λ(S(t)) — glitch-free, delayed by one clock cycle compared to Mealy.',
        'Sequence Detector with sequence length L: Moore requires L+1 states; Mealy requires L states.',
        'One-Hot Encoding: N flip-flops for N states. Highly efficient for FPGAs (minimal combinational decoding delay).',
      ],
      examTips: [
        'Always read carefully whether overlapping sequence detection is permitted or not.',
        'For Moore machine, remember that each state circle contains state name / output value (e.g., S0/0, S1/0, S2/1).',
      ],
    },
    {
      subtopicId: 'm3-asm-charts',
      title: 'Algorithmic State Machine (ASM) Charts',
      hours: 2,
      summary:
        'ASM chart elements: State Box (rectangular, Moore outputs inside), Decision Box (diamond, conditional branching on input variables), and Conditional Output Box (oval, Mealy outputs generated only during specific transitions). Rules for constructing ASM blocks (one state box and arbitrary decision/conditional boxes entering exit paths). Conversion between ASM charts and hardware controllers via Multiplexer controller and One-FF-per-state methods.',
      keyFormulasAndConcepts: [
        'State Box: Represents one state of the system; entry is via clock edge. Unconditional outputs listed inside.',
        'Decision Box: Diamond with one entry and two exits (0 / 1 or True / False) based on input status.',
        'Conditional Output Box: Oval; output is asserted ONLY if condition is met in that specific state (Mealy behavior).',
        'ASM Block: A subgraph consisting of exactly one state box and network of decision and conditional output boxes.',
      ],
      examTips: [
        'Remember that an ASM block has only one state box and must exit to another state box on the next clock pulse.',
        'Beverage vending machine and traffic light controllers are classic university exam ASM chart questions.',
      ],
    },
    {
      subtopicId: 'm3-plds',
      title: 'Programmable Logic Devices (PROM, PLA, PAL, CPLD, FPGA)',
      hours: 3,
      summary:
        'Classification of PLDs by AND-OR array programmability: PROM (Fixed AND, Programmable OR), PLA (Programmable AND, Programmable OR), PAL (Programmable AND, Fixed OR). Design of combinational functions using PLA folding and PAL product term sharing. Introduction to modern VLSI architectures: Complex Programmable Logic Devices (CPLDs) with Macrocells, and Field-Programmable Gate Arrays (FPGAs) with Configurable Logic Blocks (CLBs), Look-Up Tables (LUTs), flip-flops, and programmable switch matrices.',
      keyFormulasAndConcepts: [
        'PROM: Fixed fully decoded AND matrix (2^n product terms) + Programmable OR matrix.',
        'PLA: Programmable AND matrix + Programmable OR matrix (highest flexibility, higher propagation delay).',
        'PAL: Programmable AND matrix + Fixed OR matrix (faster, lower cost, easier to program).',
        'FPGA CLB: Consists of SRAM-based Look-Up Tables (LUTs), D flip-flops, and fast multiplexers.',
      ],
      examTips: [
        'Draw the 3 comparative matrix architecture diagrams (PROM, PLA, PAL) side-by-side with fixed vs programmable dots.',
        'When designing with PLA, share common product terms between functions to minimize the required AND gates.',
      ],
    },
  ],
  sampleQuestions: [
    {
      marks: 10,
      question:
        'Design a Mealy sequence detector to detect the sequence "1011" with overlapping using D flip-flops. Draw state diagram, state table, excitation equations, and final circuit schematic.',
      bloom: 'BL6: Create',
      solutionOutline:
        'Define 4 states: S0 (initial), S1 (got 1), S2 (got 10), S3 (got 101). Next input 1 from S3 outputs Z=1 and loops to S1 (overlapping). Derive state table. Assign binary codes: S0=00, S1=01, S2=10, S3=11. Solve K-maps for D1, D0, and Z. Draw final schematic with two D flip-flops and logic gates.',
    },
    {
      marks: 10,
      question:
        'Construct an ASM chart for a beverage vending machine that accepts 5-rupee and 10-rupee coins to vend a 15-rupee beverage. The machine dispenses the drink and returns change if 20 rupees are inserted.',
      bloom: 'BL6: Create',
      solutionOutline:
        'Identify states based on accumulated money: S0 (0 Rs), S1 (5 Rs), S2 (10 Rs). Draw decision diamonds for inputs C5 and C10. If 10 Rs coin added at S2, route to vend output and change output box. Trace clock transitions cleanly with state boxes, decision boxes, and conditional output boxes.',
    },
    {
      marks: 5,
      question:
        'Compare PROM, PLA, and PAL with respect to their AND array and OR array programmability, flexibility, and operational speed.',
      bloom: 'BL4: Analyze',
      solutionOutline:
        'Present structured comparison matrix: PROM (Fixed full-decode AND, Prog OR; fast for table lookups, inefficient for sparse logic). PLA (Prog AND, Prog OR; highest flexibility, slower due to two programmable arrays). PAL (Prog AND, Fixed OR; fast, efficient, industry standard for glue logic).',
    },
  ],
};
