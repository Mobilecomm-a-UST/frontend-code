
import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL } from '../../services/FetchNodeServices';
import OverAllCss from '../../csss/OverAllCss';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from '@mui/material/Zoom';

const File_Merge = () => {
  const [pre, setPre] = useState({ filename: "", bytes: "" })
  const [fileData, setFileData] = useState()
  const [showPre, setShowPre] = useState(false)
  const [showDown, setShowDown] = useState(false)
  const [open, setOpen] = useState(false);
  const classes = OverAllCss();
  var link = `${ServerURL}${fileData}`;



  console.log('link data', link)

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

  // ###### HANDLE SUBMIT ######
  const handleSubmit = async () => {
    if (pre.filename > 0) {
      setOpen(true)
      var formData = new FormData();
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
        formData.append(`files_${i}`, pre.bytes[i]);
      }

      const response = await postData('merge_file/excel', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
      console.log('response data', response)
      setFileData(response.Download_url1)


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

    }
  };

  // ###### HANDLE CANCEL   #######
  const handleCancel = () => {
    setPre({ filename: "", bytes: "" });
    var Preoutput = document.getElementById('fileList');
    Preoutput.innerHTML = '';
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
          <Box >DATA UNDER PROCESSING...</Box>
        </DialogContent>

      </Dialog>
    )
  }
  useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  },[])

  return (
    <>

      <div style={{ marginTop: '5%' }}>
        <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
          <div>
            <div style={{ margin: 10, marginLeft: 50 }}>
              <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                <Link underline="hover" href='/tools'>Tools</Link>
                <Typography color='text.primary'>File Merge</Typography>
              </Breadcrumbs>
            </div>

            <Box className={classes.main_Box}>
              <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                <Box className={classes.Box_Hading} >
                  EXCEL FILE MERGE
                </Box>
                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                  <Box className={classes.Front_Box} >
                    <div className={classes.Front_Box_Hading}>
                      Select Excel Files:-<span style={{ fontFamily: 'Poppins', fontSize: 15, color: "gray", marginLeft: 20 }} id="fileList"></span>
                    </div>
                    <div className={classes.Front_Box_Select_Button} >
                      <div style={{ float: "left" }}>
                        <Button variant="contained" component="label" color={pre.state ? "warning" : "primary"}>
                          select file
                          <input type="file" required onChange={handlepre}   accept=".csv, .xls, .xlsx" hidden multiple />
                        </Button>
                      </div>
                      <div>  <span style={{ display: showPre ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                      <div></div>
                    </div>
                  </Box>

                </Stack>
                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                  <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>

                  <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                </Stack>
              </Box>
              <a download href={link} style={{ display: showDown ? 'inherit' : 'none' }}><Button variant="outlined" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download File Now</span></Button></a>


            </Box>
            {loadingDialog()}



          </div>
        </Zoom>
      </div>
    </>)
}

export default File_Merge