
// import React, { useEffect, useState, useRef } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     IconButton,
//     TextField,
//     Popover,
//     InputAdornment
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";

// // ── Month-Year Picker Component ──────────────────────────────────────────────
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// const currentYear = new Date().getFullYear();
// const YEARS = Array.from({ length: (currentYear + 50) - 1980 + 1 }, (_, i) => 1980 + i);

// const MonthYearPicker = ({ value, onChange }) => {
//     const [anchorEl, setAnchorEl] = useState(null);

//     const parsed   = value ? value.split(" ") : [];
//     const selMonth = parsed[0] || "";
//     const selYear  = parsed[1] ? parseInt(parsed[1]) : new Date().getFullYear();

//     const yearRefs = useRef({});

//     const handleOpen  = (e) => setAnchorEl(e.currentTarget);
//     const handleClose = () => setAnchorEl(null);

//     const handleSelect = (month, year) => {
//         onChange(`${month} ${year}`);
//         handleClose();
//     };

//     const handleThisMonth = () => {
//         const now   = new Date();
//         const label = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
//         onChange(label);
//         handleClose();
//     };

//     const handleClear = () => {
//         onChange("");
//         handleClose();
//     };

//     useEffect(() => {
//         if (anchorEl && yearRefs.current[selYear]) {
//             setTimeout(() => {
//                 yearRefs.current[selYear]?.scrollIntoView({ block: "center", behavior: "smooth" });
//             }, 50);
//         }
//     }, [anchorEl]);

//     return (
//         <>
//             <TextField
//                 size="small"
//                 label="Month"
//                 value={value || ""}
//                 onClick={handleOpen}
//                 InputProps={{
//                     readOnly: true,
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <CalendarMonthIcon fontSize="small" sx={{ color: "action.active", cursor: "pointer" }} />
//                         </InputAdornment>
//                     ),
//                     sx: { cursor: "pointer" }
//                 }}
//                 sx={{
//                     minWidth: 140,
//                     "& input": { cursor: "pointer" }
//                 }}
//             />

//             <Popover
//                 open={Boolean(anchorEl)}
//                 anchorEl={anchorEl}
//                 onClose={handleClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//                 transformOrigin={{ vertical: "top",    horizontal: "left" }}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 2,
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//                         overflow: "hidden",
//                         mt: 0.5,
//                     }
//                 }}
//             >
//                 <Box sx={{ width: 280 }}>
//                     <Box sx={{ display: "flex", height: 220 }}>

//                         {/* Left: Year list */}
//                         <Box
//                             sx={{
//                                 width: 80,
//                                 overflowY: "auto",
//                                 borderRight: "1px solid #e0e0e0",
//                                 py: 1,
//                                 "&::-webkit-scrollbar": { width: 4 },
//                                 "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
//                             }}
//                         >
//                             {YEARS.map((yr) => (
//                                 <Box
//                                     key={yr}
//                                     ref={(el) => (yearRefs.current[yr] = el)}
//                                     onClick={() => {
//                                         if (selMonth) onChange(`${selMonth} ${yr}`);
//                                     }}
//                                     sx={{
//                                         py: 0.8,
//                                         px: 1.5,
//                                         fontSize: 13,
//                                         cursor: "pointer",
//                                         fontWeight: yr === selYear ? 700 : 400,
//                                         color: yr === selYear ? "#1976d2" : "text.primary",
//                                         background: yr === selYear ? "#e3f2fd" : "transparent",
//                                         borderRadius: 1,
//                                         mx: 0.5,
//                                         "&:hover": { background: "#f5f5f5" },
//                                     }}
//                                 >
//                                     {yr}
//                                 </Box>
//                             ))}
//                         </Box>

//                         {/* Right: Month grid */}
//                         <Box
//                             sx={{
//                                 flex: 1,
//                                 display: "grid",
//                                 gridTemplateColumns: "repeat(4, 1fr)",
//                                 gap: 0.5,
//                                 p: 1.5,
//                                 alignContent: "start",
//                             }}
//                         >
//                             {MONTHS.map((m) => {
//                                 const isSelected = m === selMonth;
//                                 return (
//                                     <Box
//                                         key={m}
//                                         onClick={() => handleSelect(m, selYear)}
//                                         sx={{
//                                             py: 0.8,
//                                             textAlign: "center",
//                                             fontSize: 13,
//                                             cursor: "pointer",
//                                             borderRadius: 1.5,
//                                             fontWeight: isSelected ? 700 : 400,
//                                             color: isSelected ? "#fff" : "text.primary",
//                                             background: isSelected ? "#1976d2" : "transparent",
//                                             "&:hover": {
//                                                 background: isSelected ? "#1565c0" : "#f0f4ff",
//                                             },
//                                         }}
//                                     >
//                                         {m}
//                                     </Box>
//                                 );
//                             })}
//                         </Box>
//                     </Box>

