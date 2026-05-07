// Mobile Recommend — AI chat flow: input → chat → result
function MRecommend({ onOpenSchool, onBack }) {
  const [score, setScore] = React.useState(685);
  const [district, setDistrict] = React.useState('浦东');
  const [phase, setPhase] = React.useState('input'); // input | chat | result
  const [tdPick, setTdPick] = React.useState(null);
  const [tsPicks, setTsPicks] = React.useState([]);
  const [pPicks, setPPicks] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [picker, setPicker] = React.useState(null); // {type:'dq'|'dx'|'px', index?:number}
  const [pickerQ, setPickerQ] = React.useState('');
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [allSchools, setAllSchools] = React.useState([]);
  const chatRef = React.useRef(null);

  const estDR = estimateRank(score, PUDONG_RANK);
  const estCR = estimateRank(score, CITY_RANK);
  const [districtRank, setDistrictRank] = React.useState(null);
  const [cityRank, setCityRank] = React.useState(null);
  const dr = districtRank || estDR;
  const cr = cityRank || estCR;
  React.useEffect(() => { setDistrictRank(null); setCityRank(null); }, [score]);

  React.useEffect(() => {
    API.schools({ limit: 500 }).then(r => setAllSchools(r.schools || []));
  }, []);

  const getS = id => allSchools.find(s => s.id === id);

  // Auto-generate plan
  const autoGen = () => {
    const pList = allSchools.filter(s => s.score2025 != null && (s.district === district || s.tier === '四校' || s.tier === '八大')).sort((a, b) => b.score2025 - a.score2025);
    const tdList = allSchools.filter(s => s.mingeDistrict != null && (s.tier === '四校' || s.kind === '委属市重点' || s.kind === '市实验示范'));
    const tsList = allSchools.filter(s => s.mingeSchool != null && (s.district === district || s.tier === '四校'));

    // 到区：选冲刺（分数高于考生 5~20 分的最优学校）
    const tdCandidates = tdList.filter(s => (s.mingeDistrict || 0) > score && (s.mingeDistrict || 0) <= score + 20).sort((a, b) => (b.mingeDistrict || 0) - (a.mingeDistrict || 0));
    const td = tdCandidates[0] || tdList.find(s => (s.mingeDistrict || 999) <= score + 5);
    if (td) setTdPick(td.id);
    // 到校：选冲刺（分数高于考生的学校，到校分通常低于统招）
    const ts = tsList.filter(s => (s.mingeSchool || 0) > score - 5 && (s.mingeSchool || 0) <= score + 15).sort((a, b) => (b.mingeSchool || 0) - (a.mingeSchool || 0)).slice(0, 2);
    setTsPicks(ts.map(s => s.id));

    const used = new Set([td?.id, ...ts.map(s => s.id)].filter(Boolean));
    const avail = pList.filter(s => !used.has(s.id));
    const picked = new Set();
    const pick = (list, n) => { const r = []; for (const s of list) { if (r.length >= n || picked.has(s.id)) continue; r.push(s); picked.add(s.id); } return r; };
    const c = pick(avail.filter(s => s.score2025 > score && s.score2025 <= score + 15), 4);
    const w = pick(avail.filter(s => s.score2025 >= score - 10 && s.score2025 <= score + 3), 6);
    const b = pick(avail.filter(s => s.score2025 < score - 5), 5);
    let all = [...c, ...w, ...b];
    if (all.length < 15) {
      const extra = pick(avail.filter(s => !picked.has(s.id)).sort((a, b) => Math.abs(a.score2025 - score) - Math.abs(b.score2025 - score)), 15 - all.length);
      all = [...all, ...extra];
    }
    setPPicks(all.map(s => s.id).slice(0, 15));
  };

  // AI send — uses streaming API
  const sendMsg = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    // 构建可选学校列表（与 PC 端 AIChat 一致）
    const tdList = allSchools.filter(s => s.mingeDistrict != null && (s.tier === '四校' || s.kind === '委属市重点' || s.kind === '市实验示范')).sort((a,b) => (b.mingeDistrict||0)-(a.mingeDistrict||0));
    const tsList = allSchools.filter(s => s.mingeSchool != null && (s.district === district || s.tier === '四校')).sort((a,b) => (b.mingeSchool||0)-(a.mingeSchool||0));
    const pList = allSchools.filter(s => s.score2025 != null && (s.district === district || s.tier === '四校' || s.tier === '八大')).sort((a,b) => b.score2025 - a.score2025);

    const tdSchool = tdPick ? getS(tdPick) : null;
    const dxSchools = tsPicks.map(getS).filter(Boolean);
    const pSchools = pPicks.map(getS).filter(Boolean);

    const dqCtx = tdList.slice(0,20).map(s => s.id+'|'+s.name+'|'+s.district+'|到区'+(s.mingeDistrict||'-')).join('\n');
    const dxCtx = tsList.slice(0,15).map(s => s.id+'|'+s.name+'|'+s.district+'|到校'+(s.mingeSchool||'-')).join('\n');
    const pxCtx = pList.slice(0,40).map(s => s.id+'|'+s.name+'|'+s.district+'|'+s.kind+'|统招'+s.score2025+'|一本率'+s.bbenRate+'%').join('\n');

    const payload = {
      score, district, district_rank: dr, risk: 'balanced',
      preferences: {
        home_district: district,
        notes: '用户消息: ' + msg + '\n\n当前方案: 到区=' + (tdSchool?.name||'未选') + ', 到校=' + (dxSchools.map(s=>s.name).join('、')||'未选') + ', 平行(' + pSchools.length + '/15)=' + (pSchools.map((s,i)=>(i+1)+'.'+s.name).join(' ')||'未选') + '\n排名: ' + district + '区约第' + dr + '名, 全市约第' + cr + '名\n\n【名额到区可选学校】(选1个冲刺)\n' + dqCtx + '\n\n【名额到校可选学校】(选2个，限' + district + '区内)\n' + dxCtx + '\n\n【平行志愿可选学校】(必须选满15个! 冲4+稳6+保5，从高到低排列)\n' + pxCtx + '\n\n【重要规则】\n1. 每次回复末尾必须输出完整方案指令:\n[SET_DQ:school_id]\n[SET_DX:id1,id2]\n[SET_PX:id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12,id13,id14,id15]\n2. 平行志愿必须恰好15个school_id，不能少！\n3. 学校可以重复！到区/到校选的学校在平行志愿中可以再次出现',
      },
      message: msg,
      history: messages.slice(-6),
    };

    try {
      let full = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      for await (const chunk of API.analyzeStream(payload)) {
        full += chunk;
        setMessages(prev => { const arr = [...prev]; arr[arr.length - 1] = { role: 'assistant', content: full }; return arr; });
      }
      // Parse actions from response
      const actionPattern = /\[([A-Z_]+):([^\]]*)\]/g;
      let m;
      let actionsFound = 0;
      while ((m = actionPattern.exec(full)) !== null) {
        const [, cmd, args] = m;
        const ids = args.split(',').map(s => s.trim());
        if (cmd === 'SET_DQ' && getS(ids[0])) { setTdPick(ids[0]); actionsFound++; }
        if (cmd === 'SET_DX') { setTsPicks(ids.filter(id => getS(id)).slice(0, 2)); actionsFound++; }
        if (cmd === 'SET_PX') { setPPicks(ids.filter(id => getS(id)).slice(0, 15)); actionsFound++; }
        if (cmd === 'ADD_PX') { setPPicks(prev => [...prev, ...ids.filter(id => getS(id) && !prev.includes(id))].slice(0, 15)); actionsFound++; }
        if (cmd === 'REPLACE_PX') { const [o, n] = args.split('>').map(s => s.trim()); if (o && n && getS(n)) { setPPicks(prev => prev.map(id => id === o ? n : id)); actionsFound++; } }
        if (cmd === 'REMOVE_PX') { setPPicks(prev => prev.filter(id => !ids.includes(id))); actionsFound++; }
      }
      // Clean actions from display + show confirmation
      const cleanText = full.replace(/\[([A-Z_]+):([^\]]*)\]/g, '').trim();
      const display = actionsFound > 0 ? cleanText + '\n\n✅ 已更新志愿表' : cleanText;
      setMessages(prev => { const arr = [...prev]; arr[arr.length - 1] = { role: 'assistant', content: display }; return arr; });
    } catch (err) {
      setMessages(prev => { const arr = [...prev]; arr[arr.length - 1] = { role: 'assistant', content: '抱歉：' + (err.message || '请稍后再试') }; return arr; });
    }
    setLoading(false);
  };

  React.useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, loading]);

  const startChat = () => {
    autoGen();
    setMessages([{
      role: 'assistant',
      content: `你好！🎓\n\n**${score}分 · ${district}区 · 区排名约${dr}名**\n\n${dr <= 500 ? '头部考生，四校有竞争力' : dr <= 1500 ? '中上水平，市重点有较大机会' : '建议以市重点中段和区重点为主'}\n\n已生成初步方案。你可以：\n• 告诉我偏好（升学率/离家近/特色班）\n• 要求调整某个志愿\n• 直接查看方案`
    }]);
    setPhase('chat');
  };

  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;

  // === INPUT ===
  if (phase === 'input') return (
    <div>
      <MNav title="志愿填报" subtitle="AI 智能推荐" onBack={onBack} />
      <div className="mp">
        <div className="mc" style={{ background: 'var(--primary-50)', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <strong>📌 录取顺序：</strong>名额到区(1) → 名额到校(2) → 平行志愿(15)<br/>
            <span style={{color:'var(--accent)',fontSize:12}}>⚠️ 名额到校：各初中分配名额不同，需确认你所在初中的具体名额</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>中考成绩</label>
          <input className="mi" type="number" value={score} onChange={e => setScore(+e.target.value)} style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)', textAlign: 'center' }} />
          <input type="range" min={550} max={720} step={0.5} value={score} onChange={e => setScore(+e.target.value)} style={{ width: '100%', marginTop: 8, accentColor: 'var(--primary)' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>所在区</label>
          <select className="ms" value={district} onChange={e => setDistrict(e.target.value)}>
            {SH_DISTRICTS.map(d => <option key={d} value={d}>{d}区</option>)}
          </select>
        </div>
        <div className="mc" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>📊 排名估算</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>{district}区排名</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>第</span>
                <input type="number" value={dr} onChange={e => setDistrictRank(+e.target.value || null)} style={{ width: 70, fontSize: 18, fontWeight: 700, color: 'var(--primary)', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 0', fontFamily: 'inherit' }} />
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>名</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>估算≈{estDR}</div>
            </div>
            <div style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>全市排名</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>第</span>
                <input type="number" value={cr} onChange={e => setCityRank(+e.target.value || null)} style={{ width: 70, fontSize: 18, fontWeight: 700, color: 'var(--secondary)', textAlign: 'center', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 0', fontFamily: 'inherit' }} />
                <span style={{ fontSize: 13, color: 'var(--text-3)' }}>名</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>估算≈{estCR}</div>
            </div>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-3)' }}>定位：<span className={'score-chip ' + tierClass(score)}>{tierLabel(score)}</span></div>
          <div style={{ marginTop: 4, fontSize: 10, color: 'var(--accent)' }}>排名可手动修改，直接影响推荐结果</div>
        </div>
        <button className="mb mb1" onClick={startChat}>开始 AI 志愿分析 →</button>
      </div>
    </div>
  );

  // === CHAT ===
  if (phase === 'chat') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg,#1a56db,#0694a2)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => setPhase('input')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, marginRight: 8 }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 600 }}>🎓 AI 志愿顾问</span>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{score}分 · {district}区 · 已填{totalPicked}个志愿</div>
        </div>
        <button onClick={() => setPhase('result')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>查看方案</button>
      </div>
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 12, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: 16, fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap',
              background: msg.role === 'user' ? 'var(--primary)' : '#f1f5f9', color: msg.role === 'user' ? '#fff' : 'var(--text)',
              borderBottomRightRadius: msg.role === 'user' ? 4 : 16, borderBottomLeftRadius: msg.role === 'user' ? 16 : 4 }}
              dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: renderMd(msg.content) } : undefined}>
              {msg.role === 'user' ? msg.content : undefined}
            </div>
          </div>
        ))}
        {loading && <div style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: 16, fontSize: 14, color: 'var(--text-3)', display: 'inline-block' }}>分析中…</div>}
      </div>
      {messages.length <= 1 && (
        <div style={{ padding: '0 16px 8px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['帮我生成方案', '分析方案风险', '我想冲四校', '查看方案'].map(q => (
            <button key={q} onClick={() => q === '查看方案' ? setPhase('result') : sendMsg(q)}
              style={{ padding: '8px 14px', fontSize: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit' }}>{q}</button>
          ))}
        </div>
      )}
      <div style={{ padding: '10px 16px calc(10px + env(safe-area-inset-bottom,0px))', borderTop: '1px solid var(--border)', background: '#fff', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="说出你的需求…" className="mi" style={{ flex: 1, borderRadius: 999, padding: '12px 18px' }} />
        <button onClick={() => sendMsg()} disabled={loading || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: input.trim() ? 'var(--primary)' : 'var(--bg)', color: input.trim() ? '#fff' : 'var(--text-muted)', cursor: input.trim() ? 'pointer' : 'default', fontSize: 18, flexShrink: 0 }}>↑</button>
      </div>
    </div>
  );

  // === RESULT ===
  return (
    <div>
      <MNav title="志愿方案" subtitle={totalPicked + '/18 个志愿'} onBack={() => setPhase('chat')} />
      <div className="mp">
        <div className="mc" style={{ background: 'linear-gradient(135deg,var(--primary-50),rgba(6,148,162,0.06))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{tdPick ? 1 : 0}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>到区</div></div>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--secondary)' }}>{tsPicks.length}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>到校</div></div>
            <div><div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{pPicks.length}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>平行</div></div>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '16px 0 8px' }}>🏛️ 名额到区</h3>
        {tdPick && getS(tdPick) ? (
          <div style={{position:'relative'}}>
            <MSchoolRow school={getS(tdPick)} onClick={() => onOpenSchool(tdPick)} showScore={getS(tdPick)?.mingeDistrict} />
            <div style={{position:'absolute',top:8,right:8,display:'flex',gap:4}}>
              <button onClick={(e)=>{e.stopPropagation();setPicker({type:'dq'})}} style={{background:'var(--primary)',color:'#fff',border:'none',borderRadius:'50%',width:22,height:22,fontSize:11,cursor:'pointer'}}>换</button>
              <button onClick={(e)=>{e.stopPropagation();setTdPick(null)}} style={{background:'var(--danger)',color:'#fff',border:'none',borderRadius:'50%',width:22,height:22,fontSize:12,cursor:'pointer'}}>×</button>
            </div>
          </div>
        ) : <button className="mc-sm" onClick={()=>setPicker({type:'dq'})} style={{width:'100%',color:'var(--primary)',textAlign:'center',padding:20,cursor:'pointer',border:'1px dashed var(--primary)',background:'transparent',fontSize:14,fontFamily:'inherit'}}>+ 选择到区学校</button>}

        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '16px 0 8px' }}>🏫 名额到校</h3>
        <div style={{fontSize:11,color:'var(--accent)',marginBottom:6}}>⚠️ 各初中名额不同，请确认你所在初中的具体分配</div>
        {tsPicks.map((id, i) => { const s = getS(id); return s ? (
          <div key={id} style={{position:'relative'}}>
            <MSchoolRow school={s} onClick={() => onOpenSchool(id)} showScore={s?.mingeSchool} />
            <div style={{position:'absolute',top:8,right:8,display:'flex',gap:4}}>
              <button onClick={(e)=>{e.stopPropagation();setPicker({type:'dx',index:i})}} style={{background:'var(--primary)',color:'#fff',border:'none',borderRadius:'50%',width:22,height:22,fontSize:11,cursor:'pointer'}}>换</button>
              <button onClick={(e)=>{e.stopPropagation();setTsPicks(tsPicks.filter(x=>x!==id))}} style={{background:'var(--danger)',color:'#fff',border:'none',borderRadius:'50%',width:22,height:22,fontSize:12,cursor:'pointer'}}>×</button>
            </div>
          </div>
        ) : null; })}
        {tsPicks.length < 2 && <button className="mc-sm" onClick={()=>setPicker({type:'dx',index:tsPicks.length})} style={{width:'100%',color:'var(--primary)',textAlign:'center',padding:16,cursor:'pointer',border:'1px dashed var(--primary)',background:'transparent',fontSize:14,fontFamily:'inherit'}}>+ 添加到校 ({tsPicks.length}/2)</button>}

        <h3 style={{ fontSize: 15, fontWeight: 600, margin: '16px 0 8px' }}>📋 平行志愿 ({pPicks.length}/15)</h3>
        {pPicks.map((id, i) => {
          const s = getS(id);
          if (!s) return null;
          const diff = (s.score2025 || 0) - score;
          const tag = diff > 5 ? '冲' : diff > -3 ? '稳' : '保';
          const color = diff > 5 ? '#dc2626' : diff > -3 ? 'var(--primary)' : 'var(--success)';
          return (
            <div key={id} className="mc-sm" onClick={() => onOpenSchool(id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.district} · {fmtScore(s.score2025)}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color, padding: '2px 8px', background: color + '15', borderRadius: 4 }}>{tag}</span>
              <button onClick={(e)=>{e.stopPropagation();setPicker({type:'px',index:i})}} style={{background:'transparent',border:'none',color:'var(--primary)',fontSize:11,cursor:'pointer',padding:'0 4px',flexShrink:0}}>换</button>
              <button onClick={(e)=>{e.stopPropagation();setPPicks(pPicks.filter(x=>x!==id))}} style={{background:'transparent',border:'none',color:'var(--text-muted)',fontSize:16,cursor:'pointer',padding:'0 4px',flexShrink:0}}>×</button>
            </div>
          );
        })}
        {pPicks.length < 15 && <button className="mc-sm" onClick={()=>setPicker({type:'px',index:pPicks.length})} style={{width:'100%',color:'var(--primary)',textAlign:'center',padding:16,cursor:'pointer',border:'1px dashed var(--primary)',background:'transparent',fontSize:14,fontFamily:'inherit'}}>+ 添加平行志愿 ({pPicks.length}/15)</button>}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button className="mb mb2" onClick={() => setPhase('chat')} style={{ flex: 1, fontSize: 14 }}>← AI 调整</button>
          <button className="mb mb1" onClick={() => setPhase('input')} style={{ flex: 1, fontSize: 14 }}>重新填报</button>
        </div>
      </div>

      {/* 学校选择弹窗 */}
      {picker && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.5)',display:'flex',flexDirection:'column'}}>
          <div style={{flex:1,background:'#fff',marginTop:'15vh',borderTopLeftRadius:16,borderTopRightRadius:16,display:'flex',flexDirection:'column',overflow:'hidden'}}>
            <div style={{padding:'16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:16,fontWeight:600}}>选择学校（{picker.type==='dq'?'到区':picker.type==='dx'?'到校':'平行志愿'}）</div>
              <button onClick={()=>{setPicker(null);setPickerQ('')}} style={{background:'transparent',border:'none',fontSize:20,cursor:'pointer',color:'var(--text-3)'}}>×</button>
            </div>
            <div style={{padding:'8px 16px'}}>
              <input value={pickerQ} onChange={e=>setPickerQ(e.target.value)} placeholder="搜索学校名称..." className="mi" style={{width:'100%',borderRadius:8,padding:'10px 14px',fontSize:14}} />
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'0 16px'}}>
              {allSchools.filter(s => {
                if (pickerQ && !s.name.includes(pickerQ) && !(s.shortName||'').includes(pickerQ)) return false;
                if (picker.type === 'dq') return s.mingeDistrict != null;
                if (picker.type === 'dx') return s.mingeSchool != null && (s.district === district || s.tier === '四校');
                return s.score2025 != null;
              }).sort((a,b) => (b.score2025||0)-(a.score2025||0)).slice(0,30).map(s => {
                const used = s.id === tdPick || tsPicks.includes(s.id) || pPicks.includes(s.id);
                return (
                  <div key={s.id} onClick={() => {
                    if (picker.type === 'dq') setTdPick(s.id);
                    else if (picker.type === 'dx') {
                      if (picker.index < tsPicks.length) setTsPicks(tsPicks.map((x,i) => i===picker.index ? s.id : x));
                      else setTsPicks([...tsPicks, s.id].slice(0,2));
                    } else {
                      if (picker.index < pPicks.length) setPPicks(pPicks.map((x,i) => i===picker.index ? s.id : x));
                      else setPPicks([...pPicks, s.id].slice(0,15));
                    }
                    setPicker(null); setPickerQ('');
                  }} style={{padding:'12px 0',borderBottom:'1px solid var(--border)',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',opacity:used?0.4:1}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{s.name}</div>
                      <div style={{fontSize:11,color:'var(--text-3)'}}>{s.district} · {s.kind} · {picker.type==='dq'?'到区'+fmtScore(s.mingeDistrict):picker.type==='dx'?'到校'+fmtScore(s.mingeSchool):'统招'+fmtScore(s.score2025)}</div>
                    </div>
                    {used && <span style={{fontSize:11,color:'var(--text-muted)'}}>已选</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Markdown renderer for mobile (simplified)
function renderMd(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // 标题
    .replace(/^### (.+)$/gm, '<div style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--primary)">$1</div>')
    .replace(/^## (.+)$/gm, '<div style="font-size:16px;font-weight:700;margin:16px 0 8px">$1</div>')
    // 分隔线
    .replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:12px 0"/>')
    // 加粗和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em style="color:var(--text-3);font-size:12px">$1</em>')
    // 数字编号列表（1. 2. 3.）— 加段间距
    .replace(/(\d+)\.\s+/g, '<div style="margin:10px 0 4px"><strong style="color:var(--primary)">$1.</strong> ')
    .replace(/(<div style="margin:10px 0 4px">)/g, '</div>$1')
    // 无序列表
    .replace(/\n- /g, '<div style="padding-left:16px;margin:4px 0">• ')
    // 双换行 = 段间距
    .replace(/\n\n/g, '<div style="margin:10px 0"></div>')
    // 单换行
    .replace(/\n/g, '<br/>')
    // 清理开头多余的 </div>
    .replace(/^<\/div>/, '');
}

window.MRecommend = MRecommend;
