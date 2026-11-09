import { useEffect, useRef, useState } from "react";
import { Board, Dice, Icon, Pawn } from "./components";
import {
  COLORS,
  LADDERS,
  SNAKES,
  QUESTIONS,
  advanceTurn,
  cellPoint,
  makeTeams,
  rankTeams,
  resolveAnswer,
  type Team,
} from "./game";

type Log = { id: number; team: number; text: string; points?: number; correct?: boolean };
type Pending = { cell: number; team: number; selected: number | null };
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Rules() {
  return (
    <div className="rules-content">
      <p>
        Các nhóm luân phiên tung xúc xắc, di chuyển và trả lời câu hỏi để khám phá hành trình Đổi
        mới.
      </p>
      <div className="rule-row">
        <span className="rule-symbol ladder-symbol">↗</span>
        <div>
          <b>Ô thang</b>
          <p>
            Đúng: <strong>+100</strong> và leo thang. Sai: <em>−20</em>, đứng yên.
          </p>
        </div>
      </div>
      <div className="rule-row">
        <span className="rule-symbol snake-symbol">↘</span>
        <div>
          <b>Ô rắn</b>
          <p>
            Đúng: <strong>+80</strong>, giữ vị trí. Sai: <em>−40</em> và tụt xuống đuôi rắn.
          </p>
        </div>
      </div>
      <div className="rule-row">
        <span className="rule-symbol event-symbol">?</span>
        <div>
          <b>Ô sự kiện</b>
          <p>
            Đúng: <strong>+80</strong>. Sai: <em>−20</em>. Giữ nguyên vị trí.
          </p>
        </div>
      </div>
      <p>
        Ô thường: <strong>+15 điểm</strong>. Đến hoặc vượt ô 30: <strong>+250 điểm</strong> và hoàn
        thành hành trình.
      </p>
      <p>
        Điểm có thể âm. Trận kết thúc khi hết số vòng hoặc tất cả nhóm về đích. Nhóm{" "}
        <b>cao điểm nhất</b> chiến thắng; bằng điểm thì nhóm ở ô xa hơn xếp trên. Nhóm hoàn thành bỏ
        qua các lượt tiếp theo.
      </p>
    </div>
  );
}

