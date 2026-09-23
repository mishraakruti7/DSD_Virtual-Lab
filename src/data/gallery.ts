import { GalleryDiagramItem } from '../types/gallery';

export const GALLERY_DIAGRAMS: GalleryDiagramItem[] = [
  // Transistor-Level
  {
    id: 'ttl-totem-pole',
    title: 'TTL 2-Input NAND Gate with Totem-Pole Output (Transistor Level)',
    category: 'Transistor Level (TTL & CMOS)',
    moduleRef: 2,
    coRef: 'CO2',
    description:
      'Transistor-level schematic of standard 74xx TTL NAND gate showing multi-emitter input transistor Q1, phase-splitter transistor Q2, pull-up transistor Q3, pull-down transistor Q4, diode D, and current-limiting resistors.',
    schematicType: 'ttl_totem_pole',
    tags: ['TTL', 'Totem-Pole', 'Transistor', 'BJT', 'Diode D', 'Phase Splitter'],
    academicNote:
      'Diode D ensures Q3 remains OFF when Q4 is saturated, preventing simultaneous conduction and large current spikes.',
    icCodes: ['7400'],
  },
  {
    id: 'cmos-inverter-gate',
    title: 'CMOS Inverter (Complementary PMOS Pull-Up & NMOS Pull-Down)',
    category: 'Transistor Level (TTL & CMOS)',
    moduleRef: 2,
    coRef: 'CO2',
    description:
      'Schematic of CMOS complementary inverter featuring PMOS transistor connected to VDD and NMOS transistor connected to GND.',
    schematicType: 'cmos_inverter',
    tags: ['CMOS', 'PMOS', 'NMOS', 'Inverter', 'Rail-to-Rail'],
    academicNote:
      'In steady-state, one transistor is always OFF, resulting in virtually zero static power consumption.',
    icCodes: ['74HC04', 'CD4007'],
  },
  {
    id: 'cmos-nand-gate',
    title: 'CMOS 2-Input NAND Gate Transistor Architecture',
    category: 'Transistor Level (TTL & CMOS)',
    moduleRef: 2,
    coRef: 'CO2',
    description:
      'Transistor topology with dual PMOS transistors in parallel between VDD and Output, and dual NMOS transistors in series between Output and GND.',
    schematicType: 'cmos_nand',
    tags: ['CMOS', 'NAND', 'Parallel PMOS', 'Series NMOS'],
    academicNote:
      'Series NMOS pull-down conducts only when both inputs A and B are HIGH, pulling output to 0V.',
    icCodes: ['74HC00'],
  },
  {
    id: 'cmos-nor-gate',
    title: 'CMOS 2-Input NOR Gate Transistor Architecture',
    category: 'Transistor Level (TTL & CMOS)',
    moduleRef: 2,
    coRef: 'CO2',
    description:
      'Transistor topology with dual PMOS transistors in series between VDD and Output, and dual NMOS transistors in parallel between Output and GND.',
    schematicType: 'cmos_nor',
    tags: ['CMOS', 'NOR', 'Series PMOS', 'Parallel NMOS'],
    academicNote:
      'Series PMOS requires both inputs to be LOW to pull output up to VDD.',
    icCodes: ['74HC02'],
  },

  // Flip-Flops & Latches
  {
    id: 'master-slave-jk-schematic',
    title: 'Master-Slave JK Flip-Flop (Internal Two-Stage Architecture)',
    category: 'Flip-Flops & Latches',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      'Complete two-stage circuit consisting of Master clocked by CLK, Slave clocked by inverted CLK_bar, cross-coupled feedback, and asynchronous active-LOW Preset and Clear.',
    schematicType: 'master_slave_jk',
    tags: ['Flip-Flop', 'JK', 'Master-Slave', 'Race-Around Elimination', 'IC 7476'],
    academicNote:
      'Eliminates the race-around condition by ensuring master samples while clock is HIGH, and slave latches while clock is LOW.',
    icCodes: ['7476'],
  },
  {
    id: 'd-flipflop-schematic',
    title: 'Edge-Triggered D Flip-Flop with Active-LOW Preset & Clear',
    category: 'Flip-Flops & Latches',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      'Internal gate arrangement of positive edge-triggered D flip-flop (IC 7474) with asynchronous override inputs PRE\' and CLR\'.',
    schematicType: 'd_flipflop',
    tags: ['D Flip-Flop', 'Edge-Triggered', 'Preset', 'Clear', 'IC 7474'],
    academicNote:
      'Data is transferred to output only at the rising clock transition, providing setup and hold window isolation.',
    icCodes: ['7474'],
  },

  // Counters & Registers
  {
    id: 'mod6-ripple-counter',
    title: 'MOD-6 Asynchronous Ripple Counter with Truncation Feedback',
    category: 'Counters & Registers',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      'Cascaded JK/T flip-flops with negative-edge clocking. A 2-input NAND gate senses state 6 (0110: Q2=1, Q1=1) and asserts active-LOW clear to recycle count to 0.',
    schematicType: 'mod6_counter',
    tags: ['Ripple Counter', 'MOD-6', 'Truncated Counter', 'NAND Feedback', 'Glitch'],
    academicNote:
      'State 6 occurs only as a momentary nanosecond glitch before the asynchronous reset clears all flip-flops.',
    icCodes: ['7476', '7490', '7493'],
  },
  {
    id: 'mod8-sync-counter',
    title: 'MOD-8 Synchronous Up-Counter with Carry Propagation',
    category: 'Counters & Registers',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      '3-bit synchronous counter with common clock bus. Flip-flop A toggles every cycle; flip-flop B toggles when QA=1; flip-flop C toggles when QA·QB=1.',
    schematicType: 'mod8_sync_counter',
    tags: ['Synchronous Counter', 'Common Clock', 'MOD-8', 'Carry AND'],
    academicNote:
      'All flip-flops switch concurrently, eliminating cumulative ripple delay and preventing output decoding spikes.',
    icCodes: ['7476', '7408'],
  },
  {
    id: 'ring-johnson-counters',
    title: '4-Bit Ring Counter & Johnson Twisted-Ring Counter Topologies',
    category: 'Counters & Registers',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      'Comparative schematic showing 4-bit circular shift register feedback: direct feedback (QD to QA) for Ring counter vs inverted feedback (QD_bar to QA) for Johnson counter.',
    schematicType: 'ring_johnson',
    tags: ['Ring Counter', 'Johnson Counter', 'Mobius', 'Shift Register'],
    academicNote:
      'Johnson counter doubles the count capacity (2N states) and allows glitch-free 2-input gate state decoding.',
    icCodes: ['74194'],
  },
  {
    id: 'usr-74194-architecture',
    title: '4-Bit Universal Shift Register (IC 74194) Internal Block Diagram',
    category: 'Counters & Registers',
    moduleRef: 1,
    coRef: 'CO1',
    description:
      'Internal diagram of IC 74194 showing four 4:1 multiplexers driving D flip-flops to execute Inhibit (Hold), Shift Right, Shift Left, and Parallel Load.',
    schematicType: 'usr_74194',
    tags: ['74194', 'Universal Shift Register', 'Multiplexer', 'Parallel Load'],
    academicNote:
      'Mode select inputs S1 and S0 steer multiplexer inputs to select the next data source for each flip-flop.',
    icCodes: ['74194'],
  },

  // FSM & State Flow
  {
    id: 'exp12-fsm-graph',
    title: 'Mealy FSM State Graph for "1011" Overlapping Sequence Detector',
    category: 'FSM & State Flow',
    moduleRef: 3,
    coRef: 'CO3',
    description:
      'Directed state transition diagram with states S0 (Reset), S1 (Got 1), S2 (Got 10), and S3 (Got 101). Transition from S3 on bit 1 generates Z=1 and returns to S1.',
    schematicType: 'exp12_fsm',
    tags: ['FSM', 'Mealy Machine', 'Sequence Detector', '1011', 'Overlapping'],
    academicNote:
      'Overlapping allows the final 1 of the detected sequence to act as the initial 1 of the subsequent sequence.',
  },
  {
    id: 'vending-machine-asm',
    title: 'Beverage Vending Machine Algorithmic State Machine (ASM) Flowchart',
    category: 'FSM & State Flow',
    moduleRef: 3,
    coRef: 'CO3',
    description:
      'Complete ASM chart for ₹15 drink vending machine accepting ₹5 and ₹10 coins with State Boxes, Decision Diamonds, and Conditional Output Boxes for coin refund.',
    schematicType: 'vending_machine_asm',
    tags: ['ASM Chart', 'Vending Machine', 'State Box', 'Decision Box', 'Conditional Output'],
    academicNote:
      'Illustrates precise hardware control unit timing where each ASM block executes within exactly one clock cycle.',
  },

  // Lab Experiments
  {
    id: 'exp11-security-door-schematic',
    title: 'Lab 11: Digital Security Door Alarm System Complete Schematic',
    category: 'Lab Experiments',
    moduleRef: 1,
    coRef: 'CO6',
    description:
      'Complete hardware schematic with magnetic reed sensor, 10kΩ pull-up, 7474 latching D flip-flop, manual reset pushbutton, 2N2222 NPN driver, and piezo siren strobe.',
    schematicType: 'exp11_security_door',
    tags: ['Security Alarm', 'Reed Switch', 'Latching Flip-Flop', '2N2222', 'Siren Strobe', 'IC 7474'],
    academicNote:
      'Latching architecture ensures intrusion events cannot be concealed by quickly closing the door.',
    icCodes: ['7474'],
  },
  {
    id: 'full-adder-subtractor',
    title: 'Full Adder & Full Subtractor Logic Gate Implementation',
    category: 'Lab Experiments',
    moduleRef: 1,
    coRef: 'CO4',
    description:
      'Logic diagram showing Sum/Difference generation via dual XOR gates and Carry/Borrow generation via AND-OR networks.',
    schematicType: 'full_adder_subtractor',
    tags: ['Full Adder', 'Full Subtractor', 'Arithmetic', '7486', '7408', '7432'],
    academicNote:
      'Full adder and subtractor share identical XOR sum/diff logic; only the operand polarity to the carry/borrow gates differs.',
    icCodes: ['7486', '7408', '7432', '7404'],
  },
  {
    id: 'decoder-74138-schematic',
    title: '3:8 Decoder (IC 74138) Internal Logic & Active-LOW Outputs',
    category: 'Lab Experiments',
    moduleRef: 3,
    coRef: 'CO4',
    description:
      'Pinout and internal NAND decoding matrix of 3:8 inverting decoder with 3 enable inputs (G1, G2A\', G2B\') and 8 active-LOW outputs (Y0\' to Y7\').',
    schematicType: 'decoder_74138',
    tags: ['74138', '3:8 Decoder', 'Demultiplexer', 'Active-LOW'],
    academicNote:
      'Active-LOW outputs interface seamlessly with TTL chip select lines and common-anode 7-segment displays.',
    icCodes: ['74138'],
  },
];
