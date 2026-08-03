

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Grid,
//     Box,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     IconButton,
//     Slide,
//     Breadcrumbs, Link, Typography, Button
// } from '@mui/material';
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import FolderIcon from '@mui/icons-material/Folder';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";
// import TopicIcon from '@mui/icons-material/Topic';
// import OverAllCss from "../../../csss/OverAllCss";
// import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const jsonData = [
//     { folder_name: "Performance AT TAT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" },
//     { folder_name: "Performance AT Pending Aging", api: "performance_tat/upload", back_folder:"performance_tat" },
//     { folder_name: "KPI Trend", api: "kpi_monitoring/upload/", back_folder:"kpi_monitoring" }
// ];

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return (
//         <Slide
//             direction="down"
//             timeout={2500}
//             style={{ transformOrigin: '0 0 0' }}
//             mountOnEnter
//             unmountOnExit
//             ref={ref}
//             {...props}
//         />
//     );
// });

// const File_Manager = () => {
//     const [open2, setOpen2] = useState(false);
//         const [dialogData, setDialogData] = useState()
//         const navigate = useNavigate()
//         const { loading, action } = useLoadingDialog();
//         const [showFiles, setShoweFiles] = useState([])
//         const [selectFiles, setSeletctFiles] = useState([])
//         const [showError, setShowError] = useState({
//             selectfile: false,
//         });

//         // ✅ FIX 1: use try/finally so action(false) ALWAYS runs
//         // even when GET returns "Method not allowed" — this stops the frozen loader
//         const fetchApiData = async (api) => {
//             action(true)
//             try {
//                 const response = await getData(`${api}/`);
//                 console.log("API response:", response);  // <-- log the full response for debugging
//                 if (response?.status) {
//                     setShoweFiles([response?.input_file?.filename]);
//                 }
//             } finally {
//                 action(false);  // ← always stops loader regardless of response
//             }
//         }
    
//         const handleOpen = (foldername, apikey , back_folder) => {
//             fetchApiData(apikey)
//             setOpen2(true);
//             setDialogData({ foldername: foldername, apikey: apikey , back_folder: back_folder })
//             // console.log('data', foldername, apikey)
//         }

//         const handleClose = () => {
//             setOpen2(false);
//             setShoweFiles([])
//             setDialogData()
//             setShowError({ selectfile: false })
//             setSeletctFiles([])
//         }
    
//         const handleSubmit = async (api) => {
//             const isValid = selectFiles.length > 0;
    
//             if (!isValid) {
//                 setShowError({
//                     selectfile: selectFiles.length === 0,
//                 });
//                 return;
//             }
    
//             action(true);
//             const formData = new FormData();
//             Array.from(selectFiles).forEach((file) => {
//                 formData.append("file", file);
//             });
//             const response = await postData(`${api}/`, formData);
//             // const response = await postData(`idploy/upload/`, formData);
//             action(false);

//             // ✅ FIX 2: backend returns {message, status:true} — check both to be safe
//             if (response?.status || response?.message) {
//                 fetchApiData(api);
//                 setShowError({ selectfile: false })  // ✅ FIX 3: was incorrectly set to true
//                 setSeletctFiles([])
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//             }
//         }

//         const handleDelete = async (api) => {
//             const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: "This action cannot be undone!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`${api}/`);
//                 // const response = await deleteData("idploy/cleanup/");
//                 console.log("response", response);
    
//                 action(false);
    
//                 if (response?.status) {
//                     setShoweFiles([]);
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         };
    
//         const OneFileDelete = async(fileName,api,back_folder) => {
//            const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: `Want to delete ${fileName} file!`,
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`performance_idploy/upload/`, {
//                     data: { filename: `${fileName}`, foldername: `${back_folder}`}
//                 });
    
//                 action(false);
//                 if (response?.status) {
//                     fetchApiData(api)
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         }
    
//         useEffect(() => {
//             const title = window.location.pathname
//                 .slice(1)
//                 .replaceAll("_", " ")
//                 .replaceAll("/", " | ")
//                 .toUpperCase();
//             document.title = title;
//         }, []);
    
//   return (
//     <> 
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At</Link>
//                     <Typography color="text.primary">File Manager</Typography>
//                 </Breadcrumbs>
//             </Box>
//             <Box sx={{ margin: '20px' }}>
//                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                     {jsonData.map((item, index) => (
//                         <Grid item xs={4} key={index}>
//                             <Box
//                                 onClick={() => handleOpen(item.folder_name, item.api, item.back_folder)}
//                                 sx={{
//                                     border: '1px solid black',
//                                     cursor: 'pointer',
//                                     display: 'flex',
//                                     gap: '10px',
//                                     padding: 1,
//                                     alignItems: 'center',
//                                     borderRadius: '5px',
//                                     boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
//                                     '&:hover': { backgroundColor: '#223354', color: 'white' },
//                                 }}
//                             >
//                                 <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
//                                 <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>

//             {/* Dialog Rendered Normally */}
//             {open2 && <Dialog
//                 fullWidth
//                 maxWidth="lg"
//                 TransitionComponent={Transition}
//                 open={open2}
//                 onClose={handleClose}
//                 sx={{ zIndex: 2 }}
//             >
//                 <DialogTitle>
//                     <span style={{ float: 'left' }}>
//                         <h2>{dialogData.foldername}</h2>
//                     </span>
//                     <span style={{ float: 'right' }}>
//                         <IconButton size="large" onClick={handleClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </span>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
//                         <Box>
//                             <UploadSection
//                                 // label="Select Mobinet Dump Files"
//                                 color={selectFiles.length > 0 ? "warning" : "primary"}
//                                 multiple
//                                 onChange={(e) => {
//                                     setSeletctFiles(Array.from(e.target.files))
//                                     setShowError((prev) => ({ ...prev, selectfile: false }));
//                                 }}
//                                 error={showError?.selectfile}
//                                 selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
//                             />
//                         </Box>
//                         <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
//                     </Box>
//                     {showFiles?.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                         <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                             {showFiles?.map((item, index) => (
//                                 <Grid item xs={4} key={index}>
//                                     <Box key={item} sx={{ display: "flex", 
//                                     justifyContent: 'flex-start', alignItems: 'center', 
//                                     cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
//                                      padding: 0.5, background: '#e9e9e9',
//                                      '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                      }}
//                                         onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
//                                     >
//                                         <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                                     </Box>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                             <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                         </Box>
//                     </Box>}
//                 </DialogContent>
//             </Dialog>}

