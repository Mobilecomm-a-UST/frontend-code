// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Breadcrumbs,
//   Link,
//   Chip,
//   CircularProgress,
//   IconButton,
//   Tooltip as MuiTooltip,
//   alpha,
//   Select,
//   MenuItem,
//   Checkbox,
//   ListItemText,
//   Divider,
// } from "@mui/material";
// import {
//   ComposedChart,
//   Bar,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
//   LabelList,
// } from "recharts";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import RoomIcon from "@mui/icons-material/Room";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import ClearIcon from "@mui/icons-material/Clear";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices"; // adjust path to match your project structure

// /*
//   ==========================================================================
//   JSON SHAPE THIS COMPONENT CONSUMES  (both endpoints are POST — see
//   network screenshot: GET returns {"detail": "Method \"GET\" not allowed."})
//   ==========================================================================

//   1) CIRCLE-WISE API  ->  POST performance_idploy/generate-ftr-circle-graph/
//      {
//        status, layer, available_months: ["Apr 2026","May 2026","Jun 2026"],
//        circles: ["AP", ...],
//        graph_data: {
//          "4G": {
//            categories: ["FTR"],
//            series: [
//              { name: "Apr 2026", start, end, circles: { AP: 72.41, BR: 85.0, ... } },
//              ...
//            ]
//          },
//          "5G": { ... }, "4G+5G": { ... }
//        }
//      }
//      -> already returns EVERY available month in one call, so no month-range
//         loop is needed to fetch data — `available_months` is instead used to
//         power the client-side month-range FILTER (from/to selects).
//         One bar PER CIRCLE, grouped by month. This is the "circle trend".

//   2) GRAND TOTAL API  ->  POST performance_idploy/generate-ftr-grand-graph/
//      graph_data: {
//        "4G": {
//          categories: ["Total Site","Pending","Accepted with 0 counter",
//                        "Acceptance pending with 0 Counter","FTR"],
//          series: [
//            { name: "Apr 2026", data: [543,10,496,2,93.41], grand_total_ftr: 93.41 },
//            ...
//          ]
//        }, ...
//      }
//      -> grand_total_ftr per month becomes the purple "Overall" trend line
//         (its per-category `data` array is not rendered as a table anymore —
//         only the grand_total_ftr value is used).

//   Both are fetched in parallel with Promise.all (POST, empty FormData body —
//   the backend just doesn't accept GET), merged per month by matching on the
//   `name` field, and the 4G / 5G / 4G+5G tabs pick which slice of graph_data
//   is shown — same interaction pattern as Performance_Aging_Graph.jsx.
//   ==========================================================================
// */

// const CIRCLE_API = "performance_idploy/generate-ftr-circle-graph/";
// const GRAND_TOTAL_API = "performance_idploy/generate-ftr-grand-graph/";

// const TECH_TABS = [
//   { key: "4G", label: "4G" },
//   { key: "5G", label: "5G" },
//   { key: "4G+5G", label: "4G+5G" },
// ];

// const TECH_COLORS = {
//   "4G": { active: "linear-gradient(135deg,#1e3c72,#2a5298)", tabColor: "#1e3c72" },
//   "5G": { active: "linear-gradient(135deg,#134e5e,#71b280)", tabColor: "#134e5e" },
//   "4G+5G": { active: "linear-gradient(135deg,#41295a,#2F0743)", tabColor: "#41295a" },
// };

// const HEADER_GRADIENT_FROM = "#1e3c72";
// const HEADER_GRADIENT_TO = "#2a5298";

// // One distinct colour per circle (same palette family as the Aging Graph)
// const CIRCLE_BAR_COLORS = [
//   "#1565c0", "#e65100", "#2e7d32", "#0097a7", "#6a1b9a", "#c62828",
//   "#4e342e", "#37474f", "#558b2f", "#f57f17", "#00695c", "#283593",
// ];
// const getCircleBarColor = (idx) => CIRCLE_BAR_COLORS[idx % CIRCLE_BAR_COLORS.length];

// const OVERALL_LINE_COLOR = "#9c27b0";
// const PERCENT_AXIS_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// // ─────────────────────────────────────────────────────────────────────────────
// // SVG GRADIENT DEFS (one per circle colour)
// // ─────────────────────────────────────────────────────────────────────────────
// const CircleGradientDefs = ({ circleNames }) => (
//   <defs>
//     {circleNames.map((name, i) => {
//       const base = getCircleBarColor(i);
//       return (
//         <linearGradient key={`pftr-cg${i}`} id={`pftr-cg${i}`} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={base} stopOpacity={0.9} />
//           <stop offset="100%" stopColor={base} stopOpacity={0.6} />
//         </linearGradient>
//       );
//     })}
//   </defs>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM TOOLTIP / LABELS / X-TICK
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   const barEntries = payload.filter((p) => p.dataKey !== "Overall");
//   const lineEntries = payload.filter((p) => p.dataKey === "Overall");
//   return (
//     <Paper elevation={8} sx={{
//       p: 1.8, minWidth: 200, borderRadius: "12px",
//       border: "1px solid #e0e0e0", boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//       background: "rgba(255,255,255,0.98)",
//     }}>
//       <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
//         sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
//         {label}
//       </Typography>
//       {barEntries.map((entry) => (
//         <Box key={entry.dataKey} display="flex" alignItems="center" gap={1} mb={0.45}>
//           <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: entry.fill || entry.color, flexShrink: 0 }} />
//           <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.dataKey}</Typography>
//           <Typography fontSize={12} fontWeight={700} color={entry.fill || entry.color}>
//             {entry.value != null ? `${entry.value}%` : "—"}
//           </Typography>
//         </Box>
//       ))}
//       {lineEntries.map((entry) => (
//         <Box key="overall" display="flex" alignItems="center" gap={1} mt={0.6} pt={0.6}
//           sx={{ borderTop: "1px dashed #eee" }}>
//           <Box sx={{ width: 16, height: 3, bgcolor: OVERALL_LINE_COLOR, borderRadius: 2, flexShrink: 0 }} />
//           <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>Overall</Typography>
//           <Typography fontSize={12} fontWeight={700} color={OVERALL_LINE_COLOR}>
//             {entry.value != null ? `${entry.value}%` : "—"}
//           </Typography>
//         </Box>
//       ))}
//     </Paper>
//   );
// };

// const BarTopLabel = ({ x, y, width, value, labelColor }) => {
//   if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
//   return (
//     <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={labelColor ?? "#555"}>
//       {value}
//     </text>
//   );
// };

