
import React, { useMemo, useState, useEffect } from 'react';
import {
    Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
    IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
    TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
    Snackbar, Alert, Menu, ListItemIcon, ListItemText, CircularProgress, Badge, Popover, List, ListItem,
    ToggleButton, ToggleButtonGroup
} from '@mui/material';

import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import CalendarViewWeekRoundedIcon from '@mui/icons-material/CalendarViewWeekRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import ViewKanbanRoundedIcon from '@mui/icons-material/ViewKanbanRounded';
import TableChartRoundedIcon from '@mui/icons-material/TableChartRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import NewReleasesRoundedIcon from '@mui/icons-material/NewReleasesRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';

import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getDecreyptedData } from "../../../utils/localstorage";

/* ============================== CONSTANTS ============================== */

const API_BASE_URL = 'https://commtoolapi.mcpspmis.com/task_tracking/tasks/';

const ADMIN_USERS = ["abhinav@ust.com", "mohit@ust.com"];

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'In Review', 'Testing', 'Completed', 'Delayed', 'On Hold'];

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

const REASON_OPTIONS = ['None', 'Resource Constraint', 'Dependency Delay', 'Scope Change', 'Client Delay', 'Technical Issue', 'Requirement Change', 'Other'];

const STATUS_COLORS = {
    'Not Started': { main: '#64748B', bg: '#F1F5F9' },
    'In Progress': { main: '#2563EB', bg: '#EAF1FE' },
    'In Review': { main: '#D97706', bg: '#FEF3E2' },
    'Testing': { main: '#7C3AED', bg: '#F3ECFE' },
    'Completed': { main: '#0E9F6E', bg: '#E7F9F1' },
    'Delayed': { main: '#DC2626', bg: '#FDECEC' },
    'On Hold': { main: '#475569', bg: '#EEF1F4' },
};

const PRIORITY_COLORS = {
    High: { main: '#DC2626', bg: '#FDECEC' },
    Medium: { main: '#D97706', bg: '#FEF3E2' },
    Low: { main: '#0E9F6E', bg: '#E7F9F1' },
};

const KPI_ICONS = {
    'Total Tasks': AssignmentRoundedIcon,
    'Not Started': HourglassEmptyRoundedIcon,
    'In Progress': TrendingUpRoundedIcon,
    'In Review': RateReviewRoundedIcon,
    'Testing': ScienceRoundedIcon,
    'Completed': CheckCircleRoundedIcon,
    'Delayed': ReportProblemRoundedIcon,
    'Completion %': DonutLargeRoundedIcon,
};

