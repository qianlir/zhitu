function Step0({ score, setScore, district, setDistrict, generate, tdCount, tsCount, pCount, districtRank, setDistrictRank, cityRank, setCityRank }) {
  const estDistrictRank = React.useMemo(() => estimateRank(score, PUDONG_RANK), [score]);
  const estCityRank = React.useMemo(() => estimateRank(score, CITY_RANK), [score]);
  const [rankOverridden, setRankOverridden] = React.useState(false);
  React.useEffect(() => {
    if (districtRank === null) setDistrictRank(estDistrictRank);
    if (cityRank === null) setCityRank(estCityRank);
  }, []);
  React.useEffect(() => {
    if (!rankOverridden) {
      setDistrictRank(estDistrictRank);
      setCityRank(estCityRank);
    }
  }, [score]);
  const handleRankChange = (setter, value) => {
    setter(value);
    setRankOverridden(true);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "card card-pad", style: { maxWidth: 760, margin: "0 auto", padding: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 16, background: "linear-gradient(135deg, var(--primary-50), rgba(6,148,162,0.06))", borderRadius: 8, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 15, fontWeight: 600, margin: "0 0 8px" } }, "\u4E0A\u6D77\u4E2D\u8003\u5FD7\u613F\u5F55\u53D6\u6279\u6B21"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "#fff", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "var(--primary)" } }, "\u540D\u989D\u5230\u533A"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-3)", marginTop: 2 } }, "\u586B1\u4E2A\u5FD7\u613F \xB7 \u59D4\u5C5E/\u5E02\u91CD\u70B9\u5206\u5230\u5404\u533A")), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "#fff", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "var(--secondary)" } }, "\u540D\u989D\u5230\u6821"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-3)", marginTop: 2 } }, "\u586B2\u4E2A\u5FD7\u613F \xB7 \u5206\u5230\u521D\u4E2D\u5B66\u6821")), /* @__PURE__ */ React.createElement("div", { style: { padding: 10, background: "#fff", borderRadius: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 600, color: "var(--accent)" } }, "\u7EDF\u62DB\u5E73\u884C"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-3)", marginTop: 2 } }, "\u586B15\u4E2A\u5FD7\u613F \xB7 \u5206\u6570\u4F18\u5148\u533A\u5185\u7ADE\u4E89")))), /* @__PURE__ */ React.createElement("div", { className: "step0-inputs", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 } }, "\u4E2D\u8003\u6210\u7EE9 (\u6EE1\u5206750)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: score,
      onChange: (e) => {
        setScore(+e.target.value);
        setRankOverridden(false);
      },
      min: 500,
      max: 750,
      style: { fontSize: 28, fontWeight: 700, padding: "8px 14px", width: "100%", color: "var(--primary)", fontVariantNumeric: "tabular-nums" }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: 550,
      max: 720,
      step: 0.5,
      value: score,
      onChange: (e) => {
        setScore(+e.target.value);
        setRankOverridden(false);
      },
      style: { width: "100%", marginTop: 8, accentColor: "var(--primary)" }
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 600, color: "var(--text-3)", display: "block", marginBottom: 6 } }, "\u6240\u5728\u533A"), /* @__PURE__ */ React.createElement("select", { value: district, onChange: (e) => setDistrict(e.target.value), style: { fontSize: 15, padding: "12px 16px" } }, SH_DISTRICTS.map((d) => /* @__PURE__ */ React.createElement("option", { key: d, value: d }, d, "\u533A"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12 } }, /* @__PURE__ */ React.createElement("span", null, "\u5B9A\u4F4D\uFF1A"), /* @__PURE__ */ React.createElement("span", { className: "score-chip " + tierClass(score) }, tierLabel(score))))), /* @__PURE__ */ React.createElement("div", { style: { padding: 20, background: "var(--bg)", borderRadius: 8, marginBottom: 24, border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("h4", { style: { fontSize: 14, fontWeight: 600, margin: 0 } }, "\u{1F4CA} \u6392\u540D\u4F30\u7B97"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: rankOverridden ? "var(--accent)" : "var(--text-3)" } }, rankOverridden ? "\u5DF2\u624B\u52A8\u4FEE\u6539" : "\u57FA\u4E8E\u5F80\u5E74\u4E00\u5206\u4E00\u6BB5\u8868\u63A8\u7B97")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 6 } }, district, "\u533A\u6392\u540D", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--danger)", marginLeft: 4 } }, "\u2B50 \u6838\u5FC3\u6307\u6807")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u7EA6\u7B2C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: districtRank || "",
      onChange: (e) => handleRankChange(setDistrictRank, +e.target.value),
      min: 1,
      style: { fontSize: 20, fontWeight: 700, padding: "6px 12px", width: 120, color: "var(--primary)", fontVariantNumeric: "tabular-nums", textAlign: "center" }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u540D")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 } }, "\u5F80\u5E74 ", score, " \u5206 \u2248 ", district, "\u533A\u7B2C ", estDistrictRank, " \u540D")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, color: "var(--text-3)", display: "block", marginBottom: 6 } }, "\u5168\u5E02\u6392\u540D", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)", marginLeft: 4 } }, "\u2B50 \u91CD\u8981")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u7EA6\u7B2C"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      value: cityRank || "",
      onChange: (e) => handleRankChange(setCityRank, +e.target.value),
      min: 1,
      style: { fontSize: 20, fontWeight: 700, padding: "6px 12px", width: 120, color: "var(--secondary)", fontVariantNumeric: "tabular-nums", textAlign: "center" }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: "var(--text-3)" } }, "\u540D")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, color: "var(--text-muted)", marginTop: 4 } }, "\u5F80\u5E74 ", score, " \u5206 \u2248 \u5168\u5E02\u7B2C ", estCityRank, " \u540D"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: "10px 14px", background: "rgba(217,119,6,0.06)", borderRadius: 6, fontSize: 12, color: "#92400e", lineHeight: 1.6 } }, "\u{1F4A1} ", /* @__PURE__ */ React.createElement("strong", null, "\u5982\u679C\u4F60\u89C9\u5F97\u4ECA\u5E74\u8BD5\u9898\u504F\u96BE/\u504F\u7B80\u5355"), "\uFF0C\u53EF\u4EE5\u624B\u52A8\u8C03\u6574\u6392\u540D\u3002\u4F8B\u5982\u4F60\u89C9\u5F97\u4ECA\u5E74\u504F\u96BE\u3001\u540C\u5206\u6392\u540D\u5E94\u8BE5\u66F4\u9760\u524D\uFF0C\u5C31\u628A\u6392\u540D\u6570\u5B57\u6539\u5C0F\u3002\u6392\u540D\u76F4\u63A5\u51B3\u5B9A\u5E73\u884C\u5FD7\u613F\u7684\u5F55\u53D6\u7ED3\u679C\u3002")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--primary)" } }, tdCount), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "\u53EF\u9009\u5230\u533A\u5B66\u6821")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--secondary)" } }, tsCount), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "\u53EF\u9009\u5230\u6821\u5B66\u6821")), /* @__PURE__ */ React.createElement("div", { style: { padding: 12, background: "#fff", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, fontWeight: 700, color: "var(--accent)" } }, pCount), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "var(--text-3)" } }, "\u53EF\u9009\u5E73\u884C\u5FD7\u613F"))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary btn-lg", style: { width: "100%", fontSize: 16 }, onClick: generate }, "\u5F00\u59CB AI \u5FD7\u613F\u5206\u6790 \u2192"), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, fontSize: 11, color: "var(--text-3)", textAlign: "center" } }, "AI \u987E\u95EE\u4F1A\u6839\u636E\u4F60\u7684\u5206\u6570\u548C\u6392\u540D\uFF0C\u7ED3\u5408\u5F80\u5E74\u6570\u636E\u8FDB\u884C\u5206\u6790\u5E76\u63A8\u8350\u65B9\u6848"));
}
window.Step0 = Step0;
