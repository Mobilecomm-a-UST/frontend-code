// import React, { useState, useEffect } from "react";
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

// const Step2srn_cam_rmo = () => {

//     const [fileData, setFileData] = useState();
//     const [download, setDownload] = useState(false);
//     const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
//     const [showFiles, setShowFiles] = useState({


//         hardware: [],
//         mobinate: [],
//         locator: [],
//         rmo: [],
//         rfs: [],
//         msmf:[]
//     });

//     const [showError, setShowError] = useState({
//         hardware: false,
//         mobinate: false,
//         locator: false,
//         rmo: false,
//         rfs: false,
//         msmf: false,

//     });
//     const updateFile = (event, setFileState, errorKey) => {
//         const file = event.target.files[0];
//         if (file) {
//             setShowError((prev) => ({ ...prev, [errorKey]: false }));
//             setFileState({ filename: file.name, bytes: file });
//         }
//     };

//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     const link = `${ServerURL}${fileData}`;

//     // -------- Fetch Files ---------
//     const fetchMobinetFileData = async () => {
//         action(true);
//         const hardware = await getData('mobinate_vs_cats/hw/')
//         const mobinate = await getData('mobinate_vs_cats/mobinet_dump/');
//         const locator = await getData('mobinate_vs_cats/locator/');
//         const rmo = await getData('mobinate_vs_cats/rmo/');
//         const rfs = await getData('mobinate_vs_cats/rfs/');
//         const msmf = await getData('mobinate_vs_cats/msmf/');
        

//         action(false);

//         setShowFiles({
//             hardware: hardware?.files || [],
//             mobinate: mobinate?.files || [],
//             locator: locator?.files || [],
//             rmo: rmo?.files || [],
//             rfs: rfs?.files || [],
//             msmf: msmf?.files || [],

//         });
//     };

//     // -------- Submit ----------
//     const handleSubmit = async () => {
//         const errors = {
//             hardware: showFiles.hardware.length === 0,
//             mobinate: showFiles.mobinate.length === 0,
//             locator: showFiles.locator.length === 0,
//             rmo: showFiles.rmo.length === 0,
//             rfs: showFiles.rfs.length === 0,
//             msmf: showFiles.msmf.length === 0,

//         };

//         setShowError(errors);

//         const isValid = Object.values(errors).every((item) => item === false);

//         if (!isValid) return;

//         action(true);
//         const formData = new FormData();

//         formData.append("TOD_output", hardWareFile.bytes);
//         const response = await postData("mobinate_vs_cats/forward_material_reconciliation_step2/", formData);
//         action(false);

//         if (response.status) {
//             setDownload(true);
//             setFileData(response.download_url);
//             Swal.fire({ icon: "success", title: "Done", text: response.message });
//         } else {
//             Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//         }
//     };

//     const handleCancel = () => {
//         setDownload(false);
//         setShowError({ hardware: false, mobinate: false, locator: false , rmo: false, rfs: false, msmf: false});
//         }

//     useEffect(() => {
//                 const title = window.location.pathname
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
//                     <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>
//                         Mobinet Vs CATS
//                     </Link>
//                     <Typography color="text.primary">Step 2-SRN CAM RMO</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Step 2-SRN/CAM/RMO</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

//                                 <UploadSection
//                                     label="TOD Basline Output File"
//                                     color={hardWareFile.filename ? "warning" : "primary"}
//                                     onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
//                                     error={showError.hardware}
//                                     selectedText={hardWareFile.filename}
//                                 />

//                                 <FileBox
//                                     title="Hardware File"
//                                     data={showFiles.hardware}
//                                     error={showError.hardware}
//                                 />

//                                 {/* Mobinate Dump */}

                                
//                                 <FileBox
//                                     title="Mobinet Live"
//                                     data={showFiles.mobinate}
//                                     error={showError.mobinate}
//                                 />

//                                 {/* Locator */}
//                                 <FileBox
//                                     title="Locator File"
//                                     data={showFiles.locator}
//                                     error={showError.locator}
//                                 />

//                                 {/* MBF */}
//                                 <FileBox
//                                     title="RMO File"
//                                     data={showFiles.rmo}
//                                     error={showError.rmo}
//                                 />

//                                 {/* TOD */}
//                                 <FileBox
//                                     title="RFS File"
//                                     data={showFiles.rfs}
//                                     error={showError.rfs}
//                                 />

//                                 <FileBox
//                                     title="MS-MF File"
//                                     data={showFiles.msmf}
//                                     error={showError.msmf}
//                                 />

//                             </Stack>

//                             <Stack
//                                 direction={{ xs: "column", md: "row" }}
//                                 spacing={2}
//                                 justifyContent="space-around"
//                                 mt={2}
//                             >
//                                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>
//                                     Submit
//                                 </Button>

//                                 <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }}
//                                     endIcon={<DoDisturbIcon />}>
//                                     Cancel
//                                 </Button>
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
//                                     Forword Material Reconcilation Mobinet 2 Report
//                                 </Button>
//                             </a>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// };

// const FileBox = ({ title, data, error }) => (
//     <Box className={OverAllCss().Front_Box}>
//         <div className={OverAllCss().Front_Box_Hading}>{title}:</div>

