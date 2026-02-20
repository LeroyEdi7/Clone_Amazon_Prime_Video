import { useState, useEffect, useRef } from "react";
import heroBg from "./mainbackground-en.png";

// ─── Inline Styles ────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: 16px; }
  img { max-width: 100%; height: auto; }
  body, main, footer, p, h1, ul, li { padding: 0; margin: 0; }
  ul { list-style: none; }
  a { text-decoration: none; }
  body { margin: 0; font-family: 'Lato', arial; }

  .light-theme { background-color: #ffffff; color: #111; }
  .dark-theme  { background-color: #000000; color: #E1E1E1; }

  /* Smooth scroll */
  html { scroll-behavior: smooth; }

  /* Search input transition */
  .search-input {
    width: 0; opacity: 0; margin-left: 12px;
    padding: 10px 14px; height: 40px; border-radius: 4px;
    border: none; outline: none; font-size: 16px;
    background-color: #ffffff;
    transition: width 0.3s ease, opacity 0.3s ease;
  }
  .search-input.active { width: 320px; opacity: 1; }

  /* Form label float */
  .form-group { position: relative; margin-bottom: 25px; }
  .form-group label {
    position: absolute; left: 14px; top: 14px;
    color: #777; font-size: 14px; pointer-events: none; transition: 0.3s;
  }
  .form-group input:focus + label,
  .form-group textarea:focus + label,
  .form-group input:valid + label,
  .form-group textarea:valid + label {
    top: -10px; font-size: 12px; color: #0F79AF;
  }

  /* Alert slide */
  .custom-alert { position: fixed; top: 20px; right: -400px; width: 320px; z-index: 9999; transition: right 0.5s ease; }
  .custom-alert.show { right: 20px; }

  /* Channel hover */
  .channel:hover { transition: 0.3s; box-shadow: 0 0 1em black; }

  /* Responsive */
  @media (max-width: 768px) {
    .search-input.active { width: 200px !important; }
  }
`;

// ─── SVG placeholders (inline, since we don't have actual files) ──────────────
const LogoSVG = () => (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="28" fontFamily="Lato" fontWeight="700" fontSize="22" fill="#00A8E1">prime</text>
    <text x="62" y="28" fontFamily="Lato" fontWeight="300" fontSize="16" fill="#ffffff">video</text>
  </svg>
);

const FooterLogoSVG = () => (
  <svg width="150" height="50" viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="35" fontFamily="Lato" fontWeight="700" fontSize="28" fill="#00A8E1">prime</text>
    <text x="78" y="35" fontFamily="Lato" fontWeight="300" fontSize="20" fill="#aaa">video</text>
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" fill="none" stroke="#E1E1E1" strokeWidth="2" viewBox="0 0 24 24" style={{cursor:'pointer'}}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const GlobalIcon = () => (
  <svg width="18" height="18" fill="none" stroke="#E1E1E1" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
  </svg>
);

const ArrowDown = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{marginLeft:5,verticalAlign:'middle'}}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const AccIcon = () => (
  <svg width="25" height="25" fill="none" stroke="#E1E1E1" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [searchActive, setSearchActive] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showAccMenu, setShowAccMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formStatus, setFormStatus] = useState({ msg: "", color: "" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const searchWrapperRef = useRef(null);
  const categoriesRef = useRef(null);
  const languagesRef = useRef(null);
  const accMenuRef = useRef(null);
  const alertTimerRef = useRef(null);

  const isLight = theme === "light";

  // Set browser tab title
  useEffect(() => {
    document.title = "Welcome to Prime Video";
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setSearchActive(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        // only close if click is truly outside
        const trigger = document.getElementById("categories-trigger");
        if (trigger && !trigger.contains(e.target)) setShowCategories(false);
      }
      if (languagesRef.current && !languagesRef.current.contains(e.target)) {
        const trigger = document.getElementById("lang-trigger");
        if (trigger && !trigger.contains(e.target)) setShowLanguages(false);
      }
      if (accMenuRef.current && !accMenuRef.current.contains(e.target)) {
        const trigger = document.getElementById("acc-trigger");
        if (trigger && !trigger.contains(e.target)) setShowAccMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Form handlers
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    if (!name || !email || !message) {
      setFormStatus({ msg: "Please fill all fields.", color: "red" }); return;
    }
    if (!validateEmail(email)) {
      setFormStatus({ msg: "Please enter a valid email.", color: "red" }); return;
    }
    setFormStatus({ msg: "", color: "" });
    setFormData({ name: "", email: "", message: "" });
    showCustomAlert();
  };

  const showCustomAlert = () => {
    setShowAlert(true);
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    alertTimerRef.current = setTimeout(() => setShowAlert(false), 4000);
  };

  // ── Theme-aware colors ──────────────────────────────────────────────────────
  const bg       = isLight ? "#ffffff" : "#000000";
  const navBg    = isLight ? "#ffffff" : "#000000";
  const textCol  = isLight ? "#111" : "#E1E1E1";
  const sectionBg= isLight ? "#f5f5f5" : "#000";
  const darkSect = isLight ? "#e8e8e8" : "#0D0D0D";
  const inputBg  = isLight ? "#fff" : "#1a1a1a";
  const inputBdr = isLight ? "#ccc" : "#333";
  const alertBg  = isLight ? "#fff" : "#1a1a1a";
  const alertCol = isLight ? "#000" : "#fff";
  const footerBg = isLight ? "#eaeaea" : "#131414";

  return (
    <>
      {/* Inject global styles */}
      <style>{globalStyles}</style>

      <div style={{ background: bg, color: textCol, minHeight: "100vh" }} className={isLight ? "light-theme" : "dark-theme"}>

        {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
        <header style={{
          display: "flex", justifyContent: "space-between",
          position: "fixed", width: "100%", height: 80,
          padding: "0 5vw", alignItems: "center",
          backgroundColor: navBg, zIndex: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
        }}>
          {/* Left nav */}
          <ul style={{ display: "flex", alignItems: "center", gap: 0, fontFamily: "Lato", fontSize: 18, listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "0 30px", cursor: "pointer" }} onClick={() => scrollTo("main")}>
              <LogoSVG />
            </li>
            <li style={{ padding: "0 10px" }}><a href="#main" onClick={(e) => { e.preventDefault(); scrollTo("main"); }} style={{ color: textCol }}>Home</a></li>
            <li style={{ padding: "0 10px" }}><a href="#channels" onClick={(e) => { e.preventDefault(); scrollTo("channels"); }} style={{ color: textCol }}>Movies</a></li>
            <li style={{ padding: "0 10px" }}><a href="#popcorn" onClick={(e) => { e.preventDefault(); scrollTo("popcorn"); }} style={{ color: textCol }}>TV Shows</a></li>
            <li
              id="categories-trigger"
              style={{ padding: "0 10px", cursor: "pointer", fontWeight: "bold", color: textCol, display: "flex", alignItems: "center" }}
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              Categories <ArrowDown />
            </li>
            <li style={{ padding: "0 10px" }}><a href="#" style={{ color: textCol }}>Live TV</a></li>
            <li style={{ padding: "0 10px" }}><a href="#" style={{ color: textCol }}>Subscriptions</a></li>
          </ul>

          {/* Right nav */}
          <ul style={{ display: "flex", alignItems: "center", gap: 20, listStyle: "none", padding: 0, margin: 0 }}>
            {/* Search */}
            <li ref={searchWrapperRef} style={{ display: "flex", alignItems: "center" }}>
              <span onClick={() => { setSearchActive(s => !s); }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                className={`search-input${searchActive ? " active" : ""}`}
              />
            </li>

            {/* Language */}
            <li
              id="lang-trigger"
              style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", color: textCol, userSelect: "none" }}
              onClick={() => { setShowLanguages(s => !s); setShowAccMenu(false); }}
            >
              <GlobalIcon />&nbsp;EN<ArrowDown />
            </li>

            {/* Account */}
            <li
              id="acc-trigger"
              style={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}
              onClick={() => { setShowAccMenu(s => !s); setShowLanguages(false); }}
            >
              <AccIcon /><ArrowDown />
            </li>

            {/* Theme toggle */}
            <li>
              <button onClick={toggleTheme} style={{
                width: 45, height: 40, borderRadius: 5, border: "none", cursor: "pointer",
                fontSize: 18, backgroundColor: "#0F79AF", color: "white", transition: "0.3s"
              }}>
                {isLight ? "☀️" : "🌙"}
              </button>
            </li>

            {/* Join Prime */}
            <li>
              <button style={{
                width: 130, height: 40, backgroundColor: "#0F79AF", border: "none",
                borderRadius: 4, color: "#E1E1E1", fontSize: 16, fontFamily: "Lato",
                fontWeight: "bold", cursor: "pointer"
              }}>Join Prime</button>
            </li>
          </ul>
        </header>

        {/* ── CATEGORIES DROPDOWN ─────────────────────────────────────────────── */}
        {showCategories && (
          <div
            ref={categoriesRef}
            onMouseEnter={() => setShowCategories(true)}
            onMouseLeave={() => setShowCategories(false)}
            style={{
              position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
              width: 1100, maxWidth: "95vw", padding: 30,
              display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 40, alignItems: "start",
              background: "linear-gradient(163deg, #122739 23%, #0c1c2a 48%)",
              color: "white", borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.6)", zIndex: 5
            }}>
            <h2 style={{ fontFamily: "Lato", fontSize: 18, fontWeight: 400, marginBottom: 20, gridColumn: "1 / -1" }}>Top Categories</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 175px)", gap: 20 }}>
              {["Included with Prime", "Amazon Originals and Exclusives", "Movies", "TV", "Kids", "Sports"].map(cat => (
                <div key={cat} style={{
                  width: 175, height: 90, backgroundColor: "#144e77", borderRadius: 4, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                  fontFamily: "Lato", fontSize: 16, fontWeight: 600, padding: "0 20px",
                  transition: "box-shadow 0.2s"
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 0 2px white"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >{cat}</div>
              ))}
            </div>
            <div style={{ width: 1, background: "white", alignSelf: "stretch" }} />
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <div style={{ fontFamily: "Lato", marginBottom: 10, color: "#aaa" }}>Genres</div>
                {["Action and adventure","Comedy","Drama","Documentary","Kids and family","Fantasy","Horror"].map(g => (
                  <div key={g} style={{ fontFamily: "Lato", fontSize: 16, color: "#63758a", paddingTop: 15, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "#63758a"}
                  >{g}</div>
                ))}
              </div>
              <div style={{ marginTop: "3.3%" }}>
                {["Romance","Science fiction","Suspense","Anime","Military and war","Crime"].map(g => (
                  <div key={g} style={{ fontFamily: "Lato", fontSize: 16, color: "#63758a", paddingTop: 15, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "#63758a"}
                  >{g}</div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: "Lato", marginBottom: 10, color: "#aaa" }}>Other categories</div>
                {["Recently added movies","Recently added TV","Award winners","Watch Party","Only for a limited time on Prime"].map(g => (
                  <div key={g} style={{ fontFamily: "Lato", fontSize: 16, color: "#63758a", paddingTop: 15, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "white"}
                    onMouseLeave={e => e.currentTarget.style.color = "#63758a"}
                  >{g}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LANGUAGE DROPDOWN ──────────────────────────────────────────────── */}
        {showLanguages && (
          <div
            ref={languagesRef}
            style={{
              position: "fixed", top: 80, right: 40,
              width: 480, maxWidth: "90vw", maxHeight: "70vh", overflowY: "auto",
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              backgroundColor: "#27323d", borderRadius: 6,
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)", zIndex: 6
            }}>
            {[
              ["Bahasa Indonesia","Bahasa Melayu","Deutsch","English","Español","Français","Italiano","Magyar","Nederlands","Norsk"],
              ["Polski","Português (Brasil)","Português (Portugal)","Română","Suomi","Svenska","Türkçe","Wikang Filipino","Čeština","Ελληνικά"],
              ["עברית","العربية","हिन्दी","தமிழ்","తెలుగు","ไทย","日本語","简体中文","繁體中文","한국어"]
            ].map((col, ci) => (
              <div key={ci} style={{ borderRight: ci < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                {col.map(lang => (
                  <div key={lang} style={{
                    fontFamily: "Lato", fontSize: 16, color: lang === "English" ? "white" : "#c4cacf",
                    padding: "12px 16px", cursor: "pointer"
                  }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#64778a"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    {lang === "English" ? "✓ " : ""}{lang}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* ── ACCOUNT MENU ──────────────────────────────────────────────────── */}
        {showAccMenu && (
          <div ref={accMenuRef} style={{
            position: "fixed", top: 80, right: 40,
            width: 200, backgroundColor: "#27323d",
            boxShadow: "0 0 0.5em black", zIndex: 4, borderRadius: 4
          }}>
            {["Sign In", "Watch Anywhere", "Help"].map(item => (
              <div key={item} style={{
                fontFamily: "Lato", fontSize: 14, color: "rgba(242,244,246,0.9)",
                padding: "14px 22px", borderBottom: "1px solid #434f5d", cursor: "pointer"
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#64778a"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >{item}</div>
            ))}
          </div>
        )}

        {/* ── MODAL BACKDROP ────────────────────────────────────────────────── */}
        {(showLanguages || showAccMenu) && (
          <div
            onClick={() => { setShowLanguages(false); setShowAccMenu(false); }}
            style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100vh",
              background: "rgba(0,0,0,0.5)", zIndex: 3
            }}
          />
        )}

        {/* ── HERO / MAIN ───────────────────────────────────────────────────── */}
        <section id="main" style={{
          minHeight: "100vh",
          paddingTop: 100,
          paddingBottom: 60,
          paddingLeft: "5vw",
          paddingRight: "5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 40,
          backgroundColor: sectionBg,
        }}>
          {/* Left: text */}
          <div style={{ flex: "1 1 340px", maxWidth: 520 }}>
            <p style={{ fontSize: 16, fontFamily: "Lato", fontWeight: 300, color: textCol }}>
              Unlimited movies, TV shows, and more
            </p>
            <h1 style={{ fontSize: 40, fontFamily: "Lato", color: textCol, paddingTop: 30 }}>
              Welcome to Prime Video
            </h1>
            <p style={{ fontSize: 22, fontFamily: "Lato", fontWeight: 300, color: textCol, paddingTop: 20 }}>
              Join Prime to watch the latest movies, TV shows and award-winning Amazon Originals.
            </p>

            <button style={{
              display: "block", width: 340, height: 70, marginTop: 50,
              backgroundColor: "#0F79AF", border: "none", borderRadius: 4,
              fontSize: 20, fontFamily: "Lato", fontWeight: "bold",
              color: "#E1E1E1", cursor: "pointer"
            }}>Prime Member? Sign in</button>

            <div style={{ marginTop: 30, display: "flex", alignItems: "center" }}>
              <svg width="140" height="1" viewBox="0 0 140 1"><rect width="140" height="1" fill={isLight ? "#555" : "#fff"}/></svg>
              <span style={{ fontFamily: "Lato", fontWeight: 300, fontSize: 18, paddingLeft: 20, paddingRight: 20, color: textCol }}>or</span>
              <svg width="140" height="1" viewBox="0 0 140 1"><rect width="140" height="1" fill={isLight ? "#555" : "#fff"}/></svg>
            </div>

            <button style={{
              display: "block", width: 340, height: 70, marginTop: 30,
              backgroundColor: "#0F79AF", border: "none", borderRadius: 4,
              fontSize: 20, fontFamily: "Lato", fontWeight: "bold",
              color: "#E1E1E1", cursor: "pointer"
            }}>Start your 30-day free trial*</button>
          </div>

          {/* Right: hero image — imported at top of file */}
          <div style={{ flex: "1 1 400px", maxWidth: "55%" }}>
            <img
              src={heroBg}
              alt="Prime Video"
              style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
            />
          </div>
        </section>

        {/* ── CHANNELS ──────────────────────────────────────────────────────── */}
        <section id="channels" style={{ padding: "60px 100px", backgroundColor: bg }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>
            <div>
              <h1 style={{ fontSize: 55, fontFamily: "Lato", color: isLight ? "#111" : "white", fontWeight: 300, paddingTop: 80 }}>
                Your favorite channels all in one<br />place
              </h1>
              <p style={{ paddingTop: 30, fontSize: 28, fontFamily: "Lato", fontWeight: 300, color: isLight ? "#444" : "#d3cfcf" }}>
                Customers can subscribe to get access to a variety of premium and specialty content, easily accessible within the Prime Video app
              </p>
            </div>
          </div>

          {/* Channel cards */}
          <div style={{
            marginTop: 60, display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", gap: 20
          }}>
            {[
              { name: "HBO", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/400px-HBO_logo.svg.png", bg: "#1a1a2e" },
              { name: "Showtime", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Showtime.svg/400px-Showtime.svg.png", bg: "#c0392b" },
              { name: "Starz", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Starz_2016.svg/400px-Starz_2016.svg.png", bg: "#000" },
              { name: "Discovery+", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Discovery%2B_logo.svg/400px-Discovery%2B_logo.svg.png", bg: "#0d47a1" },
              { name: "Paramount+", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Paramount_Network_logo.svg/400px-Paramount_Network_logo.svg.png", bg: "#003087" },
              { name: "ESPN+", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN%2B_logo.svg/400px-ESPN%2B_logo.svg.png", bg: "#cc0000" },
              { name: "AMC+", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/AMC_Networks_logo.svg/400px-AMC_Networks_logo.svg.png", bg: "#111" },
              { name: "Cinemax", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cinemax_logo_2014.svg/400px-Cinemax_logo_2014.svg.png", bg: "#1a1a1a" },
              { name: "BritBox", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/BritBox_logo.svg/400px-BritBox_logo.svg.png", bg: "#003087" },
            ].map((ch, i) => (
              <div key={i} className="channel" style={{
                width: "100%", maxWidth: 250, aspectRatio: "16/10",
                background: ch.bg,
                borderRadius: 8, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 20, overflow: "hidden"
              }}>
                <img
                  src={ch.img}
                  alt={ch.name}
                  style={{ maxWidth: "70%", maxHeight: "60%", objectFit: "contain", filter: "brightness(0) invert(1)" }}
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentNode.innerHTML = `<span style="color:white;font-family:Lato;font-weight:bold;font-size:18px">${ch.name}</span>`;
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── POPCORN / STORE ───────────────────────────────────────────────── */}
        <section id="popcorn" style={{
          marginTop: 50, display: "flex", padding: "60px 5vw",
          flexWrap: "wrap", gap: 40, justifyContent: "space-between",
          backgroundColor: darkSect
        }}>
          {/* Movie store image */}
          <div style={{ maxWidth: 650, flex: "1 1 300px" }}>
            <img
              src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80"
              alt="Prime Video Store"
              style={{ width: "100%", height: 500, objectFit: "cover", borderRadius: 12 }}
            />
          </div>

          <div style={{ color: isLight ? "#111" : "white", maxWidth: 500 }}>
            <h2 style={{ paddingTop: 150, fontSize: 40, fontFamily: "Lato", color: isLight ? "#111" : "#E1E1E1", letterSpacing: 2 }}>
              Introducing Prime Video Store
            </h2>
            <p style={{ marginTop: 10, fontSize: 20, fontFamily: "Lato", fontWeight: 300, color: isLight ? "#444" : "#E1E1E1" }}>
              Even more movies, now available to rent—no Prime membership required
            </p>
            <button style={{
              display: "block", width: 280, height: 54, marginTop: 50,
              backgroundColor: "#0F79AF", border: "none",
              fontSize: 20, fontFamily: "Lato", fontWeight: 600,
              color: "#E1E1E1", cursor: "pointer", borderRadius: 4
            }}>Rent movies</button>
          </div>
        </section>

        {/* ── CONTACT FORM ──────────────────────────────────────────────────── */}
        <section id="contact-section" style={{
          backgroundColor: darkSect, padding: "80px 5vw",
          display: "flex", justifyContent: "center"
        }}>
          <div style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
            <h2 style={{ color: isLight ? "#111" : "#E1E1E1", fontFamily: "Lato", fontSize: 36, marginBottom: 10 }}>Contact Us</h2>
            <p style={{ color: "#aaa", marginBottom: 30 }}>Have questions? Send us a message.</p>

            <form onSubmit={handleSubmit}>
              {[
                { id: "name", type: "text", label: "Full Name", val: formData.name, key: "name" },
                { id: "email", type: "email", label: "Email Address", val: formData.email, key: "email" }
              ].map(f => (
                <div key={f.id} className="form-group">
                  <input
                    type={f.type} id={f.id} required
                    value={f.val}
                    onChange={e => setFormData(d => ({ ...d, [f.key]: e.target.value }))}
                    style={{
                      width: "100%", padding: 14, background: inputBg,
                      border: `1px solid ${inputBdr}`, color: isLight ? "#111" : "#fff",
                      fontSize: 16, borderRadius: 5, outline: "none"
                    }}
                  />
                  <label htmlFor={f.id}>{f.label}</label>
                </div>
              ))}

              <div className="form-group">
                <textarea
                  id="message" rows={5} required
                  value={formData.message}
                  onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                  style={{
                    width: "100%", padding: 14, background: inputBg,
                    border: `1px solid ${inputBdr}`, color: isLight ? "#111" : "#fff",
                    fontSize: 16, borderRadius: 5, outline: "none", resize: "vertical"
                  }}
                />
                <label htmlFor="message">Message</label>
              </div>

              <button type="submit" style={{
                width: "100%", height: 50, backgroundColor: "#0F79AF", border: "none",
                color: "white", fontSize: 18, cursor: "pointer", borderRadius: 5, transition: "0.3s"
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1a9ada"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#0F79AF"}
              >Send Message</button>

              {formStatus.msg && (
                <p style={{ marginTop: 15, fontSize: 14, color: formStatus.color }}>{formStatus.msg}</p>
              )}
            </form>
          </div>
        </section>

        {/* ── CUSTOM ALERT ──────────────────────────────────────────────────── */}
        <div id="custom-alert" className={`custom-alert${showAlert ? " show" : ""}`}>
          <div style={{
            background: alertBg, borderLeft: "5px solid #0F79AF",
            padding: 15, display: "flex", alignItems: "center", gap: 12,
            borderRadius: 6, boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            color: alertCol, fontFamily: "Lato"
          }}>
            <span style={{ fontSize: 22, color: "#0F79AF" }}>✓</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Message Sent!</h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#aaa" }}>
                Thank you for contacting us. We'll get back to you soon.
              </p>
            </div>
            <span
              onClick={() => setShowAlert(false)}
              style={{ marginLeft: "auto", cursor: "pointer", fontSize: 18, color: "#aaa" }}
            >&times;</span>
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{
          textAlign: "center", backgroundColor: footerBg,
          width: "100%", padding: "30px 5vw"
        }}>
          <div onClick={() => scrollTo("main")} style={{ cursor: "pointer", display: "inline-block", marginBottom: 10 }}>
            <FooterLogoSVG />
          </div>
          <p style={{ fontSize: 15, fontFamily: "Lato", fontWeight: 500, letterSpacing: 1, color: "#0F79AF" }}>
            Terms and Privacy Notice &emsp; Send us feedback &emsp; Help
            <br /><br />
            <span style={{ color: "#726e6e" }}>©1996-2022, Amazon.com, Inc. or its affiliates</span>
          </p>
        </footer>

      </div>
    </>
  );
}