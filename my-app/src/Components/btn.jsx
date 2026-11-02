export default function Button({
  onClick,
  text,
  bg = "#2564b7fc",
  isDisabled,
  color = "white",
  border = `1px solid ${bg}`,
  className = "",
  style = {},
  type = "button",
  ariaLabel,
}) {
  return (
    <button
      type={type}
      className={`btn app-button p-2 rounded-3 shadow ${className}`.trim()}
      onClick={onClick}
      style={{ background: bg, color, border, ...style }}
      disabled={isDisabled}
      aria-label={ariaLabel}
    >
      {text}
    </button>
  );
}
