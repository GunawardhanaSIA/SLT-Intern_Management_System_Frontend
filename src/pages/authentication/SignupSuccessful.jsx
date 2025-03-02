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
      <h1 className='text-3xl font-bold flex justify-center'>Sign-up Successful!</h1>
      <p className='text-gray flex flex-col justify-center text-center mt-1'>
        Please log-in to your account to apply to your internship with SLTMobitel - Digital Platforms
      </p>
      
      <div className='mt-10 mb-4 flex justify-center w-full'>
            <Button className='bg-blue font-bold text-white mx-6 w-full' type="submit" onPress={handleLogin}>Sign in</Button>
      </div>
    </div>
  )
}

export default SignupSuccessful