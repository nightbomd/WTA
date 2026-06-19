export default function Button({ onClick, text, bg = "#007bff" }) { // Added default blue color fallback
  return (
    <button 
      className="btn text-white p-2 rounded-3 shadow" // Added text-white for readability
      onClick={onClick} 
      style={{ background: bg }}
    >
      {text}
    </button>
  );
}