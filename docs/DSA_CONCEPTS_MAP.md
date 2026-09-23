# Data Structures and Algorithms (ECCOR2PC204) Implementation Map
## Virtual Digital System Design (DSD) Laboratory

**Course Reference:** ECCOR2PC204 — Data Structures & Algorithms  
**Target Evaluation:** Course Outcomes CO1, CO2, CO3, CO4 (Theory + Practical + Viva-Voce)  
**Companion Project:** Virtual DSD Laboratory (Digital System Design & HDL Simulator)  
**Implementation Directory:** `src/dsa/` and integrated system components  

---

## Executive Summary & Engineering Philosophy

This document maps how authentic Data Structures and Algorithms (ECCOR2PC204) are intrinsically embedded across the Virtual DSD Lab. Rather than creating arbitrary academic demos, DSA structures are deployed to solve genuine computational problems encountered in Electronic Computer-Aided Design (ECAD) software and HDL simulators:

1. **Electrical Netlists as Graphs:** Breadboard holes, IC pins, and power rails form an undirected graph; electrical continuity (nets) is computed via **Breadth-First Search (BFS) Connected Components**.
2. **Deterministic Gate Evaluation:** Combinational digital gates form a Directed Acyclic Graph (DAG) evaluated in dependency-resolved order using **Kahn's Topological Sort Algorithm**.
3. **Hardware Registers as Circular Buffers:** 4-bit Ring and Johnson Counters circulate states using a **Fixed-Capacity Circular Queue** with modular index arithmetic.
4. **Interactive Action History:** Wire routing undo/redo utilizes an explicit **LIFO Stack** pattern.
5. **Alphabetical Technical Indexes:** 80+ digital engineering terms are organized in a **Binary Search Tree (BST)** providing $O(\log N)$ lookup and $O(N)$ sorted in-order traversal.
6. **Simulation Memoization:** Repeated breadboard net evaluations are cached using an open-addressing **Hash Table with Linear and Quadratic Probing**.
7. **Hybrid Search Engine:** Quick Search (`CommandPalette`) leverages **Binary Search** over pre-sorted indexes with a **Linear Search** fallback.
8. **Algorithmic Sorting Trade-offs:** Small quiz attempt sets ($N \le 20$) are sorted via **Insertion Sort** ($O(1)$ space), while large datasets and schematics are sorted via **Merge Sort** and **Quick Sort**.

---

## SYLLABUS MAPPING MATRIX