//             {loading}
//         </>
//     );
// };

// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
//     return (
//         <Box >
//             <div className={OverAllCss().Front_Box_Hading}>{label}</div>
//             <div className={OverAllCss().Front_Box_Select_Button}>
//                 <Button variant="contained" component="label" color={color}>
//                     Select File
//                     <input
//                         hidden
//                         required
//                         type="file"
//                         accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
//                         multiple={multiple}
//                         onChange={onChange}
//                     />
//                 </Button>
//                 {selectedText && (
//                     <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//                         {selectedText}
//                     </span>
//                 )}
//                 {error && (
//                     <div>
//                         <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//                     </div>
//                 )}
//             </div>
//         </Box>
//     )
// }

// export default File_Manager

// import React, { useState, useEffect } from 'react';
// import {
//     Grid,
//     Box,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     IconButton,
//     Slide,
//     Breadcrumbs, Link, Typography, Button,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
//     Chip,
// } from '@mui/material';
// import {
//     Upload as UploadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import FolderIcon from '@mui/icons-material/Folder';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";
// import TopicIcon from '@mui/icons-material/Topic';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import OverAllCss from "../../../csss/OverAllCss";
// import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // KPI Trend uses a different upload contract: one form-data key per vendor
// // ("ericsson" | "nokia" | "samsung") instead of a generic "file" list.
// const KPI_VENDORS = [
//     { key: "ericsson", label: "Ericsson" },
//     { key: "nokia",    label: "Nokia"    },
//     { key: "samsung",  label: "Samsung"  },
// ];

// const jsonData = [
//     { folder_name: "Performance AT TAT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" },
//     { folder_name: "Performance AT Pending Aging", api: "performance_tat/upload", back_folder:"performance_tat" },
//     { folder_name: "KPI Trend", api: "kpi_monitoring/upload", back_folder:"kpi_monitoring", isMultiVendor: true, vendors: KPI_VENDORS },
// ];

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return (
//         <Slide
//             direction="down"
//             timeout={2500}
//             style={{ transformOrigin: '0 0 0' }}
//             mountOnEnter
//             unmountOnExit
//             ref={ref}
//             {...props}
//         />
//     );
// });

// const File_Manager = () => {
//     const [open2, setOpen2] = useState(false);
//         const [dialogData, setDialogData] = useState()
//         const navigate = useNavigate()
//         const { loading, action } = useLoadingDialog();
//         const [showFiles, setShoweFiles] = useState([])
//         const [selectFiles, setSeletctFiles] = useState([])
//         const [showError, setShowError] = useState({
//             selectfile: false,
//         });

//         // Vendor-specific upload state (KPI Trend only)
//         const [selectedVendor, setSelectedVendor] = useState(KPI_VENDORS[0].key);
//         const [vendorFile, setVendorFile] = useState(null);

//         // ✅ FIX 1: use try/finally so action(false) ALWAYS runs
//         // even when GET returns "Method not allowed" — this stops the frozen loader
//         const fetchApiData = async (api, isMultiVendor = false) => {
//             action(true)
//             try {
//                 const response = await getData(`${api}/`);
//                 console.log("API response:", response);  // <-- log the full response for debugging
//                 if (response?.status) {
//                     if (isMultiVendor) {
//                         // Shape: { status, message, files: { ericsson: {filename, rows_read}, nokia: {...}, samsung: {...} } }
//                         const filesObj = response?.files || {};
//                         const vendorFiles = Object.entries(filesObj).map(([vendor, info]) => ({
//                             vendor,
//                             filename: info?.filename,
//                             rows_read: info?.rows_read,
//                         }));
//                         setShoweFiles(vendorFiles);
//                     } else {
//                         setShoweFiles([response?.input_file?.filename]);
//                     }
//                 } else {
//                     setShoweFiles([]);
//                 }
//             } finally {
//                 action(false);  // ← always stops loader regardless of response
//             }
//         }
    
//         const handleOpen = (item) => {
//             fetchApiData(item.api, item.isMultiVendor)
//             setOpen2(true);
//             setDialogData({
//                 foldername: item.folder_name,
//                 apikey: item.api,
//                 back_folder: item.back_folder,
//                 isMultiVendor: !!item.isMultiVendor,
//                 vendors: item.vendors || [],
//             })
//             setSelectedVendor(item.vendors?.[0]?.key || KPI_VENDORS[0].key);
//             setVendorFile(null);
//         }

//         const handleClose = () => {
//             setOpen2(false);
//             setShoweFiles([])
//             setDialogData()
//             setShowError({ selectfile: false })
//             setSeletctFiles([])
//             setVendorFile(null)
//             setSelectedVendor(KPI_VENDORS[0].key)
//         }
    
//         // Used by folders that upload a generic multi-file batch under a "file" key
//         const handleSubmit = async (api) => {
//             const isValid = selectFiles.length > 0;
    
//             if (!isValid) {
//                 setShowError({
//                     selectfile: selectFiles.length === 0,
//                 });
//                 return;
//             }
    
//             action(true);
//             const formData = new FormData();
//             Array.from(selectFiles).forEach((file) => {
//                 formData.append("file", file);
//             });
//             const response = await postData(`${api}/`, formData);
//             // const response = await postData(`idploy/upload/`, formData);
//             action(false);

//             // ✅ FIX 2: backend returns {message, status:true} — check both to be safe
//             if (response?.status || response?.message) {
//                 fetchApiData(api);
//                 setShowError({ selectfile: false })  // ✅ FIX 3: was incorrectly set to true
//                 setSeletctFiles([])
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//             }
//         }

//         // Used only by KPI Trend: uploads ONE vendor's file under its own key
//         // (form-data key = "ericsson" | "nokia" | "samsung")
//         const handleVendorSubmit = async () => {
//             if (!vendorFile) {
//                 setShowError({ selectfile: true });
//                 return;
//             }

//             action(true);
//             const formData = new FormData();
//             formData.append(selectedVendor, vendorFile);
//             const response = await postData(`${dialogData.apikey}/`, formData);
//             action(false);

//             if (response?.status || response?.message) {
//                 fetchApiData(dialogData.apikey, true);
//                 setShowError({ selectfile: false });
//                 setVendorFile(null);
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response?.message });
//             }
//         }

