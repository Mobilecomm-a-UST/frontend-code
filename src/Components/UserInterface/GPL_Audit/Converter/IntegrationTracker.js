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
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    CheckCircle as CheckCircleIcon,
    AttachFile as AttachFileIcon,
    FileDownload as FileDownloadIcon,
    GetApp as GetAppIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const IntegrationTracker = () => {
    // ======== STATE MANAGEMENT ========
    const [inputFiles, setInputFiles] = useState([]);
    const [integrationDate, setIntegrationDate] = useState("");
    const [scfPreparedBy, setScfPreparedBy] = useState("");
    const [integratedBy, setIntegratedBy] = useState("");
    const [filesError, setFilesError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitResult, setSubmitResult] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [responseRows, setResponseRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // ======== HOOKS ========
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== COLORS ========
    const TEAL_PRIMARY = '#008080';
    const TEAL_DARK = '#006e74';

    // ======== PAGINATION LOGIC ========
    const getColumnHeaders = () => {
        if (!responseRows || responseRows.length === 0) return [];
        return Object.keys(responseRows[0]);
    };

    const columns = getColumnHeaders();
    const totalPages = Math.ceil(responseRows.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = responseRows.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // ======== HANDLE FILE SELECTION ========
    const handleFileSelection = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            // Validate file types
            const validFiles = Array.from(files).filter(file => {
                const extension = file.name.split('.').pop().toLowerCase();
                return ['txt', 'csv', 'xls', 'xlsx', 'xlsb'].includes(extension);
            });

            if (validFiles.length !== files.length) {
                Swal.fire({
                    icon: "warning",
                    title: "Invalid File Type",
                    text: "Please select only TXT, CSV, or Excel files.",
                    confirmButtonColor: "#ffc107",
                });
                return;
            }

            setInputFiles(files);
            setFilesError(false);
            setErrorMessage("");
        }
    };

    // ======== HANDLE DOWNLOAD ========
    const handleDownload = () => {
        if (!downloadUrl) {
            Swal.fire({
                icon: "error",
                title: "Download Not Available",
                text: "No download URL available. Please try submitting again.",
                confirmButtonColor: "#d32f2f",
            });
            return;
        }

        try {
            const url = downloadUrl.startsWith('http')
                ? downloadUrl
                : `${ServerURL}${downloadUrl}`;

            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire({
                icon: "success",
                title: "Download Started",
                text: "Your file download has started.",
                timer: 1500,
                confirmButtonColor: TEAL_PRIMARY,
            });

            console.log('Download started:', url);
        } catch (error) {
            console.error('Download error:', error);
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Failed to download the file. Please try again.",
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE SUBMIT ========
    const handleSubmit = async () => {
        // Validation
        if (!inputFiles || inputFiles.length === 0) {
            setFilesError(true);
            Swal.fire({
                icon: "warning",
                title: "No Files Selected",
                text: "Please select at least one file to upload.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");
        action(true);

        try {
            const formData = new FormData();

            // Append all files
            for (let i = 0; i < inputFiles.length; i++) {
                formData.append('input_files', inputFiles[i]);
            }

            // Append optional text fields
            if (integrationDate.trim()) {
                formData.append('integration_date', integrationDate.trim());
            }
            if (scfPreparedBy.trim()) {
                formData.append('scf_prepared_by', scfPreparedBy.trim());
            }
            if (integratedBy.trim()) {
                formData.append('integrated_by', integratedBy.trim());
            }

            console.log('Submitting form with files:', inputFiles.length);

            // Call API
            const response = await postData('converter/integration_tracker/', formData);

            console.log('API Response:', response);

            action(false);
            setIsSubmitting(false);

            // Check for success (status: true)
            if (response?.status === true) {
                // Success handling
                setSubmitResult(response);
                const successMsg = response.message || "Data submitted successfully!";
                setSuccessMessage(successMsg);

                // Extract download URL
                if (response?.download_url) {
                    setDownloadUrl(response.download_url);
                }

                // Extract and set response rows
                if (response?.rows && Array.isArray(response.rows)) {
                    setResponseRows(response.rows);
                    setCurrentPage(1); // Reset to first page
                }

                Swal.fire({
                    icon: "success",
                    title: "Success ✓",
                    text: successMsg,
                    confirmButtonColor: TEAL_PRIMARY,
                });

                // Clear form
                setInputFiles([]);
                setIntegrationDate("");
                setScfPreparedBy("");
                setIntegratedBy("");
                setFilesError(false);

                // Auto dismiss success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                // Error handling
                const errorMsg = response?.message || response?.error || "Failed to submit data.";
                setErrorMessage(errorMsg);
                setSubmitResult(null);
                setDownloadUrl(null);
                setResponseRows([]);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMsg,
                    confirmButtonColor: "#d32f2f",
                });
            }
        } catch (error) {
            console.error('Submit Error:', error);
            action(false);
            setIsSubmitting(false);

            const errorMsg = error?.message || "Unable to submit data. Please try again.";
            setErrorMessage(errorMsg);
            setSubmitResult(null);
            setDownloadUrl(null);
            setResponseRows([]);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMsg,
                confirmButtonColor: "#d32f2f",
            });
        }
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setInputFiles([]);
        setIntegrationDate("");
        setScfPreparedBy("");
        setIntegratedBy("");
        setFilesError(false);
        setErrorMessage("");
        setSuccessMessage("");
        setSubmitResult(null);
        setDownloadUrl(null);
        setResponseRows([]);
        setCurrentPage(1);
    };

    // ======== SET PAGE TITLE ========
    useEffect(() => {
        document.title = "Integration Tracker";
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
                    <Link underline="hover" onClick={() => { navigate('/tools/mobile_network_integration') }}>MNIT TOOL</Link>
                    <Typography color="text.primary">Integration Tracker</Typography>
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
                                    marginTop: '15px',
                                }}
                                className={classes.Box_Hading}
                            >
                                Integration Tracker
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
                            <Stack spacing={2.5} sx={{ marginTop: "20px" }} direction={'column'}>

                                {/* FILE UPLOAD SECTION */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Upload Files (Required):-
                                        <span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>
                                            {inputFiles.length > 0 && <span style={{ color: 'green', fontWeight: 600 }}>✓ {inputFiles.length} file(s) selected</span>}
                                        </span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={inputFiles.length > 0 ? "warning" : "primary"}
                                                startIcon={<UploadIcon />}
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                    }
                                                }}
                                            >
                                                SELECT FILES
                                                <input
                                                    hidden
                                                    accept=".txt, .csv, .xls, .xlsx, .xlsb"
                                                    multiple
                                                    type="file"
                                                    onChange={(e) => handleFileSelection(e)}
                                                />
                                            </Button>

                                            {filesError && inputFiles.length === 0 && (
                                                <span style={{ color: 'red', fontSize: '16px', fontWeight: 600 }}>
                                                    ✗ This Field Is Required!
                                                </span>
                                            )}
                                        </Box>

                                        {/* File List Display */}
                                        {inputFiles.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="caption" sx={{ color: '#666', fontStyle: 'italic', fontWeight: 600 }}>
                                                    Files selected:
                                                </Typography>
                                                <Box sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                                                    {Array.from(inputFiles).map((file, idx) => (
                                                        <Typography
                                                            key={idx}
                                                            variant="caption"
                                                            display="block"
                                                            sx={{ color: '#666', mb: 0.5 }}
                                                        >
                                                            • {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                                        </Typography>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </div>
                                </Box>

                                {/* INTEGRATION DATE FIELD */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Integration Date (Optional):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            fullWidth
                                            type="date"
                                            value={integrationDate}
                                            onChange={(e) => setIntegrationDate(e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                maxWidth: '300px',
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </div>
                                </Box>

                                {/* SCF PREPARED BY FIELD */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>SCF Prepared By (Optional):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter name or ID of person who prepared SCF"
                                            value={scfPreparedBy}
                                            onChange={(e) => setScfPreparedBy(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                maxWidth: '400px',
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </Box>

                                {/* INTEGRATED BY FIELD */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>Integrated By (Optional):</div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter name or ID of person who performed integration"
                                            value={integratedBy}
                                            onChange={(e) => setIntegratedBy(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                maxWidth: '400px',
                                                '& .MuiOutlinedInput-root': {
                                                    '&:hover fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: TEAL_PRIMARY,
                                                        borderWidth: '2px',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </Box>

                                {/* SUBMIT RESULT */}
                                {submitResult && (
                                    <Paper
                                        sx={{
                                            p: 2,
                                            border: `2px solid #4caf50`,
                                            borderRadius: 2,
                                            backgroundColor: '#f1f8e9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                                                ✓ Data submitted successfully!
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#666' }}>
                                                {submitResult.message}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                )}

                                {/* DOWNLOAD & TABLE COMBINED CARD */}
                                {downloadUrl && responseRows.length > 0 && (
                                    <Paper
                                        sx={{
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            border: `2px solid ${TEAL_PRIMARY}`,
                                        }}
                                    >
                                        {/* Download Section */}
                                        <Box
                                            sx={{
                                                p: 2.5,
                                                background: `linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)`,
                                                borderBottom: `2px solid ${TEAL_PRIMARY}`,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: TEAL_DARK, mb: 1.5 }}>
                                                📥 Download Your Generated File
                                            </Typography>
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
                                                Download File
                                            </Button>
                                        </Box>

                                        {/* Table Header with Row Count */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                                px: 2,
                                                py: 1.5,
                                                background: `linear-gradient(135deg, ${TEAL_PRIMARY} 0%, ${TEAL_DARK} 100%)`,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <GetAppIcon sx={{ color: "#fff", fontSize: 20 }} />
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}
                                                >
                                                    Response Data - {responseRows.length} Record(s)
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="caption"
                                                sx={{ color: "#fff", fontWeight: 600 }}
                                            >
                                                Page {currentPage} of {totalPages}
                                            </Typography>
                                        </Box>

                                        {/* Table */}
                                        <TableContainer sx={{ maxHeight: 500 }}>
                                            <Table
                                                size="small"
                                                stickyHeader
                                                sx={{
                                                    borderCollapse: "collapse",
                                                    "& .MuiTableCell-root": { 
                                                        border: `1px solid #e0e0e0`, 
                                                        py: 1, 
                                                        px: 1.5,
                                                        fontSize: 13 
                                                    },
                                                }}
                                            >
                                                <TableHead>
                                                    <TableRow sx={{ backgroundColor: TEAL_PRIMARY }}>
                                                        {columns.map((column) => (
                                                            <TableCell
                                                                key={column}
                                                                sx={{
                                                                    backgroundColor: TEAL_PRIMARY,
                                                                    color: "#fff",
                                                                    fontWeight: 700,
                                                                    whiteSpace: "nowrap",
                                                                    minWidth: 120,
                                                                }}
                                                            >
                                                                {column}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {currentRows.map((row, idx) => (
                                                        <TableRow 
                                                            key={idx}
                                                            sx={{
                                                                backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "#ffffff",
                                                                '&:hover': {
                                                                    backgroundColor: '#f0f7f7',
                                                                }
                                                            }}
                                                        >
                                                            {columns.map((column) => (
                                                                <TableCell
                                                                    key={`${idx}-${column}`}
                                                                    sx={{
                                                                        color: TEAL_DARK,
                                                                        fontVariantNumeric: "tabular-nums",
                                                                    }}
                                                                >
                                                                    {row[column] ?? "-"}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f8f9fa',
                                                    borderTop: `1px solid #e0e0e0`,
                                                }}
                                            >
                                                <Pagination
                                                    count={totalPages}
                                                    page={currentPage}
                                                    onChange={handlePageChange}
                                                    color="primary"
                                                    size="medium"
                                                    showFirstButton
                                                    showLastButton
                                                    sx={{
                                                        '& .MuiPaginationItem-root': {
                                                            color: TEAL_DARK,
                                                            borderColor: TEAL_PRIMARY,
                                                            '&.Mui-selected': {
                                                                backgroundColor: TEAL_PRIMARY,
                                                                color: 'white',
                                                            },
                                                            '&:hover': {
                                                                backgroundColor: '#e3f2f2',
                                                            },
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Paper>
                                )}

                                {/* SUMMARY CARD */}
                                <Paper sx={{ p: 2, background: "#f8f9fa", border: "1px solid #e0e0e0", borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: TEAL_DARK }}>
                                        Summary
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                                Files Selected
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: TEAL_DARK }}>
                                                {inputFiles.length} file(s)
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                                Integration Date
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: TEAL_DARK }}>
                                                {integrationDate || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                                SCF Prepared By
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: TEAL_DARK }}>
                                                {scfPreparedBy || "-"}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="caption" sx={{ color: "#666", fontWeight: 600 }}>
                                                Integrated By
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5, color: TEAL_DARK }}>
                                                {integratedBy || "-"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
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
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <UploadIcon />}
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
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
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
                                    Cancel
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

export default IntegrationTracker;