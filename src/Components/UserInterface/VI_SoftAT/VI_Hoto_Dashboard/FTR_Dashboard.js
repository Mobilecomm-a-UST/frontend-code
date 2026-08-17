


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
//     Chip,
//     TextField,
// } from "@mui/material";
// import LayersIcon from "@mui/icons-material/Layers";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CellTowerIcon from "@mui/icons-material/CellTower";
// import ApartmentIcon from "@mui/icons-material/Apartment";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import InboxIcon from "@mui/icons-material/Inbox";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import Slide from "@mui/material/Slide";
// import { useNavigate } from "react-router-dom";
// import VI_FTR_Dashboard from "../VI_Checklist/VI_FTR_Dashboard/VI_FTR_Dashboard";

// /* ------------------------------------------------------------------ */
// /*  Config — same pattern as the Daily Task Review dashboard:          */
// /*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
// /* ------------------------------------------------------------------ */
// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
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

// const ROW_H = 37; // approx header row height, used for sticky offset of 2nd header row

// /* ------------------------------------------------------------------ */
// /*  Date helpers — format as YYYY-MM-DD (matches API's start_date /    */
// /*  end_date fields, e.g. "2026-07-01")                                */
// /* ------------------------------------------------------------------ */
// const toYMD = (d) => {
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
// };

// const defaultStartDate = () => {
//     const d = new Date();
//     d.setDate(1); // first day of current month
//     return toYMD(d);
// };

// const defaultEndDate = () => toYMD(new Date());

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */
// const getCols = (rows, labelKey) =>
//     rows && rows.length
//         ? Object.keys(rows[0]).filter((k) => k !== labelKey && k !== "Grand Total")
//         : [];

// const todayLabel = () => {
//     const d = new Date();
//     const dd = String(d.getDate()).padStart(2, "0");
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const yyyy = d.getFullYear();
//     return `${dd}-${mm}-${yyyy}`;
// };

// // Parse "FTR %" values whether they arrive as "1%" (string) or 0.01 / 1 (number)
// const parseFtrPercent = (val) => {
//     if (val == null) return null;
//     if (typeof val === "string") {
//         const n = parseFloat(val.replace("%", ""));
//         return Number.isNaN(n) ? null : n;
//     }
//     if (typeof val === "number") return val <= 1 ? val * 100 : val;
//     return null;
// };

// const formatFtrPercent = (val) => {
//     const n = parseFtrPercent(val);
//     if (n == null) return "0%";
//     // keep original string as-is if it was already formatted with %
//     return typeof val === "string" && val.includes("%") ? val : `${n}%`;
// };

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
// /*  Excel-style matrix table (kept for other pivoted datasets)          */
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
//                             {/* date row */}
//                             <TableRow>
//                                 <TableCell
//                                     rowSpan={2}
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
//                                 <TableCell
//                                     colSpan={cols.length + 1}
//                                     align="right"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 4,
//                                         bgcolor: C.corner,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                     }}
//                                 >
//                                     {todayLabel()}
//                                 </TableCell>
//                             </TableRow>
//                             {/* column header row */}
//                             <TableRow>
//                                 {cols.map((c) => (
//                                     <TableCell
//                                         key={c}
//                                         align="center"
//                                         sx={{
//                                             position: "sticky",
//                                             top: ROW_H,
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
//                                         top: ROW_H,
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
// /*  Flat FTR Dashboard table — matches the new API shape:              */
// /*  [{ Circle, "RAN OEM", MS1, "FTR Count", "FTR %" }, ...]             */
// /* ------------------------------------------------------------------ */
// function FtrDashboardTable({ title, rows, icon }) {
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     // group rows by Circle so consecutive rows for the same circle share a
//     // background tint, similar to the Excel-style banding used elsewhere
//     let lastCircle = null;
//     let bandToggle = false;

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
//                 <TableContainer sx={{ maxHeight: 560 }}>
//                     <Table
//                         size="small"
//                         stickyHeader
//                         sx={{
//                             borderCollapse: "collapse",
//                             "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75 },
//                         }}
//                     >
//                         <TableHead>
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
//                                         minWidth: 90,
//                                     }}
//                                 >
//                                     Circle
//                                 </TableCell>
//                                 <TableCell
//                                     align="center"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 4,
//                                         bgcolor: C.headerBg,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 120,
//                                     }}
//                                 >
//                                     RAN OEM
//                                 </TableCell>
//                                 <TableCell
//                                     align="center"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 4,
//                                         bgcolor: C.headerBg,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 90,
//                                     }}
//                                 >
//                                     MS1
//                                 </TableCell>
//                                 <TableCell
//                                     align="center"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 4,
//                                         bgcolor: C.headerBg,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 100,
//                                     }}
//                                 >
//                                     FTR Count
//                                 </TableCell>
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
//                                         minWidth: 90,
//                                     }}
//                                 >
//                                     FTR %
//                                 </TableCell>
//                             </TableRow>
//                         </TableHead>

//                         <TableBody>
//                             {rows.map((row, i) => {
//                                 const circle = row["Circle"];
//                                 const isGrandTotal =
//                                     typeof circle === "string" &&
//                                     (circle.trim().toLowerCase() === "grand total" ||
//                                         circle.trim().toLowerCase() === "total");

//                                 if (circle !== lastCircle) {
//                                     bandToggle = !bandToggle;
//                                     lastCircle = circle;
//                                 }
//                                 const labelBg = isGrandTotal ? C.grandTotalBg : bandToggle ? C.labelOdd : C.labelEven;

//                                 const ms1 = row["MS1"] ?? 0;
//                                 const ftrCount = row["FTR Count"] ?? 0;
//                                 const ftrPctNum = parseFtrPercent(row["FTR %"]);
//                                 // Grand Total row => green. Otherwise: zero => gray, else navy.
//                                 const ftrPctColor = isGrandTotal
//                                     ? C.grandTotalText
//                                     : ftrPctNum == null || ftrPctNum === 0
//                                     ? C.zeroText
//                                     : C.valueText;

//                                 return (
//                                     <TableRow key={`${circle}-${row["RAN OEM"]}-${i}`}>
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
//                                             {circle}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                 color: isGrandTotal ? C.grandTotalText : C.valueText,
//                                                 fontWeight: 600,
//                                             }}
//                                         >
//                                             {row["RAN OEM"]}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal
//                                                     ? C.grandTotalText
//                                                     : ms1 === 0
//                                                     ? C.zeroText
//                                                     : C.valueText,
//                                                 fontWeight: ms1 === 0 && !isGrandTotal ? 400 : 700,
//                                             }}
//                                         >
//                                             {ms1}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal
//                                                     ? C.grandTotalText
//                                                     : ftrCount === 0
//                                                     ? C.zeroText
//                                                     : C.valueText,
//                                                 fontWeight: ftrCount === 0 && !isGrandTotal ? 400 : 700,
//                                             }}
//                                         >
//                                             {ftrCount}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 position: "sticky",
//                                                 right: 0,
//                                                 bgcolor: labelBg,
//                                             }}
//                                         >
//                                             <Chip
//                                                 label={formatFtrPercent(row["FTR %"])}
//                                                 size="small"
//                                                 sx={{
//                                                     fontWeight: 800,
//                                                     fontSize: 11.5,
//                                                     color: ftrPctColor,
//                                                     bgcolor: "transparent",
//                                                 }}
//                                             />
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
// function FTR_Dashboard() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
//     const [dashboard, setDashboard] = useState(null);
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     // ── Date range filters (YYYY-MM-DD), sent to the API ──
//     const [startDate, setStartDate] = useState(defaultStartDate());
//     const [endDate, setEndDate] = useState(defaultEndDate());

//     const fetchDashboard = useCallback(async () => {
//         setLoading(true);
//         setError(false);
//         try {
//             const params = new URLSearchParams();
//             if (startDate) params.append("start_date", startDate);
//             if (endDate) params.append("end_date", endDate);

//             const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
//             const res = await fetch(url);
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
//     }, [startDate, endDate]);

//     useEffect(() => {
//         fetchDashboard();
//     }, [fetchDashboard]);

//     const ftrDashboardRows = dashboard?.["FTR Dashboard"];

//     const hasAnyData = !!dashboard;

//     return (
//         <Slide direction="left" in="true" timeout={1000}>
//             <div>
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
//                                        FTR Dashboard-MS1 Wise
//                                     </Typography>
//                                 </Box>
//                             </Stack>

