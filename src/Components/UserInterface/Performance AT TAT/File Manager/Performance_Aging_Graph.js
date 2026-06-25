


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
// import CheckIcon              from "@mui/icons-material/Check";
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
//     Cell,
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

// const normalizeCategory = (str) =>
//     (str ?? "").toString().trim().toLowerCase().replace(/\s+/g, "");

// // Y-axis ticks: 0, 5, 10, 15 ... 100 (numeric only, no % suffix)
// const Y_AXIS_TICKS = Array.from({ length: 21 }, (_, i) => i * 5);

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
//         label: "Performance Aging — Performance",
//     },
//     offered: {
//         active:    "linear-gradient(135deg,#134e5e,#71b280)",
//         tabColor:  "#134e5e",
//         chartFrom: "#134e5e",
//         chartTo:   "#71b280",
//         icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "Performance Aging — Offered",
//     },
// };

// const CATEGORY_FILTERS = [
//     { key: "ALL",       label: "All",       color: "#546e7a" },
//     { key: "<12%",      label: "<12%",      color: "#1565C0" },
//     { key: "<13-21%",   label: "<13-21%",   color: "#2E7D32" },
//     { key: "<22-30%",   label: "<22-30%",   color: "#E65100" },
//     { key: ">30days%",  label: ">30days%",  color: "#6A1B9A" },
//     { key: "Pending%",  label: "Pending%",  color: "#C62828" },
// ];

// const REAL_CATEGORY_KEYS = CATEGORY_FILTERS.filter(c => c.key !== "ALL").map(c => c.key);

// // ── Muted gradient palette — pairs of [startColor, endColor] ──────────────
// // Each series gets its own gradient id in the SVG defs
// const SERIES_GRADIENTS = [
//     { id: "sg0",  from: "#4a6fa5", to: "#6b92c4", label: "#3d5a8a" },  // slate blue
//     { id: "sg1",  from: "#4a8c6e", to: "#6dab8c", label: "#3a7059" },  // muted teal-green
//     { id: "sg2",  from: "#b07d3a", to: "#d4a05a", label: "#8f621e" },  // warm amber
//     { id: "sg3",  from: "#7a5a9e", to: "#9e7dbd", label: "#5e4180" },  // dusty violet
//     { id: "sg4",  from: "#3a8a8a", to: "#5ab0b0", label: "#2c6e6e" },  // muted cyan
//     { id: "sg5",  from: "#a05060", to: "#c07080", label: "#7e3a48" },  // rose
//     { id: "sg6",  from: "#5a7a3a", to: "#7da05a", label: "#425c28" },  // olive green
//     { id: "sg7",  from: "#6a5a3a", to: "#8c7a56", label: "#52431f" },  // warm brown
//     { id: "sg8",  from: "#3a5a8a", to: "#5a7aaa", label: "#28416a" },  // navy
//     { id: "sg9",  from: "#8a4a3a", to: "#aa6a5a", label: "#6a2f1f" },  // terracotta
//     { id: "sg10", from: "#4a6a4a", to: "#6a8a6a", label: "#344d34" },  // sage
//     { id: "sg11", from: "#6a4a6a", to: "#8a6a8a", label: "#4f2f4f" },  // mauve
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // SVG GRADIENT DEFS — injected once into the chart
// // ─────────────────────────────────────────────────────────────────────────────
// const GradientDefs = () => (
//     <defs>
//         {SERIES_GRADIENTS.map((g) => (
//             <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0"   stopColor={g.from} stopOpacity={0.95} />
//                 <stop offset="100" stopColor={g.to}   stopOpacity={0.75} />
//             </linearGradient>
//         ))}
//     </defs>
// );

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
//             p: 1.8, minWidth: 210, borderRadius: "12px",
//             border: "1px solid #e0e0e0",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//             background: "rgba(255,255,255,0.98)",
//         }}>
//             <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
//                 sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
//                 {label}
//             </Typography>
//             {payload.map((entry, idx) => {
//                 const g = SERIES_GRADIENTS[idx % SERIES_GRADIENTS.length];
//                 return (
//                     <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.45}>
//                         <Box sx={{
//                             width: 12, height: 12, borderRadius: "3px",
//                             background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
//                             flexShrink: 0,
//                         }} />
//                         <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
//                         <Typography fontSize={12} fontWeight={700} color={g.label}>
//                             {entry.value != null ? entry.value : "—"}
//                         </Typography>
//                     </Box>
//                 );
//             })}
//         </Paper>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM BAR LABEL — value shown above each bar
// // ─────────────────────────────────────────────────────────────────────────────
// const BarTopLabel = (props) => {
//     const { x, y, width, value, labelColor } = props;
//     if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
//     return (
//         <text
//             x={x + width / 2}
//             y={y - 5}
//             textAnchor="middle"
//             fontSize={10}
//             fontWeight={700}
//             fill={labelColor ?? "#555"}
//         >
//             {value}
//         </text>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM X-AXIS TICK — wraps long labels
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomXTick = ({ x, y, payload }) => (
//     <text x={x} y={y + 12} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={500}>
//         {payload.value}
//     </text>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // CHART PANEL
// // ─────────────────────────────────────────────────────────────────────────────
// const AgingChart = ({
//     title, icon, gradientFrom, gradientTo,
//     chartData, seriesNames, loading, seriesInfo,
//     selectedCategories,
// }) => {
//     const isAllSelected = selectedCategories.length === 0 || selectedCategories.includes("ALL");

//     const filteredData = useMemo(() => {
//         if (isAllSelected) return chartData;
//         return chartData.filter((row) =>
//             selectedCategories.some(
//                 (cat) => normalizeCategory(row.category) === normalizeCategory(cat)
//             )
//         );
//     }, [chartData, selectedCategories, isAllSelected]);

//     const hasData = filteredData.length > 0 && seriesNames.length > 0;

//     // Dynamic sizing
//     const numSeries     = seriesNames.length;
//     const numCategories = filteredData.length;
//     const chartHeight   = Math.max(420, 400 + Math.max(0, numSeries - 4) * 16);

//     // Wider bars when fewer series; tighter when many
//     // maxBarSize controls individual bar width inside each group
//     const maxBarSize = numSeries <= 2 ? 42
//                      : numSeries <= 4 ? 32
//                      : numSeries <= 6 ? 24
//                      : 18;

//     // barCategoryGap: space between category groups (as %)
//     // barGap: pixel gap between bars within a group
//     const barCategoryGap = numSeries <= 3 ? "30%" : numSeries <= 6 ? "25%" : "20%";
//     const barGap         = numSeries <= 4 ? 4 : 3;

//     return (
//         <Box sx={{
//             borderRadius: "16px",
//             border: "1px solid #e8ecf0",
//             boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
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
//                     {seriesInfo?.map((s, i) => {
//                         const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                         return (
//                             <Chip
//                                 key={s.name}
//                                 label={s.name}
//                                 size="small"
//                                 sx={{
//                                     background: alpha(g.from, 0.32),
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     fontSize: 10.5,
//                                     border: `1.5px solid ${alpha(g.from, 0.55)}`,
//                                 }}
//                             />
//                         );
//                     })}
//                 </Box>
//             </Box>

//             {/* Body */}
//             <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
//                 {loading ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center"
//                         alignItems="center" minHeight={chartHeight} gap={2}>
//                         <CircularProgress size={40} sx={{ color: gradientFrom }} />
//                         <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
//                     </Box>
//                 ) : !hasData ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center"
//                         alignItems="center" minHeight={chartHeight} gap={1.5}>
//                         <Box sx={{
//                             width: 56, height: 56, borderRadius: "14px",
//                             bgcolor: alpha(gradientFrom, 0.08),
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                         }}>
//                             {React.cloneElement(icon, { sx: { color: gradientFrom, fontSize: 28 } })}
//                         </Box>
//                         <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
//                         <Typography fontSize={12} color="text.disabled">
//                             {!isAllSelected ? "No records for selected categories" : "Try adjusting the date range"}
//                         </Typography>
//                     </Box>
//                 ) : (
//                     <ResponsiveContainer width="100%" height={chartHeight}>
//                         <BarChart
//                             data={filteredData}
//                             margin={{ top: 32, right: 24, left: 0, bottom: 8 }}
//                             barCategoryGap={barCategoryGap}
//                             barGap={barGap}
//                         >
//                             {/* SVG gradient defs */}
//                             <GradientDefs />

//                             <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />

//                             <XAxis
//                                 dataKey="category"
//                                 tick={<CustomXTick />}
//                                 axisLine={{ stroke: "#dde3ea" }}
//                                 tickLine={false}
//                                 height={30}
//                             />
//                             <YAxis
//                                 tick={{ fontSize: 11, fill: "#90a4ae" }}
//                                 axisLine={false}
//                                 tickLine={false}
//                                 domain={[0, 100]}
//                                 ticks={Y_AXIS_TICKS}
//                                 width={36}
//                             />

//                             <Tooltip
//                                 content={<CustomTooltip />}
//                                 cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }}
//                             />

//                             <Legend
//                                 wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
//                                 iconType="square"
//                                 iconSize={11}
//                                 formatter={(value, entry, index) => {
//                                     const g = SERIES_GRADIENTS[index % SERIES_GRADIENTS.length];
//                                     return (
//                                         <span style={{
//                                             color: g.label,
//                                             fontWeight: 700,
//                                             fontSize: 11.5,
//                                         }}>
//                                             {value}
//                                         </span>
//                                     );
//                                 }}
//                             />

