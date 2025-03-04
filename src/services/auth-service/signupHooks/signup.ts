import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../../store/slices/signUpSlice.tsx";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks.ts";
import { validateFields } from "../../../utils/validations/authValidation/signup&login.ts";
import { googleLogin } from "../../../store/slices/loginSlice.tsx";
import { IGoogleResponse } from "../../../types/login/loginState.tsx";
import { gitHubLogin } from "../../../store/slices/loginSlice.tsx";

const useSignup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { errorMessage } = useAppSelector((state) => state.signup);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    userName?: string;
    confirmPassword?: string;
  }>({
    email: "",
    password: "",
    userName: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPass] = useState(false);

  const handleSignup = async () => {
    const validationErrors = validateFields({
      email,
      password,
      userName,
      confirmPassword,
    });
    if (Object.keys(validationErrors).length === 0) {
      const response = await dispatch(
        signupUser({ username: userName, email, password })
      );
      if (signupUser.fulfilled.match(response)) {
        navigate("/otp");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGoogleSubmit = async (_credentialResponse: IGoogleResponse) => {
    if (_credentialResponse.credential) {
      const response = await dispatch(
        googleLogin(_credentialResponse.credential)
      );
      if (googleLogin.fulfilled.match(response)) {
        navigate("/dashboard");
      }
    }
  };

  const handleGitHubSubmit = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=Ov23liQLEQjkuY7FHHPO&scope=user:email"
    );
  };
  const handleGitHubLogin = async () => {
    const params = window.location.search;
    const code = new URLSearchParams(params).get("code");
    if (code) {
      const response = await dispatch(gitHubLogin(code));
      if (gitHubLogin.fulfilled.match(response)) {
        navigate("/dashboard");
      }
    }
  };

  return {
    userName,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    handleSignup,
    handleGoogleSubmit,
    handleGitHubSubmit,
    handleGitHubLogin,
    showPassword,
    setShowPassword,
    showCnfmPassword,
    setShowCnfmPass,
    errorMessage,
  };
};

export default useSignup;
