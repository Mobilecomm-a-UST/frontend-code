import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import { usePost } from "../../../../../Hooks/PostApis";


const TwoG = () => {
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
  const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
  const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
  const [open, setOpen] = useState(false);
  const [siteData, setSiteData] = useState([])
  const [missingSite, setMissingSite] = useState([])
  const [missingBox, setMissingBox] = useState('')
  const [missingSiteOpen, setMissingSiteOpen] = useState(false)
  const [offerDate, setOfferDate] = useState()
  const [rawShow, setRawShow] = useState(false)
  const [siteShow, setSiteShow] = useState(false)
  const [fileData, setFileData] = useState()
  const [dlink, setDlink] = useState(false)
  // const [open, setOpen] = React.useState(false);
  const rawKpiLength = rawKpiFile.filename.length
  const siteListLength = siteListFile.filename.length
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
    let dd = event.target.value
    console.log('dddddddddddd', dd.replaceAll(' ', ','))
    let list = dd.replaceAll(' ', ',')
    setSiteData(list)


  }

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


  // highlite driver js
  const startTour = () => {
    const driverObj = driver({

      showProgress: true,
      steps: [
        { element: '#step-1', popover: { title: 'Select RAW KPI File', description: 'Select Raw KPI file generated from MyCom Tool', side: "bottom", align: 'start' } },
        { element: '#step-2', popover: { title: 'Select Site List File', description: 'Either select site list in excel formate having column name 2G ID', side: "left", align: 'start' } },
        { element: '#step-3', popover: { title: 'Enter Site List', description: 'OR paste site id in this field', side: "left", align: 'start' } },
        { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
        { element: '#step-5', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
        { element: '#step-6', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
        { element: '#step-7', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
      ]
    });


    driverObj.drive();
  };

  const dateFun = (date) => {
    setOfferDate(date)
    // console.log('Date', date)
  }
  useEffect(() => {

    todayDate();
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

  }, [])

  const handleSubmit = async () => {

    if (rawKpiLength > 0 && siteListLength > 0 || siteData.length > 0) {
      setOpen(true)
      var formData = new FormData();
      formData.append("raw_kpi_2G", rawKpiFile.bytes);
      formData.append("site_list_2G", siteListFile.bytes);
      formData.append("str_site_list", siteData);
      formData.append("offered_date", offerDate);
      // const response = await postData('trend/ap/makeKpiTrend/old/2G', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }, signal: abortSignal })
      const response = await makePostRequest('trend/ap/makeKpiTrend/old/2G', formData )
      setFileData(response.Download_url)
      console.log('response data', response)
      setMissingSite(response.missing_sites)
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
        if (response.missing_sites.length > 0) {
          setMissingBox('These are missing sites')
          setMissingSiteOpen(true)
        }

        Swal.fire({
          icon: "success",
          title: "Done",
          text: `${response.message}`,
        });
      }
      else if (response.status == 'undefind') {
        setOpen(false)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${response.message}`,
        });
      }
      else {
        setOpen(false)

        if (response?.missing_sites.length > 0) {
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
      if (rawKpiLength == 0) {
        setRawShow(true)
      }
      if (siteListLength == 0 || siteData.length == 0) {
        // setSiteShow(true)
        alert('Please Select Anyone Option (Select Sites List File) Or (Enter Sites List)')
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
          <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
          <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
          <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
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
          <div style={{ textAlign: 'center', color: 'red' }}><h3>{missingBox}</h3></div>
          <div><ul style={{ display: "flex", flexWrap: 'wrap', gap: '20px' }}>{missingSite?.map((item) => (
            <li key={item}>{item}</li>
          ))}</ul></div>
        </DialogContent>
      </Dialog>
    )
  }



  const handleCancel = () => {
    setRawKpiFile({ filename: "", bytes: "" })
    setOfferDate({ filename: "", bytes: "" })
    todayDate()

  }







  return (

    <Zoom in='true' timeout={500}>
      <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" onClick={() => navigate('/tools')}>Tools</Link>
            <Link underline="hover" onClick={() => navigate('/trends')} >Trends</Link>
            <Link underline="hover" href='/trends/ap'>AP</Link>
            <Link underline="hover" href='/trends/ap/make_kpi_trend_old'>Make Trend(old)</Link>
            <Typography color='text.primary'>2G</Typography>
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
              Make KPI TREND(OLD) 2G
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }}>

              <Box className={classes.Front_Box} id="step-1">
                <div className={classes.Front_Box_Hading}>
                  Select RAW KPI File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
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

              <Box className={classes.Front_Box} id="step-2">
                <div className={classes.Front_Box_Hading}>
                  Select Site List File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{siteListFile.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={siteListFile.state ? "warning" : "primary"}>
                      select file
                      <input required onChange={handleSiteListFile} hidden accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div>  <span style={{ display: siteShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div></div>
                </div>
              </Box>
              <Box className={classes.Front_Box} id="step-3">
                <div className={classes.Front_Box_Hading}>
                  Enter Site List:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div>
                    {/* <input onChange={handleSiteListFile}   multiple type="search" sx={{width:'100px'}}/> */}
                    <TextField onChange={handleSiteList} fullWidth size="small" type="search" variant="outlined" style={{ width: 'auto' }} />
                  </div>

                </div>
              </Box>

              <Box className={classes.Front_Box} id="step-4">
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
              <Box id="step-5">
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
              </Box>
              <Box >
                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
              </Box >
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

export default TwoG