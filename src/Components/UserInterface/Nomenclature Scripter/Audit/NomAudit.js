import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import GearIcon from '@rsuite/icons/Gear';
import Slide from '@mui/material/Slide';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import * as ExcelJS from 'exceljs'
import _, { set } from "lodash";



const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']

const NomAudit = () => {
    const [fileData, setFileData] = useState()
    const [show, setShow] = useState(false)
    const [showPre, setShowPre] = useState(false)
    const [showPost, setShowPost] = useState(false)
    const [open, setOpen] = useState(false);
    const [download, setDownload] = useState(false);
    const classes = OverAllCss();
    var link = `${ServerURL}${fileData}`;
    const [preFiles, setPreFiles] = useState([]);
    const [postFiles, setPostFiles] = useState([]);
    const [st_cell, setSt_cell] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stData, setStData] = useState([])
    const [filterStData, setFilterStData] = useState([])
    const [dialogsitedata, setDialogsitedata] = useState(false)
    const [siteWiseData, setSiteWiseData] = useState([])
    const [selectCircle, setSelectCircle] = useState('')
    const [overAllDataShow, setOverAllDataShow] = useState([])


    // console.log('pre files', preFiles[0])

    // console.log('response data', _.uniq(st_cell.st_cell, 'PRE_IP_ADDR'));





    const handlePreFolderSelection = (event) => {
        // const selectedFiles = Array.from(event.target.files);
        // const filePaths = selectedFiles.map(file => file.webkitRelativePath);
        // console.log('filePaths', event.target.files)
        setPreFiles(event.target.files);
    };
    const handlePostFolderSelection = (event) => {
        // const selectedFiles = Array.from(event.target.files);
        // const filePaths = selectedFiles.map(file => file.webkitRelativePath);
        // console.log('post', event.target.files)
        setPostFiles(event.target.files);
    };





    const handleExport = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("ST Cell", { properties: { tabColor: { argb: 'f1948a' } } })
        const sheet1 = workbook.addWorksheet("ALTK", { properties: { tabColor: { argb: 'f4d03f' } } })
        const sheet2 = workbook.addWorksheet("HGET.TSS", { properties: { tabColor: { argb: '52be80' } } })
        const sheet3 = workbook.addWorksheet("pr EUtranFreqRelation=", { properties: { tabColor: { argb: 'af7ac5' } } })



        sheet.mergeCells('A1:A2');
        sheet.mergeCells('B1:I1');
        sheet.mergeCells('J1:Q1');
        sheet.mergeCells('R1:U1');

        sheet.getCell('A1').value = 'Sr. No.';
        sheet.getCell('B1').value = 'PRE';
        sheet.getCell('J1').value = 'POST';
        sheet.getCell('R1').value = 'AUDIT';
        sheet.getCell('U1').value = 'OVERALL';

        sheet.getCell('B2').value = 'Proxy';
        sheet.getCell('C2').value = 'Adm.';
        sheet.getCell('D2').value = 'Adm. State';
        sheet.getCell('E2').value = 'Op.';
        sheet.getCell('F2').value = 'Op. State';
        sheet.getCell('G2').value = 'MO';
        sheet.getCell('H2').value = 'Date & Time(UTC)';
        sheet.getCell('I2').value = 'IP ADDR';

        sheet.getCell('J2').value = 'IP ADDR';
        sheet.getCell('K2').value = 'IP ADDR';
        sheet.getCell('L2').value = 'IP ADDR';
        sheet.getCell('M2').value = 'IP ADDR';
        sheet.getCell('N2').value = 'IP ADDR';
        sheet.getCell('O2').value = 'IP ADDR';
        sheet.getCell('P2').value = 'IP ADDR';

        // circleWiseData?.map(item => {
        //     sheet.addRow({
        //       circle: item?.circle,
        //       Accepted: item?.Accepted,
        //       // Dismantle: item?.Dismantle,
        //       Need_to_be_offer: item?.Need_to_be_offer,
        //       // offered: item?.offered,
        //       Rejected: item?.Rejected,
        //       Pending: item?.Pending,
        //       Total: item?.Total,
        //     })
        //   })


        sheet.eachRow((row, rowNumber) => {
            const rows = sheet.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                if (rowNumber === rowsCount) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FE9209' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                }
                if (rowNumber == 1) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
                }
            })
        })
        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "soft-at.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }




    const handleSubmit = async () => {
        if (preFiles.length > 0 && postFiles.length > 0 && selectCircle !== "") {
            setOpen(true)
            var formData = new FormData();
            for (let i = 0; i < preFiles.length; i++) {
                // console.log('pre files' , preFiles[i])
                formData.append(`pre_files`, preFiles[i]);
            }
            for (let i = 0; i < postFiles.length; i++) {
                // console.log('post files' , postFiles[i])
                formData.append(`post_files`, postFiles[i]);
            }

            formData.append('circle', selectCircle)

            const response = await postData('NOM_AUDIT/pre_post_audit_process/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })

            console.log('response data', response.pre_post_json)


            if (response.Status === true) {
                setOpen(false)
                setDownload(true)

                setFileData(response.Download_url)
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.message}`,
                });
                // console.log('sssssssssssssssssssss', response)
                setStData(response.pre_post_json.st_cell)
                preTableData(response.pre_post_json.st_cell)


            } else {
                setOpen(false)

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${response.message}`,
                });
            }
        }
        else {
            if (preFiles.length === 0) {
                setShowPre(true)
            } else {
                setShowPre(false)
            }
            if (postFiles.length === 0) {
                setShowPost(true)
            } else {
                setShowPost(false)
            }
            if (selectCircle === "") {
                setShow(true)
            } else {
                setShow(false)
            }

        }
    };


    const preTableData = (data) => {
        const groupedData = _.groupBy(data, 'PRE_IP_ADDR');
        // Calculate counts of PRE_MO and POST_MO for each unique PRE_IP_ADDR
        // console.log('filterssssss',Object.keys(groupedData).length)
        // console.log('count of ok or not ok', _.countBy(data, data => data.OverAll_Status === 'OK'))
        let TotalCount = Object.keys(groupedData).length;
        let Accepted = _.countBy(data, data => data.OverAll_Status === 'OK');
        // console.log('box count' , [TotalCount, Accepted])
        const result = Object.keys(groupedData).map(preIp => {
            // console.log('filterssssss' ,_.filter(groupedData[preIp]fc, data=> data.audit_MO === "OK").length )

            const preMoCount = groupedData[preIp].length; // Count of PRE_MO (number of entries for each PRE_IP_ADDR)
            const postMoCount = _.filter(groupedData[preIp], data => data.OverAll_Status === "OK").length; // Count of unique POST_MO for each PRE_IP_ADDR

            return { preIp, preMoCount, postMoCount };
        });

        setSt_cell(result);
        setOverAllDataShow([TotalCount, Accepted])

    }

    const filetrIPAdd = (ip) => {
        let result = _.filter(stData, data => data.PRE_IP_ADDR === ip)
        console.log('filter dataa', result)
        setSiteWiseData(result)
        let preAdm = _.countBy(result, data => data.PRE_State == '(UNLOCKED)');
        let preOp = _.countBy(result, data => data.PRE_State_1 === '(ENABLED)');
        let postAdm = _.countBy(result, data => data.POST_State === '(UNLOCKED)');
        let postOp = _.countBy(result, data => data.POST_State_1 === '(ENABLED)');
        let auditMO = _.countBy(result, data => data.audit_MO == 'OK');
        let auditMOError = _.countBy(result, data => data.audit_MO == 'ERROR');
        let auditMONotok = _.countBy(result, data => data.audit_MO == 'NOT OK');
        let auditAdmState = _.countBy(result, data => data.audit_AdmState == 'OK');
        let auditOpState = _.countBy(result, data => data.audit_OpState == 'OK');
        let auditIPADDR = _.countBy(result, data => data.audit_IP_ADDR == 'OK');
        let overAllStatusData = _.countBy(result, data => data.OverAll_Status == 'OK');
        // let temp2 = _.countBy(result , data => data.audit_MO == 'NOT OK');
        console.log('temp filter', [{ ip, preAdm, preOp, postAdm, postOp, auditAdmState, auditOpState, auditMO, auditMOError, auditIPADDR }])
        setFilterStData([{ ip, preAdm, preOp, postAdm, postOp, auditAdmState, auditOpState, auditMO, auditMOError, auditMONotok, auditIPADDR, overAllStatusData }])
        setDialogOpen(true)
    }

    const handleCancel = () => {
        setPreFiles([]);
        setPostFiles([]);
        setSelectCircle("")
    }

    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = useCallback(() => {
        return (
            <Dialog
                open={open}
                // TransitionComponent={Transition}
                keepMounted
            // aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box>
                    <Box >DATA UNDER PROCESSING...</Box>
                </DialogContent>

            </Dialog>
        )
    }, [open])




    const Dialogtable = useCallback(() => {
        return (
            <Dialog
                open={dialogOpen}
                keepMounted
                // fullScreen
                maxWidth={'lg'}
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
                }}
                style={{ zIndex: 2, marginTop: '4%' }}
            >
                <DialogTitle>
                    <IconButton size="large" onClick={() => { setDialogOpen(false) }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent >
                    <TableContainer sx={{ maxHeight: 500, width: '100%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, color: "black", border: '1px solid white' }}>
                                    <th rowSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#FF9900' }}>Site ID</th>
                                    <th colSpan='4' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#66CCFF' }}>PRE</th>
                                    <th colSpan='4' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#538DD5' }}>POST</th>
                                    <th colSpan='9' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#DA9694' }}>AUDIT</th>
                                    <th colSpan='2' rowSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#FFFFFF' }}>Over-All</th>
                                </tr>
                                <tr style={{ fontSize: 15, border: '1px solid white' }}>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Adm. State (Count)</th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Op. State (Count)</th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Adm. State (Count)</th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Op. State (Count)</th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Adm. State </th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Op. State </th>
                                    <th colSpan='3' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>MO </th>
                                    <th colSpan='2' style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>IP Add.</th>
                                </tr>
                                <tr style={{ fontSize: 13, border: '1px solid white' }}>
                                    {/* Pre State unlock lock count */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#DAEEF3' }}>UNLOCKED </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#DAEEF3' }}>LOCKED </th>
                                    {/* pre State  enable disable count */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#DAEEF3' }}>ENABLED </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#DAEEF3' }}>DISABLED </th>
                                    {/* POST State unlock lock count */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#C5D9F1' }}>UNLOCKED </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#C5D9F1' }}>LOCKED </th>
                                    {/* POST State  enable disable count */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#C5D9F1' }}>ENABLED </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#C5D9F1' }}>DISABLED </th>
                                    {/* Adm. State */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>NOT OK</th>
                                    {/* Op. State */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>NOT OK</th>
                                    {/* OM */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>NOT OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#7E60BF', color: 'white' }}>ERROR</th>
                                    {/* IP Add. */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#F2DCDB' }}>NOT OK</th>
                                    {/* Over-All */}
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFFFFF' }}>OK</th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#FFFFFF' }}>NOT OK</th>

                                </tr>
                                {/* <tr style={{ fontSize: 15, border: '1px solid white' }}>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Proxy</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Adm</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Adm. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Op.</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Op. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>MO</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>Date & Time(UTC)</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#CCECFF' }}>IP Add.</th>

                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Proxy</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Adm</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Adm. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Op.</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Op. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>MO</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>Date & Time(UTC)</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#C7DBEF' }}>IP Add.</th>

                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Adm. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Op. State</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>MO</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>IP Add</th>


                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#ffffff' }}>Status</th>
                                </tr> */}
                            </thead>
                            <tbody>

                                {filterStData?.map((it, i) => (
                                    <tr key={i} className={classes.hover} onClick={() => { setDialogsitedata(true) }} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th style={{}}>{it.ip}</th>
                                        <th style={{ color: 'green' }}>{it.preAdm?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.preAdm?.false || 0}</th>
                                        <th style={{ color: 'green' }}>{it.preOp?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.preOp?.false || 0}</th>
                                        <th style={{ color: 'green' }}>{it.postAdm?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.postAdm?.false || 0}</th>
                                        <th style={{ color: 'green' }}>{it.postOp?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.postOp?.false || 0}</th>
                                        <th style={{ color: 'green' }}>{it.auditAdmState?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.auditAdmState?.false || 0}</th>
                                        <th style={{ color: 'green' }}>{it.auditOpState?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.auditOpState?.false || 0}</th>
                                        {/* MO section */}
                                        <th style={{ color: 'green' }}>{it.auditMO?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.auditMONotok?.true || 0}</th>
                                        <th style={{ color: '#7E60BF' }}>{it.auditMOError?.true || 0}</th>
                                        {/* end MO section */}
                                        <th style={{ color: 'green' }}>{it.auditIPADDR?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.auditIPADDR?.false || 0}</th>
                                        {/* overAllStatusData */}
                                        <th style={{ color: 'green' }}>{it.overAllStatusData?.true || 0}</th>
                                        <th style={{ color: 'red' }}>{it.overAllStatusData?.false || 0}</th>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        )
    }, [dialogOpen])
    const DialogSiteData = useCallback(() => {
        return (
            <Dialog
                open={dialogsitedata}
                keepMounted
                fullScreen
                maxWidth={'lg'}
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
                }}
                style={{ zIndex: 2, marginTop: '4%' }}
            >
                <DialogTitle>
                    <IconButton size="large" onClick={() => { setDialogsitedata(false) }}><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent >
                    <TableContainer sx={{ maxHeight: 450, width: '100%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, color: "black", border: '1px solid white' }}>
                                    <th colSpan='6' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#66CCFF' }}>PRE</th>
                                    <th colSpan='6' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#538DD5' }}>POST</th>
                                    <th colSpan='4' style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#DA9694' }}>AUDIT</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#DA9694' }}>OverAll</th>
                                </tr>
                                <tr style={{ fontSize: 15, border: '1px solid white' }}>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Proxy</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Adm. State</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Op. State</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>MO</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>Date & Time(UTC)</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#B7DEE8' }}>IP Address</th>


                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Proxy</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Adm. State</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Op. State</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>MO</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>Date & Time(UTC)</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#8DB4E2' }}>IP Address</th>




                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Ad. mState</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Op. State</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>MO</th>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>IP Address</th>


                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', backgroundColor: '#E6B8B7' }}>Status</th>



                                </tr>


                            </thead>
                            <tbody>
                                {siteWiseData?.map((it, i) => (
                                    <tr key={i} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.PRE_Proxy}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.PRE_Adm}{it.PRE_State}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.PRE_Op_}{it.PRE_State_1}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.PRE_MO}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it?.PRE_Date__Time_UTC}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.PRE_IP_ADDR}</th>

                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.POST_Proxy}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.POST_Adm}{it.POST_State}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.POST_Op_}{it.POST_State_1}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.POST_MO}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it?.POST_Date__Time_UTC}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.POST_IP_ADDR}</th>

                                        <th style={{ padding: '5px 10px', border: '1px solid black', color: it.audit_AdmState == 'OK' ? 'green' : 'red' }}>{it.audit_AdmState}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black', color: it.audit_OpState == 'OK' ? 'green' : 'red' }}>{it.audit_OpState}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black', color: it.audit_MO == 'OK' ? 'green' : 'red' }}>{it.audit_MO}</th>
                                        <th style={{ padding: '5px 10px', border: '1px solid black', color: it.audit_IP_ADDR == 'OK' ? 'green' : 'red' }}>{it.audit_IP_ADDR}</th>

                                        <th style={{ padding: '5px 10px', border: '1px solid black' }}>{it.OverAll_Status}</th>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        )

    }, [dialogsitedata])



    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [dialogOpen])
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <div>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/tools/nomenclature_scriptor'>Nomenclature Scriptor</Link>
                        <Typography color='text.primary'>Nomenclature Audit</Typography>
                    </Breadcrumbs>
                </div>

                <Slide
                    direction='left'
                    in='true'
                    // style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box>
                        <Box className={classes.main_Box}>
                            <Box className={classes.Back_Box} sx={{ width: { md: '75%', xs: '100%' } }}>
                                <Box className={classes.Box_Hading} >
                                    Generate Nomenclature Audit
                                </Box>
                                <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                                    <Box className={classes.Front_Box}>
                                        <Box className={classes.Front_Box_Hading}>
                                            Select Circle
                                        </Box>
                                        <Box className={classes.Front_Box_Select_Button} >
                                            <FormControl sx={{ minWidth: 150 }}>
                                                <InputLabel id="demo-simple-select-label">Select Circle</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectCircle}
                                                    label="Select Circle"
                                                    onChange={(event) => { setSelectCircle(event.target.value); setShow(false) }}
                                                >
                                                    <MenuItem value={'AP'}>AP</MenuItem>
                                                    <MenuItem value={'DL'}>DL</MenuItem>
                                                    <MenuItem value={'JK'}>JK</MenuItem>

                                                </Select>
                                            </FormControl>
                                            <div>  <span style={{ display: show ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </Box>

                                    </Box>
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Pre Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={preFiles.length > 0 ? "warning" : "primary"}>
                                                    select file
                                                    <input required hidden accept="/*" multiple type="file"
                                                        // webkitdirectory="true"
                                                        // directory="true"
                                                        onChange={(e) => { handlePreFolderSelection(e); setShowPre(false); }} />
                                                </Button>
                                            </div>

                                            {preFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {preFiles.length}</span>}

                                            <div>  <span style={{ display: showPre ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </div>
                                    </Box>
                                    {/* post files */}
                                    <Box className={classes.Front_Box} >
                                        <div className={classes.Front_Box_Hading}>
                                            Select Post Files:-<span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}>{ }</span>
                                        </div>
                                        <div className={classes.Front_Box_Select_Button} >
                                            <div style={{ float: "left" }}>
                                                <Button variant="contained" component="label" color={postFiles.length > 0 ? "warning" : "primary"}>
                                                    select file
                                                    <input required hidden accept="/*" multiple type="file"

                                                        onChange={(e) => { handlePostFolderSelection(e); setShowPost(false) }} />
                                                </Button>
                                            </div>

                                            {postFiles.length > 0 && <span style={{ color: 'green', fontSize: '18px', fontWeight: 600 }}>Selected File(s) : {postFiles.length}</span>}

                                            <div>  <span style={{ display: showPost ? 'inherit' : 'none', color: 'red', fontSize: '18px', fontWeight: 600 }}>This Field Is Required !</span> </div>
                                        </div>
                                    </Box>



                                </Stack>
                                <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                                    <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<UploadIcon />}>Submit</Button>

                                    <Button variant="contained" onClick={handleCancel} style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >cancel</Button>

                                </Stack>
                            </Box>
                            <Box sx={{ display: download ? 'block' : 'none' }}>
                                <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download NOM Audit</span></Button></a>
                            </Box>
                            {/* over all data block in box formet */}
                            <Box sx={{ display: download ? 'block' : 'none', marginTop: '20px', width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ height: '15vh', width: '45vh', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: '#B0EBB4', textAlign: 'center' }}>
                                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total No. Of Sites Count</Box>
                                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}>{overAllDataShow && overAllDataShow[0]}</Box>
                                    </Box>
                                    <Box sx={{ height: '15vh', width: '45vh', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: '#A0DEFF', textAlign: 'center' }}>
                                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total No. Of  ' OK ' Count</Box>
                                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}>{overAllDataShow && overAllDataShow[1]?.true}</Box>
                                    </Box>
                                    <Box sx={{ height: '15vh', width: '45vh', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: '#FF9F66', textAlign: 'center' }}>
                                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total No. Of  ' NOT OK ' Count</Box>
                                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}>{overAllDataShow && overAllDataShow[1]?.false}</Box>
                                    </Box>
                                </Box>
                            </Box>


                            {/* Table in which show data pre count and post count and site id */}
                            <Slide direction='left' in={download} timeout={1000}>
                                <TableContainer sx={{ maxHeight: 400, width: '100%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', marginTop: "20px" }} component={Paper}>
                                <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                                 OK Sites
                                </Box>
                                    <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Site ID</th>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Pre Count</th>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Post Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {st_cell?.map((it, i) => {

                                                if (it.preMoCount === it.postMoCount) {
                                                    return (<tr key={i} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                        <th className={classes.hover} onClick={() => { filetrIPAdd(it.preIp); }} style={{ color: it.preMoCount === it.postMoCount ? 'green' : 'red', cursor: 'pointer' }}>{it.preIp}</th>
                                                        <th >{it.preMoCount}</th>
                                                        <th >{it.postMoCount}</th>
                                                    </tr>)
                                                }

                                            })}
                                        </tbody>
                                    </table>
                                </TableContainer>

                            </Slide>

                            <Slide direction='left' in={download} timeout={1000}>
                                
                                <TableContainer sx={{ maxHeight: 400, width: '100%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', marginTop: "20px" }} component={Paper}>
                                <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                                    NOT OK Sites
                                </Box>
                                    <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                            <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Site ID</th>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Pre Count</th>
                                                <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#2F75B5' }}>Post Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {st_cell?.map((it, i) => {

                                                if (it.preMoCount !== it.postMoCount) {
                                                    return (<tr key={i} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                        <th className={classes.hover} onClick={() => { filetrIPAdd(it.preIp); }} style={{ color: it.preMoCount === it.postMoCount ? 'green' : 'red', cursor: 'pointer' }}>{it.preIp}</th>
                                                        <th >{it.preMoCount}</th>
                                                        <th >{it.postMoCount}</th>
                                                    </tr>)
                                                }

                                            })}
                                        </tbody>
                                    </table>
                                </TableContainer>

                            </Slide>
                        </Box>
                        {loadingDialog()}
                        {Dialogtable()}
                        {DialogSiteData()}
                    </Box>

                    {/* {handleError()} */}
                </Slide>

            </div>
        </>
    )
}

export default NomAudit