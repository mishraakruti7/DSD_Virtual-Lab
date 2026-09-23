import { Stack } from '../src/dsa/Stack';
import { LinearQueue, CircularQueue } from '../src/dsa/Queue';
import { DoublyLinkedList, CircularLinkedList } from '../src/dsa/LinkedList';
import { Graph, DirectedAcyclicGraph } from '../src/dsa/Graph';
import { BinarySearchTree } from '../src/dsa/BinarySearchTree';
import { ExpressionEvaluator } from '../src/dsa/ExpressionEvaluator';
import { Searching } from '../src/dsa/Searching';
import { HashTable } from '../src/dsa/HashTable';
import { Sorting } from '../src/dsa/Sorting';

console.log('--- TESTING ALL DSA IMPLEMENTATIONS ---');

// 1. Stack
const stack = new Stack<string>();
stack.push('a');
stack.push('b');
stack.push('c');
console.assert(stack.pop() === 'c', 'Stack LIFO failed');
console.assert(stack.peek() === 'b', 'Stack peek failed');
console.log('✓ Stack passed');

// 2. Queue & Circular Queue
const cQueue = new CircularQueue<number>(4);
cQueue.enqueue(1);
cQueue.enqueue(0);
cQueue.enqueue(0);
cQueue.enqueue(0);
// Ring counter rotate: 1,0,0,0 -> 0,0,0,1
const rotated = cQueue.rotate();
console.assert(rotated === 1, 'Ring rotate failed');
console.assert(cQueue.toArray().join('') === '0001', 'Ring array failed: ' + cQueue.toArray().join(''));
// Johnson counter rotate inverted: 0,0,0,1 -> front 0 dequeued, inverted 1 enqueued at rear -> 0,0,1,1
cQueue.rotateInverted((bit) => (bit === 1 ? 0 : 1));
console.assert(cQueue.toArray().join('') === '0011', 'Johnson rotate failed: ' + cQueue.toArray().join(''));
console.log('✓ CircularQueue passed');

// 3. Doubly & Circular Linked List
const dll = DoublyLinkedList.fromArray(['Mod1', 'Mod2', 'Mod3', 'Mod4']);
const n2 = dll.findNode((x) => x === 'Mod2');
console.assert(n2?.prev?.data === 'Mod1', 'DLL prev failed');
console.assert(n2?.next?.data === 'Mod3', 'DLL next failed');

const cll = CircularLinkedList.fromArray(['DiagA', 'DiagB', 'DiagC']);
console.assert(cll.getCurrent() === 'DiagA', 'CLL init failed');
console.assert(cll.next() === 'DiagB', 'CLL next failed');
console.assert(cll.next() === 'DiagC', 'CLL next failed');
console.assert(cll.next() === 'DiagA', 'CLL circular next wrap failed');
console.assert(cll.prev() === 'DiagC', 'CLL circular prev wrap failed');
console.log('✓ LinkedLists passed');

// 4. Graph & Kahn's Topological Sort
const graph = new Graph<string>();
graph.addEdge('vcc', 'pin14');
graph.addEdge('pin14', 'swA');
graph.addEdge('gnd', 'pin7');
console.assert(graph.isReachable('vcc', 'swA') === true, 'Graph reachability failed');
console.assert(graph.isReachable('vcc', 'gnd') === false, 'Graph isolation failed');
const nets = graph.findConnectedComponents();
console.assert(nets.length === 2, 'Graph connected components failed: ' + nets.length);

const dag = new DirectedAcyclicGraph<string>();
dag.addDependency('swA', 'pin1');
dag.addDependency('swB', 'pin2');
dag.addDependency('pin1', 'gateOut');
dag.addDependency('pin2', 'gateOut');
dag.addDependency('gateOut', 'led');
const topoOrder = dag.topologicalSort();
console.assert(topoOrder.indexOf('swA') < topoOrder.indexOf('gateOut'), 'Topo sort order failed');
console.assert(topoOrder.indexOf('gateOut') < topoOrder.indexOf('led'), 'Topo sort order failed');
console.log('✓ Graph & DAG passed');

// 5. Expression Evaluator & Expression Tree
const expr = 'A & (B | !C)';
const postfix = ExpressionEvaluator.infixToPostfix(expr);
console.assert(postfix.join(' ') === 'A B C ! | &', 'Postfix failed: ' + postfix.join(' '));
const evalResult = ExpressionEvaluator.evaluatePostfix(postfix, { A: true, B: false, C: false });
console.assert(evalResult === true, 'Postfix eval failed');
const tree = ExpressionEvaluator.buildExpressionTree(postfix);
const treeEval = ExpressionEvaluator.evaluateTree(tree, { A: true, B: false, C: false });
console.assert(treeEval === true, 'Tree eval failed');
console.log('✓ ExpressionEvaluator & ExpressionTree passed');

// 6. Binary Search Tree
const bst = new BinarySearchTree<string, string>();
bst.insert('race', 'Race-around condition in JK FF');
bst.insert('fanout', 'Fan-out of TTL gate');
bst.insert('setup', 'Setup time');
bst.insert('hold', 'Hold time');
console.assert(bst.search('fanout') === 'Fan-out of TTL gate', 'BST search failed');
const inOrder = bst.inOrderTraversal();
console.assert(inOrder[0] === 'Fan-out of TTL gate', 'BST in-order failed: ' + inOrder[0]);
console.log('✓ BinarySearchTree passed');

// 7. Searching
const sortedCatalog = [
  { title: '7400 Quad NAND' },
  { title: '7404 Hex Inverter' },
  { title: '7408 Quad AND' },
  { title: '7432 Quad OR' },
  { title: '7476 Dual JK' },
  { title: '7490 BCD Counter' },
];
const bSearch = Searching.binarySearch(sortedCatalog, '7408 Quad AND', (x) => x.title);
console.assert(bSearch.found === true && bSearch.index === 2, 'Binary search failed');
const prefixMatches = Searching.binarySearchPrefix(sortedCatalog, '740', (x) => x.title);
console.assert(prefixMatches.length === 3, 'Prefix search failed: ' + prefixMatches.length);
console.log('✓ Searching passed');

// 8. Hash Table
const htLinear = new HashTable<string, number>(11, 'linear');
htLinear.set('net1', 5);
htLinear.set('net2', 0);
console.assert(htLinear.get('net1') === 5, 'HT linear get failed');
console.assert(htLinear.get('net2') === 0, 'HT linear get 0 failed');

const htQuad = new HashTable<string, string>(11, 'quadratic');
htQuad.set('pin-14', 'VCC');
htQuad.set('pin-7', 'GND');
console.assert(htQuad.get('pin-14') === 'VCC', 'HT quad failed');
console.log('✓ HashTable passed');

// 9. Sorting
const nums = [42, 12, 88, 3, 27, 65, 1];
const sortedInsert = Sorting.insertionSort(nums, (a, b) => a - b);
const sortedMerge = Sorting.mergeSort(nums, (a, b) => a - b);
const sortedQuick = Sorting.quickSort(nums, (a, b) => a - b);
const expected = [1, 3, 12, 27, 42, 65, 88];
console.assert(sortedInsert.join(',') === expected.join(','), 'InsertionSort failed');
console.assert(sortedMerge.join(',') === expected.join(','), 'MergeSort failed');
console.assert(sortedQuick.join(',') === expected.join(','), 'QuickSort failed');
console.log('✓ Sorting passed');

console.log('ALL DSA TESTS PASSED SUCESSFULLY!');
