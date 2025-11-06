// src/components/dashboard/DeviceControlCard.jsx
import React, { useState, useEffect } from "react";
import { Lightbulb, Fan, RotateCw, Power, PowerOff } from "lucide-react";
import { controlDevice } from "../../utils/api";

export default function DeviceControlCard() {
  const [greenLed, setGreenLed] = useState(false);
  const [blueLed, setBlueLed] = useState(false);
  const [servoDeg, setServoDeg] = useState(90);
  const [fan, setFan] = useState(false);

  // Send command in your exact format: { device: "xxx", state: value }
  const sendCommand = async (deviceName, stateValue) => {
    try {
      await controlDevice(deviceName, stateValue);
    } catch (err) {
      console.error("Control failed:", err);
    }
  };

  // Debounced API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      sendCommand("green", greenLed);
    }, 300);
    return () => clearTimeout(timer);
  }, [greenLed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sendCommand("blue", blueLed);
    }, 300);
    return () => clearTimeout(timer);
  }, [blueLed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sendCommand("servo", servoDeg);
    }, 300);
    return () => clearTimeout(timer);
  }, [servoDeg]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sendCommand("fan", fan);
    }, 300);
    return () => clearTimeout(timer);
  }, [fan]);

  const ToggleButton = ({ isOn, onToggle, label }) => (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${
          isOn
            ? "bg-green-500 text-white shadow-md"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
    >
      {isOn ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {/* Green LED */}
        <div className="bg-[#43E57E]/70 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#019f38]" />
            <span className="font-medium text-gray-800">Green LED</span>
          </div>
          <div className="mt-auto">
            <ToggleButton
              isOn={greenLed}
              onToggle={() => setGreenLed(!greenLed)}
              label={greenLed ? "ON" : "OFF"}
            />
          </div>
        </div>

        {/* Blue LED */}
        <div className="bg-[#89CFEB]/70 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-[#006891]" />
            <span className="font-medium text-gray-800">Blue LED</span>
          </div>
          <div className="mt-auto">
            <ToggleButton
              isOn={blueLed}
              onToggle={() => setBlueLed(!blueLed)}
              label={blueLed ? "ON" : "OFF"}
            />
          </div>
        </div>

        {/* Servo Motor */}
        <div className="bg-[#E7B008]/10 rounded-xl p-4 border border-[#E7B008]/30 sm:col-span-2 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <RotateCw className="w-5 h-5 text-[#E7B008]" />
            <span className="font-medium text-gray-800">Servo Motor</span>
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <span className="text-sm text-gray-600 w-10">0°</span>
            <input
              type="range"
              min="0"
              max="180"
              value={servoDeg}
              onChange={(e) => setServoDeg(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: "#E7B008" }}
            />
            <span className="text-sm font-semibold text-gray-800 w-12 text-right">
              {servoDeg}°
            </span>
          </div>
        </div>

        {/* Fan */}
        <div className="bg-[#E7B008]/50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Fan className="w-5 h-5 text-[#963801]" />
            <span className="font-medium text-gray-800">Fan</span>
          </div>
          <div className="mt-auto">
            <ToggleButton
              isOn={fan}
              onToggle={() => setFan(!fan)}
              label={fan ? "ON" : "OFF"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
