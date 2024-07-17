import React, { useEffect, useState } from 'react'
import { Chart as Chartjs } from 'chart.js/auto'
import { Line, Bar } from 'react-chartjs-2';
import Button from '@mui/material/Button';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartjsPluginWatermark from 'chartjs-plugin-watermark'
import { getData, postData, ServerURL } from '../../../../services/FetchNodeServices';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import LaunchIcon from '@mui/icons-material/Launch';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" timeout={2500} style={{ transformOrigin: '0 0 0' }} mountOnEnter unmountOnExit ref={ref} {...props} />;
});

const CircleWise = (propes) => {
    const [circle, setCircle] = useState('ALL')
    const [circleArr, setCircleArr] = useState(['ALL'])
    const [project, setProject] = useState('ALL')
    const [projectArr, setProjectArr] = useState(['ALL'])
    const [month, setMonth] = useState(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'])
    const [mobilecomm, setMobilecomm] = useState([])
    const [Ats, setAts] = useState([])
    const [Bharat, setBharat] = useState([])
    const [Frogcell, setFrogcell] = useState([])
    const [Maksat, setMaksat] = useState([])
    const [Reecomps, setReecomps] = useState([])
    const [Vedang, setVedang] = useState([])
    const [Vsn, setVsn] = useState([])
    const [graphType, setGraphType] = useState(false);
    const [airtel, setAirtel] = useState([]);
    const [open, setOpen] = useState(false)
    const finalArr = ['Ats', 'Bharat', 'Frogcell', 'Maksat', 'Mobilecomm', 'Reecomps', 'Vedang', 'Vsn']
    let delayed;


    // console.log('mobilecomm',mobilecomm,'nokia',nokia,'Ericsson',ericsson)

    // console.log('project Circle data............',airtel,"mobilecomm",mobilecomm,"nokia" ,nokia,'eriction',ericsson,vedang )

    const fetchSelectedData = async () => {
        const response = await getData('MDP/UBR/unique_column_value/')
        // console.log('project Circle data......', response)
        setCircleArr([...circleArr, ...response.circle])
        setProjectArr([...projectArr, ...response.project])
    }

    const fetchAllData = async () => {
        const formData = new FormData();
        formData.append("project", project)
        formData.append("circle", circle)
        const response = await postData('MDP/UBR/all_data/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log("project Circle data %%%%%%%%%%%%%%", response);

        const airtelData = response.airtel_bucket

        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        //  this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month == items))
            console.log('1q1q1q1q1qqqq', filterCircle)
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobilecomm((prev) => [...prev, 0])
                setBharat((prev) => [...prev, 0])
                setAts((prev) => [...prev, 0])
                setFrogcell((prev) => [...prev, 0])
                setMaksat((prev) => [...prev, 0])
                setVsn((prev) => [...prev, 0])
                setVedang((prev) => [...prev, 0])
                setReecomps((prev) => [...prev, 0])

            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Partner === 'Mobilecomm') {
                        // Mobilecomm.push(it.sum_projected_count)
                        setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Ats') {
                        setAts((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Bharat') {
                        setBharat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Frogcell') {
                        setFrogcell((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Maksat') {
                        setMaksat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vedang') {
                        setVedang((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vsn') {
                        setVsn((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Reecomps') {
                        setReecomps((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }

                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < finalArr.length; i++) {
                    if (!tempArr.includes(finalArr[i])) {
                        switch (finalArr[i]) {
                            case "Mobilecomm":
                                setMobilecomm((prev) => [...prev, 0])
                                break;
                            case "Bharat":
                                setBharat((prev) => [...prev, 0])
                                break;
                            case "Ats":
                                setAts((prev) => [...prev, 0])
                                break;
                            case "Vedang":
                                setVedang((prev) => [...prev, 0])
                                break;
                            case "Frogcell":
                                setFrogcell((prev) => [...prev, 0])
                                break;
                            case "Makset":
                                setMaksat((prev) => [...prev, 0])
                                break;
                            case "Vns":
                                setVsn((prev) => [...prev, 0])
                                break;
                            case "Reecomps":
                                setReecomps((prev) => [...prev, 0])
                                break;
                            // Handle other cases as needed
                        }
                    }
                }
            }


        })
    }

    const getFilterCircleData = async (props) => {
        const formData = new FormData();
        formData.append("project", project)
        formData.append("circle", props)
        const response = await postData('MDP/UBR/all_data/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log("project Circle data............", response)

        const airtelData = response.airtel_bucket

        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })

        //  this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month == items))
            console.log('1q1q1q1q1qqqq', filterCircle)
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobilecomm((prev) => [...prev, 0])
                setBharat((prev) => [...prev, 0])
                setAts((prev) => [...prev, 0])
                setFrogcell((prev) => [...prev, 0])
                setMaksat((prev) => [...prev, 0])
                setVsn((prev) => [...prev, 0])
                setVedang((prev) => [...prev, 0])
                setReecomps((prev) => [...prev, 0])

            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Partner === 'Mobilecomm') {
                        // Mobilecomm.push(it.sum_projected_count)
                        setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Ats') {
                        setAts((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Bharat') {
                        setBharat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Frogcell') {
                        setFrogcell((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Maksat') {
                        setMaksat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vedang') {
                        setVedang((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vsn') {
                        setVsn((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Reecomps') {
                        setReecomps((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }

                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < finalArr.length; i++) {
                    if (!tempArr.includes(finalArr[i])) {
                        switch (finalArr[i]) {
                            case "Mobilecomm":
                                setMobilecomm((prev) => [...prev, 0])
                                break;
                            case "Bharat":
                                setBharat((prev) => [...prev, 0])
                                break;
                            case "Ats":
                                setAts((prev) => [...prev, 0])
                                break;
                            case "Vedang":
                                setVedang((prev) => [...prev, 0])
                                break;
                            case "Frogcell":
                                setFrogcell((prev) => [...prev, 0])
                                break;
                            case "Makset":
                                setMaksat((prev) => [...prev, 0])
                                break;
                            case "Vns":
                                setVsn((prev) => [...prev, 0])
                                break;
                            case "Reecomps":
                                setReecomps((prev) => [...prev, 0])
                                break;
                            // Handle other cases as needed
                        }
                    }
                }
            }


        })
    }

    const getFilterDataProject = async (props) => {
        const formData = new FormData();
        formData.append("project", props)
        formData.append("circle", circle)
        const response = await postData('MDP/UBR/all_data/', formData, { headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` } })
        // console.log("project ------ data ", response.data)
        // console.log("project Circle data %%%%%%%%%%%%%%", response);


        const airtelData = response.airtel_bucket

        // this is for total
        month?.map((item) => {
            var filterMonth = airtelData?.filter((its) => (its.Month === item))
            if (filterMonth.length === 0) {
                setAirtel((prev) => [...prev, 0])
            }
            else {
                filterMonth?.map((item) => {
                    setAirtel((prev) => [...prev, item.sum_projected_count])
                })
            }
        })
        // this is for all vendor
        month?.map((items) => {
            var filterCircle = response.data?.filter((item) => (item.Month == items))
            // console.log('1q1q1q1q1qqqq', filterCircle)
            const lenghtArr = filterCircle.length

            if (lenghtArr === 0) {
                console.log('IF wali condition')
                setMobilecomm((prev) => [...prev, 0])
                setBharat((prev) => [...prev, 0])
                setAts((prev) => [...prev, 0])
                setFrogcell((prev) => [...prev, 0])
                setMaksat((prev) => [...prev, 0])
                setVsn((prev) => [...prev, 0])
                setVedang((prev) => [...prev, 0])
                setReecomps((prev) => [...prev, 0])

            }
            else {
                //  console.log('1111177777',filterCircle)
                var tempArr = [];
                filterCircle.map((it) => {

                    console.log('else wali condition', it)

                    if (it.Partner === 'Mobilecomm') {
                        // Mobilecomm.push(it.sum_projected_count)
                        setMobilecomm((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Ats') {
                        setAts((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Bharat') {
                        setBharat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Frogcell') {
                        setFrogcell((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Maksat') {
                        setMaksat((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vedang') {
                        setVedang((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Vsn') {
                        setVsn((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }
                    else if (it.Partner === 'Reecomps') {
                        setReecomps((prev) => [...prev, it.DONE_COUNT])
                        tempArr.push(it.Partner)
                    }

                })
                // console.log('temp Arr' , tempArr)
                for (var i = 0; i < finalArr.length; i++) {
                    if (!tempArr.includes(finalArr[i])) {
                        switch (finalArr[i]) {
                            case "Mobilecomm":
                                setMobilecomm((prev) => [...prev, 0])
                                break;
                            case "Bharat":
                                setBharat((prev) => [...prev, 0])
                                break;
                            case "Ats":
                                setAts((prev) => [...prev, 0])
                                break;
                            case "Vedang":
                                setVedang((prev) => [...prev, 0])
                                break;
                            case "Frogcell":
                                setFrogcell((prev) => [...prev, 0])
                                break;
                            case "Makset":
                                setMaksat((prev) => [...prev, 0])
                                break;
                            case "Vns":
                                setVsn((prev) => [...prev, 0])
                                break;
                            case "Reecomps":
                                setReecomps((prev) => [...prev, 0])
                                break;
                            // Handle other cases as needed
                        }
                    }
                }
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
            },
            {
                type: 'bar',
                label: 'Total',
                data: airtel,
                borderColor: 'rgb(199, 0, 57,0.65)',
                // backgroundColor: ['rgb(199, 0, 57,0.65)'],
                borderWidth: 2,
                color: 'red',
                fill: false,
                tension: 0.4
            }
        ]
    }

    const data2 = {
        labels: month,
        datasets: [
            {
                label: 'Mobilecomm',
                data: mobilecomm,
                borderColor: 'black',
                backgroundColor: ['rgb(237,108,2,0.8)'],
                borderWidth: 1,
                // borderRadius: 5,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Ats',
                data: Ats,
                borderColor: 'black',
                backgroundColor: ['rgb(27,67,147,0.7)'],
                borderWidth: 1,
                // borderRadius: 5,
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
                // borderRadius: 5,
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
                // borderRadius: 5,
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
                // borderRadius: 5,
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
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4,
                // borderRadius: 5
            },
            {
                label: 'Reecomps',
                data: Reecomps,
                borderColor: 'black',
                backgroundColor: ['rgb(22, 160, 133, 0.83)'],
                borderWidth: 1,
                // borderRadius: 5,
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
                // borderRadius: 5,
                color: 'red',
                fill: true,
                tension: 0.4
            },
            {
                type: 'line',
                label: 'Total',
                data: airtel,
                borderColor: 'rgb(199, 0, 57,0.6)',
                backgroundColor: ['rgb(199, 0, 57,0.6)'],
                borderWidth: 3,
                color: 'red',
                // fill: true,
                tension: 0.2
            }
        ]
    }

    const options = {
        responsive: true,
        // events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
        maintainApectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
            // axis:'x',
        },
        plugins: {
            // backgroundImageUrl:'https://www.msoutlook.info/pictures/bgconfidential.png',
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
                text: 'PARTNERS COMPARISON',
                font: {
                    size: 16,
                    weight: 'bold'
                }

            },
            datalabels: {
                display: true,
                color: 'black',
                anchor: 'end',
                align: 'top',
                offset: 0.5,
                font: {
                    size: 10,
                    weight: 'bold'
                }
                // formatter:(value,context)=>{
                //         console.log(context)
                // }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true,
                        speed: 0.01,
                    },
                    pinch: {
                        enabled: true,
                        speed: 0.01,
                    },
                    mode: 'x',
                    // mode:'y',
                },
                pan: {
                    enabled: true,
                    mode: 'x'
                },
            },
            tooltip: {
                displayColors: false,
                backgroundColor: 'white',
                borderColor: 'black',
                borderWidth: '1',
                padding: 10,
                bodyColor: 'black',
                bodyFont: {
                    size: '14'
                },
                bodyAlign: 'left',
                footerAlign: 'right',
                titleColor: 'black',
                titleFont: {
                    weight: 'bold',
                    size: '15'
                },
                yAlign: 'bottom',
                xAlign: 'center',
                callbacks: {
                    // labelColor: function(context) {
                    //     return {
                    //         borderColor: 'rgb(0, 0, 255)',
                    //         backgroundColor: 'rgb(255, 0, 0)',
                    //         borderWidth: 2,
                    //         borderDash: [2, 2],
                    //         borderRadius: 2,
                    //     };
                    // },
                    // labelTextColor: function(context) {
                    //     return '#543453';
                    // },
                    label: ((tooltipItem) => {
                        // console.log(tooltipItem.dataset.label,":",tooltipItem.formattedValue)

                    })
                }
            },

        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    // color:"white"
                },
                // stacked: true

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
                // stacked: true
            }
        },
        watermark: {

            image: `${ServerURL}/media/assets/logo-new.png`,
            x: 50,
            y: 50,
            width: 300,
            height: 150,
            opacity: 0.25,
            alignX: "right",
            alignY: "top",
            alignToChartArea: false,
            position: "back"

        },
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 300 + context.datasetIndex * 100;
                }
                return delay;
            },
        },

    }
    //********* HANDLE CLEAR DATA ********* */
    const handleClear = () => {
        setMobilecomm([])
        setAts([])
        setBharat([])
        setFrogcell([])
        setMaksat([])
        setReecomps([])
        setVedang([])
        setVsn([])
        setAirtel([])

    }

    // TOGGAL BUTTON
    const handleChange = () => {
        setGraphType(!graphType)
    }

    const handleClose = () => {
        setOpen(false)
    }

    // handle dialog box
    const handleDialogBox = () => {
        return (
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                TransitionComponent={Transition}
                open={open}
                onClose={handleClose}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}>
                        <Bar
                            // style={{  width: "100%", height: '100%' }}
                            data={data2}
                            options={options}
                            plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                        >
                        </Bar>
                    </div>
                    <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "1100px", height: '600px' }}><Line
                        // style={{ width: "100%", height: 350 }}
                        data={data}
                        options={options}
                        plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                    >
                    </Line></div>
                </div>

            </Dialog>
        )
    }


    useEffect(() => {
        fetchSelectedData();
        fetchAllData()
        // useEffect(()=>{
            document.title=`${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/',' | ').toUpperCase()}`
        //   },[])
    }, [])
    return (
        <div style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 10, height: 450, width: "100%", borderRadius: 10, backgroundColor: "white", display: "flex", justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ width: 200, height: 350, borderRadius: 5, padding: 10, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "20px" }}>
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: "black" }}><FilterAltIcon />FILTER DATA</div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT CIRCLE</InputLabel>
                    <Select value={circle} onChange={(e) => { setCircle(e.target.value); handleClear(); getFilterCircleData(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>

                        {circleArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                <div>
                    <InputLabel style={{ fontSize: 15 }}>SELECT PROJECT</InputLabel>
                    <Select value={project} onChange={(e) => { setProject(e.target.value); handleClear(); getFilterDataProject(e.target.value) }} style={{ height: '30px', width: '160px', fontSize: '15px', border: '1px solid #eaedf0', cursor: 'pointer', borderRadius: 5 }}>

                        {projectArr?.map((item) => (
                            <MenuItem value={item} key={item} >{item}</MenuItem>
                        ))}
                    </Select>
                </div>
                {/* toggle button */}
                <div>
                    <ToggleButtonGroup
                        size="small"
                        color="primary"
                        value={graphType}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"

                    >
                        <ToggleButton value={true}>Line</ToggleButton>
                        <ToggleButton value={false}>Bar</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                {/* full screen button */}
                <div>
                    <Button color="primary" endIcon={<LaunchIcon />} onClick={() => { setOpen(true) }}>Full screen</Button>
                </div>
            </div>
            <div style={{ display: graphType ? 'inherit' : 'none', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}><Line
                style={{ width: "100%", height: 350 }}
                data={data}
                options={options}
                plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
            >
            </Line></div>
            <div style={{ display: graphType ? 'none' : 'inherit', filter: 'drop-shadow(rgba(0, 0, 0, 0.34) 0px 3px 3px)', width: "800px", height: 400 }}>
                <Bar
                    // style={{ width: "100%", height: 400 }}
                    data={data2}
                    options={options}
                    plugins={[ChartDataLabels, zoomPlugin, ChartjsPluginWatermark]}
                >
                </Bar></div>

            {handleDialogBox()}

        </div>
    )
}

export default CircleWise