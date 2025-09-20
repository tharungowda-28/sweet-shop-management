// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import AdminPanel from "./pages/AdminPanel";
// import PrivateRoute from "./components/PrivateRoute";
// import Navbar from "./components/Navbar";



// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/admin"
//           element={
//             <PrivateRoute>
//               <AdminPanel />
//             </PrivateRoute>
//           }
//         />
//         <Route
//         path="/admin"
//         element={
//         <PrivateRoute adminOnly={true}>
//           <AdminPanel />
//         </PrivateRoute>
//         }
//         />

//       </Routes>
//     </Router>
//   );
// }

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const router = createBrowserRouter([
{
  path: "/",
  element: <Navbar />,
  children: [
    { index: true, element: <Home /> },   // 👈 default route
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    {
      path: "dashboard",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: "admin",
      element: (
        <PrivateRoute adminOnly={true}> 
          <AdminPanel />
        </PrivateRoute>
      ),
    },
  ],
},
]);

// export default function App() {
  
//   return <RouterProvider router={router} />;
// }
export default function App() {
  return (
    <>
      {/* <h1 className="text-6xl font-extrabold text-red-600 bg-yellow-200 p-6">
  Tailwind is Working?
</h1>
 */}

      <RouterProvider router={router} />
    </>
  );
}
