function RankEstimator() {
  const [score, setScore] = React.useState("");
  const estDR = score ? estimateRank(+score, PUDONG_RANK) : null;
  const estCR = score ? estimateRank(+score, CITY_RANK) : null;
  const tier = score ? tierLabel(+score) : "";
  const cls = score ? tierClass(+score) : "";
  return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28, background: "#fff", borderRadius: 12, padding: "20px 24px", maxWidth: 520, margin: "28px auto 0", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" } },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--text-2)" } }, "\u{1F4CA} \u5206\u6570\u4F30\u540D\u6B21"),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } },
      /* @__PURE__ */ React.createElement("input", { type: "number", placeholder: "\u8F93\u5165\u4E2D\u8003\u5206\u6570", value: score, onChange: (e) => setScore(e.target.value), style: { flex: 1, padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 16, fontWeight: 600, color: "var(--primary)", textAlign: "center" } }),
      score && estCR && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, fontSize: 13 } },
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11 } }, "\u5168\u5E02\u6392\u540D"),
          /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--primary)", fontSize: 18 } }, "~" + estCR.toLocaleString())),
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11 } }, "\u6D66\u4E1C\u6392\u540D"),
          /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, color: "var(--secondary)", fontSize: 18 } }, "~" + estDR.toLocaleString())),
        /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } },
          /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-muted)", fontSize: 11 } }, "\u5B9A\u4F4D"),
          /* @__PURE__ */ React.createElement("span", { className: "score-chip " + cls, style: { fontSize: 12 } }, tier)))));
}

