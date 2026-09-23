import { LabExperimentDef } from '../types/course';

export const LAB_EXPERIMENTS: LabExperimentDef[] = [
  {
    id: 1,
    title: 'Verification of Logic Gates & De Morgan’s Laws',
    shortTitle: 'Logic Gates & De Morgan',
    co: 'CO2',
    bloom: 'BL2: Understand',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To verify the truth tables of basic and universal logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR) and experimentally prove De Morgan’s Theorems using TTL ICs.',
    apparatus: [
      'Digital IC Trainer Kit (with regulated +5V DC power supply, input toggle switches, LED logic monitors)',
      'TTL ICs: 7400 (Quad 2-in NAND), 7402 (Quad 2-in NOR), 7404 (Hex Inverter), 7408 (Quad 2-in AND), 7432 (Quad 2-in OR), 7486 (Quad 2-in XOR)',
      'Single-strand connecting wires, breadboard, digital logic probe',
    ],
    theory:
      'De Morgan’s first theorem states that (A · B)\' = A\' + B\'. The complement of a product is equal to the sum of the complements. De Morgan’s second theorem states that (A + B)\' = A\' · B\'. The complement of a sum is equal to the product of the complements. These theorems form the mathematical basis for converting between AND-OR and NAND-NAND or NOR-NOR universal logic networks.',
    circuitSummary:
      'Inputs A and B are supplied from TTL logic switches (0V/5V). For De Morgan Theorem 1, NAND output (Pin 3 of 7400) is compared against an OR gate (7432) fed with inverted inputs A\' and B\' (from 7404). Output states are verified across all 4 binary combinations.',
    procedure: [
      'Insert the TTL ICs into the breadboard across the central trough.',
      'Connect Pin 14 of each IC to the +5V DC power rail and Pin 7 to GND rail.',
      'Connect input toggle switches to IC inputs (Pins 1 and 2 for gate 1).',
      'Connect IC output pin (Pin 3) to an LED indicator via a 330Ω current-limiting resistor.',
      'Apply all combinations of binary inputs (00, 01, 10, 11) and record LED states in the observation table.',
      'Repeat the procedure for De Morgan dual equivalence circuits.',
    ],
    truthTableOrObservations: {
      headers: ['A', 'B', 'A · B (AND)', '(A · B)\' (NAND)', 'A\' + B\' (DeMorgan 1)', 'A + B (OR)', '(A + B)\' (NOR)', 'A\' · B\' (DeMorgan 2)'],
      rows: [
        [0, 0, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 1, 1, 1, 0, 0],
        [1, 0, 0, 1, 1, 1, 0, 0],
        [1, 1, 1, 0, 0, 1, 0, 0],
      ],
    },
    vivaQuestions: [
      {
        question: 'Why are NAND and NOR gates designated as "Universal Gates"?',
        answer: 'Because any Boolean logic expression or digital circuit can be realized using only NAND gates or only NOR gates without requiring any other gate types.',
        tip: 'Mention how NOT, AND, and OR can each be built purely from NAND/NOR gates.',
      },
      {
        question: 'What is the voltage level corresponding to logic HIGH and logic LOW in standard TTL?',
        answer: 'Logic LOW is 0V to 0.8V (typically 0.2V-0.4V). Logic HIGH is 2.0V to 5.0V (typically 2.4V-3.5V). The region between 0.8V and 2.0V is an invalid/indeterminate threshold.',
      },
      {
        question: 'What happens if an input pin of a TTL gate is left unconnected (floating)?',
        answer: 'In TTL logic, a floating input acts as a logic HIGH due to internal multi-emitter base-collector pull-up, but it is highly susceptible to electrical noise and should never be left floating in production.',
      },
    ],
    breadboardPresetId: 'exp1-gates',
  },
  {
    id: 2,
    title: 'Design & Verification of Flip-Flops (JK, D, T) using IC 7476 / 7474',
    shortTitle: 'Flip-Flops Verification',
    co: 'CO1',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To design, construct, and verify the truth table and excitation behavior of JK, D, and T Flip-Flops with asynchronous active-LOW Preset and Clear controls using IC 7476 and IC 7474.',
    apparatus: [
      'Digital IC Trainer Kit with single-pulse clock generator (debounced pushbutton)',
      'IC 7476 (Dual JK Master-Slave Flip-Flop with PRE and CLR)',
      'IC 7474 (Dual D Positive-Edge-Triggered Flip-Flop with PRE and CLR)',
      'Connecting wires, logic probe, dual-channel oscilloscope',
    ],
    theory:
      'Flip-flops are bistable multivibrators capable of storing one bit of information. The JK flip-flop eliminates the invalid state of the SR latch when J=K=1 by toggling the output. Master-Slave JK architecture overcomes the race-around condition. D flip-flop transfers input D to output Q on clock edge. T flip-flop toggles when T=1 and holds state when T=0.',
    circuitSummary:
      'IC 7476 dual in-line package with VCC on Pin 5 and GND on Pin 13 (note non-standard pinout). Connect J (pin 4), K (pin 16), CLK (pin 1), PRE\' (pin 2), and CLR\' (pin 3). LEDs display Q (pin 15) and Q\' (pin 14).',
    procedure: [
      'Wire VCC (+5V) to Pin 5 and GND to Pin 13 of IC 7476.',
      'Connect PRE\' and CLR\' to HIGH logic switches (active-LOW controls must be disabled during synchronous operation).',
      'Test asynchronous controls: set PRE\'=0 (Q becomes 1 immediately); set CLR\'=0 (Q becomes 0 immediately).',
      'Return PRE\' and CLR\' to 1. Connect J and K to logic switches.',
      'Apply manual clock pulses and record next state Q(n+1) for all combinations (00, 01, 10, 11).',
      'Convert JK to D flip-flop by connecting K = J\' through an inverter. Verify D operation.',
      'Convert JK to T flip-flop by tying J and K together. Verify T operation.',
    ],
    truthTableOrObservations: {
      headers: ['Clock Edge', 'J', 'K', 'Q(n)', 'Q(n+1)', 'State Action'],
      rows: [
        ['Falling (↓)', 0, 0, 0, 0, 'No Change (Hold)'],
        ['Falling (↓)', 0, 0, 1, 1, 'No Change (Hold)'],
        ['Falling (↓)', 0, 1, 0, 0, 'Reset (Q=0)'],
        ['Falling (↓)', 0, 1, 1, 0, 'Reset (Q=0)'],
        ['Falling (↓)', 1, 0, 0, 1, 'Set (Q=1)'],
        ['Falling (↓)', 1, 0, 1, 1, 'Set (Q=1)'],
        ['Falling (↓)', 1, 1, 0, 1, 'Toggle'],
        ['Falling (↓)', 1, 1, 1, 0, 'Toggle'],
      ],
    },
    vivaQuestions: [
      {
        question: 'What is the race-around condition and in which flip-flop does it occur?',
        answer: 'It occurs in level-triggered JK flip-flops when J=K=1 and clock pulse width tp is greater than propagation delay tpd. The output toggles repeatedly and becomes unpredictable by the end of the pulse.',
      },
      {
        question: 'Why are Preset and Clear inputs called "asynchronous"?',
        answer: 'Because their action takes effect immediately without waiting for any clock transition. They override all synchronous inputs.',
      },
      {
        question: 'What is the setup time and hold time of an edge-triggered flip-flop?',
        answer: 'Setup time (ts) is the minimum time the data input must remain stable BEFORE the active clock edge. Hold time (th) is the minimum time data must remain stable AFTER the active clock edge.',
      },
    ],
    breadboardPresetId: 'exp2-flipflops',
    simulatorId: 'flipflop-explorer',
  },
  {
    id: 3,
    title: 'Design of Asynchronous (Ripple) Counter (MOD-6 / MOD-10) using IC 7490 / 7493',
    shortTitle: 'Asynchronous Ripple Counter',
    co: 'CO1',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To design, assemble, and test a truncated MOD-6 and MOD-10 (BCD) asynchronous ripple counter using cascaded flip-flops and IC 7490 / IC 7493 with feedback clearing.',
    apparatus: [
      'Digital IC Trainer Kit, square wave clock generator (1 Hz – 1 kHz)',
      'IC 7490 (Decade Counter) or IC 7493 (4-bit Binary Ripple Counter)',
      'IC 7400 (Quad 2-in NAND) for truncation decoding',
      'Seven-segment display module with 7447 decoder, connecting wires',
    ],
    theory:
      'In an asynchronous counter, flip-flops are connected in cascade such that each flip-flop is clocked by the output of the preceding stage. To create a truncated counter with modulus N < 2^n, combinational logic decodes state N and asserts the active-LOW asynchronous clear (CLR) inputs, immediately resetting the counter to 0000.',
    circuitSummary:
      'For MOD-6 counter (count states 0 to 5), state 6 (binary 0110: Q2=1, Q1=1) is detected by a 2-input NAND gate whose output connects to active-LOW reset pins R0(1) and R0(2) of the counter IC.',
    procedure: [
      'Power IC 7490: VCC = Pin 5, GND = Pin 10. Connect Pin 12 (QA) to Pin 1 (Input B) to cascade MOD-2 and MOD-5 sections.',
      'Connect clock generator (1 Hz) to Pin 14 (Input A).',
      'For MOD-6 truncation: Connect QA, QB, QC, QD to LEDs. Connect QB (pin 9) and QC (pin 8) to reset inputs R0(1) (pin 2) and R0(2) (pin 3).',
      'Observe count progression on LEDs: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> (resets to 000).',
      'Connect outputs QA..QD to 7447 BCD-to-7-segment driver and verify digits on display.',
    ],
    truthTableOrObservations: {
      headers: ['Clock Pulse', 'QD (Pin 11)', 'QC (Pin 8)', 'QB (Pin 9)', 'QA (Pin 12)', 'Decimal Value'],
      rows: [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 1],
        [2, 0, 0, 1, 0, 2],
        [3, 0, 0, 1, 1, 3],
        [4, 0, 1, 0, 0, 4],
        [5, 0, 1, 0, 1, 5],
        [6, 0, 0, 0, 0, 'Reset Glitch -> 0'],
      ],
    },
    vivaQuestions: [
      {
        question: 'Why is an asynchronous counter called a "ripple counter"?',
        answer: 'Because the clock ripples through each flip-flop stage one after another, resulting in cumulative propagation delay from stage to stage.',
      },
      {
        question: 'What causes glitch spikes in truncated ripple counters?',
        answer: 'The temporary entry into the reset state (e.g., state 6) before the asynchronous clear resets the flip-flops produces an ultra-short transient glitch on the outputs.',
      },
      {
        question: 'How many flip-flops are needed to construct a MOD-25 counter?',
        answer: 'Since 2^(n-1) < N <= 2^n, for N=25 we need 2^4 (16) < 25 <= 2^5 (32). Therefore, 5 flip-flops are required.',
      },
    ],
    breadboardPresetId: 'exp3-ripple-counter',
    simulatorId: 'counter-visualizer',
  },
  {
    id: 4,
    title: 'Design of Synchronous Up/Down Counter (MOD-8) using Flip-Flops & Gates',
    shortTitle: 'Synchronous Up/Down Counter',
    co: 'CO1',
    bloom: 'BL4: Analyze',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To design, assemble, and analyze a 3-bit Synchronous Up/Down Counter using JK / T flip-flops and steering logic gates, eliminating ripple propagation delays.',
    apparatus: [
      'Digital IC Trainer Kit with common clock distribution bus',
      'IC 7476 (Dual JK Master-Slave Flip-Flops)',
      'IC 7408 (AND), IC 7432 (OR), IC 7404 (NOT) for steering logic',
      'Mode control switch M (M=0 for UP, M=1 for DOWN)',
    ],
    theory:
      'In synchronous counters, all flip-flops are connected to a common clock line and trigger simultaneously. Up/Down steering logic enables next-stage toggling: during UP count (M=0), stage n toggles when all preceding stages are 1; during DOWN count (M=1), stage n toggles when all preceding stages are 0.',
    circuitSummary:
      'Common clock fed to Pin 1 of all 7476 flip-flops. Flip-Flop A toggles on every clock. J_B = K_B = (M\' · QA) + (M · QA\'). J_C = K_C = (M\' · QA · QB) + (M · QA\' · QB\').',
    procedure: [
      'Wire the common clock line to all flip-flops.',
      'Assemble steering logic using AND, OR, and NOT gates according to derived excitation equations.',
      'Set control switch M = 0. Apply clock pulses and record Up count: 000, 001, 010, 011, 100, 101, 110, 111, 000.',
      'Set control switch M = 1. Apply clock pulses and record Down count: 111, 110, 101, 100, 011, 010, 001, 000, 111.',
      'Verify waveform on logic analyzer / oscilloscope to confirm simultaneous transitions.',
    ],
    truthTableOrObservations: {
      headers: ['Clock Pulse', 'Mode M', 'QC', 'QB', 'QA', 'Count Value'],
      rows: [
        [0, '0 (UP)', 0, 0, 0, 0],
        [1, '0 (UP)', 0, 0, 1, 1],
        [2, '0 (UP)', 0, 1, 0, 2],
        [3, '0 (UP)', 0, 1, 1, 3],
        [4, '0 (UP)', 1, 0, 0, 4],
        [5, '1 (DOWN)', 0, 1, 1, 3],
        [6, '1 (DOWN)', 0, 1, 0, 2],
        [7, '1 (DOWN)', 0, 0, 1, 1],
      ],
    },
    vivaQuestions: [
      {
        question: 'What is the principal advantage of a synchronous counter over an asynchronous ripple counter?',
        answer: 'All flip-flops trigger simultaneously on the common clock edge, avoiding cumulative ripple delays and preventing decoding glitches.',
      },
      {
        question: 'What formula calculates the maximum operating frequency of a synchronous counter?',
        answer: 'f_max = 1 / (t_pd + t_comb), where t_pd is flip-flop propagation delay and t_comb is the delay of the combinational carry/steering logic.',
      },
      {
        question: 'What are lock-out states in counter design and how are they avoided?',
        answer: 'Unused states that form a closed self-contained loop without ever returning to the valid count sequence. Designed excitation logic must guarantee return to valid states (self-starting property).',
      },
    ],
    breadboardPresetId: 'exp4-sync-counter',
    simulatorId: 'counter-visualizer',
  },
  {
    id: 5,
    title: 'Implementation of Ring Counter & Johnson Twisted-Ring Counter using IC 74194',
    shortTitle: 'Ring & Johnson Counters',
    co: 'CO1',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To configure the 4-bit Universal Shift Register (IC 74194) as a 4-state Ring Counter and an 8-state Johnson (twisted-ring / Mobius) Counter with self-starting logic.',
    apparatus: [
      'Digital IC Trainer Kit, clock generator, manual step pushbutton',
      'IC 74194 (4-bit Bidirectional Universal Shift Register)',
      'IC 7404 (Hex Inverter), IC 7402 (Quad NOR for self-starting)',
      'Output LED indicators, connecting wires',
    ],
    theory:
      'A Ring Counter recirculates a single circulating logic 1 through N flip-flops, yielding N unique states. A Johnson Counter recirculates the inverted output Q_bar of the last stage back into the serial input of the first stage, producing 2N unique states without additional gating.',
    circuitSummary:
      'For Ring Counter: Pin 12 (QD) is tied to Pin 2 (SR SER). S1S0 = 01 (Shift Right). Parallel load inputs A..D load 1000 initial seed. For Johnson Counter: Pin 12 (QD) is connected through 7404 inverter to Pin 2 (SR SER). Initial seed is 0000.',
    procedure: [
      'Connect IC 74194: VCC = Pin 16, GND = Pin 8.',
      'Configure Ring Counter: Connect Pin 12 (QD) to Pin 2 (SR SER). Set S1=1, S0=1 to parallel load A=1, B=0, C=0, D=0.',
      'Switch S1=0, S0=1 (Shift Right). Apply clock pulses and observe LED sequence: 1000 -> 0100 -> 0010 -> 0001 -> 1000.',
      'Configure Johnson Counter: Connect QD through NOT gate (7404) to SR SER (Pin 2). Clear register to 0000 (Pin 1 CLR\' pulse).',
      'Apply clock pulses and observe the 8-state sequence.',
    ],
    truthTableOrObservations: {
      headers: ['Clock Pulse', 'Ring Counter (QA QB QC QD)', 'Johnson Counter (QA QB QC QD)', 'Johnson Decoded State'],
      rows: [
        [0, '1 0 0 0', '0 0 0 0', 'State 0'],
        [1, '0 1 0 0', '1 0 0 0', 'State 1'],
        [2, '0 0 1 0', '1 1 0 0', 'State 2'],
        [3, '0 0 0 1', '1 1 1 0', 'State 3'],
        [4, '1 0 0 0', '1 1 1 1', 'State 4'],
        [5, '0 1 0 0', '0 1 1 1', 'State 5'],
        [6, '0 0 1 0', '0 0 1 1', 'State 6'],
        [7, '0 0 0 1', '0 0 0 1', 'State 7'],
      ],
    },
    vivaQuestions: [
      {
        question: 'Compare the number of valid and unused states in a 4-bit Ring Counter versus a 4-bit Johnson Counter.',
        answer: 'Ring Counter: 4 valid states, 12 unused states (16 - 4). Johnson Counter: 8 valid states, 8 unused states (16 - 8). Johnson counter is twice as hardware efficient.',
      },
      {
        question: 'How do you decode any state in a Johnson Counter using a simple 2-input gate?',
        answer: 'Any state in a Johnson counter can be decoded with a single 2-input AND or NOR gate because adjacent states differ by only a single bit (Gray-code property).',
      },
      {
        question: 'What is the lock-out condition in a Ring Counter and how is it resolved?',
        answer: 'If noise enters the circuit and causes multiple 1s or all 0s, the ring counter circulates invalid patterns indefinitely. A NOR gate decoding QC and QD fed to QA forces automatic self-recovery.',
      },
    ],
    breadboardPresetId: 'exp5-ring-johnson',
    simulatorId: 'shift-register-sim',
  },
  {
    id: 6,
    title: 'Study & Verification of Universal Shift Register (IC 74194) in All Modes',
    shortTitle: 'Universal Shift Register 74194',
    co: 'CO1',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To operate and verify the 4 modes of operation of the 4-bit Universal Shift Register IC 74194: Inhibit/Hold, Shift Right, Shift Left, and Parallel Load.',
    apparatus: [
      'Digital IC Trainer Kit with data switches, debounced clock source, LED indicators',
      'IC 74194 (4-bit Universal Shift Register)',
      'Connecting wires, logic probe',
    ],
    theory:
      'A universal shift register contains internal multiplexers controlled by select inputs S1 and S0. When S1S0=00, clock pulses are inhibited (Hold). When S1S0=01, data shifts from QA towards QD (Shift Right). When S1S0=10, data shifts from QD towards QA (Shift Left). When S1S0=11, inputs A..D are loaded in parallel on clock edge.',
    circuitSummary:
      'IC 74194 pinout: VCC=16, GND=8, CLR\'=1, CLK=11, S0=9, S1=10, SR SER=2, SL SER=7, Parallel Inputs A=3, B=4, C=5, D=6, Outputs QA=15, QB=14, QC=13, QD=12.',
    procedure: [
      'Connect power rails (Pin 16 to +5V, Pin 8 to GND). Enable CLR\' (Pin 1 to HIGH).',
      'Verify Parallel Load: Set S1=1, S0=1. Set inputs A=1, B=0, C=1, D=1. Pulse CLK. Verify QA=1, QB=0, QC=1, QD=1.',
      'Verify Inhibit/Hold: Set S1=0, S0=0. Pulse CLK multiple times. Confirm outputs remain unchanged.',
      'Verify Shift Right: Set S1=0, S0=1. Set SR SER = 0. Pulse CLK and observe bits shifting right.',
      'Verify Shift Left: Set S1=1, S0=0. Set SL SER = 1. Pulse CLK and observe bits shifting left.',
    ],
    truthTableOrObservations: {
      headers: ['S1', 'S0', 'CLR\'', 'CLK', 'Action', 'QA(t+1)', 'QB(t+1)', 'QC(t+1)', 'QD(t+1)'],
      rows: [
        [0, 0, 1, '↑', 'Hold / Inhibit', 'QA(t)', 'QB(t)', 'QC(t)', 'QD(t)'],
        [0, 1, 1, '↑', 'Shift Right', 'SR_SER', 'QA(t)', 'QB(t)', 'QC(t)'],
        [1, 0, 1, '↑', 'Shift Left', 'QB(t)', 'QC(t)', 'QD(t)', 'SL_SER'],
        [1, 1, 1, '↑', 'Parallel Load', 'A', 'B', 'C', 'D'],
        ['X', 'X', 0, 'X', 'Asynchronous Reset', 0, 0, 0, 0],
      ],
    },
    vivaQuestions: [
      {
        question: 'What is the function of the S1 and S0 control inputs in IC 74194?',
        answer: 'They control the internal 4:1 multiplexers to select the source of data for each flip-flop: 00 selects current output (Hold), 01 selects left neighbor (Shift Right), 10 selects right neighbor (Shift Left), and 11 selects external parallel input.',
      },
      {
        question: 'How do you convert serial data into parallel data using IC 74194?',
        answer: 'Feed data bit-by-bit into the serial input in Shift Right mode (S1S0=01). After 4 clock pulses, read QA, QB, QC, and QD simultaneously as 4-bit parallel data (SIPO).',
      },
      {
        question: 'What is the difference between synchronous parallel load and asynchronous load?',
        answer: 'Synchronous parallel load requires the active clock edge to transfer data from inputs into the flip-flops, whereas asynchronous load transfers data immediately regardless of clock state.',
      },
    ],
    breadboardPresetId: 'exp6-usr-74194',
    simulatorId: 'shift-register-sim',
  },
  {
    id: 7,
    title: 'Design & Implementation of Full Adder and Full Subtractor using Basic Gates',
    shortTitle: 'Full Adder & Subtractor',
    co: 'CO4',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To design, construct, and verify arithmetic computing circuits: Full Adder (Sum & Carry) and Full Subtractor (Difference & Borrow) using XOR, AND, and OR gates.',
    apparatus: [
      'Digital IC Trainer Kit with 3 input logic switches and 2 output LEDs',
      'IC 7486 (Quad 2-in XOR), IC 7408 (Quad 2-in AND), IC 7432 (Quad 2-in OR), IC 7404 (Hex Inverter)',
      'Connecting wires',
    ],
    theory:
      'A Full Adder adds three 1-bit binary inputs: A, B, and Carry-In (Cin). Sum = A ⊕ B ⊕ Cin; Cout = (A · B) + (Cin · (A ⊕ B)). A Full Subtractor computes difference of A - B - Bin. Diff = A ⊕ B ⊕ Bin; Bout = (A\' · B) + (Bin · (A ⊕ B)\'). Both can be cascaded to build N-bit parallel arithmetic units.',
    circuitSummary:
      'Connect inputs A and B to XOR gate 1 of 7486. The output (A⊕B) and Cin feed XOR gate 2 to generate Sum. AND and OR gates compute Cout = A·B + Cin·(A⊕B).',
    procedure: [
      'Place IC 7486, 7408, and 7432 on breadboard; connect Pin 14 to +5V and Pin 7 to GND.',
      'Assemble the Full Adder circuit according to the logic schematic.',
      'Apply all 8 combinations of inputs A, B, Cin (000 to 111) and record Sum and Cout on LEDs.',
      'Reconfigure the circuit with inverter 7404 for Full Subtractor and record Diff and Bout.',
    ],
    truthTableOrObservations: {
      headers: ['A', 'B', 'Cin / Bin', 'Full Adder Sum', 'Full Adder Cout', 'Full Subtractor Diff', 'Full Subtractor Bout'],
      rows: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 1, 1],
        [0, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 0],
        [1, 1, 0, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
      ],
    },
    vivaQuestions: [
      {
        question: 'How can a Full Adder be constructed using two Half Adders and an OR gate?',
        answer: 'The first Half Adder sums A and B to generate S1=A⊕B and C1=A·B. The second Half Adder sums S1 and Cin to produce final Sum=S1⊕Cin and C2=S1·Cin. An OR gate combines C1 and C2 to produce Cout=C1+C2.',
      },
      {
        question: 'What is a carry lookahead adder and why is it preferred over a ripple carry adder?',
        answer: 'In ripple carry adders, carry propagation delay accumulates with the number of bits N. A carry lookahead adder computes carry signals in parallel using generate (G=A·B) and propagate (P=A⊕B) logic, drastically reducing latency.',
      },
      {
        question: 'How can you convert a 4-bit parallel adder (IC 7483) into an adder-subtractor circuit?',
        answer: 'By passing operand B through XOR gates with a mode control bit M. When M=0, B is unchanged and Cin=0 (Addition). When M=1, B is inverted and Cin=1, effectively adding 2\'s complement of B (Subtraction).',
      },
    ],
    breadboardPresetId: 'exp7-full-adder',
  },
  {
    id: 8,
    title: 'Implementation of 3:8 Decoder (IC 74138) & Binary-to-Gray Code Converter',
    shortTitle: '3:8 Decoder & Code Converters',
    co: 'CO4',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Hardware TTL',
    objective:
      'To verify the decoding operation of 3-to-8 line Decoder / Demultiplexer (IC 74138) and implement Binary-to-Gray and Gray-to-Binary code converters using XOR gates.',
    apparatus: [
      'Digital IC Trainer Kit, logic switches, output LEDs',
      'IC 74138 (3-to-8 Line Inverting Decoder / Demultiplexer)',
      'IC 7486 (Quad 2-in XOR Gate)',
      'Connecting wires',
    ],
    theory:
      'A decoder converts binary information from n input lines to a maximum of 2^n unique output lines. IC 74138 has 3 select inputs (A, B, C), 3 enable inputs (G1 active-HIGH, G2A\' and G2B\' active-LOW), and 8 active-LOW outputs (Y0\' to Y7\'). Gray code is a reflected binary code where adjacent numbers differ in only one bit position, eliminating transmission race hazards.',
    circuitSummary:
      'IC 74138 enabled by setting G1=1, G2A\'=0, G2B\'=0. Binary-to-Gray conversion: G3 = B3, G2 = B3 ⊕ B2, G1 = B2 ⊕ B1, G0 = B1 ⊕ B0. Gray-to-Binary conversion: B3 = G3, B2 = B3 ⊕ G2, B1 = B2 ⊕ G1, B0 = B1 ⊕ G0.',
    procedure: [
      'Insert IC 74138 into breadboard. Connect Pin 16 to +5V and Pin 8 to GND.',
      'Enable IC: Connect Pin 6 (G1) to +5V; Pins 4 (G2A\') and 5 (G2B\') to GND.',
      'Connect address inputs A (pin 1), B (pin 2), C (pin 3) to toggle switches.',
      'Apply binary codes from 000 to 111 and verify that only one output Y\' goes LOW at any time.',
      'Assemble Binary-to-Gray code converter on 7486 and record conversion table.',
    ],
    truthTableOrObservations: {
      headers: ['C (A2)', 'B (A1)', 'A (A0)', 'Selected Output (Active-LOW)', 'Binary (B3..B0)', 'Gray Code (G3..G0)'],
      rows: [
        [0, 0, 0, 'Y0\' = 0 (Pin 15)', '0000', '0000'],
        [0, 0, 1, 'Y1\' = 0 (Pin 14)', '0001', '0001'],
        [0, 1, 0, 'Y2\' = 0 (Pin 13)', '0010', '0011'],
        [0, 1, 1, 'Y3\' = 0 (Pin 12)', '0011', '0010'],
        [1, 0, 0, 'Y4\' = 0 (Pin 11)', '0100', '0110'],
        [1, 0, 1, 'Y5\' = 0 (Pin 10)', '0101', '0111'],
        [1, 1, 0, 'Y6\' = 0 (Pin 9)', '0110', '0101'],
        [1, 1, 1, 'Y7\' = 0 (Pin 7)', '0111', '0100'],
      ],
    },
    vivaQuestions: [
      {
        question: 'Why are the outputs of IC 74138 active-LOW?',
        answer: 'Active-LOW outputs are standard in TTL bus decoding because TTL gates can sink more current in the LOW state (IOL) than they can source in the HIGH state (IOH).',
      },
      {
        question: 'How can IC 74138 be used as a Demultiplexer?',
        answer: 'Use the 3 select inputs (A, B, C) as data steering lines, apply serial data to one of the enable inputs (e.g., G1 or G2A\'), and keep the remaining enable inputs asserted.',
      },
      {
        question: 'What is the primary application of Gray code in electro-mechanical sensors?',
        answer: 'Because only one bit changes at any boundary between consecutive numbers, Gray code prevents multi-bit transition ambiguities and errors in optical rotary shaft encoders.',
      },
    ],
    breadboardPresetId: 'exp8-decoder-74138',
  },
  {
    id: 9,
    title: 'Simulation of Combinational Logic Circuits in Verilog HDL',
    shortTitle: 'Verilog Combinational Circuits',
    co: 'CO5',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Verilog HDL',
    objective:
      'To write, simulate, and verify synthesizable Verilog HDL modules for combinational circuits: 4:1 Multiplexer, 4-bit Ripple Carry Adder, and BCD-to-7-Segment Decoder across structural, dataflow, and behavioral models.',
    apparatus: [
      'EDA Simulation Tool: Icarus Verilog / ModelSim / Vivado / Web Simulator',
      'GTKWave waveform viewer, text editor',
    ],
    theory:
      'Verilog HDL provides hardware description constructs at three levels of abstraction: 1) Structural (gate-level instantiations), 2) Dataflow (continuous assignment statements using assign), and 3) Behavioral (procedural blocks using always @(*)). A testbench instantiates the Unit Under Test (UUT) and drives input stimulus over time.',
    circuitSummary:
      '4:1 Mux behavioral model uses case (sel) construct. Full adder uses dataflow assign {cout, sum} = a + b + cin. Testbench sweeps all input vector permutations with 10ns delays and outputs waveforms.',
    procedure: [
      'Write the Verilog module for the 4:1 multiplexer using behavioral case statement.',
      'Develop a separate testbench module `tb_mux41` with initial block driving sel from 2\'b00 to 2\'b11.',
      'Compile with Icarus Verilog (`iverilog -o sim.vvp mux41.v tb_mux41.v`).',
      'Execute simulation (`vvp sim.vvp`) and dump VCD waveform file.',
      'Open waveform in GTKWave and verify timing transitions against the theoretical truth table.',
    ],
    truthTableOrObservations: {
      headers: ['Simulation Time (ns)', 'sel[1:0]', 'in[3:0]', 'Expected y', 'Observed y in Waveform', 'Result'],
      rows: [
        ['0 ns', '00', '1010', '0 (in[0])', '0', 'PASS'],
        ['10 ns', '01', '1010', '1 (in[1])', '1', 'PASS'],
        ['20 ns', '10', '1010', '0 (in[2])', '0', 'PASS'],
        ['30 ns', '11', '1010', '1 (in[3])', '1', 'PASS'],
      ],
    },
    vivaQuestions: [
      {
        question: 'What is the purpose of `$dumpfile` and `$dumpvars` in a Verilog testbench?',
        answer: '`$dumpfile` specifies the output Value Change Dump (VCD) filename, and `$dumpvars` specifies the module hierarchy depth whose signal value changes will be logged for waveform viewers.',
      },
      {
        question: 'Why should combinational `always` blocks include all read signals in their sensitivity list (or use `always @*`)?',
        answer: 'Omitting a read input from the sensitivity list causes simulation to fail to update the output when that input changes, creating a simulation-synthesis mismatch and unintended latch inference.',
      },
      {
        question: 'What is the difference between `reg` and `wire` data types in Verilog HDL?',
        answer: 'A `wire` represents a physical electrical connection driven continuously by gates or assign statements. A `reg` is a variable that holds its value between procedural assignments inside initial or always blocks.',
      },
    ],
    simulatorId: 'verilog-playground',
  },
  {
    id: 10,
    title: 'Simulation of Sequential Logic Circuits (Flip-Flops & Counters) in Verilog HDL',
    shortTitle: 'Verilog Sequential Circuits',
    co: 'CO5',
    bloom: 'BL3: Apply',
    hours: 2,
    category: 'Verilog HDL',
    objective:
      'To model, simulate, and verify edge-triggered D and JK Flip-Flops and a 4-bit Synchronous Up-Counter with asynchronous active-low reset and enable in Verilog HDL.',
    apparatus: [
      'Verilog HDL Simulator (Icarus Verilog / ModelSim / Vivado)',
      'Waveform viewer (GTKWave)',
    ],
    theory:
      'Sequential circuits are modeled in Verilog using procedural blocks sensitive to clock edges (`always @(posedge clk or negedge rst_n)`). Non-blocking assignments (`<=`) MUST be used for sequential logic to model concurrent register transfer accurately and eliminate simulation races.',
    circuitSummary:
      '4-bit synchronous counter module with inputs `clk`, `rst_n`, `enable`, and output `[3:0] count`. Testbench generates continuous 50MHz clock (`always #10 clk = ~clk`) and asserts reset, enable, and count cycles.',
    procedure: [
      'Write the behavioral Verilog code for the 4-bit counter using non-blocking assignments.',
      'Develop testbench with clock period 20ns (50 MHz).',
      'Apply active-low reset at t=0ns, release reset at t=35ns, and enable counter at t=45ns.',
      'Run simulation for 400ns to allow counter to increment from 0 to 15 and wrap around.',
      'Inspect timing waveforms to verify synchronous transitions coinciding with positive clock edges.',
    ],
    truthTableOrObservations: {
      headers: ['Clock Cycle', 'rst_n', 'enable', 'count[3:0] (Binary)', 'Decimal Count', 'Status'],
      rows: [
        [1, 0, 1, '0000', 0, 'Reset Asserted'],
        [2, 1, 1, '0001', 1, 'Counting'],
        [3, 1, 1, '0010', 2, 'Counting'],
        [4, 1, 0, '0010', 2, 'Hold (Enable=0)'],
        [5, 1, 1, '0011', 3, 'Resumed Count'],
        [16, 1, 1, '1111', 15, 'Maximum Count'],
        [17, 1, 1, '0000', 0, 'Overflow / Wrap Around'],
      ],
    },
    vivaQuestions: [
      {
        question: 'Why MUST non-blocking assignments (`<=`) be used for sequential logic in Verilog?',
        answer: 'Non-blocking assignments evaluate their right-hand sides concurrently and schedule assignments at the end of the time step. This prevents race conditions where one flip-flop reads a newly updated value instead of the old value.',
      },
      {
        question: 'How is an asynchronous active-low reset written in a Verilog sensitivity list?',
        answer: '`always @(posedge clk or negedge rst_n)` — the negedge keyword causes the procedural block to trigger immediately whenever rst_n drops to 0, independent of clk.',
      },
      {
        question: 'What is the synthesis result of a variable that is assigned inside an `always @*` block but not in all branches?',
        answer: 'The synthesizer infers an unintended transparent latch (level-sensitive latch) to preserve the previous state, which can introduce severe timing hazards.',
      },
    ],
    simulatorId: 'verilog-playground',
  },
  {
    id: 11,
    title: 'Design & Prototyping of a Digital Security Door Alarm System',
    shortTitle: 'Digital Security Alarm System',
    co: 'CO6',
    bloom: 'BL4: Analyze',
    hours: 2,
    category: 'System Design',
    objective:
      'To design, construct, and troubleshoot a hardware digital security system using a magnetic reed door sensor, an edge-triggered latching flip-flop (IC 7474), a driver transistor, and an audio-visual siren strobe alarm.',
    apparatus: [
      'Digital Breadboard Workbench, +5V DC power supply',
      'Magnetic Reed Switch (Normally Closed / Open door sensor) + magnet',
      'IC 7474 (Dual D Flip-Flop with active-low Preset and Clear)',
      'NPN Transistor (2N2222 / BC547), 1kΩ base resistor, 1N4007 flyback diode',
      'Piezo buzzer / 5V siren, Red flashing alarm LED, Reset momentary switch',
    ],
    theory:
      'Security systems require latching behavior: once an unauthorized intrusion event triggers a sensor (even momentarily), the alarm MUST remain latched ON until an authorized supervisor presses an authenticated reset switch. A D flip-flop configured with D=1 and clocked by the sensor transition latches the intrusion event permanently into memory.',
    circuitSummary:
      'Reed switch is connected to D flip-flop clock input with a 10kΩ pull-up resistor. When door opens, contact opens, creating a 0-to-1 rising edge. Q latches HIGH. Q drives 2N2222 base via 1kΩ resistor, turning ON the buzzer and strobe LED. Manual push switch asserts CLR\' (pin 1) to reset.',
    procedure: [
      'Assemble the sensor pull-up circuit: connect reed switch between pin 3 (CLK) and GND, with 10kΩ pull-up to +5V.',
      'Tie Pin 2 (D) of 7474 to +5V (HIGH logic). Tie Pin 4 (PRE\') to +5V.',
      'Connect momentary normally-open push button between Pin 1 (CLR\') and GND with 10kΩ pull-up to +5V.',
      'Connect output Pin 5 (Q) to 1kΩ resistor feeding base of 2N2222 transistor.',
      'Connect buzzer and red strobe LED in transistor collector circuit.',
      'Test operation: Close door (magnet near switch). Press Reset. Alarm is SILENT (Q=0).',
      'Open door (move magnet away). Observe immediate alarm latching (Q=1, buzzer and LED active).',
      'Close door again: verify that alarm CONTINUES sounding until Reset button is pressed.',
    ],
    truthTableOrObservations: {
      headers: ['Door Sensor State', 'Reset Button', 'CLK Input', 'Flip-Flop Q', 'Buzzer / Alarm Status'],
      rows: [
        ['Closed (Normal)', 'Not Pressed (1)', '0 (LOW)', '0 (Cleared)', 'SILENT (Disarmed)'],
        ['OPEN (Intrusion!)', 'Not Pressed (1)', 'Rising Edge ↑', '1 (Latched)', 'ALARM ACTIVE! (Buzzer ON)'],
        ['Re-Closed (Attempted concealment)', 'Not Pressed (1)', '1 (Steady)', '1 (Still Latched)', 'ALARM CONTINUES SOUNDING'],
        ['Closed', 'Pressed (0)', '0', '0 (Reset)', 'SILENT (Rearmed)'],
      ],
    },
    vivaQuestions: [
      {
        question: 'Why is a simple combinational gate insufficient for an intrusion detection alarm?',
        answer: 'Because if an intruder quickly opens and closes the door, a combinational circuit would shut off immediately when the door closes. A sequential memory circuit (flip-flop) is essential to latch the alarm state permanently.',
      },
      {
        question: 'What is the function of the flyback diode connected across the relay/buzzer coil?',
        answer: 'It suppresses high-voltage inductive kickback spikes (V = L · di/dt) generated when the transistor turns off, protecting the driver transistor from electrical breakdown.',
      },
      {
        question: 'How would you test this circuit for a stuck-at-0 fault on the flip-flop D input?',
        answer: 'If D is stuck-at-0, triggering the clock edge will latch Q=0 instead of Q=1, causing the alarm to fail to trigger. Applying an intrusion event and verifying Q fails to assert detects this fault.',
      },
    ],
    breadboardPresetId: 'exp11-security-alarm',
    simulatorId: 'security-door-alarm',
  },
  {
    id: 12,
    title: 'Design & Simulation of Sequence Detector ("1011" Mealy/Moore FSM) in Verilog HDL',
    shortTitle: 'Sequence Detector FSM',
    co: 'CO3 & CO5',
    bloom: 'BL6: Create',
    hours: 2,
    category: 'System Design',
    objective:
      'To design the state diagram, state table, and synthesize an overlapping "1011" Sequence Detector using Mealy and Moore Finite State Machine architectures in Verilog HDL with complete testbench verification.',
    apparatus: [
      'Verilog HDL Simulator (Icarus Verilog / ModelSim / Vivado)',
      'GTKWave waveform viewer',
    ],
    theory:
      'A sequence detector examines an incoming stream of serial binary bits and asserts an output flag whenever a predefined target sequence appears. In an overlapping detector, the suffix of one detected sequence can serve as the prefix of the next sequence. A Mealy machine detects the sequence with 4 states (S0, S1, S2, S3), asserting output immediately on the 4th bit transition.',
    circuitSummary:
      'States: S0 (Initial / Reset), S1 (Detected "1"), S2 (Detected "10"), S3 (Detected "101"). From S3, if input is 1, sequence "1011" is satisfied -> Mealy output Z=1, next state returns to S1 (overlapping). 3-always block coding style: state transition, next-state logic, and output logic.',
    procedure: [
      'Draw the Mealy state diagram for detecting sequence "1011" with overlapping.',
      'Assign state codes using parameter / localparam (S0=2\'b00, S1=2\'b01, S2=2\'b10, S3=2\'b11).',
      'Implement the FSM in Verilog using standard 2-always or 3-always procedural methodology.',
      'Develop testbench applying bit stream: `1 0 1 1 0 1 1 0 0 1 0 1 1`.',
      'Simulate and verify that output Z pulses HIGH at each occurrence of "1011".',
    ],
    truthTableOrObservations: {
      headers: ['Clock Cycle', 'Input Bit X', 'Present State', 'Next State', 'Mealy Output Z', 'Sequence Detection Event'],
      rows: [
        [1, 1, 'S0', 'S1', 0, 'Got 1'],
        [2, 0, 'S1', 'S2', 0, 'Got 10'],
        [3, 1, 'S2', 'S3', 0, 'Got 101'],
        [4, 1, 'S3', 'S1', 1, 'DETECTED 1011! (Overlap to S1)'],
        [5, 0, 'S1', 'S2', 0, 'Got 10'],
        [6, 1, 'S2', 'S3', 0, 'Got 101'],
        [7, 1, 'S3', 'S1', 1, 'DETECTED 1011! (Second match)'],
      ],
    },
    vivaQuestions: [
      {
        question: 'What is the key difference between overlapping and non-overlapping sequence detection?',
        answer: 'In overlapping detection, the last bits of a detected sequence can be reused as the starting bits of the next sequence (e.g., in "1011011", two occurrences are detected). In non-overlapping, the machine resets to the initial state after detection.',
      },
      {
        question: 'Why does a Moore machine require one more state than a Mealy machine for sequence detection?',
        answer: 'Because a Moore machine output depends solely on the state. It requires a dedicated recognition state that the machine enters AFTER the final bit arrives, whereas a Mealy machine generates the output on the transition itself.',
      },
      {
        question: 'Why is the 3-always block style recommended for FSM design in industry Verilog?',
        answer: 'It cleanly decouples synchronous state registers (clocked), combinational next-state decoding, and output generation logic, improving readability and avoiding unintended latch inference.',
      },
    ],
    simulatorId: 'fsm-designer',
  },
];
