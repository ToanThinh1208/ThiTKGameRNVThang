import { useId, type CSSProperties } from "react";
import { Pawn } from "@/shared/components";
import {
  BOARD_COLORS,
  BOARD_LABELS,
  LADDER_ART,
  SNAKE_ART,
} from "../../../shared/constants/board-art";
import {
  LADDERS,
  QUESTIONS,
  SNAKES,
} from "../../../shared/constants/game-data";
import type { MotionState, Team } from "../types";
import { snakePath, snakePoint, snakeRibbon } from "../utils/board-geometry";
import { labelLayout, numberLayout, pieceLayout } from "../utils/board-layout";
import { cellPoint, teamColor } from "../utils/game-logic";

const CELLS = Array.from({ length: 30 }, (_, i) => i + 1);

function Ladder({
  from,
  to,
  filter,
}: {
  from: number;
  to: number;
  filter: string;
}) {
  const { from: a, to: b } = LADDER_ART[from];
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  const count = Math.max(4, Math.round(length / 27));
  return (
    <g
      className="map-ladder"
      data-from={from}
      data-to={to}
      filter={`url(#${filter})`}
    >
      <title>
        Thang: ô {from} lên ô {to}
      </title>
      <g
        transform={`translate(${a.x},${a.y}) rotate(${angle})`}
        strokeLinecap="square"
      >
        {[-17, 17].map((y) => (
          <g key={y}>
            <path d={`M0,${y}H${length}`} stroke="#956333" strokeWidth="8" />
            <path
              d={`M0,${y - 1.5}H${length}`}
              stroke="#c9934b"
              strokeWidth="4"
            />
          </g>
        ))}
        {Array.from({ length: count }, (_, i) => {
          const x = 9 + ((length - 18) * i) / (count - 1);
          return (
            <g key={i}>
              <path d={`M${x + 1},-20V20`} stroke="#9c6935" strokeWidth="8" />
              <path d={`M${x - 1},-20V20`} stroke="#ce9b56" strokeWidth="5.5" />
              <circle cx={x - 1} cy="-16" r="1" fill="#946530" />
              <circle cx={x - 1} cy="16" r="1" fill="#946530" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

function Snake({
  from,
  to,
  id,
  filter,
}: {
  from: number;
  to: number;
  id: string;
  filter: string;
}) {
  const art = SNAKE_ART[from],
    head = snakePoint(from, 0),
    ribbon = snakeRibbon(from);
  const clip = `${id}-snake-${from}`;
  const spots = Math.max(6, art.curves.length * 4);
  return (
    <g
      className="map-snake"
      data-from={from}
      data-to={to}
      filter={`url(#${filter})`}
    >
      <title>
        Rắn: ô {from} xuống ô {to}
      </title>
      <defs>
        <clipPath id={clip}>
          <path d={ribbon} />
        </clipPath>
      </defs>
      <path
        d={ribbon}
        fill={art.color}
        stroke={art.outline}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${clip})`}>
        {Array.from({ length: spots }, (_, i) => {
          const t = 0.035 + (i / spots) * 0.89,
            at = snakePoint(from, t),
            next = snakePoint(from, Math.min(1, t + 0.005));
          const angle =
            (Math.atan2(next.y - at.y, next.x - at.x) * 180) / Math.PI;
          return (
            <g
              key={i}
              transform={`translate(${at.x},${at.y}) rotate(${angle})`}
            >
              {art.pattern === "bands" ? (
                <>
                  <path d="M0,-12V12" stroke="#263b2b" strokeWidth="8" />
                  <path d="M-2,-12V12" stroke="#fff2d2" strokeWidth="2.5" />
                </>
              ) : art.pattern === "stripes" ? (
                <path d="M0,-12V12" stroke="#e9cc58" strokeWidth="9" />
              ) : (
                <ellipse
                  cx="0"
                  cy={i % 2 ? 2 : -2}
                  rx={art.pattern === "dots" ? 4.4 : 4.6}
                  ry={art.pattern === "dots" ? 4.2 : 3.3}
                  fill={art.pattern === "dots" ? "#c6dc8b" : "#e3cb67"}
                />
              )}
            </g>
          );
        })}
      </g>
      <path
        d={snakePath(from)}
        fill="none"
        stroke="none"
        data-connection={from}
      />
      <g transform={`translate(${head.x},${head.y})`}>
        <path
          d="M0,-19v-7m0 0-4-4m4 4 4-4"
          stroke="#a4523e"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse
          cx="0"
          cy="-1"
          rx="15.5"
          ry="20"
          fill={art.color}
          stroke={art.outline}
          strokeWidth="1.3"
        />
        <ellipse
          cx="-8"
          cy="-10"
          rx="7.3"
          ry="8.4"
          fill="#fffdf0"
          stroke={art.outline}
          strokeWidth="1"
        />
        <ellipse
          cx="8"
          cy="-10"
          rx="7.3"
          ry="8.4"
          fill="#fffdf0"
          stroke={art.outline}
          strokeWidth="1"
        />
        <circle cx="-6.4" cy="-8.3" r="3.3" fill="#263b2b" />
        <circle cx="6.4" cy="-8.3" r="3.3" fill="#263b2b" />
        <circle cx="-5.4" cy="-9.5" r="1" fill="white" />
        <circle cx="7.4" cy="-9.5" r="1" fill="white" />
        <path
          d="M-6,6Q0,11 6,6"
          fill="none"
          stroke={art.outline}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="-4" cy="1" r=".9" fill={art.outline} />
        <circle cx="4" cy="1" r=".9" fill={art.outline} />
      </g>
    </g>
  );
}

export function Board({
  teams,
  active,
  preview = false,
  motion,
}: {
  teams: Team[];
  active: number;
  preview?: boolean;
  motion?: MotionState | null;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, ""),
    filter = `${id}-art-shadow`;
  return (
    <div className="board-frame">
      <svg
        className="board"
        viewBox="0 0 720 600"
        role="img"
        aria-label="Bàn cờ Rắn và Thang 30 ô, 6 cột × 5 hàng; ô 1 dưới trái, ô 30 trên phải"
      >
        <defs>
          <filter id={filter} x="-15%" y="-15%" width="130%" height="135%">
            <feDropShadow
              dx="1.3"
              dy="2"
              stdDeviation="1.1"
              floodColor="#543c26"
              floodOpacity=".22"
            />
          </filter>
        </defs>
        <g className="map-tiles">
          {CELLS.map((n) => {
            const { x, y } = cellPoint(n);
            return (
              <rect
                key={n}
                data-cell={n}
                x={x - 60}
                y={y - 60}
                width="120"
                height="120"
                fill={BOARD_COLORS[n - 1]}
                stroke="#fff9e7"
                strokeWidth="1.6"
              />
            );
          })}
        </g>
        <g className="map-illustrations">
          {Object.entries(LADDERS).map(([from, to]) => (
            <Ladder key={from} from={+from} to={to} filter={filter} />
          ))}
          {Object.entries(SNAKES).map(([from, to]) => (
            <Snake key={from} from={+from} to={to} id={id} filter={filter} />
          ))}
        </g>
        <g className="map-numbers">
          {CELLS.map((n) => {
            const { x, y } = cellPoint(n),
              anchor = numberLayout(n);
            return (
              <text
                key={n}
                className="cell-number"
                data-number={n}
                x={x - 60 + anchor.x}
                y={y - 60 + anchor.y}
                fill="#fffceb"
                fontSize={anchor.fontSize}
                fontWeight="800"
                style={
                  {
                    "--number-outline":
                      n === 30 || [8, 12, 17, 21, 23, 24, 28].includes(n)
                        ? "#627c33"
                        : "#314c68",
                  } as CSSProperties
                }
              >
                {n}
              </text>
            );
          })}
        </g>
        <g className="map-labels">
          {Object.keys(BOARD_LABELS).map((cell) => {
            const n = +cell,
              label = labelLayout(n)!,
              point = cellPoint(n),
              x = point.x - 60 + label.x,
              y = point.y - 60 + label.y;
            return (
              <g key={n} data-label={n}>
                <title>
                  Ô {n} · {label.year} · {QUESTIONS[n]?.title ?? label.title}
                </title>
                <rect
                  x={x}
                  y={y}
                  width={label.width}
                  height={label.height}
                  rx="6"
                  fill="#fffdf0"
                  fillOpacity=".95"
                />
                <text
                  className="cell-year"
                  x={x + label.width / 2}
                  y={y + label.height / 2 + label.fontSize * 0.36}
                  textAnchor="middle"
                  fill="#263e32"
                  fontSize={label.fontSize}
                  fontWeight="800"
                >
                  {label.year}
                </text>
              </g>
            );
          })}
        </g>
        <g className="map-icons">
          <g
            transform="translate(91,492)"
            stroke="#fffceb"
            strokeWidth="2"
            fill="none"
          >
            <path d="M0 0v27M0 0h19l-5 7 5 7H0" />
          </g>
          <rect
            x="605"
            y="5"
            width="110"
            height="110"
            rx="4"
            fill="none"
            stroke="#8e691c"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <g
            transform="translate(690,21)"
            fill="#eeb83e"
            stroke="#876623"
            strokeWidth="1.8"
          >
            <path d="M-10-10h20V0a10 10 0 0 1-20 0Zm0 2h-7v5q0 7 9 7m18-12h7v5q0 7-9 7M0 10v12m-7 0H7" />
          </g>
        </g>
        <g className="map-pieces">
          {teams.map((team) => {
            const at = preview ? 1 : team.position,
              p = motion?.team === team.id ? motion : cellPoint(at);
            const together = teams.filter(
                (t) => (preview ? 1 : t.position) === at,
              ),
              index = together.findIndex((t) => t.id === team.id);
            const placement = pieceLayout(at, together.length)[index];
            return (
              <g
                key={team.id}
                className="board-pawn"
                data-team={team.id}
                data-position={at}
                style={
                  {
                    transform: `translate(${p.x - 60 + placement.x}px,${p.y - 60 + placement.y}px)`,
                    transition: motion?.team === team.id ? "none" : undefined,
                  } as CSSProperties
                }
              >
                {team.id === active && !preview && (
                  <ellipse
                    cx={placement.width / 2}
                    cy={placement.height * 0.79}
                    rx={placement.width * 0.6}
                    ry={placement.height * 0.23}
                    fill="#fff9"
                    stroke="#fffcea"
                    strokeWidth="2"
                    className="pawn-glow"
                  />
                )}
                <foreignObject
                  width={placement.width}
                  height={placement.height}
                >
                  <Pawn color={teamColor(team.id)} id={team.id} />
                </foreignObject>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
