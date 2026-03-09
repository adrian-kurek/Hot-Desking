import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import type { deskRow } from "./desksDataGrid";
import { Alert, Button, TextField } from "@mui/material";
import React from "react";
import { trpc } from "~/trpc";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  color: "black",
  boxShadow: 24,
  p: 4,
};

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  row: deskRow | null;
  refetch: () => void;
}

export default function EditModal({ open, onClose, row }: EditModalProps) {
  const [newName, setNewName] = React.useState(row?.name || "");
  const { refetch } = trpc.desks.getDesks.useQuery();
  const updateDesk = trpc.desks.updateDesk.useMutation({
    onSuccess: () => {
      refetch();
      onClose();
    },
    onError: (error) => {
      return (
        <Alert severity="error">
          Błąd podczas próby aktualizowania nazwy biurka: {error.message}
        </Alert>
      );
    },
  });



  React.useEffect(() => {
    if (open) {
      setNewName(row?.name || "");
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold">
          Edytuj nazwę biurka
        </Typography>

        <TextField
          label="Nazwa biurka"
          placeholder="wprowadź nazwę biurka"
          variant="outlined"
          fullWidth
          size="small"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() =>
            updateDesk.mutate({ id: row?.id || "", name: newName })
          }
        >
          Zapisz zmiany
        </Button>
      </Box>
    </Modal>
  );
}
