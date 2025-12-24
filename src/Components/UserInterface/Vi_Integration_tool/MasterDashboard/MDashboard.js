import React from 'react'
import OemBar from './OemBar';
import { Box } from '@mui/material';
import ActivityBar from './ActivityBar';
import UnicCount from './UnicCount';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const MDashboard = () => {
      const navigate = useNavigate();
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ix_tools') }}>IX Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/ix_tools/vi_integration') }}>VI Tracker</Link>
                    <Typography color='text.primary'>Dashboard</Typography>
                </Breadcrumbs>
            </div>
            <Box sx={{ margin: 2 }}>
                <ActivityBar />
                <br />
                <OemBar />
                <br />
                <UnicCount />
            </Box>
        </>

    )
}

export default MDashboard;