//                             {seriesNames.map((name, i) => {
//                                 const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                                 return (
//                                     <Bar
//                                         key={name}
//                                         dataKey={name}
//                                         fill={`url(#${g.id})`}
//                                         radius={[5, 5, 0, 0]}
//                                         maxBarSize={maxBarSize}
//                                     >
//                                         <LabelList
//                                             dataKey={name}
//                                             content={(props) => (
//                                                 <BarTopLabel {...props} labelColor={g.label} />
//                                             )}
//                                         />
//                                     </Bar>
//                                 );
//                             })}
//                         </BarChart>
//                     </ResponsiveContainer>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MONTH RANGE PICKER
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
//                         "&:hover fieldset": { borderColor: "#1e3c72" },
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
//                         "&:hover fieldset": { borderColor: "#1e3c72" },
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
// // MULTI-SELECT CATEGORY FILTER BAR
// // ─────────────────────────────────────────────────────────────────────────────
// const CategoryFilterBar = ({ selectedCategories, onChange }) => {
//     const isAllActive = selectedCategories.length === 0 || selectedCategories.includes("ALL");

//     const handleClick = (key) => {
//         if (key === "ALL") { onChange([]); return; }
//         let next;
//         if (isAllActive) {
//             next = [key];
//         } else if (selectedCategories.includes(key)) {
//             next = selectedCategories.filter((k) => k !== key);
//             if (next.length === 0) next = [];
//         } else {
//             next = [...selectedCategories, key];
//             if (next.length === REAL_CATEGORY_KEYS.length) next = [];
//         }
//         onChange(next);
//     };

//     const selectedCount = isAllActive ? REAL_CATEGORY_KEYS.length : selectedCategories.length;

