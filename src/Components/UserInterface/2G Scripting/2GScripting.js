// import React, { useEffect, Suspense, lazy } from 'react'
// import { useState } from 'react'
// import { Box, Button } from '@mui/material'
// import { Grid } from '@mui/material'
// import { Sidenav, Nav } from 'rsuite';
// import Collapse from '@mui/material/Collapse';
// import SettingsIcon from '@mui/icons-material/Settings';
// import ChangeListIcon from '@rsuite/icons/ChangeList';
// import { useNavigate } from 'react-router-dom'
// import { Routes, Route } from "react-router-dom";

// const G2ScriptingTool = lazy(() => import('./2GScriptingTool'))
// const G2Script        = lazy(() => import('./2GScript/2GScript'))

// // ── Shared gradient & style tokens (matches the 2G Scripting Tool card) ───────
// const SIDEBAR_GRADIENT = 'linear-gradient(160deg, #1a3a6b 0%, #1565c0 45%, #00b4d8 100%)';
// const ACTIVE_GRADIENT  = 'linear-gradient(90deg, rgba(0,180,216,0.25) 0%, rgba(0,180,216,0.05) 100%)';
// const GLOW_BORDER      = '2px solid rgba(0, 180, 216, 0.55)';
// const TITLE_GRADIENT   = 'linear-gradient(90deg, #eaeae4 30%, #00e5ff 100%)';

// const G2Scripting = () => {
//     const [expanded, setExpanded]   = useState(true);
//     const [activeKey, setActiveKey] = useState();
//     const [states]                  = useState(60)
//     const [checked, setChecked]     = useState(true)

//     const navigate = useNavigate()

//     const show = () => setChecked(prev => !prev)

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
//     }, [])

//     // ── Sidebar inner content (reused in mobile + desktop) ───────────────────
//     const SidebarContent = () => (
//         <Sidenav
//             expanded={expanded}
//             defaultOpenKeys={[]}
//             appearance="subtle"
//             style={{
//                 minHeight: '670px',
//                 height: '100vh',
//                 background: SIDEBAR_GRADIENT,
//                 borderRadius: '14px',
//                 marginTop: 8,
//                 boxShadow: '4px 0 24px rgba(0,100,200,0.18)',
//                 overflow: 'hidden',
//                 position: 'relative',
//             }}
//         >
//             {/* Subtle top glow orb */}
//             <div style={{
//                 position: 'absolute',
//                 top: '-40px',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 width: '180px',
//                 height: '180px',
//                 borderRadius: '50%',
//                 background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)',
//                 pointerEvents: 'none',
//             }} />

//             <Sidenav.Body>
//                 <Nav activeKey={activeKey} onSelect={setActiveKey}>

//                     {/* ── Title ─────────────────────────────────────────── */}
//                     <div style={{
//                         padding: '22px 16px 14px',
//                         textAlign: 'center',
//                         borderBottom: '1px solid rgba(255,255,255,0.12)',
//                         marginBottom: '8px',
//                     }}>
//                         <span style={{
//                             fontWeight: 700,
//                             fontSize: '18px',
//                             letterSpacing: '0.04em',
//                             background: TITLE_GRADIENT,
//                             WebkitBackgroundClip: 'text',
//                             WebkitTextFillColor: 'transparent',
//                             backgroundClip: 'text',
//                         }}>
//                             2G Scripting
//                         </span>
//                         {/* Accent underline */}
//                         <div style={{
//                             margin: '6px auto 0',
//                             width: '120px',
//                             height: '2px',
//                             borderRadius: '2px',
//                             background: 'linear-gradient(90deg, #ebeadf, #00e5ff)',
//                         }} />
//                     </div>

//                     {/* ── Nav Item ──────────────────────────────────────── */}
//                     <Nav.Item
//                         eventKey="3-2"
//                         placement="rightStart"
//                         icon={<ChangeListIcon style={{ color: '#00e5ff', fontSize: '16px' }} />}
//                         onClick={() => {
//                             navigate('/tools/2g_scripting/2g_script');
//                             show();
//                         }}
//                         style={{
//                             margin: '4px 7px',
//                             borderRadius: '40px',
//                             color: activeKey === '3-2' ? '#fff' : 'rgba(255,255,255,0.78)',
//                             fontWeight: activeKey === '3-2' ? 600 : 400,
//                             fontSize: '15px',
//                             background: activeKey === '3-2' ? ACTIVE_GRADIENT : 'transparent',
//                             border: activeKey === '3-2' ? GLOW_BORDER : '2px solid transparent',
//                             transition: 'all 0.25s ease',
//                             letterSpacing: '0.02em',
//                         }}
//                     >
//                         2G Script
//                     </Nav.Item>

//                 </Nav>
//             </Sidenav.Body>

//             {/* Bottom version badge */}
//             <div style={{
//                 position: 'absolute',
//                 bottom: '16px',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 whiteSpace: 'nowrap',
//                 fontSize: '10px',
//                 color: 'rgba(255,255,255,0.3)',
//                 letterSpacing: '0.08em',
//                 textTransform: 'uppercase',
//             }}>
//                 2G Tools v1.0
//             </div>
//         </Sidenav>
//     )

//     return (
//         <Box style={{ marginTop: states, transition: 'all 1s ease' }}>
//             <Grid container spacing={2}>