| DSA Module / Topic | ECCOR2PC204 Syllabus Section | Primary Source File(s) | Key Symbols / Classes / Functions | Course Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Stack (LIFO)** | 1.2 Stack Representation & Operations | `src/dsa/Stack.ts`<br>`src/components/stations/Station3Breadboard/VirtualBreadboard.tsx`<br>`src/pages/QuizHubPage.tsx` | `Stack<T>`<br>`undoStack`<br>`redoStack`<br>`navHistoryStack` | **CO1** |
| **Stack Applications** | 1.3 Infix to Postfix Conversion & Postfix Evaluation | `src/dsa/ExpressionEvaluator.ts` | `ExpressionEvaluator.infixToPostfix`<br>`ExpressionEvaluator.evaluatePostfix` | **CO1** |
| **Linear Queue** | 1.4 Queue Operations & Event Simulation | `src/dsa/Queue.ts`<br>`src/utils/logicSimulation.ts` | `LinearQueue<T>`<br>`SimulationEngine.enqueueEvent`<br>`SimulationEngine.processNextEvent` | **CO1** |
| **Circular Queue** | 1.4 Circular Queue Representation & Rotation | `src/dsa/Queue.ts`<br>`src/pages/SimulatorsPage.tsx` | `CircularQueue<T>`<br>`CircularQueue.rotate()`<br>`CircularQueue.rotateInverted()` | **CO1** |
| **Doubly Linked List** | 1.5 Doubly Linked List Traversal | `src/dsa/LinkedList.ts`<br>`src/pages/TheoryModulesPage.tsx` | `DoublyLinkedList<T>`<br>`DoublyNode<T>`<br>`findNode`, `prev`, `next` | **CO1** |
| **Circular Linked List**| 1.5 Circular Linked List Traversal | `src/dsa/LinkedList.ts`<br>`src/pages/CircuitGalleryPage.tsx` | `CircularLinkedList<T>`<br>`CircularNode<T>`<br>`next()`, `prev()` | **CO1** |
| **Binary Search Tree** | 2.1 BST Insertion, Search & In-Order Traversal | `src/dsa/BinarySearchTree.ts`<br>`src/pages/GlossaryPage.tsx` | `BinarySearchTree<K,V>`<br>`inOrderTraversal()`<br>`searchPrefix()` | **CO2** |
| **Expression Tree** | 2.2 Expression Tree Construction & Post-Order Evaluation | `src/dsa/ExpressionEvaluator.ts` | `ExpressionTreeNode`<br>`buildExpressionTree()`<br>`evaluateTree()` | **CO2** |
| **Graph Adjacency List**| 2.3 Graph Representation & BFS/DFS | `src/dsa/Graph.ts`<br>`src/components/stations/Station3Breadboard/VirtualBreadboard.tsx` | `Graph<V>`<br>`findConnectedComponents()`<br>`isReachable()` | **CO2** |
| **Topological Sort** | 2.4 Directed Acyclic Graph & Kahn's Algorithm | `src/dsa/Graph.ts`<br>`src/components/stations/Station3Breadboard/VirtualBreadboard.tsx` | `DirectedAcyclicGraph<V>`<br>`topologicalSort()` (Kahn's) | **CO2** |
| **FSM State Graph** | 2.3 Directed State Graph & Traversal | `src/dsa/Graph.ts`<br>`src/pages/SimulatorsPage.tsx` | `Graph<FsmState>`<br>`fsmTransitions`<br>`stepFSM` | **CO2** |
| **Binary Search** | 3.1 Binary Search & Prefix Range Matching | `src/dsa/Searching.ts`<br>`src/components/layout/CommandPalette.tsx` | `Searching.binarySearch`<br>`Searching.binarySearchPrefix` | **CO3** |
| **Linear Search** | 3.1 Linear Search (Sequential Scan Fallback) | `src/dsa/Searching.ts`<br>`src/components/layout/CommandPalette.tsx` | `Searching.linearSearch`<br>`Searching.linearSearchSubstring` | **CO3** |
| **Hash Table (Linear)** | 3.2 - 3.3 Hashing & Linear Probing Collision Resolution | `src/dsa/HashTable.ts`<br>`src/components/stations/Station3Breadboard/VirtualBreadboard.tsx` | `HashTable<K,V>` (`'linear'`)<br>`simulationCache` | **CO3** |
| **Hash Table (Quadratic)**| 3.2 - 3.3 Hashing & Quadratic Probing Resolution | `src/dsa/HashTable.ts`<br>`src/pages/QuizHubPage.tsx` | `HashTable<K,V>` (`'quadratic'`)<br>`questionHashTable` | **CO3** |
| **Insertion Sort** | 4.2 Insertion Sort for Small Datasets | `src/dsa/Sorting.ts`<br>`src/pages/ProgressDashboardPage.tsx` | `Sorting.insertionSort`<br>`sortedQuizAttempts` | **CO4** |
| **Merge Sort** | 4.2 Stable Divide-and-Conquer Sort | `src/dsa/Sorting.ts`<br>`src/components/layout/CommandPalette.tsx`<br>`src/pages/QuizHubPage.tsx` | `Sorting.mergeSort`<br>`sortedByTitle`<br>`sortedQuestionBank` | **CO4** |
| **Quick Sort** | 4.2 In-Place Divide-and-Conquer Sort | `src/dsa/Sorting.ts`<br>`src/pages/CircuitGalleryPage.tsx` | `Sorting.quickSort`<br>`sortedDiagrams` | **CO4** |

---

## MODULE 1: Linear Data Structures (CO1)

### 1.1 Stack (`src/dsa/Stack.ts`)
- **Syllabus Section:** 1.2 Stack Representation and Operations.
- **Implementation:** Generic class `Stack<T>` with bounded capacity, implementing `push()`, `pop()`, `peek()`, `isEmpty()`, `size()`, and `toArray()`.
- **Authentic Engineering Justification:**
  In interactive CAD tools (such as Altium, KiCad, or our Virtual Breadboard), users frequently place or remove jumper wires. Modeling action history as a Last-In-First-Out (LIFO) stack is the textbook software architecture for Undo/Redo:
  - Adding or removing a wire pushes a `WireAction` record to `undoStack` and clears `redoStack`.
  - Clicking Undo pops from `undoStack`, reverts the breadboard wire array, and pushes the reverted state to `redoStack`.
  - Clicking Redo pops from `redoStack` and restores the forward state.
