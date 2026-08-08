import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios.js";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0].size);
      })
      .catch((err) => setError(err.response?.data?.message || "Product not found"));
  }, [id]);

  const handleWishlist = async () => {
    if (!user) {
      setMessage("Sign in to save items to your wishlist.");
      return;
    }
    try {
      await api.post(`/wishlist/${id}`);
      setMessage("Added to wishlist.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-ink text-bone">
        <Navbar />
        <p className="max-w-6xl mx-auto px-6 py-16 text-rustLight">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ink text-bone">
        <Navbar />
        <p className="max-w-6xl mx-auto px-6 py-16 text-muted">Loading…</p>
      </div>
    );
  }

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const currentStock = product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;

  return (
    <div className="min-h-screen bg-ink text-bone">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/" className="text-xs font-mono uppercase text-muted hover:text-bone">
          ← Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mt-6">
          <div className="aspect-[3/4] bg-panel border border-line rounded-lg overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-muted mb-2">
              {product.category} / {product.subCategory}
            </p>
            <h1 className="font-display text-4xl mb-4">{product.title}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl text-bone">₹{product.price}</span>
              {hasDiscount && (
                <span className="text-muted line-through">₹{product.oldPrice}</span>
              )}
            </div>
            <p className="text-muted mb-8">{product.description}</p>

            <div className="mb-6">
              <p className="text-xs font-mono uppercase tracking-wide text-muted mb-2">
                Size
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`px-4 py-2 rounded border text-sm transition-colors ${
                      selectedSize === s.size
                        ? "border-rust text-rustLight bg-rust/10"
                        : "border-line text-muted hover:text-bone"
                    } ${s.stock === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
              </p>
            </div>

            <div className="mb-8">
              <p className="text-xs font-mono uppercase tracking-wide text-muted mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 border border-line rounded text-bone hover:border-rust"
                >
                  −
                </button>
                <span className="w-8 text-center font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="w-9 h-9 border border-line rounded text-bone hover:border-rust"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                disabled={currentStock === 0}
                className="flex-1 bg-rust hover:bg-rustLight text-ink font-medium rounded px-6 py-3 transition-colors disabled:opacity-40"
              >
                Add to cart
              </button>
              <button
                onClick={handleWishlist}
                className="border border-line hover:border-rust rounded px-6 py-3 text-sm transition-colors"
              >
                Wishlist
              </button>
            </div>

            {message && <p className="text-sm text-rustLight mt-4">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
