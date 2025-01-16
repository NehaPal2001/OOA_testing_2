import { createBrowserRouter } from "react-router-dom";
import HRDashboard from "../pages/adminSide/HRDashboard";
import LoginHR from "../pages/adminSide/LoginHR";
import NotFound from "../pages/adminSide/NotFound";
import PasswordChange from "../pages/adminSide/PasswordChange";
import CandidateDashboard from "@/pages/candidateSide/CandidateDashboard";
import VerificationPage from "@/pages/candidateSide/VerificationPage";
import AssessmentPage from "@/pages/candidateSide/Assessment/AssessmentPage";
import ProctorRoom from "@/pages/adminSide/ProctorRoom";
import TestAttemptsPage from "@/pages/adminSide/Response/TestAttemptsPage";

const RouterComponent = createBrowserRouter([
  {
    path: "/hr-dashboard",
    element: <HRDashboard />,
  },
  {
    path: "/login",
    element: <LoginHR />,
  },
  {
    path: "/change-password",
    element: <PasswordChange />,
  },
  {
    path: "/candidate-dashboard",
    element: <CandidateDashboard />,
  },
  {
    path: "/proctor/room/:roomId",
    element: <ProctorRoom />,
  },
  {
    path: "/verify/:token",
    element: <VerificationPage />,
  },
  {
    path: "/assessment/:assessmentId",
    element: <AssessmentPage />,
  },
  {
    path: "/response/:candidateId",
    element: <TestAttemptsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default RouterComponent;
