import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Grid, Stack, Button, Popover, List, ListItem, ListItemText } from "@mui/material";
import Slide from '@mui/material/Slide';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { usePost } from '../../../Hooks/PostApis';
import { useGet } from '../../../Hooks/GetApis';
import Swal from "sweetalert2";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Add_Kpi = (props) => {

    const { makePostRequest } = usePost()
    const { makeGetRequest } = useGet()
    const [searchTerm, setSearchTerm] = useState('');//

    const [anchorEl, setAnchorEl] = useState(null);//
    const [formData, setFormData] = useState({
        KPI: '',
        operator: '',
        threshold_value: ''
    })
    const { isPending, data, refetch } = useQuery({
        queryKey: ['UNIQUE_KPI'],
        queryFn: async () => {
            const res = await makeGetRequest("RCA_TOOL/unique_kpi/");
            if (res) {
                // console.log('unique kpi', res)
                return res;
            }

        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })

    const [filteredCategories, setFilteredCategories] = useState(data?.KPI_name);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
        // setFilteredCategories(categories); // Reset the filtered categories when the menu opens
    };
    const open = Boolean(anchorEl);

    const handleSearchChange = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        setFilteredCategories(
            data?.KPI_name.filter(category => category.toLowerCase().includes(value))
        );
    };
    const handleCategoryChange = (event) => {
        // setCategory(event.currentTarget.getAttribute('data-value'));
        setFormData({
            ...formData,
            KPI: event.currentTarget.getAttribute('data-value'),
        })
        handleClose2();
      };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }


    const handleClose = () => {
        setFormData({
            KPI: '',
            operator: '',
            threshold_value: ''
        })
    }
    const handleClose2 = () => {
        setAnchorEl(null);
        setSearchTerm('');

    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        const responce = await makePostRequest('RCA_TOOL/kpi-tables/', formData)
        if (responce) {
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `Data saved successfully`,
            });
            handleClose()
            props.handleClick();
            props.handleFetch();
        }
    }




    if (props.open) {
        return (
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
            >
                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><AddIcon fontSize='medium' /></Box><Box>ADD NEW KPI DATA</Box></Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={props.handleClick}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>
                <DialogContent dividers={'paper'}>
                    <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>

                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">KPI</InputLabel>
                                    {/* <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.KPI}
                                        label="KPI"
                                        name='KPI'
                                        onChange={handleChange}
                                    >
                                        <MenuItem disabled>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                size='small'
                                                placeholder="Search KPI"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                            />
                                        </MenuItem>

                                        {data?.KPI_name?.map((item) => {
                                            return <MenuItem value={item} >{item}</MenuItem>
                                        })}
                                    </Select> */}
                                    <Select
                                        value={formData.KPI}
                                        onClick={handleOpen}
                                        readOnly
                                        label="KPI"
                                        open={false}
                                    >
                                        <MenuItem value={formData.KPI}>{formData.KPI}</MenuItem>
                                    </Select>
                                    <Popover
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose2}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                    >
                                        <Box sx={{ p: 1, width: 500 }}>
                                            <TextField
                                                variant="outlined"
                                                placeholder="KPI Search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                size='small'
                                            />
                                            <List>
                                                {filteredCategories?.map((item, index) => (
                                                    <ListItem
                                                        button
                                                        key={index}
                                                        data-value={item}
                                                        onClick={handleCategoryChange}
                                                    >
                                                        <ListItemText primary={item} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    </Popover>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>

                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">Operator</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={formData.operator}
                                        label="Operator"
                                        name='operator'
                                        onChange={handleChange}
                                    >

                                        {data?.operators?.map((item) => {
                                            return <MenuItem value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    placeholder="Threshold Value"
                                    label="Threshold Value"
                                    name="threshold_value"
                                    value={formData.threshold_value}
                                    onChange={handleChange}
                                    size="small"
                                    type='number'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained">Add</Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        )
    }

}

export const MemoAdd_Kpi = React.memo(Add_Kpi)