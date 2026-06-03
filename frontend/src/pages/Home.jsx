import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((p) => ({ ...p, [e.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-id]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fadeClass = (id) =>
    `${styles.fadeUp} ${visible[id] ? styles.visible : ""}`;

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <video
            autoPlay
            muted
            loop
            playsInline
            className={styles.heroBgVideo}
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
          </video>
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />

        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.blink} />
            India's Sports Community Platform
          </div>

          <h1 className={styles.h1}>
            <span className={styles.l1}>YOUR NEAREST</span>
            <span className={styles.l2}>SPORTS GAME</span>
            <span className={styles.l3}>IS ONE TAP AWAY</span>
          </h1>

          <p className={styles.heroSub}>
            Moved to a new city?{" "}
            <strong>GullyHunt</strong> finds live gully cricket, football,
            badminton and more happening right now near you — anywhere in India.
          </p>

          <div className={styles.heroBtns}>
            <button className={styles.hb1} onClick={() => navigate("/find")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Find Games Nearby
            </button>
            <button className={styles.hb2} onClick={() => navigate("/register")}>
              Post a Match
            </button>
          </div>

          {/* PHONE MOCKUPS */}
          <div className={styles.phones}>

            {/* Left Phone */}
            <div className={styles.phone}>
              <div className={styles.phoneBar}>
                <div className={styles.phoneNotch} />
              </div>
              <div className={styles.phoneContent}>
                <div className={styles.phHeader}>NEARBY GAMES</div>
                <div className={styles.phCard}>
                  <div className={styles.phCardTitle}>Gully T20 Cricket</div>
                  <div className={styles.phCardMeta}>Dharavi Ground · 1.2 km</div>
                  <div className={styles.phCardMeta}>Today 5:00 PM · 7/11 joined</div>
                  <span className={styles.phPillGreen}>FREE</span>
                </div>
                <div className={styles.phCard}>
                  <div className={styles.phCardTitle}>5-a-Side Football</div>
                  <div className={styles.phCardMeta}>Bandra Turf · 3.5 km</div>
                  <div className={styles.phCardMeta}>Today 6:30 PM · 8/10</div>
                  <span className={styles.phPillBlue}>Rs.50</span>
                </div>
              </div>
            </div>

            {/* Center Phone */}
            <div className={`${styles.phone} ${styles.phoneCenter}`}>
              <div className={styles.phoneBar}>
                <div className={styles.phoneNotch} />
              </div>
              <div className={styles.phoneContent}>
                <div className={styles.phStatRow}>
                  <div className={styles.phStat}>
                    <div className={styles.phStatN}>12</div>
                    <div className={styles.phStatL}>Games</div>
                  </div>
                  <div className={styles.phStat}>
                    <div className={styles.phStatN}>4km</div>
                    <div className={styles.phStatL}>Radius</div>
                  </div>
                </div>
                <div className={styles.phMap}>
                  <div className={styles.phMapGrid} />
                  <span className={styles.phPin} style={{ top: "30%", left: "40%" }}>🏏</span>
                  <span className={styles.phPin} style={{ top: "55%", left: "60%" }}>⚽</span>
                  <span className={styles.phPin} style={{ top: "20%", left: "65%" }}>🏸</span>
                </div>
                <div className={styles.phCard}>
                  <div className={styles.phCardTitle}>Badminton Open</div>
                  <div className={styles.phCardMeta}>Andheri Sports Complex</div>
                  <div className={styles.phCardMeta}>Tomorrow 7 AM · FREE</div>
                </div>
                <button
                  className={styles.phBtn}
                  onClick={() => navigate("/find")}
                >
                  Find Games
                </button>
              </div>
            </div>

            {/* Right Phone */}
            <div className={styles.phone}>
              <div className={styles.phoneBar}>
                <div className={styles.phoneNotch} />
              </div>
              <div className={styles.phoneContent}>
                <div className={styles.phHeader}>POST A MATCH</div>
                <div className={styles.phFormBox}>
                  <div className={styles.phFormLabel}>Sport</div>
                  <div className={styles.phSportRow}>
                    <span className={styles.phSportSel}>Cricket</span>
                    <span className={styles.phSportOpt}>Football</span>
                    <span className={styles.phSportOpt}>Badminton</span>
                  </div>
                </div>
                <div className={styles.phFormInput}>Mumbai · Bandra West</div>
                <div className={styles.phFormInput}>Sunday 5:00 PM</div>
                <div className={styles.phFormInput}>11 Players · Free Entry</div>
                <button
                  className={styles.phBtn}
                  onClick={() => navigate("/post")}
                >
                  Post Match
                </button>
              </div>
            </div>

          </div>

          {/* STATS BAR */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statN}>2,840</div>
              <div className={styles.statL}>Active Games</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statN}>180+</div>
              <div className={styles.statL}>Cities</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statN}>94k</div>
              <div className={styles.statL}>Players</div>
            </div>
          </div>
        </div>
      </section>

      {/* CITIES SECTION */}
      <section className={styles.citiesSection}>
        <div className={styles.citiesInner}>
          <div className="section-tag">Coverage</div>
          <h2 className={`heading ${styles.sectionH}`}>
            Games Happening Across India
          </h2>
          <p className={styles.sectionS}>
            From Kashmir to Kanyakumari — GullyHunt is everywhere
          </p>

          <div className={styles.indiaMap}>
            <svg
              viewBox="0 0 400 480"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main India body */}
              <path
                fill="rgba(200,255,0,0.05)"
                stroke="rgba(200,255,0,0.25)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                d="
                  M195,22 L208,18 L222,18 L235,22 L248,28 L258,36 L266,46
                  L272,54 L278,58 L286,60 L292,64 L295,72 L290,80 L282,84
                  L276,90 L278,100 L283,110 L288,122 L292,135 L295,148
                  L297,162 L299,175 L301,188 L304,198 L308,208 L312,218
                  L312,228 L308,236 L302,243 L295,250 L288,258 L283,267
                  L278,276 L272,286 L265,297 L258,308 L251,319 L244,330
                  L237,341 L230,351 L223,360 L216,368 L210,375 L204,380
                  L198,375 L192,366 L186,355 L180,344 L174,333 L168,322
                  L162,311 L156,300 L149,289 L143,278 L137,267 L131,256
                  L125,245 L119,234 L114,223 L109,212 L105,200 L102,188
                  L100,175 L98,162 L97,149 L96,136 L97,122 L99,109
                  L102,97 L107,86 L113,76 L120,67 L128,58 L137,50
                  L147,43 L157,37 L168,31 L179,26 L190,23 Z
                "
              />
              {/* Kashmir */}
              <path
                fill="rgba(200,255,0,0.05)"
                stroke="rgba(200,255,0,0.25)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                d="M195,22 L190,23 L179,26 L170,20 L164,14 L170,8
                   L180,5 L192,5 L204,8 L212,14 L208,18 Z"
              />
              {/* Northeast */}
              <path
                fill="rgba(200,255,0,0.05)"
                stroke="rgba(200,255,0,0.25)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                d="M295,148 L305,142 L316,138 L328,136 L336,140
                   L334,148 L326,155 L315,158 L304,156 Z"
              />
              {/* Sri Lanka */}
              <ellipse
                cx="222" cy="418" rx="8" ry="13"
                fill="rgba(200,255,0,0.03)"
                stroke="rgba(200,255,0,0.15)"
                strokeWidth="1"
              />

              {/* Mumbai */}
              <circle cx="118" cy="240" r="16" fill="none" stroke="#c8ff00"
                strokeWidth="0.8" style={{animation:"ringpulse 3s 0s infinite"}}/>
              <circle cx="118" cy="240" r="6" fill="#c8ff00"
                style={{animation:"dotpulse 3s 0s infinite"}}/>
              <text x="130" y="244" fontFamily="'Barlow Condensed',sans-serif"
                fontSize="13" fontWeight="700" fill="rgba(200,255,0,0.9)">MUMBAI</text>

              {/* Delhi */}
              <circle cx="188" cy="100" r="16" fill="none" stroke="#c8ff00"
                strokeWidth="0.8" style={{animation:"ringpulse 3s 0.5s infinite"}}/>
              <circle cx="188" cy="100" r="6" fill="#c8ff00"
                style={{animation:"dotpulse 3s 0.5s infinite"}}/>
              <text x="200" y="104" fontFamily="'Barlow Condensed',sans-serif"
                fontSize="13" fontWeight="700" fill="rgba(200,255,0,0.9)">DELHI</text>

              {/* Bengaluru */}
              <circle cx="196" cy="335" r="16" fill="none" stroke="#c8ff00"
                strokeWidth="0.8" style={{animation:"ringpulse 3s 1s infinite"}}/>
              <circle cx="196" cy="335" r="6" fill="#c8ff00"
                style={{animation:"dotpulse 3s 1s infinite"}}/>
              <text x="208" y="339" fontFamily="'Barlow Condensed',sans-serif"
                fontSize="13" fontWeight="700" fill="rgba(200,255,0,0.9)">BENGALURU</text>

              {/* Kolkata */}
              <circle cx="270" cy="185" r="16" fill="none" stroke="#c8ff00"
                strokeWidth="0.8" style={{animation:"ringpulse 3s 1.5s infinite"}}/>
              <circle cx="270" cy="185" r="6" fill="#c8ff00"
                style={{animation:"dotpulse 3s 1.5s infinite"}}/>
              <text x="282" y="189" fontFamily="'Barlow Condensed',sans-serif"
                fontSize="13" fontWeight="700" fill="rgba(200,255,0,0.9)">KOLKATA</text>

              {/* Chennai */}
              <circle cx="218" cy="362" r="16" fill="none" stroke="#c8ff00"
                strokeWidth="0.8" style={{animation:"ringpulse 3s 2s infinite"}}/>
              <circle cx="218" cy="362" r="6" fill="#c8ff00"
                style={{animation:"dotpulse 3s 2s infinite"}}/>
              <text x="230" y="366" fontFamily="'Barlow Condensed',sans-serif"
                fontSize="13" fontWeight="700" fill="rgba(200,255,0,0.9)">CHENNAI</text>

              {/* Smaller cities */}
              {[
                [208,282],[132,258],[128,178],[160,122],
                [220,138],[205,218],[182,185],[176,382],
                [242,155],[120,200],[165,310],
              ].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r="4"
                  fill="#c8ff00" opacity="0.5"
                  style={{animation:`dotpulse 3s ${i*0.25}s infinite`}}
                />
              ))}
            </svg>

            <style>{`
              @keyframes dotpulse{0%,100%{opacity:1}50%{opacity:.25}}
              @keyframes ringpulse{
                0%{r:10;opacity:.7;stroke-width:1.5}
                100%{r:24;opacity:0;stroke-width:0.3}
              }
            `}</style>
          </div>

          <span className={styles.citiesCount}>180+</span>
          <p className={styles.citiesSub}>Cities with active games right now</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className={`${styles.section} ${fadeClass("how")}`}
        data-id="how"
      >
        <div className="section-tag">How It Works</div>
        <h2 className={`heading ${styles.sectionH}`}>Play in 3 Simple Steps</h2>
        <p className={styles.sectionS}>
          From opening the app to being on the field — under 5 minutes
        </p>
        <div className={styles.howSteps}>
          {[
            {
              n: "01", icon: "📍", title: "Set Your City",
              desc: "Enter the city you are in or tap to use your GPS location. GullyHunt instantly shows all live and upcoming games near you — from gully cricket to 5-a-side football.",
            },
            {
              n: "02", icon: "🔍", title: "Filter and Find",
              desc: "Filter by sport, time, entry fee and skill level. See who is organizing, how many spots are left, and the exact location — gully or turf.",
            },
            {
              n: "03", icon: "✅", title: "Join and Play",
              desc: "Tap Join, get the organizer contact on WhatsApp, bring your kit and show up. No subscriptions, no complicated booking. Just play.",
            },
          ].map((s) => (
            <div key={s.n} className={styles.hwStep}>
              <div className={styles.hwNum}>{s.n}</div>
              <div>
                <div className={styles.hwIcon}>{s.icon}</div>
                <div className={styles.hwTitle}>{s.title}</div>
                <div className={styles.hwDesc}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section
        className={`${styles.section} ${fadeClass("roles")}`}
        data-id="roles"
        style={{ paddingTop: 0 }}
      >
        <div className="section-tag">For Everyone</div>
        <h2 className={`heading ${styles.sectionH}`}>Every Role, One Platform</h2>
        <p className={styles.sectionS}>
          Players, organizers, turf owners and stadiums — all in one place
        </p>
        <div className={styles.roles}>
          {[
            { icon: "🏃", title: "Player", color: "var(--neon)",
              desc: "New to a city? Find open games nearby. Filter by sport, skill level and distance. Just show up and play." },
            { icon: "📣", title: "Organizer", color: "var(--orange)",
              desc: "Post gully tournaments or friendly matches. Fill your squad in hours. Share on WhatsApp instantly." },
            { icon: "🏟️", title: "Turf Owner", color: "var(--neon2)",
              desc: "List your turf, manage slot bookings and connect with players looking for a proper ground." },
            { icon: "🏛️", title: "Stadium", color: "var(--blue)",
              desc: "Post events, grow your player base citywide. Private academies and stadiums welcome." },
          ].map((r) => (
            <div
              key={r.title}
              className={styles.roleCard}
              style={{ "--role-color": r.color }}
            >
              <span className={styles.roleIcon}>{r.icon}</span>
              <div className={styles.roleTitle} style={{ color: r.color }}>
                {r.title}
              </div>
              <div className={styles.roleDesc}>{r.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section
        className={`${styles.section} ${fadeClass("road")}`}
        data-id="road"
        style={{ paddingTop: 0 }}
      >
        <div className="section-tag">Roadmap</div>
        <h2 className={`heading ${styles.sectionH}`}>What Is Coming Next</h2>
        <p className={styles.sectionS}>
          Building the most complete sports platform for India
        </p>
        <div className={styles.roadmap}>
          {[
            { icon: "🗺️", title: "Live Map View", status: "In Development",
              sc: "var(--neon)", desc: "See all games on an interactive map. Find matches within 5km using your GPS in real time." },
            { icon: "💳", title: "Online Payments", status: "In Development",
              sc: "var(--blue)", desc: "Pay entry fees via UPI, Card or Netbanking. Instant payment confirmation and auto-join." },
            { icon: "📱", title: "Mobile App", status: "Coming Soon",
              sc: "var(--orange)", desc: "Native Android and iOS app with push notifications when new games are posted near you." },
            { icon: "⭐", title: "Ratings and Reviews", status: "Planned",
              sc: "var(--pink)", desc: "Rate organizers and venues. Build community trust across all cities in India." },
            { icon: "🏆", title: "Tournaments", status: "Planned",
              sc: "var(--neon2)", desc: "Full tournament brackets, group stages and live scoreboards for your city leagues." },
            { icon: "💬", title: "Team Chat", status: "Planned",
              sc: "var(--neon)", desc: "Chat with your team before the match. Coordinate pickups, kit and meetup points." },
          ].map((r) => (
            <div key={r.title} className={styles.rmCard}>
              <div className={styles.rmIcon}>{r.icon}</div>
              <div className={styles.rmBody}>
                <div className={styles.rmTop}>
                  <div className={styles.rmTitle}>{r.title}</div>
                  <span
                    className={styles.rmStatus}
                    style={{
                      color: r.sc,
                      border: "1px solid " + r.sc + "40",
                      background: r.sc + "12",
                    }}
                  >
                    {r.status}
                  </span>
                </div>
                <div className={styles.rmDesc}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className={`${styles.ctaSection} ${fadeClass("cta")}`}
        data-id="cta"
      >
        <div className={styles.ctaBg} />
        <div className={styles.ctaInner}>
          <div className="section-tag">Get Started Free</div>
          <h2 className={styles.ctaH}>
            <span>STOP SITTING</span>
            <br />
            <span className={styles.ctaItalic}>ON THE SIDELINES</span>
          </h2>
          <p className={styles.ctaS}>
            Join 94,000+ players already finding games on GullyHunt.
            Completely free to sign up and join matches.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.hb1} onClick={() => navigate("/find")}>
              Find Games Near Me
            </button>
            <button className={styles.hb2} onClick={() => navigate("/post")}>
              Post a Match
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          Gully<span>Hunt</span>
        </div>
        <div className={styles.footerLinks}>
          {[
            "Home","Find Games","Post Match",
            "For Turf Owners","About","Contact"
          ].map((l) => (
            <span key={l} className={styles.footerLink}>{l}</span>
          ))}
        </div>
        <div className={styles.footerCopy}>
          2024 GullyHunt. Made with love for India.
        </div>
      </footer>

    </div>
  );
}