//                     {/* Footer */}
//                     <Box
//                         sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             px: 2,
//                             py: 1,
//                             borderTop: "1px solid #e0e0e0",
//                             background: "#fafafa",
//                         }}
//                     >
//                         <Button size="small" onClick={handleClear} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>
//                             Clear
//                         </Button>
//                         <Button size="small" onClick={handleThisMonth} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>
//                             This month
//                         </Button>
//                     </Box>
//                 </Box>
//             </Popover>
//         </>
//     );
// };

// // ── Shared cell styles ───────────────────────────────────────────────────────
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

// const getCurrentMonthLabel = () => {
//     const now    = new Date();
//     const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//     return `${months[now.getMonth()]} ${now.getFullYear()}`;
// };

// // ── Helper: format a grand_total value ──────────────────────────────────────
// // Returns the value as-is if integer, otherwise 1 decimal place.
// const formatGrandTotal = (val) => {
//     const num = parseFloat(val);
//     if (isNaN(num)) return 0;
//     return Number.isInteger(num) ? num : num.toFixed(1);
// };

// const Dashboard = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse]     = useState(null);
//     const [activeType, setActiveType]       = useState("performance");
//     const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthLabel());

//     const fetchData = async () => {
//         action(true);
//         const api = activeType === "performance"
//             ? "performance_idploy/generate-performance/"
//             : "performance_idploy/generate-offered/";

//         const formData = new FormData();
//         formData.append("month", selectedMonth);
//         const res = await postData(api, formData);
//         console.log("api response", res);
//         if (res?.status) setApiResponse(res);
//         action(false);
//     };

//     useEffect(() => { fetchData(); }, [activeType, selectedMonth]);

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

//     const renderTable = () => {
//         // ── circle rows ──────────────────────────────────────────────────────
//         const data    = apiResponse?.data?.["4G"]?.circles || {};
//         const entries = Object.entries(data);

//         // ── FIX: read grand_total directly from API — no manual summation ───
//         const grandTotal = apiResponse?.data?.["4G"]?.grand_total || {};

//         const columns = [
//             { label: "<=12days",   key: "<=12days"   },
//             { label: "13-21days",  key: "13-21days"  },
//             { label: "22-30days",  key: "22-30days"  },
//             { label: ">30days",    key: ">30days"    },
//             { label: "Pending",    key: "Pending"    },
//             { label: "Total",      key: "Total"      },
//             { label: "%<12",       key: "%<12"       },   // ← was summed wrongly before
//             { label: "%<21",       key: "%<21"       },   // ← was summed wrongly before
//             { label: "%<22-30",    key: "%<22-30"    },   // ← was summed wrongly before
           
//         ];

//         const DARK_BLUE = "#1a3558";
//         const HEADER_BG = "#223354";
//         const TOTAL_BG  = "#b2f0c5";
//         const STRIPE    = "#f4f7fb";

//         return (
//             <Box
//                 mt={1}
//                 sx={{
//                     overflowX: "auto",
//                     borderRadius: 2,
//                     border: "1px solid #000000",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
//                 }}
//             >
//                 <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
//                     <thead>
//                         <tr>
//                             <th style={{ ...stickyCell, background: DARK_BLUE, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, letterSpacing: 1, zIndex: 3, border: "1px solid #2e4a70" }}>
                               
//                             </th>
//                             <th colSpan={columns.length} style={{ ...cellStyle, background: DARK_BLUE, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, paddingRight: 20, border: "1px solid #2e4a70" }}>
//                                 {selectedMonth.toUpperCase()}
//                             </th>
//                         </tr>
//                         <tr style={{ background: HEADER_BG }}>
//                             <th style={{ ...stickyCell, background: HEADER_BG, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70" }}>
//                                 Circle
//                             </th>
//                             {columns.map((col) => (
//                                 <th key={col.key} style={{ ...cellStyle, background: HEADER_BG, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70" }}>
//                                     {col.label}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {entries.length > 0 ? (
//                             entries.map(([circle, val], idx) => (
//                                 <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
//                                     <td style={{ ...stickyCell, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #000000", textAlign: "center" }}>
//                                         {circle}
//                                     </td>
//                                     {columns.map((col) => (
//                                         <td key={col.key} style={cellStyle}>
//                                             {val[col.key] ?? 0}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15, color: "#827f7f" }}>
//                                     No Data Available
//                                 </td>
//                             </tr>
//                         )}

