import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Breadcrumbs,
    Link,
    Paper,
    Typography,
} from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SettingsInputAntennaIcon from "@mui/icons-material/SettingsInputAntenna";
import { useNavigate } from "react-router-dom";
import { MemoZteAlarm } from "./ZteAlarm";
import { MemoHuawei } from "./Huawei";
import { MemoSamsung } from "./Samsung";
import { MemoNokia } from "./Nokia";
import { MemoEricsson } from "./Ericsson";


// Add the rest here as you build them, e.g.
// import { MemoHuaweiAlarm } from "./HuaweiAlarm";

const HEADER_COLOR = "#006e74";

// ── One tab per OEM ──
const OEM_TABS = [
    { key: "zte", label: "ZTE" },
    { key: "huawei", label: "Huawei" },
    { key: "ericsson", label: "Ericsson" },
    { key: "nokia", label: "Nokia" },
    { key: "samsung", label: "Samsung" },
];

/**
* Segmented toggle (same look as the Circle View / OEM View switch)
*/
const OemToggle = ({ active, onChange }) => (
    <Paper
        elevation={0}
        sx={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.5,
            p: 0.6,
            borderRadius: "12px",
            bgcolor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
        }}
    >
        {OEM_TABS.map((tab) => {
            const isActive = active === tab.key;
            return (
                <Button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    startIcon={<SettingsInputAntennaIcon sx={{ fontSize: 17 }} />}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 13,
                        px: 1.8,
                        borderRadius: "9px",
                        color: isActive ? "#fff" : "#555",
                        bgcolor: isActive ? HEADER_COLOR : "transparent",
                        "&:hover": {
                            bgcolor: isActive ? "#005a5f" : "rgba(0,110,116,0.08)",
                        },
                    }}
                >
                    {tab.label}
                </Button>
            );
        })}
    </Paper>
);

/**
* Placeholder for OEMs that are not built yet.
* Replace its usage below with the real component when it is ready.
*/
const OemComingSoon = ({ name }) => (
    <Box sx={{ px: 1.5, mt: 4 }}>
        <Paper
            elevation={0}
            sx={{
                maxWidth: 700,
                mx: "auto",
                p: 4,
                textAlign: "center",
                borderRadius: "12px",
                border: "1px dashed #9bbfc1",
                bgcolor: "#f1faf9",
            }}
        >
            <Typography sx={{ fontWeight: 700, fontSize: 20, color: HEADER_COLOR }}>
                {name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                This section is not built yet.
            </Typography>
        </Paper>
    </Box>
);

const AllAlarm = () => {
    const navigate = useNavigate();
    const [activeOEM, setActiveOEM] = useState("zte"); // zte | huawei | ericsson | nokia | samsung

    useEffect(() => {
        document.title = `${window.location.pathname
            .slice(1)
            .replaceAll("_", " ")
            .replaceAll("/", " | ")
            .toUpperCase()}`;
    }, []);

    return (
        <>
            <div style={{ margin: 5, marginLeft: 10 }}>
                <Breadcrumbs
                    aria-label="breadcrumb"
                    itemsBeforeCollapse={2}
                    maxItems={3}
                    separator={<KeyboardArrowRightIcon fontSize="small" />}
                >
                    <Link
                        underline="hover"
                        onClick={() => navigate("/tools")}
                        sx={{ cursor: "pointer" }}
                    >
                        Tools
                    </Link>
                    <Link
                        underline="hover"
                        onClick={() => navigate("/tools/dma")}
                        sx={{ cursor: "pointer" }}
                    >
                        DSA Tool
                    </Link>
                    <Typography color="text.primary">OEM WISE ALARM</Typography>
                </Breadcrumbs>
            </div>

            <Box sx={{ px: 1.5, mb: 1 }}>
                <OemToggle active={activeOEM} onChange={setActiveOEM} />
            </Box>

            {activeOEM === "zte" && (
                <Box>
                    <MemoZteAlarm />
                </Box>
            )}

            {activeOEM === "huawei" && <MemoHuawei />}
            {activeOEM === "ericsson" && <MemoEricsson />}
            {activeOEM === "nokia" && <MemoNokia />}
            {activeOEM === "samsung" && <MemoSamsung />}
        </>
    );
};

export default AllAlarm;