"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import GithubLogo from "./GithubLogo";
import "./Leaderboard.css";

export type LeaderboardProps = {
  cols: string[];
  rows: { [x in string]: string }[];
  pageSize?: number;
};

export default function Leaderboard({
  cols,
  rows,
  pageSize = 10,
}: LeaderboardProps) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pageSize);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer
        className="TableContainer"
        sx={{ maxHeight: 440, scrollbarWidth: "1rem" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "1.2vw" }} key={"rank"}>
                Rank
              </TableCell>
              {cols.map((col) => (
                <TableCell
                  align="center"
                  className="HeadingColumn"
                  sx={{ fontSize: "1.2vw" }}
                  key={col}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell key={"rank"}>{idx + 1}</TableCell>
                    {cols.map((col) => {
                      if (col == "Github Repository URL") {
                        const value = (
                          <a href={row[col]}>
                            <GithubLogo />
                          </a>
                        );
                        return (
                          <TableCell align="center" key={col}>
                            {value}
                          </TableCell>
                        );
                      }
                      const value = row[col];

                      return <TableCell key={col}>{value}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
