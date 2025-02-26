import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"

//Authentication
import Authentication from "../layout/Authentication"
import Signup from "../pages/authentication/Signup"
import Otp from "../pages/authentication/Otp"
import SignupSuccessful from "../pages/authentication/SignupSuccessful"
import Signin from "../pages/authentication/Signin"

//Intern
import Intern from "../layout/Intern"
import InternDashboard from "../pages/intern/InternDashboard"
import MyProjects from "../pages/intern/MyProjects"

//Admin
import Admin from "../layout/Admin"
import AdminDashboard from "../pages/admin/AdminDashboard"
import UpcomingInterviews from "../pages/admin/UpcomingInterviews"
import NewApplications from "../pages/admin/NewApplications"
import DailyUpdates from "../pages/intern/DailyUpdates"

//Security
import ProtectedRoute from "../components/ProtectedRoute";

// Supervisor
import Supervisor from "../layout/Supervisor"
import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard"
import SupervisorProjects from "../pages/supervisor/SupervisorProjects"



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
                path: "/authenticate/signup-successful",
                element: <SignupSuccessful/>
            },
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
        ]
    },
])

export default router