import React from 'react'
import { postData, getData } from '../../../../services/FetchNodeServices'
import { useState } from 'react'
import { useEffect } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Slide from '@mui/material/Slide';
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";

const Tables = () => {
  const [circle, setCircle] = useState('UPW')
  const [month, setMonth] = useState('JAN')
  const [circleArr, setCircleArr] = useState([])
  const [allData, setAllData] = useState([])
  const navigate = useNavigate();
  const [months, setMonths] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])



  const fetchSelectedData = async () => {
    const response = await getData('MDP/unique_column_value/')
    // console.log('project Circle data......2222', response)
    setCircleArr([...circleArr, ...response.circle])

  }

  const fetchTableData = async () => {
    const formData = new FormData();
    formData.append('circle', circle)
    formData.append('MONTH', month);
    const response = await postData('MDP/pro_wise_partners_rank/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
    const data = JSON.parse(response.data)
    setAllData(data)

    getTableData()
  }
  // ON SELECT CIRCLE ..................
  const fetchTableDataCircleWise = async (props) => {
    const formData = new FormData();
    formData.append('circle', props)
    formData.append('MONTH', month);
    const response = await postData('MDP/pro_wise_partners_rank/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
    const data = JSON.parse(response.data)
    setAllData(data)

    getTableData()
  }

  // ON SELECT MONTH .......................
  const fetchTableDataMonthWise = async (props) => {
    const formData = new FormData();
    formData.append('circle', circle)
    formData.append('MONTH', props);
    const response = await postData('MDP/pro_wise_partners_rank/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
    const data = JSON.parse(response.data)
    console.log('data .  .  . . . . ', data)
    setAllData(data)

    getTableData()
  }

  const getTableData = () => {
    var arr = [];
    Object.keys(allData)?.map((item) => {
      arr.push({ ...allData[item], project: item });
    });
    // console.log('2222222', arr)

    return arr?.map((it, i) => {
      return (

        <tr key={i} style={{ textAlign: "center", fontWeigth: 700 }}>
          <th>{it.project}</th>
          <th>{it.MobileComm}</th>
          <th>{it.Ericsson}</th>
          <th>{it.Nokia}</th>
          <th>{it.Ariel}</th>
          <th>{it.Vedang}</th>
          <th>{it.Other}</th>
        </tr>

      );
    });

  }




  useEffect(() => {
    fetchSelectedData();
    fetchTableData();
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  }, [])


  return (
    <>
      <style>{"th,td{border:1px solid black;}"}</style>
      <Slide direction="left" in={true} timeout={800} style={{ transformOrigin: '1 1 1' }} mountOnEnter unmountOnExit>
        <div>
        <div style={{ margin: 10, marginLeft: 10 }}>
          <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>
            <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
            <Link underline="hover" onClick={() => { navigate('/tools/mdp') }}>MDP Tools</Link>
            <Typography color='text.primary'>Dashboard</Typography>
          </Breadcrumbs>
        </div>
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', marginTop: 10, padding: 10, height: 'auto', width: "98%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 200, height: 'auto', borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}>
              <FilterAltIcon />FILTER DATA
            </div>
            <div>
              <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
              <Select value={circle} onChange={(e) => { setCircle(e.target.value); fetchTableDataCircleWise(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                {/* <option  disabled selected hidden>Select Ageing</option> */}
                {circleArr?.map((item) => (
                  <MenuItem value={item} key={item} >{item}</MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <InputLabel style={{ fontSize: 15 }}>SELECT MONTH</InputLabel>
              <Select value={month} onChange={(e) => { setMonth(e.target.value); fetchTableDataMonthWise(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                <MenuItem disabled value="">
                  <em>Select Month</em>
                </MenuItem>
                {months.map((item) => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ width: "78%", height: 'auto', border: "1px solid black" }}>
            <table style={{ width: "100%", height: 'auto', border: "1px solid black", borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th colSpan="19" style={{ fontSize: 20, color: "black", backgroundColor: 'rgb(237,108,2,0.8)' }}>MONTHLY RATING TABLE</th>
                </tr>
                <tr style={{ fontSize: 16, backgroundColor: "#223354", color: "white", }}>
                  <th>PROJECT</th>
                  <th>MobileComm</th>
                  <th>Ericsson</th>
                  <th>Nokia</th>
                  <th>Ariel</th>
                  <th>Vedang</th>
                  <th>Other</th>
                </tr>
              </thead>
              <tbody>
                {getTableData()}
              </tbody>

            </table>
          </div>
        </div>
        </div>
      </Slide>
    </>
  )
}

export default Tables