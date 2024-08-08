import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
import GearIcon from '@rsuite/icons/Gear';


const Kpi_Data = lazy(() => import('./Kpi_table/Kpi_Data'))
const Rca_tool = lazy(() => import('./Rca_tool'))
const Rca_data = lazy(() => import('./Rca_table/Rca_data'))
const Daily4G_KPI = lazy(()=> import('./Upload_files/Daily4G_KPI'))
const TentativeCounter = lazy(()=> import('./Upload_files/TentativeCounter'))
const AlarmFiles = lazy(()=> import('./Upload_files/AlarmFiles'))
const Generate_rca = lazy(()=> import('./Generate_RCA/Generate_rca'))
const MDashboard = lazy(()=> import('./MasterDashboard/MDashboard'))

const Rca = () => {

    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>

            <Box style={{ marginTop: '60px' }}>

                <Grid container spacing={1}>
                    <Grid item xs={2} >
                        <div style={{ position: 'fixed', width: '16%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 5, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 18 }}>RCA Tool</Nav>

                                        <Nav.Item eventKey="0" placement="rightStart" icon={<DashboardIcon size="3em" />} onClick={() => navigate('/tools/rca/master_dashboard')}>
                                            Master Dashboard
                                        </Nav.Item>

                                        <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                                            <Nav.Item eventKey="1-1" placement="rightStart" onClick={() => navigate('/tools/rca/kpi_table')}>
                                                KPI Table
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-2" placement="rightStart" onClick={() => navigate('/tools/rca/rca_table')}>
                                                RCA Table
                                            </Nav.Item>
                                        </Nav.Menu>
                                            <Nav.Item eventKey="3" placement="rightStart" icon={<GearIcon size="3em" />} onClick={() => navigate('/tools/rca/generate_rca')}>
                                                Generate RCA
                                            </Nav.Item>

                                        <Nav.Menu eventKey="2" placement="rightStart" title="Upload Data" icon={<FileUploadIcon size="3em" />}>
                                            <Nav.Item eventKey="2-1" placement="rightStart" onClick={() => navigate('/tools/rca/daily_4G_kpi')}>
                                                Daily 4G KPI
                                            </Nav.Item>
                                            <Nav.Item eventKey="2-2" placement="rightStart" onClick={() => navigate('/tools/rca/tentative_counter')}>
                                                Tentative Count. 24Hrs.
                                            </Nav.Item>
                                            <Nav.Item eventKey="2-3" placement="rightStart" onClick={() => navigate('/tools/rca/alarm_files')}>
                                                Alarm File
                                            </Nav.Item>
                                        </Nav.Menu>
                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </div>
                    </Grid>
                    <Grid item xs={10}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route element={<Rca_tool />} path="/" />
                                <Route element={<Kpi_Data />} path="/kpi_table" />
                                <Route element={<Rca_data />} path="/rca_table" />
                                <Route element={<Daily4G_KPI />} path="/daily_4G_kpi" />
                                <Route element={<TentativeCounter />} path="/tentative_counter" />
                                <Route element={<AlarmFiles />} path="/alarm_files" />
                                <Route element={<Generate_rca />} path="/generate_rca" />
                                <Route element={<MDashboard />} path="/master_dashboard" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Rca