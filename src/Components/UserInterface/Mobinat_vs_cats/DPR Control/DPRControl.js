// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Divider,
//   Grid,
//   LinearProgress,
//   Paper,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Alert,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import {
//   Upload as UploadIcon,
//   Download as DownloadIcon,
//   CheckCircle as CheckCircleIcon,
//   Warning as WarningIcon,
//   Error as ErrorIcon,
//   Close as CloseIcon,
//   DeleteOutline as DeleteIcon,
// } from "@mui/icons-material";
// import Swal from "sweetalert2";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";

// const DPRControl = () => {
//   const [circleFiles, setCircleFiles] = useState([]);
//   const [milestoneFiles, setMilestoneFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [responseData, setResponseData] = useState(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [detailsType, setDetailsType] = useState("");

//   const handleCircleFilesChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setCircleFiles([...circleFiles, ...newFiles]);
//   };

//   const handleMilestoneFilesChange = (e) => {
//     const newFiles = Array.from(e.target.files);
//     setMilestoneFiles([...milestoneFiles, ...newFiles]);
//   };

//   const removeCircleFile = (index) => {
//     setCircleFiles(circleFiles.filter((_, i) => i !== index));
//   };

//   const removeMilestoneFile = (index) => {
//     setMilestoneFiles(milestoneFiles.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async () => {
//     if (circleFiles.length === 0 || milestoneFiles.length === 0) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing Files",
//         text: "Please select at least one file from both circle and milestone sections",
//       });
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();

//     // Append all circle files
//     circleFiles.forEach((file) => {
//       formData.append("circle_files", file);
//     });

//     // Append all milestone files
//     milestoneFiles.forEach((file) => {
//       formData.append("milestone_file", file);
//     });

//     try {
//       const response = await postData("dpr/merge_circle_dpr/", formData);

//       if (response.status) {
//         setResponseData(response);
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: response.message,
//         });
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: response.message,
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to process files",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setCircleFiles([]);
//     setMilestoneFiles([]);
//     setResponseData(null);
//   };

//   const downloadFile = () => {
//     if (responseData?.download_url) {
//       const link = document.createElement("a");
//       link.href = responseData.download_url;
//       link.click();
//     }
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {!responseData ? (
//         <Card sx={{ p: 4 }}>
//           <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
//             Upload Site Data
//           </Typography>

//           <Stack spacing={3}>
//             {/* Circle Files Upload */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
//                 Select Circle Files
//                 <span style={{ color: "red", marginLeft: "4px" }}>*</span>
//                 <span style={{ fontSize: "12px", color: "#666", fontWeight: "400", marginLeft: "8px" }}>
//                   (Multiple files allowed)
//                 </span>
//               </Typography>
//               <Button
//                 variant="contained"
//                 component="label"
//                 startIcon={<UploadIcon />}
//                 sx={{ mb: 2 }}
//               >
//                 Add Circle Files
//                 <input
//                   hidden
//                   multiple
//                   accept=".csv,.xlsx,.xls"
//                   onChange={handleCircleFilesChange}
//                   type="file"
//                 />
//               </Button>

//               {circleFiles.length > 0 && (
//                 <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
//                   <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600, color: "#666" }}>
//                     Selected Circle Files ({circleFiles.length})
//                   </Typography>
//                   <Stack spacing={1}>
//                     {circleFiles.map((file, idx) => (
//                       <Box
//                         key={idx}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           p: 1.5,
//                           backgroundColor: "#fff",
//                           borderRadius: 1,
//                           border: "0.5px solid #e0e0e0",
//                         }}
//                       >
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, wordBreak: "break-all" }}>
//                             {file.name}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: "#999" }}>
//                             {(file.size / 1024 / 1024).toFixed(2)} MB
//                           </Typography>
//                         </Box>
//                         <Button
//                           size="small"
//                           onClick={() => removeCircleFile(idx)}
//                           startIcon={<DeleteIcon />}
//                           sx={{ ml: 1, color: "#f44336" }}
//                         >
//                           Remove
//                         </Button>
//                       </Box>
//                     ))}
//                   </Stack>
//                 </Box>
//               )}
//             </Box>

