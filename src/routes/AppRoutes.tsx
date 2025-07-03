import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./protectedRoute/protectedRoute";
import AuthRoute from "./protectedRoute/authRoute";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "../components/loading/Loading";

// ✨ Auth & Public Pages
const Home = lazy(() => import("../pages/Home/Home"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const Login = lazy(() => import("../pages/Login/Login"));
const OtpPage = lazy(() => import("../pages/Otp/Otp"));
const ResetPassword = lazy(
  () => import("../pages/resetPassword/ResetPassword")
);

// ✨ Profile & Standalone Protected Pages
const Profile = lazy(() => import("../pages/profile/Profile"));
const ZegoMeet = lazy(() => import("../components/main/Meet/zego-meet"));

// ✨ Main Dashboard Layout
const Dashboard = lazy(() => import("../pages/Main/Main"));

// ✨ Dashboard Nested Pages
const Overview = lazy(() => import("../components/main/overview/overviewCom"));
const KanbanBoard = lazy(() => import("../components/main/board/Board"));
const Member = lazy(() => import("../components/main/members/Members"));
const Requests = lazy(() => import("../components/main/requets/Requests"));
const Chat = lazy(() => import("../components/main/chat/Chat"));
const Diagram = lazy(() => import("../components/main/diagram/diagram"));
const Meet = lazy(() => import("../components/main/Meet/meet"));
const ApiTests = lazy(() => import("../components/main/apiDoc/apis"));

const AppRoutes: React.FC = () => {
  return (
    <>
      <Toaster />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
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

          {/* Protected Routes */}
          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Overview />} />
              <Route path="overview" element={<Overview />} />
              <Route path="board" element={<KanbanBoard />} />
              <Route path="member" element={<Member />} />
              <Route path="requests" element={<Requests />} />
              <Route path="chats" element={<Chat />} />
              <Route path="diagram" element={<Diagram />} />
              <Route path="meet" element={<Meet />} />
              <Route path="api" element={<ApiTests />} />
            </Route>

            {/* Standalone protected routes */}
            <Route path="/meet-room" element={<ZegoMeet />} />
            <Route path="/Profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
