

import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import FunnelTrendIcon from '@rsuite/icons/FunnelTrend';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from '../../../App.css'
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import { getDecreyptedData } from '../../../Components/utils/localstorage';

const PTtool = lazy(() => import('./PTtool'))
const UploadFile = lazy(() => import('./UploadFile/Upload'))
const DashboardTable = lazy(() => import('./Dashboard/DashboardTable'))
const MainAging = lazy(() => import('./Aging/MainAging'))
const MainDashboard = lazy(() => import('./Analytics/MainDashboard'))



const PTracking = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    //  const classes = useStyles();

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
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Relocation Tracking</Nav>
                                                <Nav.Item eventKey="1" placement="rightStart" icon={<DashboardIcon />} onClick={() => { navigate('/tools/project_tracking/'); show(); setMenuButton(true) }}>
                                                    Dashboard
                                                </Nav.Item>
                                                {/* <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                    <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                        Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                        Pre-Post Audit
                                                    </Nav.Item>
                                                </Nav.Menu> */}


                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box>
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={['1']} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Relocation Tracking</Nav>

                                            {/* RFAI To MS1 */}
                                            <Nav.Menu eventKey="1" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="RFAI To MS1" icon={<ArrowRightIcon />}  >
                                                <Nav.Item eventKey="1-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/analytics'); show(); setMenuButton(true) }}>
                                                    Analytics Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/waterfall'); show(); setMenuButton(true) }}>
                                                    Waterfall Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="3-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ageing'); show(); setMenuButton(true) }}>
                                                    Ageing Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="4-3" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/upload_file'); show(); setMenuButton(true) }}>
                                                    Upload File
                                                </Nav.Item>

                                            </Nav.Menu>

                                            {/* RAFI to MS2 */}
                                            <Nav.Menu eventKey="2" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="MS1 To MS2" icon={<ArrowRightIcon />}  >
                                                <Nav.Item eventKey="2-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/'); show(); setMenuButton(true) }}>
                                                    Waterfall Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/'); show(); setMenuButton(true) }}>
                                                    Ageing Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-3" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/'); show(); setMenuButton(true) }}>
                                                    Upload File
                                                </Nav.Item>
                                            </Nav.Menu>


                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<PTtool />} path="/" />

                                <Route element={<UploadFile />} path="/upload_file" />
                                <Route element={<DashboardTable />} path="/waterfall" />
                                <Route element={<MainAging />} path="/ageing" />
                                <Route element={<MainDashboard />} path="/analytics" />



                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default PTracking