import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack, Chip } from "@mui/material";
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


const MP_gpl_macro = () => {
    // selectedFiles: [{ id, name, file }]
    const [selectedFiles, setSelectedFiles] = useState([])
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
        const newFiles = Array.from(event.target.files || []);
        if (newFiles.length === 0) return;

        setShow4G(false);
        setSelectedFiles((prev) => {
            // avoid adding the same file (by name + size) twice
            const existingKeys = new Set(prev.map((f) => `${f.name}_${f.file.size}`));
            const merged = [...prev];
            newFiles.forEach((file) => {
                const key = `${file.name}_${file.size}`;
                if (!existingKeys.has(key)) {
                    merged.push({ id: `${key}_${Date.now()}_${Math.random()}`, name: file.name, file });
                    existingKeys.add(key);
                }
            });
            return merged;
        });

        // allow re-selecting the same file again later
        event.target.value = "";
    }

    const handleRemoveFile = (id) => {
        setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
    }



    const handleSubmit = async () => {
        if (selectedFiles.length > 0) {
            action(true)
            var formData = new FormData();
            selectedFiles.forEach((f) => {
                formData.append(`xml_file`, f.file);
            });
            const response = await postData('mp_macro/mp_slicing/', formData)
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
            setShow4G(true)
        }
    }

    const handleCancel = () => {
        setSelectedFiles([])
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
                    <Link underline='hover' onClick={() => { navigate('/tools/ix_tools/sa_slicing') }}>5G GPL</Link>
                    <Typography color='text.primary'>MP GPL Macro</Typography>
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
                                Upload GPL for MP
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>


                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select XML Files:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={selectedFiles.length > 0 ? "warning" : "primary"}>
                                                select files
                                                <input
                                                    required
                                                    hidden
                                                    multiple
                                                    type="file"
                                                    accept=".xml"
                                                    onChange={(e) => handle4GFileSelection(e)}
                                                />
                                            </Button>
                                        </div>

                                        <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ marginTop: 2 }}>
                                            {selectedFiles.map((f) => (
                                                <Chip
                                                    key={f.id}
                                                    label={f.name}
                                                    onDelete={() => handleRemoveFile(f.id)}
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontFamily: 'Poppins' }}
                                                />
                                            ))}
                                        </Stack>
                                    )}
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
                                Download MP GPL Macro Report
                            </span>
                        </Button>
                    </Box>
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default MP_gpl_macro