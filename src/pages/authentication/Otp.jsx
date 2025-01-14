import React, { useState } from 'react'
import {InputOtp, Form, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { p } from 'framer-motion/client';

const Otp = () => {
  const [otp, setOtp] = useState("");

  return (
    <div>
      <h1 className='text-3xl font-bold flex justify-center'>OTP Verification</h1>
      <p className='text-gray flex flex-col justify-center text-center mt-1'>We have sent the verification code to the email <br/><span className='text-blue font-semibold'>example@gmail.com</span></p>
      
      <div className='mt-6 mb-4 flex flex-col gap-4'>
        <Form
          className="flex w-full flex-col items-center gap-4"
          validationBehavior="native"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const otp = formData.get("otp");

            setOtp(otp);
          }}
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
          />
          <div className='mt-2 flex flex-col w-full'>
            <Button className='bg-blue font-bold text-white'>Submit</Button>
            <span className='text-blue font-semibold flex justify-center mt-2 text-sm'><a className='cursor-pointer'>Resend OTP</a></span>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Otp