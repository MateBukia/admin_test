import * as React from 'react';
import CollapsibleTable from '../Components/Table/table';
import './otppage.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControlLabel, Checkbox, IconButton, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { RowData} from '../Types/RowDataType';

const Otppage = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<number | string>('');
  const [rows, setRows] = useState<RowData[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.25.25.6:3000/otp-method/get_list?skip=0&limit=10');
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOnSave = (id: number, updatedRow: RowData) => {
    setRows(rows.map(row => (row.id === id ? updatedRow : row)));
  };

  const handleDelete = (id: number) => {
    const updatedRows = rows.filter(row => row.id !== id);
    setRows(updatedRows);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTypeChange = (event: SelectChangeEvent<number | string>) => {
    setType(event.target.value as number | string);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSave = () => {
    const newId = rows.length + 1;
    const newRow: RowData = {
      id: newId,
      name: description,
      channelID: 1, 
      tokenIdentityParams: 'phone,personalID', 
      expireTimeMinute: 3, 
      checkVerifyTryCount: 5, 
      generateLimitQuantity: 4, 
      generateLimitTimeMinute: 1, 
      isSendSms: isActive,
      smsProductID: '164', 
      tokenLength: 4, 
      generateLimitWithoutQuantityTimeSecond: 30, 
      tokenStringTypeID: typeof type === 'number' ? type : 1,
      smsTemplate: 'Your OTP code is {{otpCode}}', 
    };

    setRows([...rows, newRow]);
    setOpen(false);
    resetForm();
  };

  const handleConfirmOpen = (id: number) => {
    setRowToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setRowToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete !== null) {
      handleDelete(rowToDelete);
    }
    setConfirmOpen(false);
    setRowToDelete(null);
  };

  const resetForm = () => {
    setDescription('');
    setIsActive(false);
    setType('');
  };

  return (
    <div>
      <header>
        <h1>დაამატეთ OTP</h1>
        <Stack direction="row" spacing={3}>
          <IconButton onClick={handleClickOpen}>
            <AddCircleIcon sx={{ color: green[500], fontSize: 40 }} />
          </IconButton>
        </Stack>
      </header>
      <CollapsibleTable rows={rows} onDelete={handleConfirmOpen} onSave={handleOnSave} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Type</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={type}
              label="Type"
              onChange={handleTypeChange}
            >
              <MenuItem value={1}>Number</MenuItem>
              <MenuItem value={2}>String</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Is Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this row?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} variant="contained" color="primary">
            Yes
          </Button>
          <Button onClick={handleConfirmClose} variant="contained" color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Otppage;
