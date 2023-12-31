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
import GithubLogo from "@/components/Logos/GithubLogo";
import { LeaderboardData } from "@/lib/leaderboard";
import { SeqBrandColor, capitalize } from "@/lib/utils";
import { SxProps, Theme } from "@mui/material";

export type LeaderboardProps = {
  data: LeaderboardData;
  pageSize?: number;
  sx?: SxProps<Theme> | undefined;
};

export default function Leaderboard({
  data,
  pageSize = 10,
  sx,
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

  const getColor = SeqBrandColor();

  const cols = [
    "rank",
    "name",
    "id",
    "github",
    "score",
  ] as (keyof (typeof data)[number])[];

  return (
    <Paper
      sx={{
        ...sx,
        width: "100%",
        display: "grid",
        gridTemplateRows: "1fr auto",
      }}
    >
      <TableContainer className="TableContainer">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {cols.map((col) => {
                const color = getColor();
                return (
                  <TableCell
                    align="center"
                    className="HeadingColumn"
                    sx={{ color }}
                    key={col}
                  >
                    {capitalize(col)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {cols.map((col) => {
                      switch (col) {
                        case "github":
                          return (
                            <TableCell align="center" key={col}>
                              {row[col] ? (
                                <a
                                  href={
                                    row[col] as NonNullable<
                                      (typeof row)["github"]
                                    >
                                  }
                                >
                                  <GithubLogo />
                                </a>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                          );
                        default:
                          return (
                            <TableCell
                              sx={{
                                fontWeight: "100",
                              }}
                              align="center"
                              key={col}
                            >
                              {row[col]}
                            </TableCell>
                          );
                      }
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
