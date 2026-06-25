import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { label: "Explore", to: "/find" },
  { label: "Tournaments", to: "/find" },
  { label: "Grounds", to: "/find" },
  { label: "Teams", to: "/find" },
  { label: "Communities", to: "/find" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`${styles.nav} ${isLight ? styles.navLight : ""}`}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2c-3.5 3-7 5-7 10a7 7 0 0014 0c0-5-3.5-7-7-10z"
              fill="currentColor" />
          </svg>
        </span>
        Gully<span>Hunt</span>
      </Link>

      {isLight && (
        <div className={styles.links}>
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className={styles.navLink}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.right}>
        {isLight && (
          <button
            className={styles.searchBtn}
            onClick={() => navigate("/find")}
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        )}
        {user ? (
          <>
            <span className={styles.welcome}>Hey, {user.name.split(" ")[0]} 👋</span>
            <Link to="/post" className={`${styles.btn} ${styles.ghost}`}>
              Post Match
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.btn} ${styles.primary}`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`${styles.btn} ${styles.ghost}`}>
              Log in
            </Link>
            <Link to="/register" className={`${styles.btn} ${styles.primary}`}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}