const REASON_PALETTE = ['#0E7C7B', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#0EA5E9', '#64748B', '#B45309'];

const PRIMARY = '#0E7C7B';
const PRIMARY_DARK = '#0A5D5C';

/* ============================== HELPERS ============================== */

const getCurrentUsername = () => {
    const username = getDecreyptedData('userID') || getDecreyptedData('username') || 'anonymous';
    return username;
};

const isUserAdmin = () => ADMIN_USERS.includes(getCurrentUsername());

const getEmptyForm = () => ({
    date: dayjs().format('YYYY-MM-DD'),
    username: getCurrentUsername(),
    assigned_by: '',
    project_name: '',
    start_date: '',
    expacted_date: '',
    completed_date: '',
    status: 'Not Started',
    priority: 'Medium',
    reason_for_delay: 'None',
    remarks: '',
    is_restarted: false,
    restarted_from_id: null,
});

const getRestartForm = (completedTask) => ({
    date: dayjs().format('YYYY-MM-DD'),
    username: completedTask.username || getCurrentUsername(),
    assigned_by: completedTask.assigned_by || '',
    project_name: completedTask.project_name || '',
    start_date: dayjs().format('YYYY-MM-DD'),
    expacted_date: '',
    completed_date: '',
    status: 'Not Started',
    priority: completedTask.priority || 'Medium',
    reason_for_delay: 'None',
    remarks: `RESTARTED: New changes required. Previous completion: ${dayjs(completedTask.completed_date).format('DD MMM YYYY')}`,
    is_restarted: true,
    restarted_from_id: completedTask.id,
});

function getTotalTime(task) {
    if (!task.start_date) return '—';

    const start = dayjs(task.start_date).startOf('day');
    const end = task.completed_date ? dayjs(task.completed_date).startOf('day') : dayjs().startOf('day');

    if (end.isBefore(start, 'day')) return '—';

    let workingDays = 0;
    let currentDate = start;

    while (currentDate.isBefore(end, 'day') || currentDate.isSame(end, 'day')) {
        const dayOfWeek = currentDate.day();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
        currentDate = currentDate.add(1, 'day');
    }

    if (task.completed_date) {
        return `${workingDays} day${workingDays === 1 ? '' : 's'}`;
    }
    return `${workingDays} day${workingDays === 1 ? '' : 's'} (active)`;
}

function filterTasks(tasks, { dateFilterType, singleDate, fromDate, toDate, status, priority, search, username }) {
    return tasks.filter((t) => {
        if (dateFilterType === 'single' && singleDate && t.date !== singleDate) return false;

        if (dateFilterType === 'range' && fromDate && toDate) {
            if (!t.start_date) return false;
            const taskDate = dayjs(t.start_date);
            const from = dayjs(fromDate);
            const to = dayjs(toDate);
            if (taskDate.isBefore(from, 'day') || taskDate.isAfter(to, 'day')) return false;
        }

        if (status && status !== 'All') {
            if (status === 'Delayed') {
                const isOverdue = t.expacted_date && t.status !== 'Completed' && dayjs(t.expacted_date).isBefore(dayjs(), 'day');
                if (t.status !== 'Delayed' && !isOverdue) return false;
            } else if (t.status !== status) {
                return false;
            }
        }

        if (priority && priority !== 'All' && t.priority !== priority) return false;
        if (username && username !== 'All' && t.username !== username) return false;

        if (search) {
            const q = search.trim().toLowerCase();
            const taskUsername = (t.username || '').toLowerCase();
            const projectName = (t.project_name || '').toLowerCase();
            if (!taskUsername.includes(q) && !projectName.includes(q)) return false;
        }

        return true;
    });
}

function computeKpis(tasks) {
    const total = tasks.length;
    const counts = {};
    let overdueCount = 0;

    tasks.forEach((t) => {
        counts[t.status] = (counts[t.status] || 0) + 1;
        const isOverdue = t.expacted_date && t.status !== 'Completed' && dayjs(t.expacted_date).isBefore(dayjs(), 'day');
        if (isOverdue || t.status === 'Delayed') {
            overdueCount++;
        }
    });

    const completed = counts['Completed'] || 0;
    const completionPct = total ? Math.round((completed / total) * 100) : 0;
    return { total, counts, completed, completionPct, overdueCount };
}

function computeStatusBreakdown(tasks) {
    return STATUS_OPTIONS.map((s) => ({
        name: s,
        value: tasks.filter((t) => t.status === s).length
    })).filter((d) => d.value > 0);
}

function computeReasonBreakdown(tasks) {
    const counts = {};
    tasks.forEach((t) => {
        if (t.reason_for_delay && t.reason_for_delay !== 'None') {
            counts[t.reason_for_delay] = (counts[t.reason_for_delay] || 0) + 1;
        }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function computePriorityBreakdown(tasks) {
    return PRIORITY_OPTIONS.map((p) => ({
        name: p,
        value: tasks.filter((t) => t.priority === p).length
    }));
}

const fmt = (d) => d ? dayjs(d).format('DD MMM YYYY') : '—';

function getShortRemarks(remarks, wordLimit = 4) {
    if (!remarks) return '—';
    const words = remarks.trim().split(/\s+/);
    if (words.length <= wordLimit) return remarks;
    return `${words.slice(0, wordLimit).join(' ')}...`;
}

/* ========================= API FUNCTIONS ========================= */

async function fetchTasks() {
    try {
        const username = getCurrentUsername();
        const response = await fetch(`${API_BASE_URL}?username=${encodeURIComponent(username)}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        return Array.isArray(data) ? data : data.results || [];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

async function createTask(taskData) {
    try {
        const username = getCurrentUsername();
        const payload = {
            date: taskData.date,
            username: taskData.username || username,
            assigned_by: taskData.assigned_by,
            project_name: taskData.project_name,
            start_date: taskData.start_date,
            expacted_date: taskData.expacted_date || null,
            completed_date: taskData.completed_date || null,
            status: taskData.status,
            priority: taskData.priority,
            reason_for_delay: taskData.reason_for_delay,
            remarks: taskData.remarks,
            is_restarted: taskData.is_restarted || false,
            restarted_from_id: taskData.restarted_from_id || null,
        };

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
}

async function updateTask(taskId, taskData) {
    try {
        const username = getCurrentUsername();
        const payload = {
            date: taskData.date,
            username: taskData.username || username,
            assigned_by: taskData.assigned_by,
            project_name: taskData.project_name,
            start_date: taskData.start_date,
            expacted_date: taskData.expacted_date || null,
            completed_date: taskData.completed_date || null,
            status: taskData.status,
            priority: taskData.priority,
            reason_for_delay: taskData.reason_for_delay,
            remarks: taskData.remarks,
        };

        const response = await fetch(`${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
}

async function deleteTask(taskId) {
    try {
        const username = getCurrentUsername();
        const response = await fetch(`${API_BASE_URL}${taskId}/?username=${encodeURIComponent(username)}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

/* ========================= EXCEL EXPORT ========================= */

async function exportTasksToExcel(tasks, filename) {
    const STATUS_FILL = {
        'Not Started': { fg: 'FFD9D9D9', font: 'FF595959' },
        'In Progress': { fg: 'FFBDD7EE', font: 'FF1F4E78' },
        'In Review': { fg: 'FFFFE9B3', font: 'FF7F6000' },
        'Testing': { fg: 'FFE3D2FB', font: 'FF5A2D9C' },
        'Completed': { fg: 'FFC6EFCE', font: 'FF006100' },
        'Delayed': { fg: 'FFFFC7CE', font: 'FF9C0006' },
        'On Hold': { fg: 'FFE4DFEC', font: 'FF5F497A' },
    };

    const PRIORITY_FILL = {
        High: { fg: 'FFFFC7CE', font: 'FF9C0006' },
        Medium: { fg: 'FFFFE9B3', font: 'FF7F6000' },
        Low: { fg: 'FFC6EFCE', font: 'FF006100' },
    };

    const NAVY = 'FF1F4E78';
    const WHITE = 'FFFFFFFF';

    const border = {
        top: { style: 'thin', color: { argb: 'FFB7B7B7' } },
        left: { style: 'thin', color: { argb: 'FFB7B7B7' } },
        bottom: { style: 'thin', color: { argb: 'FFB7B7B7' } },
        right: { style: 'thin', color: { argb: 'FFB7B7B7' } },
    };

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Task Tracker';
    wb.created = new Date();

    const summary = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
    summary.columns = [{ width: 4 }, { width: 26 }, { width: 16 }, { width: 4 }, { width: 26 }, { width: 16 }];

    summary.mergeCells('B2:F2');
    summary.getCell('B2').value = 'Task Tracker — Summary Report';
    summary.getCell('B2').font = { name: 'Arial', size: 18, bold: true, color: { argb: NAVY } };

    summary.mergeCells('B3:F3');
    summary.getCell('B3').value = `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;
    summary.getCell('B3').font = { name: 'Arial', size: 10, italic: true, color: { argb: '5B6B75' } };

    const kpis = computeKpis(tasks);
    let r = 5;

    summary.getCell(`B${r}`).value = 'Key Metrics';
    summary.getCell(`B${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
    r += 1;

    [['Total Tasks', kpis.total], ['Completed', kpis.completed], ['Completion %', `${kpis.completionPct}%`]].forEach(
        ([label, value]) => {
            summary.getCell(`B${r}`).value = label;
            summary.getCell(`B${r}`).font = { name: 'Arial', size: 10 };
            summary.getCell(`C${r}`).value = value;
            summary.getCell(`C${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
            r += 1;
        }
    );

    let statusRow = 5;
    summary.getCell(`E${statusRow}`).value = 'Status Breakdown';
    summary.getCell(`E${statusRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
    statusRow += 1;

    ['Status', 'Count'].forEach((h, i) => {
        const cell = summary.getCell(statusRow, 5 + i);
        cell.value = h;
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
        cell.border = border;
    });

    statusRow += 1;

    computeStatusBreakdown(tasks).forEach(({ name, value }) => {
        const fill = STATUS_FILL[name] || { fg: 'FFEFEFEF', font: 'FF333333' };
        const nameCell = summary.getCell(`E${statusRow}`);
        nameCell.value = name;
        nameCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
        nameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
        nameCell.border = border;

        const countCell = summary.getCell(`F${statusRow}`);
        countCell.value = value;
        countCell.alignment = { horizontal: 'center' };
        countCell.border = border;
        statusRow += 1;
    });

    const ws = wb.addWorksheet('Task Data', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });

    const headers = ['SR No', 'Date', 'User', 'Assigned By', 'Project', 'Start Date', 'Expected Date', 'Completed Date', 'Status', 'Priority', 'Reason for Delay', 'Remarks'];
    ws.columns = [
        { width: 7 }, { width: 12 }, { width: 18 }, { width: 18 }, { width: 28 }, { width: 14 },
        { width: 14 }, { width: 14 }, { width: 14 }, { width: 12 }, { width: 20 }, { width: 30 }
    ];

    const headerRow = ws.getRow(1);
    headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h;
        cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: WHITE } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = border;
    });
    headerRow.height = 24;

    const STATUS_COL = 9;
    const PRIORITY_COL = 10;

    tasks.forEach((t, idx) => {
        const row = ws.getRow(idx + 2);
        const values = [idx + 1, t.date ? dayjs(t.date).format('DD-MMM-YYYY') : '', t.username || '', t.assigned_by || '', t.project_name || '',
            t.start_date ? dayjs(t.start_date).format('DD-MMM-YYYY') : '', t.expacted_date ? dayjs(t.expacted_date).format('DD-MMM-YYYY') : '',
            t.completed_date ? dayjs(t.completed_date).format('DD-MMM-YYYY') : '', t.status || '', t.priority || '', t.reason_for_delay || '', t.remarks || ''];

        values.forEach((v, i) => {
            const cell = row.getCell(i + 1);
            cell.value = v;
            cell.font = { name: 'Arial', size: 10 };
            cell.border = border;
            cell.alignment = { vertical: 'middle', wrapText: i === 11, horizontal: [0, 8, 9].includes(i) ? 'center' : 'left' };
        });

        if (idx % 2 === 1) {
            for (let c = 1; c <= headers.length; c++) {
                const cell = row.getCell(c);
                if (!cell.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8F9' } };
            }
        }

        const statusFill = STATUS_FILL[t.status] || { fg: 'FFEFEFEF', font: 'FF333333' };
        const statusCell = row.getCell(STATUS_COL);
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusFill.fg } };
        statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: statusFill.font } };
        statusCell.alignment = { horizontal: 'center' };

        const priorityFill = PRIORITY_FILL[t.priority] || { fg: 'FFEFEFEF', font: 'FF333333' };
        const priorityCell = row.getCell(PRIORITY_COL);
        priorityCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: priorityFill.fg } };
        priorityCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: priorityFill.font } };
        priorityCell.alignment = { horizontal: 'center' };
    });

    ws.autoFilter = { from: 'A1', to: `L${tasks.length + 1}` };
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

/* ============================== SUBCOMPONENTS ============================== */

function KpiCard({ label, value, color }) {
    const Icon = KPI_ICONS[label] || AssignmentRoundedIcon;
    return (
        <Paper elevation={0} sx={{
            p: 2.25, height: '100%', borderRadius: 3, border: '1px solid rgba(226, 232, 240, 0.8)',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)',
            transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 24px rgba(14, 124, 123, 0.1)' },
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}>{label}</Typography>
                <Box sx={{ width: 36, height: 36, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `${color}15`, boxShadow: `inset 0 0 0 1px ${color}30` }}>
                    <Icon sx={{ fontSize: 18, color }} />
                </Box>
            </Stack>
            <Typography variant="h4" sx={{ mt: 1.5, mb: 1, fontWeight: 800, color: '#0F172A' }}>{value}</Typography>
            <Box sx={{ height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}55)`, width: '100%' }} />
        </Paper>
    );
}

/* ========================== TASK FORM DIALOG ========================== */

function TaskFormDialog({ open, onClose, onSave, initialTask, currentUsername, isRestartMode }) {
    const [form, setForm] = useState(getEmptyForm());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (isRestartMode && initialTask) {
                setForm(getRestartForm(initialTask));
            } else if (initialTask) {
                setForm({
                    date: initialTask.date || dayjs().format('YYYY-MM-DD'),
                    username: initialTask.username || currentUsername,
                    assigned_by: initialTask.assigned_by || '',
                    project_name: initialTask.project_name || '',
                    start_date: initialTask.start_date || '',
                    expacted_date: initialTask.expacted_date || '',
                    completed_date: initialTask.completed_date || '',
                    status: initialTask.status || 'Not Started',
                    priority: initialTask.priority || 'Medium',
                    reason_for_delay: initialTask.reason_for_delay || 'None',
                    remarks: initialTask.remarks || '',
                });
            } else {
                setForm(getEmptyForm());
            }
            setErrors({});
        }
    }, [open, initialTask, currentUsername, isRestartMode]);

    const handleChange = (field) => (e) => {
        const val = e.target.value;
        setForm((f) => {
            const updated = { ...f, [field]: val };
            if (field === 'status' && val === 'Completed' && !updated.completed_date) {
                updated.completed_date = dayjs().format('YYYY-MM-DD');
            }
            return updated;
        });
    };

    const validate = () => {
        const e = {};
        if (!form.assigned_by.trim()) e.assigned_by = 'Required';
        if (!form.project_name.trim()) e.project_name = 'Required';
        if (!form.start_date) e.start_date = 'Required';
        if (!form.remarks.trim()) e.remarks = 'Remarks are compulsory';
        if (form.expacted_date && form.start_date && form.expacted_date < form.start_date) {
            e.expacted_date = 'Cannot be before start date';
        }
        if (form.completed_date && form.start_date && form.completed_date < form.start_date) {
            e.completed_date = 'Cannot be before start date';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            setLoading(true);
            try {
                await onSave(form);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } }}>
            <Box sx={{ height: 6, background: `linear-gradient(90deg, ${PRIMARY}, #12A39A, #1AC2A4)` }} />
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {isRestartMode ? 'Restart Project' : initialTask ? 'Edit Task' : 'Add New Task'}
                </Typography>
                <IconButton size="small" onClick={onClose} disabled={loading}><CloseRoundedIcon /></IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }}
                            inputProps={!initialTask ? { min: dayjs().format('YYYY-MM-DD'), max: dayjs().format('YYYY-MM-DD') } : {}}
                            value={form.date} onChange={handleChange('date')} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Username" fullWidth size="small" value={form.username} disabled
                            helperText="Auto from login" FormHelperTextProps={{ sx: { fontSize: '0.7rem' } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Assigned By" fullWidth size="small" value={form.assigned_by}
                            onChange={handleChange('assigned_by')} error={!!errors.assigned_by}
                            helperText={errors.assigned_by} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Project Name" fullWidth size="small" value={form.project_name}
                            onChange={handleChange('project_name')} error={!!errors.project_name}
                            helperText={errors.project_name} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Project Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }}
                            value={form.start_date} onChange={handleChange('start_date')}
                            error={!!errors.start_date} helperText={errors.start_date} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Expected Completion" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }}
                            value={form.expacted_date} onChange={handleChange('expacted_date')}
                            error={!!errors.expacted_date} helperText={errors.expacted_date} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Project Completed By" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }}
                            value={form.completed_date} onChange={handleChange('completed_date')}
                            error={!!errors.completed_date} helperText={errors.completed_date} disabled={loading} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Status" fullWidth size="small" value={form.status}
                            onChange={handleChange('status')} disabled={loading}>
                            {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Priority" fullWidth size="small" value={form.priority}
                            onChange={handleChange('priority')} disabled={loading}>
                            {PRIORITY_OPTIONS.map((p) => (
                                <MenuItem key={p} value={p}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[p].main }} />
                                        <span>{p}</span>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select label="Reason for Delay" fullWidth size="small" value={form.reason_for_delay}
                            onChange={handleChange('reason_for_delay')} disabled={loading}>
                            {REASON_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Remarks *" fullWidth multiline minRows={2} size="small" value={form.remarks}
                            onChange={handleChange('remarks')} error={!!errors.remarks}
                            helperText={errors.remarks || 'Remarks are compulsory'} disabled={loading} />
                    </Grid>
                </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2, px: 3 }}>
                <Button onClick={onClose} color="inherit" disabled={loading} sx={{ fontWeight: 600 }}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}
                    sx={{ bgcolor: PRIMARY, borderRadius: 2, px: 3, fontWeight: 700, '&:hover': { bgcolor: PRIMARY_DARK } }}>
                    {loading && <CircularProgress size={20} sx={{ mr: 1, color: '#fff' }} />}
                    {isRestartMode ? 'Start New Work' : initialTask ? 'Save changes' : 'Add task'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* ============================== MAIN COMPONENT ============================== */

export default function TaskTracker() {
    const currentUsername = useMemo(() => getCurrentUsername(), []);
    const isAdmin = useMemo(() => isUserAdmin(), []);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // Default to table view
    const [zoomLevel, setZoomLevel] = useState(100); // Zoom level percentage for full page +/-
    const [filters, setFilters] = useState({
        dateFilterType: 'single',
        singleDate: '',
        fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        toDate: dayjs().format('YYYY-MM-DD'),
        status: 'All',
        priority: 'All',
        search: '',
        username: 'All',
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isRestartMode, setIsRestartMode] = useState(false);
    const [snack, setSnack] = useState(null);
    const [exportAnchorEl, setExportAnchorEl] = useState(null);
    const [rangeDialogOpen, setRangeDialogOpen] = useState(false);
    const [customRange, setCustomRange] = useState({ from: '', to: '' });
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [infoAnchorEl, setInfoAnchorEl] = useState(null); // Info popover for Kanban feature tour

    // Drag and Drop state for Kanban
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    const today = dayjs().format('YYYY-MM-DD');
    const monthStart = dayjs().startOf('month').format('YYYY-MM-DD');

    useEffect(() => { loadTasks(); }, []);

    const loadTasks = async () => {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
    };

    const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
    const kpis = useMemo(() => computeKpis(filtered), [filtered]);
    const statusBreakdown = useMemo(() => computeStatusBreakdown(filtered), [filtered]);
    const reasonBreakdown = useMemo(() => computeReasonBreakdown(filtered), [filtered]);
    const priorityBreakdown = useMemo(() => computePriorityBreakdown(filtered), [filtered]);

    const overdueTasks = useMemo(() => {
        return tasks.filter((t) => {
            if (!t.expacted_date || t.status === 'Completed') return false;
            return dayjs(t.expacted_date).isBefore(dayjs(), 'day');
        });
    }, [tasks]);

    const uniqueUsernames = useMemo(() => {
        const names = [...new Set(tasks.map((t) => t.username).filter(Boolean))];
        return names.sort();
    }, [tasks]);

    const openAdd = () => {
        setEditingTask(null);
        setIsRestartMode(false);
        setDialogOpen(true);
    };

    const openEdit = (t) => {
        setEditingTask(t);
        setIsRestartMode(false);
        setDialogOpen(true);
    };

    const openRestart = (t) => {
        setEditingTask(t);
        setIsRestartMode(true);
        setDialogOpen(true);
    };

    const handleSave = async (form) => {
        try {
            if (editingTask && !isRestartMode) {
                await updateTask(editingTask.id, form);
                setTasks((prev) =>
                    prev.map((t) =>
                        t.id === editingTask.id ? { ...editingTask, ...form } : t
                    )
                );
                setSnack({ severity: 'success', message: 'Task updated.' });
            } else {
                await createTask(form);
                setSnack({
                    severity: 'success',
                    message: isRestartMode ? 'Project restarted successfully.' : 'Task added.'
                });
                await loadTasks();
            }
            setDialogOpen(false);
        } catch (error) {
            setSnack({ severity: 'error', message: `Error: ${error.message}` });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            setSnack({ severity: 'info', message: 'Task deleted.' });
        } catch (error) {
            setSnack({ severity: 'error', message: `Error: ${error.message}` });
        }
    };

    const handleMoveStatus = async (task, targetStatus) => {
        if (task.status === targetStatus) return;
        const updatedData = {
            ...task,
            status: targetStatus,
            completed_date: targetStatus === 'Completed' ? (task.completed_date || dayjs().format('YYYY-MM-DD')) : task.completed_date
        };

        try {
            await updateTask(task.id, updatedData);
            setTasks((prev) => prev.map((t) => t.id === task.id ? updatedData : t));
            setSnack({ severity: 'success', message: `Moved to ${targetStatus}` });
        } catch (error) {
            setSnack({ severity: 'error', message: `Failed to update status: ${error.message}` });
        }
    };

    // Drag and drop handlers
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('text/plain', taskId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        if (!draggedTaskId) return;
        const taskToMove = tasks.find((t) => t.id === draggedTaskId);
        if (taskToMove) {
            handleMoveStatus(taskToMove, targetStatus);
        }
        setDraggedTaskId(null);
    };

    // Zoom handlers for full-page scaling (simulating Ctrl +/- effect)
    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 130));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 75));
    const handleZoomReset = () => setZoomLevel(100);

    const doExport = async (data, label) => {
        if (!data.length) {
            setSnack({ severity: 'warning', message: `No tasks found for "${label}".` });
            return;
        }
        const filename = `Task_Tracker_${label.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        await exportTasksToExcel(data, filename);
        setSnack({ severity: 'success', message: `Exported ${data.length} task(s) — ${label}.` });
    };

    const tasksInRange = (from, to) =>
        tasks.filter((t) => {
            if (!t.start_date) return false;
            if (from && dayjs(t.start_date).isBefore(dayjs(from), 'day')) return false;
            if (to && dayjs(t.start_date).isAfter(dayjs(to), 'day')) return false;
            return true;
        });

    const handleExportPreset = async (type) => {
        setExportAnchorEl(null);
        const now = dayjs();

        if (type === 'current') {
            await doExport(filtered, 'Current View');
            return;
        }

        if (type === 'today') {
            await doExport(tasks.filter((t) => t.date === today), `Today (${dayjs(today).format('DD MMM YYYY')})`);
            return;
        }

        if (type === 'custom') {
            setCustomRange({ from: monthStart, to: today });
            setRangeDialogOpen(true);
            return;
        }

        let from, to, label;
        if (type === 'week') {
            from = now.startOf('week');
            to = now.endOf('week');
            label = `Weekly (${from.format('DD MMM')} - ${to.format('DD MMM YYYY')})`;
        } else if (type === 'month') {
            from = now.startOf('month');
            to = now.endOf('month');
            label = `Monthly (${now.format('MMM YYYY')})`;
        } else if (type === 'year') {
            from = now.startOf('year');
            to = now.endOf('year');
            label = `Yearly (${now.format('YYYY')})`;
        }

        await doExport(tasksInRange(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD')), label);
    };

    const handleCustomRangeExport = async () => {
        if (!customRange.from || !customRange.to) {
            setSnack({ severity: 'warning', message: 'Please select both From and To dates.' });
            return;
        }
        const data = tasksInRange(customRange.from, customRange.to);
        setRangeDialogOpen(false);
        await doExport(data, `${dayjs(customRange.from).format('DD MMM YYYY')} to ${dayjs(customRange.to).format('DD MMM YYYY')}`);
    };

    const kpiCards = [
        { label: 'Total Tasks', value: kpis.total, color: '#1B2A4A' },
        { label: 'Not Started', value: kpis.counts['Not Started'] || 0, color: STATUS_COLORS['Not Started'].main },
        { label: 'In Progress', value: kpis.counts['In Progress'] || 0, color: STATUS_COLORS['In Progress'].main },
        { label: 'In Review', value: kpis.counts['In Review'] || 0, color: STATUS_COLORS['In Review'].main },
        { label: 'Testing', value: kpis.counts['Testing'] || 0, color: STATUS_COLORS['Testing'].main },
        { label: 'Completed', value: kpis.counts['Completed'] || 0, color: STATUS_COLORS['Completed'].main },
        { label: 'Delayed', value: kpis.overdueCount, color: STATUS_COLORS['Delayed'].main },
        { label: 'Completion %', value: `${kpis.completionPct}%`, color: PRIMARY },
    ];

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress size={50} sx={{ color: PRIMARY }} />
                    <Typography color="text.secondary" fontWeight={600}>Loading Task Tracker...</Typography>
                </Stack>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#F8FAFC',
            py: { xs: 2, md: 3 },
            px: { xs: 1, md: 2 },
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
        }}>
            <Container maxWidth="xl" disableGutters>
                {/* NEW FEATURE ANNOUNCEMENT BANNER */}
                {/* <Paper elevation={0} sx={{
                    p: '10px 20px', mb: 2, borderRadius: 3, border: '1px solid #BAE6FD',
                    background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(3, 105, 161, 0.08)'
                }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Chip label="NEW" size="small" icon={<NewReleasesRoundedIcon />} sx={{ bgcolor: '#0284C7', color: '#fff', fontWeight: 800, '& .MuiChip-icon': { color: '#fff' } }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0369A1' }}>
                            Interactive Kanban Board & Drag-and-Drop are now live!.
                        </Typography>
                    </Stack>
                    <Tooltip title="About New Kanban Features">
                        <IconButton size="small" onClick={(e) => setInfoAnchorEl(e.currentTarget)} sx={{ color: '#0284C7' }}>
                            <InfoRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </Paper> */}

                {/* INFO POPOVER FOR KANBAN FEATURE TOUR */}
                {/* <Popover
                    open={Boolean(infoAnchorEl)}
                    anchorEl={infoAnchorEl}
                    onClose={() => setInfoAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { width: 320, p: 2.5, borderRadius: 3, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' } }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InfoRoundedIcon sx={{ color: PRIMARY }} /> Kanban Feature Guide
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '0.85rem' }}>
                        • **Drag and Drop**: Easily drag any task card across columns to update its progress status instantly.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ fontSize: '0.85rem' }}>
                        • **Hover Tooltips**: Hover over any task card to read complete remarks and description details without opening dialogs.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                        • **Zoom Controls**: Use the top-right zoom buttons to adjust full-page view scaling.
                    </Typography>
                </Popover> */}

                {/* HEADER */}
                <Paper elevation={0} sx={{
                    p: '16px 28px', mb: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.2)',
                    background: `linear-gradient(135deg, ${PRIMARY} 0%, #0F766E 50%, #0D9488 100%)`,
                    color: '#fff', boxShadow: '0 12px 32px rgba(14,124,123,0.22)'
                }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                <AssignmentRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Task Board</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TodayRoundedIcon sx={{ fontSize: 14 }} /> {dayjs(today).format('DD MMM YYYY')} • Team Workspace
                                </Typography>
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={2} alignItems="center">
                            {/* View Switcher Toggle */}
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(e, val) => val && setViewMode(val)}
                                size="small"
                                sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: '3px', '& .MuiToggleButton-root': { color: '#fff', border: 'none', borderRadius: '8px !important', px: 2, '&.Mui-selected': { bgcolor: '#fff', color: PRIMARY, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' } } }}
                            >
                                <ToggleButton value="table">
                                    <TableChartRoundedIcon sx={{ fontSize: 18, mr: 1 }} /> Table View
                                </ToggleButton>
                                <ToggleButton value="kanban">
                                    <ViewKanbanRoundedIcon sx={{ fontSize: 18, mr: 1 }} /> Kanban Board
                                </ToggleButton>
                            </ToggleButtonGroup>

                            {/* Full Page Zoom Controls (Ctrl + / - simulation) */}
                            {/* <Stack direction="row" spacing={0.5} sx={{ bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 2, p: '3px' }}>
                                <Tooltip title="Zoom Out (Full Page -)">
                                    <IconButton size="small" onClick={handleZoomOut} sx={{ color: '#fff' }}>
                                        <ZoomOutRoundedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Reset Zoom">
                                    <Button size="small" onClick={handleZoomReset} sx={{ color: '#fff', minWidth: 40, fontSize: '0.75rem', fontWeight: 700 }}>
                                        {zoomLevel}%
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Zoom In (Full Page +)">
                                    <IconButton size="small" onClick={handleZoomIn} sx={{ color: '#fff' }}>
                                        <ZoomInRoundedIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack> */}
                        </Stack>

                        <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                👤 {currentUsername} {isAdmin && <Chip label="ADMIN" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: 'rgba(255,255,255,0.3)', color: '#fff', fontWeight: 800, ml: 1 }} />}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* FILTERS TOOLBAR */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.02)' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" flexWrap="wrap" justifyContent="space-between">
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flex={1} minWidth={0} width={{ xs: '100%', md: 'auto' }}>
                            <TextField select label="Date Filter" size="small" value={filters.dateFilterType}
                                onChange={(e) => setFilters((f) => ({ ...f, dateFilterType: e.target.value, singleDate: e.target.value === 'single' ? '' : f.singleDate }))}
                                sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                <MenuItem value="single">All Dates</MenuItem>
                                <MenuItem value="range">Date Range</MenuItem>
                            </TextField>

                            {filters.dateFilterType === 'range' && (
                                <>
                                    <TextField label="From" type="date" size="small" InputLabelProps={{ shrink: true }} value={filters.fromDate}
                                        onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
                                        sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                    <TextField label="To" type="date" size="small" InputLabelProps={{ shrink: true }} value={filters.toDate}
                                        onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
                                        sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                                </>
                            )}

                            <TextField select label="Status" size="small" value={filters.status}
                                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                                sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                <MenuItem value="All">All Status</MenuItem>
                                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>

                            <TextField select label="Priority" size="small" value={filters.priority}
                                onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
                                sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                <MenuItem value="All">All Priorities</MenuItem>
                                {PRIORITY_OPTIONS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </TextField>
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" flex={1} minWidth={0} justifyContent="flex-end" width={{ xs: '100%', md: 'auto' }}>
                            {isAdmin && (
                                <TextField select label="User" size="small" value={filters.username}
                                    onChange={(e) => setFilters((f) => ({ ...f, username: e.target.value }))}
                                    sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                                    <MenuItem value="All">All users</MenuItem>
                                    {uniqueUsernames.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                                </TextField>
                            )}

                            {/* Notifications Popover */}
                            <Tooltip title="Overdue Notifications">
                                <IconButton
                                    onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                                    sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', borderRadius: 2, height: 40, width: 40 }}
                                >
                                    <Badge badgeContent={overdueTasks.length} color="error">
                                        <NotificationsRoundedIcon fontSize="small" color="action" />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Popover
                                open={Boolean(notifAnchorEl)}
                                anchorEl={notifAnchorEl}
                                onClose={() => setNotifAnchorEl(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{ sx: { width: 340, maxHeight: 420, borderRadius: 3, p: 1, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' } }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, p: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                                    Overdue Tasks ({overdueTasks.length})
                                </Typography>
                                {overdueTasks.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
                                        No overdue tasks! 🎉
                                    </Typography>
                                ) : (
                                    <List dense sx={{ overflow: 'auto', maxHeight: 320 }}>
                                        {overdueTasks.map((t) => (
                                            <ListItem key={t.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1E293B' }}>{t.project_name}</Typography>
                                                <Stack direction="row" justifyContent="space-between" width="100%" sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">User: {t.username}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 700 }}>
                                                        Due: {dayjs(t.expacted_date).format('DD MMM YYYY')}
                                                    </Typography>
                                                </Stack>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Popover>

                            <TextField label="Search task or user..." size="small" value={filters.search}
                                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                                sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />

                            <Tooltip title="Reset filters">
                                <IconButton onClick={() => setFilters({ dateFilterType: 'single', singleDate: '', fromDate: monthStart, toDate: today, status: 'All', priority: 'All', search: '', username: 'All' })}
                                    sx={{ border: '1px solid #E2E8F0', bgcolor: '#F8FAFC', borderRadius: 2, height: 40, width: 40 }}>
                                    <RefreshRoundedIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}
                                sx={{ bgcolor: PRIMARY, borderRadius: 2, px: 2.5, fontWeight: 700, whiteSpace: 'nowrap', '&:hover': { bgcolor: PRIMARY_DARK } }}>Add Task</Button>

                            <Button variant="outlined" startIcon={<FileDownloadRoundedIcon />} endIcon={<ArrowDropDownRoundedIcon />}
                                onClick={(e) => setExportAnchorEl(e.currentTarget)}
                                sx={{ borderColor: PRIMARY, color: PRIMARY, borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}>Export</Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* EXPORT MENU */}
                <Menu anchorEl={exportAnchorEl} open={!!exportAnchorEl} onClose={() => setExportAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { borderRadius: 2, mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } }}>
                    <MenuItem onClick={() => handleExportPreset('today')}>
                        <ListItemIcon><TodayRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="Today Only" secondary={dayjs(today).format('DD MMM YYYY')} />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleExportPreset('week')}>
                        <ListItemIcon><CalendarViewWeekRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="This Week" secondary="Monday – Sunday" />
                    </MenuItem>
                    <MenuItem onClick={() => handleExportPreset('month')}>
                        <ListItemIcon><CalendarMonthRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="This Month" />
                    </MenuItem>
                    <MenuItem onClick={() => handleExportPreset('year')}>
                        <ListItemIcon><EventRepeatRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="This Year" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleExportPreset('custom')}>
                        <ListItemIcon><DateRangeRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="Custom Range…" secondary="Pick any From – To dates" />
                    </MenuItem>
                    <MenuItem onClick={() => handleExportPreset('current')}>
                        <ListItemIcon><FileDownloadRoundedIcon fontSize="small" sx={{ color: PRIMARY }} /></ListItemIcon>
                        <ListItemText primary="Current Filtered View" />
                    </MenuItem>
                </Menu>

                {/* CUSTOM RANGE DIALOG */}
                <Dialog open={rangeDialogOpen} onClose={() => setRangeDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Custom Export Range</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ pt: 3 }}>
                        <Stack spacing={2}>
                            <TextField label="From" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={customRange.from}
                                onChange={(e) => setCustomRange((r) => ({ ...r, from: e.target.value }))} />
                            <TextField label="To" type="date" size="small" fullWidth InputLabelProps={{ shrink: true }} value={customRange.to}
                                onChange={(e) => setCustomRange((r) => ({ ...r, to: e.target.value }))} />
                        </Stack>
                    </DialogContent>
                    <Divider />
                    <DialogActions sx={{ p: 2, px: 3 }}>
                        <Button onClick={() => setRangeDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
                        <Button onClick={handleCustomRangeExport} variant="contained" sx={{ bgcolor: PRIMARY, borderRadius: 2, fontWeight: 700, '&:hover': { bgcolor: PRIMARY_DARK } }}>Download</Button>
                    </DialogActions>
                </Dialog>

                {/* DASHBOARD CONTENT CONTAINER */}
                <Stack spacing={3}>
                    {/* KPI CARDS */}
                    <Grid container spacing={2}>
                        {kpiCards.map((c) => (
                            <Grid item xs={12} sm={6} md={3} lg={1.5} key={c.label} sx={{ flexGrow: 1 }}>
                                <KpiCard {...c} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* ANALYTICS CHARTS */}
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
                        {/* STATUS */}
                        <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15,23,42,0.02)' }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800, color: '#1E293B' }}>Task status breakdown</Typography>
                            {statusBreakdown.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No tasks match the current filters.</Typography></Box>
                            ) : (
                                <Box sx={{ position: 'relative', height: 280 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                                                {statusBreakdown.map((entry) => (
                                                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name]?.main || '#94A3B8'} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip formatter={(value, name) => [`${value} task${value === 1 ? '' : 's'}`, name]} />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <Stack sx={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', alignItems: 'center' }}>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{kpis.total}</Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>total</Typography>
                                    </Stack>
                                </Box>
                            )}
                        </Paper>

                        {/* DELAY REASONS */}
                        <Paper elevation={0} sx={{ p: 2.5, flex: 1.2, minWidth: 0, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15,23,42,0.02)' }}>
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: 800, color: '#1E293B' }}>Delay reasons this period</Typography>
                            {reasonBreakdown.length === 0 ? (
                                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No delays recorded. 🎉</Typography></Box>
                            ) : (
                                <Box sx={{ height: 280 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reasonBreakdown} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={50} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                            <ChartTooltip formatter={(value) => [`${value} task${value === 1 ? '' : 's'}`, 'Count']} />
                                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                {reasonBreakdown.map((entry, i) => (
                                                    <Cell key={entry.name} fill={REASON_PALETTE[i % REASON_PALETTE.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </Paper>

                        {/* PRIORITY MIX */}
                        <Paper elevation={0} sx={{ p: 2.5, flex: 0.8, minWidth: 240, borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15,23,42,0.02)' }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#1E293B' }}>Priority mix</Typography>
                            <Stack spacing={2.5}>
                                {priorityBreakdown.map(({ name, value }) => {
                                    const pct = kpis.total ? Math.round((value / kpis.total) * 100) : 0;
                                    return (
                                        <Box key={name}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: PRIORITY_COLORS[name].main }} />
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>{name}</Typography>
                                                </Stack>
                                                <Typography variant="body2" fontWeight={700} color="text.secondary">{value}</Typography>
                                            </Stack>
                                            <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9', overflow: 'hidden' }}>
                                                <Box sx={{ height: '100%', width: `${pct}%`, bgcolor: PRIORITY_COLORS[name].main, borderRadius: 4, transition: 'width .3s ease' }} />
                                            </Box>
                                        </Box>
                                    );
                                })}
                                {kpis.total === 0 && <Typography variant="body2" color="text.secondary">No tasks match current filters.</Typography>}
                            </Stack>
                        </Paper>
                    </Stack>

                    {/* =========================================================
                        TABLE VIEW (DEFAULT MODERN CLEAN TABLE)
                       ========================================================= */}
                    {viewMode === 'table' && (
                        <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(15,23,42,0.02)' }}>
                            <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid #E2E8F0', bgcolor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E293B' }}>All Tasks ({filtered.length})</Typography>
                            </Box>
                            <TableContainer sx={{ maxHeight: 560 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {['SR', 'User', 'Assigned By', 'Project', 'Start', 'Expected', 'Completed', 'Status', 'Priority', 'Time Taken', 'Reason', 'Remarks', 'Actions'].map((h) => (
                                                <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
                                                    sx={{ fontWeight: 800, color: '#475569', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', bgcolor: '#F8FAFC' }}>
                                                    {h}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filtered.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={13}>
                                                    <Box sx={{ py: 6, textAlign: 'center' }}>
                                                        <Typography color="text.secondary">No tasks found. Click "Add Task" to create one.</Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {filtered.map((t, idx) => {
                                            const statusColors = STATUS_COLORS[t.status] || { main: '#94A3B8', bg: '#F1F5F9' };
                                            const priorityColors = PRIORITY_COLORS[t.priority] || { main: '#94A3B8', bg: '#F1F5F9' };
                                            const isCompleted = t.status === 'Completed';
                                            const isRestarted = t.is_restarted || false;
                                            const isOverdue = t.expacted_date && !isCompleted && dayjs(t.expacted_date).isBefore(dayjs(), 'day');
                                            const isTodayAdded = t.date === dayjs().format('YYYY-MM-DD');

                                            return (
                                                <TableRow key={t.id} hover sx={{
                                                    bgcolor: isOverdue ? '#FDECEC' : isTodayAdded ? '#E0F2FE' : isRestarted ? '#FEF3E2' : idx % 2 ? '#FAFBFC' : 'transparent',
                                                    borderLeft: isOverdue ? '4px solid #DC2626' : isTodayAdded ? '4px solid #2563EB' : isRestarted ? '4px solid #F59E0B' : 'none'
                                                }}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{t.username || '—'}</TableCell>
                                                    <TableCell>{t.assigned_by || '—'}</TableCell>
                                                    <TableCell sx={{ maxWidth: 240 }}>
                                                        <Stack spacing={0.5}>
                                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                {t.project_name} {isTodayAdded && <Chip label="New Today" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#BAE6FD', color: '#0369A1', fontWeight: 700, ml: 1 }} />}
                                                            </Typography>
                                                            {isRestarted && (
                                                                <Chip label="Restarted" size="small" sx={{ width: 'fit-content', bgcolor: '#FEF3E2', color: '#B45309', fontWeight: 700 }} />
                                                            )}
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>{fmt(t.start_date)}</TableCell>
                                                    <TableCell>
                                                        <span style={{ color: isOverdue ? '#DC2626' : 'inherit', fontWeight: isOverdue ? 700 : 400 }}>
                                                            {fmt(t.expacted_date)} {isOverdue && '(Overdue)'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{fmt(t.completed_date)}</TableCell>
                                                    <TableCell>
                                                        <Chip label={t.status} size="small" sx={{ bgcolor: statusColors.bg, color: statusColors.main, fontWeight: 700 }} />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={t.priority} size="small" sx={{ bgcolor: priorityColors.bg, color: priorityColors.main, fontWeight: 700 }} />
                                                    </TableCell>
                                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{getTotalTime(t)}</TableCell>
                                                    <TableCell>
                                                        {t.reason_for_delay && t.reason_for_delay !== 'None' ? (
                                                            <Chip label={t.reason_for_delay} size="small" variant="outlined" />
                                                        ) : '—'}
                                                    </TableCell>
                                                    <TableCell sx={{ maxWidth: 180, width: 180 }}>
                                                        {t.remarks ? (
                                                            <Tooltip title={t.remarks} arrow placement="top">
                                                                <Typography variant="body2" color="text.secondary" noWrap
                                                                    sx={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                                                                    {getShortRemarks(t.remarks, 4)}
                                                                </Typography>
                                                            </Tooltip>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">—</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} justifyContent="center">
                                                            <Tooltip title={isCompleted ? 'Cannot edit completed tasks' : 'Edit task'}>
                                                                <span>
                                                                    <IconButton size="small" onClick={() => openEdit(t)} disabled={isCompleted}>
                                                                        <EditRoundedIcon fontSize="small" />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>

                                                            {isCompleted && (
                                                                <Tooltip title="Restart project">
                                                                    <IconButton size="small" onClick={() => openRestart(t)} sx={{ color: '#F59E0B' }}>
                                                                        <RestartAltRoundedIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}

                                                            <Tooltip title={isCompleted ? 'Cannot delete completed tasks' : 'Delete task'}>
                                                                <span>
                                                                    <IconButton size="small" onClick={() => handleDelete(t.id)} disabled={isCompleted}>
                                                                        <DeleteRoundedIcon fontSize="small" color={isCompleted ? 'disabled' : 'error'} />
                                                                    </IconButton>
                                                                </span>
                                                            </Tooltip>
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* =========================================================
                        JIRA KANBAN BOARD VIEW (DRAG & DROP, FULL HOVER REMARKS)
                       ========================================================= */}
                    {viewMode === 'kanban' && (
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            overflowX: 'auto',
                            pb: 3,
                            pt: 1,
                            alignItems: 'flex-start',
                            '&::-webkit-scrollbar': { height: 10 },
                            '&::-webkit-scrollbar-track': { background: '#E2E8F0', borderRadius: 5 },
                            '&::-webkit-scrollbar-thumb': { background: '#94A3B8', borderRadius: 5 }
                        }}>
                            {STATUS_OPTIONS.map((status) => {
                                const columnTasks = filtered.filter((t) => {
                                    if (status === 'Delayed') {
                                        const isOverdue = t.expacted_date && t.status !== 'Completed' && dayjs(t.expacted_date).isBefore(dayjs(), 'day');
                                        return t.status === 'Delayed' || isOverdue;
                                    }
                                    return t.status === status;
                                });

                                const sColor = STATUS_COLORS[status] || { main: '#64748B', bg: '#F1F5F9' };

                                return (
                                    <Box
                                        key={status}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, status)}
                                        sx={{
                                            minWidth: 300,
                                            maxWidth: 320,
                                            flex: 1,
                                            bgcolor: '#F8FAFC',
                                            borderRadius: 3,
                                            border: '1px solid #E2E8F0',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            maxHeight: '75vh',
                                            boxShadow: '0 4px 12px rgba(15,23,42,0.03)',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {/* Column Header */}
                                        <Box sx={{
                                            p: 2,
                                            borderBottom: '1px solid #E2E8F0',
                                            bgcolor: '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderTop: `4px solid ${sColor.main}`
                                        }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>
                                                    {status}
                                                </Typography>
                                                <Chip
                                                    label={columnTasks.length}
                                                    size="small"
                                                    sx={{ height: 20, fontSize: '0.75rem', fontWeight: 800, bgcolor: sColor.bg, color: sColor.main }}
                                                />
                                            </Stack>
                                            <IconButton size="small" onClick={openAdd}>
                                                <AddRoundedIcon fontSize="small" />
                                            </IconButton>
                                        </Box>

                                        {/* Column Cards Container */}
                                        <Box sx={{
                                            p: 1.5,
                                            overflowY: 'auto',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            flex: 1,
                                            '&::-webkit-scrollbar': { width: 6 },
                                            '&::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: 3 }
                                        }}>
                                            {columnTasks.length === 0 ? (
                                                <Box sx={{ py: 6, textAlign: 'center' }}>
                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Drop tasks here or add new</Typography>
                                                </Box>
                                            ) : (
                                                columnTasks.map((t) => {
                                                    const isCompleted = t.status === 'Completed';
                                                    const isOverdue = t.expacted_date && !isCompleted && dayjs(t.expacted_date).isBefore(dayjs(), 'day');
                                                    const priorityColor = PRIORITY_COLORS[t.priority] || { main: '#64748B', bg: '#F1F5F9' };

                                                    return (
                                                        <Tooltip
                                                            key={t.id}
                                                            title={
                                                                <Box sx={{ p: 0.5 }}>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{t.project_name}</Typography>
                                                                    <Typography variant="body2"><b>Remarks:</b> {t.remarks || 'No remarks provided.'}</Typography>
                                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>Assigned by: {t.assigned_by}</Typography>
                                                                </Box>
                                                            }
                                                            arrow
                                                            placement="right"
                                                        >
                                                            <Paper
                                                                draggable
                                                                onDragStart={(e) => handleDragStart(e, t.id)}
                                                                elevation={0}
                                                                sx={{
                                                                    p: 2,
                                                                    borderRadius: 2.5,
                                                                    border: '1px solid #E2E8F0',
                                                                    bgcolor: '#FFFFFF',
                                                                    boxShadow: '0 2px 5px rgba(15,23,42,0.02)',
                                                                    cursor: 'grab',
                                                                    transition: 'all .2s ease',
                                                                    borderLeft: isOverdue ? '4px solid #DC2626' : `4px solid ${sColor.main}`,
                                                                    '&:hover': { boxShadow: '0 8px 20px rgba(15,23,42,0.08)', transform: 'translateY(-2px)' },
                                                                    '&:active': { cursor: 'grabbing' }
                                                                }}
                                                            >
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                                        <DragIndicatorRoundedIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                                                                        <Chip label={`#${t.id}`} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#F1F5F9', color: '#475569' }} />
                                                                    </Stack>
                                                                    <Chip label={t.priority} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: priorityColor.bg, color: priorityColor.main }} />
                                                                </Stack>

                                                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5, lineHeight: 1.3 }}>
                                                                    {t.project_name}
                                                                </Typography>

                                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                                        👤 {t.username}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                                                                        By: {t.assigned_by || '—'}
                                                                    </Typography>
                                                                </Stack>

                                                                {t.expacted_date && (
                                                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                                                                        <Typography variant="caption" sx={{ color: isOverdue ? '#DC2626' : 'text.secondary', fontWeight: isOverdue ? 700 : 500 }}>
                                                                            Due: {dayjs(t.expacted_date).format('DD MMM YYYY')} {isOverdue && '(Overdue)'}
                                                                        </Typography>
                                                                    </Stack>
                                                                )}

                                                                {t.remarks && (
                                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', mb: 2, bgcolor: '#F8FAFC', p: 1, borderRadius: 1.5, border: '1px solid #F1F5F9' }}>
                                                                        💬 {getShortRemarks(t.remarks, 6)} (Hover for full remarks)
                                                                    </Typography>
                                                                )}

                                                                <Divider sx={{ mb: 1 }} />
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Stack direction="row" spacing={0.5}>
                                                                        <Tooltip title="Move Left">
                                                                            <span>
                                                                                <IconButton size="small" onClick={() => {
                                                                                    const idx = STATUS_OPTIONS.indexOf(t.status);
                                                                                    if (idx > 0) handleMoveStatus(t, STATUS_OPTIONS[idx - 1]);
                                                                                }} disabled={status === STATUS_OPTIONS[0]}>
                                                                                    <ChevronLeftRoundedIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                        <Tooltip title="Move Right">
                                                                            <span>
                                                                                <IconButton size="small" onClick={() => {
                                                                                    const idx = STATUS_OPTIONS.indexOf(t.status);
                                                                                    if (idx < STATUS_OPTIONS.length - 1) handleMoveStatus(t, STATUS_OPTIONS[idx + 1]);
                                                                                }} disabled={status === STATUS_OPTIONS[STATUS_OPTIONS.length - 1]}>
                                                                                    <ChevronRightRoundedIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    </Stack>

                                                                    <Stack direction="row" spacing={0.5}>
                                                                        <Tooltip title={isCompleted ? 'Locked' : 'Edit'}>
                                                                            <span>
                                                                                <IconButton size="small" onClick={() => openEdit(t)} disabled={isCompleted}>
                                                                                    <EditRoundedIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                        {isCompleted && (
                                                                            <Tooltip title="Restart">
                                                                                <IconButton size="small" onClick={() => openRestart(t)} sx={{ color: '#F59E0B' }}>
                                                                                    <RestartAltRoundedIcon fontSize="small" />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )}
                                                                        <Tooltip title={isCompleted ? 'Locked' : 'Delete'}>
                                                                            <span>
                                                                                <IconButton size="small" onClick={() => handleDelete(t.id)} disabled={isCompleted}>
                                                                                    <DeleteRoundedIcon fontSize="small" color={isCompleted ? 'disabled' : 'error'} />
                                                                                </IconButton>
                                                                            </span>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </Stack>
                                                            </Paper>
                                                        </Tooltip>
                                                    );
                                                })
                                            )}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Stack>
            </Container>

            {/* FORM DIALOG */}
            <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave}
                initialTask={editingTask} currentUsername={currentUsername} isRestartMode={isRestartMode} />

            {/* SNACKBAR */}
            <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                {snack && (
                    <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)} sx={{ fontWeight: 600 }}>
                        {snack.message}
                    </Alert>
                )}
            </Snackbar>
        </Box>
    );
}

