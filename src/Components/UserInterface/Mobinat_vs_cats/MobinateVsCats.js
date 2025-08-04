import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'

import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';

import { useNavigate } from 'react-router-dom'
import { BrowserRouter , Routes, Route } from "react-router-dom";

import ChangeListIcon from '@rsuite/icons/ChangeList';

const MobinateTool = lazy(()=>import('./MobinateTool'))
const MobinateFileHandle = lazy(()=>import('./Mobinate/Mobinate'))
const CateFileHandle = lazy(()=>import('./CATS/Cats'))


const MobinateVsCate = () => {
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
                        {/* <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Nomenclature Scriptor</Nav>
                                                <Nav.Item eventKey="2" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/nomenclature_scriptor/generate_script'); show(); setMenuButton(true) }}>
                                                    Genetate Script
                                                </Nav.Item>
                                                <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                    <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                        Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                        Pre-Post Audit
                                                    </Nav.Item>
                                                </Nav.Menu>


                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box> */}
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>Mobinate Vs CATS</Nav>
                                            {/* <Nav.Menu eventKey="1" placement="rightStart" title="Acceptance" icon={<CheckOutlineIcon size="3em" />}>
                                                <Nav.Item eventKey="1-1" onClick={() => { navigate('/tools/mcom_physical_at/acceptance_summary'); show(); setMenuButton(true) }} >
                                                    Acceptance Summary
                                                </Nav.Item>
                                            </Nav.Menu> */}
                                            <Nav.Item eventKey="2" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/mobinate_vs_cats/mobinate'); show(); setMenuButton(true) }}>
                                              Step 1: Mobinate
                                            </Nav.Item>     <Nav.Item eventKey="3" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/mobinate_vs_cats/CATS'); show(); setMenuButton(true) }}>
                                               Step 2: CATS  
                                            </Nav.Item>
                                            {/* <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                    Dashboard
                                                </Nav.Item>
                                                <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                    Pre-Post Audit
                                                </Nav.Item>
                                            </Nav.Menu> */}

                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<MobinateTool />} path="/" />
                                <Route element={<MobinateFileHandle />} path="/mobinate" />
                                <Route element={<CateFileHandle />} path="/CATS" />
                               

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

}

export default MobinateVsCate;