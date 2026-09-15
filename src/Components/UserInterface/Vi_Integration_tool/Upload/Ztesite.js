import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Card, CardContent, Grid, Typography, Alert, Paper } from "@mui/material";
import { Breadcrumbs, Link } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DnsIcon from '@mui/icons-material/Dns';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Same color palette used in RecoReport, for a consistent look.
const COLORS = {
    primary: "#006e74",
    primaryDark: "#00494d",
    success: "#28a745",
    lightBg: "#f8f9fa",
    borderColor: "#c9dcdc",
    headerGradient: "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)",
};

// Pulls a readable filename out of a download URL for display.
const fileNameFromUrl = (url) => {
    try {
        return decodeURIComponent(url.split("/").filter(Boolean).pop() || url);
    } catch {
        return url;
    }
};

/* ================================================================ */
/*  Result display — mirrors RecoReport's pattern: files only open   */
/*  on a real button click (a genuine user gesture), never           */
/*  automatically. This is what makes RecoReport's download 100%     */
/*  reliable, and multi-file downloads need the same approach.       */
/* ================================================================ */
const SiteResult = ({ message, urls }) => {
    if (!urls || urls.length === 0) return null;

    // Opens every file in its own tab. Because this runs synchronously
    // inside the button's onClick (a real user gesture), browsers allow
    // all of them — unlike opening them automatically after an API call.
    const handleDownloadAll = () => {
        urls.forEach((url) => {
            window.open(url, "_blank", "noopener,noreferrer");
        });
    };

    const handleDownloadOne = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <Box sx={{ mt: 2, p: 2, background: COLORS.lightBg, borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}` }}>
            {message && (
                <Alert
                    icon={<CheckCircleIcon sx={{ fontSize: "18px" }} />}
                    severity="success"
                    sx={{ background: `${COLORS.success}15`, border: `1px solid ${COLORS.success}`, color: COLORS.success, fontWeight: 600, fontSize: "12px", mb: 2, py: 1, px: 1.5 }}
                >
                    ✓ {message}
                </Alert>
            )}

            <Button
                variant="contained"
                startIcon={<DownloadForOfflineIcon sx={{ fontSize: "18px" }} />}
                onClick={handleDownloadAll}
                sx={{ background: COLORS.primary, color: "#fff", fontWeight: 700, textTransform: "none", fontSize: "13px", px: 2.5, py: 1, borderRadius: 1, mb: 2, "&:hover": { background: COLORS.primaryDark } }}
            >
                Download All Files ({urls.length})
            </Button>

            <Paper sx={{ borderRadius: 1.5, border: `1px solid ${COLORS.borderColor}`, overflow: "hidden" }}>
                <Box sx={{ background: COLORS.headerGradient, p: 1, display: "flex", alignItems: "center", gap: 0.8 }}>
                    <DnsIcon sx={{ color: "#fff", fontSize: 16 }} />
                    <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "11px", textTransform: "uppercase", letterSpacing: 0.3 }}>
                        Generated Files
                    </Typography>
                </Box>
                <Stack spacing={1} sx={{ p: 1.5 }}>
                    {urls.map((url, idx) => (
                        <Button
                            key={idx}
                            variant="outlined"
                            startIcon={<FileDownloadIcon sx={{ fontSize: 16, color: COLORS.success }} />}
                            onClick={() => handleDownloadOne(url)}
                            sx={{ justifyContent: "flex-start", textTransform: "none", fontWeight: 600, fontSize: "12.5px", color: COLORS.primaryDark, borderColor: COLORS.borderColor }}
                        >
                            {fileNameFromUrl(url)}
                        </Button>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
};

const Ztesite = () => {
    const [make4GFiles, setMake4GFiles] = useState([]);
    const [show4G, setShow4G] = useState(false);
    const [download, setDownload] = useState(false);
    const [fileUrls, setFileUrls] = useState([]);
    const [resultMessage, setResultMessage] = useState("");
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const handle4GFileSelection = (event) => {
        setMake4GFiles(event.target.files);
    };

    const handleSubmit = async () => {
        if (make4GFiles.length > 0) {
            action(true);
            const formData = new FormData();
            for (let i = 0; i < make4GFiles.length; i++) {
                formData.append(`rf_file`, make4GFiles[i]);
            }

            const response = await postData('zte_vil/site_creation/', formData);
            action(false);

            if (response.status === true) {
                setDownload(true);
                setFileUrls(Array.isArray(response.download_url) ? response.download_url : []);
                setResultMessage(response.message || "");

                // NOTE: no automatic window.open here — files are only opened when
                // the person clicks "Download All Files" or an individual file
                // button, same as RecoReport. This is what makes it reliable.

                Swal.fire({ icon: "success", title: "Done", text: `${response.message}` });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: `${response.message}` });
            }
        } else {
            setShow4G(true);
        }
    };

    const handleCancel = () => {
        setMake4GFiles([]);
        setDownload(false);
        setFileUrls([]);
        setResultMessage("");
        setShow4G(false);
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                     <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                     <Link underline="hover" onClick={() => { navigate('/tools/ix_tools/vi_integration') }}>VI Tracker</Link>
                    <Typography color='text.primary'>Upload ZTE Site</Typography>
                </Breadcrumbs>
            </div>
            <Slide direction='left' in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading}>Create ZTE Site Summary</Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx,.xls,.xlsm" multiple type="file"
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
                                            </Button>
                                        </div>
                                        {make4GFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {make4GFiles.length}</span>}
                                        <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} >Submit</Button>
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>cancel</Button>
                            </Stack>

                            {/* Result — files open only when the person clicks a download button */}
                            {download && <SiteResult message={resultMessage} urls={fileUrls} />}
                        </Box>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default Ztesite;