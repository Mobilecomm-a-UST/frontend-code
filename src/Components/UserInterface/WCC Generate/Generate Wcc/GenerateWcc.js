import React, { useState, useEffect } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
} from "@mui/material";
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

const GenerateWcc = () => {

    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);
    const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
    const [showFiles, setShowFiles] = useState({

        addressmaster: [],
        projectdata: []
    });

    const [showError, setShowError] = useState({
        addressmaster: false,
        projectdata: false
        

    });
    const updateFile = (event, setFileState, errorKey) => {
        const file = event.target.files[0];
        if (file) {
            setShowError((prev) => ({ ...prev, [errorKey]: false }));
            setFileState({ filename: file.name, bytes: file });
        }
    };

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const link = `${ServerURL}${fileData}`;

    // -------- Fetch Files ---------
    const fetchMobinetFileData = async () => {
        action(true);
        const addressmaster = await getData('wcc/upload_Add_master/');
        const projectdata = await getData('wcc/upload_Project_Data/');
        


        action(false);

        setShowFiles({

            addressmaster: addressmaster?.files || [],
            projectdata: projectdata?.files || [],
           

        });
    };

    // -------- Submit ----------
    const handleSubmit = async () => {
        const errors = {
            addressmaster: showFiles.addressmaster.length === 0,
            projectdata: showFiles.projectdata.length === 0,
           
        };

        setShowError(errors);

        const isValid = Object.values(errors).every((item) => item === false);

        if (!isValid) return;

        action(true);
         const formData = new FormData();

        formData.append("hw", hardWareFile.bytes);
        const response = await postData("wcc/forward_material_reconciliation/",formData);
        action(false);

        if (response.status) {
            setDownload(true);
            setFileData(response.download_url);
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    };

    const handleCancel = () => {
        setDownload(false);
        setShowError({ mobinate: false, mbf: false, tod: false, locator: false });
    };

    useEffect(() => {
        document.title = "SN MAPPING";
        fetchMobinetFileData();
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/wcc_generate")}>
                        Wcc Generate
                    </Link>
                    <Typography color="text.primary">Generate WCC</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Generate WCC</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                <UploadSection
                                    label="Select Circle Data"
                                    color={hardWareFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                                    error={showError.hardware}
                                    selectedText={hardWareFile.filename}
                                />

                                {/* Mobinate Dump */}


                                <FileBox
                                    title="Address Master"
                                    data={showFiles.addressmaster}
                                    error={showError.addressmaster}
                                />

                                {/* Locator */}
                                <FileBox
                                    title="Project Data"
                                    data={showFiles.projectdata}
                                    error={showError.projectdata}
                                />

                                {/* MBF */}
                                {/* <FileBox
                                    title="Mobinet Baseline File"
                                    data={showFiles.mbf}
                                    error={showError.mbf}
                                /> */}

                                {/* TOD */}
                                {/* <FileBox
                                    title="Tod File"
                                    data={showFiles.tod}
                                    error={showError.tod}
                                /> */}

                            </Stack>

                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                justifyContent="space-around"
                                mt={2}
                            >
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>
                                    Submit
                                </Button>

                                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }}
                                    endIcon={<DoDisturbIcon />}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    {download && (
                        <Box textAlign="center">
                            <a href={fileData} download>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                                    sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                                >
                                  WCC Generate Report
                                </Button>
                            </a>
                        </Box>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    );
};

const FileBox = ({ title, data, error }) => (
    <Box className={OverAllCss().Front_Box}>
        <div className={OverAllCss().Front_Box_Hading}>{title}:</div>

        <div className={OverAllCss().Front_Box_Select_Button}>
            <Grid container rowSpacing={1} columnSpacing={1}>
                {(data || []).map((item, index) => (
                    <Grid item xs={4} key={index}>
                        <Box sx={{ display: "flex", alignItems: "center", fontWeight: 'bold' }}>
                            <TopicIcon sx={{ color: '#FEA405' }} /> {item}
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {error && (
                <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
            )}
        </div>
    </Box>
);

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


export default GenerateWcc;
