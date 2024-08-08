import * as React from 'react';
import CollapsibleTable from '../Table/table';
import './otppage.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControlLabel, Checkbox, IconButton, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Stack from '@mui/material/Stack';
import { green } from '@mui/material/colors';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

interface RowData {
  id: number;
  description: string;
  isactive: boolean;
  type: number | string;
}

function createData(
  id: number,  
  description: string,
  isactive: boolean,
  type: number | string,
): RowData {
  return { id, description, isactive, type };
}

const Otppage = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState<number | string>('');
  const [rows, setRows] = useState<RowData[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);

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
  };

  const handleSave = () => {
    const newId = rows.length + 1;
    const newRow = createData(newId, description, isActive, type);
    setRows([...rows, newRow]);
    setOpen(false);
    setDescription('');
    setIsActive(false);
    setType('');
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
      <CollapsibleTable rows={rows} onDelete={handleConfirmOpen} />
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
              <MenuItem value='Number'>Number</MenuItem>
              <MenuItem value='String'>String</MenuItem>
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
