function RecommendPage({ onOpenSchool }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState("\u6D66\u4E1C");
  const [step, setStep] = React.useState(0);
  const [tdPick, setTdPick] = React.useState(null);
  const [tsPicks, setTsPicks] = React.useState([]);
  const [pPicks, setPPicks] = React.useState([]);
  const [districtRank, setDistrictRank] = React.useState(null);
  const [cityRank, setCityRank] = React.useState(null);
  const [allSchools, setAllSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  window._recScore = score;
  React.useEffect(() => {
    API.schools({ limit: 500 }).then((r) => {
      setAllSchools(r.schools || []);
      setLoading(false);
    });
  }, []);
  const tdList = React.useMemo(
    () => allSchools.filter((s) => s.mingeDistrict != null && (s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927" || s.kind === "\u5E02\u5B9E\u9A8C\u793A\u8303" || s.kind === "\u59D4\u5C5E\u5E02\u91CD\u70B9")).sort((a, b) => (b.mingeDistrict || 0) - (a.mingeDistrict || 0)),
    [allSchools]
  );
  // TODO: 后续根据学生所在学校决定候选，暂时与名额到区一致
  const tsList = React.useMemo(
    () => allSchools.filter((s) => s.mingeSchool != null && (s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927" || s.kind === "\u5E02\u5B9E\u9A8C\u793A\u8303" || s.kind === "\u59D4\u5C5E\u5E02\u91CD\u70B9")).sort((a, b) => (b.mingeSchool || 0) - (a.mingeSchool || 0)),
    [allSchools]
  );
  const pList = React.useMemo(
    () => allSchools.filter((s) => s.score2025 != null && (s.district === district || s.tier === "\u56DB\u6821" || s.tier === "\u516B\u5927")).sort((a, b) => b.score2025 - a.score2025),
    [allSchools, district]
  );
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  const stepDefs = [
    { label: "\u{1F4DD} \u57FA\u672C\u4FE1\u606F", done: step > 0 },
    { label: "\u{1F4AC} AI \u5BF9\u8BDD\u5206\u6790", done: step > 1 },
    { label: "\u{1F4CB} \u5FD7\u613F\u65B9\u6848" + (totalPicked > 0 ? " (" + totalPicked + ")" : ""), done: false }
  ];
  if (loading) return /* @__PURE__ */ React.createElement("main", { style: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" } }, /* @__PURE__ */ React.createElement(Loading, null));
  return /* @__PURE__ */ React.createElement("main", { style: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" } }, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 28, fontWeight: 700, margin: "0 0 8px" } }, "\u5FD7\u613F\u586B\u62A5\u52A9\u624B"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--text-3)", margin: "0 0 24px" } }, "AI \u987E\u95EE\u6839\u636E\u4F60\u7684\u60C5\u51B5\uFF0C\u667A\u80FD\u751F\u6210\u5B8C\u6574\u5FD7\u613F\u65B9\u6848\uFF08\u5230\u533A1 + \u5230\u68212 + \u5E73\u884C15\uFF09"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 28 } }, stepDefs.map((s, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      onClick: () => i <= step && setStep(i),
      style: {
        flex: 1,
        padding: "14px 12px",
        borderRadius: 8,
        border: "none",
        fontSize: 14,
        fontWeight: i === step ? 600 : 500,
        cursor: i <= step ? "pointer" : "default",
        fontFamily: "inherit",
        textAlign: "center",
        background: i === step ? "var(--primary)" : i < step ? "var(--primary-50)" : "var(--bg)",
        color: i === step ? "#fff" : i < step ? "var(--primary)" : "var(--text-3)"
      }
    },
    s.done ? "\u2713 " : "",
    s.label
  ))), step === 0 && /* @__PURE__ */ React.createElement(
    Step0,
    {
      score,
      setScore,
      district,
      setDistrict,
      generate: () => setStep(1),
      tdCount: tdList.length,
      tsCount: tsList.length,
      pCount: pList.length,
      districtRank,
      setDistrictRank,
      cityRank,
      setCityRank
    }
  ), step === 1 && /* @__PURE__ */ React.createElement(
    AIChat,
    {
      score,
      district,
      districtRank,
      cityRank,
      tdPick,
      setTdPick,
      tsPicks,
      setTsPicks,
      pPicks,
      setPPicks,
      tdList,
      tsList,
      pList,
      onDone: () => setStep(2),
      onBack: () => setStep(0),
      allSchools
    }
  ), step === 2 && /* @__PURE__ */ React.createElement(
    PlanResult,
    {
      score,
      district,
      tdPick,
      setTdPick,
      tsPicks,
      setTsPicks,
      pPicks,
      setPPicks,
      tdList,
      tsList,
      pList,
      onOpenSchool,
      onBack: () => setStep(1),
      allSchools
    }
  ));
}
window.RecommendPage = RecommendPage;
