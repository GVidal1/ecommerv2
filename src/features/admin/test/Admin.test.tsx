import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { AdminLayout } from '../components/Admin';

describe('<AdminLayout />', () => {
  test('debe mostrar el contenido de la pestaña activa y cambiar al navegar', () => {
    render(
      <AdminLayout defaultTab="dashboard">
        <AdminLayout.Sidebar>
          <AdminLayout.SidebarNav>
            <AdminLayout.NavItem
              id="dashboard"
              label="Dashboard"
              icon={<span>🏠</span>}
            />
            <AdminLayout.NavItem
              id="users"
              label="Usuarios"
              icon={<span>👥</span>}
            />
          </AdminLayout.SidebarNav>
        </AdminLayout.Sidebar>

        <AdminLayout.Main>
          <AdminLayout.Content id="dashboard">
            <h1>Bienvenido al Dashboard</h1>
          </AdminLayout.Content>
          <AdminLayout.Content id="users">
            <h1>Gestión de Usuarios</h1>
          </AdminLayout.Content>
        </AdminLayout.Main>
      </AdminLayout>
    );

    expect(screen.getByText('Bienvenido al Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Gestión de Usuarios')).not.toBeInTheDocument();

    const dashboardBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(dashboardBtn).toHaveClass('active');

    const usersBtn = screen.getByRole('button', { name: /usuarios/i });
    fireEvent.click(usersBtn);

    expect(
      screen.queryByText('Bienvenido al Dashboard')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();

    expect(usersBtn).toHaveClass('active');
    expect(dashboardBtn).not.toHaveClass('active');
  });

  test('debe abrir y cerrar el sidebar al usar el botón de toggle', () => {
    const { container } = render(
      <AdminLayout>
        <AdminLayout.Sidebar>
          <div>Contenido Sidebar</div>
        </AdminLayout.Sidebar>
        <AdminLayout.Header>
          <AdminLayout.HeaderLeft breadcrumb="Test" />
        </AdminLayout.Header>
      </AdminLayout>
    );

    const sidebar = container.querySelector('aside');
    const toggleBtn = container.querySelector('#menu-toggle');

    if (!toggleBtn) throw new Error('No se encontró el botón de toggle');

    // 1. Estado inicial: cerrado (sin clase 'open')
    expect(sidebar).not.toHaveClass('open');

    // 2. Click para abrir
    fireEvent.click(toggleBtn);
    expect(sidebar).toHaveClass('open');

    // 3. Click para cerrar
    fireEvent.click(toggleBtn);
    expect(sidebar).not.toHaveClass('open');
  });

  test('debe mostrar overlay y cerrar sidebar al hacer click en él (Simulación Móvil)', () => {
    window.innerWidth = 500;
    fireEvent(window, new Event('resize'));

    const { container } = render(
      <AdminLayout>
        <AdminLayout.Sidebar>
          <AdminLayout.SidebarNav>
            <AdminLayout.NavItem id="tab1" label="Tab1" icon={<span />} />
          </AdminLayout.SidebarNav>
        </AdminLayout.Sidebar>
        <AdminLayout.Header>
          <AdminLayout.HeaderLeft />
        </AdminLayout.Header>
      </AdminLayout>
    );

    const toggleBtn = container.querySelector('#menu-toggle');
    const sidebar = container.querySelector('aside');

    if (!toggleBtn) throw new Error('Botón no encontrado');

    // 1. Abrir sidebar
    fireEvent.click(toggleBtn);
    expect(sidebar).toHaveClass('open');

    // 2. Verificar que aparece el overlay
    const overlay = container.querySelector('.sidebar-overlay');
    expect(overlay).toBeInTheDocument();

    // 3. Click en el overlay
    if (overlay) fireEvent.click(overlay);

    // 4. Verificar que se cierra
    expect(sidebar).not.toHaveClass('open');
    expect(container.querySelector('.sidebar-overlay')).not.toBeInTheDocument();
  });

  test('debe renderizar información de usuario y ejecutar logout', () => {
    const mockLogout = vi.fn();
    const userName = 'Admin User';

    render(
      <AdminLayout>
        <AdminLayout.Header>
          <AdminLayout.HeaderRight userName={userName} onLogout={mockLogout} />
        </AdminLayout.Header>
      </AdminLayout>
    );

    // Verificar nombre
    expect(screen.getByText(userName)).toBeInTheDocument();

    // Verificar Avatar (si no se pasa url, usa ui-avatars)
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', userName);
    expect(img.getAttribute('src')).toContain('ui-avatars.com');

    // Verificar Logout
    const logoutBtn = screen.getByText('Salir');
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
