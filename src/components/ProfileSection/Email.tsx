import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hooks";
import OtpModal from "./modal/OtpModal";
import { changeEmail } from "../../store/slices/profileSlice";

const Email: React.FC = () => {
  const { email } = useAppSelector((state) => state.profile);
  const [visible, setVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    const response = dispatch(changeEmail({ email: newEmail }));
    if (changeEmail.fulfilled.match(response)) {
      setVisible(true);
    }
  };
  return (
    <>
      <div className="m-3 w-fit rounded-lg p-6 ">
        <h1 className="text-xl font-bold mb-2 text-white">Email</h1>
        <p className="text-sm text-gray-400 mb-4">
          Current email
          <span className="block mt-1 text-white">
            Your current email address is {email}
          </span>
        </p>

        <button className="flex items-center mb-4 px-4 py-2 text-white bg-black border border-gray-600 rounded-lg">
          <span className="mr-2">🌐</span> Log in with Google enabled
        </button>

        <div className="p-4 mb-4 bg-yellow-700 rounded-lg">
          <p className="text-sm font-semibold text-white">
            ⚠️ Connected account
          </p>
          <p className="text-sm text-white">
            Your account is connected to a Google account. Changing the email
            address here will disconnect your account from the Google account.
          </p>
        </div>

        <div className="flex flex-col mb-4">
          <label className="text-lg text-white mb-2" htmlFor="newEmail">
            New Email address
          </label>
          <input
            type="email"
            id="newEmail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-zinc-900 text-white p-2 rounded-lg w-64 mb-4 "
            placeholder="Enter new email address"
          />
          <button
            className="w-24 px-4 py-2 text-white bg-zinc-800 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-4">
          <p>Email notifications</p>
          <p>
            To manage marketing emails, visit the{" "}
            <a href="#" className="text-purple-500 underline">
              email preferences center
            </a>
            .
          </p>
          <p>
            To manage product emails, visit{" "}
            <a href="#" className="text-purple-500 underline">
              product settings
            </a>
            .
          </p>
          <OtpModal visible={visible} setVisible={setVisible} />
        </div>
      </div>
    </>
  );
};

export default Email;