// const LineTopLabel = ({ x, y, value }) => {
//   if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
//   return (
//     <text x={x} y={y - 10} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={OVERALL_LINE_COLOR}>
//       {value}%
//     </text>
//   );
// };

// const CustomXTick = ({ x, y, payload }) => (
//   <text x={x} y={y + 14} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={600}>
//     {payload.value}
//   </text>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // CIRCLE MULTI-SELECT FILTER
// // ─────────────────────────────────────────────────────────────────────────────
// const CircleMultiFilter = ({ circles, selectedCircles, onChange }) => {
//   if (!circles?.length) return null;
//   const isAllActive = selectedCircles.length === 0;

//   const handleSelectChange = (e) => {
//     const val = e.target.value;
//     if (val.includes("NONE")) { onChange([]); return; }
//     onChange(val);
//   };

//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <RoomIcon sx={{ fontSize: 17, color: "#607d8b" }} />
//       <Select
//         size="small"
//         multiple
//         value={isAllActive ? [] : selectedCircles}
//         onChange={handleSelectChange}
//         displayEmpty
//         renderValue={(selected) => {
//           if (!selected || selected.length === 0) return "All Circles";
//           if (selected.length === 1) return selected[0];
//           return `${selected.length} circles`;
//         }}
//         sx={{
//           minWidth: 170, maxWidth: 230, borderRadius: "10px", fontSize: 13,
//           fontWeight: 600, bgcolor: "#fff",
//           "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c4c4c4" },
//           "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72" },
//           "& .MuiSelect-select": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
//         }}
//         MenuProps={{ PaperProps: { sx: { maxHeight: 380 } } }}
//       >
//         <MenuItem value="NONE" sx={{ fontSize: 13, fontWeight: 700, color: "#c62828" }}>
//           <Checkbox checked={false} size="small" sx={{ p: 0.4, mr: 0.5 }} />
//           <ListItemText primary="Clear / All Circles" />
//         </MenuItem>
//         <Divider />
//         {circles.map((c, i) => (
//           <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
//             <Checkbox
//               checked={!isAllActive && selectedCircles.includes(c)}
//               size="small"
//               sx={{ p: 0.4, mr: 0.5, color: getCircleBarColor(i), "&.Mui-checked": { color: getCircleBarColor(i) } }}
//             />
//             <ListItemText primary={c} />
//           </MenuItem>
//         ))}
//       </Select>
//     </Box>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MONTH RANGE FILTER (from / to, sourced from `available_months`)
// // ─────────────────────────────────────────────────────────────────────────────
// const MonthRangeFilter = ({ months, monthFrom, monthTo, onChange }) => {
//   if (!months?.length) return null;
//   const selectSx = {
//     minWidth: 128, borderRadius: "10px", fontSize: 13, fontWeight: 600, bgcolor: "#fff",
//     "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c4c4c4" },
//     "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72" },
//   };

//   return (
//     <Box display="flex" alignItems="center" gap={0.8}>
//       <DateRangeIcon sx={{ fontSize: 17, color: "#607d8b" }} />
//       <Select
//         size="small"
//         value={monthFrom || ""}
//         displayEmpty
//         onChange={(e) => onChange({ from: e.target.value, to: monthTo })}
//         sx={selectSx}
//       >
//         <MenuItem value="" sx={{ fontSize: 13 }}><em>From</em></MenuItem>
//         {months.map((m) => (
//           <MenuItem key={`from-${m}`} value={m} sx={{ fontSize: 13 }}>{m}</MenuItem>
//         ))}
//       </Select>
//       <Typography fontSize={12} color="text.secondary">→</Typography>
//       <Select
//         size="small"
//         value={monthTo || ""}
//         displayEmpty
//         onChange={(e) => onChange({ from: monthFrom, to: e.target.value })}
//         sx={selectSx}
//       >
//         <MenuItem value="" sx={{ fontSize: 13 }}><em>To</em></MenuItem>
//         {months.map((m) => (
//           <MenuItem key={`to-${m}`} value={m} sx={{ fontSize: 13 }}>{m}</MenuItem>
//         ))}
//       </Select>
//       {(monthFrom || monthTo) && (
//         <MuiTooltip title="Reset month range" arrow>
//           <IconButton size="small" onClick={() => onChange({ from: "", to: "" })} sx={{ p: 0.4 }}>
//             <ClearIcon sx={{ fontSize: 15, color: "#c62828" }} />
//           </IconButton>
//         </MuiTooltip>
//       )}
//     </Box>
//   );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// function PerformanceFTRGraph() {
//   const navigate = useNavigate();

//   const [tech, setTech] = useState("4G");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedCircles, setSelectedCircles] = useState([]);

//   const [circleGraphData, setCircleGraphData] = useState(null);
//   const [grandGraphData, setGrandGraphData] = useState(null);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [monthRange, setMonthRange] = useState({ from: "", to: "" });

//   const requestIdRef = React.useRef(0);

//   const fetchAll = React.useCallback(() => {
//     const myRequestId = ++requestIdRef.current;
//     setLoading(true);
//     setError(null);

//     // Both endpoints only accept POST — send an empty FormData body.
//     const postEmpty = (endpoint) =>
//       postData(endpoint, new FormData())
//         .then((res) => (res?.status ? res : null))
//         .catch(() => null);

//     Promise.all([postEmpty(CIRCLE_API), postEmpty(GRAND_TOTAL_API)])
//       .then(([circleRes, grandRes]) => {
//         if (requestIdRef.current !== myRequestId) return; // stale
//         if (!circleRes && !grandRes) {
//           setError("Unable to load Performance FTR data. Please try again.");
//         }
//         setCircleGraphData(circleRes?.graph_data || {});
//         setGrandGraphData(grandRes?.graph_data || {});
//         setAvailableMonths(circleRes?.available_months || grandRes?.available_months || []);
//       })
//       .finally(() => {
//         if (requestIdRef.current === myRequestId) setLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const allCircleNames = useMemo(() => {
//     if (!circleGraphData || !circleGraphData[tech]) return [];
//     const set = new Set();
//     circleGraphData[tech].series.forEach((s) => {
//       Object.keys(s.circles || {}).forEach((c) => set.add(c));
//     });
//     return Array.from(set).sort();
//   }, [circleGraphData, tech]);

//   useEffect(() => {
//     if (selectedCircles.length && allCircleNames.length) {
//       const next = selectedCircles.filter((c) => allCircleNames.includes(c));
//       if (next.length !== selectedCircles.length) setSelectedCircles(next);
//     }
//   }, [allCircleNames]); // eslint-disable-line

