import React from 'react';

/**
 * High-resolution, responsive, soft and vibrant vector illustrations
 * for core Digital System Design analogies and concepts.
 */

// 1. Combinational vs Sequential Logic (Flashlight vs Smartphone Memory)
export const CombinationalVsSequentialIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-brand-50/80 via-mod4-light/50 to-mod2-light/40 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-brand-100 dark:border-darklab-border p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Combinational: Flashlight */}
        <div className="rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border p-4 flex flex-col items-center text-center space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">
              Combinational = Flashlight (No Memory)
            </span>
          </div>

          <svg viewBox="0 0 320 130" className="w-full max-w-[280px] h-auto drop-shadow-xs">
            {/* Input Switch */}
            <rect x="20" y="45" width="60" height="38" rx="10" fill="#4F7CFF" stroke="#3B82F6" strokeWidth="2" />
            <text x="50" y="68" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">SWITCH</text>

            {/* Wire to Gate */}
            <line x1="80" y1="64" x2="130" y2="64" stroke="#4F7CFF" strokeWidth="2.5" strokeDasharray="4 2" />
            <polygon points="126,60 134,64 126,68" fill="#4F7CFF" />

            {/* Logic Cloud / Gate */}
            <rect x="134" y="38" width="70" height="52" rx="12" fill="#EBF1FF" stroke="#4F7CFF" strokeWidth="2" />
            <text x="169" y="62" fill="#1E3A8A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Direct</text>
            <text x="169" y="76" fill="#4F7CFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Logic</text>

            {/* Wire to Output */}
            <line x1="204" y1="64" x2="245" y2="64" stroke="#4F7CFF" strokeWidth="2.5" />

            {/* Bulb */}
            <circle cx="270" cy="64" r="20" fill="#FEF08A" stroke="#EAB308" strokeWidth="2.5" />
            <path d="M262 76 L278 76" stroke="#CA8A04" strokeWidth="3" />
            {/* Glow rays */}
            <line x1="270" y1="36" x2="270" y2="30" stroke="#FACC15" strokeWidth="2" />
            <line x1="290" y1="44" x2="295" y2="39" stroke="#FACC15" strokeWidth="2" />
            <line x1="298" y1="64" x2="304" y2="64" stroke="#FACC15" strokeWidth="2" />
            <text x="270" y="68" fill="#854D0E" fontSize="11" fontWeight="black" textAnchor="middle">ON</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            Output depends <strong className="text-brand-600 dark:text-brand-300">ONLY on present input</strong>. Release the button, and it immediately turns OFF and forgets.
          </p>
        </div>

        {/* Sequential: Smartphone / Flip-Flop with Feedback */}
        <div className="rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border p-4 flex flex-col items-center text-center space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-mod4 animate-pulse" />
            <span className="text-xs font-mono font-bold text-mod4-dark dark:text-mod4 uppercase tracking-wider">
              Sequential = Smartphone (Has Memory)
            </span>
          </div>

          <svg viewBox="0 0 320 130" className="w-full max-w-[280px] h-auto drop-shadow-xs">
            {/* Input Button */}
            <rect x="15" y="45" width="55" height="36" rx="10" fill="#9D7BFF" stroke="#7C3AED" strokeWidth="2" />
            <text x="42.5" y="67" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">INPUT</text>

            {/* Wire to Logic */}
            <line x1="70" y1="63" x2="105" y2="63" stroke="#9D7BFF" strokeWidth="2" />

            {/* Combinational Logic Block */}
            <rect x="105" y="40" width="60" height="46" rx="10" fill="#F3EEFF" stroke="#9D7BFF" strokeWidth="1.5" />
            <text x="135" y="67" fill="#6333D9" fontSize="10" fontWeight="bold" textAnchor="middle">Comb. Logic</text>

            {/* Wire to Memory */}
            <line x1="165" y1="63" x2="195" y2="63" stroke="#9D7BFF" strokeWidth="2" />

            {/* Memory Flip-Flop */}
            <rect x="195" y="35" width="60" height="56" rx="10" fill="#FFEAEF" stroke="#FF6B7A" strokeWidth="2" />
            <text x="225" y="58" fill="#C92A3E" fontSize="10" fontWeight="bold" textAnchor="middle">MEMORY</text>
            <text x="225" y="74" fill="#FF6B7A" fontSize="9" fontWeight="bold" textAnchor="middle">(Flip-Flop)</text>

            {/* Clock Input bottom */}
            <line x1="225" y1="110" x2="225" y2="91" stroke="#FF6B7A" strokeWidth="2" />
            <polygon points="220,91 225,84 230,91" fill="none" stroke="#FF6B7A" strokeWidth="1.5" />
            <text x="225" y="122" fill="#C92A3E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">CLK</text>

            {/* Output Wire */}
            <line x1="255" y1="63" x2="295" y2="63" stroke="#0E8A54" strokeWidth="2.5" />
            <circle cx="298" cy="63" r="4" fill="#3DDC97" stroke="#0E8A54" strokeWidth="1" />
            <text x="298" y="52" fill="#0E8A54" fontSize="10" fontWeight="bold" textAnchor="middle">Q</text>

            {/* Feedback Loop wire back to logic */}
            <path d="M 275 63 L 275 20 L 135 20 L 135 40" fill="none" stroke="#FFB347" strokeWidth="2" strokeDasharray="3 2" />
            <polygon points="131,34 135,42 139,34" fill="#FFB347" />
            <text x="205" y="15" fill="#B86800" fontSize="8" fontWeight="bold" textAnchor="middle">Stored Past State Loop</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            Output depends on <strong className="text-mod4-dark dark:text-mod4">present inputs AND past history</strong> stored in the memory feedback loop!
          </p>
        </div>
      </div>
    </div>
  );
};

