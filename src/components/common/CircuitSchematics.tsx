import React from 'react';

// 1. TTL Totem-Pole Output Stage Transistor Schematic
export const TtlTotemPoleSchematic: React.FC<{ activeRegion?: string }> = ({ activeRegion }) => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border">
        <div className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2">
          Transistor-Level Schematic: Standard TTL Totem-Pole NAND
        </div>
        {activeRegion && (
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mod2-light text-mod2-dark border border-mod2/30 font-bold">
            {activeRegion}
          </span>
        )}
      </div>

      <svg viewBox="0 0 540 320" className="w-full h-auto max-h-72 circuit-schematic-canvas">
        {/* VCC (+5V) Rail */}
        <line x1="40" y1="30" x2="500" y2="30" stroke="#ef4444" strokeWidth="4" />
        <line x1="40" y1="30" x2="500" y2="30" stroke="#fca5a5" strokeWidth="2" strokeDasharray="6 4" className="wire-flow-high" />
        <circle cx="50" cy="30" r="4" fill="#ef4444" />
        <text x="60" y="24" fill="#ef4444" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">+5V (VCC)</text>

        {/* GND Rail */}
        <line x1="40" y1="290" x2="500" y2="290" stroke="#0284c7" strokeWidth="4" />
        <circle cx="50" cy="290" r="4" fill="#0284c7" />
        <text x="60" y="308" fill="#0284c7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">0V (GND)</text>

        {/* Resistors from VCC */}
        {/* R1: 4k */}
        <line x1="120" y1="30" x2="120" y2="70" stroke="#94a3b8" strokeWidth="2.5" />
        <rect x="112" y="70" width="16" height="35" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="3" />
        <text x="135" y="92" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">R1 (4kΩ)</text>
        <line x1="120" y1="105" x2="120" y2="135" stroke="#94a3b8" strokeWidth="2.5" />

        {/* R2: 1.6k */}
        <line x1="250" y1="30" x2="250" y2="70" stroke="#94a3b8" strokeWidth="2.5" />
        <rect x="242" y="70" width="16" height="35" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="3" />
        <text x="265" y="92" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">R2 (1.6kΩ)</text>
        <line x1="250" y1="105" x2="250" y2="130" stroke="#94a3b8" strokeWidth="2.5" />

        {/* R3: 130 ohm */}
        <line x1="400" y1="30" x2="400" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
        <rect x="392" y="60" width="16" height="30" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="3" />
        <text x="415" y="80" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">R3 (130Ω)</text>
        <line x1="400" y1="90" x2="400" y2="115" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Transistor Q1: Multi-Emitter */}
        <circle cx="120" cy="155" r="22" fill="#fffbeb" stroke="#d97706" strokeWidth="2" />
        <text x="112" y="160" fill="#b45309" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Q1</text>
        {/* Emitter A & B */}
        <line x1="70" y1="145" x2="100" y2="150" stroke="#0284c7" strokeWidth="2.5" />
        <line x1="70" y1="165" x2="100" y2="160" stroke="#0284c7" strokeWidth="2.5" />
        <circle cx="70" cy="145" r="3.5" fill="#0284c7" />
        <circle cx="70" cy="165" r="3.5" fill="#0284c7" />
        <text x="35" y="149" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">In A</text>
        <text x="35" y="169" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">In B</text>
        {/* Collector of Q1 to Base of Q2 */}
        <line x1="142" y1="155" x2="230" y2="155" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Transistor Q2: Phase Splitter */}
        <circle cx="250" cy="155" r="22" fill="#f0fdf4" stroke="#059669" strokeWidth="2" />
        <text x="242" y="160" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Q2</text>
        {/* Collector of Q2 to Base of Q3 */}
        <line x1="250" y1="133" x2="250" y2="120" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="250" y1="120" x2="380" y2="120" stroke="#94a3b8" strokeWidth="2.5" />
        {/* Emitter of Q2 to Base of Q4 */}
        <line x1="250" y1="177" x2="250" y2="235" stroke="#94a3b8" strokeWidth="2.5" />
        <line x1="250" y1="235" x2="380" y2="235" stroke="#94a3b8" strokeWidth="2.5" />
        {/* R4: 1k to GND */}
        <rect x="242" y="195" width="16" height="30" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" rx="3" />
        <text x="200" y="215" fill="#334155" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">R4 (1k)</text>
        <line x1="250" y1="225" x2="250" y2="290" stroke="#94a3b8" strokeWidth="2" />

        {/* Transistor Q3: Pull-Up (Totem) */}
        <circle cx="400" cy="130" r="20" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
        <text x="392" y="135" fill="#1d4ed8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Q3</text>
        {/* Diode D below Q3 */}
        <line x1="400" y1="150" x2="400" y2="165" stroke="#94a3b8" strokeWidth="2.5" />
        <polygon points="392,165 408,165 400,180" fill="#f43f5e" stroke="#e11d48" strokeWidth="1.5" />
        <line x1="392" y1="180" x2="408" y2="180" stroke="#e11d48" strokeWidth="2" />
        <text x="415" y="176" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Diode D</text>
        <line x1="400" y1="180" x2="400" y2="200" stroke="#94a3b8" strokeWidth="2.5" />

        {/* Output Junction Y */}
        <line x1="400" y1="200" x2="480" y2="200" stroke="#059669" strokeWidth="3.5" />
        <circle cx="400" cy="200" r="4" fill="#059669" />
        <circle cx="480" cy="200" r="4.5" fill="#059669" />
        <text x="492" y="205" fill="#047857" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold">Out Y</text>

        {/* Transistor Q4: Pull-Down Inverter */}
        <line x1="400" y1="200" x2="400" y2="220" stroke="#94a3b8" strokeWidth="2.5" />
        <circle cx="400" cy="240" r="20" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
        <text x="392" y="245" fill="#6d28d9" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Q4</text>
        <line x1="400" y1="260" x2="400" y2="290" stroke="#94a3b8" strokeWidth="2.5" />
      </svg>
      <div className="text-[11px] text-ink/70 dark:text-darklab-muted font-mono mt-2 pt-2 border-t border-cream-200/80 dark:border-darklab-border">
        • Q3 (pull-up) active when Vin &lt; 0.7V | • Q4 (pull-down) saturates when Vin &gt; 1.4V | • Diode D prevents Q3/Q4 simultaneous overlap conduction
      </div>
    </div>
  );
};

