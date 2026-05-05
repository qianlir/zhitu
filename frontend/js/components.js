function Header({ route, onNavigate }) {
  const links = [
    { key: "schools", label: "学校查询" },
    { key: "compare", label: "多校对比" },
    { key: "recommend", label: "志愿推荐" },
    { key: "about", label: "关于" }
  ];
  return jsxDEV_7x81h0kn("header", {
    style: { background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 },
    children: jsxDEV_7x81h0kn("div", {
      style: { maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
      children: [
        jsxDEV_7x81h0kn("div", {
          style: { display: "flex", alignItems: "center", gap: 10 },
          children: [
            jsxDEV_7x81h0kn("a", {
              href: "http://qianli.wang",
              style: { width: 32, height: 32, borderRadius: 6, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 11, textDecoration: "none", letterSpacing: "-0.02em" },
              children: "千里"
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("a", {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                onNavigate("home");
              },
              style: { fontWeight: 600, fontSize: 15, textDecoration: "none", color: "inherit" },
              children: "千里·知途"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        jsxDEV_7x81h0kn("nav", {
          className: "header-nav",
          style: { display: "flex", alignItems: "center", gap: 6, overflowX: "auto" },
          children: links.map((l) => jsxDEV_7x81h0kn("a", {
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
            },
            children: l.label
          }, l.key, false, undefined, this))
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
}
function ScoreChip({ score }) {
  if (score == null)
    return jsxDEV_7x81h0kn("span", {
      style: { color: "var(--text-muted)" },
      children: "—"
    }, undefined, false, undefined, this);
  const display = Number.isInteger(score) ? score : score.toFixed(1);
  return jsxDEV_7x81h0kn("span", {
    className: "score-chip " + tierClass(score),
    children: [
      display,
      " 分"
    ]
  }, undefined, true, undefined, this);
}
function SchoolCard({ school, onClick, compact }) {
  return jsxDEV_7x81h0kn("div", {
    className: "card",
    style: { borderLeft: `3px solid ${tierBorder(school.score2025)}`, padding: compact ? 16 : 20, cursor: "pointer", transition: "box-shadow 120ms" },
    onMouseEnter: (e) => e.currentTarget.style.boxShadow = "var(--shadow-md)",
    onMouseLeave: (e) => e.currentTarget.style.boxShadow = "var(--shadow-sm)",
    onClick,
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { fontWeight: 600, fontSize: compact ? 15 : 17, color: "var(--text)" },
            children: school.name
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn(ScoreChip, {
            score: school.score2025
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: compact ? 0 : 16 },
        children: [
          jsxDEV_7x81h0kn("span", {
            className: "pill pill-gray",
            children: school.district
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            className: `pill ${school.tier === "四校" || school.tier === "八大" ? "pill-blue" : school.tier === "市重点" ? "pill-teal" : "pill-gray"}`,
            children: school.tier
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            className: "pill",
            children: school.funding
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      !compact && jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 13, color: "var(--text-3)", borderTop: "1px solid var(--border)", paddingTop: 12 },
        children: [
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 11, marginBottom: 2 },
                children: "2025统招"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { color: "var(--text)", fontWeight: 600, fontVariantNumeric: "tabular-nums" },
                children: fmtScore(school.score2025)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 11, marginBottom: 2 },
                children: "一本率"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { color: "var(--text)", fontWeight: 600 },
                children: [
                  school.bbenRate,
                  "%"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 11, marginBottom: 2 },
                children: "招生"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { color: "var(--text)", fontWeight: 600 },
                children: [
                  school.intake,
                  " 人"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function Loading({ msg = "加载中…" }) {
  return jsxDEV_7x81h0kn("div", {
    className: "loading",
    children: [
      jsxDEV_7x81h0kn("span", {
        className: "spinner"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("span", {
        children: msg
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function ErrorBox({ err, onRetry }) {
  return jsxDEV_7x81h0kn("div", {
    className: "card card-pad",
    style: { borderColor: "var(--danger)", color: "var(--danger)", textAlign: "center", margin: 24 },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { fontSize: 32, marginBottom: 8 },
        children: "⚠️"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { fontWeight: 600, marginBottom: 8 },
        children: "加载失败"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { fontSize: 13, color: "var(--text-3)", marginBottom: 12 },
        children: err.message
      }, undefined, false, undefined, this),
      onRetry && jsxDEV_7x81h0kn("button", {
        className: "btn btn-secondary",
        onClick: onRetry,
        children: "重试"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.Header = Header;
window.ScoreChip = ScoreChip;
window.SchoolCard = SchoolCard;
window.Loading = Loading;
window.ErrorBox = ErrorBox;
