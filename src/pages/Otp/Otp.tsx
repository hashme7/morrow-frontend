import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Input, Button } from "@nextui-org/react";
import { useAppSelector, useAppDispatch } from "../../store/hooks/hooks.ts";
import { verifyOtp, resetOtpState, resendOtp } from "../../store/slices/otpSlice.tsx";
import { useNavigate } from "react-router-dom";

const OtpPage: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { otpVerified, errorMessage, loading } = useAppSelector((state) => state.otp);
  const { userId } = useAppSelector((state) => state.signup);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); 
  const [canResend, setCanResend] = useState(false);

  const handleVerifyOtp = () => {
    if (otp) {
      dispatch(verifyOtp({ otp, userId }));
    }
  };

  const handleResendOtp = () => {
    setTimer(60); 
    dispatch(resendOtp({userId}))
    setCanResend(false); 
  };

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

  useEffect(() => {
    if (otpVerified) {
      navigate("/login");
      dispatch(resetOtpState());
    }
  }, [otpVerified, navigate, dispatch]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true); 
    }

    return () => {
      clearInterval(interval); 
    };
  }, [timer]);

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
              Please enter the six-digit verification code sent to your email or phone number.
            </p>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              className="bg-white bg-opacity-5 text-white border-node placeholder-gray-300"
              maxLength={6}
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Button
              radius="full"
              className="w-full bg-green-900 text-white shadow-lg font-semibold py-3 hover:bg-green-600"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
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
                <span className="text-gray-400">
                  Resend in {timer} seconds
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpPage;
