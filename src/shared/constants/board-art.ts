import type { Curve, Point } from "../../features/game/types.ts";

const p = (x: number, y: number): Point => ({ x, y });

// Separate anchors in shared destination 22 keep the snake and ladder distinct.
export const LADDER_ART: Record<number, { from: Point; to: Point }> = {
  6: { from: p(680, 549), to: p(685, 287) },
  11: { from: p(218, 447), to: p(216, 307) },
  15: { from: p(330, 331), to: p(337, 201) },
  21: { from: p(451, 193), to: p(456, 70) },
  23: { from: p(211, 211), to: p(197, 79) },
};

export const SNAKE_ART: Record<
  number,
  {
    color: string;
    outline: string;
    pattern: "dots" | "gold" | "bands" | "stripes";
    curves: Curve[];
  }
> = {
  16: {
    color: "#72ad55",
    outline: "#3e743d",
    pattern: "dots",
    curves: [
      [p(420, 311), p(444, 340), p(395, 353), p(400, 385)],
      [p(400, 385), p(385, 420), p(431, 449), p(421, 478)],
      [p(421, 478), p(446, 526), p(412, 547), p(382, 541)],
      [p(382, 541), p(353, 535), p(330, 540), p(296, 536)],
    ],
  },
  20: {
    color: "#6c9d49",
    outline: "#477139",
    pattern: "gold",
    curves: [
      [p(548, 210), p(532, 253), p(566, 269), p(551, 309)],
      [p(551, 309), p(530, 349), p(561, 365), p(548, 399)],
      [p(548, 399), p(534, 434), p(518, 461), p(530, 485)],
      [p(530, 485), p(544, 508), p(540, 522), p(535, 548)],
    ],
  },
  25: {
    color: "#df6742",
    outline: "#9f4834",
    pattern: "bands",
    curves: [
      [p(60, 76), p(42, 104), p(89, 128), p(78, 156)],
      [p(78, 156), p(66, 183), p(24, 198), p(31, 230)],
      [p(31, 230), p(39, 258), p(88, 277), p(98, 306)],
      [p(98, 306), p(115, 340), p(98, 358), p(70, 378)],
      [p(70, 378), p(48, 400), p(44, 414), p(44, 430)],
    ],
  },
  29: {
    color: "#37834c",
    outline: "#23623a",
    pattern: "stripes",
    curves: [
      [p(559, 65), p(551, 85), p(570, 102), p(592, 121)],
      [p(592, 121), p(623, 132), p(662, 116), p(687, 140)],
      [p(687, 140), p(713, 176), p(671, 207), p(640, 190)],
    ],
  },
  27: {
    color: "#8ca84b",
    outline: "#617a34",
    pattern: "gold",
    curves: [
      [p(317, 68), p(328, 93), p(283, 108), p(280, 133)],
      [p(280, 133), p(276, 153), p(292, 164), p(276, 190)],
    ],
  },
};

export const BOARD_COLORS = [
  "#91b94a",
  "#3c96c8",
  "#357eb9",
  "#76318a",
  "#b62b7b",
  "#d94335",
  "#76318a",
  "#91b94a",
  "#ba2e83",
  "#db4035",
  "#e6983a",
  "#eddb46",
  "#b72d7e",
  "#77348b",
  "#409acc",
  "#e59839",
  "#91b94a",
  "#b92e80",
  "#327eb9",
  "#3b94c6",
  "#eddb46",
  "#b32b7e",
  "#edda45",
  "#91b94a",
  "#3d95c6",
  "#e79b3d",
  "#367fb8",
  "#91b94a",
  "#81348b",
  "#edda45",
];

// Year-only chips: large for TV/classroom reading; the title lives in the tooltip and quiz.
export const BOARD_LABELS: Record<
  number,
  {
    year: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
  }
> = {
  1: {
    year: "1986",
    title: "Khởi đầu",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  3: {
    year: "1986",
    title: "Đại hội VI",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  5: {
    year: "1988",
    title: "Khoán 10",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  6: {
    year: "1989",
    title: "Xuất khẩu gạo",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  10: {
    year: "1995",
    title: "ASEAN",
    x: 8,
    y: 85,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  13: {
    year: "1997",
    title: "Khủng hoảng châu Á",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  14: {
    year: "1998",
    title: "APEC",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  19: {
    year: "2005",
    title: "Môi trường",
    x: 6,
    y: 87,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  21: {
    year: "2007",
    title: "WTO",
    x: 9,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  24: {
    year: "2010",
    title: "Rủi ro quản trị",
    x: 55,
    y: 89,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  28: {
    year: "2016",
    title: "Chỉnh đốn Đảng",
    x: 8,
    y: 84,
    width: 52,
    height: 25,
    fontSize: 17,
  },
  30: {
    year: "2018",
    title: "Tổng kết Đổi mới",
    x: 8,
    y: 82,
    width: 52,
    height: 25,
    fontSize: 17,
  },
};

// Tile-local baselines, tuned against the painted artwork rather than its center lines.
export const NUMBER_ANCHORS: Record<
  number,
  { x: number; y: number; fontSize?: number }
> = {
  1: { x: 12, y: 42 },
  2: { x: 12, y: 44 },
  3: { x: 62, y: 42, fontSize: 42 },
  4: { x: 88, y: 42, fontSize: 34 },
  5: { x: 8, y: 52 },
  6: { x: 12, y: 44 },
  7: { x: 12, y: 42 },
  8: { x: 12, y: 44 },
  9: { x: 80, y: 100 },
  10: { x: 12, y: 44 },
  11: { x: 6, y: 42 },
  12: { x: 54, y: 100 },
  13: { x: 6, y: 68, fontSize: 34 },
  14: { x: 12, y: 42 },
  15: { x: 6, y: 42, fontSize: 40 },
  16: { x: 6, y: 34, fontSize: 32 },
  17: { x: 6, y: 58, fontSize: 36 },
  18: { x: 6, y: 38, fontSize: 38 },
  19: { x: 8, y: 58, fontSize: 40 },
  20: { x: 12, y: 44 },
  21: { x: 8, y: 42, fontSize: 38 },
  22: { x: 60, y: 44, fontSize: 38 },
  23: { x: 8, y: 60, fontSize: 34 },
  24: { x: 8, y: 38, fontSize: 34 },
  25: { x: 66, y: 36, fontSize: 34 },
  26: { x: 12, y: 44 },
  27: { x: 10, y: 40, fontSize: 40 },
  28: { x: 12, y: 44 },
  29: { x: 10, y: 40, fontSize: 38 },
  30: { x: 8, y: 60 },
};
