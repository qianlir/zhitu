function App() {
  const initRoute = () => {
    const h = location.hash.slice(1);
    if (h.startsWith("detail/")) return { route: "detail", schoolId: h.slice(7) };
    if (["schools", "compare", "recommend", "about"].includes(h)) return { route: h };
    return { route: "home" };
  };
  const init = initRoute();
  const [route, setRoute] = React.useState(init.route);
  const [schoolId, setSchoolId] = React.useState(init.schoolId || null);
  const [compareIds, setCompareIds] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [prevRoute, setPrevRoute] = React.useState(null);
  const navigate = (r, opts) => {
    if (r === "detail" && opts && opts.id) {
      setPrevRoute(route);
      setSchoolId(opts.id);
      setRoute("detail");
      history.pushState({ r, id: opts.id, prev: route }, "", "#detail/" + opts.id);
    } else if (r === "compare" && opts && opts.ids) {
      setCompareIds(opts.ids);
      setRoute("compare");
      history.pushState({ r }, "", "#compare");
    } else if (r === "schools" && opts && opts.q) {
      setSearchQuery(opts.q);
      setRoute("schools");
      history.pushState({ r, q: opts.q }, "", "#schools");
    } else {
      setSearchQuery("");
      setRoute(r);
      history.pushState({ r }, "", r === "home" ? "#" : "#" + r);
    }
    window.scrollTo(0, 0);
  };
  const openSchool = (id) => navigate("detail", { id });
  React.useEffect(() => {
    const onPop = (e) => {
      const s = e.state;
      if (s && s.r === "detail" && s.id) {
        setSchoolId(s.id);
        setRoute("detail");
      } else if (s && s.r) {
        setRoute(s.r);
        if (s.q) setSearchQuery(s.q);
      } else {
        const h = location.hash.slice(1);
        setRoute(h || "home");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  const showDetail = route === "detail";
  const baseRoute = showDetail ? prevRoute || "home" : route;
  let basePage;
  switch (baseRoute) {
    case "home":
      basePage = /* @__PURE__ */ React.createElement(HomePage, { onNavigate: navigate, onOpenSchool: openSchool });
      break;
    case "schools":
      basePage = /* @__PURE__ */ React.createElement(SchoolsPage, { onOpenSchool: openSchool, initialQuery: searchQuery, onNavigate: navigate });
      break;
    case "compare":
      basePage = /* @__PURE__ */ React.createElement(ComparePage, { initialIds: compareIds, onOpenSchool: openSchool, onNavigate: navigate });
      break;
    case "recommend":
      basePage = /* @__PURE__ */ React.createElement(RecommendPage, { onOpenSchool: openSchool });
      break;
    case "about":
      basePage = /* @__PURE__ */ React.createElement(AboutPage, null);
      break;
    default:
      basePage = /* @__PURE__ */ React.createElement(HomePage, { onNavigate: navigate, onOpenSchool: openSchool });
  }
  return /* @__PURE__ */ React.createElement("div", { style: { minHeight: "100vh", background: "var(--bg)" } }, /* @__PURE__ */ React.createElement(Header, { route, onNavigate: navigate }), /* @__PURE__ */ React.createElement("div", { style: { display: showDetail ? "none" : "block" } }, basePage), showDetail && /* @__PURE__ */ React.createElement(
    SchoolDetailPage,
    {
      schoolId,
      onNavigate: navigate,
      compareIds,
      onCompare: (id) => {
        if (!compareIds.includes(id)) setCompareIds((prev) => [...prev, id]);
      }
    }
  ));
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: 20, color: "red", whiteSpace: "pre-wrap", fontFamily: "monospace" } }, "React Error: " + this.state.error.message + "\n" + (this.state.error.stack || ""));
    }
    return this.props.children;
  }
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(ErrorBoundary, null, /* @__PURE__ */ React.createElement(App, null)));
