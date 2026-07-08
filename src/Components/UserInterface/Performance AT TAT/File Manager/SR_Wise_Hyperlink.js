// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ── Theme ─────────────────────────────────────────────────────────────────────
// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // ── Table columns shown on the detail page ────────────────────────────────────
// // Add / remove columns here once the real API is confirmed.
// const DETAIL_COLUMNS = [
//     { label: "SR No.",      key: "sr_no"      },
//     { label: "SR Site ID",  key: "SR_Site ID" },
//     { label: "Site ID",     key: "Site ID"    },
//     { label: "Circle",      key: "Circle"     },
//     { label: "PAT",         key: "PAT"        },
//     { label: "SAT",         key: "SAT"        },
//     { label: "KAT",         key: "KAT"        },
//     { label: "SCFT",        key: "SCFT"       },
//     { label: "PAT Date",    key: "PAT Date"   },
//     { label: "SAT Date",    key: "SAT Date"   },
//     { label: "KAT Date",    key: "KAT Date"   },
//     { label: "SCFT Date",   key: "SCFT Date"  },
// ];

// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // ── Shared cell styles ────────────────────────────────────────────────────────
// const cellSt = {
//     padding: "4px 8px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // ── Context passed from parent page ──────────────────────────────────
//     const {
//         circle    = "",
//         column    = "",      // "PAT" | "SAT" | "KAT" | "SCFT"
//         statusKey = "",      // "pending" | "offered" | "accepted"
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // ── Local state ───────────────────────────────────────────────────────
//     const [apiResponse, setApiResponse] = useState(null);
//     const [siteSearch,  setSiteSearch]  = useState("");   // Site ID search box

//     // ── Fetch detail data ─────────────────────────────────────────────────
//     // TODO: Replace the endpoint and FormData keys once the real API is ready.
//     const fetchDetail = async () => {
//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     column);     // e.g. "PAT"
//             formData.append("status",     statusKey);  // e.g. "pending"

//             // ── PLACEHOLDER: swap endpoint when API is ready ──────────────
//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-detail/",  // <-- replace
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse(null);
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//         } finally {
//             action(false);
//         }
//     };

//     useEffect(() => {
//         if (circle && column && statusKey) fetchDetail();
//     }, [circle, column, statusKey, initStart, initEnd]);

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

//     // ── Filter rows by Site ID search ─────────────────────────────────────
//     const allRows = apiResponse?.data || [];
//     const tableRows = siteSearch.trim()
//         ? allRows.filter((row) =>
//             String(row["Site ID"] ?? "")
//                 .toLowerCase()
//                 .includes(siteSearch.trim().toLowerCase()) ||
//             String(row["SR_Site ID"] ?? "")
//                 .toLowerCase()
//                 .includes(siteSearch.trim().toLowerCase())
//           )
//         : allRows;

//     const titleLabel = [
//         circle && `Circle: ${circle}`,
//         column && `Column: ${column}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     const STRIPE = "#f4f7fb";

//     return (
//         <>
//             {/* Breadcrumb */}
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link
//                         underline="hover"
//                         onClick={() => navigate(-1)}
//                         sx={{ cursor: "pointer" }}
//                     >
//                         SR Wise Hyperlink
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* ── Top Bar ── */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={2}
//                 >
//                     {/* Left: back + title */}
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha("#134e5e", 0.08),
//                                 "&:hover": { bgcolor: alpha("#134e5e", 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: "#134e5e" }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip
//                                         label={`Circle: ${circle}`}
//                                         size="small"
//                                         sx={{ bgcolor: "#134e5e", color: "#fff", fontWeight: 700, fontSize: 11 }}
//                                     />
//                                 )}
//                                 {column && (
//                                     <Chip
//                                         label={`Column: ${column}`}
//                                         size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }}
//                                     />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {count > 0 && (
//                                     <Chip
//                                         label={`${count} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     {/* Right: Site ID search + download */}
//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <TextField
//                             size="small"
//                             placeholder="Search by Site ID…"
//                             value={siteSearch}
//                             onChange={(e) => setSiteSearch(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 minWidth: 200,
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: "10px",
//                                     "&:hover fieldset":       { borderColor: "#134e5e" },
//                                     "&.Mui-focused fieldset": { borderColor: "#134e5e" },
//                                 },
//                             }}
//                         />

//                         <IconButton
//                             onClick={handleDownload}
//                             title="Download Excel"
//                             disabled={!apiResponse?.download_url}
//                             sx={{
//                                 bgcolor: apiResponse?.download_url
//                                     ? alpha("#134e5e", 0.1) : "transparent",
//                                 "&:hover": { bgcolor: alpha("#134e5e", 0.18) },
//                                 borderRadius: "10px",
//                             }}
//                         >
//                             <DownloadIcon
//                                 color={apiResponse?.download_url ? "primary" : "disabled"}
//                             />
//                         </IconButton>
//                     </Box>
//                 </Box>

//                 {/* ── Table ── */}
//                 <Box
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
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
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
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {
//                                             // SR No. is a synthetic serial
//                                             if (col.key === "sr_no") {
//                                                 return (
//                                                     <td key="sr_no" style={cellSt}>
//                                                         {idx + 1}
//                                                     </td>
//                                                 );
//                                             }

//                                             const val = row?.[col.key];
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val)
//                                                     : "-";
//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             return (
//                                                 <td
//                                                     key={col.key}
//                                                     style={{
//                                                         ...cellSt,
//                                                         ...(isStatus ? getStatusStyle(display) : {}),
//                                                     }}
//                                                 >
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 20,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {apiResponse === null
//                                             ? "Loading data or API not yet connected…"
//                                             : siteSearch
//                                             ? `No results for "${siteSearch}"`
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
//                                 label={`${tableRows.length} / ${allRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {siteSearch && tableRows.length !== allRows.length && (
//                                 <Chip
//                                     label={`filtered by "${siteSearch}"`}
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={() => setSiteSearch("")}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;

// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ── Theme ─────────────────────────────────────────────────────────────────────
// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // ── Table columns shown on the detail page ────────────────────────────────────
// const DETAIL_COLUMNS = [
//     { label: "SR No.",      key: "sr_no"      },
//     { label: "SR Site ID",  key: "SR_Site ID" },
//     { label: "Site ID",     key: "Site ID"    },
//     { label: "Circle",      key: "Circle"     },
//     { label: "PAT",         key: "PAT"        },
//     { label: "SAT",         key: "SAT"        },
//     { label: "KAT",         key: "KAT"        },
//     { label: "SCFT",        key: "SCFT"       },
//     { label: "PAT Date",    key: "PAT Date"   },
//     { label: "SAT Date",    key: "SAT Date"   },
//     { label: "KAT Date",    key: "KAT Date"   },
//     { label: "SCFT Date",   key: "SCFT Date"  },
// ];

// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // ── Shared cell styles ────────────────────────────────────────────────────────
// const cellSt = {
//     padding: "4px 8px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // ── Main Component ────────────────────────────────────────────────────────────
// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const location = useLocation();

//     // ── Context passed from parent page ──────────────────────────────────
//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // ── Local state ───────────────────────────────────────────────────────
//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");

//     // ── Fetch detail data ─────────────────────────────────────────────────
//     const fetchDetail = async () => {
//         try {
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     column);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/generate-atsrwise-summary/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse(null);
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && column) fetchDetail();
//     }, [circle, column, statusKey, initStart, initEnd]);

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

//     // ── Filter rows by Site ID search ─────────────────────────────────────
//     const allRows = apiResponse?.data || [];
//     const tableRows = siteSearch.trim()
//         ? allRows.filter((row) =>
//             String(row["Site ID"] ?? "")
//                 .toLowerCase()
//                 .includes(siteSearch.trim().toLowerCase()) ||
//             String(row["SR_Site ID"] ?? "")
//                 .toLowerCase()
//                 .includes(siteSearch.trim().toLowerCase())
//           )
//         : allRows;

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         column    && `Column: ${column}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     const STRIPE = "#f4f7fb";

//     return (
//         <>
//             {/* Breadcrumb */}
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link
//                         underline="hover"
//                         onClick={() => navigate(-1)}
//                         sx={{ cursor: "pointer" }}
//                     >
//                         Performance SR Wise
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* ── Top Bar ── */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={2}
//                 >
//                     {/* Left: back + title */}
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha("#134e5e", 0.08),
//                                 "&:hover": { bgcolor: alpha("#134e5e", 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: "#134e5e" }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip
//                                         label={`Circle: ${circle}`}
//                                         size="small"
//                                         sx={{ bgcolor: "#134e5e", color: "#fff", fontWeight: 700, fontSize: 11 }}
//                                     />
//                                 )}
//                                 {column && (
//                                     <Chip
//                                         label={`Column: ${column}`}
//                                         size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }}
//                                     />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color:   statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {count > 0 && (
//                                     <Chip
//                                         label={`${count} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     {/* Right: Site ID search + download */}
//                     <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
//                         <TextField
//                             size="small"
//                             placeholder="Search by Site ID…"
//                             value={siteSearch}
//                             onChange={(e) => setSiteSearch(e.target.value)}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             sx={{
//                                 minWidth: 200,
//                                 "& .MuiOutlinedInput-root": {
//                                     borderRadius: "10px",
//                                     "&:hover fieldset":       { borderColor: "#134e5e" },
//                                     "&.Mui-focused fieldset": { borderColor: "#134e5e" },
//                                 },
//                             }}
//                         />

//                         <IconButton
//                             onClick={handleDownload}
//                             title="Download Excel"
//                             disabled={!apiResponse?.download_url}
//                             sx={{
//                                 bgcolor: apiResponse?.download_url
//                                     ? alpha("#134e5e", 0.1) : "transparent",
//                                 "&:hover": { bgcolor: alpha("#134e5e", 0.18) },
//                                 borderRadius: "10px",
//                             }}
//                         >
//                             <DownloadIcon
//                                 color={apiResponse?.download_url ? "primary" : "disabled"}
//                             />
//                         </IconButton>
//                     </Box>
//                 </Box>