// 2. CMOS Inverter / NAND Switch Networks Schematic
export const CmosSwitchSchematic: React.FC<{ gateType: 'inverter' | 'nand' | 'nor' }> = ({ gateType }) => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-brand-600 dark:text-brand-400">
          CMOS Transistor Topology: {gateType.toUpperCase()}
        </span>
        <span className="text-ink/60 dark:text-darklab-muted text-[11px]">PMOS Pull-Up vs NMOS Pull-Down</span>
      </div>

      <svg viewBox="0 0 400 240" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* VDD (+5V) */}
        <line x1="50" y1="20" x2="350" y2="20" stroke="#ef4444" strokeWidth="3.5" />
        <line x1="50" y1="20" x2="350" y2="20" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="6 4" className="wire-flow-high" />
        <text x="60" y="15" fill="#ef4444" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">VDD (+5V)</text>

        {/* GND */}
        <line x1="50" y1="220" x2="350" y2="220" stroke="#0284c7" strokeWidth="3.5" />
        <text x="60" y="235" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">VSS (GND)</text>

        {gateType === 'inverter' && (
          <g>
            {/* PMOS (Pull-Up) */}
            <line x1="200" y1="20" x2="200" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
            <rect x="180" y="60" width="40" height="30" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="4" />
            <text x="186" y="80" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">PMOS</text>
            <circle cx="174" cy="75" r="4" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
            
            {/* Output Node Y */}
            <line x1="200" y1="90" x2="200" y2="150" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="200" cy="120" r="4.5" fill="#059669" />
            <line x1="200" y1="120" x2="300" y2="120" stroke="#059669" strokeWidth="3" />
            <text x="310" y="125" fill="#047857" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">Out Y</text>

            {/* NMOS (Pull-Down) */}
            <rect x="180" y="150" width="40" height="30" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="4" />
            <text x="186" y="170" fill="#0369a1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">NMOS</text>
            <line x1="200" y1="180" x2="200" y2="220" stroke="#94a3b8" strokeWidth="2.5" />

            {/* Input Line A */}
            <line x1="100" y1="75" x2="170" y2="75" stroke="#d97706" strokeWidth="2.5" />
            <line x1="100" y1="75" x2="100" y2="165" stroke="#d97706" strokeWidth="2.5" />
            <line x1="100" y1="165" x2="180" y2="165" stroke="#d97706" strokeWidth="2.5" />
            <line x1="60" y1="120" x2="100" y2="120" stroke="#d97706" strokeWidth="3" />
            <circle cx="60" cy="120" r="4" fill="#d97706" />
            <text x="30" y="125" fill="#b45309" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">In A</text>
          </g>
        )}

        {gateType !== 'inverter' && (
          <g>
            <rect x="110" y="55" width="80" height="40" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="6" />
            <text x="120" y="80" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">P-Network</text>
            <rect x="210" y="55" width="80" height="40" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="6" />
            <text x="220" y="80" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">{gateType==='nand'?'P2 (Par)':'P2 (Ser)'}</text>

            <line x1="200" y1="95" x2="200" y2="135" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="200" y1="120" x2="320" y2="120" stroke="#059669" strokeWidth="3" />
            <text x="330" y="125" fill="#047857" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">Out Y</text>

            <rect x="150" y="145" width="100" height="45" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="6" />
            <text x="156" y="172" fill="#0369a1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">{gateType==='nand'?'N-Net (Series)':'N-Net (Parallel)'}</text>
            <line x1="200" y1="190" x2="200" y2="220" stroke="#94a3b8" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

// 3. Master-Slave JK Two-Stage Circuit Schematic
export const MasterSlaveJkSchematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-mod2-dark dark:text-mod2">
          Internal Architecture: Master-Slave JK Flip-Flop
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Race-Around Elimination</span>
      </div>

      <svg viewBox="0 0 600 240" className="w-full h-auto max-h-64 circuit-schematic-canvas">
        {/* Master Box */}
        <rect x="60" y="30" width="200" height="180" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 3" rx="8" />
        <text x="75" y="55" fill="#0369a1" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">STAGE 1: MASTER (CLK)</text>

        {/* Slave Box */}
        <rect x="340" y="30" width="200" height="180" fill="#ecfdf5" stroke="#059669" strokeWidth="2" strokeDasharray="4 3" rx="8" />
        <text x="355" y="55" fill="#047857" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">STAGE 2: SLAVE (CLK')</text>

        {/* Master Gates (G1, G2, G3, G4) */}
        <rect x="80" y="75" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="92" y="95" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G1</text>
        <rect x="80" y="145" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="92" y="165" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G2</text>

        <rect x="180" y="75" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="192" y="95" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G3</text>
        <rect x="180" y="145" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="192" y="165" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G4</text>

        {/* Slave Gates (G5, G6, G7, G8) */}
        <rect x="360" y="75" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="372" y="95" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G5</text>
        <rect x="360" y="145" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="372" y="165" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G6</text>

        <rect x="460" y="75" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="472" y="95" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G7</text>
        <rect x="460" y="145" width="40" height="30" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" rx="4" />
        <text x="472" y="165" fill="#1e293b" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">G8</text>

        {/* Input Terminals */}
        <text x="15" y="85" fill="#0284c7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">J</text>
        <line x1="30" y1="80" x2="80" y2="80" stroke="#0284c7" strokeWidth="2" />
        <text x="15" y="165" fill="#0284c7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">K</text>
        <line x1="30" y1="160" x2="80" y2="160" stroke="#0284c7" strokeWidth="2" />

        {/* Common Clock Line & Inverter */}
        <text x="10" y="125" fill="#d97706" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">CLK</text>
        <line x1="35" y1="120" x2="80" y2="120" stroke="#d97706" strokeWidth="2" />
        <line x1="80" y1="95" x2="80" y2="120" stroke="#d97706" strokeWidth="2" />
        <line x1="80" y1="120" x2="80" y2="145" stroke="#d97706" strokeWidth="2" />

        {/* Inverter in the middle */}
        <line x1="80" y1="120" x2="280" y2="120" stroke="#d97706" strokeWidth="2" />
        <polygon points="280,110 305,120 280,130" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="308" cy="120" r="3.5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
        <line x1="312" y1="120" x2="360" y2="120" stroke="#d97706" strokeWidth="2" />
        <line x1="360" y1="95" x2="360" y2="120" stroke="#d97706" strokeWidth="2" />
        <line x1="360" y1="120" x2="360" y2="145" stroke="#d97706" strokeWidth="2" />

        {/* Interstage Master to Slave Wires */}
        <line x1="220" y1="90" x2="360" y2="90" stroke="#0284c7" strokeWidth="2" />
        <text x="270" y="85" fill="#0369a1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Qm</text>
        <line x1="220" y1="160" x2="360" y2="160" stroke="#0284c7" strokeWidth="2" />
        <text x="270" y="175" fill="#0369a1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Qm'</text>

        {/* Slave Outputs Q and Q' */}
        <line x1="500" y1="90" x2="560" y2="90" stroke="#059669" strokeWidth="2.5" />
        <circle cx="560" cy="90" r="4" fill="#059669" />
        <text x="570" y="95" fill="#047857" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">Q</text>

        <line x1="500" y1="160" x2="560" y2="160" stroke="#e11d48" strokeWidth="2.5" />
        <circle cx="560" cy="160" r="4" fill="#e11d48" />
        <text x="570" y="165" fill="#be123c" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">Q'</text>

        {/* Feedback lines from Q/Q' to Master Inputs */}
        <path d="M 540 90 L 540 225 L 50 225 L 50 170 L 80 170" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" className="wire-flow-high" />
        <path d="M 520 160 L 520 215 L 40 215 L 40 70 L 80 70" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 3" className="wire-flow-high" />
      </svg>
    </div>
  );
};

