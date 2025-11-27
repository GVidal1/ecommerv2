import { createContext, useContext, useState, type ReactNode } from 'react';
import '../styles/admin.css';

// ========== CONTEXT ==========
interface AdminLayoutContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(
  undefined
);

const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error(
      'Los componentes de administrador deben usarse dentro de AdminLayout'
    );
  }
  return context;
};

// ========== MAIN COMPONENT ==========
interface AdminLayoutProps {
  children: ReactNode;
  defaultTab?: string;
}

export function AdminLayout({
  children,
  defaultTab = 'dashboard',
}: AdminLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AdminLayoutContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
      }}>
      <div className="container-admin">{children}</div>
    </AdminLayoutContext.Provider>
  );
}

// ========== SIDEBAR ==========
interface SidebarProps {
  children: ReactNode;
}

AdminLayout.Sidebar = function Sidebar({ children }: SidebarProps) {
  const { isSidebarOpen, closeSidebar } = useAdminLayout();

  // Cerrar sidebar al hacer click fuera (solo en móvil)
  const handleOverlayClick = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  return (
    <>
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={handleOverlayClick} />
      )}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {children}
      </aside>
    </>
  );
};

// ========== SIDEBAR HEADER ==========
interface SidebarHeaderProps {
  title: string;
  icon?: ReactNode;
}

AdminLayout.SidebarHeader = function SidebarHeader({
  title,
  icon,
}: SidebarHeaderProps) {
  return (
    <div className="admin-logo">
      {icon || (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 12H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 8H16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 16H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
      <h1>{title}</h1>
    </div>
  );
};

// ========== SIDEBAR NAV ==========
interface SidebarNavProps {
  children: ReactNode;
}

AdminLayout.SidebarNav = function SidebarNav({ children }: SidebarNavProps) {
  return <nav className="admin-nav">{children}</nav>;
};

// ========== NAV ITEM ==========
interface NavItemProps {
  id: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

AdminLayout.NavItem = function NavItem({
  id,
  icon,
  label,
  onClick,
}: NavItemProps) {
  const { activeTab, setActiveTab, closeSidebar } = useAdminLayout();

  const handleClick = () => {
    setActiveTab(id);
    closeSidebar();
    onClick?.();
  };

  return (
    <button className={activeTab === id ? 'active' : ''} onClick={handleClick}>
      {icon}
      {label}
    </button>
  );
};

// ========== HEADER ==========
interface HeaderProps {
  children: ReactNode;
}

AdminLayout.Header = function Header({ children }: HeaderProps) {
  return <header className="admin-header">{children}</header>;
};

// ========== HEADER LEFT ==========
interface HeaderLeftProps {
  breadcrumb?: string;
}

AdminLayout.HeaderLeft = function HeaderLeft({
  breadcrumb = 'Panel de Administración',
}: HeaderLeftProps) {
  const { toggleSidebar } = useAdminLayout();

  return (
    <div className="admin-header-left">
      <button
        className="admin-btn admin-btn-secondary"
        id="menu-toggle"
        onClick={toggleSidebar}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="breadcrumb">{breadcrumb}</div>
    </div>
  );
};

// ========== HEADER RIGHT ==========
interface HeaderRightProps {
  userName?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

AdminLayout.HeaderRight = function HeaderRight({
  userName,
  userAvatar,
  onLogout,
}: HeaderRightProps) {
  return (
    <div className="admin-header-right">
      {userName && (
        <div className="admin-user-info">
          <img
            src={
              userAvatar ||
              `https://ui-avatars.com/api/?name=${userName}&background=2563eb&color=fff`
            }
            alt={userName}
          />
          <span>{userName}</span>
        </div>
      )}
      {onLogout && (
        <button className="admin-btn admin-btn-secondary" onClick={onLogout}>
          Salir
        </button>
      )}
    </div>
  );
};

// ========== MAIN CONTENT ==========
interface MainProps {
  children: ReactNode;
}

AdminLayout.Main = function Main({ children }: MainProps) {
  return (
    <main className="admin-main">
      <div id="admin-content">{children}</div>
    </main>
  );
};

// ========== CONTENT (Tab Switcher) ==========
interface ContentProps {
  id: string;
  children: ReactNode;
}

AdminLayout.Content = function Content({ id, children }: ContentProps) {
  const { activeTab } = useAdminLayout();

  if (activeTab !== id) return null;

  return <>{children}</>;
};
