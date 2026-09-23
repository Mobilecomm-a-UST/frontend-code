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

// /* ------------------------------------------------------------------ */
// /*  Config — same pattern as the Daily Task Review dashboard:          */
// /*  plain fetch, BASE_URL (trailing slash) + path (no leading slash)   */
// /* ------------------------------------------------------------------ */
// const BASE_URL = "https://commtoolapi.mcpspmis.com/";
// const API_PATH = "ix_tracker_vi/HOTO_dashboard/";

// /* ------------------------------------------------------------------ */
// /*  Colors — teal theme, matching the sidebar (#006e74) with gradient  */
// /* ------------------------------------------------------------------ */
// const C = {
//     corner: "#004d52",       // top-left / dark teal
//     headerBg: "#00838f",     // column header medium teal
//     labelOdd: "#dbf2f2",     // circle label column - light teal
//     labelEven: "#eef9f9",    // circle label column - lighter teal
//     grandTotalBg: "#c9f7d6", // total row green
//     grandTotalText: "#0b6b3a",
//     zeroText: "#b7bfc9",
//     valueText: "#0d3a3c",
//     border: "#c3cbd6",
// };

// const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

// const PAGE_BG = "#fdece0"; // warm peach/orange page background

// const ROW_H = 37; // approx header row height, used for sticky offset of 2nd header row

// /* ------------------------------------------------------------------ */
// /*  Year helper                                                         */
// /* ------------------------------------------------------------------ */
// const defaultYear = () => String(new Date().getFullYear());

// /* ------------------------------------------------------------------ */
// /*  Helpers                                                             */
// /* ------------------------------------------------------------------ */
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

// /* ================================================================== */
// /*  TABLE 1: TOP 3 CIRCLES (Circle, Accepted, Rejected, Acceptance %)  */
// /* ================================================================== */
// function Top3CirclesTable({ title, rows, icon }) {
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
//                                         minWidth: 100,
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
//                                         minWidth: 100,
//                                     }}
//                                 >
//                                     Accepted
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
//                                     Rejected
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
//                                         minWidth: 100,
//                                     }}
//                                 >
//                                     Acceptance %
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

//                                 const labelBg = isGrandTotal ? C.grandTotalBg : i % 2 === 0 ? C.labelOdd : C.labelEven;

//                                 const accepted = row["Accepted"] ?? 0;
//                                 const rejected = row["Rejected"] ?? 0;
//                                 const acceptancePercent = row["Acceptance %"];

//                                 return (
//                                     <TableRow key={`${circle}-${i}`}>
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
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal ? C.grandTotalText : C.valueText,
//                                                 fontWeight: 700,
//                                             }}
//                                         >
//                                             {accepted}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal
//                                                     ? C.grandTotalText
//                                                     : rejected === 0
//                                                         ? C.zeroText
//                                                         : C.valueText,
//                                                 fontWeight: rejected === 0 && !isGrandTotal ? 400 : 700,
//                                             }}
//                                         >
//                                             {rejected}
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
//                                                 label={formatFtrPercent(acceptancePercent)}
//                                                 size="small"
//                                                 sx={{
//                                                     fontWeight: 800,
//                                                     fontSize: 11.5,
//                                                     color: isGrandTotal ? C.grandTotalText : C.valueText,
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

// /* ================================================================== */
// /*  TABLE 2: HIGHER PENDENCY CIRCLES (Circle, Accepted, Rejected, Pending) */
// /* ================================================================== */
// function HigherPendencyTable({ title, rows, icon }) {
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
//                                         minWidth: 100,
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
//                                         minWidth: 100,
//                                     }}
//                                 >
//                                     Accepted
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
//                                     Rejected
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
//                                     Pending
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

//                                 const labelBg = isGrandTotal ? C.grandTotalBg : i % 2 === 0 ? C.labelOdd : C.labelEven;

//                                 const accepted = row["Accepted"] ?? 0;
//                                 const rejected = row["Rejected"] ?? 0;
//                                 const pending = row["Pending"] ?? 0;

