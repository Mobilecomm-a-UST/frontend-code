import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Breadcrumbs, Link, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TableContainer from '@mui/material/TableContainer';
import { useStyles } from '../../ToolsCss'
import Paper from '@mui/material/Paper';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import axios from 'axios';
import { getDecreyptedData } from '../../../utils/localstorage';
import Swal from 'sweetalert2';
import { ServerURL } from '../../../services/FetchNodeServices';

const SurveyDashboard = () => {
  const navigate = useNavigate()
  return (
    <>
      <style>{"th{border:1px solid black;}"}</style>
      <Box m={1} ml={2}>
        <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
          <Link underline="hover" onClick={() => navigate("/tools/full_site_dismantle")}>Full Site Dismantle</Link>
          <Typography color="text.primary">Survey Dashboard</Typography>
        </Breadcrumbs>
      </Box>
      <Box>
        
      </Box>
    </>
  )
}

export default SurveyDashboard