- **Asymptotic Complexity:**
  - `push(item)`: $O(1)$ amortized time, $O(1)$ auxiliary space.
  - `pop()`: $O(1)$ time, $O(1)$ auxiliary space.
  - `peek()`: $O(1)$ time.
  - Total Space: $O(N)$ where $N$ is maximum history depth (capped at 50 to bound memory footprint).

### 1.2 Stack Applications: Shunting-Yard Infix to Postfix & Evaluation (`src/dsa/ExpressionEvaluator.ts`)
- **Syllabus Section:** 1.3 Applications of Stacks (Infix to Postfix conversion, Postfix evaluation).
- **Implementation:**
  - `ExpressionEvaluator.infixToPostfix(expr)`: Dijkstra's Shunting-Yard Algorithm utilizing an operator `Stack<string>`.
  - `ExpressionEvaluator.evaluatePostfix(tokens, context)`: Reverse Polish Notation (RPN) evaluation using an operand `Stack<boolean>`.
- **Authentic Engineering Justification:**
  Evaluating student-entered Boolean equations or PLA/PAL sum-of-products terms cannot safely rely on Javascript's `eval()` due to security vulnerabilities and arbitrary execution risks. Implementing the formal Shunting-Yard stack algorithm allows deterministic operator precedence (`!` > `&` > `^` > `|`) and parentheses resolution for arbitrary Boolean expressions.
- **Asymptotic Complexity:**
  - Tokenization: $O(L)$ where $L$ is expression string length.
  - Infix $\to$ Postfix: $O(N)$ time where $N$ is token count; $O(N)$ auxiliary stack space.
  - Postfix Evaluation: $O(N)$ time; $O(N)$ operand stack space.

### 1.3 Linear Queue & Discrete-Event Simulation (`src/dsa/Queue.ts`, `src/utils/logicSimulation.ts`)
- **Syllabus Section:** 1.4 Queue Operations and Applications.
- **Implementation:** `LinearQueue<T>` with FIFO order (`enqueue()`, `dequeue()`, `peek()`). Embedded in `SimulationEngine` (`logicSimulation.ts`).
- **Authentic Engineering Justification:**
  Real digital circuits do not switch instantaneously; changes propagate through gates with characteristic propagation delays ($t_{pd}$). Discrete-Event Simulation (DES) models this by enqueuing signal transition events (`SimEvent: { timestamp, targetNet, newValue }`) into a temporal FIFO queue and processing them in order of occurrence.
- **Asymptotic Complexity:**
  - `enqueue(item)`: $O(1)$ time.
  - `dequeue()`: $O(1)$ amortized time.
  - Space: $O(E)$ where $E$ is count of pending signal events.

### 1.4 Circular Queue & Counter Simulators (`src/dsa/Queue.ts`, `src/pages/SimulatorsPage.tsx`)
- **Syllabus Section:** 1.4 Circular Queue Representation & Wrap-Around Indexing.
- **Implementation:** `CircularQueue<T>` utilizing fixed array buffer and modular arithmetic:
  $$\text{head} = (\text{head} + 1) \pmod{\text{capacity}}$$
  $$\text{tail} = (\text{tail} + 1) \pmod{\text{capacity}}$$
- **Authentic Engineering Justification:**
  A Digital Ring Counter (Module 1 sequential logic) is structurally a circular shift register where a single circulating bit ($1000 \to 0100 \to 0010 \to 0001 \to 1000$) cycles endlessly. A Johnson Counter (Twisted Ring Counter) circulates bits with an inverted feedback from the last stage to the first stage ($0000 \to 1000 \to 1100 \to \dots \to 0000$).
  `CircularQueue.rotate()` and `CircularQueue.rotateInverted()` map 1:1 to the physical flip-flop clocking action without memory reallocations or array copying.
- **Asymptotic Complexity:**
  - `rotate()` / `rotateInverted()`: $O(1)$ time, $O(1)$ space.
  - Space: $O(C)$ fixed allocation where $C = 4$ flip-flop stages.

