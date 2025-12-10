import React,{useState} from 'react'
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




const MultiSelectWithAll = ({ label, options, selectedValues, setSelectedValues,name,required }) => {
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

const SingleSelect = ({ label, options, value, setValue,name,required }) => {

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <FormControl fullWidth size="small">
            <InputLabel id={`${label}-label`}>{label}</InputLabel>

            <Select
                labelId={`${label}-label`}
                value={value}
                label={label}
                name={name}
                required={required}
                onChange={handleChange}
            >
                {options.map((item) => (
                    <MenuItem key={item} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const circleOptions = ['CENTRAL','AP', 'ASM', 'BIH', 'CHN', 'DEL', 'HRY', 'JK', 'JRK', 'KK', 'KOL', 'MAH', 'MP', 'MUM', 'NE', 'ORI', 'PUN', 'RAJ', 'ROTN', 'UPE', 'UPW', 'WB']

const DialogForm = (props) => {
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        circles:[],
        columns:[],
        right:'',
    })

    console.log('props in dialog form', formData);
    const { close,column } = props;

    const handleChange = (event) => {   
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
     }

    const handleAddNewData = (event) => {
        event.preventDefault();
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
                                value={formData?.name || ''}
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
                                value={formData?.email || ''}
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
                                selectedValues={formData.circles}
                                setSelectedValues={(value) => setFormData((prevData) => ({
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
                                selectedValues={formData.columns}
                                setSelectedValues={(value) => setFormData((prevData) => ({
                                    ...prevData,
                                    columns: value
                                }))}
                            />
                            {/* right */}
                            <SingleSelect
                                label="Rights"
                                options={['Admin', 'Read', 'Write']}
                                name="right"
                                required={true}
                                selectedValues={formData.right}
                                setSelectedValues={(value) => setFormData((prevData) => ({
                                    ...prevData,
                                    right: value
                                }))}
                            />
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