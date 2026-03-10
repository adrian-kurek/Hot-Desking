import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
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

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

export default function AddModal({ open, onClose }: AddModalProps) {
  const [newName, setNewName] = React.useState("");
  const { refetch } = trpc.desks.getDesks.useQuery();

  const addDesk = trpc.desks.add.useMutation({
    onSuccess: () => {
      onClose();
      refetch();
    },
    onError: (error) => {
      return (
        <Alert severity="error">
          Błąd podczas dodawania biurka: {error.message}
        </Alert>
      );
    },
  });
  React.useEffect(() => {
    if (open) {
      setNewName("");
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold">
          Dodaj nowę biurko
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
          onClick={() => addDesk.mutate({ name: newName })}
        >
          Zapisz zmiany
        </Button>
      </Box>
    </Modal>
  );
}
