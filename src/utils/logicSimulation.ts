/**
 * @file logicSimulation.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 1: Linear Data Structures (CO1)
 * @section 1.4: Queue Applications in Discrete-Event Digital Simulation
 *
 * @description
 * Digital logic gate simulation utilities and Event-Driven Simulation Engine backed by `LinearQueue<SimEvent>`.
 * Models propagation delay and discrete signal transition events in temporal order.
 */

import { GateType } from '../types/dsd';
import { LinearQueue } from '../dsa/Queue';

export interface SimEvent {
  id: string;
  timestamp: number;
  targetNet: string;
  newValue: boolean;
  sourceComponent?: string;
}

/**
 * Evaluates standard elementary logic gate Boolean truth tables.
 */
export function evaluateGate(type: GateType, a: boolean, b: boolean = false): boolean {
  switch (type) {
    case 'AND': return a && b;
    case 'OR': return a || b;
    case 'NOT': return !a;
    case 'NAND': return !(a && b);
    case 'NOR': return !(a || b);
    case 'XOR': return (a && !b) || (!a && b);
    case 'XNOR': return !((a && !b) || (!a && b));
    default: return false;
  }
}

/**
 * Formats a numeric integer into fixed-length binary string representation.
 */
export function toBinaryString(num: number, bits: number = 4): string {
  return (num >>> 0).toString(2).padStart(bits, '0');
}

/**
 * Discrete-Event Simulation Engine backed by a FIFO Linear Queue.
 * Events are enqueued as circuit inputs change and processed sequentially in O(1) time per event.
 */
export class SimulationEngine {
  private eventQueue: LinearQueue<SimEvent> = new LinearQueue<SimEvent>();
  private netValues: Map<string, boolean> = new Map();

  /**
   * Enqueues a signal transition event to the queue.
   * Time Complexity: O(1)
   */
  public enqueueEvent(event: SimEvent): void {
    this.eventQueue.enqueue(event);
  }

  /**
   * Dequeues and evaluates the next pending discrete signal transition.
   * Time Complexity: O(1)
   */
  public processNextEvent(): SimEvent | undefined {
    const event = this.eventQueue.dequeue();
    if (event) {
      this.netValues.set(event.targetNet, event.newValue);
    }
    return event;
  }

  /**
   * Processes all pending events in the queue until empty.
   * Time Complexity: O(E) where E is pending events count
   */
  public processAllEvents(onEventProcessed?: (event: SimEvent) => void): number {
    let processed = 0;
    while (!this.eventQueue.isEmpty()) {
      const event = this.processNextEvent();
      if (event) {
        processed++;
        if (onEventProcessed) onEventProcessed(event);
      }
    }
    return processed;
  }

  public getNetValue(netId: string): boolean {
    return this.netValues.get(netId) ?? false;
  }

  public hasPendingEvents(): boolean {
    return !this.eventQueue.isEmpty();
  }

  public clear(): void {
    this.eventQueue.clear();
    this.netValues.clear();
  }
}
