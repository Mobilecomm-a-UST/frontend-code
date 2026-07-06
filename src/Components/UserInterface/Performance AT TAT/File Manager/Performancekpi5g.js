// import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, IconButton, TextField, Tooltip, Chip, CircularProgress,
//     TablePagination, InputAdornment,
// } from "@mui/material";
// import {
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
//     Search as SearchIcon,
//     Close as CloseIcon,
//     Assessment as AssessmentIcon,
//     FilterAlt as FilterAltIcon,
//     Refresh as RefreshIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // ─── theme constants (matches the rest of the Microwave/Ceragon tools) ──────
// const TEAL = "#2a77bf";
// const TEAL_DARK = "#28538c";
// const TEAL_LIGHT = "#e0f2f1";
// const TEAL_MID = "#b2dfdb";

// const fieldSx = {
//     "& .MuiOutlinedInput-root": {
//         borderRadius: "8px",
//         fontSize: 13,
//         "&:hover fieldset": { borderColor: TEAL },
//         "&.Mui-focused fieldset": { borderColor: TEAL },
//     },
//     "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
// };

// // ───────────────────────────────────────────────────────────────────────────
// // NOTE ON ASSUMPTIONS
// // No sample JSON was provided for either endpoint, so this file is written to
// // be shape-agnostic: it looks for a results array / a download link under a
// // handful of likely keys, and — for the filter table — builds its columns
// // dynamically from whatever keys the returned rows actually have. Once you
// // share a real sample response for each endpoint, the extraction helpers
// // below (extractRows, extractDownloadUrl) are the only things that need
// // tightening up to the exact field names.
// // ───────────────────────────────────────────────────────────────────────────

// const GENERATE_REPORT_ENDPOINT = "kpi_monitoring/generate-kpi-monitoring-report/";
// const FILTER_REPORT_ENDPOINT = "kpi_monitoring/filter-kpi-report/";

// // Pulls a flat array of row objects out of whatever shape the API responds
// // with (raw array, {data:[...]}, {results:[...]}, {report:[...]}, {kpis:[...]}).
// const extractRows = (res) => {
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res?.data)) return res.data;
//     if (Array.isArray(res?.results)) return res.results;
//     if (Array.isArray(res?.report)) return res.report;
//     if (Array.isArray(res?.kpis)) return res.kpis;
//     if (Array.isArray(res?.records)) return res.records;
//     return [];
// };

// // Pulls a downloadable file URL out of whatever shape the "generate report"
// // API responds with.
// const extractDownloadUrl = (res) =>
//     res?.download_url ?? res?.file_url ?? res?.url ?? res?.data?.download_url ?? res?.data?.file_url ?? null;

// // snake_case / camelCase -> "Title Case" for table headers.
// const humanizeKey = (key) =>
//     String(key)
//         .replace(/_/g, " ")
//         .replace(/([a-z])([A-Z])/g, "$1 $2")
//         .replace(/\s+/g, " ")
//         .trim()
//         .replace(/\b\w/g, (c) => c.toUpperCase());

// // Builds an ordered column list from the union of keys across the given
// // rows (capped at a sample so a huge result set doesn't get scanned fully).
// const deriveColumns = (rows) => {
//     const seen = new Set();
//     const columns = [];
//     rows.slice(0, 25).forEach((row) => {
//         Object.keys(row || {}).forEach((key) => {
//             if (!seen.has(key)) { seen.add(key); columns.push(key); }
//         });
//     });
//     return columns;
// };

// const formatCell = (value) => {
//     if (value === null || value === undefined || value === "") return "—";
//     if (typeof value === "boolean") return value ? "Yes" : "No";
//     if (typeof value === "object") return JSON.stringify(value);
//     return String(value);
// };

// // ─── Dynamic results table with pagination ───────────────────────────────────
// const KpiResultsTable = ({ rows, loading, hasSearched }) => {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     const columns = useMemo(() => deriveColumns(rows), [rows]);

//     useEffect(() => { setPage(0); }, [rows]);

//     const pagedRows = useMemo(
//         () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
//         [rows, page, rowsPerPage]
//     );

//     return (
//         <Box>
//             <Box display="flex" alignItems="center" gap={0.8} mb={1}>
//                 <FilterAltIcon sx={{ fontSize: 17, color: TEAL }} />
//                 <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Filtered KPI Results</Typography>
//                 {rows.length > 0 && (
//                     <Chip label={`${rows.length} row${rows.length === 1 ? "" : "s"}`} size="small"
//                         sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
//                 )}
//             </Box>

