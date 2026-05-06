function SchoolsPage({ onOpenSchool, initialQuery, onNavigate }) {
  const [districts, setDistricts] = React.useState(/* @__PURE__ */ new Set());
  const [tiers, setTiers] = React.useState(/* @__PURE__ */ new Set());
  const [funding, setFunding] = React.useState(/* @__PURE__ */ new Set());
  const [scoreRange, setScoreRange] = React.useState([513, 730]);
  const [bbenMin, setBbenMin] = React.useState(0);
  const [query, setQuery] = React.useState(initialQuery || "");
  const [sort, setSort] = React.useState("score_desc");
  const [allSchools, setAllSchools] = React.useState([]);
  const [districtList, setDistrictList] = React.useState([]);
  const [typeList, setTypeList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const debouncedQuery = useDebounce(query, 300);
  const fetchSchools = (q) => {
    setLoading(true);
    API.schools({ q: q || "", limit: 500 }).then((r) => {
      setAllSchools(r.schools || []);
      setLoading(false);
    }).catch((e) => {
      setErr(e);
      setLoading(false);
    });
  };
  React.useEffect(() => {
    var initQ = initialQuery || "";
    Promise.all([API.schools({ q: initQ, limit: 500 }), API.districts(), API.types()]).then(([list, ds, ts]) => {
      setAllSchools(list.schools || []);
      setDistrictList(ds.length ? ds : SH_DISTRICTS);
      setTypeList(ts);
      setLoading(false);
    }).catch((e) => {
      setErr(e);
      setLoading(false);
    });
  }, []);
  React.useEffect(() => {
    if (debouncedQuery) fetchSchools(debouncedQuery);
    else fetchSchools("");
  }, [debouncedQuery]);
  const filtered = React.useMemo(() => {
    let arr = allSchools.filter((s) => {
      if (districts.size && !districts.has(s.district)) return false;
      if (tiers.size && !tiers.has(s.kind)) return false;
      if (funding.size && !funding.has(s.funding)) return false;
      const sc = s.score2025 || 0;
      if (sc < scoreRange[0] || sc > scoreRange[1]) return false;
      if ((s.bbenRate || 0) < bbenMin) return false;
      return true;
    });
    if (sort === "score_desc") arr.sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0));
    else if (sort === "bben_desc") arr.sort((a, b) => (b.bbenRate || 0) - (a.bbenRate || 0));
    else if (sort === "intake_desc") arr.sort((a, b) => (b.intake || 0) - (a.intake || 0));
    return arr;
  }, [allSchools, query, districts, tiers, funding, scoreRange, bbenMin, sort]);
  const toggle = (set, value, setter) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };
  const FilterSection = ({ title, children }) => /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-3)", marginBottom: 10 } }, title), children);
  const Check = ({ checked, onChange, label }) => /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-2)", cursor: "pointer", padding: "4px 0" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked, onChange, style: { width: 14, height: 14, accentColor: "var(--primary)" } }), label);
  return /* @__PURE__ */ React.createElement("main", { style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 24 } }, /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
    e.preventDefault();
    onNavigate && onNavigate("home");
  }, style: { fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 8, display: "inline-block" } }, "\u2190 \u8FD4\u56DE\u9996\u9875"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 600, margin: "0 0 16px" } }, "\u5B66\u6821\u67E5\u8BE2"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("input", { type: "search", placeholder: "\u641C\u7D22\u5B66\u6821\u540D\u3001\u533A\u57DF\u3001\u7279\u8272\uFF08\u5982\uFF1A\u6570\u5B66\u7ADE\u8D5B\u3001\u5BC4\u5BBF\u5236\u3001\u6D66\u4E1C\uFF09...", value: query, onChange: (e) => setQuery(e.target.value), style: { flex: 1, fontSize: 15, padding: "12px 16px" } }), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => {
  } }, "\u641C\u7D22"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 } }, /* @__PURE__ */ React.createElement("aside", { className: "card", style: { padding: 20, height: "fit-content", position: "sticky", top: 88 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, fontWeight: 600 } }, "\u7B5B\u9009"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost", style: { padding: "4px 8px", fontSize: 12 }, onClick: () => {
    setDistricts(/* @__PURE__ */ new Set());
    setTiers(/* @__PURE__ */ new Set());
    setFunding(/* @__PURE__ */ new Set());
    setScoreRange([513, 730]);
    setBbenMin(0);
  } }, "\u6E05\u7A7A")), /* @__PURE__ */ React.createElement(FilterSection, { title: "\u533A\u57DF" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 } }, districtList.map((d) => /* @__PURE__ */ React.createElement(Check, { key: d, checked: districts.has(d), onChange: () => toggle(districts, d, setDistricts), label: d })))), /* @__PURE__ */ React.createElement(FilterSection, { title: "\u5B66\u6821\u7C7B\u578B" }, (typeList.length ? typeList : ["\u59D4\u5C5E\u5E02\u91CD\u70B9", "\u5E02\u5B9E\u9A8C\u793A\u8303", "\u533A\u5B9E\u9A8C\u793A\u8303", "\u666E\u901A\u9AD8\u4E2D"]).map((t) => /* @__PURE__ */ React.createElement(
    Check,
    {
      key: t,
      checked: tiers.has(t),
      onChange: () => toggle(tiers, t, setTiers),
      label: /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { className: t.includes("\u59D4\u5C5E") ? "pill pill-blue" : t.includes("\u5E02") ? "pill pill-teal" : t.includes("\u533A") ? "pill pill-amber" : "pill pill-gray", style: { fontSize: 10, padding: "2px 8px" } }, t))
    }
  ))), /* @__PURE__ */ React.createElement(FilterSection, { title: "\u529E\u522B" }, ["\u516C\u529E", "\u6C11\u529E"].map((f) => /* @__PURE__ */ React.createElement(Check, { key: f, checked: funding.has(f), onChange: () => toggle(funding, f, setFunding), label: f }))), /* @__PURE__ */ React.createElement(FilterSection, { title: "2025\u7EDF\u62DB\u5206\u6570\u6BB5" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", fontVariantNumeric: "tabular-nums", marginBottom: 6 } }, scoreRange[0], " \u2014 ", scoreRange[1], " \u5206"), /* @__PURE__ */ React.createElement("input", { type: "range", min: "513", max: "730", value: scoreRange[0], onChange: (e) => setScoreRange([+e.target.value, scoreRange[1]]), style: { width: "100%", accentColor: "var(--primary)" } }), /* @__PURE__ */ React.createElement("input", { type: "range", min: "513", max: "730", value: scoreRange[1], onChange: (e) => setScoreRange([scoreRange[0], +e.target.value]), style: { width: "100%", accentColor: "var(--primary)" } })), /* @__PURE__ */ React.createElement(FilterSection, { title: "\u4E00\u672C\u7387" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", marginBottom: 6 } }, "\u2265 ", bbenMin, "%"), /* @__PURE__ */ React.createElement("input", { type: "range", min: "0", max: "100", value: bbenMin, onChange: (e) => setBbenMin(+e.target.value), style: { width: "100%", accentColor: "var(--primary)" } }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "var(--text-3)" } }, "\u5171 ", /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--text)" } }, filtered.length), " \u6240\u5B66\u6821"), /* @__PURE__ */ React.createElement("select", { value: sort, onChange: (e) => setSort(e.target.value), style: { width: 160, fontSize: 13, padding: "6px 10px" } }, /* @__PURE__ */ React.createElement("option", { value: "score_desc" }, "\u63092025\u5206\u6570 \u2193"), /* @__PURE__ */ React.createElement("option", { value: "bben_desc" }, "\u6309\u4E00\u672C\u7387 \u2193"), /* @__PURE__ */ React.createElement("option", { value: "intake_desc" }, "\u6309\u62DB\u751F\u4EBA\u6570 \u2193"))), loading ? /* @__PURE__ */ React.createElement(Loading, null) : err ? /* @__PURE__ */ React.createElement(ErrorBox, { err, onRetry: () => location.reload() }) : filtered.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { textAlign: "center", padding: "64px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 48, marginBottom: 12 } }, "\u{1F50E}"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600, marginBottom: 6 } }, "\u6CA1\u6709\u5339\u914D\u7684\u5B66\u6821"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u8BD5\u8BD5\u8C03\u6574\u7B5B\u9009\u6761\u4EF6")) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, filtered.map((s) => /* @__PURE__ */ React.createElement(SchoolCard, { key: s.id, school: s, onClick: () => onOpenSchool(s.id) }))))));
}
window.SchoolsPage = SchoolsPage;
