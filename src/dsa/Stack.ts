/**
 * @file Stack.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 1: Linear Data Structures (CO1)
 * @section 1.2 - 1.3: Stack Representation, Operations, and Applications
 *
 * @description
 * Generic LIFO (Last-In-First-Out) Stack data structure implemented with array backing.
 * Provides guaranteed O(1) amortized push, pop, and peek operations.
 *
 * @applications_in_project
 * 1. Virtual Breadboard Undo/Redo history stacks (`undoStack`, `redoStack`) in `VirtualBreadboard.tsx`.
 * 2. Shunting-Yard Boolean Infix to Postfix expression conversion in `ExpressionEvaluator.ts`.
 * 3. Postfix expression evaluation stack in `ExpressionEvaluator.ts`.
 * 4. Quiz navigation back-history stack.
 *
 * @complexity_analysis
 * - push(item):  O(1) amortized time, O(1) auxiliary space
 * - pop():       O(1) time, O(1) auxiliary space
 * - peek():      O(1) time, O(1) auxiliary space
 * - isEmpty():   O(1) time
 * - size():      O(1) time
 * - Space:       O(N) where N is the number of elements currently stored
 */

export class Stack<T> {
  private elements: T[] = [];
  private readonly maxCapacity: number;

  /**
   * Constructs a new Stack.
   * @param maxCapacity Optional bound to prevent unbounded growth in history management
   */
  constructor(maxCapacity: number = 500) {
    this.maxCapacity = maxCapacity;
  }

  /**
   * Pushes an item onto the top of the stack.
   * If capacity is exceeded, oldest items are dropped (bounded history buffer).
   * Time Complexity: O(1) amortized
   */
  public push(item: T): void {
    if (this.elements.length >= this.maxCapacity) {
      this.elements.shift(); // Evict oldest element to maintain bounds
    }
    this.elements.push(item);
  }

  /**
   * Removes and returns the top item from the stack.
   * Returns undefined if the stack is empty.
   * Time Complexity: O(1)
   */
  public pop(): T | undefined {
    return this.elements.pop();
  }

  /**
   * Returns the top item without removing it.
   * Time Complexity: O(1)
   */
  public peek(): T | undefined {
    if (this.isEmpty()) return undefined;
    return this.elements[this.elements.length - 1];
  }

  /**
   * Checks whether the stack contains any items.
   * Time Complexity: O(1)
   */
  public isEmpty(): boolean {
    return this.elements.length === 0;
  }

  /**
   * Returns the current number of items on the stack.
   * Time Complexity: O(1)
   */
  public size(): number {
    return this.elements.length;
  }

  /**
   * Clears all items from the stack.
   * Time Complexity: O(1)
   */
  public clear(): void {
    this.elements = [];
  }

  /**
   * Returns a copy of the stack elements from bottom to top.
   * Time Complexity: O(N)
   */
  public toArray(): T[] {
    return [...this.elements];
  }

  /**
   * Returns a copy of the stack elements from top to bottom (LIFO order).
   * Time Complexity: O(N)
   */
  public toReversedArray(): T[] {
    return [...this.elements].reverse();
  }
}