//                         {/* ── Grand Total row — values from API grand_total key ── */}
//                         {entries.length > 0 && (
//                             <tr style={{ background: TOTAL_BG }}>
//                                 <td style={{ ...stickyCell, background: TOTAL_BG, fontWeight: 700, textAlign: "center", border: "1px solid #000000", fontSize: 14 }}>
//                                     Grand Total
//                                 </td>
//                                 {columns.map((col) => (
//                                     <td key={col.key} style={{ ...cellStyle, fontWeight: 700, border: "1px solid #000000", fontSize: 14 }}>
//                                         {/*
//                                             FIX: use grandTotal[col.key] directly from the API.
//                                             This ensures %<12, %<21, %<22-30 show the
//                                             correct pre-computed values (e.g. 15.7, 16.4, 0.0)
//                                             instead of a wrongly summed total across circles.
//                                         */}
//                                         {formatGrandTotal(grandTotal[col.key])}
//                                     </td>
//                                 ))}
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </Box>
//         );
//     };

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate('/tools/performance_at_tat')}>Performance At Tat</Link>
//                     <Typography color="text.primary">Dashboard</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">

//                     {/* Left: title + toggle */}
//                     <Box>
//                         <Typography variant="h5">
//                             {activeType === "performance" ? "Performance vs OA TAT" : "Offered vs OA TAT"}
//                         </Typography>
//                         <Box mt={1} display="flex" gap={1}>
//                             <Button
//                                 onClick={() => setActiveType("performance")}
//                                 variant={activeType === "performance" ? "contained" : "outlined"}
//                             >
//                                 Performance
//                             </Button>
//                             <Button
//                                 onClick={() => setActiveType("offered")}
//                                 variant={activeType === "offered" ? "contained" : "outlined"}
//                             >
//                                 Offered
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Right: MonthYearPicker + download */}
//                     <Box display="flex" gap={1} alignItems="center">
//                         <MonthYearPicker
//                             value={selectedMonth}
//                             onChange={setSelectedMonth}
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

//                 {renderTable()}
//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default Dashboard;
// import React, { useEffect, useState, useRef } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     IconButton,
//     TextField,
//     Popover,
//     InputAdornment
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";

// // ── Constants ────────────────────────────────────────────────────────────────
// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// const currentYear  = new Date().getFullYear();
// const currentMonth = new Date().getMonth(); // 0-indexed  Jan=0 … Dec=11

// // YEARS list stops at currentYear — no future years shown at all
// const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => 1980 + i);

// // ── Helper: is a "Mon YYYY" label in the future? ─────────────────────────────
// const isFutureMonth = (label) => {
//     if (!label) return false;
//     const [monthStr, yearStr] = label.split(" ");
//     const yr  = parseInt(yearStr);
//     const mon = MONTHS.indexOf(monthStr); // 0-indexed
//     if (isNaN(yr) || mon === -1) return false;
//     if (yr > currentYear) return true;
//     if (yr === currentYear && mon > currentMonth) return true;
//     return false;
// };

// // ── Month-Year Picker ────────────────────────────────────────────────────────
// const MonthYearPicker = ({ value, onChange }) => {
//     const [anchorEl, setAnchorEl] = useState(null);

//     const parsed   = value ? value.split(" ") : [];
//     const selMonth = parsed[0] || "";
//     const selYear  = parsed[1] ? parseInt(parsed[1]) : currentYear;

//     const yearRefs = useRef({});

//     const handleOpen  = (e) => setAnchorEl(e.currentTarget);
//     const handleClose = () => setAnchorEl(null);

//     const handleSelect = (month, year) => {
//         // Safety guard — ignore click if month is disabled (future)
//         const mon = MONTHS.indexOf(month);
//         if (year === currentYear && mon > currentMonth) return;
//         onChange(`${month} ${year}`);
//         handleClose();
//     };

//     const handleThisMonth = () => {
//         onChange(`${MONTHS[currentMonth]} ${currentYear}`);
//         handleClose();
//     };

//     const handleClear = () => {
//         onChange("");
//         handleClose();
//     };

//     useEffect(() => {
//         if (anchorEl && yearRefs.current[selYear]) {
//             setTimeout(() => {
//                 yearRefs.current[selYear]?.scrollIntoView({ block: "center", behavior: "smooth" });
//             }, 50);
//         }
//     }, [anchorEl]);

//     return (
//         <>
//             <TextField
//                 size="small"
//                 label="Month"
//                 value={value || ""}
//                 onClick={handleOpen}
//                 InputProps={{
//                     readOnly: true,
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <CalendarMonthIcon
//                                 fontSize="small"
//                                 sx={{ color: "action.active", cursor: "pointer" }}
//                             />
//                         </InputAdornment>
//                     ),
//                     sx: { cursor: "pointer" },
//                 }}
//                 sx={{ minWidth: 140, "& input": { cursor: "pointer" } }}
//             />