//                 {/* ── Table ── */}
//                 <Box
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
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
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
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {
//                                             // SR No. — synthetic serial number
//                                             if (col.key === "sr_no") {
//                                                 return (
//                                                     <td key="sr_no" style={cellSt}>
//                                                         {idx + 1}
//                                                     </td>
//                                                 );
//                                             }

//                                             const val = row?.[col.key];
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val)
//                                                     : "-";
//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             return (
//                                                 <td
//                                                     key={col.key}
//                                                     style={{
//                                                         ...cellSt,
//                                                         ...(isStatus ? getStatusStyle(display) : {}),
//                                                     }}
//                                                 >
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 20,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : siteSearch
//                                             ? `No results for "${siteSearch}"`
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
//                                 label={`${tableRows.length} / ${allRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {siteSearch && tableRows.length !== allRows.length && (
//                                 <Chip
//                                     label={`filtered by "${siteSearch}"`}
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={() => setSiteSearch("")}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;

// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     MenuItem,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
// import FilterListIcon         from "@mui/icons-material/FilterList";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// const DETAIL_COLUMNS = [
//     { label: "SR No.",     key: "sr_no"      },
//     { label: "SR Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID"    },
//     { label: "Circle",     key: "Circle"     },
//     { label: "PAT",        key: "PAT"        },
//     { label: "SAT",        key: "SAT"        },
//     { label: "KAT",        key: "KAT"        },
//     { label: "SCFT",       key: "SCFT"       },
//     { label: "PAT Date",   key: "PAT Date"   },
//     { label: "SAT Date",   key: "SAT Date"   },
//     { label: "KAT Date",   key: "KAT Date"   },
//     { label: "SCFT Date",  key: "SCFT Date"  },
// ];

// const STATUS_COLS     = ["PAT", "SAT", "KAT", "SCFT"];
// const FILTERABLE_COLS = ["Circle", "PAT", "SAT", "KAT", "SCFT"];

// const cellSt = {
//     padding: "4px 10px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// const ColFilter = ({ label, value, options, onChange, color }) => (
//     <TextField
//         select
//         size="small"
//         label={label}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         sx={{
//             minWidth: 130,
//             "& .MuiOutlinedInput-root": {
//                 borderRadius: "10px",
//                 "&:hover fieldset":       { borderColor: color },
//                 "&.Mui-focused fieldset": { borderColor: color },
//             },
//             "& label.Mui-focused": { color },
//         }}
//     >
//         <MenuItem value=""><em>All</em></MenuItem>
//         {options.map((opt) => (
//             <MenuItem key={opt} value={opt}>{opt}</MenuItem>
//         ))}
//     </TextField>
// );

// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate  = useNavigate();
//     const location  = useLocation();

//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");
//     const [filters, setFilters] = useState({
//         Circle: "",
//         PAT:    "",
//         SAT:    "",
//         KAT:    "",
//         SCFT:   "",
//     });

//     const fetchDetail = async () => {
//         try {
//             action(true);
//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     column);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse({ data: [] });
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//             setApiResponse({ data: [] });
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && column) fetchDetail();
//     }, [circle, column, statusKey, initStart, initEnd]);

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

//     const allRows = useMemo(
//         () => apiResponse?.data || apiResponse?.summary || [],
//         [apiResponse]
//     );

//     // Filter rows where the clicked column matches statusKey (e.g. SAT === "Pending")
//     const statusFilteredRows = useMemo(() => {
//         if (!statusKey || !column) return allRows;
//         return allRows.filter((row) => {
//             const cellValue = row?.[column];
//             return (
//                 cellValue !== null &&
//                 cellValue !== undefined &&
//                 String(cellValue).toLowerCase() === statusKey.toLowerCase()
//             );
//         });
//     }, [allRows, column, statusKey]);

//     // Build filter dropdown options from status-filtered rows only
//     const filterOptions = useMemo(() => {
//         const opts = {};
//         FILTERABLE_COLS.forEach((col) => {
//             opts[col] = [
//                 ...new Set(
//                     statusFilteredRows
//                         .map((r) => r[col])
//                         .filter((v) => v !== null && v !== undefined && v !== "" && v !== "-")
//                         .map(String)
//                 ),
//             ].sort();
//         });
//         return opts;
//     }, [statusFilteredRows]);

//     // Apply site search + dropdown filters on top of status-filtered rows
//     const tableRows = useMemo(() => {
//         let rows = statusFilteredRows;

//         if (siteSearch.trim()) {
//             const q = siteSearch.trim().toLowerCase();
//             rows = rows.filter(
//                 (row) =>
//                     String(row["Site ID"]    ?? "").toLowerCase().includes(q) ||
//                     String(row["SR_Site ID"] ?? "").toLowerCase().includes(q)
//             );
//         }

//         FILTERABLE_COLS.forEach((col) => {
//             if (filters[col]) {
//                 rows = rows.filter(
//                     (row) =>
//                         String(row[col] ?? "").toLowerCase() === filters[col].toLowerCase()
//                 );
//             }
//         });

//         return rows;
//     }, [statusFilteredRows, siteSearch, filters]);

//     const hasActiveFilter =
//         siteSearch.trim() !== "" ||
//         FILTERABLE_COLS.some((c) => filters[c] !== "");

//     const clearAllFilters = () => {
//         setSiteSearch("");
//         setFilters({ Circle: "", PAT: "", SAT: "", KAT: "", SCFT: "" });
//     };

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         column    && `Column: ${column}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     const STRIPE    = "#f4f7fb";
//     const THEME_CLR = "#134e5e";

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
//                         SR Wise Details
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={1.5}
//                 >
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha(THEME_CLR, 0.08),
//                                 "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip label={`Circle: ${circle}`} size="small"
//                                         sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {column && (
//                                     <Chip label={`Column: ${column}`} size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {statusFilteredRows.length > 0 && (
//                                     <Chip
//                                         label={`${statusFilteredRows.length} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     <IconButton
//                         onClick={handleDownload}
//                         title="Download Excel"
//                         disabled={!apiResponse?.download_url}
//                         sx={{
//                             bgcolor: apiResponse?.download_url ? alpha(THEME_CLR, 0.1) : "transparent",
//                             "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
//                             borderRadius: "10px",
//                         }}
//                     >
//                         <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
//                     </IconButton>
//                 </Box>

//                 {/* Filter Bar */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 1.2,
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         px: 2, py: 1.5,
//                         mb: 1.5,
//                         borderRadius: "12px",
//                         border: "1px solid #e0e8ec",
//                         bgcolor: "#f8fafc",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
//                         <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                         <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
//                             Filters:
//                         </Typography>
//                     </Box>

//                     <TextField
//                         size="small"
//                         placeholder="Search by Site ID…"
//                         value={siteSearch}
//                         onChange={(e) => setSiteSearch(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             minWidth: 190,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                                 "&:hover fieldset":       { borderColor: THEME_CLR },
//                                 "&.Mui-focused fieldset": { borderColor: THEME_CLR },
//                             },
//                         }}
//                     />

//                     {/* <ColFilter label="Circle" value={filters.Circle}
//                         options={filterOptions.Circle ?? []}
//                         onChange={(v) => setFilters((f) => ({ ...f, Circle: v }))}
//                         color={THEME_CLR} /> */}

//                     {/* <ColFilter label="PAT" value={filters.PAT}
//                         options={filterOptions.PAT ?? []}
//                         onChange={(v) => setFilters((f) => ({ ...f, PAT: v }))}
//                         color="#e65100" />

//                     <ColFilter label="SAT" value={filters.SAT}
//                         options={filterOptions.SAT ?? []}
//                         onChange={(v) => setFilters((f) => ({ ...f, SAT: v }))}
//                         color="#0d47a1" />

//                     <ColFilter label="KAT" value={filters.KAT}
//                         options={filterOptions.KAT ?? []}
//                         onChange={(v) => setFilters((f) => ({ ...f, KAT: v }))}
//                         color="#6a1b9a" />

//                     <ColFilter label="SCFT" value={filters.SCFT}
//                         options={filterOptions.SCFT ?? []}
//                         onChange={(v) => setFilters((f) => ({ ...f, SCFT: v }))}
//                         color="#1b5e20" /> */}

//                     {hasActiveFilter && (
//                         <Chip
//                             label="Clear All"
//                             size="small"
//                             onDelete={clearAllFilters}
//                             onClick={clearAllFilters}
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: 11,
//                                 bgcolor: alpha("#546e7a", 0.12),
//                                 color: "#546e7a",
//                                 border: "1px solid " + alpha("#546e7a", 0.3),
//                                 "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                                 cursor: "pointer",
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <Box
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
//                             <tr>
//                                 <th
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>
//                             <tr>
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {

//                                             // SR number column
//                                             if (col.key === "sr_no") {
//                                                 return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
//                                             }

//                                             const val = row?.[col.key];
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val) : "-";

//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             // ✅ STATUS COLUMNS:
//                                             // Only show the value if it matches the clicked statusKey
//                                             // Everything else (Accepted, Offered) shows as "-"
//                                             if (isStatus) {
//                                                 const matchesStatus =
//                                                     display.toLowerCase() === (statusKey?.toLowerCase() ?? "pending");
//                                                 return (
//                                                     <td
//                                                         key={col.key}
//                                                         style={{
//                                                             ...cellSt,
//                                                             ...(matchesStatus ? getStatusStyle(display) : { color: "#9e9e9e" }),
//                                                         }}
//                                                     >
//                                                         {matchesStatus ? display : "-"}
//                                                     </td>
//                                                 );
//                                             }

//                                             // Non-status columns render normally
//                                             return (
//                                                 <td key={col.key} style={cellSt}>
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 24,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : hasActiveFilter
//                                             ? "No records match the selected filters"
//                                             : "No Data Available"}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {statusFilteredRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">Showing</Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
//                                 <Chip
//                                     label="filtered"
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={clearAllFilters}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;

// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
// import FilterListIcon         from "@mui/icons-material/FilterList";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // Base columns that are ALWAYS shown, regardless of which status column was clicked
// const BASE_COLUMNS = [
//     { label: "SR No.",     key: "sr_no"      },
//     { label: "SR Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID"    },
//     { label: "Circle",     key: "Circle"     },
// ];

// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // Builds the column list dynamically: base columns + the clicked column + its date column
// const buildDetailColumns = (column) => {
//     if (!column || !STATUS_COLS.includes(column)) {
//         // Fallback: if no valid column passed, show everything (safety net)
//         return [
//             ...BASE_COLUMNS,
//             { label: "Site ID", key: "Site ID" },
//             { label: "PAT",  key: "PAT"  },
//             { label: "SAT",  key: "SAT"  },
//             { label: "KAT",  key: "KAT"  },
//             { label: "SCFT", key: "SCFT" },
//             { label: "PAT Date",  key: "PAT Date"  },
//             { label: "SAT Date",  key: "SAT Date"  },
//             { label: "KAT Date",  key: "KAT Date"  },
//             { label: "SCFT Date", key: "SCFT Date" },
//         ];
//     }

//     return [
//         ...BASE_COLUMNS,
//         { label: column,               key: column               },
//         { label: `${column} Date`,     key: `${column} Date`     },
//     ];
// };

// const cellSt = {
//     padding: "4px 10px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // Normalizes a key for loose comparison: strips spaces/underscores, lowercases
// const normalizeKey = (k) => String(k).toLowerCase().replace(/[\s_]/g, "");

// // Looks up a value on a row by trying the exact key first, then falling back
// // to a case/spacing/underscore-insensitive match against all keys on the row.
// // This guards against API field-name variants like "KAT Date" vs "KAT_Date"
// // vs "KATDate" vs "kat date" etc.
// const getRowValue = (row, wantedKey) => {
//     if (!row) return undefined;
//     if (row[wantedKey] !== undefined) return row[wantedKey];

//     const target = normalizeKey(wantedKey);
//     const foundKey = Object.keys(row).find((k) => normalizeKey(k) === target);
//     return foundKey !== undefined ? row[foundKey] : undefined;
// };

// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate  = useNavigate();
//     const location  = useLocation();

//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // Dynamic columns based on which status column was clicked (PAT / SAT / KAT / SCFT)
//     const DETAIL_COLUMNS = useMemo(() => buildDetailColumns(column), [column]);

//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");

//     const fetchDetail = async () => {
//         try {
//             action(true);
//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     column);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse({ data: [] });
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//             setApiResponse({ data: [] });
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && column) fetchDetail();
//     }, [circle, column, statusKey, initStart, initEnd]);

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

//     const allRows = useMemo(
//         () => apiResponse?.data || apiResponse?.summary || [],
//         [apiResponse]
//     );

//     // Filter rows where the clicked column matches statusKey (e.g. SAT === "Pending")
//     const statusFilteredRows = useMemo(() => {
//         if (!statusKey || !column) return allRows;
//         return allRows.filter((row) => {
//             const cellValue = getRowValue(row, column);
//             return (
//                 cellValue !== null &&
//                 cellValue !== undefined &&
//                 String(cellValue).toLowerCase() === statusKey.toLowerCase()
//             );
//         });
//     }, [allRows, column, statusKey]);

//     // Apply site search on top of status-filtered rows
//     const tableRows = useMemo(() => {
//         let rows = statusFilteredRows;

//         if (siteSearch.trim()) {
//             const q = siteSearch.trim().toLowerCase();
//             rows = rows.filter(
//                 (row) =>
//                     String(getRowValue(row, "Site ID")    ?? "").toLowerCase().includes(q) ||
//                     String(getRowValue(row, "SR_Site ID") ?? "").toLowerCase().includes(q)
//             );
//         }

//         return rows;
//     }, [statusFilteredRows, siteSearch]);

//     const hasActiveFilter = siteSearch.trim() !== "";

//     const clearAllFilters = () => {
//         setSiteSearch("");
//     };

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         column    && `Column: ${column}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     const STRIPE    = "#f4f7fb";
//     const THEME_CLR = "#134e5e";

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
//                         SR Wise Details
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={1.5}
//                 >
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha(THEME_CLR, 0.08),
//                                 "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip label={`Circle: ${circle}`} size="small"
//                                         sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {column && (
//                                     <Chip label={`Column: ${column}`} size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {statusFilteredRows.length > 0 && (
//                                     <Chip
//                                         label={`${statusFilteredRows.length} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     <IconButton
//                         onClick={handleDownload}
//                         title="Download Excel"
//                         disabled={!apiResponse?.download_url}
//                         sx={{
//                             bgcolor: apiResponse?.download_url ? alpha(THEME_CLR, 0.1) : "transparent",
//                             "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
//                             borderRadius: "10px",
//                         }}
//                     >
//                         <DownloadIcon color={apiResponse?.download_url ? "primary" : "disabled"} />
//                     </IconButton>
//                 </Box>

//                 {/* Filter Bar */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 1.2,
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         px: 2, py: 1.5,
//                         mb: 1.5,
//                         borderRadius: "12px",
//                         border: "1px solid #e0e8ec",
//                         bgcolor: "#f8fafc",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
//                         <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                         <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
//                             Filters:
//                         </Typography>
//                     </Box>

//                     <TextField
//                         size="small"
//                         placeholder="Search by Site ID…"
//                         value={siteSearch}
//                         onChange={(e) => setSiteSearch(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             minWidth: 190,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                                 "&:hover fieldset":       { borderColor: THEME_CLR },
//                                 "&.Mui-focused fieldset": { borderColor: THEME_CLR },
//                             },
//                         }}
//                     />

//                     {hasActiveFilter && (
//                         <Chip
//                             label="Clear All"
//                             size="small"
//                             onDelete={clearAllFilters}
//                             onClick={clearAllFilters}
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: 11,
//                                 bgcolor: alpha("#546e7a", 0.12),
//                                 color: "#546e7a",
//                                 border: "1px solid " + alpha("#546e7a", 0.3),
//                                 "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                                 cursor: "pointer",
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <Box
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
//                             minWidth: 600,
//                         }}
//                     >
//                         <thead>
//                             <tr>
//                                 <th
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>
//                             <tr>
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {

//                                             // SR number column
//                                             if (col.key === "sr_no") {
//                                                 return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
//                                             }

//                                             const val = getRowValue(row, col.key);
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val) : "-";

//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             // Status column (the one actually clicked) — show its value with status color
//                                             if (isStatus) {
//                                                 return (
//                                                     <td
//                                                         key={col.key}
//                                                         style={{
//                                                             ...cellSt,
//                                                             ...getStatusStyle(display),
//                                                         }}
//                                                     >
//                                                         {display}
//                                                     </td>
//                                                 );
//                                             }

//                                             // Non-status columns render normally
//                                             return (
//                                                 <td key={col.key} style={cellSt}>
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 24,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : hasActiveFilter
//                                             ? "No records match the selected filters"
//                                             : "No Data Available"}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {statusFilteredRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">Showing</Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
//                                 <Chip
//                                     label="filtered"
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={clearAllFilters}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;


// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
// import FilterListIcon         from "@mui/icons-material/FilterList";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // Base columns that are ALWAYS shown, regardless of which status column was clicked
// const BASE_COLUMNS = [
//     { label: "SR No.",     key: "sr_no"      },
//     { label: "SR Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID"    },
//     { label: "Circle",     key: "Circle"     },
// ];

// // PAT / SAT / KAT / SCFT — these are the only valid "key" values the backend
// // understands for scoping both the detail fetch and the Excel download to a
// // single sheet/report.
// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // Normalizes any incoming column value (e.g. "kat", " KAT ", "Kat") to the
// // exact backend key it expects: "PAT" | "SAT" | "KAT" | "SCFT"
// const normalizeReportKey = (col) => {
//     if (!col) return "";
//     const match = STATUS_COLS.find(
//         (c) => c.toLowerCase() === String(col).trim().toLowerCase()
//     );
//     return match || "";
// };

// // Builds the column list dynamically: base columns + the clicked column + its date column
// const buildDetailColumns = (column) => {
//     if (!column || !STATUS_COLS.includes(column)) {
//         // Fallback: if no valid column passed, show everything (safety net)
//         return [
//             ...BASE_COLUMNS,
//             { label: "Site ID", key: "Site ID" },
//             { label: "PAT",  key: "PAT"  },
//             { label: "SAT",  key: "SAT"  },
//             { label: "KAT",  key: "KAT"  },
//             { label: "SCFT", key: "SCFT" },
//             { label: "PAT Date",  key: "PAT Date"  },
//             { label: "SAT Date",  key: "SAT Date"  },
//             { label: "KAT Date",  key: "KAT Date"  },
//             { label: "SCFT Date", key: "SCFT Date" },
//         ];
//     }

//     return [
//         ...BASE_COLUMNS,
//         { label: column,               key: column               },
//         { label: `${column} Date`,     key: `${column} Date`     },
//     ];
// };

// const cellSt = {
//     padding: "4px 10px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // Normalizes a key for loose comparison: strips spaces/underscores, lowercases
// const normalizeKey = (k) => String(k).toLowerCase().replace(/[\s_]/g, "");

// // Looks up a value on a row by trying the exact key first, then falling back
// // to a case/spacing/underscore-insensitive match against all keys on the row.
// // This guards against API field-name variants like "KAT Date" vs "KAT_Date"
// // vs "KATDate" vs "kat date" etc.
// const getRowValue = (row, wantedKey) => {
//     if (!row) return undefined;
//     if (row[wantedKey] !== undefined) return row[wantedKey];

//     const target = normalizeKey(wantedKey);
//     const foundKey = Object.keys(row).find((k) => normalizeKey(k) === target);
//     return foundKey !== undefined ? row[foundKey] : undefined;
// };

// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate  = useNavigate();
//     const location  = useLocation();

//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     // The exact PAT / SAT / KAT / SCFT key derived from whichever column was clicked.
//     // This is the single source of truth sent to the backend for both the
//     // detail fetch and the scoped Excel download.
//     const reportKey = useMemo(() => normalizeReportKey(column), [column]);

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // Dynamic columns based on which status column was clicked (PAT / SAT / KAT / SCFT)
//     const DETAIL_COLUMNS = useMemo(() => buildDetailColumns(reportKey), [reportKey]);

//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");
//     const [downloading, setDownloading] = useState(false);

//     const fetchDetail = async () => {
//         try {
//             action(true);
//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     reportKey);
//             // "key" is the explicit PAT/SAT/KAT/SCFT identifier the backend
//             // uses to scope the report to a single sheet/type.
//             formData.append("key",        reportKey);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse({ data: [] });
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//             setApiResponse({ data: [] });
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && reportKey) fetchDetail();
//     }, [circle, reportKey, statusKey, initStart, initEnd]);

//     // Hits the dedicated pending-report download API and triggers the file save.
//     // Sends "key" = PAT/SAT/KAT/SCFT so the backend returns ONLY that sheet's
//     // file (e.g. clicking KAT downloads just the KAT pending report, not the
//     // full PAT/SAT/KAT/SCFT workbook).
//     const handleDownload = async () => {
//         if (downloading) return;
//         if (!reportKey) {
//             console.error("Download Error: no valid PAT/SAT/KAT/SCFT key resolved from column:", column);
//             return;
//         }

//         try {
//             setDownloading(true);
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     reportKey);
//             // Explicit scoping key — must be exactly "PAT" | "SAT" | "KAT" | "SCFT"
//             formData.append("key",        reportKey);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/performance-at-pending-report/",
//                 formData
//             );

//             const url = res?.download_url;
//             if (!url) {
//                 console.error("Download Error: no download_url returned", res);
//                 return;
//             }

//             const link = document.createElement("a");
//             link.href = url;
//             link.download = "";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (err) {
//             console.error("Download Error:", err);
//         } finally {
//             action(false);
//             setDownloading(false);
//         }
//     };

//     const allRows = useMemo(
//         () => apiResponse?.data || apiResponse?.summary || [],
//         [apiResponse]
//     );

//     // Filter rows where the clicked column matches statusKey (e.g. SAT === "Pending")
//     const statusFilteredRows = useMemo(() => {
//         if (!statusKey || !reportKey) return allRows;
//         return allRows.filter((row) => {
//             const cellValue = getRowValue(row, reportKey);
//             return (
//                 cellValue !== null &&
//                 cellValue !== undefined &&
//                 String(cellValue).toLowerCase() === statusKey.toLowerCase()
//             );
//         });
//     }, [allRows, reportKey, statusKey]);

//     // Apply site search on top of status-filtered rows
//     const tableRows = useMemo(() => {
//         let rows = statusFilteredRows;

//         if (siteSearch.trim()) {
//             const q = siteSearch.trim().toLowerCase();
//             rows = rows.filter(
//                 (row) =>
//                     String(getRowValue(row, "Site ID")    ?? "").toLowerCase().includes(q) ||
//                     String(getRowValue(row, "SR_Site ID") ?? "").toLowerCase().includes(q)
//             );
//         }

//         return rows;
//     }, [statusFilteredRows, siteSearch]);

//     const hasActiveFilter = siteSearch.trim() !== "";

//     const clearAllFilters = () => {
//         setSiteSearch("");
//     };

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         reportKey && `Column: ${reportKey}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     const STRIPE    = "#f4f7fb";
//     const THEME_CLR = "#134e5e";

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
//                         SR Wise Details
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={1.5}
//                 >
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha(THEME_CLR, 0.08),
//                                 "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip label={`Circle: ${circle}`} size="small"
//                                         sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {reportKey && (
//                                     <Chip label={`Column: ${reportKey}`} size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {statusFilteredRows.length > 0 && (
//                                     <Chip
//                                         label={`${statusFilteredRows.length} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     <IconButton
//                         onClick={handleDownload}
//                         title={reportKey ? `Download ${reportKey} Excel` : "Download Excel"}
//                         disabled={downloading || !reportKey}
//                         sx={{
//                             bgcolor: alpha(THEME_CLR, 0.1),
//                             "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
//                             borderRadius: "10px",
//                         }}
//                     >
//                         <DownloadIcon color={downloading || !reportKey ? "disabled" : "primary"} />
//                     </IconButton>
//                 </Box>

//                 {/* Filter Bar */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 1.2,
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         px: 2, py: 1.5,
//                         mb: 1.5,
//                         borderRadius: "12px",
//                         border: "1px solid #e0e8ec",
//                         bgcolor: "#f8fafc",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
//                         <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                         <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
//                             Filters:
//                         </Typography>
//                     </Box>

//                     <TextField
//                         size="small"
//                         placeholder="Search by Site ID…"
//                         value={siteSearch}
//                         onChange={(e) => setSiteSearch(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             minWidth: 190,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                                 "&:hover fieldset":       { borderColor: THEME_CLR },
//                                 "&.Mui-focused fieldset": { borderColor: THEME_CLR },
//                             },
//                         }}
//                     />

//                     {hasActiveFilter && (
//                         <Chip
//                             label="Clear All"
//                             size="small"
//                             onDelete={clearAllFilters}
//                             onClick={clearAllFilters}
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: 11,
//                                 bgcolor: alpha("#546e7a", 0.12),
//                                 color: "#546e7a",
//                                 border: "1px solid " + alpha("#546e7a", 0.3),
//                                 "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                                 cursor: "pointer",
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <Box
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
//                             minWidth: 600,
//                         }}
//                     >
//                         <thead>
//                             <tr>
//                                 <th
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>
//                             <tr>
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {

//                                             // SR number column
//                                             if (col.key === "sr_no") {
//                                                 return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
//                                             }

//                                             const val = getRowValue(row, col.key);
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val) : "-";

//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             // Status column (the one actually clicked) — show its value with status color
//                                             if (isStatus) {
//                                                 return (
//                                                     <td
//                                                         key={col.key}
//                                                         style={{
//                                                             ...cellSt,
//                                                             ...getStatusStyle(display),
//                                                         }}
//                                                     >
//                                                         {display}
//                                                     </td>
//                                                 );
//                                             }

//                                             // Non-status columns render normally
//                                             return (
//                                                 <td key={col.key} style={cellSt}>
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 24,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : hasActiveFilter
//                                             ? "No records match the selected filters"
//                                             : "No Data Available"}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {statusFilteredRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">Showing</Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
//                                 <Chip
//                                     label="filtered"
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={clearAllFilters}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;

// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
// import FilterListIcon         from "@mui/icons-material/FilterList";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // Base columns that are ALWAYS shown, regardless of which status column was clicked
// const BASE_COLUMNS = [
//     { label: "SR No.",     key: "sr_no"      },
//     { label: "SR Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID"    },
//     { label: "Circle",     key: "Circle"     },
//     { label: "MS Date", key: "MS Date" },
// ];

// // PAT / SAT / KAT / SCFT — the only valid "key" values the backend understands.
// // The API response nests rows under data.PAT / data.SAT / data.KAT / data.SCFT,
// // so this is also what we use to pull the correctly-scoped array out of the response.
// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // Normalizes any incoming column value (e.g. "kat", " KAT ", "Kat") to the
// // exact backend key it expects: "PAT" | "SAT" | "KAT" | "SCFT"
// const normalizeReportKey = (col) => {
//     if (!col) return "";
//     const match = STATUS_COLS.find(
//         (c) => c.toLowerCase() === String(col).trim().toLowerCase()
//     );
//     return match || "";
// };

// // Builds the column list dynamically: base columns + the clicked column + its date column
// const buildDetailColumns = (column) => {
//     if (!column || !STATUS_COLS.includes(column)) {
//         // Fallback: if no valid column passed, show everything (safety net)
//         return [
//             ...BASE_COLUMNS,
//             { label: "Site ID", key: "Site ID" },
//             { label: "PAT",  key: "PAT"  },
//             { label: "SAT",  key: "SAT"  },
//             { label: "KAT",  key: "KAT"  },
//             { label: "SCFT", key: "SCFT" },
//             { label: "PAT Date",  key: "PAT Date"  },
//             { label: "SAT Date",  key: "SAT Date"  },
//             { label: "KAT Date",  key: "KAT Date"  },
//             { label: "SCFT Date", key: "SCFT Date" },
//         ];
//     }

//     return [
//         ...BASE_COLUMNS,
//         { label: column,               key: column               },
//         { label: `${column} Date`,     key: `${column} Date`     },
//     ];
// };

// const cellSt = {
//     padding: "4px 10px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // Normalizes a key for loose comparison: strips spaces/underscores, lowercases
// const normalizeKey = (k) => String(k).toLowerCase().replace(/[\s_]/g, "");

// // Looks up a value on a row by trying the exact key first, then falling back
// // to a case/spacing/underscore-insensitive match against all keys on the row.
// // This guards against API field-name variants like "KAT Date" vs "KAT_Date"
// // vs "KATDate" vs "kat date" etc.
// const getRowValue = (row, wantedKey) => {
//     if (!row) return undefined;
//     if (row[wantedKey] !== undefined) return row[wantedKey];

//     const target = normalizeKey(wantedKey);
//     const foundKey = Object.keys(row).find((k) => normalizeKey(k) === target);
//     return foundKey !== undefined ? row[foundKey] : undefined;
// };

// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate  = useNavigate();
//     const location  = useLocation();

