function MTabBar({ tab, setTab }) {
  const tabs = [
    { key: "home", label: "\u9996\u9875", icon: "\u{1F3E0}" },
    { key: "schools", label: "\u67E5\u6821", icon: "\u{1F50D}" },
    { key: "recommend", label: "\u586B\u62A5", icon: "\u{1F3AF}" },
    { key: "compare", label: "\u5BF9\u6BD4", icon: "\u2696\uFE0F" },
    { key: "about", label: "\u5173\u4E8E", icon: "\u2139\uFE0F" }
  ];
  return /* @__PURE__ */ React.createElement("nav", { style: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#fff", borderTop: "1px solid var(--border)", display: "flex", height: "var(--tab-h)", paddingBottom: "var(--safe-b)" } }, tabs.map((t) => /* @__PURE__ */ React.createElement("button", { key: t.key, onClick: () => setTab(t.key), style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", color: tab === t.key ? "var(--primary)" : "var(--text-3)", fontSize: 10, fontWeight: tab === t.key ? 600 : 500 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, t.icon), /* @__PURE__ */ React.createElement("span", null, t.label))));
}
function MNav({ title, subtitle, onBack }) {
  return /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 } }, onBack && /* @__PURE__ */ React.createElement("button", { onClick: onBack, style: { background: "transparent", border: "none", fontSize: 20, cursor: "pointer", padding: 0, color: "var(--text-2)" } }, "\u2190"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 17, fontWeight: 600 } }, title), subtitle && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 1 } }, subtitle)));
}
function MSchoolRow({ school, onClick, showScore }) {
  return /* @__PURE__ */ React.createElement("div", { className: "mc-sm", onClick, style: { borderLeft: `3px solid ${tierBorder(school.score2025)}`, cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 15 } }, school.name || school.shortName), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, school.district, " \xB7 ", school.kind)), /* @__PURE__ */ React.createElement(ScoreChip, { score: showScore || school.score2025 })), school.intro && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 4, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } }, school.intro), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, fontSize: 12, color: "var(--text-3)" } }, school.bbenRate != null && /* @__PURE__ */ React.createElement("span", null, "\u4E00\u672C\u7387 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text)" } }, school.bbenRate, "%")), school.intake != null && /* @__PURE__ */ React.createElement("span", null, "\u62DB\u751F ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text)" } }, school.intake, "\u4EBA"))), school.matchReason && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--primary)", marginTop: 4, padding: "4px 8px", background: "var(--primary-50)", borderRadius: 4, lineHeight: 1.5 } }, "\u5339\u914D: ", school.matchReason));
}
function MLoading() {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 48, color: "var(--text-3)" } }, "\u52A0\u8F7D\u4E2D\u2026");
}
function MError({ err, onRetry }) {
  return /* @__PURE__ */ React.createElement("div", { className: "mc", style: { textAlign: "center", padding: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--danger)", marginBottom: 8 } }, "\u52A0\u8F7D\u5931\u8D25"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)", marginBottom: 12 } }, err?.message || String(err)), onRetry && /* @__PURE__ */ React.createElement("button", { className: "mb mb2", style: { width: "auto", padding: "8px 20px" }, onClick: onRetry }, "\u91CD\u8BD5"));
}
window.MTabBar = MTabBar;
window.MNav = MNav;
window.MSchoolRow = MSchoolRow;
window.MLoading = MLoading;
window.MError = MError;
