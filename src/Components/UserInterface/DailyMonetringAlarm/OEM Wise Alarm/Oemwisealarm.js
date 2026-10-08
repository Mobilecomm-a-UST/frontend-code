// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   Box,
//   Button,
//   Stack,
//   Card,
//   CardContent,
//   Chip,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputLabel,
//   FormControl,
//   Select,
//   MenuItem,
//   Alert,
//   CircularProgress,
// } from "@mui/material";
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
// import { useNavigate } from "react-router-dom";
// import Slide from "@mui/material/Slide";
// import UploadIcon from "@mui/icons-material/Upload";
// import DoDisturbIcon from "@mui/icons-material/DoDisturb";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import HistoryIcon from "@mui/icons-material/History";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import Swal from "sweetalert2";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
// import dayjs from "dayjs";

// // Base URL
// const BASE_URL = "https://commtoolapi.mcpspmis.com";

// // All circles for Ericsson
// const CIRCLES = [
//   "AP",
//   "CH",
//   "KK",
//   "DL",
//   "HR",
//   "RJ",
//   "JK",
//   "WB",
//   "OD",
//   "MU",
//   "TNCH",
//   "UE",
//   "BH",
//   "UW",
//   "MP",
//   "NESA",
//   "PB",
//   "KO",
//   "JH",
// ];

// /**
//  * OEM Configuration with Actual API Endpoints
//  */
// const OEM_CONFIG = {
//   ZTE: {
//     label: "ZTE",
//     color: "#006e74",
//     backgroundColor: "#b2dfdb",
//     icon: "🔵",
//     showAlarmFile: false,
//     showMappingFile: true,
//     showCircleSelect: false,
//     endpoints: {
//       mapping_file: `${BASE_URL}/oem_zte/mapping_file/`,
//       saNSA: `${BASE_URL}/oem_zte/SA_NSA/`,
//       zte: `${BASE_URL}/oem_zte/zte/`,
//       oldVsNew: `${BASE_URL}/oem_zte/old_vs_new/`,
//     },
//     fieldNames: {
//       alarm: "zte_MS2",
//       mapping: "zte_MS2",
//     },
//   },

//   Huawei: {
//     label: "Huawei",
//     color: "#d32f2f",
//     backgroundColor: "#ffcdd2",
//     icon: "🔴",
//     showAlarmFile: true,
//     showMappingFile: true,
//     showCircleSelect: false,
//     endpoints: {
//       alarm_file: `${BASE_URL}/oem_huawei/Huawei/`,
//       saNSA: `${BASE_URL}/oem_huawei/SA_NSA/`,
//       uploadSite: `${BASE_URL}/oem_huawei/upload_site/`,
//       deleteSite: `${BASE_URL}/oem_huawei/delete_site/`,
//       getSite: `${BASE_URL}/oem_huawei/get_site/`,
//     },
//     fieldNames: {
//       alarm: "Huawei_Alarm_Upload",
//       mapping: "Huawei_SA_NSA",
//     },
//   },

//   Ericsson: {
//     label: "Ericsson",
//     color: "#388e3c",
//     backgroundColor: "#c8e6c9",
//     icon: "🟢",
//     showAlarmFile: true,
//     showMappingFile: true,
//     showCircleSelect: true,
//     circleOptions: CIRCLES,
//     endpoints: {
//       alarm_file: `${BASE_URL}/universal_alarm/upload_4g/`,
//       uploadSite: `${BASE_URL}/universal_alarm/upload_site/`,
//       deleteSite: `${BASE_URL}/universal_alarm/delete_site/`,
//       getSite: `${BASE_URL}/universal_alarm/get_site/`,
//     },
//     fieldNames: {
//       alarm: "alarm_file",
//       mapping: "mapping_file",
//     },
//   },

//   Nokia: {
//     label: "Nokia",
//     color: "#0097a7",
//     backgroundColor: "#b2ebf2",
//     icon: "🔷",
//     showAlarmFile: true,
//     showMappingFile: true,
//     showCircleSelect: false,
//     endpoints: {
//       alarm_file: `${BASE_URL}/daily_alarm/Nokia/`,
//       saNSA: `${BASE_URL}/daily_alarm/SA_NSA/`,
//       uploadSite: `${BASE_URL}/daily_alarm/upload_site/`,
//       deleteSite: `${BASE_URL}/daily_alarm/delete_site/`,
//       getSite: `${BASE_URL}/daily_alarm/get_site/`,
//     },
//     fieldNames: {
//       alarm: "Nokia_MS2",
//       mapping: "Nokia_MS2",
//     },
//   },

//   Samsung: {
//     label: "Samsung",
//     color: "#7b1fa2",
//     backgroundColor: "#f3e5f5",
//     icon: "🟣",
//     showAlarmFile: true,
//     showMappingFile: true,
//     showCircleSelect: false,
//     endpoints: {
//       alarm_file: `${BASE_URL}/oem_samsung/Samsung/`,
//       saNSA: `${BASE_URL}/oem_samsung/SA_NSA/`,
//       uploadSite: `${BASE_URL}/oem_samsung/upload_site/`,
//       deleteSite: `${BASE_URL}/oem_samsung/delete_site/`,
//       getSite: `${BASE_URL}/oem_samsung/get_site/`,
//     },
//     fieldNames: {
//       alarm: "SAMSUNG_Alarm_Upload",
//       mapping: "SAMSUNG_SA_NSA",
//     },
//   },
// };

