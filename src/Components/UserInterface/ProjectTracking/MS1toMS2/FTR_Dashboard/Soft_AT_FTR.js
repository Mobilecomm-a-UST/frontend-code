import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField } from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import { useLoadingDialog } from '../../../../Hooks/LoadingDialog';
import { useStyles } from '../../../ToolsCss'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { postData } from '../../../../services/FetchNodeServices';
import 'rsuite/dist/rsuite.min.css';
import * as ExcelJS from 'exceljs'


const Soft_AT_FTR = () => {
    const { loading, action } = useLoadingDialog();
    const [tableData, setTableData] = useState([]);
    const [typeFileter, setTypeFilter] = useState('Overall')
    const [year, setYear] = useState('2025');
    const columns = tableData?.length
        ? Object.keys(tableData[0]).filter(key => key !== 'Circle')
        : [];

    const classes = useStyles();


    // console.log('check type breakpoint', breakpoint1, breakpoint2)


    const fetchDailyData = async () => {
        action(true)
        var formData = new FormData()
        formData.append('year', year)
        formData.append('type', typeFileter) // 'Relocation', 'Non-Relocation', 'Overall'


        const res = await postData("alok_tracker/ftr_table_circlewise/", formData);
        // const res =  tempData; //  remove this line when API is ready
        console.log('ftr table data', res)
        if (res) {
            action(false)
            setTableData(res.soft_at)
            // setMos_done(JSON.parse(res.json_data.done_summary))
            // setMainDataT2(JSON.parse(res.data))
        }
        else {
            action(false)
        }

    }

    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("FTR Summary");

        // ------------------ DYNAMIC HEADERS ------------------
        const columnKeys = tableData?.length
            ? Object.keys(tableData[0])
            : [];

        const columns = columnKeys.map((key) => ({
            header: key,
            key: key,
            width: key === "FTR" ? 30 : 15,
        }));

        sheet.columns = columns;

        // ------------------ ADD ROWS ------------------
        tableData.forEach((row) => {
            const excelRow = {};

            columnKeys.forEach((key) => {
                excelRow[key] = row[key] ?? "";
            });

            sheet.addRow(excelRow);
        });

        // ------------------ STYLE HEADER ------------------
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" } };
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "223354" },
            };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // ------------------ STYLE BODY ------------------
        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            row.eachCell((cell, colNumber) => {
                cell.alignment = {
                    horizontal: colNumber === 1 ? "left" : "center",
                };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });
        });

        // ------------------ DOWNLOAD ------------------
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "SOFT_AT_FTR_Summary.xlsx";
        a.click();
        URL.revokeObjectURL(url);
    };



    useEffect(() => {
        fetchDailyData()
        // setTotals(calculateColumnTotals(tableData))
    }, [year, typeFileter]);
    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* 2G  TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            SOFT AT FTR Dashboard
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>

                            <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Type</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={typeFileter}
                                    label="Type"
                                    onChange={(e) => { setTypeFilter(e.target.value) }}
                                >
                                    <MenuItem value="Overall">Overall</MenuItem>
                                    <MenuItem value="Relocation">Relocation</MenuItem>
                                    <MenuItem value="Non-Relocation">Non-Relocation</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 120, maxWidth: 120 }} size="small">
                                <InputLabel id="demo-select-small-label">Year</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={year}
                                    label="Year"
                                    onChange={(e) => { setYear(e.target.value) }}
                                >
                                    <MenuItem value="2021">2021</MenuItem>
                                    <MenuItem value="2022">2022</MenuItem>
                                    <MenuItem value="2023">2023</MenuItem>
                                    <MenuItem value="2024">2024</MenuItem>
                                    <MenuItem value="2025">2025</MenuItem>
                                    <MenuItem value="2026">2026</MenuItem>
                                    <MenuItem value="2027">2027</MenuItem>
                                </Select>
                            </FormControl>









                            <Tooltip title="Download Soft AT FTR Excel">
                                <IconButton
                                    component="a"
                                    // href={downloadExcelData}
                                    // download
                                    onClick={handleExportExcel}
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        <th
                                            rowSpan={2}
                                            style={{
                                                padding: '1px 1px',
                                                whiteSpace: 'nowrap',
                                                position: 'sticky',
                                                left: 0,
                                                top: 0,
                                                zIndex: 3,
                                                backgroundColor: '#006e74'
                                            }}
                                        >
                                            Circle
                                        </th>

                                        <th colSpan={columns.length} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>
                                            SOFT AT FTR
                                        </th>
                                    </tr>

                                    <tr style={{ fontSize: 15, backgroundColor: "#CBCBCB", color: "balck", border: '1px solid white' }}>
                                        {columns.map((col, idx) => (
                                            <th key={idx} style={{ padding: '1px 1px', whiteSpace: 'nowrap' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className={classes.hoverRT}
                                            style={{ textAlign: "center", fontWeigth: 700 }}
                                        >
                                            {/* Sticky First Column */}
                                            <th
                                                style={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    top: 0,
                                                    zIndex: 3,
                                                    backgroundColor: '#CBCBCB',
                                                    color: 'black'
                                                }}
                                            >
                                                {row.Circle}
                                            </th>

                                            {/* Dynamic Data Cells */}
                                            {columns.map((col, colIndex) => (
                                                <th key={colIndex} style={{ color: 'black' }}>
                                                    {row[col]}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </TableContainer>


                    </Box>
                </div>
            </Slide>
            {/* {gapData && filterDialog()} */}
            {loading}
        </>
    )
}

export default Soft_AT_FTR