import { Outlet } from 'react-router-dom';
import LeftNavBar from './LeftNavBar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftNavBar />
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  );
}
