// Mobile Schools — list + filter
function MSchools({ onOpenSchool, onBack, initialQuery }) {
  const [q, setQ] = React.useState(initialQuery || '');
  const [tierFilter, setTierFilter] = React.useState('全部');
  const [allSchools, setAllSchools] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);

  const debouncedQ = useDebounce(q, 300);

  const fetchSchools = (query) => {
    setLoading(true);
    API.schools({ q: query || '', limit: 500 }).then(r => { setAllSchools(r.schools || []); setLoading(false); }).catch(e => { setErr(e); setLoading(false); });
  };

  React.useEffect(() => {
    fetchSchools(initialQuery || '');
  }, []);

  React.useEffect(() => {
    fetchSchools(debouncedQ);
  }, [debouncedQ]);

  const filtered = allSchools.filter(s => {
    if (tierFilter !== '全部') {
      if (tierFilter === '四校' && s.tier !== '四校') return false;
      if (tierFilter === '市重点' && !['市实验示范','委属市重点'].includes(s.kind)) return false;
      if (tierFilter === '区重点' && s.kind !== '区实验示范') return false;
    }
    return true;
  }).sort((a, b) => (b.score2025 || 0) - (a.score2025 || 0));

  return (
    <div>
      <MNav title="学校查询" subtitle={filtered.length + ' 所'} onBack={onBack} />
      <div className="mp">
        <input className="mi" value={q} onChange={e => setQ(e.target.value)} placeholder="🔍 搜索学校..." style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
          {['全部', '四校', '市重点', '区重点'].map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, border: '1px solid ' + (tierFilter === t ? 'var(--primary)' : 'var(--border)'), background: tierFilter === t ? 'var(--primary)' : '#fff', color: tierFilter === t ? '#fff' : 'var(--text-2)', fontFamily: 'inherit' }}>
              {t}
            </button>
          ))}
        </div>
        {loading ? <MLoading /> : err ? <MError err={err} /> : filtered.map(s => <MSchoolRow key={s.id} school={s} onClick={() => onOpenSchool(s.id)} />)}
        {!loading && !err && filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>没有匹配学校</div>}
      </div>
    </div>
  );
}
window.MSchools = MSchools;
