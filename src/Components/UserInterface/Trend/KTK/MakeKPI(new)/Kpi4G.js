import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Zoom from "@mui/material/Zoom";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL } from "../../../../services/FetchNodeServices"
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../csss/OverAllCss";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';
import {usePost} from "../../../../Hooks/PostApis"


const Kpi4G = () => {
    const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
    const [g2rawKpiFile, setG2RawKpiFile] = useState({ filename: "", bytes: "" })
    const [g2rawKpiHuiFile, setG2RawKpiHuiFile] = useState({ filename: "", bytes: "" })
    const [g4rawKpiFile, setG4RawKpiFile] = useState({ filename: "", bytes: "" })
    const [g2siteListFile, setG2SiteListFile] = useState({ filename: "", bytes: "" })
    const [g4siteListFile, setG4SiteListFile] = useState({ filename: "", bytes: "" })
    const [mappingFile, setMappingFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [offerDate, setOfferDate] = useState()
    const [raw2GShow, setRaw2GShow] = useState(false)
    const [raw2GShowHui, setRaw2GShowHui] = useState(false)
    const [raw4GShow, setRaw4GShow] = useState(false)
    const [site2GShow, setSite2GShow] = useState(false)
    const [site4GShow, setSite4GShow] = useState(false)
    const [mappingShow, setMappingShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [dlink, setDlink] = useState(false)
    const classes = OverAllCss()
    // const [open, setOpen] = React.useState(false);
    const g2rawKpiLength = g2rawKpiFile.filename.length
    const g2rawKpiHuiLength = g2rawKpiHuiFile.filename.length
    const g2siteListLength = g2siteListFile.filename.length
    const g4rawKpiLength = g4rawKpiFile.filename.length
    const g4siteListLength = g4siteListFile.filename.length
    const mappingFileLength = mappingFile.filename.length




    var link = `${ServerURL}${fileData}`;

    const handle2GRawKpiFile = (event) => {
        setRaw2GShow(false);
        setG2RawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }
    const handle2GRawKpiHuiFile = (event) => {
        setRaw2GShowHui(false);
        setG2RawKpiHuiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }
    const handle4GRawKpiFile = (event) => {
        setRaw4GShow(false);
        setG4RawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }

    const handle2GSiteListFile = (event) => {
        setSite2GShow(false);
        setG2SiteListFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }
    const handle4GSiteListFile = (event) => {
        setSite4GShow(false);
        setG4SiteListFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }
    const handleMappingFile = (event) => {
        setMappingShow(false);
        setMappingFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }

    console.log('size:', fileData);

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
     // highlite driver js
  const startTour = () => {
    const driverObj = driver({

      showProgress: true,
      steps: [
        { element: '#step-1', popover: { title: 'Select 2G RAW KPI File', description: 'Select 2G RAW KPI File generated from MyCom Tool', side: "bottom", align: 'start' } },
        { element: '#step-2', popover: { title: 'Select 2G Site List', description: 'Select 2G Site List in excel formate having column name 2G ID', side: "left", align: 'start' } },
        { element: '#step-3', popover: { title: 'Select 4G RAW KPI File', description: 'Select 4G RAW KPI File generated from MyCom Tool', side: "left", align: 'start' } },
        { element: '#step-4', popover: { title: 'Select 4G Site List', description: 'Select 4G Site List in excel formate having column name 2G ID', side: "left", align: 'start' } },
        { element: '#step-5', popover: { title: 'Select Mapping File', description: 'Select 4G Site List in excel formate having column name 2G ID', side: "left", align: 'start' } },
        { element: '#step-6', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
        { element: '#step-7', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
        { element: '#step-8', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
        { element: '#step-9', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
      ]
    });


    driverObj.drive();
  };



    useEffect(() => {
        todayDate();
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    }, [])

    const handleSubmit = async () => {

        if (g2rawKpiHuiLength > 0 && g2rawKpiLength > 0 && g2siteListLength > 0 && g4rawKpiLength > 0 && g4siteListLength > 0 && mappingFileLength > 0) {

            setOpen(true)
            var formData = new FormData();
            formData.append("2G_raw_kpi_eri", g2rawKpiFile.bytes);
            formData.append("2G_raw_kpi_hui", g2rawKpiHuiFile.bytes);
            formData.append("2G_site_list", g2siteListFile.bytes);
            formData.append("4G_raw_kpi", g4rawKpiFile.bytes);
            formData.append("4G_site_list", g4siteListFile.bytes);
            formData.append("mapping_file", mappingFile.bytes);
            formData.append("offered_date", offerDate);
            const response = await makePostRequest('trend/ktk/makeKpiTrend/new/', formData)
            setFileData(response.Download_url)
            console.log('response data', response)

            if (response.status == true) {
                setOpen(false);
                setDlink(true);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });


            } else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            if (g2rawKpiLength == 0) {
                setRaw2GShow(true)
            }
            if (g2siteListLength == 0) {
                setSite2GShow(true)
            }
            if (g4rawKpiLength == 0) {
                setRaw4GShow(true)
            }
            if (g4siteListLength == 0) {
                setSite4GShow(true)
            }
            if (mappingFileLength == 0) {
                setMappingShow(true)
            }
            if(g2rawKpiHuiLength==0){
                setRaw2GShowHui(true)
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
                <DialogContent>
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box style={{margin:'10px 0px 10px 0px', fontWeight:'bolder'}}>DATA UNDER PROCESSING...</Box>
                <Button variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }

    const handleCancel = () => {
        setG2RawKpiFile({ filename: "", bytes: "" })
        setG2RawKpiHuiFile({ filename: "", bytes: "" })
        setG4RawKpiFile({ filename: "", bytes: "" })
        setG2SiteListFile({ filename: "", bytes: "" })
        setG4SiteListFile({ filename: "", bytes: "" })
        setMappingFile({ filename: "", bytes: "" })
        // setOfferDate({ filename: "", bytes: "" })
        todayDate()

    }
    return (
        <Zoom in='true' timeout={500}>
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/trends'>Trend</Link>
                        <Link underline="hover" href='/trends/ktk'>KTK</Link>
                        <Typography color='text.primary'>Make Trend(NEW)</Typography>
                    </Breadcrumbs>
                </div>
                <Box style={{position:'fixed',right:20}}>
                <Tooltip title="Help">
                <Fab color="primary" aria-label="add" onClick={startTour}>
                    <LiveHelpIcon />
                </Fab>
                </Tooltip>
                </Box>
                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box}>
                        <Box className={classes.Box_Hading}>
                            Make KPI TREND(NEW)
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            {/* ********* 2G RAW KPI Ericsson SELECT ********** */}
                            <Box className={classes.Front_Box}id='step-1'>
                                <div className={classes.Front_Box_Hading}>
                                    Select 2G RAW KPI Ericsson File :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g2rawKpiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={g2rawKpiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handle2GRawKpiFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: raw2GShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>
                               {/* ********* 2G RAW KPI Huawei SELECT ********** */}
                            <Box className={classes.Front_Box}id='step-1'>
                                <div className={classes.Front_Box_Hading}>
                                    Select 2G RAW KPI Huawei File :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g2rawKpiHuiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={g2rawKpiHuiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handle2GRawKpiHuiFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: raw2GShowHui ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>

                            {/* ********* 2G SITE LIST SELECT ********* */}
                            <Box className={classes.Front_Box}id='step-2'>
                                <div className={classes.Front_Box_Hading}>
                                    Select 2G Site List :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g2siteListFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={g2siteListFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handle2GSiteListFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: site2GShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>

                            {/* ********* 4G RAW KPI SELECT ********** */}
                            <Box className={classes.Front_Box}id='step-3' >
                                <div className={classes.Front_Box_Hading}>
                                    Select 4G RAW KPI File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g4rawKpiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={g4rawKpiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handle4GRawKpiFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: raw4GShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>

                            {/* ********* 4G SITE LIST SELECT ********* */}
                            <Box className={classes.Front_Box}id='step-4'>
                                <div className={classes.Front_Box_Hading}>
                                    Select 4G Site List :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g4siteListFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={g4siteListFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handle4GSiteListFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: site4GShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div></div>
                                </div>
                            </Box>

                            {/* ********* MAPIING FILE SELECT ********* */}
                            <Box className={classes.Front_Box}id='step-5'>
                                <div className={classes.Front_Box_Hading}>
                                    Select Mapping File :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{mappingFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={mappingFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handleMappingFile} hidden accept="/*" multiple type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: mappingShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div></div>
                                </div>
                            </Box>

                            {/* SELECT OFFERED DATE  */}
                            <Box className={classes.Front_Box}id='step-6'>
                                <div className={classes.Front_Box_Hading}>
                                    OFFERED DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
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
                            <Box>
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}id='step-7'>submit</Button>
                            </Box>
                            <Box >
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                            </Box >
                        </Box>
                    </Box>
                    <Box style={{ display: dlink ? "inherit" : "none" }}>
                        <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend(new)</span></Button></a>
                    </Box>



                </Box>
                {loadingDialog()}
                {/* {handleError()} */}


            </div>
        </Zoom>
    )
}

export default Kpi4G