function renderMd(text) {
  if (!text) return "";
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/### (.+)/g, '<div style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</div>').replace(/## (.+)/g, '<div style="font-size:16px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</div>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n- /g, "\n\u2022 ").replace(/\n(\d+)\. /g, "\n$1. ").replace(/\n/g, "<br/>");
}
function getFollowUps(messages, score, tdPick, pPicks) {
  const count = messages.filter((m) => m.role === "user").length;
  if (pPicks.length > 0) {
    return [
      "\u5206\u6790\u5F53\u524D\u65B9\u6848\u7684\u98CE\u9669",
      "\u5982\u679C\u8003\u4F4E10\u5206\u600E\u4E48\u529E\uFF1F",
      "\u5E2E\u6211\u4F18\u5316\u5E73\u884C\u5FD7\u613F\u987A\u5E8F",
      "\u5230\u533A\u8BE5\u51B2\u56DB\u6821\u5417\uFF1F"
    ];
  }
  if (count <= 1) {
    return [
      "\u5E2E\u6211\u751F\u6210\u4E00\u5957\u5B8C\u6574\u65B9\u6848",
      "\u6211\u60F3\u51B2\u56DB\u6821\uFF0C\u6709\u673A\u4F1A\u5417\uFF1F",
      "\u54EA\u4E9B\u5B66\u6821\u79BB\u6D66\u4E1C\u6700\u8FD1\uFF1F",
      "\u5EFA\u5E73\u548C\u8FDB\u624D\u8BE5\u9009\u54EA\u4E2A\uFF1F"
    ];
  }
  return [
    "\u5E2E\u6211\u751F\u6210\u65B9\u6848",
    "\u8FD8\u6709\u5176\u4ED6\u63A8\u8350\u5417\uFF1F",
    "\u8FD9\u4E2A\u65B9\u6848\u98CE\u9669\u5927\u5417\uFF1F"
  ];
}
function AIChat({ score, district, districtRank, cityRank, tdPick, setTdPick, tsPicks, setTsPicks, pPicks, setPPicks, tdList, tsList, pList, onDone, onBack, allSchools }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const chatRef = React.useRef(null);
  const getS = (id) => allSchools.find((s) => s.id === id);
  const generateDefault = () => {
    const td = tdList.find((s) => (s.mingeDistrict || 999) <= score + 8);
    if (td) setTdPick(td.id);
    const ts = tsList.filter((s) => (s.mingeSchool || 999) <= score + 5).slice(0, 2);
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
    setGenerated(true);
  };
  const executeActions = (text) => {
    let cleanText = text;
    const actionRegex = /\[([A-Z_]+):([^\]]*)\]/g;
    let match;
    const actions = [];
    while ((match = actionRegex.exec(text)) !== null) {
      actions.push({ cmd: match[1], args: match[2] });
    }
    cleanText = text.replace(actionRegex, "").trim();
    actions.forEach(({ cmd, args }) => {
      const ids = args.split(",").map((s) => s.trim());
      switch (cmd) {
        case "SET_DQ":
          if (getS(ids[0])) setTdPick(ids[0]);
          break;
        case "SET_DX":
          setTsPicks(ids.filter((id) => getS(id)).slice(0, 2));
          break;
        case "SET_PX":
          setPPicks(ids.filter((id) => getS(id)).slice(0, 15));
          break;
        case "ADD_PX":
          setPPicks((prev) => [...prev, ...ids.filter((id) => getS(id) && !prev.includes(id))].slice(0, 15));
          break;
        case "REPLACE_PX":
          const [oldId, newId] = args.split(">").map((s) => s.trim());
          if (oldId && newId && getS(newId)) setPPicks((prev) => prev.map((id) => id === oldId ? newId : id));
          break;
        case "REMOVE_PX":
          setPPicks((prev) => prev.filter((id) => !ids.includes(id)));
          break;
      }
    });
    return { cleanText, hasActions: actions.length > 0 };
  };
  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const tdSchool = tdPick ? getS(tdPick) : null;
      const dxSchools = tsPicks.map(getS).filter(Boolean);
      const pSchools = pPicks.map(getS).filter(Boolean);
      const schoolContext = pList.slice(0, 30).map(
        (s) => `${s.id}|${s.name}|${s.district}|${s.kind}|\u7EDF\u62DB${s.score2025}|\u5230\u533A${s.mingeDistrict || "-"}|\u5230\u6821${s.mingeSchool || "-"}|\u4E00\u672C\u7387${s.bbenRate}%`
      ).join("\n");
      const payload = {
        score,
        district,
        district_rank: districtRank || 0,
        risk: "balanced",
        preferences: {
          home_district: district,
          notes: `\u8FD9\u662FAI\u5BF9\u8BDD\u6A21\u5F0F\u3002\u7528\u6237\u6D88\u606F: ${userMsg}

\u5F53\u524D\u5FD7\u613F: \u5230\u533A=${tdSchool?.name || "\u672A\u9009"}, \u5230\u6821=${dxSchools.map((s) => s.name).join("\u3001") || "\u672A\u9009"}, \u5E73\u884C(${pSchools.length}/15)=${pSchools.map((s, i) => i + 1 + "." + s.name).join(" ") || "\u672A\u9009"}

\u6392\u540D\u4FE1\u606F: ${district}\u533A\u7EA6\u7B2C${districtRank || "?"}\u540D, \u5168\u5E02\u7EA6\u7B2C${cityRank || "?"}\u540D

\u53EF\u9009\u5B66\u6821:
${schoolContext}

\u64CD\u4F5C\u6307\u4EE4(\u653E\u56DE\u590D\u672B\u5C3E): [SET_DQ:id] [SET_DX:id1,id2] [SET_PX:id1,...] [ADD_PX:id1,...] [REPLACE_PX:\u65E7id>\u65B0id] [REMOVE_PX:id1,...]

\u56DE\u7B54\u7B80\u6D01\u4E13\u4E1A\u3002\u5982\u7528\u6237\u8981\u6C42\u4FEE\u6539\u5FD7\u613F\uFF0C\u5728\u672B\u5C3E\u52A0\u64CD\u4F5C\u6307\u4EE4\u3002`
        }
      };
      let fullText = "";
      for await (const chunk of API.analyzeStream(payload)) {
        fullText += chunk;
        setMessages((prev) => {
          const copy = [...prev];
          const lastMsg = copy[copy.length - 1];
          if (lastMsg && lastMsg.role === "assistant" && lastMsg._streaming) {
            copy[copy.length - 1] = { ...lastMsg, content: fullText };
          } else {
            copy.push({ role: "assistant", content: fullText, _streaming: true });
          }
          return copy;
        });
      }
      const { cleanText, hasActions } = executeActions(fullText);
      const display = hasActions ? cleanText + "\n\n\u2705 \u5DF2\u66F4\u65B0\u5FD7\u613F\u8868" : cleanText;
      setMessages((prev) => {
        const copy = prev.filter((m) => !m._streaming);
        copy.push({ role: "assistant", content: display });
        return copy;
      });
      if (hasActions) setGenerated(true);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "\u62B1\u6B49\uFF0C\u6682\u65F6\u65E0\u6CD5\u56DE\u7B54\u3002\u8BF7\u7A0D\u540E\u518D\u8BD5\u3002" }]);
    }
    setLoading(false);
  };
  React.useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);
  React.useEffect(() => {
    setMessages([{
      role: "assistant",
      content: `\u4F60\u597D\uFF0C\u5BB6\u957F\uFF01\u6211\u662F\u4F60\u7684\u4E2D\u8003\u5FD7\u613F\u586B\u62A5\u987E\u95EE \u{1F393}

\u6211\u5DF2\u7ECF\u770B\u5230\u4E86\u4F60\u7684\u57FA\u672C\u4FE1\u606F\uFF1A
\u{1F4CA} **${score} \u5206 \xB7 ${district}\u533A \xB7 ${tierLabel(score)}**
\u{1F4CD} **${district}\u533A\u6392\u540D**\uFF1A\u7EA6\u7B2C **${districtRank || "?"}** \u540D
\u{1F3D9}\uFE0F **\u5168\u5E02\u6392\u540D**\uFF1A\u7EA6\u7B2C **${cityRank || "?"}** \u540D

${districtRank && districtRank <= 500 ? "\u2705 \u4F60\u5728" + district + "\u533A\u5C5E\u4E8E\u5934\u90E8\u8003\u751F\uFF0C\u56DB\u6821\u548C\u5934\u90E8\u5E02\u91CD\u70B9\u90FD\u6709\u7ADE\u4E89\u529B\u3002" : districtRank && districtRank <= 1500 ? "\u2705 \u4F60\u5728" + district + "\u533A\u5C5E\u4E8E\u4E2D\u4E0A\u6C34\u5E73\uFF0C\u5E02\u91CD\u70B9\u5934\u90E8\u5B66\u6821\u6709\u8F83\u5927\u673A\u4F1A\u3002" : districtRank && districtRank <= 3e3 ? "\u{1F4CC} \u4F60\u5728" + district + "\u533A\u5C5E\u4E8E\u4E2D\u7B49\u6C34\u5E73\uFF0C\u5E02\u91CD\u70B9\u4E2D\u6BB5\u5B66\u6821\u662F\u4E3B\u8981\u76EE\u6807\u3002" : districtRank ? "\u{1F4CC} \u5EFA\u8BAE\u4EE5\u533A\u91CD\u70B9\u548C\u666E\u901A\u9AD8\u4E2D\u4E3A\u4E3B\uFF0C\u5E02\u91CD\u70B9\u9700\u8981\u8C28\u614E\u51B2\u523A\u3002" : ""}

\u5728\u51FA\u65B9\u6848\u4E4B\u524D\uFF0C\u6211\u8FD8\u9700\u8981\u786E\u8BA4\u51E0\u4E2A\u4FE1\u606F\uFF1A
1\uFE0F\u20E3 \u4F60\u5728\u54EA\u6240\u521D\u4E2D\u5C31\u8BFB\uFF1F\u6821\u5185\u6392\u540D\u548C\u5E74\u7EA7\u603B\u4EBA\u6570\uFF1F
2\uFE0F\u20E3 \u662F\u5426\u5DF2\u6709\u81EA\u4E3B\u62DB\u751F\u7B7E\u7EA6\uFF1F
3\uFE0F\u20E3 \u6709\u6CA1\u6709\u7279\u522B\u60F3\u53BB\u6216\u6392\u65A5\u7684\u5B66\u6821\uFF1F
4\uFE0F\u20E3 \u66F4\u770B\u91CD\u5347\u5B66\u7387\u3001\u79BB\u5BB6\u8FD1\u3001\u8FD8\u662F\u5B66\u6821\u7279\u8272\uFF1F

\u4F60\u53EF\u4EE5\u9010\u4E00\u56DE\u7B54\uFF0C\u6216\u8005\u76F4\u63A5\u70B9\u51FB"\u5148\u751F\u6210\u53C2\u8003\u65B9\u6848" \u{1F447}`
    }]);
  }, []);
  const quickActions = [
    { label: "\u5148\u57FA\u4E8E\u5F80\u5E74\u6570\u636E\u751F\u6210\u53C2\u8003\u65B9\u6848", primary: true, action: () => {
      generateDefault();
      setMessages((prev) => [...prev, { role: "user", content: "\u5148\u57FA\u4E8E\u5F80\u5E74\u6570\u636E\u751F\u6210\u65B9\u6848" }, { role: "assistant", content: '\u597D\u7684\uFF0C\u5DF2\u57FA\u4E8E\u5F80\u5E74\u5206\u6570\u7EBF\u6309"\u51B24+\u7A336+\u4FDD5"\u7B56\u7565\u751F\u6210\u4E86\u53C2\u8003\u65B9\u6848\u3002\n\n\u26A0\uFE0F **\u91CD\u8981\u63D0\u9192**\uFF1A\u8FD9\u4E2A\u65B9\u6848\u4EC5\u57FA\u4E8E\u5F80\u5E74\u5206\u6570\u7EBF\u3002\u5EFA\u8BAE\u4F60\u62FF\u5230\u6392\u540D\u540E\u518D\u544A\u8BC9\u6211\uFF0C\u6211\u4F1A\u91CD\u65B0\u8C03\u6574\u3002\n\n\u533A\u6392\u540D\u9760\u524D\uFF08\u524D500\uFF09\u2192 \u53EF\u4EE5\u66F4\u6FC0\u8FDB\u51B2\u9AD8\n\u533A\u6392\u540D\u9760\u540E\uFF081500+\uFF09\u2192 \u9700\u8981\u66F4\u7A33\u59A5\n\n\u70B9\u51FB\u53F3\u4FA7"\u67E5\u770B\u65B9\u6848"\u67E5\u770B\u8BE6\u60C5\uFF0C\u968F\u65F6\u544A\u8BC9\u6211\u9700\u8981\u8C03\u6574\u3002' }]);
    } },
    { label: "\u6211\u77E5\u9053\u533A\u6392\u540D", action: () => setInput("\u6211\u7684\u533A\u6392\u540D\u5927\u7EA6\u662F") },
    { label: "\u5E2E\u6211\u5206\u6790\u5EFA\u5E73\u4E2D\u5B66", action: () => sendMessage("\u5E2E\u6211\u5206\u6790\u4E00\u4E0B\u5EFA\u5E73\u4E2D\u5B66\u9002\u4E0D\u9002\u5408\u6211") }
  ];
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  return /* @__PURE__ */ React.createElement("div", { className: "chat-layout", style: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, minHeight: 600 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", background: "#fff", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, #1a56db, #0694a2)", color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 600 } }, "\u{1F393} AI \u5FD7\u613F\u987E\u95EE"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, opacity: 0.8, marginTop: 2 } }, score, " \u5206 \xB7 ", district, "\u533A \xB7 ", tierLabel(score), " \xB7 \u5BF9\u8BDD\u4E2D\u4F1A\u5B9E\u65F6\u66F4\u65B0\u53F3\u4FA7\u65B9\u6848")), /* @__PURE__ */ React.createElement("div", { ref: chatRef, style: { flex: 1, overflowY: "auto", padding: "16px 20px", maxHeight: 480 } }, messages.map((msg, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { marginBottom: 14, display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        maxWidth: "85%",
        padding: "12px 16px",
        borderRadius: 14,
        fontSize: 14,
        lineHeight: 1.8,
        background: msg.role === "user" ? "var(--primary)" : "#f1f5f9",
        color: msg.role === "user" ? "#fff" : "var(--text)",
        borderBottomRightRadius: msg.role === "user" ? 4 : 14,
        borderBottomLeftRadius: msg.role === "user" ? 14 : 4
      },
      dangerouslySetInnerHTML: { __html: msg.role === "user" ? msg.content : renderMd(msg.content) }
    }
  ))), loading && /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", background: "#f1f5f9", borderRadius: 14, fontSize: 14, color: "var(--text-3)", display: "inline-block" } }, "\u6B63\u5728\u5206\u6790..."), !loading && messages.length > 1 && messages[messages.length - 1]?.role === "assistant" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 } }, getFollowUps(messages, score, tdPick, pPicks).map((q, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: () => sendMessage(q),
      style: { padding: "6px 12px", fontSize: 11, background: "#fff", border: "1px solid var(--border)", borderRadius: 999, cursor: "pointer", color: "var(--text-2)", fontFamily: "inherit" }
    },
    q
  )))), messages.length <= 1 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 12px", display: "flex", gap: 8, flexWrap: "wrap" } }, quickActions.map((q, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: q.action,
      style: { padding: "8px 14px", fontSize: 12, background: q.primary ? "var(--primary-50)" : "var(--bg)", border: "1px solid " + (q.primary ? "var(--primary)" : "var(--border)"), borderRadius: 999, cursor: "pointer", color: q.primary ? "var(--primary)" : "var(--text-2)", fontFamily: "inherit", fontWeight: q.primary ? 600 : 400 }
    },
    q.label
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && sendMessage(),
      placeholder: "\u56DE\u7B54\u95EE\u9898\u3001\u8865\u5145\u504F\u597D\u3001\u6216\u8981\u6C42\u8C03\u6574\u65B9\u6848...",
      style: { flex: 1, fontSize: 14, padding: "12px 16px", borderRadius: 999 }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => sendMessage(),
      disabled: loading || !input.trim(),
      style: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "none",
        flexShrink: 0,
        background: input.trim() ? "var(--primary)" : "var(--bg)",
        color: input.trim() ? "#fff" : "var(--text-muted)",
        cursor: input.trim() ? "pointer" : "default",
        fontSize: 16
      }
    },
    "\u2191"
  ))), /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: 88, alignSelf: "start" } }, /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 15, fontWeight: 600, margin: 0 } }, "\u{1F4CB} \u5B9E\u65F6\u65B9\u6848"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: 600, color: totalPicked >= 18 ? "var(--success)" : totalPicked > 0 ? "var(--primary)" : "var(--text-muted)" } }, totalPicked, "/18")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 } }, "\u540D\u989D\u5230\u533A (1)"), tdPick ? /* @__PURE__ */ React.createElement(MiniSchoolRow, { school: getS(tdPick), refScore: getS(tdPick)?.mingeDistrict, score }) : /* @__PURE__ */ React.createElement(EmptySlot, null)), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 } }, "\u540D\u989D\u5230\u6821 (2)"), tsPicks.length > 0 ? tsPicks.map((id) => /* @__PURE__ */ React.createElement(MiniSchoolRow, { key: id, school: getS(id), refScore: getS(id)?.mingeSchool, score })) : /* @__PURE__ */ React.createElement(EmptySlot, null)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 } }, "\u5E73\u884C\u5FD7\u613F (", pPicks.length, "/15)"), pPicks.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { maxHeight: 240, overflowY: "auto" } }, pPicks.map((id, i) => /* @__PURE__ */ React.createElement(MiniSchoolRow, { key: id, school: getS(id), refScore: getS(id)?.score2025, score, idx: i + 1 }))) : /* @__PURE__ */ React.createElement(EmptySlot, null))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: onBack, style: { flex: 1 } }, "\u2190 \u4FEE\u6539\u4FE1\u606F"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: onDone, style: { flex: 1 }, disabled: totalPicked === 0 }, "\u67E5\u770B\u65B9\u6848 \u2192"))));
}
function MiniSchoolRow({ school, refScore, score, idx }) {
  if (!school) return null;
  const diff = (refScore || school.score2025) - score;
  const r = diff > 5 ? { t: "\u51B2", c: "#dc2626" } : diff > -3 ? { t: "\u7A33", c: "var(--primary)" } : { t: "\u4FDD", c: "var(--success)" };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", fontSize: 12, borderBottom: "1px solid var(--border)" } }, idx && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)", width: 18, fontVariantNumeric: "tabular-nums" } }, idx, "."), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, school.name), /* @__PURE__ */ React.createElement("span", { style: { color: r.c, fontWeight: 600, fontSize: 10 } }, r.t), /* @__PURE__ */ React.createElement("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--text-3)", fontSize: 11 } }, fmtScore(refScore || school.score2025)));
}
function EmptySlot() {
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 10px", color: "var(--text-muted)", fontSize: 12, fontStyle: "italic" } }, "\u5F85\u751F\u6210...");
}
window.AIChat = AIChat;
window.MiniSchoolRow = MiniSchoolRow;
window.EmptySlot = EmptySlot;
