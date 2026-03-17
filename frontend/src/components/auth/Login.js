import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Hospital, Eye, EyeOff, AlertTriangle } from "lucide-react";
import api from "../../services/api";

/* ─────────────────────────────────────────────
   Styles globaux — cohérents avec le système
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue:    #2563eb;
    --blue-lt: #eff6ff;
    --blue-md: #bfdbfe;
    --blue-dk: #1d4ed8;
    --red:     #dc2626;
    --red-lt:  #fef2f2;
    --ink:     #0f172a;
    --muted:   #64748b;
    --border:  #e2e8f0;
    --surface: #ffffff;
    --bg:      #f8fafc;
    --shadow:  0 1px 3px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.08);
    --font-body: 'Sora', sans-serif;
    --font-disp: 'Lora', serif;
    --trans: .2s cubic-bezier(.4,0,.2,1);
  }

  /* ── Input wrapper ── */
  .lg-field { display: flex; flex-direction: column; gap: 6px; }

  .lg-label {
    font-size: 11px; font-weight: 600; letter-spacing: .07em;
    text-transform: uppercase; color: var(--muted);
    font-family: var(--font-body);
    display: flex; align-items: center; gap: 5px;
  }

  .lg-input-wrap {
    position: relative; display: flex; align-items: center;
  }
  .lg-input-icon {
    position: absolute; left: 13px; color: var(--muted);
    display: flex; align-items: center; pointer-events: none;
    transition: color var(--trans);
  }
  .lg-input-wrap:focus-within .lg-input-icon { color: var(--blue); }

  .lg-input-icon-right {
    position: absolute; right: 13px; color: var(--muted);
    display: flex; align-items: center; cursor: pointer;
    background: none; border: none; padding: 0;
    transition: color var(--trans);
  }
  .lg-input-icon-right:hover { color: var(--ink); }

  .lg-input {
    width: 100%; padding: 12px 14px 12px 40px;
    font-size: 15px; font-family: var(--font-body); color: var(--ink);
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 10px; outline: none;
    transition: border-color var(--trans), box-shadow var(--trans), background var(--trans);
  }
  .lg-input.has-right { padding-right: 40px; }
  .lg-input:hover  { border-color: #94a3b8; }
  .lg-input:focus  {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px var(--blue-md);
    background: var(--blue-lt);
  }
  .lg-input.error { border-color: var(--red); box-shadow: 0 0 0 3px #fee2e2; }

  /* ── Alert ── */
  .lg-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 13px 16px; border-radius: 10px;
    font-size: 13px; font-family: var(--font-body);
    line-height: 1.5; font-weight: 500;
    background: var(--red-lt); color: var(--red);
    border: 1px solid #fecaca;
    animation: lgFade .3s ease both;
  }

  /* ── Button ── */
  .lg-btn {
    width: 100%; padding: 13px;
    font-size: 15px; font-weight: 600; font-family: var(--font-body);
    border-radius: 10px; border: none; cursor: pointer;
    background: var(--blue); color: #fff;
    box-shadow: 0 1px 2px rgba(37,99,235,.3), 0 4px 14px rgba(37,99,235,.25);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all var(--trans);
    letter-spacing: .01em;
  }
  .lg-btn:hover:not(:disabled) {
    background: var(--blue-dk); transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(37,99,235,.35), 0 8px 22px rgba(37,99,235,.3);
  }
  .lg-btn:active:not(:disabled) { transform: translateY(0); }
  .lg-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* ── Spinner ── */
  .lg-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,.35);
    border-top-color: #fff;
    border-radius: 50%; animation: lgSpin .7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Page background ── */
  .lg-bg {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    padding: 24px 16px;
    position: relative; overflow: hidden;
  }
  .lg-bg::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 15%, rgba(37,99,235,.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 85%, rgba(37,99,235,.05) 0%, transparent 60%);
    pointer-events: none;
  }

  /* ── Card ── */
  .lg-card {
    background: var(--surface); border-radius: 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    width: 100%; max-width: 420px;
    overflow: hidden;
    animation: lgIn .45s ease both;
    position: relative; z-index: 1;
  }

  .lg-card-header {
    padding: 32px 36px 28px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
    text-align: center;
  }

  .lg-card-body {
    padding: 32px 36px;
    display: flex; flex-direction: column; gap: 20px;
  }

  /* ── Divider ── */
  .lg-divider {
    display: flex; align-items: center; gap: 12px; color: var(--muted);
    font-size: 11px; font-weight: 600; letter-spacing: .08em;
    text-transform: uppercase; font-family: var(--font-body);
  }
  .lg-divider::before, .lg-divider::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  /* ── Animations ── */
  @keyframes lgIn   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  @keyframes lgFade { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  @keyframes lgSpin { to { transform: rotate(360deg); } }
`;

/* ─────────────────────────────────────────────
   Composant
───────────────────────────────────────────── */
const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/users/login/", credentials);
      localStorage.setItem("access_token",  response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin();
      navigate("/dashboard");
    } catch {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = credentials.username.trim() && credentials.password;

  return (
    <>
      <style>{STYLES}</style>

      <div className="lg-bg">
        <div className="lg-card">

          {/* ── En-tête ── */}
          <div className="lg-card-header">
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "var(--blue)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 16px rgba(37,99,235,.35)",
            }}>
              <Hospital size={28} color="#fff" />
            </div>

            <h1 style={{
              fontFamily: "var(--font-disp)",
              fontSize: 22, fontWeight: 600,
              color: "var(--ink)", margin: 0,
            }}>
              Patient Referral System
            </h1>
            <p style={{
              marginTop: 6, fontSize: 13,
              color: "var(--muted)",
              fontFamily: "var(--font-body)",
            }}>
              Connectez-vous à votre compte
            </p>
          </div>

          {/* ── Corps ── */}
          <div className="lg-card-body">

            {error && (
              <div className="lg-alert">
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="lg-divider">Identifiants</div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
              noValidate
            >
              {/* ── Nom d'utilisateur ── */}
              <div className="lg-field">
                <label className="lg-label">
                  <User size={12} />
                  Nom d'utilisateur
                </label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><User size={16} /></span>
                  <input
                    className={`lg-input${error ? " error" : ""}`}
                    type="text"
                    placeholder="ex. dr.mbarga"
                    autoFocus
                    autoComplete="username"
                    value={credentials.username}
                    onChange={e => setCredentials(p => ({ ...p, username: e.target.value }))}
                  />
                </div>
              </div>

              {/* ── Mot de passe ── */}
              <div className="lg-field">
                <label className="lg-label">
                  <Lock size={12} />
                  Mot de passe
                </label>
                <div className="lg-input-wrap">
                  <span className="lg-input-icon"><Lock size={16} /></span>
                  <input
                    className={`lg-input has-right${error ? " error" : ""}`}
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={e => setCredentials(p => ({ ...p, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="lg-input-icon-right"
                    onClick={() => setShowPwd(v => !v)}
                    tabIndex={-1}
                    aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                className="lg-btn"
                disabled={loading || !canSubmit}
                style={{ marginTop: 6 }}
              >
                {loading
                  ? <><span className="lg-spinner" /> Connexion en cours…</>
                  : "Se connecter"
                }
              </button>
            </form>

            {/* ── Footer ── */}
            <p style={{
              textAlign: "center", fontSize: 12,
              color: "#94a3b8", fontFamily: "var(--font-body)",
            }}>
              Système sécurisé · Accès réservé au personnel autorisé
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;