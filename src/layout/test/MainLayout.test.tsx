import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import MainLayout from '../components/MainLayout';

vi.mock('../components/Header', () => ({
  Header: () => <header data-testid="header">Header Mock</header>,
}));

vi.mock('../Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer Mock</footer>,
}));
vi.mock('../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer Mock</footer>,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Contenido de las Rutas</div>,
  };
});

describe('<MainLayout />', () => {
  test('debe renderizar la estructura básica del layout (Header, Main, Footer)', () => {
    render(<MainLayout />);

    // Verificar Header
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Header Mock')).toBeInTheDocument();

    // Verificar Main wrapper
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('main-content');

    // Verificar Outlet
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Contenido de las Rutas')).toBeInTheDocument();

    expect(mainElement).toContainElement(screen.getByTestId('outlet'));

    // Verificar Footer
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Footer Mock')).toBeInTheDocument();
  });

  test('debe tener el contenedor principal con la clase correcta', () => {
    const { container } = render(<MainLayout />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('main-layout');
  });
});