### 1.5 Linked Lists: Doubly & Circular (`src/dsa/LinkedList.ts`, `TheoryModulesPage.tsx`, `CircuitGalleryPage.tsx`)
- **Syllabus Section:** 1.5 Singly, Doubly, and Circular Linked Lists.
- **Implementation:**
  - `DoublyLinkedList<T>` with `DoublyNode<T>` (`data`, `prev`, `next`).
  - `CircularLinkedList<T>` with `CircularNode<T>` (`data`, `prev`, `next`, circular wrap).
- **Authentic Engineering Justification:**
  - **Theory Module Stepping (`TheoryModulesPage.tsx`):**
    Modules 1 to 4 form an ordered sequence. Rather than error-prone array index boundary checks (`activeModule + 1`), the sequence is formalized as a `DoublyLinkedList<TheoryModule>`. Stepping to the Next or Previous module is an exact $O(1)$ pointer transition (`currentNode.next` and `currentNode.prev`).
  - **Schematic Lightbox Carousel (`CircuitGalleryPage.tsx`):**
    When browsing university circuit schematics, the lightbox cycles continuously: clicking "Next" on the last schematic wraps around to the first, and clicking "Previous" on the first wraps around to the last. `CircularLinkedList<GalleryDiagramItem>` implements this circular pointer link natively.
- **Asymptotic Complexity:**
  - Node stepping (`next()` / `prev()`): $O(1)$ time.
  - Construction from array: $O(N)$ time, $O(N)$ space.

---

## MODULE 2: Non-Linear Data Structures (CO2)

### 2.1 Breadboard Netlist as an Adjacency List Graph (`src/dsa/Graph.ts`, `VirtualBreadboard.tsx`)
- **Syllabus Section:** 2.3 Graph Representation (Adjacency List) & Traversals (BFS / DFS).
- **Implementation:** `Graph<V>` using `Map<V, Set<V>>` storing undirected edges between terminals.
- **Authentic Engineering Justification:**
  In physical electronics, a breadboard consists of isolated tie-strips. When jumper wires connect terminals, they establish equipotential conductors called **electrical nets**.
  - **Nodes ($V$):** Power rails (`vcc-rail-1`, `gnd-rail-1`), IC pins (`pin-1` through `pin-14`), switch terminals, resistor, and LED pins.
  - **Edges ($E$):** User-routed jumper wires and breadboard internal tie-strips.
  - **Connected Components via BFS:**
    Running `findConnectedComponents()` partitions the graph into disjoint sets of mutually connected pins (Nets).
  - **Power & Signal Reachability via BFS:**
    `isReachable('vcc-rail-1', 'pin-14')` and `isReachable('gnd-rail-1', 'pin-7')` execute a BFS traversal to mathematically prove whether power and ground reach the IC before allowing the chip to operate.
- **Asymptotic Complexity:**
  - Adjacency List Space: $O(V + E)$ where $V \approx 20$ terminals and $E \le 30$ wires.
  - Netlist BFS Decomposition: $O(V + E)$ time, visits each pin and wire once.
  - Reachability Query: $O(V + E)$ worst-case, terminates immediately upon reaching destination.

### 2.2 Combinational Logic Evaluation Order via Kahn's Topological Sort (`src/dsa/Graph.ts`, `VirtualBreadboard.tsx`)
- **Syllabus Section:** 2.4 Directed Acyclic Graph (DAG) and Topological Sorting.
- **Implementation:** `DirectedAcyclicGraph<V>` with in-degree array and `LinearQueue` executing **Kahn's Algorithm**.
- **Authentic Engineering Justification:**
  In digital combinational circuits, a gate's output cannot be evaluated before its inputs are valid. For example, in an AND gate connected to switches and driving an LED:
  $$\text{Inputs (Switches)} \longrightarrow \text{Gate Input Pins (1A, 1B)} \longrightarrow \text{Gate Output (1Y)} \longrightarrow \text{Resistor} \longrightarrow \text{LED}$$
  Signal dependencies form a Directed Acyclic Graph (DAG). Kahn's Algorithm computes the exact evaluation sequence by repeatedly dequeuing vertices with an in-degree of 0 (no pending unresolved dependencies). If a feedback loop exists without clocked registers, Kahn's algorithm detects the cycle (indicating an unstable race condition).
- **Asymptotic Complexity:**
  - Kahn's Algorithm: $O(V + E)$ time, $O(V)$ auxiliary queue space.

