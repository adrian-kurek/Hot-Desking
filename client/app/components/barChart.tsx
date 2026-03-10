import { Alert } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { trpc } from "~/trpc";

export default function BarChartOfDesks() {
  const { data, isLoading, error } = trpc.desks.getDesks.useQuery();
  if (isLoading) return <Alert severity="info">Trwa ładowanie danych</Alert>;
  if (error)
    return <Alert severity="error">Błąd podczas ładowania danych</Alert>;
  const desks = data || [];
  let wolne = 0;
  for (const desk of desks) {
    if (desk.isAvailable) wolne++;
  }

  const zajete = desks.length - wolne;

  return (
    <BarChart
      style={{ background: "white" }}
      xAxis={[
        {
          data: ["Wolne", "Zajęte"],
          colorMap: {
            type: "ordinal",
            colors: ["#0d6efd", "#ef4444"],
          },
        },
      ]}
      series={[{ data: [wolne, zajete] }]}
      height={500}
    />
  );
}
