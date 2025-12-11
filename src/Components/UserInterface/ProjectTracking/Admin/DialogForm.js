import React, { useState } from 'react'
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { Grid, Button, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { getDecreyptedData } from '../../../utils/localstorage';
import { ServerURL } from '../../../services/FetchNodeServices';
import Swal from 'sweetalert2';





const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues, name, required }) => {
    const handleChange = (event) => {
        const { value } = event.target;
        const selected = typeof value === 'string' ? value.split(',') : value;

        if (selected.includes('ALL')) {
            if (selectedValues.length === options.length) {
                setSelectedValues([]);
            } else {
                setSelectedValues(options);
            }
        } else {
            setSelectedValues(selected);
        }
    };

    const isAllSelected = options.length > 0 && selectedValues.length === options.length;

    return (
        <FormControl fullWidth size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Select
                labelId={`${label}-label`}
                multiple
                value={selectedValues}
                name={name}
                label={label}
                onChange={handleChange}
                required={required}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => selected.join(', ')}
            >
                <MenuItem value="ALL">
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={
                            selectedValues.length > 0 && selectedValues.length < options.length
                        }
                    />
                    <ListItemText primary="Select All" />
                </MenuItem>

                {options.map((name) => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedValues.includes(name)} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


const circleOptions = ['CENTRAL', 'AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']

const DialogForm = (props) => {
    const [formDatas, setFormDatas] = useState({
        name: '',
        email: '',
        circles: [],
        columns: [],
        right: '',
    })

    console.log('props in dialog form', formDatas);
    const { close, column, refetch } = props;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormDatas((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleAddNewData = async (event) => {
        event.preventDefault();
        try {

            const formData = new FormData();
            formData.append('adminId', getDecreyptedData('userID'));
            formData.append('name', formDatas.name);
            formData.append('email', formDatas.email);
            formData.append('circles', formDatas.circles);
            formData.append('columns',formDatas.columns);
            formData.append('right', formDatas.right);
            const response = await axios.post
                (`${ServerURL}/alok_tracker/create_user/`, formData, {
                    headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
                });
            console.log('fetchAdminPanelData response', response.data)
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "User data added successfully.",
                });
                refetch();
                // close();
            }
        } catch (error) {
            //    close();
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to update data: ${error.response?.data?.error || error.message}`,
            });
        }
        // Handle form submission logic here
    }


    return (
        <Dialog
            open={true}
            keepMounted
            fullWidth
            maxWidth={'lg'}

        >
            <DialogTitle>
                Add New User Data
                <span style={{ float: 'right' }}><IconButton aria-label="close" onClick={close} ><CloseIcon /> </IconButton></span>
            </DialogTitle>
            <DialogContent dividers={'paper'}>
                <form onSubmit={handleAddNewData} style={{ width: '100%', marginTop: 10 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* User Name  */}
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <TextField
                                variant="outlined"
                                label="User Name"
                                name="name"
                                value={formDatas?.name || ''}
                                onChange={handleChange}
                                type="Text"
                                size="small"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                        {/* User Email Id  */}
                        <FormControl fullWidth size="small" sx={{ flex: 1 }}>
                            <TextField
                                variant="outlined"
                                label="User Email Id"
                                name="email"
                                value={formDatas?.email || ''}
                                onChange={handleChange}
                                type="email"
                                size="small"
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                        {/* circle */}
                        <MultiSelectWithAll
                            label="Circle"
                            options={circleOptions}
                            name="circles"
                            required={true}
                            selectedValues={formDatas.circles}
                            setSelectedValues={(value) => setFormDatas((prevData) => ({
                                ...prevData,
                                circles: value
                            }))}
                        />
                        {/* columns */}
                        <MultiSelectWithAll
                            label="Columns"
                            options={column}
                            name="columns"
                            required={true}
                            selectedValues={formDatas.columns}
                            setSelectedValues={(value) => setFormDatas((prevData) => ({
                                ...prevData,
                                columns: value
                            }))}
                        />
                        {/* right */}
                        {/* <SingleSelect
                            label="Rights"
                            options={['Admin', 'Read', 'Write']}
                            name="right"
                            required={true}
                            selectedValues={formData.right}
                            setSelectedValues={(value) => setFormData((prevData) => ({
                                ...prevData,
                                right: value
                            }))}
                        /> */}
                        <FormControl fullWidth size="small">
                            <InputLabel id={`Rights-label`}>Rights</InputLabel>

                            <Select
                                labelId={`Rights-label`}
                                value={formDatas.right}
                                label={`Rights`}
                                name={`right`}
                                required={true}
                                onChange={handleChange}
                            >
                                {['Admin', 'Read', 'Write'].map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary">
                            Add User
                        </Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogForm