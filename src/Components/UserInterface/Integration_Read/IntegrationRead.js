import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ConversionIcon from '@rsuite/icons/Conversion';

const Integration_Tool = lazy(() => import('./Integration_Tool'))
const FinalDashboard = lazy(() => import('./Dashboard/FinalDashboard'))
const ComanDashboard = lazy(() => import('./Dashboard/ComanDashboard'))
const MDashboard = lazy(() => import('./MasterDashboard/MDashboard'))
const Relocation = lazy(()=>import('./Relocation/Relocation'))
// const RelocationUpload = lazy(()=>import('./Relocation/RelocationUpload'))


const IntegrationRead = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])
    return (
        <>

            <Box style={{ marginTop: '60px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <div style={{ position: 'fixed', width: '16.5%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>IX Tracker Tool</Nav>
                                        {/* <Nav.Men eventKey="1" placement="rightStart" icon={<DashboardIcon />} title="Dashboard">
                                         <Nav.Item>dfdf</Nav.Item>
                                        </Nav.Men > */}
                                        <Nav.Item eventKey="1" placement="rightStart" icon={<AppSelectIcon />} onClick={() => navigate('/tools/IX_Tracker/master_dashboard')}>
                                            Master Dashboard
                                        </Nav.Item>
                                        <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/IX_Tracker/dashboard')}>
                                            Dashboard
                                        </Nav.Item>
                                        <Nav.Menu eventKey="4" placement="rightStart" icon={<ConversionIcon />} title="Relocation" > 
                                            <Nav.Item eventKey="4-1" placement="rightStart" onClick={() => navigate('/tools/IX_Tracker/relocation_dashboard')}>
                                                Dashboard  
                                            </Nav.Item>
                                        
                                        </Nav.Menu>
                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<Integration_Tool />} path="/" />
                                <Route element={<FinalDashboard />} path="/dashboard/*" />
                                <Route element={<ComanDashboard />} path="/dashboard/:name" />
                                <Route element={<MDashboard />} path="/master_dashboard" />
                                <Route element={<Relocation />} path="/relocation_dashboard" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default IntegrationRead