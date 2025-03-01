import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import AuthRoute from "./protectedRoute/authRoute";
import Requests from "../components/main/requets/Requests";
import Chat from "../components/main/chat/Chat";
import Diagram from "../components/main/diagram/diagram";
import ZegoMeet from "../components/main/Meet/zego-meet";
import Meet from "../components/main/Meet/meet";
import ApiTests from "../components/main/apiDoc/apis";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/loading/Loading";
import { ResetPassword } from "../pages/resetPassword/ResetPassword";
// import ApiDoc from "../components/main/apiDoc/apis";

const Home = lazy(() => import("../pages/Home/Home"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const Login = lazy(() => import("../pages/Login/Login"));
const OtpPage = lazy(() => import("../pages/Otp/Otp"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const KanbanBoard = lazy(() => import("../components/main/board/Board"));
const Member = lazy(() => import("../components/main/members/Members"));
const Overview = lazy(() => import("../components/main/overview/overviewCom"));
const Dashboard = lazy(() => import("../pages/Main/Main"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <AuthRoute>
              <OtpPage />
            </AuthRoute>
          }
        />
        <Route
          path="/changePassword/:token"
          element={
            <AuthRoute>
              <ResetPassword />
            </AuthRoute>
          }
        />

        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="overview" element={<Overview />} />
            <Route path="board" element={<KanbanBoard />} />
            <Route path="member" element={<Member />} />
            <Route path="requests" element={<Requests />} />
            <Route path="chats" element={<Chat />} />
            <Route path="diagram" element={<Diagram />} />
            <Route path="meet" element={<Meet />} />
            <Route path="api" element={<ApiTests />} />
            <Route path="" element={<Overview />} />
          </Route>
          <Route path="/meet-room" element={<ZegoMeet />} />
          <Route path="/Profile" element={<Profile />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
