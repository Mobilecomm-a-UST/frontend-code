


// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     Breadcrumbs,
//     Link,
//     Button,
//     Paper,
//     ClickAwayListener,
// } from "@mui/material";

// import DownloadIcon from "@mui/icons-material/Download";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// import { useNavigate } from "react-router-dom";
// import { postData, getData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ── Constants ────────────────────────────────────────────────────────────────
// const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// const CURRENT_YEAR = new Date().getFullYear();
// const CURRENT_MONTH = new Date().getMonth(); // 0-indexed
// const START_YEAR = 2000;

// // ── Helpers ───────────────────────────────────────────────────────────────────
// // { year:2026, month:5 } → "Jun 2026"  (matches backend %b %Y)
// const toApiFormat = (sel) =>
//     sel ? `${MONTH_SHORT[sel.month]} ${sel.year}` : "";

// // "Jun 2026" or "2026-06" → { year, month }
// const parseApiMonth = (str) => {
//     if (!str) return null;
//     const s = String(str).trim();
//     if (/^[A-Za-z]{3} \d{4}$/.test(s)) {
//         const mIdx = MONTH_SHORT.indexOf(s.slice(0, 3));
//         const yr = parseInt(s.slice(4));
//         if (mIdx !== -1 && !isNaN(yr)) return { year: yr, month: mIdx };
//     }
//     const ym = s.match(/^(\d{4})-(\d{2})$/);
//     if (ym) return { year: parseInt(ym[1]), month: parseInt(ym[2]) - 1 };
//     return null;
// };

// // ── Tech tabs ────────────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G", label: "4G" },
//     { key: "5G", label: "5G" },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ── Tab Colors ────────────────────────────────────────────────────────────────
// const TECH_COLORS = {
//     "4G": {
//         active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         hover: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
//         header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
//         tabColor: "#1e3c72",
//     },
//     "5G": {
//         active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         hover: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
//         header: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//         tabColor: "#134e5e",
//     },
//     "4G+5G": {
//         active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
//         hover: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
//         header: "linear-gradient(135deg, #252326 0%, #414345 100%)",
//         tabColor: "#41295a",
//     },
// };

// // ── Cell styles ───────────────────────────────────────────────────────────────
// const cellStyle = {
//     padding: "2px 6px",
//     border: "1px solid #000000",
//     textAlign: "center",
//     fontSize: 13,
//     whiteSpace: "nowrap",
// };

// const stickyCell = {
//     ...cellStyle,
//     position: "sticky",
//     left: 0,
//     zIndex: 2,
//     textAlign: "left",
//     fontWeight: 600,
// };

// const formatGrandTotal = (val) => {
//     const num = parseFloat(val);
//     if (isNaN(num)) return 0;
//     return Number.isInteger(num) ? num : num.toFixed(1);
// };

// // ── Year-Month Picker ────────────────────────────────────────────────────────
// const YearMonthPicker = ({ value, onChange, apiMonths }) => {
//     const [open, setOpen] = useState(false);
//     const [hoveredYear, setHoveredYear] = useState(value?.year ?? CURRENT_YEAR);
//     const yearListRef = useRef(null);

//     const years = [];
//     for (let y = START_YEAR; y <= CURRENT_YEAR; y++) years.push(y);

//     useEffect(() => {
//         if (open && yearListRef.current) {
//             const el = yearListRef.current.querySelector(`[data-year="${hoveredYear}"]`);
//             if (el) el.scrollIntoView({ block: "center" });
//         }
//     }, [open]);

//     const isDisabled = (year, mIdx) => {
//         if (year > CURRENT_YEAR) return true;
//         if (year === CURRENT_YEAR && mIdx > CURRENT_MONTH) return true;
//         if (apiMonths && apiMonths.length > 0) {
//             const key = `${MONTH_SHORT[mIdx]} ${year}`;
//             return !apiMonths.includes(key);
//         }
//         return false;
//     };

//     const handleMonthClick = (year, mIdx) => {
//         if (isDisabled(year, mIdx)) return;
//         onChange({ year, month: mIdx });
//         setOpen(false);
//     };

//     const handleClear = () => { onChange(null); setOpen(false); };
//     const handleThisMonth = () => { onChange({ year: CURRENT_YEAR, month: CURRENT_MONTH }); setOpen(false); };

//     const displayText = value
//         ? `${MONTH_SHORT[value.month]} ${value.year}`
//         : "Select month";

