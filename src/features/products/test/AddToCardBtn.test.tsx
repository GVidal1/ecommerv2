import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCart } from '../components/AddToCartBtn';
import { useAppContext } from '../../../hooks/useAppContext';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../../hooks/useAppContext');

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 100,
  rating: 4.5,
  thumbnail: 'url',
  description: 'desc',
  category: 'cat',
  discountPercentage: 5.5,
  stock: 10,
  brand: 'br',
  images: [],
};

describe('<AddToCart />', () => {
  const mockAddProductToCart = vi.fn();
  const mockUpdateCartQuantity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar el botón "Agregar al Carrito" cuando la cantidad es 0', () => {
    (useAppContext as Mock).mockReturnValue({
      cart: [],
      addProductToCart: mockAddProductToCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });

    render(
      <AddToCart product={mockProduct}>
        <AddToCart.AddButton />
        <AddToCart.Controls />
      </AddToCart>
    );

    expect(screen.getByText('Agregar al Carrito')).toBeInTheDocument();
    expect(screen.queryByText('+')).not.toBeInTheDocument();
  });

  it('debe llamar a addProductToCart al hacer click en "Agregar"', () => {
    (useAppContext as Mock).mockReturnValue({
      cart: [],
      addProductToCart: mockAddProductToCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });

    render(
      <AddToCart product={mockProduct}>
        <AddToCart.AddButton />
      </AddToCart>
    );

    const btn = screen.getByText('Agregar al Carrito');
    fireEvent.click(btn);

    expect(mockAddProductToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('debe mostrar los controles cuando el producto está en el carrito', () => {
    (useAppContext as Mock).mockReturnValue({
      cart: [{ productId: 1, quantity: 3 }],
      addProductToCart: mockAddProductToCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });

    render(
      <AddToCart product={mockProduct}>
        <AddToCart.AddButton />
        <AddToCart.Controls />
      </AddToCart>
    );

    expect(screen.queryByText('Agregar al Carrito')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('debe incrementar la cantidad al hacer click en "+"', () => {
    (useAppContext as Mock).mockReturnValue({
      cart: [{ productId: 1, quantity: 2 }],
      addProductToCart: mockAddProductToCart,
      updateCartQuantity: mockUpdateCartQuantity,
    });

    render(
      <AddToCart product={mockProduct}>
        <AddToCart.Controls />
      </AddToCart>
    );

    const increaseBtn = screen.getByText('+');
    fireEvent.click(increaseBtn);

    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(mockProduct.id, 3);
  });
});
