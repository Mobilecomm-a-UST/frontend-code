// import React, { useState, useEffect } from "react";
// import {
//     Box,
//     Button,
//     Stack,
//     Chip,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Alert,
//     AlertTitle,
//     CircularProgress,
//     Typography,
//     IconButton,
//     Tooltip,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     TablePagination,
// } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import Swal from "sweetalert2";
// import { postDataa, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const getMessage = (data, fallback) => {
//     if (!data) return fallback;
//     const msg = data.message || data.error || data.detail || data.errors;
//     if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
//     return fallback;
// };

// const isSuccessResponse = (data) =>
//     data && (data.status === true || (data.status === undefined && !data.error));

// const Ericsson = () => {
//     // Separate files state for each section
//     const [ericssonFiles, setEricssonFiles] = useState([]);
//     const [oldVsNewFiles, setOldVsNewFiles] = useState([]);

//     const [submittingSection, setSubmittingSection] = useState(null); // 'ericsson' or 'oldVsNew'
//     const [results, setResults] = useState(null);

//     // Data lists for tables
//     const [oldVsNewSites, setOldVsNewSites] = useState([]);
//     const [universalAlarms, setUniversalAlarms] = useState([]);
//     const [loadingSites, setLoadingSites] = useState(false);

//     // Pagination States
//     const [pageOld, setPageOld] = useState(0);
//     const [rowsPerPageOld, setRowsPerPageOld] = useState(5);

//     const [pageUni, setPageUni] = useState(0);
//     const [rowsPerPageUni, setRowsPerPageUni] = useState(5);

//     const { loading, action: setLoading } = useLoadingDialog();

//     useEffect(() => {
//         fetchExistingSites();
//     }, []);

//     const fetchExistingSites = async () => {
//         setLoadingSites(true);
//         try {
//             const res = await getData("universal_alarm/get_site/");
//             if (res) {
//                 if (res.old_vs_new && Array.isArray(res.old_vs_new)) {
//                     setOldVsNewSites(res.old_vs_new);
//                 } else {
//                     setOldVsNewSites([]);
//                 }

//                 if (res.universal_alarms && Array.isArray(res.universal_alarms)) {
//                     setUniversalAlarms(res.universal_alarms);
//                 } else if (Array.isArray(res)) {
//                     setUniversalAlarms(res);
//                 } else {
//                     setUniversalAlarms([]);
//                 }
//             }
//         } catch (error) {
//             console.error("Failed to fetch site data", error);
//         } finally {
//             setLoadingSites(false);
//         }
//     };

//     const handleDeleteSite = async (siteId) => {
//         const confirm = await Swal.fire({
//             title: "Are you sure?",
//             text: "This record will be deleted from the server.",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonColor: "#d33",
//             cancelButtonColor: "#3085d6",
//             confirmButtonText: "Yes, delete it!",
//         });

//         if (confirm.isConfirmed) {
//             try {
//                 const res = await deleteData("universal_alarm/delete_site/", {
//                     data: { id: siteId, site: siteId },
//                 });
//                 if (res) {
//                     Swal.fire("Deleted!", "Record has been deleted.", "success");
//                     fetchExistingSites();
//                 } else {
//                     Swal.fire("Failed", "Unable to delete record.", "error");
//                 }
//             } catch (err) {
//                 Swal.fire("Error", "Error deleting record.", "error");
//             }
//         }
//     };

//     const handleFileChange = (sectionKey, accept, multiple, event) => {
//         const allowed = accept
//             .split(",")
//             .map((ext) => ext.trim().replace(".", "").toLowerCase());
//         const selected = Array.from(event.target.files || []);
//         const validFiles = [];

//         selected.forEach((file) => {
//             const extension = file.name.split(".").pop().toLowerCase();
//             if (allowed.includes(extension)) {
//                 validFiles.push(file);
//             } else {
//                 Swal.fire({
//                     icon: "warning",
//                     title: "Invalid File Type",
//                     text: `File "${file.name}" has invalid extension. Allowed: ${accept}`,
//                 });
//             }
//         });

//         if (validFiles.length > 0) {
//             if (sectionKey === "ericsson") {
//                 setEricssonFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
//             } else if (sectionKey === "oldVsNew") {
//                 setOldVsNewFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
//             }
//         }
//         event.target.value = "";
//     };

//     const handleRemoveFile = (sectionKey, index) => {
//         if (sectionKey === "ericsson") {
//             setEricssonFiles((prev) => prev.filter((_, i) => i !== index));
//         } else if (sectionKey === "oldVsNew") {
//             setOldVsNewFiles((prev) => prev.filter((_, i) => i !== index));
//         }
//     };

//     // Submit Ericsson Alarm Log Files
//     const handleEricssonSubmit = async () => {
//         if (ericssonFiles.length === 0) {
//             Swal.fire({ icon: "error", title: "Error", text: "Please select log files to process." });
//             return;
//         }

