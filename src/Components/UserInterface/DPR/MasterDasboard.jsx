import React,{useState,useEffect} from 'react'
import {getData} from '../../services/FetchNodeServices'
// import { useStyles } from './MasterDasboardCss';

// const data = [
//     {
//       id: 1,
//       email: 'Leora13@yahoo.com',
//       firstName: 'Ernest Schuppe Anderson',
//       lastName: null,
//       city: 'New Gust',
//       companyName: 'Lebsack - Nicolas'
//     },
//     {
//       id: 2,
//       email: 'Mose_Gerhold51@yahoo.com',
//       firstName: 'Janis',
//       lastName: 'Bode',
//       city: 'New Gust',
//       companyName: 'Glover - Hermiston'
//     }
//   ];
//   const hadercell = {
//     background:"red",
//     color:"white",
//     fontFamily:"Poppins",
//     fontSize:"16px",
//     textAlign:"center"
//   };

// const { Column, ColumnGroup, HeaderCell, Cell } = Table;

// const tabledata=()=>
// {

// }

export default function MasterDasboard() {
    // const classes = useStyles();
  const [tabdata, setTabdata] = useState([])


  const getTableData= async()=>
  {
    const response = await getData('trend/MasterDashboard/')
    console.log(response);
    setTabdata(response)
  }
  useEffect(function () {
    getTableData();
  }, []);

  const tdata = () => {
    var arr = [];
    Object.keys(tabdata)?.map((item) => {
      Object.keys(tabdata[item]).map((itm) => {
        arr.push({ ...tabdata[item][itm], project: itm, circle: item });
      });
    });
    return arr?.map((it,i) => {
      return (
        <tr key={i} style={{textAlign:"center",fontWeigth:700}}>
          <th>{it.circle}</th>
          <th>{it.project}</th>
          <th>{it.RFAI_Done}</th>
          <th>{it.MS1_Done}</th>
          <th>{it.MS1_Pendency}</th>
          <th>{it.MS2_Done}</th>
          <th>{it.MS2_Pendency}</th>
          <th>{it.MS1_0_15}</th>
          <th>{it.MS1_16_30}</th>
          <th>{it.MS1_31_60}</th>
          <th>{it.MS1_61_90}</th>
          <th>{it.MS1_GT90}</th>
          <th>{it.MS2_0_15}</th>
          <th>{it.MS2_16_30}</th>
          <th>{it.MS2_31_60}</th>
          <th>{it.MS2_61_90}</th>
          <th>{it.MS2_GT90}</th>
        </tr>
      );
    });
  };

  return (<>
    <div style={{padding:10,marginLeft:'10px'}}>
      {/* <iframe style={{width:"100%"}}> */}
    <table border="3"  style={{width:"100%",border:"2px solid"}}>
  <tr>
    <th colspan="17" style={{fontSize:24,backgroundColor:"red",color:"white",}}>Overall</th>
  </tr>
  <tr style={{fontSize:20,backgroundColor:"red",color:"white",}}>
    <th rowspan="2" >circle</th>
    <th rowspan="2">project</th>
    <th rowspan="2">RAFI Done</th>
    <th colspan="2">MS1</th>
    <th colspan="2">MS2</th>
    <th colspan="5">Ageing in days-MS1</th>
    <th colspan="5">Ageing in days-MS2</th>
  </tr>
  <tr style={{fontSize:16,backgroundColor:"red",color:"white",height:"50px"}}>
  <th>MS1 Done</th>
  <th>MS1 Pendency</th>
  <th>MS2 Done</th>
  <th>MS2 Pendency</th>
  <th>0-15</th>
  <th>16-30</th>
  <th>31-60</th>
  <th>61-90</th>
  <th>GT90</th>
   <th>0-15</th>
  <th>16-30</th>
  <th>31-60</th>
  <th>61-90</th>
  <th>GT90</th>
  </tr>

  {tdata()}





</table>
{/* </iframe> */}
    </div>
    </>
  )
}
