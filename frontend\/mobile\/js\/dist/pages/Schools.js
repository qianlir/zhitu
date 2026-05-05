import { jsxDEV as jsxDEV_7x81h0kn } from "react/jsx-dev-runtime";
function MSchools({ onOpenSchool, onBack, initialQuery }) {
  const [q, setQ] = React.useState(initialQuery || "");
  const [tierFilter, setTierFilter] = React.useState("全部");
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
    if (tierFilter !== "全部") {
      if (tierFilter === "四校" && s.tier !== "四校")
        return false;
      if (tierFilter === "市重点" && !["市实验示范", "委属市重点"].includes(s.kind))
        return false;
      if (tierFilter === "区重点" && s.kind !== "区实验示范")
        return false;
    }
    return true;
  }).sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0));
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn(MNav, {
        title: "学校查询",
        subtitle: filtered.length + " 所",
        onBack
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        className: "mp",
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
            className: "mi",
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "\uD83D\uDD0D 搜索学校...",
            style: { marginBottom: 12 }
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 },
            children: ["全部", "四校", "市重点", "区重点"].map((t) => /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
              onClick: () => setTierFilter(t),
              style: { padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, border: "1px solid " + (tierFilter === t ? "var(--primary)" : "var(--border)"), background: tierFilter === t ? "var(--primary)" : "#fff", color: tierFilter === t ? "#fff" : "var(--text-2)", fontFamily: "inherit" },
              children: t
            }, t, false, undefined, this))
          }, undefined, false, undefined, this),
          loading ? /* @__PURE__ */ jsxDEV_7x81h0kn(MLoading, {}, undefined, false, undefined, this) : err ? /* @__PURE__ */ jsxDEV_7x81h0kn(MError, {
            err
          }, undefined, false, undefined, this) : filtered.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(MSchoolRow, {
            school: s,
            onClick: () => onOpenSchool(s.id)
          }, s.id, false, undefined, this)),
          !loading && !err && filtered.length === 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { textAlign: "center", padding: 48, color: "var(--text-3)" },
            children: "没有匹配学校"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.MSchools = MSchools;
