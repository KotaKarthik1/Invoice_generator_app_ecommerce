import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import Register from "./Components/Register";
import GeneratedPdf from "./Components/GeneratedPdf";
import AddProduct from "./Components/AddProduct";
import AddProductList from "./Components/AddProductList";
import { useAuth, AuthProvider } from "./Context/AuthContext";
import AdminProductList from "./Components/AdminProductList";
import Cart from "./Components/Cart";
import PrevOrders from "./Components/PrevOrders";

function Welcomepage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">Welcome to Invoice Generator App</h1>
      <button 
        type="button" 
        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAdmin } = useAuth();
  return isLoggedIn && !isAdmin ? children : <Navigate to="/login" />;
}

function ProtectedRouteAdmin({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAdmin } = useAuth();
  console.log("checking the admin in protected ", isAdmin);
  return isLoggedIn && isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/GeneratedPdf" element={<ProtectedRoute><GeneratedPdf /></ProtectedRoute>} />
          <Route path="/AddProduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/prevorders" element={<ProtectedRoute><PrevOrders/></ProtectedRoute>} />
          <Route path="/AddProductList" element={<ProtectedRouteAdmin><AddProductList /></ProtectedRouteAdmin>} />
          <Route path="/AdminProductList" element={<ProtectedRouteAdmin><AdminProductList/></ProtectedRouteAdmin>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
