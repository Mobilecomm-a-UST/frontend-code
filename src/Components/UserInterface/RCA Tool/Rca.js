import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { Routes, Route } from "react-router-dom";
import GearIcon from '@rsuite/icons/Gear';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import TrendIcon from '@rsuite/icons/Trend';
import ViewsAuthorizeIcon from '@rsuite/icons/ViewsAuthorize';



const Kpi_Data = lazy(() => import('./Kpi_table/Kpi_Data'));
const Rca_tool = lazy(() => import('./Rca_tool'));
const Rca_data = lazy(() => import('./Rca_table/Rca_data'));
const Daily4G_KPI = lazy(() => import('./Upload_files/Daily4G_KPI'));
const TentativeCounter = lazy(() => import('./Upload_files/TentativeCounter'));
const AlarmFiles = lazy(() => import('./Upload_files/AlarmFiles'));
const Generate_rca = lazy(() => import('./Generate_RCA/Generate_rca'));
const MDashboard = lazy(() => import('./MasterDashboard/MDashboard'));
const TicketDashboard = lazy(() => import('./Dashboard/TicketDashboard'));
const OverallSummary = lazy(() => import('./Dashboard/OverallSummary'));
const LteKpiTrend = lazy(() => import('./Trend/LteKpiTrend'));
const ZeroPayload = lazy(() => import('./Trend/ZeroPayload'));
const DayWisePayload = lazy(() => import('./Trend/DayWisePayload'));
const WeekWisePayload = lazy(() => import('./Trend/WeekWisePayload'))
const RaiseTicket = lazy(() => import('./TroubleTicket/RaiseTicket'))
const RaiseTicket2 = lazy(() => import('./TroubleTicket/RaiseTicket2'))
const MailData = lazy(() => import('./Kpi_table/MailData'))
const Graphs = lazy(() => import('./Dashboard/Graphs'))


