// Mobile shared components: TabBar, NavBar, SchoolRow

function MTabBar({ tab, setTab }) {
  const tabs = [
    { key: 'home', label: '首页', icon: '🏠' },
    { key: 'schools', label: '查校', icon: '🔍' },
    { key: 'recommend', label: '填报', icon: '🎯' },
    { key: 'compare', label: '对比', icon: '⚖️' },
    { key: 'about', label: '关于', icon: 'ℹ️' },
  ];
  return (
    <nav style={{ position:'fixed',bottom:0,left:0,right:0,zIndex:100,background:'#fff',borderTop:'1px solid var(--border)',display:'flex',height:'var(--tab-h)',paddingBottom:'var(--safe-b)' }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,background:'transparent',border:'none',cursor:'pointer',fontFamily:'inherit',color:tab===t.key?'var(--primary)':'var(--text-3)',fontSize:10,fontWeight:tab===t.key?600:500 }}>
          <span style={{fontSize:20}}>{t.icon}</span><span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

function MNav({ title, subtitle, onBack }) {
  return (
    <div style={{ position:'sticky',top:0,zIndex:50,background:'#fff',borderBottom:'1px solid var(--border)',padding:'12px 16px',display:'flex',alignItems:'center',gap:12 }}>
      {onBack && <button onClick={onBack} style={{background:'transparent',border:'none',fontSize:20,cursor:'pointer',padding:0,color:'var(--text-2)'}}>←</button>}
      <div style={{flex:1}}>
        <div style={{fontSize:17,fontWeight:600}}>{title}</div>
        {subtitle && <div style={{fontSize:12,color:'var(--text-3)',marginTop:1}}>{subtitle}</div>}
      </div>
    </div>
  );
}

function MSchoolRow({ school, onClick, showScore }) {
  return (
    <div className="mc-sm" onClick={onClick} style={{borderLeft:`3px solid ${tierBorder(school.score2025)}`,cursor:'pointer'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
        <div>
          <div style={{fontWeight:600,fontSize:15}}>{school.name || school.shortName}</div>
          <div style={{fontSize:12,color:'var(--text-3)',marginTop:2}}>{school.district} · {school.kind}</div>
        </div>
        <ScoreChip score={showScore || school.score2025} />
      </div>
      {school.intro && <div style={{fontSize:12,color:'var(--text-3)',marginBottom:4,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{school.intro}</div>}
      <div style={{display:'flex',gap:12,fontSize:12,color:'var(--text-3)'}}>
        {school.bbenRate != null && <span>一本率 <strong style={{color:'var(--text)'}}>{school.bbenRate}%</strong></span>}
        {school.intake != null && <span>招生 <strong style={{color:'var(--text)'}}>{school.intake}人</strong></span>}
      </div>
      {school.matchReason && <div style={{fontSize:11,color:'var(--primary)',marginTop:4,padding:'4px 8px',background:'var(--primary-50)',borderRadius:4,lineHeight:1.5}}>匹配: {school.matchReason}</div>}
    </div>
  );
}

// Loading & Error — reuse from desktop
function MLoading() { return <div style={{textAlign:'center',padding:48,color:'var(--text-3)'}}>加载中…</div>; }
function MError({ err, onRetry }) {
  return <div className="mc" style={{textAlign:'center',padding:32}}>
    <div style={{color:'var(--danger)',marginBottom:8}}>加载失败</div>
    <div style={{fontSize:13,color:'var(--text-3)',marginBottom:12}}>{err?.message || String(err)}</div>
    {onRetry && <button className="mb mb2" style={{width:'auto',padding:'8px 20px'}} onClick={onRetry}>重试</button>}
  </div>;
}

window.MTabBar = MTabBar;
window.MNav = MNav;
window.MSchoolRow = MSchoolRow;
window.MLoading = MLoading;
window.MError = MError;
