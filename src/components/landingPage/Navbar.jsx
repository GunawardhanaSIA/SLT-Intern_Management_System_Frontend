import React from 'react'
import {Button} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };


  return (
    <div className="navbar bg-base-100 px-8">
        <div className="navbar-start">
            <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </div>
            </div>
            <a href='/'><img src="logo.png" className='w-36' alt="logo" /></a>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end">
            <Button className="bg-blue font-bold text-white" onPress={handleLogout}>
                Log in
            </Button>
        </div>
    </div>
  )
}

export default Navbar