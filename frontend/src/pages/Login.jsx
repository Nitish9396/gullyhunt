import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Auth.module.css";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      return toast.error("Fill in all fields");
    }
    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success("Welcome back! 🏏");
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

        <h2 className={`heading ${styles.h2}`}>Welcome back</h2>
        <p className={styles.sub}>Login to find or post games</p>

        <div className={styles.form}>
          <div className={styles.group}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className={styles.group}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <button
            className={styles.submit}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login →"}
          </button>
        </div>

        <p className={styles.switch}>
          New to GullyHunt?{" "}
          <Link to="/register" className={styles.link}>
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}