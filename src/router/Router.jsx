import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"
import Authentication from "../layout/Authentication"
import Signup from "../pages/authentication/Signup"
import Otp from "../pages/authentication/Otp"
import SignupSuccessful from "../pages/authentication/SignupSuccessful"
import Signin from "../pages/authentication/Signin"
import Intern from "../layout/Intern"
import InternDashboard from "../pages/intern/InternDashboard"
import Admin from "../layout/Admin"
import AdminDashboard from "../pages/admin/AdminDashboard"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
        // children: [
        //     {
        //         path: "/",
        //         element: <LandingPage/>
        //     },
        // ]
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
        element: <Intern/>,
        children: [
            {
                path: "/intern",
                element: <InternDashboard/>
            },
        ]
    },
    {
        path: "/admin",
        element: <Admin/>,
        children: [
            {
                path: "/admin",
                element: <AdminDashboard/>
            },
        ]
    },
])

export default router