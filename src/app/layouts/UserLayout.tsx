import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="user" />
      <Outlet />
    </div>
  );
}
