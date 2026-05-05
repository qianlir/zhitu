function MSchoolDetail({ schoolId, onBack }) {
  const [school, setSchool] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [tab, setTab] = React.useState("info");
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
    return jsxDEV_7x81h0kn("div", {
      children: [
        jsxDEV_7x81h0kn(MNav, {
          title: "加载中…",
          onBack
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn(MLoading, {}, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  if (err)
    return jsxDEV_7x81h0kn("div", {
      children: [
        jsxDEV_7x81h0kn(MNav, {
          title: "出错了",
          onBack
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn(MError, {
          err
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  if (!school)
    return null;
  const tabs = [{ k: "info", l: "基本" }, { k: "scores", l: "分数线" }, { k: "gaokao", l: "高考" }];
  return jsxDEV_7x81h0kn("div", {
    children: [
      jsxDEV_7x81h0kn(MNav, {
        title: school.name,
        subtitle: school.district + " · " + school.kind,
        onBack
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "mp",
        style: { paddingTop: 8 },
        children: [
          jsxDEV_7x81h0kn("div", {
            className: "mc",
            style: { background: "linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))" },
            children: jsxDEV_7x81h0kn("div", {
              style: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, textAlign: "center" },
              children: [
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "2025统招"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 22, fontWeight: 700, color: "var(--primary)", fontVariantNumeric: "tabular-nums" },
                      children: fmtScore(school.score2025)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "一本率"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 22, fontWeight: 700, color: "var(--success)" },
                      children: [
                        school.bbenRate || "—",
                        "%"
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "招生"
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
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
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0" },
            children: [
              jsxDEV_7x81h0kn("span", {
                style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--bg)", color: "var(--text-2)", border: "1px solid var(--border)" },
                children: school.district
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("span", {
                style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--primary-50)", color: "var(--primary)" },
                children: school.kind
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("span", {
                style: { padding: "6px 12px", borderRadius: 999, fontSize: 13, background: "var(--bg)", color: "var(--text-2)", border: "1px solid var(--border)" },
                children: school.funding
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 4, marginBottom: 16, background: "var(--bg)", borderRadius: 10, padding: 4 },
            children: tabs.map((t) => jsxDEV_7x81h0kn("button", {
              onClick: () => setTab(t.k),
              style: { flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", fontSize: 14, fontWeight: tab === t.k ? 600 : 500, background: tab === t.k ? "#fff" : "transparent", color: tab === t.k ? "var(--primary)" : "var(--text-3)", cursor: "pointer", fontFamily: "inherit", boxShadow: tab === t.k ? "var(--shadow-sm)" : "none" },
              children: t.l
            }, t.k, false, undefined, this))
          }, undefined, false, undefined, this),
          tab === "info" && jsxDEV_7x81h0kn("div", {
            children: [
              school.intro && jsxDEV_7x81h0kn("div", {
                className: "mc",
                style: { marginBottom: 12 },
                children: [
                  jsxDEV_7x81h0kn("h3", {
                    style: { fontSize: 15, fontWeight: 600, margin: "0 0 8px" },
                    children: "学校简介"
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("p", {
                    style: { fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, margin: 0 },
                    children: school.intro
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              school.tags && school.tags.length > 0 && jsxDEV_7x81h0kn("div", {
                style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 },
                children: school.tags.map((t, i) => jsxDEV_7x81h0kn("span", {
                  style: { padding: "5px 10px", borderRadius: 999, fontSize: 12, background: i === 0 ? "var(--primary-50)" : "var(--bg)", color: i === 0 ? "var(--primary)" : "var(--text-2)", border: "1px solid " + (i === 0 ? "var(--primary)" : "var(--border)") },
                  children: t
                }, i, false, undefined, this))
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("div", {
                className: "mc",
                children: [
                  ["学校类型", school.kind],
                  ["办别", school.funding],
                  ["区域", school.district + "区"],
                  ["校区地址", school.address || "—"],
                  ["联系电话", school.phone || "—"],
                  ["到区分(参考)", school.mingeDistrict ? fmtScore(school.mingeDistrict) + " ⚠️各区不同" : "—"],
                  ["到校分(参考)", fmtScore(school.mingeSchool)],
                  ["自招分", fmtScore(school.zizhao)],
                  ["985率", (school.top985 || "—") + "%"],
                  ["清北复交", (school.qbfd || "—") + " 人"]
                ].concat(school.website ? [["官方网站", school.website, true]] : []).map(([k, v, isLink]) => jsxDEV_7x81h0kn("div", {
                  style: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 14 },
                  children: [
                    jsxDEV_7x81h0kn("span", {
                      style: { color: "var(--text-3)" },
                      children: k
                    }, undefined, false, undefined, this),
                    isLink ? jsxDEV_7x81h0kn("a", {
                      href: v.startsWith("http") ? v : "https://" + v,
                      target: "_blank",
                      rel: "noopener",
                      style: { color: "var(--primary)", textDecoration: "none", fontSize: 13 },
                      children: [
                        v.replace(/^https?:\/\//, ""),
                        " ↗"
                      ]
                    }, undefined, true, undefined, this) : jsxDEV_7x81h0kn("span", {
                      style: { fontWeight: 500 },
                      children: v
                    }, undefined, false, undefined, this)
                  ]
                }, k, true, undefined, this))
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          tab === "scores" && jsxDEV_7x81h0kn("div", {
            className: "mc",
            children: [
              jsxDEV_7x81h0kn("h3", {
                style: { fontSize: 15, fontWeight: 600, margin: "0 0 12px" },
                children: "近年统招分数线"
              }, undefined, false, undefined, this),
              (school.scoreHistory || [
                { year: 2023, score: school.score2023 },
                { year: 2024, score: school.score2024 },
                { year: 2025, score: school.score2025 }
              ].filter((s) => s.score)).map(({ year, score: s }) => jsxDEV_7x81h0kn("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" },
                children: [
                  jsxDEV_7x81h0kn("span", {
                    style: { fontSize: 14, fontWeight: 500 },
                    children: year
                  }, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("div", {
                    style: { display: "flex", alignItems: "center", gap: 12 },
                    children: [
                      jsxDEV_7x81h0kn("div", {
                        style: { width: 100, height: 6, background: "var(--bg)", borderRadius: 999, overflow: "hidden" },
                        children: jsxDEV_7x81h0kn("div", {
                          style: { width: (s - 600) / 120 * 100 + "%", height: "100%", background: "var(--primary)", borderRadius: 999 }
                        }, undefined, false, undefined, this)
                      }, undefined, false, undefined, this),
                      jsxDEV_7x81h0kn("span", {
                        style: { fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 15 },
                        children: fmtScore(s)
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, year, true, undefined, this))
            ]
          }, undefined, true, undefined, this),
          tab === "gaokao" && jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
            children: [
              { l: "一本率", v: (school.bbenRate || "—") + "%", c: "var(--success)" },
              { l: "985率", v: (school.top985 || "—") + "%", c: "var(--primary)" },
              { l: "清北复交", v: (school.qbfd || "—") + " 人", c: "var(--accent)" },
              { l: "招生计划", v: (school.intake || "—") + " 人", c: "var(--secondary)" }
            ].map((m) => jsxDEV_7x81h0kn("div", {
              className: "mc",
              style: { textAlign: "center" },
              children: [
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 11, color: "var(--text-3)", marginBottom: 6 },
                  children: m.l
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
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
