function RecommendPage({ onOpenSchool }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState("浦东");
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
  const tdList = React.useMemo(() => allSchools.filter((s) => s.mingeDistrict != null && (s.tier === "四校" || s.tier === "八大" || s.kind === "市实验示范" || s.kind === "委属市重点")).sort((a, b) => (b.mingeDistrict || 0) - (a.mingeDistrict || 0)), [allSchools]);
  const tsList = React.useMemo(() => allSchools.filter((s) => s.mingeSchool != null && (s.district === district || s.tier === "四校")).sort((a, b) => (b.mingeSchool || 0) - (a.mingeSchool || 0)), [allSchools, district]);
  const pList = React.useMemo(() => allSchools.filter((s) => s.score2025 != null && (s.district === district || s.tier === "四校" || s.tier === "八大")).sort((a, b) => b.score2025 - a.score2025), [allSchools, district]);
  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;
  const stepDefs = [
    { label: "\uD83D\uDCDD 基本信息", done: step > 0 },
    { label: "\uD83D\uDCAC AI 对话分析", done: step > 1 },
    { label: "\uD83D\uDCCB 志愿方案" + (totalPicked > 0 ? " (" + totalPicked + ")" : ""), done: false }
  ];
  if (loading)
    return jsxDEV_7x81h0kn("main", {
      style: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" },
      children: jsxDEV_7x81h0kn(Loading, {}, undefined, false, undefined, this)
    }, undefined, false, undefined, this);
  return jsxDEV_7x81h0kn("main", {
    style: { maxWidth: 1200, margin: "0 auto", padding: "32px 24px 64px" },
    children: [
      jsxDEV_7x81h0kn("h1", {
        style: { fontSize: 28, fontWeight: 700, margin: "0 0 8px" },
        children: "志愿填报助手"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("p", {
        style: { fontSize: 14, color: "var(--text-3)", margin: "0 0 24px" },
        children: "AI 顾问根据你的情况，智能生成完整志愿方案（到区1 + 到校2 + 平行15）"
      }, undefined, false, undefined, this),
      jsxDEV_7x81h0kn("div", {
        style: { display: "flex", gap: 4, marginBottom: 28 },
        children: stepDefs.map((s, i) => jsxDEV_7x81h0kn("button", {
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
          },
          children: [
            s.done ? "✓ " : "",
            s.label
          ]
        }, i, true, undefined, this))
      }, undefined, false, undefined, this),
      step === 0 && jsxDEV_7x81h0kn(Step0, {
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
      }, undefined, false, undefined, this),
      step === 1 && jsxDEV_7x81h0kn(AIChat, {
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
      }, undefined, false, undefined, this),
      step === 2 && jsxDEV_7x81h0kn(PlanResult, {
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
      }, undefined, false, undefined, this)
    ]
  }, undefined, true, undefined, this);
}
window.RecommendPage = RecommendPage;
