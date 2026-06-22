// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     IconButton,
//     TextField,
//     Breadcrumbs,
//     Link
// } from "@mui/material";

// import DownloadIcon from "@mui/icons-material/Download";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";



// // ────────────────────────────────────────────────────────────────
// // DATE HELPERS
// // ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];

// const getDefaultStartDate = () => {

//     const now = new Date();

//     return `${now.getFullYear()}-${String(
//         now.getMonth() + 1
//     ).padStart(2, "0")}-01`;

// };

// // ────────────────────────────────────────────────────────────────
// // TECHNOLOGY TABS
// // ────────────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G", label: "4G" },
//     { key: "5G", label: "5G" },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ────────────────────────────────────────────────────────────────
// // TAB COLORS
// // ────────────────────────────────────────────────────────────────
// const TECH_COLORS = {

//     "4G": {
//         active:
//             "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",

//         hover:
//             "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",

//         header:
//             "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",

//         tabColor: "#1e3c72",
//     },

//     "5G": {
//         active:
//             "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",

//         hover:
//             "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",

//         header:
//             "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",

//         tabColor: "#134e5e",
//     },

//     "4G+5G": {
//         active:
//             "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",

//         hover:
//             "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",

//         header:
//             "linear-gradient(135deg, #252326 0%, #414345 100%)",

//         tabColor: "#41295a",
//     },
// };

// // ────────────────────────────────────────────────────────────────
// // TABLE CELL STYLES
// // ────────────────────────────────────────────────────────────────
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

// // ────────────────────────────────────────────────────────────────
// // GRAND TOTAL FORMATTER
// // ────────────────────────────────────────────────────────────────
// const formatGrandTotal = (val) => {

//     const num = parseFloat(val);

//     if (isNaN(num)) return 0;

//     return Number.isInteger(num)
//         ? num
//         : num.toFixed(1);

// };

// // ────────────────────────────────────────────────────────────────
// // TABLE COMPONENT
// // ────────────────────────────────────────────────────────────────
// const TechTable = ({
//     tech,
//     apiResponse,
//     dateRangeLabel
// }) => {

//     // ─────────────────────────────
//     // NEW SCFT AGING COLUMNS
//     // ─────────────────────────────
//     const columns = [

//         { label: "0-3days", key: "0-3days" },

//         { label: "3-5days", key: "3-5days" },

//         { label: "5-7days", key: "5-7days" },

//         { label: ">7days", key: ">7days" },

//         { label: "Pending", key: "Pending" },

//         { label: "Total", key: "Total" },

//         { label: "0-3days%", key: "0-3days%" },

//         { label: "3-5days%", key: "3-5days%" },

//         { label: "5-7days%", key: "5-7days%" },

//         { label: ">7days%", key: ">7days%" },

//         { label: "Pending%", key: "Pending%" },

//     ];

//     const colors = TECH_COLORS[tech];

//     const TOTAL_BG = "#b2f0c5";

//     const STRIPE = "#f4f7fb";

//     const data =
//         apiResponse?.data?.[tech]?.circles || {};

//     const grandTotal =
//         apiResponse?.data?.[tech]?.grand_total || {};

//     const entries = Object.entries(data);

//     return (

//         <Box
//             mt={1}
//             sx={{
//                 overflowX: "auto",
//                 borderRadius: 2,
//                 border: "1px solid #000000",
//                 boxShadow:
//                     "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//         >

//             <table
//                 style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     tableLayout: "auto",
//                     minWidth: 900,
//                 }}
//             >

//                 <thead>

//                     {/* ───────────────────────────── */}
//                     {/* DATE RANGE HEADER */}
//                     {/* ───────────────────────────── */}
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
//                         >
//                         </th>

//                         <th
//                             colSpan={columns.length}
//                             style={{
//                                 ...cellStyle,
//                                 background: colors.active,
//                                 color: "#fff",
//                                 textAlign: "center",
//                                 fontSize: 14,
//                                 fontWeight: 700,
//                             }}
//                         >

//                             {dateRangeLabel}

//                         </th>

//                     </tr>

