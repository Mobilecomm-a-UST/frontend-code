import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Zoom from "@mui/material/Zoom";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../csss/OverAllCss";
import ClearIcon from '@mui/icons-material/Clear';
import { usePost } from "../../../../Hooks/PostApis";

const ZTE = () => {
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
    const [g2rawKpiFile, setG2RawKpiFile] = useState({ filename: "", bytes: "" })
    const [g4rawKpiFile, setG4RawKpiFile] = useState({ filename: "", bytes: "" })
    const [g2siteListFile, setG2SiteListFile] = useState({ filename: "", bytes: "" })
    const [g4siteListFile, setG4SiteListFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [offerDate, setOfferDate] = useState()
    const [raw2GShow, setRaw2GShow] = useState(false)
    const [raw4GShow, setRaw4GShow] = useState(false)
    const [site2GShow, setSite2GShow] = useState(false)
    const [site4GShow, setSite4GShow] = useState(false)
    const [missingSite2G, setMissingSite2G] = useState([])
    const [missingSite4G, setMissingSite4G] = useState([])
    const [missingBox, setMissingBox] = useState('')
    const [missingSiteOpen, setMissingSiteOpen] = useState(false)
    const [fileData, setFileData] = useState()
    const [dlink, setDlink] = useState(false)
    const classes = OverAllCss();
    // const [open, setOpen] = React.useState(false);
    const g2rawKpiLength = g2rawKpiFile.filename.length
    const g2siteListLength = g2siteListFile.filename.length
    const g4rawKpiLength = g4rawKpiFile.filename.length
    const g4siteListLength = g4siteListFile.filename.length
    let abortController

    var link = `${ServerURL}${fileData}`;

    const handle2GRawKpiFile = (event) => {
        setRaw2GShow(false);
        setG2RawKpiFile({
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
    useEffect(() => {
        todayDate();
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    }, [])

    const handleSubmit = async () => {

        if (g2rawKpiLength > 0 && g2siteListLength > 0 && g4rawKpiLength > 0 && g4siteListLength > 0) {
            abortController = new AbortController()
            const abortSignal = abortController.signal
            setOpen(true)
            var formData = new FormData();
            formData.append("2G_raw_kpi", g2rawKpiFile.bytes);
            formData.append("site_list_2G", g2siteListFile.bytes);
            formData.append("raw_kpi_4G", g4rawKpiFile.bytes);
            formData.append("site_list_4G", g4siteListFile.bytes);
            formData.append("offered_date", offerDate);
            // const response = await postData('trend/pb/makeKpiTrend/zte/old', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
            const response = await makePostRequest('trend/pb/makeKpiTrend/zte/old', formData )
            setFileData(response.Download_url)
            console.log('response data', response)
            setMissingSite2G(response.missing_sites_2G)
            setMissingSite4G(response.missing_sites_4G)

            if(response == false){
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
               }

                if (response.status === true) {
                    setOpen(false);
                    setDlink(true);
                    if(response.missing_sites_2G.length > 0 || response.missing_sites_4G.length > 0){
                        setMissingBox('These are Missing Sites')
                        setMissingSiteOpen(true)
                    }

                    Swal.fire({
                        icon: "success",
                        title: "Done",
                        text: `${response.message}`,
                    });
                }
                else if(response.status === 'undefind'){
                    setOpen(false)
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${response.message}`,
                    });
                }
                else {
                    setOpen(false)

                    if(response.missing_sites_2G.length > 0 || response.missing_sites_4G.length > 0){
                        setMissingBox('These are missing Columns')
                        setMissingSiteOpen(true)
                    }

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
                    <Button  variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }


      // DIALOG FOR MISSING SITS .........................
      const handleMissingSite = () => {
        return (
            <Dialog
                open={missingSiteOpen}
                sx={{ zIndex: 5 }}
            >
                <DialogContent sx={{ minHeight: 200, maxHeight: 'auto', width: 600 }}>
                    <div style={{ float: 'right', cursor: 'pointer' }} ><ClearIcon onClick={() => { setMissingSiteOpen(false) }} /></div>
                    <div style={{ textAlign: 'center', color: 'red' }}><h2>{missingBox}</h2></div>
                    <div style={{ textAlign: 'left', color: 'red' }}><h4>2G Missing Sites :-</h4></div>
                    <div><ul style={{ display: "flex", flexWrap: 'wrap', gap: '20px' }}>{missingSite2G?.map((item) => (
                        <li key={item}>{item}</li>
                    ))}</ul></div>
                     <div style={{ textAlign: 'left', color: 'red' }}><h4>4G Missing Sites :-</h4></div>
                    <div><ul style={{ display: "flex", flexWrap: 'wrap', gap: '20px' }}>{missingSite4G?.map((item) => (
                        <li key={item}>{item}</li>
                    ))}</ul></div>
                </DialogContent>
            </Dialog>
        )
    }

    const handleCancel = () => {
        setG2RawKpiFile({ filename: "", bytes: "" })
        setG4RawKpiFile({ filename: "", bytes: "" })
        setG2SiteListFile({ filename: "", bytes: "" })
        setG4SiteListFile({ filename: "", bytes: "" })
        setOfferDate({ filename: "", bytes: "" })
        todayDate()

    }
    return (
        <Zoom in='true' timeout={500}>
        <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/trends'>Trend</Link>
                        <Link underline="hover" href='/trends/pb'>PB</Link>
                        <Typography color='text.primary'>ZTE</Typography>
                    </Breadcrumbs>
                </div>
            <Box className={classes.main_Box}>
                <Box className={classes.Back_Box}>
                    <Box className={classes.Box_Hading}>
                        Make KPI TREND ZTE(OLD)
                    </Box>
                    <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                        {/* ********* 2G RAW KPI SELECT ********** */}
                        <Box className={classes.Front_Box}>
                            <div className={classes.Front_Box_Hading}>
                                Select 2G RAW KPI File :-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{g2rawKpiFile.filename}</span>
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

                        {/* ********* 2G SITE LIST SELECT ********* */}
                        <Box className={classes.Front_Box}>
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
                        <Box className={classes.Front_Box}>
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
                        <Box className={classes.Front_Box}>
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

                        {/* SELECT OFFERED DATE  */}
                        <Box className={classes.Front_Box}>
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
                        <Box >
                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                        </Box >
                        <Box>
                            <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>
                        </Box>

                    </Box>
                </Box>
                <Box style={{ display: dlink ? "inherit" : "none" }}>
                    <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
                </Box>



            </Box>
            {loadingDialog()}
            {/* {handleError()} */}
            {handleMissingSite()}


        </div>
        </Zoom>
    )
}

export default ZTE