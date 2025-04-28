import React, { useState, useEffect } from 'react'
import {Input, Button, Checkbox} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

// function decodeJWT(token) {
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );
//   return JSON.parse(jsonPayload);
// }

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSignup = () => {
    navigate('/authenticate/signup');
  };

  // const handleForgotPassword = () => {
  //   navigate('/authenticate/reset-password-step1');
  // };

  const handleGoogleSignInSuccess = async (token) => {
    console.log("Google JWT:", token, "Type:", typeof token);
    const decodedToken = jwtDecode(token);
    console.log("Decoded token: ", decodedToken)
    const username = decodedToken.email
    console.log("Decoded email: ", username)

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
      });
      if (response.status === 200) {
        console.log("sign-in response data: ", response.data);
        const responseToken = response.data.jwt
        const decodedResponseToken = jwtDecode(responseToken);
        console.log("Decoded response token: ", decodedResponseToken)
        const role = decodedResponseToken.role
        const user_id = decodedResponseToken.user_id;
        console.log("Signed in user's Role: ", role)
        console.log("Signed in user's user ID: ", user_id)

        // Save the token with expiration time (3 days)
        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 3); // 3 days from now
        localStorage.setItem("token", responseToken);
        localStorage.setItem("tokenExpiration", expirationTime.getTime());

        if (role === "Intern") {
          navigate("/intern");
        } else if (role === "Admin") {
          navigate("/admin/");
        } else if (role === "Supervisor") {
          navigate("/supervisor/");
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to sign in";
      setErrorMessage(message);
      console.error("Signin failed:", error);
    }
  };

  // const handleSignin = async (e) => {
  //   if (!username) {
  //     setErrorMessage("Email is required.");
  //     return;
  //   }
  //   if (!password) {
  //     setErrorMessage("Password is required.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post("http://localhost:8080/login", {
  //       username: username,
  //       password: password
  //     });
  //     console.log("sign-in response data: ", response.data);

  //     const token = response.data.jwt;

  //     const decodedToken = decodeJWT(token);
  //     console.log(decodedToken);
  //     const role = decodedToken.role;
  //     console.log(role);

  //     const user_id = decodedToken.user_id;
  //     const state = decodedToken.user_state; // Get state from decoded token

  //     if (state === 1) {
  //       setErrorMessage("You have not completed signup process successfully");
  //       return; // Stop execution here
  //     }

  //     // Save the token with expiration time (3 days)
  //     const expirationTime = new Date();
  //     expirationTime.setDate(expirationTime.getDate() + 3); // 3 days from now
  //     localStorage.setItem("token", token);
  //     localStorage.setItem("tokenExpiration", expirationTime.getTime());

  //     if (role === "Intern") {
  //       navigate("/intern/");
  //     } else if (role === "Admin") {
  //       navigate("/admin/");
  //     } else if (role === "Supervisor") {
  //       navigate("/supervisor/");
  //     }
  //   } catch (error) {
  //     const message =
  //       error.response?.data?.message || "Incorrect email or password";
  //     setErrorMessage(message);
  //     console.error("Signin failed:", error);
  //   }
  // }

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
      <h1 className='text-4xl flex justify-center'>Let's sign-in</h1>
      
      <div className='mt-6 mb-4 flex  justify-center items-center'>
        {/* <Input 
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
        /> */}
        {/* <Input 
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
        /> */}
      </div>
  
      {/* <div className='flex mt-6 justify-end'> */}
        {/* <Checkbox size="sm"><span className='text-gray' isSelected={rememberMe} onValueChange={setRememberMe}>Remember me</span></Checkbox> */}
        {/* <p className='text-xs font-light cursor-pointer' onClick={handleForgotPassword}>Forgot Password?</p> */}
      {/* </div> */}

      {/* {errorMessage && <p className="flex text-red font-light text-xs mt-4 justify-center">{errorMessage}</p>} */}

      {/* <div className='mt-6'> */}
        {/* <Button className='w-full bg-blue font-bold text-white mb-2' onPress={handleSignin}>Sign in</Button> */}
        <div className='w-full flex justify-center'>
                  <GoogleLogin 
                    onSuccess={credentialResponse => {
                      handleGoogleSignInSuccess(credentialResponse.credential);
                    }}
                    onError={() => {
                      console.log('Sign in Failed');
                      setErrorMessage('Sign in Failed');
                    }}
                    size="large" 
                    width="300" 
                    text="continue_with"
                  />
                </div>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Don't have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleSignup}>Sign up</a></span></p>
      </div>
    // </div>
  )
}

export default Signin