//                     {/* ───────────────────────────── */}
//                     {/* COLUMN HEADER */}
//                     {/* ───────────────────────────── */}
//                     <tr
//                         style={{
//                             background: colors.header,
//                         }}
//                     >

//                         <th
//                             style={{
//                                 ...stickyCell,
//                                 background: colors.header,
//                                 color: "#fff",
//                                 textAlign: "center",
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                             }}
//                         >

//                             Circle

//                         </th>

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

//                         <>

//                             {/* ───────────────────────────── */}
//                             {/* DATA ROWS */}
//                             {/* ───────────────────────────── */}
//                             {entries.map(([circle, val], idx) => (

//                                 <tr
//                                     key={circle}
//                                     style={{
//                                         background:
//                                             idx % 2 === 0
//                                                 ? "#fff"
//                                                 : STRIPE,
//                                     }}
//                                 >

//                                     <td
//                                         style={{
//                                             ...stickyCell,
//                                             background:
//                                                 idx % 2 === 0
//                                                     ? "#fff"
//                                                     : STRIPE,
//                                             textAlign: "center",
//                                         }}
//                                     >

//                                         {circle}

//                                     </td>

//                                     {columns.map((col) => (

//                                         <td
//                                             key={col.key}
//                                             style={cellStyle}
//                                         >

//                                             {val?.[col.key] ?? 0}

//                                         </td>

//                                     ))}

//                                 </tr>

//                             ))}

//                             {/* ───────────────────────────── */}
//                             {/* GRAND TOTAL */}
//                             {/* ───────────────────────────── */}
//                             <tr
//                                 style={{
//                                     background: TOTAL_BG,
//                                 }}
//                             >

//                                 <td
//                                     style={{
//                                         ...stickyCell,
//                                         background: TOTAL_BG,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                     }}
//                                 >

//                                     Grand Total

//                                 </td>

//                                 {columns.map((col) => (

//                                     <td
//                                         key={col.key}
//                                         style={{
//                                             ...cellStyle,
//                                             fontWeight: 700,
//                                         }}
//                                     >

//                                         {formatGrandTotal(
//                                             grandTotal?.[col.key]
//                                         )}

//                                     </td>

//                                 ))}

//                             </tr>

//                         </>

//                     ) : (

//                         <tr>

//                             <td
//                                 colSpan={columns.length + 1}
//                                 style={{
//                                     ...cellStyle,
//                                     textAlign: "center",
//                                     padding: 15,
//                                 }}
//                             >

//                                 No Data Available

//                             </td>

//                         </tr>

//                     )}

//                 </tbody>

//             </table>

//         </Box>

//     );

// };

// // ────────────────────────────────────────────────────────────────
// // MAIN COMPONENT
// // ────────────────────────────────────────────────────────────────
// const SCFT_Aging = () => {

//     const { loading, action } =
//         useLoadingDialog();

//     const [apiResponse, setApiResponse] =
//         useState(null);

//     const [activeType, setActiveType] =
//         useState("performance");

//     const [activeTech, setActiveTech] =
//         useState("4G");

//     const [startDate, setStartDate] =
//         useState(getDefaultStartDate());

//     const [endDate, setEndDate] =
//         useState(todayStr);

//         const navigate = useNavigate();

//     // ─────────────────────────────
//     // FETCH DATA
//     // ─────────────────────────────
//     const fetchData = async () => {

//         if (!startDate || !endDate) return;

//         if (startDate > endDate) return;

//         try {

//             action(true);

//             // ─────────────────────────────
//             // NEW SCFT APIs
//             // ─────────────────────────────
//             const api = activeType === "performance"
//                     ? "performance_idploy/generate-scft-performance/"
//                     : "performance_idploy/generate-scft-offered/";

//             const formData = new FormData();

//             formData.append(
//                 "start_date",
//                 startDate
//             );

//             formData.append(
//                 "end_date",
//                 endDate
//             );

//             const res = await postData(
//                 api,
//                 formData
//             );

//             if (res?.status) {

//                 setApiResponse(res);

//             }

//         } catch (error) {

//             console.log(
//                 "Fetch Error : ",
//                 error
//             );

//         } finally {

//             action(false);

//         }

//     };

