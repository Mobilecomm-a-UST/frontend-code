import React, { useState } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { ServerURL } from "../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';
import { usePost } from "../../../../Hooks/PostApis";
 
const Degrow = () => {
    const { makePostRequest, cancelRequest } = usePost();
 
    const [preKpiFile, setPreKpiFile] = useState({ filename: "", bytes: "" });
    const [postKpiFile, setPostKpiFile] = useState({ filename: "", bytes: "" });
 
    const [open, setOpen] = useState(false);
    const [preShow, setPreShow] = useState(false);
    const [postShow, setPostShow] = useState(false);
 
    const [fileData, setFileData] = useState("");
    const [dlink, setDlink] = useState(false);
 
    const preKpiLength = preKpiFile.filename.length;
    const postKpiLength = postKpiFile.filename.length;
 
    const classes = OverAllCss();
 
    var link = `${ServerURL}${fileData}`;
 
    const handlePreKpiFile = (event) => {
        setPreShow(false);
        setPreKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        });
    };
 
    const handlePostKpiFile = (event) => {
        setPostShow(false);
        setPostKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        });
    };
 
    // Driver Tour
    const startTour = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                {
                    element: '#step-1',
                    popover: {
                        title: 'Select Pre File',
                        description: 'Select Pre KPI file',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#step-2',
                    popover: {
                        title: 'Select Post File',
                        description: 'Select Post KPI file',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#step-3',
                    popover: {
                        title: 'Submit',
                        description: 'Click submit button',
                        side: "center",
                        align: 'start'
                    }
                }
            ]
        });
 
        driverObj.drive();
    };
 
    const handleSubmit = async () => {
        if (preKpiLength > 0 && postKpiLength > 0) {
            setOpen(true);
 
            var formData = new FormData();
            formData.append("pre_file", preKpiFile.bytes);
            formData.append("post_file", postKpiFile.bytes);
 
            const response = await makePostRequest(
                'trend/bih/makeKpiTrend/new/degrow/',
                formData
            );
 
            setFileData(response.download_url);
 
            if (response.status === true) {
                setOpen(false);
                setDlink(true);
 
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: response.message,
                });
            } else {
                setOpen(false);
 
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.message,
                });
            }
        } else {
            if (preKpiLength === 0) setPreShow(true);
            if (postKpiLength === 0) setPostShow(true);
        }
    };
 
    // Loading Dialog
    const loadingDialog = () => {
        return (
            <Dialog open={open} keepMounted>
                <DialogContent>
                    <Box style={{ textAlign: 'center' }}>
                        <GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} />
                    </Box>
 
                    <Box style={{
                        margin: '10px 0px',
                        fontWeight: 'bolder',
                        textAlign: 'center'
                    }}>
                        DATA UNDER PROCESSING...
                    </Box>
 
                    <Button
                        variant="contained"
                        fullWidth
                        style={{ backgroundColor: "red", color: 'white' }}
                        onClick={cancelRequest}
                        endIcon={<DoDisturbIcon />}
                    >
                        Cancel
                    </Button>
                </DialogContent>
            </Dialog>
        );
    };
 
    const handleCancel = () => {
        setPreKpiFile({ filename: "", bytes: "" });
        setPostKpiFile({ filename: "", bytes: "" });
        setDlink(false);
    };
 
    return (
        <Zoom in={true} timeout={500}>
            <div>
 
                <div style={{ margin: 10 }}>
                    <Breadcrumbs
                        separator={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/trends'>Trend</Link>
                        <Link underline="hover" href='/trends/br'>BR</Link>
                        <Typography color='text.primary'>Degrow</Typography>
                    </Breadcrumbs>
                </div>
 
                <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Help">
                        <Fab color="primary" onClick={startTour}>
                            <LiveHelpIcon />
                        </Fab>
                    </Tooltip>
                </Box>
 
                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading}>
                            Make Degrow Trend
                        </Box>
 
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>
 
                            {/* PRE FILE */}
                            <Box className={classes.Front_Box} id='step-1'>
                                <div className={classes.Front_Box_Hading}>
                                    Select Pre File:
                                    <span style={{
                                        fontFamily: 'Poppins',
                                        color: "gray",
                                        marginLeft: 20
                                    }}>
                                        {preKpiFile.filename}
                                    </span>
                                </div>
 
                                <div className={classes.Front_Box_Select_Button}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        color={preKpiFile.state ? "warning" : "primary"}
                                    >
                                        Select File
                                        <input
                                            hidden
                                            type="file"
                                            accept="/*"
                                            onChange={handlePreKpiFile}
                                        />
                                    </Button>
 
                                    <span style={{
                                        display: preShow ? 'inherit' : 'none',
                                        color: 'red',
                                        fontSize: '18px',
                                        fontWeight: 600
                                    }}>
                                        This Field Is Required !
                                    </span>
                                </div>
                            </Box>
 
                            {/* POST FILE */}
                            <Box className={classes.Front_Box} id='step-2'>
                                <div className={classes.Front_Box_Hading}>
                                    Select Post File:
                                    <span style={{
                                        fontFamily: 'Poppins',
                                        color: "gray",
                                        marginLeft: 20
                                    }}>
                                        {postKpiFile.filename}
                                    </span>
                                </div>
 
                                <div className={classes.Front_Box_Select_Button}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        color={postKpiFile.state ? "warning" : "primary"}
                                    >
                                        Select File
                                        <input
                                            hidden
                                            type="file"
                                            accept="/*"
                                            onChange={handlePostKpiFile}
                                        />
                                    </Button>
 
                                    <span style={{
                                        display: postShow ? 'inherit' : 'none',
                                        color: 'red',
                                        fontSize: '18px',
                                        fontWeight: 600
                                    }}>
                                        This Field Is Required !
                                    </span>
                                </div>
                            </Box>
                        </Stack>
 
                        {/* Buttons */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: "space-around",
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 2,
                            marginTop: "20px"
                        }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                endIcon={<UploadIcon />}
                                id='step-3'
                            >
                                Submit
                            </Button>
 
                            <Button
                                variant="contained"
                                onClick={handleCancel}
                                style={{
                                    backgroundColor: "red",
                                    color: 'white'
                                }}
                                endIcon={<DoDisturbIcon />}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
 
                    {/* Download */}
                    <Box style={{ display: dlink ? "inherit" : "none" }}>
                        <a download href={fileData}>
                            <Button
                                variant="outlined"
                                startIcon={
                                    <FileDownloadIcon
                                        style={{
                                            fontSize: 30,
                                            color: "green"
                                        }}
                                    />
                                }
                                sx={{
                                    marginTop: "10px"
                                }}
                            >
                                <span style={{
                                    fontFamily: "Poppins",
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    textTransform: "none"
                                }}>
                                    Download KPI Trend
                                </span>
                            </Button>
                        </a>
                    </Box>
                </Box>
 
                {loadingDialog()}
            </div>
        </Zoom>
    );
};
 
export default Degrow;
 