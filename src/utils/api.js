const BASE_URL =
  "https://team-camone-fantastu-camone7344-fa457885.flowfuse.cloud/api";

export async function getSensorData() {
  const res = await fetch(`${BASE_URL}/data`);
  console.log(res);
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
