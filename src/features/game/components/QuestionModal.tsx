import { Icon } from "@/shared/components";
import {
  LADDERS,
  QUESTIONS,
  SNAKES,
} from "../../../shared/constants/game-data";
import type { PendingQuestion } from "../types";
import { resolveAnswer } from "../utils/game-logic";

type QuestionModalProps = {
  pending: PendingQuestion;
  onSelectAnswer: (index: number) => void;
  onContinue: () => void;
};

export function QuestionModal({
  pending,
  onSelectAnswer,
  onContinue,
}: QuestionModalProps) {
  const question = QUESTIONS[pending.cell];
  if (!question) return null;

  const questionType = LADDERS[pending.cell]
    ? "ladder"
    : SNAKES[pending.cell]
      ? "snake"
      : "event";

  const answerResult =
    pending.selected !== null
      ? resolveAnswer(pending.cell, pending.selected === question.correct)
      : null;

  return (
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
        <p className="question-instruction">
          Cùng thảo luận và chọn một đáp án.
        </p>
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
                onClick={() => onSelectAnswer(i)}
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
                Quân cờ sẽ{" "}
                {questionType === "ladder" ? "leo lên" : "trượt xuống"} ô{" "}
                {answerResult.destination}.
              </p>
            )}
          </div>
        )}
        {pending.selected !== null ? (
          <button
            className="primary-button continue-button"
            onClick={onContinue}
          >
            Tiếp tục hành trình <Icon name="arrow" />
          </button>
        ) : (
          <div className="question-bottom">
            <Icon name="users" size={16} /> Không cần vội, hãy trao đổi cùng
            đồng đội.
          </div>
        )}
      </div>
    </>
  );
}