//                                 return (
//                                     <TableRow key={`${circle}-${i}`}>
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
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal ? C.grandTotalText : C.valueText,
//                                                 fontWeight: 700,
//                                             }}
//                                         >
//                                             {accepted}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal
//                                                     ? C.grandTotalText
//                                                     : rejected === 0
//                                                         ? C.zeroText
//                                                         : C.valueText,
//                                                 fontWeight: rejected === 0 && !isGrandTotal ? 400 : 700,
//                                             }}
//                                         >
//                                             {rejected}
//                                         </TableCell>
//                                         <TableCell
//                                             align="center"
//                                             sx={{
//                                                 position: "sticky",
//                                                 right: 0,
//                                                 bgcolor: isGrandTotal ? C.grandTotalBg : C.labelOdd,
//                                                 fontVariantNumeric: "tabular-nums",
//                                                 color: isGrandTotal
//                                                     ? C.grandTotalText
//                                                     : pending === 0
//                                                         ? C.zeroText
//                                                         : C.valueText,
//                                                 fontWeight: pending === 0 && !isGrandTotal ? 400 : 700,
//                                             }}
//                                         >
//                                             {pending}
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

// /* ================================================================== */
// /*  TABLE 3: WEEK WISE ACCEPTANCE (Year, Status, Week 1-39, Grand Total) */
// /* ================================================================== */
// function WeekWiseTable({ title, rows, icon }) {
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     if (!hasData) {
//         return (
//             <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
//                 <Box
//                     sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                         px: 2,
//                         py: 1.25,
//                         background: HEADER_GRADIENT,
//                     }}
//                 >
//                     {icon}
//                     <Typography
//                         variant="subtitle2"
//                         sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
//                     >
//                         {title}
//                     </Typography>
//                 </Box>
//                 <NoData compact />
//             </Paper>
//         );
//     }

//     // Get all week columns (Week 1, Week 2, ... Week 39)
//     const firstRow = rows[0];
//     const weekCols = Object.keys(firstRow)
//         .filter((k) => k.startsWith("Week "))
//         .sort((a, b) => {
//             const numA = parseInt(a.replace("Week ", ""));
//             const numB = parseInt(b.replace("Week ", ""));
//             return numA - numB;
//         });

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

//             <TableContainer sx={{ maxHeight: 560, overflowX: "auto" }}>
//                 <Table
//                     size="small"
//                     stickyHeader
//                     sx={{
//                         borderCollapse: "collapse",
//                         "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75, px: 0.5 },
//                     }}
//                 >
//                     <TableHead>
//                         <TableRow>
//                             <TableCell
//                                 sx={{
//                                     position: "sticky",
//                                     left: 0,
//                                     top: 0,
//                                     zIndex: 6,
//                                     bgcolor: C.corner,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     minWidth: 70,
//                                 }}
//                             >
//                                 Year
//                             </TableCell>
//                             <TableCell
//                                 sx={{
//                                     position: "sticky",
//                                     left: 70,
//                                     top: 0,
//                                     zIndex: 6,
//                                     bgcolor: C.corner,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     minWidth: 80,
//                                 }}
//                             >
//                                 Status
//                             </TableCell>
//                             {weekCols.map((col) => (
//                                 <TableCell
//                                     key={col}
//                                     align="center"
//                                     sx={{
//                                         position: "sticky",
//                                         top: 0,
//                                         zIndex: 4,
//                                         bgcolor: C.headerBg,
//                                         color: "#fff",
//                                         fontWeight: 700,
//                                         minWidth: 60,
//                                         fontSize: "11px",
//                                     }}
//                                 >
//                                     {col}
//                                 </TableCell>
//                             ))}
//                             <TableCell
//                                 align="center"
//                                 sx={{
//                                     position: "sticky",
//                                     top: 0,
//                                     right: 0,
//                                     zIndex: 5,
//                                     bgcolor: C.corner,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     minWidth: 80,
//                                 }}
//                             >
//                                 Grand Total
//                             </TableCell>
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>
//                         {rows.map((row, i) => {
//                             const year = row["Year"];
//                             const status = row["Status"];
//                             const isGrandTotal = status === "Total" || status === "Grand Total";
//                             const labelBg = isGrandTotal ? C.grandTotalBg : i % 2 === 0 ? C.labelOdd : C.labelEven;

//                             // Calculate grand total for this row
//                             let grandTotal = 0;
//                             weekCols.forEach((col) => {
//                                 const val = row[col] ?? 0;
//                                 grandTotal += typeof val === "number" ? val : parseInt(val) || 0;
//                             });

//                             return (
//                                 <TableRow key={`${year}-${status}-${i}`}>
//                                     <TableCell
//                                         sx={{
//                                             position: "sticky",
//                                             left: 0,
//                                             zIndex: 2,
//                                             bgcolor: labelBg,
//                                             fontWeight: 700,
//                                             color: isGrandTotal ? C.grandTotalText : C.corner,
//                                             whiteSpace: "nowrap",
//                                         }}
//                                     >
//                                         {year}
//                                     </TableCell>
//                                     <TableCell
//                                         sx={{
//                                             position: "sticky",
//                                             left: 70,
//                                             zIndex: 2,
//                                             bgcolor: labelBg,
//                                             fontWeight: 700,
//                                             color: isGrandTotal ? C.grandTotalText : C.corner,
//                                             whiteSpace: "nowrap",
//                                         }}
//                                     >
//                                         {status}
//                                     </TableCell>
//                                     {weekCols.map((col) => {
//                                         const val = row[col] ?? 0;
//                                         return (
//                                             <TableCell
//                                                 key={col}
//                                                 align="center"
//                                                 sx={{
//                                                     bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
//                                                     fontVariantNumeric: "tabular-nums",
//                                                     color: val === 0 ? C.zeroText : isGrandTotal ? C.grandTotalText : C.valueText,
//                                                     fontWeight: val === 0 && !isGrandTotal ? 400 : 700,
//                                                     fontSize: "12px",
//                                                 }}
//                                             >
//                                                 {val}
//                                             </TableCell>
//                                         );
//                                     })}
//                                     <TableCell
//                                         align="center"
//                                         sx={{
//                                             position: "sticky",
//                                             right: 0,
//                                             bgcolor: isGrandTotal ? C.grandTotalBg : C.labelOdd,
//                                             fontVariantNumeric: "tabular-nums",
//                                             color: isGrandTotal ? C.grandTotalText : C.corner,
//                                             fontWeight: 800,
//                                         }}
//                                     >
//                                         {grandTotal}
//                                     </TableCell>
//                                 </TableRow>
//                             );
//                         })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </Paper>
//     );
// }

// /* ================================================================== */
// /*  Main Dashboard                                                     */
// /* ================================================================== */
// function WeeklyComparison() {
//     const navigate = useNavigate();

//     const [tab, setTab] = useState(0); // 0 = Top 3, 1 = Higher Pendency, 2 = Week Wise
//     const [dashboard, setDashboard] = useState(null);
//     const [downloadLink, setDownloadLink] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(false);

//     // Year filter only
//     const [year, setYear] = useState(defaultYear());

//     // Race-condition guards
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
//             if (year) params.append("year", year);

//             const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
//             const res = await fetch(url, { signal: controller.signal });
//             const json = await res.json();

//             if (thisRequestId !== requestIdRef.current) return;

//             if (!json || !json.dashboard) {
//                 setDashboard(null);
//                 setDownloadLink(null);
//             } else {
//                 setDashboard(json.dashboard);
//                 setDownloadLink(json.weekly_comparison_download_link ?? null);
//             }
//         } catch (e) {
//             if (e.name === "AbortError") return;
//             console.error("WeeklyComparison fetchDashboard:", e);
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
//     }, [year]);

//     useEffect(() => {
//         fetchDashboard();
//         return () => {
//             if (abortControllerRef.current) {
//                 abortControllerRef.current.abort();
//             }
//         };
//     }, [fetchDashboard]);

//     // Extract data from dashboard
//     const weeklyComparison = dashboard?.["weekly comparison"] || {};
//     const top3Circles = weeklyComparison["top_3_circles"] || [];
//     const higherPendency = weeklyComparison["higher_pendency_circles"] || [];
//     const weekWiseAcceptance = weeklyComparison["week_wise_acceptance"] || [];
//     const dateInfo = dashboard?.["data contains period"];

//     const hasAnyData = !!dashboard;

//     // Shared sx for the dark-header TextField controls
//     const controlSx = {
//         bgcolor: "rgba(255,255,255,0.08)",
//         borderRadius: 1,
//         "& .MuiOutlinedInput-root": {
//             color: "#fff",
//             "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
//             "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
//             "&.Mui-focused fieldset": { borderColor: "#4fa3a8" },
//         },
//         "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.8)" },
//         "& .MuiSvgIcon-root": { color: "#fff" },
//     };

//     return (
//         <Slide direction="left" in="true" timeout={1000}>
//             <div>
//                 <Box sx={{ minHeight: "100%", width: "100%", fontFamily: "Roboto, sans-serif" }}>
//                     <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
//                         {/* Tabs Section */}
//                         <Box sx={{ mb: 3, display: "flex", gap: 1.5 }}>
//                             <Tabs
//                                 value={tab}
//                                 onChange={(e, newTab) => setTab(newTab)}
//                                 variant="scrollable"
//                                 scrollButtons="auto"
//                                 sx={{
//                                     backgroundColor: "#fff",
//                                     borderRadius: 10,
//                                     boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                                     "& .MuiTab-root": {
//                                         textTransform: "none",
//                                         fontWeight: 600,
//                                         fontSize: "14px",
//                                         color: C.corner,
//                                         borderRadius: "30px",
//                                         mx: 0.5,
//                                         padding: "8px 20px",
//                                         "&.Mui-selected": {
//                                             color: "#fff",
//                                             backgroundColor: C.corner,
//                                         },
//                                     },
//                                     "& .MuiTabs-indicator": { display: "none" },
//                                 }}
//                             >
//                                 <Tab label="🎯 Top 3 Circles" />
//                                 <Tab label="📍 Higher Pendency Circles" />
//                                 <Tab label="📊 Week Wise Acceptance" />
//                             </Tabs>
//                         </Box>

//                         {/* Header */}
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
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Stack direction="row" spacing={1.5} alignItems="center">
//                                 <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", width: 40, height: 40 }}>
//                                     <LayersIcon sx={{ color: "#bfe9e9" }} />
//                                 </Avatar>
//                                 <Box>
//                                     <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}>
//                                         Weekly Comparison Dashboard
//                                     </Typography>
//                                     <Typography
//                                         component="span"
//                                         variant="body2"
//                                         sx={{
//                                             color: "rgba(255,255,255,0.85)",
//                                             fontWeight: 400,
//                                             fontSize: "12px",
//                                         }}
//                                     >
//                                         {dateInfo || "Data loaded"}
//                                     </Typography>
//                                 </Box>
//                             </Stack>

//                             {/* Year filter only shown in Week Wise Acceptance tab (tab === 2) */}
//                             {tab === 2 && (
//                                 <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
//                                     <TextField
//                                         type="number"
//                                         size="small"
//                                         label="Year"
//                                         value={year}
//                                         onChange={(e) => setYear(e.target.value)}
//                                         InputLabelProps={{ shrink: true, sx: { color: "rgba(255,255,255,0.8)" } }}
//                                         sx={{ width: 110, ...controlSx }}
//                                     />

//                                     <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
//                                         <span>
//                                             <IconButton
//                                                 component={downloadLink ? "a" : "button"}
//                                                 href={downloadLink || undefined}
//                                                 disabled={!downloadLink}
//                                                 sx={{
//                                                     color: "#bfe9e9",
//                                                     bgcolor: "rgba(255,255,255,0.08)",
//                                                     "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
//                                                     "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
//                                                 }}
//                                             >
//                                                 <FileDownloadIcon />
//                                             </IconButton>
//                                         </span>
//                                     </Tooltip>
//                                 </Stack>
//                             )}

//                             {/* Download button only for other tabs */}
//                             {tab !== 2 && (
//                                 <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
//                                     <span>
//                                         <IconButton
//                                             component={downloadLink ? "a" : "button"}
//                                             href={downloadLink || undefined}
//                                             disabled={!downloadLink}
//                                             sx={{
//                                                 color: "#bfe9e9",
//                                                 bgcolor: "rgba(255,255,255,0.08)",
//                                                 "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
//                                                 "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" },
//                                             }}
//                                         >
//                                             <FileDownloadIcon />
//                                         </IconButton>
//                                     </span>
//                                 </Tooltip>
//                             )}
//                         </Paper>

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

//                         {/* Content - Tables */}
//                         {!loading && !error && hasAnyData && (
//                             <Stack spacing={3}>
//                                 {tab === 0 && (
//                                     <Top3CirclesTable
//                                         title="Top 3 Circles"
//                                         rows={top3Circles}
//                                         icon={<TrendingUpIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                     />
//                                 )}

//                                 {tab === 1 && (
//                                     <HigherPendencyTable
//                                         title="Higher Pendency Circles"
//                                         rows={higherPendency}
//                                         icon={<CellTowerIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                     />
//                                 )}

//                                 {tab === 2 && (
//                                     <WeekWiseTable
//                                         title="Week Wise Acceptance"
//                                         rows={weekWiseAcceptance}
//                                         icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
//                                     />
//                                 )}
//                             </Stack>
//                         )}
//                     </Box>
//                 </Box>
//             </div>
//         </Slide>
//     );
// }

// export default WeeklyComparison;

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
    Grid,
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
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

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

const CHART_COLORS = {
    accepted: "#28a745",
    rejected: "#d32f2f",
    pending: "#ff9800",
    primary: "#004d52",
    secondary: "#00838f",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

const PAGE_BG = "#fdece0";

const ROW_H = 37;

/* ------------------------------------------------------------------ */
/*  Year helper                                                         */
/* ------------------------------------------------------------------ */
const defaultYear = () => String(new Date().getFullYear());

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const todayLabel = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

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

/* ================================================================== */
/*  TABLE 1: TOP 3 CIRCLES WITH CHART                                 */
/* ================================================================== */
function Top3CirclesTable({ title, rows, icon }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

    // Prepare chart data
    const chartData = hasData
        ? rows
            .filter((row) => {
                const circle = row["Circle"];
                return !(
                    typeof circle === "string" &&
                    (circle.trim().toLowerCase() === "grand total" ||
                        circle.trim().toLowerCase() === "total")
                );
            })
            .map((row) => ({
                name: row["Circle"],
                Accepted: row["Accepted"] ?? 0,
                Rejected: row["Rejected"] ?? 0,
            }))
        : [];

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
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                        <XAxis dataKey="name" stroke={C.corner} />
                                        <YAxis stroke={C.corner} />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: `2px solid ${C.corner}`,
                                                borderRadius: 8,
                                            }}
                                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                        />
                                        <Legend />
                                        <Bar dataKey="Accepted" fill={CHART_COLORS.accepted} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Rejected" fill={CHART_COLORS.rejected} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Grid>

                        {/* Table */}
                        <Grid item xs={12} md={6}>
                            <TableContainer sx={{ maxHeight: 350 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    bgcolor: C.corner,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Circle
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.headerBg,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Accepted
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.headerBg,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Rejected
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.corner,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Acceptance %
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

                                            const labelBg = isGrandTotal
                                                ? C.grandTotalBg
                                                : i % 2 === 0
                                                    ? C.labelOdd
                                                    : C.labelEven;

                                            const accepted = row["Accepted"] ?? 0;
                                            const rejected = row["Rejected"] ?? 0;
                                            const acceptancePercent = row["Acceptance %"];

                                            return (
                                                <TableRow key={`${circle}-${i}`}>
                                                    <TableCell
                                                        sx={{
                                                            bgcolor: labelBg,
                                                            fontWeight: 700,
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : C.corner,
                                                        }}
                                                    >
                                                        {circle}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : C.valueText,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {accepted}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : rejected === 0
                                                                    ? C.zeroText
                                                                    : C.valueText,
                                                            fontWeight: rejected === 0 && !isGrandTotal ? 400 : 700,
                                                        }}
                                                    >
                                                        {rejected}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: labelBg,
                                                        }}
                                                    >
                                                        <Chip
                                                            label={formatFtrPercent(acceptancePercent)}
                                                            size="small"
                                                            sx={{
                                                                fontWeight: 800,
                                                                fontSize: 11.5,
                                                                color: isGrandTotal
                                                                    ? C.grandTotalText
                                                                    : C.valueText,
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
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Paper>
    );
}

/* ================================================================== */
/*  TABLE 2: HIGHER PENDENCY CIRCLES WITH CHART                       */
/* ================================================================== */
function HigherPendencyTable({ title, rows, icon }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

    const chartData = hasData
        ? rows
            .filter((row) => {
                const circle = row["Circle"];
                return !(
                    typeof circle === "string" &&
                    (circle.trim().toLowerCase() === "grand total" ||
                        circle.trim().toLowerCase() === "total")
                );
            })
            .map((row) => ({
                name: row["Circle"],
                Accepted: row["Accepted"] ?? 0,
                Rejected: row["Rejected"] ?? 0,
                Pending: row["Pending"] ?? 0,
            }))
        : [];

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
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={3}>
                        {/* Chart */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                                        <XAxis dataKey="name" stroke={C.corner} />
                                        <YAxis stroke={C.corner} />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: "#fff",
                                                border: `2px solid ${C.corner}`,
                                                borderRadius: 8,
                                            }}
                                            cursor={{ fill: "rgba(0,0,0,0.05)" }}
                                        />
                                        <Legend />
                                        <Bar dataKey="Accepted" fill={CHART_COLORS.accepted} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Rejected" fill={CHART_COLORS.rejected} radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="Pending" fill={CHART_COLORS.pending} radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Grid>

                        {/* Table */}
                        <Grid item xs={12} md={6}>
                            <TableContainer sx={{ maxHeight: 350 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    bgcolor: C.corner,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Circle
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.headerBg,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Accepted
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.headerBg,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Rejected
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{
                                                    bgcolor: C.corner,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Pending
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

                                            const labelBg = isGrandTotal
                                                ? C.grandTotalBg
                                                : i % 2 === 0
                                                    ? C.labelOdd
                                                    : C.labelEven;

                                            const accepted = row["Accepted"] ?? 0;
                                            const rejected = row["Rejected"] ?? 0;
                                            const pending = row["Pending"] ?? 0;

                                            return (
                                                <TableRow key={`${circle}-${i}`}>
                                                    <TableCell
                                                        sx={{
                                                            bgcolor: labelBg,
                                                            fontWeight: 700,
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : C.corner,
                                                        }}
                                                    >
                                                        {circle}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : C.valueText,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {accepted}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : rejected === 0
                                                                    ? C.zeroText
                                                                    : C.valueText,
                                                            fontWeight: rejected === 0 && !isGrandTotal ? 400 : 700,
                                                        }}
                                                    >
                                                        {rejected}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            bgcolor: isGrandTotal ? C.grandTotalBg : C.labelOdd,
                                                            color: isGrandTotal
                                                                ? C.grandTotalText
                                                                : pending === 0
                                                                    ? C.zeroText
                                                                    : C.valueText,
                                                            fontWeight: pending === 0 && !isGrandTotal ? 400 : 700,
                                                        }}
                                                    >
                                                        {pending}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Paper>
    );
}

