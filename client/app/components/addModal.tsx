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
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
}

export default function AddModal({ open, onClose }: AddModalProps) {
  const [newName, setNewName] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const { refetch } = trpc.desks.getDesks.useQuery();

  const addDesk = trpc.desks.add.useMutation({
    onSuccess: () => {
      onClose();
      refetch();
    },
    onError: (error) => {
      const parsedErrorMsg = JSON.parse(error.message);
      setErrorMsg(parsedErrorMsg[0]["message"]);
    },
  });

  React.useEffect(() => {
    if (open) {
      setNewName("");
      setErrorMsg(null);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" fontWeight="bold">
          Dodaj nowę biurko
        </Typography>

        {errorMsg && (
          <Alert severity="error" onClose={() => setErrorMsg(null)}>
            Błąd podczas dodawania biurka: {errorMsg}
          </Alert>
        )}

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
          loading={addDesk.isPending}
          onClick={() => addDesk.mutate({ name: newName })}
        >
          Zapisz zmiany
        </Button>
      </Box>
    </Modal>
  );
}
