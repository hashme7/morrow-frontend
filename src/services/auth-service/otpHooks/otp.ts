import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { resendOtp, resetOtpState, verifyOtp } from "../../../store/slices/otpSlice";

export const useOtpLogic = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { otpVerified, errorMessage, loading } = useAppSelector(
    (state) => state.otp
  );
  const { userId } = useAppSelector((state) => state.signup);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");

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
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = () => {
    setOtpError("");
    if (otp.length !== 6) {
      setOtpError("OTP must be exactly 6 characters long.");
      return;
    }
    if (otp) {
      dispatch(verifyOtp({ otp, userId }));
    }
  };

  const handleResendOtp = () => {
    setTimer(60);
    dispatch(resendOtp({ userId }));
    setCanResend(false);
  };

  return {
    otp,
    setOtp,
    otpError,
    handleVerifyOtp,
    handleResendOtp,
    timer,
    canResend,
    loading,
    errorMessage,
  };
};
