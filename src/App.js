import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNavigate, Navigate } from 'react-router-dom';
import { Box } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from "./Components/UserInterface/Home";
import HomePage from "./Components/UserInterface/HomePage";
import LoginPage from "./Components/UserInterface/LoginPage";
import Tools from "./Components/UserInterface/Tools";
import { getDecreyptedData } from "./Components/utils/localstorage";




const ViewSite = lazy(() => import('./Components/UserInterface/DPR/ViewSite'));
const Dpr = lazy(() => import('./Components/UserInterface/DPR/Dpr'))
const Vendor = lazy(() => import('./Components/UserInterface/VANDOR_MANAGMENT/Vendor'))
const Trends = lazy(() => import('./Components/UserInterface/Trend/Trends'));
const SoftAT = lazy(() => import('./Components/UserInterface/SOFT AT/SoftAT'));
const Physical_At = lazy(() => import('./Components/UserInterface/PHYSICAL AT/Physical_At'));
const Performance_At = lazy(() => import('./Components/UserInterface/PERFORMANE AT/Performance_At'));
const Wpr = lazy(() => import('./Components/UserInterface/WPR/Wpr'));
const Degrow = lazy(() => import('./Components/UserInterface/DEGROW/Degrow'));
const File_Merge = lazy(() => import('./Components/UserInterface/FileMerge/File_Merge'));
const Schedular = lazy(() => import('./Components/UserInterface/Schedular/Schedular'));
const Mdp = lazy(() => import('./Components/UserInterface/MDP/RAN/Mdp'));
const MdpUBR = lazy(() => import('./Components/UserInterface/MDP/UBR/Ubr'));
const Others = lazy(() => import('./Components/UserInterface/OTHERS/Others'));
const Inventory = lazy(() => import('./Components/UserInterface/Inventory/Inventory'));
const MDPTool = lazy(() => import('./Components/UserInterface/MDP/MDPTool'));
const Mcomms = lazy(() => import('./Components/UserInterface/Mcomm-scripting/Mcomms'));
const Soft_at_Rejection = lazy(() => import('./Components/UserInterface/Soft_AT_Rejection/Soft_AT_Rejection'));
const Profile = lazy(() => import('./Components/UserInterface/Profile/Profile'));
const ProfileSetting = lazy(() => import('./Components/UserInterface/profileSetting/ProfileSetting'));
const Ubr_Soft_at_Rejection = lazy(() => import('./Components/UserInterface/UBR_Soft_At_Rejection/Ubr_Soft_AT_Rejection'));
const Zero_rna = lazy(() => import('./Components/UserInterface/Zero_RNA_Payload/Zero_rna'));
const Error = lazy(() => import('./Components/csss/Error'));
const CatsTracker = lazy(() => import('./Components/UserInterface/Cats Tracker/CatsTracker'));
const Audit = lazy(() => import('./Components/UserInterface/Audit Tool/Audit'));
const FDD = lazy(() => import('./Components/UserInterface/Audit Tool/FDD/FDD'));
const TDD = lazy(() => import('./Components/UserInterface/Audit Tool/TDD/TDD'));
const CircleInputs = lazy(() => import('./Components/UserInterface/Employee_skills/CircleInputs'));
const Integration = lazy(() => import('./Components/UserInterface/Integration_Tool/Integration'));
const Rca = lazy(() => import('./Components/UserInterface/RCA Tool/Rca'));
const G2Audit = lazy(() => import('./Components/UserInterface/Audit Tool/G2Audit/G2Audit'));
const IntegrationRead = lazy(() => import('./Components/UserInterface/Integration_Read/IntegrationRead'));
const SoftAtTem = lazy(() => import('./Components/UserInterface/SoftAt Temp/SoftAT'));
const McomePhycical = lazy(() => import('./Components/UserInterface/McomPhysicalAt/McomePhycical'))
const Nscripter = lazy(() => import('./Components/UserInterface/Nomenclature Scripter/Nscripter'));
const Dma = lazy(() => import('./Components/UserInterface/DailyMonetringAlarm/Dma'));
const Gpl = lazy(() => import('./Components/UserInterface/GPL_Audit/GPL'));
const LKFStatus = lazy(() => import('./Components/UserInterface/LKF Status/LKF'))
const MobinateVsCate = lazy(() => import('./Components/UserInterface/Mobinat_vs_cats/MobinateVsCats'))
const DegrowDismantle = lazy(() => import('./Components/UserInterface/DegrowDismantle/DegrowDismantle'))
const KPImatrix = lazy(() => import('./Components/UserInterface/KPI Matrix/KPImatrix'))
const RelocationPayload = lazy(() => import('./Components/UserInterface/RelocationPayload/Relocation'))
const ProjectTracking = lazy(() => import('./Components/UserInterface/ProjectTracking/PTracking'))
const IxTools = lazy(() => import('./Components/UserInterface/Integration_Tools/Ix_Tools'))
const Vi_Integration = lazy(() => import('./Components/UserInterface/Vi_Integration_tool/Vi_Integration'))
const MicrowaveSoftAt = lazy(() => import('./Components/UserInterface/Microwave/Microwave'))
const NTDTool = lazy(() => import('./Components/UserInterface/NewTowerDeployment/NTD'))

