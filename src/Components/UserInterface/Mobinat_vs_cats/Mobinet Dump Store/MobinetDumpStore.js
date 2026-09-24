

// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
//     Button,
//     Stack,
//     Card,
//     CardContent,
//     Grid,
//     Typography,
//     Alert,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Breadcrumbs,
//     Link,
//     TextField,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Pagination,
//     Chip,
//     Divider,
//     CircularProgress,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import Slide from "@mui/material/Slide";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import Swal from "sweetalert2";
// import { postData } from "../../../services/FetchNodeServices";
// import DnsIcon from "@mui/icons-material/Dns";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import InfoIcon from "@mui/icons-material/Info";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import ErrorIcon from "@mui/icons-material/Error";
// import InboxIcon from "@mui/icons-material/Inbox";

// const COLORS = {
//     primary: "#006e74",
//     primaryDark: "#00494d",
//     success: "#28a745",
//     warning: "#ffc107",
//     error: "#dc3545",
//     info: "#17a2b8",
//     lightBg: "#f8f9fa",
//     borderColor: "#c9dcdc",
//     headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
// };

// const CIRCLES = [
//     "AP", "CH", "KK", "DL", "HR", "RJ", "JK", "WB", "OD", "MU",
//     "TNCH", "UE", "BH", "UW", "MP", "PB", "KO", "JH", "UPW"
// ];

// const PAGINATION_LIMIT = 200;

// /* ================================================================ */
// /*  Compact Summary Card Component                                  */
// /* ================================================================ */
// const CompactSummaryCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
//     return (
//         <Card
//             sx={{
//                 background: "#fff",
//                 border: `1px solid ${COLORS.borderColor}`,
//                 borderRadius: 1.5,
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                     boxShadow: "0 4px 12px rgba(0,107,106,0.1)",
//                     transform: "translateY(-2px)",
//                 },
//                 overflow: "hidden",
//                 height: "100%",
//             }}
//         >
//             <Box sx={{ height: 2, background: COLORS.headerGradient }} />
//             <CardContent sx={{ p: 1.5, textAlign: "center" }}>
//                 <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
//                     {Icon && (
//                         <Box
//                             sx={{
//                                 width: 36,
//                                 height: 36,
//                                 borderRadius: "8px",
//                                 background: `${color}15`,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             <Icon sx={{ color: color, fontSize: 18 }} />
//                         </Box>
//                     )}
//                 </Box>
//                 <Typography
//                     variant="caption"
//                     sx={{
//                         fontSize: "10px",
//                         color: "#666",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                         letterSpacing: 0.3,
//                         display: "block",
//                         mb: 0.5,
//                     }}
//                 >
//                     {title}
//                 </Typography>
//                 <Typography
//                     sx={{
//                         fontSize: "20px",
//                         fontWeight: 800,
//                         color: color,
//                         fontVariantNumeric: "tabular-nums",
//                     }}
//                 >
//                     {typeof value === "number" ? value.toLocaleString() : value}
//                 </Typography>
//             </CardContent>
//         </Card>
//     );
// };

// /* ================================================================ */
// /*  Upload Result Display Component                                 */
// /* ================================================================ */
// const MobinateDumpResult = ({ data }) => {
//     if (!data) return null;

//     const {
//         success,
//         total_files = 0,
//         total_rows_read = 0,
//         total_created = 0,
//         total_invalid = 0,
//         total_updated = 0,
//         total_duplicate_in_file = 0,
//     } = data;

//     const successRate = total_rows_read > 0 ? ((total_created + total_updated) / total_rows_read) * 100 : 0;
//     const errorRate = total_rows_read > 0 ? (total_invalid / total_rows_read) * 100 : 0;
//     const duplicateRate = total_rows_read > 0 ? (total_duplicate_in_file / total_rows_read) * 100 : 0;

//     return (
//         <Box
//             sx={{
//                 mt: 2,
//                 p: 2,
//                 background: COLORS.lightBg,
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.borderColor}`,
//             }}
//         >
//             {success && (
//                 <Alert
//                     icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
//                     severity="success"
//                     sx={{
//                         background: `${COLORS.success}15`,
//                         border: `1px solid ${COLORS.success}`,
//                         color: COLORS.success,
//                         fontWeight: 600,
//                         fontSize: "12px",
//                         mb: 2,
//                         py: 1,
//                         px: 1.5,
//                     }}
//                 >
//                     ✓ Files processed successfully
//                 </Alert>
//             )}

//             <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Total Rows" value={total_rows_read} icon={InfoIcon} color={COLORS.primary} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Created" value={total_created} icon={CheckCircleIcon} color={COLORS.success} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Updated" value={total_updated} icon={TrendingUpIcon} color={COLORS.primary} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Invalid" value={total_invalid} icon={ErrorIcon} color={COLORS.error} />
//                 </Grid>
//             </Grid>

//             <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Duplicates" value={total_duplicate_in_file} icon={WarningIcon} color={COLORS.warning} />
//                 </Grid>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Files" value={total_files} icon={InfoIcon} color={COLORS.info} />
//                 </Grid>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={CheckCircleIcon} color={COLORS.success} />
//                 </Grid>
//             </Grid>

//             {(total_invalid > 0 || total_duplicate_in_file > 0) && (
//                 <Box sx={{ mb: 2 }}>
//                     {total_invalid > 0 && (
//                         <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.error}15`, border: `1px solid ${COLORS.error}`, color: COLORS.error, mb: 1, py: 0.8 }}>
//                             ⚠ {total_invalid.toLocaleString()} invalid records found ({errorRate.toFixed(1)}%)
//                         </Alert>
//                     )}
//                     {total_duplicate_in_file > 0 && (
//                         <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.warning}15`, border: `1px solid ${COLORS.warning}`, color: "#000", py: 0.8 }}>
//                             ⚠ {total_duplicate_in_file.toLocaleString()} duplicate records found ({duplicateRate.toFixed(1)}%)
//                         </Alert>
//                     )}
//                 </Box>
//             )}

//             <Paper sx={{ mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}`, overflow: "hidden" }}>
//                 <Box sx={{ background: COLORS.headerGradient, p: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
//                     <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
//                     <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: 0.3 }}>
//                         Processing Summary
//                     </Typography>
//                 </Box>
//                 <TableContainer sx={{ maxHeight: "250px" }}>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ background: COLORS.primary }}>
//                                 <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Metric</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Count</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Percentage</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Total Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_rows_read.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>100%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Created</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.success, py: 0.6 }}>{total_created.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_created / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Updated</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_updated.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_updated / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Invalid</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.error, py: 0.6 }}>{total_invalid.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_invalid / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Duplicates</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.warning, py: 0.6 }}>{total_duplicate_in_file.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_duplicate_in_file / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// };

// /* ================================================================ */
// /*  Search Results Table Component                                  */
// /* ================================================================ */
// function ResultsTable({ rows, loading }) {
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     if (loading) {
//         return (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//                 <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//             </Box>
//         );
//     }

//     if (!hasData) {
//         return (
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 4, color: "#94a3b8" }}>
//                 <InboxIcon sx={{ fontSize: 30 }} />
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     No results found. Try adjusting your search filters.
//                 </Typography>
//             </Box>
//         );
//     }

//     const columns = rows.length > 0 ? Object.keys(rows[0]).filter(key => key !== "id") : [];

//     return (
//         <TableContainer sx={{ maxHeight: 400, overflowX: "auto" }}>
//             <Table size="small" stickyHeader sx={{ borderCollapse: "collapse", "& .MuiTableCell-root": { border: `1px solid ${COLORS.borderColor}`, py: 0.6, fontSize: "11px", px: 1 } }}>
//                 <TableHead>
//                     <TableRow>
//                         {columns.map((col) => (
//                             <TableCell
//                                 key={col}
//                                 sx={{
//                                     position: "sticky",
//                                     top: 0,
//                                     zIndex: 4,
//                                     bgcolor: COLORS.primary,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     whiteSpace: "nowrap",
//                                     minWidth: 100,
//                                 }}
//                             >
//                                 {col.replace(/_/g, " ").toUpperCase()}
//                             </TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {rows.map((row, i) => (
//                         <TableRow key={row.unique_id ?? i}>
//                             {columns.map((col) => (
//                                 <TableCell
//                                     key={`${row.unique_id}-${col}`}
//                                     sx={{ bgcolor: "#ffffff", color: COLORS.primaryDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}
//                                     title={String(row[col] ?? "—")}
//                                 >
//                                     {String(row[col] ?? "—")}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }

// /* ================================================================ */
// /*  Export to CSV Function                                          */
// /* ================================================================ */
// function exportToExcel(data, filename = "mobinet_data.csv") {
//     if (!data || data.length === 0) {
//         Swal.fire({
//             icon: "warning",
//             title: "No Data",
//             text: "No data available to export",
//         });
//         return;
//     }

//     const columns = Object.keys(data[0]);
//     const csvContent = [
//         columns.join(","),
//         ...data.map(row =>
//             columns.map(col => {
//                 const value = row[col];
//                 return `"${String(value ?? "").replace(/"/g, '""')}"`;
//             }).join(",")
//         )
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", filename);
//     link.style.visibility = "hidden";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     Swal.fire({
//         icon: "success",
//         title: "Done",
//         text: `Data exported successfully (${data.length} records)`,
//     });
// }

