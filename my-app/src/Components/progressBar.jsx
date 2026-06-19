function ProgressBar({ text, value, bg}) {
  return (
    <div className="progress-container my-3">
      <div className="progress-header">
        <span>{text}</span>
        <span>{value}%</span>
      </div>

      <div className="progress-box">
        <div
          className="progress-bar"
          style={{ width: `${value}%`, background: bg }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;