// 4. Exp 11: Real-Time Security Door Magnetic Reed Sensor & Latching Flip-Flop Schematic
export const SecurityDoorSchematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-mod1-dark dark:text-mod1">
          Circuit Schematic: Facility Security Door Latching Alarm
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Exp 11 Real-Time System</span>
      </div>

      <svg viewBox="0 0 580 220" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* Magnetic Reed Switch Section */}
        <rect x="20" y="35" width="130" height="140" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" rx="6" />
        <text x="30" y="55" fill="#b45309" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">REED SWITCH</text>
        <text x="30" y="70" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">(Door Magnet)</text>
        
        {/* Pull-Up Resistor */}
        <line x1="85" y1="35" x2="85" y2="85" stroke="#ef4444" strokeWidth="2" />
        <text x="95" y="48" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">+5V</text>
        <rect x="79" y="85" width="12" height="25" fill="#f8fafc" stroke="#64748b" rx="2" />
        <text x="95" y="100" fill="#334155" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">10kΩ</text>

        {/* Reed Contact */}
        <circle cx="85" cy="120" r="3" fill="#d97706" />
        <line x1="85" y1="120" x2="105" y2="135" stroke="#d97706" strokeWidth="2" />
        <circle cx="85" cy="145" r="3" fill="#d97706" />
        <line x1="85" y1="145" x2="85" y2="175" stroke="#0284c7" strokeWidth="2" />
        <text x="95" y="170" fill="#0284c7" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">GND</text>

        {/* Pulse to 7474 D-FF */}
        <line x1="85" y1="115" x2="220" y2="115" stroke="#0284c7" strokeWidth="2.5" />
        <text x="110" y="110" fill="#0369a1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Door Opened Pulse</text>

        {/* IC 7474 D Flip-Flop Box */}
        <rect x="220" y="45" width="160" height="130" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="8" />
        <text x="250" y="68" fill="#0369a1" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">IC 7474 D-FF</text>
        
        {/* Pins */}
        <text x="230" y="95" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">D = +5V</text>
        <text x="230" y="120" fill="#b45309" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">CLK (Trigger)</text>
        <text x="230" y="155" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">/CLR (Reset Key)</text>

        <text x="350" y="100" fill="#059669" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">Q</text>
        <line x1="380" y1="95" x2="430" y2="95" stroke="#059669" strokeWidth="3" />

        {/* Driver Transistor & 12V Siren Strobe */}
        <circle cx="450" cy="110" r="18" fill="#fff1f2" stroke="#e11d48" strokeWidth="2" />
        <text x="442" y="115" fill="#be123c" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">Q_dr</text>
        <line x1="430" y1="95" x2="440" y2="105" stroke="#059669" strokeWidth="2.5" />

        <line x1="450" y1="92" x2="450" y2="50" stroke="#e11d48" strokeWidth="2" />
        <line x1="450" y1="92" x2="450" y2="50" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="4 2" className="wire-flow-high" />
        {/* Siren Symbol */}
        <rect x="430" y="25" width="40" height="25" fill="#e11d48" stroke="#be123c" strokeWidth="1.5" rx="4" />
        <text x="438" y="41" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">SIREN</text>
        <text x="480" y="40" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">+12V Strobe</text>

        <line x1="450" y1="128" x2="450" y2="160" stroke="#0284c7" strokeWidth="2" />
        <text x="440" y="175" fill="#0284c7" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">GND</text>

        {/* Guard Reset Key Line */}
        <line x1="300" y1="160" x2="300" y2="195" stroke="#be123c" strokeWidth="2" />
        <rect x="250" y="185" width="100" height="22" fill="#ffe4e6" stroke="#e11d48" rx="4" />
        <text x="258" y="200" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Guard Key (Reset)</text>
      </svg>
    </div>
  );
};

