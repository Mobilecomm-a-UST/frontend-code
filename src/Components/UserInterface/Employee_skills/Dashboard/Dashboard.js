import React, { useState, useCallback, useRef } from 'react'
import { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Stack, Button } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import DownloadIcon from '@mui/icons-material/Download';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ServerURL } from '../../../services/FetchNodeServices'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Swal from "sweetalert2";
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import * as ExcelJS from 'exceljs'
import Container from '@mui/material/Container'
import { useGet } from '../../../Hooks/GetApis';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import { useQuery } from '@tanstack/react-query';
import { usePost } from '../../../Hooks/PostApis';
import axios from 'axios';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
// import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useStyles } from '../../ToolsCss';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import RateReviewIcon from '@mui/icons-material/RateReview';






const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#223354',
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
        width: theme.palette.common.auto,
        '&:first-of-type': {
            position: '-webkit-sticky',
            left: 0,
            zIndex: 4,
            backgroundColor: '#223354', // Higher z-index for header cell
        },
        '&:last-of-type': {
            position: '-webkit-fixed',
            left: 0,
            zIndex: 4,
            backgroundColor: '#223354', // Higher z-index for header cell
        },

    },

    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 0,
        '&:first-of-type': {
            position: 'sticky',
            left: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
        },
        '&:last-of-type': {
            position: 'skicky',
            left: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1,
        },
    },

}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,

    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,

    },

}));

const cityNames = [
    "AP", // Andhra Pradesh
    "BIH", // Bihar
    "CHN", // Chandigarh
    "ROTN", // Tamil Nadu
    "DEL", // Delhi
    "HRY", // Haryana
    "JK", // Jammu and Kashmir
    "JRK", // Jharkhand
    "KOL", // West Bengal
    "MAH", // Maharashtra
    "MP", // Madhya Pradesh
    "MUM", // Mumbai
    "ORI", // Odisha
    "PUN", // Punjab
    "RAJ", // Rajasthan
    "UPE", // Uttar Pradesh (Eastern)
    "UPW", // Uttar Pradesh (Western)
    "WB", // West Bengal
    "KK" // Karnataka
];

const OEM_Name = [
    'Nokia',
    'Huawei',
    'Samsung',
    'ZTE',
    'Ericsson',
    'Ceragon',
    'Cambium',
    'Radwin'
]

const Projects = [
    "ULS_HPSC",
    "Relocation",
    "MACRO",
    "De-Grow",
    "MW LOS Survey",
    "UBR",
    "RET",
    "Cluster AT",
    "RF Survey",
    "MW NT",
    "IBS",
    "ODSC",
    "IDSC",
    "HT Increment",
    "FEMTO",
    "E2E Project Management",
    "Others"
]

const Currentrole = [
    "PM",
    "Cordinator",
    "FE",
    "Technician",
    "RNO",
    "Ix Engg",
    "AM",
    "Engg",
    "CDH"
]

const Key_Responsibilities = [
    "Survey",
    "I&C",
    "Phy AT",
    "SCFT",
    "Soft AT",
    "Ware house Coordinator",
    "MIS",
    "Integration",
    "KPI AT",
    "SCFT Coordinator",
    "Customer Support"
]

const Working_Sta = [
    "On Job",
    "On Leave",
    "On Leave",
    "Abscond",
    "Resigned",
    "LWP",
    "Irregular",
    "Maternity Leave"
]

const CirclesArray = (JSON.parse(localStorage.getItem("Circle"))?.split(','))

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


