import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

    const handleForgotPassword = async () => {
        setErrorMessage('');
        try {
            const response = await axios.post("http://localhost:8080/verifyEmail", { 
                username: email 
            });
            console.log(response)
            if (response.status === 200) {
                navigate(`/authenticate/reset-password-step2?email=${email}`);

                const otp = generateOTP();
                console.log(otp);

                const emailData = {
                    send_to: email,
                    message: otp,
                };

                console.log(emailData)

                const emailResponse = await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_OTP_TEMPLATE_ID,
                    emailData,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );

                if (emailResponse.status === 200) {
                    console.log("OTP email sent successfully:", emailResponse);
      
                    const otpStoreResponse = await axios.post("http://localhost:8080/storeOTP", {
                      email: email,
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
                setErrorMessage("Email not found. Please check and try again.");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Try again later.");
        }
    };

    return (
        <div>
            <h1 className='text-3xl font-bold flex justify-center'>Forgot Password?</h1>
            <p className='text-gray flex text-center mt-1'>Enter the email associated with your account and we will send you a verification code.</p>
            
            <div className='mt-6 mb-4 flex flex-col gap-4'>
                <Input 
                    variant='bordered' 
                    size='md' 
                    labelPlacement='outside' 
                    label={<span>Username<span className='text-red'> *</span></span>} 
                    placeholder="Enter your email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
        
            {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

            <div className='mt-8'>
                <Button className='w-full bg-blue font-bold text-white' onClick={handleForgotPassword}>Confirm Email</Button>
                <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Back to <span className='text-blue font-semibold'><a className='cursor-pointer'>Log in</a></span></p>
            </div>
        </div>
    );
};

export default ForgotPassword;
