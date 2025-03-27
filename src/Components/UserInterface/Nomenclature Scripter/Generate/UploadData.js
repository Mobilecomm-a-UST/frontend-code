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

const UploadData = () => {
    const [softAt, setSoftAt] = useState({ filename: "", bytes: "" })
    const [pdate, setPdate] = useState()
    const [fileData, setFileData] = useState()
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
        if (fileLength > 0) {
            setOpen(true)
            var formData = new FormData();
            formData.append("planned_site_file", softAt.bytes);

            const response = await postData('nomenclature_scriptor/generate_script', formData)
         

            if (response.status === true) {
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // navigate('status')
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
        // pastDate();
        // handleDownload();
        // useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

        //  },[])
    }, [])

    return (
        <>
            <div>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/tools/nomenclature_scriptor'>Nomenclature Scriptor</Link>
                        <Typography color='text.primary'>Generate Script</Typography>
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
                                     Generate Nomenclature Script
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Planned Site File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{softAt.filename}</span>
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

export default UploadData