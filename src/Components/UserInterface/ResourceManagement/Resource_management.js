

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
import { useNavigate } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import { getDecreyptedData } from '../../../Components/utils/localstorage';
import AdminIcon from '@rsuite/icons/Admin';
import "./../../../App.css";
import Loader from '../../Skeleton/Loader';
import FileUploadIcon from '@rsuite/icons/FileUpload';

const ResourceManagement_tool = lazy(() => import('./Resource_management_tool'))
const UploadFile = lazy(() => import('./Upload/UploadFile'))
const MyDashboard = lazy(() => import('./Dashboard/MyDashboard'))







const ProtectedRoute = ({ allowed, children }) => {
    if (!allowed) {
        return <Navigate to="/tools/relocation_tracking/error" replace />;
    }
    return children;
}



const ResourceManagement = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const navigate = useNavigate()
    const [menuButton, setMenuButton] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    //  const classes = useStyles();





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
              
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Resource Management</Nav>
                                            {/* Admin Panel */}
                                            {userTypes?.includes('RLT_Admin') &&
                                                <Nav.Item eventKey="3" placement="rightStart" className="single-item-custom" icon={<AdminIcon />} onClick={() => { navigate('/tools/relocation_tracking/admin_panel'); show(); setMenuButton(true) }}>
                                                    Admin Panel
                                                </Nav.Item>}
                                            {/* RFAI To MS1 */}
                                            <Nav.Menu eventKey="1" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="RFAI To MS1" icon={<ArrowRightIcon />}  >
                                                <Nav.Item eventKey="1-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/rfai_to_ms1_analytics'); show(); setMenuButton(true) }}>
                                                    Analytics Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/rfai_to_ms1_waterfall'); show(); setMenuButton(true) }}>
                                                    Waterfall Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-3" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/site_lifecycle'); show(); setMenuButton(true) }}>
                                                    Site Lifecycle
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-4" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/rfai_to_ms1_ageing'); show(); setMenuButton(true) }}>
                                                    Ageing Dashboard
                                                </Nav.Item>
                                                 <Nav.Item eventKey="1-5" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/rfai_to_ms1_issue_tracker'); show(); setMenuButton(true) }}>
                                                    Issue Tracker
                                                </Nav.Item>
                                                {!userTypes?.includes('RLT_reader') && <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/rfai_to_ms1_upload_file'); show(); setMenuButton(true) }}>
                                                    Upload File
                                                </Nav.Item>}


                                            </Nav.Menu>

                                             { <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<FileUploadIcon />} onClick={() => { navigate('/tools/resource_management/my_dashboard'); show(); setMenuButton(true) }}>
                                                    My Dashboard
                                            </Nav.Item>}


                                            { <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<FileUploadIcon />} onClick={() => { navigate('/tools/resource_management/upload_file'); show(); setMenuButton(true) }}>
                                                    Upload File
                                            </Nav.Item>}
                                            {/* <Nav.Item eventKey="3" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/Integration/upload_file')} >
                                                Upload File
                                            </Nav.Item> */}

                                            {/* MS1 to MS2 */}
                                            {/* <Nav.Menu eventKey="2" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="MS1 To MS2" icon={<ArrowRightIcon />}  >
                                                <Nav.Item eventKey="2-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ms1_to_ms2_analytics'); show(); setMenuButton(true) }}>
                                                    Analytics Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-1" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ms1_to_ms2_waterfall'); show(); setMenuButton(true) }}>
                                                    Waterfall Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ms1_to_ms2_aging'); show(); setMenuButton(true) }}>
                                                    Ageing Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-2" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ms1_to_ms2_ftr_dashboard'); show(); setMenuButton(true) }}>
                                                    FTR Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-4" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/ms1_to_ms2_upload_ftr'); show(); setMenuButton(true) }}>
                                                    Upload FTR
                                                </Nav.Item>
                                            </Nav.Menu> */}

                                            {/* {userTypes?.includes('RLT_2') && <Nav.Menu eventKey="4" style={{ fontWeight: 400, color: 'white' }} placement="leftStart" className="menu-title-custom" title="Relocation 2.0" icon={<ArrowRightIcon />}  >
                                                <Nav.Item eventKey="4-5" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} onClick={() => { navigate('/tools/relocation_tracking/relocation_2.0_upload_file'); show(); setMenuButton(true) }}>
                                                    Upload File
                                                </Nav.Item>
                                            </Nav.Menu>} */}
                                        

                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                <Route element={<ResourceManagement_tool />} path="/" />
                                <Route element={<UploadFile />} path="/upload_file" />
                                <Route element={<MyDashboard />} path="/my_dashboard" />

                                {/* {!userTypes?.includes('RLT_reader') && <Route element={<RFAItoMS1_UploadFile />} path="/rfai_to_ms1_upload_file" />}
                                <Route element={<RFAItoMS1_DashboardTable />} path="/rfai_to_ms1_waterfall/*" />
                                <Route element={<RFAItoMS1_FinalData />} path="/rfai_to_ms1_waterfall/:milestone" />
                                <Route element={<RFAItoMS1_MainAging />} path="/rfai_to_ms1_ageing" />
                                <Route element={<RFAItoMS1_MainDashboard />} path="/rfai_to_ms1_analytics" />
                                <Route element={<RFAItoMS1IssueTracker />} path="/rfai_to_ms1_issue_tracker" />
                                <Route element={<LifeCycle />} path="/site_lifecycle" />
                                <Route
                                    path="/rfai_to_ms1_upload_file"
                                    element={
                                        <ProtectedRoute allowed={!userTypes?.includes("RLT_reader")}>
                                            <RFAItoMS1_UploadFile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route element={<MS1toMS2_DashboardTable />} path="/ms1_to_ms2_waterfall" />
                                <Route element={<MS1toMS2_Upload_ftr />} path="/ms1_to_ms2_upload_ftr" />
                                <Route element={<MS1toMS2_FTR_Dashboard />} path="/ms1_to_ms2_ftr_dashboard" />
                                <Route element={<MS1toMS2_Aging />} path="/ms1_to_ms2_aging" />
                                <Route element={<MS1toMS2_Analytics />} path="/ms1_to_ms2_analytics" />
                                <Route element={<Dismantle_Analytics />} path="/dismantle_analytics" />


                                <Route element={<Dismantle_dashboard />} path="/dismantle_waterfall" />
                                <Route element={<Dismantle_Aging />} path="/dismantle_Ageing" />

                                <Route
                                    path="/admin_panel"
                                    element={
                                        <ProtectedRoute allowed={userTypes?.includes("RLT_Admin")}>
                                            <AdminPanel />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route element={<Error />} path="/error" />

                                {userTypes?.includes('RLT_2') && <Route element={<Relocation2_0_UploadFile/>} path='/relocation_2.0_upload_file' />} */}


                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}



export default ResourceManagement