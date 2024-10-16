import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { getData, ServerURL } from "../../../services/FetchNodeServices";
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
import "driver.js/dist/driver.css";
import Fab from '@mui/material/Fab';
import Slide from '@mui/material/Slide';
import DownloadIcon from '@mui/icons-material/Download';
import { usePost } from "../../../Hooks/PostApis";
import CloseIcon from '@mui/icons-material/Close';

const Daily4G_KPI = () => {
    const { makePostRequest, cancelRequest } = usePost()
    const [rawKpiFile, setRawKpiFile] = useState({ filename: "", bytes: "" })
    const [open, setOpen] = useState(false);
    const [tableDialog, setTableDialog] = useState(false)
    const [rawShow, setRawShow] = useState(false)
    const [error, setError] = useState([])
    const [fileData, setFileData] = useState()
    const rawKpiLength = rawKpiFile.filename.length
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

    const handleSubmit = async () => {

        if (rawKpiLength > 0) {

            setOpen(true)
            var formData = new FormData();
            formData.append("4G_raw", rawKpiFile.bytes);
            const response = await makePostRequest('RCA_TOOL/Daily_RAW_KPI_4G/', formData)
            console.log('Daily4G kpi', response)
            if (response?.status) {
                setOpen(false);
                // setError(response.error_rows)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // if (response.error_rows.length > 0) {
                //     setTableDialog(true)
                // }
            }
            else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response?.message}`,
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
    const loadingDialog = useCallback(() => {
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
    },[cancelRequest, open])

    // display responce table data...............
    const displayTable = () => {
        return (
            <Dialog
                open={tableDialog}
                fullWidth
                maxWidth={'md'}
            >
                <DialogTitle><span style={{ color: 'red' }}>Record of the below employee could't be saved , because of below remarks</span><span style={{ float: 'right' }}><IconButton onClick={() => setTableDialog(false)}><CloseIcon></CloseIcon></IconButton></span></DialogTitle>
                <DialogContent>
                    <table border="3" style={{ width: "100%", border: "2px solid" }}>
                        <thead border="3">
                            <tr >
                                <th>Employee Code</th>
                                <th>Required Fields</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody align="center">
                            {
                                error?.map((item, index) => (
                                    <tr key={index} className={classes.tableRow}>
                                        <td>{item.emp_code.toUpperCase()}</td>
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
        // const fetchDownloadTemp = async () => {
        //     const res = await getData('employee_skills/template/', { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })

        //     if (res) {
        //         setFileData(res.file_url)
        //     }
        // }
        // fetchDownloadTemp();


        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    return (
        <>

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
                            <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                            <Typography color='text.primary'>Daily 4G KPI</Typography>
                        </Breadcrumbs>
                    </div>
                    {/* <Box style={{ position: 'fixed', right: 20 }}>
                        <Tooltip title="Skill set Temp.">
                            <a download href={link}>
                                <Fab color="primary" aria-label="add" >
                                    <DownloadIcon />
                                </Fab>
                            </a>
                        </Tooltip>
                    </Box> */}

                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box}>
                            <Box className={classes.Box_Hading}>
                                Upload Daily 4G KPI Report
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                                <Box className={classes.Front_Box} id="step-1">
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{rawKpiFile.filename}</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={rawKpiFile.state ? "warning" : "primary"}>
                                                select file
                                                <input required onChange={handleRawKpiFile} hidden accept=".xlsm,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple type="file" />
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
                    </Box>
                    {loadingDialog()}
                    {/* {displayTable()} */}
                </div>
            </Slide>
        </>
    )
}

export default Daily4G_KPI