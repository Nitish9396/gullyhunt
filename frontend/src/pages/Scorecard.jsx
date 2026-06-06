import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createScorecard } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Scorecard.module.css";

export default function Scorecard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    matchName: "",
    team1: "",
    team2: "",
    playersPerTeam: 11,
    totalOvers: 10,
    tossWinner: "",
    tossChoice: "bat",
    team1Players: [],
    team2Players: [],
  });

  const [team1Input, setTeam1Input] = useState("");
  const [team2Input, setTeam2Input] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const addPlayer = (team) => {
    if (team === 1) {
      if (!team1Input.trim()) return;
      if (form.team1Players.length >= form.playersPerTeam) {
        return toast.error("Team is full!");
      }
      set("team1Players", [...form.team1Players, team1Input.trim()]);
      setTeam1Input("");
    } else {
      if (!team2Input.trim()) return;
      if (form.team2Players.length >= form.playersPerTeam) {
        return toast.error("Team is full!");
      }
      set("team2Players", [...form.team2Players, team2Input.trim()]);
      setTeam2Input("");
    }
  };

  const removePlayer = (team, index) => {
    if (team === 1) {
      set("team1Players", form.team1Players.filter((_, i) => i !== index));
    } else {
      set("team2Players", form.team2Players.filter((_, i) => i !== index));
    }
  };

  const handleStart = async () => {
    if (!form.matchName) return toast.error("Enter match name");
    if (!form.team1 || !form.team2) return toast.error("Enter both team names");
    if (form.team1Players.length < 2) return toast.error("Add at least 2 players to Team 1");
    if (form.team2Players.length < 2) return toast.error("Add at least 2 players to Team 2");
    if (!form.tossWinner) return toast.error("Select toss winner");

    if (!user) return navigate("/login");

    setLoading(true);
    try {
      const { data } = await createScorecard(form);
      toast.success("Scorecard created!");
      navigate("/scorecard/live/" + data.shareCode);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create scorecard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="section-tag">Cricket</div>
      <h1 className={styles.h1}>Create Scorecard</h1>
      <p className={styles.sub}>Setup your match and start scoring live</p>

      {/* STEP INDICATORS */}
      <div className={styles.steps}>
        {["Match Info", "Players", "Toss"].map((s, i) => (
          <div
            key={s}
            className={`${styles.stepItem} ${step === i + 1 ? styles.stepActive : ""} ${step > i + 1 ? styles.stepDone : ""}`}
            onClick={() => step > i + 1 && setStep(i + 1)}
          >
            <div className={styles.stepNum}>{step > i + 1 ? "✓" : i + 1}</div>
            <div className={styles.stepLabel}>{s}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>

        {/* STEP 1 — MATCH INFO */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2 className={styles.cardTitle}>Match Details</h2>

            <div className={styles.group}>
              <label className={styles.label}>Match Name</label>
              <input
                placeholder="e.g. Gully World Cup Final"
                value={form.matchName}
                onChange={(e) => set("matchName", e.target.value)}
              />
            </div>

            <div className={styles.row2}>
              <div className={styles.group}>
                <label className={styles.label}>Team 1 Name</label>
                <input
                  placeholder="e.g. Mumbai Lions"
                  value={form.team1}
                  onChange={(e) => set("team1", e.target.value)}
                />
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Team 2 Name</label>
                <input
                  placeholder="e.g. Delhi Tigers"
                  value={form.team2}
                  onChange={(e) => set("team2", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.group}>
                <label className={styles.label}>Players per Team</label>
                <select
                  value={form.playersPerTeam}
                  onChange={(e) => set("playersPerTeam", Number(e.target.value))}
                >
                  {[2,3,4,5,6,7,8,9,10,11].map((n) => (
                    <option key={n} value={n}>{n} players</option>
                  ))}
                </select>
              </div>
              <div className={styles.group}>
                <label className={styles.label}>Number of Overs</label>
                <select
                  value={form.totalOvers}
                  onChange={(e) => set("totalOvers", Number(e.target.value))}
                >
                  {[1,2,3,4,5,6,8,10,15,20,50].map((n) => (
                    <option key={n} value={n}>{n} overs</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className={styles.nextBtn}
              onClick={() => {
                if (!form.matchName || !form.team1 || !form.team2) {
                  return toast.error("Fill all fields");
                }
                setStep(2);
              }}
            >
              Next: Add Players →
            </button>
          </div>
        )}

        {/* STEP 2 — PLAYERS */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h2 className={styles.cardTitle}>Add Players</h2>

            <div className={styles.teamsRow}>

              {/* TEAM 1 */}
              <div className={styles.teamBox}>
                <div className={styles.teamName}
                  style={{ color: "var(--neon)" }}>
                  {form.team1}
                  <span className={styles.teamCount}>
                    {form.team1Players.length}/{form.playersPerTeam}
                  </span>
                </div>
                <div className={styles.playerInputRow}>
                  <input
                    placeholder="Player name"
                    value={team1Input}
                    onChange={(e) => setTeam1Input(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPlayer(1)}
                  />
                  <button className={styles.addBtn} onClick={() => addPlayer(1)}>+</button>
                </div>
                <div className={styles.playerList}>
                  {form.team1Players.map((p, i) => (
                    <div key={i} className={styles.playerItem}>
                      <span className={styles.playerNum}>{i + 1}</span>
                      <span className={styles.playerName}>{p}</span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removePlayer(1, i)}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TEAM 2 */}
              <div className={styles.teamBox}>
                <div className={styles.teamName}
                  style={{ color: "var(--orange)" }}>
                  {form.team2}
                  <span className={styles.teamCount}>
                    {form.team2Players.length}/{form.playersPerTeam}
                  </span>
                </div>
                <div className={styles.playerInputRow}>
                  <input
                    placeholder="Player name"
                    value={team2Input}
                    onChange={(e) => setTeam2Input(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPlayer(2)}
                  />
                  <button
                    className={styles.addBtn}
                    style={{ background: "var(--orange)" }}
                    onClick={() => addPlayer(2)}
                  >+</button>
                </div>
                <div className={styles.playerList}>
                  {form.team2Players.map((p, i) => (
                    <div key={i} className={styles.playerItem}>
                      <span className={styles.playerNum}>{i + 1}</span>
                      <span className={styles.playerName}>{p}</span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removePlayer(2, i)}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className={styles.navBtns}>
              <button className={styles.backBtn} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className={styles.nextBtn}
                onClick={() => {
                  if (form.team1Players.length < 2) {
                    return toast.error("Add at least 2 players to Team 1");
                  }
                  if (form.team2Players.length < 2) {
                    return toast.error("Add at least 2 players to Team 2");
                  }
                  setStep(3);
                }}
              >
                Next: Toss →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — TOSS */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h2 className={styles.cardTitle}>Toss</h2>

            <div className={styles.group}>
              <label className={styles.label}>Toss Winner</label>
              <div className={styles.tossTeams}>
                <button
                  className={`${styles.tossBtn} ${form.tossWinner === form.team1 ? styles.tossSel : ""}`}
                  onClick={() => set("tossWinner", form.team1)}
                >
                  {form.team1}
                </button>
                <button
                  className={`${styles.tossBtn} ${form.tossWinner === form.team2 ? styles.tossSel : ""}`}
                  onClick={() => set("tossWinner", form.team2)}
                >
                  {form.team2}
                </button>
              </div>
            </div>

            {form.tossWinner && (
              <div className={styles.group}>
                <label className={styles.label}>
                  {form.tossWinner} chose to
                </label>
                <div className={styles.tossTeams}>
                  <button
                    className={`${styles.tossBtn} ${form.tossChoice === "bat" ? styles.tossSel : ""}`}
                    onClick={() => set("tossChoice", "bat")}
                  >
                    🏏 Bat First
                  </button>
                  <button
                    className={`${styles.tossBtn} ${form.tossChoice === "bowl" ? styles.tossSel : ""}`}
                    onClick={() => set("tossChoice", "bowl")}
                  >
                    ⚡ Bowl First
                  </button>
                </div>
              </div>
            )}

            {form.tossWinner && (
              <div className={styles.tossResult}>
                <span>
                  {form.tossWinner} won the toss and chose to{" "}
                  <strong style={{ color: "var(--neon)" }}>
                    {form.tossChoice === "bat" ? "bat" : "bowl"} first
                  </strong>
                </span>
              </div>
            )}

            <div className={styles.navBtns}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>
                ← Back
              </button>
              <button
                className={styles.startBtn}
                onClick={handleStart}
                disabled={loading || !form.tossWinner}
              >
                {loading ? "Creating..." : "🏏 Start Match"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* VIEW BY CODE */}
      <div className={styles.viewCode}>
        <p>Have a share code?</p>
        <div className={styles.codeInputRow}>
          <input
            placeholder="Enter 6-digit code"
            maxLength={6}
            style={{ textTransform: "uppercase", letterSpacing: "4px" }}
            id="codeInput"
          />
          <button
            className={styles.viewBtn}
            onClick={() => {
              const code = document.getElementById("codeInput").value;
              if (code.length === 6) navigate("/scorecard/view/" + code);
              else toast.error("Enter valid 6-digit code");
            }}
          >
            View
          </button>
        </div>
      </div>

    </div>
  );
}