import React, { useEffect } from 'react'
import { MDateWise } from './DateWise'
import { Box } from '@mui/material'
import { MemoMonthWise } from './MonthWise'
import { MemoWeekWise } from './WeekWise'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

const DashboardTable = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
     <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                        <Typography color='text.primary'>Dashboard</Typography>
                    </Breadcrumbs>
                </div>
        <Box>
            <MDateWise />
        </Box>
        <Box>
            <MemoWeekWise />
        </Box>
        <Box>
            <MemoMonthWise />
        </Box>

    </>

    )
}

export default DashboardTable