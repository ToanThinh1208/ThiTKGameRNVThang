import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceTurn,
  cellPoint,
  EVENTS,
  LADDERS,
  SNAKES,
  QUESTIONS,
  makeTeams,
  rankTeams,
  resolveAnswer,
} from "../src/game.ts";

test("board has 30 unique square positions in the prescribed zigzag order", () => {
  assert.deepEqual(cellPoint(1), { x: 60, y: 540 });
  assert.deepEqual(cellPoint(6), { x: 660, y: 540 });
  assert.deepEqual(cellPoint(7), { x: 660, y: 420 });
  assert.deepEqual(cellPoint(12), { x: 60, y: 420 });
  assert.deepEqual(cellPoint(30), { x: 660, y: 60 });
  assert.equal(
    new Set(Array.from({ length: 30 }, (_, i) => JSON.stringify(cellPoint(i + 1)))).size,
    30,
  );
});
test("all 25 question cells have three answers, one correct index and explanations", () => {
  const cells = [...Object.keys(LADDERS), ...Object.keys(SNAKES), ...EVENTS];
  assert.equal(cells.length, 25);
  for (const cell of cells) {
    const question = QUESTIONS[cell];
    assert.ok(question, `Missing question for cell ${cell}`);
    assert.equal(question.answers.length, 3);
    assert.ok(question.correct >= 0 && question.correct < 3);
    assert.ok(question.explanation.length > 20);
  }
});
test("correct ladder answers award 100 and move up; incorrect answers deduct 20", () => {
  for (const [cell, destination] of Object.entries(LADDERS)) {
    assert.equal(resolveAnswer(+cell, true).destination, destination);
    assert.equal(resolveAnswer(+cell, true).points, 100);
    assert.equal(resolveAnswer(+cell, false).destination, +cell);
    assert.equal(resolveAnswer(+cell, false).points, -20);
  }
});
test("correct snake answers award 80 and stay; incorrect answers deduct 40 and move down", () => {
  for (const [cell, destination] of Object.entries(SNAKES)) {
    assert.equal(resolveAnswer(+cell, true).destination, +cell);
    assert.equal(resolveAnswer(+cell, true).points, 80);
    assert.equal(resolveAnswer(+cell, false).destination, destination);
    assert.equal(resolveAnswer(+cell, false).points, -40);
  }
});
test("event answers award 80 or deduct 20 without changing position", () => {
  for (const cell of EVENTS) {
    assert.equal(resolveAnswer(cell, true).destination, cell);
    assert.equal(resolveAnswer(cell, false).destination, cell);
    assert.equal(resolveAnswer(cell, true).points, 80);
    assert.equal(resolveAnswer(cell, false).points, -20);
  }
});
test("ranking uses score first then position, accepts negative scores and does not mutate teams", () => {
  const teams = makeTeams(4);
  teams[0].score = -40;
  teams[1].score = 80;
  teams[2].score = 80;
  teams[2].position = 20;
  assert.deepEqual(
    rankTeams(teams).map((t) => t.id),
    [3, 2, 4, 1],
  );
  assert.deepEqual(
    teams.map((t) => t.id),
    [1, 2, 3, 4],
  );
});
test("turns advance in order, increment rounds and skip finished teams", () => {
  const teams = makeTeams(4);
  assert.deepEqual(advanceTurn(teams, 0, 1, 10), { turn: 1, round: 1, ended: false });
  assert.deepEqual(advanceTurn(teams, 3, 1, 10), { turn: 0, round: 2, ended: false });
  teams[0].finished = true;
  teams[1].finished = true;
  assert.deepEqual(advanceTurn(teams, 3, 1, 10), { turn: 2, round: 2, ended: false });
});
test("games end after the configured rounds or all teams finish", () => {
  const teams = makeTeams(2);
  assert.equal(advanceTurn(teams, 1, 6, 6).ended, true);
  assert.equal(advanceTurn(teams, 0, 6, 6).ended, false);
  teams.forEach((t) => {
    t.finished = true;
  });
  assert.equal(advanceTurn(teams, 0, 1, 18).ended, true);
});
