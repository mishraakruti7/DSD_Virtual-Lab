import { validateWireConnection, TerminalPoint, Wire } from '../src/utils/wireValidation';

const t = (id: string, name: string, type: 'vcc' | 'gnd' | 'input' | 'output' | 'pin'): TerminalPoint => ({
  id,
  name,
  x: 0,
  y: 0,
  type
});

const vcc = t('vcc-rail-1', '+5V Rail', 'vcc');
const gnd = t('gnd-rail-1', 'GND Rail', 'gnd');
const swA = t('swA-out', 'Switch A Output', 'input');
const swB = t('swB-out', 'Switch B Output', 'input');
const pin1 = t('pin-1', 'Pin 1 (1A)', 'pin');
const pin2 = t('pin-2', 'Pin 2 (1B)', 'pin');
const pin3 = t('pin-3', 'Pin 3 (1Y)', 'pin');
const pin7 = t('pin-7', 'Pin 7 (GND)', 'pin');
const pin14 = t('pin-14', 'Pin 14 (VCC)', 'pin');
const resIn = t('resistor-in', '330Ω In', 'output');
const ledCathode = t('led-cathode', 'LED Cathode', 'output');

console.log('Testing Wire Validation Rules:');

// Rule 1: Self
const r1 = validateWireConnection(pin1, pin1);
console.assert(!r1.valid && r1.category === 'self', 'Rule 1: Self failed');
console.log('✔ Rule 1 Passed: Self-loop prevented');

// Rule 2: Duplicate
const existingWire: Wire = {
  id: 'w1',
  fromId: 'swA-out',
  toId: 'pin-1',
  color: '#0284c7',
  from: { x: 0, y: 0, label: 'A' },
  to: { x: 0, y: 0, label: '1' }
};
const r2 = validateWireConnection(pin1, swA, [existingWire]);
console.assert(!r2.valid && r2.category === 'duplicate', 'Rule 2: Duplicate failed');
console.log('✔ Rule 2 Passed: Duplicate wire prevented');

// Rule 3: Direct short VCC to GND
const r3a = validateWireConnection(vcc, gnd);
console.assert(!r3a.valid && r3a.category === 'short', 'Rule 3a failed');
const r3b = validateWireConnection(pin14, pin7);
console.assert(!r3b.valid && r3b.category === 'short', 'Rule 3b failed');
console.log('✔ Rule 3 Passed: VCC to GND direct short prevented');

// Rule 4: Two active outputs
const r4a = validateWireConnection(swA, swB);
console.assert(!r4a.valid && r4a.category === 'conflict', 'Rule 4a failed');
const r4b = validateWireConnection(swA, pin3);
console.assert(!r4b.valid && r4b.category === 'conflict', 'Rule 4b failed');
const r4c = validateWireConnection(pin3, vcc);
console.assert(!r4c.valid && r4c.category === 'conflict', 'Rule 4c failed');
console.log('✔ Rule 4 Passed: Output-output & output-rail conflict prevented');

// Rule 5: Floating inputs
const r5 = validateWireConnection(pin1, pin2, []);
console.assert(!r5.valid && r5.category === 'floating', 'Rule 5 failed');
console.log('✔ Rule 5 Passed: Floating input bridging prevented');

// Rule 6: LED Cathode polarity
const r6 = validateWireConnection(ledCathode, vcc);
console.assert(!r6.valid && r6.category === 'polarity', 'Rule 6 failed');
console.log('✔ Rule 6 Passed: Polarity error prevented');

// Valid connection
const rValid = validateWireConnection(swA, pin1, []);
console.assert(rValid.valid, 'Valid connection failed');
console.log('✔ Valid connection allowed');

console.log('ALL WIRE VALIDATION TESTS PASSED!');
