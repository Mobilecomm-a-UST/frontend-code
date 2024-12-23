import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, DialogTitle, Stack } from "@mui/material";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import UploadIcon from '@mui/icons-material/Upload';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { postData, ServerURL, getData } from "../../../services/FetchNodeServices";
import OverAllCss from "../../../csss/OverAllCss";
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Zoom from '@mui/material/Zoom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import { CsvBuilder } from 'filefy';
import * as ExcelJS from 'exceljs'
import axios from "axios";
import Slide from '@mui/material/Slide';




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" timeout={1000} ref={ref}  {...props} />;
});

const circleOem = [{ id: 1, circle: 'AP', OEM: ['Ericsson (AP)'] },
{ id: 2, circle: 'BIH', OEM: ['Nokia (BIH)'] },
{ id: 3, circle: 'CHN', OEM: ['Ericsson (CHN)', 'Huawei (CHN)'] },
{ id: 4, circle: 'DEL', OEM: ['Ericsson (DEL)'] },
{ id: 5, circle: 'HRY', OEM: ['Ericsson (HRY)', 'ZTE (HRY)'] },
{ id: 6, circle: 'JK', OEM: ['Ericsson (JK)'] },
{ id: 7, circle: 'JRK', OEM: ['Nokia (JRK)'] },
{ id: 8, circle: 'KK', OEM: ['Huawei (KK)'] },
{ id: 9, circle: 'KOL', OEM: ['Samsung (KOL)', 'ZTE (KOL)'] },
{ id: 10, circle: 'MP', OEM: ['Nokia (MP)'] },
{ id: 11, circle: 'MUM', OEM: ['Nokia (MUM)'] },
{ id: 12, circle: 'ORI', OEM: ['Nokia (ORI)'] },
{ id: 13, circle: 'PUN', OEM: ['Nokia (PUN)', 'Samsung (PUN)', 'ZTE (PUN)'] },
{ id: 14, circle: 'RAJ', OEM: ['Ericsson (RAJ)'] },
{ id: 15, circle: 'ROTN', OEM: ['Ericsson (ROTN)', 'Huawei (ROTN)'] },
{ id: 16, circle: 'UPE', OEM: ['Nokia (UPE)'] },
{ id: 17, circle: 'UPW', OEM: ['Ericsson (UPW)', 'Huawei (UPW)'] },
{ id: 18, circle: 'WB', OEM: ['Nokia (WB)'] },];


