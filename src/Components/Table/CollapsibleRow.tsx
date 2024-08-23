import * as React from 'react';
import { useState, Dispatch, SetStateAction } from 'react';
import {
  TableRow, TableCell, IconButton, Collapse, Box, Typography, Grid, TextField, Button, MenuItem, Select,
  FormControl, InputLabel, FormHelperText, CircularProgress, Checkbox, FormControlLabel, Snackbar, Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { RowData } from '../../Types/RowDataType';
import useGetTokenTypeList from '../../Hooks/GetTokenTypeList';
import useGetChannelList from '../../Hooks/GetChannelList';
import useUpdateOtp from '../../Hooks/UpdateOtpMethod';

interface CollapsibleRowProps {
  row: RowData;
  onDelete: (id: number) => void;
  onSave: (id: number, updatedRow: RowData) => void;
  setSuccessMessage: Dispatch<SetStateAction<string | null>>;
  setErrorMessage: Dispatch<SetStateAction<string | null>>;
}

export default function CollapsibleRow({
  row,
  onDelete,
  onSave,
  setSuccessMessage,
  setErrorMessage,
}: CollapsibleRowProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedRow, setEditedRow] = useState<RowData>(row);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const { updateOtp, loading } = useUpdateOtp(setErrorMessage);

  const tokenStringTypeIDOptions = useGetTokenTypeList();
  const channelIDOptions = useGetChannelList();

  const handleEditClick = () => {
    setEditing(true);
    setOpen(true);
  };

  const handleSaveClick = async () => {
    if (Object.values(errors).some((error) => error !== null)) {
      return;
    }

    try {
      const successMessage: string = await updateOtp(row.id, editedRow);
      onSave(row.id, editedRow);
      setEditing(false);
      setSuccessMessage(successMessage);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleCancelClick = () => {
    setEditedRow(row);
    setEditing(false);
  };

  const validateField = (key: keyof RowData, value: any): string | null => {
    switch (key) {
      case 'tokenLength':
        if (value < 1) {
          return 'Token length must be at least 1';
        }
        if (!Number.isInteger(Number(value))) {
          return 'Token length must be an integer';
        }
        break;
      // Add more validation cases as needed
    }
    return null;
  };

  const handleValueChange = (key: keyof RowData, value: any) => {
    switch (key) {
      case 'id':
      case 'smsProductID':
      case 'channelID':
      case 'expireTimeMinute':
      case 'checkVerifyTryCount':
      case 'generateLimitQuantity':
      case 'generateLimitTimeMinute':
      case 'tokenLength':
      case 'generateLimitWithoutQuantityTimeSecond':
      case 'tokenStringTypeID':
        value = Number(value);
        break;

      case 'name':
      case 'tokenIdentityParams':
      case 'smsTemplate':
        value = String(value);
        break;

      case 'isSendSms':
        value = Boolean(value);
        break;

      default:
        break;
    }

    const error = validateField(key, value);
    setErrors({ ...errors, [key as string]: error });
    setEditedRow({ ...editedRow, [key as string]: value });
  };

  const keysToDisplay = Object.keys(editedRow).filter(key => key !== 'id' && key !== 'name' && key !== 'smsTemplate');

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.tokenIdentityParams}</TableCell>
        <TableCell>
          <IconButton onClick={() => onDelete(row.id)}>
            <DeleteIcon />
          </IconButton>
          {!editing ? (
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          ) : (
            <>
              <IconButton onClick={handleCancelClick}>
                <CancelIcon />
              </IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} sx={{ backgroundColor: 'white', borderRadius: '4px' }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Grid container spacing={2}>
                {/* First Line: Name Full Width */}
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    value={editedRow.name}
                    onChange={(e) => handleValueChange('name', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
                    InputProps={{
                      readOnly: !editing,
                      sx: editing
                        ? {
                            backgroundColor: 'white',
                            borderColor: '#1976d2',
                          }
                        : {
                            backgroundColor: 'rgb(224 224 224 / 42%)',
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '& fieldset': { borderColor: 'transparent' },
                          },
                    }}
                    variant="outlined"
                    error={!!errors['name']}
                    helperText={errors['name']}
                  />
                </Grid>

                {/* Second Line: Mapped Elements */}
                {keysToDisplay.map((key) => (
                  <Grid item xs={6} key={key}>
                    {editing ? (
                      key === 'tokenStringTypeID' ? (
                        <FormControl fullWidth error={!!errors[key]}>
                          <InputLabel shrink={true} sx={{ color: '#1976d2' }}>
                            Token String Type
                          </InputLabel>
                          <Select
                            value={editedRow[key]}
                            onChange={(e) => handleValueChange(key as keyof RowData, e.target.value)}
                            label="Token String Type"
                            sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                          >
                            {tokenStringTypeIDOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                        </FormControl>
                      ) : key === 'channelID' ? (
                        <FormControl fullWidth error={!!errors[key]}>
                          <InputLabel shrink={true} sx={{ color: '#1976d2' }}>
                            Channel ID
                          </InputLabel>
                          <Select
                            value={editedRow[key]}
                            onChange={(e) => handleValueChange(key as keyof RowData, e.target.value)}
                            label="Channel ID"
                            sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                          >
                            {channelIDOptions.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[key] && <FormHelperText>{errors[key]}</FormHelperText>}
                        </FormControl>
                      ) : key === 'isSendSms' ? (
                        <FormControl fullWidth>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!editedRow.isSendSms}
                                onChange={(e) => handleValueChange('isSendSms', e.target.checked)}
                                sx={{ color: '#1976d2' }}
                              />
                            }
                            label="Send SMS"
                          />
                        </FormControl>
                      ) : key === 'tokenLength' ? (
                        <TextField
                          label="Token Length"
                          type="number"
                          fullWidth
                          value={editedRow[key]}
                          onChange={(e) => handleValueChange(key as keyof RowData, Number(e.target.value))}
                          InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
                          inputProps={{ step: 1 }}
                          sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                          variant="outlined"
                          error={!!errors[key]}
                          helperText={errors[key]}
                        />
                      ) : (
                        <TextField
                          label={key}
                          fullWidth
                          value={editedRow[key]}
                          onChange={(e) => handleValueChange(key as keyof RowData, e.target.value)}
                          error={!!errors[key]}
                          helperText={errors[key]}
                          InputLabelProps={{ sx: { color: '#1976d2' } }}
                          sx={{ backgroundColor: 'white', borderColor: '#1976d2' }}
                        />
                      )
                    ) : (
                      key === 'isSendSms' ? (
                        <FormControl fullWidth>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!editedRow.isSendSms}
                                disabled
                                sx={{ color: '#1976d2' }}
                              />
                            }
                            label="Send SMS"
                          />
                        </FormControl>
                      ) : (
                        <TextField
                          label={key}
                          value={
                            key === 'channelID'
                              ? channelIDOptions.find(option => option.value === editedRow[key])?.label
                              : key === 'tokenStringTypeID'
                                ? tokenStringTypeIDOptions.find(option => option.value === editedRow[key])?.label
                                : editedRow[key]
                          }
                          fullWidth
                          InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
                          InputProps={{
                            readOnly: true,
                            sx: {
                              backgroundColor: 'rgb(224 224 224 / 42%)',
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                              '& fieldset': { borderColor: 'transparent' },
                            },
                          }}
                          variant="outlined"
                        />
                      )
                    )}
                  </Grid>
                ))}

                {/* Last Line: SMS Template Full Width */}
                <Grid item xs={12}>
                  <TextField
                    label="SMS Template"
                    value={editedRow.smsTemplate}
                    onChange={(e) => handleValueChange('smsTemplate', e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true, sx: { color: '#1976d2' } }}
                    InputProps={{
                      readOnly: !editing,
                      sx: editing
                        ? {
                            backgroundColor: 'white',
                            borderColor: '#1976d2',
                          }
                        : {
                            backgroundColor: 'rgb(224 224 224 / 42%)',
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                            '& fieldset': { borderColor: 'transparent' },
                          },
                    }}
                    variant="outlined"
                    error={!!errors['smsTemplate']}
                    helperText={errors['smsTemplate']}
                  />
                </Grid>
              </Grid>
              {editing && (
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  {loading && <CircularProgress size={24} />}
                  <Button
                    variant="contained"
                    onClick={handleSaveClick}
                    disabled={Object.values(errors).some((error) => error !== null) || loading}
                    sx={{ margin: '1em' }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}
    </>
  );
}
