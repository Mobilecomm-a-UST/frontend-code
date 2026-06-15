// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     CircularProgress,
//     Paper,
//     TextField,
//     IconButton,
//     Tooltip as MuiTooltip,
//     Alert,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import SignalCellularAltIcon   from "@mui/icons-material/SignalCellularAlt";
// import BarChartIcon            from "@mui/icons-material/BarChart";
// import RefreshIcon             from "@mui/icons-material/Refresh";
// import { useNavigate } from "react-router-dom";
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     LabelList,
// } from "recharts";

// import { postData } from "../../../services/FetchNodeServices";

// // ── Month Helpers ─────────────────────────────────────────────────────────────
// const getCurrentMonthStr = () =>
//     new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

// const inputToApiMonth = (val) => {
//     if (!val) return getCurrentMonthStr();
//     const [year, month] = val.split("-");
//     return new Date(Number(year), Number(month) - 1, 1)
//         .toLocaleDateString("en-US", { month: "short", year: "numeric" });
// };

// const apiMonthToInput = (str) => {
//     if (!str) return "";
//     const d = new Date(str);
//     if (isNaN(d)) return "";
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// /** Given two "YYYY-MM" strings, return all months in between (inclusive), max 4 */
// const getMonthRange = (from, to) => {
//     if (!from || !to) return from ? [from] : [];
//     const [fy, fm] = from.split("-").map(Number);
//     const [ty, tm] = to.split("-").map(Number);
//     const months = [];
//     let y = fy, m = fm;
//     while ((y < ty) || (y === ty && m <= tm)) {
//         months.push(`${y}-${String(m).padStart(2, "0")}`);
//         if (months.length >= 4) break;
//         m++;
//         if (m > 12) { m = 1; y++; }
//     }
//     return months;
// };

// // ── Constants ─────────────────────────────────────────────────────────────────
// const METRIC_TABS = [
//     { key: "performance", label: "Performance" },
//     { key: "offered",     label: "Offered" },
// ];

// const TECH_TABS = [
//     { key: "4G",    label: "4G" },
//     { key: "5G",    label: "5G" },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// const TECH_COLORS = {
//     "4G":    { active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", tabColor: "#1e3c72" },
//     "5G":    { active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)", tabColor: "#134e5e" },
//     "4G+5G": { active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)", tabColor: "#41295a" },
// };

// const METRIC_THEME = {
//     performance: {
//         active:    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         tabColor:  "#1e3c72",
//         chartFrom: "#1e3c72",
//         chartTo:   "#2a5298",
//         icon: <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "SCFT Aging — Performance",
//     },
//     offered: {
//         active:    "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         tabColor:  "#134e5e",
//         chartFrom: "#134e5e",
//         chartTo:   "#71b280",
//         icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "SCFT Aging — Offered",
//     },
// };

// /**
//  * 10 visually distinct, high-contrast colors — one per possible series/month.
//  * Each has a "from" and "to" for the gradient bar fill.
//  */
// const SERIES_COLORS = [
//     { from: "#1565C0", to: "#42A5F5", solid: "#1976D2" },  // Blue
//     { from: "#2E7D32", to: "#66BB6A", solid: "#388E3C" },  // Green
//     { from: "#E65100", to: "#FFA726", solid: "#F57C00" },  // Orange
//     { from: "#6A1B9A", to: "#CE93D8", solid: "#7B1FA2" },  // Purple
//     { from: "#00695C", to: "#4DB6AC", solid: "#00796B" },  // Teal
//     { from: "#C62828", to: "#EF9A9A", solid: "#D32F2F" },  // Red
//     { from: "#F9A825", to: "#FFF176", solid: "#F9A825" },  // Yellow
//     { from: "#00838F", to: "#80DEEA", solid: "#0097A7" },  // Cyan
//     { from: "#4527A0", to: "#B39DDB", solid: "#512DA8" },  // Deep Purple
//     { from: "#558B2F", to: "#AED581", solid: "#689F38" },  // Light Green
// ];

// // ── Data Transform ────────────────────────────────────────────────────────────
// const transformGraphData = (techData) => {
//     if (!techData) return { chartData: [], seriesNames: [] };
//     const { categories = [], series = [] } = techData;
//     const chartData = categories.map((cat, catIdx) => {
//         const entry = { category: cat };
//         series.forEach((s) => { entry[s.name] = s.data?.[catIdx] ?? 0; });
//         return entry;
//     });
//     return { chartData, seriesNames: series.map((s) => s.name) };
// };

// // ── Merge multiple API responses into one unified graph_data ─────────────────
// const mergeResponses = (responses) => {
//     if (!responses || responses.length === 0) return null;
//     const valid = responses.filter(Boolean);
//     if (valid.length === 0) return null;

//     const merged = {
//         status: true,
//         layer:  valid[0].layer,
//         graph_data: {},
//     };

//     ["4G", "5G", "4G+5G"].forEach((tech) => {
//         const allSeries = [];
//         let categories = [];
//         valid.forEach((res) => {
//             const techData = res?.graph_data?.[tech];
//             if (!techData) return;
//             if (techData.categories?.length > 0) categories = techData.categories;
//             if (techData.series?.length > 0) allSeries.push(...techData.series);
//         });
//         // Deduplicate by series name (keep last)
//         const seen = new Map();
//         allSeries.forEach((s) => seen.set(s.name, s));
//         merged.graph_data[tech] = {
//             categories,
//             series: Array.from(seen.values()),
//         };
//     });
//     return merged;
// };

// // ── Custom Tooltip ────────────────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//         <Paper elevation={4} sx={{ p: 1.5, minWidth: 190, borderRadius: 2, border: "1px solid #e0e0e0" }}>
//             <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
//                 {label}
//             </Typography>
//             {payload.map((entry) => (
//                 <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.3}>
//                     <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: entry.fill, flexShrink: 0 }} />
//                     <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
//                     <Typography variant="caption" fontWeight={700}>{entry.value}%</Typography>
//                 </Box>
//             ))}
//         </Paper>
//     );
// };

// // ── Chart Panel ───────────────────────────────────────────────────────────────
// const ScftChart = ({ title, icon, gradientFrom, gradientTo, chartData, seriesNames, loading, seriesInfo }) => {
//     const chartId = title.replace(/[\s—]+/g, "_");
//     return (
//         <Box sx={{ borderRadius: 2, border: "1px solid #e0e0e0", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
//             {/* Header */}
//             <Box
//                 sx={{
//                     background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
//                     px: 2.5, py: 1.5,
//                     display: "flex", alignItems: "center", justifyContent: "space-between",
//                     flexWrap: "wrap", gap: 1,
//                 }}
//             >
//                 <Box display="flex" alignItems="center" gap={1}>
//                     {icon}
//                     <Typography variant="subtitle1" fontWeight={700} color="#fff">{title}</Typography>
//                 </Box>
//                 {/* Series date chips in header */}
//                 <Box display="flex" gap={0.8} flexWrap="wrap">
//                     {seriesInfo?.map((s, i) => (
//                         <Chip
//                             key={s.name}
//                             label={`${s.name}  (${s.start} → ${s.end})`}
//                             size="small"
//                             sx={{
//                                 background: SERIES_COLORS[i % SERIES_COLORS.length].solid + "55",
//                                 color: "#fff",
//                                 fontWeight: 600,
//                                 fontSize: 10,
//                                 border: `1px solid ${SERIES_COLORS[i % SERIES_COLORS.length].solid}99`,
//                             }}
//                         />
//                     ))}
//                 </Box>
//             </Box>

//             {/* Body */}
//             <Box sx={{ p: 2, background: "#fafafa", minHeight: 340 }}>
//                 {loading ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
//                         <CircularProgress size={36} />
//                     </Box>
//                 ) : chartData.length === 0 ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
//                         <Typography color="text.secondary" fontSize={14}>No Data Available</Typography>
//                     </Box>
//                 ) : (
//                     <ResponsiveContainer width="100%" height={360}>
//                         <BarChart
//                             data={chartData}
//                             margin={{ top: 22, right: 16, left: 0, bottom: 10 }}
//                             barCategoryGap="22%"
//                             barGap={3}
//                         >
//                             <defs>
//                                 {seriesNames.map((name, i) => {
//                                     const clr = SERIES_COLORS[i % SERIES_COLORS.length];
//                                     return (
//                                         <linearGradient key={name} id={`grad_${chartId}_${i}`} x1="0" y1="0" x2="0" y2="1">
//                                             <stop offset="0%"   stopColor={clr.from} stopOpacity={1} />
//                                             <stop offset="100%" stopColor={clr.to}   stopOpacity={0.8} />
//                                         </linearGradient>
//                                     );
//                                 })}
//                             </defs>
//                             <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
//                             <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} />
//                             <YAxis tick={{ fontSize: 11, fill: "#555" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
//                             <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
//                             <Legend
//                                 wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
//                                 iconType="circle"
//                                 iconSize={9}
//                                 formatter={(value) => (
//                                     <span style={{ color: SERIES_COLORS[seriesNames.indexOf(value) % SERIES_COLORS.length].solid, fontWeight: 600 }}>
//                                         {value}
//                                     </span>
//                                 )}
//                             />
//                             {seriesNames.map((name, i) => (
//                                 <Bar key={name} dataKey={name} fill={`url(#grad_${chartId}_${i})`} radius={[4, 4, 0, 0]} maxBarSize={32}>
//                                     <LabelList
//                                         dataKey={name}
//                                         position="top"
//                                         formatter={(v) => (v > 0 ? `${v}` : "")}
//                                         style={{ fontSize: 9, fill: SERIES_COLORS[i % SERIES_COLORS.length].solid, fontWeight: 700 }}
//                                     />
//                                 </Bar>
//                             ))}
//                         </BarChart>
//                     </ResponsiveContainer>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// // ── Month Range Picker ────────────────────────────────────────────────────────
// const MonthRangePicker = ({ fromMonth, toMonth, onFromChange, onToChange, maxMonth }) => {
//     const monthCount = getMonthRange(fromMonth, toMonth).length;
//     const isOverLimit = monthCount > 4;
//     const isEmpty = !fromMonth || !toMonth;

