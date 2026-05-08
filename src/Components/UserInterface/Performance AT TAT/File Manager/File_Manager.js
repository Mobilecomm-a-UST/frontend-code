// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Grid,
//     Box,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     IconButton,
//     Slide,
//     Breadcrumbs, Link, Typography, Button
// } from '@mui/material';
// import {
//     Upload as UploadIcon,
//     DoDisturb as DoDisturbIcon,
//     FileDownload as FileDownloadIcon,
//     KeyboardArrowRight as KeyboardArrowRightIcon,
// } from "@mui/icons-material";
// import FolderIcon from '@mui/icons-material/Folder';
// import CloseIcon from '@mui/icons-material/Close';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { useNavigate } from 'react-router-dom';
// import Swal from "sweetalert2";
// import TopicIcon from '@mui/icons-material/Topic';
// import OverAllCss from "../../../csss/OverAllCss";
// import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
// import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

// const jsonData = [
//     { folder_name: "Performance AT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" }
// ];

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return (
//         <Slide
//             direction="down"
//             timeout={2500}
//             style={{ transformOrigin: '0 0 0' }}
//             mountOnEnter
//             unmountOnExit
//             ref={ref}
//             {...props}
//         />
//     );
// });

// const File_Manager = () => {
//     const [open2, setOpen2] = useState(false);
//         const [dialogData, setDialogData] = useState()
//         const navigate = useNavigate()
//         const { loading, action } = useLoadingDialog();
//         const [showFiles, setShoweFiles] = useState([])
//         const [selectFiles, setSeletctFiles] = useState([])
//         const [showError, setShowError] = useState({
//             selectfile: false,
//         });
    
//         const fetchApiData = async (api) => {
//             action(true)
    
//             const response = await getData(`${api}/`);
    
//             if (response?.status) {
//                 action(false);
//                 setShoweFiles(response.files);
    
//             }
    
            
//         }
    
//         const handleOpen = (foldername, apikey , back_folder) => {
//             // fetchApiData(apikey)
//             setOpen2(true);
//             setDialogData({ foldername: foldername, apikey: apikey , back_folder: back_folder })
//             // console.log('data', foldername, apikey)
//         }
//         const handleClose = () => {
//             setOpen2(false);
//             setShoweFiles([])
//             setDialogData()
//             setShowError({ selectfile: false })
//             setSeletctFiles([])
    
//         }
    
//         const handleSubmit = async (api) => {
//             const isValid = selectFiles.length > 0;
    
//             if (!isValid) {
//                 setShowError({
//                     selectfile: selectFiles.length === 0,
    
//                 });
//                 return;
//             }
    
//             action(true);
//             const formData = new FormData();
//             Array.from(selectFiles).forEach((file) => {
//                 formData.append("file", file);
//             });
//             const response = await postData(`${api}/`, formData);
//             // const response = await postData(`idploy/upload/`, formData);
//             action(false);
    
//             if (response.status) {
//                 fetchApiData(api);
//                 setShowError({ selectfile: true })
//                 setSeletctFiles([])
//                 Swal.fire({ icon: "success", title: "Done", text: response.message });
//             } else {
//                 Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//             }
    
//         }
//         const handleDelete = async (api) => {
//             const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: "This action cannot be undone!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`${api}/`);
//                 // const response = await deleteData("idploy/cleanup/");
//                 console.log("response", response);
    
//                 action(false);
    
//                 if (response?.status) {
//                     setShoweFiles([]);
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         };
    
//         const OneFileDelete = async(fileName,api,back_folder) => {
//            const confirmResult = await Swal.fire({
//                 title: "Are you sure?",
//                 text: `Want to delete ${fileName} file!`,
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });
    
//             if (confirmResult.isConfirmed) {
//                 action(true);
    
//                 const response = await deleteData(`mobinate_vs_cats/delete_mobinet_file/`, {
//                     data: { filename: `${fileName}`, foldername: `${back_folder}`}
//                 });
    
