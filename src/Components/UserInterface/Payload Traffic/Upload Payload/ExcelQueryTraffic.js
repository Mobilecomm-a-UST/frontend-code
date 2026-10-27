import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const ExcelQueryTraffic = () => {
    // ======== STATE MANAGEMENT ========
    const [excelFiles, setExcelFiles] = useState([]);
    const [showError, setShowError] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState("");
    const [downloading, setDownloading] = useState(false);

    // ======== HOOKS ========
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== COLORS ========
    const TEAL_PRIMARY = '#008080';
    const TEAL_DARK = '#006e74';

    // ======== HANDLE FILE SELECTION ========
    const handleFileSelection = (event) => {
        setExcelFiles(event.target.files);
        setShowError(false);
    };

    // ======== HANDLE SUBMIT ========
    const handleSubmit = async () => {
        // Validation
        if (excelFiles.length === 0) {
            setShowError(true);
            Swal.fire({
                icon: "warning",
                title: "No File Selected",
                text: "Please select at least one file to upload.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        action(true);

        try {
            // Create FormData
            const formData = new FormData();
            
            // Append all selected files
            for (let i = 0; i < excelFiles.length; i++) {
                formData.append('file', excelFiles[i]);
            }

            console.log('Uploading files:', excelFiles.length);

            // Call API with new endpoint
            const response = await postData('payload_traffic/input_excel/', formData);

            console.log('API Response:', response);

            action(false);

            // Check for success (status: true)
            if (response?.status === true) {
                // Success handling
                const successMsg = response.message || "Files uploaded successfully!";

                // Extract download URL from response
                if (response.download_url) {
                    setDownloadUrl(response.download_url);
                    console.log('Download URL:', response.download_url);
                }

                // Show success alert
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: successMsg,
                    confirmButtonColor: TEAL_PRIMARY,
                });

                // Clear form
                setExcelFiles([]);
                setShowError(false);
            } else {
                // Error handling - status: false
                const errorMsg = response?.message || "Failed to process files.";

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMsg,
                    confirmButtonColor: "#d32f2f",
                });
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            action(false);

            const errorMsg = error?.message || "Unable to upload files. Please try again.";

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE DOWNLOAD ========
    const handleDownloadClick = async () => {
        if (downloadUrl) {
            setDownloading(true);
            try {
                // Handle both absolute and relative URLs
                const url = downloadUrl.startsWith('http') 
                    ? downloadUrl 
                    : `${ServerURL}${downloadUrl}`;
                
                window.open(url, '_blank');
                console.log('Download started:', url);
            } catch (e) {
                console.error('Error opening download:', e);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to download file. Please try again.",
                    confirmButtonColor: "#d32f2f",
                });
            } finally {
                setDownloading(false);
            }
        } else {
            Swal.fire({
                icon: "warning",
                title: "No Download Available",
                text: "Please upload files first.",
                confirmButtonColor: "#ffc107",
            });
        }
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setExcelFiles([]);
        setShowError(false);
        setDownloadUrl("");
    };

    // ======== SET PAGE TITLE ========
    useEffect(() => {
        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll('_', ' ')
            .replaceAll('/', ' | ')
            .toUpperCase()}`;
    }, []);

    return (
        <>
            {/* BREADCRUMB NAVIGATION */}
            <Box sx={{ margin: 1, marginLeft: 2, marginTop: 4 }}>
                <Breadcrumbs 
                    aria-label="breadcrumb" 
                    itemsBeforeCollapse={2} 
                    maxItems={3} 
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate('/tools')} sx={{ cursor: 'pointer' }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate('/tools/payload_traffic')} sx={{ cursor: 'pointer' }}>
                        Payload Traffic
                    </Link>
                    <Typography color="text.primary">Excel Query Traffic</Typography>
                </Breadcrumbs>
            </Box>

            {/* SLIDE ANIMATION */}
            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box 
                            className={classes.Back_Box} 
                            sx={{ 
                                width: { md: '75%', xs: '100%' }
                            }}
                        >
                            {/* HEADER BAR */}
                            <Box 
                                sx={{
                                    background: `linear-gradient(135deg, ${TEAL_PRIMARY} 0%, ${TEAL_DARK} 100%)`,
                                    color: 'white',
                                    p: 2.5,
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    fontSize: '20px',
                                    boxShadow: '0 4px 15px rgba(0, 128, 128, 0.3)',
                                    mb: 0,
                                    letterSpacing: '0.5px',
                                    marginTop: '20px',
                                }}
                                className={classes.Box_Hading}
                            >
                                Excel Query Traffic
                            </Box>

                            {/* CONTENT SECTION */}
                            <Stack spacing={2} sx={{ marginTop: "-5px" }} direction={'column'}>
                                {/* FILE SELECTION BOX */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel/CSV Files:-
                                        <span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>
                                            {excelFiles.length > 0 && <span style={{ color: 'green', fontWeight: 600 }}>✓ Selected: {excelFiles.length} file(s)</span>}
                                        </span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left", display: 'flex', gap: '15px', alignItems: 'center', width: '100%' }}>
                                            <Button 
                                                variant="contained" 
                                                component="label" 
                                                color={excelFiles.length > 0 ? "warning" : "primary"}
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                    }
                                                }}
                                            >
                                                SELECT FILE
                                                <input 
                                                    hidden 
                                                    accept=".csv, .xls, .xlsx, .xlsb" 
                                                    multiple 
                                                    type="file"
                                                    onChange={(e) => handleFileSelection(e)}
                                                />
                                            </Button>

                                            {/* Error message */}
                                            {showError && excelFiles.length === 0 && (
                                                <span style={{ color: 'red', fontSize: '16px', fontWeight: 600 }}>
                                                    ✗ This Field Is Required!
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Box>
                            </Stack>

                            {/* ACTION BUTTONS */}
                            <Stack 
                                direction={{ xs: "column", sm: "column", md: "row" }} 
                                spacing={2} 
                                style={{ 
                                    display: 'flex', 
                                    justifyContent: "space-around", 
                                    marginTop: "20px",
                                    flexWrap: 'wrap',
                                    gap: '20px'
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={handleSubmit}
                                    startIcon={<UploadIcon />}
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        px: 3,
                                        boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                >
                                    SUBMIT
                                </Button>

                                <Button 
                                    variant="contained" 
                                    onClick={handleCancel}
                                    sx={{ 
                                        backgroundColor: "#d32f2f", 
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '16px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        px: 3,
                                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: "#b71c1c",
                                            boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                                            transform: 'translateY(-2px)',
                                        }
                                    }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    CANCEL
                                </Button>
                            </Stack>

                            {/* DOWNLOAD BUTTON - Only show if download URL available */}
                            {downloadUrl && (
                                <Box sx={{ textAlign: 'center', mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleDownloadClick}
                                        disabled={downloading}
                                        startIcon={downloading ? <CircularProgress size={20} color="inherit" /> : <FileDownloadIcon />}
                                        sx={{
                                            bgcolor: TEAL_PRIMARY,
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            px: 4,
                                            py: 1.5,
                                            boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: TEAL_DARK,
                                                boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:disabled': {
                                                bgcolor: '#e0e0e0',
                                                color: '#9e9e9e',
                                            }
                                        }}
                                    >
                                        {downloading ? 'Downloading...' : 'Download Parsed File'}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {/* LOADING DIALOG */}
            {loading}
        </>
    );
};

export default ExcelQueryTraffic;