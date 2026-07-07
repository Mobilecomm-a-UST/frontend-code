import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

import { MemoPerformance_SR_Wise } from './Performance_SR_Wise'
import { MemoPerformance_SR_Wise2 } from './Performance_SR_Wise2';
import Performance_SR_Wise from './Performance_SR_Wise';

const Performance_SR_Wise_Main = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
     <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/performance_at_tat') }}>Performace AT</Link>
                        <Typography color='text.primary'>Performance SR wise</Typography>
                    </Breadcrumbs>
                </div>
    
        <Box>
            <MemoPerformance_SR_Wise />
        </Box>
            <Box>
            <MemoPerformance_SR_Wise2 />
        </Box>

    </>

    )
}

export default Performance_SR_Wise_Main