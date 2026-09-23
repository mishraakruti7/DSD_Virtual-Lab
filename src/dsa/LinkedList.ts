/**
 * @file LinkedList.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 1: Linear Data Structures (CO1)
 * @section 1.5: Linked List Representations and Variations (Singly, Doubly, Circular)
 *
 * @description
 * Node-based linear linked lists providing pointer-linked sequences without contiguous array reallocations.
 * Implements Singly, Doubly, and Circular Linked Lists.
 *
 * @applications_in_project
 * 1. `DoublyLinkedList<TheoryModule>` in `TheoryModulesPage.tsx`:
 *    - Authentically replaces index math for Prev/Next module stepping.
 *    - Each `DoublyNode` stores `{ data: module, prev, next }`, enabling O(1) step forward / step backward.
 * 2. `CircularLinkedList<GalleryDiagramItem>` in `CircuitGalleryPage.tsx`:
 *    - Lightbox schematic carousel with seamless circular wrap-around navigation.
 *    - Stepping past the last diagram naturally cycles to the first (and vice-versa) via circular pointers.
 * 3. `SinglyLinkedList<Point>` for multi-segment breadboard wire bend-point chains.
 *
 * @complexity_analysis
 * SinglyLinkedList:
 * - append / prepend: O(1) time
 * - insertAt / removeAt: O(N) traversal time, O(1) pointer adjustment
 *
 * DoublyLinkedList:
 * - append: O(1) time
 * - step forward (node.next) / step back (node.prev): O(1) time
 * - findNode(predicate): O(N) search time
 *
 * CircularLinkedList:
 * - next() / prev(): O(1) pointer transition
 * - Space: O(N) across all variants
 */

// ==========================================
// 1. Singly Linked List
// ==========================================

export class SinglyNode<T> {
  public data: T;
  public next: SinglyNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class SinglyLinkedList<T> {
  private head: SinglyNode<T> | null = null;
  private tail: SinglyNode<T> | null = null;
  private length: number = 0;

  public append(data: T): void {
    const newNode = new SinglyNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  public prepend(data: T): void {
    const newNode = new SinglyNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  public insertAt(index: number, data: T): boolean {
    if (index < 0 || index > this.length) return false;
    if (index === 0) {
      this.prepend(data);
      return true;
    }
    if (index === this.length) {
      this.append(data);
      return true;
    }

    const newNode = new SinglyNode(data);
    let prev = this.head;
    for (let i = 0; i < index - 1; i++) {
      if (prev) prev = prev.next;
    }

    if (prev) {
      newNode.next = prev.next;
      prev.next = newNode;
      this.length++;
      return true;
    }
    return false;
  }

  public removeAt(index: number): T | undefined {
    if (index < 0 || index >= this.length || !this.head) return undefined;

    let removed: SinglyNode<T>;
    if (index === 0) {
      removed = this.head;
      this.head = this.head.next;
      if (this.length === 1) this.tail = null;
    } else {
      let prev = this.head;
      for (let i = 0; i < index - 1; i++) {
        if (prev?.next) prev = prev.next;
      }
      removed = prev!.next!;
      prev!.next = removed.next;
      if (index === this.length - 1) this.tail = prev;
    }

    this.length--;
    return removed.data;
  }

  public size(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.data);
      curr = curr.next;
    }
    return result;
  }
}

// ==========================================
// 2. Doubly Linked List
// ==========================================

export class DoublyNode<T> {
  public data: T;
  public prev: DoublyNode<T> | null = null;
  public next: DoublyNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> {
  private head: DoublyNode<T> | null = null;
  private tail: DoublyNode<T> | null = null;
  private length: number = 0;

  /**
   * Appends an element to the end of the doubly linked list.
   * Time Complexity: O(1)
   */
  public append(data: T): DoublyNode<T> {
    const newNode = new DoublyNode(data);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
    return newNode;
  }

  /**
   * Searches for a node matching the predicate.
   * Time Complexity: O(N)
   */
  public findNode(predicate: (item: T) => boolean): DoublyNode<T> | null {
    let curr = this.head;
    while (curr) {
      if (predicate(curr.data)) return curr;
      curr = curr.next;
    }
    return null;
  }

  /**
   * Returns data matching the predicate.
   * Time Complexity: O(N)
   */
  public find(predicate: (item: T) => boolean): T | undefined {
    const node = this.findNode(predicate);
    return node ? node.data : undefined;
  }

  /**
   * Retrieves the node at a 0-indexed position.
   * Time Complexity: O(N)
   */
  public getNode(index: number): DoublyNode<T> | null {
    if (index < 0 || index >= this.length) return null;
    let curr = this.head;
    for (let i = 0; i < index; i++) {
      if (curr) curr = curr.next;
    }
    return curr;
  }

  public size(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }

  public toArray(): T[] {
    const res: T[] = [];
    let curr = this.head;
    while (curr) {
      res.push(curr.data);
      curr = curr.next;
    }
    return res;
  }

  public static fromArray<U>(items: U[]): DoublyLinkedList<U> {
    const list = new DoublyLinkedList<U>();
    for (const item of items) {
      list.append(item);
    }
    return list;
  }
}

// ==========================================
// 3. Circular Doubly Linked List
// ==========================================

export class CircularNode<T> {
  public data: T;
  public prev!: CircularNode<T>;
  public next!: CircularNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class CircularLinkedList<T> {
  private head: CircularNode<T> | null = null;
  private current: CircularNode<T> | null = null;
  private length: number = 0;

  /**
   * Appends an element and maintains circular link between head and tail.
   * Time Complexity: O(1)
   */
  public append(data: T): CircularNode<T> {
    const newNode = new CircularNode(data);

    if (!this.head) {
      newNode.next = newNode;
      newNode.prev = newNode;
      this.head = newNode;
      this.current = newNode;
    } else {
      const tail = this.head.prev;
      tail.next = newNode;
      newNode.prev = tail;
      newNode.next = this.head;
      this.head.prev = newNode;
    }

    this.length++;
    return newNode;
  }

  /**
   * Advances pointer to the next circular node.
   * Wraps around from tail to head seamlessly.
   * Time Complexity: O(1)
   */
  public next(): T | undefined {
    if (!this.current) return undefined;
    this.current = this.current.next;
    return this.current.data;
  }

  /**
   * Rewinds pointer to the previous circular node.
   * Wraps around from head to tail seamlessly.
   * Time Complexity: O(1)
   */
  public prev(): T | undefined {
    if (!this.current) return undefined;
    this.current = this.current.prev;
    return this.current.data;
  }

  /**
   * Returns current active item.
   * Time Complexity: O(1)
   */
  public getCurrent(): T | undefined {
    return this.current ? this.current.data : undefined;
  }

  /**
   * Sets current pointer to the node satisfying the predicate.
   * Time Complexity: O(N)
   */
  public setCurrent(predicate: (item: T) => boolean): boolean {
    if (!this.head) return false;
    let curr = this.head;
    for (let i = 0; i < this.length; i++) {
      if (predicate(curr.data)) {
        this.current = curr;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  public size(): number {
    return this.length;
  }

  public toArray(): T[] {
    const list: T[] = [];
    if (!this.head) return list;
    let curr = this.head;
    for (let i = 0; i < this.length; i++) {
      list.push(curr.data);
      curr = curr.next;
    }
    return list;
  }

  public static fromArray<U>(items: U[]): CircularLinkedList<U> {
    const list = new CircularLinkedList<U>();
    for (const item of items) {
      list.append(item);
    }
    return list;
  }
}
