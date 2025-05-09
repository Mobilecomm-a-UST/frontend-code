import React from 'react'
import { useState,useEffect } from 'react'


import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';

import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TrendBox from '../TrendBox';
import MakeKPITrendOld from './Make_Trend(Old)/MakeKPITrendOld'

const DLTrend = () => {
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

            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <div >
                        <Sidenav expanded={expanded} defaultOpenKeys={['1', '3']} appearance="subtle">
                            <Sidenav.Body>
                                <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width:'',minHeight:"670px",height:"100hv",backgroundColor:"#223354",marginTop:8,borderRadius:10,position:'fixed' }}>
                                    <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>DL Trend</Nav>
                                    <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon />}>

                                        {/* <NavLink  to='/trends/hr'>Giraj singh</NavLink> */}
                                    </Nav.Menu>
                                    <Nav.Item eventKey="4" icon={<FileUploadIcon />}
                                        onClick={() => navigate('/trends/dl/make_kpi_trend_old')}
                                    >
                                        Make Trend(Old)
                                    </Nav.Item>

                                </Nav>
                            </Sidenav.Body>

                        </Sidenav>
                    </div>
                </Grid>
                <Grid item xs={10}>

                    <Routes>
                        <Route element={<TrendBox data={'DL'} />} path="/" />
                        <Route element={<MakeKPITrendOld />} path="/make_kpi_trend_old" />
                    </Routes>

                </Grid>
            </Grid>
        </div>
    )
}

export default DLTrend