function HomePage({ onNavigate, onOpenSchool }) {
  const [featured, setFeatured] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [query, setQuery] = React.useState("");
  React.useEffect(() => {
    Promise.all([API.schools({ limit: 6, sort: "score_desc" }), API.stats()]).then(([list, st]) => {
      setFeatured(list.schools || []);
      setStats(st);
    }).catch(setErr);
  }, []);
  const onSearch = (e) => {
    e && e.preventDefault();
    onNavigate("schools", query ? { q: query } : void 0);
  };
  return /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement("section", { style: { padding: "80px 24px 64px", background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)", position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,86,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--text-3)", marginBottom: 24, boxShadow: "var(--shadow-sm)" } }, /* @__PURE__ */ React.createElement("span", { style: { width: 6, height: 6, borderRadius: 3, background: "var(--success)" } }), stats ? `${stats.latest_year}\u5E74\u6700\u65B0\u6570\u636E \xB7 ${stats.school_count}\u6240\u9AD8\u4E2D\u8986\u76D6` : "\u6700\u65B0\u6570\u636E\u52A0\u8F7D\u4E2D\u2026"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 48, fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px", color: "var(--text)", letterSpacing: "-0.02em" } }, "\u5343\u91CC\u4E4B\u884C\uFF0C\u59CB\u4E8E", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--primary)" } }, "\u77E5\u9014")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 18, color: "var(--text-3)", margin: "0 0 40px", lineHeight: 1.6 } }, "\u4E0A\u6D77\u4E2D\u8003 \xB7 ", stats ? stats.school_count + "\u6240" : "", "\u9AD8\u4E2D\u6570\u636E \xB7 AI\u667A\u80FD\u5206\u6790"), /* @__PURE__ */ React.createElement("form", { onSubmit: onSearch, style: { background: "#fff", borderRadius: 12, padding: 6, display: "flex", boxShadow: "var(--shadow-md)", maxWidth: 640, margin: "0 auto", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", padding: "0 16px" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", marginRight: 10 } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("input", { type: "search", placeholder: "\u641C\u7D22\u5B66\u6821\u540D\u3001\u533A\u57DF\u3001\u7279\u8272\uFF08\u5982\uFF1A\u6570\u5B66\u7ADE\u8D5B\u3001\u5BC4\u5BBF\u5236\u3001\u6D66\u4E1C\uFF09...", value: query, onChange: (e) => setQuery(e.target.value), style: { border: "none", padding: "12px 0", fontSize: 15, background: "transparent", width: "100%" } })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary btn-lg" }, "\u641C\u7D22")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "pill", style: { cursor: "pointer", background: "#fff" }, onClick: () => onNavigate("schools") }, "\u{1F4CD} \u6309\u533A\u57DF"), /* @__PURE__ */ React.createElement("button", { className: "pill", style: { cursor: "pointer", background: "#fff" }, onClick: () => onNavigate("schools") }, "\u{1F3C6} \u6309\u7C7B\u578B"), /* @__PURE__ */ React.createElement("button", { className: "pill", style: { cursor: "pointer", background: "#fff" }, onClick: () => onNavigate("schools") }, "\u{1F4CA} \u6309\u5206\u6570\u6BB5")), /* @__PURE__ */ React.createElement(RankEstimator, null))), /* @__PURE__ */ React.createElement("section", { style: { background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "stats-bar", style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 } }, [
    { n: stats ? stats.school_count : "\u2014", u: "\u6240", l: "\u9AD8\u4E2D\u8986\u76D6", route: "schools" },
    { n: stats ? stats.year_count : "\u2014", u: "\u5E74", l: "\u5386\u5E74\u5F55\u53D6\u6570\u636E", route: "schools" },
    { n: stats ? stats.latest_year : "\u2014", u: "", l: "\u6700\u65B0\u5206\u6570\u7EBF", route: "schools" },
    { n: "\u667A\u80FD", u: "", l: "\u5FD7\u613F\u5EFA\u8BAE", route: "recommend" }
  ].map((s, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      onClick: () => onNavigate(s.route),
      style: { textAlign: "center", borderRight: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "opacity 150ms" },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.7",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "1"
    },
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 32, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums" } }, s.n, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, marginLeft: 4, color: "var(--text-2)" } }, s.u)),
    /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)", marginTop: 4 } }, s.l)
  )))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1280, margin: "0 auto", padding: "80px 24px" } }, /* @__PURE__ */ React.createElement("div", { className: "grid-3", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 } }, [
    { icon: "\u{1F50D}", title: "\u5B66\u6821\u67E5\u8BE2", desc: "\u8F93\u5165\u5B66\u6821\u540D\u6216\u5173\u952E\u8BCD\uFF0C\u67E5\u770B\u8BE6\u7EC6\u4FE1\u606F\u3001\u5386\u5E74\u5206\u6570\u7EBF\u548C\u9AD8\u8003\u6210\u7EE9", cta: "\u67E5\u8BE2\u5B66\u6821", route: "schools", color: "var(--primary)" },
    { icon: "\u2696\uFE0F", title: "\u591A\u6821\u5BF9\u6BD4", desc: "\u9009\u62E9 2-5 \u6240\u5B66\u6821\uFF0C\u6A2A\u5411\u5BF9\u6BD4\u5F55\u53D6\u5206\u6570\u3001\u5347\u5B66\u7387\u3001\u5B66\u6821\u7279\u8272", cta: "\u5F00\u59CB\u5BF9\u6BD4", route: "compare", color: "var(--secondary)" },
    { icon: "\u{1F3AF}", title: "\u5FD7\u613F\u63A8\u8350", desc: "\u8F93\u5165\u4F30\u5206\u548C\u504F\u597D\uFF0C\u83B7\u53D6\u4E2A\u6027\u5316\u62A5\u540D\u7B56\u7565\u548C\u51B2\u7A33\u4FDD\u5EFA\u8BAE", cta: "\u83B7\u53D6\u5EFA\u8BAE", route: "recommend", color: "var(--accent)" }
  ].map((f, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      className: "card card-pad",
      style: { padding: 28, transition: "all 200ms", cursor: "pointer" },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.transform = "translateY(-2px)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      },
      onClick: () => onNavigate(f.route)
    },
    /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, background: f.color + "15", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 } }, f.icon),
    /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 18, fontWeight: 600, margin: "0 0 8px" } }, f.title),
    /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--text-3)", lineHeight: 1.6, margin: "0 0 20px" } }, f.desc),
    /* @__PURE__ */ React.createElement("div", { style: { color: f.color, fontSize: 14, fontWeight: 500 } }, f.cta, " \u2192")
  )))), /* @__PURE__ */ React.createElement("section", { style: { maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 600, margin: 0 } }, "\u70ED\u95E8\u5173\u6CE8\u5B66\u6821"), /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate("schools");
  }, style: { fontSize: 14, color: "var(--primary)", textDecoration: "none" } }, "\u67E5\u770B\u5168\u90E8 \u2192")), err ? /* @__PURE__ */ React.createElement(ErrorBox, { err }) : !featured.length ? /* @__PURE__ */ React.createElement(Loading, null) : /* @__PURE__ */ React.createElement("div", { className: "grid-3", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, featured.map((s) => /* @__PURE__ */ React.createElement(SchoolCard, { key: s.id, school: s, onClick: () => onOpenSchool(s.id) })))));
}
window.HomePage = HomePage;
