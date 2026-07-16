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
import Loader from '../../Skeleton/Loader';

const SA_upload = lazy(()=>import('./Upload/Upload'))
const SA_tool = lazy(()=>import('./SA_tool'))
const UPE_GPL_ULS = lazy(()=>import('./Upload/UPE_GPL_ULS'))
const ORI_gpl_macro = lazy(()=>import('./Upload/ORI_gpl_macro'))

const SA = () => {
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
                        <Box style={{ position: 'fixed', width: '16.5%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>5G GPL Tool</Nav>
                                   
                                        <Nav.Item eventKey="1" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/ix_tools/sa_slicing/sa_upload_xml')}>
                                            UPE GPL Macro
                                        </Nav.Item>
                                        <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/ix_tools/sa_slicing/UPE_GPL_ULS')}>
                                            UPE GPL ULS
                                        </Nav.Item>
                                        <Nav.Item eventKey="3" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/ix_tools/sa_slicing/ORI_gpl_macro')}>
                                            ORI GPL Macro
                                        </Nav.Item>

                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                <Route element={<SA_tool />} path="/" />
                                <Route element={<SA_upload/>} path='/sa_upload_xml' />
                                <Route element={<UPE_GPL_ULS/>} path='/UPE_GPL_ULS' />
                                <Route element={<ORI_gpl_macro/>} path='/ORI_gpl_macro' />

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
  )
}

export default SA