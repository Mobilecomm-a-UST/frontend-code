// import React, { useState, useEffect, useCallback } from "react";
// import {
//     Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
// } from "@mui/material";
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import TopicIcon from '@mui/icons-material/Topic';
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const LiveMobReco = () => {
//     const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
//     const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
//     const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
//     const [recoFile, setRecoFile] = useState({ filename: "", bytes: "" }); // ✅ NEW
//     const [fileData, setFileData] = useState();
//     const [fileData1, setFileData1] = useState();
//     const [download, setDownload] = useState(false);


//     const [showFiles, setShoweFiles] = useState({

//         mobinetDump: [],

//     });

//     const [showError, setShowError] = useState({

//         recoFile: false, // ✅ NEW
//     });

//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     const link = `${ServerURL}${fileData}`;
//     const link1 = `${ServerURL}${fileData1}`;

//     const updateFile = (event, setFileState, errorKey) => {
//         const file = event.target.files[0];
//         if (file) {
//             setShowError((prev) => ({ ...prev, [errorKey]: false }));
//             setFileState({ filename: file.name, bytes: file });
//         }
//     };

//     const fetchMobinetFileData = async () => {
//         action(true);

//         const response5 = await getData('mobinate_vs_cats/mobinet_livein');

//         action(false);

//         setShoweFiles({

//             mobinetDump: response5?.files || [],

//         });
//     };

//     const handleSubmit = async () => {
//         const isValid =

//             recoFile.filename; // ✅ NEW validation

//         if (!isValid) {
//             setShowError({

//                 recoFile: !recoFile.filename, // ✅ NEW
//             });
//             return;
//         }

//         action(true);
//         const formData = new FormData();

//         formData.append("reco_file", recoFile.bytes); // ✅ NEW

//         const response = await postData("mobinate_vs_cats/live_in_mob/", formData);
//         action(false);

//         if (response.status) {
//             setDownload(true);
//             setFileData(response.download_url);
//              setFileData1(response.download_url1); 
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//         }
//     };

//     const handleCancel = () => {

//         setRecoFile({ filename: "", bytes: "" }); // ✅ NEW
//         setDownload(false);
//         setShowError({ siteList: false, hardware: false, recoFile: false }); // ✅ NEW
//     };

//     useEffect(() => {
//         const title = window.location.pathname
//             .slice(1)
//             .replaceAll("_", " ")
//             .replaceAll("/", " | ")
//             .toUpperCase();
//         document.title = title;
//         fetchMobinetFileData();
//     }, []);

//     return (
//         <>
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>Mobinet Vs CATS</Link>
//                     <Typography color="text.primary">Live Mob Reco</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Live Mob Reco</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 {/* Mobinet Dump Files — read-only list */}
//                                 <Box className={OverAllCss().Front_Box}>
//                                     <div className={OverAllCss().Front_Box_Hading}>Live In Mobinet Dump Files:</div>
//                                     <div className={OverAllCss().Front_Box_Select_Button}>
//                                         {showFiles?.mobinetDump.length > 0 ? (
//                                             <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                                                 {showFiles?.mobinetDump.map((item, index) => (
//                                                     <Grid item xs={6} key={index}>
//                                                         <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontWeight: "bold" }}>
//                                                             <TopicIcon sx={{ color: "#FEA405" }} />{item}
//                                                         </Box>
//                                                     </Grid>
//                                                 ))}
//                                             </Grid>
//                                         ) : (
//                                             <Typography color="gray" fontSize={14}>No files found.</Typography>
//                                         )}
//                                     </div>
//                                 </Box>

//                                 {/* Site List */}

//                                 {/* ✅ NEW: Reco File upload */}
//                                 <UploadSection
//                                     label="Select Reco File"
//                                     color={recoFile.filename ? "warning" : "primary"}
//                                     onChange={(e) => updateFile(e, setRecoFile, "recoFile")}
//                                     error={showError.recoFile}
//                                     selectedText={recoFile.filename}
//                                 />

//                                 {/* ✅ REMOVED: RFS File, MS-MF File, Locator Files, MO VS CAP File */}

//                             </Stack>

//                             <Stack
//                                 direction={{ xs: "column", md: "row" }}
//                                 spacing={2}
//                                 justifyContent="space-around"
//                                 mt={2}
//                             >
//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                                 <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//                             </Stack>
//                         </Box>
//                     </Box>

//                     {download && (
//                         <Box textAlign="center">
//                             <a href={fileData} download>
//                                 <Button
//                                     variant="outlined"
//                                     startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
//                                     sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
//                                 >
//                                     Live In Mobinet Summary Report
//                                 </Button>
//                             </a>

//                             {fileData1 && (
//                                 <a href={fileData1} download>
//                                     <Button
//                                         variant="outlined"
//                                         startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
//                                         sx={{ textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
//                                     >
//                                         Live In Mobinet Data Report
//                                     </Button>
//                                 </a>
//                             )}
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
//     return (
//         <Box className={OverAllCss().Front_Box}>
//             <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
//             <div className={OverAllCss().Front_Box_Select_Button}>
//                 <Button variant="contained" component="label" color={color}>
//                     Select File
//                     <input
//                         hidden
//                         required
//                         type="file"
//                         accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                         multiple={multiple}
//                         onChange={onChange}
//                     />
//                 </Button>
//                 {selectedText && (
//                     <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//                         {selectedText}
//                     </span>
//                 )}
//                 {error && (
//                     <div>
//                         <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//                     </div>
//                 )}
//             </div>
//         </Box>
//     );
// };


// export default LiveMobReco;


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
import TopicIcon from '@mui/icons-material/Topic';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const LiveMobReco = () => {
    const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
    const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
    const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
    const [recoFile, setRecoFile] = useState({ filename: "", bytes: "" }); // ✅ NEW
    const [fileData, setFileData] = useState();
    const [fileData1, setFileData1] = useState();
    const [download, setDownload] = useState(false);


    const [showFiles, setShoweFiles] = useState({

        mobinetDump: [],

    });

    const [showError, setShowError] = useState({

        recoFile: false, // ✅ NEW
    });

    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const link = `${ServerURL}${fileData}`;
    const link1 = `${ServerURL}${fileData1}`;

    const updateFile = (event, setFileState, errorKey) => {
        const file = event.target.files[0];
        if (file) {
            setShowError((prev) => ({ ...prev, [errorKey]: false }));
            setFileState({ filename: file.name, bytes: file });
        }
    };

    const fetchMobinetFileData = async () => {
        action(true);

        // FIX: added trailing slash — every other endpoint in this API family
        // ends with "/". Without it, a Django-style backend with APPEND_SLASH
        // enabled issues a 301 redirect that typically drops CORS headers,
        // which the browser then reports as a CORS error even though the
        // real cause is the missing slash.
        const response5 = await getData('mobinate_vs_cats/mobinet_livein/');

        action(false);

        setShoweFiles({

            mobinetDump: response5?.files || [],

        });
    };

    const handleSubmit = async () => {
        const isValid =

            recoFile.filename; // ✅ NEW validation

        if (!isValid) {
            setShowError({

                recoFile: !recoFile.filename, // ✅ NEW
            });
            return;
        }

        action(true);
        const formData = new FormData();

        formData.append("reco_file", recoFile.bytes); // ✅ NEW

        const response = await postData("mobinate_vs_cats/live_in_mob/", formData);
        action(false);

        if (response.status) {
            setDownload(true);
            setFileData(response.download_url);
             setFileData1(response.download_url1); 
            Swal.fire({ icon: "success", title: "Done", text: response.message });
        } else {
            Swal.fire({ icon: "error", title: "Oops...", text: response.message });
        }
    };

    const handleCancel = () => {

        setRecoFile({ filename: "", bytes: "" }); // ✅ NEW
        setDownload(false);
        setShowError({ siteList: false, hardware: false, recoFile: false }); // ✅ NEW
    };

    useEffect(() => {
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
        fetchMobinetFileData();
    }, []);

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>Mobinet Vs CATS</Link>
                    <Typography color="text.primary">Live Mob Reco</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Live Mob Reco</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                {/* Mobinet Dump Files — read-only list */}
                                <Box className={OverAllCss().Front_Box}>
                                    <div className={OverAllCss().Front_Box_Hading}>Live In Mobinet Dump Files:</div>
                                    <div className={OverAllCss().Front_Box_Select_Button}>
                                        {showFiles?.mobinetDump.length > 0 ? (
                                            <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                                                {showFiles?.mobinetDump.map((item, index) => (
                                                    <Grid item xs={6} key={index}>
                                                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontWeight: "bold" }}>
                                                            <TopicIcon sx={{ color: "#FEA405" }} />{item}
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography color="gray" fontSize={14}>No files found.</Typography>
                                        )}
                                    </div>
                                </Box>

                                {/* Site List */}

                                {/* ✅ NEW: Reco File upload */}
                                <UploadSection
                                    label="Select Reco File"
                                    color={recoFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setRecoFile, "recoFile")}
                                    error={showError.recoFile}
                                    selectedText={recoFile.filename}
                                />

                                {/* ✅ REMOVED: RFS File, MS-MF File, Locator Files, MO VS CAP File */}

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
                                    Live In Mobinet Summary Report
                                </Button>
                            </a>

                            {fileData1 && (
                                <a href={fileData1} download>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
                                        sx={{ textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
                                    >
                                        Live In Mobinet Data Report
                                    </Button>
                                </a>
                            )}
                        </Box>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    );
};

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

export default LiveMobReco;