// import React, { useState, useEffect } from "react";
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
//     Breadcrumbs,
//     Link,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     CircularProgress,
//     Divider,
//     Tooltip,
//     Tabs,
//     Tab,
// } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import Slide from "@mui/material/Slide";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import Swal from "sweetalert2";
// import { postData } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import InfoIcon from "@mui/icons-material/Info";
// import WarningIcon from "@mui/icons-material/Warning";
// import ErrorIcon from "@mui/icons-material/Error";
// import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
// import NetworkCellIcon from "@mui/icons-material/NetworkCell";
// import StorageIcon from "@mui/icons-material/Storage";
// import PublicIcon from "@mui/icons-material/Public";

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

// /* ================================================================ */
// /*  Result Card Component                                           */
// /* ================================================================ */
// const ResultCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
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
//                         fontSize: "16px",
//                         fontWeight: 700,
//                         color: color,
//                         wordBreak: "break-word",
//                     }}
//                     title={value}
//                 >
//                     {value}
//                 </Typography>
//             </CardContent>
//         </Card>
//     );
// };

// /* ================================================================ */
// /*  IP Configuration Type Card with 1 dropdown                      */
// /* ================================================================ */
// const IPConfigCard = ({ title, icon: Icon, dropdown1, onChange, color }) => {
//     return (
//         <Card
//             sx={{
//                 background: "#fff",
//                 border: `1px solid ${COLORS.borderColor}`,
//                 borderRadius: 2,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 transition: "all 0.3s ease",
//                 overflow: "hidden",
//                 "&:hover": {
//                     boxShadow: "0 8px 24px rgba(0,107,106,0.12)",
//                     transform: "translateY(-2px)",
//                 },
//             }}
//         >
//             {/* Header with icon and title */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1.5,
//                     p: 2,
//                     background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
//                     borderBottom: `2px solid ${color}40`,
//                 }}
//             >
//                 <Box
//                     sx={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: "10px",
//                         background: `${color}25`,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <Icon sx={{ color: color, fontSize: 22 }} />
//                 </Box>
//                 <Box>
//                     <Typography sx={{ fontWeight: 700, color: color, fontSize: "14px" }}>
//                         {title}
//                     </Typography>
//                     <Typography sx={{ fontSize: "11px", color: "#666" }}>
//                         Select configuration
//                     </Typography>
//                 </Box>
//             </Box>

//             {/* Dropdown */}
//             <CardContent sx={{ p: 2 }}>
//                 <FormControl size="small" fullWidth variant="outlined">
//                     <InputLabel>Select Mode</InputLabel>
//                     <Select
//                         label="Select Mode"
//                         value={dropdown1}
//                         onChange={(e) => onChange("dropdown1", e.target.value)}
//                         sx={{
//                             borderRadius: 1,
//                             "& .MuiOutlinedInput-root": {
//                                 "& fieldset": { borderColor: COLORS.borderColor },
//                                 "&:hover fieldset": { borderColor: color },
//                                 "&.Mui-focused fieldset": { borderColor: color },
//                             },
//                         }}
//                     >
//                         <MenuItem value="">Select...</MenuItem>
//                         <MenuItem value="1-SECTOR-4TR">1-SECTOR-4TR</MenuItem>
//                         <MenuItem value="2-SECTOR-4TR">2-SECTOR-4TR</MenuItem>
//                         <MenuItem value="3-SECTOR-4TR">3-SECTOR-4TR</MenuItem>
//                     </Select>
//                 </FormControl>
//             </CardContent>
//         </Card>
//     );
// };

// /* ================================================================ */
// /*  Upload Result Display Component                                 */
// /* ================================================================ */
// const ScriptingToolResult = ({ data, onDownload }) => {
//     if (!data) return null;

//     const { status, message, download_url } = data;
//     const downloadUrls = Array.isArray(download_url) ? download_url : (download_url ? [download_url] : []);

//     const fileNameFromUrl = (url) => {
//         try {
//             return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
//         } catch {
//             return url;
//         }
//     };

//     const handleDownloadAll = () => {
//         downloadUrls.forEach((url) => {
//             onDownload(url);
//         });
//     };

//     return (
//         <Box
//             sx={{
//                 mt: 3,
//                 p: 2.5,
//                 background: COLORS.lightBg,
//                 borderRadius: 2,
//                 border: `1px solid ${COLORS.borderColor}`,
//             }}
//         >
//             {status && (
//                 <Alert
//                     icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
//                     severity="success"
//                     sx={{
//                         background: `${COLORS.success}15`,
//                         border: `1px solid ${COLORS.success}`,
//                         color: COLORS.success,
//                         fontWeight: 600,
//                         fontSize: "13px",
//                         mb: 2.5,
//                         py: 1.2,
//                         px: 1.5,
//                     }}
//                 >
//                     ✓ {message}
//                 </Alert>
//             )}

