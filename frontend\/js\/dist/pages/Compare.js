import { jsxDEV as jsxDEV_7x81h0kn } from "react/jsx-dev-runtime";
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
  };
  const remove = (id) => setSelected(selected.filter((x) => x !== id));
  const bestIdx = (vals, higher = true) => {
    const nums = vals.map((v) => v == null || isNaN(v) ? null : v);
    const valid = nums.filter((v) => v != null);
    if (!valid.length)
      return -1;
    const target = higher ? Math.max(...valid) : Math.min(...valid);
    return nums.indexOf(target);
  };
  const worstIdx = (vals, higher = true) => bestIdx(vals, !higher);
  const Cell = ({ value, isBest, isWorst, mono, suffix }) => {
    const bg = isBest ? "rgba(5,150,105,0.10)" : isWorst ? "rgba(220,38,38,0.06)" : "transparent";
    const color = isBest ? "var(--success)" : "var(--text)";
    const weight = isBest ? 700 : 500;
    if (value == null)
      return /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
        style: { padding: "14px 16px", color: "var(--text-muted)", textAlign: "center", background: bg },
        children: "—"
      }, undefined, false, undefined, this);
    return /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
      style: { padding: "14px 16px", textAlign: "center", background: bg, color, fontWeight: weight, fontVariantNumeric: mono ? "tabular-nums" : "normal" },
      children: [
        value,
        suffix || ""
      ]
    }, undefined, true, undefined, this);
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
    return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
      children: [
        /* @__PURE__ */ jsxDEV_7x81h0kn("svg", {
          width: "60",
          height: "60",
          viewBox: "0 0 60 60",
          children: [
            /* @__PURE__ */ jsxDEV_7x81h0kn("polygon", {
              points: [0, 1, 2, 3, 4].map((i) => pt(i, 10).join(",")).join(" "),
              fill: "none",
              stroke: "#e5e7eb"
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV_7x81h0kn("polygon", {
              points: poly,
              fill: "rgba(26,86,219,0.2)",
              stroke: "#1a56db",
              strokeWidth: "1.5"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
          style: { fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 14 },
          children: score
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  };
  const selectedNames = selected.map((id) => {
    const s = allSchools.find((x) => x.id === id);
    return s ? s.name : id;
  });
  return /* @__PURE__ */ jsxDEV_7x81h0kn("main", {
    style: { maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" },
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { marginBottom: 24, display: "flex", alignItems: "baseline", justifyContent: "space-between" },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("a", {
                href: "#",
                onClick: (e) => {
                  e.preventDefault();
                  onNavigate && onNavigate("schools");
                },
                style: { fontSize: 13, color: "var(--text-3)", textDecoration: "none", marginBottom: 8, display: "inline-block" },
                children: "← 返回学校查询"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("h1", {
                style: { fontSize: 24, fontWeight: 600, margin: "0 0 4px" },
                children: "多校对比"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 13, color: "var(--text-3)" },
                children: [
                  "最多 5 所学校 · 已选 ",
                  /* @__PURE__ */ jsxDEV_7x81h0kn("strong", {
                    style: { color: "var(--text)" },
                    children: selected.length
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
            className: "btn btn-secondary",
            onClick: () => setSelected([]),
            children: "清空对比"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        className: "card",
        style: { padding: 16, marginBottom: 16 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: selected.length ? 12 : 0 },
            children: [
              selected.map((id, idx) => /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                className: "pill",
                style: { padding: "6px 6px 6px 14px", fontSize: 13, background: "var(--primary-50)", color: "var(--primary)", display: "inline-flex", alignItems: "center", gap: 4 },
                children: [
                  selectedNames[idx],
                  /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
                    onClick: () => remove(id),
                    style: { marginLeft: 4, background: "transparent", border: "none", cursor: "pointer", color: "var(--primary)", padding: "2px 6px", borderRadius: 4, lineHeight: 1, fontSize: 14 },
                    children: "✕"
                  }, undefined, false, undefined, this)
                ]
              }, id, true, undefined, this)),
              selected.length < 5 && /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                style: { fontSize: 13, color: "var(--text-3)" },
                children: selected.length === 0 ? "选择 2-5 所学校开始对比 →" : "还可添加 " + (5 - selected.length) + " 所"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          selected.length < 5 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { position: "relative" },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
                type: "search",
                placeholder: "搜索学校添加...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                style: { fontSize: 14 }
              }, undefined, false, undefined, this),
              search && candidates.length > 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                className: "card",
                style: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, padding: 4, zIndex: 10, maxHeight: 280, overflow: "auto", boxShadow: "var(--shadow-lg)" },
                children: candidates.slice(0, 8).map((c) => /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
                  onClick: () => add(c.id),
                  style: { width: "100%", textAlign: "left", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit" },
                  onMouseEnter: (e) => e.currentTarget.style.background = "var(--bg)",
                  onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
                  children: [
                    /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                      children: [
                        /* @__PURE__ */ jsxDEV_7x81h0kn("strong", {
                          children: c.name
                        }, undefined, false, undefined, this),
                        " ",
                        /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                          style: { color: "var(--text-3)", fontSize: 12, marginLeft: 6 },
                          children: [
                            c.district,
                            " · ",
                            c.kind
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    /* @__PURE__ */ jsxDEV_7x81h0kn(ScoreChip, {
                      score: c.score2025
                    }, undefined, false, undefined, this)
                  ]
                }, c.id, true, undefined, this))
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      selected.length < 2 ? /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        className: "card card-pad",
        style: { textAlign: "center", padding: "80px 24px" },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { fontSize: 48, marginBottom: 12 },
            children: "⚖️"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
            children: "至少选择 2 所学校开始对比"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { fontSize: 13, color: "var(--text-3)" },
            children: "建议选择同一分数段或不同梯度的学校进行对比"
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this) : loading ? /* @__PURE__ */ jsxDEV_7x81h0kn(Loading, {}, undefined, false, undefined, this) : /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        className: "card",
        style: { overflow: "auto" },
        children: /* @__PURE__ */ jsxDEV_7x81h0kn("table", {
          style: { width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 200 + schools.length * 200 },
          children: [
            /* @__PURE__ */ jsxDEV_7x81h0kn("thead", {
              children: /* @__PURE__ */ jsxDEV_7x81h0kn("tr", {
                style: { background: "var(--bg)" },
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("th", {
                    style: { padding: "20px 16px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.04em", position: "sticky", left: 0, background: "var(--bg)", zIndex: 2, minWidth: 200 },
                    children: "对比项"
                  }, undefined, false, undefined, this),
                  schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("th", {
                    style: { padding: "16px 16px", textAlign: "center", minWidth: 200, borderLeft: "1px solid var(--border)" },
                    children: [
                      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                        style: { fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 },
                        children: s.name
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                        style: { display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" },
                        children: /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                          className: `pill ${s.tier === "四校" || s.tier === "八大" ? "pill-blue" : s.tier === "市重点" ? "pill-teal" : "pill-gray"}`,
                          style: { fontSize: 10, padding: "2px 8px" },
                          children: s.kind
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this)
                    ]
                  }, s.id, true, undefined, this))
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV_7x81h0kn("tbody", {
              children: [
                /* @__PURE__ */ jsxDEV_7x81h0kn(SectionRow, {
                  label: "基本信息",
                  cols: schools.length + 1
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "区域",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 16px", textAlign: "center" },
                    children: s.district
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "学校类型",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 16px", textAlign: "center" },
                    children: /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                      className: `pill ${s.tier === "四校" || s.tier === "八大" ? "pill-blue" : s.tier === "市重点" ? "pill-teal" : "pill-gray"}`,
                      style: { fontSize: 11 },
                      children: s.kind
                    }, undefined, false, undefined, this)
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "办别",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 16px", textAlign: "center", color: "var(--text-2)" },
                    children: s.funding
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "招生人数",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.intake);
                    const best = bestIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: s.intake,
                      mono: true,
                      suffix: " 人",
                      isBest: i === best
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(SectionRow, {
                  label: "2025 录取",
                  cols: schools.length + 1
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "统招最低分",
                  sticky: true,
                  highlight: true,
                  children: (() => {
                    const vals = schools.map((s) => s.score2025);
                    const best = bestIdx(vals);
                    const worst = worstIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: fmtScore(s.score2025),
                      isBest: i === best,
                      isWorst: i === worst,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "名额到区(参考)",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.mingeDistrict);
                    const best = bestIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: fmtScore(s.mingeDistrict),
                      isBest: s.mingeDistrict && i === best,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "自招分",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.zizhao);
                    const best = bestIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: fmtScore(s.zizhao),
                      isBest: s.zizhao && i === best,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(SectionRow, {
                  label: "历年趋势",
                  cols: schools.length + 1
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "2023 统招",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                    value: fmtScore(s.score2023),
                    mono: true
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "2024 统招",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                    value: fmtScore(s.score2024),
                    mono: true
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "2025 统招",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                    value: fmtScore(s.score2025),
                    mono: true
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "三年变化",
                  sticky: true,
                  children: schools.map((s, i) => {
                    const t = trends[i];
                    const color = t > 0 ? "var(--success)" : t < 0 ? "var(--danger)" : "var(--text-3)";
                    return /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                      style: { padding: "12px 16px", textAlign: "center", color, fontWeight: 600, fontVariantNumeric: "tabular-nums" },
                      children: [
                        t > 0 ? "↑ +" : t < 0 ? "↓ " : "",
                        t.toFixed(1),
                        " 分"
                      ]
                    }, s.id, true, undefined, this);
                  })
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(SectionRow, {
                  label: "高考成绩",
                  cols: schools.length + 1
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "一本率",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.bbenRate);
                    const best = bestIdx(vals);
                    const worst = worstIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: s.bbenRate + "%",
                      isBest: i === best,
                      isWorst: i === worst,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "985 录取率",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.top985);
                    const best = bestIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: s.top985 + "%",
                      isBest: i === best,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "清北复交人数",
                  sticky: true,
                  children: (() => {
                    const vals = schools.map((s) => s.qbfd);
                    const best = bestIdx(vals);
                    return schools.map((s, i) => /* @__PURE__ */ jsxDEV_7x81h0kn(Cell, {
                      value: s.qbfd,
                      suffix: " 人",
                      isBest: i === best,
                      mono: true
                    }, s.id, false, undefined, this));
                  })()
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(SectionRow, {
                  label: "综合评分",
                  cols: schools.length + 1
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "评分 + 雷达",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 16px", textAlign: "center" },
                    children: /* @__PURE__ */ jsxDEV_7x81h0kn(MiniRadar, {
                      school: s
                    }, undefined, false, undefined, this)
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV_7x81h0kn(CmpRow, {
                  label: "详情链接",
                  sticky: true,
                  children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
                    style: { padding: "12px 16px", textAlign: "center" },
                    children: /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
                      className: "btn btn-ghost",
                      style: { fontSize: 12, padding: "4px 10px", color: "var(--primary)" },
                      onClick: () => onOpenSchool(s.id),
                      children: "查看详情 →"
                    }, undefined, false, undefined, this)
                  }, s.id, false, undefined, this))
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this)
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this),
      schools.length >= 2 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 },
        children: /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
          style: { fontSize: 12, color: "var(--text-3)", alignSelf: "center" },
          children: [
            /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
              style: { background: "rgba(5,150,105,0.10)", padding: "2px 6px", borderRadius: 4, color: "var(--success)", fontWeight: 600, marginRight: 4 },
              children: "绿色"
            }, undefined, false, undefined, this),
            "每行最佳 · ",
            /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
              style: { background: "rgba(220,38,38,0.06)", padding: "2px 6px", borderRadius: 4, marginRight: 4, marginLeft: 4 },
              children: "红色"
            }, undefined, false, undefined, this),
            "每行最低"
          ]
        }, undefined, true, undefined, this)
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function SectionRow({ label, cols }) {
  return /* @__PURE__ */ jsxDEV_7x81h0kn("tr", {
    children: /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
      colSpan: cols,
      style: { padding: "14px 16px", background: "#f3f4f6", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", position: "sticky", left: 0 },
      children: label
    }, undefined, false, undefined, this)
  }, undefined, false, undefined, this);
}
function CmpRow({ label, sticky, highlight, children }) {
  return /* @__PURE__ */ jsxDEV_7x81h0kn("tr", {
    style: { borderTop: "1px solid var(--border)", background: highlight ? "rgba(26,86,219,0.02)" : "transparent" },
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn("td", {
        style: { padding: "12px 16px", color: "var(--text-3)", fontSize: 13, fontWeight: 500, position: sticky ? "sticky" : "static", left: 0, background: highlight ? "#f0f5ff" : "#fff", borderRight: "1px solid var(--border)" },
        children: label
      }, undefined, false, undefined, this),
      children
    ]
  }, undefined, true, undefined, this);
}
window.ComparePage = ComparePage;