// 5. Exp 12: Sequence Detector 1011 Mealy FSM State Graph
export const SequenceDetectorFsmDiagram: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-mod4-dark dark:text-mod4">
          Mealy FSM State Transition Graph: Pattern '1011'
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Overlapping Mode</span>
      </div>

      <svg viewBox="0 0 540 220" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* State S0 */}
        <circle cx="70" cy="110" r="28" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" />
        <text x="60" y="115" fill="#0369a1" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">S0</text>
        <text x="45" y="150" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Reset/Idle</text>

        {/* S0 -> S1 (X=1/Z=0) */}
        <line x1="98" y1="110" x2="172" y2="110" stroke="#0284c7" strokeWidth="2" />
        <text x="125" y="102" fill="#0369a1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">1 / 0</text>

        {/* S0 Self Loop (X=0/Z=0) */}
        <path d="M 55 85 C 40 45, 90 45, 80 82" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <text x="55" y="45" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">0 / 0</text>

        {/* State S1 */}
        <circle cx="200" cy="110" r="28" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
        <text x="190" y="115" fill="#1d4ed8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">S1</text>
        <text x="180" y="150" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Got '1'</text>

        {/* S1 -> S2 (X=0/Z=0) */}
        <line x1="228" y1="110" x2="302" y2="110" stroke="#2563eb" strokeWidth="2" />
        <text x="255" y="102" fill="#1d4ed8" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">0 / 0</text>

        {/* S1 Self Loop (X=1/Z=0) */}
        <path d="M 185 85 C 170 45, 220 45, 210 82" fill="none" stroke="#94a3b8" strokeWidth="2" />
        <text x="185" y="45" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">1 / 0</text>

        {/* State S2 */}
        <circle cx="330" cy="110" r="28" fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" />
        <text x="320" y="115" fill="#b45309" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">S2</text>
        <text x="310" y="150" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Got '10'</text>

        {/* S2 -> S3 (X=1/Z=0) */}
        <line x1="358" y1="110" x2="432" y2="110" stroke="#d97706" strokeWidth="2" />
        <text x="385" y="102" fill="#b45309" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">1 / 0</text>

        {/* S2 -> S0 (X=0/Z=0) */}
        <path d="M 320 135 C 260 195, 140 195, 80 135" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="195" y="195" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">0 / 0</text>

        {/* State S3 */}
        <circle cx="460" cy="110" r="28" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
        <text x="450" y="115" fill="#047857" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">S3</text>
        <text x="440" y="150" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Got '101'</text>

        {/* S3 -> S1 Match Return (X=1 / Z=1: PATTERN DETECTED!) */}
        <path d="M 450 85 C 380 15, 270 15, 210 85" fill="none" stroke="#059669" strokeWidth="2.5" />
        <text x="270" y="25" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">1 / 1 (MATCH!)</text>

        {/* S3 -> S2 (X=0/Z=0) */}
        <path d="M 440 130 C 410 160, 380 160, 350 130" fill="none" stroke="#d97706" strokeWidth="2" />
        <text x="385" y="165" fill="#b45309" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">0 / 0</text>
      </svg>
    </div>
  );
};

