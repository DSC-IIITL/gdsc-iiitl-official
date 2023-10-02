import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "timestamp", headerName: "Timestamp", width: 90 },
  { field: "id", headerName: "ID", width: 70 },
  { field: "fullName", headerName: "Full name", width: 130 },
  { field: "link", headerName: "Link", width: 130 },
];

const rows = [
  { id: 1, fullName: "Snow", timestamp: "10", link: "https://github.com" },
  { id: 2, fullName: "Lannister", timestamp: "10", link: "https://github.com" },
  { id: 3, fullName: "Lannister", timestamp: "10", link: "https://github.com" },
  { id: 4, fullName: "Stark", timestamp: "10", link: "https://github.com" },
  { id: 5, fullName: "Targaryen", timestamp: "10", link: "https://github.com" },
  {
    id: 6,
    fullName: "Melisandre",
    timestamp: "10",
    link: "https://github.com",
  },
  { id: 7, fullName: "Clifford", timestamp: "10", link: "https://github.com" },
  { id: 8, fullName: "Frances", timestamp: "10", link: "https://github.com" },
  { id: 9, fullName: "Roxie", timestamp: "10", link: "https://github.com" },
];

export type ContestEntriesTableProps = {
  data: any;
};

export default function ContestEntriesTable() {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