//             <Divider />

//             {/* Milestone Files Upload */}
//             <Box>
//               <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
//                 Select Milestone Files
//                 <span style={{ color: "red", marginLeft: "4px" }}>*</span>
//                 <span style={{ fontSize: "12px", color: "#666", fontWeight: "400", marginLeft: "8px" }}>
//                   (Multiple files allowed)
//                 </span>
//               </Typography>
//               <Button
//                 variant="contained"
//                 component="label"
//                 startIcon={<UploadIcon />}
//                 sx={{ mb: 2 }}
//               >
//                 Add Milestone Files
//                 <input
//                   hidden
//                   multiple
//                   accept=".csv,.xlsx,.xls"
//                   onChange={handleMilestoneFilesChange}
//                   type="file"
//                 />
//               </Button>

//               {milestoneFiles.length > 0 && (
//                 <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
//                   <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600, color: "#666" }}>
//                     Selected Milestone Files ({milestoneFiles.length})
//                   </Typography>
//                   <Stack spacing={1}>
//                     {milestoneFiles.map((file, idx) => (
//                       <Box
//                         key={idx}
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           p: 1.5,
//                           backgroundColor: "#fff",
//                           borderRadius: 1,
//                           border: "0.5px solid #e0e0e0",
//                         }}
//                       >
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, wordBreak: "break-all" }}>
//                             {file.name}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: "#999" }}>
//                             {(file.size / 1024 / 1024).toFixed(2)} MB
//                           </Typography>
//                         </Box>
//                         <Button
//                           size="small"
//                           onClick={() => removeMilestoneFile(idx)}
//                           startIcon={<DeleteIcon />}
//                           sx={{ ml: 1, color: "#f44336" }}
//                         >
//                           Remove
//                         </Button>
//                       </Box>
//                     ))}
//                   </Stack>
//                 </Box>
//               )}
//             </Box>

//             {/* Submit Buttons */}
//             <Box sx={{ pt: 3, borderTop: "1px solid #e0e0e0" }}>
//               <Stack direction="row" spacing={2}>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   onClick={handleSubmit}
//                   disabled={loading || circleFiles.length === 0 || milestoneFiles.length === 0}
//                   startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
//                   sx={{ px: 4 }}
//                 >
//                   {loading ? "Processing..." : "Submit"}
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={handleCancel}
//                   startIcon={<CloseIcon />}
//                   sx={{ px: 4 }}
//                 >
//                   Cancel
//                 </Button>
//               </Stack>
//               {(circleFiles.length === 0 || milestoneFiles.length === 0) && (
//                 <Alert severity="info" sx={{ mt: 2 }}>
//                   Please select at least one file from both sections to proceed
//                 </Alert>
//               )}
//             </Box>
//           </Stack>
//         </Card>
//       ) : (
//         <Dashboard
//           data={responseData}
//           onBack={handleCancel}
//           onDownload={downloadFile}
//           onShowDetails={(type) => {
//             setDetailsType(type);
//             setDetailsOpen(true);
//           }}
//         />
//       )}

//       {/* Details Dialog */}
//       <DetailsDialog
//         open={detailsOpen}
//         type={detailsType}
//         data={responseData}
//         onClose={() => setDetailsOpen(false)}
//       />
//     </Container>
//   );
// };

// const Dashboard = ({ data, onBack, onDownload, onShowDetails }) => {
//   return (
//     <Stack spacing={3}>
//       {/* Header Section */}
//       <Card
//         sx={{
//           p: 3,
//           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//           color: "white",
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between" alignItems="center">
//           <Box>
//             <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
//               ✓ File Merged Successfully
//             </Typography>
//             <Typography variant="body1">{data.message}</Typography>
//           </Box>
//           <Button
//             variant="contained"
//             color="success"
//             startIcon={<DownloadIcon />}
//             onClick={onDownload}
//             sx={{ whiteSpace: "nowrap" }}
//           >
//             Download Merged File
//           </Button>
//         </Stack>
//       </Card>

