import React,{useState,useEffect} from "react";
import { Box, Button ,Stack } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {postData} from "../../../services/FetchNodeServices";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from "@mui/material/Zoom";
import OverAllCss from "../../../csss/OverAllCss"
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const UploadReport = () => {
    const [wprFile,WprFile] = useState({ filename: "", bytes: "" })
    const [week,setWeek] = useState('')
    const [showWeek,setShowWeek] = useState(false);
    const [showWpr,setShowWpr] = useState(false);
    const [open, setOpen] = useState(false);
  const [showSite,setShowSite] = useState(false);
  const navigate = useNavigate()
  const classes = OverAllCss()


    const handlewprFile=(event)=>
    {
      WprFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true
        });
    }
    const wprFileLength = wprFile.filename.length
    const weekLength = week.length
    // console.log('dddddd',week)


// ############# ON SUBMIT BUTTON ###############
  const handleSubmit=async()=>
  {

    if(wprFileLength >0 && week > 0)
    {
    setOpen(true)
    var formData = new FormData();
    formData.append("upload_week", week);
    formData.append("WPR_DPR2_report_file", wprFile.bytes);
    const response = await postData('WPR_DPR2/upload/',formData, {headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }})

    sessionStorage.setItem('WPR_upload_report',JSON.stringify(response.status_obj))
    console.log('response data :',response)

    if (response.status === true) {
      setOpen(false)
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `${response.message}`,
      });
      navigate('status')

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
  if(weekLength === 0){
    setShowWeek(true)
  }
  if(wprFileLength === 0){
      setShowWpr(true)
  }

}
  };
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])



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
            <Box >DATA UNDER PROCESSING...</Box>
          </DialogContent>

        </Dialog>
      )
    }

  // ############# ON CANCEL BUTTON ##############
  const handleCancel=()=>
  {
    WprFile({filename:"",bytes:""})

    setWeek('')

  }
    // ********** ANNUAL WEEK  **************
  const annualWeek = () => {
      var arr = [];
      for (let i = 1; i <= 52; i++) {
        arr.push(i)
      }
      return arr.map((item) => {
        return (
          <option key={item} value={item}>WEEK {item}</option>
        )
      })
    }

  return (
    <div>
      <Zoom in='true' timeout={600}>
        <div>     <div style={{ margin: 10, marginLeft: 1 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
              <Link underline="hover" href='/tools'>Tools</Link>
              <Link underline="hover" href='/tools/wpr'>WPR</Link>
              <Typography color='text.primary'>WPR Report Upload</Typography>
            </Breadcrumbs>
          </div>
    <Box className={classes.main_Box}>
    <Box className={classes.Back_Box} sx={{width:{md:'75%',xs:'100%'}}}>
      <Box className={classes.Box_Hading}>
        UPLOAD WPR REPORT
      </Box>
      <Stack spacing={2} sx={{ marginTop: "-40px" }}>
        <Box className={classes.Front_Box}>
          <div className={classes.Front_Box_Hading}>
            SELECT WEEKS :-
          </div>
          <div className={classes.Front_Box_Select_Button}>
            <div style={{ float: "left" }}>
                <select
                  value={week}
                  onChange={(e)=>{setWeek(e.target.value);setShowWeek(false)}}
                  style={{minWidth:200}}
                  >
                   {annualWeek()}
                 </select>
          </div>
            <div><span style={{display:showWeek?'inherit':'none',color:'red', fontSize: '18px', fontWeight: 600}}>This Field Is required !</span></div>
          </div>
        </Box>

        <Box className={classes.Front_Box}>
          <div className={classes.Front_Box_Hading}>
            Select WPR FILE:-<span style={{fontFamily:'Poppins',color:"gray",marginLeft:20}}>{wprFile.filename}</span>
          </div>
          <div className={classes.Front_Box_Select_Button}>
            <div style={{ float: "left" }}>
              <Button variant="contained" component="label" color={wprFile.state?"warning":"primary"}>
                select file
                <input required hidden onChange={(e)=>{handlewprFile(e);setShowWpr(false)}} accept=".xls,.xlsx" multiple type="file" />
              </Button>
            </div>
            <div><span style={{display:showWpr?'inherit':'none',color:'red', fontSize: '18px', fontWeight: 600}}>This Field Is required !</span></div>
          </div>
        </Box>

      </Stack>
      <Box style={{display:'flex',justifyContent:"space-around",marginTop:"20px"}}>
        <Box>
          <Button variant="contained" color="success" onClick={()=>{handleSubmit();console.log('aaaaaaaaa')}}  endIcon={<UploadIcon/>}>upload</Button>
        </Box>
        <Box>
          <Button  variant="contained"  style={{backgroundColor:"red",color:'white'}} onClick={handleCancel} endIcon={<DoDisturbIcon />} >cancel</Button>
        </Box>
      </Box>
    </Box>
    {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}
    {loadingDialog()}
  </Box>
  </div>
  </Zoom>
</div>
  )
}

export default UploadReport