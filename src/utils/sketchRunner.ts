/**
 * Sandboxed Arduino / Microcontroller Sketch Runner
 * 
 * Supports standard Arduino syntax:
 * - setup(), loop()
 * - pinMode(pin, mode)
 * - digitalWrite(pin, val), digitalRead(pin)
 * - analogRead(pin), analogWrite(pin, val)
 * - delay(ms), millis(), micros()
 * - tone(pin, freq), noTone(pin)
 * - Serial.begin(baud), Serial.print(msg), Serial.println(msg)
 */

export interface SketchPinState {
  mode: 'INPUT' | 'OUTPUT' | 'INPUT_PULLUP';
  digitalValue: boolean;
  analogValue: number; // 0..255 for PWM out, 0..1023 for ADC in
}

export interface SketchRunnerCallbacks {
  onPinChange: (pin: string, state: boolean, analogVal: number) => void;
  onSerialMessage: (msg: string) => void;
  onError: (error: string) => void;
}

export class SketchRunner {
  private isRunning: boolean = false;
  private loopTimerId: any = null;
  private startTime: number = 0;
  private pinStates: Map<string, SketchPinState> = new Map();
  private callbacks: SketchRunnerCallbacks;
  private userCode: string = '';

  constructor(callbacks: SketchRunnerCallbacks) {
    this.callbacks = callbacks;
    this.resetPins();
  }

  private resetPins() {
    this.pinStates.clear();
    // Initialize standard pins 0..13 and A0..A5
    for (let i = 0; i <= 13; i++) {
      this.pinStates.set(`D${i}`, { mode: 'INPUT', digitalValue: false, analogValue: 0 });
      this.pinStates.set(String(i), { mode: 'INPUT', digitalValue: false, analogValue: 0 });
    }
    for (let a = 0; a <= 5; a++) {
      this.pinStates.set(`A${a}`, { mode: 'INPUT', digitalValue: false, analogValue: 0 });
    }
  }

  public setPinExternalInput(pin: string, high: boolean, analogVal: number = 0) {
    const norm = this.normalizePin(pin);
    const curr = this.pinStates.get(norm) || { mode: 'INPUT', digitalValue: false, analogValue: 0 };
    curr.digitalValue = high;
    curr.analogValue = analogVal;
    this.pinStates.set(norm, curr);
  }

  private normalizePin(pin: string | number): string {
    const s = String(pin).trim().toUpperCase();
    if (s.startsWith('D')) return s;
    if (s.startsWith('A')) return s;
    if (!isNaN(Number(s))) return `D${s}`;
    return s;
  }

  /**
   * Transpiles simple Arduino C++ syntax into executable JavaScript
   */
  private transpileSketch(cppCode: string): string {
    // 1. Strip comments and C++ types
    let js = cppCode
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\bint\b/g, 'let')
      .replace(/\bfloat\b/g, 'let')
      .replace(/\bdouble\b/g, 'let')
      .replace(/\bbool\b/g, 'let')
      .replace(/\bboolean\b/g, 'let')
      .replace(/\bchar\b/g, 'let')
      .replace(/\bString\b/g, 'let')
      .replace(/\bvoid\s+setup\s*\(\s*\)/g, 'async function setup()')
      .replace(/\bvoid\s+loop\s*\(\s*\)/g, 'async function loop()')
      .replace(/\bvoid\s+([a-zA-Z0-9_]+)\s*\(/g, 'async function $1(')
      .replace(/\bconst\s+let\b/g, 'const')
      .replace(/\bconst\s+int\b/g, 'const')
      .replace(/\bunsigned\s+long\b/g, 'let')
      .replace(/\blong\b/g, 'let');

    // 2. Constants
    js = `
      const HIGH = 1, LOW = 0;
      const OUTPUT = 'OUTPUT', INPUT = 'INPUT', INPUT_PULLUP = 'INPUT_PULLUP';
      const LED_BUILTIN = 13;
      const A0 = 'A0', A1 = 'A1', A2 = 'A2', A3 = 'A3', A4 = 'A4', A5 = 'A5';
      ${js}
    `;

    return js;
  }

