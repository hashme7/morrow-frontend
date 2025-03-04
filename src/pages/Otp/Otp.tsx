import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Input, Button } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useOtpLogic } from "../../services/auth-service/otpHooks/otp";

const OtpPage: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const {
    otp,
    setOtp,
    otpError,
    handleVerifyOtp,
    handleResendOtp,
    timer,
    canResend,
    loading,
    errorMessage,
  } = useOtpLogic();

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: -100, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.5, ease: "Power3.easeOut" }
    );
    gsap.fromTo(
      formRef.current,
      { y: 100, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.5, delay: 0.5, ease: "Power3.easeOut" }
    );
  }, []);

  return (
    <section className="otp-page h-screen flex items-center justify-center bg-black">
      <div className="container flex flex-col md:flex-row items-center justify-between w-11/12 max-w-6xl h-4/5 bg-transparent">
        <div className="form-section w-full md:w-1/2 flex flex-col justify-center px-4">
          <h1 ref={titleRef} className="text-4xl font-bold text-white mb-6">
            Verify Your Identity
          </h1>
          <div
            ref={formRef}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-xl shadow-xl w-full space-y-6"
          >
            <p className="text-white text-lg">
              Please enter the six-digit verification code sent to your email or
              phone number.
            </p>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="bg-white bg-opacity-5 text-white border-none placeholder-gray-300"
              maxLength={6}
            />
            {otpError.length>0 && <p className="text-red-500">{otpError}</p>}
            <Button
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600"
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <p className="text-gray-400 mt-4">
              Didn't receive the code?{" "}
              {canResend ? (
                <span
                  className="text-gray-200 hover:underline cursor-pointer"
                  onClick={handleResendOtp}
                >
                  Resend Code
                </span>
              ) : (
                <span className="text-gray-400">Resend in {timer} seconds</span>
              )}
            </p>
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
      </div>
    </section>
  );
};

export default OtpPage;