//     return (
//         <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//             <TextField
//                 size="small"
//                 label="From"
//                 type="month"
//                 value={fromMonth}
//                 onChange={(e) => onFromChange(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{ max: maxMonth }}
//                 sx={{ minWidth: 150 }}
//             />
//             <Typography variant="body2" color="text.secondary" fontWeight={600}>→</Typography>
//             <TextField
//                 size="small"
//                 label="To"
//                 type="month"
//                 value={toMonth}
//                 onChange={(e) => onToChange(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{ min: fromMonth, max: maxMonth }}
//                 sx={{ minWidth: 150 }}
//             />
//             {!isEmpty && (
//                 <Chip
//                     label={isOverLimit ? "Max 4 months" : `${monthCount} month${monthCount > 1 ? "s" : ""}`}
//                     size="small"
//                     color={isOverLimit ? "error" : "primary"}
//                     variant={isOverLimit ? "filled" : "outlined"}
//                     sx={{ fontWeight: 700, fontSize: 11 }}
//                 />
//             )}
//         </Box>
//     );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const SCFT_Aging_Graph = () => {
//     const navigate = useNavigate();

//     const [activeMetric, setActiveMetric] = useState("performance");
//     const [activeTech,   setActiveTech]   = useState("4G");

//     const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
//     const [fromMonth, setFromMonth] = useState(currentMonthInput);
//     const [toMonth,   setToMonth]   = useState(currentMonthInput);

//     const [performanceData, setPerformanceData] = useState(null);
//     const [offeredData,     setOfferedData]     = useState(null);
//     const [loadingPerf,     setLoadingPerf]     = useState(false);
//     const [loadingOff,      setLoadingOff]      = useState(false);

//     const selectedMonths = getMonthRange(fromMonth, toMonth); // max 4
//     const isRangeValid   = selectedMonths.length >= 1 && selectedMonths.length <= 4;

//     // ── Fetch all months in range, merge results ──────────────────────────
//     const fetchAll = useCallback(() => {
//         if (!isRangeValid) return;

//         setLoadingPerf(true);
//         setLoadingOff(true);

//         const perfPromises = selectedMonths.map((m) => {
//             const form = new FormData();
//             form.append("month", inputToApiMonth(m));
//             return postData("performance_idploy/generate-scft-performance-graph/", form)
//                 .then((res) => (res?.status ? res : null))
//                 .catch(() => null);
//         });

//         const offPromises = selectedMonths.map((m) => {
//             const form = new FormData();
//             form.append("month", inputToApiMonth(m));
//             return postData("performance_idploy/generate-scft-offered-graph/", form)
//                 .then((res) => (res?.status ? res : null))
//                 .catch(() => null);
//         });

//         Promise.all(perfPromises)
//             .then((results) => setPerformanceData(mergeResponses(results)))
//             .finally(() => setLoadingPerf(false));

//         Promise.all(offPromises)
//             .then((results) => setOfferedData(mergeResponses(results)))
//             .finally(() => setLoadingOff(false));
//     }, [fromMonth, toMonth]); // eslint-disable-line

//     useEffect(() => {
//         if (!isRangeValid) return;
//         const t = setTimeout(fetchAll, 500);
//         return () => clearTimeout(t);
//     }, [fetchAll]); // eslint-disable-line

//     // ── Active data slice ─────────────────────────────────────────────────
//     const { chartData: perfChart, seriesNames: perfSeries } = transformGraphData(performanceData?.graph_data?.[activeTech]);
//     const { chartData: offChart,  seriesNames: offSeries  } = transformGraphData(offeredData?.graph_data?.[activeTech]);

//     const metricTheme   = METRIC_THEME[activeMetric];
//     const activeTechClr = TECH_COLORS[activeTech];

//     return (
//         <>
//             {/* Breadcrumb */}
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
//                     <Typography color="text.primary">SCFT Aging Graph</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* ── Top Bar ── */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
//                     <Typography variant="h5" fontWeight={700}>
//                         SCFT Aging Dashboard
//                     </Typography>

//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <MonthRangePicker
//                             fromMonth={fromMonth}
//                             toMonth={toMonth}
//                             onFromChange={(val) => {
//                                 setFromMonth(val);
//                                 if (toMonth && val > toMonth) setToMonth(val);
//                             }}
//                             onToChange={setToMonth}
//                             maxMonth={currentMonthInput}
//                         />
//                         <MuiTooltip title="Refresh">
//                             <span>
//                                 <IconButton onClick={fetchAll} size="small" disabled={!isRangeValid}>
//                                     <RefreshIcon fontSize="small" />
//                                 </IconButton>
//                             </span>
//                         </MuiTooltip>
//                     </Box>
//                 </Box>

//                 {/* Over-limit warning */}
//                 {selectedMonths.length > 4 && (
//                     <Alert severity="warning" sx={{ mb: 2 }}>
//                         Maximum 4 months can be selected. Only the first 4 months in the range will be fetched.
//                     </Alert>
//                 )}

//                 {/* ── Outer Metric Tabs: Performance | Offered ── */}
//                 <Box sx={{ display: "flex", borderBottom: "2px solid #e0e0e0", mb: 0 }}>
//                     {METRIC_TABS.map((tab) => {
//                         const isActive = activeMetric === tab.key;
//                         const theme    = METRIC_THEME[tab.key];
//                         return (
//                             <Box
//                                 key={tab.key}
//                                 onClick={() => setActiveMetric(tab.key)}
//                                 sx={{
//                                     px: 4, py: 1.2,
//                                     cursor: "pointer",
//                                     userSelect: "none",
//                                     fontWeight: isActive ? 700 : 500,
//                                     fontSize: 14,
//                                     color: isActive ? "#fff" : theme.tabColor,
//                                     background: isActive ? theme.active : "transparent",
//                                     borderRadius: "6px 6px 0 0",
//                                     borderBottom: isActive ? `3px solid ${theme.tabColor}` : "3px solid transparent",
//                                     transition: "all 0.2s",
//                                     "&:hover": { background: isActive ? theme.active : "#f0f4ff" },
//                                 }}
//                             >
//                                 {tab.label}
//                             </Box>
//                         );
//                     })}
//                 </Box>

//                 {/* ── Inner Tech Tabs: 4G | 5G | 4G+5G ── */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         borderBottom: "2px solid #e0e0e0",
//                         mb: 2,
//                         background: "#f9f9f9",
//                         px: 1,
//                         pt: 0.5,
//                     }}
//                 >
//                     {TECH_TABS.map((tab) => {
//                         const isActive = activeTech === tab.key;
//                         const tColor   = TECH_COLORS[tab.key];
//                         return (
//                             <Box
//                                 key={tab.key}
//                                 onClick={() => setActiveTech(tab.key)}
//                                 sx={{
//                                     px: 2.5, py: 0.8,
//                                     cursor: "pointer",
//                                     userSelect: "none",
//                                     fontWeight: isActive ? 700 : 500,
//                                     fontSize: 13,
//                                     color: isActive ? "#fff" : tColor.tabColor,
//                                     background: isActive ? tColor.active : "transparent",
//                                     borderRadius: "6px 6px 0 0",
//                                     borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
//                                     transition: "all 0.2s",
//                                     "&:hover": { background: isActive ? tColor.active : "#ebebeb" },
//                                 }}
//                             >
//                                 {tab.label}
//                             </Box>
//                         );
//                     })}
//                 </Box>

//                 {/* ── Chart: show only the active metric ── */}
//                 <Box display="flex" flexDirection="column" gap={2}>
//                     {activeMetric === "performance" && (
//                         <ScftChart
//                             title={METRIC_THEME.performance.label}
//                             icon={METRIC_THEME.performance.icon}
//                             gradientFrom={METRIC_THEME.performance.chartFrom}
//                             gradientTo={METRIC_THEME.performance.chartTo}
//                             chartData={perfChart}
//                             seriesNames={perfSeries}
//                             loading={loadingPerf}
//                             seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
//                         />
//                     )}

//                     {activeMetric === "offered" && (
//                         <ScftChart
//                             title={METRIC_THEME.offered.label}
//                             icon={METRIC_THEME.offered.icon}
//                             gradientFrom={METRIC_THEME.offered.chartFrom}
//                             gradientTo={METRIC_THEME.offered.chartTo}
//                             chartData={offChart}
//                             seriesNames={offSeries}
//                             loading={loadingOff}
//                             seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
//                         />
//                     )}
//                 </Box>

