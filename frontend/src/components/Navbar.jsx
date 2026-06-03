import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        Gully<span>Hunt</span>
      </Link>
      <div className={styles.right}>
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
              Login
            </Link>
            <Link to="/register" className={`${styles.btn} ${styles.primary}`}>
              Join Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}