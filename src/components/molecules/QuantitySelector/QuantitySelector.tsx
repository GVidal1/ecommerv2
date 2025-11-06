import { useState } from "react";
import "./QuantitySelector.css";

interface QuantitySelectorProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
}

export function QuantitySelector({
  initialValue = 1,
  min = 1,
  max = 10,
  onChange,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialValue);

  const handleDecrease = () => {
    if (quantity > min) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange?.(newQuantity);
    }
  };

  return (
    <div className="quantity-selector">
      <label className="quantity-label">Cantidad:</label>
      <div className="quantity-controls">
        <button
          type="button"
          className="quantity-btn quantity-minus"
          onClick={handleDecrease}
          disabled={quantity <= min}
        >
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button
          type="button"
          className="quantity-btn quantity-plus"
          onClick={handleIncrease}
          disabled={quantity >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