### 2.3 Binary Search Tree (BST) for Technical Glossary (`src/dsa/BinarySearchTree.ts`, `GlossaryPage.tsx`)
- **Syllabus Section:** 2.1 Tree Concepts, Binary Search Tree (BST) Operations & Traversals.
- **Implementation:** `BinarySearchTree<K, V>` with `BSTNode` pointers (`left`, `right`), `insert()`, `search()`, `searchPrefix()`, and `inOrderTraversal()`.
- **Authentic Engineering Justification:**
  The DSD Lab features 80+ university syllabus definitions (propagation delay, fan-out, race-around condition, setup time, hold time). Inserting terms into a BST sorted by normalized term key provides:
  - $O(\log N)$ average-case lookup.
  - $O(N)$ strictly alphabetical output via **In-Order Traversal** (Left, Root, Right) without requiring separate sorting passes.
  - Prefix sub-tree exploration for instant search box recommendations.
- **Asymptotic Complexity:**
  - Search / Insert: Best $O(1)$, Average $O(\log N)$, Worst $O(N)$ (if degenerate).
  - In-Order Traversal: $O(N)$ time, $O(H)$ stack space ($H = \text{height} \approx \log N$).

### 2.4 Binary Expression Tree (`src/dsa/ExpressionEvaluator.ts`)
- **Syllabus Section:** 2.2 Expression Trees & Tree Traversals.
- **Implementation:** `ExpressionTreeNode` (`value`, `left`, `right`), built from postfix tokens via a stack; evaluated via **Post-Order Traversal** (Left, Right, Root).
- **Authentic Engineering Justification:**
  Expression Trees are the fundamental internal representation used by silicon compilers and logic synthesizers (e.g. Synopsys Design Compiler, Yosys). Interior nodes represent Boolean logic gates (`AND`, `OR`, `XOR`, `NOT`), while leaves represent circuit input nets. Post-order traversal recursively evaluates operands before applying the gate function.
- **Asymptotic Complexity:**
  - Tree Construction: $O(N)$ time, $O(N)$ space.
  - Post-Order Evaluation: $O(N)$ time.

### 2.5 Finite State Machine (FSM) State Graph (`src/dsa/Graph.ts`, `src/pages/SimulatorsPage.tsx`)
- **Syllabus Section:** 2.3 Directed Graph Traversal & Reachability.
- **Implementation:** `Graph<FsmState>` modeling the sequence detector FSM ($1011$ detector) with vertices $\{S_0, S_1, S_2, S_3\}$ and directed transition edges labeled by input bits ($0$ or $1$).
- **Authentic Engineering Justification:**
  FSMs in digital design are physically state transition graphs. The simulator steps from state to state by traversing directed graph edges. Graph reachability verifies that all states are reachable from reset state $S_0$, proving zero dead states exist in the hardware synthesis model.
- **Asymptotic Complexity:**
  - State step: $O(\text{out-degree}) = O(1)$ since digital inputs are binary (degree 2).
  - Reachability check: $O(V + E)$ where $V = 4, E = 8$.

---

## MODULE 3: Searching and Hashing (CO3)

### 3.1 Binary Search & Linear Search Fallback (`src/dsa/Searching.ts`, `CommandPalette.tsx`)
- **Syllabus Section:** 3.1 Searching Techniques (Linear Search and Binary Search).
- **Implementation:**
  - `Searching.binarySearch<T, K>(sortedArray, target, keyExtractor)`: Iterative divide-and-conquer binary search.
  - `Searching.binarySearchPrefix<T>(sortedArray, prefix, keyExtractor)`: Binary search boundary locator with contiguous prefix extraction.
  - `Searching.linearSearch<T>(array, predicate)`: Sequential scan fallback.
- **Authentic Engineering Justification:**
  Binary Search has a strict prerequisite: the dataset must be sorted ($O(N \log N)$ pre-sort cost). In the global Command Palette (`Ctrl+K`), the catalog of ~100 items (experiments, ICs, theory topics) is sorted alphabetically once at boot time.
  - When the student types a prefix (e.g. `"740"` or `"Flip"`), `binarySearchPrefix` locates the range in $O(\log N)$ time.
  - When searching for arbitrary substrings in descriptions (e.g. `"race-around"` inside a topic description), binary search cannot be applied; the system falls back to `linearSearch` in $O(N)$ time.
  This provides a live classroom demonstration of why binary search requires sorted keys and when linear search remains necessary.