//     return (
//         <Box sx={{
//             display: "flex", alignItems: "center", gap: 1,
//             flexWrap: "wrap",
//             px: 2, py: 1.4,
//             bgcolor: "#f8fafc",
//             borderBottom: "1px solid #e8ecf0",
//         }}>
//             <Box display="flex" alignItems="center" gap={0.7} mr={0.5}>
//                 <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                 <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
//             </Box>
//             {CATEGORY_FILTERS.map((cf) => {
//                 const isActive = cf.key === "ALL" ? isAllActive
//                     : (!isAllActive && selectedCategories.includes(cf.key));
//                 return (
//                     <Box
//                         key={cf.key}
//                         onClick={() => handleClick(cf.key)}
//                         sx={{
//                             px: 1.6, py: 0.5,
//                             borderRadius: "20px",
//                             fontSize: 12.5,
//                             fontWeight: isActive ? 700 : 500,
//                             cursor: "pointer", userSelect: "none",
//                             transition: "all .15s",
//                             border: `1.5px solid ${isActive ? cf.color : alpha(cf.color, 0.3)}`,
//                             bgcolor: isActive ? cf.color : "transparent",
//                             color:   isActive ? "#fff" : cf.color,
//                             display: "flex", alignItems: "center", gap: 0.5,
//                             "&:hover": {
//                                 bgcolor: isActive ? cf.color : alpha(cf.color, 0.08),
//                                 borderColor: cf.color,
//                             },
//                             boxShadow: isActive ? `0 2px 8px ${alpha(cf.color, 0.3)}` : "none",
//                         }}
//                     >
//                         {isActive && cf.key !== "ALL" && (
//                             <CheckIcon sx={{ fontSize: 12, mr: 0.2 }} />
//                         )}
//                         {cf.label}
//                     </Box>
//                 );
//             })}
//             {!isAllActive && (
//                 <Chip
//                     label={`${selectedCount} selected`}
//                     size="small"
//                     onDelete={() => onChange([])}
//                     sx={{
//                         ml: 0.5, fontWeight: 700, fontSize: 11,
//                         bgcolor: alpha("#546e7a", 0.12),
//                         color: "#546e7a",
//                         border: "1px solid " + alpha("#546e7a", 0.3),
//                         "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                     }}
//                 />
//             )}
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const Performance_Aging_Graph = () => {
//     const navigate = useNavigate();

//     const [activeMetric,       setActiveMetric]       = useState("performance");
//     const [activeTech,         setActiveTech]         = useState("4G");
//     const [selectedCategories, setSelectedCategories] = useState([]);

//     const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
//     const [fromMonth, setFromMonth] = useState(currentMonthInput);
//     const [toMonth,   setToMonth]   = useState(currentMonthInput);

//     const [offeredData,        setOfferedData]        = useState(null);
//     const [performanceData,    setPerformanceData]    = useState(null);
//     const [loadingOffered,     setLoadingOffered]     = useState(false);
//     const [loadingPerformance, setLoadingPerformance] = useState(false);

//     const selectedMonths = getMonthRange(fromMonth, toMonth);
//     const isRangeValid   = selectedMonths.length >= 1;

//     const fetchAll = useCallback(() => {
//         if (!isRangeValid) return;
//         setLoadingOffered(true);
//         setLoadingPerformance(true);

//         const fetchMonth = (endpoint, month) => {
//             const form = new FormData();
//             form.append("month", inputToApiMonth(month));
//             return postData(endpoint, form)
//                 .then((res) => (res?.status ? res : null))
//                 .catch(() => null);
//         };

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-offered-graph/", m)
//         ))
//             .then((results) => setOfferedData(mergeResponses(results)))
//             .finally(() => setLoadingOffered(false));

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-performance-graph/", m)
//         ))
//             .then((results) => setPerformanceData(mergeResponses(results)))
//             .finally(() => setLoadingPerformance(false));
//     }, [fromMonth, toMonth]); // eslint-disable-line

//     useEffect(() => {
//         if (!isRangeValid) return;
//         const t = setTimeout(fetchAll, 500);
//         return () => clearTimeout(t);
//     }, [fetchAll]); // eslint-disable-line

//     const { chartData: offeredChart,     seriesNames: offeredSeries }     =
//         transformGraphData(offeredData?.graph_data?.[activeTech]);
//     const { chartData: performanceChart, seriesNames: performanceSeries } =
//         transformGraphData(performanceData?.graph_data?.[activeTech]);

//     const metricTheme   = METRIC_THEME[activeMetric];
//     const activeTechClr = TECH_COLORS[activeTech];
//     const isAllSelected = selectedCategories.length === 0;
//     const activeLabel   = isAllSelected
//         ? "All Categories"
//         : selectedCategories.join(", ");

//     return (
//         <>
//             {/* Breadcrumb */}
//             <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" sx={{ cursor: "pointer" }}
//                         onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer" }}
//                         onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
//                     <Typography color="text.primary">Performance Aging Graph</Typography>
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
//                             Performance Aging Dashboard
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
//                                     disabled={!isRangeValid || loadingOffered || loadingPerformance}
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
//                                             animation: (loadingOffered || loadingPerformance)
//                                                 ? "spin .8s linear infinite" : "none",
//                                             "@keyframes spin": { to: { transform: "rotate(360deg)" } },
//                                         }}
//                                     />
//                                 </IconButton>
//                             </span>
//                         </MuiTooltip>
//                     </Box>
//                 </Paper>

//                 {/* ── Tabs card ── */}
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
//                                         color: isActive ? "#fff" : theme.tabColor,
//                                         background: isActive ? theme.active : "transparent",
//                                         borderBottom: isActive ? `3px solid ${theme.tabColor}` : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         display: "flex", alignItems: "center", gap: 0.8,
//                                         "&:hover": { background: isActive ? theme.active : alpha(theme.tabColor, 0.06) },
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
//                                         color: isActive ? "#fff" : tColor.tabColor,
//                                         background: isActive ? tColor.active : "transparent",
//                                         borderRadius: "8px 8px 0 0",
//                                         borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         "&:hover": { background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08) },
//                                     }}
//                                 >
//                                     {tab.label}
//                                 </Box>
//                             );
//                         })}
//                     </Box>

//                     {/* Multi-select filter bar */}
//                     <CategoryFilterBar
//                         selectedCategories={selectedCategories}
//                         onChange={setSelectedCategories}
//                     />

//                     {/* Chart */}
//                     <Box p={2.5}>
//                         {activeMetric === "performance" && (
//                             <AgingChart
//                                 title={METRIC_THEME.performance.label}
//                                 icon={METRIC_THEME.performance.icon}
//                                 gradientFrom={METRIC_THEME.performance.chartFrom}
//                                 gradientTo={METRIC_THEME.performance.chartTo}
//                                 chartData={performanceChart}
//                                 seriesNames={performanceSeries}
//                                 loading={loadingPerformance}
//                                 seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
//                                 selectedCategories={selectedCategories}
//                             />
//                         )}
//                         {activeMetric === "offered" && (
//                             <AgingChart
//                                 title={METRIC_THEME.offered.label}
//                                 icon={METRIC_THEME.offered.icon}
//                                 gradientFrom={METRIC_THEME.offered.chartFrom}
//                                 gradientTo={METRIC_THEME.offered.chartTo}
//                                 chartData={offeredChart}
//                                 seriesNames={offeredSeries}
//                                 loading={loadingOffered}
//                                 seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
//                                 selectedCategories={selectedCategories}
//                             />
//                         )}
//                     </Box>
//                 </Paper>

//                 {/* ── Summary Strip ── */}
//                 {(offeredData || performanceData) && (
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
//                         <Chip label={selectedMonths.length} size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Layer:</Typography>
//                         <Chip
//                             label={(offeredData?.layer || performanceData?.layer || "all").toUpperCase()}
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Tech:</Typography>
//                         <Chip label={activeTech} size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Filter:</Typography>
//                         <Chip
//                             label={activeLabel}
//                             size="small"
//                             sx={{
//                                 background: isAllSelected
//                                     ? "#546e7a"
//                                     : CATEGORY_FILTERS.find(c => c.key === selectedCategories[0])?.color ?? "#546e7a",
//                                 color: "#fff", fontWeight: 700, fontSize: 10.5, maxWidth: 260,
//                             }}
//                         />
//                         <Box display="flex" gap={0.8} flexWrap="wrap" ml={0.5}>
//                             {selectedMonths.map((m, i) => {
//                                 const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                                 return (
//                                     <Chip
//                                         key={m}
//                                         label={inputToApiMonth(m)}
//                                         size="small"
//                                         sx={{
//                                             background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
//                                             color: "#fff", fontWeight: 600, fontSize: 10,
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </Box>
//                     </Paper>
//                 )}
//             </Box>
//         </>
//     );
// };

// export default Performance_Aging_Graph;

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
//     Select,
//     MenuItem,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import SignalCellularAltIcon  from "@mui/icons-material/SignalCellularAlt";
// import BarChartIcon           from "@mui/icons-material/BarChart";
// import RefreshIcon            from "@mui/icons-material/Refresh";
// import FilterListIcon         from "@mui/icons-material/FilterList";
// import CheckIcon              from "@mui/icons-material/Check";
// import RoomIcon                from "@mui/icons-material/Room";
// import { useNavigate } from "react-router-dom";
// import {
//     ComposedChart,
//     Bar,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     LabelList,
//     Cell,
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

// const normalizeCategory = (str) =>
//     (str ?? "").toString().trim().toLowerCase().replace(/\s+/g, "");

// // Y-axis ticks: 0, 5, 10, 15 ... 100 (numeric only, no % suffix)
// const Y_AXIS_TICKS = Array.from({ length: 21 }, (_, i) => i * 5);

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
//         label: "Performance Aging — Performance",
//     },
//     offered: {
//         active:    "linear-gradient(135deg,#134e5e,#71b280)",
//         tabColor:  "#134e5e",
//         chartFrom: "#134e5e",
//         chartTo:   "#71b280",
//         icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
//         label: "Performance Aging — Offered",
//     },
// };

// const CATEGORY_FILTERS = [
//     { key: "ALL",       label: "All",       color: "#546e7a" },
//     { key: "<12%",      label: "<12%",      color: "#1565C0" },
//     { key: "<13-21%",   label: "<13-21%",   color: "#2E7D32" },
//     { key: "<22-30%",   label: "<22-30%",   color: "#E65100" },
//     { key: ">30days%",  label: ">30days%",  color: "#6A1B9A" },
//     { key: "Pending%",  label: "Pending%",  color: "#C62828" },
// ];

// const REAL_CATEGORY_KEYS = CATEGORY_FILTERS.filter(c => c.key !== "ALL").map(c => c.key);

// // Color used for the circle % line overlay
// const CIRCLE_LINE_COLOR = "#ad1457";

// // ── Muted gradient palette — pairs of [startColor, endColor] ──────────────
// // Each series gets its own gradient id in the SVG defs
// const SERIES_GRADIENTS = [
//     { id: "sg0",  from: "#4a6fa5", to: "#6b92c4", label: "#3d5a8a" },  // slate blue
//     { id: "sg1",  from: "#4a8c6e", to: "#6dab8c", label: "#3a7059" },  // muted teal-green
//     { id: "sg2",  from: "#b07d3a", to: "#d4a05a", label: "#8f621e" },  // warm amber
//     { id: "sg3",  from: "#7a5a9e", to: "#9e7dbd", label: "#5e4180" },  // dusty violet
//     { id: "sg4",  from: "#3a8a8a", to: "#5ab0b0", label: "#2c6e6e" },  // muted cyan
//     { id: "sg5",  from: "#a05060", to: "#c07080", label: "#7e3a48" },  // rose
//     { id: "sg6",  from: "#5a7a3a", to: "#7da05a", label: "#425c28" },  // olive green
//     { id: "sg7",  from: "#6a5a3a", to: "#8c7a56", label: "#52431f" },  // warm brown
//     { id: "sg8",  from: "#3a5a8a", to: "#5a7aaa", label: "#28416a" },  // navy
//     { id: "sg9",  from: "#8a4a3a", to: "#aa6a5a", label: "#6a2f1f" },  // terracotta
//     { id: "sg10", from: "#4a6a4a", to: "#6a8a6a", label: "#344d34" },  // sage
//     { id: "sg11", from: "#6a4a6a", to: "#8a6a8a", label: "#4f2f4f" },  // mauve
// ];

// // ─────────────────────────────────────────────────────────────────────────────
// // SVG GRADIENT DEFS — injected once into the chart
// // ─────────────────────────────────────────────────────────────────────────────
// const GradientDefs = () => (
//     <defs>
//         {SERIES_GRADIENTS.map((g) => (
//             <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0"   stopColor={g.from} stopOpacity={0.95} />
//                 <stop offset="100" stopColor={g.to}   stopOpacity={0.75} />
//             </linearGradient>
//         ))}
//     </defs>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // DATA TRANSFORM
// // ─────────────────────────────────────────────────────────────────────────────
// // Builds bar-chart rows. Supports two series shapes:
// //  1. Legacy flat shape:    series[i].data[catIdx]
// //  2. Circle-nested shape:  series[i].circles[circleName][catIdx]
// // For shape 2, the bar value per series is the AVERAGE across all circles
// // (keeps existing bar behaviour meaningful when circles are present).
// const transformGraphData = (techData) => {
//     if (!techData) return { chartData: [], seriesNames: [] };
//     const { categories = [], series = [] } = techData;

//     const seriesAvg = (s, catIdx) => {
//         if (Array.isArray(s.data)) return s.data?.[catIdx] ?? null;
//         if (s.circles) {
//             const vals = Object.values(s.circles)
//                 .map((arr) => arr?.[catIdx])
//                 .filter((v) => typeof v === "number");
//             if (!vals.length) return null;
//             const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
//             return Math.round(avg * 10) / 10;
//         }
//         return null;
//     };

//     const chartData = categories.map((cat, catIdx) => {
//         const entry = { category: cat };
//         series.forEach((s) => { entry[s.name] = seriesAvg(s, catIdx); });
//         return entry;
//     });
//     return { chartData, seriesNames: series.map((s) => s.name) };
// };

// // Extracts the list of circle names available across all series of a tech block
// const getCircleOptions = (techData) => {
//     if (!techData?.series?.length) return [];
//     const set = new Set();
//     techData.series.forEach((s) => {
//         if (s.circles) Object.keys(s.circles).forEach((c) => set.add(c));
//     });
//     return Array.from(set).sort();
// };

// // Merges the circle % line values into chartData, one key per series name
// // e.g. entry["Apr 2026__circle"] = 23.3
// const withCircleLine = (chartData, techData, circle) => {
//     if (!circle || !techData?.series?.length) return chartData;
//     const { categories = [], series = [] } = techData;
//     return chartData.map((row, catIdx) => {
//         const next = { ...row };
//         series.forEach((s) => {
//             const val = s.circles?.[circle]?.[catIdx];
//             next[`${s.name}__circle`] = typeof val === "number" ? val : null;
//         });
//         return next;
//     });
// };

// const mergeResponses = (responses) => {
//     if (!responses?.length) return null;
//     const valid = responses.filter(Boolean);
//     if (!valid.length) return null;
//     const merged = { status: true, layer: valid[0].layer, circles: [], graph_data: {} };
//     const circleSet = new Set();
//     valid.forEach((res) => (res?.circles || []).forEach((c) => circleSet.add(c)));
//     merged.circles = Array.from(circleSet);

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
// const CustomTooltip = ({ active, payload, label, selectedCircle }) => {
//     if (!active || !payload?.length) return null;
//     const barEntries  = payload.filter((p) => !String(p.dataKey).endsWith("__circle"));
//     const lineEntries = payload.filter((p) => String(p.dataKey).endsWith("__circle"));
//     return (
//         <Paper elevation={8} sx={{
//             p: 1.8, minWidth: 210, borderRadius: "12px",
//             border: "1px solid #e0e0e0",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
//             background: "rgba(255,255,255,0.98)",
//         }}>
//             <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
//                 sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
//                 {label}
//             </Typography>
//             {barEntries.map((entry, idx) => {
//                 const g = SERIES_GRADIENTS[idx % SERIES_GRADIENTS.length];
//                 return (
//                     <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.45}>
//                         <Box sx={{
//                             width: 12, height: 12, borderRadius: "3px",
//                             background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
//                             flexShrink: 0,
//                         }} />
//                         <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
//                         <Typography fontSize={12} fontWeight={700} color={g.label}>
//                             {entry.value != null ? entry.value : "—"}
//                         </Typography>
//                     </Box>
//                 );
//             })}
//             {lineEntries.length > 0 && (
//                 <Box mt={0.8} pt={0.8} sx={{ borderTop: "1px dashed #eee" }}>
//                     {lineEntries.map((entry) => (
//                         <Box key={entry.dataKey} display="flex" alignItems="center" gap={1} mb={0.3}>
//                             <Box sx={{ width: 12, height: 2, bgcolor: CIRCLE_LINE_COLOR, flexShrink: 0 }} />
//                             <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>
//                                 {selectedCircle} ({String(entry.dataKey).replace("__circle", "")})
//                             </Typography>
//                             <Typography fontSize={12} fontWeight={700} color={CIRCLE_LINE_COLOR}>
//                                 {entry.value != null ? `${entry.value}%` : "—"}
//                             </Typography>
//                         </Box>
//                     ))}
//                 </Box>
//             )}
//         </Paper>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM BAR LABEL — value shown above each bar
// // ─────────────────────────────────────────────────────────────────────────────
// const BarTopLabel = (props) => {
//     const { x, y, width, value, labelColor } = props;
//     if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
//     return (
//         <text
//             x={x + width / 2}
//             y={y - 5}
//             textAnchor="middle"
//             fontSize={10}
//             fontWeight={700}
//             fill={labelColor ?? "#555"}
//         >
//             {value}
//         </text>
//     );
// };

// // Label shown above each point on the circle % line
// const LineTopLabel = (props) => {
//     const { x, y, value } = props;
//     if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
//     return (
//         <text
//             x={x}
//             y={y - 10}
//             textAnchor="middle"
//             fontSize={10.5}
//             fontWeight={700}
//             fill={CIRCLE_LINE_COLOR}
//         >
//             {`${value}%`}
//         </text>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CUSTOM X-AXIS TICK — wraps long labels
// // ─────────────────────────────────────────────────────────────────────────────
// const CustomXTick = ({ x, y, payload }) => (
//     <text x={x} y={y + 12} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={500}>
//         {payload.value}
//     </text>
// );

// // ─────────────────────────────────────────────────────────────────────────────
// // CIRCLE FILTER DROPDOWN
// // ─────────────────────────────────────────────────────────────────────────────
// const CircleFilter = ({ circles, value, onChange }) => {
//     if (!circles?.length) return null;
//     return (
//         <Box display="flex" alignItems="center" gap={0.8}>
//             <RoomIcon sx={{ fontSize: 17, color: "#607d8b" }} />
//             <Select
//                 size="small"
//                 value={value || ""}
//                 onChange={(e) => onChange(e.target.value)}
//                 displayEmpty
//                 renderValue={(v) => (v ? v : "Select circle")}
//                 sx={{
//                     minWidth: 150,
//                     borderRadius: "10px",
//                     fontSize: 13,
//                     fontWeight: 600,
//                     bgcolor: "#fff",
//                     "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c4c4c4" },
//                     "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72" },
//                 }}
//                 MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
//             >
//                 <MenuItem value="">
//                     <em>None</em>
//                 </MenuItem>
//                 {circles.map((c) => (
//                     <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>{c}</MenuItem>
//                 ))}
//             </Select>
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // CHART PANEL
// // ─────────────────────────────────────────────────────────────────────────────
// const AgingChart = ({
//     title, icon, gradientFrom, gradientTo,
//     chartData, seriesNames, loading, seriesInfo,
//     selectedCategories, selectedCircle,
// }) => {
//     const isAllSelected = selectedCategories.length === 0 || selectedCategories.includes("ALL");

//     const filteredData = useMemo(() => {
//         if (isAllSelected) return chartData;
//         return chartData.filter((row) =>
//             selectedCategories.some(
//                 (cat) => normalizeCategory(row.category) === normalizeCategory(cat)
//             )
//         );
//     }, [chartData, selectedCategories, isAllSelected]);

//     const hasData = filteredData.length > 0 && seriesNames.length > 0;

//     // Dynamic sizing
//     const numSeries     = seriesNames.length;
//     const numCategories = filteredData.length;
//     const chartHeight   = Math.max(420, 400 + Math.max(0, numSeries - 4) * 16);

//     // Wider bars when fewer series; tighter when many
//     // maxBarSize controls individual bar width inside each group
//     const maxBarSize = numSeries <= 2 ? 42
//                      : numSeries <= 4 ? 32
//                      : numSeries <= 6 ? 24
//                      : 18;

//     // barCategoryGap: space between category groups (as %)
//     // barGap: pixel gap between bars within a group
//     const barCategoryGap = numSeries <= 3 ? "30%" : numSeries <= 6 ? "25%" : "20%";
//     const barGap         = numSeries <= 4 ? 4 : 3;

//     return (
//         <Box sx={{
//             borderRadius: "16px",
//             border: "1px solid #e8ecf0",
//             boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
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
//                     {seriesInfo?.map((s, i) => {
//                         const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                         return (
//                             <Chip
//                                 key={s.name}
//                                 label={s.name}
//                                 size="small"
//                                 sx={{
//                                     background: alpha(g.from, 0.32),
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     fontSize: 10.5,
//                                     border: `1.5px solid ${alpha(g.from, 0.55)}`,
//                                 }}
//                             />
//                         );
//                     })}
//                 </Box>
//             </Box>

//             {/* Body */}
//             <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
//                 {loading ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center"
//                         alignItems="center" minHeight={chartHeight} gap={2}>
//                         <CircularProgress size={40} sx={{ color: gradientFrom }} />
//                         <Typography fontSize={13} color="text.secondary">Loading data…</Typography>
//                     </Box>
//                 ) : !hasData ? (
//                     <Box display="flex" flexDirection="column" justifyContent="center"
//                         alignItems="center" minHeight={chartHeight} gap={1.5}>
//                         <Box sx={{
//                             width: 56, height: 56, borderRadius: "14px",
//                             bgcolor: alpha(gradientFrom, 0.08),
//                             display: "flex", alignItems: "center", justifyContent: "center",
//                         }}>
//                             {React.cloneElement(icon, { sx: { color: gradientFrom, fontSize: 28 } })}
//                         </Box>
//                         <Typography fontSize={14} fontWeight={600} color="text.secondary">No Data Available</Typography>
//                         <Typography fontSize={12} color="text.disabled">
//                             {!isAllSelected ? "No records for selected categories" : "Try adjusting the date range"}
//                         </Typography>
//                     </Box>
//                 ) : (
//                     <ResponsiveContainer width="100%" height={chartHeight}>
//                         <ComposedChart
//                             data={filteredData}
//                             margin={{ top: 32, right: 36, left: 0, bottom: 8 }}
//                             barCategoryGap={barCategoryGap}
//                             barGap={barGap}
//                         >
//                             {/* SVG gradient defs */}
//                             <GradientDefs />

//                             <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />

//                             <XAxis
//                                 dataKey="category"
//                                 tick={<CustomXTick />}
//                                 axisLine={{ stroke: "#dde3ea" }}
//                                 tickLine={false}
//                                 height={30}
//                             />
//                             <YAxis
//                                 yAxisId="left"
//                                 tick={{ fontSize: 11, fill: "#90a4ae" }}
//                                 axisLine={false}
//                                 tickLine={false}
//                                 domain={[0, 100]}
//                                 ticks={Y_AXIS_TICKS}
//                                 width={36}
//                             />
//                             {/* Right-side % axis — only meaningful when a circle line is shown */}
//                             <YAxis
//                                 yAxisId="right"
//                                 orientation="right"
//                                 tick={{ fontSize: 11, fill: CIRCLE_LINE_COLOR }}
//                                 axisLine={false}
//                                 tickLine={false}
//                                 domain={[0, 100]}
//                                 ticks={Y_AXIS_TICKS}
//                                 tickFormatter={(v) => `${v}%`}
//                                 width={42}
//                             />

//                             <Tooltip
//                                 content={<CustomTooltip selectedCircle={selectedCircle} />}
//                                 cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }}
//                             />

//                             <Legend
//                                 wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
//                                 iconType="square"
//                                 iconSize={11}
//                                 formatter={(value, entry, index) => {
//                                     if (String(entry.dataKey).endsWith("__circle")) {
//                                         return (
//                                             <span style={{ color: CIRCLE_LINE_COLOR, fontWeight: 700, fontSize: 11.5 }}>
//                                                 {selectedCircle} %
//                                             </span>
//                                         );
//                                     }
//                                     const g = SERIES_GRADIENTS[index % SERIES_GRADIENTS.length];
//                                     return (
//                                         <span style={{
//                                             color: g.label,
//                                             fontWeight: 700,
//                                             fontSize: 11.5,
//                                         }}>
//                                             {value}
//                                         </span>
//                                     );
//                                 }}
//                             />

//                             {seriesNames.map((name, i) => {
//                                 const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                                 return (
//                                     <Bar
//                                         key={name}
//                                         yAxisId="left"
//                                         dataKey={name}
//                                         fill={`url(#${g.id})`}
//                                         radius={[5, 5, 0, 0]}
//                                         maxBarSize={maxBarSize}
//                                     >
//                                         <LabelList
//                                             dataKey={name}
//                                             content={(props) => (
//                                                 <BarTopLabel {...props} labelColor={g.label} />
//                                             )}
//                                         />
//                                     </Bar>
//                                 );
//                             })}

//                             {/* Circle % line overlay — one line per series/month, plotted on right axis */}
//                             {selectedCircle && seriesNames.map((name, i) => (
//                                 <Line
//                                     key={`${name}__circle`}
//                                     yAxisId="right"
//                                     type="monotone"
//                                     dataKey={`${name}__circle`}
//                                     stroke={CIRCLE_LINE_COLOR}
//                                     strokeWidth={2.5}
//                                     dot={{ r: 4, fill: CIRCLE_LINE_COLOR, strokeWidth: 0 }}
//                                     activeDot={{ r: 6 }}
//                                     connectNulls
//                                     legendType={i === 0 ? "line" : "none"}
//                                 >
//                                     <LabelList
//                                         dataKey={`${name}__circle`}
//                                         content={(props) => <LineTopLabel {...props} />}
//                                     />
//                                 </Line>
//                             ))}
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 )}
//             </Box>
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MONTH RANGE PICKER
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
//                         "&:hover fieldset": { borderColor: "#1e3c72" },
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
//                         "&:hover fieldset": { borderColor: "#1e3c72" },
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
// // MULTI-SELECT CATEGORY FILTER BAR
// // ─────────────────────────────────────────────────────────────────────────────
// const CategoryFilterBar = ({ selectedCategories, onChange, circles, selectedCircle, onCircleChange }) => {
//     const isAllActive = selectedCategories.length === 0 || selectedCategories.includes("ALL");

