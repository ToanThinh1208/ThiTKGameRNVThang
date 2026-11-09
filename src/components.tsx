import type { CSSProperties } from "react";
import { cellPoint, COLORS, EVENTS, LADDERS, QUESTIONS, SNAKES, type Team } from "./game";

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M6 8a7 7 0 0 1 12-2l2 3M4 15l2 3a7 7 0 0 0 12-2" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v15M12 6C8 3 3 5 3 5v14s5-2 9 1c4-3 9-1 9-1V5s-5-2-9 1Z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 1h8" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    flag: (
      <>
        <path d="M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" />
      </>
    ),
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 8a3 3 0 1 1 4 3c-1 1-1 2-1 3m0 3h.01" />
      </>
    ),
    dice: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M7 7h.01M17 7h.01M12 12h.01M7 17h.01M17 17h.01" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.star}
    </svg>
  );
}

export function Pawn({
  color,
  id,
  className = "",
}: {
  color: string;
  id?: number;
  className?: string;
}) {
  return (
    <svg className={`pawn ${className}`} viewBox="0 0 50 62" aria-hidden="true">
      <ellipse cx="25" cy="54" rx="23" ry="7" fill="#183f3120" />
      <ellipse cx="25" cy="48" rx="21" ry="10" fill={color} stroke="#0003" strokeWidth="1.5" />
      <path
        d="M8 45Q15 32 17 17Q18 6 25 6Q32 6 33 17Q35 32 42 45Q25 57 8 45Z"
        fill={color}
        stroke="#0003"
        strokeWidth="1.5"
      />
      <path
        d="M20 16Q18 31 15 40"
        stroke="white"
        opacity=".45"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {id && (
        <text
          x="26"
          y="35"
          textAnchor="middle"
          fill="white"
          fontSize="17"
          fontWeight="900"
          fontFamily="Nunito"
        >
          {id}
        </text>
      )}
    </svg>
  );
}
export function Dice({ value, rolling = false }: { value: number; rolling?: boolean }) {
  const dots: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };
  return (
    <div className={`dice ${rolling ? "rolling" : ""}`} aria-label={`Xúc xắc ${value} điểm`}>
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className={dots[value].includes(i) ? "dot visible" : "dot"} />
      ))}
    </div>
  );
}
function Ladder({ from, to }: { from: number; to: number }) {
  const a = cellPoint(from),
    b = cellPoint(to);
  const dx = b.x - a.x,
    dy = b.y - a.y,
    length = Math.hypot(dx, dy) - 40;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g
      transform={`translate(${a.x},${a.y}) rotate(${angle}) translate(20,0)`}
      stroke="#343326"
      strokeLinejoin="round"
    >
      {Array.from({ length: Math.floor(length / 24) }, (_, i) => (
        <path key={i} d={`M${i * 24 + 10} -12v24`} strokeWidth="9" />
      ))}
      {Array.from({ length: Math.floor(length / 24) }, (_, i) => (
        <path key={i} d={`M${i * 24 + 10} -12v24`} stroke="#ffe36a" strokeWidth="5" />
      ))}
      {[-17, 17].map((y) => (
        <g key={y}>
          <path d={`M0 ${y}H${length}`} strokeWidth="12" />
          <path d={`M0 ${y}H${length}`} stroke="#F2C21B" strokeWidth="8" />
          <path d={`M0 ${y - 2}H${length}`} stroke="#fff29b" strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}
function Snake({ from, to }: { from: number; to: number }) {
  const a = cellPoint(from),
    b = cellPoint(to);
  const x = a.x + 15,
    y = a.y + 10,
    dx = b.x - x,
    dy = b.y - y;
  const path = `M${x} ${y} C${x - 85} ${y + 35},${b.x + 90} ${b.y - 65},${b.x} ${b.y} Q${b.x - 30} ${b.y + 20},${b.x - 42} ${b.y + 8}`;
  return (
    <g>
      <path d={path} stroke="#3e2a3c" strokeWidth="19" fill="none" strokeLinecap="round" />
      <path d={path} stroke="#E8A6D8" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path
        d={path}
        stroke={from % 2 ? "#a54085" : "#ca536b"}
        strokeWidth="8"
        fill="none"
        strokeDasharray="2 24"
        strokeLinecap="round"
      />
      <g transform={`translate(${x},${y}) rotate(${dx < 0 ? -8 : 8})`}>
        <path d="M18 4l16 7m-1 0 5-3m-5 3 4 4" fill="none" stroke="#bd365d" strokeWidth="2.5" />
        <ellipse rx="25" ry="14" fill="#efb8e3" stroke="#3e2a3c" strokeWidth="2" />
        <path d="M1 6q10 8 20-2" fill="none" stroke="#3e2a3c" strokeWidth="1.6" />
        <ellipse cx="-9" cy="-12" rx="6.5" ry="8" fill="white" stroke="#3e2a3c" strokeWidth="1.5" />
        <ellipse cx="5" cy="-12" rx="6.5" ry="8" fill="white" stroke="#3e2a3c" strokeWidth="1.5" />
        <circle cx="-7" cy="-11" r="2.8" fill="#292531" />
        <circle cx="7" cy="-11" r="2.8" fill="#292531" />
        <circle cx="18" cy="-1" r="1.5" fill="#63364e" />
      </g>
      <title>
        Rắn từ ô {from} xuống ô {to}, độ dài {Math.round(Math.hypot(dx, dy))}
      </title>
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
  motion?: { team: number; x: number; y: number } | null;
}) {
  const colors = ["#E3262B", "#FFD400", "#5BAE2E", "#1F4FD8", "#FFFFFF"];
  return (
    <div className="board-frame">
      <svg
        className="board"
        viewBox="0 0 720 600"
        role="img"
        aria-label="Bàn cờ 30 ô, 6 cột 5 hàng, đánh số zíc-zắc từ dưới trái lên trên phải"
      >
        <defs>
          <filter id="pawn-shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity=".25" />
          </filter>
        </defs>
        {Array.from({ length: 30 }, (_, i) => {
          const n = i + 1,
            { x, y } = cellPoint(n);
          return (
            <rect
              key={n}
              x={x - 60}
              y={y - 60}
              width="120"
              height="120"
              fill={colors[i % 5]}
              stroke="#26362b"
              strokeWidth="3"
            />
          );
        })}
        {Object.entries(LADDERS).map(([from, to]) => (
          <Ladder key={from} from={+from} to={to} />
        ))}
        {Object.entries(SNAKES).map(([from, to]) => (
          <Snake key={from} from={+from} to={to} />
        ))}
        {Array.from({ length: 30 }, (_, i) => {
          const n = i + 1,
            { x, y } = cellPoint(n),
            white = i % 5 === 4;
          const question = QUESTIONS[n];
          const label =
            n === 1
              ? "1986 · Khởi đầu"
              : n === 30
                ? "2018 · ĐÍCH ĐẾN"
                : question
                  ? `${question.year} · ${EVENTS.includes(n) ? "Sự kiện" : question.title}`
                  : n === 8
                    ? "1990"
                    : n === 16
                      ? "2000"
                      : "2015";
          return (
            <g key={n} className={`board-cell ${white ? "white-cell" : ""}`}>
              {n === 30 && (
                <rect
                  x={x - 55}
                  y={y - 55}
                  width="110"
                  height="110"
                  rx="5"
                  fill="none"
                  stroke="#e9b82f"
                  strokeWidth="6"
                  strokeDasharray="8 3"
                />
              )}
              <text
                x={x - 47}
                y={y - 13}
                fill={white ? "#263c30" : "#fff"}
                className="cell-number"
                fontSize={white ? 33 : 48}
              >
                {n}
              </text>
              {EVENTS.includes(n) && (
                <g transform={`translate(${x + 43},${y - 42})`}>
                  <circle r="10" fill={white ? "#dce8df" : "#ffffffd9"} />
                  <text textAnchor="middle" y="5" fontSize="15" fontWeight="900" fill="#314937">
                    ?
                  </text>
                </g>
              )}
              {n === 1 && (
                <g transform={`translate(${x + 24},${y - 21})`} stroke="white" strokeWidth="2.5">
                  <path d="M0 0v30M0 0h22v15H0" fill="#ffffff30" />
                  <path d="m5 2 6 5-6 5m6-10 6 5-6 5" fill="white" stroke="none" />
                </g>
              )}
              {n === 30 && (
                <g
                  transform={`translate(${x + 21},${y - 23})`}
                  fill="#edb72d"
                  stroke="#94741d"
                  strokeWidth="1.8"
                >
                  <path d="M-12-12h24V0a12 12 0 0 1-24 0Zm-1 2h-9v6q0 9 12 9m23-15h9v6q0 9-12 9M0 12v12m-9 0H9" />
                </g>
              )}
              <rect
                x={x - 55}
                y={y + 30}
                width="110"
                height="25"
                rx="4"
                fill={white ? "#ffffffdd" : "#00000080"}
              />
              <text
                x={x}
                y={y + 47}
                textAnchor="middle"
                fill={white ? "#263c30" : "#fff"}
                className="cell-label"
                fontSize="10.5"
                fontWeight="800"
                textLength={label.length > 19 ? 105 : undefined}
                lengthAdjust="spacingAndGlyphs"
              >
                {label}
              </text>
            </g>
          );
        })}
        {teams.map((team) => {
          const at = preview ? [1, 1, 1, 1, 1, 1][team.id - 1] : team.position;
          const p = motion?.team === team.id ? motion : cellPoint(at);
          const together = teams.filter((t) => (preview ? 1 : t.position) === at);
          const index = together.findIndex((t) => t.id === team.id);
          const offset = (index - (together.length - 1) / 2) * (together.length > 4 ? 16 : 22);
          return (
            <g
              key={team.id}
              className={`board-pawn ${team.id === active && !preview ? "active-pawn" : ""}`}
              style={
                {
                  transform: `translate(${p.x + offset - 17}px, ${p.y - 11}px)`,
                  transition: motion?.team === team.id ? "none" : undefined,
                } as CSSProperties
              }
              filter="url(#pawn-shadow)"
            >
              {team.id === active && !preview && (
                <ellipse
                  cx="17"
                  cy="36"
                  rx="22"
                  ry="10"
                  fill="#fff7"
                  stroke="white"
                  strokeWidth="2"
                  className="pawn-glow"
                />
              )}
              <foreignObject width="34" height="44">
                <Pawn color={COLORS[team.id - 1]} id={team.id} />
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
