export default function Icon({ name, size = 20, className = "", style, ...props }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle", ...style }}
      {...props}
    >
      <use href={`${import.meta.env.BASE_URL}ui-icons.svg#${name}`} />
    </svg>
  );
}
