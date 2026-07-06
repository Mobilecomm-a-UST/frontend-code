import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

import { MemoSCFT_Aging_Graph } from './SCFT_Aging_Graph'
import { MemoSCFT_Aging_Graph2 } from './SCFT_Aging_Graph2';

const SCFT_Aging_Main_Graph = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
     <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/performance_at_tat') }}>Performace AT</Link>
                        <Typography color='text.primary'>SCFT Aging Main Graph</Typography>
                    </Breadcrumbs>
                </div>
    
        <Box>
            <MemoSCFT_Aging_Graph />
        </Box>
            <Box>
            <MemoSCFT_Aging_Graph2 />
        </Box>

    </>

    )
}

export default SCFT_Aging_Main_Graph