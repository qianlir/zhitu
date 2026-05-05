// PAGE 4: 志愿填报助手 — 共用组件

function StepBar({ step, setStep }) {
  const items = [
    { n: 0, label: '基本信息', icon: '📝' },
    { n: 1, label: '名额到区(1)', icon: '🏛️' },
    { n: 2, label: '名额到校(2)', icon: '🏫' },
    { n: 3, label: '平行志愿(15)', icon: '📋' },
  ];
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
      {items.map((s) => {
        const active = step === s.n, done = step > s.n;
        return (
          <button key={s.n} onClick={() => s.n <= step && setStep(s.n)}
            style={{ flex: 1, padding: '12px 8px', borderRadius: 8, border: 'none', cursor: s.n <= step ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'center', transition: 'all 150ms',
              background: active ? 'var(--primary)' : done ? 'var(--primary-50)' : 'var(--bg)',
              color: active ? '#fff' : done ? 'var(--primary)' : 'var(--text-3)',
            }}>
            <div style={{ fontSize: 16 }}>{done ? '✓' : s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: active ? 600 : 500, marginTop: 4 }}>{s.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function PickCard({ school, scoreVal, selected, onToggle, disabled, planCount }) {
  const diff = scoreVal - (window._recScore || 685);
  const tag = diff > 5 ? { t: '冲刺', c: '#dc2626', bg: 'rgba(220,38,38,0.08)' }
            : diff > -3 ? { t: '匹配', c: 'var(--primary)', bg: 'var(--primary-50)' }
            : { t: '保底', c: 'var(--success)', bg: 'rgba(5,150,105,0.08)' };
  const prob = diff > 8 ? '15%' : diff > 3 ? '35%' : diff > -3 ? '65%' : diff > -10 ? '85%' : '95%';

  return (
    <div onClick={() => !disabled && onToggle(school.id)} className="card"
      style={{ padding: 14, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
        borderLeft: '3px solid ' + (selected ? 'var(--primary)' : tag.c),
        background: selected ? 'var(--primary-50)' : '#fff', transition: 'all 120ms' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{school.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{school.district}区 · {school.kind}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: tag.c, background: tag.bg, padding: '2px 6px', borderRadius: 4 }}>{tag.t}</span>
          {selected && <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, marginTop: 4 }}>✓ 已选</div>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-3)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
        <span>录取分 <strong style={{ color: 'var(--text)' }}>{fmtScore(scoreVal)}</strong></span>
        <span>分差 <strong style={{ color: tag.c }}>{diff >= 0 ? '+' : ''}{diff.toFixed(1)}</strong></span>
        <span>概率 <strong style={{ color: tag.c }}>{prob}</strong></span>
        {planCount != null && <span>计划 <strong>{planCount}人</strong></span>}
      </div>
    </div>
  );
}

function BatchHeader({ icon, title, subtitle, rule, picked, max }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 16, borderLeft: '3px solid var(--primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{icon} {title}</h2>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>{picked}/{max}</div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '0 0 8px' }}>{subtitle}</p>
      <div style={{ fontSize: 12, color: 'var(--text-2)', background: 'var(--bg)', borderRadius: 6, padding: '8px 12px', lineHeight: 1.6 }}>
        📋 {rule}
      </div>
    </div>
  );
}

window.StepBar = StepBar;
window.PickCard = PickCard;
window.BatchHeader = BatchHeader;
