// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     TextField,
//     Breadcrumbs,
//     Link,
//     Chip,
//     InputAdornment,
// } from "@mui/material";

// import DownloadIcon from "@mui/icons-material/Download";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";

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
//     { label: "SR_Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID" },
//     { label: "Circle",     key: "Circle" },
//     { label: "PAT",        key: "PAT" },
//     { label: "SAT",        key: "SAT" },
//     { label: "KAT",        key: "KAT" },
//     { label: "SCFT",       key: "SCFT" },
//     { label: "PAT Date",   key: "PAT Date" },
//     { label: "SAT Date",   key: "SAT Date" },
//     { label: "KAT Date",   key: "KAT Date" },
//     { label: "SCFT Date",  key: "SCFT Date" },
// ];

// // ── 5G Colour Theme ───────────────────────────────────────────────────────────
// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// // ── Status Cell Colour Helper ─────────────────────────────────────────────────
// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
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

// // ── Main Component ────────────────────────────────────────────────────────────
// const Performance_SR_Wise = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] = useState(null);
//     const [startDate, setStartDate] = useState(getDefaultStartDate());
//     const [endDate, setEndDate]     = useState(todayStr);

//     // ── Site ID / SR Site ID Search ───────────────────────────────────────
//     const [searchTerm, setSearchTerm] = useState("");

//     // ── Fetch ─────────────────────────────────────────────────────────────
//     const fetchData = async () => {
//         if (!startDate || !endDate) return;
//         if (startDate > endDate) return;

//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", startDate);
//             formData.append("end_date",   endDate);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
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

//     const rawRows = apiResponse?.data || [];

//     // ── Filtered Rows (by SR_Site ID or Site ID) ───────────────────────────
//     const tableRows = useMemo(() => {
//         const term = searchTerm.trim().toLowerCase();
//         if (!term) return rawRows;
//         return rawRows.filter((row) => {
//             const srSiteId = String(row?.["SR_Site ID"] ?? "").toLowerCase();
//             const siteId   = String(row?.["Site ID"] ?? "").toLowerCase();
//             return srSiteId.includes(term) || siteId.includes(term);
//         });
//     }, [rawRows, searchTerm]);

