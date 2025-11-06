import { type Product } from "../../../context/AppContext";
import { Button } from "../../atoms/Button/Button";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (productId: number) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        {product.discountPercentage > 0 && (
          <span className="product-card-discount">
            -{product.discountPercentage}%
          </span>
        )}
      </div>
      <div className="product-card-content">
        <h3 className="product-card-title">{product.title}</h3>
        <div className="product-card-rating">{product.rating} ⭐</div>
        <p className="product-card-description">
          {product.description.substring(0, 80)}...
        </p>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price}</span>
          <Button variant="primary" onClick={() => onViewDetails?.(product.id)}>
            Ver detalles
          </Button>
        </div>
      </div>
    </article>
  );
}
