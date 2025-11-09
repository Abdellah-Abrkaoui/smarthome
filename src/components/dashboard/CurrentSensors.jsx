// src/components/dashboard/CurrentSensors.jsx
import React from "react";
import { Thermometer, Droplets, Eye, AlertCircle } from "lucide-react";
import useFetchData from "../../hooks/useFetchData";

export default function CurrentSensors() {
  const data = useFetchData(3000);
  const latest = data.length > 0 ? data[data.length - 1] : {};

  const Card = ({
    title,
    value,
    unit,
    icon: Icon,
    bgGradient,
    textColor = "text-white",
  }) => (
    <div
      className={`rounded-xl shadow-sm p-4 flex items-center gap-3 ${bgGradient} backdrop-blur-sm`}
    >
      <div className="p-2 rounded-lg bg-white/20">
        <Icon className={`w-5 h-5 ${textColor}`} />
      </div>
      <div>
        <p className={`text-xs font-medium ${textColor} opacity-90`}>{title}</p>
        <p className={`text-lg font-bold ${textColor}`}>
          {value !== undefined && value !== null ? `${value}${unit}` : "—"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Temperature */}
      <Card
        title="Temperature"
        value={latest.temperature?.toFixed(1)}
        unit=" °C"
        icon={Thermometer}
        bgGradient="bg-[#FF7E5F]/90 to-[#FD3A69]/80"
        textColor="text-white"
      />
      {/* Humidity */}
      <Card
        title="Humidity"
        value={latest.humidity?.toFixed(0)}
        unit=" %"
        icon={Droplets}
        bgGradient="bg-[#7C3BED]/80"
        textColor="text-white"
      />
      {/* Motion */}
      <Card
        title="Motion"
        value={latest.motion ? "Detected" : "No Motion"}
        unit=""
        icon={Eye}
        bgGradient={
          latest.motion
            ? "bg-gradient-to-br from-red-500 to-red-600"
            : "bg-gradient-to-br from-green-500 to-green-600"
        }
        textColor="text-white"
      />
      {/* Gas */}
      <Card
        title="Gas"
        value={latest.gas > 250 ? "Detected" : "Safe"}
        unit=""
        icon={AlertCircle}
        bgGradient={
          latest.gas > 250
            ? "bg-gradient-to-br from-orange-500 to-red-500"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        }
        textColor="text-white"
      />
    </div>
  );
}
