// src/pages/dashboard/dashboard.jsx
import React from "react";
import SensorChart from "../../components/dashboard/SensorChart";
import DeviceControlCard from "../../components/dashboard/DeviceControlCard";
import CurrentSensors from "../../components/dashboard/CurrentSensors";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Current Sensors */}
      <CurrentSensors />

      {/* Chart + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Temperature & Humidity
          </h3>
          <SensorChart interval={3000} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Device Controls
          </h3>
          <DeviceControlCard interval={3000} />
        </div>
      </div>
    </div>
  );
}
