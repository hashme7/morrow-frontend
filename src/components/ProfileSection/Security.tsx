import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { passwordSchema } from "../../utils/validations/changePassword"; 
import {IFormInputs} from '../../types/profile'
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import { changePassword } from "../../store/slices/profileSlice";
import mongoose from "mongoose";
import Notification from "../Notification";

const Security: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification,setNotification] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading, error, successMessage,errorMessage } = useAppSelector(
    (state) => state.profile
  );

  const {
    register,
    handleSubmit,reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = async (data: IFormInputs) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const userOjbectId = new mongoose.Types.ObjectId(userId);
      try {
        await dispatch(
          changePassword({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            userId: userOjbectId,
          })
        );
        setNotification(true);
        setTimeout(()=>{setNotification(false)},800)
        reset();
      } catch (error) {
        console.log(`Error on on Submit for security${error}`);
      }
    }
  };

  return (
    <div className="w-full m-3 px-6 py-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Security</h3>
      <p className="text-sm mb-8 text-gray-400">
        Change your password. When you change your password, we keep you logged
        in to this device but may log you out from your other devices.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="currentPassword"
          >
            Current password*
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              className="w-full px-4 py-2 text-gray-500 rounded-lg focus:outline-none"
              placeholder="Enter your current password"
              {...register("currentPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? "👁️" : "🙈"}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
          {
            error&& (
              <p className="text-red-500 text-sm">
                {errorMessage}
              </p>
            )
          }
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="newPassword"
          >
            New password*
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              className="w-full px-4 py-2 text-gray-500 rounded-lg focus:outline-none"
              placeholder="Enter your new password"
              {...register("newPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "👁️" : "🙈"}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-medium mb-2"
            htmlFor="confirmPassword"
          >
            Confirm password*
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="w-full px-4 py-2 text-gray-500 rounded-lg focus:outline-none"
              placeholder="Confirm your new password"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "🙈"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}

        <div>
          <button
            type="submit"
            className={` px-4 py-2 ${
              isLoading ? "bg-gray-600" : "bg-zinc-900"
            } hover:bg-white rounded-lg font-medium hover:text-black`}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      <Notification message="password changed succesfully" visible={notification}/>
    </div>
  );
};

export default Security;