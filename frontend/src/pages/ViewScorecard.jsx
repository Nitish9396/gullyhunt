import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScorecardByCode } from "../api";
import toast from "react-hot-toast";
import styles from "./LiveScorecard.module.css";

export default function ViewScorecard() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMatch = async () => {
    try {
      const { data } = await getScorecardByCode(code);
      setMatch(data);
    } catch {
      toast.error("Scorecard not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatch();
    const interval = setInterval(fetchMatch, 5000);
    return () => clearInterval(interval);
  }, [code]);

  if (loading) return (
    <div className={styles.loading}>Loading scorecard...</div>
  );

  if (!match) return (
    <div className={styles.loading}>
      Scorecard not found. Check your code and try again.
    </div>
  );

  const innings = match.currentInnings === 1
    ? match.innings1 : match.innings2;

  const oversDisplay = innings
    ? Math.floor(innings.totalBalls / 6) + "." + (innings.totalBalls % 6)
    : "0.0";

  const striker = innings?.batsmen?.find(
    (b) => b.isStriker && !b.isOut
  );
  const nonStriker = innings?.batsmen?.find(
    (b) => !b.isStriker && !b.isOut
  );
  const currentBowler = innings?.bowlers?.find((b) => b.isBowling);
  const ballsInOver = innings ? innings.totalBalls % 6 : 0;

  const handleShareWhatsApp = () => {
    const text =
      "Live Cricket Scorecard\n\n" +
      match.matchName + "\n" +
      (innings
        ? innings.battingTeam + ": " +
          innings.totalRuns + "/" + innings.totalWickets +
          " (" + oversDisplay + " overs)\n"
        : "") +
      "\nWatch live: " + window.location.origin +
      "/scorecard/view/" + code +
      "\n\nShare Code: " + code +
      "\n\nGullyHunt - Find your game anywhere in India";
    window.open(
      "https://wa.me/?text=" + encodeURIComponent(text),
      "_blank"
    );
  };

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/")}>
          Home
        </button>
        <div className={styles.headerRight}>
          <div className={styles.shareCode}>
            Code: <strong>{code}</strong>
          </div>
          <button className={styles.waBtn} onClick={handleShareWhatsApp}>
            Share
          </button>
        </div>
      </div>

      {/* LIVE BADGE */}
      {match.status === "live" && (
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </div>
      )}

      {/* MATCH TITLE */}
      <div className={styles.matchTitle}>{match.matchName}</div>

      {/* MATCH COMPLETE */}
      {match.status === "completed" && (
        <div className={styles.matchComplete}>
          <div className={styles.trophy}>🏆</div>
          <h3>{match.result}</h3>
          <button className={styles.waBtn} onClick={handleShareWhatsApp}>
            Share Result on WhatsApp
          </button>
        </div>
      )}

      {/* INNINGS BREAK */}
      {match.status === "innings_break" && (
        <div className={styles.inningsBreak}>
          <h3>Innings Break</h3>
          <p>
            {match.innings1.battingTeam} scored{" "}
            <strong>
              {match.innings1.totalRuns}/{match.innings1.totalWickets}
            </strong>
          </p>
          <p>
            {match.innings2?.battingTeam} needs{" "}
            <strong>{match.innings1.totalRuns + 1} runs</strong> to win
          </p>
        </div>
      )}

      {/* SCOREBOARD */}
      {innings && (
        <div className={styles.scoreboard}>

          <div className={styles.mainScore}>
            <div className={styles.teamScoreName}>
              {innings.battingTeam}
            </div>
            <div className={styles.score}>
              <span className={styles.runs}>{innings.totalRuns}</span>
              <span className={styles.slash}>/</span>
              <span className={styles.wickets}>{innings.totalWickets}</span>
            </div>
            <div className={styles.overs}>
              {oversDisplay} / {match.totalOvers} overs
            </div>
            {match.currentInnings === 2 && innings.target > 0 && (
              <div className={styles.target}>
                Target: {innings.target} |
                Need: {innings.target - innings.totalRuns} runs from{" "}
                {(match.totalOvers * 6) - innings.totalBalls} balls
              </div>
            )}
          </div>

          {/* OVER BALLS */}
          <div className={styles.overBalls}>
            <span className={styles.overLabel}>This over:</span>
            <div className={styles.balls}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.ball} ${
                    i < ballsInOver
                      ? styles.ballPlayed
                      : styles.ballPending
                  }`}
                >
                  {i < ballsInOver ? "·" : ""}
                </div>
              ))}
            </div>
          </div>

          {/* BATTING */}
          <div className={styles.battingTable}>
            <div className={styles.tableHeader}>
              <span>Batter</span>
              <span>R</span>
              <span>B</span>
              <span>4s</span>
              <span>6s</span>
              <span>SR</span>
            </div>
            {[striker, nonStriker].filter(Boolean).map((b) => (
              <div
                key={b.name}
                className={`${styles.tableRow} ${
                  b.isStriker ? styles.striker : ""
                }`}
              >
                <span className={styles.batsmanName}>
                  {b.name}
                  {b.isStriker && (
                    <span className={styles.strikerDot}>*</span>
                  )}
                </span>
                <span>{b.runs}</span>
                <span>{b.balls}</span>
                <span>{b.fours}</span>
                <span>{b.sixes}</span>
                <span>
                  {b.balls > 0
                    ? ((b.runs / b.balls) * 100).toFixed(0)
                    : "0"}
                </span>
              </div>
            ))}
          </div>

          {/* BOWLER */}
          {currentBowler && (
            <div className={styles.bowlerRow}>
              <span className={styles.bowlerName}>
                {currentBowler.name}
              </span>
              <span className={styles.bowlerStats}>
                {Math.floor(currentBowler.balls / 6)}.
                {currentBowler.balls % 6} ov |{" "}
                {currentBowler.runs} runs |{" "}
                {currentBowler.wickets} wkts
              </span>
            </div>
          )}

        </div>
      )}

      {/* FALL OF WICKETS */}
      {innings?.fallOfWickets?.length > 0 && (
        <div className={styles.fowSection}>
          <div className={styles.fowTitle}>Fall of Wickets</div>
          <div className={styles.fowList}>
            {innings.fallOfWickets.map((f, i) => (
              <span key={i} className={styles.fowItem}>
                {f.runs}-{f.wicket} ({f.batsman})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* FULL SCORECARD */}
      {innings?.batsmen?.filter(
        (b) => b.balls > 0 || b.isOut
      ).length > 0 && (
        <div className={styles.fullScorecard}>
          <div className={styles.scorecardTitle}>
            Full Scorecard — {innings.battingTeam}
          </div>
          <div className={styles.battingTable}>
            <div className={styles.tableHeader}>
              <span>Batter</span>
              <span>R</span>
              <span>B</span>
              <span>4s</span>
              <span>6s</span>
              <span>SR</span>
            </div>
            {innings.batsmen
              .filter((b) => b.balls > 0 || b.isOut)
              .map((b) => (
                <div key={b.name} className={styles.tableRow}>
                  <span>
                    <div className={styles.batsmanName}>{b.name}</div>
                    {b.isOut && (
                      <div className={styles.dismissal}>
                        {b.dismissal}
                      </div>
                    )}
                    {!b.isOut && (
                      <div className={styles.notOut}>not out</div>
                    )}
                  </span>
                  <span>{b.runs}</span>
                  <span>{b.balls}</span>
                  <span>{b.fours}</span>
                  <span>{b.sixes}</span>
                  <span>
                    {b.balls > 0
                      ? ((b.runs / b.balls) * 100).toFixed(0)
                      : "0"}
                  </span>
                </div>
              ))}
          </div>

          <div className={styles.extrasRow2}>
            Extras:{" "}
            {(innings.extras?.wides || 0) +
              (innings.extras?.noBalls || 0) +
              (innings.extras?.byes || 0) +
              (innings.extras?.legByes || 0)}{" "}
            (wd {innings.extras?.wides || 0}, nb{" "}
            {innings.extras?.noBalls || 0}, b{" "}
            {innings.extras?.byes || 0}, lb{" "}
            {innings.extras?.legByes || 0})
          </div>

          <div className={styles.totalRow}>
            Total: {innings.totalRuns}/{innings.totalWickets} (
            {oversDisplay} overs)
          </div>
        </div>
      )}

      {/* INNINGS 1 SUMMARY if viewing innings 2 */}
      {match.currentInnings === 2 && match.innings1 && (
        <div className={styles.fullScorecard}>
          <div className={styles.scorecardTitle}>
            1st Innings — {match.innings1.battingTeam}
          </div>
          <div className={styles.totalRow}>
            {match.innings1.totalRuns}/{match.innings1.totalWickets}{" "}
            ({Math.floor(match.innings1.totalBalls / 6)}.
            {match.innings1.totalBalls % 6} overs)
          </div>
        </div>
      )}

      {/* AUTO REFRESH NOTE */}
      <div style={{
        textAlign: "center",
        color: "var(--muted)",
        fontSize: "12px",
        marginTop: "20px",
      }}>
        Auto refreshes every 5 seconds
      </div>

    </div>
  );
}