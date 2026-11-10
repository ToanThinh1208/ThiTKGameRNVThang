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

