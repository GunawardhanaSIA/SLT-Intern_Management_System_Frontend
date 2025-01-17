import React, { useState, useEffect } from 'react'
import {Input, Button, Checkbox} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignup = () => {
    navigate('/authenticate/signup');
  };

  const handleSignin = async (e) => {
    if (!username) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: username,
        password: password
      });
      console.log(response.data);

      const token = response.data.jwt;

      const decodedToken = decodeJWT(token);
      console.log(decodedToken);
      const role = decodedToken.role;
      console.log(role);

      const user_id = decodedToken.user_id;

      // Save the token with expiration time (3 days)
      const expirationTime = new Date();
      expirationTime.setDate(expirationTime.getDate() + 3); // 3 days from now
      localStorage.setItem("token", token);
      localStorage.setItem("tokenExpiration", expirationTime.getTime());

      if (role === "Intern") {
        navigate("/intern/");
      } else if (role === "Admin") {
        navigate("/admin/");
      } else if (role === "Supervisor") {
        navigate("/supervisor/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Incorrect email or password";
      setErrorMessage(message);
      console.error("Signin failed:", error);
    }
  }

  useEffect(() => {
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    if (tokenExpiration) {
      const now = new Date().getTime();
      if (now > tokenExpiration) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
      }
    }
  }, []);

  return (
    <div>
      <h1 className='text-3xl font-bold flex justify-center'>Sign-in to Your Account</h1>
      
      <div className='mt-12 mb-4 flex flex-col gap-6'>
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span className='font-semibold'>
                Username<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Enter your email" 
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span className='font-semibold'>
                Password<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Enter your password" 
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
                <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                >
                {isVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                )}
                </button>
            }
        />
      </div>
  
      <div className='flex mt-6 justify-between'>
        <Checkbox size="sm"><span className='text-gray'>Remember me</span></Checkbox>
        <p className='text-xs font-light cursor-pointer'>Forgot Password?</p>
      </div>

      {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

      <div className='mt-6'>
        <Button className='w-full bg-blue font-bold text-white' onPress={handleSignin}>Sign in</Button>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Don't have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleSignup}>Sign up</a></span></p>
      </div>
    </div>
  )
}

export default Signin