//     return (
//         <ClickAwayListener onClickAway={() => setOpen(false)}>
//             <Box sx={{ position: "relative", display: "inline-block" }}>
//                 {/* Trigger */}
//                 <Box
//                     onClick={() => setOpen((p) => !p)}
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         px: 1.5,
//                         py: 0.7,
//                         border: open ? "2px solid #1e3c72" : "1px solid #c4c4c4",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         bgcolor: "#fff",
//                         minWidth: 180,
//                         userSelect: "none",
//                         "&:hover": { borderColor: "#1e3c72" },
//                     }}
//                 >
//                     <Box sx={{ flex: 1 }}>
//                         <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>
//                             Month
//                         </Typography>
//                         <Typography sx={{ fontSize: 14, fontWeight: 600, color: value ? "#1a1a2e" : "#aaa", lineHeight: 1 }}>
//                             {displayText}
//                         </Typography>
//                     </Box>
//                     <CalendarMonthIcon sx={{ fontSize: 20, color: open ? "#1e3c72" : "#aaa" }} />
//                 </Box>

//                 {/* Dropdown */}
//                 {open && (
//                     <Paper
//                         elevation={8}
//                         sx={{
//                             position: "absolute",
//                             top: "calc(100% + 6px)",
//                             right: 0,
//                             zIndex: 1400,
//                             borderRadius: "12px",
//                             overflow: "hidden",
//                             minWidth: 310,
//                             boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//                         }}
//                     >
//                         <Box display="flex" sx={{ height: 240 }}>

//                             {/* Year list */}
//                             <Box
//                                 ref={yearListRef}
//                                 sx={{
//                                     width: 80,
//                                     overflowY: "auto",
//                                     bgcolor: "#f5f7fa",
//                                     borderRight: "1px solid #e8ecf0",
//                                     py: 0.5,
//                                     "&::-webkit-scrollbar": { width: 4 },
//                                     "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 2 },
//                                 }}
//                             >
//                                 {years.map((yr) => {
//                                     const isSelected = value?.year === yr;
//                                     const isHovered = hoveredYear === yr;
//                                     return (
//                                         <Box
//                                             key={yr}
//                                             data-year={yr}
//                                             onClick={() => setHoveredYear(yr)}
//                                             sx={{
//                                                 px: 2,
//                                                 py: 0.9,
//                                                 cursor: "pointer",
//                                                 fontSize: 13.5,
//                                                 fontWeight: isSelected || isHovered ? 700 : 400,
//                                                 color: isSelected ? "#fff" : isHovered ? "#1e3c72" : "#374151",
//                                                 bgcolor: isSelected ? "#1e3c72" : isHovered ? "#e8edf8" : "transparent",
//                                                 borderRadius: "6px",
//                                                 mx: 0.5,
//                                                 transition: "all .12s",
//                                                 "&:hover": {
//                                                     bgcolor: isSelected ? "#1e3c72" : "#dde4f5",
//                                                     color: isSelected ? "#fff" : "#1e3c72",
//                                                 },
//                                             }}
//                                         >
//                                             {yr}
//                                         </Box>
//                                     );
//                                 })}
//                             </Box>

//                             {/* Month grid */}
//                             <Box
//                                 sx={{
//                                     flex: 1,
//                                     p: 1.5,
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     justifyContent: "center",
//                                 }}
//                             >
//                                 <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.8 }}>
//                                     {MONTH_SHORT.map((mn, mIdx) => {
//                                         const disabled = isDisabled(hoveredYear, mIdx);
//                                         const isActive = value?.year === hoveredYear && value?.month === mIdx;
//                                         return (
//                                             <Box
//                                                 key={mn}
//                                                 onClick={() => handleMonthClick(hoveredYear, mIdx)}
//                                                 sx={{
//                                                     textAlign: "center",
//                                                     py: 0.8,
//                                                     borderRadius: "8px",
//                                                     fontSize: 13,
//                                                     fontWeight: isActive ? 700 : 400,
//                                                     cursor: disabled ? "not-allowed" : "pointer",
//                                                     color: disabled ? "#ccc" : isActive ? "#fff" : "#374151",
//                                                     bgcolor: isActive ? "#1e3c72" : "transparent",
//                                                     border: isActive ? "none" : "1px solid transparent",
//                                                     transition: "all .12s",
//                                                     "&:hover": disabled ? {} : {
//                                                         bgcolor: isActive ? "#1e3c72" : "#e8edf8",
//                                                         color: isActive ? "#fff" : "#1e3c72",
//                                                         borderColor: "#bcd0f0",
//                                                     },
//                                                 }}
//                                             >
//                                                 {mn}
//                                             </Box>
//                                         );
//                                     })}
//                                 </Box>
//                             </Box>
//                         </Box>

//                         {/* Footer */}
//                         <Box
//                             display="flex"
//                             justifyContent="space-between"
//                             alignItems="center"
//                             sx={{ px: 2, py: 1, borderTop: "1px solid #e8ecf0", bgcolor: "#fafbfc" }}
//                         >
//                             <Button
//                                 size="small"
//                                 onClick={handleClear}
//                                 sx={{ textTransform: "none", fontSize: 13, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}
//                             >
//                                 Clear
//                             </Button>
//                             <Button
//                                 size="small"
//                                 onClick={handleThisMonth}
//                                 sx={{ textTransform: "none", fontSize: 13, color: "#1e3c72", fontWeight: 700, "&:hover": { bgcolor: "#e8edf8" } }}
//                             >
//                                 This month
//                             </Button>
//                         </Box>
//                     </Paper>
//                 )}
//             </Box>
//         </ClickAwayListener>
//     );
// };

