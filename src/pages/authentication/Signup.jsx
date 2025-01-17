import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisible1, setIsVisible1] = React.useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility1 = () => setIsVisible1(!isVisible1);

    const handleLogin = () => {
      navigate('/authenticate/signin');
    };

    const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

    const handleSignUp = async () => {
        // Validate fields
        if (!username || !password || !reEnterPassword) {
          setErrorMessage("All fields are required.");
          return;
        }
    
        // Validate password match
        if (password !== reEnterPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }
    
        try {
          const response = await axios.post("http://localhost:8080/signup", {
            username,
            password,
            role: "Intern"
          });
          console.log(response.data);

          if (response.status === 200) {
            setSuccessMessage("Registration successful. Please check your email to confirm.");
            setTimeout(() => {
              navigate(`/authenticate/confirm-email?email=${username}`);
            }, 2000);

            const otp = generateOTP();
            console.log(otp);

            const emailData = {
              send_to: username,
              message: otp,
            };

            const emailResponse = await emailjs.send(
              import.meta.env.VITE_EMAILJS_SERVICE_ID,
              import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID,
              emailData,
              import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            if (emailResponse.status === 200) {
              console.log("OTP email sent successfully:", emailResponse);

              const otpStoreResponse = await axios.post("http://localhost:8080/storeOTP", {
                email: username,
                otp: otp
              });

              if (otpStoreResponse.status === 201) {
                  console.log("OTP stored successfully on backend.");
              } else {
                  console.error("Failed to store OTP on backend:", otpStoreResponse);
                  setErrorMessage("Failed to store OTP. Please try again.");
              }
            }  
          } else {
            console.error("Failed to send OTP email:", emailResponse);
            setErrorMessage("Failed to send OTP. Please try again.");
            return;
          }
        } catch (error) {
          console.log("Signup failed:", error);
        }
    };


  return (
    <div>
      <h1 className='text-3xl font-bold flex justify-center'>Let’s get started</h1>
      <p className='text-gray flex text-center mt-1'>Create your account to apply for internships with <br/>SLTMobitel - Digital Platforms</p>
      
      <div className='mt-6 mb-4 flex flex-col gap-4'>
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
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
        />
        <Input 
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
        />
      </div>
  
      {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

      <div className='mt-4'>
        <Button className='w-full bg-blue font-bold text-white' onPress={handleSignUp}>Sign up</Button>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Already have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleLogin}>Log in</a></span></p>
      </div>
    </div>
  )
}

export default Signup