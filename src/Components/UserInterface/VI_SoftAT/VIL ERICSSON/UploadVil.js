import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import { postData, ServerURL } from "../../../services/FetchNodeServices";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DnsIcon from '@mui/icons-material/Dns';
import OverAllCss from "../../../csss/OverAllCss";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { getDecreyptedData } from "../../../utils/localstorage";

/* ------------------------------------------------------------------ */
/*  Theme — matched to the teal "Baseband Requirement" screens          */
/* ------------------------------------------------------------------ */
const C = {
    teal: "#006e74",
    tealDark: "#00494d",
    headerBg: "#004d52",
    labelOdd: "#e3f2f2",
    labelEven: "#f2fafa",
    border: "#c9dcdc",
    valueText: "#0d3a3c",
    zeroText: "#a7bcbc",
    tick: "#1a7f37",
    cross: "#c62828",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

const PINNED_KEY = "Site ID";

const buildColumns = (rows) => {
    if (!rows || !rows.length) return [];
    const keySet = new Set();
    rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
    keySet.delete(PINNED_KEY);
    return Array.from(keySet);
};

const isTickCross = (val) =>
    typeof val === "string" && (val.trim().startsWith("✓") || val.trim() === "✗" || val.trim() === "X");

const cellColor = (val) => {
    if (typeof val === "string") {
        const v = val.trim();
        if (v.startsWith("✓")) return C.tick;
        if (v === "✗" || v === "X") return C.cross;
        if (v === "") return C.zeroText;
    }
    if (val === 0) return C.zeroText;
    return C.valueText;
};

/* ------------------------------------------------------------------ */
/*  Results table shown below the download button                      */
/* ------------------------------------------------------------------ */
function BasebandResultTable({ rows }) {
    const columns = buildColumns(rows);
    const hasData = Array.isArray(rows) && rows.length > 0;

    if (!hasData) return null;

    return (
        <Box sx={{ mt: 4, px: { xs: 1, md: 3 } }}>
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", border: `1px solid ${C.border}` }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 1.25,
                        background: HEADER_GRADIENT,
                    }}
                >
                    <DnsIcon sx={{ color: "#bfe9e9", fontSize: 18 }} />
                    <Typography
                        variant="subtitle2"
                        sx={{ color: "#fff", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}
                    >
                        Baseband Site-wise Data
                    </Typography>
                </Box>

                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={{
                            borderCollapse: "collapse",
                            "& .MuiTableCell-root": { border: `1px solid ${C.border}`, py: 0.75, fontSize: 12.5 },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        position: "sticky",
                                        left: 0,
                                        top: 0,
                                        zIndex: 6,
                                        bgcolor: C.headerBg,
                                        color: "#fff",
                                        fontWeight: 700,
                                        minWidth: 100,
                                    }}
                                >
                                    {PINNED_KEY}
                                </TableCell>
                                {columns.map((c) => (
                                    <TableCell
                                        key={c}
                                        align="center"
                                        sx={{
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 4,
                                            bgcolor: C.teal,
                                            color: "#fff",
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                            minWidth: 90,
                                        }}
                                    >
                                        {String(c).trim()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, i) => {
                                const labelBg = i % 2 === 0 ? C.labelOdd : C.labelEven;
                                return (
                                    <TableRow key={row[PINNED_KEY] ?? i}>
                                        <TableCell
                                            sx={{
                                                position: "sticky",
                                                left: 0,
                                                zIndex: 2,
                                                bgcolor: labelBg,
                                                fontWeight: 700,
                                                color: C.tealDark,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row[PINNED_KEY] ?? "—"}
                                        </TableCell>
                                        {columns.map((c) => {
                                            const val = row[c];
                                            const display = val === "" || val == null ? "—" : val;
                                            return (
                                                <TableCell
                                                    key={c}
                                                    align="center"
                                                    sx={{
                                                        bgcolor: "#ffffff",
                                                        fontVariantNumeric: "tabular-nums",
                                                        color: cellColor(val),
                                                        fontWeight: isTickCross(val) ? 800 : 600,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {display}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}

const UploadVil = () => {
    const [make4GFiles, setMake4GFiles] = useState([])
    const [show4G, setShow4G] = useState(false)
    const [fileData, setFileData] = useState()
    const [download, setDownload] = useState(false);
    const [resultData, setResultData] = useState([]); // ✅ new: holds response.data for the table
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const classes = OverAllCss()


    const handle4GFileSelection = (event) => {

        setMake4GFiles(event.target.files)
    }


    const handleSubmit = async () => {
        if (make4GFiles.length > 0) {
            action(true)
            var formData = new FormData();
            for (let i = 0; i < make4GFiles.length; i++) {
                formData.append(`file`, make4GFiles[i]); 
            }

            const response = await postData('api/vil/', formData)

            // console.log('response data', response)


            if (response.status === true) {
                action(false)
                setDownload(true)

                setFileData(response.download_link)
                setResultData(Array.isArray(response.data) ? response.data : []) // ✅ store table rows

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });

            } else {
                action(false)

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            setShow4G(true);

        }
    }

    const handleCancel = () => {
        setMake4GFiles([])


        setShow4G(false)

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
                    <Typography color='text.primary'>Upload VIL</Typography>
                </Breadcrumbs>
            </div>
            <Slide
                direction='left'
                in={true}
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                            <Box className={classes.Box_Hading} >
                                Create VIL Summary
                            </Box>
                            <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>

                                <Box className={classes.Front_Box} >
                                    <div className={classes.Front_Box_Hading}>
                                        Select Log File:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                    </div>
                                    <div className={classes.Front_Box_Select_Button} >
                                        <div style={{ float: "left" }}>
                                            <Button variant="contained" component="label" color={make4GFiles.length > 0 ? "warning" : "primary"}>
                                                select file
                                                <input required hidden accept=".logs,log" multiple type="file"
                                                    // webkitdirectory="true"
                                                    // directory="true"
                                                    onChange={(e) => { handle4GFileSelection(e); setShow4G(false); }} />
                                            </Button>
                                        </div>

                                        {make4GFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {make4GFiles.length}</span>}

                                        <div>  <span style={{ display: show4G ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                    </div>
                                </Box>
                            </Stack>
                            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ display: download ? 'block' : 'none', textAlign: 'center' }}>
                        <a download href={fileData}><Button variant="outlined" onClick='' title="Export Excel" startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download VIL Details </span></Button></a>
                    </Box>

                    {/* ✅ New: results table showing the uploaded/parsed Baseband data */}
                    <BasebandResultTable rows={resultData} />
                </Box>
            </Slide>
            {loading}
        </>
    )
}

export default UploadVil