import {
  COLORS,
  LADDERS,
  QUESTION_BANK,
  SNAKES,
} from "../../../shared/constants/game-data.ts";
import type { Question, QuestionDeckState, Team } from "../types.ts";

export const FIRST_TEAM_ID = 2;

export const teamColor = (teamId: number) =>
  COLORS[teamId - FIRST_TEAM_ID] ?? COLORS[0];

export const makeTeams = (count: number): Team[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + FIRST_TEAM_ID,
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

export function shuffleIndices(
  length: number,
  rng: () => number = Math.random,
): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function createQuestionDecks(
  rng: () => number = Math.random,
): QuestionDeckState {
  return Object.fromEntries(
    Object.entries(QUESTION_BANK).map(([cell, list]) => [
      Number(cell),
      { order: shuffleIndices(list.length, rng), cursor: 0 },
    ]),
  );
}

export function drawCellQuestion(
  decks: QuestionDeckState,
  cell: number,
  rng: () => number = Math.random,
): { question: Question; questionIndex: number; nextDecks: QuestionDeckState } {
  const pool = QUESTION_BANK[cell];
  const current = decks[cell] ?? {
    order: shuffleIndices(pool.length, rng),
    cursor: 0,
  };

  if (current.cursor < current.order.length) {
    const questionIndex = current.order[current.cursor];
    return {
      question: pool[questionIndex],
      questionIndex,
      nextDecks: {
        ...decks,
        [cell]: { order: current.order, cursor: current.cursor + 1 },
      },
    };
  }

  const nextOrder = shuffleIndices(pool.length, rng);
  const lastIndex = current.order[current.order.length - 1];
  if (pool.length > 1 && nextOrder[0] === lastIndex) {
    [nextOrder[0], nextOrder[1]] = [nextOrder[1], nextOrder[0]];
  }
  const questionIndex = nextOrder[0];
  return {
    question: pool[questionIndex],
    questionIndex,
    nextDecks: {
      ...decks,
      [cell]: { order: nextOrder, cursor: 1 },
    },
  };
}