//         const handleDelete = async (api) => {
//             const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: "This action cannot be undone!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`${api}/`);
//                 // const response = await deleteData("idploy/cleanup/");
//                 console.log("response", response);
    
//                 action(false);
    
//                 if (response?.status) {
//                     setShoweFiles([]);
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         };
    
//         // ✅ FIX: was hardcoded to "performance_idploy/upload/" for every folder — now
//         // uses the folder's own api, and passes "vendor" so backend can identify which
//         // vendor slot to clear for KPI Trend.
//         const OneFileDelete = async (fileName, api, back_folder, vendor) => {
//            const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: `Want to delete ${fileName} file!`,
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);

//                 const body = { filename: `${fileName}`, foldername: `${back_folder}` };
//                 if (vendor) body.vendor = vendor;

//                 const response = await deleteData(`${api}/`, { data: body });
    
//                 action(false);
//                 if (response?.status) {
//                     fetchApiData(api, !!vendor)
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         }
    
//         useEffect(() => {
//             const title = window.location.pathname
//                 .slice(1)
//                 .replaceAll("_", " ")
//                 .replaceAll("/", " | ")
//                 .toUpperCase();
//             document.title = title;
//         }, []);

//         // Quick lookup: which vendors already have a file uploaded (for the KPI dialog)
//         const uploadedVendorKeys = showFiles.map((f) => f.vendor);

//   return (
//     <> 
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At</Link>
//                     <Typography color="text.primary">File Manager</Typography>
//                 </Breadcrumbs>
//             </Box>
//             <Box sx={{ margin: '20px' }}>
//                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                     {jsonData.map((item, index) => (
//                         <Grid item xs={4} key={index}>
//                             <Box
//                                 onClick={() => handleOpen(item)}
//                                 sx={{
//                                     border: '1px solid black',
//                                     cursor: 'pointer',
//                                     display: 'flex',
//                                     gap: '10px',
//                                     padding: 1,
//                                     alignItems: 'center',
//                                     borderRadius: '5px',
//                                     boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
//                                     '&:hover': { backgroundColor: '#223354', color: 'white' },
//                                 }}
//                             >
//                                 <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
//                                 <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>

//             {/* Dialog Rendered Normally */}
//             {open2 && <Dialog
//                 fullWidth
//                 maxWidth="lg"
//                 TransitionComponent={Transition}
//                 open={open2}
//                 onClose={handleClose}
//                 sx={{ zIndex: 2 }}
//             >
//                 <DialogTitle>
//                     <span style={{ float: 'left' }}>
//                         <h2>{dialogData.foldername}</h2>
//                     </span>
//                     <span style={{ float: 'right' }}>
//                         <IconButton size="large" onClick={handleClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </span>
//                 </DialogTitle>
//                 <DialogContent>

//                     {dialogData?.isMultiVendor ? (
//                         // ---------- KPI Trend: vendor dropdown + single-file upload ----------
//                         <>
//                             <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
//                                 <FormControl size="small" sx={{ minWidth: 200 }}>
//                                     <InputLabel id="vendor-select-label">Select Vendor</InputLabel>
//                                     <Select
//                                         labelId="vendor-select-label"
//                                         label="Select Vendor"
//                                         value={selectedVendor}
//                                         onChange={(e) => {
//                                             setSelectedVendor(e.target.value);
//                                             setVendorFile(null);
//                                             setShowError((prev) => ({ ...prev, selectfile: false }));
//                                         }}
//                                     >
//                                         {dialogData.vendors.map((v) => (
//                                             <MenuItem key={v.key} value={v.key}>
//                                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                     {uploadedVendorKeys.includes(v.key)
//                                                         ? <CheckCircleIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
//                                                         : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />}
//                                                     {v.label}
//                                                 </Box>
//                                             </MenuItem>
//                                         ))}
//                                     </Select>
//                                 </FormControl>

//                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                     <Button variant="contained" component="label" color={vendorFile ? "warning" : "primary"}>
//                                         Select {dialogData.vendors.find((v) => v.key === selectedVendor)?.label} File
//                                         <input
//                                             hidden
//                                             type="file"
//                                             accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
//                                             onChange={(e) => {
//                                                 setVendorFile(e.target.files?.[0] || null);
//                                                 setShowError((prev) => ({ ...prev, selectfile: false }));
//                                             }}
//                                         />
//                                     </Button>
//                                     {vendorFile && (
//                                         <span style={{ color: "green", fontSize: 14, fontWeight: 600 }}>
//                                             Selected: {vendorFile.name}
//                                         </span>
//                                     )}
//                                     {showError?.selectfile && (
//                                         <span style={{ color: "red", fontSize: 13, fontWeight: 600 }}>
//                                             This Field Is Required!
//                                         </span>
//                                     )}
//                                 </Box>

//                                 <Button
//                                     variant="contained"
//                                     color="success"
//                                     onClick={handleVendorSubmit}
//                                     endIcon={<UploadIcon />}
//                                     sx={{ height: 40 }}
//                                 >
//                                     Upload
//                                 </Button>
//                             </Box>

