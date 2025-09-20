// import { Navigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import API from "../services/api";

// export default function PrivateRoute({ children, adminOnly = false }) {
//   const token = localStorage.getItem("access");
//   const [isAdmin, setIsAdmin] = useState(null);

//   useEffect(() => {
//     if (token && adminOnly) {
//       API.get("/api/sweets/") // any auth-protected endpoint
//         .then((res) => {
//           // Django marks admin users with is_staff/is_superuser
//           const user = JSON.parse(atob(token.split(".")[1])); // decode JWT
//           setIsAdmin(user.is_superuser || user.is_staff);
//         })
//         .catch(() => setIsAdmin(false));
//     }
//   }, [token, adminOnly]);

//   if (!token) return <Navigate to="/login" />;
//   if (adminOnly && isAdmin === false) return <Navigate to="/dashboard" />;
//   return children;
// }
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("access");

  // not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // admin-only route → check JWT payload
  if (adminOnly) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!(payload.is_superuser || payload.is_staff)) {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
