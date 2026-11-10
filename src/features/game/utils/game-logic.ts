import { LADDERS, SNAKES } from "../../../shared/constants/game-data.ts";
import type { Team } from "../types.ts";

export const makeTeams = (count: number): Team[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    position: 1,
    score: 0,
    finished: false,
  }));

const hasFinished = (team: Team) => team.finished || team.position >= 30;

export const getRaceWinner = (teams: Team[]) => teams.find(hasFinished);

export const landingPosition = (position: number, die: number) =>
  Math.min(30, position + die);

export const rankTeams = (teams: Team[]) =>
  [...teams].sort(
    (a, b) =>
      Number(hasFinished(b)) - Number(hasFinished(a)) ||
      b.score - a.score ||
      b.position - a.position ||
      a.id - b.id,
  );

export function advanceTurn(teams: Team[], turn: number, round: number) {
  if (getRaceWinner(teams)) return { turn, round, ended: true };
  const next = (turn + 1) % teams.length;
  return { turn: next, round: round + (next === 0 ? 1 : 0), ended: false };
}

export const cellPoint = (n: number) => {
  const row = Math.floor((n - 1) / 6);
  const col = row % 2 ? 5 - ((n - 1) % 6) : (n - 1) % 6;
  return { x: col * 120 + 60, y: (4 - row) * 120 + 60 };
};

export function resolveAnswer(position: number, correct: boolean) {
  const ladder = !!LADDERS[position],
    snake = !!SNAKES[position];
  return {
    points: correct ? (ladder ? 100 : 80) : snake ? -40 : -20,
    destination:
      correct && ladder
        ? LADDERS[position]
        : !correct && snake
          ? SNAKES[position]
          : position,
    message: correct
      ? ladder
        ? "Leo thang!"
        : snake
          ? "Né được rắn!"
          : "Chính xác!"
      : snake
        ? "Bị rắn cắn!"
        : "Thêm một bài học!",
  };
}
