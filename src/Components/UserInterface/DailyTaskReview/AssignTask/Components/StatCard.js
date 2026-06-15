import React from "react";
import { Box, Paper, Typography, Skeleton, alpha } from "@mui/material";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, count, icon, color, bg, active, onClick, loading }) => (
    <Paper
        onClick={onClick}
        elevation={0}
        sx={{
            flex: 1,
            minWidth: 150,
            p: 2.2,
            borderRadius: "16px",
            cursor: "pointer",
            border: `1.5px solid ${active ? color : "#e8ecf0"}`,
            bgcolor: active ? alpha(color, 0.05) : "#fff",
            transition: "all .2s ease",
            "&:hover": {
                borderColor: color,
                bgcolor: alpha(color, 0.04),
                transform: "translateY(-2px)",
                boxShadow: `0 6px 24px ${alpha(color, 0.18)}`,
            },
            boxShadow: active
                ? `0 4px 20px ${alpha(color, 0.2)}`
                : "0 1px 4px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
        }}
    >
        {/* background circle decoration */}
        <Box
            sx={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: alpha(color, 0.06),
                pointerEvents: "none",
            }}
        />

        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            position="relative"
        >
            <Box>
                <Typography
                    fontSize={11.5}
                    fontWeight={500}
                    color="text.secondary"
                    mb={0.5}
                    letterSpacing=".02em"
                >
                    {label}
                </Typography>

                {loading ? (
                    <Skeleton width={40} height={32} />
                ) : (
                    <Typography
                        fontSize={28}
                        fontWeight={800}
                        color={active ? color : "#1a1a2e"}
                        lineHeight={1}
                    >
                        {count}
                    </Typography>
                )}
            </Box>

            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "12px",
                    bgcolor: active ? alpha(color, 0.15) : bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
            </Box>
        </Box>

        {/* active underline */}
        {active && (
            <Box
                sx={{
                    mt: 1.2,
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
                }}
            />
        )}
    </Paper>
);

export default StatCard;