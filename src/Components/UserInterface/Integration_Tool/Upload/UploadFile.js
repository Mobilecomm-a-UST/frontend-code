import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { getData, ServerURL, postDataa } from "../../../services/FetchNodeServices";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
// import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import DownloadIcon from '@mui/icons-material/Download';
import { usePost } from "../../../Hooks/PostApis";
import { getDecreyptedData } from "../../../utils/localstorage";

const UploadFile = () => {
    const { makePostRequest, cancelRequest } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [rawShow, setRawShow] = useState(false)
    const [fileData, setFileData] = useState()
    const rawKpiLength = rawKpiFile.filename.length
    const [tableDialog, setTableDialog] = useState(false)
    const [error, setError] = useState([])
    const [version, setVersion] = useState('')
    const classes = OverAllCss()
    const navigate = useNavigate()
    var link = `${ServerURL}${fileData}`;


    const handleRawKpiFile = (event) => {
        setRawShow(false);
        setRawKpiFile({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }


    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const handleSubmit = async () => {

        if (rawKpiLength > 0) {

            setOpen(true)
            var formData = new FormData();
            formData.append("file", rawKpiFile.bytes);
            try {
                const response = await postDataa(`IntegrationTracker/upload/`, formData);
                var result = await response
                setOpen(false);
                setError(result.error_rows)
                if (result.error_type) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops ...',
                        text: `${result.message}`
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        title: "Done",
                        text: `${result.message}`,
                    });
                }

                if (result.error_rows.length > 0) {
                    setTableDialog(true)
                }

            }
            catch (error) {
                console.log('error', error)
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.response.data.error}`,
                });

            }
        }
        else {
            if (rawKpiLength == 0) {
                setRawShow(true)
            }
        }
    };




    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"

            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    {/* <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box> */}
                    <Box style={{ textAlign: 'center' }}><img src="/assets/cloud-upload.gif" style={{ height: 200 }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }


    // display responce table data...............

    const displayTable = () => {
        return (
            <Dialog
                open={tableDialog}
                fullWidth
                maxWidth={'md'}
            >
                <DialogTitle><span style={{ color: 'red' }}>Below Record could not be saved because of the follow remarks.</span><span style={{ float: 'right' }}><IconButton onClick={() => setTableDialog(false)}><CloseIcon></CloseIcon></IconButton></span></DialogTitle>
                <DialogContent>
                    <table border="3" style={{ width: "100%", border: "2px solid" }}>
                        <thead border="3">
                            <tr >
                                <th>Unique Key</th>
                                <th>Required Fields</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody align="center">
                            {
                                error?.map((item, index) => (
                                    <tr key={index} className={classes.tableRow}>
                                        <td>{item.unique_key}</td>
                                        <td>{item.invalid_fields?.map(item => item + ' , ')}</td>
                                        <td>{item.remarks}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>

                </DialogContent>

            </Dialog>
        )
    }


    const handleCancel = () => {
        setRawKpiFile({ filename: "", bytes: "" })
    }


    useEffect(() => {
        const fetchDownloadTemp = async () => {
            const res = await getData('IntegrationTracker/template/', { headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` } })
            // console.log('temp. download link' , res)
            if (res) {
                setFileData(res.file_url)
                setVersion(res.template_version)
            }
            // console.log('temp. download link' , res)

        }

        fetchDownloadTemp();

    }, [])

    return (
        <Slide
            direction='left'
            in='true'
            // style={{ transformOrigin: '0 0 0' }}
            timeout={1000}
        >
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/Integration') }}>Integration Tracker</Link>
                        <Typography color='text.primary'>Upload File</Typography>
                    </Breadcrumbs>
                </div>

                <Box style={{ position: 'fixed', right: 20 }}>
                    <Box style={{ fontWeight: 'bolder', color: 'green' }}>Template :{version.toUpperCase()}</Box>
                    <Tooltip title={`Download ${version.toUpperCase()} Temp.`}>
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
                            Upload Integration Tracker File
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            <Box className={classes.Front_Box} id="step-1">
                                <div className={classes.Front_Box_Hading}>
                                    Select Integration Tracker {version.toUpperCase()} File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button}>
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                                            select file
                                            <input required onChange={handleRawKpiFile} hidden accept=".xlsm,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type="file" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: rawShow ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div>
                                    </div>
                                </div>
                            </Box>


                        </Stack>
                        <Box style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Box id="step-5">
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />} id='step-3'>upload</Button>
                            </Box>
                            <Box >
                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>
                            </Box >
                        </Box>
                    </Box>
                    {/* <Box style={{ display: dlink ? "inherit" : "none" }}>
          <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download KPI Trend</span></Button></a>
        </Box> */}



                </Box>
                {loadingDialog()}
                {displayTable()}
            </div>
        </Slide>
    )
}

export default UploadFile