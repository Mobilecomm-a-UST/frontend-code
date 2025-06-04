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


const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TN', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'WB', 'JH']

const ScriptGen = () => {
    const [make4GFiles, setMake4GFiles] = useState([])
    const [selectCircle, setSelectCircle] = useState('')
    const [show4G, setShow4G] = useState(false)
    const [show, setShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [download, setDownload] = useState(false);
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const classes = OverAllCss()
    const link = `${ServerURL}${fileData}`;


    const handle4GFileSelection = (event) => {

        setMake4GFiles(event.target.files)
    }




    const handleSubmit = async () => {
        if (make4GFiles.length > 0 && selectCircle !== '') {
            action(true)
            var formData = new FormData();
            for (let i = 0; i < make4GFiles.length; i++) {
                formData.append(`integration_input_file`, make4GFiles[i]);
            }
            formData.append(`Circle`, selectCircle);
        
            const response = await postData('LTE/Intigration/generating_scripts/', formData)

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
                // console.log('sssssssssssssssssssss', response)



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
            if(selectCircle === '') {
                setShow(true)
            } else {
                setShow(false)
            }   
          
            
        }
    }

    const handleCancel = () => {
        setMake4GFiles([])
        setShow4G(false)
        setSelectCircle('')
        setShow(false)
       

    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/mobile_network_integration') }}>MNI TOOL</Link>
                    <Typography color='text.primary'>Script Generater</Typography>
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
                                Script Generater
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

                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select RF Data Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx" multiple type="file"
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
                        <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Pre Post Audit Report</span></Button></a>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default ScriptGen