import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getMatches } from "../api";
import MatchCard from "../components/MatchCard";
import styles from "./FindGame.module.css";

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Lucknow",
  "Nagpur", "Surat", "Patna", "Bhopal"
];

const SPORTS = [
  "cricket", "football", "badminton", "basketball",
  "kabaddi", "volleyball", "table_tennis", "other"
];

export default function FindGame() {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    sport: searchParams.get("sport") || "",
    entryType: "",
    skillLevel: "",
  });

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.sport) params.sport = filters.sport;
      if (filters.entryType) params.entryType = filters.entryType;
      if (filters.skillLevel) params.skillLevel = filters.skillLevel;
      const { data } = await getMatches(params);
      setMatches(data);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filters]);

  const handleFilter = (key, val) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === val ? "" : val,
    }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className="section-tag">Discover</div>
        <h1 className={`heading ${styles.h1}`}>Games Near You</h1>
      </div>

      {/* FILTERS */}
      <div className={styles.filters}>
        <select
          className={styles.citySelect}
          value={filters.city}
          onChange={(e) =>
            setFilters((p) => ({ ...p, city: e.target.value }))
          }
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <div className={styles.chips}>
          {SPORTS.map((s) => (
            <button
              key={s}
              className={`${styles.chip} ${
                filters.sport === s ? styles.chipActive : ""
              }`}
              onClick={() => handleFilter("sport", s)}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className={styles.chips}>
          {["free", "paid_per_head"].map((t) => (
            <button
              key={t}
              className={`${styles.chip} ${
                filters.entryType === t ? styles.chipActive : ""
              }`}
              onClick={() => handleFilter("entryType", t)}
            >
              {t === "free" ? "Free" : "Paid"}
            </button>
          ))}
          {["beginner", "intermediate", "advanced"].map((l) => (
            <button
              key={l}
              className={`${styles.chip} ${
                filters.skillLevel === l ? styles.chipActive : ""
              }`}
              onClick={() => handleFilter("skillLevel", l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* MAP COMING SOON */}
<div className={styles.mapComingSoon}>
  <div className={styles.mapMock}>
    {/* Mock map pins */}
    <div className={styles.mockPin} style={{ top: "30%", left: "25%" }}>
      <div className={styles.pinBubble} style={{ background: "rgba(255,107,43,0.9)" }}>🏏 Cricket</div>
      <div className={styles.pinTail} style={{ borderTopColor: "rgba(255,107,43,0.9)" }} />
    </div>
    <div className={styles.mockPin} style={{ top: "45%", left: "55%" }}>
      <div className={styles.pinBubble} style={{ background: "rgba(77,159,255,0.9)" }}>⚽ Football</div>
      <div className={styles.pinTail} style={{ borderTopColor: "rgba(77,159,255,0.9)" }} />
    </div>
    <div className={styles.mockPin} style={{ top: "60%", left: "70%" }}>
      <div className={styles.pinBubble} style={{ background: "rgba(0,255,179,0.9)" }}>🏸 Badminton</div>
      <div className={styles.pinTail} style={{ borderTopColor: "rgba(0,255,179,0.9)" }} />
    </div>
    <div className={styles.mockPin} style={{ top: "25%", left: "65%" }}>
      <div className={styles.pinBubble} style={{ background: "rgba(255,61,127,0.9)" }}>🤼 Kabaddi</div>
      <div className={styles.pinTail} style={{ borderTopColor: "rgba(255,61,127,0.9)" }} />
    </div>
    <div className={styles.mockPin} style={{ top: "70%", left: "35%" }}>
      <div className={styles.pinBubble} style={{ background: "rgba(182,255,0,0.9)", color: "#000" }}>🏀 Basketball</div>
      <div className={styles.pinTail} style={{ borderTopColor: "rgba(182,255,0,0.9)" }} />
    </div>
    {/* Mock roads */}
    <div className={styles.mockRoad} style={{ top: "50%", left: 0, right: 0, height: "6px" }} />
    <div className={styles.mockRoad} style={{ left: "40%", top: 0, bottom: 0, width: "5px" }} />
    <div className={styles.mockRoad} style={{ top: "30%", left: 0, right: 0, height: "3px", opacity: 0.5 }} />
    {/* Grid lines */}
    <div className={styles.mapGrid} />
    {/* Coming Soon Overlay */}
    <div className={styles.mapOverlay}>
      <div className={styles.mapOverlayContent}>
        <div className={styles.comingSoonBadge}>🗺️ Coming Soon</div>
        <h3 className={styles.mapOverlayTitle}>Live Map View</h3>
        <p className={styles.mapOverlayDesc}>
          See all games on an interactive map.<br />
          Find matches within 5km of you in real time.
        </p>
        <div className={styles.mapFeatures}>
          <span>📍 GPS detection</span>
          <span>🔍 Search by area</span>
          <span>📏 Distance filter</span>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* RESULTS */}
      <div className={styles.results}>
        <div className={styles.resultsHeader}>
          <span className={styles.count}>
            {loading
              ? "Loading..."
              : `${matches.length} game${matches.length !== 1 ? "s" : ""} found`}
          </span>
          <button className={styles.refreshBtn} onClick={fetchMatches}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏟️</div>
            <h3>No games found</h3>
            <p>
              Try changing your filters or be the first to post a game
              in your city!
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {matches.map((m) => (
              <MatchCard key={m._id} match={m} onJoined={fetchMatches} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}