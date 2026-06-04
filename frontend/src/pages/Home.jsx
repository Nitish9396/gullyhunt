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

      <div className={styles.indiaMap}>
  <svg
  viewBox="0 0 550 620"
  style={{
    width: "100%",
    height: "auto",
    maxHeight: "700px",
  }}
  xmlns="http://www.w3.org/2000/svg"
>
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

    <section className={styles.mapSection}>
      <div
        className={styles.indiaMap}
        style={{
          width: "100%",
          minHeight: "700px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg
          viewBox="0 0 550 620"
          style={{ width: "100%", maxWidth: "500px", height: "auto" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ACCURATE INDIA OUTLINE */}
          <path
            fill="rgba(200,255,0,0.06)"
            stroke="rgba(200,255,0,0.35)"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M258,30 L266,26 L275,24 L285,24 L295,26 L305,30
               L315,36 L323,44 L329,52 L333,60 L337,66 L343,70
               L351,72 L358,76 L363,82 L364,90 L360,98 L354,104
               L348,110 L344,118 L346,128 L350,138 L356,150
               L361,162 L365,175 L368,188 L370,200 L372,212
               L374,224 L376,234 L378,244 L378,254 L374,263
               L368,271 L360,278 L352,286 L344,295 L337,305
               L330,316 L323,327 L316,338 L309,350 L302,361
               L295,372 L288,382 L281,391 L274,399 L267,406
               L260,412 L253,406 L246,397 L239,387 L232,376
               L225,365 L218,354 L211,343 L204,332 L197,321
               L190,310 L183,299 L177,288 L171,277 L165,266
               L160,255 L155,244 L151,233 L148,222 L145,211
               L143,200 L141,189 L140,178 L139,167 L139,156
               L140,145 L142,134 L145,124 L149,114 L154,105
               L160,96 L167,88 L175,81 L184,75 L193,70
               L203,65 L213,61 L223,57 L233,53 L242,49
               L250,44 L255,38 Z"
          />
          {/* KASHMIR */}
          <path
            fill="rgba(200,255,0,0.06)"
            stroke="rgba(200,255,0,0.3)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M258,30 L255,38 L250,44 L242,49 L235,44
               L228,38 L222,30 L225,22 L233,16 L243,13
               L253,14 L261,18 L266,26 Z"
          />
          {/* NORTHEAST */}
          <path
            fill="rgba(200,255,0,0.06)"
            stroke="rgba(200,255,0,0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            d="M370,200 L380,194 L392,190 L404,188 L414,192
               L418,200 L414,210 L404,216 L392,218 L380,214
               L372,212 Z"
          />
          {/* ANDAMAN */}
          <ellipse cx="450" cy="380" rx="7" ry="22"
            fill="rgba(200,255,0,0.04)"
            stroke="rgba(200,255,0,0.2)" strokeWidth="1.2"/>
          {/* SRI LANKA */}
          <ellipse cx="295" cy="480" rx="12" ry="20"
            fill="rgba(200,255,0,0.03)"
            stroke="rgba(200,255,0,0.15)" strokeWidth="1"/>

          {/* MUMBAI */}
          <circle cx="168" cy="310" r="20" fill="none"
            stroke="rgba(200,255,0,0.5)" strokeWidth="1"
            style={{animation:"ringpulse 3s 0s infinite",
              transformOrigin:"168px 310px"}}/>
          <circle cx="168" cy="310" r="7" fill="#c8ff00"
            style={{animation:"dotpulse 3s 0s infinite"}}/>
          <text x="182" y="315"
            fontFamily="'Barlow Condensed',sans-serif"
            fontSize="15" fontWeight="700"
            fill="#c8ff00">MUMBAI</text>

          {/* DELHI */}
          <circle cx="262" cy="138" r="20" fill="none"
            stroke="rgba(200,255,0,0.5)" strokeWidth="1"
            style={{animation:"ringpulse 3s 0.6s infinite",
              transformOrigin:"262px 138px"}}/>
          <circle cx="262" cy="138" r="7" fill="#c8ff00"
            style={{animation:"dotpulse 3s 0.6s infinite"}}/>
          <text x="276" y="143"
            fontFamily="'Barlow Condensed',sans-serif"
            fontSize="15" fontWeight="700"
            fill="#c8ff00">DELHI</text>

          {/* KOLKATA */}
          <circle cx="362" cy="248" r="20" fill="none"
            stroke="rgba(200,255,0,0.5)" strokeWidth="1"
            style={{animation:"ringpulse 3s 1s infinite",
              transformOrigin:"362px 248px"}}/>
          <circle cx="362" cy="248" r="7" fill="#c8ff00"
            style={{animation:"dotpulse 3s 1s infinite"}}/>
          <text x="376" y="253"
            fontFamily="'Barlow Condensed',sans-serif"
            fontSize="15" fontWeight="700"
            fill="#c8ff00">KOLKATA</text>

          {/* BENGALURU */}
          <circle cx="252" cy="400" r="20" fill="none"
            stroke="rgba(200,255,0,0.5)" strokeWidth="1"
            style={{animation:"ringpulse 3s 1.4s infinite",
              transformOrigin:"252px 400px"}}/>
          <circle cx="252" cy="400" r="7" fill="#c8ff00"
            style={{animation:"dotpulse 3s 1.4s infinite"}}/>
          <text x="266" y="405"
            fontFamily="'Barlow Condensed',sans-serif"
            fontSize="15" fontWeight="700"
            fill="#c8ff00">BENGALURU</text>

          {/* CHENNAI */}
          <circle cx="278" cy="430" r="20" fill="none"
            stroke="rgba(200,255,0,0.5)" strokeWidth="1"
            style={{animation:"ringpulse 3s 2s infinite",
              transformOrigin:"278px 430px"}}/>
          <circle cx="278" cy="430" r="7" fill="#c8ff00"
            style={{animation:"dotpulse 3s 2s infinite"}}/>
          <text x="292" y="435"
            fontFamily="'Barlow Condensed',sans-serif"
            fontSize="15" fontWeight="700"
            fill="#c8ff00">CHENNAI</text>

          {/* SMALLER CITIES */}
          {[
            [255,310],[192,248],[210,168],[280,198],
            [265,268],[218,108],[228,448],[305,178],
            [165,285],[172,230],[295,338],
          ].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="5"
              fill="#c8ff00" opacity="0.5"
              style={{animation:`dotpulse 3s ${i*0.25}s infinite`}}
            />
          ))}

          <style>{`
            @keyframes dotpulse {
              0%,100% { opacity: 1; }
              50% { opacity: 0.2; }
            }
            @keyframes ringpulse {
              0% { transform: scale(0.5); opacity: 0.8; }
              100% { transform: scale(1.8); opacity: 0; }
            }
          `}</style>
        </svg>
      </div>
    </section>

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