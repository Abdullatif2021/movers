import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';

interface PrivateRouteProps {
  allowedPermissions: string[];
  children: JSX.Element;
}

export const hasPermissions = (userPermissions: string[], requiredPermissions: string[]): boolean => {
  if (requiredPermissions.length === 0) {
    return true;
  }
  return requiredPermissions.some((permission) => userPermissions.includes(permission));
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedPermissions }) => {
  const userPermissions = useAppSelector((state) => {
    return state.auth.permissions;
  });
  const navigate = useNavigate();

  if (!hasPermissions(userPermissions, allowedPermissions)) {
    navigate('/404');
    return null;
  }

  return children;
};
