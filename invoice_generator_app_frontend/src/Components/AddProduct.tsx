import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "./UserProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCartDetails, setShowCartDetails] = useState<boolean>(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `https://invoice-generator-app-ecommerce.vercel.app/api/getProductsUser?id=${localStorage.getItem("id")}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId] += 1;
      } else {
        newCart[productId] = 1;
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId]) {
        newCart[productId] -= 1;
        if (newCart[productId] === 0) {
          delete newCart[productId];
        }
      }
      return newCart;
    });
  };

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = products.reduce((total, product) => {
    const quantity = cart[product._id] || 0;
    return total + product.price * quantity;
  }, 0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //invoice
  const handleGeneratePDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://invoice-generator-app-ecommerce.vercel.app/api/generateInvoice?id=${localStorage.getItem("id")}`,
        { cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for downloading files
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      setCart({});
      fetchProducts();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <button
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={logout}
      >
        Logout
      </button>

      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-5xl">
        {/* Header Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Products
          </h1>
          <div className="flex flex-col md:flex-row items-center w-full md:w-auto space-y-2 md:space-y-0">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-l focus:outline-none bg-gray-700 text-white w-full md:w-auto"
            />
            {/* Buttons and Cart */}
            <div className="flex items-center md:space-x-4 mt-2 md:mt-0">
              <button
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  navigate("/prevorders");
                }}
              >
                Previous Orders
              </button>
              {/* Cart Button */}
              <div
                className="relative"
                onMouseEnter={() => setShowCartDetails(true)}
                onMouseLeave={() => setShowCartDetails(false)}
              >
                <button className="bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cart ({cartItemsCount})
                </button>
                {showCartDetails && (
                  <div className="absolute top-0 right-0 bg-white p-5 shadow-lg rounded-lg border border-gray-300">
                    {Object.keys(cart).length > 0 ? (
                      <>
                        <ul className="mb-4">
                          {Object.entries(cart).map(([productId, quantity]) => {
                            const product = products.find(
                              (p) => p._id === productId
                            );
                            return (
                              <li
                                key={productId}
                                className="flex justify-between items-center py-3"
                              >
                                <div>{product?.name} </div>
                                <div className="flex items-center">
                                  <p className="mr-2 m-2">Quantity: {quantity}</p>
                                  <p>
                                    Total:{" "}
                                    {product?.price &&
                                      quantity &&
                                      (product.price * quantity).toFixed(2)}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <p className="p-2">
                          Total Amount : {cartTotalPrice.toFixed(2)}
                        </p>
                        <button
                          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          onClick={handleGeneratePDF}
                        >
                          Generate PDF
                        </button>
                      </>
                    ) : (
                      <p>Your cart is empty.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
       

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              cartQuantity={cart[product._id] || 0}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
