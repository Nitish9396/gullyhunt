import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch, joinMatch, leaveMatch, deleteMatch } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./MatchDetail.module.css";

const SPORT_EMOJI = {
  cricket: "🏏",
  football: "⚽",
  badminton: "🏸",
  basketball: "🏀",
  kabaddi: "🤼",
  volleyball: "🏐",
  table_tennis: "🏓",
  other: "🎯",
};

export default function MatchDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getMatch(id)
      .then(({ data }) => setMatch(data))
      .catch(() => toast.error("Match not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading match...</div>;
  }

  if (!match) {
    return <div className={styles.loading}>Match not found</div>;
  }

  const spotsLeft = match.totalPlayersNeeded - match.playersJoined.length;
  const isFull = spotsLeft <= 0;
  const isOrganizer =
    user?._id === match.organizer?._id || user?._id === match.organizer;
  const hasJoined =
    user && match.playersJoined.some((p) => (p._id || p) === user._id);
  const fillPct = Math.min(
    100,
    (match.playersJoined.length / match.totalPlayersNeeded) * 100
  );

  const entryLabel =
    match.entryType === "free" ? "FREE" : "Rs." + match.entryFee;

  const spotsLabel =
    spotsLeft + " spot" + (spotsLeft !== 1 ? "s" : "") + " remaining";

  const dateLabel = new Date(match.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const handleJoin = async () => {
    if (!user) return navigate("/login");
    setActionLoading(true);
    try {
      await joinMatch(id);
      toast.success("Joined! See you on the field");
      const { data } = await getMatch(id);
      setMatch(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not join");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await leaveMatch(id);
      toast.success("Left the match");
      const { data } = await getMatch(id);
      setMatch(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this match?")) return;
    try {
      await deleteMatch(id);
      toast.success("Match deleted");
      navigate("/find");
    } catch {
      toast.error("Could not delete");
    }
  };

  const handleWhatsAppShare = () => {
    const lines = [
      match.title,
      "",
      "Sport: " + match.sport.replace("_", " "),
      "Location: " + match.locality + ", " + match.city,
      "Date: " + dateLabel + " at " + match.time,
      "Players: " + match.playersJoined.length + " of " + match.totalPlayersNeeded + " joined",
      "Entry: " + entryLabel,
      "Contact: " + match.contactNumber,
      "",
      "Join: " + window.location.href,
      "",
      "GullyHunt - Find your game anywhere in India",
    ];
    const text = lines.join("\n");
    window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: match.title,
        text: "Join this match on GullyHunt!",
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleContactOrganizer = () => {
    const phone = match.contactNumber.replace(/\s/g, "");
    const msg = "Hi! I want to join " + match.title + " on GullyHunt.";
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(msg), "_blank");
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate(-1)}>
        Back
      </button>

      <div className={styles.card}>

        <div className={styles.cardHeader}>
          <div className={styles.sportBig}>
            {SPORT_EMOJI[match.sport]}
          </div>
          <div>
            <h1 className={styles.title}>{match.title}</h1>
            <p className={styles.org}>
              Organized by <strong>{match.organizerName}</strong>
            </p>
          </div>
        </div>

        <div className={styles.tags}>
          <span
            className={
              match.entryType === "free"
                ? styles.tagFree
                : styles.tagPaid
            }
          >
            {entryLabel}
          </span>
          <span className={isFull ? styles.tagFull : styles.tagOpen}>
            {isFull ? "Full" : "Open"}
          </span>
          <span className={styles.tagSport}>
            {match.sport.replace("_", " ")}
          </span>
          <span className={styles.tagVenue}>{match.venueType}</span>
          <span className={styles.tagSkill}>
            {match.skillLevel === "all" ? "All levels" : match.skillLevel}
          </span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>🕐</span>
            <div>
              <div className={styles.infoLabel}>Date and Time</div>
              <div className={styles.infoVal}>
                {dateLabel} at {match.time}
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📍</span>
            <div>
              <div className={styles.infoLabel}>Location</div>
              <div className={styles.infoVal}>
                {match.locality}, {match.city}
              </div>
            </div>
          </div>

          {match.address && (
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🗺️</span>
              <div>
                <div className={styles.infoLabel}>Address</div>
                <div className={styles.infoVal}>{match.address}</div>
              </div>
            </div>
          )}

          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📞</span>
            <div>
              <div className={styles.infoLabel}>Contact</div>
              <div className={styles.infoVal}>{match.contactNumber}</div>
            </div>
          </div>
        </div>

        <div className={styles.playersSection}>
          <div className={styles.playersTop}>
            <span className={styles.playersLabel}>Players</span>
            <span className={styles.playersCount}>
              {match.playersJoined.length} / {match.totalPlayersNeeded}
            </span>
          </div>
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{
                width: fillPct + "%",
                background: isFull ? "#ff3d7f" : "#b6ff00",
              }}
            />
          </div>
          <p className={styles.spotsText}>
            {isFull ? "No spots left" : spotsLabel}
          </p>
        </div>

        {match.description && (
          <div className={styles.desc}>
            <div className={styles.descLabel}>Details</div>
            <p>{match.description}</p>
          </div>
        )}

        <div className={styles.shareSection}>
          <p className={styles.shareLabel}>Share this match</p>
          <div className={styles.shareBtns}>
            <button
              className={styles.waBtnLg}
              onClick={handleWhatsAppShare}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </button>
            <button className={styles.copyBtn} onClick={handleCopyLink}>
              Copy Link
            </button>
            <button
              className={styles.nativeBtn}
              onClick={handleNativeShare}
            >
              Share
            </button>
          </div>
        </div>

        {match.entryType !== "free" && !hasJoined && !isOrganizer && (
          <div className={styles.payComingSoon}>
            <div className={styles.payComingSoonBadge}>
              Coming Soon
            </div>
            <h4 className={styles.payComingSoonTitle}>
              Online Payment
            </h4>
            <p className={styles.payComingSoonDesc}>
              Pay entry fee online via UPI, Card or Netbanking.
              For now contact the organizer directly.
            </p>
            <div className={styles.payMethods}>
              <span>UPI</span>
              <span>Card</span>
              <span>Netbanking</span>
              <span>Wallets</span>
            </div>
            <div className={styles.payBottom}>
              <div className={styles.payAmount}>
                Entry: Rs.{match.entryFee}
              </div>
              <button
                className={styles.payWaBtn}
                onClick={handleContactOrganizer}
              >
                Contact Organizer
              </button>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {isOrganizer ? (
            <>
              <button
                className={styles.editBtn}
                onClick={() => navigate("/post")}
              >
                Edit Match
              </button>
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          ) : hasJoined ? (
            <button
              className={styles.leaveBtn}
              onClick={handleLeave}
              disabled={actionLoading}
            >
              {actionLoading ? "..." : "Leave Match"}
            </button>
          ) : (
            <button
              className={
                isFull
                  ? styles.joinBtnDisabled
                  : styles.joinBtn
              }
              onClick={handleJoin}
              disabled={isFull || actionLoading}
            >
              {actionLoading
                ? "Joining..."
                : isFull
                ? "Match Full"
                : "Join This Match"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}