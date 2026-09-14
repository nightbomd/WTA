export default function Button({ onClick, text, bg = "#2564b7fc", isDisabled, color = "white", border = `1px solid ${bg}` }) { // Added default blue color fallback
  return (
    <button 
      className="btn p-2 rounded-3 shadow"
      onClick={onClick}
      style={{ background: bg, color, border }}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}