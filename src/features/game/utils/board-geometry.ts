import { LADDER_ART, SNAKE_ART } from "../../../shared/constants/board-art.ts";
import type { Curve, Point } from "../types.ts";
import { cellPoint } from "./game-logic.ts";

const p = (x: number, y: number): Point => ({ x, y });

export function curvePoint([a, b, c, d]: Curve, t: number): Point {
  const u = 1 - t;
  return {
    x:
      u ** 3 * a.x + 3 * u ** 2 * t * b.x + 3 * u * t ** 2 * c.x + t ** 3 * d.x,
    y:
      u ** 3 * a.y + 3 * u ** 2 * t * b.y + 3 * u * t ** 2 * c.y + t ** 3 * d.y,
  };
}

export function snakePoint(cell: number, progress: number): Point {
  const curves = SNAKE_ART[cell].curves;
  const value = Math.max(0, Math.min(1, progress)) * curves.length;
  const index = Math.min(curves.length - 1, Math.floor(value));
  return curvePoint(curves[index], value - index);
}

export const snakePath = (cell: number) =>
  SNAKE_ART[cell].curves
    .map(
      ([a, b, c, d], i) =>
        `${i === 0 ? `M${a.x},${a.y}` : ""}C${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`,
    )
    .join(" ");

// A filled ribbon, rather than a constant-width stroke, gives each snake a real pointed tail.
export function snakeRibbon(cell: number) {
  const left: Point[] = [],
    right: Point[] = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120,
      at = snakePoint(cell, t);
    const before = snakePoint(cell, Math.max(0, t - 0.002)),
      after = snakePoint(cell, Math.min(1, t + 0.002));
    const angle = Math.atan2(after.y - before.y, after.x - before.x);
    const radius = 8.5 * Math.min(1, (1 - t) / 0.16);
    left.push(
      p(at.x - Math.sin(angle) * radius, at.y + Math.cos(angle) * radius),
    );
    right.push(
      p(at.x + Math.sin(angle) * radius, at.y - Math.cos(angle) * radius),
    );
  }
  return (
    [...left, ...right.reverse()]
      .map(
        (point, i) =>
          `${i ? "L" : "M"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
      )
      .join(" ") + "Z"
  );
}

export function connectionPoint(cell: number, t: number): Point {
  const ladder = LADDER_ART[cell];
  if (ladder)
    return p(
      ladder.from.x + (ladder.to.x - ladder.from.x) * t,
      ladder.from.y + (ladder.to.y - ladder.from.y) * t,
    );
  if (SNAKE_ART[cell]) return snakePoint(cell, t);
  return cellPoint(cell);
}
