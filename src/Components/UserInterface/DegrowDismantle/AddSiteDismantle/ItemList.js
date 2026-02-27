import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Box, Button, Paper, TableContainer } from "@mui/material";
import { useStyles } from "../../ToolsCss";
import axios from "axios";
import Swal from "sweetalert2";
import CheckPicker from "rsuite/CheckPicker";
import { ServerURL } from "../../../services/FetchNodeServices";
import { getDecreyptedData } from "../../../utils/localstorage";
import { useLoadingDialog } from "../../../Hooks/LoadingDialog";

const ItemList = ({ list = [], circle, siteId ,handleClear}) => {
    const classes = useStyles();
    const { action, loading } = useLoadingDialog();

    const [selectModule, setSelectModule] = useState([]);
    const [selectSerialNumber, setSelectSerialNumber] = useState([]);

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
    const handleMobinerDataSubmit = useCallback(async () => {
        action(true);

        try {
            const payload = new FormData();
            payload.append("circle", circle);
            payload.append("siteId", siteId);
            payload.append("data", JSON.stringify(list));

            const response = await axios.post(
                `${ServerURL}/degrow_dismental/mobinet_data_submit_central/`,
                payload,
                {
                    headers: {
                        Authorization: `token ${getDecreyptedData("tokenKey")}`
                    }
                }
            );

            console.log("Mobinet Data Submit Response:", response);
            handleClear();
            Swal.fire({
                icon: "success",
                title: "Done",
                text: `Site (${siteId}) updated successfully`,
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || error.message,
            });
        }

        action(false);
    }, [circle, siteId, list]);

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

                <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: 2 }}
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