//       {/* Key Metrics */}
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={3}>
//           <MetricCard
//             title="Total Rows"
//             value={data.total_rows?.toLocaleString()}
//             icon={<CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 32 }} />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <MetricCard
//             title="Records Updated"
//             value={data.database_save?.updated?.toLocaleString()}
//             icon={<CheckCircleIcon sx={{ color: "#2196F3", fontSize: 32 }} />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <MetricCard
//             title="Records Failed"
//             value={data.database_save?.failed?.toLocaleString()}
//             icon={<ErrorIcon sx={{ color: "#F44336", fontSize: 32 }} />}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <MetricCard
//             title="Duplicate IDs"
//             value={data.duplicate_unique_ids?.duplicate_count}
//             icon={<WarningIcon sx={{ color: "#FF9800", fontSize: 32 }} />}
//           />
//         </Grid>
//       </Grid>

//       {/* Database Save Summary */}
//       <Card sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//           Database Save Summary
//         </Typography>
//         <Stack spacing={2}>
//           <Box>
//             <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
//               <Typography variant="body2">Records Created</Typography>
//               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                 {data.database_save?.created}
//               </Typography>
//             </Stack>
//             <LinearProgress
//               variant="determinate"
//               value={
//                 (data.database_save?.created /
//                   (data.database_save?.created +
//                     data.database_save?.updated +
//                     data.database_save?.failed)) *
//                   100 || 0
//               }
//               sx={{ backgroundColor: "#e0e0e0" }}
//               color="success"
//             />
//           </Box>
//           <Box>
//             <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
//               <Typography variant="body2">Records Updated</Typography>
//               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                 {data.database_save?.updated}
//               </Typography>
//             </Stack>
//             <LinearProgress
//               variant="determinate"
//               value={
//                 (data.database_save?.updated /
//                   (data.database_save?.created +
//                     data.database_save?.updated +
//                     data.database_save?.failed)) *
//                   100 || 0
//               }
//               sx={{ backgroundColor: "#e0e0e0" }}
//               color="info"
//             />
//           </Box>
//           <Box>
//             <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
//               <Typography variant="body2">Records Failed</Typography>
//               <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                 {data.database_save?.failed}
//               </Typography>
//             </Stack>
//             <LinearProgress
//               variant="determinate"
//               value={
//                 (data.database_save?.failed /
//                   (data.database_save?.created +
//                     data.database_save?.updated +
//                     data.database_save?.failed)) *
//                   100 || 0
//               }
//               sx={{ backgroundColor: "#e0e0e0" }}
//               color="error"
//             />
//           </Box>
//           <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
//             <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
//               {data.database_save?.summary}
//             </Typography>
//             <Typography variant="caption" sx={{ color: "#999" }}>
//               Batch ID: {data.database_save?.batch_id}
//             </Typography>
//           </Box>
//         </Stack>
//       </Card>

//       {/* Errors Section */}
//       {data.database_save?.errors && data.database_save.errors.length > 0 && (
//         <Card sx={{ p: 3, backgroundColor: "#ffebee" }}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600, color: "#c62828" }}>
//               <ErrorIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               Errors ({data.database_save.errors.length})
//             </Typography>
//             <Button size="small" onClick={() => onShowDetails("errors")}>
//               View All
//             </Button>
//           </Stack>
//           <TableContainer>
//             <Table size="small">
//               <TableBody>
//                 {data.database_save.errors.slice(0, 5).map((error, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell sx={{ color: "#c62828" }}>{error}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>
//       )}

