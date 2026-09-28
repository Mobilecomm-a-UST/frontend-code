// import React, { useState, useEffect, useCallback } from "react";
// import { Box, Button, Stack, Chip } from "@mui/material";
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";
// import Slide from '@mui/material/Slide';
// import UploadIcon from '@mui/icons-material/Upload';
// import DoDisturbIcon from '@mui/icons-material/DoDisturb';
// import Swal from "sweetalert2";
// import { postData, ServerURL } from "../../../services/FetchNodeServices";
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";


// const MAH_gpl_macro = () => {
//     // selectedFiles: [{ id, name, file }]
//     const [selectedFiles, setSelectedFiles] = useState([])
//     const [selectCircle, setSelectCircle] = useState('')
//     const [show4G, setShow4G] = useState(false)
//     const [show, setShow] = useState(false)
//     const [fileData, setFileData] = useState()
//     const [xmlFileData, setXmlFileData] = useState()
//     const [download, setDownload] = useState(false);
//     const { loading, action } = useLoadingDialog()
//     const navigate = useNavigate()
//     const classes = OverAllCss()
//     const link = `${ServerURL}${fileData}`;
//     const xmlLink = `${ServerURL}${xmlFileData}`;


//     const handle4GFileSelection = (event) => {
//         const newFiles = Array.from(event.target.files || []);
//         if (newFiles.length === 0) return;

//         setShow4G(false);
//         setSelectedFiles((prev) => {
//             // avoid adding the same file (by name + size) twice
//             const existingKeys = new Set(prev.map((f) => `${f.name}_${f.file.size}`));
//             const merged = [...prev];
//             newFiles.forEach((file) => {
//                 const key = `${file.name}_${file.size}`;
//                 if (!existingKeys.has(key)) {
//                     merged.push({ id: `${key}_${Date.now()}_${Math.random()}`, name: file.name, file });
//                     existingKeys.add(key);
//                 }
//             });
//             return merged;
//         });

//         // allow re-selecting the same file again later
//         event.target.value = "";
//     }

//     const handleRemoveFile = (id) => {
//         setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
//     }



//     const handleSubmit = async () => {
//         if (selectedFiles.length > 0) {
//             action(true)
//             var formData = new FormData();
//             selectedFiles.forEach((f) => {
//                 formData.append(`xml_file`, f.file);
//             });
//             const response = await postData('mah_macro/mah_slicing/', formData)
//             console.log('response data', response)
//             if (response.status === true) {
//                 action(false)
//                 setDownload(true)
//                 setFileData(response.download_url)
//                 setXmlFileData(response.xml_download_url)
//                 Swal.fire({
//                     icon: "success",
//                     title: "Done",
//                     text: `${response.message}`,
//                 });
//                 // console.log('sssssssssssssssssssss', response)
//             } else {
//                 action(false)

//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: `${response.message}`,
//                 });
//             }
//         }
//         else {
//             setShow4G(true)
//         }
//     }

//     const handleCancel = () => {
//         setSelectedFiles([])
//         setShow4G(false)

//     }

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])

//     return (
//         <>
//             <div style={{ margin: 5, marginLeft: 10 }}>
//                 <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
//                     <Link underline='hover' onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
//                     <Link underline='hover' onClick={() => { navigate('/tools/ix_tools/sa_slicing') }}>5G GPL</Link>
//                     <Typography color='text.primary'>MAH GPL Macro</Typography>
//                 </Breadcrumbs>
//             </div>
//             <Slide
//                 direction='left'
//                 in='true'
//                 // style={{ transformOrigin: '0 0 0' }}
//                 timeout={1000}
//             >
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
//                             <Box className={classes.Box_Hading} >
//                                 Upload GPL for MAH
//                             </Box>
//                             <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>


