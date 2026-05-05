// Mobile About
function MAbout({ onBack }) {
  return (
    <div>
      <MNav title="关于" onBack={onBack} />
      <div className="mp">
        <div className="mc">
          <h2 style={{fontSize:18,fontWeight:600,margin:'0 0 8px'}}>千里·知途</h2>
          <p style={{fontSize:14,color:'var(--text-2)',lineHeight:1.7,margin:0}}>上海中考志愿填报助手。整合历年录取数据，AI 智能推荐志愿方案。</p>
        </div>
        <div className="mc">
          <h3 style={{fontSize:15,fontWeight:600,margin:'0 0 8px'}}>数据来源</h3>
          <ul style={{fontSize:13,color:'var(--text-2)',lineHeight:1.8,margin:0,paddingLeft:18}}>
            <li>上海市教育考试院</li><li>各区教育局公示</li><li>学校官方网站</li>
          </ul>
        </div>
        <div className="mc">
          <h3 style={{fontSize:15,fontWeight:600,margin:'0 0 8px'}}>联系我们</h3>
          <p style={{fontSize:13,color:'var(--text-2)',lineHeight:1.7,margin:'0 0 10px'}}>数据纠错、功能建议或合作需求：</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <span style={{padding:'6px 12px',borderRadius:999,fontSize:13,background:'var(--primary-50)',color:'var(--primary)'}}>邮箱：87850827@qq.com</span>
            <span style={{padding:'6px 12px',borderRadius:999,fontSize:13,background:'var(--success-50)',color:'var(--success)'}}>微信：qianli918</span>
          </div>
        </div>
        <div className="mc" style={{background:'rgba(217,119,6,0.06)',border:'1px solid rgba(217,119,6,0.2)'}}>
          <div style={{fontSize:14,fontWeight:600,color:'#92400e',marginBottom:4}}>⚠️ 重要提示</div>
          <div style={{fontSize:13,color:'#78350f',lineHeight:1.7}}>本工具仅供参考，最终以教育考试院公布为准。</div>
        </div>
        <div style={{textAlign:'center',fontSize:11,color:'var(--text-muted)',marginTop:16}}>© 2026 千里 qianli.wang</div>
      </div>
    </div>
  );
}
window.MAbout = MAbout;
