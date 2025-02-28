import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks/hooks.ts";
import {
  checkTokenValidity,
} from "../../store/slices/loginSlice";
import LoadingScreen from "../../components/loading/Loading.tsx";

const ProtectedRoute: React.FC<{ redirectTo: string }> = ({ redirectTo }) => {
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
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