//                             {/* Date range filters */}
//                             <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
//                                 <TextField
//                                     type="date"
//                                     size="small"
//                                     label="Start Date"
//                                     value={startDate}
//                                     onChange={(e) => setStartDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
//                                     sx={{
//                                         bgcolor: "rgba(255,255,255,0.08)",
//                                         borderRadius: 1,
//                                         "& .MuiOutlinedInput-root": {
//                                             color: "#fff",
//                                             "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//                                             "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//                                             "&.Mui-focused fieldset": { borderColor: "#7dd3fc" },
//                                         },
//                                         "& input": { colorScheme: "dark" },
//                                     }}
//                                 />
//                                 <TextField
//                                     type="date"
//                                     size="small"
//                                     label="End Date"
//                                     value={endDate}
//                                     onChange={(e) => setEndDate(e.target.value)}
//                                     InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
//                                     sx={{
//                                         bgcolor: "rgba(255,255,255,0.08)",
//                                         borderRadius: 1,
//                                         "& .MuiOutlinedInput-root": {
//                                             color: "#fff",
//                                             "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//                                             "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//                                             "&.Mui-focused fieldset": { borderColor: "#7dd3fc" },
//                                         },
//                                         "& input": { colorScheme: "dark" },
//                                     }}
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
//                                 <Stack spacing={3}>
//                                     {tab === 0 ? (
//                                         <>
//                                             <FtrDashboardTable
//                                                 title="MS1 Wise"
//                                                 rows={ftrDashboardRows}
//                                                 icon={<TrendingUpIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
//                                             />
//                                         </>
//                                     ) : (
//                                         <></>
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

// export const MemoFTR_Dashboard = React.memo(FTR_Dashboard);

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    Chip,
    TextField,
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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";
import VI_FTR_Dashboard from "../VI_Checklist/VI_FTR_Dashboard/VI_FTR_Dashboard";

/* ------------------------------------------------------------------ */
/*  Config — same pattern as the Daily Task Review dashboard:          */
/*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
/* ------------------------------------------------------------------ */
const BASE_URL = "https://commtoolapi.mcpspmis.com/";
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
const defaultYear = () => String(new Date().getFullYear());

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

// Parse "FTR %" values whether they arrive as "1%" (string) or 0.01 / 1 (number)
const parseFtrPercent = (val) => {
    if (val == null) return null;
    if (typeof val === "string") {
        const n = parseFloat(val.replace("%", ""));
        return Number.isNaN(n) ? null : n;
    }
    if (typeof val === "number") return val <= 1 ? val * 100 : val;
    return null;
};

