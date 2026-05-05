var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// frontend/mobile/js/pages/SchoolDetail.jsx
import { jsxDEV } from "react/jsx-dev-runtime";
var require_SchoolDetail = __commonJS(() => {
  function MSchoolDetail({ schoolId, onBack }) {
    const [school, setSchool] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [err, setErr] = React.useState(null);
    const [tab, setTab] = React.useState("info");
    const [showDqDetail, setShowDqDetail] = React.useState(false);
    React.useEffect(() => {
      setLoading(true);
      setErr(null);
      API.school(schoolId).then((s) => {
        setSchool(s);
        setLoading(false);
      }).catch((e) => {
        setErr(e);
        setLoading(false);
      });
    }, [schoolId]);
    if (loading)
      return /* @__PURE__ */ jsxDEV("div", {
        children: [
          /* @__PURE__ */ jsxDEV(MNav, {
            title: "加载中…",
            onBack
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV(MLoading, {}, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this);
    if (err)
      return /* @__PURE__ */ jsxDEV("div", {
        children: [
          /* @__PURE__ */ jsxDEV(MNav, {
            title: "出错了",
            onBack
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV(MError, {
            err
          }, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this);
    if (!school)
      return null;
    const tabs = [{ k: "info", l: "基本" }, { k: "scores", l: "分数线" }, { k: "gaokao", l: "高考" }];
    return /* @__PURE__ */ jsxDEV("div", {
      children: [
        /* @__PURE__ */ jsxDEV(MNav, {
          title: school.name,
          subtitle: school.district + " · " + school.kind,
          onBack
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV("div", {
          className: "mp",
          style: { paddingTop: 8 },
          children: [
            /* @__PURE__ */ jsxDEV("div", {
              className: "mc",
              style: { background: "linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))" },
              children: /* @__PURE__ */ jsxDEV("div", {
                style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, textAlign: "center" },
                children: [
                  /* @__PURE__ */ jsxDEV("div", {
                    children: [
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "2025统招"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 22, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums" },
                        children: fmtScore(school.score2025)
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV("div", {
                    children: [
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "一本率"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 22, fontWeight: 700, color: "var(--success)" },
                        children: [
                          school.bbenRate || "—",
                          "%"
                        ]
                      }, undefined, true, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV("div", {
                    children: [
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "招生"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV("div", {
                        style: { fontSize: 22, fontWeight: 700 },
                        children: [
                          school.intake || "—",
                          "人"
                        ]
                      }, undefined, true, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              style: { display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0" },
              children: [
                /* @__PURE__ */ jsxDEV("span", {
                  style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--bg)", color: "var(--text-2)", border: "1px solid var(--border)" },
                  children: school.district
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("span", {
                  style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--primary-50)", color: "var(--primary)" },
                  children: school.kind
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("span", {
                  style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--bg)", color: "var(--text-2)", border: "1px solid var(--border)" },
                  children: school.funding
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV("div", {
              style: { display: "flex", gap: 4, marginBottom: 16, background: "var(--bg)", borderRadius: 10, padding: 4 },
              children: tabs.map((t) => /* @__PURE__ */ jsxDEV("button", {
                onClick: () => setTab(t.k),
                style: { flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: tab === t.k ? 600 : 500, background: tab === t.k ? "#fff" : "transparent", color: tab === t.k ? "var(--primary)" : "var(--text-3)", cursor: "pointer", fontFamily: "inherit", boxShadow: tab === t.k ? "var(--shadow-sm)" : "none" },
                children: t.l
              }, t.k, false, undefined, this))
            }, undefined, false, undefined, this),
            tab === "info" && /* @__PURE__ */ jsxDEV("div", {
              children: [
                school.intro && /* @__PURE__ */ jsxDEV("div", {
                  className: "mc",
                  style: { marginBottom: 12 },
                  children: [
                    /* @__PURE__ */ jsxDEV("h3", {
                      style: { fontSize: 15, fontWeight: 600, margin: "0 0 8px" },
                      children: "学校简介"
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("p", {
                      style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, margin: 0 },
                      children: school.intro
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                school.tags && school.tags.length > 0 && /* @__PURE__ */ jsxDEV("div", {
                  style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 },
                  children: school.tags.map((t, i) => /* @__PURE__ */ jsxDEV("span", {
                    style: { padding: "5px 10px", borderRadius: 999, fontSize: 12, background: i === 0 ? "var(--primary-50)" : "var(--bg)", color: i === 0 ? "var(--primary)" : "var(--text-2)", border: "1px solid " + (i === 0 ? "var(--primary)" : "var(--border)") },
                    children: t
                  }, i, false, undefined, this))
                }, undefined, false, undefined, this),
                /* @__PURE__ */ jsxDEV("div", {
                  className: "mc",
                  children: [
                    ["学校类型", school.kind],
                    ["办别", school.funding],
                    ["区域", school.district + "区"],
                    ["校区地址", school.address || "—"],
                    ["联系电话", school.phone || "—"],
                    ["到校分(最低)", fmtScore(school.mingeSchool)],
                    ["自招分", fmtScore(school.zizhao)],
                    ["985率", (school.top985 || "—") + "%"],
                    ["清北复交", (school.qbfd || "—") + " 人"]
                  ].concat(school.website ? [["官方网站", school.website, true]] : []).map(([k, v, isLink]) => /* @__PURE__ */ jsxDEV("div", {
                    style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 14 },
                    children: [
                      /* @__PURE__ */ jsxDEV("span", {
                        style: { color: "var(--text-3)" },
                        children: k
                      }, undefined, false, undefined, this),
                      isLink ? /* @__PURE__ */ jsxDEV("a", {
                        href: v.startsWith("http") ? v : "https://" + v,
                        target: "_blank",
                        rel: "noopener",
                        style: { color: "var(--primary)", textDecoration: "none", fontSize: 13 },
                        children: [
                          v.replace(/^https?:\/\//, ""),
                          " ↗"
                        ]
                      }, undefined, true, undefined, this) : /* @__PURE__ */ jsxDEV("span", {
                        style: { fontWeight: 500 },
                        children: v
                      }, undefined, false, undefined, this)
                    ]
                  }, k, true, undefined, this))
                }, undefined, false, undefined, this),
                school.mingeDistrict && /* @__PURE__ */ jsxDEV("div", {
                  className: "mc",
                  style: { marginTop: 12 },
                  children: [
                    /* @__PURE__ */ jsxDEV("div", {
                      onClick: () => setShowDqDetail(!showDqDetail),
                      style: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
                      children: [
                        /* @__PURE__ */ jsxDEV("div", {
                          children: [
                            /* @__PURE__ */ jsxDEV("div", {
                              style: { fontSize: 14, fontWeight: 600 },
                              children: "名额到区分数线"
                            }, undefined, false, undefined, this),
                            /* @__PURE__ */ jsxDEV("div", {
                              style: { fontSize: 12, color: "var(--text-3)", marginTop: 2 },
                              children: "点击查看历年数据"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        /* @__PURE__ */ jsxDEV("span", {
                          style: { fontSize: 18, color: "var(--text-3)", transform: showDqDetail ? "rotate(180deg)" : "", transition: "transform 200ms" },
                          children: "▾"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    showDqDetail && /* @__PURE__ */ jsxDEV("div", {
                      style: { marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" },
                      children: [
                        (school.admissions || []).filter((a) => a.batch === "名额到区").sort((a, b) => b.year - a.year).map((a) => /* @__PURE__ */ jsxDEV("div", {
                          style: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 14 },
                          children: [
                            /* @__PURE__ */ jsxDEV("span", {
                              style: { color: "var(--text-3)" },
                              children: [
                                a.year,
                                "年"
                              ]
                            }, undefined, true, undefined, this),
                            /* @__PURE__ */ jsxDEV("div", {
                              style: { textAlign: "right" },
                              children: [
                                /* @__PURE__ */ jsxDEV("span", {
                                  style: { fontWeight: 600, color: "#d97706" },
                                  children: fmtScore(a.min_score)
                                }, undefined, false, undefined, this),
                                /* @__PURE__ */ jsxDEV("span", {
                                  style: { fontSize: 11, color: "var(--text-3)", marginLeft: 8 },
                                  children: [
                                    "(",
                                    a.quota,
                                    "人)"
                                  ]
                                }, undefined, true, undefined, this)
                              ]
                            }, undefined, true, undefined, this)
                          ]
                        }, a.year + a.batch, true, undefined, this)),
                        /* @__PURE__ */ jsxDEV("div", {
                          style: { fontSize: 11, color: "var(--text-3)", marginTop: 8, padding: "8px 10px", background: "var(--bg)", borderRadius: 6, lineHeight: 1.6 },
                          children: "说明：以上为该校名额到区的整体最低录取分。各区实际分数线不同，暂未获取到分区数据。待官方数据补充后将自动显示各区详细分数线。"
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            tab === "scores" && /* @__PURE__ */ jsxDEV("div", {
              className: "mc",
              children: [
                /* @__PURE__ */ jsxDEV("h3", {
                  style: { fontSize: 15, fontWeight: 600, margin: "0 0 12px" },
                  children: "近年统招分数线"
                }, undefined, false, undefined, this),
                (school.scoreHistory || [
                  { year: 2023, score: school.score2023 },
                  { year: 2024, score: school.score2024 },
                  { year: 2025, score: school.score2025 }
                ].filter((s) => s.score)).map(({ year, score: s }) => /* @__PURE__ */ jsxDEV("div", {
                  style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" },
                  children: [
                    /* @__PURE__ */ jsxDEV("span", {
                      style: { fontSize: 14, fontWeight: 500 },
                      children: year
                    }, undefined, false, undefined, this),
                    /* @__PURE__ */ jsxDEV("div", {
                      style: { display: "flex", alignItems: "center", gap: 12 },
                      children: [
                        /* @__PURE__ */ jsxDEV("div", {
                          style: { width: 100, height: 6, background: "var(--bg)", borderRadius: 999, overflow: "hidden" },
                          children: /* @__PURE__ */ jsxDEV("div", {
                            style: { width: (s - 600) / 120 * 100 + "%", height: "100%", background: "var(--primary)", borderRadius: 999 }
                          }, undefined, false, undefined, this)
                        }, undefined, false, undefined, this),
                        /* @__PURE__ */ jsxDEV("span", {
                          style: { fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 15 },
                          children: fmtScore(s)
                        }, undefined, false, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, year, true, undefined, this))
              ]
            }, undefined, true, undefined, this),
            tab === "gaokao" && /* @__PURE__ */ jsxDEV("div", {
              style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
              children: [
                { l: "一本率", v: (school.bbenRate || "—") + "%", c: "var(--success)" },
                { l: "985率", v: (school.top985 || "—") + "%", c: "var(--primary)" },
                { l: "清北复交", v: (school.qbfd || "—") + " 人", c: "var(--accent)" },
                { l: "招生计划", v: (school.intake || "—") + " 人", c: "var(--secondary)" }
              ].map((m) => /* @__PURE__ */ jsxDEV("div", {
                className: "mc",
                style: { textAlign: "center" },
                children: [
                  /* @__PURE__ */ jsxDEV("div", {
                    style: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 },
                    children: m.l
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV("div", {
                    style: { fontSize: 24, fontWeight: 700, color: m.c },
                    children: m.v
                  }, undefined, false, undefined, this)
                ]
              }, m.l, true, undefined, this))
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this);
  }
  window.MSchoolDetail = MSchoolDetail;
});
export default require_SchoolDetail();
