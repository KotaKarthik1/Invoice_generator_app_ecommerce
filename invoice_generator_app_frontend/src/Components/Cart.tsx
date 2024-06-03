import { useNavigate } from "react-router-dom";

function Cart({ cart, products }) {
  const navigate = useNavigate();

  const handleGeneratePdf = () => {
    navigate("/generatePdf");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-6 rounded shadow-md w-full max-w-xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
          Cart
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {Object.keys(cart).map((productId) => {
            const product = products.find((p) => p._id === productId);
            if (!product) return null;
            return (
              <div
                key={product._id}
                className="bg-gray-700 p-4 rounded shadow-md"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 mb-2">
                  Quantity: {cart[product._id]}
                </p>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleGeneratePdf}
          className="mt-4 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default Cart;
