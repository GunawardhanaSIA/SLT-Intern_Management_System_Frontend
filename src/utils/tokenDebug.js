import { jwtDecode } from "jwt-decode";

// Debug utility to inspect JWT token
export function debugToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found in localStorage");
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("🔍 JWT Token Debug Information:");
    console.log("📋 Full decoded token:", decoded);
    console.log("👤 Subject (email):", decoded.sub);
    console.log("🎭 Role claim:", decoded.role);
    console.log("🆔 User ID:", decoded.user_id);
    console.log("⏰ Issued at:", new Date(decoded.iat * 1000));
    console.log("⏰ Expires at:", new Date(decoded.exp * 1000));
    console.log("⚡ Is expired:", new Date() > new Date(decoded.exp * 1000));

    // Check if role matches expected values
    const expectedRoles = ["Intern", "Supervisor", "Admin"];
    const isValidRole = expectedRoles.includes(decoded.role);
    console.log("✅ Valid role:", isValidRole);

    if (!isValidRole) {
      console.log("⚠️  Invalid role detected. Expected one of:", expectedRoles);
    }

    return decoded;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return null;
  }
}

// Call this function in the browser console to debug your token
console.log(
  "🛠️  Token debug utility loaded. Call debugToken() to inspect your JWT token."
);
