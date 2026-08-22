import { useState } from "react";

const ANTHROPIC_API = "/api/chat";

async function generateMetricsFramework(inputs) {
  const prompt = `You are a senior product manager and metrics expert at a top tech company. Generate a rigorous, specific metrics framework for the following product.

Product Name: ${inputs.productName}
Product Description: ${inputs.description}
Primary User: ${inputs.primaryUser}
Product Stage: ${inputs.stage}
Business Model: ${inputs.businessModel}
Problem it solves: ${inputs.problem}

Generate a metrics framework. Be specific to THIS product — not generic. Every metric should be directly tied to the product's core value exchange.

Respond ONLY with a JSON object, no preamble or markdown:
{
  "northStar": {
    "metric": "<metric name>",
    "why": "<1-2 sentences explaining why this captures value delivered, not just activity>",
    "vanityAlternative": "<the obvious but wrong metric most PMs would choose>",
    "whyVanityIsBad": "<1 sentence explaining why the vanity metric is misleading for this product>"
  },
  "inputMetrics": [
    {
      "metric": "<metric name>",
      "criticality": "Critical Path",
      "why": "<why this leads the north star>",
      "badVersion": "<the lazy version of this metric that sounds similar but is actually a vanity metric>"
    },
    {
      "metric": "<metric name>",
      "criticality": "High",
      "why": "<why this leads the north star>",
      "badVersion": "<the lazy version of this metric>"
    },
    {
      "metric": "<metric name>",
      "criticality": "Medium",
      "why": "<why this leads the north star>",
      "badVersion": "<the lazy version of this metric>"
    }
  ],
  "guardrailMetric": {
    "metric": "<metric name>",
    "gamingRisk": "<how someone could game the north star without this guardrail>",
    "why": "<why this protects real value>"
  },
  "secondarySuccessMetric": {
    "metric": "<metric name>",
    "userType": "<which edge case user type this captures>",
    "why": "<why the north star misses this user and why they still matter>"
  },
  "constellation": "<2-3 sentence summary of how these metrics work together to tell the complete story of product health>"
}`;

  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 4096,
      thinking: { type: "disabled" },
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

const STAGES = ["Early / Discovery", "Growth", "Mature / Optimisation"];
const MODELS = ["Free", "Freemium", "Subscription", "Platform / Marketplace", "Enterprise / B2B"];

const CRITICALITY = {
  "Critical Path": { border: "#e85d4a", badge: "#e85d4a", badgeText: "#ffffff" },
  "High":          { border: "#0f766e", badge: "#0f766e", badgeText: "#ffffff" },
  "Medium":        { border: "#e8ddd0", badge: "#fff1ef", badgeText: "#6b5440" }
};

export default function App() {
  const [inputs, setInputs] = useState({
    productName: "", description: "", primaryUser: "",
    stage: "", businessModel: "", problem: ""
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("good");
  const [exampleUsed, setExampleUsed] = useState(false);
  const [exampleHover, setExampleHover] = useState(false);
  const [clearHover, setClearHover] = useState(false);

  const update = (field, val) => setInputs(p => ({ ...p, [field]: val }));
  const allFilled = Object.values(inputs).every(v => v.trim() !== "");
  const hasContent = Object.values(inputs).some(v => v.trim() !== "") || results || error;

  function clearForm() {
    setInputs({
      productName: "", description: "", primaryUser: "",
      stage: "", businessModel: "", problem: ""
    });
    setResults(null);
    setError(null);
    setExampleUsed(false);
    setActiveTab("good");
  }

  function loadExample() {
    setInputs({
      productName: "Stripe Connect",
      description: "A platform API that enables marketplaces to handle multi-party payments, splits, and payouts across multiple sellers and countries",
      primaryUser: "Marketplace developers integrating payments for the first time",
      stage: "Growth",
      businessModel: "Platform / Marketplace",
      problem: "Developers would have to build complex payment splitting, compliance logic, and multi-country payout infrastructure from scratch — taking months and requiring deep financial and legal expertise"
    });
    setExampleUsed(true);
    setResults(null);
    setError(null);
  }

  async function handleGenerate() {
    if (!allFilled) return;
    setLoading(true); setError(null); setResults(null);
    try {
      const framework = await generateMetricsFramework(inputs);
      setResults(framework);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    width: "100%", background: "#fff", border: "1px solid #e8ddd0",
    borderRadius: "8px", padding: "10px 14px", color: "#1a1208",
    fontSize: "14px", fontFamily: "'DM Mono', monospace", resize: "none"
  };

  const lbl = {
    color: "#4a3520", fontSize: "12px", fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.08em", display: "block", marginBottom: "6px"
  };

  const card = {
    background: "#fff", border: "1px solid #e8ddd0",
    borderRadius: "12px", padding: "22px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", color: "#1e293b", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <svg style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="chartrow" x="0" y="0" width="340" height="120" patternUnits="userSpaceOnUse">
<g opacity="0.09" transform="translate(8, 28)">
                <line x1="4" y1="52" x2="68" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="4" x2="4" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="35" x2="68" y2="35" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="4" y1="18" x2="68" y2="18" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <rect x="8" y="30" width="10" height="22" fill="#0f766e" rx="1"/>
                <rect x="22" y="18" width="10" height="34" fill="#0f766e" rx="1"/>
                <rect x="36" y="24" width="10" height="28" fill="#e85d4a" rx="1"/>
                <rect x="50" y="10" width="10" height="42" fill="#0f766e" rx="1"/>
              </g>
<g opacity="0.09" transform="translate(98, 28)">
                <line x1="4" y1="52" x2="78" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="4" x2="4" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="35" x2="78" y2="35" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="4" y1="18" x2="78" y2="18" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <polyline points="8,44 24,32 40,38 56,20 72,24" fill="none" stroke="#0f766e" strokeWidth="1.5" strokeLinejoin="round"/>
                <polyline points="8,48 24,40 40,44 56,30 72,34" fill="none" stroke="#e85d4a" strokeWidth="1" strokeLinejoin="round" strokeDasharray="4,2"/>
                <circle cx="8" cy="44" r="2.5" fill="#0f766e"/>
                <circle cx="24" cy="32" r="2.5" fill="#0f766e"/>
                <circle cx="40" cy="38" r="2.5" fill="#0f766e"/>
                <circle cx="56" cy="20" r="2.5" fill="#e85d4a"/>
                <circle cx="72" cy="24" r="2.5" fill="#0f766e"/>
              </g>
<g opacity="0.09" transform="translate(196, 28)">
                <circle cx="30" cy="26" r="24" fill="#f1f5f9"/>
                <path d="M30,26 L30,2 A24,24 0 0,1 54,26 Z" fill="#0f766e"/>
                <path d="M30,26 L54,26 A24,24 0 0,1 18,47.8 Z" fill="#e85d4a"/>
                <path d="M30,26 L18,47.8 A24,24 0 0,1 6,14 Z" fill="#0f766e" opacity="0.5"/>
                <path d="M30,26 L6,14 A24,24 0 0,1 30,2 Z" fill="#64748b" opacity="0.4"/>
                <circle cx="30" cy="26" r="9" fill="white" opacity="0.7"/>
              </g>
<g opacity="0.09" transform="translate(268, 28)">
                <line x1="4" y1="52" x2="68" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="4" x2="4" y2="52" stroke="#64748b" strokeWidth="1"/>
                <line x1="4" y1="35" x2="68" y2="35" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <line x1="4" y1="18" x2="68" y2="18" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3,3"/>
                <circle cx="12" cy="44" r="3" fill="#0f766e"/>
                <circle cx="24" cy="34" r="4" fill="#e85d4a"/>
                <circle cx="36" cy="40" r="2.5" fill="#0f766e"/>
                <circle cx="48" cy="20" r="4" fill="#0f766e"/>
                <circle cx="58" cy="28" r="3" fill="#e85d4a"/>
                <circle cx="66" cy="10" r="3.5" fill="#0f766e"/>
              </g>

            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chartrow)"/>
        </svg>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input, textarea, select { outline: none; }
        input::placeholder, textarea::placeholder { color: #cbd5e1; }
        input:focus, textarea:focus, select:focus { border-color: #e85d4a !important; box-shadow: 0 0 0 3px rgba(232,93,74,0.12); }
        select option { background: #fff; color: #1a1208; }
        .gbtn:hover:not(:disabled) { background: #d04a38 !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(232,93,74,0.25) !important; }
        .gbtn:disabled { opacity: 0.35; cursor: not-allowed; }
        .tbtn:hover { background: #fff1ef !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .acard { animation: fadeUp 0.35s ease forwards; }
        .dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#94a3b8; animation: blink 1.4s ease infinite; }
        .dot:nth-child(2){animation-delay:.2s}
        .dot:nth-child(3){animation-delay:.4s}
      `}</style>

      <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>
<header style={{ marginBottom: "44px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: "400", fontFamily: "'DM Serif Display', serif", margin: "0 0 16px", color: "#1a1208", lineHeight: 1.1 }}>
            Platform Metrics<br />Framework Builder
          </h1>
          <p style={{ color: "#4a3520", fontSize: "15px", maxWidth: "520px", lineHeight: "1.7", margin: "0 auto" }}>
            Input your product context and get a rigorous metrics framework covering your north star, input metrics, guardrails, and the vanity metrics to avoid.
          </p>
        </header>
<section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "32px", marginBottom: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
            <div>
              <label style={lbl}>PRODUCT NAME</label>
              <input value={inputs.productName} onChange={e => update("productName", e.target.value)} placeholder="e.g. Stripe Connect" style={inp} />
            </div>
            <div>
              <label style={lbl}>PRIMARY USER</label>
              <input value={inputs.primaryUser} onChange={e => update("primaryUser", e.target.value)} placeholder="e.g. Marketplace developers" style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={lbl}>DESCRIBE YOUR PRODUCT IN ONE SENTENCE</label>
            <input value={inputs.description} onChange={e => update("description", e.target.value)}
              placeholder="e.g. A platform API that enables marketplaces to handle multi-party payments and payouts" style={inp} />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={lbl}>WHAT WOULD YOUR USER STRUGGLE WITH IF THIS PRODUCT DIDN'T EXIST?</label>
            <textarea value={inputs.problem} onChange={e => update("problem", e.target.value)}
              placeholder="e.g. Developers would have to build complex payment splitting, compliance, and payout logic from scratch for every country they operate in"
              rows={3} style={inp} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "24px" }}>
            <div>
              <label style={lbl}>PRODUCT STAGE</label>
              <select value={inputs.stage} onChange={e => update("stage", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="">Select stage...</option>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>BUSINESS MODEL</label>
              <select value={inputs.businessModel} onChange={e => update("businessModel", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                <option value="">Select model...</option>
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <button
              onClick={clearForm}
              disabled={!hasContent}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.04em", background: !hasContent ? "transparent" : clearHover ? "#f1f5f9" : "transparent", color: !hasContent ? "#cbd5e1" : "#6b5440", border: `1px solid ${!hasContent ? "#e2e8f0" : "#cbd5e1"}`, borderRadius: "6px", padding: "7px 16px", cursor: !hasContent ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: !hasContent ? 0.5 : 1 }}
              onMouseEnter={() => hasContent && setClearHover(true)}
              onMouseLeave={() => setClearHover(false)}>
              ↺ Clear
            </button>
            <button
              onClick={loadExample}
              disabled={exampleUsed}
              style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", letterSpacing: "0.04em", background: exampleUsed ? "transparent" : exampleHover ? "#0f766e" : "transparent", color: exampleUsed ? "#cbd5e1" : exampleHover ? "#ffffff" : "#0f766e", border: `1px solid ${exampleUsed ? "#e2e8f0" : "#0f766e"}`, borderRadius: "6px", padding: "7px 16px", cursor: exampleUsed ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: exampleUsed ? 0.5 : 1 }}
              onMouseEnter={() => !exampleUsed && setExampleHover(true)}
              onMouseLeave={() => setExampleHover(false)}>
              {exampleUsed ? "Example loaded ✓" : "Try an Example →"}
            </button>
          </div>
          <button className="gbtn" onClick={handleGenerate} disabled={loading || !allFilled}
            style={{ width: "100%", background: "#e85d4a", border: "none", borderRadius: "8px", padding: "13px", color: "#f8fafc", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}>
            {loading
              ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                  <span className="dot" /><span className="dot" /><span className="dot" />
                  <span style={{ marginLeft: "10px", color: "#94a3b8" }}>Generating framework...</span>
                </span>
              : "Generate Metrics Framework →"}
          </button>
        </section>

        {error && (
          <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "10px", padding: "14px", marginBottom: "20px", color: "#be123c", fontSize: "13px", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>
            ✗ {error}
          </div>
        )}

        {results && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
<div className="acard">
              <p style={{ fontSize: "13px", color: "#2d1f0e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "500" }}>01 · NORTH STAR METRIC</p>
              <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
                {["good", "bad"].map(t => (
                  <button key={t} className="tbtn" onClick={() => setActiveTab(t)}
                    style={{ background: activeTab === t ? "#e85d4a" : "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "5px 14px", color: activeTab === t ? "#ffffff" : "#6b5440", fontSize: "11px", cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s", letterSpacing: "0.04em" }}>
                    {t === "good" ? "✓ RIGHT METRIC" : "✗ VANITY METRIC"}
                  </button>
                ))}
              </div>
              {activeTab === "good"
                ? <div style={card}>
                    <div style={{ fontSize: "20px", fontFamily: "'DM Serif Display', serif", color: "#1a1208", marginBottom: "10px" }}>{results.northStar.metric}</div>
                    <p style={{ color: "#2d1f0e", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{results.northStar.why}</p>
                  </div>
                : <div style={{ ...card, background: "#fff5f5", borderColor: "#fecaca" }}>
                    <div style={{ fontSize: "20px", fontFamily: "'DM Serif Display', serif", color: "#dc2626", marginBottom: "10px" }}>{results.northStar.vanityAlternative}</div>
                    <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{results.northStar.whyVanityIsBad}</p>
                  </div>
              }
            </div>
<div className="acard" style={{ animationDelay: "0.08s" }}>
              <p style={{ fontSize: "13px", color: "#2d1f0e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "500" }}>02 · INPUT METRICS — LEADING INDICATORS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {results.inputMetrics.map((m, i) => {
                  const c = CRITICALITY[m.criticality] || CRITICALITY["Medium"];
                  return (
                    <div key={i} style={{ background: "#fff", border: `1px solid ${c.border}`, borderRadius: "10px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <span style={{ fontSize: "15px", fontFamily: "'DM Serif Display', serif", color: "#1a1208" }}>{m.metric}</span>
                        <span style={{ background: c.badge, borderRadius: "4px", padding: "2px 8px", fontSize: "9px", color: c.badgeText, fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                          {m.criticality.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ color: "#2d1f0e", fontSize: "14px", lineHeight: "1.6", margin: "0 0 10px" }}>{m.why}</p>
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "10px" }}>
                        <span style={{ fontSize: "9px", color: "#0f766e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>✗ VANITY VERSION: </span>
                        <span style={{ fontSize: "14px", color: "#0f766e" }}>{m.badVersion}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
<div className="acard" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", animationDelay: "0.16s" }}>
              <div>
                <p style={{ fontSize: "13px", color: "#2d1f0e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "500" }}>03 · GUARDRAIL METRIC</p>
                <div style={{ ...card, height: "calc(100% - 28px)" }}>
                  <div style={{ fontSize: "15px", fontFamily: "'DM Serif Display', serif", color: "#1a1208", marginBottom: "8px" }}>{results.guardrailMetric.metric}</div>
                  <p style={{ color: "#2d1f0e", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" }}>{results.guardrailMetric.why}</p>
                  <div style={{ background: "#fff1ef", border: "1px solid #fcd0c8", borderRadius: "6px", padding: "10px" }}>
                    <span style={{ fontSize: "9px", color: "#e85d4a", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>⚠ GAMING RISK</span>
                    <span style={{ fontSize: "14px", color: "#d04a38", lineHeight: "1.5" }}>{results.guardrailMetric.gamingRisk}</span>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#2d1f0e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "500" }}>04 · SECONDARY SUCCESS METRIC</p>
                <div style={{ ...card, height: "calc(100% - 28px)" }}>
                  <div style={{ fontSize: "15px", fontFamily: "'DM Serif Display', serif", color: "#1a1208", marginBottom: "8px" }}>{results.secondarySuccessMetric.metric}</div>
                  <p style={{ color: "#2d1f0e", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" }}>{results.secondarySuccessMetric.why}</p>
                  <div style={{ background: "#f0fdfa", border: "1px solid #99e6df", borderRadius: "6px", padding: "10px" }}>
                    <span style={{ fontSize: "9px", color: "#0f766e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>◈ CAPTURES USER TYPE</span>
                    <span style={{ fontSize: "14px", color: "#0d6460", lineHeight: "1.5" }}>{results.secondarySuccessMetric.userType}</span>
                  </div>
                </div>
              </div>
            </div>
<div className="acard" style={{ animationDelay: "0.24s" }}>
              <p style={{ fontSize: "13px", color: "#2d1f0e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "500" }}>05 · METRIC CONSTELLATION</p>
              <div style={card}>
                <p style={{ color: "#2d1f0e", fontSize: "15px", lineHeight: "1.8", margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: "500" }}>{results.constellation}</p>
              </div>
            </div>

            <p style={{ textAlign: "center", fontSize: "11px", color: "#6b5440", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em", marginTop: "16px" }}>
              Built as a portfolio project
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
