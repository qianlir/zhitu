function MHome({ onNavigate, onOpenSchool }) {
  const [featured, setFeatured] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    Promise.all([API.schools({ limit: 6, sort: "score_desc" }), API.stats()]).then(([r, st]) => {
      setFeatured(r.schools || []);
      setStats(st);
    }).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "mp" }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "16px 0 12px" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-3)", margin: 0 } }, "\u4E0A\u6D77\u4E2D\u8003 \xB7 ", stats ? stats.school_count + "\u6240\u9AD8\u4E2D" : "", " \xB7 AI\u667A\u80FD\u5206\u6790")), /* @__PURE__ */ React.createElement("form", { onSubmit: (e) => {
    e.preventDefault();
    onNavigate("schools", { q });
  }, style: { marginBottom: 16, position: "relative" } }, /* @__PURE__ */ React.createElement("input", { className: "mi", type: "search", enterKeyHint: "search", value: q, onChange: (e) => setQ(e.target.value), placeholder: "\u641C\u7D22\u5B66\u6821\u540D\u3001\u533A\u57DF\u3001\u7279\u8272...", style: { paddingRight: 48 } }), /* @__PURE__ */ React.createElement("button", { type: "submit", style: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "\u{1F50D}")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 } }, [{ icon: "\u{1F50D}", label: "\u67E5\u5B66\u6821", r: "schools" }, { icon: "\u{1F3AF}", label: "AI\u586B\u62A5", r: "recommend" }, { icon: "\u2696\uFE0F", label: "\u5BF9\u6BD4", r: "compare" }].map((f) => /* @__PURE__ */ React.createElement("button", { key: f.r, className: "mc", onClick: () => onNavigate(f.r), style: { textAlign: "center", cursor: "pointer", padding: 14, border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 26, marginBottom: 4 } }, f.icon), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600 } }, f.label)))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 } }, [
    { n: stats?.school_count || "\u2014", l: "\u9AD8\u4E2D", r: "schools" },
    { n: stats?.year_count || "\u2014", l: "\u5E74\u6570\u636E", r: "schools" },
    { n: stats?.latest_year || "\u2014", l: "\u6700\u65B0", r: "schools" },
    { n: "AI", l: "\u63A8\u8350", r: "recommend" }
  ].map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: () => onNavigate(s.r), style: { textAlign: "center", padding: 10, background: "#fff", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 700, color: "var(--primary)" } }, s.n), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--text-3)" } }, s.l)))), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 10px" } }, "\u70ED\u95E8\u5B66\u6821"), featured.length === 0 ? /* @__PURE__ */ React.createElement(MLoading, null) : featured.map((s) => /* @__PURE__ */ React.createElement(MSchoolRow, { key: s.id, school: s, onClick: () => onOpenSchool(s.id) })));
}
window.MHome = MHome;
