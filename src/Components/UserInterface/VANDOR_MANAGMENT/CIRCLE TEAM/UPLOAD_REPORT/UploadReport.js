import React,{useState,useEffect} from "react";
import { Box, Button ,Stack } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {postData} from "../../../../services/FetchNodeServices";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Zoom from "@mui/material/Zoom";
import OverAllCss from "../../../../csss/OverAllCss";


const UploadReport = () => {
    const [vendorFile,setVendorFile] = useState({ filename: "", bytes: "" })
    const [circle,setCircle] = useState('')
    const [showCircle,setShowCircle] = useState(false);
    const [showVendor,setShowVendor] = useState(false);
  const [showSite,setShowSite] = useState(false);
  const navigate = useNavigate()
  const classes = OverAllCss()


    const handleVendorFile=(event)=>
    {
      setVendorFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true
        });
    }
    const vendorFileLength = vendorFile.filename.length
    const circleLength = circle.length
    console.log('dddddd',circle)


// ############# ON SUBMIT BUTTON ###############
  const handleSubmit=async()=>
  {

    if(vendorFileLength > 0 && circleLength > 0)
    {
    var formData = new FormData();
    formData.append("circle", circle);
    formData.append("Progress_report_file", vendorFile.bytes);
    const response = await postData('vendor_management/circle_team/upload/',formData, {headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }})

    sessionStorage.setItem('vendor_upload_report',JSON.stringify(response.status_obj))
    console.log('response data :',response)

    if (response.status == true) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `${response.message}`,
      });
      navigate('upload_report_status')

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
    }
}
else{
  if(circleLength == 0 ){
    setShowCircle(true)
  }
  if(vendorFileLength == 0){
      setShowVendor(true)
  }

}
  };

  // ############# ON CANCEL BUTTON ##############
  const handleCancel=()=>
  {
    setVendorFile({filename:"",bytes:""})

    setCircle('')

  }
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <div>
      <Zoom in='true' timeout={600}>
    <Box className={classes.main_Box}>
    <Box className={classes.Back_Box} sx={{width:{md:'75%',xs:'100%'}}}>
      <Box className={classes.Box_Hading}>
        UPLOAD VENDOR REPORT
      </Box>
      <Stack spacing={2} sx={{ marginTop: "-40px" }}>



        <Box className={classes.Front_Box}>
          <div className={classes.Front_Box_Hading}>
            SELECT CIRCLE :-
          </div>
          <div className={classes.Front_Box_Select_Button}>
            <div style={{ float: "left" }}>

                <Select

                value={circle}
                onChange={(e)=>{setCircle(e.target.value);setShowCircle(false)}}
                style={{minWidth:200}}
                >
              <MenuItem value={'MP'}>MADHYA PRADESH</MenuItem>
              <MenuItem value={'AP'}>ANDHRA PRADESH</MenuItem>
              <MenuItem value={'BR'}>BIHAR</MenuItem>
              <MenuItem value={'RJ'}>RAJASTHAN</MenuItem>
              <MenuItem value={'HR'}>HARYANA</MenuItem>
              <MenuItem value={'TNCH'}>TAMIL NADU/CHENNAI</MenuItem>

        </Select>
          </div>
            <div><span style={{display:showCircle?'inherit':'none',color:'red', fontSize: '18px', fontWeight: 600}}>This Field Is required !</span></div>
          </div>
        </Box>

        <Box className={classes.Front_Box}>
          <div className={classes.Front_Box_Hading}>
            Select VENDOR FILE:-<span style={{fontFamily:'Poppins',color:"gray",marginLeft:20}}>{vendorFile.filename}</span>
          </div>
          <div className={classes.Front_Box_Select_Button}>
            <div style={{ float: "left" }}>
              <Button variant="contained" component="label" color={vendorFile.state?"warning":"primary"}>
                select file
                <input required hidden onChange={(e)=>{handleVendorFile(e);setShowVendor(false)}} accept=".xls,.xlsx" multiple type="file" />
              </Button>
            </div>
            <div><span style={{display:showVendor?'inherit':'none',color:'red', fontSize: '18px', fontWeight: 600}}>This Field Is required !</span></div>
          </div>
        </Box>

      </Stack>
      <Box style={{display:'flex',justifyContent:"space-around",marginTop:"20px"}}>
        <Box>
          <Button variant="contained" color="success" onClick={handleSubmit}  endIcon={<UploadIcon/>}>upload</Button>
        </Box>
        <Box>
          <Button  variant="contained"  style={{backgroundColor:"red",color:'white'}} onClick={handleCancel} endIcon={<DoDisturbIcon />} >cancel</Button>
        </Box>

      </Box>
    </Box>
    {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}
  </Box>
  </Zoom>
</div>
  )
}

export default UploadReport