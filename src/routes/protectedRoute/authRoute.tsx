import React, { useEffect, useState } from "react";

import { Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks.ts";
import { checkTokenValidity } from "../../store/slices/loginSlice";
import LoadingScreen from "../../components/loading/Loading.tsx";

interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    const validateToken = async () => {
      try {
        await dispatch(checkTokenValidity());
      } catch (error) {
        console.error("Token validation error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    validateToken();
  }, []);

  if (isLoading) {
    return <LoadingScreen/>;
  }

  if (isLoggedIn) {
    return <Navigate to={"/dashboard"} />;
  }

  return children;
};

export default AuthRoute;