const SoftAtStatus = () => {
    const classes = OverAllCss();
    const [toggalValue, setToggalValue] = useState('Date')
    const [date, setDate] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [circle, setCircle] = useState([])
    const [allcircle, setAllcircle] = useState([])
    const [oemList, setOemList] = useState([])
    const [selectOem, setSelectOem] = useState([])
    const [siteId, setSiteId] = useState('')
    const [fileData, setFileData] = useState()
    const [oemShow, setOemShow] = useState(false)
    const [open, setOpen] = useState(false);
    const [finalJson, setFinalJson] = useState([])
    const [jsonData, setJsonData] = useState([])
    const { loading, action } = useLoadingDialog()

    var link = `${ServerURL}${fileData}`;

    console.table(jsonData)

        // Download Key and value
        const columnData = [
            { title: 'Unique Key(Auto Generated)', field: 'unique_key' },
            { title: 'OEM', field: 'OEM' },
            { title: 'Integration Date', field: 'Integration_Date' },
            { title: 'CIRCLE', field: 'CIRCLE' },
            { title: 'Activity Name', field: 'Activity_Name' },
            { title: 'Site ID', field: 'Site_ID' },
            { title: 'MO NAME', field: 'MO_NAME' },
            { title: 'LNBTS ID', field: 'LNBTS_ID' },
            { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
            { title: 'OSS Details', field: 'OSS_Details' },
            { title: 'Cell ID', field: 'Cell_ID' },
            { title: 'CELL COUNT', field: 'CELL_COUNT' },
            { title: 'BSC NAME', field: 'BSC_NAME' },
            { title: 'BCF', field: 'BCF' },
            { title: 'TRX Count', field: 'TRX_Count' },
            { title: 'PRE ALARM', field: 'PRE_ALARM' },
            { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
            { title: 'RET', field: 'RET' },
            { title: 'POST VSWR', field: 'POST_VSWR' },
            { title: 'POST Alarms', field: 'POST_Alarms' },
            { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
            { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
            { title: 'Band (SIWA)', field: 'Band_SIWA' },
            { title: 'CELL STATUS', field: 'CELL_STATUS' },
            { title: 'CTR STATUS', field: 'CTR_STATUS' },
            { title: 'Integration Remark', field: 'Integration_Remark' },
            { title: 'T2T4R', field: 'T2T4R' },
            { title: 'BBU TYPE', field: 'BBU_TYPE' },
            { title: 'BB CARD', field: 'BB_CARD' },
            { title: 'RRU Type', field: 'RRU_Type' },
            { title: 'Media Status', field: 'Media_Status' },
            { title: 'Mplane IP', field: 'Mplane_IP' },
            { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
            { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
            { title: 'Site Status', field: 'Site_Status' },
            { title: 'External Alarm Confirmation', field: 'External_Alarm_Confirmation' },
            { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
            { title: 'LICENCE Status', field: 'LICENCE_Status' },
            { title: 'ESN NO', field: 'ESN_NO' },
            { title: 'Responsibility for alarm clearance', field: 'Responsibility_for_alarm_clearance' },
            { title: 'TAC', field: 'TAC' },
            { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
            { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
            { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
            { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
            { title: 'PCI L900', field: 'PCI_L900' },
            { title: '5G PCI', field: 'PCI_5G' },
            { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
            { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
            { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
            { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
            { title: 'RSI L900', field: 'RSI_L900' },
            { title: '5G RSI', field: 'RSI_5G' },
            { title: 'GPL', field: 'GPL' },
            { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
            { title: 'SPOC NAME', field: 'spoc_name' },
            { title: 'Offering Type', field: 'offering_type' },
            { title: 'First Offering Date', field: 'first_offering_date' },
            { title: 'Soft At Status', field: 'soft_at_status' },
            { title: 'Offering Date', field: 'offering_date' },
            { title: 'Acceptance / Rejection Date', field: 'acceptance_rejection_date' },
            { title: 'Alarm Bucket', field: 'alarm_bucket' },
            { title: 'Alarm Details', field: 'alarm_details' },
            { title: 'Final Responsibility (Circle Team/UBR Team/NOC Team)', field: 'final_responsibility' },
            { title: 'Workable/Non-Workable', field: 'workable_non_workable' },
            { title: 'UBR MS2 Status', field: 'ubr_ms2_status' },
            { title: 'UBR Link ID', field: 'ubr_link_id' },
            { title: 'TWAMP Status', field: 'twamp_status' },
            { title: 'Status Check Date', field: 'status_check_date' },
            { title: 'Ageing (in days)', field: 'ageing_in_days' },
            { title: 'Actual Ageing', field: 'actual_ageing' },
            { title: 'TOCO Partner', field: 'toco_partner' },
            { title: 'Support required from UBR Team', field: 'support_required_ubr_team' },
            { title: 'Support required from Circle Team', field: 'support_required_circle_team' },
            { title: 'Support required from NOC Team', field: 'support_required_noc_team' },
            { title: 'Category (HW/Media/Infra)', field: 'category' },
            { title: 'Problem Statement in detail', field: 'problem_statement' },
            { title: 'Final Remarks', field: 'final_remarks' },
            { title: 'MS1', field: 'ms1' },
        ];
        // // handleExport Range wise table in excel formet.........
        const handleExport = () => {
            var csvBuilder = new CsvBuilder(`SOFT_AT_STATUS_TRACKER.csv`)
                .setColumns(columnData.map(item => item.title))
                .addRows(jsonData.map(row => columnData.map(col => row[col.field])))
                .exportFile();
        }

        const handleExportExcel = () => {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Soft At Status", { properties: { tabColor: { argb: 'f1948a' } } })

            sheet.mergeCells('A1:CA1')

            sheet.getCell('A1').value = '! Attention: This template cannot be directly uploaded. Download the template from the Soft AT upload section in the tool, copy and paste this data there, and upload that template. Any modifications should only be made after pasting this data to the downloaded template.'
            // Add the column headers to the first row of the excel sheet
            sheet.getCell('A2').value = 'Unique Key(Auto Generated)'
            sheet.getCell('B2').value = 'OEM'
            sheet.getCell('C2').value = 'Integration Date'
            sheet.getCell('D2').value = 'CIRCLE'
            sheet.getCell('E2').value = 'Activity Name'
            sheet.getCell('F2').value = 'Site ID'
            sheet.getCell('G2').value = 'MO NAME'
            sheet.getCell('H2').value = 'LNBTS ID'
            sheet.getCell('I2').value = 'Technology (SIWA)'
            sheet.getCell('J2').value = 'OSS Details'
            sheet.getCell('K2').value = 'Cell ID'
            sheet.getCell('L2').value = 'CELL COUNT'
            sheet.getCell('M2').value = 'BSC NAME'
            sheet.getCell('N2').value = 'BCF'
            sheet.getCell('O2').value = 'TRX Count'
            sheet.getCell('P2').value = 'PRE ALARM'
            sheet.getCell('Q2').value = 'GPS IP CLK'
            sheet.getCell('R2').value = 'RET'
            sheet.getCell('S2').value = 'POST VSWR'
            sheet.getCell('T2').value = 'POST Alarms'
            sheet.getCell('U2').value = 'Activity Mode (SA/NSA)'
            sheet.getCell('V2').value = 'Activity Type (SIWA)'
            sheet.getCell('W2').value = 'Band (SIWA)'
            sheet.getCell('X2').value = 'CELL STATUS'
            sheet.getCell('Y2').value = 'CTR STATUS'
            sheet.getCell('Z2').value = 'Integration Remark'
            sheet.getCell('AA2').value = 'T2T4R'
            sheet.getCell('AB2').value = 'BBU TYPE'
            sheet.getCell('AC2').value = 'BB CARD'
            sheet.getCell('AD2').value = 'RRU Type'
            sheet.getCell('AE2').value = 'Media Status'
            sheet.getCell('AF2').value = 'Mplane IP'
            sheet.getCell('AG2').value = 'SCF PREPARED_BY'
            sheet.getCell('AH2').value = 'SITE INTEGRATE_BY'
            sheet.getCell('AI2').value = 'Site Status'
            sheet.getCell('AJ2').value = 'External Alarm Confirmation'
            sheet.getCell('AK2').value = 'SOFT AT STATUS'
            sheet.getCell('AL2').value = 'LICENCE Status'
            sheet.getCell('AM2').value = 'ESN NO'
            sheet.getCell('AN2').value = 'Responsibility for alarm clearance'
            sheet.getCell('AO2').value = 'TAC'
            sheet.getCell('AP2').value = 'PCI TDD 20'
            sheet.getCell('AQ2').value = 'PCI TDD 10/20'
            sheet.getCell('AR2').value = 'PCI FDD 2100'
            sheet.getCell('AS2').value = 'PCI FDD 1800'
            sheet.getCell('AT2').value = 'PCI L900'
            sheet.getCell('AU2').value = '5G PCI'
            sheet.getCell('AV2').value = 'RSI TDD 20'
            sheet.getCell('AW2').value = 'RSI TDD 10/20'
            sheet.getCell('AX2').value = 'RSI FDD 2100'
            sheet.getCell('AY2').value = 'RSI FDD 1800'
            sheet.getCell('AZ2').value = 'RSI L900'
            sheet.getCell('BA2').value = '5G RSI'
            sheet.getCell('BB2').value = 'GPL'
            sheet.getCell('BC2').value = 'Pre/Post Check'
            sheet.getCell('BD2').value = 'SPOC NAME'
            sheet.getCell('BE2').value = 'Offering Type'
            sheet.getCell('BF2').value = 'First Offering Date'
            sheet.getCell('BG2').value = 'Soft At Status'
            sheet.getCell('BH2').value = 'Offering Date'
            sheet.getCell('BI2').value = 'Acceptance / Rejection Date'
            sheet.getCell('BJ2').value = 'Alarm Bucket'
            sheet.getCell('BK2').value = 'Alarm Details'
            sheet.getCell('BL2').value = 'Final Responsibility (Circle Team/UBR Team/NOC Team)'
            sheet.getCell('BM2').value = 'Workable/Non-Workable'
            sheet.getCell('BN2').value = 'UBR MS2 Status'
            sheet.getCell('BO2').value = 'UBR Link ID'
            sheet.getCell('BP2').value = 'TWAMP Status'
            sheet.getCell('BQ2').value = 'Status Check Date'
            sheet.getCell('BR2').value = 'Ageing (in days)'
            sheet.getCell('BS2').value = 'Actual Ageing'
            sheet.getCell('BT2').value = 'TOCO Partner'
            sheet.getCell('BU2').value = 'Support required from UBR Team'
            sheet.getCell('BV2').value = 'Support required from Circle Team'
            sheet.getCell('BW2').value = 'Support required from NOC Team'
            sheet.getCell('BX2').value = 'Category (HW/Media/Infra)'
            sheet.getCell('BY2').value = 'Problem Statement in detail'
            sheet.getCell('BZ2').value = 'Final Remarks'
            sheet.getCell('CA2').value = 'MS1'

            sheet.columns = columnData.map(col => ({ key: col.field }));

            jsonData?.map((item) => {
                sheet.addRow({
                    unique_key: item.unique_key,
                    OEM: item.OEM,
                    Integration_Date: new Date( item.Integration_Date) || null,
                    CIRCLE: item.CIRCLE,
                    Activity_Name: item.Activity_Name,
                    Site_ID: item.Site_ID,
                    MO_NAME: item.MO_NAME,
                    LNBTS_ID: item.LNBTS_ID,
                    Technology_SIWA: item.Technology_SIWA,
                    OSS_Details: item.OSS_Details,
                    Cell_ID: item.Cell_ID,
                    CELL_COUNT: item.CELL_COUNT,
                    BSC_NAME: item.BSC_NAME,
                    BCF: item.BCF,
                    TRX_Count: item.TRX_Count,
                    PRE_ALARM: item.PRE_ALARM,
                    GPS_IP_CLK: item.GPS_IP_CLK,
                    RET: item.RET,
                    POST_VSWR: item.POST_VSWR,
                    POST_Alarms: item.POST_Alarms,
                    Activity_Mode: item.Activity_Mode,
                    Activity_Type_SIWA: item.Activity_Type_SIWA,
                    Band_SIWA: item.Band_SIWA,
                    CELL_STATUS: item.CELL_STATUS,
                    CTR_STATUS: item.CTR_STATUS,
                    Integration_Remark: item.Integration_Remark,
                    T2T4R: item.T2T4R,
                    BBU_TYPE: item.BBU_TYPE,
                    BB_CARD: item.BB_CARD,
                    RRU_Type: item.RRU_Type,
                    Media_Status: item.Media_Status,
                    Mplane_IP: item.Mplane_IP,
                    SCF_PREPARED_BY: item.SCF_PREPARED_BY,
                    SITE_INTEGRATE_BY: item.SITE_INTEGRATE_BY,
                    Site_Status: item.Site_Status,
                    External_Alarm_Confirmation: item.External_Alarm_Confirmation,
                    SOFT_AT_STATUS: item.SOFT_AT_STATUS,
                    LICENCE_Status: item.LICENCE_Status,
                    ESN_NO: item.ESN_NO,
                    Responsibility_for_alarm_clearance: item.Responsibility_for_alarm_clearance,
                    TAC: item.TAC,
                    PCI_TDD_20: item.PCI_TDD_20,
                    PCI_TDD_10_20: item.PCI_TDD_10_20,
                    PCI_FDD_2100: item.PCI_FDD_2100,
                    PCI_FDD_1800: item.PCI_FDD_1800,
                    PCI_L900: item.PCI_L900,
                    PCI_5G: item.PCI_5G,
                    RSI_TDD_20: item.RSI_TDD_20,
                    RSI_TDD_10_20: item.RSI_TDD_10_20,
                    RSI_FDD_2100: item.RSI_FDD_2100,
                    RSI_FDD_1800: item.RSI_FDD_1800,
                    RSI_L900: item.RSI_L900,
                    RSI_5G: item.RSI_5G,
                    GPL: item.GPL,
                    Pre_Post_Check: item.Pre_Post_Check,
                    spoc_name: item.spoc_name,
                    offering_type: item.offering_type,
                    first_offering_date: item.first_offering_date === null? '' :new Date(item.first_offering_date),
                    soft_at_status: item.soft_at_status,
                    offering_date: item.offering_date === null? '' :new Date(item.offering_date),
                    acceptance_rejection_date: item.acceptance_rejection_date === null? '' :new Date(item.acceptance_rejection_date),
                    alarm_bucket: item.alarm_bucket,
                    alarm_details: item.alarm_details,
                    final_responsibility: item.final_responsibility,
                    workable_non_workable: item.workable_non_workable,
                    ubr_ms2_status: item.ubr_ms2_status,
                    ubr_link_id: item.ubr_link_id,
                    twamp_status: item.twamp_status,
                    status_check_date: item.status_check_date === null? '' :new Date(item.status_check_date),
                    ageing_in_days: item.ageing_in_days,
                    actual_ageing: item.actual_ageing,
                    toco_partner: item.toco_partner,
                    support_required_ubr_team: item.support_required_ubr_team,
                    support_required_circle_team: item.support_required_circle_team,
                    support_required_noc_team: item.support_required_noc_team,
                    category: item.category,
                    problem_statement: item.problem_statement,
                    final_remarks: item.final_remarks,
                    ms1: item.ms1
                })
                
            })

                  ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell,colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                // if (rowNumber === rowsCount) {
                //     cell.fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //         color: { argb: 'FFFFFF' },
                //         bold: true,
                //         size: 13,
                //     }
                // }

                if (rowNumber === 2 && colNumber >= 56 && colNumber <= 79) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF00' } // Yellow background color
                    };
                    cell.font = {
                        color: { argb: '000000' },
                        bold: true,
                        size: 12,
                    }
                }

                if (rowNumber === 2 && colNumber < 56 ) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 12,
                    }

                }

                if (rowNumber === 1 ) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFF' }
                    }
                    cell.font = {
                        color: { argb: 'ff6645' },
                        bold: true,
                        size: 12,
                    }
                    cell.alignment = { vertical: 'middle', horizontal: 'left' }
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
            anchor.download = "soft_at_status_tracker.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

        }


        const handleDateFormat = (date) => {
            if (date) {
            const dateObject = new Date(date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(dateObject.getDate()).padStart(2, '0');

            return (`${year}-${month}-${day}`);
            } else {
                return ('')
            }
        }
       

    const handleToggle = (event, value) => {
        setDate('');
        setFromDate('');
        setToDate('');
        setToggalValue(value);
    }

    const handleSubmit = async () => {
        try {
            action(true)
            var formData = new FormData();
            formData.append('date', handleDateFormat(date))
            formData.append('from_date', handleDateFormat(fromDate))
            formData.append('to_date', handleDateFormat(toDate))
            // formData.append('circle', circle)
            // formData.append('oem', selectOem)
            formData.append('circle_oem', JSON.stringify(finalJson))
            formData.append('site_id', siteId)
    
            const response = await axios.post(`${ServerURL}/Soft_At/softAt-status-update-template/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response) {
                // console.log('response', response)
                setJsonData(response?.data.data)
                setOpen(true)
            }
        } catch (error) {
            // console.error('Error while submitting form:', error.response.data);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.response.data.message}`,
            });
        } finally {
            action(false);  // Ensures action is reset whether the request is successful or fails
        }
    };

    const handleDialogBox = useCallback(() => {
        return (<Dialog
            open={open}
            // onClose={handleClose}
            maxWidth={'md'}
            fullWidth={true}
            TransitionComponent={Transition}
            keepMounted
        >
            <DialogTitle>
                <IconButton sx={{ float: 'right' }} size="large" onClick={() => { handleClose(); }}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}>
                    {/* <a download href={link}> */}
                        <Button variant="outlined" onClick={handleExportExcel} startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Soft-AT Status</span></Button>
                        {/* </a> */}
                </Box>
            </DialogContent>

        </Dialog>)

    }, [open])

    const SelectCircle = (circles) => {
        const { target: { value }, } = circles;
        setCircle(
            typeof value === 'string' ? value.split(',') : value,
        );

        let filterlist = circleOem.filter((item) => (circles.target.value).includes(item.circle))

        let arr = []

        filterlist?.map((item) => {
            // console.log('oem', item.OEM)
            arr.push(item.OEM)
        })
        // console.log('oem list' , arr.flat())
        setOemList(arr.flat())

        if (circles.target.value.length > 0) {
            setOemShow(true);
        } else {
            setOemShow(false);
        }


    }

    const selectedOem = (event) => {
        const { target: { value }, } = event;
        setSelectOem(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    useEffect(() => {
       
    
        let tempResult = {};
    
        // Initialize the result object with empty arrays for each circle
        circle.forEach(circ => {
          tempResult[circ] = [];
        });
    
        // Populate the result object with OEM data
        selectOem.forEach(item => {
          // Extract the circle from the item
          let circleName = item.split(' (')[1].slice(0, -1); // Get the circle name from 'Huawei (UPW)' -> 'UPW'
    
          if (circle.includes(circleName)) {
            tempResult[circleName].push(item);
          }
        });
        // console.log('tempResult', tempResult)

        setFinalJson(tempResult);
      }, [circle,selectOem]);


    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const fetchCircle = async () => {
            const response = await getData('Soft_At/get-integration-circle/');
            // console.log('response',response.circle)
            if (response) {
                setAllcircle(response.circle)
            }
        }
        fetchCircle();

    }, [])





    return (
        <Zoom in='true' timeout={800} style={{ transformOrigin: '1 1 1' }}>
            <div>
                <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" href='/tools'>Tools</Link>
                        <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
                        <Typography color='text.primary'>Soft AT Status</Typography>
                    </Breadcrumbs>
                </div>

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box} component="form" sx={{ width: { md: '75%', xs: '100%' } }}>
                        <Box className={classes.Box_Hading} >
                            SOFT AT STATUS TEMPLATE
                        </Box>

                        <Stack spacing={2} sx={{ marginTop: "-40px" }} direction={'column'}>
                            <Box className={classes.Front_Box} >
                                <Box className={classes.Front_Box_Hading}>
                                    {toggalValue == 'Date' ? 'Select Date' : 'Select Range'}  <span style={{ fontFamily: 'Poppins', color: "gray", marginLeft: 20 }}></span>
                                </Box>
                                <Box className={classes.Front_Box_Select_Button} >
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={toggalValue}
                                        exclusive
                                        onChange={handleToggle}
                                        size="medium"
                                    >
                                        <ToggleButton value="Date">Date</ToggleButton>
                                        <ToggleButton value="Range">Range</ToggleButton>

                                    </ToggleButtonGroup>
                                    {toggalValue == 'Date' ? <><Box sx={{ textAlign: 'center' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                            <DatePicker label="Select Date" size="small" value={date} onChange={(e) => setDate(e)} />
                                        </LocalizationProvider>
                                    </Box></> : <><Box sx={{ textAlign: 'center' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} size="small">
                                            <DatePicker label="From Date" value={fromDate} onChange={(e) => setFromDate(e)} /><span style={{ margin: 5, fontSize: 20, fontWeight: 600 }}>~</span>
                                            <DatePicker label="To Date" value={toDate} onChange={(e) => setToDate(e)} />
                                        </LocalizationProvider>
                                    </Box></>}

                                </Box>

                            </Box>

                            <Box className={classes.Front_Box}>
                                <Box className={classes.Front_Box_Hading}>
                                    Select Circle
                                </Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <InputLabel id="demo-simple-select-label">Select Circle</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            multiple
                                            value={circle}
                                            label="Select Circle"
                                            onChange={(event) => { SelectCircle(event) }}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            size="medium"
                                            MenuProps={{PaperProps: {
                                                style: {
                                                  maxHeight: 48 * 4.5 + 8,
                                                  width: 250,
                                                },
                                              }}}
                                        >

                                            {allcircle?.map((data, index) => (
                                                <MenuItem key={index} value={data}>
                                                    <Checkbox checked={circle.includes(data)} />
                                                    <ListItemText primary={data} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>

                            <Collapse in={oemShow} timeout={500} className={classes.Front_Box} sx={{ display: oemShow ? "block" : "none" }}>
                                <Box className={classes.Front_Box_Hading}>
                                    Select OEM
                                </Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <FormControl sx={{ minWidth: 150, maxWidth: 500 }}>
                                        <InputLabel id="Select_OEM">Select OEM</InputLabel>
                                        <Select
                                            labelId="Select_OEM"
                                            id="demo-simple-select"
                                            multiple
                                            value={selectOem}
                                            // label="Select OEM"
                                            onChange={(e) => selectedOem(e)}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            size="medium"
                                        >
                                            {oemList?.map((data, index) => (
                                                <MenuItem key={index} value={data} >
                                                    <Checkbox checked={selectOem.includes(data)} />
                                                    <ListItemText primary={data} />
                                                    {/* {data} */}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Box>
                            </Collapse>



                            <Box className={classes.Front_Box}>
                                <Box className={classes.Front_Box_Hading}>Enter Site ID</Box>
                                <Box sx={{ marginTop: "5px", float: "left" }}>
                                    <TextField size="medium" type="search" label="Enter Site ID" variant="outlined" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
                                </Box>
                            </Box>
                        </Stack>


                        <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} style={{ display: 'flex', justifyContent: "space-around", marginTop: "20px" }}>

                            <Button variant="contained" onClick={handleSubmit} color="success" endIcon={<UploadIcon />}>Submit</Button>
                            <Button variant="contained" style={{ backgroundColor: "red", color: 'white' }} endIcon={<DoDisturbIcon />} >Clear</Button>

                        </Stack>
                    </Box>
                    {/* <a download href={link}><Button variant="outlined" onClick='' startIcon={<FileDownloadIcon style={{ fontSize: 30, color: "green" }} />} sx={{ marginTop: "10px", width: "auto" }}><span style={{ fontFamily: "Poppins", fontSize: "22px", fontWeight: 800, textTransform: "none", textDecorationLine: "none" }}>Download Temp</span></Button></a> */}
                </Box>

                {/* {handleError()} */}
                {handleDialogBox()}
                {loading}

            </div>
        </Zoom>
    )
}

export default React.memo(SoftAtStatus)