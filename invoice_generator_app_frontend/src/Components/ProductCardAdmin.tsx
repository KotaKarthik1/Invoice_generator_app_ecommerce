import React, { useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  onProductUpdate: (productId: string, newQuantity: number) => void;
  onProductRemove: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductUpdate,
  onProductRemove,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedQuantity, setEditedQuantity] = useState<number>(
    product.quantity
  );
  const [error, setError] = useState<string>("");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedQuantity(product.quantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedQuantity(parseInt(e.target.value, 10) || 0);
  };

  const handleSaveClick = async () => {
    if (editedQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
        const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.patch(`https://invoice-generator-app-ecommerce.vercel.app/api/editProductAdmin/${product._id}?id=${localStorage.getItem(
        "id"
      )}`, {
        quantity: editedQuantity,
      });
      onProductUpdate(product._id, editedQuantity);
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Could not update product. Please try again later.");
    }
  };

  const handleRemoveClick = async () => {
    try {
        const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(`http://localhost:3000/api/removeProductAdmin/${product._id}?id=${localStorage.getItem(
        "id"
      )}`);
      onProductRemove(product._id);
    } catch (error) {
      console.error("Error removing product:", error);
      setError("Could not remove product. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded shadow-md w-full">
      <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
      <p className="text-gray-300 mb-2">{product.description}</p>
      <p className="text-gray-300 mb-2">Price: ${product.price}</p>
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="number"
            value={editedQuantity}
            onChange={handleQuantityChange}
            className="w-20 px-3 py-2 rounded focus:outline-none text-black mr-2"
          />
          <button
            onClick={handleSaveClick}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <p className="text-gray-300 mb-4">Quantity: {product.quantity}</p>
          <button
            onClick={handleEditClick}
            className="ml-auto bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </button>
        </div>
      )}
      <button
        onClick={handleRemoveClick}
        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Remove
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ProductCard;
