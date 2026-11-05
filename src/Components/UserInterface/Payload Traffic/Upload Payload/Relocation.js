// import React, { useState, useEffect } from "react";
// import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import { postData } from "../../../services/FetchNodeServices";
// import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';
// import Swal from "sweetalert2";
// import OverAllCss from "../../../csss/OverAllCss";
// import Zoom from "@mui/material/Zoom";
// import { useNavigate } from 'react-router-dom'
// import Slide from '@mui/material/Slide';
// import { IconButton } from 'rsuite';
// import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
// import Divider from '@mui/material/Divider';


// const Relocation = () => {

//     // FILE UPLOAD SECTION STATE
//     const [uploadFile, setUploadFile] = useState(null);
//     const [uploadProcessing, setUploadProcessing] = useState(false);
//     const [uploadDownloadUrl, setUploadDownloadUrl] = useState("");

//     // TEMPLATE DOWNLOAD STATE
//     const [templateDownloadProcessing, setTemplateDownloadProcessing] = useState(false);

//     // MANUAL ENTRY SECTION STATE
//     const [manualOnAirDate, setManualOnAirDate] = useState("");
//     const [manualCircle, setManualCircle] = useState("");
//     const [manualOldSiteId, setManualOldSiteId] = useState("");
//     const [manualSiteId, setManualSiteId] = useState("");
//     const [manualProcessing, setManualProcessing] = useState(false);
//     const [manualDownloadUrl, setManualDownloadUrl] = useState("");

//     const classes = OverAllCss()
//     const navigate = useNavigate()

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
//     }, [])

//     const extractErrorMessage = (err) => {
//         const data = err?.response?.data
//         if (!data) return err?.message || "Something went wrong"

//         if (typeof data === "string") return data
//         if (data.detail) return data.detail
//         if (data.message) return data.message

//         if (typeof data === "object") {
//             const parts = Object.entries(data).map(([field, msgs]) => {
//                 const msgText = Array.isArray(msgs) ? msgs.join(" ") : msgs
//                 return `${field}: ${msgText}`
//             })
//             if (parts.length) return parts.join(" | ")
//         }

//         return "Request failed. Please check your input and try again."
//     }

//     // ========== FILE UPLOAD HANDLER ==========
//     const handleUploadFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const validExtensions = [".xlsx", ".xls", ".xlsb"];
//             const fileName = file.name.toLowerCase();
//             const isValid = validExtensions.some(ext => fileName.endsWith(ext));
            
//             if (isValid) {
//                 setUploadFile(file);
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Invalid File",
//                     text: "Please select only Excel files (.xlsx, .xls, .xlsb)",
//                 });
//                 event.target.value = "";
//             }
//         }
//     };

//     const handleFileUploadSubmit = async () => {
//         if (!uploadFile) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required Fields",
//                 text: "Please select a file",
//             });
//             return;
//         }

//         try {
//             setUploadProcessing(true);
//             const formData = new FormData();
//             formData.append("file", uploadFile);

//             const response = await postData("payload_traffic/pre-post-report-bulk/", formData);

//             if (response && response.status) {
//                 setUploadDownloadUrl(response.download_url);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: response.message || "File uploaded successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to upload file",
//                 });
//             }
//         } catch (error) {
//             console.error("File upload error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: extractErrorMessage(error),
//             });
//         } finally {
//             setUploadProcessing(false);
//         }
//     };

//     const handleFileUploadCancel = () => {
//         setUploadFile(null);
//         setUploadDownloadUrl("");
//     };

//     // ========== MANUAL ENTRY HANDLER ==========
//     const handleManualSubmit = async () => {
//         if (!manualOnAirDate || !manualCircle || !manualOldSiteId || !manualSiteId) {
//             Swal.fire({
//                 icon: "warning",
//                 title: "Required Fields",
//                 text: "Please fill in all fields: On-Air Date, Circle, Old Site ID, and Site ID",
//             });
//             return;
//         }