// 6. Section IX Mini-Project: Beverage Vending Machine ASM Flowchart
export const VendingMachineAsmChart: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-mod2-dark dark:text-mod2">
          ASM Flowchart: ₹15 Beverage Vending Machine
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Section IX Mini-Project</span>
      </div>

      <svg viewBox="0 0 560 260" className="w-full h-auto max-h-72 circuit-schematic-canvas">
        {/* State S0 Box */}
        <rect x="30" y="30" width="100" height="45" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="6" />
        <text x="42" y="50" fill="#0369a1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">S0: Credit ₹0</text>
        <text x="45" y="65" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">Dispense=0</text>

        {/* Decision Diamond: Coin Input? */}
        <polygon points="200,52 245,25 290,52 245,80" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
        <text x="220" y="55" fill="#b45309" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Coin ₹?</text>
        <line x1="130" y1="52" x2="200" y2="52" stroke="#94a3b8" strokeWidth="2" />

        {/* Paths from Decision */}
        {/* Branch 1: ₹5 -> S5 */}
        <line x1="290" y1="40" x2="350" y2="40" stroke="#d97706" strokeWidth="2" />
        <text x="305" y="32" fill="#b45309" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">+₹5</text>
        <rect x="350" y="20" width="90" height="40" fill="#f0fdf4" stroke="#059669" strokeWidth="1.5" rx="6" />
        <text x="360" y="42" fill="#047857" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">S5: Bal ₹5</text>

        {/* Branch 2: ₹10 -> S10 */}
        <line x1="245" y1="80" x2="245" y2="130" stroke="#d97706" strokeWidth="2" />
        <line x1="245" y1="130" x2="350" y2="130" stroke="#d97706" strokeWidth="2" />
        <text x="255" y="115" fill="#b45309" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">+₹10</text>
        <rect x="350" y="110" width="90" height="40" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" rx="6" />
        <text x="360" y="132" fill="#6d28d9" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">S10: Bal ₹10</text>

        {/* Total Reaches ₹15 -> Dispense State Box */}
        <line x1="440" y1="40" x2="480" y2="40" stroke="#059669" strokeWidth="2" />
        <line x1="440" y1="130" x2="480" y2="130" stroke="#059669" strokeWidth="2" />
        <line x1="480" y1="40" x2="480" y2="130" stroke="#059669" strokeWidth="2" />
        <line x1="480" y1="85" x2="510" y2="85" stroke="#059669" strokeWidth="2" />

        {/* Conditional Output: Dispense Drink */}
        <ellipse cx="490" cy="200" rx="55" ry="25" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
        <text x="445" y="200" fill="#047857" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">Dispense = 1</text>
        <text x="445" y="215" fill="#059669" fontSize="9" fontFamily="JetBrains Mono">Return Change</text>

        {/* ₹20 Note Direct Dispense + ₹5 Change */}
        <path d="M 245 80 L 245 200 L 435 200" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="4 2" />
        <text x="255" y="190" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">+₹20 Note (Dispense &amp; Refund ₹5)</text>
      </svg>
    </div>
  );
};

