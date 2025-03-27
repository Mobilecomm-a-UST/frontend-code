import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useDispatch } from "react-redux";
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, getData } from "../../../../services/FetchNodeServices";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Multiselect from "multiselect-react-dropdown";
import CachedIcon from '@mui/icons-material/Cached';
import OverAllCss from './../../../../csss/OverAllCss'
import Zoom from "@mui/material/Zoom";
const names = [];

function MakeKPITrend() {

  const [siteList, setSiteList] = useState({ filename: "", bytes: "" })
  const [tdate, setTdate] = useState()
  const [pdate, setPdate] = useState()
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [showSite, setShowSite] = useState(false);
  const [site, setSite] = useState([])
  const [integratSite , setIntegratSite] = useState()
  const [unintegratSite , setUnintegratSite] = useState([])
  const [mycommData , setMycommData] = useState([])
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = OverAllCss();

  let abortController
  const fileLength = siteList.filename.length

  console.log('lllllllllll', mycommData.length)
  // console.log('dropdown data :', JSON.stringify(site))

  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="rigth" ref={ref} {...props} />;
  // });

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

    setTdate([year, month, day].join('-'))

  }
  const pastDate = () => {
    var d = new Date();
    d.setDate(d.getDate() - 5);
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

// ########## FETCH DORPDOWN SITE LIST ##########
  const fetchSiteList = async () => {
    const response = await getData('Original_trend/tnch/integrated_sites')

    const dt = response.sites
    dt.map((item, index) => {
      console.log('dt:', item.Site, index)
      names.push(item.Site)
      // setSiteData(item.Site)
    })
    console.log('response:', response.sites[2].Site)

  }

  useEffect(() => {
    todayDate();
    pastDate();
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    fetchSiteList();
  }, [])



  const handleSiteList = (event) => {
    setSiteList({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
    setShow(false)
  }

  const handleClose = () => {
    setOpens(false);
    setSiteOpen(false);
  };

  const integrateList=()=>
  {
    return(
         integratSite?.map((item)=>
    (
        <div style={{fontWeight:600,fontSize:17}}>{item}</div>
    )
    )
    )
  }
  const nonintegrateList=()=>
  {
    return(
         unintegratSite?.map((item)=>
    (
        <div style={{fontWeight:600,fontSize:17}}>{item}</div>
    )
    )
    )
  }
  const refMyCommData=()=>
  {
    return(
         mycommData?.map((item)=>
    (
        <div style={{fontWeight:600,fontSize:17}}>{item}</div>
    )
    )
    )
  }



  // ********* SITE LIST DIALOG AFTER SUBMITED *******
  const siteDialogBox = () => {
    return (
      <Dialog
        open={siteOpen}
        onClose={handleClose}
        // TransitionComponent={Transition}
        keepMounted
      // aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Box style={{ textAlign: "center" }}>
            <Box style={{ fontSize: '25px', fontFamily: 700 }}>INTEGRATED SITE</Box>
            <Box style={{ minWidth: '300px', minHeight: '100px', maxWidth: 'auto', maxHeight: 'auto', border: '2px solid black' }}>
              <Box style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto auto' }}>
                {integrateList()}
              </Box>
            </Box>
            <Box style={{ fontSize: '25px', fontFamily: 700 }}>Not Reflecting In Integrated Sites</Box>
            <Box style={{ minWidth: '400px', minHeight: '100px', maxWidth: 'auto', maxHeight: 'auto', border: '2px solid black' }}>
              <Box >
               {unintegratSite.length != 0?<Box style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto' }}>{nonintegrateList()}</Box>:<Box style={{color:'green',fontSize:20,marginTop:'20px'}}>.............</Box>}
              </Box>
            </Box>
            <Box style={{ fontSize: '25px', fontFamily: 700 }}>not reflectig in MyCom data</Box>
            <Box style={{ minWidth: '400px', minHeight: '100px', maxWidth: 'auto', maxHeight: 'auto', border: '2px solid black' }}>
              <Box >
               {mycommData.length != 0?<Box style={{ display: 'grid', gridTemplateColumns: 'auto auto auto auto' }}>{refMyCommData()}</Box>:<Box style={{color:'green',fontSize:20,marginTop:'20px'}}>.............</Box>}
              </Box>
            </Box>

          </Box>
          <Box textAlign={'center'} style={{ marginTop: "10px", display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" endIcon={<CachedIcon />} onClick={()=>{handleProcessing();setSiteOpen(false)}}>PROCEED</Button>
            <Button variant="contained" color="error" endIcon={<DoDisturbIcon />} onClick={()=>{setSiteOpen(false)}}>cancel</Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }


  // ####### HANDLE SUBMITED BY UPLOAD BUTTON ######
  const handleSubmit = async () => {
    if (fileLength > 0 || site.length > 0) {
      abortController = new AbortController()
      const abortSignal = abortController.signal
      setOpen(true)
      var formData = new FormData();
      formData.append("site_list", siteList.bytes);
      formData.append("site", site);
      formData.append("from_date", pdate);
      formData.append("to_date", tdate);


      const response = await postData('Original_trend/tnch/KpiTrend/?check=True', formData)
      dispatch({ type: 'PRE_POST_REPORT', payload: { response } })
      setIntegratSite(response.integrated_sites)
      setUnintegratSite(response.not_avalilable_sites)
      setMycommData(response.not_reflectig_in_MyCom_data)

      console.log('response data  :::', response)

      if (response.status) {
        setOpen(false);
        setSiteOpen(true);
        // navigate('/trends/tn_ch/make_kpi_trend_report');
      } else {
        setOpen(false);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${response.message}`,

        })
      }
    } else {
      if (fileLength == 0) {
        setShow(true);
      }

      if (site.length == 0) {
        setShowSite(true)
      }
    }
  };
  const cancellAPI=()=>{
    setOpen(false)
    abortController.abort()
  }


  // ###### AFTER PROCESSING ########
  const handleProcessing=async()=>
  {

    setOpen(true)
      var formData = new FormData();
      formData.append("site_list", siteList.bytes);
      formData.append("site", site);
      formData.append("from_date", pdate);
      formData.append("to_date", tdate);


      const response = await postData('Original_trend/tnch/KpiTrend/?check=False', formData)
      sessionStorage.setItem('makekpitrend', JSON.stringify(response));
      console.log('response processing data:', response)

      if (response.status) {
        setOpen(false);
        Swal.fire({
          icon: "success",
          title: "Done",
          text: `${response.message}`,
        });
        navigate('/trends/tn_ch/make_kpi_trend_report');
      } else {
        setOpen(false);

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `${response.message}`,

        })
      }
    }


  const handleCancel = () => {

    setSiteList({ filename: "", bytes: "" })
    todayDate()
    pastDate()

  }

  // DATA PROCESSING DIALOG BOX...............
  const loadingDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
        keepMounted
      // aria-describedby="alert-dialog-slide-description"
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
            <Typography color='text.primary'>Make Trend</Typography>
          </Breadcrumbs>
      </div>
      <Box className={classes.main_Box}>
        <Box className={classes.Back_Box}>
          <Box className={classes.Box_Hading}>
            MAKE KPI TREND
          </Box>
          <Stack spacing={2} sx={{ marginTop: "-40px" }}>

            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select SITE LIST:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{siteList.filename}</span>
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div style={{ float: "left" }}>
                  <Button variant="contained" component="label" color={siteList.state ? "warning" : "primary"}>
                    select file
                    <input required hidden onChange={handleSiteList} accept="/*" multiple type="file" />
                  </Button>
                </div>
                <div><span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is required !</span></div>
              </div>
            </Box>
            {/* ########## SELECT SITE ############*/}
            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select SITE :-
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div style={{ float: "left" }}>
                  <Multiselect
                    isObject={false}
                    options={names}
                    showCheckbox
                    onRemove={(event) => { setSite(event); console.log('select:', event) }}
                    onSelect={(event) => { setSite(event); console.log('select:', event); setShowSite(false) }}
                    placeholder="Select Site"
                  />

                </div>
                <div><span style={{ display: showSite ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is required !</span></div>
              </div>

            </Box>



            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select DATE:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
              </div>
              <div className={classes.Front_Box_Select_Button}>
                <div >
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>From </span>
                  <input required value={pdate} onChange={(event) => setPdate(event.target.value)} type="date" style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 500, borderRadius: "10px" }} />

                </div>
                <div><SyncAltIcon /></div>
                <div >
                  <span style={{ fontSize: '20px', fontWeight: 'bold' }}>To </span>
                  <input required value={tdate} onChange={(event) => setTdate(event.target.value)} type="date" style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 500, borderRadius: "10px" }} />
                </div>
              </div>
            </Box>


          </Stack>
          <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
            <Box>
              <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>
            </Box>
            <Box>
              <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
            </Box>
          </Box>
        </Box>
        {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{fontSize:30,color:"green"}}/>}  sx={{marginTop:"10px",width:"auto"}}><span style={{fontFamily:"Poppins",fontSize:"22px",fontWeight:800,textTransform:"none",textDecorationLine:"none"}}>Download Temp</span></Button></a> */}


      </Box>
      {loadingDialog()}
      {siteDialogBox()}
      {/* {handleError()} */}


    </div>
    </Zoom>
  )
}

export default MakeKPITrend