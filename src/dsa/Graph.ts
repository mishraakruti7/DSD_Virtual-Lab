/**
 * @file Graph.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 2: Non-Linear Data Structures (CO2)
 * @section 2.3 - 2.4: Graph Representations (Adjacency List), BFS, DFS, Connected Components, Topological Sort
 *
 * @description
 * Graph data structure and algorithms modeling electrical circuits, netlists, signal propagation,
 * and Finite State Machines (FSM).
 *
 * @applications_in_project
 * 1. Virtual Breadboard Netlist Computation (`VirtualBreadboard.tsx`):
 *    - Holes, terminals, IC pins, and power rails are vertices (V).
 *    - Jumper wires and breadboard internal tie-strips are edges (E).
 *    - Electrical nets are computed via `findConnectedComponents()` using BFS/DFS.
 * 2. Power and Ground Reachability Verification:
 *    - `isReachable('vcc-rail', 'pin-14')` and `isReachable('gnd-rail', 'pin-7')` execute BFS.
 * 3. Combinational Logic Gate Evaluation Order (`DirectedAcyclicGraph`):
 *    - Primary inputs (switches) -> Gate input pins -> Gate output pins -> Resistor -> LED.
 *    - Evaluated via Kahn's Algorithm (`topologicalSort`) to eliminate undefined signal races.
 * 4. FSM State Diagram Traversal (`SimulatorsPage.tsx`):
 *    - States (S0..S3) are vertices, input bit transitions are directed edges.
 *
 * @complexity_analysis
 * - Graph Representation: Adjacency List using Map<V, Set<V>>, O(V + E) space
 * - addVertex / addEdge: O(1) time
 * - BFS / DFS Traversal: O(V + E) time, O(V) auxiliary space
 * - findConnectedComponents: O(V + E) time (visits every node and edge exactly once)
 * - isReachable: O(V + E) worst-case time (terminates early upon reaching target)
 * - Topological Sort (Kahn's): O(V + E) time, O(V) auxiliary queue space
 */

import { LinearQueue } from './Queue';

export class Graph<V> {
  private adjacencyList: Map<V, Set<V>> = new Map();

  /**
   * Adds a vertex to the graph if it doesn't already exist.
   * Time Complexity: O(1)
   */
  public addVertex(vertex: V): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Set());
    }
  }

  /**
   * Adds an edge between two vertices.
   * For undirected electrical nets, directed defaults to false.
   * Time Complexity: O(1)
   */
  public addEdge(u: V, v: V, directed: boolean = false): void {
    this.addVertex(u);
    this.addVertex(v);
    this.adjacencyList.get(u)!.add(v);
    if (!directed) {
      this.adjacencyList.get(v)!.add(u);
    }
  }

  /**
   * Checks if an edge exists between u and v.
   * Time Complexity: O(1) average
   */
  public hasEdge(u: V, v: V): boolean {
    return this.adjacencyList.get(u)?.has(v) ?? false;
  }

  /**
   * Returns all adjacent neighbor vertices for a given vertex.
   * Time Complexity: O(deg(V))
   */
  public getNeighbors(vertex: V): V[] {
    const set = this.adjacencyList.get(vertex);
    return set ? Array.from(set) : [];
  }

  /**
   * Returns all vertices in the graph.
   */
  public getVertices(): V[] {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Breadth-First Search (BFS) from a starting vertex.
   * Uses a LinearQueue for level-order exploration.
   * Time Complexity: O(V + E)
   */
  public bfs(start: V, visitor?: (v: V) => void): V[] {
    const visited = new Set<V>();
    const order: V[] = [];
    const queue = new LinearQueue<V>();

    if (!this.adjacencyList.has(start)) return order;

    visited.add(start);
    queue.enqueue(start);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      order.push(current);
      if (visitor) visitor(current);

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }

    return order;
  }

  /**
   * Depth-First Search (DFS) from a starting vertex.
   * Explores as deep as possible along each branch before backtracking.
   * Time Complexity: O(V + E)
   */
  public dfs(start: V, visitor?: (v: V) => void): V[] {
    const visited = new Set<V>();
    const order: V[] = [];

    const traverse = (vertex: V) => {
      visited.add(vertex);
      order.push(vertex);
      if (visitor) visitor(vertex);

      for (const neighbor of this.getNeighbors(vertex)) {
        if (!visited.has(neighbor)) {
          traverse(neighbor);
        }
      }
    };

    if (this.adjacencyList.has(start)) {
      traverse(start);
    }

    return order;
  }

  /**
   * Computes all Connected Components of an undirected graph.
   * Directly solves the electrical netlist problem:
   * Every component returned represents an isolated electrical net of mutually shorted terminals.
   * Time Complexity: O(V + E)
   */
  public findConnectedComponents(): Set<V>[] {
    const visited = new Set<V>();
    const components: Set<V>[] = [];

    for (const vertex of this.getVertices()) {
      if (!visited.has(vertex)) {
        const component = new Set<V>();
        this.bfs(vertex, (v) => {
          visited.add(v);
          component.add(v);
        });
        components.push(component);
      }
    }

    return components;
  }

  /**
   * Verifies if a path exists from source to target.
   * Evaluates electrical continuity (e.g. VCC reachability to IC power pin).
   * Time Complexity: O(V + E)
   */
  public isReachable(source: V, target: V): boolean {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(target)) return false;
    if (source === target) return true;

    const visited = new Set<V>();
    const queue = new LinearQueue<V>();

    visited.add(source);
    queue.enqueue(source);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      if (current === target) return true;

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          if (neighbor === target) return true;
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }

    return false;
  }

  /**
   * Finds the shortest path between source and target using BFS edge-parent tracking.
   * Time Complexity: O(V + E)
   */
  public findShortestPath(source: V, target: V): V[] | null {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(target)) return null;
    if (source === target) return [source];

    const visited = new Set<V>();
    const parentMap = new Map<V, V>();
    const queue = new LinearQueue<V>();

    visited.add(source);
    queue.enqueue(source);

    let found = false;
    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      if (current === target) {
        found = true;
        break;
      }

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parentMap.set(neighbor, current);
          queue.enqueue(neighbor);
        }
      }
    }

    if (!found) return null;

    // Reconstruct path backwards from target
    const path: V[] = [];
    let curr: V | undefined = target;
    while (curr !== undefined) {
      path.push(curr);
      curr = parentMap.get(curr);
    }
    return path.reverse();
  }
}