//         try {
//             setManualProcessing(true);
//             const formData = new FormData();
//             formData.append("on_air_date", manualOnAirDate);
//             formData.append("circle", manualCircle);
//             formData.append("old_site_id", manualOldSiteId);
//             formData.append("site_id", manualSiteId);

//             const response = await postData("payload_traffic/pre-post-report/", formData);

//             if (response && response.status) {
//                 setManualDownloadUrl(response.download_url);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Success",
//                     text: response.message || "Report generated successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to generate report",
//                 });
//             }
//         } catch (error) {
//             console.error("Manual entry error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: extractErrorMessage(error),
//             });
//         } finally {
//             setManualProcessing(false);
//         }
//     };

//     const handleManualCancel = () => {
//         setManualOnAirDate("");
//         setManualCircle("");
//         setManualOldSiteId("");
//         setManualSiteId("");
//         setManualDownloadUrl("");
//     };

//     // ========== TEMPLATE DOWNLOAD HANDLER ==========
//     const handleTemplateDownload = async () => {
//         try {
//             setTemplateDownloadProcessing(true);
//             const response = await postData("payload_traffic/download-template/");

//             if (response && response.status) {
//                 downloadFile(response.download_url);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Template Downloaded",
//                     text: "Template downloaded successfully",
//                 });
//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Error",
//                     text: response?.message || "Failed to download template",
//                 });
//             }
//         } catch (error) {
//             console.error("Template download error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: extractErrorMessage(error),
//             });
//         } finally {
//             setTemplateDownloadProcessing(false);
//         }
//     };

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

//     return (
//         <Zoom in={true} timeout={500}>
//             <div>
//                 <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
//                     <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
//                         <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
//                         <Typography color='text.primary'>Relocation</Typography>
//                     </Breadcrumbs>
//                 </div>
//                 <Slide direction='left' in='true' timeout={1000}>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box}>
//                             {/* ========== HEADING WITH DOWNLOAD ICON ========== */}
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                                 <Box className={classes.Box_Hading}>
//                                     📋 Relocation Report
//                                 </Box>

//                                 {/* ========== DOWNLOAD ICON - RIGHT SIDE OF HEADING ========== */}
//                                 <Tooltip title="Download Template">
//                                     <IconButton
//                                         onClick={handleTemplateDownload}
//                                         disabled={templateDownloadProcessing}
//                                         sx={{
//                                             color: '#006e74',
//                                             fontSize: '32px',
//                                             '&:hover': { bgcolor: 'rgba(0, 110, 116, 0.1)' }
//                                         }}
//                                     >
//                                         <CloudDownloadIcon sx={{ fontSize: '32px' }} />
//                                     </IconButton>
//                                 </Tooltip>
//                             </Box>

//                             <Stack spacing={3} sx={{ marginTop: "10px" }}>

//                                 {/* ========== SECTION 1: FILE UPLOAD ========== */}
//                                 <Box className={classes.Front_Box} id="step-upload">
//                                     <div className={classes.Front_Box_Hading}>
//                                         📤 Upload Pre/Post Report
//                                     </div>
//                                     <Stack spacing={2}>
//                                         <Box>
//                                             <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
//                                                 Select Excel File
//                                             </div>
//                                             <div className={classes.Front_Box_Select_Button}>
//                                                 <Button
//                                                     variant="contained"
//                                                     component="label"
//                                                     startIcon={<UploadIcon />}
//                                                     sx={{ fontWeight: 700, textTransform: "none" }}
//                                                 >
//                                                     {uploadFile ? "Change File" : "Select File"}
//                                                     <input
//                                                         hidden
//                                                         accept=".xlsx,.xls,.xlsb"
//                                                         type="file"
//                                                         onChange={handleUploadFileChange}
//                                                     />
//                                                 </Button>
//                                                 {uploadFile && (
//                                                     <span style={{ color: "green", fontSize: "14px", fontWeight: 600, marginLeft: "12px" }}>
//                                                         ✓ {uploadFile.name}
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         </Box>

