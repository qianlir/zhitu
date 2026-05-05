function SchoolDetailPage({ schoolId, onNavigate, onCompare, compareIds = [] }) {
  const [school, setSchool] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [tab, setTab] = React.useState("basic");
  React.useEffect(() => {
    setLoading(true);
    setErr(null);
    API.school(schoolId).then((s) => {
      setSchool(s);
      setLoading(false);
    }).catch((e) => {
      setErr(e);
      setLoading(false);
    });
  }, [schoolId]);
  if (loading)
    return jsxDEV_7x81h0kn("main", {
      style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" },
      children: jsxDEV_7x81h0kn(Loading, {}, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  if (err)
    return jsxDEV_7x81h0kn("main", {
      style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" },
      children: jsxDEV_7x81h0kn(ErrorBox, {
        err,
        onRetry: () => location.reload()
      }, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  if (!school)
    return null;
  const tabs = [
    { key: "basic", label: "基本信息" },
    { key: "history", label: "历年分数线" },
    { key: "gaokao", label: "高考成绩" }
  ];
  return jsxDEV_7x81h0kn("main", {
    style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--text-3)", marginBottom: 20 },
        children: [
          jsxDEV_7x81h0kn("a", {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              history.back();
            },
            style: { color: "var(--primary)", textDecoration: "none", fontWeight: 500 },
            children: "← 返回"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            style: { color: "var(--border)" },
            children: "|"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("a", {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate("home");
            },
            style: { color: "var(--text-3)" },
            children: "首页"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            style: { margin: "0 8px" },
            children: "/"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("a", {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate("schools");
            },
            style: { color: "var(--text-3)" },
            children: "学校查询"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            style: { margin: "0 8px" },
            children: "/"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("span", {
            style: { color: "var(--text)" },
            children: school.name
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "card",
        style: { padding: 28, marginBottom: 24, borderLeft: `4px solid ${tierBorder(school.score2025)}` },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" },
            children: [
              jsxDEV_7x81h0kn("div", {
                children: [
                  jsxDEV_7x81h0kn("h1", {
                    style: { fontSize: 32, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" },
                    children: school.name
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
                    children: [
                      jsxDEV_7x81h0kn("span", {
                        className: "pill pill-gray",
                        children: school.district
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("span", {
                        className: `pill ${school.tier === "四校" || school.tier === "八大" ? "pill-blue" : school.tier === "市重点" ? "pill-teal" : "pill-gray"}`,
                        children: school.kind
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("span", {
                        className: "pill",
                        children: school.funding
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("span", {
                        className: "pill pill-amber",
                        children: school.tier
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 14, color: "var(--text-3)", maxWidth: 720, lineHeight: 1.6 },
                    children: [
                      school.name,
                      "位于",
                      school.district,
                      "区，是上海市知名的",
                      school.kind,
                      "，",
                      school.funding,
                      "性质，以严谨学风和高升学率著称。"
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { display: "flex", gap: 8 },
                children: jsxDEV_7x81h0kn("button", {
                  className: "btn btn-secondary",
                  onClick: () => {
                    onCompare(school.id);
                  },
                  children: compareIds.includes(school.id) ? "✓ 已加入对比" : "加入对比"
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            className: "score-metrics",
            style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" },
            children: [
              { l: "2025统招", v: fmtScore(school.score2025), accent: true },
              { l: "名额到区", v: fmtScore(school.mingeDistrict), color: "#d97706" },
              { l: "名额到校", v: fmtScore(school.mingeSchool), color: "var(--success)" },
              { l: "自招分", v: fmtScore(school.zizhao), color: "#8b5cf6" },
              { l: "一本率", v: school.bbenRate + "%" },
              { l: "招生人数", v: school.intake + " 人" }
            ].map((m, i) => jsxDEV_7x81h0kn("div", {
              style: { borderRight: i < 5 ? "1px solid var(--border)" : "none", paddingLeft: i === 0 ? 0 : 16 },
              children: [
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 },
                  children: m.l
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: m.accent ? 26 : 18, fontWeight: 600, color: m.accent ? "var(--primary)" : m.color || "var(--text)", fontVariantNumeric: "tabular-nums" },
                  children: m.v
                }, undefined, false, undefined, this)
              ]
            }, i, true, undefined, this))
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { borderBottom: "1px solid var(--border)", marginBottom: 24, display: "flex", gap: 4 },
        children: tabs.map((t) => jsxDEV_7x81h0kn("button", {
          onClick: () => setTab(t.key),
          style: {
            padding: "12px 20px",
            background: "transparent",
            border: "none",
            borderBottom: tab === t.key ? "2px solid var(--primary)" : "2px solid transparent",
            color: tab === t.key ? "var(--primary)" : "var(--text-3)",
            fontWeight: tab === t.key ? 600 : 500,
            fontSize: 14,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: -1
          },
          children: t.label
        }, t.key, false, undefined, this))
      }, undefined, false, undefined, this),
      tab === "basic" && jsxDEV_7x81h0kn(BasicTab, {
        school
      }, undefined, false, undefined, this),
      tab === "history" && jsxDEV_7x81h0kn(HistoryTab, {
        school
      }, undefined, false, undefined, this),
      tab === "gaokao" && jsxDEV_7x81h0kn(GaokaoTab, {
        school
      }, undefined, false, undefined, this),
      tab === "eval" && jsxDEV_7x81h0kn(EvalTab, {
        school
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function BasicTab({ school }) {
  const rows = [
    ["学校全称", school.name],
    ["学校类型", school.kind],
    ["办别", school.funding],
    ["所在区", school.district + "区"],
    ["校区地址", school.address || "—"],
    ["联系电话", school.phone || "—"],
    ["招生人数", school.intake + " 人（" + (school.intakeNote || "统招") + "）"]
  ];
  if (school.website)
    rows.push(["官方网站", school.website, true]);
  return jsxDEV_7x81h0kn("div", {
    children: [
      school.intro && jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        style: { marginBottom: 16 },
        children: [
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 16, fontWeight: 600, margin: "0 0 12px" },
            children: "学校简介"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("p", {
            style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, margin: 0 },
            children: school.intro
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      school.tags && school.tags.length > 0 && jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        style: { marginBottom: 16 },
        children: [
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 16, fontWeight: 600, margin: "0 0 12px" },
            children: "学校特色标签"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", flexWrap: "wrap", gap: 8 },
            children: school.tags.map((t, i) => {
              const c = t.match(/四校|八大/) ? { bg: "var(--primary-50)", fg: "var(--primary)", bd: "var(--primary)" } : t.match(/竞赛|奥赛|金牌/) ? { bg: "rgba(217,119,6,0.08)", fg: "#b45309", bd: "#d97706" } : t.match(/理科|工科|科技|科创|STEM/) ? { bg: "rgba(6,148,162,0.08)", fg: "#0e7490", bd: "#0694a2" } : t.match(/文科|人文|文艺|博雅/) ? { bg: "rgba(139,92,246,0.08)", fg: "#7c3aed", bd: "#8b5cf6" } : t.match(/IB|国际|外语|德语|法语/) ? { bg: "rgba(5,150,105,0.08)", fg: "#047857", bd: "#059669" } : t.match(/寄宿|住宿/) ? { bg: "rgba(107,114,128,0.08)", fg: "#4b5563", bd: "#9ca3af" } : t.match(/百年|历史|院士|校友/) ? { bg: "rgba(168,52,42,0.08)", fg: "#991b1b", bd: "#dc2626" } : { bg: "var(--bg)", fg: "var(--text-2)", bd: "var(--border)" };
              return jsxDEV_7x81h0kn("span", {
                className: "pill",
                style: {
                  padding: "6px 14px",
                  fontSize: 13,
                  background: c.bg,
                  color: c.fg,
                  border: "1px solid " + c.bd
                },
                children: t
              }, i, false, undefined, this);
            })
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 },
        children: [
          { label: "一本率", value: school.bbenRate ? school.bbenRate + "%" : "—", color: "var(--primary)" },
          { label: "985/211率", value: school.top985 ? school.top985 + "%" : "—", color: "var(--secondary)" },
          { label: "清北复交", value: school.qbfd ? school.qbfd + " 人" : "—", color: "var(--accent)" }
        ].map((m, i) => jsxDEV_7x81h0kn("div", {
          className: "card card-pad",
          style: { textAlign: "center" },
          children: [
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 12, color: "var(--text-3)", marginBottom: 6 },
              children: m.label
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 22, fontWeight: 700, color: m.value === "—" ? "var(--text-muted)" : m.color, fontVariantNumeric: "tabular-nums" },
              children: m.value
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 },
              children: "数据来源：公开报道近似值"
            }, undefined, false, undefined, this)
          ]
        }, i, true, undefined, this))
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        children: [
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px" },
            children: "学校档案"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("table", {
            style: { width: "100%", fontSize: 14 },
            children: jsxDEV_7x81h0kn("tbody", {
              children: rows.map((r, i) => jsxDEV_7x81h0kn("tr", {
                style: { borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" },
                children: [
                  jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 0", color: "var(--text-3)", width: 140 },
                    children: r[0]
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 0", color: "var(--text)" },
                    children: r[2] ? jsxDEV_7x81h0kn("a", {
                      href: r[1].startsWith("http") ? r[1] : "https://" + r[1],
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { color: "var(--primary)", textDecoration: "none" },
                      children: [
                        r[1],
                        " ↗"
                      ]
                    }, undefined, true, undefined, this) : r[1]
                  }, undefined, false, undefined, this)
                ]
              }, i, true, undefined, this))
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function HistoryTab({ school }) {
  const tongzhao = (school.admissions || []).filter((a) => a.batch === "统招").sort((a, b) => a.year - b.year);
  const mingeByYear = {};
  const mingeSchoolByYear = {};
  const zizhaoByYear = {};
  (school.admissions || []).forEach((a) => {
    if (a.batch === "名额到区")
      mingeByYear[a.year] = a.min_score;
    if (a.batch === "名额到校")
      mingeSchoolByYear[a.year] = a.min_score;
    if (a.batch === "自主招生")
      zizhaoByYear[a.year] = a.min_score;
  });
  const data = tongzhao.map((a) => ({
    year: a.year,
    score: a.min_score,
    minge: mingeByYear[a.year] || null,
    mingeSchool: mingeSchoolByYear[a.year] || null,
    zizhao: zizhaoByYear[a.year] || null,
    ctrl: a.control_line
  }));
  if (!data.length)
    return jsxDEV_7x81h0kn("div", {
      className: "card card-pad",
      style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" },
      children: "暂无历年分数线数据"
    }, undefined, false, undefined, this);
  const minS = Math.min(...data.map((d) => d.score)) - 5;
  const maxS = Math.max(...data.map((d) => d.score)) + 5;
  const W = 720, H = 240, P = 40;
  const x = (i) => P + i / Math.max(data.length - 1, 1) * (W - P * 2);
  const y = (s) => H - P - (s - minS) / (maxS - minS || 1) * (H - P * 2);
  const path = data.map((d, i) => (i === 0 ? "M" : "L") + x(i) + "," + y(d.score)).join(" ");
  const trend = data.length >= 2 ? data[data.length - 1].score - data[Math.max(0, data.length - 3)].score : 0;
  return jsxDEV_7x81h0kn("div", {
    children: [
      jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        style: { marginBottom: 16 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
            children: [
              jsxDEV_7x81h0kn("div", {
                children: [
                  jsxDEV_7x81h0kn("h3", {
                    style: { fontSize: 16, fontWeight: 600, margin: "0 0 4px" },
                    children: "统招分数线趋势"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 12, color: "var(--text-3)" },
                    children: [
                      data[0].year,
                      " — ",
                      data[data.length - 1].year,
                      " · 单位：分"
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { textAlign: "right" },
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 12, color: "var(--text-3)" },
                    children: "趋势变化"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 20, fontWeight: 600, color: trend >= 0 ? "var(--success)" : "var(--danger)" },
                    children: [
                      trend >= 0 ? "↑" : "↓",
                      " ",
                      Math.abs(trend).toFixed(1),
                      " 分"
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("svg", {
            viewBox: `0 0 ${W} ${H}`,
            style: { width: "100%", height: "auto" },
            children: [
              [0, 0.25, 0.5, 0.75, 1].map((p, i) => jsxDEV_7x81h0kn("line", {
                x1: P,
                x2: W - P,
                y1: P + p * (H - P * 2),
                y2: P + p * (H - P * 2),
                stroke: "#e5e7eb",
                strokeDasharray: "2 4"
              }, i, false, undefined, this)),
              [0, 0.5, 1].map((p, i) => jsxDEV_7x81h0kn("text", {
                x: P - 8,
                y: P + p * (H - P * 2) + 4,
                textAnchor: "end",
                fontSize: "11",
                fill: "#9ca3af",
                children: Math.round(maxS - p * (maxS - minS))
              }, i, false, undefined, this)),
              jsxDEV_7x81h0kn("path", {
                d: path,
                fill: "none",
                stroke: "#1a56db",
                strokeWidth: "2.5",
                strokeLinecap: "round"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("path", {
                d: path + ` L${x(data.length - 1)},${H - P} L${x(0)},${H - P} Z`,
                fill: "url(#g1)",
                opacity: "0.15"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("defs", {
                children: jsxDEV_7x81h0kn("linearGradient", {
                  id: "g1",
                  x1: "0",
                  x2: "0",
                  y1: "0",
                  y2: "1",
                  children: [
                    jsxDEV_7x81h0kn("stop", {
                      offset: "0%",
                      stopColor: "#1a56db"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("stop", {
                      offset: "100%",
                      stopColor: "#1a56db",
                      stopOpacity: "0"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              }, undefined, false, undefined, this),
              data.map((d, i) => jsxDEV_7x81h0kn("g", {
                children: [
                  jsxDEV_7x81h0kn("circle", {
                    cx: x(i),
                    cy: y(d.score),
                    r: "4",
                    fill: "#fff",
                    stroke: "#1a56db",
                    strokeWidth: "2"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("text", {
                    x: x(i),
                    y: y(d.score) - 12,
                    textAnchor: "middle",
                    fontSize: "11",
                    fontWeight: "600",
                    fill: "#111827",
                    children: d.score.toFixed(1)
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("text", {
                    x: x(i),
                    y: H - P + 18,
                    textAnchor: "middle",
                    fontSize: "11",
                    fill: "#6b7280",
                    children: d.year
                  }, undefined, false, undefined, this)
                ]
              }, i, true, undefined, this))
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "card",
        style: { overflow: "hidden" },
        children: jsxDEV_7x81h0kn("table", {
          style: { width: "100%", fontSize: 13, borderCollapse: "collapse" },
          children: [
            jsxDEV_7x81h0kn("thead", {
              style: { background: "var(--bg)" },
              children: jsxDEV_7x81h0kn("tr", {
                children: ["年份", "统招最低分", "名额到区", "名额到校", "自招分", "控制线", "较前年"].map((h) => jsxDEV_7x81h0kn("th", {
                  style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--text-3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" },
                  children: h
                }, h, false, undefined, this))
              }, undefined, false, undefined, this)
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("tbody", {
              children: data.slice().reverse().map((d, i, arr) => {
                const prev = arr[i + 1];
                const delta = prev ? d.score - prev.score : null;
                return jsxDEV_7x81h0kn("tr", {
                  style: { borderTop: "1px solid var(--border)" },
                  children: [
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontWeight: 600 },
                      children: d.year
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 600 },
                      children: d.score.toFixed(1)
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "#d97706" },
                      children: d.minge ? d.minge.toFixed(1) : "—"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "var(--success)" },
                      children: d.mingeSchool ? d.mingeSchool.toFixed(1) : "—"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "#8b5cf6" },
                      children: d.zizhao ? d.zizhao.toFixed(1) : "—"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "var(--text-3)" },
                      children: d.ctrl || "—"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", color: delta == null ? "var(--text-muted)" : delta >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 500 },
                      children: delta == null ? "—" : (delta >= 0 ? "↑ +" : "↓ ") + delta.toFixed(1)
                    }, undefined, false, undefined, this)
                  ]
                }, d.year, true, undefined, this);
              })
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function GaokaoTab({ school }) {
  const sorted = (school.gaokao || []).sort((a, b) => b.year - a.year);
  const latest = sorted[0];
  if (!latest)
    return jsxDEV_7x81h0kn("div", {
      className: "card card-pad",
      style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" },
      children: "暂无高考成绩数据"
    }, undefined, false, undefined, this);
  const qbfd = (latest.qingbei || 0) + (latest.fudanJiaoda || 0);
  const metrics = [
    { l: "一本率", v: latest.oneBenRate, max: 100, suffix: "%", color: "var(--primary)" },
    { l: "985录取率", v: latest.top985, max: 100, suffix: "%", color: "var(--secondary)" },
    { l: "清北复交人数", v: qbfd, max: 150, suffix: "人", color: "var(--accent)" }
  ];
  return jsxDEV_7x81h0kn("div", {
    style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
    children: metrics.map((m, i) => jsxDEV_7x81h0kn("div", {
      className: "card card-pad",
      children: [
        jsxDEV_7x81h0kn("div", {
          style: { fontSize: 13, color: "var(--text-3)", marginBottom: 8 },
          children: m.l
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("div", {
          style: { fontSize: 36, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums", marginBottom: 12 },
          children: [
            m.v,
            jsxDEV_7x81h0kn("span", {
              style: { fontSize: 16, color: "var(--text-3)", marginLeft: 4 },
              children: m.suffix
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        jsxDEV_7x81h0kn("div", {
          style: { background: "var(--bg)", borderRadius: 999, height: 6, overflow: "hidden" },
          children: jsxDEV_7x81h0kn("div", {
            style: { width: m.v / m.max * 100 + "%", height: "100%", background: m.color, borderRadius: 999 }
          }, undefined, false, undefined, this)
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("div", {
          style: { fontSize: 11, color: "var(--text-3)", marginTop: 8 },
          children: [
            latest.year,
            "年高考数据 · ",
            jsxDEV_7x81h0kn("span", {
              className: "ai-badge",
              children: "部分数据 AI 整理"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, i, true, undefined, this))
  }, undefined, false, undefined, this);
}
function EvalTab({ school }) {
  const ev = school.evaluation;
  if (!ev)
    return jsxDEV_7x81h0kn("div", {
      className: "card card-pad",
      style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" },
      children: "暂无综合评估数据"
    }, undefined, false, undefined, this);
  const axes = ["学业水平", "升学质量", "学校管理", "课外活动", "地理位置"];
  const values = [ev.academic, ev.college, ev.management, ev.extra, ev.location].map((v) => v || 5);
  const cx = 200, cy = 200, R = 130;
  const angle = (i) => -Math.PI / 2 + i / axes.length * Math.PI * 2;
  const point = (i, v) => [cx + Math.cos(angle(i)) * R * (v / 10), cy + Math.sin(angle(i)) * R * (v / 10)];
  const polygon = values.map((v, i) => point(i, v).join(",")).join(" ");
  const overall = ev.overall || (values.reduce((a, b) => a + b, 0) / 5).toFixed(1);
  return jsxDEV_7x81h0kn("div", {
    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
    children: [
      jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        children: [
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 16, fontWeight: 600, margin: "0 0 4px" },
            children: "综合评估"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 12, color: "var(--text-3)", marginBottom: 16 },
            children: "5 维度评分（满分 10）"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("svg", {
            viewBox: "0 0 400 400",
            style: { width: "100%", height: "auto" },
            children: [
              [0.25, 0.5, 0.75, 1].map((p, i) => jsxDEV_7x81h0kn("polygon", {
                fill: "none",
                stroke: "#e5e7eb",
                strokeWidth: "1",
                points: axes.map((_, j) => point(j, 10 * p).join(",")).join(" ")
              }, i, false, undefined, this)),
              axes.map((a, i) => {
                const [px, py] = point(i, 10);
                return jsxDEV_7x81h0kn("line", {
                  x1: cx,
                  y1: cy,
                  x2: px,
                  y2: py,
                  stroke: "#e5e7eb"
                }, i, false, undefined, this);
              }),
              jsxDEV_7x81h0kn("polygon", {
                points: polygon,
                fill: "rgba(26,86,219,0.18)",
                stroke: "#1a56db",
                strokeWidth: "2"
              }, undefined, false, undefined, this),
              values.map((v, i) => {
                const [px, py] = point(i, v);
                return jsxDEV_7x81h0kn("circle", {
                  cx: px,
                  cy: py,
                  r: "4",
                  fill: "#1a56db"
                }, i, false, undefined, this);
              }),
              axes.map((a, i) => {
                const [px, py] = point(i, 11.5);
                return jsxDEV_7x81h0kn("text", {
                  x: px,
                  y: py,
                  textAnchor: "middle",
                  fontSize: "13",
                  fill: "#374151",
                  fontWeight: "500",
                  children: a
                }, i, false, undefined, this);
              })
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        children: [
          jsxDEV_7x81h0kn("div", {
            className: "card card-pad",
            style: { marginBottom: 16 },
            children: jsxDEV_7x81h0kn("div", {
              style: { display: "flex", alignItems: "center", gap: 16 },
              children: [
                jsxDEV_7x81h0kn("div", {
                  style: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--secondary))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 },
                  children: typeof overall === "number" ? overall.toFixed(1) : overall
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 12, color: "var(--text-3)", marginBottom: 4 },
                      children: "综合评分"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 16, fontWeight: 600 },
                      children: overall >= 8 ? "优秀 · 推荐报考" : overall >= 6 ? "良好" : "一般"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            className: "card card-pad",
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
                children: [
                  jsxDEV_7x81h0kn("h3", {
                    style: { fontSize: 14, fontWeight: 600, margin: 0 },
                    children: "智能分析"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("span", {
                    className: "ai-badge",
                    children: "AI 生成"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, fontStyle: "italic" },
                children: ev.summary || `${school.name}是${school.district}区的${school.kind}，2025年统招分数线达 ${fmtScore(school.score2025)}，一本率 ${school.bbenRate}%，整体升学质量稳居全市前列。`
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 11, color: "var(--text-muted)", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" },
                children: "数据来源：上海市教育考试院、各校官网公开数据 · 部分内容由 AI 整理，请以官方公告为准"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.SchoolDetailPage = SchoolDetailPage;
