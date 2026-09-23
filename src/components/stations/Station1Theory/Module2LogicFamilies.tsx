import React, { useState } from 'react';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import {
  Sliders,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { TtlTotemPoleSchematic, CmosSwitchSchematic } from '../../common/CircuitSchematics';

export const Module2LogicFamilies: React.FC = () => {
  // TTL VTC Slider: Vin from 0.0V to 5.0V
  const [vIn, setVIn] = useState<number>(0.4);

  // TTL to CMOS Pull-Up Simulator
  const [pullUpConnected, setPullUpConnected] = useState<boolean>(false);

  // CMOS Switch Network Simulator
  const [cmosType, setCmosType] = useState<'inverter' | 'nand' | 'nor'>('inverter');
  const [cmosInA, setCmosInA] = useState<boolean>(false);
  const [cmosInB, setCmosInB] = useState<boolean>(false);

  // PAL / PLA Programmable Fuse Matrix State
  const [fuseMatrixType, setFuseMatrixType] = useState<'PAL' | 'PLA'>('PAL');
  const [palFuses, setPalFuses] = useState<{ [key: string]: boolean }>({
    'p0_a': true, 'p0_not_a': false, 'p0_b': true, 'p0_not_b': false,
    'p1_a': false, 'p1_not_a': true, 'p1_b': false, 'p1_not_b': true,
  });

  // Calculate TTL NAND VTC Region & Transistor States
  let vtcRegion = 'Region I';
  let vOut = 5.0;
  let q1State = 'ON (Conduction)';
  let q2State = 'OFF (Cutoff)';
  let q3State = 'ON (Totem Pull-up)';
  let q4State = 'OFF (Cutoff)';
  let vtcExplanation = 'Vin < 0.7V: Emitter of Q1 is forward-biased, pulling Q2 base LOW. Q2 is OFF. Q3 emitter follower conducts via base pull-up, driving Vout HIGH (V_OH ≈ 3.5V to 5V).';

  if (vIn < 0.7) {
    vtcRegion = 'Region I (Cutoff)';
    vOut = 3.6;
    q1State = 'ON (Saturated)';
    q2State = 'OFF';
    q3State = 'ON (Supplying V_OH)';
    q4State = 'OFF';
    vtcExplanation = 'Vin is below 0.7V: Q1 base-emitter diode conducts. Phase-splitter Q2 is OFF, meaning Q4 base is at 0V (Q4 OFF). Q3 conducts to pull output HIGH.';
  } else if (vIn < 1.3) {
    vtcRegion = 'Region II (Linear Threshold)';
    vOut = 3.6 - (vIn - 0.7) * 0.8;
    q1State = 'Active';
    q2State = 'Turning ON (Active)';
    q3State = 'ON';
    q4State = 'Still OFF (V_B4 < 0.7V)';
    vtcExplanation = 'Vin reaches 0.7V to 1.3V: Q2 begins conducting small current through its collector and emitter. However, current through R4 is not yet enough to turn Q4 ON.';
  } else if (vIn < 1.5) {
    vtcRegion = 'Region III (Knee Transition)';
    vOut = 2.4 - (vIn - 1.3) * 8.0;
    q1State = 'Reverse Active';
    q2State = 'ON (Conducting heavily)';
    q3State = 'Turning OFF';
    q4State = 'Turning ON (Saturating)';
    vtcExplanation = 'Vin between 1.3V and 1.5V: Q2 saturates. Emitter current turns Q4 ON. Q4 begins pulling output down rapidly. Q3 turns OFF with help from the series diode.';
  } else {
    vtcRegion = 'Region IV (Saturation)';
    vOut = 0.2;
    q1State = 'Reverse-biased base-emitter';
    q2State = 'Saturated';
    q3State = 'OFF (Cutoff)';
    q4State = 'Saturated (V_CE(sat) ≈ 0.2V)';
    vtcExplanation = 'Vin >= 1.5V (Logic HIGH): Q1 input diode is reverse-biased. Base current flows through Q1 collector into Q2 and Q4, driving both into hard saturation. Q4 clamps output to V_OL ≈ 0.2V.';
  }

  // TTL to CMOS Interface Calculation
  const ttlRawVoh = 2.4; // standard min V_OH
  const cmosVihThreshold = 3.5; // 0.7 * 5V
  const effectiveVout = pullUpConnected ? 4.92 : ttlRawVoh;
  const isCmosValidHigh = effectiveVout >= cmosVihThreshold;

  // CMOS Switch Simulation Output
  let cmosOut = false;
  if (cmosType === 'inverter') {
    cmosOut = !cmosInA;
  } else if (cmosType === 'nand') {
    cmosOut = !(cmosInA && cmosInB);
  } else if (cmosType === 'nor') {
    cmosOut = !(cmosInA || cmosInB);
  }

  return (
    <div className="space-y-12">
      {/* Module Title Banner */}
      <div className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-200 text-amber-900 border border-amber-300">
              Module 2 • CO3 (6 Hours)
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 mt-2">
              Logic Families, VTC Curves & Programmable Devices
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Compare standard TTL vs high-speed CMOS parameters, slide through the Totem-Pole VTC curve, simulate TTL-to-CMOS interfacing, and program PAL/PLA fuse matrices.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-stone-600 bg-[#faf6ee] px-4 py-2 rounded-2xl border border-amber-200 shadow-soft-sm">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>Families: 74, 74LS, 74AS, 4000B, 74HC</span>
          </div>
        </div>
      </div>

      {/* Sub-Section 1: Logic Families Benchmark Table */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="pb-4 mb-6 border-b border-border-warm">
          <h3 className="font-heading font-bold text-xl text-stone-900">
            1. Comparative Parameters: TTL vs CMOS Families
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Key electrical parameters: Propagation delay (t_pd), Power dissipation (P_d), Noise margins, Fan-out, and Speed-Power Product (SPP).
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-warm">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-stone-100/80 border-b border-border-warm text-stone-700 font-bold">
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4 bg-amber-50/50">Standard TTL (74)</th>
                <th className="py-3 px-4 bg-amber-50/50">Low-Power Schottky (74LS)</th>
                <th className="py-3 px-4 bg-amber-50/50">Advanced Schottky (74AS)</th>
                <th className="py-3 px-4 bg-sky-50/50">Standard CMOS (4000B)</th>
                <th className="py-3 px-4 bg-sky-50/50">High-Speed CMOS (74HC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-warm text-stone-600">
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Propagation Delay (t_pd)</td>
                <td className="py-2.5 px-4">10 ns</td>
                <td className="py-2.5 px-4">9 ns</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">1.7 ns (Ultra Fast)</td>
                <td className="py-2.5 px-4 text-rose-700">50 ns (Slow)</td>
                <td className="py-2.5 px-4">8 ns</td>
              </tr>
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Power Dissipation (P_d)</td>
                <td className="py-2.5 px-4">10 mW</td>
                <td className="py-2.5 px-4">2 mW</td>
                <td className="py-2.5 px-4 text-rose-700">8 mW</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">0.001 mW (Quiescent)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">0.002 mW (Static)</td>
              </tr>
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Noise Margin High (NM_H)</td>
                <td className="py-2.5 px-4">0.4 V (2.4 - 2.0)</td>
                <td className="py-2.5 px-4">0.7 V (2.7 - 2.0)</td>
                <td className="py-2.5 px-4">0.7 V</td>
                <td className="py-2.5 px-4 font-bold text-sky-700">1.5 V (High Immunity)</td>
                <td className="py-2.5 px-4 font-bold text-sky-700">1.4 V</td>
              </tr>
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Noise Margin Low (NM_L)</td>
                <td className="py-2.5 px-4">0.4 V (0.8 - 0.4)</td>
                <td className="py-2.5 px-4">0.4 V (0.8 - 0.4)</td>
                <td className="py-2.5 px-4">0.3 V</td>
                <td className="py-2.5 px-4 font-bold text-sky-700">1.5 V</td>
                <td className="py-2.5 px-4 font-bold text-sky-700">0.9 V</td>
              </tr>
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Fan-Out</td>
                <td className="py-2.5 px-4">10 gates</td>
                <td className="py-2.5 px-4">20 gates</td>
                <td className="py-2.5 px-4">40 gates</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">&gt; 50 (Capacitive)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">&gt; 50 (at DC)</td>
              </tr>
              <tr className="hover:bg-stone-50">
                <td className="py-2.5 px-4 font-bold text-stone-800">Speed-Power Product (SPP)</td>
                <td className="py-2.5 px-4">100 pJ</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">18 pJ</td>
                <td className="py-2.5 px-4">13.6 pJ</td>
                <td className="py-2.5 px-4">0.05 pJ (DC)</td>
                <td className="py-2.5 px-4 font-bold text-emerald-700">0.016 pJ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Sub-Section 2: Interactive TTL NAND Voltage Transfer Characteristic (VTC) */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              2. TTL NAND Gate Voltage Transfer Characteristic (VTC)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Drag input voltage V_in to inspect operating regions I–IV and the switching behavior of Totem-Pole transistors Q1, Q2, Q3, Q4.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {vtcRegion}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          
          {/* Slider & Voltage Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-canvas-cream p-5 rounded-2xl border border-border-warm space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="font-bold text-stone-700">Input Voltage (Vin):</span>
                  <span className="font-bold text-sky-800 text-base">{vIn.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.05"
                  value={vIn}
                  onChange={(e) => setVIn(parseFloat(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
                  <span>0.0V (LOW)</span>
                  <span>0.7V (Reg I/II)</span>
                  <span>1.4V (Threshold)</span>
                  <span>5.0V (HIGH)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border-warm flex items-center justify-between font-mono">
                <span className="text-xs text-stone-600">Output Voltage (Vout):</span>
                <span className="text-lg font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {vOut.toFixed(2)} V
                </span>
              </div>
            </div>

            {/* Region Explanation Box */}
            <div className="bg-[#faf6ee] p-4 rounded-2xl border border-border-warm space-y-2 text-xs text-stone-700 leading-relaxed">
              <div className="font-mono font-bold text-amber-800">
                Operating Details: {vtcRegion}
              </div>
              <p>{vtcExplanation}</p>
            </div>
          </div>

          {/* Totem-Pole Transistor States Monitor */}
          <div className="lg:col-span-6 bg-[#fcfbf9] rounded-2xl p-5 border border-border-warm space-y-3 font-mono text-xs">
            <div className="font-bold text-stone-800 border-b border-border-warm pb-2">
              Totem-Pole Internal Transistor States
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#faf6ee] p-3 rounded-xl border border-border-warm">
                <div className="text-[10px] text-stone-500">Q1: Multi-Emitter Input</div>
                <div className="font-bold text-stone-900 mt-1">{q1State}</div>
              </div>
              <div className="bg-[#faf6ee] p-3 rounded-xl border border-border-warm">
                <div className="text-[10px] text-stone-500">Q2: Phase Splitter</div>
                <div className="font-bold text-stone-900 mt-1">{q2State}</div>
              </div>
              <div className="bg-[#faf6ee] p-3 rounded-xl border border-border-warm">
                <div className="text-[10px] text-stone-500">Q3: Pull-Up (Darlington/Follower)</div>
                <div className="font-bold text-stone-900 mt-1">{q3State}</div>
              </div>
              <div className="bg-[#faf6ee] p-3 rounded-xl border border-border-warm">
                <div className="text-[10px] text-stone-500">Q4: Pull-Down Inverter</div>
                <div className="font-bold text-stone-900 mt-1">{q4State}</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-stone-600 leading-relaxed">
              <strong>Role of Series Diode D:</strong> Provides a 0.7V forward offset preventing both Q3 and Q4 from conducting simultaneously during logic transitions, protecting against severe supply current spikes.
            </div>
          </div>
        </div>

        {/* Transistor-Level Schematic Visual */}
        <div className="mt-8 pt-6 border-t border-border-warm">
          <TtlTotemPoleSchematic activeRegion={vtcRegion} />
        </div>
      </div>

      {/* Sub-Section 3: CMOS Complementary Switch Networks */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              3. CMOS Complementary Transistor Switch Networks
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              PMOS pull-up network (pulls output to VDD) vs NMOS pull-down network (pulls output to GND).
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
            {(['inverter', 'nand', 'nor'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setCmosType(type)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  cmosType === type ? 'bg-amber-200 text-amber-950 font-bold shadow-soft-sm' : 'text-stone-600 hover:bg-[#faf6ee]'
                }`}
              >
                CMOS {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <CmosSwitchSchematic gateType={cmosType} />
        </div>
      </div>

      {/* Sub-Section 4: TTL to CMOS Interfacing Simulator */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="pb-4 mb-6 border-b border-border-warm">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">
            Crucial Lab Concept
          </div>
          <h3 className="font-heading font-bold text-xl text-stone-900 mt-1">
            4. TTL-to-CMOS Interfacing: The Pull-Up Resistor Necessity
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Demonstrating why V_OH(min) = 2.4V &lt; 3.5V fails without an external pull-up resistor to +5V.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Standard TTL output guarantees V_OH(min) = 2.4V. However, standard 74HC CMOS inputs demand V_IH(min) = 0.7 × V_CC = 3.5V. Because 2.4V &lt; 3.5V, a direct connection leaves the CMOS gate in an <em>undefined, high-power floating condition</em>.
            </p>

            <div className="bg-canvas-cream p-4 rounded-2xl border border-border-warm">
              <ToggleSwitch
                checked={pullUpConnected}
                onChange={setPullUpConnected}
                label="10 kΩ Pull-Up Resistor to +5V"
                sublabel={pullUpConnected ? 'Connected (Resistor Active)' : 'Disconnected (Direct Coupling)'}
                accentColor="bg-emerald-600"
              />
            </div>
          </div>

          {/* Visual Coupling Stage */}
          <div className="lg:col-span-7 bg-[#fcfbf9] rounded-2xl p-6 border border-border-warm font-mono text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* TTL Stage */}
              <div className="bg-[#faf6ee] p-4 rounded-xl border border-border-warm text-center shadow-soft-sm">
                <div className="text-[10px] text-stone-400">STAGE 1: DRIVER</div>
                <div className="font-bold text-stone-900 text-sm mt-1">TTL Gate (74LS)</div>
                <div className="text-xs text-amber-700 mt-1">V_OH(min) = 2.40V</div>
              </div>

              {/* Coupling Line with Resistor Indicator */}
              <div className="flex flex-col items-center">
                <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                  pullUpConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {pullUpConnected ? '+5V Pull-up (10kΩ)' : 'No Pull-up'}
                </div>
                <ArrowRight className="w-5 h-5 text-stone-400 my-1" />
                <div className="font-bold text-stone-900">{effectiveVout.toFixed(2)} V</div>
              </div>

              {/* CMOS Stage */}
              <div className="bg-[#faf6ee] p-4 rounded-xl border border-border-warm text-center shadow-soft-sm">
                <div className="text-[10px] text-stone-400">STAGE 2: LOAD</div>
                <div className="font-bold text-stone-900 text-sm mt-1">CMOS Gate (74HC)</div>
                <div className="text-xs text-sky-700 mt-1">V_IH(min) = 3.50V</div>
              </div>
            </div>

            {/* Verdict Card */}
            <div className={`mt-5 p-3.5 rounded-xl border flex items-center gap-3 ${
              isCmosValidHigh
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              {isCmosValidHigh ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="leading-snug">
                {isCmosValidHigh ? (
                  <span>
                    <strong>Interface Succeeded:</strong> V_out ({effectiveVout.toFixed(2)}V) &ge; V_IH ({cmosVihThreshold}V). CMOS interprets signal as solid HIGH.
                  </span>
                ) : (
                  <span>
                    <strong>Interface Failed:</strong> V_out (2.40V) &lt; V_IH (3.50V). Voltage is in the indeterminate zone; toggle pull-up switch above to fix.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Section 4: PAL vs PLA Programmable Logic Matrix */}
      <div className="bg-[#fbf7ee] rounded-3xl p-6 sm:p-8 border border-border-warm shadow-soft-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border-warm">
          <div>
            <h3 className="font-heading font-bold text-xl text-stone-900">
              4. Programmable Logic Devices: PAL vs PLA Matrix
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click fuse cross-points to configure AND product terms and compare fixed vs programmable arrays.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-canvas-warm p-1 rounded-2xl border border-border-warm">
            <button
              onClick={() => setFuseMatrixType('PAL')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                fuseMatrixType === 'PAL' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-stone-600 hover:bg-[#faf6ee]'
              }`}
            >
              PAL (Prog AND, Fixed OR)
            </button>
            <button
              onClick={() => setFuseMatrixType('PLA')}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                fuseMatrixType === 'PLA' ? 'bg-amber-200 text-amber-950 font-bold' : 'text-stone-600 hover:bg-[#faf6ee]'
              }`}
            >
              PLA (Prog AND, Prog OR)
            </button>
          </div>
        </div>

        {/* Matrix Theory Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs text-stone-700">
          <div className="bg-canvas-cream p-4 rounded-2xl border border-border-warm">
            <div className="font-mono font-bold text-stone-900 mb-1">
              PAL (Programmable Array Logic)
            </div>
            <p className="leading-relaxed">
              Programmable AND array feeding a <strong>FIXED OR array</strong>. Cheaper, lower propagation delay, easier to program, but product terms cannot be shared across multiple outputs.
            </p>
          </div>
          <div className="bg-canvas-cream p-4 rounded-2xl border border-border-warm">
            <div className="font-mono font-bold text-stone-900 mb-1">
              PLA (Programmable Logic Array)
            </div>
            <p className="leading-relaxed">
              <strong>Both AND array and OR array are programmable</strong>. Maximum flexibility for complex multi-output Boolean equations; product terms can be freely shared among OR gates.
            </p>
          </div>
        </div>

        {/* CPLD vs FPGA Brief Comparison */}
        <div className="mt-6 pt-6 border-t border-border-warm">
          <h4 className="font-heading font-bold text-sm text-stone-800 mb-3">
            CPLD vs FPGA Architectural Distinction:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#faf6ee] p-3.5 rounded-xl border border-border-warm">
              <span className="font-bold text-amber-800">CPLD (Complex PLD):</span>
              <p className="text-stone-600 text-[11px] mt-1 font-sans">
                Non-volatile (instant-on), predictable deterministic timing delays, coarse-grained Macrocell architecture based on PAL-like structures.
              </p>
            </div>
            <div className="bg-[#faf6ee] p-3.5 rounded-xl border border-border-warm">
              <span className="font-bold text-sky-800">FPGA (Field-Programmable Gate Array):</span>
              <p className="text-stone-600 text-[11px] mt-1 font-sans">
                Volatile (SRAM based, requires boot PROM), high logic density (millions of gates), fine-grained Configurable Logic Blocks (CLBs) with Look-Up Tables (LUTs).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