// 2. Latches vs Flip-Flops (Open Door vs Camera Snapshot)
export const LatchVsFlipFlopIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod2-light/60 via-brand-50/50 to-mod3-light/50 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod2/30 dark:border-darklab-border p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latch = Open Door */}
        <div className="rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border p-4 flex flex-col items-center text-center space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider">
              1. Latch = The Open Door (Level Sensitive)
            </span>
          </div>

          <svg viewBox="0 0 300 130" className="w-full max-w-[270px] h-auto">
            {/* Doorway frame */}
            <rect x="70" y="20" width="80" height="90" rx="8" fill="#FFF4E0" stroke="#FFB347" strokeWidth="2" />
            {/* Swinging door open */}
            <polygon points="70,20 120,35 120,105 70,110" fill="#FFB347" stroke="#B86800" strokeWidth="1.5" />
            <circle cx="112" cy="70" r="3" fill="#FFF4E0" />

            {/* People flow freely */}
            <path d="M 20 65 L 180 65" stroke="#FFB347" strokeWidth="2.5" strokeDasharray="5 3" />
            <polygon points="175,60 185,65 175,70" fill="#FFB347" />

            <rect x="195" y="45" width="85" height="42" rx="10" fill="#FFF8EC" stroke="#FFB347" strokeWidth="1.5" />
            <text x="237" y="63" fill="#B86800" fontSize="10" fontWeight="bold" textAnchor="middle">Enable = HIGH</text>
            <text x="237" y="78" fill="#9A3412" fontSize="9" textAnchor="middle">Transparent!</text>

            <text x="110" y="124" fill="#B86800" fontSize="10" fontWeight="bold" textAnchor="middle">Any input flows through!</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            While Enable is HIGH, the door stays wide open. Any changes, twitches, or glitches at the input slip straight through to output!
          </p>
        </div>

        {/* Flip-Flop = Camera Snapshot */}
        <div className="rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border p-4 flex flex-col items-center text-center space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">
              2. Flip-Flop = Camera Snapshot (Edge Triggered)
            </span>
          </div>

          <svg viewBox="0 0 300 130" className="w-full max-w-[270px] h-auto">
            {/* Camera Body */}
            <rect x="60" y="35" width="110" height="70" rx="14" fill="#F4F7FF" stroke="#4F7CFF" strokeWidth="2" />
            <rect x="95" y="24" width="40" height="12" rx="4" fill="#D4E0FF" stroke="#4F7CFF" strokeWidth="1.5" />
            {/* Lens */}
            <circle cx="115" cy="70" r="24" fill="#EBF1FF" stroke="#4F7CFF" strokeWidth="2" />
            <circle cx="115" cy="70" r="14" fill="#4F7CFF" />

            {/* Flash burst */}
            <polygon points="150,24 165,15 158,28 175,22 155,38" fill="#FFB347" stroke="#B86800" strokeWidth="1" />

            {/* Clock edge waveform */}
            <path d="M 195 85 L 215 85 L 215 45 L 235 45 L 235 85 L 255 85" fill="none" stroke="#4F7CFF" strokeWidth="2" />
            {/* Arrow pointing at rising edge */}
            <line x1="215" y1="100" x2="215" y2="55" stroke="#FF6B7A" strokeWidth="2" />
            <polygon points="211,60 215,48 219,60" fill="#FF6B7A" />
            <text x="215" y="115" fill="#C92A3E" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Rising Edge &uarr;</text>

            <text x="115" y="122" fill="#4F7CFF" fontSize="10" fontWeight="bold" textAnchor="middle">Captures only at the instant of flash!</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            Ignores inputs before and after. It takes a frozen photograph only on the nanosecond that the clock edge triggers!
          </p>
        </div>
      </div>
    </div>
  );
};

// 3. The 4 Flip-Flop Personalities (SR, JK, D, T)
export const FlipFlopPersonalitiesIllustration: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* SR */}
      <div className="rounded-xl bg-[#faf6ee] dark:bg-slate-950/90 border border-[#dfd2be] dark:border-rose-500/30 p-4 space-y-2 text-center shadow-sm">
        <div className="w-9 h-9 mx-auto rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold text-sm font-mono border border-rose-500/30">
          SR
        </div>
        <div className="font-bold text-xs text-rose-800 dark:text-rose-300">The Power Switch</div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">S=1</strong> turns it ON. <strong className="text-slate-900 dark:text-white">R=1</strong> turns it OFF. But pressing both (<strong className="text-rose-700 dark:text-rose-400">S=R=1</strong>) is FORBIDDEN!
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#f4ece0] dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-[#dfd2be] dark:border-rose-500/30">
          Q+ = S + R&apos;Q (SR=0)
        </span>
      </div>

      {/* JK */}
      <div className="rounded-xl bg-[#faf6ee] dark:bg-slate-950/90 border border-[#dfd2be] dark:border-cyan-500/30 p-4 space-y-2 text-center shadow-sm">
        <div className="w-9 h-9 mx-auto rounded-lg bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-sm font-mono border border-cyan-500/30">
          JK
        </div>
        <div className="font-bold text-xs text-cyan-800 dark:text-cyan-300">The Click Pen</div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Fixes SR! When <strong className="text-slate-900 dark:text-white">J=K=1</strong>, it behaves like clicking a ballpoint pen: toggles between 0 and 1 cleanly.
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#f4ece0] dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-[#dfd2be] dark:border-cyan-500/30">
          Q+ = JQ&apos; + K&apos;Q
        </span>
      </div>

      {/* D */}
      <div className="rounded-xl bg-[#faf6ee] dark:bg-slate-950/90 border border-[#dfd2be] dark:border-emerald-500/30 p-4 space-y-2 text-center shadow-sm">
        <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm font-mono border border-emerald-500/30">
          D
        </div>
        <div className="font-bold text-xs text-emerald-800 dark:text-emerald-300">The 1-Bit Safe</div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Data transparent delay. Whatever bit is waiting at input <strong className="text-slate-900 dark:text-white">D</strong> gets locked inside on the clock edge!
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#f4ece0] dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-[#dfd2be] dark:border-emerald-500/30">
          Q+ = D
        </span>
      </div>

      {/* T */}
      <div className="rounded-xl bg-[#faf6ee] dark:bg-slate-950/90 border border-[#dfd2be] dark:border-amber-500/30 p-4 space-y-2 text-center shadow-sm">
        <div className="w-9 h-9 mx-auto rounded-lg bg-amber-500/15 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm font-mono border border-amber-500/30">
          T
        </div>
        <div className="font-bold text-xs text-amber-800 dark:text-amber-300">The Light Dimmer</div>
        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Toggle control. When <strong className="text-slate-900 dark:text-white">T=0</strong>, hold value. When <strong className="text-slate-900 dark:text-white">T=1</strong>, invert value (divide clock by 2!).
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#f4ece0] dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-[#dfd2be] dark:border-amber-500/30">
          Q+ = T &oplus; Q
        </span>
      </div>
    </div>
  );
};

