import React, { useEffect } from 'react'
import { useState } from 'react'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MakeKPITrendOld from './Make_Trend(old)/MakeKPITrendOld'
import TrendBox from '../TrendBox';
import KpiTrend2G from './Make_Trend(old)/KpiTrend2G';
import KpiTrend4G from './Make_Trend(old)/KpiTrend4G';



function RJTrend() {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [states, setStates] = useState([])

  const navigate = useNavigate()
  const headData = document.location.pathname.split('/');
  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
  }, [])


  return (
    <div >

      <Grid container spacing={1}>
        <Grid item xs={2}>
          <div >
            <Sidenav  expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
              <Sidenav.Body>
                <Nav activeKey={activeKey} onSelect={setActiveKey}>
                  <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>RAJ/NESA Trend</Nav>

                  {/* <Nav.Menu placement="rightStart" eventKey="3" title="Pre-Post Upload" icon={<FileUploadIcon/>}>

              <Nav.Item eventKey="3-2"
               onClick={()=>navigate(-1)}
               >Pre-Post Report</Nav.Item>

            </Nav.Menu> */}
                  {/* <Nav.Item eventKey="4" icon={<FileUploadIcon/>} onClick={()=>navigate(-1)}>
               Make Trend
            </Nav.Item> */}
                  <Nav.Menu activeKey="2" icon={<FileUploadIcon />} title="Make Trend">
                    <Nav.Item eventKey="2-1" onClick={() => navigate('/trends/rj/kpi_trend_2G')}>
                      Trend 2G
                    </Nav.Item>
                    <Nav.Item eventKey="2-2" onClick={() => navigate('/trends/rj/kpi_trend_4G')} >
                      Trend 4G
                    </Nav.Item>

                  </Nav.Menu>

                </Nav>
              </Sidenav.Body>

            </Sidenav>
          </div>
        </Grid>
        <Grid item xs={10}>
          <div >



            <Routes>


              <Route element={<TrendBox data={'RAJ / NESA'} />} path="/" />
              {/* <Route element={<MakeKPITrendOld/>} path="make_kpi_trend_old"/> */}
              <Route element={<KpiTrend2G />} path="kpi_trend_2G" />
              <Route element={<KpiTrend4G />} path="kpi_trend_4G" />

            </Routes>

          </div>

        </Grid>
      </Grid>
    </div>
  )
}

export default RJTrend