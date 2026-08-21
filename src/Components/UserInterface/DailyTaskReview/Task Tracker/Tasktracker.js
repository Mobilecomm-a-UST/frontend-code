/**
 * TaskTracker.jsx
 * ------------------------------------------------------------------
 * A single, self-contained "Task Tracker" page — drop this file into
 * your project (e.g. src/pages/TaskTracker.jsx) and route your
 * sidebar's "Task Tracker" item to it. 100% frontend, no backend:
 * data is kept in React state and persisted to localStorage.
 *
 * Install these dependencies if you don't already have them:
 *   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled \
 *               recharts exceljs file-saver dayjs uuid
 *
 * Usage:
 *   import TaskTracker from './pages/TaskTracker';
 *   <TaskTracker />
 * ------------------------------------------------------------------
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Container, Stack, Grid, Paper, Typography, TextField, MenuItem, Button,
  IconButton, Tooltip, Chip, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Dialog, DialogTitle, DialogContent, DialogActions, Divider,
  Snackbar, Alert,
} from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/* ============================== CONSTANTS ============================== */

const STATUS_OPTIONS = [
  'Not Started', 'In Progress', 'In Review', 'Testing', 'Completed', 'Delayed', 'On Hold',
];

const REASON_OPTIONS = [
  'None', 'Resource Constraint', 'Dependency Delay', 'Scope Change',
  'Client Delay', 'Technical Issue', 'Requirement Change', 'Other',
];

// Status color tokens — drive the chips, charts, and Excel export alike.
const STATUS_COLORS = {
  'Not Started': { main: '#64748B', bg: '#F1F5F9' },
  'In Progress': { main: '#2563EB', bg: '#EAF1FE' },
  'In Review':   { main: '#D97706', bg: '#FEF3E2' },
  'Testing':     { main: '#7C3AED', bg: '#F3ECFE' },
  'Completed':   { main: '#0E9F6E', bg: '#E7F9F1' },
  'Delayed':     { main: '#DC2626', bg: '#FDECEC' },
  'On Hold':     { main: '#475569', bg: '#EEF1F4' },
};

const REASON_PALETTE = ['#0E7C7B', '#D97706', '#DC2626', '#2563EB', '#7C3AED', '#0EA5E9', '#64748B', '#B45309'];

const PRIMARY = '#0E7C7B'; // matches the teal sidebar in your app

const STORAGE_KEY = 'task-tracker.tasks.v1';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  name: '', ustId: '', projectName: '', roleTask: '',
  startDate: '', expectedDate: '', completedDate: '',
  status: 'Not Started', reasonForDelay: 'None', remarks: '',
};

const sampleTasks = [
//   { id: 'seed-1', date: '2026-08-01', name: 'Rahul Sharma', ustId: 'UST0123', projectName: 'Client Portal Revamp', roleTask: 'Frontend Development', startDate: '2026-07-01', expectedDate: '2026-07-25', completedDate: '2026-07-24', status: 'Completed', reasonForDelay: 'None', remarks: 'Delivered ahead of schedule' },
//   { id: 'seed-2', date: '2026-08-01', name: 'Priya Nair', ustId: 'UST0456', projectName: 'Payment Gateway Integration', roleTask: 'Backend Development', startDate: '2026-07-10', expectedDate: '2026-08-25', completedDate: '', status: 'In Progress', reasonForDelay: 'None', remarks: 'On track, ~70% complete' },
//   { id: 'seed-3', date: '2026-08-01', name: 'Amit Verma', ustId: 'UST0789', projectName: 'Data Migration - Phase 2', roleTask: 'Database Engineering', startDate: '2026-07-05', expectedDate: '2026-08-15', completedDate: '', status: 'In Review', reasonForDelay: 'Dependency Delay', remarks: 'Awaiting client sign-off on schema' },
//   { id: 'seed-4', date: '2026-08-01', name: 'Sneha Iyer', ustId: 'UST0234', projectName: 'Mobile App QA Cycle', roleTask: 'QA / Testing', startDate: '2026-07-15', expectedDate: '2026-08-22', completedDate: '', status: 'Testing', reasonForDelay: 'None', remarks: 'Regression testing in progress' },
//   { id: 'seed-5', date: '2026-08-01', name: 'Karan Mehta', ustId: 'UST0567', projectName: 'Internal Reporting Dashboard', roleTask: 'Full Stack Development', startDate: '2026-06-20', expectedDate: '2026-07-20', completedDate: '', status: 'Delayed', reasonForDelay: 'Resource Constraint', remarks: 'Team member on leave for 5 days' },
//   { id: 'seed-6', date: '2026-08-01', name: 'Divya Rao', ustId: 'UST0890', projectName: 'Vendor API Onboarding', roleTask: 'Integration', startDate: '2026-08-20', expectedDate: '2026-09-10', completedDate: '', status: 'Not Started', reasonForDelay: 'None', remarks: 'Scheduled to begin next week' },
];