// 4. Race-Around & Master-Slave Submarine Airlock
export const MasterSlaveAirlockIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod1-light/60 via-cream-paper to-mod3-light/60 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod1/25 dark:border-darklab-border p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 uppercase tracking-wider">
            The Submarine Airlock: How Master-Slave Eliminates Race-Around
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phase 1: Clock HIGH */}
        <div className="p-3.5 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-mod2-dark dark:text-mod2">
            <span>Phase 1: Clock = HIGH (1)</span>
            <span className="px-2 py-0.5 rounded-full bg-mod2-light text-mod2-dark border border-mod2/30 text-[10px]">Master Active</span>
          </div>

          <svg viewBox="0 0 280 90" className="w-full h-auto">
            {/* Submarine Hull */}
            <rect x="20" y="15" width="240" height="60" rx="12" fill="#FFFDF9" stroke="#E2DCD2" strokeWidth="2" />

            {/* Master Chamber (Stage 1) */}
            <rect x="40" y="25" width="80" height="40" rx="8" fill="#EBF1FF" stroke="#4F7CFF" strokeWidth="1.5" />
            <text x="80" y="48" fill="#1E40AF" fontSize="10" fontWeight="bold" textAnchor="middle">MASTER</text>
            <text x="80" y="60" fill="#2563EB" fontSize="8" textAnchor="middle">Door OPEN &radic;</text>

            {/* In-Between Sealed Wall */}
            <line x1="140" y1="15" x2="140" y2="75" stroke="#FF6B7A" strokeWidth="3" strokeDasharray="3 3" />

            {/* Slave Chamber (Stage 2) */}
            <rect x="160" y="25" width="80" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="200" y="48" fill="#64748B" fontSize="10" fontWeight="bold" textAnchor="middle">SLAVE</text>
            <text x="200" y="60" fill="#C92A3E" fontSize="8" textAnchor="middle">LOCKED &times;</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            Data enters the Master room, but <strong className="text-mod1-dark dark:text-mod1">cannot reach output</strong> because the Slave door is bolted shut!
          </p>
        </div>

        {/* Phase 2: Clock LOW */}
        <div className="p-3.5 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-mod3-dark dark:text-mod3">
            <span>Phase 2: Clock = LOW (0)</span>
            <span className="px-2 py-0.5 rounded-full bg-mod3-light text-mod3-dark border border-mod3/30 text-[10px]">Slave Active</span>
          </div>

          <svg viewBox="0 0 280 90" className="w-full h-auto">
            {/* Submarine Hull */}
            <rect x="20" y="15" width="240" height="60" rx="12" fill="#FFFDF9" stroke="#E2DCD2" strokeWidth="2" />

            {/* Master Chamber (Stage 1) */}
            <rect x="40" y="25" width="80" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <text x="80" y="48" fill="#64748B" fontSize="10" fontWeight="bold" textAnchor="middle">MASTER</text>
            <text x="80" y="60" fill="#C92A3E" fontSize="8" textAnchor="middle">LOCKED &times;</text>

            {/* In-Between Open Wall */}
            <line x1="140" y1="15" x2="140" y2="75" stroke="#3DDC97" strokeWidth="3" strokeDasharray="3 3" />

            {/* Slave Chamber (Stage 2) */}
            <rect x="160" y="25" width="80" height="40" rx="8" fill="#E6FAF1" stroke="#3DDC97" strokeWidth="1.5" />
            <text x="200" y="48" fill="#0E8A54" fontSize="10" fontWeight="bold" textAnchor="middle">SLAVE</text>
            <text x="200" y="60" fill="#059669" fontSize="8" textAnchor="middle">Door OPEN &radic;</text>
          </svg>

          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-tight">
            Master locks shut. Now the Slave door opens, transferring the clean data to the output. <strong className="text-mod3-dark dark:text-mod3">Racing is impossible!</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

// 5. Shift Register Bucket Brigade (SISO, SIPO, PISO, PIPO)
export const ShiftRegisterBucketBrigadeIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-brand-50/70 via-cream-paper to-mod4-light/50 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-brand-100 dark:border-darklab-border p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider">
          Shift Registers = The Firefighting Bucket Brigade
        </span>
      </div>

      <svg viewBox="0 0 500 110" className="w-full h-auto drop-shadow-xs">
        {/* 4 Stages: Stage 3, Stage 2, Stage 1, Stage 0 */}
        {[0, 1, 2, 3].map((idx) => {
          const x = 50 + idx * 105;
          return (
            <g key={idx}>
              {/* Person Body */}
              <circle cx={x + 35} cy="30" r="12" fill="#4F7CFF" stroke="#3B82F6" strokeWidth="1.5" />
              <rect x={x + 15} y="44" width="40" height="36" rx="8" fill="#EBF1FF" stroke="#4F7CFF" strokeWidth="1.5" />
              <text x={x + 35} y="66" fill="#1E40AF" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                FF{3 - idx}
              </text>

              {/* Bucket being passed */}
              {idx < 3 && (
                <g transform={`translate(${x + 65}, 46)`}>
                  <polygon points="5,0 25,0 20,20 10,20" fill="#FFB347" stroke="#B86800" strokeWidth="1" />
                  <line x1="2" y1="0" x2="28" y2="0" stroke="#FFB347" strokeWidth="2" />
                  <path d="M 28 10 L 38 10" stroke="#3DDC97" strokeWidth="2" />
                  <polygon points="36,7 41,10 36,13" fill="#3DDC97" />
                </g>
              )}
            </g>
          );
        })}

        {/* Input Arrow */}
        <path d="M 10 62 L 45 62" stroke="#4F7CFF" strokeWidth="2.5" />
        <polygon points="42,58 48,62 42,66" fill="#4F7CFF" />
        <text x="25" y="52" fill="#4F7CFF" fontSize="9" fontWeight="bold" textAnchor="middle">SERIAL IN</text>

        {/* Output Arrow */}
        <path d="M 405 62 L 445 62" stroke="#0E8A54" strokeWidth="2.5" />
        <polygon points="442,58 448,62 442,66" fill="#0E8A54" />
        <text x="430" y="52" fill="#0E8A54" fontSize="9" fontWeight="bold" textAnchor="middle">SERIAL OUT</text>

        {/* Shared Clock Beat at bottom */}
        <line x1="50" y1="95" x2="400" y2="95" stroke="#9D7BFF" strokeWidth="2" strokeDasharray="4 2" />
        <text x="235" y="106" className="fill-mod4-dark dark:fill-mod4" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          ON EVERY CLOCK TICK: BUCKET SHIFTS 1 HAND RIGHT &rarr;
        </text>
      </svg>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] pt-1">
        <div className="p-2 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted">
          <strong className="text-brand-600 dark:text-brand-300 block font-mono">SISO</strong>
          1 bucket in, 1 bucket out.
        </div>
        <div className="p-2 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted">
          <strong className="text-mod3-dark dark:text-mod3 block font-mono">SIPO</strong>
          Fill one-by-one, dump all at once.
        </div>
        <div className="p-2 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted">
          <strong className="text-mod2-dark dark:text-mod2 block font-mono">PISO</strong>
          Fill all at once, empty one-by-one.
        </div>
        <div className="p-2 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-muted">
          <strong className="text-mod4-dark dark:text-mod4 block font-mono">PIPO</strong>
          Fill all together, dump all together.
        </div>
      </div>
    </div>
  );
};