// /* ================================================================ */
// /*  Main Merged Component                                           */
// /* ================================================================ */
// const MobinetDB = () => {
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();
//     const classes = OverAllCss();

//     // FILE UPLOAD STATE
//     const [circleFiles, setCircleFiles] = useState([]);
//     const [showCircleError, setShowCircleError] = useState(false);
//     const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [uploadResultData, setUploadResultData] = useState(null);

//     // SEARCH STATE
//     const [circle, setCircle] = useState("");
//     const [siteId, setSiteId] = useState("");
//     const [serialNumber, setSerialNumber] = useState("");
//     const [boardModel, setBoardModel] = useState("");
//     const [results, setResults] = useState([]);
//     const [totalCount, setTotalCount] = useState(0);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [searchError, setSearchError] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [hasSearched, setHasSearched] = useState(false);

//     const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

//     // ======== FILE UPLOAD HANDLERS ========
//     const handleCircleFileSelection = (event) => {
//         setCircleFiles(event.target.files);
//         setShowCircleError(false);
//     };

//     const handleUploadSubmit = async () => {
//         if (circleFiles.length === 0) {
//             setShowCircleError(true);
//             return;
//         }

//         try {
//             action(true);
//             const formData = new FormData();

//             for (let i = 0; i < circleFiles.length; i++) {
//                 formData.append("files", circleFiles[i]);
//             }

//             const response = await postData("mobinate_vs_cats/mobinet_data_stor/", formData);

//             if (response && response.success === true) {
//                 setUploadSuccess(true);
//                 setUploadResultData(response);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: "Files processed successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "An error occurred",
//                 });
//             }
//         } catch (error) {
//             console.error("Submit error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Failed to submit files",
//             });
//         } finally {
//             action(false);
//         }
//     };

//     const handleUploadCancel = () => {
//         setCircleFiles([]);
//         setShowCircleError(false);
//         setUploadSuccess(false);
//         setUploadResultData(null);
//     };

//     // ======== SEARCH HANDLERS ========
//     const fetchResults = useCallback(async (pageNum = 1) => {
//         if (!circle) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required",
//                 text: "Please select a Circle",
//             });
//             return;
//         }

//         setSearchLoading(true);
//         setSearchError(false);

//         try {
//             const formData = new FormData();
//             formData.append("circle", circle);
//             formData.append("limit", PAGINATION_LIMIT.toString());
//             formData.append("offset", ((pageNum - 1) * PAGINATION_LIMIT).toString());

//             if (siteId && siteId.trim()) {
//                 formData.append("site_id", siteId.trim());
//             }
//             if (serialNumber && serialNumber.trim()) {
//                 formData.append("serial_number", serialNumber.trim());
//             }
//             if (boardModel && boardModel.trim()) {
//                 formData.append("board_model", boardModel.trim());
//             }

//             const response = await postData("mobinate_vs_cats/mobinet_db_search/", formData);

//             if (response && response.success) {
//                 const resultsArray = response.results || [];

//                 if (resultsArray.length > 0) {
//                     setResults(resultsArray);
//                     setTotalCount(response.count || resultsArray.length);
//                     setCurrentPage(pageNum);
//                     setHasSearched(true);
//                     setSearchError(false);
//                 } else {
//                     setResults([]);
//                     setTotalCount(0);
//                     setSearchError(true);
//                     Swal.fire({
//                         icon: "info",
//                         title: "No Results",
//                         text: "No data found for the selected circle and filters",
//                     });
//                 }
//             } else {
//                 setResults([]);
//                 setTotalCount(0);
//                 setSearchError(true);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to fetch data",
//                 });
//             }
//         } catch (e) {
//             console.error("Search error:", e);
//             setSearchError(true);
//             setResults([]);
//             setTotalCount(0);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: "Error fetching results. Please try again.",
//             });
//         } finally {
//             setSearchLoading(false);
//         }
//     }, [circle, siteId, serialNumber, boardModel]);

//     const handleSearch = () => {
//         setCurrentPage(1);
//         fetchResults(1);
//     };

//     const handleReset = () => {
//         setCircle("");
//         setSiteId("");
//         setSerialNumber("");
//         setBoardModel("");
//         setResults([]);
//         setTotalCount(0);
//         setCurrentPage(1);
//         setHasSearched(false);
//     };

//     const handleDownload = () => {
//         if (results.length === 0) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "No Data",
//                 text: "No results to download. Please search first.",
//             });
//             return;
//         }

//         const filename = `Mobinet_${circle}_${new Date().toISOString().split('T')[0]}.csv`;
//         exportToExcel(results, filename);
//     };

//     const handlePageChange = (event, pageNum) => {
//         fetchResults(pageNum);
//     };

//     useEffect(() => {
//         document.title = "Mobinet DB";
//     }, []);

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
//                         Material Management
//                     </Link>
//                     <Typography color="text.primary">Mobinet DB</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in={true} timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Mobinet DB</Box>

//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
//                                 {/* ====== FILE UPLOAD SECTION ====== */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select Mobinet Circle Files:-
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>
//                                             <Button
//                                                 variant="contained"
//                                                 component="label"
//                                                 color={circleFiles.length > 0 ? "warning" : "primary"}
//                                             >
//                                                 Select File
//                                                 <input
//                                                     required
//                                                     hidden
//                                                     accept=".csv,.xlsx,.xls,.xlsb"
//                                                     multiple
//                                                     type="file"
//                                                     onChange={handleCircleFileSelection}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         {circleFiles.length > 0 && (
//                                             <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
//                                                 Selected File(s): {circleFiles.length}
//                                             </span>
//                                         )}

//                                         {showCircleError && (
//                                             <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
//                                                 This Field Is Required!
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* UPLOAD ACTION BUTTONS */}
//                                 <Stack
//                                     direction={{ xs: "column", sm: "column", md: "row" }}
//                                     spacing={2}
//                                     style={{ display: "flex", justifyContent: "space-around" }}
//                                 >
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         onClick={handleUploadSubmit}
//                                         endIcon={<UploadIcon />}
//                                         disabled={circleFiles.length === 0}
//                                     >
//                                         Submit
//                                     </Button>

//                                     <Button
//                                         variant="contained"
//                                         onClick={handleUploadCancel}
//                                         style={{ backgroundColor: "red", color: "white" }}
//                                         endIcon={<DoDisturbIcon />}
//                                     >
//                                         Cancel
//                                     </Button>
//                                 </Stack>

//                                 {/* UPLOAD RESULT DISPLAY */}
//                                 {uploadSuccess && <MobinateDumpResult data={uploadResultData} />}

//                                 {/* DIVIDER */}
//                                 <Divider sx={{ my: 2 }} />

//                                 {/* ====== SEARCH SECTION ====== */}
//                                 <Box
//                                     sx={{
//                                         bgcolor: "#ffffff",
//                                         p: 2.5,
//                                         borderRadius: 1,
//                                         border: "1px solid #e0e0e0",
//                                     }}
//                                 >
//                                     <Typography
//                                         variant="h6"
//                                         sx={{
//                                             fontWeight: 700,
//                                             color: COLORS.primary,
//                                             mb: 2,
//                                             fontSize: "16px",
//                                             letterSpacing: 0.3,
//                                         }}
//                                     >
//                                         Search Mobinet Database
//                                     </Typography>

//                                     <Stack spacing={2}>
//                                         {/* Circle Filter */}
//                                         <Box sx={{ maxWidth: 250 }}>
//                                             <FormControl fullWidth size="small">
//                                                 <InputLabel id="circle-label">Circle *</InputLabel>
//                                                 <Select
//                                                     labelId="circle-label"
//                                                     label="Circle *"
//                                                     value={circle}
//                                                     onChange={(e) => setCircle(e.target.value)}
//                                                 >
//                                                     <MenuItem value="">
//                                                         <em>Select Circle</em>
//                                                     </MenuItem>
//                                                     {CIRCLES.map((c) => (
//                                                         <MenuItem key={c} value={c}>
//                                                             {c}
//                                                         </MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Box>

//                                         {/* Optional Filters */}
//                                         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//                                             <TextField
//                                                 size="small"
//                                                 label="Site ID (Optional)"
//                                                 placeholder="e.g., COW162"
//                                                 value={siteId}
//                                                 onChange={(e) => setSiteId(e.target.value)}
//                                                 sx={{ flex: 1, minWidth: 150 }}
//                                             />
//                                             <TextField
//                                                 size="small"
//                                                 label="Serial Number (Optional)"
//                                                 placeholder="e.g., CN32371077"
//                                                 value={serialNumber}
//                                                 onChange={(e) => setSerialNumber(e.target.value)}
//                                                 sx={{ flex: 1, minWidth: 150 }}
//                                             />
//                                             <TextField
//                                                 size="small"
//                                                 label="Board Model (Optional)"
//                                                 placeholder="e.g., Radio 2219 B0A"
//                                                 value={boardModel}
//                                                 onChange={(e) => setBoardModel(e.target.value)}
//                                                 sx={{ flex: 1, minWidth: 150 }}
//                                             />
//                                         </Stack>
//                                     </Stack>

