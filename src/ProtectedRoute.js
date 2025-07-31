import { useAuth } from './context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // Redirige vers la page de login en gardant la route actuelle en mémoire
    navigate('/login', { state: { from: location }, replace: true });
    return null;
  }

  return children;
};

export default ProtectedRoute;
