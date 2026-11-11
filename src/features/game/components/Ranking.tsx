import { Pawn } from "@/shared/components";
import type { Team } from "../types";
import { rankTeams, teamColor } from "../utils/game-logic";

export function Ranking({ teams, active }: { teams: Team[]; active: number }) {
  return (
    <div className="ranking">
      {rankTeams(teams).map((team, i) => (
        <div
          key={team.id}
          className={`rank-row ${team.id === active ? "rank-active" : ""}`}
        >
          <span className={`rank-number rank-${i + 1}`}>{i + 1}</span>
          <Pawn color={teamColor(team.id)} />
          <div className="rank-name">
            <b>Nhóm {team.id}</b>
            <small>
              {team.finished ? (
                <span className="finished-badge">Về đích đầu tiên</span>
              ) : (
                `Đang ở ô ${team.position}`
              )}
            </small>
          </div>
          <div className={`rank-score ${team.score < 0 ? "negative" : ""}`}>
            <b>{team.score}</b>
            <small>điểm</small>
          </div>
        </div>
      ))}
    </div>
  );
}
