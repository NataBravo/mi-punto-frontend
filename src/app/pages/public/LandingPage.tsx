import { Link } from 'react-router';
import { MapPin, Search, Star, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl">Mi Punto</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Iniciar sesión
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Descubre negocios locales cerca de ti
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encuentra los mejores establecimientos en tu ciudad, consulta reseñas y comparte tus experiencias
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/user/city"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              Explorar negocios
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50"
            >
              Registrar mi negocio
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 py-16">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Para usuarios</h3>
            <p className="text-gray-600">
              Descubre negocios cercanos con búsqueda por ubicación, categoría y reseñas de la comunidad
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Para negocios</h3>
            <p className="text-gray-600">
              Gestiona tu perfil comercial, responde reseñas y atrae más clientes a tu establecimiento
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Crece con nosotros</h3>
            <p className="text-gray-600">
              Accede a métricas de visitas, calificaciones y mejora continuamente tu reputación digital
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
