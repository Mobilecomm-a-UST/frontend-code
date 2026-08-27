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

// ─────────────────────────────────────────────────────────────────────────────
// API contract (api/upload_data/):
//   request:  FormData with keys —
//     files          -> the .txt summary file
//     hui2_file      -> the .xlsx NE report file
//     cir            -> circle code, e.g. "UPW"
//     reg            -> region, e.g. "NORTH"
//     cellid_parent  -> optional, defaults to "NA" if left blank
//     cellid_new     -> optional, defaults to "NA" if left blank
//   response: {
//     status: true,
//     message: "Huawei Soft AT Summary generated successfully.",
//     download_url: ".../Huawei_soft_at_summary/output/SBDR04_Summary.xlsx",
//   }
// ─────────────────────────────────────────────────────────────────────────────

// NOTE: confirm this list against the real set of valid circle codes — "UPW"
// (from the Postman example) has been added to the previous list.
const circleArray = ['AP', 'CH', 'KK', 'DL', 'HR', 'RJ', 'JK', 'WB', 'OD', 'MU', 'TNCH', 'UE', 'BH', 'UW', 'MP', 'PB', 'KO', 'JH', 'UPW']

// NOTE: confirm this list against the real set of valid regions — only
// "NORTH" was confirmed from the Postman example.
const regionArray = ['NORTH', 'SOUTH', 'EAST', 'WEST']

const DOWNLOAD_LABELS = {
    download_url: "Huawei Soft AT Summary",
};