// 7. MOD-6 Asynchronous Ripple Counter Schematic
export const Mod6RippleCounterSchematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-brand-600 dark:text-brand-400">
          MOD-6 Asynchronous Ripple Counter with Truncation Clear
        </span>
        <span className="text-mod2-dark dark:text-mod2 font-bold">NAND Reset: Q2·Q1</span>
      </div>
      <svg viewBox="0 0 600 220" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* Flip Flop 0 (FF0 - QA) */}
        <rect x="50" y="40" width="100" height="110" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="6" />
        <text x="75" y="65" fill="#0369a1" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 0 (QA)</text>
        <text x="60" y="90" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">J=K=1</text>
        <text x="125" y="90" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QA</text>
        <text x="125" y="130" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">QA'</text>
        <text x="75" y="145" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">/CLR</text>

        {/* Flip Flop 1 (FF1 - QB) */}
        <rect x="220" y="40" width="100" height="110" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="6" />
        <text x="245" y="65" fill="#047857" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 1 (QB)</text>
        <text x="230" y="90" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">J=K=1</text>
        <text x="295" y="90" fill="#059669" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QB</text>
        <text x="295" y="130" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">QB'</text>
        <text x="245" y="145" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">/CLR</text>

        {/* Flip Flop 2 (FF2 - QC) */}
        <rect x="390" y="40" width="100" height="110" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" rx="6" />
        <text x="415" y="65" fill="#6d28d9" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 2 (QC)</text>
        <text x="400" y="90" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">J=K=1</text>
        <text x="465" y="90" fill="#7c3aed" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QC</text>
        <text x="465" y="130" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">QC'</text>
        <text x="415" y="145" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">/CLR</text>

        {/* Master Clock into FF0 */}
        <line x1="10" y1="95" x2="50" y2="95" stroke="#d97706" strokeWidth="2.5" />
        <polygon points="50,90 58,95 50,100" fill="#d97706" />
        <text x="10" y="85" fill="#b45309" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">CLK</text>

        {/* Ripple Clock QA -> FF1 CLK */}
        <line x1="150" y1="85" x2="185" y2="85" stroke="#0284c7" strokeWidth="2" />
        <line x1="185" y1="85" x2="185" y2="95" stroke="#0284c7" strokeWidth="2" />
        <line x1="185" y1="95" x2="220" y2="95" stroke="#0284c7" strokeWidth="2" />
        <polygon points="220,90 228,95 220,100" fill="#0284c7" />

        {/* Ripple Clock QB -> FF2 CLK */}
        <line x1="320" y1="85" x2="355" y2="85" stroke="#059669" strokeWidth="2" />
        <line x1="355" y1="85" x2="355" y2="95" stroke="#059669" strokeWidth="2" />
        <line x1="355" y1="95" x2="390" y2="95" stroke="#059669" strokeWidth="2" />
        <polygon points="390,90 398,95 390,100" fill="#059669" />

        {/* 2-Input NAND Gate for Truncation (Detects QC=1 and QB=1 -> 6 decimal) */}
        <rect x="250" y="175" width="45" height="30" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" rx="4" />
        <circle cx="298" cy="190" r="3.5" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
        <text x="256" y="195" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">NAND</text>

        {/* Tap from QB to NAND */}
        <line x1="320" y1="85" x2="335" y2="85" stroke="#059669" strokeWidth="1.5" />
        <line x1="335" y1="85" x2="335" y2="182" stroke="#059669" strokeWidth="1.5" />
        <line x1="335" y1="182" x2="250" y2="182" stroke="#059669" strokeWidth="1.5" />

        {/* Tap from QC to NAND */}
        <line x1="490" y1="85" x2="520" y2="85" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="520" y1="85" x2="520" y2="198" stroke="#7c3aed" strokeWidth="1.5" />
        <line x1="520" y1="198" x2="250" y2="198" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Feedback Clear Line from NAND to /CLR of all FFs */}
        <line x1="302" y1="190" x2="320" y2="190" stroke="#e11d48" strokeWidth="2" />
        <line x1="320" y1="190" x2="320" y2="215" stroke="#e11d48" strokeWidth="2" />
        <line x1="320" y1="215" x2="90" y2="215" stroke="#e11d48" strokeWidth="2" />
        <line x1="90" y1="215" x2="90" y2="150" stroke="#e11d48" strokeWidth="2" />
        <line x1="260" y1="215" x2="260" y2="150" stroke="#e11d48" strokeWidth="2" />
        <line x1="430" y1="215" x2="430" y2="150" stroke="#e11d48" strokeWidth="2" />
        <line x1="320" y1="215" x2="430" y2="215" stroke="#e11d48" strokeWidth="2" />
        <text x="120" y="210" fill="#be123c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">Active-LOW Reset Bus (/CLR)</text>
      </svg>
    </div>
  );
};