//                                         <Box style={{ display: 'flex', justifyContent: "center", gap: 2, marginTop: "15px" }}>
//                                             <Button variant="contained" color="success" onClick={handleFileUploadSubmit} disabled={uploadProcessing} endIcon={<UploadIcon />}>
//                                                 {uploadProcessing ? "Processing..." : "Submit"}
//                                             </Button>
//                                             <Button variant="contained" onClick={handleFileUploadCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                                         </Box>

//                                         {uploadDownloadUrl && (
//                                             <Box sx={{ p: 2, bgcolor: "#e3f2f2", borderRadius: 1.5, border: '2px solid #006e74', textAlign: 'center' }}>
//                                                 <Typography variant="body2" sx={{ color: '#006e74', fontWeight: 700, mb: 1.5, fontSize: '13px' }}>
//                                                     ✓ File processed successfully!
//                                                 </Typography>
//                                                 <Button 
//                                                     variant="contained" 
//                                                     color="success"
//                                                     onClick={() => downloadFile(uploadDownloadUrl)} 
//                                                     startIcon={<FileDownloadIcon />}
//                                                     sx={{ fontWeight: 700, textTransform: "none" }}
//                                                 >
//                                                     Download Report
//                                                 </Button>
//                                             </Box>
//                                         )}
//                                     </Stack>
//                                 </Box>

//                                 <Divider sx={{ my: 2 }} />

//                                 {/* ========== SECTION 2: GENERATE REPORT ========== */}
//                                 <Box className={classes.Front_Box} id="step-manual">
//                                     <div className={classes.Front_Box_Hading}>
//                                         ✏️ Generate Report
//                                     </div>
//                                     <Stack spacing={2} sx={{ marginTop: 2 }}>
//                                         <Box>
//                                             <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
//                                                 On-Air Date
//                                             </div>
//                                             <input
//                                                 value={manualOnAirDate}
//                                                 onChange={(e) => setManualOnAirDate(e.target.value)}
//                                                 type="date"
//                                                 placeholder="dd-mm-yyyy"
//                                                 style={{ width: '165px', height: '35px', fontSize: '14px', fontWeight: 'bold' }}
//                                             />
//                                         </Box>

//                                         <Box>
//                                             <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
//                                                 Circle:
//                                             </div>
//                                             <TextField
//                                                 value={manualCircle}
//                                                 onChange={(e) => setManualCircle(e.target.value)}
//                                                 size="small"
//                                                 variant="outlined"
//                                                 placeholder="Paste circle"
//                                                 sx={{ width: '100%', maxWidth: '300px' }}
//                                             />
//                                         </Box>

//                                         <Box>
//                                             <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
//                                                 Old Site ID:
//                                             </div>
//                                             <TextField
//                                                 value={manualOldSiteId}
//                                                 onChange={(e) => setManualOldSiteId(e.target.value)}
//                                                 size="small"
//                                                 variant="outlined"
//                                                 placeholder="Paste old site ID"
//                                                 sx={{ width: '100%', maxWidth: '300px' }}
//                                             />
//                                         </Box>

//                                         <Box>
//                                             <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
//                                                 Site ID:
//                                             </div>
//                                             <TextField
//                                                 value={manualSiteId}
//                                                 onChange={(e) => setManualSiteId(e.target.value)}
//                                                 size="small"
//                                                 variant="outlined"
//                                                 placeholder="Paste site ID"
//                                                 sx={{ width: '100%', maxWidth: '300px' }}
//                                             />
//                                         </Box>

//                                         <Box style={{ display: 'flex', justifyContent: "center", gap: 2, marginTop: "15px" }}>
//                                             <Button variant="contained" color="success" onClick={handleManualSubmit} disabled={manualProcessing} endIcon={<UploadIcon />}>
//                                                 {manualProcessing ? "Processing..." : "Submit"}
//                                             </Button>
//                                             <Button variant="contained" onClick={handleManualCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                                         </Box>

