// import React, { useEffect, useState } from "react";
// import { Box, Typography, IconButton, TextField } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";

// // ── Constants ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];

// const getDefaultStartDate = () => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// // Convert "01-Jan-2026" → "2026-01-01"
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

// // ── Tech tabs ────────────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G",    label: "4G"    },
//     { key: "5G",    label: "5G"    },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ── Fixed columns (keys must match backend response exactly) ─────────────────
// const COLUMNS = [
//     { label: "Total Site",                        key: "Total Site"                        },
//     { label: "Pending",                           key: "Pending"                           },
//     { label: "Accepted with 0 counter",           key: "Accepted with 0 counter"           },
//     { label: "Acceptance pending with 0 Counter", key: "Acceptance pending with 0 Counter" },
//     { label: "SCFT FTR",                          key: "SCFT FTR"                          },
// ];

// // ── Tech colours ─────────────────────────────────────────────────────────────
// const TECH_COLORS = {
//     "4G": {
//         active:   "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         header:   "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
//         tabColor: "#1e3c72",
//     },
//     "5G": {
//         active:   "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         header:   "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//         tabColor: "#134e5e",
//     },
//     "4G+5G": {
//         active:   "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
//         header:   "linear-gradient(135deg, #252326 0%, #414345 100%)",
//         tabColor: "#41295a",
//     },
// };

// // ── Shared cell styles ────────────────────────────────────────────────────────
// const cellSt = {
//     padding:    "4px 8px",
//     border:     "1px solid #c0c0c0",
//     textAlign:  "center",
//     fontSize:   13,
//     whiteSpace: "nowrap",
// };

// const stickySt = {
//     ...cellSt,
//     position:   "sticky",
//     left:        0,
//     zIndex:      2,
//     textAlign:  "center",
//     fontWeight:  600,
// };

// // ── TechTable ─────────────────────────────────────────────────────────────────
// const TechTable = ({ tech, apiResponse, confirmedRange }) => {
//     const colors   = TECH_COLORS[tech];
//     const TOTAL_BG = "#b2f0c5";
//     const STRIPE   = "#f4f7fb";

//     // All data from backend
//     const data       = apiResponse?.data?.[tech]?.Circle    || {};
//     // const grandTotal = apiResponse?.data?.[tech]?.Grand_Total || {};
//     const entries    = Object.entries(data);

//     const titleLabel = confirmedRange.start && confirmedRange.end
//         ? `SCFT  |  ${confirmedRange.start}  to  ${confirmedRange.end}  |  ${tech}`
//         : "Loading...";

//     return (
//         <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #c0c0c0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 500 }}>
//                 <thead>
//                     {/* Title row */}
//                     <tr>
//                         <th
//                             colSpan={COLUMNS.length + 1}
//                             style={{ ...cellSt, background: colors.active, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", padding: "8px 12px", border: "1px solid #2e4a70" }}
//                         >
//                             {titleLabel}
//                         </th>
//                     </tr>

//                     {/* Column header row */}
//                     <tr>
//                         <th style={{ ...stickySt, background: colors.header, color: "#fff", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70", padding: "6px 12px" }}>
//                             Circle
//                         </th>
//                         {COLUMNS.map((col) => (
//                             <th key={col.key} style={{ ...cellSt, background: colors.header, color: "#fff", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70", padding: "6px 10px" }}>
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
//                                     <td style={{ ...stickySt, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #c0c0c0" }}>
//                                         {circle}
//                                     </td>
//                                     {COLUMNS.map((col) => (
//                                         <td key={col.key} style={cellSt}>
//                                             {val[col.key] ?? 0}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}

