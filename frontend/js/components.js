function Header({ route, onNavigate }) {
  const links = [
    { key: "schools", label: "\u5B66\u6821\u67E5\u8BE2" },
    { key: "compare", label: "\u591A\u6821\u5BF9\u6BD4" },
    { key: "recommend", label: "\u5FD7\u613F\u63A8\u8350" },
    { key: "about", label: "\u5173\u4E8E" }
  ];
  return /* @__PURE__ */ React.createElement("header", { style: { background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("a", { href: "http://qianli.wang", style: { width: 32, height: 32, borderRadius: 6, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, textDecoration: "none", letterSpacing: "-0.02em" } }, "\u5343\u91CC"), /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate("home");
  }, style: { fontWeight: 600, fontSize: 15, textDecoration: "none", color: "inherit" } }, "\u5343\u91CC\xB7\u77E5\u9014")), /* @__PURE__ */ React.createElement("nav", { className: "header-nav", style: { display: "flex", alignItems: "center", gap: 6, overflowX: "auto" } }, links.map((l) => /* @__PURE__ */ React.createElement(
    "a",
    {
      key: l.key,
      href: "#",
      onClick: (e) => {
        e.preventDefault();
        onNavigate(l.key);
      },
      style: {
        padding: "8px 14px",
        fontSize: 14,
        color: route === l.key ? "var(--primary)" : "var(--text-2)",
        background: route === l.key ? "var(--primary-50)" : "transparent",
        borderRadius: 6,
        fontWeight: route === l.key ? 600 : 500,
        textDecoration: "none",
        whiteSpace: "nowrap"
      }
    },
    l.label
  )))));
}
function ScoreChip({ score }) {
  if (score == null) return /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "\u2014");
  const display = Number.isInteger(score) ? score : score.toFixed(1);
  return /* @__PURE__ */ React.createElement("span", { className: "score-chip " + tierClass(score) }, display, " \u5206");
}
function SchoolCard({ school, onClick, compact }) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: { borderLeft: `3px solid ${tierBorder(school.score2025)}`, padding: compact ? 16 : 20, cursor: "pointer", transition: "box-shadow 120ms" },
      onMouseEnter: (e) => e.currentTarget.style.boxShadow = "var(--shadow-md)",
      onMouseLeave: (e) => e.currentTarget.style.boxShadow = "var(--shadow-sm)",
      onClick
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: compact ? 15 : 17, color: "var(--text)" } }, school.name), /* @__PURE__ */ React.createElement(ScoreChip, { score: school.score2025 })),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: compact ? 0 : 16 } }, /* @__PURE__ */ React.createElement("span", { className: "pill pill-gray" }, school.district), /* @__PURE__ */ React.createElement("span", { className: `pill ${school.tier === "\u56DB\u6821" || school.tier === "\u516B\u5927" ? "pill-blue" : school.tier === "\u5E02\u91CD\u70B9" ? "pill-teal" : "pill-gray"}` }, school.tier), /* @__PURE__ */ React.createElement("span", { className: "pill" }, school.funding)),
    !compact && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 13, color: "var(--text-3)", borderTop: "1px solid var(--border)", paddingTop: 12 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, marginBottom: 2 } }, "2025\u7EDF\u62DB"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text)", fontWeight: 600, fontVariantNumeric: "tabular-nums" } }, fmtScore(school.score2025))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, marginBottom: 2 } }, "\u4E00\u672C\u7387"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text)", fontWeight: 600 } }, school.bbenRate, "%")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, marginBottom: 2 } }, "\u62DB\u751F"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text)", fontWeight: 600 } }, school.intake, " \u4EBA"))),
    school.matchReason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--primary)", marginTop: 10, padding: "6px 10px", background: "var(--primary-50)", borderRadius: 6, lineHeight: 1.5 } }, "\u5339\u914D: ", school.matchReason)
  );
}
function Loading({ msg = "\u52A0\u8F7D\u4E2D\u2026" }) {
  return /* @__PURE__ */ React.createElement("div", { className: "loading" }, /* @__PURE__ */ React.createElement("span", { className: "spinner" }), /* @__PURE__ */ React.createElement("span", null, msg));
}
function ErrorBox({ err, onRetry }) {
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { borderColor: "var(--danger)", color: "var(--danger)", textAlign: "center", margin: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32, marginBottom: 8 } }, "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, marginBottom: 8 } }, "\u52A0\u8F7D\u5931\u8D25"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)", marginBottom: 12 } }, err.message), onRetry && /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: onRetry }, "\u91CD\u8BD5"));
}
window.Header = Header;
window.ScoreChip = ScoreChip;
window.SchoolCard = SchoolCard;
window.Loading = Loading;
window.ErrorBox = ErrorBox;
