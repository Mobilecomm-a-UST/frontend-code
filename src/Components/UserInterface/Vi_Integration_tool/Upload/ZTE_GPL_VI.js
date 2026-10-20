import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postDataa } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const ZTE_GPL = () => {
    const [make4GFiles, setMake4GFiles] = useState([]);
    const [show4G, setShow4G] = useState(false);
    const [postFiles, setPostFiles] = useState([]);
    const [showPost, setShowPost] = useState(false);
    const [fileUrl, setFileUrl] = useState("");
    const [download, setDownload] = useState(false);
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const handle4GFileSelection = (event) => {
        setMake4GFiles(event.target.files);
    };

    const handleSubmit = async () => {
        if (make4GFiles.length > 0 && postFiles.length > 0) {
            action(true);
            var formData = new FormData();
            for (let i = 0; i < make4GFiles.length; i++) {
                formData.append(`gpl_file`, make4GFiles[i]);
            }
            for (let i = 0; i < postFiles.length; i++) {
                formData.append(`tracker_file`, postFiles[i]);
            }

            const response = await postDataa('ZTE_GPL/process/', formData);

            if (response.status === true) {
                action(false);
                setDownload(true);

                // ✅ Extract the exact string URL from download_urls.output_file
                const outputUrl = response.download_urls?.output_file || "";
                setFileUrl(outputUrl);

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
            } else {
                action(false);
                Swal.fire({
                    icon: "error",
                    title: "Error...",
                    text: `${response.error || "Something went wrong"}`,
                });
            }
        } else {
            if (make4GFiles.length === 0) {
                setShow4G(true);
            } else {
                setShow4G(false);
            }
            if (postFiles.length === 0) {
                setShowPost(true);
            } else {
                setShowPost(false);
            }
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
        }
    };

    const handleCancel = () => {
        setMake4GFiles([]);
        setShow4G(false);
        setPostFiles([]);
        setShowPost(false);
        setDownload(false);
        setFileUrl("");
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`;
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/mobile_network_integration') }}>MNI TOOL</Link>
                    <Typography color='text.primary'>ZTE GPL</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in={true}
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading}>
                                ZTE GPL
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select GPL File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx,.xls,.csv" multiple type="file" 
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
                                            </Button>
                                        </div>

                                        {make4GFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {make4GFiles.length}</span>}

                                        <div><span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </div>
                                </Box>
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Tracker File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={postFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx,.xls,.csv" multiple type="file"
                                                    onChange={(e) => { setPostFiles(e.target.files); setShowPost(false); }} />
                                            </Button>
                                        </div>

                                        {postFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {postFiles.length}</span>}

                                        <div><span style={{ display: showPost ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </div>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />}>cancel</Button>
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleDownloadClick} 
                            title="Export Excel" 
                            startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} 
                            sx={{ marginTop: "10px", width: "auto" }}
                        >
                            <span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>
                                Download GPL Report
                            </span>
                        </Button>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    );
};

export default ZTE_GPL;