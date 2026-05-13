// PAGE 4: 志愿填报助手 — 新流程: 基本信息 → AI对话 → 方案结果
function RecommendPage({ onOpenSchool }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState('浦东');
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
    API.schools({ limit: 500 }).then(r => {
      setAllSchools(r.schools || []);
      setLoading(false);
    });
  }, []);

  const tdList = React.useMemo(() =>
    allSchools.filter(s => s.mingeDistrict != null && (s.tier === '四校' || s.tier === '八大' || s.kind === '市实验示范' || s.kind === '委属市重点'))
      .sort((a, b) => (b.mingeDistrict || 0) - (a.mingeDistrict || 0)),
    [allSchools]
  );
  // TODO: 后续根据学生所在学校决定候选，暂时与名额到区一致
  const tsList = React.useMemo(() =>
    allSchools.filter(s => s.mingeSchool != null && (s.tier === '四校' || s.tier === '八大' || s.kind === '市实验示范' || s.kind === '委属市重点'))
      .sort((a, b) => (b.mingeSchool || 0) - (a.mingeSchool || 0)),
    [allSchools]
  );
  const pList = React.useMemo(() =>
    allSchools.filter(s => s.score2025 != null && (s.district === district || s.tier === '四校' || s.tier === '八大'))
      .sort((a, b) => b.score2025 - a.score2025),
    [allSchools, district]
  );

  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;

  const stepDefs = [
    { label: '📝 基本信息', done: step > 0 },
    { label: '💬 AI 对话分析', done: step > 1 },
    { label: '📋 志愿方案' + (totalPicked > 0 ? ' (' + totalPicked + ')' : ''), done: false },
  ];

  if (loading) return <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}><Loading /></main>;

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>志愿填报助手</h1>
      <p style={{ fontSize: 14, color: 'var(--text-3)', margin: '0 0 24px' }}>AI 顾问根据你的情况，智能生成完整志愿方案（到区1 + 到校2 + 平行15）</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {stepDefs.map((s, i) => (
          <button key={i} onClick={() => i <= step && setStep(i)}
            style={{ flex: 1, padding: '14px 12px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: i === step ? 600 : 500,
              cursor: i <= step ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'center',
              background: i === step ? 'var(--primary)' : i < step ? 'var(--primary-50)' : 'var(--bg)',
              color: i === step ? '#fff' : i < step ? 'var(--primary)' : 'var(--text-3)' }}>
            {s.done ? '✓ ' : ''}{s.label}
          </button>
        ))}
      </div>

      {step === 0 && <Step0 score={score} setScore={setScore} district={district} setDistrict={setDistrict}
        generate={() => setStep(1)} tdCount={tdList.length} tsCount={tsList.length} pCount={pList.length}
        districtRank={districtRank} setDistrictRank={setDistrictRank} cityRank={cityRank} setCityRank={setCityRank} />}

      {step === 1 && <AIChat score={score} district={district}
        districtRank={districtRank} cityRank={cityRank}
        tdPick={tdPick} setTdPick={setTdPick}
        tsPicks={tsPicks} setTsPicks={setTsPicks}
        pPicks={pPicks} setPPicks={setPPicks}
        tdList={tdList} tsList={tsList} pList={pList}
        onDone={() => setStep(2)} onBack={() => setStep(0)}
        allSchools={allSchools} />}

      {step === 2 && <PlanResult
        score={score} district={district}
        tdPick={tdPick} setTdPick={setTdPick}
        tsPicks={tsPicks} setTsPicks={setTsPicks}
        pPicks={pPicks} setPPicks={setPPicks}
        tdList={tdList} tsList={tsList} pList={pList}
        onOpenSchool={onOpenSchool}
        onBack={() => setStep(1)}
        allSchools={allSchools} />}
    </main>
  );
}
window.RecommendPage = RecommendPage;
