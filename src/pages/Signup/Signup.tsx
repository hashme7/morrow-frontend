import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Input, Button } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../store/slices/signUpSlice.tsx";
import { useAppSelector, useAppDispatch } from "../../store/hooks/hooks.ts";
import { validateFields } from "../../utils/validations/authValidation/signup&login.ts";
import { GoogleLogin } from "@react-oauth/google";
import { IGoogleResponse } from "../../types/login/loginState.tsx";
import { gitHubLogin, googleLogin } from "../../store/slices/loginSlice.tsx";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";

const Signup: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { errorMessage } = useAppSelector((state) => state.signup);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCnfmPassword, setShowCnfmPass] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    userName?: string;
    confirmPassword?:string,
  }>({});

  const handleSignup = async () => {
    try {
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
          console.log("navigating : /otp ");
          navigate("/otp");
        }
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoogleSubmit = async (_credentialResponse: IGoogleResponse) => {
    if (_credentialResponse.credential) {
      const response = await dispatch(
        googleLogin(_credentialResponse.credential)
      );
      console.log("handle google submit", _credentialResponse);
      if (googleLogin.fulfilled.match(response)) {
        console.log("navigating from signup to :/dashboard");
        navigate("/dashboard");
      }
    }
  };

  const handleGitHubSubmit = () => {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=Ov23liQLEQjkuY7FHHPO&scope=user:email"
    );
  };

  useEffect(() => {
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
    handleGitHubLogin();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.5,
        ease: "Power3.easeOut",
      }
    );
    gsap.fromTo(
      formRef.current,
      { y: 100, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.5,
        delay: 0.5,
        ease: "Power3.easeOut",
      }
    );
  }, []);
  useEffect(() => {
    gsap.fromTo(
      animationRef.current,
      { x: 50, opacity: 0 },
      {
        x: -10,
        opacity: 1,
        duration: 2,
        ease: "Power3.easeInOut",
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  return (
    <section className="signup h-screen flex items-center justify-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl h-4/5 bg-transparent">
        <div className="form-section w-full md:w-1/2 flex flex-col justify-center px-4">
          <h1 ref={titleRef} className="text-4xl font-bold text-white mb-6">
            Create Your Account
          </h1>

          <div
            ref={formRef}
            className="bg-zinc-900 bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-xl w-full space-y-6"
          >
            <Input
              variant="bordered"
              type="text"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              className="bg-zinc-950 bg-opacity-5 text-white placeholder-gray-300"
            />
            {errors.userName && (
              <p className="text-red-500 ">{errors.userName}</p>
            )}

            <Input
              variant="bordered"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-zinc-950 bg-opacity-5 text-white border-none placeholder-gray-300"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

            <Input
              variant="bordered"
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-zinc-950 bg-opacity-5 text-white border-none placeholder-gray-300"
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

            <Input
              variant="bordered"
              type={`${showCnfmPassword ? "text" : "password"}`}
              placeholder="confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              className="bg-zinc-950 bg-opacity-5 text-white border-none placeholder-gray-300"
              endContent={
                <button
                  type="button"
                  onClick={() => setShowCnfmPass(!showCnfmPassword)}
                >
                  {showCnfmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}

            <Button
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600"
              onPress={handleSignup}
              >
              Sign Up
            </Button>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex flex-col justify-center align-middle space-x-0 sm:gap-2">
              <div className="m-1  md:mb-0 bg-white flex justify-center sm:h-12 p-1 rounded-3xl">
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
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-gray-200 hover:underline">
                  Log in here
                </span>
              </Link>
            </p>
          </div>
        </div>

        <div className="animation-section sm:block hidden w-full md:w-1/2 h-full justify-center items-center">
          <div
            ref={animationRef}
            className="project-management-animation w-full h-full flex-co justify-end  relative"
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
              <p className="text-white font-semibold">Deployement (agustin)</p>
              <p className="text-gray-800 text-sm">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
