import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useNavigate, Navigate } from 'react-router-dom';
import { Box } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from "./Components/UserInterface/Home";
import HomePage from "./Components/UserInterface/HomePage";
import LoginPage from "./Components/UserInterface/LoginPage";
import Tools from "./Components/UserInterface/Tools";
// import ViewSite from "./Components/UserInterface/DPR/ViewSite";
const ViewSite = lazy(() => import('./Components/UserInterface/DPR/ViewSite'));
// import Dpr from "./Components/UserInterface/DPR/Dpr";
const Dpr = lazy(() => import('./Components/UserInterface/DPR/Dpr'))
// import Vendor from "./Components/UserInterface/VANDOR_MANAGMENT/Vendor"
const Vendor = lazy(() => import('./Components/UserInterface/VANDOR_MANAGMENT/Vendor'))
// import Trends from './Components/UserInterface/Trend/Trends'
const Trends = lazy(() => import('./Components/UserInterface/Trend/Trends'));
// import SoftAT from './Components/UserInterface/SOFT AT/SoftAT'
const SoftAT = lazy(() => import('./Components/UserInterface/SOFT AT/SoftAT'));
// import Physical_At from "./Components/UserInterface/PHYSICAL AT/Physical_At";
const Physical_At = lazy(() => import('./Components/UserInterface/PHYSICAL AT/Physical_At'));
// import Performance_At from "./Components/UserInterface/PERFORMANE AT/Performance_At";
const Performance_At = lazy(() => import('./Components/UserInterface/PERFORMANE AT/Performance_At'));
// import Wpr from "./Components/UserInterface/WPR/Wpr";
const Wpr = lazy(() => import('./Components/UserInterface/WPR/Wpr'));
// import Degrow from "./Components/UserInterface/DEGROW/Degrow";
const Degrow = lazy(() => import('./Components/UserInterface/DEGROW/Degrow'));
// import File_Merge from "./Components/UserInterface/FileMerge/File_Merge";
const File_Merge = lazy(() => import('./Components/UserInterface/FileMerge/File_Merge'));
// import Schedular from "./Components/UserInterface/Schedular/Schedular";
const Schedular = lazy(() => import('./Components/UserInterface/Schedular/Schedular'));
// import Mdp from "./Components/UserInterface/MDP/RAN/Mdp";
const Mdp = lazy(() => import('./Components/UserInterface/MDP/RAN/Mdp'));
// import MdpUBR from "./Components/UserInterface/MDP/UBR/Ubr";
const MdpUBR = lazy(() => import('./Components/UserInterface/MDP/UBR/Ubr'));
// import Others from "./Components/UserInterface/OTHERS/Others";
const Others = lazy(() => import('./Components/UserInterface/OTHERS/Others'));
// import Inventory from "./Components/UserInterface/Inventory/Inventory";
const Inventory = lazy(() => import('./Components/UserInterface/Inventory/Inventory'));
// import MDPTool from "./Components/UserInterface/MDP/MDPTool";
const MDPTool = lazy(() => import('./Components/UserInterface/MDP/MDPTool'));
// import Mcomms from "./Components/UserInterface/Mcomm-scripting/Mcomms";
const Mcomms = lazy(() => import('./Components/UserInterface/Mcomm-scripting/Mcomms'));
// import Soft_at_Rejection from "./Components/UserInterface/Soft_AT_Rejection/Soft_AT_Rejection";
const Soft_at_Rejection = lazy(() => import('./Components/UserInterface/Soft_AT_Rejection/Soft_AT_Rejection'));
// import Profile from "./Components/UserInterface/Profile/Profile";
const Profile = lazy(() => import('./Components/UserInterface/Profile/Profile'));
// import ProfileSetting from "./Components/UserInterface/profileSetting/ProfileSetting";
const ProfileSetting = lazy(() => import('./Components/UserInterface/profileSetting/ProfileSetting'));
// import Ubr_Soft_at_Rejection from "./Components/UserInterface/UBR_Soft_At_Rejection/Ubr_Soft_AT_Rejection";
const Ubr_Soft_at_Rejection = lazy(() => import('./Components/UserInterface/UBR_Soft_At_Rejection/Ubr_Soft_AT_Rejection'));
// import Zero_rna from "./Components/UserInterface/Zero_RNA_Payload/Zero_rna";
const Zero_rna = lazy(() => import('./Components/UserInterface/Zero_RNA_Payload/Zero_rna'));
// import Error from "./Components/csss/Error";
const Error = lazy(() => import('./Components/csss/Error'));
// import CatsTracker from "./Components/UserInterface/Cats Tracker/CatsTracker";
const CatsTracker = lazy(() => import('./Components/UserInterface/Cats Tracker/CatsTracker'));
// import Audit from "./Components/UserInterface/Audit Tool/Audit";
const Audit = lazy(() => import('./Components/UserInterface/Audit Tool/Audit'));
// import FDD from "./Components/UserInterface/Audit Tool/FDD/FDD";
const FDD = lazy(() => import('./Components/UserInterface/Audit Tool/FDD/FDD'));
// import TDD from "./Components/UserInterface/Audit Tool/TDD/TDD";
const TDD = lazy(() => import('./Components/UserInterface/Audit Tool/TDD/TDD'));
// import CircleInputs from "./Components/UserInterface/Employee_skills/CircleInputs";
const CircleInputs = lazy(() => import('./Components/UserInterface/Employee_skills/CircleInputs'));
// import Integration from "./Components/UserInterface/Integration_Tool/Integration";
const Integration = lazy(() => import('./Components/UserInterface/Integration_Tool/Integration'));
// import Rca from "./Components/UserInterface/RCA Tool/Rca";
const Rca = lazy(() => import('./Components/UserInterface/RCA Tool/Rca'));
// import G2Audit from "./Components/UserInterface/Audit Tool/G2Audit/G2Audit";
const G2Audit = lazy(() => import('./Components/UserInterface/Audit Tool/G2Audit/G2Audit'));
// import IntegrationRead from "./Components/UserInterface/Integration_Read/IntegrationRead";
const IntegrationRead = lazy(() => import('./Components/UserInterface/Integration_Read/IntegrationRead'));

