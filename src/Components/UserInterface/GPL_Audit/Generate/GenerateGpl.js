import React, { useState, useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Slide from '@mui/material/Slide';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


const steps = ['GPL PRE AUDIT', 'GPL PRE POST AUDIT', 'SCRIPT GENERATOR'];
const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TN', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'WB', 'JH']

const GenerateGpl = () => {
    const [softAt, setSoftAt] = useState({ filename: "", bytes: "" })
    const [preFiles, setPreFiles] = useState([]);
    const [postFiles, setPostFiles] = useState([]);
    const [gplPreAuditFiles, setGplPreAuditFiles] = useState([]);
    const [selectCircle, setSelectCircle] = useState('')
    const [selectService, setSelectService] = useState('')
    const [activeStep, setActiveStep] = useState(0);
    const [fileData, setFileData] = useState('')
    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const fileLength = softAt.filename.length
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;

    const handlesoftAt = (event) => {
        setShow(false);
        setSoftAt({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }

    const handleSubmit = async () => {
        if (selectCircle !== "" && selectService !== "") {
            setOpen(true)
            var formData = new FormData();
            formData.append("services", selectService);
            formData.append("circle", selectCircle);

            if (preFiles.length > 0 && postFiles.length > 0) {
                for (let i = 0; i < preFiles.length; i++) {
                    // console.log('pre files' , preFiles[i])
                    formData.append(`pre_audit_file`, preFiles[i]);
                }
                for (let i = 0; i < postFiles.length; i++) {
                    // console.log('post files' , postFiles[i])
                    formData.append(`post_log_files`, postFiles[i]);
                }
            } else if (gplPreAuditFiles.length > 0) {
                for (let i = 0; i < gplPreAuditFiles.length; i++) {
                    // console.log('pre files' , preFiles[i])           
                    formData.append(`pre_log_files`, gplPreAuditFiles[i]);
                }
            } else if (fileLength > 0) {
                formData.append("PRE_POST_AUDIT_FILE", softAt.bytes);
            }

            const response = await postData('gpl_audit/get_table_data/', formData)

            if (response) {
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // navigate('status')
                setFileData(response.download_url)

            } else {
                setOpen(false)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            setShow(true);
        }
    };

    const handleCancel = () => {
        setSoftAt({ filename: "", bytes: "" })
    }

    const handleFileClear = () => {
        setPostFiles([])
        setPreFiles([])
        setGplPreAuditFiles([])
        setSoftAt({ filename: "", bytes: "" })


    }

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}

                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box >DATA UNDER PROCESSING...</Box>
                </DialogContent>

            </Dialog>
        )
    }


    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])


    return (
        <>
            <div>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" onClick={() => navigate('/tools/gpl_audit')} >GPL Audit</Link>
                        <Typography color='text.primary'>Generate Script</Typography>
                    </Breadcrumbs>
                </div>
                {/* <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Download Soft-At Temp.">
                        <a download href={link}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>Qsd3zee   dswwddddddddeeeeeeeeeeeeeeeee
                        </a>
                    </Tooltip>
                </Box> */}



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
                                    Generate GPL Audit Script
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

                                    <Box className={classes.Front_Box}>
                                        <Box className={classes.Front_Box_Hading}>
                                            Select Services
                                        </Box>
                                        <Box className={classes.Front_Box_Select_Button} >
                                            <FormControl sx={{ minWidth: 150 }}>
                                                <InputLabel id="demo-simple-select-label">Select Service</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectService}
                                                    label="Select Service"
                                                    onChange={(event) => { setSelectService(event.target.value); handleFileClear(); }}
                                                >
                                                    <MenuItem value={'GPL PRE AUDIT'}>GPL PRE AUDIT</MenuItem>
                                                    <MenuItem value={'GPL PRE POST AUDIT'}>GPL PRE POST AUDIT</MenuItem>
                                                    <MenuItem value={'SCRIPT GENERATOR'}>SCRIPT GENERATOR</MenuItem>

                                                </Select>
                                            </FormControl>
                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </Box>

                                    </Box>
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

                                    {selectService === 'SCRIPT GENERATOR' && <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Pre Post Audit File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={softAt.state ? "warning" : "primary"}>
                                                    select file
                                                    <input required onChange={handlesoftAt} hidden accept="/*" multiple type="file" />
                                                </Button>
                                            </div>
                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                            <div></div>
                                        </div>
                                    </Box>}

                                    {selectService === 'GPL PRE AUDIT' && <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Gpl Pre Logs File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={gplPreAuditFiles.length > 0 ? "warning" : "primary"}>
                                                    select file
                                                    <input required onChange={(event) => setGplPreAuditFiles(event.target.files)} hidden accept="/*" multiple type="file" />
                                                </Button>
                                            </div>
                                            {gplPreAuditFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {gplPreAuditFiles.length}</span>}
                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                                        </div>
                                    </Box>}

                                    {selectService === 'GPL PRE POST AUDIT' && <>
                                        <Box className={classes.Front_Box} >
                                            <div className={classes.Front_Box_Hading}>
                                                Select Pre Audit File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                                            </div>
                                            <div className={classes.Front_Box_Select_Button} >
                                                <div style={{ float: "left" }}>
                                                    <Button variant="contained" component="label" color={preFiles.length > 0 ? "warning" : "primary"}>
                                                        select file
                                                        <input required onChange={(event) => setPreFiles(event.target.files)} hidden accept="/*" multiple type="file" />
                                                    </Button>
                                                </div>
                                                {preFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {preFiles.length}</span>}
                                                <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                                            </div>
                                        </Box>

                                        <Box className={classes.Front_Box} >
                                            <div className={classes.Front_Box_Hading}>
                                                Select Post Logs Audit File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                                            </div>
                                            <div className={classes.Front_Box_Select_Button} >
                                                <div style={{ float: "left" }}>
                                                    <Button variant="contained" component="label" color={postFiles.length > 0 ? "warning" : "primary"}>
                                                        select file
                                                        <input required onChange={(event) => setPostFiles(event.target.files)} hidden accept="/*" multiple type="file" />
                                                    </Button>
                                                </div>

                                                {postFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {postFiles.length}</span>}
                                                <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                                            </div>
                                        </Box>
                                    </>}




                                </Stack>
                                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >clear</Button>

                                </Stack>
                            </Box>

                            <Box sx={{ display: fileData.length > 0 ? 'block' : 'none' }}>
                                <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Script</span></Button></a>
                            </Box>

                        </Box>
                        {loadingDialog()}
                    </Box>

                    {/* {handleError()} */}
                </Slide>

            </div>
        </>
    )
}

export default GenerateGpl