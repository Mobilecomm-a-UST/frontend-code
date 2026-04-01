import React, { lazy, useEffect, Suspense } from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Box } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import TrendBox from '../TrendBox';
// import Kpi4G from './MakeKPI(old)/Kpi4G';
const TrendBox = lazy(() => import('../TrendBox'))
const Kpi4G = lazy(() => import('./MakeKPI(old)/Kpi4G'))
const Degrow = lazy(() => import('./Degrow/Degrow'))
const KTKKpiNew = lazy(() => import('./MakeKPI(new)/Kpi4G'))

const KTKTrend = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('');
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
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>KTK Trend</Nav>
                                            {/* <Nav.Menu placement="rightStart" eventKey="1" title="Make Trend(Old)" icon={<FileUploadIcon />}>
                                <Nav.Item eventKey="1-2"
                                 onClick={()=>navigate('/trends/ktk/kpi_4G')}
                                >4G
                                </Nav.Item>
                            </Nav.Menu> */}
                                            <Nav.Item eventKey='1' placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/trends/ktk/make_kpi_trend_old')}>Make Trend(Old)</Nav.Item>
                                            <Nav.Item eventKey='2' placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/trends/ktk/make_kpi_trend_new')}>Make Trend(New)</Nav.Item>
                                            <Nav.Item eventKey='3' placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/trends/ktk/make_degrow')}>Make Degrow</Nav.Item>
                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>

                        <Suspense fallback={<div>loading............</div>}>

                            <Routes>
                                <Route element={<TrendBox data={'KTK'} />} path="/" />
                                <Route element={<Kpi4G />} path="/make_kpi_trend_old" />
                                <Route element={<KTKKpiNew />} path="/make_kpi_trend_new" />
                                <Route element={<Degrow />} path="/make_degrow" />
                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

}

export default KTKTrend