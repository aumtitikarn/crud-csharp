// src/app/employees/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { Employee, ApiResponse } from '@/types';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee, searchEmployees } from './services/employeeService';

interface FormData {
  name: string;
  position: string;
  salary: number;
}

export default function EmployeePage() {
  // Styles
  const styles = {
    header: {
      backgroundColor: '#fff',
      color: '#2c2c2c',
      fontWeight: 600,
      borderBottom: '2px solid #f2f2f2',
    },
    actionButton: {
      edit: {
        color: '#f58d29',
        '&:hover': {
          backgroundColor: '#fff3e6',
        },
      },
      delete: {
        color: '#ff4d4f',
        '&:hover': {
          backgroundColor: '#fff1f0',
        },
      },
    },
    positionChip: {
      backgroundColor: '#fff3e6',
      color: '#f58d29',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: '#ffe8cc',
      },
    },
    searchBar: {
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#e6e6e6',
        },
        '&:hover fieldset': {
          borderColor: '#f58d29',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#f58d29',
        },
      },
    },
    mainButton: {
      bgcolor: '#f58d29',
      '&:hover': {
        bgcolor: '#d97b1c',
      },
    },
    iconButton: {
      color: '#f58d29',
      '&:hover': {
        bgcolor: '#fff3e6',
      },
    },
    tableRow: {
      '&:hover': {
        backgroundColor: '#fafafa',
      },
    },
    closeButton: {
      position: 'absolute', 
      right: 8, 
      top: 8,
      color: '#666666',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
    dialogPaper: {
      borderRadius: '12px',
    },
    dialogTitle: {
      borderBottom: '1px solid #f0f0f0',
    },
    dialogContent: {
      p: 3,
    },
    dialogActions: {
      p: 2, 
      borderTop: '1px solid #f0f0f0',
    },
    cancelButton: {
      color: '#666666',
    },
    successAlert: {
      bgcolor: '#fff3e6',
      color: '#f58d29',
      '& .MuiAlert-icon': {
        color: '#f58d29',
      },
    },
  };

  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', position: '', salary: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // Functions
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (error) {
      showSnackbar('Error loading employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const result = await updateEmployee(editingId, formData);
        if (result.success) {
          showSnackbar('Employee updated successfully');
          setEditingId(null);
        }
      } else {
        const result = await createEmployee(formData);
        if (result.success) {
          showSnackbar('Employee created successfully');
        }
      }
      setFormData({ name: '', position: '', salary: 0 });
      loadEmployees();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar('Error saving employee', 'error');
    }
  };

  const handleEdit = (employee: Employee) => {
    setFormData({ name: employee.name, position: employee.position, salary: employee.salary });
    setEditingId(employee.id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteEmployee(id);
      if (result.success) {
        showSnackbar('Employee deleted successfully');
        loadEmployees();
      }
    } catch (error) {
      showSnackbar('Error deleting employee', 'error');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchTerm) {
        const result = await searchEmployees(searchTerm);
        if (result.success) {
          setEmployees(result.data);
        }
      } else {
        loadEmployees();
      }
    } catch (error) {
      showSnackbar('Error searching employees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salary);
  };

  // JSX
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#2c2c2c' }}>
            จัดการพนักงาน
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', position: '', salary: 0 });
              setOpenDialog(true);
            }}
            sx={styles.mainButton}
          >
            เพิ่มพนักงาน
          </Button>
        </Box>

        {/* Search Card */}
        <Card sx={{ mb: 4, p: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาตามชื่อ"
                sx={styles.searchBar}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#bfbfbf' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={styles.mainButton}
              >
                ค้นหา
              </Button>
              <IconButton 
                onClick={loadEmployees} 
                disabled={loading}
                sx={styles.iconButton}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.header}>ID</TableCell>
                  <TableCell sx={styles.header}>ชื่อ</TableCell>
                  <TableCell sx={styles.header}>ตำแหน่ง</TableCell>
                  <TableCell sx={styles.header}>เงินเดือน</TableCell>
                  <TableCell sx={styles.header} align="right">การจัดการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow 
                    key={employee.id} 
                    hover 
                    sx={styles.tableRow}
                  >
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.position} 
                        size="small"
                        sx={styles.positionChip}
                      />
                    </TableCell>
                    <TableCell>{formatSalary(employee.salary)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="แก้ไข">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(employee)}
                          sx={styles.actionButton.edit}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ลบ">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(employee.id)}
                          sx={styles.actionButton.delete}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: styles.dialogPaper
          }}
        >
          <DialogTitle sx={styles.dialogTitle}>
            {editingId ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
            <IconButton
              onClick={() => setOpenDialog(false)}
              sx={styles.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={styles.dialogContent}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="ชื่อพนักงาน"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                sx={styles.searchBar}
              />
              <TextField
                label="ตำแหน่ง"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                fullWidth
                required
                sx={styles.searchBar}
              />
              <TextField
                label="เงินเดือน"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                fullWidth
                required
                sx={styles.searchBar}
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={styles.dialogActions}>
            <Button 
              onClick={() => setOpenDialog(false)}
              sx={styles.cancelButton}
            >
              ยกเลิก
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={!formData.name || !formData.position || formData.salary <= 0}
              sx={styles.mainButton}
            >
              {editingId ? 'อัพเดท' : 'เพิ่ม'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity as 'success' | 'error'}
            sx={{ 
              width: '100%',
              ...(snackbar.severity === 'success' && styles.successAlert),
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}