import React, { useState } from 'react';
import { LedIndicator } from '../../common/LedIndicator';
import {
  Coins,
  CupSoda,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const VendingMachineFSM: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [dispenseActive, setDispenseActive] = useState<boolean>(false);
  const [changeReturned, setChangeReturned] = useState<number>(0);
  const [transactionLog, setTransactionLog] = useState<string[]>([
    'System ready. Insert coins (₹5, ₹10, ₹20) to reach ₹15.'
  ]);

  // Handle Coin Insertion
  const handleInsertCoin = (coinVal: number) => {
    const newBal = balance + coinVal;
    let newLog = [...transactionLog];

    if (newBal >= 15) {
      // Dispense Condition Met!
      const change = newBal - 15;
      setBalance(0);
      setDispenseActive(true);
      setChangeReturned(change);
      newLog.unshift(`Inserted ₹${coinVal}. Total reached ₹${newBal}. Dispensing ₹15 beverage! Returned ₹${change} change.`);
      setTimeout(() => {
        setDispenseActive(false);
      }, 2500);
    } else {
      setBalance(newBal);
      newLog.unshift(`Inserted ₹${coinVal}. Current balance: ₹${newBal}. Insert ₹${15 - newBal} more.`);
    }

    setTransactionLog(newLog.slice(0, 5));
  };

  // Cancel & Refund
  const handleCancel = () => {
    if (balance > 0) {
      setChangeReturned(balance);
      setTransactionLog((prev) => [
        `Transaction canceled. Refunded ₹${balance}.`,
        ...prev.slice(0, 4)
      ]);
      setBalance(0);
    }
  };

  // Determine FSM State
  let fsmState = 'S0 (₹0)';
  if (balance === 5) fsmState = 'S5 (₹5)';
  if (balance === 10) fsmState = 'S10 (₹10)';
  if (dispenseActive) fsmState = changeReturned > 0 ? 'S20 (Dispense + Return ₹5)' : 'S15 (Dispense Drink)';

  return (
    <div className="bg-[#faf6ee] rounded-3xl p-6 sm:p-8 border border-[#ded5c2] shadow-soft-sm space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-border-warm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-peach-100 text-peach-900 border border-peach-300">
              Section IX Mini-Project • CO4 (BL4)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-stone-100 text-stone-700">
              Real-Time Algorithmic State Machine
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-stone-900 mt-1">
            Beverage Vending Machine FSM (₹15 Drink)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Accepts ₹5, ₹10, and ₹20 denominations, tracks credit accumulation states, and fires dispense and change return actuators.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-canvas-cream border border-border-warm font-mono text-xs text-stone-700">
          State: <strong className="text-sky-700">{fsmState}</strong>
        </div>
      </div>

      {/* Main Grid: Machine Interface + Internal Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Vending Machine Front Panel */}
        <div className="lg:col-span-5 bg-[#eaf6f9] text-stone-800 p-6 rounded-3xl shadow-md space-y-5 border border-[#c1e5ed]">
          
          {/* LED Display */}
          <div className="bg-[#f0f9fb] p-4 rounded-2xl border border-[#bfe2ea] flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-stone-500 font-bold">CREDIT BALANCE</div>
              <div className="text-2xl font-bold text-emerald-800">₹{balance}.00</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-500 font-bold">PRICE</div>
              <div className="text-base font-bold text-stone-700">₹15.00</div>
            </div>
          </div>

          {/* Coin Slots */}
          <div>
            <div className="text-xs font-mono text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Insert Coins / Cash</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleInsertCoin(5)}
                className="tactile-btn py-3 px-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fcd34d] font-mono font-bold text-sm text-amber-950 flex flex-col items-center shadow-xs"
              >
                <span>₹5 Coin</span>
              </button>
              <button
                onClick={() => handleInsertCoin(10)}
                className="tactile-btn py-3 px-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fcd34d] font-mono font-bold text-sm text-amber-950 flex flex-col items-center shadow-xs"
              >
                <span>₹10 Coin</span>
              </button>
              <button
                onClick={() => handleInsertCoin(20)}
                className="tactile-btn py-3 px-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fcd34d] font-mono font-bold text-sm text-amber-950 flex flex-col items-center shadow-xs"
              >
                <span>₹20 Note</span>
              </button>
            </div>
          </div>

          {/* Dispense Well */}
          <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#ded5c2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                dispenseActive ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-bounce' : 'bg-[#f4efe4] border-[#ded5c2] text-stone-400'
              }`}>
                <CupSoda className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-stone-800">
                  {dispenseActive ? 'DRINK DISPENSED!' : 'Dispenser Tray'}
                </div>
                <div className="text-[11px] text-stone-500">
                  {dispenseActive ? 'Please take your chilled drink' : 'Awaiting ₹15 credit'}
                </div>
              </div>
            </div>

            <button
              onClick={handleCancel}
              disabled={balance === 0}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                balance > 0 ? 'bg-rose-100 text-rose-900 border-rose-300 hover:bg-rose-200' : 'text-stone-400 border-stone-300 bg-stone-100 cursor-not-allowed'
              }`}
            >
              Refund
            </button>
          </div>

          {/* Change Cup */}
          {changeReturned > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 font-mono text-xs text-center font-bold animate-pulse">
              🪙 Change Returned: ₹{changeReturned}.00
            </div>
          )}
        </div>

        {/* ASM State Controller Architecture */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-canvas-cream p-5 rounded-2xl border border-border-warm space-y-3 font-mono text-xs">
            <div className="font-bold text-stone-800 border-b border-border-warm pb-2">
              ASM Controller State Flow
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { id: 'S0', val: 0, label: 'S0 (₹0)', active: balance === 0 && !dispenseActive },
                { id: 'S5', val: 5, label: 'S5 (₹5)', active: balance === 5 },
                { id: 'S10', val: 10, label: 'S10 (₹10)', active: balance === 10 },
              ].map((s) => (
                <div
                  key={s.id}
                  className={`p-3 rounded-xl border transition-all ${
                    s.active
                      ? 'bg-sky-100 border-sky-400 font-bold text-sky-950 shadow-sm ring-1 ring-sky-300'
                      : 'bg-[#faf6ee] border-[#ded5c2] text-stone-600'
                  }`}
                >
                  <div>{s.label}</div>
                  <div className="text-[10px] text-stone-400 mt-1">
                    {s.active ? 'ACTIVE' : 'IDLE'}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-stone-700 font-bold mb-1">
                Recent Controller Log:
              </div>
              <ul className="space-y-1 text-[11px] text-stone-600">
                {transactionLog.map((log, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-stone-400">•</span>
                    <span>{log}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
