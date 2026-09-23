import React from 'react';
import { GateType } from '../../types/dsd';

interface GateSvgSymbolProps {
  type: GateType;
  inA?: boolean;
  inB?: boolean;
  outY?: boolean;
  width?: number;
  height?: number;
}

export const GateSvgSymbol: React.FC<GateSvgSymbolProps> = ({
  type,
  inA = false,
  inB = false,
  outY = false,
  width = 180,
  height = 100,
}) => {
  const activeWireColor = '#0284c7'; // Sky-600
  const inactiveWireColor = '#94a3b8'; // Slate-400
  const activeOutColor = '#16a34a'; // Sage-600
  const inactiveOutColor = '#94a3b8';

  const wireA = inA ? activeWireColor : inactiveWireColor;
  const wireB = inB ? activeWireColor : inactiveWireColor;
  const wireY = outY ? activeOutColor : inactiveOutColor;

  return (
    <svg
      viewBox="0 0 200 120"
      width={width}
      height={height}
      className="drop-shadow-sm transition-all"
    >
      {/* Input A Line */}
      <line x1="20" y1="40" x2="60" y2="40" stroke={wireA} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="20" cy="40" r="4" fill={wireA} />
      <text x="10" y="44" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" fill="#475569" textAnchor="end">A</text>

      {/* Input B Line (if not inverter) */}
      {type !== 'NOT' && (
        <>
          <line x1="20" y1="80" x2="60" y2="80" stroke={wireB} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="20" cy="80" r="4" fill={wireB} />
          <text x="10" y="84" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" fill="#475569" textAnchor="end">B</text>
        </>
      )}

      {/* Gate Body rendering */}
      {type === 'AND' && (
        <path
          d="M 60 25 L 100 25 A 35 35 0 0 1 100 95 L 60 95 Z"
          fill="#f8fafc"
          stroke="#334155"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      )}

      {type === 'NAND' && (
        <>
          <path
            d="M 60 25 L 95 25 A 35 35 0 0 1 95 95 L 60 95 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="137" cy="60" r="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        </>
      )}

      {type === 'OR' && (
        <path
          d="M 55 25 Q 75 60 55 95 Q 105 95 135 60 Q 105 25 55 25 Z"
          fill="#f8fafc"
          stroke="#334155"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      )}

      {type === 'NOR' && (
        <>
          <path
            d="M 55 25 Q 75 60 55 95 Q 105 95 132 60 Q 105 25 55 25 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="140" cy="60" r="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        </>
      )}

      {type === 'NOT' && (
        <>
          <path
            d="M 60 30 L 125 60 L 60 90 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="133" cy="60" r="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        </>
      )}

      {type === 'XOR' && (
        <>
          <path
            d="M 48 25 Q 68 60 48 95"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 58 25 Q 78 60 58 95 Q 108 95 138 60 Q 108 25 58 25 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
        </>
      )}

      {type === 'XNOR' && (
        <>
          <path
            d="M 48 25 Q 68 60 48 95"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 58 25 Q 78 60 58 95 Q 108 95 132 60 Q 108 25 58 25 Z"
            fill="#f8fafc"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <circle cx="140" cy="60" r="6" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
        </>
      )}

      {/* Output Line Y */}
      {type === 'NAND' || type === 'NOR' || type === 'XNOR' ? (
        <line x1="143" y1="60" x2="185" y2="60" stroke={wireY} strokeWidth="3.5" strokeLinecap="round" />
      ) : type === 'NOT' ? (
        <line x1="139" y1="60" x2="185" y2="60" stroke={wireY} strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <line x1="135" y1="60" x2="185" y2="60" stroke={wireY} strokeWidth="3.5" strokeLinecap="round" />
      )}
      <circle cx="185" cy="60" r="4" fill={wireY} />
      <text x="195" y="64" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold" fill="#475569">Y</text>
    </svg>
  );
};
