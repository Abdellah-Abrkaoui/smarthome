# 🌐 Smart Home Project - [🔗 Live Project](https://smart-homee.netlify.app/)

**IoT | Cloud Computing | Networking**

A full-stack **Smart Home Dashboard** built with **React (Vite)** and **Firebase**, allowing real-time monitoring and control of smart devices from anywhere.

---

## 🚀 Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Abdellah-Abrkaoui/smarthome.git
cd smarthome
npm install
```

### 2️⃣ Firebase Setup

Go to the Firebase Console
and create a new project.

✅ Enable required services:

Authentication: Email/Password + Google Sign-In

Firestore Database: Start in test mode

⚙️ Add Firebase Config

Create a new file: src/firebase.js

```bash
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Then open 👉 http://localhost:5173


### ESP32 Setup (PlatformIO + secrets.ini)

We store WiFi & MQTT credentials in a separate secrets.ini file

Create secrets.ini:
```ini
[env:esp32dev]
build_flags =
    -D WIFI_SSID=\"YourWiFi\"
    -D WIFI_PASS=\"YourPassword\"
    -D MQTT_SERVER=\"your-mqtt-server\"
    -D MQTT_USER=\"your-user\"
    -D MQTT_PASS=\"your-pass\"
    -D MQTT_PORT=8883
```

In platformio.ini add:
```ini
extra_configs = secrets.ini
```

➡️ This loads your private values safely without pushing them to GitHub.

### 🖥️ Wokwi Simulation in VSCode

You can simulate the ESP32 hardware directly in VSCode using the **Wokwi extension**. Install the Wokwi plugin, open your project, and run the `.pio` PlatformIO code in a virtual ESP32 environment. This allows testing sensors, MQTT, and actuators before uploading to a real device.


### 🌍 Deployment

This project is hosted on Netlify.
🔗 Live Demo: https://smart-homee.netlify.app

If you’re using React Router, add this file in your public/ folder:

📄 \_redirects

```bash
/*    /index.html   200
```

### ⚙️ Features

🔐 Firebase Authentication (Email + Google Sign-In)

🌡️ Real-time sensor monitoring (Temperature, Humidity, etc.)

💡 Device control (LEDs, Servo Motor, etc.)

📊 Interactive dashboard with charts

☁️ Cloud-based IoT architecture

📱 Responsive UI with Tailwind CSS
