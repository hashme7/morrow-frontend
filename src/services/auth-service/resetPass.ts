import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import * as Yup from "yup";
import { resetPassword } from "../../store/slices/loginSlice";

export const useResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useAppSelector((state: any) => state.auth);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long.")
      .matches(/\d/, "Password must contain at least one number.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(
        /[!@#$%^&*]/,
        "Password must contain at least one special character."
      )
      .required("Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match.")
      .required("Confirm password is required."),
  });

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );
      if (token) {
        dispatch(resetPassword({ token: token || "", newPassword: password }));
      }
      if (success) {
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err: any) {
      console.error(err.errors);
    }
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    error,
    success,
    loading,
    handleResetPassword,
  };
};
