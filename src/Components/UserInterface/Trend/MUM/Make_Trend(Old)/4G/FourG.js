import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Zoom from "@mui/material/Zoom";

import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL } from "../../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../../csss/OverAllCss";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';
import { usePost } from "../../../../../Hooks/PostApis";

const FourG = () => {
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
  const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
  const [siteListFile, setSiteListFile] = useState({ filename: "", bytes: "" })
  const [open, setOpen] = useState(false);
  const [offerDate, setOfferDate] = useState()
  const [rawShow, setRawShow] = useState(false)
  const [siteShow, setSiteShow] = useState(false)
  const [fileData, setFileData] = useState()
  const [dlink, setDlink] = useState(false)
  // const [open, setOpen] = React.useState(false);
  const rawKpiLength = rawKpiFile.filename
  const siteListLength = siteListFile.filename.length
  const classes = OverAllCss();
  let abortController

  var link = `${ServerURL}${fileData}`;
  const handleRawKpiFile = (event) => {
    setRawShow(false);
    setRawKpiFile({
      filename: event.target.files.length,
      bytes: event.target.files,
      state: true

    })
    var output = document.getElementById('fileList');
    var files = event.target.files;
    var children = "";
    for (var i = 0; i < files.length; i++) {
      // console.log('Pre multipul file :', files[i].name)

      children += '<li>' + files[i].name + '</li>';
    }
    output.innerHTML = '<ol type="1">' + children + '</ol>';
  }

  const handleSiteListFile = (event) => {
    setSiteShow(false);
    setSiteListFile({
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
      { element: '#step-1', popover: { title: 'Select CSV Files:-', description: 'Select PRE KPI Filegenerated from MyCom Tool', side: "bottom", align: 'start' } },
      { element: '#step-2', popover: { title: 'Select Site List File:-', description: 'Select Site List File ', side: "left", align: 'start' } },
      // { element: '#step-3', popover: { title: 'Select PRE-POST Site File:-', description:      'select site id in this field', side: "left", align: 'start' } },
      { element: '#step-3' ,popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
      { element: '#step-4', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
      { element: '#step-5', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
      { element: '#step-6', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
    ]
  });


  driverObj.drive();
};
  useEffect(() => {
    todayDate();
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  }, [])

  const handleSubmit = async () => {

    if (rawKpiLength > 0) {

      setOpen(true)
      var formData = new FormData();
      // formData.append("raw_kpi", rawKpiFile.bytes);
      for (let i = 1; i <= rawKpiFile.filename; i++) {

        formData.append(`f${i}`, rawKpiFile.bytes[i - 1]);
      }
      formData.append("site_list", siteListFile.bytes);
      formData.append("offered_date", offerDate);
      // const response = await postData('trend/mum/makeKpiTrend/old/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }})
      const response = await makePostRequest('trend/mum/makeKpiTrend/old/', formData)
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
      if (rawKpiLength == 0) {
        setRawShow(true)
      }
      // if(siteListLength == 0)
      // {
      //     setSiteShow(true)
      // }

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
          <Button   variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
        </DialogContent>

      </Dialog>
    )
  }

  const handleCancel = () => {
    setRawKpiFile({ filename: "", bytes: "" })
    var Preoutput = document.getElementById('fileList');
    Preoutput.innerHTML = '';
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
            <Link underline="hover" href='/trends/mum'>MUM</Link>
            <Typography color='text.primary'>Make Trend(old) 4G</Typography>
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
              Make KPI TREND(OLD) 4G
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }}>
              <Box className={classes.Front_Box}id='step-1'>
                <div className={classes.Front_Box_Hading}>
                  Select CSV Files:-<span style={{ fontFamily: 'Poppins', fontSize: 15, color: "gray", marginLeft: 20 }} id="fileList"></span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                      select file
                      <input required onChange={handleRawKpiFile} hidden accept=".csv" multiple type="file" />
                    </Button>
                  </div>
                  <div>  <span style={{ display: rawShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div>
                  </div>
                </div>
              </Box>
              <Box className={classes.Front_Box}id='step-2'>
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

              <Box className={classes.Front_Box}id='step-3'>
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
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}id='step-4'>submit</Button>
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


      </div>
    </Zoom>
  )
}

export default FourG