//                             {showFiles?.length > 0 && (
//                                 <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                                     <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                                         {showFiles.map((f, index) => (
//                                             <Grid item xs={4} key={`${f.vendor}-${index}`}>
//                                                 <Box
//                                                     sx={{
//                                                         display: "flex",
//                                                         flexDirection: 'column',
//                                                         justifyContent: 'flex-start',
//                                                         cursor: 'pointer',
//                                                         border: '0px solid black',
//                                                         borderRadius: '5px',
//                                                         padding: 1,
//                                                         background: '#e9e9e9',
//                                                         '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                                     }}
//                                                     onClick={() => OneFileDelete(f.filename, dialogData?.apikey, dialogData?.back_folder, f.vendor)}
//                                                 >
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                         <TopicIcon sx={{ color: '#FEA405' }} />
//                                                         <b>{dialogData.vendors.find((v) => v.key === f.vendor)?.label || f.vendor}</b>
//                                                     </Box>
//                                                     <Box sx={{ fontSize: 13, marginTop: 0.5, wordBreak: 'break-all' }}>{f.filename}</Box>
//                                                     {f.rows_read !== undefined && (
//                                                         <Chip label={`${f.rows_read} rows`} size="small" sx={{ marginTop: 0.5, width: 'fit-content' }} />
//                                                     )}
//                                                 </Box>
//                                             </Grid>
//                                         ))}
//                                     </Grid>
//                                     <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                                         <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                                     </Box>
//                                 </Box>
//                             )}
//                         </>
//                     ) : (
//                         // ---------- Other folders: generic multi-file upload ----------
//                         <>
//                             <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
//                                 <Box>
//                                     <UploadSection
//                                         // label="Select Mobinet Dump Files"
//                                         color={selectFiles.length > 0 ? "warning" : "primary"}
//                                         multiple
//                                         onChange={(e) => {
//                                             setSeletctFiles(Array.from(e.target.files))
//                                             setShowError((prev) => ({ ...prev, selectfile: false }));
//                                         }}
//                                         error={showError?.selectfile}
//                                         selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
//                                     />
//                                 </Box>
//                                 <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
//                             </Box>
//                             {showFiles?.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                                     {showFiles?.map((item, index) => (
//                                         <Grid item xs={4} key={index}>
//                                             <Box key={item} sx={{ display: "flex", 
//                                             justifyContent: 'flex-start', alignItems: 'center', 
//                                             cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
//                                              padding: 0.5, background: '#e9e9e9',
//                                              '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                              }}
//                                                 onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
//                                             >
//                                                 <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                                             </Box>
//                                         </Grid>
//                                     ))}
//                                 </Grid>
//                                 <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                                     <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                                 </Box>
//                             </Box>}
//                         </>
//                     )}

//                 </DialogContent>
//             </Dialog>}

//             {loading}
//         </>
//     );
// };

// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
//     return (
//         <Box >
//             <div className={OverAllCss().Front_Box_Hading}>{label}</div>
//             <div className={OverAllCss().Front_Box_Select_Button}>
//                 <Button variant="contained" component="label" color={color}>
//                     Select File
//                     <input
//                         hidden
//                         required
//                         type="file"
//                         accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
//                         multiple={multiple}
//                         onChange={onChange}
//                     />
//                 </Button>
//                 {selectedText && (
//                     <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//                         {selectedText}
//                     </span>
//                 )}
//                 {error && (
//                     <div>
//                         <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//                     </div>
//                 )}
//             </div>
//         </Box>
//     )
// }

// export default File_Manager

// import React, { useState, useEffect } from 'react';
// import {
//     Grid,
//     Box,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     IconButton,
//     Slide,
//     Breadcrumbs, Link, Typography, Button,
//     Chip,
// } from '@mui/material';
// import {
//     Upload as UploadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import FolderIcon from '@mui/icons-material/Folder';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";
// import TopicIcon from '@mui/icons-material/Topic';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import OverAllCss from "../../../csss/OverAllCss";
// import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// // KPI Trend uses a different upload contract: one form-data key per vendor
// // ("ericsson" | "nokia" | "samsung") instead of a generic "file" list.
// // All three keys can be sent together in a single multipart POST — the
// // backend returns the full files map either way, so we now let the user
// // pick all three files first and upload them in one request.
// const KPI_VENDORS = [
//     { key: "ericsson", label: "Ericsson" },
//     { key: "nokia",    label: "Nokia"    },
//     { key: "samsung",  label: "Samsung"  },
// ];

// const EMPTY_VENDOR_FILES = KPI_VENDORS.reduce((acc, v) => ({ ...acc, [v.key]: null }), {});

