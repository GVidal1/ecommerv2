import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ProductCard } from '../../../layout/components/common/ProductCard';

// Datos de prueba
const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 100,
  rating: 4.5,
  thumbnail: 'http://image.url',
  description: 'desc',
  category: 'test',
  discountPercentage: 5.5,
  stock: 10,
  brand: 'brand',
  images: [],
};

describe('<ProductCard />', () => {
  it('debe renderizar correctamente la información del producto usando sub-componentes', () => {
    render(
      <MemoryRouter>
        <ProductCard product={mockProduct}>
          <ProductCard.Image />
          <ProductCard.Info>
            <ProductCard.Title />
            <ProductCard.Rating />
            <ProductCard.Price />
          </ProductCard.Info>
        </ProductCard>
      </MemoryRouter>
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProduct.thumbnail);
    expect(img).toHaveAttribute('alt', mockProduct.title);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('4.5 ⭐')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('debe navegar a la página de detalle al hacer click en la tarjeta', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProductCard product={mockProduct}>
                <ProductCard.Title />
              </ProductCard>
            }
          />
          <Route
            path="/products/:id"
            element={<div>Detalle del Producto</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const cardTitle = screen.getByText('Test Product');
    const card = cardTitle.closest('.card');

    if (card) {
      fireEvent.click(card);
    }

    expect(await screen.findByText('Detalle del Producto')).toBeInTheDocument();
  });

  it('no debe navegar si se hace click en el contenedor de botones (propagación detenida)', () => {
    const handleBtnClick = vi.fn();
    const handleContainerClick = vi.fn();

    render(
      <MemoryRouter>
        <div onClick={handleContainerClick}>
          <ProductCard product={mockProduct}>
            <ProductCard.Buttons>
              <button onClick={handleBtnClick}>Acción</button>
            </ProductCard.Buttons>
          </ProductCard>
        </div>
      </MemoryRouter>
    );

    const button = screen.getByText('Acción');
    fireEvent.click(button);

    expect(handleBtnClick).toHaveBeenCalled();

    expect(handleContainerClick).not.toHaveBeenCalled();
  });
});
