// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import {
//     Box,
//     Grid,
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
//     Card,
//     CardContent,
//     Avatar,
//     Button,
//     Stack,
//     CircularProgress,
//     Breadcrumbs,
//     Link,
// } from "@mui/material";
// import LayersIcon from "@mui/icons-material/Layers";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import SendIcon from "@mui/icons-material/Send";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CellTowerIcon from "@mui/icons-material/CellTower";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import InboxIcon from "@mui/icons-material/Inbox";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import Slide from "@mui/material/Slide";
// import { useNavigate } from "react-router-dom";

// /* ------------------------------------------------------------------ */
// /*  Config — same pattern as the Daily Task Review dashboard:          */
// /*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
// /* ------------------------------------------------------------------ */
// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */
// const getCols = (rows, labelKey) =>
//     rows && rows.length ? Object.keys(rows[0]).filter((k) => k !== labelKey && k !== "Grand Total") : [];

// function summarize(statusRows) {
//     if (!statusRows || !statusRows.length) return { total: 0, accepted: 0, offered: 0, pending: 0 };
//     const gt = statusRows.find((r) => r.Status === "Grand Total");
//     const find = (s) => statusRows.find((r) => r.Status === s)?.["Grand Total"] ?? 0;
//     return {
//         total: gt?.["Grand Total"] ?? 0,
//         accepted: find("Accepted"),
//         offered: find("Offered"),
//         pending: find("Pending"),
//     };
// }

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
// /*  Matrix table — built entirely with MUI Table components             */
// /* ------------------------------------------------------------------ */
// function MatrixTable({ title, rows, labelKey, icon }) {
//     const cols = getCols(rows, labelKey);
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     return (
//         <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     px: 2,
//                     py: 1.25,
//                     background: "linear-gradient(90deg, #0f2a52 0%, #173d73 100%)",
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
//                 <TableContainer sx={{ maxHeight: 420 }}>
//                     <Table size="small" stickyHeader>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell
//                                     sx={{
//                                         bgcolor: "#e8edf6",
//                                         fontWeight: 700,
//                                         color: "#1a2f52",
//                                         minWidth: 130,
//                                     }}
//                                 >
//                                     {labelKey}
//                                 </TableCell>
//                                 {cols.map((c) => (
//                                     <TableCell
//                                         key={c}
//                                         align="center"
//                                         sx={{ bgcolor: "#0f2a52", color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}
//                                     >
//                                         {c}
//                                     </TableCell>
//                                 ))}
//                                 <TableCell
//                                     align="center"
//                                     sx={{ bgcolor: "#0a1f3d", color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}
//                                 >
//                                     Total
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {rows.map((row, i) => {
//                                 const isGrandTotal = row[labelKey] === "Grand Total";
//                                 const rowBg = isGrandTotal ? "#ecfdf5" : i % 2 === 0 ? "#ffffff" : "#f8fafc";

//                                 return (
//                                     <TableRow key={row[labelKey] ?? i} sx={{ bgcolor: rowBg }}>
//                                         <TableCell
//                                             sx={{
//                                                 fontWeight: isGrandTotal ? 700 : 500,
//                                                 color: isGrandTotal ? "#065f46" : "#1a2f52",
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
//                                                         fontVariantNumeric: "tabular-nums",
//                                                         color: val === 0 ? "#cbd5e1" : isGrandTotal ? "#065f46" : "#0369a1",
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
//                                                 fontWeight: 800,
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal ? "#065f46" : "#0f2a52",
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
// /*  Stat card                                                           */
// /* ------------------------------------------------------------------ */
// // function StatCard({ label, value, icon, accent, pct }) {
// //     return (
// //         <Card elevation={1} sx={{ borderRadius: 2, flex: 1, minWidth: 150 }}>
// //             <CardContent sx={{ pb: "16px !important" }}>
// //                 <Stack direction="row" alignItems="center" justifyContent="space-between">
// //                     <Typography
// //                         variant="caption"
// //                         sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#64748b" }}
// //                     >
// //                         {label}
// //                     </Typography>
// //                     <Avatar sx={{ bgcolor: `${accent}1a`, width: 30, height: 30 }}>
// //                         {React.cloneElement(icon, { sx: { color: accent, fontSize: 17 } })}
// //                     </Avatar>
// //                 </Stack>
// //                 <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
// //                     <Typography variant="h5" sx={{ fontWeight: 800, color: "#101828" }}>
// //                         {value}
// //                     </Typography>
// //                     {pct != null && (
// //                         <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
// //                             {pct}% of total
// //                         </Typography>
// //                     )}
// //                 </Stack>
// //             </CardContent>
// //         </Card>
// //     );
// // }

// /* ------------------------------------------------------------------ */
// /*  Main Dashboard                                                      */
// /* ------------------------------------------------------------------ */
// function Vi_Hoto() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
//     const [dashboard, setDashboard] = useState(null); // dashboard object from API
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     const fetchDashboard = useCallback(async () => {
//         setLoading(true);
//         setError(false);
//         try {
//             const res = await fetch(`${BASE_URL}${API_PATH}`);
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
//     }, []);

//     useEffect(() => {
//         fetchDashboard();
//     }, [fetchDashboard]);

//     const circleStatus = dashboard?.["circle status"];
//     const circlePendingBucket = dashboard?.["circle pending bucket"];
//     const oemStatus = dashboard?.["oem wise status"];
//     const oemPendingBucket = dashboard?.["oem wise pending bucket"];

//     const stats = useMemo(() => summarize(circleStatus), [circleStatus]);
//     const pct = (n) => (stats.total ? Math.round((n / stats.total) * 1000) / 10 : 0);

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

//                 <Box sx={{ minHeight: "100%", width: "100%", bgcolor: "#f1f5f9", fontFamily: "Roboto, sans-serif" }}>
//                     <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
//                         {/* Header */}
//                         <Paper
//                             elevation={3}
//                             sx={{
//                                 borderRadius: 2,
//                                 px: 2.5,
//                                 py: 2,
//                                 mb: 3,
//                                 background: "linear-gradient(90deg, #0a1f3d 0%, #0f2a52 55%, #173d73 100%)",
//                                 display: "flex",
//                                 flexDirection: { xs: "column", sm: "row" },
//                                 alignItems: { xs: "flex-start", sm: "center" },
//                                 justifyContent: "space-between",
//                                 gap: 2,
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
//                                     <Typography variant="caption" sx={{ color: "rgba(186,230,253,0.8)" }}>
//                                         Integration Tracker VI — Handover / Takeover Status
//                                     </Typography>
//                                 </Box>
//                             </Stack>

//                             <Stack direction="row" spacing={1}>
//                                 <Button
//                                     onClick={fetchDashboard}
//                                     variant="outlined"
//                                     size="small"
//                                     startIcon={<RefreshIcon />}
//                                     sx={{
//                                         color: "#fff",
//                                         borderColor: "rgba(255,255,255,0.35)",
//                                         textTransform: "none",
//                                         "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
//                                     }}
//                                 >
//                                     Refresh
//                                 </Button>
//                                 <Button
//                                     href={downloadLink || undefined}
//                                     disabled={!downloadLink}
//                                     variant="outlined"
//                                     size="small"
//                                     startIcon={<FileDownloadIcon />}
//                                     endIcon={<ChevronRightIcon />}
//                                     sx={{
//                                         color: "#fff",
//                                         borderColor: "rgba(255,255,255,0.35)",
//                                         textTransform: "none",
//                                         "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
//                                         "&.Mui-disabled": { color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.15)" },
//                                     }}
//                                 >
//                                     Download Excel
//                                 </Button>
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
//                                 {/* Stat cards */}
//                                 {/* <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", rowGap: 2 }}>
//                                     <StatCard label="Total Sites" value={stats.total} icon={<LayersIcon />} accent="#0f2a52" />
//                                     <StatCard
//                                         label="Accepted"
//                                         value={stats.accepted}
//                                         icon={<CheckCircleIcon />}
//                                         accent="#16a34a"
//                                         pct={pct(stats.accepted)}
//                                     />
//                                     <StatCard
//                                         label="Offered"
//                                         value={stats.offered}
//                                         icon={<SendIcon />}
//                                         accent="#2563eb"
//                                         pct={pct(stats.offered)}
//                                     />
//                                     <StatCard
//                                         label="Pending"
//                                         value={stats.pending}
//                                         icon={<AccessTimeIcon />}
//                                         accent="#d97706"
//                                         pct={pct(stats.pending)}
//                                     />
//                                 </Stack> */}

//                                 {/* Tabs — toggles which section is shown */}
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

//                                 {/* Only the selected section's tables are rendered */}
//                                 <Grid container spacing={3}>
//                                     {tab === 0 ? (
//                                         <>
//                                             <Grid item xs={12} xl={6}>
//                                                 <MatrixTable
//                                                     title="Circle-wise Status"
//                                                     rows={circleStatus}
//                                                     labelKey="Status"
//                                                     icon={<CellTowerIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={12} xl={6}>
//                                                 <MatrixTable
//                                                     title="Circle-wise Pending Bucket"
//                                                     rows={circlePendingBucket}
//                                                     labelKey="Pending Bucket"
//                                                     icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                                 />
//                                             </Grid>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Grid item xs={12} xl={6}>
//                                                 <MatrixTable
//                                                     title="OEM-wise Status"
//                                                     rows={oemStatus}
//                                                     labelKey="Status"
//                                                     icon={<ApartmentIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={12} xl={6}>
//                                                 <MatrixTable
//                                                     title="OEM-wise Pending Bucket"
//                                                     rows={oemPendingBucket}
//                                                     labelKey="Pending Bucket"
//                                                     icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                                 />
//                                             </Grid>
//                                         </>
//                                     )}
//                                 </Grid>

//                                 <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 4 }}>
//                                     Data source: backend API · Live snapshot
//                                 </Typography>
//                             </>
//                         )}
//                     </Box>
//                 </Box>
//             </div>
//         </Slide>
//     );
// }

// export default Vi_Hoto;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Grid,
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
    Button,
    Stack,
    CircularProgress,
    Breadcrumbs,
    Link,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CellTowerIcon from "@mui/icons-material/CellTower";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InboxIcon from "@mui/icons-material/Inbox";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Config — same pattern as the Daily Task Review dashboard:          */
/*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const getCols = (rows, labelKey) =>
    rows && rows.length ? Object.keys(rows[0]).filter((k) => k !== labelKey && k !== "Grand Total") : [];

function summarize(statusRows) {
    if (!statusRows || !statusRows.length) return { total: 0, accepted: 0, offered: 0, pending: 0 };
    const gt = statusRows.find((r) => r.Status === "Grand Total");
    const find = (s) => statusRows.find((r) => r.Status === s)?.["Grand Total"] ?? 0;
    return {
        total: gt?.["Grand Total"] ?? 0,
        accepted: find("Accepted"),
        offered: find("Offered"),
        pending: find("Pending"),
    };
}

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
/*  Matrix table — built entirely with MUI Table components             */
/* ------------------------------------------------------------------ */
function MatrixTable({ title, rows, labelKey, icon }) {
    const cols = getCols(rows, labelKey);
    const hasData = Array.isArray(rows) && rows.length > 0;

    return (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    background: "linear-gradient(90deg, #0f2a52 0%, #173d73 100%)",
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
                <TableContainer sx={{ maxHeight: 420 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        bgcolor: "#e8edf6",
                                        fontWeight: 700,
                                        color: "#1a2f52",
                                        minWidth: 130,
                                    }}
                                >
                                    {labelKey}
                                </TableCell>
                                {cols.map((c) => (
                                    <TableCell
                                        key={c}
                                        align="center"
                                        sx={{ bgcolor: "#0f2a52", color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}
                                    >
                                        {c}
                                    </TableCell>
                                ))}
                                <TableCell
                                    align="center"
                                    sx={{ bgcolor: "#0a1f3d", color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}
                                >
                                    Total
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const isGrandTotal = row[labelKey] === "Grand Total";
                                const rowBg = isGrandTotal ? "#ecfdf5" : i % 2 === 0 ? "#ffffff" : "#f8fafc";

                                return (
                                    <TableRow key={row[labelKey] ?? i} sx={{ bgcolor: rowBg }}>
                                        <TableCell
                                            sx={{
                                                fontWeight: isGrandTotal ? 700 : 500,
                                                color: isGrandTotal ? "#065f46" : "#1a2f52",
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
                                                        fontVariantNumeric: "tabular-nums",
                                                        color: val === 0 ? "#cbd5e1" : isGrandTotal ? "#065f46" : "#0369a1",
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
                                                fontWeight: 800,
                                                fontVariantNumeric: "tabular-nums",
                                                color: isGrandTotal ? "#065f46" : "#0f2a52",
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
    const [dashboard, setDashboard] = useState(null); // dashboard object from API
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
    const oemStatus = dashboard?.["oem wise status"];
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

                <Box sx={{ minHeight: "100%", width: "100%", bgcolor: "#f1f5f9", fontFamily: "Roboto, sans-serif" }}>
                    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, py: 3 }}>
                        {/* Header */}
                        <Paper
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                px: 2.5,
                                py: 2,
                                mb: 3,
                                background: "linear-gradient(90deg, #0a1f3d 0%, #0f2a52 55%, #173d73 100%)",
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
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
                                    <Typography variant="caption" sx={{ color: "rgba(186,230,253,0.8)" }}>
                                        Integration Tracker VI — Handover / Takeover Status
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    onClick={fetchDashboard}
                                    variant="outlined"
                                    size="small"
                                    startIcon={<RefreshIcon />}
                                    sx={{
                                        color: "#fff",
                                        borderColor: "rgba(255,255,255,0.35)",
                                        textTransform: "none",
                                        "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                                    }}
                                >
                                    Refresh
                                </Button>
                                <Button
                                    href={downloadLink || undefined}
                                    disabled={!downloadLink}
                                    variant="outlined"
                                    size="small"
                                    startIcon={<FileDownloadIcon />}
                                    endIcon={<ChevronRightIcon />}
                                    sx={{
                                        color: "#fff",
                                        borderColor: "rgba(255,255,255,0.35)",
                                        textTransform: "none",
                                        "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                                        "&.Mui-disabled": { color: "rgba(255,255,255,0.35)", borderColor: "rgba(255,255,255,0.15)" },
                                    }}
                                >
                                    Download Excel
                                </Button>
                            </Stack>
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
                                {/* Tabs — toggles which section is shown */}
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

                                {/* Only the selected section's tables are rendered */}
                                <Grid container spacing={3}>
                                    {tab === 0 ? (
                                        <>
                                            <Grid item xs={12} xl={6}>
                                                <MatrixTable
                                                    title="Circle-wise Status"
                                                    rows={circleStatus}
                                                    labelKey="Status"
                                                    icon={<CellTowerIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} xl={6}>
                                                <MatrixTable
                                                    title="Circle-wise Pending Bucket"
                                                    rows={circlePendingBucket}
                                                    labelKey="Pending Bucket"
                                                    icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                                />
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item xs={12} xl={6}>
                                                <MatrixTable
                                                    title="OEM-wise Status"
                                                    rows={oemStatus}
                                                    labelKey="Status"
                                                    icon={<ApartmentIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                                />
                                            </Grid>
                                            <Grid item xs={12} xl={6}>
                                                <MatrixTable
                                                    title="OEM-wise Pending Bucket"
                                                    rows={oemPendingBucket}
                                                    labelKey="Pending Bucket"
                                                    icon={<AccessTimeIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                                />
                                            </Grid>
                                        </>
                                    )}
                                </Grid>

                                <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", mt: 4 }}>
                                    Data source: backend API · Live snapshot
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
}

export default Vi_Hoto;