import { Icon, Pawn } from "@/shared/components";
import { COLORS } from "../../../shared/constants/game-data";
import type { Team } from "../types";
import { getRaceWinner, rankTeams, teamColor } from "../utils/game-logic";
import { Ranking } from "./Ranking";

type EndScreenProps = {
  teams: Team[];
  onRestart: () => void;
  onSetup: () => void;
};

export function EndScreen({ teams, onRestart, onSetup }: EndScreenProps) {
  const rankedTeams = rankTeams(teams);
  const winner = getRaceWinner(teams) ?? rankedTeams[0];

  return (
    <section className="end-screen">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 48 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              background: COLORS[i % 6],
              animationDelay: `${-(i % 9) * 0.5}s`,
              animationDuration: `${3 + (i % 4)}s`,
              transform: `rotate(${i * 31}deg)`,
            }}
          />
        ))}
      </div>
      <div className="eyebrow">MỘT HÀNH TRÌNH THẬT ĐÁNG NHỚ</div>
      <div className="winner-icon">
        <Icon name="trophy" size={40} />
      </div>
      <h1>Nhóm {winner.id} chiến thắng!</h1>
      <p>
        Nhóm {winner.id} đã về đích đầu tiên! Cuộc đua kết thúc ngay tại ô 30.
        Điểm số ghi nhận kiến thức của tất cả các nhóm.
      </p>
      <div className="podium">
        {[1, 0, 2]
          .filter((i) => rankedTeams[i])
          .map((i) => {
            const team = rankedTeams[i];
            return (
              <div key={team.id} className={`podium-place place-${i + 1}`}>
                <Pawn color={teamColor(team.id)} id={team.id} />
                <b>Nhóm {team.id}</b>
                <span>{team.score} điểm</span>
                <div className="podium-block">
                  <Icon name={i === 0 ? "trophy" : "star"} size={25} />
                  <strong>{i + 1}</strong>
                </div>
              </div>
            );
          })}
      </div>
      <section className="panel final-ranking">
        <h2>Bảng xếp hạng chung cuộc</h2>
        <Ranking teams={teams} active={0} />
      </section>
      <div className="end-actions">
        <button className="primary-button" onClick={onRestart}>
          <Icon name="refresh" /> Chơi lại
        </button>
        <button className="secondary-button" onClick={onSetup}>
          Về trang thiết lập <Icon name="arrow" />
        </button>
      </div>
    </section>
  );
}
