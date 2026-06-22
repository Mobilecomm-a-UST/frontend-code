

// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     TextField,
//     Breadcrumbs,
//     Link,
// } from "@mui/material";

// import DownloadIcon from "@mui/icons-material/Download";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ── Constants ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];

// const getDefaultStartDate = () => {
//     const now = new Date();

//     return `${now.getFullYear()}-${String(
//         now.getMonth() + 1
//     ).padStart(2, "0")}-01`;
// };

// // ── Technology Tabs ──────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G", label: "4G" },
//     { key: "5G", label: "5G" },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ── Table Columns ───────────────────────────────────────────────────────────
// const COLUMNS = [
//     {
//         label: "Total Site",
//         key: "Total Site",
//     },
//     {
//         label: "Pending",
//         key: "Pending",
//     },
//     {
//         label: "Accepted with 0 counter",
//         key: "Accepted with 0 counter",
//     },
//     {
//         label: "Acceptance pending with 0 Counter",
//         key: "Acceptance pending with 0 Counter",
//     },
//     {
//         label: "SCFT FTR",
//         key: "SCFT FTR",
//     },
// ];

// // ── Tech Colours ────────────────────────────────────────────────────────────
// const TECH_COLORS = {
//     "4G": {
//         active:
//             "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         header:
//             "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
//         tabColor: "#1e3c72",
//     },

//     "5G": {
//         active:
//             "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         header:
//             "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//         tabColor: "#134e5e",
//     },

//     "4G+5G": {
//         active:
//             "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
//         header:
//             "linear-gradient(135deg, #252326 0%, #414345 100%)",
//         tabColor: "#41295a",
//     },
// };

// // ── Shared Styles ───────────────────────────────────────────────────────────
// const cellSt = {
//     padding: "4px 8px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 13,
//     whiteSpace: "nowrap",
// };

// const stickySt = {
//     ...cellSt,
//     position: "sticky",
//     left: 0,
//     zIndex: 2,
//     textAlign: "center",
//     fontWeight: 600,
// };

// // ── Table Component ─────────────────────────────────────────────────────────
// const TechTable = ({
//     tech,
//     apiResponse,
//     dateRangeLabel,
// }) => {
//     const colors = TECH_COLORS[tech];

//     const TOTAL_BG = "#b2f0c5";
//     const STRIPE = "#f4f7fb";

//     const rawData =
//         apiResponse?.data?.[tech] || [];

//     const circleRows = rawData.filter(
//         (row) => row.Circle !== "Grand Total"
//     );

//     const grandTotal =
//         rawData.find(
//             (row) => row.Circle === "Grand Total"
//         ) || {};

//     const titleLabel =
//         dateRangeLabel
//             ? `SCFT | ${dateRangeLabel} | ${tech}`
//             : "Loading...";

//     return (
//         <Box
//             mt={1}
//             sx={{
//                 overflowX: "auto",
//                 borderRadius: 2,
//                 border: "1px solid #c0c0c0",
//                 boxShadow:
//                     "0 2px 8px rgba(0,0,0,0.08)",
//             }}
//         >
//             <table
//                 style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     tableLayout: "auto",
//                     minWidth: 500,
//                 }}
//             >
//                 <thead>
//                     {/* Title */}
//                     <tr>
//                         <th
//                             colSpan={
//                                 COLUMNS.length + 1
//                             }
//                             style={{
//                                 ...cellSt,
//                                 background:
//                                     colors.active,
//                                 color: "#fff",
//                                 fontSize: 14,
//                                 fontWeight: 700,
//                                 textAlign:
//                                     "center",
//                                 padding:
//                                     "8px 12px",
//                                 border:
//                                     "1px solid #2e4a70",
//                             }}
//                         >
//                             {titleLabel}
//                         </th>
//                     </tr>

//                     {/* Header */}
//                     <tr>
//                         <th
//                             style={{
//                                 ...stickySt,
//                                 background:
//                                     colors.header,
//                                 color: "#fff",
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 zIndex: 3,
//                                 border:
//                                     "1px solid #2e4a70",
//                                 padding:
//                                     "6px 12px",
//                             }}
//                         >
//                             Circle
//                         </th>

