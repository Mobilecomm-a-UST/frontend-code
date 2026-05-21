// import React, { useEffect, useState, useRef } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     IconButton,
//     TextField,
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";

// // ── Constants ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];

// const getDefaultStartDate = () => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// // Convert "01-Jan-2026" → "2026-01-01" (backend returns DD-Mon-YYYY, API needs YYYY-MM-DD)
// const toYYYYMMDD = (dateStr) => {
//     if (!dateStr) return "";
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
//     const MONTHS = { Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06", Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12" };
//     const parts = dateStr.split("-");
//     if (parts.length === 3 && MONTHS[parts[1]]) {
//         return `${parts[2]}-${MONTHS[parts[1]]}-${parts[0].padStart(2, "0")}`;
//     }
//     return dateStr;
// };

// // ── Technology tabs ──────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G",    label: "4G"    },
//     { key: "5G",    label: "5G"    },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ── Tech tab accent colours ───────────────────────────────────────────────────
// const TECH_COLORS = {
//     "4G": {
//         active:    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         hover:     "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
//         header:    "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
//         subHeader: "linear-gradient(135deg, #2F75B5 0%, #4facfe 100%)",
//         tabColor:  "#1e3c72",
//     },
//     "5G": {
//         active:    "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         hover:     "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
//         header:    "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//         subHeader: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
//         tabColor:  "#134e5e",
//     },
//     "4G+5G": {
//         active:    "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
//         hover:     "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
//         header:    "linear-gradient(135deg, #252326 0%, #414345 100%)",
//         subHeader: "linear-gradient(135deg, #DA22FF 0%, #9733EE 100%)",
//         tabColor:  "#41295a",
//     },
// };

// // ── Shared cell styles ───────────────────────────────────────────────────────
// const cellStyle = {
//     padding:    "2px 6px",
//     border:     "1px solid #000000",
//     textAlign:  "center",
//     fontSize:   13,
//     whiteSpace: "nowrap",
// };

// const stickyCell = {
//     ...cellStyle,
//     position:   "sticky",
//     left:        0,
//     zIndex:      2,
//     textAlign:  "left",
//     fontWeight:  600,
// };

// const formatGrandTotal = (val) => {
//     const num = parseFloat(val);
//     if (isNaN(num)) return 0;
//     return Number.isInteger(num) ? num : num.toFixed(1);
// };

// // ── TechTable ─────────────────────────────────────────────────────────────────
// const TechTable = ({ tech, apiResponse, dateRangeLabel }) => {
//     const columns = [
//         { label: "<=12days",  key: "<=12days"  },
//         { label: "13-21days", key: "13-21days" },
//         { label: "22-30days", key: "22-30days" },
//         { label: ">30days",   key: ">30days"   },
//         { label: "Pending",   key: "Pending"   },
//         { label: "Total",     key: "Total"      },
//         { label: "%<12",      key: "%<12"      },
//         { label: "%<21",      key: "%<21"      },
//         { label: "%<22-30",   key: "%<22-30"   },
//     ];

//     const colors   = TECH_COLORS[tech];
//     const TOTAL_BG = "#b2f0c5";
//     const STRIPE   = "#f4f7fb";

//     const data       = apiResponse?.data?.[tech]?.circles    || {};
//     const grandTotal = apiResponse?.data?.[tech]?.grand_total || {};
//     const entries    = Object.entries(data);

//     return (
//         <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #000000", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
//                 <thead>
//                     {/* Date range header row */}
//                     <tr>
//                         <th style={{ ...stickyCell, background: colors.active, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, letterSpacing: 1, zIndex: 3, border: "1px solid #2e4a70" }}>
//                         </th>
//                         <th colSpan={columns.length} style={{ ...cellStyle, background: colors.active, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, paddingRight: 20, border: "1px solid #2e4a70" }}>
//                             {dateRangeLabel || "Loading..."}
//                         </th>
//                     </tr>

//                     {/* Column header row */}
//                     <tr style={{ background: colors.header }}>
//                         <th style={{ ...stickyCell, background: colors.header, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70" }}>
//                             Circle
//                         </th>
//                         {columns.map((col) => (
//                             <th key={col.key} style={{ ...cellStyle, background: colors.header, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70" }}>
//                                 {col.label}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {entries.length > 0 ? (
//                         <>
//                             {entries.map(([circle, val], idx) => (
//                                 <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
//                                     <td style={{ ...stickyCell, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #000000", textAlign: "center" }}>
//                                         {circle}
//                                     </td>
//                                     {columns.map((col) => (
//                                         <td key={col.key} style={cellStyle}>{val[col.key] ?? 0}</td>
//                                     ))}
//                                 </tr>
//                             ))}

