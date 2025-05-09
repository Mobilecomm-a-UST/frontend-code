import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { getData, ServerURL } from '../../../../services/FetchNodeServices';
import CircleWise from './CircleWise';
import ProjectWise from './ProjectWise';
import ProjectCIrcle from './ProjectCIrcle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

const TotalSite = () => {
    const [month, setMonth] = useState([])
    const [selectMonth, setSelectMonth] = useState('JAN')
    const [year, setYear] = useState(2023)
    const [yearArr, setYearArr] = useState([])
    const [mobilecomm, setMobilecomm] = useState([])
    const [nokia, setNokia] = useState([])
    const [ericsson, setEricsson] = useState([])
    const [vedang, setVedang] = useState([])
    const [arial, setArial] = useState([])
    const [other, setOther] = useState([])
    const [zte, setZte] = useState([])
    const [percentages, setPercentages] = useState([])
    const [overall, setOverall] = useState()
    const [checked, setChecked] = useState(false);
    var vendors = ['MobileComm', 'Nokia', 'Ericsson', 'Vedang', 'Aerial', 'ZTE', 'Other']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const [hading , setHading] = useState('COUNT')
    console.log('circle wise month data', month)

    
  const fetchData = async () => {
    const response = await getData('MDP/get_data/')
    setOverall(response.data)
    console.log('all data .......', response)
    var arr = [];
    var arrYear = [];
    response.data?.map((item) => {
      arr.push(item.MONTH)
      arrYear.push(item.YEAR)
    })

    setMonth([...new Set(arr)])
    setYearArr([...new Set(arrYear)])

    //  fetchVendorData(response.data)
    months?.map((items) => {
      var filterCircle = response.data?.filter((item) => (item.MONTH == items))

      filterCircle?.map((it) => {
        if (it.COMPATITOR === 'MobileComm') {
          setMobilecomm((prev) => [...prev, it.sum_projected_count])
        }
        else if (it.COMPATITOR === 'Nokia') {
          setNokia((prev) => [...prev, it.sum_projected_count])
        }
        else if (it.COMPATITOR === 'Ericsson') {
          setEricsson((prev) => [...prev, it.sum_projected_count])
        }
        else if (it.COMPATITOR === 'Vedang') {
          setVedang((prev) => [...prev, it.sum_projected_count])
        }
        else if (it.COMPATITOR === 'Aerial') {
          setArial((prev) => [...prev, it.sum_projected_count])
        }
        else if (it.COMPATITOR === 'ZTE') {
          setZte((prev) => [...prev, it.sum_projected_count])
        }
        else {
          setOther((prev) => [...prev, it.sum_projected_count])
        }
      })
    })

    // FILTER PERCENTAGE DATA.....
    var filterMonth = response.data?.filter((item) => (item.MONTH === selectMonth))
    vendors.map((item) => {
      var filterVendors = filterMonth.filter((it) => (it.COMPATITOR === item))
      // console.log('qqqqqqqqqqqqqqq********',filterVendors[0].percentage)
      if (filterVendors.length > 0) {
        setPercentages((prev) => [...prev, (filterVendors[0].percentage).toFixed(2)])
      }
      else {
        setPercentages((prev) => [...prev, 0])
      }
    })
  }

  const getPercentageData = (props) => {
    var filterMonth = overall?.filter((item) => (item.MONTH === props))
    // console.log('per %%%%%%' , filterMonth , props)
    vendors.map((item) => {
      var filterVendors = filterMonth?.filter((it) => (it.COMPATITOR === item))
      // console.log('qqqqqqqqqqqqqqq',filterVendors.length)
      if (filterVendors.length > 0) {
        setPercentages((prev) => [...prev, (filterVendors[0].percentage).toFixed(2)])
      }
      else {
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
        label: 'Nokia',
        data: nokia,
        borderColor: 'black',
        backgroundColor: ['rgb(27,67,147,0.7)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Ericsson',
        data: ericsson,
        borderColor: 'black',
        backgroundColor: ['rgb(0,20,59,0.7)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Vedang',
        data: vedang,
        borderColor: 'black',
        backgroundColor: ['rgb(244, 208, 63,0.8)'],
        borderWidth: 1,
        borderRadius: 5,
        color: 'red',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Aerial',
        data: arial,
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
        label: 'ZTE',
        data: zte,
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
        label: 'Other',
        data: other,
        borderColor: 'black',
        backgroundColor: ['rgb(22, 160, 133, 0.83)'],
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
          // color: "white",
          boxWidth: 18,
        }
      },
      title: {
        display: true,
        text: `TOTAL SITES ALLOCATED COUNT `,
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
        //         return value + "%";
        // }
        // formatter: (value, ctx) => {
        //   const datapoints = ctx.chart.data.datasets[0].data
        //    const total = datapoints.reduce((total, datapoint) => total + datapoint, 0)
        //   const percentage = value / total * 100
        //   return percentage.toFixed(2) + "%";
        // },

      },
    //   zoom: {
    //     zoom: {
    //       wheel: {
    //         enabled: true,
    //         speed: 0.01
    //       },
    //       pinch: {
    //         enabled: true,
    //         speed: 0.01
    //       },
    //       mode: 'x',
    //     },
    //     pan: {
    //       enabled: true,
    //       mode: 'x'
    //     },
    //   },
    //   aspectRatio: 1|2,
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
          // color: "white",
          boxWidth: 18,
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
        }
      },


      //   aspectRatio:2,
    }
  }

  
  useEffect(() => {
    fetchData()
  }, [])


  const handleClear = () => {
    setPercentages([]);
  }

  const handleClearForTotalSite = () => {
    setMobilecomm([])
    setNokia([])
    setEricsson([])
    setVedang([])
    setArial([])
    setZte([])
    setOther([])


  }

  // Handle toggle button......
  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      months?.map((items) => {
        var filterCircle = overall?.filter((item) => (item.MONTH == items))

        filterCircle?.map((it) => {
          if (it.COMPATITOR === 'MobileComm') {
            setMobilecomm((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else if (it.COMPATITOR === 'Nokia') {
            setNokia((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else if (it.COMPATITOR === 'Ericsson') {
            setEricsson((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else if (it.COMPATITOR === 'Vedang') {
            setVedang((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else if (it.COMPATITOR === 'Aerial') {
            setArial((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else if (it.COMPATITOR === 'ZTE') {
            setZte((prev) => [...prev, it.percentage.toFixed(2)])
          }
          else {
            setOther((prev) => [...prev, it.percentage.toFixed(2)])
          }
        })
      })
    } else{
      months?.map((items) => {
        var filterCircle = overall?.filter((item) => (item.MONTH == items))
  
        filterCircle?.map((it) => {
          if (it.COMPATITOR === 'MobileComm') {
            setMobilecomm((prev) => [...prev, it.sum_projected_count])
          }
          else if (it.COMPATITOR === 'Nokia') {
            setNokia((prev) => [...prev, it.sum_projected_count])
          }
          else if (it.COMPATITOR === 'Ericsson') {
            setEricsson((prev) => [...prev, it.sum_projected_count])
          }
          else if (it.COMPATITOR === 'Vedang') {
            setVedang((prev) => [...prev, it.sum_projected_count])
          }
          else if (it.COMPATITOR === 'Aerial') {
            setArial((prev) => [...prev, it.sum_projected_count])
          }
          else if (it.COMPATITOR === 'ZTE') {
            setZte((prev) => [...prev, it.sum_projected_count])
          }
          else {
            setOther((prev) => [...prev, it.sum_projected_count])
          }
        })
      })
    }

  };
  return (
    <>
    <div style={{ width: "100%", padding: 10, display: 'flex', gap: '10px', justifyContent: 'flex-end', placeItems: 'center' }}>
      <div style={{ width: "100%", height: '400px', borderRadius: 10, backgroundColor: "white", boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',padding:5 }}>
        {/* <div>
         
          <Switch checked={checked} onChange={(e) => { handleClearForTotalSite(); handleChange(e) }} size='small' /><span style={{ fontWeight: 'bolder', font: 15 }}>%</span>
        </div> */}


        <Bar
          style={{ height: '200px', width: 500 }}
          data={data}
          options={options}

          plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}>
        </Bar>
      </div>

      {/* <div style={{ borderRadius: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', width: "40%", height: 360, backgroundColor: "white", display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
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
        <div style={{ width: "80%", height: 320, marginLeft: '10%' }}>
          <Doughnut
            style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', height: 300 }}

            data={{
              labels: ['Mobilecomm', 'Nokia', 'Ericsson', 'Vedang', 'Aerial', 'ZTE', 'Other'],
              datasets: [
                {
                  //   label: 'Bucket wise(Pending Sites)',
                  data: percentages,
                  borderColor: ['rgb(237,108,2,0.8)', 'rgb(27,67,147,0.7)', 'rgb(0,20,59,0.7)', 'rgb(244, 208, 63,0.8)', 'rgb(231, 76, 60,0.8)', 'rgb(23, 76, 60,0.8)', 'rgb(22, 160, 133, 0.83)'],
                  backgroundColor: ['rgb(237,108,2,0.8)', 'rgb(27,67,147,0.7)', 'rgb(0,20,59,0.7)', 'rgb(244, 208, 63,0.8)', 'rgb(231, 76, 60,0.8)', 'rgb(23, 76, 60,0.8)', 'rgb(22, 160, 133, 0.83)'],
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
          </Doughnut>
        </div>

      </div> */}
    </div>
   
  </>
  )
}

export default TotalSite