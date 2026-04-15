import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OverAllCss from "../../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../../Hooks/LoadingDialog";
import axios from "axios";
import { getDecreyptedData } from "../../../../utils/localstorage";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const Upload = () => {
    const [make4GFiles, setMake4GFiles] = useState({ filename: "", bytes: "" })
    const [selectCircle, setSelectCircle] = useState('')
    const [show4G, setShow4G] = useState(false)
    const [show, setShow] = useState(false)
    const [fileData, setFileData] = useState()
    const [download, setDownload] = useState(false);
    const { loading, action } = useLoadingDialog()
    const [year, setYear] = useState('')
    const navigate = useNavigate()
    const classes = OverAllCss()
    const userID = getDecreyptedData("userID")
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const link = `${ServerURL}${fileData}`;


    const handle4GFileSelection = (event) => {
        console.log('event target files', event)
        setShow4G(false);
        setMake4GFiles({
            filename: event.target.files[0].name,
            bytes: event.target.files[0],
            state: true

        })
    }

    const handleDownloadRelocation = async () => {
        try {
            action(true); // optional: show loader


            const response = await postData('alok_tracker/download_tracker_file/', { userId: userID, year: year });
            console.log('Download file response:', response);

            if (response?.download_link) {
                // ✅ Automatically trigger file download
                const link = document.createElement('a');
                link.href = response.download_link;
                link.setAttribute('download', '');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.warn('No download link found in response');
            }
        } catch (error) {
            console.error('Error downloading relocation file:', error);
        } finally {
            action(false); // stop loader
        }
    };




    // const handleSubmit = async () => {
    //     if (make4GFiles) {
    //         action(true)
    //         var formData = new FormData();
    //         formData.append(`tracker_file`, make4GFiles.bytes);
    //         formData.append(`userId`, userID);
    //         const response = await postData('alok_tracker/upload_file/', formData)
    //         // console.log('response data', response)
    //         if (response.status === true) {
    //             action(false)
    //             setDownload(true)
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Done",
    //                 text: `${response.message}`,
    //             });
    //             // console.log('sssssssssssssssssssss', response)
    //         } else {
    //             action(false)

    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Oops...",
    //                 text: `${response.message}`,
    //             });
    //         }
    //     }
    //     else {
    //         if (make4GFiles.length === 0) {
    //             setShow4G(true)
    //         } else {
    //             setShow4G(false)
    //         }



    //     }
    // }


    const dateFormat = (inputDate) => {
        if (!inputDate) return "";

        const date = new Date(inputDate);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }
    const handleSubmit = async () => {
        try {
            if (!make4GFiles || make4GFiles.length === 0) {
                setShow4G(true);
                return;
            }

            setShow4G(false);
            action(true);

            const formData = new FormData();
            formData.append("tracker_file", make4GFiles.bytes);
            formData.append("userId", userID);

            const response = await axios.post(`${ServerURL}/alok_tracker/upload_file/`,
                formData,
                {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                }
            );

            const data = response.data;

            if (data.status === true) {
                setDownload(true);
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: data.message,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.message,
                });
            }
        } catch (error) {
            console.error("Upload Error:", error);

            const errData = error.response?.data;

            if (errData) {
                const { error: errorMsg, details } = errData;

                Swal.fire({
                    icon: "error",
                    title: "Upload Failed",
                    html: `
                <p><b>Error:</b> ${errorMsg || "Unknown error"}</p>

        <p><b>Details:</b></p>
        <table style="width:100%; border-collapse: collapse; text-align:center;border: 1px solid black;">
            <tr style="border: 1px solid black;">
                <td style="padding:4px;"><b>Circle:</b></td>
                <td style="padding:4px;">${details?.circle || "-"}</td>
            </tr>
            <tr style="border: 1px solid black;">
                <td style="padding:4px;"><b>Site ID:</b></td>
                <td style="padding:4px;">${details?.new_site_id || "-"}</td>
            </tr>
            <tr style="border: 1px solid black;">
                <td style="padding:4px;"><b>Column:</b></td>
                <td style="padding:4px;">${details?.column || "-"}</td>
            </tr>
            <tr style="border: 1px solid black;">
                <td style="padding:4px;"><b>Value:</b></td>
                <td style="padding:4px;">${dateFormat(details?.value) || "-"}</td>
            </tr>
        </table>
            `,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong. Please try again!",
                });
            }
        } finally {
            action(false);
        }
    };

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
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>Upload File</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box>{!userTypes?.includes('RLT_reader') && <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            Upload Relocation File
                        </Box>
                        <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>


                            <Box className={classes.Front_Box} >
                                <div className={classes.Front_Box_Hading}>
                                    Select Excel Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{make4GFiles.filename}</span>
                                </div>
                                <div className={classes.Front_Box_Select_Button} >
                                    <div style={{ float: "left" }}>
                                        <Button variant="contained" component="label" color={make4GFiles.state > 0 ? "warning" : "primary"}>
                                            select file
                                            <input required hidden accept=".xlsx,.xls" multiple type="file"
                                                // webkitdirectory="true"
                                                // directory="true"
                                                onChange={(e) => handle4GFileSelection(e)} />
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
                </Box>}
                    <Box sx={{display:'flex',justifyContent:'center'}}>
                        <Box sx={{ textAlign: 'center', border: '0px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, padding: '10px', borderRadius: '5px', width: '78%',
                            boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'
                        }}>
                            <FormControl sx={{ minWidth: 150, maxWidth: 150 }} size="small">
                                <InputLabel id="year-select-label">Financial Year</InputLabel>
                                <Select
                                    labelId="year-select-label"
                                    id="year-select"
                                    value={year}
                                    label="Financial Year"
                                    onChange={(e) => setYear(e.target.value)}
                                >

                                    <MenuItem value=''>ALL</MenuItem>
                                    <MenuItem value='2026'>2026 - 2027</MenuItem>
                                    <MenuItem value='2025'>2025 - 2026</MenuItem>
                                    <MenuItem value='2024'>2024 - 2025</MenuItem>
                                    <MenuItem value='2023'>2023 - 2024</MenuItem>

                                </Select>
                            </FormControl>
                            <Button variant="outlined" onClick={() => handleDownloadRelocation()} title="Export Excel" size="small" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} ><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Relocation Tracking Data</span></Button>
                        </Box>
                    </Box>

                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default Upload