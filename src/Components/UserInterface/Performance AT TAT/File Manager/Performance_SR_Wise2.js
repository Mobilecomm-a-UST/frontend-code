// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     TextField,
//     Breadcrumbs,
//     Link,
//     Chip,
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
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// // ── Table Columns ─────────────────────────────────────────────────────────────
// const COLUMNS = [
//     { label: "Circle", key: "Circle" },
//     { label: "PAT", key: "PAT" },
//     { label: "SAT", key: "SAT" },
//     { label: "KAT", key: "KAT" },
//     { label: "SCFT", key: "SCFT" },
// ];

// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // ── 5G Colour Theme ───────────────────────────────────────────────────────────
// const COLORS = {
//     titleBg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge: "#2e7d32",
//     border: "#1f4037",
// };

// // ── Status Cell Colour Helper ─────────────────────────────────────────────────
// // When value is a word (old behaviour) — keep colours.
// // When value is a number  — the whole cell becomes a clickable link chip.
// const STATUS_COLORS = {
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7" },
//     pending: { color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
//     offered: { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9" },
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending") return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered") return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // ── Shared Styles ─────────────────────────────────────────────────────────────
// const cellSt = {
//     padding: "4px 8px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const stickySt = {
//     ...cellSt,
//     position: "sticky",
//     left: 0,
//     zIndex: 2,
//     textAlign: "center",
//     fontWeight: 600,
//     fontSize: 12,
// };

// // ── Clickable Count Chip ──────────────────────────────────────────────────────
// // Rendered when the cell value is a number (future API).
// // statusKey: "pending" | "offered" | "accepted"
// const CountChip = ({ count, statusKey, onClick }) => {
//     const theme = STATUS_COLORS[statusKey] ?? { color: "#333", bg: "#eee", border: "#ccc" };
//     return (
//         <Box
//             component="span"
//             onClick={onClick}
//             sx={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 minWidth: 32,
//                 px: 1.2,
//                 py: 0.3,
//                 borderRadius: "12px",
//                 fontSize: 12,
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 userSelect: "none",
//                 color: theme.color,
//                 background: theme.bg,
//                 border: `1.5px solid ${theme.border}`,
//                 transition: "all .15s",
//                 "&:hover": {
//                     filter: "brightness(0.92)",
//                     boxShadow: `0 2px 8px ${theme.border}88`,
//                 },
//             }}
//         >
//             {count}
//         </Box>
//     );
// };

// // ── Helper: is the value a pure number? ──────────────────────────────────────
// const isNumeric = (val) => val !== null && val !== undefined && val !== "" && val !== "-" && !isNaN(Number(val));

// // ── Main Component ────────────────────────────────────────────────────────────
// const Performance_SR_Wise2 = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] = useState(null);
//     const [startDate, setStartDate] = useState(getDefaultStartDate());
//     const [endDate, setEndDate] = useState(todayStr);

//     // ── Fetch ─────────────────────────────────────────────────────────────
//     const fetchData = async () => {
//         if (!startDate || !endDate) return;
//         if (startDate > endDate) return;

//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", startDate);
//             formData.append("end_date", endDate);

//             const res = await postData(
//                 "performance_idploy/generate-atsrwise-summary/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 console.error("API error:", res?.error || "Unknown error");
//                 setApiResponse(null);
//             }
//         } catch (err) {
//             console.error("Fetch Error:", err);
//         } finally {
//             action(false);
//         }
//     };

//     // ── Debounced effect ──────────────────────────────────────────────────
//     useEffect(() => {
//         const timer = setTimeout(() => { fetchData(); }, 500);
//         return () => clearTimeout(timer);
//     }, [startDate, endDate]);

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

//     // ── Navigate to detail page on chip click ─────────────────────────────
//     // Passes: circle, column (PAT/SAT/KAT/SCFT), statusKey, date range
//     const handleCountClick = ({ circle, column, statusKey, count }) => {
//         navigate("/tools/performance_at_tat/sr_wise_hyperlink", {
//             state: {
//                 circle,
//                 column,        // "PAT" | "SAT" | "KAT" | "SCFT"
//                 statusKey,     // "pending" | "offered" | "accepted"
//                 count,
//                 startDate,
//                 endDate,
//             },
//         });
//     };

