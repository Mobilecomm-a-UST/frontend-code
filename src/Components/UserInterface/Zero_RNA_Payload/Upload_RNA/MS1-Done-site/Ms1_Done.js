import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { getData, ServerURL } from "../../../../services/FetchNodeServices";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import OverAllCss from "../../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Slide from '@mui/material/Slide';
import DownloadIcon from '@mui/icons-material/Download';
import TextField from '@mui/material/TextField';
import { usePost } from "../../../../Hooks/PostApis";

const Ms1_Done = () => {
    const { makePostRequest, cancelRequest } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [siteData, setSiteData] = useState([])
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
    const handleSiteList = (event) => {
        let dd = event.target.value
        // console.log('dddddddddddd', dd)
        let list =''

        if(dd.toLowerCase().includes('sams')){
            // console.log('SAMS',dd.replaceAll(',', '_'))
            list = dd.replaceAll(',', '*')
        }
        // else{
        //     setSiteData(dd.replaceAll(' ', ','))
        // }
        // let list = dd.replaceAll(' ', ',')
        setSiteData(list.replaceAll(' ', ','))
        console.log('list', list.replaceAll(' ', ','))


    }

    // highlite driver js
    const startTour = () => {
        const driverObj = driver({

            showProgress: true,
            steps: [
                { element: '#step-1', popover: { title: 'Select RAW KPI File', description: 'Select Raw KPI file generated from MyCom Tool', side: "bottom", align: 'start' } },
                { element: '#step-2', popover: { title: 'Select Site List File', description: 'Either select site list in excel formate having column name 2G ID', side: "left", align: 'start' } },
                // { element: '#step-3', popover: { title: 'Enter Site List', description: 'OR paste site id in this field', side: "left", align: 'start' } },
                // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
                { element: '#step-3', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
                // { element: '#step-4', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
                // { element: '#step-5', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
            ]
        });


        driverObj.drive();
    };



    const handleSubmit = async () => {
        console.log('girraj singh')

        if (siteData.length > 0) {

            setOpen(true)
            var formData = new FormData();
            formData.append("str_short_list", siteData);
            const response = await makePostRequest('Zero_Count_Rna_Payload_Tool/ms1_site_deletion/', formData)
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
            if (siteData.length == 0) {
                setRawShow(true)
            }
        }
    };

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"

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
     setSiteData([])
    }


    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

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
                        <Link underline="hover" onClick={() => { navigate('/tools/others') }}>Other</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/others/zero_RNA_payload') }}>Zero RNA Payload</Link>
                        <Typography color='text.primary'>MS1 Done Site</Typography>
                    </Breadcrumbs>
                </div>
                {/* <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Help">
                        <Fab color="primary" aria-label="add" onClick={startTour}>
                            <LiveHelpIcon />
                        </Fab>
                    </Tooltip>
                </Box>
                <Box style={{ position: 'fixed', right: 20, marginTop: 70 }}>
                    <Tooltip title="Download 2G Temp.">
                        <a download href={link}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>
                        </a>
                    </Tooltip>
                </Box> */}
                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box}>
                        <Box className={classes.Box_Hading}>
                            Remove MS1 Done Cells
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            <Box className={classes.Front_Box} id="step-3">
                                <div className={classes.Front_Box_Hading}>
                                    Enter Site List:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div>
                                        {/* <input onChange={handleSiteListFile}   multiple type="search" sx={{width:'100px'}}/> */}
                                        <TextField value={siteData} onChange={handleSiteList} fullWidth size="small" type="search" variant="outlined" style={{ width: 'auto' }} />
                                    </div>

                                </div>
                            </Box>


                        </Stack>
                        <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Box id="step-5">
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} id='step-3'>submit</Button>
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

export default Ms1_Done