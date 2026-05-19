import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AIChatBot from './AIChatBot';

const Layout = () => {
  return (
    <div className="flex h-screen bg-[#0a0f1e] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-mesh">
        <div className="px-6 py-8 lg:px-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <AIChatBot />
    </div>
  );
};

export default Layout;
