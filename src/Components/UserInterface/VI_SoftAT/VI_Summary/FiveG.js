import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

// ─────────────────────────────────────────────────────────────────────────────
// API contract (vi_summary/vi_summary_4g/):
//   request:  FormData with key "file" (one or more files) + key "circle"
//   response: {
//     status: true,
//     message: "Files generated successfully",
//     download_url1: ".../Reference_Data_4G.xlsx",
//     download_url2: ".../INVENTORY_Data_4G.xlsx",
//     download_url3: ".../RAN_UIM_BTS_data_4G.xlsx",
//   }
// ─────────────────────────────────────────────────────────────────────────────

const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'WB', 'JH']

const DOWNLOAD_LABELS = {
    download_url1: "Reference Data 5G",
    
};

const FiveG = () => {
    const [make4GFiles, setMake4GFiles] = useState([])
    const [selectCircle, setSelectCircle] = useState('')
    const [show4G, setShow4G] = useState(false)
    const [show, setShow] = useState(false)
    const [downloadLinks, setDownloadLinks] = useState(null) // { download_url1, download_url2, download_url3 }
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const classes = OverAllCss()

    const handle4GFileSelection = (event) => {
        setMake4GFiles(event.target.files)
    }

    const handleSubmit = async () => {
        if (make4GFiles.length > 0 && selectCircle !== '') {
            action(true)
            const formData = new FormData();
            formData.append('circle', selectCircle)
            for (let i = 0; i < make4GFiles.length; i++) {
                formData.append('file', make4GFiles[i]);
            }

            const response = await postData('vi_summary/vi_summary_5g/', formData)

            if (response?.status === true) {
                action(false)
                setDownloadLinks({
                    download_url1: response.download_url1
                    
                })
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
                    text: `${response?.message || "Something went wrong"}`,
                });
            }
        } else {
            if (make4GFiles.length === 0) {
                setShow4G(true)
            } else {
                setShow4G(false)
            }
            if (selectCircle === '') {
                setShow(true)
            } else {
                setShow(false)
            }
        }
    }

    const handleCancel = () => {
        setMake4GFiles([])
        setSelectCircle('')
        setShow4G(false)
        setShow(false)
        setDownloadLinks(null)
    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>VI Soft-AT Tool</Link>
                    <Typography color='text.primary'>5G Summary</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in='true'
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                Generate 5G Summary
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
                                        Select Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept="/*" multiple type="file"
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

                    {/* Three download links, shown once the backend returns them */}
                    {downloadLinks && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}
                        >
                            {Object.entries(downloadLinks).map(([key, url]) => (
                                url ? (
                                    <a key={key} download href={url} target="_blank" rel="noreferrer">
                                        <Button
                                            variant="outlined"
                                            startIcon={<FileDownloadIcon style={{ fontSize: 26, color: "green" }} />}
                                            sx={{ width: "auto" }}
                                        >
                                            <span style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 700, textTransform: "none" }}>
                                                {DOWNLOAD_LABELS[key] || key}
                                            </span>
                                        </Button>
                                    </a>
                                ) : null
                            ))}
                        </Stack>
                    )}
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default FiveG