// const OEM_LIST = ["ZTE", "Huawei", "Ericsson", "Nokia", "Samsung"];

// /**
//  * OEM Card Component
//  */
// const OEMCard = ({
//   oem,
//   config,
//   isActive,
//   onSelect,
//   alarmFiles,
//   mappingFiles,
//   selectedCircle,
//   onAlarmFileChange,
//   onMappingFileChange,
//   onCircleChange,
//   onSubmit,
//   onReset,
//   isSubmitting,
// }) => {
//   const handleAlarmFileChange = (event) => {
//     onAlarmFileChange(oem, event);
//   };

//   const handleMappingFileChange = (event) => {
//     onMappingFileChange(oem, event);
//   };

//   return (
//     <Card
//       sx={{
//         backgroundColor: isActive ? config.backgroundColor : "#f5f5f5",
//         border: isActive ? `3px solid ${config.color}` : "1px solid #ddd",
//         cursor: "pointer",
//         transition: "all 0.3s ease",
//         "&:hover": {
//           boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
//           transform: "translateY(-4px)",
//         },
//         height: "100%",
//       }}
//       onClick={() => !isActive && onSelect(oem)}
//     >
//       <CardContent>
//         {/* OEM Header */}
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
//           <Typography variant="h2" sx={{ fontSize: "32px" }}>
//             {config.icon}
//           </Typography>
//           <Box sx={{ flex: 1 }}>
//             <Typography
//               variant="h6"
//               sx={{ fontWeight: 600, color: config.color }}
//             >
//               {config.label}
//             </Typography>
//           </Box>
//           {isActive && (
//             <Chip
//               label="Active"
//               size="small"
//               color="primary"
//               variant="outlined"
//             />
//           )}
//         </Box>

//         {isActive && (
//           <>
//             {/* Circle Selection for Ericsson */}
//             {config.showCircleSelect && (
//               <Box sx={{ mb: 2 }}>
//                 <FormControl fullWidth size="small">
//                   <InputLabel id={`circle-select-${oem}`}>
//                     Select Circle/Region
//                   </InputLabel>
//                   <Select
//                     labelId={`circle-select-${oem}`}
//                     value={selectedCircle || ""}
//                     label="Select Circle/Region"
//                     onChange={onCircleChange}
//                   >
//                     {config.circleOptions?.map((circle) => (
//                       <MenuItem key={circle} value={circle}>
//                         {circle}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//             )}

//             {/* Alarm File Upload */}
//             {config.showAlarmFile && (
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                   📁 {config.fieldNames.alarm || "Alarm File"}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   component="label"
//                   color={
//                     alarmFiles[oem] && alarmFiles[oem].length > 0
//                       ? "warning"
//                       : "primary"
//                   }
//                   startIcon={<CloudUploadIcon />}
//                   fullWidth
//                   sx={{ mb: 1 }}
//                   disabled={isSubmitting}
//                 >
//                   Select Alarm Files
//                   <input
//                     hidden
//                     accept=".log,.logs,.txt"
//                     multiple
//                     type="file"
//                     onChange={handleAlarmFileChange}
//                     disabled={isSubmitting}
//                   />
//                 </Button>
//                 {alarmFiles[oem] && alarmFiles[oem].length > 0 && (
//                   <Chip
//                     icon={<CheckCircleIcon />}
//                     label={`${alarmFiles[oem].length} File(s) Selected`}
//                     color="success"
//                     size="small"
//                   />
//                 )}
//               </Box>
//             )}

//             {/* Mapping File Upload */}
//             {config.showMappingFile && (
//               <Box sx={{ mb: 2 }}>
//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                   📊 {config.fieldNames.mapping || "Mapping File"}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   component="label"
//                   color={
//                     mappingFiles[oem] && mappingFiles[oem].length > 0
//                       ? "warning"
//                       : "primary"
//                   }
//                   startIcon={<CloudUploadIcon />}
//                   fullWidth
//                   sx={{ mb: 1 }}
//                   disabled={isSubmitting}
//                 >
//                   Select Mapping Files
//                   <input
//                     hidden
//                     accept=".xlsx,.xls,.csv"
//                     multiple
//                     type="file"
//                     onChange={handleMappingFileChange}
//                     disabled={isSubmitting}
//                   />
//                 </Button>
//                 {mappingFiles[oem] && mappingFiles[oem].length > 0 && (
//                   <Chip
//                     icon={<CheckCircleIcon />}
//                     label={`${mappingFiles[oem].length} File(s) Selected`}
//                     color="success"
//                     size="small"
//                   />
//                 )}
//               </Box>
//             )}

