import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

describe('<Navbar />', () => {
  const closeMobileMenuMock = vi.fn();

  test('debe renderizar todos los enlaces de navegación', () => {
    render(
      <MemoryRouter>
        <Navbar
          isMobileMenuOpen={false}
          closeMobileMenu={closeMobileMenuMock}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  test('debe tener la clase "show" (visible) cuando isMobileMenuOpen es true', () => {
    render(
      <MemoryRouter>
        <Navbar isMobileMenuOpen={true} closeMobileMenu={closeMobileMenuMock} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('show');
  });

  test('no debe tener la clase "show" cuando isMobileMenuOpen es false', () => {
    render(
      <MemoryRouter>
        <Navbar
          isMobileMenuOpen={false}
          closeMobileMenu={closeMobileMenuMock}
        />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).not.toHaveClass('show');
  });

  test('debe llamar a closeMobileMenu cuando se hace click en un enlace', () => {
    render(
      <MemoryRouter>
        <Navbar isMobileMenuOpen={true} closeMobileMenu={closeMobileMenuMock} />
      </MemoryRouter>
    );

    const productLink = screen.getByText('Productos');
    fireEvent.click(productLink);

    expect(closeMobileMenuMock).toHaveBeenCalledTimes(1);
  });

  test('debe aplicar estilos activos (negrita/color) al enlace de la ruta actual', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <Navbar
          isMobileMenuOpen={false}
          closeMobileMenu={closeMobileMenuMock}
        />
      </MemoryRouter>
    );

    const activeLink = screen.getByText('Productos');
    const inactiveLink = screen.getByText('Inicio');

    expect(activeLink).toHaveStyle({
      fontWeight: 'bold',
      color: 'var(--color-primario)',
    });

    expect(inactiveLink).toHaveStyle({
      fontWeight: 'normal',
    });
  });
});
