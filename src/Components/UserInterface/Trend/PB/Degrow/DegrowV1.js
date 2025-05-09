import React, { useState, useEffect } from "react";
import { usePost } from '../../../../Hooks/PostApis'
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { ServerURL } from "../../../../services/FetchNodeServices";
import OverAllCss from "../../../../csss/OverAllCss";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Slide from '@mui/material/Slide';

const DegrowV1 = () => {
    const { makePostRequest, cancelRequest, } = usePost()
    const [pre, setPre] = useState({ filename: "", bytes: "" })
    const [post, setPost] = useState({ filename: "", bytes: "" })
    const [additional, setAdditional] = useState({ filename: "", bytes: "" })
    const [pdate, setPdate] = useState()
    const [fileData, setFileData] = useState()
    const [showPre, setShowPre] = useState(false)
    const [showPost, setShowPost] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [showDown, setShowDown] = useState(false)
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const AddfileLength = additional.filename.length
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;


    const handlepre = (event) => {
        setShowPre(false);
        setPre({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })
    }


    const handlePost = (event) => {
        setShowPost(false);
        setPost({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })

    }
    const handleAdd = (event) => {
        setShowAdd(false)
        setAdditional({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true
        })

    }

    const handleSubmit = async () => {
        if (pre.filename.length > 0 && post.filename.length > 0 && AddfileLength > 0) {
            setOpen(true)
            var formData = new FormData();

            formData.append('pre_file', pre.bytes);
            formData.append('post_file', post.bytes);
            formData.append('additional_inputs', additional.bytes)

            //   const response = await postData('Degrow_HR_V2/makeTrend/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
            const response = await makePostRequest('Degrow_PB_V1/makeTrend/', formData)
            console.log('response data', response)

            if (response.status === true) {
                setFileData(response.Download_url)
                setOpen(false)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                setShowDown(true)
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
            if (pre.filename === '') {
                setShowPre(true);

            }
            if (post.filename === '') {
                setShowPost(true);
            }
            if (AddfileLength === 0) {
                setShowAdd(true)
            }

        }
    };

    const handleCancel = () => {
        setPre({ filename: "", bytes: "" });
        setPost({ filename: "", bytes: "" });
        setAdditional({ filename: "", bytes: "" });
        var Preoutput = document.getElementById('fileList');
        var Postoutput = document.getElementById('secondList');
        Preoutput.innerHTML = '';
        Postoutput.innerHTML = '';

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
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }

    const pastDate = () => {
        var d = new Date();
        d.setDate(d.getDate() - 1);
        var month = '' + (d.getMonth() + 1)
        var day = '' + d.getDate()
        var year = d.getFullYear()
        // console.log('date----:',day)

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        setPdate([year, month, day].join('-'))
    }



    useEffect(() => {
        pastDate();
        // useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        // },[])

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
                    <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/trends'>Trend</Link>
                        <Link underline="hover" href='/trends/pb'>PB</Link>
                        <Typography color='text.primary'>Degrow V1</Typography>
                    </Breadcrumbs>
                </div>

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            MAKE DE-GROW TREND V1
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                            <Box className={classes.Front_Box} >
                                <div className={classes.Front_Box_Hading}>
                                    Select Pre Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{pre.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button} >
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={pre.state ? "warning" : "primary"}>
                                            select file
                                            <input type="file" required onChange={handlepre} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden multiple />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: showPre ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div></div>
                                </div>
                            </Box>
                            <Box className={classes.Front_Box} >
                                <div className={classes.Front_Box_Hading}>
                                    Select Post Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{post.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button} >
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={post.state ? "warning" : "primary"}>
                                            select file
                                            <input type="file" required onChange={handlePost} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" hidden multiple />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: showPost ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    <div></div>
                                </div>
                            </Box>
                            <Box className={classes.Front_Box} >
                                <div className={classes.Front_Box_Hading}>
                                    Additional Input File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{additional.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button} >
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={additional.state ? "warning" : "primary"}>
                                            select file
                                            <input type="file" required onChange={handleAdd} hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                        </Button>
                                    </div>
                                    <div>  <span style={{ display: showAdd ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>

                                </div>
                            </Box>



                        </Stack>
                        <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>
                            <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>upload</Button>

                            <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>



                        </Stack>
                    </Box>
                    <a download href={link} style={{ display: showDown ? 'inherit' : 'none' }}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Degrow Trend</span></Button></a>


                </Box>
                {loadingDialog()}



            </div>
        </Slide>
    )
}

export default DegrowV1