//                 action(false);
//                 if (response?.status) {
//                     fetchApiData(api)
//                     Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
//                 } else {
//                     Swal.fire({ icon: "error", title: "Oops...", text: response.message });
//                 }
//             } else {
//                 // Optional: do something when deletion is cancelled
//                 console.log("Deletion cancelled.");
//             }
//         }
    
//         useEffect(() => {
//             const title = window.location.pathname
//                 .slice(1)
//                 .replaceAll("_", " ")
//                 .replaceAll("/", " | ")
//                 .toUpperCase();
//             document.title = title;
//         }, []);
    
//   return (
//     <> 
//             <Box m={1} ml={2}>
//                 <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                     <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
//                     <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>PERFORMANCE AT TAT</Link>
//                     <Typography color="text.primary">File Manager</Typography>
//                 </Breadcrumbs>
//             </Box>
//             <Box sx={{ margin: '20px' }}>
//                 <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                     {jsonData.map((item, index) => (
//                         <Grid item xs={4} key={index}>
//                             <Box
//                                 onClick={() => handleOpen(item.folder_name, item.api, item.back_folder)}
//                                 sx={{
//                                     border: '1px solid black',
//                                     cursor: 'pointer',
//                                     display: 'flex',
//                                     gap: '10px',
//                                     padding: 1,
//                                     alignItems: 'center',
//                                     borderRadius: '5px',
//                                     boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
//                                     '&:hover': { backgroundColor: '#223354', color: 'white' },

//                                 }}
//                             >
//                                 <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
//                                 <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
//                             </Box>
//                         </Grid>
//                     ))}
//                 </Grid>
//             </Box>

//             {/* Dialog Rendered Normally */}
//             {open2 && <Dialog
//                 fullWidth
//                 maxWidth="lg"
//                 TransitionComponent={Transition}
//                 open={open2}
//                 onClose={handleClose}
//                 sx={{ zIndex: 2 }}
//             >
//                 <DialogTitle>
//                     <span style={{ float: 'left' }}>
//                         <h2>{dialogData.foldername}</h2>
//                     </span>
//                     <span style={{ float: 'right' }}>
//                         <IconButton size="large" onClick={handleClose}>
//                             <CloseIcon />
//                         </IconButton>
//                     </span>
//                 </DialogTitle>
//                 <DialogContent>
//                     <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
//                         <Box>
//                             <UploadSection
//                                 // label="Select Mobinet Dump Files"
//                                 color={selectFiles.length > 0 ? "warning" : "primary"}
//                                 multiple
//                                 onChange={(e) => {
//                                     setSeletctFiles(Array.from(e.target.files))
//                                     setShowError((prev) => ({ ...prev, selectfile: false }));
//                                 }}
//                                 error={showError.selectfile}
//                                 selectedText={selectFiles.length > 0 ? `Selected File(s): ${selectFiles.length}` : ""}
//                             />

//                         </Box>
//                         <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
//                     </Box>
//                     {showFiles.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
//                         <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
//                             {showFiles.map((item, index) => (
//                                 <Grid item xs={4} key={index}>
//                                     <Box key={item} sx={{ display: "flex", 
//                                     justifyContent: 'flex-start', alignItems: 'center', 
//                                     cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
//                                      padding: 0.5, background: '#e9e9e9',
//                                      '&:hover': { backgroundColor: '#223354', color: 'white' }
//                                      }}
//                                         onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
//                                     >
//                                         <TopicIcon sx={{ color: '#FEA405' }} />{item}
//                                     </Box>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                             <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
//                         </Box>
//                     </Box>}
//                 </DialogContent>
//             </Dialog>}

//             {loading}

//         </>
//     );
// };

// const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
//     return (
//         <Box >
//             <div className={OverAllCss().Front_Box_Hading}>{label}</div>
//             <div className={OverAllCss().Front_Box_Select_Button}>
//                 <Button variant="contained" component="label" color={color}>
//                     Select File
//                     <input
//                         hidden
//                         required
//                         type="file"
//                         accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
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
        
//   )
// }

// export default File_Manager

