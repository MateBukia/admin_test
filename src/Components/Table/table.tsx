import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './table.css';

interface RowData {
    id: number;
    description: string;
    isactive: boolean;
    type: number | string;
}

interface CollapsibleTableProps {
  rows: RowData[];
  onDelete: (id: number) => void;
}

export default function CollapsibleTable({ rows, onDelete }: CollapsibleTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Is Active</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell align="right">{row.isactive ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onDelete(row.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
