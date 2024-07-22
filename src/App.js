import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Box } from '@mui/material'
import Home from "./Components/UserInterface/Home";
import ViewSite from "./Components/UserInterface/DPR/ViewSite";
import LoginPage from "./Components/UserInterface/LoginPage";
import Tools from "./Components/UserInterface/Tools";
import Dpr from "./Components/UserInterface/DPR/Dpr";
import HomePage from "./Components/UserInterface/HomePage";
import Vendor from "./Components/UserInterface/VANDOR_MANAGMENT/Vendor"
import Trends from './Components/UserInterface/Trend/Trends'
import SoftAT from './Components/UserInterface/SOFT AT/SoftAT'
import Physical_At from "./Components/UserInterface/PHYSICAL AT/Physical_At";
import Performance_At from "./Components/UserInterface/PERFORMANE AT/Performance_At";
import Wpr from "./Components/UserInterface/WPR/Wpr";
import Degrow from "./Components/UserInterface/DEGROW/Degrow";
import File_Merge from "./Components/UserInterface/FileMerge/File_Merge";
import Schedular from "./Components/UserInterface/Schedular/Schedular";
import Mdp from "./Components/UserInterface/MDP/RAN/Mdp";
import MdpUBR from "./Components/UserInterface/MDP/UBR/Ubr";
import Others from "./Components/UserInterface/OTHERS/Others";
import Inventory from "./Components/UserInterface/Inventory/Inventory";
import MDPTool from "./Components/UserInterface/MDP/MDPTool";
import Mcomms from "./Components/UserInterface/Mcomm-scripting/Mcomms";
import Soft_at_Rejection from "./Components/UserInterface/Soft_AT_Rejection/Soft_AT_Rejection";
import Profile from "./Components/UserInterface/Profile/Profile";
import ProfileSetting from "./Components/UserInterface/profileSetting/ProfileSetting";
import Ubr_Soft_at_Rejection from "./Components/UserInterface/UBR_Soft_At_Rejection/Ubr_Soft_AT_Rejection";
import Zero_rna from "./Components/UserInterface/Zero_RNA_Payload/Zero_rna";
import Error from "./Components/csss/Error";
import CatsTracker from "./Components/UserInterface/Cats Tracker/CatsTracker";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Audit from "./Components/UserInterface/Audit Tool/Audit";
import FDD from "./Components/UserInterface/Audit Tool/FDD/FDD";
import TDD from "./Components/UserInterface/Audit Tool/TDD/TDD";
import CircleInputs from "./Components/UserInterface/Employee_skills/CircleInputs";
import Integration from "./Components/UserInterface/Integration_Tool/Integration";
import Rca from "./Components/UserInterface/RCA Tool/Rca";
import G2Audit from "./Components/UserInterface/Audit Tool/G2Audit/G2Audit";
import { useNavigate,Navigate} from 'react-router-dom';
const queryClient = new QueryClient()

const userType = (JSON.parse(localStorage.getItem('user_type'))?.split(","))


