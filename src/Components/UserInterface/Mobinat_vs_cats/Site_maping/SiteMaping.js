import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import TopicIcon from '@mui/icons-material/Topic';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const SiteMaping = () => {
    const [mobinateDump, setMobinateDump] = useState({ filename: "", bytes: "" });
    const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
    const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
    const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
    // const [rfsFile, setRfsFile] = useState({ filename: "", bytes: "" });
    // const [msmfFile, setMsmfFile] = useState({ filename: '', bytes: '' });
    // const [stockFile, setStockFile] = useState({ filename: '', bytes: '' })
    // const [locaterFiles, setLocaterFiles] = useState([])
    const [fileData1, setFileData1] = useState();
    const [download1, setDownload1] = useState(false);
    const [fileData2, setFileData2] = useState();
    const [download2, setDownload2] = useState(false);
    const [showFiles, setShoweFiles] = useState({ locator: [], stock: [], msmf: [], rfs: [] })
    const [alignment, setAlignment] = useState('left');

    const [showError, setShowError] = useState({
        mobinate: false,
        siteList: false,
        hardware: false,
        olmId: false,
        // rfs: false,
        // msmf: false,
        // stock: false,
        // locater: false
    });

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();



    const updateFile = (event, setFileState, errorKey) => {
        const file = event.target.files[0];
        if (file) {
            setShowError((prev) => ({ ...prev, [errorKey]: false }));
            setFileState({ filename: file.name, bytes: file });
        }
    };

    const fetchMobinetFileData = async () => {
        action(true)

        const response1 = await getData('mobinate_vs_cats/rfs/');
        const response2 = await getData('mobinate_vs_cats/msmf/');
        const response3 = await getData('mobinate_vs_cats/stock/');
        const response4 = await getData('mobinate_vs_cats/locator/');

        if (response4.status) {
            action(false);
            // setShoweFiles(response.files);
            setShoweFiles({
                locator: response4?.files ? response4?.files : [],
                stock: response3?.files ? response3?.files : [],
                msmf: response2?.files ? response2?.files : [],
                rfs: response1?.files ? response1?.files : []
            })

        }

    }

    const handleSubmit1 = async () => {
        const isValid =
            hardWareFile.filename &&
            olmidFile.filename;
      

        if (!isValid) {
            setShowError({
                hardware: !hardWareFile.filename,
                olmId: !olmidFile.filename,
            });
            return;
        }
        action(true);
        const formData = new FormData();
        // locaterFiles.forEach((file) => formData.append("locator_file", file));
        // Array.from(locaterFiles).forEach((file) => {
        //   formData.append("locator_file", file);
        // });
        formData.append("hw", hardWareFile.bytes);
        formData.append("olm", olmidFile.bytes);
        // formData.append("rfs_file", rfsFile.bytes);
        // formData.append("msmf_file", msmfFile.bytes);
        // formData.append("stock_report_file", stockFile.bytes)

        const response = await postData("mobinate_vs_cats/rfs_site_mapping/", formData);
        action(false);
        console.log('responce' , response)

        if (response.status) {
            setDownload1(true);
            setFileData1(response.download_url);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    };
     const handleSubmit2 = async () => {
        const isValid =
            hardWareFile.filename &&
            olmidFile.filename;
      

        if (!isValid) {
            setShowError({
                hardware: !hardWareFile.filename,
                olmId: !olmidFile.filename,
            });
            return;
        }
        action(true);
        const formData = new FormData();
        // locaterFiles.forEach((file) => formData.append("locator_file", file));
        // Array.from(locaterFiles).forEach((file) => {
        //   formData.append("locator_file", file);
        // });
        formData.append("hw", hardWareFile.bytes);
        formData.append("olm", olmidFile.bytes);
        // formData.append("rfs_file", rfsFile.bytes);
        // formData.append("msmf_file", msmfFile.bytes);
        // formData.append("stock_report_file", stockFile.bytes)

        const response = await postData("mobinate_vs_cats/ms_mf_site_mapping/", formData);
        action(false);

        if (response.status) {
            setDownload2(true);
            setFileData2(response.download_url);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    };

    const handleCancel = () => {
        setHardWareFile({ filename: "", bytes: "" });
        setOlmidFile({ filename: "", bytes: "" });
        setDownload1(false);
        setDownload2(false)
        setShowError({ mobinate: false, siteList: false, hardware: false });
    };

    const handleAlignment = (event,newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };

    useEffect(() => {
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
        fetchMobinetFileData()
    }, []);
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>Mobinet Vs CATS</Link>
                    <Typography color="text.primary">Site Mapping</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Site Mapping RFS & MS-MF</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>
                                {/* Mobinate Dump */}
                                {/* <UploadSection
                  label="Select Mobinet Tool Files"
                  color={mobinateDump.filename ? "warning" : "primary"}
                  // multiple
                  // onChange={(e) => {
                  //   setMobinateDump(e.target.files[0]);
                  //   setShowError((prev) => ({ ...prev, mobinate: false }));
                  // }}
                  onChange={(e) => updateFile(e, setMobinateDump, "mobinateDump")}
                  error={showError.mobinate}
                  selectedText={mobinateDump.filename}
                /> */}

                                {/* Site List */}
                                {/* <UploadSection
                  label="Select Site List File"
                  color={siteList.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setSiteList, "siteList")}
                  error={showError.siteList}
                  selectedText={siteList.filename}
                /> */}

                                {/* Hardware File */}
                                <UploadSection
                                    label="Select Hardware File"
                                    color={hardWareFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                                    error={showError.hardware}
                                    selectedText={hardWareFile.filename}
                                />

                                {/* OLM ID File */}
                                <UploadSection
                                    label="Select OLM ID File"
                                    color={olmidFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setOlmidFile, "olmidFile")}
                                    error={showError.olmId}
                                    selectedText={olmidFile.filename}
                                />

                                <Box className={OverAllCss().Front_Box}>
                                    <div className={OverAllCss().Front_Box_Hading}>
                                        <ToggleButtonGroup
                                            value={alignment}
                                            exclusive
                                            onChange={handleAlignment}
                                            aria-label="text alignment"
                                        >
                                            <ToggleButton value="left" aria-label="left aligned">
                                                <Box sx={{fontWeight:'bold'}}>RFS</Box>
                                            </ToggleButton>
                                            <ToggleButton value="right" aria-label="right aligned">
                                                <Box sx={{fontWeight:'bold'}}>MS-MF</Box>
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </div>
                                </Box>


                                {/* RFS File */}
                                {/* <UploadSection
                  label="Select RFS File"
                  color={rfsFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setRfsFile, "rfsFile")}
                  error={showError.olmId}
                  selectedText={rfsFile.filename}
                /> */}

                {alignment==='left'? <Box className={OverAllCss().Front_Box}>
                                    <div className={OverAllCss().Front_Box_Hading}>RFS File :</div>
                                    <div className={OverAllCss().Front_Box_Select_Button}>
                                        <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                                            {showFiles?.rfs.map((item, index) => (
                                                <Grid item xs={6} key={index}>
                                                    <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                                                        <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </div>
                                </Box>: <Box className={OverAllCss().Front_Box}>
                                    <div className={OverAllCss().Front_Box_Hading}>MS-MF File :</div>
                                    <div className={OverAllCss().Front_Box_Select_Button}>
                                        <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                                            {showFiles?.msmf.map((item, index) => (
                                                <Grid item xs={6} key={index}>
                                                    <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                                                        <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </div>
                                </Box>}
                               


                                {/* MS-MF File */}
                                {/* <UploadSection
                  label="Select MS-MF File"
                  color={msmfFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setMsmfFile, "msmfFile")}
                  error={showError.olmId}
                  selectedText={msmfFile.filename}
                /> */}

                               
                                {/* Stock File */}
                                {/* <UploadSection
                  label="Select Stock File"
                  color={stockFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setStockFile, "stockFile")}
                  error={showError.olmId}
                  selectedText={stockFile.filename}
                /> */}
                                {/* <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>Stock File :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                      {showFiles?.stock.map((item, index) => (
                        <Grid item xs={6} key={index}>
                          <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} />{item}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Box> */}

                                {/* Locater files Dump */}
                                {/* <UploadSection
                  label="Select Locator Files"
                  color={locaterFiles.length > 0 ? "warning" : "primary"}
                  multiple
                  onChange={(e) => {
                    // setLocaterFiles(e.target.files);
                    setLocaterFiles(Array.from(e.target.files))
                    setShowError((prev) => ({ ...prev, locater: false }));
                  }}
                  error={showError.mobinate}
                  selectedText={locaterFiles.length > 0 ? `Selected File(s): ${locaterFiles.length}` : ""}
                /> */}
                                <Box className={OverAllCss().Front_Box}>
                                    <div className={OverAllCss().Front_Box_Hading}>Locator Files :</div>
                                    <div className={OverAllCss().Front_Box_Select_Button}>
                                        <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                                            {showFiles?.locator.map((item, index) => (
                                                <Grid item xs={6} key={index}>
                                                    <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                                                        <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>

                                    </div>
                                </Box>

                            </Stack>

                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                justifyContent="space-around"
                                mt={2}
                            >
                                {alignment==='left'?<Button variant="contained" color="success" onClick={handleSubmit1} endIcon={<UploadIcon />}>Submit</Button>:<Button variant="contained" color="success" onClick={handleSubmit2} endIcon={<UploadIcon />}>Submit</Button>}
                                
                                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
                            </Stack>
                        </Box>
                    </Box>

                    {download1 && (
                        <Box textAlign="center">
                            <a href={fileData1} download>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                                    sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                                >
                                    RFS Site Mapping Report
                                </Button>
                            </a>
                        </Box>
                    )}
                     {download2 && (
                        <Box textAlign="center">
                            <a href={fileData2} download>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                                    sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                                >
                                    MS-MF Site Mapping Report
                                </Button>
                            </a>
                        </Box>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    )
}

const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
    return (
        <Box className={OverAllCss().Front_Box}>
            <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
            <div className={OverAllCss().Front_Box_Select_Button}>
                <Button variant="contained" component="label" color={color}>
                    Select File
                    <input
                        hidden
                        required
                        type="file"
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        multiple={multiple}
                        onChange={onChange}
                    />
                </Button>
                {selectedText && (
                    <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
                        {selectedText}
                    </span>
                )}
                {error && (
                    <div>
                        <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
                    </div>
                )}
            </div>
        </Box>
    );
};

export default SiteMaping