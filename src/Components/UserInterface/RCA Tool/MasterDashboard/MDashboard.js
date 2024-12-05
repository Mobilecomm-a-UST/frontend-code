import React, { useEffect } from 'react'
import { Box } from '@mui/material';
import CountOkNotOK from './CountOkNotOK'
import KPICount from './KPICount';

const MDashboard = () => {



    useEffect(()=>{
            document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    },[])

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