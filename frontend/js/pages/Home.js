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
    onNavigate("schools", query ? { q: query } : undefined);
  };
  return jsxDEV_7x81h0kn("main", {
    children: [
      jsxDEV_7x81h0kn("section", {
        style: { padding: "80px 24px 64px", background: "linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)", position: "relative", overflow: "hidden" },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(26,86,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { maxWidth: 880, margin: "0 auto", textAlign: "center", position: "relative" },
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#fff", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--text-3)", marginBottom: 24, boxShadow: "var(--shadow-sm)" },
                children: [
                  jsxDEV_7x81h0kn("span", {
                    style: { width: 6, height: 6, borderRadius: 3, background: "var(--success)" }
                  }, undefined, false, undefined, this),
                  stats ? `${stats.latest_year}年最新数据 · ${stats.school_count}所高中覆盖` : "最新数据加载中…"
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("h1", {
                style: { fontSize: 48, fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px", color: "var(--text)", letterSpacing: "-0.02em" },
                children: [
                  "千里之行，始于",
                  jsxDEV_7x81h0kn("span", {
                    style: { color: "var(--primary)" },
                    children: "知途"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("p", {
                style: { fontSize: 18, color: "var(--text-3)", margin: "0 0 40px", lineHeight: 1.6 },
                children: [
                  "上海中考 · ",
                  stats ? stats.school_count + "所" : "",
                  "高中数据 · AI智能分析"
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("form", {
                onSubmit: onSearch,
                style: { background: "#fff", borderRadius: 12, padding: 6, display: "flex", boxShadow: "var(--shadow-md)", maxWidth: 640, margin: "0 auto", border: "1px solid var(--border)" },
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { flex: 1, display: "flex", alignItems: "center", padding: "0 16px" },
                    children: [
                      jsxDEV_7x81h0kn("span", {
                        style: { color: "var(--text-muted)", marginRight: 10 },
                        children: "\uD83D\uDD0D"
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("input", {
                        type: "search",
                        placeholder: "搜索学校名、区域、特色（如：数学竞赛、寄宿制、浦东）...",
                        value: query,
                        onChange: (e) => setQuery(e.target.value),
                        style: { border: "none", padding: "12px 0", fontSize: 15, background: "transparent", width: "100%" }
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV_7x81h0kn("button", {
                    type: "submit",
                    className: "btn btn-primary btn-lg",
                    children: "搜索"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" },
                children: [
                  jsxDEV_7x81h0kn("button", {
                    className: "pill",
                    style: { cursor: "pointer", background: "#fff" },
                    onClick: () => onNavigate("schools"),
                    children: "\uD83D\uDCCD 按区域"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("button", {
                    className: "pill",
                    style: { cursor: "pointer", background: "#fff" },
                    onClick: () => onNavigate("schools"),
                    children: "\uD83C\uDFC6 按类型"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("button", {
                    className: "pill",
                    style: { cursor: "pointer", background: "#fff" },
                    onClick: () => onNavigate("schools"),
                    children: "\uD83D\uDCCA 按分数段"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("section", {
        style: { background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" },
        children: jsxDEV_7x81h0kn("div", {
          className: "stats-bar",
          style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 },
          children: [
            { n: stats ? stats.school_count : "—", u: "所", l: "高中覆盖", route: "schools" },
            { n: stats ? stats.year_count : "—", u: "年", l: "历年录取数据", route: "schools" },
            { n: stats ? stats.latest_year : "—", u: "", l: "最新分数线", route: "schools" },
            { n: "智能", u: "", l: "志愿建议", route: "recommend" }
          ].map((s, i) => jsxDEV_7x81h0kn("div", {
            onClick: () => onNavigate(s.route),
            style: { textAlign: "center", borderRight: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "opacity 150ms" },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "0.7",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "1",
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 32, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums" },
                children: [
                  s.n,
                  jsxDEV_7x81h0kn("span", {
                    style: { fontSize: 18, marginLeft: 4, color: "var(--text-2)" },
                    children: s.u
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 13, color: "var(--text-3)", marginTop: 4 },
                children: s.l
              }, undefined, false, undefined, this)
            ]
          }, i, true, undefined, this))
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("section", {
        style: { maxWidth: 1280, margin: "0 auto", padding: "80px 24px" },
        children: jsxDEV_7x81h0kn("div", {
          className: "grid-3",
          style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
          children: [
            { icon: "\uD83D\uDD0D", title: "学校查询", desc: "输入学校名或关键词，查看详细信息、历年分数线和高考成绩", cta: "查询学校", route: "schools", color: "var(--primary)" },
            { icon: "⚖️", title: "多校对比", desc: "选择 2-5 所学校，横向对比录取分数、升学率、学校特色", cta: "开始对比", route: "compare", color: "var(--secondary)" },
            { icon: "\uD83C\uDFAF", title: "志愿推荐", desc: "输入估分和偏好，获取个性化报名策略和冲稳保建议", cta: "获取建议", route: "recommend", color: "var(--accent)" }
          ].map((f, i) => jsxDEV_7x81h0kn("div", {
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
            onClick: () => onNavigate(f.route),
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { width: 44, height: 44, background: f.color + "15", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 },
                children: f.icon
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("h3", {
                style: { fontSize: 18, fontWeight: 600, margin: "0 0 8px" },
                children: f.title
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("p", {
                style: { fontSize: 14, color: "var(--text-3)", lineHeight: 1.6, margin: "0 0 20px" },
                children: f.desc
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { color: f.color, fontSize: 14, fontWeight: 500 },
                children: [
                  f.cta,
                  " →"
                ]
              }, undefined, true, undefined, this)
            ]
          }, i, true, undefined, this))
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("section", {
        style: { maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 },
            children: [
              jsxDEV_7x81h0kn("h2", {
                style: { fontSize: 22, fontWeight: 600, margin: 0 },
                children: "热门关注学校"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("a", {
                href: "#",
                onClick: (e) => {
                  e.preventDefault();
                  onNavigate("schools");
                },
                style: { fontSize: 14, color: "var(--primary)", textDecoration: "none" },
                children: "查看全部 →"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          err ? jsxDEV_7x81h0kn(ErrorBox, {
            err
          }, undefined, false, undefined, this) : !featured.length ? jsxDEV_7x81h0kn(Loading, {}, undefined, false, undefined, this) : jsxDEV_7x81h0kn("div", {
            className: "grid-3",
            style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
            children: featured.map((s) => jsxDEV_7x81h0kn(SchoolCard, {
              school: s,
              onClick: () => onOpenSchool(s.id)
            }, s.id, false, undefined, this))
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.HomePage = HomePage;
