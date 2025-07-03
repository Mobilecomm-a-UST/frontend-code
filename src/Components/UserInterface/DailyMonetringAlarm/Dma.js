import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from "react-router-dom";

import ChangeListIcon from '@rsuite/icons/ChangeList';
const Make4G = lazy(() => import('./MakeAlarm/Make4G'))
const Make5G = lazy(() => import('./MakeAlarm/Make5G'))
const DmaTool = lazy(() => import('./DmaTool'))
const RRUAlarm = lazy(() => import('./RRU/RRUstatus'))
const Twamp = lazy(()=>import('./Twamp/TwampStatus'))

const Dma = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
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
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>DSA TOOL</Nav>


                                                {/* <Nav.Item eventKey="4" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/soft_at/rejected_report'); show(); setMenuButton(true) }}>
                Rejected Report
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
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>DSA TOOL</Nav>
                                            {/* <Nav.Menu eventKey="1" placement="rightStart" title="Acceptance" icon={<CheckOutlineIcon size="3em" />}>
                                        <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/mcom_physical_at/acceptance_summary'); show(); setMenuButton(true) }} >
                                            Acceptance Summary
                                        </Nav.Item>
                                    </Nav.Menu> */}
                                            <Nav.Item eventKey="1" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/dma/make_4g'); show(); setMenuButton(true) }}>
                                                Make 4G Alarm
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/dma/make_5g'); show(); setMenuButton(true) }}>
                                                Make 5G Alarm
                                            </Nav.Item>
                                            <Nav.Item eventKey="3" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/dma/RRU_status'); show(); setMenuButton(true) }}>
                                                RRU Status
                                            </Nav.Item>
                                            <Nav.Item eventKey="4" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/dma/twamp_ericsson'); show(); setMenuButton(true) }}>
                                                Twamp Ericsson
                                            </Nav.Item>
                                            {/* <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                    Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                    Pre-Post Audit
                                                </Nav.Item>
                                            </Nav.Menu> */}

                                            {/* <Nav.Item eventKey="3" placement="rightStart" icon={<PageIcon />} onClick={() => { navigate('/tools/soft_at/view_report'); show(); setMenuButton(true) }}>
                                        View Report
                                    </Nav.Item>
                                    <Nav.Item eventKey="4" placement="rightStart" icon={<FileDownloadIcon />} onClick={() => { navigate('/tools/soft_at/download_template'); show(); setMenuButton(true) }}>
                                        Download Template
                                    </Nav.Item> */}
                                            {/* <Nav.Item eventKey="4" placement="rightStart" icon={<ViewsUnauthorizeIcon />} onClick={() => { navigate('/tools/soft_at/rejected_report'); show(); setMenuButton(true) }}>
                Rejected Report
              </Nav.Item> */}
                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                 <Route element={<DmaTool />} path="/" />
                                 <Route element={<Make4G />} path="/make_4g" />
                                 <Route element={<Make5G />} path="/make_5g" />
                                 <Route element={<RRUAlarm />} path="/RRU_status" />
                                 <Route element={<Twamp />} path="/twamp_ericsson" />
                          


                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Dma