function Ranking({ teams, active }: { teams: Team[]; active: number }) {
  return (
    <div className="ranking">
      {rankTeams(teams).map((team, i) => (
        <div key={team.id} className={`rank-row ${team.id === active ? "rank-active" : ""}`}>
          <span className={`rank-number rank-${i + 1}`}>{i + 1}</span>
          <Pawn color={COLORS[team.id - 1]} />
          <div className="rank-name">
            <b>Nhóm {team.id}</b>
            <small>
              {team.finished ? (
                <span className="finished-badge">Hoàn thành</span>
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

export default function App() {
  const [screen, setScreen] = useState<"setup" | "play" | "end">("setup");
  const [count, setCount] = useState(4);
  const [rounds, setRounds] = useState(10);
  const [teams, setTeams] = useState<Team[]>(makeTeams(4));
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [die, setDie] = useState(5);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [tab, setTab] = useState("ranking");
  const [rules, setRules] = useState(false);
  const [reset, setReset] = useState(false);
  const [toast, setToast] = useState<{ text: string; points: number; positive: boolean } | null>(
    null,
  );
  const [motion, setMotion] = useState<{ team: number; x: number; y: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const active = teams[turn];
  const modalOpen = rules || reset || !!pending;

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = modalRef.current;
    el?.querySelector<HTMLElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) {
        setRules(false);
        setReset(false);
      }
      if (e.key === "Tab" && el) {
        const buttons = [...el.querySelectorAll<HTMLElement>("button:not(:disabled)")];
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [modalOpen, pending?.selected]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function start() {
    clearTimeout(timer.current);
    setTeams(makeTeams(count));
    setTurn(0);
    setRound(1);
    setDie(5);
    setLogs([]);
    setPending(null);
    setBusy(false);
    lock.current = false;
    setToast(null);
    setMotion(null);
    setScreen("play");
    setReset(false);
  }
  function addLog(team: number, text: string, points?: number, correct?: boolean) {
    setLogs((prev) => [{ id: Date.now() + Math.random(), team, text, points, correct }, ...prev]);
  }
  function nextTurn(updated: Team[]) {
    const next = advanceTurn(updated, turn, round, rounds);
    if (next.ended) {
      clearTimeout(timer.current);
      setToast(null);
      setScreen("end");
      return;
    }
    setTurn(next.turn);
    setRound(next.round);
  }
  function showEffect(text: string, points: number) {
    setToast({ text, points, positive: points > 0 });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2800);
  }
  async function roll() {
    if (lock.current || busy || pending) return;
    lock.current = true;
    setBusy(true);
    setToast(null);
    const value = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < 8; i++) {
      setDie(Math.floor(Math.random() * 6) + 1);
      await wait(85);
    }
    setDie(value);
    const destination = Math.min(30, active.position + value);
    addLog(active.id, `Tung được ${value} → đến ô ${destination}`);
    for (let step = active.position + 1; step <= destination; step++) {
      setTeams((prev) => prev.map((t) => (t.id === active.id ? { ...t, position: step } : t)));
      await wait(200);
    }
    await wait(250);
    const updated = teams.map((t) => (t.id === active.id ? { ...t, position: destination } : t));
    if (destination === 30) {
      const result = updated.map((t) =>
        t.id === active.id ? { ...t, score: t.score + 250, finished: true } : t,
      );
      setTeams(result);
      addLog(active.id, "Đã về đích! Hoàn thành hành trình.", 250);
      showEffect(`Nhóm ${active.id} đã về đích!`, 250);
      nextTurn(result);
    } else if (QUESTIONS[destination]) {
      setPending({ cell: destination, team: active.id, selected: null });
    } else {
      const result = updated.map((t) => (t.id === active.id ? { ...t, score: t.score + 15 } : t));
      setTeams(result);
      addLog(active.id, "Ô thường · Tiến bước trên hành trình", 15);
      showEffect("Một bước tiến mới!", 15);
      nextTurn(result);
    }
    setBusy(false);
    lock.current = false;
  }
  function selectAnswer(index: number) {
    if (!pending || pending.selected !== null) return;
    setPending({ ...pending, selected: index });
  }
  async function continueAnswer() {
    if (!pending || pending.selected === null || lock.current) return;
    lock.current = true;
    setBusy(true);
    const correct = pending.selected === QUESTIONS[pending.cell].correct;
    const result = resolveAnswer(pending.cell, correct);
    const updated = teams.map((t) =>
      t.id === pending.team
        ? { ...t, score: t.score + result.points, position: result.destination }
        : t,
    );
    setPending(null);
    showEffect(result.message, result.points);
    addLog(
      pending.team,
      `${correct ? "Trả lời đúng" : "Trả lời sai"} ở ô ${pending.cell}${result.destination !== pending.cell ? ` → ô ${result.destination}` : ""}`,
      result.points,
      correct,
    );
    if (result.destination !== pending.cell) {
      const a = cellPoint(pending.cell),
        b = cellPoint(result.destination);
      const snake = !!SNAKES[pending.cell];
      for (let frame = 0; frame <= 40; frame++) {
        const t = frame / 40,
          u = 1 - t;
        const x = snake
          ? u ** 3 * a.x + 3 * u ** 2 * t * (a.x - 70) + 3 * u * t ** 2 * (b.x + 90) + t ** 3 * b.x
          : a.x + (b.x - a.x) * t;
        const y = snake
          ? u ** 3 * a.y + 3 * u ** 2 * t * (a.y + 45) + 3 * u * t ** 2 * (b.y - 65) + t ** 3 * b.y
          : a.y + (b.y - a.y) * t;
        setMotion({ team: pending.team, x, y });
        await wait(28);
      }
    }
    setTeams(updated);
    setMotion(null);
    await wait(500);
    nextTurn(updated);
    setBusy(false);
    lock.current = false;
  }
  const question = pending ? QUESTIONS[pending.cell] : null;
  const questionType = pending
    ? LADDERS[pending.cell]
      ? "ladder"
      : SNAKES[pending.cell]
        ? "snake"
        : "event"
    : "event";
  const answerResult =
    pending && pending.selected !== null
      ? resolveAnswer(pending.cell, pending.selected === question?.correct)
      : null;
  const winner = rankTeams(teams)[0];

  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          className="brand"
          disabled={busy}
          onClick={() => (screen === "play" ? setReset(true) : setScreen("setup"))}
          aria-label="Rắn và Thang – Trang thiết lập"
        >
          <span className="brand-mark">
            <svg viewBox="0 0 40 40" fill="none">
              <path
                d="M8 31C3 23 30 29 27 19S8 17 12 9s17-3 17-3"
                stroke="#276b4b"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <ellipse cx="29" cy="7" rx="7" ry="5" fill="#276b4b" />
              <circle cx="31" cy="5" r="1.5" fill="white" />
              <path d="m35 8 4 2" stroke="#e76d78" strokeWidth="2" />
            </svg>
          </span>
          <span>
            RẮN <span className="brand-amp">&</span> THANG<small>HỌC MÀ CHƠI · CHƠI MÀ NHỚ</small>
          </span>
        </button>
        <div className="header-actions">
          {screen === "play" && (
            <span className="round-pill">
              <span className="live-dot" /> Vòng{" "}
              <b>
                {round}
                <span>/{rounds}</span>
              </b>
            </span>
          )}
          {screen !== "setup" && (
            <button className="header-button" disabled={busy} onClick={() => setReset(true)}>
              <Icon name="refresh" />
              <span>Chơi lại</span>
            </button>
          )}
          <button className="header-button rules-button" onClick={() => setRules(true)}>
            <Icon name="book" />
            <span>Luật chơi</span>
          </button>
          <span className="education-tag">GÓC HỌC LỊCH SỬ</span>
        </div>
      </header>
      <main className="main-content">
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
                    Không chỉ về đích trước — <b>kiến thức mới là chìa khóa chiến thắng!</b>
                  </span>
                </div>
              </section>
              <aside className="sidebar">
                {screen === "setup" ? (
                  <>
                    <section className="panel setup-panel">
                      <div className="panel-kicker">
                        <span className="tiny-icon">
                          <Icon name="dice" size={19} />
                        </span>{" "}
                        SẴN SÀNG KHÁM PHÁ?
                      </div>
                      <h2>Thiết lập cuộc chơi</h2>
                      <p className="panel-description">Rủ đồng đội, chọn quân cờ và bắt đầu nào!</p>
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
                            onClick={() => setCount(n)}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="team-preview">
                        {Array.from({ length: count }, (_, i) => (
                          <div key={i}>
                            <Pawn color={COLORS[i]} id={i + 1} />
                            <span>Nhóm {i + 1}</span>
                          </div>
                        ))}
                      </div>
                      <div className="setting-label">
                        <Icon name="refresh" size={18} />
                        <b>Số vòng mỗi nhóm</b>
                      </div>
                      <div className="segment rounds">
                        {[6, 10, 14, 18].map((n) => (
                          <button
                            key={n}
                            aria-pressed={rounds === n}
                            className={rounds === n ? "selected" : ""}
                            onClick={() => setRounds(n)}
                          >
                            {n}
                            <small>vòng</small>
                          </button>
                        ))}
                      </div>
                      <div className="duration">
                        <Icon name="clock" size={16} /> Khoảng {Math.round(count * rounds * 0.45)}–
                        {Math.round(count * rounds * 0.75)} phút <span>·</span> Chung một thiết bị
                      </div>
                      <button className="primary-button start-button" onClick={start}>
                        BẮT ĐẦU TRÒ CHƠI <Icon name="arrow" size={21} />
                      </button>
                      <p className="setup-footnote">Mỗi lượt chơi, thêm một điều hay.</p>
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
                          Thảo luận với nhóm trước khi chọn đáp án. Mỗi câu hỏi là một cơ hội để
                          học!
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <section
                      className="panel turn-panel"
                      style={{ "--team-color": COLORS[active.id - 1] } as React.CSSProperties}
                    >
                      <div className="turn-heading">
                        <div>
                          <div className="panel-kicker">ĐẾN LƯỢT KHÁM PHÁ</div>
                          <h2>
                            Lượt của <span>Nhóm {active.id}</span>
                          </h2>
                        </div>
                        <Pawn color={COLORS[active.id - 1]} id={active.id} />
                      </div>
                      <div className="dice-area">
                        <span className="dice-spark spark-one">+</span>
                        <Dice value={die} rolling={busy && !pending} />
                        <span className="dice-spark spark-two">✧</span>
                      </div>
                      <button
                        className="primary-button roll-button"
                        disabled={busy || !!pending}
                        onClick={roll}
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
                            Nhóm {active.id} đang ở <b>ô {active.position}</b>. Sẵn sàng tiến bước!
                          </>
                        )}
                      </p>
                    </section>
                    <section className="panel activity-panel">
                      <div className="panel-tabs">
                        <button
                          className={tab === "ranking" ? "active" : ""}
                          onClick={() => setTab("ranking")}
                        >
                          <Icon name="trophy" size={17} /> Xếp hạng
                        </button>
                        <button
                          className={tab === "logs" ? "active" : ""}
                          onClick={() => setTab("logs")}
                        >
                          <Icon name="clock" size={17} /> Nhật ký{" "}
                          <span className="log-count">{logs.length}</span>
                        </button>
                      </div>
                      {tab === "ranking" ? (
                        <>
                          <Ranking teams={teams} active={active.id} />
                          <div className="rank-footnote">
                            Xếp hạng theo điểm, sau đó đến vị trí ô.
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
                                  <strong className={log.points < 0 ? "negative" : "positive"}>
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
                        <b>Điểm số có thể thay đổi!</b>
                        <p>Trả lời đúng để leo thang, né rắn và vươn lên dẫn đầu.</p>
                      </div>
                    </div>
                  </>
                )}
              </aside>
            </div>
          </>
        ) : (
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
              Chúc mừng những nhà khám phá lịch sử. Kiến thức là phần thưởng của tất cả chúng ta!
            </p>
            <div className="podium">
              {[1, 0, 2]
                .filter((i) => rankTeams(teams)[i])
                .map((i) => {
                  const team = rankTeams(teams)[i];
                  return (
                    <div key={team.id} className={`podium-place place-${i + 1}`}>
                      <Pawn color={COLORS[team.id - 1]} id={team.id} />
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
              <button className="primary-button" onClick={start}>
                <Icon name="refresh" /> Chơi lại
              </button>
              <button className="secondary-button" onClick={() => setScreen("setup")}>
                Về trang thiết lập <Icon name="arrow" />
              </button>
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <span>
          RẮN & THANG <i>·</i> HÀNH TRÌNH ĐỔI MỚI VIỆT NAM
        </span>
        <span>
          Hiểu quá khứ <i>—</i> Vững bước tương lai <Icon name="star" size={13} />
        </span>
      </footer>
      {toast && (
        <div
          className={`effect-toast ${toast.positive ? "positive-effect" : "negative-effect"}`}
          role="status"
        >
          <span className="effect-icon">
            <Icon name={toast.positive ? "star" : "refresh"} size={27} />
          </span>
          <div>
            <b>{toast.text}</b>
            <span>
              {toast.points > 0 ? "+" : "−"}
              {Math.abs(toast.points)} điểm
            </span>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="modal-backdrop">
          <div
            ref={modalRef}
            className={`modal ${pending ? "question-modal" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {pending && question ? (
              <>
                <div className={`question-header type-${questionType}`}>
                  <span className="question-type">
                    <Icon name={questionType === "event" ? "help" : "star"} size={18} />
                    {questionType === "ladder"
                      ? "THANG CƠ HỘI"
                      : questionType === "snake"
                        ? "RẮN THỬ THÁCH"
                        : "Ô SỰ KIỆN"}
                  </span>
                  <span>Nhóm {pending.team}</span>
                </div>
                <div className="question-body">
                  <div className="question-location">
                    Ô {pending.cell} <span>·</span> {question.title} ({question.year})
                  </div>
                  <h2 id="modal-title">{question.question}</h2>
                  <p className="question-instruction">Cùng thảo luận và chọn một đáp án.</p>
                  <div className="answers">
                    {question.answers.map((answer, i) => {
                      const selected = pending.selected === i,
                        answered = pending.selected !== null,
                        correct = question.correct === i;
                      return (
                        <button
                          key={i}
                          className={`answer ${answered && correct ? "answer-correct" : selected ? "answer-wrong" : ""}`}
                          disabled={answered}
                          onClick={() => selectAnswer(i)}
                        >
                          <span className="answer-letter">{"ABC"[i]}</span>
                          <span>{answer}</span>
                          {answered && (correct || selected) && (
                            <Icon name={correct ? "check" : "close"} size={22} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {answerResult && (
                    <div
                      className={`answer-feedback ${pending.selected === question.correct ? "feedback-correct" : "feedback-wrong"}`}
                      role="status"
                    >
                      <div>
                        <Icon
                          name={pending.selected === question.correct ? "check" : "book"}
                          size={21}
                        />
                        <b>
                          {pending.selected === question.correct
                            ? "Chính xác! Giỏi lắm!"
                            : "Chưa chính xác, cùng ghi nhớ nhé!"}
                        </b>
                        <strong>
                          {answerResult.points > 0 ? "+" : ""}
                          {answerResult.points}
                        </strong>
                      </div>
                      <h3>Giải thích</h3>
                      <p>{question.explanation}</p>
                      {answerResult.destination !== pending.cell && (
                        <p className="movement-hint">
                          Quân cờ sẽ {questionType === "ladder" ? "leo lên" : "trượt xuống"} ô{" "}
                          {answerResult.destination}.
                        </p>
                      )}
                    </div>
                  )}
                  {pending.selected !== null ? (
                    <button className="primary-button continue-button" onClick={continueAnswer}>
                      Tiếp tục hành trình <Icon name="arrow" />
                    </button>
                  ) : (
                    <div className="question-bottom">
                      <Icon name="users" size={16} /> Không cần vội, hãy trao đổi cùng đồng đội.
                    </div>
                  )}
                </div>
              </>
            ) : reset ? (
              <div className="standard-modal">
                <div className="modal-heading">
                  <h2 id="modal-title">Bắt đầu hành trình mới?</h2>
                  <button className="icon-button" onClick={() => setReset(false)} aria-label="Đóng">
                    <Icon name="close" />
                  </button>
                </div>
                <p>
                  Tiến trình và điểm số của trận hiện tại sẽ được xóa. Bạn muốn chơi lại với thiết
                  lập cũ hay chọn lại?
                </p>
                <button className="primary-button" onClick={start}>
                  <Icon name="refresh" /> Chơi lại ngay
                </button>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setReset(false);
                    setScreen("setup");
                    setToast(null);
                  }}
                >
                  Về trang thiết lập
                </button>
              </div>
            ) : (
              <div className="standard-modal">
                <div className="modal-heading">
                  <h2 id="modal-title">Luật chơi Rắn & Thang</h2>
                  <button
                    className="icon-button"
                    onClick={() => setRules(false)}
                    aria-label="Đóng luật chơi"
                  >
                    <Icon name="close" />
                  </button>
                </div>
                <Rules />
                <button className="primary-button" onClick={() => setRules(false)}>
                  Đã hiểu, cùng chơi nào! <Icon name="check" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