//         <div className={OverAllCss().Front_Box_Select_Button}>
//             <Grid container rowSpacing={1} columnSpacing={1}>
//                 {(data || []).map((item, index) => (
//                     <Grid item xs={4} key={index}>
//                         <Box sx={{ display: "flex", alignItems: "center", fontWeight: 'bold' }}>
//                             <TopicIcon sx={{ color: '#FEA405' }} /> {item}
//                         </Box>
//                     </Grid>
//                 ))}
//             </Grid>

//             {error && (
//                 <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//             )}
//         </div>
//     </Box>
// );

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


// export default Step2srn_cam_rmo;


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
import { getData, ServerURL } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const Step2srn_cam_rmo = () => {

    const [fileData, setFileData] = useState();
    const [download, setDownload] = useState(false);
    const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
    const [showFiles, setShowFiles] = useState({
        hardware: [],
        mobinate: [],
        locator: [],
        rmo: [],
        rfs: [],
        msmf: []
    });

    const [showError, setShowError] = useState({
        hardware: false,
        mobinate: false,
        locator: false,
        rmo: false,
        rfs: false,
        msmf: false,
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

    // -------- Fetch Files ---------
    const fetchMobinetFileData = async () => {
        action(true);
        const hardware = await getData('mobinate_vs_cats/hw/');
        const mobinate = await getData('mobinate_vs_cats/mobinet_dump/');
        const locator  = await getData('mobinate_vs_cats/locator/');
        const rmo      = await getData('mobinate_vs_cats/rmo/');
        const rfs      = await getData('mobinate_vs_cats/rfs/');
        const msmf     = await getData('mobinate_vs_cats/msmf/');

        action(false);

        setShowFiles({
            hardware: hardware?.files || [],
            mobinate: mobinate?.files || [],
            locator:  locator?.files  || [],
            rmo:      rmo?.files      || [],
            rfs:      rfs?.files      || [],
            msmf:     msmf?.files     || [],
        });
    };

    // -------- Submit ----------
    const handleSubmit = async () => {
        const errors = {
            hardware: showFiles.hardware.length === 0,
            mobinate: showFiles.mobinate.length === 0,
            locator:  showFiles.locator.length  === 0,
            rmo:      showFiles.rmo.length       === 0,
            rfs:      showFiles.rfs.length       === 0,
            msmf:     showFiles.msmf.length      === 0,
        };

        setShowError(errors);

        const isValid = Object.values(errors).every((item) => item === false);
        if (!isValid) return;

        action(true);

        try {
            const formData = new FormData();
            formData.append("TOD_output", hardWareFile.bytes);

            // ✅ FIX: use native fetch so we always get the full JSON body
            // postData() swallows non-2xx responses and returns null,
            // which is why response.error was never reaching the Swal call.
            const rawRes = await fetch(
                `${ServerURL}mobinate_vs_cats/forward_material_reconciliation_step2/`,
                { method: "POST", body: formData }
            );

            const response = await rawRes.json();
            action(false);

            if (rawRes.ok && response.status) {
                setDownload(true);
                setFileData(response.download_url);
                Swal.fire({ icon: "success", title: "Done", text: response.message });
            } else {
                // ✅ Now response always has the full body from the API
                // e.g. {"error": "Worksheet named 'TOD+Baseline' not found"}
                const errorText =
                    response.message ||
                    response.error   ||
                    response.detail  ||
                    "Something went wrong.";

                Swal.fire({ icon: "error", title: "Oops...", text: errorText });
            }
        } catch (err) {
            action(false);
            Swal.fire({ icon: "error", title: "Oops...", text: err.message || "Something went wrong." });
        }
    };

    const handleCancel = () => {
        setDownload(false);
        setShowError({ hardware: false, mobinate: false, locator: false, rmo: false, rfs: false, msmf: false });
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
                    <Link underline="hover" onClick={() => navigate("/tools/mobinet_vs_cats")}>
                        Mobinet Vs CATS
                    </Link>
                    <Typography color="text.primary">Step 2-SRN CAM RMO</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Step 2-SRN/CAM/RMO</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

                                <UploadSection
                                    label="TOD Basline Output File"
                                    color={hardWareFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                                    error={showError.hardware}
                                    selectedText={hardWareFile.filename}
                                />

                                <FileBox
                                    title="Hardware File"
                                    data={showFiles.hardware}
                                    error={showError.hardware}
                                />

                                <FileBox
                                    title="Mobinet Live"
                                    data={showFiles.mobinate}
                                    error={showError.mobinate}
                                />

                                <FileBox
                                    title="Locator File"
                                    data={showFiles.locator}
                                    error={showError.locator}
                                />

                                <FileBox
                                    title="RMO File"
                                    data={showFiles.rmo}
                                    error={showError.rmo}
                                />

                                <FileBox
                                    title="RFS File"
                                    data={showFiles.rfs}
                                    error={showError.rfs}
                                />

                                <FileBox
                                    title="MS-MF File"
                                    data={showFiles.msmf}
                                    error={showError.msmf}
                                />

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
                                    Forword Material Reconcilation Mobinet 2 Report
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

export default Step2srn_cam_rmo;