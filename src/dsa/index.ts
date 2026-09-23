/**
 * @file index.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 *
 * Central export index for all named DSA implementations in the Virtual DSD Lab.
 */

// Module 1: Linear Data Structures (CO1)
export { Stack } from './Stack';
export { LinearQueue, CircularQueue } from './Queue';
export {
  SinglyNode,
  SinglyLinkedList,
  DoublyNode,
  DoublyLinkedList,
  CircularNode,
  CircularLinkedList,
} from './LinkedList';
export {
  ExpressionEvaluator,
  ExpressionTreeNode,
  type BooleanContext,
} from './ExpressionEvaluator';

// Module 2: Non-Linear Data Structures (CO2)
export { Graph, DirectedAcyclicGraph } from './Graph';
export { BSTNode, BinarySearchTree } from './BinarySearchTree';
export { TreeNode } from './ContentTree';

// Module 3: Searching and Hashing (CO3)
export { Searching, type SearchResult } from './Searching';
export { HashTable, type CollisionResolution } from './HashTable';

// Module 4: Algorithm Analysis and Efficiency (CO4)
export { Sorting, type Comparator } from './Sorting';
