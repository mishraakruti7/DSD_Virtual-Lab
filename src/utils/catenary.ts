/**
 * Generates an SVG path string for a natural sagging jumper wire between two coordinates (x1, y1) and (x2, y2).
 * Uses a quadratic or cubic Bezier curve that droops downward with gravity.
 */
export function getCatenaryPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sagFactor: number = 0.35
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.hypot(dx, dy);

  // Sag amount proportional to distance with minimum droop
  const sag = Math.max(15, distance * sagFactor);

  // Control points for cubic bezier to give natural wire flexibility
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + sag;

  const cp1x = x1 + dx * 0.25;
  const cp1y = y1 + dy * 0.25 + sag * 0.7;

  const cp2x = x1 + dx * 0.75;
  const cp2y = y1 + dy * 0.75 + sag * 0.7;

  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
}
