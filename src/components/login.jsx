// Login.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSupabaseClient } from "@supabase/auth-helpers-react"; // This is the right way!
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from "./SignInWithGoogle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = useSupabaseClient(); // Correct way inside components
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!", { position: "top-center" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-2xl p-8 space-y-6"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h3>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 font-semibold text-white rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Register here
            </a>
          </p>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In */}
          <SignInWithGoogle disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default Login;
