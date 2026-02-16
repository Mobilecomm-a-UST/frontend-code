import React from 'react'
import { Box } from '@mui/material';
import { useStyles } from '../../ToolsCss'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';


const ItemList = (props) => {
    const { list } = props;
    const classes = useStyles()


    console.log('props data ', list)
    return (
        <>
            <Box sx={{ m: 1, ml: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <TableContainer sx={{ maxHeight: '58vh', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                        <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                            <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                    <th style={{ padding: '5px 10px', whiteSpace: 'nowrap', position: 'sticky', left: 0, top: 0, backgroundColor: '#006e74' }}>
                                        Issue Name
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Start Date
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Close Date
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Duration Days
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Remarks
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Issue Owner
                                    </th>
                                    <th style={{ padding: '5px 5px', whiteSpace: 'nowrap', backgroundColor: '#CBCBCB', color: 'black' }}>
                                        Action
                                    </th>


                                </tr>
                            </thead>
                            <tbody>
                                {list?.map((it, index) => {
                                    return (
                                        <tr className={classes.hoverRT} style={{ textAlign: "center", fontWeigth: 700 }} key={index}>
                                            <th style={{ position: 'sticky', left: 0, top: 0, backgroundColor: '#CBCBCB', color: 'black' }}>{it['Issue Name']}</th>
                                            <th style={{ color: 'black' }}>{it['Start Date']}</th>
                                            <th style={{ color: 'black' }}>{it['Close Date']}</th>
                                            <th style={{ color: 'black' }}>{it['Duration']}</th>
                                            <th style={{ color: 'black' }}>{it['remarks']}</th>
                                            <th style={{ color: 'black' }}>{it['Issue Owner']}</th>
                                            <th style={{ color: 'black' }}>
                                                {/* {it.Status == 'Closed' ? <IconButton >
                                                    <BlockIcon size='small' color='error' />
                                                </IconButton> : <IconButton onClick={() => handleEditList(it)}>
                                                    <EditIcon size='small' color='primary' />
                                                </IconButton>}
                                                {userTypes?.includes('RLT_Admin') && <IconButton onClick={() => handleDeleteIssue(it.id)}>
                                                    <DeleteIcon size='small' color='error' />
                                                </IconButton>} */}

                                            </th>
                                        </tr>
                                    )
                                }
                                )}
                            </tbody>
                        </table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    )

}

export default ItemList