const queryClient = new QueryClient()

const userType = (JSON.parse(localStorage.getItem('user_type'))?.split(","))


function App() {


  const chackToken = localStorage.getItem("tokenKey")

  console.log('usertype', userType)


  const ProtectedRoute = ({ element: Component, allowedUserTypes, userType, ...rest }) => {
    // console.log(allowedUserTypes, userType,allowedUserTypes.includes(userType))
    return userType.some(type => allowedUserTypes.some(group => group.toLowerCase() === type.toLowerCase())) ? (
      <Component {...rest} />
    ) : <Navigate to="/error" />
  };



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
                <ProtectedRoute element={Trends} allowedUserTypes={['quality', 'admin']} userType={userType} />
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
              <ProtectedRoute element={Performance_At} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/wpr/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Wpr} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/de-grow/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Degrow} allowedUserTypes={['Admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/file_merge" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={File_Merge} allowedUserTypes={['admin']} userType={userType} />
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
              <ProtectedRoute element={CatsTracker} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/inventory/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Inventory} allowedUserTypes={['central', 'circle', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/zero_RNA_payload/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Zero_rna} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/audit/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Audit} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/audit/FDD/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={FDD} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/audit/TDD/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={TDD} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/audit/2G_audit/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={G2Audit} allowedUserTypes={['quality', 'admin']} userType={userType} />
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
              <ProtectedRoute element={Integration} allowedUserTypes={['quality', 'soft_at_team', 'admin', 'IX']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/IX_Tracker/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={IntegrationRead} allowedUserTypes={['IX_reader']} userType={userType} />
            </Suspense>
          } />
          <Route path="/tools/rca/*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={Rca} allowedUserTypes={['quality', 'admin']} userType={userType} />
            </Suspense>
          } />
          </Routes>

        </Router>


      </div>
    </QueryClientProvider>
  );
}



export default App;
