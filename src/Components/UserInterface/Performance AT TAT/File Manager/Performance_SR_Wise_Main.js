// import React, { useEffect } from 'react'
// import { Box } from '@mui/material'
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";

// import { MemoPerformance_SR_Wise } from './Performance_SR_Wise'
// import { MemoPerformance_SR_Wise2 } from './Performance_SR_Wise2';
// import { MemoPerformance_SR_Wise_summary3 } from './Performance_SR_Wise_summary3';
// import Performance_SR_Wise from './Performance_SR_Wise';

// const Performance_SR_Wise_Main = () => {
//     const navigate = useNavigate()

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])
//     return (<>
//      <div style={{ margin: 5, marginLeft: 10 }}>
//                     <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                         <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
//                         <Link underline="hover" onClick={() => { navigate('/tools/performance_at_tat') }}>Performace AT</Link>
//                         <Typography color='text.primary'>Performance SR wise</Typography>
//                     </Breadcrumbs>
//                 </div>
    
//         <Box>
//             <MemoPerformance_SR_Wise2 />
//         </Box>
//             <Box>
//                 <MemoPerformance_SR_Wise />
//         </Box>
//          <Box>
//                 <MemoPerformance_SR_Wise_summary3 />
//         </Box>
        

//     </>

//     )
// }

// export default Performance_SR_Wise_Main

import React, { useEffect, useState, useCallback } from 'react'
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

import { MemoPerformance_SR_Wise } from './Performance_SR_Wise'
import { MemoPerformance_SR_Wise2 } from './Performance_SR_Wise2';
import { MemoPerformance_SR_Wise_summary3 } from './Performance_SR_Wise_summary3';

// ── Toggle styling, matching the teal/navy theme used across the SR Wise dashboards ──
const toggleWrapSt = {
    background: "#fdece0",
    borderRadius: "10px",
    padding: "4px",
    display: "flex",
    gap: "4px",
};

const toggleBtnSt = {
    textTransform: "none",
    fontWeight: 600,
    fontSize: 13,
    border: "none",
    borderRadius: "8px !important",
    padding: "6px 16px",
    color: "#5c4632",
    "&.Mui-selected": {
        background: "#1e2a5e",
        color: "#fff",
    },
    "&.Mui-selected:hover": {
        background: "#1e2a5e",
    },
};

const Performance_SR_Wise_Main = () => {
    const navigate = useNavigate()

    // ── Which of the 3 dashboards is currently shown ──────────────────────
    const [activeDashboard, setActiveDashboard] = useState("sr_wise_2");

    // ── Shared date range: captured from the Detailed Report tab, handed to
    // the AT Ageing Summary tab so both dashboards always show the same window ──
    const [sharedStartDate, setSharedStartDate] = useState(null);
    const [sharedEndDate, setSharedEndDate]     = useState(null);

    const handleDetailedDateRangeChange = useCallback((start, end) => {
        setSharedStartDate(start);
        setSharedEndDate(end);
    }, []);

    const handleDashboardChange = (_e, newValue) => {
        if (newValue) setActiveDashboard(newValue);
    };

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
     <div style={{ margin: 5, marginLeft: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/performance_at_tat') }}>Performace AT</Link>
                        <Typography color='text.primary'>Performance SR wise</Typography>
                    </Breadcrumbs>
                </div>

        {/* ── Dashboard Toggle ── */}
        <Box display="flex" justifyContent="center" my={2}>
            <ToggleButtonGroup
                value={activeDashboard}
                exclusive
                onChange={handleDashboardChange}
                sx={toggleWrapSt}
            >
                <ToggleButton value="sr_wise_2" sx={toggleBtnSt}>SR Wise Overview</ToggleButton>
                <ToggleButton value="sr_wise" sx={toggleBtnSt}>Detailed AT Report</ToggleButton>
                <ToggleButton value="ageing_summary" sx={toggleBtnSt}>AT Ageing Summary</ToggleButton>
            </ToggleButtonGroup>
        </Box>

        {/* ── Only the selected dashboard renders ── */}
        {activeDashboard === "sr_wise_2" && (
            <Box>
                <MemoPerformance_SR_Wise2 />
            </Box>
        )}

        {activeDashboard === "sr_wise" && (
            <Box>
                {/* Reports its currently selected date range up via onDateRangeChange,
                    which is what the Ageing Summary tab below reuses */}
                <MemoPerformance_SR_Wise onDateRangeChange={handleDetailedDateRangeChange} />
            </Box>
        )}

        {activeDashboard === "ageing_summary" && (
            <Box>
                {/* Mirrors whatever range was last selected in the Detailed AT Report tab.
                    If that tab was never visited yet, sharedStartDate/EndDate are null and
                    the component falls back to the current month on its own. */}
                <MemoPerformance_SR_Wise_summary3 startDate={sharedStartDate} endDate={sharedEndDate} />
            </Box>
        )}

    </>

    )
}

export default Performance_SR_Wise_Main