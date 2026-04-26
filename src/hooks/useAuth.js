import { useSelector } from 'react-redux';
import { ROLES } from '../firebase/collections';

export const useAuth = () => {
  const { user, userData, isAuthenticated, loading } = useSelector((state) => state.auth);

  const isSuperAdmin = userData?.role === ROLES.SUPER_ADMIN;
  const isAdmin = userData?.role === ROLES.ADMIN;
  const isUser = userData?.role === ROLES.USER;

  return {
    user,
    userData,
    isAuthenticated,
    loading,
    isSuperAdmin,
    isAdmin,
    isUser
  };
};
