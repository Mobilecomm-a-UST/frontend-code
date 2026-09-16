import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Typography,
    Avatar,
    IconButton,
    Stack,
    CircularProgress,
    Breadcrumbs,
    Link,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CellTowerIcon from "@mui/icons-material/CellTower";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InboxIcon from "@mui/icons-material/Inbox";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Config — same pattern as the Daily Task Review dashboard:          */
/*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

/* ------------------------------------------------------------------ */
/*  Colors — teal theme, matching the sidebar (#006e74) with gradient  */
/* ------------------------------------------------------------------ */
const C = {
    corner: "#004d52",       // top-left / dark teal
    headerBg: "#00838f",     // column header medium teal
    labelOdd: "#dbf2f2",     // circle label column - light teal
    labelEven: "#eef9f9",    // circle label column - lighter teal
    grandTotalBg: "#c9f7d6", // total row green
    grandTotalText: "#0b6b3a",
    zeroText: "#b7bfc9",
    valueText: "#0d3a3c",
    border: "#c3cbd6",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

const PAGE_BG = "#fdece0"; // warm peach/orange page background

/* ------------------------------------------------------------------ */
/*  Month / Year helpers                                                */
/*  IMPORTANT: the backend expects "month" as a NUMBER (1–12), not a   */
/*  month name string. We still show readable names in the dropdown,   */
/*  but the value stored in state (and sent to the API) is numeric —   */
/*  e.g. selecting "July" sends month=7, "August" sends month=8.       */
/* ------------------------------------------------------------------ */
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const defaultMonth = () => new Date().getMonth() + 1; // 1–12
const defaultYear = () => new Date().getFullYear();

// UPDATED: year range expanded from 2000 to 2050
const YEARS = Array.from({ length: 51 }, (_, i) => 2000 + i); // 2000–2050

const ROW_H = 37; // approx header row height, used for sticky offset of 2nd header row

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const getCols = (rows, labelKey) =>
    rows && rows.length
        ? Object.keys(rows[0]).filter((k) => k !== labelKey && k !== "Grand Total")
        : [];

const todayLabel = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

/* ------------------------------------------------------------------ */
/*  No data placeholder                                                 */
/* ------------------------------------------------------------------ */
function NoData({ label = "No data found", compact = false }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                py: compact ? 4 : 8,
                color: "#94a3b8",
            }}
        >
            <InboxIcon sx={{ fontSize: compact ? 30 : 42 }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {label}
            </Typography>
        </Box>
    );
}

