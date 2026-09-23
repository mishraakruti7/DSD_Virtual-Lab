import { TheoryModuleDef } from '../../types/course';

export const MODULE_1: TheoryModuleDef = {
  id: 1,
  code: 'MOD-1',
  title: 'Sequential Logic Design',
  hours: 8,
  weightageMarks: 25,
  coTarget: 'CO1',
  textbookRef: 'M. Morris Mano, "Digital Design", 5th Ed., Chapters 5 & 6',
  description:
    'Explores memory elements from level-sensitive latches to edge-triggered flip-flops. Covers timing characteristics, elimination of the race-around condition via Master-Slave architectures, excitation tables, conversion between flip-flops, universal shift registers (IC 74194), and synchronous/asynchronous counter design with truncation logic.',
  sections: [
    {
      subtopicId: 'm1-latches-ff',
      title: 'Latches, Flip-Flops & Race-Around Condition',
      hours: 3,
      summary:
        'Contrast between level-sensitive latches (SR, D) and edge-triggered flip-flops (SR, JK, D, T). In-depth examination of the race-around condition in level-triggered JK flip-flops when J=K=1 and pulse width tp > propagation delay tpd. Detailed study of Master-Slave JK architecture and edge-triggering mechanisms using pulse detectors.',
      keyFormulasAndConcepts: [
        'Race-around condition occurs if: tp >= tpd and J = K = 1',
        'Condition to prevent race: tp < tpd or use Master-Slave flip-flop or edge-triggering',
        'Characteristic Equation of JK FF: Q(next) = J*Q_bar + K_bar*Q',
        'Characteristic Equation of D FF: Q(next) = D',
        'Characteristic Equation of T FF: Q(next) = T ⊕ Q',
        'JK Excitation: (0->0: J=0, K=X), (0->1: J=1, K=X), (1->0: J=X, K=1), (1->1: J=X, K=0)',
      ],
      examTips: [
        'Always draw both the Master stage and Slave stage with the clock inverter when asked for Master-Slave JK operation.',
        'Remember that active-LOW preset and clear override all clock and data inputs asynchronously.',
      ],
    },
    {
      subtopicId: 'm1-shift-registers',
      title: 'Shift Registers & Universal Shift Register (IC 74194)',
      hours: 2,
      summary:
        'Classification of shift registers by data transfer modes: Serial-In Serial-Out (SISO), Serial-In Parallel-Out (SIPO), Parallel-In Serial-Out (PISO), and Parallel-In Parallel-Out (PIPO). Architecture and control modes of the 4-bit Universal Shift Register IC 74194 (S1 S0: 00 Hold, 01 Shift Right, 10 Shift Left, 11 Parallel Load). Analysis of Ring Counter (MOD-N) and Johnson Counter (MOD-2N) with self-starting correction circuits.',
      keyFormulasAndConcepts: [
        'Ring Counter with N flip-flops: Counts N unique states. Requires initial seed 100...0.',
        'Johnson Counter with N flip-flops: Counts 2N unique states. Inverted feedback Q_bar to D.',
        'Unused states in 4-bit Johnson: 16 - 8 = 8 invalid states. Self-correcting feedback ensures return to valid sequence.',
        'IC 74194 Mode Control: S1S0 = 00 (Inhibit/Hold), 01 (Shift Right), 10 (Shift Left), 11 (Parallel Load).',
      ],
      examTips: [
        'Highlight the efficiency advantage of Johnson counter (2N states vs N states of Ring counter).',
        'Mention the lock-out problem in Ring Counters and show how a NOR/NAND gate resolves it.',
      ],
    },
    {
      subtopicId: 'm1-counters',
      title: 'Asynchronous & Synchronous Counter Design',
      hours: 3,
      summary:
        'Design of Asynchronous (Ripple) counters and calculation of cumulative propagation delay. Truncated MOD-N counters using NAND feedback to clear pins (IC 7490 BCD decade counter, IC 7493 4-bit binary counter). Step-by-step design procedure for Synchronous Up/Down counters: state diagram, excitation table, K-maps for J-K or T inputs, and logic diagram. Elimination of ripple delay using synchronous carry lookahead.',
      keyFormulasAndConcepts: [
        'Maximum operating frequency of Ripple Counter: f_max = 1 / (N * t_pd)',
        'Maximum operating frequency of Synchronous Counter: f_max = 1 / (t_pd + t_comb)',
        'BCD Decade Counter (MOD-10): Counts 0000 to 1001; resets on reaching 1010 (Q3*Q1 applied to CLR).',
        'Synchronous Counter design steps: 1. State Diagram -> 2. State Table -> 3. FF Excitation -> 4. K-Map simplification -> 5. Logic implementation.',
      ],
      examTips: [
        'When designing MOD-6 ripple counter, reset condition occurs at state 6 (110_2). Connect Q2 and Q1 to active-LOW reset.',
        'Always check for self-starting capability for unused states.',
      ],
    },
  ],
  sampleQuestions: [
    {
      marks: 10,
      question:
        'Explain the race-around condition in a JK flip-flop. How is it overcome in a Master-Slave JK flip-flop? Draw the circuit diagram and explain its operation with timing waveforms.',
      bloom: 'BL4: Analyze',
      solutionOutline:
        'Define race-around condition (tp > tpd when J=K=1). Show how output toggles continuously during clock high. Draw Master-Slave JK schematic with clock inverter. Explain two phases: Master active during CLK=1, Slave active during CLK=0. Present complete timing diagrams showing glitch-free transitions.',
    },
    {
      marks: 10,
      question:
        'Design a synchronous MOD-6 up-counter using JK flip-flops. Draw state diagram, state table, excitation table, K-maps for J & K inputs, and the final circuit diagram. Check if the counter is self-starting.',
      bloom: 'BL6: Create',
      solutionOutline:
        'Determine required flip-flops (2^n >= 6 -> n=3). States: 000 to 101. Form excitation table with JK transitions. Solve K-maps for J0, K0, J1, K1, J2, K2. Check behavior for unused states (110 and 111) to prove self-starting property.',
    },
    {
      marks: 5,
      question:
        'Differentiate between Ring Counter and Johnson Counter for a 4-bit shift register. Tabulate their state sequences and count capacity.',
      bloom: 'BL2: Understand',
      solutionOutline:
        'Ring counter: N flip-flops = N states (4 states for 4 bits: 1000->0100->0010->0001). Johnson counter: N flip-flops = 2N states (8 states for 4 bits: 0000->1000->1100->1110->1111->0111->0011->0001). Compare decoding logic complexity and lock-out prevention.',
    },
  ],
};
