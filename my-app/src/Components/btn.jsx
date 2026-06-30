export default function Button({ onClick, text, bg = "#007bff", isDisabled }) { // Added default blue color fallback
  return (
    <button 
      className="btn text-white p-2 rounded-3 shadow w-100 " // Added text-white for readability
      onClick={onClick} 
      style={{ background: bg }}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}