//                                 <Box className={classes.Front_Box} >
//                                     <div className={classes.Front_Box_Hading}>
//                                         Select XML Files:-
//                                     </div>
//                                     <div className={classes.Front_Box_Select_Button} >
//                                         <div style={{ float: "left" }}>
//                                             <Button variant="contained" component="label" color={selectedFiles.length > 0 ? "warning" : "primary"}>
//                                                 select files
//                                                 <input
//                                                     required
//                                                     hidden
//                                                     multiple
//                                                     type="file"
//                                                     accept=".xml"
//                                                     onChange={(e) => handle4GFileSelection(e)}
//                                                 />
//                                             </Button>
//                                         </div>

//                                         <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
//                                     </div>

//                                     {selectedFiles.length > 0 && (
//                                         <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ marginTop: 2 }}>
//                                             {selectedFiles.map((f) => (
//                                                 <Chip
//                                                     key={f.id}
//                                                     label={f.name}
//                                                     onDelete={() => handleRemoveFile(f.id)}
//                                                     color="primary"
//                                                     variant="outlined"
//                                                     sx={{ fontFamily: 'Poppins' }}
//                                                 />
//                                             ))}
//                                         </Stack>
//                                     )}
//                                 </Box>
//                             </Stack>
//                             <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

//                                 <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

//                             </Stack>
//                         </Box>
//                     </Box>

//                     <Box
//                         sx={{
//                             textAlign: 'center',
//                             display: download ? 'flex' : 'none',
//                             flexDirection: { xs: 'column', md: 'row' },
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             gap: 2,
//                             mt: 1,
//                         }}
//                     >
//                         <Button
//                             component="a"
//                             href={fileData}
//                             download
//                             // target="_blank"
//                             // rel="noopener noreferrer"
//                             variant="outlined"
//                             title="Export Excel"
//                             startIcon={
//                                 <FileDownloadIcon style={{ fontSize: 30, color: "green" }} />
//                             }
//                             sx={{ mt: 1, width: "auto" }}
//                         >
//                             <span
//                                 style={{
//                                     fontFamily: "Poppins",
//                                     fontSize: "22px",
//                                     fontWeight: 800,
//                                     textTransform: "none",
//                                     textDecoration: "none"
//                                 }}
//                             >
//                                 Download Excel Report
//                             </span>
//                         </Button>

//                         <Button
//                             component="a"
//                             href={xmlFileData}
//                             download
//                             // target="_blank"
//                             // rel="noopener noreferrer"
//                             variant="outlined"
//                             title="Export XML"
//                             startIcon={
//                                 <FileDownloadIcon style={{ fontSize: 30, color: "green" }} />
//                             }
//                             sx={{ mt: 1, width: "auto" }}
//                         >
//                             <span
//                                 style={{
//                                     fontFamily: "Poppins",
//                                     fontSize: "22px",
//                                     fontWeight: 800,
//                                     textTransform: "none",
//                                     textDecoration: "none"
//                                 }}
//                             >
//                                 Download XML Report
//                             </span>
//                         </Button>
//                     </Box>
                    
//                 </Box>
//             </Slide>
//             {loading}
//         </>
//     )
// }

