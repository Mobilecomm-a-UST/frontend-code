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

import React, { useEffect, useState } from "react";
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

import { useNavigate, useLocation } from "react-router-dom";
import { postData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ── Theme ─────────────────────────────────────────────────────────────────────
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

// ── Table columns shown on the detail page ────────────────────────────────────
const DETAIL_COLUMNS = [
    { label: "SR No.",      key: "sr_no"      },
    { label: "SR Site ID",  key: "SR_Site ID" },
    { label: "Site ID",     key: "Site ID"    },
    { label: "Circle",      key: "Circle"     },
    { label: "PAT",         key: "PAT"        },
    { label: "SAT",         key: "SAT"        },
    { label: "KAT",         key: "KAT"        },
    { label: "SCFT",        key: "SCFT"       },
    { label: "PAT Date",    key: "PAT Date"   },
    { label: "SAT Date",    key: "SAT Date"   },
    { label: "KAT Date",    key: "KAT Date"   },
    { label: "SCFT Date",   key: "SCFT Date"  },
];

const STATUS_COLS = ["PAT", "SAT", "KAT", "SCFT"];

// ── Shared cell styles ────────────────────────────────────────────────────────
const cellSt = {
    padding: "4px 8px",
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

// ── Main Component ────────────────────────────────────────────────────────────
const SR_Wise_Hyperlink = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const location = useLocation();

    // ── Context passed from parent page ──────────────────────────────────
    const {
        circle    = "",
        column    = "",
        statusKey = "",
        count     = 0,
        startDate: initStart = "",
        endDate:   initEnd   = "",
    } = location.state || {};

    const statusTheme = STATUS_THEME[statusKey?.toLowerCase()] ?? STATUS_THEME.pending;

    // ── Local state ───────────────────────────────────────────────────────
    const [apiResponse, setApiResponse] = useState(null);
    const [hasFetched,  setHasFetched]  = useState(false);
    const [siteSearch,  setSiteSearch]  = useState("");

    // ── Fetch detail data ─────────────────────────────────────────────────
    const fetchDetail = async () => {
        try {
            action(true);

            const formData = new FormData();
            formData.append("start_date", initStart);
            formData.append("end_date",   initEnd);
            formData.append("circle",     circle);
            formData.append("column",     column);
            if (statusKey) formData.append("status", statusKey);

            const res = await postData(
                "performance_idploy/generate-atsrwise-summary/",
                formData
            );

            if (res?.status) {
                setApiResponse(res);
            } else {
                setApiResponse(null);
            }
        } catch (err) {
            console.error("Fetch Detail Error:", err);
        } finally {
            action(false);
            setHasFetched(true);
        }
    };

    useEffect(() => {
        if (circle && column) fetchDetail();
    }, [circle, column, statusKey, initStart, initEnd]);

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

    // ── Filter rows by Site ID search ─────────────────────────────────────
    const allRows = apiResponse?.data || [];
    const tableRows = siteSearch.trim()
        ? allRows.filter((row) =>
            String(row["Site ID"] ?? "")
                .toLowerCase()
                .includes(siteSearch.trim().toLowerCase()) ||
            String(row["SR_Site ID"] ?? "")
                .toLowerCase()
                .includes(siteSearch.trim().toLowerCase())
          )
        : allRows;

    const titleLabel = [
        circle    && `Circle: ${circle}`,
        column    && `Column: ${column}`,
        statusKey && `Status: ${statusTheme.label}`,
        initStart && initEnd && `${initStart} → ${initEnd}`,
    ]
        .filter(Boolean)
        .join("   |   ");

    const STRIPE = "#f4f7fb";

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    maxItems={4}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>
                        Performance At
                    </Link>
                    <Link
                        underline="hover"
                        onClick={() => navigate(-1)}
                        sx={{ cursor: "pointer" }}
                    >
                        Performance SR Wise
                    </Link>
                    <Typography color="text.primary">Detail</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* ── Top Bar ── */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1.5}
                    mb={2}
                >
                    {/* Left: back + title */}
                    <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                            size="small"
                            onClick={() => navigate(-1)}
                            sx={{
                                bgcolor: alpha("#134e5e", 0.08),
                                "&:hover": { bgcolor: alpha("#134e5e", 0.16) },
                            }}
                        >
                            <ArrowBackIcon fontSize="small" sx={{ color: "#134e5e" }} />
                        </IconButton>

                        <Box>
                            <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                                SR Wise Detail
                            </Typography>
                            <Box display="flex" gap={0.8} flexWrap="wrap" mt={0.4}>
                                {circle && (
                                    <Chip
                                        label={`Circle: ${circle}`}
                                        size="small"
                                        sx={{ bgcolor: "#134e5e", color: "#fff", fontWeight: 700, fontSize: 11 }}
                                    />
                                )}
                                {column && (
                                    <Chip
                                        label={`Column: ${column}`}
                                        size="small"
                                        sx={{ bgcolor: "#1f4037", color: "#fff", fontWeight: 700, fontSize: 11 }}
                                    />
                                )}
                                {statusKey && (
                                    <Chip
                                        label={statusTheme.label}
                                        size="small"
                                        sx={{
                                            bgcolor: statusTheme.bg,
                                            color:   statusTheme.color,
                                            fontWeight: 700,
                                            fontSize: 11,
                                            border: `1.5px solid ${statusTheme.border}`,
                                        }}
                                    />
                                )}
                                {count > 0 && (
                                    <Chip
                                        label={`${count} records`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600, fontSize: 11 }}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Right: Site ID search + download */}
                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
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
                                minWidth: 200,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    "&:hover fieldset":       { borderColor: "#134e5e" },
                                    "&.Mui-focused fieldset": { borderColor: "#134e5e" },
                                },
                            }}
                        />

                        <IconButton
                            onClick={handleDownload}
                            title="Download Excel"
                            disabled={!apiResponse?.download_url}
                            sx={{
                                bgcolor: apiResponse?.download_url
                                    ? alpha("#134e5e", 0.1) : "transparent",
                                "&:hover": { bgcolor: alpha("#134e5e", 0.18) },
                                borderRadius: "10px",
                            }}
                        >
                            <DownloadIcon
                                color={apiResponse?.download_url ? "primary" : "disabled"}
                            />
                        </IconButton>
                    </Box>
                </Box>

                {/* ── Table ── */}
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
                            minWidth: 900,
                        }}
                    >
                        <thead>
                            {/* Title row */}
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

                            {/* Column header row */}
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
                                            // SR No. — synthetic serial number
                                            if (col.key === "sr_no") {
                                                return (
                                                    <td key="sr_no" style={cellSt}>
                                                        {idx + 1}
                                                    </td>
                                                );
                                            }

                                            const val = row?.[col.key];
                                            const display =
                                                val !== null && val !== undefined && val !== ""
                                                    ? String(val)
                                                    : "-";
                                            const isStatus = STATUS_COLS.includes(col.key);

                                            return (
                                                <td
                                                    key={col.key}
                                                    style={{
                                                        ...cellSt,
                                                        ...(isStatus ? getStatusStyle(display) : {}),
                                                    }}
                                                >
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
                                            padding: 20,
                                            color: "#9e9e9e",
                                            fontSize: 14,
                                            textAlign: "center",
                                        }}
                                    >
                                        {!hasFetched
                                            ? "Loading…"
                                            : siteSearch
                                            ? `No results for "${siteSearch}"`
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
                                label={`${tableRows.length} / ${allRows.length} rows`}
                                size="small"
                                sx={{
                                    background: COLORS.badge,
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: 11,
                                }}
                            />
                            {siteSearch && tableRows.length !== allRows.length && (
                                <Chip
                                    label={`filtered by "${siteSearch}"`}
                                    size="small"
                                    variant="outlined"
                                    onDelete={() => setSiteSearch("")}
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