import React from 'react'
import { useState, useEffect,lazy , Suspense } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploadIcon from '@rsuite/icons/FileUpload';
import PushMessageIcon from '@rsuite/icons/PushMessage';
const CatsTrackerTool = lazy(() => import('./CatsTrackerTool'))
const Upload = lazy(() => import('./Upload Data/Upload'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const CatsForm = lazy(() => import('./CATS Form/CatsForm'))





const CatsTracker = () => {
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
                        <div style={{ position: 'fixed' , width: '16%'}}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>CATS Tracker Tool</Nav>
                                        <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/cats_tracker/dashboard')} >
                                            Dashboard
                                        </Nav.Item>

                                        <Nav.Item eventKey="1" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/cats_tracker/upload_data')} >
                                            Upload Data
                                        </Nav.Item>

                                        <Nav.Item eventKey="3" placement="rightStart" icon={<PushMessageIcon />} onClick={() => navigate('/tools/cats_tracker/cats_form')} >
                                            CATS Form
                                        </Nav.Item>

                                    </Nav>
                                </Sidenav.Body>
                            </Sidenav>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={10}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route element={<CatsTrackerTool />} path="/" />
                            <Route element={<Upload />} path="/upload_data" />
                            <Route element={<Dashboard/>} path='/dashboard' />
                            <Route element={<CatsForm/>} path='/cats_form' />
                            {/* <Route element={<Upload />} path="/upload_data" /> */}
                        </Routes>
                    </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CatsTracker