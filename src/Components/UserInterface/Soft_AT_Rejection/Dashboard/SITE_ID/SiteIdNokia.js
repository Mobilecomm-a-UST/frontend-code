import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';

const SiteIdNokia = () => {
    const listData = JSON.parse(localStorage.getItem("2G_site_ID"))
    const [selectedRows, setSelectedRows] = useState()
    const [site_ID, setSite_ID] = useState()
    const [status, setStatus] = useState()


    const handleLinkClick = async( rowData) => {

    };
    const handleTime=(data)=>{
        console.log('date and time ', data)
        var date = new Date(data)
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();

        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDateTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return(
            <div>
                {day}/{month}/{year} {formattedDateTime}
            </div>
        )
    }

    const columnData = [

        { title: 'Circle', field: 'Circle' },
        { title: 'Date_Time', field: 'Date_Time' , render: rowData =>( handleTime(rowData.Date_Time))},
        { title: 'OEM', field: 'OEM' },
        { title: 'TSP', field: 'TSP' },
        { title: 'Offered_Date', field: 'Offered_Date' },
        { title: 'AT_Type', field: 'AT_Type' },
        { title: 'Site_ID', field: 'Site_ID'},
        { title: 'MRBTS_ID', field: 'MRBTS_ID' },
        { title: 'Cell_ID', field: 'Cell_ID' },
        { title: 'DPR_Cell_Name', field: 'DPR_Cell_Name' },
        { title: 'LNCEL_ID', field: 'LNCEL_ID' },
        { title: 'MRBTS_Name', field: 'MRBTS_Name' },
        { title: 'Toco', field: 'Toco' },
        { title: 'Tech_info', field: 'Tech_info' },
        { title: 'Tech', field: 'Tech' },
        { title: 'Band', field: 'Band' },
        { title: 'Activity_Type', field: 'Activity_Type' },
        { title: 'Integration_date', field: 'Integration_date' },
        { title: 'On_Air_DATE', field: 'On_Air_DATE' },
        { title: 'Mplane', field: 'Mplane' },
        { title: 'Profile', field: 'Profile' },
        { title: 'BSC', field: 'BSC' },
        { title: 'BCF', field: 'BCF' },
        { title: 'Offer_Reoffer', field: 'Offer_Reoffer' },
        { title: 'LAC', field: 'LAC' },
        { title: 'TAC', field: 'TAC' },
        { title: 'Latitude_N', field: 'Latitude_N' },
        { title: 'Longitude_E', field: 'Longitude_E' },
        { title: 'FDD_MRBTS_ID', field: 'FDD_MRBTS_ID' },
        { title: 'FDD_Mplane_IP', field: 'FDD_Mplane_IP' },
        { title: 'RET_Count', field: 'RET_Count' },
        { title: 'Nominal_Type', field: 'Nominal_Type' },
        { title: 'Project_Remarks', field: 'Project_Remarks' },
        { title: 'Rejection_Remarks', field: 'Rejection_Remarks' },
        { title: 'Media', field: 'Media' },
        { title: 'Ckt_Id', field: 'Ckt_Id' },
        { title: 'SMP_ID', field: 'SMP_ID' },
        { title: 'Processed_By', field: 'Processed_By' },
        { title: 'AT_REMARK', field: 'AT_REMARK' },
        { title: 'AT_STATUS', field: 'AT_STATUS' },
        // { title: 'upload_date', field: 'upload_date' },
        { title: 'Reference_Id', field: 'Reference_Id' },
        { title: 'AoP', field: 'AoP' }
    ]


    const getStatus = () => {
        var arr = []
        listData?.map((item) => {
            console.log('status oem', item.AT_STATUS)
            arr.push(item.AT_STATUS)
        })
        setStatus(`( ${[...new Set(arr)]} )`);
    }


    const getSiteID=()=>{
        var arr = []
        listData?.map((item) => {
            // console.log('status oem', item.Site_ID_2G)
            arr.push(item.Site_ID)
        })
        setSite_ID(`${[...new Set(arr)]}`);
    }

    useEffect(() => {
        getStatus();
        getSiteID();
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])

    }, [])




    function renameKey(obj, oldKey, newKey) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
    }

    const downloadExcel = (data) => {


        // **************** FILEFY DEPENDANCY *****************
        var csvBuilder = new CsvBuilder(`OEM_Nokia_${status}_${site_ID}.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();

    }
  return (
    <div style={{ margin: '2% 4%' }}>
            <MaterialTable
                title={'OEM NOKIA ' + status+' ' + site_ID}
                columns={columnData}
                data={listData}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                actions={[
                    {
                        icon: () => <DownloadIcon color='primary' fontSize='large' />,
                        tooltip: "Export to Excel",
                        onClick: () => downloadExcel(listData), isFreeAction: true
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
                        color: '#FFF'
                    },

                }}
            />

        </div>
  )
}

export default SiteIdNokia