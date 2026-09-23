import { TheoryModuleDef } from '../../types/course';

export const MODULE_4: TheoryModuleDef = {
  id: 4,
  code: 'MOD-4',
  title: 'Hardware Description Language (Verilog HDL) & Digital Testing',
  hours: 8,
  weightageMarks: 25,
  coTarget: 'CO5 & CO6',
  textbookRef: 'Samir Palnitkar, "Verilog HDL: A Guide to Digital Design and Synthesis", 2nd Ed.; M. L. Bushnell & V. D. Agrawal, "Essentials of Electronic Testing for Digital, Memory and Mixed-Signal VLSI Circuits"',
  description:
    'Covers digital hardware modeling using IEEE 1364 Verilog HDL across structural (gate-level primitives), dataflow (continuous assignments), and behavioral (procedural blocks) paradigms. Emphasizes race-free sequential modeling using non-blocking assignments and automated testbench verification. Concludes with digital IC fault modeling, single stuck-at faults, fault collapsing, and path sensitization test generation.',
  sections: [
    {
      subtopicId: 'm4-verilog-modeling',
      title: 'Verilog HDL Modeling Paradigms & Syntax',
      hours: 3,
      summary:
        'Module structure, port declarations (input, output, inout), internal nets (wire) and variables (reg). Three modeling styles: 1) Structural modeling using built-in primitives (and, or, not, nand, nor, xor) and hierarchical module instantiation. 2) Dataflow modeling using continuous `assign` statements and bitwise/reduction operators. 3) Behavioral modeling using procedural blocks (`always @(*)`, `always @(posedge clk or negedge rst_n)`), conditional statements (`if-else`, `case`, `casex`, `casez`).',
      keyFormulasAndConcepts: [
        'Structural: and g1(y, a, b);',
        'Dataflow: assign {cout, sum} = a + b + cin;',
        'Behavioral: always @(posedge clk or negedge rst_n) begin if (!rst_n) q <= 0; else q <= d; end',
        'Reg vs Wire: wire driven continuously by assign or gate; reg assigned inside procedural always or initial blocks.',
      ],
      examTips: [
        'Always include default branch in case statements to prevent synthesis of unintended transparent latches.',
        'Remember that in Verilog, output ports in behavioral blocks must be declared as reg or logic.',
      ],
    },
    {
      subtopicId: 'm4-blocking-testbench',
      title: 'Blocking vs Non-Blocking Assignments & Testbench Design',
      hours: 2,
      summary:
        'Fundamental distinction between Blocking (`=`) and Non-Blocking (`<=`) assignments. Golden rules of Verilog: Use non-blocking (`<=`) for sequential logic (clocked always blocks) to prevent simulation race conditions; use blocking (`=`) for combinational logic. Testbench architecture: stimulus generation using `initial` blocks, clock generation (`always #10 clk = ~clk`), monitor displays (`$monitor`, `$display`), and waveform dumping (`$dumpfile`, `$dumpvars`).',
      keyFormulasAndConcepts: [
        'Blocking (=): Evaluated and assigned immediately; subsequent statements in block are stalled.',
        'Non-Blocking (<=): Right-hand sides evaluated in active event queue, assignments scheduled at end of current time step. Essential for modeling concurrent flip-flop register transfers.',
        'Clock Generation: initial begin clk = 0; forever #10 clk = ~clk; end // 50MHz (period 20ns)',
        'Simulation Directives: $finish terminates simulation; $stop pauses for debugging.',
      ],
      examTips: [
        'Never mix blocking and non-blocking assignments in the same always block.',
        'Be prepared to write a complete self-checking testbench for a 4-bit synchronous counter or full adder.',
      ],
    },
    {
      subtopicId: 'm4-fault-modeling',
      title: 'Digital Testing & Fault Modeling (Stuck-At Faults)',
      hours: 3,
      summary:
        'Failure mechanisms in VLSI silicon chips: physical defects, shorts, opens, and bridging. Single Stuck-At Fault (SSAF) model: Stuck-at-0 (s-a-0) and Stuck-at-1 (s-a-1). Total faults in a circuit with k lines: 2k faults. Fault Collapsing techniques: Fault Equivalence (two faults indistinguishable by any input vector) and Fault Dominance. Path Sensitization method: 1. Fault Activation (force opposite logic value at fault site), 2. Fault Propagation (sensitize a path to primary output by setting non-controlling values on side inputs).',
      keyFormulasAndConcepts: [
        'Number of single stuck-at faults for k circuit lines: N_faults = 2 * k',
        'Non-controlling value for AND/NAND side inputs: 1',
        'Non-controlling value for OR/NOR side inputs: 0',
        'Non-controlling value for XOR/XNOR side inputs: 0 (or 1 with inversion)',
        'Fault Coverage: FC = (Detected Faults / Total Faults) * 100%',
      ],
      examTips: [
        'To sensitize an AND gate path, all other inputs to that AND gate must be held at 1 (non-controlling value).',
        'Demonstrate fault equivalence on a 2-input AND gate: inputs s-a-0 are equivalent to output s-a-0.',
      ],
    },
  ],
  sampleQuestions: [
    {
      marks: 10,
      question:
        'Explain the difference between blocking and non-blocking procedural assignments in Verilog HDL with appropriate code snippets and hardware synthesis schematics. What happens if blocking assignments are used to model shift registers?',
      bloom: 'BL4: Analyze',
      solutionOutline:
        'Define blocking (=) and non-blocking (<=). Show 3-stage shift register with blocking: registers collapse into a single flip-flop due to sequential execution. Show non-blocking code: synthesizes three cascaded flip-flops correctly executing parallel shift. Highlight IEEE 1364 stratified event queue model.',
    },
    {
      marks: 10,
      question:
        'Write synthesizable Verilog HDL modules for: (a) 4-to-1 Multiplexer using behavioral case statement, (b) 4-bit Synchronous Up-Counter with active-low synchronous reset and enable input. Include complete testbench code.',
      bloom: 'BL3: Apply',
      solutionOutline:
        'Provide clean Verilog module for 4:1 mux with inputs in, sel, and output reg y. Provide 4-bit counter module with clk, rst_n, enable, and [3:0] q. Write complete testbench with clock generation, stimulus sequence, and $monitor.',
    },
    {
      marks: 5,
      question:
        'Explain the Single Stuck-At Fault model. Find a test vector to detect stuck-at-0 fault at input A of a 2-input NAND gate whose inputs are A and B, and output is Y. Explain path sensitization.',
      bloom: 'BL4: Analyze',
      solutionOutline:
        'Define s-a-0 (line held at 0 regardless of driving logic). Step 1 (Fault activation): Apply A=1 to excite the fault. Normal output with A=1, B=1 is Y=0; faulty output with A s-a-0 is Y=1. Step 2 (Path sensitization): Hold side input B=1 (non-controlling input of NAND). Test vector is AB=11. Output Y=0 (good circuit) vs Y=1 (faulty circuit).',
    },
  ],
};
