/**
 * @file Searching.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 3: Searching and Hashing (CO3)
 * @section 3.1: Searching Techniques (Linear Search and Binary Search)
 *
 * @description
 * Implementation of Binary Search and Linear Search with asymptotic performance analysis.
 * Illustrates the fundamental prerequisite: Binary search requires sorted data (O(N log N) pre-sort),
 * enabling O(log N) fast lookups, while Linear search operates directly on unsorted data in O(N).
 *
 * @applications_in_project
 * 1. Quick Search / Command Palette (`CommandPalette.tsx`):
 *    - Sorted catalog allows `binarySearchPrefix` to locate matching module/lab/IC titles in O(log N) time.
 *    - Unindexed substrings and fuzzy keywords fall back to `linearSearch` in O(N) time.
 * 2. IC Catalog Part Number Lookup:
 *    - Fast binary search jump for exact IC numbers (7408, 7432, 7404, 7476, 7490, 74194).
 *
 * @complexity_analysis
 * Linear Search:
 * - Best Case:    O(1) (target found at index 0)
 * - Average Case: O(N / 2) = O(N)
 * - Worst Case:   O(N) (target at end or absent)
 * - Space:        O(1)
 *
 * Binary Search:
 * - Best Case:    O(1) (target at middle index)
 * - Average Case: O(log N)
 * - Worst Case:   O(log N)
 * - Space:        O(1) (iterative implementation)
 */

export interface SearchResult<T> {
  item?: T;
  index: number;
  found: boolean;
  comparisonsCount: number;
}

export class Searching {
  /**
   * Classic Iterative Binary Search on a pre-sorted array.
   * Halves the active search window at each comparison step.
   * Time Complexity: O(log N)
   * Space Complexity: O(1)
   */
  public static binarySearch<T, K>(
    sortedArray: T[],
    target: K,
    keyExtractor: (item: T) => K,
    comparator?: (a: K, b: K) => number
  ): SearchResult<T> {
    const cmp =
      comparator ||
      ((a: K, b: K) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });

    let low = 0;
    let high = sortedArray.length - 1;
    let comparisons = 0;

    while (low <= high) {
      comparisons++;
      const mid = Math.floor((low + high) / 2);
      const midVal = keyExtractor(sortedArray[mid]);
      const comparison = cmp(midVal, target);

      if (comparison === 0) {
        return {
          item: sortedArray[mid],
          index: mid,
          found: true,
          comparisonsCount: comparisons,
        };
      } else if (comparison < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return {
      index: -1,
      found: false,
      comparisonsCount: comparisons,
    };
  }

  /**
   * Binary Search range finder for prefix matches in an alphabetically sorted array.
   * Locates the first occurrence in O(log N) and collects matching prefix range.
   * Time Complexity: O(log N + M) where M is match count
   */
  public static binarySearchPrefix<T>(
    sortedArray: T[],
    prefix: string,
    keyExtractor: (item: T) => string
  ): T[] {
    const p = prefix.toLowerCase();
    if (!p) return [];

    let low = 0;
    let high = sortedArray.length - 1;
    let firstIndex = -1;

    // Binary search for first element starting with prefix
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const key = keyExtractor(sortedArray[mid]).toLowerCase();

      if (key.startsWith(p)) {
        firstIndex = mid;
        high = mid - 1; // Keep searching left for first boundary
      } else if (key < p) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (firstIndex === -1) return [];

    // Collect all contiguous matching elements
    const matches: T[] = [];
    let idx = firstIndex;
    while (
      idx < sortedArray.length &&
      keyExtractor(sortedArray[idx]).toLowerCase().startsWith(p)
    ) {
      matches.push(sortedArray[idx]);
      idx++;
    }

    return matches;
  }

  /**
   * Linear Search scanning elements sequentially.
   * Does not require sorted data.
   * Time Complexity: O(N)
   * Space Complexity: O(1)
   */
  public static linearSearch<T>(
    array: T[],
    predicate: (item: T) => boolean
  ): { items: T[]; comparisonsCount: number } {
    const items: T[] = [];
    let comparisons = 0;

    for (let i = 0; i < array.length; i++) {
      comparisons++;
      if (predicate(array[i])) {
        items.push(array[i]);
      }
    }

    return { items, comparisonsCount: comparisons };
  }

  /**
   * Linear Substring Search across multiple text attributes.
   * Time Complexity: O(N)
   */
  public static linearSearchSubstring<T>(
    array: T[],
    query: string,
    keyExtractor: (item: T) => string
  ): T[] {
    const q = query.toLowerCase();
    return array.filter((item) => keyExtractor(item).toLowerCase().includes(q));
  }
}
