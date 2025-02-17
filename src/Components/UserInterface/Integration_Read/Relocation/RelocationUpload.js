import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData,ServerURL,getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate } from "react-router-dom";
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';




const RelocationUpload = () => {
    const classes = OverAllCss();
    const [payloadType, setPayloadType] = useState('');
    const [relocationFile, setRelocationFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false)
    const [relocationShow, setRelocationShow] = useState(false)
    const [typeShow, setTypeShow] = useState(false)
    const [fileData, setFileData] = useState('')
    const [version , setVersion] = useState('')
    const navigate = useNavigate()
    var link = `${ServerURL}${fileData}`;
    const relocationFileLength = relocationFile.filename.length


    const handleRelocationFile = (event) => {
        setRelocationShow(false);
        setRelocationFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }
    const handleSubmit = async () => {
        if (relocationFileLength > 0 && payloadType.length > 0) {
            setOpen(true)
            var formData = new FormData();
            formData.append('model_key', payloadType)
            formData.append('relocation_file', relocationFile.bytes)

            const response = await postData('IntegrationTracker/upload-relocation-excel/', formData)

            if (response) {
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response?.message}`,
                });

            } else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response?.message}`,
                });
            }
        }
        else {
            if (relocationFileLength === 0) {
                setRelocationShow(true)
            } else {
                setRelocationShow(false)
            }
            if (payloadType.length === 0) {
                setTypeShow(true)
            } else {
                setTypeShow(false)
            }
        }
    };

    const handleCancel = () => {
        setRelocationFile({ filename: "", bytes: "" })
        setPayloadType('')
    }

    useEffect(() => {
         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        const fetchDownloadTemp = async () => {
            const res = await getData('IntegrationTracker/relocation-template/')
            if (res) {
                setFileData(res.file_url)
                setVersion(res.template_version)
            }
        }
        fetchDownloadTemp()
    },[])


    return (

        <div>
            <Box style={{ margin: 10, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/Integration') }}>IX Tracker Tool</Link>
                    <Typography color='text.primary'>Relocation Upload File</Typography>
                </Breadcrumbs>
            </Box>
            <Box style={{ position: 'fixed', right: 20 }}>
                    <Box style={{ fontWeight: 'bolder',color:'green' }}>Template </Box>
                    <Tooltip title={`Download Temp.`}>
                        <a download href={link}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>
                        </a>
                    </Tooltip>
                </Box>

            <Box className={classes.main_Box}>
                <Box className={classes.Back_Box}>
                    <Box className={classes.Box_Hading}>
                        Relocation Upload File
                    </Box>
                    <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                        <Box className={classes.Front_Box}>
                            <Box className={classes.Front_Box_Hading}>
                                Select Traffic Inputs
                            </Box>
                            <Box className={classes.Front_Box_Select_Button} >
                                <FormControl sx={{minWidth: 200 }}>
                                    <InputLabel id="demo-simple-select-label">Select Traffic Inputs</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={payloadType}
                                        label="Select Traffic Input"
                                        onChange={(event) => { setPayloadType(event.target.value); setTypeShow(false) }}
                                    >
                                        <MenuItem value={'fixed_pre_traffic'}>Fixed Pre Traffic</MenuItem>
                                        <MenuItem value={'daily_pre_traffic'}>Daily Pre Traffic</MenuItem>
                                        <MenuItem value={'daily_post_traffic'}>Daily Post Traffic</MenuItem>

                                    </Select>
                                </FormControl>
                                <div>  <span style={{ display: typeShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                            </Box>
                        </Box>

                        <Box className={classes.Front_Box} id="step-2">
                            <div className={classes.Front_Box_Hading}>
                                Select Traffic File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{relocationFile.filename}</span>
                            </div>
                            <div className={classes.Front_Box_Select_Button}>
                                <div style={{ float: "left" }}>
                                    <Button variant="contained" component="label" color={relocationFile.state ? "warning" : "primary"}>
                                        select file
                                        <input required onChange={handleRelocationFile} hidden accept="/*" type="file" />
                                    </Button>
                                </div>
                                <div>  <span style={{ display: relocationShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                               
                            </div>
                        </Box>

                    </Stack>
                    <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                        <Box id="step-5">
                            <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                        </Box>
                        <Box >
                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                        </Box >
                    </Box>
                </Box>

            </Box>




        </div>

    )
}

export default RelocationUpload