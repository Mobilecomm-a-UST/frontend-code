import React from 'react'
import { Box } from '@mui/material';
import CountOkNotOK from './CountOkNotOK'
import KPICount from './KPICount';

const MDashboard = () => {

    return (
        <>
            <Box sx={{ margin: 1 }}>
                <CountOkNotOK />
                <br />
                {/* <KPICount /> */}
            </Box>
        </>
    )
}

export default MDashboard