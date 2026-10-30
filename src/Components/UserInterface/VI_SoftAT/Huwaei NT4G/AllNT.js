import React, { useState, useEffect } from "react";
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Typography,
    Breadcrumbs,
    Link,
} from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useNavigate } from "react-router-dom";
import Slide from '@mui/material/Slide';
import OverAllCss from "../../../csss/OverAllCss";
import NT4G from "./NT4G";
import NT2G from "./NT2G";

/* ================================================================ */
/*  Theme — matched to the teal design                              */
/* ================================================================ */
const C = {
    teal: "#006e74",
    tealDark: "#00494d",
    headerBg: "#004d52",
};

const HEADER_GRADIENT = "linear-gradient(90deg, #004d52 0%, #006e74 55%, #4fa3a8 100%)";

/* ================================================================ */
/*  Tab Panel Component                                              */
/* ================================================================ */
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nt-tabpanel-${index}`}
            aria-labelledby={`nt-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 2 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AllNT = () => {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const classes = OverAllCss();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    useEffect(() => {
        document.title = "NT TOOLS | 2G / 4G";
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
                    <Link underline="hover" onClick={() => { navigate('/tools') }}>
                        Tools
                    </Link>
                    <Link underline="hover" onClick={() => { navigate('/tools/soft_at_tools') }}>
                        VI Soft-AT Tool
                    </Link>
                    <Typography color='text.primary'>NT Tools</Typography>
                </Breadcrumbs>
            </div>

            <Slide direction='left' in={true} timeout={1000}>
                <Box>
                    <Box className={classes.main_Box}>
                        <Box className={classes.Back_Box} sx={{ width: { md: '80%', xs: '100%' } }}>
                            {/* Header */}
                            <Box
                                sx={{
                                    background: HEADER_GRADIENT,
                                    borderRadius: '12px 12px 0 0',
                                    p: 2.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,78,82,0.2)',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: '10px',
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                    }}
                                >
                                    📡
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 900,
                                            letterSpacing: '-0.5px',
                                            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                        }}
                                    >
                                        NT Tools Management
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            opacity: 0.95,
                                            fontSize: '13px',
                                        }}
                                    >
                                        Process 2G, 4G, and Layered Network Data
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Tabs Navigation */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: '0 0 12px 0',
                                    borderBottom: '2px solid #e0e0e0',
                                    bgcolor: '#fafafa',
                                }}
                            >
                                <Tabs
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    aria-label="NT tools tabs"
                                    sx={{
                                        '& .MuiTabs-indicator': {
                                            backgroundColor: C.teal,
                                            height: 4,
                                            borderRadius: '2px 2px 0 0',
                                        },
                                        '& .MuiTab-root': {
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            textTransform: 'none',
                                            color: '#666',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: C.teal,
                                                bgcolor: 'rgba(0,110,116,0.05)',
                                            },
                                            '&.Mui-selected': {
                                                color: C.teal,
                                                fontWeight: 700,
                                            }
                                        }
                                    }}
                                >
                                    <Tab
                                        label="📊 NT 4G"
                                        id="nt-tab-0"
                                        aria-controls="nt-tabpanel-0"
                                        icon="4️⃣"
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="📱 NT 2G"
                                        id="nt-tab-1"
                                        aria-controls="nt-tabpanel-1"
                                        icon="2️⃣"
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="🔀 Layered"
                                        id="nt-tab-2"
                                        aria-controls="nt-tabpanel-2"
                                        disabled
                                    />
                                </Tabs>
                            </Paper>

                            {/* Tab Content */}
                            <Box sx={{ bgcolor: '#fff' }}>
                                <TabPanel value={activeTab} index={0}>
                                    <NT4G />
                                </TabPanel>

                                <TabPanel value={activeTab} index={1}>
                                    <NT2G />
                                </TabPanel>

                                <TabPanel value={activeTab} index={2}>
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography variant="h6" sx={{ color: C.tealDark, fontWeight: 700, mb: 1 }}>
                                            🔀 Layered NT Tool
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            This feature is coming soon. Stay tuned for updates!
                                        </Typography>
                                    </Box>
                                </TabPanel>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Slide>
        </>
    );
};

export default AllNT;