const VI_Huawei = () => {
    const [txtFile, setTxtFile] = useState(null)          // -> "files"
    const [excelFile, setExcelFile] = useState(null)      // -> "hui2_file"
    const [selectCircle, setSelectCircle] = useState('')  // -> "cir"
    const [selectRegion, setSelectRegion] = useState('')  // -> "reg"
    const [cellIdParent, setCellIdParent] = useState('')  // -> "cellid_parent" (optional, defaults to "NA")
    const [cellIdNew, setCellIdNew] = useState('')   
    const [activityid, setActivityid] = useState('')      // -> "cellid_new" (optional, defaults to "NA")

    const [showErrors, setShowErrors] = useState({
        txtFile: false,
        excelFile: false,
        circle: false,
        region: false,
    })

    const [downloadLinks, setDownloadLinks] = useState(null) // { download_url }
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const classes = OverAllCss()

    const handleTxtFileSelection = (event) => {
        const file = event.target.files[0]
        if (file) {
            setTxtFile(file)
            setShowErrors((prev) => ({ ...prev, txtFile: false }))
        }
    }

    const handleExcelFileSelection = (event) => {
        const file = event.target.files[0]
        if (file) {
            setExcelFile(file)
            setShowErrors((prev) => ({ ...prev, excelFile: false }))
        }
    }

    const handleSubmit = async () => {
        const isValid = !!txtFile && !!excelFile && selectCircle !== '' && selectRegion !== ''

        if (!isValid) {
            setShowErrors({
                txtFile: !txtFile,
                excelFile: !excelFile,
                circle: selectCircle === '',
                region: selectRegion === '',
            })
            return
        }

        action(true)
        const formData = new FormData()
        formData.append('files', txtFile)
        formData.append('hui2_file', excelFile)
        formData.append('cir', selectCircle)
        formData.append('reg', selectRegion)
        formData.append('cellid_parent', cellIdParent.trim() || 'NA')
        formData.append('cellid_new', cellIdNew.trim() || 'NA')
        formData.append('activity', activityid.trim() || 'New Site')

        const response = await postData('huawei_soft_at_summary/upload_data/', formData)
        action(false)

        if (response?.status === true) {
            setDownloadLinks({
                download_url: response.download_url,
            })
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `${response.message}`,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${response?.message || "Something went wrong"}`,
            });
        }
    }

    const handleCancel = () => {
        setTxtFile(null)
        setExcelFile(null)
        setSelectCircle('')
        setSelectRegion('')
        setCellIdParent('')
        setCellIdNew('')
        setShowErrors({ txtFile: false, excelFile: false, circle: false, region: false })
        setDownloadLinks(null)
    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>VI Soft-AT Tool</Link>
                    <Typography color='text.primary'>Huawei Soft AT Summary</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in='true'
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                Generate Huawei Soft AT Summary
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

                                {/* 1) Text summary file — key "files" */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Text File:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={txtFile ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".txt" type="file"
                                                    onChange={handleTxtFileSelection} />
                                            </Button>
                                        </div>
                                        {txtFile && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>{txtFile.name}</span>}
                                        <div><span style={{ display: showErrors.txtFile ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </div>
                                </Box>

                                {/* 2) Excel NE report file — key "hui2_file" */}
                                <Box className={classes.Front_Box}>
                                    <div className={classes.Front_Box_Hading}>
                                        Select Excel File:-
                                    </div>
                                    <div className={classes.Front_Box_Select_Button}>
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={excelFile ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type="file"
                                                    onChange={handleExcelFileSelection} />
                                            </Button>
                                        </div>
                                        {excelFile && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>{excelFile.name}</span>}
                                        <div><span style={{ display: showErrors.excelFile ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </div>
                                </Box>

                                {/* 3) Circle — key "cir" */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Circle
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <FormControl sx={{ minWidth: 150 }}>
                                            <InputLabel id="circle-select-label">Select Circle</InputLabel>
                                            <Select
                                                labelId="circle-select-label"
                                                id="circle-select"
                                                value={selectCircle}
                                                label="Select Circle"
                                                onChange={(event) => { setSelectCircle(event.target.value); setShowErrors((prev) => ({ ...prev, circle: false })) }}
                                            >
                                                {circleArray.map((item, index) => (
                                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div><span style={{ display: showErrors.circle ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </Box>
                                </Box>

                                {/* 4) Region — key "reg" */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Select Region
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <FormControl sx={{ minWidth: 150 }}>
                                            <InputLabel id="region-select-label">Select Region</InputLabel>
                                            <Select
                                                labelId="region-select-label"
                                                id="region-select"
                                                value={selectRegion}
                                                label="Select Region"
                                                onChange={(event) => { setSelectRegion(event.target.value); setShowErrors((prev) => ({ ...prev, region: false })) }}
                                            >
                                                {regionArray.map((item, index) => (
                                                    <MenuItem value={item} key={index}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <div><span style={{ display: showErrors.region ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span></div>
                                    </Box>
                                </Box>

                                {/* 5) Cell ID Parent — key "cellid_parent" (optional, defaults to "NA") */}

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
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Cell ID Parent
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            size="small"
                                            placeholder="NA"
                                            value={cellIdParent}
                                            onChange={(e) => setCellIdParent(e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        />
                                    </Box>
                                </Box>

                                {/* 6) Cell ID New — key "cellid_new" (optional, defaults to "NA") */}
                                <Box className={classes.Front_Box}>
                                    <Box className={classes.Front_Box_Hading}>
                                        Cell ID New
                                    </Box>
                                    <Box className={classes.Front_Box_Select_Button}>
                                        <TextField
                                            size="small"
                                            placeholder="NA"
                                            value={cellIdNew}
                                            onChange={(e) => setCellIdNew(e.target.value)}
                                            sx={{ minWidth: 200 }}
                                        />
                                    </Box>
                                </Box>

                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                            </Stack>
                        </Box>
                    </Box>

                    {/* Download link, shown once the backend returns it */}
                    {downloadLinks && (
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}
                        >
                            {Object.entries(downloadLinks).map(([key, url]) => (
                                url ? (
                                    <a key={key} download href={url} target="_blank" rel="noreferrer">
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
                            ))}
                        </Stack>
                    )}
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default VI_Huawei