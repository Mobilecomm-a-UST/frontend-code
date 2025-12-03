import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import TopicIcon from '@mui/icons-material/Topic';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const SNmaping = () => {

    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);

    const [showFiles, setShowFiles] = useState({
        locator: [],
        mobinate: [],
        msmf: [],
        rfs: []
    });

    const [showError, setShowError] = useState({
        mobinate: false,
        rfs: false,
        msmf: false,
        locator: false
    });

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const link = `${ServerURL}${fileData}`;

    // -------- Fetch Files ---------
    const fetchMobinetFileData = async () => {
        action(true);

        const rfs = await getData('mobinate_vs_cats/rfs/');
        const msmf = await getData('mobinate_vs_cats/msmf/');
        const mobinate = await getData('mobinate_vs_cats/mobinet_dump/');
        const locator = await getData('mobinate_vs_cats/locator/');

        action(false);

        setShowFiles({
            locator: locator?.files || [],
            msmf: msmf?.files || [],
            rfs: rfs?.files || [],
            mobinate: mobinate?.files || []
        });
    };

    // -------- Submit ----------
    const handleSubmit = async () => {
        const errors = {
            mobinate: showFiles.mobinate.length === 0,
            locator: showFiles.locator.length === 0,
            rfs: showFiles.rfs.length === 0,
            msmf: showFiles.msmf.length === 0
        };

        setShowError(errors);

        const isValid = Object.values(errors).every((item) => item === false);

        if (!isValid) return;

        action(true);
        const response = await getData("mobinate_vs_cats/site_sn/");
        action(false);

        if (response.status) {
            setDownload(true);
            setFileData(response.download_url);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    };

    const handleCancel = () => {
        setDownload(false);
        setShowError({ mobinate: false, rfs: false, msmf: false, locator: false });
    };

    useEffect(() => {
        document.title = "SN MAPPING";
        fetchMobinetFileData();
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>
                        Mobinet Vs CATS
                    </Link>
                    <Typography color="text.primary">SN Mapping</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>SN Mapping RFS & MS-MF</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* Mobinate Dump */}
                                <FileBox
                                    title="Mobinet Dump Files"
                                    data={showFiles.mobinate}
                                    error={showError.mobinate}
                                />

                                {/* RFS */}
                                <FileBox
                                    title="RFS Files"
                                    data={showFiles.rfs}
                                    error={showError.rfs}
                                />

                                {/* MS-MF */}
                                <FileBox
                                    title="MS-MF Files"
                                    data={showFiles.msmf}
                                    error={showError.msmf}
                                />

                                {/* Locator */}
                                <FileBox
                                    title="Locator Files"
                                    data={showFiles.locator}
                                    error={showError.locator}
                                />

                            </Stack>

                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                justifyContent="space-around"
                                mt={2}
                            >
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>
                                    Submit
                                </Button>

                                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }}
                                    endIcon={<DoDisturbIcon />}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    {download && (
                        <Box textAlign="center">
                            <a href={fileData} download>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                                    sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                                >
                                    SN Mapping Report
                                </Button>
                            </a>
                        </Box>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    );
};

const FileBox = ({ title, data, error }) => (
    <Box className={OverAllCss().Front_Box}>
        <div className={OverAllCss().Front_Box_Hading}>{title}:</div>

        <div className={OverAllCss().Front_Box_Select_Button}>
            <Grid container rowSpacing={1} columnSpacing={1}>
                {data.map((item, index) => (
                    <Grid item xs={4} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} /> {item}
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {error && (
                <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
            )}
        </div>
    </Box>
);

export default SNmaping;
