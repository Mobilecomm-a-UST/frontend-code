import React, { useState, useEffect, useCallback,useRef } from 'react';
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
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss'
import _ from 'lodash';
import { ServerURL } from '../../../services/FetchNodeServices';
import CheckPicker from 'rsuite/CheckPicker';
import Swal from 'sweetalert2';
import Chip from '@mui/material/Chip';
import axios from 'axios';

const RaiseTicket2 = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const scrollableContainerRef = useRef(null);
    const [scrollNo, setScrollNo] = useState(50)
    const { makeGetRequest } = useGet()
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
    const [payloadOpenDate, setPayloadOpenDate] = useState([])
    const [selectOpenDate, setSelectOpenDate] = useState([])
    const [payloadAging,setPayloadAging] = useState([])
    const [selectAging, setSelectAging]=useState([])
    const [totalTable, setTotalTable] = useState([])
    const [ticketType,setTicketType] = useState([])
    const [selectTicketType, setSelectTicketType] = useState([])
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
        category: '',
        rca_feedback: ''
    })
    const [payloadStatusData2, setPayloadStatusData2] = useState()
    const [payloadStatus, setPayloadStatus] = useState(false)


    const handleChange = (e) => {
        // console.log('get state name ', e.target.value)
        setTicketDipForm({
            ...ticketDipForm,
            [e.target.name]: e.target.value,
        });
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         action(true)
    //         const response = await makePostRequest(`Zero_Count_Rna_Payload_Tool/ticket_status_open_close/${ticketDipForm.ticket_id}/`, ticketDipForm);

    //         console.log('on clicke update : ', response);

    //         if (response.Status) {
    //             setPayloadStatus(false);
    //             fetchTableData();
    //             // Swal.fire({
    //             //     icon: "success",
    //             //     title: "Done",
    //             //     text: 'Data updated successfuly',
    //             // });

    //         }
    //     } catch (error) {
    //         console.error('Error occurred: ', error);
    //            action(false);
    //     } finally {
    //         // action(false);
    //     }
    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // Prevent default form submission behavior

    //     action(true); // Start processing

    //     let response1 = await makePostRequest(`Zero_Count_Rna_Payload_Tool/ticket_status_open_close/${ticketDipForm.ticket_id}/`, ticketDipForm);
    //     if (response1) {
    //         setPayloadStatus(false);
    //         fetchTableData2();
    //     } else {
    //         // console.log('error data' ,error,response )
    //         action(false);
    //         setPayloadStatus(false);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: 'This field may not be blank.',
    //         });

    //     }


    // };


    const handleSubmit2 = async () => {
        try {
            const response = await axios.post(`${ServerURL}/Zero_Count_Rna_Payload_Tool/ticket_status_open_close/${ticketDipForm.ticket_id}/`, ticketDipForm,
                {
                    headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
                }
            );

            if (response && response.data && response.data.Status) {
                setPayloadStatus(false); // Update payload status
                fetchTableData2(); // Fetch updated table data
            } else {

                throw new Error('Invalid response data'); // Trigger error handling for unexpected responses
            }
        } catch (error) {
            console.error('Error occurred:', error); // Log error for debugging
            action(false); // Stop processing state
            setPayloadStatus(false); // Reset payload status

            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: error.response?.data?.message , // Display error message from server or fallback
            // });
            let errorMessage = 'An error occurred.';
            if (error.response?.data) {
                const errorDetails = Object.entries(error.response.data.message)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
                console.error('Error Details:', errorDetails); // Print key-value pairs in the console
                errorMessage = errorDetails; // Use formatted key-value pairs as the error message
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        } finally {
            // action(false); // Ensure loading state is stopped in any case
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // let tempConform = window.confirm('Do you want to save the changes?');
        // alert( tempConform );

        // console.log('testin function ')
        // action(true); // Start processing
        Swal.fire({
            title: "Do you want to save the changes?",
            //   showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                handleSubmit2();
            }
        })


    };



    const fetchTableData2 = async () => {
        action(true)
        const responce = await makeGetRequest('Zero_Count_Rna_Payload_Tool/get_ticket_status_data/')
        console.log('toggal button 2', responce)
        if (responce) {
            action(false)
            setTotalTable(responce.data)
            setPayloadCircle(_.uniq(_.map(responce.data, 'Circle')))
            setPayloadSiteID(_.uniq(_.map(responce.data, 'Site_ID')))
            setPayloadTicketId(_.uniq(_.map(responce.data, 'ticket_id')))
            setPayloadPriority(_.uniq(_.map(responce.data, 'priority')))
            setPayloadStatusData(_.uniq(_.map(responce.data, 'Status')))
            setPayloadAging(_.uniq(_.map(responce.data, 'aging')))
            setTicketType(_.uniq(_.map(responce.data , 'ticket_type')))
            Swal.fire({
                icon: "success",
                title: "Done",
                text: 'Data updated successfuly',
            });

        }
        else {
            action(false)
            // setTotalOpen(false)
        }
    }

    const fetchTableData = async () => {
        action(true)
        const responce = await makeGetRequest('Zero_Count_Rna_Payload_Tool/get_ticket_status_data/')
        console.log('toggal button', responce)
        if (responce) {
            action(false)
            await setTotalTable(responce.data)
            await setPayloadCircle(_.uniq(_.map(responce.data, 'Circle')))
            await setPayloadSiteID(_.uniq(_.map(responce.data, 'Site_ID')))
            await setPayloadTicketId(_.uniq(_.map(responce.data, 'ticket_id')))
            await setPayloadPriority(_.uniq(_.map(responce.data, 'priority')))
            await setPayloadOpenDate(_.uniq(_.map(responce.data, 'Open_Date')))
            await setPayloadStatusData(_.uniq(_.map(responce.data, 'Status')))
            await setPayloadAging(_.uniq(_.map(responce.data, 'aging')))
            await  setTicketType(_.uniq(_.map(responce.data , 'ticket_type')))
            // setCurrentDate(responce.current_date)
            // setPreviousDate(responce.previous_date)
            // setTotalOpen(true)
            // console.log('sat', responce)
        }
        else {
            action(false)
            // setTotalOpen(false)
        }
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
            Remarks: '',
            Short_name: item.Short_name,
            Site_ID: item.Site_ID,
            Status: item.Status,
            Unique_Id: item.Unique_Id,
            aging: CalculateDaysBetweenDates(item.Date, item.Open_Date),
            ticket_id: item.ticket_id,
            RCA: item.RCA,
            category: item.category,
            rca_feedback: item.rca_feedback,
        })
        if(item.Status === 'CLOSE') {
            setPayloadStatusData2(true)
        }else{
            setPayloadStatusData2(false)
        }
        setPayloadStatus(true);
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

    const CalculateDaysBetweenDates = (date1, date2) => {
        const dateObj1 = new Date(date1);
        const dateObj2 = new Date(date2);

        // Calculate the difference in time (milliseconds)
        const timeDifference = dateObj1 - dateObj2;

        // Convert the time difference from milliseconds to days
        const dayDifference = timeDifference / (1000 * 3600 * 24);

        return dayDifference;
    }


    const handleExportPaylodDipData = () => {
        const workbook = new ExcelJS.Workbook();
        const sheet3 = workbook.addWorksheet("Paylod Dip", { properties: { tabColor: { argb: 'f1948a' } } })
  

        sheet3.getCell('A1').value = 'Ticket ID';
        sheet3.getCell('B1').value = 'Circle';
        sheet3.getCell('C1').value = 'Site ID';
        sheet3.getCell('D1').value = 'Cell Name';
        sheet3.getCell('E1').value = 'Current Date';
        sheet3.getCell('F1').value = 'Open Date';
        sheet3.getCell('G1').value = 'Aging';
        sheet3.getCell('H1').value = 'Priority';
        sheet3.getCell('I1').value = 'Cell + Date';
        sheet3.getCell('J1').value = 'Status';
        sheet3.getCell('K1').value = 'Ownership';
        sheet3.getCell('L1').value = 'Category';
        sheet3.getCell('M1').value = 'Auto RCA';
        sheet3.getCell('N1').value = 'Circle Spoc';
        sheet3.getCell('O1').value = 'RCA Feedback';
        sheet3.getCell('P1').value = 'Pre Remarks';


        sheet3.columns = [
            { key: 'ticket_id' },
            { key: 'Circle' },
            { key: 'Site_ID' },
            { key: 'Short_name' },
            { key: 'Date' },
            { key: 'Open_Date' },
            { key: 'aging' },
            { key: 'priority' },
            { key: 'Unique_Id' },
            { key: 'Status' },
            { key: 'Ownership' },
            { key: 'category' },
            { key: 'RCA' },
            { key: 'Circle_Spoc' },
            { key: 'rca_feedback' },
            { key: 'Pre_Remarks' }
        ]

        totalTable?.map(item => {
            sheet3.addRow({
                ticket_id: item?.ticket_id,
                Circle: item?.Circle,
                Site_ID: (item.Site_ID == 'nan' ? '' : item.Site_ID),
                Short_name: item.Short_name,
                Date: handleDateFormets(item.Date),
                Open_Date: handleDateFormets(item.Open_Date),
                aging: item.aging,
                priority: item.priority,
                Unique_Id: item.Unique_Id,
                Status: (item.Status == 'nan' ? '' : item.Status),
                Ownership: (item.Ownership == 'nan' ? '' : item.Ownership),
                category: (item.category == 'nan' ? '' : item.category),
                RCA: (item.RCA == 'nan' ? '' : item.RCA),
                Circle_Spoc: (item.Circle_Spoc == 'nan' ? '' : item.Circle_Spoc),
                rca_feedback: (item.rca_feedback == 'nan' ? '' : item.rca_feedback),
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


    const formatDateTime = (inputDateTime) => {
        const date = new Date(inputDateTime);

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        // Extract hours and minutes
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Format date as dd-mm-yyyy
        const formattedDate = `${day}-${month}-${year}`;

        // Format time as HH:MM
        const formattedTime = `${hours}:${minutes}`;

        // return { date: formattedDate, time: formattedTime };

        return (`Date=>${formattedDate} Time=>${formattedTime} `)
    }


    const FilterPayloadDipData = useCallback(() => {
        let filteredData = _.filter(totalTable, item => {

            const circleMatch = selectCircle.length === 0 || _.includes(selectCircle, item.Circle);
            const siteIdMatch = selectSiteID.length === 0 || _.includes(selectSiteID, item.Site_ID);
            const ticketMatch = selectTicketId.length === 0 || _.includes(selectTicketId, item.ticket_id);
            const priorityMatch = selectPriority.length === 0 || _.includes(selectPriority, item.priority);
            const openDateMatch = selectOpenDate.length === 0 || _.includes(selectOpenDate, item.Open_Date);;
            const agingMatch = selectAging.length === 0 || _.includes(selectAging, item.aging);
            const statusMatch = selectStatusData.length === 0 || _.includes(selectStatusData, item.Status);
            const ticketTypeMatch = selectTicketType.length === 0 || _.includes(selectTicketType, item.ticket_type)


            return circleMatch && siteIdMatch && ticketMatch && priorityMatch && openDateMatch  && agingMatch && statusMatch && ticketTypeMatch;
        });
        return filteredData?.map((item, index) =>  index <= scrollNo &&(
            <tr key={item.Circle+index} className={classes.hover} style={{ textAlign: "center", fontWeigth: 700 }}>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{index + 1}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.ticket_type}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.ticket_id}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Circle}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Site_ID}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Short_name}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{handleDateFormets(item.Date)}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{handleDateFormets(item.Open_Date)}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item?.aging}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.priority}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap', cursor: 'pointer', fontWeigth: 500, color: item.Status == 'OPEN' ? 'red' : 'green' }} className={classes.hover} onClick={() => handleSetDataTicket(item)}>{item.Status == 'nan' ? '' : (<Chip label={item.Status} color={item.Status == 'OPEN' ? 'error' : 'success'} variant="outlined" size="small" />)}</th>
                {/* <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Remarks == 'nan' ? '' : item.Remarks}</th> */}
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Ownership == 'nan' ? '' : item.Ownership}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.category == 'nan' ? '' : item.category}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.RCA == 'nan' ? '' : item.RCA}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.Circle_Spoc}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>{item.rca_feedback}</th>
                <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>
                    {item?.Pre_Remarks ? (
                        item?.Pre_Remarks.map((key, index) => index < 1 && (
                            <div key={key}>
                                {formatDateTime(key.date)}:{key?.Remark}
                            </div>
                        ))
                    ) : (
                        ''
                    )}
                </th>
            </tr>
        ))

    }, [selectCircle, selectSiteID, selectTicketId, selectPriority, selectOpenDate, totalTable, selectStatusData,selectAging,selectTicketType,scrollNo])

    const handleFormDialog = useCallback(() => {
        return (
            <Dialog
                open={payloadStatus}
                // onClose={handleClose}
                keepMounted
                fullWidth
                maxWidth={'md'}
                style={{ zIndex: 10,marginTop: '10px' }}
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
                                            inputProps={{ readOnly: payloadStatusData2 ? true : false }}
                                            fullWidth
                                        >
                                            <MenuItem value='OPEN'>Open</MenuItem>
                                            <MenuItem value='CLOSE'>Close</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {ticketDipForm.Status === 'CLOSE' && <Grid item xs={6}>
                                <FormControl fullWidth required={ticketDipForm.Status === 'CLOSE' ? true : false}>
                                        <InputLabel id="demo-simple-select-label">Is The RCA Usefull ?</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={ticketDipForm.rca_feedback}
                                            name='rca_feedback'
                                            label="Is The RCA Usefull ?"
                                            onChange={handleChange}
                                            size='small'
                                            
                                            inputProps={{ readOnly: payloadStatusData2 ? true : false }}
                                            fullWidth
                                        >
                                            <MenuItem value='true'>Yes</MenuItem>
                                            <MenuItem value='false'>No</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </Grid>}

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
                                        inputProps={{ readOnly: payloadStatusData2 ? true : false }}
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
                                        inputProps={{ readOnly: payloadStatusData2 ? true : false }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        // required
                                        placeholder="Ownership"
                                        label="Ownership"
                                        name="Ownership"
                                        value={ticketDipForm.Ownership}
                                        onChange={handleChange}
                                        inputProps={{ readOnly: payloadStatusData2 ? true : false }}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* <TextField
                                        variant="outlined"
                                        fullWidth
                                        required
                                        placeholder="Category"
                                        label="Category"
                                        name="category"
                                        value={ticketDipForm.category}
                                        onChange={handleChange}
                                        // InputProps={{
                                        //     readOnly: true,
                                        // }}
                                        size="small"
                                        type='text'
                                    /> */}
                                    <FormControl fullWidth required>
                                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={ticketDipForm.category}
                                            name='category'
                                            label="Category"
                                            onChange={handleChange}
                                            inputProps={{ readOnly: payloadStatusData2 ? true : false }}
                                            size='small'
                                            fullWidth
                                        >
                                            <MenuItem value='RNA issue'>RNA Issue</MenuItem>
                                            <MenuItem value='HW issue'>HW Issue</MenuItem>
                                            <MenuItem value='Tx issue'>Tx Issue</MenuItem>
                                            <MenuItem value='Quality alarm'>Quality Alarm</MenuItem>
                                            <MenuItem value='Soft optimization done/Payload shifted within sector'>Soft optimization done/Payload shifted within sector</MenuItem>
                                            <MenuItem value='Optimization done as per customer requirements'>Optimization done as per customer requirements</MenuItem>
                                            <MenuItem value='Optimization done for KPI improvement'>Optimization done for KPI improvement</MenuItem>
                                            <MenuItem value='Physical optimization planned'>Physical optimization planned</MenuItem>
                                            <MenuItem value='New layer /Sector coming in site'>New layer /Sector coming in site</MenuItem>
                                            <MenuItem value='New site / Sector come in neighobur'>New site / Sector come in neighobur</MenuItem>
                                            <MenuItem value='Soft optimization planned'>Soft optimization planned</MenuItem>
                                            <MenuItem value='MS2 Done'>MS2 Done</MenuItem>
                                            <MenuItem value='Others'>Others</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        placeholder="Pre Remarks"
                                        label="Pre Remarks"
                                        name="Pre_Remarks"
                                        value={ticketDipForm.Pre_Remarks
                                            ? ticketDipForm.Pre_Remarks.map(item => `${formatDateTime(item?.date)}->${item?.Remark || ''}`).join('\n')
                                            : ''
                                        }
                                        InputProps={{
                                            readOnly: true,
                                            style: {
                                                color: 'blue', // Text color
                                                fontWeight: 'bold', // Text weight
                                                whiteSpace: 'pre-wrap', // To handle newlines (\n) properly
                                                fontSize: '14px', // Font size
                                            },
                                        }}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ display: payloadStatusData2 ? 'none' : 'block' }}>
                                    <Button type='submit' size='sm' variant='outlined' fullWidth >Update</Button>
                                </Grid>

                            </Grid>
                        </form>
                    </Container>
                </DialogContent>
            </Dialog>
        )
    }, [payloadStatus, ticketDipForm])


    const handleScroll = () => {
        // console.log('scrolling')
        const scrollableContainer = scrollableContainerRef.current;

        // Calculate the distance between the bottom of the container and the bottom of the scrollable content
        const distanceToBottom = scrollableContainer.scrollHeight - (scrollableContainer.scrollTop + scrollableContainer.clientHeight);

        // Define a threshold to determine when the scrollbar is considered to be at the endpoint
        const threshold = 50; // Adjust as needed

        // Call your function when scrollbar is at the endpoint (within the threshold)
        if (distanceToBottom <= threshold) {
            // console.log('Scrollbar reached the endpoint!');
            setScrollNo(scrollNo + 50)
            // Call your function here
        }
    };

    useEffect(() => {
        fetchTableData();


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
                                <IconButton onClick={() => { handleExportPaylodDipData(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>


                    {/* ************* 2G  TABLE DATA ************** */}

                    <Box sx={{ marginTop: 1 }}>

                        <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} ref={scrollableContainerRef} onScroll={handleScroll}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>S.No.</th>
                                        <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Ticket Type <CheckPicker data={ticketType.map(item => ({ label: item, value: item }))} value={selectTicketType} onChange={(value) => { setSelectTicketType(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /></th>
                                        <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Ticket ID <CheckPicker data={payloadTicketId.map(item => ({ label: item, value: item }))} value={selectTicketId} onChange={(value) => { setSelectTicketId(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /></th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }} >Circle <CheckPicker data={payloadCircle.map(item => ({ label: item, value: item }))} value={selectCircle} onChange={(value) => { setSelectCircle(value) }} size="sm" appearance="default" style={{ width: 20 }} /> </th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Site ID <CheckPicker data={payloadSiteID.map(item => ({ label: item, value: item }))} value={selectSiteID} onChange={(value) => { setSelectSiteID(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>

                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Cell Name</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Current Date</th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Open Date <CheckPicker data={payloadOpenDate.map(item => ({ label: handleDateFormets(item), value: item }))} value={selectOpenDate} onChange={(value) => { setSelectOpenDate(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Aging <CheckPicker data={payloadAging.map(item => ({ label: item, value: item }))} value={selectAging} onChange={(value) => { setSelectAging(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Priority <CheckPicker data={payloadPriority.map(item => ({ label: item, value: item }))} value={selectPriority} onChange={(value) => { setSelectPriority(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                        <th style={{ padding: '1px 60px 1px 2px', whiteSpace: 'nowrap' }}>Status <CheckPicker data={payloadStatusData.map(item => ({ label: item, value: item }))} value={selectStatusData} onChange={(value) => { setSelectStatusData(value) }} size="sm" appearance="default" style={{ width: 20 }} /></th>
                                        {/* <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Remarks</th> */}
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Ownership</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Category</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Auto RCA</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle Spoc</th>
                                        <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>RCA Feedback</th>
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
                            </table>
                        </TableContainer>
                    </Box>

                </div>
            </Slide>
            {/* {filterDialog()}
            {TotalTableDialog()} */}
            {handleFormDialog()}
            {loading}
        </>
    )
}

export default RaiseTicket2