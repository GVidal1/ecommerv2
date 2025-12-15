import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import NotFoundPage from '../components/404';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../components/atoms/Button/Button', () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
  }) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('<NotFoundPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('debe renderizar correctamente los textos de error 404', () => {
    render(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument();
    expect(
      screen.getByText(/Lo sentimos, la página que buscas no existe/i)
    ).toBeInTheDocument();
  });

  test('el botón "Ir al inicio" debe navegar a la ruta raíz ("/")', () => {
    render(<NotFoundPage />);

    const homeBtn = screen.getByText('Ir al inicio');
    fireEvent.click(homeBtn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('el botón "Volver atrás" debe navegar hacia atrás (-1)', () => {
    render(<NotFoundPage />);

    const backBtn = screen.getByText('Volver atrás');

    expect(backBtn).toHaveAttribute('data-variant', 'secondary');

    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
