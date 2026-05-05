function App() {
  const initRoute = () => {
    const h = location.hash.slice(1);
    if (h.startsWith('detail/')) return { route: 'detail', schoolId: h.slice(7) };
    if (['schools','compare','recommend','about'].includes(h)) return { route: h };
    return { route: 'home' };
  };
  const init = initRoute();
  const [route, setRoute] = React.useState(init.route);
  const [schoolId, setSchoolId] = React.useState(init.schoolId || null);
  const [compareIds, setCompareIds] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [prevRoute, setPrevRoute] = React.useState(null);

  const navigate = (r, opts) => {
    if (r === 'detail' && opts && opts.id) {
      setPrevRoute(route);
      setSchoolId(opts.id); setRoute('detail');
      history.pushState({ r, id: opts.id, prev: route }, '', '#detail/' + opts.id);
    }
    else if (r === 'compare' && opts && opts.ids) { setCompareIds(opts.ids); setRoute('compare'); history.pushState({ r }, '', '#compare'); }
    else if (r === 'schools' && opts && opts.q) { setSearchQuery(opts.q); setRoute('schools'); history.pushState({ r, q: opts.q }, '', '#schools'); }
    else { setSearchQuery(''); setRoute(r); history.pushState({ r }, '', r === 'home' ? '#' : '#' + r); }
    window.scrollTo(0, 0);
  };
  const openSchool = (id) => navigate('detail', { id });

  React.useEffect(() => {
    const onPop = (e) => {
      const s = e.state;
      if (s && s.r === 'detail' && s.id) { setSchoolId(s.id); setRoute('detail'); }
      else if (s && s.r) { setRoute(s.r); if (s.q) setSearchQuery(s.q); }
      else { const h = location.hash.slice(1); setRoute(h || 'home'); }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showDetail = route === 'detail';
  const baseRoute = showDetail ? (prevRoute || 'home') : route;

  let basePage;
  switch (baseRoute) {
    case 'home': basePage = <HomePage onNavigate={navigate} onOpenSchool={openSchool} />; break;
    case 'schools': basePage = <SchoolsPage onOpenSchool={openSchool} initialQuery={searchQuery} onNavigate={navigate} />; break;
    case 'compare': basePage = <ComparePage initialIds={compareIds} onOpenSchool={openSchool} onNavigate={navigate} />; break;
    case 'recommend': basePage = <RecommendPage onOpenSchool={openSchool} />; break;
    case 'about': basePage = <AboutPage />; break;
    default: basePage = <HomePage onNavigate={navigate} onOpenSchool={openSchool} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header route={route} onNavigate={navigate} />
      <div style={{ display: showDetail ? 'none' : 'block' }}>{basePage}</div>
      {showDetail && <SchoolDetailPage schoolId={schoolId} onNavigate={navigate} compareIds={compareIds}
        onCompare={(id) => { if (!compareIds.includes(id)) setCompareIds(prev => [...prev, id]); }} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
