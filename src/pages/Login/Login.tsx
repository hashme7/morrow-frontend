import React, { useRef, useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { validateFields } from "../../utils/validations/authValidation/signup&login.ts";
import { useAppDispatch ,useAppSelector} from "../../store/hooks/hooks.ts";
import { gitHubLogin, googleLogin, loginUser } from "../../store/slices/loginSlice.tsx";
import { GoogleLogin } from "@react-oauth/google";
import { IGoogleResponse } from "../../types/login/loginState.tsx";
import { FaGithub ,FaEyeSlash,FaEye} from "react-icons/fa";

const Login: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const animationRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggedIn } = useAppSelector((state)=>state.login);
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string; 
  }>({});

  const handleSubmit = async () => {
    setErrors({});
    const validationErrors = validateFields({ email, password });
    if (Object.keys(validationErrors).length === 0) {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Navigating from login to /dashboard");
        if (isLoggedIn)navigate("/dashboard");
      } else if (loginUser.rejected.match(resultAction)) {
        const errorPayload = resultAction.payload as string;
        setErrors({ ...errors, form: errorPayload || "Login failed" });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleGitHubSubmit = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=Ov23liQLEQjkuY7FHHPO&scope=user:email"
    );
  };

  const handleGoogleSubmit = async (_credentialResponse:IGoogleResponse) => {
    if(_credentialResponse.credential){
      const response = await dispatch(googleLogin(_credentialResponse.credential))
      if (googleLogin.fulfilled.match(response)) {
        console.log("navigating from login to /dashboard.");
        
        navigate('/dashboard');
      }
    }
  };

  useEffect(() => {
    const handleGitHubLogin = async () => {
      const params = window.location.search;
      const code = new URLSearchParams(params).get("code");
      if(code){
        const response = await dispatch(gitHubLogin(code));
        if (gitHubLogin.fulfilled.match(response)) {
          navigate("/dashboard");
        }
      }
    };
    handleGitHubLogin();
  }, []);

  

  return (
    <section className="login h-screen flex items-center justify-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl h-4/5 bg-transparent">
        <div className="form-section w-full md:w-1/2 flex flex-col justify-center px-4">
          <h1 ref={titleRef} className="text-4xl font-bold text-white mb-6">
            Log In to Your Account
          </h1>

          <form
            ref={formRef}
            className="bg-zinc-800 bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-xl w-full space-y-6"
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white bg-opacity-5 text-white border-none placeholder-gray-300"
              fullWidth
              isClearable
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white bg-opacity-5 text-white border-none placeholder-gray-300"
              fullWidth
              isClearable
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}

            <Button
              onPress={handleSubmit}
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600"
            >
              Log In
            </Button>

            {errors.form && <p className="text-red-500">{errors.form}</p>}
            <div className="flex flex-col justify-center align-middle space-x-0 gap-2">
              <div className="sm:m-0 m-2 md:mb-0 bg-white flex justify-center sm:h-12 p-1 rounded-3xl">
                <GoogleLogin onSuccess={handleGoogleSubmit} />
              </div>
              <Button
                onPress={handleGitHubSubmit}
                className="bg-gray-800 text-white h-12 w-full rounded-3xl  hover:bg-gray-600 flex items-center"
              >
                <FaGithub className="mr-2" />
                <p className="block md:hidden">Sign up with GitHub</p>
              </Button>
            </div>

            <p className="text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-gray-200 hover:underline">
                  Sign up here
                </span>
              </Link>
            </p>
          </form>
        </div>

        <div className="animation-section md:block w-full md:w-1/2 h-full flex justify-center items-center">
          <div
            ref={animationRef}
            className="project-management-animation w-full h-full flex-co justify-end relative"
          >
            <div className="task-card w-50 h-50 bg-black bg-opacity-10 rounded-lg shadow-lg p-4 absolute top-0 left-10 text-center">
              <p className="text-white font-semibold">DB Diagram (stuart)</p>
              <p className="text-gray-800 text-sm">In Progress</p>
            </div>
            <div className="task-card w-50 h-50 bg-black bg-opacity-10 rounded-lg shadow-lg p-4 absolute top-20 left-32 text-center">
              <p className="text-white font-semibold">
                Api integration (fedrick)
              </p>
              <p className="text-gray-800 text-sm">Completed</p>
            </div>
            <div className="task-card w-40 h-24 bg-black bg-opacity-10 rounded-lg shadow-lg p-4 absolute top-40 left-56 text-center">
              <p className="text-white font-semibold">Deployment (agustin)</p>
              <p className="text-gray-800 text-sm">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
