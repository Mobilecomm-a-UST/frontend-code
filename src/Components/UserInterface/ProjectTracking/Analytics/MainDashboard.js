import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import * as ExcelJS from 'exceljs'
import { useGet } from '../../../Hooks/GetApis';
import { usePost } from '../../../Hooks/PostApis';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';
import MonthWise from './MonthWise';


const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']
const MainDashboard = () => {
    const navigate = useNavigate()



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
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>Analytics Dashboard</Typography>
                </Breadcrumbs>
            </div>
            <Box>
                <MonthWise />
            </Box>


        </>
    )
}

export default MainDashboard