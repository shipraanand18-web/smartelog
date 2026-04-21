import { useState } from "react";

const eyeOpen = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const eyeClosed = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    email: "owner@fleet.com",
    password: "fleet123",
    name: "",
    company: "",
    phone: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = () => {
    if (isRegister) {
      if (!form.name || !form.email || !form.password || !form.phone || !form.company) {
        setError("Sab fields fill karo!"); return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Password match nahi kar raha!"); return;
      }
      onLogin({ name: form.name, email: form.email, company: form.company });
    } else {
      if (form.email === "owner@fleet.com" && form.password === "fleet123") {
        onLogin({ name: "Shipra", email: form.email, company: "Aatma Smart Fleet Pvt. Ltd." });
      } else {
        setError("Email ya password galat hai!");
      }
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
      position: "relative", overflow: "hidden"
    }}>
      {/* Animated bg circles */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: `${[300,200,150,250,180][i]}px`, height: `${[300,200,150,250,180][i]}px`,
          background: `rgba(${["99,102,241","168,85,247","236,72,153","59,130,246","16,185,129"][i]},0.07)`,
          top: `${[10,60,30,70,5][i]}%`, left: `${[10,70,85,20,50][i]}%`,
          animation: `float${i} ${[8,12,10,15,9][i]}s ease-in-out infinite`,
          filter: "blur(1px)"
        }} />
      ))}

      <style>{`
        @keyframes float0{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(20px,30px) rotate(10deg)}}
        @keyframes float1{0%,100%{transform:translate(0,0)}50%{transform:translate(-25px,20px)}}
        @keyframes float2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(15px,-20px) scale(1.1)}}
        @keyframes float3{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,-15px)}}
        @keyframes float4{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(-10px,25px) rotate(-15deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .inp{width:100%;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.15);border-radius:12px;
             padding:13px 16px;color:#fff;font-size:15px;outline:none;transition:all 0.3s;box-sizing:border-box}
        .inp:focus{border-color:#818cf8;background:rgba(129,140,248,0.1);box-shadow:0 0 0 3px rgba(129,140,248,0.2)}
        .inp::placeholder{color:rgba(255,255,255,0.4)}
        .btn-main{width:100%;padding:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:12px;
                  color:#fff;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s;letter-spacing:0.5px}
        .btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(99,102,241,0.4)}
        .btn-main:active{transform:translateY(0)}
        .eye-btn{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;
                 color:rgba(255,255,255,0.5);cursor:pointer;padding:4px;display:flex;align-items:center}
        .eye-btn:hover{color:#818cf8}
        .tab{flex:1;padding:10px;background:none;border:none;cursor:pointer;font-size:14px;font-weight:500;
             transition:all 0.3s;border-radius:8px}
        .tab.active{background:rgba(129,140,248,0.2);color:#818cf8}
        .tab.inactive{color:rgba(255,255,255,0.5)}
      `}</style>

      <div style={{
        background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px",
        padding: "40px", width: "420px", maxWidth: "95vw",
        animation: "slideIn 0.6s ease-out",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "16px",
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)", margin: "0 auto 12px",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px"
          }}>🚛</div>
          <h1 style={{ color: "#fff", margin: 0, fontSize: "24px", fontWeight: 700 }}>Smart E-Log</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", margin: "4px 0 0", fontSize: "13px" }}>Aatma Smart Fleet Pvt. Ltd.</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "4px", background: "rgba(255,255,255,0.05)",
          borderRadius: "10px", padding: "4px", marginBottom: "24px"
        }}>
          <button className={`tab ${!isRegister ? "active" : "inactive"}`} onClick={() => { setIsRegister(false); setError(""); }}>Login</button>
          <button className={`tab ${isRegister ? "active" : "inactive"}`} onClick={() => { setIsRegister(true); setError(""); }}>New Registration</button>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
            color: "#fca5a5", fontSize: "13px"
          }}>⚠️ {error}</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {isRegister && (
            <>
              <input className="inp" placeholder="Pura Naam" value={form.name} onChange={handle("name")} />
              <input className="inp" placeholder="Company / Organization" value={form.company} onChange={handle("company")} />
              <input className="inp" placeholder="Phone Number" type="tel" value={form.phone} onChange={handle("phone")} />
            </>
          )}

          <input className="inp" placeholder="Email Address" type="email" value={form.email} onChange={handle("email")} />

          <div style={{ position: "relative" }}>
            <input className="inp" placeholder="Password" type={showPass ? "text" : "password"} value={form.password} onChange={handle("password")} style={{ paddingRight: "44px" }} />
            <button className="eye-btn" onClick={() => setShowPass(!showPass)}>{showPass ? eyeOpen : eyeClosed}</button>
          </div>

          {isRegister && (
            <div style={{ position: "relative" }}>
              <input className="inp" placeholder="Confirm Password" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={handle("confirmPassword")} style={{ paddingRight: "44px" }} />
              <button className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? eyeOpen : eyeClosed}</button>
            </div>
          )}

          <button className="btn-main" onClick={submit}>
            {isRegister ? "🚀 Register karo" : "🔐 Login as Owner"}
          </button>
        </div>

        {!isRegister && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "16px" }}>
            Demo: owner@fleet.com / fleet123
          </p>
        )}
      </div>
    </div>
  );
}