// // ── Table Component ───────────────────────────────────────────────────────────
// const TechTable = ({ tech, apiResponse, monthLabel }) => {

//     const columns = [
//         { label: "Circle", key: "Circle" },
//         { label: "<7", key: "<7" },
//         { label: "8-12", key: "8-12" },
//         { label: "13-21", key: "13-21" },
//         { label: ">21", key: ">21" },
//         { label: "Total", key: "Total" },
//     ];

//     const colors = TECH_COLORS[tech];
//     const TOTAL_BG = "#b2f0c5";
//     const STRIPE = "#f4f7fb";

//     const data = apiResponse?.data?.[tech] || {};
//     const grandTotal = apiResponse?.data?.[tech] || {};
//     const entries = Object.entries(data);

//     return (
//         <Box
//             mt={1}
//             sx={{
//                 overflowX: "auto",
//                 borderRadius: 2,
//                 border: "1px solid #000000",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//         >
//             <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 900 }}>
//                 <thead>
//                     {/* Date range header */}
//                     <tr>
//                         <th
//                             style={{
//                                 ...stickyCell,
//                                 background: colors.active,
//                                 color: "#efebeb",
//                                 fontSize: 14,
//                                 textAlign: "center",
//                                 fontWeight: 700,
//                                 zIndex: 3,
//                             }}
//                         />
//                         <th
//                             colSpan={columns.length - 1}
//                             style={{
//                                 ...cellStyle,
//                                 background: colors.active,
//                                 color: "#fff",
//                                 textAlign: "center",
//                                 fontSize: 14,
//                                 fontWeight: 700,
//                             }}
//                         >
//                             {monthLabel}
//                         </th>
//                     </tr>

//                     {/* Column headers */}
//                     <tr style={{ background: colors.header }}>
//                         {columns.map((col) => (
//                             <th
//                                 key={col.key}
//                                 style={{
//                                     ...cellStyle,
//                                     background: colors.header,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                 }}
//                             >
//                                 {col.label}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {entries.length > 0 ? (
//                         entries.map(([circle, val], idx) => (
//                             <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
//                                 {columns.map((col) => (
//                                     <td key={col.key} style={cellStyle}>
//                                         {val?.[col.key] ?? 0}
//                                     </td>
//                                 ))}
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15 }}>
//                                 No Data Available
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </Box>
//     );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const Pending_Aging = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] = useState(null);
//     const [activeType, setActiveType] = useState("performance");
//     const [activeTech, setActiveTech] = useState("4G");
//     const [apiMonths, setApiMonths] = useState([]);

//     // Default → current month
//     const [selected, setSelected] = useState({
//         year: CURRENT_YEAR,
//         month: CURRENT_MONTH,
//     });

//     // ── Load available months from API ────────────────────────────────────
//     useEffect(() => {
//         const fetchMonths = async () => {
//             try {
//                 const res = await getData("idploy/months/");
//                 const list =
//                     Array.isArray(res) ? res :
//                         Array.isArray(res?.data) ? res.data :
//                             Array.isArray(res?.months) ? res.months :
//                                 Array.isArray(res?.results) ? res.results : [];

//                 if (list.length > 0) {
//                     const normalised = list.map((item) => {
//                         const str = typeof item === "object" ? (item.value ?? item.label ?? "") : String(item);
//                         if (/^[A-Za-z]{3} \d{4}$/.test(str.trim())) return str.trim();
//                         const ym = str.match(/^(\d{4})-(\d{2})$/);
//                         if (ym) return `${MONTH_SHORT[parseInt(ym[2]) - 1]} ${ym[1]}`;
//                         return str;
//                     });
//                     setApiMonths(normalised);
//                     const first = parseApiMonth(normalised[0]);
//                     if (first) setSelected(first);
//                 }
//             } catch (err) {
//                 console.warn("Months API failed:", err);
//             }
//         };
//         fetchMonths();
//     }, []);

//     // ── Derived API string e.g. "Jun 2026" ───────────────────────────────
//     const apiValue = toApiFormat(selected);

//     // ── Fetch table data ──────────────────────────────────────────────────
//     const fetchData = useCallback(async () => {
//         if (!selected) return;

//         try {
//             action(true);

//             const api =
//                 activeType === "performance"
//                     ? "performance_tat/generate-tat-report/"
//                     : "performance_idploy/generate-scft-offered/";

