import React, { lazy, useEffect ,Suspense} from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendBox from '../TrendBox';
import Kpi4G from './MakeKPI(old)/Kpi4G';
const Degrow =  lazy(() => import('./Degrow/Degrow'))

const KTKTrend = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState('1');
    const [states, setStates] = useState([])

    const navigate = useNavigate()
    const headData = document.location.pathname.split('/');
    useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
    },[])
  return (
    <div >

    <Grid container spacing={1}>
        <Grid item xs={2}>
            <div >
                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                    <Sidenav.Body>
                        <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: '', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10, position: 'fixed' }}>
                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>KTK Trend</Nav>
                            {/* <Nav.Menu placement="rightStart" eventKey="1" title="Make Trend(Old)" icon={<FileUploadIcon />}>
                                <Nav.Item eventKey="1-2"
                                 onClick={()=>navigate('/trends/ktk/kpi_4G')}
                                >4G
                                </Nav.Item>
                            </Nav.Menu> */}
                            <Nav.Item eventKey='2' icon={<FileUploadIcon />} onClick={()=>navigate('/trends/ktk/make_kpi_trend_old')}>Make Trend(Old)</Nav.Item>
                            <Nav.Item eventKey='3' icon={<FileUploadIcon />} onClick={()=>navigate('/trends/ktk/make_degrow')}>Make Degrow</Nav.Item>
                        </Nav>
                    </Sidenav.Body>

                </Sidenav>
            </div>
        </Grid>
        <Grid item xs={10}>
            <Suspense fallback={<div>loading............</div>}>
                <Routes>
                    <Route element={<TrendBox data={'KTK'} />} path="/" />
                    <Route element={<Kpi4G/>} path="/make_kpi_trend_old" />
                    <Route element={<Degrow/>} path="/make_degrow" />

                </Routes>

            </Suspense>

        </Grid>
    </Grid>
</div>
  )
}

export default KTKTrend