//   const circleNames = useMemo(() => {
//     if (!selectedCircles.length) return allCircleNames;
//     return allCircleNames.filter((c) => selectedCircles.includes(c));
//   }, [allCircleNames, selectedCircles]);

//   const chartData = useMemo(() => {
//     if (!circleGraphData || !circleGraphData[tech]) return [];
//     const circleSeries = circleGraphData[tech].series || [];
//     const grandSeries = (grandGraphData && grandGraphData[tech]?.series) || [];
//     const grandByMonth = {};
//     grandSeries.forEach((g) => { grandByMonth[g.name] = g; });

//     return circleSeries.map((s) => {
//       const row = { month: s.name };
//       circleNames.forEach((c) => { row[c] = s.circles?.[c] ?? null; });
//       const grand = grandByMonth[s.name];
//       row.Overall = grand?.grand_total_ftr ?? null;
//       return row;
//     });
//   }, [circleGraphData, grandGraphData, tech, circleNames]);

//   // Months available to pick in the range filter — prefer the API's
//   // `available_months` (authoritative ordering), fall back to whatever
//   // months are present in the current tab's data.
//   const monthsForFilter = useMemo(() => {
//     if (availableMonths.length) return availableMonths;
//     return chartData.map((r) => r.month);
//   }, [availableMonths, chartData]);

//   // Reset an out-of-range selection if the month list changes underneath it.
//   useEffect(() => {
//     if (!monthsForFilter.length) return;
//     setMonthRange((prev) => {
//       const fromOk = !prev.from || monthsForFilter.includes(prev.from);
//       const toOk = !prev.to || monthsForFilter.includes(prev.to);
//       if (fromOk && toOk) return prev;
//       return { from: fromOk ? prev.from : "", to: toOk ? prev.to : "" };
//     });
//   }, [monthsForFilter]);

//   const filteredChartData = useMemo(() => {
//     if (!chartData.length) return chartData;
//     const order = monthsForFilter.length ? monthsForFilter : chartData.map((r) => r.month);
//     const fromIdx = monthRange.from ? order.indexOf(monthRange.from) : 0;
//     const toIdx = monthRange.to ? order.indexOf(monthRange.to) : order.length - 1;
//     if (fromIdx === -1 || toIdx === -1) return chartData;
//     const [lo, hi] = fromIdx <= toIdx ? [fromIdx, toIdx] : [toIdx, fromIdx];
//     const loMonth = order[lo];
//     const hiMonth = order[hi];
//     const loPos = chartData.findIndex((r) => r.month === loMonth);
//     const hiPos = chartData.findIndex((r) => r.month === hiMonth);
//     if (loPos === -1 || hiPos === -1) return chartData;
//     return chartData.slice(loPos, hiPos + 1);
//   }, [chartData, monthRange, monthsForFilter]);

//   const hasData = filteredChartData.length > 0 && circleNames.length > 0;
//   const numCircles = circleNames.length;
//   const maxBarSize = numCircles <= 2 ? 44 : numCircles <= 4 ? 32 : numCircles <= 6 ? 24 : 16;
//   const chartHeight = Math.max(420, 380 + Math.max(0, numCircles - 4) * 14);
//   const hasOverall = filteredChartData.some((row) => row.Overall != null);

//   const monthLabel = filteredChartData.length
//     ? (filteredChartData.length === 1
//         ? filteredChartData[0].month
//         : `${filteredChartData[0].month} → ${filteredChartData[filteredChartData.length - 1].month}`)
//     : "";

//   return (
//     <>
//       <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
//         <Breadcrumbs aria-label="breadcrumb" maxItems={3}
//           separator={<KeyboardArrowRightIcon fontSize="small" />}>
//           <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>Tools</Link>
//           <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
//           <Typography color="text.primary">Performance FTR Graph</Typography>
//         </Breadcrumbs>
//       </Box>

//       <Box p={1.5}>
//         {/* Top bar */}
//         <Paper elevation={0} sx={{
//           display: "flex", justifyContent: "space-between", alignItems: "center",
//           flexWrap: "wrap", gap: 2, mb: 2.5, px: 2.5, py: 2,
//           borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff",
//           boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
//         }}>
//           <Box>
//             <Typography fontWeight={800} fontSize={20} letterSpacing="-.3px" color="#1a1a2e">
//               Performance FTR Graph
//             </Typography>
//             <Typography fontSize={13} color="text.secondary" mt={0.2}>
//               Circles as bars per month · Overall (grand total) as trend line
//             </Typography>
//           </Box>
//           <MuiTooltip title="Refresh data" arrow>
//             <span>
//               <IconButton
//                 onClick={fetchAll}
//                 size="small"
//                 disabled={loading}
//                 sx={{ bgcolor: alpha("#1e3c72", 0.08), borderRadius: "10px", "&:hover": { bgcolor: alpha("#1e3c72", 0.15) } }}
//               >
//                 <RefreshIcon
//                   fontSize="small"
//                   sx={{
//                     color: "#1e3c72",
//                     animation: loading ? "spin .8s linear infinite" : "none",
//                     "@keyframes spin": { to: { transform: "rotate(360deg)" } },
//                   }}
//                 />
//               </IconButton>
//             </span>
//           </MuiTooltip>
//         </Paper>

//         {/* Tabs + filters + chart card */}
//         <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", mb: 2 }}>
//           {/* Tech tabs */}
//           <Box sx={{ display: "flex", borderBottom: "1.5px solid #e8ecf0", bgcolor: "#f8fafc", px: 1.5, pt: 0.5 }}>
//             {TECH_TABS.map((tab) => {
//               const isActive = tech === tab.key;
//               const tColor = TECH_COLORS[tab.key];
//               return (
//                 <Box key={tab.key} onClick={() => setTech(tab.key)}
//                   sx={{
//                     px: 3, py: 1, cursor: "pointer", userSelect: "none",
//                     fontWeight: isActive ? 700 : 500, fontSize: 13,
//                     color: isActive ? "#fff" : tColor.tabColor,
//                     background: isActive ? tColor.active : "transparent",
//                     borderRadius: "8px 8px 0 0",
//                     borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
//                     transition: "all 0.2s",
//                     "&:hover": { background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08) },
//                   }}>
//                   {tab.label}
//                 </Box>
//               );
//             })}
//           </Box>

//           {/* Filter row — month range (left) + circle filter (right) */}
//           <Box sx={{
//             display: "flex", justifyContent: "space-between", alignItems: "center",
//             flexWrap: "wrap", gap: 1.5, px: 2, py: 1.4, bgcolor: "#f8fafc", borderBottom: "1px solid #e8ecf0",
//           }}>
//             <MonthRangeFilter
//               months={monthsForFilter}
//               monthFrom={monthRange.from}
//               monthTo={monthRange.to}
//               onChange={setMonthRange}
//             />
//             <CircleMultiFilter circles={allCircleNames} selectedCircles={selectedCircles} onChange={setSelectedCircles} />
//           </Box>