//                             {/* Grand Total row */}
//                             <tr style={{ background: TOTAL_BG, fontWeight: 700 }}>
//                                 <td style={{ ...stickySt, background: TOTAL_BG, border: "1px solid #c0c0c0", fontSize: 14 }}>
//                                     Grand Total
//                                 </td>
//                                 {COLUMNS.map((col) => (
//                                     <td key={col.key} style={{ ...cellSt, fontWeight: 700, fontSize: 14 }}>
//                                         {grandTotal[col.key] ?? 0}
//                                     </td>
//                                 ))}
//                             </tr>
//                         </>
//                     ) : (
//                         <tr>
//                             <td colSpan={COLUMNS.length + 1} style={{ ...cellSt, padding: 20, color: "#9e9e9e", fontSize: 14 }}>
//                                 No Data Available
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </Box>
//     );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const SCFT_FTR = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse,    setApiResponse]   = useState(null);
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

//         const displayStart = rangeRes.start_date;
//         const displayEnd   = rangeRes.end_date;
//         setConfirmedRange({ start: displayStart, end: displayEnd });

//         const apiStart = toYYYYMMDD(displayStart);
//         const apiEnd   = toYYYYMMDD(displayEnd);

//         // Step 2: Fetch SCFT data
//         const genForm = new FormData();
//         genForm.append("start_date", apiStart);
//         genForm.append("end_date",   apiEnd);
//         const res = await postData("performance_idploy/generate-scft/", genForm);

//         if (res?.status) setApiResponse(res);
//         action(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, [startDate, endDate]);

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

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At Tat</Link>
//                     <Typography color="text.primary">SCFT FTR</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top bar */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>

//                     {/* Left: title only */}
//                     <Typography variant="h5" fontWeight={700}>SCFT FTR Dashboard</Typography>

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

//                 {/* Technology tabs */}
//                 <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
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
//                                     borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
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
//                     confirmedRange={confirmedRange}
//                 />

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SCFT_FTR;

// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import { Breadcrumbs, Link } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";

// // ── Constants ────────────────────────────────────────────────────────────────
// const todayStr = new Date().toISOString().split("T")[0];

// const getDefaultStartDate = () => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// const toYYYYMMDD = (dateStr) => {
//     if (!dateStr) return "";
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
//     const MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
//     const parts = dateStr.split("-");
//     if (parts.length === 3 && MONTHS[parts[1]]) {
//         return `${parts[2]}-${MONTHS[parts[1]]}-${parts[0].padStart(2, "0")}`;
//     }
//     return dateStr;
// };

// // ── Tech tabs ────────────────────────────────────────────────────────────────
// const TECH_TABS = [
//     { key: "4G", label: "4G" },
//     { key: "5G", label: "5G" },
//     { key: "4G+5G", label: "4G+5G" },
// ];

// // ── Type tabs ────────────────────────────────────────────────────────────────
// const TYPE_TABS = [

//     { key: "scft", label: "SCFT FTR", api: "performance_idploy/generate-scft/" }

// ];

// // ── Fixed columns matching API response keys exactly ─────────────────────────
// const COLUMNS = [
//     { label: "Total Site", key: "Total Site" },
//     { label: "Pending", key: "Pending" },
//     { label: "Accepted with 0 counter", key: "Accepted with 0 counter" },
//     { label: "Acceptance pending with 0 Counter", key: "Acceptance pending with 0 Counter" },
//     { label: "SCFT FTR", key: "SCFT FTR" },
// ];

// // ── Tech colours ─────────────────────────────────────────────────────────────
// const TECH_COLORS = {
//     "4G": {
//         active: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
//         header: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
//         tabColor: "#1e3c72",
//     },
//     "5G": {
//         active: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//         header: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//         tabColor: "#134e5e",
//     },
//     "4G+5G": {
//         active: "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
//         header: "linear-gradient(135deg, #252326 0%, #414345 100%)",
//         tabColor: "#41295a",
//     },
// };

// // ── Shared cell styles ────────────────────────────────────────────────────────
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

