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
  if (loading) return /* @__PURE__ */ jsxDEV_7x81h0kn("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" } }, /* @__PURE__ */ jsxDEV_7x81h0kn(Loading, null));
  if (err) return /* @__PURE__ */ jsxDEV_7x81h0kn("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" } }, /* @__PURE__ */ jsxDEV_7x81h0kn(ErrorBox, { err, onRetry: () => location.reload() }));
  if (!school) return null;
  const tabs = [
    { key: "basic", label: "\u57FA\u672C\u4FE1\u606F" },
    { key: "history", label: "\u5386\u5E74\u5206\u6570\u7EBF" },
    { key: "gaokao", label: "\u9AD8\u8003\u6210\u7EE9" }
  ];
  return /* @__PURE__ */ jsxDEV_7x81h0kn("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "24px 24px 64px" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "var(--text-3)", marginBottom: 20 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    history.back();
  }, style: { color: "var(--primary)", textDecoration: "none", fontWeight: 500 } }, "\u2190 \u8FD4\u56DE"), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { style: { color: "var(--border)" } }, "|"), /* @__PURE__ */ jsxDEV_7x81h0kn("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate("home");
  }, style: { color: "var(--text-3)" } }, "\u9996\u9875"), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { style: { margin: "0 8px" } }, "/"), /* @__PURE__ */ jsxDEV_7x81h0kn("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate("schools");
  }, style: { color: "var(--text-3)" } }, "\u5B66\u6821\u67E5\u8BE2"), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { style: { margin: "0 8px" } }, "/"), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { style: { color: "var(--text)" } }, school.name)), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card", style: { padding: 28, marginBottom: 24, borderLeft: `4px solid ${tierBorder(school.score2025)}` } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, /* @__PURE__ */ jsxDEV_7x81h0kn("h1", { style: { fontSize: 32, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" } }, school.name), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: "pill pill-gray" }, school.district), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: `pill ${school.tier === "\u56DB\u6821" || school.tier === "\u516B\u5927" ? "pill-blue" : school.tier === "\u5E02\u91CD\u70B9" ? "pill-teal" : "pill-gray"}` }, school.kind), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: "pill" }, school.funding), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: "pill pill-amber" }, school.tier)), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 14, color: "var(--text-3)", maxWidth: 720, lineHeight: 1.6 } }, school.name, "\u4F4D\u4E8E", school.district, "\u533A\uFF0C\u662F\u4E0A\u6D77\u5E02\u77E5\u540D\u7684", school.kind, "\uFF0C", school.funding, "\u6027\u8D28\uFF0C\u4EE5\u4E25\u8C28\u5B66\u98CE\u548C\u9AD8\u5347\u5B66\u7387\u8457\u79F0\u3002")), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("button", { className: "btn btn-secondary", onClick: () => {
    onCompare(school.id);
  } }, compareIds.includes(school.id) ? "\u2713 \u5DF2\u52A0\u5165\u5BF9\u6BD4" : "\u52A0\u5165\u5BF9\u6BD4"))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "score-metrics", style: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)" } }, [
    { l: "2025\u7EDF\u62DB", v: fmtScore(school.score2025), accent: true },
    { l: "\u540D\u989D\u5230\u533A", v: school.mingeDistrict ? "\u5404\u533A\u4E0D\u540C" : "\u2014", color: "#d97706" },
    { l: "\u540D\u989D\u5230\u6821(\u6700\u4F4E)", v: fmtScore(school.mingeSchool), color: "var(--success)" },
    { l: "\u81EA\u62DB\u5206", v: fmtScore(school.zizhao), color: "#8b5cf6" },
    { l: "\u4E00\u672C\u7387", v: school.bbenRate + "%" },
    { l: "\u62DB\u751F\u4EBA\u6570", v: school.intake + " \u4EBA" }
  ].map((m, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", { key: i, style: { borderRight: i < 5 ? "1px solid var(--border)" : "none", paddingLeft: i === 0 ? 0 : 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 } }, m.l), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: m.accent ? 26 : 18, fontWeight: 600, color: m.accent ? "var(--primary)" : m.color || "var(--text)", fontVariantNumeric: "tabular-nums" } }, m.v))))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { borderBottom: "1px solid var(--border)", marginBottom: 24, display: "flex", gap: 4 } }, tabs.map((t) => /* @__PURE__ */ jsxDEV_7x81h0kn(
    "button",
    {
      key: t.key,
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
      }
    },
    t.label
  ))), tab === "basic" && /* @__PURE__ */ jsxDEV_7x81h0kn(BasicTab, { school }), tab === "history" && /* @__PURE__ */ jsxDEV_7x81h0kn(HistoryTab, { school }), tab === "gaokao" && /* @__PURE__ */ jsxDEV_7x81h0kn(GaokaoTab, { school }), tab === "eval" && /* @__PURE__ */ jsxDEV_7x81h0kn(EvalTab, { school }));
}
function BasicTab({ school }) {
  const rows = [
    ["\u5B66\u6821\u5168\u79F0", school.name],
    ["\u5B66\u6821\u7C7B\u578B", school.kind],
    ["\u529E\u522B", school.funding],
    ["\u6240\u5728\u533A", school.district + "\u533A"],
    ["\u6821\u533A\u5730\u5740", school.address || "\u2014"],
    ["\u8054\u7CFB\u7535\u8BDD", school.phone || "\u2014"],
    ["\u62DB\u751F\u4EBA\u6570", school.intake + " \u4EBA\uFF08" + (school.intakeNote || "\u7EDF\u62DB") + "\uFF09"]
  ];
  if (school.website) rows.push(["\u5B98\u65B9\u7F51\u7AD9", school.website, true]);
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, school.intro && /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 12px" } }, "\u5B66\u6821\u7B80\u4ECB"), /* @__PURE__ */ jsxDEV_7x81h0kn("p", { style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, margin: 0 } }, school.intro)), school.tags && school.tags.length > 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 12px" } }, "\u5B66\u6821\u7279\u8272\u6807\u7B7E"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, school.tags.map((t, i) => {
    const c = t.match(/四校|八大/) ? { bg: "var(--primary-50)", fg: "var(--primary)", bd: "var(--primary)" } : t.match(/竞赛|奥赛|金牌/) ? { bg: "rgba(217,119,6,0.08)", fg: "#b45309", bd: "#d97706" } : t.match(/理科|工科|科技|科创|STEM/) ? { bg: "rgba(6,148,162,0.08)", fg: "#0e7490", bd: "#0694a2" } : t.match(/文科|人文|文艺|博雅/) ? { bg: "rgba(139,92,246,0.08)", fg: "#7c3aed", bd: "#8b5cf6" } : t.match(/IB|国际|外语|德语|法语/) ? { bg: "rgba(5,150,105,0.08)", fg: "#047857", bd: "#059669" } : t.match(/寄宿|住宿/) ? { bg: "rgba(107,114,128,0.08)", fg: "#4b5563", bd: "#9ca3af" } : t.match(/百年|历史|院士|校友/) ? { bg: "rgba(168,52,42,0.08)", fg: "#991b1b", bd: "#dc2626" } : { bg: "var(--bg)", fg: "var(--text-2)", bd: "var(--border)" };
    return /* @__PURE__ */ jsxDEV_7x81h0kn("span", { key: i, className: "pill", style: {
      padding: "6px 14px",
      fontSize: 13,
      background: c.bg,
      color: c.fg,
      border: "1px solid " + c.bd
    } }, t);
  }))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 } }, [
    { label: "\u4E00\u672C\u7387", value: school.bbenRate ? school.bbenRate + "%" : "\u2014", color: "var(--primary)" },
    { label: "985/211\u7387", value: school.top985 ? school.top985 + "%" : "\u2014", color: "var(--secondary)" },
    { label: "\u6E05\u5317\u590D\u4EA4", value: school.qbfd ? school.qbfd + " \u4EBA" : "\u2014", color: "var(--accent)" }
  ].map((m, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", { key: i, className: "card card-pad", style: { textAlign: "center" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 6 } }, m.label), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 22, fontWeight: 700, color: m.value === "\u2014" ? "var(--text-muted)" : m.color, fontVariantNumeric: "tabular-nums" } }, m.value), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, "\u6570\u636E\u6765\u6E90\uFF1A\u516C\u5F00\u62A5\u9053\u8FD1\u4F3C\u503C")))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad" }, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px" } }, "\u5B66\u6821\u6863\u6848"), /* @__PURE__ */ jsxDEV_7x81h0kn("table", { style: { width: "100%", fontSize: 14 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("tbody", null, rows.map((r, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("tr", { key: i, style: { borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 0", color: "var(--text-3)", width: 140 } }, r[0]), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 0", color: "var(--text)" } }, r[2] ? /* @__PURE__ */ jsxDEV_7x81h0kn("a", { href: r[1].startsWith("http") ? r[1] : "https://" + r[1], target: "_blank", rel: "noopener noreferrer", style: { color: "var(--primary)", textDecoration: "none" } }, r[1], " \u2197") : r[1])))))));
}
function HistoryTab({ school }) {
  const tongzhao = (school.admissions || []).filter((a) => a.batch === "\u7EDF\u62DB").sort((a, b) => a.year - b.year);
  const mingeByYear = {};
  const mingeSchoolByYear = {};
  const zizhaoByYear = {};
  (school.admissions || []).forEach((a) => {
    if (a.batch === "\u540D\u989D\u5230\u533A") mingeByYear[a.year] = a.min_score;
    if (a.batch === "\u540D\u989D\u5230\u6821") mingeSchoolByYear[a.year] = a.min_score;
    if (a.batch === "\u81EA\u4E3B\u62DB\u751F") zizhaoByYear[a.year] = a.min_score;
  });
  const data = tongzhao.map((a) => ({
    year: a.year,
    score: a.min_score,
    minge: mingeByYear[a.year] || null,
    mingeSchool: mingeSchoolByYear[a.year] || null,
    zizhao: zizhaoByYear[a.year] || null,
    ctrl: a.control_line
  }));
  if (!data.length) return /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" } }, "\u6682\u65E0\u5386\u5E74\u5206\u6570\u7EBF\u6570\u636E");
  const minS = Math.min(...data.map((d) => d.score)) - 5;
  const maxS = Math.max(...data.map((d) => d.score)) + 5;
  const W = 720, H = 240, P = 40;
  const x = (i) => P + i / Math.max(data.length - 1, 1) * (W - P * 2);
  const y = (s) => H - P - (s - minS) / (maxS - minS || 1) * (H - P * 2);
  const path = data.map((d, i) => (i === 0 ? "M" : "L") + x(i) + "," + y(d.score)).join(" ");
  const trend = data.length >= 2 ? data[data.length - 1].score - data[Math.max(0, data.length - 3)].score : 0;
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 4px" } }, "\u7EDF\u62DB\u5206\u6570\u7EBF\u8D8B\u52BF"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)" } }, data[0].year, " \u2014 ", data[data.length - 1].year, " \xB7 \u5355\u4F4D\uFF1A\u5206")), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { textAlign: "right" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "\u8D8B\u52BF\u53D8\u5316"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 20, fontWeight: 600, color: trend >= 0 ? "var(--success)" : "var(--danger)" } }, trend >= 0 ? "\u2191" : "\u2193", " ", Math.abs(trend).toFixed(1), " \u5206"))), /* @__PURE__ */ jsxDEV_7x81h0kn("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: "auto" } }, [0, 0.25, 0.5, 0.75, 1].map((p, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("line", { key: i, x1: P, x2: W - P, y1: P + p * (H - P * 2), y2: P + p * (H - P * 2), stroke: "#e5e7eb", strokeDasharray: "2 4" })), [0, 0.5, 1].map((p, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("text", { key: i, x: P - 8, y: P + p * (H - P * 2) + 4, textAnchor: "end", fontSize: "11", fill: "#9ca3af" }, Math.round(maxS - p * (maxS - minS)))), /* @__PURE__ */ jsxDEV_7x81h0kn("path", { d: path, fill: "none", stroke: "#1a56db", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ jsxDEV_7x81h0kn("path", { d: path + ` L${x(data.length - 1)},${H - P} L${x(0)},${H - P} Z`, fill: "url(#g1)", opacity: "0.15" }), /* @__PURE__ */ jsxDEV_7x81h0kn("defs", null, /* @__PURE__ */ jsxDEV_7x81h0kn("linearGradient", { id: "g1", x1: "0", x2: "0", y1: "0", y2: "1" }, /* @__PURE__ */ jsxDEV_7x81h0kn("stop", { offset: "0%", stopColor: "#1a56db" }), /* @__PURE__ */ jsxDEV_7x81h0kn("stop", { offset: "100%", stopColor: "#1a56db", stopOpacity: "0" }))), data.map((d, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("g", { key: i }, /* @__PURE__ */ jsxDEV_7x81h0kn("circle", { cx: x(i), cy: y(d.score), r: "4", fill: "#fff", stroke: "#1a56db", strokeWidth: "2" }), /* @__PURE__ */ jsxDEV_7x81h0kn("text", { x: x(i), y: y(d.score) - 12, textAnchor: "middle", fontSize: "11", fontWeight: "600", fill: "#111827" }, d.score.toFixed(1)), /* @__PURE__ */ jsxDEV_7x81h0kn("text", { x: x(i), y: H - P + 18, textAnchor: "middle", fontSize: "11", fill: "#6b7280" }, d.year))))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card", style: { overflow: "hidden" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("table", { style: { width: "100%", fontSize: 13, borderCollapse: "collapse" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("thead", { style: { background: "var(--bg)" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("tr", null, ["\u5E74\u4EFD", "\u7EDF\u62DB\u6700\u4F4E\u5206", "\u540D\u989D\u5230\u533A", "\u540D\u989D\u5230\u6821", "\u81EA\u62DB\u5206", "\u63A7\u5236\u7EBF", "\u8F83\u524D\u5E74"].map((h) => /* @__PURE__ */ jsxDEV_7x81h0kn("th", { key: h, style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "var(--text-3)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" } }, h)))), /* @__PURE__ */ jsxDEV_7x81h0kn("tbody", null, data.slice().reverse().map((d, i, arr) => {
    const prev = arr[i + 1];
    const delta = prev ? d.score - prev.score : null;
    return /* @__PURE__ */ jsxDEV_7x81h0kn("tr", { key: d.year, style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontWeight: 600 } }, d.year), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", fontWeight: 600 } }, d.score.toFixed(1)), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "#d97706" } }, d.minge ? d.minge.toFixed(1) : "\u2014"), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "var(--success)" } }, d.mingeSchool ? d.mingeSchool.toFixed(1) : "\u2014"), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "#8b5cf6" } }, d.zizhao ? d.zizhao.toFixed(1) : "\u2014"), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", fontVariantNumeric: "tabular-nums", color: "var(--text-3)" } }, d.ctrl || "\u2014"), /* @__PURE__ */ jsxDEV_7x81h0kn("td", { style: { padding: "12px 16px", color: delta == null ? "var(--text-muted)" : delta >= 0 ? "var(--success)" : "var(--danger)", fontWeight: 500 } }, delta == null ? "\u2014" : (delta >= 0 ? "\u2191 +" : "\u2193 ") + delta.toFixed(1)));
  }))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { padding: "10px 16px", fontSize: 12, color: "var(--text-3)", background: "var(--bg)", borderTop: "1px solid var(--border)" } }, "\u6CE8\uFF1A\u540D\u989D\u5230\u533A\u5206\u6570\u4E3A\u6574\u4F53\u6700\u4F4E\u5F55\u53D6\u5206\uFF0C\u5404\u533A\u5B9E\u9645\u5206\u6570\u7EBF\u4E0D\u540C\u3002")), school.daoqu && school.daoqu.length > 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card", style: { marginTop: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { padding: "16px 20px 12px", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 15, fontWeight: 600 } }, "\u5404\u533A\u540D\u989D\u5230\u533A\u5F55\u53D6\u5206\u6570\u7EBF"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 4 } }, "\u6570\u636E\u6765\u6E90\uFF1A\u4E0A\u6D77\u5E02\u6559\u80B2\u8003\u8BD5\u9662 | \u542B\u7EFC\u8BC450\u5206\uFF0C\u603B\u5206800")), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 } }, school.daoqu.filter((d) => d.year === 2025).sort((a, b) => b.score - a.score).map((d) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", { key: d.district, style: { padding: "10px 16px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)", textAlign: "center" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 11, color: "var(--text-3)" } }, d.district), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 15, fontWeight: 600, color: "#d97706", fontVariantNumeric: "tabular-nums", marginTop: 2 } }, d.score))))));
}
function GaokaoTab({ school }) {
  const sorted = (school.gaokao || []).sort((a, b) => b.year - a.year);
  const latest = sorted[0];
  if (!latest) return /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" } }, "\u6682\u65E0\u9AD8\u8003\u6210\u7EE9\u6570\u636E");
  const qbfd = (latest.qingbei || 0) + (latest.fudanJiaoda || 0);
  const metrics = [
    { l: "\u4E00\u672C\u7387", v: latest.oneBenRate, max: 100, suffix: "%", color: "var(--primary)" },
    { l: "985\u5F55\u53D6\u7387", v: latest.top985, max: 100, suffix: "%", color: "var(--secondary)" },
    { l: "\u6E05\u5317\u590D\u4EA4\u4EBA\u6570", v: qbfd, max: 150, suffix: "\u4EBA", color: "var(--accent)" }
  ];
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, metrics.map((m, i) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", { key: i, className: "card card-pad" }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 13, color: "var(--text-3)", marginBottom: 8 } }, m.l), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 36, fontWeight: 700, color: m.color, fontVariantNumeric: "tabular-nums", marginBottom: 12 } }, m.v, /* @__PURE__ */ jsxDEV_7x81h0kn("span", { style: { fontSize: 16, color: "var(--text-3)", marginLeft: 4 } }, m.suffix)), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { background: "var(--bg)", borderRadius: 999, height: 6, overflow: "hidden" } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { width: m.v / m.max * 100 + "%", height: "100%", background: m.color, borderRadius: 999 } })), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 11, color: "var(--text-3)", marginTop: 8 } }, latest.year, "\u5E74\u9AD8\u8003\u6570\u636E \xB7 ", /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: "ai-badge" }, "\u90E8\u5206\u6570\u636E AI \u6574\u7406")))));
}
function EvalTab({ school }) {
  const ev = school.evaluation;
  if (!ev) return /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { textAlign: "center", color: "var(--text-3)", padding: "64px 24px" } }, "\u6682\u65E0\u7EFC\u5408\u8BC4\u4F30\u6570\u636E");
  const axes = ["\u5B66\u4E1A\u6C34\u5E73", "\u5347\u5B66\u8D28\u91CF", "\u5B66\u6821\u7BA1\u7406", "\u8BFE\u5916\u6D3B\u52A8", "\u5730\u7406\u4F4D\u7F6E"];
  const values = [ev.academic, ev.college, ev.management, ev.extra, ev.location].map((v) => v || 5);
  const cx = 200, cy = 200, R = 130;
  const angle = (i) => -Math.PI / 2 + i / axes.length * Math.PI * 2;
  const point = (i, v) => [cx + Math.cos(angle(i)) * R * (v / 10), cy + Math.sin(angle(i)) * R * (v / 10)];
  const polygon = values.map((v, i) => point(i, v).join(",")).join(" ");
  const overall = ev.overall || (values.reduce((a, b) => a + b, 0) / 5).toFixed(1);
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad" }, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 4px" } }, "\u7EFC\u5408\u8BC4\u4F30"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 16 } }, "5 \u7EF4\u5EA6\u8BC4\u5206\uFF08\u6EE1\u5206 10\uFF09"), /* @__PURE__ */ jsxDEV_7x81h0kn("svg", { viewBox: "0 0 400 400", style: { width: "100%", height: "auto" } }, [0.25, 0.5, 0.75, 1].map((p, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(
    "polygon",
    {
      key: i,
      fill: "none",
      stroke: "#e5e7eb",
      strokeWidth: "1",
      points: axes.map((_, j) => point(j, 10 * p).join(",")).join(" ")
    }
  )), axes.map((a, i) => {
    const [px, py] = point(i, 10);
    return /* @__PURE__ */ jsxDEV_7x81h0kn("line", { key: i, x1: cx, y1: cy, x2: px, y2: py, stroke: "#e5e7eb" });
  }), /* @__PURE__ */ jsxDEV_7x81h0kn("polygon", { points: polygon, fill: "rgba(26,86,219,0.18)", stroke: "#1a56db", strokeWidth: "2" }), values.map((v, i) => {
    const [px, py] = point(i, v);
    return /* @__PURE__ */ jsxDEV_7x81h0kn("circle", { key: i, cx: px, cy: py, r: "4", fill: "#1a56db" });
  }), axes.map((a, i) => {
    const [px, py] = point(i, 11.5);
    return /* @__PURE__ */ jsxDEV_7x81h0kn("text", { key: i, x: px, y: py, textAnchor: "middle", fontSize: "13", fill: "#374151", fontWeight: "500" }, a);
  }))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad", style: { marginBottom: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--secondary))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 } }, typeof overall === "number" ? overall.toFixed(1) : overall), /* @__PURE__ */ jsxDEV_7x81h0kn("div", null, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 12, color: "var(--text-3)", marginBottom: 4 } }, "\u7EFC\u5408\u8BC4\u5206"), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 16, fontWeight: 600 } }, overall >= 8 ? "\u4F18\u79C0 \xB7 \u63A8\u8350\u62A5\u8003" : overall >= 6 ? "\u826F\u597D" : "\u4E00\u822C")))), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { className: "card card-pad" }, /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ jsxDEV_7x81h0kn("h3", { style: { fontSize: 14, fontWeight: 600, margin: 0 } }, "\u667A\u80FD\u5206\u6790"), /* @__PURE__ */ jsxDEV_7x81h0kn("span", { className: "ai-badge" }, "AI \u751F\u6210")), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.7, fontStyle: "italic" } }, ev.summary || `${school.name}\u662F${school.district}\u533A\u7684${school.kind}\uFF0C2025\u5E74\u7EDF\u62DB\u5206\u6570\u7EBF\u8FBE ${fmtScore(school.score2025)}\uFF0C\u4E00\u672C\u7387 ${school.bbenRate}%\uFF0C\u6574\u4F53\u5347\u5B66\u8D28\u91CF\u7A33\u5C45\u5168\u5E02\u524D\u5217\u3002`), /* @__PURE__ */ jsxDEV_7x81h0kn("div", { style: { fontSize: 11, color: "var(--text-muted)", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" } }, "\u6570\u636E\u6765\u6E90\uFF1A\u4E0A\u6D77\u5E02\u6559\u80B2\u8003\u8BD5\u9662\u3001\u5404\u6821\u5B98\u7F51\u516C\u5F00\u6570\u636E \xB7 \u90E8\u5206\u5185\u5BB9\u7531 AI \u6574\u7406\uFF0C\u8BF7\u4EE5\u5B98\u65B9\u516C\u544A\u4E3A\u51C6"))));
}
window.SchoolDetailPage = SchoolDetailPage;
