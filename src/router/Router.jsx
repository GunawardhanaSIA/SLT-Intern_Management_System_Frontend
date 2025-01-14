import { createBrowserRouter } from "react-router-dom"
import Main from "../layout/Main"
import Authentication from "../layout/Authentication"
import Signup from "../pages/authentication/Signup"
import Login from "../pages/authentication/Login"
import Otp from "../pages/authentication/Otp"

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
                path: "/authenticate/login",
                element: <Login/>
            },
        ]
    },
])

export default router