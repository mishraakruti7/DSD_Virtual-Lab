/**
 * @file BinarySearchTree.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 2: Non-Linear Data Structures (CO2)
 * @section 2.1: Tree Concepts and Binary Search Tree (BST)
 *
 * @description
 * Generic Binary Search Tree (BST) maintaining key-ordered node hierarchies.
 * Provides O(log N) average-case search, insertion, prefix filtering, and sorted in-order traversal.
 *
 * @applications_in_project
 * 1. DSD Technical Glossary Indexing (`GlossaryPage.tsx`):
 *    - Indexes 80+ digital electronics glossary definitions sorted by term.
 *    - In-order traversal produces strictly alphabetical listing in O(N) time without external sort calls.
 *    - Fast prefix search for live search box autocompletion.
 *
 * @complexity_analysis
 * - Search:            Average O(log N), Worst O(N) (skewed/degenerate tree)
 * - Insert:            Average O(log N), Worst O(N)
 * - In-Order Traversal: O(N) time, O(H) call-stack space (where H is tree height)
 * - Prefix Search:     O(log N + M) where M is the number of matching items
 * - Space:             O(N) node allocations
 */

export class BSTNode<K, V> {
  public key: K;
  public value: V;
  public left: BSTNode<K, V> | null = null;
  public right: BSTNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class BinarySearchTree<K, V> {
  private root: BSTNode<K, V> | null = null;
  private count: number = 0;
  private comparator: (a: K, b: K) => number;

  /**
   * Constructs a BST with an optional custom key comparator.
   * Defaults to standard string/number comparison.
   */
  constructor(comparator?: (a: K, b: K) => number) {
    this.comparator =
      comparator ||
      ((a: K, b: K) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
  }

  /**
   * Inserts a key-value pair into the BST.
   * Time Complexity: Average O(log N), Worst O(N)
   */
  public insert(key: K, value: V): void {
    const newNode = new BSTNode(key, value);
    if (!this.root) {
      this.root = newNode;
      this.count++;
      return;
    }

    let current = this.root;
    while (true) {
      const cmp = this.comparator(key, current.key);
      if (cmp === 0) {
        // Update existing key value
        current.value = value;
        return;
      } else if (cmp < 0) {
        if (!current.left) {
          current.left = newNode;
          this.count++;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          this.count++;
          return;
        }
        current = current.right;
      }
    }
  }

  /**
   * Searches for a value by exact key.
   * Time Complexity: Average O(log N), Worst O(N)
   */
  public search(key: K): V | undefined {
    let current = this.root;
    while (current) {
      const cmp = this.comparator(key, current.key);
      if (cmp === 0) return current.value;
      if (cmp < 0) current = current.left;
      else current = current.right;
    }
    return undefined;
  }

  /**
   * Performs an In-Order Traversal (Left, Root, Right).
   * Yields elements in non-decreasing sorted order.
   * Time Complexity: O(N)
   */
  public inOrderTraversal(): V[] {
    const result: V[] = [];
    const traverse = (node: BSTNode<K, V> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Searches for all values whose string key starts with the specified prefix.
   * Time Complexity: O(log N + M) where M is matches count
   */
  public searchPrefix(prefix: string): V[] {
    const results: V[] = [];
    const lowerPrefix = prefix.toLowerCase();

    const collectSubtree = (node: BSTNode<K, V> | null) => {
      if (!node) return;
      const keyStr = String(node.key).toLowerCase();
      if (keyStr.startsWith(lowerPrefix)) {
        results.push(node.value);
      }
      collectSubtree(node.left);
      collectSubtree(node.right);
    };

    collectSubtree(this.root);
    return results;
  }

  /**
   * Returns the minimum value in the tree (leftmost leaf).
   * Time Complexity: Average O(log N)
   */
  public min(): V | undefined {
    if (!this.root) return undefined;
    let curr = this.root;
    while (curr.left) curr = curr.left;
    return curr.value;
  }

  /**
   * Returns the maximum value in the tree (rightmost leaf).
   * Time Complexity: Average O(log N)
   */
  public max(): V | undefined {
    if (!this.root) return undefined;
    let curr = this.root;
    while (curr.right) curr = curr.right;
    return curr.value;
  }

  public size(): number {
    return this.count;
  }

  public isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Calculates maximum tree depth / height.
   * Time Complexity: O(N)
   */
  public height(): number {
    const calcHeight = (node: BSTNode<K, V> | null): number => {
      if (!node) return 0;
      return 1 + Math.max(calcHeight(node.left), calcHeight(node.right));
    };
    return calcHeight(this.root);
  }
}
