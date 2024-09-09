import React from 'react'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Slide from '@mui/material/Slide';

const AcceptanceSummary = () => {
    return (
        <>
            <Slide
                direction='left'
                in='true'
                // style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <div>
                    <div style={{ margin: 5, marginLeft: 10 }}>
                        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                            <Link underline="hover" href='/tools'>Tools</Link>
                            <Link underline="hover" href='/tools/mcom_physical_at'>Physical AT</Link>
                            <Typography color='text.primary'>Acceptance Summary</Typography>
                        </Breadcrumbs>
                    </div>
                </div>
            </Slide>

        </>

    )
}

export default AcceptanceSummary