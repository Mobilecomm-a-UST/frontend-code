import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
// import { postData } from '../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import { useParams } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Dialog, DialogContent, IconButton, DialogTitle } from '@mui/material';
import { ServerURL } from '../../../services/FetchNodeServices';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Swal from "sweetalert2";
import TextField from '@mui/material/TextField';
import { Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getDecreyptedData } from '../../../utils/localstorage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Check';
import AddBoxIcon from '@mui/icons-material/AddBox';
import {
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
} from '@mui/material';



const circleLookup = {
    AP: 'AP',
    BIH: 'BIH',
    CHN: 'CHN',
    ROTN: 'ROTN',
    DEL: 'DEL',
    HRY: 'HRY',
    JK: 'JK',
    JRK: 'JRK',
    KOL: 'KOL',
    MAH: 'MAH',
    MP: 'MP',
    MUM: 'MUM',
    ORI: 'ORI',
    PUN: 'PUN',
    RAJ: 'RAJ',
    UPE: 'UPE',
    UPW: 'UPW',
    WB: 'WB',
    KK: 'KK',
    HP: 'HP',
    NESA: 'NESA',
    ASM: 'ASM',
};
const activityNameLookup = {
    ULS_HPSC: 'ULS_HPSC',
    RELOCATION: 'RELOCATION',
    MACRO: 'MACRO',
    'DE-GROW': 'DE-GROW',
    RET: 'RET',
    IBS: 'IBS',
    ODSC: 'ODSC',
    IDSC: 'IDSC',
    'HT INCREMENT': 'HT INCREMENT',
    FEMTO: 'FEMTO',
    OTHERS: 'OTHERS',
    UPGRADE: 'UPGRADE',
    RECTIFICATION: 'RECTIFICATION',
    '5G SECTOR ADDITION': '5G SECTOR ADDITION',
    OPERATIONS: 'OPERATIONS',
    '5G RELOCATION': '5G RELOCATION',
    'TRAFFIC SHIFTING': 'TRAFFIC SHIFTING',
    'RRU UPGRADE': 'RRU UPGRADE',
    '5G RRU SWAP': '5G RRU SWAP',
    '5G BW UPGRADE': '5G BW UPGRADE',
    '5G AIR SWAP': '5G AIR SWAP',
    'RRU SWAP': 'RRU SWAP',
};
const oemLookup = {
    NOKIA: 'NOKIA',
    ZTE: 'ZTE',
    SAMSUNG: 'SAMSUNG',
    ERICSSON: 'ERICSSON',
    HUAWEI: 'HUAWEI',
};
const bandSiwaLookup = {
    'G900': 'G900',
    'G1800': 'G1800',
    'L850': 'L850',
    'L900': 'L900',
    'L1800': 'L1800',
    'L2100': 'L2100',
    'L2300': 'L2300',
    '3500': '3500',
};
const bandSiwaOptions = [
    'G900',
    'G1800',
    'L850',
    'L900',
    'L1800',
    'L2100',
    'L2300',
    '3500',
];
const configuration5GLookup = {
    'NSA': 'NSA',
    'SA': 'SA',
    'NSA+SA': 'NSA+SA',
};

