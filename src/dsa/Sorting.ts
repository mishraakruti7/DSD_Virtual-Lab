/**
 * @file Sorting.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 4: Algorithm Analysis and Efficiency (CO4)
 * @section 4.2: Sorting Techniques (Insertion, Merge, Quick Sort) & Internal vs. External Sorting
 *
 * @description
 * Implementation of named sorting algorithms demonstrating algorithmic trade-offs:
 * 1. Insertion Sort: Best for small (N <= 20) or nearly sorted datasets; O(N) best case, O(1) space.
 * 2. Merge Sort: Guaranteed O(N log N) divide-and-conquer, stable sort; O(N) auxiliary space.
 * 3. Quick Sort: Fast in-place divide-and-conquer with pivot partitioning; O(N log N) average, O(log N) stack space.
 *
 * @internal_vs_external_sorting
 * - Internal Sorting: All data resides entirely in primary memory (RAM) during execution.
 *   All sorting in this virtual lab is internal because datasets (<= 1,000 items) fit comfortably in RAM.
 * - External Sorting: Applied when datasets exceed available primary memory (e.g., multi-gigabyte log
 *   files or simulation waveforms), requiring secondary storage (disk) with multi-way merge passes.
 *
 * @complexity_summary
 * | Algorithm      | Best Case     | Average Case  | Worst Case    | Space Complexity | Stability |
 * |----------------|---------------|---------------|---------------|------------------|-----------|
 * | Insertion Sort | O(N)          | O(N^2)        | O(N^2)        | O(1) (in-place)  | Stable    |
 * | Merge Sort     | O(N log N)    | O(N log N)    | O(N log N)    | O(N)             | Stable    |
 * | Quick Sort     | O(N log N)    | O(N log N)    | O(N^2)        | O(log N) stack   | Unstable  |
 */

export type Comparator<T> = (a: T, b: T) => number;

const defaultComparator = <T>(a: T, b: T): number => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

export class Sorting {
  /**
   * Insertion Sort: Iteratively inserts the next element into its proper sorted position.
   * Ideal for small arrays or nearly sorted data.
   * Time Complexity: Best O(N), Average O(N^2), Worst O(N^2)
   * Space Complexity: O(1) (in-place)
   */
  public static insertionSort<T>(array: T[], comparator: Comparator<T> = defaultComparator): T[] {
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      while (j >= 0 && comparator(arr[j], key) > 0) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
    }

    return arr;
  }

  /**
   * Merge Sort: Classic divide-and-conquer recursive sort.
   * Guarantees O(N log N) time regardless of initial ordering and preserves relative order (stable).
   * Time Complexity: O(N log N) in all cases
   * Space Complexity: O(N)
   */
  public static mergeSort<T>(array: T[], comparator: Comparator<T> = defaultComparator): T[] {
    if (array.length <= 1) return [...array];

    const mid = Math.floor(array.length / 2);
    const left = this.mergeSort(array.slice(0, mid), comparator);
    const right = this.mergeSort(array.slice(mid), comparator);

    return this.merge(left, right, comparator);
  }

  private static merge<T>(left: T[], right: T[], comparator: Comparator<T>): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      if (comparator(left[i], right[j]) <= 0) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    while (i < left.length) {
      result.push(left[i]);
      i++;
    }
    while (j < right.length) {
      result.push(right[j]);
      j++;
    }

    return result;
  }

  /**
   * Quick Sort: In-place divide-and-conquer partitioning around a pivot.
   * Uses median-of-three pivot selection to defend against sorted worst-case degradation.
   * Time Complexity: Best/Average O(N log N), Worst O(N^2)
   * Space Complexity: O(log N) recursive call stack
   */
  public static quickSort<T>(array: T[], comparator: Comparator<T> = defaultComparator): T[] {
    const arr = [...array];
    this.quickSortHelper(arr, 0, arr.length - 1, comparator);
    return arr;
  }

  private static quickSortHelper<T>(
    arr: T[],
    low: number,
    high: number,
    comparator: Comparator<T>
  ): void {
    if (low < high) {
      if (high - low < 7) {
        // Hybrid optimization: Insertion sort for small subproblems (standard DSA practice)
        for (let i = low + 1; i <= high; i++) {
          const key = arr[i];
          let j = i - 1;
          while (j >= low && comparator(arr[j], key) > 0) {
            arr[j + 1] = arr[j];
            j--;
          }
          arr[j + 1] = key;
        }
        return;
      }

      const pivotIndex = this.partition(arr, low, high, comparator);
      this.quickSortHelper(arr, low, pivotIndex - 1, comparator);
      this.quickSortHelper(arr, pivotIndex + 1, high, comparator);
    }
  }

  private static partition<T>(
    arr: T[],
    low: number,
    high: number,
    comparator: Comparator<T>
  ): number {
    // Median/middle pivot selection to avoid worst-case on presorted input
    const mid = Math.floor((low + high) / 2);
    this.swap(arr, mid, high);
    const pivot = arr[high];

    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (comparator(arr[j], pivot) <= 0) {
        i++;
        this.swap(arr, i, j);
      }
    }
    this.swap(arr, i + 1, high);
    return i + 1;
  }

  private static swap<T>(arr: T[], i: number, j: number): void {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