//             <Popover
//                 open={Boolean(anchorEl)}
//                 anchorEl={anchorEl}
//                 onClose={handleClose}
//                 anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//                 transformOrigin={{ vertical: "top",    horizontal: "left" }}
//                 PaperProps={{
//                     sx: {
//                         borderRadius: 2,
//                         boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//                         overflow: "hidden",
//                         mt: 0.5,
//                     },
//                 }}
//             >
//                 <Box sx={{ width: 280 }}>
//                     <Box sx={{ display: "flex", height: 220 }}>

//                         {/* ── Left: Year list (1980 → currentYear only) ── */}
//                         <Box
//                             sx={{
//                                 width: 80,
//                                 overflowY: "auto",
//                                 borderRight: "1px solid #e0e0e0",
//                                 py: 1,
//                                 "&::-webkit-scrollbar": { width: 4 },
//                                 "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
//                             }}
//                         >
//                             {YEARS.map((yr) => (
//                                 <Box
//                                     key={yr}
//                                     ref={(el) => (yearRefs.current[yr] = el)}
//                                     onClick={() => {
//                                         if (!selMonth) return;
//                                         // If switching to currentYear and selMonth is a future
//                                         // month, clamp it to currentMonth automatically
//                                         const mon = MONTHS.indexOf(selMonth);
//                                         const clampedMonth =
//                                             yr === currentYear && mon > currentMonth
//                                                 ? MONTHS[currentMonth]
//                                                 : selMonth;
//                                         onChange(`${clampedMonth} ${yr}`);
//                                     }}
//                                     sx={{
//                                         py: 0.8,
//                                         px: 1.5,
//                                         fontSize: 13,
//                                         cursor: "pointer",
//                                         fontWeight: yr === selYear ? 700 : 400,
//                                         color: yr === selYear ? "#1976d2" : "text.primary",
//                                         background: yr === selYear ? "#e3f2fd" : "transparent",
//                                         borderRadius: 1,
//                                         mx: 0.5,
//                                         "&:hover": { background: "#f5f5f5" },
//                                     }}
//                                 >
//                                     {yr}
//                                 </Box>
//                             ))}
//                         </Box>

//                         {/* ── Right: Month grid ── */}
//                         <Box
//                             sx={{
//                                 flex: 1,
//                                 display: "grid",
//                                 gridTemplateColumns: "repeat(4, 1fr)",
//                                 gap: 0.5,
//                                 p: 1.5,
//                                 alignContent: "start",
//                             }}
//                         >
//                             {MONTHS.map((m, idx) => {
//                                 const isSelected = m === selMonth;
//                                 // Disable months beyond today when viewing the current year
//                                 const isFuture = selYear === currentYear && idx > currentMonth;

//                                 return (
//                                     <Box
//                                         key={m}
//                                         onClick={() => !isFuture && handleSelect(m, selYear)}
//                                         sx={{
//                                             py: 0.8,
//                                             textAlign: "center",
//                                             fontSize: 13,
//                                             borderRadius: 1.5,
//                                             fontWeight: isSelected ? 700 : 400,
//                                             // Future → greyed, not clickable
//                                             cursor:     isFuture ? "not-allowed" : "pointer",
//                                             pointerEvents: isFuture ? "none" : "auto",
//                                             color: isFuture
//                                                 ? "#bdbdbd"
//                                                 : isSelected ? "#fff" : "text.primary",
//                                             background: isFuture
//                                                 ? "transparent"
//                                                 : isSelected ? "#1976d2" : "transparent",
//                                             "&:hover": !isFuture
//                                                 ? { background: isSelected ? "#1565c0" : "#f0f4ff" }
//                                                 : {},
//                                         }}
//                                     >
//                                         {m}
//                                     </Box>
//                                 );
//                             })}
//                         </Box>
//                     </Box>

//                     {/* ── Footer ── */}
//                     <Box
//                         sx={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             px: 2,
//                             py: 1,
//                             borderTop: "1px solid #e0e0e0",
//                             background: "#fafafa",
//                         }}
//                     >
//                         <Button
//                             size="small"
//                             onClick={handleClear}
//                             sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}
//                         >
//                             Clear
//                         </Button>
//                         <Button
//                             size="small"
//                             onClick={handleThisMonth}
//                             sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}
//                         >
//                             This month
//                         </Button>
//                     </Box>
//                 </Box>
//             </Popover>
//         </>
//     );
// };

// // ── Shared cell styles ───────────────────────────────────────────────────────
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

// const getCurrentMonthLabel = () => `${MONTHS[currentMonth]} ${currentYear}`;

