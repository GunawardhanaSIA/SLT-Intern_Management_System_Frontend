import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"

//Authentication
import Authentication from "../layout/Authentication"
import Signup from "../pages/authentication/Signup"
import Otp from "../pages/authentication/Otp"
import SignupSuccessful from "../pages/authentication/SignupSuccessful"
import Signin from "../pages/authentication/Signin"
import ThankYouForRegistering from "../pages/authentication/ThankYouForRegistering"

//Intern
import Intern from "../layout/Intern"
import InternDashboard from "../pages/intern/InternDashboard"
import MyProjects from "../pages/intern/MyProjects"

//Admin
import Admin from "../layout/Admin"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UpcomingInterviews from "../pages/admin/UpcomingInterviews"
import NewApplications from "../pages/admin/NewApplications"
import ManageInterns from "../pages/admin/ManageInterns"
import ManageSupervisors from "../pages/admin/ManageSupervisors"
import Reports from "../pages/admin/Reports"
import DailyUpdates from "../pages/intern/DailyUpdates"

//Security
import ProtectedRoute from "../components/ProtectedRoute";

// Supervisor
import Supervisor from "../layout/Supervisor"
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard"
import SupervisorProjects from "../pages/supervisor/SupervisorProjects"
import MyInterns from "../pages/supervisor/MyInterns"
import ForgotPassword from "../pages/authentication/ForgotPassword"
import ResetPassword from "../pages/authentication/ResetPassword"
import ResetPasswordSuccessfull from "../pages/authentication/ResetPasswordSuccessfull"
import Attendance from "../pages/supervisor/Attendance"

// Debug
import DebugPanel from "../components/DebugPanel"



const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
    },
    {
        path: "/authenticate",
        element: <Authentication/>,
        children: [
            {
                path: "/authenticate/signup",
                element: <Signup/>
            },
            {
                path: "/authenticate/confirm-email",
                element: <Otp/>
            },
            {
                path: "/authenticate/signin",
                element: <Signin/>
            },
            {
                path: "/authenticate/thank-you-for-registering",
                element: <ThankYouForRegistering/>
            },
            {
                path: "/authenticate/signup-successful",
                element: <SignupSuccessful/>
            },
            {
                path: "/authenticate/reset-password-step1",
                element: <ForgotPassword/>
            },
            {
                path: "/authenticate/reset-password-step2",
                element: <ResetPassword/>
            },
            {
                path: "/authenticate/reset-password-successful",
                element: <ResetPasswordSuccessfull/>
            }
        ]
    },
    {
        path: "/intern",
        element: (
            <ProtectedRoute requiredRole="Intern">
                <Intern/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/intern",
                element: <InternDashboard/>
            },
            {
                path: "/intern/my-projects",
                element: <MyProjects/>
            },
            {
                path: "/intern/daily-updates",
                element: <DailyUpdates/>
            },

        ]
        
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute requiredRole="Admin">
                <Admin user="admin"/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin",
                element: <AdminDashboard/>
            },
            {
                path: "/admin/new-applications",
                element: <NewApplications/>
            },
            {
                path: "/admin/upcoming-interviews",
                element: <UpcomingInterviews/>
            },
            {
                path: "/admin/manage-interns", 
                element: <ManageInterns/>
            },
            {
                path: "/admin/manage-supervisors",
                element: <ManageSupervisors/>
            },
            {
                path: "/admin/reports",
                element: <Reports/>
            },
        ]
    },
    {
        path: "/supervisor",
        element: (
            <ProtectedRoute requiredRole="Supervisor">
                <Supervisor user="supervisor"/>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/supervisor",
                element: <SupervisorDashboard/>
            },
            {
                path: "/supervisor/projects",
                element: <SupervisorProjects/>
            },
            {
                path: "/supervisor/my-interns",
                element: <MyInterns/>
            },
            {
                path: "/supervisor/attendance",
                element: <Attendance/>
            },
        ]
    },
    {
        path: "/debug",
        element: <DebugPanel/>
    },
])

export default router