//           {/* Chart panel */}
//           <Box sx={{
//             borderRadius: 0, overflow: "hidden", background: "#fff",
//           }}>
//             <Box sx={{
//               background: `linear-gradient(135deg, ${HEADER_GRADIENT_FROM} 0%, ${HEADER_GRADIENT_TO} 100%)`,
//               px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
//               flexWrap: "wrap", gap: 1,
//             }}>
//               <Box display="flex" alignItems="center" gap={1.2}>
//                 <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />
//                 <Typography fontWeight={700} fontSize={15} color="#fff">
//                   Performance FTR — {tech}
//                 </Typography>
//               </Box>
//               {monthLabel && (
//                 <Chip label={monthLabel} size="small"
//                   sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//               )}
//             </Box>

//             <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
//               {loading ? (
//                 <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={2}>
//                   <CircularProgress size={40} sx={{ color: HEADER_GRADIENT_FROM }} />
//                   <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
//                 </Box>
//               ) : error ? (
//                 <Typography color="error" py={4} textAlign="center">{error}</Typography>
//               ) : !hasData ? (
//                 <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={1.5}>
//                   <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: alpha(HEADER_GRADIENT_FROM, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
//                     <BarChartIcon sx={{ color: HEADER_GRADIENT_FROM, fontSize: 28 }} />
//                   </Box>
//                   <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
//                   <Typography fontSize={12} color="text.disabled">Try adjusting the circle or month filter</Typography>
//                 </Box>
//               ) : (
//                 <>
//                   {!hasOverall && (
//                     <Typography fontSize={11.5} color="#c62828" fontWeight={600} mb={1}>
//                       Overall (grand total) data unavailable — the grand-total endpoint returned no matching month entries.
//                     </Typography>
//                   )}
//                   <ResponsiveContainer width="100%" height={chartHeight}>
//                     <ComposedChart data={filteredChartData} margin={{ top: 32, right: 52, left: 0, bottom: 8 }} barCategoryGap="28%" barGap={3}>
//                       <CircleGradientDefs circleNames={circleNames} />
//                       <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />
//                       <XAxis dataKey="month" tick={<CustomXTick />} axisLine={{ stroke: "#dde3ea" }} tickLine={false} height={34} />
//                       <YAxis yAxisId="left" domain={[0, 100]} ticks={PERCENT_AXIS_TICKS} tick={{ fontSize: 11, fill: "#90a4ae" }} axisLine={false} tickLine={false} width={42} />
//                       <YAxis yAxisId="right" orientation="right" domain={[0, 100]} ticks={PERCENT_AXIS_TICKS} tick={{ fontSize: 11, fill: OVERALL_LINE_COLOR }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={46} />
//                       <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }} />
//                       <Legend
//                         wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
//                         iconSize={11}
//                         formatter={(value) => {
//                           if (value === "Overall") return <span style={{ color: OVERALL_LINE_COLOR, fontWeight: 700, fontSize: 11.5 }}>Overall</span>;
//                           const idx = circleNames.indexOf(value);
//                           return <span style={{ color: getCircleBarColor(idx >= 0 ? idx : 0), fontWeight: 700, fontSize: 11.5 }}>{value}</span>;
//                         }}
//                       />
//                       {circleNames.map((circleName, i) => (
//                         <Bar key={circleName} yAxisId="left" dataKey={circleName} fill={`url(#pftr-cg${i})`} radius={[4, 4, 0, 0]} maxBarSize={maxBarSize} legendType="square">
//                           <LabelList dataKey={circleName} content={(props) => <BarTopLabel {...props} labelColor={getCircleBarColor(i)} />} />
//                         </Bar>
//                       ))}
//                       <Line yAxisId="right" type="monotone" dataKey="Overall" stroke={OVERALL_LINE_COLOR} strokeWidth={2.5} dot={{ r: 5, fill: OVERALL_LINE_COLOR, strokeWidth: 0 }} activeDot={{ r: 7 }} connectNulls legendType="line">
//                         <LabelList dataKey="Overall" content={(props) => <LineTopLabel {...props} />} />
//                       </Line>
//                     </ComposedChart>
//                   </ResponsiveContainer>
//                 </>
//               )}
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </>
//   );
// }

// export default PerformanceFTRGraph;

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip as MuiTooltip,
  alpha,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import RoomIcon from "@mui/icons-material/Room";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ClearIcon from "@mui/icons-material/Clear";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices"; // adjust path to match your project structure

/*
  ==========================================================================
  JSON SHAPE THIS COMPONENT CONSUMES  (both endpoints are POST — see
  network screenshot: GET returns {"detail": "Method \"GET\" not allowed."})
  ==========================================================================

  1) CIRCLE-WISE API  ->  POST performance_idploy/generate-ftr-circle-graph/
     {
       status, layer, available_months: ["Apr 2026","May 2026","Jun 2026"],
       circles: ["AP", ...],
       graph_data: {
         "4G": {
           categories: ["FTR"],
           series: [
             { name: "Apr 2026", start, end, circles: { AP: 72.41, BR: 85.0, ... } },
             ...
           ]
         },
         "5G": { ... }, "4G+5G": { ... }
       }
     }
     -> already returns EVERY available month in one call, so no month-range
        loop is needed to fetch data — `available_months` is instead used to
        power the client-side month-range FILTER (from/to selects).
        One bar PER CIRCLE, grouped by month. This is the "circle trend".

  2) GRAND TOTAL API  ->  POST performance_idploy/generate-ftr-grand-graph/
     graph_data: {
       "4G": {
         categories: ["Total Site","Pending","Accepted with 0 counter",
                       "Acceptance pending with 0 Counter","FTR"],
         series: [
           { name: "Apr 2026", data: [543,10,496,2,93.41], grand_total_ftr: 93.41 },
           ...
         ]
       }, ...
     }
     -> grand_total_ftr per month becomes the purple "Overall" trend line
        when the "FTR"/"All" filter is active. When one of the OTHER
        categories is selected (Total Site / Pending / Accepted with 0
        counter / Acceptance pending with 0 Counter), that category has no
        per-circle breakdown, so the chart instead shows a single grand-total
        bar per month (pulled from this same `data` array via the matching
        `categories` index) and the Overall line is hidden.

  Both are fetched in parallel with Promise.all (POST, empty FormData body —
  the backend just doesn't accept GET), merged per month by matching on the
  `name` field, and the 4G / 5G / 4G+5G tabs pick which slice of graph_data
  is shown — same interaction pattern as Performance_Aging_Graph.jsx.
  ==========================================================================
*/

