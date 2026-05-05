function PlanResult({ score, district, tdPick, setTdPick, tsPicks, setTsPicks, pPicks, setPPicks, tdList, tsList, pList, onOpenSchool, onBack, allSchools }) {
  const getS = (id) => allSchools.find((s) => s.id === id);
  const riskTag = (refScore) => {
    const d = refScore - score;
    if (d > 5)
      return { t: "冲刺", c: "#dc2626", bg: "#fef2f2" };
    if (d > -3)
      return { t: "匹配", c: "var(--primary)", bg: "var(--primary-50)" };
    return { t: "保底", c: "var(--success)", bg: "rgba(5,150,105,0.08)" };
  };
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  const [addingTo, setAddingTo] = React.useState(null);
  const [searchQ, setSearchQ] = React.useState("");
  const searchRef = React.useRef(null);
  React.useEffect(() => {
    if (addingTo && searchRef.current)
      searchRef.current.focus();
  }, [addingTo]);
  const usedIds = new Set([tdPick, ...tsPicks, ...pPicks].filter(Boolean));
  const getPool = () => {
    if (addingTo === "dq")
      return tdList;
    if (addingTo === "dx")
      return tsList;
    if (addingTo === "px")
      return pList;
    return [];
  };
  const filtered = getPool().filter((s) => !usedIds.has(s.id)).filter((s) => !searchQ || s.name.includes(searchQ) || s.shortName && s.shortName.includes(searchQ) || s.district.includes(searchQ));
  const addSchool = (id) => {
    if (addingTo === "dq") {
      setTdPick(id);
      setAddingTo(null);
    } else if (addingTo === "dx" && tsPicks.length < 2) {
      setTsPicks([...tsPicks, id]);
      if (tsPicks.length >= 1)
        setAddingTo(null);
    } else if (addingTo === "px" && pPicks.length < 15) {
      setPPicks([...pPicks, id]);
    }
    setSearchQ("");
  };
  const SchoolRow = ({ id, i, refScoreKey, onRemove }) => {
    const s = getS(id);
    if (!s)
      return null;
    const refScore = refScoreKey === "dq" ? s.mingeDistrict || s.score2025 : refScoreKey === "dx" ? s.mingeSchool || s.score2025 : s.score2025;
    const r = riskTag(refScore);
    const diff = refScore - score;
    return jsxDEV_7x81h0kn("div", {
      style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, background: "#fff", border: "1px solid var(--border)", borderLeft: `3px solid ${r.c}` },
      children: [
        jsxDEV_7x81h0kn("span", {
          style: { fontSize: 13, fontWeight: 700, color: "var(--text-3)", width: 24 },
          children: i + 1
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("div", {
          style: { flex: 1 },
          children: [
            jsxDEV_7x81h0kn("a", {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                onOpenSchool(s.id);
              },
              style: { fontWeight: 600, fontSize: 14, color: "var(--text)", textDecoration: "none" },
              children: s.name
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 },
              children: [
                s.district,
                "区 · ",
                s.kind
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this),
        jsxDEV_7x81h0kn("span", {
          style: { fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: "2px 8px", borderRadius: 4 },
          children: r.t
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("span", {
          style: { fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600 },
          children: fmtScore(refScore)
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("span", {
          style: { fontSize: 12, color: diff >= 0 ? "#dc2626" : "var(--success)", fontVariantNumeric: "tabular-nums" },
          children: [
            diff >= 0 ? "+" : "",
            diff.toFixed(1)
          ]
        }, undefined, true, undefined, this),
        jsxDEV_7x81h0kn("button", {
          onClick: () => onRemove(id),
          style: { background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: 12, padding: "4px 8px" },
          children: "✕"
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const AddButton = ({ batchKey, maxPicks, currentCount }) => {
    if (currentCount >= maxPicks)
      return null;
    return jsxDEV_7x81h0kn("button", {
      onClick: () => {
        setAddingTo(batchKey);
        setSearchQ("");
      },
      style: { width: "100%", padding: "12px 16px", borderRadius: 8, border: "2px dashed var(--border)", background: "transparent", cursor: "pointer", fontSize: 13, color: "var(--primary)", fontFamily: "inherit", fontWeight: 500, marginTop: 8 },
      children: "+ 手动添加学校"
    }, undefined, false, undefined, this);
  };
  const SearchDropdown = () => {
    if (!addingTo)
      return null;
    const batchLabel = addingTo === "dq" ? "名额到区" : addingTo === "dx" ? "名额到校" : "平行志愿";
    return jsxDEV_7x81h0kn("div", {
      style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
      onClick: (e) => {
        if (e.target === e.currentTarget)
          setAddingTo(null);
      },
      children: jsxDEV_7x81h0kn("div", {
        style: { width: 520, maxHeight: "70vh", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
            children: [
              jsxDEV_7x81h0kn("h3", {
                style: { margin: 0, fontSize: 16, fontWeight: 600 },
                children: [
                  "添加",
                  batchLabel,
                  "学校"
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("button", {
                onClick: () => setAddingTo(null),
                style: { background: "transparent", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text-3)" },
                children: "✕"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { padding: "12px 20px", borderBottom: "1px solid var(--border)" },
            children: jsxDEV_7x81h0kn("input", {
              ref: searchRef,
              value: searchQ,
              onChange: (e) => setSearchQ(e.target.value),
              placeholder: "搜索学校名称...",
              style: { width: "100%", fontSize: 14, padding: "10px 14px", borderRadius: 8 }
            }, undefined, false, undefined, this)
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { maxHeight: "50vh", overflowY: "auto", padding: "8px 12px" },
            children: [
              filtered.length === 0 && jsxDEV_7x81h0kn("div", {
                style: { padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 },
                children: "无匹配学校"
              }, undefined, false, undefined, this),
              filtered.map((s) => {
                const refScore = addingTo === "dq" ? s.mingeDistrict || s.score2025 : addingTo === "dx" ? s.mingeSchool || s.score2025 : s.score2025;
                const diff = refScore - score;
                const r = riskTag(refScore);
                return jsxDEV_7x81h0kn("div", {
                  onClick: () => addSchool(s.id),
                  style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, cursor: "pointer", borderBottom: "1px solid var(--border)", transition: "background 100ms" },
                  onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg)",
                  onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { flex: 1 },
                      children: [
                        jsxDEV_7x81h0kn("div", {
                          style: { fontWeight: 600, fontSize: 14 },
                          children: s.name
                        }, undefined, false, undefined, this),
                        jsxDEV_7x81h0kn("div", {
                          style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 },
                          children: [
                            s.district,
                            "区 · ",
                            s.kind
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    jsxDEV_7x81h0kn("span", {
                      style: { fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: "2px 8px", borderRadius: 4 },
                      children: r.t
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("span", {
                      style: { fontSize: 13, fontVariantNumeric: "tabular-nums", fontWeight: 600 },
                      children: fmtScore(refScore)
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("span", {
                      style: { fontSize: 12, color: diff >= 0 ? "#dc2626" : "var(--success)", fontVariantNumeric: "tabular-nums" },
                      children: [
                        diff >= 0 ? "+" : "",
                        diff.toFixed(1)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, s.id, true, undefined, this);
              })
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    }, undefined, false, undefined, this);
  };
  return jsxDEV_7x81h0kn("div", {
    children: [
      jsxDEV_7x81h0kn("div", {
        className: "card",
        style: { padding: 24, marginBottom: 24, background: "linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))", borderLeft: "3px solid var(--primary)" },
        children: jsxDEV_7x81h0kn("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 },
          children: [
            jsxDEV_7x81h0kn("div", {
              children: [
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" },
                  children: "志愿方案"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 24, fontWeight: 700, marginTop: 4 },
                  children: [
                    jsxDEV_7x81h0kn("span", {
                      style: { color: "var(--primary)" },
                      children: score
                    }, undefined, false, undefined, this),
                    " 分 · ",
                    district,
                    "区 · ",
                    jsxDEV_7x81h0kn("span", {
                      className: "score-chip " + tierClass(score),
                      style: { fontSize: 13 },
                      children: tierLabel(score)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { display: "flex", gap: 20, textAlign: "center" },
              children: [
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 24, fontWeight: 700, color: "var(--primary)" },
                      children: tdPick ? 1 : 0
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "到区"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 24, fontWeight: 700, color: "var(--secondary)" },
                      children: tsPicks.length
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "到校"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 24, fontWeight: 700, color: "var(--accent)" },
                      children: pPicks.length
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "平行"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 24, fontWeight: 700 },
                      children: totalPicked
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "总计"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      pPicks.length < 15 && jsxDEV_7x81h0kn("div", {
        style: { padding: 12, background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 8, fontSize: 13, color: "#92400e", marginBottom: 20 },
        children: [
          "平行志愿仅填了 ",
          pPicks.length,
          " 个，建议填满 15 个以降低滑档风险！"
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { marginBottom: 28 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
            children: [
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 20 },
                children: "\uD83C\uDFDB️"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("h3", {
                style: { fontSize: 16, fontWeight: 600, margin: 0 },
                children: "名额到区"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 13, color: "var(--primary)", fontWeight: 600 },
                children: [
                  tdPick ? 1 : 0,
                  "/1"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gap: 8 },
            children: [
              tdPick && jsxDEV_7x81h0kn(SchoolRow, {
                id: tdPick,
                i: 0,
                refScoreKey: "dq",
                onRemove: () => setTdPick(null)
              }, undefined, false, undefined, this),
              !tdPick && jsxDEV_7x81h0kn("div", {
                style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" },
                children: "未选择"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn(AddButton, {
            batchKey: "dq",
            maxPicks: 1,
            currentCount: tdPick ? 1 : 0
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { marginBottom: 28 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
            children: [
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 20 },
                children: "\uD83C\uDFEB"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("h3", {
                style: { fontSize: 16, fontWeight: 600, margin: 0 },
                children: "名额到校"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 13, color: "var(--secondary)", fontWeight: 600 },
                children: [
                  tsPicks.length,
                  "/2"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gap: 8 },
            children: [
              tsPicks.map((id, i) => jsxDEV_7x81h0kn(SchoolRow, {
                id,
                i,
                refScoreKey: "dx",
                onRemove: (rid) => setTsPicks(tsPicks.filter((x) => x !== rid))
              }, id, false, undefined, this)),
              tsPicks.length === 0 && jsxDEV_7x81h0kn("div", {
                style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" },
                children: "未选择"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn(AddButton, {
            batchKey: "dx",
            maxPicks: 2,
            currentCount: tsPicks.length
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { marginBottom: 28 },
        children: [
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
            children: [
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 20 },
                children: "\uD83D\uDCCB"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("h3", {
                style: { fontSize: 16, fontWeight: 600, margin: 0 },
                children: "统招平行志愿"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("span", {
                style: { fontSize: 13, color: "var(--accent)", fontWeight: 600 },
                children: [
                  pPicks.length,
                  "/15"
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gap: 8 },
            children: [
              pPicks.map((id, i) => jsxDEV_7x81h0kn(SchoolRow, {
                id,
                i,
                refScoreKey: "px",
                onRemove: (rid) => setPPicks(pPicks.filter((x) => x !== rid))
              }, id, false, undefined, this)),
              pPicks.length === 0 && jsxDEV_7x81h0kn("div", {
                style: { padding: 16, background: "var(--bg)", borderRadius: 8, color: "var(--text-muted)", fontSize: 13, textAlign: "center" },
                children: "未选择"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn(AddButton, {
            batchKey: "px",
            maxPicks: 15,
            currentCount: pPicks.length
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        style: { background: "var(--bg)", marginBottom: 24 },
        children: [
          jsxDEV_7x81h0kn("h4", {
            style: { margin: "0 0 8px", fontSize: 14, fontWeight: 600 },
            children: "填报建议"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("ul", {
            style: { margin: 0, paddingLeft: 18, color: "var(--text-2)", fontSize: 13, lineHeight: 1.9 },
            children: [
              jsxDEV_7x81h0kn("li", {
                children: [
                  jsxDEV_7x81h0kn("strong", {
                    children: "到区志愿"
                  }, undefined, false, undefined, this),
                  "可适当冲高 — 即使不录取，不影响后续批次"
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("li", {
                children: [
                  jsxDEV_7x81h0kn("strong", {
                    children: "到校志愿"
                  }, undefined, false, undefined, this),
                  "建议一冲一稳 — 校内竞争比全区温和"
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("li", {
                children: [
                  jsxDEV_7x81h0kn("strong", {
                    children: "平行志愿"
                  }, undefined, false, undefined, this),
                  '按"冲4稳6保5"排列 — 第15个务必填绝对保底'
                ]
              }, undefined, true, undefined, this),
              jsxDEV_7x81h0kn("li", {
                children: "同分排序看：同分优待 → 语数英合计 → 数学 → 语文 → 综合测试"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", gap: 12, justifyContent: "space-between" },
        children: jsxDEV_7x81h0kn("button", {
          className: "btn btn-secondary",
          onClick: onBack,
          children: "← 返回 AI 对话调整"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn(SearchDropdown, {}, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.PlanResult = PlanResult;
