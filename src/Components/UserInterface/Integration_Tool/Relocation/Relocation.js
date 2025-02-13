import React, { useCallback } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';
import { getData } from '../../../services/FetchNodeServices';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useStyles } from '../../ToolsCss';
import { CsvBuilder } from 'filefy';
import SiteLockUnlockForm from './SiteLockUnlockForm';
import CheckPicker from 'rsuite/CheckPicker';
import _, { set } from 'lodash';
import CircleIcon from '@mui/icons-material/Circle';


const Relocation = () => {
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


    // console.log('color data' , handleColor)

    const fetchApiData = async () => {
        // const formData = new FormData()
        action(true)
        let responce = await getData('IntegrationTracker/relocation/tracker/');
        if (responce) {
            action(false)
            console.log('responce  data', responce)
            setTableData(responce)
            // setPayloadCircle(_.uniq(_.map(responce.data, 'Circle')))
            setCircleData(_.uniq(_.map(responce, 'circle')))
            setOldSiteId(_.uniq(_.map(responce, 'old_site_id')))
            setNewSiteId(_.uniq(_.map(responce, 'new_site_id')))

        } else {
            action(false)

        }
    }

    const columnData = [
        // { title: 'S.No', field: 'index' },
        { title: 'Circle', field: 'circle' },
        { title: 'Old Site ID', field: 'old_site_id' },
        { title: 'New Site ID', field: 'new_site_id' },
        { title: 'Integration Date', field: 'integration_date' },
        { title: 'MS1 Date', field: 'ms1_date' },
        { title: 'Old Site Technology', field: 'old_site_technology' },
        { title: 'Allocated Technology (as per DP)', field: 'allocated_technology' },
        { title: 'Deployed Technology', field: 'deployed_technology' },
        { title: 'Deviation Status (Allocated Vs Deployed)', field: 'allocated_vs_deployed_tech_deviation' },
        { title: 'Deviated Tech. (Allocated Vs Deployed)', field: 'allocated_vs_deployed_tech' },
        // 
        { title: 'Deviation Status (Old Vs Deployed)', field: 'old_vs_deployed_tech_deviation' },
        { title: 'Deviated Tech. (Old Vs Deployed)', field: 'old_vs_deployed_tech' },
        // 
        { title: 'Old Site Locked-Unlocked Date', field: 'old_site_locked_unlocked_date' },
        { title: 'New Site Locked-Unlocked Date', field: 'new_site_locked_unlocked_date' },

        { title: 'Old Site Traffic Fixed', field: 'old_site_traffic_fixed' },
        { title: 'Old Site Latest Traffic', field: 'old_site_traffic_variable' },
        { title: 'Latest Traffic', field: 'existing_traffic' },
        // { title: 'Old Site Admin Status (RNA)', field: 'old_site_admin_status' },
        // { title: 'New Site Admin Status (RNA)', field: 'new_site_admin_status' },
        { title: 'Both Sites Unlocked', field: 'both_site_unlocked' },
        { title: 'Both Sites Locked', field: 'both_site_locked' },
        { title: 'Pre <3 Mbps', field: 'pre_less_than_3_mbps' },
        { title: 'Current <3 Mbps', field: 'current_less_than_3_mbps' },
        { title: 'Payload Dip', field: 'payload_dip' },
    ];



    const handleExport = () => {
        var csvBuilder = new CsvBuilder(`Relocation_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(tableData.map(row => columnData.map(col =>{
                if (col.field === 'old_site_locked_unlocked_date' || col.field === 'new_site_locked_unlocked_date'){
                    return getLockFormate(row[col.field]) 
                }
                else{
                    return row[col.field]
                } 
            })))
            .exportFile();
    }

    const getLockFormate =(data)=>{
        let statusData = data?.map(item => item.status).at(-1);
        let tempDate  = data?.map(item=>item.created_at).at(-1);
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
        if(statusData && formattedDate){
             return (`${statusData} (${formattedDate})`)
        }else{
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

    const handleRowClick = (rowData) => {
        console.log('Row clicked:', rowData);
        if (rowData.value === 'old') {
            setTempRawData({ id: rowData.id, hading: 'Old Site Locked & Unlocked Date', getApi: 'get_old_site_locked_unlocked_date', postApi: 'old_site_locked_unlocked_date' });
            setOpen(true)
        } else {
            setTempRawData({ id: rowData.id, hading: 'New Site Locked & Unlocked Date', getApi: 'get_new_site_locked_unlocked_date', postApi: 'New_site_locked_unlocked_date' });
            setOpen(true)
        }

    };

    const FilterTableData = useCallback(() => {

        let filteredData = _.filter(tableData, item => {

            const circleMatch = selectCircle.length === 0 || _.includes(selectCircle, item.circle);
            const oldSiteIdMatch = selectOldSiteId.length === 0 || _.includes(selectOldSiteId, item.old_site_id);
            const newSiteIdMatch = selectNewSiteId.length === 0 || _.includes(selectNewSiteId, item.new_site_id);

            return circleMatch && oldSiteIdMatch && newSiteIdMatch;
        });



    const colorChange = (data)=>{
        if(data.allocated_vs_deployed_tech_deviation === 'Yes'){
            // return '#A9B5DF'
            return classes.blink1
            // return false
        }
    
        if(data.both_site_unlocked === 'Yes' || data.both_site_locked === 'Yes'){
            // return '#FFC0CB'
            return classes.blink
            // return true
        }
        return ''
    }


        // console.log('filter data' , filteredData.map(item=>item.))


        return filteredData?.map((item, index) => (
            <tr key={item.circle + index}    
            // className={`${classes.hover} ${colorChange(item)?classes.blink:''}`}   
            className={`${classes.hover} ${colorChange(item)}`}   
             style={{ textAlign: "center", fontWeigth: 700}}
            //  onClick={() => handleRowClick({ id: item.id })},backgroundColor:handleColor?colorChange(item):''
            >
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{index + 1}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.circle}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_id}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.new_site_id}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.integration_date}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.ms1_date}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_technology}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.allocated_technology}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.deployed_technology}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black',color:item.allocated_vs_deployed_tech_deviation==='Yes'?'red':'green' }}>{item.allocated_vs_deployed_tech_deviation}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.allocated_vs_deployed_tech}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black',color:item.old_vs_deployed_tech_deviation==='Yes'?'red':'green' }}>{item.old_vs_deployed_tech_deviation}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_vs_deployed_tech}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black', cursor: 'pointer' }}
                    className={classes.hover}
                    data-value="old"
                    onClick={() => { handleRowClick({ id: item.id, value: 'old' }) }}
                    >
                     {getLockFormate(item.old_site_locked_unlocked_date)}
                </th>
                <th style={{ whiteSpace: '  nowrap', border: '1px solid black', cursor: 'pointer' }}
                    className={classes.hover}
                    onClick={() => { handleRowClick({ id: item.id, value: 'new' }) }}
                    >
                    {/* {item.new_site_locked_unlocked_date?.map(item => item.status).at(-1)}
                    {item.new_site_locked_unlocked_date?.map(item => item.created_at).at(-1)} */}
                    {getLockFormate(item.new_site_locked_unlocked_date)}
                </th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_traffic_fixed}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.old_site_traffic_variable}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.existing_traffic}</th>
                {/* <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_admin_status}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.new_site_admin_status}</th> */}
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black',color:item.both_site_unlocked==='Yes'?'red':'green' }}>{item.both_site_unlocked}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black',color:item.both_site_locked==='Yes'?'red':'green' }}>{item.both_site_locked}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.pre_less_than_3_mbps}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black' }}>{item.current_less_than_3_mbps}</th>
                <th style={{ whiteSpace: 'nowrap', border: '1px solid black',color:item.payload_dip==='Yes'?'red':'green' }}>{item.payload_dip}</th>
            </tr>
        ))
    }, [selectCircle, selectNewSiteId, selectOldSiteId, tableData,handleColor])

    const handleClose = () => {
        setOpen(false);
        setTempRawData('');
        // fetchApiData();
    };


    useEffect(() => {
        // const intervalId = setInterval(() => {
        //     setHandleColor(prev => !prev)
        // }, 500);
        // Cleanup function to clear interval when component unmounts
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        fetchApiData();
 
        // return () => clearInterval(intervalId);

    }, [])

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/Integration') }}>IX Tracker Tool</Link>
                    <Typography color='text.primary'>Relocation Dashboard</Typography>
                </Breadcrumbs>
                <div style={{ float: 'right', display: 'flex', alignItems: 'center',gap:'10px' }}>
                    <span ><CircleIcon style={{ color: '#FFD95F' }} size='small'/> </span>
                    <span style={{fontWeight:'bold',color:'black',fontSize:16}}>Deviation Status (Allocated Vs Deployed)</span>
                    <span ><CircleIcon style={{ color: '#ffcccc' }} size='small'/> </span>
                    <span style={{fontWeight:'bold',color:'black',fontSize:16}}>Old vs New Site Locked-Unlocked Date</span>
                    <IconButton color='primary' onClick={handleExport} title='Export in csv'>
                        <DownloadIcon />
                    </IconButton>
                </div>

                <div >
                    <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} >
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Circle <CheckPicker data={circleData.map(item => ({ label: item, value: item }))} value={selectCircle} onChange={(value) => { setSelectCircle(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /> </th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>Old Site Id <CheckPicker data={oldSiteId.map(item => ({ label: item, value: item }))} value={selectOldSiteId} onChange={(value) => { setSelectOldSiteId(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /></th>
                                    <th style={{ padding: '1px 70px 1px 1px', whiteSpace: 'nowrap' }}>New Site Id <CheckPicker data={newSiteId.map(item => ({ label: item, value: item }))} value={selectNewSiteId} onChange={(value) => { setSelectNewSiteId(value) }} size="sm" appearance="default" placeholder="" style={{ width: 10 }} /></th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Integration Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Allocated Technology(As Per DP)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deployed Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviation Status (Allocated Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviated Tech. (Allocated Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviation Status (Old Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviated Tech. (Old Vs Deployed)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Locked-Unlocked Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Locked-Unlocked Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Traffic Fixed</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Latest Traffic</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Latest Traffic</th>
                                    {/* <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Admin Status (RNA)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Admin Status (RNA)</th> */}
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Unlocked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Locked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Pre &lt;3 Mbps</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Current &lt;3Mbps</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Payload Dip</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {tableData?.map((item,index) => (
                                    <tr  style={{ textAlign: "center",border:'1px solid black', fontWeigth: 700 }}>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{index+1}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.circle}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_id}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.new_site_id}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.integration_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.ms1_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_technology}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.allocated_technology}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.deployed_technology}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.allocated_vs_deployed_tech_deviation}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.allocated_vs_deployed_tech}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_vs_deployed_tech_deviation}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_vs_deployed_tech}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }} onClick={()=>{handleRowClick({id:item.id,value:'old'})}}>{item.old_site_locked_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }} onClick={()=>{handleRowClick({id:item.id,value:'new'})}}>{item.new_site_unlock_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_traffic_fixed}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_traffic_variable}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.existing_traffic}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.both_site_unlocked}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.both_site_locked}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.pre_less_than_3_mbps}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.current_less_than_3_mbps}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.payload_dip}</th>

                                    </tr>
                                ))} */}

                                {FilterTableData()}

                            </tbody>
                        </table>
                    </TableContainer>
                </div>
            </div>
            {open && <SiteLockUnlockForm data={tempRawData} open={open} handleClose={handleClose} updateTableData={fetchApiData}/>}
            {loading}
        </>
    )
}

export default Relocation