// const formatGrandTotal = (val) => {
//     const num = parseFloat(val);
//     if (isNaN(num)) return 0;
//     return Number.isInteger(num) ? num : num.toFixed(1);
// };

// // ── Dashboard ────────────────────────────────────────────────────────────────
// const Dashboard = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse]     = useState(null);
//     const [activeType, setActiveType]       = useState("performance");
//     const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthLabel());

//     const fetchData = async () => {
//         // ── GUARD: skip API call entirely for future months ───────────────
//         if (isFutureMonth(selectedMonth)) {
//             setApiResponse(null);
//             return;
//         }

//         action(true);
//         const api = activeType === "performance"
//             ? "performance_idploy/generate-performance/"
//             : "performance_idploy/generate-offered/";

//         const formData = new FormData();
//         formData.append("month", selectedMonth);
//         const res = await postData(api, formData);
//         console.log("api response", res);
//         if (res?.status) setApiResponse(res);
//         else setApiResponse(null);
//         action(false);
//     };

//     useEffect(() => { fetchData(); }, [activeType, selectedMonth]);

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

//     const renderTable = () => {
//         const columns = [
//             { label: "<=12days",  key: "<=12days"  },
//             { label: "13-21days", key: "13-21days" },
//             { label: "22-30days", key: "22-30days" },
//             { label: ">30days",   key: ">30days"   },
//             { label: "Pending",   key: "Pending"   },
//             { label: "Total",     key: "Total"      },
//             { label: "%<12",      key: "%<12"      },
//             { label: "%<21",      key: "%<21"      },
//             { label: "%<22-30",   key: "%<22-30"   },
//         ];

//         const DARK_BLUE = "#1a3558";
//         const HEADER_BG = "#223354";
//         const TOTAL_BG  = "#b2f0c5";
//         const STRIPE    = "#f4f7fb";

//         // ── Future month selected → show friendly message, no table ──────
//         if (isFutureMonth(selectedMonth)) {
//             return (
//                 <Box
//                     mt={2}
//                     sx={{
//                         textAlign: "center",
//                         py: 6,
//                         border: "1px dashed #bdbdbd",
//                         borderRadius: 2,
//                         background: "#fafafa",
//                     }}
//                 >
//                     <Typography variant="body1" fontWeight={500} color="text.secondary">
//                         No Data Available
//                     </Typography>
//                     <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
//                         Data is not available for future months.
//                         Please select a month up to {MONTHS[currentMonth]} {currentYear}.
//                     </Typography>
//                 </Box>
//             );
//         }

//         const data       = apiResponse?.data?.["4G"]?.circles    || {};
//         const grandTotal = apiResponse?.data?.["4G"]?.grand_total || {};
//         const entries    = Object.entries(data);

//         return (
//             <Box
//                 mt={1}
//                 sx={{
//                     overflowX: "auto",
//                     borderRadius: 2,
//                     border: "1px solid #000000",
//                     boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                 }}
//             >
//                 <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
//                     <thead>
//                         <tr>
//                             <th style={{ ...stickyCell, background: DARK_BLUE, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, letterSpacing: 1, zIndex: 3, border: "1px solid #2e4a70" }}>
//                             </th>
//                             <th colSpan={columns.length} style={{ ...cellStyle, background: DARK_BLUE, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, paddingRight: 20, border: "1px solid #2e4a70" }}>
//                                 {selectedMonth.toUpperCase()}
//                             </th>
//                         </tr>
//                         <tr style={{ background: HEADER_BG }}>
//                             <th style={{ ...stickyCell, background: HEADER_BG, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70" }}>
//                                 Circle
//                             </th>
//                             {columns.map((col) => (
//                                 <th key={col.key} style={{ ...cellStyle, background: HEADER_BG, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70" }}>
//                                     {col.label}
//                                 </th>
//                             ))}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {entries.length > 0 ? (
//                             <>
//                                 {entries.map(([circle, val], idx) => (
//                                     <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
//                                         <td style={{ ...stickyCell, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #000000", textAlign: "center" }}>
//                                             {circle}
//                                         </td>
//                                         {columns.map((col) => (
//                                             <td key={col.key} style={cellStyle}>
//                                                 {val[col.key] ?? 0}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))}

//                                 {/* Grand Total — read directly from API grand_total */}
//                                 <tr style={{ background: TOTAL_BG }}>
//                                     <td style={{ ...stickyCell, background: TOTAL_BG, fontWeight: 700, textAlign: "center", border: "1px solid #000000", fontSize: 14 }}>
//                                         Grand Total
//                                     </td>
//                                     {columns.map((col) => (
//                                         <td key={col.key} style={{ ...cellStyle, fontWeight: 700, border: "1px solid #000000", fontSize: 14 }}>
//                                             {formatGrandTotal(grandTotal[col.key])}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             </>
//                         ) : (
//                             <tr>
//                                 <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15, color: "#827f7f" }}>
//                                     No Data Available
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </Box>
//         );
//     };

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate('/tools/performance_at_tat')}>Performance At Tat</Link>
//                     <Typography color="text.primary">Dashboard</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 <Box display="flex" justifyContent="space-between" alignItems="center">

