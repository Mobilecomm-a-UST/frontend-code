import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
// import outlabels from 'chartjs-plugin-piechart-outlabels';
import { getData, ServerURL } from '../../../../services/FetchNodeServices';
import CircleWise from './CircleWise';
import ProjectWise from './ProjectWise';
import ProjectCIrcle from './ProjectCIrcle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DonutChart from './DonutChart';



const OverAll = () => {
  const [month, setMonth] = useState([])
  const [selectMonth, setSelectMonth] = useState('JAN')
  const [year, setYear] = useState(2023)
  const [yearArr, setYearArr] = useState([])
  const [mobilecomm, setMobilecomm] = useState([])
  const [Ats, setAts] = useState([])
  const [Bharat, setBharat] = useState([])
  const [Frogcell, setFrogcell] = useState([])
  const [Maksat, setMaksat] = useState([])
  const [Reecomps, setReecomps] = useState([])
  const [Vedang, setVedang] = useState([])
  const [Vsn , setVsn] = useState([])
  const [percentages, setPercentages] = useState([])
  const [overall, setOverall] = useState()



  var vendors = ['Ats', 'Bharat', 'Frogcell', 'Maksat', 'Mobilecomm', 'Reecomps', 'Vedang', 'Vsn']
  console.log('circle wise month data', month)
  // console.log('mobilecomm',mobilecomm,'Ats',Ats,'Bharat',Bharat)

  const fetchData = async () => {
    const response = await getData('MDP/UBR/get_data/')
    setOverall(response.data)
    // console.log('all data .......', response)
    var arr = [];
    var arrYear = [];
    // var arrVendor = [];
    response.data?.map((item) => {
      arr.push(item.Month)
      arrYear.push(item.Year)
      // arrVendor.push(item.Partner)
    })

    // console.log('Over allll partner' , [...new Set(arrVendor)])
    setMonth([...new Set(arr)])
    setYearArr([...new Set(arrYear)])

    //  fetchVendorData(response.data)
    response.data?.map((it) => {
      if (it.Partner === 'Mobilecomm') {
        // Mobilecomm.push(it.sum_projected_count)
        setMobilecomm((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Ats') {
        setAts((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Bharat') {
        setBharat((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Frogcell') {
        setFrogcell((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Maksat') {
        setMaksat((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Vedang') {
        setVedang((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Vsn'){
        setVsn((prev) => [...prev, it.sum_projected_count])
      }
      else if (it.Partner === 'Reecomps'){
        setReecomps((prev) => [...prev, it.sum_projected_count])
      }
    })

    // FILTER PERCENTAGE DATA.....
    var filterMonth = response.data?.filter((item) => (item.Month === selectMonth))
    vendors.map((item) => {
      var filterVendors = filterMonth.filter((it) => (it.Partner === item))
      // console.log('qqqqqqqqqqqqqqq********',filterVendors[0].percentage)
      if(filterVendors.length > 0){
        setPercentages((prev) => [...prev, (filterVendors[0].percentage).toFixed(2)])
      }
      else{
        setPercentages((prev) => [...prev, 0])
      }
    })
  }

  const getPercentageData = (props) => {
    var filterMonth = overall?.filter((item) => (item.Month === props))
    // console.log('per %%%%%%' , filterMonth , props)
    vendors.map((item) => {
      var filterVendors = filterMonth?.filter((it) => (it.Partner === item))
      // console.log('qqqqqqqqqqqqqqq',filterVendors.length)
      if(filterVendors.length > 0){
        setPercentages((prev) => [...prev, (filterVendors[0].percentage).toFixed(2)])
      }
      else{
        setPercentages((prev) => [...prev, 0])
      }

    })
  }

  const data = {
    labels: month,
    datasets: [
      {
        label: 'Mobilecomm',
        data: mobilecomm,
        borderColor: 'black',
        backgroundColor: ['rgb(237,108,2,0.8)'],
        borderWidth: 1,
        borderRadius: 5,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Ats',
        data: Ats,
        borderColor: 'black',
        backgroundColor: ['rgb(27,67,147,0.7)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Bharat',
        data: Bharat,
        borderColor: 'black',
        backgroundColor: ['rgb(0,20,59,0.7)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Frogcell',
        data: Frogcell,
        borderColor: 'black',
        backgroundColor: ['rgb(244, 208, 63,0.8)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Maksat',
        data: Maksat,
        borderColor: 'black',
        backgroundColor: ['rgb(231, 76, 60,0.8)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4,
        borderRadius: 5
      },
      {
        label: 'Vedang',
        data: Vedang,
        borderColor: 'black',
        backgroundColor: ['rgb(23, 76, 60,0.8)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4,
        borderRadius: 5
      },
      {
        label: 'Reecomps',
        data: Reecomps,
        borderColor: 'black',
        backgroundColor: ['rgb(22, 160, 133, 0.83)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Vsn',
        data: Vsn,
        borderColor: 'black',
        backgroundColor: ['rgb(117, 14, 33,0.66)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
      // axis:'x',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 13,
            // weight: 'bold',
          },
          boxWidth: 18,
          // color: "white",
        }
      },
      title: {
        display: true,
        text: 'TOTAL SITES ALLOCATED',
        font: {
          size: 16,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'white',
        anchor: 'top',
        align: 'center',
        // formatter:(value,context)=>{
        //         console.log(context)
        // }

      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.01
          },
          pinch: {
            enabled: true,
            speed: 0.01
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x'
        },
      },
      aspectRatio: 1,
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          // color:"white"
        },
        stacked: true

      },
      y: {
        grid: {
          display: true,
          // color:'white'
        },
        ticks: {
          // forces step size to be 50 units
          stepSize: 1,
          // color:'white'
        },
        stacked: true,
        beginAtZero: true,
      }
    },
    watermark: {

      image: `${ServerURL}/media/assets/logo-new.png`,
      x: 50,
      y: 50,
      width: 300,
      height: 150,
      opacity: 0.15,
      alignX: "right",
      alignY: "top",
      alignToChartArea: false,
      position: "back"

    }
  }

  const optionsD = {
    responsive: true,
    plugins: {

      legend: {
        position: 'bottom',
        labels: {
          // This more specific font property overrides the global property
          font: {
            size: 13,
            // weight: 'bold',
          },
          boxWidth: 18,
          // color: "white",
        }
      },
      title: {
        display: false,
        text: `ALLOCATED`,
        font: {
          size: 16,
          weight: 'bold'
        }

      },
      datalabels: {
        display: true,
        color: 'white',
        anchor: 'end',
        align: 'start',
        formatter: (value, context) => {
          // console.log(value)
          return `${value} %`
        },

      },




      //   aspectRatio:2,
    }
  }



  useEffect(() => {
    fetchData()
    document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
  }, [])


  const handleClear = () => {
    setPercentages([]);
  }

  return (
    <>
      <div style={{ width: "100%", padding: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end', placeItems: 'center' }}>
        <div style={{ width: "60%", height: 350, borderRadius: 10, backgroundColor: "white", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
          <Bar
            style={{ height: 350, width: 650 }}
            data={data}
            options={options}

            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}>
          </Bar>
        </div>

        <div style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', width: "40%", height: 350, backgroundColor: "white", display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div>
            <Select value={selectMonth} onChange={(e) => { setSelectMonth(e.target.value); handleClear(); getPercentageData(e.target.value) }} style={{ height: '30px', width: '120px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
              {month?.map((item) => (
                <MenuItem value={item} key={item} >{item}</MenuItem>
              ))}
            </Select>
            <Select value={year} onChange={(e) => { setYear(e.target.value); }} style={{ height: '30px', width: '120px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
              {yearArr?.map((item) => (
                <MenuItem value={item} key={item} >{item}</MenuItem>
              ))}
            </Select>
          </div>
          <div style={{ width: "100%", height: 320, marginLeft: 100 }}>
            <Pie
              style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', height: 300 }}

              data={{
                labels: ['Ats', 'Bharat', 'Frogcell', 'Maksat', 'Mobilecomm', 'Reecomps', 'Vedang', 'Vsn'],
                datasets: [
                  {
                    //   label: 'Bucket wise(Pending Sites)',
                    data: percentages,
                    borderColor: ['rgb(27,67,147,0.7)', 'rgb(0,20,59,0.7)', 'rgb(244, 208, 63,0.8)', 'rgb(231, 76, 60,0.8)', 'rgb(237,108,2,0.8)', 'rgb(22, 160, 133, 0.83)', 'rgb(23, 76, 60,0.8)','rgb(117, 14, 33,0.66)'],
                    backgroundColor: ['rgb(27,67,147,0.7)', 'rgb(0,20,59,0.7)', 'rgb(244, 208, 63,0.8)', 'rgb(231, 76, 60,0.8)', 'rgb(237,108,2,0.8)', 'rgb(22, 160, 133, 0.83)', 'rgb(23, 76, 60,0.8)','rgb(117, 14, 33,0.66)'],
                    borderWidth: 2,
                    hoverBorderWidth: 2,
                    hoverBorderRadius: 5,
                    //   circumference:180,
                    //   rotation:270,
                  }]
              }}
              options={optionsD}
              plugins={[ChartDataLabels]}
            >
            </Pie>
          </div>

        </div>
      </div>
      <div style={{ width: "100%", padding: '10px' }}><CircleWise /></div>
      <div style={{ width: "100%", padding: '10px' }}><ProjectWise /></div>
      {/* <div style={{width:"100%",padding:'10px'}}><DonutChart /></div> */}
      <div style={{ width: "100%", padding: '10px', display: 'none' }}><ProjectCIrcle /></div>
    </>
  )
}

export default OverAll