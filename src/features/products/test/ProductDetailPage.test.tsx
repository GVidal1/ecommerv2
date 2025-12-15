import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetailPage from '../ProductDetailPage';
import { useAppContext } from '../../../hooks/useAppContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

const mockProduct = {
  id: 1,
  title: 'Producto de Prueba',
  price: 500,
  rating: 4.8,
  description: 'Descripción detallada del producto de prueba.',
  images: ['http://example.com/image.jpg'],
  discountPercentage: 10,
  category: 'electronics',
  stock: 20,
  brand: 'TestBrand',
  thumbnail: 'thumb.jpg',
};

describe('<ProductDetailPage />', () => {
  const mockAddProductToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAppContext as Mock).mockReturnValue({
      products: [mockProduct],
      isLoading: false,
      addProductToCart: mockAddProductToCart,
    });
  });

  test('debe mostrar mensaje de carga cuando isLoading es true', () => {
    (useAppContext as Mock).mockReturnValue({
      products: [],
      isLoading: true,
      addProductToCart: mockAddProductToCart,
    });

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Cargando producto...')).toBeInTheDocument();
  });

  test('debe mostrar "Producto no encontrado" si el ID de la URL no coincide con ningún producto', () => {
    render(
      <MemoryRouter initialEntries={['/products/999']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /volver a productos/i })
    ).toBeInTheDocument();
  });

  test('debe renderizar correctamente la información del producto', () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('4.8 ⭐')).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProduct.images[0]);
    expect(img).toHaveAttribute('alt', mockProduct.title);
  });

  test('debe manejar correctamente el incremento y decremento de cantidad', () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const decreaseBtn = screen.getByText('-');
    const increaseBtn = screen.getByText('+');
    const quantityDisplay = screen.getByText('1');

    fireEvent.click(decreaseBtn);
    expect(quantityDisplay).toHaveTextContent('1');

    fireEvent.click(increaseBtn);
    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(decreaseBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('debe llamar a addProductToCart con el producto y la cantidad seleccionada', () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const increaseBtn = screen.getByText('+');
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);

    const addToCartBtn = screen.getByRole('button', {
      name: /agregar al carrito/i,
    });
    fireEvent.click(addToCartBtn);

    expect(mockAddProductToCart).toHaveBeenCalledTimes(1);
    expect(mockAddProductToCart).toHaveBeenCalledWith(mockProduct, 3);
  });

  test('debe cambiar el estado visual del botón (Feedback de "Agregado!") al hacer click', async () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const addToCartBtn = screen.getByRole('button', {
      name: /agregar al carrito/i,
    });

    fireEvent.click(addToCartBtn);

    expect(await screen.findByText(/Agregado!/i)).toBeInTheDocument();

    expect(addToCartBtn).toBeDisabled();
  });
});
