import { Link as RouterLink } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ChildrenProps {
  children: ReactNode;
}

interface LinkProps extends ChildrenProps {
  to: string;
}

const Header = ({ children }: ChildrenProps) => {
  return <div className="section-header">{children}</div>;
};

const Title = ({ children }: ChildrenProps) => {
  return <h2>{children}</h2>;
};

const Link = ({ children, to }: LinkProps) => {
  return (
    <RouterLink to={to} className="btn-ver-mas">
      {children}
    </RouterLink>
  );
};

const Grid = ({ children }: ChildrenProps) => {
  return <div className="products-grid">{children}</div>;
};

// Componente Principal

// El componente principal solo renderiza la sección contenedora
export const FeaturedSection = ({ children }: ChildrenProps) => {
  return <section className="featured-section">{children}</section>;
};

// los sub-componentes al principal
FeaturedSection.Header = Header;
FeaturedSection.Title = Title;
FeaturedSection.Link = Link;
FeaturedSection.Grid = Grid;
