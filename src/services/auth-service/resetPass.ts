import { useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks/hooks";
import * as Yup from "yup";
import { resetPassword } from "../../store/slices/loginSlice";
import { showToast } from "../../components/popup/hot-toast";

export const useResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const { token } = useParams();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleResetPassword = async (token:string) => {
    console.log("handle reset password");
    
    setValidationErrors({});
    try {
      await validationSchema.validate(
        { password, confirmPassword },
        { abortEarly: false }
      );
      if (token) {
        console.log("token is there");
        
        const response = dispatch(
          resetPassword({ token: token , newPassword: password })
        );
        if (resetPassword.fulfilled.match(response)) {
          showToast({ message: "Password changed successfully" });
          navigate("/login");
        } else {
          showToast({ message: "Something went wrong" });
        }
      } else {
        showToast({message:"token is not provided"})
      }
    } catch (err: any) {
      const errors: { [key: string]: string } = {};
      err.inner.forEach((error: Yup.ValidationError) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      setValidationErrors(errors);
    }
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    validationErrors,
    token,
    handleResetPassword,
  };
};
