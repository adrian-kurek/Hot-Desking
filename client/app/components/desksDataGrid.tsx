import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { trpc } from "./../trpc";
import Alert from "@mui/material/Alert";
import { IconButton, Tooltip, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
interface deskRow {
  id: string;
  name: string;
  isAvailable: boolean;
}

const handleDelete = (id: number) => {
  console.log(id);
};

const handleEdit = (row: deskRow) => {
  console.log(row);
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Nazwa", flex: 1 },
  { field: "isAvailable", headerName: "Czy dostępne", flex: 1 },
  {
    field: "actions",
    headerName: "Akcje",
    flex: 1,
    renderCell: (params) => (
      <>
        <Box sx={{ display: "flex", gap: 1, marginBlock: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!params.row.isAvailable}
            onClick={() => console.log("hej")}
          >
            Zarezerwuj
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Edytuj
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Usuń
          </Button>
        </Box>
      </>
    ),
  },
];

export function DesksDataGrid() {
  const { data, isLoading, error } = trpc.desks.test.useQuery();

  if (isLoading) return <Alert severity="info">Trwa ładowanie danych</Alert>;
  if (error)
    return <Alert severity="error">Błąd podczas ładowania danych</Alert>;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data?.message || []} // make sure data exists
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
