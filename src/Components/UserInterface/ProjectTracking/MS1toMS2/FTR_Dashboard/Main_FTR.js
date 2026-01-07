import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import FTR_Table from './FTR_Table';
import Soft_AT_FTR from './Soft_AT_FTR';
import Phy_At_FTR from './Phy_At_FTR';


const Main_FTR = () => {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])
    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/relocation_tracking') }}>Relocation Tracking</Link>
                    <Typography color='text.primary'>FTR Dashboard</Typography>
                </Breadcrumbs>
            </div>
            <Box>
                {/* <RfaiIntegration /> */}
            </Box>
            <Box>
                <FTR_Table />
            </Box>
            <Box>
                <Soft_AT_FTR />
            </Box>
            <Box>
                <Phy_At_FTR />
            </Box>
            {/* <Box>
                  <Integration />
              </Box>
              <Box>
                  <Ms1 />
              </Box> */}

        </>
    )
}

export default Main_FTR