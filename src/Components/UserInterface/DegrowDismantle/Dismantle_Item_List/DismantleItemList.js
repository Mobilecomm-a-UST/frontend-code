import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Slide,
    Breadcrumbs, Link, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import ItemList from './ItemList';



const CircleList = ['AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']


const DismantleItemList = () => {
    const [siteId, setSiteId] = useState('')
    const [selectCircle, setSelectCircle] = useState('')
    const navigate = useNavigate()
    const tempData = {
    "status": "success",
    "count": 19,
    "data": [
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "2000078982009",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "L1140912696",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "GK2146G02EG",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "FR170705168",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "FR172921975",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "EA163861553",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "FR244110756",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "F7170806228",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "ePMP Force 300-25",
            "Serial Number": "E6XF07TX00X0",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "K9164078460",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "K9155142270",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "nan",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "FR244110758",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "2000059722442",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "K9221023539",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "K9221226391",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "FR181653246",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "2000059721917",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        },
        {
            "Circle": "BR",
            "Site-ID": "JSMSB-01",
            "Model": "Flexi LTE Base Station",
            "Serial Number": "2000059721548",
            "Quantity": 1,
            "Item Code": null,
            "Remark": false
        }
    ]
}


    const handleSubmitSite = async(e) => {
        e.preventDefault()
        console.log(siteId, selectCircle)   
        // navigate(`/tools/degrow_dismantle/${selectCircle}/${siteId}`)
    }

    return (
        <>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/degrow_dismantle")}>Degrow Dismantle</Link>
                    <Typography color="text.primary">File Manager</Typography>
                </Breadcrumbs>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'left', m: 1, ml: 2 }}>
                <form onSubmit={handleSubmitSite} style={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
                    <TextField size='small' placeholder='Enter Site ID' label="Site ID" required value={siteId} onChange={(e) => setSiteId(e.target.value)} />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="issue-label">Circle</InputLabel>
                        <Select
                            labelId="issue-label"
                            value={selectCircle}
                            onChange={(e) => setSelectCircle(e.target.value)}
                            label="Circle"
                            required
                        >
                            {CircleList.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type='submit' sx={{ backgroundColor: '#006e74' }} variant='contained'>search site</Button>
                </form>
            </Box>
            <Box>
                {tempData && <ItemList list={tempData.data} />}
            </Box>
        </>

    )
}

export default DismantleItemList