//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     // The exact PAT / SAT / KAT / SCFT key derived from whichever column was clicked.
//     // This is the single source of truth used to pull the right slice out of the
//     // API response, build the correct columns, and label the download file.
//     const reportKey = useMemo(() => normalizeReportKey(column), [column]);

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // Dynamic columns based on which status column was clicked (PAT / SAT / KAT / SCFT)
//     const DETAIL_COLUMNS = useMemo(() => buildDetailColumns(reportKey), [reportKey]);

//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");
//     const [downloading, setDownloading] = useState(false);

//     const fetchDetail = async () => {
//         try {
//             action(true);
//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             formData.append("column",     reportKey);
//             formData.append("key",        reportKey);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/generate-performance-at-srwise-report/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse({ data: {} });
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//             setApiResponse({ data: {} });
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && reportKey) fetchDetail();
//     }, [circle, reportKey, statusKey, initStart, initEnd]);

//     // ── Pull ONLY the rows that belong to the clicked report (PAT/SAT/KAT/SCFT) ──
//     // The API's response shape nests rows as: { data: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] } }
//     // regardless of the "key"/"column" filters we send — so we grab the one slice
//     // we actually need on the frontend rather than trusting the backend to have
//     // scoped it for us. A flat-array fallback is kept for older API shapes.
//     const scopedRows = useMemo(() => {
//         const data = apiResponse?.data ?? apiResponse?.summary;
//         if (!data) return [];

//         // New shape: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] }
//         if (!Array.isArray(data) && reportKey && Array.isArray(data[reportKey])) {
//             return data[reportKey];
//         }

//         // Legacy shape: a flat array containing all rows/columns together
//         if (Array.isArray(data)) return data;

//         return [];
//     }, [apiResponse, reportKey]);

//     // Extra client-side safety net: if a status was specified, keep only rows
//     // whose value in the reportKey column matches it (harmless if the backend
//     // already scoped this correctly).
//     const statusFilteredRows = useMemo(() => {
//         if (!statusKey || !reportKey) return scopedRows;
//         return scopedRows.filter((row) => {
//             const cellValue = getRowValue(row, reportKey);
//             return (
//                 cellValue !== null &&
//                 cellValue !== undefined &&
//                 String(cellValue).toLowerCase() === statusKey.toLowerCase()
//             );
//         });
//     }, [scopedRows, reportKey, statusKey]);

//     // Apply site search on top of status-filtered rows
//     const tableRows = useMemo(() => {
//         let rows = statusFilteredRows;

//         if (siteSearch.trim()) {
//             const q = siteSearch.trim().toLowerCase();
//             rows = rows.filter(
//                 (row) =>
//                     String(getRowValue(row, "Site ID")    ?? "").toLowerCase().includes(q) ||
//                     String(getRowValue(row, "SR_Site ID") ?? "").toLowerCase().includes(q)
//             );
//         }

//         return rows;
//     }, [statusFilteredRows, siteSearch]);

//     const hasActiveFilter = siteSearch.trim() !== "";

//     const clearAllFilters = () => {
//         setSiteSearch("");
//     };

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         reportKey && `Column: ${reportKey}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     // ── Backend-driven, single-file download ───────────────────────────────
//     // The backend's download endpoint keys strictly off the literal strings
//     // "PAT" / "SAT" / "KAT" / "SCFT" to decide which single report file to
//     // build — reportKey is guaranteed to be one of those exact four values
//     // (see normalizeReportKey above), so it's sent as-is.
//     const handleDownload = async () => {
//         if (downloading) return;
//         if (!reportKey) {
//             console.error("Download Error: no valid PAT/SAT/KAT/SCFT key resolved from column:", column);
//             return;
//         }

//         try {
//             setDownloading(true);
//             action(true);

//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             // The backend switches on this exact keyword — must be one of
//             // "PAT" | "SAT" | "KAT" | "SCFT" — to generate only that file.
//             formData.append("key",        reportKey);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/performance-at-pending-report/",
//                 formData
//             );

//             const url = res?.download_url;
//             if (!url) {
//                 console.error("Download Error: no download_url returned", res);
//                 return;
//             }

//             const link = document.createElement("a");
//             link.href = url;
//             link.download = "";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (err) {
//             console.error("Download Error:", err);
//         } finally {
//             action(false);
//             setDownloading(false);
//         }
//     };

//     const STRIPE    = "#f4f7fb";
//     const THEME_CLR = "#134e5e";

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
//                         SR Wise Details
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={1.5}
//                 >
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha(THEME_CLR, 0.08),
//                                 "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip label={`Circle: ${circle}`} size="small"
//                                         sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {reportKey && (
//                                     <Chip label={`Column: ${reportKey}`} size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {statusFilteredRows.length > 0 && (
//                                     <Chip
//                                         label={`${statusFilteredRows.length} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     <IconButton
//                         onClick={handleDownload}
//                         title={reportKey ? `Download ${reportKey} Excel` : "Download Excel"}
//                         disabled={downloading || !reportKey}
//                         sx={{
//                             bgcolor: alpha(THEME_CLR, 0.1),
//                             "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
//                             borderRadius: "10px",
//                         }}
//                     >
//                         <DownloadIcon color={downloading || !reportKey ? "disabled" : "primary"} />
//                     </IconButton>
//                 </Box>

//                 {/* Filter Bar */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 1.2,
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         px: 2, py: 1.5,
//                         mb: 1.5,
//                         borderRadius: "12px",
//                         border: "1px solid #e0e8ec",
//                         bgcolor: "#f8fafc",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
//                         <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                         <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
//                             Filters:
//                         </Typography>
//                     </Box>

//                     <TextField
//                         size="small"
//                         placeholder="Search by Site ID…"
//                         value={siteSearch}
//                         onChange={(e) => setSiteSearch(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             minWidth: 190,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                                 "&:hover fieldset":       { borderColor: THEME_CLR },
//                                 "&.Mui-focused fieldset": { borderColor: THEME_CLR },
//                             },
//                         }}
//                     />

//                     {hasActiveFilter && (
//                         <Chip
//                             label="Clear All"
//                             size="small"
//                             onDelete={clearAllFilters}
//                             onClick={clearAllFilters}
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: 11,
//                                 bgcolor: alpha("#546e7a", 0.12),
//                                 color: "#546e7a",
//                                 border: "1px solid " + alpha("#546e7a", 0.3),
//                                 "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                                 cursor: "pointer",
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <Box
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
//                             minWidth: 600,
//                         }}
//                     >
//                         <thead>
//                             <tr>
//                                 <th
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>
//                             <tr>
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {

//                                             // SR number column
//                                             if (col.key === "sr_no") {
//                                                 return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
//                                             }

//                                             const val = getRowValue(row, col.key);
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val) : "-";

//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             // Status column (the one actually clicked) — show its value with status color
//                                             if (isStatus) {
//                                                 return (
//                                                     <td
//                                                         key={col.key}
//                                                         style={{
//                                                             ...cellSt,
//                                                             ...getStatusStyle(display),
//                                                         }}
//                                                     >
//                                                         {display}
//                                                     </td>
//                                                 );
//                                             }

//                                             // Non-status columns render normally
//                                             return (
//                                                 <td key={col.key} style={cellSt}>
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 24,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : hasActiveFilter
//                                             ? "No records match the selected filters"
//                                             : "No Data Available"}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {statusFilteredRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">Showing</Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
//                                 <Chip
//                                     label="filtered"
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={clearAllFilters}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;

// import React, { useEffect, useState, useMemo } from "react";
// import {
//     Box,
//     Typography,
//     Breadcrumbs,
//     Link,
//     Chip,
//     IconButton,
//     TextField,
//     InputAdornment,
//     alpha,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import DownloadIcon           from "@mui/icons-material/Download";
// import SearchIcon             from "@mui/icons-material/Search";
// import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
// import FilterListIcon         from "@mui/icons-material/FilterList";

// import { useNavigate, useLocation } from "react-router-dom";
// import { postData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const COLORS = {
//     titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
//     headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
//     badge:    "#2e7d32",
//     border:   "#1f4037",
// };

// const STATUS_THEME = {
//     pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
//     offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
//     accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
// };

// // Base columns that are ALWAYS shown, regardless of which status column was clicked
// const BASE_COLUMNS = [
//     { label: "SR No.",     key: "sr_no"      },
//     { label: "SR Site ID", key: "SR_Site ID" },
//     { label: "Site ID",    key: "Site ID"    },
//     { label: "Circle",     key: "Circle"     },
//     { label: "MS Date", key: "MS Date" },
// ];

// // PAT / SAT / KAT / SCFT — the only valid "key" values the backend understands.
// // The API response nests rows under data.PAT / data.SAT / data.KAT / data.SCFT,
// // so this is also what we use to pull the correctly-scoped array out of the response.
// const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// // Normalizes any incoming column value (e.g. "kat", " KAT ", "Kat") to the
// // exact backend key it expects: "PAT" | "SAT" | "KAT" | "SCFT"
// const normalizeReportKey = (col) => {
//     if (!col) return "";
//     const match = STATUS_COLS.find(
//         (c) => c.toLowerCase() === String(col).trim().toLowerCase()
//     );
//     return match || "";
// };

// // Builds the column list dynamically: base columns + the clicked column + its date column
// const buildDetailColumns = (column) => {
//     if (!column || !STATUS_COLS.includes(column)) {
//         // Fallback: if no valid column passed, show everything (safety net)
//         return [
//             ...BASE_COLUMNS,
//             { label: "Site ID", key: "Site ID" },
//             { label: "PAT",  key: "PAT"  },
//             { label: "SAT",  key: "SAT"  },
//             { label: "KAT",  key: "KAT"  },
//             { label: "SCFT", key: "SCFT" },
//             { label: "PAT Date",  key: "PAT Date"  },
//             { label: "SAT Date",  key: "SAT Date"  },
//             { label: "KAT Date",  key: "KAT Date"  },
//             { label: "SCFT Date", key: "SCFT Date" },
//         ];
//     }

//     return [
//         ...BASE_COLUMNS,
//         { label: column,               key: column               },
//         { label: `${column} Date`,     key: `${column} Date`     },
//     ];
// };

