import React from 'react'
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const SignupSuccessful = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/authenticate/signin');
  };

  return (
    <div>
      <h1 className='text-2xl font-semibold flex justify-center'>Registration is complete!</h1>
      <p className='text-gray flex flex-col justify-center text-center mt-6'>
      Thank you for verifying your email. You can now log in to your account.
      </p>
      <div className='flex w-full justify-center items-center mt-6'>
        <Button className='flex w-full bg-blue text-white font-bold' onPress={handleLogin}>Log in</Button>
      </div>
    </div>
  )
}

export default SignupSuccessful