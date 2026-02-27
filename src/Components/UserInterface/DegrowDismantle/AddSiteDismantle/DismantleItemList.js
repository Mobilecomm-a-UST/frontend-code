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
import Swal from 'sweetalert2';
import { ServerURL } from '../../../services/FetchNodeServices';



const CircleList = ['AP', 'ASM', 'BR', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']


const DismantleItemList = () => {
    const [siteId, setSiteId] = useState('')
    const [selectCircle, setSelectCircle] = useState('')
    const [formDatas, setFormDatas] = useState({ circle: '', siteId: '', boardModel: '' })
    const { loading, action } = useLoadingDialog()
    const [displayData, setDisplayData] = useState([])
    const navigate = useNavigate()
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

    console.log('tempData', displayData)


    const handleSubmitSite = async (e) => {
        e.preventDefault()
        action(true)
        try {

            const formData = new FormData();
            formData.append('circle', formDatas?.circle);
            formData.append('siteId', formDatas?.siteId);
            formData.append('board', formDatas?.boardModel);
            const response = await axios.post
                (`${ServerURL}/degrow_dismental/mobinet_data_fetch_from_file/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            action(false)
            // setDismantleList(response?.data?.data)
            console.log('response data ', response)
            setDisplayData(response?.data?.data)
            setSelectCircle(formDatas.circle)
            setSiteId(formDatas.siteId)
            setFormDatas({ circle: '', siteId: '', boardModel: '' })
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `This Site-ID (${formDatas.siteId}) Found in database`,
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
        setFormDatas((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleClear = () => {
        setDisplayData([])
        setSelectCircle('')
        setSiteId('')
    }



    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/degrow_dismantle")}>Degrow Dismantle</Link>
                    <Typography color="text.primary">Add New Dismantle Site</Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'left', m: 1, ml: 2 }}>
                <form onSubmit={handleSubmitSite} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="issue-label">Circle</InputLabel>
                        <Select
                            labelId="issue-label"
                            value={formDatas.circle}
                            onChange={(e) => handleChange(e)}
                            label="Circle"
                            name='circle'
                            required
                        >
                            {CircleList.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField size='small' placeholder='Enter Site ID' label="Site ID" name='siteId' required value={formDatas.siteId} onChange={handleChange} />
                    <TextField size='small' placeholder='Enter Board Model' label="Board Model" name='boardModel' value={formDatas.boardModel} onChange={handleChange} />

                    <Button type='submit' sx={{ backgroundColor: '#006e74' }} variant='contained'>search site</Button>
                </form>
            </Box>

            {displayData.length > 0 && (
                <Box>
                    <Stack direction="row" spacing={1} sx={{ m: 1, ml: 2 }}>
                        <Chip label={`Circle: ${selectCircle}`} sx={{ backgroundColor: '#006e74', color: 'white', fontWeight: 'bold' }} />
                        <Chip label={`Site ID: ${siteId}`} sx={{ backgroundColor: '#006e74', color: 'white', fontWeight: 'bold' }} />
                    </Stack>

                    <ItemList
                        list={displayData}
                        circle={selectCircle}
                        siteId={siteId}
                        handleClear={handleClear}
                    />
                </Box>
            )}

            {loading}
        </>

    )
}

export default DismantleItemList