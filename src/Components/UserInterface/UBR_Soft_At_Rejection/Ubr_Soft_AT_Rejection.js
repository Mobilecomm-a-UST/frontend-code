
// import Home from '../Home'
import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SoftAtTool from './SoftAtTool'
import ViewsUnauthorizeIcon from '@rsuite/icons/ViewsUnauthorize';
const Rejected_Report = lazy(() => import('../Soft_AT_Rejection/Rejected/RejectedReport'))
const OEM = lazy(() => import('../Soft_AT_Rejection/Dashboard/OEM'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const OemHuawia = lazy(() => import('./Dashboard/OEM/OemHuawia'));
const OemNokia = lazy(() => import('./Dashboard/OEM/OemNokia'));
const OemSamsung = lazy(() => import('./Dashboard/OEM/OemSamsung'));
const SiteIdHuawia = lazy(() => import('./Dashboard/SITE_ID/SiteIdHuawia'));
const SiteIdSamsung = lazy(() => import('./Dashboard/SITE_ID/SiteIdSamsung'));
const SiteIdNokia = lazy(() => import('./Dashboard/SITE_ID/SiteIdNokia'));
const M_Dashboard = lazy(() => import('./Dashboard/Master_Dash/Master_Dashbord'));
const M_OemCambium = lazy(() => import('./Dashboard/Master_Dash/OEM/OemCambium'));
const M_OemRedwin = lazy(() => import('./Dashboard/Master_Dash/OEM/OemRedwin'));
const M_OemSamsung = lazy(() => import('./Dashboard/Master_Dash/OEM/OemSamsung'));
const M_OemEriccson = lazy(() => import('./Dashboard/Master_Dash/OEM/OemEriccson'));
const M_OemZTE = lazy(() => import('./Dashboard/Master_Dash/OEM/OemZTE'));
const DateWise = lazy(() => import('./Dashboard/Date_Wise/DateWise'))
const RangeWise = lazy(() => import('./Dashboard/Range_Wise/RangeWise'))


function Ubr_Soft_at_Rejection() {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
    const [scrollTop, setScrollTop] = useState(0);

    const navigate = useNavigate()



    const show = () => {
        setChecked(!checked)
        if (checked === true) {
            setMenuButton(false)
        }
    }

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <head>
                <title style={{ color: 'green' }}>
                    {window.location.pathname.slice(7).replaceAll('_', ' ')}
                </title>
            </head>
            {/* <Box style={{ position: 'static' }}><Home /></Box> */}
            <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>UBR Soft AT Tracker</Nav>
                                                <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>

                                                    <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/dashboard'); show(); setMenuButton(true) }} >
                                                        Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-2" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/master_dashboard'); show(); setMenuButton(true) }} >
                                                        Master Dashboard
                                                    </Nav.Item>
                                                    {/* <Nav.Item eventKey="1-2" onClick={() => { navigate('/tools/soft_at_rejection/site_wise_rej_acc'); show(); setMenuButton(true) }}>
                                                        Site Wise Rej. Acc.
                                                    </Nav.Item> */}
                                                    <Nav.Item eventKey="1-4" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/date_wise'); show(); setMenuButton(true) }}>
                                                        Date Wise
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-5" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/range_wise'); show(); setMenuButton(true) }}>
                                                        Range Wise
                                                    </Nav.Item>
                                                </Nav.Menu>
                                                {/* <Nav.Item eventKey="2" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/others/UBR_soft_at_Rejection/rejected_report'); show(); setMenuButton(true) }}>
                                                    Rejected Report
                                                </Nav.Item> */}
                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box>
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed',width:'16%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>UBR Soft AT Tracker</Nav>
                                            <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>

                                                <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/dashboard'); show(); setMenuButton(true) }} >
                                                    Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-2" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/master_dashboard'); show(); setMenuButton(true) }} >
                                                    Master Dashboard
                                                </Nav.Item>
                                                {/* <Nav.Item eventKey="1-3" onClick={() => { navigate('/tools/soft_at_rejection/site_wise_rej_acc'); show(); setMenuButton(true) }}>
                                                    Site Wise Rej. Acc.
                                                </Nav.Item> */}
                                                <Nav.Item eventKey="1-4" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/date_wise'); show(); setMenuButton(true) }}>
                                                    Date Wise
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-5" onClick={() => { navigate('/tools/UBR_soft_at_Tracker/range_wise'); show(); setMenuButton(true) }}>
                                                    Range Wise
                                                </Nav.Item>
                                            </Nav.Menu>


                                            {/* <Nav.Item eventKey="2" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/UBR_soft_at_Rejection/rejected_report'); show(); setMenuButton(true) }}>
                                                Rejected Report
                                            </Nav.Item> */}
                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<SoftAtTool />} path="/" />
                                <Route element={<Rejected_Report />} path='/rejected_report' />
                                <Route element={<OEM />} path='/site_wise_rej_acc/*' />
                                <Route element={<Dashboard />} path="/dashboard" />
                                <Route element={<OemHuawia />} path="/site_wise_rej_acc/Huawei/*" />
                                <Route element={<OemNokia />} path="/site_wise_rej_acc/Nokia/*" />
                                <Route element={<OemSamsung />} path="/site_wise_rej_acc/Samsung/*" />
                                <Route element={<SiteIdHuawia />} path="/site_wise_rej_acc/Huawei/site_id_2G" />
                                <Route element={<SiteIdSamsung />} path="/site_wise_rej_acc/Samsung/site_id_2G" />
                                <Route element={<SiteIdNokia />} path="/site_wise_rej_acc/Nokia/site_id_2G" />
                                <Route element={<M_Dashboard />} path="/master_dashboard/*" />
                                <Route element={<M_OemCambium />} path="/master_dashboard/CAMBIUM" />
                                <Route element={<M_OemRedwin />} path="/master_dashboard/RADWIN" />
                                <Route element={<M_OemSamsung />} path="/master_dashboard/Samsung" />
                                <Route element={<M_OemEriccson />} path="/master_dashboard/Ericsson" />
                                <Route element={<M_OemZTE />} path="/master_dashboard/ZTE" />
                                <Route element={<DateWise />} path="/date_wise" />
                                <Route element={<RangeWise />} path="/range_wise" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Ubr_Soft_at_Rejection;