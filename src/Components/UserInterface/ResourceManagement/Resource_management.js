

import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import { getDecreyptedData } from '../../../Components/utils/localstorage';
import AdminIcon from '@rsuite/icons/Admin';
import "./../../../App.css";
import Loader from '../../Skeleton/Loader';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import DashboardIcon from '@rsuite/icons/Dashboard';
import TableIcon from '@rsuite/icons/Table';

const ResourceManagement_tool = lazy(() => import('./Resource_management_tool'))
const UploadFile = lazy(() => import('./Upload/UploadFile'))
const ResourceUploadFile = lazy(() => import('./Upload/Resource_upload'))
const MyDashboard = lazy(() => import('./Dashboard/MyDashboard'))
const AdminDashboard = lazy(() => import('./AdminDashboard/AdminDashboard'))
const AdminTable = lazy(() => import('./AdminDashboard/AdminTable'))



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
                                            {userTypes?.includes('RM_Admin') &&
                                                <>
                                                    <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<DashboardIcon/>} onClick={() => { navigate('/tools/resource_management/admin_dashboard'); show(); setMenuButton(true) }}>
                                                            Admin Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<TableIcon />} onClick={() => { navigate('/tools/resource_management/admin_table'); show(); setMenuButton(true) }}>
                                                            Admin Table
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<FileUploadIcon />} onClick={() => { navigate('/tools/resource_management/upload_file'); show(); setMenuButton(true) }}>
                                                            Upload Revenue
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<FileUploadIcon />} onClick={() => { navigate('/tools/resource_management/resource_upload'); show(); setMenuButton(true) }}>
                                                            Upload Resources
                                                    </Nav.Item>
                                                </>
                                            }
                                            {userTypes?.includes('RM_CDH') &&
                                                <Nav.Item eventKey="1-6" placement="rightStart" style={{ fontWeight: 400, color: 'white' }} icon={<DashboardIcon />} onClick={() => { navigate('/tools/resource_management/my_dashboard'); show(); setMenuButton(true) }}>
                                                        My Dashboard
                                                </Nav.Item>
                                            }
                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                
                                
                                {userTypes?.includes('RM_Admin') &&
                                    <>
                                        <Route element={<ResourceManagement_tool />} path="/" />
                                        <Route element={<UploadFile />} path="/upload_file" />
                                        <Route element={<ResourceUploadFile />} path="/resource_upload" />
                                        <Route element={<AdminDashboard />} path="/admin_dashboard" />
                                        <Route element={<AdminTable />} path="/admin_table" />

                                    </>
                                }

                                {userTypes?.includes('RM_CDH') &&
                                    <>
                                        <Route element={<ResourceManagement_tool />} path="/" />
                                        <Route element={<MyDashboard />} path="/my_dashboard" />

                                    </>
                                }


                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box >
        </>
    )
}
export default ResourceManagement