const Rca = () => {

    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const navigate = useNavigate()
    const userType = (JSON.parse(localStorage.getItem('user_type'))?.split(","))

    console.log('user type data', !userType.includes('Circle_Rno'))

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>

            <Box style={{ marginTop: '60px' }}>

                <Grid container spacing={1}>
                    <Grid item xs={2} >
                        <div style={{ position: 'fixed', width: '16%', overflow: "scroll", scrollbarWidth: "2px" }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 5, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 18 }}>RCA Genie</Nav>

                                        {/* <Nav.Item eventKey="0" placement="rightStart" icon={<AppSelectIcon size="3em" />} onClick={() => navigate('/tools/rca/master_dashboard')}>
                                            Master Dashboard
                                        </Nav.Item> */}

                                        <Nav.Menu eventKey="4" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em" />}>
                                            <Nav.Item eventKey='4-1' placement="rightStart" onClick={() => navigate('/tools/rca/ticket_dashboard')}>
                                                Ticket Dashboard
                                            </Nav.Item>
                                            <Nav.Item eventKey='4-2' placement="rightStart" onClick={() => navigate('/tools/rca/overall_summary')}>
                                                Overall Summary
                                            </Nav.Item>
                                        </Nav.Menu>

                                        <Nav.Menu eventKey="5" placement="rightStart" title="Trend" icon={<TrendIcon size="3em" />}>
                                            <Nav.Item eventKey='5-1' placement="rightStart" onClick={() => navigate('/tools/rca/lte_kpi_trend')}>
                                                LTE KPI Trend
                                            </Nav.Item>
                                            <Nav.Item eventKey='5-2' placement="rightStart" onClick={() => navigate('/tools/rca/sleeping_cell')}>
                                                Sleeping Cell
                                            </Nav.Item>
                                            <Nav.Item eventKey='5-3' placement="rightStart" onClick={() => navigate('/tools/rca/day_wise_payload_variation')}>
                                                Day Wise Payload Dip
                                            </Nav.Item>
                                            <Nav.Item eventKey='5-4' placement="rightStart" onClick={() => navigate('/tools/rca/week_wise_payload_variation')}>
                                                Week Wise Payload Dip
                                            </Nav.Item>
                                        </Nav.Menu>

                                        <Nav.Menu eventKey="6" placement='rightStart' title="Trouble Ticket" icon={<ViewsAuthorizeIcon size="3em" />}>
                                            <Nav.Item eventKey='6-1' placement="rightStart" onClick={() => navigate('/tools/rca/ticket')}>
                                                Ticket
                                            </Nav.Item>
                                        </Nav.Menu>

                                        <Nav.Item eventKey="3" placement="rightStart" icon={<GearIcon size="3em" />} onClick={() => navigate('/tools/rca/generate_rca')}>
                                            Generate RCA
                                        </Nav.Item>
{/* 
                                        {(!userType.includes('Circle_Rno')) ? (<Nav.Menu eventKey="1" placement="rightStart" title="Threshold Data" icon={<DashboardIcon size="3em" />}>
                                            <Nav.Item eventKey="1-1" placement="rightStart" onClick={() => navigate('/tools/rca/kpi_table')}>
                                                KPI Table
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-2" placement="rightStart" onClick={() => navigate('/tools/rca/rca_table')}>
                                                RCA Table
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-3" placement="rightStart" onClick={() => navigate('/tools/rca/escalation_mail')}>
                                                Escalation Mail
                                            </Nav.Item>
                                        </Nav.Menu>
                                        ) : null} */}


                                        {(!userType.includes('Circle_Rno')) ? (<Nav.Menu eventKey="2" placement="rightStart" title="Upload Data" icon={<FileUploadIcon size="3em" />}>
                                            <Nav.Item eventKey="2-1" placement="rightStart" onClick={() => navigate('/tools/rca/daily_4G_kpi')}>
                                                Daily 4G KPI
                                            </Nav.Item>
                                            <Nav.Item eventKey="2-2" placement="rightStart" onClick={() => navigate('/tools/rca/tentative_counter')}>
                                                Tentative Count. 24Hrs.
                                            </Nav.Item>
                                            <Nav.Item eventKey="2-3" placement="rightStart" onClick={() => navigate('/tools/rca/alarm_files')}>
                                                Alarm File
                                            </Nav.Item>
                                        </Nav.Menu>) : null}


                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </div>
                    </Grid>
                    <Grid item xs={10}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route element={<Rca_tool />} path="/" />

                                {/* {!userType.includes('Circle_Rno') && <Route element={<Rca_data />} path="/rca_table" />}
                                {!userType.includes('Circle_Rno') && <Route element={<Kpi_Data />} path="/kpi_table" />} */}


                                {!userType.includes('Circle_Rno') && <Route element={<Daily4G_KPI />} path="/daily_4G_kpi" />}
                                {!userType.includes('Circle_Rno') && <Route element={<TentativeCounter />} path="/tentative_counter" />}
                                {!userType.includes('Circle_Rno') && <Route element={<AlarmFiles />} path="/alarm_files" />}
                                {/* {!userType.includes('Circle_Rno') && <Route element={<MailData />} path="/escalation_mail" />} */}
                                <Route element={<Generate_rca />} path="/generate_rca" />
                                {/* <Route element={<MDashboard />} path="/master_dashboard" /> */}
                                <Route element={<Graphs />} path="/ticket_dashboard" />
                                <Route element={<OverallSummary />} path="/overall_summary" />
                                <Route element={<LteKpiTrend />} path="/lte_kpi_trend" />
                                <Route element={<ZeroPayload />} path="/sleeping_cell" />
                                <Route element={<DayWisePayload />} path="/day_wise_payload_variation" />
                                <Route element={<WeekWisePayload />} path="/week_wise_payload_variation" />
                                {/* <Route element={<RaiseTicket />} path="/raise_ticket" /> */}
                                <Route element={<RaiseTicket2 />} path="/ticket" />

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Rca