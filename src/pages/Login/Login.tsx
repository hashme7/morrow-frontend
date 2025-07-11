import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks.ts";
import { GoogleLogin } from "@react-oauth/google";
import { FaGithub, FaEyeSlash, FaEye } from "react-icons/fa";
import {
  handleForgotPass,
  handleGitHubLogin,
  handleGitHubSubmit,
  handleGoogleSubmit,
  handleLogin,
} from "../../services/auth-service/loginHooks/login.ts";
import { clearError } from "../../store/slices/loginSlice.tsx";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { errorMessage } = useAppSelector((state) => state.login);
  const animationRef = useRef<HTMLDivElement | null>(null);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    forgotEmail?: string;
    form?: string;
  }>({});

  useEffect(() => {
    const params = window.location.search;
    const code = new URLSearchParams(params).get("code");
    handleGitHubLogin(code, dispatch, navigate);
  }, []);
  useEffect(() => {
    dispatch(clearError());
  }, [isOpen]);
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
    <section className="login h-screen flex items-center justify-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl h-4/5 bg-transparent">
        <div className="form-section w-full md:w-1/2 flex flex-col justify-center px-4">
          <h1 className="text-4xl font-bold text-white mb-6">
            Log In to Your Account
          </h1>

          <form className="bg-zinc-800 bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-xl w-full space-y-6">
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

            <div className="flex justify-between">
              <span></span>
              <button
                type="button"
                className="text-gray-400 text-sm hover:underline"
                onClick={onOpen}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              onPress={() =>
                handleLogin(email, password, dispatch, navigate, setErrors)
              }
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600"
            >
              Log In
            </Button>
            {!isOpen && errorMessage && (
              <p className="text-red-500">{errorMessage}</p>
            )}

            <div className="flex flex-col justify-center align-middle space-x-0 gap-2">
              <div className="sm:m-0 m-2 md:mb-0 bg-white flex justify-center sm:h-12 p-1 rounded-3xl">
                <GoogleLogin
                  onSuccess={(res) =>
                    handleGoogleSubmit(res, dispatch, navigate)
                  }
                />
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
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-gray-200 hover:underline">
                  Sign up here
                </span>
              </Link>
            </p>
          </form>
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="text-lg font-semibold">
            Reset Password
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-500">
              Enter your email to receive a password reset link.
            </p>
            <Input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="text-black"
              fullWidth
            />
            {errors.email && <p className="text-red-500">{}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onOpenChange}>
              Cancel
            </Button>
            <Button
              className="bg-green-900 text-white"
              onPress={() =>
                handleForgotPass(forgotEmail, dispatch, onOpenChange, setErrors)
              }
            >
              Send Reset Link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default Login;
