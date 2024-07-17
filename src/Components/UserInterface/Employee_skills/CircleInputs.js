
import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import Sidenav from 'rsuite/Sidenav'
import Nav from 'rsuite/Nav'
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SentToUserIcon from '@rsuite/icons/SentToUser';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import EventDetailIcon from '@rsuite/icons/EventDetail';
const EmployeeTool = lazy(() => import('./EmployeeTool'))
const Dashboard = lazy(() => import('./Dashboard/Dashboard'))
const Upload = lazy(() => import("./UploadReport/UploadReport"))
const MdpUpload = lazy(() => import("./MDP/UploadMdp"))
const MDashboard = lazy(() => import("./MasterDashboard/MDashboard"))

const panelStyles = {
    padding: '15px 20px',
    color: '#aaa'
};

const headerStyles = {
    padding: 20,
    fontSize: 16,
    background: '#34c3ff',
    color: ' #fff'
};



const CircleInputs = () => {
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
                <Grid container spacing={0}>
                    <Grid item md={2} >
                        <div style={{ position: 'fixed', width: '16.5%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance='subtle' style={{ minHeight: "670px", height: "100hv", marginTop: 8, borderRadius: 10, backgroundColor: "rgb(255 255 255 / 55%)", borderRight: '2px solid black', borderTop: '2px solid black' }}>
                                <Sidenav.Body >
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19, color: 'black' }}>Circle Inputs</Nav>


                                        <Nav.Menu eventKey='1' placement="rightStart" icon={<SentToUserIcon />} title='Resource Sheet' >
                                            {/* <Nav.Item eventKey="1-1" onClick={() => navigate('/tools/circle_inputs/master_dashboard')} >
                                                Master Dashboard
                                            </Nav.Item> */}
                                            <Nav.Item eventKey="1-2" onClick={() => navigate('/tools/circle_inputs/dashboard')} >
                                                Dashboard
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-3" onClick={() => navigate('/tools/circle_inputs/upload_report')} >
                                                Upload Report
                                            </Nav.Item>
                                        </Nav.Menu>


                                        <Nav.Menu eventKey='2' placement="rightStart" icon={<EventDetailIcon />} title='MDP'>
                                            <Nav.Item eventKey="2-1" onClick={() => navigate('/tools/circle_inputs/mdp_upload')} >
                                                Upload Report
                                            </Nav.Item>
                                        </Nav.Menu>



                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </div>
                        {/* <div style={{ width: 240, position: 'fixed' }}>
                            <Sidenav defaultOpenKeys={['3', '4']}>
                                <Sidenav.Header>
                                    <div style={headerStyles}>Custom Sidenav</div>
                                </Sidenav.Header>
                                <Sidenav.Body>
                                    <Nav>
                                        <Nav.Item eventKey="1" active icon={<DashboardIcon />}>
                                            Dashboard
                                        </Nav.Item>
                                        <Nav.Item eventKey="2" icon={<DashboardIcon />}>
                                            User Group
                                        </Nav.Item>
                                        <Nav.Menu eventKey="3" title="Advanced" icon={<FileUploadIcon />}>
                                            <Nav.Item divider />
                                            <Nav.Item panel style={panelStyles}>
                                                Reports
                                            </Nav.Item>
                                            <Nav.Item eventKey="3-1">Geo</Nav.Item>
                                            <Nav.Item eventKey="3-2">Devices</Nav.Item>
                                            <Nav.Item eventKey="3-3">Loyalty</Nav.Item>
                                            <Nav.Item eventKey="3-4">Visit Depth</Nav.Item>
                                            <Nav.Item divider />
                                            <Nav.Item panel style={panelStyles}>
                                                Settings
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-1">Applications</Nav.Item>
                                            <Nav.Item eventKey="4-2">Channels</Nav.Item>
                                            <Nav.Item eventKey="4-3">Versions</Nav.Item>
                                            <Nav.Menu eventKey="4-5" title="Custom Action">
                                                <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                                                <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
                                            </Nav.Menu>
                                        </Nav.Menu>
                                    </Nav>
                                </Sidenav.Body>
                            </Sidenav>
                        </div> */}
                    </Grid>
                    <Grid item md={10}>

                        <Suspense fallback={<div>loading............</div>}>

                            <Routes>
                                <Route element={<EmployeeTool />} path="/" />
                                <Route element={<Dashboard />} path="/dashboard" />
                                <Route element={<Upload />} path="/upload_report" />
                                <Route element={<MdpUpload />} path="/mdp_upload" />
                                <Route element={<MDashboard />} path="/master_dashboard" />

                            </Routes>

                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default CircleInputs