const CIRCLE_API = "performance_idploy/generate-ftr-circle-graph/";
const GRAND_TOTAL_API = "performance_idploy/generate-ftr-grand-graph/";

const TECH_TABS = [
  { key: "4G", label: "4G" },
  { key: "5G", label: "5G" },
  { key: "4G+5G", label: "4G+5G" },
];

const TECH_COLORS = {
  "4G": { active: "linear-gradient(135deg,#1e3c72,#2a5298)", tabColor: "#1e3c72" },
  "5G": { active: "linear-gradient(135deg,#134e5e,#71b280)", tabColor: "#134e5e" },
  "4G+5G": { active: "linear-gradient(135deg,#41295a,#2F0743)", tabColor: "#41295a" },
};

const HEADER_GRADIENT_FROM = "#1e3c72";
const HEADER_GRADIENT_TO = "#2a5298";

// One distinct colour per circle (same palette family as the Aging Graph)
const CIRCLE_BAR_COLORS = [
  "#1565c0", "#e65100", "#2e7d32", "#0097a7", "#6a1b9a", "#c62828",
  "#4e342e", "#37474f", "#558b2f", "#f57f17", "#00695c", "#283593",
];
const getCircleBarColor = (idx) => CIRCLE_BAR_COLORS[idx % CIRCLE_BAR_COLORS.length];

const OVERALL_LINE_COLOR = "#9c27b0";
const PERCENT_AXIS_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FILTER (grand-total categories, "Total Site" -> "FTR")
// "All" and "FTR" both map to the original circle-wise + Overall-line view;
// the other four categories only exist as grand totals (no per-circle split),
// so they render as a single bar per month instead.
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Total Site",
  "Pending",
  "Accepted with 0 counter",
  "Acceptance pending with 0 Counter",
//   "FTR",
];

