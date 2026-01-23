import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import MOS from './MOS';
import RfaiIntegration from './RfaiIntegration';
import MOS2 from './MOS2';

const MainAging = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ntd') }}>New Tower Deployment</Link>
                    <Typography color='text.primary'>Aging</Typography>
                </Breadcrumbs>
            </div>
            <Box>
                <RfaiIntegration />
            </Box>
            <Box>
                <MOS />
            </Box>
            {/* <Box>
                <MOS2/>
            </Box> */}
            {/* <Box>
                <Integration />
            </Box>
            <Box>
                <Ms1 />
            </Box> */}

        </>

    )
}

export default MainAging