const activityTypeSiwaLookup = {
    FDD_SEC_ADDITION: 'FDD_SEC_ADDITION',
    FDD_TWIN_BEAM: 'FDD_TWIN_BEAM',
    FDD_UPGRADE: 'FDD_UPGRADE',
    L2100_UPGRADE: 'L2100_UPGRADE',
    L900_UPGRADE: 'L900_UPGRADE',
    NEW_TOWER: 'NEW_TOWER',
    NEW_TOWER_ULS: 'NEW_TOWER_ULS',
    TDD_SEC_ADDITION: 'TDD_SEC_ADDITION',
    TDD_TWIN_BEAM: 'TDD_TWIN_BEAM',
    TDD_UPGRADE: 'TDD_UPGRADE',
    UPGRADE_SW_ONLY: 'UPGRADE_SW_ONLY',
    UPGRADE_ULS: 'UPGRADE_ULS',
    '5G_SEC_ADDITION': '5G_SEC_ADDITION',
    '5G_UPGRADE': '5G_UPGRADE',
    RET: 'RET',
    DEGROW: 'DEGROW',
    OTHERS: 'OTHERS',
    'CPRI addition': 'CPRI addition',
    'SFP change': 'SFP change',
    'BW upgradation': 'BW upgradation',
    'BTS swap': 'BTS swap',
    'IP modification': 'IP modification',
    'Hot swap': 'Hot swap',
    'Nomenclature change': 'Nomenclature change',
    '2G deletion': '2G deletion',
    'Carrier Addition': 'Carrier Addition',
};
const activityTypeSANSA = {
    SA: 'SA',
    NSA: 'NSA',
}
const technologyOptions = [
    '2G',
    'FDD',
    'TDD',
    '5G',
    'Card Degrow',
];
const oldSiteTechOptions = [
    'G900',
    'G1800',
    'L850',
    'L900',
    'L1800',
    'L2100',
    'L2300',
    '3500',
];
const DEFAULT_ROW = {
    OEM: "",
    Integration_Date: null,
    CIRCLE: "",
    Activity_Name: "",
    Site_ID: "",
    MO_NAME: "",
    LNBTS_ID: "",
    Technology_SIWA: "",
    Configuration_5G: "",
    OSS_Details: "",
    Cell_ID: "",
    CELL_COUNT: "",
    BSC_NAME: "",
    BCF: "",
    TRX_Count: "",
    PRE_ALARM: "",
    GPS_IP_CLK: "",
    RET: "",
    POST_VSWR: "",
    POST_Alarms: "",
    Activity_Mode: "",
    Activity_Type_SIWA: "",
    Band_SIWA: "",
    CELL_STATUS: "",
    CTR_STATUS: "",
    Integration_Remark: "",
    T2T4R: "",
    BBU_TYPE: "",
    BB_CARD: "",
    RRU_Type: "",
    Media_Status: "",
    Mplane_IP: "",
    SCF_PREPARED_BY: "",
    SITE_INTEGRATE_BY: "",
    Site_Status: "",
    External_Alarm_Confirmation: "",
    SOFT_AT_STATUS: "",
    LICENCE_Status: "",
    ESN_NO: "",
    Responsibility_for_alarm_clearance: "",
    TAC: "",
    PCI_TDD_20: "",
    PCI_TDD_10_20: "",
    PCI_FDD_2100: "",
    PCI_FDD_1800: "",
    PCI_L900: "",
    PCI_5G: "",
    RSI_TDD_20: "",
    RSI_TDD_10_20: "",
    RSI_FDD_2100: "",
    RSI_FDD_1800: "",
    RSI_L900: "",
    RSI_5G: "",
    GPL: "",
    Pre_Post_Check: "",
    CRQ: "",
    Customer_Approval: "",
    FR_Date: "",
    HOTO_Offered_Date_4g: "",
    HOTO_Accepted_Date_4g: "",
    HOTO_Offered_Date_2g: "",
    HOTO_Accepted_Date_2g: "",
};


