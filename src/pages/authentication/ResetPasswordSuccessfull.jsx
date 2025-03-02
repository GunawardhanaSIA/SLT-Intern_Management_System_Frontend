import React from 'react'
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ResetPasswordSuccessfull = () => {
    const navigate = useNavigate();
    
    const handleLogin = () => {
      navigate('/authenticate/signin');
    };
  
    return (
      <div className='flex flex-col'>
        <h1 className='flex text-3xl font-bold justify-center items-center'>Now You can Sign in!</h1>
        <p className='text-gray flex flex-col justify-center text-center mt-1'>
          Please use the new password to sign in to your account.
        </p>
        
        <div className='mt-10 mb-4 flex justify-center w-full'>
              <Button className='bg-blue font-bold text-white mx-6 w-full' type="submit" onPress={handleLogin}>Sign in</Button>
        </div>
      </div>
    )
}

export default ResetPasswordSuccessfull