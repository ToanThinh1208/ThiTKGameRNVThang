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

