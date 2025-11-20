// import React from "react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth, db } from "../components/firebase";
// import { toast } from "react-toastify";
// import { setDoc, doc } from "firebase/firestore";

// function SignInWithGoogle() {
//   const googleLogin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       if (user) {
//         await setDoc(doc(db, "Users", user.uid), {
//           email: user.email,
//           firstName: user.displayName,
//           photo: user.photoURL, // ✅ This is the user's Google photo
//           lastName: "",
//         });

//         toast.success("User logged in successfully", {
//           position: "top-center",
//         });

//         window.location.href = "/dashboard";
//       }
//     } catch (error) {
//       console.error("Error during Google login:", error);
//       toast.error("Failed to sign in with Google");
//     }
//   };

//   return (
//     <div className="text-center">
//       <div
//         style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
//         onClick={googleLogin}
//       >
//         {/* Use a real Google logo button (optional) */}
//         <img
//           src="https://developers.google.com/identity/images/g-logo.png"
//           alt="Sign in with Google"
//           width="50"
//         />
//       </div>
//     </div>
//   );
// }

// export default SignInWithGoogle;

import React from "react";
import { supabase } from "../supabase/supabaseClient";

function SignInWithGoogle() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full py-2.5 bg-red-500 text-white rounded-lg font-medium"
    >
      Continue with Google
    </button>
  );
}

export default SignInWithGoogle;