//             <TableContainer component={Paper} elevation={0}
//                 sx={{
//                     border: `1px solid ${TEAL_MID}`, borderRadius: "10px", overflow: "hidden",
//                     maxHeight: 460, overflowY: "auto",
//                     "&::-webkit-scrollbar": { width: 5, height: 5 },
//                     "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
//                     "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
//                 }}>
//                 <Table size="small" stickyHeader>
//                     <TableHead>
//                         <TableRow>
//                             {columns.length === 0 ? (
//                                 <TableCell sx={{ bgcolor: TEAL, color: "#fff", fontWeight: 700, fontSize: 12.5 }}>Result</TableCell>
//                             ) : columns.map((col) => (
//                                 <TableCell key={col} sx={{
//                                     color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.2,
//                                     bgcolor: TEAL, letterSpacing: ".02em", whiteSpace: "nowrap",
//                                     position: "sticky", top: 0, zIndex: 2,
//                                 }}>
//                                     {humanizeKey(col)}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading && (
//                             <TableRow>
//                                 <TableCell colSpan={Math.max(columns.length, 1)} align="center" sx={{ py: 3 }}>
//                                     <CircularProgress size={22} sx={{ color: TEAL }} />
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && rows.length === 0 && (
//                             <TableRow>
//                                 <TableCell colSpan={Math.max(columns.length, 1)} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
//                                     {hasSearched
//                                         ? "No KPI records matched those filters."
//                                         : "Enter a Site ID / Short Name or Circle above to filter the KPI report."}
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                         {!loading && pagedRows.map((row, idx) => (
//                             <TableRow key={row.id ?? row.site_id ?? idx} hover
//                                 sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
//                                 {columns.map((col) => (
//                                     <TableCell key={col} sx={{ fontSize: 12.5, color: "#374151", whiteSpace: "nowrap" }}>
//                                         {formatCell(row[col])}
//                                     </TableCell>
//                                 ))}
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {rows.length > 0 && (
//                 <TablePagination
//                     component="div"
//                     count={rows.length}
//                     page={page}
//                     onPageChange={(e, newPage) => setPage(newPage)}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
//                     rowsPerPageOptions={[10, 25, 50, 100]}
//                     sx={{ ".MuiTablePagination-toolbar": { fontSize: 12.5 } }}
//                 />
//             )}
//         </Box>
//     );
// };

// // ═══════════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════════
// const Performancekpi5g = () => {
//     const classes = OverAllCss();
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();

//     // ── Overall report generation ────────────────────────────────────────────────
//     const [generating, setGenerating] = useState(false);
//     const [reportDownloadUrl, setReportDownloadUrl] = useState(null);
//     const [reportMessage, setReportMessage] = useState(null);

//     const handleGenerateReport = async () => {
//         setGenerating(true);
//         action(true);
//         try {
//             // Assumes a POST trigger, matching the pattern used by every other
//             // "do a thing on the server" action in this app (postData + FormData).
//             // If this endpoint is actually a plain GET, swap this for:
//             //   const res = await getData(GENERATE_REPORT_ENDPOINT);
//             const res = await postData(GENERATE_REPORT_ENDPOINT, new FormData());
//             const downloadUrl = extractDownloadUrl(res);
//             const success = res?.status !== false; // treat anything not explicitly false as success
//             if (success) {
//                 setReportDownloadUrl(downloadUrl);
//                 setReportMessage(res?.message || "KPI monitoring report generated.");
//                 Swal.fire("Done", res?.message || "KPI monitoring report generated.", "success");
//             } else {
//                 Swal.fire("Oops...", res?.message || "Report generation failed.", "error");
//             }
//         } catch {
//             Swal.fire("Error", "Something went wrong while generating the report.", "error");
//         } finally {
//             setGenerating(false);
//             action(false);
//         }
//     };

//     // ── Filtered KPI report (site_id/short_name + circle) ───────────────────────
//     const [siteQuery, setSiteQuery] = useState("");
//     const [circleQuery, setCircleQuery] = useState("");
//     const [filteredRows, setFilteredRows] = useState([]);
//     const [filterLoading, setFilterLoading] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const requestIdRef = useRef(0);

//     const runFilter = useCallback(async (site, circle) => {
//         const siteTrimmed = site.trim();
//         const circleTrimmed = circle.trim();
//         if (!siteTrimmed && !circleTrimmed) {
//             setFilteredRows([]);
//             setHasSearched(false);
//             return;
//         }
//         const currentRequestId = ++requestIdRef.current;
//         setFilterLoading(true);
//         try {
//             const params = new URLSearchParams();
//             // Sent under both keys since "site_id/short_name" implies a single
//             // lookup value that could match either field on the backend —
//             // trim down to whichever the API actually expects once confirmed.
//             if (siteTrimmed) {
//                 params.append("site_id", siteTrimmed);
//                 params.append("short_name", siteTrimmed);
//             }
//             if (circleTrimmed) params.append("circle", circleTrimmed);

//             const res = await postData(`${FILTER_REPORT_ENDPOINT}?${params.toString()}`);
//             if (currentRequestId !== requestIdRef.current) return; // stale, ignore
//             setFilteredRows(extractRows(res));
//             setHasSearched(true);
//         } catch {
//             if (currentRequestId === requestIdRef.current) {
//                 setFilteredRows([]);
//                 setHasSearched(true);
//             }
//         } finally {
//             if (currentRequestId === requestIdRef.current) setFilterLoading(false);
//         }
//     }, []);

//     // Debounced auto-filter as the user types in either field.
//     useEffect(() => {
//         const timer = setTimeout(() => runFilter(siteQuery, circleQuery), 300);
//         return () => clearTimeout(timer);
//     }, [siteQuery, circleQuery, runFilter]);

//     const handleResetFilters = () => {
//         setSiteQuery("");
//         setCircleQuery("");
//         setFilteredRows([]);
//         setHasSearched(false);
//     };

//     // ─── render ───────────────────────────────────────────────────────────────────
//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Typography color="text.primary">KPI Monitoring Report</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>KPI Monitoring Report</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 {/* ── GENERATE OVERALL REPORT ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
//                                         <AssessmentIcon sx={{ fontSize: 18, color: TEAL }} />
//                                         <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
//                                             Generate Overall KPI Monitoring Report
//                                         </Typography>
//                                     </Box>
//                                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
//                                         <Button
//                                             variant="contained"
//                                             onClick={handleGenerateReport}
//                                             disabled={generating}
//                                             startIcon={generating ? <CircularProgress size={14} color="inherit" /> : <AssessmentIcon sx={{ fontSize: 16 }} />}
//                                             sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
//                                         >
//                                             {generating ? "Generating…" : "Generate Report"}
//                                         </Button>
//                                         {reportMessage && (
//                                             <Typography fontSize={12.5} color="gray">{reportMessage}</Typography>
//                                         )}
//                                     </Stack>
//                                     {reportDownloadUrl && (
//                                         <Box mt={1.5}>
//                                             <a href={reportDownloadUrl} download>
//                                                 <Button variant="outlined"
//                                                     startIcon={<FileDownloadIcon sx={{ fontSize: 20, color: "green" }} />}
//                                                     sx={{ textTransform: "none", fontWeight: 700 }}>
//                                                     Download KPI Monitoring Report
//                                                 </Button>
//                                             </a>
//                                         </Box>
//                                     )}
//                                 </Box>

//                                 {/* ── FILTER KPI REPORT ── */}
//                                 <Box className={classes.Front_Box}>
//                                     <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
//                                         <FilterAltIcon sx={{ fontSize: 18, color: TEAL }} />
//                                         <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
//                                             Filter KPI Report
//                                         </Typography>
//                                     </Box>
//                                     <Grid container spacing={2} alignItems="center" mb={2}>
//                                         <Grid item xs={12} sm={5} md={4}>
//                                             <TextField
//                                                 label="Site ID / Short Name"
//                                                 placeholder="e.g. SITE1234 or MUM-North"
//                                                 value={siteQuery}
//                                                 onChange={(e) => setSiteQuery(e.target.value)}
//                                                 size="small" fullWidth sx={fieldSx}
//                                                 InputProps={{
//                                                     startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>,
//                                                     endAdornment: siteQuery && (
//                                                         <InputAdornment position="end">
//                                                             <IconButton size="small" onClick={() => setSiteQuery("")}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
//                                                         </InputAdornment>
//                                                     ),
//                                                 }}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={5} md={4}>
//                                             <TextField
//                                                 label="Circle"
//                                                 placeholder="e.g. MAH, DEL, ROTN"
//                                                 value={circleQuery}
//                                                 onChange={(e) => setCircleQuery(e.target.value)}
//                                                 size="small" fullWidth sx={fieldSx}
//                                                 InputProps={{
//                                                     startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>,
//                                                     endAdornment: circleQuery && (
//                                                         <InputAdornment position="end">
//                                                             <IconButton size="small" onClick={() => setCircleQuery("")}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
//                                                         </InputAdornment>
//                                                     ),
//                                                 }}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={12} sm={2} md={4}>
//                                             <Tooltip title="Reset filters" arrow>
//                                                 <span>
//                                                     <Button
//                                                         onClick={handleResetFilters}
//                                                         disabled={!siteQuery && !circleQuery}
//                                                         startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
//                                                         sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}
//                                                     >
//                                                         Reset
//                                                     </Button>
//                                                 </span>
//                                             </Tooltip>
//                                         </Grid>
//                                     </Grid>

//                                     <KpiResultsTable rows={filteredRows} loading={filterLoading} hasSearched={hasSearched} />
//                                 </Box>

//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default Performancekpi5g;

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, TextField, Tooltip, Chip, CircularProgress,
    TablePagination, InputAdornment,
} from "@mui/material";
import {
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Search as SearchIcon,
    Close as CloseIcon,
    Assessment as AssessmentIcon,
    FilterAlt as FilterAltIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// ─── theme constants (matches the rest of the Microwave/Ceragon tools) ──────
const TEAL = "#2a77bf";
const TEAL_DARK = "#28538c";
const TEAL_LIGHT = "#e0f2f1";
const TEAL_MID = "#b2dfdb";

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        fontSize: 13,
        "&:hover fieldset": { borderColor: TEAL },
        "&.Mui-focused fieldset": { borderColor: TEAL },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: TEAL },
};

// ───────────────────────────────────────────────────────────────────────────
// NOTE ON ASSUMPTIONS
// No sample JSON was provided for either endpoint, so this file is written to
// be shape-agnostic: it looks for a results array / a download link under a
// handful of likely keys, and — for the filter table — builds its columns
// dynamically from whatever keys the returned rows actually have. Once you
// share a real sample response for each endpoint, the extraction helpers
// below (extractRows, extractDownloadUrl) are the only things that need
// tightening up to the exact field names.
// ───────────────────────────────────────────────────────────────────────────

const GENERATE_REPORT_ENDPOINT = "kpi_monitoring/generate-kpi-monitoring-report/";
const FILTER_REPORT_ENDPOINT = "kpi_monitoring/filter-kpi-report/";

// Pulls a flat array of row objects out of whatever shape the API responds
// with (raw array, {data:[...]}, {results:[...]}, {report:[...]}, {kpis:[...]}).
const extractRows = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.report)) return res.report;
    if (Array.isArray(res?.kpis)) return res.kpis;
    if (Array.isArray(res?.records)) return res.records;
    return [];
};

// Pulls a downloadable file URL out of whatever shape the "generate report"
// API responds with.
const extractDownloadUrl = (res) =>
    res?.download_url ?? res?.file_url ?? res?.url ?? res?.data?.download_url ?? res?.data?.file_url ?? null;

// snake_case / camelCase -> "Title Case" for table headers.
const humanizeKey = (key) =>
    String(key)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());

