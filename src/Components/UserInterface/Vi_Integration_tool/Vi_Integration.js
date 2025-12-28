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
import { getDecreyptedData } from '../../utils/localstorage'

const Integration_Tool = lazy(() => import('./Vi_Integration_Tool'))
const UploadFile = lazy(() => import('./Upload/UploadFile'))
const FinalDashboard = lazy(() => import('./Dashboard/FinalDashboard'))
const ComanDashboard = lazy(() => import('./Dashboard/ComanDashboard'))
const MDashboard = lazy(() => import('./MasterDashboard/MDashboard'))
const TotalDataDashboard = lazy(() => import('./Dashboard/TotalDataDashboard'));




const Vi_Integration = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    // onClick={() => navigate('/tools/Integration/relocation')} 
    return (
        <>

            <Box style={{ marginTop: '60px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box style={{ position: 'fixed', width: '16.5%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>VI Tracker Tool</Nav>
                                        {/* <Nav.Men eventKey="1" placement="rightStart" icon={<DashboardIcon />} title="Dashboard">
                                         <Nav.Item>dfdf</Nav.Item>
                                        </Nav.Men > */}
                                        <Nav.Item eventKey="1" placement="rightStart" icon={<AppSelectIcon />} onClick={() => navigate('/tools/ix_tools/vi_integration/master_dashboard')}>
                                            Master Dashboard
                                        </Nav.Item>
                                        <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/ix_tools/vi_integration/dashboard')}>
                                            Dashboard
                                        </Nav.Item>
                                        {!userTypes?.includes('VI_IX_reader') &&    <Nav.Item eventKey="3" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/ix_tools/vi_integration/upload_file')} >
                                            Upload File
                                        </Nav.Item>}      
                                     
                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<Integration_Tool />} path="/" />
                                {!userTypes?.includes('VI_IX_reader') && <Route element={<UploadFile />} path="/upload_file" />}
                                <Route element={<FinalDashboard />} path="/dashboard/*" />
                                <Route element={<TotalDataDashboard />} path="/dashboard/total_count/:name" />
                                <Route element={<ComanDashboard />} path="/dashboard/:name" />
                                <Route element={<MDashboard />} path="/master_dashboard" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Vi_Integration