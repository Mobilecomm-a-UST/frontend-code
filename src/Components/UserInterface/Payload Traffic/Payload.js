import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@rsuite/icons/Search';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HistoryIcon from '@rsuite/icons/History';
import { IconButton, ButtonToolbar } from 'rsuite';
import { Query } from '@tanstack/react-query';
import { getDecreyptedData } from '../../utils/localstorage';
import Loader from '../../Skeleton/Loader'
// import { Search } from '@mui/icons-material';
// import { Query } from '@tanstack/react-query';


const PayloadTool = lazy(() => import('./PayloadTool'))
const Upload_4G_Payload = lazy(() => import('./Upload Payload/Upload_4G_Payload'))
const Upload_5G_Payload = lazy(() => import('./Upload Payload/Upload_5G_Payload'))
const Query_Traffic = lazy(() => import('./Upload Payload/QueryTraffic'))
const UploadHistory = lazy(() => import('./Upload Payload/UploadHistory'))



const Payload = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
    const [scrollTop, setScrollTop] = useState(0);
    const userType = getDecreyptedData("user_type")?.split(',') || []
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
            <Box style={{ marginTop: states, transition: 'all 1s ease', marginTop: 50 }} >
                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 70, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>Telecom Traffic System</Nav>
                                            <Nav.Item eventKey="1" placement="rightStart" onClick={() => navigate('/tools/Payload Traffic/Upload_Payload/Upload_4G_Payload')} >
                                                Upload_4G_Payload
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" placement="rightStart" onClick={() => navigate('/tools/Payload Traffic/Upload_Payload/Upload_5G_Payload')} >
                                                Upload_5G_Payload
                                            </Nav.Item>
                                            <Nav.Item eventKey="3" placement="rightStart" onClick={() => navigate('/tools/Payload Traffic/Upload_Payload/Query_Traffic')} >
                                                Query Traffic
                                            </Nav.Item>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 20, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        {(['Admin', 'PTS_Admin'].some(role => userType?.includes(role))) && 

                                            <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                                <Nav style={{ fontWeight: 100, color: 'white', textAlign: 'center', fontSize: 20 }}>Telecom Traffic System</Nav>

                                                <Nav.Menu eventKey="1" placement="rightStart" icon={<FileUploadIcon />} title="Upload Payload">
                                                    <Nav.Item eventKey="1-1" placement="rightStart" onClick={() => { navigate('/tools/Payload_Traffic/Upload_4G_Payload'); show(); setMenuButton(true) }}>
                                                        Upload 4G Payload
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-2" placement="rightStart" onClick={() => { navigate('/tools/Payload_Traffic/Upload_5G_Payload'); show(); setMenuButton(true) }}>
                                                        Upload 5G Payload
                                                    </Nav.Item>
                                                </Nav.Menu>
                                                <Nav.Item eventKey="2" placement="rightStart" icon={<SearchIcon />} onClick={() => { navigate('/tools/Payload_Traffic/Query_Traffic'); show(); setMenuButton(true) }}>
                                                    Query Traffic
                                                </Nav.Item>
                                                <Nav.Item eventKey="3" placement="rightStart" icon={<HistoryIcon />} onClick={() => { navigate('/tools/Payload_Traffic/Upload_History'); show(); setMenuButton(true) }}>
                                                    Upload History
                                                </Nav.Item>
                                            </Nav>}
                                            
                                        {userType?.includes('PTS') &&
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                                <Nav style={{ fontWeight: 100, color: 'white', textAlign: 'center', fontSize: 20 }}>Telecom Traffic System</Nav>
                                                <Nav.Item eventKey="2" placement="rightStart" icon={<SearchIcon />} onClick={() => { navigate('/tools/Payload_Traffic/Query_Traffic'); show(); setMenuButton(true) }}>
                                                    Query Traffic
                                                </Nav.Item>

                                            </Nav>}
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>

                                <Route element={<PayloadTool />} path="/" />
                                <Route element={<Upload_4G_Payload />} path="/upload_4g_payload" />
                                <Route element={<Upload_5G_Payload />} path="/upload_5g_payload" />
                                <Route element={<Query_Traffic />} path="/Query_Traffic" />
                                <Route element={<UploadHistory />} path="/Upload_History" />

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}

export default Payload