//                     {/* Left: title + toggle */}
//                     <Box>
//                         <Typography variant="h5">
//                             {activeType === "performance" ? "Performance vs OA TAT" : "Offered vs OA TAT"}
//                         </Typography>
//                         <Box mt={1} display="flex" gap={1}>
//                             <Button
//                                 onClick={() => setActiveType("performance")}
//                                 variant={activeType === "performance" ? "contained" : "outlined"}
//                             >
//                                 Performance
//                             </Button>
//                             <Button
//                                 onClick={() => setActiveType("offered")}
//                                 variant={activeType === "offered" ? "contained" : "outlined"}
//                             >
//                                 Offered
//                             </Button>
//                         </Box>
//                     </Box>

//                     {/* Right: MonthYearPicker + download */}
//                     <Box display="flex" gap={1} alignItems="center">
//                         <MonthYearPicker
//                             value={selectedMonth}
//                             onChange={setSelectedMonth}
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

//                 {renderTable()}
//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default Dashboard;
import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    TextField,
    Popover,
    InputAdornment
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

// ── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentYear  = new Date().getFullYear();
const currentMonth = new Date().getMonth(); // 0-indexed

const YEARS = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => 1980 + i);

// Technology tabs
const TECH_TABS = [
    { key: "4G",   label: "4G"   },
    { key: "5G",   label: "5G"   },
    { key: "4G+5G", label: "4G+5G" },
];

const isFutureMonth = (label) => {
    if (!label) return false;
    const [monthStr, yearStr] = label.split(" ");
    const yr  = parseInt(yearStr);
    const mon = MONTHS.indexOf(monthStr);
    if (isNaN(yr) || mon === -1) return false;
    if (yr > currentYear) return true;
    if (yr === currentYear && mon > currentMonth) return true;
    return false;
};

