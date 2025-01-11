import React, { useRef, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks/hooks.ts";
import { useNavigate } from "react-router-dom";
import { resendOtp, resetOtpState, verifyOtp } from "../../../store/slices/otpSlice.tsx";

const OtpModal: React.FC<{visible:boolean,setVisible:(value:boolean) => void}> = ({visible,setVisible}) => {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { otpVerified, errorMessage, loading } = useAppSelector((state) => state.otp);
  const { userId } = useAppSelector((state) => state.signup);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  

  console.log(visible, "visible...");

  const handleVerifyOtp = () => {
    if (otp) {
      dispatch(verifyOtp({ otp, userId }));
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    dispatch(resendOtp({ userId }));
    setCanResend(false);
  };

  const closeHandler = () => {
    setVisible(false);
  };

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

  if (!visible) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-900 text-white p-6 rounded-lg w-80">
        <div className="flex justify-between items-center">
          <h1 ref={titleRef} className="text-xl font-semibold">
            Verify Your Identity
          </h1>
          <button onClick={closeHandler} className="text-white bg-zinc-700 px-2 py-1 rounded">
            x
          </button>
        </div>
        <div className="mt-4">
          <p>Please enter the six-digit verification code sent to your email or phone number.</p>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            className="bg-zinc-900 text-white p-2 rounded-lg w-full mt-2 mb-4"
            maxLength={6}
          />
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-green-700 text-white py-2 rounded mt-2"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