//     // ─────────────────────────────
//     // AUTO FETCH
//     // ─────────────────────────────
//     useEffect(() => {

//         const timer = setTimeout(() => {

//             fetchData();

//         }, 500);

//         return () => clearTimeout(timer);

//     }, [activeType, startDate, endDate]);

//     // ─────────────────────────────
//     // DOWNLOAD
//     // ─────────────────────────────
//     const handleDownload = () => {

//         const url =
//             apiResponse?.download_url;

//         if (!url) return;

//         const link =
//             document.createElement("a");

//         link.href = url;

//         link.download = "";

//         document.body.appendChild(link);

//         link.click();

//         document.body.removeChild(link);

//     };

//     const dateRangeLabel =
//         startDate && endDate
//             ? `${startDate} to ${endDate}`
//             : "";

//     return (

//         <Box p={1}>
//             {/* Breadcrumb */}
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance AT
//                     </Link>
//                     <Typography color="text.primary">Performance SR Wise</Typography>
//                 </Breadcrumbs>
//             </div>

//             {/* ───────────────────────────── */}
//             {/* TOP BAR */}
//             {/* ───────────────────────────── */}
//             <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 flexWrap="wrap"
//                 gap={1}
//             >

//                 {/* LEFT SIDE */}
//                 <Box>

//                     <Typography variant="h5">

//                         {activeType === "performance"
//                             ? "SCFT Aging Performance"
//                             : "SCFT Aging Offered"}

//                     </Typography>

//                     <Box
//                         mt={1}
//                         display="flex"
//                         gap={1}
//                     >

//                         <Button
//                             size="small"
//                             onClick={() =>
//                                 setActiveType("performance")
//                             }
//                             variant={
//                                 activeType === "performance"
//                                     ? "contained"
//                                     : "outlined"
//                             }
//                         >

//                             Performance

//                         </Button>

//                         <Button
//                             size="small"
//                             onClick={() =>
//                                 setActiveType("offered")
//                             }
//                             variant={
//                                 activeType === "offered"
//                                     ? "contained"
//                                     : "outlined"
//                             }
//                         >

//                             Offered

//                         </Button>

//                     </Box>

//                 </Box>

//                 {/* RIGHT SIDE */}
//                 <Box
//                     display="flex"
//                     gap={1}
//                     alignItems="center"
//                     flexWrap="wrap"
//                 >

//                     <TextField
//                         size="small"
//                         label="Start Date"
//                         type="date"
//                         value={startDate}
//                         onChange={(e) => {

//                             if (
//                                 e.target.value <= todayStr
//                             ) {

//                                 setStartDate(
//                                     e.target.value
//                                 );

//                             }

//                         }}
//                         inputProps={{
//                             max:
//                                 endDate ||
//                                 todayStr,
//                         }}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         sx={{
//                             minWidth: 155,
//                         }}
//                     />

//                     <Typography
//                         variant="body2"
//                         color="text.secondary"
//                     >

//                         ~

//                     </Typography>

//                     <TextField
//                         size="small"
//                         label="End Date"
//                         type="date"
//                         value={endDate}
//                         onChange={(e) => {

//                             if (
//                                 e.target.value <= todayStr
//                             ) {

//                                 setEndDate(
//                                     e.target.value
//                                 );

//                             }

//                         }}
//                         inputProps={{
//                             min: startDate,
//                             max: todayStr,
//                         }}
//                         InputLabelProps={{
//                             shrink: true,
//                         }}
//                         sx={{
//                             minWidth: 155,
//                         }}
//                     />

//                     {/* DOWNLOAD */}
//                     <IconButton
//                         onClick={handleDownload}
//                         title="Download Excel"
//                         disabled={
//                             !apiResponse?.download_url
//                         }
//                     >

//                         <DownloadIcon
//                             color={
//                                 apiResponse?.download_url
//                                     ? "primary"
//                                     : "disabled"
//                             }
//                         />

//                     </IconButton>

//                 </Box>

//             </Box>

//             {/* ───────────────────────────── */}
//             {/* TECH TABS */}
//             {/* ───────────────────────────── */}
//             <Box
//                 mt={2}
//                 sx={{
//                     display: "flex",
//                     borderBottom:
//                         "2px solid #e0e0e0",
//                 }}
//             >