//     const handleClick = (key) => {
//         if (key === "ALL") { onChange([]); return; }
//         let next;
//         if (isAllActive) {
//             next = [key];
//         } else if (selectedCategories.includes(key)) {
//             next = selectedCategories.filter((k) => k !== key);
//             if (next.length === 0) next = [];
//         } else {
//             next = [...selectedCategories, key];
//             if (next.length === REAL_CATEGORY_KEYS.length) next = [];
//         }
//         onChange(next);
//     };

//     const selectedCount = isAllActive ? REAL_CATEGORY_KEYS.length : selectedCategories.length;

//     return (
//         <Box sx={{
//             display: "flex", alignItems: "center", gap: 1,
//             flexWrap: "wrap",
//             px: 2, py: 1.4,
//             bgcolor: "#f8fafc",
//             borderBottom: "1px solid #e8ecf0",
//             justifyContent: "space-between",
//         }}>
//             <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
//                 <Box display="flex" alignItems="center" gap={0.7} mr={0.5}>
//                     <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                     <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
//                 </Box>
//                 {CATEGORY_FILTERS.map((cf) => {
//                     const isActive = cf.key === "ALL" ? isAllActive
//                         : (!isAllActive && selectedCategories.includes(cf.key));
//                     return (
//                         <Box
//                             key={cf.key}
//                             onClick={() => handleClick(cf.key)}
//                             sx={{
//                                 px: 1.6, py: 0.5,
//                                 borderRadius: "20px",
//                                 fontSize: 12.5,
//                                 fontWeight: isActive ? 700 : 500,
//                                 cursor: "pointer", userSelect: "none",
//                                 transition: "all .15s",
//                                 border: `1.5px solid ${isActive ? cf.color : alpha(cf.color, 0.3)}`,
//                                 bgcolor: isActive ? cf.color : "transparent",
//                                 color:   isActive ? "#fff" : cf.color,
//                                 display: "flex", alignItems: "center", gap: 0.5,
//                                 "&:hover": {
//                                     bgcolor: isActive ? cf.color : alpha(cf.color, 0.08),
//                                     borderColor: cf.color,
//                                 },
//                                 boxShadow: isActive ? `0 2px 8px ${alpha(cf.color, 0.3)}` : "none",
//                             }}
//                         >
//                             {isActive && cf.key !== "ALL" && (
//                                 <CheckIcon sx={{ fontSize: 12, mr: 0.2 }} />
//                             )}
//                             {cf.label}
//                         </Box>
//                     );
//                 })}
//                 {!isAllActive && (
//                     <Chip
//                         label={`${selectedCount} selected`}
//                         size="small"
//                         onDelete={() => onChange([])}
//                         sx={{
//                             ml: 0.5, fontWeight: 700, fontSize: 11,
//                             bgcolor: alpha("#546e7a", 0.12),
//                             color: "#546e7a",
//                             border: "1px solid " + alpha("#546e7a", 0.3),
//                             "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                         }}
//                     />
//                 )}
//             </Box>