//                                     {/* Search Action Buttons */}
//                                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
//                                         <Button
//                                             variant="contained"
//                                             startIcon={<SearchIcon />}
//                                             onClick={handleSearch}
//                                             disabled={searchLoading || !circle}
//                                             sx={{
//                                                 background: COLORS.headerGradient,
//                                                 color: "#fff",
//                                                 fontWeight: 700,
//                                                 textTransform: "none",
//                                                 "&:hover": {
//                                                     background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
//                                                 },
//                                             }}
//                                         >
//                                             {searchLoading ? "Searching..." : "Search"}
//                                         </Button>
//                                         <Button
//                                             variant="outlined"
//                                             startIcon={<ClearIcon />}
//                                             onClick={handleReset}
//                                             disabled={searchLoading}
//                                             sx={{
//                                                 borderColor: COLORS.primary,
//                                                 color: COLORS.primary,
//                                                 fontWeight: 700,
//                                                 textTransform: "none",
//                                             }}
//                                         >
//                                             Reset
//                                         </Button>
//                                     </Stack>

//                                     {/* Active Filters Display */}
//                                     {hasSearched && (
//                                         <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
//                                             <Chip label={`Circle: ${circle}`} size="small" variant="outlined" />
//                                             {siteId && <Chip label={`Site: ${siteId}`} size="small" variant="outlined" />}
//                                             {serialNumber && <Chip label={`Serial: ${serialNumber}`} size="small" variant="outlined" />}
//                                             {boardModel && <Chip label={`Board: ${boardModel}`} size="small" variant="outlined" />}
//                                         </Stack>
//                                     )}

//                                     {/* Results Section */}
//                                     {hasSearched && (
//                                         <Box sx={{ mt: 3 }}>
//                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                                 <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>
//                                                     Results ({results.length} records)
//                                                 </Typography>
//                                                 {results.length > 0 && (
//                                                     <Button
//                                                         variant="contained"
//                                                         size="small"
//                                                         startIcon={<FileDownloadIcon />}
//                                                         onClick={handleDownload}
//                                                         sx={{
//                                                             background: COLORS.headerGradient,
//                                                             color: "#fff",
//                                                             fontWeight: 700,
//                                                             textTransform: "none",
//                                                         }}
//                                                     >
//                                                         Download
//                                                     </Button>
//                                                 )}
//                                             </Box>

//                                             <ResultsTable rows={results} loading={searchLoading} />

//                                             {/* Pagination */}
//                                             {totalPages > 1 && !searchLoading && (
//                                                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                                                     <Pagination
//                                                         count={totalPages}
//                                                         page={currentPage}
//                                                         onChange={handlePageChange}
//                                                         color="primary"
//                                                         size="small"
//                                                     />
//                                                 </Box>
//                                             )}

//                                             {/* Results Summary */}
//                                             {!searchLoading && results.length > 0 && (
//                                                 <Box sx={{ mt: 2, p: 1.5, bgcolor: "rgba(0,110,116,0.05)", borderRadius: 1 }}>
//                                                     <Typography variant="caption" sx={{ color: COLORS.primaryDark, fontSize: "12px" }}>
//                                                         Showing {(currentPage - 1) * PAGINATION_LIMIT + 1} to{" "}
//                                                         {Math.min(currentPage * PAGINATION_LIMIT, totalCount)} of {totalCount} total results
//                                                     </Typography>
//                                                 </Box>
//                                             )}
//                                         </Box>
//                                     )}

//                                     {searchError && !searchLoading && hasSearched && (
//                                         <Box sx={{ mt: 2, p: 2, bgcolor: "#fdecea", borderRadius: 1, border: "1px solid #ffcccc" }}>
//                                             <Typography variant="body2" sx={{ color: "#c62828" }}>
//                                                 Error fetching results. Please try again.
//                                             </Typography>
//                                         </Box>
//                                     )}
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

// export default MobinetDB;


// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box,
//     Button,
//     Stack,
//     Card,
//     CardContent,
//     Grid,
//     Typography,
//     Alert,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Breadcrumbs,
//     Link,
//     TextField,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Pagination,
//     Chip,
//     Divider,
//     CircularProgress,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import Slide from "@mui/material/Slide";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import SearchIcon from "@mui/icons-material/Search";
// import ClearIcon from "@mui/icons-material/Clear";
// import Swal from "sweetalert2";
// import { postData } from "../../../services/FetchNodeServices";
// import DnsIcon from "@mui/icons-material/Dns";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import WarningIcon from "@mui/icons-material/Warning";
// import InfoIcon from "@mui/icons-material/Info";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import ErrorIcon from "@mui/icons-material/Error";
// import InboxIcon from "@mui/icons-material/Inbox";

// const COLORS = {
//     primary: "#006e74",
//     primaryDark: "#00494d",
//     success: "#28a745",
//     warning: "#ffc107",
//     error: "#dc3545",
//     info: "#17a2b8",
//     lightBg: "#f8f9fa",
//     borderColor: "#c9dcdc",
//     headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
// };

// const CIRCLES = [
//     "AP", "CH", "KK", "DL", "HR", "RJ", "JK", "WB", "OD", "MU",
//     "TNCH", "UE", "BH", "UW", "MP", "PB", "KO", "JH", "UPW"
// ];

// const PAGINATION_LIMIT = 200;

// /* ================================================================ */
// /*  Compact Summary Card Component                                  */
// /* ================================================================ */
// const CompactSummaryCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
//     return (
//         <Card
//             sx={{
//                 background: "#fff",
//                 border: `1px solid ${COLORS.borderColor}`,
//                 borderRadius: 1.5,
//                 boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                     boxShadow: "0 4px 12px rgba(0,107,106,0.1)",
//                     transform: "translateY(-2px)",
//                 },
//                 overflow: "hidden",
//                 height: "100%",
//             }}
//         >
//             <Box sx={{ height: 2, background: COLORS.headerGradient }} />
//             <CardContent sx={{ p: 1.5, textAlign: "center" }}>
//                 <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
//                     {Icon && (
//                         <Box
//                             sx={{
//                                 width: 36,
//                                 height: 36,
//                                 borderRadius: "8px",
//                                 background: `${color}15`,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             <Icon sx={{ color: color, fontSize: 18 }} />
//                         </Box>
//                     )}
//                 </Box>
//                 <Typography
//                     variant="caption"
//                     sx={{
//                         fontSize: "10px",
//                         color: "#666",
//                         fontWeight: 600,
//                         textTransform: "uppercase",
//                         letterSpacing: 0.3,
//                         display: "block",
//                         mb: 0.5,
//                     }}
//                 >
//                     {title}
//                 </Typography>
//                 <Typography
//                     sx={{
//                         fontSize: "20px",
//                         fontWeight: 800,
//                         color: color,
//                         fontVariantNumeric: "tabular-nums",
//                     }}
//                 >
//                     {typeof value === "number" ? value.toLocaleString() : value}
//                 </Typography>
//             </CardContent>
//         </Card>
//     );
// };

// /* ================================================================ */
// /*  Upload Result Display Component                                 */
// /* ================================================================ */
// const MobinateDumpResult = ({ data }) => {
//     if (!data) return null;

//     const {
//         success,
//         total_files = 0,
//         total_rows_read = 0,
//         total_created = 0,
//         total_invalid = 0,
//         total_updated = 0,
//         total_duplicate_in_file = 0,
//     } = data;

//     const successRate = total_rows_read > 0 ? ((total_created + total_updated) / total_rows_read) * 100 : 0;
//     const errorRate = total_rows_read > 0 ? (total_invalid / total_rows_read) * 100 : 0;
//     const duplicateRate = total_rows_read > 0 ? (total_duplicate_in_file / total_rows_read) * 100 : 0;

//     return (
//         <Box
//             sx={{
//                 mt: 2,
//                 p: 2,
//                 background: COLORS.lightBg,
//                 borderRadius: 1.5,
//                 border: `1px solid ${COLORS.borderColor}`,
//             }}
//         >
//             {success && (
//                 <Alert
//                     icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
//                     severity="success"
//                     sx={{
//                         background: `${COLORS.success}15`,
//                         border: `1px solid ${COLORS.success}`,
//                         color: COLORS.success,
//                         fontWeight: 600,
//                         fontSize: "12px",
//                         mb: 2,
//                         py: 1,
//                         px: 1.5,
//                     }}
//                 >
//                     ✓ Files processed successfully
//                 </Alert>
//             )}

//             <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Total Rows" value={total_rows_read} icon={InfoIcon} color={COLORS.primary} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Created" value={total_created} icon={CheckCircleIcon} color={COLORS.success} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Updated" value={total_updated} icon={TrendingUpIcon} color={COLORS.primary} />
//                 </Grid>
//                 <Grid item xs={6} sm={3}>
//                     <CompactSummaryCard title="Invalid" value={total_invalid} icon={ErrorIcon} color={COLORS.error} />
//                 </Grid>
//             </Grid>

//             <Grid container spacing={1.5} sx={{ mb: 2 }}>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Duplicates" value={total_duplicate_in_file} icon={WarningIcon} color={COLORS.warning} />
//                 </Grid>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Files" value={total_files} icon={InfoIcon} color={COLORS.info} />
//                 </Grid>
//                 <Grid item xs={6} sm={4}>
//                     <CompactSummaryCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={CheckCircleIcon} color={COLORS.success} />
//                 </Grid>
//             </Grid>

