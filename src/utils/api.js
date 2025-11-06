const BASE_URL = "https://team-jelixe-jelixe9415-86fd3327.flowfuse.cloud/api";

export async function getSensorData() {
  const res = await fetch(`${BASE_URL}/data`);
  return res.json();
}

export async function controlDevice(device, state) {
  const res = await fetch(`${BASE_URL}/controlle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device, state }),
  });
  return res.json();
}
