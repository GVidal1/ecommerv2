import { render, screen } from '@testing-library/react';
import { useAppContext } from '../../../hooks/useAppContext';
import { CartIcon } from '../components/CartIcon';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, type Mock, beforeEach } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon">Icono Carrito</div>,
}));

describe('<CartIcon />', () => {
  const mockGetTotalProductsInCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppContext as Mock).mockReturnValue({
      getTotalProductsInCart: mockGetTotalProductsInCart,
    });
  });

  test('debe renderizar el icono del carrito y enlazar a /cart', () => {
    mockGetTotalProductsInCart.mockReturnValue(0);

    render(
      <MemoryRouter>
        <CartIcon />
      </MemoryRouter>
    );

    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/cart');
    expect(link).toHaveClass('cart-icon-wrapper');
  });

  test('NO debe mostrar el contador (badge) si el total de productos es 0', () => {
    mockGetTotalProductsInCart.mockReturnValue(0);

    render(
      <MemoryRouter>
        <CartIcon />
      </MemoryRouter>
    );

    const badge = screen.queryByText(/^[0-9]+$/); // Regex para buscar números
    expect(badge).not.toBeInTheDocument();
  });

  test('debe mostrar el contador con el número correcto si hay productos (> 0)', () => {
    mockGetTotalProductsInCart.mockReturnValue(5);

    render(
      <MemoryRouter>
        <CartIcon />
      </MemoryRouter>
    );

    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('cart-item-count');
  });

  test('debe actualizar el contador cuando cambia el valor devuelto por el hook', () => {
    mockGetTotalProductsInCart.mockReturnValue(99);

    render(
      <MemoryRouter>
        <CartIcon />
      </MemoryRouter>
    );

    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
