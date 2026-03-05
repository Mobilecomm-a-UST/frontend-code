import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Box, Button, Paper, TableContainer, TextField } from "@mui/material";
import { useStyles } from "../../ToolsCss";
import axios from "axios";
import Swal from "sweetalert2";
import CheckPicker from "rsuite/CheckPicker";
import { ServerURL } from "../../../services/FetchNodeServices";
import { getDecreyptedData } from "../../../utils/localstorage";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";
import { useAsyncError } from "react-router-dom";

const ItemList = ({ list = [], circle, siteId ,handleClear}) => {
    const classes = useStyles();
    const { action, loading } = useLoadingDialog();

    const [selectModule, setSelectModule] = useState([]);
    const [selectSerialNumber, setSelectSerialNumber] = useState([]);
    const [partners , setPartners] = useState('')
    const [partnerCode, setPartnerCode] = useState('')


    /* ---------------- MODULE OPTIONS ---------------- */
    const moduleArr = useMemo(() => {
        return [...new Set(list.map(item => item["Model"]))];
    }, [list]);

    const serialNumberArr = useMemo(() => {
        return [...new Set(list.map(item => item["Serial Number"]))];
    }, [list]);

    /* ---------------- FILTER DATA ---------------- */
    const filteredData = useMemo(() => {
        return list.filter(item => {
            const moduleMatch =
                selectModule.length === 0 ||
                selectModule.includes(item["Model"]);

            const serialMatch =
                selectSerialNumber.length === 0 ||
                selectSerialNumber.includes(item["Serial Number"]);

            return moduleMatch && serialMatch;
        });
    }, [list, selectModule, selectSerialNumber]);

    /* ---------------- API SUBMIT ---------------- */
    const handleMobinerDataSubmit = async () => {
        console.log('out put ' , partners.length)
        if(partners.length > 2 && partnerCode.length > 1){
            action(true);
            try {
                const payload = new FormData();
                payload.append("circle", circle);
                payload.append("siteId", siteId);
                payload.append("data", JSON.stringify(list));
                payload.append("partner", partners)
                payload.append("partner_code", partnerCode)

                const response = await axios.post(
                    `${ServerURL}/degrow_dismental/mobinet_data_submit_central/`,
                    payload,
                    {
                        headers: {
                            Authorization: `token ${getDecreyptedData("tokenKey")}`
                        }
                    }
                );
                // console.log("Mobinet Data Submit Response:", response);
                handleClear();
                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: `${response.data.message}`,
                });

            } catch (error) {
                action(false);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.error || error.message,
                });
            }
        }else{
            alert("!Please Enter Partner Name & Partner Code")
        }
    };

    /* ---------------- TABLE ROWS ---------------- */
    const tableRows = useMemo(() => {
        return filteredData.map((it, index) => (
            <tr
                key={index}
                className={classes.hoverRT}
                style={{ textAlign: "center" }}
            >
                <th style={{ position: "sticky", left: 0, background: "#CBCBCB" }}>
                    {it["Model"]}
                </th>
                <th>{it["Serial Number"]}</th>
                <th>{it["Expected Quantity"]}</th>
            </tr>
        ));
    }, [filteredData, classes.hoverRT]);

    return (
        <>
        <style>{"th{border:1px solid black;}"}</style>
            <Box sx={{ m: 1, ml: 2 }}>
                <TableContainer
                    component={Paper}
                    sx={{ maxHeight: "58vh" }}
                >
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#006e74", color: "white" }}>
                                <th>
                                    Model Name
                                    <CheckPicker
                                        data={moduleArr.map(v => ({ label: v, value: v }))}
                                        value={selectModule}
                                        onChange={setSelectModule}
                                        size="sm"
                                    />
                                </th>

                                <th>
                                    Serial Number
                                    <CheckPicker
                                        data={serialNumberArr.map(v => ({ label: v, value: v }))}
                                        value={selectSerialNumber}
                                        onChange={setSelectSerialNumber}
                                        size="sm"
                                    />
                                </th>

                                <th>Mobinet Quantity</th>
                            </tr>
                        </thead>

                        <tbody>{tableRows}</tbody>
                    </table>
                </TableContainer>
                <Box sx={{mt:2,display:'flex' ,gap:2}}>
                    <TextField fullWidth size='small' placeholder='Enter Partner Name' label="Enter Partner Name" name='partner' required value={partners} onChange={(e)=>setPartners(e.target.value)}  />
                    <TextField fullWidth size='small' placeholder='Enter Partner Code' label="Enter Partner Code" name='partner' required value={partnerCode} onChange={(e)=>setPartnerCode(e.target.value)}  />
                </Box>

                <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 1 }}
                    fullWidth
                    onClick={handleMobinerDataSubmit}
                >
                    Ready For Site Survey
                </Button>
            </Box>

            {loading}
        </>
    );
};

export default React.memo(ItemList);