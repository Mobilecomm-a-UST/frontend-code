import React, { Suspense, useEffect, lazy } from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from '../../Skeleton/Loader'
import { Garage } from '@mui/icons-material';
import { getDecreyptedData } from '../../utils/localstorage'
import NetworkPingRoundedIcon from '@mui/icons-material/NetworkPingRounded';

const PerformanceTool = lazy(() => import("./PerformanceTool"));
const FileManager = lazy(() => import("./File Manager/File_Manager"));
const FTR_Aging = lazy(() => import("./File Manager/FTR_Aging"));
const SCFT_FTR = lazy(() => import("./File Manager/SCFT_FTR"));
const MasterDashboard = lazy(() => import("./File Manager/MasterDashboard"));
const Performance_Aging_Main_Graph = lazy(() => import("./File Manager/Performance_Aging_Main_Graph"));
const SCFT_Aging_Main_Graph = lazy(() => import("./perATPendingAging/SCFT_Aging_Main_Graph"));
const PerformanceKpi5G = lazy(() => import("./File Manager/Performancekpi5g"));

const SCFT_Aging = lazy(() => import("./File Manager/SCFT_Aging"));
const SCFT_Pending_Aging = lazy(()=> import("./perATPendingAging/Scft_Pending_Aging"));
const Performance_SR_Wise = lazy(() => import("./File Manager/Performance_SR_Wise"));
const PerformanceAtPendingAging = lazy(() => import("./perATPendingAging/MasterDashboard"));
// const Performance_Aging_Graph = lazy(() => import("./File Manager/Performance_Aging_Graph"));
const SCFT_Aging_Graph = lazy(() => import("./perATPendingAging/SCFT_Aging_Graph"));
const Aging5G = lazy(() => import("./Soft AT/Aging5G"));
const SR_Wise_Hyper =lazy(()=> import ("./File Manager/SR_Wise_Hyperlink"));


// const UploadPerformanceAt = lazy(() => import("./Upload_Performance_At/UploadPerformanceAt"));
// const Dashboard = lazy(() => import("./Dashboard/Dashboard"));


// PerformanceAt.js — ONLY CHANGED: sidebar div position + xs={0} → xs={2}

const PerformanceAt = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])
    const navigate = useNavigate()
      const userTypes = (getDecreyptedData('user_type')?.split(","))

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <Box style={{ marginTop: 60 }}>
                <Grid container spacing={2}>

                    {/* ✅ xs={0} → xs={2} so sidebar reserves space at all screen sizes */}
                    <Grid item xs={2} md={2}>
                        <div style={{
                            position: 'sticky',          /* ✅ was 'fixed' — now stays in grid flow */
                            top: 68,                     /* ✅ sticks just below top navbar */
                            height: 'calc(100vh - 68px)',
                            overflowY: 'auto',
                        }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                <Sidenav.Body>
                                    <Nav
                                        activeKey={activeKey}
                                        onSelect={setActiveKey}
                                        style={{
                                            width: 'auto',
                                            minHeight: "800px",
                                            backgroundColor: "#223354",
                                            marginTop: 8,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19 }}>
                                            PERFORMANCE AT
                                        </Nav>
                                            {!userTypes?.includes('PAT') &&<Nav.Item
                                            eventKey="1"
                                            placement="rightStart"
                                            icon={<FileUploadIcon />}
                                            onClick={() => navigate('/tools/performance_at_tat/file_manager')}
                                        >
                                            File Manager
                                        </Nav.Item>}

                                        

                                        <Nav.Menu eventKey="2" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="Performance AT" icon={<DashboardIcon />}  >
                                            <Nav.Item
                                                eventKey="2-1"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/MasterDashboard')}
                                            >
                                                Performance Aging
                                            </Nav.Item>
                                             <Nav.Item
                                                eventKey="2-2"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/performance_at_pending_aging')}
                                            >
                                                Pending Aging
                                            </Nav.Item>

                                            <Nav.Item
                                                eventKey="2-3"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/FTR_Aging')}
                                            >
                                                Performance FTR
                                            </Nav.Item>
                                            <Nav.Item
                                                eventKey="2-4"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/Performance_Aging_Main_Graph')}
                                            >
                                                Performance Graph
                                            </Nav.Item>
                                            
                                        </Nav.Menu>

                                        <Nav.Menu eventKey="3" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="SCFT AT" icon={<DashboardIcon />}  >
                                             <Nav.Item
                                                eventKey="3-1"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/SCFT_Aging')}
                                            >
                                                SCFT Aging
                                            </Nav.Item>

                                             <Nav.Item
                                                eventKey="3-2"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/SCFT_Pending_Aging')}
                                            >
                                             SCFT Pending Aging
                                            </Nav.Item>

                                             <Nav.Item
                                                eventKey="3-3"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/SCFT_FTR')}
                                            >
                                                SCFT FTR
                                            </Nav.Item>

                                            <Nav.Item
                                                eventKey="3-4"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/Performance_SR_Wise')}
                                            >
                                                SR Wise Tracking
                                            </Nav.Item>

                                             <Nav.Item
                                                eventKey="3-5"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/SCFT_Aging_Main_Graph')}
                                            >
                                                SCFT Aging Graph
                                            </Nav.Item>

                                        </Nav.Menu>
                                        
                                        <Nav.Menu eventKey="4" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title=" Soft AT" icon={<DashboardIcon />}  >
                                            <Nav.Item
                                                eventKey="4-1"
                                                placement="rightStart"
                                                // icon={<DashboardIcon />}
                                                onClick={() => navigate('/tools/performance_at_tat/Aging5G')}
                                            >
                                                5G Aging
                                            </Nav.Item>

                                        </Nav.Menu>

                                        <Nav.Item
                                            eventKey="5"
                                            placement="rightStart"
                                            icon={<DashboardIcon />}
                                            onClick={() => navigate('/tools/performance_at_tat/Performancekpi5g')}
                                        >
                                            5G Performance KPI
                                        </Nav.Item>
                                        
                                    </Nav>
                                    
                                </Sidenav.Body>
                            </Sidenav>
                        </div>
                    </Grid>

                    {/* Content — unchanged */}
                    <Grid item xs={10} md={10}>
                        <Suspense fallback={<Loader />}>
                            <Routes>
                                <Route element={<PerformanceTool />} path="/" />
                                 {!userTypes?.includes('PAT') &&<Route element={<FileManager />} path="/file_manager" />}
                                <Route element={<FTR_Aging />} path="/FTR_Aging" />
                                <Route element={<SCFT_FTR />} path="/SCFT_FTR" />
                                <Route element={<SCFT_Aging />} path="/SCFT_Aging" />
                                <Route element={<SCFT_Pending_Aging/>} path="/SCFT_Pending_Aging"/>
                                <Route element={<Performance_SR_Wise />} path="/Performance_SR_Wise" />
                                <Route element={<MasterDashboard />} path="/MasterDashboard" />
                                <Route element={<PerformanceAtPendingAging />} path="/performance_at_pending_aging" />
                                <Route element={<Performance_Aging_Main_Graph />} path="/Performance_Aging_Main_Graph" />
                                <Route element={<SCFT_Aging_Main_Graph />} path="/SCFT_Aging_Main_Graph" />
                                <Route element={<Aging5G />} path="/Aging5G" />
                                <Route element={<PerformanceKpi5G />} path="/Performancekpi5g" />
                                <Route element ={<SR_Wise_Hyper/>} path= "/SR_Wise_Hyperlink"/>
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid> 
            </Box>
        </>
    );
};

export default PerformanceAt;