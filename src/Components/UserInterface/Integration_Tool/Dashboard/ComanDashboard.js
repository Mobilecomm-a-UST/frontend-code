import React, { useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CsvBuilder } from 'filefy';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { ServerURL } from '../../../services/FetchNodeServices';
import { getDecreyptedData } from '../../../utils/localstorage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Check';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
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
    Old_Site_ID: "",
    Old_Site_Tech: "",
    Allocated_Tech: "",
    Deployed_Tech: "",
};


const ComanDashboard = () => {
    const reduxData = useSelector(state => state.IXtracker);
    const navigate = useNavigate();
    const [listData, setListData] = useState(
        getDecreyptedData('integration_final_tracker') || []
    );
    const tableIcons = {
        Edit: () => <EditIcon color="primary" />,
        Delete: () => <DeleteIcon color="error" />,
        Clear: () => <ClearIcon />,
        Check: () => <SaveIcon color="success" />,
        Add: () => <AddBoxIcon color="primary" />,
    };

    useEffect(() => {
        document.title = 'INTEGRATION DASHBOARD';
    }, []);

    // 🔹 TABLE COLUMNS
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
        // { title: '5G Configuration', field: 'Configuration_5G' },
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
        { title: 'Old Site ID', field: 'Old_Site_ID' },
        {
            title: 'Old Site Tech',
            field: 'Old_Site_Tech',
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
                        {oldSiteTechOptions.map(tech => (
                            <MenuItem key={tech} value={tech}>
                                <Checkbox checked={selectedValues.includes(tech)} />
                                <ListItemText primary={tech} />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        {
            title: 'Allocated Tech.', field: 'Allocated_Tech', editComponent: props => {
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
                        {oldSiteTechOptions.map(tech => (
                            <MenuItem key={tech} value={tech}>
                                <Checkbox checked={selectedValues.includes(tech)} />
                                <ListItemText primary={tech} />
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        {
            title: 'Deployed Tech.', field: 'Deployed_Tech', editComponent: props => {
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
                        {oldSiteTechOptions.map(tech => (
                            <MenuItem key={tech} value={tech}>
                                <Checkbox checked={selectedValues.includes(tech)} />
                                <ListItemText primary={tech} />
                            </MenuItem>
                        ))}
                    </Select>
                );
            }
        },

        // { title: 'Old Site Tech', field: 'Old_Site_Tech' },

    ];

    // 🔹 EXCEL EXPORT
    const downloadExcel = data => {
        new CsvBuilder('Integration_Tracker.csv')
            .setColumns(columnData.map(col => col.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();
    };

    return (
        <div style={{ margin: '1%' }}>
            <MaterialTable
                title="Integration Site Details"
                columns={columnData}
                data={listData}
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
                                    `${ServerURL}/IntegrationTracker/delete-integration-record/${oldData.id}/`,
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
                        icon: () => <DownloadIcon color="primary" />,
                        tooltip: 'Export to Excel',
                        isFreeAction: true,
                        onClick: () => downloadExcel(listData),
                    },
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
    );
};

export default ComanDashboard;
