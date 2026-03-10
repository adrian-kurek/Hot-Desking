import type { Route } from "./+types/desks";
import { DesksDataGrid } from "~/components/desksDataGrid";
import { Box } from "@mui/material";
import TopBar from "~/components/appBar";
import BarChartOfDesks from "~/components/barChart";

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
      <TopBar />
      <DesksDataGrid />
      <BarChartOfDesks />
    </Box>
  );
}
