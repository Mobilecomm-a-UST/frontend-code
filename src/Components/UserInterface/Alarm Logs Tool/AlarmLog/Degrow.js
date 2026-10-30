import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Breadcrumbs,
    Link,
    Typography,
    Button,
    Tabs,
    Tab,
    TextField,
    Alert,
    Divider,
    Card,
    CardContent,
} from '@mui/material';
import {
    Upload as UploadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    GetApp as GetAppIcon,
    CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TopicIcon from '@mui/icons-material/Topic';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import OverAllCss from "../../../csss/OverAllCss";
import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

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

const Degrow = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const [showFiles, setShowFiles] = useState([]);
    const [selectFiles, setSelectFiles] = useState([]);
    const [showError, setShowError] = useState({ selectfile: false });
    const [selectedDate, setSelectedDate] = useState('');
    const [dateError, setDateError] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [processMessage, setProcessMessage] = useState('');

    const API_ENDPOINT = "degrow/upload";
    const PROCESS_ENDPOINT = "degrow/process_file";
    const BACK_FOLDER = "degrow_data";

    // Fetch uploaded files function
    const fetchApiData = async () => {
        action(true);
        try {
            const response = await getData(`${API_ENDPOINT}/`);
            if (response?.status) {
                const filename = response?.input_file?.filename;
                setShowFiles(filename ? [filename] : []);
            } else {
                setShowFiles([]);
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            setShowFiles([]);
        } finally {
            action(false);
        }
    };

    // Automatically fetch files when the dialog is opened
    useEffect(() => {
        if (openDialog) {
            fetchApiData();
        }
    }, [openDialog]);

    const handleOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setActiveTab(0);
        setShowFiles([]);
        setShowError({ selectfile: false });
        setSelectFiles([]);
        setSelectedDate('');
        setDateError(false);
        setReportData(null);
        setProcessMessage('');
    };

    // Handle Tab Change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setDateError(false);
        setProcessMessage('');
        setReportData(null);
    };

    // Handle Upload File(s)
    const handleSubmit = async () => {
        if (selectFiles.length === 0) {
            setShowError({ selectfile: true });
            return;
        }

        action(true);
        const formData = new FormData();
        Array.from(selectFiles).forEach((file) => {
            formData.append("file", file);
        });

        try {
            const response = await postData(`${API_ENDPOINT}/`, formData);
            action(false);

            if (response?.status && !response?.error) {
                fetchApiData();
                setShowError({ selectfile: false });
                setSelectFiles([]);
                Swal.fire({ 
                    icon: "success", 
                    title: "Done", 
                    text: response.message || "Uploaded successfully" 
                });
            } else {
                Swal.fire({ 
                    icon: "error", 
                    title: "Upload Failed", 
                    text: response?.error || response?.message || "No files uploaded or processing error." 
                });
            }
        } catch (error) {
            action(false);
            Swal.fire({ 
                icon: "error", 
                title: "Error", 
                text: error?.message || "Unable to process upload request." 
            });
        }
    };

    // Handle Generate Report
    const handleGenerateReport = async () => {
        if (!selectedDate) {
            setDateError(true);
            setProcessMessage('Please select a date');
            return;
        }

        action(true);
        setProcessMessage('');
        setReportData(null);

        try {
            // API expects date in YYYY-MM-DD format (keep as-is from date picker)
            // Key can be De_Grow_Date or de_grow_date
            const payload = {
                De_Grow_Date: selectedDate
            };

            console.log('Sending payload:', payload);

            const response = await postData(`${PROCESS_ENDPOINT}/`, payload);
            action(false);

            console.log('API Response:', response);

            if (response?.status && !response?.error) {
                setReportData(response);
                setProcessMessage('✓ Report generated successfully');
                
                // If download_url exists, auto-download
                if (response?.download_url) {
                    const downloadUrl = response.download_url.startsWith('http') 
                        ? response.download_url 
                        : `https://commtoolapi.mcpspmis.com${response.download_url}`;
                    
                    window.open(downloadUrl, '_blank');
                }

                Swal.fire({ 
                    icon: "success", 
                    title: "Done", 
                    text: response.message || "Report generated successfully" 
                });
            } else {
                const errorMsg = response?.error || response?.message || 'Failed to generate report';
                setProcessMessage(`✗ ${errorMsg}`);
                Swal.fire({ 
                    icon: "error", 
                    title: "Generation Failed", 
                    text: errorMsg
                });
            }
        } catch (error) {
            action(false);
            const errorMsg = error?.message || 'Error generating report';
            setProcessMessage(`✗ ${errorMsg}`);
            Swal.fire({ 
                icon: "error", 
                title: "Error", 
                text: errorMsg
            });
        }
    };

    // Handle Delete All
    const handleDelete = async () => {
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
            const response = await deleteData(`${API_ENDPOINT}/`);
            action(false);

            if (response?.status) {
                setShowFiles([]);
                Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Failed to delete" });
            }
        }
    };

    // Handle Single File Delete
    const OneFileDelete = async (fileName) => {
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
            const body = { filename: `${fileName}`, foldername: `${BACK_FOLDER}` };
            const response = await deleteData(`${API_ENDPOINT}/`, { data: body });
            action(false);

            if (response?.status) {
                fetchApiData();
                Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response?.message || "Failed to delete" });
            }
        }
    };

    useEffect(() => {
        document.title = "TOOLS | DEGROW";
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Typography color="text.primary">Degrow</Typography>
                </Breadcrumbs>
            </Box>

            <Box sx={{ margin: '20px' }}>
                <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                    <Grid item xs={12} md={4}>
                        <Box
                            onClick={handleOpen}
                            sx={{
                                border: '1px solid black',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '10px',
                                padding: 1.5,
                                alignItems: 'center',
                                borderRadius: '8px',
                                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&:hover': { 
                                    backgroundColor: '#223354', 
                                    color: 'white',
                                    transform: 'translateY(-4px)',
                                    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 8px 20px'
                                },
                            }}
                        >
                            <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
                            <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>Degrow Upload</Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Upload Dialog with Tabs */}
            {openDialog && (
                <Dialog
                    fullWidth
                    maxWidth="lg"
                    TransitionComponent={Transition}
                    open={openDialog}
                    onClose={handleClose}
                    sx={{ zIndex: 2 }}
                >
                    <DialogTitle>
                        <span style={{ float: 'left' }}>
                            <h2>Degrow Management</h2>
                        </span>
                        <span style={{ float: 'right' }}>
                            <IconButton size="large" onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </span>
                    </DialogTitle>

                    {/* Tabs */}
                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: '1px solid #e0e0e0',
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '15px',
                                textTransform: 'none',
                                color: '#666',
                                '&.Mui-selected': {
                                    color: '#1976d2',
                                    fontWeight: 700,
                                }
                            }
                        }}
                    >
                        <Tab label="📤 Upload Files" />
                        <Tab label="📊 Generate Report" />
                    </Tabs>

                    <DialogContent>
                        {/* TAB 1: UPLOAD FILES */}
                        {activeTab === 0 && (
                            <>
                                <Box sx={{ border: "2px solid #e0e0e0", borderRadius: '8px', padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <UploadSection
                                            color={selectFiles.length > 0 ? "warning" : "primary"}
                                            multiple
                                            onChange={(e) => {
                                                setSelectFiles(Array.from(e.target.files));
                                                setShowError((prev) => ({ ...prev, selectfile: false }));
                                            }}
                                            error={showError?.selectfile}
                                            selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
                                        />
                                    </Box>
                                    <Box sx={{ ml: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="success" 
                                            onClick={handleSubmit} 
                                            endIcon={<UploadIcon />}
                                            sx={{ fontWeight: 700, py: 1.5, px: 3 }}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                </Box>

                                {showFiles?.length > 0 && (
                                    <Box sx={{ border: "2px solid #e0e0e0", borderRadius: '8px', padding: 2, marginTop: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>📁 Uploaded Files</Typography>
                                        <Grid container rowSpacing={2} columnSpacing={2} direction={{ xs: "column", sm: "column", md: "row" }}>
                                            {showFiles.map((item, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: 'flex-start',
                                                            alignItems: 'center',
                                                            cursor: 'pointer',
                                                            borderRadius: '6px',
                                                            padding: 1.5,
                                                            background: '#e9e9e9',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': { 
                                                                backgroundColor: '#dc3545', 
                                                                color: 'white',
                                                                transform: 'scale(1.02)'
                                                            }
                                                        }}
                                                        onClick={() => OneFileDelete(item)}
                                                    >
                                                        <TopicIcon sx={{ color: '#FEA405', mr: 1, fontSize: 28 }} />
                                                        <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>{item}</Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Box sx={{ textAlign: 'center', marginTop: 3 }}>
                                            <Button 
                                                onClick={handleDelete} 
                                                variant="contained" 
                                                fullWidth 
                                                color="error" 
                                                endIcon={<DeleteIcon />}
                                                sx={{ fontWeight: 700, py: 1.5 }}
                                            >
                                                Delete All Files
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </>
                        )}

                        {/* TAB 2: GENERATE REPORT */}
                        {activeTab === 1 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>📊 Generate DeGrow Report</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                    Select a date to generate the DeGrow report in YYYY-MM-DD format (e.g., 2026-10-08).
                                </Typography>

                                <Box sx={{ border: "2px solid #e0e0e0", borderRadius: '8px', padding: 3, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 1, minWidth: 200 }}>
                                        <TextField
                                            label="DeGrow Date"
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value);
                                                setDateError(false);
                                            }}
                                            error={dateError}
                                            helperText={dateError ? "Please select a date" : "Format: YYYY-MM-DD (e.g., 2026-10-08)"}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '6px'
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleGenerateReport}
                                        endIcon={<GetAppIcon />}
                                        sx={{ fontWeight: 700, py: 2, px: 3, minWidth: 150 }}
                                    >
                                        Generate Report
                                    </Button>
                                </Box>

                                {processMessage && (
                                    <Alert 
                                        severity={processMessage.startsWith('✓') ? "success" : "error"}
                                        sx={{ mt: 2, fontWeight: 600 }}
                                    >
                                        {processMessage}
                                    </Alert>
                                )}

                                {reportData && (
                                    <Card sx={{ mt: 3, bgcolor: '#f9f9f9', border: '2px solid #4caf50' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                                                    Report Generated Successfully
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Grid container spacing={2}>
                                                {/* De Grow Date */}
                                                <Grid item xs={12} sm={6}>
                                                    <Card sx={{ p: 2, bgcolor: '#fff', border: '1px solid #e0e0e0' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                            📅 De Grow Date
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.75, color: '#0E7C7B' }}>
                                                            {reportData?.de_grow_date || selectedDate}
                                                        </Typography>
                                                    </Card>
                                                </Grid>

                                                {/* Rows Processed */}
                                                <Grid item xs={12} sm={6}>
                                                    <Card sx={{ p: 2, bgcolor: '#e3f2fd', border: '1px solid #2196f3' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#01579b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                            ✓ Rows Processed
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.75, color: '#01579b' }}>
                                                            {reportData?.rows_processed || 0}
                                                        </Typography>
                                                    </Card>
                                                </Grid>

                                                {/* Post Date */}
                                                {reportData?.post_date && (
                                                    <Grid item xs={12} sm={6}>
                                                        <Card sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#e65100', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                                📆 Post Date Range
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.75, color: '#e65100' }}>
                                                                {reportData.post_date}
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                )}

                                                {/* Filename */}
                                                <Grid item xs={12} sm={6}>
                                                    <Card sx={{ p: 2, bgcolor: '#f3e5f5', border: '1px solid #9c27b0' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#4a148c', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                            📄 File Name
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.75, color: '#4a148c', wordBreak: 'break-word' }}>
                                                            {reportData?.filename}
                                                        </Typography>
                                                    </Card>
                                                </Grid>

                                                {/* Site Dates (if available) */}
                                                {reportData?.site_dates && Object.keys(reportData.site_dates).length > 0 && (
                                                    <Grid item xs={12}>
                                                        <Card sx={{ p: 2, bgcolor: '#ede7f6', border: '1px solid #673ab7' }}>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#512da8', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                                                                🔗 Site Dates
                                                            </Typography>
                                                            <Box sx={{ mt: 1 }}>
                                                                <pre style={{ fontSize: '12px', maxHeight: '150px', overflow: 'auto', padding: '8px', bgcolor: '#fff', borderRadius: '4px', border: '1px solid #ddd' }}>
                                                                    {JSON.stringify(reportData.site_dates, null, 2)}
                                                                </pre>
                                                            </Box>
                                                        </Card>
                                                    </Grid>
                                                )}

                                                {/* Download Button */}
                                                {reportData?.download_url && (
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            fullWidth
                                                            endIcon={<GetAppIcon />}
                                                            onClick={() => {
                                                                const downloadUrl = reportData.download_url.startsWith('http') 
                                                                    ? reportData.download_url 
                                                                    : `https://commtoolapi.mcpspmis.com${reportData.download_url}`;
                                                                window.open(downloadUrl, '_blank');
                                                            }}
                                                            sx={{ fontWeight: 700, py: 1.5 }}
                                                        >
                                                            📥 Download Report (.xlsx)
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {loading}
        </>
    );
};

const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
    return (
        <Box>
            <div className={OverAllCss().Front_Box_Hading}>{label || 'Select Files'}</div>
            <div className={OverAllCss().Front_Box_Select_Button}>
                <Button 
                    variant="contained" 
                    component="label" 
                    color={color}
                    sx={{ fontWeight: 700 }}
                >
                    Select File
                    <input
                        hidden
                        required
                        type="file"
                        accept=".csv, .xls, .xlsx, .xlsb"
                        multiple={multiple}
                        onChange={onChange}
                    />
                </Button>
                {selectedText && (
                    <span style={{ color: "green", fontSize: 16, fontWeight: 700, marginLeft: 15 }}>
                        ✓ {selectedText}
                    </span>
                )}
                {error && (
                    <div>
                        <span style={{ color: "red", fontSize: 16, fontWeight: 700 }}>⚠ This Field Is Required!</span>
                    </div>
                )}
            </div>
        </Box>
    );
};

export default Degrow;