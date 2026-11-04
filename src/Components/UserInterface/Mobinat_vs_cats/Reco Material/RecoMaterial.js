

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Box, Button, Stack, Breadcrumbs, Link, Typography, Slide, Grid
// } from "@mui/material";
// import {
//   Upload as UploadIcon,
//   DoDisturb as DoDisturbIcon,
//   FileDownload as FileDownloadIcon,
//   KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import TopicIcon from '@mui/icons-material/Topic';
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { postData, getData, ServerURL } from "../../../services/FetchNodeServices";
// import OverAllCss from "../../../csss/OverAllCss";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";






// const RecoMaterial = () => {
//   const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
//   const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
//   const [manualFile, setManualFile] = useState({ filename: "", bytes: "" }) // ✅ now OPTIONAL
//   const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
//   const [fileData, setFileData] = useState();
//   const [fileData1, setFileData1] = useState(); // RSF MS-MF report (download_url1)
//   const [download, setDownload] = useState(false);
//   const [showFiles, setShoweFiles] = useState({
//     locator: [],
//     stock: [],
//     msmf: [],
//     rfs: [],
//     mobinetDump: [],
//     moVsCap: [],
//   });
//   const [fileurl, setFileurl] = useState([])

//   console.log("file url",fileurl )

//   const [showError, setShowError] = useState({
//     siteList: false,
//     hardware: false,
//     // ✅ "manual" removed from error state — it's no longer a required field
//     olmId: false,
//   });

//   const { loading, action } = useLoadingDialog();
//   const navigate = useNavigate();
//   const classes = OverAllCss();

//   const link = `${ServerURL}${fileData}`;
//   const link1 = `${ServerURL}${fileData1}`;

//   const updateFile = (event, setFileState, errorKey) => {
//     const file = event.target.files[0];
//     if (file) {
//       setShowError((prev) => ({ ...prev, [errorKey]: false }));
//       setFileState({ filename: file.name, bytes: file });
//     }
//   };

//   const fetchMobinetFileData = async () => {
//     action(true)

//     const response1 = await getData('mobinate_vs_cats/rfs/');
//     const response2 = await getData('mobinate_vs_cats/msmf/');
//     const response3 = await getData('mobinate_vs_cats/stock/');
//     const response4 = await getData('mobinate_vs_cats/locator/');
//     const response5 = await getData('mobinate_vs_cats/mobinet_dump/');
//     const response6 = await getData('mobinate_vs_cats/mo_vs_cap/');

//     action(false);
//     setShoweFiles({
//       locator: response4?.files ? response4?.files : [],
//       stock: response3?.files ? response3?.files : [],
//       msmf: response2?.files ? response2?.files : [],
//       rfs: response1?.files ? response1?.files : [],
//       mobinetDump: response5?.files ? response5?.files : [],
//       moVsCap: response6?.files ? response6?.files : [],
//     })
//   }

//   const handleSubmit = async () => {
//     // ✅ Manual File removed from required validation — it's optional now
//     const isValid =
//       siteList.filename &&
//       hardWareFile.filename;

//     if (!isValid) {
//       setShowError({
//         siteList: !siteList.filename,
//         hardware: !hardWareFile.filename,
//       });
//       return;
//     }

//     action(true);
//     const formData = new FormData();
//     formData.append("site_list_file", siteList.bytes);
//     formData.append("hw_file", hardWareFile.bytes);
//     // ✅ Only append manual_file if the user actually chose one
//     if (manualFile.filename) {
//       formData.append("manual_file", manualFile.bytes);
//     }

//     const response = await postData("mobinate_vs_cats/dismental_dash/", formData);
//     action(false);

//     console.log('responce', response)



//     if (response.status) {
//       setDownload(true);

//       let files = [
//         {
//           url: response.download_url,
//           name: "Reco_Report.xlsx",
//         },
//         {
//           url: response.download_url1,
//           name: "RFS_MSMF_Report.xlsx",
//         },
//       ];
//       setFileurl(files)
//       Swal.fire({ icon: "success", title: "Done", text: response.message });
//     } else {
//       Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//     }
//   };

