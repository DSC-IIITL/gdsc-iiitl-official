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

  const colors = ["#34A853", "#EA4335", "#4285F4", "#FBBC05"];
  const ColorPicker = (i) => {
    return colors[i % 4];
  };
  const ColorPickerRating = (col) => {
    if (col <= 4) {
      return colors[1];
    } else if (col > 4 && col <= 7) {
      return colors[3];
    } else {
      return colors[0];
    }
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
              <TableCell
                align="center"
                sx={{
                  color: "#FBBC05",
                  fontSize: "1.2vw",
                }}
                key={"rank"}
              >
                Rank
              </TableCell>
              {cols.map((col, i) => {
                const color = ColorPicker(i);
                return (
                  <TableCell
                    align="center"
                    className="HeadingColumn"
                    sx={{ fontSize: "1.2vw", color: color }}
                    key={col}
                  >
                    {col}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => {
                const color = ColorPicker(idx + 3);

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    <TableCell
                      align="center"
                      sx={{ color: color }}
                      key={"rank"}
                    >
                      {idx + 1}
                    </TableCell>
                    {cols.map((col) => {
                      if (col == "Github Repository URL") {
                        const value = (
                          <a href={row[col]}>
                            <GithubLogo />
                          </a>
                        );
                        return (
                          <TableCell
                            sx={{
                              marginTop: "auto",
                              marginBottom: "auto",
                            }}
                            align="center"
                            key={col}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      if (col == "Enrollment Number") {
                        const value = row[col];
                        return (
                          <TableCell
                            sx={{
                              marginTop: "auto",
                              marginBottom: "auto",
                              opacity: "0.7",
                            }}
                            align="center"
                            key={col}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      if (col == "Challenges Faced") {
                        const value = row[col];

                        return (
                          <TableCell
                            sx={{
                              marginTop: "auto",
                              marginBottom: "auto",
                              fontStyle: "italic",
                              opacity: "0.7",
                              fontWeight: "1",
                            }}
                            align="center"
                            key={col}
                          >
                            {value || "--"}
                          </TableCell>
                        );
                      }
                      if (col == "Full Name") {
                        const value = row[col];

                        return (
                          <TableCell
                            sx={{
                              fontSize: "1.1vw",
                              marginTop: "auto",
                              marginBottom: "auto",
                              fontWeight: "100",
                              color: color,
                            }}
                            align="center"
                            key={col}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      if (col == "Contact Number") {
                        const value = row[col];
                        // console.log(typeof row[col]);
                        console.log("am I getting");
                        return (
                          <TableCell
                            sx={{
                              fontSize: "0.9vw",
                              marginTop: "auto",
                              marginBottom: "auto",
                              opacity: "0.7",
                            }}
                            align="center"
                            key={col}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      if (col == "Timestamp") {
                        const value = row[col];

                        return (
                          <TableCell
                            sx={{
                              fontSize: "0.9vw",
                              marginTop: "auto",
                              marginBottom: "auto",
                              fontWeight: "2",
                              opacity: "0.7",
                            }}
                            align="center"
                            key={col}
                          >
                            {value}
                          </TableCell>
                        );
                      }
                      const value = row[col];
                      const colors = ColorPickerRating(row[col]);

                      return (
                        <TableCell
                          sx={{
                            marginTop: "auto",
                            marginBottom: "auto",
                            color: colors,
                          }}
                          align="center"
                          key={col}
                        >
                          {value}
                        </TableCell>
                      );
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