//             {/* Action Buttons */}
//             <Stack direction="row" spacing={1}>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={() => onSubmit(oem)}
//                 endIcon={isSubmitting ? <CircularProgress size={20} /> : <UploadIcon />}
//                 fullWidth
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Processing..." : "Submit"}
//               </Button>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => onReset(oem)}
//                 endIcon={<DoDisturbIcon />}
//                 fullWidth
//                 size="small"
//                 sx={{ fontWeight: 600 }}
//                 disabled={isSubmitting}
//               >
//                 Reset
//               </Button>
//             </Stack>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// /**
//  * Main Component
//  */
// const OemWiseAlarm = () => {
//   // State Management
//   const [activeOEM, setActiveOEM] = useState("ZTE");
//   const [alarmFiles, setAlarmFiles] = useState({});
//   const [mappingFiles, setMappingFiles] = useState({});
//   const [selectedCircles, setSelectedCircles] = useState({});
//   const [outputs, setOutputs] = useState({});
//   const [showOutputDialog, setShowOutputDialog] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { loading, action } = useLoadingDialog();
//   const navigate = useNavigate();
//   const classes = OverAllCss();

//   /**
//    * Get current OEM config
//    */
//   const currentOEMConfig = useMemo(() => {
//     return OEM_CONFIG[activeOEM] || null;
//   }, [activeOEM]);

//   /**
//    * Handle Alarm File Selection
//    */
//   const handleAlarmFileChange = (oem, event) => {
//     const files = event.target.files;
//     const validFiles = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const extension = file.name.split(".").pop().toLowerCase();

//       if (["log", "logs", "txt"].includes(extension)) {
//         validFiles.push(file);
//       } else {
//         Swal.fire({
//           icon: "warning",
//           title: "Invalid File Type",
//           text: `File "${file.name}" has invalid extension. Only .log, .logs, .txt are allowed.`,
//         });
//       }
//     }

//     setAlarmFiles((prev) => ({
//       ...prev,
//       [oem]: validFiles,
//     }));
//   };

//   /**
//    * Handle Mapping File Selection
//    */
//   const handleMappingFileChange = (oem, event) => {
//     const files = event.target.files;
//     const validFiles = [];

//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const extension = file.name.split(".").pop().toLowerCase();

//       if (["xlsx", "xls", "csv"].includes(extension)) {
//         validFiles.push(file);
//       } else {
//         Swal.fire({
//           icon: "warning",
//           title: "Invalid File Type",
//           text: `File "${file.name}" has invalid extension. Only .xlsx, .xls, .csv are allowed.`,
//         });
//       }
//     }

//     setMappingFiles((prev) => ({
//       ...prev,
//       [oem]: validFiles,
//     }));
//   };

//   /**
//    * Handle Circle Selection
//    */
//   const handleCircleChange = (event) => {
//     setSelectedCircles((prev) => ({
//       ...prev,
//       [activeOEM]: event.target.value,
//     }));
//   };

//   /**
//    * Validate Form
//    */
//   const validateForm = (oem) => {
//     const config = OEM_CONFIG[oem];

//     if (config.showCircleSelect && !selectedCircles[oem]) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select a circle/region",
//       });
//       return false;
//     }

//     if (
//       config.showAlarmFile &&
//       (!alarmFiles[oem] || alarmFiles[oem].length === 0)
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select alarm files",
//       });
//       return false;
//     }

//     if (
//       config.showMappingFile &&
//       (!mappingFiles[oem] || mappingFiles[oem].length === 0)
//     ) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please select mapping files",
//       });
//       return false;
//     }

//     return true;
//   };

//   /**
//    * Handle Form Submit
//    */
//   const handleSubmit = async (oem) => {
//     if (!validateForm(oem)) {
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       action(true);

//       const config = OEM_CONFIG[oem];
//       const formData = new FormData();

//       // Add alarm files if required
//       if (config.showAlarmFile && alarmFiles[oem]) {
//         for (let i = 0; i < alarmFiles[oem].length; i++) {
//           formData.append(config.fieldNames.alarm, alarmFiles[oem][i]);
//         }
//       }

//       // Add mapping files if required
//       if (config.showMappingFile && mappingFiles[oem]) {
//         for (let i = 0; i < mappingFiles[oem].length; i++) {
//           formData.append(config.fieldNames.mapping, mappingFiles[oem][i]);
//         }
//       }

//       // Add circle if required
//       if (config.showCircleSelect && selectedCircles[oem]) {
//         formData.append("circle", selectedCircles[oem]);
//       }

//       // Determine which endpoint to use
//       let endpoint = null;
//       if (config.showMappingFile && config.endpoints.mapping_file) {
//         endpoint = config.endpoints.mapping_file;
//       } else if (config.showAlarmFile && config.endpoints.alarm_file) {
//         endpoint = config.endpoints.alarm_file;
//       }

//       if (!endpoint) {
//         throw new Error("No valid endpoint found for this OEM");
//       }

//       // Call API using native fetch to handle base URL properly
//       const response = await fetch(endpoint, {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();

//       action(false);
//       setIsSubmitting(false);

//       if (data.status === true) {
//         setOutputs((prev) => ({
//           ...prev,
//           [oem]: data,
//         }));

