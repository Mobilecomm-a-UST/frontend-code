import React, { useState ,useEffect} from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch } from "react-redux";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData } from "../../../../services/FetchNodeServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import GearIcon from '@rsuite/icons/Gear';
import OverAllCss from "../../../../csss/OverAllCss";
import Zoom from "@mui/material/Zoom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="rigth" ref={ref} {...props} />;
});

export default function PrePostReport() {
  const [preTrend, setPreTrend] = useState({ filename: "", bytes: "" })
  const [postTrend, setPostTrend] = useState({ filename: "", bytes: "" })
  const [mapping, setMapping] = useState({ filename: "", bytes: "" })
  const [upload, setUpload] = useState(null)
  const [open, setOpen] = React.useState(false);
  const classes = OverAllCss();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let abortController


  // var link = `${ServerURL}${getFile}`
  // const Fetchdprkey=async()=>
  // {
  //     const response = await getData('trend/get_dpr_temp/')
  //     setGetFile(response.path)
  //     console.log('get data:',response.path)
  // }
  // useEffect(function () {
  //   // Fetchdprkey();
  //   }, []);
  // console.log(fetchcontroller)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlepostTrend = (event) => {
    setPostTrend({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };
  const handlePreTrend = (event) => {

    setPreTrend({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
    console.log(event.target.files[0])
  };
  const handlemapping = (event) => {
    setMapping({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };


  const handleSubmit = async () => {
    abortController = new AbortController()
    const abortSignal = abortController.signal
    setOpen(true)
    var formData = new FormData();

    formData.append("pre_trend", preTrend.bytes);
    formData.append("post_trend", postTrend.bytes);
    formData.append("mapping", mapping.bytes);


    const response = await postData('Original_trend/tnch/pre_post_upload_7/', formData)
    dispatch({ type: 'PRE_POST_REPORT', payload: { response } })
    sessionStorage.setItem('prepost', JSON.stringify(response));
    console.log('response data', response)

    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: "File Submit Successfully",
      });
      setOpen(false);
      navigate('/trends/tn_ch/Pre_Post_report_status')
    } else {
      setOpen(false)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
    }
    // axios
    // .post(`${ServerURL}/Original_trend/pre_post_upload_7/`,formData,{
    //  onUploadProgress:(data)=>{
    //   console.warn(Math.round((data.loaded / data.total) * 100))
    //   setUpload(Math.round((data.loaded / data.total) * 100))

    // }
    // })
    // .then((success)=>{
    // alert("record submited")
    // })
    // .catch((error)=>
    // {
    // console.log(error);
    // alert('Error happened')
    // })
  };

  const cancellAPI=()=>{
    setOpen(false)
    abortController.abort()
  }


  const handleCancel = () => {
    setPreTrend({ filename: "", bytes: "" })
    setPostTrend({ filename: "", bytes: "" })
    setMapping({ filename: "", bytes: "" })

  }


  // highlite driver js
  const startTour = () => {
    const driverObj = driver({

      showProgress: true,
      steps: [
        { element: '#step-1', popover: { title: 'Select Pre Row KPR File:-', description: 'Select Pre Raw KPI file generated from MyCom Tool', side: "bottom", align: 'start' } },
        { element: '#step-2', popover: { title: 'Select Post Row KPR File:-', description: 'Select Post Row KPR File generated from MyCom Tool ', side: "left", align: 'start' } },
        { element: '#step-3', popover: { title: 'Select Mapping File:-', description:      'select site id in this field', side: "left", align: 'start' } },
        // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
        { element: '#step-4', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
        { element: '#step-5', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
        { element: '#step-6', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
      ]
    });


    driverObj.drive();
  };
useEffect(()=>{
  document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
},[])
  // DATA PROCESSING DIALOG BOX...............
  const loadingDialog = () => {
    return (
      <Dialog
        open={open}
        TransitionComponent={Transition}


        aria-describedby="alert-dialog-slide-description"
      >

        <DialogContent>
          <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
          <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
          <Box style={{margin:'10px 0px 10px 0px', fontWeight:'bolder'}}>DATA UNDER PROCESSING...</Box>
          <Button   variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancellAPI} endIcon={<DoDisturbIcon />}>cancel</Button>
        </DialogContent>

      </Dialog>
    )
  }


  return (
    <Zoom in='true' timeout={500}>
      <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/trends'>Trend</Link>
            <Link underline="hover" href='/trends/tn_ch'>TNCH</Link>
            <Typography color='text.primary'>Pre Post Report</Typography>
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
              UPDATE PRE-POST REPORT
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }}>
              <Box className={classes.Front_Box}id='step-1'>
                <div className={classes.Front_Box_Hading}>
                  Select Pre Row KPR File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{preTrend.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={preTrend.state ? "warning" : "primary"}>
                      select file
                      <input required onChange={handlePreTrend} hidden accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div>  </div>
                </div>
              </Box>
              <Box className={classes.Front_Box}id='step-2'>
                <div className={classes.Front_Box_Hading}>
                  Select Post Row KPR File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{postTrend.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={postTrend.state ? "warning" : "primary"}>
                      select file
                      <input required hidden onChange={handlepostTrend} accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div></div>
                </div>
              </Box>

              <Box className={classes.Front_Box}id='step-3'>
                <div className={classes.Front_Box_Hading}>
                  Select Mapping File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{mapping.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={mapping.state ? "warning" : "primary"}>
                      select file
                      <input required hidden onChange={handlemapping} accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div></div>
                </div>
              </Box>


            </Stack>
            <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
              <Box id ='step-4'>
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
              </Box>
              <Box>
                <Button variant="contained" onClick={() => { handleCancel() }} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
              </Box>
            </Box>
          </Box>
          {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}


        </Box>
        {loadingDialog()}
      </div>
    </Zoom>
  );
}
