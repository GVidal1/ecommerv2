import { render, screen, fireEvent } from '@testing-library/react';
import { ProductInCart } from '../components/ProductInCart';
import { useAppContext } from '../../../hooks/useAppContext';
import { describe, test, expect, vi, type Mock, beforeEach } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

const mockItem = {
  productId: 101,
  id: 1,
  title: 'Producto Test',
  price: 100,
  quantity: 2,
  thumbnail: 'img-url.jpg',
  description: 'Descripción del producto',
  discountPercentage: 10,
  stock: 50,
  category: 'test',
  rating: 5,
  brand: 'Brand',
  images: [],
};

describe('<ProductInCart />', () => {
  const mockUpdateCartQuantity = vi.fn();
  const mockRemoveProductFromCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAppContext as Mock).mockReturnValue({
      updateCartQuantity: mockUpdateCartQuantity,
      removeProductFromCart: mockRemoveProductFromCart,
    });
  });

  test('debe renderizar correctamente la información básica del producto', () => {
    render(<ProductInCart item={mockItem} />);

    expect(screen.getByText('Producto Test')).toBeInTheDocument();
    expect(screen.getByText('Descripción del producto')).toBeInTheDocument();

    // Imagen
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockItem.thumbnail);
    expect(img).toHaveAttribute('alt', mockItem.title);

    expect(
      screen.getByText(`Precio unitario: $${mockItem.price.toFixed(2)}`)
    ).toBeInTheDocument();
  });

  test('debe calcular y mostrar el total correcto con descuento aplicado', () => {
    render(<ProductInCart item={mockItem} />);

    expect(screen.getByText('Total: $180.00')).toBeInTheDocument();
  });

  test('debe mostrar el badge de descuento si discountPercentage > 0', () => {
    render(<ProductInCart item={mockItem} />);

    expect(screen.getByText('10% de descuento')).toBeInTheDocument();
  });

  test('NO debe mostrar el badge de descuento si discountPercentage es 0', () => {
    const itemNoDiscount = { ...mockItem, discountPercentage: 0 };
    render(<ProductInCart item={itemNoDiscount} />);

    expect(screen.queryByText(/% de descuento/)).not.toBeInTheDocument();
  });

  test('debe llamar a updateCartQuantity con (cantidad + 1) al hacer click en "+"', () => {
    render(<ProductInCart item={mockItem} />);

    const increaseBtn = screen.getByRole('button', { name: '+' });
    fireEvent.click(increaseBtn);

    expect(mockUpdateCartQuantity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(
      mockItem.productId,
      mockItem.quantity + 1
    );
  });

  test('debe llamar a updateCartQuantity con (cantidad - 1) al hacer click en "-"', () => {
    render(<ProductInCart item={mockItem} />);

    const decreaseBtn = screen.getByRole('button', { name: '-' });
    fireEvent.click(decreaseBtn);

    expect(mockUpdateCartQuantity).toHaveBeenCalledTimes(1);
    expect(mockUpdateCartQuantity).toHaveBeenCalledWith(
      mockItem.productId,
      mockItem.quantity - 1
    );
  });

  test('el botón "-" debe estar deshabilitado si la cantidad es 1', () => {
    const itemQtyOne = { ...mockItem, quantity: 1 };
    render(<ProductInCart item={itemQtyOne} />);

    const decreaseBtn = screen.getByRole('button', { name: '-' });

    expect(decreaseBtn).toBeDisabled();

    fireEvent.click(decreaseBtn);
    expect(mockUpdateCartQuantity).not.toHaveBeenCalled();
  });

  test('debe llamar a removeProductFromCart al hacer click en "Eliminar"', () => {
    render(<ProductInCart item={mockItem} />);

    const removeBtn = screen.getByRole('button', { name: /Eliminar/i });
    fireEvent.click(removeBtn);

    expect(mockRemoveProductFromCart).toHaveBeenCalledTimes(1);
    expect(mockRemoveProductFromCart).toHaveBeenCalledWith(mockItem.productId);
  });
});