const ComanDashboard = () => {
    const listDataa = useSelector(state => state.IXtracker)
    const navigate = useNavigate();
    const [listData, setListData] = useState(getDecreyptedData("integration_final_tracker"))
    const [editData, setEditData] = useState({
        OEM: "",
        Activity_Name: "",
        Activity_Mode: "",
        BBU_TYPE: "",
        Activity_Type_SIWA: "",
        BB_CARD: "",
        Band_SIWA: "",
        CELL_COUNT: "",
        CELL_STATUS: "",
        CIRCLE: "",
        CTR_STATUS: "",
        Cell_ID: "",
        ESN_NO: "",
        External_Alarm_Confirmation: "",
        GPL: "",
        GPS_IP_CLK: "",
        Integration_Date: "",
        Integration_Remark: "",
        LICENCE_Status: "",
        LNBTS_ID: "",
        MO_NAME: "",
        Media_Status: "",
        Mplane_IP: "",

        OSS_Details: "",
        PCI_5G: "",
        PCI_FDD_1800: "",
        PCI_FDD_2100: "",
        PCI_L900: "",
        PCI_TDD_10_20: "",
        PCI_TDD_20: "",
        POST_Alarms: "",
        POST_VSWR: "",
        PRE_ALARM: "",
        Pre_Post_Check: "",
        RET: "",
        RRU_Type: "",
        RSI_5G: "",
        RSI_FDD_1800: "",
        RSI_FDD_2100: "",
        RSI_L900: "",
        RSI_TDD_10_20: "",
        RSI_TDD_20: "",
        Responsibility_for_alarm_clearance: "",
        SCF_PREPARED_BY: "",
        SITE_INTEGRATE_BY: "",
        SOFT_AT_STATUS: "",
        Site_ID: "",
        Site_Status: "",
        T2T4R: "",
        TAC: "",
        TRX_Count: "",
        Technology_SIWA: "",
        BCF: '',
        BSC_NAME: '',
        CRQ: '',
        Customer_Approval: '',
        FR_Date: '',
        HOTO_Offered_Date_4g: '',
        HOTO_Accepted_Date_4g: '',
        HOTO_Offered_Date_2g: '',
        HOTO_Accepted_Date_2g: '',
    })
    const [editDataID, setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const userTypes = (getDecreyptedData('user_type')?.split(","))
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState([])
    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    }

    const handleEdit = async (rowData) => {
        // console.log(rowData)
        setEditData({
            OEM: rowData.OEM,
            Integration_Date: rowData.Integration_Date,
            CIRCLE: rowData.CIRCLE,
            Activity_Name: rowData.Activity_Name,
            Site_ID: rowData.Site_ID,
            MO_NAME: rowData.MO_NAME,
            LNBTS_ID: rowData.LNBTS_ID,
            Technology_SIWA: rowData.Technology_SIWA,
            Configuration_5G: rowData.Configuration_5G,
            OSS_Details: rowData.OSS_Details,
            Cell_ID: rowData.Cell_ID,
            CELL_COUNT: rowData.CELL_COUNT,
            BSC_NAME: rowData.BSC_NAME,
            BCF: rowData.BCF,
            TRX_Count: rowData.TRX_Count,
            PRE_ALARM: rowData.PRE_ALARM,
            GPS_IP_CLK: rowData.GPS_IP_CLK,
            RET: rowData.RET,
            POST_VSWR: rowData.POST_VSWR,
            POST_Alarms: rowData.POST_Alarms,
            Activity_Mode: rowData.Activity_Mode,
            Activity_Type_SIWA: rowData.Activity_Type_SIWA,
            Band_SIWA: rowData.Band_SIWA,
            CELL_STATUS: rowData.CELL_STATUS,
            Integration_Remark: rowData.Integration_Remark,
            T2T4R: rowData.T2T4R,
            BBU_TYPE: rowData.BBU_TYPE,
            BB_CARD: rowData.BB_CARD,
            RRU_Type: rowData.RRU_Type,
            Media_Status: rowData.Media_Status,
            Mplane_IP: rowData.Mplane_IP,
            SCF_PREPARED_BY: rowData.SCF_PREPARED_BY,
            SITE_INTEGRATE_BY: rowData.SITE_INTEGRATE_BY,
            Site_Status: rowData.Site_Status,
            External_Alarm_Confirmation: rowData.External_Alarm_Confirmation,
            SOFT_AT_STATUS: rowData.SOFT_AT_STATUS,
            LICENCE_Status: rowData.LICENCE_Status,
            ESN_NO: rowData.ESN_NO,
            Responsibility_for_alarm_clearance: rowData.Responsibility_for_alarm_clearance,
            TAC: rowData.TAC,
            PCI_TDD_20: rowData.PCI_TDD_20,
            PCI_TDD_10_20: rowData.PCI_TDD_10_20,
            PCI_FDD_1800: rowData.PCI_FDD_1800,
            PCI_FDD_2100: rowData.PCI_FDD_2100,
            PCI_L900: rowData.PCI_L900,
            PCI_5G: rowData.PCI_5G,
            RSI_TDD_20: rowData.RSI_TDD_20,
            RSI_TDD_10_20: rowData.RSI_TDD_10_20,
            RSI_FDD_2100: rowData.RSI_FDD_2100,
            RSI_FDD_1800: rowData.RSI_FDD_1800,
            RSI_L900: rowData.RSI_L900,
            RSI_5G: rowData.RSI_5G,
            GPL: rowData.GPL,
            Pre_Post_Check: rowData.Pre_Post_Check,
            CTR_STATUS: rowData.CTR_STATUS,
            CRQ: rowData.CRQ,
            Customer_Approval: rowData.Customer_Approval,
            FR_Date: rowData.FR_Date,
            HOTO_Offered_Date_4g: rowData.HOTO_Offered_Date_4g,
            HOTO_Accepted_Date_4g: rowData.HOTO_Accepted_Date_4g,
            HOTO_Offered_Date_2g: rowData.HOTO_Offered_Date_2g,
            HOTO_Accepted_Date_2g: rowData.HOTO_Accepted_Date_2g,
        })
        setEditDataID(rowData.id)
        setOpen(true)
    }

    const handleUpdateData = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${ServerURL}/ix_tracker_vi/edit-integration-record/${editDataID}/`, editData, {
                headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }
            });
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `Data Updated Successfully`,
            });
            navigate('/tools/ix_tools/vi_integration/dashboard')

        } catch (error) {
            // console.log('error', error.response?.data || error.message);
            setOpen(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Failed to update data: ${error.response?.data?.message || error.message}`,
            });
        }

    }

    const handleDelete = async (rowData) => {
        axios.delete(`${ServerURL}/ix_tracker_vi/delete-integration-record/${rowData.id}/`, { headers: { Authorization: `token ${getDecreyptedData("tokenKey")}` }, })
            .then((res) => {
                console.log('Data deleted successfully', res);
                Swal.fire({
                    icon: "success",
                    title: "Deleted",
                    text: `${res.data.message}`,
                });
                const newData = listData.filter(item => item.id !== rowData.id);
                setListData(newData);
                // console.log('Data deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `${error.response.data.message}`,
                });
            });
    }

    const tableIcons = {
        Edit: () => <EditIcon color="primary" />,
        Delete: () => <DeleteIcon color="error" />,
        Clear: () => <ClearIcon />,
        Check: () => <SaveIcon color="success" />,
        Add: () => <AddBoxIcon color="primary" />,
    };

    const columnData = [
        {
            title: 'OEM', field: 'OEM', lookup: oemLookup,
            validate: rowData =>
                rowData.OEM ? true : 'OEM is required',
        },
        {
            title: 'Integration Date', field: 'Integration_Date', type: 'date',
            validate: rowData =>
                rowData.Integration_Date ? true : 'Integration Date is required',
        },
        {
            title: 'CIRCLE', field: 'CIRCLE', lookup: circleLookup,
            validate: rowData =>
                rowData.CIRCLE ? true : 'Circle is required',
        },
        {
            title: 'Activity Name', field: 'Activity_Name', lookup: activityNameLookup,
            validate: rowData =>
                rowData.Activity_Name ? true : 'Activity Name is required',
        },
        {
            title: 'Site ID', field: 'Site_ID',
            validate: rowData =>
                rowData.Site_ID ? true : 'Site ID is required',
        },
        { title: 'MO NAME', field: 'MO_NAME' },
        { title: 'LNBTS ID', field: 'LNBTS_ID' },
        // { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
        {
            title: 'Technology (SIWA)',
            field: 'Technology_SIWA',

            editComponent: props => {
                const selectedValues = props.value
                    ? props.value.split(',')
                    : [];

                return (
                    <Select
                        multiple
                        fullWidth
                        value={selectedValues}
                        onChange={e =>
                            props.onChange(e.target.value.join(','))
                        }
                        renderValue={selected => selected.join(', ')}
                    >
                        {technologyOptions.map(tech => (
                            <MenuItem key={tech} value={tech}>
                                <Checkbox checked={selectedValues.includes(tech)} />
                                <ListItemText primary={tech} />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        { title: '5G Configuration', field: 'Configuration_5G', lookup: configuration5GLookup },
        { title: 'OSS Details', field: 'OSS_Details' },
        { title: 'Cell ID', field: 'Cell_ID' },
        { title: 'CELL COUNT', field: 'CELL_COUNT', type: 'numeric' },
        { title: 'BSC NAME', field: 'BSC_NAME' },
        { title: 'BCF', field: 'BCF' },
        { title: 'TRX Count', field: 'TRX_Count' },
        { title: 'PRE ALARM', field: 'PRE_ALARM' },
        { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
        { title: 'RET', field: 'RET' },
        { title: 'POST VSWR', field: 'POST_VSWR' },
        { title: 'POST Alarms', field: 'POST_Alarms' },
        { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode', lookup: activityTypeSANSA },
        { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA', lookup: activityTypeSiwaLookup },
        // { title: 'Band (SIWA)', field: 'Band_SIWA', lookup: bandSiwaLookup },
        {
            title: 'Band (SIWA)',
            field: 'Band_SIWA',

            editComponent: props => {
                const selectedValues = props.value
                    ? props.value.split(',')
                    : [];

                return (
                    <Select
                        multiple
                        fullWidth
                        value={selectedValues}
                        onChange={e =>
                            props.onChange(e.target.value.join(','))
                        }
                        renderValue={selected => selected.join(', ')}
                    >
                        {bandSiwaOptions.map(band => (
                            <MenuItem key={band} value={band}>
                                <Checkbox checked={selectedValues.includes(band)} />
                                <ListItemText primary={band} />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        { title: 'CELL STATUS', field: 'CELL_STATUS' },
        { title: 'CTR STATUS', field: 'CTR_STATUS' },
        { title: 'Integration Remark', field: 'Integration_Remark' },
        { title: 'T2T4R', field: 'T2T4R' },
        { title: 'BBU TYPE', field: 'BBU_TYPE' },
        { title: 'BB CARD', field: 'BB_CARD' },
        { title: 'RRU Type', field: 'RRU_Type' },
        { title: 'Media Status', field: 'Media_Status' },
        { title: 'Mplane IP', field: 'Mplane_IP' },
        { title: 'SCF PREPARED_BY', field: 'SCF_PREPARED_BY' },
        { title: 'SITE INTEGRATE_BY', field: 'SITE_INTEGRATE_BY' },
        { title: 'Site Status', field: 'Site_Status' },
        {
            title: 'External Alarm Confirmation',
            field: 'External_Alarm_Confirmation'
        },
        { title: 'SOFT AT STATUS', field: 'SOFT_AT_STATUS' },
        { title: 'LICENCE Status', field: 'LICENCE_Status' },
        { title: 'ESN NO', field: 'ESN_NO' },
        {
            title: 'Responsibility_for_alarm_clearance',
            field: 'Responsibility_for_alarm_clearance'
        },
        { title: 'TAC', field: 'TAC' },
        { title: 'PCI TDD 20', field: 'PCI_TDD_20' },
        { title: 'PCI TDD 10/20', field: 'PCI_TDD_10_20' },
        { title: 'PCI FDD 2100', field: 'PCI_FDD_2100' },
        { title: 'PCI FDD 1800', field: 'PCI_FDD_1800' },
        { title: 'PCI L900', field: 'PCI_L900' },
        { title: '5G PCI', field: 'PCI_5G' },
        { title: 'RSI TDD 20', field: 'RSI_TDD_20' },
        { title: 'RSI TDD 10/20', field: 'RSI_TDD_10_20' },
        { title: 'RSI FDD 2100', field: 'RSI_FDD_2100' },
        { title: 'RSI FDD 1800', field: 'RSI_FDD_1800' },
        { title: 'RSI L900', field: 'RSI_L900' },
        { title: '5G RSI', field: 'RSI_5G' },
        { title: 'GPL', field: 'GPL' },
        { title: 'Pre/Post Check', field: 'Pre_Post_Check' },
        { title: 'CRQ', field: 'CRQ' },
        { title: 'Customer Approval', field: 'Customer_Approval' },
        { title: 'FR Date.', field: 'FR_Date' },
        { title: '4G HOTO Offered Date.', field: 'HOTO_Offered_Date_4g' },
        { title: '4G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_4g' },
        { title: '2G HOTO Offered Date.', field: 'HOTO_Offered_Date_2g' },
        { title: '2G HOTO Accepted Date.', field: 'HOTO_Accepted_Date_2g' },
         { title: 'Uploaded By', field: 'uploaded_by',editable: 'never' },
        { title: 'Upload Date', field: 'upload_date',editable: 'never' },
        // {
        //     title: 'Actions',
        //     field: 'actions',
        //     render: rowData => (
        //         <>
        //             {!userTypes?.includes('VI_IX_reader') && <IconButton aria-label="delete" title={'Edit'} size="large" onClick={() => { handleEdit(rowData) }}>
        //                 <DriveFileRenameOutlineIcon
        //                     style={{ cursor: 'pointer' }}
        //                     color='success'
        //                 />
        //             </IconButton>}
        //             {!userTypes?.includes('VI_IX_reader') && <IconButton aria-label="delete" title={'Delete'} size="large" onClick={() => { handleDelete(rowData) }}>
        //                 <DeleteOutlineIcon
        //                     style={{ cursor: 'pointer' }}
        //                     color='error'
        //                 />
        //             </IconButton>}
        //         </>

        //     )
        // }

    ]


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
                                    value={editData[key]}
                                    onChange={handleChange}
                                    size="small"
                                    type={key.includes('Date') ? 'date' : 'text'}
                                    InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
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
        // getStatus();
        // useEffect(()=>{
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
        //   },[])
    }, [])

    const downloadExcel = (data) => {
        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`VI_Integration_Tracker.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    }

    return (
        <>
            <div style={{ margin: '1% 1%' }}>
                <MaterialTable
                    title={'Integration Site Details'}
                    columns={columnData}
                    data={listData}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    // onRowClick={((evt, selectedRow) => console.log())}
                     icons={tableIcons}
                    editable={{
                        onRowAdd: newData =>
                            new Promise(async (resolve, reject) => {
                                try {

                                    const payload = {
                                        ...DEFAULT_ROW,
                                        ...newData,
                                    };
                                    const response = await axios.post(
                                        `${ServerURL}/IntegrationTracker/add_integration_record/`,
                                        payload,
                                        {
                                            headers: {
                                                Authorization: `token ${getDecreyptedData('tokenKey')}`,
                                            },
                                        }
                                    );
                                    // If backend returns created object with ID
                                    const savedData = response.data.data || newData;
                                    setListData(prevData => [...prevData, savedData]);
                                    navigate('/tools/Integration/dashboard')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Added',
                                        text: 'New row added successfully',
                                        timer: 1500,
                                        showConfirmButton: false,
                                    });
                                    resolve();
                                } catch (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.response?.data?.message || error.message,
                                    });
                                    reject();
                                }
                            }),

                        onRowUpdate: (newData, oldData) =>
                            new Promise(async (resolve, reject) => {
                                try {
                                    await axios.put(
                                        `${ServerURL}/IntegrationTracker/edit-integration-record/${oldData.id}/`,
                                        newData,
                                        {
                                            headers: {
                                                Authorization: `token ${getDecreyptedData('tokenKey')}`,
                                            },
                                        }
                                    );
                                    const updatedData = [...listData];
                                    updatedData[oldData.tableData.id] = newData;
                                    setListData(updatedData);
                                    navigate('/tools/Integration/dashboard')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Updated',
                                        text: 'Row updated successfully',
                                        timer: 1500,
                                        showConfirmButton: false,
                                    });

                                    resolve();
                                } catch (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.response?.data?.message || error.message,
                                    });
                                    reject();
                                }
                            }),

                        onRowDelete: oldData =>
                            new Promise(async (resolve, reject) => {
                                try {
                                    await axios.delete(
                                        `${ServerURL}/ix_tracker_vi/delete-integration-record/${oldData.id}/`,
                                        {
                                            headers: {
                                                Authorization: `token ${getDecreyptedData('tokenKey')}`,
                                            },
                                        }
                                    );
                                    const newData = listData.filter(item => item.id !== oldData.id);
                                    setListData(newData);

                                    // navigate('/tools/Integration/dashboard')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Deleted',
                                        text: 'Row deleted successfully',
                                        timer: 1500,
                                        showConfirmButton: false,
                                    });

                                    resolve();
                                } catch (error) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: error.response?.data?.message || error.message,
                                    });
                                    reject();
                                }
                            }),
                    }}
                    actions={[
                        {
                            icon: () => <DownloadIcon color='primary' fontSize='large' />,
                            tooltip: "Export to Excel",
                            onClick: () => downloadExcel(listData), isFreeAction: true
                        }
                    ]}

                    options={{
                        search: true,
                        paging: true,

                        // 🔥 THIS LINE MOVES ACTION BUTTONS TO FIRST COLUMN
                        actionsColumnIndex: 0,

                        headerStyle: {
                            backgroundColor: '#01579b',
                            color: '#FFF',
                            whiteSpace: 'nowrap',
                        },
                        rowStyle: {
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
            </div>

            {/* {handleDialogBox()} */}
        </>
    )
}

export default ComanDashboard