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
import ItemList from './ItemList';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import axios from 'axios';
import { getDecreyptedData } from '../../../utils/localstorage';
import {useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ServerURL } from '../../../services/FetchNodeServices';




const CircleList = ['AP', 'ASM', 'BR', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']


const DismantleItemList = () => {
    const [siteId, setSiteId] = useState('')
    const [selectCircle, setSelectCircle] = useState('')
    const [formData, setFormData] = useState({ circle: '', siteId: '' })
    const [dismantleList, setDismantleList] = useState()
    const { loading, action } = useLoadingDialog()
    const navigate = useNavigate()
    const CircleSiteData = JSON.parse(localStorage.getItem("DismantleSurveyData")) || {tableData:[],siteId:'',circle:''}
    const tempData = {
        "status": "success",
        "count": 19,
        "data": [
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR231316355",
                "index": 1,
                "Is In Mobinet": true,
                "SRN Number": "122345",
                "Remarks": "found in mobinet but not found in site",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9200404022",
                "index": 2,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9221662036",
                "index": 3,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "AD2205C0302",
                "index": 4,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "HA20260422392",
                "index": 5,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9232128810",
                "index": 6,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9221911870",
                "index": 7,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9221911861",
                "index": 8,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR204650921",
                "index": 9,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR204650347",
                "index": 10,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "AD2204C0ETK",
                "index": 11,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9232605045",
                "index": 12,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9232515536",
                "index": 13,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR231316348",
                "index": 14,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9222102216",
                "index": 15,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "K9210659491",
                "index": 16,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR204651289",
                "index": 17,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR204651286",
                "index": 18,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR204650923",
                "index": 19,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR231316368",
                "index": 20,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "FR231316333",
                "index": 21,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "HA20260422404",
                "index": 22,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "SRAN NSN",
                "Expected Quantity": 1,
                "Serial Number": "HB20260902661",
                "index": 23,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            },
            {
                "Model Name": "IP-20C",
                "Expected Quantity": 1,
                "Serial Number": "H440L20519",
                "index": 24,
                "Is In Mobinet": true,
                "SRN Number": "",
                "Remarks": "",
                "Is Found": false
            }
        ]
    }
    const { siteId: siteIdParam } = useParams();

    console.log('CircleSiteData', CircleSiteData)


    const handleSubmitSite = async (e) => {
        e.preventDefault()
        action(true)
        try {

            const formData = new FormData();
            formData.append('circle', formData.circle);
            formData.append('siteId', formData.siteId);
            const response = await axios.post
                (`${ServerURL}/degrow_dismental/mobinet_data_fetch/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            action(false)
            // setDismantleList(response?.data?.data)
            console.log('response data ', response)
            setSelectCircle(formData.circle)
            setSiteId(formData.siteId)
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `This Site-ID (${siteId}) Found in database`,
            });


        } catch (error) {
            action(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    useEffect(() => {
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
    }, []);


    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/degrow_dismantle")}>Degrow Dismantle</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/degrow_dismantle/survey_site_list")}>Dismantle Item List</Link>
                    <Typography color="text.primary">{siteIdParam}</Typography>
                </Breadcrumbs>
            </Box>

            <Box>
                <Stack direction="row" spacing={1} size="small" sx={{ m: 1, ml: 2 }}>
                    <Chip label={`Circle: ${CircleSiteData.circle}`} sx={{ backgroundColor: '#006e74', color: 'white', fontWeight: 'bold' }} />
                    <Chip label={`Site ID: ${CircleSiteData.siteId}`} sx={{ backgroundColor: '#006e74', color: 'white', fontWeight: 'bold' }} />
                </Stack>
                {CircleSiteData && <ItemList list={CircleSiteData.tableData} circle={CircleSiteData.circle} siteId={CircleSiteData.siteId} />}
            </Box>
            {loading}
        </>

    )
}

export default DismantleItemList