import React, { useState, useEffect } from "react";

import { Button, Stack ,Box} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from '@mui/icons-material/Cancel';
import { getData, postData, ServerURL } from "../../services/FetchNodeServices";
import Swal from "sweetalert2";
import Zoom from "@mui/material/Zoom";
import OverAllCss from "../../csss/OverAllCss";
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';

export default function UploadDprKey() {
  const [dprKey, setDprKey] = useState({ filename: "", bytes: "" });
  const [getFile, setGetFile] = useState()
  const classes = OverAllCss()

  var link = `${ServerURL}${getFile}`


  const Fetchdprkey = async () => {
    const response = await getData('trend/get_dpr_key_temp/')
    setGetFile(response.path)
    // console.log('get data:', response.path)
  }
  useEffect(function () {
    Fetchdprkey();

  }, []);


  const handleDprKey = (event) => {
    setDprKey({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };

  const handleSubmit = async () => {
    var formData = new FormData();

    formData.append("key_file", dprKey.bytes);

    const response = await postData('trend/upload_key_dpr/', formData)

    console.log("MASSAGE:", response.messages)
    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: 'DPR Key Uploaded Succesfully',
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.messages}`,
      });
    }
  };

  const handleCancel = () => {

    setDprKey({ filename: "", bytes: "" })

  }

  return (
    <div style={{marginTop:100}}>
      <Zoom in='true' timeout={600}>
        <div>

          <Box style={{ position: 'fixed', right: 20 }}>
            <Tooltip title="Download DPR Temp.">
              <a download href={link}>
                <Fab color="primary" aria-label="add" >
                  <DownloadIcon />
                </Fab>
              </a>
            </Tooltip>
          </Box>
          <Box
            className={classes.main_Box}
          >
            <Box
              className={classes.Back_Box}
            >
              <Box
                className={classes.Box_Hading}
              >
                UPLOAD DPR KEY
              </Box>
              <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                <Box className={classes.Front_Box}>
                  <div className={classes.Front_Box_Hading}>
                    Select DPR Key File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{dprKey.filename}</span>
                  </div>
                  <Box className={classes.Front_Box_Select_Button}>
                    <Button
                      variant="contained"
                      component="label"
                      size="medium"
                      color={dprKey.state ? "warning" : "primary"}
                    >
                      <span style={{ fontFamily: "Poppins", textTransform: "none", fontSize: "18px" }}>Select File</span>
                      <input hidden onChange={handleDprKey} accept=".xls,.xlsx" multiple type="file" />
                    </Button>
                  </Box>
                </Box>
              </Stack>
              <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} sx={{ display: 'flex', justifyContent: "space-around", marginTop: "15px" }}>
                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<CloudUploadIcon />}>Upload</Button>

                <Button variant="contained" color="error" onClick={handleCancel} endIcon={<CancelIcon />}>Cancel</Button>
              </Stack>
            </Box>
            {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a> */}
          </Box>
        </div>
      </Zoom>
    </div>
  );
}
