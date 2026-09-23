import { TheoryModuleDef } from '../../types/course';

export const MODULE_2: TheoryModuleDef = {
  id: 2,
  code: 'MOD-2',
  title: 'Digital Logic Families',
  hours: 6,
  weightageMarks: 20,
  coTarget: 'CO2',
  textbookRef: 'R. P. Jain, "Modern Digital Electronics", 4th Ed., Chapters 4 & 5',
  description:
    'Comprehensive study of digital IC logic families: Transistor-Transistor Logic (TTL), Complementary Metal-Oxide Semiconductor (CMOS), and Emitter-Coupled Logic (ECL). Evaluates key performance metrics, internal circuit structures (Totem-Pole, Open-Collector, Tri-State, CMOS complementary pair, Transmission Gate), and bidirectional voltage/current level interfacing.',
  sections: [
    {
      subtopicId: 'm2-characteristics',
      title: 'Performance Parameters of Logic Families',
      hours: 2,
      summary:
        'Quantitative analysis of digital IC specifications: Propagation delay (tpLH, tpHL), Power dissipation (static vs dynamic Pd = C*V^2*f), Fan-in, Fan-out, Noise Margins (High NMH and Low NML), and Figure of Merit (Speed-Power Product in picojoules). Temperature ranges (commercial 0°C to 70°C vs military -55°C to 125°C).',
      keyFormulasAndConcepts: [
        'High-state Noise Margin: NM_H = V_OH(min) - V_IH(min)',
        'Low-state Noise Margin: NM_L = V_IL(max) - V_OL(max)',
        'Fan-Out (LOW): Fan-Out_L = I_OL(max) / I_IL(max)',
        'Fan-Out (HIGH): Fan-Out_H = I_OH(max) / I_IH(max)',
        'Speed-Power Product (SPP): SPP = t_pd * P_d (expressed in picojoules pJ)',
        'Average Propagation Delay: t_pd = (t_pLH + t_pHL) / 2',
      ],
      examTips: [
        'Always draw the standard 4-voltage level bar diagram showing VOH, VIH, VIL, VOL and mark NMH and NML.',
        'State standard 74xx TTL values: VOH(min)=2.4V, VIH(min)=2.0V, VIL(max)=0.8V, VOL(max)=0.4V -> NMH = 0.4V, NML = 0.4V.',
      ],
    },
    {
      subtopicId: 'm2-ttl-cmos-circuits',
      title: 'TTL & CMOS Internal Circuit Structures',
      hours: 2,
      summary:
        'Circuit operation of Standard TTL 2-input NAND gate with multi-emitter input transistor Q1, phase splitter Q2, and Totem-Pole output stage (Q3, Q4, diode D). Analysis of Open-Collector TTL with external pull-up resistor (wired-AND capability) and Tri-State gates with high-impedance (Z) state. CMOS Inverter, NAND, and NOR circuit operation with PMOS pull-up and NMOS pull-down networks.',
      keyFormulasAndConcepts: [
        'Role of Diode D in Totem-Pole: Prevents both Q3 and Q4 from turning ON simultaneously during LOW-to-HIGH switching.',
        'Wired-AND calculation for Open-Collector pull-up: R_p(max) = (VCC - VOH) / (n*IOH + m*IIH), R_p(min) = (VCC - VOL) / (IOL - m*IIL).',
        'CMOS Inverter: When Vin=HIGH, PMOS is OFF, NMOS is ON -> Vout=0V. When Vin=LOW, PMOS is ON, NMOS is OFF -> Vout=VDD.',
        'CMOS NAND: PMOS in parallel (pull-up), NMOS in series (pull-down). CMOS NOR: PMOS in series, NMOS in parallel.',
      ],
      examTips: [
        'Explain why totem-pole outputs cannot be tied together directly (large current spike burns transistors; creates indeterminate logic level).',
        'State the advantages of CMOS: virtually zero static power consumption, extremely high input impedance (~10^12 ohms), wide supply voltage range (3V-15V).',
      ],
    },
    {
      subtopicId: 'm2-interfacing',
      title: 'Interfacing Logic Families (TTL to CMOS & CMOS to TTL)',
      hours: 2,
      summary:
        'Analysis of electrical incompatibilities between standard TTL (+5V supply) and CMOS (+5V or +3.3V supply). Interfacing TTL driving CMOS requires a pull-up resistor to raise TTL VOH(min) (2.4V) above CMOS VIH(min) (3.5V for 5V supply). CMOS driving TTL requires checking current sinking capacity (IOL of CMOS vs IIL of multiple TTL loads). Level-shifter techniques for 5V to 3.3V mixed-voltage systems.',
      keyFormulasAndConcepts: [
        'Problem: TTL V_OH(min) = 2.4V < CMOS V_IH(min) = 3.5V (at VDD = 5V).',
        'Solution: Connect an external pull-up resistor (1kΩ to 10kΩ) from TTL output to +5V VDD.',
        'Problem: CMOS driving multiple TTL gates. Check if I_OL(CMOS) >= N * I_IL(TTL).',
        'Unused inputs: TTL unused inputs float to logic HIGH but must be tied to VCC via 1kΩ resistor or another active input. CMOS unused inputs MUST NEVER float (must tie to VDD or GND to prevent erratic oscillation and overheating).',
      ],
      examTips: [
        'Draw the interfacing schematic clearly with the pull-up resistor connected between TTL output and VCC.',
        'Never leave CMOS inputs floating due to high gate impedance and susceptibility to electrostatic damage.',
      ],
    },
  ],
  sampleQuestions: [
    {
      marks: 10,
      question:
        'Draw the circuit diagram of a two-input TTL NAND gate with totem-pole output. Explain its working in detail with all four input combinations. What is the role of diode D and transistor Q4?',
      bloom: 'BL4: Analyze',
      solutionOutline:
        'Draw schematic with multi-emitter transistor Q1, phase splitter Q2, pull-up Q3, pull-down Q4, diode D, and 4 resistors. Explain operation when both inputs HIGH (Q1 base-collector forward-biased, Q2 ON, Q4 ON, Vout=VOL=0.2V). Explain operation when either input LOW. Explain function of diode D to prevent simultaneous conduction of Q3 and Q4.',
    },
    {
      marks: 10,
      question:
        'Compare TTL, CMOS, and ECL logic families based on: (a) Propagation delay, (b) Power dissipation, (c) Noise margins, (d) Fan-out, and (e) Speed-Power product.',
      bloom: 'BL5: Evaluate',
      solutionOutline:
        'Construct comparative table. TTL: tpd ~ 10ns, Pd ~ 10mW, NM ~ 0.4V, Fan-out ~ 10, SPP ~ 100pJ. CMOS: tpd ~ 8-30ns, Pd ~ microwatts static, NM ~ 1.5V (30-40% of VDD), Fan-out > 50, SPP ~ 0.1-10pJ. ECL: tpd ~ 1-2ns (fastest, nonsaturating), Pd ~ 25-50mW (highest), NM ~ 0.2V (lowest).',
    },
    {
      marks: 5,
      question:
        'Explain the problems encountered when interfacing a TTL gate to a CMOS gate operating at VDD = 5V. How is this problem solved? Draw the interfacing circuit.',
      bloom: 'BL3: Apply',
      solutionOutline:
        'Contrast TTL VOH(min)=2.4V with CMOS VIH(min)=3.5V (0.7*VDD). Note the 1.1V invalid gap. Show how connecting a 2.2kΩ to 4.7kΩ pull-up resistor to +5V pulls the voltage up to nearly 5V, satisfying CMOS VIH.',
    },
  ],
};