import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Breadcrumbs, Link, Typography, Button
} from '@mui/material';
import {
    Upload as UploadIcon,
    DoDisturb as DoDisturbIcon,
    FileDownload as FileDownloadIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@mui/icons-material";
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import TopicIcon from '@mui/icons-material/Topic';
import OverAllCss from "../../../csss/OverAllCss";
import { postData, getData, deleteData } from "../../../services/FetchNodeServices";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const jsonData = [
    { folder_name: "Performance AT", api: "performance_idploy/upload" ,back_folder:"stock_report_data" }
];

const Transition = React.forwardRef(function Transition(props, ref) {
    return (
        <Slide
            direction="down"
            timeout={2500}
            style={{ transformOrigin: '0 0 0' }}
            mountOnEnter
            unmountOnExit
            ref={ref}
            {...props}
        />
    );
});

const File_Manager = () => {
    const [open2, setOpen2] = useState(false);
        const [dialogData, setDialogData] = useState()
        const navigate = useNavigate()
        const { loading, action } = useLoadingDialog();
        const [showFiles, setShoweFiles] = useState([])
        const [selectFiles, setSeletctFiles] = useState([])
        const [showError, setShowError] = useState({
            selectfile: false,
        });

        // ✅ FIX 1: use try/finally so action(false) ALWAYS runs
        // even when GET returns "Method not allowed" — this stops the frozen loader
        const fetchApiData = async (api) => {
            action(true)
            try {
                const response = await getData(`${api}/`);
                console.log("API response:", response);  // <-- log the full response for debugging
                if (response?.status) {
                    setShoweFiles([response?.input_file?.filename]);
                }
            } finally {
                action(false);  // ← always stops loader regardless of response
            }
        }
    
        const handleOpen = (foldername, apikey , back_folder) => {
            fetchApiData(apikey)
            setOpen2(true);
            setDialogData({ foldername: foldername, apikey: apikey , back_folder: back_folder })
            // console.log('data', foldername, apikey)
        }

        const handleClose = () => {
            setOpen2(false);
            setShoweFiles([])
            setDialogData()
            setShowError({ selectfile: false })
            setSeletctFiles([])
        }
    
        const handleSubmit = async (api) => {
            const isValid = selectFiles.length > 0;
    
            if (!isValid) {
                setShowError({
                    selectfile: selectFiles.length === 0,
                });
                return;
            }
    
            action(true);
            const formData = new FormData();
            Array.from(selectFiles).forEach((file) => {
                formData.append("file", file);
            });
            const response = await postData(`${api}/`, formData);
            // const response = await postData(`idploy/upload/`, formData);
            action(false);

            // ✅ FIX 2: backend returns {message, status:true} — check both to be safe
            if (response?.status || response?.message) {
                fetchApiData(api);
                setShowError({ selectfile: false })  // ✅ FIX 3: was incorrectly set to true
                setSeletctFiles([])
                Swal.fire({ icon: "success", title: "Done", text: response.message });
            } else {
                Swal.fire({ icon: "error", title: "Oops...", text: response.message });
            }
        }

        const handleDelete = async (api) => {
            const confirmResult = await Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });
    
            if (confirmResult.isConfirmed) {
                action(true);
    
                const response = await deleteData(`${api}/`);
                // const response = await deleteData("idploy/cleanup/");
                console.log("response", response);
    
                action(false);
    
                if (response?.status) {
                    setShoweFiles([]);
                    Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: response.message });
                }
            } else {
                // Optional: do something when deletion is cancelled
                console.log("Deletion cancelled.");
            }
        };
    
        const OneFileDelete = async(fileName,api,back_folder) => {
           const confirmResult = await Swal.fire({
                title: "Are you sure?",
                text: `Want to delete ${fileName} file!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });
    
            if (confirmResult.isConfirmed) {
                action(true);
    
                const response = await deleteData(`performance_idploy/upload/`, {
                    data: { filename: `${fileName}`, foldername: `${back_folder}`}
                });
    
                action(false);
                if (response?.status) {
                    fetchApiData(api)
                    Swal.fire({ icon: "success", title: "Deleted!", text: response.message });
                } else {
                    Swal.fire({ icon: "error", title: "Oops...", text: response.message });
                }
            } else {
                // Optional: do something when deletion is cancelled
                console.log("Deletion cancelled.");
            }
        }
    
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
                    <Link underline="hover" onClick={() => navigate("/tools/performance_at_tat")}>Performance At Tat</Link>
                    <Typography color="text.primary">File Manager</Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={{ margin: '20px' }}>
                <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                    {jsonData.map((item, index) => (
                        <Grid item xs={4} key={index}>
                            <Box
                                onClick={() => handleOpen(item.folder_name, item.api, item.back_folder)}
                                sx={{
                                    border: '1px solid black',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    gap: '10px',
                                    padding: 1,
                                    alignItems: 'center',
                                    borderRadius: '5px',
                                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                    '&:hover': { backgroundColor: '#223354', color: 'white' },
                                }}
                            >
                                <FolderIcon sx={{ color: '#FEA405', fontSize: 35 }} />
                                <Box sx={{ fontSize: 20, fontWeight: 'bold' }}>{item.folder_name}</Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Dialog Rendered Normally */}
            {open2 && <Dialog
                fullWidth
                maxWidth="lg"
                TransitionComponent={Transition}
                open={open2}
                onClose={handleClose}
                sx={{ zIndex: 2 }}
            >
                <DialogTitle>
                    <span style={{ float: 'left' }}>
                        <h2>{dialogData.foldername}</h2>
                    </span>
                    <span style={{ float: 'right' }}>
                        <IconButton size="large" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </span>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box>
                            <UploadSection
                                // label="Select Mobinet Dump Files"
                                color={selectFiles.length > 0 ? "warning" : "primary"}
                                multiple
                                onChange={(e) => {
                                    setSeletctFiles(Array.from(e.target.files))
                                    setShowError((prev) => ({ ...prev, selectfile: false }));
                                }}
                                error={showError?.selectfile}
                                selectedText={selectFiles?.length > 0 ? `Selected File(s): ${selectFiles?.length}` : ""}
                            />
                        </Box>
                        <Box><Button variant="contained" color="success" onClick={() => handleSubmit(dialogData?.apikey)} endIcon={<UploadIcon />}>Upload</Button></Box>
                    </Box>
                    {showFiles?.length > 0 && <Box sx={{ border: "2px solid black", borderRadius: '5px', padding: 2, marginTop: 1 }}>
                        <Grid container rowSpacing={2} columnSpacing={3} direction={{ xs: "column", sm: "column", md: "row" }}>
                            {showFiles?.map((item, index) => (
                                <Grid item xs={4} key={index}>
                                    <Box key={item} sx={{ display: "flex", 
                                    justifyContent: 'flex-start', alignItems: 'center', 
                                    cursor: 'pointer', border: '0px solid black', borderRadius: '5px',
                                     padding: 0.5, background: '#e9e9e9',
                                     '&:hover': { backgroundColor: '#223354', color: 'white' }
                                     }}
                                        onClick={() => OneFileDelete(item, dialogData?.apikey , dialogData?.back_folder)}
                                    >
                                        <TopicIcon sx={{ color: '#FEA405' }} />{item}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                            <Button onClick={() => handleDelete(dialogData?.apikey)} variant="contained" fullWidth color="error" endIcon={<DeleteIcon />}>Delete All</Button>
                        </Box>
                    </Box>}
                </DialogContent>
            </Dialog>}

            {loading}
        </>
    );
};

const UploadSection = ({ label, color, onChange, error, multiple = false, selectedText }) => {
    return (
        <Box >
            <div className={OverAllCss().Front_Box_Hading}>{label}</div>
            <div className={OverAllCss().Front_Box_Select_Button}>
                <Button variant="contained" component="label" color={color}>
                    Select File
                    <input
                        hidden
                        required
                        type="file"
                        accept=".csv, .xls, .xlsx, .xlsb, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/octet-stream"
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
    )
}

export default File_Manager