import { QuizQuestion, ChallengeBench } from '../types/dsd';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "In a standard TTL NAND gate with a Totem-Pole output stage (Q3 pull-up, Q4 pull-down), what is the function of the diode (D) placed in series with the collector of Q4 and emitter of Q3?",
    options: [
      "To increase the fan-out capability to more than 20 gates",
      "To prevent both Q3 and Q4 from conducting simultaneously when the output transitions from LOW to HIGH",
      "To provide reverse-bias protection against negative transient spikes",
      "To act as a pull-down current sink for high capacitance loads"
    ],
    correctIndex: 1,
    co: "CO3",
    bloomLevel: "BL2",
    explanation: "Without the diode, when the output is transitioning or in HIGH state, the base-emitter voltage drops of Q3 and Q2 could allow Q3 and Q4 to be partially ON at the same time, causing a dangerous direct current surge from VCC to GND. The diode adds a 0.7V forward drop, ensuring Q3 is reliably OFF when Q4 is saturated."
  },
  {
    id: 2,
    question: "When interfacing a standard 74-series TTL output to a 74HC CMOS input operating at VCC = 5V, why is a pull-up resistor strictly required?",
    options: [
      "TTL output sink current I_OL is too small to discharge the CMOS input capacitance",
      "TTL minimum HIGH output voltage V_OH(min) is 2.4V, which is lower than the CMOS minimum HIGH input threshold V_IH(min) of 3.5V (0.7 · VCC)",
      "CMOS input gate oxide breakdown will occur if connected directly to TTL without current limiting",
      "TTL propagation delay t_pd is slower than CMOS, causing race conditions"
    ],
    correctIndex: 1,
    co: "CO3",
    bloomLevel: "BL3",
    explanation: "For 74HC CMOS at 5V, V_IH(min) = 0.7 · 5V = 3.5V. However, a standard TTL gate guarantees V_OH(min) of only 2.4V! Thus, 2.4V falls squarely into the indeterminate, undefined logic region of CMOS. Adding a pull-up resistor (e.g. 10kΩ) to +5V pulls the voltage safely up to ~4.9V."
  },
  {
    id: 3,
    question: "A 4-bit asynchronous ripple counter is built using negative-edge triggered flip-flops with each stage having a propagation delay of t_pd = 25 ns. What is the maximum clock frequency f_max for reliable operation?",
    options: [
      "40 MHz",
      "20 MHz",
      "10 MHz",
      "2.5 MHz"
    ],
    correctIndex: 2,
    co: "CO1",
    bloomLevel: "BL3",
    explanation: "In an n-bit asynchronous ripple counter, the cumulative propagation delay across all 4 stages is T_total = n · t_pd = 4 · 25 ns = 100 ns. The clock period T_clk must be >= 100 ns, so f_max = 1 / 100 ns = 10 MHz."
  },
  {
    id: 4,
    question: "What distinguishes a Programmable Array Logic (PAL) device from a Programmable Logic Array (PLA) device?",
    options: [
      "PAL has a programmable AND array and a programmable OR array; PLA has fixed arrays",
      "PAL has a programmable AND array and a fixed OR array; PLA has both programmable AND and programmable OR arrays",
      "PAL has a fixed AND array and a programmable OR array; PLA has programmable AND array only",
      "PAL is implemented strictly in CMOS, whereas PLA is implemented strictly in TTL"
    ],
    correctIndex: 1,
    co: "CO3",
    bloomLevel: "BL1",
    explanation: "PAL (Programmable Array Logic) features a programmable AND array feeding into a fixed OR array (making it simpler and faster). PLA (Programmable Logic Array) allows both the AND array and the OR array to be programmed, offering maximum logic sharing flexibility."
  },
  {
    id: 5,
    question: "In sequential circuit design, why does a Master-Slave JK flip-flop eliminate the race-around condition that plagues level-triggered JK flip-flops when J=1 and K=1?",
    options: [
      "The Master and Slave are clocked on opposite clock phases, so feedback from Slave to Master is isolated during state update",
      "The Master section incorporates internal Schmitt triggers that filter out oscillations",
      "The Slave section uses non-inverting tri-state buffers",
      "The feedback loop is broken by a low-pass RC delay filter"
    ],
    correctIndex: 0,
    co: "CO1",
    bloomLevel: "BL2",
    explanation: "When CLK = 1, the Master is active and accepts inputs J and K while the Slave is disabled. When CLK drops to 0, the Master is disabled (inputs isolated) and the Slave is enabled, transferring the Master state to the outputs. Because the feedback path is never active while the Master is sampling, race-around is eliminated."
  },
  {
    id: 6,
    question: "You need to design a MOD-6 counter using the 4-bit binary ripple counter IC 7493. To which pins of the IC should you route outputs QB and QC to trigger automatic truncation?",
    options: [
      "Connect QB and QC to Clock inputs CKA and CKB",
      "Connect QB and QC to Master Reset inputs R0(1) and R0(2)",
      "Connect QB and QC through an OR gate to VCC",
      "Connect QB and QC to Master Set inputs R9(1) and R9(2)"
    ],
    correctIndex: 1,
    co: "CO2",
    bloomLevel: "BL3",
    explanation: "For MOD-6, the counter must count states 0, 1, 2, 3, 4, 5 and reset when reaching binary 6 (0110_2, where QC=1, QB=1). The 7493 provides internal dual active-HIGH reset inputs R0(1) and R0(2) that are internally ANDed. Connecting QB to R0(1) and QC to R0(2) immediately resets the counter to 0000 upon reaching count 6."
  },
  {
    id: 7,
    question: "In the Implication Table method for state reduction, when is a cell corresponding to state pair (Si, Sj) immediately marked with a cross (×)?",
    options: [
      "When the next states under any input are equal",
      "When states Si and Sj produce different outputs for the same input condition",
      "When both states transition to themselves",
      "When neither state has a transition for input 0"
    ],
    correctIndex: 1,
    co: "CO4",
    bloomLevel: "BL3",
    explanation: "Two states cannot be equivalent if they produce different outputs for identical input stimuli. Hence, if Output(Si, x) ≠ Output(Sj, x) for any input x, they are strictly incompatible and their intersection cell in the implication chart is crossed out with an ×."
  },
  {
    id: 8,
    question: "What is the primary architectural difference between a Mealy machine and a Moore machine?",
    options: [
      "Mealy outputs depend on current state only; Moore outputs depend on current state and current inputs",
      "Mealy outputs depend on current state AND current inputs; Moore outputs depend strictly on the current state",
      "Mealy machines cannot have feedback loops, whereas Moore machines require dual clocks",
      "Mealy machines require more states than Moore machines to detect the same bit sequence"
    ],
    correctIndex: 1,
    co: "CO4",
    bloomLevel: "BL1",
    explanation: "By definition: In a Mealy machine, output Z = λ(State, Input), responding asynchronously to input changes within the clock cycle. In a Moore machine, output Z = λ(State), remaining steady and changing only upon state transitions at active clock edges."
  },
  {
    id: 9,
    question: "In Verilog HDL, what will occur if you use blocking assignments (=) instead of non-blocking assignments (<=) when modeling cascaded shift registers in an `always @(posedge clk)` block?",
    options: [
      "The synthesis tool will throw a fatal syntax error and refuse to compile",
      "The simulator will execute statements sequentially, causing all registers to take the value of the first stage in a single clock tick instead of shifting sequentially",
      "The registers will oscillate between 0 and 1 continuously",
      "The synthesis tool will infer latches instead of edge-triggered D flip-flops"
    ],
    correctIndex: 1,
    co: "CO5",
    bloomLevel: "BL4",
    explanation: "Blocking assignments (=) execute sequentially in procedural order. If written as `q1 = d; q2 = q1; q3 = q2;`, `q2` and `q3` will immediately capture the newly updated `q1` value in the exact same time step, collapsing the multi-stage shift register into a single wire. Non-blocking (<=) updates all registers concurrently at the end of the time step."
  },
  {
    id: 10,
    question: "Consider a 4-bit Ring Counter initialized to 1000 versus a 4-bit Johnson (Twisted-Ring) Counter initialized to 0000. How many distinct timing states does each counter cycle through?",
    options: [
      "Ring Counter: 16 states; Johnson Counter: 16 states",
      "Ring Counter: 4 states; Johnson Counter: 8 states",
      "Ring Counter: 8 states; Johnson Counter: 4 states",
      "Ring Counter: 4 states; Johnson Counter: 16 states"
    ],
    correctIndex: 1,
    co: "CO1",
    bloomLevel: "BL3",
    explanation: "An n-bit Ring Counter has n valid states (for n=4, 4 states: 1000, 0100, 0010, 0001). A Johnson Counter with twisted feedback (D0 = QD') generates 2n valid states (for n=4, 2·4 = 8 states)."
  },
  {
    id: 11,
    question: "Which of the following Verilog code snippets correctly describes a positive-edge triggered D flip-flop with asynchronous active-LOW reset?",
    options: [
      "always @(posedge clk) if (rst_n) q <= d; else q <= 0;",
      "always @(posedge clk or negedge rst_n) begin if (!rst_n) q <= 1'b0; else q <= d; end",
      "assign q = (!rst_n) ? 1'b0 : (clk ? d : q);",
      "always @(clk or rst_n) if (rst_n == 0) q = 0; else if (clk == 1) q = d;"
    ],
    correctIndex: 1,
    co: "CO5",
    bloomLevel: "BL4",
    explanation: "For asynchronous active-LOW reset, the sensitivity list must include `negedge rst_n` alongside `posedge clk`. Inside the block, `if (!rst_n)` executes immediately when reset goes LOW without waiting for a clock edge."
  },
  {
    id: 12,
    question: "In the IC 74194 Universal Shift Register, what operation is performed when mode select pins are set to S1 = 1 and S0 = 1?",
    options: [
      "Shift Right (serial input into QA)",
      "Shift Left (serial input into QD)",
      "Parallel Load (simultaneous loading of inputs A, B, C, D into QA, QB, QC, QD)",
      "Inhibit Clock (Hold current state)"
    ],
    correctIndex: 2,
    co: "CO2",
    bloomLevel: "BL3",
    explanation: "The 74194 mode decode is: S1S0 = 00 is Inhibit (Hold), S1S0 = 01 is Shift Right, S1S0 = 10 is Shift Left, and S1S0 = 11 is Synchronous Parallel Load."
  },
  {
    id: 13,
    question: "In an Algorithmic State Machine (ASM) chart, what is the role of an oval-shaped Conditional Output Box?",
    options: [
      "To specify state assignments and clock frequencies",
      "To represent Mealy-type outputs that are asserted only when a particular decision path condition is TRUE during that state",
      "To generate unconditional Moore outputs that remain asserted throughout the entire state duration",
      "To evaluate multi-variable Boolean equations for branch transitions"
    ],
    correctIndex: 1,
    co: "CO4",
    bloomLevel: "BL3",
    explanation: "In standard ASM chart notation: Rectangle = State Box (Moore outputs), Diamond = Decision Box (condition test), and Oval/Rounded Rectangle = Conditional Output Box (Mealy outputs that depend on both the state and the decision condition)."
  },
  {
    id: 14,
    question: "What is the Speed-Power Product (SPP) of a logic gate with a propagation delay of 10 ns and a power dissipation of 2 mW?",
    options: [
      "5 pJ",
      "20 pJ",
      "0.2 pJ",
      "200 nJ"
    ],
    correctIndex: 1,
    co: "CO3",
    bloomLevel: "BL3",
    explanation: "Speed-Power Product = Propagation Delay × Power Dissipation = (10 × 10^-9 s) × (2 × 10^-3 W) = 20 × 10^-12 Joules = 20 pJ (picojoules)."
  },
  {
    id: 15,
    question: "For a real-time magnetic door sensor where opening the door gives Sensor = 1, why must the alarm output latch using a flip-flop rather than an AND gate?",
    options: [
      "Flip-flops consume less static power than discrete AND gates",
      "If the door is opened and swiftly shut, an AND gate output drops back to 0, whereas a flip-flop retains the breach in memory until manually cleared by a guard",
      "AND gates cannot interface with magnetic reed switch sensor voltages",
      "A latch provides automatic frequency division for the siren audio pitch"
    ],
    correctIndex: 1,
    co: "CO2",
    bloomLevel: "BL3",
    explanation: "Intruders routinely open and immediately re-close doors. Combinational logic has zero memory; as soon as Sensor returns to 0, combinational alarm output turns off. A flip-flop or latch possesses internal feedback state, holding Alarm = 1 indefinitely until authorized reset."
  },
  {
    id: 16,
    question: "How many flip-flops are required to design a synchronous counter that counts from 0 to 25?",
    options: [
      "4 flip-flops",
      "5 flip-flops",
      "6 flip-flops",
      "26 flip-flops"
    ],
    correctIndex: 1,
    co: "CO1",
    bloomLevel: "BL3",
    explanation: "To represent numbers up to 25, 2^n >= 26 (states 0 to 25). For n=4, 2^4 = 16 < 26 (insufficient). For n=5, 2^5 = 32 >= 26. Hence, exactly 5 flip-flops are required."
  },
  {
    id: 17,
    question: "In a Mealy sequence detector for sequence '1011' with overlapping allowed, what state does the machine transition to from state S3 (received '101') when the next input bit is '1'?",
    options: [
      "Resets to S0 with output Z=0",
      "Transitions to S1 with output Z=1, because the last two bits '11' can overlap with the start of the next sequence",
      "Remains in S3 with output Z=1 indefinitely",
      "Halts the system until an external reset pulse is provided"
    ],
    correctIndex: 1,
    co: "CO4",
    bloomLevel: "BL4",
    explanation: "In state S3 ('101'), when bit '1' arrives, sequence '1011' is completed, so output Z = 1. In overlapping mode, the final '1' serves as the first '1' of a possible new '1011' pattern. State S1 represents 'got 1', so the machine transitions to S1 with Z=1."
  },
  {
    id: 18,
    question: "Which Verilog statement represents a continuous assignment that models a 4:1 multiplexer with inputs d[3:0] and select sel[1:0]?",
    options: [
      "assign y = d[sel];",
      "always @(sel) y = d[sel];",
      "wire y <= d[sel];",
      "assign y = sel ? d[3:0] : 0;"
    ],
    correctIndex: 0,
    co: "CO5",
    bloomLevel: "BL4",
    explanation: "`assign y = d[sel];` is standard, highly synthesizable dataflow Verilog for a multiplexer, using the 2-bit `sel` bus as a bit-select index on array `d`."
  },
  {
    id: 19,
    question: "When evaluating the Voltage Transfer Characteristic (VTC) of a standard TTL NAND gate, in which region are transistors Q2 and Q4 fully saturated while Q3 is OFF?",
    options: [
      "Region I (V_in < 0.7V, V_out = V_OH)",
      "Region II (Linear transition region)",
      "Region III (Transition knee where Q2 turns ON)",
      "Region IV (V_in >= 1.5V, V_out = V_OL ≈ 0.2V)"
    ],
    correctIndex: 3,
    co: "CO3",
    bloomLevel: "BL4",
    explanation: "In Region IV (HIGH input), base-emitter diodes of input transistor Q1 are reverse-biased, forcing current into the base of phase-splitter Q2 and pull-down Q4. Both saturate, pulling V_out down to V_CE(sat) ≈ 0.2V, while Q3 base voltage is too low to conduct."
  },
  {
    id: 20,
    question: "In a beverage vending machine FSM with states ₹0, ₹5, ₹10, ₹15 (dispense), when the user inserts a ₹20 coin from state ₹0, what should the FSM output?",
    options: [
      "Dispense beverage = 0, Return change = ₹0, retain ₹20 in balance",
      "Dispense beverage = 1, Return change = ₹5, and return to state ₹0",
      "Trigger error strobe and reject the coin",
      "Dispense beverage = 2, Return change = ₹0"
    ],
    correctIndex: 1,
    co: "CO4",
    bloomLevel: "BL4",
    explanation: "For a ₹15 beverage, inserting a ₹20 coin satisfies the purchase price plus an excess of ₹5. The controller immediately asserts the Dispense solenoid (D=1), activates the ₹5 change return solenoid (C5=1), and clears the credit accumulator to state ₹0 (S0)."
  }
];

