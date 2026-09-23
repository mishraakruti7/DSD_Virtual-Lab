import { MsiChipInfo } from '../types/dsd';

export const MSI_CHIPS_DATA: MsiChipInfo[] = [
  {
    icNumber: "7490",
    name: "Decade Counter (BCD / Bi-quinary)",
    type: "Counter",
    syncType: "Asynchronous",
    coMapping: "CO1, CO2",
    description: "Contains 4 master-slave flip-flops divided into a divide-by-2 section (Input A to QA) and a divide-by-5 section (Input B to QD, QC, QB). Connecting QA to Input B creates a true BCD decade counter (0 to 9).",
    keyFeatures: [
      "Mod-10 Decade counting (0000 to 1001)",
      "Dual Master-Reset pins R0(1) and R0(2) for 0000 asynchronous reset",
      "Dual Master-Set pins R9(1) and R9(2) for 1001 (BCD 9) set",
      "Negative-edge triggered clocks (falling-edge active)"
    ],
    pins: [
      { pin: 1, name: "CKB", desc: "Clock input B (divide-by-5)", type: "clock" },
      { pin: 2, name: "R0(1)", desc: "Reset 0 Input 1", type: "control" },
      { pin: 3, name: "R0(2)", desc: "Reset 0 Input 2", type: "control" },
      { pin: 4, name: "NC", desc: "No Connection", type: "power" },
      { pin: 5, name: "VCC", desc: "+5V Supply", type: "power" },
      { pin: 6, name: "R9(1)", desc: "Reset 9 (Set) Input 1", type: "control" },
      { pin: 7, name: "R9(2)", desc: "Reset 9 (Set) Input 2", type: "control" },
      { pin: 8, name: "QC", desc: "Flip-flop C Output", type: "output" },
      { pin: 9, name: "QB", desc: "Flip-flop B Output", type: "output" },
      { pin: 10, name: "GND", desc: "0V Ground", type: "power" },
      { pin: 11, name: "QD", desc: "Flip-flop D Output (MSB)", type: "output" },
      { pin: 12, name: "QA", desc: "Flip-flop A Output (LSB)", type: "output" },
      { pin: 13, name: "NC", desc: "No Connection", type: "power" },
      { pin: 14, name: "CKA", desc: "Clock input A (divide-by-2)", type: "clock" }
    ]
  },
  {
    icNumber: "7492",
    name: "Divide-by-12 Counter (Mod-12)",
    type: "Counter",
    syncType: "Asynchronous",
    coMapping: "CO1, CO2",
    description: "Comprises a divide-by-2 flip-flop and a divide-by-6 counter. By cascading QA to Input B, the IC operates as a Mod-12 counter, ideal for digital clocks (hours/minutes counters) and frequency division.",
    keyFeatures: [
      "Divides input frequency by 2, 6, or 12",
      "Counts sequence 0 through 11 in binary-coded format",
      "Asynchronous dual Master Reset pins (R0(1), R0(2))",
      "Negative edge-triggered clock inputs"
    ],
    pins: [
      { pin: 1, name: "CKB", desc: "Clock input B (divide-by-6)", type: "clock" },
      { pin: 2, name: "NC", desc: "No Connection", type: "power" },
      { pin: 3, name: "NC", desc: "No Connection", type: "power" },
      { pin: 4, name: "NC", desc: "No Connection", type: "power" },
      { pin: 5, name: "VCC", desc: "+5V Supply", type: "power" },
      { pin: 6, name: "R0(1)", desc: "Reset to 0 Pin 1", type: "control" },
      { pin: 7, name: "R0(2)", desc: "Reset to 0 Pin 2", type: "control" },
      { pin: 8, name: "QC", desc: "Output QC", type: "output" },
      { pin: 9, name: "QB", desc: "Output QB", type: "output" },
      { pin: 10, name: "GND", desc: "Ground 0V", type: "power" },
      { pin: 11, name: "QD", desc: "Output QD (MSB)", type: "output" },
      { pin: 12, name: "QA", desc: "Output QA (LSB)", type: "output" },
      { pin: 13, name: "NC", desc: "No Connection", type: "power" },
      { pin: 14, name: "CKA", desc: "Clock input A (divide-by-2)", type: "clock" }
    ]
  },
  {
    icNumber: "7493",
    name: "4-Bit Binary Ripple Counter (Mod-16)",
    type: "Counter",
    syncType: "Asynchronous",
    coMapping: "CO1, CO2",
    description: "Contains 4 master-slave flip-flops partitioned into divide-by-2 (CKA) and divide-by-8 (CKB). Connecting QA to CKB yields a standard 4-bit binary counter cycling 0000 to 1111 (0 to 15).",
    keyFeatures: [
      "Natural 4-bit binary sequence (0 to 15)",
      "Can be truncated to any Mod-N (e.g., Mod-6 by wiring QB and QC to R0(1) and R0(2))",
      "Ripple carry architecture: each flip-flop clock driven by previous output",
      "Simple wiring for frequency synthesis"
    ],
    pins: [
      { pin: 1, name: "CKB", desc: "Clock input B (divide-by-8)", type: "clock" },
      { pin: 2, name: "R0(1)", desc: "Reset 0 Input 1", type: "control" },
      { pin: 3, name: "R0(2)", desc: "Reset 0 Input 2", type: "control" },
      { pin: 4, name: "NC", desc: "No Connection", type: "power" },
      { pin: 5, name: "VCC", desc: "+5V Supply", type: "power" },
      { pin: 6, name: "NC", desc: "No Connection", type: "power" },
      { pin: 7, name: "NC", desc: "No Connection", type: "power" },
      { pin: 8, name: "QC", desc: "Bit 2 Output", type: "output" },
      { pin: 9, name: "QB", desc: "Bit 1 Output", type: "output" },
      { pin: 10, name: "GND", desc: "0V Ground", type: "power" },
      { pin: 11, name: "QD", desc: "Bit 3 Output (MSB)", type: "output" },
      { pin: 12, name: "QA", desc: "Bit 0 Output (LSB)", type: "output" },
      { pin: 13, name: "NC", desc: "No Connection", type: "power" },
      { pin: 14, name: "CKA", desc: "Clock input A (divide-by-2)", type: "clock" }
    ]
  },
  {
    icNumber: "74163",
    name: "Synchronous 4-Bit Binary Counter (Sync Clear)",
    type: "Counter",
    syncType: "Synchronous",
    coMapping: "CO1, CO2",
    description: "Fully synchronous 4-bit binary counter where all flip-flops trigger simultaneously on the positive clock edge. Features synchronous clear, synchronous parallel load, and look-ahead carry for high-speed cascading.",
    keyFeatures: [
      "All flip-flops clocked simultaneously: eliminates ripple delay glitches",
      "Synchronous Clear (/CLR): resets to 0000 on next active clock edge",
      "Synchronous Parallel Load (/LOAD): presets A, B, C, D inputs synchronously",
      "Ripple Carry Output (RCO) enables multi-stage cascading without extra gates"
    ],
    pins: [
      { pin: 1, name: "/CLR", desc: "Synchronous Clear (active LOW)", type: "control" },
      { pin: 2, name: "CLK", desc: "Positive-edge Clock", type: "clock" },
      { pin: 3, name: "A", desc: "Parallel Data Input A", type: "input" },
      { pin: 4, name: "B", desc: "Parallel Data Input B", type: "input" },
      { pin: 5, name: "C", desc: "Parallel Data Input C", type: "input" },
      { pin: 6, name: "D", desc: "Parallel Data Input D", type: "input" },
      { pin: 7, name: "ENP", desc: "Count Enable Parallel", type: "control" },
      { pin: 8, name: "GND", desc: "0V Ground", type: "power" },
      { pin: 9, name: "/LOAD", desc: "Synchronous Load (active LOW)", type: "control" },
      { pin: 10, name: "ENT", desc: "Count Enable Trickle", type: "control" },
      { pin: 11, name: "QD", desc: "Data Output QD (MSB)", type: "output" },
      { pin: 12, name: "QC", desc: "Data Output QC", type: "output" },
      { pin: 13, name: "QB", desc: "Data Output QB", type: "output" },
      { pin: 14, name: "QA", desc: "Data Output QA (LSB)", type: "output" },
      { pin: 15, name: "RCO", desc: "Ripple Carry Output", type: "output" },
      { pin: 16, name: "VCC", desc: "+5V Supply", type: "power" }
    ]
  },
  {
    icNumber: "74169",
    name: "Synchronous 4-Bit Up/Down Binary Counter",
    type: "Counter",
    syncType: "Synchronous",
    coMapping: "CO1, CO2",
    description: "Synchronous 4-bit binary counter with reversible direction (Up or Down). Direction is determined by the U//D control pin. Features synchronous parallel loading and active-LOW count enable inputs.",
    keyFeatures: [
      "Reversible Counting: U//D = 1 counts UP (0 to 15); U//D = 0 counts DOWN (15 to 0)",
      "Fully synchronous internal steering logic",
      "Look-ahead carry generation via /TC (Terminal Count)",
      "Synchronous Preset Capability"
    ],
    pins: [
      { pin: 1, name: "U//D", desc: "Up/Down Direction Control", type: "control" },
      { pin: 2, name: "CLK", desc: "Positive-edge Clock", type: "clock" },
      { pin: 3, name: "A", desc: "Parallel Data Input A", type: "input" },
      { pin: 4, name: "B", desc: "Parallel Data Input B", type: "input" },
      { pin: 5, name: "C", desc: "Parallel Data Input C", type: "input" },
      { pin: 6, name: "D", desc: "Parallel Data Input D", type: "input" },
      { pin: 7, name: "/ENP", desc: "Count Enable Parallel (active LOW)", type: "control" },
      { pin: 8, name: "GND", desc: "0V Ground", type: "power" },
      { pin: 9, name: "/LOAD", desc: "Synchronous Load (active LOW)", type: "control" },
      { pin: 10, name: "/ENT", desc: "Count Enable Trickle (active LOW)", type: "control" },
      { pin: 11, name: "QD", desc: "Data Output QD (MSB)", type: "output" },
      { pin: 12, name: "QC", desc: "Data Output QC", type: "output" },
      { pin: 13, name: "QB", desc: "Data Output QB", type: "output" },
      { pin: 14, name: "QA", desc: "Data Output QA (LSB)", type: "output" },
      { pin: 15, name: "/TC", desc: "Terminal Count Output (active LOW)", type: "output" },
      { pin: 16, name: "VCC", desc: "+5V Supply", type: "power" }
    ]
  },
  {
    icNumber: "74194",
    name: "4-Bit Bidirectional Universal Shift Register",
    type: "Shift Register",
    syncType: "Synchronous",
    coMapping: "CO1, CO2",
    description: "Versatile 4-bit shift register capable of all 4 fundamental shift operations: Parallel In/Parallel Out (PIPO), Serial In/Serial Out (SISO), Serial In/Parallel Out (SIPO), and Parallel In/Serial Out (PISO). Controlled via mode pins S1, S0.",
    keyFeatures: [
      "Mode S1S0 = 00: Inhibit Clock (Hold current state)",
      "Mode S1S0 = 01: Shift Right (Serial input D_SR feeds QA)",
      "Mode S1S0 = 10: Shift Left (Serial input D_SL feeds QD)",
      "Mode S1S0 = 11: Parallel Load (Inputs A, B, C, D clocked into QA, QB, QC, QD)",
      "Asynchronous Master Reset (/CLR) clears all outputs immediately"
    ],
    pins: [
      { pin: 1, name: "/CLR", desc: "Master Reset (active LOW)", type: "control" },
      { pin: 2, name: "SR_SER", desc: "Serial Data Input for Shift Right", type: "input" },
      { pin: 3, name: "A", desc: "Parallel Data Input A", type: "input" },
      { pin: 4, name: "B", desc: "Parallel Data Input B", type: "input" },
      { pin: 5, name: "C", desc: "Parallel Data Input C", type: "input" },
      { pin: 6, name: "D", desc: "Parallel Data Input D", type: "input" },
      { pin: 7, name: "SL_SER", desc: "Serial Data Input for Shift Left", type: "input" },
      { pin: 8, name: "GND", desc: "0V Ground", type: "power" },
      { pin: 9, name: "S0", desc: "Mode Select Pin 0", type: "control" },
      { pin: 10, name: "S1", desc: "Mode Select Pin 1", type: "control" },
      { pin: 11, name: "CLK", desc: "Positive-edge Clock", type: "clock" },
      { pin: 12, name: "QD", desc: "Parallel Output QD (MSB)", type: "output" },
      { pin: 13, name: "QC", desc: "Parallel Output QC", type: "output" },
      { pin: 14, name: "QB", desc: "Parallel Output QB", type: "output" },
      { pin: 15, name: "QA", desc: "Parallel Output QA (LSB)", type: "output" },
      { pin: 16, name: "VCC", desc: "+5V Supply", type: "power" }
    ]
  }
];
