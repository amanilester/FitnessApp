import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.tsx';

function Layout() {
  const location = useLocation();
  return (
    <div>
      <div className="pb-24">
        <Outlet key={location.pathname} />
      </div>
      <Navbar />
    </div>
  );
}

export default Layout;