//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: data.message || "Files processed successfully",
//           confirmButtonText: "View Outputs",
//         }).then(() => {
//           setShowOutputDialog(true);
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: data.message || "Failed to process files",
//         });
//       }
//     } catch (error) {
//       action(false);
//       setIsSubmitting(false);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: error.message || "An error occurred while processing files",
//       });
//     }
//   };

//   /**
//    * Handle Reset
//    */
//   const handleReset = (oem) => {
//     setAlarmFiles((prev) => {
//       const updated = { ...prev };
//       delete updated[oem];
//       return updated;
//     });

//     setMappingFiles((prev) => {
//       const updated = { ...prev };
//       delete updated[oem];
//       return updated;
//     });

//     setSelectedCircles((prev) => {
//       const updated = { ...prev };
//       delete updated[oem];
//       return updated;
//     });
//   };

//   /**
//    * Set document title on mount
//    */
//   useEffect(() => {
//     document.title = `${window.location.pathname
//       .slice(1)
//       .replaceAll("_", " ")
//       .replaceAll("/", " | ")
//       .toUpperCase()}`;
//   }, []);

//   return (
//     <>
//       {/* Breadcrumb Navigation */}
//       <div style={{ margin: 5, marginLeft: 10 }}>
//         <Breadcrumbs
//           aria-label="breadcrumb"
//           itemsBeforeCollapse={2}
//           maxItems={3}
//           separator={<KeyboardArrowRightIcon fontSize="small" />}
//         >
//           <Link
//             underline="hover"
//             onClick={() => {
//               navigate("/tools");
//             }}
//             sx={{ cursor: "pointer" }}
//           >
//             Tools
//           </Link>
//           <Link
//             underline="hover"
//             onClick={() => {
//               navigate("/tools/dma");
//             }}
//             sx={{ cursor: "pointer" }}
//           >
//             DSA Tool
//           </Link>
//           <Typography color="text.primary">OEM WISE ALARM</Typography>
//         </Breadcrumbs>
//       </div>

//       <Slide direction="left" in={true} timeout={1000}>
//         <Box>
//           <Box className={classes.main_Box}>
//             {/* Header */}
//             <Box
//               sx={{
//                 background: "linear-gradient(135deg, #00796b 0%, #006e74 100%)",
//                 color: "white",
//                 p: 3,
//                 borderRadius: "8px",
//                 mb: 3,
//               }}
//             >
//               <Typography variant="h4" sx={{ fontWeight: 700 }}>
//                 📡 OEM Wise Alarm Processing System
//               </Typography>
//               <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
//                 Select an OEM and upload the required files for processing
//               </Typography>
//             </Box>

