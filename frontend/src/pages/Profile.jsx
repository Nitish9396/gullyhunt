import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Profile.module.css";

const SPORT_EMOJI = {
  cricket: "🏏", football: "⚽", badminton: "🏸",
  basketball: "🏀", kabaddi: "🤼", volleyball: "🏐",
  table_tennis: "🏓", other: "🎯",
};

const ALL_SPORTS = [
  "cricket", "football", "badminton",
  "basketball", "kabaddi", "volleyball",
];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className={styles.guestPage}>
        <div className={styles.guestIcon}>🏃</div>
        <h2 className={`heading ${styles.guestTitle}`}>
          Join GullyHunt
        </h2>
        <p className={styles.guestSub}>
          Create an account to post matches, join games and track your
          stats across India
        </p>
        <button
          className={styles.btnNeon}
          onClick={() => navigate("/register")}
        >
          Create Free Account
        </button>
        <button
          className={styles.btnOutline}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    );
  }

  const roleLabel = {
    player: "Player 🏃",
    organizer: "Organizer 📣",
    turf_owner: "Turf Owner 🏟️",
    stadium_owner: "Stadium Owner 🏛️",
  };

  return (
    <div className={styles.page}>

      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className={`heading ${styles.name}`}>{user.name}</h1>
          <p className={styles.role}>{roleLabel[user.role] || "Player"}</p>
          {user.city && (
            <p className={styles.city}>📍 {user.city}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: "var(--neon)" }}>
            {user.gamesJoined?.length || 0}
          </div>
          <div className={styles.statLabel}>Games Joined</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: "var(--orange)" }}>
            {user.gamesPosted?.length || 0}
          </div>
          <div className={styles.statLabel}>Games Posted</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum} style={{ color: "var(--blue)" }}>
            {user.city ? 1 : 0}
          </div>
          <div className={styles.statLabel}>Cities</div>
        </div>
      </div>

      {/* Info */}
      <div className={styles.infoCard}>
        <h3 className={styles.cardTitle}>Account Info</h3>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoVal}>{user.email}</span>
        </div>
        {user.phone && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone</span>
            <span className={styles.infoVal}>{user.phone}</span>
          </div>
        )}
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Role</span>
          <span className={styles.infoVal}>
            {roleLabel[user.role] || "Player"}
          </span>
        </div>
      </div>

      {/* Favourite Sports */}
      <div className={styles.infoCard}>
        <h3 className={styles.cardTitle}>Favourite Sports</h3>
        <div className={styles.sportsRow}>
          {ALL_SPORTS.map((s) => (
            <div
              key={s}
              className={`${styles.sportChip} ${
                user.favoriteSports?.includes(s) ? styles.sportActive : ""
              }`}
            >
              {SPORT_EMOJI[s]} {s}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          className={styles.postBtn}
          onClick={() => navigate("/post")}
        >
          🚀 Post a Match
        </button>
        <button
          className={styles.findBtn}
          onClick={() => navigate("/find")}
        >
          🔍 Find Games
        </button>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

    </div>
  );
}