//     const tableRows = apiResponse?.summary || [];
//     const dateRangeLabel = startDate && endDate ? `${startDate}  to  ${endDate}` : "";
//     const titleLabel = dateRangeLabel ? `AT Report  |  ${dateRangeLabel}` : "AT Report";
//     const STRIPE = "#f4f7fb";

//     // ── Cell renderer ─────────────────────────────────────────────────────
//     // For STATUS columns:
//     //   • If value is a NUMBER  → render clickable CountChip(s) per status
//     //   • If value is a STRING  → render coloured text (current behaviour)
//     //
//     // Future API shape expected for numeric mode (one example):
//     //   row.PAT = { pending: 3, offered: 1, accepted: 12 }
//     //   — OR —
//     //   row.PAT_pending = 3, row.PAT_offered = 1, row.PAT_accepted = 12
//     //
//     // For now the API still returns a string ("Pending" / "Offered" / "Accepted"),
//     // so the string branch runs. When the API changes, only the numeric branch
//     // will activate — no other code needs changing.

//     const renderStatusCell = (row, col) => {
//         const val = row?.[col.key];

//         // ── Numeric mode (future API) ──────────────────────────────────────
//         // Expected shape: row[col.key] = { pending: N, offered: N, accepted: N }
//         if (val && typeof val === "object" && !Array.isArray(val)) {
//             const chips = Object.entries(val)
//                 .filter(([, n]) => Number(n) > 0)
//                 .map(([statusKey, n]) => (
//                     <CountChip
//                         key={statusKey}
//                         count={n}
//                         statusKey={statusKey}
//                         onClick={() =>
//                             handleCountClick({
//                                 circle: row["Circle"],
//                                 column: col.key,
//                                 statusKey,
//                                 count: n,
//                             })
//                         }
//                     />
//                 ));
//             return (
//                 <Box display="flex" gap={0.5} justifyContent="center" flexWrap="wrap">
//                     {chips.length ? chips : "-"}
//                 </Box>
//             );
//         }

//         // ── Flat numeric mode (alternate future API) ──────────────────────
//         // Expected shape: row["PAT_pending"] = 3, row["PAT_offered"] = 1 …
//         const flatKeys = ["pending", "offered", "accepted"].map((s) => ({
//             statusKey: s,
//             flatKey: `${col.key}_${s}`,
//         }));
//         const hasFlatNums = flatKeys.some(({ flatKey }) => isNumeric(row[flatKey]));
//         if (hasFlatNums) {
//             const chips = flatKeys
//                 .filter(({ flatKey }) => isNumeric(row[flatKey]) && Number(row[flatKey]) > 0)
//                 .map(({ statusKey, flatKey }) => (
//                     <CountChip
//                         key={statusKey}
//                         count={row[flatKey]}
//                         statusKey={statusKey}
//                         onClick={() =>
//                             handleCountClick({
//                                 circle: row["Circle"],
//                                 column: col.key,
//                                 statusKey,
//                                 count: row[flatKey],
//                             })
//                         }
//                     />
//                 ));
//             return (
//                 <Box display="flex" gap={0.5} justifyContent="center" flexWrap="wrap">
//                     {chips.length ? chips : "-"}
//                 </Box>
//             );
//         }

//         // ── String mode (current API) ─────────────────────────────────────
//         // ── Plain number mode (current API returns a single count) ────────
//         // e.g. row.PAT = 3  →  show as a clickable "Pending" chip (all counts
//         //      from summary are pending counts, adjust statusKey as needed)
//         if (isNumeric(val) && Number(val) > 0) {
//             return (
//                 <CountChip
//                     count={Number(val)}
//                     statusKey="pending"
//                     onClick={() =>
//                         handleCountClick({
//                             circle: row["Circle"],
//                             column: col.key,
//                             statusKey: "pending",
//                             count: Number(val),
//                         })
//                     }
//                 />
//             );
//         }
//         if (isNumeric(val) && Number(val) === 0) {
//             return <span style={{ color: "#9e9e9e", fontSize: 12 }}>0</span>;
//         }

