import React from 'react'
import { useEffect, useRef, useState } from 'react'
import Tilt from 'react-parallax-tilt';
import Grow from '@mui/material/Grow';
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

const Relocation = () => {
    const navigate = useNavigate();
    const {loading,action} = useLoadingDialog();
    const {classes}  = useStyles();
    const scrollableContainerRef = useRef(null);
    const [tableData , setTableData] = useState([]);
    const [scrollNo, setScrollNo] = useState(50)


    const fetchApiData = async () => {
        // const formData = new FormData()
        action(true)
        let responce = await getData('IntegrationTracker/relocation/tracker/');
        if(responce){
            action(false)
            console.log('responce  data' , responce)
            setTableData(responce)

        }else{
            action(false)

        }


    }

    const columnData = [
        { title: 'S.No', field: 'index' },
        { title: 'Circle', field: 'circle' },
        { title: 'Old Site ID', field: 'old_site_id' },
        { title: 'New Site ID', field: 'new_site_id' },
        { title: 'Integration Date', field: 'integration_date' },
        { title: 'MS1 Date', field: 'ms1_date' },
        { title: 'Old Site Technology', field: 'old_site_technology' },
        { title: 'Allocated Technology (as per DP)', field: 'allocated_technology' },
        { title: 'Deployed Technology', field: 'deployed_technology' },
        { title: 'Deviation', field: 'deviation' },
        { title: 'Deviated Tech.', field: 'no_of_deviated_tech' },
        { title: 'Old Site Locked Date', field: 'old_site_locked_date' },
        { title: 'New Site Unlock Date', field: 'new_site_unlock_date' },
        { title: 'Old Site Traffic', field: 'old_site_traffic' },
        { title: 'Existing Traffic', field: 'existing_traffic' },
        // { title: 'Old Site Admin Status (RNA)', field: 'old_site_admin_status' },
        // { title: 'New Site Admin Status (RNA)', field: 'new_site_admin_status' },
        { title: 'Both Sites Unlocked', field: 'both_site_unlocked' },
        { title: 'Both Sites Locked', field: 'both_site_locked' },
        { title: 'Pre <3 Mbps', field: 'pre_less_than_3_mbps' },
        { title: 'Current <3 Mbps', field: 'current_less_than_3_mbps' }
    ];
    


    const handleExport=()=>{
        var csvBuilder = new CsvBuilder(`Relocation_Tracker.csv`)
        .setColumns(columnData.map(item => item.title))
        .addRows(tableData.map(row => columnData.map(col => row[col.field])))
        .exportFile();
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
                    <Typography color='text.primary'>Relocation Dashboard</Typography>
                </Breadcrumbs>
                <div style={{float:'right'}}>
                    <IconButton color='primary' onClick={handleExport} title='Export in csv'>
                            <DownloadIcon />
                        </IconButton>
                </div>

                <div >
                    <TableContainer sx={{ maxHeight: '80vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper} ref={scrollableContainerRef} onScroll={handleScroll}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 14, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Sr. No.</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Circle</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Id</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Id</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Integration Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>MS1 Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Allocated Technology(As Per DP)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deployed Technology</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviation</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Deviated Tech.</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Locked Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Unlock Date</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Traffic</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Existing Traffic</th>
                                    {/* <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Old Site Admin Status (RNA)</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>New Site Admin Status (RNA)</th> */}
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Unlocked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Both Site Locked</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Pre &lt;3 Mbps</th>
                                    <th style={{ padding: '1px 10px', whiteSpace: 'nowrap' }}>Current &lt;3Mbps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData?.map((item,index) => (
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
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.deviation}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.no_of_deviated_tech}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_locked_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.new_site_unlock_date}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_traffic}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.existing_traffic}</th>
                                        {/* <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.old_site_admin_status}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.new_site_admin_status}</th> */}
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.both_site_unlocked}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.both_site_locked}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.pre_less_than_3_mbps}</th>
                                        <th style={{  whiteSpace: 'nowrap',border:'1px solid black' }}>{item.current_less_than_3_mbps}</th>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </TableContainer>
                </div>
            </div>
            {loading}
        </>
    )
}

export default Relocation