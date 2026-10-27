import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Typography,
    Slide,
    Alert,
    CircularProgress,
    Paper,
    Card,
    CardContent,
    Grid,
    Chip,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    CheckCircle as CheckCircleIcon,
    Storage as StorageIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const DeGrow = () => {
    // ======== STATE MANAGEMENT ========
    const [csvFile, setCsvFile] = useState(null);
    const [uploadError, setUploadError] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [processResult, setProcessResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ======== HOOKS ========
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== COLORS ========
    const TEAL_PRIMARY = '#008080';
    const TEAL_DARK = '#006e74';

    // ======== HANDLE FILE SELECTION ========
    const handleFileSelection = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.name.toLowerCase().endsWith('.csv')) {
                setUploadError(true);
                Swal.fire({
                    icon: "warning",
                    title: "Invalid File Type",
                    text: "Please select a CSV file.",
                    confirmButtonColor: "#ffc107",
                });
                return;
            }
            setCsvFile(file);
            setUploadError(false);
            setErrorMessage("");
        }
    };

    // ======== HANDLE UPLOAD ========
    const handleUpload = async () => {
        if (!csvFile) {
            setUploadError(true);
            Swal.fire({
                icon: "warning",
                title: "No File Selected",
                text: "Please select a CSV file to upload.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        setIsUploading(true);
        setErrorMessage("");
        setSuccessMessage("");
        action(true);

        try {
            const formData = new FormData();
            formData.append('file', csvFile);

            console.log('Uploading CSV file:', csvFile.name);

            // Call upload API
            const response = await postData('degrow/upload/', formData);

            console.log('Upload Response:', response);

            action(false);
            setIsUploading(false);

            // Check for success (status: true)
            if (response?.status === true) {
                // Success handling
                setUploadResult(response);
                setSuccessMessage(response.message || "File uploaded successfully!");

                Swal.fire({
                    icon: "success",
                    title: "Upload Successful ✓",
                    html: `
                        <b>Filename:</b> ${response.filename}<br/>
                        <b>Rows Read:</b> ${response.rows_read}
                    `,
                    confirmButtonColor: TEAL_PRIMARY,
                });
            } else {
                // Error handling
                const errorMsg = response?.message || "Failed to upload file.";
                setErrorMessage(errorMsg);
                setUploadResult(null);

                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    text: errorMsg,
                    confirmButtonColor: "#d32f2f",
                });
            }
        } catch (error) {
            console.error('Upload Error:', error);
            action(false);
            setIsUploading(false);

            const errorMsg = error?.message || "Unable to upload file. Please try again.";
            setErrorMessage(errorMsg);
            setUploadResult(null);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE PROCESS/GENERATE REPORT ========
    const handleGenerateReport = async () => {
        if (!uploadResult) {
            Swal.fire({
                icon: "warning",
                title: "Upload First",
                text: "Please upload a CSV file before generating the report.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        setIsProcessing(true);
        setErrorMessage("");
        setSuccessMessage("");
        action(true);

        try {
            console.log('Processing file with filename:', uploadResult.filename);

            // Call process API with filename
            const response = await postData('degrow/process_file/', {
                filename: uploadResult.filename,
            });

            console.log('Process Response:', response);

            action(false);
            setIsProcessing(false);

            // Check for success (status: true)
            if (response?.status === true) {
                // Success handling
                setProcessResult(response);
                setSuccessMessage(response.message || "Report generated successfully!");

                Swal.fire({
                    icon: "success",
                    title: "Report Generated ✓",
                    html: `
                        <b>De-grow Date:</b> ${response.de_grow_date}<br/>
                        <b>Post Date:</b> ${response.post_date}<br/>
                        <b>Rows Processed:</b> ${response.rows_processed}<br/>
                        <b>Output File:</b> ${response.filename}
                    `,
                    confirmButtonColor: TEAL_PRIMARY,
                });
            } else {
                // Error handling
                const errorMsg = response?.message || "Failed to process file.";
                setErrorMessage(errorMsg);
                setProcessResult(null);

                Swal.fire({
                    icon: "error",
                    title: "Processing Failed",
                    text: errorMsg,
                    confirmButtonColor: "#d32f2f",
                });
            }
        } catch (error) {
            console.error('Process Error:', error);
            action(false);
            setIsProcessing(false);

            const errorMsg = error?.message || "Unable to process file. Please try again.";
            setErrorMessage(errorMsg);
            setProcessResult(null);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE DOWNLOAD ========
    const handleDownload = () => {
        if (processResult?.download_url) {
            try {
                const url = processResult.download_url.startsWith('http')
                    ? processResult.download_url
                    : `${ServerURL}${processResult.download_url}`;

                window.open(url, '_blank');
                console.log('Download started:', url);
            } catch (e) {
                console.error('Download Error:', e);
                setErrorMessage('Failed to download file. Please try again.');
            }
        }
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setCsvFile(null);
        setUploadError(false);
        setUploadResult(null);
        setProcessResult(null);
        setErrorMessage("");
        setSuccessMessage("");
    };

    // ======== SET PAGE TITLE ========
    useEffect(() => {
        document.title = "De-Grow Report Generator";
    }, []);

    return (
        <>
            {/* BREADCRUMB NAVIGATION */}
            <Box sx={{ margin: 1, marginLeft: 2, marginTop: 2 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate('/tools')} sx={{ cursor: 'pointer' }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate('/tools/pending_performance_at_remarks')} sx={{ cursor: 'pointer' }}>
                        Pending Performance AT
                    </Link>
                    <Typography color="text.primary">De-Grow Report</Typography>
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
                                De-Grow Report Generator
                            </Box>

                            {/* ALERTS */}
                            {successMessage && (
                                <Alert
                                    severity="success"
                                    onClose={() => setSuccessMessage('')}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#e8f5e9',
                                        color: '#2e7d32',
                                        '& .MuiAlert-icon': {
                                            color: '#4caf50',
                                        },
                                    }}
                                >
                                    {successMessage}
                                </Alert>
                            )}

                            {errorMessage && (
                                <Alert
                                    severity="error"
                                    onClose={() => setErrorMessage('')}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#ffebee',
                                        color: '#c62828',
                                        '& .MuiAlert-icon': {
                                            color: '#f44336',
                                        },
                                    }}
                                >
                                    {errorMessage}
                                </Alert>
                            )}

                            {/* CONTENT SECTION */}
                            <Stack spacing={3} sx={{ marginTop: "20px" }} direction={'column'}>
                                {/* STEP 1: FILE SELECTION & UPLOAD */}
                                <Paper
                                    sx={{
                                        p: 3,
                                        border: `2px solid ${TEAL_PRIMARY}`,
                                        borderRadius: 2,
                                        backgroundColor: '#f0fffe',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: '#e8fffe',
                                            borderColor: TEAL_DARK,
                                        },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Box
                                            sx={{
                                                bgcolor: TEAL_PRIMARY,
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 700,
                                            }}
                                        >
                                            1
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: TEAL_DARK }}>
                                            Upload CSV File
                                        </Typography>
                                    </Box>

                                    <Box className={classes.Front_Box}>
                                        <div className={classes.Front_Box_Hading}>
                                            Select CSV File:-
                                            <span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>
                                                {csvFile && <span style={{ color: 'green', fontWeight: 600 }}>✓ {csvFile.name}</span>}
                                            </span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button}>
                                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    color={csvFile ? "warning" : "primary"}
                                                    startIcon={<UploadIcon />}
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
                                                        accept=".csv"
                                                        type="file"
                                                        onChange={(e) => handleFileSelection(e)}
                                                    />
                                                </Button>

                                                {uploadError && csvFile === null && (
                                                    <span style={{ color: 'red', fontSize: '16px', fontWeight: 600 }}>
                                                        ✗ This Field Is Required!
                                                    </span>
                                                )}
                                            </Box>
                                        </div>
                                    </Box>
                                </Paper>

                                {/* STEP 2: UPLOAD RESULT */}
                                {uploadResult && (
                                    <Paper
                                        sx={{
                                            p: 3,
                                            border: `2px solid #4caf50`,
                                            borderRadius: 2,
                                            backgroundColor: '#f1f8e9',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                                File Uploaded Successfully
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            Filename
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK }}>
                                                            {uploadResult.filename}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            Rows Read
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK }}>
                                                            {uploadResult.rows_read?.toLocaleString()}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )}

                                {/* STEP 3: GENERATE REPORT */}
                                {uploadResult && !processResult && (
                                    <Paper
                                        sx={{
                                            p: 3,
                                            border: `2px solid ${TEAL_PRIMARY}`,
                                            borderRadius: 2,
                                            backgroundColor: '#f0fffe',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Box
                                                sx={{
                                                    bgcolor: TEAL_PRIMARY,
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: 32,
                                                    height: 32,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                2
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: TEAL_DARK }}>
                                                Generate Report
                                            </Typography>
                                        </Box>

                                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                            Process the uploaded file to generate the De-Grow report in Excel format.
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            onClick={handleGenerateReport}
                                            disabled={isProcessing}
                                            startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <StorageIcon />}
                                            sx={{
                                                bgcolor: TEAL_PRIMARY,
                                                color: 'white',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                px: 3,
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
                                            {isProcessing ? 'Processing...' : 'Generate Report'}
                                        </Button>
                                    </Paper>
                                )}

                                {/* STEP 4: PROCESS RESULT & DOWNLOAD */}
                                {processResult && (
                                    <Paper
                                        sx={{
                                            p: 3,
                                            border: `2px solid #4caf50`,
                                            borderRadius: 2,
                                            backgroundColor: '#f1f8e9',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                                Report Generated Successfully
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2} sx={{ mb: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            De-Grow Date
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK }}>
                                                            {processResult.de_grow_date}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            Post Date
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK }}>
                                                            {processResult.post_date}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            Rows Processed
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK }}>
                                                            {processResult.rows_processed?.toLocaleString()}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Card sx={{ bgcolor: '#fff' }}>
                                                    <CardContent>
                                                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                                            Output File
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: TEAL_DARK, wordBreak: 'break-all' }}>
                                                            {processResult.filename}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            onClick={handleDownload}
                                            startIcon={<FileDownloadIcon />}
                                            sx={{
                                                bgcolor: TEAL_PRIMARY,
                                                color: 'white',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                px: 3,
                                                boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: TEAL_DARK,
                                                    boxShadow: '0 6px 20px rgba(0, 128, 128, 0.4)',
                                                    transform: 'translateY(-2px)',
                                                }
                                            }}
                                        >
                                            Download Excel Report
                                        </Button>
                                    </Paper>
                                )}
                            </Stack>

                            {/* ACTION BUTTONS */}
                            <Stack
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                spacing={2}
                                sx={{
                                    display: 'flex',
                                    justifyContent: "space-around",
                                    marginTop: "30px",
                                    flexWrap: 'wrap',
                                    gap: '20px'
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleUpload}
                                    disabled={!csvFile || isUploading}
                                    startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
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
                                        },
                                        '&:disabled': {
                                            bgcolor: '#e0e0e0',
                                            color: '#9e9e9e',
                                        }
                                    }}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
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
                                    Reset
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Slide>

            {/* LOADING DIALOG */}
            {loading}
        </>
    );
};

export default DeGrow;