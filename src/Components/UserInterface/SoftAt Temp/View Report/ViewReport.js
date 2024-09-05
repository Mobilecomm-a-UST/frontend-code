import React, { useEffect, useState } from 'react'
import MaterialTable from '@material-table/core'
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { CsvBuilder } from 'filefy';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useGet } from '../../../Hooks/GetApis';
import { useQuery } from '@tanstack/react-query';


const columnData = [{ title: 'CIRCLE', field: 'CIRCLE', width: 100 },
{ title: 'SITE ID', field: 'SITE_ID' },
{ title: 'UNIQUE ID', field: 'UNIQUE_ID' },
{ title: 'ENODEB ID', field: 'ENODEB_ID', width: 160 },
{ title: 'BAND', field: 'BAND', width: 200 },
{ title: 'CIRCLE PROJECT', field: 'Circle_Project', width: 150 },
{ title: 'OEM NAME', field: 'OEM_NAME', width: 100 },
{ title: 'STATUS', field: 'Status', width: 100 },
{ title: 'DATE', field: 'Date', width: 100 },
// { title: 'PENDING BUCKET', field: 'Pending_Bucket', width: 150 },
{ title: 'ALARM BUCKET', field: 'Alarm_Bucket', width: 300 },
{ title: 'AGEING', field: 'Internal_Ms1_Vs_Ms2_In_days', width: 100 },
{ title: 'UPLOAD DATE', field: 'Upload_date', width: 150 },
{ title: 'REMARKS', field: 'Final_Remarks', width: 300 },
{ title: 'Final Responsibility', field: 'Final_Responsibility', width: 300 },
]

const ViewReport = () => {
  const [viewData, setViewData] = useState()
  const [uploadDate, setUploadDate] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [open, setOpen] = useState(false)
  // const [loading , setLoading] = useState(false)
  const {loading,action}=useLoadingDialog()
  const {makeGetRequest}= useGet()

  const {data}= useQuery({
    queryKey:['soft_at_view_report'],
    queryFn:async()=>{
      action(true);
      const responce = await makeGetRequest('Soft_At/view_report/')
      if(responce){
        action(false)
        setUploadDate(responce.Upload_date)
        setViewData(responce.data)

        return responce;

      }
    },
    staleTime: 400000,
    refetchOnReconnect: false,

  })




  const fetchSoftATData = () => {
    setUploadDate(data.Upload_date)
    setViewData(data.data)

  }



  useEffect(() => {
    if(data){
      fetchSoftATData()
    }

      document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`

  }, [])

  const downloadExcel = (data) => {

    //  const workSheet = XLSX.utils.json_to_sheet(data)
    //  const workBook = XLSX.utils.book_new()
    //  XLSX.utils.book_append_sheet(workBook,workSheet,'vendorReport')
    // // Buffer
    // let buf = XLSX.write(workBook,{bookType:"xlsx",type:"buffer"})
    // // Binary string
    // XLSX.write(workBook,{bookType:"xlsx",type:"binary"})
    // // Download
    // XLSX.writeFile(workBook,"vendorReport.xlsx")


    // **************** FILEFY DEPENDANCY *****************
    var csvBuilder = new CsvBuilder("Soft_AT-Report.csv")
      .setColumns(columnData.map(item => item.title))
      .addRows(data.map(row => columnData.map(col => row[col.field])))
      .exportFile();

  }



  return (
    <div style={{ margin: '2% 4%' }}>
      <div style={{ margin: 5, marginLeft: 10 }}>
        <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
          <Link underline="hover" href='/tools'>Tools</Link>
          <Link underline="hover" href='/tools/soft_at'>Soft AT</Link>
          <Typography color='text.primary'>View Report</Typography>
        </Breadcrumbs>
      </div>
      <MaterialTable
        title="SOFT AT REPORT"
        columns={columnData}
        data={viewData}
        onSelectionChange={(rows) => setSelectedRows(rows)}
        actions={[
          {
            icon: () => <DownloadIcon color='primary' fontSize='large' />,
            tooltip: "Export to Excel",
            onClick: () => downloadExcel(viewData), isFreeAction: true
          }, {
            icon: () => <DeleteIcon color='primary' fontSize='large' />,
            tooltip: "Delete Data",
            onClick: () => setOpen(true), isFreeAction: true
          },
          {
            tooltip: 'Selected Rows download',
            icon: () => <DownloadIcon color='error' fontSize='large' />,

            onClick: (evt, data) => downloadExcel(data),
          },

        ]}

        options={{

          selection: true,
          search: true,
          grouping: true,
          headerStyle: {
            backgroundColor: '#01579b',
            color: '#FFF'
          },
          loadingType: 'linear',



        }}
      />
        {loading}
    </div>
  )
}

export default ViewReport