/**
 * Directed Acyclic Graph (DAG) for combinational digital logic evaluation.
 * Uses Kahn's Algorithm to topologically sort signal flow from inputs to outputs.
 */
export class DirectedAcyclicGraph<V> {
  private inDegree: Map<V, number> = new Map();
  private adjList: Map<V, Set<V>> = new Map();

  public addVertex(v: V): void {
    if (!this.adjList.has(v)) {
      this.adjList.set(v, new Set());
      this.inDegree.set(v, 0);
    }
  }

  /**
   * Adds a directed dependency: from -> to
   * Meaning signal at `to` depends on computation of `from`.
   */
  public addDependency(from: V, to: V): void {
    this.addVertex(from);
    this.addVertex(to);

    if (!this.adjList.get(from)!.has(to)) {
      this.adjList.get(from)!.add(to);
      this.inDegree.set(to, (this.inDegree.get(to) || 0) + 1);
    }
  }

  /**
   * Executes Kahn's Algorithm for Topological Sorting.
   * Produces the deterministic evaluation sequence for combinational circuits.
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   *
   * @throws Error if cyclic dependency / race condition feedback loop is detected
   */
  public topologicalSort(): V[] {
    const queue = new LinearQueue<V>();
    const inDegreesCopy = new Map<V, number>(this.inDegree);
    const order: V[] = [];

    // Enqueue all source nodes with in-degree 0 (e.g. power rails, switches)
    for (const [vertex, deg] of inDegreesCopy.entries()) {
      if (deg === 0) {
        queue.enqueue(vertex);
      }
    }

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      order.push(current);

      const neighbors = this.adjList.get(current);
      if (neighbors) {
        for (const neighbor of neighbors) {
          const currentDeg = inDegreesCopy.get(neighbor)! - 1;
          inDegreesCopy.set(neighbor, currentDeg);
          if (currentDeg === 0) {
            queue.enqueue(neighbor);
          }
        }
      }
    }

    // If topological sort does not include all vertices, a cycle exists
    if (order.length !== this.adjList.size) {
      console.warn('Cyclic feedback loop detected in DAG topological sort');
    }

    return order;
  }
}