//             {!status && (
//                 <Alert
//                     icon={<ErrorIcon sx={{ fontSize: "18px" }} />}
//                     severity="error"
//                     sx={{
//                         background: `${COLORS.error}15`,
//                         border: `1px solid ${COLORS.error}`,
//                         color: COLORS.error,
//                         fontWeight: 600,
//                         fontSize: "13px",
//                         mb: 2.5,
//                         py: 1.2,
//                         px: 1.5,
//                     }}
//                 >
//                     ✗ {message}
//                 </Alert>
//             )}

//             <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
//                 <Grid item xs={12} sm={6}>
//                     <ResultCard
//                         title="Status"
//                         value={status ? "Success" : "Failed"}
//                         icon={status ? CheckCircleIcon : ErrorIcon}
//                         color={status ? COLORS.success : COLORS.error}
//                     />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                     <ResultCard
//                         title="Message"
//                         value={message}
//                         icon={InfoIcon}
//                         color={COLORS.info}
//                     />
//                 </Grid>
//             </Grid>

//             {status && downloadUrls.length > 0 && (
//                 <Box
//                     sx={{
//                         mt: 2.5,
//                         p: 2,
//                         background: "#fff",
//                         border: `1px solid ${COLORS.borderColor}`,
//                         borderRadius: 2,
//                     }}
//                 >
//                     {downloadUrls.length > 1 && (
//                         <Box sx={{ mb: 2 }}>
//                             <Button
//                                 variant="contained"
//                                 startIcon={<DownloadForOfflineIcon sx={{ fontSize: "18px" }} />}
//                                 onClick={handleDownloadAll}
//                                 sx={{
//                                     background: COLORS.primary,
//                                     color: "#fff",
//                                     fontWeight: 700,
//                                     textTransform: "none",
//                                     fontSize: "13px",
//                                     px: 2.5,
//                                     py: 1,
//                                     borderRadius: 1,
//                                     "&:hover": { background: COLORS.primaryDark }
//                                 }}
//                             >
//                                 Download All Files ({downloadUrls.length})
//                             </Button>
//                         </Box>
//                     )}

//                     <Stack spacing={1}>
//                         {downloadUrls.map((url, idx) => (
//                             <Box
//                                 key={idx}
//                                 sx={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "space-between",
//                                     gap: 2,
//                                     p: 1.5,
//                                     background: COLORS.lightBg,
//                                     borderRadius: 1,
//                                     border: `1px solid ${COLORS.borderColor}`,
//                                 }}
//                             >
//                                 <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//                                     <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
//                                     <Box>
//                                         <Typography
//                                             variant="subtitle2"
//                                             sx={{ fontWeight: 700, color: COLORS.primary, fontSize: "13px" }}
//                                         >
//                                             Generated File {downloadUrls.length > 1 ? `${idx + 1}` : ""}
//                                         </Typography>
//                                         <Typography variant="caption" sx={{ color: "#666", fontSize: "11px" }}>
//                                             {fileNameFromUrl(url)}
//                                         </Typography>
//                                     </Box>
//                                 </Box>
//                                 <Tooltip title="Download file">
//                                     <Button
//                                         variant="contained"
//                                         size="small"
//                                         startIcon={<FileDownloadIcon />}
//                                         onClick={() => onDownload(url)}
//                                         sx={{
//                                             background: COLORS.headerGradient,
//                                             color: "#fff",
//                                             fontWeight: 700,
//                                             textTransform: "none",
//                                             whiteSpace: "nowrap",
//                                             "&:hover": {
//                                                 background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
//                                             },
//                                         }}
//                                     >
//                                         Download
//                                     </Button>
//                                 </Tooltip>
//                             </Box>
//                         ))}
//                     </Stack>
//                 </Box>
//             )}
//         </Box>
//     );
// };

// /* ================================================================ */
// /*  Main ASIM Component - ADVANCED VERSION                          */
// /* ================================================================ */
// const ASIM = () => {
//     const navigate = useNavigate();
//     const { loading, action } = useLoadingDialog();
//     const classes = OverAllCss();

//     // STATE MANAGEMENT
//     const [btsType, setBtsType] = useState("");
//     const [excelFiles, setExcelFiles] = useState([]);
//     const [uploadSuccess, setUploadSuccess] = useState(false);
//     const [uploadResultData, setUploadResultData] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);