//             {(total_invalid > 0 || total_duplicate_in_file > 0) && (
//                 <Box sx={{ mb: 2 }}>
//                     {total_invalid > 0 && (
//                         <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.error}15`, border: `1px solid ${COLORS.error}`, color: COLORS.error, mb: 1, py: 0.8 }}>
//                             ⚠ {total_invalid.toLocaleString()} invalid records found ({errorRate.toFixed(1)}%)
//                         </Alert>
//                     )}
//                     {total_duplicate_in_file > 0 && (
//                         <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.warning}15`, border: `1px solid ${COLORS.warning}`, color: "#000", py: 0.8 }}>
//                             ⚠ {total_duplicate_in_file.toLocaleString()} duplicate records found ({duplicateRate.toFixed(1)}%)
//                         </Alert>
//                     )}
//                 </Box>
//             )}

//             <Paper sx={{ mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}`, overflow: "hidden" }}>
//                 <Box sx={{ background: COLORS.headerGradient, p: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
//                     <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
//                     <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: 0.3 }}>
//                         Processing Summary
//                     </Typography>
//                 </Box>
//                 <TableContainer sx={{ maxHeight: "250px" }}>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow sx={{ background: COLORS.primary }}>
//                                 <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Metric</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Count</TableCell>
//                                 <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Percentage</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Total Rows</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_rows_read.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>100%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Created</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.success, py: 0.6 }}>{total_created.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_created / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Updated</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_updated.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_updated / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Invalid</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.error, py: 0.6 }}>{total_invalid.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_invalid / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                             <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
//                                 <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Duplicates</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.warning, py: 0.6 }}>{total_duplicate_in_file.toLocaleString()}</TableCell>
//                                 <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_duplicate_in_file / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>
//         </Box>
//     );
// };

// /* ================================================================ */
// /*  Search Results Table Component                                  */
// /* ================================================================ */
// function ResultsTable({ rows, loading }) {
//     const hasData = Array.isArray(rows) && rows.length > 0;

//     if (loading) {
//         return (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//                 <CircularProgress size={32} sx={{ color: COLORS.primary }} />
//             </Box>
//         );
//     }

//     if (!hasData) {
//         return (
//             <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 4, color: "#94a3b8" }}>
//                 <InboxIcon sx={{ fontSize: 30 }} />
//                 <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                     No results found. Try adjusting your search filters.
//                 </Typography>
//             </Box>
//         );
//     }

//     const columns = rows.length > 0 ? Object.keys(rows[0]).filter(key => key !== "id") : [];

