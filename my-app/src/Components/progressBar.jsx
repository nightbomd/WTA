function ProgressBar({ text, value, bg }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div
      className="progress-container my-3"
      role="progressbar"
      aria-label={text || "Progress"}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.floor(safeValue)}
    >
      <div className="progress-header">
        <span>{text}</span>
        <span>{Math.floor(safeValue)}%</span>
      </div>

      <div className="progress-box">
        <div
          className="progress-bar"
          style={{ width: `${safeValue}%`, background: bg }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
