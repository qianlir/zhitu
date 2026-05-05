import { jsxDEV as jsxDEV_7x81h0kn } from "react/jsx-dev-runtime";
function Step0({ score, setScore, district, setDistrict, generate, tdCount, tsCount, pCount, districtRank, setDistrictRank, cityRank, setCityRank }) {
  const estDistrictRank = React.useMemo(() => estimateRank(score, PUDONG_RANK), [score]);
  const estCityRank = React.useMemo(() => estimateRank(score, CITY_RANK), [score]);
  const [rankOverridden, setRankOverridden] = React.useState(false);
  React.useEffect(() => {
    if (districtRank === null)
      setDistrictRank(estDistrictRank);
    if (cityRank === null)
      setCityRank(estCityRank);
  }, []);
  React.useEffect(() => {
    if (!rankOverridden) {
      setDistrictRank(estDistrictRank);
      setCityRank(estCityRank);
    }
  }, [score]);
  const handleRankChange = (setter, value) => {
    setter(value);
    setRankOverridden(true);
  };
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    className: "card card-pad",
    style: { maxWidth: 760, margin: "0 auto", padding: 32 },
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { padding: 16, background: "linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))", borderRadius: 8, marginBottom: 24 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 15, fontWeight: 600, margin: "0 0 8px" },
            children: "上海中考志愿录取批次"
          }, undefined, false, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { padding: 10, background: "#fff", borderRadius: 6 },
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { fontWeight: 600, color: "var(--primary)" },
                    children: "名额到区"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { color: "var(--text-3)", marginTop: 2 },
                    children: "填1个志愿 · 委属/市重点分到各区"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { padding: 10, background: "#fff", borderRadius: 6 },
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { fontWeight: 600, color: "var(--secondary)" },
                    children: "名额到校"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { color: "var(--text-3)", marginTop: 2 },
                    children: "填2个志愿 · 分到初中学校"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { padding: 10, background: "#fff", borderRadius: 6 },
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { fontWeight: 600, color: "var(--accent)" },
                    children: "统招平行"
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { color: "var(--text-3)", marginTop: 2 },
                    children: "填15个志愿 · 分数优先区内竞争"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        className: "step0-inputs",
        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("label", {
                style: { fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 },
                children: "中考成绩 (满分750)"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
                type: "number",
                value: score,
                onChange: (e) => {
                  setScore(+e.target.value);
                  setRankOverridden(false);
                },
                min: 500,
                max: 750,
                style: { fontSize: 28, fontWeight: 700, padding: "8px 14px", width: "100%", color: "var(--primary)", fontVariantNumeric: "tabular-nums" }
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
                type: "range",
                min: 550,
                max: 720,
                step: 0.5,
                value: score,
                onChange: (e) => {
                  setScore(+e.target.value);
                  setRankOverridden(false);
                },
                style: { width: "100%", marginTop: 8, accentColor: "var(--primary)" }
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("label", {
                style: { fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 },
                children: "所在区"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("select", {
                value: district,
                onChange: (e) => setDistrict(e.target.value),
                style: { fontSize: 15, padding: "12px 16px" },
                children: SH_DISTRICTS.map((d) => /* @__PURE__ */ jsxDEV_7x81h0kn("option", {
                  value: d,
                  children: [
                    d,
                    "区"
                  ]
                }, d, true, undefined, this))
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { marginTop: 12 },
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                    children: "定位："
                  }, undefined, false, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                    className: "score-chip " + tierClass(score),
                    children: tierLabel(score)
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { padding: 20, background: "var(--bg)", borderRadius: 8, marginBottom: 24, border: "1px solid var(--border)" },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("h4", {
                style: { fontSize: 14, fontWeight: 600, margin: 0 },
                children: "\uD83D\uDCCA 排名估算"
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                style: { fontSize: 11, color: rankOverridden ? "var(--accent)" : "var(--text-3)" },
                children: rankOverridden ? "已手动修改" : "基于往年一分一段表推算"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("label", {
                    style: { fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 6 },
                    children: [
                      district,
                      "区排名",
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { color: "var(--danger)", marginLeft: 4 },
                        children: "⭐ 核心指标"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { display: "flex", alignItems: "center", gap: 8 },
                    children: [
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "约第"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
                        type: "number",
                        value: districtRank || "",
                        onChange: (e) => handleRankChange(setDistrictRank, +e.target.value),
                        min: 1,
                        style: { fontSize: 20, fontWeight: 700, padding: "6px 12px", width: 120, color: "var(--primary)", fontVariantNumeric: "tabular-nums", textAlign: "center" }
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "名"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 },
                    children: [
                      "往年 ",
                      score,
                      " 分 ≈ ",
                      district,
                      "区第 ",
                      estDistrictRank,
                      " 名"
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                children: [
                  /* @__PURE__ */ jsxDEV_7x81h0kn("label", {
                    style: { fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 6 },
                    children: [
                      "全市排名",
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { color: "var(--accent)", marginLeft: 4 },
                        children: "⭐ 重要"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { display: "flex", alignItems: "center", gap: 8 },
                    children: [
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "约第"
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV_7x81h0kn("input", {
                        type: "number",
                        value: cityRank || "",
                        onChange: (e) => handleRankChange(setCityRank, +e.target.value),
                        min: 1,
                        style: { fontSize: 20, fontWeight: 700, padding: "6px 12px", width: 120, color: "var(--secondary)", fontVariantNumeric: "tabular-nums", textAlign: "center" }
                      }, undefined, false, undefined, this),
                      /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                        style: { fontSize: 11, color: "var(--text-3)" },
                        children: "名"
                      }, undefined, false, undefined, this)
                    ]
                  }, undefined, true, undefined, this),
                  /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                    style: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 },
                    children: [
                      "往年 ",
                      score,
                      " 分 ≈ 全市第 ",
                      estCityRank,
                      " 名"
                    ]
                  }, undefined, true, undefined, this)
                ]
              }, undefined, true, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { marginTop: 12, padding: "10px 14px", background: "rgba(217,119,6,0.06)", borderRadius: 6, fontSize: 12, color: "#92400e", lineHeight: 1.6 },
            children: [
              "\uD83D\uDCA1 ",
              /* @__PURE__ */ jsxDEV_7x81h0kn("strong", {
                children: "如果你觉得今年试题偏难/偏简单"
              }, undefined, false, undefined, this),
              "，可以手动调整排名。例如你觉得今年偏难、同分排名应该更靠前，就把排名数字改小。排名直接决定平行志愿的录取结果。"
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" },
                children: tdCount
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 12, color: "var(--text-3)" },
                children: "可选到区学校"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 22, fontWeight: 700, color: "var(--secondary)" },
                children: tsCount
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 12, color: "var(--text-3)" },
                children: "可选到校学校"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" },
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 22, fontWeight: 700, color: "var(--accent)" },
                children: pCount
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
                style: { fontSize: 12, color: "var(--text-3)" },
                children: "可选平行志愿"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
        className: "btn btn-primary btn-lg",
        style: { width: "100%", fontSize: 16 },
        onClick: generate,
        children: "开始 AI 志愿分析 →"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { marginTop: 12, fontSize: 11, color: "var(--text-3)", textAlign: "center" },
        children: "AI 顾问会根据你的分数和排名，结合往年数据进行分析并推荐方案"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.Step0 = Step0;
