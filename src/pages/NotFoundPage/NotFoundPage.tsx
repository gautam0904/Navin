import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  );
};
