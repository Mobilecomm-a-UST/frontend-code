import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

import { MemoDashboard } from './Dashboard'
import { MemoDatewise } from './Datewise';
import SCFT_Aging from './Pending_Aging'

const MasterDashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
        <div style={{ margin: 5, marginLeft: 10 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                <Link underline="hover" onClick={() => { navigate('/tools/performance_at_tat') }}>Performace At</Link>
                <Typography color='text.primary'>Pending Aging</Typography>
            </Breadcrumbs>
        </div>

        <Box>
            <SCFT_Aging />
        </Box>

        <Box>
            {/* <MemoDashboard /> */}
        </Box>
        <Box>
            {/* <MemoDatewise /> */}
        </Box>

    </>

    )
}

export default MasterDashboard