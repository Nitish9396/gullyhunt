import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMatch } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./PostMatch.module.css";

const SPORTS = [
  "cricket", "football", "badminton", "basketball",
  "kabaddi", "volleyball", "table_tennis", "other"
];

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Lucknow",
  "Nagpur", "Surat", "Patna", "Bhopal", "Other"
];

const SPORT_EMOJI = {
  cricket: "🏏", football: "⚽", badminton: "🏸",
  basketball: "🏀", kabaddi: "🤼", volleyball: "🏐",
  table_tennis: "🏓", other: "🎯",
};

export default function PostMatch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    sport: "cricket",
    city: "",
    locality: "",
    address: "",
    date: "",
    time: "",
    totalPlayersNeeded: "",
    entryType: "free",
    entryFee: "",
    skillLevel: "all",
    venueType: "gully",
    contactNumber: user?.phone || "",
    description: "",
  });

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <div className={styles.promptIcon}>🔒</div>
        <h2>Login Required</h2>
        <p>You need to be logged in to post a match</p>
        <button
          className={styles.loginBtn}
          onClick={() => navigate("/login")}
        >
          Login / Register
        </button>
      </div>
    );
  }

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async () => {
    const required = [
      "title", "sport", "city", "locality",
      "date", "time", "totalPlayersNeeded", "contactNumber"
    ];
    for (const f of required) {
      if (!form[f]) {
        return toast.error(
          `Please fill in ${f.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
      }
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        totalPlayersNeeded: Number(form.totalPlayersNeeded),
        entryFee: Number(form.entryFee) || 0,
      };
      const { data } = await createMatch(payload);
      toast.success("Match posted! Players can now find it 🎉");
      navigate(`/match/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="section-tag">Post a Game</div>
      <h1 className={`heading ${styles.h1}`}>Create a Match</h1>
      <p className={styles.sub}>
        Let players in your city know a game is happening
      </p>

      <div className={styles.form}>

        {/* SPORT */}
        <div className={styles.group}>
          <label className={styles.label}>Sport *</label>
          <div className={styles.sportBtns}>
            {SPORTS.map((s) => (
              <button
                key={s}
                className={`${styles.sportBtn} ${
                  form.sport === s ? styles.sportSel : ""
                }`}
                onClick={() => set("sport", s)}
              >
                {SPORT_EMOJI[s]} {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* TITLE + CONTACT */}
        <div className={styles.row2}>
          <div className={styles.group}>
            <label className={styles.label}>Match Title *</label>
            <input
              placeholder="e.g. Gully T20 — Sunday Special"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Contact Number *</label>
            <input
              placeholder="+91 XXXXX XXXXX"
              value={form.contactNumber}
              onChange={(e) => set("contactNumber", e.target.value)}
            />
          </div>
        </div>

        {/* CITY + LOCALITY */}
        <div className={styles.row2}>
          <div className={styles.group}>
            <label className={styles.label}>City *</label>
            <select
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Locality / Area *</label>
            <input
              placeholder="e.g. Bandra West"
              value={form.locality}
              onChange={(e) => set("locality", e.target.value)}
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className={styles.group}>
          <label className={styles.label}>Full Address / Landmark</label>
          <input
            placeholder="Ground name, street, near landmark"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </div>

        {/* DATE + TIME */}
        <div className={styles.row2}>
          <div className={styles.group}>
            <label className={styles.label}>Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Time *</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
            />
          </div>
        </div>

        {/* PLAYERS + ENTRY */}
        <div className={styles.row2}>
          <div className={styles.group}>
            <label className={styles.label}>Players Needed *</label>
            <input
              type="number"
              placeholder="e.g. 11"
              min="2"
              max="100"
              value={form.totalPlayersNeeded}
              onChange={(e) => set("totalPlayersNeeded", e.target.value)}
            />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Entry Type</label>
            <select
              value={form.entryType}
              onChange={(e) => set("entryType", e.target.value)}
            >
              <option value="free">Free</option>
              <option value="paid_per_head">Paid per head</option>
              <option value="paid_per_team">Paid per team</option>
            </select>
          </div>
        </div>

        {form.entryType !== "free" && (
          <div className={styles.group}>
            <label className={styles.label}>Entry Fee (₹)</label>
            <input
              type="number"
              placeholder="Amount in rupees"
              value={form.entryFee}
              onChange={(e) => set("entryFee", e.target.value)}
            />
          </div>
        )}

        {/* SKILL + VENUE */}
        <div className={styles.row2}>
          <div className={styles.group}>
            <label className={styles.label}>Skill Level</label>
            <select
              value={form.skillLevel}
              onChange={(e) => set("skillLevel", e.target.value)}
            >
              <option value="all">All levels welcome</option>
              <option value="beginner">Beginner friendly</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced / Competitive</option>
            </select>
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Venue Type</label>
            <select
              value={form.venueType}
              onChange={(e) => set("venueType", e.target.value)}
            >
              <option value="gully">Gully / Open ground</option>
              <option value="turf">Rented Turf</option>
              <option value="stadium">Private Stadium</option>
              <option value="academy">Sports Academy</option>
              <option value="school">School / College Ground</option>
              <option value="park">Park</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className={styles.group}>
          <label className={styles.label}>Extra Details</label>
          <textarea
            placeholder="Anything players should know — equipment needed, dress code, how to reach, etc."
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <button
          className={styles.submit}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "🚀 Post This Match"}
        </button>

      </div>
    </div>
  );
}