import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import Divider from '@mui/material/Divider';
import ImportIcon from '@rsuite/icons/Import';
import CreditCardPlusIcon from '@rsuite/icons/CreditCardPlus';
import DashboardIcon from '@rsuite/icons/Dashboard';
import { getDecreyptedData } from '../../../Components/utils/localstorage';
import ListIcon from '@rsuite/icons/List';
import './../../../App.css'
import FolderIcon from '@rsuite/icons/Folder';
import { Admin } from '@rsuite/icons';
import { use } from 'react';
import Loader from '../../Skeleton/Loader';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import SendToDashboardIcon from '@rsuite/icons/SendToDashboard';



const IX_VI_ScriptingTool = lazy(() => import("./IX_VI_ScriptingTool"));

const UPE_NT = lazy(() => import("./Circle Scripting/UPE Scripting/UPE_NT"))
const UPE_HPSC = lazy(() => import("./Circle Scripting/UPE Scripting/UPE_HPSC"))

const HR_NT = lazy(() => import("./Circle Scripting/HRY Scripting/HR_NT"))
const HR_HPSC = lazy(() => import("./Circle Scripting/HRY Scripting/HR_HPSC"))

const MUM_Hpscfdd = lazy(() => import("./Circle Scripting/MUM Scripting/MUM_Hpscfdd"))
const MUM_Hpsctdd = lazy(() => import("./Circle Scripting/MUM Scripting/MUM_Hpsctdd"))



const IX_VI_Scripting = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const navigate = useNavigate()
    const [menuButton, setMenuButton] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    //  const classes = useStyles();
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
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>VI Scripting</Nav>
                                            <Divider component="li" sx={{ backgroundColor: 'white' }} />

                                            <Nav.Menu eventKey="1" title="UPE Scripting" icon={<ListIcon />} placement="rightStart" className="menu-title-custom">
                                                <Nav.Item eventKey="1-1" placement="rightStart" className="single-item-custom" icon={< FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/UPE_NT'); show(); setMenuButton(true) }}>
                                                    NT
                                                </Nav.Item>
                                                <Nav.Item eventKey="1-2" placement="rightStart" className="single-item-custom" icon={< FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/UPE_HPSC'); show(); setMenuButton(true) }}>
                                                    HPSC
                                                </Nav.Item>
                                            </Nav.Menu>

                                            <Nav.Menu eventKey="2" title="HRY Scripting" icon={<ListIcon />} placement="rightStart" className="menu-title-custom">

                                                <Nav.Item eventKey="2-1" placement="rightStart" className="single-item-custom" icon={< FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/HR_NT'); show(); setMenuButton(true) }}>
                                                    NT
                                                </Nav.Item>
                                                <Nav.Item eventKey="2-2" placement="rightStart" className="single-item-custom" icon={< FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/HR_HPSC'); show(); setMenuButton(true) }}>
                                                    HPSC
                                                </Nav.Item>
                                            </Nav.Menu>

                                            <Nav.Menu eventKey="3" title="MUM Scripting" icon={<ListIcon />} placement="rightStart" className="menu-title-custom">
                                                <Nav.Item eventKey="3-1" placement="rightStart" className="single-item-custom" icon={<FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/MUM_Hpscfdd'); show(); setMenuButton(true) }}>
                                                    HPSC FDD
                                                </Nav.Item>
                                                <Nav.Item eventKey="3-2" placement="rightStart" className="single-item-custom" icon={<FileUploadIcon style={{}} />} onClick={() => { navigate('/tools/ix_tools/ix_vi_scripting/MUM_Hpsctdd'); show(); setMenuButton(true) }}>
                                                    HPSC TDD
                                                </Nav.Item>
                                            </Nav.Menu>

                                          

                                        </Nav>
                                    </Sidenav.Body>
                                </Sidenav>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>


                        <Suspense fallback={<Loader />}>
                            <Routes>
                                <Route path="/" element={<IX_VI_ScriptingTool />} />

                                <Route path="/UPE_NT" element={<UPE_NT />} />
                                <Route path="/UPE_HPSC" element={<UPE_HPSC />} />


                                <Route path='/HR_NT' element={<HR_NT />} />
                                <Route path='/HR_HPSC' element={<HR_HPSC />} />


                                <Route path='/MUM_Hpscfdd' element={<MUM_Hpscfdd />} />
                                <Route path='/MUM_Hpsctdd' element={<MUM_Hpsctdd />} />
                              

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default IX_VI_Scripting