//                             {/* Grand Total */}
//                             <tr style={{ background: TOTAL_BG }}>
//                                 <td style={{ ...stickyCell, background: TOTAL_BG, fontWeight: 700, textAlign: "center", border: "1px solid #000000", fontSize: 14 }}>
//                                     Grand Total
//                                 </td>
//                                 {columns.map((col) => (
//                                     <td key={col.key} style={{ ...cellStyle, fontWeight: 700, border: "1px solid #000000", fontSize: 14 }}>
//                                         {formatGrandTotal(grandTotal[col.key])}
//                                     </td>
//                                 ))}
//                             </tr>
//                         </>
//                     ) : (
//                         <tr>
//                             <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15, color: "#827f7f" }}>
//                                 No Data Available
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </Box>
//     );
// };

// // ── Datewise ────────────────────────────────────────────────────────────────
// const Datewise = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse,    setApiResponse]   = useState(null);
//     const [activeType,     setActiveType]    = useState("performance");
//     const [startDate,      setStartDate]     = useState(getDefaultStartDate());
//     const [endDate,        setEndDate]       = useState(todayStr);
//     const [confirmedRange, setConfirmedRange] = useState({ start: "", end: "" });
//     const [activeTech,     setActiveTech]    = useState("4G");

//     const fetchData = async () => {
//         if (!startDate || !endDate) return;
//         if (startDate > endDate)    return;

//         action(true);
//         setApiResponse(null);

//         // Step 1: Validate / confirm date range
//         const rangeForm = new FormData();
//         rangeForm.append("start_date", startDate);
//         rangeForm.append("end_date",   endDate);
//         const rangeRes = await postData("performance_idploy/date-range-selection/", rangeForm);

//         if (!rangeRes?.status) {
//             action(false);
//             return;
//         }

//         // Backend returns DD-Mon-YYYY — store for display, convert for API
//         const displayStart = rangeRes.start_date;
//         const displayEnd   = rangeRes.end_date;
//         setConfirmedRange({ start: displayStart, end: displayEnd });

//         const apiStart = toYYYYMMDD(displayStart);
//         const apiEnd   = toYYYYMMDD(displayEnd);

//         // Step 2: Generate report for active type
//         const api = activeType === "performance"
//             ? "performance_idploy/generate-performance/"
//             : "performance_idploy/generate-offered/";

//         const genForm = new FormData();
//         genForm.append("start_date", apiStart);
//         genForm.append("end_date",   apiEnd);
//         const res = await postData(api, genForm);

//         if (res?.status) setApiResponse(res);
//         action(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, [activeType, startDate, endDate]);

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

//     // Label shown in table header — from confirmed backend response
//     const dateRangeLabel = confirmedRange.start && confirmedRange.end
//         ? `${confirmedRange.start}  to  ${confirmedRange.end}`
//         : "";

//     return (
//         <>
//             {/* <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate('/tools/performance_at_tat')}>Performance At Tat</Link>
//                     <Typography color="text.primary">Dashboard</Typography>
//                 </Breadcrumbs>
//             </div> */}

//             <Box p={1}>
//                 {/* ── Top bar ── */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>

//                     {/* Left: title + Performance/Offered toggle */}
//                     <Box>
//                         <Typography variant="h5">
//                             {activeType === "performance" ? "Performance vs OA TAT" : "Offered vs OA TAT"}
//                         </Typography>
//                         <Box mt={1} display="flex" gap={1}>
//                             <Button
//                                 size="small"
//                                 onClick={() => setActiveType("performance")}
//                                 variant={activeType === "performance" ? "contained" : "outlined"}
//                             >
//                                 Performance
//                             </Button>
//                             <Button
//                                 size="small"
//                                 onClick={() => setActiveType("offered")}
//                                 variant={activeType === "offered" ? "contained" : "outlined"}
//                             >
//                                 Offered
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Right: date range pickers + download */}
//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <TextField
//                             size="small"
//                             label="From Date"
//                             type="date"
//                             value={startDate}
//                             onChange={(e) => { if (e.target.value <= todayStr) setStartDate(e.target.value); }}
//                             inputProps={{ max: endDate || todayStr }}
//                             InputLabelProps={{ shrink: true }}
//                             sx={{ minWidth: 155 }}
//                         />
//                         <Typography variant="body2" color="text.secondary">~</Typography>
//                         <TextField
//                             size="small"
//                             label="To Date"
//                             type="date"
//                             value={endDate}
//                             onChange={(e) => { if (e.target.value <= todayStr) setEndDate(e.target.value); }}
//                             inputProps={{ min: startDate, max: todayStr }}
//                             InputLabelProps={{ shrink: true }}
//                             sx={{ minWidth: 155 }}
//                         />
//                         <IconButton
//                             onClick={handleDownload}
//                             title="Download Excel"
//                             disabled={!apiResponse?.download_url}
//                         >
//                             <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
//                         </IconButton>
//                     </Box>
//                 </Box>

