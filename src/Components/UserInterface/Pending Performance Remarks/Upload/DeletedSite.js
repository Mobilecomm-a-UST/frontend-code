import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Typography,
    Slide,
    TextField,
    Alert,
    CircularProgress,
    Paper,
} from "@mui/material";
import {
    Send as SendIcon,
    DoDisturb as DoDisturbIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    CloudDownload as CloudDownloadIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const DeletedSites = () => {
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    // ======== COLORS ========
    const TEAL_PRIMARY = '#008080';
    const TEAL_DARK = '#006e74';

    // ======== STATE MANAGEMENT ========
    const [siteIds, setSiteIds] = useState("");
    const [atRefNos, setAtRefNos] = useState("");
    const [statusField, setStatusField] = useState("");
    const [reason, setReason] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // ======== HANDLE SUBMIT ========
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!siteIds.trim() && !atRefNos.trim()) {
            Swal.fire({
                icon: "warning",
                title: "No Data Entered",
                text: "Please enter at least one Site ID or AT Reference No.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        if (!statusField.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Status Required",
                text: "Please enter a status.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        if (!reason.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Reason Required",
                text: "Please enter a reason.",
                confirmButtonColor: "#ffc107",
            });
            return;
        }

        setSubmitting(true);
        action(true);
        setErrorMessage("");
        setSuccessMessage("");
        setDownloadUrl("");

        try {
            const requestData = {
                site_id: siteIds.trim(),
                at_ref_no: atRefNos.trim(),
                status: statusField.trim(),
                reason: reason.trim(),
                download_url: "true",
            };

            console.log('Request Data:', requestData);

            const response = await postData("pending_performance_at_remarks/deleted-site/", requestData);

            console.log('Response:', response);

            setSubmitting(false);
            action(false);

            // Check for backend error (status: false)
            if (response?.status === false && response?.message) {
                setErrorMessage(response.message);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.message,
                    confirmButtonColor: "#d32f2f",
                });
                return;
            }

            // Check for error key
            if (response?.error) {
                setErrorMessage(response.error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.error,
                    confirmButtonColor: "#d32f2f",
                });
                return;
            }

            // Check if response was successful (status: true)
            if (response && response.status) {
                let successText = response.message || "Submitted successfully!";
                
                setSuccessMessage(successText);

                // Extract download URL from response
                if (response.download_url) {
                    setDownloadUrl(response.download_url);
                    console.log('Download URL:', response.download_url);
                }

                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    html: successText + (response.download_url ? '<br/><br/><b>Click Download Report to get your file</b>' : ''),
                    confirmButtonColor: "#008080",
                });

                // Clear form
                setSiteIds("");
                setAtRefNos("");
                setStatusField("");
                setReason("");

                // Auto dismiss success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage("");
                }, 5000);
            } else {
                const errorMsg = response?.message || response?.error || "Something went wrong.";
                setErrorMessage(errorMsg);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMsg,
                    confirmButtonColor: "#d32f2f",
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setSubmitting(false);
            action(false);

            const errorMsg = error?.message || "Unable to process request.";
            setErrorMessage(errorMsg);
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
            try {
                // Handle both absolute and relative URLs
                const url = downloadUrl.startsWith('http') 
                    ? downloadUrl 
                    : `${ServerURL}${downloadUrl}`;
                
                window.open(url, '_blank');
            } catch (e) {
                console.error('Error opening download:', e);
                setErrorMessage('Failed to download report. Please try again.');
            }
        } else {
            setErrorMessage('No download URL available. Please submit the form first.');
        }
    };

    // ======== HANDLE DOWNLOAD REPORT BUTTON (Without Submit) ========
    const handleDownloadReportButton = async () => {
        setDownloading(true);
        try {
            const response = await postData("pending_performance_at_remarks/deleted-site/", {
                download_url: "true",
            });

            console.log('Download response:', response);

            if (response?.status === false && response?.message) {
                setErrorMessage(response.message);
                return;
            }

            if (response?.error) {
                setErrorMessage(response.error);
                return;
            }

            if (response?.download_url) {
                const url = response.download_url.startsWith('http') 
                    ? response.download_url 
                    : `${ServerURL}${response.download_url}`;
                
                window.open(url, '_blank');
                setSuccessMessage('Download started successfully!');
                
                setTimeout(() => {
                    setSuccessMessage("");
                }, 3000);
            } else {
                setErrorMessage(response?.message || 'No download URL available');
            }
        } catch (error) {
            console.error('Error downloading:', error);
            setErrorMessage(error?.message || 'Failed to download report. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    // ======== HANDLE CANCEL ========
    const handleCancel = () => {
        setSiteIds("");
        setAtRefNos("");
        setStatusField("");
        setReason("");
        setDownloadUrl("");
        setSuccessMessage("");
        setErrorMessage("");
    };

    useEffect(() => {
        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll('_', ' ')
            .replaceAll('/', ' | ')
            .toUpperCase()}`;
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>
                        Tools
                    </Link>
                    <Typography color="text.primary">Deleted Sites</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Box sx={{ width: { xs: '95%', sm: '85%', md: '70%' } }}>
                        {/* Header with Title & Download Button */}
                        <Paper
                            elevation={3}
                            sx={{
                                background: `linear-gradient(135deg, ${TEAL_PRIMARY} 0%, ${TEAL_DARK} 100%)`,
                                p: 3,
                                mb: 3,
                                borderRadius: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                                boxShadow: '0 8px 24px rgba(0, 128, 128, 0.2)',
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    color: 'white',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Deleted Sites
                            </Typography>
                            <Button
                                variant="contained"
                                size="medium"
                                startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <CloudDownloadIcon />}
                                onClick={handleDownloadReportButton}
                                disabled={downloading}
                                sx={{
                                    bgcolor: 'white',
                                    color: TEAL_PRIMARY,
                                    fontWeight: 700,
                                    fontSize: '12px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0',
                                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:disabled': {
                                        bgcolor: '#e0e0e0',
                                        color: '#9e9e9e',
                                    },
                                }}
                            >
                                {downloading ? 'Downloading...' : 'Download Report'}
                            </Button>
                        </Paper>

                        {/* Alert Messages */}
                        {successMessage && (
                            <Alert
                                severity="success"
                                onClose={() => setSuccessMessage('')}
                                action={
                                    downloadUrl && (
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={handleDownloadClick}
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Download Now
                                        </Button>
                                    )
                                }
                                sx={{
                                    mb: 3,
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
                                    mb: 3,
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

                        {/* Form Card */}
                        <Paper
                            elevation={2}
                            sx={{
                                p: 4,
                                borderRadius: 2,
                                borderTop: `4px solid ${TEAL_PRIMARY}`,
                                boxShadow: '0 4px 16px rgba(0, 128, 128, 0.1)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 6px 24px rgba(0, 128, 128, 0.15)',
                                },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    color: TEAL_DARK,
                                    mb: 1,
                                    letterSpacing: '0.5px',
                                }}
                            >
                                Deleted Sites Entry
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#999',
                                    mb: 3,
                                }}
                            >
                                Add deleted sites information
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={2.5}>
                                    {/* AT Reference No Section */}
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: TEAL_DARK,
                                                mb: 1,
                                                letterSpacing: '0.3px',
                                            }}
                                        >
                                            Enter AT Reference No(s):
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Enter AT reference numbers separated by commas or new lines (e.g., AT-01, AT-02)"
                                            value={atRefNos}
                                            onChange={(e) => setAtRefNos(e.target.value)}
                                            disabled={submitting}
                                            variant="outlined"
                                            sx={{
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
                                    </Box>

                                    {/* Site ID Section */}
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: TEAL_DARK,
                                                mb: 1,
                                                letterSpacing: '0.3px',
                                            }}
                                        >
                                            Enter Site ID(s):
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Enter site IDs separated by commas or new lines (e.g., SITE01, SITE02)"
                                            value={siteIds}
                                            onChange={(e) => setSiteIds(e.target.value)}
                                            disabled={submitting}
                                            variant="outlined"
                                            sx={{
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
                                    </Box>

                                    {/* Status Section */}
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: TEAL_DARK,
                                                mb: 1,
                                                letterSpacing: '0.3px',
                                            }}
                                        >
                                            Status:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Enter status..."
                                            value={statusField}
                                            onChange={(e) => setStatusField(e.target.value)}
                                            disabled={submitting}
                                            variant="outlined"
                                            sx={{
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
                                    </Box>

                                    {/* Reason Section */}
                                    <Box>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: TEAL_DARK,
                                                mb: 1,
                                                letterSpacing: '0.3px',
                                            }}
                                        >
                                            Reason:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            placeholder="Enter reason..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            disabled={submitting}
                                            variant="outlined"
                                            sx={{
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
                                    </Box>

                                    {/* Action Buttons */}
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        sx={{ mt: 3 }}
                                        justifyContent="center"
                                    >
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            size="large"
                                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                            disabled={submitting}
                                            sx={{
                                                minWidth: '140px',
                                                bgcolor: TEAL_PRIMARY,
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
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
                                                },
                                            }}
                                        >
                                            {submitting ? 'Submitting...' : 'Submit'}
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleCancel}
                                            startIcon={<DoDisturbIcon />}
                                            disabled={submitting}
                                            sx={{
                                                minWidth: '140px',
                                                color: '#999',
                                                borderColor: '#e0e0e0',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: '#999',
                                                    backgroundColor: '#f5f5f5',
                                                },
                                                '&:disabled': {
                                                    color: '#ccc',
                                                    borderColor: '#e0e0e0',
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default DeletedSites;