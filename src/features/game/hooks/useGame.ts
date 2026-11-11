import { useEffect, useRef, useState } from "react";
import type { ToastData } from "@/shared/components";
import { wait } from "@/lib/utils/async";
import { QUESTIONS } from "../../../shared/constants/game-data";
import type {
  Log,
  MotionState,
  PendingQuestion,
  ScreenState,
  Team,
} from "../types";
import { connectionPoint } from "../utils/board-geometry";
import {
  advanceTurn,
  getRaceWinner,
  landingPosition,
  makeTeams,
  resolveAnswer,
} from "../utils/game-logic";

export function useGame() {
  const [screen, setScreen] = useState<ScreenState>("setup");
  const [count, setCount] = useState(6);
  const [teams, setTeams] = useState<Team[]>(makeTeams(6));
  const [turn, setTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [die, setDie] = useState(5);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingQuestion | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [tab, setTab] = useState("ranking");
  const [reset, setReset] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [motion, setMotion] = useState<MotionState | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const modalRef = useRef<HTMLDivElement>(null);
  const lock = useRef(false);

  const active = teams[turn];
  const modalOpen = reset || !!pending;

  useEffect(() => {
    if (!modalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = modalRef.current;
    el?.querySelector<HTMLElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) {
        setReset(false);
      }
      if (e.key === "Tab" && el) {
        const buttons = [
          ...el.querySelectorAll<HTMLElement>("button:not(:disabled)"),
        ];
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

  function addLog(
    team: number,
    text: string,
    points?: number,
    correct?: boolean,
  ) {
    setLogs((prev) => [
      { id: Date.now() + Math.random(), team, text, points, correct },
      ...prev,
    ]);
  }

  function nextTurn(updated: Team[]) {
    const next = advanceTurn(updated, turn, round);
    if (next.ended) {
      clearTimeout(timer.current);
      setToast(null);
      setPending(null);
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
    if (
      screen !== "play" ||
      getRaceWinner(teams) ||
      lock.current ||
      busy ||
      pending
    )
      return;
    lock.current = true;
    setBusy(true);
    setToast(null);
    const value = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < 8; i++) {
      setDie(Math.floor(Math.random() * 6) + 1);
      await wait(85);
    }
    setDie(value);
    const destination = landingPosition(active.position, value);
    addLog(active.id, `Tung được ${value} → đến ô ${destination}`);
    for (let step = active.position + 1; step <= destination; step++) {
      setTeams((prev) =>
        prev.map((t) => (t.id === active.id ? { ...t, position: step } : t)),
      );
      await wait(200);
    }
    await wait(250);
    const updated = teams.map((t) =>
      t.id === active.id ? { ...t, position: destination } : t,
    );
    if (destination === 30) {
      const result = updated.map((t) =>
        t.id === active.id ? { ...t, score: t.score + 250, finished: true } : t,
      );
      setTeams(result);
      addLog(active.id, "Về đích đầu tiên! Cuộc đua kết thúc.", 250);
      nextTurn(result);
    } else if (QUESTIONS[destination]) {
      setPending({ cell: destination, team: active.id, selected: null });
    } else {
      const result = updated.map((t) =>
        t.id === active.id ? { ...t, score: t.score + 15 } : t,
      );
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
    if (
      screen !== "play" ||
      !pending ||
      pending.selected === null ||
      lock.current
    )
      return;
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
      for (let frame = 0; frame <= 40; frame++) {
        const point = connectionPoint(pending.cell, frame / 40);
        setMotion({ team: pending.team, ...point });
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

  function goToSetup() {
    setReset(false);
    setScreen("setup");
    setToast(null);
  }

  return {
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
    reset,
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
  };
}
