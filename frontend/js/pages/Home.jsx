// 分数估名次组件
function RankEstimator() {
  const [score, setScore] = React.useState('');
  const estDR = score ? estimateRank(+score, PUDONG_RANK) : null;
  const estCR = score ? estimateRank(+score, CITY_RANK) : null;
  const tier = score ? tierLabel(+score) : '';
  const cls = score ? tierClass(+score) : '';

  return (
    <div style={{ marginTop: 28, background: '#fff', borderRadius: 12, padding: '20px 24px', maxWidth: 520, margin: '28px auto 0', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-2)' }}>📊 分数估名次</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="number" placeholder="输入中考分数" value={score} onChange={e => setScore(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 16, fontWeight: 600, color: 'var(--primary)', textAlign: 'center' }} />
        {score && estCR && (
          <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>全市排名</div>
              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>~{estCR.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>浦东排名</div>
              <div style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: 18 }}>~{estDR.toLocaleString()}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>定位</div>
              <div><span className={'score-chip ' + cls} style={{ fontSize: 12 }}>{tier}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// PAGE 1: Home / Landing
function HomePage({ onNavigate, onOpenSchool }) {
  const [featured, setFeatured] = React.useState([]);
  const [stats, setStats] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    Promise.all([API.schools({ limit: 6, sort: 'score_desc' }), API.stats()])
      .then(([list, st]) => { setFeatured(list.schools || []); setStats(st); })
      .catch(setErr);
  }, []);

  const onSearch = (e) => {
    e && e.preventDefault();
    onNavigate('schools', query ? { q: query } : undefined);
  };

  return (
    <main>
      {/* Hero */}
      <section style={{ padding: '80px 24px 64px', background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,86,219,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#fff', border: '1px solid var(--border)', borderRadius: 999, fontSize: 12, color: 'var(--text-3)', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--success)' }}></span>
            {stats ? `${stats.latest_year}年最新数据 · ${stats.school_count}所高中覆盖` : '最新数据加载中…'}
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, margin: '0 0 20px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            千里之行，始于<span style={{ color: 'var(--primary)' }}>知途</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-3)', margin: '0 0 40px', lineHeight: 1.6 }}>上海中考 · {stats ? stats.school_count + '所' : ''}高中数据 · AI智能分析</p>

          <form onSubmit={onSearch} style={{ background: '#fff', borderRadius: 12, padding: 6, display: 'flex', boxShadow: 'var(--shadow-md)', maxWidth: 640, margin: '0 auto', border: '1px solid var(--border)' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
              <span style={{ color: 'var(--text-muted)', marginRight: 10 }}>🔍</span>
              <input type="search" placeholder="搜索学校名、区域、特色（如：数学竞赛、寄宿制、浦东）..." value={query} onChange={e => setQuery(e.target.value)} style={{ border: 'none', padding: '12px 0', fontSize: 15, background: 'transparent', width: '100%' }} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">搜索</button>
          </form>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <button className="pill" style={{ cursor: 'pointer', background: '#fff' }} onClick={() => onNavigate('schools')}>📍 按区域</button>
            <button className="pill" style={{ cursor: 'pointer', background: '#fff' }} onClick={() => onNavigate('schools')}>🏆 按类型</button>
            <button className="pill" style={{ cursor: 'pointer', background: '#fff' }} onClick={() => onNavigate('schools')}>📊 按分数段</button>
          </div>

          <RankEstimator />
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="stats-bar" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { n: stats ? stats.school_count : '—', u: '所', l: '高中覆盖', route: 'schools' },
            { n: stats ? stats.year_count : '—', u: '年', l: '历年录取数据', route: 'schools' },
            { n: stats ? stats.latest_year : '—', u: '', l: '最新分数线', route: 'schools' },
            { n: '智能', u: '', l: '志愿建议', route: 'recommend' },
          ].map((s, i) => (
            <div key={i} onClick={() => onNavigate(s.route)} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'opacity 150ms' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>{s.n}<span style={{ fontSize: 18, marginLeft: 4, color: 'var(--text-2)' }}>{s.u}</span></div>
              <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '🔍', title: '学校查询', desc: '输入学校名或关键词，查看详细信息、历年分数线和高考成绩', cta: '查询学校', route: 'schools', color: 'var(--primary)' },
            { icon: '⚖️', title: '多校对比', desc: '选择 2-5 所学校，横向对比录取分数、升学率、学校特色', cta: '开始对比', route: 'compare', color: 'var(--secondary)' },
            { icon: '🎯', title: '志愿推荐', desc: '输入估分和偏好，获取个性化报名策略和冲稳保建议', cta: '获取建议', route: 'recommend', color: 'var(--accent)' },
          ].map((f, i) => (
            <div key={i} className="card card-pad" style={{ padding: 28, transition: 'all 200ms', cursor: 'pointer' }}
                 onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                 onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                 onClick={() => onNavigate(f.route)}>
              <div style={{ width: 44, height: 44, background: f.color + '15', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, margin: '0 0 20px' }}>{f.desc}</p>
              <div style={{ color: f.color, fontSize: 14, fontWeight: 500 }}>{f.cta} →</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular schools */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>热门关注学校</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('schools'); }} style={{ fontSize: 14, color: 'var(--primary)', textDecoration: 'none' }}>查看全部 →</a>
        </div>
        {err ? <ErrorBox err={err} /> :
         !featured.length ? <Loading /> :
         <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
           {featured.map(s => <SchoolCard key={s.id} school={s} onClick={() => onOpenSchool(s.id)} />)}
         </div>}
      </section>
    </main>
  );
}
window.HomePage = HomePage;
