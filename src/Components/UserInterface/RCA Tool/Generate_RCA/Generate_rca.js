import React, { useCallback } from 'react'
import { Box, Breadcrumbs, Link, Typography, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from 'react-router-dom';
import { useGet } from '../../../Hooks/GetApis'
import { useQuery } from '@tanstack/react-query';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import RcaOutput from './RcaOutput';
import FileDownload from './FileDownload';

import { CsvBuilder } from 'filefy';

const Generate_rca = () => {
    const colorType = ['#B0EBB4', '#A0DEFF', '#FF9F66', '#ECB176', '#CDE8E5']
    const { makeGetRequest } = useGet();
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const userType = (JSON.parse(localStorage.getItem('user_type'))?.split(","))
    const { data, isPending } = useQuery({
        queryKey: ['rca_generate_date'],
        queryFn: async () => {
            action(isPending)
            const response = await makeGetRequest('RCA_TOOL/latest_record_date/');
            if (response) {
                action(false)
                const keys = Object.keys(response);
                const values = Object.values(response);
                const resultArray = keys.map((key, index) => ({ [key]: values[index] }));
                return resultArray
            }
            else {
                action(false)
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })


    // console.log('data' , data)




    const Dashboard = useCallback(({ datas, color }) => {
        // console.log('aaa', datas)
        let name = Object.keys(datas)[0].replaceAll('_', ' ').toUpperCase();
        let value = Object.values(datas);
        // console.log('check data' , data)
        function convertDate(dateStr) {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return (
            <Box sx={{ height: '15vh', width: '45vh', padding: 1.5, borderRadius: 1.5, boxShadow: " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px", backgroundColor: color, textAlign: 'center' }}>
                <Box sx={{ fontWeight: 600, fontSize: '16px', color: "black", textAlign: 'left' }}>{name}</Box>
                <Box sx={{ fontWeight: 600, fontSize: '24px', color: "black", fontFamily: 'cursive' }}>{convertDate(value)}</Box>
                {/* <Box sx={{ color: "black", textAlign: 'left' }}><span style={{ fontWeight: 600, fontSize: '14px' }}>From-</span>{convertDate(data?.from_integration_date)}</Box>
                <Box sx={{ color: "black", textAlign: 'left' }}> <span style={{ fontWeight: 600 }}>To-</span>{convertDate(data?.to_integration_date)}</Box> */}
            </Box>
        );
    }, []);



    return (<>
        <div>
            <div style={{ margin: 10, marginLeft: 10 }}>
                <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/rca') }}>RCA Tool</Link>
                    <Typography color='text.primary'>Generate RCA</Typography>
                </Breadcrumbs>
            </div>
            <div style={{ padding: '5px', display: 'flex', justifyContent: 'space-between', flexWrap: "wrap", flexDirection: 'row', gap: 20, marginTop: '10px' }}>
                {data?.map((item, index) => (
                    <Dashboard datas={item} color={colorType[index]} />
                ))}

            </div>
            {!userType.includes('Circle_Rno') && <Box sx={{ marginTop: 4 }}>
                <FileDownload />
            </Box>}

            <Box sx={{ marginTop: 4 }}>
                <RcaOutput />
            </Box>

        </div>
        {loading}
    </>

    )
}

export default Generate_rca