// 6. Ring vs Johnson Counter (Carousel vs Twisted Mobius Strip)
export const RingVsJohnsonCounterIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#f5f0fe] via-[#fff5eb] to-[#edf0fe] dark:from-purple-950/30 dark:via-slate-900/70 dark:to-pink-950/30 border border-[#e5d5fd] dark:border-purple-500/20 p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ring Counter */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 text-center shadow-xs">
          <span className="text-xs font-mono font-bold text-mod4-dark dark:text-mod4 uppercase tracking-wider block">
            Ring Counter = Merry-Go-Round Horse
          </span>
          <svg viewBox="0 0 240 100" className="w-full max-w-[220px] mx-auto h-auto">
            {/* Circular Track */}
            <ellipse cx="120" cy="50" rx="90" ry="35" fill="none" stroke="#9D7BFF" strokeWidth="2" strokeDasharray="5 3" />

            {/* Glowing circulating bit 1 */}
            <circle cx="120" cy="15" r="10" fill="#9D7BFF" stroke="#F3EEFF" strokeWidth="2" className="animate-pulse" />
            <text x="120" y="19" fill="#ffffff" fontSize="10" fontWeight="black" textAnchor="middle">1</text>

            {/* Zero bits */}
            <circle cx="210" cy="50" r="8" fill="#F3EEFF" stroke="#9D7BFF" strokeWidth="1.5" />
            <text x="210" y="53" fill="#6333D9" fontSize="9" textAnchor="middle">0</text>
            <circle cx="120" cy="85" r="8" fill="#F3EEFF" stroke="#9D7BFF" strokeWidth="1.5" />
            <text x="120" y="88" fill="#6333D9" fontSize="9" textAnchor="middle">0</text>
            <circle cx="30" cy="50" r="8" fill="#F3EEFF" stroke="#9D7BFF" strokeWidth="1.5" />
            <text x="30" y="53" fill="#6333D9" fontSize="9" textAnchor="middle">0</text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted">
            A single 1 circulates endlessly like a carousel. A 4-bit ring gives exactly <strong className="text-mod4-dark dark:text-mod4">4 states</strong> (1000 &rarr; 0100 &rarr; 0010 &rarr; 0001).
          </p>
        </div>

        {/* Johnson Counter */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 text-center shadow-xs">
          <span className="text-xs font-mono font-bold text-mod1-dark dark:text-mod1 uppercase tracking-wider block">
            Johnson Counter = Twisted M&ouml;bius Strip
          </span>
          <svg viewBox="0 0 240 100" className="w-full max-w-[220px] mx-auto h-auto">
            {/* Figure-8 twisted Mobius loop */}
            <path d="M 40 30 Q 120 70 200 30 Q 200 70 120 50 Q 40 70 40 30" fill="none" stroke="#FF6B7A" strokeWidth="2" />

            {/* Inverter Bubble on feedback wire */}
            <circle cx="120" cy="50" r="6" fill="#FF6B7A" stroke="#ffffff" strokeWidth="1.5" />
            <text x="120" y="66" fill="#C92A3E" fontSize="9" fontWeight="bold" textAnchor="middle">NOT</text>

            <rect x="15" y="20" width="30" height="20" rx="6" fill="#FFEAEF" stroke="#FF6B7A" strokeWidth="1.5" />
            <text x="30" y="34" fill="#C92A3E" fontSize="9" fontWeight="bold" textAnchor="middle">FF0</text>

            <rect x="195" y="20" width="30" height="20" rx="6" fill="#FFEAEF" stroke="#FF6B7A" strokeWidth="1.5" />
            <text x="210" y="34" fill="#C92A3E" fontSize="9" fontWeight="bold" textAnchor="middle">FF3</text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted">
            The inverted feedback twists the sequence! A 4-bit Johnson counter produces <strong className="text-mod1-dark dark:text-mod1">8 unique states (2N)</strong> with zero extra logic gates.
          </p>
        </div>
      </div>
    </div>
  );
};

