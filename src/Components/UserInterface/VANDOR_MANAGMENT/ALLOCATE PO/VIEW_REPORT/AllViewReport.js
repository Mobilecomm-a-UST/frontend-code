import React,{useEffect,useState} from 'react'
import MaterialTable from '@material-table/core'
import {getData} from "../../../../services/FetchNodeServices"
// import * as XLSX from 'xlsx';
// import { Button } from '@material-ui/core';
import DownloadIcon from '@mui/icons-material/Download';
import { CsvBuilder } from 'filefy';


const columnData =  [{ title: 'MDP Month', field: 'MDP_Month' },
  { title: 'Circle', field: 'Circle' },
  { title: 'Site ID', field: 'Site_ID' },
  {
    title: 'Unique Site Id As per central DPR',
    field: 'Unique_Site_Id_As_per_central_DPR',
  },
  {title:'Site Name',field:'Site_Name'},
  {title:'Active Name',field:'Active_Name'},
  {title:'Activity Discription',field:'Activity_Discription'},
  {title:'Line Item',field:'Line_Item'},
  {title:'Alotment date To Vendor',field:'Alotment_date_To_Vendor'},
  {title:'Vendor Name',field:'Vendor_Name'},
  {title:'Vendor Code',field:'Vendor_Code'},
  {title:'Activity Date',field:'Activity_Date'},
  {title:'Activity Completion Status',field:'Activity_Completion_Status'},
  {title:'Material Reco Status',field:'Material_Reco_Status'},
  {title:'Material Reco Date',field:'Material_Reco_Date'},
  {title:'Activity AT Status',field:'Activity_AT_Status'},
  {title:'Activity AT Date',field:'Activity_AT_Date'},
  {title:'Vendor PO (Eligible)',field:'Vendor_PO_Eligible'},
  {title:'Vendor PO Requestor',field:'Vendor_PO_Requestor'},
  {title:'Vendor PO Approver',field:'Vendor_PO_Approver'},
  {title:'Vendor PO Date',field:'Vendor_PO_Date'},
  {title:'Vendor PO No.',field:'Vendor_PO_No'},
  {title:'Vendor Invoice (Eligiblity)',field:'Vendor_Invoice_Eligiblity'},
  {title:'Vendor Invoice Approval Name from Circle',field:'Vendor_Invoice_pproval_Name_from_Circle'},
  {title:'Vendor Invoice Approval Name from Central',field:'Vendor_Invoice_Approval_Name_from_Central'},
  {title:'Invoice Date',field:'Invoice_Date'},
  {title:'Invoice No.',field:'Invoice_No'}]

const AllViewReport = () => {
   const [viewData,setViewData] = useState()
   const [selectedRows , setSelectedRows] =  useState()

   console.log('XXXXXXXXXXXXXX',columnData[0].title)


const fetchViewReportData=async()=>
{
  const response = await getData('vendor_management/allocate_po/view')
  console.log('DATA:',response.data)
  setViewData(response.data)
}

useEffect(()=>{
   fetchViewReportData()
   document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
},[])

function renameKey ( obj, oldKey, newKey ) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

const downloadExcel=(data)=>
{

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
  var csvBuilder = new CsvBuilder("Allocate_po_no.csv")
  .setColumns(columnData.map(item=>item.title))
  .addRows(data.map(row=>columnData.map(col=>row[col.field])))
  .exportFile();

}


  return (
    <div style={{margin:'2% 4%'}}>
         <MaterialTable
      title="ALLOCATE PO REPORT"
      columns={columnData}
      data={viewData}
onSelectionChange={(rows)=>setSelectedRows(rows)}
      actions={[
        {icon:()=><DownloadIcon color='primary' fontSize='large'/>,
      tooltip:"Export to Excel",
       onClick:()=>downloadExcel(viewData),isFreeAction:true},
      {
        tooltip: 'Selected Rows download',
        icon:()=><DownloadIcon color='error' fontSize='large'/>,

        onClick: (evt, data) => downloadExcel(data),
      }
      ]}

      options={{
        selection:true,
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

export default AllViewReport;