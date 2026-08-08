import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="aspect-[3/4] bg-panel border border-line rounded-lg overflow-hidden mb-3">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <p className="text-xs font-mono uppercase tracking-wide text-muted mb-1">
        {product.category}
      </p>
      <h3 className="font-display text-lg text-bone leading-snug">{product.title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-bone">₹{product.price}</span>
        {hasDiscount && (
          <span className="text-muted line-through text-sm">₹{product.oldPrice}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
