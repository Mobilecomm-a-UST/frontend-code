import React, { useState, useEffect, useCallback } from "react";
import {
    Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
} from "@mui/material";
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";


const Reference = () => {
    const [file4G, setFile4G] = useState({ filename: "", bytes: "" })
    const [file5G, setFile5G] = useState({ filename: "", bytes: "" })
    const [referenceFile, setReferenceFile] = useState({ filename: "", bytes: "" })
    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);
    const [showError, setShowError] = useState({
        // mobinate: false,
        G4: false,
        G5: false,
        ref: false,
    });

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const link = `${ServerURL}${fileData}`;




    const updateFile = (event, setFileState, errorKey) => {
        const file = event.target.files[0];
        if (file) {
            setShowError((prev) => ({ ...prev, [errorKey]: false }));
            setFileState({ filename: file.name, bytes: file });
        }
    };

    const handleSubmit = async () => {
        const isValid = file4G.filename && file5G.filename && referenceFile.filename;

        if (!isValid) {
            setShowError({
                // mobinate: mobinateDump.length === 0,
                G4: !file4G.filename,
                G5: !file5G.filename,
                ref: !referenceFile.filename,
            });
            return;
        }

        action(true);
        const formData = new FormData();
        // Array.from(mobinateDump).forEach((file) => {
        //   formData.append("log_files", file);
        // });
        formData.append("main_file_5G", file5G.bytes);
        formData.append("main_file_4G", file4G.bytes);
        formData.append("reference_file", referenceFile.bytes);

        const response = await postData("relocation_tracking/reference/", formData);
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
        // setMobinateDump([]);
        setFile4G({ filename: "", bytes: "" });
        setFile5G({ filename: "", bytes: "" });
        setReferenceFile({ filename: "", bytes: "" });
        setDownload(false);
        setShowError({ G4: false, G5: false, ref: false, });
    };

    useEffect(() => {
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
    }, []);
    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/relocation_payload_tracker")}>Relocation Payload Tracker</Link>
                    <Typography color="text.primary">Reference File</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Make Reference File</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>
                                {/* Mobinate Dump */}
                                {/* <UploadSection
                  label="Select Mobinet Dump Files"
                  color={mobinateDump.length > 0 ? "warning" : "primary"}
                  multiple
                  onChange={(e) => {
                    setMobinateDump(Array.from(e.target.files))
                    setShowError((prev) => ({ ...prev, mobinate: false }));
                  }}
                  error={showError.mobinate}
                  selectedText={mobinateDump.length > 0 ? `Selected File(s): ${mobinateDump.length}` : ""}
                /> */}


                                {/* 4G File*/}
                                <UploadSection
                                    label="Select 4G File"
                                    color={file4G.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setFile4G, "G4")}
                                    error={showError.G4}
                                    selectedText={file4G.filename}
                                />

                                {/* 5G File */}
                                <UploadSection
                                    label="Select 5G File"
                                    color={file5G.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setFile5G, "G5")}
                                    error={showError.G5}
                                    selectedText={file5G.filename}
                                />

                                {/* Reference File */}
                                <UploadSection
                                    label="Select Reference File"
                                    color={referenceFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setReferenceFile, "ref")}
                                    error={showError.ref}
                                    selectedText={referenceFile.filename}
                                />

                            </Stack>

                            <Stack
                                direction={{ xs: "column", md: "row" }}
                                spacing={2}
                                justifyContent="space-around"
                                mt={2}
                            >
                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
                                <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
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
                                    Reference Report
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

export default Reference