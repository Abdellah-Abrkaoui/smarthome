// src/components/dashboard/SensorChartMUI.jsx
import React from "react";
import Box from "@mui/material/Box";
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import useFetchData from "../../hooks/useFetchData";

export default function SensorChartMUI({ interval = 3000 }) {
  const data = useFetchData(interval) ?? [];

  const sorted = React.useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
  }, [data]);

  const latest10 = sorted.slice(-10);

  const timeLabels = latest10.map((d) =>
    new Date(d.time).toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const tempSeries = latest10.map((d) => d.temperature ?? null);
  const humSeries = latest10.map((d) => d.humidity ?? null);

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box component="p" sx={{ fontSize: 12, color: "text.secondary" }}>
          Live update every {interval / 1000}s • Last {latest10.length} readings
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: 320 }}>
        <LineChart
          series={[
            {
              data: tempSeries,
              label: "Temperature (°C)",
              yAxisId: "leftAxisId",
              color: "#8884d8",
              curve: "monotone",
            },
            {
              data: humSeries,
              label: "Humidity (%)",
              yAxisId: "rightAxisId",
              color: "#82ca9d",
              curve: "monotone",
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: timeLabels,
              tickLabelStyle: { fontSize: 11 },
            },
          ]}
          yAxis={[
            { id: "leftAxisId", width: 60 },
            { id: "rightAxisId", position: "right" },
          ]}
          margin={{ left: 50, right: 60, top: 10, bottom: 40 }}
          sx={{
            [`.${lineElementClasses.root}`]: { strokeWidth: 2.5 },
            [`.${lineElementClasses.root}[data-series="0"]`]: {
              strokeDasharray: "0",
            },
            [`.${lineElementClasses.root}[data-series="1"]`]: {
              strokeDasharray: "5 3",
            },
            [`.${markElementClasses.root}`]: {
              fill: "#fff",
              strokeWidth: 2,
            },
            [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]:
              { fill: "#fff" },
            [`& .${markElementClasses.highlighted}`]: {
              stroke: "none",
              r: 6,
            },
            "--Charts-grid-line-color": "#f0f0f0",
          }}
          slotProps={{
            legend: {
              position: { vertical: "top", horizontal: "middle" },
              itemMarkWidth: 16,
              itemMarkHeight: 3,
              markGap: 6,
              itemGap: 12,
            },
          }}
        />
      </Box>
    </>
  );
}
