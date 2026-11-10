import assert from "node:assert/strict";
import test from "node:test";
import { BOARD_LABELS, NUMBER_ANCHORS } from "../src/board-art.ts";
import {
  labelLayout,
  numberBounds,
  numberLayout,
  pieceLayout,
  rectGap,
} from "../src/board-layout.ts";

test("all 30 numbers have independent in-cell positions and readable sizes", () => {
  assert.equal(Object.keys(NUMBER_ANCHORS).length, 30);
  for (let cell = 1; cell <= 30; cell++) {
    const layout = numberLayout(cell),
      bounds = numberBounds(cell);
    assert.ok(layout.fontSize >= 32 && layout.fontSize <= 44);
    assert.ok(bounds.x >= 0 && bounds.y >= 0);
    assert.ok(bounds.x + bounds.width <= 120);
    assert.ok(bounds.y + bounds.height <= 120);
  }
});
test("year chips are large, year-only and placed independently", () => {
  for (const cell of Object.keys(BOARD_LABELS).map(Number)) {
    const layout = labelLayout(cell);
    assert.ok(layout.x >= 6 && layout.y >= 6);
    assert.ok(layout.x + layout.width <= 114);
    assert.ok(layout.y + layout.height <= 114);
    assert.ok(layout.fontSize >= 16);
    assert.match(layout.year, /^\d{4}$/);
    assert.ok(rectGap(numberBounds(cell), layout) >= 6);
  }
  assert.equal(labelLayout(2), null);
  assert.ok(numberLayout(13).y > 43);
  assert.ok(numberLayout(19).y > 44);
});
test("all 180 cell/team-count combinations keep tokens clear of numbers and captions", () => {
  for (let cell = 1; cell <= 30; cell++)
    for (let count = 1; count <= 6; count++) {
      const placements = pieceLayout(cell, count),
        caption = labelLayout(cell);
      assert.equal(placements.length, count);
      for (const placement of placements) {
        assert.ok(placement.x >= 8 && placement.y >= 8);
        assert.ok(placement.x + placement.width <= 112.001);
        assert.ok(placement.y + placement.height <= 112.001);
        assert.ok(placement.height >= 18);
        assert.ok(rectGap(placement, numberBounds(cell)) >= 6, `Number ${cell}, ${count} teams`);
        if (caption) assert.ok(rectGap(placement, caption) >= 6, `Caption ${cell}, ${count} teams`);
      }
    }
});
test("start and finish tokens also avoid the flag and trophy", () => {
  const icons = {
    1: { x: 89, y: 10, width: 23, height: 30 },
    30: { x: 72, y: 0, width: 40, height: 46 },
  };
  for (const [cell, icon] of Object.entries(icons))
    for (let count = 1; count <= 6; count++) {
      for (const piece of pieceLayout(+cell, count)) assert.ok(rectGap(piece, icon) >= 6);
    }
});
test("cell 28 shows its number above its year", () => {
  assert.ok(numberLayout(28).y < labelLayout(28).y);
  assert.ok(rectGap(numberBounds(28), labelLayout(28)) >= 8);
});
