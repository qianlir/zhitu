// Mobile Compare
function MCompare({ onOpenSchool, onBack }) {
  const [selected, setSelected] = React.useState([]);
  const [allSchools, setAllSchools] = React.useState([]);
  const [schools, setSchools] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => { API.schools({limit:500}).then(r=>setAllSchools(r.schools||[])); }, []);
  React.useEffect(() => {
    if (selected.length < 2) { setSchools([]); return; }
    setLoading(true);
    API.compare(selected).then(list => { setSchools(list); setLoading(false); }).catch(()=>setLoading(false));
  }, [selected.join(',')]);

  const fuzzyMatch = (name, q) => {
    if (!q) return true;
    const n = (name || '').toLowerCase();
    // 每个字符都必须按顺序出现在名字中（允许中间断开）
    let pos = 0;
    for (const ch of q.toLowerCase()) {
      pos = n.indexOf(ch, pos);
      if (pos === -1) return false;
      pos++;
    }
    return true;
  };
  const candidates = allSchools.filter(s => !selected.includes(s.id) && fuzzyMatch(s.name + (s.shortName || ''), search));
  const add = id => { if (selected.length < 5) setSelected([...selected,id]); setSearch(''); setSearchOpen(false); };
  const remove = id => setSelected(selected.filter(x=>x!==id));

  const rows = [
    {l:'区域',get:s=>s.district},
    {l:'类型',get:s=>s.kind},
    {l:'2025统招',get:s=>fmtScore(s.score2025),n:s=>s.score2025},
    {l:'一本率',get:s=>(s.bbenRate||'—')+'%',n:s=>s.bbenRate},
    {l:'985率',get:s=>(s.top985||'—')+'%',n:s=>s.top985},
    {l:'清北复交',get:s=>(s.qbfd||'—')+'人',n:s=>s.qbfd},
    {l:'招生',get:s=>(s.intake||'—')+'人'},
  ];

  return (
    <div>
      <MNav title="多校对比" subtitle={selected.length+'/5 所'} onBack={onBack} />
      <div className="mp">
        <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
          {selected.map(id => {
            const s = allSchools.find(x=>x.id===id) || schools.find(x=>x.id===id);
            return <span key={id} style={{display:'inline-flex',alignItems:'center',gap:4,padding:'6px 8px 6px 12px',background:'var(--primary-50)',color:'var(--primary)',borderRadius:999,fontSize:13,fontWeight:500}}>
              {s?.name||id}
              <button onClick={()=>remove(id)} style={{background:'transparent',border:'none',color:'var(--primary)',cursor:'pointer',fontSize:14,padding:0}}>×</button>
            </span>;
          })}
          {selected.length < 5 && <button onClick={()=>setSearchOpen(!searchOpen)} style={{padding:'6px 12px',borderRadius:999,background:'#fff',border:'1px dashed var(--border)',color:'var(--text-3)',cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>+ 添加</button>}
        </div>

        {searchOpen && (
          <div className="mc" style={{marginBottom:12}}>
            <input className="mi" value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索学校..." autoFocus style={{marginBottom:8}} />
            <div style={{maxHeight:200,overflowY:'auto'}}>
              {candidates.slice(0,8).map(s=>(
                <div key={s.id} onClick={()=>add(s.id)} style={{padding:'10px 0',borderBottom:'1px solid var(--border)',cursor:'pointer',display:'flex',justifyContent:'space-between',fontSize:14}}>
                  <span>{s.name}</span><span style={{color:'var(--text-3)',fontSize:12}}>{s.district} · {fmtScore(s.score2025)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? <MLoading /> : schools.length >= 2 ? (
          <div style={{overflowX:'auto',borderRadius:12,border:'1px solid var(--border)'}}>
            <table style={{width:'100%',minWidth:schools.length*110+90,borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{background:'var(--bg)'}}>
                  <th style={{padding:10,textAlign:'left',fontSize:12,color:'var(--text-3)',position:'sticky',left:0,background:'var(--bg)',minWidth:70}}>指标</th>
                  {schools.map(s=><th key={s.id} style={{padding:10,textAlign:'center',minWidth:100}}><div style={{fontWeight:600,fontSize:13}}>{s.name||s.shortName}</div></th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row,ri)=>{
                  const vals = schools.map(s=>row.n?row.n(s):null);
                  const best = row.n ? Math.max(...vals.filter(v=>v!=null)) : null;
                  return (
                    <tr key={ri} style={{borderTop:'1px solid var(--border)'}}>
                      <td style={{padding:'10px',color:'var(--text-3)',position:'sticky',left:0,background:'#fff',fontSize:12}}>{row.l}</td>
                      {schools.map((s,i)=>{
                        const v = row.n ? row.n(s) : null;
                        const isBest = best!=null && v===best && schools.length>1;
                        return <td key={s.id} style={{padding:'10px',textAlign:'center',fontWeight:500,background:isBest?'rgba(5,150,105,0.08)':'transparent',color:isBest?'var(--success)':'var(--text)'}}>{row.get(s)}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mc" style={{textAlign:'center',padding:48,color:'var(--text-3)'}}>
            <div style={{fontSize:36,marginBottom:8}}>⚖️</div>至少选 2 所学校
          </div>
        )}
      </div>
    </div>
  );
}
window.MCompare = MCompare;