//             {/* Circle filter */}
//             <CircleFilter circles={circles} value={selectedCircle} onChange={onCircleChange} />
//         </Box>
//     );
// };

// // ─────────────────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ─────────────────────────────────────────────────────────────────────────────
// const Performance_Aging_Graph = () => {
//     const navigate = useNavigate();

//     const [activeMetric,       setActiveMetric]       = useState("performance");
//     const [activeTech,         setActiveTech]         = useState("4G");
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [selectedCircle,     setSelectedCircle]     = useState("");

//     const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
//     const [fromMonth, setFromMonth] = useState(currentMonthInput);
//     const [toMonth,   setToMonth]   = useState(currentMonthInput);

//     const [offeredData,        setOfferedData]        = useState(null);
//     const [performanceData,    setPerformanceData]    = useState(null);
//     const [loadingOffered,     setLoadingOffered]     = useState(false);
//     const [loadingPerformance, setLoadingPerformance] = useState(false);

//     const selectedMonths = getMonthRange(fromMonth, toMonth);
//     const isRangeValid   = selectedMonths.length >= 1;

//     const fetchAll = useCallback(() => {
//         if (!isRangeValid) return;
//         setLoadingOffered(true);
//         setLoadingPerformance(true);

//         const fetchMonth = (endpoint, month) => {
//             const form = new FormData();
//             form.append("month", inputToApiMonth(month));
//             return postData(endpoint, form)
//                 .then((res) => (res?.status ? res : null))
//                 .catch(() => null);
//         };

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-offered-circle-graph/", m)
//         ))
//             .then((results) => setOfferedData(mergeResponses(results)))
//             .finally(() => setLoadingOffered(false));

//         Promise.all(selectedMonths.map((m) =>
//             fetchMonth("performance_idploy/generate-performance-circle-graph/", m)
//         ))
//             .then((results) => setPerformanceData(mergeResponses(results)))
//             .finally(() => setLoadingPerformance(false));
//     }, [fromMonth, toMonth]); // eslint-disable-line

//     useEffect(() => {
//         if (!isRangeValid) return;
//         const t = setTimeout(fetchAll, 500);
//         return () => clearTimeout(t);
//     }, [fetchAll]); // eslint-disable-line

//     const { chartData: offeredChartRaw,     seriesNames: offeredSeries }     =
//         transformGraphData(offeredData?.graph_data?.[activeTech]);
//     const { chartData: performanceChartRaw, seriesNames: performanceSeries } =
//         transformGraphData(performanceData?.graph_data?.[activeTech]);

//     // Merge in the circle % line values (no-op if no circle selected)
//     const offeredChart = useMemo(
//         () => withCircleLine(offeredChartRaw, offeredData?.graph_data?.[activeTech], selectedCircle),
//         [offeredChartRaw, offeredData, activeTech, selectedCircle]
//     );
//     const performanceChart = useMemo(
//         () => withCircleLine(performanceChartRaw, performanceData?.graph_data?.[activeTech], selectedCircle),
//         [performanceChartRaw, performanceData, activeTech, selectedCircle]
//     );

//     // Circle options available for the currently active metric + tech
//     const circleOptions = useMemo(() => {
//         const techData = activeMetric === "performance"
//             ? performanceData?.graph_data?.[activeTech]
//             : offeredData?.graph_data?.[activeTech];
//         const fromTech = getCircleOptions(techData);
//         if (fromTech.length) return fromTech;
//         // fallback to top-level circles list returned by API
//         return (activeMetric === "performance" ? performanceData?.circles : offeredData?.circles) || [];
//     }, [activeMetric, activeTech, performanceData, offeredData]);

//     // Reset circle selection if it's no longer valid for the current tech/metric
//     useEffect(() => {
//         if (selectedCircle && circleOptions.length && !circleOptions.includes(selectedCircle)) {
//             setSelectedCircle("");
//         }
//     }, [circleOptions]); // eslint-disable-line

//     const metricTheme   = METRIC_THEME[activeMetric];
//     const activeTechClr = TECH_COLORS[activeTech];
//     const isAllSelected = selectedCategories.length === 0;
//     const activeLabel   = isAllSelected
//         ? "All Categories"
//         : selectedCategories.join(", ");

//     return (
//         <>
//             {/* Breadcrumb */}
//             <Box sx={{ m: 1, ml: 1.5, mt: 1.5 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" sx={{ cursor: "pointer" }}
//                         onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer" }}
//                         onClick={() => navigate("/tools/performance_at_tat")}>Performance At TAT</Link>
//                     <Typography color="text.primary">Performance Aging Graph</Typography>
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
//                             Performance Aging Dashboard
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
//                                     disabled={!isRangeValid || loadingOffered || loadingPerformance}
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
//                                             animation: (loadingOffered || loadingPerformance)
//                                                 ? "spin .8s linear infinite" : "none",
//                                             "@keyframes spin": { to: { transform: "rotate(360deg)" } },
//                                         }}
//                                     />
//                                 </IconButton>
//                             </span>
//                         </MuiTooltip>
//                     </Box>
//                 </Paper>

//                 {/* ── Tabs card ── */}
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
//                                         color: isActive ? "#fff" : theme.tabColor,
//                                         background: isActive ? theme.active : "transparent",
//                                         borderBottom: isActive ? `3px solid ${theme.tabColor}` : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         display: "flex", alignItems: "center", gap: 0.8,
//                                         "&:hover": { background: isActive ? theme.active : alpha(theme.tabColor, 0.06) },
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
//                                         color: isActive ? "#fff" : tColor.tabColor,
//                                         background: isActive ? tColor.active : "transparent",
//                                         borderRadius: "8px 8px 0 0",
//                                         borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
//                                         transition: "all 0.2s",
//                                         "&:hover": { background: isActive ? tColor.active : alpha(tColor.tabColor, 0.08) },
//                                     }}
//                                 >
//                                     {tab.label}
//                                 </Box>
//                             );
//                         })}
//                     </Box>

//                     {/* Multi-select filter bar + circle filter */}
//                     <CategoryFilterBar
//                         selectedCategories={selectedCategories}
//                         onChange={setSelectedCategories}
//                         circles={circleOptions}
//                         selectedCircle={selectedCircle}
//                         onCircleChange={setSelectedCircle}
//                     />

//                     {/* Chart */}
//                     <Box p={2.5}>
//                         {activeMetric === "performance" && (
//                             <AgingChart
//                                 title={METRIC_THEME.performance.label}
//                                 icon={METRIC_THEME.performance.icon}
//                                 gradientFrom={METRIC_THEME.performance.chartFrom}
//                                 gradientTo={METRIC_THEME.performance.chartTo}
//                                 chartData={performanceChart}
//                                 seriesNames={performanceSeries}
//                                 loading={loadingPerformance}
//                                 seriesInfo={performanceData?.graph_data?.[activeTech]?.series}
//                                 selectedCategories={selectedCategories}
//                                 selectedCircle={selectedCircle}
//                             />
//                         )}
//                         {activeMetric === "offered" && (
//                             <AgingChart
//                                 title={METRIC_THEME.offered.label}
//                                 icon={METRIC_THEME.offered.icon}
//                                 gradientFrom={METRIC_THEME.offered.chartFrom}
//                                 gradientTo={METRIC_THEME.offered.chartTo}
//                                 chartData={offeredChart}
//                                 seriesNames={offeredSeries}
//                                 loading={loadingOffered}
//                                 seriesInfo={offeredData?.graph_data?.[activeTech]?.series}
//                                 selectedCategories={selectedCategories}
//                                 selectedCircle={selectedCircle}
//                             />
//                         )}
//                     </Box>
//                 </Paper>