// Builds an ordered column list from the union of keys across the given
// rows (capped at a sample so a huge result set doesn't get scanned fully).
const deriveColumns = (rows) => {
    const seen = new Set();
    const columns = [];
    rows.slice(0, 25).forEach((row) => {
        Object.keys(row || {}).forEach((key) => {
            if (!seen.has(key)) { seen.add(key); columns.push(key); }
        });
    });
    return columns;
};

const formatCell = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
};

// ─── Dynamic results table with pagination ───────────────────────────────────
const KpiResultsTable = ({ rows, loading, hasSearched }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = useMemo(() => deriveColumns(rows), [rows]);

    useEffect(() => { setPage(0); }, [rows]);

    const pagedRows = useMemo(
        () => rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [rows, page, rowsPerPage]
    );

    return (
        <Box>
            <Box display="flex" alignItems="center" gap={0.8} mb={1}>
                <FilterAltIcon sx={{ fontSize: 17, color: TEAL }} />
                <Typography fontSize={13.5} fontWeight={700} color="#1a1a2e">Filtered KPI Results</Typography>
                {rows.length > 0 && (
                    <Chip label={`${rows.length} row${rows.length === 1 ? "" : "s"}`} size="small"
                        sx={{ height: 20, fontSize: 10.5, bgcolor: TEAL_LIGHT, color: TEAL_DARK, border: `1px solid ${TEAL_MID}` }} />
                )}
            </Box>

            <TableContainer component={Paper} elevation={0}
                sx={{
                    border: `1px solid ${TEAL_MID}`, borderRadius: "10px", overflow: "hidden",
                    maxHeight: 460, overflowY: "auto",
                    "&::-webkit-scrollbar": { width: 5, height: 5 },
                    "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: 4 },
                    "&::-webkit-scrollbar-thumb": { background: TEAL_MID, borderRadius: 4 },
                    "&::-webkit-scrollbar-thumb:hover": { background: TEAL },
                }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.length === 0 ? (
                                <TableCell sx={{ bgcolor: TEAL, color: "#fff", fontWeight: 700, fontSize: 12.5 }}>Result</TableCell>
                            ) : columns.map((col) => (
                                <TableCell key={col} sx={{
                                    color: "#fff", fontWeight: 700, fontSize: 12.5, py: 1.2,
                                    bgcolor: TEAL, letterSpacing: ".02em", whiteSpace: "nowrap",
                                    position: "sticky", top: 0, zIndex: 2,
                                }}>
                                    {humanizeKey(col)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={Math.max(columns.length, 1)} align="center" sx={{ py: 3 }}>
                                    <CircularProgress size={22} sx={{ color: TEAL }} />
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && rows.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={Math.max(columns.length, 1)} align="center" sx={{ py: 3, color: "#aaa", fontSize: 13 }}>
                                    {hasSearched
                                        ? "No KPI records matched those filters."
                                        : "Enter a Site ID / Short Name or Circle above to filter the KPI report."}
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && pagedRows.map((row, idx) => (
                            <TableRow key={row.id ?? row.site_id ?? idx} hover
                                sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fcfb" }, "&:hover": { bgcolor: TEAL_LIGHT + "88" } }}>
                                {columns.map((col) => (
                                    <TableCell key={col} sx={{ fontSize: 12.5, color: "#374151", whiteSpace: "nowrap" }}>
                                        {formatCell(row[col])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {rows.length > 0 && (
                <TablePagination
                    component="div"
                    count={rows.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    sx={{ ".MuiTablePagination-toolbar": { fontSize: 12.5 } }}
                />
            )}
        </Box>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const Performancekpi5g = () => {
    const classes = OverAllCss();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();

    // ── Overall report generation ────────────────────────────────────────────────
    const [generating, setGenerating] = useState(false);
    const [reportDownloadUrl, setReportDownloadUrl] = useState(null);
    const [reportMessage, setReportMessage] = useState(null);

    const handleGenerateReport = async () => {
        setGenerating(true);
        action(true);
        try {
            // Assumes a POST trigger, matching the pattern used by every other
            // "do a thing on the server" action in this app (postData + FormData).
            // If this endpoint is actually a plain GET, swap this for:
            //   const res = await getData(GENERATE_REPORT_ENDPOINT);
            const res = await postData(GENERATE_REPORT_ENDPOINT, new FormData());
            const downloadUrl = extractDownloadUrl(res);
            const success = res?.status !== false; // treat anything not explicitly false as success
            if (success) {
                setReportDownloadUrl(downloadUrl);
                setReportMessage(res?.message || "KPI monitoring report generated.");
                Swal.fire("Done", res?.message || "KPI monitoring report generated.", "success");
            } else {
                Swal.fire("Oops...", res?.message || "Report generation failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong while generating the report.", "error");
        } finally {
            setGenerating(false);
            action(false);
        }
    };

    // ── Filtered KPI report (site_id/short_name + circle) ───────────────────────
    const [siteQuery, setSiteQuery] = useState("");
    const [circleQuery, setCircleQuery] = useState("");
    const [filteredRows, setFilteredRows] = useState([]);
    const [filterLoading, setFilterLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const requestIdRef = useRef(0);

    // Filtered report download (scoped to the current Site ID / Circle)
    const [filteredReportGenerating, setFilteredReportGenerating] = useState(false);
    const [filteredReportDownloadUrl, setFilteredReportDownloadUrl] = useState(null);
    const [filteredReportMessage, setFilteredReportMessage] = useState(null);

    // Builds the shared request body for both the filter lookup and the
    // filtered report generation, since they take the same inputs.
    const buildFilterFormData = (site, circle) => {
        const siteTrimmed = site.trim();
        const circleTrimmed = circle.trim();
        const formData = new FormData();
        // Sent under both keys since "site_id/short_name" implies a single
        // lookup value that could match either field on the backend —
        // trim down to whichever the API actually expects once confirmed.
        if (siteTrimmed) {
            formData.append("site_id", siteTrimmed);
            formData.append("short_name", siteTrimmed);
        }
        if (circleTrimmed) formData.append("circle", circleTrimmed);
        return { formData, siteTrimmed, circleTrimmed };
    };

    const runFilter = useCallback(async (site, circle) => {
        const { formData, siteTrimmed, circleTrimmed } = buildFilterFormData(site, circle);
        if (!siteTrimmed && !circleTrimmed) {
            setFilteredRows([]);
            setHasSearched(false);
            return;
        }
        const currentRequestId = ++requestIdRef.current;
        setFilterLoading(true);
        try {
            // ✅ FIX: site_id/short_name/circle must be sent in the POST body,
            // not the query string. The backend reads request.data, so the
            // previous version — which put everything after "?" but sent an
            // empty body — triggered a 400: "Provide at least one of
            // 'site_id' or 'short_name'." even though the URL clearly had them.
            const res = await postData(FILTER_REPORT_ENDPOINT, formData);
            if (currentRequestId !== requestIdRef.current) return; // stale, ignore
            setFilteredRows(extractRows(res));
            setHasSearched(true);
        } catch {
            if (currentRequestId === requestIdRef.current) {
                setFilteredRows([]);
                setHasSearched(true);
            }
        } finally {
            if (currentRequestId === requestIdRef.current) setFilterLoading(false);
        }
    }, []);

    // Debounced auto-filter as the user types in either field.
    useEffect(() => {
        const timer = setTimeout(() => runFilter(siteQuery, circleQuery), 300);
        return () => clearTimeout(timer);
    }, [siteQuery, circleQuery, runFilter]);

    // Generates a downloadable report scoped to the current Site ID / Circle,
    // so filtering AND getting a report out of that filter both work.
    const handleGenerateFilteredReport = async () => {
        const { formData, siteTrimmed, circleTrimmed } = buildFilterFormData(siteQuery, circleQuery);
        if (!siteTrimmed && !circleTrimmed) {
            Swal.fire("Almost there", "Enter a Site ID / Short Name or Circle first.", "info");
            return;
        }
        setFilteredReportGenerating(true);
        action(true);
        try {
            const res = await postData(GENERATE_REPORT_ENDPOINT, formData);
            const downloadUrl = extractDownloadUrl(res);
            const success = res?.status !== false;
            if (success) {
                setFilteredReportDownloadUrl(downloadUrl);
                setFilteredReportMessage(res?.message || "Filtered KPI report generated.");
                Swal.fire("Done", res?.message || "Filtered KPI report generated.", "success");
            } else {
                Swal.fire("Oops...", res?.message || "Report generation failed.", "error");
            }
        } catch {
            Swal.fire("Error", "Something went wrong while generating the report.", "error");
        } finally {
            setFilteredReportGenerating(false);
            action(false);
        }
    };

    const handleResetFilters = () => {
        setSiteQuery("");
        setCircleQuery("");
        setFilteredRows([]);
        setHasSearched(false);
        setFilteredReportDownloadUrl(null);
        setFilteredReportMessage(null);
    };

    // ─── render ───────────────────────────────────────────────────────────────────
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">KPI Monitoring Report</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "82%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>KPI Monitoring Report</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* ── GENERATE OVERALL REPORT ── */}
                                <Box className={classes.Front_Box}>
                                    <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
                                        <AssessmentIcon sx={{ fontSize: 18, color: TEAL }} />
                                        <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
                                            Generate Overall KPI Monitoring Report
                                        </Typography>
                                    </Box>
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleGenerateReport}
                                            disabled={generating}
                                            startIcon={generating ? <CircularProgress size={14} color="inherit" /> : <AssessmentIcon sx={{ fontSize: 16 }} />}
                                            sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "uppercase", fontWeight: 700, px: 3 }}
                                        >
                                            {generating ? "Generating…" : "Generate Report"}
                                        </Button>
                                        {reportMessage && (
                                            <Typography fontSize={12.5} color="gray">{reportMessage}</Typography>
                                        )}
                                    </Stack>
                                    {reportDownloadUrl && (
                                        <Box mt={1.5}>
                                            <a href={reportDownloadUrl} download>
                                                <Button variant="outlined"
                                                    startIcon={<FileDownloadIcon sx={{ fontSize: 20, color: "green" }} />}
                                                    sx={{ textTransform: "none", fontWeight: 700 }}>
                                                    Download KPI Monitoring Report
                                                </Button>
                                            </a>
                                        </Box>
                                    )}
                                </Box>

                                {/* ── FILTER KPI REPORT ── */}
                                <Box className={classes.Front_Box}>
                                    <Box display="flex" alignItems="center" gap={0.8} mb={1.2}>
                                        <FilterAltIcon sx={{ fontSize: 18, color: TEAL }} />
                                        <Typography className="Front_Box_Hading" fontWeight={700} fontSize={16}>
                                            Filter KPI Report
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={2} alignItems="center" mb={2}>
                                        <Grid item xs={12} sm={5} md={4}>
                                            <TextField
                                                label="Site ID / Short Name"
                                                placeholder="e.g. SITE1234 or MUM-North"
                                                value={siteQuery}
                                                onChange={(e) => setSiteQuery(e.target.value)}
                                                size="small" fullWidth sx={fieldSx}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>,
                                                    endAdornment: siteQuery && (
                                                        <InputAdornment position="end">
                                                            <IconButton size="small" onClick={() => setSiteQuery("")}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5} md={4}>
                                            <TextField
                                                label="Circle"
                                                placeholder="e.g. MAH, DEL, ROTN"
                                                value={circleQuery}
                                                onChange={(e) => setCircleQuery(e.target.value)}
                                                size="small" fullWidth sx={fieldSx}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "#9aa3af" }} /></InputAdornment>,
                                                    endAdornment: circleQuery && (
                                                        <InputAdornment position="end">
                                                            <IconButton size="small" onClick={() => setCircleQuery("")}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={4}>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleGenerateFilteredReport}
                                                    disabled={filteredReportGenerating || (!siteQuery.trim() && !circleQuery.trim())}
                                                    startIcon={filteredReportGenerating ? <CircularProgress size={14} color="inherit" /> : <AssessmentIcon sx={{ fontSize: 16 }} />}
                                                    sx={{ bgcolor: TEAL, "&:hover": { bgcolor: TEAL_DARK }, textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                                                >
                                                    {filteredReportGenerating ? "Generating…" : "Generate Report"}
                                                </Button>
                                                <Tooltip title="Reset filters" arrow>
                                                    <span>
                                                        <Button
                                                            onClick={handleResetFilters}
                                                            disabled={!siteQuery && !circleQuery}
                                                            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                                                            sx={{ textTransform: "none", color: "text.secondary", border: "1px solid #e0e0e0", borderRadius: "8px", fontWeight: 600, "&:hover": { bgcolor: "#f5f5f5" } }}
                                                        >
                                                            Reset
                                                        </Button>
                                                    </span>
                                                </Tooltip>
                                            </Stack>
                                        </Grid>
                                    </Grid>

                                    {(filteredReportMessage || filteredReportDownloadUrl) && (
                                        <Box mb={2}>
                                            {filteredReportMessage && (
                                                <Typography fontSize={12.5} color="gray" mb={filteredReportDownloadUrl ? 1 : 0}>
                                                    {filteredReportMessage}
                                                </Typography>
                                            )}
                                            {filteredReportDownloadUrl && (
                                                <a href={filteredReportDownloadUrl} download>
                                                    <Button variant="outlined"
                                                        startIcon={<FileDownloadIcon sx={{ fontSize: 20, color: "green" }} />}
                                                        sx={{ textTransform: "none", fontWeight: 700 }}>
                                                        Download Filtered KPI Report
                                                    </Button>
                                                </a>
                                            )}
                                        </Box>
                                    )}

                                    <KpiResultsTable rows={filteredRows} loading={filterLoading} hasSearched={hasSearched} />
                                </Box>

                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default Performancekpi5g;