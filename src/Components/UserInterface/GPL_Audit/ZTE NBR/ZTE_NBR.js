import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Chip, Typography, Breadcrumbs, Link, Slide } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import { postDataa } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const ZTE_NBR = () => {
    const [file2G, setFile2G] = useState([]);
    const [show2G, setShow2G] = useState(false);
    const [file4G, setFile4G] = useState([]);
    const [show4G, setShow4G] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [download, setDownload] = useState(false);
    
    const { loading, action: setLoading } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    const handleFileChange = (type, e) => {
        const selected = Array.from(e.target.files || []);
        if (type === '2g') {
            setFile2G(selected);
            setShow2G(false);
        } else {
            setFile4G(selected);
            setShow4G(false);
        }
        e.target.value = "";
    };

    const handleSubmit = async () => {
        const has2G = file2G.length > 0;
        const has4G = file4G.length > 0;

        setShow2G(!has2G);
        setShow4G(!has4G);

        if (!has2G || !has4G) {
            Swal.fire({
                icon: "warning",
                title: "Missing Files",
                text: "Please select both RF 2G and RF 4G files.",
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            
            file2G.forEach((file) => formData.append("rf_2g_file", file));
            file4G.forEach((file) => formData.append("rf_4g_file", file));

            const response = await postDataa('ZTE_NBR/zte_nbr/', formData);
            setLoading(false);

            if (response && (response.status === true || response.status === "true")) {
                setDownload(true);
                const outputUrl = response.download_urls?.output_file || response.download_url || "";
                setFileUrl(outputUrl);

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: response.message || "Processed successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error...",
                    text: response?.error || response?.message || "Something went wrong on the server.",
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: error.message || "Failed to communicate with the server.",
            });
        }
    };

    const handleDownloadClick = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            Swal.fire("Error", "Download URL is not available.", "error");
        }
    };

    const handleCancel = () => {
        setFile2G([]);
        setShow2G(false);
        setFile4G([]);
        setShow4G(false);
        setDownload(false);
        setFileUrl("");
    };

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate('/tools')} sx={{ cursor: 'pointer' }}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate('/tools/mobile_network_integration')} sx={{ cursor: 'pointer' }}>MNI TOOL</Link>
                    <Typography color='text.primary'>ZTE NBR</Typography>
                </Breadcrumbs>
            </div>
            <Slide direction='left' in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading}>
                                ZTE NBR
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

                                {/* 2G File Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select RF 2G File:-
                                    </div>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
                                        <Button variant="contained" component="label" color={file2G.length > 0 ? "warning" : "primary"}>
                                            Select File
                                            <input hidden accept=".xlsx,.xls,.csv" multiple type="file" onChange={(e) => handleFileChange('2g', e)} />
                                        </Button>

                                        {file2G.length > 0 && (
                                            <Chip 
                                                label={`${file2G.length} file${file2G.length > 1 ? 's' : ''} selected`} 
                                                color="success" 
                                                size="small"
                                                onDelete={() => setFile2G([])} 
                                            />
                                        )}
                                    </Stack>
                                    {show2G && <Typography color="error" sx={{ mt: 1, fontWeight: 600 }}>This Field Is Required !</Typography>}
                                </Box>

                                {/* 4G File Section */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select RF 4G File:-
                                    </div>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap' }}>
                                        <Button variant="contained" component="label" color={file4G.length > 0 ? "warning" : "primary"}>
                                            Select File
                                            <input hidden accept=".xlsx,.xls,.csv" multiple type="file" onChange={(e) => handleFileChange('4g', e)} />
                                        </Button>

                                        {file4G.length > 0 && (
                                            <Chip 
                                                label={`${file4G.length} file${file4G.length > 1 ? 's' : ''} selected`} 
                                                color="success" 
                                                size="small"
                                                onDelete={() => setFile4G([])} 
                                            />
                                        )}
                                    </Stack>
                                    {show4G && <Typography color="error" sx={{ mt: 1, fontWeight: 600 }}>This Field Is Required !</Typography>}
                                </Box>
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} sx={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center', mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleDownloadClick} 
                            startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />} 
                        >
                            <span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none" }}>
                                Download NBR Report
                            </span>
                        </Button>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default ZTE_NBR;