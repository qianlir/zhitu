function MCompare({ onOpenSchool, onBack }) {
  const [selected, setSelected] = React.useState([]);
  const [allSchools, setAllSchools] = React.useState([]);
  const [schools, setSchools] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
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
    setSearchOpen(false);
  };
  const remove = (id) => setSelected(selected.filter((x) => x !== id));
  const rows = [
    { l: "\u533A\u57DF", get: (s) => s.district },
    { l: "\u7C7B\u578B", get: (s) => s.kind },
    { l: "2025\u7EDF\u62DB", get: (s) => fmtScore(s.score2025), n: (s) => s.score2025 },
    { l: "\u4E00\u672C\u7387", get: (s) => (s.bbenRate || "\u2014") + "%", n: (s) => s.bbenRate },
    { l: "985\u7387", get: (s) => (s.top985 || "\u2014") + "%", n: (s) => s.top985 },
    { l: "\u6E05\u5317\u590D\u4EA4", get: (s) => (s.qbfd || "\u2014") + "\u4EBA", n: (s) => s.qbfd },
    { l: "\u62DB\u751F", get: (s) => (s.intake || "\u2014") + "\u4EBA" }
  ];
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(MNav, { title: "\u591A\u6821\u5BF9\u6BD4", subtitle: selected.length + "/5 \u6240", onBack }), /* @__PURE__ */ React.createElement("div", { className: "mp" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 } }, selected.map((id) => {
    const s = allSchools.find((x) => x.id === id) || schools.find((x) => x.id === id);
    return /* @__PURE__ */ React.createElement("span", { key: id, style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 8px 6px 12px", background: "var(--primary-50)", color: "var(--primary)", borderRadius: 999, fontSize: 13, fontWeight: 500 } }, s?.name || id, /* @__PURE__ */ React.createElement("button", { onClick: () => remove(id), style: { background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: 14, padding: 0 } }, "\xD7"));
  }), selected.length < 5 && /* @__PURE__ */ React.createElement("button", { onClick: () => setSearchOpen(!searchOpen), style: { padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px dashed var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" } }, "+ \u6DFB\u52A0")), searchOpen && /* @__PURE__ */ React.createElement("div", { className: "mc", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("input", { className: "mi", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "\u641C\u7D22\u5B66\u6821...", autoFocus: true, style: { marginBottom: 8 } }), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 200, overflowY: "auto" } }, candidates.slice(0, 8).map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => add(s.id), style: { padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: 14 } }, /* @__PURE__ */ React.createElement("span", null, s.name), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-3)", fontSize: 12 } }, s.district, " \xB7 ", fmtScore(s.score2025)))))), loading ? /* @__PURE__ */ React.createElement(MLoading, null) : schools.length >= 2 ? /* @__PURE__ */ React.createElement("div", { style: { overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("table", { style: { width: "100%", minWidth: schools.length * 110 + 90, borderCollapse: "collapse", fontSize: 13 } }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { style: { background: "var(--bg)" } }, /* @__PURE__ */ React.createElement("th", { style: { padding: 10, textAlign: "left", fontSize: 12, color: "var(--text-3)", position: "sticky", left: 0, background: "var(--bg)", minWidth: 70 } }, "\u6307\u6807"), schools.map((s) => /* @__PURE__ */ React.createElement("th", { key: s.id, style: { padding: 10, textAlign: "center", minWidth: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 13 } }, s.name || s.shortName))))), /* @__PURE__ */ React.createElement("tbody", null, rows.map((row, ri) => {
    const vals = schools.map((s) => row.n ? row.n(s) : null);
    const best = row.n ? Math.max(...vals.filter((v) => v != null)) : null;
    return /* @__PURE__ */ React.createElement("tr", { key: ri, style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "10px", color: "var(--text-3)", position: "sticky", left: 0, background: "#fff", fontSize: 12 } }, row.l), schools.map((s, i) => {
      const v = row.n ? row.n(s) : null;
      const isBest = best != null && v === best && schools.length > 1;
      return /* @__PURE__ */ React.createElement("td", { key: s.id, style: { padding: "10px", textAlign: "center", fontWeight: 500, background: isBest ? "rgba(5,150,105,0.08)" : "transparent", color: isBest ? "var(--success)" : "var(--text)" } }, row.get(s));
    }));
  })))) : /* @__PURE__ */ React.createElement("div", { className: "mc", style: { textAlign: "center", padding: 48, color: "var(--text-3)" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 36, marginBottom: 8 } }, "\u2696\uFE0F"), "\u81F3\u5C11\u9009 2 \u6240\u5B66\u6821")));
}
window.MCompare = MCompare;
