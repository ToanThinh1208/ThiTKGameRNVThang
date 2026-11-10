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
