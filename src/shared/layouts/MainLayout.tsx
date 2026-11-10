import type { ReactNode } from "react";
import { Icon } from "../components/Icon";

type MainLayoutProps = {
  screen: "setup" | "play" | "end";
  round: number;
  busy: boolean;
  onBrandClick: () => void;
  onResetClick: () => void;
  children: ReactNode;
};

export function MainLayout({
  screen,
  round,
  busy,
  onBrandClick,
  onResetClick,
  children,
}: MainLayoutProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <button
          className="brand"
          disabled={busy}
          onClick={onBrandClick}
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
              <span className="live-dot" /> Vòng <b>{round}</b>
            </span>
          )}
          {screen !== "setup" && (
            <button className="header-button" disabled={busy} onClick={onResetClick}>
              <Icon name="refresh" />
              <span>Chơi lại</span>
            </button>
          )}
          <span className="education-tag">GÓC HỌC LỊCH SỬ</span>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer">
        <span>
          RẮN & THANG <i>·</i> HÀNH TRÌNH ĐỔI MỚI VIỆT NAM
        </span>
        <span>
          Hiểu quá khứ <i>—</i> Vững bước tương lai <Icon name="star" size={13} />
        </span>
      </footer>
    </div>
  );
}

