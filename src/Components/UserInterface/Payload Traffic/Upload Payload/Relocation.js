import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { postData } from "../../../services/FetchNodeServices";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import OverAllCss from "../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from 'react-router-dom'
import Slide from '@mui/material/Slide';
import { IconButton } from 'rsuite';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Divider from '@mui/material/Divider';


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

    const classes = OverAllCss()
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    const extractErrorMessage = (err) => {
        const data = err?.response?.data
        if (!data) return err?.message || "Something went wrong"

        if (typeof data === "string") return data
        if (data.detail) return data.detail
        if (data.message) return data.message

        if (typeof data === "object") {
            const parts = Object.entries(data).map(([field, msgs]) => {
                const msgText = Array.isArray(msgs) ? msgs.join(" ") : msgs
                return `${field}: ${msgText}`
            })
            if (parts.length) return parts.join(" | ")
        }

        return "Request failed. Please check your input and try again."
    }

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
                downloadFile(response.download_url);
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
                downloadFile(response.download_url);
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

    // ========== Get current download URL ==========
    const getCurrentDownloadUrl = () => {
        return manualDownloadUrl;
    };

    return (
        <Zoom in={true} timeout={500}>
            <div>
                <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
                        <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
                        <Typography color='text.primary'>Relocation</Typography>
                    </Breadcrumbs>
                </div>
                <Slide direction='left' in='true' timeout={1000}>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box}>
                            {/* ========== HEADING WITH DOWNLOAD ICON ========== */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box className={classes.Box_Hading}>
                                    📋 Relocation Report
                                </Box>

                                {/* ========== DOWNLOAD ICON - RIGHT SIDE OF HEADING ========== */}
                                <Tooltip title={uploadDownloadUrl || manualDownloadUrl ? "Download File" : "Download Template"}>
                                    <IconButton
                                        onClick={() => {
                                            if (uploadDownloadUrl || manualDownloadUrl) {
                                                downloadFile(uploadDownloadUrl || manualDownloadUrl);
                                            } else {
                                                handleTemplateDownload();
                                            }
                                        }}
                                        disabled={templateDownloadProcessing}
                                        sx={{
                                            color: uploadDownloadUrl || manualDownloadUrl ? '#1da3a3' : '#006e74',
                                            fontSize: '32px',
                                            '&:hover': { bgcolor: 'rgba(0, 110, 116, 0.1)' }
                                        }}
                                    >
                                        <CloudDownloadIcon sx={{ fontSize: '32px' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Stack spacing={3} sx={{ marginTop: "10px" }}>

                                {/* ========== SECTION 1: FILE UPLOAD ========== */}
                                <Box className={classes.Front_Box} id="step-upload">
                                    <div className={classes.Front_Box_Hading}>
                                        📤 Upload Pre/Post Report
                                    </div>
                                    <Stack spacing={2}>
                                        <Box>
                                            <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
                                                Select Excel File
                                            </div>
                                            <div className={classes.Front_Box_Select_Button}>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    startIcon={<UploadIcon />}
                                                    sx={{ fontWeight: 700, textTransform: "none" }}
                                                >
                                                    {uploadFile ? "Change File" : "Select File"}
                                                    <input
                                                        hidden
                                                        accept=".xlsx,.xls,.xlsb"
                                                        type="file"
                                                        onChange={handleUploadFileChange}
                                                    />
                                                </Button>
                                                {uploadFile && (
                                                    <span style={{ color: "green", fontSize: "14px", fontWeight: 600, marginLeft: "12px" }}>
                                                        ✓ {uploadFile.name}
                                                    </span>
                                                )}
                                            </div>
                                        </Box>

                                        <Box style={{ display: 'flex', justifyContent: "center", gap: 2, marginTop: "15px" }}>
                                            <Button variant="contained" color="success" onClick={handleFileUploadSubmit} disabled={uploadProcessing} endIcon={<UploadIcon />}>
                                                {uploadProcessing ? "Processing..." : "Submit"}
                                            </Button>
                                            <Button variant="contained" onClick={handleFileUploadCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* ========== SECTION 2: GENERATE REPORT ========== */}
                                <Box className={classes.Front_Box} id="step-manual">
                                    <div className={classes.Front_Box_Hading}>
                                        ✏️ Generate Report
                                    </div>
                                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                                        <Box>
                                            <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
                                                On-Air Date
                                            </div>
                                            <input
                                                value={manualOnAirDate}
                                                onChange={(e) => setManualOnAirDate(e.target.value)}
                                                type="date"
                                                placeholder="dd-mm-yyyy"
                                                style={{ width: '165px', height: '35px', fontSize: '14px', fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        <Box>
                                            <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
                                                Circle (Copy/Paste)
                                            </div>
                                            <TextField
                                                value={manualCircle}
                                                onChange={(e) => setManualCircle(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Paste circle"
                                                sx={{ width: '100%', maxWidth: '300px' }}
                                            />
                                        </Box>

                                        <Box>
                                            <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
                                                Old Site ID (Copy/Paste)
                                            </div>
                                            <TextField
                                                value={manualOldSiteId}
                                                onChange={(e) => setManualOldSiteId(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Paste old site ID"
                                                sx={{ width: '100%', maxWidth: '300px' }}
                                            />
                                        </Box>

                                        <Box>
                                            <div className={classes.Front_Box_Hading} style={{ fontSize: '13px' }}>
                                                Site ID (Copy/Paste)
                                            </div>
                                            <TextField
                                                value={manualSiteId}
                                                onChange={(e) => setManualSiteId(e.target.value)}
                                                size="small"
                                                variant="outlined"
                                                placeholder="Paste site ID"
                                                sx={{ width: '100%', maxWidth: '300px' }}
                                            />
                                        </Box>

                                        <Box style={{ display: 'flex', justifyContent: "center", gap: 2, marginTop: "15px" }}>
                                            <Button variant="contained" color="success" onClick={handleManualSubmit} disabled={manualProcessing} endIcon={<UploadIcon />}>
                                                {manualProcessing ? "Processing..." : "Submit"}
                                            </Button>
                                            <Button variant="contained" onClick={handleManualCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                                        </Box>

                                        {manualDownloadUrl && (
                                            <Box sx={{ p: 1.5, bgcolor: "#e3f2f2", borderRadius: 1, textAlign: 'center', border: '1px solid #006e74' }}>
                                                <Typography variant="caption" sx={{ color: '#006e74', fontWeight: 700, fontSize: '12px' }}>
                                                    ✓ Report downloaded
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Slide>
            </div>
        </Zoom>
    )
}

export default Relocation