// const cellSt = {
//     padding: "4px 10px",
//     border: "1px solid #c0c0c0",
//     textAlign: "center",
//     fontSize: 12,
//     whiteSpace: "nowrap",
// };

// const getStatusStyle = (value) => {
//     if (!value || value === "-" || value === "") return {};
//     const v = String(value).toLowerCase();
//     if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
//     if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
//     if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
//     return {};
// };

// // Normalizes a key for loose comparison: strips spaces/underscores, lowercases
// const normalizeKey = (k) => String(k).toLowerCase().replace(/[\s_]/g, "");

// // Looks up a value on a row by trying the exact key first, then falling back
// // to a case/spacing/underscore-insensitive match against all keys on the row.
// // This guards against API field-name variants like "KAT Date" vs "KAT_Date"
// // vs "KATDate" vs "kat date" etc.
// const getRowValue = (row, wantedKey) => {
//     if (!row) return undefined;
//     if (row[wantedKey] !== undefined) return row[wantedKey];

//     const target = normalizeKey(wantedKey);
//     const foundKey = Object.keys(row).find((k) => normalizeKey(k) === target);
//     return foundKey !== undefined ? row[foundKey] : undefined;
// };

// const SR_Wise_Hyperlink = () => {
//     const { loading, action } = useLoadingDialog();
//     const navigate  = useNavigate();
//     const location  = useLocation();

//     const {
//         circle    = "",
//         column    = "",
//         statusKey = "",
//         count     = 0,
//         startDate: initStart = "",
//         endDate:   initEnd   = "",
//     } = location.state || {};

//     // The exact PAT / SAT / KAT / SCFT key derived from whichever column was clicked.
//     // This is the single source of truth used to pull the right slice out of the
//     // API response, build the correct columns, and label the download file.
//     const reportKey = useMemo(() => normalizeReportKey(column), [column]);

//     const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

//     // Dynamic columns based on which status column was clicked (PAT / SAT / KAT / SCFT)
//     const DETAIL_COLUMNS = useMemo(() => buildDetailColumns(reportKey), [reportKey]);

//     const [apiResponse, setApiResponse] = useState(null);
//     const [hasFetched,  setHasFetched]  = useState(false);
//     const [siteSearch,  setSiteSearch]  = useState("");

//     const fetchDetail = async () => {
//         try {
//             action(true);
//             const formData = new FormData();
//             formData.append("start_date", initStart);
//             formData.append("end_date",   initEnd);
//             formData.append("circle",     circle);
//             // Backend switches on this exact keyword — must be one of
//             // "PAT" | "SAT" | "KAT" | "SCFT" — to scope both the returned
//             // `data` AND the `download_url` to just that single report.
//             formData.append("column",     reportKey);
//             formData.append("key",        reportKey);
//             if (statusKey) formData.append("status", statusKey);

//             const res = await postData(
//                 "performance_idploy/performance-at-pending-report/",
//                 formData
//             );

//             if (res?.status) {
//                 setApiResponse(res);
//             } else {
//                 setApiResponse({ data: {} });
//             }
//         } catch (err) {
//             console.error("Fetch Detail Error:", err);
//             setApiResponse({ data: {} });
//         } finally {
//             action(false);
//             setHasFetched(true);
//         }
//     };

//     useEffect(() => {
//         if (circle && reportKey) fetchDetail();
//     }, [circle, reportKey, statusKey, initStart, initEnd]);

//     // ── Pull ONLY the rows that belong to the clicked report (PAT/SAT/KAT/SCFT) ──
//     // The API's response shape nests rows as: { data: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] } }
//     // regardless of the "key"/"column" filters we send — so we grab the one slice
//     // we actually need on the frontend rather than trusting the backend to have
//     // scoped it for us. A flat-array fallback is kept for older API shapes.
//     const scopedRows = useMemo(() => {
//         const data = apiResponse?.data ?? apiResponse?.summary;
//         if (!data) return [];

//         // New shape: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] }
//         if (!Array.isArray(data) && reportKey && Array.isArray(data[reportKey])) {
//             return data[reportKey];
//         }

//         // Legacy shape: a flat array containing all rows/columns together
//         if (Array.isArray(data)) return data;

//         return [];
//     }, [apiResponse, reportKey]);

//     // Extra client-side safety net: if a status was specified, keep only rows
//     // whose value in the reportKey column matches it (harmless if the backend
//     // already scoped this correctly).
//     const statusFilteredRows = useMemo(() => {
//         if (!statusKey || !reportKey) return scopedRows;
//         return scopedRows.filter((row) => {
//             const cellValue = getRowValue(row, reportKey);
//             return (
//                 cellValue !== null &&
//                 cellValue !== undefined &&
//                 String(cellValue).toLowerCase() === statusKey.toLowerCase()
//             );
//         });
//     }, [scopedRows, reportKey, statusKey]);

//     // Apply site search on top of status-filtered rows
//     const tableRows = useMemo(() => {
//         let rows = statusFilteredRows;

//         if (siteSearch.trim()) {
//             const q = siteSearch.trim().toLowerCase();
//             rows = rows.filter(
//                 (row) =>
//                     String(getRowValue(row, "Site ID")    ?? "").toLowerCase().includes(q) ||
//                     String(getRowValue(row, "SR_Site ID") ?? "").toLowerCase().includes(q)
//             );
//         }

//         return rows;
//     }, [statusFilteredRows, siteSearch]);

//     const hasActiveFilter = siteSearch.trim() !== "";

//     const clearAllFilters = () => {
//         setSiteSearch("");
//     };

//     const titleLabel = [
//         circle    && `Circle: ${circle}`,
//         reportKey && `Column: ${reportKey}`,
//         statusKey && `Status: ${statusTheme.label}`,
//         initStart && initEnd && `${initStart} → ${initEnd}`,
//     ]
//         .filter(Boolean)
//         .join("   |   ");

//     // ── Download ─────────────────────────────────────────────────────────
//     // Reuse the download_url already returned by the scoped fetch above
//     // (generate-performance-at-srwise-report/), instead of calling a
//     // separate download endpoint. That fetch was made with
//     // column/key = reportKey ("PAT" | "SAT" | "KAT" | "SCFT"), so its
//     // response — and the download_url inside it — is already scoped to
//     // ONLY that single report. This is confirmed by the response's own
//     // `counts`/`data`: the other three keys come back as 0 / empty arrays.
//     // Calling a separate, unscoped download endpoint was what produced the
//     // multi-tab (PAT+SAT+KAT+SCFT) Excel file — this avoids that entirely.
//     const handleDownload = () => {
//         const url = apiResponse?.download_url;
//         if (!url) {
//             console.error("Download Error: no download_url available yet for this report");
//             return;
//         }

//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     const STRIPE    = "#f4f7fb";
//     const THEME_CLR = "#134e5e";

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
//                         Performance At
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
//                         SR Wise Details
//                     </Link>
//                     <Typography color="text.primary">Detail</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Box p={1}>
//                 {/* Top Bar */}
//                 <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="flex-start"
//                     flexWrap="wrap"
//                     gap={1.5}
//                     mb={1.5}
//                 >
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <IconButton
//                             size="small"
//                             onClick={() => navigate(-1)}
//                             sx={{
//                                 bgcolor: alpha(THEME_CLR, 0.08),
//                                 "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
//                             }}
//                         >
//                             <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
//                         </IconButton>

//                         <Box>
//                             <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
//                                 SR Wise Detail
//                             </Typography>
//                             <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
//                                 {circle && (
//                                     <Chip label={`Circle: ${circle}`} size="small"
//                                         sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {reportKey && (
//                                     <Chip label={`Column: ${reportKey}`} size="small"
//                                         sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
//                                 )}
//                                 {statusKey && (
//                                     <Chip
//                                         label={statusTheme.label}
//                                         size="small"
//                                         sx={{
//                                             bgcolor: statusTheme.bg,
//                                             color: statusTheme.color,
//                                             fontWeight: 700,
//                                             fontSize: 11,
//                                             border: `1.5px solid ${statusTheme.border}`,
//                                         }}
//                                     />
//                                 )}
//                                 {statusFilteredRows.length > 0 && (
//                                     <Chip
//                                         label={`${statusFilteredRows.length} records`}
//                                         size="small"
//                                         variant="outlined"
//                                         sx={{ fontWeight: 600, fontSize: 11 }}
//                                     />
//                                 )}
//                             </Box>
//                         </Box>
//                     </Box>

//                     <IconButton
//                         onClick={handleDownload}
//                         title={reportKey ? `Download ${reportKey} Excel` : "Download Excel"}
//                         disabled={!apiResponse?.download_url}
//                         sx={{
//                             bgcolor: alpha(THEME_CLR, 0.1),
//                             "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
//                             borderRadius: "10px",
//                         }}
//                     >
//                         <DownloadIcon color={!apiResponse?.download_url ? "disabled" : "primary"} />
//                     </IconButton>
//                 </Box>

//                 {/* Filter Bar */}
//                 <Box
//                     sx={{
//                         display: "flex",
//                         gap: 1.2,
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         px: 2, py: 1.5,
//                         mb: 1.5,
//                         borderRadius: "12px",
//                         border: "1px solid #e0e8ec",
//                         bgcolor: "#f8fafc",
//                         boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                     }}
//                 >
//                     <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
//                         <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
//                         <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
//                             Filters:
//                         </Typography>
//                     </Box>

//                     <TextField
//                         size="small"
//                         placeholder="Search by Site ID…"
//                         value={siteSearch}
//                         onChange={(e) => setSiteSearch(e.target.value)}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
//                                 </InputAdornment>
//                             ),
//                         }}
//                         sx={{
//                             minWidth: 190,
//                             "& .MuiOutlinedInput-root": {
//                                 borderRadius: "10px",
//                                 "&:hover fieldset":       { borderColor: THEME_CLR },
//                                 "&.Mui-focused fieldset": { borderColor: THEME_CLR },
//                             },
//                         }}
//                     />

