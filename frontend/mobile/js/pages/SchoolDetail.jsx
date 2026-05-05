// Mobile School Detail
function MSchoolDetail({ schoolId, onBack }) {
  const [school, setSchool] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(null);
  const [tab, setTab] = React.useState('info');

  React.useEffect(() => {
    setLoading(true); setErr(null);
    API.school(schoolId).then(s => { setSchool(s); setLoading(false); }).catch(e => { setErr(e); setLoading(false); });
  }, [schoolId]);

  if (loading) return <div><MNav title="加载中…" onBack={onBack} /><MLoading /></div>;
  if (err) return <div><MNav title="出错了" onBack={onBack} /><MError err={err} /></div>;
  if (!school) return null;

  const tabs = [{k:'info',l:'基本'},{k:'scores',l:'分数线'},{k:'gaokao',l:'高考'}];

  return (
    <div>
      <MNav title={school.name} subtitle={school.district + ' · ' + school.kind} onBack={onBack} />
      <div className="mp" style={{paddingTop:8}}>
        {/* Score banner */}
        <div className="mc" style={{background:'linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,textAlign:'center'}}>
            <div><div style={{fontSize:11,color:'var(--text-3)'}}>2025统招</div><div style={{fontSize:22,fontWeight:700,color:'var(--primary)',fontVariantNumeric:'tabular-nums'}}>{fmtScore(school.score2025)}</div></div>
            <div><div style={{fontSize:11,color:'var(--text-3)'}}>一本率</div><div style={{fontSize:22,fontWeight:700,color:'var(--success)'}}>{school.bbenRate || '—'}%</div></div>
            <div><div style={{fontSize:11,color:'var(--text-3)'}}>招生</div><div style={{fontSize:22,fontWeight:700}}>{school.intake || '—'}人</div></div>
          </div>
        </div>

        {/* Tags */}
        <div style={{display:'flex',gap:6,flexWrap:'wrap',margin:'12px 0'}}>
          <span style={{padding:'6px 12px',borderRadius:999,fontSize:13,background:'var(--bg)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{school.district}</span>
          <span style={{padding:'6px 12px',borderRadius:999,fontSize:13,background:'var(--primary-50)',color:'var(--primary)'}}>{school.kind}</span>
          <span style={{padding:'6px 12px',borderRadius:999,fontSize:13,background:'var(--bg)',color:'var(--text-2)',border:'1px solid var(--border)'}}>{school.funding}</span>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:4,marginBottom:16,background:'var(--bg)',borderRadius:10,padding:4}}>
          {tabs.map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:'10px 8px',borderRadius:8,border:'none',fontSize:14,fontWeight:tab===t.k?600:500,background:tab===t.k?'#fff':'transparent',color:tab===t.k?'var(--primary)':'var(--text-3)',cursor:'pointer',fontFamily:'inherit',boxShadow:tab===t.k?'var(--shadow-sm)':'none'}}>{t.l}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div>
            {school.intro && (
              <div className="mc" style={{marginBottom:12}}>
                <h3 style={{fontSize:15,fontWeight:600,margin:'0 0 8px'}}>学校简介</h3>
                <p style={{fontSize:14,color:'var(--text-2)',lineHeight:1.8,margin:0}}>{school.intro}</p>
              </div>
            )}
            {school.tags && school.tags.length > 0 && (
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
                {school.tags.map((t,i) => (
                  <span key={i} style={{padding:'5px 10px',borderRadius:999,fontSize:12,background:i===0?'var(--primary-50)':'var(--bg)',color:i===0?'var(--primary)':'var(--text-2)',border:'1px solid '+(i===0?'var(--primary)':'var(--border)')}}>{t}</span>
                ))}
              </div>
            )}
            <div className="mc">
              {[
                ['学校类型', school.kind], ['办别', school.funding], ['区域', school.district + '区'],
                ['校区地址', school.address || '—'],
                ['联系电话', school.phone || '—'],
                ['到区分(参考)', school.mingeDistrict ? fmtScore(school.mingeDistrict) + ' ⚠️各区不同' : '—'], ['到校分(参考)', fmtScore(school.mingeSchool)],
                ['自招分', fmtScore(school.zizhao)], ['985率', (school.top985||'—')+'%'], ['清北复交', (school.qbfd||'—')+' 人'],
              ].concat(school.website ? [['官方网站', school.website, true]] : []).map(([k,v,isLink])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:14}}>
                  <span style={{color:'var(--text-3)'}}>{k}</span>
                  {isLink ? <a href={v.startsWith('http')?v:'https://'+v} target="_blank" rel="noopener" style={{color:'var(--primary)',textDecoration:'none',fontSize:13}}>{v.replace(/^https?:\/\//,'')} ↗</a> : <span style={{fontWeight:500}}>{v}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'scores' && (
          <div className="mc">
            <h3 style={{fontSize:15,fontWeight:600,margin:'0 0 12px'}}>近年统招分数线</h3>
            {(school.scoreHistory || [
              {year:2023,score:school.score2023},{year:2024,score:school.score2024},{year:2025,score:school.score2025}
            ].filter(s=>s.score)).map(({year,score:s})=>(
              <div key={year} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
                <span style={{fontSize:14,fontWeight:500}}>{year}</span>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:100,height:6,background:'var(--bg)',borderRadius:999,overflow:'hidden'}}>
                    <div style={{width:((s-600)/120*100)+'%',height:'100%',background:'var(--primary)',borderRadius:999}} />
                  </div>
                  <span style={{fontWeight:600,fontVariantNumeric:'tabular-nums',fontSize:15}}>{fmtScore(s)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'gaokao' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {[
              {l:'一本率',v:(school.bbenRate||'—')+'%',c:'var(--success)'},
              {l:'985率',v:(school.top985||'—')+'%',c:'var(--primary)'},
              {l:'清北复交',v:(school.qbfd||'—')+' 人',c:'var(--accent)'},
              {l:'招生计划',v:(school.intake||'—')+' 人',c:'var(--secondary)'},
            ].map(m=>(
              <div key={m.l} className="mc" style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:'var(--text-3)',marginBottom:6}}>{m.l}</div>
                <div style={{fontSize:24,fontWeight:700,color:m.c}}>{m.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
window.MSchoolDetail = MSchoolDetail;
