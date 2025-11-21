# 🌐 Smart Home Project - [Live Project](https://lightyellow-hyena-946061.hostingersite.com)

**IoT | Cloud Computing | Networking | Real-time Systems**

A modern full-stack **Smart Home Dashboard** built with **React + Vite** and powered by **Supabase** – featuring real-time sensor monitoring, secure authentication, and remote device control from anywhere in the world.

---

## Features

- Secure Authentication (Email/Password + Google Sign-In)
- Real-time Data Sync via Supabase Realtime
- Temperature, Humidity, Motion & Gas sensors
- Remote control: LEDs, Servo Motor
- Beautiful responsive dashboard with live charts
- Built with React, Vite, Tailwind CSS
- ESP32 firmware (PlatformIO) with secure MQTT over TLS

---

## Getting Started

### 1. Clone & Install Frontend Dependencies

```bash
git clone https://github.com/Abdellah-Abrkaoui/smarthome.git
cd smarthome
npm install
```

### 2. Supabase Setup

- Go to https://supabase.com and create a new project
- Wait for your project to be ready (~2 minutes)
- Go to Settings → API and copy:URL and anon public key
- Create .env file in the project root:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. Initialize Supabase Client

- Your src/supabaseClient.js should look like this:

```bash
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```bash
Tip: Enable Email/Password and Google OAuth in Supabase → Authentication → Providers
```

### 4. Run Development Server

- npm run dev
  Open → http://localhost:5173

### 5. ESP32 Setup (PlatformIO + secrets.ini)

- Keep your credentials safe using secrets.ini:
- Create secrets.ini:

```bash
ini[env:esp32dev]
build_flags =
    -D WIFI_SSID_ENV=\"YourWiFiName\"
    -D WIFI_PASS_ENV=\"YourWiFiPassword\"
    -D MQTT_SERVER=\"your-mqtt-broker.com\"
    -D MQTT_PORT_ENV=8883
    -D MQTT_USER_ENV=\"your-mqtt-user\"
    -D MQTT_PASS_ENV=\"your-mqtt-password\"
```

In platformio.ini add:

```bash
iniextra_configs = secrets.ini
```

This keeps secrets out of GitHub!

### 6. Wokwi Simulation in VS Code

- Test your ESP32 code without hardware!
- Install the Wokwi VS Code extension
- Add wokwi.toml to your project root (example provided in repo)
- Press F1 → Wokwi: Start Simulator

### 7. Deployment

- Currently hosted on Hostinger
- [Live Demo](https://lightyellow-hyena-946061.hostingersite.com)

### 8. Contributing

- Contributions are welcome! Feel free to:

1. Open issues
2. Submit pull requests
3. Improve UI/UX
4. Add new sensors or features
