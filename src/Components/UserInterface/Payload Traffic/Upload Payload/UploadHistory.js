import React from "react";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Table, TableBody, TableCell, TableContainer,TableHead, TableRow, Paper} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { usePost } from "../../../Hooks/PostApis";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import Slide from "@mui/material/Slide";

//  Styling (same as yours)
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#223354",
        color: theme.palette.common.white,
        textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
        textAlign: "center",
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(odd)": {
        backgroundColor: "#f5f5f5",
    },
}));

const UploadHistory = () => {
    const navigate = useNavigate();
    const { makePostRequest } = usePost();

    //  Fetch data
    const { data, refetch } = useQuery({
        queryKey: ["upload_history"],
        queryFn: async () => {
            let formData = new FormData();
            const res = await makePostRequest("payload_traffic/get_history/", formData);
            return res;
        },
    });

    useEffect(() => {
        refetch();
    }, []);

    return (
        <>
            <div style={{ margin: 10, marginLeft: 10, marginTop: 20 }}>
                <div style={{ margin: 5, marginLeft: 10 ,margintop:30}}>
                    <Breadcrumbs aria-label="breadcrumb" itemsBeforeCollapse={2} maxItems={3} separator={<KeyboardArrowRightIcon fontSize="small" />}>

                        <Link underline="hover" onClick={() => { navigate('/tools') }}>Tools</Link>
                        <Link underline="hover" onClick={() => { navigate('/tools/payload_traffic') }}>Payload Traffic</Link>
                        <Typography color='text.primary'>Upload History</Typography>

                    </Breadcrumbs>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>User Payload History</h3>

                </div>
            </div>
            
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 1 }}>
            <TableContainer sx={{ maxHeight: "80vh" }}>
                <Table stickyHeader>

                    {/*  Header */}
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Sr. No.</StyledTableCell>
                            <StyledTableCell>User Name</StyledTableCell>
                            <StyledTableCell>File Name</StyledTableCell>
                            <StyledTableCell>Traffic Date</StyledTableCell>
                            <StyledTableCell>Table Name</StyledTableCell>
                            <StyledTableCell>Row Inserted</StyledTableCell>
                            <StyledTableCell>Upload Timestamp</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {/*  Body */}
                    <TableBody>
                        {data?.data?.length > 0 ? (
                            data.data.map((row, index) => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.user}</StyledTableCell>
                                    <StyledTableCell>{row.filename}</StyledTableCell>
                                    <StyledTableCell>{row.traffic_date}</StyledTableCell>
                                    <StyledTableCell>{row.table_name}</StyledTableCell>
                                    <StyledTableCell>{row.row_inserted}</StyledTableCell>
                                    <StyledTableCell>{row.upload_timestamp}</StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
        </>
    );
};

export default UploadHistory;

