import React from 'react';
import { useState } from 'react';
import CollapsibleTable from '../Components/Table/table';
import './otppage.css';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Stack, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { green } from '@mui/material/colors';
import { RowData } from '../Types/RowDataType';
import deleteOtpMethod from '../Hooks/DeleteOtpMethod';
import useGetMethodList from '../Hooks/GetOtpMethodList';
import useAutoClear from '../Hooks/AutoClearMessage';
import CreateNewOtp from '../Components/Table/AddNewOtp';

const Otppage = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<RowData[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useGetMethodList(setRows);

  const handleOnSave = (id: number, updatedRow: RowData) => {
    setRows(rows.map(row => (row.id === id ? updatedRow : row)));
    setSuccessMessage('OTP method updated successfully');
  };

  const handleDelete = (id: number) => {
    deleteOtpMethod(id, rows, setRows, setSuccessMessage, setErrorMessage);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  useAutoClear(successMessage, errorMessage, setSuccessMessage, setErrorMessage);

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      <header>
        <div className='header'>
          <h1>ADD OTP</h1>
          <Stack direction="row" spacing={3}>
            <IconButton onClick={handleClickOpen}>
              <AddCircleIcon sx={{ color: green[500], fontSize: 40 }} />
            </IconButton>
          </Stack>
        </div>
      </header>
      <CollapsibleTable 
        rows={rows} 
        onDelete={handleConfirmOpen} 
        onSave={handleOnSave} 
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />
      <CreateNewOtp
        open={open}
        onClose={handleClose}
        setRows={setRows}
        rows={rows}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />

      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
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
