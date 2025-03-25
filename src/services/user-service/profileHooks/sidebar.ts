import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import {
  changeProfilImg,
  updateProfileField,
} from "../../../store/slices/profileSlice";

export const useProfileSidebarLogic = (profile: any) => {
  const dispatch = useAppDispatch();
  const { image, isLoading } = useAppSelector((state) => state.profile);

  const [newFullName, setNewFullName] = useState(profile.fullName);
  const [newUserName, setNewUserName] = useState(profile.userName);
  const [newBasedIn, setNewBasedIn] = useState(profile.basedIn);
  const [newJobTitle, setNewJobTitle] = useState(profile.jobTitle);
  const [newPhone, setNewPhone] = useState(profile.phone);
  const [prevImg, setPrevImg] = useState<string | ArrayBuffer | null>(null);

  const [EditMode, setEditMode] = useState({
    fullName: false,
    userName: false,
    basedIn: false,
    jobTitle: false,
    phone: false,
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
    console.log(img,"image")
    data.append("avatar", img, img.name);
    if (userId) {
      dispatch(changeProfilImg({ data, userId }));
    }
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      previewFile(e.target.files[0]);
      uploadImg(e.target.files[0]);
    }
  };

  const handleFieldUpdate = async (field: keyof typeof EditMode) => {
    dispatch(updateProfileField({ field, value: getFieldValue(field) }));
    toggleEdit(field);
  };

  const getFieldValue = (field: keyof typeof EditMode) => {
    switch (field) {
      case "fullName":
        return newFullName;
      case "userName":
        return newUserName;
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

  return {
    prevImg,
    image,
    EditMode,
    isLoading,
    newFullName,
    newUserName,
    newBasedIn,
    newJobTitle,
    newPhone,
    setNewFullName,
    setNewUserName,
    setNewBasedIn,
    setNewJobTitle,
    setNewPhone,
    toggleEdit,
    handleImgChange,
    handleFieldUpdate,
  };
};
