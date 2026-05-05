// Step 2: 名额到校
function Step2({ list, picks, toggle, district, nav, allSchools }) {
  return (
    <div>
      <BatchHeader icon="🏫" title="名额分配到校" subtitle={'委属/本区市重点分配到初中学校的名额，填 0-2 个志愿'}
        rule="需在生源初中连续就读满3年。校内排名竞争，两个志愿建议一冲一稳。录取后不参加平行志愿批次。"
        picked={picks.length} max={2} />

      {picks.length > 0 && (
        <div style={{ padding: 12, background: 'var(--success-50)', borderRadius: 8, marginBottom: 12, fontSize: 13, color: 'var(--success)' }}>
          ✅ 已选 {picks.length}/2：{picks.map(id => allSchools.find(s => s.id === id)?.name).join('、')}
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {list.map(s => (
          <PickCard key={s.id} school={s}
            scoreVal={s.mingeSchool || s.score2025}
            selected={picks.includes(s.id)}
            onToggle={toggle}
            disabled={false} />
        ))}
        {list.length === 0 && <div className="card card-pad" style={{ textAlign: 'center', color: 'var(--text-3)' }}>暂无{district}区到校数据</div>}
      </div>
      {nav}
    </div>
  );
}

// Step 3: 统招平行志愿 1-15
function Step3({ list, picks, toggle, used, district, score, nav, tdPick, tsPicks, onOpenSchool, allSchools }) {
  const available = list.filter(s => !used.includes(s.id));

  const chong = available.filter(s => s.score2025 > score + 2).sort((a,b) => a.score2025 - b.score2025);
  const wen = available.filter(s => s.score2025 >= score - 8 && s.score2025 <= score + 2).sort((a,b) => b.score2025 - a.score2025);
  const bao = available.filter(s => s.score2025 < score - 8).sort((a,b) => b.score2025 - a.score2025);

  const Section = ({ title, icon, color, schools }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
        <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-3)' }}>({schools.length} 所可选)</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {schools.map(s => (
          <PickCard key={s.id} school={s}
            scoreVal={s.score2025}
            selected={picks.includes(s.id)}
            onToggle={toggle}
            disabled={picks.length >= 15 && !picks.includes(s.id)} />
        ))}
      </div>
      {schools.length === 0 && <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: 12 }}>该分段无可选学校</div>}
    </div>
  );

  const getSchool = id => allSchools.find(s => s.id === id);

  const SummaryPanel = () => (
    <div className="card card-pad" style={{ position: 'sticky', top: 88 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>📋 方案总览</h3>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', marginBottom: 6 }}>名额到区 (1)</div>
      <div style={{ fontSize: 13, marginBottom: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
        {tdPick ? getSchool(tdPick)?.name : <span style={{ color: 'var(--text-muted)' }}>未选</span>}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>名额到校 (2)</div>
      {[0,1].map(i => (
        <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>
          {i+1}. {tsPicks[i] ? getSchool(tsPicks[i])?.name : <span style={{ color: 'var(--text-muted)' }}>未选</span>}
        </div>
      ))}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 12, paddingBottom: 8 }} />

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 6 }}>平行志愿 ({picks.filter(Boolean).length}/15)</div>
      {picks.filter(Boolean).map((id, i) => {
        const s = getSchool(id);
        if (!s) return null;
        const diff = s.score2025 - score;
        const color = diff > 2 ? '#dc2626' : diff > -8 ? 'var(--primary)' : 'var(--success)';
        return (
          <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
            <span><span style={{ color: 'var(--text-muted)', marginRight: 6 }}>{i+1}.</span>{s.name}</span>
            <span style={{ color, fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 11 }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</span>
          </div>
        );
      })}
      {picks.filter(Boolean).length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>从左侧选择学校</div>}

      <div style={{ marginTop: 16, padding: 10, background: 'var(--bg)', borderRadius: 6, fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6 }}>
        建议前5个志愿冲高、中间5个稳妥、后5个保底。15个志愿务必填满，避免滑档。
      </div>

      {picks.filter(Boolean).length > 0 && (
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 12, fontSize: 14 }}
          onClick={() => { if (window._doAnalyze) window._doAnalyze(); }}>
          🤖 AI 智能分析方案
        </button>
      )}
    </div>
  );

  return (
    <div>
      <BatchHeader icon="📋" title="统一招生 · 平行志愿" subtitle={'本区所有高中 + 委属市重点，填 1-15 个志愿'}
        rule="分数优先、遵循志愿、一轮投档。按分数从高到低排队，轮到你时依次检索志愿，投进第一个有名额的学校。前面批次未录取的考生在此批次竞争。"
        picked={picks.filter(Boolean).length} max={15} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <Section title="冲刺区 (建议填3-4个)" icon="🚀" color="#dc2626" schools={chong} />
          <Section title="匹配区 (建议填5-6个)" icon="⚖️" color="var(--primary)" schools={wen} />
          <Section title="保底区 (建议填4-5个)" icon="🛡️" color="var(--success)" schools={bao} />
        </div>
        <SummaryPanel />
      </div>
      {nav}
    </div>
  );
}

window.Step2 = Step2;
window.Step3 = Step3;
