import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import { postData, getData } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';


const DonutChart = () => {
    const [circle, setCircle] = useState('UPW')
    const [circleArr, setCircleArr] = useState(['ALL'])
    const [projectArr, setProjectArr] = useState(['NT', 'ULS', 'RELOCATION', 'Upgrades', 'UBR - Mobility', 'UBR - Swap', 'MW', 'Degrow', 'RET', 'IBS'])
    const [vendor, setVendor] = useState(['ALL'])
    const [monthDoneCount, setMonthDoneCount] = useState([])
    const [monthProjectCount, setMonthProjectCount] = useState([])
    const [month, setMonth] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])
    const [selectMonth, setSelectMonth] = useState('JAN')
    const [selectVendor, setSelectVendor] = useState('MobileComm')
    const ProjectArrs = ['NT', 'ULS', 'RELOCATION', 'Upgrades', 'UBR - Mobility', 'UBR - Swap', 'MW', 'Degrow', 'RET', 'IBS']




    const fetchSelectedData = async () => {
        const response = await getData('MDP/unique_column_value/')
        console.log('project Circle data......2222', response)
        setCircleArr([...circleArr, ...response.circle])
        setVendor([...vendor   , ...response.compatitor])
        // setProjectArr(response.project)
        // getProjectFilterData();
    }


    const getProjectCount = async () => { 
        setMonthProjectCount([]);

        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'False')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        console.log('q1111111',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))
          console.log('q222222', filterCircle,projectArr)
          projectArr?.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('q3333333',filterProject)
            setMonthProjectCount((prev) => [...prev, (filterProject[0].Counting)])
        })
    }
    const getDoneCount = async () => {
        setMonthDoneCount([]);
        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'True')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log('qsssssssssssssssss',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))

        projectArr.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('$$$$$$',filterProject)
            setMonthDoneCount((prev) => [...prev, (filterProject[0].Counting)])
        })

    }

    // ******** ON SELECT CIRCLE **********//////
    const getCircleProjectCount = async (props) => { 
        setMonthProjectCount([]);

        const formData = new FormData();
        formData.append("CIRCLE", props)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'False')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        console.log('q1111111',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))
          console.log('q222222', filterCircle,projectArr)
          projectArr?.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('q3333333',filterProject)
            setMonthProjectCount((prev) => [...prev, (filterProject[0].Counting)])
        })
    }
    const getCircleDoneCount = async (props) => {
        setMonthDoneCount([]);
        const formData = new FormData();
        formData.append("CIRCLE", props)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'True')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log('qsssssssssssssssss',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))

        projectArr.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('$$$$$$',filterProject)
            setMonthDoneCount((prev) => [...prev, (filterProject[0].Counting)])
        })

    }

    // ******* ON SELECT VENDOR ***********//////
    const getVendorProjectCount = async (props) => { 
        setMonthProjectCount([]);

        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", props)
        formData.append("DONE_COUNT", 'False')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        console.log('q1111111',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))
          console.log('q222222', filterCircle,projectArr)
          projectArr?.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('q3333333',filterProject)
            setMonthProjectCount((prev) => [...prev, (filterProject[0].Counting)])
        })
    }
    const getVendorDoneCount = async (props) => {
        setMonthDoneCount([]);
        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", props)
        formData.append("DONE_COUNT", 'True')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log('qsssssssssssssssss',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == selectMonth))

        projectArr.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('$$$$$$',filterProject)
            setMonthDoneCount((prev) => [...prev, (filterProject[0].Counting)])
        })

    }

    // ****** ON SELECT MONTHS ********* //////

    const getMonthProjectCount = async (props) => { 
        setMonthProjectCount([]);

        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'False')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        console.log('q1111111',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == props))
          console.log('q222222', filterCircle,projectArr)
          projectArr?.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('q3333333',filterProject)
            setMonthProjectCount((prev) => [...prev, (filterProject[0].Counting)])
        })
    }
    const getMonthDoneCount = async (props) => {
        setMonthDoneCount([]);
        const formData = new FormData();
        formData.append("CIRCLE", circle)
        formData.append("COMPATITOR", selectVendor)
        formData.append("DONE_COUNT", 'True')
        const response = await postData('MDP/project_comparision/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log('qsssssssssssssssss',response.data)
        var datas = response.data

        var filterCircle = datas?.filter((item) => (item.MONTH == props))

        projectArr.map((item) => {
            var filterProject = filterCircle?.filter((items) => (items.project == item))
            console.log('$$$$$$',filterProject)
            setMonthDoneCount((prev) => [...prev, (filterProject[0].Counting)])
        })

    }

        // OPTION FOR PROJECT COUNT
        const optionsD1 = {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 10,
                            // weight: 'bold',
                        },
                        // color: "white",
                    }
                },
                title: {
                    display: true,
                    text: `${selectMonth}.. ALLOCATED COUNT`,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                datalabels: {
                    align: 'center',
                    display: true,
                    color: 'black',
                    anchor: 'end',
                    align: 'start',
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    formatter: (value, context) => {
                        // console.log(value)
                        const datapoint = context.chart.data.datasets[0].data;
                        // console.log('cccccccccc',datapoint)
                        function totalSum(total, datapoint) {
                            return total + datapoint;
                        }
                        const totalvalue = datapoint.reduce(totalSum, 0);
                        const percentageValue = (value / totalvalue * 100).toFixed(2);
                        const displayData = [`${percentageValue}%`]
    
                        return displayData
                    }
                }
            }
        }
            // OPTION FOR DONE COUNT
    const optionsD2 = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    // This more specific font property overrides the global property
                    font: {
                        size: 10,
                        // weight: 'bold',
                    },
                    // color: "white",
                }
            },
            title: {
                display: true,
                text: `${selectMonth}.. DONE COUNT`,
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            datalabels: {
                align: 'center',
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'start',
                font: {
                    size: 10,
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    // console.log(value)
                    const datapoint = context.chart.data.datasets[0].data;
                    // console.log('cccccccccc',datapoint)
                    function totalSum(total, datapoint) {
                        return total + datapoint;
                    }
                    const totalvalue = datapoint.reduce(totalSum, 0);
                    const percentageValue = (value / totalvalue * 100).toFixed(2);
                    const displayData = [`${percentageValue}%`]

                    return displayData
                }
                // labels:{
                //     return:'percentage'
                // }
            }

            //   aspectRatio:2,
        }
    }

 useEffect(()=>{
    fetchSelectedData();
    getProjectCount();
    getDoneCount()
 },[])

  return (
    <>
    <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 'auto', width: "auto", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}>
                    <FilterAltIcon />FILTER DATA
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
                    <Select value={circle} onChange={(e) => { setCircle(e.target.value);getCircleProjectCount(e.target.value);getCircleDoneCount(e.target.value)  }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {circleArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT PARTNER</InputLabel>
                    <Select value={selectVendor} onChange={(e) => { setSelectVendor(e.target.value);getVendorProjectCount(e.target.value);getVendorDoneCount(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {/* <option  disabled selected hidden>Select Ageing</option> */}
                        {vendor?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT MONTH</InputLabel>
                    <Select value={selectMonth} onChange={(e) => { setSelectMonth(e.target.value);getMonthDoneCount(e.target.value);getMonthProjectCount(e.target.value)}} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>
                        {month.map((item) => (
                            <MenuItem value={item}>{item}</MenuItem>
                        ))}
                    </Select>
                </div>
        </div>
        {/* PROJECTED COUNT DONUT CHART */}
         <div style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 8px)', width: 350, height: 350, marginTop: 10 }}>
                <Doughnut
                    data={{
                        labels: ProjectArrs,
                        datasets: [
                            {
                                //   label: 'Bucket wise(Pending Sites)',
                                data: monthProjectCount,
                                borderColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                backgroundColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                borderWidth: 2,
                                hoverBorderWidth: 2,
                                hoverBorderRadius: 5,
                                //   circumference:180,
                                //   rotation:270,
                            }]
                    }}
                    options={optionsD1}
                    plugins={[ChartDataLabels]}
                >

                </Doughnut>
            </div>
                   <div style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 8px)', width: 350, height: 350, marginTop: 10 }}>
                <Doughnut
                    data={{
                        labels: ProjectArrs,
                        datasets: [
                            {
                                //   label: 'Bucket wise(Pending Sites)',
                                data: monthDoneCount,
                                borderColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                backgroundColor: ['rgba(15, 255, 79, 0.53)', 'rgb(158, 221, 255, 0.53)', 'rgb(176, 217, 177, 0.53)', 'rgb(157, 118, 193, 0.53)', 'rgb(247, 140, 162, 0.53)', 'rgb(239, 180, 149, 0.53)', 'rgb(31, 65, 114,0.53)', 'rgb(24, 111, 101,0.53)', 'rgb(233, 184, 36,0.53)', 'rgb(199, 0, 57 , 0.53)'],
                                borderWidth: 2,
                                hoverBorderWidth: 2,
                                hoverBorderRadius: 5,
                                //   circumference:180,
                                //   rotation:270,
                            }]
                    }}
                    options={optionsD2}
                    plugins={[ChartDataLabels]}
                >
                </Doughnut>
            </div>

    </div>

    </>
  )
}

export default DonutChart