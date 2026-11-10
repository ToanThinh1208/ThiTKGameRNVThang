import { EffectToast, Icon } from "@/shared/components";
import { MainLayout } from "@/shared/layouts";
import { ActivityPanel } from "../components/ActivityPanel";
import { Board } from "../components/Board";
import { EndScreen } from "../components/EndScreen";
import { QuestionModal } from "../components/QuestionModal";
import { ResetModal } from "../components/ResetModal";
import { SetupPanel } from "../components/SetupPanel";
import { TurnPanel } from "../components/TurnPanel";
import { useGame } from "../hooks/useGame";
import { makeTeams } from "../utils/game-logic";

export function GamePage() {
  const {
    screen,
    setScreen,
    count,
    setCount,
    teams,
    round,
    die,
    busy,
    pending,
    logs,
    tab,
    setTab,
    setReset,
    toast,
    motion,
    modalRef,
    active,
    modalOpen,
    start,
    roll,
    selectAnswer,
    continueAnswer,
    goToSetup,
  } = useGame();

  return (
    <>
      <MainLayout
        screen={screen}
        round={round}
        busy={busy}
        onBrandClick={() => (screen === "play" ? setReset(true) : setScreen("setup"))}
        onResetClick={() => setReset(true)}
      >
        {screen !== "end" ? (
          <>
            <section className="page-intro">
              <div>
                <div className="eyebrow">
                  <span /> MỘT TRÒ CHƠI · CẢ MỘT HÀNH TRÌNH
                </div>
                <h1>
                  Hành trình <span>Đổi mới</span> Việt Nam<span className="title-star">✳</span>
                </h1>
                <p>
                  1986 — 2018 <span className="intro-divider" /> Tung xúc xắc. Khám phá lịch sử.
                  Cùng nhau bứt phá.
                </p>
              </div>
              <div className="intro-stamp">
                <Icon name="flag" size={23} />
                <span>
                  <b>30 dấu mốc</b>
                  <small>Một Việt Nam đổi mới</small>
                </span>
              </div>
            </section>
            <div className="game-layout">
              <section className="board-section">
                <div className="board-topline">
                  <div>
                    <span className="live-dot" />
                    <b>{screen === "setup" ? "BÀN CỜ HÀNH TRÌNH" : "HÀNH TRÌNH ĐANG DIỄN RA"}</b>
                  </div>
                  <span>
                    KHỞI ĐẦU 1986 <Icon name="arrow" size={14} /> ĐÍCH ĐẾN 2018
                  </span>
                </div>
                <Board
                  teams={screen === "setup" ? makeTeams(count) : teams}
                  active={active.id}
                  preview={screen === "setup"}
                  motion={motion}
                />
                <div className="board-legend">
                  <span>
                    <i className="legend-ladder">↗</i> Thang cơ hội
                  </span>
                  <span>
                    <i className="legend-snake">↘</i> Rắn thử thách
                  </span>
                  <span>
                    <i className="legend-event">?</i> Ô sự kiện
                  </span>
                  <span>
                    <Icon name="flag" size={16} /> Ô đích
                  </span>
                </div>
                <div className="board-note">
                  <Icon name="star" size={17} />
                  <span>
                    <b>Về đích đầu tiên là chiến thắng!</b> Cùng học hỏi trên mỗi bước đi.
                  </span>
                </div>
              </section>
              <aside className="sidebar">
                {screen === "setup" ? (
                  <SetupPanel count={count} onSelectCount={setCount} onStart={start} />
                ) : (
                  <>
                    <TurnPanel
                      active={active}
                      die={die}
                      busy={busy}
                      hasPending={!!pending}
                      onRoll={roll}
                    />
                    <ActivityPanel
                      tab={tab}
                      onSelectTab={setTab}
                      teams={teams}
                      activeId={active.id}
                      logs={logs}
                    />
                  </>
                )}
              </aside>
            </div>
          </>
        ) : (
          <EndScreen teams={teams} onRestart={start} onSetup={() => setScreen("setup")} />
        )}
      </MainLayout>
      <EffectToast toast={toast} />
      {modalOpen && (
        <div className="modal-backdrop">
          <div
            ref={modalRef}
            className={`modal ${pending ? "question-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {pending ? (
              <QuestionModal
                pending={pending}
                onSelectAnswer={selectAnswer}
                onContinue={continueAnswer}
              />
            ) : (
              <ResetModal
                onClose={() => setReset(false)}
                onRestart={start}
                onSetup={goToSetup}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

