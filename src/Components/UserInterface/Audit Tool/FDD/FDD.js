
import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AbTestIcon from '@rsuite/icons/AbTest';
import Slide from '@mui/material/Slide';
const FDDTool = lazy(() => import('./FDDTool'))
const Comparison = lazy(() => import('./Comperison/Comperison'))

const FDD = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>
            <Box style={{ marginTop: '60px' }}>
                <Grid container spacing={2}>
                    <Slide direction="down" in={true} timeout={800} mountOnEnter unmountOnExit>
                        <Grid item xs={0} md={2} sx={{}}>
                            <div style={{ position: 'fixed' ,width:'16%'}}>
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Audit FDD</Nav>

                                            {/* <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em"/>} >
              <Nav.Item eventKey='1-1' placement="rightStart"  onClick={() => navigate('/tools/physical_at/dashboard')}>
                Ageing(Circle Wise)
              </Nav.Item>

          </Nav.Menu> */}

                                            <Nav.Item eventKey="1" placement="rightStart" icon={<AbTestIcon />} onClick={() => navigate('/tools/audit/FDD/comperison')} >
                                                Comparison
                                            </Nav.Item>

                                        </Nav>
                                    </Sidenav.Body>

                                </Sidenav>
                            </div>
                        </Grid>
                    </Slide>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<FDDTool />} path="/" />
                                <Route element={<Comparison />} path="/comperison" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default FDD