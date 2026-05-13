function PlanResult({ score, district, tdPick, setTdPick, tsPicks, setTsPicks, pPicks, setPPicks, tdList, tsList, pList, onOpenSchool, onBack, allSchools }) {
  const getS = (id) => allSchools.find((s) => s.id === id);
  const riskTag = (refScore) => {
    const d = refScore - score;
    if (d > 5) return { t: "\u51B2\u523A", c: "#dc2626", bg: "#fef2f2" };
    if (d > -3) return { t: "\u5339\u914D", c: "var(--primary)", bg: "var(--primary-50)" };
    return { t: "\u4FDD\u5E95", c: "var(--success)", bg: "rgba(5,150,105,0.08)" };
  };
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  const [addingTo, setAddingTo] = React.useState(null);
  const [searchQ, setSearchQ] = React.useState("");
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    if (addingTo && searchRef.current) searchRef.current.focus();
  }, [addingTo]);
  const getUsedIds = () => {
    if (addingTo === "dq") return new Set([tdPick].filter(Boolean));
    if (addingTo === "dx") return new Set(tsPicks);
    if (addingTo === "px") return new Set(pPicks);
    return new Set();
  };
  const getPool = () => {
    if (addingTo === "dq") return tdList;
    if (addingTo === "dx") return tsList;
    if (addingTo === "px") return pList;
    return [];
  };
  const filtered = getPool().filter((s) => !getUsedIds().has(s.id)).filter((s) => !searchQ || s.name.includes(searchQ) || s.shortName && s.shortName.includes(searchQ) || s.district.includes(searchQ));
  const addSchool = (id) => {
    if (addingTo === "dq") {
      setTdPick(id);
      setAddingTo(null);
    } else if (addingTo === "dx" && tsPicks.length < 2) {
      setTsPicks([...tsPicks, id]);
      if (tsPicks.length >= 1) setAddingTo(null);
    } else if (addingTo === "px" && pPicks.length < 15) {
      setPPicks([...pPicks, id]);
    }
    setSearchQ("");
  };
  const SchoolRow = ({ id, i, refScoreKey, onRemove }) => {
    const s = getS(id);
    if (!s) return null;
    const refScore = refScoreKey === "dq" ? s.mingeDistrict || s.score2025 : refScoreKey === "dx" ? s.mingeSchool || s.score2025 : s.score2025;
    const r = riskTag(refScore);
    const diff = refScore - score;
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, background: "#fff", border: "1px solid var(--border)", borderLeft: `3px solid ${r.c}` } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-3)", width: 24 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
      e.preventDefault();
      onOpenSchool(s.id);
    }, style: { fontWeight: 600, fontSize: 14, color: "var(--text)", textDecoration: "none" } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, s.district, "\u533A \xB7 ", s.kind)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: "2px 8px", borderRadius: 4 } }, r.t), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600 } }, fmtScore(refScore)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: diff >= 0 ? "#dc2626" : "var(--success)", fontVariantNumeric: "tabular-nums" } }, diff >= 0 ? "+" : "", diff.toFixed(1)), /* @__PURE__ */ React.createElement("button", { onClick: () => onRemove(id), style: { background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 12, padding: "4px 8px" } }, "\u2715"));
  };
  const AddButton = ({ batchKey, maxPicks, currentCount }) => {
    if (currentCount >= maxPicks) return null;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setAddingTo(batchKey);
          setSearchQ("");
        },
        style: { width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px dashed var(--border)", background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--primary)", fontFamily: "inherit", fontWeight: 500, marginTop: 8 }
      },
      "+ \u624B\u52A8\u6DFB\u52A0\u5B66\u6821"
    );
  };
  const SearchDropdown = () => {
    if (!addingTo) return null;
    const batchLabel = addingTo === "dq" ? "\u540D\u989D\u5230\u533A" : addingTo === "dx" ? "\u540D\u989D\u5230\u6821" : "\u5E73\u884C\u5FD7\u613F";
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
        onClick: (e) => {
          if (e.target === e.currentTarget) setAddingTo(null);
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { width: 520, maxHeight: "70vh", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 16, fontWeight: 600 } }, "\u6DFB\u52A0", batchLabel, "\u5B66\u6821"), /* @__PURE__ */ React.createElement("button", { onClick: () => setAddingTo(null), style: { background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-3)" } }, "\u2715")), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 20px", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement(
        "input",
        {
          ref: searchRef,
          value: searchQ,
          onChange: (e) => setSearchQ(e.target.value),
          placeholder: "\u641C\u7D22\u5B66\u6821\u540D\u79F0...",
          style: { width: "100%", fontSize: 14, padding: "10px 14px", borderRadius: 8 }
        }
      )), /* @__PURE__ */ React.createElement("div", { style: { maxHeight: "50vh", overflowY: "auto", padding: "8px 12px" } }, filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 } }, "\u65E0\u5339\u914D\u5B66\u6821"), filtered.map((s) => {
        const refScore = addingTo === "dq" ? s.mingeDistrict || s.score2025 : addingTo === "dx" ? s.mingeSchool || s.score2025 : s.score2025;
        const diff = refScore - score;
        const r = riskTag(refScore);
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            key: s.id,
            onClick: () => addSchool(s.id),
            style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, cursor: "pointer", borderBottom: "1px solid var(--border)", transition: "background 100ms" },
            onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg)",
            onMouseLeave: (e) => e.currentTarget.style.background = "transparent"
          },
          /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 } }, s.district, "\u533A \xB7 ", s.kind)),
          /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: "2px 8px", borderRadius: 4 } }, r.t),
          /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600 } }, fmtScore(refScore)),
          /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: diff >= 0 ? "#dc2626" : "var(--success)", fontVariantNumeric: "tabular-nums" } }, diff >= 0 ? "+" : "", diff.toFixed(1))
        );
      })))
    );
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: 24, marginBottom: 24, background: "linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))", borderLeft: "3px solid var(--primary)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" } }, "\u5FD7\u613F\u65B9\u6848"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700, marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--primary)" } }, score), " \u5206 \xB7 ", district, "\u533A \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "score-chip " + tierClass(score), style: { fontSize: 13 } }, tierLabel(score)))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: "var(--primary)" } }, tdPick ? 1 : 0), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5230\u533A")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: "var(--secondary)" } }, tsPicks.length), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5230\u6821")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700, color: "var(--accent)" } }, pPicks.length), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5E73\u884C")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 24, fontWeight: 700 } }, totalPicked), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u603B\u8BA1"))))), pPicks.length < 15 && /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 8, fontSize: 13, color: "#92400e", marginBottom: 20 } }, "\u5E73\u884C\u5FD7\u613F\u4EC5\u586B\u4E86 ", pPicks.length, " \u4E2A\uFF0C\u5EFA\u8BAE\u586B\u6EE1 15 \u4E2A\u4EE5\u964D\u4F4E\u6ED1\u6863\u98CE\u9669\uFF01"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F3DB}\uFE0F"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: 0 } }, "\u540D\u989D\u5230\u533A"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--primary)", fontWeight: 600 } }, tdPick ? 1 : 0, "/1")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, tdPick && /* @__PURE__ */ React.createElement(SchoolRow, { id: tdPick, i: 0, refScoreKey: "dq", onRemove: () => setTdPick(null) }), !tdPick && /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" } }, "\u672A\u9009\u62E9")), /* @__PURE__ */ React.createElement(AddButton, { batchKey: "dq", maxPicks: 1, currentCount: tdPick ? 1 : 0 })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F3EB}"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: 0 } }, "\u540D\u989D\u5230\u6821"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--secondary)", fontWeight: 600 } }, tsPicks.length, "/2")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, tsPicks.map((id, i) => /* @__PURE__ */ React.createElement(SchoolRow, { key: id, id, i, refScoreKey: "dx", onRemove: (rid) => setTsPicks(tsPicks.filter((x) => x !== rid)) })), tsPicks.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" } }, "\u672A\u9009\u62E9")), /* @__PURE__ */ React.createElement(AddButton, { batchKey: "dx", maxPicks: 2, currentCount: tsPicks.length })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u{1F4CB}"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: 0 } }, "\u7EDF\u62DB\u5E73\u884C\u5FD7\u613F"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--accent)", fontWeight: 600 } }, pPicks.length, "/15")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gap: 8 } }, pPicks.map((id, i) => /* @__PURE__ */ React.createElement(SchoolRow, { key: id, id, i, refScoreKey: "px", onRemove: (rid) => setPPicks(pPicks.filter((x) => x !== rid)) })), pPicks.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" } }, "\u672A\u9009\u62E9")), /* @__PURE__ */ React.createElement(AddButton, { batchKey: "px", maxPicks: 15, currentCount: pPicks.length })), /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { background: "var(--bg)", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 8px", fontSize: 14, fontWeight: 600 } }, "\u586B\u62A5\u5EFA\u8BAE"), /* @__PURE__ */ React.createElement("ul", { style: { margin: 0, paddingLeft: 18, color: "var(--text-2)", fontSize: 13, lineHeight: 1.9 } }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\u5230\u533A\u5FD7\u613F"), "\u53EF\u9002\u5F53\u51B2\u9AD8 \u2014 \u5373\u4F7F\u4E0D\u5F55\u53D6\uFF0C\u4E0D\u5F71\u54CD\u540E\u7EED\u6279\u6B21"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\u5230\u6821\u5FD7\u613F"), "\u5EFA\u8BAE\u4E00\u51B2\u4E00\u7A33 \u2014 \u6821\u5185\u7ADE\u4E89\u6BD4\u5168\u533A\u6E29\u548C"), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("strong", null, "\u5E73\u884C\u5FD7\u613F"), '\u6309"\u51B24\u7A336\u4FDD5"\u6392\u5217 \u2014 \u7B2C15\u4E2A\u52A1\u5FC5\u586B\u7EDD\u5BF9\u4FDD\u5E95'), /* @__PURE__ */ React.createElement("li", null, "\u540C\u5206\u6392\u5E8F\u770B\uFF1A\u540C\u5206\u4F18\u5F85 \u2192 \u8BED\u6570\u82F1\u5408\u8BA1 \u2192 \u6570\u5B66 \u2192 \u8BED\u6587 \u2192 \u7EFC\u5408\u6D4B\u8BD5"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: onBack }, "\u2190 \u8FD4\u56DE AI \u5BF9\u8BDD\u8C03\u6574")), /* @__PURE__ */ React.createElement(SearchDropdown, null));
}
window.PlanResult = PlanResult;
