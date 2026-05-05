function StepBar({ step, setStep }) {
  const items = [
    { n: 0, label: "\u57FA\u672C\u4FE1\u606F", icon: "\u{1F4DD}" },
    { n: 1, label: "\u540D\u989D\u5230\u533A(1)", icon: "\u{1F3DB}\uFE0F" },
    { n: 2, label: "\u540D\u989D\u5230\u6821(2)", icon: "\u{1F3EB}" },
    { n: 3, label: "\u5E73\u884C\u5FD7\u613F(15)", icon: "\u{1F4CB}" }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 24 } }, items.map((s) => {
    const active = step === s.n, done = step > s.n;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: s.n,
        onClick: () => s.n <= step && setStep(s.n),
        style: {
          flex: 1,
          padding: "12px 8px",
          borderRadius: 8,
          border: "none",
          cursor: s.n <= step ? "pointer" : "default",
          fontFamily: "inherit",
          textAlign: "center",
          transition: "all 150ms",
          background: active ? "var(--primary)" : done ? "var(--primary-50)" : "var(--bg)",
          color: active ? "#fff" : done ? "var(--primary)" : "var(--text-3)"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16 } }, done ? "\u2713" : s.icon),
      /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: active ? 600 : 500, marginTop: 4 } }, s.label)
    );
  }));
}
function PickCard({ school, scoreVal, selected, onToggle, disabled, planCount }) {
  const diff = scoreVal - (window._recScore || 685);
  const tag = diff > 5 ? { t: "\u51B2\u523A", c: "#dc2626", bg: "rgba(220,38,38,0.08)" } : diff > -3 ? { t: "\u5339\u914D", c: "var(--primary)", bg: "var(--primary-50)" } : { t: "\u4FDD\u5E95", c: "var(--success)", bg: "rgba(5,150,105,0.08)" };
  const prob = diff > 8 ? "15%" : diff > 3 ? "35%" : diff > -3 ? "65%" : diff > -10 ? "85%" : "95%";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => !disabled && onToggle(school.id),
      className: "card",
      style: {
        padding: 14,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        borderLeft: "3px solid " + (selected ? "var(--primary)" : tag.c),
        background: selected ? "var(--primary-50)" : "#fff",
        transition: "all 120ms"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, school.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 } }, school.district, "\u533A \xB7 ", school.kind)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: 600, color: tag.c, background: tag.bg, padding: "2px 6px", borderRadius: 4 } }, tag.t), selected && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--primary)", fontWeight: 600, marginTop: 4 } }, "\u2713 \u5DF2\u9009"))),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, fontSize: 11, color: "var(--text-3)", borderTop: "1px solid var(--border)", paddingTop: 8 } }, /* @__PURE__ */ React.createElement("span", null, "\u5F55\u53D6\u5206 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text)" } }, fmtScore(scoreVal))), /* @__PURE__ */ React.createElement("span", null, "\u5206\u5DEE ", /* @__PURE__ */ React.createElement("strong", { style: { color: tag.c } }, diff >= 0 ? "+" : "", diff.toFixed(1))), /* @__PURE__ */ React.createElement("span", null, "\u6982\u7387 ", /* @__PURE__ */ React.createElement("strong", { style: { color: tag.c } }, prob)), planCount != null && /* @__PURE__ */ React.createElement("span", null, "\u8BA1\u5212 ", /* @__PURE__ */ React.createElement("strong", null, planCount, "\u4EBA")))
  );
}
function BatchHeader({ icon, title, subtitle, rule, picked, max }) {
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { marginBottom: 16, borderLeft: "3px solid var(--primary)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 18, fontWeight: 600, margin: 0 } }, icon, " ", title), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" } }, picked, "/", max)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-3)", margin: "0 0 8px" } }, subtitle), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-2)", background: "var(--bg)", borderRadius: 6, padding: "8px 12px", lineHeight: 1.6 } }, "\u{1F4CB} ", rule));
}
window.StepBar = StepBar;
window.PickCard = PickCard;
window.BatchHeader = BatchHeader;