//             const formData = new FormData();

//             formData.append("year", selected.year);
//             formData.append("month", selected.month + 1);

//             const res = await postData(api, formData);

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse(null);
//                 console.log(res?.message);
//             }
//         } catch (error) {
//             console.error("Fetch Error:", error);
//             setApiResponse(null);
//         } finally {
//             action(false);
//         }
//     }, [selected, activeType]);

//     useEffect(() => {
//         const timer = setTimeout(() => fetchData(), 500);
//         return () => clearTimeout(timer);
//     }, [fetchData]);

//     // ── Download ──────────────────────────────────────────────────────────
//     const handleDownload = () => {
//         const url = apiResponse?.download_url;
//         if (!url) return;
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <Box p={1}>

//             {/* Breadcrumb */}
//             <Box mb={1}>
//                 {/* <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/tools/performance_at_tat")}>Performance AT</Link>
//                     <Typography color="text.primary">Pending Aging</Typography>
//                 </Breadcrumbs> */}
//             </Box>

//             {/* Top Bar */}
//             <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>

//                 {/* Left */}
//                 <Box>
//                     <Typography variant="h5">
//                         {activeType === "performance" ? "AT Pending Aging" : "SCFT Aging Offered"}
//                     </Typography>
//                     <Box mt={1} display="flex" gap={1} />
//                 </Box>

//                 {/* Right */}
//                 <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">

//                     {/* ── Month Picker ── */}
//                     <YearMonthPicker
//                         value={selected}
//                         apiMonths={apiMonths}
//                         onChange={(val) => {
//                             setSelected(val);
//                             setApiResponse(null);
//                         }}
//                     />

//                     {/* Download */}
//                     <IconButton
//                         onClick={handleDownload}
//                         title="Download Excel"
//                         disabled={!apiResponse?.download_url}
//                     >
//                         <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
//                     </IconButton>
//                 </Box>
//             </Box>

//             {/* Tech Tabs */}
//             <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
//                 {TECH_TABS.map((tab) => {
//                     const isActive = activeTech === tab.key;
//                     const tColor = TECH_COLORS[tab.key];
//                     return (
//                         <Box
//                             key={tab.key}
//                             onClick={() => setActiveTech(tab.key)}
//                             sx={{
//                                 px: 3,
//                                 py: 1,
//                                 cursor: "pointer",
//                                 fontWeight: isActive ? 700 : 500,
//                                 color: isActive ? "#fff" : tColor.tabColor,
//                                 background: isActive ? tColor.active : "transparent",
//                                 borderRadius: "6px 6px 0 0",
//                                 transition: "all 0.2s",
//                                 "&:hover": { background: isActive ? tColor.active : "#f0f4ff" },
//                             }}
//                         >
//                             {tab.label}
//                         </Box>
//                     );
//                 })}
//             </Box>

//             {/* Table */}
//             <TechTable
//                 tech={activeTech}
//                 apiResponse={apiResponse}
//                 monthLabel={apiValue}
//             />

//             {loading}
//         </Box>
//     );
// };

// export default Pending_Aging;


import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Typography,
    IconButton,
    Breadcrumbs,
    Link,
    Button,
    Paper,
    ClickAwayListener,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useNavigate } from "react-router-dom";
import { postData, getData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth();
const START_YEAR = 2000;

// ── Helpers ───────────────────────────────────────────────────────────────────
const toApiFormat = (sel) => sel ? `${MONTH_SHORT[sel.month]} ${sel.year}` : "";

const parseApiMonth = (str) => {
    if (!str) return null;
    const s = String(str).trim();
    if (/^[A-Za-z]{3} \d{4}$/.test(s)) {
        const mIdx = MONTH_SHORT.indexOf(s.slice(0, 3));
        const yr = parseInt(s.slice(4));
        if (mIdx !== -1 && !isNaN(yr)) return { year: yr, month: mIdx };
    }
    const ym = s.match(/^(\d{4})-(\d{2})$/);
    if (ym) return { year: parseInt(ym[1]), month: parseInt(ym[2]) - 1 };
    return null;
};

const pad2 = (n) => String(n).padStart(2, "0");
const toDateString = (d) => d ? `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` : "";
const toDisplayDate = (d) => d ? `${pad2(d.getDate())} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}` : "";
const todayDate = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const firstOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d; };

// ── Tech tabs ────────────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Tab Colors ────────────────────────────────────────────────────────────────
const TECH_COLORS = {
    "4G": {
        active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        hover: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
        header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        tabColor: "#1e3c72",
    },
    "5G": {
        active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        hover: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
        header: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
        tabColor: "#134e5e",
    },
    "4G+5G": {
        active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
        hover: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
        header: "linear-gradient(135deg, #252326 0%, #414345 100%)",
        tabColor: "#41295a",
    },
};

