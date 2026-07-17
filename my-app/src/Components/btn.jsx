export default function Button({ onClick, text, bg = "#2564b7fc", isDisabled, color = "white", border }) { // Added default blue color fallback
  return (
    <button 
      className="btn p-2 rounded-3 shadow w-100"
      onClick={onClick}
      style={{ background: bg, color, border: `1px solid ${border}` }}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}