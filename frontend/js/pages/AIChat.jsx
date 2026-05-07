function renderMd(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/### (.+)/g, '<div style="font-size:15px;font-weight:700;margin:14px 0 6px;color:var(--text)">$1</div>')
    .replace(/## (.+)/g, '<div style="font-size:16px;font-weight:700;margin:16px 0 8px;color:var(--text)">$1</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- /g, '\n• ')
    .replace(/\n(\d+)\. /g, '\n$1. ')
    .replace(/\n/g, '<br/>');
}

function getFollowUps(messages, score, tdPick, pPicks) {
  const count = messages.filter(m => m.role === 'user').length;
  if (pPicks.length > 0) {
    return [
      '分析当前方案的风险',
      '如果考低10分怎么办？',
      '帮我优化平行志愿顺序',
      '到区该冲四校吗？',
    ];
  }
  if (count <= 1) {
    return [
      '帮我生成一套完整方案',
      '我想冲四校，有机会吗？',
      '哪些学校离浦东最近？',
      '建平和进才该选哪个？',
    ];
  }
  return [
    '帮我生成方案',
    '还有其他推荐吗？',
    '这个方案风险大吗？',
  ];
}

// AIChat: Step 1 — AI 主导对话，收集信息后生成方案
function AIChat({ score, district, districtRank, cityRank, tdPick, setTdPick, tsPicks, setTsPicks, pPicks, setPPicks, tdList, tsList, pList, onDone, onBack, allSchools }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);
  const chatRef = React.useRef(null);

  const getS = id => allSchools.find(s => s.id === id);

  const generateDefault = () => {
    const td = tdList.find(s => (s.mingeDistrict || 999) <= score + 8);
    if (td) setTdPick(td.id);
    const ts = tsList.filter(s => (s.mingeSchool || 999) <= score + 5).slice(0, 2);
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
    setGenerated(true);
  };

  const executeActions = (text) => {
    let cleanText = text;
    const actionRegex = /\[([A-Z_]+):([^\]]*)\]/g;
    let match;
    const actions = [];
    while ((match = actionRegex.exec(text)) !== null) {
      actions.push({ cmd: match[1], args: match[2] });
    }
    cleanText = text.replace(actionRegex, '').trim();

    actions.forEach(({ cmd, args }) => {
      const ids = args.split(',').map(s => s.trim());
      switch (cmd) {
        case 'SET_DQ': if (getS(ids[0])) setTdPick(ids[0]); break;
        case 'SET_DX': setTsPicks(ids.filter(id => getS(id)).slice(0, 2)); break;
        case 'SET_PX': setPPicks(ids.filter(id => getS(id)).slice(0, 15)); break;
        case 'ADD_PX': setPPicks(prev => [...prev, ...ids.filter(id => getS(id) && !prev.includes(id))].slice(0, 15)); break;
        case 'REPLACE_PX':
          const [oldId, newId] = args.split('>').map(s => s.trim());
          if (oldId && newId && getS(newId)) setPPicks(prev => prev.map(id => id === oldId ? newId : id));
          break;
        case 'REMOVE_PX': setPPicks(prev => prev.filter(id => !ids.includes(id))); break;
      }
    });
    return { cleanText, hasActions: actions.length > 0 };
  };

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setHasNewInput(true);
    setLoading(true);

    try {
      const tdSchool = tdPick ? getS(tdPick) : null;
      const dxSchools = tsPicks.map(getS).filter(Boolean);
      const pSchools = pPicks.map(getS).filter(Boolean);

      // 构建到区/到校/平行三类可选学校列表
      const dqContext = tdList.slice(0, 20).map(s =>
        `${s.id}|${s.name}|${s.district}|到区${s.mingeDistrict || '-'}`
      ).join('\n');
      const dxContext = tsList.slice(0, 15).map(s =>
        `${s.id}|${s.name}|${s.district}|到校${s.mingeSchool || '-'}`
      ).join('\n');
      const pxContext = pList.slice(0, 40).map(s =>
        `${s.id}|${s.name}|${s.district}|${s.kind}|统招${s.score2025}|一本率${s.bbenRate}%`
      ).join('\n');

      const payload = {
        score, district, district_rank: districtRank || 0, risk: 'balanced',
        preferences: {
          home_district: district,
          notes: `用户消息: ${userMsg}

当前方案: 到区=${tdSchool?.name || '未选'}, 到校=${dxSchools.map(s => s.name).join('、') || '未选'}, 平行(${pSchools.length}/15)=${pSchools.map((s, i) => (i + 1) + '.' + s.name).join(' ') || '未选'}
排名: ${district}区约第${districtRank || '?'}名, 全市约第${cityRank || '?'}名

【名额到区可选学校】(选1个冲刺)
${dqContext}

【名额到校可选学校】(选2个，限${district}区内)
${dxContext}

【平行志愿可选学校】(必须选满15个! 冲4+稳6+保5，从高到低排列)
${pxContext}

【重要规则】
1. 每次回复末尾必须输出完整方案指令:
[SET_DQ:school_id]
[SET_DX:id1,id2]
[SET_PX:id1,id2,id3,id4,id5,id6,id7,id8,id9,id10,id11,id12,id13,id14,id15]
2. 平行志愿必须恰好15个school_id，不能少！宁可多加保底也不留空
3. 学校可以重复！到区/到校选的学校在平行志愿中可以再次出现（不同批次互不影响）`,
        },
      };

      let fullText = '';
      for await (const chunk of API.analyzeStream(payload)) {
        fullText += chunk;
        setMessages(prev => {
          const copy = [...prev];
          const lastMsg = copy[copy.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg._streaming) {
            copy[copy.length - 1] = { ...lastMsg, content: fullText };
          } else {
            copy.push({ role: 'assistant', content: fullText, _streaming: true });
          }
          return copy;
        });
      }
      const { cleanText, hasActions } = executeActions(fullText);
      const display = hasActions ? cleanText + '\n\n✅ 已更新志愿表' : cleanText;
      setMessages(prev => {
        const copy = prev.filter(m => !m._streaming);
        copy.push({ role: 'assistant', content: display });
        return copy;
      });
      if (hasActions) setGenerated(true);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，暂时无法回答。请稍后再试。' }]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const [hasNewInput, setHasNewInput] = React.useState(false);

  React.useEffect(() => {
    // 自动生成第一版方案
    generateDefault();
    setGenerated(true);
    setMessages([{
      role: 'assistant',
      content: `你好，家长！我是你的中考志愿填报顾问 🎓

📊 **${score} 分 · ${district}区 · ${tierLabel(score)}**
${districtRank ? '📍 ' + district + '区排名约第 **' + districtRank + '** 名' : ''}
${cityRank ? '🏙️ 全市排名约第 **' + cityRank + '** 名' : ''}

已基于往年分数线生成初始方案（右侧查看）。你可以：
- 告诉我你的**偏好**（寄宿/离家近/学校特色等）
- 告诉我**区排名**，我会重新调整
- 问我任何学校的录取分析
- 修改完后点击下方 **「AI生成志愿」** 生成最终方案`
    }]);
  }, []);

  const quickActions = [
    { label: '调整为更激进的冲刺策略', action: () => sendMessage('帮我调整为更激进的策略，多冲几个好学校') },
    { label: '调整为更稳妥的保底策略', action: () => sendMessage('帮我调整为更稳妥的策略，增加保底学校') },
    { label: '我知道区排名', action: () => setInput('我的区排名大约是') },
  ];

  const totalPicked = (tdPick ? 1 : 0) + tsPicks.length + pPicks.length;

  return (
    <div className="chat-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, minHeight: 600 }}>
      {/* Left: Chat */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #1a56db, #0694a2)', color: '#fff' }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>🎓 AI 志愿顾问</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{score} 分 · {district}区 · {tierLabel(score)} · 对话中会实时更新右侧方案</div>
        </div>

        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', maxHeight: 480 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 14, display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '12px 16px', borderRadius: 14, fontSize: 14, lineHeight: 1.8,
                background: msg.role === 'user' ? 'var(--primary)' : '#f1f5f9',
                color: msg.role === 'user' ? '#fff' : 'var(--text)',
                borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                borderBottomLeftRadius: msg.role === 'user' ? 14 : 4,
              }}
                dangerouslySetInnerHTML={{ __html: msg.role === 'user' ? msg.content : renderMd(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: 14, fontSize: 14, color: 'var(--text-3)', display: 'inline-block' }}>
              正在分析...
            </div>
          )}
          {/* Follow-up suggestions after AI reply */}
          {!loading && messages.length > 1 && messages[messages.length - 1]?.role === 'assistant' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {getFollowUps(messages, score, tdPick, pPicks).map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  style={{ padding: '6px 12px', fontSize: 11, background: '#fff', border: '1px solid var(--border)', borderRadius: 999, cursor: 'pointer', color: 'var(--text-2)', fontFamily: 'inherit' }}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {quickActions.map((q, i) => (
              <button key={i} onClick={q.action}
                style={{ padding: '8px 14px', fontSize: 12, background: q.primary ? 'var(--primary-50)' : 'var(--bg)', border: '1px solid ' + (q.primary ? 'var(--primary)' : 'var(--border)'), borderRadius: 999, cursor: 'pointer', color: q.primary ? 'var(--primary)' : 'var(--text-2)', fontFamily: 'inherit', fontWeight: q.primary ? 600 : 400 }}>
                {q.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="告诉我偏好、问学校、或要求调整..."
              style={{ flex: 1, fontSize: 14, padding: '12px 16px', borderRadius: 999 }} />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
                background: input.trim() ? 'var(--primary)' : 'var(--bg)',
                color: input.trim() ? '#fff' : 'var(--text-muted)',
                cursor: input.trim() ? 'pointer' : 'default', fontSize: 16 }}>↑</button>
          </div>
          <button onClick={() => sendMessage('根据我们的对话内容和我的偏好，重新生成一套完整的志愿方案。到区1个、到校2个、平行志愿必须15个。')}
            disabled={loading || !hasNewInput}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: hasNewInput && !loading ? 'pointer' : 'not-allowed',
              background: hasNewInput && !loading ? 'linear-gradient(135deg, #1a56db, #0694a2)' : 'var(--bg)',
              color: hasNewInput && !loading ? '#fff' : 'var(--text-muted)' }}>
            🎓 AI 生成志愿方案（到区1 + 到校2 + 平行15）
          </button>
        </div>
      </div>

      {/* Right: Live plan preview */}
      <div style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
        <div className="card card-pad" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>📋 实时方案</h3>
            <span style={{ fontSize: 13, fontWeight: 600, color: totalPicked >= 18 ? 'var(--success)' : totalPicked > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>{totalPicked}/18</span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>名额到区 (1)</div>
            {tdPick ? <MiniSchoolRow school={getS(tdPick)} refScore={getS(tdPick)?.mingeDistrict} score={score} /> : <EmptySlot />}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>名额到校 (2)</div>
            {tsPicks.length > 0 ? tsPicks.map(id => <MiniSchoolRow key={id} school={getS(id)} refScore={getS(id)?.mingeSchool} score={score} />) : <EmptySlot />}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>平行志愿 ({pPicks.length}/15)</div>
            {pPicks.length > 0 ? (
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {pPicks.map((id, i) => <MiniSchoolRow key={id} school={getS(id)} refScore={getS(id)?.score2025} score={score} idx={i + 1} />)}
              </div>
            ) : <EmptySlot />}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={onBack} style={{ flex: 1 }}>← 修改信息</button>
          <button className="btn btn-primary" onClick={onDone} style={{ flex: 1 }} disabled={totalPicked === 0}>
            查看方案 →
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniSchoolRow({ school, refScore, score, idx }) {
  if (!school) return null;
  const diff = (refScore || school.score2025) - score;
  const r = diff > 5 ? { t: '冲', c: '#dc2626' } : diff > -3 ? { t: '稳', c: 'var(--primary)' } : { t: '保', c: 'var(--success)' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', fontSize: 12, borderBottom: '1px solid var(--border)' }}>
      {idx && <span style={{ color: 'var(--text-muted)', width: 18, fontVariantNumeric: 'tabular-nums' }}>{idx}.</span>}
      <span style={{ flex: 1, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.name}</span>
      <span style={{ color: r.c, fontWeight: 600, fontSize: 10 }}>{r.t}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-3)', fontSize: 11 }}>{fmtScore(refScore || school.score2025)}</span>
    </div>
  );
}

function EmptySlot() {
  return <div style={{ padding: '8px 10px', color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>待生成...</div>;
}

window.AIChat = AIChat;
window.MiniSchoolRow = MiniSchoolRow;
window.EmptySlot = EmptySlot;