//     return (
//         <TableContainer sx={{ maxHeight: 400, overflowX: "auto" }}>
//             <Table size="small" stickyHeader sx={{ borderCollapse: "collapse", "& .MuiTableCell-root": { border: `1px solid ${COLORS.borderColor}`, py: 0.6, fontSize: "11px", px: 1 } }}>
//                 <TableHead>
//                     <TableRow>
//                         {columns.map((col) => (
//                             <TableCell
//                                 key={col}
//                                 sx={{
//                                     position: "sticky",
//                                     top: 0,
//                                     zIndex: 4,
//                                     bgcolor: COLORS.primary,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     whiteSpace: "nowrap",
//                                     minWidth: 100,
//                                 }}
//                             >
//                                 {col.replace(/_/g, " ").toUpperCase()}
//                             </TableCell>
//                         ))}
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {rows.map((row, i) => (
//                         <TableRow key={row.unique_id ?? i}>
//                             {columns.map((col) => (
//                                 <TableCell
//                                     key={`${row.unique_id}-${col}`}
//                                     sx={{ bgcolor: "#ffffff", color: COLORS.primaryDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}
//                                     title={String(row[col] ?? "—")}
//                                 >
//                                     {String(row[col] ?? "—")}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// }

// /* ================================================================ */
// /*  Export to CSV Function                                          */
// /* ================================================================ */
// function exportToExcel(data, filename = "mobinet_data.csv") {
//     if (!data || data.length === 0) {
//         Swal.fire({
//             icon: "warning",
//             title: "No Data",
//             text: "No data available to export",
//         });
//         return;
//     }

//     const columns = Object.keys(data[0]);
//     const csvContent = [
//         columns.join(","),
//         ...data.map(row =>
//             columns.map(col => {
//                 const value = row[col];
//                 return `"${String(value ?? "").replace(/"/g, '""')}"`;
//             }).join(",")
//         )
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute("download", filename);
//     link.style.visibility = "hidden";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     Swal.fire({
//         icon: "success",
//         title: "Done",
//         text: `Data exported successfully (${data.length} records)`,
//     });
// }

// /* ================================================================ */
// /*  Helper function to parse multiple values                        */
// /* ================================================================ */
// const parseMultipleValues = (input) => {
//     if (!input || !input.trim()) return [];
//     return input
//         .split(/[,;]/)
//         .map(val => val.trim())
//         .filter(val => val.length > 0);
// };

// /* ================================================================ */
// /*  Main Merged Component                                           */
// /* ================================================================ */
// const MobinetDB = () => {
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();
//     const classes = OverAllCss();

//     // FILE UPLOAD STATE
//     const [circleFiles, setCircleFiles] = useState([]);
//     const [showCircleError, setShowCircleError] = useState(false);
//     const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [uploadResultData, setUploadResultData] = useState(null);

//     // SEARCH STATE
//     const [circle, setCircle] = useState("");
//     const [siteIdInput, setSiteIdInput] = useState("");
//     const [serialNumberInput, setSerialNumberInput] = useState("");
//     const [results, setResults] = useState([]);
//     const [totalCount, setTotalCount] = useState(0);
//     const [searchLoading, setSearchLoading] = useState(false);
//     const [searchError, setSearchError] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [hasSearched, setHasSearched] = useState(false);
//     const [downloadLoading, setDownloadLoading] = useState(false);

//     const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

//     // Parse values
//     //  for display
//     const siteIds = parseMultipleValues(siteIdInput);
//     const serialNumbers = parseMultipleValues(serialNumberInput);

//     // ======== FILE UPLOAD HANDLERS ========
//     const handleCircleFileSelection = (event) => {
//         setCircleFiles(event.target.files);
//         setShowCircleError(false);
//     };

//     const handleUploadSubmit = async () => {
//         if (circleFiles.length === 0) {
//             setShowCircleError(true);
//             return;
//         }

//         try {
//             action(true);
//             const formData = new FormData();

//             for (let i = 0; i < circleFiles.length; i++) {
//                 formData.append("files", circleFiles[i]);
//             }

//             const response = await postData("mobinate_vs_cats/mobinet_data_stor/", formData);

//             if (response && response.success === true) {
//                 setUploadSuccess(true);
//                 setUploadResultData(response);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: "Files processed successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "An error occurred",
//                 });
//             }
//         } catch (error) {
//             console.error("Submit error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Failed to submit files",
//             });
//         } finally {
//             action(false);
//         }
//     };

//     const handleUploadCancel = () => {
//         setCircleFiles([]);
//         setShowCircleError(false);
//         setUploadSuccess(false);
//         setUploadResultData(null);
//     };

//     // ======== SEARCH HANDLERS ========
//     const fetchResults = useCallback(async (pageNum = 1) => {
//         // Check if at least one filter is provided
//         const hasFilters = circle.trim() || siteIds.length > 0 || serialNumbers.length > 0;

//         if (!hasFilters) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required",
//                 text: "Please provide at least one search filter (Circle, Site ID, or Serial Number)",
//             });
//             return;
//         }

//         setSearchLoading(true);
//         setSearchError(false);

//         try {
//             const formData = new FormData();

//             // ALWAYS send circle (even if empty) - backend requirement
//             formData.append("circle", circle || "");

//             formData.append("limit", PAGINATION_LIMIT.toString());
//             formData.append("offset", ((pageNum - 1) * PAGINATION_LIMIT).toString());

//             // Send site IDs as comma-separated string if available
//             if (siteIds.length > 0) {
//                 formData.append("site_id", siteIds.join(","));
//             }

//             // Send serial numbers as comma-separated string if available
//             if (serialNumbers.length > 0) {
//                 formData.append("serial_number", serialNumbers.join(","));
//             }

//             console.log("Search Request:", {
//                 circle: circle || "",
//                 site_id: siteIds.length > 0 ? siteIds.join(",") : "not provided",
//                 serial_number: serialNumbers.length > 0 ? serialNumbers.join(",") : "not provided",
//             });

//             const response = await postData("mobinate_vs_cats/mobinet_db_search/", formData);

//             console.log("Search Response:", response);

//             if (response && response.success) {
//                 const resultsArray = response.results || [];

//                 if (resultsArray.length > 0) {
//                     setResults(resultsArray);
//                     setTotalCount(response.count || resultsArray.length);
//                     setCurrentPage(pageNum);
//                     setHasSearched(true);
//                     setSearchError(false);
//                 } else {
//                     setResults([]);
//                     setTotalCount(0);
//                     setSearchError(true);
//                     Swal.fire({
//                         icon: "info",
//                         title: "No Results",
//                         text: "No data found for the selected filters",
//                     });
//                 }
//             } else {
//                 setResults([]);
//                 setTotalCount(0);
//                 setSearchError(true);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to fetch data",
//                 });
//             }
//         } catch (e) {
//             console.error("Search error:", e);
//             setSearchError(true);
//             setResults([]);
//             setTotalCount(0);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: e.message || "Error fetching results. Please try again.",
//             });
//         } finally {
//             setSearchLoading(false);
//         }
//     }, [circle, siteIds, serialNumbers]);

//     // ========= Download Excel ==========
//     const downloadExcel = async () => {
//         // ---------------------------------------------------------
//         // Check if at least one filter is provided
//         // ---------------------------------------------------------

//         const hasFilters =
//             circle.trim() ||
//             siteIds.length > 0 ||
//             serialNumbers.length > 0 ;

//         if (!hasFilters) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required",
//                 text: "Please provide at least one search filter before downloading.",
//             });

//             return;
//         }

//         setDownloadLoading(true);

//         try {
//             const formData = new FormData();

//             // -----------------------------------------------------
//             // Circle - optional
//             // -----------------------------------------------------

//             if (circle.trim()) {
//                 formData.append(
//                     "circle",
//                     circle.trim()
//                 );
//             }

//             // -----------------------------------------------------
//             // Site IDs - multiple values
//             // Example:
//             // AALL11,AALR11,ACPT19
//             // -----------------------------------------------------

//             if (siteIds.length > 0) {
//                 formData.append(
//                     "site_id",
//                     siteIds.join(",")
//                 );
//             }

//             // -----------------------------------------------------
//             // Serial Numbers - multiple values
//             // -----------------------------------------------------

//             if (serialNumbers.length > 0) {
//                 formData.append(
//                     "serial_number",
//                     serialNumbers.join(",")
//                 );
//             }





//             // console.log(
//             //     "Excel Export Request:",
//             //     {
//             //         circle: circle || "",
//             //         site_id:
//             //             siteIds.length > 0
//             //                 ? siteIds.join(",")
//             //                 : "not provided",
//             //         serial_number:
//             //             serialNumbers.length > 0
//             //                 ? serialNumbers.join(",")
//             //                 : "not provided",
//             //     }
//             // );

//             // -----------------------------------------------------
//             // Call export API
//             // -----------------------------------------------------

//             const response = await postData(
//                 "mobinate_vs_cats/mobinet_db_search_export/",
//                 formData
//             );

//             // console.log(
//             //     "Export Response:",
//             //     response
//             // );

//             // -----------------------------------------------------
//             // API success
//             // -----------------------------------------------------

//             if (
//                 response &&
//                 response.success &&
//                 response.download_url
//             ) {
//                 // -------------------------------------------------
//                 // Automatic download
//                 // -------------------------------------------------

//                 const link =
//                     document.createElement("a");

//                 link.href =
//                     response.download_url;

//                 link.download =
//                     response.filename ||
//                     "Mobinet_Data.xlsx";

//                 link.target = "_blank";

//                 document.body.appendChild(link);

//                 link.click();

//                 document.body.removeChild(link);

//                 // -------------------------------------------------
//                 // Success message
//                 // -------------------------------------------------

//                 Swal.fire({
//                     icon: "success",
//                     title: "Export Ready",
//                     text:
//                         `${response.exported_rows || 0} records exported successfully.`,
//                     timer: 2500,
//                     showConfirmButton: false,
//                 });

//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Export Failed",
//                     text:
//                         response?.message ||
//                         "Failed to export Mobinet data.",
//                 });
//             }

//         } catch (error) {
//             console.error(
//                 "Excel export error:",
//                 error
//             );

//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text:
//                     error?.message ||
//                     "Error while exporting data. Please try again.",
//             });

//         } finally {
//             setDownloadLoading(false);
//         }

//     };


//     const handleSearch = () => {
//         setCurrentPage(1);
//         fetchResults(1);
//     };

//     const handleReset = () => {
//         setCircle("");
//         setSiteIdInput("");
//         setSerialNumberInput("");
//         setResults([]);
//         setTotalCount(0);
//         setCurrentPage(1);
//         setHasSearched(false);
//     };

//     const handleDownload = () => {
//         if (results.length === 0) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "No Data",
//                 text: "No results to download. Please search first.",
//             });
//             return;
//         }

//         const filename = `Mobinet_${circle || "all"}_${new Date().toISOString().split('T')[0]}.csv`;
//         exportToExcel(results, filename);
//     };

//     const handlePageChange = (event, pageNum) => {
//         fetchResults(pageNum);
//     };

//     useEffect(() => {
//         document.title = "Mobinet DB";
//     }, []);

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={3}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
//                         Tools
//                     </Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
//                         Material Management
//                     </Link>
//                     <Typography color="text.primary">Mobinet DB</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in={true} timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Mobinet DB</Box>

//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
//                                 {/* ====== FILE UPLOAD SECTION ====== */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select Mobinet Circle Files:-
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>
//                                             <Button
//                                                 variant="contained"
//                                                 component="label"
//                                                 color={circleFiles.length > 0 ? "warning" : "primary"}
//                                             >
//                                                 Select File
//                                                 <input
//                                                     required
//                                                     hidden
//                                                     accept=".csv,.xlsx,.xls,.xlsb"
//                                                     multiple
//                                                     type="file"
//                                                     onChange={handleCircleFileSelection}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         {circleFiles.length > 0 && (
//                                             <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
//                                                 Selected File(s): {circleFiles.length}
//                                             </span>
//                                         )}

//                                         {showCircleError && (
//                                             <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
//                                                 This Field Is Required!
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* UPLOAD ACTION BUTTONS */}
//                                 <Stack
//                                     direction={{ xs: "column", sm: "column", md: "row" }}
//                                     spacing={2}
//                                     style={{ display: "flex", justifyContent: "space-around" }}
//                                 >
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         onClick={handleUploadSubmit}
//                                         endIcon={<UploadIcon />}
//                                         disabled={circleFiles.length === 0}
//                                     >
//                                         Submit
//                                     </Button>

//                                     <Button
//                                         variant="contained"
//                                         onClick={handleUploadCancel}
//                                         style={{ backgroundColor: "red", color: "white" }}
//                                         endIcon={<DoDisturbIcon />}
//                                     >
//                                         Cancel
//                                     </Button>
//                                 </Stack>

//                                 {/* UPLOAD RESULT DISPLAY */}
//                                 {uploadSuccess && <MobinateDumpResult data={uploadResultData} />}

//                                 {/* DIVIDER */}
//                                 <Divider sx={{ my: 2 }} />

//                                 {/* ====== SEARCH SECTION ====== */}
//                                 <Box
//                                     sx={{
//                                         bgcolor: "#ffffff",
//                                         p: 2.5,
//                                         borderRadius: 1,
//                                         border: "1px solid #e0e0e0",
//                                     }}
//                                 >
//                                     <Typography
//                                         variant="h6"
//                                         sx={{
//                                             fontWeight: 700,
//                                             color: COLORS.primary,
//                                             mb: 1,
//                                             fontSize: "16px",
//                                             letterSpacing: 0.3,
//                                         }}
//                                     >
//                                         Search Mobinet Database
//                                     </Typography>
//                                     <Typography
//                                         variant="caption"
//                                         sx={{
//                                             color: "#666",
//                                             fontSize: "12px",
//                                             mb: 2,
//                                             display: "block",
//                                         }}
//                                     >
//                                         Provide at least one search filter below
//                                     </Typography>

//                                     <Stack spacing={2}>
//                                         {/* Circle Filter - Optional */}
//                                         <Box sx={{ maxWidth: 250 }}>
//                                             <FormControl fullWidth size="small">
//                                                 <InputLabel id="circle-label">Circle</InputLabel>
//                                                 <Select
//                                                     labelId="circle-label"
//                                                     label="Circle"
//                                                     value={circle}
//                                                     onChange={(e) => setCircle(e.target.value)}
//                                                 >
//                                                     <MenuItem value="">
//                                                         <em>Select Circle</em>
//                                                     </MenuItem>
//                                                     {CIRCLES.map((c) => (
//                                                         <MenuItem key={c} value={c}>
//                                                             {c}
//                                                         </MenuItem>
//                                                     ))}
//                                                 </Select>
//                                             </FormControl>
//                                         </Box>

//                                         {/* Multiple Site IDs and Serial Numbers */}
//                                         <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
//                                             <TextField
//                                                 size="small"
//                                                 label="Site ID"
//                                                 placeholder="e.g., COW162, COW163, COW164"
//                                                 value={siteIdInput}
//                                                 onChange={(e) => setSiteIdInput(e.target.value)}
//                                                 sx={{ flex: 1, minWidth: 150 }}
//                                                 helperText="Separate multiple values by comma or semicolon"
//                                                 multiline
//                                                 rows={2}
//                                             />
//                                             <TextField
//                                                 size="small"
//                                                 label="Serial Number"
//                                                 placeholder="e.g., CN32371077, CN32371078"
//                                                 value={serialNumberInput}
//                                                 onChange={(e) => setSerialNumberInput(e.target.value)}
//                                                 sx={{ flex: 1, minWidth: 150 }}
//                                                 helperText="Separate multiple values by comma or semicolon"
//                                                 multiline
//                                                 rows={2}
//                                             />
//                                         </Stack>
//                                     </Stack>

//                                     {/* Search Action Buttons */}
//                                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
//                                         <Button
//                                             variant="contained"
//                                             startIcon={<SearchIcon />}
//                                             onClick={handleSearch}
//                                             disabled={searchLoading}
//                                             sx={{
//                                                 background: COLORS.headerGradient,
//                                                 color: "#fff",
//                                                 fontWeight: 700,
//                                                 textTransform: "none",
//                                                 "&:hover": {
//                                                     background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
//                                                 },
//                                             }}
//                                         >
//                                             {searchLoading ? "Searching..." : "Search"}
//                                         </Button>
//                                         <Button
//                                             variant="outlined"
//                                             startIcon={<ClearIcon />}
//                                             onClick={handleReset}
//                                             disabled={searchLoading}
//                                             sx={{
//                                                 borderColor: COLORS.primary,
//                                                 color: COLORS.primary,
//                                                 fontWeight: 700,
//                                                 textTransform: "none",
//                                             }}
//                                         >
//                                             Reset
//                                         </Button>
//                                     </Stack>

//                                     {/* Active Filters Display */}
//                                     {hasSearched && (
//                                         <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
//                                             {circle && <Chip label={`Circle: ${circle}`} size="small" variant="outlined" />}
//                                             {siteIds.map((id, idx) => (
//                                                 <Chip key={`site-${idx}`} label={`Site: ${id}`} size="small" variant="outlined" />
//                                             ))}
//                                             {serialNumbers.map((sn, idx) => (
//                                                 <Chip key={`serial-${idx}`} label={`Serial: ${sn}`} size="small" variant="outlined" />
//                                             ))}
//                                         </Stack>
//                                     )}

//                                     {/* Results Section */}
//                                     {hasSearched && (
//                                         <Box sx={{ mt: 3 }}>
//                                             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                                                 <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>
//                                                     Results ({results.length} records)
//                                                 </Typography>
//                                                 {results.length > 0 && (
//                                                     <Button
//                                                         variant="contained"
//                                                         size="small"
//                                                         startIcon={<FileDownloadIcon />}
//                                                         // onClick={handleDownload}
//                                                         onClick={downloadExcel}//downloadExcel
//                                                         sx={{
//                                                             background: COLORS.headerGradient,
//                                                             color: "#fff",
//                                                             fontWeight: 700,
//                                                             textTransform: "none",
//                                                         }}
//                                                     >
//                                                         Download
//                                                     </Button>
//                                                 )}
//                                             </Box>

//                                             <ResultsTable rows={results} loading={searchLoading} />

//                                             {/* Pagination */}
//                                             {totalPages > 1 && !searchLoading && (
//                                                 <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//                                                     <Pagination
//                                                         count={totalPages}
//                                                         page={currentPage}
//                                                         onChange={handlePageChange}
//                                                         color="primary"
//                                                         size="small"
//                                                     />
//                                                 </Box>
//                                             )}

//                                             {/* Results Summary */}
//                                             {!searchLoading && results.length > 0 && (
//                                                 <Box sx={{ mt: 2, p: 1.5, bgcolor: "rgba(0,110,116,0.05)", borderRadius: 1 }}>
//                                                     <Typography variant="caption" sx={{ color: COLORS.primaryDark, fontSize: "12px" }}>
//                                                         Showing {(currentPage - 1) * PAGINATION_LIMIT + 1} to{" "}
//                                                         {Math.min(currentPage * PAGINATION_LIMIT, totalCount)} of {totalCount} total results
//                                                     </Typography>
//                                                 </Box>
//                                             )}
//                                         </Box>
//                                     )}

//                                     {searchError && !searchLoading && hasSearched && (
//                                         <Box sx={{ mt: 2, p: 2, bgcolor: "#fdecea", borderRadius: 1, border: "1px solid #ffcccc" }}>
//                                             <Typography variant="body2" sx={{ color: "#c62828" }}>
//                                                 Error fetching results. Please try again.
//                                             </Typography>
//                                         </Box>
//                                     )}
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

// export default MobinetDB;


import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Box,
    Button,
    Stack,
    Card,
    CardContent,
    Grid,
    Typography,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Breadcrumbs,
    Link,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Chip,
    Divider,
    CircularProgress,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import DnsIcon from "@mui/icons-material/Dns";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ErrorIcon from "@mui/icons-material/Error";
import InboxIcon from "@mui/icons-material/Inbox";

const COLORS = {
    primary: "#006e74",
    primaryDark: "#00494d",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
    info: "#17a2b8",
    lightBg: "#f8f9fa",
    borderColor: "#c9dcdc",
    headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
};

const CIRCLES = [
    "AP", "CH", "KK", "DL", "HR", "RJ", "JK", "WB", "OD", "MU",
    "TNCH", "UE", "BH", "UW", "MP", "PB", "KO", "JH", "UPW"
];

const PAGINATION_LIMIT = 200;

/* ================================================================ */
/*  Compact Summary Card Component                                  */
/* ================================================================ */
const CompactSummaryCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
    return (
        <Card
            sx={{
                background: "#fff",
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: 1.5,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,107,106,0.1)",
                    transform: "translateY(-2px)",
                },
                overflow: "hidden",
                height: "100%",
            }}
        >
            <Box sx={{ height: 2, background: COLORS.headerGradient }} />
            <CardContent sx={{ p: 1.5, textAlign: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    {Icon && (
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "8px",
                                background: `${color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Icon sx={{ color: color, fontSize: 18 }} />
                        </Box>
                    )}
                </Box>
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: "10px",
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                        display: "block",
                        mb: 0.5,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: color,
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  Upload Result Display Component                                 */
/* ================================================================ */
const MobinateDumpResult = ({ data }) => {
    if (!data) return null;

    const {
        success,
        total_files = 0,
        total_rows_read = 0,
        total_created = 0,
        total_invalid = 0,
        total_updated = 0,
        total_duplicate_in_file = 0,
    } = data;

    const successRate = total_rows_read > 0 ? ((total_created + total_updated) / total_rows_read) * 100 : 0;
    const errorRate = total_rows_read > 0 ? (total_invalid / total_rows_read) * 100 : 0;
    const duplicateRate = total_rows_read > 0 ? (total_duplicate_in_file / total_rows_read) * 100 : 0;

    return (
        <Box
            sx={{
                mt: 2,
                p: 2,
                background: COLORS.lightBg,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
            }}
        >
            {success && (
                <Alert
                    icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
                    severity="success"
                    sx={{
                        background: `${COLORS.success}15`,
                        border: `1px solid ${COLORS.success}`,
                        color: COLORS.success,
                        fontWeight: 600,
                        fontSize: "12px",
                        mb: 2,
                        py: 1,
                        px: 1.5,
                    }}
                >
                    ✓ Files processed successfully
                </Alert>
            )}

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard title="Total Rows" value={total_rows_read} icon={InfoIcon} color={COLORS.primary} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard title="Created" value={total_created} icon={CheckCircleIcon} color={COLORS.success} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard title="Updated" value={total_updated} icon={TrendingUpIcon} color={COLORS.primary} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <CompactSummaryCard title="Invalid" value={total_invalid} icon={ErrorIcon} color={COLORS.error} />
                </Grid>
            </Grid>

            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard title="Duplicates" value={total_duplicate_in_file} icon={WarningIcon} color={COLORS.warning} />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard title="Files" value={total_files} icon={InfoIcon} color={COLORS.info} />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <CompactSummaryCard title="Success Rate" value={`${successRate.toFixed(1)}%`} icon={CheckCircleIcon} color={COLORS.success} />
                </Grid>
            </Grid>

            {(total_invalid > 0 || total_duplicate_in_file > 0) && (
                <Box sx={{ mb: 2 }}>
                    {total_invalid > 0 && (
                        <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.error}15`, border: `1px solid ${COLORS.error}`, color: COLORS.error, mb: 1, py: 0.8 }}>
                            ⚠ {total_invalid.toLocaleString()} invalid records found ({errorRate.toFixed(1)}%)
                        </Alert>
                    )}
                    {total_duplicate_in_file > 0 && (
                        <Alert severity="warning" sx={{ fontSize: "11px", background: `${COLORS.warning}15`, border: `1px solid ${COLORS.warning}`, color: "#000", py: 0.8 }}>
                            ⚠ {total_duplicate_in_file.toLocaleString()} duplicate records found ({duplicateRate.toFixed(1)}%)
                        </Alert>
                    )}
                </Box>
            )}

            <Paper sx={{ mt: 2, borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}`, overflow: "hidden" }}>
                <Box sx={{ background: COLORS.headerGradient, p: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
                    <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: 0.3 }}>
                        Processing Summary
                    </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: "250px" }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ background: COLORS.primary }}>
                                <TableCell sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Metric</TableCell>
                                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Count</TableCell>
                                <TableCell align="right" sx={{ color: "#fff", fontWeight: 700, fontSize: "10px", py: 0.8 }}>Percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Total Rows</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_rows_read.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>100%</TableCell>
                            </TableRow>
                            <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Created</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.success, py: 0.6 }}>{total_created.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_created / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
                            </TableRow>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Updated</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.primary, py: 0.6 }}>{total_updated.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_updated / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
                            </TableRow>
                            <TableRow sx={{ background: COLORS.lightBg, "&:hover": { background: "#f0f0f0" } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Invalid</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.error, py: 0.6 }}>{total_invalid.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_invalid / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
                            </TableRow>
                            <TableRow sx={{ background: "#fff", "&:hover": { background: COLORS.lightBg } }}>
                                <TableCell sx={{ fontSize: "11px", fontWeight: 600, py: 0.6 }}>Duplicates</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: COLORS.warning, py: 0.6 }}>{total_duplicate_in_file.toLocaleString()}</TableCell>
                                <TableCell align="right" sx={{ fontSize: "11px", py: 0.6 }}>{total_rows_read > 0 ? ((total_duplicate_in_file / total_rows_read) * 100).toFixed(2) : 0}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

/* ================================================================ */
/*  Search Results Table Component                                  */
/* ================================================================ */
function ResultsTable({ rows, loading }) {
    const hasData = Array.isArray(rows) && rows.length > 0;

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress size={32} sx={{ color: COLORS.primary }} />
            </Box>
        );
    }

    if (!hasData) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 4, color: "#94a3b8" }}>
                <InboxIcon sx={{ fontSize: 30 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    No results found. Try adjusting your search filters.
                </Typography>
            </Box>
        );
    }

    const columns = rows.length > 0 ? Object.keys(rows[0]).filter(key => key !== "id") : [];

    return (
        <TableContainer sx={{ maxHeight: 400, overflowX: "auto" }}>
            <Table size="small" stickyHeader sx={{ borderCollapse: "collapse", "& .MuiTableCell-root": { border: `1px solid ${COLORS.borderColor}`, py: 0.6, fontSize: "11px", px: 1 } }}>
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col}
                                sx={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 4,
                                    bgcolor: COLORS.primary,
                                    color: "#fff",
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                    minWidth: 100,
                                }}
                            >
                                {col.replace(/_/g, " ").toUpperCase()}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={row.unique_id ?? i}>
                            {columns.map((col) => (
                                <TableCell
                                    key={`${row.unique_id}-${col}`}
                                    sx={{ bgcolor: "#ffffff", color: COLORS.primaryDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}
                                    title={String(row[col] ?? "—")}
                                >
                                    {String(row[col] ?? "—")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

/* ================================================================ */
/*  Export to CSV Function                                          */
/* ================================================================ */
function exportToExcel(data, filename = "mobinet_data.csv") {
    if (!data || data.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "No Data",
            text: "No data available to export",
        });
        return;
    }

    const columns = Object.keys(data[0]);
    const csvContent = [
        columns.join(","),
        ...data.map(row =>
            columns.map(col => {
                const value = row[col];
                return `"${String(value ?? "").replace(/"/g, '""')}"`;
            }).join(",")
        )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
        icon: "success",
        title: "Done",
        text: `Data exported successfully (${data.length} records)`,
    });
}

/* ================================================================ */
/*  Helper function to parse multiple values                        */
/* ================================================================ */
const parseMultipleValues = (input) => {
    if (!input || !input.trim()) return [];
    return input
        .split(/[,;]/)
        .map(val => val.trim())
        .filter(val => val.length > 0);
};

/* ================================================================ */
/*  Main Merged Component WITH CANCELLATION SUPPORT                */
/* ================================================================ */
const MobinetDB = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    // ===== ABORT CONTROLLER REFS (for cancellation) =====
    const uploadAbortControllerRef = useRef(null);
    const searchAbortControllerRef = useRef(null);
    const downloadAbortControllerRef = useRef(null);

    // FILE UPLOAD STATE
    const [circleFiles, setCircleFiles] = useState([]);
    const [showCircleError, setShowCircleError] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);

    // SEARCH STATE
    const [circle, setCircle] = useState("");
    const [siteIdInput, setSiteIdInput] = useState("");
    const [serialNumberInput, setSerialNumberInput] = useState("");
    const [results, setResults] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const totalPages = Math.ceil(totalCount / PAGINATION_LIMIT);

    // Parse values for display
    const siteIds = parseMultipleValues(siteIdInput);
    const serialNumbers = parseMultipleValues(serialNumberInput);

    // ======== CLEANUP ON UNMOUNT & NAVIGATE ========
    useEffect(() => {
        // Cleanup function to abort all requests when component unmounts
        return () => {
            if (uploadAbortControllerRef.current) {
                uploadAbortControllerRef.current.abort();
                console.log("Upload request aborted on unmount");
            }
            if (searchAbortControllerRef.current) {
                searchAbortControllerRef.current.abort();
                console.log("Search request aborted on unmount");
            }
            if (downloadAbortControllerRef.current) {
                downloadAbortControllerRef.current.abort();
                console.log("Download request aborted on unmount");
            }
        };
    }, []);

    // ======== FILE UPLOAD HANDLERS ========
    const handleCircleFileSelection = (event) => {
        setCircleFiles(event.target.files);
        setShowCircleError(false);
    };

    const handleUploadSubmit = async () => {
        if (circleFiles.length === 0) {
            setShowCircleError(true);
            return;
        }

        try {
            // Create a new AbortController for this upload
            uploadAbortControllerRef.current = new AbortController();

            action(true);
            const formData = new FormData();

            for (let i = 0; i < circleFiles.length; i++) {
                formData.append("files", circleFiles[i]);
            }

            // Pass the abort signal to the fetch call
            const response = await fetch("mobinate_vs_cats/mobinet_data_stor/", {
                method: "POST",
                body: formData,
                signal: uploadAbortControllerRef.current.signal, // ← ABORT SIGNAL
            }).then(res => res.json());

            if (response && response.success === true) {
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Files processed successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "An error occurred",
                });
            }
        } catch (error) {
            // Check if error is due to abort
            if (error.name === "AbortError") {
                console.log("Upload cancelled by user");
                Swal.fire({
                    icon: "info",
                    title: "Cancelled",
                    text: "Upload has been cancelled",
                });
            } else {
                console.error("Submit error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.message || "Failed to submit files",
                });
            }
        } finally {
            action(false);
        }
    };

    const handleUploadCancel = () => {
        // Abort the ongoing upload request
        if (uploadAbortControllerRef.current) {
            uploadAbortControllerRef.current.abort();
            console.log("Upload cancelled by user");
        }

        setCircleFiles([]);
        setShowCircleError(false);
        setUploadSuccess(false);
        setUploadResultData(null);
    };

    // ======== SEARCH HANDLERS ========
    const fetchResults = useCallback(async (pageNum = 1) => {
        // Check if at least one filter is provided
        const hasFilters = circle.trim() || siteIds.length > 0 || serialNumbers.length > 0;

        if (!hasFilters) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please provide at least one search filter (Circle, Site ID, or Serial Number)",
            });
            return;
        }

        setSearchLoading(true);
        setSearchError(false);

        try {
            // Create a new AbortController for this search
            searchAbortControllerRef.current = new AbortController();

            const formData = new FormData();

            // ALWAYS send circle (even if empty) - backend requirement
            formData.append("circle", circle || "");

            formData.append("limit", PAGINATION_LIMIT.toString());
            formData.append("offset", ((pageNum - 1) * PAGINATION_LIMIT).toString());

            // Send site IDs as comma-separated string if available
            if (siteIds.length > 0) {
                formData.append("site_id", siteIds.join(","));
            }

            // Send serial numbers as comma-separated string if available
            if (serialNumbers.length > 0) {
                formData.append("serial_number", serialNumbers.join(","));
            }

            console.log("Search Request:", {
                circle: circle || "",
                site_id: siteIds.length > 0 ? siteIds.join(",") : "not provided",
                serial_number: serialNumbers.length > 0 ? serialNumbers.join(",") : "not provided",
            });

            const response = await fetch("mobinate_vs_cats/mobinet_db_search/", {
                method: "POST",
                body: formData,
                signal: searchAbortControllerRef.current.signal, // ← ABORT SIGNAL
            }).then(res => res.json());

            console.log("Search Response:", response);

            if (response && response.success) {
                const resultsArray = response.results || [];

                if (resultsArray.length > 0) {
                    setResults(resultsArray);
                    setTotalCount(response.count || resultsArray.length);
                    setCurrentPage(pageNum);
                    setHasSearched(true);
                    setSearchError(false);
                } else {
                    setResults([]);
                    setTotalCount(0);
                    setSearchError(true);
                    Swal.fire({
                        icon: "info",
                        title: "No Results",
                        text: "No data found for the selected filters",
                    });
                }
            } else {
                setResults([]);
                setTotalCount(0);
                setSearchError(true);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to fetch data",
                });
            }
        } catch (e) {
            // Check if error is due to abort
            if (e.name === "AbortError") {
                console.log("Search cancelled by user");
                setResults([]);
                setTotalCount(0);
                // Don't show error alert for intentional cancellation
            } else {
                console.error("Search error:", e);
                setSearchError(true);
                setResults([]);
                setTotalCount(0);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: e.message || "Error fetching results. Please try again.",
                });
            }
        } finally {
            setSearchLoading(false);
        }
    }, [circle, siteIds, serialNumbers]);

    // ========= Download Excel ==========
    const downloadExcel = async () => {
        const hasFilters = circle.trim() || siteIds.length > 0 || serialNumbers.length > 0;

        if (!hasFilters) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please provide at least one search filter before downloading.",
            });
            return;
        }

        setDownloadLoading(true);

        try {
            // Create a new AbortController for this download
            downloadAbortControllerRef.current = new AbortController();

            const formData = new FormData();

            if (circle.trim()) {
                formData.append("circle", circle.trim());
            }

            if (siteIds.length > 0) {
                formData.append("site_id", siteIds.join(","));
            }

            if (serialNumbers.length > 0) {
                formData.append("serial_number", serialNumbers.join(","));
            }

            const response = await fetch("mobinate_vs_cats/mobinet_db_search_export/", {
                method: "POST",
                body: formData,
                signal: downloadAbortControllerRef.current.signal, // ← ABORT SIGNAL
            }).then(res => res.json());

            if (response && response.success && response.download_url) {
                const link = document.createElement("a");
                link.href = response.download_url;
                link.download = response.filename || "Mobinet_Data.xlsx";
                link.target = "_blank";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                Swal.fire({
                    icon: "success",
                    title: "Export Ready",
                    text: `${response.exported_rows || 0} records exported successfully.`,
                    timer: 2500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Export Failed",
                    text: response?.message || "Failed to export Mobinet data.",
                });
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Download cancelled by user");
                Swal.fire({
                    icon: "info",
                    title: "Cancelled",
                    text: "Download has been cancelled",
                });
            } else {
                console.error("Excel export error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error?.message || "Error while exporting data. Please try again.",
                });
            }
        } finally {
            setDownloadLoading(false);
        }
    };

    // ========= CANCEL HANDLERS =========
    const handleCancelSearch = () => {
        if (searchAbortControllerRef.current) {
            searchAbortControllerRef.current.abort();
            setSearchLoading(false);
            console.log("Search cancelled by user");
        }
    };

    const handleCancelDownload = () => {
        if (downloadAbortControllerRef.current) {
            downloadAbortControllerRef.current.abort();
            setDownloadLoading(false);
            console.log("Download cancelled by user");
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchResults(1);
    };

    const handleReset = () => {
        // Cancel any ongoing requests
        handleCancelSearch();
        
        setCircle("");
        setSiteIdInput("");
        setSerialNumberInput("");
        setResults([]);
        setTotalCount(0);
        setCurrentPage(1);
        setHasSearched(false);
    };

    const handleDownload = () => {
        if (results.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Data",
                text: "No results to download. Please search first.",
            });
            return;
        }

        const filename = `Mobinet_${circle || "all"}_${new Date().toISOString().split('T')[0]}.csv`;
        exportToExcel(results, filename);
    };

    const handlePageChange = (event, pageNum) => {
        fetchResults(pageNum);
    };

    useEffect(() => {
        document.title = "Mobinet DB";
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate("/tools")} sx={{ cursor: "pointer" }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate("/tools/material_management")} sx={{ cursor: "pointer" }}>
                        Material Management
                    </Link>
                    <Typography color="text.primary">Mobinet DB</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Mobinet DB</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                {/* ====== FILE UPLOAD SECTION ====== */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Mobinet Circle Files:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={circleFiles.length > 0 ? "warning" : "primary"}
                                            >
                                                Select File
                                                <input
                                                    required
                                                    hidden
                                                    accept=".csv,.xlsx,.xls,.xlsb"
                                                    multiple
                                                    type="file"
                                                    onChange={handleCircleFileSelection}
                                                />
                                            </Button>
                                        </div>

                                        {circleFiles.length > 0 && (
                                            <span style={{ color: "green", fontSize: "18px", fontWeight: 600 }}>
                                                Selected File(s): {circleFiles.length}
                                            </span>
                                        )}

                                        {showCircleError && (
                                            <span style={{ color: "red", fontSize: "18px", fontWeight: 600 }}>
                                                This Field Is Required!
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* UPLOAD ACTION BUTTONS */}
                                <Stack
                                    direction={{ xs: "column", sm: "column", md: "row" }}
                                    spacing={2}
                                    style={{ display: "flex", justifyContent: "space-around" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleUploadSubmit}
                                        endIcon={<UploadIcon />}
                                        disabled={circleFiles.length === 0}
                                    >
                                        Submit
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleUploadCancel}
                                        style={{ backgroundColor: "red", color: "white" }}
                                        endIcon={<DoDisturbIcon />}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>

                                {/* UPLOAD RESULT DISPLAY */}
                                {uploadSuccess && <MobinateDumpResult data={uploadResultData} />}

                                {/* DIVIDER */}
                                <Divider sx={{ my: 2 }} />

                                {/* ====== SEARCH SECTION ====== */}
                                <Box
                                    sx={{
                                        bgcolor: "#ffffff",
                                        p: 2.5,
                                        borderRadius: 1,
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: COLORS.primary,
                                            mb: 1,
                                            fontSize: "16px",
                                            letterSpacing: 0.3,
                                        }}
                                    >
                                        Search Mobinet Database
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#666",
                                            fontSize: "12px",
                                            mb: 2,
                                            display: "block",
                                        }}
                                    >
                                        Provide at least one search filter below
                                    </Typography>

                                    <Stack spacing={2}>
                                        {/* Circle Filter - Optional */}
                                        <Box sx={{ maxWidth: 250 }}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="circle-label">Circle</InputLabel>
                                                <Select
                                                    labelId="circle-label"
                                                    label="Circle"
                                                    value={circle}
                                                    onChange={(e) => setCircle(e.target.value)}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select Circle</em>
                                                    </MenuItem>
                                                    {CIRCLES.map((c) => (
                                                        <MenuItem key={c} value={c}>
                                                            {c}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>

                                        {/* Multiple Site IDs and Serial Numbers */}
                                        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                                            <TextField
                                                size="small"
                                                label="Site ID"
                                                placeholder="e.g., COW162, COW163, COW164"
                                                value={siteIdInput}
                                                onChange={(e) => setSiteIdInput(e.target.value)}
                                                sx={{ flex: 1, minWidth: 150 }}
                                                helperText="Separate multiple values by comma or semicolon"
                                                multiline
                                                rows={2}
                                            />
                                            <TextField
                                                size="small"
                                                label="Serial Number"
                                                placeholder="e.g., CN32371077, CN32371078"
                                                value={serialNumberInput}
                                                onChange={(e) => setSerialNumberInput(e.target.value)}
                                                sx={{ flex: 1, minWidth: 150 }}
                                                helperText="Separate multiple values by comma or semicolon"
                                                multiline
                                                rows={2}
                                            />
                                        </Stack>
                                    </Stack>

                                    {/* Search Action Buttons */}
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<SearchIcon />}
                                            onClick={handleSearch}
                                            disabled={searchLoading}
                                            sx={{
                                                background: COLORS.headerGradient,
                                                color: "#fff",
                                                fontWeight: 700,
                                                textTransform: "none",
                                                "&:hover": {
                                                    background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
                                                },
                                            }}
                                        >
                                            {searchLoading ? "Searching..." : "Search"}
                                        </Button>
                                        
                                        {searchLoading && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={handleCancelSearch}
                                                sx={{
                                                    borderColor: COLORS.error,
                                                    color: COLORS.error,
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                }}
                                            >
                                                Cancel Search
                                            </Button>
                                        )}
                                        
                                        <Button
                                            variant="outlined"
                                            startIcon={<ClearIcon />}
                                            onClick={handleReset}
                                            disabled={searchLoading}
                                            sx={{
                                                borderColor: COLORS.primary,
                                                color: COLORS.primary,
                                                fontWeight: 700,
                                                textTransform: "none",
                                            }}
                                        >
                                            Reset
                                        </Button>
                                    </Stack>

                                    {/* Active Filters Display */}
                                    {hasSearched && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
                                            {circle && <Chip label={`Circle: ${circle}`} size="small" variant="outlined" />}
                                            {siteIds.map((id, idx) => (
                                                <Chip key={`site-${idx}`} label={`Site: ${id}`} size="small" variant="outlined" />
                                            ))}
                                            {serialNumbers.map((sn, idx) => (
                                                <Chip key={`serial-${idx}`} label={`Serial: ${sn}`} size="small" variant="outlined" />
                                            ))}
                                        </Stack>
                                    )}

                                    {/* Results Section */}
                                    {hasSearched && (
                                        <Box sx={{ mt: 3 }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>
                                                    Results ({results.length} records)
                                                </Typography>
                                                {results.length > 0 && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        startIcon={<FileDownloadIcon />}
                                                        onClick={downloadExcel}
                                                        disabled={downloadLoading}
                                                        sx={{
                                                            background: COLORS.headerGradient,
                                                            color: "#fff",
                                                            fontWeight: 700,
                                                            textTransform: "none",
                                                        }}
                                                    >
                                                        {downloadLoading ? "Downloading..." : "Download"}
                                                    </Button>
                                                )}
                                            </Box>

                                            {downloadLoading && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={handleCancelDownload}
                                                        sx={{
                                                            borderColor: COLORS.error,
                                                            color: COLORS.error,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Cancel Download
                                                    </Button>
                                                </Box>
                                            )}

                                            <ResultsTable rows={results} loading={searchLoading} />

                                            {/* Pagination */}
                                            {totalPages > 1 && !searchLoading && (
                                                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                                                    <Pagination
                                                        count={totalPages}
                                                        page={currentPage}
                                                        onChange={handlePageChange}
                                                        color="primary"
                                                        size="small"
                                                    />
                                                </Box>
                                            )}

                                            {/* Results Summary */}
                                            {!searchLoading && results.length > 0 && (
                                                <Box sx={{ mt: 2, p: 1.5, bgcolor: "rgba(0,110,116,0.05)", borderRadius: 1 }}>
                                                    <Typography variant="caption" sx={{ color: COLORS.primaryDark, fontSize: "12px" }}>
                                                        Showing {(currentPage - 1) * PAGINATION_LIMIT + 1} to{" "}
                                                        {Math.min(currentPage * PAGINATION_LIMIT, totalCount)} of {totalCount} total results
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {searchError && !searchLoading && hasSearched && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: "#fdecea", borderRadius: 1, border: "1px solid #ffcccc" }}>
                                            <Typography variant="body2" sx={{ color: "#c62828" }}>
                                                Error fetching results. Please try again.
                                            </Typography>
                                        </Box>
                                    )}
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

export default MobinetDB;


