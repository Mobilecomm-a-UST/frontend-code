import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { getDecreyptedData } from "../../../utils/localstorage";




const projectArray = ['NT','ULS','Upgrade','Relocation'];
const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TN', 'UE', 'BH', 'UW', 'MP','MAH', 'PB', 'KO', 'WB', 'JH']

const Summary_5G = () => {
   const [make4GFiles, setMake4GFiles] = useState([])
      const [selectCircle, setSelectCircle] = useState('')
      const [selectProject , setSelectProject] = useState('')
      const [show4G, setShow4G] = useState(false)
      const [show, setShow] = useState(false)
      const [showCircle, setShowCircle] = useState(false)
      const [showProject, setShowProject] = useState(false)
      const [fileData, setFileData] = useState()
      const [download, setDownload] = useState(false);
      const { loading, action } = useLoadingDialog()
      const navigate = useNavigate()
      const userID = getDecreyptedData("userID")
      const classes = OverAllCss()
      const link = `${ServerURL}${fileData}`;
  
  
      const handle4GFileSelection = (event) => {
  
          setMake4GFiles(event.target.files)
      }
  
  
      const handleSubmit = async () => {
          if (make4GFiles.length > 0 && selectCircle !== '' && selectProject !== '') {
              action(true)
              var formData = new FormData();
              formData.append('circle_name', selectCircle)
              formData.append('project_type', selectProject)
              // formData.append('userId', userID)
  
              for (let i = 0; i < make4GFiles.length; i++) {
                  formData.append(`xml_files`, make4GFiles[i]);
              }
  
              const response = await postData('Soft_AT_Checklist_Nokia/upload_summary_xml_files_5G/', formData)
  
              // console.log('response data', response)
  
  
              if (response.status === true) {
                  action(false)
                  setDownload(true)
  
                  setFileData(response.download_link)
                  Swal.fire({
                      icon: "success",
                      title: "Done",
                      text: `${response.message}`,
                  });
                 
              } else {
                  action(false)
  
                  Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `${response.message}`,
                  });
              }
          }
          else {
              if (make4GFiles.length === 0) {
                  setShow4G(true)
              } else {
                  setShow4G(false)
              }
              if(selectCircle === ''){
                  setShowCircle(true)
              }else{
                  setShowCircle(false)
              }
              if(selectProject === ''){
                  setShowProject(true)
              }else{
                  setShowProject(false)
              }
  
          }
      }
  
      const handleCancel = () => {
          setMake4GFiles([])
          setSelectCircle('')
          setSelectProject('')
  
          setShow4G(false)
  
      }
  
      useEffect(() => {
          document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  
      }, [])
  return (
     <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/soft_at') }}>Soft-AT Tool</Link>
                    <Typography color='text.primary'>5G Nokia Summary</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                Create Nokia Soft-At Summary
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Circle
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button} >
                                        <FormControl sx={{ minWidth: 150 }}>
                                            <InputLabel id="demo-simple-select-label">Select Circle</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selectCircle}
                                                label="Select Circle"
                                                onChange={(event) => { setSelectCircle(event.target.value); setShowCircle(false) }}
                                            >
                                                {circleArray.map((item, index) => (
                                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div>  <span style={{ display: showCircle ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </Box>
                                </Box>

                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Project
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button} >
                                        <FormControl sx={{ minWidth: 150 }}>
                                            <InputLabel id="demo-simple-select-label">Select Project</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selectProject}
                                                label="Select Project"
                                                onChange={(event) => { setSelectProject(event.target.value); setShowProject(false) }}
                                            >
                                                {projectArray.map((item, index) => (
                                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div>  <span style={{ display: showProject ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </Box>
                                </Box>

                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select XML Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xml,txt" multiple type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
                                            </Button>
                                        </div>

                                        {make4GFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {make4GFiles.length}</span>}

                                        <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
                        <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Nokia Summary</span></Button></a>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
  )
}

export default Summary_5G