import React from "react";
import {
    Box, Paper, Typography, Chip, Avatar, IconButton, Tooltip, alpha,
} from "@mui/material";
import EditOutlinedIcon         from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon        from "@mui/icons-material/DeleteOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { TEAL, TEAL_DARK, TEAL_LIGHT, TEAL_MID } from "../Constants";
import { isOverdue, priorityMeta, slotMeta, fmtDate } from "../Helpers";

// ─── Kanban Card ──────────────────────────────────────────────────────────────
const KanbanCard = ({ row, onEdit, onDelete, onStatusChange }) => {
    const pm     = priorityMeta(row.priority);
    const sm     = slotMeta(row.slot);
    const overdue = isOverdue(row.deadline, row.status);
    const owners = Array.isArray(row.owner)
        ? row.owner
        : row.owner ? [row.owner] : [];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: "12px",
                mb: 1.5,
                cursor: "grab",
                border: `1px solid ${overdue ? alpha("#c62828", 0.4) : "#e8ecf0"}`,
                bgcolor: overdue ? "#fff9f9" : "#fff",
                transition: "all .15s",
                "&:hover": {
                    borderColor: TEAL_MID,
                    boxShadow: `0 4px 12px ${alpha(TEAL, 0.1)}`,
                    transform: "translateY(-1px)",
                },
            }}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("cardId", row.id);
                e.dataTransfer.setData("fromStatus", row.status);
            }}
        >
            {/* ── top row: priority chip + actions ── */}
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                <Chip
                    label={row.priority || "—"}
                    size="small"
                    sx={{
                        bgcolor: pm.bg,
                        color: pm.color,
                        fontWeight: 700,
                        fontSize: 10,
                        height: 18,
                        border: `1px solid ${alpha(pm.color, 0.3)}`,
                    }}
                />
                <Box display="flex" gap={0.5}>
                    {overdue && (
                        <Tooltip title="Overdue!" arrow>
                            <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#e65100" }} />
                        </Tooltip>
                    )}
                    <Tooltip title="Edit" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onEdit(row)}
                            sx={{ p: 0.3, color: TEAL, "&:hover": { bgcolor: TEAL_LIGHT } }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                        <IconButton
                            size="small"
                            onClick={() => onDelete(row)}
                            sx={{ p: 0.3, color: "#c62828", "&:hover": { bgcolor: "#fdecea" } }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* ── task name ── */}
            <Typography
                fontSize={13}
                fontWeight={700}
                color="#1a1a2e"
                mb={0.8}
                lineHeight={1.4}
                sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {row.task}
            </Typography>

            {/* ── OEM + slot chips ── */}
            <Box display="flex" gap={0.5} flexWrap="wrap" mb={1}>
                {row.oem && (
                    <Chip
                        label={row.oem}
                        size="small"
                        sx={{ bgcolor: "#e3f2fd", color: "#0d47a1", fontSize: 10, height: 18 }}
                    />
                )}
                {sm && (
                    <Chip
                        label={sm.label}
                        size="small"
                        sx={{ bgcolor: alpha(sm.color, 0.1), color: sm.color, fontSize: 10, height: 18 }}
                    />
                )}
            </Box>

            {/* ── owner + deadline ── */}
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={0.6}>
                    {owners.length > 0 ? (
                        <>
                            <Avatar sx={{
                                width: 22, height: 22, fontSize: 9, fontWeight: 700,
                                bgcolor: alpha(TEAL, 0.18), color: TEAL_DARK,
                            }}>
                                {owners[0][0].toUpperCase()}
                            </Avatar>
                            <Typography fontSize={11} color="text.secondary" noWrap sx={{ maxWidth: 90 }}>
                                {owners[0]}{owners.length > 1 ? ` +${owners.length - 1}` : ""}
                            </Typography>
                        </>
                    ) : (
                        <Typography fontSize={11} color="text.disabled">No owner</Typography>
                    )}
                </Box>
                {row.deadline && (
                    <Typography
                        fontSize={10.5}
                        color={overdue ? "#c62828" : "text.disabled"}
                        fontWeight={overdue ? 700 : 400}
                    >
                        {fmtDate(row.deadline)}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default KanbanCard;