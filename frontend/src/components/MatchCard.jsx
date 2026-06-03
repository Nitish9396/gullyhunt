import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { joinMatch } from "../api";
import toast from "react-hot-toast";
import styles from "./MatchCard.module.css";

const SPORT_EMOJI = {
  cricket: "🏏", football: "⚽", badminton: "🏸",
  basketball: "🏀", kabaddi: "🤼", volleyball: "🏐",
  table_tennis: "🏓", other: "🎯",
};

const SPORT_COLOR = {
  cricket: "#ff6b2b", football: "#4d9fff", badminton: "#00ffb3",
  basketball: "#ff6b2b", kabaddi: "#ff3d7f", volleyball: "#b6ff00",
  table_tennis: "#4d9fff", other: "#888899",
};

export default function MatchCard({ match, onJoined }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const spotsLeft = match.totalPlayersNeeded - (match.playersJoined?.length || 0);
  const isFull = spotsLeft <= 0;
  const fillPct = Math.min(100, ((match.playersJoined?.length || 0) / match.totalPlayersNeeded) * 100);
  const color = SPORT_COLOR[match.sport] || "#888899";
  const alreadyJoined = user && match.playersJoined?.includes(user._id);

  const handleJoin = async (e) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    try {
      await joinMatch(match._id);
      toast.success("Joined! See you on the field 🎉");
      if (onJoined) onJoined();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not join");
    }
  };

  // ✅ ADD THIS FUNCTION
  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const text =
      `🏏 *${match.title}*\n\n` +
      `📍 *Location:* ${match.locality}, ${match.city}\n` +
      `🕐 *When:* ${new Date(match.date).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short",
      })} at ${match.time}\n` +
      `👥 *Spots left:* ${spotsLeft} of ${match.totalPlayersNeeded}\n` +
      `💰 *Entry:* ${match.entryType === "free" ? "FREE 🎉" : `₹${match.entryFee}`}\n` +
      `📞 *Contact:* ${match.contactNumber}\n\n` +
      `👉 Join now: ${window.location.origin}/match/${match._id}\n\n` +
      `_GullyHunt — Find your game anywhere in India_ 🇮🇳`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const formatDate = (d) => {
    const date = new Date(d);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/match/${match._id}`)}
    >
      <div className={styles.top}>
        <div
          className={styles.badge}
          style={{
            background: `${color}18`,
            border: `1px solid ${color}40`,
          }}
        >
          <span>{SPORT_EMOJI[match.sport]}</span>
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{match.title}</div>
          <div className={styles.org}>
            by {match.organizerName} · {match.locality}
          </div>
          <div className={styles.tags}>
            <span
              className={`${styles.tag} ${
                match.entryType === "free" ? styles.free : styles.paid
              }`}
            >
              {match.entryType === "free" ? "FREE" : `₹${match.entryFee}`}
            </span>
            <span
              className={`${styles.tag} ${isFull ? styles.full : styles.open}`}
            >
              {isFull ? "Full" : "Open"}
            </span>
            {match.venueType === "gully" && (
              <span className={`${styles.tag} ${styles.gully}`}>Gully</span>
            )}
            <span className={`${styles.tag} ${styles.sport}`}>
              {match.sport}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.meta}>
          <span>🕐 {formatDate(match.date)} {match.time}</span>
        </div>
        <div className={styles.meta}>
          <span>📍 {match.city}</span>
        </div>
        <div className={styles.players}>
          <span>
            {match.playersJoined?.length || 0}/{match.totalPlayersNeeded}
          </span>
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{
                width: `${fillPct}%`,
                background: isFull ? "#ff3d7f" : color,
              }}
            />
          </div>
        </div>

        {/* ✅ ADD WHATSAPP BUTTON HERE */}
        <button
          className={styles.waBtn}
          onClick={handleWhatsAppShare}
          title="Share on WhatsApp"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>

        <button
          className={`${styles.joinBtn} ${
            isFull || alreadyJoined ? styles.disabled : ""
          }`}
          onClick={handleJoin}
          disabled={isFull || alreadyJoined}
        >
          {alreadyJoined ? "Joined ✓" : isFull ? "Full" : "Join"}
        </button>
      </div>
    </div>
  );
}