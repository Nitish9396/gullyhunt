import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getScorecardByCode, addBall, startInnings2 } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./LiveScorecard.module.css";

const SCORE_BUTTONS = [
  { label: "0", runs: 0, color: "#2a2a3a" },
  { label: "1", runs: 1, color: "#1e3a1e" },
  { label: "2", runs: 2, color: "#1e3a1e" },
  { label: "3", runs: 3, color: "#1e3a1e" },
  { label: "4", runs: 4, color: "#0f3a0f", special: "four" },
  { label: "6", runs: 6, color: "#0a2a0a", special: "six" },
];

export default function LiveScorecard() {
  const { code } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ballLoading, setBallLoading] = useState(false);
  const [showWicket, setShowWicket] = useState(false);
  const [selectedRuns, setSelectedRuns] = useState(0);
  const [wicketType, setWicketType] = useState("Bowled");
  const [nextBatsman, setNextBatsman] = useState("");
  const [currentBowler, setCurrentBowler] = useState("");
  const [showBowlerSelect, setShowBowlerSelect] = useState(false);

  const fetchMatch = async () => {
    try {
      const { data } = await getScorecardByCode(code);
      setMatch(data);
      const innings = data.currentInnings === 1
        ? data.innings1 : data.innings2;
      const bowler = innings?.bowlers?.find((b) => b.isBowling);
      if (bowler) setCurrentBowler(bowler.name);
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
    <div className={styles.loading}>Scorecard not found</div>
  );

  const innings = match.currentInnings === 1
    ? match.innings1 : match.innings2;
  const isOrganizer = user?._id === match.createdBy ||
    user?.id === match.createdBy;
  const canScore = isOrganizer && match.status === "live";

  const striker = innings?.batsmen?.find(
    (b) => b.isStriker && !b.isOut
  );
  const nonStriker = innings?.batsmen?.find(
    (b) => !b.isStriker && !b.isOut
  );
  const currentBowlerObj = innings?.bowlers?.find(
    (b) => b.name === currentBowler
  );
  const availableBatsmen = innings?.batsmen?.filter(
    (b) => !b.isOut && b.name !== striker?.name && b.name !== nonStriker?.name
  );
  const availableBowlers = innings?.bowlers?.filter(
    (b) => b.name !== currentBowler
  );

  const ballsInOver = innings ? innings.totalBalls % 6 : 0;
  const oversDisplay = innings
    ? Math.floor(innings.totalBalls / 6) + "." + (innings.totalBalls % 6)
    : "0.0";

  const handleScore = async (runs, extras = {}) => {
    if (!canScore) return;
    if (!currentBowler) {
      setShowBowlerSelect(true);
      return toast.error("Select bowler first");
    }
    if (!striker) return toast.error("No striker set");

    setBallLoading(true);
    try {
      const payload = {
        runs,
        batsman: striker.name,
        bowler: currentBowler,
        isWicket: false,
        ...extras,
      };
      const { data } = await addBall(code, payload);
      setMatch(data);

      if (data.status === "innings_break") {
        toast.success("Innings 1 complete!");
      } else if (data.status === "completed") {
        toast.success("Match complete! " + data.result);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBallLoading(false);
    }
  };

  const handleWicket = async () => {
    if (!canScore) return;
    if (!nextBatsman && availableBatsmen?.length > 0) {
      return toast.error("Select next batsman");
    }
    setBallLoading(true);
    try {
      const { data } = await addBall(code, {
        runs: selectedRuns,
        batsman: striker?.name,
        bowler: currentBowler,
        isWicket: true,
        wicketType,
        nextBatsman,
      });
      setMatch(data);
      setShowWicket(false);
      setNextBatsman("");
      toast.success("Wicket!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setBallLoading(false);
    }
  };

  const handleStartInnings2 = async () => {
    try {
      const { data } = await startInnings2(code);
      setMatch(data);
      setCurrentBowler("");
      toast.success("Innings 2 started!");
    } catch (err) {
      toast.error("Error starting innings 2");
    }
  };

  const handleShareWhatsApp = () => {
    const text =
      "Live Cricket Scorecard\n\n" +
      match.matchName + "\n" +
      (innings ? innings.battingTeam + ": " +
        innings.totalRuns + "/" + innings.totalWickets +
        " (" + oversDisplay + " overs)\n" : "") +
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
        <button className={styles.back} onClick={() => navigate(-1)}>
          Back
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

      {/* MATCH TITLE */}
      <div className={styles.matchTitle}>{match.matchName}</div>

      {/* INNINGS BREAK */}
      {match.status === "innings_break" && (
        <div className={styles.inningsBreak}>
          <h3>Innings Break</h3>
          <p>
            {match.innings1.battingTeam} scored{" "}
            <strong>{match.innings1.totalRuns}/{match.innings1.totalWickets}</strong>
          </p>
          <p>
            {match.innings2?.battingTeam} needs{" "}
            <strong>{match.innings1.totalRuns + 1} runs</strong> to win
          </p>
          {canScore && (
            <button
              className={styles.startInn2Btn}
              onClick={handleStartInnings2}
            >
              Start Innings 2
            </button>
          )}
        </div>
      )}

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

      {/* SCOREBOARD */}
      {innings && (
        <div className={styles.scoreboard}>

          {/* MAIN SCORE */}
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

          {/* CURRENT OVER BALLS */}
          <div className={styles.overBalls}>
            <span className={styles.overLabel}>This over:</span>
            <div className={styles.balls}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.ball} ${i < ballsInOver ? styles.ballPlayed : styles.ballPending}`}
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
                className={`${styles.tableRow} ${b.isStriker ? styles.striker : ""}`}
              >
                <span className={styles.batsmanName}>
                  {b.name}
                  {b.isStriker && <span className={styles.strikerDot}>*</span>}
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

          {/* BOWLING */}
          {currentBowlerObj && (
            <div className={styles.bowlerRow}>
              <span className={styles.bowlerName}>
                {currentBowlerObj.name}
              </span>
              <span className={styles.bowlerStats}>
                {Math.floor(currentBowlerObj.balls / 6)}.
                {currentBowlerObj.balls % 6} ov |{" "}
                {currentBowlerObj.runs} runs |{" "}
                {currentBowlerObj.wickets} wkts
              </span>
            </div>
          )}

        </div>
      )}

      {/* SCORING BUTTONS */}
      {canScore && match.status === "live" && (
        <div className={styles.scoringSection}>

          {/* SELECT BOWLER */}
          {!currentBowler || showBowlerSelect ? (
            <div className={styles.selectBox}>
              <div className={styles.selectLabel}>Select Bowler</div>
              <div className={styles.selectBtns}>
                {innings?.bowlers?.map((b) => (
                  <button
                    key={b.name}
                    className={`${styles.selectBtn} ${currentBowler === b.name ? styles.selectBtnActive : ""}`}
                    onClick={() => {
                      setCurrentBowler(b.name);
                      setShowBowlerSelect(false);
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.bowlerDisplay}>
              Bowling: <strong>{currentBowler}</strong>
              <button
                className={styles.changeBowlerBtn}
                onClick={() => setShowBowlerSelect(true)}
              >
                Change
              </button>
            </div>
          )}

          {/* SCORE BUTTONS */}
          <div className={styles.scoreGrid}>
            {SCORE_BUTTONS.map((btn) => (
              <button
                key={btn.label}
                className={`${styles.scoreBtn} ${btn.special === "four" ? styles.fourBtn : ""} ${btn.special === "six" ? styles.sixBtn : ""}`}
                onClick={() => handleScore(btn.runs)}
                disabled={ballLoading}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* EXTRAS ROW */}
          <div className={styles.extrasRow}>
            <button
              className={styles.extraBtn}
              onClick={() => handleScore(1, { isWide: true })}
              disabled={ballLoading}
            >
              Wide
            </button>
            <button
              className={styles.extraBtn}
              onClick={() => handleScore(1, { isNoBall: true })}
              disabled={ballLoading}
            >
              No Ball
            </button>
            <button
              className={styles.extraBtn}
              onClick={() => handleScore(1, { isBye: true })}
              disabled={ballLoading}
            >
              Bye
            </button>
            <button
              className={styles.extraBtn}
              onClick={() => handleScore(1, { isLegBye: true })}
              disabled={ballLoading}
            >
              Leg Bye
            </button>
            <button
              className={`${styles.extraBtn} ${styles.wicketBtn}`}
              onClick={() => setShowWicket(true)}
              disabled={ballLoading}
            >
              Wicket
            </button>
          </div>

        </div>
      )}

      {/* WICKET MODAL */}
      {showWicket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Wicket!</h3>

            <div className={styles.group}>
              <label className={styles.label}>Dismissal Type</label>
              <div className={styles.wicketTypes}>
                {["Bowled","Caught","LBW","Run Out","Stumped","Hit Wicket"].map((w) => (
                  <button
                    key={w}
                    className={`${styles.wicketTypeBtn} ${wicketType === w ? styles.wicketTypeSel : ""}`}
                    onClick={() => setWicketType(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <label className={styles.label}>Runs scored on this ball</label>
              <div className={styles.wicketRuns}>
                {[0,1,2,3].map((r) => (
                  <button
                    key={r}
                    className={`${styles.wicketRunBtn} ${selectedRuns === r ? styles.wicketRunSel : ""}`}
                    onClick={() => setSelectedRuns(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {availableBatsmen?.length > 0 && (
              <div className={styles.group}>
                <label className={styles.label}>Next Batsman</label>
                <div className={styles.nextBatsmanBtns}>
                  {availableBatsmen.map((b) => (
                    <button
                      key={b.name}
                      className={`${styles.selectBtn} ${nextBatsman === b.name ? styles.selectBtnActive : ""}`}
                      onClick={() => setNextBatsman(b.name)}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.modalBtns}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowWicket(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmWicketBtn}
                onClick={handleWicket}
                disabled={ballLoading}
              >
                {ballLoading ? "..." : "Confirm Wicket"}
              </button>
            </div>
          </div>
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

      {/* SCORECARD TABLE */}
      {innings?.batsmen?.filter((b) => b.balls > 0 || b.isOut).length > 0 && (
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
                      <div className={styles.dismissal}>{b.dismissal}</div>
                    )}
                    {!b.isOut && !b.isStriker && (
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
            Extras: {
              (innings.extras?.wides || 0) +
              (innings.extras?.noBalls || 0) +
              (innings.extras?.byes || 0) +
              (innings.extras?.legByes || 0)
            } (
            wd {innings.extras?.wides || 0},
            nb {innings.extras?.noBalls || 0},
            b {innings.extras?.byes || 0},
            lb {innings.extras?.legByes || 0}
            )
          </div>

          <div className={styles.totalRow}>
            Total: {innings.totalRuns}/{innings.totalWickets}
            ({oversDisplay} overs)
          </div>
        </div>
      )}

    </div>
  );
}