//                         {COLUMNS.map((col) => (
//                             <th
//                                 key={col.key}
//                                 style={{
//                                     ...cellSt,
//                                     background:
//                                         colors.header,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     fontSize: 13,
//                                     border:
//                                         "1px solid #2e4a70",
//                                     padding:
//                                         "6px 10px",
//                                 }}
//                             >
//                                 {col.label}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {circleRows.length > 0 ? (
//                         <>
//                             {circleRows.map(
//                                 (row, idx) => (
//                                     <tr
//                                         key={
//                                             row.Circle
//                                         }
//                                         style={{
//                                             background:
//                                                 idx %
//                                                     2 ===
//                                                     0
//                                                     ? "#fff"
//                                                     : STRIPE,
//                                         }}
//                                     >
//                                         <td
//                                             style={{
//                                                 ...stickySt,
//                                                 background:
//                                                     idx %
//                                                         2 ===
//                                                         0
//                                                         ? "#fff"
//                                                         : STRIPE,
//                                             }}
//                                         >
//                                             {
//                                                 row.Circle
//                                             }
//                                         </td>

//                                         {COLUMNS.map(
//                                             (
//                                                 col
//                                             ) => (
//                                                 <td
//                                                     key={
//                                                         col.key
//                                                     }
//                                                     style={
//                                                         cellSt
//                                                     }
//                                                 >
//                                                     {row?.[
//                                                         col
//                                                             .key
//                                                     ] ??
//                                                         0}
//                                                 </td>
//                                             )
//                                         )}
//                                     </tr>
//                                 )
//                             )}

//                             {/* Grand Total */}
//                             <tr
//                                 style={{
//                                     background:
//                                         TOTAL_BG,
//                                     fontWeight:
//                                         700,
//                                 }}
//                             >
//                                 <td
//                                     style={{
//                                         ...stickySt,
//                                         background:
//                                             TOTAL_BG,
//                                         border:
//                                             "1px solid #c0c0c0",
//                                         fontSize:
//                                             14,
//                                     }}
//                                 >
//                                     Grand Total
//                                 </td>

//                                 {COLUMNS.map(
//                                     (col) => (
//                                         <td
//                                             key={
//                                                 col.key
//                                             }
//                                             style={{
//                                                 ...cellSt,
//                                                 fontWeight:
//                                                     700,
//                                                 fontSize:
//                                                     14,
//                                             }}
//                                         >
//                                             {grandTotal?.[
//                                                 col
//                                                     .key
//                                             ] ??
//                                                 0}
//                                         </td>
//                                     )
//                                 )}
//                             </tr>
//                         </>
//                     ) : (
//                         <tr>
//                             <td
//                                 colSpan={
//                                     COLUMNS.length +
//                                     1
//                                 }
//                                 style={{
//                                     ...cellSt,
//                                     padding: 20,
//                                     color:
//                                         "#9e9e9e",
//                                     fontSize: 14,
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

// // ── Main Component ──────────────────────────────────────────────────────────
// const SCFT_FTR = () => {
//     const { loading, action } =
//         useLoadingDialog();

//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] =
//         useState(null);

//     const [startDate, setStartDate] =
//         useState(getDefaultStartDate());

//     const [endDate, setEndDate] =
//         useState(todayStr);

//     const [activeTech, setActiveTech] =
//         useState("4G");

//     // ── Fetch API ─────────────────────────────────────────────────────────
//     const fetchData = async () => {
//         if (!startDate || !endDate) return;

//         if (startDate > endDate) return;

//         try {
//             action(true);

//             const formData =
//                 new FormData();

//             formData.append(
//                 "start_date",
//                 startDate
//             );

//             formData.append(
//                 "end_date",
//                 endDate
//             );

//             const res = await postData(
//                 "performance_idploy/generate-scft/",
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