- **Asymptotic Complexity:**
  - Binary Search: Best $O(1)$, Average $O(\log N)$, Worst $O(\log N)$, Space $O(1)$.
  - Linear Search: Best $O(1)$, Average $O(N)$, Worst $O(N)$, Space $O(1)$.

### 3.2 Hash Table with Open Addressing & Collision Resolution (`src/dsa/HashTable.ts`, `VirtualBreadboard.tsx`, `QuizHubPage.tsx`)
- **Syllabus Section:** 3.2 - 3.3 Hashing Concepts, Hash Functions, and Collision Resolution (Linear Probing and Quadratic Probing).
- **Implementation:**
  - Generic `HashTable<K, V>` implementing open addressing with tombstone markers and dynamic table doubling when load factor $\alpha > 0.70$.
  - Polynomial rolling hash function:
    $$h(s) = \left( \sum_{i=0}^{L-1} s[i] \cdot 31^{L - 1 - i} \right) \pmod M$$
  - **Linear Probing Strategy (`'linear'`):**
    $$\text{index}(k, i) = (h_0 + i) \pmod M$$
  - **Quadratic Probing Strategy (`'quadratic'`):**
    $$\text{index}(k, i) = (h_0 + i + i^2) \pmod M$$
- **Authentic Engineering Justification:**
  - **Circuit Simulation Memoization (`VirtualBreadboard.tsx`):**
    Recomputing BFS connected components and reachability on every 60fps render frame is redundant if the wire layout has not changed. The circuit state (IC part number, switch states, and sorted wire endpoints) is serialized into a string hash key. The computed electrical nets and voltages are cached in a `HashTable` with Linear Probing. Repeated renders execute in $O(1)$ average time.
  - **Question Bank Lookup (`QuizHubPage.tsx`):**
    Quiz questions are indexed by integer ID into a `HashTable` with Quadratic Probing to eliminate primary clustering.
- **Asymptotic Complexity:**
  - Hash Function: $O(L)$ where $L$ is key length.
  - Search / Insert / Delete: Average $O(1)$, Worst $O(N)$ (under full collision clustering).
  - Space: $O(M)$ where $M$ is table capacity ($\alpha \le 0.70$).

---

## MODULE 4: Algorithm Analysis and Sorting (CO4)

### 4.1 Comparative Sorting Algorithms (`src/dsa/Sorting.ts`)
- **Syllabus Section:** 4.2 Sorting Techniques (Insertion Sort, Merge Sort, Quick Sort) & Internal vs. External Sorting.
- **Implementations:**
  1. **Insertion Sort (`Sorting.insertionSort`):**
     Iterative in-place insertion with $O(N)$ best case on nearly sorted data and $O(1)$ space.
  2. **Merge Sort (`Sorting.mergeSort`):**
     Divide-and-conquer recursive partitioning into halves, guaranteeing $O(N \log N)$ in all cases; stable; $O(N)$ auxiliary space.
  3. **Quick Sort (`Sorting.quickSort`):**
     In-place divide-and-conquer using median-of-three pivot selection and a small-partition cutoff ($N < 7$) to Lomuto partition; $O(N \log N)$ average; $O(\log N)$ stack space.

### 4.2 Context-Appropriate Deployment in Project
| Algorithm | Deployed Location | Dataset Characteristics | Why This Algorithm Was Chosen |
| :--- | :--- | :--- | :--- |
| **Insertion Sort** | `ProgressDashboardPage.tsx`<br>(Recent Quiz Attempts) | Small dataset ($N \le 20$), frequently pre-sorted or appended sequentially | For small $N$, Insertion Sort has smaller constant factors than Merge/Quick Sort, executes in-place ($O(1)$ memory), and runs in $O(N)$ time if attempts are nearly sorted by date. |
| **Merge Sort** | `CommandPalette.tsx`<br>`QuizHubPage.tsx`<br>(Catalog & Question Bank) | Medium dataset ($N \approx 100$), stability required | Guaranteed $O(N \log N)$ worst-case defends against UI frame drops. Stability ensures that items with identical primary keys retain their natural category ordering. |
| **Quick Sort** | `CircuitGalleryPage.tsx`<br>(Schematics Library) | Medium/Large items, in-place sorting preferred | Minimizes heap memory allocations during user filtering while median pivot defends against sorted degradation. |