//                 {/* ── Summary Strip ── */}
//                 {(offeredData || performanceData) && (
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
//                         <Chip label={selectedMonths.length} size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Layer:</Typography>
//                         <Chip
//                             label={(offeredData?.layer || performanceData?.layer || "all").toUpperCase()}
//                             size="small"
//                             sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Tech:</Typography>
//                         <Chip label={activeTech} size="small"
//                             sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
//                         <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Filter:</Typography>
//                         <Chip
//                             label={activeLabel}
//                             size="small"
//                             sx={{
//                                 background: isAllSelected
//                                     ? "#546e7a"
//                                     : CATEGORY_FILTERS.find(c => c.key === selectedCategories[0])?.color ?? "#546e7a",
//                                 color: "#fff", fontWeight: 700, fontSize: 10.5, maxWidth: 260,
//                             }}
//                         />
//                         {selectedCircle && (
//                             <>
//                                 <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Circle:</Typography>
//                                 <Chip
//                                     label={selectedCircle}
//                                     size="small"
//                                     sx={{ background: CIRCLE_LINE_COLOR, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
//                                 />
//                             </>
//                         )}
//                         <Box display="flex" gap={0.8} flexWrap="wrap" ml={0.5}>
//                             {selectedMonths.map((m, i) => {
//                                 const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
//                                 return (
//                                     <Chip
//                                         key={m}
//                                         label={inputToApiMonth(m)}
//                                         size="small"
//                                         sx={{
//                                             background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
//                                             color: "#fff", fontWeight: 600, fontSize: 10,
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </Box>
//                     </Paper>
//                 )}
//             </Box>
//         </>
//     );
// };

// export default Performance_Aging_Graph;


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
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Divider,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckIcon from "@mui/icons-material/Check";
import RoomIcon from "@mui/icons-material/Room";
import { useNavigate } from "react-router-dom";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
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

const normalizeCategory = (str) =>
    (str ?? "").toString().trim().toLowerCase().replace(/\s+/g, "");

// Separator used internally to build composite keys like "Apr 2026__circle__AP"
const CIRCLE_KEY_SEP = "__circle__";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const METRIC_TABS = [
    { key: "performance", label: "Performance" },
    { key: "offered", label: "Offered" },
];

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

const METRIC_THEME = {
    performance: {
        active: "linear-gradient(135deg,#1e3c72,#2a5298)",
        tabColor: "#1e3c72",
        chartFrom: "#1e3c72",
        chartTo: "#2a5298",
        icon: <BarChartIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Performance",
    },
    offered: {
        active: "linear-gradient(135deg,#134e5e,#71b280)",
        tabColor: "#134e5e",
        chartFrom: "#134e5e",
        chartTo: "#71b280",
        icon: <SignalCellularAltIcon sx={{ color: "#fff", fontSize: 20 }} />,
        label: "SCFT Aging — Offered",
    },
};

const CATEGORY_FILTERS = [
     { key: "ALL",       label: "All",       color: "#546e7a" },
     { key: "<12%",      label: "<12%",      color: "#1565C0" },
     { key: "<13-21%",   label: "<13-21%",   color: "#2E7D32" },
     { key: "<22-30%",   label: "<22-30%",   color: "#E65100" },
     { key: ">30days%",  label: ">30days%",  color: "#6A1B9A" },
     { key: "Pending%",  label: "Pending%",  color: "#C62828" },
];

const REAL_CATEGORY_KEYS = CATEGORY_FILTERS.filter(c => c.key !== "ALL").map(c => c.key);

// Color palette used for circle % line overlays — cycles when several circles are selected
const CIRCLE_LINE_COLORS = [
    "#ad1457", "#00838f", "#f57f17", "#4527a0",
    "#2e7d32", "#c62828", "#5d4037", "#283593",
    "#00695c", "#ef6c00", "#6a1b9a", "#37474f",
];
const getCircleColor = (idx) => CIRCLE_LINE_COLORS[idx % CIRCLE_LINE_COLORS.length];

// ── Muted gradient palette ────────────────────────────────────────────────────
const SERIES_GRADIENTS = [
    { id: "sg0", from: "#4a6fa5", to: "#6b92c4", label: "#3d5a8a" },
    { id: "sg1", from: "#4a8c6e", to: "#6dab8c", label: "#3a7059" },
    { id: "sg2", from: "#b07d3a", to: "#d4a05a", label: "#8f621e" },
    { id: "sg3", from: "#7a5a9e", to: "#9e7dbd", label: "#5e4180" },
    { id: "sg4", from: "#3a8a8a", to: "#5ab0b0", label: "#2c6e6e" },
    { id: "sg5", from: "#a05060", to: "#c07080", label: "#7e3a48" },
    { id: "sg6", from: "#5a7a3a", to: "#7da05a", label: "#425c28" },
    { id: "sg7", from: "#6a5a3a", to: "#8c7a56", label: "#52431f" },
    { id: "sg8", from: "#3a5a8a", to: "#5a7aaa", label: "#28416a" },
    { id: "sg9", from: "#8a4a3a", to: "#aa6a5a", label: "#6a2f1f" },
    { id: "sg10", from: "#4a6a4a", to: "#6a8a6a", label: "#344d34" },
    { id: "sg11", from: "#6a4a6a", to: "#8a6a8a", label: "#4f2f4f" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SVG GRADIENT DEFS
// ─────────────────────────────────────────────────────────────────────────────
const GradientDefs = () => (
    <defs>
        {SERIES_GRADIENTS.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={g.from} stopOpacity={0.95} />
                <stop offset="100%" stopColor={g.to} stopOpacity={0.75} />
            </linearGradient>
        ))}
    </defs>
);

// ─────────────────────────────────────────────────────────────────────────────
// DATA TRANSFORM
// ─────────────────────────────────────────────────────────────────────────────
// Builds bar-chart rows. Supports two series shapes:
//  1. Legacy flat shape:    series[i].data[catIdx]
//  2. Circle-nested shape:  series[i].circles[circleName][catIdx]
// For shape 2, the bar value per series is the AVERAGE across all circles
// (keeps existing bar behaviour meaningful when circles are present).
const transformGraphData = (techData) => {
    if (!techData) return { chartData: [], seriesNames: [] };
    const { categories = [], series = [] } = techData;

    const seriesAvg = (s, catIdx) => {
        if (Array.isArray(s.data)) return s.data?.[catIdx] ?? null;
        if (s.circles) {
            const vals = Object.values(s.circles)
                .map((arr) => arr?.[catIdx])
                .filter((v) => typeof v === "number");
            if (!vals.length) return null;
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            return Math.round(avg * 10) / 10;
        }
        return null;
    };

    const chartData = categories.map((cat, catIdx) => {
        const entry = { category: cat };
        series.forEach((s) => { entry[s.name] = seriesAvg(s, catIdx); });
        return entry;
    });
    return { chartData, seriesNames: series.map((s) => s.name) };
};

