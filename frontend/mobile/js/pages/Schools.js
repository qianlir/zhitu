function MSchools({ onOpenSchool, onBack, initialQuery }) {
  const [q, setQ] = React.useState(initialQuery || "");
  const [tierFilter, setTierFilter] = React.useState("\u5168\u90E8");
  const [allSchools, setAllSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const debouncedQ = useDebounce(q, 300);
  const fetchSchools = (query) => {
    setLoading(true);
    API.schools({ q: query || "", limit: 500 }).then((r) => {
      setAllSchools(r.schools || []);
      setLoading(false);
    }).catch((e) => {
      setErr(e);
      setLoading(false);
    });
  };
  React.useEffect(() => {
    fetchSchools(initialQuery || "");
  }, []);
  React.useEffect(() => {
    fetchSchools(debouncedQ);
  }, [debouncedQ]);
  const filtered = allSchools.filter((s) => {
    if (tierFilter !== "\u5168\u90E8") {
      if (tierFilter === "\u56DB\u6821" && s.tier !== "\u56DB\u6821") return false;
      if (tierFilter === "\u5E02\u91CD\u70B9" && !["\u5E02\u5B9E\u9A8C\u793A\u8303", "\u59D4\u5C5E\u5E02\u91CD\u70B9"].includes(s.kind)) return false;
      if (tierFilter === "\u533A\u91CD\u70B9" && s.kind !== "\u533A\u5B9E\u9A8C\u793A\u8303") return false;
    }
    return true;
  }).sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(MNav, { title: "\u5B66\u6821\u67E5\u8BE2", subtitle: filtered.length + " \u6240", onBack }), /* @__PURE__ */ React.createElement("div", { className: "mp" }, /* @__PURE__ */ React.createElement("input", { className: "mi", value: q, onChange: (e) => setQ(e.target.value), placeholder: "\u{1F50D} \u641C\u7D22\u5B66\u6821...", style: { marginBottom: 12 } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 } }, ["\u5168\u90E8", "\u56DB\u6821", "\u5E02\u91CD\u70B9", "\u533A\u91CD\u70B9"].map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t,
      onClick: () => setTierFilter(t),
      style: { padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, border: "1px solid " + (tierFilter === t ? "var(--primary)" : "var(--border)"), background: tierFilter === t ? "var(--primary)" : "#fff", color: tierFilter === t ? "#fff" : "var(--text-2)", fontFamily: "inherit" }
    },
    t
  ))), loading ? /* @__PURE__ */ React.createElement(MLoading, null) : err ? /* @__PURE__ */ React.createElement(MError, { err }) : filtered.map((s) => /* @__PURE__ */ React.createElement(MSchoolRow, { key: s.id, school: s, onClick: () => onOpenSchool(s.id) })), !loading && !err && filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 48, color: "var(--text-3)" } }, "\u6CA1\u6709\u5339\u914D\u5B66\u6821")));
}
window.MSchools = MSchools;
