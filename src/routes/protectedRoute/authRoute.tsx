import React, { useEffect, useState } from 'react';

import { Navigate } from 'react-router-dom';


import { useAppDispatch, useAppSelector } from '../../store/hooks/hooks.ts';
import { checkTokenValidity } from '../../store/slices/loginSlice';

interface AuthRouteProps{
    children:JSX.Element;
}

const AuthRoute:React.FC<AuthRouteProps> = ({children})=>{
    const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);
  const errorMessage = useAppSelector((state) => state.login.errorMessage);
 
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
    validateToken();
  }, [dispatch]);
  
  if (isLoading) {
    return <div>Loading............</div>;
  }

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>; 
  }

  if (isLoggedIn) {
    return <Navigate to={'/dashboard'} />;
  }

  return children;
}

export default AuthRoute;