// // ── TechTable ─────────────────────────────────────────────────────────────────
// const TechTable = ({ tech, activeType, apiResponse }) => {
//     const colors = TECH_COLORS[tech];
//     const TOTAL_BG = "#b2f0c5";
//     const STRIPE = "#f4f7fb";

//     // API returns flat array — separate circle rows from Grand Total
//     const rawData = apiResponse?.data?.[tech] || [];
//     const circleRows = rawData.filter((row) => row.Circle !== "Grand Total");
//     const grandTotal = rawData.find((row) => row.Circle === "Grand Total") || {};

//     // Title uses date_range directly from API response
//     // const typeLabel = TYPE_TABS.find((t) => t.key === activeType)?.label || "";
//     // const titleLabel = apiResponse?.date_range
//     //     ? `${typeLabel}  |  ${apiResponse.date_range}  |  ${tech}`
//     //     : "Loading...";
//     const titleLabel = apiResponse?.date_range
//         ? `SCFT  |  ${apiResponse.date_range}  |  ${tech}`
//         : "Loading...";

//     return (
//         <Box mt={1} sx={{ overflowX: "auto", borderRadius: 2, border: "1px solid #c0c0c0", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
//             <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto", minWidth: 500 }}>
//                 <thead>
//                     {/* Title row */}
//                     <tr>
//                         <th
//                             colSpan={COLUMNS.length + 1}
//                             style={{ ...cellSt, background: colors.active, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", padding: "8px 12px", border: "1px solid #2e4a70" }}
//                         >
//                             {titleLabel}
//                         </th>
//                     </tr>

