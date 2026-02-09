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


const Upload = () => {
    const [make4GFiles, setMake4GFiles] = useState({ filename: "", bytes: "" })
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
        // console.log('event target files', event)
        setShow4G(false);
        setMake4GFiles({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }






    const handleSubmit = async () => {
        if (make4GFiles.filename.length > 0) {
            action(true)
            var formData = new FormData();
            formData.append(`xml_file`, make4GFiles.bytes);
            const response = await postData('nokia/slicing/', formData)
            console.log('response data', response)
            if (response.status === true) {
                action(false)
                setDownload(true)
                setFileData(response.download_url)
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
            if (make4GFiles.filename.length === 0) {
                setShow4G(true)
            } else {
                setShow4G(false)
            }



        }
    }

    const handleCancel = () => {
        setMake4GFiles({ filename: "", bytes: "" })
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
                    <Link underline='hover' onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Link underline='hover' onClick={() => { navigate('/tools/ix_tools/sa_slicing') }}>SA Slicing</Link>
                    <Typography color='text.primary'>XML Upload</Typography>
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
                                Upload XML for SA Slicing
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>


                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select XML Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{make4GFiles.filename}</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.state > 0 ? "warning" : "primary"}>
                                                select file
                                                <input
                                                    required
                                                    hidden
                                                    type="file"
                                                    accept=".xml"
                                                    onChange={(e) => handle4GFileSelection(e)}
                                                />
                                            </Button>
                                        </div>

                                        {/* {make4GFiles.state > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>{make4GFiles.filename}</span>} */}

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

                    <Box sx={{ textAlign: 'center', display: download ? 'block' : 'none' }}>
                        <Button
                            component="a"
                            href={fileData}
                            download
                            // target="_blank"
                            // rel="noopener noreferrer"
                            variant="outlined"
                            title="Export Excel"
                            startIcon={
                                <FileDownloadIcon style={{ fontSize: 30, color: "green" }} />
                            }
                            sx={{ mt: 1, width: "auto" }}
                        >
                            <span
                                style={{
                                    fontFamily: "Poppins",
                                    fontSize: "22px",
                                    fontWeight: 800,
                                    textTransform: "none",
                                    textDecoration: "none"
                                }}
                            >
                                Download SA Slicing Report
                            </span>
                        </Button>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default Upload