function App() {


  const chackToken = localStorage.getItem("tokenKey")

  console.log('usertype', userType)


  const ProtectedRoute = ({ element: Component, allowedUserTypes, userType, ...rest }) => {
    // console.log(allowedUserTypes, userType,allowedUserTypes.includes(userType))
    return userType.some(type => allowedUserTypes.some(group => group.toLowerCase().includes(type.toLowerCase()))) ? (
      <Component {...rest} />
    ) :<Navigate to="/error" />
  };



  return (
    <QueryClientProvider client={queryClient}>
      <div >
        <Router>
          <Box style={{ position: 'static' }}><Home /></Box>
          {/* <ReactQueryDevtools initialIsOpen={false} position="bottom-right" /> */}
          {/* <Routes>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<Tools />} path={`/tools/*`} />
            <Route element={<HomePage />} path="/" />
            <Route element={<Profile />} path="/profile/*" />
            {userType == 'Admin' && <>
              <Route element={<ViewSite />} path="/view_site" />
              <Route element={<Dpr />} path="/dpr/*" />
              <Route element={<Trends />} path="/trends/*" />
              <Route element={<Vendor />} path="/tools/vendor/*" />
              <Route element={<SoftAT />} path="/tools/soft_at/*" />
              <Route element={<Physical_At />} path="/tools/physical_at/*" />
              <Route element={<Performance_At />} path="/tools/performance_at/*" />
              <Route element={<Wpr />} path="/tools/wpr/*" />
              <Route element={<Degrow />} path="/tools/de-grow/*" />
              <Route element={<File_Merge />} path="/tools/file_merge" />
              <Route element={<Schedular />} path="/tools/schedular/*" />
              <Route element={<Others />} path="/tools/others/*" />
              <Route element={<Degrow />} path="/tools/others/degrow/*" />
              <Route element={<CircleInputs />} path="/tools/circle_inputs/*" />
              <Route element={<CatsTracker />} path="/tools/cats_tracker/*" />
              <Route element={<Inventory />} path="/tools/inventory/*" />
              <Route element={<Zero_rna />} path="/tools/zero_RNA_payload/*" />
              <Route element={<Audit />} path="/tools/audit/*" />
              <Route element={<FDD />} path="/tools/audit/FDD/*" />
              <Route element={<TDD />} path="/tools/audit/TDD/*" />
              <Route element={<MDPTool />} path="/tools/mdp/*" />
              <Route element={<Mdp />} path="/tools/mdp/ran/*" />
              <Route element={<MdpUBR />} path="/tools/mdp/ubr/*" />
              <Route element={<Mcomms />} path="/tools/mcom-scripting/*" />
              <Route element={<Soft_at_Rejection />} path="/tools/soft_at_rejection/*" />
              <Route element={<ProfileSetting />} path="/profileSetting/*" />
              <Route element={<Ubr_Soft_at_Rejection />} path="/tools/UBR_soft_at_Tracker/*" />
              <Route element={<Integration />} path="/tools/Integration/*" />
            </>}
            {userType == 'Soft_At_Team' && <>
              <Route element={<SoftAT />} path="/tools/soft_at/*" />
              <Route element={<Soft_at_Rejection />} path="/tools/soft_at_rejection/*" />
            </>}
            {userType == 'IX' && <>
              <Route element={<Integration />} path="/tools/Integration/*" />
            </>}

          </Routes> */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tools/*" element={<Tools />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/:id" element={<Error />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/view_site" element={<ProtectedRoute element={ViewSite} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/dpr/*" element={<ProtectedRoute element={Dpr} allowedUserTypes={['central','admin']} userType={userType} />} />
            <Route path="/trends/*" element={<ProtectedRoute element={Trends} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/vendor/*" element={<ProtectedRoute element={Vendor} allowedUserTypes={['central','admin']} userType={userType} />} />
            <Route path="/tools/soft_at/*" element={<ProtectedRoute element={SoftAT} allowedUserTypes={['soft_at_team','admin']} userType={userType} />} />
            <Route path="/tools/physical_at/*" element={<ProtectedRoute element={Physical_At} allowedUserTypes={['central','admin']} userType={userType} />} />
            <Route path="/tools/performance_at/*" element={<ProtectedRoute element={Performance_At} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/wpr/*" element={<ProtectedRoute element={Wpr} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/de-grow/*" element={<ProtectedRoute element={Degrow} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/tools/file_merge" element={<ProtectedRoute element={File_Merge} allowedUserTypes={['admin']} userType={userType} />} />
            <Route path="/tools/schedular/*" element={<ProtectedRoute element={Schedular} allowedUserTypes={['admin']} userType={userType} />} />
            <Route path="/tools/others/*" element={<ProtectedRoute element={Others} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/tools/others/degrow/*" element={<ProtectedRoute element={Degrow} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/tools/circle_inputs/*" element={<ProtectedRoute element={CircleInputs} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/tools/cats_tracker/*" element={<ProtectedRoute element={CatsTracker} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/inventory/*" element={<ProtectedRoute element={Inventory} allowedUserTypes={['central','circle','admin']} userType={userType} />} />
            <Route path="/tools/zero_RNA_payload/*" element={<ProtectedRoute element={Zero_rna} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/audit/*" element={<ProtectedRoute element={Audit} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/audit/FDD/*" element={<ProtectedRoute element={FDD} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/audit/TDD/*" element={<ProtectedRoute element={TDD} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/audit/2G_audit/*" element={<ProtectedRoute element={G2Audit} allowedUserTypes={['quality','admin']} userType={userType} />} />
            <Route path="/tools/mdp/*" element={<ProtectedRoute element={MDPTool} allowedUserTypes={['central','circle','admin']} userType={userType} />} />
            <Route path="/tools/mdp/ran/*" element={<ProtectedRoute element={Mdp} allowedUserTypes={['central','circle','admin']} userType={userType} />} />
            <Route path="/tools/mdp/ubr/*" element={<ProtectedRoute element={MdpUBR} allowedUserTypes={['central','circle','admin']} userType={userType} />} />
            <Route path="/tools/mcom-scripting/*" element={<ProtectedRoute element={Mcomms} allowedUserTypes={['central','circle','admin']} userType={userType} />} />
            <Route path="/tools/soft_at_rejection/*" element={<ProtectedRoute element={Soft_at_Rejection} allowedUserTypes={['soft_at_team','admin']} userType={userType} />} />
            <Route path="/profileSetting/*" element={<ProtectedRoute element={ProfileSetting} allowedUserTypes={['Admin']} userType={userType} />} />
            <Route path="/tools/UBR_soft_at_Tracker/*" element={<ProtectedRoute element={Ubr_Soft_at_Rejection} allowedUserTypes={['admin']} userType={userType} />} />
            <Route path="/tools/Integration/*" element={<ProtectedRoute element={Integration} allowedUserTypes={['quality','soft_at_team','admin','IX']} userType={userType} />} />
            <Route path="/tools/rca/*" element={<ProtectedRoute element={Rca} allowedUserTypes={['quality','admin']} userType={userType} />} />
          </Routes>

        </Router>


      </div>
    </QueryClientProvider>
  );
}

function SoftAt_Element() {
  if (userType === 'Admin' || userType === 'Soft_At_Team') {
    return (<Outlet />)
  }
  else {
    return <div style={{ marginTop: 20 }}>You do not have access to this pasge !</div>
  }

}

export default App;
