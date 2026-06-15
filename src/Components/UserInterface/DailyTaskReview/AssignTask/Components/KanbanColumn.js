import React, { useState } from "react";
import { Box, Typography, Chip, alpha } from "@mui/material";

import KanbanCard from "./KanbanCard";

// ─── Kanban Column ────────────────────────────────────────────────────────────
const KanbanColumn = ({ col, cards, onEdit, onDelete, onStatusChange }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const cardId     = e.dataTransfer.getData("cardId");
        const fromStatus = e.dataTransfer.getData("fromStatus");
        if (fromStatus !== col.key) onStatusChange(cardId, col.key);
    };

    return (
        <Box
            sx={{
                flex: 1,
                minWidth: 220,
                maxWidth: 280,
                bgcolor: dragOver ? alpha(col.color, 0.06) : col.bg,
                borderRadius: "14px",
                border: `2px dashed ${dragOver ? col.color : "transparent"}`,
                transition: "all .15s",
                p: 2,
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
        >
            {/* ── column header ── */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box sx={{ color: col.color }}>{col.icon}</Box>
                <Typography fontSize={13} fontWeight={700} color={col.color}>
                    {col.label}
                </Typography>
                <Chip
                    label={cards.length}
                    size="small"
                    sx={{
                        height: 18,
                        fontSize: 10.5,
                        fontWeight: 700,
                        bgcolor: alpha(col.color, 0.12),
                        color: col.color,
                        minWidth: 24,
                    }}
                />
            </Box>

            {/* drop zone indicator */}
            {dragOver && (
                <Box sx={{
                    border: `2px dashed ${col.color}`,
                    borderRadius: "10px",
                    p: 2,
                    mb: 1.5,
                    textAlign: "center",
                    opacity: 0.6,
                }}>
                    <Typography fontSize={12} color={col.color}>Drop here</Typography>
                </Box>
            )}

            {/* empty state */}
            {cards.length === 0 && !dragOver && (
                <Box sx={{ textAlign: "center", py: 4, opacity: 0.4 }}>
                    <Typography fontSize={12} color="text.secondary">No tasks</Typography>
                </Box>
            )}

            {/* cards */}
            {cards.map(row => (
                <KanbanCard
                    key={row.id}
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </Box>
    );
};

export default KanbanColumn;