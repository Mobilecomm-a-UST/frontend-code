import React,{useState,useEffect} from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch } from "react-redux";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData,ServerURL,getData } from "../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Progress } from 'rsuite';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from "@mui/material/Zoom";
import OverAllCss from "../../../../csss/OverAllCss";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import Tooltip from '@mui/material/Tooltip';

const Upload_post_kpi = () => {
    const [kpiFile,setKpiFile] = useState({ filename: "", bytes: "" })
    const [uploadDate,setUploadDate] = useState()
    const [show,setShow] = useState(false)
    // const [open, setOpen] = React.useState(false);
    const fileLength = kpiFile.filename.length
    const classes  =  OverAllCss();

    const handleKPIFile=(event)=>
    {
        setShow(false);
        setKpiFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true

        })

    }

    console.log('size:',fileLength);

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

  setUploadDate( [year, month, day].join('-'))

  }

  const dateFun=(date)=>
  {
      setUploadDate(date)
      // console.log('Date', date)
  }
 // highlite driver js
   const startTour = () => {
    const driverObj = driver({

      showProgress: true,
      steps: [
        { element: '#step-1', popover: { title: 'Select KPI File:-', description: 'Select KPI FileFilegenerated from MyCom Tool', side: "bottom", align: 'start' } },
        { element: '#step-2', popover: { title: 'Upload DATE:-', description: 'Upload DATE from fatch KPI FILES ', side: "left", align: 'start' } },
        // { element: '#step-3', popover: { title: 'Select PRE-POST Site File:-', description:      'select site id in this field', side: "left", align: 'start' } },
        // { element: '#step-4', popover: { title: 'OFFERED DATE', description: 'Select Offered date which is greatest date +1 amoung the 5 dates', side: "left", align: 'start' } },
        { element: '#step-3', popover: { title: 'SUBMIT BUTTON', description: 'Click on submit button', side: "center", align: 'start' } },
        { element: '#step-4', popover: { title: '', description: "<div>Please wait few minutes</div><img src='/assets/prograse.png' style='height: 202.5px; width: 270px;' />", }},
        { element: '#step-5', popover: { title: 'Enable Download KPI Button', description: "<img src='/assets/downloadButton.png' style='height: 202.5px; width: 270px;' />", }},
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

    if(fileLength > 0)
    {



    var formData = new FormData();
    formData.append("file", kpiFile.bytes);
    formData.append("upload_date", uploadDate);
    const response = await postData('Original_trend/tnch/raw_kpi_upload/',formData)

     console.log('response data',response)

    if (response.status == 'true') {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: `${response.message}`,
      });

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
    }
}
else{
    setShow(true);
}
  };

  const handleCancel=()=>
  {
    setKpiFile({filename:"",bytes:""})

    todayDate()

  }


  return (
    <Zoom in='true' timeout={500}>
    <div>
    <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/trends'>Trend</Link>
                        <Link underline="hover" href='/trends/tn_ch'>TNCH</Link>
                        <Typography color='text.primary'>Make Trend(old)</Typography>
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
                        UPLOAD POST KPI
                    </Box>
                    <Stack spacing={2} sx={{ marginTop: "-40px" }}>
                        <Box className={classes.Front_Box}id='step-1'>
                            <div className={classes.Front_Box_Hading}>
                                Select KPI File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{kpiFile.filename}</span>
                            </div>
                            <div className={classes.Front_Box_Select_Button}>
                                <div style={{ float: "left" }}>
                                    <Button variant="contained" component="label" color={kpiFile.state ? "warning" : "primary"}>
                                        select file
                                        <input required onChange={handleKPIFile} hidden accept="/*" multiple type="file" />
                                    </Button>
                                </div>
                                <div>  <span style={{display:show?'inherit':'none',color:'red',fontSize:'18px',fontWeight:600}}>This Field Is Required !</span> </div>
                                <div></div>
                            </div>
                        </Box>

                        <Box className={classes.Front_Box}id='step-2'>
                            <div className={classes.Front_Box_Hading}>
                              Upload DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                            </div>
                            <div className={classes.Front_Box_Select_Button}>
                                <div style={{ float: "left" }}>

                                    <input required value={uploadDate}
                                    onChange={(event)=>dateFun(event.target.value)}
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
                            <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}id='step-3'>upload</Button>
                        </Box>
                        <Box>
                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                        </Box>
                    </Box>
                </Box>
                {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}


            </Box>
            {/* {loadingDialog()} */}
            {/* {handleError()} */}


        </div>
        </Zoom>
  )
}

export default Upload_post_kpi