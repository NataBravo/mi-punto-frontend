import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LayoutDashboard, Building2 } from 'lucide-react';

const sidebarItems = [
  { path: '/owner', label: 'Dashboard Global', icon: LayoutDashboard },
  { path: '/owner/businesses', label: 'Gestión de Negocios', icon: Building2 },
];

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="owner" />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