//                 {TECH_TABS.map((tab) => {

//                     const isActive =
//                         activeTech === tab.key;

//                     const tColor =
//                         TECH_COLORS[tab.key];

//                     return (

//                         <Box
//                             key={tab.key}
//                             onClick={() =>
//                                 setActiveTech(tab.key)
//                             }
//                             sx={{
//                                 px: 3,
//                                 py: 1,
//                                 cursor: "pointer",
//                                 fontWeight:
//                                     isActive
//                                         ? 700
//                                         : 500,
//                                 color:
//                                     isActive
//                                         ? "#fff"
//                                         : tColor.tabColor,
//                                 background:
//                                     isActive
//                                         ? tColor.active
//                                         : "transparent",
//                                 borderRadius:
//                                     "6px 6px 0 0",
//                                 transition:
//                                     "all 0.2s",
//                             }}
//                         >

//                             {tab.label}

//                         </Box>

//                     );

//                 })}

//             </Box>

//             {/* ───────────────────────────── */}
//             {/* TABLE */}
//             {/* ───────────────────────────── */}
//             <TechTable
//                 tech={activeTech}
//                 apiResponse={apiResponse}
//                 dateRangeLabel={dateRangeLabel}
//             />

//             {loading}

//         </Box>

//     );

// };

// export default SCFT_Aging;

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    Breadcrumbs,
    Link,
    Paper,
    ClickAwayListener,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import { postData, getData } from "../../../services/FetchNodeServices";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ────────────────────────────────────────────────────────────────
// MONTH/YEAR HELPERS
// ────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth(); // 0-indexed
const START_YEAR = 2000;

// Converts { year:2026, month:5 } → "Jun 2026"  (what backend expects: %b %Y)
const toApiFormat = (sel) =>
    sel ? `${MONTH_SHORT[sel.month]} ${sel.year}` : "";

// Converts "Jun 2026" → { year:2026, month:5 }
const parseApiMonth = (str) => {
    if (!str) return null;
    // Shape: "Jun 2026"
    const parts = String(str).trim().split(" ");
    if (parts.length === 2) {
        const mIdx = MONTH_SHORT.indexOf(parts[0]);
        const yr = parseInt(parts[1]);
        if (mIdx !== -1 && !isNaN(yr)) return { year: yr, month: mIdx };
    }
    // Shape: "2026-06"
    const ym = String(str).match(/^(\d{4})-(\d{2})$/);
    if (ym) return { year: parseInt(ym[1]), month: parseInt(ym[2]) - 1 };
    return null;
};

// ────────────────────────────────────────────────────────────────
// TECHNOLOGY TABS
// ────────────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ────────────────────────────────────────────────────────────────
// TAB COLORS
// ────────────────────────────────────────────────────────────────
const TECH_COLORS = {

    "4G": {
        active:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",

        hover:
            "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",

        header:
            "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",

        tabColor: "#1e3c72",
    },

    "5G": {
        active:
            "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",

        hover:
            "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",

        header:
            "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",

        tabColor: "#134e5e",
    },

    "4G+5G": {
        active:
            "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",

        hover:
            "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",

        header:
            "linear-gradient(135deg, #252326 0%, #414345 100%)",

        tabColor: "#41295a",
    },
};

// ────────────────────────────────────────────────────────────────
// TABLE CELL STYLES
// ────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────
// GRAND TOTAL FORMATTER
// ────────────────────────────────────────────────────────────────
const formatGrandTotal = (val) => {

    const num = parseFloat(val);

    if (isNaN(num)) return 0;

    return Number.isInteger(num)
        ? num
        : num.toFixed(1);

};

