import { Experiment } from '../types/dsd';

export const LAB_EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    title: "Verification of Logic Gates using MSI Chips",
    shortTitle: "Logic Gates with MSI Chips",
    courseOutcome: "CO1, CO2",
    bloomLevel: "BL2",
    objective: "To verify the truth tables of basic and universal logic gates (AND, OR, NOT, NAND, NOR, XOR) using standard TTL MSI integrated circuits.",
    apparatus: [
      "Digital Trainer Kit (+5V DC power supply, breadboard)",
      "IC 7408 (Quad 2-input AND Gate)",
      "IC 7432 (Quad 2-input OR Gate)",
      "IC 7404 (Hex Inverter NOT Gate)",
      "IC 7400 (Quad 2-input NAND Gate)",
      "IC 7402 (Quad 2-input NOR Gate)",
      "IC 7486 (Quad 2-input XOR Gate)",
      "LED indicators & 330Ω current limiting resistors",
      "SPDT toggle switches & jumper wires"
    ],
    theory: "Digital integrated circuits are categorized into families such as TTL (Transistor-Transistor Logic) and CMOS. Standard 74-series TTL ICs operate on a nominal +5V supply. Pin 14 is customarily VCC (+5V) and Pin 7 is Ground (0V), except for specialized pinouts such as IC 7402 where output gates are reversed. Universal gates (NAND and NOR) can emulate any primitive gate by applying De Morgan's theorems: (A·B)' = A' + B' and (A+B)' = A'·B'.",
    circuitSummary: "Each gate input is tied to a debounced SPDT switch (Logic 0 = GND, Logic 1 = +5V). The gate output is connected to an indicator LED via a 330Ω current limiting resistor.",
    procedure: [
      "Mount the target IC (e.g. 7408) gently over the central divider of the breadboard.",
      "Connect Pin 14 to +5V (VCC) and Pin 7 to GND rail.",
      "Connect Gate 1 inputs (Pin 1 and Pin 2) to two logic input switches A and B.",
      "Connect Gate 1 output (Pin 3) through a 330Ω resistor to the anode of an LED, cathode to GND.",
      "Vary switch inputs across all 4 combinations (00, 01, 10, 11) and record the LED state."
    ],
    observationHeaders: ["Input A", "Input B", "Expected Output Y", "Observed LED Status", "Logic Level"],
    vivaQuestions: [
      {
        question: "Why is NAND called a Universal Gate?",
        answer: "Because any combinational logic function (AND, OR, NOT, XOR, XNOR) can be implemented solely using NAND gates without requiring any other gate type."
      },
      {
        question: "What happens if an input of a TTL 74-series gate is left floating?",
        answer: "An unconnected (floating) TTL input behaves as a logic HIGH (1) because internal multi-emitter transistor base current pulls the input above the V_IH threshold (typically floating at ~1.4V to 1.8V), though leaving it floating is bad practice due to noise sensitivity."
      }
    ]
  },
  {
    id: 2,
    title: "Truth Table Verification of JK and D Flip-Flops using MSI Chips",
    shortTitle: "JK & D Flip-Flops (7476, 7474)",
    courseOutcome: "CO2",
    bloomLevel: "BL2",
    objective: "To analyze and verify the truth table, excitation characteristics, and asynchronous PRESET/CLEAR functions of JK (IC 7476) and D (IC 7474) flip-flops.",
    apparatus: [
      "Digital IC Trainer Kit with single-pulse manual clock",
      "IC 7476 (Dual Master-Slave JK Flip-Flop with Preset & Clear)",
      "IC 7474 (Dual D-Type Positive-Edge-Triggered Flip-Flop)",
      "Logic status LEDs & 330Ω resistors",
      "Connecting wires"
    ],
    theory: "The D flip-flop stores 1 bit of data, sampling the D input at the active clock edge: Q(next) = D. The JK flip-flop refines the SR latch by converting the invalid S=R=1 state into a toggle condition (Q(next) = Q'). IC 7476 uses master-slave dual rank architecture, whereas IC 7474 uses edge-triggered steering gates. Both chips provide active-LOW asynchronous inputs (/PRE and /CLR) that override the synchronous clock.",
    circuitSummary: "IC 7476: VCC=Pin 5, GND=Pin 13. CLK=Pin 1, J=Pin 4, K=Pin 16, /PRE=Pin 2, /CLR=Pin 3, Q=Pin 15, Q'=Pin 14. IC 7474: VCC=Pin 14, GND=Pin 7, CLK=Pin 3, D=Pin 2, /PRE=Pin 4, /CLR=Pin 1, Q=Pin 5, Q'=Pin 6.",
    procedure: [
      "Power the IC with proper VCC and GND connections.",
      "Verify asynchronous behavior: Pull /PRE LOW (while /CLR=HIGH) to force Q=1 immediately. Then pull /CLR LOW to force Q=0.",
      "Set /PRE and /CLR both HIGH (inactive normal operating mode).",
      "For IC 7474, apply D=0, pulse clock: observe Q becomes 0. Apply D=1, pulse clock: observe Q becomes 1.",
      "For IC 7476, test J=0,K=0 (Hold), J=0,K=1 (Reset), J=1,K=0 (Set), and J=1,K=1 (Toggle)."
    ],
    observationHeaders: ["/PRE", "/CLR", "Clock Pulse", "J (or D)", "K", "Q(n)", "Q(n+1)", "Mode"],
    vivaQuestions: [
      {
        question: "What is race-around condition in a JK flip-flop?",
        answer: "When J=1, K=1 and clock pulse width t_p is greater than propagation delay t_pd of the flip-flop, the output toggles multiple times uncontrollably within the same clock pulse. It is prevented using Master-Slave architecture or edge-triggering."
      },
      {
        question: "What is the difference between synchronous and asynchronous inputs?",
        answer: "Synchronous inputs (D, J, K) take effect only on the arrival of the clock edge. Asynchronous inputs (/PRE, /CLR) take effect immediately, independent of clock pulses."
      }
    ]
  },
  {
    id: 3,
    title: "Implementation of MOD-N Asynchronous (Ripple) Counter",
    shortTitle: "MOD-N Ripple Counter",
    courseOutcome: "CO3",
    bloomLevel: "BL3",
    objective: "To design, wire, and test a MOD-6 asynchronous ripple counter using IC 7493 / JK flip-flops by decoding the invalid count (110_2) to trigger asynchronous reset.",
    apparatus: [
      "Digital Trainer with manual clock debouncer & 1Hz oscillator",
      "IC 7493 (4-bit binary ripple counter) or dual IC 7476",
      "IC 7400 (Quad 2-input NAND Gate for reset decoding)",
      "4-channel logic monitor LEDs",
      "Oscilloscope / Logic analyzer probe"
    ],
    theory: "In an asynchronous ripple counter, each flip-flop clock input is driven by the output of the preceding stage. Hence, flip-flop state transitions occur sequentially, rippling through the chain. To construct a MOD-N counter from a 4-bit binary counter, the binary count N is detected using a gate (NAND gate for active-LOW clear or direct pins R0(1), R0(2) on 7493). For MOD-6, N=6 = 0110_2 (QC=1, QB=1). Connecting QC and QB to the reset pins clears the counter immediately to 0000 upon reaching 6, yielding states 0 through 5.",
    circuitSummary: "IC 7493: Connect QA (pin 12) to CKB (pin 1) to enable 4-bit counting. Connect QB (pin 9) to R0(1) (pin 2) and QC (pin 8) to R0(2) (pin 3). Clock pulses applied to CKA (pin 14).",
    procedure: [
      "Connect IC 7493 Pin 5 to +5V and Pin 10 to GND.",
      "Bridge QA (Pin 12) to CKB (Pin 1) with a jumper wire.",
      "Route QB (Pin 9) to Reset Pin 2, and QC (Pin 8) to Reset Pin 3.",
      "Connect QA, QB, QC, QD to LED indicators.",
      "Apply slow clock pulses (1 Hz or manual step) to Pin 14 and observe the state sequence: 000 -> 001 -> 010 -> 011 -> 100 -> 101 -> (resets to 000)."
    ],
    observationHeaders: ["Clock Pulse #", "QD (MSB)", "QC", "QB", "QA (LSB)", "Decimal Count", "State Description"],
    vivaQuestions: [
      {
        question: "Why does an asynchronous ripple counter produce glitch spikes at high frequencies?",
        answer: "Because each flip-flop introduces a propagation delay t_pd. During transitions where multiple bits flip (e.g. 011 to 100), intermediate transient states momentarily appear on the output lines before settling."
      },
      {
        question: "What is the maximum operating frequency of an n-bit ripple counter?",
        answer: "f_max = 1 / (n · t_pd), where t_pd is the propagation delay of each individual flip-flop."
      }
    ]
  },
  {
    id: 4,
    title: "Implementation of MOD-N Synchronous Counter using Flip-Flops",
    shortTitle: "MOD-N Synchronous Counter",
    courseOutcome: "CO3",
    bloomLevel: "BL3",
    objective: "To design, synthesize, and verify a 3-bit Synchronous Up-Counter (MOD-8) using JK / T flip-flops with simultaneous clocking.",
    apparatus: [
      "Digital Trainer Kit",
      "Two IC 7476 (Dual JK Master-Slave Flip-Flops)",
      "IC 7408 (AND gate for steering carry logic)",
      "Logic monitor LEDs & hookup wires"
    ],
    theory: "In a synchronous counter, all flip-flop clock terminals are connected in parallel to a single master clock source. Every flip-flop triggers concurrently. For a 3-bit synchronous up-counter: FF0 toggles every clock (J0=1, K0=1). FF1 toggles when Q0=1 (J1=K1=Q0). FF2 toggles when both Q0=1 and Q1=1 (J2=K2=Q0·Q1). This parallel clocking eliminates cumulative ripple delay.",
    circuitSummary: "Connect CLK of all 3 flip-flops together. FF0: J0=K0=+5V. FF1: J1=K1=Q0. FF2: J2=K2=Q0·Q1 (via 7408 AND gate). Outputs Q0, Q1, Q2 to LEDs.",
    procedure: [
      "Wire the common clock line to all flip-flop clock pins.",
      "Tie J0 and K0 to logic HIGH (+5V).",
      "Route Q0 to J1 and K1.",
      "Feed Q0 and Q1 into IC 7408 AND gate; connect gate output to J2 and K2.",
      "Step the clock pulse and record the sequence from 000 to 111."
    ],
    observationHeaders: ["Clock Pulse", "Q2", "Q1", "Q0", "Decimal Value", "FF Inputs (J2K2, J1K1, J0K0)"],
    vivaQuestions: [
      {
        question: "Why are synchronous counters preferred over asynchronous counters in high-speed digital systems?",
        answer: "Because all flip-flops switch at the exact same clock edge, meaning the overall delay is only one flip-flop propagation delay plus gate delay, rather than the sum of all flip-flop delays."
      }
    ]
  },
  {
    id: 5,
    title: "Implementation of Ring Counter & Twisted Ring (Johnson) Counter",
    shortTitle: "Ring & Johnson Counters",
    courseOutcome: "CO4",
    bloomLevel: "BL3",
    objective: "To implement and contrast the state sequences, decoding requirements, and state efficiency of an n-bit Ring Counter versus a Johnson Counter.",
    apparatus: [
      "IC 7474 (Dual D Flip-Flops) or IC 74194 Universal Shift Register",
      "IC 7404 (Hex Inverter for feedback inversion)",
      "4 Logic Indicator LEDs",
      "Manual debounced clock source"
    ],
    theory: "A Ring Counter connects the output of the last stage (QD) back to the serial input of the first stage (D0). It requires initialization to a single circulating 1 (e.g. 1000). For an n-bit ring counter, there are n valid states. A Johnson Counter (Twisted-Ring Counter) feeds back the inverted output (QD') to D0. It is self-initializing from 0000 and produces 2n states with single-bit Gray-code-like Hamming transitions.",
    circuitSummary: "Ring: D0 = QD (circulates 1000 -> 0100 -> 0010 -> 0001). Johnson: D0 = QD' (sequence: 0000 -> 1000 -> 1100 -> 1110 -> 1111 -> 0111 -> 0011 -> 0001 -> 0000).",
    procedure: [
      "Wire 4 D flip-flops in cascade: Q0 to D1, Q1 to D2, Q2 to D3.",
      "For Ring Counter: Wire Q3 back to D0. Preset FF0 to 1 and Clear FF1, FF2, FF3 to 0.",
      "Pulse clock and record states.",
      "For Johnson Counter: Wire Q3' back to D0. Clear all flip-flops to 0000.",
      "Pulse clock 8 times and observe the complete 8-state sequence."
    ],
    observationHeaders: ["Step #", "Q3", "Q2", "Q1", "Q0", "Counter Type", "Active Mode"],
    vivaQuestions: [
      {
        question: "How many unused states exist in a 4-bit Ring Counter vs a 4-bit Johnson Counter?",
        answer: "A 4-bit counter has 2^4 = 16 total states. Ring counter uses 4 states (12 unused). Johnson counter uses 2n = 8 states (8 unused)."
      }
    ]
  },
  {
    id: 6,
    title: "Implementation of Shift Registers using Flip-Flops",
    shortTitle: "Shift Registers (SISO, SIPO, PISO, PIPO)",
    courseOutcome: "CO4",
    bloomLevel: "BL3",
    objective: "To construct and analyze serial and parallel data transfer mechanisms: Serial-In Serial-Out (SISO), Serial-In Parallel-Out (SIPO), and Parallel-In Parallel-Out (PIPO).",
    apparatus: [
      "Two IC 7474 (Dual D Flip-Flops)",
      "4 SPDT logic switches for parallel load",
      "4 LED indicators for Q0-Q3 outputs",
      "Single-pulse debounced clock generator"
    ],
    theory: "Shift registers are sequential networks used for data storage, bit serialization/deserialization, and arithmetic shift multiplications/divisions. In SISO/SIPO, bits enter serially into D0 on successive clock ticks. In PIPO, data words are presented simultaneously to all D inputs and latched in a single clock cycle.",
    circuitSummary: "Cascade 4 D flip-flops with synchronous common clock. Connect Q_n to D_{n+1} for serial shifting.",
    procedure: [
      "Configure flip-flops in serial cascade.",
      "Apply serial bit stream (e.g. 1, 0, 1, 1) to D0, pulsing clock after each bit.",
      "Observe how bits shift across the LED array.",
      "Verify that after 4 clocks, the entire nibble appears on parallel outputs (SIPO)."
    ],
    observationHeaders: ["Clock Pulse", "Serial In (D0)", "Q0", "Q1", "Q2", "Q3", "Serial Out"],
    vivaQuestions: [
      {
        question: "How many clock cycles are needed to load and retrieve an n-bit word in SISO?",
        answer: "It requires n clock pulses to shift the data in serially, and n clock pulses to shift the data out serially (total 2n pulses for distinct write-read cycles, or n pulses for pipelined shift)."
      }
    ]
  },
  {
    id: 7,
    title: "Design Full Adder / Full Subtractor using Verilog HDL",
    shortTitle: "Verilog Full Adder & Subtractor",
    courseOutcome: "CO5",
    bloomLevel: "BL4",
    objective: "To write, synthesize, and simulate behavioral and dataflow Verilog HDL modules for 1-bit and 4-bit Full Adders and Full Subtractors.",
    apparatus: [
      "Client-side Verilog RTL Simulator",
      "Verilog HDL Syntax Viewer & Testbench generator"
    ],
    theory: "A Full Adder computes Sum = A ⊕ B ⊕ Cin and Cout = A·B + Cin·(A ⊕ B). A Full Subtractor computes Difference = A ⊕ B ⊕ Bin and Bout = A'·B + Bin·(A ⊕ B)'. In Verilog, dataflow modeling uses continuous assignment `assign {Cout, Sum} = A + B + Cin;` while behavioral modeling uses `always @(*)`. ",
    circuitSummary: "Verilog module takes 3 single-bit inputs (a, b, cin) and produces 2 single-bit outputs (sum, cout).",
    procedure: [
      "Review Verilog module definition and port declarations.",
      "Execute simulation testbench across all 8 input vectors (000 to 111).",
      "Verify that Sum and Cout match expected arithmetic additions.",
      "Inspect generated RTL gate schematic."
    ],
    observationHeaders: ["Test Vector", "Input A", "Input B", "Cin / Bin", "Sum / Diff", "Cout / Bout"],
    vivaQuestions: [
      {
        question: "What is the difference between `assign` and `always @(*)` in Verilog?",
        answer: "`assign` represents continuous dataflow assignment for net types (wire), whereas `always @(*)` represents procedural combinational assignment driving register types (reg)."
      }
    ]
  },
  {
    id: 8,
    title: "Design and Simulation of 3:8 Decoder using Verilog HDL",
    shortTitle: "Verilog 3:8 Decoder",
    courseOutcome: "CO5",
    bloomLevel: "BL4",
    objective: "To model and simulate a 3-to-8 line binary decoder with active-HIGH enable in Verilog HDL.",
    apparatus: [
      "Client-side Verilog RTL Simulator",
      "Interactive 3-bit binary input switchboard"
    ],
    theory: "A 3:8 decoder converts a 3-bit binary code (A, B, C) into 8 discrete minterm output lines (Y0 to Y7). When Enable = 1, exactly one output corresponding to the binary value of the input goes HIGH (e.g. for input 011_2 = 3, Y3 = 1). When Enable = 0, all outputs are LOW. Verilog `case` statement or shift operator `1 << in` provides clean synthesis.",
    circuitSummary: "Inputs: en, in[2:0]; Output: out[7:0]. When en=1, out = (8'b00000001 << in); else out = 8'b0.",
    procedure: [
      "Load the 3:8 Decoder Verilog module in the simulator.",
      "Toggle Enable to 1.",
      "Step input vector from 3'b000 to 3'b111.",
      "Observe the single active-HIGH output walking from Y[0] to Y[7]."
    ],
    observationHeaders: ["Enable (E)", "In[2] (A)", "In[1] (B)", "In[0] (C)", "Active Output Bit", "Binary Word Y[7:0]"],
    vivaQuestions: [
      {
        question: "How can a 3:8 decoder be used to implement arbitrary Boolean logic functions?",
        answer: "Since the decoder generates all 8 canonical minterms (m0 to m7), any Boolean function in sum-of-minterms form can be implemented by OR-ing together the corresponding minterm outputs."
      }
    ]
  },
  {
    id: 9,
    title: "Simulation of Basic Flip-Flops using Verilog HDL",
    shortTitle: "Verilog Basic Flip-Flops (D, JK, T)",
    courseOutcome: "CO5",
    bloomLevel: "BL4",
    objective: "To write behavioral Verilog code for D, JK, and T flip-flops with positive edge clocking and asynchronous active-LOW resets.",
    apparatus: [
      "Client-side Verilog RTL Simulator",
      "Interactive waveform monitor"
    ],
    theory: "Sequential logic in Verilog is modeled using `always @(posedge clk or negedge rst_n)` blocks. Non-blocking assignments (`<=`) MUST be used for sequential logic to prevent race conditions during synchronous register updates.",
    circuitSummary: "Flip-flop module sensitivity list: `always @(posedge clk or negedge rst_n) begin if (!rst_n) q <= 1'b0; else ... end`",
    procedure: [
      "Select target flip-flop (D, JK, or T).",
      "Apply reset pulse: confirm q resets to 0.",
      "Set input controls (D=1, or J=1,K=0, etc.).",
      "Click Clock Pulse to trigger positive clock edge; observe state update."
    ],
    observationHeaders: ["Clock Edge", "Reset_n", "Inputs", "Current State Q", "Next State Q+", "Action"],
    vivaQuestions: [
      {
        question: "Why must non-blocking `<=` assignments be used for sequential always blocks?",
        answer: "Non-blocking assignments evaluate right-hand sides concurrently and schedule updates at the end of the simulation time step, accurately modeling physical synchronous register transfers without sequential order dependencies."
      }
    ]
  },
  {
    id: 10,
    title: "Design and Simulation of 4-bit Up/Down Counter using Verilog HDL",
    shortTitle: "Verilog 4-Bit Up/Down Counter",
    courseOutcome: "CO5",
    bloomLevel: "BL4",
    objective: "To model a 4-bit synchronous binary up/down counter with loadable presets, synchronous enable, and direction control in Verilog HDL.",
    apparatus: [
      "Client-side Verilog RTL Simulator",
      "4-channel logic timing viewer"
    ],
    theory: "An up/down counter synthesizes adder/subtractor logic driven by a direction flag `up_down`. In Verilog: `always @(posedge clk or negedge rst_n) begin if (!rst_n) count <= 4'd0; else if (load) count <= data_in; else if (en) count <= up_down ? (count + 1'b1) : (count - 1'b1); end`",
    circuitSummary: "4-bit output bus count[3:0], terminal count TC output when reaching 15 (up) or 0 (down).",
    procedure: [
      "Enable counter: `en = 1`.",
      "Set `up_down = 1` and clock 5 cycles: observe count incrementing 0, 1, 2, 3, 4, 5.",
      "Switch `up_down = 0` and clock 3 cycles: observe count decrementing 5, 4, 3, 2."
    ],
    observationHeaders: ["CLK Cycle", "RST_n", "EN", "UP/DOWN", "Count[3:0] (Hex)", "Terminal Count (TC)"],
    vivaQuestions: [
      {
        question: "What happens when the counter reaches 15 in UP mode or 0 in DOWN mode?",
        answer: "The counter naturally rolls over to 0 (in UP mode) or 15 (in DOWN mode) due to 4-bit overflow modulo arithmetic (2^4 = 16)."
      }
    ]
  },
  {
    id: 11,
    title: "Real-Time Application: Security Door Magnetic Sensor with Latching Alarm",
    shortTitle: "Exp 11: Real-Time Security Door Alarm",
    courseOutcome: "CO2",
    bloomLevel: "BL3",
    objective: "To design and implement a real-world digital security door monitoring circuit using a magnetic reed switch sensor, an active-LOW latching flip-flop memory element, an authorized guard reset key, and an alarm siren strobe.",
    apparatus: [
      "Magnetic Door Contact Reed Switch (Simulated Sensor: 0 = Door Closed, 1 = Door Opened)",
      "IC 7474 D Flip-Flop (configured as Set-Dominant Latch) or IC 7400 cross-coupled NAND SR Latch",
      "Pulsing 12V / 5V Audio Siren Strobe Alarm indicator",
      "Authorized Key Switch / Guard Reset Pushbutton",
      "Pull-up resistors & debounce RC network"
    ],
    theory: "In facility access control, when an unauthorized door opens, the magnetic contact breaks, sending a momentary HIGH pulse (Sensor = 1). If the intruder quickly slams the door shut, Sensor returns to 0. A purely combinational circuit would shut off the alarm immediately, allowing the intruder to escape unnoticed! A sequential memory element (latch/flip-flop) is strictly required: the initial pulse latches Q = 1 (Alarm ON). The output remains latched HIGH indefinitely—even after the sensor returns to 0—until an authorized security officer manually toggles the physical Guard Reset button.",
    circuitSummary: "Sensor is tied to the SET input of the SR latch (or Clock/D of 7474 with D tied to +5V). Guard Reset is tied to the active-LOW CLEAR / RESET input. Output Q drives the Alarm Siren driver transistor.",
    procedure: [
      "Initialize circuit: Click 'Guard Reset' button. Observe Alarm is OFF (Q = 0, LED green standby).",
      "Simulate Door Opening: Click 'Open Security Door' switch (Sensor = 1).",
      "Observe Alarm triggers instantly (Q = 1, Pulsing Red Siren Strobe activates).",
      "Simulate Door Closing: Click 'Close Security Door' (Sensor = 0).",
      "Notice that despite the door being shut, the Alarm REMAINS ON continuously due to sequential memory latching!",
      "Click 'Authorized Guard Reset Key' to silence the alarm and return system to Armed Standby."
    ],
    observationHeaders: ["Door State", "Magnetic Sensor", "Guard Reset Key", "Latch State Q", "Alarm Siren Strobe", "Security Verdict"],
    vivaQuestions: [
      {
        question: "Why cannot a simple combinational AND or OR gate be used for this security door system?",
        answer: "Because combinational logic outputs depend solely on the current inputs. If an intruder opens the door and immediately shuts it, a combinational output would return to 0, clearing the alarm. A sequential flip-flop stores the breach event permanently in its internal state."
      },
      {
        question: "How is switch bounce eliminated on the physical magnetic reed switch?",
        answer: "By using an RC low-pass filter with a Schmitt-trigger inverter (e.g. 7414) or a cross-coupled NAND latch debouncer."
      }
    ]
  },
  {
    id: 12,
    title: "Real-Time State Machine: Sequence Detector for Pattern '1011'",
    shortTitle: "Exp 12: Sequence Detector '1011' FSM",
    courseOutcome: "CO2, CO4",
    bloomLevel: "BL4",
    objective: "To design, synthesize state transition diagrams, and simulate a clocked Mealy Sequence Detector that recognizes serial bitstream pattern '1011' with both overlapping and non-overlapping tracking.",
    apparatus: [
      "Serial Bitstream Generator (interactive bit input)",
      "Two IC 7476 JK Flip-Flops or IC 7474 D Flip-Flops",
      "Combinational next-state decoding gates (7408, 7432, 7404)",
      "Sequence Detection pulse LED indicator"
    ],
    theory: "A sequence detector inspects an incoming serial bitstream X and outputs Z = 1 whenever the target sequence (1011) has been received. In an overlapping detector, the last bit '1' of the sequence can serve as the first bit '1' of the subsequent target sequence (e.g. 1011011 detects at index 4 and index 7). In a non-overlapping detector, state resets to S0 after full match.",
    circuitSummary: "Mealy Machine: 4 states: S0 (Reset/Idle), S1 (Got '1'), S2 (Got '10'), S3 (Got '101'). When in S3 and input X=1, output Z=1 immediately during that clock pulse!",
    procedure: [
      "Select mode: 'Overlapping' or 'Non-Overlapping'.",
      "Inject serial bits one by one using the 0 and 1 input buttons.",
      "Trace state transitions on the live FSM graph: S0 -> S1 -> S2 -> S3 -> S1 (with output Z=1).",
      "Verify that bitstream '1 0 1 1 0 1 1' produces detection pulses at expected positions."
    ],
    observationHeaders: ["Clock #", "Input Bit X", "Current State", "Next State", "Output Pulse Z", "Detector Status"],
    vivaQuestions: [
      {
        question: "What is the key difference in state count between Mealy and Moore sequence detectors for an n-bit sequence?",
        answer: "A Mealy detector requires n states to detect an n-bit sequence because its output depends on current state and current input. A Moore detector requires n+1 states because the output depends solely on current state, needing an extra state to signify pattern matched."
      }
    ]
  },
  {
    id: 13,
    title: "Section IX Mini-Project: Beverage Vending Machine FSM",
    shortTitle: "Mini-Project: Vending Machine FSM",
    courseOutcome: "CO4",
    bloomLevel: "BL4",
    objective: "To design, model, and simulate an Algorithmic State Machine (ASM) for a real-time beverage vending machine accepting ₹5, ₹10, and ₹20 coins, dispensing a ₹15 beverage, and providing change return.",
    apparatus: [
      "Coin Slot Sensors (₹5, ₹10, ₹20 coin inputs)",
      "Beverage Dispenser Solenoid Actuator (Dispense signal)",
      "Change Return Solenoid (₹5 change refund)",
      "Digital LED Display showing current credit",
      "Cancel Transaction Pushbutton"
    ],
    theory: "Real-time vending machines are quintessential FSM applications. The machine maintains internal accumulated balance states: S0 (₹0), S5 (₹5), S10 (₹10), S15 (₹15 - Dispense without change), S20 (₹20 - Dispense with ₹5 change). When balance reaches ₹15, the dispense solenoid fires. If a ₹20 note/coin was inserted from S0, it dispenses the drink and returns ₹5 change simultaneously.",
    circuitSummary: "States: S0, S5, S10, S15, S20. Outputs: Dispense Beverage (D), Return ₹5 Change (C5), Credit Display (₹).",
    procedure: [
      "Start at S0 with balance ₹0.",
      "Click 'Insert ₹5' or 'Insert ₹10' coin buttons.",
      "Observe the FSM state advance and credit update.",
      "When balance reaches or exceeds ₹15, observe the beverage dispensing animation and change return indicator.",
      "Test 'Cancel / Refund' button to verify that inserted coins are refunded immediately."
    ],
    observationHeaders: ["Step #", "Coin Input", "Previous Balance", "New Balance", "Dispense Output", "Change Returned"],
    vivaQuestions: [
      {
        question: "How does the ASM chart represent conditional outputs during coin insertion?",
        answer: "The ASM chart utilizes an oval Conditional Output Box connected to the path of a Decision Box (diamond), executing the output action only when that specific coin condition is satisfied in the current state."
      }
    ]
  }
];
