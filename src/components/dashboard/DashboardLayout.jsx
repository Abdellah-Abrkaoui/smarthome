// src/components/dashboard/DashboardLayout.jsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Sidebar – fixed width, full height */}
      <Sidebar />

      {/* Main area – takes the rest of the space */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Scrollable content area */}
        <section className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </section>
      </main>
    </div>
  );
}
