// src/components/register.jsx
import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignInWithGoogle from "./SignInWithGoogle";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fname || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: fname.trim(),
            last_name: lname.trim(),
          },
          emailRedirectTo: window.location.origin + "/dashboard",
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("No user returned after signup");

      // 2. THIS IS THE FIX: Use upsert + force schema refresh
      const { error: upsertError } = await supabase.from("users").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          first_name: fname.trim(),
          last_name: lname.trim() || null,
          photo: null,
        },
        { onConflict: "id" } // important!
      );

      // Optional: Force a tiny select to warm up schema cache (fixes "column not found" bug)
      if (!upsertError) {
        await supabase
          .from("users")
          .select("id")
          .eq("id", data.user.id)
          .single()
          .then();
      }

      if (upsertError) {
        // Only show real errors (ignore duplicate if somehow triggered)
        if (upsertError.code !== "23505") {
          console.error("Upsert failed:", upsertError);
          throw upsertError;
        }
      }

      toast.success("Account created!", {
        position: "top-center",
        autoClose: 6000,
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Failed to create account", {
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
          onSubmit={handleRegister}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800">
            Create Account
          </h3>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="John"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 font-bold text-white rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </a>
          </p>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">
              Or continue with
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <SignInWithGoogle disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default Register;
