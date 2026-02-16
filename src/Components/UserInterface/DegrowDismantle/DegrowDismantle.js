import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import { getDecreyptedData } from '../../../Components/utils/localstorage';
import ListIcon from '@rsuite/icons/List';
import './../../../App.css'
import FolderIcon from '@rsuite/icons/Folder';


const DegrowTool = lazy(() => import('./DegrowTool'))
const DegrowForm = lazy(() => import('./Degrow/DegrowForm'))
const FileManager = lazy(() => import('./File_manager/FileManager'))
const DismantleItemList = lazy(() => import('./Dismantle_Item_List/DismantleItemList'))



const DegrowDismantle = () => {
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
                        {/* <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Nomenclature Scriptor</Nav>
                                                <Nav.Item eventKey="2" placement="rightStart" icon={<ChangeListIcon />} onClick={() => { navigate('/tools/nomenclature_scriptor/generate_script'); show(); setMenuButton(true) }}>
                                                    Genetate Script
                                                </Nav.Item>
                                                <Nav.Menu eventKey="3" placement="rightStart" title="NOM Audit" icon={<DocPassIcon />}>
                                                    <Nav.Item eventKey="3-1" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit_dashboard'); show(); setMenuButton(true) }}>
                                                        Dashboard
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/nomenclature_scriptor/nom_audit'); show(); setMenuButton(true) }}>
                                                        Pre-Post Audit
                                                    </Nav.Item>
                                                </Nav.Menu>


                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box> */}
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={['1']} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>Degrow Dismantle</Nav>

                                            <Nav.Item eventKey="1" placement="rightStart" className="single-item-custom" icon={<FolderIcon style={{}} />} onClick={() => { navigate('/tools/degrow_dismantle/file_manager'); show(); setMenuButton(true) }}>
                                                File Manager
                                            </Nav.Item>
                                            <Nav.Item eventKey="2" placement="rightStart" className="single-item-custom" icon={<ListIcon style={{}} />} onClick={() => { navigate('/tools/degrow_dismantle/dismantle_item_list'); show(); setMenuButton(true) }}>
                                                Dismantle Item List
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
                                <Route element={<DegrowTool />} path="/" />
                                <Route element={<DegrowForm />} path="/degrow" />
                                <Route element={<FileManager />} path="/file_manager" />
                                <Route element={<DismantleItemList />} path="/dismantle_item_list" />


                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default DegrowDismantle