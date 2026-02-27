import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from '@mui/material';
import Swal from 'sweetalert2';

const AddNewItem = ({ onAdd }) => {
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        modelName: '',
        serialNumber: '',
        expectedQuantity: 1,
        srnNumber: '',
        remarks: ''
    });

    // console.log('formData', formData)

    const handleOpen = () => {
        console.log('open')
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({
            modelName: '',
            serialNumber: '',
            expectedQuantity: 1,
            srnNumber: '',
            remarks: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // VERY IMPORTANT

        const newItem = {
            "Model": formData.modelName,
            "Serial Number": formData.serialNumber,
            "Expected Quantity": Number(formData.expectedQuantity),
            "SRN Number": formData.srnNumber,
            "Remarks": formData.remarks,
            "Is In Mobinet": false,
            "Is Found": true,
            index: Date.now()
        };

        Swal.fire({
            icon: 'success',
            title: 'Item Added Successfully'
        });

        onAdd?.(newItem);
        handleClose();
    };

    return (
        <>
            <Button
                variant="contained"
                sx={{ backgroundColor: '#006e74', mt: 2 }}
                onClick={handleOpen}
            >
                Add New Item
            </Button>

            <Dialog open={open} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Item</DialogTitle>

                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Model Name"
                                    name="modelName"
                                    fullWidth
                                    required
                                    value={formData.modelName}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Serial Number"
                                    name="serialNumber"
                                    fullWidth
                                    required
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Expected Quantity"
                                    name="expectedQuantity"
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 1 }}
                                    value={formData.expectedQuantity}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="SRN Number"
                                    name="srnNumber"
                                    fullWidth
                             
                                    value={formData.srnNumber}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Remarks"
                                    name="remarks"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={formData.remarks}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="error">
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ backgroundColor: '#006e74' }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddNewItem;