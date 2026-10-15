
import React, { Suspense, lazy } from 'react'
import { useState, useEffect } from 'react'
import { Box, Alert } from '@mui/material'
import { Grid } from '@mui/material'
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import AppSelectIcon from '@rsuite/icons/AppSelect';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ConversionIcon from '@rsuite/icons/Conversion';
import Loader from '../../Skeleton/Loader';
import './../../../App.css'
import { getDecreyptedData } from '../../utils/localstorage'


const SA_upload = lazy(() => import('./Upload/Upload'))
const SA_tool = lazy(() => import('./SA_tool'))
const UPE_GPL_ULS = lazy(() => import('./Upload/UPE_GPL_ULS'))
const ORI_gpl_macro = lazy(() => import('./Upload/ORI_gpl_macro'))
const BIH_gpl_uls = lazy(() => import('./Upload/BIH_gpl_uls'))
const BIH_gpl_macro = lazy(() => import('./Upload/BIH_gpl_macro'))
const MP_gpl_macro = lazy(() => import('./Upload/MP_gpl_macro'))
const MUM_gpl_macro = lazy(() => import('./Upload/MUM_gpl_macro'))
const WB_gpl_macro = lazy(() => import('./Upload/WB_gpl_macro'))
const MAH_gpl_macro = lazy(() => import('./Upload/MAH_gpl_macro'))
const WB_gpl_uls = lazy(() => import('./Upload/WB_gpl_uls'))
const UploadOr = lazy(() => import('./5G Scripting/UploadOr'))
const BIH_params = lazy(() => import('./GPL_Params_Tables/BIH_params'))
const MAH_params = lazy(() => import('./GPL_Params_Tables/MAH_params'))
const MUM_params = lazy(() => import('./GPL_Params_Tables/MUM_params'))
const MP_params = lazy(() => import('./GPL_Params_Tables/MP_params'))
const ORI_params = lazy(() => import('./GPL_Params_Tables/ORI_params'))
const UPE_params = lazy(() => import('./GPL_Params_Tables/UPE_params'))
const WB_params = lazy(() => import('./GPL_Params_Tables/WB_params'))

// ======== PROTECTED ROUTE COMPONENT ========
const ProtectedRoute = ({ children, hasAccess }) => {
    if (!hasAccess) {
        return (
            <Box sx={{ p: 3, mt: 3 }}>
                <Alert severity="error">
                    Access Denied: You don't have permission to access this section.
                    Please contact your administrator if you believe this is an error.
                </Alert>
            </Box>
        );
    }
    return children;
};