//       {/* Duplicate IDs Section */}
//       {data.duplicate_unique_ids?.duplicate_count > 0 && (
//         <Card sx={{ p: 3, backgroundColor: "#fff3e0" }}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600, color: "#e65100" }}>
//               <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               Duplicate Unique IDs ({data.duplicate_unique_ids.duplicate_count})
//             </Typography>
//             <Button size="small" onClick={() => onShowDetails("duplicates")}>
//               View All
//             </Button>
//           </Stack>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#ffe0b2" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
//                   <TableCell align="right" sx={{ fontWeight: 600 }}>
//                     Occurrences
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.duplicate_unique_ids.duplicates
//                   .slice(0, 5)
//                   .map((dup, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{dup.unique_id}</TableCell>
//                       <TableCell align="right">
//                         <Chip
//                           label={dup.occurrences}
//                           color="warning"
//                           size="small"
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>
//       )}

//       {/* Past Month Warnings */}
//       {data.past_month_dismantle_dates?.warning_count > 0 && (
//         <Card sx={{ p: 3, backgroundColor: "#e3f2fd" }}>
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: 600, color: "#1565c0" }}>
//               <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
//               Past Month Dismantle Dates (
//               {data.past_month_dismantle_dates.warning_count})
//             </Typography>
//             <Button size="small" onClick={() => onShowDetails("warnings")}>
//               View All
//             </Button>
//           </Stack>
//           <TableContainer>
//             <Table size="small">
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#bbdefb" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.past_month_dismantle_dates.warnings
//                   .slice(0, 5)
//                   .map((warn, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{warn.unique_id}</TableCell>
//                       <TableCell>{warn.dismantle_date}</TableCell>
//                       <TableCell>{warn.message}</TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Card>
//       )}