// ────────────────────────────────────────────────────────────────
// YEAR-MONTH PICKER
// ────────────────────────────────────────────────────────────────
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

    // A month cell is disabled if:
    // 1. It's in the future, OR
    // 2. apiMonths is loaded and this month is NOT in the list
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

    const handleClear = () => { onChange(null); setOpen(false); };

    const handleThisMonth = () => {
        onChange({ year: CURRENT_YEAR, month: CURRENT_MONTH });
        setOpen(false);
    };

    const displayText = value
        ? `${MONTH_SHORT[value.month]} ${value.year}`
        : "Select month";

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                {/* Trigger */}
                <Box
                    onClick={() => setOpen((p) => !p)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.5,
                        py: 0.7,
                        border: open ? "2px solid #1e3c72" : "1px solid #c4c4c4",
                        borderRadius: "8px",
                        cursor: "pointer",
                        bgcolor: "#fff",
                        minWidth: 180,
                        userSelect: "none",
                        "&:hover": { borderColor: "#1e3c72" },
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 10, color: "#888", lineHeight: 1, mb: 0.2 }}>
                            Month
                        </Typography>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: value ? "#1a1a2e" : "#aaa", lineHeight: 1 }}>
                            {displayText}
                        </Typography>
                    </Box>
                    <CalendarMonthIcon sx={{ fontSize: 20, color: open ? "#1e3c72" : "#aaa" }} />
                </Box>

                {/* Dropdown */}
                {open && (
                    <Paper
                        elevation={8}
                        sx={{
                            position: "absolute",
                            top: "calc(100% + 6px)",
                            right: 0,
                            zIndex: 1400,
                            borderRadius: "12px",
                            overflow: "hidden",
                            minWidth: 310,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        }}
                    >
                        <Box display="flex" sx={{ height: 240 }}>

                            {/* Year list */}
                            <Box
                                ref={yearListRef}
                                sx={{
                                    width: 80,
                                    overflowY: "auto",
                                    bgcolor: "#f5f7fa",
                                    borderRight: "1px solid #e8ecf0",
                                    py: 0.5,
                                    "&::-webkit-scrollbar": { width: 4 },
                                    "&::-webkit-scrollbar-thumb": { bgcolor: "#ccc", borderRadius: 2 },
                                }}
                            >
                                {years.map((yr) => {
                                    const isSelected = value?.year === yr;
                                    const isHovered = hoveredYear === yr;
                                    return (
                                        <Box
                                            key={yr}
                                            data-year={yr}
                                            onClick={() => setHoveredYear(yr)}
                                            sx={{
                                                px: 2,
                                                py: 0.9,
                                                cursor: "pointer",
                                                fontSize: 13.5,
                                                fontWeight: isSelected || isHovered ? 700 : 400,
                                                color: isSelected ? "#fff" : isHovered ? "#1e3c72" : "#374151",
                                                bgcolor: isSelected ? "#1e3c72" : isHovered ? "#e8edf8" : "transparent",
                                                borderRadius: "6px",
                                                mx: 0.5,
                                                transition: "all .12s",
                                                "&:hover": {
                                                    bgcolor: isSelected ? "#1e3c72" : "#dde4f5",
                                                    color: isSelected ? "#fff" : "#1e3c72",
                                                },
                                            }}
                                        >
                                            {yr}
                                        </Box>
                                    );
                                })}
                            </Box>

                            {/* Month grid */}
                            <Box
                                sx={{
                                    flex: 1,
                                    p: 1.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 0.8,
                                    }}
                                >
                                    {MONTH_SHORT.map((mn, mIdx) => {
                                        const disabled = isDisabled(hoveredYear, mIdx);
                                        const isActive = value?.year === hoveredYear && value?.month === mIdx;

                                        return (
                                            <Box
                                                key={mn}
                                                onClick={() => handleMonthClick(hoveredYear, mIdx)}
                                                sx={{
                                                    textAlign: "center",
                                                    py: 0.8,
                                                    borderRadius: "8px",
                                                    fontSize: 13,
                                                    fontWeight: isActive ? 700 : 400,
                                                    cursor: disabled ? "not-allowed" : "pointer",
                                                    color: disabled ? "#ccc" : isActive ? "#fff" : "#374151",
                                                    bgcolor: isActive ? "#1e3c72" : "transparent",
                                                    border: isActive ? "none" : "1px solid transparent",
                                                    transition: "all .12s",
                                                    "&:hover": disabled ? {} : {
                                                        bgcolor: isActive ? "#1e3c72" : "#e8edf8",
                                                        color: isActive ? "#fff" : "#1e3c72",
                                                        borderColor: "#bcd0f0",
                                                    },
                                                }}
                                            >
                                                {mn}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>
                        </Box>

                        {/* Footer */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ px: 2, py: 1, borderTop: "1px solid #e8ecf0", bgcolor: "#fafbfc" }}
                        >
                            <Button
                                size="small"
                                onClick={handleClear}
                                sx={{ textTransform: "none", fontSize: 13, color: "#374151", fontWeight: 600, "&:hover": { color: "#c62828" } }}
                            >
                                Clear
                            </Button>
                            <Button
                                size="small"
                                onClick={handleThisMonth}
                                sx={{ textTransform: "none", fontSize: 13, color: "#1e3c72", fontWeight: 700, "&:hover": { bgcolor: "#e8edf8" } }}
                            >
                                This month
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
};

// ────────────────────────────────────────────────────────────────
// TABLE COMPONENT
// ────────────────────────────────────────────────────────────────
const TechTable = ({
    tech,
    apiResponse,
    monthLabel
}) => {

    // ─────────────────────────────
    // SCFT AGING COLUMNS
    // ─────────────────────────────
    const columns = [

        { label: "0-3days", key: "0-3days" },

        { label: "3-5days", key: "3-5days" },

        { label: "5-7days", key: "5-7days" },

        { label: ">7days", key: ">7days" },

        { label: "Pending", key: "Pending" },

        { label: "Total", key: "Total" },

        { label: "0-3days%", key: "0-3days%" },

        { label: "3-5days%", key: "3-5days%" },

        { label: "5-7days%", key: "5-7days%" },

        { label: ">7days%", key: ">7days%" },

        { label: "Pending%", key: "Pending%" },

    ];

    const colors = TECH_COLORS[tech];

    const TOTAL_BG = "#b2f0c5";

    const STRIPE = "#f4f7fb";

    const data =
        apiResponse?.data?.[tech]?.circles || {};

    const grandTotal =
        apiResponse?.data?.[tech]?.grand_total || {};

    const entries = Object.entries(data);

    const titleLabel = monthLabel
        ? monthLabel
        : "Select a month to load data";

    return (

        <Box
            mt={1}
            sx={{
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid #000000",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    minWidth: 900,
                }}
            >

                <thead>

                    {/* ───────────────────────────── */}
                    {/* MONTH HEADER */}
                    {/* ───────────────────────────── */}
                    <tr>

                        <th
                            style={{
                                ...stickyCell,
                                background: colors.active,
                                color: "#efebeb",
                                fontSize: 14,
                                textAlign: "center",
                                fontWeight: 700,
                                zIndex: 3,
                            }}
                        >
                        </th>

                        <th
                            colSpan={columns.length}
                            style={{
                                ...cellStyle,
                                background: colors.active,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >

                            {titleLabel}

                        </th>

                    </tr>

                    {/* ───────────────────────────── */}
                    {/* COLUMN HEADER */}
                    {/* ───────────────────────────── */}
                    <tr
                        style={{
                            background: colors.header,
                        }}
                    >

                        <th
                            style={{
                                ...stickyCell,
                                background: colors.header,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >

                            Circle

                        </th>

                        {columns.map((col) => (

                            <th
                                key={col.key}
                                style={{
                                    ...cellStyle,
                                    background: colors.header,
                                    color: "#fff",
                                    fontWeight: 700,
                                }}
                            >

                                {col.label}

                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {entries.length > 0 ? (

                        <>

                            {/* ───────────────────────────── */}
                            {/* DATA ROWS */}
                            {/* ───────────────────────────── */}
                            {entries.map(([circle, val], idx) => (

                                <tr
                                    key={circle}
                                    style={{
                                        background:
                                            idx % 2 === 0
                                                ? "#fff"
                                                : STRIPE,
                                    }}
                                >

                                    <td
                                        style={{
                                            ...stickyCell,
                                            background:
                                                idx % 2 === 0
                                                    ? "#fff"
                                                    : STRIPE,
                                            textAlign: "center",
                                        }}
                                    >

                                        {circle}

                                    </td>

                                    {columns.map((col) => (

                                        <td
                                            key={col.key}
                                            style={cellStyle}
                                        >

                                            {val?.[col.key] ?? 0}

                                        </td>

                                    ))}

                                </tr>

                            ))}

                            {/* ───────────────────────────── */}
                            {/* GRAND TOTAL */}
                            {/* ───────────────────────────── */}
                            <tr
                                style={{
                                    background: TOTAL_BG,
                                }}
                            >

                                <td
                                    style={{
                                        ...stickyCell,
                                        background: TOTAL_BG,
                                        fontWeight: 700,
                                        textAlign: "center",
                                    }}
                                >

                                    Grand Total

                                </td>

                                {columns.map((col) => (

                                    <td
                                        key={col.key}
                                        style={{
                                            ...cellStyle,
                                            fontWeight: 700,
                                        }}
                                    >

                                        {formatGrandTotal(
                                            grandTotal?.[col.key]
                                        )}

                                    </td>

                                ))}

                            </tr>

                        </>

                    ) : (

                        <tr>

                            <td
                                colSpan={columns.length + 1}
                                style={{
                                    ...cellStyle,
                                    textAlign: "center",
                                    padding: 15,
                                }}
                            >

                                No Data Available

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </Box>

    );

};

// ────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────
const SCFT_Aging = () => {

    const { loading, action } =
        useLoadingDialog();

    const [apiResponse, setApiResponse] =
        useState(null);

    const [activeType, setActiveType] =
        useState("performance");

    const [activeTech, setActiveTech] =
        useState("4G");

    const [apiMonths, setApiMonths] =
        useState([]); // raw strings from API e.g. ["Jun 2026","May 2026"]

    // Default to current month
    const [selected, setSelected] = useState({
        year: CURRENT_YEAR,
        month: CURRENT_MONTH,
    });

    const navigate = useNavigate();

    // ─────────────────────────────
    // LOAD AVAILABLE MONTHS FROM API
    // ─────────────────────────────
    // useEffect(() => {
    //     const fetchMonths = async () => {
    //         try {
    //             const res = await getData("idploy/months/");
    //             const list =
    //                 Array.isArray(res) ? res :
    //                     Array.isArray(res?.data) ? res.data :
    //                         Array.isArray(res?.months) ? res.months :
    //                             Array.isArray(res?.results) ? res.results : [];

    //             if (list.length > 0) {
    //                 // Normalise everything to "Mon YYYY" string
    //                 const normalised = list.map((item) => {
    //                     const str = typeof item === "object" ? (item.value ?? item.label ?? "") : String(item);
    //                     // Already "Jun 2026"
    //                     if (/^[A-Za-z]{3} \d{4}$/.test(str.trim())) return str.trim();
    //                     // "2026-06" → "Jun 2026"
    //                     const ym = str.match(/^(\d{4})-(\d{2})$/);
    //                     if (ym) return `${MONTH_SHORT[parseInt(ym[2]) - 1]} ${ym[1]}`;
    //                     return str;
    //                 });
    //                 setApiMonths(normalised);

    //                 // Auto-select first available month
    //                 const first = parseApiMonth(normalised[0]);
    //                 if (first) setSelected(first);
    //             }
    //         } catch (err) {
    //             console.warn("Months API failed:", err);
    //             // No apiMonths set → picker shows all months up to today (no restriction)
    //         }
    //     };
    //     fetchMonths();
    // }, []);

    // ─────────────────────────────
    // DERIVED API STRING: "Jun 2026"
    // ─────────────────────────────
    const apiValue = toApiFormat(selected);

    // ─────────────────────────────
    // FETCH DATA
    // ─────────────────────────────
    const fetchData = useCallback(async () => {

        if (!apiValue) return;

        try {

            action(true);

            // ─────────────────────────────
            // SCFT APIs
            // ─────────────────────────────
            const api = activeType === "performance"
                    ? "performance_idploy/generate-scft-performance/"
                    : "performance_idploy/generate-scft-offered/";

            const formData = new FormData();

            formData.append("month", apiValue); // ✅ sends "Jun 2026" → matches %b %Y
            formData.append("tech", activeTech); // e.g. "4G", "5G", "4G+5G"

            const res = await postData(
                api,
                formData
            );

            if (res?.status) {

                setApiResponse(res);

            } else {

                setApiResponse(null);

            }

        } catch (error) {

            console.log(
                "Fetch Error : ",
                error
            );

            setApiResponse(null);

        } finally {

            action(false);

        }

    }, [activeType, apiValue, activeTech]);

    // ─────────────────────────────
    // AUTO FETCH (DEBOUNCED)
    // ─────────────────────────────
    useEffect(() => {

        const timer = setTimeout(() => {

            fetchData();

        }, 400);

        return () => clearTimeout(timer);

    }, [fetchData]);

    // ─────────────────────────────
    // DOWNLOAD
    // ─────────────────────────────
    const handleDownload = () => {

        const url =
            apiResponse?.download_url;

        if (!url) return;

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };

    return (

        <Box p={1}>
            {/* Breadcrumb */}
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                        Performance AT
                    </Link>
                    <Typography color="text.primary">Performance SR Wise</Typography>
                </Breadcrumbs>
            </div>

            {/* ───────────────────────────── */}
            {/* TOP BAR */}
            {/* ───────────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >

                {/* LEFT SIDE */}
                <Box>

                    <Typography variant="h5">

                        {activeType === "performance"
                            ? "SCFT Aging Performance"
                            : "SCFT Aging Offered"}

                    </Typography>

                    <Box
                        mt={1}
                        display="flex"
                        gap={1}
                    >

                        <Button
                            size="small"
                            onClick={() =>
                                setActiveType("performance")
                            }
                            variant={
                                activeType === "performance"
                                    ? "contained"
                                    : "outlined"
                            }
                        >

                            Performance

                        </Button>

                        <Button
                            size="small"
                            onClick={() =>
                                setActiveType("offered")
                            }
                            variant={
                                activeType === "offered"
                                    ? "contained"
                                    : "outlined"
                            }
                        >

                            Offered

                        </Button>

                    </Box>

                </Box>

                {/* RIGHT SIDE */}
                <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                >

                    <YearMonthPicker
                        value={selected}
                        apiMonths={apiMonths}
                        onChange={(val) => {
                            setSelected(val);
                            setApiResponse(null);
                        }}
                    />

                    {/* DOWNLOAD */}
                    <IconButton
                        onClick={handleDownload}
                        title="Download Excel"
                        disabled={
                            !apiResponse?.download_url
                        }
                    >

                        <DownloadIcon
                            color={
                                apiResponse?.download_url
                                    ? "primary"
                                    : "disabled"
                            }
                        />

                    </IconButton>

                </Box>

            </Box>

            {/* ───────────────────────────── */}
            {/* TECH TABS */}
            {/* ───────────────────────────── */}
            <Box
                mt={2}
                sx={{
                    display: "flex",
                    borderBottom:
                        "2px solid #e0e0e0",
                }}
            >

                {TECH_TABS.map((tab) => {

                    const isActive =
                        activeTech === tab.key;

                    const tColor =
                        TECH_COLORS[tab.key];

                    return (

                        <Box
                            key={tab.key}
                            onClick={() =>
                                setActiveTech(tab.key)
                            }
                            sx={{
                                px: 3,
                                py: 1,
                                cursor: "pointer",
                                fontWeight:
                                    isActive
                                        ? 700
                                        : 500,
                                color:
                                    isActive
                                        ? "#fff"
                                        : tColor.tabColor,
                                background:
                                    isActive
                                        ? tColor.active
                                        : "transparent",
                                borderRadius:
                                    "6px 6px 0 0",
                                transition:
                                    "all 0.2s",
                            }}
                        >

                            {tab.label}

                        </Box>

                    );

                })}

            </Box>

            {/* ───────────────────────────── */}
            {/* TABLE */}
            {/* ───────────────────────────── */}
            <TechTable
                tech={activeTech}
                apiResponse={apiResponse}
                monthLabel={apiValue}
            />

            {loading}

        </Box>

    );

};

export default SCFT_Aging;