const SA = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states, setStates] = useState([])
    const navigate = useNavigate()

    // ======== GET USER TYPES ========
    const userTypeString = getDecreyptedData('user_type');
    const userTypes = userTypeString ? userTypeString.split(",") : [];

    // ======== CHECK USER PERMISSIONS ========
    const has5GScripting = userTypes.includes('5G_SCR') || userTypes.includes('Admin');
    const isPARAM = userTypes?.includes('GPL_PARAM')

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>

            <Box style={{ marginTop: '60px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={0} md={2} sx={{}}>
                        <Box style={{ position: 'fixed', width: '16.5%' }}>
                            <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
                                <Sidenav.Body>
                                    <Nav activeKey={activeKey} onSelect={setActiveKey} >
                                        <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>5G GPL Tool</Nav>

                                        {/* ====== GPL MACRO SECTION ====== */}
                                          {isPARAM && (
                                                <>
                                        <Nav.Menu eventKey="4" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="Macro GPL Parameter" >
                                            <Nav.Item eventKey="4-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/upe_params')}>
                                                UPE Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/ori_params')}>
                                                ORI Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/bih_params')}>
                                                BIH Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-4" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mp_params')}>
                                                MP Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-5" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mum_params')}>
                                                MUM Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-6" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/wb_params')}>
                                                WB Params
                                            </Nav.Item>
                                            <Nav.Item eventKey="4-7" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mah_params')}>
                                                MAH Params
                                            </Nav.Item>
                                        </Nav.Menu> 
                                        </>
)}
                                        


                                        <Nav.Menu eventKey="1" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="GPL Macro Audit" >

                                            <Nav.Item eventKey="1-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/sa_upload_xml')}>
                                                UPE GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/ORI_gpl_macro')}>
                                                ORI GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/BIH_gpl_macro')}>
                                                BIH GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-4" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MP_gpl_macro')}>
                                                MP GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-5" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MUM_gpl_macro')}>
                                                MUM GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-6" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/WB_gpl_macro')}>
                                                WB GPL Macro
                                            </Nav.Item>
                                            <Nav.Item eventKey="1-7" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MAH_gpl_macro')}>
                                                MAH GPL Macro
                                            </Nav.Item>

                                        </Nav.Menu>



                                        {/* ====== GPL ULS SECTION ====== */}

                                        {!userTypes?.includes('MACRO') &&
                                            <>
                                                <Nav.Menu eventKey="2" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="GPL ULS Audit" >
                                                    <Nav.Item eventKey="2-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/UPE_GPL_ULS')}>
                                                        UPE GPL ULS
                                                    </Nav.Item>

                                                    <Nav.Item eventKey="2-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/BIH_gpl_uls')}>
                                                        BIH GPL ULS
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="2-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/WB_gpl_uls')}>
                                                        WB GPL ULS
                                                    </Nav.Item>
                                                </Nav.Menu>

                                            </>}


                                          

                                        {/* ====== 5G SCRIPTING SECTION - RESTRICTED ====== */}
                                        {has5GScripting && (
                                            <Nav.Menu eventKey="3" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="5G Scripting" >
                                                <Nav.Item eventKey="3-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/upload_or')}>
                                                    Orissa Scripting
                                                </Nav.Item>

                                            </Nav.Menu>
                                        )}

                                    </Nav>
                                </Sidenav.Body>

                            </Sidenav>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Suspense fallback={<Loader />}>
                            <Routes>
                                {/* ====== PUBLIC ROUTES ====== */}
                                <Route element={<SA_tool />} path="/" />

                                {!userTypes?.includes('MACRO') &&
                                    <>

                                        <Route element={<UPE_GPL_ULS />} path='/UPE_GPL_ULS' />
                                        <Route element={<WB_gpl_uls />} path='/WB_gpl_uls' />
                                        <Route element={<BIH_gpl_uls />} path='/BIH_gpl_uls' />
                                    </>}


                                <Route element={<SA_upload />} path='/sa_upload_xml' />
                                <Route element={<ORI_gpl_macro />} path='/ORI_gpl_macro' />
                                <Route element={<BIH_gpl_macro />} path='/BIH_gpl_macro' />
                                <Route element={<MP_gpl_macro />} path='/MP_gpl_macro' />
                                <Route element={<MUM_gpl_macro />} path='/MUM_gpl_macro' />
                                <Route element={<WB_gpl_macro />} path='/WB_gpl_macro' />
                                <Route element={<MAH_gpl_macro />} path='/MAH_gpl_macro' />

                               {isPARAM && (
                                                <>
                                <Route element={<UPE_params />} path='/upe_params' />
                                <Route element={<ORI_params />} path='/ori_params' />
                                <Route element={<BIH_params />} path='/bih_params' />
                                <Route element={<MAH_params />} path='/mah_params' />
                                <Route element={<MUM_params />} path='/mum_params' />
                                <Route element={<MP_params />} path='/mp_params' />
                                <Route element={<WB_params />} path='/wb_params' /> 
</>)}


                                {/* ====== PROTECTED ROUTES - 5G SCRIPTING ====== */}
                                <Route
                                    element={
                                        <ProtectedRoute hasAccess={has5GScripting}>
                                            <UploadOr />
                                        </ProtectedRoute>
                                    }
                                    path='/upload_or'
                                />

                            </Routes>
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default SA


// import React, { Suspense, lazy } from 'react'
// import { useState, useEffect } from 'react'
// import { Box, Alert } from '@mui/material'
// import { Grid } from '@mui/material'
// import { Sidenav, Nav } from 'rsuite';
// import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
// import AppSelectIcon from '@rsuite/icons/AppSelect';
// import { useNavigate } from 'react-router-dom';
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import FileUploadIcon from '@rsuite/icons/FileUpload';
// import ConversionIcon from '@rsuite/icons/Conversion';
// import Loader from '../../Skeleton/Loader';
// import './../../../App.css'
// import { getDecreyptedData } from '../../utils/localstorage'
 
 
// const SA_upload = lazy(() => import('./Upload/Upload'))
// const SA_tool = lazy(() => import('./SA_tool'))
// const UPE_GPL_ULS = lazy(() => import('./Upload/UPE_GPL_ULS'))
// const ORI_gpl_macro = lazy(() => import('./Upload/ORI_gpl_macro'))
// const BIH_gpl_uls = lazy(() => import('./Upload/BIH_gpl_uls'))
// const BIH_gpl_macro = lazy(() => import('./Upload/BIH_gpl_macro'))
// const MP_gpl_macro = lazy(() => import('./Upload/MP_gpl_macro'))
// const MUM_gpl_macro = lazy(() => import('./Upload/MUM_gpl_macro'))
// const WB_gpl_macro = lazy(() => import('./Upload/WB_gpl_macro'))
// const MAH_gpl_macro = lazy(() => import('./Upload/MAH_gpl_macro'))
// const WB_gpl_uls = lazy(() => import('./Upload/WB_gpl_uls'))
// const UploadOr = lazy(() => import('./5G Scripting/UploadOr'))
// const BIH_params = lazy(() => import('./GPL_Params_Tables/BIH_params'))
// const MAH_params = lazy(() => import('./GPL_Params_Tables/MAH_params'))
// const MUM_params = lazy(() => import('./GPL_Params_Tables/MUM_params'))
// const MP_params = lazy(() => import('./GPL_Params_Tables/MP_params'))
// const ORI_params = lazy(() => import('./GPL_Params_Tables/ORI_params'))
// const UPE_params = lazy(() => import('./GPL_Params_Tables/UPE_params'))
// const WB_params = lazy(() => import('./GPL_Params_Tables/WB_params'))
 
// // ======== PROTECTED ROUTE COMPONENT ========
// const ProtectedRoute = ({ children, hasAccess }) => {
//     if (!hasAccess) {
//         return (
//             <Box sx={{ p: 3, mt: 3 }}>
//                 <Alert severity="error">
//                     Access Denied: You don't have permission to access this section.
//                     Please contact your administrator if you believe this is an error.
//                 </Alert>
//             </Box>
//         );
//     }
//     return children;
// };
 
// const SA = () => {
//     const [expanded, setExpanded] = useState(true);
//     const [activeKey, setActiveKey] = useState();
//     const [states, setStates] = useState([])
//     const navigate = useNavigate()
 
//     // ======== GET USER TYPES ========
//     const userTypeString = getDecreyptedData('user_type');
//     const userTypes = userTypeString ? userTypeString.split(",") : [];
 
//     // ======== CHECK USER PERMISSIONS ========
//     const has5GScripting = userTypes.includes('5G_SCR') || userTypes.includes('Admin');
   
//     const hasGPLParams =
//         userTypes.includes("GPL_PARAMS") || userTypes.includes("Admin");
//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
//     }, [])
 
//     return (
//         <>
 
//             <Box style={{ marginTop: '60px' }}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={0} md={2} sx={{}}>
//                         <Box style={{ position: 'fixed', width: '16.5%' }}>
//                             <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle" style={{ minHeight: "670px", height: "100vh", backgroundColor: "#006e74", marginTop: 8, borderRadius: 10 }}>
//                                 <Sidenav.Body>
//                                     <Nav activeKey={activeKey} onSelect={setActiveKey} >
//                                         <Nav style={{ fontWeight: 550, color: 'white', textAlign: 'center', fontSize: 19 }}>5G GPL Tool</Nav>
 
//                                         {/* ====== GPL MACRO SECTION ====== */}
 
 
//                                         <Nav.Menu eventKey="1" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="GPL MACRO" >
 
//                                             <Nav.Item eventKey="1-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/sa_upload_xml')}>
//                                                 UPE GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/ORI_gpl_macro')}>
//                                                 ORI GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/BIH_gpl_macro')}>
//                                                 BIH GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-4" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MP_gpl_macro')}>
//                                                 MP GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-5" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MUM_gpl_macro')}>
//                                                 MUM GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-6" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/WB_gpl_macro')}>
//                                                 WB GPL Macro
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="1-7" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/MAH_gpl_macro')}>
//                                                 MAH GPL Macro
//                                             </Nav.Item>
 
//                                         </Nav.Menu>
 
 
 
//                                         {/* ====== GPL ULS SECTION ====== */}
 
//                                         {!userTypes?.includes('MACRO') &&
//                                             <>
//                                                 <Nav.Menu eventKey="2" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="GPL ULS" >
//                                                     <Nav.Item eventKey="2-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/UPE_GPL_ULS')}>
//                                                         UPE GPL ULS
//                                                     </Nav.Item>
 
//                                                     <Nav.Item eventKey="2-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/BIH_gpl_uls')}>
//                                                         BIH GPL ULS
//                                                     </Nav.Item>
//                                                     <Nav.Item eventKey="2-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/WB_gpl_uls')}>
//                                                         WB GPL ULS
//                                                     </Nav.Item>
//                                                 </Nav.Menu>
 
//                                             </>}
 
//  {hasGPLParams && (
//                                             <Nav.Menu eventKey="4" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="GPL Params" >
//                                                 <Nav.Item eventKey="4-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/upe_params')}>
//                                                     UPE Params
//                                                 </Nav.Item>
//                                                 <Nav.Item eventKey="4-2" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/ori_params')}>
//                                                 ORI Params
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="4-3" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/bih_params')}>
//                                                 BIH Params
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="4-4" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mp_params')}>
//                                                 MP Params
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="4-5" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mum_params')}>
//                                                 MUM Params
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="4-6" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/wb_params')}>
//                                                 WB Params
//                                             </Nav.Item>
//                                             <Nav.Item eventKey="4-7" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/mah_params')}>
//                                                 MAH Params
//                                             </Nav.Item>
//                                         </Nav.Menu>
//  )}
 
//                                         {/* ====== 5G SCRIPTING SECTION - RESTRICTED ====== */}
//                                         {has5GScripting && (
//                                             <Nav.Menu eventKey="3" placement="rightStart" icon={<ConversionIcon />} className="menu-title-custom" title="5G Scripting" >
//                                                 <Nav.Item eventKey="3-1" placement="rightStart" icon={<FileUploadIcon />} className="single-item-custom" onClick={() => navigate('/tools/ix_tools/sa_slicing/upload_or')}>
//                                                     Orissa Scripting
//                                                 </Nav.Item>
 
//                                             </Nav.Menu>
//                                         )}
 
//                                     </Nav>
//                                 </Sidenav.Body>
 
//                             </Sidenav>
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={10}>
//                         <Suspense fallback={<Loader />}>
//                             <Routes>
//                                 {/* ====== PUBLIC ROUTES ====== */}
//                                 <Route element={<SA_tool />} path="/" />
 
//                                 {!userTypes?.includes('MACRO') &&
//                                     <>
 
//                                         <Route element={<UPE_GPL_ULS />} path='/UPE_GPL_ULS' />
//                                         <Route element={<WB_gpl_uls />} path='/WB_gpl_uls' />
//                                         <Route element={<BIH_gpl_uls />} path='/BIH_gpl_uls' />
//                                     </>}
 
 
//                                 <Route element={<SA_upload />} path='/sa_upload_xml' />
//                                 <Route element={<ORI_gpl_macro />} path='/ORI_gpl_macro' />
//                                 <Route element={<BIH_gpl_macro />} path='/BIH_gpl_macro' />
//                                 <Route element={<MP_gpl_macro />} path='/MP_gpl_macro' />
//                                 <Route element={<MUM_gpl_macro />} path='/MUM_gpl_macro' />
//                                 <Route element={<WB_gpl_macro />} path='/WB_gpl_macro' />
//                                 <Route element={<MAH_gpl_macro />} path='/MAH_gpl_macro' />
 
 
//                                  {/* <Route element={<UPE_params />} path='/upe_params' />
//                                 <Route element={<ORI_params />} path='/ori_params' />
//                                 <Route element={<BIH_params />} path='/bih_params' />
//                                 <Route element={<MAH_params />} path='/mah_params' />
//                                 <Route element={<MUM_params />} path='/mum_params' />
//                                 <Route element={<MP_params />} path='/mp_params' />
//                                 <Route element={<WB_params />} path='/wb_params' /> */}

//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <UPE_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/upe_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <ORI_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/ori_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <BIH_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/bih_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <MAH_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/mah_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <MUM_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/mum_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <MP_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/mp_params'
//                                 />
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={hasGPLParams}>
//                                             <WB_params />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/wb_params'
//                                 />
 
  
 
//                                 {/* ====== PROTECTED ROUTES - 5G SCRIPTING ====== */}
//                                 <Route
//                                     element={
//                                         <ProtectedRoute hasAccess={has5GScripting}>
//                                             <UploadOr />
//                                         </ProtectedRoute>
//                                     }
//                                     path='/upload_or'
//                                 />
 
//                             </Routes>
//                         </Suspense>
//                     </Grid>
//                 </Grid>
//             </Box>
//         </>
//     )
// }
 
// export default SA