// 7. Ripple vs Synchronous Counters (Falling Dominoes vs Dance Squad)
export const RippleVsSynchronousCounterIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod2-light/60 via-cream-paper to-mod3-light/60 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod2/30 dark:border-darklab-border p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ripple Dominoes */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider block">
            1. Ripple (Asynchronous) = Falling Dominoes
          </span>
          <svg viewBox="0 0 280 85" className="w-full h-auto">
            {/* 3 Dominoes toppling sequentially */}
            <rect x="40" y="25" width="12" height="40" rx="3" fill="#FFB347" stroke="#B86800" strokeWidth="1" transform="rotate(15 46 45)" />
            <rect x="110" y="25" width="12" height="40" rx="3" fill="#FFB347" stroke="#B86800" strokeWidth="1" transform="rotate(25 116 45)" />
            <rect x="180" y="25" width="12" height="40" rx="3" fill="#FFB347" stroke="#B86800" strokeWidth="1" transform="rotate(35 186 45)" />

            <path d="M 20 65 L 40 65" stroke="#FFB347" strokeWidth="2" />
            <path d="M 60 45 Q 85 45 105 45" stroke="#FFB347" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 130 45 Q 155 45 175 45" stroke="#FFB347" strokeWidth="1.5" strokeDasharray="3 2" />

            <text x="140" y="80" className="fill-mod2-dark dark:fill-mod2" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Total Delay = t_pd1 + t_pd2 + t_pd3
            </text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-relaxed">
            Each stage must wait for the preceding stage to finish flipping. Simple design, but delay adds up: <span className="text-mod2-dark dark:text-mod2 font-mono font-bold">N &times; t_pd</span>.
          </p>
        </div>

        {/* Synchronous Dance Squad */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 uppercase tracking-wider block">
            2. Synchronous = Synchronized Dance Squad
          </span>
          <svg viewBox="0 0 280 85" className="w-full h-auto">
            {/* 3 Dancers jumping simultaneously */}
            {[45, 125, 205].map((x, i) => (
              <g key={i}>
                <circle cx={x + 6} cy="25" r="8" fill="#3DDC97" stroke="#0E8A54" strokeWidth="1.5" />
                <rect x={x} y="36" width="12" height="24" rx="3" fill="#0E8A54" />
                {/* Clock branch */}
                <line x1={x + 6} y1="65" x2={x + 6} y2="75" stroke="#0E8A54" strokeWidth="2" />
              </g>
            ))}

            {/* Master Clock Bus */}
            <line x1="20" y1="75" x2="250" y2="75" stroke="#0E8A54" strokeWidth="2.5" />
            <text x="20" y="70" fill="#0E8A54" fontSize="9" fontWeight="bold">CLK</text>
            <text x="140" y="15" className="fill-mod3-dark dark:fill-mod3" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              ALL SWITCH ON THE SAME BEAT!
            </text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted leading-relaxed">
            All flip-flops share the exact same clock wire. When the beat hits, all flip-flops switch simultaneously in just <span className="text-mod3-dark dark:text-mod3 font-mono font-bold">1 &times; t_pd</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

// 8. TTL vs CMOS (Muscle Car vs Tesla Electric Vehicle)
export const TtlVsCmosCarIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod2-light/60 via-cream-paper to-brand-50/70 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod2/30 dark:border-darklab-border p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Muscle Car (TTL) */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 text-center shadow-xs">
          <span className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider block">
            TTL = Classic V8 Muscle Car
          </span>
          <svg viewBox="0 0 240 80" className="w-full max-w-[210px] mx-auto h-auto">
            {/* Car body */}
            <rect x="40" y="35" width="160" height="28" rx="8" fill="#FFB347" stroke="#B86800" strokeWidth="2" />
            <polygon points="70,35 90,18 160,18 175,35" fill="#FFF4E0" stroke="#B86800" strokeWidth="1.5" />
            {/* Wheels */}
            <circle cx="75" cy="63" r="10" fill="#475569" stroke="#FFB347" strokeWidth="2" />
            <circle cx="165" cy="63" r="10" fill="#475569" stroke="#FFB347" strokeWidth="2" />
            {/* Exhaust smoke */}
            <circle cx="28" cy="45" r="5" fill="#94A3B8" opacity="0.6" />
            <circle cx="18" cy="40" r="8" fill="#94A3B8" opacity="0.4" />
            <text x="125" y="30" fill="#B86800" fontSize="8" fontWeight="bold">BJT TRANSISTORS</text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted">
            <strong className="text-mod2-dark dark:text-mod2">Fast reflexes</strong>, but burns constant static fuel (~10mW) even while parked in neutral!
          </p>
        </div>

        {/* Tesla EV (CMOS) */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 text-center shadow-xs">
          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider block">
            CMOS = Modern Electric Tesla
          </span>
          <svg viewBox="0 0 240 80" className="w-full max-w-[210px] mx-auto h-auto">
            {/* Sleek EV body */}
            <path d="M 40 50 Q 80 20 160 20 Q 200 40 205 52 L 40 52 Z" fill="#4F7CFF" stroke="#3B82F6" strokeWidth="2" />
            <rect x="40" y="48" width="165" height="15" rx="4" fill="#3B82F6" stroke="#4F7CFF" strokeWidth="1" />
            {/* Wheels */}
            <circle cx="75" cy="63" r="10" fill="#475569" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="165" cy="63" r="10" fill="#475569" stroke="#60A5FA" strokeWidth="2" />
            {/* Electric lightning bolt */}
            <polygon points="120,8 112,22 119,22 114,34 128,18 121,18" fill="#FACC15" />
            <text x="125" y="44" fill="#ffffff" fontSize="8" fontWeight="bold">MOSFET GATES</text>
          </svg>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted">
            <strong className="text-brand-600 dark:text-brand-300">Near-zero idle drain (~0.01mW)</strong>. Only draws power from battery when accelerating (switching states)!
          </p>
        </div>
      </div>
    </div>
  );
};

