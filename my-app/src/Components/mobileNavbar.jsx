import Icon from "./icon";

const navItems = [
  { label: "Home", icon: "nav-home" },
  { label: "Stats", icon: "nav-progress" },
  { label: "Profile", icon: "nav-person" },
  { label: "Settings", icon: "nav-settings" },
];

export default function MobileNavbar({ onHomeClick, onProfileClick, onStatsClick, onSettingsClick, activeItem = "Home" }) {
  return (
    <nav className="mobile-navbar" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const handler = {
          Home: onHomeClick,
          Stats: onStatsClick,
          Profile: onProfileClick,
          Settings: onSettingsClick
        };

        const clickHandler = handler[item.label] || null;
        const isActive = activeItem === item.label;

        if (clickHandler) {
          return (
            <button
              key={item.label}
              type="button"
              className={`mobile-navbar__item mobile-navbar__item--interactive ${isActive ? "mobile-navbar__item--active" : ""}`.trim()}
              aria-label={item.label === "Home" ? "Go to home" : `Open ${item.label.toLowerCase()}`}
              aria-current={isActive ? "page" : undefined}
              onClick={clickHandler}
            >
              <Icon name={item.icon} size={31} />
            </button>
          );
        }
    
        return (
          <span
            key={item.label}
            className="mobile-navbar__item"
            role="img"
            aria-label={item.label}
          >
            <Icon name={item.icon} size={31} />
          </span>
        );
      })}
    </nav>
  );
}
