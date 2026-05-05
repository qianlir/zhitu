// PAGE 5: About / Data sources
function AboutPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 64px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px' }}>关于本站</h1>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>产品简介</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>
          「上海中考志愿助手」是一款面向上海中考考生和家长的免费工具，帮助用户查询学校信息、对比多校数据、根据估分智能推荐冲/稳/保志愿方案。我们整合了近三年上海市各高中的录取分数线、名额分配、高考成绩等关键数据，力求让志愿填报更科学、更透明。
        </p>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>数据来源</h2>
        <ul style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 2, margin: 0, paddingLeft: 20 }}>
          <li>上海市教育考试院 — 历年中考录取分数线</li>
          <li>各区教育局公示 — 名额分配到区/到校计划</li>
          <li>学校官方网站 — 招生简章、办学特色</li>
          <li>公开媒体报道 — 高考成绩、升学率统计</li>
        </ul>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 12 }}>
          本站数据仅供参考，实际录取以上海市教育考试院公布为准。部分高考成绩数据来自公开渠道，可能存在偏差。
        </p>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>隐私声明</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>
          本站不收集任何个人信息。所有查询和推荐均在服务端即时计算，不保存用户输入数据。
        </p>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>联系我们</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: 0 }}>
          如有数据纠错、功能建议或合作需求，欢迎通过以下方式联系：
        </p>
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span className="pill pill-blue" style={{ padding: '8px 16px' }}>邮箱：87850827@qq.com</span>
          <span className="pill pill-green" style={{ padding: '8px 16px' }}>微信：qianli918</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 32 }}>
        © 2026 <a href="http://qianli.wang" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>千里 qianli.wang</a> · Shanghai
      </div>
    </main>
  );
}
window.AboutPage = AboutPage;
