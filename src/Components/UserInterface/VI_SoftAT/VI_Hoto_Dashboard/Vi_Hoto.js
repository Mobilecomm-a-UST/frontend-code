


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
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CellTowerIcon from "@mui/icons-material/CellTower";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InboxIcon from "@mui/icons-material/Inbox";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Config — same pattern as the Daily Task Review dashboard:          */
/*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// const API_PATH = "ix_tracker_vi/HOTO_dashboard/";
const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

/* ------------------------------------------------------------------ */
/*  Colors — matched to the Excel-style reference screenshots          */
/* ------------------------------------------------------------------ */
const C = {
    corner: "#2e4463",       // top-left / date-row dark navy
    headerBg: "#4d8fd1",     // column header medium blue
    labelOdd: "#dbe9f8",     // circle label column - light blue
    labelEven: "#eef4fb",    // circle label column - lighter blue
    grandTotalBg: "#c9f7d6", // total row green
    grandTotalText: "#0b6b3a",
    zeroText: "#b7bfc9",
    valueText: "#1a2f52",
    border: "#c3cbd6",
};

const PAGE_BG = "#fdece0"; // warm peach/orange page background (replaces bluish tone)

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
                    background: "linear-gradient(90deg, #446698 0%, #173d73 100%)",
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
                            {/* date row */}
                            <TableRow>
                                <TableCell
                                    rowSpan={2}
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
                                <TableCell
                                    colSpan={cols.length + 1}
                                    align="right"
                                    sx={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 4,
                                        bgcolor: C.corner,
                                        color: "#fff",
                                        fontWeight: 700,
                                    }}
                                >
                                    {todayLabel()}
                                </TableCell>
                            </TableRow>
                            {/* column header row */}
                            <TableRow>
                                {cols.map((c) => (
                                    <TableCell
                                        key={c}
                                        align="center"
                                        sx={{
                                            position: "sticky",
                                            top: ROW_H,
                                            zIndex: 3,
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
                                        top: ROW_H,
                                        right: 0,
                                        zIndex: 4,
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

/* ------------------------------------------------------------------ */
/*  Main Dashboard                                                      */
/* ------------------------------------------------------------------ */
function Vi_Hoto() {
    const navigate = useNavigate();

    const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
    const [dashboard, setDashboard] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${BASE_URL}${API_PATH}`);
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
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const circleStatus = dashboard?.["circle status"];
    const circlePendingBucket = dashboard?.["circle pending bucket"];
    const oemStatus = dashboard?.["ageing wise pending bucket"];
    const oemPendingBucket = dashboard?.["oem wise pending bucket"];

    const hasAnyData = !!dashboard;

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
                        {/* Header */}
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 2,
                                mb: 3,
                                background: "linear-gradient(90deg, #0a1f3d 0%, #446698 0%, #173d73 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
                                    <LayersIcon sx={{ color: "#7dd3fc" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
                                        VI HOTO Dashboard
                                    </Typography>
                                    {/* <Typography variant="caption" sx={{ color: "rgba(186,230,253,0.8)" }}>
                                        Integration Tracker VI — Handover / Takeover Status
                                    </Typography> */}
                                </Box>
                            </Stack>

                            <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
                                <span>
                                    <IconButton
                                        component={downloadLink ? "a" : "button"}
                                        href={downloadLink || undefined}
                                        disabled={!downloadLink}
                                        sx={{
                                            color: "#7dd3fc",
                                            bgcolor: "rgba(255,255,255,0.08)",
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                                            "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
                                        }}
                                    >
                                        <FileDownloadIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Paper>

                        {/* Loading state */}
                        {loading && (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                                <CircularProgress size={32} sx={{ color: "#0f2a52" }} />
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
                                {/* Tabs */}
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
                                                ...(tab === 0 && { bgcolor: "#0f2a52", color: "#fff !important" }),
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
                                                ...(tab === 1 && { bgcolor: "#0f2a52", color: "#fff !important" }),
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
                                                icon={<CellTowerIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                            />
                                            <MatrixTable
                                                title="Circle-wise Pending Bucket"
                                                rows={circlePendingBucket}
                                                labelKey="Pending Bucket"
                                                icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <MatrixTable
                                                title="Ageing wise Dashboard"
                                                rows={oemStatus}
                                                labelKey="Pending Bucket"
                                                icon={<ApartmentIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                            />
                                            <MatrixTable
                                                title="OEM-wise Pending Bucket"
                                                rows={oemPendingBucket}
                                                labelKey="Pending Bucket"
                                                icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                            />
                                        </>
                                    )}
                                </Stack>

                                {/* <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 4 }}>
                                    Data source: backend API · Live snapshot
                                </Typography> */}
                            </>
                        )}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
}

export default Vi_Hoto;

// import React, { useState, useEffect, useCallback, useRef } from "react";
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
//     TextField,
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
// /*  Colors — matched to the Excel-style reference screenshots          */
// /* ------------------------------------------------------------------ */
// const C = {
//     corner: "#2e4463",       // top-left / date-row dark navy
//     headerBg: "#4d8fd1",     // column header medium blue
//     labelOdd: "#dbe9f8",     // circle label column - light blue
//     labelEven: "#eef4fb",    // circle label column - lighter blue
//     grandTotalBg: "#c9f7d6", // total row green
//     grandTotalText: "#0b6b3a",
//     zeroText: "#b7bfc9",
//     valueText: "#1a2f52",
//     border: "#c3cbd6",
// };

// const PAGE_BG = "#fdece0"; // warm peach/orange page background (replaces bluish tone)

// /* ------------------------------------------------------------------ */
// /*  Month / Year helpers                                                */
// /*  IMPORTANT: the backend expects "month" as a NUMBER (1–12), not a   */
// /*  month name string. We still show readable names in the dropdown,   */
// /*  but the value stored in state (and sent to the API) is numeric —   */
// /*  e.g. selecting "July" sends month=7, "August" sends month=8.       */
// /* ------------------------------------------------------------------ */
// const MONTHS = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
// ];

// const defaultMonth = () => new Date().getMonth() + 1; // 1–12
// const defaultYear = () => String(new Date().getFullYear());

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
//                     background: "linear-gradient(90deg, #446698 0%, #173d73 100%)",
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
//                             {/* single header row — month-wise data, no "today" date row */}
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
//                                             zIndex: 3,
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
//                                         zIndex: 4,
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
// /*  Main Dashboard                                                      */
// /* ------------------------------------------------------------------ */
// function Vi_Hoto() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
//     const [dashboard, setDashboard] = useState(null);
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     // ── Month / Year filters, sent to the API ──
//     // month is stored as a NUMBER (1–12) because the backend expects an
//     // integer, not a month name string (see notes above MONTHS).
//     const [month, setMonth] = useState(defaultMonth());
//     const [year, setYear] = useState(defaultYear());

//     // ── Race-condition guards ──
//     // abortControllerRef cancels any in-flight request before a new one
//     // starts. requestIdRef is a belt-and-braces check so that even if an
//     // old request can't be aborted in time (e.g. browser quirks), its
//     // response is ignored once a newer request has been issued.
//     const abortControllerRef = useRef(null);
//     const requestIdRef = useRef(0);

//     const fetchDashboard = useCallback(async () => {
//         if (abortControllerRef.current) {
//             abortControllerRef.current.abort();
//         }
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         const thisRequestId = ++requestIdRef.current;

//         setLoading(true);
//         setError(false);
//         try {
//             const params = new URLSearchParams();
//             if (month) params.append("month", month); // numeric, e.g. 7 for July
//             if (year) params.append("year", year);

//             const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
//             const res = await fetch(url, { signal: controller.signal });
//             const json = await res.json();

//             // A newer request has since been issued — discard this response.
//             if (thisRequestId !== requestIdRef.current) return;

//             if (!json || !json.dashboard) {
//                 setDashboard(null);
//                 setDownloadLink(null);
//             } else {
//                 setDashboard(json.dashboard);
//                 setDownloadLink(json.download_link ?? null);
//             }
//         } catch (e) {
//             if (e.name === "AbortError") return; // expected when a newer request supersedes this one
//             console.error("Vi_Hoto fetchDashboard:", e);
//             if (thisRequestId === requestIdRef.current) {
//                 setError(true);
//                 setDashboard(null);
//                 setDownloadLink(null);
//             }
//         } finally {
//             if (thisRequestId === requestIdRef.current) {
//                 setLoading(false);
//             }
//         }
//     }, [month, year]);

//     useEffect(() => {
//         fetchDashboard();
//         // Cancel any in-flight request if the component unmounts mid-fetch.
//         return () => {
//             if (abortControllerRef.current) {
//                 abortControllerRef.current.abort();
//             }
//         };
//     }, [fetchDashboard]);

//     const circleStatus = dashboard?.["circle status"];
//     const circlePendingBucket = dashboard?.["circle pending bucket"];
//     const oemStatus = dashboard?.["ageing wise pending bucket"];
//     const oemPendingBucket = dashboard?.["oem wise pending bucket"];

//     const hasAnyData = !!dashboard;

//     // Shared sx for the dark-header Select/TextField controls
//     const controlSx = {
//         bgcolor: "rgba(255,255,255,0.08)",
//         borderRadius: 1,
//         "& .MuiOutlinedInput-root": {
//             color: "#fff",
//             "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//             "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//             "&.Mui-focused fieldset": { borderColor: "#7dd3fc" },
//         },
//         "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
//         "& .MuiSvgIcon-root": { color: "#fff" },
//     };

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
//                         {/* Header */}
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 borderRadius: 2,
//                                 px: 2.5,
//                                 py: 2,
//                                 mb: 3,
//                                 background: "linear-gradient(90deg, #0a1f3d 0%, #446698 0%, #173d73 100%)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 gap: 2,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                                 <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
//                                     <LayersIcon sx={{ color: "#7dd3fc" }} />
//                                 </Avatar>
//                                 <Box>
//                                     <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
//                                         VI HOTO Dashboard
//                                     </Typography>
//                                     {/* <Typography variant="caption" sx={{ color: "rgba(186,230,253,0.8)" }}>
//                                         Integration Tracker VI — Handover / Takeover Status
//                                     </Typography> */}
//                                 </Box>
//                             </Stack>

//                             {/* Month / Year filters */}
//                             <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
//                                 <FormControl size="small" sx={{ minWidth: 140, ...controlSx }}>
//                                     <InputLabel id="vihoto-month-label">Month</InputLabel>
//                                     <Select
//                                         labelId="vihoto-month-label"
//                                         label="Month"
//                                         value={month}
//                                         onChange={(e) => setMonth(e.target.value)}
//                                     >
//                                         {MONTHS.map((m, idx) => (
//                                             <MenuItem key={m} value={idx + 1}>
//                                                 {m}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>

//                                 <TextField
//                                     type="number"
//                                     size="small"
//                                     label="Year"
//                                     value={year}
//                                     onChange={(e) => setYear(e.target.value)}
//                                     InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
//                                     sx={{ width: 110, ...controlSx }}
//                                 />

//                                 <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
//                                     <span>
//                                         <IconButton
//                                             component={downloadLink ? "a" : "button"}
//                                             href={downloadLink || undefined}
//                                             disabled={!downloadLink}
//                                             sx={{
//                                                 color: "#7dd3fc",
//                                                 bgcolor: "rgba(255,255,255,0.08)",
//                                                 "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
//                                                 "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
//                                             }}
//                                         >
//                                             <FileDownloadIcon />
//                                         </IconButton>
//                                     </span>
//                                 </Tooltip>
//                             </Stack>
//                         </Paper>

//                         {/* Loading state */}
//                         {loading && (
//                             <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//                                 <CircularProgress size={32} sx={{ color: "#0f2a52" }} />
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
//                                 {/* Tabs */}
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
//                                                 ...(tab === 0 && { bgcolor: "#0f2a52", color: "#fff !important" }),
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
//                                                 ...(tab === 1 && { bgcolor: "#0f2a52", color: "#fff !important" }),
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
//                                                 icon={<CellTowerIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="Circle-wise Pending Bucket"
//                                                 rows={circlePendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     ) : (
//                                         <>
//                                             <MatrixTable
//                                                 title="Ageing wise Dashboard"
//                                                 rows={oemStatus}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<ApartmentIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="OEM-wise Pending Bucket"
//                                                 rows={oemPendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     )}
//                                 </Stack>

//                                 {/* <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 4 }}>
//                                     Data source: backend API · Live snapshot
//                                 </Typography> */}
//                             </>
//                         )}
//                     </Box>
//                 </Box>
//             </div>
//         </Slide>
//     );
// }

// export default Vi_Hoto;



// import React, { useState, useEffect, useCallback, useRef } from "react";
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
//     TextField,
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
// /*  Colors — matched to the Excel-style reference screenshots          */
// /* ------------------------------------------------------------------ */
// const C = {
//     corner: "#2e4463",       // top-left / date-row dark navy
//     headerBg: "#4d8fd1",     // column header medium blue
//     labelOdd: "#dbe9f8",     // circle label column - light blue
//     labelEven: "#eef4fb",    // circle label column - lighter blue
//     grandTotalBg: "#c9f7d6", // total row green
//     grandTotalText: "#0b6b3a",
//     zeroText: "#b7bfc9",
//     valueText: "#1a2f52",
//     border: "#c3cbd6",
// };

// const PAGE_BG = "#fdece0"; // warm peach/orange page background (replaces bluish tone)

// /* ------------------------------------------------------------------ */
// /*  Month / Year helpers                                                */
// /*  IMPORTANT: the backend expects "month" as a NUMBER (1–12), not a   */
// /*  month name string. We still show readable names in the dropdown,   */
// /*  but the value stored in state (and sent to the API) is numeric —   */
// /*  e.g. selecting "July" sends month=7, "August" sends month=8.       */
// /* ------------------------------------------------------------------ */
// const MONTHS = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
// ];

// const defaultMonth = () => new Date().getMonth() + 1; // 1–12
// const defaultYear = () => String(new Date().getFullYear());

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
//                     background: "linear-gradient(90deg, #446698 0%, #173d73 100%)",
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
//                             {/* single header row — month-wise data, no "today" date row */}
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
//                                             zIndex: 3,
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
//                                         zIndex: 4,
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
// /*  Main Dashboard                                                      */
// /* ------------------------------------------------------------------ */
// function Vi_Hoto() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
//     const [dashboard, setDashboard] = useState(null);
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     // ── Month / Year filters, sent to the API ──
//     // month is stored as a NUMBER (1–12) because the backend expects an
//     // integer, not a month name string (see notes above MONTHS).
//     const [month, setMonth] = useState(defaultMonth());
//     const [year, setYear] = useState(defaultYear());

//     // ── Race-condition guards ──
//     // abortControllerRef cancels any in-flight request before a new one
//     // starts. requestIdRef is a belt-and-braces check so that even if an
//     // old request can't be aborted in time (e.g. browser quirks), its
//     // response is ignored once a newer request has been issued.
//     const abortControllerRef = useRef(null);
//     const requestIdRef = useRef(0);

//     const fetchDashboard = useCallback(async () => {
//         if (abortControllerRef.current) {
//             abortControllerRef.current.abort();
//         }
//         const controller = new AbortController();
//         abortControllerRef.current = controller;
//         const thisRequestId = ++requestIdRef.current;

//         setLoading(true);
//         setError(false);
//         try {
//             const params = new URLSearchParams();
//             if (month) params.append("month", month); // numeric, e.g. 7 for July
//             if (year) params.append("year", year);

//             const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
//             const res = await fetch(url, { signal: controller.signal });
//             const json = await res.json();

//             // A newer request has since been issued — discard this response.
//             if (thisRequestId !== requestIdRef.current) return;

//             if (!json || !json.dashboard) {
//                 setDashboard(null);
//                 setDownloadLink(null);
//             } else {
//                 // DEBUG: confirms exactly what the API sent for this month/year.
//                 // If "ageing wise pending bucket" / "oem wise pending bucket" stay
//                 // identical across months here, the API itself isn't filtering
//                 // those two sections — nothing left to fix on the frontend.
//                 console.log(
//                     `[Vi_Hoto] dashboard response for month=${month} year=${year}:`,
//                     {
//                         "circle status": json.dashboard["circle status"],
//                         "circle pending bucket": json.dashboard["circle pending bucket"],
//                         "ageing wise pending bucket": json.dashboard["ageing wise pending bucket"],
//                         "oem wise pending bucket": json.dashboard["oem wise pending bucket"],
//                     }
//                 );
//                 setDashboard(json.dashboard);
//                 setDownloadLink(json.download_link ?? null);
//             }
//         } catch (e) {
//             if (e.name === "AbortError") return; // expected when a newer request supersedes this one
//             console.error("Vi_Hoto fetchDashboard:", e);
//             if (thisRequestId === requestIdRef.current) {
//                 setError(true);
//                 setDashboard(null);
//                 setDownloadLink(null);
//             }
//         } finally {
//             if (thisRequestId === requestIdRef.current) {
//                 setLoading(false);
//             }
//         }
//     }, [month, year]);

//     useEffect(() => {
//         fetchDashboard();
//         // Cancel any in-flight request if the component unmounts mid-fetch.
//         return () => {
//             if (abortControllerRef.current) {
//                 abortControllerRef.current.abort();
//             }
//         };
//     }, [fetchDashboard]);

//     const circleStatus = dashboard?.["circle status"];
//     const circlePendingBucket = dashboard?.["circle pending bucket"];
//     const oemStatus = dashboard?.["ageing wise pending bucket"];
//     const oemPendingBucket = dashboard?.["oem wise pending bucket"];

//     const hasAnyData = !!dashboard;

//     // Shared sx for the dark-header Select/TextField controls
//     const controlSx = {
//         bgcolor: "rgba(255,255,255,0.08)",
//         borderRadius: 1,
//         "& .MuiOutlinedInput-root": {
//             color: "#fff",
//             "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//             "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//             "&.Mui-focused fieldset": { borderColor: "#7dd3fc" },
//         },
//         "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
//         "& .MuiSvgIcon-root": { color: "#fff" },
//     };

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
//                         {/* Header */}
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 borderRadius: 2,
//                                 px: 2.5,
//                                 py: 2,
//                                 mb: 3,
//                                 background: "linear-gradient(90deg, #0a1f3d 0%, #446698 0%, #173d73 100%)",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "space-between",
//                                 gap: 2,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                                 <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
//                                     <LayersIcon sx={{ color: "#7dd3fc" }} />
//                                 </Avatar>
//                                 <Box>
//                                     <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
//                                         VI HOTO Dashboard
//                                     </Typography>
//                                     {/* <Typography variant="caption" sx={{ color: "rgba(186,230,253,0.8)" }}>
//                                         Integration Tracker VI — Handover / Takeover Status
//                                     </Typography> */}
//                                 </Box>
//                             </Stack>

//                             {/* Month / Year filters */}
//                             <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
//                                 <FormControl size="small" sx={{ minWidth: 140, ...controlSx }}>
//                                     <InputLabel id="vihoto-month-label">Month</InputLabel>
//                                     <Select
//                                         labelId="vihoto-month-label"
//                                         label="Month"
//                                         value={month}
//                                         onChange={(e) => setMonth(e.target.value)}
//                                     >
//                                         {MONTHS.map((m, idx) => (
//                                             <MenuItem key={m} value={idx + 1}>
//                                                 {m}
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>

//                                 <TextField
//                                     type="number"
//                                     size="small"
//                                     label="Year"
//                                     value={year}
//                                     onChange={(e) => setYear(e.target.value)}
//                                     InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
//                                     sx={{ width: 110, ...controlSx }}
//                                 />

//                                 <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
//                                     <span>
//                                         <IconButton
//                                             component={downloadLink ? "a" : "button"}
//                                             href={downloadLink || undefined}
//                                             disabled={!downloadLink}
//                                             sx={{
//                                                 color: "#7dd3fc",
//                                                 bgcolor: "rgba(255,255,255,0.08)",
//                                                 "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
//                                                 "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
//                                             }}
//                                         >
//                                             <FileDownloadIcon />
//                                         </IconButton>
//                                     </span>
//                                 </Tooltip>
//                             </Stack>
//                         </Paper>

//                         {/* Loading state */}
//                         {loading && (
//                             <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//                                 <CircularProgress size={32} sx={{ color: "#0f2a52" }} />
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
//                                 {/* Tabs */}
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
//                                                 ...(tab === 0 && { bgcolor: "#0f2a52", color: "#fff !important" }),
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
//                                                 ...(tab === 1 && { bgcolor: "#0f2a52", color: "#fff !important" }),
//                                             }}
//                                         />
//                                     </Tabs>
//                                 </Paper>

//                                 {/* Tables stacked one below the other, full width.
//                                     key={`${tab}-${month}-${year}`} forces a full remount whenever
//                                     the tab or the filter changes, so there's no possibility of a
//                                     stale render — whatever shows here is exactly what the latest
//                                     API response contained for that key. */}
//                                 <Stack spacing={3} key={`${tab}-${month}-${year}`}>
//                                     {tab === 0 ? (
//                                         <>
//                                             <MatrixTable
//                                                 title="Circle-wise Status"
//                                                 rows={circleStatus}
//                                                 labelKey="Status"
//                                                 icon={<CellTowerIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="Circle-wise Pending Bucket"
//                                                 rows={circlePendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     ) : (
//                                         <>
//                                             <MatrixTable
//                                                 title="Ageing wise Dashboard"
//                                                 rows={oemStatus}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<ApartmentIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                             <MatrixTable
//                                                 title="OEM-wise Pending Bucket"
//                                                 rows={oemPendingBucket}
//                                                 labelKey="Pending Bucket"
//                                                 icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     )}
//                                 </Stack>

//                                 {/* <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 4 }}>
//                                     Data source: backend API · Live snapshot
//                                 </Typography> */}
//                             </>
//                         )}
//                     </Box>
//                 </Box>
//             </div>
//         </Slide>
//     );
// }

// export default Vi_Hoto;