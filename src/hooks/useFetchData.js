import { useEffect, useState } from "react";
import { getSensorData } from "../utils/api";

export default function useFetchData(interval = 3000) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSensorData();

        // Normalize to array
        const incoming = Array.isArray(res) ? res : [res];

        // Parse and sort by time (ensures chronological order)
        const parsed = incoming
          .map((item) => ({
            ...item,
            parsedTime: new Date(item.time).getTime(),
          }))
          .sort((a, b) => a.parsedTime - b.parsedTime); // oldest → newest

        setData((prev) => {
          const combined = [...prev, ...parsed];
          // Keep only latest 10 by time
          return combined
            .sort((a, b) => a.parsedTime - b.parsedTime)
            .slice(-10)
            .map(({ parsedTime, ...rest }) => rest); // drop helper
        });
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, interval);
    return () => clearInterval(id);
  }, [interval]);

  return data; // → array of up to 10 latest records, oldest first
}