// 8. Full Adder & Full Subtractor Logic Schematic
export const FullAdderSubtractorSchematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-mod2-dark dark:text-mod2">
          Full Adder / Subtractor Logic Gate Schematic
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">IC 7486 / 7408 / 7432</span>
      </div>
      <svg viewBox="0 0 560 210" className="w-full h-auto max-h-56 circuit-schematic-canvas">
        {/* Input Terminals */}
        <text x="15" y="45" fill="#0284c7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">A</text>
        <line x1="35" y1="40" x2="90" y2="40" stroke="#0284c7" strokeWidth="2.5" />
        <text x="15" y="75" fill="#0284c7" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">B</text>
        <line x1="35" y1="70" x2="90" y2="70" stroke="#0284c7" strokeWidth="2.5" />
        <text x="15" y="145" fill="#d97706" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">Cin</text>
        <line x1="45" y1="140" x2="260" y2="140" stroke="#d97706" strokeWidth="2.5" />

        {/* First XOR Gate (A ⊕ B) */}
        <rect x="90" y="30" width="55" height="45" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="6" />
        <text x="100" y="58" fill="#0369a1" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">XOR 1</text>
        <line x1="145" y1="52" x2="260" y2="52" stroke="#0284c7" strokeWidth="2.5" />
        <text x="175" y="45" fill="#0369a1" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">A ⊕ B</text>

        {/* Second XOR Gate: Sum = (A ⊕ B) ⊕ Cin */}
        <rect x="260" y="40" width="60" height="55" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="6" />
        <text x="270" y="72" fill="#047857" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">XOR 2</text>
        <line x1="260" y1="80" x2="240" y2="80" stroke="#d97706" strokeWidth="2" />
        <line x1="240" y1="80" x2="240" y2="140" stroke="#d97706" strokeWidth="2" />
        <line x1="320" y1="67" x2="480" y2="67" stroke="#059669" strokeWidth="3" />
        <circle cx="480" cy="67" r="4.5" fill="#059669" />
        <text x="495" y="72" fill="#047857" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">SUM (S)</text>

        {/* AND Gate 1: A · B */}
        <rect x="180" y="110" width="50" height="40" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" rx="6" />
        <text x="190" y="135" fill="#6d28d9" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AND 1</text>

        {/* AND Gate 2: Cin · (A ⊕ B) */}
        <rect x="330" y="125" width="50" height="40" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" rx="6" />
        <text x="340" y="150" fill="#6d28d9" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AND 2</text>

        {/* OR Gate for Cout = (A·B) + Cin·(A⊕B) */}
        <rect x="420" y="120" width="50" height="45" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" rx="6" />
        <text x="432" y="147" fill="#be123c" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">OR</text>
        <line x1="230" y1="130" x2="420" y2="130" stroke="#7c3aed" strokeWidth="2" />
        <line x1="380" y1="145" x2="420" y2="145" stroke="#7c3aed" strokeWidth="2" />
        <line x1="470" y1="142" x2="520" y2="142" stroke="#e11d48" strokeWidth="3" />
        <circle cx="520" cy="142" r="4.5" fill="#e11d48" />
        <text x="530" y="147" fill="#be123c" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">COUT</text>
      </svg>
    </div>
  );
};

