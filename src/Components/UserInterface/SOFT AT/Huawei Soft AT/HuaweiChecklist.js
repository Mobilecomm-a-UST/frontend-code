import React, { useState, useEffect } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

// Circle codes
const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW'];

// Regions
const regionArray = ['NORTH', 'SOUTH'];

const DOWNLOAD_LABELS = {
    download_url: "Huawei Soft AT Summary",
};

const HuaweiChecklist = () => {
    const [txtFiles, setTxtFiles] = useState([]);
    const [excelFile, setExcelFile] = useState(null);
    const [selectCircle, setSelectCircle] = useState('');
    const [selectRegion, setSelectRegion] = useState('');
    const [cellIdParent, setCellIdParent] = useState('');
    const [cellIdNew, setCellIdNew] = useState('');
    const [activityid, setActivityid] = useState('');

    const [showErrors, setShowErrors] = useState({
        txtFile: false,
        excelFile: false,
        circle: false,
        region: false,
    });

    const [downloadLinks, setDownloadLinks] = useState(null);
    const { loading, action } = useLoadingDialog();
    const navigate = useNavigate();
    const classes = OverAllCss();

    const handleTxtFileSelection = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            setTxtFiles(files);
            setShowErrors((prev) => ({ ...prev, txtFile: false }));
        }
    };

    const handleExcelFileSelection = (event) => {
        const file = event.target.files[0];
        if (file) {
            setExcelFile(file);
            setShowErrors((prev) => ({ ...prev, excelFile: false }));
        }
    };

    const handleCircleChange = (event) => {
        setSelectCircle(event.target.value);
        setShowErrors((prev) => ({ ...prev, circle: false }));
    };

    const handleRegionChange = (event) => {
        setSelectRegion(event.target.value);
        setShowErrors((prev) => ({ ...prev, region: false }));
    };

    const handleSubmit = async () => {
        // Updated validation - removed excelFile requirement if not needed
        const isValid = txtFiles.length > 0 && selectCircle !== '' && selectRegion !== '';

        if (!isValid) {
            setShowErrors({
                txtFile: txtFiles.length === 0,
                excelFile: false,
                circle: selectCircle === '',
                region: selectRegion === '',
            });
            return;
        }

        try {
            action(true);
            const formData = new FormData();

            // Add text files
            txtFiles.forEach((file) => {
                formData.append('files', file);
            });

            // Add excel file if selected
            if (excelFile) {
                formData.append('files', excelFile);
            }

            formData.append('cir', selectCircle);
            formData.append('reg', selectRegion);
            // formData.append('cellid_parent', cellIdParent.trim() || 'NA');
            // formData.append('cellid_new', cellIdNew.trim() || 'NA');
            formData.append('activity', activityid.trim() || 'New Site');

            const response = await postData('huawei_soft_at_summary/upload_data/', formData);
            action(false);

            if (response?.status === true) {
                setDownloadLinks({
                    download_url: response.download_url,
                });
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: response.message || "File processed successfully",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response?.message || "Something went wrong",
                });
            }
        } catch (error) {
            action(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Failed to process file",
            });
        }
    };

    const handleCancel = () => {
        setTxtFiles([]);
        setExcelFile(null);
        setSelectCircle('');
        setSelectRegion('');
        setCellIdParent('');
        setCellIdNew('');
        setActivityid('');
        setShowErrors({ txtFile: false, excelFile: false, circle: false, region: false });
        setDownloadLinks(null);
    };

    useEffect(() => {
        document.title = "Huawei Soft AT";
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link underline="hover" onClick={() => navigate('/tools')} sx={{ cursor: 'pointer' }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => navigate('/tools/soft_at_tools')} sx={{ cursor: 'pointer' }}>
                        VI Soft-AT Tool
                    </Link>
                    <Typography color="text.primary">Huawei Soft AT</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction="left" in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading}>Generate Huawei Soft AT Summary</Box>

                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction="column">
                                {/* Text File Selection */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Text File:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={txtFiles.length > 0 ? "warning" : "primary"}
                                            >
                                                Select Files
                                                <input
                                                    required
                                                    hidden
                                                    multiple
                                                    accept=".txt,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                                    type="file"
                                                    onChange={handleTxtFileSelection}
                                                />
                                            </Button>
                                        </div>
                                        {txtFiles.length > 0 && (
                                            <span style={{ color: 'green', fontSize: '16px', fontWeight: 600 }}>
                                                Selected: {txtFiles.length} file(s)
                                            </span>
                                        )}
                                        <div>
                                            <span
                                                style={{
                                                    display: showErrors.txtFile ? 'inherit' : 'none',
                                                    color: 'red',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                This Field Is Required!
                                            </span>
                                        </div>
                                    </div>
                                </Box>

                                {/* Excel File Selection - Optional */}
                                {/* <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel File (Optional):-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                color={excelFile ? "warning" : "primary"}
                                            >
                                                Select File
                                                <input
                                                    hidden
                                                    accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                                    type="file"
                                                    onChange={handleExcelFileSelection}
                                                />
                                            </Button>
                                        </div>
                                        {excelFile && (
                                            <span style={{ color: 'green', fontSize: '16px', fontWeight: 600 }}>
                                                {excelFile.name}
                                            </span>
                                        )}
                                    </div>
                                </Box> */}

                                {/* Circle Selection */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Circle
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <FormControl sx={{ minWidth: 200 }}>
                                            <InputLabel id="circle-label">Select Circle</InputLabel>
                                            <Select
                                                labelId="circle-label"
                                                id="circle-select"
                                                value={selectCircle}
                                                label="Select Circle"
                                                onChange={handleCircleChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {circleArray.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div>
                                            <span
                                                style={{
                                                    display: showErrors.circle ? 'inherit' : 'none',
                                                    color: 'red',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                This Field Is Required!
                                            </span>
                                        </div>
                                    </Box>
                                </Box>

                                {/* Region Selection */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Region
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <FormControl sx={{ minWidth: 200 }}>
                                            <InputLabel id="region-label">Select Region</InputLabel>
                                            <Select
                                                labelId="region-label"
                                                id="region-select"
                                                value={selectRegion}
                                                label="Select Region"
                                                onChange={handleRegionChange}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {regionArray.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div>
                                            <span
                                                style={{
                                                    display: showErrors.region ? 'inherit' : 'none',
                                                    color: 'red',
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    marginLeft: '10px',
                                                }}
                                            >
                                                This Field Is Required!
                                            </span>
                                        </div>
                                    </Box>
                                </Box>

                                {/* Activity Field */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Activity
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            size="small"
                                            placeholder="New Site"
                                            value={activityid}
                                            onChange={(e) => setActivityid(e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        />
                                    </Box>
                                </Box>
                            </Stack>

                            {/* Action Buttons */}
                            <Stack
                                direction={{ xs: "column", sm: "column", md: "row" }}
                                spacing={2}
                                style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}
                            >
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSubmit}
                                    endIcon={<UploadIcon />}
                                    disabled={txtFiles.length === 0 || selectCircle === '' || selectRegion === ''}
                                >
                                    Submit
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={handleCancel}
                                    style={{ backgroundColor: "red", color: 'white' }}
                                    endIcon={<DoDisturbIcon />}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Download Links */}
                    {downloadLinks && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}
                        >
                            {Object.entries(downloadLinks).map(([key, url]) =>
                                url ? (
                                    <a key={key} href={url} download target="_blank" rel="noreferrer">
                                        <Button
                                            variant="outlined"
                                            startIcon={<FileDownloadIcon style={{ fontSize: 26, color: "green" }} />}
                                            sx={{ width: "auto" }}
                                        >
                                            <span style={{ fontFamily: "Poppins", fontSize: "16px", fontWeight: 700, textTransform: "none" }}>
                                                {DOWNLOAD_LABELS[key] || key}
                                            </span>
                                        </Button>
                                    </a>
                                ) : null
                            )}
                        </Stack>
                    )}
                </Box>
            </Slide>

            {loading}
        </>
    );
};

export default HuaweiChecklist;