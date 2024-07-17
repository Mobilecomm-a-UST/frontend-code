import React, { useState } from 'react'

import { Button, Stack,Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from '@mui/icons-material/Cancel';
import {  postData } from '../../services/FetchNodeServices';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux';
import Zoom from '@mui/material/Zoom';
import OverAllCss from '../../csss/OverAllCss';


export default function UploadDprMapa() {
  const [dprMapa, setDprMapa] = useState({ filename: "", bytes: "" });
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const classes = OverAllCss();


  const handleDPRMapa = (event) => {
    setDprMapa({
      filename: event.target.files[0].name,
      bytes: event.target.files[0],
      state: true
    });
  };

  const handleSubmit = async () => {
    var formData = new FormData();

    formData.append("MAPA_file", dprMapa.bytes);

    const response = await postData('trend/mapa_status_upld/', formData)
    // setPostData(response.status_obj)
    dispatch({ type: 'MAPA_STATUS', payload: { response } })
    console.log("result:", response)
    if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Done",
        text: "Upload File Successfully",
      });
      navigate('/dpr/mapa_status');

    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${response.message}`,
      });
    }

  };

  const handleCancel = () => {
    setDprMapa({ filename: "", bytes: "" })
  }
  return (
    <div >
      <Zoom in='true' timeout={600}>
        <Box className={classes.main_Box}>

          <Box className={classes.Back_Box}>
            <Box className={classes.Box_Hading}>
              UPLOAD DPR MAPA
            </Box>
            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
            <Box className={classes.Front_Box}>
              <div className={classes.Front_Box_Hading}>
                Select DPR MAPA File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{dprMapa.filename}</span>
              </div>
              <Box className={classes.Front_Box_Select_Button}>
                <Button
                  variant="contained"
                  component="label"
                  color={dprMapa.state ? "warning" : "primary"}
                >
                  <span style={{ fontFamily: "Poppins", textTransform: "none", fontSize: "18px" }}>Select File</span>
                  <input hidden onChange={handleDPRMapa} accept="/*" multiple type="file" />
                </Button>
              </Box>
            </Box>
            </Stack>
            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} sx={{display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
              <Button variant="contained" color="error" endIcon={<CancelIcon />} onClick={handleCancel}>Cancel</Button>
              <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<CloudUploadIcon />}>Upload</Button>
            </Stack>
          </Box>
        </Box>
      </Zoom>
    </div>
  )
}