const queryClient = new QueryClient()

// const userType = (JSON.parse(localStorage.getItem('user_type'))?.split(","))


function App() {

  const [userType, setUserType] = useState()



  // const chackToken = localStorage.getItem("tokenKey")

  // console.log('usertype', userType)


  const ProtectedRoute = ({ element: Component, allowedUserTypes, userType, ...rest }) => {
    // console.log(allowedUserTypes, userType,allowedUserTypes.includes(userType))
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    return userTypes?.some(type => allowedUserTypes?.some(group => group.toLowerCase() === type.toLowerCase())) ? (
      <Component {...rest} />
    ) : <Navigate to="/error" />
  };


  useEffect(() => {
    setUserType(getDecreyptedData('user_type')?.split(","))
  }, [])


  return (
    <QueryClientProvider client={queryClient}>
      <div >
        <Router>
          <Box style={{ position: 'static' }}><Home /></Box>

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tools/*" element={<Tools />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/:id" element={<Error />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/view_site" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={ViewSite} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/dpr/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Dpr} allowedUserTypes={['central', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/trends/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Trends} allowedUserTypes={['quality', 'admin', 'quality-s', 'trend_tool']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/vendor/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Vendor} allowedUserTypes={['central', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/soft_at/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={SoftAT} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/physical_at/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Physical_At} allowedUserTypes={['central', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/performance_at/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Performance_At} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/wpr/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Wpr} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/de-grow/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Degrow} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/file_merge" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={File_Merge} allowedUserTypes={['admin', 'quality', 'quality-s', 'ran']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/schedular/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Schedular} allowedUserTypes={['admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/others/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Others} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/others/degrow/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Degrow} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/circle_inputs/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={CircleInputs} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/cats_tracker/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={CatsTracker} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/inventory/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Inventory} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/zero_RNA_payload/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Zero_rna} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/audit/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Audit} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/audit/FDD/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={FDD} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/audit/TDD/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={TDD} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/audit/2G_audit/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={G2Audit} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mdp/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={MDPTool} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mdp/ran/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Mdp} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mdp/ubr/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={MdpUBR} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mcom-scripting/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Mcomms} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/soft_at_rejection/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Soft_at_Rejection} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/profileSetting/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={ProfileSetting} allowedUserTypes={['Admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/UBR_soft_at_Tracker/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Ubr_Soft_at_Rejection} allowedUserTypes={['admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/Integration/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Integration} allowedUserTypes={['soft_at_team', 'admin', 'IX']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/IX_Tracker/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={IntegrationRead} allowedUserTypes={['quality', 'IX_reader', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/rca/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Rca} allowedUserTypes={['quality', 'admin', 'quality-s']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/softAt/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={SoftAtTem} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mcom_physical_at/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={McomePhycical} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/nomenclature_scriptor/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Nscripter} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/dma/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Dma} allowedUserTypes={['soft_at_team', 'admin']} userType={userType} />
              </Suspense>
            } />
            <Route path="/tools/mobile_network_integration/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Gpl} allowedUserTypes={['admin']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/lkf_status/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={LKFStatus} allowedUserTypes={['admin']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/mobinet_vs_cats/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={MobinateVsCate} allowedUserTypes={['admin', 'ran']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/degrow_dismantle/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={DegrowDismantle} allowedUserTypes={['admin', 'ran']} userType={userType} />
              </Suspense>
            } />

            {/* <Route path="/tools/kpi_matrix/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={KPImatrix} allowedUserTypes={['admin']} userType={userType} />
              </Suspense>
            } /> */}

            <Route path="/tools/relocation_payload_tracker/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={RelocationPayload} allowedUserTypes={['admin', 'quality-s', 'quality']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/relocation_tracking/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={ProjectTracking} allowedUserTypes={['admin', 'RLT', 'RLT_reader']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/ix_tools/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={IxTools} allowedUserTypes={['admin', 'IX', 'VI_IX', 'VI_IX_reader', 'soft_at_team']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/ix_tools/vi_integration/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={Vi_Integration} allowedUserTypes={['admin', 'VI_IX', 'VI_IX_reader']} userType={userType} />
              </Suspense>
            } />

            <Route path="/tools/microwave_soft_at/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={MicrowaveSoftAt} allowedUserTypes={['admin', 'microwave']} userType={userType} />
              </Suspense>
            } />

             <Route path="/tools/ntd/*" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProtectedRoute element={NTDTool} allowedUserTypes={['admin', 'NDT']} userType={userType} />
              </Suspense>
            } />

          </Routes>

        </Router>
        {/* <Box sx={{ position: 'fixed',
           bottom: 0, 
           left: 0,
            zIndex: 100, 
            // '&:hover': { display: 'none' } 
          }}
            >
          <img src="/assets/happy-new-year-2026.png" alt="Happy New Year 2026" style={{ width: "220px", height: "140px" }} />
        </Box> */}

      </div>
    </QueryClientProvider>
  );
}



export default App;