// export default MAH_gpl_macro



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
    CircularProgress,
    Divider,
    Tooltip,
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
import ErrorIcon from "@mui/icons-material/Error";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import DescriptionIcon from "@mui/icons-material/Description";
import CodeIcon from "@mui/icons-material/Code";

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
/*  Upload Result Display Component - Handle XLSX + XML arrays      */
/* ================================================================ */
const ScriptingToolResult = ({ data, onDownload }) => {
    if (!data) return null;

    const { status, message, download_url = [], xml_download_url = [] } = data;

    // ✅ Ensure arrays (handle both array and single URL)
    const xlsxUrls = Array.isArray(download_url) ? download_url : (download_url ? [download_url] : []);
    const xmlUrls = Array.isArray(xml_download_url) ? xml_download_url : (xml_download_url ? [xml_download_url] : []);

    // Extract filename from URL
    const fileNameFromUrl = (url) => {
        try {
            return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
        } catch {
            return url;
        }
    };

    // Download all files (XLSX + XML) with staggered timing
    const handleDownloadAll = () => {
        let delayMs = 0;
        
        // Download all XLSX files with delay
        xlsxUrls.forEach((url, idx) => {
            setTimeout(() => {
                onDownload(url);
            }, delayMs);
            delayMs += 400; // 400ms delay between each file
        });
        
        // Download all XML files with additional delay
        xmlUrls.forEach((url, idx) => {
            setTimeout(() => {
                onDownload(url);
            }, delayMs);
            delayMs += 400;
        });
    };

    const totalFiles = xlsxUrls.length + xmlUrls.length;

    return (
        <Box
            sx={{
                mt: 3,
                p: 2.5,
                background: COLORS.lightBg,
                borderRadius: 1.5,
                border: `1px solid ${COLORS.borderColor}`,
            }}
        >
            {/* Status Alert */}
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

            {/* Result Cards */}
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
                        title="Total Files"
                        value={totalFiles}
                        icon={FileDownloadIcon}
                        color={COLORS.primary}
                    />
                </Grid>
            </Grid>

            {/* ✅ Download Section - Handle XLSX + XML files */}
            {status && totalFiles > 0 && (
                <Box
                    sx={{
                        mt: 2.5,
                        p: 2,
                        background: "#fff",
                        border: `1px solid ${COLORS.borderColor}`,
                        borderRadius: 1.5,
                    }}
                >
                    {/* Download All Button */}
                    {totalFiles > 1 && (
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
                                Download All Files ({totalFiles})
                            </Button>
                        </Box>
                    )}

                    {/* ✅ XLSX FILES SECTION */}
                    {xlsxUrls.length > 0 && (
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    backgroundColor: COLORS.primary,
                                    color: "white",
                                    p: 1.2,
                                    borderRadius: "4px 4px 0 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0,
                                }}
                            >
                                <DescriptionIcon fontSize="small" />
                                EXCEL FILES ({xlsxUrls.length})
                            </Typography>

                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                {xlsxUrls.map((url, idx) => (
                                    <Box
                                        key={`xlsx-${idx}`}
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
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                                            <InsertDriveFileIcon sx={{ color: COLORS.primary, fontSize: 24 }} />
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontWeight: 700, color: COLORS.primary, fontSize: "13px" }}
                                                >
                                                    File {idx + 1}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", wordBreak: "break-all" }}>
                                                    {fileNameFromUrl(url)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Tooltip title="Download Excel file">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
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

                    {/* ✅ XML FILES SECTION */}
                    {xmlUrls.length > 0 && (
                        <Box sx={{ mt: 2.5 }}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    backgroundColor: "#6c63ff",
                                    color: "white",
                                    p: 1.2,
                                    borderRadius: "4px 4px 0 0",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 0,
                                }}
                            >
                                <CodeIcon fontSize="small" />
                                XML FILES ({xmlUrls.length})
                            </Typography>

                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                {xmlUrls.map((url, idx) => (
                                    <Box
                                        key={`xml-${idx}`}
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
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
                                            <CodeIcon sx={{ color: "#6c63ff", fontSize: 24 }} />
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ fontWeight: 700, color: "#6c63ff", fontSize: "13px" }}
                                                >
                                                    File {idx + 1}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: "#666", fontSize: "11px", wordBreak: "break-all" }}>
                                                    {fileNameFromUrl(url)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Tooltip title="Download XML file">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<FileDownloadIcon sx={{ fontSize: "16px" }} />}
                                                onClick={() => onDownload(url)}
                                                sx={{
                                                    background: "#6c63ff",
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    whiteSpace: "nowrap",
                                                    "&:hover": {
                                                        background: "#5a52d5",
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
            )}
        </Box>
    );
};

/* ================================================================ */
/*  Main VI Scripting Tool Component - UPDATED                      */
/* ================================================================ */
const MAH_gpl_macro = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = OverAllCss();

    // ✅ STATE MANAGEMENT - Bandwidth removed
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResultData, setUploadResultData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // ======== XML FILE HANDLER ========
    const handleXmlFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (files.length === 0) {
            return;
        }

        // Validate all selected files
        const invalidFiles = files.filter((file) => {
            const fileName = file.name.toLowerCase();
            return !fileName.endsWith(".xml") && !fileName.endsWith(".txt");
        });

        if (invalidFiles.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid File",
                text: "Please select only valid XML files (.xml or .txt)",
            });

            event.target.value = "";
            return;
        }

        // Store all selected files
        setSelectedFiles(files);
    };

    // ======== SUBMIT HANDLER ========
    const handleSubmit = async () => {
        // ✅ No validation needed - files are optional
        try {
            setIsProcessing(true);
            action(true);

            const formData = new FormData();

            // ✅ Append all selected XML files (optional)
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append(`xml_file`, file);
                });
            }

            // ✅ API endpoint
            const response = await postData('mah_macro/mah_slicing/', formData)

            if (response && response.status) {
                setUploadSuccess(true);
                setUploadResultData(response);

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "Files processed successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Failed to process files",
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
        setSelectedFiles([]);
        setUploadSuccess(false);
        setUploadResultData(null);
    };

    // ======== DOWNLOAD HANDLER - Supports multiple files ========
    const downloadFile = (downloadUrl) => {
        try {
            // Method 1: Try direct download with link
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "");
            link.style.display = "none";
            document.body.appendChild(link);
            
            // Trigger click
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            console.error("Download error:", error);
            
            // Method 2: Fallback - open in new window if direct download fails
            try {
                window.open(downloadUrl, "_blank");
                Swal.fire({
                    icon: "info",
                    title: "Opening File",
                    text: "File opened in new window. Please check your browser.",
                    timer: 2000,
                });
            } catch (fallbackError) {
                Swal.fire({
                    icon: "error",
                    title: "Download Failed",
                    text: "Unable to download file. Please try again or refresh the page.",
                });
            }
        }
    };

    useEffect(() => {
        document.title = "Upload GPL for MAH";
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
                    <Typography color='text.primary'>MAH GPL </Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Upload GPL for MAH</Box>

                            <Stack spacing={2.5} sx={{ marginTop: "10px" }} direction="column">
                                {/* ✅ XML FILE SELECTION (Only field) */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select XML Files:-
                                    </div>

                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={selectedFiles.length > 0 ? "warning" : "primary"}
                                                startIcon={<UploadIcon />}
                                            >
                                                {selectedFiles.length > 0
                                                    ? "Change XML Files"
                                                    : "Select XML Files"}

                                                <input
                                                    hidden
                                                    multiple
                                                    accept=".xml,.txt"
                                                    type="file"
                                                    onChange={handleXmlFileChange}
                                                />
                                            </Button>
                                        </div>

                                        {/* Selected file count */}
                                        {selectedFiles.length > 0 && (
                                            <span
                                                style={{
                                                    color: "green",
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    marginLeft: "12px",
                                                }}
                                            >
                                                ✓ {selectedFiles.length} XML file{selectedFiles.length > 1 ? "s" : ""} selected
                                            </span>
                                        )}
                                    </div>
                                </Box>

                                {/* ACTION BUTTONS */}
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    spacing={2}
                                    sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}
                                >
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleSubmit}
                                        endIcon={<UploadIcon />}
                                        disabled={isProcessing}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        {isProcessing ? (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <CircularProgress size={16} sx={{ color: "#fff" }} />
                                                <span>Processing...</span>
                                            </Box>
                                        ) : (
                                            "Submit"
                                        )}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        onClick={handleCancel}
                                        style={{ backgroundColor: COLORS.error, color: "white" }}
                                        endIcon={<DoDisturbIcon />}
                                        disabled={isProcessing}
                                        sx={{ minWidth: "120px" }}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>

                                {/* ✅ RESULT DISPLAY - Handles XLSX + XML file arrays */}
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

export default MAH_gpl_macro;