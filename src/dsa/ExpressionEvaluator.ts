/**
 * @file ExpressionEvaluator.ts
 * @course ECCOR2PC204 - Data Structures and Algorithms
 * @module Module 1: Linear DS (CO1) & Module 2: Non-Linear DS (CO2)
 * @section 1.3: Stack Applications (Infix to Postfix, Postfix Evaluation) & 2.2: Expression Trees
 *
 * @description
 * Full stack-based Boolean logic expression parser and evaluator.
 * Implements:
 * 1. Dijkstra's Shunting-Yard algorithm using `Stack<string>` to convert infix formulas to postfix (Reverse Polish Notation).
 * 2. Stack-based postfix evaluation using `Stack<boolean>`.
 * 3. Binary Expression Tree construction from postfix and evaluation via Post-Order Traversal.
 *
 * @applications_in_project
 * 1. Evaluates combinational logic formulas, PLA/PAL sum-of-products fuse terms,
 *    and student-entered Boolean equations without unsafe `eval()`.
 * 2. Cross-over demonstration between DSD Module 1/2 (Boolean algebra, SOP/POS) and DSA CO1/CO2.
 *
 * @complexity_analysis
 * - Infix to Postfix (Shunting-Yard): O(N) time, O(N) stack space
 * - Postfix Evaluation:             O(N) time, O(N) stack space
 * - Expression Tree Build:          O(N) time, O(N) space
 * - Expression Tree Evaluation:     O(N) time (post-order traversal)
 */

import { Stack } from './Stack';

export interface BooleanContext {
  [variableName: string]: boolean;
}

export class ExpressionTreeNode {
  public value: string;
  public left: ExpressionTreeNode | null = null;
  public right: ExpressionTreeNode | null = null;

  constructor(value: string) {
    this.value = value;
  }

  public isOperator(): boolean {
    return ['&', '|', '^', '!', '+', '*', '~'].includes(this.value);
  }
}

export class ExpressionEvaluator {
  private static readonly PRECEDENCE: Record<string, number> = {
    '!': 3,
    '~': 3,
    '&': 2,
    '*': 2,
    '^': 1,
    '|': 1,
    '+': 1,
  };

  /**
   * Tokenizes an infix Boolean expression into variables, operators, and parentheses.
   * Supports symbols: &, |, ^, !, +, *, ~, (, )
   * Example: "A & (B | !C)" -> ["A", "&", "(", "B", "|", "!", "C", ")"]
   * Time Complexity: O(N)
   */
  public static tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const clean = expr.trim();

    while (i < clean.length) {
      const char = clean[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (['(', ')', '&', '|', '^', '!', '+', '*', '~'].includes(char)) {
        tokens.push(char);
        i++;
      } else if (/[a-zA-Z0-9_]/.test(char)) {
        let identifier = '';
        while (i < clean.length && /[a-zA-Z0-9_]/.test(clean[i])) {
          identifier += clean[i];
          i++;
        }
        tokens.push(identifier);
      } else {
        i++;
      }
    }

    return tokens;
  }

  /**
   * Converts an Infix Boolean expression to Postfix (RPN) using Dijkstra's Shunting-Yard Algorithm.
   * Utilizes an explicit Stack<string> for operator precedence resolution.
   * Time Complexity: O(N)
   * Space Complexity: O(N)
   */
  public static infixToPostfix(infixExpr: string): string[] {
    const tokens = this.tokenize(infixExpr);
    const output: string[] = [];
    const operatorStack = new Stack<string>();

    for (const token of tokens) {
      if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (!operatorStack.isEmpty() && operatorStack.peek() !== '(') {
          output.push(operatorStack.pop()!);
        }
        operatorStack.pop(); // Discard '('
      } else if (this.isOperator(token)) {
        const currPrecedence = this.PRECEDENCE[token] || 0;
        while (
          !operatorStack.isEmpty() &&
          operatorStack.peek() !== '(' &&
          (this.PRECEDENCE[operatorStack.peek()!] || 0) >= currPrecedence
        ) {
          output.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else {
        // Operand (variable or constant 0 / 1)
        output.push(token);
      }
    }

    while (!operatorStack.isEmpty()) {
      output.push(operatorStack.pop()!);
    }

    return output;
  }

  /**
   * Evaluates a Postfix Boolean token list against a dictionary of variable values.
   * Uses an explicit Stack<boolean> to evaluate operands and operators.
   * Time Complexity: O(N)
   */
  public static evaluatePostfix(postfixTokens: string[], context: BooleanContext): boolean {
    const evalStack = new Stack<boolean>();

    for (const token of postfixTokens) {
      if (token === '!' || token === '~') {
        const val = evalStack.pop() ?? false;
        evalStack.push(!val);
      } else if (['&', '*', '|', '+', '^'].includes(token)) {
        const b = evalStack.pop() ?? false;
        const a = evalStack.pop() ?? false;

        if (token === '&' || token === '*') {
          evalStack.push(a && b);
        } else if (token === '|' || token === '+') {
          evalStack.push(a || b);
        } else if (token === '^') {
          evalStack.push((a && !b) || (!a && b));
        }
      } else {
        // Literal or variable
        if (token === '1' || token.toLowerCase() === 'true') {
          evalStack.push(true);
        } else if (token === '0' || token.toLowerCase() === 'false') {
          evalStack.push(false);
        } else {
          evalStack.push(Boolean(context[token]));
        }
      }
    }

    return evalStack.pop() ?? false;
  }

  /**
   * Builds an Expression Tree from postfix tokens.
   * Leaves are operands, interior nodes are logic operators.
   * Time Complexity: O(N)
   */
  public static buildExpressionTree(postfixTokens: string[]): ExpressionTreeNode | null {
    const nodeStack = new Stack<ExpressionTreeNode>();

    for (const token of postfixTokens) {
      const node = new ExpressionTreeNode(token);
      if (token === '!' || token === '~') {
        node.left = nodeStack.pop() || null;
      } else if (['&', '*', '|', '+', '^'].includes(token)) {
        node.right = nodeStack.pop() || null;
        node.left = nodeStack.pop() || null;
      }
      nodeStack.push(node);
    }

    return nodeStack.pop() || null;
  }

  /**
   * Evaluates a Binary Expression Tree using Post-Order Traversal (Left, Right, Root).
   * Time Complexity: O(N)
   */
  public static evaluateTree(node: ExpressionTreeNode | null, context: BooleanContext): boolean {
    if (!node) return false;

    // Leaf node: variable or literal
    if (!node.left && !node.right) {
      if (node.value === '1' || node.value.toLowerCase() === 'true') return true;
      if (node.value === '0' || node.value.toLowerCase() === 'false') return false;
      return Boolean(context[node.value]);
    }

    // Unary operator
    if (node.value === '!' || node.value === '~') {
      return !this.evaluateTree(node.left, context);
    }

    // Binary operators
    const leftVal = this.evaluateTree(node.left, context);
    const rightVal = this.evaluateTree(node.right, context);

    if (node.value === '&' || node.value === '*') return leftVal && rightVal;
    if (node.value === '|' || node.value === '+') return leftVal || rightVal;
    if (node.value === '^') return (leftVal && !rightVal) || (!leftVal && rightVal);

    return false;
  }

  /**
   * Convenience end-to-end evaluator: parses infix and evaluates.
   */
  public static evaluate(infixExpr: string, context: BooleanContext): boolean {
    const postfix = this.infixToPostfix(infixExpr);
    return this.evaluatePostfix(postfix, context);
  }

  private static isOperator(token: string): boolean {
    return ['&', '|', '^', '!', '+', '*', '~'].includes(token);
  }
}
