import React, { useState } from 'react';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import {
  ShieldAlert,
  ShieldCheck,
  DoorOpen,
  DoorClosed,
  Key,
  Volume2,
  VolumeX,
  Info,
  RotateCcw
} from 'lucide-react';

export const RealTimeSecurityDoor: React.FC = () => {
  // Physical Security Door Status: open (true) or closed (false)
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  
  // Latched Alarm State (Stored in D-FF / SR Latch)
  const [alarmLatched, setAlarmLatched] = useState<boolean>(false);

  // Security Guard Key reset pressed
  const [guardKeyActive, setGuardKeyActive] = useState<boolean>(false);

  // Toggle Door Status
  const handleToggleDoor = (isOpen: boolean) => {
    setDoorOpen(isOpen);
    if (isOpen) {
      // Magnetic contact breaks: sends HIGH pulse to latch SET input!
      setAlarmLatched(true);
    }
  };

  // Guard Reset Key Action
  const handleGuardReset = () => {
    setGuardKeyActive(true);
    setTimeout(() => setGuardKeyActive(false), 300);
    // If door is still physically open, alarm cannot be reset (safety interlock)
    if (!doorOpen) {
      setAlarmLatched(false);
    }
  };

  return (
    <div className="bg-[#faf6ee] rounded-3xl p-6 sm:p-8 border border-[#ded5c2] shadow-soft-sm space-y-6">
      {/* Title & Real-World Application Header */}
      <div className="pb-4 border-b border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-peach-100 text-peach-900 border border-peach-300">
              Exp 11 Real-Time Application • CO2 (BL3)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-stone-100 text-stone-700">
              Facility Access Control
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-stone-900 mt-1">
            Security Door Magnetic Reed Sensor with Latching Alarm
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Demonstrates why sequential memory latches are mandatory in security systems: intrusion must latch ON even if the door is immediately slammed shut!
          </p>
        </div>

        <div className={`px-4 py-2 rounded-2xl border font-mono text-xs flex items-center gap-2 ${
          alarmLatched
            ? 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse'
            : 'bg-emerald-100 border-emerald-300 text-emerald-900'
        }`}>
          {alarmLatched ? (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <strong>ALARM ACTIVE: INTRUSION DETECTED</strong>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <strong>SYSTEM ARMED: PERIMETER SECURE</strong>
            </>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Physical Door Contact Simulator */}
        <div className="lg:col-span-4 bg-canvas-cream p-5 rounded-2xl border border-border-warm space-y-4">
          <div className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wide">
            1. Physical Door Status
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-[#f5efe4] rounded-2xl border border-[#ded5c2] text-center">
            {doorOpen ? (
              <DoorOpen className="w-16 h-16 text-rose-500 mb-2 animate-bounce" />
            ) : (
              <DoorClosed className="w-16 h-16 text-emerald-600 mb-2" />
            )}

            <div className="font-heading font-bold text-base text-stone-900">
              Door is {doorOpen ? 'OPEN (Magnet Displaced)' : 'CLOSED (Magnet Engaged)'}
            </div>
            <div className="text-xs font-mono text-stone-500 mt-1">
              Reed Switch Sensor Output: <strong>{doorOpen ? '1 (HIGH)' : '0 (LOW)'}</strong>
            </div>

            <div className="mt-4 w-full">
              <button
                onClick={() => handleToggleDoor(!doorOpen)}
                className={`tactile-btn w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors ${
                  doorOpen
                    ? 'bg-[#e8dfcf] text-stone-800 hover:bg-[#ded4c1] border border-[#ded5c2]'
                    : 'bg-rose-200 text-rose-950 hover:bg-rose-300 border border-rose-300'
                }`}
              >
                {doorOpen ? 'Simulate Closing Door' : 'Simulate Opening Door (Breach)'}
              </button>
            </div>
          </div>
        </div>

        {/* Sequential Latch Circuit Schematics */}
        <div className="lg:col-span-5 bg-[#fcfbf9] p-5 rounded-2xl border border-border-warm space-y-3 font-mono text-xs">
          <div className="font-bold text-stone-800 border-b border-border-warm pb-2 flex items-center justify-between">
            <span>2. IC 7474 D-FF Sequential Latch</span>
            <span className="text-[10px] text-stone-500">Set-Dominant</span>
          </div>

          <div className="bg-[#f5efe4] p-4 rounded-xl border border-[#ded5c2] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Magnetic Sensor (D):</span>
              <span className={`px-2 py-0.5 rounded font-bold ${doorOpen ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                {doorOpen ? '1 (TRIGGER)' : '0 (QUIET)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Flip-Flop Memory State (Q):</span>
              <span className={`px-2 py-0.5 rounded font-bold ${alarmLatched ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                Q = {alarmLatched ? '1 (LATCHED)' : '0 (RESET)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Authorized Reset Pin (/CLR):</span>
              <span className="text-stone-700">
                {guardKeyActive ? '0 (ACTIVE-LOW PULSE)' : '1 (IDLE HIGH)'}
              </span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-stone-700 leading-relaxed">
            <p>
              <strong>Notice:</strong> If the intruder opens the door (Sensor = 1) and immediately shuts it (Sensor = 0), the latch <strong>REMAINS ON (Q = 1)</strong>. A simple combinational AND gate would have turned off, failing to notify security!
            </p>
          </div>
        </div>

        {/* Siren Strobe & Authorized Guard Key Reset */}
        <div className="lg:col-span-3 bg-canvas-cream p-5 rounded-2xl border border-border-warm space-y-4 text-center">
          <div className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wide">
            3. Alarm Strobe & Guard Reset
          </div>

          {/* Siren Strobe Visual */}
          <div className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
            alarmLatched
              ? 'bg-rose-50 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.5)]'
              : 'bg-[#f5efe4] border-[#ded5c2]'
          }`}>
            {alarmLatched ? (
              <Volume2 className="w-10 h-10 text-rose-600 animate-pulse" />
            ) : (
              <VolumeX className="w-10 h-10 text-stone-400" />
            )}
            <div className="mt-2">
              <LedIndicator
                isOn={alarmLatched}
                color="ruby"
                size="lg"
                label="Siren Strobe"
              />
            </div>
            <span className="text-[11px] font-mono mt-2 text-stone-600 font-bold">
              {alarmLatched ? '12V SIREN BLARING' : 'Siren Silenced'}
            </span>
          </div>

          {/* Guard Reset Button */}
          <button
            onClick={handleGuardReset}
            disabled={!alarmLatched}
            className={`tactile-btn w-full py-3 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-soft-sm ${
              alarmLatched
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Turn Guard Reset Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};
