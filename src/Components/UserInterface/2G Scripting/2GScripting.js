
import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav, Loader } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewsUnauthorizeIcon from '@rsuite/icons/ViewsUnauthorize';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import DocPassIcon from '@rsuite/icons/DocPass';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import ChangeListIcon from '@rsuite/icons/ChangeList';
import ChangeList from '@rsuite/icons/ChangeList'; 


const G2ScriptingTool = lazy(() => import('./2GScriptingTool'))
const G2Script = lazy(() => import('./2GScript/2GScript'))

const G2Scripting = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
    const [scrollTop, setScrollTop] = useState(0);

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
            <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>2G Scripting</Nav>

                                                <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/2g_scripting/2g_script'); show(); setMenuButton(true) }}>
                                                    2G Script
                                                </Nav.Item>
                                                 {/* <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/2g_scripting/skl'); show(); setMenuButton(true) }}>
                                                    Skl
                                                </Nav.Item> */}
                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box>
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>2G Scripting</Nav>

                                            <Nav.Item
                                                eventKey="3-2"
                                                placement="rightStart"
                                                icon={<ChangeListIcon />}
                                                onClick={() => {
                                                    navigate('/tools/2g_scripting/2g_script');
                                                    show();
                                                    setMenuButton(true);
                                                }}
                                            >
                                                2G Script
                                            </Nav.Item>
                                            {/* <Nav.Item
                                                eventKey="3-3"
                                                placement="rightStart"
                                                icon={<ChangeListIcon />}
                                                onClick={() => {
                                                    navigate('/tools/2g_scripting/skl');
                                                    show();
                                                    setMenuButton(true);
                                                }}
                                            >
                                                Skl
                                            </Nav.Item> */}
                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader/>}>
                            <Routes>
                                <Route element={<G2ScriptingTool />} path="/" />
                                <Route element={<G2Script />} path="/2g_script" />
                                {/* <Route element={<Skl />} path="/skl" /> */}
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default G2Scripting
