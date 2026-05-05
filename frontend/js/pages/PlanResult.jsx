// PlanResult: Step 2 — 方案结果展示 + 手动添加/删除
function PlanResult({ score, district, tdPick, setTdPick, tsPicks, setTsPicks, pPicks, setPPicks, tdList, tsList, pList, onOpenSchool, onBack, allSchools }) {
  const getS = id => allSchools.find(s => s.id === id);
  const riskTag = (refScore) => {
    const d = refScore - score;
    if (d > 5) return { t: '冲刺', c: '#dc2626', bg: '#fef2f2' };
    if (d > -3) return { t: '匹配', c: 'var(--primary)', bg: 'var(--primary-50)' };
    return { t: '保底', c: 'var(--success)', bg: 'rgba(5,150,105,0.08)' };
  };

  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;

  // Search state for adding schools
  const [addingTo, setAddingTo] = React.useState(null); // 'dq' | 'dx' | 'px' | null
  const [searchQ, setSearchQ] = React.useState('');
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    if (addingTo && searchRef.current) searchRef.current.focus();
  }, [addingTo]);

  const usedIds = new Set([tdPick, ...tsPicks, ...pPicks].filter(Boolean));

  const getPool = () => {
    if (addingTo === 'dq') return tdList;
    if (addingTo === 'dx') return tsList;
    if (addingTo === 'px') return pList;
    return [];
  };

  const filtered = getPool()
    .filter(s => !usedIds.has(s.id))
    .filter(s => !searchQ || s.name.includes(searchQ) || (s.shortName && s.shortName.includes(searchQ)) || s.district.includes(searchQ));

  const addSchool = (id) => {
    if (addingTo === 'dq') { setTdPick(id); setAddingTo(null); }
    else if (addingTo === 'dx' && tsPicks.length < 2) { setTsPicks([...tsPicks, id]); if (tsPicks.length >= 1) setAddingTo(null); }
    else if (addingTo === 'px' && pPicks.length < 15) { setPPicks([...pPicks, id]); }
    setSearchQ('');
  };

  const SchoolRow = ({ id, i, refScoreKey, onRemove }) => {
    const s = getS(id);
    if (!s) return null;
    const refScore = refScoreKey === 'dq' ? (s.mingeDistrict || s.score2025) : refScoreKey === 'dx' ? (s.mingeSchool || s.score2025) : s.score2025;
    const r = riskTag(refScore);
    const diff = refScore - score;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: '#fff', border: '1px solid var(--border)', borderLeft: `3px solid ${r.c}` }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-3)', width: 24 }}>{i + 1}</span>
        <div style={{ flex: 1 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onOpenSchool(s.id); }} style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', textDecoration: 'none' }}>{s.name}</a>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.district}区 · {s.kind}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: '2px 8px', borderRadius: 4 }}>{r.t}</span>
        <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmtScore(refScore)}</span>
        <span style={{ fontSize: 12, color: diff >= 0 ? '#dc2626' : 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</span>
        <button onClick={() => onRemove(id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>✕</button>
      </div>
    );
  };

  const AddButton = ({ batchKey, maxPicks, currentCount }) => {
    if (currentCount >= maxPicks) return null;
    return (
      <button onClick={() => { setAddingTo(batchKey); setSearchQ(''); }}
        style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '2px dashed var(--border)', background: 'transparent', cursor: 'pointer', fontSize: 13, color: 'var(--primary)', fontFamily: 'inherit', fontWeight: 500, marginTop: 8 }}>
        + 手动添加学校
      </button>
    );
  };

  // Search dropdown overlay
  const SearchDropdown = () => {
    if (!addingTo) return null;
    const batchLabel = addingTo === 'dq' ? '名额到区' : addingTo === 'dx' ? '名额到校' : '平行志愿';
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={(e) => { if (e.target === e.currentTarget) setAddingTo(null); }}>
        <div style={{ width: 520, maxHeight: '70vh', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>添加{batchLabel}学校</h3>
            <button onClick={() => setAddingTo(null)} style={{ background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-3)' }}>✕</button>
          </div>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <input ref={searchRef} value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="搜索学校名称..."
              style={{ width: '100%', fontSize: 14, padding: '10px 14px', borderRadius: 8 }} />
          </div>
          <div style={{ maxHeight: '50vh', overflowY: 'auto', padding: '8px 12px' }}>
            {filtered.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>无匹配学校</div>}
            {filtered.map(s => {
              const refScore = addingTo === 'dq' ? (s.mingeDistrict || s.score2025) : addingTo === 'dx' ? (s.mingeSchool || s.score2025) : s.score2025;
              const diff = refScore - score;
              const r = riskTag(refScore);
              return (
                <div key={s.id} onClick={() => addSchool(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, cursor: 'pointer', borderBottom: '1px solid var(--border)', transition: 'background 100ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{s.district}区 · {s.kind}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: r.c, background: r.bg, padding: '2px 8px', borderRadius: 4 }}>{r.t}</span>
                  <span style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{fmtScore(refScore)}</span>
                  <span style={{ fontSize: 12, color: diff >= 0 ? '#dc2626' : 'var(--success)', fontVariantNumeric: 'tabular-nums' }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Summary banner */}
      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))', borderLeft: '3px solid var(--primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>志愿方案</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
              <span style={{ color: 'var(--primary)' }}>{score}</span> 分 · {district}区 · <span className={'score-chip ' + tierClass(score)} style={{ fontSize: 13 }}>{tierLabel(score)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, textAlign: 'center' }}>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>{tdPick ? 1 : 0}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>到区</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--secondary)' }}>{tsPicks.length}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>到校</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{pPicks.length}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>平行</div></div>
            <div><div style={{ fontSize: 24, fontWeight: 700 }}>{totalPicked}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>总计</div></div>
          </div>
        </div>
      </div>

      {pPicks.length < 15 && (
        <div style={{ padding: 12, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, fontSize: 13, color: '#92400e', marginBottom: 20 }}>
          平行志愿仅填了 {pPicks.length} 个，建议填满 15 个以降低滑档风险！
        </div>
      )}

      {/* 名额到区 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🏛️</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>名额到区</h3>
          <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{tdPick ? 1 : 0}/1</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {tdPick && <SchoolRow id={tdPick} i={0} refScoreKey="dq" onRemove={() => setTdPick(null)} />}
          {!tdPick && <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>未选择</div>}
        </div>
        <AddButton batchKey="dq" maxPicks={1} currentCount={tdPick ? 1 : 0} />
      </div>

      {/* 名额到校 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>🏫</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>名额到校</h3>
          <span style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 600 }}>{tsPicks.length}/2</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {tsPicks.map((id, i) => <SchoolRow key={id} id={id} i={i} refScoreKey="dx" onRemove={(rid) => setTsPicks(tsPicks.filter(x => x !== rid))} />)}
          {tsPicks.length === 0 && <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>未选择</div>}
        </div>
        <AddButton batchKey="dx" maxPicks={2} currentCount={tsPicks.length} />
      </div>

      {/* 统招平行志愿 */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>统招平行志愿</h3>
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{pPicks.length}/15</span>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {pPicks.map((id, i) => <SchoolRow key={id} id={id} i={i} refScoreKey="px" onRemove={(rid) => setPPicks(pPicks.filter(x => x !== rid))} />)}
          {pPicks.length === 0 && <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>未选择</div>}
        </div>
        <AddButton batchKey="px" maxPicks={15} currentCount={pPicks.length} />
      </div>

      {/* Tips */}
      <div className="card card-pad" style={{ background: 'var(--bg)', marginBottom: 24 }}>
        <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>填报建议</h4>
        <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.9 }}>
          <li><strong>到区志愿</strong>可适当冲高 — 即使不录取，不影响后续批次</li>
          <li><strong>到校志愿</strong>建议一冲一稳 — 校内竞争比全区温和</li>
          <li><strong>平行志愿</strong>按"冲4稳6保5"排列 — 第15个务必填绝对保底</li>
          <li>同分排序看：同分优待 → 语数英合计 → 数学 → 语文 → 综合测试</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={onBack}>← 返回 AI 对话调整</button>
      </div>

      {/* Search modal */}
      <SearchDropdown />
    </div>
  );
}

window.PlanResult = PlanResult;
