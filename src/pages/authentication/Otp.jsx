import React, { useState } from 'react'
import { InputOtp, Form, Button } from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const navigate = useNavigate();

  const handleOptSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/verifyOTP", {
        email,
        otp
      });

      if (response.status === 200) {
        console.log(response.data);
        navigate('/authenticate/signup-successful'); 
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Failed to verify OTP. Please try again.");
    }
  }

  return (
    <div>
      <h1 className='text-3xl font-bold flex justify-center'>OTP Verification</h1>
      <p className='text-gray flex flex-col justify-center text-center mt-1'>
        We have sent the verification code to the email 
        <br /><span className='text-blue font-semibold'>{email}</span>
      </p>
      
      <div className='mt-6 mb-4 flex flex-col gap-4'>
        <Form
          className="flex w-full flex-col items-center gap-4"
          validationBehavior="native"
          onSubmit={handleOptSubmit}
        >
          <InputOtp
            isRequired
            errorMessage={
              <span className="text-red text-xs font-light flex justify-center">
                Please enter a valid 4-digit OTP
              </span>
            }
            aria-label="OTP input field"
            length={4}
            name="otp"
            placeholder="Enter code"
            validationBehavior="native"
            size='lg'
            variant='bordered'
            onChange={(e) => setOtp(e.target.value)}  
          />

          {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

          <div className='mt-2 flex flex-col w-full'>
            <Button className='bg-blue font-bold text-white' type="submit">Submit</Button>
            <span className='text-blue font-semibold flex justify-center mt-2 text-sm'>
              <a className='cursor-pointer'>Resend OTP</a>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Otp;