//     // ── Debounce API Calls ────────────────────────────────────────────────
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             fetchData();
//         }, 500);

//         return () =>
//             clearTimeout(timer);

//     }, [startDate, endDate]);

//     // ── Download ──────────────────────────────────────────────────────────
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
//         <>
//             {/* Breadcrumb */}
//             <div
//                 style={{
//                     margin: 5,
//                     marginLeft: 10,
//                     marginTop: 10,
//                 }}
//             >
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={3}
//                     separator={
//                         <KeyboardArrowRightIcon fontSize="small" />
//                     }
//                 >
//                     <Link
//                         underline="hover"
//                         onClick={() =>
//                             navigate(
//                                 "/tools"
//                             )
//                         }
//                     >
//                         Tools
//                     </Link>

//                     <Link
//                         underline="hover"
//                         onClick={() =>
//                             navigate(
//                                 "/tools/performance_at_tat"
//                             )
//                         }
//                     >
//                         Performance AT
//                     </Link>

//                     <Typography color="text.primary">
//                         SCFT FTR
//                     </Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     flexWrap="wrap"
//                     gap={1}
//                 >
//                     {/* Left */}
//                     <Typography
//                         variant="h5"
//                         fontWeight={700}
//                     >
//                         SCFT FTR Dashboard
//                     </Typography>

