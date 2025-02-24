import React, { ChangeEvent, useState } from "react";
import { FaCamera, FaCheck, FaEdit } from "react-icons/fa";
import { ProfileSidebarProps } from "../../types/profile";
import {
  changeProfilImg,
  updateProfileField,
} from "../../store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import mongoose from "mongoose";

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ profile }) => {
  const dispatch = useAppDispatch();
  const { image,fullName,userName,basedIn,jobTitle ,phone} = useAppSelector((state) => state.profile);
  const [newFullName, setNewFullName] = useState(fullName);
  const [newPublicName, setNewPublicName] = useState(userName);
  const [newBasedIn, setNewBasedIn] = useState(basedIn);
  const [newJobTitle, setNewJobTitle] = useState(jobTitle);
  const [newPhone, setNewPhone] = useState(phone);
  const [prevImg, setPrevImg] = useState<string | ArrayBuffer | null>(null);

  const [EditMode, setEditMode] = useState({
    fullName: false,
    publicName: false,
    basedIn: false,
    jobTitle: false,
    phone: false,
    email: false,
  });

  const toggleEdit = (element: string) => {
    setEditMode((prev) => ({
      ...prev,
      [element as keyof typeof prev]: !prev[element as keyof typeof prev],
    }));
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPrevImg(reader.result);
    };
  };

  const uploadImg = (img: File) => {
    const userId = localStorage.getItem("userId");
    const data = new FormData();
    data.append("avatar", img, img.name);
    if (userId) {
      const userOjbectId = new mongoose.Types.ObjectId(userId);
      dispatch(changeProfilImg({ data, userId: userOjbectId }));
    }
  };

  const handleImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      previewFile(e.target.files[0]);
      uploadImg(e.target.files[0]);
    }
  };

  // Update handlers
  const handleFieldUpdate = async (field: keyof typeof EditMode) => {
    const userId = localStorage.getItem("userId");
    const userOjbectId = new mongoose.Types.ObjectId(userId as string);
    if (userId) {
      await dispatch(updateProfileField({ userId: userOjbectId, field, value: getFieldValue(field) }));
      toggleEdit(field);
    }
  };

  // Get the current value based on the field
  const getFieldValue = (field: keyof typeof EditMode) => {
    switch (field) {
      case "fullName":
        return newFullName;
      case "publicName":
        return newPublicName;
      case "basedIn":
        return newBasedIn;
      case "jobTitle":
        return newJobTitle;
      case "phone":
        return newPhone;
      default:
        return "";
    }
  };

  return (
    <div className="sm:w-72 bg-zinc-950 rounded-2xl m-3 flex flex-col items-center gap-4 p-1 sm:h-screen">
      {/* profile picture */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-950 flex justify-center items-center">
        <img
          src={
            (prevImg as string) ||
            (image ? image : "/assets/images/background-3.jpeg")
          }
          alt="profile-img"
          className="w-full h-full object-cover"
        />
        <label htmlFor="profileImage" className="absolute bottom-0 p-1 rounded-full cursor-pointer">
          <FaCamera className="opacity-0.1 text-zinc-500 hover:text-white" />
        </label>
        <input
          type="file"
          id="profileImage"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImgChange(e)}
        />
      </div>

      {/* Profile Detail */}
      <div className="w-full text-white p-1">
        {/** Full Name */}
        <div className="relative mb-4">
          <h3 className="font-medium text-small">Full Name</h3>
          {EditMode.fullName ? (
            <div>
              <input
                type="text"
                className="mt-1 bg-zinc-800 p-2 w-full rounded"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
              <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => handleFieldUpdate("fullName")}
              >
                <FaCheck />
              </span>
            </div>
          ) : (
            <div>
              <span
                className="absolute top-0 right-0 p-1 cursor-pointer text-white"
                onClick={() => toggleEdit("fullName")}
              >
                <FaEdit />
              </span>
              <p className="text-zinc-600 font-medium p-1">{profile.fullName}</p>
            </div>
          )}
        </div>

        {/* Public Name */}
        <div className="relative mb-4">
          <h3 className="font-medium text-small">Public Name</h3>
          {EditMode.publicName ? (
            <>
              <input
                type="text"
                className="mt-1 bg-zinc-800 p-2 w-full rounded"
                onChange={(e) => setNewPublicName(e.target.value)}
                value={newPublicName}
              />
              <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => handleFieldUpdate("publicName")}
              >
                <FaCheck />
              </span>
            </>
          ) : (
            <>
              <p className="text-zinc-600 font-medium p-1">{profile.userName}</p>
              <span
                className="absolute top-0 right-0 p-1 cursor-pointer"
                onClick={() => toggleEdit("publicName")}
              >
                <FaEdit />
              </span>
            </>
          )}
        </div>

        {/* Based In */}
        <div className="relative mb-4">
          <h3 className="font-medium text-small">Based In</h3>
          {EditMode.basedIn ? (
            <>
              <input
                type="text"
                className="w-full rounded bg-zinc-800 p-2 mt-1"
                onChange={(e) => setNewBasedIn(e.target.value)}
                value={newBasedIn}
              />
              <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => handleFieldUpdate("basedIn")}
              >
                <FaCheck />
              </span>
            </>
          ) : (
            <>
              <p className="text-zinc-600 font-medium p-1">{profile.basedIn}</p>
              <span
                className="absolute top-0 right-0 p-1 cursor-pointer"
                onClick={() => toggleEdit("basedIn")}
              >
                <FaEdit />
              </span>
            </>
          )}
        </div>

        {/* Job Title */}
        <div className="relative mb-4">
          <h3 className="font-medium text-small">Job Title</h3>
          {EditMode.jobTitle ? (
            <>
              <input
                type="text"
                className="bg-zinc-800 w-full rounded p-2 mt-1"
                onChange={(e) => setNewJobTitle(e.target.value)}
                value={newJobTitle}
              />
              <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => handleFieldUpdate("jobTitle")}
              >
                <FaCheck />
              </span>
            </>
          ) : (
            <>
              <p className="text-zinc-600 font-medium p-1">{profile.jobTitle}</p>
              <span
                className="absolute right-0 top-0 cursor-pointer"
                onClick={() => toggleEdit("jobTitle")}
              >
                <FaEdit />
              </span>
            </>
          )}
        </div>

        {/* Contact Details */}
        <div className="w-full bg-zinc-900 rounded p-1">
          <h3 className="font-bold mb-2">Contact Details</h3>
          {/* Phone */}
          <div className="relative mb-4">
            <h3 className="font-medium text-small">Phone</h3>
            {EditMode.phone ? (
              <>
                <input
                  type="text"
                  className="bg-zinc-800 p-2 w-full rounded mt-1"
                  onChange={(e) => setNewPhone(e.target.value)}
                  value={newPhone}
                />
                <span
                  className="absolute right-0 top-0 cursor-pointer"
                  onClick={() => handleFieldUpdate("phone")}
                >
                  <FaCheck />
                </span>
              </>
            ) : (
              <>
                <p className="text-zinc-600 font-medium p-1">{profile.phone}</p>
                <span
                  className="absolute right-0 top-0 cursor-pointer"
                  onClick={() => toggleEdit("phone")}
                >
                  <FaEdit />
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
