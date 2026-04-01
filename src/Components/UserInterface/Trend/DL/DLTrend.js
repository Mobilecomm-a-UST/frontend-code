import React from 'react'
import { useState, useEffect, Suspense, lazy } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';

import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import TrendBox from '../TrendBox';
// import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'
const TrendBox = lazy(() => import('../TrendBox'))
const MakeKPITrendOld = lazy(() => import('./Make_Trend(Old)/MakeKPITrendOld'))

const DLTrend = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states, setStates] = useState([])
    const navigate = useNavigate()
    const headData = document.location.pathname.split('/');
    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])
    return (
        <>
            <Box style={{ marginTop: states, transition: 'all 1s ease' }} >

                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>DL Trend</Nav>
                                            {/* <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>

                                                <NavLink  to='/trends/hr'>Giraj singh</NavLink>
                                            </Nav.Menu> */}
                                            <Nav.Item eventKey="4" icon={<FileUploadIcon />}
                                                onClick={() => navigate('/trends/dl/make_kpi_trend_old')}
                                            >
                                                Make Trend(Old)
                                            </Nav.Item>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<div>loading............</div>}>
                            <Routes>
                                <Route element={<TrendBox data={'DL'} />} path="/" />
                                <Route element={<MakeKPITrendOld />} path="/make_kpi_trend_old" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

}

export default DLTrend