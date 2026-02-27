import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import { useStyles } from '../../ToolsCss'
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import AddNewItem from './AddNewItem';
import axios from 'axios';
import { ServerURL } from '../../../services/FetchNodeServices';
import Swal from 'sweetalert2';
import { getDecreyptedData } from '../../../utils/localstorage';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';




const ItemList = (props) => {
    const { list, circle, siteId } = props;
    const { action, loading } = useLoadingDialog()
    const [lists, setLists] = useState([]);
    const [newItem, setNewItem] = React.useState([]);
    const classes = useStyles()
    const navigate = useNavigate()
    // console.log('props data ', list)
    // console.log('lists data ', lists)
    // console.log('newItem data ', [...list, ...newItem])


    const handleMobinerDataSubmit = async () => {
        action(true)
        try {
            const formData = new FormData();
            formData.append('circle', circle);
            formData.append('siteId', siteId);
            formData.append('data', JSON.stringify([...lists, ...newItem]));
            const response = await axios.post
                (`${ServerURL}/degrow_dismental/mobinet_data_submit_circle/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });

            action(false)
            // setDismantleList(response?.data?.data)
            console.log('mobinet response data ', response)
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `This Site-ID (${siteId}) data has been Updated successfully`,
            });
            navigate('/tools/degrow_dismantle/survey_site_list')

        } catch (error) {
            action(false)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: ` ${error.response?.data?.error || error.message}`,
            });
        }

    }

    const handleIsfound = (data) => {
        let { serial, Is_Found } = data
        console.log('serial ', serial, 'Is_Found ', Is_Found)

        // Update the list with the new remarks
        setLists((prevList) =>
            prevList.map((item) =>
                item['Serial Number'] === serial ? { ...item, 'Is Found': Is_Found } : item
            )
        );
    }

    const handleSRNChange = (serial, value) => {
        // Update the list with the new remarks
        setLists((prevList) =>
            prevList.map((item) =>
                item['Serial Number'] === serial ? { ...item, 'SRN Number': value } : item
            )
        );
    }
    const handleRemarkChange = (serial, value) => {
        // Update the list with the new remarks
        setLists((prevList) =>
            prevList.map((item) =>
                item['Serial Number'] === serial ? { ...item, 'Remarks': value } : item
            )
        );
    }
    const onAdd = (newItem) => {
        setLists((prev) => [...prev, newItem]);
    };

    const handleDeleteNewItem = (serial) => {
        setNewItem((prev) =>
            prev.filter(item => item['Serial Number'] !== serial)
        );
    };
    useEffect(() => {
        setLists(list)
    }, [list])

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Box sx={{ m: 1, ml: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <TableContainer sx={{ maxHeight: '58vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                        Model Name
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Serial Number
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Mobinet Quantity
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Is Found
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        SRN Number
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Remark
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {lists?.map((it, index) => {
                                    return (
                                        <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                            <th style={{ color: 'black' }}>{it['Model']}</th>
                                            <th style={{ color: 'black' }}>{it['Serial Number']}</th>
                                            <th style={{ color: 'black' }}>{it['Expected Quantity']}</th>
                                            <th style={{ color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <Checkbox size="small"
                                                    onChange={(e) => handleIsfound({ serial: it['Serial Number'], Is_Found: e.target.checked ? true : false })}
                                                    checked={it['Is Found'] ? true : false}

                                                    sx={{
                                                        color: '#006e74',
                                                        '&.Mui-checked': {
                                                            color: '#004d4f',
                                                        },
                                                    }}
                                                /> */}
                                                <Stack direction="row" spacing={0} sx={{ alignItems: 'center' }}>
                                                    <Typography>No</Typography>
                                                    <Switch
                                                        checked={it['Is Found'] ? true : false}
                                                        onChange={(e) => handleIsfound({ serial: it['Serial Number'], Is_Found: e.target.checked ? true : false })}
                                                        sx={{
                                                            color: '#006e74',
                                                            '&.Mui-checked': {
                                                                color: '#004d4f',
                                                            },
                                                        }}
                                                    />
                                                    <Typography>Yes</Typography>
                                                </Stack>
                                            </th>
                                            <th style={{ color: 'black' }}>
                                                <TextField
                                                    size="small"
                                                    value={it['SRN Number']}
                                                    onChange={(e) => handleSRNChange(it['Serial Number'], e.target.value)}
                                                    fullWidth
                                                    disabled={!it['Is Found']}
                                                />
                                            </th>
                                            <th style={{ color: 'black' }}>

                                                <TextField
                                                    size="small"
                                                    value={it.Remarks}
                                                    onChange={(e) => handleRemarkChange(it['Serial Number'], e.target.value)}
                                                    fullWidth
                                                    disabled={!it['Is Found']}
                                                />
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 2, display: newItem?.length > 0 ? 'block' : 'none' }}>
                    {/* show newItem data in table and add delete button */}
                    <TableContainer
                        sx={{
                            maxHeight: '30vh',
                            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                            mt: 2
                        }}
                        component={Paper}
                    >
                        <table
                            style={{
                                width: "100%",
                                border: "1px solid black",
                                borderCollapse: 'collapse'
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: '#006e74', color: 'white' }}>
                                    <th style={{ padding: 8 }}>Model Name</th>
                                    <th style={{ padding: 8 }}>Serial Number</th>
                                    <th style={{ padding: 8 }}>Quantity</th>
                                    <th style={{ padding: 8 }}>SRN Number</th>
                                    <th style={{ padding: 8 }}>Remarks</th>
                                    <th style={{ padding: 8 }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {newItem?.map((item, index) => (
                                    <tr key={index} style={{ textAlign: 'center' }}>
                                        <th>{item['Model']}</th>
                                        <th>{item['Serial Number']}</th>
                                        <th>{item['Expected Quantity']}</th>
                                        <th>{item['SRN Number']}</th>
                                        <th>{item['Remarks']}</th>
                                        <th>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDeleteNewItem(item['Serial Number'])}
                                            >
                                                Delete
                                            </Button>
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </TableContainer>

                </Box>
                <Box>
                    <AddNewItem onAdd={(newItem) => {
                        setNewItem((prev) => [...prev, newItem]);
                    }} />
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={handleMobinerDataSubmit}
                        fullWidth
                    >
                        Submit this survey data
                    </Button>
                </Box>

            </Box>
            {action && loading}
        </>
    )

}

export default ItemList