//                     {hasActiveFilter && (
//                         <Chip
//                             label="Clear All"
//                             size="small"
//                             onDelete={clearAllFilters}
//                             onClick={clearAllFilters}
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: 11,
//                                 bgcolor: alpha("#546e7a", 0.12),
//                                 color: "#546e7a",
//                                 border: "1px solid " + alpha("#546e7a", 0.3),
//                                 "& .MuiChip-deleteIcon": { color: "#546e7a" },
//                                 cursor: "pointer",
//                             }}
//                         />
//                     )}
//                 </Box>

//                 {/* Table */}
//                 <Box
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
//                             minWidth: 600,
//                         }}
//                     >
//                         <thead>
//                             <tr>
//                                 <th
//                                     colSpan={DETAIL_COLUMNS.length}
//                                     style={{
//                                         ...cellSt,
//                                         background: COLORS.titleBg,
//                                         color: "#fff",
//                                         fontSize: 13,
//                                         fontWeight: 700,
//                                         textAlign: "center",
//                                         padding: "10px 12px",
//                                         border: `1px solid ${COLORS.border}`,
//                                     }}
//                                 >
//                                     {titleLabel}
//                                 </th>
//                             </tr>
//                             <tr>
//                                 {DETAIL_COLUMNS.map((col) => (
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
//                                         key={`${row["SR_Site ID"]}-${idx}`}
//                                         style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
//                                     >
//                                         {DETAIL_COLUMNS.map((col) => {

//                                             // SR number column
//                                             if (col.key === "sr_no") {
//                                                 return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
//                                             }

//                                             const val = getRowValue(row, col.key);
//                                             const display =
//                                                 val !== null && val !== undefined && val !== ""
//                                                     ? String(val) : "-";

//                                             const isStatus = STATUS_COLS.includes(col.key);

//                                             // Status column (the one actually clicked) — show its value with status color
//                                             if (isStatus) {
//                                                 return (
//                                                     <td
//                                                         key={col.key}
//                                                         style={{
//                                                             ...cellSt,
//                                                             ...getStatusStyle(display),
//                                                         }}
//                                                     >
//                                                         {display}
//                                                     </td>
//                                                 );
//                                             }

