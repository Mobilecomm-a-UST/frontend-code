import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../../services/FetchNodeServices";
import OverAllCss from "../../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Slide from '@mui/material/Slide';
import { MemoTask } from "./Task";

const Comperison = () => {
    const [mdpFile, setMdpFile] = useState({ filename: "", bytes: "" })
    const [gpl , setGpl]= useState({ filename: "", bytes: "" })
    const [fdd , setFdd] = useState({filename: "", bytes: "" })
    const [bsc , setBsc] = useState({filename: "", bytes: "" })
    const [fileData, setFileData] = useState('')
    const [showFdd, setShowFdd] = useState(false)
    const [showGpl, setShowGpl] = useState(false)
    const [showBsc, setShowBsc] = useState(false)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const classes = OverAllCss();
    const fddFileLength = fdd.filename.length
    const gplFileLength = gpl.filename.length
    const bscFileLength = bsc.filename.length
    var link = `${ServerURL}${fileData}`;
    const [showLink , setShowLink] = useState(false)




    const handleFddFile = (event) => {
        setShowFdd(false);
        setFdd({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true
        })
    }
    const handleGplFile = (event) => {
        setShowGpl(false);
        setGpl({
          filename: event.target.files[0].name,
          bytes: event.target.files[0],
          state: true
        })
    }

    const handleBscFile = (event) => {
      setShowBsc(false);
      setBsc({
        filename: event.target.files[0].name,
        bytes: event.target.files[0],
        state: true
      })
  }


    const handleSubmit = async () => {
        if (fddFileLength> 0 && gplFileLength > 0 && bscFileLength > 0) {
          setOpen(true)
          var formData = new FormData();
          formData.append("2G_Dump", fdd.bytes);
          formData.append("BSC_SITE", bsc.bytes);
          formData.append("2G_GPL", gpl.bytes);
          formData.append("circle", 'HRY');

          const response = await postData('AUDIT_TOOL/2G_AUDIT/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
          // console.log('response data', response)
        //   sessionStorage.setItem('upload_performance_at_status', JSON.stringify(response.status_obj))

          if (response.status == true) {
            setOpen(false)
            setShowLink(true)
            Swal.fire({
              icon: "success",
              title: "Done",
              text: `${response.message}`,
            });
            setFileData(response.Download_url)

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
            if( fddFileLength == 0 ){
                setShowFdd(true)
            }
            if(gplFileLength == 0 ){
                setShowGpl(true)
            }
            if(bscFileLength == 0 ){
                setShowBsc(true)
            }
      }};

      const handleCancel = () => {
        setFdd({ filename: "", bytes: "" })
        setGpl({ filename: "", bytes: "" })
        setBsc({ filename: "", bytes: "" })

      }


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



  return (
    <>
    <Slide direction="left" in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
        <div>
            <div style={{ margin: 10, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={()=>{ navigate('/tools')}}>Tools</Link>
                    <Link underline="hover" onClick={()=>{ navigate('/tools/audit')}}>Audit Tools</Link>
                    <Link underline="hover" onClick={()=>{ navigate('/tools/audit/2G_audit')}}>2G Audit</Link>
                    <Typography color='text.primary'>Haryana</Typography>
                </Breadcrumbs>
            </div>
            <Box className={classes.main_Box}>
                <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                    <Box className={classes.Box_Hading} >
                            Generat Comparison ( 2G Audit HR)
                    </Box>
                    <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                        <Box className={classes.Front_Box} >
                            <div className={classes.Front_Box_Hading}>
                                Select 2G Dump File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{fdd.filename}</span>
                            </div>
                            <div className={classes.Front_Box_Select_Button} >
                                <div style={{ float: "left" }}>
                                    <Button variant="contained" component="label" color={fdd.state ? "warning" : "primary"}>
                                        select file
                                        <input type="file" required onChange={handleFddFile} accept=".xlsx, .xls" hidden  />
                                    </Button>
                                </div>
                                <div>  <span style={{ display: showFdd ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                            </div>
                        </Box>

                        <Box className={classes.Front_Box} >
                            <div className={classes.Front_Box_Hading}>
                                Select BSC Site File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{bsc.filename}</span>
                            </div>
                            <div className={classes.Front_Box_Select_Button} >
                                <div style={{ float: "left" }}>
                                    <Button variant="contained" component="label" color={bsc.state ? "warning" : "primary"}>
                                        select file
                                        <input type="file" required onChange={handleBscFile} accept=".xlsx, .xls" hidden  />
                                    </Button>
                                </div>
                                <div>  <span style={{ display: showBsc ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                            </div>
                        </Box>

                        <Box className={classes.Front_Box} >
                            <div className={classes.Front_Box_Hading}>
                                Select 2G GPL File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{gpl.filename}</span>
                            </div>
                            <div className={classes.Front_Box_Select_Button} >
                                <div style={{ float: "left" }}>
                                    <Button variant="contained" component="label" color={gpl.state ? "warning" : "primary"}>
                                        select file
                                        <input type="file" required onChange={handleGplFile} accept=".xlsx, .xls" hidden  />
                                    </Button>
                                </div>
                                <div>  <span style={{ display: showGpl ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                            </div>
                        </Box>


                    </Stack>

                    <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                        <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>submit</Button>

                        <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >Clear</Button>
                    </Stack>
                </Box>
                <Box style={{ display: showLink ? 'inherit' : 'none' }}>
                    <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Trend</span></Button></a>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                       <MemoTask />
                </Box>

            </Box>
            {loadingDialog()}
            {/* {handleError()} */}


        </div>
    </Slide>
</>
  )
}

export default Comperison