// 9. Subway Turnstile FSM Illustration
export const SubwayTurnstileFsmIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod3-light/60 via-cream-paper to-brand-50/60 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod3/30 dark:border-darklab-border p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 uppercase tracking-wider">
          Finite State Machines = The Subway Turnstile
        </span>
      </div>

      <svg viewBox="0 0 460 130" className="w-full h-auto drop-shadow-xs">
        {/* State 1: LOCKED */}
        <circle cx="110" cy="65" r="38" fill="#FFEAEF" stroke="#FF6B7A" strokeWidth="3" />
        <text x="110" y="60" fill="#C92A3E" fontSize="11" fontWeight="bold" textAnchor="middle">LOCKED</text>
        <text x="110" y="74" fill="#FF6B7A" fontSize="9" textAnchor="middle">Output = BARRIER</text>

        {/* State 2: UNLOCKED */}
        <circle cx="350" cy="65" r="38" fill="#E6FAF1" stroke="#3DDC97" strokeWidth="3" />
        <text x="350" y="60" fill="#0E8A54" fontSize="11" fontWeight="bold" textAnchor="middle">UNLOCKED</text>
        <text x="350" y="74" fill="#3DDC97" fontSize="9" textAnchor="middle">Output = FREE PASS</text>

        {/* Transition from LOCKED to UNLOCKED (Coin inserted) */}
        <path d="M 145 45 Q 230 15 315 45" fill="none" stroke="#FFB347" strokeWidth="2.5" />
        <polygon points="312,40 322,47 313,52" fill="#FFB347" />
        <text x="230" y="24" className="fill-mod2-dark dark:fill-mod2" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Coin inserted &rarr;
        </text>

        {/* Transition from UNLOCKED to LOCKED (Person pushed through) */}
        <path d="M 315 85 Q 230 115 145 85" fill="none" stroke="#4F7CFF" strokeWidth="2.5" />
        <polygon points="148,80 138,87 147,92" fill="#4F7CFF" />
        <text x="230" y="122" className="fill-brand-600 dark:fill-brand-300" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          &larr; Person pushes through
        </text>

        {/* Self Loop on LOCKED (Push while locked) */}
        <path d="M 75 50 C 35 20, 35 95, 75 80" fill="none" stroke="#FF6B7A" strokeWidth="1.5" />
        <polygon points="76,84 82,78 74,75" fill="#FF6B7A" />
        <text x="45" y="108" className="fill-mod1-dark dark:fill-mod1" fontSize="8" textAnchor="middle">Push (Denied)</text>

        {/* Self Loop on UNLOCKED (Coin while unlocked) */}
        <path d="M 385 50 C 425 20, 425 95, 385 80" fill="none" stroke="#3DDC97" strokeWidth="1.5" />
        <polygon points="384,75 378,82 386,85" fill="#3DDC97" />
        <text x="415" y="108" className="fill-mod3-dark dark:fill-mod3" fontSize="8" textAnchor="middle">Coin (Already free)</text>
      </svg>

      <p className="text-[11px] text-ink-700 dark:text-cream-muted text-center">
        An FSM only lives in one state at a time. Your inputs trigger deterministic transitions between states!
      </p>
    </div>
  );
};

// 10. Verilog Hardware Wires vs Sequential Software Code
export const VerilogWiresVsCodeIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-brand-50/70 via-cream-paper to-mod4-light/50 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-brand-100 dark:border-darklab-border p-4 sm:p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sequential Software */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-ink-800 dark:text-cream-paper uppercase tracking-wider block">
            Software (C / Python) = Sequential Recipe
          </span>
          <div className="p-3 rounded-xl bg-cream-soft dark:bg-darklab-card font-mono text-[11px] text-ink-800 dark:text-cream-paper space-y-1">
            <div className="text-mod3-dark dark:text-mod3">1. a = 5;</div>
            <div className="text-mod3-dark dark:text-mod3">2. b = a + 2; <span className="text-ink-500 dark:text-cream-muted">// waits for step 1</span></div>
            <div className="text-mod3-dark dark:text-mod3">3. c = b * 3; <span className="text-ink-500 dark:text-cream-muted">// waits for step 2</span></div>
          </div>
          <p className="text-[11px] text-ink-600 dark:text-cream-muted">
            A single CPU core executes instructions one by one in chronological order.
          </p>
        </div>

        {/* Verilog Hardware */}
        <div className="p-4 rounded-2xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border space-y-2 shadow-xs">
          <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-300 uppercase tracking-wider block">
            Verilog HDL = Parallel Copper Wires!
          </span>
          <div className="p-3 rounded-xl bg-cream-soft dark:bg-darklab-card font-mono text-[11px] text-brand-700 dark:text-brand-300 space-y-1">
            <div>assign w1 = in_a &amp; in_b;</div>
            <div>assign w2 = in_c | in_d;</div>
            <div className="text-mod4-dark dark:text-mod4">// BOTH WIRES CARRY CURRENT SIMULTANEOUSLY!</div>
          </div>
          <p className="text-[11px] text-ink-700 dark:text-cream-muted">
            Verilog defines physical silicon circuits! Every gate and wire runs <strong className="text-brand-600 dark:text-brand-300">at the exact same time</strong> in parallel.
          </p>
        </div>
      </div>
    </div>
  );
};

// 11. Stuck-At Fault Detective Method (Path Sensitization)
export const StuckAtFaultDetectiveIllustration: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-mod1-light/60 via-cream-paper to-mod2-light/60 dark:from-darklab-card dark:via-darklab-base dark:to-darklab-card border border-mod1/25 dark:border-darklab-border p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-mod1-dark dark:text-mod1 uppercase tracking-wider">
          VLSI Testing: Finding Broken Wires (The Detective Method)
        </span>
      </div>

      <svg viewBox="0 0 450 110" className="w-full h-auto drop-shadow-xs">
        {/* AND Gate with Stuck-At Fault */}
        <path d="M 120 25 L 150 25 A 25 25 0 0 1 150 75 L 120 75 Z" fill="#EBF1FF" stroke="#4F7CFF" strokeWidth="2" />
        <text x="135" y="54" fill="#1E40AF" fontSize="10" fontWeight="bold">AND</text>

        {/* Input A with Fault */}
        <line x1="60" y1="35" x2="120" y2="35" stroke="#FF6B7A" strokeWidth="2.5" />
        <text x="40" y="38" fill="#C92A3E" fontSize="10" fontWeight="bold">A=1</text>

        {/* Stuck-at-0 lightning cross */}
        <circle cx="90" cy="35" r="10" fill="#FFEAEF" stroke="#FF6B7A" strokeWidth="1.5" />
        <text x="90" y="39" fill="#C92A3E" fontSize="8" fontWeight="bold" textAnchor="middle">s-a-0</text>

        {/* Input B (Neutralizing non-controlling input) */}
        <line x1="60" y1="65" x2="120" y2="65" stroke="#3DDC97" strokeWidth="2" />
        <text x="40" y="69" fill="#0E8A54" fontSize="10" fontWeight="bold">B=1</text>
        <text x="75" y="85" className="fill-mod3-dark dark:fill-mod3" fontSize="8">(Neutral 1)</text>

        {/* Output wire to OR gate */}
        <line x1="175" y1="50" x2="250" y2="50" stroke="#FFB347" strokeWidth="2" />

        {/* OR Gate */}
        <path d="M 250 30 Q 275 30 295 50 Q 275 70 250 70 Q 265 50 250 30 Z" fill="#FFF4E0" stroke="#FFB347" strokeWidth="2" />
        <text x="268" y="54" fill="#B86800" fontSize="10" fontWeight="bold">OR</text>

        {/* Neutral input C to OR gate */}
        <line x1="200" y1="65" x2="252" y2="65" stroke="#3DDC97" strokeWidth="2" />
        <text x="180" y="69" fill="#0E8A54" fontSize="10" fontWeight="bold">C=0</text>
        <text x="210" y="85" className="fill-mod3-dark dark:fill-mod3" fontSize="8">(Neutral 0)</text>

        {/* Output Pin */}
        <line x1="295" y1="50" x2="380" y2="50" stroke="#FF6B7A" strokeWidth="2.5" />
        <circle cx="383" cy="50" r="5" fill="#FF6B7A" />
        <text x="405" y="47" className="fill-mod1-dark dark:fill-mod1" fontSize="10" fontWeight="bold">OUTPUT PIN</text>
        <text x="405" y="60" className="fill-mod1-dark dark:fill-mod1" fontSize="8">Detects 0 instead of 1!</text>
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-ink-700 dark:text-cream-muted">
        <div className="p-2.5 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border shadow-xs">
          <strong className="text-mod2-dark dark:text-mod2 block font-mono">1. Fault Activation:</strong>
          Apply opposite signal ($A=1$) to expose the wire stuck at $0$.
        </div>
        <div className="p-2.5 rounded-xl bg-cream-paper dark:bg-darklab-base border border-cream-border dark:border-darklab-border shadow-xs">
          <strong className="text-mod3-dark dark:text-mod3 block font-mono">2. Path Propagation:</strong>
          Set side inputs to neutral ($B=1, C=0$) so the bad signal travels cleanly to an outside pin!
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DISTINCT ANIMATED MODULE HERO COMPOSITIONS
// ============================================================================