//     // IP Configuration states - Single dropdown per config
//     const [ipConfigs, setIpConfigs] = useState({
//         allIPV4: "",
//         ipv4_2gipv6: "",
//         ipv6_2gipv6: "",
//         ipv6_2gipv4: "",
//     });

//     // Options
//     const BTS_TYPE_OPTIONS = ["ACOC", "AMOE"];
//     const SECTOR_OPTIONS = ['1-SECTOR-4TR', '2-SECTOR-4TR', '3-SECTOR-4TR'];

//     // ======== IP CONFIG CHANGE HANDLER ========
//     const handleIPConfigChange = (configType, dropdownName, value) => {
//         setIpConfigs(prev => ({
//             ...prev,
//             [configType]: value
//         }));
//     };

//     // ======== EXCEL FILE HANDLER ========
//     const handleExcelFileChange = (event) => {
//         const files = Array.from(event.target.files || []);

//         if (files.length === 0) {
//             return;
//         }

//         const invalidFiles = files.filter((file) => {
//             const fileName = file.name.toLowerCase();
//             return !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls");
//         });

//         if (invalidFiles.length > 0) {
//             Swal.fire({
//                 icon: "error",
//                 title: "Invalid File",
//                 text: "Please select only valid Excel files (.xlsx or .xls)",
//             });

//             event.target.value = "";
//             return;
//         }

//         setExcelFiles(files);
//     };

//     // ======== SUBMIT HANDLER ========
//     const handleSubmit = async () => {
//         // VALIDATION
//         if (!btsType) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required",
//                 text: "Please select BTS Type",
//             });
//             return;
//         }

//         try {
//             setIsProcessing(true);
//             action(true);

//             const formData = new FormData();

//             // Append BTS Type
//             formData.append("bts_type", btsType);

//             // Append IP configurations
//             formData.append("ip_configs", JSON.stringify(ipConfigs));

//             // Append Excel files if they exist
//             if (excelFiles.length > 0) {
//                 excelFiles.forEach((file) => {
//                     formData.append("excel_file", file);
//                 });
//             }

//             // Submit to API
//             const response = await postData("ntscrpting_mum/nt/", formData);

//             if (response && response.status) {
//                 setUploadSuccess(true);
//                 setUploadResultData(response);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: response.message || "Configuration created successfully",
//                 });

//                 setBtsType("");
//                 setExcelFiles([]);
//                 setIpConfigs({
//                     allIPV4: "",
//                     ipv4_2gipv6: "",
//                     ipv6_2gipv6: "",
//                     ipv6_2gipv4: "",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to create configuration",
//                 });
//                 setUploadResultData(response);
//             }
//         } catch (error) {
//             console.error("Submit error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: error.message || "Failed to process request",
//             });
//         } finally {
//             action(false);
//             setIsProcessing(false);
//         }
//     };

//     // ======== CANCEL HANDLER ========
//     const handleCancel = () => {
//         setBtsType("");
//         setExcelFiles([]);
//         setUploadSuccess(false);
//         setUploadResultData(null);
//         setIpConfigs({
//             allIPV4: "",
//             ipv4_2gipv6: "",
//             ipv6_2gipv6: "",
//             ipv6_2gipv4: "",
//         });
//     };

