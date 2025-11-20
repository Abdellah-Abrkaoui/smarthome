// src/pages/dashboard/profile.jsx
import React, { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import Spinner from "../../components/Spinner";

function Profile() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadProfile() {
      // Step 1: Try to fetch existing profile from 'users' table
      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name, photo, email")
        .eq("id", user.id)
        .single();

      // Step 2: If no profile exists (PGRST116 = no rows returned)
      if (!data || (error && error.code === "PGRST116")) {
        const meta = user.user_metadata || {}; // Correct key: user_metadata

        const firstName =
          meta.first_name || meta.given_name || meta.name?.split(" ")[0] || "";

        const lastName =
          meta.last_name ||
          meta.family_name ||
          meta.name?.split(" ").slice(1).join(" ") ||
          "";

        const photo = meta.picture || meta.avatar_url || null;

        // Insert new profile with correct column names
        const { error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            photo: photo,
          })
          .single();

        if (insertError && insertError.code !== "23505") {
          // 23505 = duplicate key (already exists)
          console.error("Failed to create profile:", insertError);
        }

        // Use the freshly created/fallback data
        setProfile({
          first_name: firstName,
          last_name: lastName,
          photo,
          email: user.email,
        });
      } else if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        // Successfully fetched from DB
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" color="text-purple-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-xl text-gray-600">
        Please log in to view your profile.
      </div>
    );
  }

  // Final display values (fallback chain)
  const firstName = profile?.first_name || "User";
  const lastName = profile?.last_name || "";
  const fullName =
    `${firstName} ${lastName}`.trim() || user.email.split("@")[0];
  const photoUrl = profile?.photo || "/avatar.avif";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        My Profile
      </h1>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-10 text-center">
          <div className="relative inline-block">
            <img
              src={photoUrl}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-8 border-white shadow-2xl"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
            {user.confirmed_at && (
              <div className="absolute bottom-4 right-4 bg-green-500 text-white p-2 rounded-full text-xs font-bold">
                Verified
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mt-6">{fullName}</h2>
          <p className="text-white/80 text-lg">{user.email}</p>
        </div>

        {/* Details */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 font-medium">First Name</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {firstName || "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500 font-medium">Last Name</p>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {lastName || "—"}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500 font-medium">Email Address</p>
            <p className="text-xl font-medium text-gray-800 mt-1">
              {user.email}
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500 font-medium">User ID (UID)</p>
            <p className="text-sm font-mono text-gray-700 mt-2 break-all bg-white p-3 rounded-lg">
              {user.id}
            </p>
          </div>
          <div className="text-center pt-6">
            <p className="text-sm text-gray-500">
              Logged in via:{" "}
              <span className="font-medium capitalize">
                {user.app_metadata?.provider || "email"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