/* ============================== HELPERS ============================== */

function getTotalTime(task) {
  if (!task.startDate) return '—';
  const start = dayjs(task.startDate);
  if (task.completedDate) {
    const days = dayjs(task.completedDate).diff(start, 'day');
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  const days = dayjs().diff(start, 'day');
  return `${days} day${days === 1 ? '' : 's'} (ongoing)`;
}

function isOverdue(task) {
  if (!task.expectedDate || task.completedDate) return false;
  if (task.status === 'Completed') return false;
  return dayjs(task.expectedDate).isBefore(dayjs(), 'day');
}

function filterTasks(tasks, { from, to, status, search }) {
  return tasks.filter((t) => {
    if (from && t.startDate && dayjs(t.startDate).isBefore(dayjs(from), 'day')) return false;
    if (to && t.startDate && dayjs(t.startDate).isAfter(dayjs(to), 'day')) return false;
    if (status && status !== 'All' && t.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = `${t.name} ${t.projectName} ${t.roleTask} ${t.ustId}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function computeKpis(tasks) {
  const total = tasks.length;
  const counts = {};
  tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
  const completed = counts['Completed'] || 0;
  const overdue = tasks.filter(isOverdue).length;
  const completionPct = total ? Math.round((completed / total) * 100) : 0;
  return { total, counts, completed, overdue, completionPct };
}

function computeStatusBreakdown(tasks) {
  return STATUS_OPTIONS.map((s) => ({ name: s, value: tasks.filter((t) => t.status === s).length })).filter((d) => d.value > 0);
}

function computeReasonBreakdown(tasks) {
  const counts = {};
  tasks.forEach((t) => {
    if (t.reasonForDelay && t.reasonForDelay !== 'None') counts[t.reasonForDelay] = (counts[t.reasonForDelay] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function fmt(d) { return d ? dayjs(d).format('DD MMM YYYY') : '—'; }

/* ========================= COLORFUL EXCEL EXPORT ========================= */

async function exportTasksToExcel(tasks, filename) {
  const STATUS_FILL = {
    'Not Started': { fg: 'FFD9D9D9', font: 'FF595959' },
    'In Progress': { fg: 'FFBDD7EE', font: 'FF1F4E78' },
    'In Review':   { fg: 'FFFFE9B3', font: 'FF7F6000' },
    'Testing':     { fg: 'FFE3D2FB', font: 'FF5A2D9C' },
    'Completed':   { fg: 'FFC6EFCE', font: 'FF006100' },
    'Delayed':     { fg: 'FFFFC7CE', font: 'FF9C0006' },
    'On Hold':     { fg: 'FFE4DFEC', font: 'FF5F497A' },
  };
  const NAVY = 'FF1F4E78';
  const WHITE = 'FFFFFFFF';
  const border = {
    top: { style: 'thin', color: { argb: 'FFB7B7B7' } }, left: { style: 'thin', color: { argb: 'FFB7B7B7' } },
    bottom: { style: 'thin', color: { argb: 'FFB7B7B7' } }, right: { style: 'thin', color: { argb: 'FFB7B7B7' } },
  };

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Task Tracker';
  wb.created = new Date();

  // ---- Sheet 1: Dashboard summary ----
  const summary = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
  summary.columns = [{ width: 4 }, { width: 26 }, { width: 16 }, { width: 4 }, { width: 26 }, { width: 16 }];
  summary.mergeCells('B2:F2');
  summary.getCell('B2').value = 'Task Tracker — Summary Report';
  summary.getCell('B2').font = { name: 'Arial', size: 18, bold: true, color: { argb: NAVY } };
  summary.mergeCells('B3:F3');
  summary.getCell('B3').value = `Generated ${dayjs().format('DD MMM YYYY, HH:mm')} · ${tasks.length} tasks`;
  summary.getCell('B3').font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };

  const kpis = computeKpis(tasks);
  let r = 5;
  summary.getCell(`B${r}`).value = 'Key Metrics';
  summary.getCell(`B${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  r += 1;
  [['Total Tasks', kpis.total], ['Completed', kpis.completed], ['Completion %', `${kpis.completionPct}%`], ['Overdue', kpis.overdue]]
    .forEach(([label, value]) => {
      summary.getCell(`B${r}`).value = label;
      summary.getCell(`B${r}`).font = { name: 'Arial', size: 10 };
      summary.getCell(`C${r}`).value = value;
      summary.getCell(`C${r}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
      r += 1;
    });

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

  let reasonRow = Math.max(r, statusRow) + 2;
  summary.getCell(`B${reasonRow}`).value = 'Delay Reason Breakdown';
  summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 12, bold: true, color: { argb: NAVY } };
  reasonRow += 1;
  ['Reason', 'Count'].forEach((h, i) => {
    const cell = summary.getCell(reasonRow, 2 + i);
    cell.value = h;
    cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.border = border;
  });
  reasonRow += 1;
  const reasons = computeReasonBreakdown(tasks);
  if (reasons.length === 0) {
    summary.getCell(`B${reasonRow}`).value = 'No delays recorded';
    summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF5B6B75' } };
  } else {
    reasons.forEach(({ name, value }) => {
      summary.getCell(`B${reasonRow}`).value = name;
      summary.getCell(`B${reasonRow}`).font = { name: 'Arial', size: 10 };
      summary.getCell(`B${reasonRow}`).border = border;
      summary.getCell(`C${reasonRow}`).value = value;
      summary.getCell(`C${reasonRow}`).alignment = { horizontal: 'center' };
      summary.getCell(`C${reasonRow}`).border = border;
      reasonRow += 1;
    });
  }

  // ---- Sheet 2: Task Data ----
  const ws = wb.addWorksheet('Task Data', { views: [{ state: 'frozen', ySplit: 1, showGridLines: false }] });
  const headers = ['SR No', 'Date', 'Name', 'UST ID', 'Project Name', 'Role/Task', 'Project Start Date',
    'Expected Completion Date', 'Completed Date', 'Status', 'Total Time Taken', 'Reason for Delay', 'Remarks', 'Overdue'];
  ws.columns = [{ width: 7 }, { width: 12 }, { width: 18 }, { width: 12 }, { width: 26 }, { width: 22 },
    { width: 16 }, { width: 18 }, { width: 16 }, { width: 14 }, { width: 18 }, { width: 20 }, { width: 28 }, { width: 10 }];

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

  tasks.forEach((t, idx) => {
    const row = ws.getRow(idx + 2);
    const overdue = isOverdue(t);
    const values = [
      idx + 1, t.date ? dayjs(t.date).format('DD-MMM-YYYY') : '', t.name, t.ustId, t.projectName, t.roleTask,
      t.startDate ? dayjs(t.startDate).format('DD-MMM-YYYY') : '',
      t.expectedDate ? dayjs(t.expectedDate).format('DD-MMM-YYYY') : '',
      t.completedDate ? dayjs(t.completedDate).format('DD-MMM-YYYY') : '',
      t.status, getTotalTime(t), t.reasonForDelay, t.remarks, overdue ? 'YES' : '',
    ];
    values.forEach((v, i) => {
      const cell = row.getCell(i + 1);
      cell.value = v;
      cell.font = { name: 'Arial', size: 10 };
      cell.border = border;
      cell.alignment = { vertical: 'middle', wrapText: i === 4 || i === 12, horizontal: [0, 9, 13].includes(i) ? 'center' : 'left' };
    });
    if (idx % 2 === 1) {
      for (let c = 1; c <= headers.length; c++) {
        const cell = row.getCell(c);
        if (!cell.fill) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF6F8F9' } };
      }
    }
    const fill = STATUS_FILL[t.status] || { fg: 'FFEFEFEF', font: 'FF333333' };
    const statusCell = row.getCell(10);
    statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill.fg } };
    statusCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: fill.font } };
    statusCell.alignment = { horizontal: 'center' };
    if (overdue) {
      const overdueCell = row.getCell(14);
      overdueCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      overdueCell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF9C0006' } };
      overdueCell.alignment = { horizontal: 'center' };
      const expCell = row.getCell(8);
      expCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
      expCell.font = { name: 'Arial', size: 10, color: { argb: 'FF9C0006' } };
    }
  });

  ws.autoFilter = { from: 'A1', to: `N${tasks.length + 1}` };

  const buffer = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), filename);
}

/* ============================== SUBCOMPONENTS ============================== */

function KpiCard({ label, value, color, bg }) {
  return (
    <Paper elevation={0} sx={{ p: 2.25, height: '100%', border: '1px solid #E4E9EC' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{label}</Typography>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, mt: 0.5 }} />
      </Stack>
      <Typography variant="h4" sx={{ mt: 1.5, mb: 1, fontWeight: 800 }}>{value}</Typography>
      <Box sx={{ height: 3, borderRadius: 2, bgcolor: color, width: '55%' }} />
    </Paper>
  );
}

function TaskFormDialog({ open, onClose, onSave, initialTask }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initialTask ? { ...initialTask } : { ...emptyForm, date: new Date().toISOString().slice(0, 10) });
      setErrors({});
    }
  }, [open, initialTask]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.projectName.trim()) e.projectName = 'Required';
    if (!form.startDate) e.startDate = 'Required';
    if (!form.expectedDate) e.expectedDate = 'Required';
    if (form.completedDate && form.startDate && form.completedDate < form.startDate) e.completedDate = 'Cannot be before start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) onSave(form); };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>{initialTask ? 'Edit Task' : 'Add Task'}</Typography>
        <IconButton size="small" onClick={onClose}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.date} onChange={handleChange('date')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" fullWidth size="small" value={form.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="UST ID" fullWidth size="small" value={form.ustId} onChange={handleChange('ustId')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Project Name" fullWidth size="small" value={form.projectName} onChange={handleChange('projectName')} error={!!errors.projectName} helperText={errors.projectName} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Role / Task" fullWidth size="small" value={form.roleTask} onChange={handleChange('roleTask')} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Project Start Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.startDate} onChange={handleChange('startDate')} error={!!errors.startDate} helperText={errors.startDate} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Expected Completion" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.expectedDate} onChange={handleChange('expectedDate')} error={!!errors.expectedDate} helperText={errors.expectedDate} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Completed Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={form.completedDate} onChange={handleChange('completedDate')} error={!!errors.completedDate} helperText={errors.completedDate} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Status" fullWidth size="small" value={form.status} onChange={handleChange('status')}>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Reason for Delay" fullWidth size="small" value={form.reasonForDelay} onChange={handleChange('reasonForDelay')}>
              {REASON_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Remarks" fullWidth multiline minRows={2} size="small" value={form.remarks} onChange={handleChange('remarks')} />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: '#0A5D5C' } }}>
          {initialTask ? 'Save changes' : 'Add task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================== MAIN COMPONENT ============================== */

export default function TaskTracker() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : sampleTasks;
    } catch {
      return sampleTasks;
    }
  });
  const [filters, setFilters] = useState({ from: '', to: '', status: 'All', search: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snack, setSnack] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }, [tasks]);

  const filtered = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
  const kpis = useMemo(() => computeKpis(filtered), [filtered]);
  const statusBreakdown = useMemo(() => computeStatusBreakdown(filtered), [filtered]);
  const reasonBreakdown = useMemo(() => computeReasonBreakdown(filtered), [filtered]);

  const openAdd = () => { setEditingTask(null); setDialogOpen(true); };
  const openEdit = (t) => { setEditingTask(t); setDialogOpen(true); };

  const handleSave = (form) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? { ...form, id: editingTask.id } : t)));
      setSnack({ severity: 'success', message: 'Task updated.' });
    } else {
      setTasks((prev) => [...prev, { ...form, id: uuidv4() }]);
      setSnack({ severity: 'success', message: 'Task added.' });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setSnack({ severity: 'info', message: 'Task deleted.' });
  };

  const handleExport = async () => {
    if (filtered.length === 0) {
      setSnack({ severity: 'warning', message: 'No tasks to export for the current filters.' });
      return;
    }
    await exportTasksToExcel(filtered, `Task_Tracker_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setSnack({ severity: 'success', message: 'Excel file downloaded.' });
  };

  const kpiCards = [
    { label: 'Total Tasks', value: kpis.total, color: '#1B2A4A', bg: '#EEF1F6' },
    { label: 'Not Started', value: kpis.counts['Not Started'] || 0, color: STATUS_COLORS['Not Started'].main, bg: STATUS_COLORS['Not Started'].bg },
    { label: 'In Progress', value: kpis.counts['In Progress'] || 0, color: STATUS_COLORS['In Progress'].main, bg: STATUS_COLORS['In Progress'].bg },
    { label: 'In Review', value: kpis.counts['In Review'] || 0, color: STATUS_COLORS['In Review'].main, bg: STATUS_COLORS['In Review'].bg },
    { label: 'Testing', value: kpis.counts['Testing'] || 0, color: STATUS_COLORS['Testing'].main, bg: STATUS_COLORS['Testing'].bg },
    { label: 'Completed', value: kpis.counts['Completed'] || 0, color: STATUS_COLORS['Completed'].main, bg: STATUS_COLORS['Completed'].bg },
    { label: 'Delayed', value: kpis.counts['Delayed'] || 0, color: STATUS_COLORS['Delayed'].main, bg: STATUS_COLORS['Delayed'].bg },
    { label: 'Completion %', value: `${kpis.completionPct}%`, color: STATUS_COLORS['Completed'].main, bg: STATUS_COLORS['Completed'].bg },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F7F8', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Task Tracker</Typography>
            <Typography variant="body2" color="text.secondary">Team work status & analytics</Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', sm: 'center' }} flexWrap="wrap">
            <TextField label="From" type="date" size="small" InputLabelProps={{ shrink: true }}
              value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} sx={{ width: 150 }} />
            <TextField label="To" type="date" size="small" InputLabelProps={{ shrink: true }}
              value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} sx={{ width: 150 }} />
            <TextField select label="Status" size="small" value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} sx={{ width: 150 }}>
              <MenuItem value="All">All statuses</MenuItem>
              {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField label="Search" size="small" placeholder="Name, project, role…" value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} sx={{ width: 180 }} />
            <Tooltip title="Reset filters">
              <IconButton onClick={() => setFilters({ from: '', to: '', status: 'All', search: '' })} sx={{ border: '1px solid #E4E9EC' }}>
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Button variant="outlined" startIcon={<FileDownloadRoundedIcon />} onClick={handleExport}
              sx={{ borderColor: PRIMARY, color: PRIMARY }}>
              Export Excel
            </Button>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAdd}
              sx={{ bgcolor: PRIMARY, '&:hover': { bgcolor: '#0A5D5C' } }}>
              Add Task
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          {/* KPI cards */}
          <Grid container spacing={2}>
            {kpiCards.map((c) => (
              <Grid item xs={12} sm={6} md={3} lg={1.5} key={c.label} sx={{ flexGrow: 1 }}>
                <KpiCard {...c} />
              </Grid>
            ))}
          </Grid>

          {/* Charts */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
            <Paper elevation={0} sx={{ p: 2.5, flex: 1, minWidth: 0, border: '1px solid #E4E9EC' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Task status breakdown</Typography>
              {statusBreakdown.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No tasks match the current filters.</Typography></Box>
              ) : (
                <Box sx={{ position: 'relative', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2} strokeWidth={0}>
                        {statusBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name]?.main || '#94A3B8'} />
                        ))}
                      </Pie>
                      <ChartTooltip formatter={(value, name) => [`${value} task${value === 1 ? '' : 's'}`, name]} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                  <Stack sx={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{kpis.total}</Typography>
                    <Typography variant="caption" color="text.secondary">total</Typography>
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, flex: 1, minWidth: 0, border: '1px solid #E4E9EC' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Delay reasons this period</Typography>
              {reasonBreakdown.length === 0 ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="text.secondary">No delays recorded. 🎉</Typography></Box>
              ) : (
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reasonBreakdown} margin={{ top: 8, right: 8, left: -12, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E9EC" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
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
          </Stack>

          {/* Table */}
          <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #E4E9EC' }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>All tasks ({filtered.length})</Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 560 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {['SR', 'Name', 'UST ID', 'Project', 'Role / Task', 'Start', 'Expected', 'Completed',
                      'Status', 'Time Taken', 'Reason for Delay', 'Remarks', 'Actions'].map((h) => (
                      <TableCell key={h} align={h === 'Actions' ? 'center' : 'left'}
                        sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                          <Typography color="text.secondary">No tasks yet — click &ldquo;Add Task&rdquo; to create the first one.</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((t, idx) => {
                    const overdue = isOverdue(t);
                    const colors = STATUS_COLORS[t.status] || { main: '#94A3B8', bg: '#F1F5F9' };
                    return (
                      <TableRow key={t.id} hover sx={{ bgcolor: overdue ? '#FFF7F7' : idx % 2 ? '#FAFBFC' : 'transparent' }}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                        <TableCell>{t.ustId}</TableCell>
                        <TableCell sx={{ maxWidth: 180 }}>{t.projectName}</TableCell>
                        <TableCell sx={{ maxWidth: 160 }}>{t.roleTask}</TableCell>
                        <TableCell>{fmt(t.startDate)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            {overdue && (
                              <Tooltip title="Past expected completion date">
                                <WarningAmberRoundedIcon fontSize="inherit" sx={{ color: STATUS_COLORS['Delayed'].main }} />
                              </Tooltip>
                            )}
                            <Typography variant="body2" sx={{ color: overdue ? STATUS_COLORS['Delayed'].main : 'inherit', fontWeight: overdue ? 700 : 400 }}>
                              {fmt(t.expectedDate)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{fmt(t.completedDate)}</TableCell>
                        <TableCell>
                          <Chip label={t.status} size="small" sx={{ bgcolor: colors.bg, color: colors.main, fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{getTotalTime(t)}</TableCell>
                        <TableCell>
                          {t.reasonForDelay && t.reasonForDelay !== 'None' ? <Chip label={t.reasonForDelay} size="small" variant="outlined" /> : '—'}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>
                          <Typography variant="body2" color="text.secondary" noWrap title={t.remarks}>{t.remarks || '—'}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <IconButton size="small" onClick={() => openEdit(t)}><EditRoundedIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDelete(t.id)}><DeleteRoundedIcon fontSize="small" color="error" /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Container>

      <TaskFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} initialTask={editingTask} />

      <Snackbar open={!!snack} autoHideDuration={3000} onClose={() => setSnack(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        {snack && <Alert severity={snack.severity} variant="filled" onClose={() => setSnack(null)}>{snack.message}</Alert>}
      </Snackbar>
    </Box>
  );
}