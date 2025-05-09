
import React from 'react'
import { useState,useEffect,lazy,Suspense } from 'react'
import { Box } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUploadIcon from '@rsuite/icons/FileUpload';
import Slide from '@mui/material/Slide';
const MDPTool=lazy(()=>import('./MDPTool'))
const OverAll=lazy(()=>import('./Dashboard/OverAll'))
const Tables=lazy(()=>import('./Tables/Tables'))
const UploadData=lazy(()=>import('./UploadData/UploadData'))



const Mdp = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const navigate = useNavigate()

    useEffect(()=>{
        document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

    },[])

    return (
        <>
            <Box style={{ marginTop: '60px' }}>
                <Grid container spacing={2}>
                    <Slide direction="down" in={true} timeout={800} mountOnEnter unmountOnExit>
                    <Grid item xs={0} md={2} sx={{}}>
                        <div style={{ position: 'fixed' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: '200px', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                        <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>MDP RAN</Nav>

                                        {/* <Nav.Menu eventKey="1" placement="rightStart" title="Dashboard" icon={<DashboardIcon size="3em"/>} >
                      <Nav.Item eventKey='1-1' placement="rightStart"  onClick={() => navigate('/tools/physical_at/dashboard')}>
                        Ageing(Circle Wise)
                      </Nav.Item>

                  </Nav.Menu> */}

                                        <Nav.Item eventKey="1" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/mdp/ran/over_all')} >
                                            Over All
                                        </Nav.Item>
                                        <Nav.Item eventKey="2" placement="rightStart" icon={<DashboardIcon />} onClick={() => navigate('/tools/mdp/ran/dashboard')} >
                                            Dashboard
                                        </Nav.Item>
                                        <Nav.Item eventKey="3" placement="rightStart" icon={<FileUploadIcon />} onClick={() => navigate('/tools/mdp/ran/upload_data')} >
                                            Upload Excel
                                        </Nav.Item>


                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </div>
                    </Grid>
                    </Slide>
                    <Grid item xs={12} md={10}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route element={<MDPTool />} path="/" />
                            <Route element={< OverAll />} path="/over_all" />
                            <Route element={< Tables />} path="/dashboard" />
                            <Route element={< UploadData />} path="/upload_data" />
                        </Routes>
                    </Suspense>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}

export default Mdp