//         // ── String mode ───────────────────────────────────────────────────
//         const strVal = val !== null && val !== undefined && val !== "" ? String(val) : "-";
//         return (
//             <span style={getStatusStyle(strVal)}>{strVal}</span>
//         );
//     };

//     return (
//         <>
//             {/* Breadcrumb */}
//             {/* <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Typography color="text.primary">Performance SR Wise</Typography>
//                 </Breadcrumbs>
//             </div> */}

//             <Box p={1}>
//                 {/* ── Top Bar ── */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     flexWrap="wrap"
//                     gap={1}
//                 >
//                     <Typography variant="h5" fontWeight={700}>
//                         Performance SR Wise Tracking Dashboard
//                     </Typography>

//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <TextField
//                             size="small"
//                             label="Start Date"
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => {
//                                 if (e.target.value <= todayStr)
//                                     setStartDate(e.target.value);
//                             }}
//                             inputProps={{ max: endDate || todayStr }}
//                             InputLabelProps={{ shrink: true }}
//                             sx={{ minWidth: 155 }}
//                         />

//                         <Typography variant="body2" color="text.secondary">~</Typography>

//                         <TextField
//                             size="small"
//                             label="End Date"
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => {
//                                 if (e.target.value <= todayStr)
//                                     setEndDate(e.target.value);
//                             }}
//                             inputProps={{ min: startDate, max: todayStr }}
//                             InputLabelProps={{ shrink: true }}
//                             sx={{ minWidth: 155 }}
//                         />

//                         <IconButton
//                             onClick={handleDownload}
//                             title="Download Excel"
//                             disabled={!apiResponse?.download_url}
//                         >
//                             <DownloadIcon
//                                 color={apiResponse?.download_url ? "primary" : "disabled"}
//                             />
//                         </IconButton>
//                     </Box>
//                 </Box>

//                 {/* ── Table ── */}
//                 <Box
//                     mt={2}
//                     sx={{
//                         overflowX: "auto",
//                         borderRadius: 2,
//                         border: "1px solid #c0c0c0",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                     }}
//                 >
//                     <table
//                         style={{
//                             width: "100%",
//                             borderCollapse: "collapse",
//                             tableLayout: "auto",
//                             minWidth: 700,
//                         }}
//                     >
//                         <thead>
//                             {/* Title row */}
//                             <tr>
//                                 <th
//                                     colSpan={COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 14,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>

//                             {/* Column header row */}
//                             <tr>
//                                 {COLUMNS.map((col) => (
//                                     <th
//                                         key={col.key}
//                                         style={{
//                                             ...cellSt,
//                                             background: COLORS.headerBg,
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             fontSize: 12,
//                                             border: `1px solid ${COLORS.border}`,
//                                             padding: "6px 10px",
//                                         }}
//                                     >
//                                         {col.label}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {tableRows.length > 0 ? (
//                                 tableRows.map((row, idx) => (
//                                     <tr
//                                         key={`${row["Circle"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {COLUMNS.map((col) => {
//                                             const isStatus = STATUS_COLS.includes(col.key);
//                                             const isCircle = col.key === "Circle";
//                                             const val = row?.[col.key] ?? "-";

//                                             return (
//                                                 <td
//                                                     key={col.key}
//                                                     style={{
//                                                         ...(isCircle ? stickySt : cellSt),
//                                                         background: isCircle
//                                                             ? idx % 2 === 0 ? "#fff" : STRIPE
//                                                             : undefined,
//                                                     }}
//                                                 >
//                                                     {isStatus
//                                                         ? renderStatusCell(row, col)
//                                                         : (val !== null && val !== undefined && val !== ""
//                                                             ? val : "-")}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 20,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         No Data Available
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {/* Row count badge */}
//                     {tableRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">
//                                 Showing
//                             </Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${apiResponse?.total_sites ?? tableRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export const MemoPerformance_SR_Wise2 = React.memo(Performance_SR_Wise2);

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link,
    Chip,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

import { useNavigate } from "react-router-dom";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const currentMonthStr = todayStr.slice(0, 7); // "YYYY-MM"

const getDefaultStartDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

// ── Month <-> Date Range Helpers ──────────────────────────────────────────────
const getMonthStartDate = (yyyyMM) => `${yyyyMM}-01`;

const getMonthEndDate = (yyyyMM) => {
    const [y, m] = yyyyMM.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    return end > todayStr ? todayStr : end;
};

// ── Table Columns ─────────────────────────────────────────────────────────────
const COLUMNS = [
    { label: "Circle", key: "Circle" },
    { label: "PAT", key: "PAT" },
    { label: "SAT", key: "SAT" },
    { label: "KAT", key: "KAT" },
    { label: "SCFT", key: "SCFT" },
];

const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// ── 5G Colour Theme ───────────────────────────────────────────────────────────
const COLORS = {
    titleBg: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
    badge: "#2e7d32",
    border: "#1f4037",
};

// ── Status Cell Colour Helper ─────────────────────────────────────────────────
const STATUS_COLORS = {
    accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7" },
    pending: { color: "#e65100", bg: "#fff3e0", border: "#ffcc80" },
    offered: { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9" },
};

const getStatusStyle = (value) => {
    if (!value || value === "-" || value === "") return {};
    const v = String(value).toLowerCase();
    if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
    if (v === "pending") return { color: "#e65100", fontWeight: 600 };
    if (v === "offered") return { color: "#0d47a1", fontWeight: 600 };
    return {};
};

// ── Shared Styles ─────────────────────────────────────────────────────────────
const cellSt = {
    padding: "4px 8px",
    border: "1px solid #c0c0c0",
    textAlign: "center",
    fontSize: 12,
    whiteSpace: "nowrap",
};

const stickySt = {
    ...cellSt,
    position: "sticky",
    left: 0,
    zIndex: 2,
    textAlign: "center",
    fontWeight: 600,
    fontSize: 12,
};

// ── Month / Date Range Toggle Styles ─────────────────────────────────────────
const toggleWrapSt = {
    background: "#fdece0",
    borderRadius: "10px",
    padding: "4px",
    display: "flex",
    gap: "4px",
};

const toggleBtnSt = {
    textTransform: "none",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    borderRadius: "8px !important",
    padding: "6px 14px",
    color: "#5c4632",
    "&.Mui-selected": {
        background: "#1e2a5e",
        color: "#fff",
    },
    "&.Mui-selected:hover": {
        background: "#1e2a5e",
    },
};

// ── Clickable Count Chip ──────────────────────────────────────────────────────
const CountChip = ({ count, statusKey, onClick }) => {
    const theme = STATUS_COLORS[statusKey] ?? { color: "#333", bg: "#eee", border: "#ccc" };
    return (
        <Box
            component="span"
            onClick={onClick}
            sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 32,
                px: 1.2,
                py: 0.3,
                borderRadius: "12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                userSelect: "none",
                color: theme.color,
                background: theme.bg,
                border: `1.5px solid ${theme.border}`,
                transition: "all .15s",
                "&:hover": {
                    filter: "brightness(0.92)",
                    boxShadow: `0 2px 8px ${theme.border}88`,
                },
            }}
        >
            {count}
        </Box>
    );
};

// ── Helper: is the value a pure number? ──────────────────────────────────────
const isNumeric = (val) => val !== null && val !== undefined && val !== "" && val !== "-" && !isNaN(Number(val));

// ── Main Component ────────────────────────────────────────────────────────────
const Performance_SR_Wise2 = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse] = useState(null);

    // ── Month / Date Range Toggle ──────────────────────────────────────────
    const [dateMode, setDateMode] = useState("range"); // "month" | "range"
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate] = useState(todayStr);

    // ── Effective dates sent to the API (derived from mode) ────────────────
    const effectiveStartDate = dateMode === "month" ? getMonthStartDate(selectedMonth) : startDate;
    const effectiveEndDate   = dateMode === "month" ? getMonthEndDate(selectedMonth) : endDate;

    const handleModeChange = (_e, newMode) => {
        if (newMode) setDateMode(newMode);
    };

    // ── Fetch ─────────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!effectiveStartDate || !effectiveEndDate) return;
        if (effectiveStartDate > effectiveEndDate) return;

        try {
            action(true);

            const formData = new FormData();
            formData.append("start_date", effectiveStartDate);
            formData.append("end_date", effectiveEndDate);

            const res = await postData(
                "performance_idploy/generate-atsrwise-summary/",
                formData
            );

            if (res?.status) {
                setApiResponse(res);
            } else {
                console.error("API error:", res?.error || "Unknown error");
                setApiResponse(null);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            action(false);
        }
    };

    // ── Debounced effect ──────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => { fetchData(); }, 500);
        return () => clearTimeout(timer);
    }, [effectiveStartDate, effectiveEndDate]);

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

    // ── Navigate to detail page on chip click ─────────────────────────────
    const handleCountClick = ({ circle, column, statusKey, count }) => {
        navigate("/tools/performance_at_tat/sr_wise_hyperlink", {
            state: {
                circle,
                column,
                statusKey,
                count,
                startDate: effectiveStartDate,
                endDate: effectiveEndDate,
            },
        });
    };

    const tableRows = apiResponse?.summary || [];
    const dateRangeLabel = effectiveStartDate && effectiveEndDate
        ? `${effectiveStartDate}  to  ${effectiveEndDate}`
        : "";
    const titleLabel = dateRangeLabel ? `AT Report  |  ${dateRangeLabel}` : "AT Report";
    const STRIPE = "#f4f7fb";

    // ── Cell renderer ─────────────────────────────────────────────────────
    const renderStatusCell = (row, col) => {
        const val = row?.[col.key];

        if (val && typeof val === "object" && !Array.isArray(val)) {
            const chips = Object.entries(val)
                .filter(([, n]) => Number(n) > 0)
                .map(([statusKey, n]) => (
                    <CountChip
                        key={statusKey}
                        count={n}
                        statusKey={statusKey}
                        onClick={() =>
                            handleCountClick({
                                circle: row["Circle"],
                                column: col.key,
                                statusKey,
                                count: n,
                            })
                        }
                    />
                ));
            return (
                <Box display="flex" gap={0.5} justifyContent="center" flexWrap="wrap">
                    {chips.length ? chips : "-"}
                </Box>
            );
        }

        const flatKeys = ["pending", "offered", "accepted"].map((s) => ({
            statusKey: s,
            flatKey: `${col.key}_${s}`,
        }));
        const hasFlatNums = flatKeys.some(({ flatKey }) => isNumeric(row[flatKey]));
        if (hasFlatNums) {
            const chips = flatKeys
                .filter(({ flatKey }) => isNumeric(row[flatKey]) && Number(row[flatKey]) > 0)
                .map(({ statusKey, flatKey }) => (
                    <CountChip
                        key={statusKey}
                        count={row[flatKey]}
                        statusKey={statusKey}
                        onClick={() =>
                            handleCountClick({
                                circle: row["Circle"],
                                column: col.key,
                                statusKey,
                                count: row[flatKey],
                            })
                        }
                    />
                ));
            return (
                <Box display="flex" gap={0.5} justifyContent="center" flexWrap="wrap">
                    {chips.length ? chips : "-"}
                </Box>
            );
        }

        if (isNumeric(val) && Number(val) > 0) {
            return (
                <CountChip
                    count={Number(val)}
                    statusKey="pending"
                    onClick={() =>
                        handleCountClick({
                            circle: row["Circle"],
                            column: col.key,
                            statusKey: "pending",
                            count: Number(val),
                        })
                    }
                />
            );
        }
        if (isNumeric(val) && Number(val) === 0) {
            return <span style={{ color: "#9e9e9e", fontSize: 12 }}>0</span>;
        }

        const strVal = val !== null && val !== undefined && val !== "" ? String(val) : "-";
        return (
            <span style={getStatusStyle(strVal)}>{strVal}</span>
        );
    };

    return (
        <>
            {/* Breadcrumb */}
            {/* <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                        Performance At
                    </Link>
                    <Typography color="text.primary">Performance SR Wise</Typography>
                </Breadcrumbs>
            </div> */}

            <Box p={1}>
                {/* ── Top Bar ── */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    <Typography variant="h5" fontWeight={700}>
                        Performance SR Wise Tracking Dashboard
                    </Typography>

                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        {/* ── Month / Date Range Toggle ── */}
                        <ToggleButtonGroup
                            value={dateMode}
                            exclusive
                            onChange={handleModeChange}
                            sx={toggleWrapSt}
                        >
                            <ToggleButton value="month" sx={toggleBtnSt}>
                                <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.6 }} />
                                Month
                            </ToggleButton>
                            <ToggleButton value="range" sx={toggleBtnSt}>
                                <DateRangeIcon sx={{ fontSize: 16, mr: 0.6 }} />
                                Date Range
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {dateMode === "month" ? (
                            <TextField
                                size="small"
                                label="Month"
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => {
                                    if (e.target.value <= currentMonthStr)
                                        setSelectedMonth(e.target.value);
                                }}
                                inputProps={{ max: currentMonthStr }}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: 155 }}
                            />
                        ) : (
                            <>
                                <TextField
                                    size="small"
                                    label="Start Date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        if (e.target.value <= todayStr)
                                            setStartDate(e.target.value);
                                    }}
                                    inputProps={{ max: endDate || todayStr }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minWidth: 155 }}
                                />

                                <Typography variant="body2" color="text.secondary">~</Typography>

                                <TextField
                                    size="small"
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        if (e.target.value <= todayStr)
                                            setEndDate(e.target.value);
                                    }}
                                    inputProps={{ min: startDate, max: todayStr }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minWidth: 155 }}
                                />
                            </>
                        )}

                        <IconButton
                            onClick={handleDownload}
                            title="Download Excel"
                            disabled={!apiResponse?.download_url}
                        >
                            <DownloadIcon
                                color={apiResponse?.download_url ? "primary" : "disabled"}
                            />
                        </IconButton>
                    </Box>
                </Box>

                {/* ── Table ── */}
                <Box
                    mt={2}
                    sx={{
                        overflowX: "auto",
                        borderRadius: 2,
                        border: "1px solid #c0c0c0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "auto",
                            minWidth: 700,
                        }}
                    >
                        <thead>
                            {/* Title row */}
                            <tr>
                                <th
                                    colSpan={COLUMNS.length}
                                    style={{
                                        ...cellSt,
                                        background: COLORS.titleBg,
                                        color: "#fff",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        textAlign: "center",
                                        padding: "10px 12px",
                                        border: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {titleLabel}
                                </th>
                            </tr>

                            {/* Column header row */}
                            <tr>
                                {COLUMNS.map((col) => (
                                    <th
                                        key={col.key}
                                        style={{
                                            ...cellSt,
                                            background: COLORS.headerBg,
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: 12,
                                            border: `1px solid ${COLORS.border}`,
                                            padding: "6px 10px",
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {tableRows.length > 0 ? (
                                tableRows.map((row, idx) => (
                                    <tr
                                        key={`${row["Circle"]}-${idx}`}
                                        style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                    >
                                        {COLUMNS.map((col) => {
                                            const isStatus = STATUS_COLS.includes(col.key);
                                            const isCircle = col.key === "Circle";
                                            const val = row?.[col.key] ?? "-";

                                            return (
                                                <td
                                                    key={col.key}
                                                    style={{
                                                        ...(isCircle ? stickySt : cellSt),
                                                        background: isCircle
                                                            ? idx % 2 === 0 ? "#fff" : STRIPE
                                                            : undefined,
                                                    }}
                                                >
                                                    {isStatus
                                                        ? renderStatusCell(row, col)
                                                        : (val !== null && val !== undefined && val !== ""
                                                            ? val : "-")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={COLUMNS.length}
                                        style={{
                                            ...cellSt,
                                            padding: 20,
                                            color: "#9e9e9e",
                                            fontSize: 14,
                                            textAlign: "center",
                                        }}
                                    >
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Row count badge */}
                    {tableRows.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                px: 2, py: 0.8,
                                borderTop: "1px solid #e0e0e0",
                                background: "#fafafa",
                                gap: 1,
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">
                                Showing
                            </Typography>
                            <Chip
                                label={`${tableRows.length} / ${apiResponse?.total_sites ?? tableRows.length} rows`}
                                size="small"
                                sx={{
                                    background: COLORS.badge,
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 11,
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {loading}
            </Box>
        </>
    );
};

export const MemoPerformance_SR_Wise2 = React.memo(Performance_SR_Wise2);