function StepBar({ step, setStep }) {
  const items = [
    { n: 0, label: "基本信息", icon: "\uD83D\uDCDD" },
    { n: 1, label: "名额到区(1)", icon: "\uD83C\uDFDB️" },
    { n: 2, label: "名额到校(2)", icon: "\uD83C\uDFEB" },
    { n: 3, label: "平行志愿(15)", icon: "\uD83D\uDCCB" }
  ];
  return jsxDEV_7x81h0kn("div", {
    style: { display: "flex", gap: 4, marginBottom: 24 },
    children: items.map((s) => {
      const active = step === s.n, done = step > s.n;
      return jsxDEV_7x81h0kn("button", {
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
        },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 16 },
            children: done ? "✓" : s.icon
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 12, fontWeight: active ? 600 : 500, marginTop: 4 },
            children: s.label
          }, undefined, false, undefined, this)
        ]
      }, s.n, true, undefined, this);
    })
  }, undefined, false, undefined, this);
}
function PickCard({ school, scoreVal, selected, onToggle, disabled, planCount }) {
  const diff = scoreVal - (window._recScore || 685);
  const tag = diff > 5 ? { t: "冲刺", c: "#dc2626", bg: "rgba(220,38,38,0.08)" } : diff > -3 ? { t: "匹配", c: "var(--primary)", bg: "var(--primary-50)" } : { t: "保底", c: "var(--success)", bg: "rgba(5,150,105,0.08)" };
  const prob = diff > 8 ? "15%" : diff > 3 ? "35%" : diff > -3 ? "65%" : diff > -10 ? "85%" : "95%";
  return jsxDEV_7x81h0kn("div", {
    onClick: () => !disabled && onToggle(school.id),
    className: "card",
    style: {
      padding: 14,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.5 : 1,
      borderLeft: "3px solid " + (selected ? "var(--primary)" : tag.c),
      background: selected ? "var(--primary-50)" : "#fff",
      transition: "all 120ms"
    },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
        children: [
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 14, fontWeight: 600 },
                children: school.name
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 11, color: "var(--text-3)", marginTop: 2 },
                children: [
                  school.district,
                  "区 · ",
                  school.kind
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { textAlign: "right" },
            children: [
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 10, fontWeight: 600, color: tag.c, background: tag.bg, padding: "2px 6px", borderRadius: 4 },
                children: tag.t
              }, undefined, false, undefined, this),
              selected && jsxDEV_7x81h0kn("div", {
                style: { fontSize: 10, color: "var(--primary)", fontWeight: 600, marginTop: 4 },
                children: "✓ 已选"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", gap: 12, fontSize: 11, color: "var(--text-3)", borderTop: "1px solid var(--border)", paddingTop: 8 },
        children: [
          jsxDEV_7x81h0kn("span", {
            children: [
              "录取分 ",
              jsxDEV_7x81h0kn("strong", {
                style: { color: "var(--text)" },
                children: fmtScore(scoreVal)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("span", {
            children: [
              "分差 ",
              jsxDEV_7x81h0kn("strong", {
                style: { color: tag.c },
                children: [
                  diff >= 0 ? "+" : "",
                  diff.toFixed(1)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("span", {
            children: [
              "概率 ",
              jsxDEV_7x81h0kn("strong", {
                style: { color: tag.c },
                children: prob
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          planCount != null && jsxDEV_7x81h0kn("span", {
            children: [
              "计划 ",
              jsxDEV_7x81h0kn("strong", {
                children: [
                  planCount,
                  "人"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function BatchHeader({ icon, title, subtitle, rule, picked, max }) {
  return jsxDEV_7x81h0kn("div", {
    className: "card card-pad",
    style: { marginBottom: 16, borderLeft: "3px solid var(--primary)" },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
        children: [
          jsxDEV_7x81h0kn("h2", {
            style: { fontSize: 18, fontWeight: 600, margin: 0 },
            children: [
              icon,
              " ",
              title
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" },
            children: [
              picked,
              "/",
              max
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("p", {
        style: { fontSize: 13, color: "var(--text-3)", margin: "0 0 8px" },
        children: subtitle
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, color: "var(--text-2)", background: "var(--bg)", borderRadius: 6, padding: "8px 12px", lineHeight: 1.6 },
        children: [
          "\uD83D\uDCCB ",
          rule
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.StepBar = StepBar;
window.PickCard = PickCard;
window.BatchHeader = BatchHeader;