//         setSubmittingSection("ericsson");
//         setLoading(true);

//         try {
//             const formData = new FormData();
//             ericssonFiles.forEach((file) => formData.append("log_files", file));

//             const data = await postDataa("universal_alarm/upload_files/", formData);
//             const ok = isSuccessResponse(data);

//             setResults([{
//                 title: "Ericsson Alarm Process",
//                 ok,
//                 data: data || {},
//                 message: getMessage(data, ok ? "Completed successfully" : "Failed to process"),
//             }]);

//             if (ok) {
//                 setEricssonFiles([]);
//                 fetchExistingSites();
//             }
//         } catch (error) {
//             setResults([{
//                 title: "Ericsson Alarm Process",
//                 ok: false,
//                 data: null,
//                 message: error.message || "Failed to process",
//             }]);
//         } finally {
//             setLoading(false);
//             setSubmittingSection(null);
//         }
//     };

//     // Submit Old vs New Site File
//     const handleOldVsNewSubmit = async () => {
//         if (oldVsNewFiles.length === 0) {
//             Swal.fire({ icon: "error", title: "Error", text: "Please select a site file to upload." });
//             return;
//         }

//         setSubmittingSection("oldVsNew");
//         setLoading(true);

//         try {
//             const formData = new FormData();
//             oldVsNewFiles.forEach((file) => formData.append("site_file", file));

//             const data = await postDataa("universal_alarm/upload_site/", formData);
//             const ok = isSuccessResponse(data);

//             setResults([{
//                 title: "Old vs New (Site Upload)",
//                 ok,
//                 data: data || {},
//                 message: getMessage(data, ok ? "Completed successfully" : "Failed to process"),
//             }]);

//             if (ok) {
//                 setOldVsNewFiles([]);
//                 fetchExistingSites();
//             }
//         } catch (error) {
//             setResults([{
//                 title: "Old vs New (Site Upload)",
//                 ok: false,
//                 data: null,
//                 message: error.message || "Failed to process",
//             }]);
//         } finally {
//             setLoading(false);
//             setSubmittingSection(null);
//         }
//     };

//     const handleReset = (sectionKey) => {
//         if (sectionKey === "ericsson") setEricssonFiles([]);
//         if (sectionKey === "oldVsNew") setOldVsNewFiles([]);
//     };

//     return (
//         <>
//             <Box sx={{ px: 1.5, pb: 4 }}>
//                 <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", mt: 5 }}>
//                     {/* Header Banner */}
//                     <Box
//                         sx={{
//                             position: "absolute",
//                             top: -26,
//                             left: "50%",
//                             transform: "translateX(-50%)",
//                             width: { xs: "90%", md: "70%" },
//                             height: 54,
//                             borderRadius: "30px",
//                             bgcolor: "#006e74",
//                             color: "#fff",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             zIndex: 1,
//                         }}
//                     >
//                         <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
//                             Ericsson Alarm Processing
//                         </Typography>
//                     </Box>

//                     {/* Gradient Panel Container */}
//                     <Box
//                         sx={{
//                             background: "linear-gradient(135deg, #00696f 0%, #7ecbc3 100%)",
//                             borderRadius: "8px",
//                             pt: 7,
//                             px: 2,
//                             pb: 3,
//                             boxShadow: "0 20px 30px rgba(60, 60, 120, 0.25)",
//                         }}
//                     >
//                         {/* ──────────────── 1. SELECT LOGS FILES SECTION ──────────────── */}
//                         <Box
//                             sx={{
//                                 bgcolor: "#fff",
//                                 borderRadius: "10px",
//                                 px: 1.5,
//                                 py: 1.5,
//                                 mb: 3,
//                                 boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                             }}
//                         >
//                             <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#444", mb: 1 }}>
//                                 Select Logs Files:-
//                             </Typography>

//                             <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     size="small"
//                                     disabled={submittingSection === "ericsson"}
//                                 >
//                                     Select Files
//                                     <input
//                                         hidden
//                                         type="file"
//                                         accept=".log,.logs,.txt"
//                                         multiple
//                                         onChange={(e) => handleFileChange("ericsson", ".log,.logs,.txt", true, e)}
//                                     />
//                                 </Button>

//                                 {ericssonFiles.map((file, idx) => (
//                                     <Chip
//                                         key={idx}
//                                         label={file.name}
//                                         color="success"
//                                         size="small"
//                                         onDelete={() => handleRemoveFile("ericsson", idx)}
//                                     />
//                                 ))}
//                             </Stack>