// const jsonData = [
//     { folder_name: "Performance AT TAT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" },
//     { folder_name: "Performance AT Pending Aging", api: "performance_tat/upload", back_folder:"performance_tat" },
//     { folder_name: "KPI Trend", api: "kpi_monitoring/upload", back_folder:"kpi_monitoring", isMultiVendor: true, vendors: KPI_VENDORS },
// ];

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return (
//         <Slide
//             direction="down"
//             timeout={2500}
//             style={{ transformOrigin: '0 0 0' }}
//             mountOnEnter
//             unmountOnExit
//             ref={ref}
//             {...props}
//         />
//     );
// });

// const File_Manager = () => {
//     const [open2, setOpen2] = useState(false);
//         const [dialogData, setDialogData] = useState()
//         const navigate = useNavigate()
//         const { loading, action } = useLoadingDialog();
//         const [showFiles, setShoweFiles] = useState([])
//         const [selectFiles, setSeletctFiles] = useState([])
//         const [showError, setShowError] = useState({
//             selectfile: false,
//         });

//         // Vendor-specific upload state (KPI Trend only).
//         // Holds one File (or null) per vendor key so all 3 can be picked
//         // before a single "Upload" click sends them together.
//         const [vendorFiles, setVendorFiles] = useState(EMPTY_VENDOR_FILES);
//         const [vendorErrors, setVendorErrors] = useState({});

//         // ✅ FIX 1: use try/finally so action(false) ALWAYS runs
//         // even when GET returns "Method not allowed" — this stops the frozen loader
//         const fetchApiData = async (api, isMultiVendor = false) => {
//             action(true)
//             try {
//                 const response = await getData(`${api}/`);
//                 console.log("API response:", response);  // <-- log the full response for debugging
//                 if (response?.status) {
//                     if (isMultiVendor) {
//                         // Shape: { status, message, files: { ericsson: {filename, rows_read}, nokia: {...}, samsung: {...} } }
//                         const filesObj = response?.files || {};
//                         const vendorFilesList = Object.entries(filesObj).map(([vendor, info]) => ({
//                             vendor,
//                             filename: info?.filename,
//                             rows_read: info?.rows_read,
//                         }));
//                         setShoweFiles(vendorFilesList);
//                     } else {
//                         setShoweFiles([response?.input_file?.filename]);
//                     }
//                 } else {
//                     setShoweFiles([]);
//                 }
//             } finally {
//                 action(false);  // ← always stops loader regardless of response
//             }
//         }
    
//         // NOTE: KPI Trend's endpoint (kpi_monitoring/upload/) only supports POST —
//         // there is no GET/list endpoint for it (confirmed: GET returns 404, seen
//         // in the network tab). So for multi-vendor folders we DON'T call
//         // fetchApiData on open; the file list only gets populated from each
//         // upload's own response (see handleVendorSubmit below).
//         const handleOpen = (item) => {
//             if (!item.isMultiVendor) {
//                 fetchApiData(item.api, false)
//             } else {
//                 setShoweFiles([]);
//             }
//             setOpen2(true);
//             setDialogData({
//                 foldername: item.folder_name,
//                 apikey: item.api,
//                 back_folder: item.back_folder,
//                 isMultiVendor: !!item.isMultiVendor,
//                 vendors: item.vendors || [],
//             })
//             setVendorFiles(EMPTY_VENDOR_FILES);
//             setVendorErrors({});
//         }

//         const handleClose = () => {
//             setOpen2(false);
//             setShoweFiles([])
//             setDialogData()
//             setShowError({ selectfile: false })
//             setSeletctFiles([])
//             setVendorFiles(EMPTY_VENDOR_FILES);
//             setVendorErrors({});
//         }
    
//         // Used by folders that upload a generic multi-file batch under a "file" key
//         const handleSubmit = async (api) => {
//             const isValid = selectFiles.length > 0;
    
//             if (!isValid) {
//                 setShowError({
//                     selectfile: selectFiles.length === 0,
//                 });
//                 return;
//             }
    
//             action(true);
//             const formData = new FormData();
//             Array.from(selectFiles).forEach((file) => {
//                 formData.append("file", file);
//             });
//             const response = await postData(`${api}/`, formData);
//             // const response = await postData(`idploy/upload/`, formData);
//             action(false);

//             // ✅ FIX 2: backend returns {message, status:true} — check both to be safe
//             if (response?.status || response?.message) {
//                 fetchApiData(api);
//                 setShowError({ selectfile: false })  // ✅ FIX 3: was incorrectly set to true
//                 setSeletctFiles([])
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//             }
//         }

//         // Called when the user picks a file for one vendor slot.
//         const handleVendorFileChange = (vendorKey, file) => {
//             setVendorFiles((prev) => ({ ...prev, [vendorKey]: file }));
//             setVendorErrors((prev) => ({ ...prev, [vendorKey]: false }));
//         }

//         // Used only by KPI Trend: uploads ALL selected vendor files together
//         // in a single multipart request (form-data keys = "ericsson" / "nokia" / "samsung",
//         // only the ones the user actually picked are included).
//         // We build the file list straight from THIS response instead of calling
//         // fetchApiData afterwards — there's no GET endpoint for this API, so
//         // re-fetching would just 404.
//         const handleVendorSubmit = async () => {
//             const selectedEntries = Object.entries(vendorFiles).filter(([, file]) => !!file);

//             if (selectedEntries.length === 0) {
//                 // Nothing picked at all — flag every slot as required.
//                 const allErrors = KPI_VENDORS.reduce((acc, v) => ({ ...acc, [v.key]: true }), {});
//                 setVendorErrors(allErrors);
//                 return;
//             }

//             action(true);
//             const formData = new FormData();
//             selectedEntries.forEach(([vendorKey, file]) => {
//                 formData.append(vendorKey, file);
//             });
//             const response = await postData(`${dialogData.apikey}/`, formData);
//             action(false);

//             if (response?.status || response?.message) {
//                 // Shape: { status, message, files: { ericsson: {filename, rows_read}, ... } }
//                 const filesObj = response?.files || {};
//                 const vendorFilesList = Object.entries(filesObj).map(([vendor, info]) => ({
//                     vendor,
//                     filename: info?.filename,
//                     rows_read: info?.rows_read,
//                 }));
//                 setShoweFiles(vendorFilesList);
//                 setVendorErrors({});
//                 setVendorFiles(EMPTY_VENDOR_FILES);
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response?.message });
//             }
//         }

//         const handleDelete = async (api) => {
//             const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: "This action cannot be undone!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`${api}/`);
//                 // const response = await deleteData("idploy/cleanup/");
//                 console.log("response", response);
    
//                 action(false);
    
//                 if (response?.status) {
//                     setShoweFiles([]);
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         };
    
//         // ✅ FIX: was hardcoded to "performance_idploy/upload/" for every folder — now
//         // uses the folder's own api, and passes "vendor" so backend can identify which
//         // vendor slot to clear for KPI Trend.
//         const OneFileDelete = async (fileName, api, back_folder, vendor) => {
//            const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: `Want to delete ${fileName} file!`,
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);

//                 const body = { filename: `${fileName}`, foldername: `${back_folder}` };
//                 if (vendor) body.vendor = vendor;

//                 const response = await deleteData(`${api}/`, { data: body });
    
//                 action(false);
//                 if (response?.status) {
//                     if (vendor) {
//                         // No GET endpoint for KPI Trend — just drop it locally.
//                         setShoweFiles((prev) => prev.filter((f) => f.vendor !== vendor));
//                     } else {
//                         fetchApiData(api, false)
//                     }
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         }
    
//         useEffect(() => {
//             const title = window.location.pathname
//                 .slice(1)
//                 .replaceAll("_", " ")
//                 .replaceAll("/", " | ")
//                 .toUpperCase();
//             document.title = title;
//         }, []);

//         // Quick lookup: which vendors already have a file uploaded (for the KPI dialog)
//         const uploadedVendorKeys = showFiles.map((f) => f.vendor);

//   return (
//     <> 
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At</Link>
//                     <Typography color="text.primary">File Manager</Typography>
//                 </Breadcrumbs>
//             </Box>
//             <Box sx={{ margin: '20px' }}>
//                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                     {jsonData.map((item, index) => (
//                         <Grid item xs={4} key={index}>
//                             <Box
//                                 onClick={() => handleOpen(item)}
//                                 sx={{
//                                     border: '1px solid black',
//                                     cursor: 'pointer',
//                                     display: 'flex',
//                                     gap: '10px',
//                                     padding: 1,
//                                     alignItems: 'center',
//                                     borderRadius: '5px',
//                                     boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
//                                     '&:hover': { backgroundColor: '#223354', color: 'white' },
//                                 }}
//                             >
//                                 <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
//                                 <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>

