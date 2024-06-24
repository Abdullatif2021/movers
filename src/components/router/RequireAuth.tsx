import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@app/hooks/reduxHooks';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { doLogout } from '@app/store/slices/authSlice';
interface DecodedToken {
  exp: number;
  sub: string;
}

const RequireAuth: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token || token === 'bearerToken') {
        logoutUser();
        return;
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        logoutUser();
        return;
      }

      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        logoutUser();
      }
    };

    const decodeToken = (token: string): DecodedToken => {
      try {
        return jwt_decode(token) as DecodedToken;
      } catch (error) {
        console.error('Error decoding token:', error);
        return {} as DecodedToken;
      }
    };

    const logoutUser = async () => {
      await dispatch(doLogout());
      navigate('/auth/login');
    };

    checkTokenExpiration();
    const tokenCheckInterval = setInterval(checkTokenExpiration, 1200); // Check every 1200000 mili second - 1200 second - 20 minute

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [token]);

  if (!token || token === 'bearerToken') {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
