import React, { useCallback, useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'



const TotalDataDashboard = () => {
    const listDataa = useSelector(state => state.IXtracker.responce.table_data)
    const navigate = useNavigate();
    const [listData, setListData] = useState([])
    const [editDataID, setEditDataID] = useState('')
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState()
    const params = useParams()


    // console.log('redux data handler', listData)


    const columnData = [
        { title: 'OEM', field: 'OEM' },
        { title: 'Integration Date', field: 'Integration_Date' },
        { title: 'CIRCLE', field: 'CIRCLE' },
        { title: 'Activity Name', field: 'Activity_Name' },
        { title: 'Site ID', field: 'Site_ID' },
        { title: 'MO NAME', field: 'MO_NAME' },
        { title: 'LNBTS ID', field: 'LNBTS_ID' },
        { title: 'Technology (SIWA)', field: 'Technology_SIWA' },
        { title: 'OSS Details', field: 'OSS_Details' },
        { title: 'Cell ID', field: 'Cell_ID' },
        { title: 'CELL COUNT', field: 'CELL_COUNT' },
        { title: 'BSC NAME', field: 'BSC_NAME' },
        { title: 'BCF', field: 'BCF' },
        { title: 'TRX Count', field: 'TRX_Count' },
        { title: 'PRE ALARM', field: 'PRE_ALARM' },
        { title: 'GPS IP CLK', field: 'GPS_IP_CLK' },
        { title: 'RET', field: 'RET' },
        { title: 'POST VSWR', field: 'POST_VSWR' },
        { title: 'POST Alarms', field: 'POST_Alarms' },
        { title: 'Activity Mode (SA/NSA)', field: 'Activity_Mode' },
        { title: 'Activity Type (SIWA)', field: 'Activity_Type_SIWA' },
        { title: 'Band (SIWA)', field: 'Band_SIWA' },


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
        // {
        //     title: 'Actions',
        //     field: 'actions',
        //     render: rowData => (<>
        //         <IconButton aria-label="delete" title={'Edit'} size="large" onClick={() => { handleEdit(rowData) }}>
        //             <DriveFileRenameOutlineIcon
        //                 style={{ cursor: 'pointer' }}
        //                 color='success'
        //             />
        //         </IconButton>
        //         <IconButton aria-label="delete" title={'Delete'} size="large" onClick={() => { handleDelete(rowData) }}>
        //             <DeleteOutlineIcon
        //                 style={{ cursor: 'pointer' }}
        //                 color='error'
        //             />
        //         </IconButton>

        //     </>

        //     )
        // }

    ]


    // const handleDialogBox = useCallback(() => {

    //     return (<Dialog
    //         open={open}
    //         keepMounted
    //         fullWidth
    //         maxWidth={'lg'}

    //     >
    //         <DialogTitle>
    //             Edit Data
    //             <span style={{ float: 'right' }}><IconButton aria-label="close" onClick={() => setOpen(false)}><CloseIcon /> </IconButton></span>
    //         </DialogTitle>
    //         <DialogContent dividers={'paper'}>
    //             <form onSubmit={handleUpdateData} style={{ width: '100%', marginTop: 10 }}>

    //                 <Grid container spacing={2}>
    //                     {Object.keys(editData).map(key => (
    //                         <Grid item xs={3} key={key}>
    //                             <TextField
    //                                 variant="outlined"
    //                                 fullWidth
    //                                 placeholder={key.replace(/_/g, ' ')}
    //                                 label={key.replace(/_/g, ' ')}
    //                                 name={key}
    //                                 value={editData[key]}
    //                                 onChange={handleChange}
    //                                 size="small"
    //                                 type={key.includes('Date') ? 'date' : 'text'}
    //                                 InputLabelProps={key.includes('Date') ? { shrink: true } : {}}
    //                             />
    //                         </Grid>
    //                     ))}
    //                     <Grid item xs={12}>
    //                         <Button type="submit" fullWidth variant="contained">Update</Button>
    //                     </Grid>
    //                 </Grid>
    //             </form>
    //         </DialogContent>
    //     </Dialog>)


    // }, [open, editData])

    useEffect(() => {

        // let listDataa = useSelector(state => state.IXtracker)


        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`

    }, [])

    const downloadExcel = (data) => {
        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`Integration_Tracker.csv`)
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
                    data={listDataa}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    // onRowClick={((evt, selectedRow) => console.log())}
                    actions={[
                        {
                            icon: () => <DownloadIcon color='primary' fontSize='large' />,
                            tooltip: "Export to Excel",
                            onClick: () => downloadExcel(listDataa), isFreeAction: true
                        },
                        {
                            tooltip: 'Selected Rows download',
                            icon: () => <DownloadIcon color='error' fontSize='large' />,

                            onClick: (evt, data) => downloadExcel(data),
                        }
                    ]}

                    options={{
                        selection: true,
                        search: true,
                        exportButton: true,
                        grouping: true,
                        headerStyle: {
                            backgroundColor: '#01579b',
                            color: '#FFF',
                            width: 'auto',
                            whiteSpace: 'nowrap'
                        },
                        rowStyle: {
                            // backgroundColor: '#EEE',
                            width: 'auto',
                            whiteSpace: 'nowrap'
                        },


                    }}
                />
            </div>

            {/* {handleDialogBox()} */}
        </>
    )
}

export default TotalDataDashboard