const CATEGORY_FILTERS = [
  { key: "All", label: "All", color: "#37474f" },
  { key: "Total Site", label: "Total Site", color: "#1565c0" },
  { key: "Pending", label: "Pending", color: "#c62828" },
  { key: "Accepted with 0 counter", label: "Accepted with 0 counter", color: "#2e7d32" },
  { key: "Acceptance pending with 0 Counter", label: "Acceptance pending with 0 Counter", color: "#6a1b9a" },
//   { key: "FTR", label: "FTR", color: "#ef6c00" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MONTH <-> "MMM YYYY" HELPERS (used by the native month-range inputs)
// ─────────────────────────────────────────────────────────────────────────────
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getCurrentMonthName = () => {
  const d = new Date();
  return `${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`;
};

const monthNameToInputValue = (name) => {
  if (!name) return "";
  const [abbr, year] = name.split(" ");
  const idx = MONTH_ABBR.indexOf(abbr);
  if (idx === -1 || !year) return "";
  return `${year}-${String(idx + 1).padStart(2, "0")}`;
};

const inputValueToMonthName = (val) => {
  if (!val) return "";
  const [year, month] = val.split("-");
  const idx = parseInt(month, 10) - 1;
  if (Number.isNaN(idx) || idx < 0 || idx > 11 || !year) return "";
  return `${MONTH_ABBR[idx]} ${year}`;
};

const monthNameToSortKey = (name) => {
  if (!name) return null;
  const [abbr, year] = name.split(" ");
  const idx = MONTH_ABBR.indexOf(abbr);
  if (idx === -1 || !year) return null;
  return parseInt(year, 10) * 12 + idx;
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG GRADIENT DEFS (one per circle colour)
// ─────────────────────────────────────────────────────────────────────────────
const CircleGradientDefs = ({ circleNames }) => (
  <defs>
    {circleNames.map((name, i) => {
      const base = getCircleBarColor(i);
      return (
        <linearGradient key={`pftr-cg${i}`} id={`pftr-cg${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={base} stopOpacity={0.9} />
          <stop offset="100%" stopColor={base} stopOpacity={0.6} />
        </linearGradient>
      );
    })}
  </defs>
);

// Single-colour gradient, used for the grand-total (non-FTR) category bar
const SingleGradientDef = ({ color }) => (
  <defs>
    <linearGradient id="pftr-single" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
      <stop offset="100%" stopColor={color} stopOpacity={0.6} />
    </linearGradient>
  </defs>
);

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM TOOLTIP / LABELS / X-TICK
// ─────────────────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, isPercent = true }) => {
  if (!active || !payload?.length) return null;
  const barEntries = payload.filter((p) => p.dataKey !== "Overall");
  const lineEntries = payload.filter((p) => p.dataKey === "Overall");
  return (
    <Paper elevation={8} sx={{
      p: 1.8, minWidth: 200, borderRadius: "12px",
      border: "1px solid #e0e0e0", boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
      background: "rgba(255,255,255,0.98)",
    }}>
      <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
        sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
        {label}
      </Typography>
      {barEntries.map((entry) => (
        <Box key={entry.dataKey} display="flex" alignItems="center" gap={1} mb={0.45}>
          <Box sx={{ width: 12, height: 12, borderRadius: "3px", bgcolor: entry.fill || entry.color, flexShrink: 0 }} />
          <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.dataKey}</Typography>
          <Typography fontSize={12} fontWeight={700} color={entry.fill || entry.color}>
            {entry.value != null ? (isPercent ? `${entry.value}%` : entry.value) : "—"}
          </Typography>
        </Box>
      ))}
      {lineEntries.map((entry) => (
        <Box key="overall" display="flex" alignItems="center" gap={1} mt={0.6} pt={0.6}
          sx={{ borderTop: "1px dashed #eee" }}>
          <Box sx={{ width: 16, height: 3, bgcolor: OVERALL_LINE_COLOR, borderRadius: 2, flexShrink: 0 }} />
          <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>Overall</Typography>
          <Typography fontSize={12} fontWeight={700} color={OVERALL_LINE_COLOR}>
            {entry.value != null ? `${entry.value}%` : "—"}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

const BarTopLabel = ({ x, y, width, value, labelColor }) => {
  if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x + width / 2} y={y - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={labelColor ?? "#555"}>
      {value}
    </text>
  );
};

const LineTopLabel = ({ x, y, value }) => {
  if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={OVERALL_LINE_COLOR}>
      {value}%
    </text>
  );
};

const CustomXTick = ({ x, y, payload }) => (
  <text x={x} y={y + 14} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={600}>
    {payload.value}
  </text>
);

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY FILTER BAR (Total Site / Pending / Accepted with 0 counter /
// Acceptance pending with 0 Counter / FTR / All) — single select, pill chips
// ─────────────────────────────────────────────────────────────────────────────
const CategoryFilterBar = ({ active, onChange }) => (
  <Box sx={{
    display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1,
    px: 2, py: 1.4, bgcolor: "#fff", borderBottom: "1px solid #e8ecf0",
  }}>
    <Box display="flex" alignItems="center" gap={0.6} mr={0.5}>
      <FilterAltIcon sx={{ fontSize: 17, color: "#607d8b" }} />
      <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
    </Box>
    {CATEGORY_FILTERS.map((c) => {
      const isActive = active === c.key;
      return (
        <Chip
          key={c.key}
          label={c.label}
          size="small"
          onClick={() => onChange(c.key)}
          sx={{
            fontWeight: 700,
            fontSize: 12,
            borderRadius: "20px",
            cursor: "pointer",
            border: `1.5px solid ${c.color}`,
            bgcolor: isActive ? c.color : "#fff",
            color: isActive ? "#fff" : c.color,
            transition: "all 0.15s",
            "&:hover": { bgcolor: isActive ? c.color : alpha(c.color, 0.08) },
          }}
        />
      );
    })}
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
// CIRCLE MULTI-SELECT FILTER
// ─────────────────────────────────────────────────────────────────────────────
const CircleMultiFilter = ({ circles, selectedCircles, onChange }) => {
  if (!circles?.length) return null;
  const isAllActive = selectedCircles.length === 0;

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val.includes("NONE")) { onChange([]); return; }
    onChange(val);
  };

  return (
    <Box display="flex" alignItems="center" gap={0.8}>
      <RoomIcon sx={{ fontSize: 17, color: "#607d8b" }} />
      <Select
        size="small"
        multiple
        value={isAllActive ? [] : selectedCircles}
        onChange={handleSelectChange}
        displayEmpty
        renderValue={(selected) => {
          if (!selected || selected.length === 0) return "All Circles";
          if (selected.length === 1) return selected[0];
          return `${selected.length} circles`;
        }}
        sx={{
          minWidth: 170, maxWidth: 230, borderRadius: "10px", fontSize: 13,
          fontWeight: 600, bgcolor: "#fff",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c4c4c4" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72" },
          "& .MuiSelect-select": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
        }}
        MenuProps={{ PaperProps: { sx: { maxHeight: 380 } } }}
      >
        <MenuItem value="NONE" sx={{ fontSize: 13, fontWeight: 700, color: "#c62828" }}>
          <Checkbox checked={false} size="small" sx={{ p: 0.4, mr: 0.5 }} />
          <ListItemText primary="Clear / All Circles" />
        </MenuItem>
        <Divider />
        {circles.map((c, i) => (
          <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
            <Checkbox
              checked={!isAllActive && selectedCircles.includes(c)}
              size="small"
              sx={{ p: 0.4, mr: 0.5, color: getCircleBarColor(i), "&.Mui-checked": { color: getCircleBarColor(i) } }}
            />
            <ListItemText primary={c} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MONTH RANGE FILTER — native <input type="month"> pickers (From / To),
// defaults to the current month, shows a duration badge + reset button.
// Being a native picker it isn't limited to `available_months`: any month in
// any year (2026 or earlier) can be picked directly from the browser's
// built-in month/year calendar.
// ─────────────────────────────────────────────────────────────────────────────
const MonthRangeFilter = ({ monthFrom, monthTo, onChange, onReset }) => {
  const fromKey = monthNameToSortKey(monthFrom);
  const toKey = monthNameToSortKey(monthTo);
  const durationLabel = useMemo(() => {
    if (fromKey == null || toKey == null) return null;
    const span = Math.abs(toKey - fromKey) + 1;
    return `${span} month${span > 1 ? "s" : ""}`;
  }, [fromKey, toKey]);

  const inputSx = {
    border: "1.5px solid #c4c4c4",
    borderRadius: "10px",
    padding: "6px 10px",
    fontSize: 13,
    fontWeight: 600,
    color: "#37474f",
    bgcolor: "#fff",
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.4,
    "&:hover": { borderColor: "#1e3c72" },
    "&:focus": { borderColor: "#1e3c72" },
  };

  return (
    <Box display="flex" alignItems="flex-end" gap={1.2} flexWrap="wrap">
      <Box display="flex" flexDirection="column" gap={0.3}>
        <Typography fontSize={10.5} fontWeight={600} color="#90a4ae">From</Typography>
        <Box
          component="input"
          type="month"
          value={monthNameToInputValue(monthFrom)}
          onChange={(e) => onChange({ from: inputValueToMonthName(e.target.value), to: monthTo })}
          sx={inputSx}
        />
      </Box>
      <Typography fontSize={16} color="#90a4ae" pb={0.8}>→</Typography>
      <Box display="flex" flexDirection="column" gap={0.3}>
        <Typography fontSize={10.5} fontWeight={600} color="#90a4ae">To</Typography>
        <Box
          component="input"
          type="month"
          value={monthNameToInputValue(monthTo)}
          onChange={(e) => onChange({ from: monthFrom, to: inputValueToMonthName(e.target.value) })}
          sx={inputSx}
        />
      </Box>
      {durationLabel && (
        <Chip label={durationLabel} size="small"
          sx={{ bgcolor: alpha("#1e3c72", 0.1), color: "#1e3c72", fontWeight: 700, fontSize: 11.5, mb: 0.4 }} />
      )}
      <MuiTooltip title="Reset to current month" arrow>
        <IconButton size="small" onClick={onReset} sx={{ mb: 0.3, color: "#1e3c72" }}>
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </MuiTooltip>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function PerformanceFTRGraph() {
  const navigate = useNavigate();

  const [tech, setTech] = useState("4G");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCircles, setSelectedCircles] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All"); // "All" | "FTR" | one of CATEGORIES

  const [circleGraphData, setCircleGraphData] = useState(null);
  const [grandGraphData, setGrandGraphData] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);
  // Defaults to the current month on load (e.g. "Jul 2026")
  const [monthRange, setMonthRange] = useState({ from: getCurrentMonthName(), to: getCurrentMonthName() });

  const requestIdRef = React.useRef(0);

  const fetchAll = React.useCallback(() => {
    const myRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    // Both endpoints only accept POST — send an empty FormData body.
    const postEmpty = (endpoint) =>
      postData(endpoint, new FormData())
        .then((res) => (res?.status ? res : null))
        .catch(() => null);

    Promise.all([postEmpty(CIRCLE_API), postEmpty(GRAND_TOTAL_API)])
      .then(([circleRes, grandRes]) => {
        if (requestIdRef.current !== myRequestId) return; // stale
        if (!circleRes && !grandRes) {
          setError("Unable to load Performance FTR data. Please try again.");
        }
        setCircleGraphData(circleRes?.graph_data || {});
        setGrandGraphData(grandRes?.graph_data || {});
        setAvailableMonths(circleRes?.available_months || grandRes?.available_months || []);
      })
      .finally(() => {
        if (requestIdRef.current === myRequestId) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // "All" behaves exactly like "FTR": circle-wise bars + Overall trend line.
  const isCircleView = categoryFilter === "All" || categoryFilter === "FTR";
  const categoryColor = CATEGORY_FILTERS.find((c) => c.key === categoryFilter)?.color || "#555";

  const allCircleNames = useMemo(() => {
    if (!circleGraphData || !circleGraphData[tech]) return [];
    const set = new Set();
    circleGraphData[tech].series.forEach((s) => {
      Object.keys(s.circles || {}).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, [circleGraphData, tech]);

  useEffect(() => {
    if (selectedCircles.length && allCircleNames.length) {
      const next = selectedCircles.filter((c) => allCircleNames.includes(c));
      if (next.length !== selectedCircles.length) setSelectedCircles(next);
    }
  }, [allCircleNames]); // eslint-disable-line

  const circleNames = useMemo(() => {
    if (!selectedCircles.length) return allCircleNames;
    return allCircleNames.filter((c) => selectedCircles.includes(c));
  }, [allCircleNames, selectedCircles]);

  // Circle-wise bars + Overall FTR line ("All" / "FTR" filter)
  const chartData = useMemo(() => {
    if (!circleGraphData || !circleGraphData[tech]) return [];
    const circleSeries = circleGraphData[tech].series || [];
    const grandSeries = (grandGraphData && grandGraphData[tech]?.series) || [];
    const grandByMonth = {};
    grandSeries.forEach((g) => { grandByMonth[g.name] = g; });

    return circleSeries.map((s) => {
      const row = { month: s.name };
      circleNames.forEach((c) => { row[c] = s.circles?.[c] ?? null; });
      const grand = grandByMonth[s.name];
      row.Overall = grand?.grand_total_ftr ?? null;
      return row;
    });
  }, [circleGraphData, grandGraphData, tech, circleNames]);

  // Single grand-total bar per month (Total Site / Pending / Accepted with 0
  // counter / Acceptance pending with 0 Counter filter)
  const grandCategoryChartData = useMemo(() => {
    if (isCircleView) return [];
    const grandSeries = (grandGraphData && grandGraphData[tech]?.series) || [];
    const categories = (grandGraphData && grandGraphData[tech]?.categories) || CATEGORIES;
    const catIdx = categories.indexOf(categoryFilter);
    return grandSeries.map((g) => ({
      month: g.name,
      [categoryFilter]: catIdx >= 0 ? g.data?.[catIdx] ?? null : null,
    }));
  }, [grandGraphData, tech, categoryFilter, isCircleView]);

  const effectiveChartData = isCircleView ? chartData : grandCategoryChartData;

  const resetMonthRange = () => setMonthRange({ from: getCurrentMonthName(), to: getCurrentMonthName() });

  const filteredChartData = useMemo(() => {
    if (!effectiveChartData.length) return effectiveChartData;
    let fromKey = monthNameToSortKey(monthRange.from);
    let toKey = monthNameToSortKey(monthRange.to);
    if (fromKey == null && toKey == null) return effectiveChartData;
    if (fromKey != null && toKey != null && fromKey > toKey) {
      [fromKey, toKey] = [toKey, fromKey];
    }
    return effectiveChartData.filter((row) => {
      const k = monthNameToSortKey(row.month);
      if (k == null) return true;
      if (fromKey != null && k < fromKey) return false;
      if (toKey != null && k > toKey) return false;
      return true;
    });
  }, [effectiveChartData, monthRange]);

  const hasData = filteredChartData.length > 0 && (isCircleView ? circleNames.length > 0 : true);
  const numCircles = isCircleView ? circleNames.length : 1;
  const maxBarSize = isCircleView
    ? (numCircles <= 2 ? 44 : numCircles <= 4 ? 32 : numCircles <= 6 ? 24 : 16)
    : 52;
  const chartHeight = isCircleView ? Math.max(420, 380 + Math.max(0, numCircles - 4) * 14) : 420;
  const hasOverall = isCircleView && filteredChartData.some((row) => row.Overall != null);

  const monthLabel = filteredChartData.length
    ? (filteredChartData.length === 1
        ? filteredChartData[0].month
        : `${filteredChartData[0].month} → ${filteredChartData[filteredChartData.length - 1].month}`)
    : "";

  return (
    <>
      <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
        <Breadcrumbs aria-label="breadcrumb" maxItems={3}
          separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
          <Typography color="text.primary">Performance FTR Trend</Typography>
        </Breadcrumbs>
      </Box>

      <Box p={1.5}>
        {/* Top bar */}
        <Paper elevation={0} sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 2, mb: 2.5, px: 2.5, py: 2,
          borderRadius: "16px", border: "1px solid #e8ecf0", bgcolor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <Box>
            <Typography fontWeight={800} fontSize={20} letterSpacing="-.3px" color="#1a1a2e">
              Performance FTR Trend
            </Typography>
            <Typography fontSize={13} color="text.secondary" mt={0.2}>
              Circles as bars per month · Overall (grand total) as trend line
            </Typography>
          </Box>
          <MuiTooltip title="Refresh data" arrow>
            <span>
              <IconButton
                onClick={fetchAll}
                size="small"
                disabled={loading}
                sx={{ bgcolor: alpha("#1e3c72", 0.08), borderRadius: "10px", "&:hover": { bgcolor: alpha("#1e3c72", 0.15) } }}
              >
                <RefreshIcon
                  fontSize="small"
                  sx={{
                    color: "#1e3c72",
                    animation: loading ? "spin .8s linear infinite" : "none",
                    "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                  }}
                />
              </IconButton>
            </span>
          </MuiTooltip>
        </Paper>

        {/* Tabs + category filter + month/circle filters + chart card */}
        <Paper elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", mb: 2 }}>
          {/* Tech tabs */}
          <Box sx={{ display: "flex", borderBottom: "1.5px solid #e8ecf0", bgcolor: "#f8fafc", px: 1.5, pt: 0.5 }}>
            {TECH_TABS.map((tab) => {
              const isActive = tech === tab.key;
              const tColor = TECH_COLORS[tab.key];
              return (
                <Box key={tab.key} onClick={() => setTech(tab.key)}
                  sx={{
                    px: 3, py: 1, cursor: "pointer", userSelect: "none",
                    fontWeight: isActive ? 700 : 500, fontSize: 13,
                    color: isActive ? "#fff" : tColor.tabColor,
                    background: isActive ? tColor.active : "transparent",
                    borderRadius: "8px 8px 0 0",
                    borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
                    transition: "all 0.2s",
                    "&:hover": { background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08) },
                  }}>
                  {tab.label}
                </Box>
              );
            })}
          </Box>

          {/* Category filter row (Total Site / Pending / Accepted with 0 counter /
              Acceptance pending with 0 Counter / FTR / All) */}
          <CategoryFilterBar active={categoryFilter} onChange={setCategoryFilter} />

          {/* Filter row — month range (left) + circle filter (right, FTR/All only) */}
          <Box sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 1.5, px: 2, py: 1.4, bgcolor: "#f8fafc", borderBottom: "1px solid #e8ecf0",
          }}>
            <MonthRangeFilter
              monthFrom={monthRange.from}
              monthTo={monthRange.to}
              onChange={setMonthRange}
              onReset={resetMonthRange}
            />
            {isCircleView ? (
              <CircleMultiFilter circles={allCircleNames} selectedCircles={selectedCircles} onChange={setSelectedCircles} />
            ) : (
              <Typography fontSize={11.5} color="text.disabled" fontStyle="italic">
                Circle-wise breakdown isn't available for "{categoryFilter}" — showing grand total
              </Typography>
            )}
          </Box>

          {/* Chart panel */}
          <Box sx={{
            borderRadius: 0, overflow: "hidden", background: "#fff",
          }}>
            <Box sx={{
              background: `linear-gradient(135deg, ${HEADER_GRADIENT_FROM} 0%, ${HEADER_GRADIENT_TO} 100%)`,
              px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 1,
            }}>
              <Box display="flex" alignItems="center" gap={1.2}>
                <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />
                <Typography fontWeight={700} fontSize={15} color="#fff">
                   {isCircleView ? "Performance FTR" : categoryFilter} — {tech}
                </Typography>
              </Box>
              {monthLabel && (
                <Chip label={monthLabel} size="small"
                  sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: 11 }} />
              )}
            </Box>

            <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
              {loading ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={2}>
                  <CircularProgress size={40} sx={{ color: HEADER_GRADIENT_FROM }} />
                  <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
                </Box>
              ) : error ? (
                <Typography color="error" py={4} textAlign="center">{error}</Typography>
              ) : !hasData ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={chartHeight} gap={1.5}>
                  <Box sx={{ width: 56, height: 56, borderRadius: "14px", bgcolor: alpha(HEADER_GRADIENT_FROM, 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChartIcon sx={{ color: HEADER_GRADIENT_FROM, fontSize: 28 }} />
                  </Box>
                  <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
                  <Typography fontSize={12} color="text.disabled">Try adjusting the filter, circle, or month range</Typography>
                </Box>
              ) : (
                <>
                  {isCircleView && !hasOverall && (
                    <Typography fontSize={11.5} color="#c62828" fontWeight={600} mb={1}>
                      Overall (grand total) data unavailable — the grand-total endpoint returned no matching month entries.
                    </Typography>
                  )}
                  <ResponsiveContainer width="100%" height={chartHeight}>
                    <ComposedChart data={filteredChartData} margin={{ top: 32, right: 52, left: 0, bottom: 8 }} barCategoryGap="28%" barGap={3}>
                      {isCircleView ? (
                        <CircleGradientDefs circleNames={circleNames} />
                      ) : (
                        <SingleGradientDef color={categoryColor} />
                      )}
                      <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />
                      <XAxis dataKey="month" tick={<CustomXTick />} axisLine={{ stroke: "#dde3ea" }} tickLine={false} height={34} />
                      {isCircleView ? (
                        <YAxis yAxisId="left" domain={[0, 100]} ticks={PERCENT_AXIS_TICKS} tick={{ fontSize: 11, fill: "#90a4ae" }} axisLine={false} tickLine={false} width={42} />
                      ) : (
                        <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#90a4ae" }} axisLine={false} tickLine={false} width={50} allowDecimals={false} />
                      )}
                      {isCircleView && (
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} ticks={PERCENT_AXIS_TICKS} tick={{ fontSize: 11, fill: OVERALL_LINE_COLOR }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={46} />
                      )}
                      <Tooltip content={<CustomTooltip isPercent={isCircleView} />} cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }} />
                      <Legend
                        wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
                        iconSize={11}
                        formatter={(value) => {
                          if (value === "Overall") return <span style={{ color: OVERALL_LINE_COLOR, fontWeight: 700, fontSize: 11.5 }}>Overall</span>;
                          if (!isCircleView) return <span style={{ color: categoryColor, fontWeight: 700, fontSize: 11.5 }}>{value}</span>;
                          const idx = circleNames.indexOf(value);
                          return <span style={{ color: getCircleBarColor(idx >= 0 ? idx : 0), fontWeight: 700, fontSize: 11.5 }}>{value}</span>;
                        }}
                      />
                      {isCircleView ? (
                        circleNames.map((circleName, i) => (
                          <Bar key={circleName} yAxisId="left" dataKey={circleName} fill={`url(#pftr-cg${i})`} radius={[4, 4, 0, 0]} maxBarSize={maxBarSize} legendType="square">
                            <LabelList dataKey={circleName} content={(props) => <BarTopLabel {...props} labelColor={getCircleBarColor(i)} />} />
                          </Bar>
                        ))
                      ) : (
                        <Bar yAxisId="left" dataKey={categoryFilter} fill="url(#pftr-single)" radius={[4, 4, 0, 0]} maxBarSize={maxBarSize} legendType="square">
                          <LabelList dataKey={categoryFilter} content={(props) => <BarTopLabel {...props} labelColor={categoryColor} />} />
                        </Bar>
                      )}
                      {isCircleView && (
                        <Line yAxisId="right" type="monotone" dataKey="Overall" stroke={OVERALL_LINE_COLOR} strokeWidth={2.5} dot={{ r: 5, fill: OVERALL_LINE_COLOR, strokeWidth: 0 }} activeDot={{ r: 7 }} connectNulls legendType="line">
                          <LabelList dataKey="Overall" content={(props) => <LineTopLabel {...props} />} />
                        </Line>
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default PerformanceFTRGraph;