/**
 * Module 1 Hero: Toggling Flip-Flops in a continuous clock loop
 */
export const Module1HeroIllustration: React.FC = () => {
  const [qState, setQState] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setQState((q) => (q === 0 ? 1 : 0));
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl zone-mod1-wash border-2 border-mod1/30 shadow-sm flex flex-col items-center">
      <div className="text-xs font-mono font-bold text-mod1-dark dark:text-mod1 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mod1 animate-ping" />
        Live Silicon Clock Loop: Flip-Flop Inversion Dynamic
      </div>

      <svg viewBox="0 0 460 110" className="w-full max-w-[420px] h-auto select-none">
        {/* Flip-Flop Box */}
        <rect x="160" y="15" width="140" height="80" rx="12" fill="#FFFFFF" stroke="#FF4D5E" strokeWidth="2.5" />
        <text x="230" y="38" fill="#1E1E28" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          JK FLIP-FLOP
        </text>
        <text x="230" y="52" fill="#888" fontSize="9" textAnchor="middle" fontFamily="monospace">
          J=1, K=1 (TOGGLE)
        </text>

        {/* Dynamic Clock Edge Pulse Indicator */}
        <path d="M 40 55 L 90 55 L 90 40 L 110 40 L 110 55 L 160 55" fill="none" stroke="#FF9F1C" strokeWidth="2.5" />
        <text x="95" y="75" fill="#B45309" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          CLK TICK
        </text>

        {/* Output Q Terminal */}
        <line x1="300" y1="40" x2="380" y2="40" stroke={qState === 1 ? '#10B981' : '#94A3B8'} strokeWidth="3" />
        <circle cx="380" cy="40" r="10" fill={qState === 1 ? '#10B981' : '#CBD5E1'} stroke="#FFFFFF" strokeWidth="2" />
        <text x="380" y="44" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          {qState}
        </text>
        <text x="405" y="44" fill="#1E1E28" fontSize="11" fontWeight="bold" fontFamily="monospace">
          Q
        </text>

        {/* Output Q' Terminal */}
        <line x1="300" y1="70" x2="380" y2="70" stroke={qState === 0 ? '#FF4D5E' : '#94A3B8'} strokeWidth="3" />
        <circle cx="380" cy="70" r="10" fill={qState === 0 ? '#FF4D5E' : '#CBD5E1'} stroke="#FFFFFF" strokeWidth="2" />
        <text x="380" y="74" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          {qState === 0 ? 1 : 0}
        </text>
        <text x="405" y="74" fill="#1E1E28" fontSize="11" fontWeight="bold" fontFamily="monospace">
          Q'
        </text>

        {/* Feedback Loop Trace */}
        <path
          d="M 380 70 L 380 98 L 140 98 L 140 68 L 160 68"
          fill="none"
          stroke="#FF4D5E"
          strokeWidth="2"
          strokeDasharray="4 2"
          className="wire-flow-high"
        />
      </svg>
      <div className="text-[11px] font-sans text-ink-600 dark:text-cream-muted mt-1 text-center font-medium">
        On every rising clock transition, output toggles cleanly without race conditions.
      </div>
    </div>
  );
};

/**
 * Module 2 Hero: CMOS Inverter switching PMOS pull-up / NMOS pull-down
 */
