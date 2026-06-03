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
    src="https://videos.pexels.com/video-files/6078036/6078036-uhd_2560_1440_25fps.mp4"
    type="video/mp4"
  />
  <source
    src="https://videos.pexels.com/video-files/3256816/3256816-uhd_2560_1440_30fps.mp4"
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
    viewBox="0 0 500 560"
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* INDIA - Accurate outline */}
    <path
      fill="rgba(200,255,0,0.06)"
      stroke="rgba(200,255,0,0.3)"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="
        M233,28 L244,24 L256,22 L268,24 L280,28 L292,34
        L302,42 L310,50 L316,58 L320,66 L326,70 L334,72
        L340,76 L344,84 L340,92 L334,98 L328,104 L326,112
        L330,122 L336,132 L342,144 L346,156 L349,168
        L351,180 L353,192 L356,202 L360,212 L364,222
        L366,232 L364,242 L359,250 L352,257 L344,264
        L336,272 L329,281 L322,291 L315,302 L308,313
        L301,324 L294,335 L287,346 L280,356 L273,365
        L266,373 L259,380 L252,386 L246,392 L240,386
        L234,378 L228,369 L222,359 L216,349 L210,339
        L204,329 L198,319 L192,309 L186,299 L180,289
        L174,279 L168,269 L162,259 L157,249 L152,239
        L148,229 L144,219 L141,209 L138,198 L136,187
        L134,176 L133,165 L132,154 L132,143 L133,132
        L135,121 L138,111 L143,101 L149,92 L156,83
        L164,75 L173,68 L183,62 L193,57 L203,52
        L213,47 L222,42 L229,36 Z
      "
    />
    {/* Kashmir */}
    <path
      fill="rgba(200,255,0,0.06)"
      stroke="rgba(200,255,0,0.3)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d="M233,28 L229,36 L222,42 L214,36 L207,28
         L210,20 L218,14 L228,12 L238,14 L246,20
         L244,24 Z"
    />
    {/* Andaman Islands */}
    <ellipse cx="400" cy="320" rx="6" ry="18"
      fill="rgba(200,255,0,0.04)"
      stroke="rgba(200,255,0,0.2)" strokeWidth="1"/>
    {/* Sri Lanka */}
    <ellipse cx="272" cy="468" rx="10" ry="16"
      fill="rgba(200,255,0,0.03)"
      stroke="rgba(200,255,0,0.15)" strokeWidth="1"/>

    {/* MUMBAI */}
    <circle cx="152" cy="278" r="18" fill="none"
      stroke="#c8ff00" strokeWidth="0.8"
      style={{animation:"ringpulse 3s 0s infinite"}}/>
    <circle cx="152" cy="278" r="7" fill="#c8ff00"
      style={{animation:"dotpulse 3s 0s infinite"}}/>
    <text x="166" y="283" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="14" fontWeight="700"
      fill="rgba(200,255,0,0.95)">MUMBAI</text>

    {/* DELHI */}
    <circle cx="224" cy="118" r="18" fill="none"
      stroke="#c8ff00" strokeWidth="0.8"
      style={{animation:"ringpulse 3s 0.5s infinite"}}/>
    <circle cx="224" cy="118" r="7" fill="#c8ff00"
      style={{animation:"dotpulse 3s 0.5s infinite"}}/>
    <text x="238" y="123" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="14" fontWeight="700"
      fill="rgba(200,255,0,0.95)">DELHI</text>

    {/* BENGALURU */}
    <circle cx="236" cy="388" r="18" fill="none"
      stroke="#c8ff00" strokeWidth="0.8"
      style={{animation:"ringpulse 3s 1s infinite"}}/>
    <circle cx="236" cy="388" r="7" fill="#c8ff00"
      style={{animation:"dotpulse 3s 1s infinite"}}/>
    <text x="250" y="393" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="14" fontWeight="700"
      fill="rgba(200,255,0,0.95)">BENGALURU</text>

    {/* KOLKATA */}
    <circle cx="322" cy="218" r="18" fill="none"
      stroke="#c8ff00" strokeWidth="0.8"
      style={{animation:"ringpulse 3s 1.5s infinite"}}/>
    <circle cx="322" cy="218" r="7" fill="#c8ff00"
      style={{animation:"dotpulse 3s 1.5s infinite"}}/>
    <text x="336" y="223" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="14" fontWeight="700"
      fill="rgba(200,255,0,0.95)">KOLKATA</text>

    {/* CHENNAI */}
    <circle cx="258" cy="418" r="18" fill="none"
      stroke="#c8ff00" strokeWidth="0.8"
      style={{animation:"ringpulse 3s 2s infinite"}}/>
    <circle cx="258" cy="418" r="7" fill="#c8ff00"
      style={{animation:"dotpulse 3s 2s infinite"}}/>
    <text x="272" y="423" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="14" fontWeight="700"
      fill="rgba(200,255,0,0.95)">CHENNAI</text>

    {/* HYDERABAD */}
    <circle cx="248" cy="330" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 0.8s infinite"}}/>
    <text x="256" y="334" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="10" fontWeight="700"
      fill="rgba(200,255,0,0.6)">HYDERABAD</text>

    {/* PUNE */}
    <circle cx="168" cy="298" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.2s infinite"}}/>

    {/* AHMEDABAD */}
    <circle cx="162" cy="208" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.8s infinite"}}/>
    <text x="170" y="212" fontFamily="'Barlow Condensed',sans-serif"
      fontSize="10" fontWeight="700"
      fill="rgba(200,255,0,0.6)">AHMEDABAD</text>

    {/* JAIPUR */}
    <circle cx="196" cy="148" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 2.2s infinite"}}/>

    {/* LUCKNOW */}
    <circle cx="262" cy="158" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 0.3s infinite"}}/>

    {/* NAGPUR */}
    <circle cx="244" cy="258" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.6s infinite"}}/>

    {/* BHOPAL */}
    <circle cx="218" cy="218" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 0.7s infinite"}}/>

    {/* KOCHI */}
    <circle cx="208" cy="432" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 2.4s infinite"}}/>

    {/* PATNA */}
    <circle cx="284" cy="178" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.1s infinite"}}/>

    {/* SURAT */}
    <circle cx="154" cy="238" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 0.6s infinite"}}/>

    {/* CHANDIGARH */}
    <circle cx="210" cy="98" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.4s infinite"}}/>

    {/* VISAKHAPATNAM */}
    <circle cx="298" cy="318" r="5" fill="#c8ff00" opacity="0.6"
      style={{animation:"dotpulse 3s 1.9s infinite"}}/>
  </svg>

  <style>{`
    @keyframes dotpulse {
      0%,100% { opacity: 1; }
      50% { opacity: 0.2; }
    }
    @keyframes ringpulse {
      0% { r: 10; opacity: 0.8; }
      100% { r: 26; opacity: 0; }
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