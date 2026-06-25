import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../api";
import heroCollage from "../assets/hero-collage.webp";
import styles from "./Home.module.css";

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Lucknow",
];

const SPORTS = [
  { key: "cricket", label: "Cricket", icon: "🏏" },
  { key: "football", label: "Football", icon: "⚽" },
  { key: "badminton", label: "Badminton", icon: "🏸" },
  { key: "basketball", label: "Basketball", icon: "🏀" },
  { key: "volleyball", label: "Volleyball", icon: "🏐" },
  { key: "table_tennis", label: "Table Tennis", icon: "🏓" },
  { key: "kabaddi", label: "Kabaddi", icon: "🤼" },
  { key: "other", label: "More", icon: "➕" },
];

const SPORT_BADGE_COLOR = {
  cricket: "#1d6fd0",
  football: "#1aa15a",
  badminton: "#8b3fd1",
  basketball: "#e8650a",
};

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Kolkata");
  const [sport, setSport] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Force the light theme on body while this page is mounted.
  useEffect(() => {
    document.body.classList.add("light-theme");
    return () => document.body.classList.remove("light-theme");
  }, []);

  useEffect(() => {
    let active = true;

    const fetchMatches = async () => {
      if (active) setLoading(true);
      try {
        const { data } = await getMatches({ city });
        if (active) setMatches(Array.isArray(data) ? data : []);
      } catch {
        if (active) setMatches([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMatches();
    return () => {
      active = false;
    };
  }, [city]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    if (city) params.set("city", city);
    navigate(`/find?${params.toString()}`);
  };

  const upcoming = matches.slice(0, 3);

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className={styles.page}>

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <h1 className={styles.h1}>
              <span className={styles.h1Line1}>PLAY</span>
              <span className={styles.h1Line2}>WITHOUT</span>
              <span className={styles.h1Line3}>LIMITS</span>
            </h1>
            <p className={styles.heroSub}>
              Discover games, tournaments, and players near you.
              Anytime, anywhere.
            </p>

            <div className={styles.searchBar}>
              <div className={styles.searchField}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className={styles.searchDivider} />

              <div className={styles.searchField}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <select value={sport} onChange={(e) => setSport(e.target.value)}>
                  <option value="">All Sports</option>
                  {SPORTS.filter((s) => s.key !== "other").map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button className={styles.searchBtn} onClick={handleSearch}>
                Search
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span>10K+</span>
                <small>Players</small>
              </div>
              <div className={styles.heroStat}>
                <span>500+</span>
                <small>Grounds</small>
              </div>
              <div className={styles.heroStat}>
                <span>1500+</span>
                <small>Tournaments</small>
              </div>
              <div className={styles.heroStat}>
                <span>200+</span>
                <small>Cities</small>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <img src={heroCollage} alt="Athletes playing cricket, football, badminton, volleyball and basketball" />
          </div>
        </div>

        {/* EXPLORE SPORTS */}
        <div className={styles.exploreSports}>
          <div className={styles.exploreHead}>
            <h3>Explore Sports</h3>
            <button onClick={() => navigate("/find")}>View all sports →</button>
          </div>
          <div className={styles.sportsRow}>
            {SPORTS.map((s) => (
              <button
                key={s.key}
                className={styles.sportChip}
                onClick={() =>
                  navigate(`/find?sport=${s.key === "other" ? "" : s.key}`)
                }
              >
                <span className={styles.sportChipIcon}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRENDING TOURNAMENTS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Trending Tournaments</h2>
          <button onClick={() => navigate("/find")}>View all →</button>
        </div>

        <div className={styles.tourneyGrid}>
          {[
            { sport: "Cricket", title: "Kolkata Street Premier League", date: "24 May",
              city: "Kolkata, WB", prize: "₹75,000", teams: "32/32" },
            { sport: "Football", title: "Gully Champions Cup", date: "25 May",
              city: "Kolkata, WB", prize: "₹50,000", teams: "24/24" },
            { sport: "Badminton", title: "Smash Masters Open", date: "26 May",
              city: "Kolkata, WB", prize: "₹25,000", teams: "16/16" },
          ].map((t) => (
            <div key={t.title} className={styles.tourneyCard}
              onClick={() => navigate("/find")}>
              <div className={styles.tourneyTop}>
                <span
                  className={styles.tourneyBadge}
                  style={{ background: SPORT_BADGE_COLOR[t.sport.toLowerCase()] || "#14213d" }}
                >
                  {t.sport.toUpperCase()}
                </span>
                <span className={styles.tourneyDate}>{t.date}</span>
              </div>
              <h4>{t.title}</h4>
              <div className={styles.tourneyLoc}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {t.city}
              </div>
              <div className={styles.tourneyFoot}>
                <div>
                  <small>Prize Pool</small>
                  <strong>{t.prize}</strong>
                </div>
                <div>
                  <small>Teams</small>
                  <strong>{t.teams}</strong>
                </div>
                <span className={styles.tourneyArrow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ NEARBY GROUNDS + UPCOMING EVENTS ============ */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.twoColLayout}>

          <div className={styles.groundsCol}>
            <div className={styles.sectionHead}>
              <h2>Nearby Grounds</h2>
              <button onClick={() => navigate("/find")}>View all grounds →</button>
            </div>
            <div className={styles.groundsGrid}>
              {[
                { name: "Astroturf Park", area: "Salt Lake, Kolkata", rating: "4.6", price: "₹1200" },
                { name: "Play Arena Indoor", area: "New Town, Kolkata", rating: "4.5", price: "₹900" },
                { name: "Green Valley Ground", area: "Garia, Kolkata", rating: "4.7", price: "₹1000" },
                { name: "Sports Hub Indoor", area: "Behala, Kolkata", rating: "4.4", price: "₹800" },
              ].map((g) => (
                <div key={g.name} className={styles.groundCard}>
                  <div className={styles.groundImg}>
                    <span className={styles.groundRating}>★ {g.rating}</span>
                  </div>
                  <div className={styles.groundBody}>
                    <h5>{g.name}</h5>
                    <p>📍 {g.area}</p>
                    <div className={styles.groundFoot}>
                      <span>{g.price} <small>/hr</small></span>
                      <button onClick={() => navigate("/find")}>Book</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.eventsCol}>
            <div className={styles.sectionHead}>
              <h2>Upcoming Events</h2>
              <button onClick={() => navigate("/find")}>Full schedule →</button>
            </div>

            <div className={styles.eventsList}>
              {loading ? (
                <div className={styles.eventsEmpty}>Loading games near {city}…</div>
              ) : upcoming.length === 0 ? (
                <div className={styles.eventsEmpty}>
                  No games posted in {city} yet.
                  <button onClick={() => navigate("/post")}>Be the first to post one →</button>
                </div>
              ) : (
                upcoming.map((m) => (
                  <div
                    key={m._id}
                    className={styles.eventRow}
                    onClick={() => navigate(`/match/${m._id}`)}
                  >
                    <div className={styles.eventDate}>
                      <small>{formatDate(m.date).split(" ")[1]}</small>
                      <strong>{formatDate(m.date).split(" ")[0]}</strong>
                    </div>
                    <div className={styles.eventInfo}>
                      <h5>{m.title}</h5>
                      <p>{m.locality || m.city} · {m.time}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/match/${m._id}`); }}>
                      View
                    </button>
                  </div>
                ))
              )}

              {/* Static example rows shown when there isn't enough live data to fill the list */}
              {!loading && upcoming.length < 3 && (
                [
                  { d: "24", mo: "MAY", title: "Cricket Knights vs Royal Challengers", loc: "Maidan Ground · 6:00 PM" },
                  { d: "25", mo: "MAY", title: "United FC vs Street Warriors", loc: "Deshapriya Park · 7:30 PM" },
                ].slice(0, 3 - upcoming.length).map((e) => (
                  <div key={e.title} className={styles.eventRow}>
                    <div className={styles.eventDate}>
                      <small>{e.mo}</small>
                      <strong>{e.d}</strong>
                    </div>
                    <div className={styles.eventInfo}>
                      <h5>{e.title}</h5>
                      <p>{e.loc}</p>
                    </div>
                    <button onClick={() => navigate("/find")}>View</button>
                  </div>
                ))
              )}
            </div>

            <button className={styles.hostBanner} onClick={() => navigate("/post")}>
              <div>
                <strong>Want to organize a tournament?</strong>
                <span>Create, manage and grow your own tournament.</span>
              </div>
              <span className={styles.hostBtn}>Host a Tournament</span>
            </button>
          </div>

        </div>
      </section>

      {/* ============ COMMUNITIES + APP PROMO ============ */}
      <section className={styles.section}>
        <div className={styles.commAppLayout}>

          <div className={styles.commCol}>
            <div className={styles.sectionHead}>
              <h2>Communities</h2>
            </div>
            <div className={styles.commTeams}>
              {[
                { name: "Gully Strikers", members: "1.2K" },
                { name: "Kolkata Kings", members: "980" },
                { name: "Young Titans", members: "870" },
                { name: "Playmakers", members: "760" },
                { name: "Street Legends", members: "650" },
              ].map((t) => (
                <div key={t.name} className={styles.commTeam} onClick={() => navigate("/find")}>
                  <div className={styles.commCrest}>
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <strong>{t.name}</strong>
                  <small>{t.members} Members</small>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.appCol}>
            <div className={styles.appCard}>
              <h3>The GullyHunt App</h3>
              <p>Your ultimate sports companion. Join, play, track and connect.</p>
              <ul>
                <li>✓ Live Match Updates</li>
                <li>✓ Easy Registrations</li>
                <li>✓ Team Management</li>
                <li>✓ Leaderboards</li>
              </ul>
              <div className={styles.appStoreBtns}>
                <span>▶ Get it on Google Play</span>
                <span> Download on the App Store</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============ STAY IN THE GAME (newsletter) ============ */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div>
            <h3>Stay in the Game!</h3>
            <p>Get the latest tournaments and updates.</p>
          </div>
          <form
            className={styles.newsletterForm}
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className={styles.trustStrip}>
        {[
          { icon: "🛡️", title: "Verified Organizers", desc: "All organizers are verified for your safety." },
          { icon: "🔒", title: "Secure Payments", desc: "100% secure payments and easy refunds." },
          { icon: "👥", title: "Trusted Community", desc: "Join thousands of players across the country." },
          { icon: "⚡", title: "Easy & Fast", desc: "Quick sign-up and seamless experience." },
        ].map((t) => (
          <div key={t.title} className={styles.trustItem}>
            <span>{t.icon}</span>
            <div>
              <strong>{t.title}</strong>
              <small>{t.desc}</small>
            </div>
          </div>
        ))}
      </section>

      {/* ============ FOOTER ============ */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>Gully<span>Hunt</span></div>
            <p>Discover. Play. Belong.<br />Where every game begins.</p>
          </div>

          {[
            { h: "Explore", items: ["Tournaments", "Grounds", "Teams", "Sports"] },
            { h: "Company", items: ["About Us", "Careers", "Blog", "Contact"] },
            { h: "Support", items: ["Help Center", "Terms of Use", "Privacy Policy", "Refund Policy"] },
            { h: "Community", items: ["Become an Organizer", "Refer & Earn", "Community Guidelines"] },
          ].map((col) => (
            <div key={col.h} className={styles.footerCol}>
              <h6>{col.h}</h6>
              {col.items.map((i) => <span key={i}>{i}</span>)}
            </div>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 GullyHunt. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}