  public async start(sketchSource: string) {
    this.stop();
    this.userCode = sketchSource;
    this.resetPins();
    this.isRunning = true;
    this.startTime = Date.now();

    try {
      const transpiled = this.transpileSketch(sketchSource);

      // Sandbox API definitions
      const pinMode = (pin: any, mode: any) => {
        const norm = this.normalizePin(pin);
        const curr = this.pinStates.get(norm) || { mode: 'INPUT', digitalValue: false, analogValue: 0 };
        curr.mode = mode;
        this.pinStates.set(norm, curr);
      };

      const digitalWrite = (pin: any, val: any) => {
        const norm = this.normalizePin(pin);
        const isHigh = val === 1 || val === true || val === 'HIGH';
        const curr = this.pinStates.get(norm) || { mode: 'OUTPUT', digitalValue: false, analogValue: 0 };
        curr.digitalValue = isHigh;
        curr.analogValue = isHigh ? 255 : 0;
        this.pinStates.set(norm, curr);
        this.callbacks.onPinChange(norm, isHigh, curr.analogValue);
      };

      const digitalRead = (pin: any): number => {
        const norm = this.normalizePin(pin);
        const curr = this.pinStates.get(norm);
        return curr && curr.digitalValue ? 1 : 0;
      };

      const analogRead = (pin: any): number => {
        const norm = this.normalizePin(pin);
        const curr = this.pinStates.get(norm);
        return curr ? curr.analogValue : 0;
      };

      const analogWrite = (pin: any, val: any) => {
        const norm = this.normalizePin(pin);
        const clamped = Math.max(0, Math.min(255, Number(val) || 0));
        const isHigh = clamped > 127;
        const curr = this.pinStates.get(norm) || { mode: 'OUTPUT', digitalValue: false, analogValue: 0 };
        curr.digitalValue = isHigh;
        curr.analogValue = clamped;
        this.pinStates.set(norm, curr);
        this.callbacks.onPinChange(norm, isHigh, clamped);
      };

      const delay = (ms: number): Promise<void> => {
        const clampedMs = Math.max(10, Math.min(10000, Number(ms) || 50));
        return new Promise((resolve) => setTimeout(resolve, clampedMs));
      };

      const millis = (): number => Date.now() - this.startTime;
      const micros = (): number => (Date.now() - this.startTime) * 1000;

      const Serial = {
        begin: (baud: number) => {
          this.callbacks.onSerialMessage(`[Serial Port Initialized at ${baud} baud]`);
        },
        print: (msg: any) => {
          this.callbacks.onSerialMessage(String(msg));
        },
        println: (msg: any = '') => {
          this.callbacks.onSerialMessage(String(msg) + '\n');
        },
      };

      const tone = (pin: any, freq: number) => {
        this.callbacks.onSerialMessage(`[Tone on ${this.normalizePin(pin)}: ${freq} Hz]`);
      };

      const noTone = (pin: any) => {
        this.callbacks.onSerialMessage(`[NoTone on ${this.normalizePin(pin)}]`);
      };

      // Create runner function with sandboxed arguments
      const runnerFn = new Function(
        'pinMode',
        'digitalWrite',
        'digitalRead',
        'analogRead',
        'analogWrite',
        'delay',
        'millis',
        'micros',
        'Serial',
        'tone',
        'noTone',
        `
        return (async () => {
          ${transpiled}
          return {
            setup: typeof setup === 'function' ? setup : async () => {},
            loop: typeof loop === 'function' ? loop : async () => {}
          };
        })();
        `
      );

      const sketchInstance = await runnerFn(
        pinMode,
        digitalWrite,
        digitalRead,
        analogRead,
        analogWrite,
        delay,
        millis,
        micros,
        Serial,
        tone,
        noTone
      );

      // Execute setup()
      await sketchInstance.setup();

      // Continuous loop execution
      const runLoop = async () => {
        if (!this.isRunning) return;
        try {
          await sketchInstance.loop();
          if (this.isRunning) {
            this.loopTimerId = setTimeout(runLoop, 20);
          }
        } catch (loopErr: any) {
          this.callbacks.onError(loopErr.message || 'Error inside sketch loop()');
          this.stop();
        }
      };

      runLoop();
    } catch (err: any) {
      this.callbacks.onError(err.message || 'Compilation / Transpilation Error');
      this.stop();
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.loopTimerId) {
      clearTimeout(this.loopTimerId);
      this.loopTimerId = null;
    }
  }

  public getActivePinState(pin: string): SketchPinState | undefined {
    return this.pinStates.get(this.normalizePin(pin));
  }
}
