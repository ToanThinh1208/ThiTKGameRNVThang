export function Rules() {
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
        Không giới hạn số vòng. <b>Nhóm đầu tiên đến hoặc vượt ô 30 chiến thắng</b> và cuộc đua kết
        thúc ngay, không chờ các nhóm còn lại chơi hết vòng. Điểm có thể âm và được giữ để tổng kết
        kiến thức; các nhóm chưa về đích xếp theo điểm, rồi đến vị trí ô.
      </p>
    </div>
  );
}

