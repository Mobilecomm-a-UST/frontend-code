import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
// import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import { useParams } from 'react-router-dom';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { ServerURL } from '../../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDecreyptedData } from '../../../../utils/localstorage';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';

const FinalData = () => {

    const listDataa = useSelector(state => state.ntdFinalTracker)
    // console.log('list data' , listDataa)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userID = getDecreyptedData('userID')
    const { actions, loading } = useLoadingDialog();

    const [editDataID, setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    // const params = useParams()


    // console.log('local storage', listDataa)


    const createNextHistoryEntry = (start, close, index) => {
        return {
            [`S${index}`]: start || "",
            [`C${index}`]: close || ""
        };
    };

    const [editData, setEditData] = useState({})
    const [readOnlyFields, setReadOnlyFields] = useState([])
    const [dateTypeKey, setDateTypeKey] = useState([])

    const columnData = [
        {
            title: 'Actions',
            field: 'actions',
            render: rowData => (
                <>
                    {!userTypes?.includes('RLT_reader') && (
                        <IconButton aria-label="edit" onClick={() => handleEdit(rowData)}>
                            <DriveFileRenameOutlineIcon color='success' />
                        </IconButton>
                    )}
                </>
            )
        },

        { title: 'Circle', field: 'circle' },
        { title: 'Site ID', field: 'site_id' },
        { title: 'Issue Name', field: 'issue_name' },
        { title: ' Issue Owner', field: 'issue_owner' },
        { title: 'Milestone', field: 'milestone' },
        { title: 'Status', field: 'status' },
        { title: 'Duration', field: 'duration' },
        { title: 'Start Date', field: 'start_date' },
        { title: 'Close Date', field: 'close_date' },
        { title: 'Remarks', field: 'remarks' }
    ];

    const getStatus = () => {
        var arr = []
        listDataa?.map((item) => {
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);
    }

    const dateFormateChange = (dateStr) => {
        if (!dateStr || dateStr === "nan") return "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return dateStr;
        }

        if (/^\d{1,2}-[A-Za-z]{3}-\d{2}$/.test(dateStr)) {
            const [day, mon, year] = dateStr.split('-');

            const months = {
                Jan: "01", Feb: "02", Mar: "03", Apr: "04",
                May: "05", Jun: "06", Jul: "07", Aug: "08",
                Sep: "09", Oct: "10", Nov: "11", Dec: "12"
            };

            const fullYear = Number(year) < 50 ? "20" + year : "19" + year;

            return `${fullYear}-${months[mon]}-${day.padStart(2, "0")}`;
        }

        return dateStr;
    };

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    }

    const handleEdit = (rowData) => {
        setEditData(rowData);
        setOpen(true);
    }

    const handleUpdateData = (e) => {
        e.preventDefault();
        // Add update logic here
    }

    const downloadExcel = (data) => {
        var csvBuilder = new CsvBuilder(`RFAI-To-MS1_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    }

    const handleDialogBox = useCallback(() => {
        return (<Dialog
            open={open}
            keepMounted
            fullWidth
            maxWidth={'lg'}
        >
            <DialogTitle>
                Edit Data
                <span style={{ float: 'right' }}><IconButton aria-label="close" onClick={() => setOpen(false)}><CloseIcon /> </IconButton></span>
            </DialogTitle>
            <DialogContent dividers={'paper'}>
                <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 10 }}>
                    <Grid container spacing={2}>
                        {Object.keys(editData).map(key => (
                            <Grid item xs={3} key={key}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder={key.replace(/_/g, ' ')}
                                    label={key.replace(/_/g, ' ')}
                                    name={key}
                                    value={key.includes('date') ? dateFormateChange(editData[key]) : editData[key]}
                                    onChange={handleChange}
                                    size="small"
                                    type={dateTypeKey.includes(key) ? 'date' : 'text'}
                                    InputLabelProps={key.includes('date') ? { shrink: true } : {}}
                                    inputProps={readOnlyFields.includes(key) ? { readOnly: true } : {}}
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained">Update</Button>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>)
    }, [open, editData])

    useEffect(() => {
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <MaterialTable
                    title="NTD Site Details"
                    columns={columnData}
                    data={listDataa?.temp || []}
                    actions={[
                        {
                            icon: () => <DownloadIcon color='primary' fontSize='large' />,
                            tooltip: "Export to Excel",
                            onClick: () => downloadExcel(listDataa?.temp || []),
                            isFreeAction: true
                        }
                    ]}
                    options={{
                        selection: false,
                        search: true,
                        exportButton: true,
                        grouping: false,
                        headerStyle: {
                            backgroundColor: '#006e74',
                            color: '#FFF',
                            whiteSpace: 'nowrap',
                            fontWeight: 'bold'
                        },
                        rowStyle: {
                            whiteSpace: 'nowrap'
                        }
                    }}
                />
            </div>
            {handleDialogBox()}
            {loading}
        </>
    )
}
export default FinalData