//                             <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     size="small"
//                                     onClick={handleEricssonSubmit}
//                                     endIcon={submittingSection === "ericsson" ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
//                                     disabled={submittingSection === "ericsson" || ericssonFiles.length === 0}
//                                 >
//                                     {submittingSection === "ericsson" ? "Processing..." : "Submit Logs"}
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     size="small"
//                                     onClick={() => handleReset("ericsson")}
//                                     endIcon={<DoDisturbIcon />}
//                                     disabled={submittingSection === "ericsson"}
//                                     sx={{ bgcolor: "#ff0000" }}
//                                 >
//                                     Reset
//                                 </Button>
//                             </Stack>
//                         </Box>

//                         {/* ──────────────── 2. SELECT OLD VS NEW (SITE) FILE SECTION ──────────────── */}
//                         <Box
//                             sx={{
//                                 bgcolor: "#fff",
//                                 borderRadius: "10px",
//                                 px: 1.5,
//                                 py: 1.5,
//                                 mb: 3,
//                                 boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                             }}
//                         >
//                             <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#444", mb: 1 }}>
//                                 Select Old vs New (Site) File:-
//                             </Typography>

//                             <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
//                                 <Button
//                                     variant="contained"
//                                     component="label"
//                                     size="small"
//                                     disabled={submittingSection === "oldVsNew"}
//                                 >
//                                     Select File
//                                     <input
//                                         hidden
//                                         type="file"
//                                         accept=".xlsx,.xls,.csv"
//                                         onChange={(e) => handleFileChange("oldVsNew", ".xlsx,.xls,.csv", false, e)}
//                                     />
//                                 </Button>

//                                 {oldVsNewFiles.map((file, idx) => (
//                                     <Chip
//                                         key={idx}
//                                         label={file.name}
//                                         color="success"
//                                         size="small"
//                                         onDelete={() => handleRemoveFile("oldVsNew", idx)}
//                                     />
//                                 ))}
//                             </Stack>

//                             <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     size="small"
//                                     onClick={handleOldVsNewSubmit}
//                                     endIcon={submittingSection === "oldVsNew" ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
//                                     disabled={submittingSection === "oldVsNew" || oldVsNewFiles.length === 0}
//                                 >
//                                     {submittingSection === "oldVsNew" ? "Uploading..." : "Submit File"}
//                                 </Button>
//                                 <Button
//                                     variant="contained"
//                                     color="error"
//                                     size="small"
//                                     onClick={() => handleReset("oldVsNew")}
//                                     endIcon={<DoDisturbIcon />}
//                                     disabled={submittingSection === "oldVsNew"}
//                                     sx={{ bgcolor: "#ff0000" }}
//                                 >
//                                     Reset
//                                 </Button>
//                             </Stack>
//                         </Box>

//                         {/* ──────────────── 3. UNIVERSAL ALARM DATA TABLE SECTION ──────────────── */}
//                         <Box
//                             sx={{
//                                 bgcolor: "#fff",
//                                 borderRadius: "10px",
//                                 px: 1.5,
//                                 py: 1.5,
//                                 mb: 3,
//                                 boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                             }}
//                         >
//                             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#444" }}>
//                                     Universal Alarms Data:
//                                 </Typography>
//                                 <Tooltip title="Refresh data">
//                                     <IconButton size="small" onClick={fetchExistingSites} disabled={loadingSites}>
//                                         <RefreshIcon fontSize="small" />
//                                     </IconButton>
//                                 </Tooltip>
//                             </Stack>

//                             {loadingSites ? (
//                                 <CircularProgress size={20} sx={{ mt: 1 }} />
//                             ) : universalAlarms.length > 0 ? (
//                                 <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
//                                     <TableContainer sx={{ maxHeight: 280 }}>
//                                         <Table stickyHeader size="small">
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Site ID</TableCell>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>MPlane IP</TableCell>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Status</TableCell>
//                                                     <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {universalAlarms
//                                                     .slice(pageUni * rowsPerPageUni, pageUni * rowsPerPageUni + rowsPerPageUni)
//                                                     .map((row) => (
//                                                         <TableRow hover key={row.id || row.site_id}>
//                                                             <TableCell>{row.id || "-"}</TableCell>
//                                                             <TableCell>{row.site_id || "-"}</TableCell>
//                                                             <TableCell>{row.mplane_ip || "-"}</TableCell>
//                                                             <TableCell>{row.status || "-"}</TableCell>
//                                                             <TableCell align="center">
//                                                                 <IconButton
//                                                                     size="small"
//                                                                     color="error"
//                                                                     onClick={() => handleDeleteSite(row.id)}
//                                                                 >
//                                                                     <DeleteIcon fontSize="small" />
//                                                                 </IconButton>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                     <TablePagination
//                                         rowsPerPageOptions={[5, 10, 20]}
//                                         component="div"
//                                         count={universalAlarms.length}
//                                         rowsPerPage={rowsPerPageUni}
//                                         page={pageUni}
//                                         onPageChange={(e, newPage) => setPageUni(newPage)}
//                                         onRowsPerPageChange={(e) => {
//                                             setRowsPerPageUni(parseInt(e.target.value, 10));
//                                             setPageUni(0);
//                                         }}
//                                     />
//                                 </Paper>
//                             ) : (
//                                 <Typography variant="caption" color="text.secondary">
//                                     No Universal Alarms data found.
//                                 </Typography>
//                             )}
//                         </Box>

//                         {/* ──────────────── 4. ACTIVE OLD VS NEW SITES TABLE SECTION ──────────────── */}
//                         <Box
//                             sx={{
//                                 bgcolor: "#fff",
//                                 borderRadius: "10px",
//                                 px: 1.5,
//                                 py: 1.5,
//                                 boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
//                             }}
//                         >
//                             <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#444" }}>
//                                     Active Old vs New Sites:
//                                 </Typography>
//                                 <Tooltip title="Refresh active sites">
//                                     <IconButton size="small" onClick={fetchExistingSites} disabled={loadingSites}>
//                                         <RefreshIcon fontSize="small" />
//                                     </IconButton>
//                                 </Tooltip>
//                             </Stack>

//                             {loadingSites ? (
//                                 <CircularProgress size={20} sx={{ mt: 1 }} />
//                             ) : oldVsNewSites.length > 0 ? (
//                                 <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
//                                     <TableContainer sx={{ maxHeight: 280 }}>
//                                         <Table stickyHeader size="small">
//                                             <TableHead>
//                                                 <TableRow>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>New Site</TableCell>
//                                                     <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Old Site</TableCell>
//                                                     <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {oldVsNewSites
//                                                     .slice(pageOld * rowsPerPageOld, pageOld * rowsPerPageOld + rowsPerPageOld)
//                                                     .map((row) => (
//                                                         <TableRow hover key={row.id || row.new_site}>
//                                                             <TableCell>{row.id || "-"}</TableCell>
//                                                             <TableCell>{row.new_site || "-"}</TableCell>
//                                                             <TableCell>{row.old_site || "-"}</TableCell>
//                                                             <TableCell align="center">
//                                                                 <IconButton
//                                                                     size="small"
//                                                                     color="error"
//                                                                     onClick={() => handleDeleteSite(row.id)}
//                                                                 >
//                                                                     <DeleteIcon fontSize="small" />
//                                                                 </IconButton>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                     <TablePagination
//                                         rowsPerPageOptions={[5, 10, 20]}
//                                         component="div"
//                                         count={oldVsNewSites.length}
//                                         rowsPerPage={rowsPerPageOld}
//                                         page={pageOld}
//                                         onPageChange={(e, newPage) => setPageOld(newPage)}
//                                         onRowsPerPageChange={(e) => {
//                                             setRowsPerPageOld(parseInt(e.target.value, 10));
//                                             setPageOld(0);
//                                         }}
//                                     />
//                                 </Paper>
//                             ) : (
//                                 <Typography variant="caption" color="text.secondary">
//                                     No Old vs New files uploaded on server.
//                                 </Typography>
//                             )}
//                         </Box>
//                     </Box>
//                 </Box>
//             </Box>

//             {/* Results Modal with Complete Backend Download Links */}
//             <Dialog
//                 open={Boolean(results)}
//                 onClose={() => setResults(null)}
//                 maxWidth="md"
//                 fullWidth
//             >
//                 <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
//                     📊 Processing Results
//                 </DialogTitle>
//                 <DialogContent>
//                     <Stack spacing={2} sx={{ mt: 1 }}>
//                         {results &&
//                             results.map((outcome, idx) => {
//                                 const responseData = outcome.data || {};
//                                 return (
//                                     <Alert key={idx} severity={outcome.ok ? "success" : "error"}>
//                                         <AlertTitle>{outcome.title}</AlertTitle>
//                                         <Typography sx={{ mb: 1, fontWeight: 500 }}>{outcome.message}</Typography>

//                                         {/* Download links extracted from backend response */}
//                                         <Stack spacing={1} sx={{ mt: 2 }}>
//                                             {responseData.merged_4g_download_link && (
//                                                 <Button
//                                                     variant="contained"
//                                                     color="success"
//                                                     size="small"
//                                                     startIcon={<FileDownloadIcon />}
//                                                     href={responseData.merged_4g_download_link}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     sx={{ width: "fit-content" }}
//                                                 >
//                                                     Download Merged 4G Report
//                                                 </Button>
//                                             )}

//                                             {responseData.merged_5g_download_link && (
//                                                 <Button
//                                                     variant="contained"
//                                                     color="success"
//                                                     size="small"
//                                                     startIcon={<FileDownloadIcon />}
//                                                     href={responseData.merged_5g_download_link}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     sx={{ width: "fit-content" }}
//                                                 >
//                                                     Download Merged 5G Report
//                                                 </Button>
//                                             )}