//             {/* Dialog Rendered Normally */}
//             {open2 && <Dialog
//                 fullWidth
//                 maxWidth="lg"
//                 TransitionComponent={Transition}
//                 open={open2}
//                 onClose={handleClose}
//                 sx={{ zIndex: 2 }}
//             >
//                 <DialogTitle>
//                     <span style={{ float: 'left' }}>
//                         <h2>{dialogData.foldername}</h2>
//                     </span>
//                     <span style={{ float: 'right' }}>
//                         <IconButton size="large" onClick={handleClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </span>
//                 </DialogTitle>
//                 <DialogContent>

//                     {dialogData?.isMultiVendor ? (
//                         // ---------- KPI Trend: pick all 3 vendor files, upload together ----------
//                         <>
//                             <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2 }}>
//                                 <Grid container spacing={2}>
//                                     {dialogData.vendors.map((v) => {
//                                         const alreadyUploaded = uploadedVendorKeys.includes(v.key);
//                                         const picked = vendorFiles[v.key];
//                                         return (
//                                             <Grid item xs={12} md={4} key={v.key}>
//                                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, border: '1px solid #ccc', borderRadius: '5px', padding: 1.5, height: '100%' }}>
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
//                                                         {alreadyUploaded
//                                                             ? <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
//                                                             : <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />}
//                                                         {v.label}
//                                                     </Box>
//                                                     <Button
//                                                         variant="contained"
//                                                         component="label"
//                                                         size="small"
//                                                         color={picked ? "warning" : "primary"}
//                                                     >
//                                                         Select {v.label} File
//                                                         <input
//                                                             hidden
//                                                             type="file"
//                                                             accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
//                                                             onChange={(e) => handleVendorFileChange(v.key, e.target.files?.[0] || null)}
//                                                         />
//                                                     </Button>
//                                                     {picked && (
//                                                         <span style={{ color: "green", fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}>
//                                                             Selected: {picked.name}
//                                                         </span>
//                                                     )}
//                                                     {vendorErrors?.[v.key] && (
//                                                         <span style={{ color: "red", fontSize: 12, fontWeight: 600 }}>
//                                                             This Field Is Required!
//                                                         </span>
//                                                     )}
//                                                 </Box>
//                                             </Grid>
//                                         );
//                                     })}
//                                 </Grid>
//                                 <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                                     <Button
//                                         variant="contained"
//                                         color="success"
//                                         onClick={handleVendorSubmit}
//                                         endIcon={<UploadIcon />}
//                                     >
//                                         Upload All
//                                     </Button>
//                                 </Box>
//                             </Box>

//                             {showFiles?.length > 0 && (
//                                 <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                                     <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                                         {showFiles.map((f, index) => (
//                                             <Grid item xs={4} key={`${f.vendor}-${index}`}>
//                                                 <Box
//                                                     sx={{
//                                                         display: "flex",
//                                                         flexDirection: 'column',
//                                                         justifyContent: 'flex-start',
//                                                         cursor: 'pointer',
//                                                         border: '0px solid black',
//                                                         borderRadius: '5px',
//                                                         padding: 1,
//                                                         background: '#e9e9e9',
//                                                         '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                                     }}
//                                                     onClick={() => OneFileDelete(f.filename, dialogData?.apikey, dialogData?.back_folder, f.vendor)}
//                                                 >
//                                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                                         <TopicIcon sx={{ color: '#FEA405' }} />
//                                                         <b>{dialogData.vendors.find((v) => v.key === f.vendor)?.label || f.vendor}</b>
//                                                     </Box>
//                                                     <Box sx={{ fontSize: 13, marginTop: 0.5, wordBreak: 'break-all' }}>{f.filename}</Box>
//                                                     {f.rows_read !== undefined && (
//                                                         <Chip label={`${f.rows_read} rows`} size="small" sx={{ marginTop: 0.5, width: 'fit-content' }} />
//                                                     )}
//                                                 </Box>
//                                             </Grid>
//                                         ))}
//                                     </Grid>
//                                     <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                                         <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                                     </Box>
//                                 </Box>
//                             )}
//                         </>
//                     ) : (
//                         // ---------- Other folders: generic multi-file upload ----------
//                         <>
//                             <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
//                                 <Box>
//                                     <UploadSection
//                                         // label="Select Mobinet Dump Files"
//                                         color={selectFiles.length > 0 ? "warning" : "primary"}
//                                         multiple
//                                         onChange={(e) => {
//                                             setSeletctFiles(Array.from(e.target.files))
//                                             setShowError((prev) => ({ ...prev, selectfile: false }));
//                                         }}
//                                         error={showError?.selectfile}
//                                         selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
//                                     />
//                                 </Box>
//                                 <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
//                             </Box>
//                             {showFiles?.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                                     {showFiles?.map((item, index) => (
//                                         <Grid item xs={4} key={index}>
//                                             <Box key={item} sx={{ display: "flex", 
//                                             justifyContent: 'flex-start', alignItems: 'center', 
//                                             cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
//                                              padding: 0.5, background: '#e9e9e9',
//                                              '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                              }}
//                                                 onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
//                                             >
//                                                 <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                                             </Box>
//                                         </Grid>
//                                     ))}
//                                 </Grid>
//                                 <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                                     <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                                 </Box>
//                             </Box>}
//                         </>
//                     )}

//                 </DialogContent>
//             </Dialog>}

//             {loading}
//         </>
//     );
// };

// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
//     return (
//         <Box >
//             <div className={OverAllCss().Front_Box_Hading}>{label}</div>
//             <div className={OverAllCss().Front_Box_Select_Button}>
//                 <Button variant="contained" component="label" color={color}>
//                     Select File
//                     <input
//                         hidden
//                         required
//                         type="file"
//                         accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
//                         multiple={multiple}
//                         onChange={onChange}
//                     />
//                 </Button>
//                 {selectedText && (
//                     <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//                         {selectedText}
//                     </span>
//                 )}
//                 {error && (
//                     <div>
//                         <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//                     </div>
//                 )}
//             </div>
//         </Box>
//     )
// }