//                 {/* ── Summary Strip ── */}
//                 {(performanceData || offeredData) && (
//                     <Box
//                         mt={2}
//                         sx={{
//                             display: "flex", gap: 2, flexWrap: "wrap",
//                             p: 1.5, borderRadius: 2,
//                             background: "#f5f5f5", border: "1px solid #e0e0e0",
//                             alignItems: "center",
//                         }}
//                     >
//                         <Typography variant="caption" color="text.secondary" fontWeight={600}>Range:</Typography>
//                         <Chip
//                             label={
//                                 selectedMonths.length === 1
//                                     ? inputToApiMonth(selectedMonths[0])
//                                     : `${inputToApiMonth(selectedMonths[0])} → ${inputToApiMonth(selectedMonths[selectedMonths.length - 1])}`
//                             }
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Months:</Typography>
//                         <Chip
//                             label={selectedMonths.length}
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Tech:</Typography>
//                         <Chip
//                             label={activeTech}
//                             size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Layer:</Typography>
//                         <Chip
//                             label={(performanceData?.layer || offeredData?.layer || "all").toUpperCase()}
//                             size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={600} ml={1}>Series:</Typography>
//                         <Chip
//                             label={`Performance: ${perfSeries.length}  |  Offered: ${offSeries.length}`}
//                             size="small"
//                             variant="outlined"
//                             sx={{ fontWeight: 600, fontSize: 10 }}
//                         />

//                         {/* Color legend for selected months */}
//                         <Box display="flex" gap={0.8} flexWrap="wrap" ml={1}>
//                             {selectedMonths.map((m, i) => (
//                                 <Chip
//                                     key={m}
//                                     label={inputToApiMonth(m)}
//                                     size="small"
//                                     sx={{
//                                         background: SERIES_COLORS[i % SERIES_COLORS.length].solid,
//                                         color: "#fff",
//                                         fontWeight: 600,
//                                         fontSize: 10,
//                                     }}
//                                 />
//                             ))}
//                         </Box>
//                     </Box>
//                 )}
//             </Box>
//         </>
//     );
// };

// export default SCFT_Aging_Graph;


// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     CircularProgress,
//     Paper,
//     TextField,
//     IconButton,
//     Tooltip as MuiTooltip,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import SignalCellularAltIcon  from "@mui/icons-material/SignalCellularAlt";
// import BarChartIcon           from "@mui/icons-material/BarChart";
// import RefreshIcon            from "@mui/icons-material/Refresh";
// import FilterListIcon         from "@mui/icons-material/FilterList";
// import { useNavigate } from "react-router-dom";
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     LabelList,
// } from "recharts";
// import { postData } from "../../../services/FetchNodeServices";

// // ─────────────────────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────────────────────
// const getCurrentMonthStr = () =>
//     new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

// const inputToApiMonth = (val) => {
//     if (!val) return getCurrentMonthStr();
//     const [year, month] = val.split("-");
//     return new Date(Number(year), Number(month) - 1, 1)
//         .toLocaleDateString("en-US", { month: "short", year: "numeric" });
// };

// const apiMonthToInput = (str) => {
//     if (!str) return "";
//     const d = new Date(str);
//     if (isNaN(d)) return "";
//     return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const getMonthRange = (from, to) => {
//     if (!from || !to) return from ? [from] : [];
//     const [fy, fm] = from.split("-").map(Number);
//     const [ty, tm] = to.split("-").map(Number);
//     if (fy > ty || (fy === ty && fm > tm)) return [from];
//     const months = [];
//     let y = fy, m = fm;
//     while (y < ty || (y === ty && m <= tm)) {
//         months.push(`${y}-${String(m).padStart(2, "0")}`);
//         m++;
//         if (m > 12) { m = 1; y++; }
//     }
//     return months;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────────────────────────────────────
// const METRIC_TABS = [
//     { key: "performance", label: "Performance" },
//     { key: "offered",     label: "Offered"     },
// ];

// const TECH_TABS = [
//     { key: "4G",    label: "4G"    },
//     { key: "5G",    label: "5G"    },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// const TECH_COLORS = {
//     "4G":    { active: "linear-gradient(135deg,#1e3c72,#2a5298)", tabColor: "#1e3c72" },
//     "5G":    { active: "linear-gradient(135deg,#134e5e,#71b280)", tabColor: "#134e5e" },
//     "4G+5G": { active: "linear-gradient(135deg,#41295a,#2F0743)", tabColor: "#41295a" },
// };

// const METRIC_THEME = {
//     performance: {
//         active:    "linear-gradient(135deg,#1e3c72,#2a5298)",
//         tabColor:  "#1e3c72",
//         chartFrom: "#1e3c72",
//         chartTo:   "#2a5298",
//         icon: <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "SCFT Aging — Performance",
//     },
//     offered: {
//         active:    "linear-gradient(135deg,#134e5e,#71b280)",
//         tabColor:  "#134e5e",
//         chartFrom: "#134e5e",
//         chartTo:   "#71b280",
//         icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "SCFT Aging — Offered",
//     },
// };

// const CATEGORY_FILTERS = [
//     { key: "ALL",      label: "All",      color: "#546e7a" },
//     { key: "0-3days%",     label: "0-3days%",     color: "#1565C0" },
//     { key: "3-5days%",  label: "3-5days%",  color: "#2E7D32" },
//     { key: "5-7days%",  label: "5-7days%",  color: "#E65100" },
//     { key: ">7days%", label: ">7days%", color: "#6A1B9A" },
//     { key: "Pending%", label: "Pending%", color: "#C62828" },
// ];

// const SERIES_PALETTE = [
//     { stroke: "#1976D2", dot: "#1565C0" },
//     { stroke: "#388E3C", dot: "#2E7D32" },
//     { stroke: "#F57C00", dot: "#E65100" },
//     { stroke: "#7B1FA2", dot: "#6A1B9A" },
//     { stroke: "#00796B", dot: "#00695C" },
//     { stroke: "#D32F2F", dot: "#C62828" },
//     { stroke: "#FBC02D", dot: "#F9A825" },
//     { stroke: "#0097A7", dot: "#00838F" },
//     { stroke: "#512DA8", dot: "#4527A0" },
//     { stroke: "#689F38", dot: "#558B2F" },
//     { stroke: "#E91E63", dot: "#C2185B" },
//     { stroke: "#FF5722", dot: "#E64A19" },
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // DATA TRANSFORM
// // ─────────────────────────────────────────────────────────────────────────────
// const transformGraphData = (techData) => {
//     if (!techData) return { chartData: [], seriesNames: [] };
//     const { categories = [], series = [] } = techData;
//     const chartData = categories.map((cat, catIdx) => {
//         const entry = { category: cat };
//         series.forEach((s) => { entry[s.name] = s.data?.[catIdx] ?? null; });
//         return entry;
//     });
//     return { chartData, seriesNames: series.map((s) => s.name) };
// };