//                     {/* Right */}
//                     <Box
//                         display="flex"
//                         gap={1}
//                         alignItems="center"
//                         flexWrap="wrap"
//                     >
//                         <TextField
//                             size="small"
//                             label="Start Date"
//                             type="date"
//                             value={
//                                 startDate
//                             }
//                             onChange={(
//                                 e
//                             ) => {
//                                 if (
//                                     e
//                                         .target
//                                         .value <=
//                                     todayStr
//                                 ) {
//                                     setStartDate(
//                                         e
//                                             .target
//                                             .value
//                                     );
//                                 }
//                             }}
//                             inputProps={{
//                                 max:
//                                     endDate ||
//                                     todayStr,
//                             }}
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                             sx={{
//                                 minWidth: 155,
//                             }}
//                         />

//                         <Typography
//                             variant="body2"
//                             color="text.secondary"
//                         >
//                             ~
//                         </Typography>

//                         <TextField
//                             size="small"
//                             label="End Date"
//                             type="date"
//                             value={
//                                 endDate
//                             }
//                             onChange={(
//                                 e
//                             ) => {
//                                 if (
//                                     e
//                                         .target
//                                         .value <=
//                                     todayStr
//                                 ) {
//                                     setEndDate(
//                                         e
//                                             .target
//                                             .value
//                                     );
//                                 }
//                             }}
//                             inputProps={{
//                                 min: startDate,
//                                 max: todayStr,
//                             }}
//                             InputLabelProps={{
//                                 shrink: true,
//                             }}
//                             sx={{
//                                 minWidth: 155,
//                             }}
//                         />

//                         {/* Download */}
//                         <IconButton
//                             onClick={
//                                 handleDownload
//                             }
//                             title="Download Excel"
//                             disabled={
//                                 !apiResponse?.download_url
//                             }
//                         >
//                             <DownloadIcon
//                                 color={
//                                     apiResponse?.download_url
//                                         ? "primary"
//                                         : "disabled"
//                                 }
//                             />
//                         </IconButton>
//                     </Box>
//                 </Box>

//                 {/* Technology Tabs */}
//                 <Box
//                     mt={2}
//                     sx={{
//                         display: "flex",
//                         borderBottom:
//                             "2px solid #e0e0e0",
//                     }}
//                 >
//                     {TECH_TABS.map(
//                         (tab) => {
//                             const isActive =
//                                 activeTech ===
//                                 tab.key;

//                             const tColor =
//                                 TECH_COLORS[
//                                 tab.key
//                                 ];

//                             return (
//                                 <Box
//                                     key={
//                                         tab.key
//                                     }
//                                     onClick={() =>
//                                         setActiveTech(
//                                             tab.key
//                                         )
//                                     }
//                                     sx={{
//                                         px: 3,
//                                         py: 1,
//                                         cursor:
//                                             "pointer",
//                                         userSelect:
//                                             "none",
//                                         fontWeight:
//                                             isActive
//                                                 ? 700
//                                                 : 500,
//                                         fontSize: 14,
//                                         color:
//                                             isActive
//                                                 ? "#fff"
//                                                 : tColor.tabColor,
//                                         background:
//                                             isActive
//                                                 ? tColor.active
//                                                 : "transparent",
//                                         borderRadius:
//                                             "6px 6px 0 0",
//                                         borderBottom:
//                                             isActive
//                                                 ? `3px solid ${tColor.tabColor}`
//                                                 : "3px solid transparent",
//                                         transition:
//                                             "all 0.2s",
//                                         "&:hover":
//                                         {
//                                             background:
//                                                 isActive
//                                                     ? tColor.active
//                                                     : "#f0f4ff",
//                                         },
//                                     }}
//                                 >
//                                     {
//                                         tab.label
//                                     }
//                                 </Box>
//                             );
//                         }
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <TechTable
//                     tech={activeTech}
//                     apiResponse={
//                         apiResponse
//                     }
//                     dateRangeLabel={
//                         dateRangeLabel
//                     }
//                 />

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SCFT_FTR;

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
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useNavigate } from "react-router-dom";
import { postData, getData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth(); // 0-indexed
const START_YEAR = 2000;

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Technology Tabs ──────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Table Columns ───────────────────────────────────────────────────────────
const COLUMNS = [
    { label: "Total Site", key: "Total Site" },
    { label: "Pending", key: "Pending" },
    { label: "Accepted with 0 counter", key: "Accepted with 0 counter" },
    { label: "Acceptance pending with 0 Counter", key: "Acceptance pending with 0 Counter" },
    { label: "SCFT FTR", key: "SCFT FTR" },
];

// ── Tech Colours ────────────────────────────────────────────────────────────
const TECH_COLORS = {
    "4G": {
        active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        tabColor: "#1e3c72",
    },
    "5G": {
        active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        header: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
        tabColor: "#134e5e",
    },
    "4G+5G": {
        active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
        header: "linear-gradient(135deg, #252326 0%, #414345 100%)",
        tabColor: "#41295a",
    },
};

// ── Shared Styles ───────────────────────────────────────────────────────────
const cellSt = {
    padding: "4px 8px",
    border: "1px solid #c0c0c0",
    textAlign: "center",
    fontSize: 13,
    whiteSpace: "nowrap",
};

const stickySt = {
    ...cellSt,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "center",
    fontWeight: 600,
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

// ── Table Component ─────────────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, monthLabel }) => {
    const colors = TECH_COLORS[tech];
    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    // Handle both possible response shapes:
    // 1. Object keyed by tech: { "4G": [...], "5G": [...] }
    // 2. Flat array for the currently requested tech: [...]
    const rawDataSrc = apiResponse?.data;
    const rawData = Array.isArray(rawDataSrc)
        ? rawDataSrc
        : (rawDataSrc?.[tech] || []);

    const circleRows = rawData.filter((row) => row.Circle !== "Grand Total");
    const grandTotal = rawData.find((row) => row.Circle === "Grand Total") || {};

    const titleLabel = monthLabel
        ? `SCFT | ${monthLabel} | ${tech}`
        : "Select a month to load data";

    return (
        <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #c0c0c0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 500 }}>
                <thead>
                    {/* Title */}
                    <tr>
                        <th
                            colSpan={COLUMNS.length + 1}
                            style={{ ...cellSt, background: colors.active, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", padding: "8px 12px", border: "1px solid #2e4a70" }}
                        >
                            {titleLabel}
                        </th>
                    </tr>

                    {/* Header */}
                    <tr>
                        <th style={{ ...stickySt, background: colors.header, color: "#fff", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70", padding: "6px 12px" }}>
                            Circle
                        </th>
                        {COLUMNS.map((col) => (
                            <th key={col.key} style={{ ...cellSt, background: colors.header, color: "#fff", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70", padding: "6px 10px" }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {circleRows.length > 0 ? (
                        <>
                            {circleRows.map((row, idx) => (
                                <tr key={row.Circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
                                    <td style={{ ...stickySt, background: idx % 2 === 0 ? "#fff" : STRIPE }}>{row.Circle}</td>
                                    {COLUMNS.map((col) => (
                                        <td key={col.key} style={cellSt}>{row?.[col.key] ?? 0}</td>
                                    ))}
                                </tr>
                            ))}

                            {/* Grand Total */}
                            <tr style={{ background: TOTAL_BG, fontWeight: 700 }}>
                                <td style={{ ...stickySt, background: TOTAL_BG, border: "1px solid #c0c0c0", fontSize: 14 }}>
                                    Grand Total
                                </td>
                                {COLUMNS.map((col) => (
                                    <td key={col.key} style={{ ...cellSt, fontWeight: 700, fontSize: 14 }}>
                                        {grandTotal?.[col.key] ?? 0}
                                    </td>
                                ))}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan={COLUMNS.length + 1} style={{ ...cellSt, padding: 20, color: "#9e9e9e", fontSize: 14 }}>
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Box>
    );
};

// ── Main Component ──────────────────────────────────────────────────────────
const SCFT_FTR = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse] = useState(null);
    const [activeTech, setActiveTech] = useState("4G");
    const [apiMonths, setApiMonths] = useState([]); // raw strings from API e.g. ["Jun 2026","May 2026"]

    // Default to current month
    const [selected, setSelected] = useState({
        year: CURRENT_YEAR,
        month: CURRENT_MONTH,
    });

    // ── Load available months from API ────────────────────────────────────
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

    // ── Derived API string: "Jun 2026" ────────────────────────────────────
    const apiValue = toApiFormat(selected); // e.g. "Jun 2026"

    // ── Fetch API ─────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        if (!apiValue) return;
        try {
            action(true);
            const formData = new FormData();
            formData.append("month", apiValue); // ✅ sends "Jun 2026" → matches %b %Y
            formData.append("tech", activeTech); // e.g. "4G", "5G", "4G+5G"

            const res = await postData("performance_idploy/generate-scft/", formData);

            if (res?.status) {
                setApiResponse(res);
            } else {
                setApiResponse(null);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setApiResponse(null);
        } finally {
            action(false);
        }
    }, [apiValue, activeTech]);

    // ── Debounce API Calls ────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 400);
        return () => clearTimeout(timer);
    }, [fetchData]);

    // ── Download ──────────────────────────────────────────────────────────
    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) return;
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance AT</Link>
                    <Typography color="text.primary">SCFT FTR</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* Top Bar */}
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                    {/* Left */}
                    <Typography variant="h5" fontWeight={700}>
                        SCFT FTR Dashboard
                    </Typography>

                    {/* Right */}
                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        <YearMonthPicker
                            value={selected}
                            apiMonths={apiMonths}
                            onChange={(val) => {
                                setSelected(val);
                                setApiResponse(null);
                            }}
                        />

                        {/* Download */}
                        <IconButton onClick={handleDownload} title="Download Excel" disabled={!apiResponse?.download_url}>
                            <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Technology Tabs */}
                <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
                    {TECH_TABS.map((tab) => {
                        const isActive = activeTech === tab.key;
                        const tColor = TECH_COLORS[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveTech(tab.key)}
                                sx={{
                                    px: 3, py: 1,
                                    cursor: "pointer",
                                    userSelect: "none",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: 14,
                                    color: isActive ? "#fff" : tColor.tabColor,
                                    background: isActive ? tColor.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": { background: isActive ? tColor.active : "#f0f4ff" },
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* Table */}
                <TechTable
                    tech={activeTech}
                    apiResponse={apiResponse}
                    monthLabel={apiValue}
                />

                {loading}
            </Box>
        </>
    );
};

export default SCFT_FTR;