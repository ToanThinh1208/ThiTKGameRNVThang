import { Icon } from "./Icon";

export type ToastData = {
  text: string;
  points: number;
  positive: boolean;
};

export function EffectToast({ toast }: { toast: ToastData | null }) {
  if (!toast) return null;

  return (
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
  );
}

