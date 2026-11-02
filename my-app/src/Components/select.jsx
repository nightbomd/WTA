export default function Select({ options, value, onChange, id, ariaLabel, className = "", style = {} }) {
  return (
    <select
        id={id}
        aria-label={ariaLabel}
        className={className}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#161616",
          border: "1.5px solid #2a2a2a",
          borderRadius: 10,
          color: "#f0f0f0",
          fontSize: 15,
          padding: "13px 14px",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
          transition: "border-color 0.15s ease",
          margin: "10px 0",
          ...style,
        }}
      >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
