import type { Route } from "./+types/desks";
import type { GridColDef } from "@mui/x-data-grid";
import ButtonAppBar from "~/components/appBar";
import { DesksDataGrid } from "~/components/desksDataGrid";
import { Box } from "@mui/material";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "System zarządzania rezerwacją biurek" },
    { name: "description", content: "Witaj w systemie rezerwacji biurek" },
  ];
}

export default function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
      }}
    >
      <ButtonAppBar />
      <DesksDataGrid />
    </Box>
  );
}