//                                             // Non-status columns render normally
//                                             return (
//                                                 <td key={col.key} style={cellSt}>
//                                                     {display}
//                                                 </td>
//                                             );
//                                         })}
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan={DETAIL_COLUMNS.length}
//                                         style={{
//                                             ...cellSt,
//                                             padding: 24,
//                                             color: "#9e9e9e",
//                                             fontSize: 14,
//                                             textAlign: "center",
//                                         }}
//                                     >
//                                         {!hasFetched
//                                             ? "Loading…"
//                                             : hasActiveFilter
//                                             ? "No records match the selected filters"
//                                             : "No Data Available"}
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     {statusFilteredRows.length > 0 && (
//                         <Box
//                             sx={{
//                                 display: "flex",
//                                 justifyContent: "flex-end",
//                                 alignItems: "center",
//                                 px: 2, py: 0.8,
//                                 borderTop: "1px solid #e0e0e0",
//                                 background: "#fafafa",
//                                 gap: 1,
//                                 flexWrap: "wrap",
//                             }}
//                         >
//                             <Typography variant="caption" color="text.secondary">Showing</Typography>
//                             <Chip
//                                 label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
//                                 size="small"
//                                 sx={{
//                                     background: COLORS.badge,
//                                     color: "#fff",
//                                     fontWeight: 600,
//                                     fontSize: 11,
//                                 }}
//                             />
//                             {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
//                                 <Chip
//                                     label="filtered"
//                                     size="small"
//                                     variant="outlined"
//                                     onDelete={clearAllFilters}
//                                     sx={{ fontSize: 10, fontWeight: 600 }}
//                                 />
//                             )}
//                         </Box>
//                     )}
//                 </Box>

//                 {loading}
//             </Box>
//         </>
//     );
// };

// export default SR_Wise_Hyperlink;


import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    alpha,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import DownloadIcon           from "@mui/icons-material/Download";
import SearchIcon             from "@mui/icons-material/Search";
import ArrowBackIcon          from "@mui/icons-material/ArrowBack";
import FilterListIcon         from "@mui/icons-material/FilterList";

import { useNavigate, useLocation } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const COLORS = {
    titleBg:  "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    headerBg: "linear-gradient(135deg, #0b3d2e 0%, #1f4037 100%)",
    badge:    "#2e7d32",
    border:   "#1f4037",
};

const STATUS_THEME = {
    pending:  { color: "#e65100", bg: "#fff3e0", border: "#ffcc80", label: "Pending"  },
    offered:  { color: "#0d47a1", bg: "#e3f2fd", border: "#90caf9", label: "Offered"  },
    accepted: { color: "#1b5e20", bg: "#e8f5e9", border: "#a5d6a7", label: "Accepted" },
};

// Base columns that are ALWAYS shown, regardless of which status column was clicked
const BASE_COLUMNS = [
    { label: "SR No.",     key: "sr_no"      },
    { label: "SR Site ID", key: "SR_Site ID" },
    { label: "Site ID",    key: "Site ID"    },
    { label: "Circle",     key: "Circle"     },
    { label: "MS Date", key: "MS Date" },
];

// PAT / SAT / KAT / SCFT — the only valid "key" values the backend understands.
// The API response nests rows under data.PAT / data.SAT / data.KAT / data.SCFT,
// so this is also what we use to pull the correctly-scoped array out of the response.
const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// Normalizes any incoming column value (e.g. "kat", " KAT ", "Kat") to the
// exact backend key it expects: "PAT" | "SAT" | "KAT" | "SCFT"
const normalizeReportKey = (col) => {
    if (!col) return "";
    const match = STATUS_COLS.find(
        (c) => c.toLowerCase() === String(col).trim().toLowerCase()
    );
    return match || "";
};

// Builds the column list dynamically: base columns + the clicked column + its date column
const buildDetailColumns = (column) => {
    if (!column || !STATUS_COLS.includes(column)) {
        // Fallback: if no valid column passed, show everything (safety net)
        return [
            ...BASE_COLUMNS,
            { label: "Site ID", key: "Site ID" },
            { label: "PAT",  key: "PAT"  },
            { label: "SAT",  key: "SAT"  },
            { label: "KAT",  key: "KAT"  },
            { label: "SCFT", key: "SCFT" },
            { label: "PAT Date",  key: "PAT Date"  },
            { label: "SAT Date",  key: "SAT Date"  },
            { label: "KAT Date",  key: "KAT Date"  },
            { label: "SCFT Date", key: "SCFT Date" },
        ];
    }

    return [
        ...BASE_COLUMNS,
        { label: column,               key: column               },
        { label: `${column} Date`,     key: `${column} Date`     },
    ];
};

const cellSt = {
    padding: "4px 10px",
    border: "1px solid #c0c0c0",
    textAlign: "center",
    fontSize: 12,
    whiteSpace: "nowrap",
};

const getStatusStyle = (value) => {
    if (!value || value === "-" || value === "") return {};
    const v = String(value).toLowerCase();
    if (v === "accepted") return { color: "#1b5e20", fontWeight: 600 };
    if (v === "pending")  return { color: "#e65100", fontWeight: 600 };
    if (v === "offered")  return { color: "#0d47a1", fontWeight: 600 };
    return {};
};

// Normalizes a key for loose comparison: strips spaces/underscores, lowercases
const normalizeKey = (k) => String(k).toLowerCase().replace(/[\s_]/g, "");

// Looks up a value on a row by trying the exact key first, then falling back
// to a case/spacing/underscore-insensitive match against all keys on the row.
// This guards against API field-name variants like "KAT Date" vs "KAT_Date"
// vs "KATDate" vs "kat date" etc.
const getRowValue = (row, wantedKey) => {
    if (!row) return undefined;
    if (row[wantedKey] !== undefined) return row[wantedKey];

    const target = normalizeKey(wantedKey);
    const foundKey = Object.keys(row).find((k) => normalizeKey(k) === target);
    return foundKey !== undefined ? row[foundKey] : undefined;
};

const SR_Wise_Hyperlink = () => {
    const { loading, action } = useLoadingDialog();
    const navigate  = useNavigate();
    const location  = useLocation();

    const {
        circle    = "",
        column    = "",
        statusKey = "",
        count     = 0,
        startDate: initStart = "",
        endDate:   initEnd   = "",
    } = location.state || {};

    // The exact PAT / SAT / KAT / SCFT key derived from whichever column was clicked.
    // This is the single source of truth used to pull the right slice out of the
    // API response, build the correct columns, and label the download file.
    const reportKey = useMemo(() => normalizeReportKey(column), [column]);

    const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

    // Dynamic columns based on which status column was clicked (PAT / SAT / KAT / SCFT)
    const DETAIL_COLUMNS = useMemo(() => buildDetailColumns(reportKey), [reportKey]);

    const [apiResponse, setApiResponse] = useState(null);
    const [hasFetched,  setHasFetched]  = useState(false);
    const [siteSearch,  setSiteSearch]  = useState("");

    const fetchDetail = async () => {
        try {
            action(true);
            const formData = new FormData();
            formData.append("start_date", initStart);
            formData.append("end_date",   initEnd);
            formData.append("circle",     circle);
            // Backend's actual field name for scoping is "status_filter",
            // and its value is the report acronym itself — must be one of
            // "PAT" | "SAT" | "KAT" | "SCFT" — to scope both the returned
            // `data` AND the `download_url` to just that single report.
            formData.append("status_filter", reportKey);
            if (statusKey) formData.append("status", statusKey);

            const res = await postData(
                "performance_idploy/performance-at-pending-report/",
                formData
            );

            if (res?.status) {
                setApiResponse(res);
            } else {
                setApiResponse({ data: {} });
            }
        } catch (err) {
            console.error("Fetch Detail Error:", err);
            setApiResponse({ data: {} });
        } finally {
            action(false);
            setHasFetched(true);
        }
    };

    useEffect(() => {
        if (circle && reportKey) fetchDetail();
    }, [circle, reportKey, statusKey, initStart, initEnd]);

    // ── Pull ONLY the rows that belong to the clicked report (PAT/SAT/KAT/SCFT) ──
    // The API's response shape nests rows as: { data: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] } }
    // regardless of the "key"/"column" filters we send — so we grab the one slice
    // we actually need on the frontend rather than trusting the backend to have
    // scoped it for us. A flat-array fallback is kept for older API shapes.
    const scopedRows = useMemo(() => {
        const data = apiResponse?.data ?? apiResponse?.summary;
        if (!data) return [];

        // New shape: { PAT: [...], SAT: [...], KAT: [...], SCFT: [...] }
        if (!Array.isArray(data) && reportKey && Array.isArray(data[reportKey])) {
            return data[reportKey];
        }

        // Legacy shape: a flat array containing all rows/columns together
        if (Array.isArray(data)) return data;

        return [];
    }, [apiResponse, reportKey]);

    // Extra client-side safety net: if a status was specified, keep only rows
    // whose value in the reportKey column matches it (harmless if the backend
    // already scoped this correctly).
    const statusFilteredRows = useMemo(() => {
        if (!statusKey || !reportKey) return scopedRows;
        return scopedRows.filter((row) => {
            const cellValue = getRowValue(row, reportKey);
            return (
                cellValue !== null &&
                cellValue !== undefined &&
                String(cellValue).toLowerCase() === statusKey.toLowerCase()
            );
        });
    }, [scopedRows, reportKey, statusKey]);

    // Apply site search on top of status-filtered rows
    const tableRows = useMemo(() => {
        let rows = statusFilteredRows;

        if (siteSearch.trim()) {
            const q = siteSearch.trim().toLowerCase();
            rows = rows.filter(
                (row) =>
                    String(getRowValue(row, "Site ID")    ?? "").toLowerCase().includes(q) ||
                    String(getRowValue(row, "SR_Site ID") ?? "").toLowerCase().includes(q)
            );
        }

        return rows;
    }, [statusFilteredRows, siteSearch]);

    const hasActiveFilter = siteSearch.trim() !== "";

    const clearAllFilters = () => {
        setSiteSearch("");
    };

    const titleLabel = [
        circle    && `Circle: ${circle}`,
        reportKey && `Column: ${reportKey}`,
        statusKey && `Status: ${statusTheme.label}`,
        initStart && initEnd && `${initStart} → ${initEnd}`,
    ]
        .filter(Boolean)
        .join("   |   ");

    // ── Download ─────────────────────────────────────────────────────────
    // Reuse the download_url already returned by the scoped fetch above
    // (performance-at-pending-report/), instead of calling a separate
    // download endpoint. That fetch was made with
    // status_filter = reportKey ("PAT" | "SAT" | "KAT" | "SCFT"), so its
    // response — and the download_url inside it — is already scoped to
    // ONLY that single report. This is confirmed by the response's own
    // `counts`/`data`: the other three keys come back as 0 / empty arrays.
    // Calling a separate, unscoped download endpoint was what produced the
    // multi-tab (PAT+SAT+KAT+SCFT) Excel file — this avoids that entirely.
    const handleDownload = () => {
        const url = apiResponse?.download_url;
        if (!url) {
            console.error("Download Error: no download_url available yet for this report");
            return;
        }

        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const STRIPE    = "#f4f7fb";
    const THEME_CLR = "#134e5e";

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={4}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                        Performance At
                    </Link>
                    <Link underline="hover" onClick={() => navigate(-1)} sx={{ cursor: "pointer" }}>
                        SR Wise Details
                    </Link>
                    <Typography color="text.primary">Detail</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* Top Bar */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={1.5}
                    mb={1.5}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            size="small"
                            onClick={() => navigate(-1)}
                            sx={{
                                bgcolor: alpha(THEME_CLR, 0.08),
                                "&:hover": { bgcolor: alpha(THEME_CLR, 0.16) },
                            }}
                        >
                            <ArrowBackIcon fontSize="small" sx={{ color: THEME_CLR }} />
                        </IconButton>

                        <Box>
                            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                                SR Wise Detail
                            </Typography>
                            <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
                                {circle && (
                                    <Chip label={`Circle: ${circle}`} size="small"
                                        sx={{ bgcolor: THEME_CLR, color: "#fff", fontWeight: 700, fontSize: 11 }} />
                                )}
                                {reportKey && (
                                    <Chip label={`Column: ${reportKey}`} size="small"
                                        sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }} />
                                )}
                                {statusKey && (
                                    <Chip
                                        label={statusTheme.label}
                                        size="small"
                                        sx={{
                                            bgcolor: statusTheme.bg,
                                            color: statusTheme.color,
                                            fontWeight: 700,
                                            fontSize: 11,
                                            border: `1.5px solid ${statusTheme.border}`,
                                        }}
                                    />
                                )}
                                {statusFilteredRows.length > 0 && (
                                    <Chip
                                        label={`${statusFilteredRows.length} records`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600, fontSize: 11 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={handleDownload}
                        title={reportKey ? `Download ${reportKey} Excel` : "Download Excel"}
                        disabled={!apiResponse?.download_url}
                        sx={{
                            bgcolor: alpha(THEME_CLR, 0.1),
                            "&:hover": { bgcolor: alpha(THEME_CLR, 0.18) },
                            borderRadius: "10px",
                        }}
                    >
                        <DownloadIcon color={!apiResponse?.download_url ? "disabled" : "primary"} />
                    </IconButton>
                </Box>

                {/* Filter Bar */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1.2,
                        flexWrap: "wrap",
                        alignItems: "center",
                        px: 2, py: 1.5,
                        mb: 1.5,
                        borderRadius: "12px",
                        border: "1px solid #e0e8ec",
                        bgcolor: "#f8fafc",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={0.5} mr={0.5}>
                        <FilterListIcon sx={{ fontSize: 16, color: "#607d8b" }} />
                        <Typography fontSize={12.5} fontWeight={700} color="#607d8b">
                            Filters:
                        </Typography>
                    </Box>

                    <TextField
                        size="small"
                        placeholder="Search by Site ID…"
                        value={siteSearch}
                        onChange={(e) => setSiteSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "#90a4ae" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            minWidth: 190,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                "&:hover fieldset":       { borderColor: THEME_CLR },
                                "&.Mui-focused fieldset": { borderColor: THEME_CLR },
                            },
                        }}
                    />

                    {hasActiveFilter && (
                        <Chip
                            label="Clear All"
                            size="small"
                            onDelete={clearAllFilters}
                            onClick={clearAllFilters}
                            sx={{
                                fontWeight: 700,
                                fontSize: 11,
                                bgcolor: alpha("#546e7a", 0.12),
                                color: "#546e7a",
                                border: "1px solid " + alpha("#546e7a", 0.3),
                                "& .MuiChip-deleteIcon": { color: "#546e7a" },
                                cursor: "pointer",
                            }}
                        />
                    )}
                </Box>

                {/* Table */}
                <Box
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
                            minWidth: 600,
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    colSpan={DETAIL_COLUMNS.length}
                                    style={{
                                        ...cellSt,
                                        background: COLORS.titleBg,
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 700,
                                        textAlign: "center",
                                        padding: "10px 12px",
                                        border: `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    {titleLabel}
                                </th>
                            </tr>
                            <tr>
                                {DETAIL_COLUMNS.map((col) => (
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
                                        key={`${row["SR_Site ID"]}-${idx}`}
                                        style={{ background: idx % 2 === 0 ? "#fff" : STRIPE }}
                                    >
                                        {DETAIL_COLUMNS.map((col) => {

                                            // SR number column
                                            if (col.key === "sr_no") {
                                                return <td key="sr_no" style={cellSt}>{idx + 1}</td>;
                                            }

                                            const val = getRowValue(row, col.key);
                                            const display =
                                                val !== null && val !== undefined && val !== ""
                                                    ? String(val) : "-";

                                            const isStatus = STATUS_COLS.includes(col.key);

                                            // Status column (the one actually clicked) — show its value with status color
                                            if (isStatus) {
                                                return (
                                                    <td
                                                        key={col.key}
                                                        style={{
                                                            ...cellSt,
                                                            ...getStatusStyle(display),
                                                        }}
                                                    >
                                                        {display}
                                                    </td>
                                                );
                                            }

                                            // Non-status columns render normally
                                            return (
                                                <td key={col.key} style={cellSt}>
                                                    {display}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={DETAIL_COLUMNS.length}
                                        style={{
                                            ...cellSt,
                                            padding: 24,
                                            color: "#9e9e9e",
                                            fontSize: 14,
                                            textAlign: "center",
                                        }}
                                    >
                                        {!hasFetched
                                            ? "Loading…"
                                            : hasActiveFilter
                                            ? "No records match the selected filters"
                                            : "No Data Available"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {statusFilteredRows.length > 0 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                px: 2, py: 0.8,
                                borderTop: "1px solid #e0e0e0",
                                background: "#fafafa",
                                gap: 1,
                                flexWrap: "wrap",
                            }}
                        >
                            <Typography variant="caption" color="text.secondary">Showing</Typography>
                            <Chip
                                label={`${tableRows.length} / ${statusFilteredRows.length} rows`}
                                size="small"
                                sx={{
                                    background: COLORS.badge,
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 11,
                                }}
                            />
                            {hasActiveFilter && tableRows.length !== statusFilteredRows.length && (
                                <Chip
                                    label="filtered"
                                    size="small"
                                    variant="outlined"
                                    onDelete={clearAllFilters}
                                    sx={{ fontSize: 10, fontWeight: 600 }}
                                />
                            )}
                        </Box>
                    )}
                </Box>

                {loading}
            </Box>
        </>
    );
};

export default SR_Wise_Hyperlink;