//                 {/* Technology tabs: 4G | 5G | 4G+5G */}
//                 <Box mt={2} sx={{ display: "flex", gap: 0, borderBottom: "2px solid #e0e0e0" }}>
//                     {TECH_TABS.map((tab) => {
//                         const isActive = activeTech === tab.key;
//                         const tColor   = TECH_COLORS[tab.key];
//                         return (
//                             <Box
//                                 key={tab.key}
//                                 onClick={() => setActiveTech(tab.key)}
//                                 sx={{
//                                     px: 3, py: 1,
//                                     cursor:       "pointer",
//                                     userSelect:   "none",
//                                     fontWeight:   isActive ? 700 : 500,
//                                     fontSize:     14,
//                                     color:        isActive ? "#fff" : tColor.tabColor,
//                                     background:   isActive ? tColor.active : "transparent",
//                                     borderRadius: "6px 6px 0 0",
//                                     borderBottom: isActive ? `2px solid ${tColor.tabColor}` : "2px solid transparent",
//                                     transition:   "all 0.2s",
//                                     "&:hover":    { background: isActive ? tColor.active : "#f0f4ff" },
//                                 }}
//                             >
//                                 {tab.label}
//                             </Box>
//                         );
//                     })}
//                 </Box>

//                 {/* Table */}
//                 <TechTable
//                     tech={activeTech}
//                     apiResponse={apiResponse}
//                     dateRangeLabel={dateRangeLabel}
//                 />

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export const MemoDatewise = React.memo(Datewise)


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];