//     // ======== DOWNLOAD HANDLER ========
//     const downloadFile = (downloadUrl) => {
//         try {
//             const link = document.createElement("a");
//             link.href = downloadUrl;
//             link.setAttribute("download", "");
//             link.style.display = "none";
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             Swal.fire({
//                 icon: "success",
//                 title: "Downloaded",
//                 text: "File downloaded successfully",
//             });
//         } catch (error) {
//             console.error("Download error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Download Failed",
//                 text: "Failed to download file",
//             });
//         }
//     };

//     useEffect(() => {
//         document.title = "NT Scripting Tool";
//     }, []);

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     itemsBeforeCollapse={2}
//                     maxItems={4}
//                     separator={<KeyboardArrowRightIcon fontSize="small" />}
//                 >
//                     <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
//                     <Link underline='hover' onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
//                     <Typography color='text.primary'>IX VI Scripting</Typography>
//                 </Breadcrumbs>
//             </div>

//             <Slide direction="left" in={true} timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "85%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>🛰️ NT Scripting Tool</Box>

//                             <Stack spacing={3} sx={{ marginTop: "10px" }} direction="column">

//                                 {/* ✅ SELECT BTS TYPE */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         📡 Select BTS Type
//                                     </div>
//                                     <Box sx={{ p: 2 }}>
//                                         <FormControl size="small" fullWidth>
//                                             <InputLabel id="bts-type-label">BTS Type</InputLabel>
//                                             <Select
//                                                 labelId="bts-type-label"
//                                                 label="BTS Type"
//                                                 value={btsType}
//                                                 onChange={(e) => setBtsType(e.target.value)}
//                                                 sx={{
//                                                     borderRadius: 1.5,
//                                                     "& .MuiOutlinedInput-root": {
//                                                         "& fieldset": { borderColor: COLORS.borderColor },
//                                                         "&:hover fieldset": { borderColor: COLORS.primary },
//                                                         "&.Mui-focused fieldset": { borderColor: COLORS.primary },
//                                                     },
//                                                 }}
//                                             >
//                                                 <MenuItem value="">
//                                                     <em>Select BTS Type</em>
//                                                 </MenuItem>
//                                                 {BTS_TYPE_OPTIONS.map((option) => (
//                                                     <MenuItem key={option} value={option}>
//                                                         {option}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                         {btsType && (
//                                             <Box sx={{ mt: 1.5, p: 1, bgcolor: "#e3f2f2", borderRadius: 1, border: `1px solid ${COLORS.borderColor}` }}>
//                                                 <Typography variant="caption" sx={{ color: COLORS.primary, fontWeight: 700 }}>
//                                                     ✓ Selected: <span style={{ fontSize: "14px" }}>{btsType}</span>
//                                                 </Typography>
//                                             </Box>
//                                         )}
//                                     </Box>
//                                 </Box>

//                                 <Divider sx={{ my: 1 }} />

//                                 {/* ✅ IP CONFIGURATIONS SECTION */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         🌐 IP Configuration Types
//                                     </div>
//                                     <Box sx={{ p: 2 }}>
//                                         <Grid container spacing={2}>
//                                             {/* ALL IPV4 */}
//                                             <Grid item xs={12} sm={6}>
//                                                 <IPConfigCard
//                                                     title="ALL IPV4"
//                                                     icon={PublicIcon}
//                                                     color="#2196f3"
//                                                     dropdown1={ipConfigs.allIPV4}
//                                                     onChange={(dropdownName, value) => handleIPConfigChange("allIPV4", dropdownName, value)}
//                                                 />
//                                             </Grid>

//                                             {/* 4GIPV4+2GIPV6 */}
//                                             <Grid item xs={12} sm={6}>
//                                                 <IPConfigCard
//                                                     title="4GIPV4 + 2GIPV6"
//                                                     icon={NetworkCellIcon}
//                                                     color="#ff9800"
//                                                     dropdown1={ipConfigs.ipv4_2gipv6}
//                                                     onChange={(dropdownName, value) => handleIPConfigChange("ipv4_2gipv6", dropdownName, value)}
//                                                 />
//                                             </Grid>

//                                             {/* 4GIPV6+2GIPV6 */}
//                                             <Grid item xs={12} sm={6}>
//                                                 <IPConfigCard
//                                                     title="4GIPV6 + 2GIPV6"
//                                                     icon={StorageIcon}
//                                                     color="#4caf50"
//                                                     dropdown1={ipConfigs.ipv6_2gipv6}
//                                                     onChange={(dropdownName, value) => handleIPConfigChange("ipv6_2gipv6", dropdownName, value)}
//                                                 />
//                                             </Grid>

//                                             {/* 4GIPV6+2GIPV4 */}
//                                             <Grid item xs={12} sm={6}>
//                                                 <IPConfigCard
//                                                     title="4GIPV6 + 2GIPV4"
//                                                     icon={PublicIcon}
//                                                     color="#f44336"
//                                                     dropdown1={ipConfigs.ipv6_2gipv4}
//                                                     onChange={(dropdownName, value) => handleIPConfigChange("ipv6_2gipv4", dropdownName, value)}
//                                                 />
//                                             </Grid>
//                                         </Grid>
//                                     </Box>
//                                 </Box>

//                                 {/* ✅ EXCEL FILE UPLOAD */}
//                                 <Box className={classes.Front_Box}>
//                                     <div className={classes.Front_Box_Hading}>
//                                         📎 Select Excel File:
//                                     </div>

//                                     <div className={classes.Front_Box_Select_Button}>
//                                         <div style={{ float: "left" }}>
//                                             <Button
//                                                 variant="contained"
//                                                 component="label"
//                                                 color={excelFiles.length > 0 ? "warning" : "primary"}
//                                                 startIcon={<UploadIcon />}
//                                                 sx={{ fontWeight: 700, textTransform: "none" }}
//                                             >
//                                                 {excelFiles.length > 0
//                                                     ? "Change Excel Files"
//                                                     : "Select Excel Files"}

//                                                 <input
//                                                     hidden
//                                                     multiple
//                                                     accept=".xlsx,.xls,.xlsb"
//                                                     type="file"
//                                                     onChange={handleExcelFileChange}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         {excelFiles.length > 0 && (
//                                             <span
//                                                 style={{
//                                                     color: "green",
//                                                     fontSize: "14px",
//                                                     fontWeight: 600,
//                                                     marginLeft: "12px",
//                                                 }}
//                                             >
//                                                 ✓ {excelFiles.length} Excel file
//                                                 {excelFiles.length > 1 ? "s" : ""} selected
//                                             </span>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* ✅ ACTION BUTTONS */}
//                                 <Stack
//                                     direction={{ xs: "column", sm: "row" }}
//                                     spacing={2}
//                                     sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
//                                 >
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         onClick={handleSubmit}
//                                         endIcon={<UploadIcon />}
//                                         disabled={isProcessing || !btsType}
//                                         sx={{
//                                             minWidth: "140px",
//                                             fontWeight: 700,
//                                             textTransform: "none",
//                                             fontSize: "14px",
//                                             py: 1.2,
//                                         }}
//                                     >
//                                         {isProcessing ? (
//                                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                                                 <CircularProgress size={18} sx={{ color: "#fff" }} />
//                                                 <span>Processing...</span>
//                                             </Box>
//                                         ) : (
//                                             "✓ Submit"
//                                         )}
//                                     </Button>

//                                     <Button
//                                         variant="contained"
//                                         onClick={handleCancel}
//                                         style={{ backgroundColor: COLORS.error, color: "white" }}
//                                         endIcon={<DoDisturbIcon />}
//                                         disabled={isProcessing}
//                                         sx={{
//                                             minWidth: "140px",
//                                             fontWeight: 700,
//                                             textTransform: "none",
//                                             fontSize: "14px",
//                                             py: 1.2,
//                                         }}
//                                     >
//                                         ✗ Cancel
//                                     </Button>
//                                 </Stack>

//                                 {/* ✅ RESULT DISPLAY */}
//                                 {uploadSuccess && (
//                                     <ScriptingToolResult data={uploadResultData} onDownload={downloadFile} />
//                                 )}
//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// export default ASIM;

import React, { useState, useEffect } from "react";
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
    Breadcrumbs,
    Link,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider,
    Tooltip,
    Tabs,
    Tab,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import NetworkCellIcon from "@mui/icons-material/NetworkCell";
import StorageIcon from "@mui/icons-material/Storage";
import PublicIcon from "@mui/icons-material/Public";

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

/* ================================================================ */
/*  Result Card Component                                           */
/* ================================================================ */
const ResultCard = ({ title, value, icon: Icon, color = COLORS.primary }) => {
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
                        fontSize: "16px",
                        fontWeight: 700,
                        color: color,
                        wordBreak: "break-word",
                    }}
                    title={value}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  IP Configuration Type Card with 1 dropdown                      */
/* ================================================================ */
const IPConfigCard = ({ title, icon: Icon, dropdown1, onChange, color }) => {
    return (
        <Card
            sx={{
                background: "#fff",
                border: `1px solid ${COLORS.borderColor}`,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                overflow: "hidden",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,107,106,0.12)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            {/* Header with icon and title */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                    borderBottom: `2px solid ${color}40`,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        background: `${color}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Icon sx={{ color: color, fontSize: 22 }} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, color: color, fontSize: "14px" }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "#666" }}>
                        Select configuration
                    </Typography>
                </Box>
            </Box>

            {/* Dropdown */}
            <CardContent sx={{ p: 2 }}>
                <FormControl size="small" fullWidth variant="outlined">
                    <InputLabel>Select Mode</InputLabel>
                    <Select
                        label="Select Mode"
                        value={dropdown1}
                        onChange={(e) => onChange("dropdown1", e.target.value)}
                        sx={{
                            borderRadius: 1,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: COLORS.borderColor },
                                "&:hover fieldset": { borderColor: color },
                                "&.Mui-focused fieldset": { borderColor: color },
                            },
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="1-SECTOR-4TR">1-SECTOR-4TR</MenuItem>
                        <MenuItem value="2-SECTOR-4TR">2-SECTOR-4TR</MenuItem>
                        <MenuItem value="3-SECTOR-4TR">3-SECTOR-4TR</MenuItem>
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
};

/* ================================================================ */
/*  Upload Result Display Component                                 */
/* ================================================================ */
const ScriptingToolResult = ({ data, onDownload }) => {
    if (!data) return null;

    const { status, message, download_url } = data;
    const downloadUrls = Array.isArray(download_url) ? download_url : (download_url ? [download_url] : []);

    const fileNameFromUrl = (url) => {
        try {
            return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
        } catch {
            return url;
        }
    };

    const handleDownloadAll = () => {
        downloadUrls.forEach((url) => {
            onDownload(url);
        });
    };

    return (
        <Box
            sx={{
                mt: 3,
                p: 2.5,
                background: COLORS.lightBg,
                borderRadius: 2,
                border: `1px solid ${COLORS.borderColor}`,
            }}
        >
            {status && (
                <Alert
                    icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
                    severity="success"
                    sx={{
                        background: `${COLORS.success}15`,
                        border: `1px solid ${COLORS.success}`,
                        color: COLORS.success,
                        fontWeight: 600,
                        fontSize: "13px",
                        mb: 2.5,
                        py: 1.2,
                        px: 1.5,
                    }}
                >
                    ✓ {message}
                </Alert>
            )}

            {!status && (
                <Alert
                    icon={<ErrorIcon sx={{ fontSize: "18px" }} />}
                    severity="error"
                    sx={{
                        background: `${COLORS.error}15`,
                        border: `1px solid ${COLORS.error}`,
                        color: COLORS.error,
                        fontWeight: 600,
                        fontSize: "13px",
                        mb: 2.5,
                        py: 1.2,
                        px: 1.5,
                    }}
                >
                    ✗ {message}
                </Alert>
            )}

            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6}>
                    <ResultCard
                        title="Status"
                        value={status ? "Success" : "Failed"}
                        icon={status ? CheckCircleIcon : ErrorIcon}
                        color={status ? COLORS.success : COLORS.error}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <ResultCard
                        title="Message"
                        value={message}
                        icon={InfoIcon}
                        color={COLORS.info}
                    />
                </Grid>
            </Grid>

            {status && downloadUrls.length > 0 && (
                <Box
                    sx={{
                        mt: 2.5,
                        p: 2,
                        background: "#fff",
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: 2,
                    }}
                >
                    {downloadUrls.length > 1 && (
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<DownloadForOfflineIcon sx={{ fontSize: "18px" }} />}
                                onClick={handleDownloadAll}
                                sx={{
                                    background: COLORS.primary,
                                    color: "#fff",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "13px",
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 1,
                                    "&:hover": { background: COLORS.primaryDark }
                                }}
                            >
                                Download All Files ({downloadUrls.length})
                            </Button>
                        </Box>
                    )}

                    <Stack spacing={1}>
                        {downloadUrls.map((url, idx) => (
                            <Box
                                key={idx}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    p: 1.5,
                                    background: COLORS.lightBg,
                                    borderRadius: 1,
                                    border: `1px solid ${COLORS.borderColor}`,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: 700, color: COLORS.primary, fontSize: "13px" }}
                                        >
                                            Generated File {downloadUrls.length > 1 ? `${idx + 1}` : ""}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "#666", fontSize: "11px" }}>
                                            {fileNameFromUrl(url)}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Tooltip title="Download file">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<FileDownloadIcon />}
                                        onClick={() => onDownload(url)}
                                        sx={{
                                            background: COLORS.headerGradient,
                                            color: "#fff",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            whiteSpace: "nowrap",
                                            "&:hover": {
                                                background: "linear-gradient(90deg, #003a3e 0%, #005555 55%, #3a8b91 100%)",
                                            },
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Tooltip>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

/* ================================================================ */
/*  Main ASIM Component - ADVANCED VERSION                          */
/* ================================================================ */
const ASIM = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    // STATE MANAGEMENT
    const [btsType, setBtsType] = useState("");
    const [excelFiles, setExcelFiles] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // IP Configuration states - Single dropdown per config
    const [ipConfigs, setIpConfigs] = useState({
        allIPV4: "",
        ipv4_2gipv6: "",
        ipv6_2gipv6: "",
        ipv6_2gipv4: "",
    });

    // Options
    const BTS_TYPE_OPTIONS = ["ACOC", "AMOE"];
    const SECTOR_OPTIONS = ['1-SECTOR-4TR', '2-SECTOR-4TR', '3-SECTOR-4TR'];

    // ======== IP CONFIG CHANGE HANDLER ========
    const handleIPConfigChange = (configType, dropdownName, value) => {
        setIpConfigs(prev => ({
            ...prev,
            [configType]: value
        }));
    };

    // ======== EXCEL FILE HANDLER ========
    const handleExcelFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        const invalidFiles = files.filter((file) => {
            const fileName = file.name.toLowerCase();
            return !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls");
        });

        if (invalidFiles.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please select only valid Excel files (.xlsx or .xls)",
            });

            event.target.value = "";
            return;
        }

        setExcelFiles(files);
    };

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        // VALIDATION - BTS Type is mandatory
        if (!btsType) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please select BTS Type",
            });
            return;
        }

        // VALIDATION - 4GIPV6+2GIPV6 configuration is mandatory for now
        if (!ipConfigs.ipv6_2gipv6) {
            Swal.fire({
                icon: "warning",
                title: "Required",
                text: "Please select Mode for 4GIPV6 + 2GIPV6 configuration",
            });
            return;
        }

        try {
            setIsProcessing(true);
            action(true);

            const formData = new FormData();

            // Append BTS Type with key "bts_type"
            formData.append("bts_type", btsType);

            // Append MIMO (for 4GIPV6+2GIPV6) with key "mimo"
            formData.append("mimo", ipConfigs.ipv6_2gipv6);

            // Append Excel files if they exist
            if (excelFiles.length > 0) {
                excelFiles.forEach((file) => {
                    formData.append("excel_file", file);
                });
            }

            // Submit to API for 4GIPV6+2GIPV6
            const response = await postData("bharti_scripting_upe/asim4g_2gipv6/", formData);

            if (response && response.status) {
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Configuration created successfully",
                });

                // Reset form
                setBtsType("");
                setExcelFiles([]);
                setIpConfigs({
                    allIPV4: "",
                    ipv4_2gipv6: "",
                    ipv6_2gipv6: "",
                    ipv6_2gipv4: "",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to create configuration",
                });
                setUploadResultData(response);
            }
        } catch (error) {
            console.error("Submit error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to process request",
            });
        } finally {
            action(false);
            setIsProcessing(false);
        }
    };

    // ======== CANCEL HANDLER ========
    const handleCancel = () => {
        setBtsType("");
        setExcelFiles([]);
        setUploadSuccess(false);
        setUploadResultData(null);
        setIpConfigs({
            allIPV4: "",
            ipv4_2gipv6: "",
            ipv6_2gipv6: "",
            ipv6_2gipv4: "",
        });
    };

    // ======== DOWNLOAD HANDLER ========
    const downloadFile = (downloadUrl) => {
        try {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "Downloaded",
                text: "File downloaded successfully",
            });
        } catch (error) {
            console.error("Download error:", error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Failed to download file",
            });
        }
    };

    useEffect(() => {
        document.title = "NT Scripting Tool";
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={4}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline='hover' onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Typography color='text.primary'>IX VI Scripting</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "85%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>🛰️ NT Scripting Tool</Box>

                            <Stack spacing={3} sx={{ marginTop: "10px" }} direction="column">

                                {/* ✅ SELECT BTS TYPE */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        📡 Select BTS Type
                                    </div>
                                    <Box sx={{ p: 2 }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="bts-type-label">BTS Type</InputLabel>
                                            <Select
                                                labelId="bts-type-label"
                                                label="BTS Type"
                                                value={btsType}
                                                onChange={(e) => setBtsType(e.target.value)}
                                                sx={{
                                                    borderRadius: 1.5,
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: COLORS.borderColor },
                                                        "&:hover fieldset": { borderColor: COLORS.primary },
                                                        "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">
                                                    <em>Select BTS Type</em>
                                                </MenuItem>
                                                {BTS_TYPE_OPTIONS.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        {btsType && (
                                            <Box sx={{ mt: 1.5, p: 1, bgcolor: "#e3f2f2", borderRadius: 1, border: `1px solid ${COLORS.borderColor}` }}>
                                                <Typography variant="caption" sx={{ color: COLORS.primary, fontWeight: 700 }}>
                                                    ✓ Selected: <span style={{ fontSize: "14px" }}>{btsType}</span>
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* ✅ IP CONFIGURATIONS SECTION */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        🌐 IP Configuration Types
                                    </div>
                                    <Box sx={{ p: 2 }}>
                                        <Grid container spacing={2}>
                                            {/* ALL IPV4 - OPTIONAL (Future) */}
                                            <Grid item xs={12} sm={6} sx={{ opacity: 0.5, pointerEvents: "none" }}>
                                                <Box sx={{ position: "relative" }}>
                                                    <IPConfigCard
                                                        title="ALL IPV4"
                                                        icon={PublicIcon}
                                                        color="#2196f3"
                                                        dropdown1={ipConfigs.allIPV4}
                                                        onChange={(dropdownName, value) => handleIPConfigChange("allIPV4", dropdownName, value)}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: "#ffc107",
                                                            color: "#333",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: "10px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Coming Soon
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* 4GIPV4+2GIPV6 - OPTIONAL (Future) */}
                                            <Grid item xs={12} sm={6} sx={{ opacity: 0.5, pointerEvents: "none" }}>
                                                <Box sx={{ position: "relative" }}>
                                                    <IPConfigCard
                                                        title="4GIPV4 + 2GIPV6"
                                                        icon={NetworkCellIcon}
                                                        color="#ff9800"
                                                        dropdown1={ipConfigs.ipv4_2gipv6}
                                                        onChange={(dropdownName, value) => handleIPConfigChange("ipv4_2gipv6", dropdownName, value)}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: "#ffc107",
                                                            color: "#333",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: "10px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Coming Soon
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* 4GIPV6+2GIPV6 - ACTIVE NOW ⭐ */}
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ position: "relative" }}>
                                                    <IPConfigCard
                                                        title="4GIPV6 + 2GIPV6 ⭐ ACTIVE"
                                                        icon={StorageIcon}
                                                        color="#4caf50"
                                                        dropdown1={ipConfigs.ipv6_2gipv6}
                                                        onChange={(dropdownName, value) => handleIPConfigChange("ipv6_2gipv6", dropdownName, value)}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: "#28a745",
                                                            color: "#fff",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: "10px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Active Now
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* 4GIPV6+2GIPV4 - OPTIONAL (Future) */}
                                            <Grid item xs={12} sm={6} sx={{ opacity: 0.5, pointerEvents: "none" }}>
                                                <Box sx={{ position: "relative" }}>
                                                    <IPConfigCard
                                                        title="4GIPV6 + 2GIPV4"
                                                        icon={PublicIcon}
                                                        color="#f44336"
                                                        dropdown1={ipConfigs.ipv6_2gipv4}
                                                        onChange={(dropdownName, value) => handleIPConfigChange("ipv6_2gipv4", dropdownName, value)}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: "#ffc107",
                                                            color: "#333",
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontSize: "10px",
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        Coming Soon
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>

                                {/* ✅ EXCEL FILE UPLOAD */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        📎 Select Excel File (Optional)
                                    </div>

                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={excelFiles.length > 0 ? "warning" : "primary"}
                                                startIcon={<UploadIcon />}
                                                sx={{ fontWeight: 700, textTransform: "none" }}
                                            >
                                                {excelFiles.length > 0
                                                    ? "Change Excel Files"
                                                    : "Select Excel Files"}

                                                <input
                                                    hidden
                                                    multiple
                                                    accept=".xlsx,.xls,.xlsb"
                                                    type="file"
                                                    onChange={handleExcelFileChange}
                                                />
                                            </Button>
                                        </div>

                                        {excelFiles.length > 0 && (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                ✓ {excelFiles.length} Excel file
                                                {excelFiles.length > 1 ? "s" : ""} selected
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* ✅ ACTION BUTTONS */}
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        endIcon={<UploadIcon />}
                                        disabled={isProcessing || !btsType || !ipConfigs.ipv6_2gipv6}
                                        title={!btsType ? "Please select BTS Type" : !ipConfigs.ipv6_2gipv6 ? "Please select Mode for 4GIPV6 + 2GIPV6" : ""}
                                        sx={{
                                            minWidth: "140px",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            fontSize: "14px",
                                            py: 1.2,
                                        }}
                                    >
                                        {isProcessing ? (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <CircularProgress size={18} sx={{ color: "#fff" }} />
                                                <span>Processing...</span>
                                            </Box>
                                        ) : (
                                            "✓ Submit"
                                        )}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleCancel}
                                        style={{ backgroundColor: COLORS.error, color: "white" }}
                                        endIcon={<DoDisturbIcon />}
                                        disabled={isProcessing}
                                        sx={{
                                            minWidth: "140px",
                                            fontWeight: 700,
                                            textTransform: "none",
                                            fontSize: "14px",
                                            py: 1.2,
                                        }}
                                    >
                                        ✗ Cancel
                                    </Button>
                                </Stack>

                                {/* ✅ RESULT DISPLAY */}
                                {uploadSuccess && (
                                    <ScriptingToolResult data={uploadResultData} onDownload={downloadFile} />
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default ASIM;