//             {/* OEM Cards Grid */}
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               {OEM_LIST.map((oem) => (
//                 <Grid item xs={12} sm={6} md={4} key={oem}>
//                   <OEMCard
//                     oem={oem}
//                     config={OEM_CONFIG[oem]}
//                     isActive={activeOEM === oem}
//                     onSelect={setActiveOEM}
//                     alarmFiles={alarmFiles}
//                     mappingFiles={mappingFiles}
//                     selectedCircle={selectedCircles[oem] || ""}
//                     onAlarmFileChange={handleAlarmFileChange}
//                     onMappingFileChange={handleMappingFileChange}
//                     onCircleChange={handleCircleChange}
//                     onSubmit={handleSubmit}
//                     onReset={handleReset}
//                     isSubmitting={isSubmitting}
//                   />
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Info Cards */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <Card sx={{ backgroundColor: "#e0f2f1", p: 2, border: "1px solid #00897b" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <CheckCircleIcon sx={{ color: "#00796b", fontSize: 28 }} />
//                     <Box>
//                       <Typography variant="caption" color="textSecondary">
//                         Files Selected
//                       </Typography>
//                       <Typography variant="h6" sx={{ fontWeight: 600, color: "#00796b" }}>
//                         {Object.values(alarmFiles).reduce(
//                           (acc, val) => acc + (val ? val.length : 0),
//                           0
//                         ) +
//                           Object.values(mappingFiles).reduce(
//                             (acc, val) => acc + (val ? val.length : 0),
//                             0
//                           )}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card sx={{ backgroundColor: "#e0f2f1", p: 2, border: "1px solid #00897b" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <UploadIcon sx={{ color: "#00796b", fontSize: 28 }} />
//                     <Box>
//                       <Typography variant="caption" color="textSecondary">
//                         Active OEM
//                       </Typography>
//                       <Typography variant="h6" sx={{ fontWeight: 600, color: "#00796b" }}>
//                         {activeOEM}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card sx={{ backgroundColor: "#e0f2f1", p: 2, border: "1px solid #00897b" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <FileDownloadIcon sx={{ color: "#00796b", fontSize: 28 }} />
//                     <Box>
//                       <Typography variant="caption" color="textSecondary">
//                         Outputs Generated
//                       </Typography>
//                       <Typography variant="h6" sx={{ fontWeight: 600, color: "#00796b" }}>
//                         {Object.keys(outputs).length}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>

//               <Grid item xs={12} sm={6} md={3}>
//                 <Card sx={{ backgroundColor: "#e0f2f1", p: 2, border: "1px solid #00897b" }}>
//                   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                     <HistoryIcon sx={{ color: "#00796b", fontSize: 28 }} />
//                     <Box>
//                       <Typography variant="caption" color="textSecondary">
//                         Status
//                       </Typography>
//                       <Typography variant="h6" sx={{ fontWeight: 600, color: "#00796b" }}>
//                         {isSubmitting ? "Processing..." : "Ready"}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Card>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Slide>

//       {/* Output Files Dialog */}
//       <Dialog
//         open={showOutputDialog}
//         onClose={() => setShowOutputDialog(false)}
//         maxWidth="md"
//         fullWidth
//       >
//         <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
//           📊 Processing Results - {activeOEM}
//         </DialogTitle>
//         <DialogContent>
//           {outputs[activeOEM] ? (
//             <Stack spacing={2} sx={{ mt: 2 }}>
//               <Alert severity="success">{outputs[activeOEM].message}</Alert>

//               {outputs[activeOEM].download_url && (
//                 <Card sx={{ p: 2, backgroundColor: "#f1f8e9" }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                     📥 Download Output
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="success"
//                     startIcon={<FileDownloadIcon />}
//                     href={outputs[activeOEM].download_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     Download ZIP Package
//                   </Button>
//                 </Card>
//               )}

//               {outputs[activeOEM].files_saved && (
//                 <Card sx={{ p: 2, backgroundColor: "#e8f5e9" }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                     ✅ Files Processed
//                   </Typography>
//                   <Typography variant="body2" color="textSecondary">
//                     {outputs[activeOEM].files_saved} files saved successfully
//                   </Typography>
//                 </Card>
//               )}

//               {outputs[activeOEM].circles && (
//                 <Card sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
//                     📍 Circles Processed
//                   </Typography>
//                   <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
//                     {Array.isArray(outputs[activeOEM].circles) &&
//                       outputs[activeOEM].circles.map((circle, idx) => (
//                         <Chip
//                           key={idx}
//                           label={circle}
//                           color="primary"
//                           variant="outlined"
//                         />
//                       ))}
//                   </Stack>
//                 </Card>
//               )}
//             </Stack>
//           ) : (
//             <Alert severity="info">No outputs available yet</Alert>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setShowOutputDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {loading}
//     </>
//   );
// };

// export default OemWiseAlarm;



import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";
import UploadIcon from "@mui/icons-material/Upload";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HistoryIcon from "@mui/icons-material/History";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Swal from "sweetalert2";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// Base URL
const BASE_URL = "https://commtoolapi.mcpspmis.com";

// All circles for Ericsson
const CIRCLES = [
  "AP",
  "CH",
  "KK",
  "DL",
  "HR",
  "RJ",
  "JK",
  "WB",
  "OD",
  "MU",
  "TNCH",
  "UE",
  "BH",
  "UW",
  "MP",
  "NESA",
  "PB",
  "KO",
  "JH",
];

/**
 * OEM Configuration with Actual API Endpoints
 *
 * submitEndpoint = key inside `endpoints` that the Submit button posts to.
 * (Previously the code guessed, which sent ZTE to the wrong URL.)
 */
const OEM_CONFIG = {
  ZTE: {
    label: "ZTE",
    color: "#006e74",
    backgroundColor: "#b2dfdb",
    icon: "🔵",
    showAlarmFile: false,
    showMappingFile: true,
    showCircleSelect: false,
    endpoints: {
      mapping_file: `${BASE_URL}/oem_zte/mapping_file/`,
      saNSA: `${BASE_URL}/oem_zte/SA_NSA/`,
      zte: `${BASE_URL}/oem_zte/zte/`,
      oldVsNew: `${BASE_URL}/oem_zte/old_vs_new/`,
    },
    // If /oem_zte/zte/ also fails, try "saNSA" or "mapping_file" here
    submitEndpoint: "zte",
    fieldNames: {
      alarm: "zte_MS2",
      mapping: "zte_MS2",
    },
  },

  Huawei: {
    label: "Huawei",
    color: "#d32f2f",
    backgroundColor: "#ffcdd2",
    icon: "🔴",
    showAlarmFile: true,
    showMappingFile: true,
    showCircleSelect: false,
    endpoints: {
      alarm_file: `${BASE_URL}/oem_huawei/Huawei/`,
      saNSA: `${BASE_URL}/oem_huawei/SA_NSA/`,
      uploadSite: `${BASE_URL}/oem_huawei/upload_site/`,
      deleteSite: `${BASE_URL}/oem_huawei/delete_site/`,
      getSite: `${BASE_URL}/oem_huawei/get_site/`,
    },
    submitEndpoint: "alarm_file",
    fieldNames: {
      alarm: "Huawei_Alarm_Upload",
      mapping: "Huawei_SA_NSA",
    },
  },

  Ericsson: {
    label: "Ericsson",
    color: "#388e3c",
    backgroundColor: "#c8e6c9",
    icon: "🟢",
    showAlarmFile: true,
    showMappingFile: true,
    showCircleSelect: true,
    circleOptions: CIRCLES,
    endpoints: {
      alarm_file: `${BASE_URL}/universal_alarm/upload_4g/`,
      uploadSite: `${BASE_URL}/universal_alarm/upload_site/`,
      deleteSite: `${BASE_URL}/universal_alarm/delete_site/`,
      getSite: `${BASE_URL}/universal_alarm/get_site/`,
    },
    submitEndpoint: "alarm_file",
    fieldNames: {
      alarm: "alarm_file",
      mapping: "mapping_file",
    },
  },

  Nokia: {
    label: "Nokia",
    color: "#0097a7",
    backgroundColor: "#b2ebf2",
    icon: "🔷",
    showAlarmFile: true,
    showMappingFile: true,
    showCircleSelect: false,
    endpoints: {
      alarm_file: `${BASE_URL}/daily_alarm/Nokia/`,
      saNSA: `${BASE_URL}/daily_alarm/SA_NSA/`,
      uploadSite: `${BASE_URL}/daily_alarm/upload_site/`,
      deleteSite: `${BASE_URL}/daily_alarm/delete_site/`,
      getSite: `${BASE_URL}/daily_alarm/get_site/`,
    },
    submitEndpoint: "alarm_file",
    fieldNames: {
      alarm: "Nokia_MS2",
      mapping: "Nokia_MS2",
    },
  },

  Samsung: {
    label: "Samsung",
    color: "#7b1fa2",
    backgroundColor: "#f3e5f5",
    icon: "🟣",
    showAlarmFile: true,
    showMappingFile: true,
    showCircleSelect: false,
    endpoints: {
      alarm_file: `${BASE_URL}/oem_samsung/Samsung/`,
      saNSA: `${BASE_URL}/oem_samsung/SA_NSA/`,
      uploadSite: `${BASE_URL}/oem_samsung/upload_site/`,
      deleteSite: `${BASE_URL}/oem_samsung/delete_site/`,
      getSite: `${BASE_URL}/oem_samsung/get_site/`,
    },
    submitEndpoint: "alarm_file",
    fieldNames: {
      alarm: "SAMSUNG_Alarm_Upload",
      mapping: "SAMSUNG_SA_NSA",
    },
  },
};

const OEM_LIST = ["ZTE", "Huawei", "Ericsson", "Nokia", "Samsung"];

/**
 * OEM Card Component
 */
const OEMCard = ({
  oem,
  config,
  isActive,
  onSelect,
  alarmFiles,
  mappingFiles,
  selectedCircle,
  onAlarmFileChange,
  onMappingFileChange,
  onCircleChange,
  onSubmit,
  onReset,
  isSubmitting,
}) => {
  const handleAlarmFileChange = (event) => {
    onAlarmFileChange(oem, event);
  };

  const handleMappingFileChange = (event) => {
    onMappingFileChange(oem, event);
  };

  return (
    <Card
      sx={{
        backgroundColor: isActive ? config.backgroundColor : "#f5f5f5",
        border: isActive ? `3px solid ${config.color}` : "1px solid #ddd",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transform: "translateY(-4px)",
        },
        height: "100%",
      }}
      onClick={() => !isActive && onSelect(oem)}
    >
      <CardContent>
        {/* OEM Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Typography variant="h2" sx={{ fontSize: "32px" }}>
            {config.icon}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: config.color }}
            >
              {config.label}
            </Typography>
          </Box>
          {isActive && (
            <Chip
              label="Active"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        {isActive && (
          <>
            {/* Circle Selection for Ericsson */}
            {config.showCircleSelect && (
              <Box sx={{ mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id={`circle-select-${oem}`}>
                    Select Circle/Region
                  </InputLabel>
                  <Select
                    labelId={`circle-select-${oem}`}
                    value={selectedCircle || ""}
                    label="Select Circle/Region"
                    onChange={onCircleChange}
                  >
                    {config.circleOptions?.map((circle) => (
                      <MenuItem key={circle} value={circle}>
                        {circle}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Alarm File Upload */}
            {config.showAlarmFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  📁 {config.fieldNames.alarm || "Alarm File"}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  color={
                    alarmFiles[oem] && alarmFiles[oem].length > 0
                      ? "warning"
                      : "primary"
                  }
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 1 }}
                  disabled={isSubmitting}
                >
                  Select Alarm Files
                  <input
                    hidden
                    accept=".log,.logs,.txt"
                    multiple
                    type="file"
                    onChange={handleAlarmFileChange}
                    disabled={isSubmitting}
                  />
                </Button>
                {alarmFiles[oem] && alarmFiles[oem].length > 0 && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${alarmFiles[oem].length} File(s) Selected`}
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            )}

            {/* Mapping File Upload */}
            {config.showMappingFile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  📊 {config.fieldNames.mapping || "Mapping File"}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  color={
                    mappingFiles[oem] && mappingFiles[oem].length > 0
                      ? "warning"
                      : "primary"
                  }
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 1 }}
                  disabled={isSubmitting}
                >
                  Select Mapping Files
                  <input
                    hidden
                    accept=".xlsx,.xls,.csv"
                    multiple
                    type="file"
                    onChange={handleMappingFileChange}
                    disabled={isSubmitting}
                  />
                </Button>
                {mappingFiles[oem] && mappingFiles[oem].length > 0 && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${mappingFiles[oem].length} File(s) Selected`}
                    color="success"
                    size="small"
                  />
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                color="success"
                onClick={() => onSubmit(oem)}
                endIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <UploadIcon />
                }
                fullWidth
                size="small"
                sx={{ fontWeight: 600 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Submit"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => onReset(oem)}
                endIcon={<DoDisturbIcon />}
                fullWidth
                size="small"
                sx={{ fontWeight: 600 }}
                disabled={isSubmitting}
              >
                Reset
              </Button>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Main Component
 */
const OemWiseAlarm = () => {
  // State Management
  const [activeOEM, setActiveOEM] = useState("ZTE");
  const [alarmFiles, setAlarmFiles] = useState({});
  const [mappingFiles, setMappingFiles] = useState({});
  const [selectedCircles, setSelectedCircles] = useState({});
  const [outputs, setOutputs] = useState({});
  const [showOutputDialog, setShowOutputDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, action } = useLoadingDialog();
  const navigate = useNavigate();
  const classes = OverAllCss();

  /**
   * Get current OEM config
   */
  // eslint-disable-next-line no-unused-vars
  const currentOEMConfig = useMemo(() => {
    return OEM_CONFIG[activeOEM] || null;
  }, [activeOEM]);

  /**
   * Handle Alarm File Selection
   */
  const handleAlarmFileChange = (oem, event) => {
    const files = event.target.files;
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split(".").pop().toLowerCase();

      if (["log", "logs", "txt"].includes(extension)) {
        validFiles.push(file);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Invalid File Type",
          text: `File "${file.name}" has invalid extension. Only .log, .logs, .txt are allowed.`,
        });
      }
    }

    setAlarmFiles((prev) => ({
      ...prev,
      [oem]: validFiles,
    }));
  };

  /**
   * Handle Mapping File Selection
   */
  const handleMappingFileChange = (oem, event) => {
    const files = event.target.files;
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const extension = file.name.split(".").pop().toLowerCase();

      if (["xlsx", "xls", "csv"].includes(extension)) {
        validFiles.push(file);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Invalid File Type",
          text: `File "${file.name}" has invalid extension. Only .xlsx, .xls, .csv are allowed.`,
        });
      }
    }

    setMappingFiles((prev) => ({
      ...prev,
      [oem]: validFiles,
    }));
  };

  /**
   * Handle Circle Selection
   */
  const handleCircleChange = (event) => {
    setSelectedCircles((prev) => ({
      ...prev,
      [activeOEM]: event.target.value,
    }));
  };

  /**
   * Validate Form
   */
  const validateForm = (oem) => {
    const config = OEM_CONFIG[oem];

    if (config.showCircleSelect && !selectedCircles[oem]) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a circle/region",
      });
      return false;
    }

    if (
      config.showAlarmFile &&
      (!alarmFiles[oem] || alarmFiles[oem].length === 0)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select alarm files",
      });
      return false;
    }

    if (
      config.showMappingFile &&
      (!mappingFiles[oem] || mappingFiles[oem].length === 0)
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select mapping files",
      });
      return false;
    }

    return true;
  };

  /**
   * Handle Form Submit
   */
  const handleSubmit = async (oem) => {
    if (!validateForm(oem)) {
      return;
    }

    try {
      setIsSubmitting(true);
      action(true);

      const config = OEM_CONFIG[oem];
      const formData = new FormData();

      // Add alarm files if required
      if (config.showAlarmFile && alarmFiles[oem]) {
        for (let i = 0; i < alarmFiles[oem].length; i++) {
          formData.append(config.fieldNames.alarm, alarmFiles[oem][i]);
        }
      }

      // Add mapping files if required
      if (config.showMappingFile && mappingFiles[oem]) {
        for (let i = 0; i < mappingFiles[oem].length; i++) {
          formData.append(config.fieldNames.mapping, mappingFiles[oem][i]);
        }
      }

      // Add circle if required
      if (config.showCircleSelect && selectedCircles[oem]) {
        formData.append("circle", selectedCircles[oem]);
      }

      // Use the explicitly configured endpoint for this OEM
      const endpoint = config.endpoints[config.submitEndpoint];

      if (!endpoint) {
        throw new Error("No valid endpoint found for this OEM");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      // Read as text first so HTML error pages (404/500) don't crash JSON parsing
      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error("Non-JSON response:", response.status, endpoint, rawText);
        throw new Error(
          `Server returned ${response.status} ${response.statusText} from ${endpoint}. ` +
            `Check the endpoint URL / backend logs.`
        );
      }

      if (!response.ok && data.status !== true) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      action(false);
      setIsSubmitting(false);

      if (data.status === true) {
        setOutputs((prev) => ({
          ...prev,
          [oem]: data,
        }));

        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message || "Files processed successfully",
          confirmButtonText: "View Outputs",
        }).then(() => {
          setShowOutputDialog(true);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to process files",
        });
      }
    } catch (error) {
      action(false);
      setIsSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while processing files",
      });
    }
  };

  /**
   * Handle Reset
   */
  const handleReset = (oem) => {
    setAlarmFiles((prev) => {
      const updated = { ...prev };
      delete updated[oem];
      return updated;
    });

    setMappingFiles((prev) => {
      const updated = { ...prev };
      delete updated[oem];
      return updated;
    });

    setSelectedCircles((prev) => {
      const updated = { ...prev };
      delete updated[oem];
      return updated;
    });
  };

  /**
   * Set document title on mount
   */
  useEffect(() => {
    document.title = `${window.location.pathname
      .slice(1)
      .replaceAll("_", " ")
      .replaceAll("/", " | ")
      .toUpperCase()}`;
  }, []);

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div style={{ margin: 5, marginLeft: 10 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          itemsBeforeCollapse={2}
          maxItems={3}
          separator={<KeyboardArrowRightIcon fontSize="small" />}
        >
          <Link
            underline="hover"
            onClick={() => {
              navigate("/tools");
            }}
            sx={{ cursor: "pointer" }}
          >
            Tools
          </Link>
          <Link
            underline="hover"
            onClick={() => {
              navigate("/tools/dma");
            }}
            sx={{ cursor: "pointer" }}
          >
            DSA Tool
          </Link>
          <Typography color="text.primary">OEM WISE ALARM</Typography>
        </Breadcrumbs>
      </div>

      <Slide direction="left" in={true} timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #00796b 0%, #006e74 100%)",
                color: "white",
                p: 3,
                borderRadius: "8px",
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                📡 OEM Wise Alarm Processing System
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Select an OEM and upload the required files for processing
              </Typography>
            </Box>

            {/* OEM Cards Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {OEM_LIST.map((oem) => (
                <Grid item xs={12} sm={6} md={4} key={oem}>
                  <OEMCard
                    oem={oem}
                    config={OEM_CONFIG[oem]}
                    isActive={activeOEM === oem}
                    onSelect={setActiveOEM}
                    alarmFiles={alarmFiles}
                    mappingFiles={mappingFiles}
                    selectedCircle={selectedCircles[oem] || ""}
                    onAlarmFileChange={handleAlarmFileChange}
                    onMappingFileChange={handleMappingFileChange}
                    onCircleChange={handleCircleChange}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    isSubmitting={isSubmitting}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Info Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    backgroundColor: "#e0f2f1",
                    p: 2,
                    border: "1px solid #00897b",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "#00796b", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Files Selected
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#00796b" }}
                      >
                        {Object.values(alarmFiles).reduce(
                          (acc, val) => acc + (val ? val.length : 0),
                          0
                        ) +
                          Object.values(mappingFiles).reduce(
                            (acc, val) => acc + (val ? val.length : 0),
                            0
                          )}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    backgroundColor: "#e0f2f1",
                    p: 2,
                    border: "1px solid #00897b",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <UploadIcon sx={{ color: "#00796b", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Active OEM
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#00796b" }}
                      >
                        {activeOEM}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    backgroundColor: "#e0f2f1",
                    p: 2,
                    border: "1px solid #00897b",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FileDownloadIcon sx={{ color: "#00796b", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Outputs Generated
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#00796b" }}
                      >
                        {Object.keys(outputs).length}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    backgroundColor: "#e0f2f1",
                    p: 2,
                    border: "1px solid #00897b",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HistoryIcon sx={{ color: "#00796b", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Status
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#00796b" }}
                      >
                        {isSubmitting ? "Processing..." : "Ready"}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Slide>

      {/* Output Files Dialog */}
      <Dialog
        open={showOutputDialog}
        onClose={() => setShowOutputDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "#00796b" }}>
          📊 Processing Results - {activeOEM}
        </DialogTitle>
        <DialogContent>
          {outputs[activeOEM] ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Alert severity="success">{outputs[activeOEM].message}</Alert>

              {outputs[activeOEM].download_url && (
                <Card sx={{ p: 2, backgroundColor: "#f1f8e9" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    📥 Download Output
                  </Typography>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<FileDownloadIcon />}
                    href={outputs[activeOEM].download_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download ZIP Package
                  </Button>
                </Card>
              )}

              {outputs[activeOEM].files_saved && (
                <Card sx={{ p: 2, backgroundColor: "#e8f5e9" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    ✅ Files Processed
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {outputs[activeOEM].files_saved} files saved successfully
                  </Typography>
                </Card>
              )}

              {outputs[activeOEM].circles && (
                <Card sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    📍 Circles Processed
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {Array.isArray(outputs[activeOEM].circles) &&
                      outputs[activeOEM].circles.map((circle, idx) => (
                        <Chip
                          key={idx}
                          label={circle}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                  </Stack>
                </Card>
              )}
            </Stack>
          ) : (
            <Alert severity="info">No outputs available yet</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOutputDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {loading}
    </>
  );
};

export default OemWiseAlarm;