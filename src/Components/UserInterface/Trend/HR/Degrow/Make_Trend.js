import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL } from "../../../../services/FetchNodeServices";
import OverAllCss from "../../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from '@mui/material/Zoom';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';
import { usePost } from "../../../../Hooks/PostApis";

const Make_Trend = () => {
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
  const [pre, setPre] = useState({ filename: "", bytes: "" })
  const [post, setPost] = useState({ filename: "", bytes: "" })
  const [additional, setAdditional] = useState({ filename: "", bytes: "" })
  const [pdate, setPdate] = useState()
  const [fileData, setFileData] = useState()
  const [showPre, setShowPre] = useState(false)
  const [showPost, setShowPost] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showDown, setShowDown] = useState(false)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const AddfileLength = additional.filename.length
  const classes = OverAllCss();



  var link = `${ServerURL}${fileData}`;




  const handlepre = (event) => {
    setShowPre(false);
    setPre({
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


  const handlePost = (event) => {
    setShowPost(false);
    setPost({
      filename: event.target.files.length,
      bytes: event.target.files,
      state: true
    })
    var output = document.getElementById('secondList');
    var files = event.target.files;
    var children = "";
    for (var i = 0; i < files.length; i++) {
      // console.log('Pre multipul file :', files[i].name)
      if (files[i].name === pre.bytes[i].name) {
        alert('Here Pre and Post Files are similar')
        setPost({
          filename: '',
          bytes: '',
          state: false
        })

      } else {
        children += '<li>' + files[i].name + '</li>';
      }

    }
    output.innerHTML = '<ol type="1">' + children + '</ol>';
  }
  const handleAdd = (event) => {
    setShowAdd(false)
    setAdditional({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    })

  }

  const handleSubmit = async () => {
    if (pre.filename > 0 && post.filename > 0 && AddfileLength > 0) {

      setOpen(true)
      var formData = new FormData();
      let j = 1;
      let j1 = 0;
      let k = 1;
      let k1 = 0;
      for (let i = 0; i < pre.filename; i++) {
        // if (i > 5) {
        //   formData.append(`pre_d${j}_bbh`, pre.bytes[i - 1]);
        //   console.log('pre keys 2:', `pre_d${j}_bbh`)
        //   j = j + 1;
        // }
        // else {
        //   formData.append(`pre_d${i}_24`, pre.bytes[j1]);
        //   console.log('pre keys 1:', `pre_d${i}_24`);
        //   j1++;
        // }
        formData.append(`pre_${i}`, pre.bytes[i]);
      }
      for (let i = 0; i < post.filename; i++) {
        // if (i > 5) {
        //   formData.append(`post_d${k}_bbh`, post.bytes[i - 1]);
        //   console.log('post keys bbh:', `pre_d${k}_bbh`)
        //   k = k + 1;
        // }
        // else {
        //   formData.append(`post_d${i}_24`, post.bytes[k1]);
        //   console.log('post keys dd:', `post_d${i}_24`);
        //   k1++;
        // }
        formData.append(`post_${i}`, post.bytes[i]);
      }
      formData.append('additional_inputs', additional.bytes)
      // const response = await postData('Degrow/makeTrend/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` },signal:abortSignal })
      const response = await makePostRequest('Degrow/makeTrend/', formData)
      console.log('response data', response)
      setFileData(response.Download_url)


      if (response.status === true) {
        setOpen(false)
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `${response.message}`,
        });
        setShowDown(true)
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
      if (pre.filename === '') {
        setShowPre(true);

      }
      if (post.filename === '') {
        setShowPost(true);
      }
      if (AddfileLength === 0) {
        setShowAdd(true)
      }

    }
  };

  const handleCancel = () => {
    setPre({ filename: "", bytes: "" });
    setPost({ filename: "", bytes: "" });
    setAdditional({ filename: "", bytes: "" });
    var Preoutput = document.getElementById('fileList');
    var Postoutput = document.getElementById('secondList');
    Preoutput.innerHTML = '';
    Postoutput.innerHTML = '';

  }


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
          {/* <Box >DATA UNDER PROCESSING...</Box> */}

          <Box style={{margin:'10px 0px 10px 0px', fontWeight:'bolder'}}>DATA UNDER PROCESSING...</Box>
          <Button   variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>

        </DialogContent>

      </Dialog>
    )
  }

  const pastDate = () => {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()
    // console.log('date----:',day)

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    setPdate([year, month, day].join('-'))
  }

  //highlite driver js
  const startTour = () => {
      const driverObj = driver({

        showProgress: true,
        steps: [
          { element: '#step-1', popover: { title: 'Select Pre Files', description: 'Select Pre Files generated from MyCom Tool', side: "bottom", align: 'start' } },
          { element: '#step-2', popover: { title: 'Select Post Files', description: 'Select Post Files generated from MyCom Tool', side: "left", align: 'start' } },
          { element: '#step-3', popover: { title: 'Additional Input File', description: 'select paste site id in this field', side: "left", align: 'start' } },
          // { element: '#step-3', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
          { element: '#step-4', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
          { element: '#step-5', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
          { element: '#step-6', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
        ]
      });


      driverObj.drive();
    };

  useEffect(() => {
    pastDate();
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

  }, [])

  return (
    <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
      <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/trends'>Trend</Link>
            <Link underline="hover" href='/trends/hr'>HR</Link>
            <Typography color='text.primary'>Make Degrow</Typography>
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
          <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
            <Box className={classes.Box_Hading} >
              MAKE DE-GROW TREND
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
              <Box className={classes.Front_Box}id='step-1' >
                <div className={classes.Front_Box_Hading}>
                  Select Pre Files:-<span style={{ fontFamily: 'Poppins', fontSize: 15, color: "gray", marginLeft: 20 }} id="fileList"></span>
                </div>
                <div className={classes.Front_Box_Select_Button} >
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={pre.state ? "warning" : "primary"}>
                      select file
                      <input type="file" required onChange={handlepre} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden multiple />
                    </Button>
                  </div>
                  <div>  <span style={{ display: showPre ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div></div>
                </div>
              </Box>
              <Box className={classes.Front_Box} id='step-2'>
                <div className={classes.Front_Box_Hading}>
                  Select Post Files:-<span style={{ fontFamily: 'Poppins', fontSize: 15, color: "gray", marginLeft: 20 }} id="secondList"></span>
                </div>
                <div className={classes.Front_Box_Select_Button} >
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={post.state ? "warning" : "primary"}>
                      select file
                      <input type="file" required onChange={handlePost} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden multiple />
                    </Button>
                  </div>
                  <div>  <span style={{ display: showPost ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div></div>
                </div>
              </Box>
              <Box className={classes.Front_Box} id='step-3'>
                <div className={classes.Front_Box_Hading}>
                  Additional Input File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{additional.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button} >
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={additional.state ? "warning" : "primary"}>
                      select file
                      <input type="file" required onChange={handleAdd} hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                    </Button>
                  </div>
                  <div>  <span style={{ display: showAdd ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                </div>
              </Box>



            </Stack>
            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

              <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

              <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}id='step-4'>submit</Button>


            </Stack>
          </Box>
          <a download href={link} style={{ display: showDown ? 'inherit' : 'none' }}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Degrow Trend</span></Button></a>


        </Box>
        {loadingDialog()}



      </div>
    </Zoom>
  )
}

export default Make_Trend