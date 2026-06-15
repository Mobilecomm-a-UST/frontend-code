import React, { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    TextField,
    MenuItem,
    Breadcrumbs,
    Link,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import { useLoadingDialog } from "../../../../Hooks/LoadingDialog"

import Monthwise from "./Monthwise";
import Weekwise from "./Weekwise";


// ── Constants ─────────────────────────────────────────────────────────────────
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i); // -2 to +3

const DASHBOARD_TABS = [
    { key: "monthwise", label: "Month Wise" },
    { key: "weekwise",  label: "Week Wise"  },
];

const TAB_COLORS = {
    monthwise: {
        active:   "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        tabColor: "#1e3c72",
    },
    weekwise: {
        active:   "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        tabColor: "#134e5e",
    },
};

// ── FTR Dashboard ─────────────────────────────────────────────────────────────
const VI_FTR_Dashboard = () => {
    const navigate = useNavigate();

    const [activeTab,      setActiveTab]      = useState("monthwise");
    const [selectedYear,   setSelectedYear]   = useState(currentYear);
    const [downloadUrl,    setDownloadUrl]     = useState(null);

    const handleDownload = () => {
        if (!downloadUrl) return;
        const link = document.createElement("a");
        link.href     = downloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Breadcrumb */}
            <div style={{ margin: 5, marginLeft: 10, marginTop: 10 }}>
                <Breadcrumbs
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link underline="hover" onClick={() => navigate("/tools/soft_at_tools")}>Tools</Link>
                    <Typography color="text.primary">FTR Dashboard</Typography>
                </Breadcrumbs>
            </div>

            <Box p={1}>
                {/* ── Top Bar ── */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    mb={1}
                >
                    <Typography variant="h5" fontWeight={700}>
                        FTR Dashboard
                    </Typography>

                    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                        {/* Year filter */}
                        {/* <TextField
                            select
                            size="small"
                            label="Year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            sx={{ minWidth: 100 }}
                        >
                            {YEARS.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </TextField> */}

                        {/* Download */}
                        {/* <IconButton
                            onClick={handleDownload}
                            title="Download Excel"
                            disabled={!downloadUrl}
                        >
                            <DownloadIcon color={downloadUrl ? "primary" : "disabled"} />
                        </IconButton> */}
                    </Box>
                </Box>

                {/* ── Tabs ── */}
                <Box sx={{ display: "flex", borderBottom: "2px solid #e0e0e0" }}>
                    {DASHBOARD_TABS.map((tab) => {
                        const isActive = activeTab === tab.key;
                        const tColor   = TAB_COLORS[tab.key];
                        return (
                            <Box
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                sx={{
                                    px: 3, py: 1,
                                    cursor:       "pointer",
                                    userSelect:   "none",
                                    fontWeight:   isActive ? 700 : 500,
                                    fontSize:     14,
                                    color:        isActive ? "#fff" : tColor.tabColor,
                                    background:   isActive ? tColor.active : "transparent",
                                    borderRadius: "6px 6px 0 0",
                                    borderBottom: isActive
                                        ? `3px solid ${tColor.tabColor}`
                                        : "3px solid transparent",
                                    transition: "all 0.2s",
                                    "&:hover": {
                                        background: isActive ? tColor.active : "#f0f4ff",
                                    },
                                }}
                            >
                                {tab.label}
                            </Box>
                        );
                    })}
                </Box>

                {/* ── Tab Content ── */}
                {activeTab === "monthwise" && (
                    <Monthwise
                        selectedYear={selectedYear}
                        onDownloadUrl={setDownloadUrl}
                    />
                )}
                {activeTab === "weekwise" && (
                    <Weekwise
                        selectedYear={selectedYear}
                        onDownloadUrl={setDownloadUrl}
                    />
                )}
            </Box>
        </>
    );
};

export default VI_FTR_Dashboard;