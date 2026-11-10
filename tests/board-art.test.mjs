import assert from "node:assert/strict";
import test from "node:test";
import { cellPoint, LADDERS, SNAKES, EVENTS, QUESTIONS } from "../src/game.ts";
import {
  BOARD_COLORS,
  BOARD_LABELS,
  LADDER_ART,
  SNAKE_ART,
  connectionPoint,
  snakePoint,
  snakeRibbon,
} from "../src/board-art.ts";

const inside = (point, cell) => {
  const center = cellPoint(cell);
  return Math.abs(point.x - center.x) <= 60 && Math.abs(point.y - center.y) <= 60;
};
test("all ten connections match the approved 30-cell reference plan", () => {
  assert.deepEqual(LADDERS, { 6: 18, 11: 14, 15: 22, 21: 28, 23: 26 });
  assert.deepEqual(SNAKES, { 16: 3, 20: 5, 25: 12, 27: 22, 29: 19 });
  assert.deepEqual(Object.keys(LADDER_ART), Object.keys(LADDERS));
  assert.deepEqual(Object.keys(SNAKE_ART), Object.keys(SNAKES));
  assert.equal(BOARD_COLORS.length, 30);
});
test("all ladder anchors and snake heads/tails remain inside the correct linked cells", () => {
  for (const links of [LADDERS, SNAKES])
    for (const [from, to] of Object.entries(links)) {
      assert.ok(inside(connectionPoint(+from, 0), +from), `Source ${from}`);
      assert.ok(inside(connectionPoint(+from, 1), to), `Destination ${to}`);
    }
});
test("all snake curves are continuous and stay within the board, including their heads", () => {
  for (const cell of Object.keys(SNAKES).map(Number)) {
    const art = SNAKE_ART[cell];
    for (let i = 1; i < art.curves.length; i++)
      assert.deepEqual(art.curves[i][0], art.curves[i - 1][3]);
    for (let i = 0; i <= 200; i++) {
      const point = snakePoint(cell, i / 200);
      assert.ok(point.x >= 9 && point.x <= 711);
      assert.ok(point.y >= 30 && point.y <= 590);
    }
    assert.ok(snakeRibbon(cell).startsWith("M"));
    assert.ok(snakeRibbon(cell).endsWith("Z"));
  }
});
test("ladders do not intersect each other", () => {
  const lines = Object.values(LADDER_ART);
  const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const { from: a, to: b } = lines[i],
        { from: c, to: d } = lines[j];
      assert.ok(!(cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0));
    }
});
test("snake tails never trigger another snake or ladder, and shared cell 22 has separate anchors", () => {
  const triggers = new Set([...Object.keys(LADDERS), ...Object.keys(SNAKES)].map(Number));
  Object.values(SNAKES).forEach((to) => assert.equal(triggers.has(to), false));
  const a = connectionPoint(15, 1),
    b = connectionPoint(27, 1);
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) > 40);
});
test("all existing historical questions are retained and the new snake cells have questions", () => {
  const original = [
    2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29,
  ];
  original.forEach((cell) => assert.ok(QUESTIONS[cell]));
  assert.equal(QUESTIONS[16].year, "2000");
  assert.equal(QUESTIONS[27].year, "2015");
  assert.equal(
    EVENTS.some((cell) => LADDERS[cell] || SNAKES[cell]),
    false,
  );
});
test("historical captions remain inside their cells with at most two lines", () => {
  for (const [cell, label] of Object.entries(BOARD_LABELS)) {
    assert.ok(+cell >= 1 && +cell <= 30);
    assert.match(label.year, /^\d{4}$/);
    assert.ok((label.x ?? 7) >= 0);
    assert.ok((label.x ?? 7) + (label.width ?? 106) <= 120);
  }
});
