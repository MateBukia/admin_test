import * as React from 'react';
import { useState } from 'react';
import {
  TableRow, TableCell, IconButton, Collapse, Box, Typography, Table, TableBody, TextField, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { RowData } from '../../Types/RowDataType';

interface CollapsibleRowProps {
  row: RowData;
  onDelete: (id: number) => void;
  onSave: (id: number, updatedRow: RowData) => void;
}

export default function CollapsibleRow({ row, onDelete, onSave }: CollapsibleRowProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedRow, setEditedRow] = useState<RowData>(row);

  const handleEditClick = () => {
    setEditing(true);
    setOpen(true);
  };

  const handleSaveClick = () => {
    onSave(row.id, editedRow);
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditedRow(row);
    setEditing(false);
  };

  const handleChange = (key: string, value: any) => {
    setEditedRow({ ...editedRow, [key]: value });
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.channelID}</TableCell> {/* Display channelID */}
        <TableCell>{row.name}</TableCell> {/* Display name */}
        <TableCell>{row.tokenIdentityParams}</TableCell> {/* Display tokenIdentityParams */}
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
            <Box margin={1}
              sx={{
                backgroundColor: 'white',
                borderRadius: '4px',
              }}
            >
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="details">
                <TableBody>
                  {Object.keys(editedRow).map((key) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">
                        {key}
                      </TableCell>
                      <TableCell>
                        {editing ? (
                          <TextField
                            fullWidth
                            value={editedRow[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                          />
                        ) : (
                          editedRow[key]
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {editing && (
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <Button variant="contained" onClick={handleSaveClick} sx={{ margin: '1em' }}>
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
