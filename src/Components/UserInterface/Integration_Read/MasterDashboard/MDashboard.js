import React from 'react'
import OemBar from './OemBar';
import { Box } from '@mui/material';
import ActivityBar from './ActivityBar';

const MDashboard = () => {
    return (
        <>
            <Box sx={{ margin:2}}>
                <ActivityBar />
                <br/>
                <OemBar/>
            </Box>
        </>

    )
}

export default MDashboard;