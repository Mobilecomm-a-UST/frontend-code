import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import * as ExcelJS from 'exceljs'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { useStyles } from '../../ToolsCss'
import _ from 'lodash';
import CheckPicker from 'rsuite/CheckPicker';
import Switch from '@mui/material/Switch';
import Swal from 'sweetalert2';


const colorType = ['#223354', '#2c426d', '#3b5891', '#4a6eb5', '#ffe6cc']

const RaiseTicket = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const { response, makeGetRequest } = useGet()
    const { makePostRequest } = usePost()
    const { loading, action } = useLoadingDialog();
    const [payloadCircle, setPayloadCircle] = useState([])
    const [selectCircle, setSelectCircle] = useState([])
    const [payloadSiteID, setPayloadSiteID] = useState([])
    const [selectSiteID, setSelectSiteID] = useState([])
    const [payloadTicketId, setPayloadTicketId] = useState([])
    const [selectTicketId, setSelectTicketId] = useState([])
    const [payloadPriority, setPayloadPriority] = useState([])
    const [selectPriority, setSelectPriority] = useState([])
    const [payloadStatusData, setPayloadStatusData] = useState([])
    const [selectStatusData, setSelectStatusData] = useState([])
    const [mainDataT2, setMainDataT2] = useState([])
    const [totalTable, setTotalTable] = useState([])
    const [totalOpen, setTotalOpen] = useState(false)
    const [toggalButton, setToggalButton] = useState(false)
    const [payloadStatus, setPayloadStatus] = useState(false)
    const [ticketDipForm, setTicketDipForm] = useState({
        Circle: "",
        Circle_Spoc: "",
        Date: "",
        Open_Date: "",
        Ownership: "",
        Pre_Remarks: "",
        Remarks: "",
        Short_name: "",
        Site_ID: "",
        Status: "",
        Unique_Id: "",
        aging: '',
        ticket_id: "",
        RCA: '',
    })
    // console.log('toggalButton', toggalButton)
    const { isPending, isFetching, isError, data, error } = useQuery({
        queryKey: ['Ticket_Status'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("Zero_Count_Rna_Payload_Tool/ticket_counter_api/");
            if (res) {
                action(false)
                console.log('res ticket status', res)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    const handleChange = (e) => {
        // console.log('get state name ', e.target.value)
        setTicketDipForm({
            ...ticketDipForm,
            [e.target.name]: e.target.value,
        });
    }

    const handleSetDataTicket = (item) => {
        // console.log(item)
        setTicketDipForm({
            Circle: item.Circle,
            Circle_Spoc: item.Circle_Spoc,
            Date: item.Date,
            Open_Date: item.Open_Date,
            Ownership: item.Ownership,
            Pre_Remarks: item.Pre_Remarks,
            Remarks: item.Remarks,
            Short_name: item.Short_name,
            Site_ID: item.Site_ID,
            Status: item.Status,
            Unique_Id: item.Unique_Id,
            aging: CalculateDaysBetweenDates(item.Date, item.Open_Date),
            ticket_id: item.ticket_id,
            RCA: item.RCA
        })
        setPayloadStatus(true);
    }

    // Handle Submit data to update ticket status
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            action(true)
            const response = await makePostRequest(`Zero_Count_Rna_Payload_Tool/ticket_status_open_close/${ticketDipForm.ticket_id}/`, ticketDipForm);

            console.log('on clicke update : ', response);

            if (response.Status) {
                setPayloadStatus(false);
                handleTotalData();
                // Swal.fire({
                //     icon: "success",
                //     title: "Done",
                //     text: 'Data updated successfuly',
                // });

            }
        } catch (error) {
            console.error('Error occurred: ', error);
               action(false);
        } finally {
            // action(false);
        }
    }

    const convertDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        return `${day}-${month}`;
    };

    const handleClose = () => {
        setOpen(false)
        setTotalOpen(false)
    }

    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("Day Wise tracker", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';



        // sheet3.mergeCells('A1:S1');
        sheet3.mergeCells('A1:A3');
        sheet3.mergeCells('F1:F3');
        sheet3.mergeCells('B1:E1');

        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = `${convertDate(data?.previous_date)} ~ ${convertDate(data?.current_date)}`;
        sheet3.getCell('B2').value = 'P-0';
        sheet3.getCell('B3').value = '> 100GB';
        sheet3.getCell('C2').value = 'P-1';
        sheet3.getCell('C3').value = '≥ 50GB < 100GB';
        sheet3.getCell('D2').value = 'P-2';
        sheet3.getCell('D3').value = '≥ 30GB < 50GB';
        sheet3.getCell('E2').value = 'P-3';
        sheet3.getCell('E3').value = '≥ 10GB < 30GB';
        sheet3.getCell('F1').value = 'Total';

        sheet3.columns = [
            { key: 'Circle' },
            { key: 'p0' },
            { key: 'p1' },
            { key: 'p2' },
            { key: 'p3' },
            { key: 'Total' },
        ]

        data?.data.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                p0: (item?.p0 ? item.p0 : 0),
                p1: (item?.p1 ? item.p1 : 0),
                p2: (item?.p2 ? item.p2 : 0),
                p3: (item?.p3 ? item.p3 : 0),
                Total: item?.Total,
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet3.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell) => {
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

                if (rowNumber === 1 || rowNumber === 2) {
                    // First set the background of header row
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
            anchor.download = "day_wise_payload_Analysis.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    // handleexportRawData range wise...............
    const handleExportRawData = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("Raw Data", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';
        sheet3.mergeCells('A1:A2');
        sheet3.mergeCells('B1:B2');
        sheet3.mergeCells('C1:D1');
        sheet3.mergeCells('F1:F2');
        sheet3.mergeCells('G1:G2');


        sheet3.getCell('A1').value = 'Circle';
        sheet3.getCell('B1').value = 'Short Name';
        sheet3.getCell('C1').value = 'MV 4G Data Volume GB';
        sheet3.getCell('C2').value = `${data?.latest_date}`;
        sheet3.getCell('D2').value = `${data?.previous_date}`;
        sheet3.getCell('E1').value = 'MV Radio NW Availability';
        sheet3.getCell('E2').value = `${data?.latest_date}`;
        sheet3.getCell('F1').value = 'Site Priority';
        sheet3.getCell('G1').value = 'Delta';


        sheet3.columns = [
            { key: 'Circle' },
            { key: 'Short_name' },
            { key: 'MV_4G_Data_Volume_GB_current_date' },
            { key: 'MV_4G_Data_Volume_GB_previous_date' },
            { key: 'MV_Radio_NW_Availability_current_date' },
            { key: 'del_value' },
            { key: 'delta' }
        ]

        data?.all_data?.map(item => {
            sheet3.addRow({
                Circle: item?.Circle,
                Short_name: (item?.Short_name ? item.Short_name : 0),
                MV_4G_Data_Volume_GB_current_date: (item?.MV_4G_Data_Volume_GB_current_date ? item.MV_4G_Data_Volume_GB_current_date : 0),
                MV_4G_Data_Volume_GB_previous_date: (item?.MV_4G_Data_Volume_GB_previous_date ? item.MV_4G_Data_Volume_GB_previous_date : 0),
                MV_Radio_NW_Availability_current_date: (item?.MV_Radio_NW_Availability_current_date ? item.MV_Radio_NW_Availability_current_date : 0),
                del_value: item?.del_value,
                delta: item?.delta,
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet3.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell) => {
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

                if (rowNumber === 1 || rowNumber === 2) {
                    // First set the background of header row
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
            anchor.download = "Ticket_Status_Tracker.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }

    // handleExportPaylodDipData download in Excel.....
    const handleExportPaylodDipData = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("Paylod Dip", { properties: { tabColor: { argb: 'f1948a' } } })
        // sheet.properties.defaultRowHeight = 20;
        // sheet.properties.showGridLines = '#58D68D';
        // sheet3.mergeCells('A1:A2');
        // sheet3.mergeCells('B1:B2');
        // sheet3.mergeCells('C1:D1');
        // sheet3.mergeCells('F1:F2');
        // sheet3.mergeCells('G1:G2');

        sheet3.getCell('A1').value = 'Ticket ID';
        sheet3.getCell('B1').value = 'Circle';
        sheet3.getCell('C1').value = 'Cell Name';
        sheet3.getCell('D1').value = 'Date';
        sheet3.getCell('E1').value = 'Open Date';
        sheet3.getCell('F1').value = 'Aging';
        sheet3.getCell('G1').value = 'Cell + Date';
        sheet3.getCell('H1').value = 'Status';
        sheet3.getCell('I1').value = 'Remarks';
        sheet3.getCell('J1').value = 'Ownership';
        sheet3.getCell('K1').value = 'Circle Spoc';
        sheet3.getCell('L1').value = 'Site ID';
        sheet3.getCell('M1').value = 'Pre Remarks';


        sheet3.columns = [
            { key: 'ticket_id' },
            { key: 'Circle' },
            { key: 'Short_name' },
            { key: 'Date' },
            { key: 'Open_Date' },
            { key: 'Aging' },
            { key: 'Unique_Id' },
            { key: 'Status' },
            { key: 'Remarks' },
            { key: 'Ownership' },
            { key: 'Circle_Spoc' },
            { key: 'Site_ID' },
            { key: 'Pre_Remarks' }
        ]

        totalTable?.map(item => {
            sheet3.addRow({
                ticket_id: item?.ticket_id,
                Circle: item?.Circle,
                Short_name: item.Short_name,
                Date: item.Date,
                Open_Date: item.Open_Date,
                Aging: CalculateDaysBetweenDates(item.Date, item.Open_Date),
                Unique_Id: item.Unique_Id,
                Status: (item.Status == 'nan' ? '' : item.Status),
                Remarks: (item.Remarks == 'nan' ? '' : item.Remarks),
                Ownership: (item.Ownership == 'nan' ? '' : item.Ownership),
                Circle_Spoc: (item.Circle_Spoc == 'nan' ? '' : item.Circle_Spoc),
                Site_ID: (item.Site_ID == 'nan' ? '' : item.Site_ID),
                Pre_Remarks: (item.Pre_Remarks == 'nan' ? '' : item.Pre_Remarks),
            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet3.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet3.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell) => {
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

                if (rowNumber === 1) {
                    // First set the background of header row
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
            anchor.download = "Payload_Dip_Track.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })
    }

    // ********** Filter Dialog Box **********//
    const filterDialog = useCallback(() => {
        return (
            <Dialog
                open={open}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 5 }}
            >
                <DialogTitle>Cell Name Table  <span style={{ float: 'right' }}><IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span></DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: 450, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th rowSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th rowSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th colSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV 4G Data Volume GB</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>MV Radio NW Availability</th>
                                    <th rowSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th rowSpan={2} style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Delta</th>
                                </tr>

                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>

                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.current_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.previous_date}</th>
                                    <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{mainDataT2?.current_date}</th>

                                </tr>
                            </thead>
                            <tbody>
                                {mainDataT2?.data?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th>{item.Circle}</th>
                                        <th>{item.Short_name}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_current_date}</th>
                                        <th>{item.MV_4G_Data_Volume_GB_previous_date}</th>
                                        <th>{item.MV_Radio_NW_Availability_current_date}</th>
                                        <th>{item.del_value.toUpperCase()}</th>
                                        <th>{item.delta}</th>
                                    </tr>
                                ))}
                            </tbody>


                        </table>
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }, [mainDataT2, open])

    const ClickDataGet = async (props) => {
        action(true)
        var formData = new FormData();
        formData.append("circle", props.circle);
        formData.append("del_value", props.delta);

        const responce = await makePostRequest('Zero_Count_Rna_Payload_Tool/ticket_counter_hyperlink_data/', formData)
        if (responce) {
            // console.log('aaaaa', responce)
            setMainDataT2(responce)
            action(false)
            setOpen(true)
        }
        else {
            action(false)
        }
    }

    const CalculateDaysBetweenDates = (date1, date2) => {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);

        // Calculate the difference in time (milliseconds)
        const timeDifference = dateObj1 - dateObj2;

        // Convert the time difference from milliseconds to days
        const dayDifference = timeDifference / (1000 * 3600 * 24);

        return dayDifference;
    }

    const handleTotalData = async () => {
        if (toggalButton) {
            action(true)
            const responce = await makeGetRequest('Zero_Count_Rna_Payload_Tool/get_ticket_status_data/')
            console.log('toggal button', responce)
            if (responce) {
                action(false)
                setTotalTable(responce.data)
                setPayloadCircle(_.uniq(_.map(responce.data, 'Circle')))
                setPayloadSiteID(_.uniq(_.map(responce.data, 'Site_ID')))
                setPayloadTicketId(_.uniq(_.map(responce.data, 'ticket_id')))
                setPayloadPriority(_.uniq(_.map(responce.data, 'priority')))
                setPayloadStatusData(_.uniq(_.map(responce.data, 'Status')))
                // setCurrentDate(responce.current_date)
                // setPreviousDate(responce.previous_date)
                // setTotalOpen(true)
                // console.log('sat', responce)
            }
            else {
                action(false)
                setTotalOpen(false)
                // setTotalOpen(false)
            }

        }
    }

    const handleDateFormets = (timestamp) => {
        const date = new Date(timestamp);

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }

    const FilterPayloadDipData = useCallback(() => {
        let filteredData = _.filter(totalTable, item => {

            const circleMatch = selectCircle.length === 0 || _.includes(selectCircle, item.Circle);
            const siteIdMatch = selectSiteID.length === 0 || _.includes(selectSiteID, item.Site_ID);
            const ticketMatch = selectTicketId.length === 0 || _.includes(selectTicketId, item.ticket_id);
            const priorityMatch = selectPriority.length === 0 || _.includes(selectPriority, item.priority);
            const statusMatch = selectStatusData.length === 0 || _.includes(selectStatusData, item.Status)


            return circleMatch && siteIdMatch && ticketMatch && priorityMatch && statusMatch;
        });
        return filteredData?.map((item, index) => (
            <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{index + 1}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.ticket_id}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Circle}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Short_name}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{handleDateFormets(item.Date)}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{handleDateFormets(item.Open_Date)}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{CalculateDaysBetweenDates(item.Date, item.Open_Date)}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.priority}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap', cursor: 'pointer' }} className={classes.hover} onClick={() => { handleSetDataTicket(item) }}>{item.Status == 'nan' ? '' : item.Status}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Remarks == 'nan' ? '' : item.Remarks}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Ownership == 'nan' ? '' : item.Ownership}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.RCA == 'nan' ? '' : item.RCA}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Circle_Spoc}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Site_ID}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Pre_Remarks == 'nan' ? '' : item.Pre_Remarks}</th>
            </tr>
        ))

    }, [toggalButton, selectCircle, selectSiteID, selectTicketId, selectPriority, selectStatusData, totalTable])

    const TotalTableDialog = useCallback(() => {
        return (
            <Dialog
                open={totalOpen}
                // onClose={handleClose}
                keepMounted
                fullScreen
                maxWidth={'xl'}
                BackdropProps={{
                    style: { backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(3px)' },
                }}
                style={{ zIndex: 2, marginTop: '4%' }}
            >

                <DialogTitle><span style={{ color: toggalButton ? '' : '#1976D2' }}>All Over Raw Data</span>

                    <Switch onChange={() => { setToggalButton(!toggalButton) }} /> <span style={{ color: toggalButton ? '#1976D2' : '' }}>Payload Dip Data</span>

                    <span style={{ float: 'right' }}>
                        {toggalButton ? <Tooltip title="Payload Dip">
                            <IconButton onClick={() => { handleExportPaylodDipData() }}>
                                <DownloadIcon fontSize='medium' color='primary' />
                            </IconButton>
                        </Tooltip> : <Tooltip title="Raw Data">
                            <IconButton onClick={() => { handleExportRawData() }}>
                                <DownloadIcon fontSize='medium' color='primary' />
                            </IconButton>
                        </Tooltip>}

                        <IconButton size="large" onClick={handleClose}><CloseIcon /></IconButton></span>
                </DialogTitle>

                <DialogContent >
                    <TableContainer sx={{ maxHeight: '70vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                        {toggalButton ? <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>S.No.</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Ticket ID <CheckPicker data={payloadTicketId.map(item => ({ label: item, value: item }))} value={selectTicketId} onChange={(value) => { setSelectTicketId(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /></th>
                                    <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }} >Circle <CheckPicker data={payloadCircle.map(item => ({ label: item, value: item }))} value={selectCircle} onChange={(value) => { setSelectCircle(value) }} size="sm" appearance="default" style={{ width: 20 }} /> </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Open Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Aging</th>
                                    <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Priority <CheckPicker data={payloadPriority.map(item => ({ label: item, value: item }))} value={selectPriority} onChange={(value) => { setSelectPriority(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                    <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Status <CheckPicker data={payloadStatusData.map(item => ({ label: item, value: item }))} value={selectStatusData} onChange={(value) => { setSelectStatusData(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Remarks</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Ownership</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Auto RCA</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle Spoc</th>
                                    <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Site ID <CheckPicker data={payloadSiteID.map(item => ({ label: item, value: item }))} value={selectSiteID} onChange={(value) => { setSelectSiteID(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Pre Remarks</th>

                                </tr>
                            </thead>
                            <tbody>
                                {/* {totalTable?.map((item) => (
                                    <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.ticket_id}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Circle}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Short_name}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Date}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Open_Date}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{CalculateDaysBetweenDates(item.Date, item.Open_Date)}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Unique_Id}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', cursor: 'pointer' }} className={classes.hover} onClick={() => { handleSetDataTicket(item) }}>{item.Status == 'nan' ? '' : item.Status}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Remarks == 'nan' ? '' : item.Remarks}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Ownership == 'nan' ? '' : item.Ownership}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Circle_Spoc}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Site_ID}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>{item.Pre_Remarks == 'nan' ? '' : item.Pre_Remarks}</th>
                                    </tr>
                                ))} */}
                                {FilterPayloadDipData()}
                            </tbody>
                        </table> : <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th rowSpan={2} style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>S.No.</th>
                                    <th rowSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th rowSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Short Name</th>
                                    <th colSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MV 4G Data Volume GB</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MV Radio NW Availability</th>
                                    <th rowSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Site Priority</th>
                                    <th rowSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Delta</th>
                                    <th rowSpan={2} style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>RCA</th>
                                </tr>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>{data?.latest_date}</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>{data?.previous_date}</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>{data?.latest_date}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.all_data?.map((item, index) => (
                                    <tr key={index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                        <th style={{ padding: '1px 2px', whiteSpace: 'nowrap' }}>{index + 1}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Circle}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Short_name}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.MV_4G_Data_Volume_GB_current_date}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.MV_4G_Data_Volume_GB_previous_date}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.MV_Radio_NW_Availability_current_date}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.del_value}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.delta}</th>
                                        <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.RCA}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </TableContainer>

                </DialogContent>
            </Dialog>
        )
    }, [totalOpen, totalTable, selectCircle, selectSiteID, selectTicketId, selectPriority, selectStatusData, toggalButton]);


    const Dashboard = useCallback(({ dataa, color }) => {
        return (
            <Box sx={{ height: 'auto', width: '40vh', padding: 1, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, border: `3px solid ${color}`, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 600, fontSize: '18px', color: "white", textAlign: 'left' }}>{dataa?.name}</Box>
                <Box sx={{ fontWeight: 600, fontSize: '24px', color: "white", fontFamily: 'cursive' }}>{dataa?.value}</Box>
                <Box sx={{ color: "white", textAlign: 'left' }}><span style={{ fontWeight: 600, fontSize: '14px' }}>Day - </span>{convertDate(data?.previous_date)} ~ {convertDate(data?.latest_date)}</Box>
            </Box>
        );
    }, [data]);

    const handleFormDialog = useCallback(() => {
        return (
            <Dialog
                open={payloadStatus}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 10 }}
            >
                <DialogTitle >Payload Dip Tracker
                    <span style={{ float: 'right' }}><IconButton size="large" onClick={() => { setPayloadStatus(false) }}><CloseIcon /></IconButton></span>
                </DialogTitle>
                <DialogContent dividers>
                    <Container component="main" >
                        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 5 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Ticket ID"
                                        label="Ticket ID"
                                        name="ticket_id"
                                        value={ticketDipForm.ticket_id}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Circle"
                                        label="Circle"
                                        name="Circle"
                                        value={ticketDipForm.Circle}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Cell Name"
                                        label="Cell Name"
                                        name="Short_name"
                                        value={ticketDipForm.Short_name}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Date"
                                        label="Date"
                                        name="Date"
                                        value={handleDateFormets(ticketDipForm.Date)}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Open Date"
                                        label="Open Date"
                                        name="Open_Date"
                                        value={handleDateFormets(ticketDipForm.Open_Date)}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Aging"
                                        label="Aging"
                                        name="aging"
                                        value={ticketDipForm.aging}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Cell + Date"
                                        label="Cell + Date"
                                        name="Unique_Id"
                                        value={ticketDipForm.Unique_Id}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={ticketDipForm.Status}
                                            name='Status'
                                            label="Status"
                                            onChange={handleChange}
                                            size='small'
                                            fullWidth
                                        >
                                            <MenuItem value='OPEN'>Open</MenuItem>
                                            <MenuItem value='CLOSE'>Close</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        placeholder="Remarks"
                                        label="Remarks"
                                        name="Remarks"
                                        value={ticketDipForm.Remarks}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Auto RCA"
                                        label="Auto RCA"
                                        name="RCA"
                                        value={ticketDipForm.RCA}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        required
                                        placeholder="Ownership"
                                        label="Ownership"
                                        name="Ownership"
                                        value={ticketDipForm.Ownership}
                                        onChange={handleChange}
                                        // InputProps={{
                                        //     readOnly: true,
                                        // }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        placeholder="Circle Spoc"
                                        label="Circle Spoc"
                                        name="Circle_Spoc"
                                        value={ticketDipForm.Circle_Spoc}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Site ID"
                                        label="Site ID"
                                        name="Site_ID"
                                        value={ticketDipForm.Site_ID}
                                        onChange={handleChange}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        placeholder="Pre Remarks"
                                        label="Pre Remarks"
                                        name="Pre_Remarks"
                                        value={ticketDipForm.Pre_Remarks}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type='submit' size='sm' variant='outlined' fullWidth >Update</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Container>
                </DialogContent>
            </Dialog>
        )
    }, [payloadStatus, ticketDipForm])

    useEffect(() => {
        if (toggalButton) {
            handleTotalData();
        }
    }, [toggalButton]);


    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>

            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 10 }}>
                    <Box style={{ margin: 5, marginLeft: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                            <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                            <Typography color='text.primary'>Raise Ticket</Typography>
                        </Breadcrumbs>
                        <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Excel">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    {/* <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: ' rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                <Grid container spacing={1}>
                    <Grid item xs={10} style={{ display: "flex" }}>
                        <Box >
                            <Tooltip title="Filter list">
                            <IconButton onClick={() => { setOpen(true) }}>
                                <FilterAltIcon fontSize='large' color='primary' />
                            </IconButton>
                        </Tooltip>
                        </Box>

                    </Grid>
                    <Grid item xs={2}>
                        <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Excel">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>
                </Grid>

            </div> */}

                    {/* <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-between', flexWrap: "wrap", flexDirection: 'row', gap: 20 }}>
                {data?.data?.map((item, index) => {
                    if (item?.Circle === 'new_total') {
                        return (<>
                            <Dashboard dataa={{ value: item.p0, name: 'P0' }} color={colorType[0]} />
                            <Dashboard dataa={{ value: item.p1, name: 'P1' }} color={colorType[1]} />
                            <Dashboard dataa={{ value: item.p2, name: 'P2' }} color={colorType[2]} />
                            <Dashboard dataa={{ value: item.p3, name: 'P3' }} color={colorType[3]} />
                        </>

                        )
                    }
                })}
            </div> */}

                    {/* ************* 2G  TABLE DATA ************** */}

                    <Box sx={{ marginTop: 1 }}>

                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>

                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >

                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th rowSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>Circle</th>
                                        <th colSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{convertDate(data?.previous_date)} ~ {convertDate(data?.latest_date)}</th>
                                        <th rowSpan='3' style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>Total</th>
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        {/* <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Circle</th> */}
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-0</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-1</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>P-2</th>
                                        {/* <th rowSpan='2' style={{ padding: '5px 20px', whiteSpace: 'nowrap' }}>Total</th> */}
                                    </tr>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>

                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}> {`> 100GB`} </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{`≥ 50GB < 100GB`}</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', border: '1px solid white' }}>{`≥ 30GB < 50GB`}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.data?.map((it) => {

                                        if (it?.Circle === 'new_total') {
                                            return (
                                                <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#ED6C02', color: '#fff', fontSize: 16 }}>
                                                    <th >Total</th>
                                                    <th >{it?.P0 ? it.P0 : 0}</th>
                                                    <th >{it?.P1 ? it.P1 : 0}</th>
                                                    <th >{it?.P2 ? it.P2 : 0}</th>
                                                    {/* <th >{it?.p3 ? it.p3 : 0}</th> */}
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => setTotalOpen(true)}>{it?.total}</th>
                                                </tr>
                                            )

                                        }
                                        else {
                                            return (
                                                <tr className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                                                    <th >{it?.Circle}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P0' }) }}>{it?.P0 ? it.P0 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P1' }) }}>{it?.P1 ? it.P1 : 0}</th>
                                                    <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'P2' }) }}>{it?.P2 ? it.P2 : 0}</th>
                                                    {/* <th className={classes.hover} style={{ cursor: "pointer" }} onClick={() => { ClickDataGet({ circle: it.Circle, delta: 'p3' }) }}>{it?.p3 ? it.p3 : 0}</th> */}
                                                    <th >{it?.total}</th>
                                                </tr>
                                            )
                                        }
                                    }
                                    )}

                                </tbody>
                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>
            {filterDialog()}
            {TotalTableDialog()}
            {handleFormDialog()}
            {loading}
        </>
    )
}

export default RaiseTicket