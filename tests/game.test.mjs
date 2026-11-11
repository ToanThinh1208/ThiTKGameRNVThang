import assert from "node:assert/strict";
import test from "node:test";
import { EVENTS, LADDERS, QUESTIONS, SNAKES } from "../src/shared/constants/game-data.ts";
import {
  advanceTurn,
  cellPoint,
  getRaceWinner,
  landingPosition,
  makeTeams,
  rankTeams,
  resolveAnswer,
} from "../src/features/game/utils/game-logic.ts";

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
test("all 27 question cells have three answers, one correct index and explanations", () => {
  const cells = [...Object.keys(LADDERS), ...Object.keys(SNAKES), ...EVENTS];
  assert.equal(cells.length, 27);
  assert.equal(new Set(cells.map(Number)).size, 27);
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
    [4, 3, 5, 2],
  );
  assert.deepEqual(
    teams.map((t) => t.id),
    [2, 3, 4, 5],
  );
});
test("turns advance in order with an unlimited round counter", () => {
  const teams = makeTeams(4);
  assert.deepEqual(advanceTurn(teams, 0, 1), { turn: 1, round: 1, ended: false });
  assert.deepEqual(advanceTurn(teams, 3, 1), { turn: 0, round: 2, ended: false });
  assert.deepEqual(advanceTurn(teams, 3, 10000), { turn: 0, round: 10001, ended: false });
  assert.equal(getRaceWinner(teams), undefined);
});
test("the first finish ends the race immediately, even in the middle of a round", () => {
  const teams = makeTeams(6);
  teams[1].position = 30;
  teams[1].finished = true;
  assert.deepEqual(advanceTurn(teams, 1, 3), { turn: 1, round: 3, ended: true });
  assert.equal(getRaceWinner(teams).id, 3);
  assert.equal(teams.filter((t) => t.finished).length, 1);
  teams[1].finished = false;
  assert.equal(advanceTurn(teams, 1, 3).ended, true);
});
test("the finisher wins even when another group has a higher score", () => {
  const teams = makeTeams(3);
  teams[0] = { ...teams[0], position: 30, finished: true, score: 170 };
  teams[1] = { ...teams[1], position: 29, score: 360 };
  teams[2] = { ...teams[2], position: 28, score: 400 };
  assert.equal(getRaceWinner(teams).id, 2);
  assert.deepEqual(
    rankTeams(teams).map((t) => t.id),
    [2, 4, 3],
  );
});
test("exact and overshooting dice rolls both land on the finish", () => {
  assert.equal(landingPosition(28, 2), 30);
  assert.equal(landingPosition(28, 6), 30);
  assert.equal(landingPosition(29, 1), 30);
  assert.equal(landingPosition(24, 5), 29);
});
