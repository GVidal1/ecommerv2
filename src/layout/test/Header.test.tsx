import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';

vi.mock('../../features/cart/components/CartIcon', () => ({
  CartIcon: () => <div data-testid="cart-icon">CartIcon Mock</div>,
}));

vi.mock('../../features/auth/components/ProfileMenu', () => ({
  ProfileMenu: () => <div data-testid="profile-menu">ProfileMenu Mock</div>,
}));

vi.mock('../components/Navbar', () => ({
  Navbar: ({ isMobileMenuOpen }: { isMobileMenuOpen: boolean }) => (
    <div data-testid="navbar" data-mobile-open={isMobileMenuOpen.toString()}>
      Navbar Mock
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  Menu: () => <span>Icono Menu</span>,
  X: () => <span>Icono Cerrar</span>,
}));

describe('<Header />', () => {
  test('debe renderizar correctamente el logo y los componentes principales', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logo = screen.getByAltText('StylePoint Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/logo.png');

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('profile-menu')).toBeInTheDocument();
  });

  test('el menú móvil debe estar cerrado por defecto', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const navbar = screen.getByTestId('navbar');
    expect(navbar).toHaveAttribute('data-mobile-open', 'false');

    expect(screen.getByText('Icono Menu')).toBeInTheDocument();
    expect(screen.queryByText('Icono Cerrar')).not.toBeInTheDocument();
  });

  test('debe abrir y cerrar el menú móvil al hacer click en el botón', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByText('Icono Menu').closest('button');

    if (!toggleBtn) throw new Error('Botón de menú no encontrado');

    fireEvent.click(toggleBtn);

    expect(screen.getByTestId('navbar')).toHaveAttribute(
      'data-mobile-open',
      'true'
    );
    expect(screen.getByText('Icono Cerrar')).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(screen.getByTestId('navbar')).toHaveAttribute(
      'data-mobile-open',
      'false'
    );
    expect(screen.getByText('Icono Menu')).toBeInTheDocument();
  });

  test('debe cerrar el menú móvil automáticamente al hacer click en el logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByText('Icono Menu').closest('button');
    const logoLink = screen.getByRole('link', { name: /stylepoint logo/i });

    if (!toggleBtn) throw new Error('Botón no encontrado');

    fireEvent.click(toggleBtn);
    expect(screen.getByTestId('navbar')).toHaveAttribute(
      'data-mobile-open',
      'true'
    );

    fireEvent.click(logoLink);

    expect(screen.getByTestId('navbar')).toHaveAttribute(
      'data-mobile-open',
      'false'
    );
  });
});
