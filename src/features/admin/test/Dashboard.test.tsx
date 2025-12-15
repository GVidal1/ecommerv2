import { render, screen, waitFor } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';
import { useAppContext } from '../../../hooks/useAppContext';
import { getAllUsersApi } from '../../../services/userService';
import { describe, test, expect, vi, type Mock, beforeEach } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../../services/userService', () => ({
  getAllUsersApi: vi.fn(),
}));

describe('<Dashboard />', () => {
  const mockProducts = [
    { id: 1, title: 'Producto 1', price: 100 },
    { id: 2, title: 'Producto 2', price: 50.5 },
    { id: 3, title: 'Producto 3', price: 200 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useAppContext as Mock).mockReturnValue({
      products: mockProducts,
    });
  });

  test('debe renderizar el título y las tarjetas de estadísticas', async () => {
    (getAllUsersApi as Mock).mockResolvedValue([]);

    render(<Dashboard />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Resumen general del sistema')).toBeInTheDocument();
    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Valor Total')).toBeInTheDocument();
  });

  test('debe calcular y mostrar la cantidad y valor total de productos correctamente', async () => {
    (getAllUsersApi as Mock).mockResolvedValue([]);

    render(<Dashboard />);

    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('$350.50')).toBeInTheDocument();
  });

  test('debe mostrar indicador de carga "..." y luego el conteo de usuarios al cargar la API', async () => {
    const mockUsers = new Array(10).fill({ id: 1, name: 'User' });
    (getAllUsersApi as Mock).mockResolvedValue(mockUsers);

    render(<Dashboard />);

    expect(screen.getByText('...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  test('debe manejar errores de la API de usuarios mostrando 0', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (getAllUsersApi as Mock).mockRejectedValue(new Error('Error de red'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
