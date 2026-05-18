import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'
import { useGet } from '../../../../Hooks/GetApis';
import { usePost } from '../../../../Hooks/PostApis';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import MonthWise from './MonthWise';
// import IntegrationTableOnAir from './IntegrationTableOnAir';
import CircleWiese from './CircleWiese';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { postData } from '../../../../services/FetchNodeServices';


const colorType = [ '#A0DEFF', '#FF9F66','#ECB176', '#B0EBB4', '#CDE8E5']
const requiredMilestones = [ 'Site ONAIR','I-Deploy ONAIR','SCFT Accepted','KPI AT Accepted', 'Final MS2'];
const MainDashboard = () => {
    const navigate = useNavigate()
    const { loading, action } = useLoadingDialog();
    const [dateArray, setDateArray] = useState([])
    const [tableData, setTableData] = useState([])


    console.log('table data', tableData)
    const ChangeDateFormate = (date) => {
        if (!date) return '';

        const d = new Date(date);
        if (isNaN(d)) return 'Invalid Date';

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('circle', '')
        formData.append('site_tagging', '')
        formData.append('relocation_method', '')
        formData.append('new_toco_name', '')
        formData.append('from_date', ChangeDateFormate(new Date()))
        formData.append('to_date', ChangeDateFormate(new Date(Date.now() + 86400000)))
        formData.append('view', 'Cumulative')
        const res = await postData("nt_tracker/ms2_daily_dashboard/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('box wise data ', res)
        if (res) {
            action(false)
            setDateArray(res.dates)
            setTableData(JSON.parse(res.data).filter(item =>
                requiredMilestones.includes(item["Milestone Track/Site Count"])
            ));
        }
        else {
            action(false)
        }

    }


    const Dashboard = useCallback(({ data, color }) => {
        // console.log('check data' , data)
        function convertDate(dateStr) {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return (
            <Box sx={{ height: 'auto', width: '28vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, textAlign: 'center' }}
                // onClick={() => { HandleDashboard(data.OEM) }}
                title={data.OEM}
            >
                <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>{data.OEM}</Box>
                <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={data.record_count} duration={4} /> </Box>
                <Box sx={{ color: "black", textAlign: 'left' }}><span style={{ fontWeight: 600, fontSize: '14px' }}>From-</span>{convertDate(data.from_integration_date)}</Box>
                <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box>
            </Box>
        );
    }, []);


    useEffect(() => {
        fetchDailyData()
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ntd') }}>New Tower Deployment</Link>
                    <Typography color='text.primary'>MS1 to MS2 Analytics</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: "wrap", flexDirection: 'row', gap: 1, marginBottom: 2 }}>
                {tableData.length > 0 && tableData.map((item, index) => (
                    <Box sx={{ height: 'auto', width: '30vh', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: `${colorType[index]}`, textAlign: 'center' }} key={index}
                        // onClick={() => { HandleDashboard(data.OEM) }}
                        title={item?.['Milestone Track/Site Count']}
                    >
                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>{item?.['Milestone Track/Site Count']}</Box>
                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={item.date_1} duration={6} /></Box>
                        <Box sx={{ color: "black", textAlign: 'left' }}>{dateArray[0]}</Box>
                        {/* // <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box> */}
                    </Box>
                ))}

            </Box>
            <Box>
                <MonthWise />
            </Box>
            <Box>
                <CircleWiese />
            </Box>
            {/* <Box>
                <RfaiIntegration />
            </Box> */}
            {/* <Box>
                <IntegrationTableOnAir />
            </Box> */}


        </>
    )
}

export default MainDashboard