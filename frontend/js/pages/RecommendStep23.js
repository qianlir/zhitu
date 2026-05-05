function Step2({ list, picks, toggle, district, nav, allSchools }) {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    BatchHeader,
    {
      icon: "\u{1F3EB}",
      title: "\u540D\u989D\u5206\u914D\u5230\u6821",
      subtitle: "\u59D4\u5C5E/\u672C\u533A\u5E02\u91CD\u70B9\u5206\u914D\u5230\u521D\u4E2D\u5B66\u6821\u7684\u540D\u989D\uFF0C\u586B 0-2 \u4E2A\u5FD7\u613F",
      rule: "\u9700\u5728\u751F\u6E90\u521D\u4E2D\u8FDE\u7EED\u5C31\u8BFB\u6EE13\u5E74\u3002\u6821\u5185\u6392\u540D\u7ADE\u4E89\uFF0C\u4E24\u4E2A\u5FD7\u613F\u5EFA\u8BAE\u4E00\u51B2\u4E00\u7A33\u3002\u5F55\u53D6\u540E\u4E0D\u53C2\u52A0\u5E73\u884C\u5FD7\u613F\u6279\u6B21\u3002",
      picked: picks.length,
      max: 2
    }
  ), picks.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "var(--success-50)", borderRadius: 8, marginBottom: 12, fontSize: 13, color: "var(--success)" } }, "\u2705 \u5DF2\u9009 ", picks.length, "/2\uFF1A", picks.map((id) => allSchools.find((s) => s.id === id)?.name).join("\u3001")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 10 } }, list.map((s) => /* @__PURE__ */ React.createElement(
    PickCard,
    {
      key: s.id,
      school: s,
      scoreVal: s.mingeSchool || s.score2025,
      selected: picks.includes(s.id),
      onToggle: toggle,
      disabled: false
    }
  )), list.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { textAlign: "center", color: "var(--text-3)" } }, "\u6682\u65E0", district, "\u533A\u5230\u6821\u6570\u636E")), nav);
}
function Step3({ list, picks, toggle, used, district, score, nav, tdPick, tsPicks, onOpenSchool, allSchools }) {
  const available = list.filter((s) => !used.includes(s.id));
  const chong = available.filter((s) => s.score2025 > score + 2).sort((a, b) => a.score2025 - b.score2025);
  const wen = available.filter((s) => s.score2025 >= score - 8 && s.score2025 <= score + 2).sort((a, b) => b.score2025 - a.score2025);
  const bao = available.filter((s) => s.score2025 < score - 8).sort((a, b) => b.score2025 - a.score2025);
  const Section = ({ title, icon, color, schools }) => /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", null, icon), " ", title, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 400, color: "var(--text-3)" } }, "(", schools.length, " \u6240\u53EF\u9009)")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 } }, schools.map((s) => /* @__PURE__ */ React.createElement(
    PickCard,
    {
      key: s.id,
      school: s,
      scoreVal: s.score2025,
      selected: picks.includes(s.id),
      onToggle: toggle,
      disabled: picks.length >= 15 && !picks.includes(s.id)
    }
  ))), schools.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-muted)", padding: 12 } }, "\u8BE5\u5206\u6BB5\u65E0\u53EF\u9009\u5B66\u6821"));
  const getSchool = (id) => allSchools.find((s) => s.id === id);
  const SummaryPanel = () => /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { position: "sticky", top: 88 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 14, fontWeight: 600, margin: "0 0 12px" } }, "\u{1F4CB} \u65B9\u6848\u603B\u89C8"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--primary)", marginBottom: 6 } }, "\u540D\u989D\u5230\u533A (1)"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, marginBottom: 12, padding: "6px 0", borderBottom: "1px solid var(--border)" } }, tdPick ? getSchool(tdPick)?.name : /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "\u672A\u9009")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--secondary)", marginBottom: 6 } }, "\u540D\u989D\u5230\u6821 (2)"), [0, 1].map((i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { fontSize: 13, marginBottom: 4 } }, i + 1, ". ", tsPicks[i] ? getSchool(tsPicks[i])?.name : /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "\u672A\u9009"))), /* @__PURE__ */ React.createElement("div", { style: { borderBottom: "1px solid var(--border)", marginBottom: 12, paddingBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 6 } }, "\u5E73\u884C\u5FD7\u613F (", picks.filter(Boolean).length, "/15)"), picks.filter(Boolean).map((id, i) => {
    const s = getSchool(id);
    if (!s) return null;
    const diff = s.score2025 - score;
    const color = diff > 2 ? "#dc2626" : diff > -8 ? "var(--primary)" : "var(--success)";
    return /* @__PURE__ */ React.createElement("div", { key: id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", marginRight: 6 } }, i + 1, "."), s.name), /* @__PURE__ */ React.createElement("span", { style: { color, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 11 } }, diff >= 0 ? "+" : "", diff.toFixed(1)));
  }), picks.filter(Boolean).length === 0 && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-muted)" } }, "\u4ECE\u5DE6\u4FA7\u9009\u62E9\u5B66\u6821"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, padding: 10, background: "var(--bg)", borderRadius: 6, fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 } }, "\u5EFA\u8BAE\u524D5\u4E2A\u5FD7\u613F\u51B2\u9AD8\u3001\u4E2D\u95F45\u4E2A\u7A33\u59A5\u3001\u540E5\u4E2A\u4FDD\u5E95\u300215\u4E2A\u5FD7\u613F\u52A1\u5FC5\u586B\u6EE1\uFF0C\u907F\u514D\u6ED1\u6863\u3002"), picks.filter(Boolean).length > 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-primary",
      style: { width: "100%", marginTop: 12, fontSize: 14 },
      onClick: () => {
        if (window._doAnalyze) window._doAnalyze();
      }
    },
    "\u{1F916} AI \u667A\u80FD\u5206\u6790\u65B9\u6848"
  ));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    BatchHeader,
    {
      icon: "\u{1F4CB}",
      title: "\u7EDF\u4E00\u62DB\u751F \xB7 \u5E73\u884C\u5FD7\u613F",
      subtitle: "\u672C\u533A\u6240\u6709\u9AD8\u4E2D + \u59D4\u5C5E\u5E02\u91CD\u70B9\uFF0C\u586B 1-15 \u4E2A\u5FD7\u613F",
      rule: "\u5206\u6570\u4F18\u5148\u3001\u9075\u5FAA\u5FD7\u613F\u3001\u4E00\u8F6E\u6295\u6863\u3002\u6309\u5206\u6570\u4ECE\u9AD8\u5230\u4F4E\u6392\u961F\uFF0C\u8F6E\u5230\u4F60\u65F6\u4F9D\u6B21\u68C0\u7D22\u5FD7\u613F\uFF0C\u6295\u8FDB\u7B2C\u4E00\u4E2A\u6709\u540D\u989D\u7684\u5B66\u6821\u3002\u524D\u9762\u6279\u6B21\u672A\u5F55\u53D6\u7684\u8003\u751F\u5728\u6B64\u6279\u6B21\u7ADE\u4E89\u3002",
      picked: picks.filter(Boolean).length,
      max: 15
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Section, { title: "\u51B2\u523A\u533A (\u5EFA\u8BAE\u586B3-4\u4E2A)", icon: "\u{1F680}", color: "#dc2626", schools: chong }), /* @__PURE__ */ React.createElement(Section, { title: "\u5339\u914D\u533A (\u5EFA\u8BAE\u586B5-6\u4E2A)", icon: "\u2696\uFE0F", color: "var(--primary)", schools: wen }), /* @__PURE__ */ React.createElement(Section, { title: "\u4FDD\u5E95\u533A (\u5EFA\u8BAE\u586B4-5\u4E2A)", icon: "\u{1F6E1}\uFE0F", color: "var(--success)", schools: bao })), /* @__PURE__ */ React.createElement(SummaryPanel, null)), nav);
}
window.Step2 = Step2;
window.Step3 = Step3;
