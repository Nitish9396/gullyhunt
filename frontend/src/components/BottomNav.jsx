import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ""}`
        }
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/find"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ""}`
        }
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Find</span>
      </NavLink>

      {/* Center POST button */}
      <button
        className={styles.postBtn}
        onClick={() => navigate(user ? "/post" : "/login")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ""}`
        }
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </NavLink>

      <NavLink
        to="/login"
        className={({ isActive }) =>
          `${styles.item} ${isActive ? styles.active : ""}`
        }
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
        <span>Login</span>
      </NavLink>
    </div>
  );
}