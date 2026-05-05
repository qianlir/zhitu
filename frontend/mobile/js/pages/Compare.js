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
    if (!q)
      return true;
    const n = (name || "").toLowerCase();
    let pos = 0;
    for (const ch of q.toLowerCase()) {
      pos = n.indexOf(ch, pos);
      if (pos === -1)
        return false;
      pos++;
    }
    return true;
  };
  const candidates = allSchools.filter((s) => !selected.includes(s.id) && fuzzyMatch(s.name + (s.shortName || ""), search));
  const add = (id) => {
    if (selected.length < 5)
      setSelected([...selected, id]);
    setSearch("");
    setSearchOpen(false);
  };
  const remove = (id) => setSelected(selected.filter((x) => x !== id));
  const rows = [
    { l: "区域", get: (s) => s.district },
    { l: "类型", get: (s) => s.kind },
    { l: "2025统招", get: (s) => fmtScore(s.score2025), n: (s) => s.score2025 },
    { l: "一本率", get: (s) => (s.bbenRate || "—") + "%", n: (s) => s.bbenRate },
    { l: "985率", get: (s) => (s.top985 || "—") + "%", n: (s) => s.top985 },
    { l: "清北复交", get: (s) => (s.qbfd || "—") + "人", n: (s) => s.qbfd },
    { l: "招生", get: (s) => (s.intake || "—") + "人" }
  ];
  return jsxDEV_7x81h0kn("div", {
    children: [
      jsxDEV_7x81h0kn(MNav, {
        title: "多校对比",
        subtitle: selected.length + "/5 所",
        onBack
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "mp",
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 },
            children: [
              selected.map((id) => {
                const s = allSchools.find((x) => x.id === id) || schools.find((x) => x.id === id);
                return jsxDEV_7x81h0kn("span", {
                  style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 8px 6px 12px", background: "var(--primary-50)", color: "var(--primary)", borderRadius: 999, fontSize: 13, fontWeight: 500 },
                  children: [
                    s?.name || id,
                    jsxDEV_7x81h0kn("button", {
                      onClick: () => remove(id),
                      style: { background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: 14, padding: 0 },
                      children: "×"
                    }, undefined, false, undefined, this)
                  ]
                }, id, true, undefined, this);
              }),
              selected.length < 5 && jsxDEV_7x81h0kn("button", {
                onClick: () => setSearchOpen(!searchOpen),
                style: { padding: "6px 12px", borderRadius: 999, background: "#fff", border: "1px dashed var(--border)", color: "var(--text-3)", cursor: "pointer", fontSize: 13, fontFamily: "inherit" },
                children: "+ 添加"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          searchOpen && jsxDEV_7x81h0kn("div", {
            className: "mc",
            style: { marginBottom: 12 },
            children: [
              jsxDEV_7x81h0kn("input", {
                className: "mi",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "搜索学校...",
                autoFocus: true,
                style: { marginBottom: 8 }
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                style: { maxHeight: 200, overflowY: "auto" },
                children: candidates.slice(0, 8).map((s) => jsxDEV_7x81h0kn("div", {
                  onClick: () => add(s.id),
                  style: { padding: "10px 0", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", fontSize: 14 },
                  children: [
                    jsxDEV_7x81h0kn("span", {
                      children: s.name
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("span", {
                      style: { color: "var(--text-3)", fontSize: 12 },
                      children: [
                        s.district,
                        " · ",
                        fmtScore(s.score2025)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, s.id, true, undefined, this))
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          loading ? jsxDEV_7x81h0kn(MLoading, {}, undefined, false, undefined, this) : schools.length >= 2 ? jsxDEV_7x81h0kn("div", {
            style: { overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" },
            children: jsxDEV_7x81h0kn("table", {
              style: { width: "100%", minWidth: schools.length * 110 + 90, borderCollapse: "collapse", fontSize: 13 },
              children: [
                jsxDEV_7x81h0kn("thead", {
                  children: jsxDEV_7x81h0kn("tr", {
                    style: { background: "var(--bg)" },
                    children: [
                      jsxDEV_7x81h0kn("th", {
                        style: { padding: 10, textAlign: "left", fontSize: 12, color: "var(--text-3)", position: "sticky", left: 0, background: "var(--bg)", minWidth: 70 },
                        children: "指标"
                      }, undefined, false, undefined, this),
                      schools.map((s) => jsxDEV_7x81h0kn("th", {
                        style: { padding: 10, textAlign: "center", minWidth: 100 },
                        children: jsxDEV_7x81h0kn("div", {
                          style: { fontWeight: 600, fontSize: 13 },
                          children: s.name || s.shortName
                        }, undefined, false, undefined, this)
                      }, s.id, false, undefined, this))
                    ]
                  }, undefined, true, undefined, this)
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("tbody", {
                  children: rows.map((row, ri) => {
                    const vals = schools.map((s) => row.n ? row.n(s) : null);
                    const best = row.n ? Math.max(...vals.filter((v) => v != null)) : null;
                    return jsxDEV_7x81h0kn("tr", {
                      style: { borderTop: "1px solid var(--border)" },
                      children: [
                        jsxDEV_7x81h0kn("td", {
                          style: { padding: "10px", color: "var(--text-3)", position: "sticky", left: 0, background: "#fff", fontSize: 12 },
                          children: row.l
                        }, undefined, false, undefined, this),
                        schools.map((s, i) => {
                          const v = row.n ? row.n(s) : null;
                          const isBest = best != null && v === best && schools.length > 1;
                          return jsxDEV_7x81h0kn("td", {
                            style: { padding: "10px", textAlign: "center", fontWeight: 500, background: isBest ? "rgba(5,150,105,0.08)" : "transparent", color: isBest ? "var(--success)" : "var(--text)" },
                            children: row.get(s)
                          }, s.id, false, undefined, this);
                        })
                      ]
                    }, ri, true, undefined, this);
                  })
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this) : jsxDEV_7x81h0kn("div", {
            className: "mc",
            style: { textAlign: "center", padding: 48, color: "var(--text-3)" },
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { fontSize: 36, marginBottom: 8 },
                children: "⚖️"
              }, undefined, false, undefined, this),
              "至少选 2 所学校"
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.MCompare = MCompare;
