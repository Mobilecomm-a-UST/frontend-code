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


const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'WB', 'JH']

const Alarm4G = () => {
    const [selectCircle, setSelectCircle] = useState('')
        const [oldLog, setOldLog] = useState([])
        const [newLog, setNewLog] = useState([])
        const [siteFiles, setSiteFiles] = useState([])
        const [showSite, setShowSite] = useState(false)
        const [showOld, setShowOld] = useState(false)
        const [showNew, setShowNew] = useState(false)
        const [show, setShow] = useState(false)
        const [fileData, setFileData] = useState()
        const [download, setDownload] = useState(false);
        const { loading, action } = useLoadingDialog()
        const navigate = useNavigate()
        const classes = OverAllCss()
        const link = `${ServerURL}${fileData}`;
    
    
        const handleOldLogFileSelection = (event) => {
            setOldLog(event.target.files)
        }
        const handleNewLogFileSelection = (event) => {
            setNewLog(event.target.files)
        }
        const handleSiteFileSelection = (event) => {
            setSiteFiles(event.target.files)
        }
    
    
        const handleSubmit = async () => {
            if (siteFiles.length > 0 && selectCircle !== '' && oldLog.length > 0 && newLog.length > 0) {
                action(true)
                var formData = new FormData();
                formData.append('circle', selectCircle)
                for (let i = 0; i < siteFiles.length; i++) {
                    formData.append(`site_file`, siteFiles[i]);
                }
                for (let j = 0; j < oldLog.length; j++) {
                    formData.append(`old_logs`, oldLog[j]);
                }
                for (let k = 0; k < newLog.length; k++) {
                    formData.append(`new_logs`, newLog[k]);
                }
    
                const response = await postData('Alarm/upload_5g/', formData)
    
                //   console.log('response data', response)
    
    
                if (response.status === true) {
                    action(false)
                    setDownload(true)
    
                    setFileData(response.download_url)
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
                if (siteFiles.length === 0) {
                    setShowSite(true)
                } else {
                    setShowSite(false)
                }
                if (selectCircle === '') {
                    setShow(true)
                } else {
                    setShow(false)
                }
                if (oldLog.length === 0) {
                    setShowOld(true)
                } else {
                    setShowOld(false)
                }
                if (newLog.length === 0) {
                    setShowNew(true)
                } else {
                    setShowNew(false)
                }
               
    
            }
        }
    
        const handleCancel = () => {
            setSiteFiles([])
            setOldLog([])
            setNewLog([])
            setSelectCircle('')
            setShow(false)
            setShowSite(false)
            setShowOld(false)
            setShowNew(false)
        }
    
        useEffect(() => {
            document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    
        }, [])
    return (
         <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/dma') }}>DSA Tool</Link>
                    <Typography color='text.primary'>Make 4G Alarm</Typography>
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
                                Old Vs New 4G Alarm
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
                                                onChange={(event) => { setSelectCircle(event.target.value); setShow(false) }}
                                            >
                                                {circleArray.map((item, index) => (
                                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </Box>
                                </Box>
                                {/* Old Log File  */}
                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select Old Logs Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={oldLog.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept="/*" multiple type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handleOldLogFileSelection(e); setShowOld(false); }} />
                                            </Button>
                                        </div>

                                        {oldLog.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {oldLog.length}</span>}

                                        <div>  <span style={{ display: showOld ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>         

                                 <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select New Logs Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={newLog.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept="/*" multiple type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handleNewLogFileSelection(e); setShowNew(false); }} />
                                            </Button>
                                        </div>

                                        {newLog.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {newLog.length}</span>}

                                        <div>  <span style={{ display: showNew ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>
                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select Site Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={siteFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept="/*"  type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handleSiteFileSelection(e); setShowSite(false); }} />
                                            </Button>
                                        </div>

                                        {siteFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {siteFiles.length}</span>}

                                        <div>  <span style={{ display: showSite ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
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
                        <a download href={fileData}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download 5G Alarm</span></Button></a>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default Alarm4G