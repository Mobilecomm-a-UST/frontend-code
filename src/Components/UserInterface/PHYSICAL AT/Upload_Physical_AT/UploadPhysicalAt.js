import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Zoom from '@mui/material/Zoom';




const UploadPhysicalAt = () => {
  const [physical, setPhysical] = useState({ filename: "", bytes: "" })
  const [pdate, setPdate] = useState()
  const [fileData, setFileData] = useState()
  const [show, setShow] = useState(false)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const fileLength = physical.filename.length
  const classes = OverAllCss();
  var link = `${ServerURL}${fileData}`;

  const handlephysical = (event) => {
    setShow(false);
    setPhysical({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true

    })

  }

  const handleSubmit = async () => {
    if (fileLength > 0) {
      setOpen(true)
      var formData = new FormData();
      formData.append("Physical_At_Report_file", physical.bytes);
      formData.append("upload_date", pdate);
      const response = await postData('Physical_At/upload/', formData)
      console.log('response data', response)
      sessionStorage.setItem('upload_physical_at_status', JSON.stringify(response.status_obj))

      if (response.status == true) {
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
    else {
      setShow(true);
    }
  };

  const handleCancel = () => {
    setPhysical({ filename: "", bytes: "" })
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

  //   Download Tem. #####################
  const handleDownload = async () => {
    const response = await getData('Soft_At/template/')
    setFileData(response.Download_url)
    // console.log('download data:', response)
  }

  useEffect(() => {
    pastDate();
    handleDownload();
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  }, [])

  return (

    <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
      <div>
        <Box className={classes.main_Box}>
          <Box className={classes.Back_Box} sx={{width:{md:'75%',xs:'100%'}}}>
            <Box className={classes.Box_Hading} >
              UPLOAD PHYSICAL AT REPORT
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
              <Box className={classes.Front_Box} >
                <div className={classes.Front_Box_Hading}>
                  Select Physical AT File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{physical.filename}</span>
                </div>
                <div className={classes.Front_Box_Select_Button} >
                  <div style={{ float: "left" }}>
                    <Button variant="contained" component="label" color={physical.state ? "warning" : "primary"}>
                      select file
                      <input required onChange={handlephysical} hidden accept="/*" multiple type="file" />
                    </Button>
                  </div>
                  <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                  <div></div>
                </div>
              </Box>
              <Box className={classes.Front_Box}>
                <div className={classes.Front_Box_Hading}>
                  Upload Date:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                </div>
                <div className={classes.Front_Box_Select_Button}>
                  <div >

                    <input required value={pdate} onChange={(event) => setPdate(event.target.value)} type="date" style={{ width: '165px', height: '35px', fontSize: '20px', fontWeight: 500, borderRadius: "10px" }} />
                  </div>
                </div>
              </Box>


            </Stack>
            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>


            </Stack>
          </Box>
          <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a>


        </Box>
        {loadingDialog()}
      </div>
    </Zoom>
  )
}

export default UploadPhysicalAt
