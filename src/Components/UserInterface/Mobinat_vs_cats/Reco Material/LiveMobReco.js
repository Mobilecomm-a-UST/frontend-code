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
import { postData, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const LiveMobReco = () => {
    const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
    const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
    const [recoFile, setRecoFile] = useState({ filename: "", bytes: "" });

    const [download, setDownload] = useState(false);
    const [showFiles, setShoweFiles] = useState({
        mobinetDump: [],
    });

    const [showError, setShowError] = useState({
        siteList: false,
        recoFile: false,
        hardware: false,
    });

    const [fileurl, setFileurl] = useState([]);

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
        action(true);
        const response5 = await getData('mobinate_vs_cats/mobinet_livein/');
        action(false);
        setShoweFiles({
            mobinetDump: response5?.files || [],
        });
    };

    const handleSubmit = async () => {
        const isValid = siteList.filename && recoFile.filename && hardWareFile.filename;

        if (!isValid) {
            setShowError({
                siteList: !siteList.filename,
                recoFile: !recoFile.filename,
                hardware: !hardWareFile.filename,
            });
            return;
        }

        action(true);

        try {
            const formData = new FormData();
            formData.append("site_list_file", siteList.bytes);
            formData.append("reco_file", recoFile.bytes);
            formData.append("hw_file", hardWareFile.bytes);

            const response = await postData(
                "mobinate_vs_cats/live_in_mob/",
                formData
            );

            console.log("API Response:", response);

            if (response.status) {
                let files = [];
                if (response.download_url) {
                    files.push({
                        url: response.download_url,
                        name: "Live_in_mob_Report.xlsx",
                    });
                }
                if (response.download_url1) {
                    files.push({
                        url: response.download_url1,
                        name: "Live_in_mob_Matched.xlsx",
                    });
                }

                setFileurl(files);
                setDownload(true);

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: response.message,
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.message || "Failed to generate report",
                });
            }

        } catch (error) {
            console.error("Submit error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong while generating the report.",
            });
        } finally {
            action(false);
        }
    };

    const handleCancel = () => {
        setSiteList({ filename: "", bytes: "" });
        setRecoFile({ filename: "", bytes: "" });
        setHardWareFile({ filename: "", bytes: "" });
        setDownload(false);
        setFileurl([]);
        setShowError({ siteList: false, recoFile: false, hardware: false });
    };

    // Robust download handler for individual files
    const downloadSingleFile = async (file) => {
        try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
        } catch (err) {
            console.error(`Error downloading ${file.name}:`, err);
            const fallbackLink = document.createElement("a");
            fallbackLink.href = file.url;
            fallbackLink.download = file.name;
            fallbackLink.target = "_blank";
            fallbackLink.rel = "noreferrer";
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
        }
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
                    <Link underline="hover" onClick={() => navigate("/tools/material_management")}>Material Management</Link>
                    <Typography color="text.primary">Live Mob Reco</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
                            <Box className={classes.Box_Hading}>Live Mob Reco</Box>

                            <Stack spacing={2} sx={{ mt: "-40px" }}>

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
                                
                                <UploadSection
                                    label="Select Site List File"
                                    color={siteList.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setSiteList, "siteList")}
                                    error={showError.siteList}
                                    selectedText={siteList.filename}
                                />

                                <UploadSection
                                    label="Select Reco File"
                                    color={recoFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setRecoFile, "recoFile")}
                                    error={showError.recoFile}
                                    selectedText={recoFile.filename}
                                />

                                <UploadSection
                                    label="Select Hardware File"
                                    color={hardWareFile.filename ? "warning" : "primary"}
                                    onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                                    error={showError.hardware}
                                    selectedText={hardWareFile.filename}
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

                    {/* ✅ Render separate download buttons for each file returned */}
                    {download && fileurl.length > 0 && (
                        <Box textAlign="center" sx={{ mt: 3 }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center">
                                {fileurl.map((file, idx) => (
                                    <Button
                                        key={idx}
                                        variant="outlined"
                                        startIcon={<FileDownloadIcon sx={{ fontSize: 26, color: "green" }} />}
                                        sx={{ textTransform: "none", fontWeight: 700, fontSize: "16px", fontFamily: "Poppins" }}
                                        onClick={() => downloadSingleFile(file)}
                                    >
                                        Download {file.name}
                                    </Button>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    );
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

export default LiveMobReco;


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
// import { postData, getData } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const LiveMobReco = () => {
//     const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
//     const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
//     const [recoFile, setRecoFile] = useState({ filename: "", bytes: "" });

//     const [download, setDownload] = useState(false);
//     const [showFiles, setShoweFiles] = useState({
//         mobinetDump: [],
//     });

//     const [showError, setShowError] = useState({
//         siteList: false,
//         recoFile: false,
//         hardware: false,
//     });

//     const [fileurl, setFileurl] = useState([]);

//     const { loading, action } = useLoadingDialog();
//     const navigate = useNavigate();
//     const classes = OverAllCss();

//     const updateFile = (event, setFileState, errorKey) => {
//         const file = event.target.files[0];
//         if (file) {
//             setShowError((prev) => ({ ...prev, [errorKey]: false }));
//             setFileState({ filename: file.name, bytes: file });
//         }
//     };

//     const fetchMobinetFileData = async () => {
//         action(true);
//         const response5 = await getData('mobinate_vs_cats/mobinet_livein/');
//         action(false);
//         setShoweFiles({
//             mobinetDump: response5?.files || [],
//         });
//     };

//     const handleSubmit = async () => {
//         const isValid = siteList.filename && recoFile.filename && hardWareFile.filename;

//         if (!isValid) {
//             setShowError({
//                 siteList: !siteList.filename,
//                 recoFile: !recoFile.filename,
//                 hardware: !hardWareFile.filename,
//             });
//             return;
//         }

//         action(true);

//         try {
//             const formData = new FormData();
//             formData.append("site_list_file", siteList.bytes);
//             formData.append("reco_file", recoFile.bytes);
//             formData.append("hw_file", hardWareFile.bytes);

//             const response = await postData(
//                 "mobinate_vs_cats/live_in_mob/",
//                 formData
//             );

//             console.log("API Response:", response);

//             if (response.status) {
//                 let files = [];
//                 if (response.download_url) {
//                     files.push({
//                         url: response.download_url,
//                         name: "Live_in_mob_Report.xlsx",
//                     });
//                 }
//                 if (response.download_url1) {
//                     files.push({
//                         url: response.download_url1,
//                         name: "Live_in_mob_Matched.xlsx",
//                     });
//                 }

//                 setFileurl(files);
//                 setDownload(true);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Done",
//                     text: response.message,
//                 });

//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: response.message || "Failed to generate report",
//                 });
//             }

//         } catch (error) {
//             console.error("Submit error:", error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Error",
//                 text: "Something went wrong while generating the report.",
//             });
//         } finally {
//             action(false);
//         }
//     };

//     const handleCancel = () => {
//         setSiteList({ filename: "", bytes: "" });
//         setRecoFile({ filename: "", bytes: "" });
//         setHardWareFile({ filename: "", bytes: "" });
//         setDownload(false);
//         setFileurl([]);
//         setShowError({ siteList: false, recoFile: false, hardware: false });
//     };

//     // ✅ Robust download implementation using Blob / hidden iframe to bypass browser popup blocking
//     const downloadAllFiles = async () => {
//         if (!fileurl || fileurl.length === 0) return;

//         for (let i = 0; i < fileurl.length; i++) {
//             const file = fileurl[i];
//             try {
//                 // Fetch file as blob to force secure download and avoid target="_blank" blockages
//                 const response = await fetch(file.url);
//                 const blob = await response.blob();
//                 const blobUrl = window.URL.createObjectURL(blob);

//                 const link = document.createElement("a");
//                 link.href = blobUrl;
//                 link.download = file.name;
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);

//                 // Clean up blob url
//                 setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
//             } catch (err) {
//                 console.error(`Error downloading ${file.name}:`, err);
//                 // Fallback method if fetch blob fails (e.g., CORS restrictions)
//                 const fallbackLink = document.createElement("a");
//                 fallbackLink.href = file.url;
//                 fallbackLink.download = file.name;
//                 fallbackLink.target = "_blank";
//                 fallbackLink.rel = "noreferrer";
//                 document.body.appendChild(fallbackLink);
//                 fallbackLink.click();
//                 document.body.removeChild(fallbackLink);
//             }

//             // Stagger downloads slightly so the browser registers both clicks
//             if (i < fileurl.length - 1) {
//                 await new Promise((resolve) => setTimeout(resolve, 800));
//             }
//         }
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
//                     <Link underline="hover" onClick={() => navigate("/tools/material_management")}>Material Management</Link>
//                     <Typography color="text.primary">Live Mob Reco</Typography>
//                 </Breadcrumbs>
//             </Box>

//             <Slide direction="left" in timeout={1000}>
//                 <Box>
//                     <Box className={classes.main_Box}>
//                         <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//                             <Box className={classes.Box_Hading}>Live Mob Reco</Box>

//                             <Stack spacing={2} sx={{ mt: "-40px" }}>

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
                                
//                                 <UploadSection
//                                     label="Select Site List File"
//                                     color={siteList.filename ? "warning" : "primary"}
//                                     onChange={(e) => updateFile(e, setSiteList, "siteList")}
//                                     error={showError.siteList}
//                                     selectedText={siteList.filename}
//                                 />

//                                 <UploadSection
//                                     label="Select Reco File"
//                                     color={recoFile.filename ? "warning" : "primary"}
//                                     onChange={(e) => updateFile(e, setRecoFile, "recoFile")}
//                                     error={showError.recoFile}
//                                     selectedText={recoFile.filename}
//                                 />

//                                 <UploadSection
//                                     label="Select Hardware File"
//                                     color={hardWareFile.filename ? "warning" : "primary"}
//                                     onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
//                                     error={showError.hardware}
//                                     selectedText={hardWareFile.filename}
//                                 />

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

//                     {/* ✅ Single button — clicking it downloads BOTH files properly */}
//                     {download && fileurl.length > 0 && (
//                         <Box textAlign="center">
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
//                                 sx={{ mt: 2, textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
//                                 onClick={downloadAllFiles}
//                             >
//                                 Live In Mobinate Reco Report
//                             </Button>
//                         </Box>
//                     )}
//                 </Box>
//             </Slide>

//             {loading}
//         </>
//     );
// }

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