//                                             {responseData.zip_download_link && (
//                                                 <Button
//                                                     variant="contained"
//                                                     color="primary"
//                                                     size="small"
//                                                     startIcon={<FileDownloadIcon />}
//                                                     href={responseData.zip_download_link}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     sx={{ width: "fit-content" }}
//                                                 >
//                                                     Download ZIP Archive
//                                                 </Button>
//                                             )}

//                                             {/* Render individual circle links if returned in results array */}
//                                             {Array.isArray(responseData.results) && responseData.results.map((resItem, rIdx) => (
//                                                 <Box key={rIdx} sx={{ p: 1, bgcolor: "#f8fafc", borderRadius: 1, border: "1px solid #e2e8f0", mt: 1 }}>
//                                                     <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#334155" }}>
//                                                         Circle: {resItem.circle}
//                                                     </Typography>
//                                                     <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
//                                                         {resItem["4g_download_link"] && (
//                                                             <Button
//                                                                 size="small"
//                                                                 variant="outlined"
//                                                                 startIcon={<FileDownloadIcon />}
//                                                                 href={resItem["4g_download_link"]}
//                                                                 target="_blank"
//                                                             >
//                                                                 4G Report
//                                                             </Button>
//                                                         )}
//                                                         {resItem["5g_download_link"] && (
//                                                             <Button
//                                                                 size="small"
//                                                                 variant="outlined"
//                                                                 startIcon={<FileDownloadIcon />}
//                                                                 href={resItem["5g_download_link"]}
//                                                                 target="_blank"
//                                                             >
//                                                                 5G Report
//                                                             </Button>
//                                                         )}
//                                                     </Stack>
//                                                 </Box>
//                                             ))}
//                                         </Stack>

//                                         <Box component="details" sx={{ mt: 2 }}>
//                                             <summary style={{ cursor: "pointer", fontSize: 13, color: "#64748b" }}>
//                                                 Raw response
//                                             </summary>
//                                             <Box
//                                                 component="pre"
//                                                 sx={{
//                                                     p: 1.5,
//                                                     mt: 1,
//                                                     mb: 0,
//                                                     bgcolor: "#f5f5f5",
//                                                     borderRadius: 1,
//                                                     maxHeight: 200,
//                                                     overflow: "auto",
//                                                     fontSize: 12,
//                                                 }}
//                                             >
//                                                 {JSON.stringify(responseData, null, 2)}
//                                             </Box>
//                                         </Box>
//                                     </Alert>
//                                 );
//                             })}
//                     </Stack>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setResults(null)}>Close</Button>
//                 </DialogActions>
//             </Dialog>

//             {loading}
//         </>
//     );
// };

// export const MemoEricsson = React.memo(Ericsson);
// export default Ericsson;


import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    AlertTitle,
    CircularProgress,
    Typography,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import Swal from "sweetalert2";
