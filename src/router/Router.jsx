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

//Admin
import Admin from "../layout/Admin"
import AdminDashboard from "../pages/admin/AdminDashboard"

//Security
import ProtectedRoute from "../components/ProtectedRoute";



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
        ]
    },
])

export default router