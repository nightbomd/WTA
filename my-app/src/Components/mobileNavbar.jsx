import Icon from "./icon";

const navItems = [
  { label: "Home", icon: "nav-home" },
  { label: "Stats", icon: "nav-progress" },
  { label: "Profile", icon: "nav-person" },
  { label: "Settings", icon: "nav-settings" },
];

export default function MobileNavbar() {
  return (
    <nav className="mobile-navbar" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <span
          key={item.label}
          className="mobile-navbar__item"
          role="img"
          aria-label={item.label}
        >
          <Icon name={item.icon} size={31} />
        </span>
      ))}
    </nav>
  );
}
