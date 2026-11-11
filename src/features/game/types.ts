export type ScreenState = "setup" | "play" | "end";

export type Team = {
  id: number;
  position: number;
  score: number;
  finished: boolean;
};

export type Question = {
  title: string;
  year: string;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
};

export type Log = {
  id: number;
  team: number;
  text: string;
  points?: number;
  correct?: boolean;
};

export type PendingQuestion = {
  cell: number;
  team: number;
  selected: number | null;
  question?: Question;
  questionIndex?: number;
};

export type QuestionDeckState = Record<
  number,
  {
    order: number[];
    cursor: number;
  }
>;

export type Point = {
  x: number;
  y: number;
};

export type Curve = [Point, Point, Point, Point];

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MotionState = {
  team: number;
  x: number;
  y: number;
};

