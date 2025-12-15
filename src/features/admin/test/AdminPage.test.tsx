import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { AdminPage } from '../AdminPage';
import { useAppContext } from '../../../hooks/useAppContext';
import * as authUtils from '../../auth/utils/authUtils';
import * as authService from '../../../services/authService';
import * as userService from '../../../services/userService';
import * as apiService from '../../../services/api';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';

vi.mock('../../../hooks/useAppContext', () => ({
  useAppContext: vi.fn(),
}));

vi.mock('../../../services/userService', () => ({
  getAllUsersDetailedApi: vi.fn(),
  deleteUserApi: vi.fn(),
  UnauthorizedError: class extends Error {},
}));

vi.mock('../../../services/api', () => ({
  createProductApi: vi.fn(),
  updateProductApi: vi.fn(),
  deleteProductApi: vi.fn(),
}));

vi.mock('../components/Dashboard', () => ({
  Dashboard: () => (
    <div data-testid="dashboard-component">Dashboard Component</div>
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<AdminPage />', () => {
  // Spies para Auth
  const spyIsAdmin = vi.spyOn(authUtils, 'isAdmin');
  const spyGetCurrentUser = vi.spyOn(authUtils, 'getCurrentUser');
  const spyGetToken = vi.spyOn(authService, 'getAuthToken');

  const mockAddProduct = vi.fn();
  const mockUpdateProduct = vi.fn();
  const mockRemoveProduct = vi.fn();
  const mockProducts = [
    { id: 1, title: 'Prod 1', price: 100, category: 'Ropa', stock: 10 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    spyIsAdmin.mockReturnValue(true);
    spyGetCurrentUser.mockReturnValue({
      id: 1,
      email: 'admin@test.com',
      nombre: 'Admin',
      rol: 'admin',
    });
    spyGetToken.mockReturnValue('fake-token');

    // Contexto Global
    (useAppContext as Mock).mockReturnValue({
      products: mockProducts,
      addProduct: mockAddProduct,
      updateProductById: mockUpdateProduct,
      removeProductById: mockRemoveProduct,
    });

    (userService.getAllUsersDetailedApi as Mock).mockResolvedValue([
      {
        id: 1,
        email: 'user1@test.com',
        nombre: 'User 1',
        rol: 'user',
        createdAt: new Date().toISOString(),
      },
    ]);

    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  test('debe redirigir al home si el usuario NO es admin', async () => {
    spyIsAdmin.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  test('debe cargar la página y renderizar el Dashboard por defecto si es admin', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Panel Admin')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-component')).toBeInTheDocument();

    expect(userService.getAllUsersDetailedApi).toHaveBeenCalled();
  });

  test('debe navegar a la pestaña "Productos" y permitir crear uno nuevo', async () => {
    (apiService.createProductApi as Mock).mockResolvedValue({
      id: 2,
      title: 'Nuevo Prod',
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(userService.getAllUsersDetailedApi).toHaveBeenCalled();
    });

    const productsTab = screen.getByText('Productos');
    fireEvent.click(productsTab);

    expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    expect(screen.getByText('Añadir Producto')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Ej: Camiseta Casual'), {
      target: { value: 'Nuevo Prod' },
    });
    fireEvent.change(screen.getByPlaceholderText('0.00'), {
      target: { value: '50' },
    });

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'mens-shirts' } });

    const submitBtn = screen.getByText('Agregar Producto');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiService.createProductApi).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Nuevo Prod',
          price: 50,
          category: 'mens-shirts',
        })
      );
      expect(mockAddProduct).toHaveBeenCalled();
    });
  });

  test('debe permitir eliminar un producto', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(userService.getAllUsersDetailedApi).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Productos'));

    const rows = screen.getAllByRole('row');
    const deleteBtn = within(rows[1]).getAllByRole('button')[1];

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(apiService.deleteProductApi).toHaveBeenCalledWith(1);
      expect(mockRemoveProduct).toHaveBeenCalledWith(1);
    });
  });

  test('debe navegar a la pestaña "Usuarios" y permitir eliminar uno', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(userService.getAllUsersDetailedApi).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Usuarios'));

    await waitFor(() => {
      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('user1@test.com')).toBeInTheDocument();
    });

    const deleteUserBtn = screen.getByText('Eliminar');

    fireEvent.click(deleteUserBtn);

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(userService.deleteUserApi).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText('user1@test.com')).not.toBeInTheDocument();
    });
  });
});