// ── Cell styles ───────────────────────────────────────────────────────────────
const cellStyle = {
    padding: "2px 6px",
    border: "1px solid #000000",
    textAlign: "center",
    fontSize: 13,
    whiteSpace: "nowrap",
};

const stickyCell = {
    ...cellStyle,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "left",
    fontWeight: 600,
};

const formatGrandTotal = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return Number.isInteger(num) ? num : num.toFixed(1);
};

// ── Single Date Picker ────────────────────────────────────────────────────────
const SingleDatePicker = ({ value, onChange, label, maxDate, minDate }) => {
    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(value ? value.getFullYear() : CURRENT_YEAR);
    const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : CURRENT_MONTH);
    const [yearListOpen, setYearListOpen] = useState(false);
    const yearListRef = useRef(null);

    useEffect(() => {
        if (value) { setViewYear(value.getFullYear()); setViewMonth(value.getMonth()); }
    }, [value]);

    useEffect(() => {
        if (yearListOpen && yearListRef.current) {
            const el = yearListRef.current.querySelector(`[data-year="${viewYear}"]`);
            if (el) el.scrollIntoView({ block: "center" });
        }
    }, [yearListOpen]);

    const years = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) years.push(y);

    const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

    const isDateDisabled = (d) => {
        if (maxDate && d > maxDate) return true;
        if (minDate && d < minDate) return true;
        if (d > todayDate()) return true;
        return false;
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        const nm = viewMonth === 11 ? 0 : viewMonth + 1;
        const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
        if (new Date(ny, nm, 1) > todayDate()) return;
        setViewMonth(nm);
        if (viewMonth === 11) setViewYear(y => y + 1);
    };

    const handleDayClick = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        if (isDateDisabled(d)) return;
        onChange(d);
        setOpen(false);
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDayOfWeek = getFirstDayOfMonth(viewYear, viewMonth);
    const displayText = value ? toDisplayDate(value) : `Select ${label}`;

    return (
        <ClickAwayListener onClickAway={() => { setOpen(false); setYearListOpen(false); }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box
                    onClick={() => setOpen(p => !p)}
                    sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        px: 1.5, py: 0.7,
                        border: open ? "2px solid #1e3c72" : "1px solid #c4c4c4",
                        borderRadius: "8px", cursor: "pointer", bgcolor: "#fff",
                        minWidth: 155, userSelect: "none",
                        "&:hover": { borderColor: "#1e3c72" },
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>{label}</Typography>
                        <Typography sx={{ fontSize: 13, fontWeight: 600, color: value ? "#1a1a2e" : "#aaa", lineHeight: 1 }}>{displayText}</Typography>
                    </Box>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: open ? "#1e3c72" : "#aaa" }} />
                </Box>

                {open && (
                    <Paper elevation={8} sx={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1400, borderRadius: "12px", overflow: "hidden", minWidth: 260, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                        {/* Header */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1, borderBottom: "1px solid #e8ecf0", bgcolor: "#f5f7fa" }}>
                            <IconButton size="small" onClick={prevMonth} sx={{ p: 0.5 }}>
                                <KeyboardArrowRightIcon sx={{ transform: "rotate(180deg)", fontSize: 18 }} />
                            </IconButton>
                            <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>{MONTH_SHORT[viewMonth]}</Typography>
                                <Box onClick={(e) => { e.stopPropagation(); setYearListOpen(p => !p); }}
                                    sx={{ fontSize: 13, fontWeight: 700, color: "#1e3c72", cursor: "pointer", px: 0.5, borderRadius: "4px", "&:hover": { bgcolor: "#e8edf8" } }}>
                                    {viewYear} ▾
                                </Box>
                            </Box>
                            <IconButton size="small" onClick={nextMonth} sx={{ p: 0.5 }}>
                                <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>

                        {/* Year overlay */}
                        {yearListOpen && (
                            <Box ref={yearListRef} onClick={(e) => e.stopPropagation()}
                                sx={{ position: "absolute", top: 44, left: 0, right: 0, zIndex: 10, maxHeight: 180, overflowY: "auto", bgcolor: "#fff", border: "1px solid #e0e0e0", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 2 } }}>
                                {years.map((yr) => (
                                    <Box key={yr} data-year={yr} onClick={() => { setViewYear(yr); setYearListOpen(false); }}
                                        sx={{ px: 2, py: 0.7, fontSize: 13, cursor: "pointer", fontWeight: viewYear === yr ? 700 : 400, color: viewYear === yr ? "#fff" : "#374151", bgcolor: viewYear === yr ? "#1e3c72" : "transparent", "&:hover": { bgcolor: viewYear === yr ? "#1e3c72" : "#e8edf8" } }}>
                                        {yr}
                                    </Box>
                                ))}
                            </Box>
                        )}

                        {/* Day headers */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", px: 1, pt: 1 }}>
                            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                <Box key={d} sx={{ textAlign: "center", fontSize: 11, color: "#9e9e9e", fontWeight: 600, py: 0.5 }}>{d}</Box>
                            ))}
                        </Box>

                        {/* Days */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", px: 1, pb: 1, gap: 0.3 }}>
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => <Box key={`e-${i}`} />)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const thisDate = new Date(viewYear, viewMonth, day);
                                const disabled = isDateDisabled(thisDate);
                                const isSelected = value && value.getFullYear() === viewYear && value.getMonth() === viewMonth && value.getDate() === day;
                                const isToday = thisDate.toDateString() === new Date().toDateString();
                                return (
                                    <Box key={day} onClick={() => handleDayClick(day)}
                                        sx={{ textAlign: "center", py: 0.6, borderRadius: "6px", fontSize: 12.5, fontWeight: isSelected ? 700 : isToday ? 600 : 400, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#ccc" : isSelected ? "#fff" : isToday ? "#1e3c72" : "#374151", bgcolor: isSelected ? "#1e3c72" : "transparent", border: isToday && !isSelected ? "1px solid #1e3c72" : "1px solid transparent", transition: "all .1s", "&:hover": disabled ? {} : { bgcolor: isSelected ? "#1e3c72" : "#e8edf8", color: isSelected ? "#fff" : "#1e3c72" } }}>
                                        {day}
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Footer */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1, borderTop: "1px solid #e8ecf0", bgcolor: "#fafbfc" }}>
                            <Button size="small" onClick={() => { onChange(null); setOpen(false); }} sx={{ textTransform: "none", fontSize: 12, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}>Clear</Button>
                            <Button size="small" onClick={() => { onChange(todayDate()); setOpen(false); }} sx={{ textTransform: "none", fontSize: 12, color: "#1e3c72", fontWeight: 700, "&:hover": { bgcolor: "#e8edf8" } }}>Today</Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

// ── Year-Month Picker ────────────────────────────────────────────────────────
const YearMonthPicker = ({ value, onChange, apiMonths }) => {
    const [open, setOpen] = useState(false);
    const [hoveredYear, setHoveredYear] = useState(value?.year ?? CURRENT_YEAR);
    const yearListRef = useRef(null);

    const years = [];
    for (let y = START_YEAR; y <= CURRENT_YEAR; y++) years.push(y);

    useEffect(() => {
        if (open && yearListRef.current) {
            const el = yearListRef.current.querySelector(`[data-year="${hoveredYear}"]`);
            if (el) el.scrollIntoView({ block: "center" });
        }
    }, [open]);

    const isDisabled = (year, mIdx) => {
        if (year > CURRENT_YEAR) return true;
        if (year === CURRENT_YEAR && mIdx > CURRENT_MONTH) return true;
        if (apiMonths && apiMonths.length > 0) {
            const key = `${MONTH_SHORT[mIdx]} ${year}`;
            return !apiMonths.includes(key);
        }
        return false;
    };

    const handleMonthClick = (year, mIdx) => {
        if (isDisabled(year, mIdx)) return;
        onChange({ year, month: mIdx });
        setOpen(false);
    };

    const displayText = value ? `${MONTH_SHORT[value.month]} ${value.year}` : "Select month";

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                <Box onClick={() => setOpen((p) => !p)}
                    sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 0.7, border: open ? "2px solid #1e3c72" : "1px solid #c4c4c4", borderRadius: "8px", cursor: "pointer", bgcolor: "#fff", minWidth: 180, userSelect: "none", "&:hover": { borderColor: "#1e3c72" } }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>Month</Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: value ? "#1a1a2e" : "#aaa", lineHeight: 1 }}>{displayText}</Typography>
                    </Box>
                    <CalendarMonthIcon sx={{ fontSize: 20, color: open ? "#1e3c72" : "#aaa" }} />
                </Box>

                {open && (
                    <Paper elevation={8} sx={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1400, borderRadius: "12px", overflow: "hidden", minWidth: 310, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                        <Box display="flex" sx={{ height: 240 }}>
                            <Box ref={yearListRef} sx={{ width: 80, overflowY: "auto", bgcolor: "#f5f7fa", borderRight: "1px solid #e8ecf0", py: 0.5, "&::-webkit-scrollbar": { width: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 2 } }}>
                                {years.map((yr) => {
                                    const isSelected = value?.year === yr;
                                    const isHovered = hoveredYear === yr;
                                    return (
                                        <Box key={yr} data-year={yr} onClick={() => setHoveredYear(yr)}
                                            sx={{ px: 2, py: 0.9, cursor: "pointer", fontSize: 13.5, fontWeight: isSelected || isHovered ? 700 : 400, color: isSelected ? "#fff" : isHovered ? "#1e3c72" : "#374151", bgcolor: isSelected ? "#1e3c72" : isHovered ? "#e8edf8" : "transparent", borderRadius: "6px", mx: 0.5, transition: "all .12s", "&:hover": { bgcolor: isSelected ? "#1e3c72" : "#dde4f5", color: isSelected ? "#fff" : "#1e3c72" } }}>
                                            {yr}
                                        </Box>
                                    );
                                })}
                            </Box>
                            <Box sx={{ flex: 1, p: 1.5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.8 }}>
                                    {MONTH_SHORT.map((mn, mIdx) => {
                                        const disabled = isDisabled(hoveredYear, mIdx);
                                        const isActive = value?.year === hoveredYear && value?.month === mIdx;
                                        return (
                                            <Box key={mn} onClick={() => handleMonthClick(hoveredYear, mIdx)}
                                                sx={{ textAlign: "center", py: 0.8, borderRadius: "8px", fontSize: 13, fontWeight: isActive ? 700 : 400, cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "#ccc" : isActive ? "#fff" : "#374151", bgcolor: isActive ? "#1e3c72" : "transparent", border: isActive ? "none" : "1px solid transparent", transition: "all .12s", "&:hover": disabled ? {} : { bgcolor: isActive ? "#1e3c72" : "#e8edf8", color: isActive ? "#fff" : "#1e3c72", borderColor: "#bcd0f0" } }}>
                                                {mn}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1, borderTop: "1px solid #e8ecf0", bgcolor: "#fafbfc" }}>
                            <Button size="small" onClick={() => { onChange(null); setOpen(false); }} sx={{ textTransform: "none", fontSize: 13, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}>Clear</Button>
                            <Button size="small" onClick={() => { onChange({ year: CURRENT_YEAR, month: CURRENT_MONTH }); setOpen(false); }} sx={{ textTransform: "none", fontSize: 13, color: "#1e3c72", fontWeight: 700, "&:hover": { bgcolor: "#e8edf8" } }}>This month</Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

// ── Table Component ───────────────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, titleLabel }) => {
    const columns = [
        { label: "Circle", key: "Circle" },
        { label: "<7", key: "<7" },
        { label: "8-12", key: "8-12" },
        { label: "13-21", key: "13-21" },
        { label: ">21", key: ">21" },
        { label: "Total", key: "Total" },
    ];

    const colors = TECH_COLORS[tech];
    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const data = apiResponse?.data?.[tech] || {};
    const entries = Object.entries(data);

    return (
        <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #000000", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 900 }}>
                <thead>
                    <tr>
                        <th style={{ ...stickyCell, background: colors.active, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, zIndex: 3 }} />
                        <th colSpan={columns.length - 1} style={{ ...cellStyle, background: colors.active, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700 }}>
                            {titleLabel || "Select a date range or month to load data"}
                        </th>
                    </tr>
                    <tr style={{ background: colors.header }}>
                        {columns.map((col) => (
                            <th key={col.key} style={{ ...cellStyle, background: colors.header, color: "#fff", fontWeight: 700 }}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {entries.length > 0 ? (
                        entries.map(([circle, val], idx) => (
                            <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
                                {columns.map((col) => (
                                    <td key={col.key} style={cellStyle}>{val?.[col.key] ?? 0}</td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15 }}>No Data Available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Box>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Pending_Aging = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [filterMode, setFilterMode] = useState("month");
    const [apiResponse, setApiResponse] = useState(null);
    const [activeType, setActiveType] = useState("performance");
    const [activeTech, setActiveTech] = useState("4G");
    const [apiMonths, setApiMonths] = useState([]);

    const [selected, setSelected] = useState({ year: CURRENT_YEAR, month: CURRENT_MONTH });
    const [startDate, setStartDate] = useState(firstOfMonth());
    const [endDate, setEndDate] = useState(todayDate());

    // ── Load available months ─────────────────────────────────────────────
    useEffect(() => {
        const fetchMonths = async () => {
            try {
                const res = await getData("idploy/months/");
                const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : Array.isArray(res?.months) ? res.months : Array.isArray(res?.results) ? res.results : [];
                if (list.length > 0) {
                    const normalised = list.map((item) => {
                        const str = typeof item === "object" ? (item.value ?? item.label ?? "") : String(item);
                        if (/^[A-Za-z]{3} \d{4}$/.test(str.trim())) return str.trim();
                        const ym = str.match(/^(\d{4})-(\d{2})$/);
                        if (ym) return `${MONTH_SHORT[parseInt(ym[2]) - 1]} ${ym[1]}`;
                        return str;
                    });
                    setApiMonths(normalised);
                    const first = parseApiMonth(normalised[0]);
                    if (first) setSelected(first);
                }
            } catch (err) {
                console.warn("Months API failed:", err);
            }
        };
        fetchMonths();
    }, []);

    // ── Title label ───────────────────────────────────────────────────────
    const titleLabel = (() => {
        if (filterMode === "month") {
            const v = toApiFormat(selected);
            return v ? `${activeType === "performance" ? "AT Pending Aging" : "SCFT Aging"} | ${v}` : "";
        }
        const s = startDate ? toDisplayDate(startDate) : "?";
        const e = endDate ? toDisplayDate(endDate) : "?";
        return startDate && endDate ? `${activeType === "performance" ? "AT Pending Aging" : "SCFT Aging"} | ${s} – ${e}` : "";
    })();

    // ── Fetch data ────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        const canFetch = filterMode === "month" ? !!selected : !!startDate && !!endDate && startDate <= endDate;
        if (!canFetch) return;
        try {
            action(true);
            const api = activeType === "performance" ? "performance_tat/generate-tat-report/" : "performance_idploy/generate-scft-offered/";
            const formData = new FormData();
            if (filterMode === "month") {
                formData.append("year", selected.year);
                formData.append("month", selected.month + 1);
            } else {
                formData.append("start_date", toDateString(startDate));
                formData.append("end_date", toDateString(endDate));
            }
            const res = await postData(api, formData);
            setApiResponse(res?.status ? res : null);
        } catch (error) {
            console.error("Fetch Error:", error);
            setApiResponse(null);
        } finally {
            action(false);
        }
    }, [selected, activeType, filterMode, startDate, endDate]);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(timer);
    }, [fetchData]);

    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href = url; link.download = "";
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const handleModeChange = (_, newMode) => {
        if (!newMode) return;
        setFilterMode(newMode);
        setApiResponse(null);
    };

    return (
        <Box p={1}>
            <Box mb={1} />

            {/* Top Bar */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                <Box>
                    <Typography variant="h5">{activeType === "performance" ? "AT Pending Aging" : "SCFT Aging Offered"}</Typography>
                    <Box mt={1} display="flex" gap={1} />
                </Box>

                <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                    {/* Mode Toggle */}
                    <ToggleButtonGroup value={filterMode} exclusive onChange={handleModeChange} size="small"
                        sx={{ bgcolor: "#fff", border: "1px solid #c4c4c4", borderRadius: "8px", overflow: "hidden", "& .MuiToggleButton-root": { border: "none", px: 1.5, py: 0.6, fontSize: 12, fontWeight: 600, textTransform: "none", color: "#555", "&.Mui-selected": { bgcolor: "#1e3c72", color: "#fff", "&:hover": { bgcolor: "#1e3c72" } } } }}>
                        <ToggleButton value="month"><CalendarMonthIcon sx={{ fontSize: 14, mr: 0.5 }} />Month</ToggleButton>
                        <ToggleButton value="daterange"><DateRangeIcon sx={{ fontSize: 14, mr: 0.5 }} />Date Range</ToggleButton>
                    </ToggleButtonGroup>

                    {filterMode === "month" ? (
                        <YearMonthPicker value={selected} apiMonths={apiMonths} onChange={(val) => { setSelected(val); setApiResponse(null); }} />
                    ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                            <SingleDatePicker label="Start Date" value={startDate} maxDate={endDate || todayDate()} onChange={(d) => { setStartDate(d); setApiResponse(null); }} />
                            <Typography sx={{ fontSize: 12, color: "#888", fontWeight: 600 }}>to</Typography>
                            <SingleDatePicker label="End Date" value={endDate} minDate={startDate} onChange={(d) => { setEndDate(d); setApiResponse(null); }} />
                        </Box>
                    )}

                    <IconButton onClick={handleDownload} title="Download Excel" disabled={!apiResponse?.download_url}>
                        <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
                    </IconButton>
                </Box>
            </Box>

            {filterMode === "daterange" && startDate && endDate && startDate > endDate && (
                <Typography sx={{ color: "#c62828", fontSize: 12, mt: 0.5, textAlign: "right" }}>Start date must be before or equal to end date.</Typography>
            )}

            {/* Tech Tabs */}
            <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
                {TECH_TABS.map((tab) => {
                    const isActive = activeTech === tab.key;
                    const tColor = TECH_COLORS[tab.key];
                    return (
                        <Box key={tab.key} onClick={() => setActiveTech(tab.key)}
                            sx={{ px: 3, py: 1, cursor: "pointer", fontWeight: isActive ? 700 : 500, color: isActive ? "#fff" : tColor.tabColor, background: isActive ? tColor.active : "transparent", borderRadius: "6px 6px 0 0", transition: "all 0.2s", "&:hover": { background: isActive ? tColor.active : "#f0f4ff" } }}>
                            {tab.label}
                        </Box>
                    );
                })}
            </Box>

            <TechTable tech={activeTech} apiResponse={apiResponse} titleLabel={titleLabel} />
            {loading}
        </Box>
    );
};

export default Pending_Aging;