//     const dateRangeLabel = startDate && endDate ? `${startDate}  to  ${endDate}` : "";
//     const titleLabel   = dateRangeLabel ? `AT Report  |  ${dateRangeLabel}` : "AT Report";
//     const STRIPE       = "#f4f7fb";

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
//                         {/* ── Site ID / SR Site ID Search Box ── */}
//                         <TextField
//                             size="small"
//                             label="Search Site ID / SR Site ID"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             sx={{ minWidth: 220 }}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: searchTerm ? (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             size="small"
//                                             onClick={() => setSearchTerm("")}
//                                             title="Clear search"
//                                         >
//                                             <ClearIcon fontSize="small" />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ) : null,
//                             }}
//                         />

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
//                             minWidth: 900,
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
//                                             ...(col.key === "SR_Site ID"
//                                                 ? { position: "sticky", left: 0, zIndex: 3 }
//                                                 : {}),
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {COLUMNS.map((col) => {
//                                             const val      = row?.[col.key] ?? "-";
//                                             const isStatus = ["PAT", "SAT", "KAT", "SCFT"].includes(col.key);
//                                             const isFirst  = col.key === "SR_Site ID";

//                                             return (
//                                                 <td
//                                                     key={col.key}
//                                                     style={{
//                                                         ...(isFirst ? stickySt : cellSt),
//                                                         background: isFirst
//                                                             ? idx % 2 === 0 ? "#fff" : STRIPE
//                                                             : undefined,
//                                                         ...(isStatus ? getStatusStyle(val) : {}),
//                                                     }}
//                                                 >
//                                                     {val !== null && val !== undefined && val !== ""
//                                                         ? val
//                                                         : "-"}
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
//                                         {searchTerm
//                                             ? "No Matching Site ID / SR Site ID Found"
//                                             : "No Data Available"}
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
//                                 label={`${tableRows.length} / ${apiResponse?.total_sites ?? rawRows.length} rows`}
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

// export const MemoPerformance_SR_Wise = React.memo(Performance_SR_Wise);

// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     IconButton,
//     TextField,
//     Breadcrumbs,
//     Link,
//     Chip,
//     InputAdornment,
//     ToggleButtonGroup,
//     ToggleButton,
// } from "@mui/material";

// import DownloadIcon from "@mui/icons-material/Download";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import DateRangeIcon from "@mui/icons-material/DateRange";

// import { useNavigate } from "react-router-dom";

// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ── Constants ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];
// const currentMonthStr = todayStr.slice(0, 7); // "YYYY-MM"

// const getDefaultStartDate = () => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// // ── Month <-> Date Range Helpers ──────────────────────────────────────────────
// const getMonthStartDate = (yyyyMM) => `${yyyyMM}-01`;

// const getMonthEndDate = (yyyyMM) => {
//     const [y, m] = yyyyMM.split("-").map(Number);
//     const lastDay = new Date(y, m, 0).getDate();
//     const end = `${y}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
//     return end > todayStr ? todayStr : end;
// };

// // ── Table Columns ─────────────────────────────────────────────────────────────
// const COLUMNS = [
//     { label: "SR_Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID" },
//     { label: "Circle",     key: "Circle" },
//     { label:"MS Date", key:"MS Date"},
//     { label: "PAT",        key: "PAT" },
//     { label: "SAT",        key: "SAT" },
//     { label: "KAT",        key: "KAT" },
//     { label: "SCFT",       key: "SCFT" },
//     { label: "PAT Date",   key: "PAT Date" },
//     { label: "SAT Date",   key: "SAT Date" },
//     { label: "KAT Date",   key: "KAT Date" },
//     { label: "SCFT Date",  key: "SCFT Date" },
// ];

// // ── 5G Colour Theme ───────────────────────────────────────────────────────────
// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// // ── Status Cell Colour Helper ─────────────────────────────────────────────────
// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
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

// // ── Month / Date Range Toggle Styles ─────────────────────────────────────────
// const toggleWrapSt = {
//     background: "#fdece0",
//     borderRadius: "10px",
//     padding: "4px",
//     display: "flex",
//     gap: "4px",
// };

// const toggleBtnSt = {
//     textTransform: "none",
//     fontWeight: 600,
//     fontSize: 13,
//     border: "none",
//     borderRadius: "8px !important",
//     padding: "6px 14px",
//     color: "#5c4632",
//     "&.Mui-selected": {
//         background: "#1e2a5e",
//         color: "#fff",
//     },
//     "&.Mui-selected:hover": {
//         background: "#1e2a5e",
//     },
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const Performance_SR_Wise = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] = useState(null);

//     // ── Month / Date Range Toggle ──────────────────────────────────────────
//     const [dateMode, setDateMode] = useState("range"); // "month" | "range"
//     const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

//     const [startDate, setStartDate] = useState(getDefaultStartDate());
//     const [endDate, setEndDate]     = useState(todayStr);

//     // ── Effective dates sent to the API (derived from mode) ────────────────
//     const effectiveStartDate = dateMode === "month" ? getMonthStartDate(selectedMonth) : startDate;
//     const effectiveEndDate   = dateMode === "month" ? getMonthEndDate(selectedMonth) : endDate;

//     // ── Site ID / SR Site ID Search ───────────────────────────────────────
//     const [searchTerm, setSearchTerm] = useState("");

//     const handleModeChange = (_e, newMode) => {
//         if (newMode) setDateMode(newMode);
//     };

//     // ── Fetch ─────────────────────────────────────────────────────────────
//     const fetchData = async () => {
//         if (!effectiveStartDate || !effectiveEndDate) return;
//         if (effectiveStartDate > effectiveEndDate) return;

//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", effectiveStartDate);
//             formData.append("end_date",   effectiveEndDate);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
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
//     }, [effectiveStartDate, effectiveEndDate]);

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

//     const rawRows = apiResponse?.data || [];

//     // ── Filtered Rows (by SR_Site ID or Site ID) ───────────────────────────
//     const tableRows = useMemo(() => {
//         const term = searchTerm.trim().toLowerCase();
//         if (!term) return rawRows;
//         return rawRows.filter((row) => {
//             const srSiteId = String(row?.["SR_Site ID"] ?? "").toLowerCase();
//             const siteId   = String(row?.["Site ID"] ?? "").toLowerCase();
//             return srSiteId.includes(term) || siteId.includes(term);
//         });
//     }, [rawRows, searchTerm]);

//     const dateRangeLabel = effectiveStartDate && effectiveEndDate
//         ? `${effectiveStartDate}  to  ${effectiveEndDate}`
//         : "";
//     const titleLabel   = dateRangeLabel ? `AT Report  |  ${dateRangeLabel}` : "AT Report";
//     const STRIPE       = "#f4f7fb";

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
//                         {/* ── Site ID / SR Site ID Search Box ── */}
//                         <TextField
//                             size="small"
//                             label="Search Site ID / SR Site ID"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             sx={{ minWidth: 220 }}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: searchTerm ? (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             size="small"
//                                             onClick={() => setSearchTerm("")}
//                                             title="Clear search"
//                                         >
//                                             <ClearIcon fontSize="small" />
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ) : null,
//                             }}
//                         />

//                         {/* ── Month / Date Range Toggle ── */}
//                         <ToggleButtonGroup
//                             value={dateMode}
//                             exclusive
//                             onChange={handleModeChange}
//                             sx={toggleWrapSt}
//                         >
//                             <ToggleButton value="month" sx={toggleBtnSt}>
//                                 <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.6 }} />
//                                 Month
//                             </ToggleButton>
//                             <ToggleButton value="range" sx={toggleBtnSt}>
//                                 <DateRangeIcon sx={{ fontSize: 16, mr: 0.6 }} />
//                                 Date Range
//                             </ToggleButton>
//                         </ToggleButtonGroup>

//                         {dateMode === "month" ? (
//                             <TextField
//                                 size="small"
//                                 label="Month"
//                                 type="month"
//                                 value={selectedMonth}
//                                 onChange={(e) => {
//                                     if (e.target.value <= currentMonthStr)
//                                         setSelectedMonth(e.target.value);
//                                 }}
//                                 inputProps={{ max: currentMonthStr }}
//                                 InputLabelProps={{ shrink: true }}
//                                 sx={{ minWidth: 155 }}
//                             />
//                         ) : (
//                             <>
//                                 <TextField
//                                     size="small"
//                                     label="Start Date"
//                                     type="date"
//                                     value={startDate}
//                                     onChange={(e) => {
//                                         if (e.target.value <= todayStr)
//                                             setStartDate(e.target.value);
//                                     }}
//                                     inputProps={{ max: endDate || todayStr }}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minWidth: 155 }}
//                                 />

//                                 <Typography variant="body2" color="text.secondary">~</Typography>

//                                 <TextField
//                                     size="small"
//                                     label="End Date"
//                                     type="date"
//                                     value={endDate}
//                                     onChange={(e) => {
//                                         if (e.target.value <= todayStr)
//                                             setEndDate(e.target.value);
//                                     }}
//                                     inputProps={{ min: startDate, max: todayStr }}
//                                     InputLabelProps={{ shrink: true }}
//                                     sx={{ minWidth: 155 }}
//                                 />
//                             </>
//                         )}

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
//                             minWidth: 900,
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
//                                             ...(col.key === "SR_Site ID"
//                                                 ? { position: "sticky", left: 0, zIndex: 3 }
//                                                 : {}),
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {COLUMNS.map((col) => {
//                                             const val      = row?.[col.key] ?? "-";
//                                             const isStatus = ["PAT", "SAT", "KAT", "SCFT"].includes(col.key);
//                                             const isFirst  = col.key === "SR_Site ID";

//                                             return (
//                                                 <td
//                                                     key={col.key}
//                                                     style={{
//                                                         ...(isFirst ? stickySt : cellSt),
//                                                         background: isFirst
//                                                             ? idx % 2 === 0 ? "#fff" : STRIPE
//                                                             : undefined,
//                                                         ...(isStatus ? getStatusStyle(val) : {}),
//                                                     }}
//                                                 >
//                                                     {val !== null && val !== undefined && val !== ""
//                                                         ? val
//                                                         : "-"}
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
//                                         {searchTerm
//                                             ? "No Matching Site ID / SR Site ID Found"
//                                             : "No Data Available"}
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
//                                 label={`${tableRows.length} / ${apiResponse?.total_sites ?? rawRows.length} rows`}
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

// export const MemoPerformance_SR_Wise = React.memo(Performance_SR_Wise);


import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link,
    Chip,
    InputAdornment,
    ToggleButtonGroup,
    ToggleButton,
    Pagination,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";

import { useNavigate } from "react-router-dom";

import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Constants ────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const currentMonthStr = todayStr.slice(0, 7); // "YYYY-MM"
const ROWS_PER_PAGE = 25;

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
    { label: "SR_Site ID", key: "SR_Site ID" },
    { label: "Site ID",    key: "Site ID" },
    { label: "Circle",     key: "Circle" },
    { label:"MS Date", key:"MS Date"},
    { label: "PAT",        key: "PAT" },
    { label: "SAT",        key: "SAT" },
    { label: "KAT",        key: "KAT" },
    { label: "SCFT",       key: "SCFT" },
    { label: "PAT Date",   key: "PAT Date" },
    { label: "SAT Date",   key: "SAT Date" },
    { label: "KAT Date",   key: "KAT Date" },
    { label: "SCFT Date",  key: "SCFT Date" },
];

// ── 5G Colour Theme ───────────────────────────────────────────────────────────
const COLORS = {
    titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
    badge:    "#2e7d32",
    border:   "#1f4037",
};

// ── Status Cell Colour Helper ─────────────────────────────────────────────────
const getStatusStyle = (value) => {
    if (!value || value === "-" || value === "") return {};
    const v = String(value).toLowerCase();
    if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
    if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
    if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
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

// ── Main Component ────────────────────────────────────────────────────────────
const Performance_SR_Wise = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse] = useState(null);

    // ── Month / Date Range Toggle ──────────────────────────────────────────
    const [dateMode, setDateMode] = useState("range"); // "month" | "range"
    const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

    const [startDate, setStartDate] = useState(getDefaultStartDate());
    const [endDate, setEndDate]     = useState(todayStr);

    // ── Effective dates sent to the API (derived from mode) ────────────────
    const effectiveStartDate = dateMode === "month" ? getMonthStartDate(selectedMonth) : startDate;
    const effectiveEndDate   = dateMode === "month" ? getMonthEndDate(selectedMonth) : endDate;

    // ── Site ID / SR Site ID Search ───────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState("");

    // ── Pagination (25 rows per page) ──────────────────────────────────────
    const [page, setPage] = useState(1);

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
            formData.append("end_date",   effectiveEndDate);

            const res = await postData(
                "performance_idploy/generate-performance-at-srwise-report/",
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

    // ── Reset to page 1 whenever the underlying data or search term changes ──
    useEffect(() => {
        setPage(1);
    }, [apiResponse, searchTerm]);

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

    const rawRows = apiResponse?.data || [];

    // ── Filtered Rows (by SR_Site ID or Site ID) ───────────────────────────
    const tableRows = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return rawRows;
        return rawRows.filter((row) => {
            const srSiteId = String(row?.["SR_Site ID"] ?? "").toLowerCase();
            const siteId   = String(row?.["Site ID"] ?? "").toLowerCase();
            return srSiteId.includes(term) || siteId.includes(term);
        });
    }, [rawRows, searchTerm]);

    // ── Page slice (25 rows per page) ──────────────────────────────────────
    const pageCount = Math.max(1, Math.ceil(tableRows.length / ROWS_PER_PAGE));
    const pagedRows = useMemo(() => {
        const start = (page - 1) * ROWS_PER_PAGE;
        return tableRows.slice(start, start + ROWS_PER_PAGE);
    }, [tableRows, page]);

    const dateRangeLabel = effectiveStartDate && effectiveEndDate
        ? `${effectiveStartDate}  to  ${effectiveEndDate}`
        : "";
    const titleLabel   = dateRangeLabel ? `AT Report  |  ${dateRangeLabel}` : "AT Report";
    const STRIPE       = "#f4f7fb";

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
                        {/* ── Site ID / SR Site ID Search Box ── */}
                        <TextField
                            size="small"
                            label="Search Site ID / SR Site ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 220 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm ? (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearchTerm("")}
                                            title="Clear search"
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }}
                        />

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
                            minWidth: 900,
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
                                            ...(col.key === "SR_Site ID"
                                                ? { position: "sticky", left: 0, zIndex: 3 }
                                                : {}),
                                        }}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {pagedRows.length > 0 ? (
                                pagedRows.map((row, idx) => (
                                    <tr
                                        key={`${row["SR_Site ID"]}-${idx}`}
                                        style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                    >
                                        {COLUMNS.map((col) => {
                                            const val      = row?.[col.key] ?? "-";
                                            const isStatus = ["PAT", "SAT", "KAT", "SCFT"].includes(col.key);
                                            const isFirst  = col.key === "SR_Site ID";

                                            return (
                                                <td
                                                    key={col.key}
                                                    style={{
                                                        ...(isFirst ? stickySt : cellSt),
                                                        background: isFirst
                                                            ? idx % 2 === 0 ? "#fff" : STRIPE
                                                            : undefined,
                                                        ...(isStatus ? getStatusStyle(val) : {}),
                                                    }}
                                                >
                                                    {val !== null && val !== undefined && val !== ""
                                                        ? val
                                                        : "-"}
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
                                        {searchTerm
                                            ? "No Matching Site ID / SR Site ID Found"
                                            : "No Data Available"}
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
                                label={`${pagedRows.length} of ${tableRows.length} (Page ${page} / ${pageCount})`}
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

                {/* ── Pagination (25 rows per page) ── */}
                {tableRows.length > ROWS_PER_PAGE && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(_e, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                )}

                {loading}
            </Box>
        </>
    );
};

export const MemoPerformance_SR_Wise = React.memo(Performance_SR_Wise);