// const downloadAllFiles = () => {
//   fileurl.forEach((file, index) => {
//     console.log("File URL:", file.url);
//     console.log("File Name:", file.name);

//     setTimeout(() => {
//       const link = document.createElement("a");

//       link.href = file.url;
//       link.download = file.name;
//       link.target = "_blank";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }, index * 1000);
//   });
// };

//   const handleCancel = () => {
//     setSiteList({ filename: "", bytes: "" });
//     setHardWareFile({ filename: "", bytes: "" });
//     setManualFile({ filename: '', bytes: "" });
//     setOlmidFile({ filename: "", bytes: "" });
//     setDownload(false);
//     setFileData();
//     setFileData1();
//     setShowError({ siteList: false, hardware: false });
//   };

//   // Triggers both downloads from a single button click.
//   // Each file is downloaded via a programmatically-created, hidden <a> tag.
//   // A short stagger between the two clicks avoids browsers silently
//   // blocking "multiple simultaneous downloads" popups.
//   const triggerDownload = (url) => {
//     if (!url) return;
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   const handleDownloadAll = () => {
//     triggerDownload(fileData);
//     if (fileData1) {
//       setTimeout(() => triggerDownload(fileData1), 400);
//     }
//   };

//   useEffect(() => {
//     const title = window.location.pathname
//       .slice(1)
//       .replaceAll("_", " ")
//       .replaceAll("/", " | ")
//       .toUpperCase();
//     document.title = title;
//     fetchMobinetFileData()
//   }, []);
//   return (
//     <>
//       <Box m={1} ml={2}>
//         <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//           <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//           <Link underline="hover" onClick={() => navigate("/tools/material_management")}>Material Management</Link>
//           <Typography color="text.primary">Reco Material</Typography>
//         </Breadcrumbs>
//       </Box>

//       <Slide direction="left" in timeout={1000}>
//         <Box>
//           <Box className={classes.main_Box}>
//             <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
//               <Box className={classes.Box_Hading}>Reco Material</Box>

//               <Stack spacing={2} sx={{ mt: "-40px" }}>
//                 <Box className={OverAllCss().Front_Box}>
//                   <div className={OverAllCss().Front_Box_Hading}>Mobinet Dump Files:</div>
//                   <div className={OverAllCss().Front_Box_Select_Button}>
//                     {showFiles?.mobinetDump.length > 0 ? (
//                       <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                         {showFiles?.mobinetDump.map((item, index) => (
//                           <Grid item xs={6} key={index}>
//                             <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
//                               <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                             </Box>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     ) : (
//                       <Typography color="gray" fontSize={14}>No files found.</Typography>
//                     )}
//                   </div>
//                 </Box>

//                 <UploadSection
//                   label="Select Site List File"
//                   color={siteList.filename ? "warning" : "primary"}
//                   onChange={(e) => updateFile(e, setSiteList, "siteList")}
//                   error={showError.siteList}
//                   selectedText={siteList.filename}
//                 />

//                 <UploadSection
//                   label="Select Hardware File"
//                   color={hardWareFile.filename ? "warning" : "primary"}
//                   onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
//                   error={showError.hardware}
//                   selectedText={hardWareFile.filename}
//                 />

//                 {/* ✅ Manual File is now OPTIONAL: no "required" on the input,
//                      no red error message, and label reflects it's optional. */}
//                 <UploadSection
//                   label="Select Manual File (Optional)"
//                   color={manualFile.filename ? "warning" : "primary"}
//                   onChange={(e) => updateFile(e, setManualFile, "manual")}
//                   selectedText={manualFile.filename}
//                   required={false}
//                 />

//                 <Box className={OverAllCss().Front_Box}>
//                   <div className={OverAllCss().Front_Box_Hading}>RFS File :</div>
//                   <div className={OverAllCss().Front_Box_Select_Button}>
//                     <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                       {showFiles?.rfs.map((item, index) => (
//                         <Grid item xs={6} key={index}>
//                           <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
//                             <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                           </Box>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </div>
//                 </Box>

//                 <Box className={OverAllCss().Front_Box}>
//                   <div className={OverAllCss().Front_Box_Hading}>MS-MF File :</div>
//                   <div className={OverAllCss().Front_Box_Select_Button}>
//                     <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                       {showFiles?.msmf.map((item, index) => (
//                         <Grid item xs={6} key={index}>
//                           <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
//                             <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                           </Box>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </div>
//                 </Box>

//                 <Box className={OverAllCss().Front_Box}>
//                   <div className={OverAllCss().Front_Box_Hading}>Locator Files :</div>
//                   <div className={OverAllCss().Front_Box_Select_Button}>
//                     <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                       {showFiles?.locator.map((item, index) => (
//                         <Grid item xs={6} key={index}>
//                           <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
//                             <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                           </Box>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </div>
//                 </Box>

//                 <Box className={OverAllCss().Front_Box}>
//                   <div className={OverAllCss().Front_Box_Hading}>MO VS CAP File :</div>
//                   <div className={OverAllCss().Front_Box_Select_Button}>
//                     {showFiles?.moVsCap.length > 0 ? (
//                       <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
//                         {showFiles?.moVsCap.map((item, index) => (
//                           <Grid item xs={6} key={index}>
//                             <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
//                               <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                             </Box>
//                           </Grid>
//                         ))}
//                       </Grid>
//                     ) : (
//                       <Typography color="gray" fontSize={14}>No files found.</Typography>
//                     )}
//                   </div>
//                 </Box>

//               </Stack>

//               <Stack
//                 direction={{ xs: "column", md: "row" }}
//                 spacing={2}
//                 justifyContent="space-around"
//                 mt={2}
//               >
//                 <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>
//                 <Button variant="contained" onClick={handleCancel} sx={{ backgroundColor: "red", color: "white" }} endIcon={<DoDisturbIcon />}>Cancel</Button>
//               </Stack>
//             </Box>
//           </Box>

//           {/* Single button — clicking it downloads BOTH reports (fileData + fileData1) */}
//           {download  && fileurl.length > 0 && (
//             <Box textAlign="center">
//               <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="center" alignItems="center" mt={2}>
//                 <Button
//                   variant="outlined"
//                   startIcon={<FileDownloadIcon sx={{ fontSize: 30, color: "green" }} />}
//                   sx={{ textTransform: "none", fontWeight: 800, fontSize: "22px", fontFamily: "Poppins" }}
//                   onClick={downloadAllFiles}
//                 >
//                   Reco Summary Report
//                 </Button>
//               </Stack>
//             </Box>
//           )}
//         </Box>
//       </Slide>

//       {loading}
//     </>
//   )
// }

// // ✅ Added a `required` prop (defaults to true) so individual sections can
// // opt out of the native "required" attribute on the file input, and out of
// // showing the red validation error.
// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText, required = true }) => {
//   return (
//     <Box className={OverAllCss().Front_Box}>
//       <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
//       <div className={OverAllCss().Front_Box_Select_Button}>
//         <Button variant="contained" component="label" color={color}>
//           Select File
//           <input
//             hidden
//             required={required}
//             type="file"
//             accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//             multiple={multiple}
//             onChange={onChange}
//           />
//         </Button>
//         {selectedText && (
//           <span style={{ color: "green", fontSize: 18, fontWeight: 600, marginLeft: 10 }}>
//             {selectedText}
//           </span>
//         )}
//         {error && (
//           <div>
//             <span style={{ color: "red", fontSize: 18, fontWeight: 600 }}>This Field Is Required!</span>
//           </div>
//         )}
//       </div>
//     </Box>
//   );
// };

// export default RecoMaterial


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




const RecoMaterial = () => {
  const [siteList, setSiteList] = useState({ filename: "", bytes: "" });
  const [hardWareFile, setHardWareFile] = useState({ filename: "", bytes: "" });
  const [manualFile, setManualFile] = useState({ filename: "", bytes: "" }) // ✅ now OPTIONAL
  const [olmidFile, setOlmidFile] = useState({ filename: "", bytes: "" });
  const [fileData, setFileData] = useState();
  const [fileData1, setFileData1] = useState(); // RSF MS-MF report (download_url1)
  const [download, setDownload] = useState(false);
  const [showFiles, setShoweFiles] = useState({
    locator: [],
    stock: [],
    msmf: [],
    rfs: [],
    mobinetDump: [],
    moVsCap: [],
  });
  const [fileurl, setFileurl] = useState([])

  console.log("file url", fileurl)

  const [showError, setShowError] = useState({
    siteList: false,
    hardware: false,
    // ✅ "manual" removed from error state — it's no longer a required field
    olmId: false,
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
    action(true)

    const response1 = await getData('mobinate_vs_cats/rfs/');
    const response2 = await getData('mobinate_vs_cats/msmf/');
    const response3 = await getData('mobinate_vs_cats/stock/');
    const response4 = await getData('mobinate_vs_cats/locator/');
    const response5 = await getData('mobinate_vs_cats/mobinet_dump/');
    const response6 = await getData('mobinate_vs_cats/mo_vs_cap/');

    action(false);
    setShoweFiles({
      locator: response4?.files ? response4?.files : [],
      stock: response3?.files ? response3?.files : [],
      msmf: response2?.files ? response2?.files : [],
      rfs: response1?.files ? response1?.files : [],
      mobinetDump: response5?.files ? response5?.files : [],
      moVsCap: response6?.files ? response6?.files : [],
    })
  }

  const handleSubmit = async () => {
    // ✅ Manual File removed from required validation — it's optional now
    const isValid =
      siteList.filename &&
      hardWareFile.filename;

    if (!isValid) {
      setShowError({
        siteList: !siteList.filename,
        hardware: !hardWareFile.filename,
      });
      return;
    }

    action(true);
    const formData = new FormData();
    formData.append("site_list_file", siteList.bytes);
    formData.append("hw_file", hardWareFile.bytes);
    // ✅ Only append manual_file if the user actually chose one
    if (manualFile.filename) {
      formData.append("manual_file", manualFile.bytes);
    }

    const response = await postData("mobinate_vs_cats/dismental_dash/", formData);
    action(false);

    console.log('responce', response)



    if (response.status) {
      setDownload(true);

      let files = [
        {
          url: response.download_url,
          name: "Reco_Report.xlsx",
        },
        {
          url: response.download_url1,
          name: "RFS_MSMF_Report.xlsx",
        },
      ];
      setFileurl(files)
      Swal.fire({ icon: "success", title: "Done", text: response.message });
    } else {
      Swal.fire({ icon: "error", title: "Oops...", text: response.message });
    }
  };

  // ✅ Download single file
  const triggerDownload = (url) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ✅ Download all files at once
  const downloadAllFiles = () => {
    fileurl.forEach((file, index) => {
      console.log("File URL:", file.url);
      console.log("File Name:", file.name);

      setTimeout(() => {
        triggerDownload(file.url);
      }, index * 1000);
    });
  };

  const handleCancel = () => {
    setSiteList({ filename: "", bytes: "" });
    setHardWareFile({ filename: "", bytes: "" });
    setManualFile({ filename: '', bytes: "" });
    setOlmidFile({ filename: "", bytes: "" });
    setDownload(false);
    setFileData();
    setFileData1();
    setShowError({ siteList: false, hardware: false });
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
          <Link underline="hover" onClick={() => navigate("/tools/material_management")}>Material Management</Link>
          <Typography color="text.primary">Reco Material</Typography>
        </Breadcrumbs>
      </Box>

      <Slide direction="left" in timeout={1000}>
        <Box>
          <Box className={classes.main_Box}>
            <Box className={classes.Back_Box} sx={{ width: { md: "75%", xs: "100%" } }}>
              <Box className={classes.Box_Hading}>Reco Material</Box>

              <Stack spacing={2} sx={{ mt: "-40px" }}>
                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>Mobinet Dump Files:</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    {showFiles?.mobinetDump.length > 0 ? (
                      <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                        {showFiles?.mobinetDump.map((item, index) => (
                          <Grid item xs={6} key={index}>
                            <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                              <TopicIcon sx={{ color: '#FEA405' }} />{item}
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
                  label="Select Hardware File"
                  color={hardWareFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setHardWareFile, "hardware")}
                  error={showError.hardware}
                  selectedText={hardWareFile.filename}
                />

                {/* ✅ Manual File is now OPTIONAL: no "required" on the input,
                     no red error message, and label reflects it's optional. */}
                <UploadSection
                  label="Select Manual File (Optional)"
                  color={manualFile.filename ? "warning" : "primary"}
                  onChange={(e) => updateFile(e, setManualFile, "manual")}
                  selectedText={manualFile.filename}
                  required={false}
                />

                <Box className={OverAllCss().Front_Box}>
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
                </Box>

                <Box className={OverAllCss().Front_Box}>
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
                </Box>

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

                <Box className={OverAllCss().Front_Box}>
                  <div className={OverAllCss().Front_Box_Hading}>MO VS CAP File :</div>
                  <div className={OverAllCss().Front_Box_Select_Button}>
                    {showFiles?.moVsCap.length > 0 ? (
                      <Grid container rowSpacing={1} columnSpacing={1} direction={{ xs: "column", sm: "column", md: "row" }}>
                        {showFiles?.moVsCap.map((item, index) => (
                          <Grid item xs={6} key={index}>
                            <Box key={item} sx={{ display: "flex", justifyContent: 'flex-start', alignItems: 'center', fontWeight: 'bold' }}>
                              <TopicIcon sx={{ color: '#FEA405' }} />{item}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography color="gray" fontSize={14}>No files found.</Typography>
                    )}
                  </div>
                </Box>

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

          {/* ✅ Both download buttons in same card */}
          {download && fileurl.length > 0 && (
            <Box sx={{ mt: 3, px: { xs: 1, md: 3 } }}>
              <Box sx={{
                p: 3,
                bgcolor: '#e3f2f2',
                borderRadius: 2,
                border: '2px solid #006e74',
                textAlign: 'center'
              }}>
                <Typography sx={{ 
                  color: '#006e74', 
                  fontWeight: 700, 
                  mb: 3, 
                  fontSize: '16px'
                }}>
                  ✓ Files processed successfully! Download your reports:
                </Typography>
                <Stack 
                  direction={{ xs: "column", md: "row" }} 
                  spacing={2} 
                  justifyContent="center" 
                  alignItems="center"
                >
                  {fileurl.map((file, index) => (
                    <Button
                      key={index}
                      variant="contained"
                      color="success"
                      onClick={() => triggerDownload(file.url)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "15px",
                        padding: "10px 24px",
                        minWidth: '210px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          backgroundColor: '#1b5e20',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <FileDownloadIcon sx={{ fontSize: '20px' }} />
                      {file.name}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </Slide>

      {loading}
    </>
  )
}

// ✅ Added a `required` prop (defaults to true) so individual sections can
// opt out of the native "required" attribute on the file input, and out of
// showing the red validation error.
const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText, required = true }) => {
  return (
    <Box className={OverAllCss().Front_Box}>
      <div className={OverAllCss().Front_Box_Hading}>{label}:</div>
      <div className={OverAllCss().Front_Box_Select_Button}>
        <Button variant="contained" component="label" color={color}>
          Select File
          <input
            hidden
            required={required}
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

export default RecoMaterial