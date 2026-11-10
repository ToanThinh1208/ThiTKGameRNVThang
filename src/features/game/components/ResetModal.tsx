import { Icon } from "@/shared/components";

type ResetModalProps = {
  onClose: () => void;
  onRestart: () => void;
  onSetup: () => void;
};

export function ResetModal({ onClose, onRestart, onSetup }: ResetModalProps) {
  return (
    <div className="standard-modal">
      <div className="modal-heading">
        <h2 id="modal-title">Bắt đầu hành trình mới?</h2>
        <button className="icon-button" onClick={onClose} aria-label="Đóng">
          <Icon name="close" />
        </button>
      </div>
      <p>
        Tiến trình và điểm số của trận hiện tại sẽ được xóa. Bạn muốn chơi lại với thiết lập cũ hay
        chọn lại?
      </p>
      <button className="primary-button" onClick={onRestart}>
        <Icon name="refresh" /> Chơi lại ngay
      </button>
      <button className="secondary-button" onClick={onSetup}>
        Về trang thiết lập
      </button>
    </div>
  );
}

