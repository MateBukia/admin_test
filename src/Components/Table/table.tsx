import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CollapsibleRow from './CollapsibleRow';
import { RowData} from '../../Types/RowDataType'

interface CollapsibleTableProps {
  rows: RowData[];
  onDelete: (id: number) => void;
  onSave: (id: number, updatedRow: RowData) => void;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function CollapsibleTable({ rows, onDelete, onSave, setSuccessMessage, setErrorMessage }: CollapsibleTableProps) {
  const selectedKeys = ['name', 'tokenIdentityParams'];

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {selectedKeys.map((key) => (
              <TableCell 
              key={key}
              sx={{
                fontWeight: 'bold',
                fontSize: '20px',
                textTransform: 'uppercase',
              }}>{key}</TableCell>
            ))}
            <TableCell
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              textTransform: 'uppercase',
            }}
            >Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <CollapsibleRow key={row.id} 
            row={row} 
            onDelete={onDelete} 
            onSave={onSave} 
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage} 
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
