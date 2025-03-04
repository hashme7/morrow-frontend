import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useResetPassword } from "../../services/auth-service/resetPasswordHooks/resetPass";
import { Input, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";

export const ResetPassword = () => {
  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    validationErrors,
    token,
    handleResetPassword,
    errorMessage,
  } = useResetPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="h-screen flex items-center justify-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl h-4/5 bg-transparent">
        <div className="form-section w-full md:w-1/2 flex flex-col justify-center px-4">
          <h1 className="text-4xl font-bold text-white mb-6">
            Reset Your Password
          </h1>
          <div className="bg-zinc-900 bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full space-y-6">
            <Input
              variant="bordered"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-950 bg-opacity-5 text-white placeholder-gray-300"
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />
            {validationErrors.password && (
              <p className="text-red-500">{validationErrors.password}</p>
            )}
            <Input
              variant="bordered"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-zinc-950 bg-opacity-5 text-white placeholder-gray-300"
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            />

            {validationErrors.confirmPassword && (
              <p className="text-red-500">{validationErrors.confirmPassword}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600 disabled:opacity-50"
              onPress={() => handleResetPassword(token || "")}
            >
              Reset Password
            </Button>
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
        <div className="animation-section hidden md:flex w-full md:w-1/2 h-full items-center justify-center">
          <div className="relative w-full h-full flex flex-col items-center space-y-6">
            <div className="task-card bg-black bg-opacity-10 rounded-lg shadow-lg p-4 w-52 absolute top-0 left-10 text-center">
              <p className="text-white font-semibold">DB Diagram (stuart)</p>
              <p className="text-gray-400 text-sm">In Progress</p>
            </div>
            <div className="task-card bg-black bg-opacity-10 rounded-lg shadow-lg p-4 w-52 absolute top-20 left-32 text-center">
              <p className="text-white font-semibold">
                API Integration (fredrick)
              </p>
              <p className="text-gray-400 text-sm">Completed</p>
            </div>
            <div className="task-card bg-black bg-opacity-10 rounded-lg shadow-lg p-4 w-44 absolute top-40 left-56 text-center">
              <p className="text-white font-semibold">Deployment (agustin)</p>
              <p className="text-gray-400 text-sm">Not Started</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
