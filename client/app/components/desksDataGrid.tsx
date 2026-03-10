import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { trpc } from "./../trpc";
import Alert from "@mui/material/Alert";
import { Button } from "@mui/material";

import * as React from "react";
import EditModal from "./editModal";
import AddModal from "./addModal";

export interface deskRow {
  id: string;
  name: string;
  isAvailable: boolean;
}

const handleDelete = (id: number) => {
  console.log(id);
};

export function DesksDataGrid() {
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const [selectedRow, setSelectedRow] = React.useState<deskRow | null>(null);

  const handleEdit = (row: deskRow) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const reserveDesk = trpc.desks.reservate.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      return (
        <Alert severity="error">
          Błąd podczas próby rezerwacji biurka: {error.message}
        </Alert>
      );
    },
  });
  const deleteDesk = trpc.desks.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      return (
        <Alert severity="error">
          Błąd podczas próby usuwania biurka: {error.message}
        </Alert>
      );
    },
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Nazwa", flex: 1 },
    {
      field: "isAvailable",
      headerName: "Czy dostępne",
      valueFormatter: (value: boolean) => (value ? "Tak" : "Nie"),
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Akcje",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, marginBlock: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={!params.row.isAvailable}
            onClick={() => reserveDesk.mutate({ id: params.row.id || "" })}
          >
            Zarezerwuj
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            disabled={!params.row.isAvailable}
            onClick={() => handleEdit(params.row)}
          >
            Edytuj
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            disabled={!params.row.isAvailable}
            onClick={() => deleteDesk.mutate({ id: params.row.id || "" })}
          >
            Usuń
          </Button>
        </Box>
      ),
    },
  ];

  const { data, isLoading, error, refetch } = trpc.desks.getDesks.useQuery();
  if (isLoading) return <Alert severity="info">Trwa ładowanie danych</Alert>;
  if (error)
    return <Alert severity="error">Błąd podczas ładowania danych</Alert>;

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAdd()}
          style={{ width: "100%" }}
        >
          Dodaj biurko
        </Button>
      </Box>
      <DataGrid
        rows={data?.message || []}
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
      <AddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        refetch={refetch}
      ></AddModal>
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        row={selectedRow}
        refetch={refetch}
      />
    </Box>
  );
}