/* ================================================================== */
/*  TABLE 3: WEEK WISE ACCEPTANCE WITH CHART                          */
/* ================================================================== */
function WeekWiseTable({ title, rows, icon }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

    if (!hasData) {
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
                <NoData compact />
            </Paper>
        );
    }

    const firstRow = rows[0];
    const weekCols = Object.keys(firstRow)
        .filter((k) => k.startsWith("Week "))
        .sort((a, b) => {
            const numA = parseInt(a.replace("Week ", ""));
            const numB = parseInt(b.replace("Week ", ""));
            return numA - numB;
        });

    // Prepare chart data for line chart (first row only - usually "Accepted")
    const acceptedRow = rows.find((r) => r["Status"] === "Accepted");
    const chartData = acceptedRow
        ? weekCols.map((week) => ({
            week: week,
            count: acceptedRow[week] ?? 0,
        }))
        : [];

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

            <Box sx={{ p: 2 }}>
                {/* Chart */}
                <Box sx={{ mb: 3, height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                            <XAxis dataKey="week" stroke={C.corner} />
                            <YAxis stroke={C.corner} />
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: `2px solid ${C.corner}`,
                                    borderRadius: 8,
                                }}
                                cursor={{ stroke: C.corner, strokeWidth: 2 }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke={CHART_COLORS.accepted}
                                dot={{ fill: CHART_COLORS.accepted, r: 5 }}
                                activeDot={{ r: 7 }}
                                name="Accepted"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Table */}
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Table size="small" stickyHeader>
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
                                        minWidth: 70,
                                    }}
                                >
                                    Year
                                </TableCell>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 70,
                                        top: 0,
                                        zIndex: 6,
                                        bgcolor: C.corner,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 80,
                                    }}
                                >
                                    Status
                                </TableCell>
                                {weekCols.map((col) => (
                                    <TableCell
                                        key={col}
                                        align="center"
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 4,
                                            bgcolor: C.headerBg,
                                            color: "#fff",
                                            fontWeight: 700,
                                            minWidth: 60,
                                            fontSize: "11px",
                                        }}
                                    >
                                        {col}
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
                                        minWidth: 80,
                                    }}
                                >
                                    Grand Total
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const year = row["Year"];
                                const status = row["Status"];
                                const isGrandTotal = status === "Total" || status === "Grand Total";
                                const labelBg = isGrandTotal
                                    ? C.grandTotalBg
                                    : i % 2 === 0
                                        ? C.labelOdd
                                        : C.labelEven;

                                let grandTotal = 0;
                                weekCols.forEach((col) => {
                                    const val = row[col] ?? 0;
                                    grandTotal += typeof val === "number" ? val : parseInt(val) || 0;
                                });

                                return (
                                    <TableRow key={`${year}-${status}-${i}`}>
                                        <TableCell
                                            sx={{
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                bgcolor: labelBg,
                                                fontWeight: 700,
                                                color: isGrandTotal
                                                    ? C.grandTotalText
                                                    : C.corner,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {year}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                position: "sticky",
                                                left: 70,
                                                zIndex: 2,
                                                bgcolor: labelBg,
                                                fontWeight: 700,
                                                color: isGrandTotal
                                                    ? C.grandTotalText
                                                    : C.corner,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {status}
                                        </TableCell>
                                        {weekCols.map((col) => {
                                            const val = row[col] ?? 0;
                                            return (
                                                <TableCell
                                                    key={col}
                                                    align="center"
                                                    sx={{
                                                        bgcolor: isGrandTotal ? C.grandTotalBg : "#fff",
                                                        color:
                                                            val === 0
                                                                ? C.zeroText
                                                                : isGrandTotal
                                                                    ? C.grandTotalText
                                                                    : C.valueText,
                                                        fontWeight: val === 0 && !isGrandTotal ? 400 : 700,
                                                        fontSize: "12px",
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
                                                color: isGrandTotal
                                                    ? C.grandTotalText
                                                    : C.corner,
                                                fontWeight: 800,
                                            }}
                                        >
                                            {grandTotal}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Paper>
    );
}

/* ================================================================== */
/*  Main Dashboard                                                     */
/* ================================================================== */
function WeeklyComparison() {
    const navigate = useNavigate();

    const [tab, setTab] = useState(0);
    const [dashboard, setDashboard] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [year, setYear] = useState(defaultYear());

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
            if (year) params.append("year", year);

            const url = `${BASE_URL}${API_PATH}${params.toString() ? `?${params.toString()}` : ""}`;
            const res = await fetch(url, { signal: controller.signal });
            const json = await res.json();

            if (thisRequestId !== requestIdRef.current) return;

            if (!json || !json.dashboard) {
                setDashboard(null);
                setDownloadLink(null);
            } else {
                setDashboard(json.dashboard);
                setDownloadLink(json.weekly_comparison_download_link ?? null);
            }
        } catch (e) {
            if (e.name === "AbortError") return;
            console.error("WeeklyComparison fetchDashboard:", e);
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
    }, [year]);

    useEffect(() => {
        fetchDashboard();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchDashboard]);

    const weeklyComparison = dashboard?.["weekly comparison"] || {};
    const top3Circles = weeklyComparison["top_3_circles"] || [];
    const higherPendency = weeklyComparison["higher_pendency_circles"] || [];
    const weekWiseAcceptance = weeklyComparison["week_wise_acceptance"] || [];
    const dateInfo = dashboard?.["data contains period"];

    const hasAnyData = !!dashboard;

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
                <Box sx={{ minHeight: "100%", width: "100%", fontFamily: "Roboto, sans-serif" }}>
                    <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
                        {/* Tabs Section */}
                        <Box sx={{ mb: 3, display: "flex", gap: 1.5 }}>
                            <Tabs
                                value={tab}
                                onChange={(e, newTab) => setTab(newTab)}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    "& .MuiTab-root": {
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        color: C.corner,
                                        borderRadius: "30px",
                                        mx: 0.5,
                                        padding: "8px 20px",
                                        "&.Mui-selected": {
                                            color: "#fff",
                                            backgroundColor: C.corner,
                                        },
                                    },
                                    "& .MuiTabs-indicator": { display: "none" },
                                }}
                            >
                                <Tab label="🎯 Top 3 Circles" />
                                <Tab label="📍 Higher Pendency Circles" />
                                <Tab label="📊 Week Wise Acceptance" />
                            </Tabs>
                        </Box>

                        {/* Header */}
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
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.3 }}
                                    >
                                        Weekly Comparison Dashboard
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{
                                            color: "rgba(255,255,255,0.85)",
                                            fontWeight: 400,
                                            fontSize: "12px",
                                        }}
                                    >
                                        {dateInfo || "Data loaded"}
                                    </Typography>
                                </Box>
                            </Stack>

                            {tab === 2 && (
                                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                    <TextField
                                        type="number"
                                        size="small"
                                        label="Year"
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                            sx: { color: "rgba(255,255,255,0.8)" },
                                        }}
                                        sx={{ width: 110, ...controlSx }}
                                    />

                                    <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
                                        <span>
                                            <IconButton
                                                component={downloadLink ? "a" : "button"}
                                                href={downloadLink || undefined}
                                                disabled={!downloadLink}
                                                sx={{
                                                    color: "#bfe9e9",
                                                    bgcolor: "rgba(255,255,255,0.08)",
                                                    "&:hover": {
                                                        bgcolor: "rgba(255,255,255,0.16)",
                                                    },
                                                    "&.Mui-disabled": {
                                                        color: "rgba(255,255,255,0.3)",
                                                    },
                                                }}
                                            >
                                                <FileDownloadIcon />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Stack>
                            )}

                            {tab !== 2 && (
                                <Tooltip title={downloadLink ? "Download Excel" : "No file available"}>
                                    <span>
                                        <IconButton
                                            component={downloadLink ? "a" : "button"}
                                            href={downloadLink || undefined}
                                            disabled={!downloadLink}
                                            sx={{
                                                color: "#bfe9e9",
                                                bgcolor: "rgba(255,255,255,0.08)",
                                                "&:hover": {
                                                    bgcolor: "rgba(255,255,255,0.16)",
                                                },
                                                "&.Mui-disabled": {
                                                    color: "rgba(255,255,255,0.3)",
                                                },
                                            }}
                                        >
                                            <FileDownloadIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}
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
                                <NoData
                                    label={
                                        error
                                            ? "No data found — could not reach the server"
                                            : "No data found"
                                    }
                                />
                            </Paper>
                        )}

                        {/* Content - Tables with Charts */}
                        {!loading && !error && hasAnyData && (
                            <Stack spacing={3}>
                                {tab === 0 && (
                                    <Top3CirclesTable
                                        title="Top 3 Circles - Analytics"
                                        rows={top3Circles}
                                        icon={<TrendingUpIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                    />
                                )}

                                {tab === 1 && (
                                    <HigherPendencyTable
                                        title="Higher Pendency Circles - Analytics"
                                        rows={higherPendency}
                                        icon={<CellTowerIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                    />
                                )}

                                {tab === 2 && (
                                    <WeekWiseTable
                                        title="Week Wise Acceptance - Analytics"
                                        rows={weekWiseAcceptance}
                                        icon={<AccessTimeIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />}
                                    />
                                )}
                            </Stack>
                        )}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
}

export default WeeklyComparison;