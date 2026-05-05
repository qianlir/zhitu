import { jsxDEV as jsxDEV_7x81h0kn } from "react/jsx-dev-runtime";
function Step2({ list, picks, toggle, district, nav, allSchools }) {
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn(BatchHeader, {
        icon: "\uD83C\uDFEB",
        title: "名额分配到校",
        subtitle: "委属/本区市重点分配到初中学校的名额，填 0-2 个志愿",
        rule: "需在生源初中连续就读满3年。校内排名竞争，两个志愿建议一冲一稳。录取后不参加平行志愿批次。",
        picked: picks.length,
        max: 2
      }, undefined, false, undefined, this),
      picks.length > 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { padding: 12, background: "var(--success-50)", borderRadius: 8, marginBottom: 12, fontSize: 13, color: "var(--success)" },
        children: [
          "✅ 已选 ",
          picks.length,
          "/2：",
          picks.map((id) => allSchools.find((s) => s.id === id)?.name).join("、")
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gap: 10 },
        children: [
          list.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(PickCard, {
            school: s,
            scoreVal: s.mingeSchool || s.score2025,
            selected: picks.includes(s.id),
            onToggle: toggle,
            disabled: false
          }, s.id, false, undefined, this)),
          list.length === 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            className: "card card-pad",
            style: { textAlign: "center", color: "var(--text-3)" },
            children: [
              "暂无",
              district,
              "区到校数据"
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      nav
    ]
  }, undefined, true, undefined, this);
}
function Step3({ list, picks, toggle, used, district, score, nav, tdPick, tsPicks, onOpenSchool, allSchools }) {
  const available = list.filter((s) => !used.includes(s.id));
  const chong = available.filter((s) => s.score2025 > score + 2).sort((a, b) => a.score2025 - b.score2025);
  const wen = available.filter((s) => s.score2025 >= score - 8 && s.score2025 <= score + 2).sort((a, b) => b.score2025 - a.score2025);
  const bao = available.filter((s) => s.score2025 < score - 8).sort((a, b) => b.score2025 - a.score2025);
  const Section = ({ title, icon, color, schools }) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    style: { marginBottom: 16 },
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 14, fontWeight: 600, color, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
            children: icon
          }, undefined, false, undefined, this),
          " ",
          title,
          /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
            style: { fontSize: 12, fontWeight: 400, color: "var(--text-3)" },
            children: [
              "(",
              schools.length,
              " 所可选)"
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 },
        children: schools.map((s) => /* @__PURE__ */ jsxDEV_7x81h0kn(PickCard, {
          school: s,
          scoreVal: s.score2025,
          selected: picks.includes(s.id),
          onToggle: toggle,
          disabled: picks.length >= 15 && !picks.includes(s.id)
        }, s.id, false, undefined, this))
      }, undefined, false, undefined, this),
      schools.length === 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 13, color: "var(--text-muted)", padding: 12 },
        children: "该分段无可选学校"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
  const getSchool = (id) => allSchools.find((s) => s.id === id);
  const SummaryPanel = () => /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    className: "card card-pad",
    style: { position: "sticky", top: 88 },
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn("h3", {
        style: { fontSize: 14, fontWeight: 600, margin: "0 0 12px" },
        children: "\uD83D\uDCCB 方案总览"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, fontWeight: 600, color: "var(--primary)", marginBottom: 6 },
        children: "名额到区 (1)"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 13, marginBottom: 12, padding: "6px 0", borderBottom: "1px solid var(--border)" },
        children: tdPick ? getSchool(tdPick)?.name : /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
          style: { color: "var(--text-muted)" },
          children: "未选"
        }, undefined, false, undefined, this)
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, fontWeight: 600, color: "var(--secondary)", marginBottom: 6 },
        children: "名额到校 (2)"
      }, undefined, false, undefined, this),
      [0, 1].map((i) => /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 13, marginBottom: 4 },
        children: [
          i + 1,
          ". ",
          tsPicks[i] ? getSchool(tsPicks[i])?.name : /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
            style: { color: "var(--text-muted)" },
            children: "未选"
          }, undefined, false, undefined, this)
        ]
      }, i, true, undefined, this)),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { borderBottom: "1px solid var(--border)", marginBottom: 12, paddingBottom: 8 }
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 6 },
        children: [
          "平行志愿 (",
          picks.filter(Boolean).length,
          "/15)"
        ]
      }, undefined, true, undefined, this),
      picks.filter(Boolean).map((id, i) => {
        const s = getSchool(id);
        if (!s)
          return null;
        const diff = s.score2025 - score;
        const color = diff > 2 ? "#dc2626" : diff > -8 ? "var(--primary)" : "var(--success)";
        return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
          style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0", borderBottom: "1px solid var(--border)" },
          children: [
            /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
              children: [
                /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
                  style: { color: "var(--text-muted)", marginRight: 6 },
                  children: [
                    i + 1,
                    "."
                  ]
                }, undefined, true, undefined, this),
                s.name
              ]
            }, undefined, true, undefined, this),
            /* @__PURE__ */ jsxDEV_7x81h0kn("span", {
              style: { color, fontWeight: 600, fontVariantNumeric: "tabular-nums", fontSize: 11 },
              children: [
                diff >= 0 ? "+" : "",
                diff.toFixed(1)
              ]
            }, undefined, true, undefined, this)
          ]
        }, id, true, undefined, this);
      }),
      picks.filter(Boolean).length === 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { fontSize: 12, color: "var(--text-muted)" },
        children: "从左侧选择学校"
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { marginTop: 16, padding: 10, background: "var(--bg)", borderRadius: 6, fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 },
        children: "建议前5个志愿冲高、中间5个稳妥、后5个保底。15个志愿务必填满，避免滑档。"
      }, undefined, false, undefined, this),
      picks.filter(Boolean).length > 0 && /* @__PURE__ */ jsxDEV_7x81h0kn("button", {
        className: "btn btn-primary",
        style: { width: "100%", marginTop: 12, fontSize: 14 },
        onClick: () => {
          if (window._doAnalyze)
            window._doAnalyze();
        },
        children: "\uD83E\uDD16 AI 智能分析方案"
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
  return /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
    children: [
      /* @__PURE__ */ jsxDEV_7x81h0kn(BatchHeader, {
        icon: "\uD83D\uDCCB",
        title: "统一招生 · 平行志愿",
        subtitle: "本区所有高中 + 委属市重点，填 1-15 个志愿",
        rule: "分数优先、遵循志愿、一轮投档。按分数从高到低排队，轮到你时依次检索志愿，投进第一个有名额的学校。前面批次未录取的考生在此批次竞争。",
        picked: picks.filter(Boolean).length,
        max: 15
      }, undefined, false, undefined, this),
      /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 },
        children: [
          /* @__PURE__ */ jsxDEV_7x81h0kn("div", {
            children: [
              /* @__PURE__ */ jsxDEV_7x81h0kn(Section, {
                title: "冲刺区 (建议填3-4个)",
                icon: "\uD83D\uDE80",
                color: "#dc2626",
                schools: chong
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn(Section, {
                title: "匹配区 (建议填5-6个)",
                icon: "⚖️",
                color: "var(--primary)",
                schools: wen
              }, undefined, false, undefined, this),
              /* @__PURE__ */ jsxDEV_7x81h0kn(Section, {
                title: "保底区 (建议填4-5个)",
                icon: "\uD83D\uDEE1️",
                color: "var(--success)",
                schools: bao
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this),
          /* @__PURE__ */ jsxDEV_7x81h0kn(SummaryPanel, {}, undefined, false, undefined, this)
        ]
      }, undefined, true, undefined, this),
      nav
    ]
  }, undefined, true, undefined, this);
}
window.Step2 = Step2;
window.Step3 = Step3;
