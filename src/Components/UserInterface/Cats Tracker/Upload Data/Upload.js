import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Slide from '@mui/material/Slide';
import { usePost } from "../../../Hooks/PostApis";

const Upload = () => {
    const {  makePostRequest, cancelRequest } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [rawShow, setRawShow] = useState(false)
    const [fileData, setFileData] = useState()
    const rawKpiLength = rawKpiFile.filename.length
    const classes = OverAllCss()
    const navigate = useNavigate()
    var link = `${ServerURL}${fileData}`;


    const handleRawKpiFile = (event) => {
        setRawShow(false);
        setRawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }

    // highlite driver js
    const startTour = () => {
        const driverObj = driver({

            showProgress: true,
            steps: [
                { element: '#step-1', popover: { title: ' Select CATS Tracker File', description: ' Select CATS Tracker File generated from MyCom Tool', side: "bottom", align: 'start' } },
                // { element: '#step-2', popover: { title: 'Select Site List File', description: 'Either select site list in excel formate having column name 2G ID', side: "left", align: 'start' } },
                // { element: '#step-3', popover: { title: 'Enter Site List', description: 'OR paste site id in this field', side: "left", align: 'start' } },
                // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
                { element: '#step-3', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
                // { element: '#step-4', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
                // { element: '#step-5', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
            ]
        });


        driverObj.drive();
    };

    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const handleSubmit = async () => {

        if (rawKpiLength > 0) {

            setOpen(true)
            var formData = new FormData();
            formData.append("file", rawKpiFile.bytes);
            const response = await makePostRequest('MO_BASED_REPORT/upload/', formData)
            console.log('response data givan dataa', response)
            if (response) {
                setOpen(false);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
            }
            else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }

        }
        else {
            if (rawKpiLength == 0) {
                setRawShow(true)
            }
        }
    };




    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}
                keepMounted
            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    {/* <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box> */}
                    <Box style={{ textAlign: 'center' }}><img src="/assets/cloud-upload.gif" style={{ height: 200 }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }


    const handleCancel = () => {
        setRawKpiFile({ filename: "", bytes: "" })
    }


    useEffect(() => {
        const fetchDownloadTemp = async () => {
            const res = await getData('Zero_Count_Rna_Payload_App/template', { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })

            if (res) {
                setFileData(res.download_4G)
            }
            // console.log('temp. download link' , res)

        }

        fetchDownloadTemp();

    }, [])




    return (
        <Slide
            direction='left'
            in='true'
            // style={{ transformOrigin: '0 0 0' }}
            timeout={1000}
        >
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/cats_tracker') }}>CATS Tracker</Link>
                        <Typography color='text.primary'>Upload Data</Typography>
                    </Breadcrumbs>
                </div>
                <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Help">
                        <Fab color="primary" aria-label="add" onClick={startTour}>
                            <LiveHelpIcon />
                        </Fab>
                    </Tooltip>
                </Box>

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box}>
                        <Box className={classes.Box_Hading}>
                            Upload Monthly CATS Tracker Report
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            <Box className={classes.Front_Box} id="step-1">
                                <div className={classes.Front_Box_Hading}>
                                    Select CATS Tracker File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handleRawKpiFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: rawShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>


                        </Stack>
                        <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Box id="step-5">
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} id='step-3'>upload</Button>
                            </Box>
                            <Box >
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                            </Box >
                        </Box>
                    </Box>
                    {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
        <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
      </Box> */}



                </Box>
                {loadingDialog()}




            </div>
        </Slide>
    )
}

export default Upload