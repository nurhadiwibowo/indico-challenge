import React from 'react';
import {
  PaginationItem,
  Box,
  Pagination,
  Table as TableMUI,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePathname } from 'src/routes/hooks';

export const TableBasic = ({
  rows,
  headRows,
  indexKey,
  renderCustomCell,
  hidePagination = false,
}: {
  hidePagination?: boolean;
  rows: any[];
  showPerPage: number;
  headRows: { [key: string]: string }[];
  indexKey: string;
  renderCustomCell?: (row: any, keyName: string) => ReactNode | null;
}) => {
  const pathname = usePathname();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [showPerPage, setShowPerPage] = useState(10);
  const count = Math.ceil(rows.length / showPerPage);
  const handleChange = (event: SelectChangeEvent) =>
    setShowPerPage(parseInt(event.target.value, 10));

  return (
    <Box>
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <TableMUI stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {headRows.map((headRow) => {
                const value = Object.values(headRow)[0];
                return <TableCell key={value}>{value}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice((page - 1) * showPerPage, (page - 1) * showPerPage + showPerPage)
              .map((row) => (
                <TableRow
                  key={row[indexKey]}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {headRows.map((item) => {
                    const keyName = Object.keys(item)[0];
                    return (
                      <>
                        {renderCustomCell && renderCustomCell(row, keyName) ? (
                          renderCustomCell(row, keyName)
                        ) : (
                          <TableCell key={keyName} component="th" scope="row">
                            {row[keyName]}
                          </TableCell>
                        )}
                      </>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </TableMUI>
      </TableContainer>

      {Boolean(count) && hidePagination ? (
        <></>
      ) : (
        <Box display="flex" justifyContent="flex-end" marginY="1rem" flexDirection="row">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Typography marginX="1rem">Show per Page:</Typography>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={String(showPerPage)}
              label="Age"
              onChange={handleChange}
            >
              {new Array(4).fill(0).map((item, index) => {
                const num = (index + 1) * 5;
                return <MenuItem value={num}>{num}</MenuItem>;
              })}
            </Select>
          </Box>
          <Pagination
            sx={{ display: 'flex' }}
            count={count}
            renderItem={(item) => (
              <PaginationItem
                sx={{ maxWidth: '50%' }}
                key={item.page}
                component={Link}
                to={`${pathname}${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};