// 9. 3:8 Decoder (IC 74138) Schematic
export const Decoder74138Schematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-brand-600 dark:text-brand-400">
          IC 74138: 3-to-8 Line Inverting Decoder / Demultiplexer
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Active-LOW Outputs (Y0'..Y7')</span>
      </div>
      <svg viewBox="0 0 540 230" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* IC Package Box */}
        <rect x="180" y="20" width="180" height="190" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2.5" rx="8" />
        <text x="220" y="45" fill="#0369a1" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">IC 74138</text>
        <text x="210" y="60" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">3:8 Line Decoder</text>

        {/* Inputs (Left Side) */}
        <text x="40" y="85" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">A (Pin 1)</text>
        <line x1="120" y1="80" x2="180" y2="80" stroke="#0284c7" strokeWidth="2" />
        <text x="40" y="110" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">B (Pin 2)</text>
        <line x1="120" y1="105" x2="180" y2="105" stroke="#0284c7" strokeWidth="2" />
        <text x="40" y="135" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">C (Pin 3)</text>
        <line x1="120" y1="130" x2="180" y2="130" stroke="#0284c7" strokeWidth="2" />

        {/* Enables (Bottom Left) */}
        <text x="20" y="165" fill="#059669" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">G1 (+5V)</text>
        <line x1="100" y1="160" x2="180" y2="160" stroke="#059669" strokeWidth="2" />
        <text x="20" y="190" fill="#be123c" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">/G2A, /G2B (GND)</text>
        <line x1="145" y1="185" x2="180" y2="185" stroke="#be123c" strokeWidth="2" />

        {/* Outputs (Right Side Y0' to Y7') */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const yPos = 40 + i * 20;
          return (
            <g key={i}>
              <line x1="360" y1={yPos} x2="430" y2={yPos} stroke="#db2777" strokeWidth="1.5" />
              <circle cx="434" cy={yPos} r="3" fill="#ffffff" stroke="#db2777" strokeWidth="1.5" />
              <text x="445" y={yPos + 4} fill="#be185d" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                Y{i}' (Pin {15 - (i > 3 ? i + 1 : i)})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 10. MOD-8 Synchronous Up-Counter Schematic
export const Mod8SyncCounterSchematic: React.FC = () => {
  return (
    <div className="bg-white/80 dark:bg-darklab-surface/80 backdrop-blur-md p-5 rounded-3xl border border-cream-200/80 dark:border-darklab-border shadow-cream-sm text-ink dark:text-stone-200 transition-colors">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-200/80 dark:border-darklab-border text-xs font-mono">
        <span className="font-bold text-brand-600 dark:text-brand-400">
          MOD-8 Synchronous Up-Counter (Common Clock & Carry Logic)
        </span>
        <span className="text-mod3-dark dark:text-mod3 font-bold">Simultaneous Triggering</span>
      </div>
      <svg viewBox="0 0 600 220" className="w-full h-auto max-h-60 circuit-schematic-canvas">
        {/* Common Clock Bus */}
        <line x1="20" y1="180" x2="550" y2="180" stroke="#d97706" strokeWidth="2.5" />
        <text x="20" y="170" fill="#b45309" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
          COMMON MASTER CLOCK BUS
        </text>

        {/* FF 0 (Stage A) */}
        <rect x="50" y="40" width="100" height="100" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" rx="6" />
        <text x="75" y="65" fill="#0369a1" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 0 (QA)</text>
        <text x="60" y="90" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">J=K=1</text>
        <text x="125" y="90" fill="#0284c7" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QA</text>
        <line x1="100" y1="180" x2="100" y2="140" stroke="#d97706" strokeWidth="2" />
        <polygon points="96,140 100,135 104,140" fill="#d97706" />

        {/* FF 1 (Stage B) */}
        <rect x="230" y="40" width="100" height="100" fill="#ecfdf5" stroke="#059669" strokeWidth="2" rx="6" />
        <text x="255" y="65" fill="#047857" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 1 (QB)</text>
        <text x="235" y="90" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">J=K=QA</text>
        <text x="305" y="90" fill="#059669" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QB</text>
        <line x1="280" y1="180" x2="280" y2="140" stroke="#d97706" strokeWidth="2" />
        <polygon points="276,140 280,135 284,140" fill="#d97706" />

        {/* QA feeds directly to J & K of FF1 */}
        <line x1="150" y1="85" x2="230" y2="85" stroke="#0284c7" strokeWidth="2" />

        {/* AND Gate for FF2 (J2 = K2 = QA · QB) */}
        <rect x="360" y="70" width="45" height="30" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" rx="4" />
        <text x="370" y="90" fill="#6d28d9" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AND</text>
        <line x1="180" y1="85" x2="180" y2="30" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="180" y1="30" x2="360" y2="30" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="360" y1="30" x2="360" y2="78" stroke="#0284c7" strokeWidth="1.5" />
        <line x1="330" y1="85" x2="360" y2="85" stroke="#059669" strokeWidth="1.5" />

        {/* FF 2 (Stage C) */}
        <rect x="440" y="40" width="100" height="100" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" rx="6" />
        <text x="465" y="65" fill="#6d28d9" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">FF 2 (QC)</text>
        <text x="445" y="90" fill="#334155" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">J=K=QA·QB</text>
        <text x="515" y="90" fill="#7c3aed" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">QC</text>
        <line x1="490" y1="180" x2="490" y2="140" stroke="#d97706" strokeWidth="2" />
        <polygon points="486,140 490,135 494,140" fill="#d97706" />

        {/* AND output to FF2 J & K */}
        <line x1="405" y1="85" x2="440" y2="85" stroke="#7c3aed" strokeWidth="2" />
      </svg>
    </div>
  );
};