//                                         {manualDownloadUrl && (
//                                             <Box sx={{ p: 2, bgcolor: "#e3f2f2", borderRadius: 1.5, border: '2px solid #006e74', textAlign: 'center' }}>
//                                                 <Typography variant="body2" sx={{ color: '#006e74', fontWeight: 700, mb: 1.5, fontSize: '13px' }}>
//                                                     ✓ Report generated successfully!
//                                                 </Typography>
//                                                 <Button 
//                                                     variant="contained" 
//                                                     color="success"
//                                                     onClick={() => downloadFile(manualDownloadUrl)} 
//                                                     startIcon={<FileDownloadIcon />}
//                                                     sx={{ fontWeight: 700, textTransform: "none" }}
//                                                 >
//                                                     Download Report
//                                                 </Button>
//                                             </Box>
//                                         )}
//                                     </Stack>
//                                 </Box>
//                             </Stack>
//                         </Box>
//                     </Box>
//                 </Slide>
//             </div>
//         </Zoom>
//     )
// }

// export default Relocation


import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, Grid, TextField, Divider, Paper } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import OverAllCss from "../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from 'react-router-dom';
import Slide from '@mui/material/Slide';
import { IconButton } from 'rsuite';
import { postData } from "../../../services/FetchNodeServices";

const Relocation = () => {
    // FILE UPLOAD SECTION STATE
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadProcessing, setUploadProcessing] = useState(false);
    const [uploadDownloadUrl, setUploadDownloadUrl] = useState("");

    // TEMPLATE DOWNLOAD STATE
    const [templateDownloadProcessing, setTemplateDownloadProcessing] = useState(false);

    // MANUAL ENTRY SECTION STATE
    const [manualOnAirDate, setManualOnAirDate] = useState("");
    const [manualCircle, setManualCircle] = useState("");
    const [manualOldSiteId, setManualOldSiteId] = useState("");
    const [manualSiteId, setManualSiteId] = useState("");
    const [manualProcessing, setManualProcessing] = useState(false);
    const [manualDownloadUrl, setManualDownloadUrl] = useState("");

    const classes = OverAllCss();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    const extractErrorMessage = (err) => {
        const data = err?.response?.data;
        if (!data) return err?.message || "Something went wrong";

        if (typeof data === "string") return data;
        if (data.detail) return data.detail;
        if (data.message) return data.message;

        if (typeof data === "object") {
            const parts = Object.entries(data).map(([field, msgs]) => {
                const msgText = Array.isArray(msgs) ? msgs.join(" ") : msgs;
                return `${field}: ${msgText}`;
            });
            if (parts.length) return parts.join(" | ");
        }

        return "Request failed. Please check your input and try again.";
    };

    // ========== FILE UPLOAD HANDLER ==========
    const handleUploadFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validExtensions = [".xlsx", ".xls", ".xlsb"];
            const fileName = file.name.toLowerCase();
            const isValid = validExtensions.some(ext => fileName.endsWith(ext));
            
            if (isValid) {
                setUploadFile(file);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Invalid File",
                    text: "Please select only Excel files (.xlsx, .xls, .xlsb)",
                });
                event.target.value = "";
            }
        }
    };

    const handleFileUploadSubmit = async () => {
        if (!uploadFile) {
            Swal.fire({
                icon: "warning",
                title: "Required Fields",
                text: "Please select a file",
            });
            return;
        }

        try {
            setUploadProcessing(true);
            const formData = new FormData();
            formData.append("file", uploadFile);

            const response = await postData("payload_traffic/pre-post-report-bulk/", formData);

            if (response && response.status) {
                setUploadDownloadUrl(response.download_url);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "File uploaded successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to upload file",
                });
            }
        } catch (error) {
            console.error("File upload error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: extractErrorMessage(error),
            });
        } finally {
            setUploadProcessing(false);
        }
    };

    const handleFileUploadCancel = () => {
        setUploadFile(null);
        setUploadDownloadUrl("");
    };

    // ========== MANUAL ENTRY HANDLER ==========
    const handleManualSubmit = async () => {
        if (!manualOnAirDate || !manualCircle || !manualOldSiteId || !manualSiteId) {
            Swal.fire({
                icon: "warning",
                title: "Required Fields",
                text: "Please fill in all fields: On-Air Date, Circle, Old Site ID, and Site ID",
            });
            return;
        }

        try {
            setManualProcessing(true);
            const formData = new FormData();
            formData.append("on_air_date", manualOnAirDate);
            formData.append("circle", manualCircle);
            formData.append("old_site_id", manualOldSiteId);
            formData.append("site_id", manualSiteId);

            const response = await postData("payload_traffic/pre-post-report/", formData);

            if (response && response.status) {
                setManualDownloadUrl(response.download_url);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Report generated successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to generate report",
                });
            }
        } catch (error) {
            console.error("Manual entry error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: extractErrorMessage(error),
            });
        } finally {
            setManualProcessing(false);
        }
    };

    const handleManualCancel = () => {
        setManualOnAirDate("");
        setManualCircle("");
        setManualOldSiteId("");
        setManualSiteId("");
        setManualDownloadUrl("");
    };

    // ========== TEMPLATE DOWNLOAD HANDLER ==========
    const handleTemplateDownload = async () => {
        try {
            setTemplateDownloadProcessing(true);
            const response = await postData("payload_traffic/download-template/");

            if (response && response.status) {
                downloadFile(response.download_url);
                Swal.fire({
                    icon: "success",
                    title: "Template Downloaded",
                    text: "Template downloaded successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to download template",
                });
            }
        } catch (error) {
            console.error("Template download error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: extractErrorMessage(error),
            });
        } finally {
            setTemplateDownloadProcessing(false);
        }
    };

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

    return (
        <Zoom in={true} timeout={500}>
            <div>
                <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => navigate('/tools')} sx={{ cursor: 'pointer' }}>Tools</Link>
                        <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
                        <Typography color='text.primary'>Relocation</Typography>
                    </Breadcrumbs>
                </div>
                
                <Slide direction='left' in={true} timeout={1000}>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)", borderRadius: 3 }}>
                            
                            {/* ========== HEADING WITH DOWNLOAD ICON ========== */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #E2E8F0' }}>
                                <Box className={classes.Box_Hading} sx={{ m: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                                    📋 Relocation Report
                                </Box>

                                <Tooltip title="Download Template">
                                    <IconButton
                                        onClick={handleTemplateDownload}
                                        disabled={templateDownloadProcessing}
                                        sx={{
                                            color: '#006e74',
                                            bgcolor: 'rgba(0, 110, 116, 0.06)',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': { bgcolor: 'rgba(0, 110, 116, 0.15)', transform: 'translateY(-2px)' }
                                        }}
                                    >
                                        <CloudDownloadIcon sx={{ fontSize: '26px' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Stack spacing={4}>

                                {/* ========== SECTION 1: FILE UPLOAD ========== */}
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, bgcolor: "#F8FAFC", border: '1px solid #E2E8F0' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        📤 Upload Pre/Post Report Bulk File
                                    </Typography>
                                    
                                    <Stack spacing={2.5}>
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                startIcon={<UploadIcon />}
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    textTransform: "none", 
                                                    bgcolor: '#006e74', 
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px rgba(0, 110, 116, 0.2)',
                                                    '&:hover': { bgcolor: '#005458' },
                                                    py: 1.2,
                                                    px: 3
                                                }}
                                            >
                                                {uploadFile ? "Change File" : "Select Excel File"}
                                                <input
                                                    hidden
                                                    accept=".xlsx,.xls,.xlsb"
                                                    type="file"
                                                    onChange={handleUploadFileChange}
                                                />
                                            </Button>
                                            {uploadFile && (
                                                <Typography variant="body2" sx={{ color: "#16A34A", fontWeight: 600, bgcolor: '#DCFCE7', px: 2, py: 1, borderRadius: 1.5, display: 'inline-block' }}>
                                                    ✓ {uploadFile.name}
                                                </Typography>
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                onClick={handleFileUploadSubmit} 
                                                disabled={uploadProcessing} 
                                                endIcon={<UploadIcon />}
                                                sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1 }}
                                            >
                                                {uploadProcessing ? "Processing..." : "Submit"}
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                onClick={handleFileUploadCancel} 
                                                color="error"
                                                endIcon={<DoDisturbIcon />}
                                                sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1 }}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>

                                        {uploadDownloadUrl && (
                                            <Box sx={{ p: 2.5, bgcolor: "#F0FDFA", borderRadius: 2, border: '1px solid #CCFBF1', textAlign: 'center', mt: 2 }}>
                                                <Typography variant="body2" sx={{ color: '#0F766E', fontWeight: 700, mb: 1.5, fontSize: '14px' }}>
                                                    ✓ File processed successfully!
                                                </Typography>
                                                <Button 
                                                    variant="contained" 
                                                    color="success"
                                                    onClick={() => downloadFile(uploadDownloadUrl)} 
                                                    startIcon={<FileDownloadIcon />}
                                                    sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
                                                >
                                                    Download Report
                                                </Button>
                                            </Box>
                                        )}
                                    </Stack>
                                </Paper>

                                <Divider sx={{ my: 1 }} />

                                {/* ========== SECTION 2: GENERATE REPORT (MANUAL ENTRY) ========== */}
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2.5, bgcolor: "#F8FAFC", border: '1px solid #E2E8F0' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        ✏️ Generate Report Manually
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                                                On-Air Date
                                            </Typography>
                                            <TextField
                                                value={manualOnAirDate}
                                                onChange={(e) => setManualOnAirDate(e.target.value)}
                                                type="date"
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                                                Circle
                                            </Typography>
                                            <TextField
                                                value={manualCircle}
                                                onChange={(e) => setManualCircle(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Enter Circle"
                                                fullWidth
                                                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                                                Old Site ID
                                            </Typography>
                                            <TextField
                                                value={manualOldSiteId}
                                                onChange={(e) => setManualOldSiteId(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Enter old site ID"
                                                fullWidth
                                                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', display: 'block', mb: 1 }}>
                                                Site ID
                                            </Typography>
                                            <TextField
                                                value={manualSiteId}
                                                onChange={(e) => setManualSiteId(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Enter site ID"
                                                fullWidth
                                                sx={{ bgcolor: '#FFFFFF', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            onClick={handleManualSubmit} 
                                            disabled={manualProcessing} 
                                            endIcon={<UploadIcon />}
                                            sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1 }}
                                        >
                                            {manualProcessing ? "Processing..." : "Submit"}
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleManualCancel} 
                                            color="error"
                                            endIcon={<DoDisturbIcon />}
                                            sx={{ borderRadius: 2, fontWeight: 700, px: 3, py: 1 }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>

                                    {manualDownloadUrl && (
                                        <Box sx={{ p: 2.5, bgcolor: "#F0FDFA", borderRadius: 2, border: '1px solid #CCFBF1', textAlign: 'center', mt: 3 }}>
                                            <Typography variant="body2" sx={{ color: '#0F766E', fontWeight: 700, mb: 1.5, fontSize: '14px' }}>
                                                ✓ Report generated successfully!
                                            </Typography>
                                            <Button 
                                                variant="contained" 
                                                color="success"
                                                onClick={() => downloadFile(manualDownloadUrl)} 
                                                startIcon={<FileDownloadIcon />}
                                                sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
                                            >
                                                Download Report
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>

                            </Stack>
                        </Box>
                    </Box>
                </Slide>
            </div>
        </Zoom>
    );
};

export default Relocation;