const Dashboard = () => {
    const theme = useTheme();
    const classes = useStyles()
    const [search, setSearch] = useState('')
    const [searchButton, setSearchButton] = useState(false)
    const scrollableContainerRef = useRef(null);
    const [scrollNo, setScrollNo] = useState(50)
    const { isPending, data, refetch } = useQuery({
        queryKey: ['Employee_skills'],
        queryFn: async () => {
            action(isPending)
            const res = await makeGetRequest("employee_skills/employee-skill-table");
            if (res) {
                action(false)
                handleCircleArray(res)
                handleOemsArray(res)
                handleDesignationArray(res)
                return res;
            }
        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })
    const [mobilecommExp, setMobilecommExp] = useState(0)
    const [arraySkill, setArraySkill] = useState([])
    const [tempArraySkill, setTempArraySkill] = useState('')
    const [oemArray, setOemArray] = useState([])
    const [projectArray, setProjectArray] = useState([])
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isValid2, setIsValid2] = useState(false);
    const [circleArray, setCircleArray] = useState([]);
    const [circleData, setCircleData] = useState([]);
    const [designationArr, setDesignationArr] = useState([])
    const [designationData, setDesignationData] = useState([])
    const [oemsArr, setOemsArr] = useState([])
    const [oemsData, setOemsData] = useState([])
    const [formData, setFormData] = useState({
        circle: '',
        current_designation: '',
        current_role: '',
        designation: '',
        doj: '',
        domain: '',
        email_id: '',
        emp_code: '',
        employee_name: '',
        key_responsibility: '',
        manager_emp_code: '',
        mobile_no: '',
        mobilecomm_exp: '',
        oem: '',
        previous_org1: '',
        previous_org2: '',
        previous_org3: '',
        project: [],
        project_name: '',
        reporting_manager_name: '',
        skillsets: '',
        team_category: '',
        total_exp: '',
        working_status: '',
        current_circle: '',
    })
    const { makePostRequest, handleErrors } = usePost()
    const [userId, setUserId] = useState()
    const [open, setOpen] = useState(false)
    const [openList, setOpenList] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [deleteRemark, setDeleteRemark] = useState('')
    const { makeGetRequest } = useGet()
    const { loading, action } = useLoadingDialog();



    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchButton(prevState => !prevState);
    };


    // console.log('user id',userId)


    // ## filter circle  ##
    const handleCircleArray = (circles) => {
        // handleExperienceArray(circles)
        var arr = [];

        circles?.map((item) => {
            arr.push(item.circle)
            // console.log('circle data' , item)
        })
        setCircleArray([...new Set(arr)])

    }
    const handleCircle = (event) => {
        const {
            target: { value },
        } = event;
        setCircleData(
            typeof value === 'string' ? value.split(',') : value,
        );
    }



    // ####### filter Designation ########
    const handleDesignationArray = (desi) => {
        // handleManagerArray(desi)
        var arr = [];
        desi?.map((item) => {
            arr.push(item.designation)
        })
        setDesignationArr([...new Set(arr)])
    }
    const handleDesignation = (event) => {
        const {
            target: { value },
        } = event;
        setDesignationData(
            typeof value === 'string' ? value.split(',') : value,
        );
    }



    //######## filter oem  ########
    const handleOemsArray = (oems) => {
        var arr = [];
        oems?.map((item) => {
            arr.push(item.oem)
        })
        setOemsArr([...new Set(arr)])
    }
    const handleOemsData = (event) => {
        const {
            target: { value },
        } = event;
        setOemsData(
            typeof value === 'string' ? value.split(',') : value,
        );
    }






    const handleChange = (e) => {

        // console.log('get state name ', e.target.value)
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });



        if (e.target.name === 'mobile_no') {
            if (e.target.value.length !== 10) {
                setError('Mobile number should be 10 digits');
                setIsValid(false);
            } else {
                setError('');
                setIsValid(true);
            }
        }


    };

    // Delete array skils from Array
    const handleDeleteArray = (index) => {
        let newTodoList = [...arraySkill]
        newTodoList.splice(index, 1)

        setArraySkill([...newTodoList])
    }


    // this function handle add new list in data base
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your registration logic here
        if (arraySkill.length >= 1) {
            setIsValid2(true)
            setError2('')
        }
        else {
            setIsValid2(false)
            setError2('Please Add skills')
        }
        if (isValid && isValid2) {
            formData.mobilecomm_exp = mobilecommExp
            formData.project = projectArray.join(', ')
            formData.oem = oemArray.join(', ')
            formData.skillsets = arraySkill.join(', ')
            const responce = await makePostRequest('employee_skills/employee-skill-table', formData)

            // console.log('handle submit' , responce)
            if (responce) {
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Data saved successfully`,
                });
                setOpenList(false)
                handleClose()
                refetch()
            }
            else {
                // let temerror = handleErrors()
                // console.log('handle check' , temerror)
                alert('Employee with this employee code already exists')
            }
        } else {

            alert('Please fill required field & Check again')
        }


    }

    const handleEdit = (props) => {
        console.log('edit', props)
        setUserId(props.emp_code)
        setIsValid(true)
        setFormData({
            circle: props.circle,
            current_designation: props.current_designation,
            current_role: props.current_role,
            designation: props.designation,
            doj: props.doj,
            domain: props.domain,
            email_id: props.email_id,
            emp_code: props.emp_code,
            employee_name: props.employee_name,
            key_responsibility: props.key_responsibility,
            manager_emp_code: props.manager_emp_code,
            mobile_no: props.mobile_no,
            mobilecomm_exp: props.mobilecomm_exp,
            oem: props.oem,
            previous_org1: props.previous_org1,
            previous_org2: props.previous_org2,
            previous_org3: props.previous_org3,
            project: props.project,
            project_name: props.project_name,
            reporting_manager_name: props.reporting_manager_name,
            skillsets: props.skillsets,
            team_category: props.team_category,
            total_exp: props.total_exp,
            working_status: props.working_status,
            current_circle: props.current_circle
        })
        setMobilecommExp(props.mobilecomm_exp)
        if (props.skillsets.length > 0) {
            setIsValid2(true)
            handleSkillsArray(props.skillsets)
        }
        handleOemArray(props.oem)
        setProjectArray(props.project.split(','))
        setOpen(true)
    }


    const handleSkillsArray = (skill) => {
        let skillArr = skill.replaceAll(' ', '').split(",")
        setArraySkill(skillArr)

    }

    const handleOemArray = (oems) => {
        let Oemsa = oems.replaceAll(' ', '').split(",")
        setOemArray(Oemsa)
    }

    // this function is used for updateing data base
    const handleUpdateList = async (e) => {
        e.preventDefault();
        if (arraySkill.length > 0) {
            setIsValid2(true)
            setError2('')
        }
        else {
            setIsValid2(false)
            setError2('Please Add skills')
        }
        if (isValid && isValid2) {
            formData.mobilecomm_exp = mobilecommExp
            formData.project = projectArray.join(', ')
            formData.oem = oemArray.join(', ')
            formData.skillsets = arraySkill.join(', ')
            // formData.oem = oemArray.join(', ')
            // formData.skillsets = arraySkill.join(', ')
            const responce = await makePostRequest(`employee_skills/employee-skill-table/${userId}/'xxxx'/`, formData)

            console.log('responce', responce)
            if (responce) {
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `Data saved successfully`,
                });
                setOpen(false)
                refetch()
                handleClose();
            }
        }
        else {
            alert('Please fill required field & Check again')
        }
    }


    // this function is used for delete raw data.....
    const handleDelete = async (e) => {
        e.preventDefault();
        const words = deleteRemark.match(/\b\w+\b/g);

        const wordData = words ? words.length : 0;
        // const response = await axios.delete(`employee_skills/employee-skill-table/${id}/`);
        if (wordData > 4) {
            try {
                // Make the DELETE request
                const response = await axios.delete(`${ServerURL}/employee_skills/employee-skill-table/${userId}/${deleteRemark}/`,
                    {
                        headers: { Authorization: `token ${JSON.parse(localStorage.getItem("tokenKey"))}` }
                    }
                );
                // console.log('Deleted successfully:', response);

                if (response.status === 204) {
                    Swal.fire({
                        icon: "success",
                        title: "Done",
                        text: `Data Deleted Successfully`,
                    });
                    handleClose();
                    refetch();
                }
            } catch (error) {
                // Handle error
                alert('Error deleting data:' + error);
            }
        }
        else {
            alert('Please enter at least 5 words')
        }


    }

    const handleSkills = (skills) => {

        // console.log('skils', skills.replaceAll(' ', '').split(","))

        let skillArr = skills.replaceAll(' ', '').split(",")
        return (<ul style={{ listStyle: 'none', display: 'flex', gap: 3 }}>
            {skillArr.map((item) => (
                <li style={{}}>
                    {item},
                </li>
            ))}
        </ul>)
    }


    const addSkillInArray = () => {

        setTempArraySkill('')
        if (tempArraySkill.length > 1) {
            setArraySkill((prev) => ([...prev, tempArraySkill]))
            setError2('')
            setIsValid2(true)
        }
        else {
            alert('Alphabet letter should be more then two.')
        }

    }

    const handleOem = (event) => {
        const {
            target: { value },
        } = event;
        setOemArray(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleProjectTech = (event) => {
        console.log('aaaaasssssdddd', event)
        const {
            target: { value },
        } = event;
        setProjectArray(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleScroll = () => {
        const scrollableContainer = scrollableContainerRef.current;

        // Calculate the distance between the bottom of the container and the bottom of the scrollable content
        const distanceToBottom = scrollableContainer.scrollHeight - (scrollableContainer.scrollTop + scrollableContainer.clientHeight);

        // Define a threshold to determine when the scrollbar is considered to be at the endpoint
        const threshold = 50; // Adjust as needed

        // Call your function when scrollbar is at the endpoint (within the threshold)
        if (distanceToBottom <= threshold) {
            // console.log('Scrollbar reached the endpoint!');
            setScrollNo(scrollNo + 20)
            // Call your function here
        }
    };


    const TableData = useCallback(() => {

        var arr = [];

        // if(search.length > 0){
        //     arr = data?.filter((item) => (item.emp_code.toLowerCase().includes(search.toLowerCase())))
        // }

        if (circleData.length > 0 && designationData.length > 0 && oemsData.length > 0) {
            circleData?.map((cir) => {
                designationData?.map((deg) => {
                    oemsData?.map((oe) => {
                        arr.push(data?.filter((item) => (item.circle === cir && item.designation === deg && item.oem === oe)));
                    })
                })
            })
        }
        else if (circleData.length > 0 && designationData.length > 0) {
            circleData?.map((cir) => {
                designationData?.map((deg) => {
                    arr.push(data?.filter((item) => (item.circle === cir && item.designation === deg)));

                })
            })
        }
        else if (designationData.length > 0 && oemsData.length > 0) {
            designationData?.map((deg) => {
                oemsData?.map((oe) => {
                    arr.push(data?.filter((item) => (item.designation === deg && item.oem === oe)));
                })
            })
        }
        else if (circleData.length > 0 && oemsData.length > 0) {
            circleData?.map((cir) => {
                oemsData?.map((dep) => {
                    arr.push(data?.filter((item) => (item.circle === cir && item.oem === dep)));
                })
            })
        }
        else if (circleData.length > 0) {
            circleData?.map((cir) => {
                arr.push(data?.filter((item) => (item.circle === cir)));
            })

        }
        else if (oemsData.length > 0) {
            oemsData?.map((dep) => {
                arr.push(data?.filter((item) => (item.oem === dep)));
            })
        }
        else if (designationData.length > 0) {
            designationData?.map((exp) => {
                arr.push(data?.filter((item) => (item.designation === exp)));

            })
        }
        else if (search.length > 0) {
            arr.push(data?.filter((item) => (item.emp_code.toLowerCase().includes(search.toLowerCase()))))
        }
        else {
            return data?.map((row, index) => index < scrollNo && (
                <StyledTableRow key={index} className={classes.hover}>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }} >
                        {row.emp_code}
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }} >
                        {row.employee_name}
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.circle}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.current_circle}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.designation}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.doj}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.project_name}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.manager_emp_code}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.reporting_manager_name.toUpperCase()}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.mobile_no}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.email_id}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.domain}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.project}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.current_role}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.key_responsibility}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.skillsets}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.oem}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.total_exp}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.mobilecomm_exp}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org1}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org2}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org3}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.current_designation}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.working_status}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.team_category}</StyledTableCell>
                    {/* <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.skillsets}</StyledTableCell> */}
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", display: 'flex', flex: 'row' }}>
                        <IconButton color="primary" onClick={() => { handleEdit(row) }} size='small'>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setOpenDelete(true); setUserId(row.emp_code) }} size='small'>
                            <DeleteIcon />
                        </IconButton>
                    </StyledTableCell>
                </StyledTableRow>
            )
            )
        }
        // handleDesignationArray(arr[0])
        // console.log('check', arr)

        return arr?.map((x) => {
            return x?.map((row, index) => index < scrollNo && (
                <StyledTableRow key={index} className={classes.hover}>
                    <StyledTableCell align="center" sx={{ borderRight: "2px solid black", position: 'sticky', left: '0 ', zIndex: 1 }} >
                        {row.emp_code}
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }} >
                        {row.employee_name}
                    </StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.circle}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.current_circle}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.designation}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.doj}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.project_name}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.manager_emp_code}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.reporting_manager_name.toUpperCase()}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.mobile_no}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.email_id}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.domain}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.project}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.current_role}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.key_responsibility}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.skillsets}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.oem}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.total_exp}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.mobilecomm_exp}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org1}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org2}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.previous_org3}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.current_designation}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.working_status}</StyledTableCell>
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", whiteSpace: 'nowrap' }}>{row.team_category}</StyledTableCell>
                    {/* <StyledTableCell align="center" style={{ borderRight: "2px solid black" }}>{row.skillsets}</StyledTableCell> */}
                    <StyledTableCell align="center" style={{ borderRight: "2px solid black", display: 'flex', flex: 'row' }}>
                        <IconButton color="primary" onClick={() => { handleEdit(row) }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => { setOpenDelete(true); setUserId(row.emp_code) }}>
                            <DeleteIcon />
                        </IconButton>
                    </StyledTableCell>
                </StyledTableRow>
            )
            )
        })

    }, [data, open, openList, circleData, designationData, oemsData, scrollNo, searchButton]);

    const handleClose = () => {
        setOpen(false)
        setOpenList(false)
        setOpenDelete(false)
        setDeleteRemark('')
        setMobilecommExp(0)
        setFormData(
            {
                circle: '',
                current_designation: '',
                current_role: '',
                designation: '',
                doj: '',
                domain: '',
                email_id: '',
                emp_code: '',
                employee_name: '',
                key_responsibility: '',
                manager_emp_code: '',
                mobile_no: '',
                mobilecomm_exp: '',
                oem: '',
                previous_org1: '',
                previous_org2: '',
                previous_org3: '',
                project: '',
                project_name: '',
                reporting_manager_name: '',
                skillsets: '',
                team_category: '',
                total_exp: '',
                working_status: '',
                current_circle: '',
            }
        )
        setUserId()
        setArraySkill([])
        setOemArray([])
        setProjectArray([])
    }

    const handleMobileCommExp = (e) => {
        // console.log('aaaaaa',e.target.value)
        const pastDate = new Date(e.target.value);
        const currentDate = new Date();
        // const pastYear = pastDate.getFullYear();
        // const currentYear = currentDate.getFullYear();
        // const yearsOfExperience = currentYear - pastYear;
        // const hasPassedPastDate = (currentDate.getMonth() > pastDate.getMonth()) ||
        // (currentDate.getMonth() === pastDate.getMonth() && currentDate.getDate() >= pastDate.getDate());

        // if (!hasPassedPastDate) {
        //     setMobilecommExp(yearsOfExperience - 1);
        //   }

        //  setMobilecommExp(yearsOfExperience)
        const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Account for leap years
        const differenceInMilliseconds = currentDate - pastDate;
        const yearsOfExperience = differenceInMilliseconds / millisecondsPerYear;

        // Round the years of experience to two decimal places
        const roundedExperience = Math.round(yearsOfExperience * 100) / 100;

        setMobilecommExp(roundedExperience)
        // console.log('aaaaaaaa' , roundedExperience)

    }

    // EDIT DILOG BOX ..........
    const handleDialBox = () => {
        return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
            // style={{backgroundColor:'blue'}}

            >

                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> <EditIcon /> Edit Data</Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={handleClose}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>

                <DialogContent dividers={'paper'}>
                    <Container component="main" >

                        <form onSubmit={handleUpdateList} style={{ width: '100%', marginTop: 20 }}>
                            <Grid container spacing={2}>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        InputProps={{
                                            readOnly: true
                                        }}
                                        placeholder="Employee ID"
                                        label="Employee ID"
                                        name="emp_code"
                                        value={formData.emp_code}
                                        // onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <AccountBoxIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Employee Name"
                                        label="Employee Name"
                                        name="employee_name"
                                        value={formData.employee_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Circle</InputLabel>
                                        <Select
                                            value={formData.circle}
                                            name='circle'
                                            label="Circle"
                                            onChange={handleChange}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Circle</>
                                            </MenuItem>
                                            {CirclesArray.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Current Circle</InputLabel>
                                        <Select
                                            value={formData.current_circle}
                                            name='current_circle'
                                            label="Current Circle"
                                            onChange={handleChange}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Current Circle</>
                                            </MenuItem>
                                            {cityNames.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required={error ? false : true}
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <PhoneIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Mobile No."
                                        label="Mobile No."
                                        name="mobile_no"
                                        value={formData.mobile_no}
                                        onChange={handleChange}
                                        error={error ? true : false}
                                        helperText={error}
                                        size="small"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <EmailIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="E-mail"
                                        label="E-mail"
                                        name="email_id"
                                        value={formData.email_id}
                                        onChange={handleChange}
                                        size="small"
                                        type='email'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <AddModeratorIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Total Experience"
                                        label="Total Experience"
                                        name="total_exp"
                                        value={formData.total_exp}
                                        onChange={handleChange}
                                        size="small"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon fontSize='medium' color='primary' />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Date Of Joining"
                                        label="Date Of Joining"
                                        name="doj"
                                        value={formData.doj}
                                        onChange={(e) => { handleChange(e); handleMobileCommExp(e) }}
                                        size="small"
                                        type='date'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <ContactEmergencyIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Reporting Manager"
                                        label="Reporting Manager"
                                        name="reporting_manager_name"
                                        value={formData.reporting_manager_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <BadgeIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Manager Emp. Code"
                                        label="Manager Emp. Code"
                                        name="manager_emp_code"
                                        value={formData.manager_emp_code}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>

                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Domain</InputLabel>
                                        <Select

                                            name='domain'
                                            label="Domain"
                                            onChange={handleChange}
                                            value={formData.domain}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Domain</>
                                            </MenuItem>
                                            <MenuItem value="RAN">RAN</MenuItem>
                                            <MenuItem value="TX">TX</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <BadgeIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Project Name"
                                        label="Project Name"
                                        name="project_name"
                                        value={formData.project_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel id="demo-multiple-name">Project (Tech)</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name"
                                            multiple
                                            // name='project'
                                            label="Project (Tech)"
                                            value={projectArray}
                                            onChange={handleProjectTech}
                                            input={<OutlinedInput label="Project (Tech)" />}
                                            // MenuProps={MenuProps}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Project (Tech)</>
                                            </MenuItem>
                                            {Projects.map((name, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={name}
                                                    style={getStyles(name, projectArray, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Current Role</InputLabel>
                                        <Select

                                            name='current_role'
                                            label="Current Role"
                                            onChange={handleChange}
                                            value={formData.current_role}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Current Role</>
                                            </MenuItem>
                                            {Currentrole.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Key Responsibility</InputLabel>
                                        <Select

                                            name='key_responsibility'
                                            label="Key Responsibility"

                                            value={formData.key_responsibility}
                                            onChange={handleChange}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Key Responsibility</>
                                            </MenuItem>
                                            {Key_Responsibilities.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="demo-multiple-name-label">OEM</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            // multiple
                                            required
                                            value={oemArray}
                                            onChange={handleOem}
                                            input={<OutlinedInput label="Name" />}
                                        // MenuProps={MenuProps}
                                        >
                                            {OEM_Name.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, oemArray, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <LanIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Designation"
                                        label="Designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <LanIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Current Designation"
                                        label="Current Designation"
                                        name="current_designation"
                                        value={formData.current_designation}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Working Status</InputLabel>
                                        <Select

                                            name='working_status'
                                            label="Working Status"
                                            onChange={handleChange}
                                            value={formData.working_status}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Working Status</>
                                            </MenuItem>
                                            {Working_Sta.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Team Category</InputLabel>
                                        <Select

                                            name='team_category'
                                            label="Team Category"
                                            onChange={handleChange}
                                            value={formData.team_category}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Team Category</>
                                            </MenuItem>

                                            <MenuItem value="Field">Field</MenuItem>
                                            <MenuItem value="Backend">Backend</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={mobilecommExp}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <div> </div>
                                                </InputAdornment>
                                            ),
                                        }}

                                        placeholder="Mobilecomm Exp."
                                        label="Mobilecomm Exp."

                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                {/* muilti select OEM  */}

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={1}>
                                        {arraySkill?.map((item, index) => (
                                            <Chip
                                                label={item}
                                                variant="outlined"
                                                color="primary"
                                                onDelete={() => { handleDeleteArray(index) }}
                                            />
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        variant="outlined"
                                        // required
                                        fullWidth
                                        label="Skills*"
                                        // name="skillsets"
                                        value={tempArraySkill}
                                        onChange={(e) => setTempArraySkill(e.target.value)}
                                        size="small"
                                        type='text'
                                        error={error2 ? true : false}
                                        helperText={error2}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant='outlined' startIcon={<AddIcon />} style={{ borderRadius: 15 }} onClick={() => { addSkillInArray() }}>
                                        Add Skill
                                    </Button>
                                </Grid>


                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 1"
                                        name="previous_org1"
                                        value={formData.previous_org1}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'

                                        helperText="Optional"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 2"
                                        name="previous_org2"
                                        value={formData.previous_org2}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                        helperText="Optional"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 3"
                                        name="previous_org3"
                                        value={formData.previous_org3}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                        helperText="Optional"
                                    />
                                </Grid>



                            </Grid>
                            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 20, borderRadius: 20 }}>
                                Update
                            </Button>
                        </form>

                    </Container>

                </DialogContent>

            </Dialog>
        )
    }

    // ADD LIST DIALOG BOX ...................
    const handleAddList = useCallback(() => {
        // console.log('girraj singh')
        return (
            <Dialog
                open={openList}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'md'}
                fullWidth={true}
            >

                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><AddIcon fontSize='medium' /></Box><Box>ADD NEW EMPLOYEE DATA</Box></Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={handleClose}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>


                <DialogContent dividers={'paper'}>
                    <Container component="main" >
                        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 20 }}>
                            <Grid container spacing={2}>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <BadgeIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Employee ID"
                                        label="Employee ID"
                                        name="emp_code"
                                        value={formData.emp_code}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <AccountBoxIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Employee Name"
                                        label="Employee Name"
                                        name="employee_name"
                                        value={formData.employee_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>

                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Circle</InputLabel>
                                        <Select
                                            value={formData.circle}
                                            name='circle'
                                            label="Circle"
                                            onChange={handleChange}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Circle</>
                                            </MenuItem>
                                            {CirclesArray.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>

                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Current Circle</InputLabel>
                                        <Select
                                            value={formData.current_circle}
                                            name='current_circle'
                                            label="Current Circle"
                                            onChange={handleChange}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Current Circle</>
                                            </MenuItem>
                                            {cityNames.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {/* Auto complete Text fiel */}
                                {/* <Grid item xs={6}>
                                    <Autocomplete
                                         name="Circle"
                                         value={selectedCity}
                                        onChange={(event, newValue , name) => {
                                                // setFormData((...prev)=>({...prev , Circle:newValue}))
                                                setSelectedCity(newValue)

                                                console.log(event.target.value , event.target.name,newValue,name)
                                        }}
                                        options={cityNames}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="City"
                                                variant="outlined"
                                                fullWidth
                                                name="Circle"
                                                size="small"
                                                type='text'
                                            />
                                        )}
                                    />
                                </Grid> */}
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required={error ? false : true}
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <PhoneIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Mobile No."
                                        label="Mobile No."
                                        name="mobile_no"
                                        value={formData.mobile_no}
                                        onChange={handleChange}
                                        error={error ? true : false}
                                        helperText={error}
                                        size="small"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <EmailIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="E-mail"
                                        label="E-mail"
                                        name="email_id"
                                        value={formData.email_id}
                                        onChange={handleChange}
                                        size="small"
                                        type='email'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <AddModeratorIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Total Experience"
                                        label="Total Experience"
                                        name="total_exp"
                                        value={formData.total_exp}
                                        onChange={handleChange}
                                        size="small"
                                        type='number'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon fontSize='medium' color='primary' />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Date Of Joining"
                                        label="Date Of Joining"
                                        name="doj"
                                        value={formData.doj}
                                        onChange={(e) => { handleChange(e); handleMobileCommExp(e) }}
                                        size="small"
                                        type='date'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <ContactEmergencyIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Reporting Manager"
                                        label="Reporting Manager"
                                        name="reporting_manager_name"
                                        value={formData.reporting_manager_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <BadgeIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Manager Emp. Code"
                                        label="Manager Emp. Code"
                                        name="manager_emp_code"
                                        value={formData.manager_emp_code}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>

                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Domain</InputLabel>
                                        <Select

                                            name='domain'
                                            label="Domain"
                                            onChange={handleChange}
                                            value={formData.domain}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Domain</>
                                            </MenuItem>
                                            <MenuItem value="RAN">RAN</MenuItem>
                                            <MenuItem value="TX">TX</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <BadgeIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Project Name"
                                        label="Project Name"
                                        name="project_name"
                                        value={formData.project_name}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel id="demo-multiple-name">Project (Tech)</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name"
                                            multiple
                                            // name='project'
                                            label="Project (Tech)"
                                            value={projectArray}
                                            onChange={handleProjectTech}
                                            input={<OutlinedInput label="Project (Tech)" />}
                                            // MenuProps={MenuProps}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Project (Tech)</>
                                            </MenuItem>
                                            {Projects.map((name, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={name}
                                                    style={getStyles(name, projectArray, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Current Role</InputLabel>
                                        <Select

                                            name='current_role'
                                            label="Current Role"
                                            onChange={handleChange}
                                            value={formData.current_role}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Current Role</>
                                            </MenuItem>
                                            {Currentrole.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Key Responsibility</InputLabel>
                                        <Select

                                            name='key_responsibility'
                                            label="Key Responsibility"
                                            onChange={handleChange}
                                            value={formData.key_responsibility}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Current Role</>
                                            </MenuItem>
                                            {Key_Responsibilities.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="demo-multiple-name-label">OEM</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            // multiple
                                            required
                                            value={oemArray}
                                            onChange={handleOem}
                                            input={<OutlinedInput label="Name" />}
                                        // MenuProps={MenuProps}
                                        >
                                            {OEM_Name.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, oemArray, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <LanIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Designation"
                                        label="Designation"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        // InputProps={{
                                        //     startAdornment: (
                                        //         <InputAdornment position="start">
                                        //             <LanIcon fontSize='medium' color='primary' />
                                        //         </InputAdornment>
                                        //     ),
                                        // }}
                                        placeholder="Current Designation"
                                        label="Current Designation"
                                        name="current_designation"
                                        value={formData.current_designation}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Working Status</InputLabel>
                                        <Select

                                            name='working_status'
                                            label="Working Status"
                                            onChange={handleChange}
                                            value={formData.working_status}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Working Status</>
                                            </MenuItem>
                                            {Working_Sta.map((item, index) => (
                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl size='small' required fullWidth>
                                        <InputLabel >Team Category</InputLabel>
                                        <Select

                                            name='team_category'
                                            label="Team Category"
                                            onChange={handleChange}
                                            value={formData.team_category}
                                            required
                                            size="small"
                                        >
                                            <MenuItem disabled value="">
                                                <>Team Category</>
                                            </MenuItem>

                                            <MenuItem value="Field">Field</MenuItem>
                                            <MenuItem value="Backend">Backend</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={mobilecommExp}
                                        InputProps={{
                                            readOnly: true,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <div> </div>
                                                </InputAdornment>
                                            ),
                                        }}

                                        placeholder="Mobilecomm Exp."
                                        label="Mobilecomm Exp."

                                        size="small"
                                        type='text'
                                    />
                                </Grid>

                                {/* muilti select OEM  */}

                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={1}>
                                        {arraySkill?.map((item, index) => (
                                            <Chip
                                                label={item}
                                                variant="outlined"
                                                color="primary"
                                                onDelete={() => { handleDeleteArray(index) }}
                                            />
                                        ))}
                                    </Stack>
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField
                                        variant="outlined"
                                        // required
                                        fullWidth
                                        label="Skills*"
                                        // name="skillsets"
                                        value={tempArraySkill}
                                        onChange={(e) => setTempArraySkill(e.target.value)}
                                        placeholder='Skills(*)'
                                        size="small"
                                        type='text'
                                        error={error2 ? true : false}
                                        helperText={error2}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant='outlined' startIcon={<AddIcon />} style={{ borderRadius: 15 }} onClick={() => { addSkillInArray() }}>
                                        Add Skill
                                    </Button>
                                </Grid>


                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 1"
                                        name="previous_org1"
                                        value={formData.previous_org1}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'

                                        helperText="Optional"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 2"
                                        name="previous_org2"
                                        value={formData.previous_org2}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                        helperText="Optional"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        label="Previous Org 3"
                                        name="previous_org3"
                                        value={formData.previous_org3}
                                        onChange={handleChange}
                                        size="small"
                                        type='text'
                                        helperText="Optional"
                                    />
                                </Grid>



                            </Grid>
                            <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 20, borderRadius: 20 }}>
                                Submit
                            </Button>
                        </form>

                    </Container>

                </DialogContent>
            </Dialog>
        )
    }, [openList, formData, oemArray, projectArray, mobilecommExp, tempArraySkill, arraySkill])

    // DELETE REMARK DIALOG BOX................
    const handleDeleteRemark = useCallback(() => {

        // console.log('remark', userId)
        return (
            <Dialog
                open={openDelete}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                maxWidth={'sm'}
                fullWidth={true}
            >
                <DialogTitle style={{ borderBottom: '1px solid black', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItem: 'center' }}><Box><RateReviewIcon fontSize='large' color='primary' /></Box><Box sx={{ color: 'red' }}>Are You Sure? Add Deletion Remark</Box></Box>
                    <Box >
                        <Tooltip title="Cancel">
                            <IconButton onClick={handleClose}>
                                <CloseIcon fontSize='medium' color='default' />
                            </IconButton>
                        </Tooltip>
                    </Box>

                </DialogTitle>
                <DialogContent>
                    <Box component='form' onSubmit={handleDelete} sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
                        <Box>
                            <textarea required style={{ width: '100%', height: '150px' }} onChange={(e) => setDeleteRemark(e.target.value)} placeholder='Add remark ( at least 5 words )'>{deleteRemark}</textarea>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button type='submit' color='error' variant="outlined">Delete</Button>
                            {/* <Button type='submit' color='error' variant="outlined" onClick={handleClose}>Cancel</Button> */}
                        </Box>


                    </Box>

                </DialogContent>

            </Dialog>
        )
    }, [openDelete, deleteRemark])

    // handleExport Range wise table in excel formet.........
    const handleExport = () => {

        const workbook = new ExcelJS.Workbook();
        const sheet1 = workbook.addWorksheet("Employee Skills", { properties: { tabColor: { argb: 'f1948a' } } })
        sheet1.mergeCells('A1:J1');
        sheet1.mergeCells('K1:Y1');
        sheet1.getCell('A1').value = 'HR INFO';
        sheet1.getCell('K1').value = 'Cordinator';

        sheet1.getCell('A2').value = 'emp_Code';
        sheet1.getCell('B2').value = 'Employee_name';
        sheet1.getCell('C2').value = 'Designation';
        sheet1.getCell('D2').value = 'DOJ';
        sheet1.getCell('E2').value = 'Circle';
        sheet1.getCell('F2').value = 'Project Name';
        sheet1.getCell('G2').value = 'Manager Emp. Code';
        sheet1.getCell('H2').value = 'Reporting Manager Name';
        sheet1.getCell('I2').value = 'Mobile_no';
        sheet1.getCell('J2').value = 'email_id';
        sheet1.getCell('K2').value = 'Domain';
        sheet1.getCell('L2').value = 'Project';
        sheet1.getCell('M2').value = 'Current Role';
        sheet1.getCell('N2').value = 'Key Responsibility';
        sheet1.getCell('O2').value = 'skillsets';
        sheet1.getCell('P2').value = 'oem';
        sheet1.getCell('Q2').value = 'Total Exp';
        sheet1.getCell('R2').value = 'Mobilecomm Exp';
        sheet1.getCell('S2').value = 'Previous Org1';
        sheet1.getCell('T2').value = 'Previous Org2';
        sheet1.getCell('U2').value = 'Previous Org3';
        sheet1.getCell('V2').value = 'Current designation';
        sheet1.getCell('W2').value = 'working_status';
        sheet1.getCell('X2').value = 'Team Category';
        sheet1.getCell('Y2').value = 'Current Circle';


        sheet1.columns = [
            { key: 'emp_code' },
            { key: 'employee_name' },
            { key: 'designation' },
            { key: 'doj' },
            { key: 'circle' },
            { key: 'project_name' },
            { key: 'manager_emp_code' },
            { key: 'reporting_manager_name' },
            { key: 'mobile_no' },

            { key: 'email_id' },
            { key: 'domain' },
            { key: 'project' },
            { key: 'current_role' },
            { key: 'key_responsibility' },
            { key: 'skillsets' },
            { key: 'oem' },
            { key: 'total_exp' },


            { key: 'mobilecomm_exp' },
            { key: 'previous_org1' },
            { key: 'previous_org2' },
            { key: 'previous_org3' },
            { key: 'current_designation' },
            { key: 'working_status' },
            { key: 'team_category' },
            { key: 'current_circle' },

        ]


        // sheet1.columns = [
        //     { header: 'emp_Code', key: 'emp_code', width: 10 },
        //     { header: 'Employee_name', key: 'employee_name', width: 10 },
        //     { header: 'Designation', key: 'designation', width: 10 },
        //     { header: 'DOJ', key: 'doj', width: 10 },
        //     { header: 'Circle', key: 'circle', width: 10 },
        //     { header: 'Project Name', key: 'project_name', width: 10 },
        //     { header: 'Manager Emp. Code', key: 'manager_emp_code', width: 10 },
        //     { header: 'Reporting Manager Name', key: 'reporting_manager_name', width: 10 },
        //     { header: 'Mobile_no', key: 'mobile_no', width: 10 },
        //     { header: 'email_id', key: 'email_id', width: 10 },
        //     { header: 'Domain', key: 'domain', width: 10 },
        //     { header: 'Project', key: 'project', width: 10 },
        //     { header: 'Current Role', key: 'current_role', width: 10 },
        //     { header: 'Key Responsibility', key: 'key_responsibility', width: 10 },
        //     { header: 'skillsets', key: 'skillsets', width: 10 },
        //     { header: 'oem', key: 'oem', width: 10 },
        //     { header: 'Total Exp', key: 'total_exp', width: 10 },
        //     { header: 'Mobilecomm Exp', key: 'mobilecomm_exp', width: 10 },
        //     { header: 'Previous Org1', key: 'previous_org1', width: 10 },
        //     { header: 'Previous Org2', key: 'previous_org2', width: 10 },
        //     { header: 'Previous Org3', key: 'previous_org3', width: 10 },
        //     { header: 'Current designation', key: 'current_designation', width: 10 },
        //     { header: 'working_status', key: 'working_status', width: 10 },
        //     { header: 'Team Category', key: 'team_category', width: 10 },
        // ]

        data?.map(props => {
            sheet1.addRow({
                circle: props.circle,
                current_designation: props.current_designation,
                current_role: props.current_role,
                designation: props.designation,
                doj: props.doj,
                domain: props.domain,
                email_id: props.email_id,
                emp_code: props.emp_code,
                employee_name: props.employee_name,
                key_responsibility: props.key_responsibility,
                manager_emp_code: props.manager_emp_code,
                mobile_no: props.mobile_no,
                mobilecomm_exp: props.mobilecomm_exp,
                oem: props.oem,
                previous_org1: props.previous_org1,
                previous_org2: props.previous_org2,
                previous_org3: props.previous_org3,
                project: props.project,
                project_name: props.project_name,
                reporting_manager_name: props.reporting_manager_name,
                skillsets: props.skillsets,
                team_category: props.team_category,
                total_exp: props.total_exp,
                working_status: props.working_status,
                current_circle: props.current_circle

            })
        })


        ///__________ STYLING IN EXCEL TABLE ______________ ///
        sheet1.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            const rows = sheet1.getColumn(1);
            const rowsCount = rows['_worksheet']['_rows'].length;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
                // if (rowNumber === rowsCount) {
                //     cell.fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'FE9209' }
                //     }
                //     cell.font = {
                //         color: { argb: 'FFFFFF' },
                //         bold: true,
                //         size: 13,
                //     }
                // }
                if (rowNumber === 2) {
                    // First set the background of header row
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '223354' }
                    }
                    cell.font = {
                        color: { argb: 'FFFFFF' },
                        bold: true,
                        size: 13,
                    }
                    cell.views = [{ state: 'frozen', ySplit: 1 }]
                }
                if ((rowNumber === 1 && colNumber >= 1 && colNumber <= 10)) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '9BC2E6' }
                    }
                    cell.font = {
                        color: { argb: '000000' },
                        bold: true,
                        size: 13,
                    }
                }
                if ((rowNumber === 1 && colNumber >= 11 && colNumber <= 25)) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'A9D08E' }
                    }
                    cell.font = {
                        color: { argb: '000000' },
                        bold: true,
                        size: 13,
                    }
                }
            })
        })

        workbook.xlsx.writeBuffer().then(item => {
            const blob = new Blob([item], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet"
            })
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = "Employee data.xlsx";
            anchor.click();
            window.URL.revokeObjectURL(url);
        })

    }

    useEffect(() => {
        // fetchAllData();
        if (data) {
            handleCircleArray(data)
            handleOemsArray(data)
            handleDesignationArray(data)
        }
        document.title = `${window.location.pathname.slice(1).replaceAll('_', ' ').replaceAll('/', ' | ').toUpperCase()}`
    }, [])


    return (
        <>
            <div style={{ margin: 10 }}>
                <div style={{ height: 'auto', width: '100%', margin: '5px 0px', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 3px 8px', backgroundColor: 'white', borderRadius: '10px', padding: '1px', display: 'flex' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10} style={{ display: "flex" }}>
                            <Box >
                                <Tooltip title="Add List" color='primary'>
                                    <IconButton onClick={() => { setOpenList(true) }} color='primary'>
                                        <PlaylistAddIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            {/* <Box sx={{ marginTop: 1, marginBottom: 1, float: 'right' }}>
                                <Paper
                                    component="form"
                                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search Employee ID"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Box> */}
                            <Box style={{ float: 'right', display: 'flex' }}>
                                <Paper
                                    component="form"
                                    onSubmit={handleSearchClick}
                                    sx={{ p: '2px 2px', display: 'flex', alignItems: 'center', width: 200 }}
                                >
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search Employee ID"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search"  >
                                        <SearchIcon fontSize='medium' />
                                    </IconButton>
                                </Paper>
                                <Tooltip title="Export Excel">
                                    <IconButton onClick={handleExport}>
                                        <DownloadIcon fontSize='medium' color='primary' />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                    </Grid>
                </div>

                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 500, width: '100%' }} ref={scrollableContainerRef} onScroll={handleScroll}>
                        <Table stickyHeader >
                            <TableHead style={{ fontSize: 18 }}>
                                <TableRow >
                                    <StyledTableCell align="center" sx={{ position: 'sticky', top: 0, zIndex: 1 }}>Emp. ID</StyledTableCell>
                                    <StyledTableCell align="center" style={{ position: 'sticky', top: 0, zIndex: 1 }}>Emp. Name</StyledTableCell>
                                    <StyledTableCell align="center" >
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box> Circle </Box>
                                            <Box>  <Select
                                                multiple
                                                value={circleData}
                                                // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                                onChange={handleCircle}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) {
                                                        return <em>All</em>;
                                                    }
                                                    // return selected.join(', ');
                                                }}
                                                style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                                <MenuItem onClick={() => { setCircleData() }}  >All</MenuItem>
                                                {circleArray.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        <Checkbox size='small' checked={circleData.indexOf(item) > -1} />
                                                        <ListItemText primary={item} />
                                                    </MenuItem>
                                                ))}

                                            </Select></Box>
                                        </Box>

                                    </StyledTableCell>
                                    <StyledTableCell align="center">Current Circle</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box>Designation</Box>
                                            <Box><Select
                                                multiple
                                                value={designationData}
                                                // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                                onChange={handleDesignation}
                                                displayEmpty
                                                renderValue={(selected) => {
                                                    if (selected.length === 0) {
                                                        return <em>All</em>;
                                                    }
                                                    // return selected.join(', ');
                                                }}
                                                style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                                <MenuItem onClick={() => { setDesignationData([]) }}  >All</MenuItem>
                                                {designationArr.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        <Checkbox size='small' checked={designationData.indexOf(item) > -1} />
                                                        <ListItemText primary={item} />
                                                    </MenuItem>
                                                ))}

                                            </Select></Box>
                                        </Box>

                                    </StyledTableCell>
                                    <StyledTableCell align="center">DOJ</StyledTableCell>
                                    <StyledTableCell align="center">Project Name</StyledTableCell>
                                    <StyledTableCell align="center">Manager Emp. Code</StyledTableCell>
                                    <StyledTableCell align="center">Reporting Manager Name

                                        {/* <Select
                                            multiple
                                            value={managerNameData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleManagerData}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setManagerNameData([]) }}  >All</MenuItem>
                                            {managerNameArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={managerNameData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select> */}

                                    </StyledTableCell>
                                    <StyledTableCell align="center">Mobile No.</StyledTableCell>
                                    <StyledTableCell align="center">Email ID</StyledTableCell>
                                    <StyledTableCell align="center">Domain
                                        {/* <Select
                                            multiple
                                            value={departmentData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleDepartment}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setDepartmentData([]) }}  >All</MenuItem>
                                            {departmentArray.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={departmentData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select> */}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Project (Tech)

                                        {/* <Select
                                            multiple
                                            value={projectTechData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleProjectTechData}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setProjectTechData([]) }}  >All</MenuItem>
                                            {projectTechArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={projectTechData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}
                                        </Select> */}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Current Role</StyledTableCell>
                                    <StyledTableCell align="center">Key Responsibility</StyledTableCell>
                                    <StyledTableCell align="center">Skillsets</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <Box>OEM</Box>
                                            <Box>
                                                <Select
                                                    multiple
                                                    value={oemsData}
                                                    // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                                    onChange={handleOemsData}
                                                    displayEmpty
                                                    renderValue={(selected) => {
                                                        if (selected.length === 0) {
                                                            return <em>All</em>;
                                                        }
                                                        // return selected.join(', ');
                                                    }}
                                                    style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                                    <MenuItem onClick={() => { setOemsData([]) }}  >All</MenuItem>
                                                    {oemsArr.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            <Checkbox size='small' checked={oemsData.indexOf(item) > -1} />
                                                            <ListItemText primary={item} />
                                                        </MenuItem>
                                                    ))}

                                                </Select></Box>
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Total Experience
                                        {/* <Select
                                            multiple
                                            value={experienceData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleExperience}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setExperienceData([]) }}  >All</MenuItem>
                                            {experienceArray.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={experienceData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select> */}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Mobilecomm Exp </StyledTableCell>
                                    <StyledTableCell align="center">Previous Org. 1</StyledTableCell>
                                    <StyledTableCell align="center">Previous Org. 2</StyledTableCell>
                                    <StyledTableCell align="center">Previous Org. 3</StyledTableCell>
                                    <StyledTableCell align="center">Current Designation</StyledTableCell>
                                    <StyledTableCell align="center">Working Status

                                        {/* <Select
                                            multiple
                                            value={workingStatusData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleWorkingStatusData}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setWorkingStatusData([]) }}  >All</MenuItem>
                                            {workingStatusArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={workingStatusData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select> */}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">Team Category
                                        {/* <Select
                                            multiple
                                            value={teamCategoryData}
                                            // onChange={(e)=>{setProject(e.target.value);tableData()}}
                                            onChange={handleTeamCategoryData}
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>All</em>;
                                                }
                                                // return selected.join(', ');
                                            }}
                                            style={{ float: 'right', color: 'black', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
                                            <MenuItem onClick={() => { setTeamCategoryData([]) }}  >All</MenuItem>
                                            {teamCategoryArr.map((item, index) => (
                                                <MenuItem key={index} value={item}>
                                                    <Checkbox size='small' checked={teamCategoryData.indexOf(item) > -1} />
                                                    <ListItemText primary={item} />
                                                </MenuItem>
                                            ))}

                                        </Select> */}

                                    </StyledTableCell>
                                    <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {TableData()}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {handleAddList()}
                {handleDialBox()}
                {handleDeleteRemark()}
                {loading}
            </div>

        </>
    )
}

export default Dashboard