// const mergeResponses = (responses) => {
//     if (!responses?.length) return null;
//     const valid = responses.filter(Boolean);
//     if (!valid.length) return null;
//     const merged = { status: true, layer: valid[0].layer, graph_data: {} };
//     ["4G", "5G", "4G+5G"].forEach((tech) => {
//         const allSeries = [];
//         let categories  = [];
//         valid.forEach((res) => {
//             const td = res?.graph_data?.[tech];
//             if (!td) return;
//             if (td.categories?.length) categories = td.categories;
//             if (td.series?.length)     allSeries.push(...td.series);
//         });
//         const seen = new Map();
//         allSeries.forEach((s) => seen.set(s.name, s));
//         merged.graph_data[tech] = { categories, series: Array.from(seen.values()) };
//     });
//     return merged;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM TOOLTIP
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//     if (!active || !payload?.length) return null;
//     return (
//         <Paper elevation={8} sx={{
//             p: 1.8, minWidth: 200, borderRadius: "12px",
//             border: "1px solid #e0e0e0",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
//             background: "rgba(255,255,255,0.97)",
//             backdropFilter: "blur(8px)",
//         }}>
//             <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
//                 sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
//                 {label}
//             </Typography>
//             {payload.map((entry) => (
//                 <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.4}>
//                     <Box sx={{
//                         width: 28, height: 3, borderRadius: 2,
//                         background: entry.stroke ?? entry.color,
//                         flexShrink: 0,
//                     }} />
//                     <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
//                     <Typography fontSize={12} fontWeight={700} color={entry.stroke ?? entry.color}>
//                         {entry.value != null ? `${entry.value}%` : "—"}
//                     </Typography>
//                 </Box>
//             ))}
//         </Paper>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM DOT — circle with white fill, colored stroke (matches screenshot)
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomDot = (props) => {
//     const { cx, cy, stroke, value } = props;
//     if (value == null || isNaN(cx) || isNaN(cy)) return null;
//     return (
//         <circle
//             cx={cx} cy={cy} r={5}
//             fill="#fff"
//             stroke={stroke}
//             strokeWidth={2.5}
//         />
//     );
// };

// const ActiveDot = (props) => {
//     const { cx, cy, stroke } = props;
//     return (
//         <circle
//             cx={cx} cy={cy} r={7}
//             fill={stroke}
//             stroke="#fff"
//             strokeWidth={2}
//             style={{ filter: `drop-shadow(0 0 5px ${stroke}99)` }}
//         />
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM LABEL — shown permanently above/below each dot
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomLabel = (props) => {
//     const { x, y, value, fill, index, dataLength, offset = 18 } = props;
//     if (value == null || isNaN(x) || isNaN(y)) return null;

//     // Stagger: alternate above/below so overlapping series labels don't collide
//     // Even series index → above dot; Odd → below dot
//     const isAbove   = (props.seriesIndex ?? 0) % 2 === 0;
//     const labelY    = isAbove ? y - offset : y + offset;
//     const textAnchor = "middle";

//     return (
//         <g>
//             {/* small background pill for readability */}
//             <rect
//                 x={x - 16}
//                 y={labelY - 9}
//                 width={32}
//                 height={14}
//                 rx={7}
//                 ry={7}
//                 fill={fill}
//                 fillOpacity={0.13}
//             />
//             <text
//                 x={x}
//                 y={labelY}
//                 textAnchor={textAnchor}
//                 dominantBaseline="middle"
//                 fontSize={10.5}
//                 fontWeight={700}
//                 fill={fill}
//             >
//                 {`${value}%`}
//             </text>
//         </g>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CHART PANEL
// // ─────────────────────────────────────────────────────────────────────────────
// const ScftChart = ({
//     title, icon, gradientFrom, gradientTo,
//     chartData, seriesNames, loading, seriesInfo,
//     activeCategory,
// }) => {
//     const filteredData = useMemo(() => {
//         if (!activeCategory || activeCategory === "ALL") return chartData;
//         return chartData.filter((row) =>
//             row.category?.toLowerCase() === activeCategory.toLowerCase()
//         );
//     }, [chartData, activeCategory]);

//     const hasData = filteredData.length > 0 && seriesNames.length > 0;

//     // Extra top margin so labels above the topmost dot don't get clipped
//     const topMargin = 36;

//     return (
//         <Box sx={{
//             borderRadius: "16px",
//             border: "1px solid #e8ecf0",
//             boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
//             overflow: "hidden",
//             background: "#fff",
//         }}>
//             {/* Header */}
//             <Box sx={{
//                 background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
//                 px: 3, py: 2,
//                 display: "flex", alignItems: "center", justifyContent: "space-between",
//                 flexWrap: "wrap", gap: 1,
//             }}>
//                 <Box display="flex" alignItems="center" gap={1.2}>
//                     {icon}
//                     <Typography fontWeight={700} fontSize={15} color="#fff">{title}</Typography>
//                 </Box>
//                 <Box display="flex" gap={0.8} flexWrap="wrap">
//                     {seriesInfo?.map((s, i) => (
//                         <Chip
//                             key={s.name}
//                             label={s.name}
//                             size="small"
//                             sx={{
//                                 background: alpha(SERIES_PALETTE[i % SERIES_PALETTE.length].stroke, 0.25),
//                                 color: "#fff",
//                                 fontWeight: 700,
//                                 fontSize: 10.5,
//                                 border: `1.5px solid ${alpha(SERIES_PALETTE[i % SERIES_PALETTE.length].stroke, 0.6)}`,
//                             }}
//                         />
//                     ))}
//                 </Box>
//             </Box>

//             {/* Body */}
//             <Box sx={{ p: 2.5, background: "#fafbfc", minHeight: 400 }}>
//                 {loading ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={360} gap={2}>
//                         <CircularProgress size={40} sx={{ color: gradientFrom }} />
//                         <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
//                     </Box>
//                 ) : !hasData ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={360} gap={1.5}>
//                         <Box sx={{
//                             width: 56, height: 56, borderRadius: "14px",
//                             bgcolor: alpha(gradientFrom, 0.08),
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                         }}>
//                             {React.cloneElement(icon, { sx: { color: gradientFrom, fontSize: 28 } })}
//                         </Box>
//                         <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
//                         <Typography fontSize={12} color="text.disabled">
//                             {activeCategory !== "ALL"
//                                 ? `No records for "${activeCategory}"`
//                                 : "Try adjusting the date range"}
//                         </Typography>
//                     </Box>
//                 ) : (
//                     <ResponsiveContainer width="100%" height={400}>
//                         <LineChart
//                             data={filteredData}
//                             margin={{ top: topMargin, right: 30, left: 0, bottom: 16 }}
//                         >
//                             <CartesianGrid
//                                 strokeDasharray="4 4"
//                                 stroke="#e8ecf0"
//                                 vertical={false}
//                             />
//                             <XAxis
//                                 dataKey="category"
//                                 tick={{ fontSize: 11.5, fill: "#607d8b", fontWeight: 500 }}
//                                 axisLine={{ stroke: "#e0e0e0" }}
//                                 tickLine={false}
//                                 dy={6}
//                             />
//                             <YAxis
//                                 tick={{ fontSize: 11, fill: "#607d8b" }}
//                                 axisLine={false}
//                                 tickLine={false}
//                                 tickFormatter={(v) => `${v}%`}
//                                 domain={[0, 100]}
//                                 width={44}
//                                 ticks={[0, 25, 50, 75, 100]}
//                             />
//                             <Tooltip
//                                 content={<CustomTooltip />}
//                                 cursor={{ stroke: "#90a4ae", strokeWidth: 1, strokeDasharray: "4 4" }}
//                             />
//                             <Legend
//                                 wrapperStyle={{ paddingTop: 16 }}
//                                 iconType="plainline"
//                                 iconSize={24}
//                                 formatter={(value) => (
//                                     <span style={{
//                                         color: SERIES_PALETTE[seriesNames.indexOf(value) % SERIES_PALETTE.length].stroke,
//                                         fontWeight: 700,
//                                         fontSize: 12,
//                                     }}>
//                                         {value}
//                                     </span>
//                                 )}
//                             />

//                             {seriesNames.map((name, i) => {
//                                 const clr = SERIES_PALETTE[i % SERIES_PALETTE.length];
//                                 return (
//                                     <Line
//                                         key={name}
//                                         type="monotone"
//                                         dataKey={name}
//                                         stroke={clr.stroke}
//                                         strokeWidth={2.5}
//                                         dot={<CustomDot />}
//                                         activeDot={<ActiveDot />}
//                                         connectNulls
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         {/* Permanent value labels on every dot */}
//                                         <LabelList
//                                             dataKey={name}
//                                             content={(labelProps) => (
//                                                 <CustomLabel
//                                                     {...labelProps}
//                                                     fill={clr.stroke}
//                                                     seriesIndex={i}
//                                                     dataLength={filteredData.length}
//                                                     // shift offset per series so they don't overlap
//                                                     offset={14 + i * 2}
//                                                 />
//                                             )}
//                                         />
//                                     </Line>
//                                 );
//                             })}
//                         </LineChart>
//                     </ResponsiveContainer>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MONTH RANGE PICKER — no cap
// // ─────────────────────────────────────────────────────────────────────────────
// const MonthRangePicker = ({ fromMonth, toMonth, onFromChange, onToChange }) => {
//     const monthCount = getMonthRange(fromMonth, toMonth).length;
//     const isEmpty    = !fromMonth || !toMonth;

//     return (
//         <Box display="flex" gap={1.2} alignItems="center" flexWrap="wrap">
//             <TextField
//                 size="small" label="From" type="month"
//                 value={fromMonth}
//                 onChange={(e) => onFromChange(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                     minWidth: 152,
//                     "& .MuiOutlinedInput-root": {
//                         borderRadius: "10px",
//                         "&:hover fieldset":       { borderColor: "#1e3c72" },
//                         "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
//                     },
//                 }}
//             />
//             <Typography color="text.secondary" fontWeight={700} fontSize={16}>→</Typography>
//             <TextField
//                 size="small" label="To" type="month"
//                 value={toMonth}
//                 onChange={(e) => onToChange(e.target.value)}
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{ min: fromMonth }}
//                 sx={{
//                     minWidth: 152,
//                     "& .MuiOutlinedInput-root": {
//                         borderRadius: "10px",
//                         "&:hover fieldset":       { borderColor: "#1e3c72" },
//                         "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
//                     },
//                 }}
//             />
//             {!isEmpty && (
//                 <Chip
//                     label={`${monthCount} month${monthCount !== 1 ? "s" : ""}`}
//                     size="small"
//                     sx={{
//                         fontWeight: 700, fontSize: 11,
//                         bgcolor: alpha("#1e3c72", 0.1),
//                         color: "#1e3c72",
//                         border: "1px solid " + alpha("#1e3c72", 0.25),
//                     }}
//                 />
//             )}
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CATEGORY FILTER BAR
// // ─────────────────────────────────────────────────────────────────────────────
// const CategoryFilterBar = ({ activeCategory, onChange }) => (
//     <Box sx={{
//         display: "flex", alignItems: "center", gap: 1,
//         flexWrap: "wrap",
//         px: 2, py: 1.4,
//         bgcolor: "#f8fafc",
//         borderBottom: "1px solid #e8ecf0",
//     }}>
//         <Box display="flex" alignItems="center" gap={0.7} mr={0.5}>
//             <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//             <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
//         </Box>
//         {CATEGORY_FILTERS.map((cf) => {
//             const isActive = activeCategory === cf.key;
//             return (
//                 <Box
//                     key={cf.key}
//                     onClick={() => onChange(cf.key)}
//                     sx={{
//                         px: 1.8, py: 0.55,
//                         borderRadius: "20px",
//                         fontSize: 12.5,
//                         fontWeight: isActive ? 700 : 500,
//                         cursor: "pointer",
//                         userSelect: "none",
//                         transition: "all .15s",
//                         border: `1.5px solid ${isActive ? cf.color : alpha(cf.color, 0.3)}`,
//                         bgcolor: isActive ? cf.color : "transparent",
//                         color:   isActive ? "#fff"   : cf.color,
//                         "&:hover": {
//                             bgcolor: isActive ? cf.color : alpha(cf.color, 0.08),
//                             borderColor: cf.color,
//                         },
//                         boxShadow: isActive ? `0 2px 8px ${alpha(cf.color, 0.35)}` : "none",
//                     }}
//                 >
//                     {cf.label}
//                 </Box>
//             );
//         })}
//     </Box>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const SCFT_Aging_Graph = () => {
//     const navigate = useNavigate();

//     const [activeMetric,   setActiveMetric]   = useState("performance");
//     const [activeTech,     setActiveTech]     = useState("4G");
//     const [activeCategory, setActiveCategory] = useState("ALL");

//     const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
//     const [fromMonth, setFromMonth] = useState(currentMonthInput);
//     const [toMonth,   setToMonth]   = useState(currentMonthInput);

//     const [performanceData, setPerformanceData] = useState(null);
//     const [offeredData,     setOfferedData]     = useState(null);
//     const [loadingPerf,     setLoadingPerf]     = useState(false);
//     const [loadingOff,      setLoadingOff]      = useState(false);

//     const selectedMonths = getMonthRange(fromMonth, toMonth);
//     const isRangeValid   = selectedMonths.length >= 1;

//     // ── Fetch ─────────────────────────────────────────────────────────────────
//     const fetchAll = useCallback(() => {
//         if (!isRangeValid) return;
//         setLoadingPerf(true);
//         setLoadingOff(true);

//         const fetchMonth = (endpoint, month) => {
//             const form = new FormData();
//             form.append("month", inputToApiMonth(month));
//             return postData(endpoint, form)
//                 .then((res) => (res?.status ? res : null))
//                 .catch(() => null);
//         };

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-scft-performance-graph/", m)
//         ))
//             .then((results) => setPerformanceData(mergeResponses(results)))
//             .finally(() => setLoadingPerf(false));

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-scft-offered-graph/", m)
//         ))
//             .then((results) => setOfferedData(mergeResponses(results)))
//             .finally(() => setLoadingOff(false));
//     }, [fromMonth, toMonth]); // eslint-disable-line

//     useEffect(() => {
//         if (!isRangeValid) return;
//         const t = setTimeout(fetchAll, 500);
//         return () => clearTimeout(t);
//     }, [fetchAll]); // eslint-disable-line

//     // ── Derived ───────────────────────────────────────────────────────────────
//     const { chartData: perfChart, seriesNames: perfSeries } =
//         transformGraphData(performanceData?.graph_data?.[activeTech]);
//     const { chartData: offChart,  seriesNames: offSeries  } =
//         transformGraphData(offeredData?.graph_data?.[activeTech]);

//     const metricTheme   = METRIC_THEME[activeMetric];
//     const activeTechClr = TECH_COLORS[activeTech];

//     // ─────────────────────────────────────────────────────────────────────────
//     return (
//         <>
//             {/* Breadcrumb */}
//             <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
//                     <Typography color="text.primary">SCFT Aging Graph</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Box p={1.5}>

//                 {/* ── Top Bar ── */}
//                 <Paper elevation={0} sx={{
//                     display: "flex", justifyContent: "space-between",
//                     alignItems: "center", flexWrap: "wrap", gap: 2,
//                     mb: 2.5, px: 2.5, py: 2,
//                     borderRadius: "16px",
//                     border: "1px solid #e8ecf0",
//                     bgcolor: "#fff",
//                     boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//                 }}>
//                     <Box>
//                         <Typography fontWeight={800} fontSize={20} letterSpacing="-.3px" color="#1a1a2e">
//                             SCFT Aging Dashboard
//                         </Typography>
//                         <Typography fontSize={13} color="text.secondary" mt={0.2}>
//                             Trend analysis across months · select a date range to compare
//                         </Typography>
//                     </Box>
//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <MonthRangePicker
//                             fromMonth={fromMonth}
//                             toMonth={toMonth}
//                             onFromChange={(val) => {
//                                 setFromMonth(val);
//                                 if (toMonth && val > toMonth) setToMonth(val);
//                             }}
//                             onToChange={setToMonth}
//                         />
//                         <MuiTooltip title="Refresh data" arrow>
//                             <span>
//                                 <IconButton
//                                     onClick={fetchAll}
//                                     size="small"
//                                     disabled={!isRangeValid || loadingPerf || loadingOff}
//                                     sx={{
//                                         bgcolor: alpha("#1e3c72", 0.08),
//                                         borderRadius: "10px",
//                                         "&:hover": { bgcolor: alpha("#1e3c72", 0.15) },
//                                     }}
//                                 >
//                                     <RefreshIcon
//                                         fontSize="small"
//                                         sx={{
//                                             color: "#1e3c72",
//                                             animation: (loadingPerf || loadingOff)
//                                                 ? "spin .8s linear infinite" : "none",
//                                             "@keyframes spin": { to: { transform: "rotate(360deg)" } },
//                                         }}
//                                     />
//                                 </IconButton>
//                             </span>
//                         </MuiTooltip>
//                     </Box>
//                 </Paper>

//                 {/* ── Tabs + Filter + Chart card ── */}
//                 <Paper elevation={0} sx={{
//                     borderRadius: "16px",
//                     border: "1px solid #e8ecf0",
//                     overflow: "hidden",
//                     boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//                     mb: 2,
//                 }}>
//                     {/* Metric tabs */}
//                     <Box sx={{ display: "flex", borderBottom: "1.5px solid #e8ecf0", bgcolor: "#fff" }}>
//                         {METRIC_TABS.map((tab) => {
//                             const isActive = activeMetric === tab.key;
//                             const theme    = METRIC_THEME[tab.key];
//                             return (
//                                 <Box
//                                     key={tab.key}
//                                     onClick={() => setActiveMetric(tab.key)}
//                                     sx={{
//                                         px: 4, py: 1.4,
//                                         cursor: "pointer", userSelect: "none",
//                                         fontWeight: isActive ? 700 : 500,
//                                         fontSize: 14,
//                                         color:      isActive ? "#fff" : theme.tabColor,
//                                         background: isActive ? theme.active : "transparent",
//                                         borderBottom: isActive
//                                             ? `3px solid ${theme.tabColor}`
//                                             : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         display: "flex", alignItems: "center", gap: 0.8,
//                                         "&:hover": {
//                                             background: isActive ? theme.active : alpha(theme.tabColor, 0.06),
//                                         },
//                                     }}
//                                 >
//                                     {isActive && React.cloneElement(theme.icon, { sx: { color: "#fff", fontSize: 17 } })}
//                                     {tab.label}
//                                 </Box>
//                             );
//                         })}
//                     </Box>

//                     {/* Tech tabs */}
//                     <Box sx={{
//                         display: "flex",
//                         borderBottom: "1.5px solid #e8ecf0",
//                         bgcolor: "#f8fafc",
//                         px: 1.5, pt: 0.5,
//                     }}>
//                         {TECH_TABS.map((tab) => {
//                             const isActive = activeTech === tab.key;
//                             const tColor   = TECH_COLORS[tab.key];
//                             return (
//                                 <Box
//                                     key={tab.key}
//                                     onClick={() => setActiveTech(tab.key)}
//                                     sx={{
//                                         px: 3, py: 1,
//                                         cursor: "pointer", userSelect: "none",
//                                         fontWeight: isActive ? 700 : 500,
//                                         fontSize: 13,
//                                         color:      isActive ? "#fff" : tColor.tabColor,
//                                         background: isActive ? tColor.active : "transparent",
//                                         borderRadius: "8px 8px 0 0",
//                                         borderBottom: isActive
//                                             ? `3px solid ${tColor.tabColor}`
//                                             : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         "&:hover": {
//                                             background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08),
//                                         },
//                                     }}
//                                 >
//                                     {tab.label}
//                                 </Box>
//                             );
//                         })}
//                     </Box>

//                     {/* Category filter */}
//                     <CategoryFilterBar activeCategory={activeCategory} onChange={setActiveCategory} />

//                     {/* Chart */}
//                     <Box p={2.5}>
//                         {activeMetric === "performance" && (
//                             <ScftChart
//                                 title={METRIC_THEME.performance.label}
//                                 icon={METRIC_THEME.performance.icon}
//                                 gradientFrom={METRIC_THEME.performance.chartFrom}
//                                 gradientTo={METRIC_THEME.performance.chartTo}
//                                 chartData={perfChart}
//                                 seriesNames={perfSeries}
//                                 loading={loadingPerf}
//                                 seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
//                                 activeCategory={activeCategory}
//                             />
//                         )}
//                         {activeMetric === "offered" && (
//                             <ScftChart
//                                 title={METRIC_THEME.offered.label}
//                                 icon={METRIC_THEME.offered.icon}
//                                 gradientFrom={METRIC_THEME.offered.chartFrom}
//                                 gradientTo={METRIC_THEME.offered.chartTo}
//                                 chartData={offChart}
//                                 seriesNames={offSeries}
//                                 loading={loadingOff}
//                                 seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
//                                 activeCategory={activeCategory}
//                             />
//                         )}
//                     </Box>
//                 </Paper>

//                 {/* ── Summary Strip ── */}
//                 {(performanceData || offeredData) && (
//                     <Paper elevation={0} sx={{
//                         display: "flex", gap: 1.5, flexWrap: "wrap",
//                         p: 2, borderRadius: "14px",
//                         bgcolor: "#fff",
//                         border: "1px solid #e8ecf0",
//                         alignItems: "center",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//                     }}>
//                         <Typography variant="caption" color="text.secondary" fontWeight={700}>Range:</Typography>
//                         <Chip
//                             label={
//                                 selectedMonths.length === 1
//                                     ? inputToApiMonth(selectedMonths[0])
//                                     : `${inputToApiMonth(selectedMonths[0])} → ${inputToApiMonth(selectedMonths[selectedMonths.length - 1])}`
//                             }
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Months:</Typography>
//                         <Chip
//                             label={selectedMonths.length}
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Tech:</Typography>
//                         <Chip
//                             label={activeTech}
//                             size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Layer:</Typography>
//                         <Chip
//                             label={(performanceData?.layer || offeredData?.layer || "all").toUpperCase()}
//                             size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Filter:</Typography>
//                         <Chip
//                             label={activeCategory === "ALL" ? "All Categories" : activeCategory}
//                             size="small"
//                             sx={{
//                                 background: CATEGORY_FILTERS.find(c => c.key === activeCategory)?.color ?? "#546e7a",
//                                 color: "#fff", fontWeight: 700, fontSize: 10.5,
//                             }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Series:</Typography>
//                         <Chip
//                             label={`Performance: ${perfSeries.length}  |  Offered: ${offSeries.length}`}
//                             size="small"
//                             variant="outlined"
//                             sx={{ fontWeight: 600, fontSize: 10.5 }}
//                         />

//                         {/* Month color legend */}
//                         <Box display="flex" gap={0.8} flexWrap="wrap" ml={0.5}>
//                             {selectedMonths.map((m, i) => (
//                                 <Chip
//                                     key={m}
//                                     label={inputToApiMonth(m)}
//                                     size="small"
//                                     sx={{
//                                         background: SERIES_PALETTE[i % SERIES_PALETTE.length].stroke,
//                                         color: "#fff", fontWeight: 600, fontSize: 10,
//                                     }}
//                                 />
//                             ))}
//                         </Box>
//                     </Paper>
//                 )}
//             </Box>
//         </>
//     );
// };

// export default SCFT_Aging_Graph;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Chip,
    CircularProgress,
    Paper,
    TextField,
    IconButton,
    Tooltip as MuiTooltip,
    alpha,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SignalCellularAltIcon  from "@mui/icons-material/SignalCellularAlt";
import BarChartIcon           from "@mui/icons-material/BarChart";
import RefreshIcon            from "@mui/icons-material/Refresh";
import FilterListIcon         from "@mui/icons-material/FilterList";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { postData } from "../../../services/FetchNodeServices";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getCurrentMonthStr = () =>
    new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

const inputToApiMonth = (val) => {
    if (!val) return getCurrentMonthStr();
    const [year, month] = val.split("-");
    return new Date(Number(year), Number(month) - 1, 1)
        .toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const apiMonthToInput = (str) => {
    if (!str) return "";
    const d = new Date(str);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthRange = (from, to) => {
    if (!from || !to) return from ? [from] : [];
    const [fy, fm] = from.split("-").map(Number);
    const [ty, tm] = to.split("-").map(Number);
    if (fy > ty || (fy === ty && fm > tm)) return [from];
    const months = [];
    let y = fy, m = fm;
    while (y < ty || (y === ty && m <= tm)) {
        months.push(`${y}-${String(m).padStart(2, "0")}`);
        m++;
        if (m > 12) { m = 1; y++; }
    }
    return months;
};

// Normalize category strings for comparison — strip spaces, lowercase
const normalizeCategory = (str) =>
    (str ?? "").toString().trim().toLowerCase().replace(/\s+/g, "");

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const METRIC_TABS = [
    { key: "performance", label: "Performance" },
    { key: "offered",     label: "Offered"     },
];

const TECH_TABS = [
    { key: "4G",    label: "4G"    },
    { key: "5G",    label: "5G"    },
    { key: "4G+5G", label: "4G+5G" },
];

const TECH_COLORS = {
    "4G":    { active: "linear-gradient(135deg,#1e3c72,#2a5298)", tabColor: "#1e3c72" },
    "5G":    { active: "linear-gradient(135deg,#134e5e,#71b280)", tabColor: "#134e5e" },
    "4G+5G": { active: "linear-gradient(135deg,#41295a,#2F0743)", tabColor: "#41295a" },
};

const METRIC_THEME = {
    performance: {
        active:    "linear-gradient(135deg,#1e3c72,#2a5298)",
        tabColor:  "#1e3c72",
        chartFrom: "#1e3c72",
        chartTo:   "#2a5298",
        icon: <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Performance",
    },
    offered: {
        active:    "linear-gradient(135deg,#134e5e,#71b280)",
        tabColor:  "#134e5e",
        chartFrom: "#134e5e",
        chartTo:   "#71b280",
        icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Offered",
    },
};

const CATEGORY_FILTERS = [
    { key: "ALL",      label: "All",       color: "#546e7a" },
    { key: "0-3days%", label: "0-3days%",  color: "#1565C0" },
    { key: "3-5days%", label: "3-5days%",  color: "#2E7D32" },
    { key: "5-7days%", label: "5-7days%",  color: "#E65100" },
    { key: ">7days%",  label: ">7days%",   color: "#6A1B9A" },
    { key: "Pending%", label: "Pending%",  color: "#C62828" },
];

const SERIES_PALETTE = [
    { stroke: "#1976D2", dot: "#1565C0" },
    { stroke: "#388E3C", dot: "#2E7D32" },
    { stroke: "#F57C00", dot: "#E65100" },
    { stroke: "#7B1FA2", dot: "#6A1B9A" },
    { stroke: "#00796B", dot: "#00695C" },
    { stroke: "#D32F2F", dot: "#C62828" },
    { stroke: "#FBC02D", dot: "#F9A825" },
    { stroke: "#0097A7", dot: "#00838F" },
    { stroke: "#512DA8", dot: "#4527A0" },
    { stroke: "#689F38", dot: "#558B2F" },
    { stroke: "#E91E63", dot: "#C2185B" },
    { stroke: "#FF5722", dot: "#E64A19" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA TRANSFORM
// ─────────────────────────────────────────────────────────────────────────────
const transformGraphData = (techData) => {
    if (!techData) return { chartData: [], seriesNames: [] };
    const { categories = [], series = [] } = techData;
    const chartData = categories.map((cat, catIdx) => {
        const entry = { category: cat };
        series.forEach((s) => { entry[s.name] = s.data?.[catIdx] ?? null; });
        return entry;
    });
    return { chartData, seriesNames: series.map((s) => s.name) };
};

const mergeResponses = (responses) => {
    if (!responses?.length) return null;
    const valid = responses.filter(Boolean);
    if (!valid.length) return null;
    const merged = { status: true, layer: valid[0].layer, graph_data: {} };
    ["4G", "5G", "4G+5G"].forEach((tech) => {
        const allSeries = [];
        let categories  = [];
        valid.forEach((res) => {
            const td = res?.graph_data?.[tech];
            if (!td) return;
            if (td.categories?.length) categories = td.categories;
            if (td.series?.length)     allSeries.push(...td.series);
        });
        const seen = new Map();
        allSeries.forEach((s) => seen.set(s.name, s));
        merged.graph_data[tech] = { categories, series: Array.from(seen.values()) };
    });
    return merged;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <Paper elevation={8} sx={{
            p: 1.8, minWidth: 200, borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            background: "rgba(255,255,255,0.97)",
        }}>
            <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
                sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
                {label}
            </Typography>
            {payload.map((entry) => (
                <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.4}>
                    <Box sx={{
                        width: 28, height: 3, borderRadius: 2,
                        background: entry.stroke ?? entry.color,
                        flexShrink: 0,
                    }} />
                    <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
                    <Typography fontSize={12} fontWeight={700} color={entry.stroke ?? entry.color}>
                        {entry.value != null ? `${entry.value}%` : "—"}
                    </Typography>
                </Box>
            ))}
        </Paper>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// LABEL OFFSET COMPUTATION — safe for 0, 1, or N series (2–12)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Given all non-null { seriesIdx, value } entries at one x-index,
 * returns { [seriesIdx]: yOffset } so labels never overlap.
 * Highest value → furthest above; values close together get spread apart.
 */
const computeLabelOffsets = (allValues) => {
    if (!allValues || allValues.length === 0) return {};

    const CLUSTER_THRESHOLD = 10; // values within 10 units are "close"
    const BASE_OFFSET        = -18; // default: label above dot
    const STEP               = 20;  // extra pixels per collision tier

    const sorted = [...allValues].sort((a, b) => a.value - b.value);

    // Group into clusters of close values
    const clusters = [];
    let current = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value - sorted[i - 1].value < CLUSTER_THRESHOLD) {
            current.push(sorted[i]);
        } else {
            clusters.push(current);
            current = [sorted[i]];
        }
    }
    clusters.push(current);

    const offsetMap = {};

    clusters.forEach((cluster) => {
        const n = cluster.length;
        if (n === 1) {
            offsetMap[cluster[0].seriesIdx] = BASE_OFFSET;
            return;
        }
        // Build alternating above/below slots: above, below, further above, further below...
        const positions = [];
        for (let tier = 0; tier < Math.ceil(n / 2); tier++) {
            positions.push(BASE_OFFSET - tier * STEP);        // above
            positions.push(BASE_OFFSET + (tier + 1) * STEP);  // below
        }
        // Highest value → topmost slot
        const sortedDesc = [...cluster].reverse();
        sortedDesc.forEach((item, i) => {
            offsetMap[item.seriesIdx] = positions[i] !== undefined ? positions[i] : BASE_OFFSET;
        });
    });

    return offsetMap;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM DOT — white circle with colored stroke
// ─────────────────────────────────────────────────────────────────────────────
const CustomDot = (props) => {
    const {
        cx, cy, stroke, value, index,
        seriesIndex,
        allSeriesData,
    } = props;

    // Guard: skip if coordinates or value are missing/invalid
    if (value == null || value === undefined) return null;
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;

    // Build values-at-this-index list safely
    let valuesAtIndex = [];
    try {
        valuesAtIndex = Array.isArray(allSeriesData)
            ? allSeriesData
                .map((seriesValues, sIdx) => ({
                    seriesIdx: sIdx,
                    value: Array.isArray(seriesValues)
                        ? (seriesValues[index] ?? null)
                        : null,
                }))
                .filter((v) => v.value != null && Number.isFinite(v.value))
            : [];
    } catch (_) {
        valuesAtIndex = [];
    }

    // Compute label offset safely
    let labelDy = -18;
    try {
        if (valuesAtIndex.length > 0) {
            const offsetMap = computeLabelOffsets(valuesAtIndex);
            labelDy = offsetMap[seriesIndex] !== undefined ? offsetMap[seriesIndex] : -18;
        }
    } catch (_) {
        labelDy = -18;
    }

    const label = `${value}%`;
    const charW = 7.2;
    const padX  = 7;
    const rectW = Math.max(label.length * charW + padX * 2, 32);
    const rectH = 17;
    const rectX = cx - rectW / 2;
    const rectY = cy + labelDy - rectH + 4;

    const showConnector = Math.abs(labelDy) > 18;

    return (
        <g>
            {/* Dot */}
            <circle
                cx={cx} cy={cy} r={5}
                fill="#ffffff"
                stroke={stroke}
                strokeWidth={2.5}
            />
            {/* Pill background */}
            <rect
                x={rectX} y={rectY}
                width={rectW} height={rectH}
                rx={5} ry={5}
                fill="#ffffff"
                fillOpacity={0.96}
                stroke={stroke}
                strokeWidth={0.9}
                strokeOpacity={0.5}
            />
            {/* Label text */}
            <text
                x={cx}
                y={rectY + rectH - 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight="600"
                fill={stroke}
                style={{ userSelect: "none", pointerEvents: "none" }}
            >
                {label}
            </text>
            {/* Dashed connector line when label is pushed far from dot */}
            {showConnector && (
                <line
                    x1={cx}
                    y1={labelDy < 0 ? rectY + rectH : rectY}
                    x2={cx}
                    y2={labelDy < 0 ? cy - 6 : cy + 6}
                    stroke={stroke}
                    strokeWidth={0.8}
                    strokeOpacity={0.4}
                    strokeDasharray="2 2"
                />
            )}
        </g>
    );
};

const ActiveDot = (props) => {
    const { cx, cy, stroke } = props;
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
    return (
        <circle cx={cx} cy={cy} r={7}
            fill={stroke} stroke="#fff" strokeWidth={2}
        />
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHART PANEL
// ─────────────────────────────────────────────────────────────────────────────
const ScftChart = ({
    title, icon, gradientFrom, gradientTo,
    chartData, seriesNames, loading, seriesInfo,
    activeCategory,
}) => {
    // Robust category filter using normalized comparison
    const filteredData = useMemo(() => {
        if (!activeCategory || activeCategory === "ALL") return chartData;
        const needle = normalizeCategory(activeCategory);
        return chartData.filter((row) =>
            normalizeCategory(row.category) === needle
        );
    }, [chartData, activeCategory]);

    // Build allSeriesData[seriesIdx][catIdx] for CustomDot offset logic
    const allSeriesData = useMemo(() => {
        return seriesNames.map((name) =>
            filteredData.map((row) => {
                const v = row[name];
                return v != null && Number.isFinite(Number(v)) ? Number(v) : null;
            })
        );
    }, [filteredData, seriesNames]);

    const hasData = filteredData.length > 0 && seriesNames.length > 0;

    // Dynamic height and top margin scale with number of series
    const chartHeight = Math.max(420, 400 + Math.max(0, seriesNames.length - 4) * 20);
    const topMargin   = seriesNames.length > 6 ? 52 : 40;

    return (
        <Box sx={{
            borderRadius: "16px",
            border: "1px solid #e8ecf0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            overflow: "hidden",
            background: "#fff",
        }}>
            {/* Header */}
            <Box sx={{
                background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                px: 3, py: 2,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 1,
            }}>
                <Box display="flex" alignItems="center" gap={1.2}>
                    {icon}
                    <Typography fontWeight={700} fontSize={15} color="#fff">{title}</Typography>
                </Box>
                <Box display="flex" gap={0.8} flexWrap="wrap">
                    {seriesInfo?.map((s, i) => (
                        <Chip
                            key={s.name}
                            label={s.name}
                            size="small"
                            sx={{
                                background: alpha(SERIES_PALETTE[i % SERIES_PALETTE.length].stroke, 0.25),
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 10.5,
                                border: `1.5px solid ${alpha(SERIES_PALETTE[i % SERIES_PALETTE.length].stroke, 0.6)}`,
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ p: 2.5, background: "#fafbfc", minHeight: chartHeight + 40 }}>
                {loading ? (
                    <Box display="flex" flexDirection="column" justifyContent="center"
                        alignItems="center" minHeight={chartHeight} gap={2}>
                        <CircularProgress size={40} sx={{ color: gradientFrom }} />
                        <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
                    </Box>
                ) : !hasData ? (
                    <Box display="flex" flexDirection="column" justifyContent="center"
                        alignItems="center" minHeight={chartHeight} gap={1.5}>
                        <Box sx={{
                            width: 56, height: 56, borderRadius: "14px",
                            bgcolor: alpha(gradientFrom, 0.08),
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            {React.cloneElement(icon, { sx: { color: gradientFrom, fontSize: 28 } })}
                        </Box>
                        <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
                        <Typography fontSize={12} color="text.disabled">
                            {activeCategory !== "ALL"
                                ? `No records for "${activeCategory}"`
                                : "Try adjusting the date range"}
                        </Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <LineChart
                            data={filteredData}
                            margin={{ top: topMargin, right: 44, left: 0, bottom: 16 }}
                        >
                            <CartesianGrid strokeDasharray="4 4" stroke="#e8ecf0" vertical={false} />
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 11.5, fill: "#607d8b", fontWeight: 500 }}
                                axisLine={{ stroke: "#e0e0e0" }}
                                tickLine={false}
                                dy={6}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#607d8b" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `${v}%`}
                                domain={[0, 100]}
                                ticks={[0, 25, 50, 75, 100]}
                                width={44}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ stroke: "#90a4ae", strokeWidth: 1, strokeDasharray: "4 4" }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: 18 }}
                                iconType="plainline"
                                iconSize={22}
                                formatter={(value) => (
                                    <span style={{
                                        color: SERIES_PALETTE[seriesNames.indexOf(value) % SERIES_PALETTE.length].stroke,
                                        fontWeight: 700,
                                        fontSize: 11.5,
                                    }}>
                                        {value}
                                    </span>
                                )}
                            />

                            {seriesNames.map((name, i) => {
                                const clr = SERIES_PALETTE[i % SERIES_PALETTE.length];
                                return (
                                    <Line
                                        key={name}
                                        type="monotone"
                                        dataKey={name}
                                        stroke={clr.stroke}
                                        strokeWidth={2.5}
                                        dot={(dotProps) => (
                                            <CustomDot
                                                key={`dot-${i}-${dotProps.index}`}
                                                {...dotProps}
                                                seriesIndex={i}
                                                allSeriesData={allSeriesData}
                                            />
                                        )}
                                        activeDot={(dotProps) => (
                                            <ActiveDot {...dotProps} />
                                        )}
                                        connectNulls
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MONTH RANGE PICKER
// ─────────────────────────────────────────────────────────────────────────────
const MonthRangePicker = ({ fromMonth, toMonth, onFromChange, onToChange }) => {
    const monthCount = getMonthRange(fromMonth, toMonth).length;
    const isEmpty    = !fromMonth || !toMonth;

    return (
        <Box display="flex" gap={1.2} alignItems="center" flexWrap="wrap">
            <TextField
                size="small" label="From" type="month"
                value={fromMonth}
                onChange={(e) => onFromChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                    minWidth: 152,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&:hover fieldset":       { borderColor: "#1e3c72" },
                        "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
                    },
                }}
            />
            <Typography color="text.secondary" fontWeight={700} fontSize={16}>→</Typography>
            <TextField
                size="small" label="To" type="month"
                value={toMonth}
                onChange={(e) => onToChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: fromMonth }}
                sx={{
                    minWidth: 152,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        "&:hover fieldset":       { borderColor: "#1e3c72" },
                        "&.Mui-focused fieldset": { borderColor: "#1e3c72" },
                    },
                }}
            />
            {!isEmpty && (
                <Chip
                    label={`${monthCount} month${monthCount !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{
                        fontWeight: 700, fontSize: 11,
                        bgcolor: alpha("#1e3c72", 0.1),
                        color: "#1e3c72",
                        border: "1px solid " + alpha("#1e3c72", 0.25),
                    }}
                />
            )}
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────
const CategoryFilterBar = ({ activeCategory, onChange }) => (
    <Box sx={{
        display: "flex", alignItems: "center", gap: 1,
        flexWrap: "wrap",
        px: 2, py: 1.4,
        bgcolor: "#f8fafc",
        borderBottom: "1px solid #e8ecf0",
    }}>
        <Box display="flex" alignItems="center" gap={0.7} mr={0.5}>
            <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
            <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
        </Box>
        {CATEGORY_FILTERS.map((cf) => {
            const isActive = activeCategory === cf.key;
            return (
                <Box
                    key={cf.key}
                    onClick={() => onChange(cf.key)}
                    sx={{
                        px: 1.8, py: 0.55,
                        borderRadius: "20px",
                        fontSize: 12.5,
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "all .15s",
                        border: `1.5px solid ${isActive ? cf.color : alpha(cf.color, 0.3)}`,
                        bgcolor: isActive ? cf.color : "transparent",
                        color:   isActive ? "#fff"  : cf.color,
                        "&:hover": {
                            bgcolor: isActive ? cf.color : alpha(cf.color, 0.08),
                            borderColor: cf.color,
                        },
                        boxShadow: isActive ? `0 2px 8px ${alpha(cf.color, 0.35)}` : "none",
                    }}
                >
                    {cf.label}
                </Box>
            );
        })}
    </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SCFT_Aging_Graph = () => {
    const navigate = useNavigate();

    const [activeMetric,   setActiveMetric]   = useState("performance");
    const [activeTech,     setActiveTech]     = useState("4G");
    const [activeCategory, setActiveCategory] = useState("ALL");

    const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
    const [fromMonth, setFromMonth] = useState(currentMonthInput);
    const [toMonth,   setToMonth]   = useState(currentMonthInput);

    const [performanceData, setPerformanceData] = useState(null);
    const [offeredData,     setOfferedData]     = useState(null);
    const [loadingPerf,     setLoadingPerf]     = useState(false);
    const [loadingOff,      setLoadingOff]      = useState(false);

    const selectedMonths = getMonthRange(fromMonth, toMonth);
    const isRangeValid   = selectedMonths.length >= 1;

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchAll = useCallback(() => {
        if (!isRangeValid) return;
        setLoadingPerf(true);
        setLoadingOff(true);

        const fetchMonth = (endpoint, month) => {
            const form = new FormData();
            form.append("month", inputToApiMonth(month));
            return postData(endpoint, form)
                .then((res) => (res?.status ? res : null))
                .catch(() => null);
        };

        Promise.all(selectedMonths.map((m) =>
            fetchMonth("performance_idploy/generate-scft-performance-graph/", m)
        ))
            .then((results) => setPerformanceData(mergeResponses(results)))
            .finally(() => setLoadingPerf(false));

        Promise.all(selectedMonths.map((m) =>
            fetchMonth("performance_idploy/generate-scft-offered-graph/", m)
        ))
            .then((results) => setOfferedData(mergeResponses(results)))
            .finally(() => setLoadingOff(false));
    }, [fromMonth, toMonth]); // eslint-disable-line

    useEffect(() => {
        if (!isRangeValid) return;
        const t = setTimeout(fetchAll, 500);
        return () => clearTimeout(t);
    }, [fetchAll]); // eslint-disable-line

    // ── Derived ───────────────────────────────────────────────────────────────
    const { chartData: perfChart, seriesNames: perfSeries } =
        transformGraphData(performanceData?.graph_data?.[activeTech]);
    const { chartData: offChart,  seriesNames: offSeries  } =
        transformGraphData(offeredData?.graph_data?.[activeTech]);

    const metricTheme   = METRIC_THEME[activeMetric];
    const activeTechClr = TECH_COLORS[activeTech];

    return (
        <>
            {/* Breadcrumb */}
            <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" sx={{ cursor: "pointer" }}
                        onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
                    <Typography color="text.primary">SCFT Aging Graph</Typography>
                </Breadcrumbs>
            </Box>

            <Box p={1.5}>

                {/* ── Top Bar ── */}
                <Paper elevation={0} sx={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", flexWrap: "wrap", gap: 2,
                    mb: 2.5, px: 2.5, py: 2,
                    borderRadius: "16px",
                    border: "1px solid #e8ecf0",
                    bgcolor: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}>
                    <Box>
                        <Typography fontWeight={800} fontSize={20} letterSpacing="-.3px" color="#1a1a2e">
                            SCFT Aging Dashboard
                        </Typography>
                        <Typography fontSize={13} color="text.secondary" mt={0.2}>
                            Trend analysis across months · select a date range to compare
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        <MonthRangePicker
                            fromMonth={fromMonth}
                            toMonth={toMonth}
                            onFromChange={(val) => {
                                setFromMonth(val);
                                if (toMonth && val > toMonth) setToMonth(val);
                            }}
                            onToChange={setToMonth}
                        />
                        <MuiTooltip title="Refresh data" arrow>
                            <span>
                                <IconButton
                                    onClick={fetchAll}
                                    size="small"
                                    disabled={!isRangeValid || loadingPerf || loadingOff}
                                    sx={{
                                        bgcolor: alpha("#1e3c72", 0.08),
                                        borderRadius: "10px",
                                        "&:hover": { bgcolor: alpha("#1e3c72", 0.15) },
                                    }}
                                >
                                    <RefreshIcon
                                        fontSize="small"
                                        sx={{
                                            color: "#1e3c72",
                                            animation: (loadingPerf || loadingOff)
                                                ? "spin .8s linear infinite" : "none",
                                            "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                                        }}
                                    />
                                </IconButton>
                            </span>
                        </MuiTooltip>
                    </Box>
                </Paper>

                {/* ── Tabs + Filter + Chart card ── */}
                <Paper elevation={0} sx={{
                    borderRadius: "16px",
                    border: "1px solid #e8ecf0",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    mb: 2,
                }}>
                    {/* Metric tabs */}
                    <Box sx={{ display: "flex", borderBottom: "1.5px solid #e8ecf0", bgcolor: "#fff" }}>
                        {METRIC_TABS.map((tab) => {
                            const isActive = activeMetric === tab.key;
                            const theme    = METRIC_THEME[tab.key];
                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveMetric(tab.key)}
                                    sx={{
                                        px: 4, py: 1.4,
                                        cursor: "pointer", userSelect: "none",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 14,
                                        color:      isActive ? "#fff" : theme.tabColor,
                                        background: isActive ? theme.active : "transparent",
                                        borderBottom: isActive
                                            ? `3px solid ${theme.tabColor}`
                                            : "3px solid transparent",
                                        transition: "all 0.2s",
                                        display: "flex", alignItems: "center", gap: 0.8,
                                        "&:hover": {
                                            background: isActive ? theme.active : alpha(theme.tabColor, 0.06),
                                        },
                                    }}
                                >
                                    {isActive && React.cloneElement(theme.icon, { sx: { color: "#fff", fontSize: 17 } })}
                                    {tab.label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Tech tabs */}
                    <Box sx={{
                        display: "flex",
                        borderBottom: "1.5px solid #e8ecf0",
                        bgcolor: "#f8fafc",
                        px: 1.5, pt: 0.5,
                    }}>
                        {TECH_TABS.map((tab) => {
                            const isActive = activeTech === tab.key;
                            const tColor   = TECH_COLORS[tab.key];
                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveTech(tab.key)}
                                    sx={{
                                        px: 3, py: 1,
                                        cursor: "pointer", userSelect: "none",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 13,
                                        color:      isActive ? "#fff" : tColor.tabColor,
                                        background: isActive ? tColor.active : "transparent",
                                        borderRadius: "8px 8px 0 0",
                                        borderBottom: isActive
                                            ? `3px solid ${tColor.tabColor}`
                                            : "3px solid transparent",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08),
                                        },
                                    }}
                                >
                                    {tab.label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Category filter */}
                    <CategoryFilterBar activeCategory={activeCategory} onChange={setActiveCategory} />

                    {/* Chart */}
                    <Box p={2.5}>
                        {activeMetric === "performance" && (
                            <ScftChart
                                title={METRIC_THEME.performance.label}
                                icon={METRIC_THEME.performance.icon}
                                gradientFrom={METRIC_THEME.performance.chartFrom}
                                gradientTo={METRIC_THEME.performance.chartTo}
                                chartData={perfChart}
                                seriesNames={perfSeries}
                                loading={loadingPerf}
                                seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
                                activeCategory={activeCategory}
                            />
                        )}
                        {activeMetric === "offered" && (
                            <ScftChart
                                title={METRIC_THEME.offered.label}
                                icon={METRIC_THEME.offered.icon}
                                gradientFrom={METRIC_THEME.offered.chartFrom}
                                gradientTo={METRIC_THEME.offered.chartTo}
                                chartData={offChart}
                                seriesNames={offSeries}
                                loading={loadingOff}
                                seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
                                activeCategory={activeCategory}
                            />
                        )}
                    </Box>
                </Paper>

                {/* ── Summary Strip ── */}
                {(performanceData || offeredData) && (
                    <Paper elevation={0} sx={{
                        display: "flex", gap: 1.5, flexWrap: "wrap",
                        p: 2, borderRadius: "14px",
                        bgcolor: "#fff",
                        border: "1px solid #e8ecf0",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>Range:</Typography>
                        <Chip
                            label={
                                selectedMonths.length === 1
                                    ? inputToApiMonth(selectedMonths[0])
                                    : `${inputToApiMonth(selectedMonths[0])} → ${inputToApiMonth(selectedMonths[selectedMonths.length - 1])}`
                            }
                            size="small"
                            sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Months:</Typography>
                        <Chip
                            label={selectedMonths.length}
                            size="small"
                            sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Tech:</Typography>
                        <Chip
                            label={activeTech}
                            size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Layer:</Typography>
                        <Chip
                            label={(performanceData?.layer || offeredData?.layer || "all").toUpperCase()}
                            size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Filter:</Typography>
                        <Chip
                            label={activeCategory === "ALL" ? "All Categories" : activeCategory}
                            size="small"
                            sx={{
                                background: CATEGORY_FILTERS.find(c => c.key === activeCategory)?.color ?? "#546e7a",
                                color: "#fff", fontWeight: 700, fontSize: 10.5,
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Series:</Typography>
                        <Chip
                            label={`Performance: ${perfSeries.length}  |  Offered: ${offSeries.length}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: 10.5 }}
                        />
                        {/* Month color legend */}
                        <Box display="flex" gap={0.8} flexWrap="wrap" ml={0.5}>
                            {selectedMonths.map((m, i) => (
                                <Chip
                                    key={m}
                                    label={inputToApiMonth(m)}
                                    size="small"
                                    sx={{
                                        background: SERIES_PALETTE[i % SERIES_PALETTE.length].stroke,
                                        color: "#fff", fontWeight: 600, fontSize: 10,
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                )}
            </Box>
        </>
    );
};

export default SCFT_Aging_Graph;



