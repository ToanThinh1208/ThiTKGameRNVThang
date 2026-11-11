import type { CSSProperties } from "react";
import { Dice, Icon, Pawn } from "@/shared/components";
import type { Team } from "../types";
import { teamColor } from "../utils/game-logic";

type TurnPanelProps = {
  active: Team;
  die: number;
  busy: boolean;
  hasPending: boolean;
  onRoll: () => void;
};

export function TurnPanel({
  active,
  die,
  busy,
  hasPending,
  onRoll,
}: TurnPanelProps) {
  return (
    <section
      className="panel turn-panel"
      style={{ "--team-color": teamColor(active.id) } as CSSProperties}
    >
      <div className="turn-heading">
        <div>
          <div className="panel-kicker">ĐẾN LƯỢT KHÁM PHÁ</div>
          <h2>
            Lượt của <span>Nhóm {active.id}</span>
          </h2>
        </div>
        <Pawn color={teamColor(active.id)} id={active.id} />
      </div>
      <div className="dice-area">
        <span className="dice-spark spark-one">+</span>
        <Dice value={die} rolling={busy && !hasPending} />
        <span className="dice-spark spark-two">✧</span>
      </div>
      <button
        className="primary-button roll-button"
        disabled={busy || hasPending}
        onClick={onRoll}
      >
        <Icon name="dice" size={21} />
        {busy ? "ĐANG DI CHUYỂN…" : "TUNG XÚC XẮC"}
        <Icon name="arrow" size={20} />
      </button>
      <p className="turn-status" aria-live="polite">
        {busy ? (
          "Một dấu mốc mới đang chờ bạn!"
        ) : (
          <>
            Nhóm {active.id} đang ở <b>ô {active.position}</b>. Sẵn sàng tiến
            bước!
          </>
        )}
      </p>
    </section>
  );
}
