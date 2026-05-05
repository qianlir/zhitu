function SchoolsPage({ onOpenSchool, initialQuery, onNavigate }) {
  const [districts, setDistricts] = React.useState(new Set);
  const [tiers, setTiers] = React.useState(new Set);
  const [funding, setFunding] = React.useState(new Set);
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
    Promise.all([API.schools({ limit: 500 }), API.districts(), API.types()]).then(([list, ds, ts]) => {
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
    if (debouncedQuery)
      fetchSchools(debouncedQuery);
    else
      fetchSchools("");
  }, [debouncedQuery]);
  const filtered = React.useMemo(() => {
    let arr = allSchools.filter((s) => {
      if (districts.size && !districts.has(s.district))
        return false;
      if (tiers.size && !tiers.has(s.kind))
        return false;
      if (funding.size && !funding.has(s.funding))
        return false;
      const sc = s.score2025 || 0;
      if (sc < scoreRange[0] || sc > scoreRange[1])
        return false;
      if ((s.bbenRate || 0) < bbenMin)
        return false;
      return true;
    });
    if (sort === "score_desc")
      arr.sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0));
    else if (sort === "bben_desc")
      arr.sort((a, b) => (b.bbenRate || 0) - (a.bbenRate || 0));
    else if (sort === "intake_desc")
      arr.sort((a, b) => (b.intake || 0) - (a.intake || 0));
    return arr;
  }, [allSchools, query, districts, tiers, funding, scoreRange, bbenMin, sort]);
  const toggle = (set, value, setter) => {
    const next = new Set(set);
    if (next.has(value))
      next.delete(value);
    else
      next.add(value);
    setter(next);
  };
  const FilterSection = ({ title, children }) => jsxDEV_7x81h0kn("div", {
    style: { marginBottom: 24 },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-3)", marginBottom: 10 },
        children: title
      }, undefined, false, undefined, this),
      children
    ]
  }, undefined, true, undefined, this);
  const Check = ({ checked, onChange, label }) => jsxDEV_7x81h0kn("label", {
    style: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-2)", cursor: "pointer", padding: "4px 0" },
    children: [
      jsxDEV_7x81h0kn("input", {
        type: "checkbox",
        checked,
        onChange,
        style: { width: 14, height: 14, accentColor: "var(--primary)" }
      }, undefined, false, undefined, this),
      label
    ]
  }, undefined, true, undefined, this);
  return jsxDEV_7x81h0kn("main", {
    style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" },
    children: [
      jsxDEV_7x81h0kn("div", {
        style: { marginBottom: 24 },
        children: [
          jsxDEV_7x81h0kn("a", {
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              onNavigate && onNavigate("home");
            },
            style: { fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 8, display: "inline-block" },
            children: "← 返回首页"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("h1", {
            style: { fontSize: 24, fontWeight: 600, margin: "0 0 16px" },
            children: "学校查询"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 12, alignItems: "center" },
            children: [
              jsxDEV_7x81h0kn("input", {
                type: "search",
                placeholder: "搜索学校名称...",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                style: { flex: 1, fontSize: 15, padding: "12px 16px" }
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("button", {
                className: "btn btn-primary",
                onClick: () => {},
                children: "搜索"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 },
        children: [
          jsxDEV_7x81h0kn("aside", {
            className: "card",
            style: { padding: 20, height: "fit-content", position: "sticky", top: 88 },
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 14, fontWeight: 600 },
                    children: "筛选"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("button", {
                    className: "btn btn-ghost",
                    style: { padding: "4px 8px", fontSize: 12 },
                    onClick: () => {
                      setDistricts(new Set);
                      setTiers(new Set);
                      setFunding(new Set);
                      setScoreRange([513, 730]);
                      setBbenMin(0);
                    },
                    children: "清空"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn(FilterSection, {
                title: "区域",
                children: jsxDEV_7x81h0kn("div", {
                  style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 },
                  children: districtList.map((d) => jsxDEV_7x81h0kn(Check, {
                    checked: districts.has(d),
                    onChange: () => toggle(districts, d, setDistricts),
                    label: d
                  }, d, false, undefined, this))
                }, undefined, false, undefined, this)
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn(FilterSection, {
                title: "学校类型",
                children: (typeList.length ? typeList : ["委属市重点", "市实验示范", "区实验示范", "普通高中"]).map((t) => jsxDEV_7x81h0kn(Check, {
                  checked: tiers.has(t),
                  onChange: () => toggle(tiers, t, setTiers),
                  label: jsxDEV_7x81h0kn("span", {
                    style: { display: "flex", alignItems: "center", gap: 6 },
                    children: jsxDEV_7x81h0kn("span", {
                      className: t.includes("委属") ? "pill pill-blue" : t.includes("市") ? "pill pill-teal" : t.includes("区") ? "pill pill-amber" : "pill pill-gray",
                      style: { fontSize: 10, padding: "2px 8px" },
                      children: t
                    }, undefined, false, undefined, this)
                  }, undefined, false, undefined, this)
                }, t, false, undefined, this))
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn(FilterSection, {
                title: "办别",
                children: ["公办", "民办"].map((f) => jsxDEV_7x81h0kn(Check, {
                  checked: funding.has(f),
                  onChange: () => toggle(funding, f, setFunding),
                  label: f
                }, f, false, undefined, this))
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn(FilterSection, {
                title: "2025统招分数段",
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 13, color: "var(--text-2)", fontVariantNumeric: "tabular-nums", marginBottom: 6 },
                    children: [
                      scoreRange[0],
                      " — ",
                      scoreRange[1],
                      " 分"
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV_7x81h0kn("input", {
                    type: "range",
                    min: "513",
                    max: "730",
                    value: scoreRange[0],
                    onChange: (e) => setScoreRange([+e.target.value, scoreRange[1]]),
                    style: { width: "100%", accentColor: "var(--primary)" }
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("input", {
                    type: "range",
                    min: "513",
                    max: "730",
                    value: scoreRange[1],
                    onChange: (e) => setScoreRange([scoreRange[0], +e.target.value]),
                    style: { width: "100%", accentColor: "var(--primary)" }
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn(FilterSection, {
                title: "一本率",
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 13, color: "var(--text-2)", marginBottom: 6 },
                    children: [
                      "≥ ",
                      bbenMin,
                      "%"
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV_7x81h0kn("input", {
                    type: "range",
                    min: "0",
                    max: "100",
                    value: bbenMin,
                    onChange: (e) => setBbenMin(+e.target.value),
                    style: { width: "100%", accentColor: "var(--primary)" }
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            children: [
              jsxDEV_7x81h0kn("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 14, color: "var(--text-3)" },
                    children: [
                      "共 ",
                      jsxDEV_7x81h0kn("strong", {
                        style: { color: "var(--text)" },
                        children: filtered.length
                      }, undefined, false, undefined, this),
                      " 所学校"
                    ]
                  }, undefined, true, undefined, this),
                  jsxDEV_7x81h0kn("select", {
                    value: sort,
                    onChange: (e) => setSort(e.target.value),
                    style: { width: 160, fontSize: 13, padding: "6px 10px" },
                    children: [
                      jsxDEV_7x81h0kn("option", {
                        value: "score_desc",
                        children: "按2025分数 ↓"
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("option", {
                        value: "bben_desc",
                        children: "按一本率 ↓"
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("option", {
                        value: "intake_desc",
                        children: "按招生人数 ↓"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this),
              loading ? jsxDEV_7x81h0kn(Loading, {}, undefined, false, undefined, this) : err ? jsxDEV_7x81h0kn(ErrorBox, {
                err,
                onRetry: () => location.reload()
              }, undefined, false, undefined, this) : filtered.length === 0 ? jsxDEV_7x81h0kn("div", {
                className: "card card-pad",
                style: { textAlign: "center", padding: "64px 24px" },
                children: [
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 48, marginBottom: 12 },
                    children: "\uD83D\uDD0E"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
                    children: "没有匹配的学校"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 13, color: "var(--text-3)" },
                    children: "试试调整筛选条件"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this) : jsxDEV_7x81h0kn("div", {
                style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 },
                children: filtered.map((s) => jsxDEV_7x81h0kn(SchoolCard, {
                  school: s,
                  onClick: () => onOpenSchool(s.id)
                }, s.id, false, undefined, this))
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.SchoolsPage = SchoolsPage;
