import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Home, Settings, User2Icon } from "lucide-react";
import { LucideDivideCircle, LogOutIcon } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Dashboard" },
  { to: "/devices", icon: LucideDivideCircle, label: "Devices" },
  { to: "/profile", icon: User2Icon, label: "Profile" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-20 lg:w-64 bg-white shadow-sm p-4 flex flex-col h-full min-h-screen">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Home className="w-6 h-6 text-white" />
        </div>
        <span className="hidden lg:block font-bold text-xl text-gray-800">
          SmartHome
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all group"
          >
            <item.icon className="w-5 h-5" />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-gray-300 pt-4 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
