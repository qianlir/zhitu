function MTabBar({ tab, setTab }) {
  const tabs = [
    { key: "home", label: "首页", icon: "\uD83C\uDFE0" },
    { key: "schools", label: "查校", icon: "\uD83D\uDD0D" },
    { key: "recommend", label: "填报", icon: "\uD83C\uDFAF" },
    { key: "compare", label: "对比", icon: "⚖️" },
    { key: "about", label: "关于", icon: "ℹ️" }
  ];
  return jsxDEV_7x81h0kn("nav", {
    style: { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "#fff", borderTop: "1px solid var(--border)", display: "flex", height: "var(--tab-h)", paddingBottom: "var(--safe-b)" },
    children: tabs.map((t) => jsxDEV_7x81h0kn("button", {
      onClick: () => setTab(t.key),
      style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", color: tab === t.key ? "var(--primary)" : "var(--text-3)", fontSize: 10, fontWeight: tab === t.key ? 600 : 500 },
      children: [
        jsxDEV_7x81h0kn("span", {
          style: { fontSize: 20 },
          children: t.icon
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("span", {
          children: t.label
        }, undefined, false, undefined, this)
      ]
    }, t.key, true, undefined, this))
  }, undefined, false, undefined, this);
}
function MNav({ title, subtitle, onBack }) {
  return jsxDEV_7x81h0kn("div", {
    style: { position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 },
    children: [
      onBack && jsxDEV_7x81h0kn("button", {
        onClick: onBack,
        style: { background: "transparent", border: "none", fontSize: 20, cursor: "pointer", padding: 0, color: "var(--text-2)" },
        children: "←"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { flex: 1 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 17, fontWeight: 600 },
            children: title
          }, undefined, false, undefined, this),
          subtitle && jsxDEV_7x81h0kn("div", {
            style: { fontSize: 12, color: "var(--text-3)", marginTop: 1 },
            children: subtitle
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function MSchoolRow({ school, onClick, showScore }) {
  return jsxDEV_7x81h0kn("div", {
    className: "mc-sm",
    onClick,
    style: { borderLeft: `3px solid ${tierBorder(school.score2025)}`, cursor: "pointer" },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
        children: [
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontWeight: 600, fontSize: 15 },
                children: school.name || school.shortName
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 },
                children: [
                  school.district,
                  " · ",
                  school.kind
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn(ScoreChip, {
            score: showScore || school.score2025
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      school.intro && jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, color: "var(--text-3)", marginBottom: 4, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
        children: school.intro
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", gap: 12, fontSize: 12, color: "var(--text-3)" },
        children: [
          school.bbenRate != null && jsxDEV_7x81h0kn("span", {
            children: [
              "一本率 ",
              jsxDEV_7x81h0kn("strong", {
                style: { color: "var(--text)" },
                children: [
                  school.bbenRate,
                  "%"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          school.intake != null && jsxDEV_7x81h0kn("span", {
            children: [
              "招生 ",
              jsxDEV_7x81h0kn("strong", {
                style: { color: "var(--text)" },
                children: [
                  school.intake,
                  "人"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      school.matchReason && jsxDEV_7x81h0kn("div", {
        style: { fontSize: 11, color: "var(--primary)", marginTop: 4, padding: "4px 8px", background: "var(--primary-50)", borderRadius: 4, lineHeight: 1.5 },
        children: [
          "匹配: ",
          school.matchReason
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function MLoading() {
  return jsxDEV_7x81h0kn("div", {
    style: { textAlign: "center", padding: 48, color: "var(--text-3)" },
    children: "加载中…"
  }, undefined, false, undefined, this);
}
function MError({ err, onRetry }) {
  return jsxDEV_7x81h0kn("div", {
    className: "mc",
    style: { textAlign: "center", padding: 32 },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { color: "var(--danger)", marginBottom: 8 },
        children: "加载失败"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { fontSize: 13, color: "var(--text-3)", marginBottom: 12 },
        children: err?.message || String(err)
      }, undefined, false, undefined, this),
      onRetry && jsxDEV_7x81h0kn("button", {
        className: "mb mb2",
        style: { width: "auto", padding: "8px 20px" },
        onClick: onRetry,
        children: "重试"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.MTabBar = MTabBar;
window.MNav = MNav;
window.MSchoolRow = MSchoolRow;
window.MLoading = MLoading;
window.MError = MError;
