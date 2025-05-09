import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import CountUp from 'react-countup';
import CountYesNo from './CountYesNo';
import { getData } from '../../../../services/FetchNodeServices'
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog'
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash'


const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']
const MDashboard = () => {
    const {navigate} = useNavigate()
    const { action, loading } = useLoadingDialog()
    const [oldSiteId, setOldSiteId] = useState([])
    const [newSiteId, setNewSiteId] = useState([])
    const [circleData, setCircleData] = useState([])
    const [oemData, setOemData] = useState([])
    const [tableData, setTableData] = useState([])


    const fetchApiData = async () => {
        // const formData = new FormData()
        action(true)
        let responce = await getData('IntegrationTracker/relocation/tracker/');
        if (responce) {
            action(false)
            console.log('responce  data', responce)

            setOldSiteId(_.uniq(_.map(responce, 'old_site_id')))
            setNewSiteId(_.uniq(_.map(responce, 'new_site_id')))
            setCircleData(_.uniq(_.map(responce, 'circle')))
            setOemData(_.uniq(_.map(responce, 'OEM')))
            setTableData(responce)

        } else {
            action(false)

        }
    }

    useEffect(() => {
        fetchApiData()

    }, [])

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <div style={{ margin: 10 }}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/Integration') }}>IX Tracker</Link>
                        <Typography color='text.primary'>Relocation Chart</Typography>
                    </Breadcrumbs>
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: "wrap", flexDirection: 'row', gap: 1, marginBottom: 2 }}>
                    {/* // OEM Count */}
                    <Box sx={{ height: 'auto', width: '35vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: `${colorType[3]}`, textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total OEM</Box>
                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={oemData.length} duration={6} /></Box>
                        {/* <Box sx={{ color: "black", textAlign: 'left' }}>jjjjj</Box> */}
                        {/* // <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box> */}
                    </Box>
                    {/* // circle Count */}
                    <Box sx={{ height: 'auto', width: '35vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: `${colorType[2]}`, textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total Circles</Box>
                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={circleData.length} duration={6} /></Box>
                        {/* <Box sx={{ color: "black", textAlign: 'left' }}>jjjjj</Box> */}
                        {/* // <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box> */}
                    </Box>

                    {/* // old site */}
                    <Box sx={{ height: 'auto', width: '35vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: `${colorType[0]}`, textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total Old Site ID</Box>
                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={oldSiteId.length} duration={6} /></Box>
                        {/* <Box sx={{ color: "black", textAlign: 'left' }}>jjjjj</Box> */}
                        {/* // <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box> */}
                    </Box>
                    {/* // New site */}
                    <Box sx={{ height: 'auto', width: '35vh', cursor: 'pointer', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: `${colorType[1]}`, textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>Total New Site ID</Box>
                        <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}><CountUp end={newSiteId.length} duration={6} /></Box>
                        {/* <Box sx={{ color: "black", textAlign: 'left' }}>jjjjj</Box> */}
                        {/* // <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data.to_integration_date)}</Box> */}
                    </Box>
                </Box>
                <Box>
                    {tableData && <CountYesNo totalTable={tableData} circleData={circleData} />}
                </Box>

            </div>
            {loading}
        </>

    )
}

export default MDashboard