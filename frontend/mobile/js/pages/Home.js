function MHome({ onNavigate, onOpenSchool }) {
  const [featured, setFeatured] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [q, setQ] = React.useState("");
  React.useEffect(() => {
    Promise.all([API.schools({ limit: 6, sort: "score_desc" }), API.stats()]).then(([r, st]) => {
      setFeatured(r.schools || []);
      setStats(st);
    }).catch(() => {});
  }, []);
  return jsxDEV_7x81h0kn("div", {
    className: "mp",
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { textAlign: "center", padding: "16px 0 12px" },
        children: jsxDEV_7x81h0kn("p", {
          style: { fontSize: 13, color: "var(--text-3)", margin: 0 },
          children: [
            "上海中考 · ",
            stats ? stats.school_count + "所高中" : "",
            " · AI智能分析"
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("form", {
        onSubmit: (e) => {
          e.preventDefault();
          onNavigate("schools", { q });
        },
        style: { marginBottom: 16, position: "relative" },
        children: [
          jsxDEV_7x81h0kn("input", {
            className: "mi",
            type: "search",
            enterKeyHint: "search",
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "搜索学校名、区域、特色...",
            style: { paddingRight: 48 }
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("button", {
            type: "submit",
            style: { position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", width: 36, height: 36, borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
            children: "\uD83D\uDD0D"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 },
        children: [{ icon: "\uD83D\uDD0D", label: "查学校", r: "schools" }, { icon: "\uD83C\uDFAF", label: "AI填报", r: "recommend" }, { icon: "⚖️", label: "对比", r: "compare" }].map((f) => jsxDEV_7x81h0kn("button", {
          className: "mc",
          onClick: () => onNavigate(f.r),
          style: { textAlign: "center", cursor: "pointer", padding: 14, border: "1px solid var(--border)" },
          children: [
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 26, marginBottom: 4 },
              children: f.icon
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 13, fontWeight: 600 },
              children: f.label
            }, undefined, false, undefined, this)
          ]
        }, f.r, true, undefined, this))
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 },
        children: [
          { n: stats?.school_count || "—", l: "高中", r: "schools" },
          { n: stats?.year_count || "—", l: "年数据", r: "schools" },
          { n: stats?.latest_year || "—", l: "最新", r: "schools" },
          { n: "AI", l: "推荐", r: "recommend" }
        ].map((s, i) => jsxDEV_7x81h0kn("div", {
          onClick: () => onNavigate(s.r),
          style: { textAlign: "center", padding: 10, background: "#fff", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer" },
          children: [
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 16, fontWeight: 700, color: "var(--primary)" },
              children: s.n
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 10, color: "var(--text-3)" },
              children: s.l
            }, undefined, false, undefined, this)
          ]
        }, i, true, undefined, this))
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("h2", {
        style: { fontSize: 16, fontWeight: 600, margin: "0 0 10px" },
        children: "热门学校"
      }, undefined, false, undefined, this),
      featured.length === 0 ? jsxDEV_7x81h0kn(MLoading, {}, undefined, false, undefined, this) : featured.map((s) => jsxDEV_7x81h0kn(MSchoolRow, {
        school: s,
        onClick: () => onOpenSchool(s.id)
      }, s.id, false, undefined, this))
    ]
  }, undefined, true, undefined, this);
}
window.MHome = MHome;
