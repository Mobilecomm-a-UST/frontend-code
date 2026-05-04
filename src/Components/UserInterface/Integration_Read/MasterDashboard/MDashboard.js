import React from 'react'
import  { MemoOemBar } from './OemBar';
import { Box } from '@mui/material';
import { MemoActivityBar } from './ActivityBar';
import { MemoUnicCount } from './UnicCount';

const MDashboard = () => {
    return (
        <>
            <Box sx={{ margin:2}}>
                <MemoActivityBar />
                <br/>
                <MemoOemBar/>
                <br/>
                <MemoUnicCount/>
            </Box>
        </>

    )
}

export default MDashboard;