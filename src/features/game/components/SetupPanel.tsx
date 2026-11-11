import { Icon, Pawn } from "@/shared/components";
import { makeTeams, teamColor } from "../utils/game-logic";
import { Rules } from "./Rules";

type SetupPanelProps = {
  count: number;
  onSelectCount: (count: number) => void;
  onStart: () => void;
};

export function SetupPanel({ count, onSelectCount, onStart }: SetupPanelProps) {
  return (
    <>
      <section className="panel setup-panel">
        <div className="panel-kicker">
          <span className="tiny-icon">
            <Icon name="dice" size={19} />
          </span>{" "}
          SẴN SÀNG KHÁM PHÁ?
        </div>
        <h2>Thiết lập cuộc chơi</h2>
        <p className="panel-description">
          Rủ đồng đội, chọn quân cờ và bắt đầu nào!
        </p>
        <div className="setting-label">
          <Icon name="users" size={18} />
          <b>Số nhóm tham gia</b>
          <span>2–6 nhóm</span>
        </div>
        <div className="segment groups">
          {[2, 3, 4, 5, 6].map((n) => (
            <button
              key={n}
              aria-pressed={count === n}
              className={count === n ? "selected" : ""}
              onClick={() => onSelectCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="team-preview">
          {makeTeams(count).map((team) => (
            <div key={team.id}>
              <Pawn color={teamColor(team.id)} id={team.id} />
              <span>Nhóm {team.id}</span>
            </div>
          ))}
        </div>
        <div className="race-rule">
          <Icon name="flag" size={23} />
          <div>
            <b>Về đích trước là thắng</b>
            <p>
              Không giới hạn số vòng. Cuộc đua kết thúc ngay khi một nhóm tới ô
              30.
            </p>
          </div>
        </div>
        <button className="primary-button start-button" onClick={onStart}>
          BẮT ĐẦU TRÒ CHƠI <Icon name="arrow" size={21} />
        </button>
        <p className="setup-footnote">
          Chung một thiết bị · Các nhóm chơi luân phiên
        </p>
      </section>
      <details className="panel rules-accordion">
        <summary>
          <span>
            <Icon name="book" size={19} /> Chơi thế nào nhỉ?
          </span>
          <Icon name="chevron" size={18} />
        </summary>
        <Rules />
      </details>
      <div className="learning-note">
        <span className="note-icon">
          <Icon name="star" size={22} />
        </span>
        <div>
          <b>Chơi cùng nhau, nhớ lâu hơn.</b>
          <p>
            Thảo luận với nhóm trước khi chọn đáp án. Mỗi câu hỏi là một cơ hội
            để học!
          </p>
        </div>
      </div>
    </>
  );
}
