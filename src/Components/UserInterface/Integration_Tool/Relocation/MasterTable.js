import React, { useCallback, useMemo } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Box, Breadcrumbs, Link, TextField, Typography, Button } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { getData, postData, putData } from '../../../services/FetchNodeServices';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import SiteLockUnlockForm from './SiteLockUnlockForm';
import { DateRangePicker } from 'rsuite';
import CountUp from 'react-countup';
import _ from 'lodash';
import Swal from 'sweetalert2';
import CachedIcon from '@mui/icons-material/Cached';
import CircleIcon from '@mui/icons-material/Circle';
import Chip from '@mui/material/Chip';
import * as ExcelJS from 'exceljs'


const MasterTable = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const classes = useStyles();
    const scrollableContainerRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [scrollNo, setScrollNo] = useState(50)
    const [tempRawData, setTempRawData] = useState('');
    const [open, setOpen] = useState(false);
    const [circleData, setCircleData] = useState([]);
    const [selectCircle, setSelectCircle] = useState([]);
    const [newSiteId, setNewSiteId] = useState([]);
    const [oldSiteId, setOldSiteId] = useState([]);
    const [selectNewSiteId, setSelectNewSiteId] = useState([]);
    const [selectOldSiteId, setSelectOldSiteId] = useState([]);
    const [handleColor, setHandleColor] = useState(false);
    const [devStatus, setDevStatus] = useState([])
    const [devStatus1, setDevStatus1] = useState([])
    const [bothSiteLock, setBothSiteLock] = useState([])
    const [bothSiteUnlock, setBothSiteUnlock] = useState([])
    const [payloadDip, setPayloadDip] = useState([])
    const [oemData, setOemData] = useState([])
    const [remarkText, setRemarkText] = useState('')
    const [redData, setRedData] = useState(false)
    const [fromToDate,setFromToDate] = useState([])
    const [newFormToDate,setNewFromToDate] = useState(['',''])

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
        let responce = await postData('IntegrationTracker/master-dashboard/',formData);
        //   let responce = await getData('IntegrationTracker/relocation/tracker/');
        console.log('responce', responce)
        if (responce) {
            action(false)
            setOldSiteId(_.uniq(_.map(responce?.relocation_data, 'old_site_id')))
            setNewSiteId(_.uniq(_.map(responce?.relocation_data, 'new_site_id')))
            setCircleData(_.uniq(_.map(responce?.relocation_data, 'circle')))
            setOemData(_.uniq(_.map(responce?.relocation_data, 'OEM')))
            compileTableData(responce?.relocation_data)
        } else {
            action(false)
        }
    }

    const compileTableData = useCallback((tData) => {

        // let filterDateRange = tData.filter((item) => {
        //     let date = new Date(item.integration_date); // Convert to Date object
        
        //     return date >= fromToDate[0] && date <= fromToDate[1];
        // });
        // console.log('fiterDateRange', filterDateRange)
        // let uniqCircle = filterDateRange.length > 0? _.groupBy( filterDateRange, 'circle'): _.groupBy( tData, 'circle');
        let uniqCircle =_.groupBy( tData, 'circle');

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

        // console.log('newObjectData', newObjectData)


        setTableData(newObjectData)
    },[])


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

     const convertDates=useCallback((arr)=> {

        let newDate = arr?.map(dateStr => {
          const date = new Date(dateStr);
          return date.toISOString().split('T')[0]; // Extracts only the YYYY-MM-DD part
        });

        setNewFromToDate(newDate)

      },[])



    const getLockFormate = (data) => {
        let statusData = data?.map(item => item.status).at(-1);
        let tempDate = data?.map(item => item.created_at).at(-1);
        let formattedDate = new Date(tempDate).toLocaleString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // For AM/PM format
            timeZone: 'Asia/Kolkata' // Ensure the correct timezone
        });
        // console.log(statusData , tempDate )
        if (statusData && formattedDate) {
            return (`${statusData} (${formattedDate})`)
        } else {
            return ''
        }

    }

    const handleScroll = () => {
        console.log('scrolling')
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




    const checkClickFunction = async (e, item) => {
        e.preventDefault();

        console.log('clicked', item, Object.values(remarkText)[0])

        let formData = new FormData()
        formData.append('Remark', Object.values(remarkText)[0])
        let responce = await putData(`IntegrationTracker/relocation/tracker/relocation_remark/${item?.id}/`, formData);
        console.log('responce', responce)
        if (responce) {
            action(false)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Data Added Successfully',
                showConfirmButton: false,
                timer: 1500
            })
            fetchApiData()
            setRemarkText('')
            // updateTableData()
        }
    }

    const handleDateformate = (e) => {
        e.preventDefault();
        // console.log('aaa', e)
        fetchApiData()
    }
    




    const FilterTableData = useMemo(() => {

        let filteredData = redData ? tableData.filter(item => item.both_site_unlocked === 'Yes' || item.both_site_locked === 'Yes') : _.filter(tableData, item => {

            const circleMatch = selectCircle.length === 0 || _.includes(selectCircle, item.circle);
            const oldSiteIdMatch = selectOldSiteId.length === 0 || _.includes(selectOldSiteId, item.old_site_id);
            const newSiteIdMatch = selectNewSiteId.length === 0 || _.includes(selectNewSiteId, item.new_site_id);
            const devStatusMatch = devStatus.length === 0 || _.includes(devStatus, item.allocated_vs_deployed_tech_deviation);
            const devStatusMatch1 = devStatus1.length === 0 || _.includes(devStatus1, item.old_vs_deployed_tech_deviation);
            const bothSiteLockMatch = bothSiteLock.length === 0 || _.includes(bothSiteLock, item.both_site_locked);
            const bothSiteUnlockMatch = bothSiteUnlock.length === 0 || _.includes(bothSiteUnlock, item.both_site_unlocked);
            const payloadDipMatch = payloadDip.length === 0 || _.includes(payloadDip, item.payload_dip);

            return circleMatch && oldSiteIdMatch && newSiteIdMatch && devStatusMatch && devStatusMatch1 && bothSiteLockMatch && bothSiteUnlockMatch && payloadDipMatch;
        });



        const colorChange = (data) => {
            if (data.allocated_vs_deployed_tech_deviation === 'Yes') {
                // return '#A9B5DF'
                return classes.blink1
                // return false
            }

            if (data.both_site_unlocked === 'Yes' || data.both_site_locked === 'Yes') {
                // return '#FFC0CB'
                return classes.blink
                // return true
            }
            return ''
        }

        // const filterRedColor = filteredData.filter(item =>  item.both_site_unlocked === 'Yes' || item.both_site_locked === 'Yes')


        // console.log('filter data' , filteredData)


        return filteredData?.map((item, index) => (
            <tr key={item.circle + index}
                className={`${classes.hover} ${colorChange(item)}`}
                style={{ textAlign: "center", fontWeigth: 700 }}

            >
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{index + 1}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.circle}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }} title={Object.keys(item.OEM).join(', ')}>{Object.keys(item.OEM).length}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>
                    {item.allocated_vs_deployed?.Yes > 0 ? (
                        <Chip
                            label={item.allocated_vs_deployed.Yes}
                            color="error"
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
                            color="error"
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
                            color="error"
                            // style={{ fontWeight: 'bold' }}
                            variant="filled" size="small"
                        />
                    ) : (
                        item.both_site_locked?.Yes || 0
                    )}
                </th>

                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.payload_dip?.Yes || 0}</th>

            </tr>
        ))
    }, [selectCircle, selectNewSiteId, selectOldSiteId, tableData, handleColor, devStatus, devStatus1, bothSiteLock, bothSiteUnlock, payloadDip, remarkText, redData])

    const handleReload = useCallback(async() => {
            await setFromToDate([]);
            await setNewFromToDate(['','']);
            await fetchApiData();
    }, []);






    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        fetchApiData();

    }, [])

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
                    <form onSubmit={handleDateformate}>
                     
                        <DateRangePicker name='date' format="dd.MM.yyyy" value={fromToDate}   onChange={(e) => { setFromToDate(e || []);convertDates(e); }} appearance="subtle" showOneCalendar required />
            

               
                        <Button type='submit' variant='outlined' color='primary'>Filter</Button>
                 
                    </form>
                   

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
                                        <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.circle}</th>
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
           
            {loading}
        </>
    )
}

export default MasterTable