export const CHALLENGE_BENCHES: ChallengeBench[] = [
  {
    id: 1,
    title: "IC 7408 AND Gate Activation",
    co: "CO1, CO2",
    scenario: "You are wiring a safety interlock circuit using IC 7408 Quad 2-Input AND gate. Both Operator Shield (Switch A) and Foot Pedal (Switch B) must be engaged to activate the motor drill (LED Output Y).",
    objective: "Configure the dual toggle switches so that Output Y transitions to HIGH (1) and illuminates the green indicator.",
    initialState: { switchA: false, switchB: false },
    hint: "An AND gate requires both inputs to be logic 1 (+5V) for output Y to equal 1."
  },
  {
    id: 2,
    title: "IC 7486 XOR Parity Checker",
    co: "CO1, CO2",
    scenario: "A digital communication bus requires an Odd Parity bit. You have three data lines: D0, D1, and D2. Using cascaded XOR gates, generate an active parity alert when an ODD number of 1s are detected.",
    objective: "Toggle the data inputs such that the XOR parity output Y equals 1.",
    initialState: { d0: false, d1: false, d2: false },
    hint: "XOR output is 1 when the sum of HIGH bits is odd (e.g. 1 bit ON or 3 bits ON)."
  },
  {
    id: 3,
    title: "Half-Adder Arithmetic Balance",
    co: "CO1, CO5",
    scenario: "An arithmetic logic unit stage requires adding two 1-bit operands A and B. You need to verify that Sum = 1 while Carry = 0.",
    objective: "Select an input combination where Sum (A ⊕ B) is 1 and Carry (A · B) is 0.",
    initialState: { a: false, b: false },
    hint: "Set exactly one input to 1 (either A=1, B=0 or A=0, B=1)."
  },
  {
    id: 4,
    title: "Fault-Tolerant Majority Consensus (2-of-3)",
    co: "CO3, CO4",
    scenario: "A triple-modular redundant aerospace avionics voting system has 3 temperature sensors (T1, T2, T3). Output must trip if any two or more sensors agree that temperature is critical (HIGH).",
    objective: "Activate any 2 or 3 sensor toggles to achieve quorum and trigger the safety override.",
    initialState: { t1: false, t2: false, t3: false },
    hint: "Majority function: Y = T1·T2 + T2·T3 + T1·T3. At least two switches must be ON."
  },
  {
    id: 5,
    title: "IC 74194 Universal Shift Register Mode Control",
    co: "CO2",
    scenario: "An embedded microprocessor needs to load parallel data (1011) into an IC 74194 Universal Shift Register in a single clock cycle.",
    objective: "Set the mode pins S1 and S0 to the Parallel Load configuration, then trigger the clock pulse.",
    initialState: { s1: 0, s0: 0, parallelData: [1, 0, 1, 1], registerData: [0, 0, 0, 0] },
    hint: "Refer to IC 74194 datasheet: S1=1 and S0=1 commands Synchronous Parallel Load."
  },
  {
    id: 6,
    title: "Master-Slave JK Toggle Flip-Flop",
    co: "CO1, CO2",
    scenario: "To observe how Master-Slave architecture avoids race-around, configure J=1 and K=1, then step through the clock pulse cycle (Rising edge -> High level -> Falling edge -> Low level).",
    objective: "Step the clock pulse to witness Master capturing state on CLK=1 and Slave updating output on CLK=0.",
    initialState: { j: true, k: true, clk: 0, masterQ: 0, slaveQ: 0, step: 0 },
    hint: "Set J=1, K=1, click 'Single Step Clock' to see the two-phase transfer."
  },
  {
    id: 7,
    title: "TTL-to-CMOS Pull-Up Resistor Interface",
    co: "CO3",
    scenario: "A standard TTL gate (V_OH = 2.4V) is driving a 74HC CMOS gate (V_IH threshold = 3.5V). Without a pull-up resistor, the CMOS input floats in the illegal undefined logic region.",
    objective: "Switch IN the 10kΩ pull-up resistor to +5V to elevate V_OH to 4.95V and achieve valid CMOS HIGH.",
    initialState: { pullUpConnected: false, vOut: 2.4 },
    hint: "Click the toggle to connect the 10kΩ resistor between the TTL output and +5V rail."
  }
];