//                     {/* Column header row */}
//                     <tr>
//                         <th style={{ ...stickySt, background: colors.header, color: "#fff", fontSize: 13, fontWeight: 700, zIndex: 3, border: "1px solid #2e4a70", padding: "6px 12px" }}>
//                             Circle
//                         </th>
//                         {COLUMNS.map((col) => (
//                             <th key={col.key} style={{ ...cellSt, background: colors.header, color: "#fff", fontWeight: 700, fontSize: 13, border: "1px solid #2e4a70", padding: "6px 10px" }}>
//                                 {col.label}
//                             </th>
//                         ))}
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {circleRows.length > 0 ? (
//                         <>
//                             {circleRows.map((row, idx) => (
//                                 <tr key={row.Circle} style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}>
//                                     <td style={{ ...stickySt, background: idx % 2 === 0 ? "#fff" : STRIPE, border: "1px solid #c0c0c0" }}>
//                                         {row.Circle}
//                                     </td>
//                                     {COLUMNS.map((col) => (
//                                         <td key={col.key} style={cellSt}>
//                                             {row[col.key] ?? 0}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))}

//                             {/* Grand Total row */}
//                             <tr style={{ background: TOTAL_BG, fontWeight: 700 }}>
//                                 <td style={{ ...stickySt, background: TOTAL_BG, border: "1px solid #c0c0c0", fontSize: 14 }}>
//                                     Grand Total
//                                 </td>
//                                 {COLUMNS.map((col) => (
//                                     <td key={col.key} style={{ ...cellSt, fontWeight: 700, fontSize: 14 }}>
//                                         {grandTotal[col.key] ?? 0}
//                                     </td>
//                                 ))}
//                             </tr>
//                         </>
//                     ) : (
//                         <tr>
//                             <td colSpan={COLUMNS.length + 1} style={{ ...cellSt, padding: 20, color: "#9e9e9e", fontSize: 14 }}>
//                                 No Data Available
//                             </td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </Box>
//     );
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const SCFT_FTR = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();

//     const [apiResponse, setApiResponse] = useState(null);
//     const [activeType, setActiveType] = useState("scft");
//     const [startDate, setStartDate] = useState(getDefaultStartDate());
//     const [endDate, setEndDate] = useState(todayStr);
//     const [activeTech, setActiveTech] = useState("4G");

//     const fetchData = async () => {
//         if (!startDate || !endDate) return;
//         if (startDate > endDate) return;

//         action(true);
//         setApiResponse(null);

//         // Step 1: Validate / confirm date range
//         const rangeForm = new FormData();
//         rangeForm.append("start_date", startDate);
//         rangeForm.append("end_date", endDate);
//         const rangeRes = await postData("performance_idploy/date-range-selection/", rangeForm);

//         if (!rangeRes?.status) {
//             action(false);
//             return;
//         }

//         const apiStart = toYYYYMMDD(rangeRes.start_date);
//         const apiEnd = toYYYYMMDD(rangeRes.end_date);

//         // Step 2: Generate report for active type
//         // const typeTab = TYPE_TABS.find((t) => t.key === activeType);
//         const genForm = new FormData();
//         genForm.append("start_date", apiStart);
//         genForm.append("end_date", apiEnd);
//        const res = await postData("performance_idploy/generate-scft/", genForm);
       
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

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At Tat</Link>
//                     <Typography color="text.primary">SCFT FTR</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top bar */}
//                 <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>

//                     {/* Left: title + type toggles */}
//                     <Box>
//                         <Typography variant="h5" fontWeight={700}>SCFT FTR Dashboard</Typography>
//                         {/* <Box mt={1} display="flex" gap={1} flexWrap="wrap">
//                             {TYPE_TABS.map((tab) => (
//                                 <Button
//                                     key={tab.key}
//                                     size="small"
//                                     variant={activeType === tab.key ? "contained" : "outlined"}
//                                     onClick={() => setActiveType(tab.key)}
//                                 >
//                                     {tab.label}
//                                 </Button>
//                             ))}
//                         </Box> */}
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

//                 {/* Technology tabs */}
//                 <Box mt={2} sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
//                     {TECH_TABS.map((tab) => {
//                         const isActive = activeTech === tab.key;
//                         const tColor = TECH_COLORS[tab.key];
//                         return (
//                             <Box
//                                 key={tab.key}
//                                 onClick={() => setActiveTech(tab.key)}
//                                 sx={{
//                                     px: 3, py: 1,
//                                     cursor: "pointer",
//                                     userSelect: "none",
//                                     fontWeight: isActive ? 700 : 500,
//                                     fontSize: 14,
//                                     color: isActive ? "#fff" : tColor.tabColor,
//                                     background: isActive ? tColor.active : "transparent",
//                                     borderRadius: "6px 6px 0 0",
//                                     borderBottom: isActive ? `3px solid ${tColor.tabColor}` : "3px solid transparent",
//                                     transition: "all 0.2s",
//                                     "&:hover": { background: isActive ? tColor.active : "#f0f4ff" },
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
//                     activeType={activeType}
//                     apiResponse={apiResponse}
//                 />

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SCFT_FTR;

import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    Breadcrumbs,
    Link,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { useNavigate } from "react-router-dom";

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

// ── Technology Tabs ──────────────────────────────────────────────────────────
const TECH_TABS = [
    { key: "4G", label: "4G" },
    { key: "5G", label: "5G" },
    { key: "4G+5G", label: "4G+5G" },
];

// ── Table Columns ───────────────────────────────────────────────────────────
const COLUMNS = [
    {
        label: "Total Site",
        key: "Total Site",
    },
    {
        label: "Pending",
        key: "Pending",
    },
    {
        label: "Accepted with 0 counter",
        key: "Accepted with 0 counter",
    },
    {
        label: "Acceptance pending with 0 Counter",
        key: "Acceptance pending with 0 Counter",
    },
    {
        label: "SCFT FTR",
        key: "SCFT FTR",
    },
];

// ── Tech Colours ────────────────────────────────────────────────────────────
const TECH_COLORS = {
    "4G": {
        active:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        header:
            "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        tabColor: "#1e3c72",
    },

    "5G": {
        active:
            "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        header:
            "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
        tabColor: "#134e5e",
    },

    "4G+5G": {
        active:
            "linear-gradient(135deg, #41295a 0%, #2F0743 100%)",
        header:
            "linear-gradient(135deg, #252326 0%, #414345 100%)",
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

// ── Table Component ─────────────────────────────────────────────────────────
const TechTable = ({
    tech,
    apiResponse,
    dateRangeLabel,
}) => {
    const colors = TECH_COLORS[tech];

    const TOTAL_BG = "#b2f0c5";
    const STRIPE = "#f4f7fb";

    const rawData =
        apiResponse?.data?.[tech] || [];

    const circleRows = rawData.filter(
        (row) => row.Circle !== "Grand Total"
    );

    const grandTotal =
        rawData.find(
            (row) => row.Circle === "Grand Total"
        ) || {};

    const titleLabel =
        dateRangeLabel
            ? `SCFT | ${dateRangeLabel} | ${tech}`
            : "Loading...";

    return (
        <Box
            mt={1}
            sx={{
                overflowX: "auto",
                borderRadius: 2,
                border: "1px solid #c0c0c0",
                boxShadow:
                    "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    tableLayout: "auto",
                    minWidth: 500,
                }}
            >
                <thead>
                    {/* Title */}
                    <tr>
                        <th
                            colSpan={
                                COLUMNS.length + 1
                            }
                            style={{
                                ...cellSt,
                                background:
                                    colors.active,
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: 700,
                                textAlign:
                                    "center",
                                padding:
                                    "8px 12px",
                                border:
                                    "1px solid #2e4a70",
                            }}
                        >
                            {titleLabel}
                        </th>
                    </tr>

                    {/* Header */}
                    <tr>
                        <th
                            style={{
                                ...stickySt,
                                background:
                                    colors.header,
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                zIndex: 3,
                                border:
                                    "1px solid #2e4a70",
                                padding:
                                    "6px 12px",
                            }}
                        >
                            Circle
                        </th>

                        {COLUMNS.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    ...cellSt,
                                    background:
                                        colors.header,
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: 13,
                                    border:
                                        "1px solid #2e4a70",
                                    padding:
                                        "6px 10px",
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {circleRows.length > 0 ? (
                        <>
                            {circleRows.map(
                                (row, idx) => (
                                    <tr
                                        key={
                                            row.Circle
                                        }
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
                                                ...stickySt,
                                                background:
                                                    idx %
                                                        2 ===
                                                    0
                                                        ? "#fff"
                                                        : STRIPE,
                                            }}
                                        >
                                            {
                                                row.Circle
                                            }
                                        </td>

                                        {COLUMNS.map(
                                            (
                                                col
                                            ) => (
                                                <td
                                                    key={
                                                        col.key
                                                    }
                                                    style={
                                                        cellSt
                                                    }
                                                >
                                                    {row?.[
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
                                    fontWeight:
                                        700,
                                }}
                            >
                                <td
                                    style={{
                                        ...stickySt,
                                        background:
                                            TOTAL_BG,
                                        border:
                                            "1px solid #c0c0c0",
                                        fontSize:
                                            14,
                                    }}
                                >
                                    Grand Total
                                </td>

                                {COLUMNS.map(
                                    (col) => (
                                        <td
                                            key={
                                                col.key
                                            }
                                            style={{
                                                ...cellSt,
                                                fontWeight:
                                                    700,
                                                fontSize:
                                                    14,
                                            }}
                                        >
                                            {grandTotal?.[
                                                col
                                                    .key
                                            ] ??
                                                0}
                                        </td>
                                    )
                                )}
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={
                                    COLUMNS.length +
                                    1
                                }
                                style={{
                                    ...cellSt,
                                    padding: 20,
                                    color:
                                        "#9e9e9e",
                                    fontSize: 14,
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
const SCFT_FTR = () => {
    const { loading, action } =
        useLoadingDialog();

    const navigate = useNavigate();

    const [apiResponse, setApiResponse] =
        useState(null);

    const [startDate, setStartDate] =
        useState(getDefaultStartDate());

    const [endDate, setEndDate] =
        useState(todayStr);

    const [activeTech, setActiveTech] =
        useState("4G");

    // ── Fetch API ─────────────────────────────────────────────────────────
    const fetchData = async () => {
        if (!startDate || !endDate) return;

        if (startDate > endDate) return;

        try {
            action(true);

            const formData =
                new FormData();

            formData.append(
                "start_date",
                startDate
            );

            formData.append(
                "end_date",
                endDate
            );

            const res = await postData(
                "performance_idploy/generate-scft/",
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

    // ── Debounce API Calls ────────────────────────────────────────────────
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () =>
            clearTimeout(timer);

    }, [startDate, endDate]);

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
        <>
            {/* Breadcrumb */}
            <div
                style={{
                    margin: 5,
                    marginLeft: 10,
                    marginTop: 10,
                }}
            >
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={3}
                    separator={
                        <KeyboardArrowRightIcon fontSize="small" />
                    }
                >
                    <Link
                        underline="hover"
                        onClick={() =>
                            navigate(
                                "/tools"
                            )
                        }
                    >
                        Tools
                    </Link>

                    <Link
                        underline="hover"
                        onClick={() =>
                            navigate(
                                "/tools/performance_at_tat"
                            )
                        }
                    >
                        Performance At Tat
                    </Link>

                    <Typography color="text.primary">
                        SCFT FTR
                    </Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* Top Bar */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    {/* Left */}
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        SCFT FTR Dashboard
                    </Typography>

                    {/* Right */}
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
                            value={
                                startDate
                            }
                            onChange={(
                                e
                            ) => {
                                if (
                                    e
                                        .target
                                        .value <=
                                    todayStr
                                ) {
                                    setStartDate(
                                        e
                                            .target
                                            .value
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
                            value={
                                endDate
                            }
                            onChange={(
                                e
                            ) => {
                                if (
                                    e
                                        .target
                                        .value <=
                                    todayStr
                                ) {
                                    setEndDate(
                                        e
                                            .target
                                            .value
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
                            onClick={
                                handleDownload
                            }
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

                {/* Technology Tabs */}
                <Box
                    mt={2}
                    sx={{
                        display: "flex",
                        borderBottom:
                            "2px solid #e0e0e0",
                    }}
                >
                    {TECH_TABS.map(
                        (tab) => {
                            const isActive =
                                activeTech ===
                                tab.key;

                            const tColor =
                                TECH_COLORS[
                                    tab.key
                                ];

                            return (
                                <Box
                                    key={
                                        tab.key
                                    }
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
                                        userSelect:
                                            "none",
                                        fontWeight:
                                            isActive
                                                ? 700
                                                : 500,
                                        fontSize: 14,
                                        color:
                                            isActive
                                                ? "#fff"
                                                : tColor.tabColor,
                                        background:
                                            isActive
                                                ? tColor.active
                                                : "transparent",
                                        borderRadius:
                                            "6px 6px 0 0",
                                        borderBottom:
                                            isActive
                                                ? `3px solid ${tColor.tabColor}`
                                                : "3px solid transparent",
                                        transition:
                                            "all 0.2s",
                                        "&:hover":
                                            {
                                                background:
                                                    isActive
                                                        ? tColor.active
                                                        : "#f0f4ff",
                                            },
                                    }}
                                >
                                    {
                                        tab.label
                                    }
                                </Box>
                            );
                        }
                    )}
                </Box>

                {/* Table */}
                <TechTable
                    tech={activeTech}
                    apiResponse={
                        apiResponse
                    }
                    dateRangeLabel={
                        dateRangeLabel
                    }
                />

                {loading}
            </Box>
        </>
    );
};

export default SCFT_FTR;