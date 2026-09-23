/**
 * @file Queue.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 1: Linear Data Structures (CO1)
 * @section 1.4: Queue Representation, Operations (Linear & Circular)
 *
 * @description
 * Generic Linear Queue (FIFO) and Circular Queue with fixed capacity and modular wrap-around index math.
 *
 * @applications_in_project
 * 1. Event-driven digital logic simulation queue (`LinearQueue<SimEvent>`) in `logicSimulation.ts`.
 * 2. Ring Counter bit sequence circulation (`CircularQueue<number>`) in `SimulatorsPage.tsx`.
 *    - A 4-bit Ring Counter (1000 -> 0100 -> 0010 -> 0001) is natively a circular queue rotation.
 * 3. Johnson (Twisted Ring) Counter bit sequence circulation with inverted feedback (`rotateInverted`).
 *    - A 4-bit Johnson counter produces 8 states (2N) via circular queue feedback inversion.
 * 4. Guided experiment wiring step queue.
 *
 * @complexity_analysis
 * LinearQueue:
 * - enqueue(item): O(1) time
 * - dequeue():      O(1) time (amortized using head pointer / doubly-ended buffer)
 * - peek():         O(1) time
 * - Space:          O(N)
 *
 * CircularQueue:
 * - enqueue(item):  O(1) time, O(1) space
 * - dequeue():       O(1) time, O(1) space
 * - rotate():        O(1) time (dequeue front and enqueue to rear)
 * - rotateInverted():O(1) time (Johnson counter feedback)
 * - Space:           O(Capacity) fixed allocation, eliminates array shifting overhead
 */

/**
 * Standard FIFO (First-In-First-Out) Linear Queue.
 */
export class LinearQueue<T> {
  private items: T[] = [];
  private headIndex: number = 0;

  /**
   * Appends an item to the rear of the queue.
   * Time Complexity: O(1)
   */
  public enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the item from the front of the queue.
   * Periodically garbage-collects consumed slots when head exceeds threshold.
   * Time Complexity: O(1) amortized
   */
  public dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.headIndex];
    this.headIndex++;

    // Reclaim memory when half of the array slots are consumed
    if (this.headIndex > 50 && this.headIndex * 2 >= this.items.length) {
      this.items = this.items.slice(this.headIndex);
      this.headIndex = 0;
    }

    return item;
  }

  /**
   * Returns the item at the front without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.items[this.headIndex];
  }

  /**
   * Checks whether the queue is empty.
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.headIndex >= this.items.length;
  }

  /**
   * Returns the number of items in the queue.
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.items.length - this.headIndex;
  }

  /**
   * Clears the queue.
   * Time Complexity: O(1)
   */
  public clear(): void {
    this.items = [];
    this.headIndex = 0;
  }

  /**
   * Returns current items in order from front to rear.
   * Time Complexity: O(N)
   */
  public toArray(): T[] {
    return this.items.slice(this.headIndex);
  }
}

/**
 * Fixed-Capacity Circular Queue utilizing modular arithmetic for continuous wrap-around.
 * Models sequential digital shift registers, Ring Counters, and Johnson Counters.
 */
export class CircularQueue<T> {
  private buffer: (T | undefined)[];
  private head: number = 0;
  private tail: number = 0;
  private count: number = 0;
  public readonly capacity: number;

  /**
   * Constructs a circular queue of fixed capacity.
   * @param capacity Maximum number of elements the buffer can hold
   */
  constructor(capacity: number) {
    if (capacity <= 0) throw new Error('CircularQueue capacity must be positive');
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  /**
   * Inserts an element at the rear of the circular queue.
   * Wrap-around formula: tail = (tail + 1) % capacity
   * Time Complexity: O(1)
   * @returns true if enqueued successfully, false if queue is full
   */
  public enqueue(item: T): boolean {
    if (this.isFull()) return false;
    this.buffer[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
    return true;
  }

  /**
   * Removes and returns the item from the front of the circular queue.
   * Wrap-around formula: head = (head + 1) % capacity
   * Time Complexity: O(1)
   */
  public dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return item;
  }

  /**
   * Circularly rotates the queue by dequeuing the front element and enqueuing it to the rear.
   * Directly models a Digital Ring Counter (e.g. 1000 -> 0100 -> 0010 -> 0001 -> 1000).
   * Time Complexity: O(1)
   * @returns The shifted element, or undefined if empty
   */
  public rotate(): T | undefined {
    if (this.isEmpty()) return undefined;
    const front = this.dequeue();
    if (front !== undefined) {
      this.enqueue(front);
    }
    return front;
  }

  /**
   * Circularly rotates with an inverted feedback function applied to the shifted bit.
   * Directly models a Digital Johnson / Mobius Counter where FF_out inverted is fed to FF_in.
   * Time Complexity: O(1)
   * @param inverter Transform function applied to the dequeued element before re-enqueuing
   */
  public rotateInverted(inverter: (item: T) => T): T | undefined {
    if (this.isEmpty()) return undefined;
    const front = this.dequeue();
    if (front !== undefined) {
      const inverted = inverter(front);
      this.enqueue(inverted);
    }
    return front;
  }

  /**
   * Returns the item at the front without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.buffer[this.head];
  }

  /**
   * Checks whether the circular queue has reached capacity.
   * Time Complexity: O(1)
   */
  public isFull(): boolean {
    return this.count === this.capacity;
  }

  /**
   * Checks whether the circular queue contains no elements.
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Returns current number of active elements.
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.count;
  }

  /**
   * Clears the circular queue and resets head/tail indices.
   * Time Complexity: O(Capacity)
   */
  public clear(): void {
    this.buffer = new Array(this.capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  /**
   * Returns all active items in logical sequence from head to tail.
   * Time Complexity: O(count)
   */
  public toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const index = (this.head + i) % this.capacity;
      const val = this.buffer[index];
      if (val !== undefined) {
        result.push(val);
      }
    }
    return result;
  }

  /**
   * Factory method to initialize a CircularQueue with an existing array of elements.
   * @param elements Initial array of values
   */
  public static fromArray<U>(elements: U[]): CircularQueue<U> {
    const queue = new CircularQueue<U>(Math.max(elements.length, 1));
    for (const el of elements) {
      queue.enqueue(el);
    }
    return queue;
  }
}