//       {/* Sample Details */}
//       {data.database_save?.sample_details &&
//         data.database_save.sample_details.length > 0 && (
//           <Card sx={{ p: 3 }}>
//             <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
//               Sample Processed Records
//             </Typography>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                     <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
//                     <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
//                     <TableCell align="right" sx={{ fontWeight: 600 }}>
//                       Fields Updated
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {data.database_save.sample_details.map((sample, idx) => (
//                     <TableRow key={idx}>
//                       <TableCell>{sample.unique_id}</TableCell>
//                       <TableCell>
//                         <Chip
//                           label={sample.action}
//                           color={
//                             sample.action === "created" ? "success" : "info"
//                           }
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell align="right">
//                         {sample.field_count}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Card>
//         )}

//       {/* Back Button */}
//       <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
//         <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }}>
//           Upload New Files
//         </Button>
//       </Stack>
//     </Stack>
//   );
// };

// const MetricCard = ({ title, value, icon }) => (
//   <Card sx={{ p: 2, textAlign: "center", backgroundColor: "#fafafa" }}>
//     <Box sx={{ mb: 1 }}>{icon}</Box>
//     <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
//       {title}
//     </Typography>
//     <Typography variant="h6" sx={{ fontWeight: 700 }}>
//       {value}
//     </Typography>
//   </Card>
// );

// const DetailsDialog = ({ open, type, data, onClose }) => {
//   let content = [];
//   let title = "";

//   if (type === "errors" && data.database_save?.errors) {
//     title = `Errors (${data.database_save.errors.length})`;
//     content = data.database_save.errors;
//   } else if (type === "duplicates" && data.duplicate_unique_ids?.duplicates) {
//     title = `Duplicate Unique IDs (${data.duplicate_unique_ids.duplicate_count})`;
//     content = data.duplicate_unique_ids.duplicates;
//   } else if (type === "warnings" && data.past_month_dismantle_dates?.warnings) {
//     title = `Past Month Warnings (${data.past_month_dismantle_dates.warning_count})`;
//     content = data.past_month_dismantle_dates.warnings;
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
//       <DialogContent
//         sx={{ minHeight: "400px", maxHeight: "600px", overflow: "auto" }}
//       >
//         {type === "errors" && (
//           <Stack spacing={1}>
//             {content.map((error, idx) => (
//               <Alert key={idx} severity="error" sx={{ mb: 1 }}>
//                 {error}
//               </Alert>
//             ))}
//           </Stack>
//         )}

//         {type === "duplicates" && (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
//                   <TableCell align="right" sx={{ fontWeight: 600 }}>
//                     Occurrences
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {content.map((dup, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>{dup.unique_id}</TableCell>
//                     <TableCell align="right">
//                       <Chip label={dup.occurrences} color="warning" />
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         {type === "warnings" && (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                   <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {content.map((warn, idx) => (
//                   <TableRow key={idx}>
//                     <TableCell>{warn.unique_id}</TableCell>
//                     <TableCell>{warn.dismantle_date}</TableCell>
//                     <TableCell>{warn.message}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default DPRControl;


import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
  FolderOutlined as FolderIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../services/FetchNodeServices";

const DPRControl = () => {
  const [circleFiles, setCircleFiles] = useState([]);
  const [milestoneFiles, setMilestoneFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsType, setDetailsType] = useState("");

  const handleCircleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setCircleFiles([...circleFiles, ...newFiles]);
  };

  const handleMilestoneFilesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setMilestoneFiles([...milestoneFiles, ...newFiles]);
  };

  const removeCircleFile = (index) => {
    setCircleFiles(circleFiles.filter((_, i) => i !== index));
  };

  const removeMilestoneFile = (index) => {
    setMilestoneFiles(milestoneFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (circleFiles.length === 0 || milestoneFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Files",
        text: "Please select at least one file from both circle and milestone sections",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();

    circleFiles.forEach((file) => {
      formData.append("circle_files", file);
    });

    milestoneFiles.forEach((file) => {
      formData.append("milestone_file", file);
    });

    try {
      const response = await postData("dpr/merge_circle_dpr/", formData);

      if (response.status) {
        setResponseData(response);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to process files",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCircleFiles([]);
    setMilestoneFiles([]);
    setResponseData(null);
  };

  const downloadFile = () => {
    if (responseData?.download_url) {
      const link = document.createElement("a");
      link.href = responseData.download_url;
      link.click();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!responseData ? (
        <Box
          sx={{
            background: "linear-gradient(135deg, #008B8B 0%, #20B2AA 100%)",
            borderRadius: "20px",
            p: 4,
            position: "relative",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "#ffffff",
              borderRadius: "15px",
              p: 2,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#008B8B",
                letterSpacing: 1,
              }}
            >
              DPR Control
            </Typography>
          </Box>

          <Stack spacing={2}>
            {/* Circle Files Section */}
            <Box
              sx={{
                background: "#ffffff",
                borderRadius: "15px",
                p: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: 2,
                  fontSize: "16px",
                }}
              >
                Select Circle Files:
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  backgroundColor: "#1976D2",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  mb: 2,
                }}
              >
                SELECT FILES
                <input
                  hidden
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleCircleFilesChange}
                  type="file"
                />
              </Button>

              {circleFiles.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {circleFiles.map((file, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#f5f5f5",
                        p: 1.5,
                        borderRadius: 1,
                        flex: "1 0 calc(50% - 8px)",
                        minWidth: "250px",
                        position: "relative",
                      }}
                    >
                      <FolderIcon sx={{ color: "#FF9800", fontSize: 24 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => removeCircleFile(idx)}
                        sx={{
                          color: "#f44336",
                          minWidth: "auto",
                          p: 0.5,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Milestone Files Section */}
            <Box
              sx={{
                background: "#ffffff",
                borderRadius: "15px",
                p: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: 2,
                  fontSize: "16px",
                }}
              >
                Select Milestone Files:
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                sx={{
                  backgroundColor: "#1976D2",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  mb: 2,
                }}
              >
                SELECT FILES
                <input
                  hidden
                  multiple
                  accept=".csv,.xlsx,.xls"
                  onChange={handleMilestoneFilesChange}
                  type="file"
                />
              </Button>

              {milestoneFiles.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {milestoneFiles.map((file, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#f5f5f5",
                        p: 1.5,
                        borderRadius: 1,
                        flex: "1 0 calc(50% - 8px)",
                        minWidth: "250px",
                      }}
                    >
                      <FolderIcon sx={{ color: "#FF9800", fontSize: 24 }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#999" }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => removeMilestoneFile(idx)}
                        sx={{
                          color: "#f44336",
                          minWidth: "auto",
                          p: 0.5,
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Submit and Cancel Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                pt: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "16px",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                  disabled: loading || circleFiles.length === 0 || milestoneFiles.length === 0,
                }}
                disabled={loading || circleFiles.length === 0 || milestoneFiles.length === 0}
                onClick={handleSubmit}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
              >
                {loading ? "PROCESSING..." : "SUBMIT"}
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#F44336",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "16px",
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#da190b",
                  },
                }}
                onClick={handleCancel}
                startIcon={<CloseIcon />}
              >
                CANCEL
              </Button>
            </Box>

            {(circleFiles.length === 0 || milestoneFiles.length === 0) && (
              <Alert severity="info" sx={{ borderRadius: "10px" }}>
                Please select at least one file from both sections to proceed
              </Alert>
            )}
          </Stack>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Dashboard
            data={responseData}
            onBack={handleCancel}
            onDownload={downloadFile}
            onShowDetails={(type) => {
              setDetailsType(type);
              setDetailsOpen(true);
            }}
          />
        </Box>
      )}

      {/* Details Dialog */}
      <DetailsDialog
        open={detailsOpen}
        type={detailsType}
        data={responseData}
        onClose={() => setDetailsOpen(false)}
      />
    </Container>
  );
};

const Dashboard = ({ data, onBack, onDownload, onShowDetails }) => {
  return (
    <Stack spacing={3}>
      {/* Header Section */}
      <Card
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "15px",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              ✓ File Merged Successfully
            </Typography>
            <Typography variant="body1">{data.message}</Typography>
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              whiteSpace: "nowrap",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Download Merged File
          </Button>
        </Stack>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Rows"
            value={data.total_rows?.toLocaleString()}
            icon={<CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Records Updated"
            value={data.database_save?.updated?.toLocaleString()}
            icon={<CheckCircleIcon sx={{ color: "#2196F3", fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Records Failed"
            value={data.database_save?.failed?.toLocaleString()}
            icon={<ErrorIcon sx={{ color: "#F44336", fontSize: 32 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Duplicate IDs"
            value={data.duplicate_unique_ids?.duplicate_count}
            icon={<WarningIcon sx={{ color: "#FF9800", fontSize: 32 }} />}
          />
        </Grid>
      </Grid>

      {/* Database Save Summary */}
      <Card sx={{ p: 3, borderRadius: "15px" }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Database Save Summary
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Records Created</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {data.database_save?.created}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={
                (data.database_save?.created /
                  (data.database_save?.created +
                    data.database_save?.updated +
                    data.database_save?.failed)) *
                  100 || 0
              }
              sx={{ backgroundColor: "#e0e0e0", borderRadius: "5px" }}
              color="success"
            />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Records Updated</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {data.database_save?.updated}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={
                (data.database_save?.updated /
                  (data.database_save?.created +
                    data.database_save?.updated +
                    data.database_save?.failed)) *
                  100 || 0
              }
              sx={{ backgroundColor: "#e0e0e0", borderRadius: "5px" }}
              color="info"
            />
          </Box>
          <Box>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body2">Records Failed</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {data.database_save?.failed}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={
                (data.database_save?.failed /
                  (data.database_save?.created +
                    data.database_save?.updated +
                    data.database_save?.failed)) *
                  100 || 0
              }
              sx={{ backgroundColor: "#e0e0e0", borderRadius: "5px" }}
              color="error"
            />
          </Box>
          <Box sx={{ mt: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#666" }}>
              {data.database_save?.summary}
            </Typography>
            <Typography variant="caption" sx={{ color: "#999" }}>
              Batch ID: {data.database_save?.batch_id}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Errors Section */}
      {data.database_save?.errors && data.database_save.errors.length > 0 && (
        <Card sx={{ p: 3, backgroundColor: "#ffebee", borderRadius: "15px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#c62828" }}>
              <ErrorIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Errors ({data.database_save.errors.length})
            </Typography>
            <Button size="small" onClick={() => onShowDetails("errors")}>
              View All
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {data.database_save.errors.slice(0, 5).map((error, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: "#c62828" }}>{error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Duplicate IDs Section */}
      {data.duplicate_unique_ids?.duplicate_count > 0 && (
        <Card sx={{ p: 3, backgroundColor: "#fff3e0", borderRadius: "15px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#e65100" }}>
              <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Duplicate Unique IDs ({data.duplicate_unique_ids.duplicate_count})
            </Typography>
            <Button size="small" onClick={() => onShowDetails("duplicates")}>
              View All
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#ffe0b2" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Occurrences
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.duplicate_unique_ids.duplicates
                  .slice(0, 5)
                  .map((dup, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{dup.unique_id}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={dup.occurrences}
                          color="warning"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Past Month Warnings */}
      {data.past_month_dismantle_dates?.warning_count > 0 && (
        <Card sx={{ p: 3, backgroundColor: "#e3f2fd", borderRadius: "15px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1565c0" }}>
              <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Past Month Dismantle Dates (
              {data.past_month_dismantle_dates.warning_count})
            </Typography>
            <Button size="small" onClick={() => onShowDetails("warnings")}>
              View All
            </Button>
          </Stack>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#bbdefb" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.past_month_dismantle_dates.warnings
                  .slice(0, 5)
                  .map((warn, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{warn.unique_id}</TableCell>
                      <TableCell>{warn.dismantle_date}</TableCell>
                      <TableCell>{warn.message}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Sample Details */}
      {data.database_save?.sample_details &&
        data.database_save.sample_details.length > 0 && (
          <Card sx={{ p: 3, borderRadius: "15px" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Sample Processed Records
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Fields Updated
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.database_save.sample_details.map((sample, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{sample.unique_id}</TableCell>
                      <TableCell>
                        <Chip
                          label={sample.action}
                          color={
                            sample.action === "created" ? "success" : "info"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {sample.field_count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

      {/* Back Button */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ pt: 2 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            minWidth: 120,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Upload New Files
        </Button>
      </Stack>
    </Stack>
  );
};

const MetricCard = ({ title, value, icon }) => (
  <Card
    sx={{
      p: 2,
      textAlign: "center",
      backgroundColor: "#fafafa",
      borderRadius: "15px",
    }}
  >
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography variant="caption" sx={{ color: "#666", display: "block", mb: 0.5 }}>
      {title}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 700 }}>
      {value}
    </Typography>
  </Card>
);

const DetailsDialog = ({ open, type, data, onClose }) => {
  let content = [];
  let title = "";

  if (type === "errors" && data.database_save?.errors) {
    title = `Errors (${data.database_save.errors.length})`;
    content = data.database_save.errors;
  } else if (type === "duplicates" && data.duplicate_unique_ids?.duplicates) {
    title = `Duplicate Unique IDs (${data.duplicate_unique_ids.duplicate_count})`;
    content = data.duplicate_unique_ids.duplicates;
  } else if (type === "warnings" && data.past_month_dismantle_dates?.warnings) {
    title = `Past Month Warnings (${data.past_month_dismantle_dates.warning_count})`;
    content = data.past_month_dismantle_dates.warnings;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "15px" },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent
        sx={{ minHeight: "400px", maxHeight: "600px", overflow: "auto" }}
      >
        {type === "errors" && (
          <Stack spacing={1}>
            {content.map((error, idx) => (
              <Alert key={idx} severity="error" sx={{ mb: 1, borderRadius: "8px" }}>
                {error}
              </Alert>
            ))}
          </Stack>
        )}

        {type === "duplicates" && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Occurrences
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((dup, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{dup.unique_id}</TableCell>
                    <TableCell align="right">
                      <Chip label={dup.occurrences} color="warning" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {type === "warnings" && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Unique ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((warn, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{warn.unique_id}</TableCell>
                    <TableCell>{warn.dismantle_date}</TableCell>
                    <TableCell>{warn.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DPRControl;