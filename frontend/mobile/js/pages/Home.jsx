// Mobile Home
function MHome({ onNavigate, onOpenSchool }) {
  const [featured, setFeatured] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [q, setQ] = React.useState('');

  React.useEffect(() => {
    Promise.all([API.schools({limit:6,sort:'score_desc'}), API.stats()])
      .then(([r, st]) => { setFeatured(r.schools||[]); setStats(st); }).catch(()=>{});
  }, []);

  return (
    <div className="mp">
      <div style={{textAlign:'center',padding:'16px 0 12px'}}>
        <p style={{fontSize:13,color:'var(--text-3)',margin:0}}>上海中考 · {stats ? stats.school_count + '所高中' : ''} · AI智能分析</p>
      </div>

      <form onSubmit={e=>{e.preventDefault();onNavigate('schools',{q})}} style={{marginBottom:16,position:'relative'}}>
        <input className="mi" type="search" enterKeyHint="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="搜索学校名、区域、特色..." style={{paddingRight:48}} />
        <button type="submit" style={{position:'absolute',right:6,top:'50%',transform:'translateY(-50%)',width:36,height:36,borderRadius:8,border:'none',background:'var(--primary)',color:'#fff',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>🔍</button>
      </form>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:20}}>
        {[{icon:'🔍',label:'查学校',r:'schools'},{icon:'🎯',label:'AI填报',r:'recommend'},{icon:'⚖️',label:'对比',r:'compare'}].map(f=>(
          <button key={f.r} className="mc" onClick={()=>onNavigate(f.r)} style={{textAlign:'center',cursor:'pointer',padding:14,border:'1px solid var(--border)'}}>
            <div style={{fontSize:26,marginBottom:4}}>{f.icon}</div>
            <div style={{fontSize:13,fontWeight:600}}>{f.label}</div>
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:20}}>
        {[
          {n:stats?.school_count||'—',l:'高中',r:'schools'},
          {n:stats?.year_count||'—',l:'年数据',r:'schools'},
          {n:stats?.latest_year||'—',l:'最新',r:'schools'},
          {n:'AI',l:'推荐',r:'recommend'}
        ].map((s,i)=>(
          <div key={i} onClick={()=>onNavigate(s.r)} style={{textAlign:'center',padding:10,background:'#fff',borderRadius:8,border:'1px solid var(--border)',cursor:'pointer'}}>
            <div style={{fontSize:16,fontWeight:700,color:'var(--primary)'}}>{s.n}</div>
            <div style={{fontSize:10,color:'var(--text-3)'}}>{s.l}</div>
          </div>
        ))}
      </div>

      <h2 style={{fontSize:16,fontWeight:600,margin:'0 0 10px'}}>热门学校</h2>
      {featured.length===0 ? <MLoading /> : featured.map(s => <MSchoolRow key={s.id} school={s} onClick={()=>onOpenSchool(s.id)} />)}
    </div>
  );
}
window.MHome = MHome;
