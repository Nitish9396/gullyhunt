import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata",
  "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Lucknow", "Other"
];

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    role: "player",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error("Fill in required fields");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    const res = await register(form);
    if (res.success) {
      toast.success("Account created! Let's find a game 🎉");
      navigate("/find");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <span className={styles.logo}>
          Gully<span>Hunt</span>
        </span>

        <h2 className={`heading ${styles.h2}`}>Join GullyHunt</h2>
        <p className={styles.sub}>Create your free account</p>

        <div className={styles.form}>

          <div className={styles.row2}>
            <div className={styles.group}>
              <label className={styles.label}>Name *</label>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Phone</label>
              <input
                placeholder="+91 XXXXX XXXXX"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>

          <div className={styles.group}>
            <label className={styles.label}>Password *</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </div>

          <div className={styles.row2}>
            <div className={styles.group}>
              <label className={styles.label}>City</label>
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
              <label className={styles.label}>I am a</label>
              <select
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              >
                <option value="player">Player</option>
                <option value="organizer">Organizer</option>
                <option value="turf_owner">Turf Owner</option>
                <option value="stadium_owner">Stadium Owner</option>
              </select>
            </div>
          </div>

          <button
            className={styles.submit}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account →"}
          </button>

        </div>

        <p className={styles.switch}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}