
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div className="bg-gray-700 p-4 rounded shadow-md">
      <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
      <p className="text-gray-300 mb-2">{product.description}</p>
      <p className="text-gray-300 mb-2">Price: ${product.price}</p>
      <p className="text-gray-300 mb-2">Quantity: {product.quantity}</p>
      <div className="flex items-center">
        <button
          onClick={() => onRemoveFromCart(product._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={cartQuantity === 0}
        >
          -
        </button>
        <p className="mx-4 text-white">{cartQuantity}</p>
        <button
          onClick={() => onAddToCart(product._id)}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          disabled={cartQuantity >= product.quantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
