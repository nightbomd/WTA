function ProgressBar({ value }) {
  return (
    <div className="progress-container my-3">
      <div className="progress-header">
        <span>Progress:</span>
        <span style={{ color: "var(--color-blue)" }}>{value}%</span>
      </div>

      <div className="progress-box">
        <div
          className="progress-bar"
          style={{ width: `${value}%`, background: "var(--color-blue)" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;