//                 {/* ── Sidebar column ──────────────────────────────────── */}
//                 <Grid item xs={0} md={2}>

//                     {/* Mobile sidebar */}
//                     <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
//                         <Collapse in={!checked}>
//                             <Button
//                                 onClick={show}
//                                 style={{
//                                     position: 'absolute',
//                                     top: '60px',
//                                     background: SIDEBAR_GRADIENT,
//                                     borderRadius: '0 8px 8px 0',
//                                     minWidth: '36px',
//                                     padding: '8px',
//                                 }}
//                             >
//                                 <SettingsIcon style={{ color: 'white' }} />
//                             </Button>
//                         </Collapse>
//                         <Collapse in={checked} orientation="horizontal" timeout="auto">
//                             <Box style={{
//                                 width: 240,
//                                 position: 'fixed',
//                                 zIndex: 10,
//                             }}>
//                                 <SidebarContent />
//                             </Box>
//                         </Collapse>
//                     </Box>

//                     {/* Desktop sidebar */}
//                     <Box sx={{ display: { xs: 'none', md: 'inherit' } }}>
//                         <Box style={{ position: 'fixed', width: '16.5%' }}>
//                             <SidebarContent />
//                         </Box>
//                     </Box>
//                 </Grid>

//                 {/* ── Main content ────────────────────────────────────── */}
//                 <Grid item xs={12} md={10}>
//                     <Suspense fallback={
//                         <div style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             height: '60vh',
//                             color: '#1565c0',
//                             fontSize: '15px',
//                             gap: '10px',
//                         }}>
//                             <div style={{
//                                 width: '20px', height: '20px',
//                                 borderRadius: '50%',
//                                 border: '2px solid #00b4d8',
//                                 borderTopColor: 'transparent',
//                                 animation: 'spin 0.7s linear infinite',
//                             }} />
//                             Loading…
//                         </div>
//                     }>
//                         <Routes>
//                             <Route element={<G2ScriptingTool />} path="/" />
//                             <Route element={<G2Script />} path="/2g_script" />
//                         </Routes>
//                     </Suspense>
//                 </Grid>

//             </Grid>
//         </Box>
//     )
// }

// export default G2Scripting
import React, { useEffect, Suspense, lazy } from 'react'
import { useState } from 'react'
import PageIcon from '@rsuite/icons/Page';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import { Box, Button } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ViewsUnauthorizeIcon from '@rsuite/icons/ViewsUnauthorize';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import DocPassIcon from '@rsuite/icons/DocPass';
import CheckOutlineIcon from '@rsuite/icons/CheckOutline';
import ChangeListIcon from '@rsuite/icons/ChangeList';
import ChangeList from '@rsuite/icons/ChangeList';  

const G2ScriptingTool = lazy(() => import('./2GScriptingTool'))
const G2Script = lazy(() => import('./2GScript/2GScript'))

const G2Scripting = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState(60)
    const [checked, setChecked] = useState(true)
    const [menuButton, setMenuButton] = useState(false)
    const [scrollTop, setScrollTop] = useState(0);

    const navigate = useNavigate()
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
                        <Box sx={{ display: { xs: 'inherit', md: 'none' } }}>
                            <Collapse in={!checked}>
                                <Button onClick={() => { show() }} style={{ position: 'absolute', top: '60px', backgroundColor: '#223354' }}><SettingsIcon style={{ color: "white" }} /></Button>
                            </Collapse>
                            <Collapse in={checked} orientation="horizontal" timeout={'auto'}>
                                <Box sx={{ width: 240, minHeight: "670px", height: "100hv", backgroundColor: "#223354", borderRadius: 5, position: 'fixed', zIndex: 10 }}>
                                    <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
                                        <Sidenav.Body>
                                            <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ width: 'auto', minHeight: "670px", height: "100hv", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                                <Nav style={{ fontWeight: 600, color: 'white', textAlign: 'center', fontSize: 20 }}>2G Scripting</Nav>

                                                <Nav.Item eventKey="3-2" placement="rightStart" onClick={() => { navigate('/tools/2g_scripting/2g_script'); show(); setMenuButton(true) }}>
                                                    2G Script
                                                </Nav.Item>
                                            </Nav>
                                        </Sidenav.Body>

                                    </Sidenav>
                                </Box>
                            </Collapse>

                        </Box>
                        {/* THIS VIEW FOR PC  */}
                        <Box sx={{ display: { xs: 'none', md: 'inherit' } }} >
                            <Box sx={{ position: 'fixed', width: '16.5%' }} >
                                <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#223354", marginTop: 8, borderRadius: 10 }}>
                                    <Sidenav.Body>
                                        <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                            <Nav style={{ fontWeight: 500, color: 'white', textAlign: 'center', fontSize: 20 }}>2G Scripting</Nav>

                                            <Nav.Item
                                                eventKey="3-2"
                                                placement="rightStart"
                                                icon={<ChangeListIcon />}
                                                onClick={() => {
                                                    navigate('/tools/2g_scripting/2g_script');
                                                    show();
                                                    setMenuButton(true);
                                                }}
                                            >
                                                2G Script
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
                                <Route element={<G2ScriptingTool />} path="/" />
                                <Route element={<G2Script />} path="/2g_script" />


                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default G2Scripting
