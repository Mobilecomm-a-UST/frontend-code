import React, { Suspense, useEffect, lazy } from 'react'
import { useState } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from '../../Skeleton/Loader'

const PerformanceTool = lazy(() => import("./PerformanceTool"));
const FileManager = lazy(() => import("./File Manager/File_Manager"));
const Dashboard = lazy(() => import("./File Manager/Dashboard"));
// const UploadPerformanceAt = lazy(() => import("./Upload_Performance_At/UploadPerformanceAt"));
// const Dashboard = lazy(() => import("./Dashboard/Dashboard"));


// PerformanceAt.js — ONLY CHANGED: sidebar div position + xs={0} → xs={2}

const PerformanceAt = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])
    const navigate = useNavigate()

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
                                            minHeight: "670px",
                                            backgroundColor: "#223354",
                                            marginTop: 8,
                                            borderRadius: 10,
                                        }}
                                    >
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 19 }}>
                                            PERFORMANCE AT TAT
                                        </Nav>
                                        <Nav.Item
                                            eventKey="1"
                                            placement="rightStart"
                                            icon={<FileUploadIcon />}
                                            onClick={() => navigate('/tools/performance_at_tat/file_manager')}
                                        >
                                            Upload Performance AT TAT
                                        </Nav.Item>
                                        <Nav.Item
                                            eventKey="2"
                                            placement="rightStart"
                                            icon={<DashboardIcon />}
                                            onClick={() => navigate('/tools/performance_at_tat/Dashboard')}
                                        >
                                            Dashboard
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
                                <Route element={<FileManager />} path="/file_manager/*" />
                                <Route element={<Dashboard />} path="/Dashboard/*" />
                            </Routes>
                        </Suspense>
                    </Grid>

                </Grid>
            </Box>
        </>
    );
};

export default PerformanceAt;