function MRecommend({ onOpenSchool, onBack }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState("浦东");
  const [phase, setPhase] = React.useState("input");
  const [tdPick, setTdPick] = React.useState(null);
  const [tsPicks, setTsPicks] = React.useState([]);
  const [pPicks, setPPicks] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [allSchools, setAllSchools] = React.useState([]);
  const chatRef = React.useRef(null);
  const estDR = estimateRank(score, PUDONG_RANK);
  const estCR = estimateRank(score, CITY_RANK);
  const [districtRank, setDistrictRank] = React.useState(null);
  const [cityRank, setCityRank] = React.useState(null);
  const dr = districtRank || estDR;
  const cr = cityRank || estCR;
  React.useEffect(() => {
    setDistrictRank(null);
    setCityRank(null);
  }, [score]);
  React.useEffect(() => {
    API.schools({ limit: 500 }).then((r) => setAllSchools(r.schools || []));
  }, []);
  const getS = (id) => allSchools.find((s) => s.id === id);
  const autoGen = () => {
    const pList = allSchools.filter((s) => s.score2025 != null && (s.district === district || s.tier === "四校" || s.tier === "八大")).sort((a, b) => b.score2025 - a.score2025);
    const tdList = allSchools.filter((s) => s.mingeDistrict != null && (s.tier === "四校" || s.kind === "委属市重点" || s.kind === "市实验示范"));
    const tsList = allSchools.filter((s) => s.mingeSchool != null && (s.district === district || s.tier === "四校"));
    const td = tdList.find((s) => (s.mingeDistrict || 999) <= score + 8);
    if (td)
      setTdPick(td.id);
    const ts = tsList.filter((s) => (s.mingeSchool || 999) <= score + 5).slice(0, 2);
    setTsPicks(ts.map((s) => s.id));
    const used = new Set([td?.id, ...ts.map((s) => s.id)].filter(Boolean));
    const avail = pList.filter((s) => !used.has(s.id));
    const c = avail.filter((s) => s.score2025 > score && s.score2025 <= score + 10).slice(0, 4);
    const w = avail.filter((s) => s.score2025 >= score - 8 && s.score2025 <= score + 2 && !c.find((x) => x.id === s.id)).slice(0, 6);
    const b = avail.filter((s) => s.score2025 < score - 8 && !c.find((x) => x.id === s.id) && !w.find((x) => x.id === s.id)).slice(0, 5);
    setPPicks([...c, ...w, ...b].map((s) => s.id).slice(0, 15));
  };
  const sendMsg = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading)
      return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    const payload = {
      score,
      district,
      district_rank: dr,
      risk: "balanced",
      tdPick,
      tsPicks,
      pPicks,
      message: msg,
      history: messages.slice(-6)
    };
    try {
      let full = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      for await (const chunk of API.analyzeStream(payload)) {
        full += chunk;
        setMessages((prev) => {
          const arr = [...prev];
          arr[arr.length - 1] = { role: "assistant", content: full };
          return arr;
        });
      }
      const actionRegex = /\[([A-Z_]+):([^\]]*)\]/g;
      let m;
      while ((m = actionRegex.exec(full)) !== null) {
        const [, cmd, args] = m;
        const ids = args.split(",").map((s) => s.trim());
        if (cmd === "SET_DQ" && getS(ids[0]))
          setTdPick(ids[0]);
        if (cmd === "SET_DX")
          setTsPicks(ids.filter((id) => getS(id)).slice(0, 2));
        if (cmd === "SET_PX")
          setPPicks(ids.filter((id) => getS(id)).slice(0, 15));
        if (cmd === "ADD_PX")
          setPPicks((prev) => [...prev, ...ids.filter((id) => getS(id) && !prev.includes(id))].slice(0, 15));
        if (cmd === "REPLACE_PX") {
          const [o, n] = args.split(">").map((s) => s.trim());
          if (o && n && getS(n))
            setPPicks((prev) => prev.map((id) => id === o ? n : id));
        }
        if (cmd === "REMOVE_PX")
          setPPicks((prev) => prev.filter((id) => !ids.includes(id)));
      }
      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: "assistant", content: full.replace(actionRegex, "").trim() };
        return arr;
      });
    } catch (err) {
      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: "assistant", content: "抱歉：" + (err.message || "请稍后再试") };
        return arr;
      });
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);
  const startChat = () => {
    autoGen();
    setMessages([{
      role: "assistant",
      content: `你好！\uD83C\uDF93

**${score}分 · ${district}区 · 区排名约${dr}名**

${dr <= 500 ? "头部考生，四校有竞争力" : dr <= 1500 ? "中上水平，市重点有较大机会" : "建议以市重点中段和区重点为主"}

已生成初步方案。你可以：
• 告诉我偏好（升学率/离家近/特色班）
• 要求调整某个志愿
• 直接查看方案`
    }]);
    setPhase("chat");
  };
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  if (phase === "input")
    return jsxDEV_7x81h0kn("div", {
      children: [
        jsxDEV_7x81h0kn(MNav, {
          title: "志愿填报",
          subtitle: "AI 智能推荐",
          onBack
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("div", {
          className: "mp",
          children: [
            jsxDEV_7x81h0kn("div", {
              className: "mc",
              style: { background: "var(--primary-50)", marginBottom: 16 },
              children: jsxDEV_7x81h0kn("div", {
                style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 },
                children: [
                  jsxDEV_7x81h0kn("strong", {
                    children: "\uD83D\uDCCC 录取顺序："
                  }, undefined, false, undefined, this),
                  "名额到区(1) → 名额到校(2) → 平行志愿(15)",
                  jsxDEV_7x81h0kn("br", {}, undefined, false, undefined, this),
                  jsxDEV_7x81h0kn("span", {
                    style: { color: "var(--accent)", fontSize: 12 },
                    children: "⚠️ 名额到校：各初中分配名额不同，需确认你所在初中的具体名额"
                  }, undefined, false, undefined, this)
                ]
              }, undefined, true, undefined, this)
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { marginBottom: 16 },
              children: [
                jsxDEV_7x81h0kn("label", {
                  style: { fontSize: 13, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 },
                  children: "中考成绩"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("input", {
                  className: "mi",
                  type: "number",
                  value: score,
                  onChange: (e) => setScore(+e.target.value),
                  style: { fontSize: 24, fontWeight: 700, color: "var(--primary)", textAlign: "center" }
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("input", {
                  type: "range",
                  min: 550,
                  max: 720,
                  step: 0.5,
                  value: score,
                  onChange: (e) => setScore(+e.target.value),
                  style: { width: "100%", marginTop: 8, accentColor: "var(--primary)" }
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV_7x81h0kn("div", {
              style: { marginBottom: 16 },
              children: [
                jsxDEV_7x81h0kn("label", {
                  style: { fontSize: 13, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 },
                  children: "所在区"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("select", {
                  className: "ms",
                  value: district,
                  onChange: (e) => setDistrict(e.target.value),
                  children: SH_DISTRICTS.map((d) => jsxDEV_7x81h0kn("option", {
                    value: d,
                    children: [
                      d,
                      "区"
                    ]
                  }, d, true, undefined, this))
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV_7x81h0kn("div", {
              className: "mc",
              style: { marginBottom: 16 },
              children: [
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 13, fontWeight: 600, marginBottom: 10 },
                  children: "\uD83D\uDCCA 排名估算"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { textAlign: "center", padding: 12, background: "var(--bg)", borderRadius: 8 },
                      children: [
                        jsxDEV_7x81h0kn("div", {
                          style: { fontSize: 11, color: "var(--text-3)", marginBottom: 4 },
                          children: [
                            district,
                            "区排名"
                          ]
                        }, undefined, true, undefined, this),
                        jsxDEV_7x81h0kn("div", {
                          style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
                          children: [
                            jsxDEV_7x81h0kn("span", {
                              style: { fontSize: 13, color: "var(--text-3)" },
                              children: "第"
                            }, undefined, false, undefined, this),
                            jsxDEV_7x81h0kn("input", {
                              type: "number",
                              value: dr,
                              onChange: (e) => setDistrictRank(+e.target.value || null),
                              style: { width: 70, fontSize: 18, fontWeight: 700, color: "var(--primary)", textAlign: "center", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 0", fontFamily: "inherit" }
                            }, undefined, false, undefined, this),
                            jsxDEV_7x81h0kn("span", {
                              style: { fontSize: 13, color: "var(--text-3)" },
                              children: "名"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        jsxDEV_7x81h0kn("div", {
                          style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 },
                          children: [
                            "估算≈",
                            estDR
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { textAlign: "center", padding: 12, background: "var(--bg)", borderRadius: 8 },
                      children: [
                        jsxDEV_7x81h0kn("div", {
                          style: { fontSize: 11, color: "var(--text-3)", marginBottom: 4 },
                          children: "全市排名"
                        }, undefined, false, undefined, this),
                        jsxDEV_7x81h0kn("div", {
                          style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4 },
                          children: [
                            jsxDEV_7x81h0kn("span", {
                              style: { fontSize: 13, color: "var(--text-3)" },
                              children: "第"
                            }, undefined, false, undefined, this),
                            jsxDEV_7x81h0kn("input", {
                              type: "number",
                              value: cr,
                              onChange: (e) => setCityRank(+e.target.value || null),
                              style: { width: 70, fontSize: 18, fontWeight: 700, color: "var(--secondary)", textAlign: "center", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 0", fontFamily: "inherit" }
                            }, undefined, false, undefined, this),
                            jsxDEV_7x81h0kn("span", {
                              style: { fontSize: 13, color: "var(--text-3)" },
                              children: "名"
                            }, undefined, false, undefined, this)
                          ]
                        }, undefined, true, undefined, this),
                        jsxDEV_7x81h0kn("div", {
                          style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 },
                          children: [
                            "估算≈",
                            estCR
                          ]
                        }, undefined, true, undefined, this)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { marginTop: 8, fontSize: 11, color: "var(--text-3)" },
                  children: [
                    "定位：",
                    jsxDEV_7x81h0kn("span", {
                      className: "score-chip " + tierClass(score),
                      children: tierLabel(score)
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { marginTop: 4, fontSize: 10, color: "var(--accent)" },
                  children: "排名可手动修改，直接影响推荐结果"
                }, undefined, false, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV_7x81h0kn("button", {
              className: "mb mb1",
              onClick: startChat,
              children: "开始 AI 志愿分析 →"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this);
  if (phase === "chat")
    return jsxDEV_7x81h0kn("div", {
      style: { display: "flex", flexDirection: "column", height: "100vh" },
      children: [
        jsxDEV_7x81h0kn("div", {
          style: { padding: "12px 16px", background: "linear-gradient(135deg,#1a56db,#0694a2)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" },
          children: [
            jsxDEV_7x81h0kn("div", {
              children: [
                jsxDEV_7x81h0kn("button", {
                  onClick: () => setPhase("input"),
                  style: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, marginRight: 8 },
                  children: "←"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("span", {
                  style: { fontSize: 16, fontWeight: 600 },
                  children: "\uD83C\uDF93 AI 志愿顾问"
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { fontSize: 11, opacity: 0.8, marginTop: 2 },
                  children: [
                    score,
                    "分 · ",
                    district,
                    "区 · 已填",
                    totalPicked,
                    "个志愿"
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this),
            jsxDEV_7x81h0kn("button", {
              onClick: () => setPhase("result"),
              style: { background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" },
              children: "查看方案"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        jsxDEV_7x81h0kn("div", {
          ref: chatRef,
          style: { flex: 1, overflowY: "auto", padding: 16 },
          children: [
            messages.map((msg, i) => jsxDEV_7x81h0kn("div", {
              style: { marginBottom: 12, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" },
              children: jsxDEV_7x81h0kn("div", {
                style: {
                  maxWidth: "85%",
                  padding: "12px 16px",
                  borderRadius: 16,
                  fontSize: 14,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  background: msg.role === "user" ? "var(--primary)" : "#f1f5f9",
                  color: msg.role === "user" ? "#fff" : "var(--text)",
                  borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                  borderBottomLeftRadius: msg.role === "user" ? 16 : 4
                },
                dangerouslySetInnerHTML: msg.role === "assistant" ? { __html: renderMd(msg.content) } : undefined,
                children: msg.role === "user" ? msg.content : undefined
              }, undefined, false, undefined, this)
            }, i, false, undefined, this)),
            loading && jsxDEV_7x81h0kn("div", {
              style: { padding: "12px 16px", background: "#f1f5f9", borderRadius: 16, fontSize: 14, color: "var(--text-3)", display: "inline-block" },
              children: "分析中…"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this),
        messages.length <= 1 && jsxDEV_7x81h0kn("div", {
          style: { padding: "0 16px 8px", display: "flex", gap: 6, overflowX: "auto" },
          children: ["帮我生成方案", "分析方案风险", "我想冲四校", "查看方案"].map((q) => jsxDEV_7x81h0kn("button", {
            onClick: () => q === "查看方案" ? setPhase("result") : sendMsg(q),
            style: { padding: "8px 14px", fontSize: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" },
            children: q
          }, q, false, undefined, this))
        }, undefined, false, undefined, this),
        jsxDEV_7x81h0kn("div", {
          style: { padding: "10px 16px calc(10px + env(safe-area-inset-bottom,0px))", borderTop: "1px solid var(--border)", background: "#fff", display: "flex", gap: 8 },
          children: [
            jsxDEV_7x81h0kn("input", {
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && sendMsg(),
              placeholder: "说出你的需求…",
              className: "mi",
              style: { flex: 1, borderRadius: 999, padding: "12px 18px" }
            }, undefined, false, undefined, this),
            jsxDEV_7x81h0kn("button", {
              onClick: () => sendMsg(),
              disabled: loading || !input.trim(),
              style: { width: 44, height: 44, borderRadius: "50%", border: "none", background: input.trim() ? "var(--primary)" : "var(--bg)", color: input.trim() ? "#fff" : "var(--text-muted)", cursor: input.trim() ? "pointer" : "default", fontSize: 18, flexShrink: 0 },
              children: "↑"
            }, undefined, false, undefined, this)
          ]
        }, undefined, true, undefined, this)
      ]
    }, undefined, true, undefined, this);
  return jsxDEV_7x81h0kn("div", {
    children: [
      jsxDEV_7x81h0kn(MNav, {
        title: "志愿方案",
        subtitle: totalPicked + "/18 个志愿",
        onBack: () => setPhase("chat")
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        className: "mp",
        children: [
          jsxDEV_7x81h0kn("div", {
            className: "mc",
            style: { background: "linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))" },
            children: jsxDEV_7x81h0kn("div", {
              style: { display: "flex", justifyContent: "space-around", textAlign: "center" },
              children: [
                jsxDEV_7x81h0kn("div", {
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" },
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
                      style: { fontSize: 22, fontWeight: 700, color: "var(--secondary)" },
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
                      style: { fontSize: 22, fontWeight: 700, color: "var(--accent)" },
                      children: pPicks.length
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: "平行"
                    }, undefined, false, undefined, this)
                  ]
                }, undefined, true, undefined, this)
              ]
            }, undefined, true, undefined, this)
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" },
            children: "\uD83C\uDFDB️ 名额到区"
          }, undefined, false, undefined, this),
          tdPick && getS(tdPick) ? jsxDEV_7x81h0kn("div", {
            style: { position: "relative" },
            children: [
              jsxDEV_7x81h0kn(MSchoolRow, {
                school: getS(tdPick),
                onClick: () => onOpenSchool(tdPick),
                showScore: getS(tdPick)?.mingeDistrict
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("button", {
                onClick: (e) => {
                  e.stopPropagation();
                  setTdPick(null);
                },
                style: { position: "absolute", top: 8, right: 8, background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" },
                children: "×"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this) : jsxDEV_7x81h0kn("div", {
            className: "mc-sm",
            style: { color: "var(--text-muted)", textAlign: "center", padding: 20 },
            children: "未选"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" },
            children: "\uD83C\uDFEB 名额到校"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { fontSize: 11, color: "var(--accent)", marginBottom: 6 },
            children: "⚠️ 各初中名额不同，请确认你所在初中的具体分配"
          }, undefined, false, undefined, this),
          tsPicks.length > 0 ? tsPicks.map((id) => {
            const s = getS(id);
            return s ? jsxDEV_7x81h0kn("div", {
              style: { position: "relative" },
              children: [
                jsxDEV_7x81h0kn(MSchoolRow, {
                  school: s,
                  onClick: () => onOpenSchool(id),
                  showScore: s?.mingeSchool
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    setTsPicks(tsPicks.filter((x) => x !== id));
                  },
                  style: { position: "absolute", top: 8, right: 8, background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" },
                  children: "×"
                }, undefined, false, undefined, this)
              ]
            }, id, true, undefined, this) : null;
          }) : jsxDEV_7x81h0kn("div", {
            className: "mc-sm",
            style: { color: "var(--text-muted)", textAlign: "center", padding: 20 },
            children: "未选"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("h3", {
            style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" },
            children: [
              "\uD83D\uDCCB 平行志愿 (",
              pPicks.length,
              "/15)"
            ]
          }, undefined, true, undefined, this),
          pPicks.map((id, i) => {
            const s = getS(id);
            if (!s)
              return null;
            const diff = (s.score2025 || 0) - score;
            const tag = diff > 5 ? "冲" : diff > -3 ? "稳" : "保";
            const color = diff > 5 ? "#dc2626" : diff > -3 ? "var(--primary)" : "var(--success)";
            return jsxDEV_7x81h0kn("div", {
              className: "mc-sm",
              onClick: () => onOpenSchool(id),
              style: { cursor: "pointer", display: "flex", alignItems: "center", gap: 10 },
              children: [
                jsxDEV_7x81h0kn("span", {
                  style: { width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
                  children: i + 1
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("div", {
                  style: { flex: 1 },
                  children: [
                    jsxDEV_7x81h0kn("div", {
                      style: { fontWeight: 600, fontSize: 14 },
                      children: s.name
                    }, undefined, false, undefined, this),
                    jsxDEV_7x81h0kn("div", {
                      style: { fontSize: 11, color: "var(--text-3)" },
                      children: [
                        s.district,
                        " · ",
                        fmtScore(s.score2025)
                      ]
                    }, undefined, true, undefined, this)
                  ]
                }, undefined, true, undefined, this),
                jsxDEV_7x81h0kn("span", {
                  style: { fontSize: 11, fontWeight: 600, color, padding: "2px 8px", background: color + "15", borderRadius: 4 },
                  children: tag
                }, undefined, false, undefined, this),
                jsxDEV_7x81h0kn("button", {
                  onClick: (e) => {
                    e.stopPropagation();
                    setPPicks(pPicks.filter((x) => x !== id));
                  },
                  style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 },
                  children: "×"
                }, undefined, false, undefined, this)
              ]
            }, id, true, undefined, this);
          }),
          pPicks.length < 15 && jsxDEV_7x81h0kn("div", {
            style: { padding: 10, fontSize: 12, color: "var(--danger)", textAlign: "center" },
            children: "⚠️ 建议填满15个"
          }, undefined, false, undefined, this),
          jsxDEV_7x81h0kn("div", {
            style: { display: "flex", gap: 10, marginTop: 16 },
            children: [
              jsxDEV_7x81h0kn("button", {
                className: "mb mb2",
                onClick: () => setPhase("chat"),
                style: { flex: 1, fontSize: 14 },
                children: "← AI 调整"
              }, undefined, false, undefined, this),
              jsxDEV_7x81h0kn("button", {
                className: "mb mb1",
                onClick: () => setPhase("input"),
                style: { flex: 1, fontSize: 14 },
                children: "重新填报"
              }, undefined, false, undefined, this)
            ]
          }, undefined, true, undefined, this)
        ]
      }, undefined, true, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
function renderMd(text) {
  if (!text)
    return "";
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n- /g, `
• `).replace(/\n/g, "<br/>");
}
window.MRecommend = MRecommend;
