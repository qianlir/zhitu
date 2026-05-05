// Step 0: Basic info input — with rank estimation
function Step0({ score, setScore, district, setDistrict, generate, tdCount, tsCount, pCount, districtRank, setDistrictRank, cityRank, setCityRank }) {
  const estDistrictRank = React.useMemo(() => estimateRank(score, PUDONG_RANK), [score]);
  const estCityRank = React.useMemo(() => estimateRank(score, CITY_RANK), [score]);

  const [rankOverridden, setRankOverridden] = React.useState(false);
  React.useEffect(() => {
    if (districtRank === null) setDistrictRank(estDistrictRank);
    if (cityRank === null) setCityRank(estCityRank);
  }, []);

  React.useEffect(() => {
    if (!rankOverridden) {
      setDistrictRank(estDistrictRank);
      setCityRank(estCityRank);
    }
  }, [score]);

  const handleRankChange = (setter, value) => { setter(value); setRankOverridden(true); };

  return (
    <div className="card card-pad" style={{ maxWidth: 760, margin: '0 auto', padding: 32 }}>
      <div style={{ padding: 16, background: 'linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))', borderRadius: 8, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 8px' }}>上海中考志愿录取批次</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 12 }}>
          <div style={{ padding: 10, background: '#fff', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>名额到区</div>
            <div style={{ color: 'var(--text-3)', marginTop: 2 }}>填1个志愿 · 委属/市重点分到各区</div>
          </div>
          <div style={{ padding: 10, background: '#fff', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>名额到校</div>
            <div style={{ color: 'var(--text-3)', marginTop: 2 }}>填2个志愿 · 分到初中学校</div>
          </div>
          <div style={{ padding: 10, background: '#fff', borderRadius: 6 }}>
            <div style={{ fontWeight: 600, color: 'var(--accent)' }}>统招平行</div>
            <div style={{ color: 'var(--text-3)', marginTop: 2 }}>填15个志愿 · 分数优先区内竞争</div>
          </div>
        </div>
      </div>

      <div className="step0-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>中考成绩 (满分750)</label>
          <input type="number" value={score} onChange={e => { setScore(+e.target.value); setRankOverridden(false); }} min={500} max={750}
            style={{ fontSize: 28, fontWeight: 700, padding: '8px 14px', width: '100%', color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }} />
          <input type="range" min={550} max={720} step={0.5} value={score} onChange={e => { setScore(+e.target.value); setRankOverridden(false); }}
            style={{ width: '100%', marginTop: 8, accentColor: 'var(--primary)' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>所在区</label>
          <select value={district} onChange={e => setDistrict(e.target.value)} style={{ fontSize: 15, padding: '12px 16px' }}>
            {SH_DISTRICTS.map(d => <option key={d} value={d}>{d}区</option>)}
          </select>
          <div style={{ marginTop: 12 }}>
            <span>定位：</span><span className={'score-chip ' + tierClass(score)}>{tierLabel(score)}</span>
          </div>
        </div>
      </div>

      {/* Rank estimation */}
      <div style={{ padding: 20, background: 'var(--bg)', borderRadius: 8, marginBottom: 24, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>📊 排名估算</h4>
          <span style={{ fontSize: 11, color: rankOverridden ? 'var(--accent)' : 'var(--text-3)' }}>
            {rankOverridden ? '已手动修改' : '基于往年一分一段表推算'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>
              {district}区排名
              <span style={{ color: 'var(--danger)', marginLeft: 4 }}>⭐ 核心指标</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>约第</span>
              <input type="number" value={districtRank || ''} onChange={e => handleRankChange(setDistrictRank, +e.target.value)} min={1}
                style={{ fontSize: 20, fontWeight: 700, padding: '6px 12px', width: 120, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums', textAlign: 'center' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>名</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              往年 {score} 分 ≈ {district}区第 {estDistrictRank} 名
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>
              全市排名
              <span style={{ color: 'var(--accent)', marginLeft: 4 }}>⭐ 重要</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>约第</span>
              <input type="number" value={cityRank || ''} onChange={e => handleRankChange(setCityRank, +e.target.value)} min={1}
                style={{ fontSize: 20, fontWeight: 700, padding: '6px 12px', width: 120, color: 'var(--secondary)', fontVariantNumeric: 'tabular-nums', textAlign: 'center' }} />
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>名</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              往年 {score} 分 ≈ 全市第 {estCityRank} 名
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(217,119,6,0.06)', borderRadius: 6, fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
          💡 <strong>如果你觉得今年试题偏难/偏简单</strong>，可以手动调整排名。例如你觉得今年偏难、同分排名应该更靠前，就把排名数字改小。排名直接决定平行志愿的录取结果。
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ padding: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{tdCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>可选到区学校</div>
        </div>
        <div style={{ padding: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--secondary)' }}>{tsCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>可选到校学校</div>
        </div>
        <div style={{ padding: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{pCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>可选平行志愿</div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg" style={{ width: '100%', fontSize: 16 }} onClick={generate}>
        开始 AI 志愿分析 →
      </button>
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
        AI 顾问会根据你的分数和排名，结合往年数据进行分析并推荐方案
      </div>
    </div>
  );
}

window.Step0 = Step0;
