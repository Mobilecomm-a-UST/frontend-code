import React, { useEffect } from 'react'
import { Breadcrumbs, Button, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TextField from '@mui/material/TextField';
import ShowMilestone from './ShowMilestone';


const LifeCycle = () => {
    const navigate = useNavigate()



    const handleSubmitSite = async () => {

    }


    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>Site Lifecycle</Typography>
                </Breadcrumbs>
            </div>
            <div style={{ height: 'auto', width: '99%', margin: '5px 5px', padding: '2px', border: '1px solid black', borderRadius: '10px', padding: '2px', display: 'flex' }}>
                <Grid container spacing={1}>
                    <Grid item xs={10} style={{ display: "flex" }}>
                        <Box >
                            <form onSubmit={handleSubmitSite} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                                <TextField size='small' placeholder='Enter Site ID' />
                                <Button variant='contained'>search site</Button>
                            </form>
                        </Box>

                    </Grid>
                    <Grid item xs={2} >
                        {/* <Box style={{ float: 'right' }}>
                            <Tooltip title="Export Dashboard">
                                <IconButton onClick={() => { handleExport(); }}>
                                    <DownloadIcon fontSize='medium' color='primary' />
                                </IconButton>
                            </Tooltip>
                        </Box> */}
                    </Grid>
                </Grid>

            </div>
            <Box>
                <Grid container spacing={1} sx={{width:'99%', margin: '5px 5px'}}>
                    <Grid item xs={4} sx={{}}>
                        <Box sx={{maxHeight:600,minBlockSize:500,overflow:'auto',padding:5,border:'1px solid black',borderRadius:5}}>
                                    <ShowMilestone />
                        </Box>
                    </Grid>
                    <Grid item xs={8} >
                        <Box sx={{maxHeight:600,minBlockSize:500,overflow:'auto',padding:5,border:'1px solid black',borderRadius:5}}>
                                    {/* <ShowMilestone /> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default LifeCycle