// export default File_Manager

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Breadcrumbs, Link, Typography, Button,
    Chip,
} from '@mui/material';
import {
    Upload as UploadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import TopicIcon from '@mui/icons-material/Topic';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import OverAllCss from "../../../csss/OverAllCss";
import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// KPI Trend uses a different upload contract: one form-data key per vendor
// ("ericsson" | "nokia" | "samsung") instead of a generic "file" list.
const KPI_VENDORS = [
    { key: "ericsson", label: "Ericsson" },
    { key: "nokia",    label: "Nokia"    },
    { key: "samsung",  label: "Samsung"  },
];

const EMPTY_VENDOR_FILES = KPI_VENDORS.reduce((acc, v) => ({ ...acc, [v.key]: null }), {});

const jsonData = [
    { folder_name: "Performance AT TAT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" },
    { folder_name: "Performance AT Pending Aging", api: "performance_tat/upload", back_folder:"performance_tat" },
    { folder_name: "KPI Trend", api: "kpi_monitoring/upload", back_folder:"kpi_monitoring", isMultiVendor: true, vendors: KPI_VENDORS },
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return (
        <Slide
            direction="down"
            timeout={2500}
            style={{ transformOrigin: '0 0 0' }}
            mountOnEnter
            unmountOnExit
            ref={ref}
            {...props}
        />
    );
});

