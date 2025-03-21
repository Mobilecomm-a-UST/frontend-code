import React, { useCallback, useMemo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Box, Breadcrumbs, Link, TextField, Typography, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { getData, postData, putData } from '../../../services/FetchNodeServices';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { DateRangePicker } from 'rsuite';
import CountUp from 'react-countup';
import _ from 'lodash';
import Swal from 'sweetalert2';
import CachedIcon from '@mui/icons-material/Cached';
import Chip from '@mui/material/Chip';
import * as ExcelJS from 'exceljs'


const MasterTable = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = useStyles();
    const [tableData, setTableData] = useState([]);
    const [allTableData, setAllTableData] = useState([]);
    const [tempTableData, setTempTableData] = useState([]);
    const [open, setOpen] = useState(false);
    const [circleData, setCircleData] = useState([]);
    const [newSiteId, setNewSiteId] = useState([]);
    const [oldSiteId, setOldSiteId] = useState([]);
    const [oemData, setOemData] = useState([])
    const [fromToDate, setFromToDate] = useState([])
    const [newFormToDate, setNewFromToDate] = useState(['', ''])

    // console.log(fromToDate)


    //    console.log('uniqCircle', (_.countBy(uniqCircle?.KK, 'allocated_vs_deployed_tech_deviation')))
    // console.log('color data', devStatus)
    const totalss = {
        OEM: 0,
        allocated_vs_deployed: 0,
        old_vs_deployed: 0,
        both_site_unlocked: 0,
        both_site_locked: 0,
        payload_dip: 0,
    };
    const fetchApiData = async () => {
        // const formData = new FormData()
        action(true)

        let formData = new FormData()
        formData.append('from_date', newFormToDate[0])
        formData.append('to_date', newFormToDate[1])
        let responce = await postData('IntegrationTracker/master-dashboard/', formData);
        //   let responce = await getData('IntegrationTracker/relocation/tracker/');
        console.log('responce', responce)
        if (responce) {
            action(false)
            setOldSiteId(_.uniq(_.map(responce?.relocation_data, 'old_site_id')))
            setNewSiteId(_.uniq(_.map(responce?.relocation_data, 'new_site_id')))
            setCircleData(_.uniq(_.map(responce?.relocation_data, 'circle')))
            setOemData(_.uniq(_.map(responce?.relocation_data, 'OEM')))
            setAllTableData(responce?.relocation_data)
            compileTableData(responce?.relocation_data)
        } else {
            action(false)
        }
    }

    const compileTableData = useCallback((tData) => {

        let uniqCircle = _.groupBy(tData, 'circle');

        let newObjectData = []

        Object.entries(uniqCircle).forEach(([key, value]) => {
            let countOem = _.countBy(value, 'OEM')
            let countAlloc = _.countBy(value, 'allocated_vs_deployed_tech_deviation')
            let oldDeploy = _.countBy(value, 'old_vs_deployed_tech_deviation')
            let lockSite = _.countBy(value, 'both_site_locked')
            let unlockSite = _.countBy(value, 'both_site_unlocked')
            let payloadSite = _.countBy(value, 'payload_dip')
            // console.log('circle', key, 'OEM:', countOem,"allocated_vs_deployed", countAlloc, "old_site_technology", oldDeploy);
            newObjectData.push({ 'circle': key, 'OEM': countOem, 'allocated_vs_deployed': countAlloc, 'old_vs_deployed': oldDeploy, 'both_site_locked': lockSite, 'both_site_unlocked': unlockSite, 'payload_dip': payloadSite });
        });

        setTableData(newObjectData)
    }, [])


    const calculateColumnTotals = useMemo(() => {
        const totals = {
            OEM: 0,
            allocated_vs_deployed: 0,
            old_vs_deployed: 0,
            both_site_locked: 0,
            both_site_unlocked: 0,
            payload_dip: 0,
        };

        tableData.forEach(item => {
            for (let key in totals) {
                if (key === 'OEM') {
                    totals[key] += Number(Object.keys(item[key]).length);
                } else {
                    totals[key] += Number(item[key].Yes) || 0;
                }

            }
        });

        return totals;

        // console.log('totals', totals)
    }, [tableData]);

    const columnData = [
        { title: 'Circle', field: 'circle' },
        { title: 'OEM', field: 'OEM' },
        { title: 'Deviation Gap (Allocated Vs Deployed)', field: 'allocated_vs_deployed' },
        { title: 'Deviated Gap. (Old Vs Deployed)', field: 'old_vs_deployed' },
        { title: 'Both Sites Unlocked', field: 'both_site_unlocked' },
        { title: 'Both Sites Locked', field: 'both_site_locked' },
        { title: 'Payload Dip', field: 'payload_dip' },
    ];


    const handleExportInExcel = () => {
        const workbook = new ExcelJS.Workbook()
        const sheet1 = workbook.addWorksheet('Relocation', { properties: { tabColor: { argb: 'B0EBB4' } } })
        sheet1.columns = columnData.map((col) => ({
            header: col.title,
            key: col.field,
            width: 25, // Adjust column width as needed
        }));
        tableData?.forEach((row) => {
            const formattedRow = {};
            columnData.forEach((col) => {
                if (col.field === "OEM") {
                    formattedRow[col.field] = Object.keys(row[col.field]).length; // Object.keys(item.OEM).length
                }
                else if (col.field === "circle") {
                    formattedRow[col.field] = row[col.field]
                }
                else {
                    formattedRow[col.field] = row[col.field]?.Yes || 0; // Default value
                }
            });

            // Add Row to Sheet
            sheet1.addRow(formattedRow);

        });



        // Apply Header Styling
        // sheet1.getRow(1).eachCell((cell) => {
        //     cell.font = { bold: true, color: { argb: "FFFFFF" } }; // White text
        //     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "007BFF" } }; // Blue background
        //     cell.alignment = { vertical: "middle", horizontal: "center" };
        //     cell.border = {
        //         top: { style: 'thin' },
        //         left: { style: 'thin' },
        //         bottom: { style: 'thin' },
        //         right: { style: 'thin' }
        //     }
        // });
        sheet1.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
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
            anchor.download = "Relocation_Tracker.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })


    }

    const convertDates = useCallback((arr) => {

        let newDate = arr?.map(dateStr => {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0]; // Extracts only the YYYY-MM-DD part
        });

        console.log('newDate', newDate ? newDate : ['', ''])

        setNewFromToDate(newDate ? newDate : ['', ''])

    }, [])

    const filterCircle = async (item) => {
        let newCircle = allTableData.filter((data) => data.circle === item && (data.allocated_vs_deployed_tech_deviation === 'Yes' || data.both_site_unlocked === 'Yes' || data.both_site_locked === 'Yes'));
        // console.log('item', item, newCircle)
        await setTempTableData(newCircle)
        await setOpen(true)

    }



    const handleReload = useCallback(async () => {
        await setFromToDate([]);
        await setNewFromToDate(['', '']);
        await fetchApiData();
    }, []);



    const handleClose = () => {
        setOpen(false);
    }

    const openDialogTable = () => {
        console.log('dialog table data show')
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth={'lg'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} >
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                                <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                         <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                    <th style={{  backgroundColor: "#223354", padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>OEM</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Old Site Id </th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>New Site Id </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Integration Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MO Name</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>No. of BBUs</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Allocated Technology(As Per DP)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deployed Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Locked-Unlocked Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Locked-Unlocked Date</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Deviation Status (Allocated Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviated Tech. (Allocated Vs Deployed)</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Deviation Status (Old Vs Deployed) </th>
                                    <th style={{ padding: '1px 5px', whiteSpace: 'nowrap' }}>Deviated Tech. (Old Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Traffic Fixed</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Latest Traffic</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Latest Traffic</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Pre &lt;3 Mbps</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Current &lt;3Mbps</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Payload Dip </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MS2 Status</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Remarks</th>

                                </tr>
                            </thead>
                            <tbody>
                                {tempTableData?.map((item,index) => (
                                    <tr key={item.circle + index}
                                        className={`${classes.hover}`}   
                                       
                                        style={{ textAlign: "center", fontWeigth: 700, border: '1px solid black' }}
                                    //  onClick={() => handleRowClick({ id: item.id })},backgroundColor:handleColor?colorChange(item):''
                                    // onClick={() => checkClickFunction({ id: item.id })}
                                    >
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{index + 1}</th>
                                        <th style={{  whiteSpace: 'nowrap', border: '1px solid black' }} >{item.circle}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.OEM}</th>
                                        <th style={{ border: '1px solid black' }}>{item.old_site_id}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.new_site_id}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.integration_date}</th>

                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.mo_name}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.no_of_BBUs}</th>

                                        <th style={{ border: '1px solid black' }}>{item.old_site_technology}</th>
                                        <th style={{ border: '1px solid black' }}>{item.allocated_technology}</th>
                                        <th style={{ border: '1px solid black' }}>{item.deployed_technology}</th>
                                       
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', color: item.allocated_vs_deployed_tech_deviation === 'Yes' ? 'red' : 'green' }}>{item.allocated_vs_deployed_tech_deviation}</th>
                                        <th style={{ border: '1px solid black' }}>{item.allocated_vs_deployed_tech}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', color: item.old_vs_deployed_tech_deviation === 'Yes' ? 'red' : 'green' }}>{item.old_vs_deployed_tech_deviation}</th>
                                        <th style={{ border: '1px solid black' }}>{item.old_vs_deployed_tech}</th>

                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_traffic_fixed}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_traffic_variable}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.existing_traffic}</th>

                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', color: item.both_site_unlocked === 'Yes' ? 'red' : 'green' }}>{item.both_site_unlocked}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', color: item.both_site_locked === 'Yes' ? 'red' : 'green' }}>{item.both_site_locked}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.pre_less_than_3_mbps}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.current_less_than_3_mbps}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', color: item.payload_dip === 'Yes' ? 'red' : 'green' }}>{item.payload_dip}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.ms1_date}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.ms2}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>
                                            {item.Remark}
                                        </th>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        )
    }




    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        fetchApiData();

    }, [newFormToDate])

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/Integration') }}>IX Tracker Tool</Link>
                    <Typography color='text.primary'>Relocation Master Table</Typography>
                </Breadcrumbs>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)', // Creates 3 equal columns
                        columnGap: 2, // Adds spacing between grid items
                        backgroundColor: 'white',
                        padding: '10px',
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        marginBottom: '10px',
                        borderRadius: '10px',
                    }}
                >
                    <Box sx={{ padding: '5px', borderRadius: '5px', backgroundColor: '#D0ECE7', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                        <Box sx={{ fontWeight: 'bold', color: 'black', fontSize: '16px', textAlign: 'center' }}>
                            Summary
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of Circle</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: 'rgb(109, 153, 95)', fontWeight: 'bold' }}>{circleData?.length}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of OEM's</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: 'rgb(109, 153, 95)', fontWeight: 'bold' }}>{oemData?.length}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of Distinct New Sites</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: 'rgb(109, 153, 95)', fontWeight: 'bold' }}>{newSiteId?.length}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of Distinct Old Sites</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: 'rgb(109, 153, 95)', fontWeight: 'bold' }}>{oldSiteId?.length}</span>
                        </Box>

                    </Box>
                    <Box sx={{ padding: '5px', borderRadius: '5px', backgroundColor: '#A0DEFF', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                        <Box sx={{ fontWeight: 'bold', color: 'black', fontSize: '16px', textAlign: 'center' }}>
                            Technology
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}>Deviation Gap (Allocated Vs Deployed)</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: '#1686f5', fontWeight: 'bold' }}><CountUp end={calculateColumnTotals.allocated_vs_deployed} duration={5} /></span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}>Deviation Gap (Old Vs Deployed)</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: '#1686f5', fontWeight: 'bold' }}><CountUp end={calculateColumnTotals.old_vs_deployed} duration={5} /></span>
                        </Box>

                    </Box>
                    <Box sx={{ padding: '5px', borderRadius: '5px', backgroundColor: '#ECB176', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                        <Box sx={{ fontWeight: 'bold', color: 'black', fontSize: '16px', textAlign: 'center' }}>
                            Status
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}>Total No. Of Both Site Unlocked</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: '#feff84', fontWeight: 'bold', backgroundColor: '#c5712c' }}><CountUp end={calculateColumnTotals.both_site_unlocked} duration={5} /></span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of Both Site Locked</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', backgroundColor: '#feff84', fontWeight: 'bold', backgroundColor: '#c5712c' }}><CountUp end={calculateColumnTotals.both_site_locked} duration={5} /></span>
                        </Box>

                    </Box>

                    <Box sx={{ padding: '5px', borderRadius: '5px', backgroundColor: '#dbf1bd', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', }}>
                        <Box sx={{ fontWeight: 'bold', color: 'black', fontSize: '16px', textAlign: 'center' }}>
                            Payload Dip
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 1 }}>
                            <span style={{ fontSize: '14px', color: 'black', }}> Total No. Of Payload Dip</span>
                            <span style={{ fontSize: '14px', color: 'white', border: '1px solid black', padding: '3px 10px', borderRadius: '50%', fontWeight: 'bold', backgroundColor: '#47470e' }}>{calculateColumnTotals.payload_dip}</span>
                        </Box>

                    </Box>


                </Box>

                <div style={{ float: 'right', display: 'flex', alignItems: 'center', gap: '10px', margin: '10px' }}>
                    <IconButton color='primary' title='reload' onClick={handleReload}>
                        <CachedIcon />
                    </IconButton>
                    {/* <form onSubmit={handleDateformate}> */}

                    <DateRangePicker name='date' format="dd.MM.yyyy" value={fromToDate} onChange={(e) => { setFromToDate(e || []); convertDates(e); }} appearance="subtle" showOneCalendar required />



                    {/* <Button type='submit' variant='outlined' color='primary'>Filter</Button>
                 
                    </form> */}


                    <IconButton color='primary' onClick={handleExportInExcel} title='Export in Excel'>
                        <DownloadIcon />
                    </IconButton>
                </div>

                <div >
                    <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} >
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>OEM</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviation Gap (Allocated Vs Deployed) </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviation Gap (Old Vs Deployed) </th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Unlocked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Locked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Payload Dip</th>
                                </tr>
                            </thead>
                            <tbody>

                                {/* {FilterTableData} */}
                                {tableData?.map((item, index) => (
                                    <tr key={item.circle + index}
                                        className={`${classes.hover}`}
                                        style={{ textAlign: "center", fontWeigth: 700 }}

                                    >
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{index + 1}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black', cursor: 'pointer' }} className={classes.hover} onClick={() => filterCircle(item.circle)}>{item.circle}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }} title={Object.keys(item.OEM).join(', ')}>{Object.keys(item.OEM).length}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>
                                            {item.allocated_vs_deployed?.Yes > 0 ? (
                                                <Chip
                                                    label={item.allocated_vs_deployed.Yes}
                                                    color="warning"
                                                    // style={{ fontWeight: 'bold' }}
                                                    variant="filled" size="small"
                                                />
                                            ) : (
                                                item.allocated_vs_deployed?.Yes || 0
                                            )}
                                        </th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_vs_deployed?.Yes || 0}</th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>
                                            {/* {item.both_site_unlocked?.Yes || 0} */}
                                            {item.both_site_unlocked?.Yes > 0 ? (
                                                <Chip
                                                    label={item.both_site_unlocked.Yes}
                                                    color="warning"
                                                    // style={{ fontWeight: 'bold' }}
                                                    variant="filled" size="small"
                                                />
                                            ) : (
                                                item.both_site_unlocked?.Yes || 0
                                            )}
                                        </th>
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>
                                            {/* {item.both_site_locked?.Yes || 0} */}
                                            {item.both_site_locked?.Yes > 0 ? (
                                                <Chip
                                                    label={item.both_site_locked.Yes}
                                                    color="warning"
                                                    // style={{ fontWeight: 'bold' }}
                                                    variant="filled" size="small"
                                                />
                                            ) : (
                                                item.both_site_locked?.Yes || 0
                                            )}
                                        </th>

                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.payload_dip?.Yes || 0}</th>

                                    </tr>
                                ))}

                                <tr style={{ textAlign: "center", fontWeigth: 700, backgroundColor: '#B0EBB4', color: '#000000', fontSize: 17 }}>
                                    <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
                                    <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#B0EBB4' }}>Total</th>
                                    {calculateColumnTotals && Object.keys(totalss).map((key) => (
                                        <th style={{ border: '1px solid black' }} key={key}>{calculateColumnTotals[key]}</th>
                                    ))}
                                    {/* {calculateColumnTotals} */}
                                </tr>

                            </tbody>
                        </table>
                    </TableContainer>
                </div>
            </div>
            {open && openDialogTable()}
            {loading}
        </>
    )
}

export default MasterTable