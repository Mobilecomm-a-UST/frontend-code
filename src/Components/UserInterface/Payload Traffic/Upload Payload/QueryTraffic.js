import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { usePost } from "../../../Hooks/PostApis";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import Slide from '@mui/material/Slide';
import { IconButton } from 'rsuite';


const QueryTraffic = () => {

    const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [siteData, setSiteData] = useState([])
    const [offerDate, setOfferDate] = useState()
    const [rawShow, setRawShow] = useState(false)
    const [siteShow, setSiteShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [dlink, setDlink] = useState(false)
    const [download, setDownload] = useState(false);
    const siteListLength = siteListFile.filename.length
    const { makePostRequest, cancelRequest } = usePost()
    const classes = OverAllCss()
    const navigate = useNavigate()


    var link = `${ServerURL}${fileData}`;

    const handleSiteListFile = (event) => {
        setSiteShow(false);
        setSiteListFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }

    // console.log('size:', fileData);
    const handleSiteList = (event) => {
    let value = event.target.value.trim();
    let list = value.split(/\s+/).join(","); // handles multiple spaces
    setSiteData(list);
};

    const todayDate = () => {
        // const d = new Date()

        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        setOfferDate([year, month, day].join('-'))

    }


    const dateFun = (date) => {
        setOfferDate(date)
        // console.log('Date', date)
    }
    useEffect(() => {

        todayDate();
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const handleSubmit = async () => {

        if (siteListLength > 0 || siteData.length > 0) {
            setOpen(true)
            var formData = new FormData();
            formData.append("site_id", siteData);
            formData.append("on_air_date", offerDate);
            // const response = await postData('trend/ap/makeKpiTrend/old/2G', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }, signal: abortSignal })
            const response = await makePostRequest('payload_traffic/get_traffic/', formData)
            setFileData(response.download_url)
            console.log('response data', response)
            setDownload(true)
            if (response === false) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
            if (response.status == true) {
                setOpen(false);
                setDlink(true);
            }
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
            }

            if (siteListLength == 0 && siteData.length == 0) {
                // setSiteShow(true)
                alert('Please Select Site IDs')

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
                        <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                        <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                        <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                    </DialogContent>
                </Dialog>
            )
        }

        const handleCancel = () => {
            // setRawKpiFile({ filename: "", bytes: "" })
            setOfferDate({ filename: "", bytes: "" })
            todayDate()

        }

        return (
            <Zoom in={true} timeout={500}>
                <div>
                    <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
                            <Link underline="hover" href='/tools/payload_traffic'>Payload Traffic</Link>
                            <Typography color='text.primary'>Query Traffic</Typography>
                        </Breadcrumbs>
                    </div>
                    <Slide
                        direction='left'
                        in='true'
                        // style={{ transformOrigin: '0 0 0' }}
                        timeout={1000}
                    >
                        <Box className={classes.main_Box}>
                            <Box className={classes.Back_Box}>
                                <Box className={classes.Box_Hading}>
                                    Traffic Query
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                                    <Box className={classes.Front_Box} id="step-1">
                                        <div className={classes.Front_Box_Hading}>
                                            Enter Site List:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20, boxSizing: 'border-box' }}></span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button}>
                                            <div>
                                                {/* <input onChange={handleSiteListFile}   multiple type="search" sx={{width:'100px'}}/> */}
                                                <TextField onChange={handleSiteList} fullWidth size="small" type="search" variant="outlined" style={{ width: 'auto' }} />
                                            </div>

                                        </div>
                                    </Box>

                                    <Box className={classes.Front_Box} id="step-2">
                                        <div className={classes.Front_Box_Hading}>
                                            ON-AIR DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button}>
                                            <div style={{ float: "left" }}>

                                                <input required value={offerDate}
                                                    onChange={(event) => dateFun(event.target.value)}
                                                    type="date"
                                                    style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
                                                />
                                            </div>
                                            <div></div>
                                        </div>
                                    </Box>


                                </Stack>
                                <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                                    <Box id="step-3">
                                        <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                                    </Box>
                                    <Box >
                                        <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                                    </Box >
                                </Box>
                            </Box>
                            <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
                                <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Traffic Query</span></Button></a>
                            </Box>
                            {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
        <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
      </Box> */}
                        </Box>
                    </Slide>
                </div>
            </Zoom>
        )
    }

    export default QueryTraffic