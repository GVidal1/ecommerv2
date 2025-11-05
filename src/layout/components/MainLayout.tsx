import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