const getDefaultStartDate = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
        now.getMonth() + 1
    ).padStart(2, "0")}-01`;
};

// ── Technology tabs ──────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Tech tab accent colours ─────────────────────────────────────────────────
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

// ── Shared Cell Styles ──────────────────────────────────────────────────────
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

    return Number.isInteger(num)
        ? num
        : num.toFixed(1);
};

// ── Table Component ─────────────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, dateRangeLabel }) => {
    const columns = [
        { label: "<=12days", key: "<=12days" },
        { label: "13-21days", key: "13-21days" },
        { label: "22-30days", key: "22-30days" },
        { label: ">30days", key: ">30days" },
        { label: "Pending", key: "Pending" },
        { label: "Total", key: "Total" },
        { label: "<12%", key: "<12%" },
        { label: "<13-21%", key: "<13-21%" },
        { label: "<22-30%", key: "<22-30%" },
        { label: ">30days%", key: ">30days%" },
    ];

    const colors = TECH_COLORS[tech];

    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const data =
        apiResponse?.data?.[tech]?.circles || {};

    const grandTotal =
        apiResponse?.data?.[tech]?.grand_total || {};

    const entries = Object.entries(data);

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
                    minWidth: 600,
                }}
            >
                <thead>
                    {/* Date Range Header */}
                    <tr>
                        <th
                            style={{
                                ...stickyCell,
                                background:
                                    colors.active,
                                color: "#efebeb",
                                fontSize: 14,
                                textAlign: "center",
                                fontWeight: 700,
                                zIndex: 3,
                            }}
                        ></th>

                        <th
                            colSpan={columns.length}
                            style={{
                                ...cellStyle,
                                background:
                                    colors.active,
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 14,
                                fontWeight: 700,
                            }}
                        >
                            {dateRangeLabel}
                        </th>
                    </tr>

                    {/* Column Headers */}
                    <tr
                        style={{
                            background:
                                colors.header,
                        }}
                    >
                        <th
                            style={{
                                ...stickyCell,
                                background:
                                    colors.header,
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
                                    background:
                                        colors.header,
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
                            {entries.map(
                                ([circle, val], idx) => (
                                    <tr
                                        key={circle}
                                        style={{
                                            background:
                                                idx %
                                                    2 ===
                                                    0
                                                    ? "#fff"
                                                    : STRIPE,
                                        }}
                                    >
                                        <td
                                            style={{
                                                ...stickyCell,
                                                background:
                                                    idx %
                                                        2 ===
                                                        0
                                                        ? "#fff"
                                                        : STRIPE,
                                                textAlign:
                                                    "center",
                                            }}
                                        >
                                            {circle}
                                        </td>

                                        {columns.map(
                                            (col) => (
                                                <td
                                                    key={
                                                        col.key
                                                    }
                                                    style={
                                                        cellStyle
                                                    }
                                                >
                                                    {val?.[
                                                        col
                                                            .key
                                                    ] ??
                                                        0}
                                                </td>
                                            )
                                        )}
                                    </tr>
                                )
                            )}

                            {/* Grand Total */}
                            <tr
                                style={{
                                    background:
                                        TOTAL_BG,
                                }}
                            >
                                <td
                                    style={{
                                        ...stickyCell,
                                        background:
                                            TOTAL_BG,
                                        fontWeight:
                                            700,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    Grand Total
                                </td>

                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        style={{
                                            ...cellStyle,
                                            fontWeight:
                                                700,
                                        }}
                                    >
                                        {formatGrandTotal(
                                            grandTotal?.[
                                            col.key
                                            ]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    1
                                }
                                style={{
                                    ...cellStyle,
                                    textAlign:
                                        "center",
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

// ── Main Component ──────────────────────────────────────────────────────────
const Datewise = () => {
    const { loading, action } =
        useLoadingDialog();

    const [apiResponse, setApiResponse] =
        useState(null);

    const [activeType, setActiveType] =
        useState("performance");

    const [activeTech, setActiveTech] =
        useState("4G");

    const [startDate, setStartDate] =
        useState(getDefaultStartDate());

    const [endDate, setEndDate] =
        useState(todayStr);

    // ── Fetch Data ────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!startDate || !endDate) return;

        if (startDate > endDate) return;

        try {
            action(true);

            const api =
                activeType === "performance"
                    ? "performance_idploy/generate-performance/"
                    : "performance_idploy/generate-offered/";

            const formData = new FormData();

            formData.append(
                "start_date",
                startDate
            );

            formData.append(
                "end_date",
                endDate
            );

            const res = await postData(
                api,
                formData
            );

            if (res?.status) {
                setApiResponse(res);
            }
        } catch (error) {
            console.log(
                "Fetch Error : ",
                error
            );
        } finally {
            action(false);
        }
    };

    // ── Debounced API Call ────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);

    }, [activeType, startDate, endDate]);

    // ── Download ──────────────────────────────────────────────────────────
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

    const dateRangeLabel =
        startDate && endDate
            ? `${startDate} to ${endDate}`
            : "";

    return (
        <Box p={1}>
            {/* ── Top Bar ───────────────────────────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >
                {/* Left Side */}
                <Box>
                    <Typography variant="h5">
                        {activeType ===
                            "performance"
                            ? "Performance vs OA TAT"
                            : "Offered vs OA TAT"}
                    </Typography>

                    <Box
                        mt={1}
                        display="flex"
                        gap={1}
                    >
                        <Button
                            size="small"
                            onClick={() =>
                                setActiveType(
                                    "performance"
                                )
                            }
                            variant={
                                activeType ===
                                    "performance"
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            Performance
                        </Button>

                        <Button
                            size="small"
                            onClick={() =>
                                setActiveType(
                                    "offered"
                                )
                            }
                            variant={
                                activeType ===
                                    "offered"
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            Offered
                        </Button>
                    </Box>
                </Box>

                {/* Right Side */}
                <Box
                    display="flex"
                    gap={1}
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <TextField
                        size="small"
                        label="From Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                            if (
                                e.target.value <=
                                todayStr
                            ) {
                                setStartDate(
                                    e.target.value
                                );
                            }
                        }}
                        inputProps={{
                            max:
                                endDate ||
                                todayStr,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: 155,
                        }}
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        ~
                    </Typography>

                    <TextField
                        size="small"
                        label="To Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                            if (
                                e.target.value <=
                                todayStr
                            ) {
                                setEndDate(
                                    e.target.value
                                );
                            }
                        }}
                        inputProps={{
                            min: startDate,
                            max: todayStr,
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{
                            minWidth: 155,
                        }}
                    />

                    {/* Download */}
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

            {/* ── Technology Tabs ─────────────────────────────────── */}
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
                        activeTech ===
                        tab.key;

                    const tColor =
                        TECH_COLORS[tab.key];

                    return (
                        <Box
                            key={tab.key}
                            onClick={() =>
                                setActiveTech(
                                    tab.key
                                )
                            }
                            sx={{
                                px: 3,
                                py: 1,
                                cursor:
                                    "pointer",
                                fontWeight:
                                    isActive
                                        ? 700
                                        : 500,
                                color: isActive
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

            {/* ── Table ───────────────────────────────────────────── */}
            <TechTable
                tech={activeTech}
                apiResponse={apiResponse}
                dateRangeLabel={
                    dateRangeLabel
                }
            />

            {loading}
        </Box>
    );
};

export const MemoDatewise =
    React.memo(Datewise);