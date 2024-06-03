import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import AddProductList from "./AddProductList";
import ProductCard from "./ProductCardAdmin";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { logout } = useAuth();
  const navigate=useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `http://localhost:3000/api/getProductsAdmin?id=${localStorage.getItem(
          "id"
        )}`
      );
      console.log(response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleProductUpdate = (productId: string, newQuantity: number) => {
    setProducts(
      products.map((product) =>
        product._id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );
  };

  const handleProductRemove = (productId: string) => {
    setProducts(products.filter((product) => product._id !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 py-6">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Products
          </h1>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-l focus:outline-none bg-gray-700 text-white"
            />
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline"
              onClick={() => navigate('/AddProductList')}
            >
              + Add
            </button>
          </div>
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={logout}
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onProductUpdate={handleProductUpdate}
              onProductRemove={handleProductRemove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProductList;
