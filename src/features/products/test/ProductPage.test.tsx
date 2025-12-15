import { render, screen } from '@testing-library/react';
import ProductsPage from '../ProductPage';
import { useAppContext } from '../../../hooks/useAppContext';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

const mockProducts = [
  {
    id: 1,
    title: 'Producto A',
    price: 10,
    rating: 5,
    thumbnail: 'img1',
    cart: [],
  },
  {
    id: 2,
    title: 'Producto B',
    price: 20,
    rating: 4,
    thumbnail: 'img2',
    cart: [],
  },
];

describe('<ProductsPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useAppContext as Mock).mockReturnValue({
      products: mockProducts,
      cart: [],
      addProductToCart: vi.fn(),
      updateCartQuantity: vi.fn(),
    });
  });

  test('debe renderizar el título de la página', () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );
    expect(screen.getByText('Products Page')).toBeInTheDocument();
  });

  test('debe renderizar una tarjeta por cada producto devuelto por el contexto', () => {
    render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Producto A')).toBeInTheDocument();
    expect(screen.getByText('Producto B')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  test('no debe renderizar tarjetas si la lista está vacía', () => {
    (useAppContext as Mock).mockReturnValue({
      products: [],
      cart: [],
      addProductToCart: vi.fn(),
      updateCartQuantity: vi.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <ProductsPage />
      </MemoryRouter>
    );

    const cardContainer = container.querySelector('.card-container');
    expect(cardContainer).toBeEmptyDOMElement();
  });
});
