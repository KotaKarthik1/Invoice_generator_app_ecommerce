import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

function AddProductList() {
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState(0);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const handleAddProduct = async () => {
    if (!newProductName || !newProductPrice || newProductQuantity < 0) {
      setError('Please fill in all fields correctly.');
      return;
    }

    try {
      const response = await axios.post(`https://invoice-generator-app-ecommerce.vercel.app/api/addProductsToList?id=${localStorage.getItem(
        "id"
      )}`, {
        name: newProductName,
        description: newProductDescription,
        price: parseFloat(newProductPrice),
        quantity: newProductQuantity
      });

      // Clear input fields after successful addition
      setNewProductName('');
      setNewProductDescription('');
      setNewProductPrice('');
      setNewProductQuantity(0);
      setError('');
      console.log('Product added:', response.data); // Log added product
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Could not add product. Please try again later.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative">
      
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </button>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">Add Product</h1>
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Add a new product</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="text"
            placeholder="Product Name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="w-full px-3 py-2 rounded mb-2 focus:outline-none bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Product Description"
            value={newProductDescription}
            onChange={(e) => setNewProductDescription(e.target.value)}
            className="w-full px-3 py-2 rounded mb-2 focus:outline-none bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Product Price"
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            className="w-full px-3 py-2 rounded mb-2 focus:outline-none bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="Product Quantity"
            value={newProductQuantity}
            onChange={(e) => setNewProductQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded mb-2 focus:outline-none bg-gray-700 text-white"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProductList;
