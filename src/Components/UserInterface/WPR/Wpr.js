import React from 'react'
import { useState, useEffect, Suspense ,lazy} from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
import Loader from '../../Skeleton/Loader'

const WprTool = lazy(() => import('./WprTool'));
const UploadReport = lazy(() => import('./UPLOAD_REPORT/UploadReport'));
const OverAll = lazy(() => import('./DASHBOARD/OverAll'));
const UploadReportStatus = lazy(() => import('./UPLOAD_REPORT/UploadReportStatus'));
const WeeklyComparision = lazy(() => import('./DASHBOARD/WeeklyComparision'));
const Site_List = lazy(() => import('./Project_site_list/Site_List'));
const WeeklyComparisionTable = lazy(() => import('./DASHBOARD/WeeklyComparisionTable'));

const Wpr = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeKey, setActiveKey] = useState();
  const navigate = useNavigate()
  useEffect(() => {
    document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

  }, [])
  return (
    <>

      <Box style={{ marginTop: '60px' }}>

        <Grid container spacing={1}>
          <Grid item xs={2} >
            <div style={{ position: 'fixed', width: '16%' }}>
              <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 5, borderRadius: 10 }}>
                <Sidenav.Body>
                  <Nav activeKey={activeKey} onSelect={setActiveKey} >
                    <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>WPR TOOL</Nav>
                    <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                      <Nav.Item eventKey="1-1" onClick={() => navigate('/tools/wpr/over_all')}>
                        Over All
                      </Nav.Item>
                      <Nav.Item eventKey="1-2" onClick={() => navigate('/tools/wpr/weekly_comparision')}>
                        W.C.G
                      </Nav.Item>
                      <Nav.Item eventKey="1-3" onClick={() => navigate('/tools/wpr/weekly_comparision_table')}>
                        W.C.T
                      </Nav.Item>
                    </Nav.Menu>
                    <Nav.Item eventKey="2" placement="rightStart" icon={<FileUploadIcon size="3em" />} onClick={() => navigate('/tools/wpr/report_upload')}>
                      Report Upload
                    </Nav.Item>



                  </Nav>
                </Sidenav.Body>

              </Sidenav>
            </div>
          </Grid>
          <Grid item xs={10}>
            <div >
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route element={<WprTool />} path="/" />
                  <Route element={<UploadReport />} path="/report_upload/*" />
                  <Route element={<OverAll />} path="/over_all/*" />
                  <Route element={<UploadReportStatus />} path="/report_upload/status" />
                  <Route element={<Site_List />} path="/over_all/site_list" />
                  <Route element={<WeeklyComparision />} path="/weekly_comparision" />
                  <Route element={<WeeklyComparisionTable />} path="/weekly_comparision_table" />
                </Routes>
              </Suspense>

            </div>

          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Wpr