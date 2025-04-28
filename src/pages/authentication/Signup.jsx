import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisible1, setIsVisible1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // const toggleVisibility = () => setIsVisible(!isVisible);
    // const toggleVisibility1 = () => setIsVisible1(!isVisible1);

    const handleLogin = () => {
      navigate('/authenticate/signin');
    };

    // const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

    // const handleSignUp = async () => {
    //     Validate fields
    //     if (!username) {
    //       setErrorMessage("Username is required.");
    //       return;
    //     }
    
    //     Validate password match
    //     if (password !== reEnterPassword) {
    //       setErrorMessage("Passwords do not match.");
    //       return;
    //     }
    
    //     try {
    //       const response = await axios.post("http://localhost:8080/signup", {
    //         username,
    //         password,
    //         role: "Intern"
    //       });
    //       console.log("jwt token: ", response.data);

    //       if (response.status === 200) {
    //         setSuccessMessage("Registration successful. Please check your email to confirm.");
    //         setTimeout(() => {
    //           navigate(`/authenticate/confirm-email?email=${username}`);
    //         }, 2000);

    //         const otp = generateOTP();
    //         console.log(otp);

    //         const emailData = {
    //           send_to: username,
    //           message: otp,
    //         };

    //         const emailResponse = await emailjs.send(
    //           import.meta.env.VITE_EMAILJS_SERVICE_ID,
    //           import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID,
    //           emailData,
    //           import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    //         );

    //         if (emailResponse.status === 200) {
    //           console.log("OTP email sent successfully:", emailResponse);

    //           const otpStoreResponse = await axios.post("http://localhost:8080/storeOTP", {
    //             email: username,
    //             otp: otp
    //           });

    //           if (otpStoreResponse.status === 201) {
    //               console.log("OTP stored successfully on backend.");
    //           } else {
    //               console.error("Failed to store OTP on backend:", otpStoreResponse);
    //               setErrorMessage("Failed to store OTP. Please try again.");
    //           }
    //         }  
    //       } else {
    //         console.error("Failed to send OTP email:", emailResponse);
    //         setErrorMessage("Failed to send OTP. Please try again.");
    //         return;
    //       }
    //     } catch (error) {
    //       console.log("Signup failed:", error);
    //     }
    // };

    const handleGoogleSignUpSuccess = async (token) => {
      console.log("Google JWT:", token);
      const decodedToken = jwtDecode(token);
      console.log("Decoded token: ", decodedToken)
      const username = decodedToken.email
      console.log("Decoded email: ", username)

      try {
        const response = await axios.post("http://localhost:8080/signup", {
          username,
          role: "Intern"
        });
        if (response.status === 200) {
          console.log("sign-up response data: ", response.data);
          const responseToken = response.data.jwt
          const decodedResponseToken = jwtDecode(responseToken);
          console.log("Decoded response token: ", decodedResponseToken)
          const user_id = decodedResponseToken.user_id;
          console.log("Signed up intern's user ID: ", user_id)
          
          // Save the token with expiration time (3 days)
          const expirationTime = new Date();
          expirationTime.setDate(expirationTime.getDate() + 3); // 3 days from now
          localStorage.setItem("token", responseToken);
          localStorage.setItem("tokenExpiration", expirationTime.getTime());

          navigate("/intern");
        }
      } catch (error) {
        console.log("Signup failed:", error);
      }
    };


  return (
    <div>
      <h1 className='text-4xl flex justify-center'>Let’s get started</h1>
      {/* <p className='text-gray flex w-full justify-center items-center mt-4'>Create your account to apply for internships with SLTMobitel - Digital Platforms</p> */}
      
      <div className='mt-6 mb-4 flex  justify-center items-center '>
        {/* <Input 
        className='w-96 flex justify-center items-center'
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
                Email<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Enter your gmail" 
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        /> */}
        {/* <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
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
        {/* <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
                Re-enter Password<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Re-enter your password" 
            type={isVisible1 ? "text" : "password"}
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
            endContent={
                <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility1}
                >
                {isVisible1 ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                )}
                </button>
            }
        /> */}
      </div>
  
      {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

      <div className='mt-4 flex justify-center items-center flex-col'>
        {/* <Button className='w-96 bg-blue font-bold text-white mb-2' onPress={handleSignUp}>Continue</Button> */}
        <div className='w-full flex justify-center'>
          <GoogleLogin 
            onSuccess={credentialResponse => {
              handleGoogleSignUpSuccess(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Sign up Failed');
              setErrorMessage("Sign up failed")
            }}
            size="large" 
            width="300" 
            text="continue_with"
            pr
          />
        </div>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Already have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleLogin}>Sign in</a></span></p>
      </div>
    </div>
  )
}

export default Signup