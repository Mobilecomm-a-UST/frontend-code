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
// import { driver } from "driver.js";
// import "driver.js/dist/driver.css";
// import Fab from '@mui/material/Fab';
// import LiveHelpIcon from '@mui/icons-material/LiveHelp';
// import Tooltip from '@mui/material/Tooltip';
import { usePost } from "../../../../Hooks/PostApis";

const MakeKPITrendOld = () => {
  const { isLoading,error,response,makePostRequest,cancelRequest,}  = usePost()
    const [rawKpiFile,setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [siteListFile,setSiteListFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [offerDate,setOfferDate] = useState()
    const [rawShow,setRawShow] = useState(false)
    const [siteShow,setSiteShow] = useState(false)
    const [fileData,setFileData] = useState()
    const [dlink,setDlink] = useState(false)
    const rawKpiLength = rawKpiFile.filename.length
    const siteListLength = siteListFile.filename.length
    const classes =  OverAllCss();


    var link = `${ServerURL}${fileData}`;
    const handleRawKpiFile=(event)=>
    {
        setRawShow(false);
        setRawKpiFile({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true

        })
    }

    const handleSiteListFile=(event)=>
    {
        setSiteShow(false);
        setSiteListFile({
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
  useEffect(()=>{
      todayDate();
      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  const handleSubmit=async()=>
  {

    if(rawKpiLength > 0 && siteListLength > 0)
    {

    setOpen(true)
    var formData = new FormData();
    formData.append("raw_kpi", rawKpiFile.bytes);
    formData.append("site_list", siteListFile.bytes);
    formData.append("offered_date", offerDate);
    // const response = await postData('trend/kol/makeKpiTrend/old/',formData, {headers: {Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
    // ,signal:abortSignal})
    const response = await makePostRequest('trend/kol/makeKpiTrend/old/',formData)
     setFileData(response.Download_url)
     console.log('response data',response)

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
else{
    if(rawKpiLength == 0 )
    {
        setRawShow(true)
    }
    if(siteListLength == 0)
    {
        setSiteShow(true)
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
    setRawKpiFile({filename:"",bytes:""})
    setSiteListFile({filename:"",bytes:""})

    todayDate()

  }

  return (
    <Zoom in='true' timeout={500}>
    <div>
          <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" href='/tools'>Tools</Link>
            <Link underline="hover" href='/trends'>Trend</Link>
            <Link underline="hover" href='/trends/wb_kol'>WB/KOL</Link>
            <Typography color='text.primary'>Make Trend(old)</Typography>
          </Breadcrumbs>
      </div>
    <Box className={classes.main_Box}>
        <Box className={classes.Back_Box} sx={{width:{md:'75%',xs:'100%'}}}>
            <Box className={classes.Box_Hading}>
                Make KPI TREND(OLD)
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }}>
                <Box className={classes.Front_Box}>
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
                        <div>  <span style={{display:rawShow?'inherit':'none',color:'red',fontSize:'18px',fontWeight:600}}>This Field Is Required !</span> </div>
                        <div>
                        </div>
                    </div>
                </Box>
                <Box className={classes.Front_Box}>
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
                        <div>  <span style={{display:siteShow?'inherit':'none',color:'red',fontSize:'18px',fontWeight:600}}>This Field Is Required !</span> </div>
                        <div></div>
                    </div>
                </Box>

                <Box className={classes.Front_Box}>
                    <div className={classes.Front_Box_Hading}>
                      OFFERED DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                    </div>
                    <div className={classes.Front_Box_Select_Button}>
                        <div style={{ float: "left" }}>

                            <input required value={offerDate}
                            onChange={(event)=>dateFun(event.target.value)}
                            type="date"
                            style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 'bold' }}
                            />

                        </div>
                        <div></div>
                    </div>
                </Box>


            </Stack>
            <Box sx={{ display: 'flex', justifyContent: "space-around",flexDirection:{xs:'column',md:'row'},gap:2, marginTop: "20px" }}>

                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>


                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

            </Box>
        </Box>
        <Box style={{display:dlink?"inherit":"none"}}>
        <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download KPI Trend</span></Button></a>
        </Box>



    </Box>
    {loadingDialog()}
    {/* {handleError()} */}


</div>
</Zoom>
  )
}

export default MakeKPITrendOld