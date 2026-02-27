import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Breadcrumbs, Link, Typography, Button
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import TableContainer from '@mui/material/TableContainer';
import { useStyles } from '../../ToolsCss'
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import axios from 'axios';
import { getDecreyptedData } from '../../../utils/localstorage';
import Swal from 'sweetalert2';
import { ServerURL } from '../../../services/FetchNodeServices';


const ShowAllDismantleItem = () => {
    const [siteId, setSiteId] = useState('')
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const [siteData, setSiteData] = useState([])
    const classes = useStyles()
    // console.log('user circle ', getDecreyptedData("user_circle"))

    // console.log('siteData', siteData)


    // const handleSubmitSite = async (e) => {
    //     e.preventDefault()
    //     action(true)
    //     try {

    //         const formData = new FormData();
    //         formData.append('circle', formData.circle);
    //         formData.append('siteId', formData.siteId);
    //         const response = await axios.post
    //             (`${ServerURL}/degrow_dismental/mobinet_data_fetch/`, formData, {
    //                 headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
    //             });

    //         action(false)
    //         // setDismantleList(response?.data?.data)
    //         console.log('response data ', response)
    //         setSelectCircle(formData.circle)
    //         setSiteId(formData.siteId)
    //         Swal.fire({
    //             icon: "success",
    //             title: "Done",
    //             text: `This Site-ID (${siteId}) Found in database`,
    //         });


    //     } catch (error) {
    //         action(false)
    //         Swal.fire({
    //             icon: "error",
    //             title: "Error",
    //             text: ` ${error.response?.data?.error || error.message}`,
    //         });
    //     }
    // }

    const fetchSiteData = async () => {
        action(true)
        try {
            let formData = new FormData();
            formData.append('circle', getDecreyptedData("user_circle"));

            const response = await axios.post(`${ServerURL}/degrow_dismental/fetch_site_status/`, formData, {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
            });
            action(false)
            setSiteData(response?.data?.data || [])

        } catch (error) {
            action(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }
    }

    const handleSurvey = async (siteId, circle) => {
        action(true)
        try {

            let formData = new FormData();
            formData.append('circle', circle);
            formData.append('siteId', siteId);
            const responce = await axios.post(`${ServerURL}/degrow_dismental/mobinet_data_fetch_from_database/`, formData, {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
            });
            action(false)
            console.log('response data ', responce)
            localStorage.setItem("DismantleSurveyData", JSON.stringify({ tableData: responce?.data?.data || [], siteId: siteId, circle: circle }))
            if (responce?.data?.data) {
                navigate(`/tools/degrow_dismantle/survey_site_list/${siteId}`)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "No Data",
                    text: `No survey data found for Site-ID (${siteId})`,
                });
            }
            // navigate(`/tools/degrow_dismantle/survey_site_list/${siteId}`)

        } catch (error) {
            action(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });

        }
        // navigate(`/tools/degrow_dismantle/survey_site_list/${siteId}`)
    }

    useEffect(() => {
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;

        fetchSiteData()

    }, []);

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/degrow_dismantle")}>Degrow Dismantle</Link>
                    <Typography color="text.primary">Survey Sites List</Typography>
                </Breadcrumbs>
            </Box>
            <Box
                sx={{
                    m: 1,
                    ml: 2,
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}
            >
                {/* Total Sites */}
                <Box
                    sx={{
                        p: 2,
                        minWidth: 220,
                        backgroundColor: '#223354',
                        color: 'white',
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography variant="subtitle2">Total Sites</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {siteData.length}
                    </Typography>
                </Box>

                {/* Survey Completed */}
                <Box
                    sx={{
                        p: 2,
                        minWidth: 220,
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography variant="subtitle2">Survey Completed</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {siteData.filter(item => item["Is Surveyed"]).length}
                    </Typography>
                </Box>

                {/* Survey Pending */}
                <Box
                    sx={{
                        p: 2,
                        minWidth: 220,
                        backgroundColor: '#ed6c02',
                        color: 'white',
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <Typography variant="subtitle2">Survey Pending</Typography>
                    <Typography variant="h5" fontWeight="bold">
                        {siteData.filter(item => !item["Is Surveyed"]).length}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ m: 1, ml: 1, width: '98%' }}>
                <TableContainer sx={{ maxHeight: '58vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                    <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                        <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                    Circle
                                </th>
                                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                    Site ID
                                </th>
                                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                    MobileComm Approval Date
                                </th>
                                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                    Survey Date
                                </th>
                                <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                    Survey Remarks
                                </th>
                                {/* <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        SRN Number
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Remark
                                    </th> */}

                            </tr>
                        </thead>
                        <tbody>
                            {siteData?.map((it, index) => {
                                return (
                                    <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeight: 700 }} key={index}>
                                        <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Circle']}</th>
                                        <th style={{ color: 'black', cursor: 'pointer' }} onClick={() => handleSurvey(it['Site ID'], it['Circle'])}><a>{it['Site ID']}</a></th>
                                        <th style={{ color: 'black' }}>{it['Is Approved']}</th>
                                        <th style={{ color: 'black' }}>{it['Is Surveyed']}</th>
                                        <th style={{ color: 'black' }}>{it['Survey Remarks']}</th>
                                        {/* <th style={{ color: 'black' }}>
                                                <Checkbox size="small"
                                                    onChange={(e) => handleIsfound({ serial: it['Serial Number'], Is_Found: e.target.checked ? true : false })}
                                                    checked={it['Is Found'] ? true : false}

                                                    sx={{
                                                        color: '#006e74',
                                                        '&.Mui-checked': {
                                                            color: '#004d4f',
                                                        },
                                                    }}
                                                />
                                            </th> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </TableContainer>
            </Box>




            {loading}
        </>

    )
}

export default ShowAllDismantleItem