import {
  BOARD_LABELS,
  NUMBER_ANCHORS,
} from "../../../shared/constants/board-art.ts";
import type { Rect } from "../types.ts";

export function numberLayout(cell: number) {
  const anchor = NUMBER_ANCHORS[cell] ?? { x: 12, y: 43 };
  return { ...anchor, fontSize: anchor.fontSize ?? (cell === 30 ? 43 : 44) };
}

export function labelLayout(cell: number) {
  const label = BOARD_LABELS[cell];
  return label
    ? {
        ...label,
        x: label.x ?? 8,
        y: label.y ?? 84,
        width: label.width,
        height: label.height ?? 27,
        fontSize: label.fontSize ?? 10.5,
      }
    : null;
}

export function rectGap(a: Rect, b: Rect) {
  return Math.hypot(
    Math.max(a.x - b.x - b.width, b.x - a.x - a.width, 0),
    Math.max(a.y - b.y - b.height, b.y - a.y - a.height, 0),
  );
}

export function numberBounds(cell: number): Rect {
  const n = numberLayout(cell);
  // Conservative Nunito ink bounds, including the outline, for token placement.
  return {
    x: n.x + 1,
    y: n.y - n.fontSize * 0.8 - 2,
    width: n.fontSize * (cell >= 10 ? 1.36 : 0.7),
    height: n.fontSize * 0.8 + 4,
  };
}

type Piece = Rect;
const pieceCache = new Map<string, Piece[]>();

export function pieceLayout(cell: number, count: number): Piece[] {
  const key = `${cell}:${count}`,
    cached = pieceCache.get(key);
  if (cached) return cached;
  const label = labelLayout(cell);
  const forbidden: Rect[] = [numberBounds(cell), ...(label ? [label] : [])];
  if (cell === 1) forbidden.push({ x: 89, y: 10, width: 23, height: 30 });
  if (cell === 30) forbidden.push({ x: 72, y: 0, width: 40, height: 46 });
  // Prefer the familiar single row; compact grids are only used in crowded cells.
  for (let height = 38; height >= 18; height -= 2) {
    let best: { score: number; pieces: Piece[] } | undefined;
    const width = (height * 30) / 38;
    for (const columns of [...new Set([count, Math.ceil(count / 2), 2])].filter(
      (n) => n <= count,
    )) {
      const rows = Math.ceil(count / columns),
        step = width * (count > 4 || rows > 1 ? 0.57 : 0.8),
        totalWidth = width + (columns - 1) * step;
      const totalHeight = rows * height + (rows - 1) * 2;
      if (totalWidth > 104 || totalHeight > 104) continue;
      for (let y = 8; y + totalHeight <= 112; y += 2)
        for (let x = 8; x + totalWidth <= 112; x += 2) {
          const pieces = Array.from({ length: count }, (_, i) => ({
            x: x + (i % columns) * step,
            y: y + Math.floor(i / columns) * (height + 2),
            width,
            height,
          }));
          if (
            pieces.some((piece) =>
              forbidden.some((rect) => rectGap(piece, rect) < 6),
            )
          )
            continue;
          const score =
            (x + totalWidth / 2 - 60) ** 2 +
            (y + totalHeight / 2 - 65) ** 2 +
            (rows - 1) * 200;
          if (!best || score < best.score) best = { score, pieces };
        }
    }
    if (best) {
      pieceCache.set(key, best.pieces);
      return best.pieces;
    }
  }
  throw new Error(`No safe token layout for cell ${cell}, ${count} teams`);
}