// Extracts the list of circle names available across all series of a tech block
const getCircleOptions = (techData) => {
    if (!techData?.series?.length) return [];
    const set = new Set();
    techData.series.forEach((s) => {
        if (s.circles) Object.keys(s.circles).forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
};

// Builds the composite key used for a given series + circle pair
const circleLineKey = (seriesName, circle) => `${seriesName}${CIRCLE_KEY_SEP}${circle}`;

// Merges one line-value per (series, circle) pair into chartData.
// e.g. entry["Apr 2026__circle__AP"] = 23.3, entry["Apr 2026__circle__BR"] = 18.2
const withCircleLines = (chartData, techData, circles) => {
    if (!circles?.length || !techData?.series?.length) return chartData;
    const { series = [] } = techData;
    return chartData.map((row, catIdx) => {
        const next = { ...row };
        series.forEach((s) => {
            circles.forEach((circle) => {
                const val = s.circles?.[circle]?.[catIdx];
                next[circleLineKey(s.name, circle)] = typeof val === "number" ? val : null;
            });
        });
        return next;
    });
};

const mergeResponses = (responses) => {
    if (!responses?.length) return null;
    const valid = responses.filter(Boolean);
    if (!valid.length) return null;
    const merged = { status: true, layer: valid[0].layer, circles: [], graph_data: {} };
    const circleSet = new Set();
    valid.forEach((res) => (res?.circles || []).forEach((c) => circleSet.add(c)));
    merged.circles = Array.from(circleSet);

    ["4G", "5G", "4G+5G"].forEach((tech) => {
        const allSeries = [];
        let categories = [];
        valid.forEach((res) => {
            const td = res?.graph_data?.[tech];
            if (!td) return;
            if (td.categories?.length) categories = td.categories;
            if (td.series?.length) allSeries.push(...td.series);
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
const CustomTooltip = ({ active, payload, label, selectedCircles }) => {
    if (!active || !payload?.length) return null;
    const isCircleKey = (key) => String(key).includes(CIRCLE_KEY_SEP);
    const barEntries  = payload.filter((p) => !isCircleKey(p.dataKey));
    const lineEntries = payload.filter((p) => isCircleKey(p.dataKey));

    return (
        <Paper elevation={8} sx={{
            p: 1.8, minWidth: 220, borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
            background: "rgba(255,255,255,0.98)",
        }}>
            <Typography fontSize={12} fontWeight={700} color="#37474f" mb={0.8}
                sx={{ borderBottom: "1px solid #f0f0f0", pb: 0.6 }}>
                {label}
            </Typography>
            {barEntries.map((entry, idx) => {
                const g = SERIES_GRADIENTS[idx % SERIES_GRADIENTS.length];
                return (
                    <Box key={entry.name} display="flex" alignItems="center" gap={1} mb={0.45}>
                        <Box sx={{
                            width: 12, height: 12, borderRadius: "3px",
                            background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                            flexShrink: 0,
                        }} />
                        <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>{entry.name}</Typography>
                        <Typography fontSize={12} fontWeight={700} color={g.label}>
                            {entry.value != null ? entry.value : "—"}
                        </Typography>
                    </Box>
                );
            })}
            {lineEntries.length > 0 && (
                <Box mt={0.8} pt={0.8} sx={{ borderTop: "1px dashed #eee" }}>
                    {lineEntries.map((entry) => {
                        const [seriesName, circle] = String(entry.dataKey).split(CIRCLE_KEY_SEP);
                        const cIdx = (selectedCircles || []).indexOf(circle);
                        return (
                            <Box key={entry.dataKey} display="flex" alignItems="center" gap={1} mb={0.3}>
                                <Box sx={{ width: 12, height: 2, bgcolor: getCircleColor(cIdx), flexShrink: 0 }} />
                                <Typography fontSize={11.5} color="text.secondary" sx={{ flexGrow: 1 }}>
                                    {circle} ({seriesName})
                                </Typography>
                                <Typography fontSize={12} fontWeight={700} color={getCircleColor(cIdx)}>
                                    {entry.value != null ? `${entry.value}%` : "—"}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Paper>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM BAR TOP LABEL
// ─────────────────────────────────────────────────────────────────────────────
const BarTopLabel = (props) => {
    const { x, y, width, value, labelColor } = props;
    if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    return (
        <text
            x={x + width / 2}
            y={y - 5}
            textAnchor="middle"
            fontSize={10}
            fontWeight={700}
            fill={labelColor ?? "#555"}
        >
            {value}
        </text>
    );
};

// Label shown above each point on a circle % line
const LineTopLabel = (props) => {
    const { x, y, value, fillColor } = props;
    if (value == null || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    return (
        <text
            x={x}
            y={y - 10}
            textAnchor="middle"
            fontSize={10.5}
            fontWeight={700}
            fill={fillColor || CIRCLE_LINE_COLORS[0]}
        >
            {`${value}%`}
        </text>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM X-AXIS TICK
// ─────────────────────────────────────────────────────────────────────────────
const CustomXTick = ({ x, y, payload }) => (
    <text x={x} y={y + 12} textAnchor="middle" fontSize={11.5} fill="#607d8b" fontWeight={500}>
        {payload.value}
    </text>
);

// ─────────────────────────────────────────────────────────────────────────────
// CIRCLE MULTI-SELECT FILTER
// ─────────────────────────────────────────────────────────────────────────────
// selectedCircles semantics (mirrors the existing CATEGORY_FILTERS pattern):
//   [] (empty array)        → "All Circles" — no line drawn (same as category "ALL")
//   [c1, c2, ...]            → draws one % line per chosen circle
const CircleMultiFilter = ({ circles, selectedCircles, onChange }) => {
    if (!circles?.length) return null;

    const isAllActive = selectedCircles.length === 0;

    const handleSelectChange = (e) => {
        const val = e.target.value; // array from MUI multi-select
        if (val.includes("ALL")) {
            onChange([]);
            return;
        }
        if (val.includes("NONE")) {
            onChange([]);
            return;
        }
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
                    if (!selected || selected.length === 0) return "Select Circles";
                    if (selected.length === 1) return selected[0];
                    return `${selected.length} circles selected`;
                }}
                sx={{
                    minWidth: 170,
                    maxWidth: 230,
                    borderRadius: "10px",
                    fontSize: 13,
                    fontWeight: 600,
                    bgcolor: "#fff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c4c4c4" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72" },
                    "& .MuiSelect-select": {
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    },
                }}
                MenuProps={{ PaperProps: { sx: { maxHeight: 380 } } }}
            >
                {/* All Circles — selecting this clears everything (shows no line) */}
                {/* <MenuItem value="ALL" sx={{ fontSize: 13, fontWeight: 700 }}>
                    <Checkbox checked={isAllActive} size="small" sx={{ p: 0.4, mr: 0.5 }} />
                    <ListItemText primary="Select Circles" />
                </MenuItem> */}

                {/* None — explicit clear, same effect as All Circles */}
                <MenuItem value="NONE" sx={{ fontSize: 13, fontWeight: 700, color: "#c62828" }}>
                    <Checkbox checked={false} size="small" sx={{ p: 0.4, mr: 0.5 }} />
                    <ListItemText primary="None" />
                </MenuItem>

                <Divider />

                {circles.map((c, i) => (
                    <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
                        <Checkbox
                            checked={!isAllActive && selectedCircles.includes(c)}
                            size="small"
                            sx={{
                                p: 0.4, mr: 0.5,
                                color: getCircleColor(selectedCircles.indexOf(c) >= 0 ? selectedCircles.indexOf(c) : i),
                                "&.Mui-checked": { color: getCircleColor(selectedCircles.indexOf(c) >= 0 ? selectedCircles.indexOf(c) : i) },
                            }}
                        />
                        <ListItemText primary={c} />
                    </MenuItem>
                ))}
            </Select>
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHART PANEL — BAR CHART
// ─────────────────────────────────────────────────────────────────────────────
const ScftChart = ({
    title, icon, gradientFrom, gradientTo,
    chartData, seriesNames, loading, seriesInfo,
    selectedCategories, selectedCircles,
}) => {
    const isAllCategoriesSelected = selectedCategories.length === 0 || selectedCategories.includes("ALL");
    const hasCircleLines = selectedCircles && selectedCircles.length > 0;

    const filteredData = useMemo(() => {
        if (isAllCategoriesSelected) return chartData;
        return chartData.filter((row) =>
            selectedCategories.some(
                (cat) => normalizeCategory(row.category) === normalizeCategory(cat)
            )
        );
    }, [chartData, selectedCategories, isAllCategoriesSelected]);

    const hasData = filteredData.length > 0 && seriesNames.length > 0;

    const numSeries = seriesNames.length;
    const chartHeight = Math.max(420, 400 + Math.max(0, numSeries - 4) * 16);

    const maxBarSize = numSeries <= 2 ? 42
        : numSeries <= 4 ? 32
            : numSeries <= 6 ? 24
                : 18;

    const barCategoryGap = numSeries <= 3 ? "30%" : numSeries <= 6 ? "25%" : "20%";
    const barGap = numSeries <= 4 ? 4 : 3;

    return (
        <Box sx={{
            borderRadius: "16px",
            border: "1px solid #e8ecf0",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
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
                    {seriesInfo?.map((s, i) => {
                        const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
                        return (
                            <Chip
                                key={s.name}
                                label={s.name}
                                size="small"
                                sx={{
                                    background: alpha(g.from, 0.32),
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 10.5,
                                    border: `1.5px solid ${alpha(g.from, 0.55)}`,
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, pt: 3, pb: 2, background: "#fafbfc", minHeight: chartHeight + 40 }}>
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
                            {!isAllCategoriesSelected ? "No records for selected categories" : "Try adjusting the date range"}
                        </Typography>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <ComposedChart
                            data={filteredData}
                            margin={{ top: 32, right: 36, left: 0, bottom: 8 }}
                            barCategoryGap={barCategoryGap}
                            barGap={barGap}
                        >
                            <GradientDefs />

                            <CartesianGrid strokeDasharray="4 4" stroke="#eaeef2" vertical={false} />

                            <XAxis
                                dataKey="category"
                                tick={<CustomXTick />}
                                axisLine={{ stroke: "#dde3ea" }}
                                tickLine={false}
                                height={30}
                            />
                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 11, fill: "#90a4ae" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => v}
                                domain={[0, 100]}
                                ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
                                width={46}
                            />
                            {/* Right-side % axis — used by the circle % line overlay(s) */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 11, fill: "#ad1457" }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                                ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]}
                                tickFormatter={(v) => `${v}%`}
                                width={46}
                            />

                            <Tooltip
                                content={<CustomTooltip selectedCircles={selectedCircles} />}
                                cursor={{ fill: "rgba(100,120,150,0.05)", radius: 6 }}
                            />

                            <Legend
                                wrapperStyle={{ paddingTop: 20, paddingBottom: 4 }}
                                iconType="square"
                                iconSize={11}
                                formatter={(value, entry, index) => {
                                    const key = String(entry.dataKey);
                                    if (key.includes(CIRCLE_KEY_SEP)) {
                                        const [, circle] = key.split(CIRCLE_KEY_SEP);
                                        const cIdx = (selectedCircles || []).indexOf(circle);
                                        return (
                                            <span style={{ color: getCircleColor(cIdx), fontWeight: 700, fontSize: 11.5 }}>
                                                {circle} %
                                            </span>
                                        );
                                    }
                                    const g = SERIES_GRADIENTS[index % SERIES_GRADIENTS.length];
                                    return (
                                        <span style={{
                                            color: g.label,
                                            fontWeight: 700,
                                            fontSize: 11.5,
                                        }}>
                                            {value}
                                        </span>
                                    );
                                }}
                            />

                            {seriesNames.map((name, i) => {
                                const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
                                return (
                                    <Bar
                                        key={name}
                                        yAxisId="left"
                                        dataKey={name}
                                        fill={`url(#${g.id})`}
                                        radius={[5, 5, 0, 0]}
                                        maxBarSize={maxBarSize}
                                    >
                                        <LabelList
                                            dataKey={name}
                                            content={(props) => (
                                                <BarTopLabel {...props} labelColor={g.label} />
                                            )}
                                        />
                                    </Bar>
                                );
                            })}

                            {/* Circle % line overlays — one line per (series, selected circle) pair */}
                            {hasCircleLines && selectedCircles.map((circle, cIdx) => {
                                const color = getCircleColor(cIdx);
                                return seriesNames.map((name, sIdx) => (
                                    <Line
                                        key={circleLineKey(name, circle)}
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey={circleLineKey(name, circle)}
                                        stroke={color}
                                        strokeWidth={2.5}
                                        dot={{ r: 4, fill: color, strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                        connectNulls
                                        legendType={sIdx === 0 ? "line" : "none"}
                                    >
                                        <LabelList
                                            dataKey={circleLineKey(name, circle)}
                                            content={(props) => <LineTopLabel {...props} fillColor={color} />}
                                        />
                                    </Line>
                                ));
                            })}
                        </ComposedChart>
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
    const isEmpty = !fromMonth || !toMonth;

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
                        "&:hover fieldset": { borderColor: "#1e3c72" },
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
                        "&:hover fieldset": { borderColor: "#1e3c72" },
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
// MULTI-SELECT CATEGORY FILTER BAR (+ circle multi-filter alongside it)
// ─────────────────────────────────────────────────────────────────────────────
const CategoryFilterBar = ({ selectedCategories, onChange, circles, selectedCircles, onCirclesChange }) => {
    const isAllActive = selectedCategories.length === 0 || selectedCategories.includes("ALL");

    const handleClick = (key) => {
        if (key === "ALL") { onChange([]); return; }
        let next;
        if (isAllActive) {
            next = [key];
        } else if (selectedCategories.includes(key)) {
            next = selectedCategories.filter((k) => k !== key);
            if (next.length === 0) next = [];
        } else {
            next = [...selectedCategories, key];
            if (next.length === REAL_CATEGORY_KEYS.length) next = [];
        }
        onChange(next);
    };

    const selectedCount = isAllActive ? REAL_CATEGORY_KEYS.length : selectedCategories.length;

    return (
        <Box sx={{
            display: "flex", alignItems: "center", gap: 1,
            flexWrap: "wrap",
            px: 2, py: 1.4,
            bgcolor: "#f8fafc",
            borderBottom: "1px solid #e8ecf0",
            justifyContent: "space-between",
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Box display="flex" alignItems="center" gap={0.7} mr={0.5}>
                    <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
                    <Typography fontSize={12.5} fontWeight={700} color="#607d8b">Filter:</Typography>
                </Box>
                {CATEGORY_FILTERS.map((cf) => {
                    const isActive = cf.key === "ALL"
                        ? isAllActive
                        : (!isAllActive && selectedCategories.includes(cf.key));
                    return (
                        <Box
                            key={cf.key}
                            onClick={() => handleClick(cf.key)}
                            sx={{
                                px: 1.6, py: 0.5,
                                borderRadius: "20px",
                                fontSize: 12.5,
                                fontWeight: isActive ? 700 : 500,
                                cursor: "pointer", userSelect: "none",
                                transition: "all .15s",
                                border: `1.5px solid ${isActive ? cf.color : alpha(cf.color, 0.3)}`,
                                bgcolor: isActive ? cf.color : "transparent",
                                color: isActive ? "#fff" : cf.color,
                                display: "flex", alignItems: "center", gap: 0.5,
                                "&:hover": {
                                    bgcolor: isActive ? cf.color : alpha(cf.color, 0.08),
                                    borderColor: cf.color,
                                },
                                boxShadow: isActive ? `0 2px 8px ${alpha(cf.color, 0.3)}` : "none",
                            }}
                        >
                            {isActive && cf.key !== "ALL" && (
                                <CheckIcon sx={{ fontSize: 12, mr: 0.2 }} />
                            )}
                            {cf.label}
                        </Box>
                    );
                })}
                {!isAllActive && (
                    <Chip
                        label={`${selectedCount} selected`}
                        size="small"
                        onDelete={() => onChange([])}
                        sx={{
                            ml: 0.5, fontWeight: 700, fontSize: 11,
                            bgcolor: alpha("#546e7a", 0.12),
                            color: "#546e7a",
                            border: "1px solid " + alpha("#546e7a", 0.3),
                            "& .MuiChip-deleteIcon": { color: "#546e7a" },
                        }}
                    />
                )}
            </Box>

            {/* Circle multi-select filter */}
            <CircleMultiFilter circles={circles} selectedCircles={selectedCircles} onChange={onCirclesChange} />
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Performance_Aging_Graph = () => {
    const navigate = useNavigate();

    const [activeMetric, setActiveMetric] = useState("performance");
    const [activeTech, setActiveTech] = useState("4G");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCircles, setSelectedCircles] = useState([]); // [] = "All Circles" (no line)

    const currentMonthInput = apiMonthToInput(getCurrentMonthStr());
    const [fromMonth, setFromMonth] = useState(currentMonthInput);
    const [toMonth, setToMonth] = useState(currentMonthInput);

    const [performanceData, setPerformanceData] = useState(null);
    const [offeredData, setOfferedData] = useState(null);
    const [loadingPerf, setLoadingPerf] = useState(false);
    const [loadingOff, setLoadingOff] = useState(false);

    const selectedMonths = getMonthRange(fromMonth, toMonth);
    const isRangeValid = selectedMonths.length >= 1;

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
            fetchMonth("performance_idploy/generate-performance-circle-graph/", m)
        ))
            .then((results) => setPerformanceData(mergeResponses(results)))
            .finally(() => setLoadingPerf(false));

        Promise.all(selectedMonths.map((m) =>
            fetchMonth("performance_idploy/generate-offered-circle-graph/", m)
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
    const { chartData: perfChartRaw, seriesNames: perfSeries } =
        transformGraphData(performanceData?.graph_data?.[activeTech]);
    const { chartData: offChartRaw, seriesNames: offSeries } =
        transformGraphData(offeredData?.graph_data?.[activeTech]);

    // Merge in the circle % line values (no-op when "All Circles" / empty array is selected)
    const perfChart = useMemo(
        () => withCircleLines(perfChartRaw, performanceData?.graph_data?.[activeTech], selectedCircles),
        [perfChartRaw, performanceData, activeTech, selectedCircles]
    );
    const offChart = useMemo(
        () => withCircleLines(offChartRaw, offeredData?.graph_data?.[activeTech], selectedCircles),
        [offChartRaw, offeredData, activeTech, selectedCircles]
    );

    // Circle options available for the currently active metric + tech
    const circleOptions = useMemo(() => {
        const techData = activeMetric === "performance"
            ? performanceData?.graph_data?.[activeTech]
            : offeredData?.graph_data?.[activeTech];
        const fromTech = getCircleOptions(techData);
        if (fromTech.length) return fromTech;
        // fallback to top-level circles list returned by API
        return (activeMetric === "performance" ? performanceData?.circles : offeredData?.circles) || [];
    }, [activeMetric, activeTech, performanceData, offeredData]);

    // Drop any selected circles that are no longer valid for the current tech/metric
    useEffect(() => {
        if (selectedCircles.length && circleOptions.length) {
            const next = selectedCircles.filter((c) => circleOptions.includes(c));
            if (next.length !== selectedCircles.length) setSelectedCircles(next);
        }
    }, [circleOptions]); // eslint-disable-line

    const metricTheme = METRIC_THEME[activeMetric];
    const activeTechClr = TECH_COLORS[activeTech];
    const isAllCategories = selectedCategories.length === 0;
    const activeLabel = isAllCategories
        ? "All Categories"
        : selectedCategories.join(", ");

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
                    <Typography color="text.primary">Performance Aging Graph</Typography>
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
                            Performance Aging Dashboard
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
                            const theme = METRIC_THEME[tab.key];
                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveMetric(tab.key)}
                                    sx={{
                                        px: 4, py: 1.4,
                                        cursor: "pointer", userSelect: "none",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 14,
                                        color: isActive ? "#fff" : theme.tabColor,
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
                            const tColor = TECH_COLORS[tab.key];
                            return (
                                <Box
                                    key={tab.key}
                                    onClick={() => setActiveTech(tab.key)}
                                    sx={{
                                        px: 3, py: 1,
                                        cursor: "pointer", userSelect: "none",
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: 13,
                                        color: isActive ? "#fff" : tColor.tabColor,
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

                    {/* Multi-select category filter + circle multi-filter */}
                    <CategoryFilterBar
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                        circles={circleOptions}
                        selectedCircles={selectedCircles}
                        onCirclesChange={setSelectedCircles}
                    />

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
                                selectedCategories={selectedCategories}
                                selectedCircles={selectedCircles}
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
                                selectedCategories={selectedCategories}
                                selectedCircles={selectedCircles}
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
                        <Chip label={selectedMonths.length} size="small"
                            sx={{ background: metricTheme.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Tech:</Typography>
                        <Chip label={activeTech} size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Layer:</Typography>
                        <Chip
                            label={(performanceData?.layer || offeredData?.layer || "all").toUpperCase()}
                            size="small"
                            sx={{ background: activeTechClr.tabColor, color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                        />
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Filter:</Typography>
                        <Chip
                            label={activeLabel}
                            size="small"
                            sx={{
                                background: isAllCategories
                                    ? "#546e7a"
                                    : CATEGORY_FILTERS.find(c => c.key === selectedCategories[0])?.color ?? "#546e7a",
                                color: "#fff", fontWeight: 700, fontSize: 10.5, maxWidth: 260,
                            }}
                        />
                        {selectedCircles.length > 0 && (
                            <>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Circles:</Typography>
                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                    {selectedCircles.map((c, i) => (
                                        <Chip
                                            key={c}
                                            label={c}
                                            size="small"
                                            sx={{ background: getCircleColor(i), color: "#fff", fontWeight: 700, fontSize: 10.5 }}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}
                        <Typography variant="caption" color="text.secondary" fontWeight={700} ml={0.5}>Series:</Typography>
                        <Chip
                            label={`Performance: ${perfSeries.length}  |  Offered: ${offSeries.length}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: 10.5 }}
                        />
                        <Box display="flex" gap={0.8} flexWrap="wrap" ml={0.5}>
                            {selectedMonths.map((m, i) => {
                                const g = SERIES_GRADIENTS[i % SERIES_GRADIENTS.length];
                                return (
                                    <Chip
                                        key={m}
                                        label={inputToApiMonth(m)}
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                                            color: "#fff", fontWeight: 600, fontSize: 10,
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Paper>
                )}
            </Box>
        </>
    );
};

export default Performance_Aging_Graph;