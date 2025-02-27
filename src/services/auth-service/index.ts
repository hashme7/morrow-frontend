import { validateFields } from "../../utils/validations/authValidation/signup&login";
import {
  gitHubLogin,
  googleLogin,
  loginUser,
} from "../../store/slices/loginSlice";
import { AppDispatch } from "../../store/store";
import { IGoogleResponse } from "../../types/login/loginState";

export const handleLogin = async (
  email: string,
  password: string,
  dispatch: AppDispatch,
  navigate: (path: string) => void,
  setErrors: (errors: {
    email?: string;
    password?: string;
    form?: string;
  }) => void
) => {
  setErrors({});
  const validationErrors = validateFields({
    email,
    password,
    confirmPassword: undefined,
  });
  if (Object.keys(validationErrors).length === 0) {
    const resultAction = dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("Navigating from login to /dashboard");
      navigate("/dashboard");
    } else if (loginUser.rejected.match(resultAction)) {
      const errorPayload = resultAction.payload as string;
      setErrors({ form: errorPayload });
    }
  } else {
    setErrors(validationErrors);
  }
};
export const handleGoogleSubmit = async (
  _credentialResponse: IGoogleResponse,
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  if (_credentialResponse.credential) {
    const response = await dispatch(
      googleLogin(_credentialResponse.credential)
    );
    if (googleLogin.fulfilled.match(response)) {
      console.log("navigating from login to /dashboard.");

      navigate("/dashboard");
    }
  }
};

export const handleGitHubSubmit = () => {
  window.location.assign(
    "https://github.com/login/oauth/authorize?client_id=Ov23liQLEQjkuY7FHHPO&scope=user:email"
  );
};

export const handleGitHubLogin = async (
  code: string | null,
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  if (code) {
    const response = await dispatch(gitHubLogin(code));
    if (gitHubLogin.fulfilled.match(response)) {
      navigate("/dashboard");
    }
  }
};