/* ------------------------------------------------------------------ */
/*  Excel-style matrix table (matches the reference screenshots)        */
/*  UPDATED: the static "today" date row above the column headers has  */
/*  been removed — the table now starts directly with the label +      */
/*  column header row, since the period is now driven by the Month /   */
/*  Year filter above the tables instead of a hardcoded date.          */
/* ------------------------------------------------------------------ */
function MatrixTable({ title, rows, labelKey, icon }) {
    const cols = getCols(rows, labelKey);
    const hasData = Array.isArray(rows) && rows.length > 0;

    return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    background: HEADER_GRADIENT,
                }}
            >
                {icon}
                <Typography
                    variant="subtitle2"
                    sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
                >
                    {title}
                </Typography>
            </Box>

            {!hasData ? (
                <NoData compact />
            ) : (
                <TableContainer sx={{ maxHeight: 460 }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={{
                            borderCollapse: "collapse",
                            "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75 },
                        }}
                    >
                        <TableHead>
                            {/* UPDATED: single header row only — the previous "today" date row
                                above this has been removed. Period is now controlled by the
                                Month / Year filter above the tables. */}
                            <TableRow>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 0,
                                        top: 0,
                                        zIndex: 6,
                                        bgcolor: C.corner,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 110,
                                    }}
                                >
                                    {labelKey}
                                </TableCell>
                                {cols.map((c) => (
                                    <TableCell
                                        key={c}
                                        align="center"
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 4,
                                            bgcolor: C.headerBg,
                                            color: "#fff",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {c}
                                    </TableCell>
                                ))}
                                <TableCell
                                    align="center"
                                    sx={{
                                        position: "sticky",
                                        top: 0,
                                        right: 0,
                                        zIndex: 5,
                                        bgcolor: C.corner,
                                        color: "#fff",
                                        fontWeight: 700,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Grand Total
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const isGrandTotal = row[labelKey] === "Grand Total" || row[labelKey] === "Total";
                                const labelBg = isGrandTotal ? C.grandTotalBg : i % 2 === 0 ? C.labelOdd : C.labelEven;

                                return (
                                    <TableRow key={row[labelKey] ?? i}>
                                        <TableCell
                                            sx={{
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                bgcolor: labelBg,
                                                fontWeight: 700,
                                                color: isGrandTotal ? C.grandTotalText : C.corner,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row[labelKey]}
                                        </TableCell>
                                        {cols.map((c) => {
                                            const val = row[c] ?? 0;
                                            return (
                                                <TableCell
                                                    key={c}
                                                    align="center"
                                                    sx={{
                                                        bgcolor: isGrandTotal ? C.grandTotalBg : "#ffffff",
                                                        fontVariantNumeric: "tabular-nums",
                                                        color: val === 0 ? C.zeroText : isGrandTotal ? C.grandTotalText : C.valueText,
                                                        fontWeight: val === 0 ? 400 : 700,
                                                    }}
                                                >
                                                    {val}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell
                                            align="center"
                                            sx={{
                                                position: "sticky",
                                                right: 0,
                                                bgcolor: isGrandTotal ? C.grandTotalBg : C.labelOdd,
                                                fontVariantNumeric: "tabular-nums",
                                                color: isGrandTotal ? C.grandTotalText : C.corner,
                                                fontWeight: 800,
                                            }}
                                        >
                                            {row["Grand Total"] ?? 0}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}

/* ================================================================ */
/*  Main Dashboard                                                   */
/* ================================================================ */
function Vi_Hoto() {
    const navigate = useNavigate();

    const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
    const [dashboard, setDashboard] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // UPDATED: Month / Year filter state — defaults to the current month/year.
    // month is stored as a NUMBER (1–12), year as a NUMBER.
    const [selectedMonth, setSelectedMonth] = useState(defaultMonth());
    const [selectedYear, setSelectedYear] = useState(defaultYear());

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const params = new URLSearchParams({
                month: selectedMonth,
                year: selectedYear,
            });

            const res = await fetch(`${BASE_URL}${API_PATH}?${params.toString()}`);
            const json = await res.json();

            if (!json || !json.dashboard) {
                setDashboard(null);
                setDownloadLink(null);
            } else {
                setDashboard(json.dashboard);
                setDownloadLink(json.download_link ?? null);
            }
        } catch (e) {
            console.error("Vi_Hoto fetchDashboard:", e);
            setError(true);
            setDashboard(null);
            setDownloadLink(null);
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const circleStatus = dashboard?.["circle status"];
    const circlePendingBucket = dashboard?.["circle pending bucket"];
    const oemStatus = dashboard?.["ageing wise pending bucket"];
    const oemPendingBucket = dashboard?.["oem wise pending bucket"];

    const hasAnyData = !!dashboard;

    // Shared sx for the dark-header Select controls
    const controlSx = {
        bgcolor: "rgba(255,255,255,0.08)",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            "&.Mui-focused fieldset": { borderColor: "#4fa3a8" },
        },
        "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
        "& .MuiSvgIcon-root": { color: "#fff" },
    };

    return (
        <Slide direction="left" in="true" timeout={1000}>
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        itemsBeforeCollapse={2}
                        maxItems={3}
                        separator={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <Link underline="hover" onClick={() => navigate("/tools")}>
                            Tools
                        </Link>
                        <Link underline="hover" onClick={() => navigate("/tools/ix_tools")}>
                            IX Tools
                        </Link>
                        <Link underline="hover" onClick={() => navigate("/tools/ix_tools/Vi_Hoto")}>
                            VI Tracker
                        </Link>
                        <Typography color="text.primary">VI Hoto Dashboard</Typography>
                    </Breadcrumbs>
                </div>

                <Box sx={{ minHeight: "100%", width: "100%", fontFamily: "Roboto, sans-serif" }}>
                    <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                        {/* Header — UPDATED: teal gradient replacing the previous navy/blue gradient */}
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 2,
                                mb: 3,
                                background: HEADER_GRADIENT,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
                                    <LayersIcon sx={{ color: "#bfe9e9" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
                                        VI HOTO Dashboard
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Month / Year filters */}
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                <FormControl size="small" sx={{ minWidth: 140, ...controlSx }}>
                                    <InputLabel id="hoto-month-label">Month</InputLabel>
                                    <Select
                                        labelId="hoto-month-label"
                                        label="Month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {MONTHS.map((m, idx) => (
                                            <MenuItem key={m} value={idx + 1}>
                                                {m}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 110, ...controlSx }}>
                                    <InputLabel id="hoto-year-label">Year</InputLabel>
                                    <Select
                                        labelId="hoto-year-label"
                                        label="Year"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        {YEARS.map((y) => (
                                            <MenuItem key={y} value={y}>
                                                {y}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
                                    <span>
                                        <IconButton
                                            component={downloadLink ? "a" : "button"}
                                            href={downloadLink || undefined}
                                            disabled={!downloadLink}
                                            sx={{
                                                color: "#bfe9e9",
                                                bgcolor: "rgba(255,255,255,0.08)",
                                                "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                                                "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                                            }}
                                        >
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Stack>
                        </Paper>

                        {/* Loading state */}
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                <CircularProgress size={32} sx={{ color: C.corner }} />
                            </Box>
                        )}

                        {/* Error / no data state */}
                        {!loading && (error || !hasAnyData) && (
                            <Paper elevation={1} sx={{ borderRadius: 2 }}>
                                <NoData label={error ? "No data found — could not reach the server" : "No data found"} />
                            </Paper>
                        )}

                        {/* Content */}
                        {!loading && !error && hasAnyData && (
                            <>
                                {/* Tabs — UPDATED: selected tab background now teal instead of navy */}
                                <Paper elevation={1} sx={{ display: "inline-flex", borderRadius: 2, mb: 3, p: 0.5 }}>
                                    <Tabs
                                        value={tab}
                                        onChange={(_, v) => setTab(v)}
                                        sx={{
                                            minHeight: 36,
                                            "& .MuiTabs-indicator": { display: "none" },
                                        }}
                                    >
                                        <Tab
                                            icon={<CellTowerIcon sx={{ fontSize: 16 }} />}
                                            iconPosition="start"
                                            label="Circle View"
                                            sx={{
                                                minHeight: 36,
                                                textTransform: "none",
                                                fontWeight: 600,
                                                fontSize: 13,
                                                borderRadius: 1.5,
                                                mr: 0.5,
                                                ...(tab === 0 && { bgcolor: "#006e74", color: "#fff !important" }),
                                            }}
                                        />
                                        <Tab
                                            icon={<ApartmentIcon sx={{ fontSize: 16 }} />}
                                            iconPosition="start"
                                            label="OEM View"
                                            sx={{
                                                minHeight: 36,
                                                textTransform: "none",
                                                fontWeight: 600,
                                                fontSize: 13,
                                                borderRadius: 1.5,
                                                ...(tab === 1 && { bgcolor: "#006e74", color: "#fff !important" }),
                                            }}
                                        />
                                    </Tabs>
                                </Paper>

                                {/* Tables stacked one below the other, full width */}
                                <Stack spacing={3}>
                                    {tab === 0 ? (
                                        <>
                                            <MatrixTable
                                                title="Circle-wise Status"
                                                rows={circleStatus}
                                                labelKey="Status"
                                                icon={<CellTowerIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                            />
                                            <MatrixTable
                                                title="Circle-wise Pending Bucket"
                                                rows={circlePendingBucket}
                                                labelKey="Pending Bucket"
                                                icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <MatrixTable
                                                title="Ageing wise Dashboard"
                                                rows={oemStatus}
                                                labelKey="Pending Bucket"
                                                icon={<ApartmentIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                            />
                                            <MatrixTable
                                                title="OEM-wise Pending Bucket"
                                                rows={oemPendingBucket}
                                                labelKey="Pending Bucket"
                                                icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                            />
                                        </>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
}

export default Vi_Hoto;


// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Tabs,
//     Tab,
//     Typography,
//     Avatar,
//     IconButton,
//     Stack,
//     CircularProgress,
//     Breadcrumbs,
//     Link,
//     Tooltip,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
// } from "@mui/material";
// import LayersIcon from "@mui/icons-material/Layers";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CellTowerIcon from "@mui/icons-material/CellTower";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import InboxIcon from "@mui/icons-material/Inbox";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import Slide from "@mui/material/Slide";
// import { useNavigate } from "react-router-dom";

// /* ------------------------------------------------------------------ */
// /*  Config — same pattern as the Daily Task Review dashboard:          */
// /*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
// /* ------------------------------------------------------------------ */
// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// // const API_PATH = "ix_tracker_vi/HOTO_dashboard/";
// const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

// /* ------------------------------------------------------------------ */
// /*  Colors — updated to a teal palette matching the sidebar (#006e74)  */
// /*  with a subtle gradient, replacing the previous navy/blue theme.    */
// /* ------------------------------------------------------------------ */
// const C = {
//     corner: "#004d52",       // top-left / dark teal
//     headerBg: "#00838f",     // column header medium teal
//     labelOdd: "#dbf2f2",     // circle label column - light teal
//     labelEven: "#eef9f9",    // circle label column - lighter teal
//     grandTotalBg: "#c9f7d6", // total row green (kept for semantic contrast)
//     grandTotalText: "#0b6b3a",
//     zeroText: "#b7bfc9",
//     valueText: "#0d3a3c",
//     border: "#c3cbd6",
// };

// const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// const PAGE_BG = "#fdece0"; // warm peach/orange page background (unchanged)

// /* ------------------------------------------------------------------ */
// /*  Month / Year filter options                                        */
// /* ------------------------------------------------------------------ */
// const MONTHS = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
// ];

// const currentYear = new Date().getFullYear();
// const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i); // 3 years back, 2 years forward

// const daysInMonth = (monthIndex, year) => new Date(year, monthIndex + 1, 0).getDate();

// const pad2 = (n) => String(n).padStart(2, "0");

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */
// const getCols = (rows, labelKey) =>
//     rows && rows.length
//         ? Object.keys(rows[0]).filter((k) => k !== labelKey && k !== "Grand Total")
//         : [];

// /* ------------------------------------------------------------------ */
// /*  No data placeholder                                                 */
// /* ------------------------------------------------------------------ */
// function NoData({ label = "No data found", compact = false }) {
//     return (
//         <Box
//             sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: 1,
//                 py: compact ? 4 : 8,
//                 color: "#94a3b8",
//             }}
//         >
//             <InboxIcon sx={{ fontSize: compact ? 30 : 42 }} />
//             <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                 {label}
//             </Typography>
//         </Box>
//     );
// }

// /* ------------------------------------------------------------------ */
// /*  Excel-style matrix table (matches the reference screenshots)        */
// /*  UPDATED: the static "today" date row above the column headers has  */
// /*  been removed — the table now starts directly with the label +      */
// /*  column header row, since the period is now driven by the Month /   */
// /*  Year filter above the tables instead of a hardcoded date.          */
// /* ------------------------------------------------------------------ */
// function MatrixTable({ title, rows, labelKey, icon }) {
//     const cols = getCols(rows, labelKey);
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     return (
//         <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     px: 2,
//                     py: 1.25,
//                     background: HEADER_GRADIENT,
//                 }}
//             >
//                 {icon}
//                 <Typography
//                     variant="subtitle2"
//                     sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
//                 >
//                     {title}
//                 </Typography>
//             </Box>

//             {!hasData ? (
//                 <NoData compact />
//             ) : (
//                 <TableContainer sx={{ maxHeight: 460 }}>
//                     <Table
//                         size="small"
//                         stickyHeader
//                         sx={{
//                             borderCollapse: "collapse",
//                             "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75 },
//                         }}
//                     >
//                         <TableHead>
//                             {/* UPDATED: single header row only — the previous "today" date row
//                                 above this has been removed. Period is now controlled by the
//                                 Month / Year filter above the tables. */}
//                             <TableRow>
//                                 <TableCell
//                                     sx={{
//                                         position: "sticky",
//                                         left: 0,
//                                         top: 0,
//                                         zIndex: 6,
//                                         bgcolor: C.corner,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 110,
//                                     }}
//                                 >
//                                     {labelKey}
//                                 </TableCell>
//                                 {cols.map((c) => (
//                                     <TableCell
//                                         key={c}
//                                         align="center"
//                                         sx={{
//                                             position: "sticky",
//                                             top: 0,
//                                             zIndex: 4,
//                                             bgcolor: C.headerBg,
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             whiteSpace: "nowrap",
//                                         }}
//                                     >
//                                         {c}
//                                     </TableCell>
//                                 ))}
//                                 <TableCell
//                                     align="center"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         right: 0,
//                                         zIndex: 5,
//                                         bgcolor: C.corner,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         whiteSpace: "nowrap",
//                                     }}
//                                 >
//                                     Grand Total
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {rows.map((row, i) => {
//                                 const isGrandTotal = row[labelKey] === "Grand Total" || row[labelKey] === "Total";
//                                 const labelBg = isGrandTotal ? C.grandTotalBg : i % 2 === 0 ? C.labelOdd : C.labelEven;

//                                 return (
//                                     <TableRow key={row[labelKey] ?? i}>
//                                         <TableCell
//                                             sx={{
//                                                 position: "sticky",
//                                                 left: 0,
//                                                 zIndex: 2,
//                                                 bgcolor: labelBg,
//                                                 fontWeight: 700,
//                                                 color: isGrandTotal ? C.grandTotalText : C.corner,
//                                                 whiteSpace: "nowrap",
//                                             }}
//                                         >
//                                             {row[labelKey]}
//                                         </TableCell>
//                                         {cols.map((c) => {
//                                             const val = row[c] ?? 0;
//                                             return (
//                                                 <TableCell
//                                                     key={c}
//                                                     align="center"
//                                                     sx={{
//                                                         bgcolor: isGrandTotal ? C.grandTotalBg : "#ffffff",
//                                                         fontVariantNumeric: "tabular-nums",
//                                                         color: val === 0 ? C.zeroText : isGrandTotal ? C.grandTotalText : C.valueText,
//                                                         fontWeight: val === 0 ? 400 : 700,
//                                                     }}
//                                                 >
//                                                     {val}
//                                                 </TableCell>
//                                             );
//                                         })}
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 position: "sticky",
//                                                 right: 0,
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : C.labelOdd,
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal ? C.grandTotalText : C.corner,
//                                                 fontWeight: 800,
//                                             }}
//                                         >
//                                             {row["Grand Total"] ?? 0}
//                                         </TableCell>
//                                     </TableRow>
//                                 );
//                             })}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}
//         </Paper>
//     );
// }

// /* ------------------------------------------------------------------ */
// /*  ADDED: Month / Year filter bar — dark teal box matching the        */
// /*  reference screenshot, drives from_date / till_date / period below. */
// /* ------------------------------------------------------------------ */
// function MonthYearFilter({ month, year, onMonthChange, onYearChange, onApply, loading }) {
//     return (
//         <Paper
//             elevation={2}
//             sx={{
//                 display: "inline-flex",
//                 alignItems: "flex-end",
//                 gap: 2,
//                 px: 2.5,
//                 py: 1.5,
//                 borderRadius: 2,
//                 mb: 3,
//                 background: HEADER_GRADIENT,
//             }}
//         >
//             <FormControl size="small" sx={{ minWidth: 140 }}>
//                 <InputLabel sx={{ color: "rgba(255,255,255,0.8)", "&.Mui-focused": { color: "#fff" } }}>
//                     Month
//                 </InputLabel>
//                 <Select
//                     label="Month"
//                     value={month}
//                     onChange={(e) => onMonthChange(e.target.value)}
//                     sx={{
//                         color: "#fff",
//                         bgcolor: "rgba(255,255,255,0.08)",
//                         borderRadius: 1,
//                         "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" },
//                         "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
//                         "& .MuiSvgIcon-root": { color: "#fff" },
//                     }}
//                 >
//                     {MONTHS.map((m) => (
//                         <MenuItem key={m} value={m}>{m}</MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             <FormControl size="small" sx={{ minWidth: 110 }}>
//                 <InputLabel sx={{ color: "rgba(255,255,255,0.8)", "&.Mui-focused": { color: "#fff" } }}>
//                     Year
//                 </InputLabel>
//                 <Select
//                     label="Year"
//                     value={year}
//                     onChange={(e) => onYearChange(e.target.value)}
//                     sx={{
//                         color: "#fff",
//                         bgcolor: "rgba(255,255,255,0.08)",
//                         borderRadius: 1,
//                         "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.4)" },
//                         "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
//                         "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#fff" },
//                         "& .MuiSvgIcon-root": { color: "#fff" },
//                     }}
//                 >
//                     {YEARS.map((y) => (
//                         <MenuItem key={y} value={y}>{y}</MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>

//             <Tooltip title="Apply filter">
//                 <span>
//                     <IconButton
//                         onClick={onApply}
//                         disabled={loading}
//                         sx={{
//                             color: "#fff",
//                             bgcolor: "rgba(255,255,255,0.12)",
//                             "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
//                             mb: 0.25,
//                         }}
//                     >
//                         <RefreshIcon sx={{ animation: loading ? "spin 0.8s linear infinite" : "none", "@keyframes spin": { to: { transform: "rotate(360deg)" } } }} />
//                     </IconButton>
//                 </span>
//             </Tooltip>
//         </Paper>
//     );
// }

// /* ------------------------------------------------------------------ */
// /*  Main Dashboard                                                      */
// /* ------------------------------------------------------------------ */
// function Vi_Hoto() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
//     const [dashboard, setDashboard] = useState(null);
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     // ADDED: Month / Year filter state — defaults to the current month/year.
//     const now = new Date();
//     const [selectedMonth, setSelectedMonth] = useState(MONTHS[now.getMonth()]);
//     const [selectedYear, setSelectedYear] = useState(now.getFullYear());

//     // ADDED: builds from_date / till_date / data_contains_period for the
//     // selected month & year, and calls the API with them as query params.
//     const fetchDashboard = useCallback(async (month = selectedMonth, year = selectedYear) => {
//         setLoading(true);
//         setError(false);
//         try {
//             const monthIndex = MONTHS.indexOf(month);
//             const lastDay = daysInMonth(monthIndex, year);

//             // If the selected month/year is the current month, cap till_date
//             // at today instead of the last day of the month (so "pending as
//             // of today" style dashboards don't look ahead into the future).
//             const isCurrentMonth = monthIndex === now.getMonth() && year === now.getFullYear();
//             const effectiveTillDay = isCurrentMonth ? now.getDate() : lastDay;

//             const from_date = `${year}-${pad2(monthIndex + 1)}-01`;
//             const till_date = `${year}-${pad2(monthIndex + 1)}-${pad2(effectiveTillDay)}`;
//             const data_contains_period = `${month}-${year}`;

//             console.log("From DATE:", from_date);
//             console.log("To DAY DATE:", till_date);
//             console.log("DATA PERIOD:", data_contains_period);

//             const params = new URLSearchParams({ from_date, till_date, data_contains_period });
//             const res = await fetch(`${BASE_URL}${API_PATH}?${params.toString()}`);
//             const json = await res.json();

//             if (!json || !json.dashboard) {
//                 setDashboard(null);
//                 setDownloadLink(null);
//             } else {
//                 setDashboard(json.dashboard);
//                 setDownloadLink(json.download_link ?? null);
//             }
//         } catch (e) {
//             console.error("Vi_Hoto fetchDashboard:", e);
//             setError(true);
//             setDashboard(null);
//             setDownloadLink(null);
//         } finally {
//             setLoading(false);
//         }
//     }, [selectedMonth, selectedYear]);

//     useEffect(() => {
//         fetchDashboard();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const handleApplyFilter = () => {
//         fetchDashboard(selectedMonth, selectedYear);
//     };

//     const circleStatus = dashboard?.["circle status"];
//     const circlePendingBucket = dashboard?.["circle pending bucket"];
//     const oemStatus = dashboard?.["ageing wise pending bucket"];
//     const oemPendingBucket = dashboard?.["oem wise pending bucket"];

//     const hasAnyData = !!dashboard;

//     return (
//         <Slide direction="left" in="true" timeout={1000}>
//             <div>
//                 <div style={{ margin: 10, marginLeft: 10 }}>
//                     <Breadcrumbs
//                         aria-label="breadcrumb"
//                         itemsBeforeCollapse={2}
//                         maxItems={3}
//                         separator={<KeyboardArrowRightIcon fontSize="small" />}
//                     >
//                         <Link underline="hover" onClick={() => navigate("/tools")}>
//                             Tools
//                         </Link>
//                         <Link underline="hover" onClick={() => navigate("/tools/ix_tools")}>
//                             IX Tools
//                         </Link>
//                         <Link underline="hover" onClick={() => navigate("/tools/ix_tools/Vi_Hoto")}>
//                             VI Tracker
//                         </Link>
//                         <Typography color="text.primary">VI Hoto Dashboard</Typography>
//                     </Breadcrumbs>
//                 </div>

//                 <Box sx={{ minHeight: "100%", width: "100%", fontFamily: "Roboto, sans-serif" }}>
//                     <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
//                         {/* Header — UPDATED: teal gradient replacing the previous navy/blue gradient */}
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 borderRadius: 2,
//                                 px: 2.5,
//                                 py: 2,
//                                 mb: 3,
//                                 background: HEADER_GRADIENT,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 gap: 2,
//                             }}
//                         >
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                                 <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
//                                     <LayersIcon sx={{ color: "#bfe9e9" }} />
//                                 </Avatar>
//                                 <Box>
//                                     <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
//                                         VI HOTO Dashboard
//                                     </Typography>
//                                 </Box>
//                             </Stack>

//                             <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
//                                 <span>
//                                     <IconButton
//                                         component={downloadLink ? "a" : "button"}
//                                         href={downloadLink || undefined}
//                                         disabled={!downloadLink}
//                                         sx={{
//                                             color: "#bfe9e9",
//                                             bgcolor: "rgba(255,255,255,0.08)",
//                                             "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
//                                             "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
//                                         }}
//                                     >
//                                         <FileDownloadIcon />
//                                     </IconButton>
//                                 </span>
//                             </Tooltip>
//                         </Paper>

//                         {/* ADDED: Month / Year filter bar */}
//                         <MonthYearFilter
//                             month={selectedMonth}
//                             year={selectedYear}
//                             onMonthChange={setSelectedMonth}
//                             onYearChange={setSelectedYear}
//                             onApply={handleApplyFilter}
//                             loading={loading}
//                         />

//                         {/* Loading state */}
//                         {loading && (
//                             <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//                                 <CircularProgress size={32} sx={{ color: C.corner }} />
//                             </Box>
//                         )}

//                         {/* Error / no data state */}
//                         {!loading && (error || !hasAnyData) && (
//                             <Paper elevation={1} sx={{ borderRadius: 2 }}>
//                                 <NoData label={error ? "No data found — could not reach the server" : "No data found"} />
//                             </Paper>
//                         )}

//                         {/* Content */}
//                         {!loading && !error && hasAnyData && (
//                             <>
//                                 {/* Tabs — UPDATED: selected tab background now teal instead of navy */}
//                                 <Paper elevation={1} sx={{ display: "inline-flex", borderRadius: 2, mb: 3, p: 0.5 }}>
//                                     <Tabs
//                                         value={tab}
//                                         onChange={(_, v) => setTab(v)}
//                                         sx={{
//                                             minHeight: 36,
//                                             "& .MuiTabs-indicator": { display: "none" },
//                                         }}
//                                     >
//                                         <Tab
//                                             icon={<CellTowerIcon sx={{ fontSize: 16 }} />}
//                                             iconPosition="start"
//                                             label="Circle View"
//                                             sx={{
//                                                 minHeight: 36,
//                                                 textTransform: "none",
//                                                 fontWeight: 600,
//                                                 fontSize: 13,
//                                                 borderRadius: 1.5,
//                                                 mr: 0.5,
//                                                 ...(tab === 0 && { bgcolor: "#006e74", color: "#fff !important" }),
//                                             }}
//                                         />
//                                         <Tab
//                                             icon={<ApartmentIcon sx={{ fontSize: 16 }} />}
//                                             iconPosition="start"
//                                             label="OEM View"
//                                             sx={{
//                                                 minHeight: 36,
//                                                 textTransform: "none",
//                                                 fontWeight: 600,
//                                                 fontSize: 13,
//                                                 borderRadius: 1.5,
//                                                 ...(tab === 1 && { bgcolor: "#006e74", color: "#fff !important" }),
//                                             }}
//                                         />
//                                     </Tabs>
//                                 </Paper>

//                                 {/* Tables stacked one below the other, full width */}
//                                 <Stack spacing={3}>
//                                     {tab === 0 ? (
//                                         <>
//                                             <MatrixTable
//                                                 title="Circle-wise Status"
//                                                 rows={circleStatus}
//                                                 labelKey="Status"
//                                                 icon={<CellTowerIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="Circle-wise Pending Bucket"
//                                                 rows={circlePendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     ) : (
//                                         <>
//                                             <MatrixTable
//                                                 title="Ageing wise Dashboard"
//                                                 rows={oemStatus}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<ApartmentIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="OEM-wise Pending Bucket"
//                                                 rows={oemPendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     )}
//                                 </Stack>
//                             </>
//                         )}
//                     </Box>
//                 </Box>
//             </div>
//         </Slide>
//     );
// }

// export default Vi_Hoto;