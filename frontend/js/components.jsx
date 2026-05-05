// Shared chrome — Header, ScoreChip, SchoolCard, Loading
function Header({ route, onNavigate }) {
  const links = [
    { key: 'schools', label: '学校查询' },
    { key: 'compare', label: '多校对比' },
    { key: 'recommend', label: '志愿推荐' },
    { key: 'about', label: '关于' },
  ];
  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="http://qianli.wang" style={{ width: 32, height: 32, borderRadius: 6, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, textDecoration: 'none', letterSpacing: '-0.02em' }}>千里</a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} style={{ fontWeight: 600, fontSize: 15, textDecoration: 'none', color: 'inherit' }}>千里·知途</a>
        </div>
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto' }}>
          {links.map(l => (
            <a key={l.key} href="#" onClick={(e) => { e.preventDefault(); onNavigate(l.key); }}
               style={{ padding: '8px 14px', fontSize: 14, color: route === l.key ? 'var(--primary)' : 'var(--text-2)',
                 background: route === l.key ? 'var(--primary-50)' : 'transparent',
                 borderRadius: 6, fontWeight: route === l.key ? 600 : 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>{l.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function ScoreChip({ score }) {
  if (score == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>;
  const display = Number.isInteger(score) ? score : score.toFixed(1);
  return <span className={'score-chip ' + tierClass(score)}>{display} 分</span>;
}

function SchoolCard({ school, onClick, compact }) {
  return (
    <div className="card" style={{ borderLeft: `3px solid ${tierBorder(school.score2025)}`, padding: compact ? 16 : 20, cursor: 'pointer', transition: 'box-shadow 120ms' }}
         onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
         onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
         onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: compact ? 15 : 17, color: 'var(--text)' }}>{school.name}</div>
        <ScoreChip score={school.score2025} />
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: compact ? 0 : 16 }}>
        <span className="pill pill-gray">{school.district}</span>
        <span className={`pill ${school.tier === '四校' || school.tier === '八大' ? 'pill-blue' : school.tier === '市重点' ? 'pill-teal' : 'pill-gray'}`}>{school.tier}</span>
        <span className="pill">{school.funding}</span>
      </div>
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 13, color: 'var(--text-3)', borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div><div style={{ fontSize: 11, marginBottom: 2 }}>2025统招</div><div style={{ color: 'var(--text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmtScore(school.score2025)}</div></div>
          <div><div style={{ fontSize: 11, marginBottom: 2 }}>一本率</div><div style={{ color: 'var(--text)', fontWeight: 600 }}>{school.bbenRate}%</div></div>
          <div><div style={{ fontSize: 11, marginBottom: 2 }}>招生</div><div style={{ color: 'var(--text)', fontWeight: 600 }}>{school.intake} 人</div></div>
        </div>
      )}
    </div>
  );
}

function Loading({ msg = '加载中…' }) {
  return <div className="loading"><span className="spinner"></span><span>{msg}</span></div>;
}

function ErrorBox({ err, onRetry }) {
  return (
    <div className="card card-pad" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', textAlign: 'center', margin: 24 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>加载失败</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 12 }}>{err.message}</div>
      {onRetry && <button className="btn btn-secondary" onClick={onRetry}>重试</button>}
    </div>
  );
}

window.Header = Header;
window.ScoreChip = ScoreChip;
window.SchoolCard = SchoolCard;
window.Loading = Loading;
window.ErrorBox = ErrorBox;
