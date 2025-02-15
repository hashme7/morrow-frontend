import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks/hooks.ts';
import { checkTokenValidity, setIsLoggedIn } from '../../store/slices/loginSlice';
import Cookies from 'js-cookie'

const ProtectedRoute: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
 
  useEffect(() => {
    const validateToken = async () => {
      try {
        await dispatch(checkTokenValidity());
      } catch (error) {
        console.error('Token validation error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if(Cookies.get('accessToken')){
      console.log("access token is there ",Cookies.get('accessToken'))
      validateToken();
      setIsLoading(false)
    } else {
      console.log("access token is Not there ", Cookies.get("accessToken"));
      setIsLoading(false);
      setIsLoggedIn();
    }
  }, [dispatch]);

  if (isLoading) {
    return <div>Loadi</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
