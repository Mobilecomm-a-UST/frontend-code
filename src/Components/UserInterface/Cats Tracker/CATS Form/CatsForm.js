import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Breadcrumbs, Link, Typography, Grid, TextField, Container, Paper } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import OverAllCss from "../../../csss/OverAllCss";
import { useNavigate } from 'react-router-dom'
import Slide from '@mui/material/Slide';
import { usePost } from "../../../Hooks/PostApis";

const CatsForm = () => {
    const { makePostRequest, cancelRequest } = usePost()

    const [open, setOpen] = useState(false);

    const classes = OverAllCss()
    const navigate = useNavigate()
    // var link = `${ServerURL}${fileData}`;
    const [formData, setFormData] = useState({
        circle: '',
        project: '',
        month: '',
        ms1_done_sites: '',
        module_qty_dispatch_d_as_per_to_a: '',
        module_qty_recived_as_site_as_per_tO: '',
        no_of_sites_gap: '',
        gap_qty_dispatch_vs_recived_c: '',
        module_qty_visible_enm: '',
        gap_cats_vs_emn_module_e: '',
        rmo_srn_qty: '',
        cam_qty : '',
        againts_faulty_qty : '',
        locator_issue_qty : '',
        theft_qty : '',
        mos_pri_qty  : '',
        m1sc : '',
        mgaps_remarks1sc : ''
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };





    useEffect(() => {

        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])


    const handleSubmit = async(e) => {
        e.preventDefault();
        // Add your registration logic here



        const responce = await makePostRequest('MO_BASED_REPORT/monthly_signoff_cats_vs_mobinet/', formData )

        if(responce){
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `${responce?.message}`,
            });
        }


    };


    // DATA PROCESSING DIALOG BOX...............
    const loadingDialog = () => {
        return (
            <Dialog
                open={open}
                keepMounted
            >
                <DialogContent         >
                    <Box style={{ padding: 20, display: 'flex', justifyContent: "center" }}></Box>
                    {/* <Box style={{ textAlign: 'center' }}><GearIcon pulse style={{ fontSize: '100px', color: '#232455' }} /></Box> */}
                    <Box style={{ textAlign: 'center' }}><img src="/assets/cloud-upload.gif" style={{ height: 200 }} /></Box>
                    <Box style={{ margin: '10px 0px 10px 0px', fontWeight: 'bolder' }}>DATA UNDER PROCESSING...</Box>
                    <Button variant="contained" fullWidth style={{ backgroundColor: "red", color: 'white' }} onClick={cancelRequest} endIcon={<DoDisturbIcon />}>cancel</Button>
                </DialogContent>

            </Dialog>
        )
    }





    return (
        <Slide
            direction='left'
            in='true'
            // style={{ transformOrigin: '0 0 0' }}
            timeout={1000}
        >
            <div>
                <div style={{ margin: 10, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/others') }}>Other</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/others/cats_tracker') }}>CATS Tracker</Link>
                        <Typography color='text.primary'>CATS Form</Typography>
                    </Breadcrumbs>
                </div>
                {/* <Box style={{ position: 'fixed', right: 20 }}>
                    <Tooltip title="Help">
                        <Fab color="primary" aria-label="add" onClick={startTour}>
                            <LiveHelpIcon />
                        </Fab>
                    </Tooltip>
                </Box> */}

                <Box className={classes.main_Box}>
                    <Box className={classes.Back_Box}>
                        <Box className={classes.Box_Hading}>
                            Enter Monthly CATS Tracker Report
                        </Box>


                        <Stack spacing={2} sx={{ marginTop: "-40px" }}>

                            <Container component="main" >
                                <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Circle"
                                                    name="circle"
                                                    value={formData.circle}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Project"
                                                    name="project"
                                                    value={formData.project}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Month"
                                                    name="month"
                                                    value={formData.month}
                                                    onChange={handleChange}
                                                    size="small"
                                                    type="month"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="MS1 Done Sites"
                                                    name="ms1_done_sites"
                                                    value={formData.ms1_done_sites}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Module Qty Dispatched as per TO (A) "
                                                    name="module_qty_dispatch_d_as_per_to_a"
                                                    value={formData.module_qty_dispatch_d_as_per_to_a}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Module Qty Received as Site as Per TO (B)"
                                                    name="module_qty_recived_as_site_as_per_tO"
                                                    value={formData.module_qty_recived_as_site_as_per_tO}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="No of sites gap"
                                                    name="no_of_sites_gap"
                                                    value={formData.no_of_sites_gap}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Gap qty dispatch vs recived C"
                                                    name="gap_qty_dispatch_vs_recived_c"
                                                    value={formData.gap_qty_dispatch_vs_recived_c}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Module qty visible ENM"
                                                    name="module_qty_visible_enm"
                                                    value={formData.module_qty_visible_enm}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Gap CATS vs ENM (Module)"
                                                    name="gap_cats_vs_emn_module_e"
                                                    value={formData.gap_cats_vs_emn_module_e}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="RMO/SRN (QTY) "
                                                    name="rmo_srn_qty"
                                                    value={formData.rmo_srn_qty}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="CAM (QTY)"
                                                    name="cam_qty"
                                                    value={formData.cam_qty }
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Against Faulty (QTY)"
                                                    name="againts_faulty_qty"
                                                    value={formData.againts_faulty_qty}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Locator Issue (QTY)"
                                                    name="locator_issue_qty"
                                                    value={formData.locator_issue_qty}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Theft (QTY)"
                                                    name="theft_qty"
                                                    value={formData.theft_qty}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="MOS PRI (QTY)"
                                                    name="mos_pri_qty"
                                                    value={formData.mos_pri_qty }
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label="Misc"
                                                    name="m1sc"
                                                    value={formData.m1sc}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    variant="outlined"
                                                    // required
                                                    fullWidth
                                                    label="Gaps Repmarks"
                                                    name="mgaps_remarks1sc"
                                                    value={formData.mgaps_remarks1sc}
                                                    onChange={handleChange}
                                                    size="small"
                                                />
                                            </Grid>

                                        </Grid>
                                        <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 20 }}>
                                            Submit
                                        </Button>
                                    </form>
                                </Paper>
                            </Container>


                        </Stack>

                    </Box>
                </Box>

                {loadingDialog()}




            </div>
        </Slide>
    )
}

export default CatsForm