### 4.3 Internal vs. External Sorting Analysis
- **Internal Sorting:**
  Occurs when the entire dataset fits within primary semiconductor memory (RAM).
  *Context in this project:* All datasets in the Virtual DSD Lab (glossary terms, schematics, netlist pins, quiz questions) contain under 1,000 records, fitting comfortably in RAM ($< 5\text{ MB}$). Hence, internal sorting is universally appropriate.
- **External Sorting:**
  Required when datasets exceed RAM capacity (e.g. multi-gigabyte Verilog simulation dump files `.vcd` with millions of signal cycles). External sorting utilizes secondary disk storage with $k$-way merge passes (e.g. External Merge Sort).

---

## Comprehensive Algorithm Analysis Table

| Algorithm / Data Structure | Primary Operation | Best Case Time | Average Case Time | Worst Case Time | Space Complexity | Realistic Lab Input Size ($N$) | Real-World Justification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`Stack<T>`** | Push / Pop | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ | $N \le 50$ wire actions | Instantaneous wire undo/redo response without UI stutter. |
| **`CircularQueue<T>`** | Rotate / Step | $O(1)$ | $O(1)$ | $O(1)$ | $O(C)$ | $C = 4$ flip-flops | Exact mathematical model of hardware ring circulation. |
| **`DoublyLinkedList<T>`** | Prev / Next Step | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ | $N = 4$ modules | Replaces brittle index bounds checks with pointer stepping. |
| **`CircularLinkedList<T>`**| Carousel Next | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ | $N = 12$ schematics | Endless circular cycling in schematic lightbox. |
| **Shunting-Yard Stack** | Infix $\to$ Postfix | $O(N)$ | $O(N)$ | $O(N)$ | $O(N)$ | $N \le 30$ tokens | Safely parses logic equations without unsafe `eval()`. |
| **Graph Netlist (BFS)** | Connected Components | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $V \approx 20, E \le 30$ | Genuinely models electrical continuity of jumper wires. |
| **Kahn's Topological Sort**| Gate Evaluation Order | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ | $V \le 15$ gates/pins | Resolves gate dependency flow and detects cyclic races. |
| **`BinarySearchTree<K,V>`**| Key Search | $O(1)$ | $O(\log N)$ | $O(N)$ | $O(N)$ | $N = 84$ glossary terms | Fast term lookup with $O(N)$ sorted in-order traversal. |
| **Binary Search** | Prefix Lookup | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(1)$ | $N \approx 100$ items | Instant prefix match in Command Palette. |
| **Linear Search** | Substring Fallback | $O(1)$ | $O(N)$ | $O(N)$ | $O(1)$ | $N \approx 100$ items | Resilient fallback for unindexed description text. |
| **`HashTable<K,V>`** | Get / Set (Linear) | $O(1)$ | $O(1)$ | $O(N)$ | $O(M)$ | $M = 67$, Load $\le 0.7$ | Caches BFS netlist runs, achieving 60fps render speed. |
| **`HashTable<K,V>`** | Get / Set (Quadratic)| $O(1)$ | $O(1)$ | $O(N)$ | $O(M)$ | $M = 131$, Load $\le 0.7$| Eliminates primary clustering in question lookup. |
| **Insertion Sort** | Small-Array Sort | $O(N)$ | $O(N^2)$ | $O(N^2)$ | $O(1)$ in-place | $N \le 20$ attempts | Minimal constant overhead and $O(1)$ memory for attempts. |
| **Merge Sort** | Stable Array Sort | $O(N \log N)$ | $O(N \log N)$ | $O(N \log N)$ | $O(N)$ | $N = 84$ terms / questions| Predictable $O(N \log N)$ time and preserved key stability. |
| **Quick Sort** | In-Place Partition Sort| $O(N \log N)$ | $O(N \log N)$ | $O(N^2)$ | $O(\log N)$ stack | $N = 12$ schematics | Fast partition sorting with median-of-three pivot defense. |

---

## Viva-Voce Examination Defense Guide

When demonstrating this project to an external examiner for ECCOR2PC204 / ECCOR2PC205 viva evaluation, use the following technical talking points:

### Q1: "Where have you used graphs in this project, and why is it not an artificial insertion?"
> **Answer:** "Graphs are the native representation of electrical circuits. In `src/dsa/Graph.ts`, breadboard tie-strips, IC pins, and power rails are vertices ($V$), and jumper wires are edges ($E$). Electrical nets are computed by finding **Connected Components using BFS**. Furthermore, checking whether the IC's $V_{CC}$ pin is energized executes `isReachable('vcc-rail-1', 'pin-14')` via BFS. Finally, combinational logic gate dependencies are modeled as a **Directed Acyclic Graph (DAG)** and ordered via **Kahn's Topological Sort Algorithm** to ensure gates are evaluated only after their inputs are stabilized."

### Q2: "Why use a Circular Queue for the Ring Counter instead of an array with `% array.length`?"
> **Answer:** "In `src/dsa/Queue.ts`, `CircularQueue<T>` encapsulates fixed-capacity memory ($C = 4$) with explicit `head` and `tail` pointers using modular arithmetic $(\text{tail} + 1) \pmod C$. Calling `ringQueue.rotate()` performs an $O(1)$ dequeue from head and enqueue to tail without any array reallocation or element shifting. For the Johnson counter, `rotateInverted()` inverts the dequeued MSB before re-enqueuing to LSB, directly modeling hardware twisted-feedback registers."

### Q3: "Explain how your Undo/Redo mechanism demonstrates Stack behavior."
> **Answer:** "In `src/components/stations/Station3Breadboard/VirtualBreadboard.tsx`, we maintain two instances of `Stack<WireAction>`: `undoStack` and `redoStack`. Every wire addition, wire removal, or preset load pushes a delta record onto `undoStack`. When the student clicks Undo (or presses `Ctrl+Z`), the action is popped from `undoStack` in LIFO order, applied in reverse to the breadboard, and pushed to `redoStack`. If the user performs a new wire action, `redoStack` is cleared, matching standard ECAD editing semantics."

### Q4: "What is the difference between Linear and Quadratic Probing in your HashTable?"
> **Answer:** "In `src/dsa/HashTable.ts`, both are open-addressing collision resolution techniques. Linear probing uses $\text{index} = (h_0 + i) \pmod M$, which suffers from **primary clustering** (long contiguous blocks of occupied buckets causing probe chains to lengthen). Quadratic probing uses $\text{index} = (h_0 + i + i^2) \pmod M$, where probe steps grow quadratically, breaking up primary clusters. In our project, Linear Probing is used for circuit netlist memoization, while Quadratic Probing is used for question bank ID lookups."

### Q5: "Why did you implement both Binary Search and Linear Search in Quick Search?"
> **Answer:** "Binary Search requires sorted keys ($O(N \log N)$ pre-sort) and runs in $O(\log N)$ time. In `src/components/layout/CommandPalette.tsx`, item titles are pre-sorted once. When a student types a prefix, `binarySearchPrefix()` immediately isolates the matching range in $O(\log N)$. However, when searching for keywords buried inside descriptions or categories, binary search cannot be applied because descriptions are not sorted. The system falls back to `linearSearch()`, providing an authentic demonstration of algorithmic trade-offs."

### Q6: "Why use Insertion Sort for quiz attempts but Merge/Quick Sort for glossary terms?"
> **Answer:** "Algorithm analysis (CO4) teaches that asymptotic Big-O ignores low-order terms and constant factors. For small $N$ ($N \le 20$ recent quiz attempts), Insertion Sort has tiny constant factors, zero auxiliary memory allocations ($O(1)$ in-place), and executes in $O(N)$ time if attempts are nearly sorted by date. Conversely, for large datasets ($N = 84$ glossary terms), Insertion Sort degrades to $O(N^2)$, making Merge Sort's guaranteed $O(N \log N)$ divide-and-conquer strategy essential."

### Q7: "How does your Expression Tree evaluate Boolean logic?"
> **Answer:** "In `src/dsa/ExpressionEvaluator.ts`, Dijkstra's Shunting-Yard algorithm first converts an infix formula into postfix notation using a stack. Then, `buildExpressionTree()` constructs a binary tree where leaf nodes are input variables and internal nodes are logic operators (`AND`, `OR`, `NOT`, `XOR`). Evaluating the tree executes a **Post-Order Traversal** (Left, Right, Root), evaluating the child subtrees first before combining their Boolean truth values at the operator node."

---

*Document prepared for academic submission and viva-voce examination under course code ECCOR2PC204.*
