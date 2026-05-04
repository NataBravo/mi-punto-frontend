import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LayoutDashboard, Edit, MapPin, Image, MessageSquare } from 'lucide-react';

const sidebarItems = [
  { path: '/business', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/business/edit-profile', label: 'Editar perfil', icon: Edit },
  { path: '/business/location', label: 'Ubicación', icon: MapPin },
  { path: '/business/gallery', label: 'Galería', icon: Image },
  { path: '/business/reviews', label: 'Reseñas', icon: MessageSquare },
];

export default function BusinessLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="business" />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