export const Module2HeroIllustration: React.FC = () => {
  const [vinHigh, setVinHigh] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setVinHigh((v) => !v);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl zone-mod2-wash border-2 border-mod2/30 shadow-sm flex flex-col items-center">
      <div className="text-xs font-mono font-bold text-mod2-dark dark:text-mod2 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mod2 animate-ping" />
        Transistor Level: CMOS Pull-Up &amp; Pull-Down Switch
      </div>

      <svg viewBox="0 0 460 120" className="w-full max-w-[420px] h-auto select-none">
        {/* VDD (+5V) Rail */}
        <line x1="160" y1="15" x2="300" y2="15" stroke="#FF4D5E" strokeWidth="3" />
        <text x="230" y="10" fill="#FF4D5E" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          VDD (+5V)
        </text>

        {/* PMOS Transistor */}
        <rect
          x="195"
          y="25"
          width="70"
          height="30"
          rx="6"
          fill={!vinHigh ? '#EDFCF6' : '#F8FAFC'}
          stroke={!vinHigh ? '#10B981' : '#94A3B8'}
          strokeWidth="2"
        />
        <text x="230" y="44" fill={!vinHigh ? '#047857' : '#64748B'} fontSize="10" fontWeight="bold" textAnchor="middle">
          PMOS {!vinHigh ? '(ON)' : '(OFF)'}
        </text>

        {/* Output Node Y */}
        <circle cx="230" cy="65" r="5" fill="#10B981" />
        <line x1="230" y1="65" x2="330" y2="65" stroke={!vinHigh ? '#10B981' : '#0284C7'} strokeWidth="3" />
        <rect x="330" y="52" width="75" height="26" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
        <text x="367" y="69" fill="#10B981" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          Y = {!vinHigh ? '5V (1)' : '0V (0)'}
        </text>

        {/* NMOS Transistor */}
        <rect
          x="195"
          y="75"
          width="70"
          height="30"
          rx="6"
          fill={vinHigh ? '#EFF6FF' : '#F8FAFC'}
          stroke={vinHigh ? '#0284C7' : '#94A3B8'}
          strokeWidth="2"
        />
        <text x="230" y="94" fill={vinHigh ? '#0369A1' : '#64748B'} fontSize="10" fontWeight="bold" textAnchor="middle">
          NMOS {vinHigh ? '(ON)' : '(OFF)'}
        </text>

        {/* GND (0V) Rail */}
        <line x1="160" y1="115" x2="300" y2="115" stroke="#0284C7" strokeWidth="3" />
        <text x="230" y="125" fill="#0284C7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          GND (0V)
        </text>

        {/* Input Switch Pin */}
        <rect x="50" y="50" width="80" height="30" rx="8" fill="#FFFFFF" stroke="#FF9F1C" strokeWidth="2" />
        <text x="90" y="69" fill="#B45309" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
          IN = {vinHigh ? '5V (1)' : '0V (0)'}
        </text>
        <line x1="130" y1="65" x2="195" y2="40" stroke="#FF9F1C" strokeWidth="2" />
        <line x1="130" y1="65" x2="195" y2="90" stroke="#FF9F1C" strokeWidth="2" />
      </svg>
      <div className="text-[11px] font-sans text-ink-600 dark:text-cream-muted mt-1 text-center font-medium">
        Zero static current flows because PMOS and NMOS never conduct simultaneously!
      </div>
    </div>
  );
};

/**
 * Module 3 Hero: State machine with an animated token hopping between states
 */
export const Module3HeroIllustration: React.FC = () => {
  const [activeState, setActiveState] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveState((s) => (s + 1) % 4);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const stateNames = ['S0 (Idle)', 'S1 (Got 1)', 'S2 (Got 10)', 'S3 (Detect)'];

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl zone-mod3-wash border-2 border-mod3/30 shadow-sm flex flex-col items-center">
      <div className="text-xs font-mono font-bold text-mod3-dark dark:text-mod3 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mod3 animate-ping" />
        Autonomous State Engine: Active Token Progression
      </div>

      <svg viewBox="0 0 460 100" className="w-full max-w-[440px] h-auto select-none">
        {[0, 1, 2, 3].map((idx) => {
          const cx = 55 + idx * 115;
          const isCurrent = activeState === idx;
          return (
            <g key={idx}>
              {/* Transition arrow to next */}
              {idx < 3 && (
                <g>
                  <line x1={cx + 35} y1="50" x2={cx + 80} y2="50" stroke="#10B981" strokeWidth="2.5" />
                  <polygon points={`${cx + 78},46 ${cx + 84},50 ${cx + 78},54`} fill="#10B981" />
                </g>
              )}

              {/* State Circle */}
              <circle
                cx={cx}
                cy="50"
                r="30"
                fill={isCurrent ? '#10B981' : '#FFFFFF'}
                stroke={isCurrent ? '#047857' : '#CBD5E1'}
                strokeWidth={isCurrent ? '3.5' : '2'}
                className="transition-all duration-300"
              />
              <text
                x={cx}
                y="48"
                fill={isCurrent ? '#FFFFFF' : '#1E1E28'}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
              >
                S{idx}
              </text>
              <text
                x={cx}
                y="61"
                fill={isCurrent ? '#ECFDF5' : '#64748B'}
                fontSize="8"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {stateNames[idx].split(' ')[1]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="text-[11px] font-sans text-ink-600 dark:text-cream-muted mt-1 text-center font-medium">
        Current State: <strong className="text-mod3-dark dark:text-mod3 font-mono">{stateNames[activeState]}</strong>. State hops forward deterministically on each event tick.
      </div>
    </div>
  );
};

/**
 * Module 4 Hero: Verilog HDL code lines typing into a synchronized digital waveform
 */
export const Module4HeroIllustration: React.FC = () => {
  const [cycle, setCycle] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCycle((c) => (c + 1) % 8);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl zone-mod4-wash border-2 border-mod4/30 shadow-sm flex flex-col items-center">
      <div className="text-xs font-mono font-bold text-mod4-dark dark:text-mod4 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-mod4 animate-ping" />
        Hardware Description: Code Synthesizing into Waveforms
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl items-center">
        {/* Left: Code Box */}
        <div className="bg-[#181824] p-3.5 rounded-2xl text-[10px] font-mono text-purple-200 border border-purple-900/60 space-y-1 shadow-inner">
          <div className="text-purple-400 font-bold">// Verilog D-FF Model</div>
          <div><span className="text-rose-400">always</span> @(<span className="text-amber-300">posedge</span> clk)</div>
          <div className="pl-3">q &lt;= d;</div>
          <div className="text-emerald-400">// Cycle #{cycle} Synced</div>
        </div>

        {/* Right: Digital Oscilloscope Waveforms */}
        <div className="bg-white dark:bg-darklab-base p-3 rounded-2xl border border-cream-border dark:border-darklab-border shadow-xs">
          <svg viewBox="0 0 200 65" className="w-full h-auto">
            {/* Clock Square Wave */}
            <text x="5" y="16" fill="#8B5CF6" fontSize="8" fontWeight="bold" fontFamily="monospace">CLK</text>
            <path
              d="M 28 18 L 48 18 L 48 6 L 68 6 L 68 18 L 88 18 L 88 6 L 108 6 L 108 18 L 128 18 L 128 6 L 148 6 L 148 18 L 168 18 L 168 6 L 188 6"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
            />

            {/* Q Waveform */}
            <text x="5" y="48" fill="#10B981" fontSize="8" fontWeight="bold" fontFamily="monospace">OUT</text>
            <path
              d={`M 28 ${cycle % 2 === 0 ? 52 : 38} L 68 ${cycle % 2 === 0 ? 52 : 38} L 68 ${cycle % 2 === 0 ? 38 : 52} L 108 ${cycle % 2 === 0 ? 38 : 52} L 148 ${cycle % 2 === 0 ? 52 : 38} L 188 ${cycle % 2 === 0 ? 52 : 38}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

