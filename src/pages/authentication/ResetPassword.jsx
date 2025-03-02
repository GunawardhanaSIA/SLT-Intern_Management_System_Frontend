import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisible1, setIsVisible1] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility1 = () => setIsVisible1(!isVisible1);

    const handleResetPassword = async () => {
        console.log(email)

        if (!otp || !password || !reEnterPassword) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (password !== reEnterPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/verifyOTP", {
              email,
              otp
            });
      
            if (response.status === 200) {
                console.log(response.data);
                navigate('/authenticate/reset-password-successful'); 

                try {
                    const savepassword = await axios.put("http://localhost:8080/resetPassword", {
                    username: email,
                    password: password
                    });

                    if (savepassword.ok) {
                        navigate('/authenticate/reset-password-successful'); 
                    }else {
                        setErrorMessage("Failed to reset password. Please try again.");
                    }
                } catch (error) {
                    console.error("Failed to reset password:", error);
                    setErrorMessage("Failed to reset password. Please try again.");
                }
            } else {
              setErrorMessage("Invalid OTP. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying OTP:", error);
            setErrorMessage("Failed to verify OTP. Please try again.");
        }
    };
    
    return (
        <div>
          <h1 className='text-3xl font-bold flex justify-center'>Reset Your Password</h1>
          <p className='text-gray flex text-center mt-1'>To reset your password, enter the verification code sent to your email with new password.</p>
          
          <div className='mt-6 mb-4 flex flex-col gap-4'>
            <Input 
                variant='bordered' 
                size='md' 
                labelPlacement='outside' 
                label={
                    <span>
                    Verification Code<span className='text-red'> *</span>
                    </span>
                } 
                placeholder="Enter the verification code" 
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <Input 
                variant='bordered' 
                size='md' 
                labelPlacement='outside' 
                label={
                    <span>
                    New Password<span className='text-red'> *</span>
                    </span>
                } 
                placeholder="Enter the new password" 
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
                placeholder="Re-enter the password" 
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
    
          <div className='mt-8'>
            <Button className='w-full bg-blue font-bold text-white' onClick={handleResetPassword}>Reset Password</Button>
          </div>
        </div>
    )
}

export default ResetPassword