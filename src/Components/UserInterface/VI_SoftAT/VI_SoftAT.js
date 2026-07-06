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
import { getDecreyptedData } from '../../utils/localstorage';
import Loader from '../../Skeleton/Loader';
import NavMenu from 'rsuite/esm/Nav/NavMenu';

const VI_SoftAT_Tool = lazy(() => import('./VI_SoftAT_Tool'))
const Vi_Checklist = lazy(() => import('./VI_Checklist/Vi_checklist'))
const UploadFile = lazy(() => import('./VI_Checklist/UploadFile'))
const VI_FTR_Dashboard = lazy(() => import('./VI_Checklist/VI_FTR_Dashboard/VI_FTR_Dashboard'))
const FourG = lazy(()=> import('./VI_Summary/FourG'))
const TwoG = lazy(()=> import('./VI_Summary/TwoG'))
const FiveG = lazy(()=> import('./VI_Summary/FiveG'))


const VI_SoftAT = () => {
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
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>VI Soft AT Tool</Nav>
                                        {/* <Nav.Men eventKey="1" placement="rightStart" icon={<DashboardIcon />} title="Dashboard">
                                         <Nav.Item>dfdf</Nav.Item>
                                        </Nav.Men > */}
                                        <Nav.Item eventKey="1" placement="rightStart" icon={<AppSelectIcon />} onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/Vi_checklist')}>
                                            VI Checklist
                                        </Nav.Item>
                                        <Nav.Menu eventKey="2" placement="rightStart" title="VI Summary" icon={<DashboardIcon size="3em" />}>
                                           
                                        <Nav.Item eventKey="2-1" placement="rightStart"  onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/TwoG')}>
                                            2G
                                        </Nav.Item>
                                        <Nav.Item eventKey="2-2" placement="rightStart"  onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/FourG')}>
                                            4G
                                        </Nav.Item>
                                        <Nav.Item eventKey="2-3" placement="rightStart"  onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/FiveG')}>
                                            5G
                                        </Nav.Item>
                                         </Nav.Menu>

                                    
                                        {/* <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/vi_ftr_dashboard')}>
                                            VI FTR Dashboard
                                        </Nav.Item>
                                         <Nav.Item eventKey="3" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/soft_at_tools/vi_soft_at/upload_file')} >
                                            Upload FTR
                                        </Nav.Item> */}
                                     
                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                <Route element={<VI_SoftAT_Tool />} path="/" />
                                <Route element={<Vi_Checklist />} path="/vi_checklist" />
                                <Route element={<UploadFile />} path="/upload_file" />
                                <Route element={<VI_FTR_Dashboard />} path="/vi_ftr_dashboard" />
                                <Route element={<FourG />} path="/FourG" />
                                <Route element={<TwoG />} path="/TwoG" />
                                <Route element={<FiveG />} path="/FiveG" />
                                
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default VI_SoftAT