const formatFtrPercent = (val) => {
    const n = parseFtrPercent(val);
    if (n == null) return "0%";
    // keep original string as-is if it was already formatted with %
    return typeof val === "string" && val.includes("%") ? val : `${n}%`;
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
/*  Excel-style matrix table (kept for other pivoted datasets)          */
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
/*  Flat FTR Dashboard table — matches the new API shape:              */
/*  [{ Circle, "RAN OEM", MS1, "FTR Count", "FTR %" }, ...]             */
/* ------------------------------------------------------------------ */
function FtrDashboardTable({ title, rows, icon }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

    // group rows by Circle so consecutive rows for the same circle share a
    // background tint, similar to the Excel-style banding used elsewhere
    let lastCircle = null;
    let bandToggle = false;

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
                <TableContainer sx={{ maxHeight: 560 }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={{
                            borderCollapse: "collapse",
                            "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75 },
                        }}
                    >
                        <TableHead>
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
                                        minWidth: 90,
                                    }}
                                >
                                    Circle
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 4,
                                        bgcolor: C.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 120,
                                    }}
                                >
                                    RAN OEM
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 4,
                                        bgcolor: C.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 90,
                                    }}
                                >
                                    MS1
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 4,
                                        bgcolor: C.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 100,
                                    }}
                                >
                                    FTR Count
                                </TableCell>
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
                                        minWidth: 90,
                                    }}
                                >
                                    FTR %
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const circle = row["Circle"];
                                const isGrandTotal =
                                    typeof circle === "string" &&
                                    (circle.trim().toLowerCase() === "grand total" ||
                                        circle.trim().toLowerCase() === "total");

                                if (circle !== lastCircle) {
                                    bandToggle = !bandToggle;
                                    lastCircle = circle;
                                }
                                const labelBg = isGrandTotal ? C.grandTotalBg : bandToggle ? C.labelOdd : C.labelEven;

                                const ms1 = row["MS1"] ?? 0;
                                const ftrCount = row["FTR Count"] ?? 0;
                                const ftrPctNum = parseFtrPercent(row["FTR %"]);
                                // Grand Total row => green. Otherwise: zero => gray, else navy.
                                const ftrPctColor = isGrandTotal
                                    ? C.grandTotalText
                                    : ftrPctNum == null || ftrPctNum === 0
                                    ? C.zeroText
                                    : C.valueText;

                                return (
                                    <TableRow key={`${circle}-${row["RAN OEM"]}-${i}`}>
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
                                            {circle}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                color: isGrandTotal ? C.grandTotalText : C.valueText,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {row["RAN OEM"]}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                fontVariantNumeric: "tabular-nums",
                                                color: isGrandTotal
                                                    ? C.grandTotalText
                                                    : ms1 === 0
                                                    ? C.zeroText
                                                    : C.valueText,
                                                fontWeight: ms1 === 0 && !isGrandTotal ? 400 : 700,
                                            }}
                                        >
                                            {ms1}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                fontVariantNumeric: "tabular-nums",
                                                color: isGrandTotal
                                                    ? C.grandTotalText
                                                    : ftrCount === 0
                                                    ? C.zeroText
                                                    : C.valueText,
                                                fontWeight: ftrCount === 0 && !isGrandTotal ? 400 : 700,
                                            }}
                                        >
                                            {ftrCount}
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            sx={{
                                                position: "sticky",
                                                right: 0,
                                                bgcolor: labelBg,
                                            }}
                                        >
                                            <Chip
                                                label={formatFtrPercent(row["FTR %"])}
                                                size="small"
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: 11.5,
                                                    color: ftrPctColor,
                                                    bgcolor: "transparent",
                                                }}
                                            />
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
function FTR_Dashboard() {
    const navigate = useNavigate();

    const [tab, setTab] = useState(0); // 0 = Circle, 1 = OEM
    const [dashboard, setDashboard] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // ── Month / Year filters, sent to the API ──
    // month is stored as a NUMBER (1–12) because the backend expects an
    // integer, not a month name string (see notes above MONTHS).
    const [month, setMonth] = useState(defaultMonth());
    const [year, setYear] = useState(defaultYear());

    // ── Race-condition guards ──
    // abortControllerRef cancels any in-flight request before a new one
    // starts. requestIdRef is a belt-and-braces check so that even if an
    // old request can't be aborted in time (e.g. browser quirks), its
    // response is ignored once a newer request has been issued.
    const abortControllerRef = useRef(null);
    const requestIdRef = useRef(0);

    const fetchDashboard = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const thisRequestId = ++requestIdRef.current;

        setLoading(true);
        setError(false);
        try {
            const params = new URLSearchParams();
            if (month) params.append("month", month); // numeric, e.g. 7 for July
            if (year) params.append("year", year);

            const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
            const res = await fetch(url, { signal: controller.signal });
            const json = await res.json();

            // A newer request has since been issued — discard this response.
            if (thisRequestId !== requestIdRef.current) return;

            if (!json || !json.dashboard) {
                setDashboard(null);
                setDownloadLink(null);
            } else {
                setDashboard(json.dashboard);
                setDownloadLink(json.download_link ?? null);
            }
        } catch (e) {
            if (e.name === "AbortError") return; // expected when a newer request supersedes this one
            console.error("FTR_Dashboard fetchDashboard:", e);
            if (thisRequestId === requestIdRef.current) {
                setError(true);
                setDashboard(null);
                setDownloadLink(null);
            }
        } finally {
            if (thisRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [month, year]);

    useEffect(() => {
        fetchDashboard();
        // Cancel any in-flight request if the component unmounts mid-fetch.
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchDashboard]);

    const ftrDashboardRows = dashboard?.["FTR Dashboard"];

    const hasAnyData = !!dashboard;

    // Shared sx for the dark-header Select/TextField controls
    const controlSx = {
        bgcolor: "rgba(255,255,255,0.08)",
        borderRadius: 1,
        "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            "&.Mui-focused fieldset": { borderColor: "#7dd3fc" },
        },
        "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
        "& .MuiSvgIcon-root": { color: "#fff" },
    };

    return (
        <Slide direction="left" in="true" timeout={1000}>
            <div>
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
                                flexWrap: "wrap",
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
                                    <LayersIcon sx={{ color: "#7dd3fc" }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
                                       FTR Dashboard-MS1 Wise
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* Month / Year filters */}
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                <FormControl size="small" sx={{ minWidth: 140, ...controlSx }}>
                                    <InputLabel id="ftr-month-label">Month</InputLabel>
                                    <Select
                                        labelId="ftr-month-label"
                                        label="Month"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                    >
                                        {MONTHS.map((m, idx) => (
                                            <MenuItem key={m} value={idx + 1}>
                                                {m}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    type="number"
                                    size="small"
                                    label="Year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
                                    sx={{ width: 110, ...controlSx }}
                                />

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
                                <Stack spacing={3}>
                                    {tab === 0 ? (
                                        <>
                                            <FtrDashboardTable
                                                title="MS1 Wise"
                                                rows={ftrDashboardRows}
                                                icon={<TrendingUpIcon sx={{ color: "#7dd3fc", fontSize: 18 }} />}
                                            />
                                        </>
                                    ) : (
                                        <></>
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

export const MemoFTR_Dashboard = React.memo(FTR_Dashboard);