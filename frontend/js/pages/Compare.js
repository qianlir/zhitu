function ComparePage({ initialIds, onOpenSchool, onNavigate }) {
  const [selected, setSelected] = React.useState(initialIds && initialIds.length ? initialIds : []);
  const [search, setSearch] = React.useState("");
  const [allSchools, setAllSchools] = React.useState([]);
  const [schools, setSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    API.schools({ limit: 500 }).then((r) => setAllSchools(r.schools || []));
  }, []);
  React.useEffect(() => {
    if (selected.length < 2) {
      setSchools([]);
      return;
    }
    setLoading(true);
    API.compare(selected).then((list) => {
      setSchools(list);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selected.join(",")]);
  const fuzzyMatch = (name, q) => {
    if (!q) return true;
    const n = (name || "").toLowerCase();
    let pos = 0;
    for (const ch of q.toLowerCase()) {
      pos = n.indexOf(ch, pos);
      if (pos === -1) return false;
      pos++;
    }
    return true;
  };
  const candidates = allSchools.filter((s) => !selected.includes(s.id) && fuzzyMatch(s.name + (s.shortName || ""), search));
  const add = (id) => {
    if (selected.length < 5) setSelected([...selected, id]);
    setSearch("");
  };
  const remove = (id) => setSelected(selected.filter((x) => x !== id));
  const bestIdx = (vals, higher = true) => {
    const nums = vals.map((v) => v == null || isNaN(v) ? null : v);
    const valid = nums.filter((v) => v != null);
    if (!valid.length) return -1;
    const target = higher ? Math.max(...valid) : Math.min(...valid);
    return nums.indexOf(target);
  };
  const worstIdx = (vals, higher = true) => bestIdx(vals, !higher);
  const Cell = ({ value, isBest, isWorst, mono, suffix }) => {
    const bg = isBest ? "rgba(5,150,105,0.10)" : isWorst ? "rgba(220,38,38,0.06)" : "transparent";
    const color = isBest ? "var(--success)" : "var(--text)";
    const weight = isBest ? 700 : 500;
    if (value == null) return /* @__PURE__ */ React.createElement("td", { style: { padding: "14px 16px", color: "var(--text-muted)", textAlign: "center", background: bg } }, "\u2014");
    return /* @__PURE__ */ React.createElement("td", { style: { padding: "14px 16px", textAlign: "center", background: bg, color, fontWeight: weight, fontVariantNumeric: mono ? "tabular-nums" : "normal" } }, value, suffix || "");
  };
  const trends = schools.map((s) => (s.score2025 || 0) - (s.score2023 || 0));
  const MiniRadar = ({ school }) => {
    const ev = school.evaluation;
    const vals = ev ? [ev.academic, ev.college, ev.management, ev.extra, ev.location].map((v) => v || 5) : [5, 5, 5, 5, 5];
    const cx = 30, cy = 30, R = 22;
    const ang = (i) => -Math.PI / 2 + i / 5 * Math.PI * 2;
    const pt = (i, v) => [cx + Math.cos(ang(i)) * R * (v / 10), cy + Math.sin(ang(i)) * R * (v / 10)];
    const poly = vals.map((v, i) => pt(i, v).join(",")).join(" ");
    const score = (vals.reduce((a, b) => a + b, 0) / 5).toFixed(1);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("svg", { width: "60", height: "60", viewBox: "0 0 60 60" }, /* @__PURE__ */ React.createElement("polygon", { points: [0, 1, 2, 3, 4].map((i) => pt(i, 10).join(",")).join(" "), fill: "none", stroke: "#e5e7eb" }), /* @__PURE__ */ React.createElement("polygon", { points: poly, fill: "rgba(26,86,219,0.2)", stroke: "#1a56db", strokeWidth: "1.5" })), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 14 } }, score));
  };
  const selectedNames = selected.map((id) => {
    const s = allSchools.find((x) => x.id === id);
    return s ? s.name : id;
  });
  return /* @__PURE__ */ React.createElement("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24, display: "flex", alignItems: "baseline", justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate && onNavigate("schools");
  }, style: { fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 8, display: "inline-block" } }, "\u2190 \u8FD4\u56DE\u5B66\u6821\u67E5\u8BE2"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 600, margin: "0 0 4px" } }, "\u591A\u6821\u5BF9\u6BD4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u6700\u591A 5 \u6240\u5B66\u6821 \xB7 \u5DF2\u9009 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text)" } }, selected.length))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: () => setSelected([]) }, "\u6E05\u7A7A\u5BF9\u6BD4")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: selected.length ? 12 : 0 } }, selected.map((id, idx) => /* @__PURE__ */ React.createElement("span", { key: id, className: "pill", style: { padding: "6px 6px 6px 14px", fontSize: 13, background: "var(--primary-50)", color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: 4 } }, selectedNames[idx], /* @__PURE__ */ React.createElement("button", { onClick: () => remove(id), style: { marginLeft: 4, background: "transparent", border: "none", cursor: "pointer", color: "var(--primary)", padding: "2px 6px", borderRadius: 4, lineHeight: 1, fontSize: 14 } }, "\u2715"))), selected.length < 5 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-3)" } }, selected.length === 0 ? "\u9009\u62E9 2-5 \u6240\u5B66\u6821\u5F00\u59CB\u5BF9\u6BD4 \u2192" : "\u8FD8\u53EF\u6DFB\u52A0 " + (5 - selected.length) + " \u6240")), selected.length < 5 && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: "search", placeholder: "\u641C\u7D22\u5B66\u6821\u6DFB\u52A0...", value: search, onChange: (e) => setSearch(e.target.value), style: { fontSize: 14 } }), search && candidates.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "card", style: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, padding: 4, zIndex: 10, maxHeight: 280, overflow: "auto", boxShadow: "var(--shadow-lg)" } }, candidates.slice(0, 8).map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c.id,
      onClick: () => add(c.id),
      style: { width: "100%", textAlign: "left", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" },
      onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg)",
      onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
    },
    /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, c.name), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12, marginLeft: 6 } }, c.district, " \xB7 ", c.kind)),
    /* @__PURE__ */ React.createElement(ScoreChip, { score: c.score2025 })
  ))))), selected.length < 2 ? /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { textAlign: "center", padding: "80px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 48, marginBottom: 12 } }, "\u2696\uFE0F"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, marginBottom: 6 } }, "\u81F3\u5C11\u9009\u62E9 2 \u6240\u5B66\u6821\u5F00\u59CB\u5BF9\u6BD4"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u5EFA\u8BAE\u9009\u62E9\u540C\u4E00\u5206\u6570\u6BB5\u6216\u4E0D\u540C\u68AF\u5EA6\u7684\u5B66\u6821\u8FDB\u884C\u5BF9\u6BD4")) : loading ? /* @__PURE__ */ React.createElement(Loading, null) : /* @__PURE__ */ React.createElement("div", { className: "card", style: { overflow: "auto" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 200 + schools.length * 200 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg)" } }, /* @__PURE__ */ React.createElement("th", { style: { padding: "20px 16px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em", position: "sticky", left: 0, background: "var(--bg)", zIndex: 2, minWidth: 200 } }, "\u5BF9\u6BD4\u9879"), schools.map((s) => /* @__PURE__ */ React.createElement("th", { key: s.id, style: { padding: "16px 16px", textAlign: "center", minWidth: 200, borderLeft: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("span", { className: `pill ${s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927" ? "pill-blue" : s.tier === "\u5E02\u91CD\u70B9" ? "pill-teal" : "pill-gray"}`, style: { fontSize: 10, padding: "2px 8px" } }, s.kind)))))), /* @__PURE__ */ React.createElement("tbody", null, /* @__PURE__ */ React.createElement(SectionRow, { label: "\u57FA\u672C\u4FE1\u606F", cols: schools.length + 1 }), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u533A\u57DF", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center" } }, s.district))), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u5B66\u6821\u7C7B\u578B", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("span", { className: `pill ${s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927" ? "pill-blue" : s.tier === "\u5E02\u91CD\u70B9" ? "pill-teal" : "pill-gray"}`, style: { fontSize: 11 } }, s.kind)))), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u529E\u522B", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center", color: "var(--text-2)" } }, s.funding))), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u62DB\u751F\u4EBA\u6570", sticky: true }, (() => {
    const vals = schools.map((s) => s.intake);
    const best = bestIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: s.intake, mono: true, suffix: " \u4EBA", isBest: i === best }));
  })()), /* @__PURE__ */ React.createElement(SectionRow, { label: "2025 \u5F55\u53D6", cols: schools.length + 1 }), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u7EDF\u62DB\u6700\u4F4E\u5206", sticky: true, highlight: true }, (() => {
    const vals = schools.map((s) => s.score2025);
    const best = bestIdx(vals);
    const worst = worstIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.score2025), isBest: i === best, isWorst: i === worst, mono: true }));
  })()), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u540D\u989D\u5230\u533A(\u53C2\u8003)", sticky: true }, (() => {
    const vals = schools.map((s) => s.mingeDistrict);
    const best = bestIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.mingeDistrict), isBest: s.mingeDistrict && i === best, mono: true }));
  })()), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u81EA\u62DB\u5206", sticky: true }, (() => {
    const vals = schools.map((s) => s.zizhao);
    const best = bestIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.zizhao), isBest: s.zizhao && i === best, mono: true }));
  })()), /* @__PURE__ */ React.createElement(SectionRow, { label: "\u5386\u5E74\u8D8B\u52BF", cols: schools.length + 1 }), /* @__PURE__ */ React.createElement(CmpRow, { label: "2023 \u7EDF\u62DB", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.score2023), mono: true }))), /* @__PURE__ */ React.createElement(CmpRow, { label: "2024 \u7EDF\u62DB", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.score2024), mono: true }))), /* @__PURE__ */ React.createElement(CmpRow, { label: "2025 \u7EDF\u62DB", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: fmtScore(s.score2025), mono: true }))), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u4E09\u5E74\u53D8\u5316", sticky: true }, schools.map((s, i) => {
    const t = trends[i];
    const color = t > 0 ? "var(--success)" : t < 0 ? "var(--danger)" : "var(--text-3)";
    return /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center", color, fontWeight: 600, fontVariantNumeric: "tabular-nums" } }, t > 0 ? "\u2191 +" : t < 0 ? "\u2193 " : "", t.toFixed(1), " \u5206");
  })), /* @__PURE__ */ React.createElement(SectionRow, { label: "\u9AD8\u8003\u6210\u7EE9", cols: schools.length + 1 }), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u4E00\u672C\u7387", sticky: true }, (() => {
    const vals = schools.map((s) => s.bbenRate);
    const best = bestIdx(vals);
    const worst = worstIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: s.bbenRate + "%", isBest: i === best, isWorst: i === worst, mono: true }));
  })()), /* @__PURE__ */ React.createElement(CmpRow, { label: "985 \u5F55\u53D6\u7387", sticky: true }, (() => {
    const vals = schools.map((s) => s.top985);
    const best = bestIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: s.top985 + "%", isBest: i === best, mono: true }));
  })()), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u6E05\u5317\u590D\u4EA4\u4EBA\u6570", sticky: true }, (() => {
    const vals = schools.map((s) => s.qbfd);
    const best = bestIdx(vals);
    return schools.map((s, i) => /* @__PURE__ */ React.createElement(Cell, { key: s.id, value: s.qbfd, suffix: " \u4EBA", isBest: i === best, mono: true }));
  })()), /* @__PURE__ */ React.createElement(SectionRow, { label: "\u7EFC\u5408\u8BC4\u5206", cols: schools.length + 1 }), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u8BC4\u5206 + \u96F7\u8FBE", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(MiniRadar, { school: s })))), /* @__PURE__ */ React.createElement(CmpRow, { label: "\u8BE6\u60C5\u94FE\u63A5", sticky: true }, schools.map((s) => /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "12px 16px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", style: { fontSize: 12, padding: "4px 10px", color: "var(--primary)" }, onClick: () => onOpenSchool(s.id) }, "\u67E5\u770B\u8BE6\u60C5 \u2192"))))))), schools.length >= 2 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", alignSelf: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(5,150,105,0.10)", padding: "2px 6px", borderRadius: 4, color: "var(--success)", fontWeight: 600, marginRight: 4 } }, "\u7EFF\u8272"), "\u6BCF\u884C\u6700\u4F73 \xB7 ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(220,38,38,0.06)", padding: "2px 6px", borderRadius: 4, marginRight: 4, marginLeft: 4 } }, "\u7EA2\u8272"), "\u6BCF\u884C\u6700\u4F4E")));
}
function SectionRow({ label, cols }) {
  return /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: cols, style: { padding: "14px 16px", background: "#f3f4f6", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", position: "sticky", left: 0 } }, label));
}
function CmpRow({ label, sticky, highlight, children }) {
  return /* @__PURE__ */ React.createElement("tr", { style: { borderTop: "1px solid var(--border)", background: highlight ? "rgba(26,86,219,0.02)" : "transparent" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "12px 16px", color: "var(--text-3)", fontSize: 13, fontWeight: 500, position: sticky ? "sticky" : "static", left: 0, background: highlight ? "#f0f5ff" : "#fff", borderRight: "1px solid var(--border)" } }, label), children);
}
window.ComparePage = ComparePage;