const File_Manager = () => {
    const [open2, setOpen2] = useState(false);
        const [dialogData, setDialogData] = useState()
        const navigate = useNavigate()
        const { loading, action } = useLoadingDialog();
        const [showFiles, setShoweFiles] = useState([])
        const [selectFiles, setSeletctFiles] = useState([])
        const [showError, setShowError] = useState({
            selectfile: false,
        });

        const [vendorFiles, setVendorFiles] = useState(EMPTY_VENDOR_FILES);
        const [vendorErrors, setVendorErrors] = useState({});

        // ✅ FIX: kpi_monitoring/upload/ GET response uses "input_files" (not
        // "files" like the POST response does), and each vendor entry there
        // has a "status" field (e.g. "ready") instead of "rows_read". We now
        // accept either shape so the list populates whether it came from a
        // fresh upload (POST) or a page-refresh reload (GET).
        const fetchApiData = async (api, isMultiVendor = false) => {
            action(true)
            try {
                const response = await getData(`${api}/`);
                console.log("API response:", response);
                if (response?.status) {
                    if (isMultiVendor) {
                        const filesObj = response?.input_files || response?.files || {};
                        const vendorFilesList = Object.entries(filesObj).map(([vendor, info]) => ({
                            vendor,
                            filename: info?.filename,
                            rows_read: info?.rows_read,
                            status: info?.status,
                        }));
                        setShoweFiles(vendorFilesList);
                    } else {
                        setShoweFiles([response?.input_file?.filename]);
                    }
                } else {
                    setShoweFiles([]);
                }
            } finally {
                action(false);
            }
        }

        // GET is supported for every folder (confirmed via "Allow: POST, GET,
        // DELETE, OPTIONS" response header) — so files persist across refresh.
        const handleOpen = (item) => {
            fetchApiData(item.api, !!item.isMultiVendor);
            setOpen2(true);
            setDialogData({
                foldername: item.folder_name,
                apikey: item.api,
                back_folder: item.back_folder,
                isMultiVendor: !!item.isMultiVendor,
                vendors: item.vendors || [],
            })
            setVendorFiles(EMPTY_VENDOR_FILES);
            setVendorErrors({});
        }

        const handleClose = () => {
            setOpen2(false);
            setShoweFiles([])
            setDialogData()
            setShowError({ selectfile: false })
            setSeletctFiles([])
            setVendorFiles(EMPTY_VENDOR_FILES);
            setVendorErrors({});
        }
    
        const handleSubmit = async (api) => {
            const isValid = selectFiles.length > 0;
    
            if (!isValid) {
                setShowError({
                    selectfile: selectFiles.length === 0,
                });
                return;
            }
    
            action(true);
            const formData = new FormData();
            Array.from(selectFiles).forEach((file) => {
                formData.append("file", file);
            });
            const response = await postData(`${api}/`, formData);
            action(false);

            if (response?.status || response?.message) {
                fetchApiData(api);
                setShowError({ selectfile: false })
                setSeletctFiles([])
                Swal.fire({ icon: "success", title: "Done", text: response.message });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response.message });
            }
        }

        const handleVendorFileChange = (vendorKey, file) => {
            setVendorFiles((prev) => ({ ...prev, [vendorKey]: file }));
            setVendorErrors((prev) => ({ ...prev, [vendorKey]: false }));
        }

        const handleVendorSubmit = async () => {
            const selectedEntries = Object.entries(vendorFiles).filter(([, file]) => !!file);

            if (selectedEntries.length === 0) {
                const allErrors = KPI_VENDORS.reduce((acc, v) => ({ ...acc, [v.key]: true }), {});
                setVendorErrors(allErrors);
                return;
            }

            action(true);
            const formData = new FormData();
            selectedEntries.forEach(([vendorKey, file]) => {
                formData.append(vendorKey, file);
            });
            const response = await postData(`${dialogData.apikey}/`, formData);
            action(false);

            if (response?.status || response?.message) {
                setVendorErrors({});
                setVendorFiles(EMPTY_VENDOR_FILES);
                Swal.fire({ icon: "success", title: "Done", text: response.message });
                // Re-fetch the authoritative list (GET) after upload.
                fetchApiData(dialogData.apikey, true);
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response?.message });
            }
        }

        const handleDelete = async (api) => {
            const confirmResult = await Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });
    
            if (confirmResult.isConfirmed) {
                action(true);
    
                const response = await deleteData(`${api}/`);
                console.log("response", response);
    
                action(false);
    
                if (response?.status) {
                    setShoweFiles([]);
                    Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: response.message });
                }
            } else {
                console.log("Deletion cancelled.");
            }
        };
    
        const OneFileDelete = async (fileName, api, back_folder, vendor) => {
           const confirmResult = await Swal.fire({
                title: "Are you sure?",
                text: `Want to delete ${fileName} file!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });
    
            if (confirmResult.isConfirmed) {
                action(true);

                const body = { filename: `${fileName}`, foldername: `${back_folder}` };
                if (vendor) body.vendor = vendor;

                const response = await deleteData(`${api}/`, { data: body });
    
                action(false);
                if (response?.status) {
                    if (vendor) {
                        fetchApiData(api, true);
                    } else {
                        fetchApiData(api, false)
                    }
                    Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: response.message });
                }
            } else {
                console.log("Deletion cancelled.");
            }
        }
    
        useEffect(() => {
            const title = window.location.pathname
                .slice(1)
                .replaceAll("_", " ")
                .replaceAll("/", " | ")
                .toUpperCase();
            document.title = title;
        }, []);

        const uploadedVendorKeys = showFiles.map((f) => f.vendor);

  return (
    <> 
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At</Link>
                    <Typography color="text.primary">File Manager</Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={{ margin: '20px' }}>
                <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                    {jsonData.map((item, index) => (
                        <Grid item xs={4} key={index}>
                            <Box
                                onClick={() => handleOpen(item)}
                                sx={{
                                    border: '1px solid black',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '10px',
                                    padding: 1,
                                    alignItems: 'center',
                                    borderRadius: '5px',
                                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                    '&:hover': { backgroundColor: '#223354', color: 'white' },
                                }}
                            >
                                <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
                                <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {open2 && <Dialog
                fullWidth
                maxWidth="lg"
                TransitionComponent={Transition}
                open={open2}
                onClose={handleClose}
                sx={{ zIndex: 2 }}
            >
                <DialogTitle>
                    <span style={{ float: 'left' }}>
                        <h2>{dialogData.foldername}</h2>
                    </span>
                    <span style={{ float: 'right' }}>
                        <IconButton size="large" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </span>
                </DialogTitle>
                <DialogContent>

                    {dialogData?.isMultiVendor ? (
                        <>
                            <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2 }}>
                                <Grid container spacing={2}>
                                    {dialogData.vendors.map((v) => {
                                        const alreadyUploaded = uploadedVendorKeys.includes(v.key);
                                        const picked = vendorFiles[v.key];
                                        return (
                                            <Grid item xs={12} md={4} key={v.key}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, border: '1px solid #ccc', borderRadius: '5px', padding: 1.5, height: '100%' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                                        {alreadyUploaded
                                                            ? <CheckCircleIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                                                            : <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />}
                                                        {v.label}
                                                    </Box>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        size="small"
                                                        color={picked ? "warning" : "primary"}
                                                    >
                                                        Select {v.label} File
                                                        <input
                                                            hidden
                                                            type="file"
                                                            accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
                                                            onChange={(e) => handleVendorFileChange(v.key, e.target.files?.[0] || null)}
                                                        />
                                                    </Button>
                                                    {picked && (
                                                        <span style={{ color: "green", fontSize: 13, fontWeight: 600, wordBreak: 'break-all' }}>
                                                            Selected: {picked.name}
                                                        </span>
                                                    )}
                                                    {vendorErrors?.[v.key] && (
                                                        <span style={{ color: "red", fontSize: 12, fontWeight: 600 }}>
                                                            This Field Is Required!
                                                        </span>
                                                    )}
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleVendorSubmit}
                                        endIcon={<UploadIcon />}
                                    >
                                        Upload All
                                    </Button>
                                </Box>
                            </Box>

                            {showFiles?.length > 0 && (
                                <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
                                    <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                                        {showFiles.map((f, index) => (
                                            <Grid item xs={4} key={`${f.vendor}-${index}`}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: 'column',
                                                        justifyContent: 'flex-start',
                                                        cursor: 'pointer',
                                                        border: '0px solid black',
                                                        borderRadius: '5px',
                                                        padding: 1,
                                                        background: '#e9e9e9',
                                                        '&:hover': { backgroundColor: '#223354', color: 'white' }
                                                    }}
                                                    onClick={() => OneFileDelete(f.filename, dialogData?.apikey, dialogData?.back_folder, f.vendor)}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <TopicIcon sx={{ color: '#FEA405' }} />
                                                        <b>{dialogData.vendors.find((v) => v.key === f.vendor)?.label || f.vendor}</b>
                                                    </Box>
                                                    <Box sx={{ fontSize: 13, marginTop: 0.5, wordBreak: 'break-all' }}>{f.filename}</Box>
                                                    {f.rows_read !== undefined ? (
                                                        <Chip label={`${f.rows_read} rows`} size="small" sx={{ marginTop: 0.5, width: 'fit-content' }} />
                                                    ) : f.status ? (
                                                        <Chip
                                                            label={f.status}
                                                            size="small"
                                                            color={f.status === 'ready' ? 'success' : 'default'}
                                                            sx={{ marginTop: 0.5, width: 'fit-content' }}
                                                        />
                                                    ) : null}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                                        <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
                                    </Box>
                                </Box>
                            )}
                        </>
                    ) : (
                        <>
                            <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                                <Box>
                                    <UploadSection
                                        color={selectFiles.length > 0 ? "warning" : "primary"}
                                        multiple
                                        onChange={(e) => {
                                            setSeletctFiles(Array.from(e.target.files))
                                            setShowError((prev) => ({ ...prev, selectfile: false }));
                                        }}
                                        error={showError?.selectfile}
                                        selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
                                    />
                                </Box>
                                <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
                            </Box>
                            {showFiles?.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
                                <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                                    {showFiles?.map((item, index) => (
                                        <Grid item xs={4} key={index}>
                                            <Box key={item} sx={{ display: "flex", 
                                            justifyContent: 'flex-start', alignItems: 'center', 
                                            cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
                                             padding: 0.5, background: '#e9e9e9',
                                             '&:hover': { backgroundColor: '#223354', color: 'white' }
                                             }}
                                                onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
                                            >
                                                <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                                    <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
                                </Box>
                            </Box>}
                        </>
                    )}

                </DialogContent>
            </Dialog>}

            {loading}
        </>
    );
};

const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
    return (
        <Box >
            <div className={OverAllCss().Front_Box_Hading}>{label}</div>
            <div className={OverAllCss().Front_Box_Select_Button}>
                <Button variant="contained" component="label" color={color}>
                    Select File
                    <input
                        hidden
                        required
                        type="file"
                        accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
                        multiple={multiple}
                        onChange={onChange}
                    />
                </Button>
                {selectedText && (
                    <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
                        {selectedText}
                    </span>
                )}
                {error && (
                    <div>
                        <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
                    </div>
                )}
            </div>
        </Box>
    )
}

export default File_Manager