import React, { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  name: string;
  quantity: number;
  rate: number;
  total: number;
  gst: number;
}

interface Order {
  _id: string;
  user: string;
  date: string;
  products: Product[];
  totalAmount: number;
  totalGST: number;
}

const PrevOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("fetching orders")
      const userId = localStorage.getItem("id");
      if (!userId) return;

      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("in fetch")
        const response = await axios.get<Order[]>(
          `https://invoice-generator-app-ecommerce.vercel.app/api/orders?id=${localStorage.getItem(
            "id"
          )}`
        );
        console.log(response);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching previous orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
  <h1 className="text-3xl text-white mb-4">Previous Orders</h1>
  {orders.length > 0 ? (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <p className="text-white mb-2">
            <strong>Order ID:</strong> {order._id}
          </p>
          <p className="text-white mb-2">
            <strong>Date:</strong>{" "}
            {new Date(order.date).toLocaleDateString()}
          </p>
          <p className="text-white mb-2">
            <strong>Total Amount:</strong> {order.totalAmount.toFixed(2)}
          </p>
          <p className="text-white mb-2">
            <strong>Total GST:</strong> {order.totalGST.toFixed(2)}
          </p>
          <ul className="text-white">
            <strong>Products:</strong>
            {order.products.map((product, index) => (
              <li key={index} className="pl-4 list-disc">
                {product.name} - {product.quantity} x {product.rate.toFixed(2)} ={" "}
                {product.total.toFixed(2)} (GST: {product.gst.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-white">No previous orders found.</p>
  )}
</div>

  );
};

export default PrevOrders;
