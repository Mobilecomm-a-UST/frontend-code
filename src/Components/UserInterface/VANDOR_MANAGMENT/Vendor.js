

import React, { useEffect } from 'react'
import { useState } from 'react'

import { Box } from '@mui/material'
import {Grid} from '@mui/material'
import { Sidenav, Nav} from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import FileUploadIcon from '@rsuite/icons/FileUpload';
import ListIcon from '@rsuite/icons/List';
import DetailIcon from '@rsuite/icons/Detail';
import { useNavigate } from 'react-router-dom'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import VendorTool from './VendorTool'
import UploadReport from  "./CIRCLE TEAM/UPLOAD_REPORT/UploadReport"
import ViewReport from "./CIRCLE TEAM/VIEW_REPORT/ViewReport"
import Vendor_PO_Approval from "./VENDOR PO APPROVAL/Vendor PO Approve/Vendor_PO_Approval"
import Vendor_OP_Approval_Status from './VENDOR PO APPROVAL/Vendor PO Approve/Vendor_OP_Approval_Status'
import UploadReportStatus from "./CIRCLE TEAM/UPLOAD_REPORT/UploadReportStatus"
import VendorPoApproveView from "./VENDOR PO APPROVAL/Vendor PO Approve View/VendorPoApproveView";
import PeoplesIcon from '@rsuite/icons/Peoples';
import OperatePeopleIcon from '@rsuite/icons/OperatePeople';
import AllUploadReport from './ALLOCATE PO/UPLOAD_REPORT/AllUploadReport'
import AllUploadReportStatus from './ALLOCATE PO/UPLOAD_REPORT/AllUploadReportStatus'
import AllViewReport from './ALLOCATE PO/VIEW_REPORT/AllViewReport'
import BranchIcon from '@rsuite/icons/Branch';

const Vendor = () => {
    const [expanded, setExpanded] = useState(true);
    const [activeKey, setActiveKey] = useState();
    const [states,setStates] =  useState([])

    const navigate=useNavigate()


   useEffect(()=>{
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
   },[])
  return (
    <>

    <Box style={{marginTop:'70px'}}>

        <Grid container spacing={1}>
            <Grid item xs={2} >
            <div style={{position:'fixed'}}>
      <Sidenav expanded={expanded} defaultOpenKeys={[]} appearance="subtle">
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey} style={{ minHeight:"670px",height:"100vh",backgroundColor:"#223354",marginTop:8,borderRadius:10 }}>
          <Nav style={{fontWeight:600,color:'white',textAlign:'center',fontSize:20}}>Vendor TOOL</Nav>
          <Nav.Menu eventKey="1" placement="rightStart" title="Circle Team" icon={<PeoplesIcon size="3em"/>}>
            <Nav.Item eventKey="1-1" icon={<FileUploadIcon/>} onClick={()=>navigate('/tools/vendor/upload_report')}>
               Upload Report
            </Nav.Item>
            <Nav.Item eventKey="1-2" icon={<DetailIcon/>} onClick={()=>navigate('/tools/vendor/view_report')}>
               View Report
            </Nav.Item>
            </Nav.Menu>
            <Nav.Menu eventKey="2" placement="rightStart" title="Vendor PO Approval" icon={<OperatePeopleIcon size="3em"/>}>
            <Nav.Item eventKey="2-2" icon={<DetailIcon/>} onClick={()=>navigate('/tools/vendor/vendor_po_approve_view')}>
            View Report
            </Nav.Item>
              <Nav.Item eventKey="2-1" icon={<FileUploadIcon/>} onClick={()=>navigate('/tools/vendor/vendor_po_approval')}>
               Upload Report
            </Nav.Item>
            </Nav.Menu>
            <Nav.Menu eventKey="3" placement="rightStart" title="Allocate PO " icon={<BranchIcon size="3em"/>}>
            <Nav.Item eventKey="3-2" icon={<DetailIcon/>} onClick={()=>navigate('/tools/vendor/allocate_view_report')}>
            View Report
            </Nav.Item>
            <Nav.Item eventKey="3-1" icon={<FileUploadIcon/>} onClick={()=>navigate('/tools/vendor/allocate_po_upload')}>
               Upload Report
            </Nav.Item>
            </Nav.Menu>

            </Nav>
        </Sidenav.Body>

      </Sidenav>
    </div>
            </Grid>
            <Grid item xs={10}>
            <div >



        <Routes>
          <Route element={<VendorTool/>} path="/" />
          <Route element={<UploadReport/>} path="/upload_report/*"/>
          <Route element={<ViewReport/>} path="/view_report"/>
          <Route element={<Vendor_PO_Approval/>} path="/vendor_po_approval/*"/>
          <Route element={<Vendor_OP_Approval_Status/>} path="/vendor_po_approval/status"/>
          <Route element={<UploadReportStatus/>} path="/upload_report/upload_report_status"/>
          <Route element={<VendorPoApproveView/>} path="/vendor_po_approve_view"/>
          <Route element={<AllUploadReport/>} path="/allocate_po_upload/*"/>
          <Route element={<AllUploadReportStatus/>} path="/allocate_po_upload/status"/>
          <Route element={<AllViewReport/>} path="/allocate_view_report"/>
        </Routes>

    </div>

            </Grid>
        </Grid>
    </Box>
    </>
  )
}

export default Vendor