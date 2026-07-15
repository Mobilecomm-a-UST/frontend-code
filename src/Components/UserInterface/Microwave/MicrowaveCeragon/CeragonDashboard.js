import React, { useEffect, useState } from 'react'
import {
    Box, Breadcrumbs, Link, Typography, Slide
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { useLoadingDialog } from '../../../Hooks/LoadingDialog';
import Swal from "sweetalert2";
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';

/* ------------------------------------------------------------------ */
/*  API config                                                          */
/*  - DASHBOARD_API: GET -> table data                                  */
/*  - ACTION_API: GET -> download_url, DELETE -> delete table            */
/* ------------------------------------------------------------------ */
const DASHBOARD_API = "https://commtoolapi.mcpspmis.com/mwCeragon/ceragon-atp-dashboard/";
const ACTION_API = "https://commtoolapi.mcpspmis.com/mwCeragon/ceragon-atp/";

/* ------------------------------------------------------------------ */
/*  Columns — key -> display label, in the order given                  */
/* ------------------------------------------------------------------ */
const COLUMNS = [
    { key: "sl_no", label: "SL NO" },
    { key: "mw_plan_id", label: "MW Plan Id" },
    { key: "link_id", label: "Link ID (Site ID A - Site ID B and Site ID B - Site ID A)" },
    { key: "site_id", label: "Site ID" },
    { key: "site_name", label: "Site Name/System name/Unit Name" },
    { key: "server_rdp_ip", label: "Server/RDP -IP" },
    { key: "type_of_equipment", label: "Type of Equipment" },
    { key: "odu_idu", label: "ODU/IDU (New/Existing)" },
    { key: "mrmc_script_id", label: "MRMC Script ID/Bandw" },
    { key: "mrmc_profile", label: "MRMC Profile/Bandw" },
    { key: "link_configuration", label: "Link configuration ( 1+0 / 1+1 / 2+0/ XPIC/1G)" },
    { key: "idu_model", label: "IDU Model (Modular IDU-IP20N, IP-20G , High capacity packet radio IP20C/IP20S, IP-20GX, IP-20F)" },
    { key: "link_slot_number", label: "Link-Slot Number" },
    { key: "link_port_number", label: "Link-Port Number" },
    { key: "frequency_tx", label: "Frequency Tx" },
    { key: "frequency_rx", label: "Frequency Rx" },
    { key: "tx_power", label: "Tx Power  (dBm)" },
    { key: "rsl", label: "RSL(dBM) Main [<=3 dB Deviation permitted]" },
    { key: "modulation", label: "Modulation" },
    { key: "atpc", label: "ATPC (enabled/disable)" },
    { key: "acm_mode", label: "ACM Enabled/Modulation mode (Fixed/adaptive)" },
    { key: "odu_ip_address", label: "ODU IP Address" },
    { key: "idu_ip_address_remarks", label: "IDU IP Address/Remarks" },
    { key: "odu_ip_ethernet_slot_port_detail", label: "ODU IP Ethernet slot port detail  /Other remarks" },

    { key: "gnoc_link_id", label: "GNOC Link ID (Site ID A - Site ID B and Site ID B - Site ID A)" },
    { key: "gnoc_site_name", label: "GNOC Site Name/System name/Unit Name" },
    { key: "gnoc_equipment", label: "Type of Equipment/IDU Model (Modular IDU-IP20N, IP-20G, High capacity packet radio IP20C, IP-20GX)" },
    { key: "hop_visible", label: "HOP visible in NMS (Y/N) [NMS visibility is mandatory]" },
    { key: "software_version", label: "Software Version IDU" },
    { key: "gnoc_frequency_tx", label: "GNOC Frequency Tx" },
    { key: "gnoc_frequency_rx", label: "GNOC Frequency Rx" },
    { key: "gnoc_tx_power", label: "GNOC Tx Power (dBm)" },
    { key: "gnoc_rsl", label: "GNOC Current RSL (+/-3)" },
    { key: "gnoc_mrmc_script", label: "GNOC MRMC Script ID/Bandw" },
    { key: "gnoc_mrmc_profile", label: "GNOC MRMC Profile/Bandw" },
    { key: "gnoc_modulation", label: "GNOC Modulation" },
    { key: "gnoc_acm", label: "GNOC ACM Enabled/Modulation mode (Fixed/adaptive)" },
    { key: "gnoc_atpc", label: "GNOC ATPC (enabled/disable)" },
    { key: "gnoc_high_low_violation", label: "GNOC High Low Violation (Y/N) [No violation accepted]" },
    { key: "gnoc_qos", label: "GNOC QoS configured (Y/N) (As per planning guideline)" },
    { key: "gnoc_performance", label: "GNOC Performance error in last 24 hour end" },
    { key: "gnoc_datetime", label: "GNOC Date and time settings correct (Y/N)" },
    { key: "gnoc_mstp", label: "GNOC MSTP Disable define status" },
    { key: "gnoc_undervoltage_clear", label: "GNOC Undervoltage clear threshold =48" },
    { key: "gnoc_undervoltage_raise", label: "GNOC Undervoltage raise threshold =46" },
    { key: "gnoc_critical_alarm", label: "GNOC Critical alarm at New Node" },
    { key: "gnoc_ethernet_port_speed", label: "GNOC Ethernet Port speed status (Should be 1000)" },
    { key: "gnoc_final_remarks", label: "GNOC Final Remarks" },
    { key: "gnoc_final_status", label: "GNOC Final AT status (Accepted/Rejected)" },
    { key: "done_by", label: "Done By" },
    { key: "date", label: "Date" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                              */
/* ------------------------------------------------------------------ */
const displayValue = (val) => {
    if (
        val === null ||
        val === undefined ||
        val === "" ||
        val === "NaN" ||
        val === "<NA>" ||
        val === "nan" ||
        val === "NA" ||
        (typeof val === "number" && Number.isNaN(val))
    ) {
        return "";
    }
    return val;
};

const CeragonDashboard = () => {
    const navigate = useNavigate();
    const { loading, action } = useLoadingDialog();
    const [tableData, setTableData] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState(null);

    /* -------------------- Table data: GET dashboard API -------------------- */
    const fetchCeragonDashboard = async () => {
        action(true);
        try {
            const res = await axios.get(DASHBOARD_API);
            const body = res?.data;

            if (body?.status === false) {
                Swal.fire({ icon: "error", title: "Oops...", text: body?.message || "Unable to load data." });
                setTableData([]);
            } else {
                setTableData(body?.data || []);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Something went wrong while fetching data.",
            });
            setTableData([]);
        } finally {
            action(false);
        }
    };

    /* -------------------- Delete: DELETE on action API -------------------- */
    const handleDeleteTable = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the data!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.delete(ACTION_API);

                if (res?.data?.status === true || res?.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: res?.data?.message || "Data deleted successfully.",
                    });
                    fetchCeragonDashboard();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Unauthorized",
                        text: res?.data?.error || res?.data?.message || "Delete operation failed.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error?.response?.data?.error || "Something went wrong while deleting.",
                });
            }
        }
    };

    /* -------------------- Download: GET on action API, use download_url -------------------- */
    const handleDownloadFile = async () => {
        action(true);
        try {
            const res = await axios.get(ACTION_API);
            const url = res?.data?.download_url;

            if (!url) {
                Swal.fire({ icon: "info", title: "No file available", text: "Nothing to download yet." });
                return;
            }

            setDownloadUrl(url);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message || "Something went wrong while downloading.",
            });
        } finally {
            action(false);
        }
    };

    useEffect(() => {
        fetchCeragonDashboard();
        const title = window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase();
        document.title = title;
    }, []);

    return (
        <>
            <style>{"th{border:1px solid black;}"}</style>
            <Box m={1} ml={2}>
                <Breadcrumbs separator={<KeyboardArrowRightIcon fontSize="small" />}>
                    <Link underline="hover" onClick={() => navigate("/tools")}>Tools</Link>
                    <Link underline="hover" onClick={() => navigate("/tools/microwave_soft_at")}>Microwave Soft_At</Link>
                    <Typography color="text.primary">Microwave(CERAGON) Dashboard</Typography>
                </Breadcrumbs>
            </Box>

            <Slide direction="left" in='true' timeout={700} style={{ transformOrigin: '1 1 1' }}>
                <div style={{ margin: 20 }}>

                    {/* ************* CERAGON TABLE DATA ************** */}
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center' }}>
                        <Box style={{ fontSize: 22, fontWeight: 'bold' }}>
                            Microwave (CERAGON) Dashboard
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Tooltip title="Download Microwave(CERAGON) Dashboard">
                                <IconButton
                                    component="a"
                                    onClick={handleDownloadFile}
                                    download
                                >
                                    <DownloadIcon fontSize="large" color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Microwave(CERAGON) Table">
                                <IconButton
                                    component="a"
                                    onClick={handleDeleteTable}
                                >
                                    <DeleteIcon fontSize="large" color="error" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: 0 }}>
                        <TableContainer sx={{ maxHeight: 600, boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }} component={Paper}>
                            <table style={{ width: "100%", border: "1px solid black", borderCollapse: 'collapse', overflow: 'auto' }} >
                                <thead style={{ position: 'sticky', top: 0, zIndex: 1, height: '60px' }}>
                                    <tr style={{ fontSize: 15, backgroundColor: "#223354", color: "white", border: '1px solid white' }}>
                                        {COLUMNS.map((col, idx) => (
                                            <th
                                                key={col.key}
                                                style={{
                                                    padding: '5px 10px',
                                                    whiteSpace: 'nowrap',
                                                    backgroundColor: '#223354',
                                                    color: '#fff',
                                                    textAlign: 'center',
                                                    ...(idx === 0
                                                        ? { position: 'sticky', left: 0, top: 0, zIndex: 2 }
                                                        : {}),
                                                }}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableData?.map((it, index) => (
                                        <tr key={index}>
                                            {COLUMNS.map((col, idx) => (
                                                <th
                                                    key={col.key}
                                                    style={{
                                                        backgroundColor: idx === 0 ? '#CBCBCB' : '#FFF',
                                                        color: 'black',
                                                        whiteSpace: 'nowrap',
                                                        ...(idx === 0
                                                            ? { position: 'sticky', left: 0 }
                                                            : {}),
                                                    }}
                                                >
                                                    {displayValue(it[col.key])}
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
            {loading}
        </>
    );
}

export default CeragonDashboard;