import { postDataa, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const getMessage = (data, fallback) => {
    if (!data) return fallback;
    const msg = data.message || data.error || data.detail || data.errors;
    if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
    return fallback;
};

const isSuccessResponse = (data) =>
    data && (data.status === true || (data.status === undefined && !data.error));

const Ericsson = () => {
    // Separate files state for each section
    const [ericssonFiles, setEricssonFiles] = useState([]);
    const [oldVsNewFiles, setOldVsNewFiles] = useState([]);

    const [submittingSection, setSubmittingSection] = useState(null); // 'ericsson' or 'oldVsNew'
    const [results, setResults] = useState(null);

    // Data lists for tables
    const [oldVsNewSites, setOldVsNewSites] = useState([]);
    const [universalAlarms, setUniversalAlarms] = useState([]);
    const [loadingSites, setLoadingSites] = useState(false);

    // Pagination States
    const [pageOld, setPageOld] = useState(0);
    const [rowsPerPageOld, setRowsPerPageOld] = useState(5);

    const [pageUni, setPageUni] = useState(0);
    const [rowsPerPageUni, setRowsPerPageUni] = useState(5);

    const { loading, action: setLoading } = useLoadingDialog();

    useEffect(() => {
        fetchExistingSites();
    }, []);

    const fetchExistingSites = async () => {
        setLoadingSites(true);
        try {
            const res = await getData("universal_alarm/get_site/");
            if (res) {
                if (res.old_vs_new && Array.isArray(res.old_vs_new)) {
                    setOldVsNewSites(res.old_vs_new);
                } else {
                    setOldVsNewSites([]);
                }

                if (res.universal_alarms && Array.isArray(res.universal_alarms)) {
                    setUniversalAlarms(res.universal_alarms);
                } else if (Array.isArray(res)) {
                    setUniversalAlarms(res);
                } else {
                    setUniversalAlarms([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch site data", error);
        } finally {
            setLoadingSites(false);
        }
    };

    const handleDeleteSite = async (siteId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This record will be deleted from the server.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await deleteData("universal_alarm/delete_site/", {
                    data: { id: siteId, site: siteId },
                });
                if (res) {
                    Swal.fire("Deleted!", "Record has been deleted.", "success");
                    fetchExistingSites();
                } else {
                    Swal.fire("Failed", "Unable to delete record.", "error");
                }
            } catch (err) {
                Swal.fire("Error", "Error deleting record.", "error");
            }
        }
    };

    const handleFileChange = (sectionKey, accept, multiple, event) => {
        const allowed = accept
            .split(",")
            .map((ext) => ext.trim().replace(".", "").toLowerCase());
        const selected = Array.from(event.target.files || []);
        const validFiles = [];

        selected.forEach((file) => {
            const extension = file.name.split(".").pop().toLowerCase();
            if (allowed.includes(extension)) {
                validFiles.push(file);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Invalid File Type",
                    text: `File "${file.name}" has invalid extension. Allowed: ${accept}`,
                });
            }
        });

        if (validFiles.length > 0) {
            if (sectionKey === "ericsson") {
                setEricssonFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
            } else if (sectionKey === "oldVsNew") {
                setOldVsNewFiles((prev) => multiple ? [...prev, ...validFiles] : validFiles);
            }
        }
        event.target.value = "";
    };

    const handleClearSectionFiles = (sectionKey) => {
        if (sectionKey === "ericsson") setEricssonFiles([]);
        if (sectionKey === "oldVsNew") setOldVsNewFiles([]);
    };

    // Submit Ericsson Alarm Log Files
    const handleEricssonSubmit = async () => {
        if (ericssonFiles.length === 0) {
            Swal.fire({ icon: "error", title: "Error", text: "Please select log files to process." });
            return;
        }

        setSubmittingSection("ericsson");
        setLoading(true);

        try {
            const formData = new FormData();
            ericssonFiles.forEach((file) => formData.append("log_files", file));

            const data = await postDataa("universal_alarm/upload_files/", formData);
            const ok = isSuccessResponse(data);

            setResults([{
                title: "Ericsson Alarm Process",
                ok,
                data: data || {},
                message: getMessage(data, ok ? "Completed successfully" : "Failed to process"),
            }]);

            if (ok) {
                setEricssonFiles([]);
                fetchExistingSites();
            }
        } catch (error) {
            setResults([{
                title: "Ericsson Alarm Process",
                ok: false,
                data: null,
                message: error.message || "Failed to process",
            }]);
        } finally {
            setLoading(false);
            setSubmittingSection(null);
        }
    };

    // Submit Old vs New Site File
    const handleOldVsNewSubmit = async () => {
        if (oldVsNewFiles.length === 0) {
            Swal.fire({ icon: "error", title: "Error", text: "Please select a site file to upload." });
            return;
        }

        setSubmittingSection("oldVsNew");
        setLoading(true);

        try {
            const formData = new FormData();
            oldVsNewFiles.forEach((file) => formData.append("site_file", file));

            const data = await postDataa("universal_alarm/upload_site/", formData);
            const ok = isSuccessResponse(data);

            setResults([{
                title: "Old vs New (Site Upload)",
                ok,
                data: data || {},
                message: getMessage(data, ok ? "Completed successfully" : "Failed to process"),
            }]);

            if (ok) {
                setOldVsNewFiles([]);
                fetchExistingSites();
            }
        } catch (error) {
            setResults([{
                title: "Old vs New (Site Upload)",
                ok: false,
                data: null,
                message: error.message || "Failed to process",
            }]);
        } finally {
            setLoading(false);
            setSubmittingSection(null);
        }
    };

    const handleReset = (sectionKey) => {
        if (sectionKey === "ericsson") setEricssonFiles([]);
        if (sectionKey === "oldVsNew") setOldVsNewFiles([]);
    };

    return (
        <>
            <Box sx={{ px: 1.5, pb: 4 }}>
                <Box sx={{ position: "relative", maxWidth: 1200, mx: "auto", mt: 5 }}>
                    {/* Header Banner */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -26,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: { xs: "90%", md: "70%" },
                            height: 54,
                            borderRadius: "30px",
                            bgcolor: "#006e74",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, fontSize: 17 }}>
                            Ericsson Alarm Processing
                        </Typography>
                    </Box>

                    {/* Gradient Panel Container */}
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #00696f 0%, #7ecbc3 100%)",
                            borderRadius: "8px",
                            pt: 7,
                            px: 2,
                            pb: 3,
                            boxShadow: "0 20px 30px rgba(60, 60, 120, 0.25)",
                        }}
                    >
                        {/* ──────────────── 1. SELECT LOGS FILES SECTION ──────────────── */}
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                px: 1.5,
                                py: 1.5,
                                mb: 3,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#444", mb: 1 }}>
                                Select Logs Files:-
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size="small"
                                    disabled={submittingSection === "ericsson"}
                                >
                                    Select Files
                                    <input
                                        hidden
                                        type="file"
                                        accept=".log,.logs,.txt"
                                        multiple
                                        onChange={(e) => handleFileChange("ericsson", ".log,.logs,.txt", true, e)}
                                    />
                                </Button>

                                {ericssonFiles.length > 0 && (
                                    <Chip
                                        label={`${ericssonFiles.length} file${ericssonFiles.length > 1 ? "s" : ""} selected`}
                                        color="success"
                                        size="small"
                                        onDelete={
                                            submittingSection === "ericsson"
                                                ? undefined
                                                : () => handleClearSectionFiles("ericsson")
                                        }
                                    />
                                )}
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={handleEricssonSubmit}
                                    endIcon={submittingSection === "ericsson" ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                                    disabled={submittingSection === "ericsson" || ericssonFiles.length === 0}
                                >
                                    {submittingSection === "ericsson" ? "Processing..." : "Submit Logs"}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleReset("ericsson")}
                                    endIcon={<DoDisturbIcon />}
                                    disabled={submittingSection === "ericsson"}
                                    sx={{ bgcolor: "#ff0000" }}
                                >
                                    Reset
                                </Button>
                            </Stack>
                        </Box>

                        {/* ──────────────── 2. SELECT OLD VS NEW (SITE) FILE SECTION ──────────────── */}
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                px: 1.5,
                                py: 1.5,
                                mb: 3,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#444", mb: 1 }}>
                                Select Old vs New (Site) File:-
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 1 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size="small"
                                    disabled={submittingSection === "oldVsNew"}
                                >
                                    Select File
                                    <input
                                        hidden
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        multiple
                                        onChange={(e) => handleFileChange("oldVsNew", ".xlsx,.xls,.csv", false, e)}
                                    />
                                </Button>

                                {oldVsNewFiles.length > 0 && (
                                    <Chip
                                        label={`${oldVsNewFiles.length} file${oldVsNewFiles.length > 1 ? "s" : ""} selected`}
                                        color="success"
                                        size="small"
                                        onDelete={
                                            submittingSection === "oldVsNew"
                                                ? undefined
                                                : () => handleClearSectionFiles("oldVsNew")
                                        }
                                    />
                                )}
                            </Stack>

                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={handleOldVsNewSubmit}
                                    endIcon={submittingSection === "oldVsNew" ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
                                    disabled={submittingSection === "oldVsNew" || oldVsNewFiles.length === 0}
                                >
                                    {submittingSection === "oldVsNew" ? "Uploading..." : "Submit File"}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleReset("oldVsNew")}
                                    endIcon={<DoDisturbIcon />}
                                    disabled={submittingSection === "oldVsNew"}
                                    sx={{ bgcolor: "#ff0000" }}
                                >
                                    Reset
                                </Button>
                            </Stack>
                        </Box>

                        {/* ──────────────── 3. UNIVERSAL ALARM DATA TABLE SECTION ──────────────── */}
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                px: 1.5,
                                py: 1.5,
                                mb: 3,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#444" }}>
                                    Universal Alarms Data:
                                </Typography>
                                <Tooltip title="Refresh data">
                                    <IconButton size="small" onClick={fetchExistingSites} disabled={loadingSites}>
                                        <RefreshIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                            {loadingSites ? (
                                <CircularProgress size={20} sx={{ mt: 1 }} />
                            ) : universalAlarms.length > 0 ? (
                                <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
                                    <TableContainer sx={{ maxHeight: 280 }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Site ID</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>MPlane IP</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Status</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {universalAlarms
                                                    .slice(pageUni * rowsPerPageUni, pageUni * rowsPerPageUni + rowsPerPageUni)
                                                    .map((row) => (
                                                        <TableRow hover key={row.id || row.site_id}>
                                                            <TableCell>{row.id || "-"}</TableCell>
                                                            <TableCell>{row.site_id || "-"}</TableCell>
                                                            <TableCell>{row.mplane_ip || "-"}</TableCell>
                                                            <TableCell>{row.status || "-"}</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteSite(row.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        component="div"
                                        count={universalAlarms.length}
                                        rowsPerPage={rowsPerPageUni}
                                        page={pageUni}
                                        onPageChange={(e, newPage) => setPageUni(newPage)}
                                        onRowsPerPageChange={(e) => {
                                            setRowsPerPageUni(parseInt(e.target.value, 10));
                                            setPageUni(0);
                                        }}
                                    />
                                </Paper>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    No Universal Alarms data found.
                                </Typography>
                            )}
                        </Box>

                        {/* ──────────────── 4. ACTIVE OLD VS NEW SITES TABLE SECTION ──────────────── */}
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: "10px",
                                px: 1.5,
                                py: 1.5,
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#444" }}>
                                    Active Old vs New Sites:
                                </Typography>
                                <Tooltip title="Refresh active sites">
                                    <IconButton size="small" onClick={fetchExistingSites} disabled={loadingSites}>
                                        <RefreshIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                            {loadingSites ? (
                                <CircularProgress size={20} sx={{ mt: 1 }} />
                            ) : oldVsNewSites.length > 0 ? (
                                <Paper sx={{ width: "100%", overflow: "hidden", mt: 1 }}>
                                    <TableContainer sx={{ maxHeight: 280 }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>ID</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>New Site</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Old Site</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {oldVsNewSites
                                                    .slice(pageOld * rowsPerPageOld, pageOld * rowsPerPageOld + rowsPerPageOld)
                                                    .map((row) => (
                                                        <TableRow hover key={row.id || row.new_site}>
                                                            <TableCell>{row.id || "-"}</TableCell>
                                                            <TableCell>{row.new_site || "-"}</TableCell>
                                                            <TableCell>{row.old_site || "-"}</TableCell>
                                                            <TableCell align="center">
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteSite(row.id)}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 20]}
                                        component="div"
                                        count={oldVsNewSites.length}
                                        rowsPerPage={rowsPerPageOld}
                                        page={pageOld}
                                        onPageChange={(e, newPage) => setPageOld(newPage)}
                                        onRowsPerPageChange={(e) => {
                                            setRowsPerPageOld(parseInt(e.target.value, 10));
                                            setPageOld(0);
                                        }}
                                    />
                                </Paper>
                            ) : (
                                <Typography variant="caption" color="text.secondary">
                                    No Old vs New files uploaded on server.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Results Modal with Complete Backend Download Links */}
            <Dialog
                open={Boolean(results)}
                onClose={() => setResults(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
                    📊 Processing Results
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        {results &&
                            results.map((outcome, idx) => {
                                const responseData = outcome.data || {};
                                return (
                                    <Alert key={idx} severity={outcome.ok ? "success" : "error"}>
                                        <AlertTitle>{outcome.title}</AlertTitle>
                                        <Typography sx={{ mb: 1, fontWeight: 500 }}>{outcome.message}</Typography>

                                        {/* Download links extracted from backend response */}
                                        <Stack spacing={1} sx={{ mt: 2 }}>
                                            {responseData.merged_4g_download_link && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<FileDownloadIcon />}
                                                    href={responseData.merged_4g_download_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ width: "fit-content" }}
                                                >
                                                    Download Merged 4G Report
                                                </Button>
                                            )}

                                            {responseData.merged_5g_download_link && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    startIcon={<FileDownloadIcon />}
                                                    href={responseData.merged_5g_download_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ width: "fit-content" }}
                                                >
                                                    Download Merged 5G Report
                                                </Button>
                                            )}

                                            {responseData.zip_download_link && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<FileDownloadIcon />}
                                                    href={responseData.zip_download_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ width: "fit-content" }}
                                                >
                                                    Download ZIP Archive
                                                </Button>
                                            )}

                                            {/* Render individual circle links if returned in results array */}
                                            {Array.isArray(responseData.results) && responseData.results.map((resItem, rIdx) => (
                                                <Box key={rIdx} sx={{ p: 1, bgcolor: "#f8fafc", borderRadius: 1, border: "1px solid #e2e8f0", mt: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#334155" }}>
                                                        Circle: {resItem.circle}
                                                    </Typography>
                                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: "wrap" }}>
                                                        {resItem["4g_download_link"] && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<FileDownloadIcon />}
                                                                href={resItem["4g_download_link"]}
                                                                target="_blank"
                                                            >
                                                                4G Report
                                                            </Button>
                                                        )}
                                                        {resItem["5g_download_link"] && (
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<FileDownloadIcon />}
                                                                href={resItem["5g_download_link"]}
                                                                target="_blank"
                                                            >
                                                                5G Report
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            ))}
                                        </Stack>

                                        <Box component="details" sx={{ mt: 2 }}>
                                            <summary style={{ cursor: "pointer", fontSize: 13, color: "#64748b" }}>
                                                Raw response
                                            </summary>
                                            <Box
                                                component="pre"
                                                sx={{
                                                    p: 1.5,
                                                    mt: 1,
                                                    mb: 0,
                                                    bgcolor: "#f5f5f5",
                                                    borderRadius: 1,
                                                    maxHeight: 200,
                                                    overflow: "auto",
                                                    fontSize: 12,
                                                }}
                                            >
                                                {JSON.stringify(responseData, null, 2)}
                                            </Box>
                                        </Box>
                                    </Alert>
                                );
                            })}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResults(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {loading}
        </>
    );
};

export const MemoEricsson = React.memo(Ericsson);
export default Ericsson;