// ── Month-Year Picker ────────────────────────────────────────────────────────
const MonthYearPicker = ({ value, onChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const parsed   = value ? value.split(" ") : [];
    const selMonth = parsed[0] || "";
    const selYear  = parsed[1] ? parseInt(parsed[1]) : currentYear;

    const yearRefs = useRef({});

    const handleOpen  = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleSelect = (month, year) => {
        const mon = MONTHS.indexOf(month);
        if (year === currentYear && mon > currentMonth) return;
        onChange(`${month} ${year}`);
        handleClose();
    };

    const handleThisMonth = () => {
        onChange(`${MONTHS[currentMonth]} ${currentYear}`);
        handleClose();
    };

    const handleClear = () => {
        onChange("");
        handleClose();
    };

    useEffect(() => {
        if (anchorEl && yearRefs.current[selYear]) {
            setTimeout(() => {
                yearRefs.current[selYear]?.scrollIntoView({ block: "center", behavior: "smooth" });
            }, 50);
        }
    }, [anchorEl]);

    return (
        <>
            <TextField
                size="small"
                label="Month"
                value={value || ""}
                onClick={handleOpen}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <CalendarMonthIcon
                                fontSize="small"
                                sx={{ color: "action.active", cursor: "pointer" }}
                            />
                        </InputAdornment>
                    ),
                    sx: { cursor: "pointer" },
                }}
                sx={{ minWidth: 140, "& input": { cursor: "pointer" } }}
            />

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        mt: 0.5,
                    },
                }}
            >
                <Box sx={{ width: 280 }}>
                    <Box sx={{ display: "flex", height: 220 }}>
                        {/* Year list */}
                        <Box
                            sx={{
                                width: 80,
                                overflowY: "auto",
                                borderRight: "1px solid #e0e0e0",
                                py: 1,
                                "&::-webkit-scrollbar": { width: 4 },
                                "&::-webkit-scrollbar-thumb": { background: "#ccc", borderRadius: 2 },
                            }}
                        >
                            {YEARS.map((yr) => (
                                <Box
                                    key={yr}
                                    ref={(el) => (yearRefs.current[yr] = el)}
                                    onClick={() => {
                                        if (!selMonth) return;
                                        const mon = MONTHS.indexOf(selMonth);
                                        const clampedMonth =
                                            yr === currentYear && mon > currentMonth
                                                ? MONTHS[currentMonth]
                                                : selMonth;
                                        onChange(`${clampedMonth} ${yr}`);
                                    }}
                                    sx={{
                                        py: 0.8, px: 1.5, fontSize: 13, cursor: "pointer",
                                        fontWeight: yr === selYear ? 700 : 400,
                                        color: yr === selYear ? "#1976d2" : "text.primary",
                                        background: yr === selYear ? "#e3f2fd" : "transparent",
                                        borderRadius: 1, mx: 0.5,
                                        "&:hover": { background: "#f5f5f5" },
                                    }}
                                >
                                    {yr}
                                </Box>
                            ))}
                        </Box>

                        {/* Month grid */}
                        <Box
                            sx={{
                                flex: 1, display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 0.5, p: 1.5, alignContent: "start",
                            }}
                        >
                            {MONTHS.map((m, idx) => {
                                const isSelected = m === selMonth;
                                const isFuture = selYear === currentYear && idx > currentMonth;
                                return (
                                    <Box
                                        key={m}
                                        onClick={() => !isFuture && handleSelect(m, selYear)}
                                        sx={{
                                            py: 0.8, textAlign: "center", fontSize: 13,
                                            borderRadius: 1.5, fontWeight: isSelected ? 700 : 400,
                                            cursor:     isFuture ? "not-allowed" : "pointer",
                                            pointerEvents: isFuture ? "none" : "auto",
                                            color: isFuture ? "#bdbdbd" : isSelected ? "#fff" : "text.primary",
                                            background: isFuture ? "transparent" : isSelected ? "#1976d2" : "transparent",
                                            "&:hover": !isFuture ? { background: isSelected ? "#1565c0" : "#f0f4ff" } : {},
                                        }}
                                    >
                                        {m}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1, borderTop: "1px solid #e0e0e0", background: "#fafafa" }}>
                        <Button size="small" onClick={handleClear} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>Clear</Button>
                        <Button size="small" onClick={handleThisMonth} sx={{ fontSize: 12, color: "#1976d2", textTransform: "none" }}>This month</Button>
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

// ── Shared cell styles ───────────────────────────────────────────────────────
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

const getCurrentMonthLabel = () => `${MONTHS[currentMonth]} ${currentYear}`;

const formatGrandTotal = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return Number.isInteger(num) ? num : num.toFixed(1);
};

// ── Tech tab accent colours ───────────────────────────────────────────────────
const TECH_COLORS = {
    "4G":   { active: "#1a3558", hover: "#1565c0", header: "#223354", subHeader: "#2F75B5" },
    "5G":   { active: "#1b5e20", hover: "#2e7d32", header: "#2e4a2e", subHeader: "#388e3c" },
    "4G+5G": { active: "#4a148c", hover: "#6a1b9a", header: "#3b2063", subHeader: "#7b1fa2" },
};

// ── Single technology table ───────────────────────────────────────────────────
const TechTable = ({ tech, apiResponse, selectedMonth }) => {
    const columns = [
        { label: "<=12days",  key: "<=12days"  },
        { label: "13-21days", key: "13-21days" },
        { label: "22-30days", key: "22-30days" },
        { label: ">30days",   key: ">30days"   },
        { label: "Pending",   key: "Pending"   },
        { label: "Total",     key: "Total"      },
        { label: "%<12",      key: "%<12"      },
        { label: "%<21",      key: "%<21"      },
        { label: "%<22-30",   key: "%<22-30"   },
    ];

    const colors   = TECH_COLORS[tech];
    const TOTAL_BG = "#b2f0c5";
    const STRIPE   = "#f4f7fb";

    if (isFutureMonth(selectedMonth)) {
        return (
            <Box mt={2} sx={{ textAlign: "center", py: 6, border: "1px dashed #bdbdbd", borderRadius: 2, background: "#fafafa" }}>
                <Typography variant="body1" fontWeight={500} color="text.secondary">No Data Available</Typography>
                <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                    Data is not available for future months. Please select a month up to {MONTHS[currentMonth]} {currentYear}.
                </Typography>
            </Box>
        );
    }

    // ✅ Key lookup supports "4G", "5G", "4+5G" from API response
    const data       = apiResponse?.data?.[tech]?.circles    || {};
    const grandTotal = apiResponse?.data?.[tech]?.grand_total || {};
    const entries    = Object.entries(data);

    return (
        <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #000000", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 600 }}>
                <thead>
                    {/* Month header row */}
                    <tr>
                        <th style={{ ...stickyCell, background: colors.active, color: "#efebeb", fontSize: 14, textAlign: "center", fontWeight: 700, letterSpacing: 1, zIndex: 3, border: "1px solid #2e4a70" }}>
                        </th>
                        <th colSpan={columns.length} style={{ ...cellStyle, background: colors.active, color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, letterSpacing: 0.5, paddingRight: 20, border: "1px solid #2e4a70" }}>
                            {selectedMonth.toUpperCase()}
                        </th>
                    </tr>
                    {/* Column header row */}
                    <tr style={{ background: colors.header }}>
                        <th style={{ ...stickyCell, background: colors.header, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70" }}>
                            Circle
                        </th>
                        {columns.map((col) => (
                            <th key={col.key} style={{ ...cellStyle, background: colors.header, color: "#fff", textAlign: "center", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70" }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {entries.length > 0 ? (
                        <>
                            {entries.map(([circle, val], idx) => (
                                <tr key={circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
                                    <td style={{ ...stickyCell, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #000000", textAlign: "center" }}>
                                        {circle}
                                    </td>
                                    {columns.map((col) => (
                                        <td key={col.key} style={cellStyle}>{val[col.key] ?? 0}</td>
                                    ))}
                                </tr>
                            ))}

                            {/* Grand Total */}
                            <tr style={{ background: TOTAL_BG }}>
                                <td style={{ ...stickyCell, background: TOTAL_BG, fontWeight: 700, textAlign: "center", border: "1px solid #000000", fontSize: 14 }}>
                                    Grand Total
                                </td>
                                {columns.map((col) => (
                                    <td key={col.key} style={{ ...cellStyle, fontWeight: 700, border: "1px solid #000000", fontSize: 14 }}>
                                        {formatGrandTotal(grandTotal[col.key])}
                                    </td>
                                ))}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} style={{ ...cellStyle, textAlign: "center", padding: 15, color: "#827f7f" }}>
                                No Data Available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Box>
    );
};

// ── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();

    const [apiResponse, setApiResponse]     = useState(null);
    const [activeType, setActiveType]       = useState("performance");
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthLabel());
    const [activeTech, setActiveTech]       = useState("4G");   // ✅ new: 4G | 5G | 4+5G

    const fetchData = async () => {
        if (isFutureMonth(selectedMonth)) {
            setApiResponse(null);
            return;
        }

        action(true);
        const api = activeType === "performance"
            ? "performance_idploy/generate-performance/"
            : "performance_idploy/generate-offered/";

        const formData = new FormData();
        formData.append("month", selectedMonth);
        const res = await postData(api, formData);
        console.log("api response", res);
        if (res?.status) setApiResponse(res);
        else setApiResponse(null);
        action(false);
    };

    useEffect(() => { fetchData(); }, [activeType, selectedMonth]);

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

    const techColor = TECH_COLORS[activeTech];

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate('/tools/performance_at_tat')}>Performance At Tat</Link>
                    <Typography color="text.primary">Dashboard</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* ── Top bar ── */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* Left: title + Performance/Offered toggle */}
                    <Box>
                        <Typography variant="h5">
                            {activeType === "performance" ? "Performance vs OA TAT" : "Offered vs OA TAT"}
                        </Typography>
                        <Box mt={1} display="flex" gap={1}>
                            <Button
                                onClick={() => setActiveType("performance")}
                                variant={activeType === "performance" ? "contained" : "outlined"}
                            >
                                Performance
                            </Button>
                            <Button
                                onClick={() => setActiveType("offered")}
                                variant={activeType === "offered" ? "contained" : "outlined"}
                            >
                                Offered
                            </Button>
                        </Box>
                    </Box>

                    {/* Right: month picker + download */}
                    <Box display="flex" gap={1} alignItems="center">
                        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />
                        <IconButton
                            onClick={handleDownload}
                            title="Download Excel"
                            disabled={!apiResponse?.download_url}
                        >
                            <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
                        </IconButton>
                    </Box>
                </Box>

                {/* ✅ Technology tabs: 4G | 5G | 4+5G */}
                <Box
                    mt={2}
                    sx={{
                        display: "flex",
                        gap: 0,
                        borderBottom: "2px solid #e0e0e0",
                    }}
                >
                    {TECH_TABS.map((tab) => {
                        const isActive = activeTech === tab.key;
                        const tColor = TECH_COLORS[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveTech(tab.key)}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    cursor: "pointer",
                                    fontWeight: isActive ? 700 : 500,
                                    fontSize: 14,
                                    color: isActive ? "#fff" : tColor.active,
                                    background: isActive ? tColor.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive ? `2px solid ${tColor.active}` : "2px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        background: isActive ? tColor.active : "#f0f4ff",
                                    },
                                    userSelect: "none",
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ✅ Table for currently selected technology tab */}
                <TechTable
                    tech={activeTech}
                    apiResponse={apiResponse}
                    selectedMonth={selectedMonth}
                />

                {loading}
            </Box>
        </>
    );
};

export default Dashboard;