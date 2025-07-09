import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Input, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import useSignup from "../../services/auth-service/signupHooks/signup";
import { GoogleLogin } from "@react-oauth/google";

const Signup: React.FC = () => {
  const {
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
  } = useSignup();

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
              placeholder="Confirm Password"
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
                className="bg-gray-800 text-white h-12 w-full rounded-3xl hover:bg-gray-600 flex items-center"
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
            <img
              src="/assets/images/projectMangementPicture_black_cleaned.png"
              className="w-full h-full "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
