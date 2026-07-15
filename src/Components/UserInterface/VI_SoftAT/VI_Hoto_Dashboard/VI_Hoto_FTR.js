// import React, { useEffect } from 'react'
// import { Box } from '@mui/material'
// import { Breadcrumbs, Link, Typography } from "@mui/material";
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import { useNavigate } from "react-router-dom";


// import { MemoVIHotoFtr } from './VIHotoFtr';
// import { MemoFTR_Dashboard } from './FTR_Dashboard';

// const VI_Hoto_FTR = () => {
//     const navigate = useNavigate()

//     useEffect(() => {
//         document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

//     }, [])
//     return (<>
//         <div style={{ margin: 5, marginLeft: 10 }}>
//             <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
//                 <Link underline="hover" onClick={() => navigate("/tools")}>
//                     Tools
//                 </Link>
//                 <Link underline="hover" onClick={() => navigate("/tools/ix_tools")}>
//                     IX Tools
//                 </Link>
//                 <Link underline="hover" onClick={() => navigate("/tools/ix_tools/Vi_Hoto")}>
//                     VI Tracker
//                 </Link>
//                 <Typography color='text.primary'>VI_Hoto_FTR</Typography>
//             </Breadcrumbs>
//         </div>

//         <Box>
//             <MemoFTR_Dashboard />
//         </Box>
//         <Box>

//             <MemoVIHotoFtr />
//         </Box>

//     </>

//     )
// }

// export default VI_Hoto_FTR

import React, { useEffect, useState } from 'react'
import { Box, alpha } from '@mui/material'
import { Breadcrumbs, Link, Typography, Chip, Paper } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsightsIcon from '@mui/icons-material/Insights';
import { useNavigate } from "react-router-dom";


import { MemoVIHotoFtr } from './VIHotoFtr';
import { MemoFTR_Dashboard } from './FTR_Dashboard';

const HEADER_GRADIENT_FROM = "#1e3c72";

// ── Toggle options: which view to show ──
const VIEW_TABS = [
    { key: "dashboard", label: "FTR Dashboard", icon: DashboardIcon },
    { key: "hoto", label: "FTR Analysis", icon: InsightsIcon  },
];

const ViewToggle = ({ active, onChange }) => (
    <Paper elevation={0} sx={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1,
        px: 2, py: 1.2, mb: 2, borderRadius: "14px",
        border: "1px solid #e8ecf0", bgcolor: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}>
        {VIEW_TABS.map((tab) => {
            const isActive = active === tab.key;
            const Icon = tab.icon;
            return (
                <Chip
                    key={tab.key}
                    icon={<Icon sx={{ fontSize: 17, color: isActive ? "#fff" : HEADER_GRADIENT_FROM }} />}
                    label={tab.label}
                    onClick={() => onChange(tab.key)}
                    sx={{
                        fontWeight: 700,
                        fontSize: 13,
                        px: 0.5,
                        py: 2.1,
                        borderRadius: "20px",
                        cursor: "pointer",
                        border: `1.5px solid ${HEADER_GRADIENT_FROM}`,
                        bgcolor: isActive ? HEADER_GRADIENT_FROM : "#fff",
                        color: isActive ? "#fff" : HEADER_GRADIENT_FROM,
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: isActive ? HEADER_GRADIENT_FROM : alpha(HEADER_GRADIENT_FROM, 0.08) },
                    }}
                />
            );
        })}
    </Paper>
);

const VI_Hoto_FTR = () => {
    const navigate = useNavigate()
    const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "hoto"

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (<>
        <div style={{ margin: 5, marginLeft: 10 }}>
            <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                <Link underline="hover" onClick={() => navigate("/tools")}>
                    Tools
                </Link>
                <Link underline="hover" onClick={() => navigate("/tools/ix_tools")}>
                    IX Tools
                </Link>
                <Link underline="hover" onClick={() => navigate("/tools/ix_tools/Vi_Hoto")}>
                    VI Tracker
                </Link>
                <Typography color='text.primary'>VI_Hoto_FTR</Typography>
            </Breadcrumbs>
        </div>

        <Box sx={{ px: 1.5 }}>
            <ViewToggle active={activeView} onChange={setActiveView} />
        </Box>

        {activeView === "dashboard" ? (
            <Box>
                <MemoFTR_Dashboard />
            </Box>
        ) : (
            <Box>
                <MemoVIHotoFtr />
            </Box>
        )}

    </>

    )
}

export default VI_Hoto_FTR