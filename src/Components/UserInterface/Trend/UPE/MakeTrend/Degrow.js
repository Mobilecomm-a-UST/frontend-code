import React,{useState,useEffect} from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData,ServerURL,getData } from "../../../../services/FetchNodeServices";
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
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()

    const [preKpiFile,setPreKpiFile] = useState({ filename: "", bytes: "" })
    const [postKpiFile,setPostKpiFile] = useState({ filename: "", bytes: "" })
    const [pre_post_File,setPre_post_File] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [offerDate,setOfferDate] = useState()
    const [preShow,setPreShow] = useState(false)
    const [postShow,setPostShow] = useState(false)
    const [prePostShow,setPrePostShow] = useState(false)
    const [fileData,setFileData] = useState()
    const [dlink,setDlink] = useState(false)
    // const [open, setOpen] = React.useState(false);
    const preKpiLength = preKpiFile.filename.length
    const postListLength = postKpiFile.filename.length
    const pre_post_Length = pre_post_File.filename.length
    const classes =  OverAllCss();


    var link = `${ServerURL}${fileData}`;
    const handlepreKpiFile=(event)=>
    {
        setPreShow(false);
        setPreKpiFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true

        })
    }

    const handlepostKpiFile=(event)=>
    {
        setPostShow(false);
        setPostKpiFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true

        })
    }

    const handlePrePostKpiFile=(event)=>
    {
        setPrePostShow(false);
        setPre_post_File({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true

        })
    }


    console.log('size:',fileData);

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

  setOfferDate( [year, month, day].join('-'))

  }

  const dateFun=(date)=>
  {
      setOfferDate(date)
      // console.log('Date', date)
  }




   // highlite driver js
   const startTour = () => {
    const driverObj = driver({

      showProgress: true,
      steps: [
        { element: '#step-1', popover: { title: 'Select PRE KPI File:-', description: 'Select PRE KPI Filegenerated from MyCom Tool', side: "bottom", align: 'start' } },
        { element: '#step-2', popover: { title: 'Select POST KPI File:-', description: 'Select POST KPI File generated from MyCom Tool ', side: "left", align: 'start' } },
        { element: '#step-3', popover: { title: 'Select PRE-POST Site File:-', description:      'select site id in this field', side: "left", align: 'start' } },
        // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
        { element: '#step-4', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
        { element: '#step-5', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
        { element: '#step-6', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
      ]
    });


    driverObj.drive();
  };
  useEffect(()=>{
      todayDate();
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  const handleSubmit=async()=>
  {

    if(preKpiLength > 0 && postListLength > 0 && pre_post_Length > 0 )
    {

    setOpen(true)
    var formData = new FormData();
    formData.append("PRE", preKpiFile.bytes);
    formData.append("POST", postKpiFile.bytes);
    formData.append("site", pre_post_File.bytes);

    // const response = await postData('trend/upe/makeKpiTrend/degrow',formData, {headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` },signal:abortSignal})
    const response = await makePostRequest('trend/upe/makeKpiTrend/degrow',formData)

     console.log('response data',response)

    if (response.Status == true) {
    setFileData(response.download_url)
    setOpen(false);
    setDlink(true);
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `${response.Message}`,
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
else{
    if(preKpiLength == 0 )
    {
        setPreShow(true)
    }
    if(postListLength == 0)
    {
        setPostShow(true)
    }
    if(pre_post_Length == 0)
    {
        setPrePostShow(true)
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
          <Button   variant="contained" fullWidth  style={{backgroundColor:"red",color:'white'}} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
        </DialogContent>

      </Dialog>
    )
  }

  const handleCancel=()=>
  {
    setPreKpiFile({filename:"",bytes:""})
    setPostKpiFile({filename:"",bytes:""})
    setPre_post_File({filename:"",bytes:""})

  }

  return (
    <Zoom in='true' timeout={500}>
    <div>
    <div style={{ margin: 10, marginLeft: 10 }}>
      <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
        <Link underline="hover" href='/tools'>Tools</Link>
        <Link underline="hover" href='/trends'>Trend</Link>
        <Link underline="hover" href='/trends/upe'>UPE</Link>
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
            <Box className={classes.Back_Box} sx={{width:{md:'75%',xs:'100%'}}}>
                <Box className={classes.Box_Hading}>
                    Make DEGROW TREND
                </Box>
                <Stack spacing={2} sx={{ marginTop: "-40px" }}>
                    <Box className={classes.Front_Box}id='step-1'>
                        <div className={classes.Front_Box_Hading}>
                            Select PRE KPI File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{preKpiFile.filename}</span>
                        </div>
                        <div className={classes.Front_Box_Select_Button}>
                            <div style={{ float: "left" }}>
                                <Button variant="contained" component="label" color={preKpiFile.state ? "warning" : "primary"}>
                                    select file
                                    <input required onChange={handlepreKpiFile} hidden accept="/*" multiple type="file" />
                                </Button>
                            </div>
                            <div>  <span style={{ display: preShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                            <div>
                            </div>
                        </div>
                    </Box>
                    <Box className={classes.Front_Box}id='step-2'>
                        <div className={classes.Front_Box_Hading}>
                            Select POST KPI File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{postKpiFile.filename}</span>
                        </div>
                        <div className={classes.Front_Box_Select_Button}>
                            <div style={{ float: "left" }}>
                                <Button variant="contained" component="label" color={postKpiFile.state ? "warning" : "primary"}>
                                    select file
                                    <input required onChange={handlepostKpiFile} hidden accept="/*" multiple type="file" />
                                </Button>
                            </div>
                            <div>  <span style={{ display: postShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                            <div></div>
                        </div>
                    </Box>

                    <Box className={classes.Front_Box}id='step-3'>
                        <div className={classes.Front_Box_Hading}>
                        Select PRE-POST Site File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{pre_post_File.filename}</span>
                        </div>
                        <div className={classes.Front_Box_Select_Button}>
                            <div style={{ float: "left" }}>
                                <Button variant="contained" component="label" color={pre_post_File.state ? "warning" : "primary"}>
                                    select file
                                    <input required onChange={handlePrePostKpiFile} hidden accept="/*" multiple type="file" />
                                </Button>
                            </div>
                            <div>  <span style={{ display: prePostShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                            <div></div>
                        </div>
                    </Box>


                </Stack>
                <Box sx={{ display: 'flex', justifyContent: "space-around",flexDirection:{xs:'column',md:'row'},gap:2, marginTop: "20px" }}>
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}id='step-4'>submit</Button>
                        <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

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

export default Degrow