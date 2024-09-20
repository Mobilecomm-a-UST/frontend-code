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

const NomAudit = () => {
    const [softAt, setSoftAt] = useState({ filename: "", bytes: "" })
    const [pdate, setPdate] = useState()
    const [fileData, setFileData] = useState()
    const [show, setShow] = useState(false)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const fileLength = softAt.filename.length
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;
    const [preFiles, setPreFiles] = useState([]);
    const [postFiles, setPostFiles] = useState([]);

    const handlePreFolderSelection = (event) => {
        // const selectedFiles = Array.from(event.target.files);
        // const filePaths = selectedFiles.map(file => file.webkitRelativePath);
        console.log('filePaths', event.target.files[0])
        setPreFiles(event.target.files);
    };
    const handlePostFolderSelection = (event) => {
        // const selectedFiles = Array.from(event.target.files);
        // const filePaths = selectedFiles.map(file => file.webkitRelativePath);
        console.log('post', event.target.files)
        setPostFiles(event.target.files);
    };

    const handlesoftAt = (event) => {
        setShow(false);
        setSoftAt({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })

    }

    const handleSubmit = async () => {
        if (preFiles.length > 0 && postFiles.length > 0) {
            setOpen(true)
            var formData = new FormData();
            for (let i = 0; i < preFiles.length(); i++) {
                    console.log('pre files' , preFiles[i])
                formData.append(`pre_files_${i}`, preFiles[i]);
            }
            for (let i = 0; i < postFiles.length(); i++) {
                console.log('post files' , postFiles[i])
                formData.append(`post_files_${i}`, postFiles[i]);
            }
            // formData.append("pre_files", preFiles);
            // formData.append("post_files",postFiles);

            const response = await postData('NOM_AUDIT/pre_post_audit_process/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })


            if (response.status === true) {
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                console.log('sssssssssssssssssssss', response)
                setOpen(true)
                setFileData(response.Download_url)

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
        setPreFiles([]);
        setPostFiles([]);
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
                        <Link underline="hover" href='/tools/nomenclature_scriptor'>Nomenclature Scriptor</Link>
                        <Typography color='text.primary'>Nomenclature Audit</Typography>
                    </Breadcrumbs>
                </div>
                {/* <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Download Soft-At Temp.">
                        <a download href={link}>
                            <Fab color="primary" aria-label="add" >
                                <DownloadIcon />
                            </Fab>
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
                                    Generate Nomenclature Audit
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Pre Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={preFiles.length > 0 ? "warning" : "primary"}>
                                                    select file
                                                    <input required hidden accept="/*" multiple type="file"
                                                        webkitdirectory="true"
                                                        directory="true"
                                                        onChange={handlePreFolderSelection} />
                                                </Button>
                                            </div>

                                            {preFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {preFiles.length}</span>}

                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </div>
                                    </Box>
                                    {/* post files */}
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Post Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={postFiles.length > 0 ? "warning" : "primary"}>
                                                    select file
                                                    <input required hidden accept="/*" multiple type="file"
                                                        webkitdirectory="true"
                                                        directory="true"
                                                        onChange={handlePostFolderSelection} />
                                                </Button>
                                            </div>

                                            {postFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {postFiles.length}</span>}

                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </div>
                                    </Box>



                                </Stack>
                                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                                </Stack>
                            </Box>
                            {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a> */}
                        </Box>
                        {loadingDialog()}
                    </Box>

                    {/* {handleError()} */}
                </Slide>

            </div>
        </>
    )
}

export default NomAudit