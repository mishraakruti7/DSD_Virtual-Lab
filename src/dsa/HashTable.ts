/**
 * @file HashTable.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 3: Searching and Hashing (CO3)
 * @section 3.2 - 3.3: Hashing, Hash Functions, and Collision Resolution (Linear and Quadratic Probing)
 *
 * @description
 * Custom Hash Table implementation using Open Addressing with selectable collision resolution strategies:
 * 1. Linear Probing: index(k, i) = (h0 + i) % M
 * 2. Quadratic Probing: index(k, i) = (h0 + c1*i + c2*i^2) % M
 *
 * Employs a polynomial rolling hash function and tombstone deletion markers to maintain probe chain integrity.
 * Automatically doubles capacity and rehashes when load factor exceeds 0.7.
 *
 * @applications_in_project
 * 1. Breadboard Circuit Simulation Memoization Cache (`VirtualBreadboard.tsx`, `logicSimulation.ts`):
 *    - Keys: Hash of active wires and input switch states.
 *    - Values: Computed electrical nets, reachability results, and output voltages.
 *    - Caches O(V + E) BFS netlist computation, answering repeated frames in O(1) average time.
 * 2. IC Pinout Registry and Question lookup by ID.
 *
 * @complexity_analysis
 * - Hash Function:     O(L) where L is string key length
 * - Search / Get:      Average O(1), Worst O(N) under heavy primary/secondary clustering
 * - Insert / Set:      Average O(1) amortized, Worst O(N)
 * - Delete:            Average O(1), Worst O(N)
 * - Space:             O(M) where M is table capacity (load factor alpha <= 0.70)
 */

export type CollisionResolution = 'linear' | 'quadratic';

interface HashEntry<K, V> {
  key: K;
  value: V;
  deleted: boolean;
}

export class HashTable<K, V> {
  private table: (HashEntry<K, V> | null)[];
  private currentSize: number = 0;
  private capacity: number;
  private strategy: CollisionResolution;
  private totalCollisions: number = 0;

  // Prime numbers sequence for table capacities to minimize hash harmonics
  private static readonly PRIMES = [31, 67, 131, 257, 521, 1031, 2053, 4099];

  /**
   * Constructs a HashTable with specified strategy.
   * @param initialCapacity Starting table capacity (default 31)
   * @param strategy Collision resolution: 'linear' or 'quadratic' probing
   */
  constructor(initialCapacity: number = 31, strategy: CollisionResolution = 'linear') {
    this.capacity = initialCapacity;
    this.strategy = strategy;
    this.table = new Array(this.capacity).fill(null);
  }

  /**
   * Polynomial Rolling Hash Function:
   * h(s) = sum(s[i] * 31^(n - 1 - i)) % M
   * Generates uniform distributions across alphanumeric keys.
   * Time Complexity: O(L) where L is key length
   */
  private hash(key: K): number {
    const str = String(key);
    let hashVal = 0;
    const p = 31;
    for (let i = 0; i < str.length; i++) {
      hashVal = (hashVal * p + str.charCodeAt(i)) >>> 0;
    }
    return hashVal % this.capacity;
  }

  /**
   * Computes the probe index for the i-th collision step.
   * Linear:    (h0 + i) % M
   * Quadratic: (h0 + i + i^2) % M
   */
  private getProbeIndex(baseHash: number, i: number): number {
    if (this.strategy === 'linear') {
      return (baseHash + i) % this.capacity;
    } else {
      // Quadratic probing with c1 = 1, c2 = 1
      return (baseHash + i + i * i) % this.capacity;
    }
  }

  /**
   * Inserts or updates a key-value entry.
   * Automatically rehashes if load factor exceeds 0.70.
   * Time Complexity: Average O(1), Worst O(N)
   */
  public set(key: K, value: V): void {
    if ((this.currentSize + 1) / this.capacity > 0.7) {
      this.rehash();
    }

    const baseHash = this.hash(key);
    let firstTombstoneIndex = -1;

    for (let i = 0; i < this.capacity; i++) {
      const idx = this.getProbeIndex(baseHash, i);
      const entry = this.table[idx];

      if (entry === null) {
        // Free slot found
        const targetIdx = firstTombstoneIndex !== -1 ? firstTombstoneIndex : idx;
        this.table[targetIdx] = { key, value, deleted: false };
        this.currentSize++;
        if (i > 0) this.totalCollisions += i;
        return;
      }

      if (entry.deleted) {
        if (firstTombstoneIndex === -1) {
          firstTombstoneIndex = idx;
        }
      } else if (entry.key === key) {
        // Key exists, update value in place
        entry.value = value;
        return;
      }
    }

    // Fallback if all probes were tombstones
    if (firstTombstoneIndex !== -1) {
      this.table[firstTombstoneIndex] = { key, value, deleted: false };
      this.currentSize++;
    } else {
      this.rehash();
      this.set(key, value);
    }
  }

  /**
   * Retrieves value for the specified key.
   * Time Complexity: Average O(1), Worst O(N)
   */
  public get(key: K): V | undefined {
    const baseHash = this.hash(key);

    for (let i = 0; i < this.capacity; i++) {
      const idx = this.getProbeIndex(baseHash, i);
      const entry = this.table[idx];

      if (entry === null) {
        return undefined; // Not found (empty unprobed bucket)
      }

      if (!entry.deleted && entry.key === key) {
        return entry.value;
      }
    }

    return undefined;
  }

  /**
   * Checks whether the key exists in the hash table.
   * Time Complexity: Average O(1)
   */
  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Soft-deletes an entry using a tombstone marker.
   * Ensures subsequent searches in the probe chain do not abort prematurely.
   * Time Complexity: Average O(1)
   */
  public delete(key: K): boolean {
    const baseHash = this.hash(key);

    for (let i = 0; i < this.capacity; i++) {
      const idx = this.getProbeIndex(baseHash, i);
      const entry = this.table[idx];

      if (entry === null) return false;

      if (!entry.deleted && entry.key === key) {
        entry.deleted = true;
        this.currentSize--;
        return true;
      }
    }

    return false;
  }

  /**
   * Rehashes all active elements into a larger prime-sized table.
   * Time Complexity: O(N)
   */
  private rehash(): void {
    const oldTable = this.table;
    const nextPrime = HashTable.PRIMES.find((p) => p > this.capacity * 2) || this.capacity * 2 + 1;
    this.capacity = nextPrime;
    this.table = new Array(this.capacity).fill(null);
    this.currentSize = 0;

    for (const entry of oldTable) {
      if (entry && !entry.deleted) {
        this.set(entry.key, entry.value);
      }
    }
  }

  public size(): number {
    return this.currentSize;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public clear(): void {
    this.table = new Array(this.capacity).fill(null);
    this.currentSize = 0;
    this.totalCollisions = 0;
  }

  /**
   * Returns diagnostic statistics for viva demonstration.
   */
  public getStats(): {
    capacity: number;
    size: number;
    loadFactor: number;
    totalCollisions: number;
    strategy: CollisionResolution;
  } {
    return {
      capacity: this.capacity,
      size: this.currentSize,
      loadFactor: Number((this.currentSize / this.capacity).toFixed(3)),
      totalCollisions: this.totalCollisions,
      strategy: this.strategy,
    };
  }
}
