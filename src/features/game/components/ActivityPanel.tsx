import { Icon } from "@/shared/components";
import { COLORS } from "../../../shared/constants/game-data";
import type { Log, Team } from "../types";
import { Ranking } from "./Ranking";

type ActivityPanelProps = {
  tab: string;
  onSelectTab: (tab: string) => void;
  teams: Team[];
  activeId: number;
  logs: Log[];
};

export function ActivityPanel({
  tab,
  onSelectTab,
  teams,
  activeId,
  logs,
}: ActivityPanelProps) {
  return (
    <>
      <section className="panel activity-panel">
        <div className="panel-tabs">
          <button
            className={tab === "ranking" ? "active" : ""}
            onClick={() => onSelectTab("ranking")}
          >
            <Icon name="trophy" size={17} /> Xếp hạng
          </button>
          <button
            className={tab === "logs" ? "active" : ""}
            onClick={() => onSelectTab("logs")}
          >
            <Icon name="clock" size={17} /> Nhật ký{" "}
            <span className="log-count">{logs.length}</span>
          </button>
        </div>
        {tab === "ranking" ? (
          <>
            <Ranking teams={teams} active={activeId} />
            <div className="rank-footnote">
              Nhóm về đích xếp nhất; các nhóm còn lại xếp theo điểm và vị trí ô.
            </div>
          </>
        ) : (
          <div className="logs">
            {logs.length === 0 ? (
              <div className="empty-log">
                <Icon name="book" size={30} />
                <b>Hành trình bắt đầu từ đây</b>
                <p>Tung xúc xắc để ghi dấu mốc đầu tiên!</p>
              </div>
            ) : (
              logs.map((log) => (
                <div className="log-row" key={log.id}>
                  <span
                    className="log-dot"
                    style={{ background: COLORS[log.team - 1] }}
                  />
                  <div>
                    <b>Nhóm {log.team}</b>
                    <p>{log.text}</p>
                  </div>
                  {log.points !== undefined && (
                    <strong
                      className={log.points < 0 ? "negative" : "positive"}
                    >
                      {log.points > 0 ? "+" : ""}
                      {log.points}
                    </strong>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>
      <div className="learning-note">
        <span className="note-icon">
          <Icon name="star" size={22} />
        </span>
        <div>
          <b>Ai sẽ về đích đầu tiên?</b>
          <p>Trả lời đúng để leo thang, né rắn và tiến nhanh tới ô 30.</p>
        </div>
      </div>
    </>
  );
}
