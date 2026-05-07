function MRecommend({ onOpenSchool, onBack }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState("\u6D66\u4E1C");
  const [phase, setPhase] = React.useState("input");
  const [tdPick, setTdPick] = React.useState(null);
  const [tsPicks, setTsPicks] = React.useState([]);
  const [pPicks, setPPicks] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [picker, setPicker] = React.useState(null);
  const [pickerQ, setPickerQ] = React.useState("");
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
    const pList = allSchools.filter((s) => s.score2025 != null && (s.district === district || s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927")).sort((a, b2) => b2.score2025 - a.score2025);
    const tdList = allSchools.filter((s) => s.mingeDistrict != null && (s.tier === "\u56DB\u6821" || s.kind === "\u59D4\u5C5E\u5E02\u91CD\u70B9" || s.kind === "\u5E02\u5B9E\u9A8C\u793A\u8303"));
    const tsList = allSchools.filter((s) => s.mingeSchool != null && (s.district === district || s.tier === "\u56DB\u6821"));
    const tdCandidates = tdList.filter((s) => (s.mingeDistrict || 0) > score && (s.mingeDistrict || 0) <= score + 20).sort((a, b2) => (b2.mingeDistrict || 0) - (a.mingeDistrict || 0));
    const td = tdCandidates[0] || tdList.find((s) => (s.mingeDistrict || 999) <= score + 5);
    if (td) setTdPick(td.id);
    const ts = tsList.filter((s) => (s.mingeSchool || 0) > score - 5 && (s.mingeSchool || 0) <= score + 15).sort((a, b2) => (b2.mingeSchool || 0) - (a.mingeSchool || 0)).slice(0, 2);
    setTsPicks(ts.map((s) => s.id));
    const used = new Set([td?.id, ...ts.map((s) => s.id)].filter(Boolean));
    const avail = pList.filter((s) => !used.has(s.id));
    const picked = /* @__PURE__ */ new Set();
    const pick = (list, n) => {
      const r = [];
      for (const s of list) {
        if (r.length >= n || picked.has(s.id)) continue;
        r.push(s);
        picked.add(s.id);
      }
      return r;
    };
    const c = pick(avail.filter((s) => s.score2025 > score && s.score2025 <= score + 15), 4);
    const w = pick(avail.filter((s) => s.score2025 >= score - 10 && s.score2025 <= score + 3), 6);
    const b = pick(avail.filter((s) => s.score2025 < score - 5), 5);
    let all = [...c, ...w, ...b];
    if (all.length < 15) {
      const extra = pick(avail.filter((s) => !picked.has(s.id)).sort((a, b2) => Math.abs(a.score2025 - score) - Math.abs(b2.score2025 - score)), 15 - all.length);
      all = [...all, ...extra];
    }
    setPPicks(all.map((s) => s.id).slice(0, 15));
  };
  const sendMsg = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    const tdList = allSchools.filter((s) => s.mingeDistrict != null && (s.tier === "\u56DB\u6821" || s.kind === "\u59D4\u5C5E\u5E02\u91CD\u70B9" || s.kind === "\u5E02\u5B9E\u9A8C\u793A\u8303")).sort((a, b) => (b.mingeDistrict || 0) - (a.mingeDistrict || 0));
    const tsList = allSchools.filter((s) => s.mingeSchool != null && (s.district === district || s.tier === "\u56DB\u6821")).sort((a, b) => (b.mingeSchool || 0) - (a.mingeSchool || 0));
    const pList = allSchools.filter((s) => s.score2025 != null && (s.district === district || s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927")).sort((a, b) => b.score2025 - a.score2025);
    const tdSchool = tdPick ? getS(tdPick) : null;
    const dxSchools = tsPicks.map(getS).filter(Boolean);
    const pSchools = pPicks.map(getS).filter(Boolean);
    const dqCtx = tdList.slice(0, 20).map((s) => s.id + "|" + s.name + "|" + s.district + "|\u5230\u533A" + (s.mingeDistrict || "-")).join("\n");
    const dxCtx = tsList.slice(0, 15).map((s) => s.id + "|" + s.name + "|" + s.district + "|\u5230\u6821" + (s.mingeSchool || "-")).join("\n");
    const pxCtx = pList.slice(0, 40).map((s) => s.id + "|" + s.name + "|" + s.district + "|" + s.kind + "|\u7EDF\u62DB" + s.score2025 + "|\u4E00\u672C\u7387" + s.bbenRate + "%").join("\n");
    const payload = {
      score,
      district,
      district_rank: dr,
      risk: "balanced",
      preferences: {
        home_district: district,
        notes: "\u7528\u6237\u6D88\u606F: " + msg + "\n\n\u5F53\u524D\u65B9\u6848: \u5230\u533A=" + (tdSchool?.name || "\u672A\u9009") + ", \u5230\u6821=" + (dxSchools.map((s) => s.name).join("\u3001") || "\u672A\u9009") + ", \u5E73\u884C(" + pSchools.length + "/15)=" + (pSchools.map((s, i) => i + 1 + "." + s.name).join(" ") || "\u672A\u9009") + "\n\u6392\u540D: " + district + "\u533A\u7EA6\u7B2C" + dr + "\u540D, \u5168\u5E02\u7EA6\u7B2C" + cr + "\u540D\n\n\u3010\u540D\u989D\u5230\u533A\u53EF\u9009\u5B66\u6821\u3011(\u90091\u4E2A\u51B2\u523A)\n" + dqCtx + "\n\n\u3010\u540D\u989D\u5230\u6821\u53EF\u9009\u5B66\u6821\u3011(\u90092\u4E2A\uFF0C\u9650" + district + "\u533A\u5185)\n" + dxCtx + "\n\n\u3010\u5E73\u884C\u5FD7\u613F\u53EF\u9009\u5B66\u6821\u3011(\u5FC5\u987B\u9009\u6EE115\u4E2A! \u51B24+\u7A336+\u4FDD5\uFF0C\u4ECE\u9AD8\u5230\u4F4E\u6392\u5217)\n" + pxCtx + "\n\n\u3010\u91CD\u8981\u89C4\u5219\u3011\n1. \u6BCF\u6B21\u56DE\u590D\u672B\u5C3E\u5FC5\u987B\u8F93\u51FA\u5B8C\u6574\u65B9\u6848\u6307\u4EE4:\n[SET_DQ:school_id]\n[SET_DX:id1,id2]\n[SET_PX:id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12,id13,id14,id15]\n2. \u5E73\u884C\u5FD7\u613F\u5FC5\u987B\u6070\u597D15\u4E2Aschool_id\uFF0C\u4E0D\u80FD\u5C11\uFF01\n3. \u5B66\u6821\u53EF\u4EE5\u91CD\u590D\uFF01\u5230\u533A/\u5230\u6821\u9009\u7684\u5B66\u6821\u5728\u5E73\u884C\u5FD7\u613F\u4E2D\u53EF\u4EE5\u518D\u6B21\u51FA\u73B0"
      },
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
      const actionPattern = /\[([A-Z_]+):([^\]]*)\]/g;
      let m;
      let actionsFound = 0;
      while ((m = actionPattern.exec(full)) !== null) {
        const [, cmd, args] = m;
        const ids = args.split(",").map((s) => s.trim());
        if (cmd === "SET_DQ" && getS(ids[0])) {
          setTdPick(ids[0]);
          actionsFound++;
        }
        if (cmd === "SET_DX") {
          setTsPicks(ids.filter((id) => getS(id)).slice(0, 2));
          actionsFound++;
        }
        if (cmd === "SET_PX") {
          setPPicks(ids.filter((id) => getS(id)).slice(0, 15));
          actionsFound++;
        }
        if (cmd === "ADD_PX") {
          setPPicks((prev) => [...prev, ...ids.filter((id) => getS(id) && !prev.includes(id))].slice(0, 15));
          actionsFound++;
        }
        if (cmd === "REPLACE_PX") {
          const [o, n] = args.split(">").map((s) => s.trim());
          if (o && n && getS(n)) {
            setPPicks((prev) => prev.map((id) => id === o ? n : id));
            actionsFound++;
          }
        }
        if (cmd === "REMOVE_PX") {
          setPPicks((prev) => prev.filter((id) => !ids.includes(id)));
          actionsFound++;
        }
      }
      const cleanText = full.replace(/\[([A-Z_]+):([^\]]*)\]/g, "").trim();
      const display = actionsFound > 0 ? cleanText + "\n\n\u2705 \u5DF2\u66F4\u65B0\u5FD7\u613F\u8868" : cleanText;
      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: "assistant", content: display };
        return arr;
      });
    } catch (err) {
      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: "assistant", content: "\u62B1\u6B49\uFF1A" + (err.message || "\u8BF7\u7A0D\u540E\u518D\u8BD5") };
        return arr;
      });
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);
  const startChat = () => {
    autoGen();
    setMessages([{
      role: "assistant",
      content: `\u4F60\u597D\uFF01\u{1F393}

**${score}\u5206 \xB7 ${district}\u533A \xB7 \u533A\u6392\u540D\u7EA6${dr}\u540D**

${dr <= 500 ? "\u5934\u90E8\u8003\u751F\uFF0C\u56DB\u6821\u6709\u7ADE\u4E89\u529B" : dr <= 1500 ? "\u4E2D\u4E0A\u6C34\u5E73\uFF0C\u5E02\u91CD\u70B9\u6709\u8F83\u5927\u673A\u4F1A" : "\u5EFA\u8BAE\u4EE5\u5E02\u91CD\u70B9\u4E2D\u6BB5\u548C\u533A\u91CD\u70B9\u4E3A\u4E3B"}

\u5DF2\u751F\u6210\u521D\u6B65\u65B9\u6848\u3002\u4F60\u53EF\u4EE5\uFF1A
\u2022 \u544A\u8BC9\u6211\u504F\u597D\uFF08\u5347\u5B66\u7387/\u79BB\u5BB6\u8FD1/\u7279\u8272\u73ED\uFF09
\u2022 \u8981\u6C42\u8C03\u6574\u67D0\u4E2A\u5FD7\u613F
\u2022 \u76F4\u63A5\u67E5\u770B\u65B9\u6848`
    }]);
    setPhase("chat");
  };
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  if (phase === "input") return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(MNav, { title: "\u5FD7\u613F\u586B\u62A5", subtitle: "AI \u667A\u80FD\u63A8\u8350", onBack }), /* @__PURE__ */ React.createElement("div", { className: "mp" }, /* @__PURE__ */ React.createElement("div", { className: "mc", style: { background: "var(--primary-50)", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("strong", null, "\u{1F4CC} \u5F55\u53D6\u987A\u5E8F\uFF1A"), "\u540D\u989D\u5230\u533A(1) \u2192 \u540D\u989D\u5230\u6821(2) \u2192 \u5E73\u884C\u5FD7\u613F(15)", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)", fontSize: 12 } }, "\u26A0\uFE0F \u540D\u989D\u5230\u6821\uFF1A\u5404\u521D\u4E2D\u5206\u914D\u540D\u989D\u4E0D\u540C\uFF0C\u9700\u786E\u8BA4\u4F60\u6240\u5728\u521D\u4E2D\u7684\u5177\u4F53\u540D\u989D"))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 } }, "\u4E2D\u8003\u6210\u7EE9"), /* @__PURE__ */ React.createElement("input", { className: "mi", type: "number", value: score, onChange: (e) => setScore(+e.target.value), style: { fontSize: 24, fontWeight: 700, color: "var(--primary)", textAlign: "center" } }), /* @__PURE__ */ React.createElement("input", { type: "range", min: 550, max: 720, step: 0.5, value: score, onChange: (e) => setScore(+e.target.value), style: { width: "100%", marginTop: 8, accentColor: "var(--primary)" } })), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 } }, "\u6240\u5728\u533A"), /* @__PURE__ */ React.createElement("select", { className: "ms", value: district, onChange: (e) => setDistrict(e.target.value) }, SH_DISTRICTS.map((d) => /* @__PURE__ */ React.createElement("option", { key: d, value: d }, d, "\u533A")))), /* @__PURE__ */ React.createElement("div", { className: "mc", style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: 600, marginBottom: 10 } }, "\u{1F4CA} \u6392\u540D\u4F30\u7B97"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 12, background: "var(--bg)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 4 } }, district, "\u533A\u6392\u540D"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u7B2C"), /* @__PURE__ */ React.createElement("input", { type: "number", value: dr, onChange: (e) => setDistrictRank(+e.target.value || null), style: { width: 70, fontSize: 18, fontWeight: 700, color: "var(--primary)", textAlign: "center", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 0", fontFamily: "inherit" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u540D")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, "\u4F30\u7B97\u2248", estDR)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 12, background: "var(--bg)", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)", marginBottom: 4 } }, "\u5168\u5E02\u6392\u540D"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u7B2C"), /* @__PURE__ */ React.createElement("input", { type: "number", value: cr, onChange: (e) => setCityRank(+e.target.value || null), style: { width: 70, fontSize: 18, fontWeight: 700, color: "var(--secondary)", textAlign: "center", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 0", fontFamily: "inherit" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "var(--text-3)" } }, "\u540D")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--text-muted)", marginTop: 4 } }, "\u4F30\u7B97\u2248", estCR))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: "var(--text-3)" } }, "\u5B9A\u4F4D\uFF1A", /* @__PURE__ */ React.createElement("span", { className: "score-chip " + tierClass(score) }, tierLabel(score))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, fontSize: 10, color: "var(--accent)" } }, "\u6392\u540D\u53EF\u624B\u52A8\u4FEE\u6539\uFF0C\u76F4\u63A5\u5F71\u54CD\u63A8\u8350\u7ED3\u679C")), /* @__PURE__ */ React.createElement("button", { className: "mb mb1", onClick: startChat }, "\u5F00\u59CB AI \u5FD7\u613F\u5206\u6790 \u2192")));
  if (phase === "chat") return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "linear-gradient(135deg,#1a56db,#0694a2)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPhase("input"), style: { background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, marginRight: 8 } }, "\u2190"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 600 } }, "\u{1F393} AI \u5FD7\u613F\u987E\u95EE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.8, marginTop: 2 } }, score, "\u5206 \xB7 ", district, "\u533A \xB7 \u5DF2\u586B", totalPicked, "\u4E2A\u5FD7\u613F")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPhase("result"), style: { background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" } }, "\u67E5\u770B\u65B9\u6848")), /* @__PURE__ */ React.createElement("div", { ref: chatRef, style: { flex: 1, overflowY: "auto", padding: 16 } }, messages.map((msg, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { marginBottom: 12, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
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
      dangerouslySetInnerHTML: msg.role === "assistant" ? { __html: renderMd(msg.content) } : void 0
    },
    msg.role === "user" ? msg.content : void 0
  ))), loading && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "#f1f5f9", borderRadius: 16, fontSize: 14, color: "var(--text-3)", display: "inline-block" } }, "\u5206\u6790\u4E2D\u2026")), messages.length <= 1 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 16px 8px", display: "flex", gap: 6, overflowX: "auto" } }, ["\u5E2E\u6211\u751F\u6210\u65B9\u6848", "\u5206\u6790\u65B9\u6848\u98CE\u9669", "\u6211\u60F3\u51B2\u56DB\u6821", "\u67E5\u770B\u65B9\u6848"].map((q) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: q,
      onClick: () => q === "\u67E5\u770B\u65B9\u6848" ? setPhase("result") : sendMsg(q),
      style: { padding: "8px 14px", fontSize: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit" }
    },
    q
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "10px 16px calc(10px + env(safe-area-inset-bottom,0px))", borderTop: "1px solid var(--border)", background: "#fff", display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && sendMsg(),
      placeholder: "\u8BF4\u51FA\u4F60\u7684\u9700\u6C42\u2026",
      className: "mi",
      style: { flex: 1, borderRadius: 999, padding: "12px 18px" }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => sendMsg(),
      disabled: loading || !input.trim(),
      style: { width: 44, height: 44, borderRadius: "50%", border: "none", background: input.trim() ? "var(--primary)" : "var(--bg)", color: input.trim() ? "#fff" : "var(--text-muted)", cursor: input.trim() ? "pointer" : "default", fontSize: 18, flexShrink: 0 }
    },
    "\u2191"
  )));
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(MNav, { title: "\u5FD7\u613F\u65B9\u6848", subtitle: totalPicked + "/18 \u4E2A\u5FD7\u613F", onBack: () => setPhase("chat") }), /* @__PURE__ */ React.createElement("div", { className: "mp" }, /* @__PURE__ */ React.createElement("div", { className: "mc", style: { background: "linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-around", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" } }, tdPick ? 1 : 0), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5230\u533A")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--secondary)" } }, tsPicks.length), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5230\u6821")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--accent)" } }, pPicks.length), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u5E73\u884C")))), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" } }, "\u{1F3DB}\uFE0F \u540D\u989D\u5230\u533A"), tdPick && getS(tdPick) ? /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(MSchoolRow, { school: getS(tdPick), onClick: () => onOpenSchool(tdPick), showScore: getS(tdPick)?.mingeDistrict }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8, display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    setPicker({ type: "dq" });
  }, style: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 11, cursor: "pointer" } }, "\u6362"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    setTdPick(null);
  }, style: { background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" } }, "\xD7"))) : /* @__PURE__ */ React.createElement("button", { className: "mc-sm", onClick: () => setPicker({ type: "dq" }), style: { width: "100%", color: "var(--primary)", textAlign: "center", padding: 20, cursor: "pointer", border: "1px dashed var(--primary)", background: "transparent", fontSize: 14, fontFamily: "inherit" } }, "+ \u9009\u62E9\u5230\u533A\u5B66\u6821"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" } }, "\u{1F3EB} \u540D\u989D\u5230\u6821"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--accent)", marginBottom: 6 } }, "\u26A0\uFE0F \u5404\u521D\u4E2D\u540D\u989D\u4E0D\u540C\uFF0C\u8BF7\u786E\u8BA4\u4F60\u6240\u5728\u521D\u4E2D\u7684\u5177\u4F53\u5206\u914D"), tsPicks.map((id, i) => {
    const s = getS(id);
    return s ? /* @__PURE__ */ React.createElement("div", { key: id, style: { position: "relative" } }, /* @__PURE__ */ React.createElement(MSchoolRow, { school: s, onClick: () => onOpenSchool(id), showScore: s?.mingeSchool }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8, display: "flex", gap: 4 } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setPicker({ type: "dx", index: i });
    }, style: { background: "var(--primary)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 11, cursor: "pointer" } }, "\u6362"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setTsPicks(tsPicks.filter((x) => x !== id));
    }, style: { background: "var(--danger)", color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer" } }, "\xD7"))) : null;
  }), tsPicks.length < 2 && /* @__PURE__ */ React.createElement("button", { className: "mc-sm", onClick: () => setPicker({ type: "dx", index: tsPicks.length }), style: { width: "100%", color: "var(--primary)", textAlign: "center", padding: 16, cursor: "pointer", border: "1px dashed var(--primary)", background: "transparent", fontSize: 14, fontFamily: "inherit" } }, "+ \u6DFB\u52A0\u5230\u6821 (", tsPicks.length, "/2)"), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 15, fontWeight: 600, margin: "16px 0 8px" } }, "\u{1F4CB} \u5E73\u884C\u5FD7\u613F (", pPicks.length, "/15)"), pPicks.map((id, i) => {
    const s = getS(id);
    if (!s) return null;
    const diff = (s.score2025 || 0) - score;
    const tag = diff > 5 ? "\u51B2" : diff > -3 ? "\u7A33" : "\u4FDD";
    const color = diff > 5 ? "#dc2626" : diff > -3 ? "var(--primary)" : "var(--success)";
    return /* @__PURE__ */ React.createElement("div", { key: id, className: "mc-sm", onClick: () => onOpenSchool(id), style: { cursor: "pointer", display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, s.district, " \xB7 ", fmtScore(s.score2025))), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 600, color, padding: "2px 8px", background: color + "15", borderRadius: 4 } }, tag), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setPicker({ type: "px", index: i });
    }, style: { background: "transparent", border: "none", color: "var(--primary)", fontSize: 11, cursor: "pointer", padding: "0 4px", flexShrink: 0 } }, "\u6362"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
      e.stopPropagation();
      setPPicks(pPicks.filter((x) => x !== id));
    }, style: { background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 16, cursor: "pointer", padding: "0 4px", flexShrink: 0 } }, "\xD7"));
  }), pPicks.length < 15 && /* @__PURE__ */ React.createElement("button", { className: "mc-sm", onClick: () => setPicker({ type: "px", index: pPicks.length }), style: { width: "100%", color: "var(--primary)", textAlign: "center", padding: 16, cursor: "pointer", border: "1px dashed var(--primary)", background: "transparent", fontSize: 14, fontFamily: "inherit" } }, "+ \u6DFB\u52A0\u5E73\u884C\u5FD7\u613F (", pPicks.length, "/15)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 16 } }, /* @__PURE__ */ React.createElement("button", { className: "mb mb2", onClick: () => setPhase("chat"), style: { flex: 1, fontSize: 14 } }, "\u2190 AI \u8C03\u6574"), /* @__PURE__ */ React.createElement("button", { className: "mb mb1", onClick: () => setPhase("input"), style: { flex: 1, fontSize: 14 } }, "\u91CD\u65B0\u586B\u62A5"))), picker && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, background: "#fff", marginTop: "15vh", borderTopLeftRadius: 16, borderTopRightRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600 } }, "\u9009\u62E9\u5B66\u6821\uFF08", picker.type === "dq" ? "\u5230\u533A" : picker.type === "dx" ? "\u5230\u6821" : "\u5E73\u884C\u5FD7\u613F", "\uFF09"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPicker(null);
    setPickerQ("");
  }, style: { background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: "var(--text-3)" } }, "\xD7")), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 16px" } }, /* @__PURE__ */ React.createElement("input", { value: pickerQ, onChange: (e) => setPickerQ(e.target.value), placeholder: "\u641C\u7D22\u5B66\u6821\u540D\u79F0...", className: "mi", style: { width: "100%", borderRadius: 8, padding: "10px 14px", fontSize: 14 } })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "0 16px" } }, allSchools.filter((s) => {
    if (pickerQ && !s.name.includes(pickerQ) && !(s.shortName || "").includes(pickerQ)) return false;
    if (picker.type === "dq") return s.mingeDistrict != null;
    if (picker.type === "dx") return s.mingeSchool != null && (s.district === district || s.tier === "\u56DB\u6821");
    return s.score2025 != null;
  }).sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0)).slice(0, 30).map((s) => {
    const used = s.id === tdPick || tsPicks.includes(s.id) || pPicks.includes(s.id);
    return /* @__PURE__ */ React.createElement("div", { key: s.id, onClick: () => {
      if (picker.type === "dq") setTdPick(s.id);
      else if (picker.type === "dx") {
        if (picker.index < tsPicks.length) setTsPicks(tsPicks.map((x, i) => i === picker.index ? s.id : x));
        else setTsPicks([...tsPicks, s.id].slice(0, 2));
      } else {
        if (picker.index < pPicks.length) setPPicks(pPicks.map((x, i) => i === picker.index ? s.id : x));
        else setPPicks([...pPicks, s.id].slice(0, 15));
      }
      setPicker(null);
      setPickerQ("");
    }, style: { padding: "12px 0", borderBottom: "1px solid var(--border)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: used ? 0.4 : 1 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, fontSize: 14 } }, s.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-3)" } }, s.district, " \xB7 ", s.kind, " \xB7 ", picker.type === "dq" ? "\u5230\u533A" + fmtScore(s.mingeDistrict) : picker.type === "dx" ? "\u5230\u6821" + fmtScore(s.mingeSchool) : "\u7EDF\u62DB" + fmtScore(s.score2025))), used && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--text-muted)" } }, "\u5DF2\u9009"));
  })))));
}
function renderMd(text) {
  if (!text) return "";
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/^### (.+)$/gm, '<div style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--primary)">$1</div>').replace(/^## (.+)$/gm, '<div style="font-size:16px;font-weight:700;margin:16px 0 8px">$1</div>').replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:12px 0"/>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*([^*\n]+)\*/g, '<em style="color:var(--text-3);font-size:12px">$1</em>').replace(/(\d+)\.\s+/g, '<div style="margin:10px 0 4px"><strong style="color:var(--primary)">$1.</strong> ').replace(/(<div style="margin:10px 0 4px">)/g, "</div>$1").replace(/\n- /g, '<div style="padding-left:16px;margin:4px 0">\u2022 ').replace(/\n\n/g, '<div style="margin:10px 0"></div>').replace(/\n/g, "<br/>").replace(/^<\/div>/, "");
}
window.MRecommend = MRecommend;
