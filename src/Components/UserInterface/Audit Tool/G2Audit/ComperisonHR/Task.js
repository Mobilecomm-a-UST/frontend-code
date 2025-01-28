import React, { useEffect,useState } from 'react'
import { useGet } from '../../../../Hooks/GetApis'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { useQuery } from '@tanstack/react-query'
import { Button } from '@mui/material';
import { useStyles } from '../../../ToolsCss';
import { ServerURL } from '../../../../services/FetchNodeServices';

const Task = () => {
    const { response, makeGetRequest } = useGet()
    const [tableData, setTableData] = useState([])
    const classes = useStyles()
    const { data } = useQuery({
        queryKey: ['2G_audit_Task'],
        queryFn: async () => {
            const res = await makeGetRequest('AUDIT_TOOL/api/tasks/')
            if (res) {
                console.log('2G audit data', res)
                return res
            }

        },
        staleTime: 100000,
        refetchOnReconnect: false,
    })



    return (
       <>
        <TableContainer sx={{ maxHeight: 540,width:'900px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>App Name    </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>User     </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>Task ID   </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>Circle</th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>Status  </th>
                                        <th style={{ padding: '5px 20px', whiteSpace: 'nowrap', backgroundColor: '#5AB2FF' }}>
                                           File Download
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.filter((item)=>item.circle === 'HRY').map((item,index) => (
                                        <tr className={classes.hover} key={index} style={{ textAlign: "center", fontWeigth: 700 }}>
                                             <th  >{item.app_name}</th>
                                             <th  >{item.user}</th>
                                             <th  >{item.task_id}</th>
                                             <th  >{item.circle}</th>
                                             <th  >{item.status}</th>
                                             <th  ><a type='download' href={`${ServerURL}/${item.file_link}`}>{item.file_link?<Button>Download</Button>:''}</a></th>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContainer>
       </>
    )
}

export const MemoTask = React.memo(Task)