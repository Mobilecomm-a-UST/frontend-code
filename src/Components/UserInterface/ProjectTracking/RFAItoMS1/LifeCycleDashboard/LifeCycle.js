import React, { useEffect, useState } from 'react'
import { Breadcrumbs, Button, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TextField from '@mui/material/TextField';
import ShowMilestone from './ShowMilestone';
import { getDecreyptedData } from "../../../../utils/localstorage";
import { ServerURL } from '../../../../services/FetchNodeServices';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import axios from 'axios';
import Swal from "sweetalert2";

const LifeCycle = () => {
    const navigate = useNavigate()
    const userID = getDecreyptedData("userID")
    const [siteId, setSiteId] = useState('')
    const [milestoneData,setMilestoneData] = useState()
    const { actions, loading } = useLoadingDialog();


    const handleSubmitSite = async (e) => {
        e.preventDefault()
        try {

            const formData = new FormData();
            formData.append('siteId', siteId);
            formData.append('userId', userID);
            const response = await axios.post
                (`${ServerURL}/alok_tracker/lifecycle_display/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });
            const response2 = await axios.post
                (`${ServerURL}/alok_tracker/issue_timeline_display/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });


            if (response.status) {
                console.log('site id responce ', response)
                setMilestoneData(JSON.parse(response?.data?.json_data))
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `This Site-ID Found in database`,
                });
                // navigate('/tools/relocation_tracking/rfai_to_ms1_waterfall/')
            }
            // console.log('update response', response);


        } catch (error) {
            console.log('aaaaa', error)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }
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
                                <TextField size='small' placeholder='Enter Site ID' value={siteId} onChange={(e) => setSiteId(e.target.value)} />
                                <Button type='submit' variant='contained'>search site</Button>
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
                <Grid container spacing={1} sx={{ width: '99%', margin: '5px 5px' }}>
                    <Grid item xs={3} sx={{}}>
                        <Box sx={{ maxHeight: '77vh', minBlockSize: '77vh', overflow: 'auto', padding: 2, border: '1px solid black', borderRadius: 5 }}>
                            <ShowMilestone mileston={milestoneData} />
                        </Box>
                    </Grid>
                    <Grid item xs={9} >
                        <Box sx={{ maxHeight: '77vh', minBlockSize: '77vh', overflow: 'auto', padding: 5, border: '1px solid black', borderRadius: 5 }}>
                            {/* <ShowMilestone /> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {loading}
        </>
    )
}

export default LifeCycle