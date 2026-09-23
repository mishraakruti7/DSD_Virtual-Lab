/**
 * @file ContentTree.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 2: Non-Linear Data Structures (CO2)
 * @section 2.1: General Trees and Tree Traversals (DFS / BFS)
 *
 * @description
 * Multi-way hierarchical Tree data structure modeling the course syllabus
 * (Course -> Module -> Section/Topic -> Subtopic).
 * Implements Depth-First Search (DFS) for hierarchical accordion rendering and breadcrumb generation.
 *
 * @applications_in_project
 * 1. Syllabus Hierarchy Representation (`TheoryModulesPage.tsx`, `SyllabusRoadmap.tsx`):
 *    - Replaces nested unstructured object access with formal tree nodes.
 *    - DFS traversal generates complete Table of Contents and validates topic coverage.
 *    - Generates breadcrumbs from any subtopic up to the root course node.
 *
 * @complexity_analysis
 * - Tree Construction: O(N) where N is total nodes (modules + topics + subtopics)
 * - DFS / BFS Traversal: O(N) time, visits each node once
 * - getPathFromRoot (Breadcrumb): O(H) where H is tree depth (H <= 4 in syllabus)
 * - Space: O(N)
 */

export class TreeNode<T> {
  public id: string;
  public title: string;
  public data: T;
  public children: TreeNode<T>[] = [];
  public parent: TreeNode<T> | null = null;

  constructor(id: string, title: string, data: T) {
    this.id = id;
    this.title = title;
    this.data = data;
  }

  /**
   * Appends a child node and links parent pointer.
   * Time Complexity: O(1)
   */
  public addChild(child: TreeNode<T>): void {
    child.parent = this;
    this.children.push(child);
  }

  /**
   * Pre-order Depth-First Search (DFS) traversal.
   * Traverses parent first, then recursively descends through all children.
   * Time Complexity: O(N)
   */
  public dfs(visitor: (node: TreeNode<T>, depth: number) => void, depth: number = 0): void {
    visitor(this, depth);
    for (const child of this.children) {
      child.dfs(visitor, depth + 1);
    }
  }

  /**
   * Breadth-First Search (BFS) level-order traversal.
   * Time Complexity: O(N)
   */
  public bfs(visitor: (node: TreeNode<T>, depth: number) => void): void {
    const queue: { node: TreeNode<T>; depth: number }[] = [{ node: this, depth: 0 }];
    while (queue.length > 0) {
      const { node, depth } = queue.shift()!;
      visitor(node, depth);
      for (const child of node.children) {
        queue.push({ node: child, depth: depth + 1 });
      }
    }
  }

  /**
   * Searches for a node matching the predicate using DFS.
   * Time Complexity: O(N)
   */
  public find(predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null {
    if (predicate(this)) return this;
    for (const child of this.children) {
      const found = child.find(predicate);
      if (found) return found;
    }
    return null;
  }

  /**
   * Generates breadcrumb path from root down to this node.
   * Time Complexity: O(H)
   */
  public getBreadcrumb(): TreeNode<T>[] {
    const path: TreeNode<T>[] = [];
    let curr: TreeNode<T> | null = this;
    while (curr) {
      path.push(curr);
      curr = curr.parent;
    }
    return path.reverse();
  }
}
