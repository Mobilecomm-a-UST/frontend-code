import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import { postData } from '../../../../../services/FetchNodeServices';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';





function toCamelCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

const OemCambium = () => {
    const listData = JSON.parse(localStorage.getItem("oem_data"))
    const [status, setStatus] = useState()
    const [selectedRows, setSelectedRows] = useState()

    const handleLinkClick = async (rowData) => {
        // Your custom logic when a link is clicked
        // console.log('Link Clicked:', toCamelCase(rowData.OEM));
        var formData = new FormData();

        formData.append('site_id', rowData.Site_ID_2G)
        formData.append('oem', toCamelCase(rowData.OEM))
        formData.append('status', rowData.AT_STATUS)

        const response = await postData('softat_rej/site_wise_view', formData)
        localStorage.setItem("2G_site_ID", JSON.stringify(response.data));
        // console.log('response data in huawia site id' , response)
        window.open(`${window.location.href}/site_id_2G`, "_blank")


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
        { title: 'Site ID', field: 'Site_ID' },
        { title: 'Site Type', field: 'Site_Type' },
        { title: 'TSP', field: 'TSP' },
        { title: 'Link_id', field: 'Link_Id' },
        { title: 'RA_Number', field: 'RA_Number'},
        { title: 'CKT_ID', field: 'CKT_ID' },
        { title: 'UBR_Make_Oem', field: 'UBR_Make_OEM' },
        { title: 'UBR Model', field: 'UBR_Model' },
        { title: 'Site A IP', field: 'Site_A_IP' },
        { title: 'Site B IP', field: 'Site_B_IP' },
        { title: 'Re-offer', field: 'Re_offer' },
        { title: 'Soft /Physical ', field: 'Soft_Physical' },
        { title: 'Offered Date ', field: 'Offered_Date' },
        { title: 'AT Status', field: 'AT_Status' },
        { title: 'Reasons', field: 'Reasons' },
    ]


    const getStatus = () => {
        var arr = []
        listData?.map((item) => {
            console.log('status oem', item.AT_Status)
            arr.push(item.AT_Status)
        })
        setStatus(`( ${[...new Set(arr)]} )`);



    }

    useEffect(() => {
        getStatus();
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
        var csvBuilder = new CsvBuilder(`OEM_Huawia_${status}.csv`)
            .setColumns(columnData.map(item => item.title))
            .addRows(data.map(row => columnData.map(col => row[col.field])))
            .exportFile();

    }
    return (
        <div style={{ margin: '2% 4%' }}>
            <MaterialTable
                title={'OEM CAMBIUM ' + status}
                columns={columnData}
                data={listData}
                onSelectionChange={(rows) => setSelectedRows(rows)}
                onRowClick={((evt, selectedRow) => console.log())}
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

export default OemCambium