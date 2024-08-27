import React from 'react'
import OemBar from './OemBar';
import { Box } from '@mui/material';
import ActivityBar from './ActivityBar';
import UnicCount from './UnicCount';

const MDashboard = () => {
    return (
        <>
            <Box sx={{ margin:2}}>
                <ActivityBar />
                <br/>
                <OemBar/>
                <br/>
                <UnicCount/>
            </Box>
        </>

    )
}

export default MDashboard;