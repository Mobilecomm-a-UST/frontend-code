import React from 'react'
import { useState,useEffect } from 'react'
import { getData } from '../../services/FetchNodeServices'
import { Table, Button,Pagination } from 'rsuite';
import { Stack ,Box} from "@mui/material";
import { Modal, Placeholder } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import CachedIcon from '@mui/icons-material/Cached';



const { Column, HeaderCell, Cell } = Table;

export default function NewTable(props) {
  const [open, setOpen] = React.useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
    const [vehicle,setVehicle] = useState([])
    const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [temp , setTemp]=useState({});
  const [searchSiteId,setSearchSiteId] = useState()
  const [searchCircle,setSearchCircle] = useState()
  const [searchProject,setSearchProject] = useState()
  const [searchActivity,setSearchActivity] = useState()


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(searchSiteId)

  const StyledTableRow = styled(Cell)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const FetchAllSiteId=async()=>
  {
      const response = await getData(`trend/dpr_site_list/?id search=${searchSiteId}`)
      setVehicle(response.data)
      console.log(response.data)
  }

  const FetchAllCircle=async()=>
  {
      const response = await getData(`trend/dpr_site_list/?circle search=${searchCircle}`)
      setVehicle(response.data)
      console.log(response.data)
  }
  const FetchAllProject=async()=>
  {
      const response = await getData(`trend/dpr_site_list/?project search=${searchProject}`)
      setVehicle(response.data)
      console.log(response.data)
  }
  const FetchAllActivity=async()=>
  {
      const response = await getData(`trend/dpr_site_list/?activity search=${searchActivity}`)
      setVehicle(response.data)
      console.log(response.data)
  }

    const FetchAllVehicle=async()=>
    {
        const response = await getData('trend/dpr_site_list/')
        setVehicle(response.data)
        console.log(response.data)
    }
    useEffect(function () {
        FetchAllVehicle();
      }, []);

      const transferData=(event)=>
      {
        console.log(event);


        dispatch({type:'ADD_DATES',payload:{event}})
        navigate('/dpr/edit_data');

      }

      const handleChangeLimit = dataKey => {
        setPage(1);
        setLimit(dataKey);
      };

      const data = vehicle.filter((v, i) => {
        const start = limit * (page - 1);
        const end = start + limit;
        return i >= start && i < end;
      });

    const DisplayTable=()=>
    {
        return(
          <>
            <Table

      height={400}

      data={data}
      onRowClick={rowData => {
        console.log(rowData);
      }}
      style={{backgroundColor:"#223353"}}

    >

<Column width={100} fixed>
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>SITE ID</HeaderCell>
        <Cell dataKey="SITE_ID" />
      </Column>

      <Column width={110}>
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>CIRCLE</HeaderCell>
        <Cell dataKey="CIRCLE" />
      </Column>



      <Column width={200}>
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>PROJECT</HeaderCell>
        <Cell dataKey="Project" />
      </Column>

      <Column width={150}>
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>ACTIVITY</HeaderCell>
        <Cell dataKey="Activity" />
      </Column>

      <Column width={200}>
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>BAND</HeaderCell>
        <Cell dataKey="BAND" />
      </Column>



      <Column width={120} fixed="right">
        <HeaderCell style={{fontSize:"16px",fontWeight:"bold",color:"#ffffff",backgroundColor:"#223353"}}>ACTIONS</HeaderCell>

        <Cell style={{ padding: '6px' }}>
          {rowData => (
            <Button style={{width:80}} color="green" appearance="primary"  onClick={() =>transferData(rowData)}>
              Edit
            </Button>
          )}
        </Cell>
      </Column>
    </Table>
    <div style={{ padding: 20 }}>
    <Pagination
      prev
      next
      first
      last
      ellipsis
      boundaryLinks
      maxButtons={5}
      size="xs"
      layout={['total', '-', 'limit', '|', 'pager', 'skip']}
      total={vehicle.length}
      limitOptions={[10, 30, 50]}
      limit={limit}
      activePage={page}
      onChangePage={setPage}
      onChangeLimit={handleChangeLimit}
    />
  </div>

       </> )
    }
    // ############# DIALOG ############

    const dishplayDilog=()=>
    {
        return(
          <div>
          <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Placeholder.Paragraph />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} appearance="primary">
            Ok
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
          </div>
        )
    }



  return (
    <div style={{padding:"10px",display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <div>
      <Stack spacing={2} direction="row" style={{display:"flex",
justifyContent:"space-around",alignItems:"baseline",flexDirection:"row",marginTop:3}}>
        <Box><Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search By Circle"
        onChange={(event)=>setSearchCircle(event.target.value)}

      />
      <IconButton onClick={FetchAllCircle} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper></Box>
        <Box><Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search By Site ID"
        onChange={(event)=>setSearchSiteId(event.target.value)}
      />
      <IconButton onClick={FetchAllSiteId} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper></Box>
        <Box><Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search By Project"
        onChange={(event)=>setSearchProject(event.target.value)}
      />
      <IconButton onClick={FetchAllProject} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper></Box>
    <Box><Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 200 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search By Activity"
        onChange={(event)=>setSearchActivity(event.target.value)}
      />
      <IconButton onClick={FetchAllActivity} type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper></Box>
      </Stack>
      </div>
       <div>
       <Box sx={{position:"relative",top:64,right:"-91%",cursor:"pointer"}} onClick={FetchAllVehicle}><CachedIcon style={{scale:1.5,color:"green"}}/></Box>
        <Box sx={{
          width:900,
          padding:"10px",
          boxShadow:"1px 1px 14px 1px black",
          marginLeft:"auto",
          marginRight:"auto",
          marginTop:3}}>

        {DisplayTable()}
        </Box>
        </div>
    </div>
  )
}
